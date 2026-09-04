/**
 * ⭐⭐ BF-C0 — THE MOVEMENT-FACING CENSUS (docs/world-model/BF-C0-MOVEMENT-FACING-CENSUS.md).
 *
 * Authorized by COMMANDER RULING #373 item 6, bound by
 * docs/world-model/BF-BODY-FACING-CONTRACT.md (§-1 the doctrine, §0 the code facts, §2 the
 * law family M-BF.1–4, §3 the arc — this is BF-C0). Lineage: RC-C0b (ruling #373 item 2(d):
 * TURNING IS FREE in this engine, verified twice) → #373 item 4 (the design ruling: a free
 * action cannot be an honest trait) → #373 item 6 (this census). Instrument family: RC-C0b
 * (the envelope, buildMatch, the per-tick read-only observation, the two-arm pairing, the
 * bootstrap, the sizing, the corrected hash order, the receipts block, gFaces off disk) and
 * PT-C0 arm D (the SHIPPED-default construction, with `gShippedConstruction` REUSED).
 *
 * ⛔ THIS IS A CENSUS. It publishes MEASUREMENTS. It applies NO factor, scores no
 * hypothesis, arms no mechanism, adjudicates NOTHING and ships nothing. It sizes the blast
 * radius of a law the contract has not yet written. There is NO pre-commitment.
 * ⛔ X-SRC-ZERO: no file under `src/` is created or edited. The probe CALLS the shipped
 * exports and reads Match state per tick. THERE IS NO WRAPPER AT ALL — `gLockstep` proves
 * observed ≡ unobserved byte for byte.
 *
 * THE FOUR FROZEN QUESTION GROUPS (#373 item 6, verbatim scope):
 *   (a) TODAY'S MISALIGNMENT — over every OPEN-PLAY tick on which a body MOVES (|vel| above
 *       the shipped heading-follow floor `sp > 0.5`, ANCHORED), φ = the angle between
 *       `heading` and `vel` (15° bins to 180°, stored), by action × role × side-of-ball ×
 *       speed bin × whether `faceTarget` is SET; the share φ > 45° and φ > 90°; the MEAN
 *       SPEED per φ bin (the isotropic envelope's receipt); the metres/match covered
 *       misaligned; the faceTarget-driven vs motion-follow-lag split of the misaligned ticks.
 *   (b) THE EXPOSURE TABLE — per action class × role, the moving ticks and the metres in each
 *       φ bin (the table a facing factor would scale), plus THREE frozen (L, B) sensitivity
 *       pairs applied as PURE ARITHMETIC over the stored bins — nothing is applied to the
 *       world.
 *   (c) THE `faceTarget` SEAM MAP — every src site that assigns it, anchored with line
 *       receipts and per-file occurrence COUNTS, each classified; the null-resets beside.
 *   (d) THE REALITY ANCHOR — the literature's backpedal / lateral-shuffle speed fractions,
 *       cited with sources and the executor's verification stated honestly. ⛔ The census
 *       does NOT choose LATERAL or BACK: the commander ratifies them at banking.
 *
 * TWO ARMS, PAIRED ON SHARED SEEDS, each world's own composer CALLED never copied:
 *   E  world 12 EMPTY-BOOK — a4MatchFlags(12) + armA4World(m, null, 12)   [the exams' form]
 *   S  THE SHIPPED DEFAULT — a Match built EXACTLY as the league's worker builds a fixture:
 *      no a4 flags, no arming, contact law OFF (canon: worker fixtures; PT-C0 arm D's own
 *      construction path CALLED, with its `gShippedConstruction` fixture REUSED).
 * The E−S contrast on the misalignment faces is REPORTED (paired), never scored.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve as pathResolve, join as pathJoin } from 'node:path';
import { Match } from '../../src/sim/Match';
import { League } from '../../src/sim/League';
import { DT, AI_INTERVAL } from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, raArmedVersion,
  RA_WORLD_VERSION, RA_WORLD_LEAD, RA_WORLD_WEIGHT,
} from '../../src/game/a4World';
import { TURN_RATE, ACCEL, Player } from '../../src/sim/Player';
import { randomGenome, rcAnticipationWeightOf, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad, randomPlayer } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type ActionType, type Role, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng, hashSeed } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE — no bypass, the RC-C0b §1 form                         */
/* ========================================================================== */
const ENV_WHITELIST = ['BFC0_MODE', 'BFC0_N', 'BFC0_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('BFC0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`BF-C0 FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.BFC0_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('BF-C0 FATAL — BFC0_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.BFC0_N !== undefined ? Number(process.env.BFC0_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('BF-C0 FATAL — BFC0_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.BFC0_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`BFC0_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`BFC0_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`BFC0_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/bf-c0-movement-facing-census.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/bf-c0-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('BF-C0 FATAL — an override run may never write the canonical artifact path');
  process.exit(3);
}

/* ========================================================================== */
/* §2 SMALL HELPERS (the RC-C0b §2 set, unchanged)                             */
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
/** the EDGE-LIST bin: index i = [edges[i-1], edges[i]); the LAST index is the open top */
const edgeBinOf = (v: number, edges: readonly number[]): number => {
  for (let i = 0; i < edges.length; i++) if (v < edges[i]) return i;
  return edges.length;
};
/** unsigned bin: index 0 = [0,width), last index is OVERFLOW (and underflow) */
const binOf = (v: number, width: number, n: number): number => {
  const i = Math.floor(v / width);
  return i < 0 ? 0 : i >= n ? n - 1 : i;
};
/** the MEDIAN of a stored histogram: the bin whose cumulative count first reaches n/2,
 *  reported at the bin's LOWER EDGE × width (a bin-derived median — re-derivable off disk) */
const binMedian = (bins: readonly number[], width: number): number => {
  const n = sum(bins);
  if (n === 0) return Number.NaN;
  let acc = 0;
  for (let i = 0; i < bins.length; i++) {
    acc += bins[i];
    if (acc * 2 >= n) return i * width;
  }
  return (bins.length - 1) * width;
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
const TYPES_PATH = 'src/sim/types.ts';
const A4_PATH = 'src/game/a4World.ts';
const GENOME_PATH = 'src/evolution/genome.ts';
const LEAGUE_PATH = 'src/sim/League.ts';
const EXEC_PATH = 'src/ai/actionExecutor.ts';
const PATHS = [MATCH_PATH, CONST_PATH, PLAYER_PATH, TYPES_PATH, A4_PATH, GENOME_PATH,
  LEAGUE_PATH, EXEC_PATH] as const;
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

/* ⭐⭐ THE MOVEMENT ENVELOPE AND THE HEADING INTEGRATOR — the RC-C0b (c) code fact,
   RE-ANCHORED AT THIS HEAD, line by line, in the order `physicsStep` runs them. */
anchor('⭐⭐ (1) THE VELOCITY CLAMP — `desiredVel` clamped by `topSpeed` ALONE; the heading '
  + 'appears NOWHERE in it', PLAYER_PATH,
  '    const dv = this.desiredVel;\n'
  + '    const max = this.topSpeed;\n'
  + '    const dl = Math.sqrt(dv.x * dv.x + dv.y * dv.y); // clampLen', 1);
anchor('⭐⭐ (2) THE ACCELERATION LIMIT — `accel · dt` toward the target velocity, again with '
  + 'no heading term', PLAYER_PATH, '    const maxDelta = this.accel * dt; // approachV', 1);
anchor('⭐⭐ (3) THE POSITION INTEGRATION — position advances from VELOCITY, and it happens '
  + 'BEFORE the heading is touched at all', PLAYER_PATH,
  '    this.pos.x = this.pos.x + this.vel.x * dt;\n'
  + '    this.pos.y = this.pos.y + this.vel.y * dt;', 1);
anchor('⭐⭐ (4) THE SPEED `sp` — computed from the JUST-INTEGRATED velocity; it is what the '
  + 'heading-follow floor tests, so the census population is the engine\'s own', PLAYER_PATH,
  '    const sp = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);', 1);
anchor('⭐⭐ (5) THE HEADING-FOLLOW FLOOR — `sp > 0.5`: BELOW it a body with no `faceTarget` '
  + 'does not turn at all, so the census population is |vel| > 0.5 (ANCHORED, never a taste '
  + 'constant)', PLAYER_PATH, '    } else if (sp > 0.5) {', 1);
anchor('⭐⭐ (6) THE HEADING ROTATION — toward `faceTarget` (backpedal, 27.5) or else the '
  + 'movement direction, capped at TURN_RATE; it WRITES `heading` and reads nothing back '
  + 'into `vel` or `pos`', PLAYER_PATH,
  '    if (turn) {\n'
  + '      const hx = this.heading.x;\n'
  + '      const hy = this.heading.y;', 1);
anchor('⭐⭐ (7) the shipped docstring of record: the body direction "remains independent of '
  + 'velocity direction"', PLAYER_PATH,
  '   * that could drift, and it remains independent of velocity direction.', 1);
anchor('⭐⭐ TURN_RATE — the engine\'s own turn cap (`agility` is attr-blind: SUBSTRATE-MAP S1)',
  PLAYER_PATH, 'export const TURN_RATE = 6.5;', 1, TURN_RATE);
anchor('⭐⭐ BASE_SPEED — the role speed table the SPEED BINS are anchored to (top entry 7.9 '
  + '× the pace span 1.12 caps `topSpeed` under 8.9 m/s)', PLAYER_PATH,
  "const BASE_SPEED: Record<Role, number> = { GK: 6.4, DF: 7.0, MF: 7.3, WG: 7.9, ST: 7.7 };", 1);
anchor('⭐ the PURE topSpeed getter the speed scale runs through', PLAYER_PATH,
  '    return this.baseSpeed * (0.62 + 0.38 * this.stamina);', 1);
anchor('⭐ ACCEL — the only rate that limits how fast the velocity may change', PLAYER_PATH,
  'export const ACCEL = 14; // m/s^2 toward desired velocity', 1, ACCEL);
anchor('⭐ DT — the sim time step every metre and every rate on this page is measured on',
  CONST_PATH, 'export const DT = 1 / 60;', 1, DT);
anchor('AI_INTERVAL — the decision cadence (context only; the census reads every tick)',
  CONST_PATH, 'export const AI_INTERVAL = 0.15;', 1, AI_INTERVAL);
anchor('⭐ THE EXTERNAL BODY DIRECTION the census reads (`heading`)', PLAYER_PATH,
  '  heading = v2(1, 0);', 1);
anchor('⭐ THE DECISION FIELD the census reads as SET / NULL (`faceTarget`\'s declaration)',
  PLAYER_PATH, '  faceTarget: V2 | null = null;', 1);
/* ⭐ THE ARMS — world 12's own composer CALLED never copied; and the SHIPPED default */
anchor('⭐ WORLD 12\'s flag composition — world 11 CALLED, plus RA_WORLD_DOORS', A4_PATH,
  '    return { ...a4MatchFlags(CORRIDOR_WORLD_VERSION), ...RA_WORLD_DOORS };', 1,
  RA_WORLD_VERSION);
anchor('⭐ WORLD 12\'s arming — world 11\'s arming CALLED, plus the two match-local pins',
  A4_PATH,
  '  armCorridorWorld(match, l3Dose, pcDose);\n'
  + '  for (const side of [0, 1] as const) setRaGenes(match, side);', 1,
  [RA_WORLD_LEAD, RA_WORLD_WEIGHT]);
anchor('⭐⭐ THE SHIPPED CONSTRUCTION — the league\'s ONE `new Match(` site (arm S\'s own '
  + 'construction path, PT-C0 arm D\'s anchor reused)', LEAGUE_PATH, '    return new Match({', 1);
anchor('⭐⭐ the worker-fixture canon\'s own mechanism: `matchFlags` is UNDEFINED on a '
  + '`fromJSON` league, so the spread contributes nothing', LEAGUE_PATH,
  '      ...this.matchFlags,', 1);
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
const AI_OF = (a: ActionType | string): number => {
  const i = (ACTIONS as readonly string[]).indexOf(a);
  return i < 0 ? ACTIONS.length : i; // the overflow slot: an unnamed label would be visible
};
const NACT = ACTIONS.length + 1;
/** ⭐ THE Role VOCABULARY — read off its own union, never re-typed */
const ROLE_NEEDLE = "export type Role = 'GK' | 'DF' | 'MF' | 'WG' | 'ST';";
const ROLES = ((SRC_OF[TYPES_PATH].slice(
  SRC_OF[TYPES_PATH].indexOf(ROLE_NEEDLE),
  SRC_OF[TYPES_PATH].indexOf(ROLE_NEEDLE) + ROLE_NEEDLE.length,
).match(/'([A-Z]+)'/g) ?? []).map((s) => s.slice(1, -1))) as readonly Role[];
anchor('⭐ the Role vocabulary, read off its own union', TYPES_PATH, ROLE_NEEDLE, 1, ROLES);
const RO_OF = (r: Role): number => ROLES.indexOf(r);
const NROLE = ROLES.length;

const ANCHORS_OK = ANCHORS.every((a) => a.occurrences.length === a.want)
  && ACTIONS.length === 23 && ACTIONS.includes('ReceivePass')
  && ROLES.length === 5 && ROLES.join(',') === 'GK,DF,MF,WG,ST'
  && TURN_RATE === 6.5 && ACCEL === 14 && AI_INTERVAL === 0.15 && DT === 1 / 60
  && RA_WORLD_VERSION === 12 && RA_WORLD_LEAD === 1 && RA_WORLD_WEIGHT === 1;

/* ========================================================================== */
/* §3b (c) THE `faceTarget` SEAM MAP — every site, anchored, counted, classified
   canon, VERBATIM: "a seam-map gate pins occurrence COUNTS per needle and enumerates EVERY
   occurrence's site" (home: PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 1)       */
/* ========================================================================== */
const SEAM_NEEDLE = 'faceTarget';
const listTs = (dir: string, out: string[] = []): string[] => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = pathJoin(dir, e.name);
    if (e.isDirectory()) listTs(p, out);
    else if (p.endsWith('.ts')) out.push(p);
  }
  return out;
};
const SRC_FILES = listTs('src').sort();
/** ⭐⭐ PINNED per-file occurrence COUNTS of the needle `faceTarget`, frozen at §P.D BEFORE
 *  any battery seed. A new site anywhere in `src/` turns this gate RED — which is the point:
 *  the law the contract writes would price EVERY one of these decisions. */
const SEAM_COUNTS_PINNED: Record<string, number> = {
  'src/ai/PlayerBrain.ts': 1,
  'src/ai/actionExecutor.ts': 18,
  'src/ai/inLookAct.ts': 1,
  'src/ai/pcLatency.ts': 1,
  'src/ai/receiverAnticipationSeat.ts': 1,
  'src/sim/Match.ts': 12,
  'src/sim/Player.ts': 3,
  'src/sim/rendezvousRecovery.ts': 20,
};
const SEAM_TOTAL_PINNED = 57;
const seamFiles = SRC_FILES.map((f) => {
  const s = readFileSync(f, 'utf8');
  return { file: f, count: occurrences(s, SEAM_NEEDLE).length,
    lines: occurrences(s, SEAM_NEEDLE).map((o) => o.line) };
}).filter((r) => r.count > 0);
const seamCountsOk = seamFiles.length === Object.keys(SEAM_COUNTS_PINNED).length
  && seamFiles.every((r) => SEAM_COUNTS_PINNED[r.file] === r.count)
  && sum(seamFiles.map((r) => r.count)) === SEAM_TOTAL_PINNED;

/** ⭐⭐ EVERY WRITE STATEMENT `<obj>.faceTarget = …`, enumerated with a LINE RECEIPT and the
 *  SOURCE LINE VERBATIM, then CLASSIFIED. `kind`: `decision` = it can write a non-null point
 *  (a facing DECISION the law would price) · `reset` = it only ever writes null.
 *  `awayByDesign`: does the site aim the body AWAY from where it is going, on purpose? */
interface SeamSite {
  file: string; line: number; text: string; kind: 'decision' | 'reset' | 'commentary';
  serves: string; awayByDesign: 'yes' | 'no' | 'depends'; live: string;
}
const SEAM_WRITE_RE = /([A-Za-z_$][A-Za-z0-9_$]*)\.faceTarget\s*=(?!=)/g;
const seamWritesFound: { file: string; line: number; text: string }[] = [];
for (const f of SRC_FILES) {
  const s = readFileSync(f, 'utf8');
  const lines = s.split('\n');
  SEAM_WRITE_RE.lastIndex = 0;
  let m: RegExpExecArray | null = SEAM_WRITE_RE.exec(s);
  while (m !== null) {
    const line = lineOf(s, m.index);
    seamWritesFound.push({ file: f, line, text: lines[line - 1].trim() });
    m = SEAM_WRITE_RE.exec(s);
  }
}
/** THE CLASSIFICATION, FROZEN AT §P.D — file:line ⇒ what it serves. Two of the regex's
 *  matches sit INSIDE COMMENTS (they quote the pattern) and are labelled `commentary`. */
const SEAM_CLASS: Record<string, Omit<SeamSite, 'file' | 'line' | 'text'>> = {
  'src/ai/actionExecutor.ts:155': { kind: 'reset',
    serves: 'THE PER-FRAME DEFAULT — every body starts each executor pass with NO facing '
      + 'decision, so the heading FOLLOWS THE MOVEMENT (above the 0.5 m/s floor). This one '
      + 'line is why the motion-follow class is the big one.',
    awayByDesign: 'no', live: 'every frame, every body' },
  'src/ai/actionExecutor.ts:615': { kind: 'decision',
    serves: '`ShieldBall` — the body turns AWAY FROM THE NEAREST THREAT so it sits between '
      + 'him and the ball; the movement target is the SAME away-direction, so heading and '
      + 'velocity are ALIGNED by construction — the shield pays nothing under a facing law.',
    awayByDesign: 'no', live: 'shipped, open play' },
  'src/ai/actionExecutor.ts:624': { kind: 'decision',
    serves: '`ShieldBall` with no threat found — faces the opponent goal while STANDING '
      + '(target = his own position), so he is mostly below the moving floor.',
    awayByDesign: 'depends', live: 'shipped, open play' },
  'src/ai/actionExecutor.ts:663': { kind: 'decision',
    serves: '`HoldUp` — the pivot shield: he DRIFTS away from the nearest opponent while '
      + 'facing HIS OWN GOAL ("chest toward our own half so the lay-off is played with the '
      + 'facing"). Drifting one way and facing another is exactly what the law prices.',
    awayByDesign: 'yes', live: 'shipped, open play' },
  'src/ai/actionExecutor.ts:671': { kind: 'decision',
    serves: '`GoalkeeperSave` — faces the BALL while moving to the intercept point; the two '
      + 'directions agree when the ball is in front of him and disagree when it is not.',
    awayByDesign: 'depends', live: 'shipped, open play' },
  'src/ai/actionExecutor.ts:679': { kind: 'decision',
    serves: '`GoalkeeperRush` — faces the ball AND runs at the ball: ALIGNED by construction.',
    awayByDesign: 'no', live: 'shipped, open play' },
  'src/ai/actionExecutor.ts:683': { kind: 'decision',
    serves: '⭐⭐ `GoalkeeperPosition` — "backpedal facing the play (27.5)": the canonical '
      + 'AWAY-FROM-MOTION decision in this engine. He retreats and advances along his line '
      + 'with his body pointed at the ball. THE SITE THE LAW WAS WRITTEN FOR.',
    awayByDesign: 'yes', live: 'shipped, open play' },
  'src/ai/actionExecutor.ts:736': { kind: 'decision',
    serves: 'the FREE-KICK WALL — a wall member faces the ball\'s spot while walking to his '
      + 'slot. A restart state: mostly OUTSIDE this census\'s open-play population.',
    awayByDesign: 'depends', live: 'shipped, restarts' },
  'src/ai/actionExecutor.ts:1178': { kind: 'decision',
    serves: 'C7 T1 — the SHOT wind-up plant: faces the aim while held on his own spot '
      + '(walking pace). Dormant in production (`c7Windup` OFF ⇒ `pendingKick` null).',
    awayByDesign: 'depends', live: 'dormant (c7Windup)' },
  'src/ai/actionExecutor.ts:1192': { kind: 'decision',
    serves: '⭐ O1 T1 — THE PASS wind-up plant: faces the AIM while held on his own spot. '
      + 'ARMED in world 12 (arm E); dormant in the shipped default (arm S).',
    awayByDesign: 'depends', live: 'armed in world 12, dormant shipped' },
  'src/ai/actionExecutor.ts:1270': { kind: 'commentary',
    serves: 'a COMMENT quoting `p.faceTarget = ball.pos` (the copied-never-aliased hazard) — '
      + 'not a statement.',
    awayByDesign: 'no', live: 'n/a' },
  'src/ai/actionExecutor.ts:1288': { kind: 'decision',
    serves: 'the PC latency HOLD — a surprised body keeps the facing he applied before the '
      + 'event was observable (a STALE decision, copied never aliased). Dormant: '
      + '`match.pcLatency` is null on every production path.',
    awayByDesign: 'depends', live: 'dormant (pcLatency)' },
  'src/ai/actionExecutor.ts:1341': { kind: 'decision',
    serves: 'the KEEPER HOLDING THE BALL squares up to the opponent goal (Phase 51.2 facing '
      + 'polish) — a dead-ball-ish state, and he is not running.',
    awayByDesign: 'depends', live: 'shipped' },
  'src/ai/actionExecutor.ts:1347': { kind: 'decision',
    serves: 'the RESTART TAKER standing over the ball faces the play. A restart state: '
      + 'outside the open-play population.',
    awayByDesign: 'depends', live: 'shipped, restarts' },
  'src/ai/pcLatency.ts:275': { kind: 'commentary',
    serves: 'a COMMENT quoting `p.faceTarget = ball.pos` — not a statement.',
    awayByDesign: 'no', live: 'n/a' },
  'src/sim/Match.ts:3845': { kind: 'decision',
    serves: 'THE SHOOTER\'S AIM LOCK during the C7 wind-up — the heading integrator composes '
      + 'the strike. Dormant with `c7Windup` OFF.',
    awayByDesign: 'depends', live: 'dormant (c7Windup)' },
  'src/sim/Match.ts:3864': { kind: 'reset',
    serves: 'the shooter\'s aim lock RELEASED at the strike — the follow-through resumes.',
    awayByDesign: 'no', live: 'dormant (c7Windup)' },
  'src/sim/Match.ts:3975': { kind: 'decision',
    serves: '⭐ THE WIND-UP PASSER\'S AIM LOCK — `passer.faceTarget = mate.pos`: he turns '
      + 'onto the receiver while the ball is still at his feet. THIS is the turn RC-C0b '
      + 'measured and found FREE.',
    awayByDesign: 'depends', live: 'armed in world 12, dormant shipped' },
  'src/sim/Match.ts:3998': { kind: 'reset',
    serves: 'the passer\'s aim lock RELEASED at the strike.',
    awayByDesign: 'no', live: 'armed in world 12, dormant shipped' },
  'src/sim/Player.ts:246': { kind: 'reset',
    serves: '`becomeSub` — the substitute arrives with no facing decision.',
    awayByDesign: 'no', live: 'shipped, substitutions' },
  'src/sim/rendezvousRecovery.ts:187': { kind: 'decision',
    serves: 'RESTORE from a snapshot — writes back whatever facing was saved (a COPY, never '
      + 'an alias). It authors no new facing.',
    awayByDesign: 'depends', live: 'rendezvous recovery' },
  'src/sim/rendezvousRecovery.ts:214': { kind: 'decision',
    serves: 'APPLY a stored movement intent — same: it replays a facing another site authored.',
    awayByDesign: 'depends', live: 'rendezvous recovery' },
  'src/sim/rendezvousRecovery.ts:247': { kind: 'decision',
    serves: 'the SHADOW body takes the movement intent\'s facing.',
    awayByDesign: 'depends', live: 'rendezvous recovery' },
  'src/sim/rendezvousRecovery.ts:416': { kind: 'decision',
    serves: 'the COMMIT plan\'s facing is restored onto the player.',
    awayByDesign: 'depends', live: 'rendezvous recovery' },
};
const seamSites: SeamSite[] = seamWritesFound.map((w) => {
  const cls = SEAM_CLASS[`${w.file}:${w.line}`];
  return { ...w, ...(cls ?? { kind: 'decision' as const, serves: '⛔ UNCLASSIFIED — a site '
    + 'that did not exist when §P.D was frozen', awayByDesign: 'depends' as const,
    live: 'UNKNOWN' }) };
});
const SEAM_WRITES_PINNED = 24;      // 22 statements + 2 comment quotations of the pattern
const SEAM_DECISIONS_PINNED = 18;   // sites that can write a NON-NULL point
const SEAM_RESETS_PINNED = 4;       // sites that only ever write null
const SEAM_COMMENTARY_PINNED = 2;
const SEAM_AWAY_BY_DESIGN_PINNED = 2; // HoldUp (own goal while drifting) · GoalkeeperPosition
const seamKind = (k: SeamSite['kind']): number => seamSites.filter((s) => s.kind === k).length;
const SEAM_MAP_OK = seamCountsOk
  && seamSites.length === SEAM_WRITES_PINNED
  && seamSites.every((s) => s.live !== 'UNKNOWN')
  && seamKind('decision') === SEAM_DECISIONS_PINNED
  && seamKind('reset') === SEAM_RESETS_PINNED
  && seamKind('commentary') === SEAM_COMMENTARY_PINNED
  && seamSites.filter((s) => s.awayByDesign === 'yes').length === SEAM_AWAY_BY_DESIGN_PINNED;

/* ========================================================================== */
/* §4 SEEDS — block 12,537,000–999 (#373 item 6)                                */
/* ========================================================================== */
const BLOCK_BASE = 12_537_000;
const BLOCK_TOP = 12_537_999;
/** ⭐⭐ N_FROZEN — sized by the §DEV-PREFLIGHT 12-cluster scratch smoke BEFORE the freeze
 *  commit and BEFORE any battery seed: a 0.01 target on the HEADLINE share (φ > 45° overall,
 *  empty book) and a 0.02 target on the BY-ROLE backpedal share (φ > 90°) for EVERY role.
 *  N_FROZEN = the largest requirement, capped by what the block affords (≤ 999 shared seeds
 *  — the two arms SHARE every seed). */
const N_FROZEN = 200;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_002_300;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + i : BLOCK_BASE + i));
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 80 : BLOCK_TOP;
const LOCKSTEP_SEEDS = [SCRATCH_BASE + 90, SCRATCH_BASE + 91];

/* ========================================================================== */
/* §5 THE ARMS — each world's OWN composition, the composer CALLED never copied  */
/* ========================================================================== */
const ARMS = ['E', 'S'] as const;
type Arm = (typeof ARMS)[number];
const ARM_LABEL: Record<Arm, string> = {
  E: 'world 12 EMPTY-BOOK — the exams\' form: a4MatchFlags(12) + armA4World(m, null, 12)',
  S: 'THE SHIPPED DEFAULT — a Match built EXACTLY as the league\'s worker builds a fixture: '
    + 'no a4 flags, no arming, contact law OFF (PT-C0 arm D\'s own construction path CALLED; '
    + 'canon, VERBATIM: "WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits '
    + 'matchFlags; true since #155, stated now, test-pinned; refines #270\'s E4 correction; '
    + 'matches the perf diagnostic)")',
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
/** ⭐⭐ RC-C0's own population construction (the same genome/squad/side/seed plumbing and the
 *  same 240 s match), so arm k walks seed s with the IDENTICAL population and the two arms
 *  differ ONLY in the world's own composition — that is what makes every Δ PAIRED per seed. */
const buildMatch = (seed: number, arm: Arm): Match => {
  const base = { seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2) };
  if (arm === 'S') {
    /* THE SHIPPED DEFAULT: no a4 flags, no arming — the constructor's own defaults, which is
       exactly what `League.createMatch` passes on a `fromJSON` league (canon: worker
       fixtures; `gShippedConstruction` proves the construction with a fixture). */
    return new Match(base as ConstructorParameters<typeof Match>[0]);
  }
  const m = new Match({
    ...base, ...a4MatchFlags(RA_WORLD_VERSION),
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, RA_WORLD_VERSION);
  return m;
};
const contactLawOf = (m: Match): boolean =>
  (m as unknown as { bkContactLaw: boolean }).bkContactLaw === true;
const WANTED_VERSION: Record<Arm, number> = { E: RA_WORLD_VERSION, S: 0 };

/* ========================================================================== */
/* §6 THE WALK-SIDE PREDICATES — PURE, fixture-backed
   (canon, VERBATIM: "a scored face's walk-side predicate is pinned — anchored extraction or
   fixture — because the re-derivation gate proves arithmetic, not definitions")             */
/* ========================================================================== */
/**
 * ⭐⭐ φ — THE MOVEMENT-FACING ANGLE, in RADIANS: the angle between the body's `heading` (the
 * shipped external body direction) and its `vel` (the shipped velocity), both read at the
 * SAME tick, AFTER `m.step(DT)` — i.e. exactly the pair `physicsStep` left behind. A
 * degenerate heading or a zero velocity names no angle: NaN (and the moving floor already
 * excludes the zero-velocity case).
 */
const phiOf = (hx: number, hy: number, vx: number, vy: number): number => {
  const hl = Math.sqrt(hx * hx + hy * hy);
  const vl = Math.sqrt(vx * vx + vy * vy);
  if (!(hl > 1e-6) || !(vl > 1e-6)) return Number.NaN;
  const c = (hx * vx + hy * vy) / (hl * vl);
  return Math.acos(c < -1 ? -1 : c > 1 ? 1 : c);
};
const RAD2DEG = 180 / Math.PI;

/* --- THE FROZEN BINS (frozen at the FREEZE COMMIT, before any battery seed) --- */
/** ⭐⭐ THE MOVING FLOOR — the shipped heading-follow floor `sp > 0.5` in `physicsStep`,
 *  ANCHORED above. Below it a body with no `faceTarget` does not turn at all, so "which way
 *  is he facing relative to where he is going" is not a question the engine answers. */
const MOVING_FLOOR = 0.5;
/** φ bins: 15° × 12 = 0–180°, stored. */
const PHI_BIN_DEG = 15;
const NPHI = 12;
/** the SPEED bins, frozen from the shipped BASE_SPEED family (top entry 7.9 × the pace span
 *  1.12 and the pure `topSpeed` getter cap a body under 8.9 m/s), cut on the moving floor:
 *  [0.5,2) walk · [2,4) jog · [4,6) run · [6,∞) sprint. */
const SPEED_EDGES = [2, 4, 6] as const;
const NSPD = SPEED_EDGES.length + 1;
/** SIDE-OF-BALL, from `ball.owner` alone. */
const SIDES_OF_BALL = ['own', 'opp', 'loose'] as const;
type SideOfBall = (typeof SIDES_OF_BALL)[number];
const NSIDE = SIDES_OF_BALL.length;
/** the `faceTarget` class: 0 = null (the heading FOLLOWS motion), 1 = SET (a decision). */
const NFACE = 2;
/** ⭐⭐ THE CELL — (action × role × side-of-ball × speed bin × φ bin × faceTargetSet). */
const NCELL = NACT * NROLE * NSIDE * NSPD * NPHI * NFACE;
const CELL_OF = (
  act: number, role: number, side: number, spd: number, phi: number, face: number,
): number => ((((act * NROLE + role) * NSIDE + side) * NSPD + spd) * NPHI + phi) * NFACE + face;
const cellPhi = (idx: number): number => Math.floor(idx / NFACE) % NPHI;
const cellSpd = (idx: number): number => Math.floor(idx / (NFACE * NPHI)) % NSPD;
const cellSide = (idx: number): number => Math.floor(idx / (NFACE * NPHI * NSPD)) % NSIDE;
const cellRole = (idx: number): number => Math.floor(idx / (NFACE * NPHI * NSPD * NSIDE)) % NROLE;
const cellAct = (idx: number): number =>
  Math.floor(idx / (NFACE * NPHI * NSPD * NSIDE * NROLE));
const cellFace = (idx: number): number => idx % NFACE;
/** the EXPOSURE table's own index — (action × role × φ bin), the table the law would scale. */
const NEXP = NACT * NROLE * NPHI;
const EXP_OF = (act: number, role: number, phi: number): number => (act * NROLE + role) * NPHI + phi;
/** ⭐⭐ THE MISALIGNMENT CUTS, frozen: φ > 45° and φ > 90° (the ruling's own two). In bin
 *  terms 45° is the boundary of bins 0–2 and 90° of bins 0–5, so both cuts fall EXACTLY on a
 *  stored bin edge and re-derive from the stored φ histogram. */
const PHI45_FIRST_BIN = 3;   // bins 3..11 are φ > 45°
const PHI90_FIRST_BIN = 6;   // bins 6..11 are φ > 90°

/* --- THE FIXTURES (canon: a headline-bearing predicate needs a composition fixture) --- */
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-12;
/* φ arithmetic on CONSTRUCTED vectors */
fx('phi.straightAhead', near(phiOf(1, 0, 5, 0), 0), true);
fx('phi.rightAngle', near(phiOf(1, 0, 0, 3), Math.PI / 2), true);
fx('phi.straightBackwards', near(phiOf(1, 0, -4, 0), Math.PI), true);
fx('phi.headingNotUnit', near(phiOf(7, 0, 0, 9), Math.PI / 2), true);
fx('phi.fortyFive', near(phiOf(1, 0, Math.SQRT1_2, Math.SQRT1_2), Math.PI / 4), true);
fx('phi.oneThirtyFive',
  near(phiOf(1, 0, -Math.SQRT1_2, Math.SQRT1_2), 3 * Math.PI / 4), true);
fx('phi.signBlind', near(phiOf(1, 0, 0, 3), phiOf(1, 0, 0, -3)), true);
fx('phi.degenerateHeading', Number.isNaN(phiOf(0, 0, 1, 1)), true);
fx('phi.degenerateVelocity', Number.isNaN(phiOf(1, 0, 0, 0)), true);
/* the φ BINS, and the two cuts landing on stored edges */
fx('phiBin.zero', binOf(0, PHI_BIN_DEG, NPHI), 0);
fx('phiBin.justUnder15', binOf(14.999, PHI_BIN_DEG, NPHI), 0);
fx('phiBin.exactly45', binOf(45, PHI_BIN_DEG, NPHI), PHI45_FIRST_BIN);
fx('phiBin.exactly90', binOf(90, PHI_BIN_DEG, NPHI), PHI90_FIRST_BIN);
fx('phiBin.oneEighty', binOf(180, PHI_BIN_DEG, NPHI), NPHI - 1);
fx('phiBin.count', NPHI, 12);
fx('phiCut.45IsABinEdge', PHI45_FIRST_BIN * PHI_BIN_DEG, 45);
fx('phiCut.90IsABinEdge', PHI90_FIRST_BIN * PHI_BIN_DEG, 90);
/* the SPEED bins, cut on the moving floor */
fx('speedBin.atFloor', edgeBinOf(0.5001, SPEED_EDGES), 0);
fx('speedBin.justUnderTwo', edgeBinOf(1.999, SPEED_EDGES), 0);
fx('speedBin.two', edgeBinOf(2, SPEED_EDGES), 1);
fx('speedBin.four', edgeBinOf(4, SPEED_EDGES), 2);
fx('speedBin.six', edgeBinOf(6, SPEED_EDGES), 3);
fx('speedBin.top', edgeBinOf(8.8, SPEED_EDGES), 3);
fx('speedBin.count', NSPD, 4);
/* the CELL index */
fx('cell.first', CELL_OF(0, 0, 0, 0, 0, 0), 0);
fx('cell.last', CELL_OF(NACT - 1, NROLE - 1, NSIDE - 1, NSPD - 1, NPHI - 1, NFACE - 1), NCELL - 1);
fx('cell.count', NCELL, 24 * 5 * 3 * 4 * 12 * 2);
{
  const probe = CELL_OF(7, 3, 2, 1, 9, 1);
  fx('cell.decode.act', cellAct(probe), 7);
  fx('cell.decode.role', cellRole(probe), 3);
  fx('cell.decode.side', cellSide(probe), 2);
  fx('cell.decode.spd', cellSpd(probe), 1);
  fx('cell.decode.phi', cellPhi(probe), 9);
  fx('cell.decode.face', cellFace(probe), 1);
}
fx('exp.index.first', EXP_OF(0, 0, 0), 0);
fx('exp.index.last', EXP_OF(NACT - 1, NROLE - 1, NPHI - 1), NEXP - 1);
fx('binMedian.unsigned', binMedian([0, 0, 5, 0], 1), 2);
fx('binMedian.empty', Number.isNaN(binMedian([0, 0], 1)), true);

/* ========================================================================== */
/* §6b (b) THE FROZEN SENSITIVITY PAIRS — PURE ARITHMETIC OVER THE STORED BINS
   ⛔ NOTHING IS APPLIED TO THE WORLD. This is the census's REPORTED sensitivity: what a
   facing factor of the shape M-BF.1 describes (ahead 1, lateral L, back B, monotone) WOULD
   have subtracted from the metres this world actually ran, if every body had run exactly the
   same paths. It is arithmetic over the census, NOT a simulation — the real law is BF-T0's
   and its effect is BF-T1's. ⛔ The census does NOT choose L or B: these three pairs are
   ILLUSTRATIVE and frozen here, before any battery seed, purely so the exposure has a scale. */
/* ========================================================================== */
const SENS_PAIRS: { name: string; L: number; B: number }[] = [
  { name: 'gentle', L: 0.9, B: 0.8 },
  { name: 'moderate', L: 0.75, B: 0.6 },
  { name: 'steep', L: 0.6, B: 0.45 },
];
/** THE SHAPE, FROZEN: LINEAR IN φ with knots at 0 (1), π/2 (L) and π (B). */
const facingFactor = (phiRad: number, L: number, B: number): number => (phiRad <= Math.PI / 2
  ? 1 + (L - 1) * (phiRad / (Math.PI / 2))
  : L + (B - L) * ((phiRad - Math.PI / 2) / (Math.PI / 2)));
/** the φ BIN CENTRE, in radians — the point the factor is evaluated at (bin i covers
 *  [i·15°, (i+1)·15°), so its centre is (i + 0.5)·15°). */
const phiBinCentreRad = (i: number): number => ((i + 0.5) * PHI_BIN_DEG) / RAD2DEG;
fx('facingFactor.ahead', facingFactor(0, 0.9, 0.8), 1);
fx('facingFactor.lateral', near(facingFactor(Math.PI / 2, 0.9, 0.8), 0.9), true);
fx('facingFactor.back', near(facingFactor(Math.PI, 0.9, 0.8), 0.8), true);
fx('facingFactor.monotone', SENS_PAIRS.every((p) => {
  let prev = Infinity;
  for (let i = 0; i <= 180; i++) {
    const v = facingFactor((i / RAD2DEG), p.L, p.B);
    if (v > prev + 1e-12) return false;
    prev = v;
  }
  return true;
}), true);
fx('phiBinCentre.first', near(phiBinCentreRad(0), 7.5 / RAD2DEG), true);
fx('phiBinCentre.last', near(phiBinCentreRad(NPHI - 1), 172.5 / RAD2DEG), true);
/** THE METRES-LOST ARITHMETIC on a CONSTRUCTED bin table (the fixture the gate needs). */
const metresLostOf = (metresByPhi: readonly number[], L: number, B: number): number => {
  let lost = 0;
  for (let i = 0; i < metresByPhi.length; i++) {
    lost += metresByPhi[i] * (1 - facingFactor(phiBinCentreRad(i), L, B));
  }
  return lost;
};
{
  const tbl = zeros(NPHI);
  tbl[0] = 100;                       // 100 m run at φ ≈ 7.5°
  const want0 = 100 * (1 - facingFactor(7.5 / RAD2DEG, 0.9, 0.8));
  fx('metresLost.aheadBinIsAlmostFree', near(metresLostOf(tbl, 0.9, 0.8), want0), true);
  const tbl2 = zeros(NPHI);
  tbl2[NPHI - 1] = 100;               // 100 m run at φ ≈ 172.5° (backwards)
  const want1 = 100 * (1 - facingFactor(172.5 / RAD2DEG, 0.6, 0.45));
  fx('metresLost.backBinIsExpensive', near(metresLostOf(tbl2, 0.6, 0.45), want1), true);
  fx('metresLost.backCostsMoreThanAhead',
    metresLostOf(tbl2, 0.6, 0.45) > metresLostOf(tbl, 0.6, 0.45), true);
  fx('metresLost.zeroTableIsZero', metresLostOf(zeros(NPHI), 0.6, 0.45), 0);
  const tbl3 = zeros(NPHI);
  tbl3[0] = 40; tbl3[6] = 60;
  fx('metresLost.additive', near(metresLostOf(tbl3, 0.75, 0.6),
    40 * (1 - facingFactor(phiBinCentreRad(0), 0.75, 0.6))
    + 60 * (1 - facingFactor(phiBinCentreRad(6), 0.75, 0.6))), true);
}

/* ========================================================================== */
/* §7 gWalkFixtures — RC-C0b's TWO-BODY FACING FIXTURE, RE-RUN AT THIS HEAD
   ⭐⭐ THE CODE FACT (#373 item 2(d), verified twice): `Player.physicsStep` clamps
   `desiredVel` by `topSpeed`, rate-limits by `accel · dt`, advances `pos` from `vel`, and
   ONLY THEN rotates `heading`. This census re-runs RC-C0b's own fixture as a RECEIPT that
   facing is still free AT THIS HEAD — the baseline the law would move.                      */
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
const FACED_HEADING_OFF_VELOCITY_RAD = phiOf(FIX_FACED.heading[0], FIX_FACED.heading[1], 1, 0);
fx('facingFree.distanceBitIdentical', FIX_FACED.dist === FIX_FREE.dist, true);
fx('facingFree.ratioIsExactlyOne', FACING_DISTANCE_RATIO === 1, true);
fx('facingFree.fixtureIsAlive.freeBodyFacesItsVelocity',
  Math.abs(FIX_FREE.heading[0] - 1) < 1e-9 && Math.abs(FIX_FREE.heading[1]) < 1e-9, true);
fx('facingFree.fixtureIsAlive.facedBodyTurnedAway', FACED_HEADING_OFF_VELOCITY_RAD > 1.5, true);
fx('facingFree.bodyActuallyMoved', FIX_FREE.dist > 5, true);
const FIXTURES_OK = FIXTURES.every((f) => f.ok);

/* ========================================================================== */
/* §8 gShippedConstruction — ARM S ≡ THE WORKER'S OWN CONSTRUCTION (PT-C0's fixture,
   REUSED)                                                                                   */
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
    signatureArmSConstructorShape: sigMine,
    signaturesEqual: sigWorker === sigMine,
    ok: !flagsInToJson && flagsOnFromJson === undefined && flagSetsAgree
      && contactLawOffOnShipped && sigWorker === sigMine,
  };
})();
const SHIPPED_CONSTRUCTION_OK = shippedConstruction.ok === true;
banner(`BF-C0 — gShippedConstruction ${SHIPPED_CONSTRUCTION_OK ? 'GREEN' : 'RED'} `
  + '(arm S ≡ the worker\'s own construction, whole-match signature)');

/* ========================================================================== */
/* §9 THE PER-MATCH ROW — per-seed cells (canon: per-seed cells, ruling #282.2(ii))          */
/* ========================================================================== */
interface Row {
  worldOk: boolean; armedVersion: number; rcFlagOff: boolean; geneAbsent: boolean;
  genomeClean: boolean; contactLaw: boolean;
  ticks: number; matches: number; wallMs: number;
  openPlayTicks: number; bodyTicks: number; movingTicks: number;
  movingBySide: number[];              // [2] — both sides live
  /** ⭐⭐ THE CELL TABLE, SPARSE: flat [idx0, count0, idx1, count1, …] sorted by idx. Every
   *  moving tick lands in exactly one cell of (action × role × side-of-ball × speed bin ×
   *  φ bin × faceTargetSet). Aggregate cells — NEVER raw ticks. */
  cells: number[];
  /** ⭐⭐ THE METRES SIDE: Σ|vel| (m/s) per EXPOSURE cell (action × role × φ bin); metres =
   *  this × DT. Dense (NEXP), because metres cannot be recovered from counts. */
  expSpeedSumMps: number[];
  goals: number; passes: number; passesCompleted: number;
}
const emptyRow = (): Row => ({
  worldOk: false, armedVersion: 0, rcFlagOff: false, geneAbsent: false, genomeClean: false,
  contactLaw: false,
  ticks: 0, matches: 1, wallMs: 0,
  openPlayTicks: 0, bodyTicks: 0, movingTicks: 0, movingBySide: zeros(2),
  cells: [], expSpeedSumMps: zeros(NEXP),
  goals: 0, passes: 0, passesCompleted: 0,
});
/* --- the per-seed cell readers, shared by the battery and by gFaces off disk --- */
const cellPairs = (r: Row): number[] => r.cells;
const sumCells = (r: Row, pick: (idx: number) => boolean): number => {
  let t = 0;
  const c = cellPairs(r);
  for (let i = 0; i < c.length; i += 2) if (pick(c[i])) t += c[i + 1];
  return t;
};
const expMetres = (r: Row, pick: (act: number, role: number, phi: number) => boolean): number => {
  let t = 0;
  for (let i = 0; i < NEXP; i++) {
    const v = r.expSpeedSumMps[i];
    if (v === 0) continue;
    const phi = i % NPHI;
    const role = Math.floor(i / NPHI) % NROLE;
    const act = Math.floor(i / (NPHI * NROLE));
    if (pick(act, role, phi)) t += v * DT;
  }
  return t;
};
const metresLostRow = (r: Row, L: number, B: number): number => {
  let lost = 0;
  for (let i = 0; i < NEXP; i++) {
    const v = r.expSpeedSumMps[i];
    if (v === 0) continue;
    lost += v * DT * (1 - facingFactor(phiBinCentreRad(i % NPHI), L, B));
  }
  return lost;
};

/* ========================================================================== */
/* §10 THE WALK — one match; PURE per-tick reads of Match state, NO WRAPPER      */
/* ========================================================================== */
const walkMatch = (m: Match, arm: Arm, observe: boolean): Row => {
  const tStart = Date.now();
  const row = emptyRow();
  row.armedVersion = raArmedVersion(m);
  row.worldOk = row.armedVersion === WANTED_VERSION[arm];
  row.contactLaw = contactLawOf(m);
  row.rcFlagOff = (m as unknown as { rcAnticipate: boolean }).rcAnticipate === false;
  row.geneAbsent = ([0, 1] as const).every(
    (s) => rcAnticipationWeightOf(m.teams[s].info.genome) === null,
  );
  row.genomeClean = ([0, 1] as const).every((s) => {
    const f = m.teams[s].info.genome as TacticalGenome & { raAccessWeight?: number };
    return f.raAccessWeight === undefined && f.passLeadSupport === undefined
      && f.dvExposureWeight === undefined && f.rcAnticipationWeight === undefined;
  });
  const players = m.allPlayers;
  const acc = new Map<number, number>();
  while (!m.finished) {
    m.step(DT);
    row.ticks += 1;
    if (!observe) continue;
    if (m.phase !== 'playing') continue;
    row.openPlayTicks += 1;
    const owner = m.ball.owner;
    for (const p of players) {
      if (p.sentOff) continue;
      row.bodyTicks += 1;
      const vx = p.vel.x;
      const vy = p.vel.y;
      const sp = Math.sqrt(vx * vx + vy * vy);
      /* ⭐⭐ THE POPULATION: the SHIPPED heading-follow floor, `sp > 0.5` (ANCHORED). */
      if (!(sp > MOVING_FLOOR)) continue;
      const phiRad = phiOf(p.heading.x, p.heading.y, vx, vy);
      if (!Number.isFinite(phiRad)) continue;   // a degenerate heading names no angle
      row.movingTicks += 1;
      row.movingBySide[p.side] += 1;
      const phiBin = binOf(phiRad * RAD2DEG, PHI_BIN_DEG, NPHI);
      const actIdx = AI_OF(p.action.type);
      const roleIdx = RO_OF(p.role);
      const sideIdx = owner === null ? 2 : (owner.side === p.side ? 0 : 1);
      const spdIdx = edgeBinOf(sp, SPEED_EDGES);
      const faceIdx = p.faceTarget === null ? 0 : 1;
      const idx = CELL_OF(actIdx, roleIdx, sideIdx, spdIdx, phiBin, faceIdx);
      acc.set(idx, (acc.get(idx) ?? 0) + 1);
      row.expSpeedSumMps[EXP_OF(actIdx, roleIdx, phiBin)] += sp;
    }
  }
  const keys = [...acc.keys()].sort((a, b) => a - b);
  const flat: number[] = [];
  for (const k of keys) { flat.push(k, acc.get(k) as number); }
  row.cells = flat;
  const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<string, number>[];
  row.goals = st[0].goals + st[1].goals;
  row.passes = st[0].passes + st[1].passes;
  row.passesCompleted = st[0].passesCompleted + st[1].passesCompleted;
  row.wallMs = Date.now() - tStart;
  return row;
};

/* ========================================================================== */
/* §11 THE LOCKSTEP RECEIPT — NO WRAPPER; the observation reads are BYTE-INERT   */
/* ========================================================================== */
banner('BF-C0 — the lockstep receipt (observed vs unobserved; the instrument installs NO wrapper)');
const lockstepRows = LOCKSTEP_SEEDS.flatMap((seed) => ARMS.map((arm) => {
  const observed = buildMatch(seed, arm);
  walkMatch(observed, arm, true);
  const unobserved = buildMatch(seed, arm);
  walkMatch(unobserved, arm, false);
  return { seed, arm, observed: signatureOf(observed), unobserved: signatureOf(unobserved) };
}));
const LOCKSTEP_OK = lockstepRows.every((r) => r.observed === r.unobserved);
banner(`  G-LOCKSTEP ${LOCKSTEP_OK ? 'GREEN' : 'RED'} (${lockstepRows.length} scratch walks)`);

/* ========================================================================== */
/* §12 THE BATTERY — the two arms PAIRED on shared seeds                        */
/* ========================================================================== */
interface Cell { seed: number; E: Row; S: Row }
const cells: Cell[] = [];
banner(`BF-C0 — the battery: ${N} PAIRED seeds × 2 arms, seeds `
  + `${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]}`);
const CHUNK = 25;
for (let start = 0; start < batterySeeds.length; start += CHUNK) {
  for (const seed of batterySeeds.slice(start, start + CHUNK)) {
    cells.push({
      seed,
      E: walkMatch(buildMatch(seed, 'E'), 'E', true),
      S: walkMatch(buildMatch(seed, 'S'), 'S', true),
    });
  }
  banner(`  … ${Math.min(start + CHUNK, batterySeeds.length)}/${batterySeeds.length} seeds `
    + `walked (${((Date.now() - t0Wall) / 1000).toFixed(1)} s)`);
}
/** the world-construction receipt: one walk per arm on its own seed (booked = walked) */
const receiptRows: Record<Arm, Row> = {
  E: walkMatch(buildMatch(RECEIPT_SEED, 'E'), 'E', true),
  S: walkMatch(buildMatch(RECEIPT_SEED, 'S'), 'S', true),
};
const walksBooked = cells.length * ARMS.length + ARMS.length;

/* ========================================================================== */
/* §13 THE ESTIMATOR — CLUSTER BOOTSTRAP over match seeds (consumes NO stats)    */
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

const movingOf = (r: Row): number => sumCells(r, () => true);
const misaligned45 = (r: Row): number => sumCells(r, (i) => cellPhi(i) >= PHI45_FIRST_BIN);
const misaligned90 = (r: Row): number => sumCells(r, (i) => cellPhi(i) >= PHI90_FIRST_BIN);

for (const arm of ARMS) {
  /* --- (a) THE HEADLINE FACES --- */
  defFace(`${arm}.share45`, arm, 'share',
    '⭐⭐ (a) THE HEADLINE — the share of MOVING open-play ticks whose body is running more '
    + 'than 45° off its heading', 'moving open-play body-ticks', misaligned45, movingOf);
  defFace(`${arm}.share90`, arm, 'share',
    '⭐⭐ (a) THE BACKPEDAL SHARE — the share of MOVING open-play ticks with φ > 90° (the body '
    + 'is going, in part, BACKWARDS relative to where it faces)',
    'moving open-play body-ticks', misaligned90, movingOf);
  defFace(`${arm}.faceTargetSetShare`, arm, 'share',
    '⭐⭐ (a) THE DECISION SHARE — the share of moving ticks on which `faceTarget` is SET (an '
    + 'executor made a deliberate facing decision this frame); the rest let the heading '
    + 'FOLLOW the motion', 'moving open-play body-ticks',
    (r) => sumCells(r, (i) => cellFace(i) === 1), movingOf);
  defFace(`${arm}.misalignedFaceTargetDrivenShare`, arm, 'share',
    '⭐⭐ (a) of the MISALIGNED (φ > 45°) moving ticks, the share that are `faceTarget`-DRIVEN '
    + '— a body told where to look. The complement is MOTION-FOLLOW LAG: a heading still '
    + 'catching up at TURN_RATE after the velocity changed direction.',
    'moving ticks with φ > 45°',
    (r) => sumCells(r, (i) => cellPhi(i) >= PHI45_FIRST_BIN && cellFace(i) === 1), misaligned45);
  defFace(`${arm}.misalignedMotionFollowShare`, arm, 'share',
    '⭐⭐ (a) the complement of the row above — φ > 45° with `faceTarget` NULL: pure '
    + 'motion-follow lag', 'moving ticks with φ > 45°',
    (r) => sumCells(r, (i) => cellPhi(i) >= PHI45_FIRST_BIN && cellFace(i) === 0), misaligned45);
  defFace(`${arm}.backpedalFaceTargetDrivenShare`, arm, 'share',
    '(a) of the BACKPEDAL (φ > 90°) moving ticks, the share that are `faceTarget`-driven',
    'moving ticks with φ > 90°',
    (r) => sumCells(r, (i) => cellPhi(i) >= PHI90_FIRST_BIN && cellFace(i) === 1), misaligned90);
  defFace(`${arm}.movingShareOfBodyTicks`, arm, 'share',
    '(a) the share of open-play body-ticks that are MOVING (|vel| above the shipped 0.5 m/s '
    + 'heading-follow floor) — the census population\'s own size',
    'open-play body-ticks (12 bodies × open-play ticks, sendings-off removed)',
    movingOf, (r) => r.bodyTicks);
  defFace(`${arm}.movingTicksPerMatch`, arm, 'moving body-ticks per match (240 s match clock)',
    '(a) moving open-play body-ticks per match', 'matches walked', movingOf, (r) => r.matches);
  defFace(`${arm}.openPlayTicksPerMatch`, arm, 'ticks per match (240 s match clock)',
    'context — open-play (`phase === "playing"`) ticks per match', 'matches walked',
    (r) => r.openPlayTicks, (r) => r.matches);
  defFace(`${arm}.meanSpeedOverall`, arm, 'metres per second',
    '(a) the mean |vel| over all moving open-play ticks', 'moving open-play body-ticks',
    (r) => expMetres(r, () => true) / DT, movingOf);
  /* --- (a) METRES --- */
  defFace(`${arm}.metresPerMatch`, arm, 'metres per match (240 s match clock)',
    '⭐ (a) TOTAL ground covered while MOVING in open play, per match (Σ |vel| · DT)',
    'matches walked', (r) => expMetres(r, () => true), (r) => r.matches);
  defFace(`${arm}.metres45PerMatch`, arm, 'metres per match (240 s match clock)',
    '⭐⭐ (a) METRES per match covered with φ > 45° — the ground a facing factor would price',
    'matches walked', (r) => expMetres(r, (_a, _r, phi) => phi >= PHI45_FIRST_BIN),
    (r) => r.matches);
  defFace(`${arm}.metres90PerMatch`, arm, 'metres per match (240 s match clock)',
    '⭐⭐ (a) METRES per match covered with φ > 90° (backpedalling ground)', 'matches walked',
    (r) => expMetres(r, (_a, _r, phi) => phi >= PHI90_FIRST_BIN), (r) => r.matches);
  /* --- (a) THE φ DISTRIBUTION and THE ENVELOPE RECEIPT --- */
  for (let b = 0; b < NPHI; b++) {
    defFace(`${arm}.phiShare.bin${b}`, arm, 'share',
      `(a) the share of moving ticks in φ bin ${b} = [${b * PHI_BIN_DEG}°, `
      + `${(b + 1) * PHI_BIN_DEG}°)`, 'moving open-play body-ticks',
      (r) => sumCells(r, (i) => cellPhi(i) === b), movingOf);
    defFace(`${arm}.meanSpeedInPhiBin.bin${b}`, arm, 'metres per second',
      `⭐⭐ (a) THE ISOTROPIC ENVELOPE'S RECEIPT — the MEAN |vel| achieved in φ bin ${b} = `
      + `[${b * PHI_BIN_DEG}°, ${(b + 1) * PHI_BIN_DEG}°). TODAY the engine charges nothing `
      + 'for facing, so this row is the baseline the law\'s own exam is read against.',
      `moving ticks in φ bin ${b}`,
      (r) => expMetres(r, (_a, _r, phi) => phi === b) / DT,
      (r) => sumCells(r, (i) => cellPhi(i) === b));
  }
  /* --- (a) BY ROLE --- */
  for (let ri = 0; ri < NROLE; ri++) {
    const R = ROLES[ri];
    defFace(`${arm}.role.${R}.share45`, arm, 'share',
      `⭐ (a) the φ > 45° share of ${R} moving ticks`, `${R} moving open-play body-ticks`,
      (r) => sumCells(r, (i) => cellRole(i) === ri && cellPhi(i) >= PHI45_FIRST_BIN),
      (r) => sumCells(r, (i) => cellRole(i) === ri));
    defFace(`${arm}.role.${R}.share90`, arm, 'share',
      `⭐⭐ (a) THE BACKPEDAL SHARE for ${R}`, `${R} moving open-play body-ticks`,
      (r) => sumCells(r, (i) => cellRole(i) === ri && cellPhi(i) >= PHI90_FIRST_BIN),
      (r) => sumCells(r, (i) => cellRole(i) === ri));
    defFace(`${arm}.role.${R}.faceTargetSetShare`, arm, 'share',
      `(a) the share of ${R} moving ticks with \`faceTarget\` SET`,
      `${R} moving open-play body-ticks`,
      (r) => sumCells(r, (i) => cellRole(i) === ri && cellFace(i) === 1),
      (r) => sumCells(r, (i) => cellRole(i) === ri));
    defFace(`${arm}.role.${R}.movingTicksPerMatch`, arm,
      'moving body-ticks per match (240 s match clock)',
      `(a) ${R} moving open-play body-ticks per match`, 'matches walked',
      (r) => sumCells(r, (i) => cellRole(i) === ri), (r) => r.matches);
    defFace(`${arm}.role.${R}.metres45PerMatch`, arm, 'metres per match (240 s match clock)',
      `⭐ (a) METRES per match ${R} covers with φ > 45°`, 'matches walked',
      (r) => expMetres(r, (_a, rr, phi) => rr === ri && phi >= PHI45_FIRST_BIN),
      (r) => r.matches);
    defFace(`${arm}.role.${R}.metres90PerMatch`, arm, 'metres per match (240 s match clock)',
      `⭐ (a) METRES per match ${R} covers with φ > 90°`, 'matches walked',
      (r) => expMetres(r, (_a, rr, phi) => rr === ri && phi >= PHI90_FIRST_BIN),
      (r) => r.matches);
  }
  /* --- (a) BY SIDE-OF-BALL --- */
  for (let si = 0; si < NSIDE; si++) {
    const S = SIDES_OF_BALL[si];
    defFace(`${arm}.sideOfBall.${S}.share45`, arm, 'share',
      `(a) the φ > 45° share while the ball is ${S === 'own' ? 'OWNED BY MY SIDE'
        : S === 'opp' ? 'OWNED BY THE OPPONENTS' : 'LOOSE'}`,
      `moving ticks with the ball ${S}`,
      (r) => sumCells(r, (i) => cellSide(i) === si && cellPhi(i) >= PHI45_FIRST_BIN),
      (r) => sumCells(r, (i) => cellSide(i) === si));
    defFace(`${arm}.sideOfBall.${S}.share90`, arm, 'share',
      `(a) the φ > 90° share while the ball is ${S}`, `moving ticks with the ball ${S}`,
      (r) => sumCells(r, (i) => cellSide(i) === si && cellPhi(i) >= PHI90_FIRST_BIN),
      (r) => sumCells(r, (i) => cellSide(i) === si));
    defFace(`${arm}.sideOfBall.${S}.tickShare`, arm, 'share',
      `(a) the share of ALL moving ticks spent with the ball ${S}`,
      'moving open-play body-ticks',
      (r) => sumCells(r, (i) => cellSide(i) === si), movingOf);
  }
  /* --- (a) BY SPEED BIN --- */
  for (let bi = 0; bi < NSPD; bi++) {
    const lo = bi === 0 ? MOVING_FLOOR : SPEED_EDGES[bi - 1];
    const hi = bi === NSPD - 1 ? '∞' : String(SPEED_EDGES[bi]);
    defFace(`${arm}.speedBin${bi}.share45`, arm, 'share',
      `(a) the φ > 45° share in speed bin ${bi} = [${lo}, ${hi}) m/s`,
      `moving ticks in speed bin ${bi}`,
      (r) => sumCells(r, (i) => cellSpd(i) === bi && cellPhi(i) >= PHI45_FIRST_BIN),
      (r) => sumCells(r, (i) => cellSpd(i) === bi));
    defFace(`${arm}.speedBin${bi}.share90`, arm, 'share',
      `(a) the φ > 90° share in speed bin ${bi} = [${lo}, ${hi}) m/s`,
      `moving ticks in speed bin ${bi}`,
      (r) => sumCells(r, (i) => cellSpd(i) === bi && cellPhi(i) >= PHI90_FIRST_BIN),
      (r) => sumCells(r, (i) => cellSpd(i) === bi));
    defFace(`${arm}.speedBin${bi}.tickShare`, arm, 'share',
      `(a) the share of all moving ticks in speed bin ${bi} = [${lo}, ${hi}) m/s`,
      'moving open-play body-ticks',
      (r) => sumCells(r, (i) => cellSpd(i) === bi), movingOf);
  }
  /* --- (a) BY faceTarget CLASS --- */
  for (let fi = 0; fi < NFACE; fi++) {
    const F = fi === 0 ? 'null' : 'set';
    defFace(`${arm}.faceClass.${F}.share45`, arm, 'share',
      `⭐ (a) the φ > 45° share among moving ticks with \`faceTarget\` ${F.toUpperCase()}`,
      `moving ticks with faceTarget ${F}`,
      (r) => sumCells(r, (i) => cellFace(i) === fi && cellPhi(i) >= PHI45_FIRST_BIN),
      (r) => sumCells(r, (i) => cellFace(i) === fi));
    defFace(`${arm}.faceClass.${F}.share90`, arm, 'share',
      `⭐ (a) the φ > 90° share among moving ticks with \`faceTarget\` ${F.toUpperCase()}`,
      `moving ticks with faceTarget ${F}`,
      (r) => sumCells(r, (i) => cellFace(i) === fi && cellPhi(i) >= PHI90_FIRST_BIN),
      (r) => sumCells(r, (i) => cellFace(i) === fi));
  }
  /* --- (a) BY ACTION CLASS (the 23-label vocabulary + the overflow slot) --- */
  for (let ai = 0; ai < NACT; ai++) {
    const A = ai < ACTIONS.length ? ACTIONS[ai] : 'UNNAMED_OVERFLOW';
    defFace(`${arm}.action.${A}.share45`, arm, 'share',
      `(a) the φ > 45° share of \`${A}\` moving ticks`, `\`${A}\` moving ticks`,
      (r) => sumCells(r, (i) => cellAct(i) === ai && cellPhi(i) >= PHI45_FIRST_BIN),
      (r) => sumCells(r, (i) => cellAct(i) === ai));
    defFace(`${arm}.action.${A}.share90`, arm, 'share',
      `⭐ (a) THE BACKPEDAL SHARE of \`${A}\` moving ticks`, `\`${A}\` moving ticks`,
      (r) => sumCells(r, (i) => cellAct(i) === ai && cellPhi(i) >= PHI90_FIRST_BIN),
      (r) => sumCells(r, (i) => cellAct(i) === ai));
    defFace(`${arm}.action.${A}.tickShare`, arm, 'share',
      `(a) the share of all moving ticks running \`${A}\``, 'moving open-play body-ticks',
      (r) => sumCells(r, (i) => cellAct(i) === ai), movingOf);
    defFace(`${arm}.action.${A}.metresPerMatch`, arm, 'metres per match (240 s match clock)',
      `(b) the METRES per match covered while running \`${A}\` — the exposure row's total`,
      'matches walked', (r) => expMetres(r, (aa) => aa === ai), (r) => r.matches);
  }
  /* --- (b) THE FROZEN SENSITIVITY (arithmetic over the census, applied to NOTHING) --- */
  for (const p of SENS_PAIRS) {
    defFace(`${arm}.sensitivity.${p.name}.metresLostPerMatch`, arm,
      'metres per match (240 s match clock)',
      `⛔ ARITHMETIC OVER THE CENSUS, NOT A SIMULATION — the metres per match a facing factor `
      + `with LATERAL = ${p.L} and BACK = ${p.B} (linear in φ, evaluated at each stored φ `
      + 'bin\'s CENTRE) would subtract from the ground THIS world actually ran, if every body '
      + 'ran exactly the same paths. The real law is BF-T0\'s and its effect is BF-T1\'s.',
      'matches walked', (r) => metresLostRow(r, p.L, p.B), (r) => r.matches);
    defFace(`${arm}.sensitivity.${p.name}.metresLostShare`, arm, 'share',
      `⛔ ARITHMETIC — the same quantity as a SHARE of all moving metres (LATERAL = ${p.L}, `
      + `BACK = ${p.B})`, 'total moving metres',
      (r) => metresLostRow(r, p.L, p.B), (r) => expMetres(r, () => true));
  }
  /* --- CONTEXT (the 240 s match clock) --- */
  defFace(`${arm}.context.goalsPerMatch`, arm, 'goals per match (240 s match clock)',
    'context — goals', 'matches walked', (r) => r.goals, (r) => r.matches);
  defFace(`${arm}.context.groundPassesPerMatch`, arm, 'passes per match (240 s match clock)',
    'context — the engine\'s own pass count', 'matches walked', (r) => r.passes,
    (r) => r.matches);
  defFace(`${arm}.context.passCompletion`, arm, 'share',
    'context — the engine\'s own whole-match pass completion (⚠ ALL deliveries)', 'passes',
    (r) => r.passesCompleted, (r) => r.passes);
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
  if (f === undefined) { banner(`BF-C0 FATAL — unknown face ${k}`); process.exit(3); }
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
/** ⭐ THE E − S CONTRAST, PAIRED ON SEEDS — REPORTED, NEVER SCORED (#373 item 6). */
const CONTRASTS: [string, string, string][] = [
  ['share45.EminusS', 'E.share45', 'S.share45'],
  ['share90.EminusS', 'E.share90', 'S.share90'],
  ['faceTargetSetShare.EminusS', 'E.faceTargetSetShare', 'S.faceTargetSetShare'],
  ['misalignedFaceTargetDrivenShare.EminusS',
    'E.misalignedFaceTargetDrivenShare', 'S.misalignedFaceTargetDrivenShare'],
  ['metres45PerMatch.EminusS', 'E.metres45PerMatch', 'S.metres45PerMatch'],
  ['metres90PerMatch.EminusS', 'E.metres90PerMatch', 'S.metres90PerMatch'],
  ['metresPerMatch.EminusS', 'E.metresPerMatch', 'S.metresPerMatch'],
  ['movingTicksPerMatch.EminusS', 'E.movingTicksPerMatch', 'S.movingTicksPerMatch'],
  ['meanSpeedOverall.EminusS', 'E.meanSpeedOverall', 'S.meanSpeedOverall'],
  ...ROLES.map((R) => [`role.${R}.share90.EminusS`, `E.role.${R}.share90`,
    `S.role.${R}.share90`] as [string, string, string]),
  ...SENS_PAIRS.map((p) => [`sensitivity.${p.name}.metresLostPerMatch.EminusS`,
    `E.sensitivity.${p.name}.metresLostPerMatch`,
    `S.sensitivity.${p.name}.metresLostPerMatch`] as [string, string, string]),
];
const deltas = CONTRASTS.map(([k, l, r]) => contrast(k, l, r));

/* ========================================================================== */
/* §14 THE SIZING, SHOWN — the RC-C0 §15 house form, from THIS census's own smoke */
/* ========================================================================== */
const Z975 = 1.959963985;
const Z80 = 0.8416212336;
const ZSUM = Z975 + Z80;
const SMOKE_N = 12;
/** the SCRATCH SMOKE's own realised half-widths (seeds 900,002,300–311; §DEV-PREFLIGHT),
 *  read out of the smoke artifact's own `faces[].halfWidth` fields — never re-typed from the
 *  console's rounded print. */
const SIZING_INPUTS: { face: string; group: string; hwSmoke: number; target: number }[] = [
  { face: 'E.share45', group: '(a) THE HEADLINE — φ > 45° overall, empty book',
    hwSmoke: 0.0073207866112186964, target: 0.01 },
  { face: 'E.role.GK.share90', group: '(a) the BY-ROLE backpedal share — GK',
    hwSmoke: 0.013966872200510655, target: 0.02 },
  { face: 'E.role.DF.share90', group: '(a) the BY-ROLE backpedal share — DF',
    hwSmoke: 0.0034773010396153114, target: 0.02 },
  { face: 'E.role.MF.share90', group: '(a) the BY-ROLE backpedal share — MF',
    hwSmoke: 0.0019445573067027044, target: 0.02 },
  { face: 'E.role.WG.share90', group: '(a) the BY-ROLE backpedal share — WG',
    hwSmoke: 0.0020853885759601794, target: 0.02 },
  { face: 'E.role.ST.share90', group: '(a) the BY-ROLE backpedal share — ST',
    hwSmoke: 0.0019406314048036524, target: 0.02 },
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
const SIZING_OK = sizingRows.every((r) => Number.isFinite(r.nRequired) && r.nRequired > 0)
  && sizingRows.every((r) => r.resolvableAtNFrozen)
  && N_FROZEN >= Math.max(...sizingRows.map((r) => r.nRequired));

/* ========================================================================== */
/* §15 THE POOLED BINS — the stored distributions and THE EXPOSURE TABLE        */
/* ========================================================================== */
const poolCells = (arm: Arm): number[] => {
  const t = zeros(NCELL);
  for (const c of cells) {
    const f = c[arm].cells;
    for (let i = 0; i < f.length; i += 2) t[f[i]] += f[i + 1];
  }
  return t;
};
const poolExp = (arm: Arm): number[] => {
  const t = zeros(NEXP);
  for (const c of cells) addInto(t, c[arm].expSpeedSumMps);
  return t;
};
const POOLED_CELLS: Record<Arm, number[]> = { E: poolCells('E'), S: poolCells('S') };
const POOLED_EXP: Record<Arm, number[]> = { E: poolExp('E'), S: poolExp('S') };
/** the marginal histograms, all DERIVED from the pooled cell table (a single truth source) */
const marginal = (arm: Arm, key: (idx: number) => number, n: number): number[] => {
  const out = zeros(n);
  const p = POOLED_CELLS[arm];
  for (let i = 0; i < NCELL; i++) if (p[i] !== 0) out[key(i)] += p[i];
  return out;
};
const marginal2 = (
  arm: Arm, k1: (i: number) => number, n1: number, k2: (i: number) => number, n2: number,
): number[][] => {
  const out = zeros2(n1, n2);
  const p = POOLED_CELLS[arm];
  for (let i = 0; i < NCELL; i++) if (p[i] !== 0) out[k1(i)][k2(i)] += p[i];
  return out;
};
/** THE EXPOSURE TABLE, per arm: [action][role][φ bin] — the moving TICKS and the METRES a
 *  facing factor would scale. ⭐ THE TABLE THE LAW WOULD SCALE, published in full. */
const exposureTicks = (arm: Arm): number[][][] => {
  const out = Array.from({ length: NACT }, () => zeros2(NROLE, NPHI));
  const p = POOLED_CELLS[arm];
  for (let i = 0; i < NCELL; i++) if (p[i] !== 0) out[cellAct(i)][cellRole(i)][cellPhi(i)] += p[i];
  return out;
};
const exposureMetres = (arm: Arm): number[][][] => {
  const out = Array.from({ length: NACT }, () => zeros2(NROLE, NPHI));
  const p = POOLED_EXP[arm];
  for (let i = 0; i < NEXP; i++) {
    if (p[i] === 0) continue;
    out[Math.floor(i / (NPHI * NROLE))][Math.floor(i / NPHI) % NROLE][i % NPHI] += p[i] * DT;
  }
  return out;
};
const binsFor = (arm: Arm) => ({
  phiTicks: marginal(arm, cellPhi, NPHI),
  roleXphiTicks: marginal2(arm, cellRole, NROLE, cellPhi, NPHI),
  sideOfBallXphiTicks: marginal2(arm, cellSide, NSIDE, cellPhi, NPHI),
  speedXphiTicks: marginal2(arm, cellSpd, NSPD, cellPhi, NPHI),
  faceXphiTicks: marginal2(arm, cellFace, NFACE, cellPhi, NPHI),
  actionXphiTicks: marginal2(arm, cellAct, NACT, cellPhi, NPHI),
  exposureTicks: exposureTicks(arm),
  exposureMetres: exposureMetres(arm),
  nonZeroCells: POOLED_CELLS[arm].filter((v) => v !== 0).length,
});
const POOLED = { E: binsFor('E'), S: binsFor('S') };
/** ⭐ the BIN-DERIVED MEDIAN φ (in DEGREES, at the bin's lower edge) — re-derives off disk */
const medians = {
  E: { phiDegAtLowerEdge: binMedian(POOLED.E.phiTicks, PHI_BIN_DEG) },
  S: { phiDegAtLowerEdge: binMedian(POOLED.S.phiTicks, PHI_BIN_DEG) },
};

/* ========================================================================== */
/* §16 THE GATES (all liveness/receipt — NEVER direction)                       */
/* ========================================================================== */
const walkedSeeds = [...new Set(cells.map((c) => c.seed))].sort((a, b) => a - b);
const inBlock = (s: number): boolean => s >= BLOCK_BASE && s <= BLOCK_TOP;
const totBy = (arm: Arm, pick: (r: Row) => number): number =>
  cells.reduce((a, c) => a + pick(c[arm]), 0);
const liveRoles = (arm: Arm): string[] => ROLES.filter((_R, ri) =>
  totBy(arm, (r) => sumCells(r, (i) => cellRole(i) === ri)) > 0);
const liveSides = (arm: Arm): string[] => SIDES_OF_BALL.filter((_S, si) =>
  totBy(arm, (r) => sumCells(r, (i) => cellSide(i) === si)) > 0);
const bothTeamSidesLive = (arm: Arm): boolean =>
  totBy(arm, (r) => r.movingBySide[0]) > 0 && totBy(arm, (r) => r.movingBySide[1]) > 0;
const faceSetLive = (arm: Arm): number =>
  totBy(arm, (r) => sumCells(r, (i) => cellFace(i) === 1));
const backpedalLive = (arm: Arm): number => totBy(arm, misaligned90);

const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: ARMS.every((arm) => cells.every((c) => c[arm].worldOk && c[arm].rcFlagOff
      && c[arm].geneAbsent) && receiptRows[arm].worldOk && receiptRows[arm].rcFlagOff
      && receiptRows[arm].geneAbsent),
    note: '⭐ on EVERY walked match of BOTH arms (and both construction receipts): '
      + `\`raArmedVersion(match)\` === ${WANTED_VERSION.E} on arm E (world 12's own `
      + `composition, CALLED never copied) and === ${WANTED_VERSION.S} on arm S (the SHIPPED `
      + 'default arms no a4 world at all), the `rcAnticipate` match flag is FALSE and '
      + '`rcAnticipationWeightOf` returns null on BOTH teams — the RC seat is provably ABSENT '
      + 'from this census',
  },
  gShippedConstruction: {
    ok: SHIPPED_CONSTRUCTION_OK,
    note: '⭐⭐ PT-C0 arm D\'s OWN FIXTURE, REUSED: a League round-tripped through '
      + '`toJSON`/`fromJSON` exactly as the worker\'s `simRunner` does, then '
      + '`League.createMatch(f)` against a Match built with the arm-S constructor shape at the '
      + 'SAME derived seed — the two WHOLE-MATCH signatures are identical after both run out '
      + `(${String(shippedConstruction.signaturesEqual)}). Three receipts beside: \`matchFlags\` `
      + 'absent from `toJSON`, undefined on the `fromJSON` league, and the BOOLEAN FLAG SET of '
      + 'a worker-built match equal to a bare `new Match({ seed, teamA, teamB })`; the contact '
      + 'law is OFF on both. Canon, VERBATIM: "WORKER-SIMMED fixtures play the SHIPPED world '
      + '(League.toJSON omits matchFlags; true since #155, stated now, test-pinned; refines '
      + '#270\'s E4 correction; matches the perf diagnostic)" (home: ruling #283.2(iv))',
  },
  gGenomeClean: {
    ok: ARMS.every((arm) => cells.every((c) => c[arm].genomeClean)
      && receiptRows[arm].genomeClean),
    note: 'the FRANCHISE genome (`info.genome`) carries NEITHER world-12 pin nor the corridor '
      + 'weight NOR the RC gene — the match-local arming idiom (canon: dose placement, '
      + '#270.2 / #334.1)',
  },
  gAnchoredConstants: {
    ok: ANCHORS_OK,
    note: '⭐⭐ anchored extraction with line receipts on '
      + `${ANCHORS.length} sites: the SEVEN LINES of \`physicsStep\` that carry #373 item `
      + '2(d)\'s code fact IN THE ORDER THEY RUN (the `desiredVel` clamp by `topSpeed` alone · '
      + 'the `accel · dt` limit · the POSITION integration from VELOCITY · the `sp` the floor '
      + 'tests · ⭐ THE HEADING-FOLLOW FLOOR `sp > 0.5` this census\'s population is cut on · '
      + 'the heading rotation that WRITES `heading` and reads nothing back · the shipped '
      + 'docstring "remains independent of velocity direction") · TURN_RATE · BASE_SPEED and '
      + 'the pure `topSpeed` getter · ACCEL · DT · AI_INTERVAL · `heading` · `faceTarget` · '
      + 'world 12\'s flag composition and arming lines · the league\'s ONE `new Match(` site '
      + 'and the `...this.matchFlags` spread (arm S) · the dormant `rcAnticipate` flag and '
      + `\`rcAnticipationWeightOf\` · the ActionType vocabulary read off its own union `
      + `(${ACTIONS.length} labels, line ${ACT_BLOCK_LINE}) · the Role vocabulary `
      + `(${ROLES.length} labels)`,
  },
  gSeamMap: {
    ok: SEAM_MAP_OK,
    note: '⭐⭐ canon, VERBATIM: "a seam-map gate pins occurrence COUNTS per needle and '
      + `enumerates EVERY occurrence's site". The needle \`${SEAM_NEEDLE}\` occurs `
      + `${sum(seamFiles.map((r) => r.count))} times across ${seamFiles.length} of the `
      + `${SRC_FILES.length} \`.ts\` files under \`src/\`, each count PINNED per file and each `
      + `occurrence's LINE enumerated. Of the ${seamSites.length} \`<obj>.faceTarget =\` `
      + `matches, ${seamKind('commentary')} sit inside COMMENTS, ${seamKind('reset')} only `
      + `ever write NULL (the per-frame default, the two aim-lock releases and \`becomeSub\`) `
      + `and ${seamKind('decision')} can write a NON-NULL point — the facing DECISIONS a `
      + `facing law would price. ${seamSites.filter((s) => s.awayByDesign === 'yes').length} `
      + 'of those aim the body AWAY from where it is going BY DESIGN (`HoldUp`\'s pivot '
      + 'shield and `GoalkeeperPosition`\'s "backpedal facing the play"); every site carries '
      + 'its file:line, its source line VERBATIM, what it serves and whether it is live, '
      + 'dormant or armed only in world 12',
  },
  gWalkFixtures: {
    ok: FIXTURES_OK,
    note: `${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length} walk-side predicate `
      + 'fixtures — the φ arithmetic on CONSTRUCTED vectors (ahead / lateral / backwards / '
      + 'non-unit heading / 45° / 135° / sign-blindness / both degeneracies), the φ bin grid '
      + 'and the proof that BOTH cuts (45°, 90°) fall on a STORED BIN EDGE, the speed bin '
      + 'edges, the cell index and its six decoders, the frozen facing-factor shape (ahead 1, '
      + 'lateral L, back B, monotone over all three pairs), the φ bin centres, THE '
      + 'METRES-LOST ARITHMETIC on a CONSTRUCTED bin table (ahead-bin nearly free, back bin '
      + 'expensive, additive, zero table ⇒ zero), and ⭐⭐ RC-C0b\'s TWO-BODY FACING FIXTURE '
      + `RE-RUN AT THIS HEAD (two identical bodies driven at one target for ${FIXTURE_TICKS} `
      + `ticks, one facing 90° off its velocity: distance ratio ${FACING_DISTANCE_RATIO}, `
      + 'with the fixture\'s own liveness asserted — the faced body\'s heading really did '
      + `leave its movement direction, ${FACED_HEADING_OFF_VELOCITY_RAD} rad off). ⭐ THAT `
      + 'RATIO IS THE BASELINE THE LAW WOULD MOVE: today facing is FREE',
  },
  gClassesNonVacuous: {
    ok: ARMS.every((arm) => liveRoles(arm).length === NROLE && liveSides(arm).length === NSIDE
      && bothTeamSidesLive(arm) && faceSetLive(arm) > 0 && backpedalLive(arm) > 0
      && totBy(arm, movingOf) > 0),
    note: '⛔ no face is computed on an empty class. On BOTH arms: every ROLE is live '
      + `(E ${liveRoles('E').join('/')} · S ${liveRoles('S').join('/')}), every SIDE-OF-BALL `
      + `class is live (E ${liveSides('E').join('/')} · S ${liveSides('S').join('/')}), BOTH `
      + `TEAM SIDES move (E ${totBy('E', (r) => r.movingBySide[0])}/`
      + `${totBy('E', (r) => r.movingBySide[1])} · S ${totBy('S', (r) => r.movingBySide[0])}/`
      + `${totBy('S', (r) => r.movingBySide[1])} moving ticks), the \`faceTarget\` SET class `
      + `is live (E ${faceSetLive('E')} · S ${faceSetLive('S')} moving ticks) and the φ > 90° `
      + `BACKPEDAL class is live (E ${backpedalLive('E')} · S ${backpedalLive('S')} moving `
      + 'ticks). ⚠ this gate reads LIVENESS, never a direction and never a magnitude',
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
      + 'and the construction receipt lie inside block 12,537,000–999; every lockstep and '
      + 'smoke seed is out-of-band scratch (canon, VERBATIM: "verifier scratch walks use the '
      + 'stage\'s own consumed band or the out-of-band scratch range (≥ 900,000,000) — never '
      + 'the next virgin block")',
  },
  gN: {
    ok: SIZING_OK && (!IS_OVERRIDE
      ? (cells.length === N_FROZEN && OVERRIDE_REASONS.length === 0)
      : (cells.length === N && !isCanonical(OUT_BASE) && OVERRIDE_REASONS.length > 0)),
    note: IS_OVERRIDE
      ? 'THE OVERRIDE ARM: the override is DECLARED, the walked n equals the n it declared, '
        + 'and the artifact sits OFF every canonical path'
      : `THE FROZEN ARM: no override env at all, the battery ran at exactly N_FROZEN = ${
        N_FROZEN}, and every sizing row resolves at it (the largest requirement is ${
        Math.max(...sizingRows.map((r) => r.nRequired))} clusters)`,
  },
};

/* ========================================================================== */
/* §17 (d) THE REALITY ANCHOR — cited, with the executor's access STATED         */
/* ========================================================================== */
const REALITY_ANCHOR = {
  what: '⛔ THE CENSUS DOES NOT CHOOSE `LATERAL` OR `BACK`. Contract M-BF.1: the two '
    + 'constants are the REALITY ANCHOR\'s own fractions, RATIFIED BY THE COMMANDER AT '
    + 'BANKING (the PC-tier precedent: literature constants named in a ruling). What follows '
    + 'is the evidence, with this executor\'s verification stated honestly per figure.',
  question: 'as a fraction of MAXIMAL FORWARD SPRINT speed, how fast can a trained athlete '
    + 'move (i) BACKWARDS (backpedal / backward running) and (ii) SIDEWAYS (lateral shuffle)?',
  backward: {
    range: [0.6, 0.75],
    reading: 'BACKWARD running peaks at roughly 60–75 % of the same athlete\'s forward '
      + 'sprint speed; ~0.70 is the figure practitioners quote for an athlete who has '
      + 'practised it.',
    sources: [
      { cite: 'Uthoff A., Oliver J., Cronin J., Harrison C., Winwood P. — the backward-running '
        + 'programme of work (Journal of Strength and Conditioning Research; "Sprint-Specific '
        + 'Training in Youth: Backward Running vs. Forward Running Training on Speed and Power '
        + 'Measures in Adolescent Male Athletes", JSCR 2020, 34(4)); Uthoff\'s own summary of '
        + 'the field: "backward running is about 70 % of the speed of forward".',
        verified: 'VERIFIED BY WEB SEARCH on 2026-09-04 — the paper (title, journal, year, '
          + 'issue) and the ~70 % summary were both returned by search. ⚠ THE FULL TEXT WAS '
          + 'NOT READ: the ~70 % figure is quoted from a secondary summary of Uthoff\'s work, '
          + 'not from a table this executor opened.' },
      { cite: 'a randomised controlled trial comparing backward and forward running in '
        + 'collegiate athletes (Journal of Bodywork & Movement Therapies / ScienceDirect '
        + 'S2213398424002367, 2024): forward running was faster than backward running by '
        + '26 % (slow), 28 % (moderate) and 26 % (fast) — i.e. backward ≈ 0.72–0.74 of '
        + 'forward at matched intensities.',
        verified: 'VERIFIED BY WEB SEARCH on 2026-09-04 (the percentages were returned in the '
          + 'search result summary). ⚠ FULL TEXT NOT READ.' },
      { cite: 'Flynn T.W. & Soutas-Little R.W. (1993) and Wright S. & Weyand P.G. (2001) on '
        + 'the mechanics and the energetic cost of backward running — the standard '
        + 'biomechanical background for WHY it is slower (shorter stride, no hip extension '
        + 'drive, higher metabolic cost at matched speed).',
        verified: '⛔ FROM MEMORY, UNVERIFIED — cited for context only; no number in this '
          + 'census depends on it.' },
    ],
  },
  lateral: {
    range: [0.55, 0.75],
    reading: 'LATERAL SHUFFLE is slower again than backpedalling in most measurements; a '
      + 'defensive shuffle is typically quoted at roughly 55–75 % of forward sprint speed, '
      + 'and the honest statement is that this executor could NOT verify a clean '
      + 'max-shuffle ÷ max-sprint ratio from the literature in this session.',
    sources: [
      { cite: 'Comparison of lateral shuffle and side-step cutting in young recreational '
        + 'athletes (ScienceDirect S096663621500987X): APPROACH velocity was 2.1 ± 0.4 m/s in '
        + 'the lateral shuffle against 3.4 ± 0.6 m/s in the cut — the shuffle is run at ~62 % '
        + 'of the cut\'s approach speed.',
        verified: 'VERIFIED BY WEB SEARCH on 2026-09-04 (the two velocities were returned). '
          + '⚠ THIS IS NOT THE RATIO THE LAW NEEDS: it compares a shuffle approach with a '
          + 'CUT approach, not maximal shuffle with maximal sprint. FULL TEXT NOT READ.' },
      { cite: 'Physiological and Neuromuscular Fatigue after 3-Minute Lateral Shuffle '
        + 'Movement at Different Speeds and Distances (PMC11812171): the protocol\'s shuffle '
        + 'speeds are 1.8 and 2.0 m/s, against team-sport maximal sprint speeds of 8–9 m/s '
        + '— but those are PRESCRIBED submaximal speeds, not maxima.',
        verified: 'VERIFIED BY WEB SEARCH on 2026-09-04 that the protocol uses those speeds. '
          + '⛔ IT DOES NOT LICENCE A RATIO.' },
      { cite: 'the practitioner\'s figure — a lateral defensive shuffle at roughly two thirds '
        + 'of forward sprint speed, and 20-yard shuffle times about 1.3–1.5× the 20-yard '
        + 'forward sprint.',
        verified: '⛔ FROM MEMORY, UNVERIFIED — no source was confirmed for this in this '
          + 'session.' },
    ],
  },
  ordering: '⭐ THE ONE THING BOTH LINES OF EVIDENCE AGREE ON, and the only thing M-BF.1\'s '
    + 'SHAPE actually needs: forward > lateral ≥ backward is NOT what the evidence says — the '
    + 'evidence says forward > backward and forward > lateral, and it does NOT resolve which '
    + 'of lateral and backward is slower. Backward running (a trained, practised gait) may '
    + 'well be FASTER than a defensive shuffle. ⚠ M-BF.1 as drafted requires f monotone '
    + 'DECREASING in φ, i.e. BACK ≤ LATERAL; that is a MODELLING CHOICE the literature does '
    + 'not compel, and the commander should ratify it as such.',
  honestAccess: 'This executor HAD web search in this session and used it. Four of the seven '
    + 'citations above were confirmed against search results (titles, journals, years and the '
    + 'quoted percentages); NO full text was opened, so every number is quoted at one remove. '
    + 'The three marked "FROM MEMORY, UNVERIFIED" were not confirmed at all. ⛔ No number in '
    + 'this artifact\'s measured faces depends on any of them.',
};

/* ========================================================================== */
/* §18 THE ARTIFACT                                                            */
/* ========================================================================== */
const perSeedCells = cells.map((c) => ({ seed: c.seed, E: c.E, S: c.S }));

/** ⭐⭐ canon, VERBATIM: "the hashed body is built from an explicit ALLOWLIST SCHEMA — a
 *  field not in the schema never enters the body; forbidden-name lists are retired"
 *  (home: PC-T0-LATENCY-SEAM.md §COMMANDER CORRECTIONS item 1). The body hash is computed
 *  LAST at §19b — AFTER every body key including `gates.gFaces` and `artifact.gates` — and a
 *  NON-body receipt field records that it reproduces from the written file. */
const BODY_SCHEMA = [
  'stage', 'gates', 'faces', 'deltas', 'population', 'cellDefinition', 'exposure',
  'sensitivity', 'seamMap', 'realityAnchor', 'facingFreeReceipt', 'medians', 'bins',
  'arms', 'roles', 'sidesOfBall', 'actionVocabulary', 'seeds', 'stats', 'anchoredSites',
  'fixtures', 'shippedConstruction', 'lockstep', 'perf', 'honestLimits', 'sizing',
  'perSeedCells', 'constructionReceipt',
] as const;

const artifact: Record<string, unknown> = {
  stage: {
    id: 'BF-C0',
    title: 'THE MOVEMENT-FACING CENSUS — how much of today\'s running happens with the body '
      + 'turned away from where it is going, which actions and roles do it, where the code '
      + 'TELLS bodies to face away, and what the literature says that should cost',
    doc: 'docs/world-model/BF-C0-MOVEMENT-FACING-CENSUS.md',
    contract: 'docs/world-model/BF-BODY-FACING-CONTRACT.md',
    lineage: 'RC-C0b (#373 item 2(d): TURNING IS FREE, verified twice) → #373 item 4 (the '
      + 'design ruling: a free action cannot be an honest trait) → #373 item 6. Instrument '
      + 'family: RC-C0b (envelope, buildMatch, per-tick reads, pairing, bootstrap, sizing, '
      + 'hash order, receipts, gFaces off disk) + PT-C0 arm D (the SHIPPED-default '
      + 'construction and its `gShippedConstruction` fixture, REUSED).',
    censusFormOfRecord: 'docs/world-model/RC-C0B-DETECTOR-CENSUS.md',
    authorizedBy: 'COMMANDER RULING #373 item 6',
    kind: '⛔ CENSUS — it publishes MEASUREMENTS. It applies NO factor, scores no hypothesis, '
      + 'arms no mechanism, adjudicates NOTHING and ships nothing. It has NO pre-commitment. '
      + 'It sizes the blast radius of a law the contract has not yet written. The commander '
      + 'rules; `LATERAL` and `BACK` are ratified at banking, not chosen here.',
    xSrcZero: 'no file under `src/` is created or edited. The probe CALLS the shipped exports '
      + 'and reads Match state per tick. THERE IS NO WRAPPER AT ALL — `gLockstep` proves '
      + 'observed ≡ unobserved byte for byte on out-of-band scratch seeds.',
    storageForm: '⭐ canon, VERBATIM: "an artifact is written as compact JSON — no '
      + 'indentation; the hash is over the canonical body regardless; pretty-printing is a '
      + 'reader\'s tool, not a storage form" (home: ruling #372 item 5). This artifact is '
      + 'written with `JSON.stringify(artifact)` and no indent argument.',
    mode: MODE ?? 'full', overrideReasons: OVERRIDE_REASONS,
    generatedAtUtc: new Date().toISOString(),
    instrument: 'scripts/probes/bf-c0-movement-facing-census.ts',
    instrumentSha256: sha(readFileSync('scripts/probes/bf-c0-movement-facing-census.ts', 'utf8')),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: Object.fromEntries(PATHS.map((p) => [p, sha(SRC_OF[p])])),
  },
  arms: ARMS.map((a) => ({ arm: a, label: ARM_LABEL[a], wantedArmedVersion: WANTED_VERSION[a] })),
  roles: ROLES,
  sidesOfBall: SIDES_OF_BALL,
  actionVocabulary: { labels: ACTIONS, overflowSlotIndex: ACTIONS.length },
  population: {
    what: '⭐⭐ EVERY OPEN-PLAY tick (`match.phase === \'playing\'`) on which a body is MOVING '
      + `— |vel| > ${MOVING_FLOOR} m/s — for BOTH SIDES and ALL 12 BODIES, THE KEEPER `
      + 'INCLUDED (flagged by role). Read at the END of each `m.step(DT)`; there is no wrapper.',
    movingFloorAnchor: '⭐⭐ THE FLOOR IS THE ENGINE\'S OWN, ANCHORED: `physicsStep`\'s '
      + '`} else if (sp > 0.5) {` — below it a body with no `faceTarget` does not rotate its '
      + 'heading at all, so "which way is he facing relative to where he is going" is not a '
      + 'question the engine answers there. ⛔ NOT a taste constant.',
    readSet: '⭐⭐ EXTERNAL / ENGINE STATE ONLY: `heading`, `vel`, `action.type`, `role`, '
      + '`ball.owner` (for side-of-ball) and whether `faceTarget` is null. A census reads '
      + 'truth — there is no percept discipline to keep here, and none is claimed.',
    phi: '⭐⭐ φ = the angle between `heading` and `vel`, in radians, both read at the same '
      + 'tick AFTER `m.step(DT)` — exactly the pair `physicsStep` left behind. 15° bins to '
      + '180° (12 bins), STORED. φ is sign-blind: 60° left and 60° right are the same bin.',
    faceTargetRead: '⚠ `faceTarget` is written by the executor EVERY frame (`p.faceTarget = '
      + 'null` at the head of `applyAction`, then a case may set it) and READ by `physicsStep` '
      + 'in the same tick, so the value the census reads after the step IS the value that '
      + 'tick\'s heading rotation used.',
  },
  cellDefinition: {
    axes: '(action.type × role × side-of-ball × speed bin × φ bin × faceTargetSet)',
    counts: `${NACT} × ${NROLE} × ${NSIDE} × ${NSPD} × ${NPHI} × ${NFACE} = ${NCELL} cells`,
    index: '((((act · NROLE + role) · NSIDE + side) · NSPD + spd) · NPHI + phi) · 2 + face',
    storage: '⭐ per ARM × SEED the occupied cells are stored SPARSELY as a flat '
      + '[idx, count, idx, count, …] array sorted by index — AGGREGATE CELLS, NEVER RAW TICKS. '
      + 'Every published tick face re-derives from these per-seed arrays (canon: per-seed '
      + 'cells, ruling #282.2(ii)).',
    metres: `⭐ METRES cannot be recovered from counts, so Σ|vel| (m/s) is stored DENSELY per `
      + `(action × role × φ bin) — ${NEXP} slots per arm per seed, field \`expSpeedSumMps\` `
      + '(canon, VERBATIM: "a field carries the unit its name claims" — it is a SUM OF SPEEDS '
      + 'in m/s; METRES = this × DT).',
    speedBins: { what: 'the body\'s own |vel| in m/s, cut on the moving floor',
      edges: SPEED_EDGES, bins: NSPD,
      form: `bin 0 = (${MOVING_FLOOR}, 2), then [2,4), [4,6), [6,∞). ANCHORED to the shipped `
        + 'BASE_SPEED table (top entry 7.9) × the pace span (0.88 + 0.24) and the PURE '
        + '`topSpeed` getter, which cap a body under 8.9 m/s.' },
    phiBins: { widthDegrees: PHI_BIN_DEG, bins: NPHI,
      cuts: { firstBinAbove45: PHI45_FIRST_BIN, firstBinAbove90: PHI90_FIRST_BIN },
      form: '⭐ 45° and 90° fall EXACTLY on stored bin edges, so both headline shares '
        + 're-derive from the stored φ histogram with no interpolation.' },
    sideOfBall: '`own` = my side owns the ball · `opp` = the opponents own it · `loose` = '
      + '`ball.owner === null`. Read from `ball.owner` alone.',
    faceTargetSet: '0 = `faceTarget` is NULL (the heading FOLLOWS the movement direction) · '
      + '1 = SET (an executor made a deliberate facing decision this frame).',
  },
  exposure: {
    what: '⭐⭐ (b) THE EXPOSURE TABLE — per ACTION CLASS × ROLE, the moving TICKS and the '
      + 'METRES in each φ bin: the table a facing factor f(φ) would scale. ⛔ NO FACTOR IS '
      + 'APPLIED. The table is published in FULL as stored bins (`bins.<arm>.exposureTicks` '
      + `and \`bins.<arm>.exposureMetres\`, both [${NACT}][${NROLE}][${NPHI}]), and `
      + '`gFaces` re-derives EVERY entry of both from the per-seed cells off disk.',
    whyNoCiPerEntry: '⚠ STATED HONESTLY: bootstrap intervals are published on the MARGINS '
      + `(by role, by action, by side-of-ball, by speed bin, by faceTarget class, by φ bin) `
      + `and NOT on each of the ${NACT * NROLE * NPHI} individual exposure entries — most of `
      + 'which are empty or hold a handful of ticks. An interval on each would be noise '
      + 'dressed as information.',
  },
  sensitivity: {
    what: '⛔⛔ ARITHMETIC OVER THE CENSUS, NOT A SIMULATION. For three ILLUSTRATIVE (LATERAL, '
      + 'BACK) pairs FROZEN at §P.C before any battery seed, the metres the factor would '
      + 'subtract from the ground THIS world actually ran, IF every body ran exactly the same '
      + 'paths. Bodies would NOT run the same paths under a real law — they would choose '
      + 'differently, which is the entire point of pricing a decision. ⇒ these rows size the '
      + 'EXPOSURE, they do not predict an effect. The real law is BF-T0\'s and its effect is '
      + 'BF-T1\'s.',
    shape: '⭐ FROZEN: f(φ) is LINEAR IN φ with knots at 0 ⇒ 1, π/2 ⇒ LATERAL and π ⇒ BACK; '
      + 'it is evaluated at each stored φ bin\'s CENTRE ((i + 0.5)·15°). The shape is a '
      + 'DECLARED CHOICE (contract M-BF.1: "the interpolation shape between them is a '
      + 'declared choice"), not a measurement.',
    pairs: SENS_PAIRS,
    notChosenHere: '⛔ The census does NOT choose LATERAL or BACK. Contract M-BF.1 makes them '
      + 'the REALITY ANCHOR\'s own fractions, RATIFIED BY RULING at this census\'s banking.',
  },
  seamMap: {
    what: '⭐⭐ (c) EVERY `src/` site that assigns `faceTarget`, anchored with a line receipt '
      + 'and its source line VERBATIM, classified by what it serves and by whether it aims '
      + 'the body AWAY from its motion BY DESIGN. Canon, VERBATIM: "a seam-map gate pins '
      + 'occurrence COUNTS per needle and enumerates EVERY occurrence\'s site".',
    needle: SEAM_NEEDLE,
    srcTsFilesScanned: SRC_FILES.length,
    perFileOccurrences: seamFiles,
    perFilePinned: SEAM_COUNTS_PINNED,
    totalOccurrences: sum(seamFiles.map((r) => r.count)),
    totalOccurrencesPinned: SEAM_TOTAL_PINNED,
    writeSites: seamSites,
    writeSitesPinned: SEAM_WRITES_PINNED,
    decisions: seamKind('decision'), resets: seamKind('reset'),
    commentary: seamKind('commentary'),
    awayByDesign: seamSites.filter((s) => s.awayByDesign === 'yes').map(
      (s) => `${s.file}:${s.line}`),
  },
  facingFreeReceipt: {
    what: '⭐⭐ RC-C0b\'s (c) FIXTURE, RE-RUN AT THIS HEAD — the baseline the law would move. '
      + 'Two identical bodies driven toward the SAME target for '
      + `${FIXTURE_TICKS} ticks (2 sim-seconds) at their own topSpeed, one with \`faceTarget\` `
      + 'set 90° off its velocity and one with none. If the engine charged movement for a '
      + 'misaligned heading the ratio would be < 1.',
    ticks: FIXTURE_TICKS,
    distanceFree: FIX_FREE.dist, distanceFaced: FIX_FACED.dist,
    distanceRatio: FACING_DISTANCE_RATIO,
    headingFree: FIX_FREE.heading, headingFaced: FIX_FACED.heading,
    facedHeadingOffVelocityRadians: FACED_HEADING_OFF_VELOCITY_RAD,
    codeFact: '`Player.physicsStep` clamps `desiredVel` by `topSpeed`, rate-limits by '
      + '`accel · dt`, advances `pos` from `vel`, and ONLY THEN rotates `heading` toward '
      + '`faceTarget` (or the movement direction, above the 0.5 m/s floor) at TURN_RATE — a '
      + 'block that WRITES the heading and never reads it back. The shipped docstring\'s own '
      + 'words: the body direction "remains independent of velocity direction". ⇒ FACING IS '
      + 'FREE IN THIS ENGINE (#373 item 2(d)); SUBSTRATE-MAP S1 names the debt verbatim '
      + '("movement remains one isotropic accel envelope + a separately rotating heading"; '
      + '`agility` = "a flat TURN_RATE 6.5, attr-blind").',
  },
  realityAnchor: REALITY_ANCHOR,
  anchoredSites: ANCHORS,
  fixtures: FIXTURES,
  shippedConstruction,
  lockstep: lockstepRows,
  sizing: {
    form: 'se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/'
      + 'se(needed))²) · MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975',
    varianceSource: 'THIS census\'s own 12-cluster SCRATCH SMOKE (seeds 900,002,300–311), '
      + 'DISCLOSED IN FULL at the doc\'s §DEV-PREFLIGHT. ⚠ 12 clusters is a NOISY variance '
      + 'estimate. Targets: 0.01 on the HEADLINE φ > 45° share, 0.02 on the BY-ROLE φ > 90° '
      + 'share for every role. N_FROZEN takes the LARGEST requirement, capped by what the '
      + 'block affords (≤ 999 shared seeds).',
    nFrozen: N_FROZEN,
    blockAffords: 999,
    rows: sizingRows,
  },
  gates,
  allGreen: Object.values(gates).every((g) => g.ok),
  faces,
  deltas,
  medians: {
    note: '⭐ the median φ is BIN-DERIVED (the LOWER EDGE, in degrees, of the bin whose '
      + 'cumulative count first reaches n/2) from the stored φ histogram, so `gFaces` '
      + 're-derives it off the SERIALIZED artifact — canon, VERBATIM: "the re-derivation gate '
      + 'covers EVERY published face; a percentile face requires stored bins"',
    values: medians,
  },
  bins: {
    note: '⭐ every table below is POOLED over the battery seeds and re-derived by `gFaces` '
      + 'from the per-seed cells off disk. `exposure*` is (b)\'s own table.',
    phiBinWidthDegrees: PHI_BIN_DEG,
    speedEdges: SPEED_EDGES,
    E: POOLED.E, S: POOLED.S,
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
    meanWallSecondsPerMatch: cells.reduce((a, c) => a + c.E.wallMs + c.S.wallMs, 0)
      / 1000 / (cells.length * ARMS.length),
    note: '⚠ A MACHINE READING ON ONE MACHINE. The timed region is the WALK, observer reads '
      + 'included — never the game\'s frame cost.',
  },
  honestLimits: null,   // ⭐ canon: the doc's HONEST LIMITS is the ONE home (#367 item 3)
  perSeedCells,
  constructionReceipt: receiptRows,
};

/* ========================================================================== */
/* §19 gFaces — RE-DERIVE EVERY PUBLISHED FACE OFF THE SERIALIZED ARTIFACT      */
/* ========================================================================== */
const OUT_PATH_PRE = OUT_BASE;
writeFileSync(OUT_PATH_PRE, `${JSON.stringify(artifact)}\n`);
const disk = JSON.parse(readFileSync(OUT_PATH_PRE, 'utf8')) as typeof artifact & {
  perSeedCells: { seed: number; E: Row; S: Row }[];
  faces: FaceRow[]; deltas: DeltaRow[];
  bins: Record<Arm, Record<string, unknown>> & Record<string, unknown>;
  medians: { values: typeof medians };
  sizing: { rows: typeof sizingRows };
  facingFreeReceipt: { distanceRatio: number; distanceFree: number; distanceFaced: number };
  seamMap: { totalOccurrences: number; writeSites: SeamSite[]; decisions: number };
};
const dcells = disk.perSeedCells;
const faceChecks: { face: string; ok: boolean }[] = [];
const isNull = (x: unknown): boolean => x === null || (typeof x === 'number' && Number.isNaN(x));
for (const f of disk.faces) {
  const def = FACES[f.face];
  const nu = sum(dcells.map((c) => def.num(c[def.arm])));
  const de = sum(dcells.map((c) => def.dn(c[def.arm])));
  const v = ratio(nu, de);
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
  faceChecks.push({
    face: `delta.${dd.key}`,
    ok: (Number.isNaN(pl) ? isNull(dd.leftValue) : pl === dd.leftValue)
      && (Number.isNaN(pr) ? isNull(dd.rightValue) : pr === dd.rightValue)
      && (Number.isNaN(pl - pr) ? isNull(dd.delta) : pl - pr === dd.delta),
  });
}
const binChecks: { bin: string; ok: boolean }[] = [];
/** the POOLED CELL TABLE re-derived off disk, then every stored bin table from IT */
const diskPooledCells: Record<Arm, number[]> = { E: zeros(NCELL), S: zeros(NCELL) };
const diskPooledExp: Record<Arm, number[]> = { E: zeros(NEXP), S: zeros(NEXP) };
for (const c of dcells) {
  for (const arm of ARMS) {
    const f = c[arm].cells;
    for (let i = 0; i < f.length; i += 2) diskPooledCells[arm][f[i]] += f[i + 1];
    addInto(diskPooledExp[arm], c[arm].expSpeedSumMps);
  }
}
const reMarg = (arm: Arm, key: (i: number) => number, n: number): number[] => {
  const out = zeros(n);
  for (let i = 0; i < NCELL; i++) if (diskPooledCells[arm][i] !== 0) out[key(i)] += diskPooledCells[arm][i];
  return out;
};
const reMarg2 = (
  arm: Arm, k1: (i: number) => number, n1: number, k2: (i: number) => number, n2: number,
): number[][] => {
  const out = zeros2(n1, n2);
  for (let i = 0; i < NCELL; i++) {
    if (diskPooledCells[arm][i] !== 0) out[k1(i)][k2(i)] += diskPooledCells[arm][i];
  }
  return out;
};
for (const arm of ARMS) {
  const db = disk.bins[arm] as Record<string, unknown>;
  const chk = (name: string, got: unknown): void => {
    binChecks.push({ bin: `bins.${arm}.${name}`,
      ok: JSON.stringify(got) === JSON.stringify(db[name]) });
  };
  chk('phiTicks', reMarg(arm, cellPhi, NPHI));
  chk('roleXphiTicks', reMarg2(arm, cellRole, NROLE, cellPhi, NPHI));
  chk('sideOfBallXphiTicks', reMarg2(arm, cellSide, NSIDE, cellPhi, NPHI));
  chk('speedXphiTicks', reMarg2(arm, cellSpd, NSPD, cellPhi, NPHI));
  chk('faceXphiTicks', reMarg2(arm, cellFace, NFACE, cellPhi, NPHI));
  chk('actionXphiTicks', reMarg2(arm, cellAct, NACT, cellPhi, NPHI));
  /* ⭐⭐ (b) THE EXPOSURE TABLE — EVERY entry of both halves, re-derived off disk */
  {
    const t = Array.from({ length: NACT }, () => zeros2(NROLE, NPHI));
    for (let i = 0; i < NCELL; i++) {
      if (diskPooledCells[arm][i] !== 0) t[cellAct(i)][cellRole(i)][cellPhi(i)] += diskPooledCells[arm][i];
    }
    chk('exposureTicks', t);
    const mres = Array.from({ length: NACT }, () => zeros2(NROLE, NPHI));
    for (let i = 0; i < NEXP; i++) {
      if (diskPooledExp[arm][i] === 0) continue;
      mres[Math.floor(i / (NPHI * NROLE))][Math.floor(i / NPHI) % NROLE][i % NPHI]
        += diskPooledExp[arm][i] * DT;
    }
    chk('exposureMetres', mres);
    chk('nonZeroCells', diskPooledCells[arm].filter((v) => v !== 0).length);
  }
  /* the BIN-DERIVED MEDIAN */
  binChecks.push({ bin: `medians.${arm}.phiDegAtLowerEdge`,
    ok: binMedian(reMarg(arm, cellPhi, NPHI), PHI_BIN_DEG)
      === disk.medians.values[arm].phiDegAtLowerEdge });
  /* ⭐ the TWO HEADLINE SHARES re-derived from the STORED φ HISTOGRAM ALONE (the cuts land
     on bin edges, so this is an independent route to the same number) */
  {
    const h = reMarg(arm, cellPhi, NPHI);
    const tot = sum(h);
    const s45 = sum(h.slice(PHI45_FIRST_BIN)) / tot;
    const s90 = sum(h.slice(PHI90_FIRST_BIN)) / tot;
    const f45 = disk.faces.find((x) => x.face === `${arm}.share45`) as FaceRow;
    const f90 = disk.faces.find((x) => x.face === `${arm}.share90`) as FaceRow;
    binChecks.push({ bin: `share45.${arm}.fromStoredPhiHistogram`, ok: s45 === f45.value });
    binChecks.push({ bin: `share90.${arm}.fromStoredPhiHistogram`, ok: s90 === f90.value });
  }
  /* ⭐⭐ the SENSITIVITY rows re-derived from the STORED EXPOSURE METRES off disk */
  for (const p of SENS_PAIRS) {
    const mres = zeros(NPHI);
    for (let i = 0; i < NEXP; i++) mres[i % NPHI] += diskPooledExp[arm][i] * DT;
    const lost = metresLostOf(mres, p.L, p.B);
    const fr = disk.faces.find(
      (x) => x.face === `${arm}.sensitivity.${p.name}.metresLostPerMatch`) as FaceRow;
    binChecks.push({ bin: `sensitivity.${arm}.${p.name}.reDerivesFromStoredMetres`,
      ok: Math.abs(lost - fr.numerator) <= Math.abs(fr.numerator) * 1e-9 });
  }
}
/** ⭐ THE FACING-FREE RECEIPT is a published face too — it re-derives off disk */
binChecks.push({ bin: 'facingFreeReceipt.ratioIsOneAndBitIdentical',
  ok: disk.facingFreeReceipt.distanceRatio === 1
    && disk.facingFreeReceipt.distanceFaced === disk.facingFreeReceipt.distanceFree });
/** ⭐ THE SEAM MAP's own published counts re-derive off disk */
binChecks.push({ bin: 'seamMap.countsAgreeOffDisk',
  ok: disk.seamMap.totalOccurrences === SEAM_TOTAL_PINNED
    && disk.seamMap.writeSites.length === SEAM_WRITES_PINNED
    && disk.seamMap.decisions === SEAM_DECISIONS_PINNED });
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
    + `${binChecks.filter((b) => b.ok).length}/${binChecks.length} stored-bin / EXPOSURE-TABLE `
    + '/ median / headline-from-histogram / sensitivity / seam-map / facing-free-fixture / '
    + 'sizing checks re-derived from the SERIALIZED artifact off disk',
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
/* §19b THE HASH, LAST — the corrected house order (#372 item 3)               */
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
banner(`BF-C0 — ${ALL_GREEN ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to the .RED path'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner('--- (a) TODAY\'S MISALIGNMENT ---');
for (const arm of ARMS) {
  banner(`  ${arm} share45 ${f6(face(`${arm}.share45`).value)} `
    + `[${f6(face(`${arm}.share45`).ciLo)}, ${f6(face(`${arm}.share45`).ciHi)}] · `
    + `share90 ${f6(face(`${arm}.share90`).value)} `
    + `[${f6(face(`${arm}.share90`).ciLo)}, ${f6(face(`${arm}.share90`).ciHi)}]  `
    + `n=${face(`${arm}.share45`).denominator} moving ticks`);
  banner(`  ${arm} faceTarget SET ${f6(face(`${arm}.faceTargetSetShare`).value)} · of the `
    + `misaligned, faceTarget-driven ${f6(face(`${arm}.misalignedFaceTargetDrivenShare`).value)} `
    + `/ motion-follow ${f6(face(`${arm}.misalignedMotionFollowShare`).value)}`);
  banner(`  ${arm} metres/match total ${f6(face(`${arm}.metresPerMatch`).value)} · >45° `
    + `${f6(face(`${arm}.metres45PerMatch`).value)} · >90° `
    + `${f6(face(`${arm}.metres90PerMatch`).value)}`);
  banner(`  ${arm} mean speed per φ bin: `
    + Array.from({ length: NPHI }, (_v, b) =>
      f6(face(`${arm}.meanSpeedInPhiBin.bin${b}`).value)).join(' '));
  banner(`  ${arm} by role (share90): `
    + ROLES.map((R) => `${R} ${f6(face(`${arm}.role.${R}.share90`).value)}`).join(' · '));
}
banner('');
banner('--- (b) THE FROZEN SENSITIVITY (arithmetic over the census) ---');
for (const arm of ARMS) {
  for (const p of SENS_PAIRS) {
    banner(`  ${arm} (L=${p.L}, B=${p.B}) → `
      + `${f6(face(`${arm}.sensitivity.${p.name}.metresLostPerMatch`).value)} m/match lost `
      + `(${f6(face(`${arm}.sensitivity.${p.name}.metresLostShare`).value)} of moving metres)`);
  }
}
banner('');
banner('--- (c) THE faceTarget SEAM MAP ---');
banner(`  ${sum(seamFiles.map((r) => r.count))} occurrences in ${seamFiles.length} files · `
  + `${seamKind('decision')} decision writes · ${seamKind('reset')} null resets · `
  + `${seamKind('commentary')} in comments · away-by-design: `
  + `${seamSites.filter((s) => s.awayByDesign === 'yes').map((s) => `${s.file}:${s.line}`).join(', ')}`);
banner('');
banner('--- THE FACING-FREE RECEIPT (RC-C0b\'s fixture, re-run) ---');
banner(`  distance ratio (faced 90° off vs free) = ${FACING_DISTANCE_RATIO}`);
banner('');
banner(`artifact → ${OUT_PATH}`);
banner(`instrumentSha256 = ${(artifact.stage as { instrumentSha256: string }).instrumentSha256}`);
banner(`hashedBodySha256 = ${artifact.hashedBodySha256 as string}`);
banner(`file byte-hash   = ${FINAL_FILE_SHA}`);
banner(`artifact bytes   = ${FINAL_ARTIFACT_BYTES}`);
banner(`hashReproducesFromFile = ${HASH_REPRODUCES_FROM_FILE} (final file: ${HASH_REPRODUCES_FINAL})`);
banner(`wall ${((Date.now() - t0Wall) / 1000).toFixed(2)} s`);
if (!HASH_REPRODUCES_FROM_FILE || !HASH_REPRODUCES_FINAL) {
  banner('BF-C0 ⛔ THE HASH DOES NOT REPRODUCE FROM THE WRITTEN FILE. The run FAILS.');
  process.exit(1);
}
if (!ALL_GREEN) process.exit(1);
