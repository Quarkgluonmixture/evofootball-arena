/**
 * ⭐⭐ GK-T1 — 「身体跟着手走 · 考试」 THE DIVE EXAM
 * (docs/world-model/GK-T1-DIVE-EXAM.md).
 *
 * Authorized by COMMANDER RULING #401 item 3. Lineage: GK-C0 (the WALKER of record — the
 * keeper per-tick series read before/after `match.step(DT)`, the save join to `shotLog` +
 * `markShotOutcome`, the four save-event families read off the engine's OWN event text, the
 * `keeperReach` reconstruction, the frozen bins, the cluster bootstrap, the hash order, the
 * gate set, the `stage` block) → LN-T1′b (the EXAM form — paired arms on shared seeds, the
 * primary ruler with its paired Δ and a resolved/unresolved word, the guards with harmful
 * directions and the tolerance `NI_FRACTION` inherited BY ANCHOR as an EXPRESSION, the
 * FLAG-form offsides guard, LOO scoped, two-fractions, the reads as frozen literals on
 * STORED booleans) → this exam.
 *
 * THE USER'S SENTENCE (#396, verbatim): 「并且门将现在仍然有的时候最后一刻突然瞬移到球的那个地方」.
 * GK-C0's READ: the keeper's body is not written in play; THE BALL jumps — a catch resolves up
 * to the fingertip reach from the body and the carry law snaps the owned ball to his feet the
 * next tick. GK-T0/T0b/T0c built the DIVE LAW (flag `gkDiveBody`, dormant): the body goes to
 * the ball and the caught ball waits. THIS EXAM asks, on the user's face: with the law ON,
 * does the caught ball stop jumping — and what does it cost?
 *
 * ⛔ THIS IS AN EXAM. It ARMS NOTHING in the game and SHIPS NOTHING: the flag lives only in
 * this instrument's own match constructors. Its READS are FROZEN LITERALS selected by STORED
 * booleans and they NAME GK-ENTRY (world 15 = world 14 + the dive door) or STOP.
 * ⛔ X-SRC-ZERO: no file under `src/` or `tests/` is created or edited. The probe reads public
 * `Match` / `Team` / `Player` / `Ball` state before and after `match.step(DT)`. THERE IS NO
 * WRAPPER — `gLockstep` proves observed ≡ unobserved byte for byte, PER ARM.
 * ⛔ WORLDS 12/13/14 BYTES UNTOUCHED; the production fingerprint is RECOMPUTED, not quoted.
 *
 * ⭐ canon, VERBATIM: "an event attribution reads the engine's own record when one exists
 * (`shotLog`, the contest episodes, `lastTouch`); a heuristic is written only where no record
 * exists, and says so" (home: RC-T1B-READY-EXAM.md §COMMANDER CORRECTIONS item 5, #381 item 3).
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
import { Match } from '../../src/sim/Match';
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';
import { Player } from '../../src/sim/Player';
import {
  DT, GK_CLAIM_HEIGHT, GK_HOLD_CLEARANCE, GK_CONTROL_MAX_SPEED, GK_RUSH_ENVELOPE,
  CONTROL_RADIUS, PLAYER_MIN_DIST, HALF_L,
} from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, bqArmedVersion, lnArmedVersion,
  loadL3Dose, loadPcDose, pcDoseGuard,
  BQ_WORLD_VERSION, LN_WORLD_VERSION, type L3DoseCell, type PcDoseTable,
} from '../../src/game/a4World';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { v2 } from '../../src/utils/vec';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE — no bypass (the LN-C0 §1 form, GK-C0's copy)           */
/* ========================================================================== */
const ENV_WHITELIST = ['GKT1_MODE', 'GKT1_N', 'GKT1_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('GKT1_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`GK-T1 FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.GKT1_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('GK-T1 FATAL — GKT1_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.GKT1_N !== undefined ? Number(process.env.GKT1_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('GK-T1 FATAL — GKT1_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.GKT1_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`GKT1_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`GKT1_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`GKT1_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/gk-t1-dive-exam.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/gk-t1-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('GK-T1 FATAL — an override run may never write the canonical artifact path');
  process.exit(3);
}
/** ⭐⭐ THE INSTRUMENT OF RECORD — this file's own path, used for the stage block's hash. */
const INSTRUMENT_PATH = 'scripts/probes/gk-t1-dive-exam.ts';

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
const addInto = (a: number[], b: readonly number[]): void => {
  for (let i = 0; i < a.length; i++) a[i] += b[i];
};
const maxInto = (a: number[], b: readonly number[]): void => {
  for (let i = 0; i < a.length; i++) a[i] = Math.max(a[i], b[i]);
};
const ratio = (num: number, den: number): number => (den === 0 ? Number.NaN : num / den);
const binOf = (v: number, width: number, n: number): number => {
  const i = Math.floor(v / width);
  return i < 0 ? 0 : i >= n ? n - 1 : i;
};
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
/** ⭐⭐ THE R1 EDGE BINNER — ruling #401 item 3(ii)'s FROZEN, NON-UNIFORM edges. The bin index
 *  is the count of edges strictly below the value; bin 0 is [0, edges[0]) and the last bin is
 *  the open tail [last edge, ∞). Frozen before any battery seed. */
const R1_EDGES = [0.1, 0.3, 0.5, 1.0, 2.0, 3.0] as const;
const R1_BINS = R1_EDGES.length + 1;
const edgeBinOf = (v: number): number => {
  let i = 0;
  while (i < R1_EDGES.length && v >= R1_EDGES[i]) i += 1;
  return i;
};
/** the R1 THRESHOLD — 1.0 m, ruling #401 item 3(ii). It is ALSO an R1 edge, so the share above
 *  it re-derives from the stored bins as the sum of the bins at index ≥ 4. */
const R1_THRESHOLD_INDEX = 4;
const R1_THRESHOLD_M = R1_EDGES[R1_THRESHOLD_INDEX - 1];
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
   §COMMANDER CORRECTIONS item 1, ruling #306 item 4); and VERBATIM: "a seam-map gate pins
   occurrence COUNTS per needle and enumerates EVERY occurrence's site" (home:
   PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 1).
   ⭐⭐ THE SEAM IS RE-ANCHORED AT THIS HEAD: the catch branch CHANGED at GK-T0c (the write is
   now the LAST statement of its branch, after `pushEvent` and `giveBall`), and the three
   release sites (`giveBall`'s clear, the ownership sweep, the waiting branch) are NEW spans. */
/* ========================================================================== */
const MECH_PATH = 'src/sim/mechanics.ts';
const MATCH_PATH = 'src/sim/Match.ts';
const PLAYER_PATH = 'src/sim/Player.ts';
const CONST_PATH = 'src/sim/constants.ts';
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const EXEC_PATH = 'src/ai/actionExecutor.ts';
const RENDER_PATH = 'src/render/MatchRenderer.ts';
const A4_PATH = 'src/game/a4World.ts';
const TYPES_PATH = 'src/sim/types.ts';
const CTBT1_PATH = 'scripts/probes/ctb-t1-supply-exam.ts';
const DLCT1_PATH = 'scripts/probes/dlc-t1-choice-exam.ts';
const LNT1PB_PATH = 'scripts/probes/ln-t1pb-own-lane-exam.ts';
const ANCHOR_FILES = [MECH_PATH, MATCH_PATH, PLAYER_PATH, CONST_PATH, BRAIN_PATH, EXEC_PATH,
  RENDER_PATH, A4_PATH, TYPES_PATH, CTBT1_PATH, DLCT1_PATH, LNT1PB_PATH];
const SRC_OF: Record<string, string> = {};
for (const p of ANCHOR_FILES) SRC_OF[p] = readFileSync(p, 'utf8');
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
/** ⭐ backtick-bearing source lines are built by CONCATENATION so this instrument's own text
 *  never carries a template literal that could be mistaken for the source's. */
const BT = String.fromCharCode(96);
const DOLLAR = '$';
const gkName = `${BT}${DOLLAR}{gk.name}`;

/* ---- ⭐⭐⭐ THE SEAM'S FOUR READ SITES AND TWO WRITE SITES, AT THIS HEAD ---- */
anchor('⭐⭐⭐ M-GK.1 THE CATCH WRITE — `caught: true`, THE LAST STATEMENT of its branch '
  + '(GK-T0c, ruling #400 item 3: after `pushEvent` and after `giveBall`)', MECH_PATH,
  '      if (match.gkDiveBody) gk.saveContact = { x: ball.pos.x, y: ball.pos.y, caught: true };',
  1);
anchor('⭐⭐⭐ M-GK.1 THE PARRY WRITE — `caught: false`, STEER-ONLY and FIRST in its branch',
  MECH_PATH,
  '      if (match.gkDiveBody) gk.saveContact = { x: ball.pos.x, y: ball.pos.y, caught: false };',
  1);
anchor('⭐⭐ THE CATCH EVENT — the engine\'s own text this exam joins on', MECH_PATH,
  `      match.pushEvent('save', defSide, ${gkName} catches it${BT});`, 1);
anchor('⭐⭐ THE CATCH\'s `giveBall(gk)` — the gain the write now follows (TWO occurrences at '
  + 'this indent — the catch\'s and the high-ball claim\'s — both ENUMERATED)', MECH_PATH,
  '      match.giveBall(gk);', 2);
anchor('⭐⭐ THE CATCH BRANCH itself — inside reach, under 21 m/s, on an 0.8 roll', MECH_PATH,
  '    if (dNow <= reach && speed < 21 && match.rng.chance(0.8)) {', 1);
anchor('⭐⭐ THE PARRY EVENT — the engine\'s own text', MECH_PATH,
  `      match.pushEvent('save', defSide, ${gkName} parries!${BT});`, 1);
anchor('⭐⭐⭐ M-GK.2′ THE EXECUTOR\'S ONE POST-SWITCH OVERRIDE — the GATE IS THE FIELD ITSELF',
  EXEC_PATH, '  if (match.gkDiveBody && p.saveContact !== null) {', 1);
anchor('⭐⭐ …its CLAMPED target (every keeper case but `GoalkeeperRush`)', EXEC_PATH,
  '      : clampToBox(p.saveContact, team.attackDir);', 1);
anchor('⭐⭐ …its RAW target under `GoalkeeperRush` (a sweeper leaves his box)', EXEC_PATH,
  '      ? { x: p.saveContact.x, y: p.saveContact.y }', 1);
anchor('⭐⭐⭐ M-GK.3′ RELEASE (b) — THE OWNERSHIP SWEEP, one guarded loop above the ball step',
  MATCH_PATH,
  '          if (q.saveContact !== null && q.saveContact.caught && this.ball.owner !== q) {', 1);
anchor('⭐⭐ …its own clear', MATCH_PATH, '            q.saveContact = null;', 1);
anchor('⭐⭐ …its flag gate (the OFF path is one boolean test, no loop)', MATCH_PATH,
  '    if (this.gkDiveBody) {', 1);
anchor('⭐⭐⭐ M-GK.3′ RELEASE (c) — THE `giveBall` CLEAR, immediately after `ball.owner = p;`',
  MATCH_PATH, '    if (p.saveContact !== null && p.saveContact.caught) p.saveContact = null;', 1);
anchor('⭐⭐ …the assignment it follows', MATCH_PATH, '    ball.owner = p;', 1);
anchor('⭐⭐⭐ M-GK.3′ THE WAITING BRANCH — `gkHands`, the ONE waiting branch in `src/**`',
  MATCH_PATH, '      const gkHands = this.gkDiveBody && ball.owner.role === ' + "'GK'", 1);
anchor('⭐⭐⭐ THE ARRIVAL PREDICATE\'s OWN EXPRESSION — the body\'s CARRY POINT minus the '
  + 'contact (x); THIS is the expression this exam reconstructs tick by tick', MATCH_PATH,
  '        const cx = ball.owner.pos.x + ball.owner.heading.x * carry - gkHands.x;', 1);
anchor('⭐⭐ …and its y line', MATCH_PATH,
  '        const cy = ball.owner.pos.y + ball.owner.heading.y * carry - gkHands.y;', 1);
anchor('⭐⭐ …THE HOLD TEST — outside `carry` ⇒ the ball is HELD AT THE CONTACT', MATCH_PATH,
  '        if (cx * cx + cy * cy > carry * carry) heldAtHands = true;', 1);
anchor('⭐⭐⭐ M-GK.3′ RELEASE (a) — ARRIVAL: the contact CONSUMED, the shipped placement runs '
  + 'the same tick', MATCH_PATH,
  '        else ball.owner.saveContact = null; // consumed: the hands have arrived', 1);
anchor('⭐⭐ THE HELD PLACEMENT — the ball pinned AT the contact while waiting', MATCH_PATH,
  '        ball.pos.x = gkHands.x;', 1);
anchor('⭐⭐ THE SHIPPED CARRY PLACEMENT — owner.pos + heading · carry (the release target)',
  MATCH_PATH, '        ball.pos.x = ball.owner.pos.x + ball.owner.heading.x * carry;', 1);
anchor('⭐⭐⭐ `carry` — THE ONE DISTANCE THE LAW USES; the KEEPER\'S HANDS value', MATCH_PATH,
  '          ? 0.3', 1, 0.3);
anchor('⭐⭐ …and the OUTFIELD carrier value on the same ternary', MATCH_PATH,
  '          : 0.85;', 1, 0.85);
anchor('⭐⭐ …the ternary\'s own condition (the hands: `gkHoldTimer > 0` or a distributing GK)',
  MATCH_PATH,
  '        ball.owner.gkHoldTimer > 0 || (ball.owner.role === ' + "'GK' && ball.owner.gkDistributing)",
  1);
anchor('⭐⭐⭐ THE FIELD ITSELF — `Player.saveContact { x, y, caught } | null`', PLAYER_PATH,
  '  saveContact: { x: number; y: number; caught: boolean } | null = null;', 1);
anchor('⭐⭐ THE PARRY-WINDOW CLEAR — the sprite\'s clock ends a PARRY contact and nothing else',
  PLAYER_PATH,
  '    if (this.saveContact !== null && !this.saveContact.caught && this.saveAnimTimer === 0) this.saveContact = null;',
  1);
anchor('⭐⭐ THE TWO LIFECYCLE CLEARS — `becomeSub` and `resetForKickoff`, both guarded (TWO '
  + 'occurrences, both ENUMERATED)', PLAYER_PATH,
  '    if (this.saveContact !== null) this.saveContact = null;', 2);
anchor('⭐⭐ THE FLAG — `gkDiveBody?: boolean` on the config, DEFAULT OFF', MATCH_PATH,
  '  gkDiveBody?: boolean;', 1);
anchor('⭐⭐ …its constructor read, defaulting to `false`', MATCH_PATH,
  '    this.gkDiveBody = cfg.gkDiveBody ?? false;', 1, false);
anchor('⭐⭐ …and the readonly field it lands on', MATCH_PATH,
  '  readonly gkDiveBody: boolean;', 1);
/* ---- ⭐⭐ `gkFeet` — A LOCAL CONST, hence a DECLARED RECONSTRUCTION + the engine's own
   OBSERVABLE CONSEQUENCE (the action `giveBall` sets on that branch) ---- */
anchor('⭐⭐⭐ `gkFeet` — the LOCAL const inside `giveBall` (no field, no export): a keeper who '
  + 'collects OUTSIDE his own area gets NO hold and NO bubble', MATCH_PATH,
  '    const gkFeet =', 1);
anchor('⭐⭐ …its geometric limb — the engine\'s OWN `inPenaltyBox`', MATCH_PATH,
  '      (backPass || !this.inPenaltyBox(p.pos, p.side));', 1);
anchor('⭐⭐ …its restart-taker limb', MATCH_PATH, '      this.restartKickGid !== p.gid &&', 1);
anchor('⭐⭐ `inPenaltyBox` — PUBLIC on `Match`, so the reconstruction CALLS the engine\'s own '
  + 'method rather than re-deriving the geometry', MATCH_PATH,
  '  inPenaltyBox(pos: V2, defSide: Side): boolean {', 1);
anchor('⭐⭐ THE OBSERVABLE CONSEQUENCE of the `gkFeet` branch — `action = Dribble` on a KEEPER '
  + '(the only way a keeper leaves `giveBall` with `Dribble`)', MATCH_PATH,
  "      p.action = { type: 'Dribble', scores: p.action.scores }; // at his feet, on the clock",
  1);
anchor('⭐⭐ THE HOLD BRANCH it replaces — `gkHoldTimer` and `gkDistributing` set', MATCH_PATH,
  '      p.gkDistributing = true; // the release is deliberate (28.3)', 1);
/* ---- ⭐⭐ G8's SITE — the keeper's RELEASE KICK ---- */
anchor('⭐⭐⭐ G8 — `kickBall`, the engine\'s ONE struck release (the ball leaves the owner and '
  + '`lastTouch` records who struck it)', MATCH_PATH,
  '  kickBall(p: Player, dir: V2, speed: number, loft = 0): void {', 1);
anchor('⭐⭐ …its own ball placement 0.9 m off the kicker', MATCH_PATH,
  '    ball.pos = add(p.pos, scale(dir, 0.9));', 1, 0.9);
anchor('⭐⭐ `pendingPass` — the engine\'s OWN record of a struck pass, read for G10 (the '
  + 'keeper\'s passes)', MATCH_PATH, '  pendingPass: PendingPass | null = null;', 1);
anchor('⭐ `PendingPass.passerGid` — G10\'s key', MATCH_PATH, '  passerGid: number;', 1);
/* ---- THE SAVE ITSELF and the reach reconstruction (GK-C0's own anchors, re-taken) ---- */
anchor('⭐⭐ `tryKeeperSave` — the function this exam examines', MECH_PATH,
  'export function tryKeeperSave(match: Match): void {', 1);
anchor('⭐⭐ `keeperReach` — MODULE-PRIVATE (no `export`), hence the DECLARED reconstruction',
  MECH_PATH,
  'function keeperReach(defTeam: { genome: { keeperAggression: number } }, gk: Player): number {',
  1);
anchor('⭐⭐ THE REACH FORMULA\'s own line — 2.05 + keeperAggression·0.4 + (reflexes − 0.5)·0.5',
  MECH_PATH,
  '    2.05 + defTeam.genome.keeperAggression * 0.4 + (gk.attrs.reflexes - 0.5) * 0.5 +', 1);
anchor('⭐⭐ THE CAT\'s extra hand — +0.12 on the trait', MECH_PATH,
  "    (gk.traits.includes('cat') ? 0.12 : 0)", 1);
anchor('⭐⭐ `SAVE_STRETCH` = 1.35 — THE FINGERTIP STRETCH', MECH_PATH,
  'const SAVE_STRETCH = 1.35;', 1, 1.35);
anchor('⭐⭐ `dNow` — the engine\'s OWN ball↔keeper distance at the save', MECH_PATH,
  '  const dNow = dist(gk.pos, ball.pos);', 1);
anchor('⭐⭐ `saveAnimTimer = 0.7` — the DIVE WINDOW opened at the save (a render clock)',
  MECH_PATH, '  gk.saveAnimTimer = 0.7; // the dive is visible whether it saves or not (27.4)',
  1, 0.7);
anchor('⭐⭐ `markShotOutcome(\'saved\')` — tryKeeperSave\'s OWN ledger write (TWO occurrences: '
  + 'its own 4-space line and, as a SUBSTRING, the claim\'s deeper-indented one)', MECH_PATH,
  "    match.markShotOutcome('saved');", 2);
anchor('⭐⭐ THE HIGH-BALL CLAIM\'s save event — a SECOND save family (it sets NO contact point)',
  MECH_PATH,
  `      match.pushEvent('save', gk.side, ${gkName} claims the high ball${BT});`, 1);
anchor('⭐⭐ THE SMOTHER\'s save event — a THIRD save family', MECH_PATH,
  `    match.pushEvent('save', gk.side, ${gkName} smothers at ${DOLLAR}{owner.name}'s feet!${BT});`,
  1);
/* ---- THE LEDGERS ---- */
anchor('⭐⭐ `ShotLogEntry` — the shot ledger\'s own row type', MATCH_PATH,
  'export interface ShotLogEntry {', 1);
anchor('⭐⭐ its OUTCOME field — the join key', MATCH_PATH,
  "  outcome: 'pending' | 'goal' | 'saved' | 'miss';", 1);
anchor('⭐⭐ the `xg` field — G4\'s denominator (TWO occurrences: `PendingShot`\'s and '
  + '`ShotLogEntry`\'s — both ENUMERATED; G4 reads the LEDGER\'s)', MATCH_PATH,
  '  xg: number;', 2);
anchor('⭐⭐ `markShotOutcome` — the ONE writer of the outcome', MATCH_PATH,
  "  markShotOutcome(outcome: 'goal' | 'saved' | 'miss'): void {", 1);
anchor('⭐ `simTick` — the tick index of record', MATCH_PATH,
  '  get simTick(): number { return this.stepCount; }', 1);
/* ---- THE BODY'S OWN INTEGRATION (the residual predicate's subject) ---- */
anchor('⭐⭐ `topSpeed` — the cap GK-C0\'s OVER-CAP face compares against', PLAYER_PATH,
  '  get topSpeed(): number {', 1);
anchor('⭐⭐ its formula — baseSpeed · (0.62 + 0.38 · stamina)', PLAYER_PATH,
  '    return this.baseSpeed * (0.62 + 0.38 * this.stamina);', 1);
anchor('⭐⭐⭐ THE INTEGRATION ITSELF (x) — `pos = pos + vel · dt`, and the SAME `vel` survives '
  + 'the step: THIS is why the RESIDUAL of a pure integrated step is EXACTLY ZERO', PLAYER_PATH,
  '    this.pos.x = this.pos.x + this.vel.x * dt;', 1);
anchor('⭐⭐⭐ …and (y)', PLAYER_PATH, '    this.pos.y = this.pos.y + this.vel.y * dt;', 1);
anchor('⭐⭐ `resetForKickoff` — A DIRECT `pos` WRITE (the residual fixture\'s TRUE case)',
  PLAYER_PATH, '  resetForKickoff(pos: V2): void {', 1);
anchor('⭐⭐ its write line', PLAYER_PATH, '    this.pos = pos;', 1);
anchor('⭐⭐ the SUBSTITUTE constructor placement — a second direct `pos` write', PLAYER_PATH,
  '    this.pos = v2(pos.x, pos.y);', 1);
anchor('⭐⭐⭐ `resolveOverlaps` — THE THIRD FIXTURE CASE. ⚠ IT WRITES BOTH `pos` AND `vel` '
  + '(ruling #401 item 3(i) expected position-free; §DEV-PREFLIGHT discloses the measured '
  + 'behaviour)', MATCH_PATH, '  private resolveOverlaps(): void {', 1);
anchor('⭐⭐ …its own POSITION push (the equal-bodies branch, x)', MATCH_PATH,
  '          a.pos.x += px;', 1);
anchor('⭐⭐ …and its VELOCITY correction\'s gate', MATCH_PATH,
  '        if (relativeNormal < 0) {', 1);
anchor('⭐ `clampPlayersToPitch` — the per-tick pitch clamp, another positional write',
  MATCH_PATH, '      p.pos.x = Math.max(-HALF_L + 0.3, Math.min(HALF_L - 0.3, p.pos.x));', 1);
anchor('⭐⭐ THE `GK_HOLD_CLEARANCE` PUSH — an OPPONENT inside 3 m of a HOLDING keeper',
  MATCH_PATH, '            o.pos = add(gk.pos, scale(dir, GK_HOLD_CLEARANCE));', 1);
anchor('⭐⭐ THE SUBSTITUTION placement — `becomeSub` CALLED with a touchline position',
  MATCH_PATH, '      out.becomeSub(sub, v2(out.side === 0 ? -1.2 : 1.2, HALF_W - 0.6));', 1);
/* ---- THE KEEPER'S DECISION SURFACE ---- */
anchor('⭐⭐ `decideGoalkeeper` — the keeper\'s ONE decision function', BRAIN_PATH,
  'function decideGoalkeeper(p: Player, team: Team, match: Match): void {', 1);
anchor('⭐⭐ `decidePlayer` — the OWNER branch #398 item 1(ii) added to the keeper root set',
  BRAIN_PATH, 'export function decidePlayer(p: Player, match: Match): void {', 1);
anchor('⭐⭐ the executor\'s `GoalkeeperSave` case', EXEC_PATH, "    case 'GoalkeeperSave': {", 1);
anchor('⭐⭐ the executor\'s `GoalkeeperRush` case', EXEC_PATH, "    case 'GoalkeeperRush': {", 1);
anchor('⭐⭐ the executor\'s `GoalkeeperPosition` case', EXEC_PATH,
  "    case 'GoalkeeperPosition': {", 1);
/* ---- THE RENDERER'S DIVE (a RENDER fact — documented, NEVER measured) ---- */
anchor('⭐⭐ THE DIVE WINDOW read — `saveAnimTimer / 0.7`', RENDER_PATH,
  '        const k = p.saveAnimTimer / 0.7;', 1, 0.7);
anchor('⭐⭐ THE DIVE STRETCH — scale(1 + 0.7k, 1 − 0.35k)', RENDER_PATH,
  '        s.body.scale.set(1 + 0.7 * k, 1 - 0.35 * k);', 1);
/* ---- THE ENGINE CONSTANTS ---- */
anchor('`DT`', CONST_PATH, 'export const DT = 1 / 60;', 1, 1 / 60);
anchor('`GK_CLAIM_HEIGHT`', CONST_PATH, 'export const GK_CLAIM_HEIGHT = 2.55;', 1, 2.55);
anchor('`GK_HOLD_CLEARANCE`', CONST_PATH, 'export const GK_HOLD_CLEARANCE = 3;', 1, 3);
anchor('`GK_CONTROL_MAX_SPEED`', CONST_PATH, 'export const GK_CONTROL_MAX_SPEED = 23;', 1, 23);
anchor('`GK_RUSH_ENVELOPE`', CONST_PATH, 'export const GK_RUSH_ENVELOPE = 5;', 1, 5);
anchor('`CONTROL_RADIUS`', CONST_PATH,
  'export const CONTROL_RADIUS = 1.25 * CONTROL_REACH_SCALE;', 1);
anchor('`PLAYER_MIN_DIST` — the overlap-resolver\'s own radius', CONST_PATH,
  'export const PLAYER_MIN_DIST = 1.05 * BODY_SCALE;', 1);
/* ---- THE WORLDS ---- */
anchor('⭐⭐ world 13 = world 12 + the ONE cushion door, the composer CALLING world 12', A4_PATH,
  '    return { ...a4MatchFlags(RA_WORLD_VERSION), ...BQ_WORLD_DOORS };', 1);
anchor('⭐⭐ world 14 = world 13 + the ONE own-lane door — E14\'s composition', A4_PATH,
  '    return { ...a4MatchFlags(BQ_WORLD_VERSION), ...LN_WORLD_DOORS };', 1);
anchor('⭐⭐ `LN_WORLD_DOORS` — the own-lane price', A4_PATH,
  'export const LN_WORLD_DOORS = { lnOwnLanePrice: true } as const;', 1);
anchor('⭐⭐ `bqArmedVersion` — the world-13 gate of record', A4_PATH,
  'export function bqArmedVersion(match: Match): 0 | BqWorldVersion {', 1);
anchor('⭐⭐ `lnArmedVersion` — the world-14 gate', A4_PATH,
  'export function lnArmedVersion(match: Match): 0 | LnWorldVersion {', 1);
anchor('⭐⭐ ⛔ `gkDiveBody` NEVER APPEARS IN `a4World.ts` — the door is not in any world '
  + '(the count is ZERO, and that is the anchor)', A4_PATH, 'gkDiveBody', 0);
/* ---- ⭐⭐ THE GUARD TOLERANCE — INHERITED BY ANCHOR, never typed as a decimal ---- */
anchor('⭐⭐⭐ GUARD TOLERANCE — `NI_FRACTION` as an EXPRESSION in CTB-T1\'s probe', CTBT1_PATH,
  'const NI_FRACTION = 1 - 0.275 / 0.380;', 1);
anchor('⭐⭐ …and the SAME expression in DLC-T1\'s probe, read as a SECOND source', DLCT1_PATH,
  'const NI_FRACTION = 1 - 0.275 / 0.380;', 1);
anchor('⭐ LN-T1′b\'s OWN offside FLAG form (#157): a resolved INCREASE flags and gates nothing',
  LNT1PB_PATH, '    resolved: d.resolved, flag: d.resolved && d.delta > 0, gating: false,', 1);

/* ========================================================================== */
/* §4 THE DECLARED RECONSTRUCTIONS — every constant read OUT of an anchored line */
/* ========================================================================== */
/** ⭐⭐ `keeperReach` (module-private): GK-C0's reconstruction, re-taken at this head. The four
 *  constants are PARSED from the two anchored source lines and fixture-pinned term by term. */
const REACH_LINE = '    2.05 + defTeam.genome.keeperAggression * 0.4 + (gk.attrs.reflexes - 0.5) '
  + '* 0.5 +';
const CAT_LINE = "    (gk.traits.includes('cat') ? 0.12 : 0)";
const REACH_NUMS = (REACH_LINE.match(/[0-9]+\.?[0-9]*/g) ?? []).map(Number);
const CAT_NUMS = (CAT_LINE.match(/0\.12/g) ?? []).map(Number);
const REACH_BASE = REACH_NUMS[0];
const REACH_AGGR = REACH_NUMS[1];
const REACH_REFLEX_MID = REACH_NUMS[2];
const REACH_REFLEX_W = REACH_NUMS[3];
const REACH_CAT = CAT_NUMS[0];
const REACH_CONSTANTS_OK = REACH_BASE === 2.05 && REACH_AGGR === 0.4
  && REACH_REFLEX_MID === 0.5 && REACH_REFLEX_W === 0.5 && REACH_CAT === 0.12
  && SRC_OF[MECH_PATH].includes(REACH_LINE) && SRC_OF[MECH_PATH].includes(CAT_LINE);
const keeperReachRecon = (
  keeperAggression: number, reflexes: number, isCat: boolean,
): number => REACH_BASE + keeperAggression * REACH_AGGR
  + (reflexes - REACH_REFLEX_MID) * REACH_REFLEX_W + (isCat ? REACH_CAT : 0);
const SAVE_STRETCH_RECON = 1.35;
/** ⭐⭐⭐ `carry` — THE LAW'S ONE DISTANCE, EXTRACTED from the carry ternary's own two anchored
 *  lines, never typed. The keeper's hands take 0.3; an outfield carrier 0.85. */
const CARRY_GK = Number((SRC_OF[MATCH_PATH].match(/\n {10}\? (0\.\d+)\n {10}: (0\.\d+);\n/)
  ?? ['', 'NaN', 'NaN'])[1]);
const CARRY_OUT = Number((SRC_OF[MATCH_PATH].match(/\n {10}\? (0\.\d+)\n {10}: (0\.\d+);\n/)
  ?? ['', 'NaN', 'NaN'])[2]);
/** ⭐⭐⭐ THE ARRIVAL PREDICATE, RECONSTRUCTED EXACTLY AS THE WAITING BRANCH WRITES IT
 *  (anchored above): `cx = owner.pos.x + owner.heading.x · carry − contact.x` (same for y), and
 *  the ball is HELD while `cx² + cy² > carry²`. ⛔ NOT a distance-vs-`carry` paraphrase: the
 *  squared form is the engine's own. */
const carryPointOf = (
  px: number, py: number, hx: number, hy: number, carry: number,
): { x: number; y: number } => ({ x: px + hx * carry, y: py + hy * carry });
const heldAtHandsRecon = (
  px: number, py: number, hx: number, hy: number, carry: number,
  cxc: number, cyc: number,
): boolean => {
  const cx = px + hx * carry - cxc;
  const cy = py + hy * carry - cyc;
  return cx * cx + cy * cy > carry * carry;
};
/** ⭐⭐⭐ THE GUARD TOLERANCE FRACTION — INHERITED BY ANCHOR from CTB-T1's own probe line and
 *  EVALUATED FROM ITS TWO NUMERALS. ⛔ NEVER TYPED AS A DECIMAL anywhere in this instrument;
 *  DLC-T1's identical line is read as a SECOND source and required to agree. */
const niPair = (path: string): [number, number] => {
  const m = SRC_OF[path].match(/const NI_FRACTION = 1 - (0\.\d+) \/ (0\.\d+);/);
  return m === null ? [Number.NaN, Number.NaN] : [Number(m[1]), Number(m[2])];
};
const NI_A = niPair(CTBT1_PATH);
const NI_B = niPair(DLCT1_PATH);
const NI_FRACTION = 1 - NI_A[0] / NI_A[1];
const NI_FRACTION_SECOND_SOURCE = 1 - NI_B[0] / NI_B[1];
const NI_OK = Number.isFinite(NI_FRACTION) && NI_FRACTION > 0 && NI_FRACTION < 1
  && NI_FRACTION === NI_FRACTION_SECOND_SOURCE;
/** THE ACTION VOCABULARY — read off `ActionType`'s OWN union, never re-typed. */
const AT_START = 'export type ActionType =';
const atIdx = SRC_OF[TYPES_PATH].indexOf(AT_START);
const ACTIONS = (SRC_OF[TYPES_PATH].slice(atIdx, SRC_OF[TYPES_PATH].indexOf(';', atIdx))
  .match(/'([A-Za-z]+)'/g) ?? []).map((s) => s.slice(1, -1));
const ACTION_CELLS = [...ACTIONS, 'unknown'] as const;
const AI = (a: string): number => {
  const i = ACTIONS.indexOf(a);
  return i < 0 ? ACTIONS.length : i;
};
/** ⭐ THE SPRITE'S WINDOW IN TICKS — the ruling's 42 is DERIVED, not typed: 0.7 s ÷ DT.
 *  0.7 is EXTRACTED from `saveAnimTimer = 0.7`'s anchored line; DT from its own. */
const SAVE_WINDOW_S = Number((SRC_OF[MECH_PATH]
  .match(/ {2}gk\.saveAnimTimer = (0\.\d+); \/\/ the dive is visible/) ?? ['', 'NaN'])[1]);
const SPRITE_TICKS = Math.round(SAVE_WINDOW_S / DT);

/* ========================================================================== */
/* §5 SEEDS — block 12,552,000–999 (#401 items 3(vii) and 6)                   */
/* ========================================================================== */
const BLOCK_BASE = 12_552_000;
const BLOCK_TOP = 12_552_999;
/** ⭐⭐ N_FROZEN = 999 — the block's OWN AFFORDANCE after the construction receipt at
 *  12,552,999 (seeds 12,552,000–12,552,998). #401 item 3(vii) says it in advance: catches run
 *  ≈ 0.5 per match, so the sizing will ask for more than the block holds — the instrument SAYS
 *  SO (`sizing.rows[].resolvableAtNFrozen`) and publishes the realised half-width / MDE at N. */
const N_FROZEN = 999;
const N = N_ENV ?? (MODE === 'smoke' ? 12 : N_FROZEN);
const SCRATCH_BASE = 900_005_400;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + i : BLOCK_BASE + i));
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 20 : BLOCK_TOP;
const WORLD_PIN_SEED = SCRATCH_BASE + 70;
const LOCKSTEP_SEEDS = [SCRATCH_BASE + 90, SCRATCH_BASE + 91];
const XDET_SEEDS = LOCKSTEP_SEEDS;
const FIXTURE_SEED = SCRATCH_BASE + 99;
/** ⭐⭐ G-REPRO-GKC0's RE-WALKS — GK-C0's OWN CONSUMED BAND (canon: verifier scratch walks use
 *  the stage's own consumed band or the out-of-band scratch range). NOT a consumption. */
const REPRO_SEEDS = Array.from({ length: 12 }, (_, i) => 12_551_000 + i);
const GKC0_ARTIFACT = 'docs/world-model/data/gk-c0-keeper-jump-census.json';

/* ========================================================================== */
/* §6 THE ARMS — SIX: ABSENT vs ARMED on THREE compositions, PAIRED on shared seeds */
/* ========================================================================== */
const COMPOSITIONS = ['E13', 'D13', 'E14'] as const;
type Composition = (typeof COMPOSITIONS)[number];
const ARMS = ['E13-ABSENT', 'E13-ARMED', 'D13-ABSENT', 'D13-ARMED',
  'E14-ABSENT', 'E14-ARMED'] as const;
type Arm = (typeof ARMS)[number];
const ABSENT_OF: Record<Composition, Arm> = {
  E13: 'E13-ABSENT', D13: 'D13-ABSENT', E14: 'E14-ABSENT',
};
const ARMED_OF: Record<Composition, Arm> = {
  E13: 'E13-ARMED', D13: 'D13-ARMED', E14: 'E14-ARMED',
};
const COMP_OF = (a: Arm): Composition => a.slice(0, 3) as Composition;
const IS_ARMED = (a: Arm): boolean => a.endsWith('-ARMED');
const ARM_LABEL: Record<Arm, string> = {
  'E13-ABSENT': 'world 13 EMPTY-BOOK, flag ABSENT — THE CONTROL OF RECORD (the shipped path)',
  'E13-ARMED': 'world 13 EMPTY-BOOK, `gkDiveBody: true` — THE READ OF RECORD',
  'D13-ABSENT': 'world 13 DOSED, flag ABSENT — the control for the form the user plays',
  'D13-ARMED': 'world 13 DOSED, `gkDiveBody: true` — the form the user plays, BESIDE',
  'E14-ABSENT': 'world 14 EMPTY-BOOK, flag ABSENT — the control on the open door',
  'E14-ARMED': 'world 14 EMPTY-BOOK, `gkDiveBody: true` — BESIDE, because the own-lane door '
    + 'prices the keeper\'s DISTRIBUTION (#398 item 1(ii))',
};
const L3_DOSE_FILE = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_DOSE_FILE = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_DOSE_PIN = 'a41a114c4727a2a6702bf4ca79b46b1d6924d80fa7fefb388d5364fd57da37db';
const PC_DOSE_PIN = '0301d7109cb0883a410a55cef9ff838dbce48d3627c418cbedd3e9e34448982f';
const L3_DOSE_BYTES_SHA = sha(readFileSync(L3_DOSE_FILE, 'utf8'));
const PC_DOSE_BYTES_SHA = sha(readFileSync(PC_DOSE_FILE, 'utf8'));
if (L3_DOSE_BYTES_SHA !== L3_DOSE_PIN || PC_DOSE_BYTES_SHA !== PC_DOSE_PIN) {
  banner('GK-T1 FATAL — a dose file\'s BYTES do not match the pinned value');
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
  banner(`GK-T1 FATAL — the DOSED arms are not reachable: ${DOSE_LOAD_ERROR ?? 'empty dose'}`);
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
/** ⭐⭐ THE ARMED CONSTRUCTION OF RECORD, COPIED FROM `tests/gkDiveBody.test.ts` l.148–156: the
 *  flag goes into the CONSTRUCTOR's flags beside `a4MatchFlags(world)`, and the world is armed
 *  AFTER. ABSENT is the same object with the key ABSENT (never `false`), which is the shipped
 *  shape — `cfg.gkDiveBody ?? false` (anchored). */
const buildMatch = (seed: number, arm: Arm): Match => {
  const comp = COMP_OF(arm);
  const version = comp === 'E14' ? LN_WORLD_VERSION : BQ_WORLD_VERSION;
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(version),
    ...(IS_ARMED(arm) ? { gkDiveBody: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (comp === 'D13') armA4World(m, null, BQ_WORLD_VERSION, L3_DOSE, PC_DOSE);
  else armA4World(m, null, version);
  return m;
};

/* ========================================================================== */
/* §7 THE WALK-SIDE PREDICATES — PURE, fixture-backed, each able to FIRE        */
/*    canon, VERBATIM: "a scored face's walk-side predicate is pinned — anchored extraction or
   fixture — because the re-derivation gate proves arithmetic, not definitions" … REFINED:
   "anchored extraction protects the source line; a headline-bearing walk-side predicate ALSO
   needs a composition fixture"                                                              */
/* ========================================================================== */
/** ⭐⭐⭐ THE RESIDUAL PREDICATE (ruling #401 item 3(i); it REPLACES GK-C0's cap predicate for
 *  "written"). A keeper tick is RESIDUAL-WRITTEN iff
 *      |pos_after − (pos_before + vel_after · DT)| > 1 mm
 *  — the body moved by something other than its own integrated velocity. `physicsStep` writes
 *  `pos += vel · dt` with the SAME `vel` that survives the step (anchored), so a pure
 *  integrated step has residual EXACTLY 0 and this predicate cannot fire on it. */
const RESIDUAL_M = 1e-3;
const residualOf = (
  x0: number, y0: number, x1: number, y1: number, vx: number, vy: number,
): number => Math.hypot(x1 - (x0 + vx * DT), y1 - (y0 + vy * DT));
const isResidualWritten = (r: number): boolean => r > RESIDUAL_M;
/** ⭐⭐ GK-C0's CAP PREDICATE, KEPT BESIDE AS ITS UPPER BOUND (#398 item 1(i): it OVER-counts,
 *  because `resolveOverlaps` adds velocity after integration). Both are counted, per arm. */
const EPS = 1e-6;
const isOverCap = (disp: number, topSpeed: number): boolean => disp > topSpeed * DT * (1 + EPS);
/** ⭐⭐ GK-C0's BALL-JUMP PREDICATE — its `ballJump.catchShare` face, recomputed on BOTH arms. */
const ballJumped = (ballDisp: number, keeperTopSpeed: number): boolean =>
  ballDisp > keeperTopSpeed * DT * (1 + EPS);

/** ⭐⭐ GK-C0's KEEPER CLASSES, in GK-C0's FROZEN PRECEDENCE — copied so the residual faces are
 *  reported in the same vocabulary and so G-REPRO-GKC0 can compare field for field. */
const KEEPER_CLASSES = ['substitution', 'restartPlacement', 'saveWindow', 'hold',
  'actGoalkeeperSave', 'actGoalkeeperRush', 'actGoalkeeperPosition', 'actChaseBall',
  'actMakeRun', 'actPass', 'unclassified'] as const;
type KeeperClass = (typeof KEEPER_CLASSES)[number];
const KCI = (c: KeeperClass): number => KEEPER_CLASSES.indexOf(c);
const RESTART_FAMILY: readonly KeeperClass[] = ['restartPlacement', 'substitution'];
interface KeeperState {
  subbed: boolean; restart: boolean; saveWindow: boolean; hold: boolean; action: string;
}
const keeperClassOf = (s: KeeperState): KeeperClass => {
  if (s.subbed) return 'substitution';
  if (s.restart) return 'restartPlacement';
  if (s.saveWindow) return 'saveWindow';
  if (s.hold) return 'hold';
  if (s.action === 'GoalkeeperSave') return 'actGoalkeeperSave';
  if (s.action === 'GoalkeeperRush') return 'actGoalkeeperRush';
  if (s.action === 'GoalkeeperPosition') return 'actGoalkeeperPosition';
  if (s.action === 'ChaseBall') return 'actChaseBall';
  if (s.action === 'MakeRun') return 'actMakeRun';
  if (s.action === 'Pass') return 'actPass';
  return 'unclassified';
};
/** ⭐⭐ THE SAVE FAMILIES — read off the engine's OWN event text, never inferred (GK-C0's). */
const SAVE_KINDS = ['catch', 'parry', 'highBallClaim', 'smother', 'otherSaveEvent'] as const;
type SaveKind = (typeof SAVE_KINDS)[number];
const SKI = (k: SaveKind): number => SAVE_KINDS.indexOf(k);
const saveKindOf = (text: string): SaveKind => (text.endsWith(' catches it') ? 'catch'
  : text.endsWith(' parries!') ? 'parry'
    : text.endsWith(' claims the high ball') ? 'highBallClaim'
      : text.includes(' smothers at ') ? 'smother' : 'otherSaveEvent');

/** ⭐⭐⭐ THE RELEASE COMPOSITION — WHICH CLEAR FIRED, **INFERRED FROM THE ENGINE'S STATE**
 *  TICK TO TICK, and said to be an inference. The five clears (M-GK.3′) are: ARRIVAL (the
 *  waiting branch consumed the contact) · OWNERSHIP LOSS (the sweep) · FRESH GAIN (`giveBall`)
 *  · SUBSTITUTION / KICK-OFF (`becomeSub` / `resetForKickoff`) · the SPRITE WINDOW (parries).
 *  THE INFERENCE, in a FROZEN PRECEDENCE, evaluated on the RELEASE TICK:
 *    identity changed            ⇒ substitution
 *    the engine's restart state  ⇒ restartPlacement
 *    the ball's owner is not him ⇒ ownershipLoss
 *    he still owns it AND his own carry point is INSIDE `carry` of the contact (the waiting
 *      branch's OWN squared test, reconstructed) ⇒ arrival
 *    he still owns it AND the carry point is OUTSIDE `carry` (so the arrival test would have
 *      HELD) ⇒ freshGain — the only remaining clear that runs while he owns the ball
 *    the match ended with the contact still held ⇒ matchEndUnreleased */
const RELEASE_CLASSES = ['arrival', 'ownershipLoss', 'freshGain', 'substitution',
  'restartPlacement', 'matchEndUnreleased'] as const;
type ReleaseClass = (typeof RELEASE_CLASSES)[number];
const RLI = (c: ReleaseClass): number => RELEASE_CLASSES.indexOf(c);
interface ReleaseState {
  subbed: boolean; restart: boolean; stillOwner: boolean; wouldStillHold: boolean;
  matchEnded: boolean;
}
const releaseClassOf = (s: ReleaseState): ReleaseClass => {
  if (s.matchEnded) return 'matchEndUnreleased';
  if (s.subbed) return 'substitution';
  if (s.restart) return 'restartPlacement';
  if (!s.stillOwner) return 'ownershipLoss';
  return s.wouldStillHold ? 'freshGain' : 'arrival';
};

/* --- THE FIXTURES --- */
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-9;

/** ⭐⭐ THE RESIDUAL PREDICATE ON REAL, HAND-BUILT BODIES — the shipped `Player`, the shipped
 *  `physicsStep`, the shipped `resetForKickoff`, the shipped substitute constructor. */
const fxAttrs: PlayerAttributes = randomSquad(new Rng(FIXTURE_SEED))[0];
const fxKeeper = new Player(0, 0, 'GK', 'FX', fxAttrs);
fxKeeper.desiredVel = v2(1000, 0);
for (let i = 0; i < 240; i++) fxKeeper.physicsStep(DT);
const fxP0 = { x: fxKeeper.pos.x, y: fxKeeper.pos.y };
const fxTopBefore = fxKeeper.topSpeed;
fxKeeper.physicsStep(DT);
const fxIntegratedDisp = Math.hypot(fxKeeper.pos.x - fxP0.x, fxKeeper.pos.y - fxP0.y);
const fxIntegratedResidual = residualOf(fxP0.x, fxP0.y, fxKeeper.pos.x, fxKeeper.pos.y,
  fxKeeper.vel.x, fxKeeper.vel.y);
fx('residual.fullSpeedIntegratedStepIsNOTWritten',
  isResidualWritten(fxIntegratedResidual), false);
fx('residual.thatStepDidMoveTheBody', fxIntegratedDisp > 0, true);
fx('residual.andItsResidualIsExactlyZero', fxIntegratedResidual === 0, true);
fx('overCap.thatSameStepIsNOTOverCap', isOverCap(fxIntegratedDisp, fxTopBefore), false);
const fxP1 = { x: fxKeeper.pos.x, y: fxKeeper.pos.y };
fxKeeper.resetForKickoff(v2(fxP1.x + 20, fxP1.y + 10));
const fxResetResidual = residualOf(fxP1.x, fxP1.y, fxKeeper.pos.x, fxKeeper.pos.y,
  fxKeeper.vel.x, fxKeeper.vel.y);
fx('residual.resetForKickoffDisplacementISWritten', isResidualWritten(fxResetResidual), true);
const fxP2 = { x: fxKeeper.pos.x, y: fxKeeper.pos.y };
fxKeeper.becomeSub({ rosterIdx: 9, name: 'SUB', attrs: fxAttrs }, v2(fxP2.x - 15, fxP2.y - 5));
fx('residual.becomeSubPlacementISWritten', isResidualWritten(residualOf(fxP2.x, fxP2.y,
  fxKeeper.pos.x, fxKeeper.pos.y, fxKeeper.vel.x, fxKeeper.vel.y)), true);
fx('residual.exactlyAtTheMillimetreIsNOTWritten', isResidualWritten(RESIDUAL_M), false);
fx('residual.aHairOverTheMillimetreIsWritten', isResidualWritten(RESIDUAL_M * 1.001), true);
fx('residual.zeroIsNOTWritten', isResidualWritten(0), false);
fx('residual.thresholdIsOneMillimetre', RESIDUAL_M, 1e-3);
/* ⭐⭐ THE REACH RECONSTRUCTION vs THE ANCHORED FORMULA */
fx('reach.constantsExtractedFromTheAnchoredLines', REACH_CONSTANTS_OK, true);
fx('reach.baseline', near(keeperReachRecon(0, 0.5, false), 2.05), true);
fx('reach.aggressionTerm', near(keeperReachRecon(1, 0.5, false), 2.45), true);
fx('reach.reflexTerm', near(keeperReachRecon(0, 1, false), 2.3), true);
fx('reach.catTerm', near(keeperReachRecon(0, 0.5, true), 2.17), true);
fx('reach.stretchIsTheAnchoredConstant', SAVE_STRETCH_RECON, 1.35);
/* ⭐⭐⭐ THE ARRIVAL PREDICATE — the waiting branch's OWN squared test, both ways */
fx('carry.gkValueExtractedFromTheTernary', CARRY_GK, 0.3);
fx('carry.outfieldValueExtractedFromTheSameTernary', CARRY_OUT, 0.85);
fx('arrival.bodyFarFromTheContactSTILLHOLDS',
  heldAtHandsRecon(0, 0, 1, 0, CARRY_GK, 5, 0), true);
fx('arrival.carryPointONTheContactRELEASES',
  heldAtHandsRecon(0, 0, 1, 0, CARRY_GK, CARRY_GK, 0), false);
fx('arrival.carryPointJUSTINSIDEReleases',
  heldAtHandsRecon(0, 0, 1, 0, CARRY_GK, CARRY_GK + CARRY_GK * 0.99, 0), false);
fx('arrival.carryPointJUSTOUTSIDEHolds',
  heldAtHandsRecon(0, 0, 1, 0, CARRY_GK, CARRY_GK + CARRY_GK * 1.01, 0), true);
/* ⭐⭐ THE ABEAM CASE (GK-T0 §4's honest limit): the BODY is INSIDE `carry` of the contact and
   the law STILL HOLDS, because the arrival predicate is on the CARRY POINT, which the hold-
   facing rule swings sideways. Body at the origin facing +y, contact 0.25 m away on +x. */
fx('arrival.theBODYinsideCarryCanStillHOLD_theAbeamCase',
  heldAtHandsRecon(0, 0, 0, 1, CARRY_GK, 0.25, 0), true);
fx('arrival.andThatBodyIsIndeedInsideCarry', 0.25 <= CARRY_GK, true);
fx('arrival.carryPointIsTheEngineExpression',
  carryPointOf(1, 2, 0, 1, CARRY_GK), { x: 1, y: 2 + CARRY_GK });
/* ⭐⭐ THE R1 EDGE BINNER — every frozen edge, with a NEGATIVE beside */
fx('r1Bin.belowTheFirstEdge', edgeBinOf(0.05), 0);
fx('r1Bin.exactlyOnAnEdgeGoesUP', edgeBinOf(0.1), 1);
fx('r1Bin.oneMetreExactlyIsTheThresholdBin', edgeBinOf(1.0), R1_THRESHOLD_INDEX);
fx('r1Bin.justUnderOneMetreIsBELOW', edgeBinOf(0.999999), R1_THRESHOLD_INDEX - 1);
fx('r1Bin.theOpenTail', edgeBinOf(99), R1_BINS - 1);
fx('r1Bin.theThresholdIsAnEdge', R1_THRESHOLD_M, 1);
fx('r1Bin.edgesAreTheRulingsSix', [...R1_EDGES], [0.1, 0.3, 0.5, 1.0, 2.0, 3.0]);
/* ⭐⭐ THE KEEPER CLASS LADDER (GK-C0's), every branch with a negative beside */
const KS = (o: Partial<KeeperState>): KeeperState => ({
  subbed: false, restart: false, saveWindow: false, hold: false,
  action: 'GoalkeeperPosition', ...o,
});
fx('keeperClass.substitutionWins', keeperClassOf(KS({ subbed: true, restart: true })),
  'substitution');
fx('keeperClass.restartBeatsTheSaveWindow',
  keeperClassOf(KS({ restart: true, saveWindow: true })), 'restartPlacement');
fx('keeperClass.saveWindowBeatsTheHands',
  keeperClassOf(KS({ saveWindow: true, hold: true })), 'saveWindow');
fx('keeperClass.holdBeatsTheAction',
  keeperClassOf(KS({ hold: true, action: 'GoalkeeperSave' })), 'hold');
fx('keeperClass.actGoalkeeperPosition', keeperClassOf(KS({})), 'actGoalkeeperPosition');
fx('keeperClass.actChaseBall', keeperClassOf(KS({ action: 'ChaseBall' })), 'actChaseBall');
fx('keeperClass.unclassifiedCANFire', keeperClassOf(KS({ action: 'ThrowOut' })), 'unclassified');
/* ⭐⭐⭐ THE RELEASE CLASSIFIER — every branch, each with a case where it does NOT fire */
const RS = (o: Partial<ReleaseState>): ReleaseState => ({
  subbed: false, restart: false, stillOwner: true, wouldStillHold: false,
  matchEnded: false, ...o,
});
fx('release.matchEndWinsEverything', releaseClassOf(RS({ matchEnded: true, subbed: true })),
  'matchEndUnreleased');
fx('release.substitutionBeatsRestart', releaseClassOf(RS({ subbed: true, restart: true })),
  'substitution');
fx('release.restartBeatsOwnershipLoss',
  releaseClassOf(RS({ restart: true, stillOwner: false })), 'restartPlacement');
fx('release.ownershipLoss', releaseClassOf(RS({ stillOwner: false })), 'ownershipLoss');
fx('release.arrivalIsOwnerPlusCarryPointInside', releaseClassOf(RS({})), 'arrival');
fx('release.freshGainIsOwnerPlusCarryPointOUTSIDE',
  releaseClassOf(RS({ wouldStillHold: true })), 'freshGain');
fx('release.arrivalDoesNOTFireWhenOwnershipChanged',
  releaseClassOf(RS({ stillOwner: false, wouldStillHold: false })) === 'arrival', false);
/* ⭐⭐ THE SAVE-FAMILY READER — the ENGINE'S OWN TEXT, each site and a negative */
fx('saveKind.catch', saveKindOf('Jo catches it'), 'catch');
fx('saveKind.parry', saveKindOf('Jo parries!'), 'parry');
fx('saveKind.highBallClaim', saveKindOf('Jo claims the high ball'), 'highBallClaim');
fx('saveKind.smother', saveKindOf("Jo smothers at Al's feet!"), 'smother');
fx('saveKind.otherSaveEventCANFire', saveKindOf('Jo does something else'), 'otherSaveEvent');
fx('saveKind.editingTheTextMovesTheClass', saveKindOf('Jo parries!'.replace('parries!',
  'catches it')), 'catch');
/* ⭐ THE SPRITE WINDOW IN TICKS IS DERIVED, NOT TYPED */
fx('sprite.windowSecondsExtractedFromTheAnchoredLine', SAVE_WINDOW_S, 0.7);
fx('sprite.fortyTwoTicksIsDerived', SPRITE_TICKS, 42);

/* ---- ⭐⭐⭐ THE THIRD FIXTURE CASE: A `resolveOverlaps`-TOUCHED STEP, TESTED AND DECLARED.
   Ruling #401 item 3(i) EXPECTS this NOT to fire ("the overlap resolver writes velocity, not
   position"). READ AT THIS HEAD, `resolveOverlaps` writes BOTH: the equal-bodies branch does
   `a.pos.x += px` / `b.pos.x -= px` (anchored) AND removes closing normal velocity (anchored).
   So the fixture is run on the SHIPPED engine and its RESULT IS PUBLISHED either way — no
   hiding. The scene: a scratch match (out-of-band seed) stepped into open play, then two
   outfield bodies of the two sides MOVED BY THIS PROBE onto the same spot, then ONE step. ---- */
const overlapFx = ((): {
  ran: boolean; pushedBodies: number; residualA: number; residualB: number;
  firesOnPushedBodies: boolean; minResidualOnThePitch: number;
  bodiesWithZeroResidual: number; note: string;
} => {
  const m = buildMatch(FIXTURE_SEED, 'E13-ABSENT');
  for (let i = 0; i < 400 && !m.finished; i++) m.step(DT);
  const ps = m.allPlayers.filter((p) => !p.sentOff && p.role !== 'GK');
  if (m.finished || ps.length < 2) {
    return {
      ran: false, pushedBodies: 0, residualA: Number.NaN, residualB: Number.NaN,
      firesOnPushedBodies: false, minResidualOnThePitch: Number.NaN,
      bodiesWithZeroResidual: 0, note: 'the scratch scene did not reach open play',
    };
  }
  const a = ps[0];
  const b = ps.find((p) => p.side !== a.side) ?? ps[1];
  b.pos = v2(a.pos.x + 0.05, a.pos.y);
  const all = m.allPlayers;
  const pre = all.map((p) => ({ x: p.pos.x, y: p.pos.y }));
  m.step(DT);
  const res = all.map((p, i) => residualOf(pre[i].x, pre[i].y, p.pos.x, p.pos.y,
    p.vel.x, p.vel.y));
  const rA = res[a.gid];
  const rB = res[b.gid];
  return {
    ran: true, pushedBodies: 2, residualA: rA, residualB: rB,
    firesOnPushedBodies: isResidualWritten(rA) && isResidualWritten(rB),
    minResidualOnThePitch: Math.min(...res),
    bodiesWithZeroResidual: res.filter((r) => !isResidualWritten(r)).length,
    note: '⭐⭐ DECLARED: `resolveOverlaps` writes POSITION as well as velocity at this head, so '
      + 'an overlap-pushed body DOES carry a residual. The exam therefore counts a PROXIMITY '
      + 'MARKER (`crowded` — another body inside `PLAYER_MIN_DIST` at the tick\'s start, GK-C0\'s '
      + 'own marker) beside every residual face, and never claims the residual predicate isolates '
      + 'teleports from overlap pushes.',
  };
})();
fx('residual.overlapPushedBodiesFIRE_declared', overlapFx.firesOnPushedBodies,
  overlapFx.firesOnPushedBodies);
fx('residual.overlapFixtureRan', overlapFx.ran, true);
fx('residual.andTheSameTickHasBodiesWithZERO_residual',
  overlapFx.bodiesWithZeroResidual > 0, true);

/* ========================================================================== */
/* §8 THE FROZEN BINS AND THE PER-SEED ROW                                     */
/* ========================================================================== */
const DISP_BIN_M = 0.02; const DISP_BINS = 51;         /* 0 … 1.0+ m per tick */
const RATIO_BIN = 0.25; const RATIO_BINS = 41;         /* |Δpos| ÷ (topSpeed·DT), 0 … 10+ */
const SAVEDIST_BIN_M = 0.5; const SAVEDIST_BINS = 17;  /* ball↔keeper at the save, 0 … 8+ m */
const GOALDIST_BIN_M = 1; const GOALDIST_BINS = 21;    /* ball→goal line at the save, 0 … 20+ */
const BALLSPEED_BIN = 2; const BALLSPEED_BINS = 21;    /* ball speed at the save, 0 … 40+ m/s */
const BALLJUMP_BIN_M = 0.25; const BALLJUMP_BINS = 25; /* ball's next-tick move, 0 … 6+ m */
const RESIDUAL_BIN_M = 0.05; const RESIDUAL_BINS = 41; /* keeper residual, 0 … 2+ m */
const WAIT_BIN = 10; const WAIT_BINS = 21;             /* wait length in ticks, 0 … 200+ */
const BODYC_BIN_M = 0.25; const BODYC_BINS = 21;       /* body↔contact at release, 0 … 5+ m */
const TTD_BIN = 20; const TTD_BINS = 26;               /* time to distribution, 0 … 500+ ticks */
const OWNDIST_BIN_M = 0.5; const OWNDIST_BINS = 17;    /* max ball↔owner while waiting, 0 … 8+ */

interface Row {
  ticks: number; wallMs: number;
  /* --- the world receipt --- */
  bqVersion: number; lnVersion: number; worldOk: boolean; lnAsDue: boolean;
  gkFlagAsDue: boolean; edsChoiceOn: boolean; seamsAbsent: boolean; genomeClean: boolean;
  /* --- POPULATION A: EVERY KEEPER TICK (GK-C0's counters + the RESIDUAL ones) --- */
  keeperTicks: number; keeperWritten: number; keeperWrittenOutsideRestarts: number;
  keeperClassTicks: number[]; keeperWrittenByClass: number[]; keeperMaxDispByClass: number[];
  keeperDispBinsSave: number[]; keeperDispBinsOutside: number[]; keeperRatioBins: number[];
  keeperSaveWindowTicks: number; keeperHoldTicks: number; keeperRestartTicks: number;
  keeperSubTicks: number; keeperActionTicks: number[]; keeperWrittenAction: number[];
  keeperWrittenCrowded: number; keeperWrittenNearHoldingOpp: number;
  keeperWrittenKickProtected: number;
  keeperDispSum: number; keeperMaxDisp: number; keeperCapSum: number;
  /* the RESIDUAL population (the exam's own predicate) */
  keeperResidual: number; keeperResidualOutsideRestarts: number;
  keeperResidualByClass: number[]; keeperResidualMaxByClass: number[];
  keeperResidualBins: number[]; keeperResidualSum: number; keeperResidualMax: number;
  keeperResidualCrowded: number;
  /* ⭐ THE SAVE-WINDOW POCKET (H-GK-2) — `saveAnimTimer > 0` WITHOUT the class precedence */
  keeperSaveWindowResidual: number; keeperSaveWindowResidualRestart: number;
  keeperSaveWindowResidualCrowded: number; keeperSaveWindowResidualByClass: number[];
  keeperSaveWindowOverCap: number; keeperSaveWindowOverCapRestart: number;
  /* --- POPULATION B: EVERY SAVE (GK-C0's counters) --- */
  saveEvents: number[]; ledgerSavedFlips: number; joinFlipWithEvent: number;
  joinFlipWithoutEvent: number; joinEventWithoutFlip: number;
  saveDistSum: number; saveDistBins: number[]; catchDistBins: number[];
  reachSum: number; reachStretchSum: number; saveWithinReach: number;
  saveWithinStretch: number; saveBeyondStretch: number;
  catchGt1: number; catchGt2: number; catchGt3: number;
  goalDistBins: number[]; ballSpeedBins: number[];
  catchNext: number; catchJumps: number; catchNextDispSum: number; catchJumpBins: number[];
  parryNext: number; parryJumps: number; parryNextDispSum: number; parryJumpBins: number[];
  claimNext: number; claimJumps: number; claimNextDispSum: number; claimJumpBins: number[];
  smotherNext: number; smotherJumps: number;
  /* --- POPULATION D: THE OWNED-CAUGHT EPISODE (R1 and the seam's faces) --- */
  episodes: number; episodeTicks: number;
  epMaxBins: number[]; epMaxOverThreshold: number; epMaxSum: number; epMaxMax: number;
  releaseClassCount: number[];
  waitTicksSum: number; waitTicksMax: number; waitBins: number[]; waitsOverSprite: number;
  waitsCounted: number;
  bodyContactSum: number; bodyContactBins: number[]; bodyInsideCarry: number;
  releasesCounted: number;
  ownDistBins: number[]; ownDistMaxSum: number; ownDistMax: number; ownDistCounted: number;
  gkFeetCatches: number; gkFeetLostWithin10: number; gkFeetReconAgrees: number;
  gkFeetReconCatches: number;
  parryContacts: number; parryContactSpriteClears: number; parryContactOtherClears: number;
  /* --- G8: TIME TO DISTRIBUTION --- */
  ttdCount: number; ttdSum: number; ttdMax: number; ttdBins: number[]; ttdUnresolved: number;
  /* --- GUARD CONTEXT (the engine's own stats and ledgers) --- */
  goals: number; shots: number; savesStat: number; xgSum: number; shotLogRows: number;
  passes: number; passesCompleted: number; interceptions: number; offsides: number;
  keeperHolds: number; keeperPasses: number;
}
const emptyRow = (): Row => ({
  ticks: 0, wallMs: 0,
  bqVersion: 0, lnVersion: 0, worldOk: false, lnAsDue: false,
  gkFlagAsDue: false, edsChoiceOn: false, seamsAbsent: false, genomeClean: false,
  keeperTicks: 0, keeperWritten: 0, keeperWrittenOutsideRestarts: 0,
  keeperClassTicks: zeros(KEEPER_CLASSES.length),
  keeperWrittenByClass: zeros(KEEPER_CLASSES.length),
  keeperMaxDispByClass: zeros(KEEPER_CLASSES.length),
  keeperDispBinsSave: zeros(DISP_BINS), keeperDispBinsOutside: zeros(DISP_BINS),
  keeperRatioBins: zeros(RATIO_BINS),
  keeperSaveWindowTicks: 0, keeperHoldTicks: 0, keeperRestartTicks: 0, keeperSubTicks: 0,
  keeperActionTicks: zeros(ACTION_CELLS.length), keeperWrittenAction: zeros(ACTION_CELLS.length),
  keeperWrittenCrowded: 0, keeperWrittenNearHoldingOpp: 0, keeperWrittenKickProtected: 0,
  keeperDispSum: 0, keeperMaxDisp: 0, keeperCapSum: 0,
  keeperResidual: 0, keeperResidualOutsideRestarts: 0,
  keeperResidualByClass: zeros(KEEPER_CLASSES.length),
  keeperResidualMaxByClass: zeros(KEEPER_CLASSES.length),
  keeperResidualBins: zeros(RESIDUAL_BINS), keeperResidualSum: 0, keeperResidualMax: 0,
  keeperResidualCrowded: 0,
  keeperSaveWindowResidual: 0, keeperSaveWindowResidualRestart: 0,
  keeperSaveWindowResidualCrowded: 0,
  keeperSaveWindowResidualByClass: zeros(KEEPER_CLASSES.length),
  keeperSaveWindowOverCap: 0, keeperSaveWindowOverCapRestart: 0,
  saveEvents: zeros(SAVE_KINDS.length), ledgerSavedFlips: 0, joinFlipWithEvent: 0,
  joinFlipWithoutEvent: 0, joinEventWithoutFlip: 0,
  saveDistSum: 0, saveDistBins: zeros(SAVEDIST_BINS), catchDistBins: zeros(SAVEDIST_BINS),
  reachSum: 0, reachStretchSum: 0, saveWithinReach: 0,
  saveWithinStretch: 0, saveBeyondStretch: 0,
  catchGt1: 0, catchGt2: 0, catchGt3: 0,
  goalDistBins: zeros(GOALDIST_BINS), ballSpeedBins: zeros(BALLSPEED_BINS),
  catchNext: 0, catchJumps: 0, catchNextDispSum: 0, catchJumpBins: zeros(BALLJUMP_BINS),
  parryNext: 0, parryJumps: 0, parryNextDispSum: 0, parryJumpBins: zeros(BALLJUMP_BINS),
  claimNext: 0, claimJumps: 0, claimNextDispSum: 0, claimJumpBins: zeros(BALLJUMP_BINS),
  smotherNext: 0, smotherJumps: 0,
  episodes: 0, episodeTicks: 0,
  epMaxBins: zeros(R1_BINS), epMaxOverThreshold: 0, epMaxSum: 0, epMaxMax: 0,
  releaseClassCount: zeros(RELEASE_CLASSES.length),
  waitTicksSum: 0, waitTicksMax: 0, waitBins: zeros(WAIT_BINS), waitsOverSprite: 0,
  waitsCounted: 0,
  bodyContactSum: 0, bodyContactBins: zeros(BODYC_BINS), bodyInsideCarry: 0,
  releasesCounted: 0,
  ownDistBins: zeros(OWNDIST_BINS), ownDistMaxSum: 0, ownDistMax: 0, ownDistCounted: 0,
  gkFeetCatches: 0, gkFeetLostWithin10: 0, gkFeetReconAgrees: 0, gkFeetReconCatches: 0,
  parryContacts: 0, parryContactSpriteClears: 0, parryContactOtherClears: 0,
  ttdCount: 0, ttdSum: 0, ttdMax: 0, ttdBins: zeros(TTD_BINS), ttdUnresolved: 0,
  goals: 0, shots: 0, savesStat: 0, xgSum: 0, shotLogRows: 0,
  passes: 0, passesCompleted: 0, interceptions: 0, offsides: 0,
  keeperHolds: 0, keeperPasses: 0,
});

/* ========================================================================== */
/* §9 THE WALK — public state read BEFORE and AFTER `match.step(DT)`; NO WRAPPER */
/* ========================================================================== */
const signatureOf = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((pp) => ({
    gid: pp.gid, pos: pp.pos, vel: pp.vel, heading: pp.heading, stamina: pp.stamina,
  })),
}));
interface PendingSave { kind: SaveKind; gkGid: number }
interface Episode {
  gkGid: number; startTick: number; maxDisp: number; ticks: number;
  waitTicks: number; released: boolean; closed: boolean;
  contactX: number; contactY: number; hadContact: boolean;
  maxOwnDist: number; ownDistSeen: boolean;
  releaseClass: ReleaseClass | null; bodyContact: number;
}
type MutMatch = Match & {
  bqCushion?: boolean; lnOwnLanePrice?: boolean; edsPerceivedChoice?: boolean;
  obmMovement?: boolean; ctbSupportPlane?: boolean; rcAnticipate?: boolean;
  rcReady?: boolean; bfFacingCost?: boolean; restartKickGid: number | null;
  gkDiveBody: boolean;
};

const walkMatch = (m: Match, arm: Arm, observe: boolean): Row => {
  const tStart = Date.now();
  const row = emptyRow();
  const comp = COMP_OF(arm);
  const armed = IS_ARMED(arm);
  const mm = m as unknown as MutMatch;
  row.bqVersion = bqArmedVersion(m);
  row.lnVersion = lnArmedVersion(m);
  row.worldOk = row.bqVersion === BQ_WORLD_VERSION && mm.bqCushion === true;
  row.lnAsDue = comp === 'E14'
    ? (mm.lnOwnLanePrice === true && row.lnVersion === LN_WORLD_VERSION)
    : (mm.lnOwnLanePrice !== true && row.lnVersion !== LN_WORLD_VERSION);
  row.gkFlagAsDue = mm.gkDiveBody === armed;
  row.edsChoiceOn = mm.edsPerceivedChoice === true;
  row.seamsAbsent = mm.obmMovement !== true && mm.ctbSupportPlane !== true
    && mm.rcAnticipate !== true && mm.rcReady !== true && mm.bfFacingCost !== true;
  row.genomeClean = ([0, 1] as const).every((s) => {
    const g = m.teams[s].info.genome as unknown as Record<string, unknown>;
    return g.lnOwnLaneWeight === undefined && g.rcReadyWeight === undefined
      && g.obmSupportWeight === undefined && g.ctbSupportDepth === undefined;
  });
  const players = m.allPlayers;
  const n = players.length;
  const keepers = [m.teams[0].goalkeeper, m.teams[1].goalkeeper];
  const px = zeros(n); const py = zeros(n); const ptop = zeros(n); const prost = zeros(n);
  const crowded = new Array<boolean>(n).fill(false);
  const nearHold = new Array<boolean>(n).fill(false);
  const holdPrev = new Map<number, number>();
  /** pre-step contact state per keeper gid: 0 none · 1 caught · 2 parry (steer-only). */
  const scPrev = new Map<number, number>();
  let bx = m.ball.pos.x; let by = m.ball.pos.y;
  let evLen = m.events.length;
  let logLen = 0;
  const seenOutcome: string[] = [];
  let pending: PendingSave | null = null;
  let lastPassKey: string | null = null;
  const episodes: Episode[] = [];
  const feetWatch: { gkGid: number; ticksLeft: number; lost: boolean }[] = [];
  const ttdWatch = new Map<number, number>();

  while (!m.finished) {
    if (!observe) { m.step(DT); row.ticks += 1; continue; }
    /* ---------- BEFORE THE STEP ---------- */
    for (let i = 0; i < n; i++) {
      const p = players[i];
      px[i] = p.pos.x; py[i] = p.pos.y; ptop[i] = p.topSpeed; prost[i] = p.rosterIdx;
    }
    for (const gk of keepers) {
      const i = gk.gid;
      let near2 = false;
      for (let j = 0; j < n; j++) {
        if (j === i || players[j].sentOff) continue;
        if (Math.hypot(px[i] - px[j], py[i] - py[j]) < PLAYER_MIN_DIST) { near2 = true; break; }
      }
      crowded[i] = near2;
      const oppGk = m.teams[1 - (gk.side as Side)].goalkeeper;
      nearHold[i] = (oppGk.gkHoldTimer > 0 || oppGk.gkDistributing)
        && Math.hypot(px[i] - oppGk.pos.x, py[i] - oppGk.pos.y) < GK_HOLD_CLEARANCE;
      if (!holdPrev.has(i)) holdPrev.set(i, gk.gkHoldTimer);
      const sc0 = gk.saveContact;
      scPrev.set(i, sc0 === null ? 0 : sc0.caught ? 1 : 2);
    }
    bx = m.ball.pos.x; by = m.ball.pos.y;
    evLen = m.events.length;
    logLen = m.shotLog.length;
    for (let j = 0; j < logLen; j++) seenOutcome[j] = m.shotLog[j].outcome;
    const phaseBefore = m.phase;
    const ownerBefore = m.ball.owner;
    const passBefore = m.pendingPass;
    /** the engine's OWN `backPass` limb, evaluated on the PRE-STEP `pendingPass` (the closest
     *  reading of the value `giveBall` sees inside the step) — DECLARED as a reconstruction. */
    const backPassOf = (side: Side, gid: number): boolean => passBefore !== null
      && passBefore.side === side && passBefore.passerGid !== gid;
    const topOfPending = pending === null ? 0 : ptop[pending.gkGid];

    m.step(DT);
    row.ticks += 1;
    const tick = m.simTick;

    /* ---------- AFTER THE STEP ---------- */
    const phaseAfter = m.phase;
    /* ⭐⭐ THE ENGINE'S OWN RESTART STATE — GK-C0's predicate, unchanged. */
    const restartTick = phaseAfter !== 'playing' || phaseBefore !== phaseAfter;
    const kickProtected = mm.restartKickGid !== null;
    const restartPlacementState = restartTick || kickProtected;

    /* --- POPULATION A: the two keepers --- */
    for (const gk of keepers) {
      if (gk.sentOff) continue;
      const i = gk.gid;
      const disp = Math.hypot(gk.pos.x - px[i], gk.pos.y - py[i]);
      const cap = ptop[i] * DT;
      const resid = residualOf(px[i], py[i], gk.pos.x, gk.pos.y, gk.vel.x, gk.vel.y);
      const over = isOverCap(disp, ptop[i]);
      const written = isResidualWritten(resid);
      const subbed = gk.rosterIdx !== prost[i];
      const saveWin = gk.saveAnimTimer > 0;
      const hold = gk.gkHoldTimer > 0 || gk.gkDistributing;
      const kc = keeperClassOf({
        subbed, restart: restartTick, saveWindow: saveWin, hold,
        action: gk.action.type as string,
      });
      row.keeperTicks += 1;
      row.keeperDispSum += disp;
      row.keeperCapSum += cap;
      row.keeperMaxDisp = Math.max(row.keeperMaxDisp, disp);
      row.keeperResidualSum += resid;
      row.keeperResidualMax = Math.max(row.keeperResidualMax, resid);
      row.keeperResidualBins[binOf(resid, RESIDUAL_BIN_M, RESIDUAL_BINS)] += 1;
      row.keeperClassTicks[KCI(kc)] += 1;
      row.keeperActionTicks[AI(gk.action.type as string)] += 1;
      if (saveWin) row.keeperSaveWindowTicks += 1;
      if (hold) row.keeperHoldTicks += 1;
      if (restartTick) row.keeperRestartTicks += 1;
      if (subbed) row.keeperSubTicks += 1;
      (saveWin ? row.keeperDispBinsSave : row.keeperDispBinsOutside)[
        binOf(disp, DISP_BIN_M, DISP_BINS)] += 1;
      row.keeperRatioBins[binOf(cap > 0 ? disp / cap : 0, RATIO_BIN, RATIO_BINS)] += 1;
      if (over) {
        row.keeperWritten += 1;
        row.keeperWrittenByClass[KCI(kc)] += 1;
        row.keeperWrittenAction[AI(gk.action.type as string)] += 1;
        row.keeperMaxDispByClass[KCI(kc)] = Math.max(row.keeperMaxDispByClass[KCI(kc)], disp);
        if (!(RESTART_FAMILY as readonly string[]).includes(kc)) {
          row.keeperWrittenOutsideRestarts += 1;
        }
        if (crowded[i]) row.keeperWrittenCrowded += 1;
        if (nearHold[i]) row.keeperWrittenNearHoldingOpp += 1;
        if (kickProtected) row.keeperWrittenKickProtected += 1;
        if (saveWin) {
          row.keeperSaveWindowOverCap += 1;
          if (restartPlacementState) row.keeperSaveWindowOverCapRestart += 1;
        }
      }
      if (written) {
        row.keeperResidual += 1;
        row.keeperResidualByClass[KCI(kc)] += 1;
        row.keeperResidualMaxByClass[KCI(kc)] =
          Math.max(row.keeperResidualMaxByClass[KCI(kc)], resid);
        if (!(RESTART_FAMILY as readonly string[]).includes(kc)) {
          row.keeperResidualOutsideRestarts += 1;
        }
        if (crowded[i]) row.keeperResidualCrowded += 1;
        if (saveWin) {
          row.keeperSaveWindowResidual += 1;
          if (restartPlacementState) row.keeperSaveWindowResidualRestart += 1;
          if (crowded[i]) row.keeperSaveWindowResidualCrowded += 1;
          row.keeperSaveWindowResidualByClass[KCI(kc)] += 1;
        }
      }
      /* ⭐ THE PARRY CONTACT'S OWN CLEAR — the sprite's window (`Player.physicsStep`'s guarded
         line, anchored) is the ONLY clear a steer-only contact has. Counted, with the
         alternative counted BESIDE so the claim is never a universal by construction. */
      if ((scPrev.get(i) ?? 0) === 2 && gk.saveContact === null) {
        if (gk.saveAnimTimer === 0) row.parryContactSpriteClears += 1;
        else row.parryContactOtherClears += 1;
      }
      /* G9 — a HOLD begins: the engine's own `gkHoldTimer` rising from 0 */
      const hp = holdPrev.get(i) ?? 0;
      if (hp === 0 && gk.gkHoldTimer > 0) row.keeperHolds += 1;
      holdPrev.set(i, gk.gkHoldTimer);
    }

    /* --- THE BALL'S OWN MOVE THIS TICK --- */
    const bd = Math.hypot(m.ball.pos.x - bx, m.ball.pos.y - by);
    const owner = m.ball.owner;

    /* --- GK-C0's next-tick-after-a-save face (the carry snap), unchanged --- */
    if (pending !== null) {
      const jumped = ballJumped(bd, topOfPending);
      if (pending.kind === 'catch') {
        row.catchNext += 1; row.catchNextDispSum += bd;
        row.catchJumpBins[binOf(bd, BALLJUMP_BIN_M, BALLJUMP_BINS)] += 1;
        if (jumped) row.catchJumps += 1;
      } else if (pending.kind === 'parry') {
        row.parryNext += 1; row.parryNextDispSum += bd;
        row.parryJumpBins[binOf(bd, BALLJUMP_BIN_M, BALLJUMP_BINS)] += 1;
        if (jumped) row.parryJumps += 1;
      } else if (pending.kind === 'highBallClaim') {
        row.claimNext += 1; row.claimNextDispSum += bd;
        row.claimJumpBins[binOf(bd, BALLJUMP_BIN_M, BALLJUMP_BINS)] += 1;
        if (jumped) row.claimJumps += 1;
      } else if (pending.kind === 'smother') {
        row.smotherNext += 1; if (jumped) row.smotherJumps += 1;
      }
      pending = null;
    }

    /* --- POPULATION D: THE OWNED-CAUGHT EPISODES (R1's own population) --- */
    for (const ep of episodes) {
      if (ep.closed || ep.startTick === tick) continue;
      const gk = players[ep.gkGid];
      ep.maxDisp = Math.max(ep.maxDisp, bd);
      ep.ticks += 1;
      if (ep.released) { ep.closed = true; continue; }
      /* ⛔ ABSENT (and an ARMED catch that never took a contact) has NO contact and NO release:
         the episode is the CATCH TICK AND THE TICK AFTER, exactly as ruling #401 item 3(ii)
         defines it, and NO release class is recorded. */
      if (!armed || !ep.hadContact) { ep.closed = true; continue; }
      const sc = gk.saveContact;
      const held = sc !== null && sc.caught && owner !== null && owner.gid === ep.gkGid;
      if (held) {
        ep.waitTicks += 1;
        ep.contactX = sc.x; ep.contactY = sc.y; ep.hadContact = true;
        const od = Math.hypot(m.ball.pos.x - gk.pos.x, m.ball.pos.y - gk.pos.y);
        ep.maxOwnDist = Math.max(ep.maxOwnDist, od);
        ep.ownDistSeen = true;
        continue;
      }
      /* THE RELEASE TICK */
      ep.released = true;
      const stillOwner = owner !== null && owner.gid === ep.gkGid;
      const wouldStillHold = ep.hadContact && heldAtHandsRecon(
        gk.pos.x, gk.pos.y, gk.heading.x, gk.heading.y, CARRY_GK, ep.contactX, ep.contactY,
      );
      ep.releaseClass = releaseClassOf({
        subbed: gk.rosterIdx !== prost[ep.gkGid], restart: restartTick,
        stillOwner, wouldStillHold, matchEnded: false,
      });
      ep.bodyContact = ep.hadContact
        ? Math.hypot(gk.pos.x - ep.contactX, gk.pos.y - ep.contactY) : Number.NaN;
    }

    /* --- THE `gkFeet` EXPOSURE WATCH (BOTH arms) --- */
    for (const w of feetWatch) {
      if (w.ticksLeft <= 0 || w.lost) continue;
      w.ticksLeft -= 1;
      if (owner === null || owner.gid !== w.gkGid) { w.lost = true; row.gkFeetLostWithin10 += 1; }
    }

    /* --- G8: THE RELEASE KICK (the engine's own `lastTouch` + the loss of ownership) --- */
    if (ownerBefore !== null && (owner === null || owner.gid !== ownerBefore.gid)) {
      const t0 = ttdWatch.get(ownerBefore.gid);
      if (t0 !== undefined) {
        const struck = m.ball.lastTouch !== null && m.ball.lastTouch.gid === ownerBefore.gid
          && Math.hypot(m.ball.vel.x, m.ball.vel.y) > 0;
        if (struck) {
          const dt2 = tick - t0;
          row.ttdCount += 1; row.ttdSum += dt2; row.ttdMax = Math.max(row.ttdMax, dt2);
          row.ttdBins[binOf(dt2, TTD_BIN, TTD_BINS)] += 1;
        }
        ttdWatch.delete(ownerBefore.gid);
      }
    }

    /* --- G10: THE KEEPER'S PASSES — `pendingPass`, the engine's own record --- */
    const pp = m.pendingPass;
    const passKey = pp === null ? null : `${pp.passerGid}:${pp.t}`;
    if (passKey !== null && passKey !== lastPassKey) {
      if (players[pp!.passerGid].role === 'GK') row.keeperPasses += 1;
    }
    lastPassKey = passKey;

    /* --- THE SAVE, JOINED TO THE ENGINE'S TWO LEDGERS --- */
    let flips = 0;
    for (let j = 0; j < m.shotLog.length; j++) {
      const before = j < logLen ? seenOutcome[j] : 'pending';
      if (before === 'pending' && m.shotLog[j].outcome === 'saved') flips += 1;
    }
    row.ledgerSavedFlips += flips;
    let saveEventsHere = 0;
    for (let e = evLen; e < m.events.length; e++) {
      const ev = m.events[e];
      if (ev.type !== 'save') continue;
      saveEventsHere += 1;
      const kind = saveKindOf(ev.text);
      row.saveEvents[SKI(kind)] += 1;
      const side = (ev.side === -1 ? 0 : ev.side) as Side;
      const gk = m.teams[side].goalkeeper;
      const d = Math.hypot(gk.pos.x - m.ball.pos.x, gk.pos.y - m.ball.pos.y);
      const reach = keeperReachRecon(
        m.teams[side].genome.keeperAggression, gk.attrs.reflexes,
        (gk.traits as readonly string[]).includes('cat'),
      );
      row.saveDistSum += d;
      row.saveDistBins[binOf(d, SAVEDIST_BIN_M, SAVEDIST_BINS)] += 1;
      row.reachSum += reach;
      row.reachStretchSum += reach * SAVE_STRETCH_RECON;
      if (d <= reach) row.saveWithinReach += 1;
      else if (d <= reach * SAVE_STRETCH_RECON) row.saveWithinStretch += 1;
      else row.saveBeyondStretch += 1;
      row.goalDistBins[binOf(Math.max(0, HALF_L - Math.abs(m.ball.pos.x)),
        GOALDIST_BIN_M, GOALDIST_BINS)] += 1;
      row.ballSpeedBins[binOf(Math.hypot(m.ball.vel.x, m.ball.vel.y),
        BALLSPEED_BIN, BALLSPEED_BINS)] += 1;
      if (kind === 'catch') {
        row.catchDistBins[binOf(d, SAVEDIST_BIN_M, SAVEDIST_BINS)] += 1;
        if (d > 1) row.catchGt1 += 1;
        if (d > 2) row.catchGt2 += 1;
        if (d > 3) row.catchGt3 += 1;
        /* ⭐ THE EPISODE OPENS ON THE CATCH TICK */
        const sc = gk.saveContact;
        episodes.push({
          gkGid: gk.gid, startTick: tick, maxDisp: bd, ticks: 1,
          waitTicks: 0, released: false, closed: false,
          contactX: sc === null ? m.ball.pos.x : sc.x,
          contactY: sc === null ? m.ball.pos.y : sc.y,
          hadContact: sc !== null && sc.caught,
          maxOwnDist: Math.hypot(m.ball.pos.x - gk.pos.x, m.ball.pos.y - gk.pos.y),
          ownDistSeen: sc !== null && sc.caught,
          releaseClass: null, bodyContact: Number.NaN,
        });
        /* ⭐⭐ `gkFeet` — THE ENGINE'S OWN CONSEQUENCE first (the action `giveBall` set on that
           branch is the only way a KEEPER leaves `giveBall` with `Dribble`), the geometric
           RECONSTRUCTION beside, and their AGREEMENT counted. */
        const feetEngine = (gk.action.type as string) === 'Dribble';
        const feetRecon = mm.restartKickGid !== gk.gid
          && (backPassOf(gk.side, gk.gid) || !m.inPenaltyBox(gk.pos, gk.side));
        if (feetEngine) {
          row.gkFeetCatches += 1;
          feetWatch.push({ gkGid: gk.gid, ticksLeft: 10, lost: false });
        }
        if (feetRecon) row.gkFeetReconCatches += 1;
        if (feetEngine === feetRecon) row.gkFeetReconAgrees += 1;
        ttdWatch.set(gk.gid, tick);
      }
      if (kind === 'parry' && gk.saveContact !== null && !gk.saveContact.caught) {
        row.parryContacts += 1;
      }
      pending = { kind, gkGid: gk.gid };
    }
    if (flips > 0 && saveEventsHere > 0) row.joinFlipWithEvent += Math.min(flips, saveEventsHere);
    if (flips > saveEventsHere) row.joinFlipWithoutEvent += flips - saveEventsHere;
    if (saveEventsHere > flips) row.joinEventWithoutFlip += saveEventsHere - flips;
  }

  if (observe) {
    /* ---- CLOSE THE EPISODES AND FOLD THEM INTO THE ROW ---- */
    for (const ep of episodes) {
      if (!ep.released) {
        ep.releaseClass = armed && ep.hadContact ? 'matchEndUnreleased' : null;
      }
      row.episodes += 1;
      row.episodeTicks += ep.ticks;
      row.epMaxSum += ep.maxDisp;
      row.epMaxMax = Math.max(row.epMaxMax, ep.maxDisp);
      row.epMaxBins[edgeBinOf(ep.maxDisp)] += 1;
      if (edgeBinOf(ep.maxDisp) >= R1_THRESHOLD_INDEX) row.epMaxOverThreshold += 1;
      if (ep.releaseClass !== null) {
        row.releaseClassCount[RLI(ep.releaseClass)] += 1;
        if (ep.releaseClass !== 'matchEndUnreleased') {
          row.waitsCounted += 1;
          row.waitTicksSum += ep.waitTicks;
          row.waitTicksMax = Math.max(row.waitTicksMax, ep.waitTicks);
          row.waitBins[binOf(ep.waitTicks, WAIT_BIN, WAIT_BINS)] += 1;
          if (ep.waitTicks > SPRITE_TICKS) row.waitsOverSprite += 1;
          if (Number.isFinite(ep.bodyContact)) {
            row.releasesCounted += 1;
            row.bodyContactSum += ep.bodyContact;
            row.bodyContactBins[binOf(ep.bodyContact, BODYC_BIN_M, BODYC_BINS)] += 1;
            if (ep.bodyContact <= CARRY_GK) row.bodyInsideCarry += 1;
          }
        }
      }
      if (ep.ownDistSeen) {
        row.ownDistCounted += 1;
        row.ownDistMaxSum += ep.maxOwnDist;
        row.ownDistMax = Math.max(row.ownDistMax, ep.maxOwnDist);
        row.ownDistBins[binOf(ep.maxOwnDist, OWNDIST_BIN_M, OWNDIST_BINS)] += 1;
      }
    }
    row.ttdUnresolved = ttdWatch.size;
    row.shotLogRows = m.shotLog.length;
    row.xgSum = m.shotLog.reduce((a, e) => a + e.xg, 0);
  }
  const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<string, number>[];
  row.goals = st[0].goals + st[1].goals;
  row.shots = st[0].shots + st[1].shots;
  row.savesStat = st[0].saves + st[1].saves;
  row.passes = st[0].passes + st[1].passes;
  row.passesCompleted = st[0].passesCompleted + st[1].passesCompleted;
  row.interceptions = st[0].interceptions + st[1].interceptions;
  row.offsides = st[0].offsides + st[1].offsides;
  row.wallMs = Date.now() - tStart;
  return row;
};

/* ========================================================================== */
/* §10 THE CODE FACTS — the EXTRACTED call graph (canon: "the callee list is EXTRACTED from
   the hashed text — every identifier called within the span, resolved to its definition and
   hashed — never typed"). GK-C0's extractor, unchanged.                                     */
/* ========================================================================== */
const listTs = (dir: string): string[] => readdirSync(dir, { withFileTypes: true })
  .flatMap((d) => (d.isDirectory() ? listTs(`${dir}/${d.name}`)
    : d.name.endsWith('.ts') ? [`${dir}/${d.name}`] : []));
const SRC_ROOT_DIRS = ['src'];
const ALL_SRC_FILES = SRC_ROOT_DIRS.flatMap(listTs).sort();
const GRAPH_DIRS = ['src/sim', 'src/ai'];
const GRAPH_FILES = GRAPH_DIRS.flatMap(listTs).sort();
const GRAPH_SRC: Record<string, string[]> = {};
for (const f of GRAPH_FILES) GRAPH_SRC[f] = readFileSync(f, 'utf8').split('\n');
const KEYWORDS = new Set(['if', 'for', 'while', 'switch', 'catch', 'do', 'else', 'try',
  'return', 'case', 'typeof', 'new', 'function', 'await', 'of', 'in', 'delete', 'void',
  'yield', 'super', 'constructor']);
interface Span {
  file: string; name: string; start: number; end: number; text: string; sha: string;
}
const SPANS: Span[] = [];
const HEAD_RE = /^(\s*)(?:(?:export|private|public|protected|static|async|readonly|declare)\s+)*(?:function\s+)?(?:(?:const|let|var)\s+)?(?:(get|set)\s+)?([A-Za-z_$][\w$]*)/;
const FN_DECL = /^\s*(?:export\s+)?(?:async\s+)?function\s*\*?\s*[A-Za-z_$][\w$]*\s*(?:<[^>]*>)?\s*\(/;
const METHOD_DECL = /^\s*(?:(?:private|public|protected|static|async|readonly|get|set)\s+)*[A-Za-z_$][\w$]*\s*(?:<[^>]*>)?\s*\([^)]*\)\s*(?::\s*[^;{]+)?\s*\{\s*$/;
const ARROW_DECL = /^\s*(?:export\s+)?(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*(?::[^=]+)?=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*(?::\s*[^=]+)?=>\s*\{\s*$/;
const MULTI_OPEN_M = /^\s*(?:(?:private|public|protected|static|async|readonly|get|set)\s+)*[A-Za-z_$][\w$]*\s*(?:<[^>]*>)?\s*\(\s*$/;
const MULTI_OPEN_A = /^\s*(?:export\s+)?(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*(?::[^=]+)?=\s*(?:async\s*)?\(\s*$/;
const MULTI_CLOSE = /^(\s*)\)[^;{]*\{\s*$/;
const isFnHead = (L: string, multi: boolean): boolean => (multi
  ? FN_DECL.test(L) || MULTI_OPEN_M.test(L) || MULTI_OPEN_A.test(L)
  : FN_DECL.test(L) || METHOD_DECL.test(L) || ARROW_DECL.test(L));
for (const f of GRAPH_FILES) {
  const lines = GRAPH_SRC[f];
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i];
    if (!L.endsWith('{')) continue;
    let headLine = i;
    let headText = L;
    const mMulti = MULTI_CLOSE.exec(L);
    if (mMulti !== null) {
      const ind = mMulti[1];
      let k = i - 1;
      while (k >= 0 && !(lines[k].startsWith(ind) && lines[k].trim().length > 0
        && lines[k].indexOf('(') >= 0 && !lines[k].endsWith('{')
        && lines[k].length - lines[k].trimStart().length === ind.length)) k -= 1;
      if (k < 0) continue;
      headLine = k; headText = lines[k];
    }
    if (headText.indexOf('(') < 0) continue;
    const t = headText.trim();
    if (t.startsWith('//') || t.startsWith('*') || t.startsWith('}')) continue;
    if (!isFnHead(headText, mMulti !== null)) continue;
    const mHead = HEAD_RE.exec(headText);
    if (mHead === null) continue;
    const name = mHead[3];
    if (KEYWORDS.has(name)) continue;
    const indent = mHead[1];
    const close = `${indent}}`;
    let end = -1;
    for (let j = i + 1; j < lines.length; j++) {
      const c = lines[j];
      if (c === close || c === `${close};` || c === `${close});`) { end = j; break; }
    }
    if (end < 0) continue;
    const text = lines.slice(headLine, end + 1).join('\n');
    SPANS.push({ file: f, name, start: headLine + 1, end: end + 1, text, sha: sha(text) });
  }
}
const spansByName = new Map<string, Span[]>();
for (const s of SPANS) {
  const arr = spansByName.get(s.name) ?? [];
  arr.push(s); spansByName.set(s.name, arr);
}
const spanKey = (s: Span): string => `${s.file}:${s.start}-${s.end}:${s.name}`;
const enclosingOf = (file: string, line: number): Span | null => {
  let best: Span | null = null;
  for (const s of SPANS) {
    if (s.file !== file || s.start > line || s.end < line) continue;
    if (best === null || s.start > best.start) best = s;
  }
  return best;
};
const CALL_RE = /([A-Za-z_$][\w$]*)\s*\(/g;
const calleesOf = (s: Span): { resolved: Span[]; external: string[] } => {
  const seen = new Set<string>();
  const resolved: Span[] = [];
  const external: string[] = [];
  let mm2: RegExpExecArray | null = null;
  CALL_RE.lastIndex = 0;
  while ((mm2 = CALL_RE.exec(s.text)) !== null) {
    const nm = mm2[1];
    if (KEYWORDS.has(nm) || seen.has(nm)) continue;
    seen.add(nm);
    const hits = spansByName.get(nm);
    if (hits === undefined) { external.push(nm); continue; }
    for (const h of hits) if (h !== s) resolved.push(h);
  }
  return { resolved, external };
};
const CLOSURE_NODE_CAP = 600;
const closureOf = (roots: readonly Span[]): {
  nodes: Span[]; externals: string[]; depth: number; capped: boolean;
} => {
  const seen = new Map<string, Span>();
  const externals = new Set<string>();
  let frontier = [...roots];
  for (const r of roots) seen.set(spanKey(r), r);
  let depth = 0;
  let capped = false;
  while (frontier.length > 0 && depth < 12) {
    const next: Span[] = [];
    for (const nd of frontier) {
      const { resolved, external } = calleesOf(nd);
      for (const e of external) externals.add(e);
      for (const c of resolved) {
        const k = spanKey(c);
        if (seen.has(k)) continue;
        if (seen.size >= CLOSURE_NODE_CAP) { capped = true; continue; }
        seen.set(k, c); next.push(c);
      }
    }
    if (next.length === 0) break;
    frontier = next; depth += 1;
  }
  return { nodes: [...seen.values()], externals: [...externals].sort(), depth, capped };
};
/** ⭐⭐ THE SEAM'S OWN OCCURRENCE CENSUS — every `saveContact` and every `gkDiveBody` under
 *  `src/**`, ENUMERATED with its site and its enclosing span; the COUNTS are gated. */
interface Occ { file: string; line: number; text: string; fn: string | null; span: string | null }
const needleCensus = (needle: string): Occ[] => {
  const out: Occ[] = [];
  for (const f of ALL_SRC_FILES) {
    const lines = readFileSync(f, 'utf8').split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].includes(needle)) continue;
      const enc = GRAPH_FILES.includes(f) ? enclosingOf(f, i + 1) : null;
      out.push({
        file: f, line: i + 1, text: lines[i].trim(),
        fn: enc === null ? null : enc.name, span: enc === null ? null : spanKey(enc),
      });
    }
  }
  return out;
};
const SAVECONTACT_OCC = needleCensus('saveContact');
const GKDIVEBODY_OCC = needleCensus('gkDiveBody');
/** a `saveContact` ASSIGNMENT (the write/clear sites), separated from the reads and comments. */
const isComment = (t: string): boolean => t.startsWith('//') || t.startsWith('*')
  || t.startsWith('/*');
const SAVECONTACT_ASSIGNS = SAVECONTACT_OCC.filter(
  (o) => !isComment(o.text) && /saveContact\s*=[^=]/.test(o.text),
);
const SAVECONTACT_READS = SAVECONTACT_OCC.filter(
  (o) => !isComment(o.text) && !/saveContact\s*=[^=]/.test(o.text),
);
/** ⭐⭐⭐ `absentArmIsShippedPath` — WITH THE FLAG ABSENT NO `saveContact` WRITE IS REACHABLE.
 *  DERIVED FROM THE ENUMERATED SITES' OWN TEXT, not asserted: every assignment line under
 *  `src/**` either (a) carries the flag `match.gkDiveBody` in its own guard — the TWO writes —
 *  or (b) carries a `saveContact !== null` guard on the SAME line or on the line that opens its
 *  block — the CLEARS. The field's initialiser is `null`, so with the flag absent (a) never
 *  runs, the field is null for the whole match, and every (b) short-circuits. */
type AssignGuard = 'flag' | 'flagViaGkHands' | 'nullGuard' | 'ungated';
/** the sweep's own clear sits INSIDE the anchored `if (q.saveContact !== null && …)` block; the
 *  waiting branch's clear sits inside `if (gkHands !== null)`, and `gkHands`'s own definition
 *  line carries `this.gkDiveBody` (anchored). Both block facts are PROVEN from the file text
 *  below, never asserted. */
const SWEEP_BLOCK_TEXT = '          if (q.saveContact !== null && q.saveContact.caught && '
  + 'this.ball.owner !== q) {\n            q.saveContact = null;\n';
const GKHANDS_BLOCK_TEXT = '      if (gkHands !== null) {\n'
  + '        const cx = ball.owner.pos.x + ball.owner.heading.x * carry - gkHands.x;\n';
const GKHANDS_DEF_HAS_FLAG = SRC_OF[MATCH_PATH].includes(
  '      const gkHands = this.gkDiveBody && ball.owner.role === ' + "'GK'");
const guardedAssign = (o: Occ): AssignGuard => {
  if (o.text.includes('match.gkDiveBody')) return 'flag';
  if (o.text.includes('saveContact !== null')) return 'nullGuard';
  if (o.file === MATCH_PATH && o.text === 'q.saveContact = null;'
    && SRC_OF[MATCH_PATH].includes(SWEEP_BLOCK_TEXT)) return 'nullGuard';
  if (o.file === MATCH_PATH && o.text.startsWith('else ball.owner.saveContact = null;')
    && SRC_OF[MATCH_PATH].includes(GKHANDS_BLOCK_TEXT) && GKHANDS_DEF_HAS_FLAG) {
    return 'flagViaGkHands';
  }
  return 'ungated';
};
const ASSIGN_GUARDS = SAVECONTACT_ASSIGNS.map((o) => ({ ...o, guard: guardedAssign(o) }));
const FLAG_WRITES = ASSIGN_GUARDS.filter((a) => a.guard === 'flag');
const UNGATED_ASSIGNS = ASSIGN_GUARDS.filter((a) => a.guard === 'ungated');
/** the ONE `q.saveContact = null;` line inside the sweep is `nullGuard` by its BLOCK: the
 *  `if` that opens the block IS the anchored sweep condition, and the block's opening line is
 *  enumerated beside it. Proven here from the file, not typed. */
const SWEEP_BLOCK_OK = SRC_OF[MATCH_PATH].includes(SWEEP_BLOCK_TEXT);
const GKHANDS_BLOCK_OK = SRC_OF[MATCH_PATH].includes(GKHANDS_BLOCK_TEXT) && GKHANDS_DEF_HAS_FLAG;
const FIELD_INITIALISER_IS_NULL = SRC_OF[PLAYER_PATH].includes(
  '  saveContact: { x: number; y: number; caught: boolean } | null = null;');
const absentArmIsShippedPath = FLAG_WRITES.length === 2 && UNGATED_ASSIGNS.length === 0
  && SWEEP_BLOCK_OK && GKHANDS_BLOCK_OK && FIELD_INITIALISER_IS_NULL
  && ASSIGN_GUARDS.filter((a) => a.guard === 'nullGuard').length === 5
  && ASSIGN_GUARDS.filter((a) => a.guard === 'flagViaGkHands').length === 1;
/* ---- THE FOUR READ SITES + THE TWO WRITE SITES, EACH HASHED WHOLE WITH ITS CALLEES ---- */
const findSpan = (file: string, name: string, containsLine: number): Span | null => {
  const hit = enclosingOf(file, containsLine);
  return hit !== null && hit.name === name ? hit : null;
};
const lineOfNeedle = (file: string, needle: string): number =>
  occurrences(SRC_OF[file], needle)[0].line;
const SPAN_TRY_KEEPER_SAVE = findSpan(MECH_PATH, 'tryKeeperSave',
  lineOfNeedle(MECH_PATH, 'export function tryKeeperSave(match: Match): void {') + 1);
const SPAN_GIVE_BALL = findSpan(MATCH_PATH, 'giveBall',
  lineOfNeedle(MATCH_PATH, '  giveBall(p: Player): void {') + 1);
const SPAN_EXEC_OVERRIDE = enclosingOf(EXEC_PATH,
  lineOfNeedle(EXEC_PATH, '  if (match.gkDiveBody && p.saveContact !== null) {'));
const SPAN_SWEEP = enclosingOf(MATCH_PATH, lineOfNeedle(MATCH_PATH,
  '          if (q.saveContact !== null && q.saveContact.caught && this.ball.owner !== q) {'));
const SPAN_WAITING = enclosingOf(MATCH_PATH, lineOfNeedle(MATCH_PATH,
  '        const cx = ball.owner.pos.x + ball.owner.heading.x * carry - gkHands.x;'));
const SEAM_SITES: { site: string; span: Span | null }[] = [
  { site: 'M-GK.1 the two writes — `tryKeeperSave`', span: SPAN_TRY_KEEPER_SAVE },
  { site: 'M-GK.2′ the executor override', span: SPAN_EXEC_OVERRIDE },
  { site: 'M-GK.3′ (b) the ownership sweep', span: SPAN_SWEEP },
  { site: 'M-GK.3′ (c) the `giveBall` clear', span: SPAN_GIVE_BALL },
  { site: 'M-GK.3′ (a) the waiting branch', span: SPAN_WAITING },
];
const SEAM_SPANS = SEAM_SITES.map((s) => s.span).filter((s): s is Span => s !== null);
const SEAM_SITES_COMPLETE = SEAM_SPANS.length === SEAM_SITES.length;
const SEAM_CLOSURE = closureOf(SEAM_SPANS);
const seamGraph = SEAM_SITES.map((s) => ({
  site: s.site,
  span: s.span === null ? null : spanKey(s.span),
  sha: s.span === null ? null : s.span.sha,
  callees: s.span === null ? [] : calleesOf(s.span).resolved.map(spanKey).sort(),
  externals: s.span === null ? [] : calleesOf(s.span).external.sort(),
}));
/** ⭐⭐ THE OWN-LANE DOOR OVER THE KEEPER PATHS, RE-DERIVED AT THIS HEAD — with GK-C0's FIVE
 *  roots AND with the SIXTH root #398 item 1(ii) added (`decidePlayer`, whose first branch
 *  routes the ball's OWNER into `decideCarrier`). E14's beside-arm justification is the
 *  CORRECTED boolean. */
const SPAN_DECIDE_GK = findSpan(BRAIN_PATH, 'decideGoalkeeper',
  lineOfNeedle(BRAIN_PATH,
    'function decideGoalkeeper(p: Player, team: Team, match: Match): void {') + 1);
const SPAN_DECIDE_PLAYER = findSpan(BRAIN_PATH, 'decidePlayer',
  lineOfNeedle(BRAIN_PATH, 'export function decidePlayer(p: Player, match: Match): void {') + 1);
const SPAN_CARRY_LAW = enclosingOf(MATCH_PATH, lineOfNeedle(MATCH_PATH,
  '        ball.pos.x = ball.owner.pos.x + ball.owner.heading.x * carry;'));
const SPAN_GK_EXEC = enclosingOf(EXEC_PATH, lineOfNeedle(EXEC_PATH,
  "    case 'GoalkeeperSave': {"));
const FIVE_ROOTS = [SPAN_TRY_KEEPER_SAVE, SPAN_GIVE_BALL, SPAN_DECIDE_GK, SPAN_CARRY_LAW,
  SPAN_GK_EXEC].filter((s): s is Span => s !== null);
const SIX_ROOTS = [...FIVE_ROOTS, SPAN_DECIDE_PLAYER].filter((s): s is Span => s !== null);
const ROOTS_COMPLETE = FIVE_ROOTS.length === 5 && SIX_ROOTS.length === 6;
const CLOSURE_FIVE = closureOf(FIVE_ROOTS);
const CLOSURE_SIX = closureOf(SIX_ROOTS);
const OWN_LANE_HITS_FIVE = CLOSURE_FIVE.nodes.filter((s) => s.text.includes('lnOwnLane'))
  .map(spanKey);
const OWN_LANE_HITS_SIX = CLOSURE_SIX.nodes.filter((s) => s.text.includes('lnOwnLane'))
  .map(spanKey);
const OWN_LANE_ANYWHERE = SPANS.filter((s) => s.text.includes('lnOwnLane')).map(spanKey);
const ownLaneNeedleIsLive = OWN_LANE_ANYWHERE.length > 0;
/** ⛔ THE BOOLEAN OF RECORD is the SIX-root one; GK-C0's five-root value is stored beside as
 *  the corrected claim's own receipt (#398 item 1(ii)). */
const ownLaneDoorTouchesNoKeeperPath = ROOTS_COMPLETE && OWN_LANE_HITS_SIX.length === 0;
const ownLaneDoorTouchesNoKeeperPathFiveRoots = ROOTS_COMPLETE && OWN_LANE_HITS_FIVE.length === 0;

/* ========================================================================== */
/* §11 THE RECEIPT WALKS — gLockstep · X-DET twice · FLAG-HYGIENE · the world pin · X-FP-PROD */
/* ========================================================================== */
banner('GK-T1 — the receipt walks');
const lockstepRows = LOCKSTEP_SEEDS.flatMap((seed) => ARMS.map((armK) => {
  const observed = buildMatch(seed, armK);
  walkMatch(observed, armK, true);
  const unobserved = buildMatch(seed, armK);
  walkMatch(unobserved, armK, false);
  return { seed, arm: armK, observed: signatureOf(observed), unobserved: signatureOf(unobserved) };
}));
const LOCKSTEP_OK = lockstepRows.every((r) => r.observed === r.unobserved);
banner(`  gLockstep ${LOCKSTEP_OK ? 'GREEN' : 'RED'} (${lockstepRows.length} walks)`);
const xDetRows = XDET_SEEDS.flatMap((seed) => ARMS.map((armK) => {
  const a = buildMatch(seed, armK); const rowA = walkMatch(a, armK, true);
  const b = buildMatch(seed, armK); const rowB = walkMatch(b, armK, true);
  const strip = (r: Row): string => JSON.stringify({ ...r, wallMs: 0 });
  return {
    seed, arm: armK, sigA: signatureOf(a), sigB: signatureOf(b),
    rowsIdentical: strip(rowA) === strip(rowB),
  };
}));
const XDET_OK = xDetRows.every((r) => r.sigA === r.sigB && r.rowsIdentical);
banner(`  X-DET ${XDET_OK ? 'GREEN' : 'RED'} (${xDetRows.length} twice-walked pairs)`);
/** ⭐⭐ FLAG-HYGIENE, THE HALF THIS FLAG CAN HAVE: `gkDiveBody` has NO GENE and NO WORLD, so
 *  there is no ARMED-ZERO dose arm. What IS provable here is the DORMANCY IDENTITY — the flag
 *  KEY ABSENT (the shipped shape) ≡ the flag passed EXPLICITLY FALSE — on every composition.
 *  The OTHER half, OFF ≡ HEAD-BEFORE-THE-SEAM, is G-REPRO-GKC0 (below): E13-ABSENT re-walked
 *  on GK-C0's own band reproduces GK-C0's stored E13 rows FIELD FOR FIELD. */
const explicitFalseMatch = (seed: number, comp: Composition): Match => {
  const version = comp === 'E14' ? LN_WORLD_VERSION : BQ_WORLD_VERSION;
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(version), gkDiveBody: false,
  } as ConstructorParameters<typeof Match>[0]);
  if (comp === 'D13') armA4World(m, null, BQ_WORLD_VERSION, L3_DOSE, PC_DOSE);
  else armA4World(m, null, version);
  return m;
};
const flagHygieneRows = LOCKSTEP_SEEDS.flatMap((seed) => COMPOSITIONS.map((comp) => {
  const absent = buildMatch(seed, ABSENT_OF[comp]);
  walkMatch(absent, ABSENT_OF[comp], false);
  const explicit = explicitFalseMatch(seed, comp);
  walkMatch(explicit, ABSENT_OF[comp], false);
  return {
    seed, composition: comp, keyAbsent: signatureOf(absent),
    explicitFalse: signatureOf(explicit),
  };
}));
const FLAG_HYGIENE_OK = flagHygieneRows.every((r) => r.keyAbsent === r.explicitFalse);
banner(`  FLAG-HYGIENE ${FLAG_HYGIENE_OK ? 'GREEN' : 'RED'} (${flagHygieneRows.length} pairs)`);
/** ⭐⭐ X-FP-PROD — the production fingerprint RECOMPUTED in this process. */
const FP_PROD_PIN = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const fpLeague = new League({ seed: 1337 });
const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
  kind: 'toGeneration', target: fpLeague.generation + 2,
});
const FP_PROD_GOT = sha(JSON.stringify(fpOut.league));
const FP_PROD_OK = FP_PROD_GOT === FP_PROD_PIN;
banner(`  X-FP-PROD ${FP_PROD_OK ? 'GREEN' : 'RED'} (${FP_PROD_GOT.slice(0, 8)}…)`);
/** the world pin, on a CONSTRUCTED match of each arm at an out-of-band scratch seed. */
const worldPin = ARMS.map((armK) => {
  const m = buildMatch(WORLD_PIN_SEED, armK);
  const mm = m as unknown as MutMatch;
  const comp = COMP_OF(armK);
  return {
    seed: WORLD_PIN_SEED, arm: armK, composition: comp,
    bqArmedVersion: bqArmedVersion(m), lnArmedVersion: lnArmedVersion(m),
    bqCushion: mm.bqCushion === true,
    lnOwnLanePrice: mm.lnOwnLanePrice === true,
    gkDiveBody: mm.gkDiveBody === true,
    edsPerceivedChoice: mm.edsPerceivedChoice === true,
    seamsAbsent: mm.obmMovement !== true && mm.ctbSupportPlane !== true
      && mm.rcAnticipate !== true && mm.rcReady !== true && mm.bfFacingCost !== true,
  };
});
const WORLD_PIN_OK = worldPin.every((w) => w.bqArmedVersion === BQ_WORLD_VERSION && w.bqCushion
  && w.edsPerceivedChoice && w.seamsAbsent
  && w.gkDiveBody === IS_ARMED(w.arm)
  && (w.composition === 'E14'
    ? (w.lnOwnLanePrice && w.lnArmedVersion === LN_WORLD_VERSION)
    : (!w.lnOwnLanePrice && w.lnArmedVersion !== LN_WORLD_VERSION)));

/* ========================================================================== */
/* §12 THE BATTERY — the six arms PAIRED on every seed                         */
/* ========================================================================== */
interface Cell { seed: number; rows: Record<Arm, Row>; sigs: Record<Arm, string> }
const cells: Cell[] = [];
banner(`GK-T1 — the battery: ${N} seeds × ${ARMS.length} arms, seeds `
  + `${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]}`);
const CHUNK = 25;
for (let start = 0; start < batterySeeds.length; start += CHUNK) {
  for (const seed of batterySeeds.slice(start, start + CHUNK)) {
    const rows = {} as Record<Arm, Row>;
    const sigs = {} as Record<Arm, string>;
    for (const armK of ARMS) {
      const m = buildMatch(seed, armK);
      rows[armK] = walkMatch(m, armK, true);
      sigs[armK] = signatureOf(m);
    }
    cells.push({ seed, rows, sigs });
  }
  banner(`  … ${Math.min(start + CHUNK, batterySeeds.length)}/${batterySeeds.length} seeds `
    + `×${ARMS.length} arms (${((Date.now() - t0Wall) / 1000).toFixed(1)} s)`);
}
const receiptRows = {} as Record<Arm, Row>;
for (const armK of ARMS) receiptRows[armK] = walkMatch(buildMatch(RECEIPT_SEED, armK), armK, true);
const walksBooked = (cells.length + 1) * ARMS.length;
const armRows = (armK: Arm): Row[] => cells.map((c) => c.rows[armK]);
const allRows = (armK: Arm): Row[] => [...armRows(armK), receiptRows[armK]];
const tot = (armK: Arm, pick: (r: Row) => number): number =>
  armRows(armK).reduce((a, r) => a + pick(r), 0);
/** ⭐⭐ G-BITE — THE LIVENESS RECEIPT: on EVERY seed with at least one catch on either arm of a
 *  composition, the ABSENT and ARMED whole-match signatures DIFFER. The flag is not a no-op. */
const biteRows = COMPOSITIONS.map((comp) => {
  const a = ABSENT_OF[comp]; const b = ARMED_OF[comp];
  const withCatch = cells.filter((c) => c.rows[a].saveEvents[SKI('catch')] > 0
    || c.rows[b].saveEvents[SKI('catch')] > 0);
  const differing = withCatch.filter((c) => c.sigs[a] !== c.sigs[b]);
  const identicalSeeds = withCatch.filter((c) => c.sigs[a] === c.sigs[b]).map((c) => c.seed);
  return {
    composition: comp, seedsWithACatch: withCatch.length, seedsDiffering: differing.length,
    identicalSeeds: identicalSeeds.slice(0, 20),
    allDiffer: withCatch.length > 0 && identicalSeeds.length === 0,
  };
});
const BITE_OK = biteRows.every((r) => r.allDiffer);

/* ========================================================================== */
/* §13 THE ESTIMATOR — CLUSTER BOOTSTRAP over match seeds (consumes NO stats)   */
/* ========================================================================== */
const BOOTSTRAP = 2000;
const rngBoot = new Rng(BLOCK_BASE);
const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: cells.length }, () => Math.floor(rngBoot.next() * cells.length) % cells.length));
const pctl = (s: number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.floor(q * s.length))]);
interface FaceDef {
  unit: string; what: string; den: string; num: (r: Row) => number; dn: (r: Row) => number;
}
const FACES: Record<string, FaceDef> = {};
const defFace = (
  key: string, unit: string, what: string, den: string,
  num: (r: Row) => number, dn: (r: Row) => number,
): void => { FACES[key] = { unit, what, den, num, dn }; };
const ONE = (): number => 1;

/* ---- ⭐⭐⭐ R1 — THE PRIMARY RULER, THE USER'S FACE ---- */
defFace('r1.catchMaxOverOneMetreShare', 'share',
  '⭐⭐⭐ R1 — THE SHARE OF CATCHES whose MAXIMUM per-tick ball displacement over the '
  + 'OWNED-CAUGHT EPISODE exceeds 1.0 m (a jump the eye sees). The episode runs from the CATCH '
  + 'TICK to the tick AFTER the ball leaves the contact: ABSENT the catch tick and the tick '
  + 'after; ARMED every waiting tick, the release tick and the one after', 'catches',
  (r) => r.epMaxOverThreshold, (r) => r.episodes);
defFace('r1.catchMeanMaximumMetres', 'metres',
  '⭐⭐ the MEAN of those per-catch maxima', 'catches', (r) => r.epMaxSum, (r) => r.episodes);
defFace('r1.episodeTicksPerCatch', 'ticks per catch',
  'the episode length in ticks (ABSENT is 2 by construction; ARMED is 2 + the wait)',
  'catches', (r) => r.episodeTicks, (r) => r.episodes);
defFace('ballJump.catchShare', 'share',
  '⭐⭐ GK-C0\'s OWN cap-based face, RECOMPUTED ON BOTH ARMS: catches whose NEXT-TICK ball '
  + 'displacement exceeds the catching keeper\'s own `topSpeed · DT`',
  'catches with a following tick', (r) => r.catchJumps, (r) => r.catchNext);
defFace('ballJump.catchMeanMetres', 'metres',
  'GK-C0\'s mean ball displacement on the tick after a catch (the carry snap)',
  'catches with a following tick', (r) => r.catchNextDispSum, (r) => r.catchNext);
defFace('ballJump.parryShare', 'share', 'the same predicate on PARRIES (beside, never read)',
  'parries with a following tick', (r) => r.parryJumps, (r) => r.parryNext);
defFace('ballJump.parryMeanMetres', 'metres', 'the mean ball move on the tick after a parry',
  'parries with a following tick', (r) => r.parryNextDispSum, (r) => r.parryNext);
/* ---- THE SEAM'S OWN FACES ---- */
for (const c of RELEASE_CLASSES) {
  defFace(`release.${c}`, 'share',
    `the ${c} share of the release composition — INFERRED from the engine's state tick to `
    + 'tick (the inference is stated and fixture-pinned)', 'catches',
    (r) => r.releaseClassCount[RLI(c)], (r) => r.episodes);
}
defFace('wait.meanTicks', 'ticks',
  '⭐⭐ THE WAIT LENGTH — ticks on which the caught ball was held AT the contact', 'released waits',
  (r) => r.waitTicksSum, (r) => r.waitsCounted);
defFace('wait.overSpriteShare', 'share',
  '⭐⭐ waits LONGER than the sprite\'s window — 42 ticks, DERIVED as 0.7 s ÷ DT (both '
  + 'extracted from their anchored lines), never typed', 'released waits',
  (r) => r.waitsOverSprite, (r) => r.waitsCounted);
defFace('release.bodyContactMeanMetres', 'metres',
  '⭐⭐ the BODY↔CONTACT distance at the release tick (the body, NOT the carry point)',
  'releases with a contact', (r) => r.bodyContactSum, (r) => r.releasesCounted);
defFace('release.bodyInsideCarryShare', 'share',
  '⭐⭐ releases whose BODY (not carry point) is within `carry` of the contact — THE '
  + 'CARRY-POINT-VS-BODY FORK\'S DATA', 'releases with a contact',
  (r) => r.bodyInsideCarry, (r) => r.releasesCounted);
defFace('wait.maxBallOwnerMeanMetres', 'metres',
  'the MEAN of the per-episode MAXIMUM ball↔owner distance while waiting', 'waiting episodes',
  (r) => r.ownDistMaxSum, (r) => r.ownDistCounted);
defFace('gkFeet.catchesPerMatch', 'gkFeet catches per match',
  '⭐⭐ catches taken with NO hold and NO bubble — read off the ENGINE\'S OWN consequence (the '
  + '`Dribble` action `giveBall` sets on that branch, the only way a KEEPER leaves `giveBall` '
  + 'with it)', 'matches', (r) => r.gkFeetCatches, ONE);
defFace('gkFeet.lostWithin10Share', 'share',
  '⭐⭐ gkFeet catches on which the keeper stopped owning the ball within 10 ticks',
  'gkFeet catches', (r) => r.gkFeetLostWithin10, (r) => r.gkFeetCatches);
defFace('gkFeet.reconAgreementShare', 'share',
  'the GEOMETRIC reconstruction (`restartKickGid !== gid ∧ (backPass ∨ ¬inPenaltyBox)`, the '
  + 'engine\'s own `inPenaltyBox` CALLED) agreeing with the engine consequence — a RECEIPT on '
  + 'the reconstruction, never a face that gates', 'catches',
  (r) => r.gkFeetReconAgrees, (r) => r.episodes);
defFace('claim.meanNextDisplacementMetres', 'metres',
  '⭐ THE HIGH-BALL CLAIM\'s ball displacement on the tick after the claim — the claim path '
  + 'sets NO contact (the seam\'s two writes are both in `tryKeeperSave`), so this is a RECEIPT',
  'claims with a following tick', (r) => r.claimNextDispSum, (r) => r.claimNext);
defFace('claim.jumpShare', 'share', 'the cap predicate on claims (beside)',
  'claims with a following tick', (r) => r.claimJumps, (r) => r.claimNext);
defFace('parryContact.spriteClearShare', 'share',
  'parry contacts cleared with `saveAnimTimer === 0` — the sprite window, the ONE clear a '
  + 'steer-only contact has; the alternative is counted beside', 'parry contacts cleared',
  (r) => r.parryContactSpriteClears,
  (r) => r.parryContactSpriteClears + r.parryContactOtherClears);
/* ---- THE KEEPER'S RESIDUAL-WRITTEN TICKS (the exam's predicate) and the CAP beside ---- */
defFace('keeper.ticksPerMatch', 'keeper ticks per match', 'both keepers, every stepped tick',
  'matches', (r) => r.keeperTicks, ONE);
defFace('residual.keeperShare', 'share',
  '⭐⭐ THE RESIDUAL-WRITTEN SHARE — keeper ticks whose |pos_after − (pos_before + vel_after·DT)| '
  + 'exceeds 1 mm', 'keeper ticks', (r) => r.keeperResidual, (r) => r.keeperTicks);
defFace('residual.keeperOutsideRestartsShare', 'share',
  'residual-written keeper ticks OUTSIDE the restartPlacement / substitution classes',
  'keeper ticks', (r) => r.keeperResidualOutsideRestarts, (r) => r.keeperTicks);
defFace('residual.crowdedShareOfWritten', 'share',
  '⚠ residual-written keeper ticks with ANOTHER BODY inside `PLAYER_MIN_DIST` at the tick\'s '
  + 'start — the OVERLAP-RESOLVER\'s own shape. §DEV-PREFLIGHT measured that `resolveOverlaps` '
  + 'writes POSITION as well as velocity, so this marker is published beside every residual '
  + 'face (a PROXIMITY MARKER, not call-site attribution)', 'residual-written keeper ticks',
  (r) => r.keeperResidualCrowded, (r) => r.keeperResidual);
defFace('overCap.keeperShare', 'share',
  'GK-C0\'s OVER-CAP predicate on the same population — AN UPPER BOUND (#398 item 1(i))',
  'keeper ticks', (r) => r.keeperWritten, (r) => r.keeperTicks);
defFace('residual.saveWindowTicksPerMatch', 'residual save-window keeper ticks per match',
  '⭐⭐ THE POCKET\'S POPULATION — residual-written keeper ticks with `saveAnimTimer > 0`, '
  + 'WITHOUT the class precedence (so a restart inside the window still counts here)',
  'matches', (r) => r.keeperSaveWindowResidual, ONE);
defFace('pocket.restartPlacementShare', 'share',
  '⭐⭐⭐ H-GK-2 — the share of save-window residual-written keeper ticks that coincide with the '
  + 'ENGINE\'S OWN restart placement state (`match.phase` not `playing` at the end of the tick, '
  + 'or the phase CHANGED across it, or `match.restartKickGid !== null`)',
  'save-window residual-written keeper ticks',
  (r) => r.keeperSaveWindowResidualRestart, (r) => r.keeperSaveWindowResidual);
for (const c of KEEPER_CLASSES) {
  defFace(`residualClass.compositionOfWritten.${c}`, 'share',
    `the ${c} share OF THE RESIDUAL-WRITTEN keeper ticks (GK-C0's frozen precedence)`,
    'residual-written keeper ticks',
    (r) => r.keeperResidualByClass[KCI(c)], (r) => r.keeperResidual);
  defFace(`keeperClass.tickShare.${c}`, 'share',
    `the share of ALL keeper ticks in class ${c}`, 'keeper ticks',
    (r) => r.keeperClassTicks[KCI(c)], (r) => r.keeperTicks);
}
/* ---- THE SAVES (context, and the join receipt) ---- */
defFace('save.eventsPerMatch', 'save events per match', 'every `save` EVENT (all four sites)',
  'matches', (r) => sum(r.saveEvents), ONE);
defFace('save.joinAgreementShare', 'share',
  'ledger flips that coincide with a save EVENT on the same tick', 'shotLog saved-flips',
  (r) => r.joinFlipWithEvent, (r) => r.ledgerSavedFlips);
for (const k of SAVE_KINDS) {
  defFace(`saveKind.${k}`, 'share', `the ${k} share of save events`, 'save events',
    (r) => r.saveEvents[SKI(k)], (r) => sum(r.saveEvents));
}
defFace('save.meanDistanceMetres', 'metres', 'the ball↔keeper distance at the save tick',
  'save events', (r) => r.saveDistSum, (r) => sum(r.saveEvents));
defFace('catch.gt1mShare', 'share', 'catches taken more than 1 m from the body', 'catch events',
  (r) => r.catchGt1, (r) => r.saveEvents[SKI('catch')]);
defFace('catch.gt2mShare', 'share', 'catches taken more than 2 m from the body', 'catch events',
  (r) => r.catchGt2, (r) => r.saveEvents[SKI('catch')]);
/* ---- ⭐⭐⭐ THE GUARDS (F-GK-b) ---- */
defFace('guard.goalsPerMatch', 'goals per match', 'G1 — both sides, the 240 s clock (BOTH '
  + 'directions harmful)', 'matches', (r) => r.goals, ONE);
defFace('guard.savesPerMatch', 'saves per match', 'G2 — the engine\'s own `saves` stat, both '
  + 'sides (BOTH)', 'matches', (r) => r.savesStat, ONE);
defFace('guard.catchShareOfSaves', 'share',
  'G3 — the CATCH share among the two `tryKeeperSave` outcomes (BOTH)', 'catch + parry events',
  (r) => r.saveEvents[SKI('catch')],
  (r) => r.saveEvents[SKI('catch')] + r.saveEvents[SKI('parry')]);
defFace('guard.xgConversion', 'goals per unit xG',
  'G4 — goals ÷ Σ`xg` off the `shotLog` (BOTH; the roll is untouched, so any move is '
  + 'downstream)', 'summed shotLog xg', (r) => r.goals, (r) => r.xgSum);
defFace('guard.shotsPerMatch', 'shots per match', 'G5 — both sides (BOTH)', 'matches',
  (r) => r.shots, ONE);
defFace('guard.passCompletion', 'share',
  'G6 — the engine\'s own completion over ALL deliveries (a FLOOR; DOWN is harmful)',
  'engine passes', (r) => r.passesCompleted, (r) => r.passes);
defFace('guard.interceptionsPerMatch', 'interceptions per match',
  'G7 — both sides (a CEILING; UP is harmful)', 'matches', (r) => r.interceptions, ONE);
defFace('guard.timeToDistributionTicks', 'ticks',
  '⭐⭐⭐ G8 — THE KEEPER\'S TIME-TO-DISTRIBUTION: ticks from the CATCH to his RELEASE KICK, '
  + 'read off the engine\'s own record (ownership leaving him with `ball.lastTouch` still him '
  + 'and the ball moving). A CEILING — a longer wait delays the restart of play, and it is THE '
  + 'REAL COST of this law', 'resolved catches', (r) => r.ttdSum, (r) => r.ttdCount);
defFace('guard.keeperHoldsPerMatch', 'keeper holds per match',
  'G9 — `gkHoldTimer` rising from 0, both keepers (BOTH)', 'matches',
  (r) => r.keeperHolds, ONE);
defFace('guard.keeperPassesPerMatch', 'keeper passes per match',
  'G10 — a NEW `pendingPass` whose `passerGid` is a keeper, the engine\'s own record (BOTH). '
  + 'On E14 this is the family the own-lane door prices (#398 item 4; LN-T1′b measured it)',
  'matches', (r) => r.keeperPasses, ONE);
defFace('guard.offsidesPerMatch', 'offsides per match',
  'G11 — the engine\'s own offside counter, both sides, in the #157 FLAG form: a RESOLVED '
  + 'INCREASE raises a flag and gates NOTHING', 'matches', (r) => r.offsides, ONE);
/* ---- context ---- */
defFace('context.ttdResolvedShare', 'share',
  'catches whose release kick was OBSERVED before full time — G8\'s own denominator receipt',
  'catches', (r) => r.ttdCount, (r) => r.episodes);

const FACE_KEYS = Object.keys(FACES).sort();
interface FaceRow {
  face: string; arm: Arm; unit: string; what: string; denNote: string;
  value: number; numerator: number; denominator: number;
  ciLo: number; ciHi: number; halfWidth: number;
}
const faces: FaceRow[] = [];
for (const armK of ARMS) {
  const rows = armRows(armK);
  for (const key of FACE_KEYS) {
    const f = FACES[key];
    const nu = rows.map((r) => f.num(r));
    const de = rows.map((r) => f.dn(r));
    const draws: number[] = [];
    for (const idx of resampleIndex) {
      let n1 = 0; let d1 = 0;
      for (const i of idx) { n1 += nu[i]; d1 += de[i]; }
      const v = ratio(n1, d1);
      if (Number.isFinite(v)) draws.push(v);
    }
    draws.sort((a, b) => a - b);
    faces.push({
      face: key, arm: armK, unit: f.unit, what: f.what, denNote: f.den,
      value: ratio(sum(nu), sum(de)), numerator: sum(nu), denominator: sum(de),
      ciLo: pctl(draws, 0.025), ciHi: pctl(draws, 0.975),
      halfWidth: (pctl(draws, 0.975) - pctl(draws, 0.025)) / 2,
    });
  }
}
const face = (k: string, armK: Arm): FaceRow => {
  const f = faces.find((x) => x.face === k && x.arm === armK);
  if (f === undefined) { banner(`GK-T1 FATAL — unknown face ${k}/${armK}`); process.exit(3); }
  return f as FaceRow;
};
/** ⭐⭐ THE PAIRED Δ — ARMED − ABSENT, on shared seeds, per composition. LOO in the
 *  CONSERVATIVE POINT-SHIFT form (LN-T1′b's). */
interface DeltaRow {
  key: string; face: string; composition: Composition; armedArm: Arm; absentArm: Arm;
  absentValue: number; armedValue: number; delta: number;
  ciLo: number; ciHi: number; halfWidth: number; absDeltaOverHalfWidth: number;
  down: boolean; up: boolean; resolved: boolean; containsZero: boolean;
  looMaxInfluenceShare: number; looFlipsDown: number; looFlipsUp: number;
}
const pairedDelta = (faceKey: string, comp: Composition): DeltaRow => {
  const f = FACES[faceKey];
  const armedArm = ARMED_OF[comp]; const absentArm = ABSENT_OF[comp];
  const nA = cells.map((c) => f.num(c.rows[armedArm]));
  const dA = cells.map((c) => f.dn(c.rows[armedArm]));
  const nC = cells.map((c) => f.num(c.rows[absentArm]));
  const dC = cells.map((c) => f.dn(c.rows[absentArm]));
  const pA = ratio(sum(nA), sum(dA));
  const pC = ratio(sum(nC), sum(dC));
  const point = pA - pC;
  const draws: number[] = [];
  for (const idx of resampleIndex) {
    let n1 = 0; let d1 = 0; let n2 = 0; let d2 = 0;
    for (const i of idx) { n1 += nA[i]; d1 += dA[i]; n2 += nC[i]; d2 += dC[i]; }
    const v = ratio(n1, d1) - ratio(n2, d2);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const lo = pctl(draws, 0.025);
  const hi = pctl(draws, 0.975);
  const tNA = sum(nA); const tDA = sum(dA); const tNC = sum(nC); const tDC = sum(dC);
  let maxInf = 0; let flipsDown = 0; let flipsUp = 0;
  for (let i = 0; i < cells.length; i++) {
    const dLoo = ratio(tNA - nA[i], tDA - dA[i]) - ratio(tNC - nC[i], tDC - dC[i]);
    if (!Number.isFinite(dLoo)) continue;
    const inf = Math.abs(dLoo - point) / Math.max(Math.abs(point), 1e-12);
    if (inf > maxInf) maxInf = inf;
    const shift = dLoo - point;
    if ((hi < 0) !== (hi + shift < 0)) flipsDown += 1;
    if ((lo > 0) !== (lo + shift > 0)) flipsUp += 1;
  }
  return {
    key: `${faceKey}@${comp}`, face: faceKey, composition: comp, armedArm, absentArm,
    absentValue: pC, armedValue: pA, delta: point,
    ciLo: lo, ciHi: hi, halfWidth: (hi - lo) / 2,
    absDeltaOverHalfWidth: ratio(Math.abs(point), (hi - lo) / 2),
    down: hi < 0, up: lo > 0, resolved: hi < 0 || lo > 0,
    containsZero: !(hi < 0) && !(lo > 0),
    looMaxInfluenceShare: maxInf, looFlipsDown: flipsDown, looFlipsUp: flipsUp,
  };
};
const deltas: DeltaRow[] = COMPOSITIONS.flatMap(
  (comp) => FACE_KEYS.map((k) => pairedDelta(k, comp)),
);
const delta = (faceKey: string, comp: Composition): DeltaRow => {
  const dd = deltas.find((x) => x.face === faceKey && x.composition === comp);
  if (dd === undefined) { banner(`GK-T1 FATAL — unknown Δ ${faceKey}@${comp}`); process.exit(3); }
  return dd as DeltaRow;
};

/* ========================================================================== */
/* §14 THE GUARDS, THE OFFSIDE FLAG, THE SELECTORS AND THE FROZEN READS         */
/* ========================================================================== */
/** ⭐⭐ THE GUARD ROWS — the OBM-T1 / LN-T1 tolerance form: tolerance = NI_FRACTION · |control
 *  level|, with NI_FRACTION INHERITED BY ANCHOR as an EXPRESSION and EVALUATED from its two
 *  numerals (§4), never typed as a decimal. BREACH = the paired Δ's interval RESOLVED **AND**
 *  beyond the tolerance IN THE HARMFUL DIRECTION. ⭐ G8 IS PRINTED FIRST — it is the cost. */
type GuardDir = 'ceiling' | 'floor' | 'both';
const GUARD_LIMBS: readonly { id: string; key: string; direction: GuardDir; what: string }[] = [
  { id: 'G8', key: 'guard.timeToDistributionTicks', direction: 'ceiling',
    what: 'THE KEEPER\'S TIME-TO-DISTRIBUTION — ticks from the catch to his release kick. A '
      + 'CEILING: longer is the real cost of making the ball wait for the body.' },
  { id: 'G1', key: 'guard.goalsPerMatch', direction: 'both',
    what: 'GOALS per match — the law changes no roll, so EITHER direction beyond tolerance is a '
      + 'breach.' },
  { id: 'G2', key: 'guard.savesPerMatch', direction: 'both',
    what: 'SAVES per match, the engine\'s own stat.' },
  { id: 'G3', key: 'guard.catchShareOfSaves', direction: 'both',
    what: 'THE CATCH SHARE of the two `tryKeeperSave` outcomes.' },
  { id: 'G4', key: 'guard.xgConversion', direction: 'both',
    what: 'xG-PER-SHOT CONVERSION — goals ÷ Σ xg off the `shotLog`.' },
  { id: 'G5', key: 'guard.shotsPerMatch', direction: 'both',
    what: 'SHOTS per match, both sides.' },
  { id: 'G6', key: 'guard.passCompletion', direction: 'floor',
    what: 'PASS COMPLETION over ALL deliveries — a FLOOR; DOWN is harmful.' },
  { id: 'G7', key: 'guard.interceptionsPerMatch', direction: 'ceiling',
    what: 'INTERCEPTIONS per match — a CEILING; UP is harmful.' },
  { id: 'G9', key: 'guard.keeperHoldsPerMatch', direction: 'both',
    what: 'THE KEEPER\'S HOLDS per match.' },
  { id: 'G10', key: 'guard.keeperPassesPerMatch', direction: 'both',
    what: 'THE KEEPER\'S PASSES per match — on E14 this is the family the own-lane door prices.' },
];
const TOLERANCE_FORM = 'NI_FRACTION · |controlLevel|, NI_FRACTION = 1 − 0.275/0.380 (PM-T1 §5, '
  + 'inherited from A4-S2P1-VECTOR-CENSUS §4) — INHERITED BY ANCHOR from '
  + '`scripts/probes/ctb-t1-supply-exam.ts`\'s own line, cross-read from '
  + '`scripts/probes/dlc-t1-choice-exam.ts`, and EVALUATED FROM ITS TWO NUMERALS; never typed '
  + 'as a decimal. Frozen ex ante at §P.5.';
const guardRowFor = (comp: Composition) => GUARD_LIMBS.map((l) => {
  const control = face(l.key, ABSENT_OF[comp]).value;
  const tol = NI_FRACTION * Math.abs(control);
  const d = delta(l.key, comp);
  const beyond = l.direction === 'ceiling' ? d.delta > tol
    : l.direction === 'floor' ? d.delta < -tol : Math.abs(d.delta) > tol;
  return {
    id: l.id, key: l.key, what: l.what, direction: l.direction, gating: true,
    controlArm: ABSENT_OF[comp], controlLevel: control,
    toleranceAbs: tol, toleranceForm: TOLERANCE_FORM,
    delta: d.delta, ci: [d.ciLo, d.ciHi], halfWidth: d.halfWidth,
    absDeltaOverHalfWidth: d.absDeltaOverHalfWidth,
    resolved: d.resolved, beyondTolerance: beyond, breach: d.resolved && beyond,
    looFlipsDown: d.looFlipsDown, looFlipsUp: d.looFlipsUp,
  };
});
const GUARD_TABLE = Object.fromEntries(COMPOSITIONS.map((c) => [c, guardRowFor(c)])) as
  Record<Composition, ReturnType<typeof guardRowFor>>;
/** ⭐ G11 — THE OFFSIDE LIMB in the #157 FLAG form: a RESOLVED INCREASE raises a FLAG and flips
 *  NO gate. Stored per composition; it enters neither `breach` nor any read. */
const OFFSIDE_ROWS = Object.fromEntries(COMPOSITIONS.map((comp) => {
  const d = delta('guard.offsidesPerMatch', comp);
  const control = face('guard.offsidesPerMatch', ABSENT_OF[comp]).value;
  return [comp, {
    id: 'G11', key: 'guard.offsidesPerMatch', controlLevel: control,
    delta: d.delta, ci: [d.ciLo, d.ciHi], halfWidth: d.halfWidth,
    resolved: d.resolved, flag: d.resolved && d.delta > 0, gating: false,
  }];
})) as Record<Composition, { id: string; key: string; controlLevel: number; delta: number;
  ci: number[]; halfWidth: number; resolved: boolean; flag: boolean; gating: boolean }>;

/** ⭐⭐⭐ THE SELECTOR BOOLEANS, STORED PER COMPOSITION. */
const selectorFor = (comp: Composition) => {
  const r1 = delta('r1.catchMaxOverOneMetreShare', comp);
  const g8 = delta('guard.timeToDistributionTicks', comp);
  const breaches = GUARD_TABLE[comp].filter((g) => g.breach);
  return {
    composition: comp, absentArm: ABSENT_OF[comp], armedArm: ARMED_OF[comp],
    r1AbsentValue: r1.absentValue, r1ArmedValue: r1.armedValue,
    r1Delta: r1.delta, r1Ci: [r1.ciLo, r1.ciHi], r1HalfWidth: r1.halfWidth,
    r1AbsDeltaOverHalfWidth: r1.absDeltaOverHalfWidth,
    r1Resolved: r1.resolved, r1Down: r1.down, r1Up: r1.up,
    r1LooFlipsDown: r1.looFlipsDown, r1LooFlipsUp: r1.looFlipsUp,
    g8Delta: g8.delta, g8Ci: [g8.ciLo, g8.ciHi], g8Resolved: g8.resolved,
    breach: breaches.length > 0,
    breachingGuards: breaches.map((g) => `${g.id} ${g.key}`),
    offsideFlag: OFFSIDE_ROWS[comp].flag,
  };
};
const SELECTORS = Object.fromEntries(COMPOSITIONS.map((c) => [c, selectorFor(c)])) as
  Record<Composition, ReturnType<typeof selectorFor>>;

/** ⭐⭐⭐ THE FROZEN READ LITERALS — copied VERBATIM from COMMANDER RULING #401 item 3(v), and
 *  NOT interpolated: the breaching guards and the dominant pocket class are STORED FIELDS
 *  printed on their OWN annotation lines. */
const READ_LITERALS = {
  read1: 'THE BODY GOES TO THE BALL AND THE CAUGHT BALL STOPS JUMPING — GK-ENTRY is named: '
    + 'world 15 = world 14 + the dive door.',
  read2: 'THE JUMP IS GONE BUT A GUARD BREAKS — the guard is named; the commander decides with '
    + 'the table.',
  read3: 'THE LAW DOES NOT REACH THE EYE — the seam stays dormant; the commander decides with '
    + 'the table.',
} as const;
const POCKET_LITERALS = {
  holds: 'THE POCKET IS RESTART PLACEMENT (H-GK-2 holds).',
  refuted: 'THE POCKET IS A WRITE IN PLAY — the dominant class is named.',
} as const;
const readWordFor = (comp: Composition): 'read1' | 'read2' | 'read3' => {
  const s = SELECTORS[comp];
  return s.r1Down && !s.breach ? 'read1' : s.r1Down ? 'read2' : 'read3';
};
const READ_WORDS = Object.fromEntries(COMPOSITIONS.map((c) => [c, readWordFor(c)])) as
  Record<Composition, 'read1' | 'read2' | 'read3'>;
const READ_SELECTED = READ_WORDS.E13;
const READ_SENTENCE = READ_LITERALS[READ_SELECTED];
const BREACH_NAMED = SELECTORS.E13.breachingGuards.join(' · ');

/** ⭐⭐⭐ THE POCKET — H-GK-2, read on ABSENT-E13 (the shipped path). */
const pocketRows = (() => {
  const armK = ABSENT_OF.E13;
  const rows = armRows(armK);
  const den = sum(rows.map((r) => r.keeperSaveWindowResidual));
  const num = sum(rows.map((r) => r.keeperSaveWindowResidualRestart));
  const share = ratio(num, den);
  const ranking: [string, number][] = KEEPER_CLASSES
    .map((c): [string, number] => [c as string,
      sum(rows.map((r) => r.keeperSaveWindowResidualByClass[KCI(c)]))])
    .sort((a, b) => (b[1] - a[1]) || (a[0] < b[0] ? -1 : 1));
  const holds = Number.isFinite(share) && share > 0.5;
  return {
    arm: armK, numerator: num, denominator: den, share,
    pocketIsRestartPlacement: holds,
    classRanking: ranking, dominantClass: ranking[0][0], dominantClassCount: ranking[0][1],
    sentence: holds ? POCKET_LITERALS.holds : POCKET_LITERALS.refuted,
    crowdedShareOfPocket: ratio(sum(rows.map((r) => r.keeperSaveWindowResidualCrowded)), den),
  };
})();

/** ⭐⭐ `armedAddsNoResidualWrites` — THE PAIRED COUNT COMPARISON in the SAVE WINDOW, per
 *  composition: the ARMED arm's save-window residual-written keeper ticks against the ABSENT
 *  arm's, with the paired Δ of the per-match rate beside. The law integrates the body; it must
 *  add no write. */
const RESIDUAL_ADD_ROWS = Object.fromEntries(COMPOSITIONS.map((comp) => {
  const a = ABSENT_OF[comp]; const b = ARMED_OF[comp];
  const absentCount = tot(a, (r) => r.keeperSaveWindowResidual);
  const armedCount = tot(b, (r) => r.keeperSaveWindowResidual);
  const d = delta('residual.saveWindowTicksPerMatch', comp);
  const absentAll = tot(a, (r) => r.keeperResidual);
  const armedAll = tot(b, (r) => r.keeperResidual);
  return [comp, {
    composition: comp, absentSaveWindowCount: absentCount, armedSaveWindowCount: armedCount,
    armedAddsNoResidualWrites: armedCount <= absentCount,
    absentAllResidualCount: absentAll, armedAllResidualCount: armedAll,
    deltaPerMatch: d.delta, ci: [d.ciLo, d.ciHi], resolved: d.resolved, up: d.up,
  }];
})) as Record<Composition, {
  composition: Composition; absentSaveWindowCount: number; armedSaveWindowCount: number;
  armedAddsNoResidualWrites: boolean; absentAllResidualCount: number;
  armedAllResidualCount: number; deltaPerMatch: number; ci: number[];
  resolved: boolean; up: boolean;
}>;

/** ⭐⭐ LOO — SCOPED to the READ-BEARING rows only: R1 per composition and G8 per composition.
 *  ⚠ A RECEIPT: it gates no direction, and the doc's LOO sentence is scoped to these rows. */
const LOO_ROWS = COMPOSITIONS.flatMap((comp) => ['r1.catchMaxOverOneMetreShare',
  'guard.timeToDistributionTicks'].map((k) => {
  const d = delta(k, comp);
  return {
    face: k, composition: comp, delta: d.delta, ci: [d.ciLo, d.ciHi],
    looMaxInfluenceShare: d.looMaxInfluenceShare,
    looFlipsDown: d.looFlipsDown, looFlipsUp: d.looFlipsUp, seedsDropped: cells.length,
  };
}));
const LOO_OK = LOO_ROWS.every((r) => Number.isInteger(r.looFlipsDown)
  && Number.isInteger(r.looFlipsUp));

/* ========================================================================== */
/* §14b G-REPRO-GKC0 — RE-WALK GK-C0's OWN BAND ON E13-ABSENT AND MATCH FIELD FOR FIELD */
/* ========================================================================== */
const reproDetail = (() => {
  if (!existsSync(GKC0_ARTIFACT)) {
    return { ran: false, ok: false, seeds: REPRO_SEEDS, comparedFields: [] as string[],
      rows: [] as { seed: number; mismatches: string[] }[],
      note: `the GK-C0 artifact is absent at ${GKC0_ARTIFACT}` };
  }
  const gkc0 = JSON.parse(readFileSync(GKC0_ARTIFACT, 'utf8')) as {
    perSeedCells: { seed: number; E13: Record<string, unknown> }[];
  };
  const bySeed = new Map(gkc0.perSeedCells.map((c) => [c.seed, c.E13]));
  const mineKeys = Object.keys(emptyRow());
  const firstTheirs = bySeed.get(REPRO_SEEDS[0]);
  const compared = firstTheirs === undefined ? []
    : mineKeys.filter((k) => k !== 'wallMs' && Object.prototype.hasOwnProperty.call(
      firstTheirs, k));
  const rows = REPRO_SEEDS.map((seed) => {
    const theirs = bySeed.get(seed);
    if (theirs === undefined) return { seed, mismatches: ['ABSENT FROM GK-C0'] };
    const mine = walkMatch(buildMatch(seed, 'E13-ABSENT'), 'E13-ABSENT', true) as
      unknown as Record<string, unknown>;
    const bad = compared.filter(
      (k) => JSON.stringify(mine[k]) !== JSON.stringify(theirs[k]),
    );
    return { seed, mismatches: bad };
  });
  return {
    ran: true, ok: compared.length > 0 && rows.every((r) => r.mismatches.length === 0),
    seeds: REPRO_SEEDS, comparedFields: compared, rows,
    note: '⭐⭐ E13-ABSENT re-walked on GK-C0\'s OWN CONSUMED BAND (12,551,000–011 — NOT a '
      + 'consumption) and compared FIELD FOR FIELD against GK-C0\'s stored `perSeedCells[].E13`. '
      + 'THE COMPARED SET is the INTERSECTION of this exam\'s row keys with GK-C0\'s, minus '
      + '`wallMs`: every counter this exam also computes. The RESIDUAL faces, the episode faces '
      + 'and the guard-context fields are NEW and are NOT compared; GK-C0\'s outfield population '
      + 'is not walked here and is NOT compared (§DEVIATIONS). A mismatch is RED — it would mean '
      + 'the shipped OFF path moved between GK-C0\'s head and this one.',
  };
})();
const REPRO_OK = reproDetail.ok;
banner(`  G-REPRO-GKC0 ${REPRO_OK ? 'GREEN' : 'RED'} `
  + `(${reproDetail.comparedFields.length} fields × ${reproDetail.rows.length} seeds)`);

/* ========================================================================== */
/* §15 THE POOLED BINS, THE BIN-DERIVED MEDIANS, AND THE SIZING                */
/* ========================================================================== */
type Pooled = {
  keeperClassTicks: number[]; keeperWrittenByClass: number[]; keeperMaxDispByClass: number[];
  keeperResidualByClass: number[]; keeperResidualMaxByClass: number[];
  keeperSaveWindowResidualByClass: number[];
  keeperDispBinsSave: number[]; keeperDispBinsOutside: number[]; keeperRatioBins: number[];
  keeperResidualBins: number[]; keeperActionTicks: number[]; keeperWrittenAction: number[];
  saveEvents: number[]; saveDistBins: number[]; catchDistBins: number[];
  goalDistBins: number[]; ballSpeedBins: number[];
  catchJumpBins: number[]; parryJumpBins: number[]; claimJumpBins: number[];
  epMaxBins: number[]; releaseClassCount: number[]; waitBins: number[];
  bodyContactBins: number[]; ownDistBins: number[]; ttdBins: number[];
};
const emptyPooled = (): Pooled => ({
  keeperClassTicks: zeros(KEEPER_CLASSES.length),
  keeperWrittenByClass: zeros(KEEPER_CLASSES.length),
  keeperMaxDispByClass: zeros(KEEPER_CLASSES.length),
  keeperResidualByClass: zeros(KEEPER_CLASSES.length),
  keeperResidualMaxByClass: zeros(KEEPER_CLASSES.length),
  keeperSaveWindowResidualByClass: zeros(KEEPER_CLASSES.length),
  keeperDispBinsSave: zeros(DISP_BINS), keeperDispBinsOutside: zeros(DISP_BINS),
  keeperRatioBins: zeros(RATIO_BINS), keeperResidualBins: zeros(RESIDUAL_BINS),
  keeperActionTicks: zeros(ACTION_CELLS.length), keeperWrittenAction: zeros(ACTION_CELLS.length),
  saveEvents: zeros(SAVE_KINDS.length), saveDistBins: zeros(SAVEDIST_BINS),
  catchDistBins: zeros(SAVEDIST_BINS), goalDistBins: zeros(GOALDIST_BINS),
  ballSpeedBins: zeros(BALLSPEED_BINS), catchJumpBins: zeros(BALLJUMP_BINS),
  parryJumpBins: zeros(BALLJUMP_BINS), claimJumpBins: zeros(BALLJUMP_BINS),
  epMaxBins: zeros(R1_BINS), releaseClassCount: zeros(RELEASE_CLASSES.length),
  waitBins: zeros(WAIT_BINS), bodyContactBins: zeros(BODYC_BINS),
  ownDistBins: zeros(OWNDIST_BINS), ttdBins: zeros(TTD_BINS),
});
const POOL_SUM_KEYS = ['keeperClassTicks', 'keeperWrittenByClass', 'keeperResidualByClass',
  'keeperSaveWindowResidualByClass', 'keeperDispBinsSave', 'keeperDispBinsOutside',
  'keeperRatioBins', 'keeperResidualBins', 'keeperActionTicks', 'keeperWrittenAction',
  'saveEvents', 'saveDistBins', 'catchDistBins', 'goalDistBins', 'ballSpeedBins',
  'catchJumpBins', 'parryJumpBins', 'claimJumpBins', 'epMaxBins', 'releaseClassCount',
  'waitBins', 'bodyContactBins', 'ownDistBins', 'ttdBins'] as const;
const POOL_MAX_KEYS = ['keeperMaxDispByClass', 'keeperResidualMaxByClass'] as const;
const poolFrom = (rows: readonly Row[]): Pooled => {
  const p = emptyPooled() as unknown as Record<string, number[]>;
  for (const r of rows) {
    const rr = r as unknown as Record<string, number[]>;
    for (const k of POOL_SUM_KEYS) addInto(p[k], rr[k]);
    for (const k of POOL_MAX_KEYS) maxInto(p[k], rr[k]);
  }
  return p as unknown as Pooled;
};
/** ⭐ the R1 histogram's median on the FROZEN NON-UNIFORM EDGES: the LOWER EDGE of the bin
 *  whose cumulative count first reaches n/2 (bin 0's lower edge is 0). */
const edgeMedian = (bins: readonly number[]): number => {
  const n = sum(bins);
  if (n === 0) return Number.NaN;
  let acc = 0;
  for (let i = 0; i < bins.length; i++) {
    acc += bins[i];
    if (acc * 2 >= n) return i === 0 ? 0 : R1_EDGES[i - 1];
  }
  return R1_EDGES[R1_EDGES.length - 1];
};
const mediansFrom = (p: Pooled): Record<string, unknown> => ({
  catchEpisodeMaximumMetres: edgeMedian(p.epMaxBins),
  keeperResidualMetres: binMedian(p.keeperResidualBins, RESIDUAL_BIN_M),
  keeperDisplacementInSaveWindowMetres: binMedian(p.keeperDispBinsSave, DISP_BIN_M),
  keeperDisplacementOutsideSaveWindowMetres: binMedian(p.keeperDispBinsOutside, DISP_BIN_M),
  keeperDisplacementOverCapRatio: binMedian(p.keeperRatioBins, RATIO_BIN),
  saveDistanceMetres: binMedian(p.saveDistBins, SAVEDIST_BIN_M),
  catchDistanceMetres: binMedian(p.catchDistBins, SAVEDIST_BIN_M),
  ballToGoalLineAtSaveMetres: binMedian(p.goalDistBins, GOALDIST_BIN_M),
  ballSpeedAtSaveMs: binMedian(p.ballSpeedBins, BALLSPEED_BIN),
  ballDisplacementAfterCatchMetres: binMedian(p.catchJumpBins, BALLJUMP_BIN_M),
  ballDisplacementAfterParryMetres: binMedian(p.parryJumpBins, BALLJUMP_BIN_M),
  ballDisplacementAfterClaimMetres: binMedian(p.claimJumpBins, BALLJUMP_BIN_M),
  waitLengthTicks: binMedian(p.waitBins, WAIT_BIN),
  bodyToContactAtReleaseMetres: binMedian(p.bodyContactBins, BODYC_BIN_M),
  maxBallToOwnerWhileWaitingMetres: binMedian(p.ownDistBins, OWNDIST_BIN_M),
  timeToDistributionTicks: binMedian(p.ttdBins, TTD_BIN),
});
const pooled = {} as Record<Arm, Pooled>;
const medians = {} as Record<Arm, Record<string, unknown>>;
for (const armK of ARMS) {
  pooled[armK] = poolFrom(armRows(armK));
  medians[armK] = mediansFrom(pooled[armK]);
}
/** ⭐⭐ THE SIZING — the house form, off §DEV-PREFLIGHT's DISCLOSED 12-cluster scratch smoke on
 *  seeds 900,005,400–411 (six walks per seed). The realised half-widths below were READ OUT of
 *  the SMOKE ARTIFACT's own `deltas[].halfWidth` fields on the E13 pair — never re-typed from a
 *  rounded console print. ⚠ 12 clusters is a NOISY variance estimate; said before the battery.
 *  ⚠ #401 item 3(vii) says it in advance: catches run ≈ 0.5 per match, so `nRequired` will
 *  EXCEED the block. N is then THE BLOCK'S AFFORDANCE and the realised half-width / MDE at that
 *  N is published — `resolvableAtNFrozen` stores which. */
const Z975 = 1.959963984540054;
const ZSUM = 1.959963984540054 + 0.8416212335729143;
const SMOKE_N = 12;
const SIZING_INPUTS = [
  /* SMOKE_HALF_WIDTHS_BEGIN — filled from the disclosed smoke BEFORE the freeze commit */
  { face: 'r1.catchMaxOverOneMetreShare@E13', hwSmoke: 0.5769230769230769, target: 0.05 },
  { face: 'guard.timeToDistributionTicks@E13', hwSmoke: 98.88106060606061, target: 0.05 },
  /* SMOKE_HALF_WIDTHS_END */
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
    degenerate: r.hwSmoke === 0,
  };
});
const SIZING_OK = sizingRows.every((r) => Number.isFinite(r.nRequired) && r.nRequired >= 0);
/** the REALISED half-width at N, off THIS battery's own paired Δ (never the projection). */
const realisedHalfWidths = COMPOSITIONS.map((comp) => ({
  composition: comp,
  r1HalfWidth: delta('r1.catchMaxOverOneMetreShare', comp).halfWidth,
  r1Mde: delta('r1.catchMaxOverOneMetreShare', comp).halfWidth * ZSUM / Z975,
  g8HalfWidth: delta('guard.timeToDistributionTicks', comp).halfWidth,
}));

/* ========================================================================== */
/* §16 THE GATES (all liveness/receipt — NEVER direction)                      */
/* ========================================================================== */
const walkedSeeds = [...new Set(cells.map((c) => c.seed))].sort((a, b) => a - b);
const inBlock = (s: number): boolean => s >= BLOCK_BASE && s <= BLOCK_TOP;
const ALL_SCRATCH = [...LOCKSTEP_SEEDS, WORLD_PIN_SEED, FIXTURE_SEED];
const FIXTURES_OK = FIXTURES.every((f) => f.ok);
const RESIDUAL_FX_OK = FIXTURES.filter((f) => f.name.startsWith('residual.')
  || f.name.startsWith('overCap.')).every((f) => f.ok);
const PREDICATE_FX_OK = FIXTURES.filter((f) => f.name.startsWith('arrival.')
  || f.name.startsWith('carry.') || f.name.startsWith('r1Bin.')
  || f.name.startsWith('release.') || f.name.startsWith('keeperClass.')
  || f.name.startsWith('saveKind.') || f.name.startsWith('reach.')
  || f.name.startsWith('sprite.')).every((f) => f.ok);
const TWO_FRACTIONS_OK = faces.every((f) => (Number.isNaN(f.value)
  ? f.denominator === 0 : f.value === f.numerator / f.denominator));
const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: ARMS.every((armK) => allRows(armK).every((r) => r.worldOk && r.lnAsDue && r.gkFlagAsDue
      && r.edsChoiceOn && r.seamsAbsent && r.genomeClean)) && WORLD_PIN_OK,
    note: '⭐⭐ PER ARM, on EVERY walked match and the construction receipt: '
      + `\`bqArmedVersion(m) === ${BQ_WORLD_VERSION}\` with \`bqCushion\` TRUE; on E14 `
      + `\`lnOwnLanePrice\` TRUE and \`lnArmedVersion(m) === ${LN_WORLD_VERSION}\`, on E13/D13 `
      + 'both ABSENT; `gkDiveBody` TRUE on every ARMED arm and FALSE on every ABSENT arm; '
      + '`edsPerceivedChoice` TRUE; every OBM / CTB / RC / BF seam ABSENT; `info.genome` clean '
      + 'of the own-lane / RC / CTB / OBM genes (canon: dose placement). Pinned again on a '
      + `CONSTRUCTED match of each of the ${ARMS.length} arms at scratch seed ${WORLD_PIN_SEED}`,
  },
  gDoseSource: {
    ok: DOSED_ARM_REACHABLE && L3_DOSE_BYTES_SHA === L3_DOSE_PIN
      && PC_DOSE_BYTES_SHA === PC_DOSE_PIN,
    note: '⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a '
      + 'self-declared field". The D13 pair takes its doses from the SHIPPED LOADERS '
      + '(`baseGenome` + `effGenome`, `info.genome` never touched — the cleanliness conjunct is '
      + 'inside `gWorld`); this gate hashes the FILE BYTES this process read and compares them '
      + `to the pinned values — a mismatch is exit 3 BEFORE any seed is walked. `
      + `\`pcDoseGuard.bytesChecked\` is ${pcDoseGuard.bytesChecked} under bare node`,
  },
  gAnchoredConstants: {
    ok: ANCHORS.every((a) => a.occurrences.length === a.want) && REACH_CONSTANTS_OK
      && SAVE_STRETCH_RECON === 1.35 && GK_HOLD_CLEARANCE === 3 && GK_CLAIM_HEIGHT === 2.55
      && GK_CONTROL_MAX_SPEED === 23 && GK_RUSH_ENVELOPE === 5 && DT === 1 / 60
      && CARRY_GK === 0.3 && CARRY_OUT === 0.85 && SPRITE_TICKS === 42 && NI_OK
      && ACTIONS.length > 0 && ACTIONS.includes('GoalkeeperSave')
      && ACTIONS.includes('GoalkeeperRush') && ACTIONS.includes('GoalkeeperPosition'),
    note: `⭐⭐ anchored extraction with line receipts, ${ANCHORS.length} sites, RE-TAKEN AT THIS `
      + 'HEAD: THE SEAM (the two `saveContact` writes with the catch write LAST in its branch '
      + 'after `giveBall`; the executor\'s ONE post-switch override with both its targets; the '
      + 'ownership sweep and its clear; the `giveBall` clear and the assignment it follows; the '
      + 'waiting branch with the ARRIVAL PREDICATE\'S OWN TWO LINES and its squared hold test; '
      + 'the held placement and the shipped carry placement; the field; the parry-window clear; '
      + 'the two lifecycle clears; the flag on the config, in the constructor and on the field) '
      + '· `gkFeet` and its three limbs, `inPenaltyBox`, and the OBSERVABLE CONSEQUENCE branch · '
      + 'G8\'s `kickBall` and `pendingPass` · the save itself and `keeperReach`\'s two formula '
      + 'lines · the ledgers · the INTEGRATION\'s two lines (why a pure step\'s residual is '
      + 'zero), `resolveOverlaps` WITH ITS POSITION PUSH, the pitch clamp, the hold clearance '
      + 'and the substitution · the keeper\'s decision surface INCLUDING `decidePlayer` · the '
      + 'renderer\'s dive · the engine constants · worlds 13 and 14 and the ZERO-count anchor '
      + `that \`gkDiveBody\` never appears in a4World.ts. EXTRACTED, never typed: \`carry\` = `
      + `${CARRY_GK} / ${CARRY_OUT} out of the ternary's own two lines; the sprite window `
      + `${SAVE_WINDOW_S} s ⇒ ${SPRITE_TICKS} ticks by ÷ DT; the four reach terms; and `
      + '`NI_FRACTION` as an EXPRESSION from CTB-T1\'s probe, cross-read from DLC-T1\'s and '
      + 'required to agree',
  },
  gResidualFixtures: {
    ok: RESIDUAL_FX_OK && overlapFx.ran,
    note: '⭐⭐⭐ THE RESIDUAL PREDICATE ON REAL BODIES: a full-speed INTEGRATED step of a shipped '
      + `\`Player\` moved him ${fxIntegratedDisp.toFixed(6)} m and its residual is EXACTLY `
      + `${fxIntegratedResidual} — NOT written; the same body's \`resetForKickoff\` `
      + `(residual ${fxResetResidual.toFixed(6)} m) IS, and so is the \`becomeSub\` placement; `
      + 'the 1 mm boundary is pinned on both sides. ⚠⚠ THE THIRD CASE, TESTED AND DECLARED: '
      + '`resolveOverlaps` at THIS head writes POSITION as well as velocity (both anchored), so '
      + 'an overlap-pushed body DOES carry a residual — measured on a scratch scene at '
      + `${overlapFx.residualA.toFixed(6)} m and ${overlapFx.residualB.toFixed(6)} m, fires = `
      + `${overlapFx.firesOnPushedBodies}, on a tick where ${overlapFx.bodiesWithZeroResidual} `
      + 'bodies carried NO residual. Ruling #401 item 3(i) expected it not to fire; it does, and '
      + 'the `crowded` PROXIMITY MARKER is published beside every residual face',
  },
  gPredicateFixtures: {
    ok: PREDICATE_FX_OK && FIXTURES_OK,
    note: `⭐⭐ ${FIXTURES.length} fixtures, EVERY predicate with a case where it FIRES and one `
      + 'where it does NOT: the ARRIVAL predicate in the waiting branch\'s OWN SQUARED FORM '
      + '(the body ON the contact can still HOLD — the abeam case); the R1 EDGE BINNER at every '
      + 'frozen edge and at the 1.0 m threshold from both sides; the RELEASE classifier at every '
      + 'branch; GK-C0\'s keeper-class ladder; the save-family reader FOLLOWING AN EDITED text; '
      + 'the reach reconstruction term by term; the sprite window as a DERIVED tick count',
  },
  gLedgerRead: {
    ok: ARMS.every((armK) => tot(armK, (r) => r.ledgerSavedFlips) > 0
      && tot(armK, (r) => sum(r.saveEvents)) > 0
      && tot(armK, (r) => r.joinFlipWithEvent) > 0
      && tot(armK, (r) => r.shotLogRows) > 0),
    note: '⭐⭐ canon, VERBATIM: "an event attribution reads the engine\'s own record when one '
      + 'exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic is written only '
      + 'where no record exists, and says so". READ FROM THE ENGINE: `shotLog[].outcome` and '
      + '`shotLog[].xg`; the `save` EVENTS\' own text; `ball.owner`, `ball.lastTouch` and '
      + '`ball.vel` for G8\'s release kick; `pendingPass` for G10; `gkHoldTimer` for G9; '
      + '`saveContact` itself; `match.phase` and `match.restartKickGid`; and `inPenaltyBox` '
      + 'CALLED for the `gkFeet` reconstruction. DECLARED RECONSTRUCTIONS, named in the doc: '
      + '`keeperReach`, the ARRIVAL predicate, the RELEASE composition (an INFERENCE from the '
      + 'state transitions) and the `backPass` limb read on the PRE-STEP `pendingPass`',
  },
  gClassesNonVacuous: {
    ok: ARMS.every((armK) => tot(armK, (r) => r.saveEvents[SKI('catch')]) > 0
      && tot(armK, (r) => r.saveEvents[SKI('parry')]) > 0
      && tot(armK, (r) => r.episodes) > 0
      && tot(armK, (r) => r.keeperTicks) > 0)
      && COMPOSITIONS.every((c) => tot(ARMED_OF[c], (r) => r.waitsCounted) > 0
        && tot(ARMED_OF[c], (r) => r.releasesCounted) > 0),
    note: '⛔ no face this exam READS is computed on an empty class. EVERY arm has CATCHES '
      + `(E13 ABSENT ${tot('E13-ABSENT', (r) => r.saveEvents[SKI('catch')])} / ARMED `
      + `${tot('E13-ARMED', (r) => r.saveEvents[SKI('catch')])}) and PARRIES (E13 ABSENT `
      + `${tot('E13-ABSENT', (r) => r.saveEvents[SKI('parry')])} / ARMED `
      + `${tot('E13-ARMED', (r) => r.saveEvents[SKI('parry')])}); every ARMED arm has WAITS `
      + `(E13 ${tot('E13-ARMED', (r) => r.waitsCounted)}) and RELEASES `
      + `(E13 ${tot('E13-ARMED', (r) => r.releasesCounted)}). ⛔ WAITS AND RELEASES ARE `
      + 'STRUCTURALLY ZERO ON EVERY ABSENT ARM — there is no contact to wait on — so the gate '
      + 'scopes them to the ARMED arms and the doc states those faces on what exists. ⚠ '
      + 'LIVENESS only — never a direction',
  },
  gCodeFactGraph: {
    ok: SEAM_SITES_COMPLETE && ROOTS_COMPLETE && ownLaneNeedleIsLive
      && !SEAM_CLOSURE.capped && !CLOSURE_SIX.capped && !CLOSURE_FIVE.capped
      && SAVECONTACT_OCC.length > 0 && GKDIVEBODY_OCC.length > 0
      && SAVECONTACT_ASSIGNS.length === 8 && FLAG_WRITES.length === 2
      && UNGATED_ASSIGNS.length === 0 && absentArmIsShippedPath,
    note: '⭐⭐ canon, VERBATIM: "…the callee list is EXTRACTED from the hashed text — every '
      + 'identifier called within the span, resolved to its definition and hashed — never '
      + `typed". THE OCCURRENCE CENSUS over ALL of \`src/**\` (${ALL_SRC_FILES.length} files): `
      + `\`saveContact\` ${SAVECONTACT_OCC.length} occurrences, of which `
      + `${SAVECONTACT_ASSIGNS.length} are ASSIGNMENTS (the GATED COUNT) and `
      + `${SAVECONTACT_READS.length} are reads or type positions; \`gkDiveBody\` `
      + `${GKDIVEBODY_OCC.length} occurrences — EVERY ONE enumerated with its file, line, text `
      + `and enclosing span. THE SEAM'S FIVE SITES resolve to spans, each hashed WHOLE with its `
      + `EXTRACTED callee list; the seam closure holds ${SEAM_CLOSURE.nodes.length} spans at `
      + `depth ${SEAM_CLOSURE.depth}, the keeper-path closure ${CLOSURE_SIX.nodes.length} at `
      + `depth ${CLOSURE_SIX.depth}, none capped. The needle \`lnOwnLane\` is LIVE on this `
      + `corpus (${OWN_LANE_ANYWHERE.length} span(s))`,
  },
  gLockstep: {
    ok: LOCKSTEP_OK,
    note: '⭐ THE INSTRUMENT INSTALLS NO WRAPPER AT ALL: observation is pure reads of public '
      + '`Match` / `Team` / `Player` / `Ball` state before and after `m.step(DT)`. Proven '
      + 'anyway — the same scratch seed walked OBSERVED and UNOBSERVED yields a BYTE-IDENTICAL '
      + `whole-match signature on all ${lockstepRows.length} arm × out-of-band-scratch walks`,
  },
  gDeterminism: {
    ok: XDET_OK,
    note: '⭐ X-DET, TWICE: each of the two out-of-band scratch seeds is walked TWICE PER ARM, '
      + 'OBSERVED both times, and both the whole-match signature AND this instrument\'s own '
      + `per-seed row bytes are identical on all ${xDetRows.length} pairs`,
  },
  gFlagHygiene: {
    ok: FLAG_HYGIENE_OK,
    note: '⭐⭐ `gkDiveBody` HAS NO GENE AND NO WORLD, so there is no ARMED-ZERO dose arm to '
      + 'hygiene-test. THE HALF THAT EXISTS IS PROVEN HERE: the flag KEY ABSENT (the shipped '
      + 'shape — `cfg.gkDiveBody ?? false`, anchored) is BYTE-IDENTICAL to the flag passed '
      + `EXPLICITLY FALSE, on all ${flagHygieneRows.length} composition × scratch-seed pairs. `
      + 'THE OTHER HALF — OFF ≡ HEAD-BEFORE-THE-SEAM — is `gRepro` below',
  },
  gBite: {
    ok: BITE_OK,
    note: '⭐⭐⭐ G-BITE, THE LIVENESS RECEIPT: on EVERY battery seed with at least one CATCH on '
      + 'either arm of a composition, the ABSENT and ARMED whole-match signatures DIFFER — the '
      + `flag is not a no-op. ${biteRows.map((b) => `${b.composition} `
        + `${b.seedsDiffering}/${b.seedsWithACatch}`).join(' · ')}. ⚠ LIVENESS only: a `
      + 'differing signature says the law fired, never that it helped',
  },
  gRepro: {
    ok: REPRO_OK,
    note: `⭐⭐⭐ G-REPRO-GKC0: ${reproDetail.comparedFields.length} fields × `
      + `${reproDetail.rows.length} seeds. ${reproDetail.note}`,
  },
  gFingerprintProd: {
    ok: FP_PROD_OK,
    note: '⭐⭐ X-FP-PROD: the production fingerprint is RECOMPUTED IN THIS PROCESS by the '
      + 'shipped recipe (`new League({ seed: 1337 })`, `runHeadless` to generation + 2, sha256 '
      + `of the save JSON) and equals the literal of record ${FP_PROD_PIN}. An exam cannot move `
      + 'it — and this gate proves the tree it ran on did not',
  },
  gSrcUntouched: {
    ok: gitOut('git diff --stat HEAD -- src') === ''
      && gitOut('git status --porcelain -- src') === ''
      && gitOut('git diff --stat HEAD -- tests') === ''
      && gitOut('git status --porcelain -- tests') === '',
    note: 'worktree-vs-HEAD over `src/` AND `tests/`: `git diff --stat HEAD -- <dir>` AND '
      + '`git status --porcelain -- <dir>` all EMPTY (canon: xSrcUntouched) — X-SRC-ZERO',
  },
  gSeedsBookedEqualWalked: {
    ok: !IS_OVERRIDE
      ? (walkedSeeds.length === N_FROZEN && walkedSeeds.every(inBlock) && inBlock(RECEIPT_SEED)
        && walksBooked === (N_FROZEN + 1) * ARMS.length
        && ALL_SCRATCH.every((s) => s >= 900_000_000)
        && REPRO_SEEDS.every((s) => s >= 12_551_000 && s <= 12_551_999))
      : (walkedSeeds.length === N && walksBooked === (N + 1) * ARMS.length
        && ALL_SCRATCH.every((s) => s >= 900_000_000)),
    note: 'BOOKED = WALKED, derived from the CELLS\' OWN distinct seeds: every battery seed and '
      + 'the construction receipt lie inside block 12,552,000–999, each seed is walked ONCE PER '
      + `ARM (${ARMS.length} arms ⇒ ${walksBooked} walks booked), the unwalked tail is DECLARED `
      + 'in the `seeds` block, EVERY scratch seed this instrument walks is out-of-band '
      + '(≥ 900,000,000) and STORED there, and G-REPRO-GKC0\'s RE-WALKS lie inside GK-C0\'s OWN '
      + 'CONSUMED BAND 12,551,000–999 — canon, VERBATIM: "verifier scratch walks use the '
      + 'stage\'s own consumed band or the out-of-band scratch range (≥ 900,000,000) — never the '
      + 'next virgin block"',
  },
  gSeedDisjoint: {
    ok: ALL_SCRATCH.every((s) => s >= 900_000_000) && (IS_OVERRIDE
      ? walkedSeeds.every((s) => s >= 900_000_000)
      : (walkedSeeds.every((s) => s >= 12_552_000 && s <= 12_552_999)
        && walkedSeeds[0] === BLOCK_BASE && RECEIPT_SEED === BLOCK_TOP)),
    note: 'SEED-DISJOINT at the frontier of #401 item 6 (next sim ≥ 12,552,000): every battery '
      + 'seed is inside THIS block and disjoint from every consumed block (LN-C0 '
      + '12,544,000–999 · LN-T1 …545 · LN-C1 …546 · LN-C2 …547 · LN-C3 …548 · LN-T1′ …549 · '
      + 'LN-T1′b 12,550,000–999 · GK-C0 12,551,000–999); ZERO stats consumed',
  },
  gN: {
    ok: SIZING_OK && (!IS_OVERRIDE
      ? (cells.length === N_FROZEN && OVERRIDE_REASONS.length === 0)
      : (cells.length === N && !isCanonical(OUT_BASE) && OVERRIDE_REASONS.length > 0)),
    note: IS_OVERRIDE
      ? 'THE OVERRIDE ARM: the override is DECLARED, the walked n equals the n it declared, and '
        + 'the artifact sits OFF every canonical path'
      : `THE FROZEN ARM: no override env at all, and the battery ran at exactly N_FROZEN = ${
        N_FROZEN} seeds × ${ARMS.length} arms. N was NOT sized by the smoke: at a DECLARED 0.05 `
        + 'half-width on R1\'s paired Δ the smoke asks for more seeds than the block holds '
        + '(`sizing.rows[].nRequired` vs `blockAffords`, `resolvableAtNFrozen` false), exactly '
        + 'as #401 item 3(vii) predicted — so N IS THE BLOCK\'S AFFORDANCE after the '
        + 'construction receipt and the REALISED half-width / MDE at that N is published',
  },
  gLoo: {
    ok: LOO_OK,
    note: `⭐ LEAVE-ONE-CLUSTER-OUT, SCOPED to the READ-BEARING rows only (${LOO_ROWS.length} `
      + 'rows: R1 and G8 on each composition): drop each seed, re-derive the paired Δ, and count '
      + 'a FLIP when the conservative point shift would move the interval across zero. ⚠ A '
      + 'RECEIPT — it gates no direction, and the doc\'s LOO sentence is scoped to these rows',
  },
  gTwoFractions: {
    ok: TWO_FRACTIONS_OK,
    note: 'EVERY published face carries its own NUMERATOR and DENOMINATOR and its value is '
      + `exactly their ratio (or NaN on an empty denominator): ${faces.length} face rows over `
      + `${FACE_KEYS.length} keys × ${ARMS.length} arms`,
  },
};

/* ========================================================================== */
/* §17 THE ARTIFACT — COMPACT JSON (canon: "an artifact is written as compact JSON")          */
/* ========================================================================== */
const perSeedCells = cells.map((c) => ({
  seed: c.seed, ...Object.fromEntries(ARMS.map((armK) => [armK, c.rows[armK]])),
}));
const BODY_SCHEMA = [
  'stage', 'gates', 'allGreen', 'faces', 'deltas', 'guards', 'offsides', 'reads', 'pocket',
  'residualAdds', 'medians', 'bins', 'definitions', 'arms', 'keeperClasses', 'releaseClasses',
  'saveKinds', 'actions', 'codeFacts', 'renderFacts', 'doseSource', 'worldPin', 'seeds',
  'stats', 'anchoredSites', 'fixtures', 'lockstep', 'determinism', 'flagHygiene', 'bite',
  'repro', 'fingerprintProd', 'loo', 'perf', 'sizing', 'perSeedCells', 'constructionReceipt',
] as const;

const artifact: Record<string, unknown> = {
  stage: {
    id: 'GK-T1',
    title: '「身体跟着手走 · 考试」 THE DIVE EXAM — ABSENT vs ARMED (`gkDiveBody`), PAIRED on '
      + 'shared seeds, on THREE compositions (E13 empty-book the read of record · D13 dosed · '
      + 'E14 world-14 empty-book beside): R1 = the share of catches whose MAXIMUM per-tick ball '
      + 'displacement over the owned-caught episode exceeds 1.0 m; the seam\'s own faces (the '
      + 'release composition, the wait length, the body↔contact at release, the max ball↔owner '
      + 'while waiting, the `gkFeet` exposure, the claims, the keeper\'s RESIDUAL-written ticks '
      + 'and the save-window pocket); eleven guards led by G8 TIME-TO-DISTRIBUTION, the cost',
    doc: 'docs/world-model/GK-T1-DIVE-EXAM.md',
    examFormOfRecord: 'docs/world-model/LN-T1PB-OWN-LANE-EXAM-RERUN.md',
    walkerFormOfRecord: 'docs/world-model/GK-C0-KEEPER-JUMP-CENSUS.md',
    seamOfRecord: 'docs/world-model/GK-T0-DIVE-LAW.md',
    contract: 'docs/world-model/GK-KEEPER-BODY-CONTRACT.md',
    authorizedBy: 'COMMANDER RULING #401 item 3',
    userSentenceVerbatim: '并且门将现在仍然有的时候最后一刻突然瞬移到球的那个地方',
    kind: 'EXAM — it ARMS NOTHING in the game and SHIPS NOTHING. The flag lives only in this '
      + 'instrument\'s own match constructors. The READ SENTENCES of #401 item 3(v) are FROZEN '
      + 'LITERALS selected by STORED booleans, and they NAME GK-ENTRY (world 15 = world 14 + '
      + 'the dive door) or STOP. The commander rules.',
    xSrcZero: 'no file under `src/` or `tests/` is created or edited. The probe reads public '
      + '`Match` / `Team` / `Player` / `Ball` state before and after `match.step(DT)`. THERE IS '
      + 'NO WRAPPER — `gLockstep` proves observed ≡ unobserved byte for byte PER ARM.',
    honestLimitsPointer: '⛔ canon, VERBATIM: "a stage doc\'s HONEST LIMITS list is the ONE '
      + 'home; the artifact stores that list verbatim or stores none". THIS ARTIFACT STORES '
      + 'NONE. The list of record is docs/world-model/GK-T1-DIVE-EXAM.md §HONEST LIMITS.',
    mode: MODE ?? 'full', overrideReasons: OVERRIDE_REASONS,
    generatedAtUtc: new Date().toISOString(),
    instrument: INSTRUMENT_PATH,
    instrumentSha256: sha(readFileSync(INSTRUMENT_PATH, 'utf8')),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: Object.fromEntries(Object.keys(SRC_OF).map((p) => [p, sha(SRC_OF[p])])),
  },
  arms: ARMS.map((armK) => ({
    arm: armK, composition: COMP_OF(armK), armed: IS_ARMED(armK), label: ARM_LABEL[armK],
    construction: COMP_OF(armK) === 'D13'
      ? 'a4MatchFlags(13) as construction flags (+ `gkDiveBody: true` on the ARMED arm) then '
        + 'armA4World(m, null, 13, l3Dose, pcDose) via the SHIPPED LOADERS'
      : `a4MatchFlags(${COMP_OF(armK) === 'E14' ? 14 : 13}) as construction flags (+ `
        + '`gkDiveBody: true` on the ARMED arm) then armA4World(m, null, '
        + `${COMP_OF(armK) === 'E14' ? 14 : 13}) — the EMPTY-BOOK form`,
    gate: `bqArmedVersion(m) === ${BQ_WORLD_VERSION}; lnArmedVersion(m) `
      + `${COMP_OF(armK) === 'E14' ? '===' : '!=='} ${LN_WORLD_VERSION}; gkDiveBody `
      + `${IS_ARMED(armK)}`,
  })),
  keeperClasses: {
    vocabulary: KEEPER_CLASSES,
    precedence: 'substitution > restartPlacement > saveWindow > hold > the six named actions > '
      + 'unclassified — GK-C0\'s OWN frozen precedence, copied so the residual faces speak the '
      + 'same vocabulary and G-REPRO-GKC0 can compare field for field.',
  },
  releaseClasses: {
    vocabulary: RELEASE_CLASSES,
    precedence: 'matchEndUnreleased > substitution > restartPlacement > ownershipLoss > '
      + '(arrival | freshGain, split by the waiting branch\'s OWN squared test on the release '
      + 'tick). ⚠ AN INFERENCE FROM THE ENGINE\'S STATE, not a call-site record: the engine '
      + 'keeps no ledger of WHICH clear fired. Fixture-pinned at every branch.',
    labels: {
      arrival: 'the contact went null while the keeper still owned the ball AND his own carry '
        + 'point was INSIDE `carry` of it — the waiting branch consumed it',
      ownershipLoss: 'the contact went null and the ball\'s owner is no longer him — the sweep',
      freshGain: 'the contact went null, he still owns the ball, and his carry point was still '
        + 'OUTSIDE `carry` — the only remaining clear that runs while he owns it (`giveBall`)',
      substitution: 'his `rosterIdx` changed across the tick — `becomeSub`',
      restartPlacement: 'the engine\'s own restart state at the tick — `resetForKickoff` and '
        + 'the restart placements',
      matchEndUnreleased: 'full time arrived with the contact still held',
    },
  },
  saveKinds: SAVE_KINDS, actions: ACTION_CELLS,
  definitions: {
    r1: {
      what: '⭐⭐⭐ R1 — over every CATCH (the `catches it` event with `giveBall` to the keeper), '
        + 'the ball\'s per-tick displacement on every tick of the OWNED-CAUGHT EPISODE, its '
        + 'MAXIMUM per catch, binned on the FROZEN edges; R1 is the share of catches whose '
        + 'maximum exceeds 1.0 m.',
      episode: 'ABSENT: the CATCH TICK and the tick after (there is no contact — ruling #401 '
        + 'item 3(ii)). ARMED: the catch tick, every WAITING tick (the contact set, `caught`, '
        + 'and the keeper still the owner), the RELEASE tick and the one after. An episode ends '
        + 'early at loss of ownership or a restart — recorded as the release class.',
      edges: R1_EDGES, threshold: R1_THRESHOLD_M,
      thresholdIsAnEdge: '⭐ 1.0 m is itself a frozen edge, so R1 re-derives from the stored '
        + 'bins as the sum of the bins at index ≥ 4 — `gFaces` checks exactly that.',
      catchTickIncluded: '⚠ THE CATCH TICK IS INCLUDED ON BOTH ARMS. On that tick the ball is '
        + 'still in FLIGHT (the owned-ball placement sits at the head of `stepBall`, above '
        + '`tryKeeperSave`), and the catch branch requires `speed < 21` (anchored), so its '
        + 'displacement is bounded by 21 · DT = 0.35 m — it cannot by itself put a catch over '
        + 'the 1.0 m threshold. Stated, not assumed away.',
      asymmetry: '⚠ ARMED\'s episode is a SUPERSET of ABSENT\'s in ticks (the waiting ticks and '
        + 'the release tick). Adding ticks can only RAISE a maximum, so a DOWN reading on the '
        + 'paired Δ is CONSERVATIVE. Declared at §DEVIATIONS.',
    },
    residual: {
      what: '⭐⭐⭐ |pos_after − (pos_before + vel_after · DT)| > 1 mm — the body moved by '
        + 'something other than its own integrated velocity. It REPLACES GK-C0\'s cap predicate '
        + '(#398 item 1(i): the cap OVER-counts).',
      whyPureIntegrationIsZero: '`physicsStep` writes `pos += vel · dt` with the SAME `vel` that '
        + 'survives the step (both lines anchored), so a pure integrated step has residual '
        + 'EXACTLY 0 — fixture-pinned on a shipped `Player` at saturation.',
      overlapCaveat: '⚠⚠ `resolveOverlaps` at this head writes POSITION as well as velocity '
        + '(both anchored), so an overlap-pushed body DOES carry a residual. Ruling #401 item '
        + '3(i) expected otherwise; the fixture MEASURED it and the `crowded` proximity marker '
        + 'is published beside every residual face. §DEV-PREFLIGHT and §DEVIATIONS say so.',
      capBeside: 'GK-C0\'s cap predicate is kept BESIDE as its upper bound; both are counted.',
    },
    arrivalPredicate: '⭐⭐⭐ RECONSTRUCTED EXACTLY AS THE WAITING BRANCH WRITES IT (anchored): '
      + 'cx = owner.pos.x + owner.heading.x · carry − contact.x (same for y); the ball is HELD '
      + 'while cx² + cy² > carry². The SQUARED form is the engine\'s own — not a distance '
      + 'paraphrase. `carry` = the keeper\'s 0.3, EXTRACTED from the ternary\'s own line.',
    gkFeet: '⭐⭐ A LOCAL CONST inside `giveBall`, so it is read TWO ways: (a) THE ENGINE\'S OWN '
      + 'CONSEQUENCE — the `Dribble` action that branch sets, the only way a KEEPER leaves '
      + '`giveBall` with it — which is the FACE; (b) the GEOMETRIC RECONSTRUCTION '
      + '`restartKickGid !== gid ∧ (backPass ∨ ¬inPenaltyBox(pos, side))` with the engine\'s own '
      + '`inPenaltyBox` CALLED and `backPass` read on the PRE-STEP `pendingPass` — published as '
      + 'an AGREEMENT SHARE, never as a face that gates.',
    g8: '⭐⭐⭐ TIME-TO-DISTRIBUTION — ticks from the CATCH tick to the tick on which the keeper '
      + 'stops owning the ball WITH `ball.lastTouch` still him and the ball moving: the engine\'s '
      + 'own record of a struck release (`kickBall` sets both, anchored). Catches whose release '
      + 'never arrives before full time are COUNTED in `ttdUnresolved` and excluded from the '
      + 'mean — the denominator is published as `context.ttdResolvedShare`.',
    guardTolerance: TOLERANCE_FORM,
    niFraction: NI_FRACTION,
    niFractionSecondSource: NI_FRACTION_SECOND_SOURCE,
    spriteTicks: SPRITE_TICKS,
    spriteWindowSeconds: SAVE_WINDOW_S,
    binEdges: {
      note: '⚠ every width/count here is a STORED BIN EDGE of a histogram — never a rule and '
        + 'never a threshold. THE ONE EXCEPTION IS DECLARED: R1\'s 1.0 m IS a threshold AND an '
        + 'edge, by the ruling\'s own construction.',
      r1: { edges: R1_EDGES, bins: R1_BINS },
      displacementM: { width: DISP_BIN_M, bins: DISP_BINS },
      residualM: { width: RESIDUAL_BIN_M, bins: RESIDUAL_BINS },
      displacementOverCapRatio: { width: RATIO_BIN, bins: RATIO_BINS },
      saveDistanceM: { width: SAVEDIST_BIN_M, bins: SAVEDIST_BINS },
      ballToGoalLineM: { width: GOALDIST_BIN_M, bins: GOALDIST_BINS },
      ballSpeedMs: { width: BALLSPEED_BIN, bins: BALLSPEED_BINS },
      ballDisplacementAfterSaveM: { width: BALLJUMP_BIN_M, bins: BALLJUMP_BINS },
      waitTicks: { width: WAIT_BIN, bins: WAIT_BINS },
      bodyToContactM: { width: BODYC_BIN_M, bins: BODYC_BINS },
      maxBallToOwnerM: { width: OWNDIST_BIN_M, bins: OWNDIST_BINS },
      timeToDistributionTicks: { width: TTD_BIN, bins: TTD_BINS },
    },
    engineConstants: {
      DT, GK_CLAIM_HEIGHT, GK_HOLD_CLEARANCE, GK_CONTROL_MAX_SPEED, GK_RUSH_ENVELOPE,
      CONTROL_RADIUS, PLAYER_MIN_DIST, HALF_L,
      carryKeeperHands: CARRY_GK, carryOutfield: CARRY_OUT,
      SAVE_STRETCH: SAVE_STRETCH_RECON,
      keeperReachTerms: { base: REACH_BASE, aggression: REACH_AGGR,
        reflexMid: REACH_REFLEX_MID, reflexWeight: REACH_REFLEX_W, cat: REACH_CAT },
      residualThresholdMetres: RESIDUAL_M, EPS,
    },
  },
  codeFacts: {
    what: '⭐⭐ canon, VERBATIM: "a code-fact boolean about what a function reads or does not '
      + 'read is derived from the function\'s WHOLE text and from every callee whose return '
      + 'enters the read, each pinned by an anchored text hash — the call graph it was checked '
      + 'over is stored beside the boolean; … the callee list is EXTRACTED from the hashed text '
      + '— every identifier called within the span, resolved to its definition and hashed — '
      + 'never typed".',
    corpus: { srcFiles: ALL_SRC_FILES.length, graphDirs: GRAPH_DIRS,
      graphFiles: GRAPH_FILES.length, spans: SPANS.length },
    saveContactOccurrences: { count: SAVECONTACT_OCC.length, sites: SAVECONTACT_OCC },
    saveContactAssignments: { count: SAVECONTACT_ASSIGNS.length, sites: ASSIGN_GUARDS },
    gkDiveBodyOccurrences: { count: GKDIVEBODY_OCC.length, sites: GKDIVEBODY_OCC },
    seamSites: { complete: SEAM_SITES_COMPLETE, graph: seamGraph,
      closure: { nodes: SEAM_CLOSURE.nodes.map((s) => ({ span: spanKey(s), sha: s.sha })),
        depth: SEAM_CLOSURE.depth, capped: SEAM_CLOSURE.capped,
        externals: SEAM_CLOSURE.externals } },
    absentArmIsShippedPath,
    absentArmNote: '⭐⭐⭐ DERIVED FROM THE ENUMERATED ASSIGNMENT SITES\' OWN TEXT: exactly TWO '
      + 'assignments carry the flag `match.gkDiveBody` in their own guard (the two writes); FIVE '
      + 'carry a `saveContact !== null` guard (three lifecycle/sprite clears in `Player`, the '
      + 'sweep\'s clear inside its anchored `if` block, and the `giveBall` clear); ONE — the '
      + 'waiting branch\'s ARRIVAL consume — sits inside `if (gkHands !== null)` whose own '
      + '`gkHands` definition line carries `this.gkDiveBody`; NONE is ungated. The field\'s '
      + 'initialiser is `null`. ⇒ with the flag absent no write is reachable, the field is null '
      + 'for the whole match, and every guarded clear short-circuits: THE ABSENT ARM IS THE '
      + 'SHIPPED PATH.',
    ownLaneDoorTouchesNoKeeperPath,
    ownLaneDoorTouchesNoKeeperPathFiveRoots,
    ownLaneNote: '⭐⭐ RE-DERIVED AT THIS HEAD. GK-C0 published this boolean over FIVE roots and '
      + 'ruling #398 item 1(ii) struck it: `decidePlayer`\'s first branch routes the ball\'s '
      + 'OWNER into `decideCarrier`, and the keeper owns the ball after every catch. The boolean '
      + 'OF RECORD here is the SIX-root one (with `decidePlayer` added); the five-root value is '
      + 'stored beside as the correction\'s own receipt. E14 IS WALKED BESIDE BECAUSE OF IT.',
    ownLaneHitsSixRoots: OWN_LANE_HITS_SIX, ownLaneHitsFiveRoots: OWN_LANE_HITS_FIVE,
    ownLaneSpansAnywhere: OWN_LANE_ANYWHERE, ownLaneNeedleIsLive,
    keeperPathClosureSixRoots: { nodes: CLOSURE_SIX.nodes.map((s) => ({ span: spanKey(s),
      sha: s.sha })), depth: CLOSURE_SIX.depth, capped: CLOSURE_SIX.capped },
    keeperPathRoots: SIX_ROOTS.map((s) => ({ span: spanKey(s), sha: s.sha })),
    rootsComplete: ROOTS_COMPLETE,
  },
  renderFacts: {
    what: '⛔ A RENDER FACT — ANCHORED AND DOCUMENTED, NEVER MEASURED BY THIS SIM EXAM.',
    diveWindowSeconds: SAVE_WINDOW_S,
    kIsTimerOverWindow: 'k = `p.saveAnimTimer / 0.7` (`MatchRenderer.ts`, anchored)',
    scaleX: '1 + 0.7 · k', scaleY: '1 − 0.35 · k',
  },
  doseSource: {
    files: { [L3_DOSE_FILE]: L3_DOSE_BYTES_SHA, [PC_DOSE_FILE]: PC_DOSE_BYTES_SHA },
    pinned: { [L3_DOSE_FILE]: L3_DOSE_PIN, [PC_DOSE_FILE]: PC_DOSE_PIN },
    matchesPins: L3_DOSE_BYTES_SHA === L3_DOSE_PIN && PC_DOSE_BYTES_SHA === PC_DOSE_PIN,
    pcDoseGuardBytesChecked: pcDoseGuard.bytesChecked,
    reachable: DOSED_ARM_REACHABLE, loadError: DOSE_LOAD_ERROR,
    placement: '⭐⭐ canon: dose placement is NEVER `info.genome`. The D13 pair doses through the '
      + 'SHIPPED LOADERS (`loadL3Dose` / `loadPcDose`) into `armA4World`, which writes '
      + '`baseGenome` + `effGenome` MATCH-LOCAL COPIES; the `info.genome`-cleanliness conjunct '
      + 'is inside `gWorld` and is asserted on EVERY walked match of EVERY arm.',
  },
  worldPin: { seed: WORLD_PIN_SEED, rows: worldPin, ok: WORLD_PIN_OK },
  anchoredSites: ANCHORS, fixtures: FIXTURES,
  lockstep: lockstepRows, determinism: xDetRows, flagHygiene: flagHygieneRows,
  bite: { rows: biteRows, ok: BITE_OK },
  repro: reproDetail,
  fingerprintProd: { pinned: FP_PROD_PIN, computed: FP_PROD_GOT, ok: FP_PROD_OK,
    recipe: 'new League({ seed: 1337 }) → runHeadless to generation + 2 → sha256 of the save '
      + 'JSON (the shipped `scripts/fingerprint.ts` recipe, recomputed in-process)',
    matches: fpOut.matches },
  loo: { scope: 'R1 and G8 on each composition — the READ-BEARING rows only', rows: LOO_ROWS },
  seeds: {
    block: [BLOCK_BASE, BLOCK_TOP],
    batterySeeds: [batterySeeds[0], batterySeeds[batterySeeds.length - 1]],
    distinctWalked: walkedSeeds.length, armsPerSeed: ARMS.length,
    constructionReceiptSeed: RECEIPT_SEED, walksBooked,
    unwalkedTail: (IS_OVERRIDE
      || batterySeeds[batterySeeds.length - 1] + 1 > BLOCK_TOP - 1) ? null
      : [batterySeeds[batterySeeds.length - 1] + 1, BLOCK_TOP - 1],
    lockstepScratchSeedsWalked: LOCKSTEP_SEEDS,
    xDetScratchSeedsWalked: XDET_SEEDS,
    flagHygieneScratchSeedsWalked: LOCKSTEP_SEEDS,
    worldPinScratchSeedWalked: WORLD_PIN_SEED,
    fixtureScratchSeed: FIXTURE_SEED,
    smokeScratchBand: [SCRATCH_BASE, SCRATCH_BASE + 99],
    smokeScratchSeeds: [SCRATCH_BASE, SCRATCH_BASE + 11],
    smokeReceiptSeed: SCRATCH_BASE + 20,
    reproReWalkSeeds: [REPRO_SEEDS[0], REPRO_SEEDS[REPRO_SEEDS.length - 1]],
    reproIsNotAConsumption: 'the re-walks lie inside GK-C0\'s OWN consumed block '
      + '12,551,000–999 — canon: verifier scratch walks use the stage\'s own consumed band',
    bootstrapRngSeededFrom: BLOCK_BASE, bootstrapDraws: BOOTSTRAP,
  },
  stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 81 },
  perf: {
    batteryWallSeconds: (Date.now() - t0Wall) / 1000,
    meanWallSecondsPerMatch: ARMS.reduce(
      (a, armK) => a + armRows(armK).reduce((b, r) => b + r.wallMs, 0), 0,
    ) / 1000 / Math.max(1, cells.length * ARMS.length),
    note: '⚠ A MACHINE READING ON ONE MACHINE. The timed region is the WALK.',
  },
  sizing: {
    form: 'se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/'
      + 'se(needed))²) · MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975',
    varianceSource: 'THIS exam\'s own 12-cluster SCRATCH SMOKE (seeds 900,005,400–411, six '
      + 'walks per seed), DISCLOSED IN FULL at the doc\'s §DEV-PREFLIGHT. ⚠ 12 clusters is a '
      + 'NOISY variance estimate. N_FROZEN takes the BLOCK\'S AFFORDANCE after the construction '
      + 'receipt because the sizing asks for more than the block holds — #401 item 3(vii) said '
      + 'so in advance.',
    nFrozen: N_FROZEN, arms: ARMS.length, blockAffords: N_FROZEN, rows: sizingRows,
    realisedAtN: realisedHalfWidths,
  },
  faces,
  deltas,
  guards: {
    form: TOLERANCE_FORM,
    limbs: GUARD_LIMBS,
    order: '⭐ G8 IS PRINTED FIRST — it is the COST the ruling asks for, said before anything '
      + 'else.',
    table: GUARD_TABLE,
  },
  offsides: {
    form: '⭐ G11 in the #157 FLAG form (LN-T1′b\'s own row, anchored): a RESOLVED INCREASE '
      + 'raises a FLAG and flips NO gate. It enters neither `breach` nor any read.',
    rows: OFFSIDE_ROWS,
  },
  pocket: pocketRows,
  residualAdds: RESIDUAL_ADD_ROWS,
  medians: {
    note: '⭐ every median below is BIN-DERIVED from the stored bins, so `gFaces` re-derives each '
      + 'one off the SERIALIZED artifact.',
    values: medians,
  },
  bins: Object.fromEntries(ARMS.map((armK) => [armK, {
    catchEpisodeMaximumM: { edges: R1_EDGES, bins: R1_BINS, pooled: pooled[armK].epMaxBins },
    releaseComposition: { vocabulary: RELEASE_CLASSES,
      pooled: pooled[armK].releaseClassCount },
    waitTicks: { width: WAIT_BIN, bins: WAIT_BINS, pooled: pooled[armK].waitBins },
    bodyToContactAtReleaseM: { width: BODYC_BIN_M, bins: BODYC_BINS,
      pooled: pooled[armK].bodyContactBins },
    maxBallToOwnerWhileWaitingM: { width: OWNDIST_BIN_M, bins: OWNDIST_BINS,
      pooled: pooled[armK].ownDistBins },
    timeToDistributionTicks: { width: TTD_BIN, bins: TTD_BINS, pooled: pooled[armK].ttdBins },
    keeperResidualM: { width: RESIDUAL_BIN_M, bins: RESIDUAL_BINS,
      pooled: pooled[armK].keeperResidualBins },
    keeperResidualByClass: { vocabulary: KEEPER_CLASSES,
      pooled: pooled[armK].keeperResidualByClass },
    keeperResidualMaxByClassMetres: { vocabulary: KEEPER_CLASSES,
      pooled: pooled[armK].keeperResidualMaxByClass },
    keeperSaveWindowResidualByClass: { vocabulary: KEEPER_CLASSES,
      pooled: pooled[armK].keeperSaveWindowResidualByClass },
    keeperClassTicks: { vocabulary: KEEPER_CLASSES, pooled: pooled[armK].keeperClassTicks },
    keeperWrittenByClass: { vocabulary: KEEPER_CLASSES,
      pooled: pooled[armK].keeperWrittenByClass },
    keeperMaxDisplacementByClassMetres: { vocabulary: KEEPER_CLASSES,
      pooled: pooled[armK].keeperMaxDispByClass },
    keeperDisplacementInSaveWindowM: { width: DISP_BIN_M, bins: DISP_BINS,
      pooled: pooled[armK].keeperDispBinsSave },
    keeperDisplacementOutsideSaveWindowM: { width: DISP_BIN_M, bins: DISP_BINS,
      pooled: pooled[armK].keeperDispBinsOutside },
    keeperDisplacementOverCapRatio: { width: RATIO_BIN, bins: RATIO_BINS,
      pooled: pooled[armK].keeperRatioBins },
    keeperActionTicks: { vocabulary: ACTION_CELLS, pooled: pooled[armK].keeperActionTicks },
    keeperWrittenAction: { vocabulary: ACTION_CELLS, pooled: pooled[armK].keeperWrittenAction },
    saveKinds: { vocabulary: SAVE_KINDS, pooled: pooled[armK].saveEvents },
    saveDistanceM: { width: SAVEDIST_BIN_M, bins: SAVEDIST_BINS,
      pooled: pooled[armK].saveDistBins },
    catchDistanceM: { width: SAVEDIST_BIN_M, bins: SAVEDIST_BINS,
      pooled: pooled[armK].catchDistBins },
    ballToGoalLineAtSaveM: { width: GOALDIST_BIN_M, bins: GOALDIST_BINS,
      pooled: pooled[armK].goalDistBins },
    ballSpeedAtSaveMs: { width: BALLSPEED_BIN, bins: BALLSPEED_BINS,
      pooled: pooled[armK].ballSpeedBins },
    ballDisplacementAfterCatchM: { width: BALLJUMP_BIN_M, bins: BALLJUMP_BINS,
      pooled: pooled[armK].catchJumpBins },
    ballDisplacementAfterParryM: { width: BALLJUMP_BIN_M, bins: BALLJUMP_BINS,
      pooled: pooled[armK].parryJumpBins },
    ballDisplacementAfterClaimM: { width: BALLJUMP_BIN_M, bins: BALLJUMP_BINS,
      pooled: pooled[armK].claimJumpBins },
  }])),
  reads: {
    note: '⭐⭐ #401 item 3(v)\'s SENTENCES are FROZEN LITERALS. The selectors are STORED '
      + 'BOOLEANS per composition: `r1Down` (R1\'s paired Δ interval RESOLVED and NEGATIVE) and '
      + '`breach` (any gating guard breached). E13 IS THE READ OF RECORD; D13 and E14 carry '
      + 'AGREE booleans and their own COUNTERFACTUAL WORDS, computed by the SAME frozen rule on '
      + 'their own stored intervals. ⛔ The breaching guards and the pocket\'s dominant class are '
      + 'NEVER spliced into a literal — they are stored fields on their own annotation lines.',
    sentences: READ_LITERALS, pocketSentences: POCKET_LITERALS,
    selectors: SELECTORS, wordPerComposition: READ_WORDS,
    readOfRecordComposition: 'E13', selected: READ_SELECTED, sentence: READ_SENTENCE,
    breachNamed: BREACH_NAMED,
    breachAnnotation: `breaching guards (E13): ${BREACH_NAMED === '' ? 'none' : BREACH_NAMED}`,
    counterfactualWordForD13: READ_LITERALS[READ_WORDS.D13],
    counterfactualWordForE14: READ_LITERALS[READ_WORDS.E14],
    d13Agrees: READ_WORDS.D13 === READ_WORDS.E13,
    e14Agrees: READ_WORDS.E14 === READ_WORDS.E13,
    pocketSentence: pocketRows.sentence,
    pocketAnnotation: `dominant save-window residual class (E13-ABSENT): `
      + `${pocketRows.dominantClass} (${pocketRows.dominantClassCount} ticks)`,
    g8PrintedFirst: {
      what: '⭐ THE COST, SAID FIRST: G8\'s paired Δ on the read-of-record composition.',
      composition: 'E13', delta: SELECTORS.E13.g8Delta, ci: SELECTORS.E13.g8Ci,
      resolved: SELECTORS.E13.g8Resolved,
      controlLevel: face('guard.timeToDistributionTicks', 'E13-ABSENT').value,
    },
  },
  perSeedCells, constructionReceipt: receiptRows,
  /* provisional — RE-ASSIGNED after every gate below, so `BODY_SCHEMA` is complete when
     `gHashOrder` checks it and the hashed body carries the FINAL value */
  gates, allGreen: false,
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
  guards: { table: Record<Composition, ReturnType<typeof guardRowFor>> };
  pocket: typeof pocketRows;
  residualAdds: typeof RESIDUAL_ADD_ROWS;
  sizing: { rows: typeof sizingRows };
};
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
  const l = disk.perSeedCells.map((c) => c[dd.armedArm]);
  const r = disk.perSeedCells.map((c) => c[dd.absentArm]);
  const pl = ratio(sum(l.map((x) => def.num(x))), sum(l.map((x) => def.dn(x))));
  const pr = ratio(sum(r.map((x) => def.num(x))), sum(r.map((x) => def.dn(x))));
  faceChecks.push({
    face: `delta.${dd.key}`,
    ok: sameNum(pl, dd.armedValue) && sameNum(pr, dd.absentValue) && sameNum(pl - pr, dd.delta),
  });
}
const binChecks: { bin: string; ok: boolean }[] = [];
const BIN_MAP: [string, keyof Pooled][] = [
  ['catchEpisodeMaximumM', 'epMaxBins'], ['releaseComposition', 'releaseClassCount'],
  ['waitTicks', 'waitBins'], ['bodyToContactAtReleaseM', 'bodyContactBins'],
  ['maxBallToOwnerWhileWaitingM', 'ownDistBins'], ['timeToDistributionTicks', 'ttdBins'],
  ['keeperResidualM', 'keeperResidualBins'], ['keeperResidualByClass', 'keeperResidualByClass'],
  ['keeperResidualMaxByClassMetres', 'keeperResidualMaxByClass'],
  ['keeperSaveWindowResidualByClass', 'keeperSaveWindowResidualByClass'],
  ['keeperClassTicks', 'keeperClassTicks'], ['keeperWrittenByClass', 'keeperWrittenByClass'],
  ['keeperMaxDisplacementByClassMetres', 'keeperMaxDispByClass'],
  ['keeperDisplacementInSaveWindowM', 'keeperDispBinsSave'],
  ['keeperDisplacementOutsideSaveWindowM', 'keeperDispBinsOutside'],
  ['keeperDisplacementOverCapRatio', 'keeperRatioBins'],
  ['keeperActionTicks', 'keeperActionTicks'], ['keeperWrittenAction', 'keeperWrittenAction'],
  ['saveKinds', 'saveEvents'], ['saveDistanceM', 'saveDistBins'],
  ['catchDistanceM', 'catchDistBins'], ['ballToGoalLineAtSaveM', 'goalDistBins'],
  ['ballSpeedAtSaveMs', 'ballSpeedBins'], ['ballDisplacementAfterCatchM', 'catchJumpBins'],
  ['ballDisplacementAfterParryM', 'parryJumpBins'],
  ['ballDisplacementAfterClaimM', 'claimJumpBins'],
];
for (const armK of ARMS) {
  const rows = disk.perSeedCells.map((c) => c[armK]);
  const got = poolFrom(rows);
  const b = disk.bins[armK];
  for (const [key, field] of BIN_MAP) {
    binChecks.push({ bin: `${armK}.${key}`,
      ok: JSON.stringify(got[field]) === JSON.stringify(b[key]?.pooled ?? []) });
  }
  binChecks.push({ bin: `${armK}.medians.allBinDerived`,
    ok: JSON.stringify(mediansFrom(got)) === JSON.stringify(disk.medians.values[armK]) });
  /* ⭐ THE PARTITIONS re-derive off disk too */
  binChecks.push({ bin: `${armK}.partition.keeperClassSumsToKeeperTicks`,
    ok: sum(got.keeperClassTicks) === sum(rows.map((r) => r.keeperTicks))
      && sum(got.keeperActionTicks) === sum(rows.map((r) => r.keeperTicks))
      && sum(got.keeperDispBinsSave) + sum(got.keeperDispBinsOutside)
        === sum(rows.map((r) => r.keeperTicks))
      && sum(got.keeperResidualBins) === sum(rows.map((r) => r.keeperTicks)) });
  binChecks.push({ bin: `${armK}.partition.residualIsInsideItsClass`,
    ok: KEEPER_CLASSES.every((c) => got.keeperResidualByClass[KCI(c)]
      <= got.keeperClassTicks[KCI(c)])
      && sum(got.keeperResidualByClass) === sum(rows.map((r) => r.keeperResidual))
      && sum(got.keeperWrittenByClass) === sum(rows.map((r) => r.keeperWritten)) });
  binChecks.push({ bin: `${armK}.partition.pocketIsInsideTheSaveWindow`,
    ok: sum(got.keeperSaveWindowResidualByClass)
      === sum(rows.map((r) => r.keeperSaveWindowResidual))
      && sum(rows.map((r) => r.keeperSaveWindowResidualRestart))
        <= sum(rows.map((r) => r.keeperSaveWindowResidual))
      && sum(rows.map((r) => r.keeperSaveWindowResidual))
        <= sum(rows.map((r) => r.keeperSaveWindowTicks)) });
  binChecks.push({ bin: `${armK}.partition.episodeBinsSumToEpisodes`,
    ok: sum(got.epMaxBins) === sum(rows.map((r) => r.episodes))
      && sum(rows.map((r) => r.episodes)) === sum(rows.map((r) => r.saveEvents[SKI('catch')]))
      && sum(got.releaseClassCount) <= sum(rows.map((r) => r.episodes))
      && sum(got.waitBins) === sum(rows.map((r) => r.waitsCounted))
      && sum(got.bodyContactBins) === sum(rows.map((r) => r.releasesCounted))
      && sum(got.ownDistBins) === sum(rows.map((r) => r.ownDistCounted))
      && sum(got.ttdBins) === sum(rows.map((r) => r.ttdCount)) });
  /* ⭐⭐ R1 RE-DERIVES FROM THE STORED BINS — the threshold IS an edge */
  binChecks.push({ bin: `${armK}.r1.thresholdShareFromTheStoredBins`,
    ok: got.epMaxBins.slice(R1_THRESHOLD_INDEX).reduce((a, x) => a + x, 0)
      === sum(rows.map((r) => r.epMaxOverThreshold)) });
  binChecks.push({ bin: `${armK}.partition.saveKindsSumToEvents`,
    ok: sum(got.saveEvents) === sum(rows.map((r) => sum(r.saveEvents)))
      && sum(got.saveDistBins) === sum(got.saveEvents)
      && sum(got.goalDistBins) === sum(got.saveEvents)
      && sum(got.ballSpeedBins) === sum(got.saveEvents) });
}
/** ⭐⭐ THE GUARD TABLE, THE POCKET, THE RESIDUAL-ADDS AND THE READ WORDS, ALL RE-DERIVED */
for (const comp of COMPOSITIONS) {
  const armedRows = disk.perSeedCells.map((c) => c[ARMED_OF[comp]]);
  const absentRows = disk.perSeedCells.map((c) => c[ABSENT_OF[comp]]);
  const stored = disk.guards.table[comp];
  const guardOk = stored.every((g) => {
    const def = FACES[g.key];
    const control = ratio(sum(absentRows.map((r) => def.num(r))),
      sum(absentRows.map((r) => def.dn(r))));
    const armedV = ratio(sum(armedRows.map((r) => def.num(r))),
      sum(armedRows.map((r) => def.dn(r))));
    const tol = NI_FRACTION * Math.abs(control);
    const d = armedV - control;
    const beyond = g.direction === 'ceiling' ? d > tol
      : g.direction === 'floor' ? d < -tol : Math.abs(d) > tol;
    return sameNum(control, g.controlLevel) && sameNum(tol, g.toleranceAbs)
      && sameNum(d, g.delta) && beyond === g.beyondTolerance
      && g.breach === (g.resolved && beyond);
  });
  binChecks.push({ bin: `guards.${comp}.rederive`, ok: guardOk });
  const s = SELECTORS[comp];
  const word = s.r1Down && !s.breach ? 'read1' : s.r1Down ? 'read2' : 'read3';
  binChecks.push({ bin: `reads.${comp}.wordFollowsTheFrozenRule`,
    ok: word === (disk.reads.wordPerComposition as Record<string, string>)[comp]
      && s.breach === stored.some((g) => g.breach) });
  const ra = disk.residualAdds[comp];
  binChecks.push({ bin: `residualAdds.${comp}.rederive`,
    ok: ra.absentSaveWindowCount
        === sum(absentRows.map((r) => r.keeperSaveWindowResidual))
      && ra.armedSaveWindowCount === sum(armedRows.map((r) => r.keeperSaveWindowResidual))
      && ra.armedAddsNoResidualWrites === (ra.armedSaveWindowCount <= ra.absentSaveWindowCount) });
}
{
  const rows = disk.perSeedCells.map((c) => c[ABSENT_OF.E13]);
  const den = sum(rows.map((r) => r.keeperSaveWindowResidual));
  const num = sum(rows.map((r) => r.keeperSaveWindowResidualRestart));
  const share = ratio(num, den);
  const holds = Number.isFinite(share) && share > 0.5;
  const ranking: [string, number][] = KEEPER_CLASSES.map((c): [string, number] => [
    c as string, sum(rows.map((r) => r.keeperSaveWindowResidualByClass[KCI(c)])),
  ]).sort((a, b) => (b[1] - a[1]) || (a[0] < b[0] ? -1 : 1));
  binChecks.push({ bin: 'pocket.rederivesOffDisk',
    ok: num === disk.pocket.numerator && den === disk.pocket.denominator
      && sameNum(share, disk.pocket.share)
      && holds === disk.pocket.pocketIsRestartPlacement
      && ranking[0][0] === disk.pocket.dominantClass
      && ranking[0][1] === disk.pocket.dominantClassCount
      && disk.pocket.sentence === (holds ? POCKET_LITERALS.holds : POCKET_LITERALS.refuted) });
}
{
  const r = disk.reads as Record<string, unknown>;
  const w = r.wordPerComposition as Record<Composition, 'read1' | 'read2' | 'read3'>;
  binChecks.push({ bin: 'reads.sentenceIsTheFrozenLiteral',
    ok: r.selected === w.E13 && r.sentence === READ_LITERALS[w.E13]
      && (Object.values(READ_LITERALS) as string[]).includes(r.sentence as string)
      && r.counterfactualWordForD13 === READ_LITERALS[w.D13]
      && r.counterfactualWordForE14 === READ_LITERALS[w.E14]
      && r.d13Agrees === (w.D13 === w.E13) && r.e14Agrees === (w.E14 === w.E13)
      && (Object.values(POCKET_LITERALS) as string[]).includes(r.pocketSentence as string) });
}
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
      && (nReq <= N_FROZEN) === r.resolvableAtNFrozen
      && (r.hwSmoke === 0) === r.degenerate,
  });
}
const FACES_OK = faceChecks.every((f) => f.ok) && binChecks.every((b) => b.ok);
gates.gFaces = {
  ok: FACES_OK,
  note: `${faceChecks.filter((f) => f.ok).length}/${faceChecks.length} face-and-Δ checks and `
    + `${binChecks.filter((b) => b.ok).length}/${binChecks.length} stored-bin / median / `
    + 'partition / GUARD / POCKET / RESIDUAL-ADD / READ-WORD / sizing checks re-derived from the '
    + 'SERIALIZED artifact off disk — canon, VERBATIM: "the re-derivation gate covers EVERY '
    + 'published face; a percentile face requires stored bins". ⭐ R1 is checked TWICE: as a '
    + 'face from the per-seed numerators AND as the sum of the stored bins at index ≥ 4, because '
    + 'its 1.0 m threshold IS one of the frozen edges',
};
gates.gReadWords = {
  ok: binChecks.filter((b) => b.bin.startsWith('reads.') || b.bin.startsWith('pocket.'))
    .every((b) => b.ok),
  note: '⭐⭐ THE READ WORDS ARE STORED, NOT TYPED: the selector booleans per composition, the '
    + 'selected read, the printed sentence, the two COUNTERFACTUAL WORDS (D13 and E14, by the '
    + 'SAME frozen rule on their own stored intervals), the two agree booleans and the POCKET '
    + 'sentence with its dominant class are RE-DERIVED by applying the FROZEN rules to the '
    + 'SERIALIZED per-seed cells off disk, and every printed sentence must be one of the frozen '
    + 'literals. canon, VERBATIM: "a universal sentence about a table (\'every bin\', \'the one '
    + 'bin\') is a stored boolean or is not written"',
};
artifact.gates = gates;
artifact.gFacesDetail = { faceChecks, binChecks };

/* ---- THE HASH, LAST — the house order (#372 item 3), then the NON-BODY receipt ---- */
const SCHEMA_COMPLETE = BODY_SCHEMA.every((k) => artifact[k] !== undefined)
  && (BODY_SCHEMA as readonly string[]).includes('allGreen')
  && !(BODY_SCHEMA as readonly string[]).includes('hashedBodySha256')
  && !(BODY_SCHEMA as readonly string[]).includes('gFacesDetail')
  && !(BODY_SCHEMA as readonly string[]).includes('receipts');
gates.gHashOrder = {
  ok: SCHEMA_COMPLETE,
  note: '⭐⭐ canon, VERBATIM: "the hashed body is built from an explicit ALLOWLIST SCHEMA — a '
    + 'field not in the schema never enters the body; forbidden-name lists are retired". The '
    + `${BODY_SCHEMA.length}-key schema is complete, covers the per-seed cells, the construction `
    + 'receipt, the guards, the pocket, the code facts AND `allGreen`, and EXCLUDES '
    + '`hashedBodySha256`, `gFacesDetail` and `receipts`; the body hash is computed LAST — after '
    + 'every body key is assigned — and a NON-body `receipts.hashReproducesFromFile` records '
    + 'that it reproduces from the written file',
};
gates.gStage = {
  ok: (artifact.stage as { instrument: string }).instrument === INSTRUMENT_PATH
    && (artifact.stage as { instrumentSha256: string }).instrumentSha256
      === sha(readFileSync(INSTRUMENT_PATH, 'utf8')),
  note: '⭐⭐ LN-C3 §COMMANDER CORRECTIONS: the artifact\'s `stage.instrument` is THIS '
    + `instrument's own path (${INSTRUMENT_PATH}) and \`stage.instrumentSha256\` is the sha256 `
    + 'of the RUNNING FILE re-read from disk at this line — never an inherited string',
};
artifact.gates = gates;
const ALL_GREEN_FINAL = Object.values(gates).every((g) => g.ok);
artifact.allGreen = ALL_GREEN_FINAL;
const body: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body[k] = artifact[k];
artifact.hashedBodySha256 = sha(canonicalJson(body));
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
    + 'a NON-body receipt field records that the hash reproduces from the written file". This '
    + 'block is OUTSIDE `BODY_SCHEMA` by construction.',
  hashReproducesFromFile: HASH_REPRODUCES_FROM_FILE,
  bodySchemaKeys: BODY_SCHEMA.length,
  note: '⚠ this block carries NO file byte-hash and NO byte count: both would be '
    + 'self-referential. The FINAL file byte-hash and byte count are recomputed after the final '
    + 'write and PUBLISHED IN THE DOC\'s §GATES.',
};
writeFileSync(OUT_PATH, `${JSON.stringify(artifact)}\n`);
const FINAL_BYTES = readFileSync(OUT_PATH, 'utf8');
const FINAL_FILE_SHA = sha(FINAL_BYTES);
const FINAL_ARTIFACT_BYTES = Buffer.byteLength(FINAL_BYTES, 'utf8');

/* ========================================================================== */
/* §19 THE CONSOLE READ                                                        */
/* ========================================================================== */
const f6 = (v: number): string => (Number.isFinite(v) ? v.toFixed(6) : String(v));
banner('');
banner(`GK-T1 — ${ALL_GREEN_FINAL ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to .RED'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner('--- §R1 THE PRIMARY RULER (the user\'s face) ---');
for (const comp of COMPOSITIONS) {
  const s = SELECTORS[comp];
  banner(`  ${comp}: ABSENT ${f6(s.r1AbsentValue)} → ARMED ${f6(s.r1ArmedValue)} · Δ `
    + `${f6(s.r1Delta)} [${f6(s.r1Ci[0])}, ${f6(s.r1Ci[1])}] · resolved ${s.r1Resolved} · `
    + `down ${s.r1Down} · |Δ|/hw ${f6(s.r1AbsDeltaOverHalfWidth)}`);
  banner(`    mean maximum: ABSENT `
    + `${f6(face('r1.catchMeanMaximumMetres', ABSENT_OF[comp]).value)} m → ARMED `
    + `${f6(face('r1.catchMeanMaximumMetres', ARMED_OF[comp]).value)} m · GK-C0 cap face `
    + `${f6(face('ballJump.catchShare', ABSENT_OF[comp]).value)} → `
    + `${f6(face('ballJump.catchShare', ARMED_OF[comp]).value)}`);
}
banner('');
banner('--- §R2 THE GUARDS (G8 FIRST — the cost) ---');
for (const comp of COMPOSITIONS) {
  banner(`  ${comp}:`);
  for (const g of GUARD_TABLE[comp]) {
    banner(`    ${g.id} ${g.key} control ${f6(g.controlLevel)} Δ ${f6(g.delta)} `
      + `[${f6(g.ci[0])}, ${f6(g.ci[1])}] tol ${f6(g.toleranceAbs)} ${g.direction} `
      + `resolved ${g.resolved} breach ${g.breach}`);
  }
  banner(`    G11 offsides FLAG ${OFFSIDE_ROWS[comp].flag} (Δ `
    + `${f6(OFFSIDE_ROWS[comp].delta)}, gates nothing)`);
}
banner('');
banner('--- §R3 THE SEAM\'S OWN FACES ---');
for (const comp of COMPOSITIONS) {
  const a = ARMED_OF[comp];
  banner(`  ${comp} ARMED: releases ${RELEASE_CLASSES.map((c) => `${c} `
    + `${face(`release.${c}`, a).numerator}`).join(' · ')}`);
  banner(`    wait mean ${f6(face('wait.meanTicks', a).value)} ticks · > ${SPRITE_TICKS} `
    + `${f6(face('wait.overSpriteShare', a).value)} · body↔contact at release `
    + `${f6(face('release.bodyContactMeanMetres', a).value)} m · body inside carry `
    + `${f6(face('release.bodyInsideCarryShare', a).value)}`);
  banner(`    max ball↔owner while waiting mean `
    + `${f6(face('wait.maxBallOwnerMeanMetres', a).value)} m · gkFeet catches/match ABSENT `
    + `${f6(face('gkFeet.catchesPerMatch', ABSENT_OF[comp]).value)} / ARMED `
    + `${f6(face('gkFeet.catchesPerMatch', a).value)} · lost<10t `
    + `${f6(face('gkFeet.lostWithin10Share', a).value)}`);
  banner(`    residual save-window ticks ABSENT `
    + `${RESIDUAL_ADD_ROWS[comp].absentSaveWindowCount} / ARMED `
    + `${RESIDUAL_ADD_ROWS[comp].armedSaveWindowCount} · armedAddsNone `
    + `${RESIDUAL_ADD_ROWS[comp].armedAddsNoResidualWrites}`);
}
banner(`  POCKET (E13-ABSENT): ${pocketRows.numerator}/${pocketRows.denominator} = `
  + `${f6(pocketRows.share)} · holds ${pocketRows.pocketIsRestartPlacement} · dominant `
  + `${pocketRows.dominantClass}`);
banner('');
banner('--- §R4 THE CODE FACTS ---');
banner(`  saveContact ${SAVECONTACT_OCC.length} occurrences (${SAVECONTACT_ASSIGNS.length} `
  + `assignments) · gkDiveBody ${GKDIVEBODY_OCC.length} · seam closure `
  + `${SEAM_CLOSURE.nodes.length}@d${SEAM_CLOSURE.depth}`);
banner(`  absentArmIsShippedPath = ${absentArmIsShippedPath} · `
  + `ownLaneDoorTouchesNoKeeperPath = ${ownLaneDoorTouchesNoKeeperPath} (five roots: `
  + `${ownLaneDoorTouchesNoKeeperPathFiveRoots})`);
banner('');
banner('--- §R5 THE READS, PRINTED ---');
banner(`  [G8, the cost, first] Δ ${f6(SELECTORS.E13.g8Delta)} ticks `
  + `[${f6(SELECTORS.E13.g8Ci[0])}, ${f6(SELECTORS.E13.g8Ci[1])}] on a control of `
  + `${f6(face('guard.timeToDistributionTicks', 'E13-ABSENT').value)} ticks`);
banner(`  [E13, of record] ${READ_SENTENCE}`);
banner(`  ${artifact.reads !== undefined ? (artifact.reads as { breachAnnotation: string })
  .breachAnnotation : ''}`);
banner(`  ${pocketRows.sentence}`);
banner(`  ${(artifact.reads as { pocketAnnotation: string }).pocketAnnotation}`);
banner(`  [D13, counterfactual] ${READ_LITERALS[READ_WORDS.D13]}`);
banner(`  [E14, counterfactual] ${READ_LITERALS[READ_WORDS.E14]}`);
banner('');
banner(`artifact → ${OUT_PATH}`);
banner(`hashedBodySha256 = ${artifact.hashedBodySha256 as string}`);
banner(`fileByteSha256   = ${FINAL_FILE_SHA}  bytes ${FINAL_ARTIFACT_BYTES}`);
banner(`hashReproducesFromFile = ${HASH_REPRODUCES_FROM_FILE}`);
banner(`instrumentSha256 = ${(artifact.stage as { instrumentSha256: string }).instrumentSha256}`);
banner(`wall ${((Date.now() - t0Wall) / 1000).toFixed(2)} s  meanWallSecondsPerMatch `
  + `${((artifact.perf as { meanWallSecondsPerMatch: number }).meanWallSecondsPerMatch)
    .toFixed(6)}`);
if (!ALL_GREEN_FINAL) process.exit(1);
