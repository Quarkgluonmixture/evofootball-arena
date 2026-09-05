/**
 * ⭐⭐ BN-C0 — 「弹回」 THE BOUNCE CENSUS
 * (docs/world-model/BN-C0-BOUNCE-CENSUS.md).
 *
 * Authorized by COMMANDER RULING #381 item 6. Lineage: PT-C0 (the play-test forensic census —
 * its POPULATION, its `ball.lastTouch` FIRST-BODY channel and its sector read are reused byte
 * for byte) → the RC arc → RC-T1b (FAIL: the third sentence is NOT a readiness/sector problem)
 * → this census.
 *
 * THE QUESTION: when a ground pass meets one of OUR OWN bodies and we do not come away with
 * it, what did the ENGINE do? The census defines the user's event honestly, partitions every
 * such event BY THE ENGINE'S OWN LEDGER (the contest episodes, `ball.lastTouch`,
 * `pendingControl`'s own resolution), and prints ONE frozen sentence naming which repair step
 * the third sentence belongs to.
 *
 * ⛔ THIS IS A CENSUS. It publishes MEASUREMENTS. It scores no hypothesis and arms no
 * mechanism. The FIVE READ SENTENCES are frozen literals selected by STORED majority booleans.
 * ⛔ X-SRC-ZERO: no file under `src/` is created or edited. The probe CALLS shipped exports and
 * reads public `Match` state per tick; the contest-episode ledger is READ, never re-implemented.
 * ⛔ WORLD 12 IS UNTOUCHED.
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
  CONTROL_RADIUS, CONTROL_MAX_SPEED, GK_CONTROL_MAX_SPEED, CONTACT_CONTROL_DELAY_TICKS,
  DT, GRAVITY,
} from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, raArmedVersion,
  loadL3Dose, loadPcDose, pcDoseGuard,
  RA_WORLD_VERSION, type L3DoseCell, type PcDoseTable,
} from '../../src/game/a4World';
import {
  ballAccessGeometry, type BodySector, type ContestEpisode, type ContestContactKind,
  type ContestOrigin,
} from '../../src/sim/physical';
import { DV_CORRIDOR_SCALE, DV_CLEAR_RADIUS } from '../../src/ai/deliveryValueSeat';
import { closestPointOnSegment } from '../../src/utils/vec';
import { randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE — no bypass (the PT-C0 §1 form)                         */
/* ========================================================================== */
const ENV_WHITELIST = ['BNC0_MODE', 'BNC0_N', 'BNC0_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('BNC0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`BN-C0 FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.BNC0_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('BN-C0 FATAL — BNC0_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.BNC0_N !== undefined ? Number(process.env.BNC0_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('BN-C0 FATAL — BNC0_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.BNC0_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`BNC0_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`BNC0_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`BNC0_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/bn-c0-bounce-census.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/bn-c0-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('BN-C0 FATAL — an override run may never write the canonical artifact path');
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
const signedBinOf = (v: number, width: number, n: number): number => {
  const half = Math.floor(n / 2);
  const i = half + Math.round(v / width);
  return i < 0 ? 0 : i >= n ? n - 1 : i;
};
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
   canon, VERBATIM: "a src-extracted constant pins its extraction to the NAMED call site —
   anchored match + line receipt — never first-occurrence" (home: BK-C0-BODYBALL-CENSUS.md
   §COMMANDER CORRECTIONS item 1, ruling #306 item 4)                                        */
/* ========================================================================== */
const MATCH_PATH = 'src/sim/Match.ts';
const CONST_PATH = 'src/sim/constants.ts';
const PHYS_PATH = 'src/sim/physical.ts';
const PLAYER_PATH = 'src/sim/Player.ts';
const TYPES_PATH = 'src/sim/types.ts';
const A4_PATH = 'src/game/a4World.ts';
const MECH_PATH = 'src/sim/mechanics.ts';
const DV_PATH = 'src/ai/deliveryValueSeat.ts';
const PERC_PATH = 'src/ai/perception.ts';
const VEC_PATH = 'src/utils/vec.ts';
const PCLAT_PATH = 'src/ai/pcLatency.ts';
const RAT1B_PATH = 'scripts/probes/ra-t1b-access-exam.ts';
const PTC0_PATH = 'scripts/probes/pt-c0-playtest-forensic-census.ts';
const SRC_OF: Record<string, string> = {};
for (const p of [MATCH_PATH, CONST_PATH, PHYS_PATH, PLAYER_PATH, TYPES_PATH, A4_PATH,
  MECH_PATH, DV_PATH, PERC_PATH, VEC_PATH, PCLAT_PATH, RAT1B_PATH, PTC0_PATH]) {
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

/* ⭐⭐ THE CONTEST-EPISODE LEDGER — the record this census READS, never re-implements */
anchor('⭐⭐ the ledger DOOR on the constructor config (observation only)', MATCH_PATH,
  '  traceContests?: boolean;', 1);
anchor('⭐⭐ the ledger flag FIELD', MATCH_PATH, '  private readonly traceContests: boolean;', 1);
anchor('⭐⭐ the flag is OFF by default and set ONLY from cfg', MATCH_PATH,
  '    this.traceContests = cfg.traceContests ?? false;', 1);
anchor('⭐⭐ the PUBLIC ledger array this census reads', MATCH_PATH,
  '  readonly contestEpisodes: ContestEpisode[] = [];', 1);
anchor('⭐⭐ the ONE writer — a PASSIVE ledger write, never read by contact/control decisions',
  MATCH_PATH, '  private traceContact(', 1);
anchor('⭐⭐ THE BYTE-INERTNESS LINE: the flag only RECORDS — the early return is the whole branch',
  MATCH_PATH, '    if (!this.traceContests) return;', 1);
anchor('⭐ traceContact call site 1/3 — an APPLIED BODY STRIKE is recorded as kind `body`',
  MATCH_PATH, "    this.traceContact(allClaims, p, 'body');", 1);
anchor('⭐ traceContact call site 2/3 — `controlAttempt`', MATCH_PATH,
  "    this.traceContact(allClaims, p, 'controlAttempt');", 1);
anchor('⭐ traceContact call site 3/3 — `deflection`', MATCH_PATH,
  "          this.traceContact(claims, p, 'deflection');", 1);
anchor('⭐⭐ the ContestContactKind VOCABULARY, read off its own union', PHYS_PATH,
  "export type ContestContactKind = 'controlAttempt' | 'poke' | 'deflection' | 'header' | 'body';",
  1);
anchor('⭐ the ContestOrigin union', PHYS_PATH, 'export type ContestOrigin =', 1);
anchor('⭐ the ContestContact record shape (tick · gid · side · kind · ballModeAfter)',
  PHYS_PATH, 'export interface ContestContact {', 1);
anchor('⭐ the ContestEpisode record shape', PHYS_PATH, 'export interface ContestEpisode {', 1);
/* ⭐⭐ THE CLAIM BUILDER — the three-way maxSpeed branch and the kind it decides */
anchor('⭐⭐ THE MAXSPEED BRANCH, VERBATIM — the `24` literal is anchored AT THIS SITE and '
  + 'nowhere else', MATCH_PATH,
  "      const maxSpeed = p.role === 'GK' ? GK_CONTROL_MAX_SPEED : intended ? 24 : CONTROL_MAX_SPEED;",
  1, 24);
anchor('⭐⭐ THE KIND the claim builder decides from that branch', MATCH_PATH,
  "      const kind = speed <= maxSpeed ? 'controlAttempt' : deflectable ? 'deflection' : null;",
  1);
anchor('⭐⭐ the `intended` test the branch reads (the pending pass\'s own target)', MATCH_PATH,
  '      const intended =\n'
  + '        this.pendingPass !== null &&\n'
  + '        this.pendingPass.targetGid === p.gid &&\n'
  + '        this.pendingPass.side === p.side;\n'
  + "      const maxSpeed = p.role === 'GK'", 1);
/* ⭐⭐ THE SETTLE WINDOW K — READ OFF THE CONTROL-ATTEMPT LAW'S OWN readyTick FORM */
anchor('⭐⭐ THE readyTick FORM — `this.stepCount + CONTACT_CONTROL_DELAY_TICKS`. It is a '
  + 'CONSTANT offset, NOT a function of `relativeSpeed` (which the same object stores beside '
  + 'it), so K is one number for every contact', MATCH_PATH,
  '      readyTick: this.stepCount + CONTACT_CONTROL_DELAY_TICKS,', 1);
anchor('⭐⭐ K ITSELF — the engine\'s own constant, the ONLY source of the settle window',
  CONST_PATH, 'export const CONTACT_CONTROL_DELAY_TICKS = 3;', 1, CONTACT_CONTROL_DELAY_TICKS);
anchor('⭐ the PendingControlAttempt record shape (gid · readyTick · relativeSpeed · '
  + 'incomingDir)', MATCH_PATH, 'interface PendingControlAttempt {', 1);
anchor('⭐⭐ the RESOLUTION at readyTick — the engine\'s own success path is `giveBall`',
  MATCH_PATH, '    if (clean) this.giveBall(p);', 1);
anchor('⭐ the resolver\'s own gate (`stepCount < readyTick` ⇒ nothing happens)', MATCH_PATH,
  '    if (attempt === null || this.stepCount < attempt.readyTick) return false;', 1);
anchor('⭐ simTick IS stepCount — the tick the ledger stamps is the tick the probe reads',
  MATCH_PATH, '  get simTick(): number { return this.stepCount; }', 1);
/* ⭐⭐ THE MAXSPEED CONSTANTS */
anchor('CONTROL_MAX_SPEED', CONST_PATH, 'export const CONTROL_MAX_SPEED = 14;', 1,
  CONTROL_MAX_SPEED);
anchor('GK_CONTROL_MAX_SPEED', CONST_PATH, 'export const GK_CONTROL_MAX_SPEED = 23;', 1,
  GK_CONTROL_MAX_SPEED);
anchor('CONTROL_RADIUS — the reach the sector classifier is called at', CONST_PATH,
  'export const CONTROL_RADIUS = ', 1, CONTROL_RADIUS);
anchor('GRAVITY — the ground-launch test\'s own vz correction', CONST_PATH,
  'export const GRAVITY = 9.81;', 1, GRAVITY);
/* ⭐⭐ PT-C0's POPULATION AND FIRST-BODY CHANNEL, REUSED BYTE FOR BYTE */
anchor('⭐⭐ PT-C0\'s (= RA-T1B\'s) `isMeasurableGroundPass` — THE POPULATION, verbatim',
  RAT1B_PATH,
  'const isMeasurableGroundPass = (k: Klass, ground: boolean, hasTarget: boolean): boolean =>\n'
  + "  ground && hasTarget && (k === 'shortPass' || k === 'throughBall' || k === 'cutback');", 1);
anchor('⭐⭐ RA-T1B\'s `isGroundLaunch`, verbatim', RAT1B_PATH,
  'const isGroundLaunch = (grounded: boolean, vzAfterGravity: number): boolean =>\n'
  + '  grounded || !(vzAfterGravity > 0);', 1);
anchor('⭐ RA-T1B\'s own klass ladder (the delivery classifier), verbatim', RAT1B_PATH,
  '  if (d.passes > 0 && klass === null) {\n'
  + "    klass = d.crosses > 0 ? 'cross'\n"
  + "      : d.cutbacks > 0 ? 'cutback'\n"
  + "        : d.throughBalls > 0 ? 'throughBall'\n"
  + "          : d.longBalls > 0 ? 'loftedPass' : 'shortPass';\n"
  + '  }', 1);
anchor('⭐⭐ THE FIRST-BODY CHANNEL — the FOUR honest `ball.lastTouch = p;` assignment sites '
  + '(the two shipped control/deflection ones and the contact law\'s own two). PT-C0\'s pin, '
  + 'recounted here', MATCH_PATH, '    ball.lastTouch = p;', 4);
anchor('⭐⭐ PT-C0\'s own first-body CLASS ladder, verbatim (the classes reused)', PTC0_PATH,
  "const contactClassOf = (\n"
  + '  contactGid: number | null, targetGid: number, contactSide: Side | null, passerSide: Side,\n'
  + "): ContactClass => (contactGid === null || contactSide === null ? 'none'\n"
  + "  : contactGid === targetGid ? 'ownTarget'\n"
  + "    : contactSide === passerSide ? 'ownNonTarget' : 'opponent');", 1);
anchor('⭐⭐ PT-C0\'s own REBOUND sign (「弹回」 as PT-C0 defined it), verbatim — published '
  + 'BESIDE, never pooled (PT-C0 HONEST LIMIT 2)', PTC0_PATH,
  'const isReboundOf = (alongLaunch: number): boolean => alongLaunch < 0;', 1);
/* ⭐⭐ THE SECTOR — the law's OWN classifier, CALLED */
anchor('⭐⭐ THE BodySector union', PHYS_PATH,
  "export type BodySector = 'front' | 'side' | 'back';", 1);
anchor('⭐⭐ THE LAW\'S OWN SECTOR CLASSIFIER — its SQRT1_2 cones, verbatim (CALLED, never '
  + 're-implemented; the SAME 45° cone the front-on read below uses)', PHYS_PATH,
  '  const sector: BodySector = facingCos >= Math.SQRT1_2\n'
  + "    ? 'front'\n"
  + '    : facingCos <= -Math.SQRT1_2\n'
  + "      ? 'back'\n"
  + "      : 'side';", 1);
anchor('⭐ the classifier\'s own entry point', PHYS_PATH, 'export function ballAccessGeometry(',
  1);
anchor('⭐ the EXTERNAL body direction the classifier reads', PLAYER_PATH,
  '  get bodyDir(): Readonly<V2> {', 1);
anchor('⭐ `registerPass`\'s own `pendingPass` — the intended-target record', MECH_PATH,
  '  match.pendingPass = {', 1);
/* ⭐⭐ THE CORRIDOR GEOMETRY — laneOpenness's own, through the DV seat's frozen constants */
anchor('⭐⭐ THE CORRIDOR SCALE — `laneOpenness`\'s OWN metre normalizer, the engine\'s '
  + 'standing answer to "how many metres off a passing lane before a defender is irrelevant"',
  DV_PATH, 'export const DV_CORRIDOR_SCALE = 4;', 1, DV_CORRIDOR_SCALE);
anchor('⭐⭐ THE CLEAR-THE-KICKER RADIUS — `laneOpenness`\'s OWN guard', DV_PATH,
  'export const DV_CLEAR_RADIUS = 1.5;', 1, DV_CLEAR_RADIUS);
anchor('⭐ `laneOpenness`\'s own normalizer line in the perception source (the scale\'s home)',
  PERC_PATH, 'worst = Math.min(worst, clamp01(d / 4));', 1);
anchor('⭐ the corridor loop\'s own geometry helper, CALLED', VEC_PATH,
  'export const closestPointOnSegment = (a: V2, b: V2, p: V2): V2 => {', 1);
anchor('⭐ the shipped corridor loop this census\'s membership test mirrors — the NAMED site '
  + 'is `flightExposure`\'s, pinned by its own following guard line so the OTHER site (the BK '
  + 'shell loop) can never be mistaken for it', DV_PATH,
  '    const cp = closestPointOnSegment(from as V2, aim as V2, o.pos);\n'
  + "    // GUARD (laneOpenness's own, verbatim): the kick clears a body at the passer's feet.\n"
  + '    if (dist(cp, from as V2) < DV_CLEAR_RADIUS) continue;', 1);
anchor('⭐ the SAME corridor expression, BOTH occurrences ENUMERATED (canon: a seam-map gate '
  + 'pins occurrence COUNTS per needle and enumerates EVERY occurrence\'s site) — '
  + '`flightExposure` and the BK shell loop', DV_PATH,
  'const cp = closestPointOnSegment(from as V2, aim as V2, o.pos);', 2);
/* ⭐ THE PC HOLD — a PURE read, never `holdFor` (which prunes) */
anchor('⭐⭐ the PC seat\'s READ-ONLY hold view (instruments only) — the pure channel this '
  + 'census uses; ⛔ `holdFor` is NOT called because it DELETES expired entries', PCLAT_PATH,
  '  holdSnapshot(): { gid: number; hold: PcHold }[] {', 1);
anchor('⭐ the hold\'s own liveness rule, verbatim ("live while `simTick < untilTick`")',
  PCLAT_PATH, '  /** The hold is live while `simTick < untilTick`. */\n  untilTick: number;', 1);
anchor('⭐ the engine\'s OWN liveness read of the same map (the rule this census mirrors)',
  MATCH_PATH, '        && this.pcLatency.holdFor(p.gid, this.stepCount) !== null;', 1);
/* ⭐ THE ARMS' OWN COMPOSITION LINES, CALLED never copied */
anchor('⭐ WORLD 12\'s flag composition — world 11 CALLED, plus RA_WORLD_DOORS', A4_PATH,
  '    return { ...a4MatchFlags(CORRIDOR_WORLD_VERSION), ...RA_WORLD_DOORS };', 1,
  RA_WORLD_VERSION);
anchor('⭐⭐ the DOSE ARGUMENT is IGNORED for worlds 11/12 by construction (PT-C0 §P.D fact 2)',
  A4_PATH, '  if (isRaWorld(version)) {\n    armRaWorld(match, l3Dose, pcDose);\n    return;\n  }',
  1);

/** THE LEDGER'S OWN KIND VOCABULARY — read off `ContestContactKind`'s union, never re-typed */
const KIND_NEEDLE =
  "export type ContestContactKind = 'controlAttempt' | 'poke' | 'deflection' | 'header' | 'body';";
const LEDGER_KINDS = ((SRC_OF[PHYS_PATH].slice(
  SRC_OF[PHYS_PATH].indexOf(KIND_NEEDLE),
  SRC_OF[PHYS_PATH].indexOf(KIND_NEEDLE) + KIND_NEEDLE.length,
).match(/'([a-zA-Z]+)'/g) ?? []).map((s) => s.slice(1, -1))) as readonly ContestContactKind[];
/** ⭐ 'unrecorded' is NOT a ledger kind — it is the PUBLISHED RECEIPT for a contact tick the
 *  ledger has no entry for. It is never imputed into any kind. */
const KIND_CELLS = [...LEDGER_KINDS, 'unrecorded'] as const;
type KindCell = (typeof KIND_CELLS)[number];
const KI = (k: KindCell): number => KIND_CELLS.indexOf(k);
/** THE SECTOR VOCABULARY — read off `BodySector`'s own union */
const SECT_NEEDLE = "export type BodySector = 'front' | 'side' | 'back';";
const SECTORS = ((SRC_OF[PHYS_PATH].slice(
  SRC_OF[PHYS_PATH].indexOf(SECT_NEEDLE), SRC_OF[PHYS_PATH].indexOf(SECT_NEEDLE)
    + SECT_NEEDLE.length,
).match(/'([a-z]+)'/g) ?? []).map((s) => s.slice(1, -1))) as readonly BodySector[];
/** THE ORIGIN VOCABULARY — read off `ContestOrigin`'s own union block */
const ORIG_START = 'export type ContestOrigin =';
const origIdx = SRC_OF[PHYS_PATH].indexOf(ORIG_START);
const ORIGINS = ((SRC_OF[PHYS_PATH].slice(origIdx, SRC_OF[PHYS_PATH].indexOf(';', origIdx))
  .match(/'([a-zA-Z]+)'/g) ?? []).map((s) => s.slice(1, -1))) as readonly ContestOrigin[];
const ORIGIN_CELLS = [...ORIGINS, 'noEpisode'] as const;
type OriginCell = (typeof ORIGIN_CELLS)[number];
const OGI = (o: OriginCell): number => ORIGIN_CELLS.indexOf(o);

/** ⭐⭐ K — THE SETTLE WINDOW, read off the control-attempt law's own `readyTick` form.
 *  ⛔ NOT a typed K: it is `CONTACT_CONTROL_DELAY_TICKS`, imported, and the form it comes from
 *  (`readyTick: this.stepCount + CONTACT_CONTROL_DELAY_TICKS`) is anchored above. The form is
 *  a CONSTANT offset — it does NOT read `relativeSpeed` — so K is ONE number for every contact. */
const K_TICKS = CONTACT_CONTROL_DELAY_TICKS;
const K2_TICKS = 2 * CONTACT_CONTROL_DELAY_TICKS;

const ANCHORS_OK = ANCHORS.every((a) => a.occurrences.length === a.want)
  && SECTORS.length === 3 && SECTORS.join(',') === 'front,side,back'
  && LEDGER_KINDS.length === 5
  && LEDGER_KINDS.join(',') === 'controlAttempt,poke,deflection,header,body'
  && ORIGINS.length === 7
  && RA_WORLD_VERSION === 12 && GRAVITY === 9.81
  && K_TICKS === 3 && CONTROL_MAX_SPEED === 14 && GK_CONTROL_MAX_SPEED === 23
  && DV_CORRIDOR_SCALE === 4 && DV_CLEAR_RADIUS === 1.5;

/* ========================================================================== */
/* §4 SEEDS — block 12,540,000–999 (#381 item 6(vii))                          */
/* ========================================================================== */
const BLOCK_BASE = 12_540_000;
const BLOCK_TOP = 12_540_999;
/** ⭐⭐ N_FROZEN = 998 — the LARGEST N the block affords under #381 item 6(vii)'s own cap
 *  (N ≤ 998) after the construction receipt at 12,540,999. Sized by the §DEV-PREFLIGHT
 *  12-cluster scratch smoke BEFORE the freeze commit and BEFORE any battery seed. */
const N_FROZEN = 998;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_002_800;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + i : BLOCK_BASE + i));
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 20 : BLOCK_TOP;
const LOCKSTEP_SEEDS = [SCRATCH_BASE + 90, SCRATCH_BASE + 91];
const TRACE_INERT_SEEDS = [SCRATCH_BASE + 80, SCRATCH_BASE + 81];

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
 *  field" (home: BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 6). PT-C0 §COMMANDER
 *  CORRECTIONS item 2 required the NEXT dosed arm to PIN these two values: it does, and a
 *  mismatch is `process.exit(3)`. */
const L3_DOSE_FILE = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_DOSE_FILE = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_DOSE_PIN = 'a41a114c4727a2a6702bf4ca79b46b1d6924d80fa7fefb388d5364fd57da37db';
const PC_DOSE_PIN = '0301d7109cb0883a410a55cef9ff838dbce48d3627c418cbedd3e9e34448982f';
const L3_DOSE_BYTES_SHA = sha(readFileSync(L3_DOSE_FILE, 'utf8'));
const PC_DOSE_BYTES_SHA = sha(readFileSync(PC_DOSE_FILE, 'utf8'));
if (L3_DOSE_BYTES_SHA !== L3_DOSE_PIN || PC_DOSE_BYTES_SHA !== PC_DOSE_PIN) {
  banner('BN-C0 FATAL — a dose file\'s BYTES do not match the pinned value (#381 item 6)');
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
  banner(`BN-C0 FATAL — the DOSED arm is not reachable from Node: ${DOSE_LOAD_ERROR ?? 'empty dose'}`);
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
/** PT-C0's own population construction per seed, so the two arms differ ONLY in the doses. */
const buildMatch = (seed: number, arm: Arm, trace = true): Match => {
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(RA_WORLD_VERSION), traceContests: trace,
  } as ConstructorParameters<typeof Match>[0]);
  if (arm === 'E') armA4World(m, null, RA_WORLD_VERSION);
  else armA4World(m, null, RA_WORLD_VERSION, L3_DOSE, PC_DOSE);
  return m;
};

/* ========================================================================== */
/* §6 THE WALK-SIDE PREDICATES — PURE, fixture-backed
   canon, VERBATIM: "a scored face's walk-side predicate is pinned — anchored extraction or
   fixture — because the re-derivation gate proves arithmetic, not definitions"              */
/* ========================================================================== */
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
/** ⭐⭐ PT-C0's FIRST-BODY CLASSES, reused byte for byte. */
const CONTACTS = ['none', 'ownTarget', 'ownNonTarget', 'opponent'] as const;
type ContactClass = (typeof CONTACTS)[number];
const CTI = (c: ContactClass): number => CONTACTS.indexOf(c);
const contactClassOf = (
  contactGid: number | null, targetGid: number, contactSide: Side | null, passerSide: Side,
): ContactClass => (contactGid === null || contactSide === null ? 'none'
  : contactGid === targetGid ? 'ownTarget'
    : contactSide === passerSide ? 'ownNonTarget' : 'opponent');
/** ⭐⭐ PT-C0's REBOUND sign, reused — published BESIDE the bounce, NEVER pooled. */
const alongLaunchOf = (vx: number, vy: number, ux: number, uy: number): number =>
  vx * ux + vy * uy;
const isReboundOf = (alongLaunch: number): boolean => alongLaunch < 0;

/** ⭐⭐ THE BOUNCE — the outcome ladder at the settle window. */
const HOLDS = ['sameSide', 'opponent', 'loose', 'out', 'unresolved'] as const;
type HoldOutcome = (typeof HOLDS)[number];
const HOI = (h: HoldOutcome): number => HOLDS.indexOf(h);
/**
 * ⭐⭐ THE BOUNCE PREDICATE. `ownerSide` is `ball.owner?.side ?? null` and `live` is
 * `phase === 'playing' || phase === 'restart'`, both read at the END of tick `contactTick + K`.
 * A BOUNCE is any own-body first contact whose settle-window outcome is NOT `sameSide`.
 * `unresolved` (the match ended inside the window) is COUNTED and enters NO bounce face.
 */
const holdOutcomeOf = (
  resolved: boolean, live: boolean, ownerSide: Side | null, passerSide: Side,
): HoldOutcome => (!resolved ? 'unresolved'
  : !live ? 'out'
    : ownerSide === null ? 'loose'
      : ownerSide === passerSide ? 'sameSide' : 'opponent');
const isBounceOf = (o: HoldOutcome): boolean => o !== 'sameSide' && o !== 'unresolved';

/** ⭐⭐ THE CLAIM BUILDER'S OWN THREE-WAY maxSpeed BRANCH, evaluated by the probe on public
 *  fields. The `24` is the literal AT ITS SITE (anchored above), never a new constant. */
const maxSpeedBranchOf = (isGk: boolean, intended: boolean): number =>
  (isGk ? GK_CONTROL_MAX_SPEED : intended ? 24 : CONTROL_MAX_SPEED);
const SPEED_CELLS = ['atOrBelowMax', 'aboveMax'] as const;
type SpeedCell = (typeof SPEED_CELLS)[number];
const speedCellOf = (speed: number, maxSpeed: number): SpeedCell =>
  (speed <= maxSpeed ? 'atOrBelowMax' : 'aboveMax');

/** ⭐⭐ THE FIVE CANDIDATE CLASSES, in the FROZEN PRECEDENCE C1 > C2 > C3 > C4 > C5.
 *  WHY THIS ORDER (from the engine's OWN order of operations, §P.B): the claim builder decides
 *  the KIND from the ball's speed against THIS body's own maxSpeed branch, and that branch
 *  reads `intended` — so the target flag and the ledger kind are properties of the CONTACT
 *  BRANCH ITSELF and are read first. A live PC hold is a DECISION-LAYER state that the contact
 *  branch never reads at all; it cannot pre-empt a class the engine's own branch defines, so it
 *  is read AFTER them. Its OVERLAPPING counts (C4 ∧ C1, C4 ∧ C2, C4 ∧ C3, and C4 total) are
 *  stored beside the exclusive partition so the reader sees exactly how much it overlaps. */
const CLASSES = ['C1', 'C2', 'C3', 'C4', 'C5'] as const;
type BounceClass = (typeof CLASSES)[number];
const BCI = (c: BounceClass): number => CLASSES.indexOf(c);
const C5_SUBS = ['postControlLoss', 'bodyStrikeOnIntendedTarget', 'unrecordedOnIntendedTarget',
  'otherKindOnIntendedTarget'] as const;
type C5Sub = (typeof C5_SUBS)[number];
const C5I = (s: C5Sub): number => C5_SUBS.indexOf(s);
interface ClassInput {
  cls: ContactClass; kind: KindCell; possessionAtReadyTick: boolean; holdLive: boolean;
}
const bounceClassOf = (i: ClassInput): BounceClass => {
  if (i.cls === 'ownTarget' && i.kind === 'controlAttempt' && !i.possessionAtReadyTick) return 'C1';
  if (i.cls === 'ownTarget' && i.kind === 'deflection') return 'C2';
  if (i.cls === 'ownNonTarget') return 'C3';
  if (i.holdLive) return 'C4';
  return 'C5';
};
const c5SubOf = (i: ClassInput): C5Sub =>
  (i.kind === 'controlAttempt' ? 'postControlLoss'
    : i.kind === 'body' ? 'bodyStrikeOnIntendedTarget'
      : i.kind === 'unrecorded' ? 'unrecordedOnIntendedTarget' : 'otherKindOnIntendedTarget');

/** ⭐⭐ THE FRONT-ON CONE — the sector classifier's OWN `Math.SQRT1_2` threshold (anchored),
 *  applied to the angle between a heading and a direction. front ⇔ cos θ ≥ SQRT1_2 ⇔ θ ≤ 45°. */
const cosOf = (ax: number, ay: number, bx: number, by: number): number => {
  const la = Math.hypot(ax, ay);
  const lb = Math.hypot(bx, by);
  return (la < 1e-9 || lb < 1e-9) ? Number.NaN : (ax * bx + ay * by) / (la * lb);
};
const angleDegOf = (c: number): number =>
  (Number.isNaN(c) ? Number.NaN : Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI);
const isFrontOnOf = (c: number): boolean => c >= Math.SQRT1_2;
/** ⭐ THE SAME CONE IN DEGREES — DERIVED from `Math.SQRT1_2`, never typed as `45`. */
const FRONT_CONE_DEG = Math.acos(Math.SQRT1_2) * 180 / Math.PI;
const isFrontOnDegOf = (deg: number): boolean => deg <= FRONT_CONE_DEG;

/** ⭐⭐ THE CORRIDOR MEMBERSHIP — `laneOpenness`'s own geometry and its own two constants,
 *  through `closestPointOnSegment` (CALLED). `halfWidth` is the corridor family's own
 *  `DV_CORRIDOR_SCALE` for the PRIMARY read; the `CONTROL_RADIUS` variant is published beside
 *  as a TIGHT-corridor robustness bin. */
const inCorridorOf = (
  fromX: number, fromY: number, aimX: number, aimY: number,
  px: number, py: number, halfWidth: number,
): boolean => {
  const cp = closestPointOnSegment({ x: fromX, y: fromY }, { x: aimX, y: aimY }, { x: px, y: py });
  if (Math.hypot(cp.x - fromX, cp.y - fromY) < DV_CLEAR_RADIUS) return false;
  return Math.hypot(cp.x - px, cp.y - py) < halfWidth;
};
const OPP_CELLS = ['corridorAtRelease', 'arrivedInFlight', 'struckThrough'] as const;
type OppCell = (typeof OPP_CELLS)[number];
const OPI = (c: OppCell): number => OPP_CELLS.indexOf(c);
const oppCellOf = (atRelease: boolean, atContact: boolean): OppCell =>
  (atRelease ? 'corridorAtRelease' : atContact ? 'arrivedInFlight' : 'struckThrough');

/* --- THE FIXTURES (canon: a headline-bearing predicate needs a composition fixture) --- */
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-9;
/* the population predicates (PT-C0's, re-walked here) */
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
fx('contact.none', contactClassOf(null, 4, null, 0), 'none');
fx('contact.ownTarget', contactClassOf(4, 4, 0, 0), 'ownTarget');
fx('contact.ownNonTarget', contactClassOf(5, 4, 0, 0), 'ownNonTarget');
fx('contact.opponent', contactClassOf(9, 4, 1, 0), 'opponent');
/* ⭐⭐ THE BOUNCE PREDICATE, on constructed settle-window states */
fx('bounce.sameSideIsNotABounce', isBounceOf(holdOutcomeOf(true, true, 0, 0)), false);
fx('bounce.opponentIsABounce', isBounceOf(holdOutcomeOf(true, true, 1, 0)), true);
fx('bounce.looseIsABounce', isBounceOf(holdOutcomeOf(true, true, null, 0)), true);
fx('bounce.deadBallIsABounce', isBounceOf(holdOutcomeOf(true, false, 0, 0)), true);
fx('bounce.outBeatsOwner', holdOutcomeOf(true, false, 0, 0), 'out');
fx('bounce.unresolvedIsNeither', isBounceOf(holdOutcomeOf(false, true, null, 0)), false);
fx('bounce.unresolvedWord', holdOutcomeOf(false, true, 0, 0), 'unresolved');
fx('bounce.windowIsTheReadyTickForm', K_TICKS, CONTACT_CONTROL_DELAY_TICKS);
fx('bounce.robustnessWindowIsTwiceK', K2_TICKS, 2 * CONTACT_CONTROL_DELAY_TICKS);
/* ⭐⭐ THE CLASS PRECEDENCE, on constructed contacts */
const CI = (
  cls: ContactClass, kind: KindCell, pos: boolean, hold: boolean,
): ClassInput => ({ cls, kind, possessionAtReadyTick: pos, holdLive: hold });
fx('class.C1.intendedFailedControl', bounceClassOf(CI('ownTarget', 'controlAttempt', false, false)), 'C1');
fx('class.C1.beatsAHold', bounceClassOf(CI('ownTarget', 'controlAttempt', false, true)), 'C1');
fx('class.C2.intendedDeflection', bounceClassOf(CI('ownTarget', 'deflection', false, false)), 'C2');
fx('class.C2.beatsAHold', bounceClassOf(CI('ownTarget', 'deflection', false, true)), 'C2');
fx('class.C3.ownNonTargetAnyKind', bounceClassOf(CI('ownNonTarget', 'body', false, false)), 'C3');
fx('class.C3.ownNonTargetControlAttempt', bounceClassOf(CI('ownNonTarget', 'controlAttempt', true, false)), 'C3');
fx('class.C3.beatsAHold', bounceClassOf(CI('ownNonTarget', 'unrecorded', false, true)), 'C3');
fx('class.C4.holdOnTargetBodyStrike', bounceClassOf(CI('ownTarget', 'body', false, true)), 'C4');
fx('class.C4.holdOnTargetPostControl', bounceClassOf(CI('ownTarget', 'controlAttempt', true, true)), 'C4');
fx('class.C5.postControlLoss', bounceClassOf(CI('ownTarget', 'controlAttempt', true, false)), 'C5');
fx('class.C5.bodyStrikeOnTarget', bounceClassOf(CI('ownTarget', 'body', false, false)), 'C5');
fx('class.C5.unrecordedOnTarget', bounceClassOf(CI('ownTarget', 'unrecorded', false, false)), 'C5');
fx('class.C5.subPostControl', c5SubOf(CI('ownTarget', 'controlAttempt', true, false)), 'postControlLoss');
fx('class.C5.subBodyStrike', c5SubOf(CI('ownTarget', 'body', false, false)), 'bodyStrikeOnIntendedTarget');
fx('class.C5.subUnrecorded', c5SubOf(CI('ownTarget', 'unrecorded', false, false)), 'unrecordedOnIntendedTarget');
fx('class.C5.subOther', c5SubOf(CI('ownTarget', 'poke', false, false)), 'otherKindOnIntendedTarget');
/* ⭐⭐ THE KIND CROSS-CHECK — the probe's own maxSpeed branch against the ledger's vocabulary */
fx('maxSpeed.gkBranch', maxSpeedBranchOf(true, false), GK_CONTROL_MAX_SPEED);
fx('maxSpeed.gkBeatsIntended', maxSpeedBranchOf(true, true), GK_CONTROL_MAX_SPEED);
fx('maxSpeed.intendedBranchIsTheSiteLiteral', maxSpeedBranchOf(false, true), 24);
fx('maxSpeed.bystanderBranch', maxSpeedBranchOf(false, false), CONTROL_MAX_SPEED);
fx('speedCell.atMaxIsBelow', speedCellOf(14, 14), 'atOrBelowMax');
fx('speedCell.aboveMax', speedCellOf(14.0001, 14), 'aboveMax');
fx('speedCell.intendedAt20IsBelow', speedCellOf(20, maxSpeedBranchOf(false, true)), 'atOrBelowMax');
fx('speedCell.bystanderAt20IsAbove', speedCellOf(20, maxSpeedBranchOf(false, false)), 'aboveMax');
/* ⭐⭐ THE HEADING ARITHMETIC */
fx('angle.parallelIsZero', near(angleDegOf(cosOf(1, 0, 1, 0)), 0), true);
fx('angle.perpendicularIsNinety', near(angleDegOf(cosOf(1, 0, 0, 1)), 90), true);
fx('angle.oppositeIsOneEighty', near(angleDegOf(cosOf(1, 0, -1, 0)), 180), true);
fx('angle.fortyFive', near(angleDegOf(cosOf(1, 0, 1, 1)), 45), true);
fx('angle.zeroVectorIsNaN', Number.isNaN(angleDegOf(cosOf(0, 0, 1, 0))), true);
fx('frontOn.zeroIsFront', isFrontOnOf(cosOf(1, 0, 1, 0)), true);
fx('frontOn.fortyFiveIsFront', isFrontOnOf(cosOf(1, 0, Math.cos(Math.PI / 4), Math.sin(Math.PI / 4))), true);
fx('frontOn.fortySixIsNot', isFrontOnOf(cosOf(1, 0, Math.cos(0.81), Math.sin(0.81))), false);
fx('frontOn.ninetyIsNot', isFrontOnOf(cosOf(1, 0, 0, 1)), false);
fx('frontOn.theConeIsTheClassifiers', Math.SQRT1_2, Math.SQRT1_2);
fx('frontOn.coneInDegreesIsDerived', near(FRONT_CONE_DEG, 45), true);
fx('frontOn.degZeroIsFront', isFrontOnDegOf(0), true);
fx('frontOn.degAtTheConeIsFront', isFrontOnDegOf(FRONT_CONE_DEG), true);
fx('frontOn.degJustOutsideIsNot', isFrontOnDegOf(FRONT_CONE_DEG + 1e-9), false);
fx('frontOn.degNinetyIsNot', isFrontOnDegOf(90), false);
/* ⭐⭐ THE CORRIDOR TEST */
fx('corridor.onTheLineIsInside', inCorridorOf(0, 0, 20, 0, 10, 0, DV_CORRIDOR_SCALE), true);
fx('corridor.threeMetresOffIsInside', inCorridorOf(0, 0, 20, 0, 10, 3, DV_CORRIDOR_SCALE), true);
fx('corridor.fourMetresOffIsOutside', inCorridorOf(0, 0, 20, 0, 10, 4, DV_CORRIDOR_SCALE), false);
fx('corridor.beyondTheAimIsClamped', inCorridorOf(0, 0, 20, 0, 30, 0, DV_CORRIDOR_SCALE), false);
fx('corridor.atThePassersFeetIsExcluded', inCorridorOf(0, 0, 20, 0, 1, 0, DV_CORRIDOR_SCALE), false);
fx('corridor.tightVariantExcludesThreeMetres',
  inCorridorOf(0, 0, 20, 0, 10, 3, CONTROL_RADIUS), false);
fx('corridor.tightVariantKeepsTheLine', inCorridorOf(0, 0, 20, 0, 10, 0, CONTROL_RADIUS), true);
fx('oppCell.atRelease', oppCellOf(true, true), 'corridorAtRelease');
fx('oppCell.atReleaseEvenIfOutAtContact', oppCellOf(true, false), 'corridorAtRelease');
fx('oppCell.arrived', oppCellOf(false, true), 'arrivedInFlight');
fx('oppCell.struckThrough', oppCellOf(false, false), 'struckThrough');
/* PT-C0's rebound sign (published beside, never pooled) */
fx('rebound.alongPositiveIsNotRebound', isReboundOf(alongLaunchOf(6, 0, 1, 0)), false);
fx('rebound.alongNegativeIsRebound', isReboundOf(alongLaunchOf(-6, 0, 1, 0)), true);
fx('rebound.sidewaysIsNotRebound', isReboundOf(alongLaunchOf(0, 7, 1, 0)), false);
fx('rebound.alongValue', near(alongLaunchOf(3, 4, 0.6, 0.8), 5), true);
/* the law's own sector classifier, CALLED */
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
fx('sector.vocabularyIsTheUnions', SECTORS, ['front', 'side', 'back']);
fx('ledger.kindVocabularyIsTheUnions', LEDGER_KINDS,
  ['controlAttempt', 'poke', 'deflection', 'header', 'body']);
fx('ledger.unrecordedIsNotALedgerKind',
  (LEDGER_KINDS as readonly string[]).includes('unrecorded'), false);
/* the bin helpers */
fx('binOf.first', binOf(0.4, 2, 13), 0);
fx('binOf.overflow', binOf(999, 2, 13), 12);
fx('signedBinOf.centreHoldsZero', signedBinOf(0, 1, 21), 10);
fx('signedBinOf.underflow', signedBinOf(-999, 1, 21), 0);
fx('binMedian.unsigned', binMedian([0, 0, 5, 0], 1, false), 2);
fx('binMedian.signed', binMedian([1, 1, 8, 1, 1], 0.5, true), 0);
fx('binMedian.empty', Number.isNaN(binMedian([0, 0], 1, false)), true);
const FIXTURES_OK = FIXTURES.every((f) => f.ok);

/* ========================================================================== */
/* §7 THE FROZEN BINS (frozen at the FREEZE COMMIT, before any battery seed).
   ⚠ Every width/count below is a BIN EDGE of a stored histogram — never a rule, never a
   threshold: no face's WORD depends on one, and every published cut re-derives off disk.    */
/* ========================================================================== */
const ANGLE_BIN_DEG = 15; const ANGLE_BINS = 12;      // 0–180°, the 15° × 12 grid of #381 6(iv)
const LAUNCH_BIN_MS = 2; const LAUNCH_BINS = 13;      // launch speed, last = overflow
const DIST_BIN_M = 5; const DIST_BINS = 13;           // passer→target distance, last = overflow
const RELSPD_BIN_MS = 2; const RELSPD_BINS = 13;      // ball–body relative speed
const BODYSPD_BIN_MS = 1; const BODYSPD_BINS = 13;    // the body's own speed
const LATERAL_BIN_MS = 0.5; const LATERAL_BINS = 13;  // the receiver's lateral speed at mid
const ALONG_BIN_MS = 1; const ALONG_BINS = 21;        // PT-C0's own signed along-launch grid
const FLIGHT_RETIRE_TICKS = 720;                      // PT-C0's own retire cap, inherited

const OWN_CLASSES = ['ownTarget', 'ownNonTarget'] as const;
const OWI = (c: ContactClass): number => (c === 'ownTarget' ? 0 : 1);

/* ========================================================================== */
/* §8 THE PER-MATCH ROW — per-seed cells (canon: per-seed cells, ruling #282.2(ii))          */
/* ========================================================================== */
const STAT_KEYS = ['passes', 'passesCompleted', 'interceptions', 'goals', 'shots',
  'crosses', 'cutbacks', 'throughBalls', 'longBalls', 'headersWon', 'clearances'] as const;
type StatKey = (typeof STAT_KEYS)[number];

interface Row {
  worldOk: boolean; armedVersion: number; genomeClean: boolean; traceOn: boolean;
  rcBfAbsent: boolean; ticks: number; matches: number; wallMs: number;
  /* (i) the population */
  gpFlights: number; contactClass: number[]; ownBodyContacts: number;
  /* (ii) the bounce */
  ownN: number[]; ownResolvedK: number[]; ownBounceK: number[];
  ownResolved2K: number[]; ownBounce2K: number[];
  holdOutcomeK: number[][]; holdOutcome2K: number[][];
  /* (iii) the partition, by the engine's own ledger */
  kindN: number[]; kindResolved: number[]; kindBounce: number[];
  sectorN: number[]; sectorResolved: number[]; sectorBounce: number[];
  speedN: number[]; speedResolved: number[]; speedBounce: number[];
  crosscheckN: number; crosscheckAgree: number;
  holdN: number[]; holdResolved: number[]; holdBounce: number[];
  actionN: number[]; actionResolved: number[]; actionBounce: number[];
  passClassN: number[]; passClassResolved: number[]; passClassBounce: number[];
  launchN: number[]; launchResolved: number[]; launchBounce: number[];
  distN: number[]; distResolved: number[]; distBounce: number[];
  relSpdN: number[]; relSpdResolved: number[]; relSpdBounce: number[];
  bodySpdN: number[]; bodySpdResolved: number[]; bodySpdBounce: number[];
  originN: number[]; originResolved: number[]; originBounce: number[];
  controlAttemptsN: number; possessionAtReadyTick: number;
  /* the composition */
  compN: number[]; c5SubN: number[]; c4Overlap: number[];
  /* the rebound, BESIDE (PT-C0's own definition; never pooled) */
  rebN: number; rebHits: number; rebNoLine: number; alongBins: number[];
  bounceReboundTable: number[];
  /* (iv) the flight heading */
  hdgN: number[][]; hdgSum: number[][]; hdgBins: number[][][];
  frontRelN: number[]; frontRelHits: number[];
  frontRelTouchN: number[]; frontRelSideBackHits: number[];
  latN: number[]; latSum: number[]; latBins: number[][];
  /* (v) the opponent first contacts */
  oppN: number; oppCell: number[]; oppCellTight: number[];
  /* the ledger's own receipts */
  episodes: number; ledgerContacts: number; kindSeen: number[];
  /* context (the 240 s match clock) */
  goals: number; passes: number; passesCompleted: number; interceptions: number; shots: number;
}
const emptyRow = (): Row => ({
  worldOk: false, armedVersion: -1, genomeClean: false, traceOn: false, rcBfAbsent: false,
  ticks: 0, matches: 1, wallMs: 0,
  gpFlights: 0, contactClass: zeros(CONTACTS.length), ownBodyContacts: 0,
  ownN: zeros(2), ownResolvedK: zeros(2), ownBounceK: zeros(2),
  ownResolved2K: zeros(2), ownBounce2K: zeros(2),
  holdOutcomeK: zeros2(2, HOLDS.length), holdOutcome2K: zeros2(2, HOLDS.length),
  kindN: zeros(KIND_CELLS.length), kindResolved: zeros(KIND_CELLS.length),
  kindBounce: zeros(KIND_CELLS.length),
  sectorN: zeros(SECTORS.length), sectorResolved: zeros(SECTORS.length),
  sectorBounce: zeros(SECTORS.length),
  speedN: zeros(2), speedResolved: zeros(2), speedBounce: zeros(2),
  crosscheckN: 0, crosscheckAgree: 0,
  holdN: zeros(2), holdResolved: zeros(2), holdBounce: zeros(2),
  actionN: zeros(2), actionResolved: zeros(2), actionBounce: zeros(2),
  passClassN: zeros(2), passClassResolved: zeros(2), passClassBounce: zeros(2),
  launchN: zeros(LAUNCH_BINS), launchResolved: zeros(LAUNCH_BINS), launchBounce: zeros(LAUNCH_BINS),
  distN: zeros(DIST_BINS), distResolved: zeros(DIST_BINS), distBounce: zeros(DIST_BINS),
  relSpdN: zeros(RELSPD_BINS), relSpdResolved: zeros(RELSPD_BINS), relSpdBounce: zeros(RELSPD_BINS),
  bodySpdN: zeros(BODYSPD_BINS), bodySpdResolved: zeros(BODYSPD_BINS),
  bodySpdBounce: zeros(BODYSPD_BINS),
  originN: zeros(ORIGIN_CELLS.length), originResolved: zeros(ORIGIN_CELLS.length),
  originBounce: zeros(ORIGIN_CELLS.length),
  controlAttemptsN: 0, possessionAtReadyTick: 0,
  compN: zeros(CLASSES.length), c5SubN: zeros(C5_SUBS.length), c4Overlap: zeros(4),
  rebN: 0, rebHits: 0, rebNoLine: 0, alongBins: zeros(ALONG_BINS),
  bounceReboundTable: zeros(4),
  hdgN: zeros2(2, 3), hdgSum: zeros2(2, 3),
  hdgBins: [zeros2(3, ANGLE_BINS), zeros2(3, ANGLE_BINS)],
  frontRelN: zeros(2), frontRelHits: zeros(2),
  frontRelTouchN: zeros(2), frontRelSideBackHits: zeros(2),
  latN: zeros(2), latSum: zeros(2), latBins: zeros2(2, LATERAL_BINS),
  oppN: 0, oppCell: zeros(OPP_CELLS.length), oppCellTight: zeros(OPP_CELLS.length),
  episodes: 0, ledgerContacts: 0, kindSeen: zeros(LEDGER_KINDS.length),
  goals: 0, passes: 0, passesCompleted: 0, interceptions: 0, shots: 0,
});

/* ========================================================================== */
/* §9 THE WALK — one match; PURE per-tick reads of public Match state, NO WRAPPER.
   The contest-episode ledger is READ at the end of the match, never re-implemented.         */
/* ========================================================================== */
interface Sample { hx: number; hy: number; bvx: number; bvy: number; rvx: number; rvy: number }
interface Ev {
  cls: ContactClass; gid: number; contactTick: number; releaseTick: number;
  passerSide: Side; targetGid: number;
  sector: BodySector | null; along: number; hasLine: boolean;
  probeSpeed: number; maxSpeed: number; probeKind: SpeedCell; intended: boolean;
  holdLive: boolean; isReceivePass: boolean; bodySpeed: number; relSpeed: number;
  carried: boolean; launchSpeed: number; passDistance: number;
  outcomeK: HoldOutcome; outcome2K: HoldOutcome; possessionAtReadyTick: boolean;
  angleRelease: number; angleMid: number; angleTouch: number; lateralMid: number;
  oppAtRelease: boolean; oppAtContact: boolean;
  oppAtReleaseTight: boolean; oppAtContactTight: boolean;
  kind: KindCell; origin: OriginCell;
}
interface GpFlight {
  passerGid: number; passerSide: Side; targetGid: number; releaseTick: number;
  lx: number; ly: number; eX: number; eY: number;
  ux: number; uy: number; hasLine: boolean; launchSpeed: number; passDistance: number;
  carried: boolean; contactSeen: boolean;
  corridorAtRelease: Set<number>; corridorAtReleaseTight: Set<number>;
  samples: Sample[];
}
interface Windup { key: string; gid: number; targetGid: number; eX: number; eY: number;
  carried: boolean }

const signatureOf = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((pp) => ({
    gid: pp.gid, pos: pp.pos, vel: pp.vel, heading: pp.heading, stamina: pp.stamina,
  })),
}));
const runOut = (m: Match): Match => { while (!m.finished) m.step(DT); return m; };

const walkMatch = (m: Match, arm: Arm, observe: boolean): Row => {
  const tStart = Date.now();
  const row = emptyRow();
  const mm = m as unknown as {
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
    pendingPassWindup: {
      gid: number; readyTick: number; aim: { x: number; y: number }; targetGid: number;
      aimLead: { x: number; y: number } | null;
    } | null;
    pcLatency: { holdSnapshot(): { gid: number; hold: { untilTick: number } }[] } | null;
    rcAnticipate?: boolean; rcReady?: boolean; bfFacingCost?: boolean;
    traceContests: boolean;
  };
  row.armedVersion = raArmedVersion(m);
  row.worldOk = row.armedVersion === RA_WORLD_VERSION;
  row.traceOn = mm.traceContests === true;
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
  const prevStats: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of STAT_KEYS) prevStats[k] = [0, 0];
  let prevPendingPassT: number | null = mm.pendingPass?.t ?? null;
  let prevBvx = m.ball.vel.x; let prevBvy = m.ball.vel.y;
  let wu: Windup | null = null;
  let endedWindup: Windup | null = null;
  let flight: GpFlight | null = null;
  const events: Ev[] = [];
  /** deferred settle-window reads: tick → [event index, which window] */
  const dueK = new Map<number, number[]>();
  const due2K = new Map<number, number[]>();
  const schedule = (map: Map<number, number[]>, tick: number, idx: number): void => {
    const arr = map.get(tick);
    if (arr === undefined) map.set(tick, [idx]); else arr.push(idx);
  };
  const holdLiveFor = (gid: number, tick: number): boolean => {
    const seat = mm.pcLatency;
    if (seat === null) return false;
    for (const h of seat.holdSnapshot()) if (h.gid === gid && tick < h.hold.untilTick) return true;
    return false;
  };

  while (!m.finished) {
    m.step(DT);
    const tick = m.simTick;
    row.ticks += 1;
    if (!observe) continue;
    const ball = m.ball;
    const playing = m.phase === 'playing';
    const ballIsLive = playing || m.phase === 'restart';
    const ownerSide: Side | null = ball.owner !== null ? ball.owner.side as Side : null;

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

    /* ---------- THE DEFERRED SETTLE-WINDOW READS ---------- */
    for (const [map, isK] of [[dueK, true], [due2K, false]] as [Map<number, number[]>, boolean][]) {
      const idxs = map.get(tick);
      if (idxs === undefined) continue;
      for (const i of idxs) {
        const ev = events[i];
        const o = holdOutcomeOf(true, ballIsLive, ownerSide, ev.passerSide);
        if (isK) {
          ev.outcomeK = o;
          ev.possessionAtReadyTick = ball.owner !== null && ball.owner.gid === ev.gid;
        } else ev.outcome2K = o;
      }
      map.delete(tick);
    }

    /* ---------- THE WIND-UP RECORD (read ONLY to name the elected point E) ---------- */
    const rec = mm.pendingPassWindup;
    const key = rec === null ? null
      : `${rec.gid}:${rec.readyTick}:${rec.targetGid}:${rec.aim.x}:${rec.aim.y}`;
    endedWindup = null;
    if (wu !== null && key !== wu.key) { endedWindup = wu; wu = null; }
    if (rec !== null && (wu === null || key !== wu.key)) {
      const lead = rec.aimLead;
      wu = {
        key: key as string, gid: rec.gid, targetGid: rec.targetGid,
        eX: rec.aim.x + (lead?.x ?? 0), eY: rec.aim.y + (lead?.y ?? 0),
        carried: lead !== null && (lead.x !== 0 || lead.y !== 0),
      };
    }

    /* ---------- THE GROUND-PASS RELEASE (PT-C0's own detection, reused) ---------- */
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
      flight = null;
      row.gpFlights += 1;
      const viaWindup = endedWindup !== null && endedWindup.gid === rel.gid
        && endedWindup.targetGid === (targetGid as number);
      const eX = viaWindup ? (endedWindup as Windup).eX : players[targetGid as number].pos.x;
      const eY = viaWindup ? (endedWindup as Windup).eY : players[targetGid as number].pos.y;
      const carried = viaWindup ? (endedWindup as Windup).carried : false;
      const lx = ball.pos.x - ball.vel.x * DT;
      const ly = ball.pos.y - ball.vel.y * DT;
      const dxE = eX - lx; const dyE = eY - ly;
      const L = Math.hypot(dxE, dyE);
      const hasLine = L > 1e-6;
      const passerSide = players[rel.gid].side as Side;
      const corr = new Set<number>();
      const corrT = new Set<number>();
      if (hasLine) {
        for (const o of m.teams[1 - passerSide].players) {
          if (o.sentOff) continue;
          if (inCorridorOf(lx, ly, eX, eY, o.pos.x, o.pos.y, DV_CORRIDOR_SCALE)) corr.add(o.gid);
          if (inCorridorOf(lx, ly, eX, eY, o.pos.x, o.pos.y, CONTROL_RADIUS)) corrT.add(o.gid);
        }
      }
      const tgt = players[targetGid as number];
      flight = {
        passerGid: rel.gid, passerSide, targetGid: targetGid as number, releaseTick: tick,
        lx, ly, eX, eY, ux: hasLine ? dxE / L : 0, uy: hasLine ? dyE / L : 0, hasLine,
        launchSpeed: hSpeedNow, passDistance: L, carried, contactSeen: false,
        corridorAtRelease: corr, corridorAtReleaseTight: corrT,
        samples: [{
          hx: tgt.heading.x, hy: tgt.heading.y, bvx: ball.vel.x, bvy: ball.vel.y,
          rvx: tgt.vel.x, rvy: tgt.vel.y,
        }],
      };
    }

    /* ---------- FOLLOW THE FLIGHT AND BOOK THE FIRST BODY ---------- */
    if (flight !== null) {
      const f = flight;
      if (!f.contactSeen && lastTouch !== null && lastTouch.gid !== f.passerGid) {
        f.contactSeen = true;
        const cls = contactClassOf(
          lastTouch.gid, f.targetGid, lastTouch.side as Side, f.passerSide,
        );
        row.contactClass[CTI(cls)] += 1;
        const body = lastTouch;
        const intended = lastTouch.gid === f.targetGid;
        const prevSpeed = Math.hypot(prevBvx, prevBvy);
        const maxSpeed = maxSpeedBranchOf(body.role === 'GK', intended);
        const nSamp = f.samples.length;
        const midIdx = Math.max(0, Math.min(nSamp - 1, Math.round((tick - f.releaseTick) / 2)));
        const touchIdx = Math.max(0, Math.min(nSamp - 1, tick - f.releaseTick - 1));
        const sRel = f.samples[0];
        const sMid = f.samples[midIdx];
        const sTouch = f.samples[touchIdx];
        const angAt = (s: Sample): number => angleDegOf(cosOf(s.hx, s.hy, -s.bvx, -s.bvy));
        const latAt = (s: Sample): number => {
          if (!f.hasLine) return Number.NaN;
          const along = s.rvx * f.ux + s.rvy * f.uy;
          return Math.hypot(s.rvx - along * f.ux, s.rvy - along * f.uy);
        };
        const ev: Ev = {
          cls, gid: lastTouch.gid, contactTick: tick, releaseTick: f.releaseTick,
          passerSide: f.passerSide, targetGid: f.targetGid,
          sector: ballAccessGeometry(body, ball, CONTROL_RADIUS).sector,
          along: f.hasLine ? alongLaunchOf(ball.vel.x, ball.vel.y, f.ux, f.uy) : Number.NaN,
          hasLine: f.hasLine,
          probeSpeed: prevSpeed, maxSpeed, probeKind: speedCellOf(prevSpeed, maxSpeed), intended,
          holdLive: holdLiveFor(lastTouch.gid, tick),
          isReceivePass: (body.action.type as string) === 'ReceivePass',
          bodySpeed: Math.hypot(body.vel.x, body.vel.y),
          relSpeed: Math.hypot(prevBvx - body.vel.x, prevBvy - body.vel.y),
          carried: f.carried, launchSpeed: f.launchSpeed, passDistance: f.passDistance,
          outcomeK: 'unresolved', outcome2K: 'unresolved', possessionAtReadyTick: false,
          angleRelease: angAt(sRel), angleMid: angAt(sMid), angleTouch: angAt(sTouch),
          lateralMid: latAt(sMid),
          oppAtRelease: f.corridorAtRelease.has(lastTouch.gid),
          oppAtContact: f.hasLine && inCorridorOf(
            f.lx, f.ly, f.eX, f.eY, body.pos.x, body.pos.y, DV_CORRIDOR_SCALE,
          ),
          oppAtReleaseTight: f.corridorAtReleaseTight.has(lastTouch.gid),
          oppAtContactTight: f.hasLine && inCorridorOf(
            f.lx, f.ly, f.eX, f.eY, body.pos.x, body.pos.y, CONTROL_RADIUS,
          ),
          kind: 'unrecorded', origin: 'noEpisode',
        };
        const idx = events.push(ev) - 1;
        schedule(dueK, tick + K_TICKS, idx);
        schedule(due2K, tick + K2_TICKS, idx);
      }
      if (f.samples.length <= FLIGHT_RETIRE_TICKS) {
        const tgt = players[f.targetGid];
        f.samples.push({
          hx: tgt.heading.x, hy: tgt.heading.y, bvx: ball.vel.x, bvy: ball.vel.y,
          rvx: tgt.vel.x, rvy: tgt.vel.y,
        });
      }
      if (f.contactSeen) flight = null;
      else if (ball.owner !== null && ball.owner.gid !== f.passerGid) flight = null;
      else if (!ballIsLive) flight = null;
      else if (tick - f.releaseTick > FLIGHT_RETIRE_TICKS) flight = null;
    }
    prevBvx = ball.vel.x; prevBvy = ball.vel.y;
  }

  /* ---------- THE ENGINE'S OWN LEDGER, READ (never re-implemented) ---------- */
  const eps = m.contestEpisodes as readonly ContestEpisode[];
  row.episodes = eps.length;
  const ledgerAt = new Map<string, { kind: ContestContactKind; origin: ContestOrigin }>();
  for (const e of eps) {
    for (const c of e.contacts) {
      row.ledgerContacts += 1;
      const ki = LEDGER_KINDS.indexOf(c.kind);
      if (ki >= 0) row.kindSeen[ki] += 1;
      const k = `${c.tick}:${c.gid}`;
      if (!ledgerAt.has(k)) ledgerAt.set(k, { kind: c.kind, origin: e.origin });
    }
  }
  const episodeStartedIn = (lo: number, hi: number): ContestOrigin | null => {
    for (const e of eps) if (e.startedTick >= lo && e.startedTick <= hi) return e.origin;
    return null;
  };

  /* ---------- BOOK EVERY EVENT ---------- */
  if (observe) {
    for (const ev of events) {
      const hit = ledgerAt.get(`${ev.contactTick}:${ev.gid}`);
      ev.kind = hit === undefined ? 'unrecorded' : hit.kind;
      ev.origin = hit !== undefined ? hit.origin
        : (episodeStartedIn(ev.contactTick, ev.contactTick + K_TICKS) ?? 'noEpisode');
      const resolved = ev.outcomeK !== 'unresolved';
      const bounce = isBounceOf(ev.outcomeK);
      const rb = resolved ? 1 : 0;
      const bh = bounce ? 1 : 0;
      if (ev.cls === 'opponent') {
        row.oppN += 1;
        row.oppCell[OPI(oppCellOf(ev.oppAtRelease, ev.oppAtContact))] += 1;
        row.oppCellTight[OPI(oppCellOf(ev.oppAtReleaseTight, ev.oppAtContactTight))] += 1;
        continue;
      }
      if (ev.cls !== 'ownTarget' && ev.cls !== 'ownNonTarget') continue;
      const oi = OWI(ev.cls);
      row.ownBodyContacts += 1;
      row.ownN[oi] += 1;
      row.holdOutcomeK[oi][HOI(ev.outcomeK)] += 1;
      row.holdOutcome2K[oi][HOI(ev.outcome2K)] += 1;
      row.ownResolvedK[oi] += rb; row.ownBounceK[oi] += bh;
      if (ev.outcome2K !== 'unresolved') {
        row.ownResolved2K[oi] += 1;
        if (isBounceOf(ev.outcome2K)) row.ownBounce2K[oi] += 1;
      }
      /* the cells */
      const put = (n: number[], r: number[], b: number[], i: number): void => {
        n[i] += 1; r[i] += rb; b[i] += bh;
      };
      put(row.kindN, row.kindResolved, row.kindBounce, KI(ev.kind));
      if (ev.sector !== null) {
        put(row.sectorN, row.sectorResolved, row.sectorBounce, SECTORS.indexOf(ev.sector));
      }
      put(row.speedN, row.speedResolved, row.speedBounce, SPEED_CELLS.indexOf(ev.probeKind));
      put(row.holdN, row.holdResolved, row.holdBounce, ev.holdLive ? 0 : 1);
      put(row.actionN, row.actionResolved, row.actionBounce, ev.isReceivePass ? 0 : 1);
      put(row.passClassN, row.passClassResolved, row.passClassBounce, ev.carried ? 1 : 0);
      put(row.launchN, row.launchResolved, row.launchBounce,
        binOf(ev.launchSpeed, LAUNCH_BIN_MS, LAUNCH_BINS));
      put(row.distN, row.distResolved, row.distBounce,
        binOf(ev.passDistance, DIST_BIN_M, DIST_BINS));
      put(row.relSpdN, row.relSpdResolved, row.relSpdBounce,
        binOf(ev.relSpeed, RELSPD_BIN_MS, RELSPD_BINS));
      put(row.bodySpdN, row.bodySpdResolved, row.bodySpdBounce,
        binOf(ev.bodySpeed, BODYSPD_BIN_MS, BODYSPD_BINS));
      put(row.originN, row.originResolved, row.originBounce, OGI(ev.origin));
      /* ⭐ the KIND CROSS-CHECK: the probe's own maxSpeed branch against the ledger's word */
      if (ev.kind === 'controlAttempt' || ev.kind === 'deflection') {
        row.crosscheckN += 1;
        const want = ev.probeKind === 'atOrBelowMax' ? 'controlAttempt' : 'deflection';
        if (want === ev.kind) row.crosscheckAgree += 1;
      }
      if (ev.kind === 'controlAttempt') {
        row.controlAttemptsN += 1;
        if (ev.possessionAtReadyTick) row.possessionAtReadyTick += 1;
      }
      /* ⭐⭐ PT-C0's REBOUND, BESIDE — never pooled with the bounce */
      if (ev.hasLine) {
        row.rebN += 1;
        const reb = isReboundOf(ev.along);
        if (reb) row.rebHits += 1;
        row.alongBins[signedBinOf(ev.along, ALONG_BIN_MS, ALONG_BINS)] += 1;
        if (resolved) row.bounceReboundTable[(bounce ? 0 : 2) + (reb ? 0 : 1)] += 1;
      } else row.rebNoLine += 1;
      /* ⭐⭐ THE COMPOSITION — over RESOLVED BOUNCES only */
      if (resolved && bounce) {
        const ci: ClassInput = {
          cls: ev.cls, kind: ev.kind, possessionAtReadyTick: ev.possessionAtReadyTick,
          holdLive: ev.holdLive,
        };
        const cl = bounceClassOf(ci);
        row.compN[BCI(cl)] += 1;
        if (cl === 'C5') row.c5SubN[C5I(c5SubOf(ci))] += 1;
        if (ev.holdLive) {
          row.c4Overlap[0] += 1;
          if (cl === 'C1') row.c4Overlap[1] += 1;
          if (cl === 'C2') row.c4Overlap[2] += 1;
          if (cl === 'C3') row.c4Overlap[3] += 1;
        }
      }
      /* ⭐ (iv) THE FLIGHT HEADING — ownTarget contacts only, split held vs bounced */
      if (ev.cls === 'ownTarget' && resolved) {
        const gi = bounce ? 1 : 0;
        const stages = [ev.angleRelease, ev.angleMid, ev.angleTouch];
        for (let s = 0; s < 3; s++) {
          const a = stages[s];
          if (Number.isNaN(a)) continue;
          row.hdgN[gi][s] += 1;
          row.hdgSum[gi][s] += a;
          row.hdgBins[gi][s][binOf(a, ANGLE_BIN_DEG, ANGLE_BINS)] += 1;
        }
        if (!Number.isNaN(ev.angleRelease)) {
          row.frontRelN[gi] += 1;
          const frontRel = isFrontOnDegOf(ev.angleRelease);
          if (frontRel) row.frontRelHits[gi] += 1;
          if (frontRel && !Number.isNaN(ev.angleTouch)) {
            row.frontRelTouchN[gi] += 1;
            if (!isFrontOnDegOf(ev.angleTouch)) row.frontRelSideBackHits[gi] += 1;
          }
        }
        if (!Number.isNaN(ev.lateralMid)) {
          row.latN[gi] += 1;
          row.latSum[gi] += ev.lateralMid;
          row.latBins[gi][binOf(ev.lateralMid, LATERAL_BIN_MS, LATERAL_BINS)] += 1;
        }
      }
    }
    row.contactClass[CTI('none')] = row.gpFlights
      - row.contactClass[CTI('ownTarget')] - row.contactClass[CTI('ownNonTarget')]
      - row.contactClass[CTI('opponent')];
  }
  const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<StatKey, number>[];
  row.goals = st[0].goals + st[1].goals;
  row.passes = st[0].passes + st[1].passes;
  row.passesCompleted = st[0].passesCompleted + st[1].passesCompleted;
  row.interceptions = st[0].interceptions + st[1].interceptions;
  row.shots = st[0].shots + st[1].shots;
  row.wallMs = Date.now() - tStart;
  return row;
};

/* ========================================================================== */
/* §10 gTraceInert — THE LEDGER FLAG ONLY RECORDS                              */
/* ========================================================================== */
banner('BN-C0 — gTraceInert (trace ON vs OFF, whole-match signatures, per arm)');
const traceInertRows = TRACE_INERT_SEEDS.flatMap((seed) => ARMS.map((arm) => {
  const on = signatureOf(runOut(buildMatch(seed, arm, true)));
  const off = signatureOf(runOut(buildMatch(seed, arm, false)));
  return { seed, arm, signatureTraceOn: on, signatureTraceOff: off, equal: on === off };
}));
const TRACE_INERT_OK = traceInertRows.every((r) => r.equal);
banner(`  gTraceInert ${TRACE_INERT_OK ? 'GREEN' : 'RED'} (${traceInertRows.length} arm × seed pairs)`);

/* ========================================================================== */
/* §11 gLockstep — NO WRAPPER; the observation reads are BYTE-INERT             */
/* ========================================================================== */
banner('BN-C0 — the lockstep receipt (observed vs unobserved, PER ARM)');
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
banner(`BN-C0 — the battery: ${N} seeds × ${ARMS.length} arms, seeds `
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

/* ---- (i) THE POPULATION AND THE FIRST-BODY CLASSES (PT-C0's, reused) ---- */
for (const c of CONTACTS) {
  const ci = CTI(c);
  defFace(`class.firstBody.${c}`, 'share',
    `⭐⭐ (i) THE FIRST BODY a measured GROUND pass contacts — \`${c}\` (PT-C0's population and `
    + 'its `ball.lastTouch` channel, REUSED byte for byte)', 'measured ground-pass flights',
    (r) => r.contactClass[ci], (r) => r.gpFlights);
}
defFace('class.groundPassesPerMatch', 'passes per match (240 s match clock)',
  '(i) measured ground passes per match — the population on the match clock', 'matches walked',
  (r) => r.gpFlights, (r) => r.matches);
defFace('class.ownBodyShare', 'share',
  '⭐ (i) P(the first body is one of OUR OWN) — the BOUNCE face\'s own denominator as a share',
  'measured ground-pass flights', (r) => r.ownBodyContacts, (r) => r.gpFlights);

/* ---- (ii) THE BOUNCE ---- */
for (const own of OWN_CLASSES) {
  const oi = OWI(own);
  defFace(`bounce.rate.${own}`, 'share',
    `⭐⭐ (ii) THE BOUNCE RATE on \`${own}\` first contacts — the passing side does NOT hold `
    + `the ball at contactTick + K (K = ${K_TICKS} ticks, the control-attempt law's own `
    + '`readyTick` offset): the ball is LOOSE, the OPPONENT\'s, or OUT',
    `\`${own}\` first contacts RESOLVED inside the window`,
    (r) => r.ownBounceK[oi], (r) => r.ownResolvedK[oi]);
  defFace(`bounce.rateAt2K.${own}`, 'share',
    `(ii) THE ROBUSTNESS BIN — the same read at contactTick + 2K (${K2_TICKS} ticks). ⛔ A BIN, `
    + 'not a second definition: no read word depends on it',
    `\`${own}\` first contacts resolved inside the 2K window`,
    (r) => r.ownBounce2K[oi], (r) => r.ownResolved2K[oi]);
  defFace(`bounce.unresolvedShare.${own}`, 'share',
    `(ii) \`${own}\` first contacts whose settle window ran past FULL TIME — COUNTED, and they `
    + 'enter NO bounce face', `\`${own}\` first contacts`,
    (r) => r.ownN[oi] - r.ownResolvedK[oi], (r) => r.ownN[oi]);
  for (const h of HOLDS) {
    defFace(`bounce.outcomeAtK.${own}.${h}`, 'share',
      `(ii) the settle-window outcome ladder at contactTick + K — \`${h}\``,
      `\`${own}\` first contacts`, (r) => r.holdOutcomeK[oi][HOI(h)], (r) => r.ownN[oi]);
    defFace(`bounce.outcomeAt2K.${own}.${h}`, 'share',
      `(ii) the same ladder at contactTick + 2K — \`${h}\``,
      `\`${own}\` first contacts`, (r) => r.holdOutcome2K[oi][HOI(h)], (r) => r.ownN[oi]);
  }
}
defFace('bounce.rate.ownBody', 'share',
  '⭐⭐ (ii) THE BOUNCE RATE over ALL own-body first contacts (both own classes pooled)',
  'own-body first contacts resolved inside the window',
  (r) => sum(r.ownBounceK), (r) => sum(r.ownResolvedK));
/* ---- PT-C0's REBOUND, BESIDE — its own denominator, NEVER pooled ---- */
defFace('rebound.share', 'share',
  '⭐⭐ PT-C0\'s OWN REBOUND FACE, PUBLISHED BESIDE (its definition, verbatim: an own-body '
  + 'first contact whose post-contact velocity along the launch line is NEGATIVE). ⛔ It is '
  + 'NOT the bounce and is never pooled with it — PT-C0 HONEST LIMIT 2',
  'own-body first contacts with a defined launch line', (r) => r.rebHits, (r) => r.rebN);
defFace('rebound.noLaunchLineShare', 'share',
  'own-body first contacts with NO defined launch line — counted and excluded from the '
  + 'rebound face', 'own-body first contacts', (r) => r.rebNoLine, (r) => r.ownBodyContacts);
const REB2X2 = ['bounceAndRebound', 'bounceNotRebound', 'reboundNotBounce', 'neither'] as const;
for (let i = 0; i < REB2X2.length; i++) {
  defFace(`rebound.overlap.${REB2X2[i]}`, 'share',
    `⭐ THE 2×2 OVERLAP of the BOUNCE and PT-C0's REBOUND — \`${REB2X2[i]}\``,
    'own-body first contacts with a launch line AND a resolved settle window',
    (r) => r.bounceReboundTable[i], (r) => sum(r.bounceReboundTable));
}

/* ---- (iii) THE PARTITION, BY THE ENGINE'S OWN LEDGER ---- */
for (const k of KIND_CELLS) {
  const ki = KI(k);
  defFace(`partition.kind.share.${k}`, 'share',
    `⭐⭐ (iii) the CONTACT KIND at the contact tick, READ FROM THE CONTEST-EPISODE LEDGER — `
    + `\`${k}\`${k === 'unrecorded' ? ' (⛔ NOT a ledger kind: the PUBLISHED RECEIPT for a '
      + 'contact tick the ledger has no entry for — never imputed into any kind)' : ''}`,
    'own-body first contacts', (r) => r.kindN[ki], (r) => r.ownBodyContacts);
  defFace(`partition.kind.bounce.${k}`, 'share',
    `⭐⭐ (iii) P(bounce | ledger kind = \`${k}\`)`,
    `\`${k}\` own-body first contacts with a resolved settle window`,
    (r) => r.kindBounce[ki], (r) => r.kindResolved[ki]);
}
for (const s of SECTORS) {
  const si = SECTORS.indexOf(s);
  defFace(`partition.sector.share.${s}`, 'share',
    `(iii) the BK shell SECTOR of the contacted own body — \`${s}\` (the law's OWN classifier, `
    + 'CALLED; ⚠ read at the END of the contact tick — PT-C0\'s declared limit, inherited)',
    'own-body first contacts with a sector read', (r) => r.sectorN[si], (r) => sum(r.sectorN));
  defFace(`partition.sector.bounce.${s}`, 'share', `⭐ (iii) P(bounce | sector = \`${s}\`)`,
    `\`${s}\` own-body first contacts with a resolved settle window`,
    (r) => r.sectorBounce[si], (r) => r.sectorResolved[si]);
}
for (const sc of SPEED_CELLS) {
  const i = SPEED_CELLS.indexOf(sc);
  defFace(`partition.speedVsMax.share.${sc}`, 'share',
    `(iii) the ball's speed at the contact tick against THAT body's OWN maxSpeed branch `
    + `(\`p.role === 'GK' ? GK_CONTROL_MAX_SPEED : intended ? 24 : CONTROL_MAX_SPEED\`, the `
    + `claim builder's own expression, the 24 anchored AT ITS SITE) — \`${sc}\``,
    'own-body first contacts', (r) => r.speedN[i], (r) => sum(r.speedN));
  defFace(`partition.speedVsMax.bounce.${sc}`, 'share',
    `⭐ (iii) P(bounce | speed \`${sc}\`)`,
    `\`${sc}\` own-body first contacts with a resolved settle window`,
    (r) => r.speedBounce[i], (r) => r.speedResolved[i]);
}
defFace('partition.speedVsMax.crosscheckAgreementShare', 'share',
  '⭐⭐ THE CROSS-CHECK, a RECEIPT: the probe\'s own three-way maxSpeed evaluation against the '
  + 'LEDGER\'S OWN WORD on the same contact (`controlAttempt` ⇔ at-or-below, `deflection` ⇔ '
  + 'above). ⚠ The probe reads the ball\'s speed at the END of the PREVIOUS tick — the engine '
  + 'reads it INSIDE the step, before the contact resolves — so this is a ONE-TICK-LAGGED '
  + 'reconstruction and disagreement is expected; the LEDGER is the record, the probe\'s cell '
  + 'is the published cut. ⛔ never a football effect size',
  'own-body first contacts whose ledger kind is `controlAttempt` or `deflection`',
  (r) => r.crosscheckAgree, (r) => r.crosscheckN);
const HOLD_CELLS = ['live', 'absent'] as const;
for (const h of HOLD_CELLS) {
  const i = HOLD_CELLS.indexOf(h);
  defFace(`partition.pcHold.share.${h}`, 'share',
    `(iii) a PC reaction HOLD \`${h}\` for that body at the contact tick (a PURE read of the `
    + 'seat\'s own `holdSnapshot()`, with the seat\'s own liveness rule `simTick < untilTick`; '
    + '⛔ `holdFor` is never called — it PRUNES)', 'own-body first contacts',
    (r) => r.holdN[i], (r) => sum(r.holdN));
  defFace(`partition.pcHold.bounce.${h}`, 'share', `⭐ (iii) P(bounce | hold \`${h}\`)`,
    `own-body first contacts with a \`${h}\` hold and a resolved settle window`,
    (r) => r.holdBounce[i], (r) => r.holdResolved[i]);
}
const ACT_CELLS = ['receivePass', 'other'] as const;
for (const a of ACT_CELLS) {
  const i = ACT_CELLS.indexOf(a);
  defFace(`partition.action.share.${a}`, 'share',
    `(iii) the body's own \`action.type\` at the contact tick — \`${a}\``,
    'own-body first contacts', (r) => r.actionN[i], (r) => sum(r.actionN));
  defFace(`partition.action.bounce.${a}`, 'share', `⭐ (iii) P(bounce | action \`${a}\`)`,
    `own-body first contacts with action \`${a}\` and a resolved settle window`,
    (r) => r.actionBounce[i], (r) => r.actionResolved[i]);
}
const PASS_CELLS = ['toFeet', 'carried'] as const;
for (const pc of PASS_CELLS) {
  const i = PASS_CELLS.indexOf(pc);
  defFace(`partition.passClass.share.${pc}`, 'share',
    `(iii) the PASS CLASS — \`carried\` iff the strike resolved a tracked wind-up whose own `
    + '`aimLead` is non-null and non-zero, else `toFeet` (PT-C0\'s own wind-up channel)',
    'own-body first contacts', (r) => r.passClassN[i], (r) => sum(r.passClassN));
  defFace(`partition.passClass.bounce.${pc}`, 'share', `⭐ (iii) P(bounce | pass class \`${pc}\`)`,
    `own-body first contacts of class \`${pc}\` with a resolved settle window`,
    (r) => r.passClassBounce[i], (r) => r.passClassResolved[i]);
}
for (let i = 0; i < LAUNCH_BINS; i++) {
  defFace(`partition.launchSpeedBin.bounce.b${i}`, 'share',
    `(iii) P(bounce | launch speed bin ${i}) — bin edges ${i * LAUNCH_BIN_MS} m/s`
    + `${i === LAUNCH_BINS - 1 ? '+ (overflow)' : `–${(i + 1) * LAUNCH_BIN_MS} m/s`}`,
    `own-body first contacts in launch-speed bin ${i} with a resolved settle window`,
    (r) => r.launchBounce[i], (r) => r.launchResolved[i]);
}
for (let i = 0; i < DIST_BINS; i++) {
  defFace(`partition.distanceBin.bounce.b${i}`, 'share',
    `(iii) P(bounce | passer→target distance bin ${i}) — bin edges ${i * DIST_BIN_M} m`
    + `${i === DIST_BINS - 1 ? '+ (overflow)' : `–${(i + 1) * DIST_BIN_M} m`}`,
    `own-body first contacts in distance bin ${i} with a resolved settle window`,
    (r) => r.distBounce[i], (r) => r.distResolved[i]);
}
for (const o of ORIGIN_CELLS) {
  const oi = OGI(o);
  defFace(`partition.origin.share.${o}`, 'share',
    `(iii) the contest EPISODE'S OWN ORIGIN at the contact — \`${o}\``
    + `${o === 'noEpisode' ? ' (no episode contains the contact and none opened inside K)' : ''}`,
    'own-body first contacts', (r) => r.originN[oi], (r) => r.ownBodyContacts);
  defFace(`partition.origin.bounce.${o}`, 'share', `(iii) P(bounce | origin \`${o}\`)`,
    `own-body first contacts of origin \`${o}\` with a resolved settle window`,
    (r) => r.originBounce[oi], (r) => r.originResolved[oi]);
}
defFace('partition.controlAttempt.possessionAtReadyTickShare', 'share',
  '⭐⭐ (iii) THE CONTROL ATTEMPT\'S OWN OUTCOME, read from the engine: of own-body first '
  + 'contacts the ledger recorded as `controlAttempt`, the share where THAT BODY owns the ball '
  + 'at his `readyTick`', 'own-body `controlAttempt` first contacts',
  (r) => r.possessionAtReadyTick, (r) => r.controlAttemptsN);

/* ---- ⭐⭐ THE BOUNCE COMPOSITION ---- */
const CLASS_LABEL: Record<BounceClass, string> = {
  C1: 'INTENDED target · `controlAttempt` recorded · attempt FAILED (no possession at his '
    + 'readyTick) — the control-QUALITY class',
  C2: 'INTENDED target · met ABOVE his own maxSpeed branch (ledger kind `deflection`) — the '
    + 'pass-WEIGHT class',
  C3: 'an OWN NON-TARGET body first (any kind) — the LANE-OCCUPANCY class',
  C4: 'a body under a LIVE PC HOLD at contact — the REACTION class (EXCLUSIVE residue after '
    + 'C1–C3; its OVERLAPPING counts are published beside)',
  C5: 'everything else — the named remainder classes',
};
for (const c of CLASSES) {
  defFace(`composition.${c}`, 'share',
    `⭐⭐ THE BOUNCE COMPOSITION — \`${c}\`: ${CLASS_LABEL[c]}. Assigned in the FROZEN `
    + 'precedence C1 > C2 > C3 > C4 > C5 (§P.B states and justifies it from the engine\'s own '
    + 'order of operations)', 'RESOLVED BOUNCES', (r) => r.compN[BCI(c)], (r) => sum(r.compN));
}
for (const s of C5_SUBS) {
  defFace(`composition.C5sub.${s}`, 'share',
    `⭐ THE C5 REMAINDER, NAMED — \`${s}\``, 'RESOLVED BOUNCES',
    (r) => r.c5SubN[C5I(s)], (r) => sum(r.compN));
}
const C4_OVERLAP = ['total', 'withC1', 'withC2', 'withC3'] as const;
for (let i = 0; i < C4_OVERLAP.length; i++) {
  defFace(`composition.C4overlap.${C4_OVERLAP[i]}`, 'share',
    `⭐⭐ THE C4 OVERLAP — bounces with a LIVE PC HOLD, \`${C4_OVERLAP[i]}\` (the OVERLAPPING `
    + 'count, not the exclusive one: this is how much the REACTION class overlaps C1–C3)',
    'RESOLVED BOUNCES', (r) => r.c4Overlap[i], (r) => sum(r.compN));
}

/* ---- (iv) THE RECEIVER'S HEADING THROUGH THE FLIGHT ---- */
const HDG_GROUPS = ['held', 'bounced'] as const;
const STAGES = ['release', 'mid', 'touch'] as const;
for (const g of HDG_GROUPS) {
  const gi = HDG_GROUPS.indexOf(g);
  for (const st2 of STAGES) {
    const si = STAGES.indexOf(st2);
    defFace(`flight.meanAngleDeg.${g}.${st2}`, 'degrees',
      `⭐ (iv) the angle between the RECEIVER'S HEADING and the ball's APPROACH direction `
      + `(\`ball.vel\` REVERSED) at ${st2 === 'release' ? 'the RELEASE tick' : st2 === 'mid'
        ? 'MID-FLIGHT (the sample nearest half the flight\'s duration)'
        : 'FIRST TOUCH (the LAST PRE-CONTACT sample — declared)'}, on \`ownTarget\` first `
      + `contacts that ${g === 'held' ? 'were HELD' : 'BOUNCED'}`,
      `\`ownTarget\` ${g} contacts with a defined angle at ${st2}`,
      (r) => r.hdgSum[gi][si], (r) => r.hdgN[gi][si]);
  }
  defFace(`flight.frontAtReleaseShare.${g}`, 'share',
    `(iv) the share FRONT-ON at RELEASE (angle inside the classifier's OWN \`Math.SQRT1_2\` `
    + `cone), \`ownTarget\` ${g} contacts`, `\`ownTarget\` ${g} contacts with a release angle`,
    (r) => r.frontRelHits[gi], (r) => r.frontRelN[gi]);
  defFace(`flight.frontAtReleaseSideOrBackAtTouchShare.${g}`, 'share',
    `⭐⭐ (iv) OF THE CONTACTS FRONT-ON AT RELEASE, the share that is SIDE-OR-BACK AT TOUCH — `
    + `\`ownTarget\` ${g} contacts. This is #381 item 4(i)'s labelled hypothesis (the flight `
    + 'undoes the turn) given a number', `\`ownTarget\` ${g} contacts front-on at release with `
    + 'a defined touch angle',
    (r) => r.frontRelSideBackHits[gi], (r) => r.frontRelTouchN[gi]);
  defFace(`flight.meanLateralSpeedAtMid.${g}`, 'metres per second',
    `(iv) the RECEIVER'S LATERAL SPEED at mid-flight — the component of his velocity `
    + `PERPENDICULAR to the ball's launch line — \`ownTarget\` ${g} contacts`,
    `\`ownTarget\` ${g} contacts with a launch line`, (r) => r.latSum[gi], (r) => r.latN[gi]);
}

/* ---- (v) THE OPPONENT FIRST CONTACTS ---- */
for (const c of OPP_CELLS) {
  const i = OPI(c);
  defFace(`opponent.${c}`, 'share',
    `⭐⭐ (v) 「传到对面身上」 PARTITIONED — \`${c}\`: was the first-contact opponent inside the `
    + 'PASS CORRIDOR at the RELEASE tick, did he ARRIVE during the flight (outside at release, '
    + 'inside at contact), or was he STRUCK THROUGH (never inside)? The corridor is '
    + '`laneOpenness`\'s OWN geometry — `closestPointOnSegment(launch, E, o.pos)` CALLED — at '
    + 'its OWN scale `DV_CORRIDOR_SCALE` = 4 m with its OWN clear-the-kicker guard '
    + '`DV_CLEAR_RADIUS` = 1.5 m (both anchored)',
    'opponent first contacts', (r) => r.oppCell[i], (r) => r.oppN);
  defFace(`opponent.tight.${c}`, 'share',
    `(v) THE TIGHT-CORRIDOR ROBUSTNESS BIN — the same three-way at half-width `
    + `\`CONTROL_RADIUS\` instead of \`DV_CORRIDOR_SCALE\` — \`${c}\`. ⛔ A BIN, not a second `
    + 'definition', 'opponent first contacts', (r) => r.oppCellTight[i], (r) => r.oppN);
}

/* ---- THE LEDGER'S OWN RECEIPTS (⛔ never football effect sizes) ---- */
defFace('ledger.episodesPerMatch', 'episodes per match (240 s match clock)',
  'THE LEDGER RECEIPT — contest episodes per match', 'matches walked',
  (r) => r.episodes, (r) => r.matches);
defFace('ledger.contactsPerMatch', 'ledger contacts per match (240 s match clock)',
  'THE LEDGER RECEIPT — recorded contest contacts per match', 'matches walked',
  (r) => r.ledgerContacts, (r) => r.matches);
for (const k of LEDGER_KINDS) {
  const ki = LEDGER_KINDS.indexOf(k);
  defFace(`ledger.kindSeenPerMatch.${k}`, 'contacts per match (240 s match clock)',
    `THE LEDGER RECEIPT — whole-match \`${k}\` contacts per match (⛔ never a football effect `
    + 'size)', 'matches walked', (r) => r.kindSeen[ki], (r) => r.matches);
}

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
  if (f === undefined) { banner(`BN-C0 FATAL — unknown face ${k}/${arm}`); process.exit(3); }
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
const delta = (faceKey: string): DeltaRow => {
  const d = deltas.find((x) => x.face === faceKey);
  if (d === undefined) { banner(`BN-C0 FATAL — unknown Δ ${faceKey}`); process.exit(3); }
  return d as DeltaRow;
};

/* ========================================================================== */
/* §14 THE PRE-REGISTERED READS — #381 item 6(vi)'s FIVE SENTENCES, VERBATIM.
   The SELECTOR is a STORED majority BOOLEAN per candidate class (majority = share > 0.5);
   if none holds a majority, `mixed` is true. canon, VERBATIM: "a counterfactual verdict
   sentence ('had X been scored, the rule would read W') quotes a word the instrument STORED
   by applying the frozen rule to X's stored interval; a universal sentence about a table
   ('every bin', 'the one bin') is a stored boolean or is not written".                      */
/* ========================================================================== */
const READ_SENTENCES: Record<BounceClass | 'mixed', string> = {
  C1: 'THE THIRD SENTENCE IS A CONTROL-QUALITY QUESTION — the BK quality law is named.',
  C2: 'THE THIRD SENTENCE IS A PASS-WEIGHT QUESTION — step ④ (the strike parameter space) is named.',
  C3: 'THE THIRD SENTENCE IS A LANE-OCCUPANCY QUESTION — steps ②/③ (attacking off-ball eyes; '
    + 'designations retire) are named.',
  C4: 'THE THIRD SENTENCE IS A REACTION QUESTION — and the dosed arm says whether the user\'s '
    + 'world still has it.',
  C5: 'THE THIRD SENTENCE IS MIXED — the commander decides with the table.',
  mixed: 'THE THIRD SENTENCE IS MIXED — the commander decides with the table.',
};
const AGREE_SENTENCE = {
  agrees: 'THE DOSED WORLD AGREES ON THE MAJORITY CLASS',
  disagrees: 'THE DOSED WORLD DISAGREES ON THE MAJORITY CLASS',
};
const readFor = (arm: Arm): Record<string, unknown> => {
  const shares: Record<string, number> = {};
  const majority: Record<string, boolean> = {};
  for (const c of CLASSES) {
    const v = face(`composition.${c}`, arm).value;
    shares[c] = v;
    majority[c] = Number.isFinite(v) && v > 0.5;
  }
  const winners = CLASSES.filter((c) => majority[c]);
  const mixed = winners.length !== 1;
  const majorityClass: BounceClass | 'mixed' = mixed ? 'mixed' : winners[0];
  return {
    arm, armLabel: ARM_LABEL[arm], shares, majority, mixed, majorityClass,
    /** ⭐ C5 is a REMAINDER class: a C5 majority is NOT a named repair step, so the frozen
     *  form prints the no-majority sentence for it — stated at §P.C, before any battery seed. */
    sentence: majorityClass === 'C5' ? READ_SENTENCES.mixed : READ_SENTENCES[majorityClass],
    resolvedBounces: face('composition.C1', arm).denominator,
  };
};
const READS = { E: readFor('E'), D: readFor('D') };
const E_MAJ = (READS.E as { majorityClass: string }).majorityClass;
const D_MAJ = (READS.D as { majorityClass: string }).majorityClass;
const DOSED_AGREES = E_MAJ === D_MAJ;
const AGREE_WORD = DOSED_AGREES ? AGREE_SENTENCE.agrees : AGREE_SENTENCE.disagrees;
/** ⭐ THE READ OF RECORD is selected on the E arm's stored booleans; D's are printed beside. */
const READ_OF_RECORD = (READS.E as { sentence: string }).sentence;
const READ_LIST = [READ_OF_RECORD, AGREE_WORD];

/* ========================================================================== */
/* §15 THE SIZING, SHOWN — the house form                                      */
/* ========================================================================== */
const Z975 = 1.959963985;
const Z80 = 0.8416212336;
const ZSUM = Z975 + Z80;
const SMOKE_N = 12;
/** the §DEV-PREFLIGHT 12-cluster SCRATCH SMOKE's own realised half-widths (seeds
 *  900,002,800–811), read out of the smoke artifact's own `faces[].halfWidth` fields on the E
 *  arm — never re-typed from the console's rounded print. */
const SIZING_INPUTS: { face: string; group: string; hwSmoke: number; target: number }[] = [
  { face: 'composition.C1@E', group: '⭐⭐ THE BOUNCE COMPOSITION — C1 share, arm E',
    hwSmoke: 0.09061511928715146, target: 0.05 },
  { face: 'composition.C3@E', group: '⭐⭐ THE BOUNCE COMPOSITION — C3 share, arm E',
    hwSmoke: 0.08418638155899302, target: 0.05 },
  { face: 'bounce.rate.ownBody@E', group: '⭐⭐ THE BOUNCE RATE — own-body pooled, arm E',
    hwSmoke: 0.040642249633885325, target: 0.05 },
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
  contactClass: number[]; kindN: number[]; sectorN: number[]; alongBins: number[];
  holdOutcomeK: number[][]; holdOutcome2K: number[][]; compN: number[]; c5SubN: number[];
  c4Overlap: number[]; bounceReboundTable: number[]; originN: number[];
  hdgBins: number[][][]; latBins: number[][];
  launchN: number[]; distN: number[]; relSpdN: number[]; bodySpdN: number[];
  oppCell: number[]; oppCellTight: number[]; kindSeen: number[];
};
const emptyPooled = (): Pooled => ({
  contactClass: zeros(CONTACTS.length), kindN: zeros(KIND_CELLS.length),
  sectorN: zeros(SECTORS.length), alongBins: zeros(ALONG_BINS),
  holdOutcomeK: zeros2(2, HOLDS.length), holdOutcome2K: zeros2(2, HOLDS.length),
  compN: zeros(CLASSES.length), c5SubN: zeros(C5_SUBS.length), c4Overlap: zeros(4),
  bounceReboundTable: zeros(4), originN: zeros(ORIGIN_CELLS.length),
  hdgBins: [zeros2(3, ANGLE_BINS), zeros2(3, ANGLE_BINS)], latBins: zeros2(2, LATERAL_BINS),
  launchN: zeros(LAUNCH_BINS), distN: zeros(DIST_BINS), relSpdN: zeros(RELSPD_BINS),
  bodySpdN: zeros(BODYSPD_BINS), oppCell: zeros(OPP_CELLS.length),
  oppCellTight: zeros(OPP_CELLS.length), kindSeen: zeros(LEDGER_KINDS.length),
});
const poolFrom = (rows: readonly Row[]): Pooled => {
  const p = emptyPooled();
  for (const r of rows) {
    addInto(p.contactClass, r.contactClass); addInto(p.kindN, r.kindN);
    addInto(p.sectorN, r.sectorN); addInto(p.alongBins, r.alongBins);
    addInto2(p.holdOutcomeK, r.holdOutcomeK); addInto2(p.holdOutcome2K, r.holdOutcome2K);
    addInto(p.compN, r.compN); addInto(p.c5SubN, r.c5SubN); addInto(p.c4Overlap, r.c4Overlap);
    addInto(p.bounceReboundTable, r.bounceReboundTable); addInto(p.originN, r.originN);
    for (let g = 0; g < 2; g++) addInto2(p.hdgBins[g], r.hdgBins[g]);
    addInto2(p.latBins, r.latBins);
    addInto(p.launchN, r.launchN); addInto(p.distN, r.distN);
    addInto(p.relSpdN, r.relSpdN); addInto(p.bodySpdN, r.bodySpdN);
    addInto(p.oppCell, r.oppCell); addInto(p.oppCellTight, r.oppCellTight);
    addInto(p.kindSeen, r.kindSeen);
  }
  return p;
};
const mediansFrom = (p: Pooled): Record<string, unknown> => ({
  alongLaunchVelocityMs: binMedian(p.alongBins, ALONG_BIN_MS, true),
  launchSpeedMs: binMedian(p.launchN, LAUNCH_BIN_MS, false),
  passDistanceMetres: binMedian(p.distN, DIST_BIN_M, false),
  relativeSpeedMs: binMedian(p.relSpdN, RELSPD_BIN_MS, false),
  bodySpeedMs: binMedian(p.bodySpdN, BODYSPD_BIN_MS, false),
  lateralSpeedAtMidMs: HDG_GROUPS.map((_, g) => binMedian(p.latBins[g], LATERAL_BIN_MS, false)),
  headingAngleDeg: HDG_GROUPS.map((_, g) => STAGES.map(
    (_s, si) => binMedian(p.hdgBins[g][si], ANGLE_BIN_DEG, false),
  )),
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
const ALL_SCRATCH = [...LOCKSTEP_SEEDS, ...TRACE_INERT_SEEDS];

const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: ARMS.every((arm) => cells.every((c) => c.rows[arm].worldOk && c.rows[arm].traceOn
      && c.rows[arm].rcBfAbsent && c.rows[arm].genomeClean)
      && receiptRows[arm].worldOk && receiptRows[arm].traceOn && receiptRows[arm].rcBfAbsent
      && receiptRows[arm].genomeClean),
    note: '⭐⭐ PER ARM, on EVERY walked match and the construction receipt: '
      + `\`raArmedVersion(m) === ${RA_WORLD_VERSION}\`; \`traceContests\` TRUE; every RC/BF `
      + 'flag ABSENT (`rcAnticipate`, `rcReady`, `bfFacingCost` all !== true — the RC arc\'s '
      + 'banked seams are dormant here); and `info.genome` carries NO world-12 pin, NO corridor '
      + 'weight and NO RC gene (canon: dose placement, #270.2 / #334 item 1). Asserted off the '
      + 'REAL constructed match — the composer is CALLED, never copied',
  },
  gDoseSource: {
    ok: DOSED_ARM_REACHABLE && L3_DOSE_BYTES_SHA === L3_DOSE_PIN
      && PC_DOSE_BYTES_SHA === PC_DOSE_PIN,
    note: '⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a '
      + 'self-declared field". The DOSED arm takes its doses from the SHIPPED LOADERS '
      + '(`loadL3Dose` / `loadPcDose`, CALLED); this gate hashes the FILE BYTES this process '
      + `read from ${L3_DOSE_FILE} and ${PC_DOSE_FILE} and compares them to the values PINNED `
      + 'in #381 item 6 — a mismatch is `process.exit(3)`, which is what PT-C0 §COMMANDER '
      + 'CORRECTIONS item 2 required of the next dosed arm. ⚠ `pcDoseGuard.bytesChecked` is '
      + `${pcDoseGuard.bytesChecked} under bare node (the loader says so itself), which is `
      + 'exactly why this gate hashes the bytes independently',
  },
  gTraceInert: {
    ok: TRACE_INERT_OK,
    note: '⭐⭐ THE LEDGER FLAG ONLY RECORDS: `traceContests` is read at exactly ONE place — '
      + '`traceContact`\'s own early return (`if (!this.traceContests) return;`, anchored) — '
      + 'and no branch on it changes a byte of the world. PROVEN on shared out-of-band scratch '
      + `seeds ${TRACE_INERT_SEEDS.join(', ')}: the same seed built with the trace ON and OFF `
      + `yields a BYTE-IDENTICAL whole-match signature on all ${traceInertRows.length} arm × `
      + 'seed pairs',
  },
  gLedgerNonVacuous: {
    ok: ARMS.every((arm) => tot(arm, (r) => r.episodes) > 0
      && tot(arm, (r) => r.ledgerContacts) > 0
      && tot(arm, (r) => r.kindN[KI('unrecorded')]) < tot(arm, (r) => r.ownBodyContacts)),
    note: '⛔ the ledger is NON-VACUOUS on BOTH arms: contest episodes exist (E '
      + `${tot('E', (r) => r.episodes)}, D ${tot('D', (r) => r.episodes)}) and recorded `
      + `contacts exist (E ${tot('E', (r) => r.ledgerContacts)}, D `
      + `${tot('D', (r) => r.ledgerContacts)}). Every kind counted comes from `
      + '`ContestContactKind`\'s OWN union, read off the source (the vocabulary is the type, '
      + 'never re-typed), and the `unrecorded` class — a contact tick with NO ledger entry — is '
      + 'a PUBLISHED RECEIPT (`partition.kind.share.unrecorded`), NEVER imputed into a kind. '
      + '⚠ this gate reads LIVENESS, never a direction and never a magnitude',
  },
  gAnchoredConstants: {
    ok: ANCHORS_OK,
    note: `⭐⭐ anchored extraction with line receipts, ${ANCHORS.length} sites: the contest `
      + 'ledger (the config door, the flag field, its ONE assignment, the public array, the ONE '
      + 'writer, its early return and its THREE call sites) · the `ContestContactKind` / '
      + '`ContestOrigin` / `ContestContact` / `ContestEpisode` shapes · THE CLAIM BUILDER\'S '
      + 'maxSpeed BRANCH with the `24` literal pinned AT THAT SITE · the kind it decides · the '
      + '`intended` test · THE `readyTick` FORM and `CONTACT_CONTROL_DELAY_TICKS` (K) · the '
      + 'resolver\'s gate and its `giveBall` success path · `simTick === stepCount` · '
      + '`CONTROL_MAX_SPEED` · `GK_CONTROL_MAX_SPEED` · `CONTROL_RADIUS` · `GRAVITY` · PT-C0\'s '
      + '(RA-T1B\'s) `isMeasurableGroundPass` / `isGroundLaunch` / klass ladder · THE FOUR '
      + '`ball.lastTouch = p;` assignment sites, RECOUNTED · PT-C0\'s own class ladder and '
      + 'rebound sign · the `BodySector` union AND THE LAW\'S OWN SQRT1_2 CONES verbatim · '
      + '`ballAccessGeometry` · `bodyDir` · `registerPass`\'s `pendingPass` · the CORRIDOR '
      + 'geometry (`DV_CORRIDOR_SCALE`, `DV_CLEAR_RADIUS`, `laneOpenness`\'s own normalizer '
      + 'line, `closestPointOnSegment` and the shipped corridor loop) · the PC seat\'s '
      + 'READ-ONLY `holdSnapshot`, its own liveness rule and the engine\'s own read of the same '
      + 'map · world 12\'s flag composition and the RA branch that ignores the tables argument. '
      + `The kind vocabulary (${LEDGER_KINDS.length}), sector vocabulary (${SECTORS.length}) `
      + `and origin vocabulary (${ORIGINS.length}) are READ OFF THEIR OWN UNIONS`,
  },
  gWalkFixtures: {
    ok: FIXTURES_OK,
    note: `${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length} walk-side predicate `
      + 'fixtures — PT-C0\'s population and class ladders, THE BOUNCE PREDICATE on constructed '
      + 'settle-window states (including the K window itself and the `unresolved` case), THE '
      + 'CLASS PRECEDENCE on constructed contacts (every C1–C5 branch and every C5 sub), THE '
      + 'KIND CROSS-CHECK\'s three-way maxSpeed branch, THE HEADING ARITHMETIC (including the '
      + 'front-on cone DERIVED from `Math.SQRT1_2`, never typed as 45), THE CORRIDOR TEST '
      + '(both half-widths and the clear-the-kicker guard), PT-C0\'s rebound sign, the LAW\'S '
      + 'OWN SECTOR CLASSIFIER **CALLED** on constructed geometries, and every bin helper are '
      + 'PURE functions called by BOTH the walk and this table',
  },
  gClassesNonVacuous: {
    ok: ARMS.every((arm) => tot(arm, (r) => r.gpFlights) > 0
      && tot(arm, (r) => r.ownBodyContacts) > 0
      && tot(arm, (r) => sum(r.ownBounceK)) > 0
      && tot(arm, (r) => r.contactClass[CTI('ownTarget')]) > 0
      && tot(arm, (r) => r.contactClass[CTI('ownNonTarget')]) > 0
      && tot(arm, (r) => r.oppN) > 0
      && tot(arm, (r) => r.hdgN[0][0]) > 0 && tot(arm, (r) => r.hdgN[1][0]) > 0
      && sum(tot(arm, (r) => sum(r.compN)) > 0 ? [1] : [0]) === 1),
    note: '⛔ no face is computed on an empty class: EVERY arm has measured ground-pass flights '
      + `(E ${tot('E', (r) => r.gpFlights)}, D ${tot('D', (r) => r.gpFlights)}), own-body first `
      + `contacts (E ${tot('E', (r) => r.ownBodyContacts)}, D `
      + `${tot('D', (r) => r.ownBodyContacts)}), BOUNCES (E ${tot('E', (r) => sum(r.ownBounceK))}`
      + `, D ${tot('D', (r) => sum(r.ownBounceK))}), ownTarget contacts both HELD and BOUNCED `
      + 'with a defined release angle, and opponent first contacts (E '
      + `${tot('E', (r) => r.oppN)}, D ${tot('D', (r) => r.oppN)}). ⚠ LIVENESS only — never a `
      + 'direction and never a magnitude',
  },
  gLockstep: {
    ok: LOCKSTEP_OK,
    note: '⭐ THE INSTRUMENT INSTALLS NO WRAPPER AT ALL: observation is pure per-tick reads of '
      + 'public `Match` state after `m.step(DT)`, the contest ledger is READ after the match, '
      + 'and every classifier it calls (`ballAccessGeometry`, `closestPointOnSegment`, the PC '
      + 'seat\'s `holdSnapshot`) is a PURE query that awards nothing and prunes nothing. Proven '
      + 'anyway — the same scratch seed walked OBSERVED and UNOBSERVED yields a BYTE-IDENTICAL '
      + `whole-match signature on all ${lockstepRows.length} arm × out-of-band-scratch-seed walks`,
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
      + 'the construction receipt lie inside block 12,540,000–999, each seed is walked ONCE PER '
      + `ARM (${ARMS.length} arms ⇒ ${walksBooked} walks booked), the unwalked tail is `
      + 'DECLARED in the `seeds` block, and EVERY scratch seed this instrument walks (lockstep '
      + 'AND trace-inertness) is out-of-band and STORED there — canon, VERBATIM: "verifier '
      + 'scratch walks use the stage\'s own consumed band or the out-of-band scratch range '
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
  'contactClasses', 'sectors', 'ledgerKinds', 'origins', 'holdOutcomes', 'classes',
  'doseSource', 'seeds', 'stats', 'anchoredSites', 'fixtures', 'lockstep', 'traceInert',
  'perf', 'sizing', 'perSeedCells', 'constructionReceipt',
] as const;

const artifact: Record<string, unknown> = {
  stage: {
    id: 'BN-C0',
    title: '「弹回」 THE BOUNCE CENSUS — what the engine does when a ground pass meets one of '
      + 'OUR OWN bodies and we do not come away with it, partitioned by the engine\'s OWN '
      + 'ledger, on world 12 EMPTY-BOOK and DOSED arms paired on shared seeds',
    doc: 'docs/world-model/BN-C0-BOUNCE-CENSUS.md',
    lineage: 'PT-C0 (the population, the `ball.lastTouch` first-body channel and the sector '
      + 'read, REUSED) → the RC arc → RC-T1b (FAIL: the third sentence is NOT a '
      + 'readiness/sector problem) → #381 item 6 (this census)',
    censusFormOfRecord: 'docs/world-model/RC-C0B-DETECTOR-CENSUS.md',
    authorizedBy: 'COMMANDER RULING #381 item 6',
    userVerdictVerbatim: '12我看了下,还是有人挤人,传不出去球,传到人身上弹回,或经常传到对面身上',
    kind: 'CENSUS — it publishes MEASUREMENTS. It scores no hypothesis and arms no mechanism. '
      + 'The FIVE READ SENTENCES of #381 item 6(vi) are FROZEN LITERALS selected by STORED '
      + 'majority booleans. The commander rules.',
    xSrcZero: 'no file under `src/` is created or edited. The probe CALLS shipped exports and '
      + 'reads public `Match` state per tick; the contest-episode ledger is READ, never '
      + 're-implemented. THERE IS NO WRAPPER AT ALL — `gLockstep` proves observed ≡ unobserved '
      + 'byte for byte PER ARM, and `gTraceInert` proves the ledger flag itself is byte-inert.',
    canonEngineLedgersBeforeHeuristics: 'VERBATIM: "an event attribution reads the engine\'s '
      + 'own record when one exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic '
      + 'is written only where no record exists, and says so" (home: RC-T1B-READY-EXAM.md '
      + '§COMMANDER CORRECTIONS item 5, ruling #381 item 3). WHAT IS READ FROM THE LEDGER: the '
      + 'contact KIND, the episode ORIGIN, the control attempt\'s own resolution (possession at '
      + '`readyTick`), `ball.lastTouch`, the PC seat\'s own hold map. WHAT IS A HEURISTIC, SAID '
      + 'SO: (1) the probe\'s own maxSpeed evaluation (the engine keeps no per-contact speed '
      + 'record — it is a ONE-TICK-LAGGED reconstruction, CROSS-CHECKED against the ledger\'s '
      + 'kind and the agreement share published); (2) the PASS CLASS toFeet/carried (read off '
      + 'the wind-up record\'s own `aimLead`, PT-C0\'s channel); (3) the SECTOR at the END of '
      + 'the contact tick (PT-C0\'s declared limit, inherited).',
    mode: MODE ?? 'full', overrideReasons: OVERRIDE_REASONS,
    generatedAtUtc: new Date().toISOString(),
    instrument: 'scripts/probes/bn-c0-bounce-census.ts',
    instrumentSha256: sha(readFileSync('scripts/probes/bn-c0-bounce-census.ts', 'utf8')),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: Object.fromEntries(Object.keys(SRC_OF).map((p) => [p, sha(SRC_OF[p])])),
  },
  arms: ARMS.map((arm) => ({
    arm, label: ARM_LABEL[arm],
    composition: arm === 'E'
      ? 'a4MatchFlags(12) as construction flags + armA4World(m, null, 12) — the EMPTY-BOOK '
        + 'form. `null` L3 dose ⇒ the defence books stay as the season left them; `null` PC '
        + 'dose ⇒ the recognition books are born absent.'
      : 'a4MatchFlags(12) + armA4World(m, null, 12, l3Dose, pcDose) via the SHIPPED LOADERS — '
        + 'THE FORM THE USER PLAYS. PT-C0 §P.D traced that the tables argument cannot reach '
        + 'worlds 11/12 at all, so the two arms differ ONLY in the two DOSES.',
    constructorTrace: 'traceContests: true (BOTH arms; `gTraceInert` proves it is byte-inert)',
    gate: `raArmedVersion(m) === ${RA_WORLD_VERSION}`,
  })),
  definitions: {
    population: '⭐⭐ PT-C0\'s own, BYTE FOR BYTE: every MEASURED GROUND PASS '
      + '(`isMeasurableGroundPass`: shortPass | throughBall | cutback, ground launch, with a '
      + 'pending-pass target), registered at the strike via `pendingPass`; ONE flight tracked '
      + 'at a time, a new release RETIRES the previous one.',
    firstBody: '⭐⭐ PT-C0\'s own channel: the FIRST tick after the release at which '
      + '`ball.lastTouch` is a body OTHER than the passer. Classes ownTarget / ownNonTarget / '
      + 'opponent / none — the engine\'s OWN touch channel, its FOUR honest assignment sites '
      + 'anchored and recounted.',
    theBounce: `⭐⭐ THE USER'S EVENT, DEFINED: an OWN-body first contact (ownTarget or `
      + `ownNonTarget) after which the PASSING SIDE does NOT hold the ball at tick `
      + `contactTick + K — the ball being LOOSE, the OPPONENT'S, or OUT. K = ${K_TICKS} ticks, `
      + 'READ OFF the control-attempt law\'s own `readyTick` form '
      + '(`readyTick: this.stepCount + CONTACT_CONTROL_DELAY_TICKS`, anchored). ⛔ K is NOT a '
      + 'typed constant of this census: the form is a CONSTANT offset and does NOT read '
      + '`relativeSpeed` (which the same `PendingControlAttempt` object stores beside it), so K '
      + `is ONE number for every contact. The outcome at contactTick + 2K (${K2_TICKS}) is `
      + 'stored as a ROBUSTNESS BIN — a bin, not a second definition. A contact whose window '
      + 'runs past FULL TIME is `unresolved`: COUNTED, and it enters NO bounce face.',
    theRebound: '⭐⭐ PT-C0\'s OWN rebound face (post-contact velocity along the launch line '
      + 'NEGATIVE), published BESIDE with its OWN denominator and NEVER pooled with the bounce '
      + '— PT-C0 HONEST LIMIT 2 is the reason this census exists. The 2×2 overlap '
      + '(bounce ∧ rebound · bounce ∧ ¬rebound · ¬bounce ∧ rebound · neither) is STORED.',
    thePrecedence: '⭐⭐ THE FROZEN CLASS PRECEDENCE C1 > C2 > C3 > C4 > C5, justified from the '
      + 'engine\'s OWN order of operations: the claim builder decides the contact KIND from the '
      + 'ball\'s speed against THIS body\'s own maxSpeed branch, and that branch reads '
      + '`intended` — so the ledger kind and the target flag are properties of the CONTACT '
      + 'BRANCH ITSELF and are read first. A live PC hold is a DECISION-LAYER state the contact '
      + 'branch never reads at all, so it cannot pre-empt a class the engine\'s own branch '
      + 'defines and is read AFTER them. C4\'s OVERLAPPING counts (total, ∧C1, ∧C2, ∧C3) are '
      + 'published beside the exclusive partition.',
    theCorridor: '⭐⭐ `laneOpenness`\'s OWN geometry — `closestPointOnSegment(launch, E, o.pos)` '
      + 'CALLED — at its OWN scale `DV_CORRIDOR_SCALE` = 4 m (the engine\'s standing answer to '
      + '"how many metres off a passing lane before a defender is irrelevant to it") with its '
      + 'OWN clear-the-kicker guard `DV_CLEAR_RADIUS` = 1.5 m. ⚠ The engine ships NO boolean '
      + 'corridor WIDTH — the shipped corridor is a SOFT exposure whose normalizer this is — so '
      + 'the membership test is this census\'s, built from the engine\'s own two constants and '
      + 'SAID SO; the `CONTROL_RADIUS` half-width is published beside as a tight-corridor bin.',
    theHeadingStages: 'RELEASE = the release tick\'s own sample; MID = the sample nearest half '
      + 'the flight\'s duration; TOUCH = the LAST PRE-CONTACT sample (declared — at the END of '
      + 'the contact tick the ball\'s velocity has already been changed by the contact).',
    kTicks: K_TICKS, k2Ticks: K2_TICKS,
    frontConeDegrees: FRONT_CONE_DEG,
    binEdges: {
      note: '⚠ every width/count here is a BIN EDGE of a stored histogram — never a rule and '
        + 'never a threshold: no read word depends on one.',
      angleDeg: { width: ANGLE_BIN_DEG, bins: ANGLE_BINS },
      launchSpeedMs: { width: LAUNCH_BIN_MS, bins: LAUNCH_BINS },
      distanceM: { width: DIST_BIN_M, bins: DIST_BINS },
      relativeSpeedMs: { width: RELSPD_BIN_MS, bins: RELSPD_BINS },
      bodySpeedMs: { width: BODYSPD_BIN_MS, bins: BODYSPD_BINS },
      lateralSpeedMs: { width: LATERAL_BIN_MS, bins: LATERAL_BINS },
      alongLaunchMs: { width: ALONG_BIN_MS, bins: ALONG_BINS, centreHoldsZero: true },
      flightRetireTicks: FLIGHT_RETIRE_TICKS,
    },
    engineConstants: {
      CONTROL_MAX_SPEED, GK_CONTROL_MAX_SPEED, CONTROL_RADIUS,
      CONTACT_CONTROL_DELAY_TICKS, DV_CORRIDOR_SCALE, DV_CLEAR_RADIUS,
      intendedMaxSpeedLiteralAtItsSite: 24, DT, GRAVITY,
    },
  },
  contactClasses: CONTACTS, sectors: SECTORS, ledgerKinds: KIND_CELLS, origins: ORIGIN_CELLS,
  holdOutcomes: HOLDS,
  classes: { vocabulary: CLASSES, labels: CLASS_LABEL, c5Subs: C5_SUBS, c4Overlap: C4_OVERLAP },
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
    varianceSource: 'THIS census\'s own 12-cluster SCRATCH SMOKE (seeds 900,002,800–811), '
      + 'DISCLOSED IN FULL at the doc\'s §DEV-PREFLIGHT. ⚠ 12 clusters is a NOISY variance '
      + 'estimate. N_FROZEN takes #381 item 6(vii)\'s own cap (N ≤ 998) — the largest the block '
      + 'affords after the construction receipt at 12,540,999.',
    nFrozen: N_FROZEN, arms: ARMS.length, blockAffords: N_FROZEN, rows: sizingRows,
  },
  gates,
  allGreen: Object.values(gates).every((g) => g.ok),
  faces, deltas,
  reads: {
    note: '⭐⭐ #381 item 6(vi)\'s FIVE SENTENCES are FROZEN LITERALS. The selector is the '
      + 'STORED majority boolean per candidate class (majority = exclusive share > 0.5); if no '
      + 'class holds a majority, `mixed` is true and the no-majority sentence prints. The READ '
      + 'OF RECORD is selected on the E arm\'s booleans; D\'s are printed BESIDE.',
    sentences: READ_SENTENCES, agreementSentences: AGREE_SENTENCE,
    E: READS.E, D: READS.D,
    dosedAgreesOnMajorityClass: DOSED_AGREES,
    agreementSentencePrinted: AGREE_WORD,
    readOfRecord: READ_OF_RECORD,
    readListPrinted: READ_LIST,
  },
  medians: {
    note: '⭐ every median below is BIN-DERIVED (the lower edge of the bin whose cumulative '
      + 'count first reaches n/2) from the stored bins, so `gFaces` re-derives each one off the '
      + 'SERIALIZED artifact — canon, VERBATIM: "the re-derivation gate covers EVERY published '
      + 'face; a percentile face requires stored bins"',
    values: medians,
  },
  bins: Object.fromEntries(ARMS.map((arm) => [arm, {
    firstContactClass: { vocabulary: CONTACTS, pooled: pooled[arm].contactClass },
    ledgerKind: { vocabulary: KIND_CELLS, pooled: pooled[arm].kindN },
    ownBodySector: { vocabulary: SECTORS, pooled: pooled[arm].sectorN },
    alongLaunchVelocityMs: { width: ALONG_BIN_MS, bins: ALONG_BINS, centreHoldsZero: true,
      pooled: pooled[arm].alongBins },
    settleOutcomeAtK: { vocabulary: HOLDS, groups: OWN_CLASSES, pooled: pooled[arm].holdOutcomeK },
    settleOutcomeAt2K: { vocabulary: HOLDS, groups: OWN_CLASSES,
      pooled: pooled[arm].holdOutcome2K },
    bounceComposition: { vocabulary: CLASSES, pooled: pooled[arm].compN },
    bounceCompositionC5Subs: { vocabulary: C5_SUBS, pooled: pooled[arm].c5SubN },
    bounceCompositionC4Overlap: { vocabulary: C4_OVERLAP, pooled: pooled[arm].c4Overlap },
    bounceReboundTable: { vocabulary: REB2X2, pooled: pooled[arm].bounceReboundTable },
    contestOrigin: { vocabulary: ORIGIN_CELLS, pooled: pooled[arm].originN },
    headingAngleDeg: { width: ANGLE_BIN_DEG, bins: ANGLE_BINS, groups: HDG_GROUPS,
      stages: STAGES, pooled: pooled[arm].hdgBins },
    lateralSpeedAtMidMs: { width: LATERAL_BIN_MS, bins: LATERAL_BINS, groups: HDG_GROUPS,
      pooled: pooled[arm].latBins },
    launchSpeedMs: { width: LAUNCH_BIN_MS, bins: LAUNCH_BINS, pooled: pooled[arm].launchN },
    passDistanceMetres: { width: DIST_BIN_M, bins: DIST_BINS, pooled: pooled[arm].distN },
    relativeSpeedMs: { width: RELSPD_BIN_MS, bins: RELSPD_BINS, pooled: pooled[arm].relSpdN },
    bodySpeedMs: { width: BODYSPD_BIN_MS, bins: BODYSPD_BINS, pooled: pooled[arm].bodySpdN },
    opponentCorridor: { vocabulary: OPP_CELLS, pooled: pooled[arm].oppCell },
    opponentCorridorTight: { vocabulary: OPP_CELLS, pooled: pooled[arm].oppCellTight },
    ledgerKindSeen: { vocabulary: LEDGER_KINDS, pooled: pooled[arm].kindSeen },
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
    note: '⚠ A MACHINE READING ON ONE MACHINE. The timed region is the WALK, observer reads '
      + 'and the ledger\'s own recording cost included — never the game\'s frame cost.',
  },
  honestLimitsNote: '⛔ canon, VERBATIM: "a stage doc\'s HONEST LIMITS list is the ONE home; '
    + 'the artifact stores that list verbatim or stores none" (home: '
    + 'RC-C0-COOPERATION-CENSUS.md §COMMANDER CORRECTIONS item 3, ruling #367 item 3). THIS '
    + 'ARTIFACT STORES NONE. The list of record is '
    + 'docs/world-model/BN-C0-BOUNCE-CENSUS.md §HONEST LIMITS.',
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
  cmp('firstContactClass', got.contactClass);
  cmp('ledgerKind', got.kindN);
  cmp('ownBodySector', got.sectorN);
  cmp('alongLaunchVelocityMs', got.alongBins);
  cmp('settleOutcomeAtK', got.holdOutcomeK);
  cmp('settleOutcomeAt2K', got.holdOutcome2K);
  cmp('bounceComposition', got.compN);
  cmp('bounceCompositionC5Subs', got.c5SubN);
  cmp('bounceCompositionC4Overlap', got.c4Overlap);
  cmp('bounceReboundTable', got.bounceReboundTable);
  cmp('contestOrigin', got.originN);
  cmp('headingAngleDeg', got.hdgBins);
  cmp('lateralSpeedAtMidMs', got.latBins);
  cmp('launchSpeedMs', got.launchN);
  cmp('passDistanceMetres', got.distN);
  cmp('relativeSpeedMs', got.relSpdN);
  cmp('bodySpeedMs', got.bodySpdN);
  cmp('opponentCorridor', got.oppCell);
  cmp('opponentCorridorTight', got.oppCellTight);
  cmp('ledgerKindSeen', got.kindSeen);
  binChecks.push({ bin: `${arm}.medians.allBinDerived`,
    ok: JSON.stringify(mediansFrom(got)) === JSON.stringify(disk.medians.values[arm]) });
  /* ⭐ THE PARTITIONS re-derive off disk too */
  binChecks.push({ bin: `${arm}.partition.firstContactSumsToFlights`,
    ok: sum(got.contactClass) === sum(rows.map((r) => r.gpFlights)) });
  binChecks.push({ bin: `${arm}.partition.ownClassesSumToOwnBodyContacts`,
    ok: got.contactClass[CTI('ownTarget')] + got.contactClass[CTI('ownNonTarget')]
      === sum(rows.map((r) => r.ownBodyContacts)) });
  binChecks.push({ bin: `${arm}.partition.ledgerKindSumsToOwnBodyContacts`,
    ok: sum(got.kindN) === sum(rows.map((r) => r.ownBodyContacts)) });
  binChecks.push({ bin: `${arm}.partition.settleLadderSumsToOwnClasses`,
    ok: sum(got.holdOutcomeK[0]) === sum(rows.map((r) => r.ownN[0]))
      && sum(got.holdOutcomeK[1]) === sum(rows.map((r) => r.ownN[1]))
      && sum(got.holdOutcome2K[0]) === sum(rows.map((r) => r.ownN[0]))
      && sum(got.holdOutcome2K[1]) === sum(rows.map((r) => r.ownN[1])) });
  binChecks.push({ bin: `${arm}.partition.bounceIsTheLadderMinusSameSideAndUnresolved`,
    ok: [0, 1].every((oi) => sum(rows.map((r) => r.ownBounceK[oi]))
      === got.holdOutcomeK[oi][HOI('loose')] + got.holdOutcomeK[oi][HOI('opponent')]
        + got.holdOutcomeK[oi][HOI('out')]) });
  binChecks.push({ bin: `${arm}.partition.compositionSumsToResolvedBounces`,
    ok: sum(got.compN) === sum(rows.map((r) => sum(r.ownBounceK)))
      && sum(got.c5SubN) === got.compN[BCI('C5')] });
  binChecks.push({ bin: `${arm}.partition.c4OverlapIsAtLeastItsExclusive`,
    ok: got.c4Overlap[0] >= got.compN[BCI('C4')]
      && got.c4Overlap[0] === got.compN[BCI('C4')] + got.c4Overlap[1] + got.c4Overlap[2]
        + got.c4Overlap[3] });
  binChecks.push({ bin: `${arm}.partition.reboundTableSumsInsideOwnBodyContacts`,
    ok: sum(got.bounceReboundTable) <= sum(rows.map((r) => r.rebN))
      && sum(rows.map((r) => r.rebN)) + sum(rows.map((r) => r.rebNoLine))
        === sum(rows.map((r) => r.ownBodyContacts)) });
  binChecks.push({ bin: `${arm}.partition.opponentCellsSumToOpponentContacts`,
    ok: sum(got.oppCell) === sum(rows.map((r) => r.oppN))
      && sum(got.oppCellTight) === sum(rows.map((r) => r.oppN)) });
  binChecks.push({ bin: `${arm}.partition.headingBinsMatchTheirCounts`,
    ok: [0, 1].every((g) => [0, 1, 2].every(
      (s) => sum(got.hdgBins[g][s]) === sum(rows.map((r) => r.hdgN[g][s])),
    )) });
}
/** ⭐⭐ THE READ WORDS, re-derived from the SERIALIZED per-seed cells */
for (const arm of ARMS) {
  const rows = disk.perSeedCells.map((c) => c[arm]);
  const den = sum(rows.map((r) => sum(r.compN)));
  const stored = disk.reads[arm] as {
    shares: Record<string, number | null>; majority: Record<string, boolean>;
    mixed: boolean; majorityClass: string; sentence: string; resolvedBounces: number;
  };
  const shares = Object.fromEntries(CLASSES.map(
    (c) => [c, ratio(sum(rows.map((r) => r.compN[BCI(c)])), den)],
  ));
  const majority = Object.fromEntries(CLASSES.map(
    (c) => [c, Number.isFinite(shares[c]) && shares[c] > 0.5],
  ));
  const winners = CLASSES.filter((c) => majority[c]);
  const mixed = winners.length !== 1;
  const majorityClass = mixed ? 'mixed' : winners[0];
  const wantSentence = majorityClass === 'C5' ? READ_SENTENCES.mixed
    : READ_SENTENCES[majorityClass as BounceClass | 'mixed'];
  binChecks.push({ bin: `reads.${arm}.sharesRederive`,
    ok: CLASSES.every((c) => sameNum(shares[c], stored.shares[c])) && den === stored.resolvedBounces });
  binChecks.push({ bin: `reads.${arm}.majorityBooleansRederive`,
    ok: CLASSES.every((c) => majority[c] === stored.majority[c])
      && mixed === stored.mixed && majorityClass === stored.majorityClass });
  binChecks.push({ bin: `reads.${arm}.sentenceIsTheFrozenLiteral`,
    ok: wantSentence === stored.sentence
      && (Object.values(READ_SENTENCES) as string[]).includes(stored.sentence) });
}
{
  const eMaj = (disk.reads.E as { majorityClass: string }).majorityClass;
  const dMaj = (disk.reads.D as { majorityClass: string }).majorityClass;
  binChecks.push({ bin: 'reads.dosedAgreementIsStored',
    ok: (eMaj === dMaj) === (disk.reads.dosedAgreesOnMajorityClass as boolean)
      && (disk.reads.agreementSentencePrinted as string)
        === (eMaj === dMaj ? AGREE_SENTENCE.agrees : AGREE_SENTENCE.disagrees)
      && (disk.reads.readOfRecord as string)
        === (disk.reads.E as { sentence: string }).sentence });
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
    + 'requires stored bins". The FIVE read sentences, EVERY majority boolean and the dosed '
    + 'agreement word are INCLUDED',
};
gates.gReadWords = {
  ok: binChecks.filter((b) => b.bin.startsWith('reads.')).every((b) => b.ok),
  note: '⭐⭐ THE READ WORDS ARE STORED, NOT TYPED: every majority boolean, the `mixed` flag, '
    + 'the majority class, the printed sentence and the dosed-agreement word are re-derived by '
    + 'applying the FROZEN rule to the SERIALIZED per-seed cells off disk, and every printed '
    + 'sentence must be one of the frozen literals. canon, VERBATIM: "a universal sentence '
    + 'about a table (\'every bin\', \'the one bin\') is a stored boolean or is not written"',
};
artifact.gates = gates;
artifact.gFacesDetail = { faceChecks, binChecks };
const ALL_GREEN = Object.values(gates).every((g) => g.ok);
artifact.allGreen = ALL_GREEN;

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
banner(`BN-C0 — ${ALL_GREEN_FINAL ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to the .RED path'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner('--- §R1 THE FIRST-BODY CLASSES AND THE BOUNCE RATE ---');
for (const arm of ARMS) {
  banner(`  ${arm} first body: none ${f6(face('class.firstBody.none', arm).value)} · ownTarget `
    + `${f6(face('class.firstBody.ownTarget', arm).value)} · ownNonTarget `
    + `${f6(face('class.firstBody.ownNonTarget', arm).value)} · opponent `
    + `${f6(face('class.firstBody.opponent', arm).value)}  n=`
    + `${face('class.firstBody.none', arm).denominator}`);
  banner(`    ⭐ BOUNCE ownTarget ${f6(face('bounce.rate.ownTarget', arm).value)} · `
    + `ownNonTarget ${f6(face('bounce.rate.ownNonTarget', arm).value)} · pooled `
    + `${f6(face('bounce.rate.ownBody', arm).value)}  (PT-C0 rebound beside `
    + `${f6(face('rebound.share', arm).value)})`);
}
banner('');
banner('--- §R2 ⭐⭐ THE BOUNCE COMPOSITION ---');
for (const arm of ARMS) {
  banner(`  ${arm} ${CLASSES.map((c) => `${c} ${f6(face(`composition.${c}`, arm).value)}`).join(' · ')}`
    + `  n=${face('composition.C1', arm).denominator}`);
  banner(`    majority = ${(READS[arm] as { majorityClass: string }).majorityClass}`
    + `  C4 overlap total ${f6(face('composition.C4overlap.total', arm).value)}`);
}
banner('');
banner('--- §R7 THE READS, PRINTED ---');
for (const s of READ_LIST) banner(`  ${s}`);
banner(`  (E majority ${E_MAJ} · D majority ${D_MAJ})`);
banner('');
banner('--- §R4 THE FLIGHT HEADING (E arm) ---');
for (const g of HDG_GROUPS) {
  banner(`  ${g}: release ${f6(face(`flight.meanAngleDeg.${g}.release`, 'E').value)}° · mid `
    + `${f6(face(`flight.meanAngleDeg.${g}.mid`, 'E').value)}° · touch `
    + `${f6(face(`flight.meanAngleDeg.${g}.touch`, 'E').value)}°  frontAtRelease→sideOrBackAtTouch `
    + `${f6(face(`flight.frontAtReleaseSideOrBackAtTouchShare.${g}`, 'E').value)}`);
}
banner('');
banner('--- §R5 THE OPPONENT FIRST CONTACTS ---');
for (const arm of ARMS) {
  banner(`  ${arm} ${OPP_CELLS.map((c) => `${c} ${f6(face(`opponent.${c}`, arm).value)}`).join(' · ')}`
    + `  n=${face('opponent.corridorAtRelease', arm).denominator}`);
}
banner('');
banner(`artifact → ${OUT_PATH}`);
banner(`hashedBodySha256 = ${artifact.hashedBodySha256 as string}`);
banner(`fileByteSha256   = ${FINAL_FILE_SHA}  bytes ${FINAL_ARTIFACT_BYTES}`);
banner(`hashReproducesFromFile = ${HASH_REPRODUCES_FROM_FILE} (final file: ${HASH_REPRODUCES_FINAL})`);
banner(`wall ${((Date.now() - t0Wall) / 1000).toFixed(2)} s  meanWallSecondsPerMatch `
  + `${((artifact.perf as { meanWallSecondsPerMatch: number }).meanWallSecondsPerMatch).toFixed(6)}`);
if (!ALL_GREEN_FINAL) process.exit(1);
