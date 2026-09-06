/**
 * ⭐⭐ GK-C0 — 「门将瞬移」 THE KEEPER-JUMP CENSUS
 * (docs/world-model/GK-C0-KEEPER-JUMP-CENSUS.md).
 *
 * Authorized by COMMANDER RULING #397 item 5. Lineage: LN-C0 (the census form of record —
 * the run envelope, the arms, the cluster bootstrap, the frozen bins, the hash order, the
 * gate set) → LN-C3 / LN-T1′b (§COMMANDER CORRECTIONS: the stage block is THIS instrument's
 * path and the RUNNING file's hash; the call graph EXTRACTED, never declared; no false
 * universal; a predicate written so it can actually FIRE) → this census.
 *
 * THE USER'S SENTENCE (#396, verbatim): 「并且门将现在仍然有的时候最后一刻突然瞬移到球的那个地方」.
 * THREE STORIES, ONE CENSUS. (a) the keeper's BODY is written — a per-tick displacement larger
 * than his own integration cap `topSpeed · DT`; (b) the BALL jumps — a catch resolves at up to
 * `keeperReach × SAVE_STRETCH` from the body and the carry law snaps the owned ball to his feet
 * on the next tick; (c) neither jumps in the sim — the renderer's dive stretch is what the eye
 * reads. MEASURE ALL THREE; NAME WHICH.
 *
 * ⛔ THIS IS A CENSUS. It publishes MEASUREMENTS. It scores no hypothesis, arms nothing and
 * ships nothing. The READ SENTENCES are FROZEN LITERALS selected by STORED booleans.
 * ⛔ X-SRC-ZERO: no file under `src/` or `tests/` is created or edited. The probe reads public
 * `Match` / `Team` / `Player` / `Ball` state before and after `match.step(DT)`. THERE IS NO
 * WRAPPER — `gLockstep` proves observed ≡ unobserved byte for byte, PER ARM.
 * ⛔ WORLD 13 IS THE BASE, UNTOUCHED. World 14 is NOT walked (the own-lane door touches no
 * keeper path — a CODE FACT over the EXTRACTED call graph, `codeFacts.ownLaneDoorAbsent`).
 *
 * ⭐ canon, VERBATIM: "an event attribution reads the engine's own record when one exists
 * (`shotLog`, the contest episodes, `lastTouch`); a heuristic is written only where no record
 * exists, and says so" (home: RC-T1B-READY-EXAM.md §COMMANDER CORRECTIONS item 5, #381 item 3).
 * ⇒ EVERY SAVE is joined to `match.shotLog`'s own `outcome` flip to 'saved' AND to the engine's
 * own event text (`catches it` / `parries!`). `keeperReach` is module-private: it is a DECLARED
 * RECONSTRUCTION from its own anchored constants, fixture-pinned against the anchored line.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
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
/* §1 THE RUN ENVELOPE — no bypass (the LN-C0 §1 form)                         */
/* ========================================================================== */
const ENV_WHITELIST = ['GKC0_MODE', 'GKC0_N', 'GKC0_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('GKC0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`GK-C0 FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.GKC0_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('GK-C0 FATAL — GKC0_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.GKC0_N !== undefined ? Number(process.env.GKC0_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('GK-C0 FATAL — GKC0_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.GKC0_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`GKC0_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`GKC0_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`GKC0_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/gk-c0-keeper-jump-census.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/gk-c0-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('GK-C0 FATAL — an override run may never write the canonical artifact path');
  process.exit(3);
}
/** ⭐⭐ THE INSTRUMENT OF RECORD — this file's own path, used for the stage block's hash
 *  (LN-C3 §CORR: the stage block must be THIS instrument's path and the RUNNING file's hash). */
const INSTRUMENT_PATH = 'scripts/probes/gk-c0-keeper-jump-census.ts';

/* ========================================================================== */
/* §2 SMALL HELPERS (the house set, copied from LN-C0)                         */
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
   PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 1)                                */
/* ========================================================================== */
const MECH_PATH = 'src/sim/mechanics.ts';
const MATCH_PATH = 'src/sim/Match.ts';
const PLAYER_PATH = 'src/sim/Player.ts';
const CONST_PATH = 'src/sim/constants.ts';
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const EXEC_PATH = 'src/ai/actionExecutor.ts';
const RENDER_PATH = 'src/render/MatchRenderer.ts';
const A4_PATH = 'src/game/a4World.ts';
const ANCHOR_FILES = [MECH_PATH, MATCH_PATH, PLAYER_PATH, CONST_PATH, BRAIN_PATH, EXEC_PATH,
  RENDER_PATH, A4_PATH];
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

/* ---- THE SAVE ITSELF (mechanics.ts) ---- */
anchor('⭐⭐ `tryKeeperSave` — THE SAVE PATH, the function this census censuses', MECH_PATH,
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
anchor('⭐⭐ the reach READ at the save site', MECH_PATH,
  '  const reach = keeperReach(defTeam, gk);', 1);
anchor('⭐⭐ `dNow` — the engine\'s OWN ball↔keeper distance at the save', MECH_PATH,
  '  const dNow = dist(gk.pos, ball.pos);', 1);
anchor('⭐⭐ THE FINGERTIP BRANCH — `dNow > reach`', MECH_PATH, '  if (dNow > reach) {', 1);
anchor('⭐⭐ the stretch cap — beyond reach × SAVE_STRETCH the attempt never fires', MECH_PATH,
  '    if (dNow > reach * SAVE_STRETCH || !receding) return;', 1);
anchor('⭐⭐ `saveAnimTimer = 0.7` — the DIVE WINDOW opened at the save (a render clock)',
  MECH_PATH, '  gk.saveAnimTimer = 0.7; // the dive is visible whether it saves or not (27.4)',
  1, 0.7);
anchor('⭐⭐ THE CATCH BRANCH — inside reach, under 21 m/s, on an 0.8 roll', MECH_PATH,
  '    if (dNow <= reach && speed < 21 && match.rng.chance(0.8)) {', 1);
anchor('⭐⭐ THE CATCH EVENT — the engine\'s own text this census joins on', MECH_PATH,
  `      match.pushEvent('save', defSide, ${gkName} catches it${BT});`, 1);
anchor('⭐⭐ THE CATCH\'s `giveBall(gk)` — the ball changes owner; the keeper\'s `pos` is not '
  + 'touched (TWO occurrences at this indent — the catch\'s and the high-ball claim\'s — both '
  + 'ENUMERATED with their lines)', MECH_PATH, '      match.giveBall(gk);', 2);
anchor('⭐⭐ THE PARRY EVENT — the engine\'s own text', MECH_PATH,
  `      match.pushEvent('save', defSide, ${gkName} parries!${BT});`, 1);
anchor('⭐ the parry ROTATES the ball\'s velocity (a kick-like release, never a jump)',
  MECH_PATH, '      ball.vel = scale(rotate(inDir, ang), clamp(len(ball.vel) * 0.45, 7, 12));', 1);
anchor('⭐ the parry\'s kick cooldown', MECH_PATH,
  "      gk.kickCooldown = 0.6; // let the parry leave the keeper's feet", 1, 0.6);
anchor('⭐⭐ `markShotOutcome(\'saved\')` — tryKeeperSave\'s OWN ledger write (TWO occurrences: '
  + 'its own 4-space line and, as a SUBSTRING, the claim\'s deeper-indented one — both '
  + 'ENUMERATED)', MECH_PATH, "    match.markShotOutcome('saved');", 2);
anchor('⭐ the claim height gate', MECH_PATH,
  "  if (ball.z > GK_CLAIM_HEIGHT) return; // sailing over the keeper's hands", 1);
anchor('⭐ the ball speed read at the save (TWO occurrences — `tryDeflection` reads the same '
  + 'line; both ENUMERATED)', MECH_PATH, '  const speed = len(ball.vel);', 2);
/* ---- ⭐⭐ THE OTHER THREE SAVE-EVENT SITES — the census is a CENSUS, not a needle list ---- */
anchor('⭐⭐ THE HIGH-BALL CLAIM\'s save event (`tryAerial`) — a SECOND save family, joined and '
  + 'published beside', MECH_PATH,
  `      match.pushEvent('save', gk.side, ${gkName} claims the high ball${BT});`, 1);
anchor('⭐⭐ the claim\'s OWN `markShotOutcome(\'saved\')` (indented inside its shot guard)',
  MECH_PATH, "        match.markShotOutcome('saved');", 1);
anchor('⭐ the claim\'s own dive window — 0.6 s, NOT 0.7 (the renderer divides by 0.7 either '
  + 'way: a RENDER fact)', MECH_PATH, '    gk.saveAnimTimer = 0.6;', 1, 0.6);
anchor('⭐⭐ THE SMOTHER\'s save event (`trySmother`) — a THIRD save family (no `pendingShot` '
  + '⇒ no shotLog flip), published beside', MECH_PATH,
  `    match.pushEvent('save', gk.side, ${gkName} smothers at ${DOLLAR}{owner.name}'s feet!${BT});`,
  1);
anchor('⭐ the smother\'s own dive window', MECH_PATH,
  '  gk.saveAnimTimer = 0.7; // the dive at the feet is visible either way', 1, 0.7);
/* ---- THE LEDGERS (Match.ts) ---- */
anchor('⭐⭐ `ShotLogEntry` — the shot ledger\'s own row type', MATCH_PATH,
  'export interface ShotLogEntry {', 1);
anchor('⭐⭐ the ledger\'s OUTCOME field — the join key', MATCH_PATH,
  "  outcome: 'pending' | 'goal' | 'saved' | 'miss';", 1);
anchor('⭐⭐ `shotLog` — the ledger itself', MATCH_PATH, '  shotLog: ShotLogEntry[] = [];', 1);
anchor('⭐⭐ `markShotOutcome` — the ONE writer of the outcome', MATCH_PATH,
  "  markShotOutcome(outcome: 'goal' | 'saved' | 'miss'): void {", 1);
anchor('⭐⭐ its write line — FIRST OUTCOME WINS (a pending row only)', MATCH_PATH,
  "    if (entry && entry.outcome === 'pending') entry.outcome = outcome;", 1);
anchor('⭐⭐ `pushEvent` — the events ledger this census reads the save TEXT off', MATCH_PATH,
  '  pushEvent(type: EventType, side: Side | -1, text: string): void {', 1);
anchor('⭐ `simTick` — the tick index of record', MATCH_PATH,
  '  get simTick(): number { return this.stepCount; }', 1);
/* ---- THE BALL-SIDE LAWS (Match.ts) ---- */
anchor('⭐⭐ `giveBall` — the catch\'s own call: velocity zeroed, POSITION UNTOUCHED', MATCH_PATH,
  '  giveBall(p: Player): void {', 1);
anchor('⭐⭐ THE CARRY LAW — the OWNED ball is placed at owner.pos + heading·carry EVERY TICK '
  + '(carry = 0.3 in the keeper\'s hands, 0.85 for an outfield carrier)', MATCH_PATH,
  '        ball.pos.x = ball.owner.pos.x + ball.owner.heading.x * carry;', 1);
anchor('⭐⭐ the carry law\'s y line', MATCH_PATH,
  '        ball.pos.y = ball.owner.pos.y + ball.owner.heading.y * carry;', 1);
anchor('⭐ the C6 HONEST-OFFSET variant of the same placement (outfield carry only)', MATCH_PATH,
  '    ball.pos.x = owner.pos.x + dirX * carryLen + noise.x * sigma;', 1);
anchor('⭐⭐ `kickBall` — the struck ball is placed 0.9 m off the kicker', MATCH_PATH,
  '    ball.pos = add(p.pos, scale(dir, 0.9));', 1, 0.9);
anchor('⭐⭐ THE `GK_HOLD_CLEARANCE` PUSH — an OPPONENT inside 3 m of a HOLDING keeper is '
  + 'WRITTEN out to 3 m (POPULATION C\'s named class)', MATCH_PATH,
  '            o.pos = add(gk.pos, scale(dir, GK_HOLD_CLEARANCE));', 1);
anchor('⭐ the hold-clearance push\'s own box-edge clamp', MATCH_PATH,
  '            o.pos.x = -attackDir * HALF_L + attackDir * (BOX_DEPTH + 0.4);', 1);
/* ---- THE RESTART PLACEMENTS (Match.ts) — the engine's own state, never a timing heuristic -- */
anchor('⭐⭐ `resetForKickoff` CALLED for every body at the kick-off setup', MATCH_PATH,
  '        p.resetForKickoff(formationSpot(p, team, this.ball, team.side === kickSide, undefined, '
  + 'this.abandonRestDesignation === team.side));', 1);
anchor('⭐⭐ the kick-off own-half clamp, right after it', MATCH_PATH,
  '        if (lx > -1.5) p.pos.x = -1.5 * team.attackDir;', 1);
anchor('⭐⭐ the kicker\'s own placement on the centre spot', MATCH_PATH,
  '    st.pos = v2(-kicking.attackDir * 1.2, 0);', 1);
anchor('⭐⭐ `kickoffKickGid` — the engine\'s own kick-off state', MATCH_PATH,
  '    this.kickoffKickGid = st.gid;', 1);
anchor('⭐⭐ the RESTART clearance push (`stepRestart`) — bodies slid to the circle edge',
  MATCH_PATH, '        o.pos = add(r.pos, scale(dir, clearance));', 1);
anchor('⭐ the goal-kick LINE placement', MATCH_PATH,
  '          o.pos.x = (line - 0.3) * team.attackDir;', 1);
anchor('⭐ the restart ball placement', MATCH_PATH, '    ball.pos = clone(r.pos);', 1);
anchor('⭐ the awarded-restart ball placement', MATCH_PATH, '    this.ball.pos = clone(pos);', 1);
anchor('⭐ the KICK-PROTECTION clearance (after the restart hand-off)', MATCH_PATH,
  '          o.pos = add(this.ball.pos, scale(dir, kickClear));', 1);
anchor('⭐ the per-tick PITCH CLAMP', MATCH_PATH,
  '      p.pos.x = Math.max(-HALF_L + 0.3, Math.min(HALF_L - 0.3, p.pos.x));', 1);
anchor('⭐ the SENT-OFF walk to the apron', MATCH_PATH,
  '    p.pos = v2(-team.attackDir * 12, (p.side === 0 ? -1 : 1) * (HALF_W + 4));', 1);
anchor('⭐⭐ THE SUBSTITUTION placement — `becomeSub` CALLED with a touchline position',
  MATCH_PATH, '      out.becomeSub(sub, v2(out.side === 0 ? -1.2 : 1.2, HALF_W - 0.6));', 1);
/* ---- THE BODY'S OWN INTEGRATION CAP (Player.ts) ---- */
anchor('⭐⭐ `topSpeed` — THE CAP THIS CENSUS COMPARES AGAINST', PLAYER_PATH,
  '  get topSpeed(): number {', 1);
anchor('⭐⭐ its formula — baseSpeed · (0.62 + 0.38 · stamina)', PLAYER_PATH,
  '    return this.baseSpeed * (0.62 + 0.38 * this.stamina);', 1);
anchor('⭐⭐ `physicsStep`\'s CLAMP of the desired velocity to `topSpeed`', PLAYER_PATH,
  '    const max = this.topSpeed;', 1);
anchor('⭐⭐ THE INTEGRATION ITSELF — pos += vel · dt (x)', PLAYER_PATH,
  '    this.pos.x = this.pos.x + this.vel.x * dt;', 1);
anchor('⭐⭐ THE INTEGRATION ITSELF — pos += vel · dt (y)', PLAYER_PATH,
  '    this.pos.y = this.pos.y + this.vel.y * dt;', 1);
anchor('⭐⭐ `resetForKickoff` — A DIRECT `pos` WRITE (the fixture\'s TRUE case)', PLAYER_PATH,
  '  resetForKickoff(pos: V2): void {', 1);
anchor('⭐⭐ its write line', PLAYER_PATH, '    this.pos = pos;', 1);
anchor('⭐⭐ the SUBSTITUTE constructor placement — a second direct `pos` write', PLAYER_PATH,
  '    this.pos = v2(pos.x, pos.y);', 1);
anchor('⭐ `saveAnimTimer` — the keeper state this census classes on', PLAYER_PATH,
  '  saveAnimTimer = 0;', 1);
anchor('⭐ `gkHoldTimer`', PLAYER_PATH, '  gkHoldTimer = 0;', 1);
anchor('⭐ `gkDistributing`', PLAYER_PATH, '  gkDistributing = false;', 1);
/* ---- THE KEEPER'S DECISION SURFACE (PlayerBrain.ts / actionExecutor.ts) ---- */
anchor('⭐⭐ `decideGoalkeeper` — the keeper\'s ONE decision function', BRAIN_PATH,
  'function decideGoalkeeper(p: Player, team: Team, match: Match): void {', 1);
anchor('⭐⭐ its `GoalkeeperSave` action', BRAIN_PATH,
  "    p.action = { type: 'GoalkeeperSave', scores: [{ action: 'GoalkeeperSave', score: 1, "
  + "why: 'shot incoming' }] };", 1);
anchor('⭐⭐ its `GoalkeeperRush` action', BRAIN_PATH, "          type: 'GoalkeeperRush',", 1);
anchor('⭐⭐ its `GoalkeeperPosition` action (the default)', BRAIN_PATH,
  "    type: 'GoalkeeperPosition',", 1);
anchor('⭐⭐ its `ChaseBall` action', BRAIN_PATH,
  "        p.action = { type: 'ChaseBall', scores: [{ action: 'ChaseBall', score: 0.9, "
  + "why: ball.airborne ? 'attack the dropping ball' : 'claim loose ball in box' }] };", 1);
anchor('⭐⭐ its `MakeRun` action (the keeper UP for a corner)', BRAIN_PATH,
  "      type: 'MakeRun',", 1);
anchor('⭐⭐ the executor\'s `GoalkeeperSave` case — a WALK TARGET, at speedF 1', EXEC_PATH,
  "    case 'GoalkeeperSave': {", 1);
anchor('⭐⭐ its target line — the intercept point CLAMPED TO THE BOX (never a teleport)',
  EXEC_PATH, '      target = clampToBox(sol.point, team.attackDir);', 1);
anchor('⭐⭐ the executor\'s `GoalkeeperRush` case', EXEC_PATH, "    case 'GoalkeeperRush': {", 1);
anchor('⭐⭐ the executor\'s `GoalkeeperPosition` case', EXEC_PATH,
  "    case 'GoalkeeperPosition': {", 1);
/* ---- THE RENDERER'S DIVE (a RENDER fact — documented, NEVER measured by this census) ---- */
anchor('⭐⭐ THE DIVE WINDOW read — `saveAnimTimer / 0.7`', RENDER_PATH,
  '        const k = p.saveAnimTimer / 0.7;', 1, 0.7);
anchor('⭐⭐ THE DIVE STRETCH — scale(1 + 0.7k, 1 − 0.35k)', RENDER_PATH,
  '        s.body.scale.set(1 + 0.7 * k, 1 - 0.35 * k);', 1);
anchor('⭐⭐ `diveDir` — frozen at dive start, pointing AT THE BALL', RENDER_PATH,
  '          s.diveDir = Math.atan2(match.ball.pos.y - p.pos.y, match.ball.pos.x - p.pos.x);', 1);
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
/* ---- WORLD 13's composition (LN-C0's own anchors, re-pointed to THIS instrument) ---- */
anchor('⭐⭐ world 13 = world 12 + the ONE cushion door, the composer CALLING world 12', A4_PATH,
  '    return { ...a4MatchFlags(RA_WORLD_VERSION), ...BQ_WORLD_DOORS };', 1);
anchor('⭐⭐ `BQ_WORLD_DOORS` — the cushion, a body law', A4_PATH,
  'export const BQ_WORLD_DOORS = { bqCushion: true } as const;', 1);
anchor('⭐⭐ `LN_WORLD_DOORS` — WORLD 14\'s ONE own-lane door (NOT walked here)', A4_PATH,
  'export const LN_WORLD_DOORS = { lnOwnLanePrice: true } as const;', 1);
anchor('⭐⭐ `bqArmedVersion` — the world gate of record', A4_PATH,
  'export function bqArmedVersion(match: Match): 0 | BqWorldVersion {', 1);
anchor('⭐⭐ `lnArmedVersion` — the world-14 gate, asserted ABSENT on both arms', A4_PATH,
  'export function lnArmedVersion(match: Match): 0 | LnWorldVersion {', 1);

/* ========================================================================== */
/* §4 THE DECLARED RECONSTRUCTION — `keeperReach`, module-private (#397 item 5(iii))          */
/* ========================================================================== */
/** ⭐⭐ THE FOUR CONSTANTS ARE EXTRACTED FROM THE ANCHORED LINES, never typed: the numbers
 *  below are parsed out of the two anchored source lines and compared to this instrument's
 *  own literals by `gWrittenFixtures`. `keeperReach` carries no `export`, so a reconstruction
 *  is the only way to read it without a src edit (X-SRC-ZERO). */
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
/** the reconstruction itself — a PURE function of the same four inputs the engine reads. */
const keeperReachRecon = (
  keeperAggression: number, reflexes: number, isCat: boolean,
): number => REACH_BASE + keeperAggression * REACH_AGGR
  + (reflexes - REACH_REFLEX_MID) * REACH_REFLEX_W + (isCat ? REACH_CAT : 0);
const SAVE_STRETCH_RECON = 1.35;

/* ========================================================================== */
/* §5 SEEDS — block 12,551,000–999 (#397 items 5(vii) and 8)                   */
/* ========================================================================== */
const BLOCK_BASE = 12_551_000;
const BLOCK_TOP = 12_551_999;
/** ⭐⭐ N_FROZEN = 999 — the block's OWN AFFORDANCE after the construction receipt at
 *  12,551,999 (seeds 12,551,000–12,551,998). The §DEV-PREFLIGHT sizing rows are computed and
 *  stored; every sized row's `nRequired` is ≤ this N (see §DEVIATIONS in the doc: the ruling's
 *  `min(required, affordance)` is taken as the block's affordance because the affordance is
 *  the larger of the two and the rare populations — saves, catches — are sized by nothing). */
const N_FROZEN = 999;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_004_600;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + i : BLOCK_BASE + i));
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 20 : BLOCK_TOP;
const WORLD_PIN_SEED = SCRATCH_BASE + 70;
const LOCKSTEP_SEEDS = [SCRATCH_BASE + 90, SCRATCH_BASE + 91];
const XDET_SEEDS = LOCKSTEP_SEEDS;

/* ========================================================================== */
/* §6 THE ARMS — TWO, PAIRED on shared seeds; the composer CALLED, never copied */
/* ========================================================================== */
const ARMS = ['E13', 'D13'] as const;
type Arm = (typeof ARMS)[number];
const ARM_LABEL: Record<Arm, string> = {
  E13: 'world 13 EMPTY-BOOK — THE USER\'S KEPT WORLD, the read of record',
  D13: 'world 13 DOSED — the form the user plays, published BESIDE',
};
const L3_DOSE_FILE = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_DOSE_FILE = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_DOSE_PIN = 'a41a114c4727a2a6702bf4ca79b46b1d6924d80fa7fefb388d5364fd57da37db';
const PC_DOSE_PIN = '0301d7109cb0883a410a55cef9ff838dbce48d3627c418cbedd3e9e34448982f';
const L3_DOSE_BYTES_SHA = sha(readFileSync(L3_DOSE_FILE, 'utf8'));
const PC_DOSE_BYTES_SHA = sha(readFileSync(PC_DOSE_FILE, 'utf8'));
if (L3_DOSE_BYTES_SHA !== L3_DOSE_PIN || PC_DOSE_BYTES_SHA !== PC_DOSE_PIN) {
  banner('GK-C0 FATAL — a dose file\'s BYTES do not match the pinned value');
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
  banner(`GK-C0 FATAL — the DOSED arm is not reachable: ${DOSE_LOAD_ERROR ?? 'empty dose'}`);
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
/** LN-C0's own population construction per seed, so the two arms differ ONLY in the doses. */
const buildMatch = (seed: number, arm: Arm): Match => {
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(BQ_WORLD_VERSION),
  } as ConstructorParameters<typeof Match>[0]);
  if (arm === 'E13') armA4World(m, null, BQ_WORLD_VERSION);
  else armA4World(m, null, BQ_WORLD_VERSION, L3_DOSE, PC_DOSE);
  return m;
};

/* ========================================================================== */
/* §7 THE WALK-SIDE PREDICATES — PURE, fixture-backed, and each able to FIRE    */
/*    (LN-T1′b §COMMANDER CORRECTIONS 1: a predicate false by construction is a defect)        */
/* ========================================================================== */
/** ⭐⭐ THE WRITTEN PREDICATE. A tick is WRITTEN iff the body's realised per-tick displacement
 *  exceeds its OWN integration cap `topSpeed · DT` by more than the floating-point margin EPS.
 *  ⚠ `topSpeed` is read BEFORE the step: stamina only falls inside a step, so the pre-step cap
 *  is an UPPER BOUND on the cap the integrator actually used ⇒ the predicate is CONSERVATIVE
 *  (it can only UNDER-count written ticks, never over-count). DECLARED, never glossed. */
const EPS = 1e-6;
const isWritten = (disp: number, topSpeed: number): boolean => disp > topSpeed * DT * (1 + EPS);
/** ⭐⭐ THE BALL-JUMP PREDICATE — the ball's displacement on the tick AFTER a catch against the
 *  CATCHING KEEPER's own cap. Same shape, different subject: the BODY that could have carried
 *  the ball there is the keeper, so his cap is the yardstick. */
const ballJumped = (ballDisp: number, keeperTopSpeed: number): boolean =>
  ballDisp > keeperTopSpeed * DT * (1 + EPS);

/** ⭐⭐ THE KEEPER WRITTEN-TICK CLASSES, in a FROZEN PRECEDENCE. WHY THIS ORDER: an identity
 *  change (the substitution) is the one event that is not the same body at all, so it is read
 *  first; then the ENGINE'S OWN restart state (never a timing heuristic); then the two keeper
 *  states the ruling names (the dive window, the hands); then the action he actually chose,
 *  each named; anything else is COUNTED as `unclassified` — and CAN fire (any keeper action
 *  outside the six named ones lands there). */
const KEEPER_CLASSES = ['substitution', 'restartPlacement', 'saveWindow', 'hold',
  'actGoalkeeperSave', 'actGoalkeeperRush', 'actGoalkeeperPosition', 'actChaseBall',
  'actMakeRun', 'actPass', 'unclassified'] as const;
type KeeperClass = (typeof KEEPER_CLASSES)[number];
const KCI = (c: KeeperClass): number => KEEPER_CLASSES.indexOf(c);
/** the two classes the READ excludes (#397 item 5(vi)). */
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
/** ⭐⭐ THE OUTFIELD WRITTEN-TICK CLASSES (POPULATION C), same reading order: identity, then
 *  the engine's restart state, then the two named OPPONENT-DISPLACEMENT laws (the hold
 *  clearance and the kick protection), then the overlap resolver's push, then COUNTED. ⚠ The
 *  last three are PROXIMITY MARKERS read at the tick, not call-site attribution: a body inside
 *  `GK_HOLD_CLEARANCE` of a HOLDING opposing keeper is the shape the hold-clearance law
 *  displaces, and `holdClearance` says exactly that and no more. */
const BODY_CLASSES = ['substitution', 'restartPlacement', 'holdClearance', 'kickProtection',
  'overlapPush', 'unclassified'] as const;
type BodyClass = (typeof BODY_CLASSES)[number];
const BCI = (c: BodyClass): number => BODY_CLASSES.indexOf(c);
interface BodyState {
  subbed: boolean; restart: boolean; nearHoldingKeeper: boolean; kickProtected: boolean;
  crowded: boolean;
}
const bodyClassOf = (s: BodyState): BodyClass => {
  if (s.subbed) return 'substitution';
  if (s.restart) return 'restartPlacement';
  if (s.nearHoldingKeeper) return 'holdClearance';
  if (s.kickProtected) return 'kickProtection';
  if (s.crowded) return 'overlapPush';
  return 'unclassified';
};
/** ⭐⭐ THE SAVE FAMILIES — read off the engine's OWN event text, never inferred. */
const SAVE_KINDS = ['catch', 'parry', 'highBallClaim', 'smother', 'otherSaveEvent'] as const;
type SaveKind = (typeof SAVE_KINDS)[number];
const SKI = (k: SaveKind): number => SAVE_KINDS.indexOf(k);
const saveKindOf = (text: string): SaveKind => (text.endsWith(' catches it') ? 'catch'
  : text.endsWith(' parries!') ? 'parry'
    : text.endsWith(' claims the high ball') ? 'highBallClaim'
      : text.includes(' smothers at ') ? 'smother' : 'otherSaveEvent');

/* --- THE FIXTURES (canon: a headline-bearing predicate needs a composition fixture; and
   LN-T1′b §CORR 1: every predicate is stated with a case where it FIRES and one where it
   does NOT) --- */
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-9;

/** ⭐⭐ THE WRITTEN PREDICATE ON REAL, HAND-BUILT BODIES — the shipped `Player`, the shipped
 *  `physicsStep`, the shipped `resetForKickoff`. Nothing here touches a match. */
const fxAttrs: PlayerAttributes = randomSquad(new Rng(900_004_699))[0];
const fxKeeper = new Player(0, 0, 'GK', 'FX', fxAttrs);
/* drive him to saturation at full desiredVel, then measure ONE integrated step */
fxKeeper.desiredVel = v2(1000, 0);
for (let i = 0; i < 240; i++) fxKeeper.physicsStep(DT);
const fxTopBefore = fxKeeper.topSpeed;
const fxP0 = { x: fxKeeper.pos.x, y: fxKeeper.pos.y };
fxKeeper.physicsStep(DT);
const fxIntegratedDisp = Math.hypot(fxKeeper.pos.x - fxP0.x, fxKeeper.pos.y - fxP0.y);
fx('written.fullSpeedIntegratedStepIsNOTWritten',
  isWritten(fxIntegratedDisp, fxTopBefore), false);
fx('written.thatStepDidMoveTheBody', fxIntegratedDisp > 0, true);
/* the same body, RESET FOR KICKOFF — a direct `pos` write */
const fxTopBefore2 = fxKeeper.topSpeed;
const fxP1 = { x: fxKeeper.pos.x, y: fxKeeper.pos.y };
fxKeeper.resetForKickoff(v2(fxP1.x + 20, fxP1.y + 10));
const fxResetDisp = Math.hypot(fxKeeper.pos.x - fxP1.x, fxKeeper.pos.y - fxP1.y);
fx('written.resetForKickoffDisplacementISWritten', isWritten(fxResetDisp, fxTopBefore2), true);
/* the SUBSTITUTE constructor placement — the second direct write */
const fxTopBefore3 = fxKeeper.topSpeed;
const fxP2 = { x: fxKeeper.pos.x, y: fxKeeper.pos.y };
fxKeeper.becomeSub({ rosterIdx: 9, name: 'SUB', attrs: fxAttrs }, v2(fxP2.x - 15, fxP2.y - 5));
fx('written.becomeSubPlacementISWritten',
  isWritten(Math.hypot(fxKeeper.pos.x - fxP2.x, fxKeeper.pos.y - fxP2.y), fxTopBefore3), true);
/* the boundary, on arithmetic */
fx('written.exactlyAtTheCapIsNOTWritten', isWritten(7 * DT, 7), false);
fx('written.aHairOverTheCapIsWritten', isWritten(7 * DT * 1.001, 7), true);
fx('written.zeroIsNOTWritten', isWritten(0, 7), false);
fx('written.epsIsTheStatedMargin', EPS, 1e-6);
/* ⭐⭐ THE REACH RECONSTRUCTION vs THE ANCHORED FORMULA, on hand-built keepers */
fx('reach.constantsExtractedFromTheAnchoredLines', REACH_CONSTANTS_OK, true);
fx('reach.baseline', near(keeperReachRecon(0, 0.5, false), 2.05), true);
fx('reach.aggressionTerm', near(keeperReachRecon(1, 0.5, false), 2.45), true);
fx('reach.reflexTerm', near(keeperReachRecon(0, 1, false), 2.3), true);
fx('reach.catTerm', near(keeperReachRecon(0, 0.5, true), 2.17), true);
fx('reach.allFour', near(keeperReachRecon(0.8, 0.9, true), 2.05 + 0.32 + 0.2 + 0.12), true);
fx('reach.stretchIsTheAnchoredConstant', SAVE_STRETCH_RECON, 1.35);
fx('reach.maxReachOfACatAtFullAggressionAndReflexes',
  near(keeperReachRecon(1, 1, true) * SAVE_STRETCH_RECON, (2.05 + 0.4 + 0.25 + 0.12) * 1.35),
  true);
/* ⭐⭐ THE BALL-JUMP PREDICATE — a catch at 3 m fires it, a catch at the feet does not */
fx('ballJump.catchAtThreeMetresFires', ballJumped(3 - 0.3, 7), true);
fx('ballJump.catchAtTheFeetDoesNot', ballJumped(0.02, 7), false);
fx('ballJump.exactlyAtTheCapDoesNot', ballJumped(7 * DT, 7), false);
/* ⭐⭐ THE KEEPER CLASS LADDER — every branch, with a NEGATIVE beside */
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
fx('keeperClass.actGoalkeeperSave', keeperClassOf(KS({ action: 'GoalkeeperSave' })),
  'actGoalkeeperSave');
fx('keeperClass.actGoalkeeperRush', keeperClassOf(KS({ action: 'GoalkeeperRush' })),
  'actGoalkeeperRush');
fx('keeperClass.actGoalkeeperPosition', keeperClassOf(KS({})), 'actGoalkeeperPosition');
fx('keeperClass.actChaseBall', keeperClassOf(KS({ action: 'ChaseBall' })), 'actChaseBall');
fx('keeperClass.actMakeRun', keeperClassOf(KS({ action: 'MakeRun' })), 'actMakeRun');
fx('keeperClass.actPass', keeperClassOf(KS({ action: 'Pass' })), 'actPass');
fx('keeperClass.unclassifiedCANFire', keeperClassOf(KS({ action: 'ThrowOut' })), 'unclassified');
fx('keeperClass.unclassifiedIsNOTUniversal', keeperClassOf(KS({ action: 'ChaseBall' })),
  'actChaseBall');
fx('keeperClass.restartFamilyIsTheTwoNamedClasses', [...RESTART_FAMILY],
  ['restartPlacement', 'substitution']);
/* ⭐⭐ THE OUTFIELD CLASS LADDER — every branch, with a NEGATIVE beside */
const BS = (o: Partial<BodyState>): BodyState => ({
  subbed: false, restart: false, nearHoldingKeeper: false, kickProtected: false,
  crowded: false, ...o,
});
fx('bodyClass.substitutionWins', bodyClassOf(BS({ subbed: true, crowded: true })),
  'substitution');
fx('bodyClass.restartBeatsHoldClearance',
  bodyClassOf(BS({ restart: true, nearHoldingKeeper: true })), 'restartPlacement');
fx('bodyClass.holdClearance', bodyClassOf(BS({ nearHoldingKeeper: true })), 'holdClearance');
fx('bodyClass.kickProtection', bodyClassOf(BS({ kickProtected: true })), 'kickProtection');
fx('bodyClass.overlapPush', bodyClassOf(BS({ crowded: true })), 'overlapPush');
fx('bodyClass.unclassifiedCANFire', bodyClassOf(BS({})), 'unclassified');
/* ⭐⭐ THE SAVE-FAMILY READER — the ENGINE'S OWN TEXT, each of the four sites and a negative */
fx('saveKind.catch', saveKindOf('Jo catches it'), 'catch');
fx('saveKind.parry', saveKindOf('Jo parries!'), 'parry');
fx('saveKind.highBallClaim', saveKindOf('Jo claims the high ball'), 'highBallClaim');
fx('saveKind.smother', saveKindOf("Jo smothers at Al's feet!"), 'smother');
fx('saveKind.otherSaveEventCANFire', saveKindOf('Jo does something else'), 'otherSaveEvent');
fx('saveKind.editingTheTextMovesTheClass', saveKindOf('Jo parries!'.replace('parries!',
  'catches it')), 'catch');

/* ========================================================================== */
/* §8 THE FROZEN BINS AND THE PER-SEED ROW                                     */
/* ========================================================================== */
const DISP_BIN_M = 0.02; const DISP_BINS = 51;         /* 0 … 1.0+ m per tick */
const RATIO_BIN = 0.25; const RATIO_BINS = 41;         /* |Δpos| ÷ (topSpeed·DT), 0 … 10+ */
const SAVEDIST_BIN_M = 0.5; const SAVEDIST_BINS = 17;  /* ball↔keeper at the save, 0 … 8+ m */
const GOALDIST_BIN_M = 1; const GOALDIST_BINS = 21;    /* ball→goal line at the save, 0 … 20+ m */
const BALLSPEED_BIN = 2; const BALLSPEED_BINS = 21;    /* ball speed at the save, 0 … 40+ m/s */
const BALLJUMP_BIN_M = 0.25; const BALLJUMP_BINS = 25; /* ball's next-tick move, 0 … 6+ m */
/** the ACTION vocabulary — READ OFF `ActionType`'s OWN union, never re-typed. */
const TYPES_SRC = readFileSync('src/sim/types.ts', 'utf8');
const AT_START = 'export type ActionType =';
const atIdx = TYPES_SRC.indexOf(AT_START);
const ACTIONS = (TYPES_SRC.slice(atIdx, TYPES_SRC.indexOf(';', atIdx))
  .match(/'([A-Za-z]+)'/g) ?? []).map((s) => s.slice(1, -1));
const ACTION_CELLS = [...ACTIONS, 'unknown'] as const;
const AI = (a: string): number => {
  const i = ACTIONS.indexOf(a);
  return i < 0 ? ACTIONS.length : i;
};

interface Row {
  ticks: number; wallMs: number; armedVersion: number; lnVersion: number;
  worldOk: boolean; cushionOk: boolean; lnAbsent: boolean; edsChoiceOn: boolean;
  seamsAbsent: boolean; genomeClean: boolean;
  /* --- POPULATION A: EVERY KEEPER TICK --- */
  keeperTicks: number; keeperWritten: number; keeperWrittenOutsideRestarts: number;
  keeperClassTicks: number[]; keeperWrittenByClass: number[]; keeperMaxDispByClass: number[];
  keeperDispBinsSave: number[]; keeperDispBinsOutside: number[]; keeperRatioBins: number[];
  keeperSaveWindowTicks: number; keeperHoldTicks: number; keeperRestartTicks: number;
  keeperSubTicks: number; keeperActionTicks: number[]; keeperWrittenAction: number[];
  keeperWrittenCrowded: number; keeperWrittenNearHoldingOpp: number;
  keeperWrittenKickProtected: number;
  keeperDispSum: number; keeperMaxDisp: number; keeperCapSum: number;
  /* --- POPULATION B: EVERY SAVE --- */
  saveEvents: number[]; ledgerSavedFlips: number; joinFlipWithEvent: number;
  joinFlipWithoutEvent: number; joinEventWithoutFlip: number;
  saveDistSum: number; saveDistBins: number[]; catchDistBins: number[];
  reachSum: number; reachStretchSum: number; saveWithinReach: number;
  saveWithinStretch: number; saveBeyondStretch: number;
  catchGt1: number; catchGt2: number; catchGt3: number;
  goalDistBins: number[]; ballSpeedBins: number[];
  catchNext: number; catchJumps: number; catchNextDispSum: number; catchJumpBins: number[];
  parryNext: number; parryJumps: number; parryNextDispSum: number; parryJumpBins: number[];
  claimNext: number; claimJumps: number; smotherNext: number; smotherJumps: number;
  /* --- POPULATION C: ALL BODIES --- */
  outfieldTicks: number; outfieldWritten: number; outfieldClassTicks: number[];
  outfieldWrittenByClass: number[]; outfieldMaxDispByClass: number[];
  outfieldDispBins: number[]; outfieldMaxDisp: number;
  /* --- CONTEXT --- */
  goals: number; shots: number; savesStat: number;
}
const emptyRow = (): Row => ({
  ticks: 0, wallMs: 0, armedVersion: 0, lnVersion: 0,
  worldOk: false, cushionOk: false, lnAbsent: false, edsChoiceOn: false,
  seamsAbsent: false, genomeClean: false,
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
  saveEvents: zeros(SAVE_KINDS.length), ledgerSavedFlips: 0, joinFlipWithEvent: 0,
  joinFlipWithoutEvent: 0, joinEventWithoutFlip: 0,
  saveDistSum: 0, saveDistBins: zeros(SAVEDIST_BINS), catchDistBins: zeros(SAVEDIST_BINS),
  reachSum: 0, reachStretchSum: 0, saveWithinReach: 0,
  saveWithinStretch: 0, saveBeyondStretch: 0,
  catchGt1: 0, catchGt2: 0, catchGt3: 0,
  goalDistBins: zeros(GOALDIST_BINS), ballSpeedBins: zeros(BALLSPEED_BINS),
  catchNext: 0, catchJumps: 0, catchNextDispSum: 0, catchJumpBins: zeros(BALLJUMP_BINS),
  parryNext: 0, parryJumps: 0, parryNextDispSum: 0, parryJumpBins: zeros(BALLJUMP_BINS),
  claimNext: 0, claimJumps: 0, smotherNext: 0, smotherJumps: 0,
  outfieldTicks: 0, outfieldWritten: 0, outfieldClassTicks: zeros(BODY_CLASSES.length),
  outfieldWrittenByClass: zeros(BODY_CLASSES.length),
  outfieldMaxDispByClass: zeros(BODY_CLASSES.length),
  outfieldDispBins: zeros(DISP_BINS), outfieldMaxDisp: 0,
  goals: 0, shots: 0, savesStat: 0,
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

const walkMatch = (m: Match, arm: Arm, observe: boolean): Row => {
  const tStart = Date.now();
  const row = emptyRow();
  const mm = m as unknown as {
    bqCushion?: boolean; lnOwnLanePrice?: boolean; edsPerceivedChoice?: boolean;
    obmMovement?: boolean; ctbSupportPlane?: boolean; rcAnticipate?: boolean;
    rcReady?: boolean; bfFacingCost?: boolean; restartKickGid: number | null;
  };
  row.armedVersion = bqArmedVersion(m);
  row.lnVersion = lnArmedVersion(m);
  row.worldOk = row.armedVersion === BQ_WORLD_VERSION;
  row.cushionOk = mm.bqCushion === true;
  row.lnAbsent = mm.lnOwnLanePrice !== true && row.lnVersion !== LN_WORLD_VERSION;
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
  const px = zeros(n); const py = zeros(n); const ptop = zeros(n); const prost = zeros(n);
  const crowded = new Array<boolean>(n).fill(false);
  const nearHold = new Array<boolean>(n).fill(false);
  let bx = m.ball.pos.x; let by = m.ball.pos.y;
  let evLen = m.events.length;
  let logLen = 0;
  const seenOutcome: string[] = [];
  let pending: PendingSave | null = null;

  while (!m.finished) {
    if (!observe) { m.step(DT); row.ticks += 1; continue; }
    /* ---------- BEFORE THE STEP ---------- */
    for (let i = 0; i < n; i++) {
      const p = players[i];
      px[i] = p.pos.x; py[i] = p.pos.y; ptop[i] = p.topSpeed; prost[i] = p.rosterIdx;
    }
    for (let i = 0; i < n; i++) {
      const p = players[i];
      let near2 = false;
      for (let j = 0; j < n; j++) {
        if (j === i || players[j].sentOff) continue;
        if (Math.hypot(px[i] - px[j], py[i] - py[j]) < PLAYER_MIN_DIST) { near2 = true; break; }
      }
      crowded[i] = near2;
      const oppGk = m.teams[1 - (p.side as Side)].goalkeeper;
      nearHold[i] = (oppGk.gkHoldTimer > 0 || oppGk.gkDistributing)
        && Math.hypot(px[i] - oppGk.pos.x, py[i] - oppGk.pos.y) < GK_HOLD_CLEARANCE;
    }
    bx = m.ball.pos.x; by = m.ball.pos.y;
    evLen = m.events.length;
    logLen = m.shotLog.length;
    for (let j = 0; j < logLen; j++) seenOutcome[j] = m.shotLog[j].outcome;
    const phaseBefore = m.phase;
    const topOfPending = pending === null ? 0 : ptop[pending.gkGid];

    m.step(DT);
    row.ticks += 1;

    /* ---------- AFTER THE STEP ---------- */
    const phaseAfter = m.phase;
    /* ⭐⭐ THE ENGINE'S OWN RESTART STATE — never a timing heuristic: a tick is a RESTART tick
     *  iff the engine's own `phase` is anything but 'playing' at the end of it, or the phase
     *  CHANGED across it (the `setupKickoff` tick, which calls `resetForKickoff` for every
     *  body, is exactly a phase change into 'kickoff'). */
    const restartTick = phaseAfter !== 'playing' || phaseBefore !== phaseAfter;
    const kickProtected = mm.restartKickGid !== null;

    for (let i = 0; i < n; i++) {
      const p = players[i];
      if (p.sentOff) continue;
      const disp = Math.hypot(p.pos.x - px[i], p.pos.y - py[i]);
      const cap = ptop[i] * DT;
      const written = isWritten(disp, ptop[i]); /* the CAP's own argument is the
        body's topSpeed — `isWritten` applies DT itself */
      const subbed = p.rosterIdx !== prost[i];
      if (p.role === 'GK') {
        const saveWin = p.saveAnimTimer > 0;
        const hold = p.gkHoldTimer > 0 || p.gkDistributing;
        const kc = keeperClassOf({
          subbed, restart: restartTick, saveWindow: saveWin, hold,
          action: p.action.type as string,
        });
        row.keeperTicks += 1;
        row.keeperDispSum += disp;
        row.keeperCapSum += cap;
        row.keeperMaxDisp = Math.max(row.keeperMaxDisp, disp);
        row.keeperClassTicks[KCI(kc)] += 1;
        row.keeperActionTicks[AI(p.action.type as string)] += 1;
        if (saveWin) row.keeperSaveWindowTicks += 1;
        if (hold) row.keeperHoldTicks += 1;
        if (restartTick) row.keeperRestartTicks += 1;
        if (subbed) row.keeperSubTicks += 1;
        (saveWin ? row.keeperDispBinsSave : row.keeperDispBinsOutside)[
          binOf(disp, DISP_BIN_M, DISP_BINS)] += 1;
        row.keeperRatioBins[binOf(cap > 0 ? disp / cap : 0, RATIO_BIN, RATIO_BINS)] += 1;
        if (written) {
          row.keeperWritten += 1;
          row.keeperWrittenByClass[KCI(kc)] += 1;
          row.keeperWrittenAction[AI(p.action.type as string)] += 1;
          row.keeperMaxDispByClass[KCI(kc)] = Math.max(row.keeperMaxDispByClass[KCI(kc)], disp);
          if (!(RESTART_FAMILY as readonly string[]).includes(kc)) {
            row.keeperWrittenOutsideRestarts += 1;
          }
          if (crowded[i]) row.keeperWrittenCrowded += 1;
          if (nearHold[i]) row.keeperWrittenNearHoldingOpp += 1;
          if (kickProtected) row.keeperWrittenKickProtected += 1;
        }
      } else {
        const bc = bodyClassOf({
          subbed, restart: restartTick, nearHoldingKeeper: nearHold[i],
          kickProtected, crowded: crowded[i],
        });
        row.outfieldTicks += 1;
        row.outfieldClassTicks[BCI(bc)] += 1;
        row.outfieldDispBins[binOf(disp, DISP_BIN_M, DISP_BINS)] += 1;
        row.outfieldMaxDisp = Math.max(row.outfieldMaxDisp, disp);
        if (written) {
          row.outfieldWritten += 1;
          row.outfieldWrittenByClass[BCI(bc)] += 1;
          row.outfieldMaxDispByClass[BCI(bc)] = Math.max(row.outfieldMaxDispByClass[BCI(bc)],
            disp);
        }
      }
    }

    /* ---------- THE BALL'S MOVE ON THE TICK AFTER A SAVE (the carry snap) ---------- */
    if (pending !== null) {
      const bd = Math.hypot(m.ball.pos.x - bx, m.ball.pos.y - by);
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
        row.claimNext += 1; if (jumped) row.claimJumps += 1;
      } else if (pending.kind === 'smother') {
        row.smotherNext += 1; if (jumped) row.smotherJumps += 1;
      }
      pending = null;
    }

    /* ---------- THE SAVE, JOINED TO THE ENGINE'S TWO LEDGERS ---------- */
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
      }
      pending = { kind, gkGid: gk.gid };
    }
    if (flips > 0 && saveEventsHere > 0) row.joinFlipWithEvent += Math.min(flips, saveEventsHere);
    if (flips > saveEventsHere) row.joinFlipWithoutEvent += flips - saveEventsHere;
    if (saveEventsHere > flips) row.joinEventWithoutFlip += saveEventsHere - flips;
  }
  const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<string, number>[];
  row.goals = st[0].goals + st[1].goals;
  row.shots = st[0].shots + st[1].shots;
  row.savesStat = st[0].saves + st[1].saves;
  row.wallMs = Date.now() - tStart;
  return row;
};

/* ========================================================================== */
/* §10 THE CODE FACTS — the EXTRACTED call graph (canon: "the callee list is EXTRACTED from
   the hashed text — every identifier called within the span, resolved to its definition and
   hashed — never typed")                                                                    */
/* ========================================================================== */
const listTs = (dir: string): string[] => readdirSync(dir, { withFileTypes: true })
  .flatMap((d) => (d.isDirectory() ? listTs(`${dir}/${d.name}`)
    : d.name.endsWith('.ts') ? [`${dir}/${d.name}`] : []));
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
/** ⭐⭐ A FUNCTION HEAD, three shapes — a `function` declaration, a single-line METHOD
 *  declaration, or a `const name = (…) => {` arrow — plus the MULTI-LINE signature form whose
 *  body opens on a `): T {` line (the signature's own first line is then the head). Anything
 *  else that merely ends in `{` (an object literal, a `.map((p) => ({`) is NOT a head: a
 *  mis-resolved span would attribute a write to the wrong body. */
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
/** ⭐⭐ EVERY DIRECT `pos` WRITE SITE under src/sim and src/ai — the needle set is a SUPERSET
 *  of #397 item 5(v)'s three forms: the compound assignments (`+=` / `-=`) are included
 *  because `resolveOverlaps` writes a body's position with `+=` and a census that missed it
 *  would be a needle list, not a census (§DEVIATIONS names this widening). */
const POS_WRITE_RE = /([A-Za-z_$][\w$.]*|\))\.pos(\.[xy])?\s*(=|\+=|-=|\*=|\/=)(?!=)/;
const WRITE_CLASSES = ['integration', 'restartPlacement', 'substitution', 'holdClearance',
  'kickProtection', 'overlapResolve', 'pitchClamp', 'boxEdgeClamp', 'ballPlacement',
  'snapshotCopy', 'sentOffApron', 'other'] as const;
type WriteClass = (typeof WRITE_CLASSES)[number];
const SNAPSHOT_FILES = ['src/ai/perceptionSnapshot.ts', 'src/ai/inSnapshotView.ts',
  'src/sim/rendezvousRecovery.ts'];
const RESTART_FNS = ['resetForKickoff', 'setupKickoff', 'stepRestart', 'awardRestart'];
const PITCH_CLAMP_RE = /Math\.max\(-HALF_[LW] \+ 0\.3, Math\.min\(HALF_[LW] - 0\.3/;
/** ⭐⭐ THE WRITE-SITE CLASSES, in a FROZEN ORDERED RULE LIST: the two OPPONENT-DISPLACEMENT
 *  laws by their own named constant first (they are the classes the user's sentence could be
 *  about), then the enclosing body for the integration / substitution / restart / overlap
 *  families, then the clamp EXPRESSIONS wherever they appear, then the ball, then the
 *  read-only snapshot copies. `other` is the counted else-branch. */
const classifyWrite = (
  file: string, lineText: string, fn: string, subject: string,
): WriteClass => {
  if (lineText.includes('GK_HOLD_CLEARANCE')) return 'holdClearance';
  if (lineText.includes('kickClear')) return 'kickProtection';
  if (fn === 'physicsStep') return 'integration';
  if (fn === 'becomeSub') return 'substitution';
  if (RESTART_FNS.includes(fn)) return 'restartPlacement';
  if (fn === 'resolveOverlaps') return 'overlapResolve';
  if (fn === 'clampPlayersToPitch' || PITCH_CLAMP_RE.test(lineText)) return 'pitchClamp';
  if (lineText.includes('BOX_DEPTH')) return 'boxEdgeClamp';
  if (fn === 'removeFromPitch' || lineText.includes('HALF_W + 4')) return 'sentOffApron';
  if (/(^|\.)ball$/.test(subject) || file === 'src/sim/Ball.ts') return 'ballPlacement';
  if (SNAPSHOT_FILES.includes(file)) return 'snapshotCopy';
  return 'other';
};
interface WriteSite {
  file: string; line: number; text: string; subject: string; op: string;
  fn: string | null; fnSpan: string | null; fnSha: string | null; klass: WriteClass;
  isBall: boolean;
}
const WRITE_SITES: WriteSite[] = [];
for (const f of GRAPH_FILES) {
  const lines = GRAPH_SRC[f];
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i];
    const t = L.trim();
    if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) continue;
    const mw = POS_WRITE_RE.exec(L);
    if (mw === null) continue;
    const enc = enclosingOf(f, i + 1);
    const subject = mw[1];
    WRITE_SITES.push({
      file: f, line: i + 1, text: t, subject, op: mw[3],
      fn: enc === null ? null : enc.name,
      fnSpan: enc === null ? null : spanKey(enc),
      fnSha: enc === null ? null : enc.sha,
      klass: classifyWrite(f, L, enc === null ? '' : enc.name, subject),
      isBall: /(^|\.)ball$/.test(subject),
    });
  }
}
/** the EXTRACTED callee list of a span: every identifier CALLED inside its own text,
 *  resolved to a definition span by name. Never typed. */
const CALL_RE = /([A-Za-z_$][\w$]*)\s*\(/g;
const calleesOf = (s: Span): { resolved: Span[]; external: string[] } => {
  const seen = new Set<string>();
  const resolved: Span[] = [];
  const external: string[] = [];
  let mm2: RegExpExecArray | null = CALL_RE.exec(s.text);
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
const findSpan = (file: string, name: string, containsLine: number): Span | null => {
  const hit = enclosingOf(file, containsLine);
  return hit !== null && hit.name === name ? hit : null;
};
const SPAN_TRY_KEEPER_SAVE = findSpan(MECH_PATH, 'tryKeeperSave',
  occurrences(SRC_OF[MECH_PATH], 'export function tryKeeperSave(match: Match): void {')[0].line
  + 1);
const SPAN_GIVE_BALL = findSpan(MATCH_PATH, 'giveBall',
  occurrences(SRC_OF[MATCH_PATH], '  giveBall(p: Player): void {')[0].line + 1);
const SPAN_DECIDE_GK = findSpan(BRAIN_PATH, 'decideGoalkeeper',
  occurrences(SRC_OF[BRAIN_PATH],
    'function decideGoalkeeper(p: Player, team: Team, match: Match): void {')[0].line + 1);
const CARRY_LINE = occurrences(SRC_OF[MATCH_PATH],
  '        ball.pos.x = ball.owner.pos.x + ball.owner.heading.x * carry;')[0].line;
const SPAN_CARRY_LAW = enclosingOf(MATCH_PATH, CARRY_LINE);
const GK_CASE_LINE = occurrences(SRC_OF[EXEC_PATH], "    case 'GoalkeeperSave': {")[0].line;
const SPAN_GK_EXEC = enclosingOf(EXEC_PATH, GK_CASE_LINE);
const KEEPER_PATH_ROOTS = [SPAN_TRY_KEEPER_SAVE, SPAN_GIVE_BALL, SPAN_DECIDE_GK,
  SPAN_CARRY_LAW, SPAN_GK_EXEC].filter((s): s is Span => s !== null);
const ROOTS_COMPLETE = KEEPER_PATH_ROOTS.length === 5;
/** (a) THE TWO SAVE-PATH BODIES' OWN TEXT — the depth-0 boolean. */
const savePathBodies = [SPAN_TRY_KEEPER_SAVE, SPAN_GIVE_BALL].filter((s): s is Span =>
  s !== null);
const bodyWritesPlayerPos = (s: Span): WriteSite[] => WRITE_SITES.filter(
  (w) => w.fnSpan === spanKey(s) && !w.isBall,
);
const SAVE_PATH_OWN_WRITES = savePathBodies.flatMap(bodyWritesPlayerPos);
const savePathWritesNoKeeperPos = ROOTS_COMPLETE && SAVE_PATH_OWN_WRITES.length === 0;
/** (b) THE TRANSITIVE CLOSURE of the same two roots — every reachable body that DOES write a
 *  player `pos`, NAMED with its site. A non-empty list is not a contradiction of (a): it says
 *  which reachable branch could write one, and POPULATION A measures what actually happens. */
const SAVE_CLOSURE = closureOf(savePathBodies);
const SAVE_CLOSURE_KEYS = new Set(SAVE_CLOSURE.nodes.map(spanKey));
const SAVE_CLOSURE_WRITES = WRITE_SITES.filter(
  (w) => w.fnSpan !== null && SAVE_CLOSURE_KEYS.has(w.fnSpan) && !w.isBall,
);
const savePathClosureWritesNoKeeperPos = SAVE_CLOSURE_WRITES.length === 0;
/** ⭐⭐ THE OWN-LANE DOOR — world 14's ONE door, over the EXTRACTED closure of the keeper
 *  paths. This is the anchored evidence for NOT WALKING WORLD 14. */
const KEEPER_CLOSURE = closureOf(KEEPER_PATH_ROOTS);
const OWN_LANE_HITS = KEEPER_CLOSURE.nodes
  .filter((s) => s.text.includes('lnOwnLane'))
  .map((s) => spanKey(s));
const ownLaneDoorAbsentFromKeeperPaths = ROOTS_COMPLETE && OWN_LANE_HITS.length === 0;
/** the door IS somewhere — a non-vacuity check on the same needle over the same corpus. */
const OWN_LANE_ANYWHERE = SPANS.filter((s) => s.text.includes('lnOwnLane')).map(spanKey);
const ownLaneNeedleIsLive = OWN_LANE_ANYWHERE.length > 0;

/* ========================================================================== */
/* §11 THE RECEIPT WALKS — gLockstep (byte-inert observation), X-DET (twice), the world pin,
   and X-FP-PROD (the production fingerprint recomputed, not quoted)                          */
/* ========================================================================== */
banner('GK-C0 — the lockstep receipt (observed vs unobserved, PER ARM)');
const lockstepRows = LOCKSTEP_SEEDS.flatMap((seed) => ARMS.map((armK) => {
  const observed = buildMatch(seed, armK);
  walkMatch(observed, armK, true);
  const unobserved = buildMatch(seed, armK);
  walkMatch(unobserved, armK, false);
  return { seed, arm: armK, observed: signatureOf(observed), unobserved: signatureOf(unobserved) };
}));
const LOCKSTEP_OK = lockstepRows.every((r) => r.observed === r.unobserved);
banner(`  gLockstep ${LOCKSTEP_OK ? 'GREEN' : 'RED'} (${lockstepRows.length} walks)`);
/** ⭐ X-DET — the SAME seed walked TWICE, observed both times: identical signature AND
 *  identical row bytes. Determinism of the engine AND of this instrument's own counters. */
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
/** ⭐⭐ X-FP-PROD — the production fingerprint RECOMPUTED in this process (the shipped
 *  `scripts/fingerprint.ts` recipe: League seed 1337, two seasons, sha256 of the save JSON)
 *  and compared to the literal of record. A census cannot move it. */
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
  const mm = m as unknown as {
    bqCushion?: boolean; lnOwnLanePrice?: boolean; edsPerceivedChoice?: boolean;
    obmMovement?: boolean; ctbSupportPlane?: boolean; rcAnticipate?: boolean;
    rcReady?: boolean; bfFacingCost?: boolean;
  };
  return {
    seed: WORLD_PIN_SEED, arm: armK, bqArmedVersion: bqArmedVersion(m),
    lnArmedVersion: lnArmedVersion(m),
    bqCushion: mm.bqCushion === true,
    lnOwnLanePriceAbsent: mm.lnOwnLanePrice !== true,
    edsPerceivedChoice: mm.edsPerceivedChoice === true,
    seamsAbsent: mm.obmMovement !== true && mm.ctbSupportPlane !== true
      && mm.rcAnticipate !== true && mm.rcReady !== true && mm.bfFacingCost !== true,
  };
});
const WORLD_PIN_OK = worldPin.every((w) => w.bqArmedVersion === BQ_WORLD_VERSION
  && w.lnArmedVersion !== LN_WORLD_VERSION && w.bqCushion && w.lnOwnLanePriceAbsent
  && w.edsPerceivedChoice && w.seamsAbsent);

/* ========================================================================== */
/* §12 THE BATTERY — the two arms PAIRED on every seed                         */
/* ========================================================================== */
interface Cell { seed: number; rows: Record<Arm, Row> }
const cells: Cell[] = [];
banner(`GK-C0 — the battery: ${N} seeds × ${ARMS.length} arms, seeds `
  + `${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]}`);
const CHUNK = 25;
for (let start = 0; start < batterySeeds.length; start += CHUNK) {
  for (const seed of batterySeeds.slice(start, start + CHUNK)) {
    const rows = {} as Record<Arm, Row>;
    for (const armK of ARMS) rows[armK] = walkMatch(buildMatch(seed, armK), armK, true);
    cells.push({ seed, rows });
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

/* ---- POPULATION A — EVERY KEEPER TICK ---- */
defFace('keeper.ticksPerMatch', 'keeper ticks per match',
  'both keepers, every stepped tick of the match', 'matches',
  (r) => r.keeperTicks, ONE);
defFace('keeper.writtenShare', 'share',
  '⭐⭐ THE WRITTEN SHARE — keeper ticks whose |Δpos| exceeds the body\'s OWN integration cap '
  + '`topSpeed · DT · (1 + EPS)`, over all keeper ticks', 'keeper ticks',
  (r) => r.keeperWritten, (r) => r.keeperTicks);
defFace('keeper.writtenOutsideRestartsShare', 'share',
  '⭐⭐ THE READ-BEARING SHARE — written keeper ticks in classes OTHER THAN restartPlacement '
  + 'and substitution, over all keeper ticks', 'keeper ticks',
  (r) => r.keeperWrittenOutsideRestarts, (r) => r.keeperTicks);
defFace('keeper.writtenOutsideRestartsShareOfWritten', 'share',
  'the same numerator over WRITTEN keeper ticks (the composition form)',
  'written keeper ticks', (r) => r.keeperWrittenOutsideRestarts, (r) => r.keeperWritten);
defFace('keeper.meanDisplacementMetres', 'metres per keeper tick',
  'the mean per-tick |Δpos| over all keeper ticks', 'keeper ticks',
  (r) => r.keeperDispSum, (r) => r.keeperTicks);
defFace('keeper.meanCapMetres', 'metres per keeper tick',
  'the mean per-tick integration cap `topSpeed · DT` over the same ticks', 'keeper ticks',
  (r) => r.keeperCapSum, (r) => r.keeperTicks);
defFace('keeper.saveWindowTickShare', 'share',
  'keeper ticks inside the 0.7 s dive window (`saveAnimTimer > 0`)', 'keeper ticks',
  (r) => r.keeperSaveWindowTicks, (r) => r.keeperTicks);
defFace('keeper.holdTickShare', 'share',
  'keeper ticks with the ball in the hands (`gkHoldTimer > 0 || gkDistributing`)',
  'keeper ticks', (r) => r.keeperHoldTicks, (r) => r.keeperTicks);
defFace('keeper.restartTickShare', 'share',
  'keeper ticks the ENGINE\'S OWN phase calls a restart tick', 'keeper ticks',
  (r) => r.keeperRestartTicks, (r) => r.keeperTicks);
defFace('keeper.writtenCrowdedShare', 'share',
  'written keeper ticks with ANOTHER BODY inside `PLAYER_MIN_DIST` at the tick\'s start — the '
  + 'overlap-resolver\'s own shape (a PROXIMITY MARKER, not call-site attribution)',
  'written keeper ticks', (r) => r.keeperWrittenCrowded, (r) => r.keeperWritten);
defFace('keeper.writtenKickProtectedShare', 'share',
  '⭐⭐ written keeper ticks taken while the KICK-PROTECTION clearance was live '
  + '(`match.restartKickGid !== null`) — the engine\'s own state for the one opponent-'
  + 'displacement law that fires in OPEN PLAY (a restart hand-off), so a written keeper tick '
  + 'in an action class can still be NAMED', 'written keeper ticks',
  (r) => r.keeperWrittenKickProtected, (r) => r.keeperWritten);
defFace('keeper.writtenNearHoldingOpponentShare', 'share',
  'written keeper ticks within `GK_HOLD_CLEARANCE` of a HOLDING opposing keeper (the same '
  + 'marker for the hold-clearance law)', 'written keeper ticks',
  (r) => r.keeperWrittenNearHoldingOpp, (r) => r.keeperWritten);
for (const c of KEEPER_CLASSES) {
  defFace(`keeperClass.tickShare.${c}`, 'share',
    `the share of ALL keeper ticks in class ${c} (frozen precedence)`, 'keeper ticks',
    (r) => r.keeperClassTicks[KCI(c)], (r) => r.keeperTicks);
  defFace(`keeperClass.writtenShare.${c}`, 'share',
    `⭐ P(written | class ${c}) — the written share INSIDE the class`, `${c} keeper ticks`,
    (r) => r.keeperWrittenByClass[KCI(c)], (r) => r.keeperClassTicks[KCI(c)]);
  defFace(`keeperClass.compositionOfWritten.${c}`, 'share',
    `the ${c} share OF THE WRITTEN keeper ticks (the dominance ranking)`,
    'written keeper ticks', (r) => r.keeperWrittenByClass[KCI(c)], (r) => r.keeperWritten);
}
/* ---- POPULATION B — EVERY SAVE ---- */
defFace('save.eventsPerMatch', 'save events per match',
  'every `save` EVENT the engine pushed (all four sites)', 'matches',
  (r) => sum(r.saveEvents), ONE);
defFace('save.ledgerFlipsPerMatch', 'shotLog flips per match',
  '`shotLog` rows whose outcome flipped pending → saved', 'matches',
  (r) => r.ledgerSavedFlips, ONE);
defFace('save.joinAgreementShare', 'share',
  '⭐⭐ THE JOIN — ledger flips that coincide with a save EVENT on the same tick',
  'shotLog saved-flips', (r) => r.joinFlipWithEvent, (r) => r.ledgerSavedFlips);
defFace('save.eventWithoutFlipShare', 'share',
  'save events with NO ledger flip on the tick (the smother has no `pendingShot`; a claim '
  + 'outside a shot has none either) — COUNTED, never imputed', 'save events',
  (r) => r.joinEventWithoutFlip, (r) => sum(r.saveEvents));
for (const k of SAVE_KINDS) {
  defFace(`saveKind.${k}`, 'share',
    `the ${k} share of save events, read off the engine's OWN event text`, 'save events',
    (r) => r.saveEvents[SKI(k)], (r) => sum(r.saveEvents));
}
defFace('save.catchShareOfShotSaves', 'share',
  '⭐⭐ THE CATCH SHARE among the two `tryKeeperSave` outcomes (catch + parry)',
  'catch + parry events', (r) => r.saveEvents[SKI('catch')],
  (r) => r.saveEvents[SKI('catch')] + r.saveEvents[SKI('parry')]);
defFace('save.meanDistanceMetres', 'metres',
  '⭐⭐ the ball↔keeper distance at the save tick (post-step read — a DECLARED reconstruction '
  + 'of the engine\'s own `dNow`)', 'save events',
  (r) => r.saveDistSum, (r) => sum(r.saveEvents));
defFace('save.meanReconstructedReachMetres', 'metres',
  'the RECONSTRUCTED `keeperReach` of the keeper who made it', 'save events',
  (r) => r.reachSum, (r) => sum(r.saveEvents));
defFace('save.meanReachTimesStretchMetres', 'metres',
  'the same × `SAVE_STRETCH` = 1.35 — the fingertip envelope', 'save events',
  (r) => r.reachStretchSum, (r) => sum(r.saveEvents));
defFace('save.withinReachShare', 'share',
  'save events whose post-step distance is inside the reconstructed reach', 'save events',
  (r) => r.saveWithinReach, (r) => sum(r.saveEvents));
defFace('save.withinStretchShare', 'share',
  'save events between reach and reach × 1.35', 'save events',
  (r) => r.saveWithinStretch, (r) => sum(r.saveEvents));
defFace('save.beyondStretchShare', 'share',
  '⚠ save events whose POST-STEP distance already exceeds reach × 1.35 — the post-step read '
  + 'is not the engine\'s instant, and this share is the honest size of that gap',
  'save events', (r) => r.saveBeyondStretch, (r) => sum(r.saveEvents));
defFace('catch.gt1mShare', 'share', '⭐ catches taken more than 1 m from the body',
  'catch events', (r) => r.catchGt1, (r) => r.saveEvents[SKI('catch')]);
defFace('catch.gt2mShare', 'share', '⭐ catches taken more than 2 m from the body',
  'catch events', (r) => r.catchGt2, (r) => r.saveEvents[SKI('catch')]);
defFace('catch.gt3mShare', 'share', '⭐ catches taken more than 3 m from the body',
  'catch events', (r) => r.catchGt3, (r) => r.saveEvents[SKI('catch')]);
defFace('ballJump.catchShare', 'share',
  '⭐⭐ THE READ-BEARING SHARE — catches whose NEXT-TICK ball displacement exceeds the '
  + 'catching keeper\'s own `topSpeed · DT`', 'catches with a following tick',
  (r) => r.catchJumps, (r) => r.catchNext);
defFace('ballJump.catchMeanMetres', 'metres',
  '⭐⭐ the mean ball displacement on the tick after a catch (the carry snap)',
  'catches with a following tick', (r) => r.catchNextDispSum, (r) => r.catchNext);
defFace('ballJump.parryShare', 'share',
  'the same predicate on PARRIES — a kick-like release, published BESIDE and never read',
  'parries with a following tick', (r) => r.parryJumps, (r) => r.parryNext);
defFace('ballJump.parryMeanMetres', 'metres',
  'the mean ball displacement on the tick after a parry', 'parries with a following tick',
  (r) => r.parryNextDispSum, (r) => r.parryNext);
defFace('ballJump.claimShare', 'share', 'the same predicate on HIGH-BALL CLAIMS (beside)',
  'claims with a following tick', (r) => r.claimJumps, (r) => r.claimNext);
defFace('ballJump.smotherShare', 'share', 'the same predicate on SMOTHERS (beside)',
  'smothers with a following tick', (r) => r.smotherJumps, (r) => r.smotherNext);
/* ---- POPULATION C — ALL BODIES ---- */
defFace('body.gkWrittenShare', 'share', 'the written share for GOALKEEPERS (the role split)',
  'keeper ticks', (r) => r.keeperWritten, (r) => r.keeperTicks);
defFace('body.outfieldWrittenShare', 'share', 'the written share for OUTFIELDERS',
  'outfield ticks', (r) => r.outfieldWritten, (r) => r.outfieldTicks);
defFace('body.outfieldTicksPerMatch', 'outfield ticks per match', 'ten outfielders, every tick',
  'matches', (r) => r.outfieldTicks, ONE);
for (const c of BODY_CLASSES) {
  defFace(`bodyClass.tickShare.${c}`, 'share',
    `the share of ALL outfield ticks in class ${c}`, 'outfield ticks',
    (r) => r.outfieldClassTicks[BCI(c)], (r) => r.outfieldTicks);
  defFace(`bodyClass.writtenShare.${c}`, 'share',
    `P(written | outfield class ${c})`, `${c} outfield ticks`,
    (r) => r.outfieldWrittenByClass[BCI(c)], (r) => r.outfieldClassTicks[BCI(c)]);
  defFace(`bodyClass.compositionOfWritten.${c}`, 'share',
    `the ${c} share OF THE WRITTEN outfield ticks`, 'written outfield ticks',
    (r) => r.outfieldWrittenByClass[BCI(c)], (r) => r.outfieldWritten);
}
defFace('opponentDisplacement.holdClearanceShareOfWritten', 'share',
  '⭐⭐ THE OPPONENT-DISPLACEMENT SHARE printed beside every read sentence: written OUTFIELD '
  + 'ticks in the `holdClearance` class over all written outfield ticks',
  'written outfield ticks', (r) => r.outfieldWrittenByClass[BCI('holdClearance')],
  (r) => r.outfieldWritten);
/* ---- CONTEXT (never read) ---- */
defFace('context.goalsPerMatch', 'goals per match', 'both sides', 'matches',
  (r) => r.goals, ONE);
defFace('context.shotsPerMatch', 'shots per match', 'both sides', 'matches',
  (r) => r.shots, ONE);
defFace('context.savesStatPerMatch', 'saves per match',
  'the engine\'s OWN `stats.saves` counter, both sides', 'matches',
  (r) => r.savesStat, ONE);
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
  if (f === undefined) { banner(`GK-C0 FATAL — unknown face ${k}/${armK}`); process.exit(3); }
  return f as FaceRow;
};
/** ⭐⭐ THE PAIRED Δ (D13 − E13) — the arms share seeds, so the interval is PAIRED. */
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
const deltas: DeltaRow[] = FACE_KEYS.map((k) => pairedDelta(k, 'D13', 'E13'));

/* ========================================================================== */
/* §14 THE PRE-REGISTERED READS — #397 item 5(vi)'s SENTENCES, VERBATIM.
   The SELECTORS are STORED BOOLEANS on the E13 arm; D13's are computed by the SAME frozen
   rule and stored beside as the counterfactual word. canon, VERBATIM: "a counterfactual
   verdict sentence … quotes a word the instrument STORED by applying the frozen rule to X's
   stored interval; a universal sentence about a table … is a stored boolean or is not
   written".                                                                                 */
/* ========================================================================== */
const READ_1 = 'THE KEEPER NEVER JUMPS — THE BALL DOES: the catch snaps it to his feet from '
  + 'up to the fingertip reach; the eye reads the ball\'s jump and the dive sprite as his — a '
  + 'ball-side law is named (GK-T0: the caught ball travels to the hands over the ticks the '
  + 'hands need).';
const READ_2 = 'THE KEEPER\'S BODY IS WRITTEN — the write site is named (<class>).';
const READ_3 = 'NEITHER JUMPS IN THE ENGINE — the teleport is the renderer\'s; a render census '
  + 'is named next.';
const READ_SENTENCES = { READ_1, READ_2, READ_3 };
interface ReadBlock {
  keeperWrittenOutsideRestarts: boolean; keeperWrittenOutsideRestartsCount: number;
  ballJumpsAtCatch: boolean; ballJumpShare: number; ballJumpNumerator: number;
  ballJumpDenominator: number;
  dominantClass: string; dominantClassCount: number; classRanking: [string, number][];
  selected: 'READ_1' | 'READ_2' | 'READ_3'; sentence: string;
  opponentDisplacementShare: number;
}
const readOf = (armK: Arm): ReadBlock => {
  const rows = armRows(armK);
  const outside = sum(rows.map((r) => r.keeperWrittenOutsideRestarts));
  const kw = outside > 0;
  const bjN = sum(rows.map((r) => r.catchJumps));
  const bjD = sum(rows.map((r) => r.catchNext));
  const bjShare = ratio(bjN, bjD);
  const bj = Number.isFinite(bjShare) && bjShare > 0.5;
  const ranking: [string, number][] = KEEPER_CLASSES
    .filter((c) => !(RESTART_FAMILY as readonly string[]).includes(c))
    .map((c): [string, number] => [c as string,
      sum(rows.map((r) => r.keeperWrittenByClass[KCI(c)]))])
    .sort((a, b) => (b[1] - a[1]) || (a[0] < b[0] ? -1 : 1));
  const selected = kw ? 'READ_2' : bj ? 'READ_1' : 'READ_3';
  return {
    keeperWrittenOutsideRestarts: kw, keeperWrittenOutsideRestartsCount: outside,
    ballJumpsAtCatch: bj, ballJumpShare: bjShare, ballJumpNumerator: bjN,
    ballJumpDenominator: bjD,
    dominantClass: ranking[0][0], dominantClassCount: ranking[0][1], classRanking: ranking,
    selected,
    sentence: selected === 'READ_1' ? READ_1 : selected === 'READ_2' ? READ_2 : READ_3,
    opponentDisplacementShare: ratio(
      sum(rows.map((r) => r.outfieldWrittenByClass[BCI('holdClearance')])),
      sum(rows.map((r) => r.outfieldWritten)),
    ),
  };
};
const READS = { E13: readOf('E13'), D13: readOf('D13') } as Record<Arm, ReadBlock>;
const READ_OF_RECORD = READS.E13.sentence;
const DOSED_AGREES = READS.E13.selected === READS.D13.selected;
const AGREE_SENTENCE = {
  agrees: 'THE DOSED WORLD SELECTS THE SAME READ',
  disagrees: 'THE DOSED WORLD SELECTS A DIFFERENT READ',
};
const AGREE_WORD = DOSED_AGREES ? AGREE_SENTENCE.agrees : AGREE_SENTENCE.disagrees;
/** ⭐ THE ANNOTATION LINE — the dominant class, on its OWN line, never spliced into the frozen
 *  literal (READ_2's `<class>` placeholder stays a placeholder; the class is stored). */
const READ_ANNOTATION = `dominant non-restart written class (E13): ${
  READS.E13.dominantClass} (${READS.E13.dominantClassCount} written keeper ticks)`;
/** ⭐⭐ LOO — leave-one-cluster-out on the TWO read-bearing shares: does either SELECTOR flip
 *  when any single match seed is dropped? Scoped: this is a stability check on the selectors,
 *  NOT a confidence statement about any face. */
const looOf = (armK: Arm): {
  keeperBoolAlwaysSame: boolean; ballJumpBoolAlwaysSame: boolean;
  keeperShareMin: number; keeperShareMax: number;
  ballJumpShareMin: number; ballJumpShareMax: number; selectorAlwaysSame: boolean;
} => {
  const rows = armRows(armK);
  const base = readOf(armK);
  let kAll = true; let bAll = true; let sAll = true;
  let kMin = Infinity; let kMax = -Infinity; let bMin = Infinity; let bMax = -Infinity;
  for (let drop = 0; drop < rows.length; drop++) {
    let ow = 0; let kt = 0; let bn = 0; let bd = 0;
    for (let i = 0; i < rows.length; i++) {
      if (i === drop) continue;
      ow += rows[i].keeperWrittenOutsideRestarts; kt += rows[i].keeperTicks;
      bn += rows[i].catchJumps; bd += rows[i].catchNext;
    }
    const kShare = ratio(ow, kt);
    const bShare = ratio(bn, bd);
    kMin = Math.min(kMin, kShare); kMax = Math.max(kMax, kShare);
    if (Number.isFinite(bShare)) { bMin = Math.min(bMin, bShare); bMax = Math.max(bMax, bShare); }
    const kB = ow > 0;
    const bB = Number.isFinite(bShare) && bShare > 0.5;
    if (kB !== base.keeperWrittenOutsideRestarts) kAll = false;
    if (bB !== base.ballJumpsAtCatch) bAll = false;
    const sel = kB ? 'READ_2' : bB ? 'READ_1' : 'READ_3';
    if (sel !== base.selected) sAll = false;
  }
  return {
    keeperBoolAlwaysSame: kAll, ballJumpBoolAlwaysSame: bAll,
    keeperShareMin: kMin, keeperShareMax: kMax,
    ballJumpShareMin: bMin, ballJumpShareMax: bMax, selectorAlwaysSame: sAll,
  };
};
const LOO = { E13: looOf('E13'), D13: looOf('D13') };

/* ========================================================================== */
/* §15 THE POOLED BINS, THE BIN-DERIVED MEDIANS, AND THE SIZING                */
/* ========================================================================== */
type Pooled = {
  keeperClassTicks: number[]; keeperWrittenByClass: number[]; keeperMaxDispByClass: number[];
  keeperDispBinsSave: number[]; keeperDispBinsOutside: number[]; keeperRatioBins: number[];
  keeperActionTicks: number[]; keeperWrittenAction: number[];
  saveEvents: number[]; saveDistBins: number[]; catchDistBins: number[];
  goalDistBins: number[]; ballSpeedBins: number[];
  catchJumpBins: number[]; parryJumpBins: number[];
  outfieldClassTicks: number[]; outfieldWrittenByClass: number[];
  outfieldMaxDispByClass: number[]; outfieldDispBins: number[];
};
const emptyPooled = (): Pooled => ({
  keeperClassTicks: zeros(KEEPER_CLASSES.length),
  keeperWrittenByClass: zeros(KEEPER_CLASSES.length),
  keeperMaxDispByClass: zeros(KEEPER_CLASSES.length),
  keeperDispBinsSave: zeros(DISP_BINS), keeperDispBinsOutside: zeros(DISP_BINS),
  keeperRatioBins: zeros(RATIO_BINS),
  keeperActionTicks: zeros(ACTION_CELLS.length), keeperWrittenAction: zeros(ACTION_CELLS.length),
  saveEvents: zeros(SAVE_KINDS.length), saveDistBins: zeros(SAVEDIST_BINS),
  catchDistBins: zeros(SAVEDIST_BINS), goalDistBins: zeros(GOALDIST_BINS),
  ballSpeedBins: zeros(BALLSPEED_BINS),
  catchJumpBins: zeros(BALLJUMP_BINS), parryJumpBins: zeros(BALLJUMP_BINS),
  outfieldClassTicks: zeros(BODY_CLASSES.length),
  outfieldWrittenByClass: zeros(BODY_CLASSES.length),
  outfieldMaxDispByClass: zeros(BODY_CLASSES.length), outfieldDispBins: zeros(DISP_BINS),
});
const poolFrom = (rows: readonly Row[]): Pooled => {
  const p = emptyPooled();
  for (const r of rows) {
    addInto(p.keeperClassTicks, r.keeperClassTicks);
    addInto(p.keeperWrittenByClass, r.keeperWrittenByClass);
    maxInto(p.keeperMaxDispByClass, r.keeperMaxDispByClass);
    addInto(p.keeperDispBinsSave, r.keeperDispBinsSave);
    addInto(p.keeperDispBinsOutside, r.keeperDispBinsOutside);
    addInto(p.keeperRatioBins, r.keeperRatioBins);
    addInto(p.keeperActionTicks, r.keeperActionTicks);
    addInto(p.keeperWrittenAction, r.keeperWrittenAction);
    addInto(p.saveEvents, r.saveEvents);
    addInto(p.saveDistBins, r.saveDistBins);
    addInto(p.catchDistBins, r.catchDistBins);
    addInto(p.goalDistBins, r.goalDistBins);
    addInto(p.ballSpeedBins, r.ballSpeedBins);
    addInto(p.catchJumpBins, r.catchJumpBins);
    addInto(p.parryJumpBins, r.parryJumpBins);
    addInto(p.outfieldClassTicks, r.outfieldClassTicks);
    addInto(p.outfieldWrittenByClass, r.outfieldWrittenByClass);
    maxInto(p.outfieldMaxDispByClass, r.outfieldMaxDispByClass);
    addInto(p.outfieldDispBins, r.outfieldDispBins);
  }
  return p;
};
const mediansFrom = (p: Pooled): Record<string, unknown> => ({
  keeperDisplacementInSaveWindowMetres: binMedian(p.keeperDispBinsSave, DISP_BIN_M),
  keeperDisplacementOutsideSaveWindowMetres: binMedian(p.keeperDispBinsOutside, DISP_BIN_M),
  keeperDisplacementOverCapRatio: binMedian(p.keeperRatioBins, RATIO_BIN),
  outfieldDisplacementMetres: binMedian(p.outfieldDispBins, DISP_BIN_M),
  saveDistanceMetres: binMedian(p.saveDistBins, SAVEDIST_BIN_M),
  catchDistanceMetres: binMedian(p.catchDistBins, SAVEDIST_BIN_M),
  ballToGoalLineAtSaveMetres: binMedian(p.goalDistBins, GOALDIST_BIN_M),
  ballSpeedAtSaveMs: binMedian(p.ballSpeedBins, BALLSPEED_BIN),
  ballDisplacementAfterCatchMetres: binMedian(p.catchJumpBins, BALLJUMP_BIN_M),
  ballDisplacementAfterParryMetres: binMedian(p.parryJumpBins, BALLJUMP_BIN_M),
});
const pooled = {} as Record<Arm, Pooled>;
const medians = {} as Record<Arm, Record<string, unknown>>;
for (const armK of ARMS) {
  pooled[armK] = poolFrom(armRows(armK));
  medians[armK] = mediansFrom(pooled[armK]);
}
/** ⭐⭐ THE SIZING — the house form, off §DEV-PREFLIGHT's DISCLOSED 12-cluster scratch smoke.
 *  The two rows are the TWO READ-BEARING SHARES. The realised half-widths below were read out
 *  of the SMOKE ARTIFACT's own `faces[].halfWidth` fields on the E13 arm — never re-typed from
 *  a rounded console print. ⚠ 12 clusters is a NOISY variance estimate; said before the
 *  battery. A row whose smoke half-width is 0 is DEGENERATE (a class that never varied) and is
 *  DECLARED, not sized. */
const Z975 = 1.959963984540054;
const ZSUM = 1.959963984540054 + 0.8416212335729143;
const SMOKE_N = 12;
const SIZING_INPUTS = [
  { face: 'keeper.writtenOutsideRestartsShare', hwSmoke: 0.000032607100739637736,
    target: 0.05 },
  { face: 'ballJump.catchShare', hwSmoke: 0, target: 0.05 },
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

/* ========================================================================== */
/* §16 THE GATES (all liveness/receipt — NEVER direction)                      */
/* ========================================================================== */
const walkedSeeds = [...new Set(cells.map((c) => c.seed))].sort((a, b) => a - b);
const inBlock = (s: number): boolean => s >= BLOCK_BASE && s <= BLOCK_TOP;
const ALL_SCRATCH = [...LOCKSTEP_SEEDS, WORLD_PIN_SEED];
const FIXTURES_OK = FIXTURES.every((f) => f.ok);
const WRITTEN_FX_OK = FIXTURES.filter((f) => f.name.startsWith('written.')
  || f.name.startsWith('reach.') || f.name.startsWith('ballJump.')).every((f) => f.ok);
const LEDGER_FX_OK = FIXTURES.filter((f) => f.name.startsWith('saveKind.')).every((f) => f.ok);
const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: ARMS.every((armK) => allRows(armK).every((r) => r.worldOk && r.cushionOk && r.lnAbsent
      && r.edsChoiceOn && r.seamsAbsent && r.genomeClean)) && WORLD_PIN_OK,
    note: '⭐⭐ PER ARM, on EVERY walked match and the construction receipt: '
      + `\`bqArmedVersion(m) === ${BQ_WORLD_VERSION}\`; \`bqCushion\` TRUE; `
      + `\`lnOwnLanePrice\` ABSENT and \`lnArmedVersion(m) !== ${LN_WORLD_VERSION}\` (world 14 `
      + 'is NOT walked); `edsPerceivedChoice` TRUE; every OBM / CTB / RC / BF seam ABSENT; '
      + '`info.genome` clean of the own-lane / RC / CTB / OBM genes (canon: dose placement). '
      + `Pinned again on a CONSTRUCTED match of each arm at scratch seed ${WORLD_PIN_SEED}`,
  },
  gDoseSource: {
    ok: DOSED_ARM_REACHABLE && L3_DOSE_BYTES_SHA === L3_DOSE_PIN
      && PC_DOSE_BYTES_SHA === PC_DOSE_PIN,
    note: '⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a '
      + 'self-declared field". The D13 arm takes its doses from the SHIPPED LOADERS; this gate '
      + 'hashes the FILE BYTES this process read and compares them to the pinned values — a '
      + `mismatch is exit 3 BEFORE any seed is walked. \`pcDoseGuard.bytesChecked\` is `
      + `${pcDoseGuard.bytesChecked} under bare node, which is why the bytes are hashed here`,
  },
  gAnchoredConstants: {
    ok: ANCHORS.every((a) => a.occurrences.length === a.want) && REACH_CONSTANTS_OK
      && SAVE_STRETCH_RECON === 1.35 && GK_HOLD_CLEARANCE === 3 && GK_CLAIM_HEIGHT === 2.55
      && GK_CONTROL_MAX_SPEED === 23 && GK_RUSH_ENVELOPE === 5 && DT === 1 / 60
      && ACTIONS.length > 0 && ACTIONS.includes('GoalkeeperSave')
      && ACTIONS.includes('GoalkeeperRush') && ACTIONS.includes('GoalkeeperPosition')
      && ACTIONS.includes('ChaseBall') && ACTIONS.includes('MakeRun'),
    note: `⭐⭐ anchored extraction with line receipts, ${ANCHORS.length} sites: THE SAVE ITSELF `
      + '(`tryKeeperSave`, `keeperReach`\'s two formula lines, `SAVE_STRETCH`, the reach and '
      + '`dNow` reads, the fingertip branch and its cap, `saveAnimTimer = 0.7`, the CATCH '
      + 'branch with its event text and `giveBall`, the PARRY\'s rotation / cooldown / event, '
      + 'and `markShotOutcome(\'saved\')`) · THE OTHER THREE SAVE-EVENT SITES (the high-ball '
      + 'claim with its own ledger write and 0.6 s window; the smother) · THE LEDGERS '
      + '(`ShotLogEntry`, its `outcome` field, `shotLog`, `markShotOutcome`, `pushEvent`) · '
      + 'THE BALL-SIDE LAWS (`giveBall`, the carry law\'s two lines and the C6 variant, '
      + '`kickBall`\'s 0.9 m placement, the `GK_HOLD_CLEARANCE` push and its box clamp) · THE '
      + 'RESTART PLACEMENTS (`resetForKickoff` CALLED, the own-half clamp, the kicker\'s spot, '
      + '`kickoffKickGid`, the restart clearance, the goal-kick line, both ball placements, '
      + 'the kick protection, the pitch clamp, the sent-off apron, the SUBSTITUTION) · THE '
      + 'INTEGRATION CAP (`topSpeed`, its formula, the clamp, both integration lines) · THE '
      + 'KEEPER\'S DECISION SURFACE (`decideGoalkeeper` and its five actions; the executor\'s '
      + 'three GK cases and the box-clamped save target) · THE RENDERER\'S DIVE (0.7 s; '
      + '1 + 0.7k / 1 − 0.35k; `diveDir` toward the ball) · the engine constants · world 13\'s '
      + `own composition and world 14's ONE door. The ACTION vocabulary (${ACTIONS.length}) is `
      + 'READ OFF `ActionType`\'s OWN union',
  },
  gWrittenFixtures: {
    ok: WRITTEN_FX_OK,
    note: '⭐⭐ THE WRITTEN PREDICATE ON REAL BODIES: a full-speed INTEGRATED step of a shipped '
      + `\`Player\` (${fxIntegratedDisp.toFixed(6)} m against a cap of `
      + `${(fxTopBefore * DT).toFixed(6)} m) is NOT written and DID move him; the same body's `
      + `\`resetForKickoff\` displacement (${fxResetDisp.toFixed(6)} m) IS; so is the `
      + '`becomeSub` placement; the cap boundary is pinned on both sides (exactly at the cap '
      + 'is NOT written, a hair over IS). THE REACH RECONSTRUCTION equals the ANCHORED formula '
      + 'on hand-built keepers at every term (base 2.05, aggression ×0.4, reflexes ±0.5·, the '
      + 'cat +0.12) and its four constants are EXTRACTED from the two anchored source lines, '
      + 'never typed. THE BALL-JUMP PREDICATE fires on a catch 3 m from the body and does NOT '
      + 'fire on a catch at the feet',
  },
  gLedgerRead: {
    ok: LEDGER_FX_OK
      && ARMS.every((armK) => tot(armK, (r) => r.ledgerSavedFlips) > 0
        && tot(armK, (r) => sum(r.saveEvents)) > 0
        && tot(armK, (r) => r.joinFlipWithEvent) > 0),
    note: '⭐⭐ canon, VERBATIM: "an event attribution reads the engine\'s own record when one '
      + 'exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic is written only '
      + 'where no record exists, and says so". EVERY save in this census is read off TWO engine '
      + 'ledgers: `shotLog[i].outcome` flipping pending → saved on the tick, and the `save` '
      + 'EVENT\'s own text. `saveKindOf` is a PURE function of that text and the fixtures show '
      + 'the class FOLLOWING AN EDITED text (the same string with `parries!` replaced by '
      + '`catches it` reads `catch`). LIVENESS beside: ledger flips (E13 '
      + `${tot('E13', (r) => r.ledgerSavedFlips)}, D13 `
      + `${tot('D13', (r) => r.ledgerSavedFlips)}) and joined flips (E13 `
      + `${tot('E13', (r) => r.joinFlipWithEvent)}, D13 `
      + `${tot('D13', (r) => r.joinFlipWithEvent)}).`
      + ' ⚠ The SMOTHER family has no `pendingShot` and therefore no flip — COUNTED in '
      + '`save.eventWithoutFlipShare`, never imputed',
  },
  gClassesNonVacuous: {
    ok: ARMS.every((armK) => tot(armK, (r) => sum(r.saveEvents)) > 0
      && tot(armK, (r) => r.saveEvents[SKI('catch')]) > 0
      && tot(armK, (r) => r.saveEvents[SKI('parry')]) > 0
      && tot(armK, (r) => r.keeperWritten) > 0
      && tot(armK, (r) => r.outfieldWritten) > 0
      && tot(armK, (r) => r.keeperTicks) > 0),
    note: '⛔ no face this census READS is computed on an empty class: EVERY arm has save '
      + `events (E13 ${tot('E13', (r) => sum(r.saveEvents))}, D13 `
      + `${tot('D13', (r) => sum(r.saveEvents))}), CATCHES (E13 `
      + `${tot('E13', (r) => r.saveEvents[SKI('catch')])}, D13 `
      + `${tot('D13', (r) => r.saveEvents[SKI('catch')])}), PARRIES (E13 `
      + `${tot('E13', (r) => r.saveEvents[SKI('parry')])}, D13 `
      + `${tot('D13', (r) => r.saveEvents[SKI('parry')])}), WRITTEN keeper ticks (E13 `
      + `${tot('E13', (r) => r.keeperWritten)}, D13 ${tot('D13', (r) => r.keeperWritten)}) and `
      + `WRITTEN outfield ticks (E13 ${tot('E13', (r) => r.outfieldWritten)}, D13 `
      + `${tot('D13', (r) => r.outfieldWritten)}). ⚠ LIVENESS only — never a direction. Any `
      + 'class that IS empty is reported as empty and the read is stated on what exists',
  },
  gCodeFactGraph: {
    ok: WRITE_SITES.every((w) => w.fn !== null) && WRITE_SITES.length > 0
      && ROOTS_COMPLETE && ownLaneNeedleIsLive && !SAVE_CLOSURE.capped
      && !KEEPER_CLOSURE.capped,
    note: `⭐⭐ THE WRITE-SITE CENSUS: ${WRITE_SITES.length} direct \`pos\` write sites under `
      + `\`src/sim\` and \`src/ai\`, EVERY one resolved to an enclosing function (${SPANS.length}`
      + ' extracted function spans), each hashed WHOLE with its own text, and classified by the '
      + `FROZEN ordered rule list into ${WRITE_CLASSES.length} classes. THE CALL GRAPH IS `
      + `EXTRACTED, never declared: the save-path closure holds ${SAVE_CLOSURE.nodes.length} `
      + `spans at depth ${SAVE_CLOSURE.depth}, the keeper-path closure `
      + `${KEEPER_CLOSURE.nodes.length} at depth ${KEEPER_CLOSURE.depth}, neither capped. `
      + '⭐ The needle `lnOwnLane` is LIVE on this corpus '
      + `(${OWN_LANE_ANYWHERE.length} span(s) carry it), and NONE of them is in the keeper `
      + 'closure — the anchored evidence for NOT walking world 14',
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
    note: '⭐ X-DET, TWICE: each of the two out-of-band scratch seeds is walked TWICE per arm, '
      + 'OBSERVED both times, and both the whole-match signature AND this instrument\'s own '
      + `per-seed row bytes are identical on all ${xDetRows.length} pairs`,
  },
  gFingerprintProd: {
    ok: FP_PROD_OK,
    note: '⭐⭐ X-FP-PROD: the production fingerprint is RECOMPUTED IN THIS PROCESS by the '
      + 'shipped recipe (`new League({ seed: 1337 })`, `runHeadless` to generation + 2, sha256 '
      + `of the save JSON) and equals the literal of record ${FP_PROD_PIN}. A census cannot `
      + 'move it — and this gate proves the tree it ran on did not',
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
        && ALL_SCRATCH.every((s) => s >= 900_000_000))
      : (walkedSeeds.length === N && walksBooked === (N + 1) * ARMS.length
        && ALL_SCRATCH.every((s) => s >= 900_000_000)),
    note: 'BOOKED = WALKED, derived from the CELLS\' OWN distinct seeds: every battery seed and '
      + 'the construction receipt lie inside block 12,551,000–999, each seed is walked ONCE PER '
      + `ARM (${ARMS.length} arms ⇒ ${walksBooked} walks booked), the unwalked tail is DECLARED `
      + 'in the `seeds` block, and EVERY scratch seed this instrument walks (the lockstep pair, '
      + 'which the X-DET pairs re-use, and the world pin) is out-of-band and STORED there — '
      + 'canon, VERBATIM: "verifier scratch walks use the stage\'s own consumed band or the '
      + 'out-of-band scratch range (≥ 900,000,000) — never the next virgin block"',
  },
  gSeedDisjoint: {
    ok: walkedSeeds.every((s) => s >= 12_551_000) && ALL_SCRATCH.every((s) => s >= 900_000_000)
      && (IS_OVERRIDE || (walkedSeeds[0] === BLOCK_BASE && RECEIPT_SEED === BLOCK_TOP)),
    note: 'SEED-DISJOINT at the frontier of #397 item 8 (next sim ≥ 12,551,000): every battery '
      + 'seed is ≥ 12,551,000 and inside THIS block, disjoint from every consumed block '
      + '(LN-C0 12,544,000–999 · LN-T1 …545 · LN-C1 …546 · LN-C2 …547 · LN-C3 …548 · LN-T1′ '
      + '…549 · LN-T1′b 12,550,000–999); ZERO stats consumed',
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
  gLoo: {
    ok: ARMS.every((armK) => LOO[armK].selectorAlwaysSame),
    note: '⭐ LEAVE-ONE-CLUSTER-OUT on the TWO read-bearing selectors, PER ARM: dropping any '
      + 'single match seed leaves the SELECTED READ unchanged. ⚠ SCOPED — this is a stability '
      + 'check on the selectors, not a confidence statement about any face',
  },
};

/* ========================================================================== */
/* §17 THE ARTIFACT — COMPACT JSON (canon, VERBATIM: "an artifact is written as compact JSON
   — no indentation; the hash is over the canonical body regardless; pretty-printing is a
   reader's tool, not a storage form")                                                       */
/* ========================================================================== */
const perSeedCells = cells.map((c) => ({
  seed: c.seed, ...Object.fromEntries(ARMS.map((armK) => [armK, c.rows[armK]])),
}));
const BODY_SCHEMA = [
  'stage', 'gates', 'allGreen', 'faces', 'deltas', 'reads', 'medians', 'bins', 'definitions',
  'arms', 'keeperClasses', 'bodyClasses', 'saveKinds', 'actions', 'codeFacts', 'renderFacts',
  'doseSource', 'worldPin', 'seeds', 'stats', 'anchoredSites', 'fixtures', 'lockstep',
  'determinism', 'fingerprintProd', 'loo', 'perf', 'sizing', 'perSeedCells',
  'constructionReceipt',
] as const;

const artifact: Record<string, unknown> = {
  stage: {
    id: 'GK-C0',
    title: '「门将瞬移」 THE KEEPER-JUMP CENSUS — every keeper tick\'s |Δpos| against his own '
      + 'integration cap by state · every save joined to `shotLog` and the engine\'s own event '
      + 'text with the ball↔keeper distance and the ball\'s next-tick jump after a catch · all '
      + 'bodies\' written ticks by role · the `pos` write sites over the EXTRACTED call graph, '
      + 'on world 13 EMPTY-BOOK (the read of record) and DOSED arms paired on shared seeds',
    doc: 'docs/world-model/GK-C0-KEEPER-JUMP-CENSUS.md',
    censusFormOfRecord: 'docs/world-model/LN-C0-LANE-CENSUS.md',
    authorizedBy: 'COMMANDER RULING #397 item 5',
    userSentenceVerbatim: '并且门将现在仍然有的时候最后一刻突然瞬移到球的那个地方',
    kind: 'CENSUS — it publishes MEASUREMENTS. It scores no hypothesis, ARMS NO MECHANISM and '
      + 'SHIPS NOTHING: it NAMES which of three stories is true. The READ SENTENCES of #397 '
      + 'item 5(vi) are FROZEN LITERALS selected by STORED booleans. The commander rules.',
    xSrcZero: 'no file under `src/` or `tests/` is created or edited. The probe reads public '
      + '`Match` / `Team` / `Player` / `Ball` state before and after `match.step(DT)`. THERE IS '
      + 'NO WRAPPER — `gLockstep` proves observed ≡ unobserved byte for byte PER ARM.',
    canonEngineLedgersBeforeHeuristics: 'VERBATIM: "an event attribution reads the engine\'s '
      + 'own record when one exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic '
      + 'is written only where no record exists, and says so" (home: RC-T1B-READY-EXAM.md '
      + '§COMMANDER CORRECTIONS item 5, ruling #381 item 3). WHAT IS READ FROM THE ENGINE: '
      + 'every position and velocity, `topSpeed`, `saveAnimTimer`, `gkHoldTimer`, '
      + '`gkDistributing`, `action.type`, `rosterIdx`, `match.phase`, `match.restartKickGid`, '
      + '`match.shotLog[].outcome` and the `save` EVENTS\' own text. WHAT IS A DECLARED '
      + 'RECONSTRUCTION: `keeperReach` (module-private — rebuilt from its anchored constants, '
      + 'fixture-pinned) and the SAVE-TICK geometry (read POST-STEP, since the save resolves '
      + 'inside `stepBall`; the size of that gap is published as '
      + '`save.beyondStretchShare`). WHAT IS A DECLARED PROXIMITY MARKER (not call-site '
      + 'attribution): `crowded` and `nearHoldingKeeper`, and the doc says so.',
    mode: MODE ?? 'full', overrideReasons: OVERRIDE_REASONS,
    generatedAtUtc: new Date().toISOString(),
    instrument: INSTRUMENT_PATH,
    instrumentSha256: sha(readFileSync(INSTRUMENT_PATH, 'utf8')),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: Object.fromEntries(Object.keys(SRC_OF).map((p) => [p, sha(SRC_OF[p])])),
  },
  arms: ARMS.map((armK) => ({
    arm: armK, label: ARM_LABEL[armK],
    composition: armK === 'E13'
      ? 'a4MatchFlags(13) as construction flags + armA4World(m, null, 13) — the EMPTY-BOOK '
        + 'form, world 13\'s own composition CALLED. THE READ OF RECORD.'
      : 'a4MatchFlags(13) + armA4World(m, null, 13, l3Dose, pcDose) via the SHIPPED LOADERS — '
        + 'the form the user plays; the two arms differ ONLY in the two DOSES.',
    gate: `bqArmedVersion(m) === ${BQ_WORLD_VERSION} and lnArmedVersion(m) !== `
      + `${LN_WORLD_VERSION}`,
  })),
  worldFourteenNotWalked: '⛔ WORLD 14 IS NOT WALKED. Its ONE door (`lnOwnLanePrice`, '
    + '`LN_WORLD_DOORS`) is read in exactly one span on the whole `src/sim` + `src/ai` corpus '
    + `(${OWN_LANE_ANYWHERE.join(', ')}), and that span is NOT in the EXTRACTED keeper-path `
    + `closure (${KEEPER_CLOSURE.nodes.length} spans, depth ${KEEPER_CLOSURE.depth}, rooted at `
    + '`tryKeeperSave` · `giveBall` · `decideGoalkeeper` · the carry law\'s `stepBall` · the '
    + 'executor\'s `executeAction`). The boolean is `codeFacts.ownLaneDoorAbsentFromKeeperPaths`.',
  keeperClasses: {
    vocabulary: KEEPER_CLASSES,
    labels: {
      substitution: 'the body\'s `rosterIdx` CHANGED across the tick — a new man, placed by the '
        + 'substitute constructor',
      restartPlacement: 'the ENGINE\'S OWN phase says restart: `match.phase !== "playing"` at '
        + 'the end of the tick, or the phase CHANGED across it (the `setupKickoff` tick, which '
        + 'calls `resetForKickoff` for every body, is exactly such a change)',
      saveWindow: '`saveAnimTimer > 0` at the end of the tick — inside the 0.7 s dive window',
      hold: '`gkHoldTimer > 0 || gkDistributing` — the ball in his hands',
      actGoalkeeperSave: 'his chosen action was `GoalkeeperSave`',
      actGoalkeeperRush: '`GoalkeeperRush`', actGoalkeeperPosition: '`GoalkeeperPosition`',
      actChaseBall: '`ChaseBall`', actMakeRun: '`MakeRun`', actPass: '`Pass`',
      unclassified: 'ANY OTHER action — COUNTED, never pooled, and able to FIRE (a keeper '
        + 'action outside the six named ones lands here)',
    },
    precedence: 'substitution > restartPlacement > saveWindow > hold > the six named actions > '
      + 'unclassified, FROZEN before any battery seed. WHY: an identity change is not the same '
      + 'body at all; then the engine\'s own restart state (never a timing heuristic); then the '
      + 'two keeper states the ruling names; then the action he chose.',
    crossTabs: 'the class ladder is a PARTITION, but the per-tick attributes are ALSO stored '
      + 'independently (`keeperSaveWindowTicks`, `keeperHoldTicks`, `keeperRestartTicks`, '
      + '`keeperSubTicks`, `keeperActionTicks`, `keeperWrittenAction`, `keeperWrittenCrowded`, '
      + '`keeperWrittenNearHoldingOpp`), so a written tick can be read on any axis.',
  },
  bodyClasses: {
    vocabulary: BODY_CLASSES,
    labels: {
      substitution: 'the outfielder\'s `rosterIdx` changed across the tick',
      restartPlacement: 'the engine\'s own restart state (as above)',
      holdClearance: '⭐ he was inside `GK_HOLD_CLEARANCE` = 3 m of an OPPOSING keeper who was '
        + 'HOLDING at the tick — the shape the hold-clearance law displaces',
      kickProtection: '`match.restartKickGid !== null` — the kick-protection clearance is live',
      overlapPush: 'another body was inside `PLAYER_MIN_DIST` at the tick\'s start — the '
        + 'overlap resolver\'s own shape',
      unclassified: 'none of the above — COUNTED',
    },
    warning: '⚠ the last three are PROXIMITY MARKERS read at the tick, not call-site '
      + 'attribution. They say the body was in the SHAPE those laws displace; they do not '
      + 'claim the law fired.',
  },
  saveKinds: {
    vocabulary: SAVE_KINDS,
    read: '⭐⭐ READ OFF THE ENGINE\'S OWN EVENT TEXT — all FOUR `pushEvent(\'save\', …)` sites '
      + 'in `src/` are anchored: `catches it` and `parries!` (the two `tryKeeperSave` '
      + 'outcomes), `claims the high ball` (`tryAerial`) and `smothers at …` (`trySmother`). '
      + '`otherSaveEvent` is the counted else-branch and CAN fire.',
  },
  actions: ACTION_CELLS,
  definitions: {
    theWrittenPredicate: '⭐⭐ A TICK IS WRITTEN iff |Δpos| > topSpeed · DT · (1 + EPS), EPS = '
      + '1e-6. |Δpos| is the body\'s realised per-tick displacement, read off the engine\'s own '
      + 'position series (before / after `match.step(DT)`); `topSpeed` is the body\'s OWN getter '
      + '(`baseSpeed · (0.62 + 0.38 · stamina)`, anchored) READ BEFORE THE STEP, and '
      + '`physicsStep` clamps the desired velocity to exactly that before integrating '
      + '`pos += vel · dt` (both anchored). ⚠ Stamina only FALLS inside a step, so the pre-step '
      + 'cap is an UPPER BOUND on the cap the integrator used: the predicate can only '
      + 'UNDER-count written ticks. Fixture-pinned on real bodies both ways.',
    theBallJumpPredicate: '⭐⭐ A CATCH\'s ball JUMPED iff the ball\'s displacement on the tick '
      + 'AFTER the catch exceeds the CATCHING KEEPER\'s own `topSpeed · DT` (his topSpeed at '
      + 'that next tick\'s start). WHY the keeper\'s cap: the question is whether the ball '
      + 'travelled further than the hands could have carried it.',
    theSaveTickGeometry: '⚠ A DECLARED RECONSTRUCTION. `tryKeeperSave` runs inside `stepBall`, '
      + 'AFTER every body has integrated and been clamped, so the POST-STEP keeper position is '
      + 'the one the engine used unless a later writer in the same tick moved him; the BALL, '
      + 'however, is read after the whole step. `save.beyondStretchShare` publishes how often '
      + 'the post-step distance already exceeds the engine\'s own fingertip envelope — the '
      + 'honest size of the gap. The `saveP` inputs are NOT reconstructed (#397 item 5(iii)).',
    theReachReconstruction: '⭐⭐ `keeperReach` carries no `export`. Its four constants are '
      + 'EXTRACTED from the two anchored source lines and the reconstruction '
      + '`2.05 + keeperAggression · 0.4 + (reflexes − 0.5) · 0.5 + (cat ? 0.12 : 0)` is '
      + 'fixture-pinned against them term by term. `SAVE_STRETCH` = 1.35 is anchored.',
    theRestartState: '⭐⭐ THE ENGINE\'S OWN FIELDS, never a timing heuristic: `match.phase` at '
      + 'the end of the tick and across it, and `match.restartKickGid` for the kick-protection '
      + 'window. The kick-off placement (`resetForKickoff` for every body, then the own-half '
      + 'clamp, then the kicker onto the centre spot) happens inside `setupKickoff`, which sets '
      + '`phase = "kickoff"` — a phase CHANGE, which is exactly what the predicate reads.',
    binEdges: {
      note: '⚠ every width/count here is a STORED BIN EDGE of a histogram — never a rule and '
        + 'never a threshold: no read word and no stored boolean depends on one.',
      displacementM: { width: DISP_BIN_M, bins: DISP_BINS },
      displacementOverCapRatio: { width: RATIO_BIN, bins: RATIO_BINS },
      saveDistanceM: { width: SAVEDIST_BIN_M, bins: SAVEDIST_BINS },
      ballToGoalLineM: { width: GOALDIST_BIN_M, bins: GOALDIST_BINS },
      ballSpeedMs: { width: BALLSPEED_BIN, bins: BALLSPEED_BINS },
      ballDisplacementAfterSaveM: { width: BALLJUMP_BIN_M, bins: BALLJUMP_BINS },
    },
    engineConstants: {
      DT, GK_CLAIM_HEIGHT, GK_HOLD_CLEARANCE, GK_CONTROL_MAX_SPEED, GK_RUSH_ENVELOPE,
      CONTROL_RADIUS, PLAYER_MIN_DIST, HALF_L,
      SAVE_STRETCH: SAVE_STRETCH_RECON,
      keeperReachTerms: { base: REACH_BASE, aggression: REACH_AGGR,
        reflexMid: REACH_REFLEX_MID, reflexWeight: REACH_REFLEX_W, cat: REACH_CAT },
      EPS,
    },
  },
  codeFacts: {
    what: '⭐⭐ canon, VERBATIM: "a code-fact boolean about what a function reads or does not do '
      + 'is derived from the function\'s WHOLE text and from every callee whose return enters '
      + 'the read, each pinned by an anchored text hash — the call graph it was checked over is '
      + 'stored beside the boolean; … the callee list is EXTRACTED from the hashed text — every '
      + 'identifier called within the span, resolved to its definition and hashed — never '
      + 'typed" (homes: LN-C1 §CORR 1–2, LN-C2 §CORR 1, LN-C3 §CORR 2).',
    corpus: { dirs: GRAPH_DIRS, files: GRAPH_FILES.length, spans: SPANS.length },
    needles: {
      posWrite: POS_WRITE_RE.source,
      widened: '⭐ a SUPERSET of #397 item 5(v)\'s three forms: the compound assignments '
        + '(`+=` / `-=`) are included because `resolveOverlaps` writes a body\'s position with '
        + '`+=`, and a census that missed it would be a needle list, not a census.',
    },
    writeClasses: WRITE_CLASSES,
    writeClassRules: 'FROZEN ORDERED: GK_HOLD_CLEARANCE in the line → holdClearance; kickClear '
      + '→ kickProtection; enclosing `physicsStep` → integration; `becomeSub` → substitution; '
      + `${RESTART_FNS.join(' / ')} → restartPlacement; \`resolveOverlaps\` → overlapResolve; `
      + '`clampPlayersToPitch` or the pitch-clamp expression → pitchClamp; BOX_DEPTH → '
      + 'boxEdgeClamp; `removeFromPitch` → sentOffApron; a BALL subject (or `Ball.ts`) → '
      + 'ballPlacement; the three snapshot files → snapshotCopy; else `other` (COUNTED).',
    writeSites: WRITE_SITES,
    writeSitesByClass: Object.fromEntries(WRITE_CLASSES.map((c) => [c,
      WRITE_SITES.filter((w) => w.klass === c).length])),
    savePath: {
      roots: savePathBodies.map((s) => ({ span: spanKey(s), sha: s.sha })),
      ownBodyPlayerPosWrites: SAVE_PATH_OWN_WRITES,
      savePathWritesNoKeeperPos,
      closure: {
        nodes: SAVE_CLOSURE.nodes.map((s) => ({ span: spanKey(s), sha: s.sha })),
        depth: SAVE_CLOSURE.depth, capped: SAVE_CLOSURE.capped,
        externals: SAVE_CLOSURE.externals,
      },
      closurePlayerPosWrites: SAVE_CLOSURE_WRITES,
      savePathClosureWritesNoKeeperPos,
      note: '⭐⭐ TWO BOOLEANS, both stored, both narrow. (a) `savePathWritesNoKeeperPos` — '
        + 'NEITHER `tryKeeperSave`\'s OWN text NOR `giveBall`\'s OWN text contains a player '
        + '`pos` write (ball writes are excluded by subject and listed separately). (b) '
        + '`savePathClosureWritesNoKeeperPos` — the same over the whole EXTRACTED transitive '
        + 'closure. If (b) is false, every reaching site is NAMED in `closurePlayerPosWrites` '
        + 'with its class, and POPULATION A measures what actually happens on the pitch.',
    },
    keeperPaths: {
      roots: KEEPER_PATH_ROOTS.map((s) => ({ span: spanKey(s), sha: s.sha })),
      rootsComplete: ROOTS_COMPLETE,
      closureNodes: KEEPER_CLOSURE.nodes.map((s) => ({ span: spanKey(s), sha: s.sha })),
      closureDepth: KEEPER_CLOSURE.depth, closureCapped: KEEPER_CLOSURE.capped,
      ownLaneHitsInClosure: OWN_LANE_HITS,
      ownLaneSpansAnywhere: OWN_LANE_ANYWHERE,
      ownLaneNeedleIsLive,
      ownLaneDoorAbsentFromKeeperPaths,
    },
  },
  renderFacts: {
    what: '⛔ A RENDER FACT — ANCHORED AND DOCUMENTED, NEVER MEASURED BY THIS SIM CENSUS. The '
      + 'renderer stretches the keeper\'s sprite during the dive window; nothing below is a '
      + 'quantity this census sampled.',
    diveWindowSeconds: 0.7,
    kIsTimerOverWindow: 'k = `p.saveAnimTimer / 0.7` (`MatchRenderer.ts`, anchored)',
    scaleX: '1 + 0.7 · k', scaleY: '1 − 0.35 · k',
    diveDir: 'frozen at dive start, `Math.atan2(ball.pos.y − p.pos.y, ball.pos.x − p.pos.x)` — '
      + 'the sprite ROTATES TO POINT AT THE BALL and stretches up to 1.7× along that axis',
    theClaimIsShorter: '⚠ the high-ball claim sets `saveAnimTimer = 0.6` while the renderer '
      + 'still divides by 0.7, so a claim\'s dive starts at k ≈ 0.857 — anchored, not measured.',
  },
  doseSource: {
    files: { [L3_DOSE_FILE]: L3_DOSE_BYTES_SHA, [PC_DOSE_FILE]: PC_DOSE_BYTES_SHA },
    pinned: { [L3_DOSE_FILE]: L3_DOSE_PIN, [PC_DOSE_FILE]: PC_DOSE_PIN },
    matchesPins: L3_DOSE_BYTES_SHA === L3_DOSE_PIN && PC_DOSE_BYTES_SHA === PC_DOSE_PIN,
    pcDoseGuardBytesChecked: pcDoseGuard.bytesChecked,
    reachable: DOSED_ARM_REACHABLE, loadError: DOSE_LOAD_ERROR,
  },
  worldPin: { seed: WORLD_PIN_SEED, rows: worldPin, ok: WORLD_PIN_OK },
  anchoredSites: ANCHORS, fixtures: FIXTURES, lockstep: lockstepRows, determinism: xDetRows,
  fingerprintProd: { pinned: FP_PROD_PIN, computed: FP_PROD_GOT, ok: FP_PROD_OK,
    recipe: 'new League({ seed: 1337 }) → runHeadless to generation + 2 → sha256 of the save '
      + 'JSON (the shipped `scripts/fingerprint.ts` recipe, recomputed in-process)',
    matches: fpOut.matches },
  loo: LOO,
  sizing: {
    form: 'se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/'
      + 'se(needed))²) · MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975',
    varianceSource: 'THIS census\'s own 12-cluster SCRATCH SMOKE (seeds 900,004,600–611), '
      + 'DISCLOSED IN FULL at the doc\'s §DEV-PREFLIGHT. ⚠ 12 clusters is a NOISY variance '
      + 'estimate. N_FROZEN takes the BLOCK\'S AFFORDANCE after the construction receipt.',
    nFrozen: N_FROZEN, arms: ARMS.length, blockAffords: N_FROZEN, rows: sizingRows,
  },
  gates,
  allGreen: Object.values(gates).every((g) => g.ok),
  faces, deltas,
  reads: {
    note: '⭐⭐ #397 item 5(vi)\'s SENTENCES are FROZEN LITERALS. The selectors are STORED '
      + 'BOOLEANS: `keeperWrittenOutsideRestarts` (any written keeper tick outside the '
      + 'restartPlacement / substitution classes) and `ballJumpsAtCatch` (the share of catches '
      + 'whose next-tick ball displacement exceeds the keeper\'s own topSpeed · DT is > 0.5). '
      + 'READ 2 is selected whenever the keeper is written; else READ 1 if the ball jumps; else '
      + 'READ 3. The READ OF RECORD is E13\'s; D13\'s is computed by the SAME frozen rule and '
      + 'stored beside as the counterfactual word. ⛔ READ 2\'s `<class>` placeholder is NEVER '
      + 'spliced: the dominant class is stored and printed on its OWN annotation line.',
    sentences: READ_SENTENCES,
    agreementSentences: AGREE_SENTENCE,
    perArm: READS,
    readOfRecord: READ_OF_RECORD,
    readOfRecordArm: 'E13',
    annotation: READ_ANNOTATION,
    dosedAgrees: DOSED_AGREES,
    agreementWordPrinted: AGREE_WORD,
    counterfactualWordForD13: READS.D13.sentence,
    opponentDisplacementSharePrintedBeside: READS.E13.opponentDisplacementShare,
  },
  medians: {
    note: '⭐ every median below is BIN-DERIVED (the lower edge of the bin whose cumulative '
      + 'count first reaches n/2) from the stored bins, so `gFaces` re-derives each one off the '
      + 'SERIALIZED artifact — canon, VERBATIM: "the re-derivation gate covers EVERY published '
      + 'face; a percentile face requires stored bins"',
    values: medians,
  },
  bins: Object.fromEntries(ARMS.map((armK) => [armK, {
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
    outfieldClassTicks: { vocabulary: BODY_CLASSES, pooled: pooled[armK].outfieldClassTicks },
    outfieldWrittenByClass: { vocabulary: BODY_CLASSES,
      pooled: pooled[armK].outfieldWrittenByClass },
    outfieldMaxDisplacementByClassMetres: { vocabulary: BODY_CLASSES,
      pooled: pooled[armK].outfieldMaxDispByClass },
    outfieldDisplacementM: { width: DISP_BIN_M, bins: DISP_BINS,
      pooled: pooled[armK].outfieldDispBins },
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
    xDetScratchSeedsWalked: XDET_SEEDS,
    worldPinScratchSeedWalked: WORLD_PIN_SEED,
    smokeScratchBand: [SCRATCH_BASE, SCRATCH_BASE + 99],
    smokeScratchSeeds: [SCRATCH_BASE, SCRATCH_BASE + 11],
    smokeReceiptSeed: SCRATCH_BASE + 20,
    fixtureScratchSeed: 900_004_699,
    bootstrapRngSeededFrom: BLOCK_BASE, bootstrapDraws: BOOTSTRAP,
  },
  stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 80 },
  perf: {
    batteryWallSeconds: (Date.now() - t0Wall) / 1000,
    meanWallSecondsPerMatch: ARMS.reduce(
      (a, armK) => a + armRows(armK).reduce((b, r) => b + r.wallMs, 0), 0,
    ) / 1000 / (cells.length * ARMS.length),
    note: '⚠ A MACHINE READING ON ONE MACHINE. The timed region is the WALK, the per-tick '
      + 'observation included — never the game\'s frame cost.',
  },
  honestLimitsNote: '⛔ canon, VERBATIM: "a stage doc\'s HONEST LIMITS list is the ONE home; '
    + 'the artifact stores that list verbatim or stores none" (home: '
    + 'RC-C0-COOPERATION-CENSUS.md §COMMANDER CORRECTIONS item 3, ruling #367 item 3). THIS '
    + 'ARTIFACT STORES NONE. The list of record is '
    + 'docs/world-model/GK-C0-KEEPER-JUMP-CENSUS.md §HONEST LIMITS.',
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
  loo: typeof LOO;
};
/** ⭐ JSON HAS NO NaN LITERAL: a face on an EMPTY class is NaN and `JSON.stringify` writes it
 *  as `null`. The gate recognises `null` as the SERIALIZATION of NaN — and nothing else. */
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
for (const armK of ARMS) {
  const rows = disk.perSeedCells.map((c) => c[armK]);
  const got = poolFrom(rows);
  const b = disk.bins[armK];
  const cmp = (key: string, want: unknown): void => {
    binChecks.push({ bin: `${armK}.${key}`,
      ok: JSON.stringify(want) === JSON.stringify(b[key]?.pooled ?? []) });
  };
  cmp('keeperClassTicks', got.keeperClassTicks);
  cmp('keeperWrittenByClass', got.keeperWrittenByClass);
  cmp('keeperMaxDisplacementByClassMetres', got.keeperMaxDispByClass);
  cmp('keeperDisplacementInSaveWindowM', got.keeperDispBinsSave);
  cmp('keeperDisplacementOutsideSaveWindowM', got.keeperDispBinsOutside);
  cmp('keeperDisplacementOverCapRatio', got.keeperRatioBins);
  cmp('keeperActionTicks', got.keeperActionTicks);
  cmp('keeperWrittenAction', got.keeperWrittenAction);
  cmp('saveKinds', got.saveEvents);
  cmp('saveDistanceM', got.saveDistBins);
  cmp('catchDistanceM', got.catchDistBins);
  cmp('ballToGoalLineAtSaveM', got.goalDistBins);
  cmp('ballSpeedAtSaveMs', got.ballSpeedBins);
  cmp('ballDisplacementAfterCatchM', got.catchJumpBins);
  cmp('ballDisplacementAfterParryM', got.parryJumpBins);
  cmp('outfieldClassTicks', got.outfieldClassTicks);
  cmp('outfieldWrittenByClass', got.outfieldWrittenByClass);
  cmp('outfieldMaxDisplacementByClassMetres', got.outfieldMaxDispByClass);
  cmp('outfieldDisplacementM', got.outfieldDispBins);
  binChecks.push({ bin: `${armK}.medians.allBinDerived`,
    ok: JSON.stringify(mediansFrom(got)) === JSON.stringify(disk.medians.values[armK]) });
  /* ⭐ THE PARTITIONS re-derive off disk too */
  binChecks.push({ bin: `${armK}.partition.keeperClassSumsToKeeperTicks`,
    ok: sum(got.keeperClassTicks) === sum(rows.map((r) => r.keeperTicks))
      && sum(got.keeperActionTicks) === sum(rows.map((r) => r.keeperTicks))
      && sum(got.keeperDispBinsSave) + sum(got.keeperDispBinsOutside)
        === sum(rows.map((r) => r.keeperTicks))
      && sum(got.keeperRatioBins) === sum(rows.map((r) => r.keeperTicks)) });
  binChecks.push({ bin: `${armK}.partition.writtenIsInsideItsClass`,
    ok: KEEPER_CLASSES.every((c) => got.keeperWrittenByClass[KCI(c)]
      <= got.keeperClassTicks[KCI(c)])
      && sum(got.keeperWrittenByClass) === sum(rows.map((r) => r.keeperWritten))
      && sum(got.keeperWrittenAction) === sum(rows.map((r) => r.keeperWritten)) });
  binChecks.push({ bin: `${armK}.partition.outsideRestartsIsTheComplement`,
    ok: sum(rows.map((r) => r.keeperWrittenOutsideRestarts))
      === sum(rows.map((r) => r.keeperWritten))
        - RESTART_FAMILY.reduce((a, c) => a + got.keeperWrittenByClass[KCI(c)], 0) });
  binChecks.push({ bin: `${armK}.partition.saveKindsSumToEvents`,
    ok: sum(got.saveEvents) === sum(rows.map((r) => sum(r.saveEvents)))
      && sum(got.saveDistBins) === sum(got.saveEvents)
      && sum(got.goalDistBins) === sum(got.saveEvents)
      && sum(got.ballSpeedBins) === sum(got.saveEvents) });
  binChecks.push({ bin: `${armK}.partition.catchBinsInsideCatches`,
    ok: sum(got.catchDistBins) === got.saveEvents[SKI('catch')]
      && sum(got.catchJumpBins) === sum(rows.map((r) => r.catchNext))
      && sum(rows.map((r) => r.catchNext)) <= got.saveEvents[SKI('catch')]
      && sum(rows.map((r) => r.catchJumps)) <= sum(rows.map((r) => r.catchNext)) });
  binChecks.push({ bin: `${armK}.partition.outfieldClassSumsToOutfieldTicks`,
    ok: sum(got.outfieldClassTicks) === sum(rows.map((r) => r.outfieldTicks))
      && sum(got.outfieldDispBins) === sum(rows.map((r) => r.outfieldTicks))
      && sum(got.outfieldWrittenByClass) === sum(rows.map((r) => r.outfieldWritten)) });
}
/** ⭐⭐ THE READ WORDS, re-derived from the SERIALIZED per-seed cells */
for (const armK of ARMS) {
  const rows = disk.perSeedCells.map((c) => c[armK]);
  const stored = (disk.reads.perArm as Record<string, ReadBlock>)[armK];
  const outside = sum(rows.map((r) => r.keeperWrittenOutsideRestarts));
  const bjN = sum(rows.map((r) => r.catchJumps));
  const bjD = sum(rows.map((r) => r.catchNext));
  const bjShare = ratio(bjN, bjD);
  const kB = outside > 0;
  const bB = Number.isFinite(bjShare) && bjShare > 0.5;
  const sel = kB ? 'READ_2' : bB ? 'READ_1' : 'READ_3';
  const sentence = sel === 'READ_1' ? READ_1 : sel === 'READ_2' ? READ_2 : READ_3;
  binChecks.push({ bin: `reads.${armK}.selectorsRederive`,
    ok: kB === stored.keeperWrittenOutsideRestarts
      && outside === stored.keeperWrittenOutsideRestartsCount
      && bB === stored.ballJumpsAtCatch && sameNum(bjShare, stored.ballJumpShare)
      && bjN === stored.ballJumpNumerator && bjD === stored.ballJumpDenominator });
  binChecks.push({ bin: `reads.${armK}.sentenceIsTheFrozenLiteral`,
    ok: sel === stored.selected && sentence === stored.sentence
      && (Object.values(READ_SENTENCES) as string[]).includes(stored.sentence) });
  const ranking = KEEPER_CLASSES
    .filter((c) => !(RESTART_FAMILY as readonly string[]).includes(c))
    .map((c) => [c as string, sum(rows.map((r) => r.keeperWrittenByClass[KCI(c)]))] as
      [string, number])
    .sort((a, b) => (b[1] - a[1]) || (a[0] < b[0] ? -1 : 1));
  binChecks.push({ bin: `reads.${armK}.dominantClassRederives`,
    ok: ranking[0][0] === stored.dominantClass && ranking[0][1] === stored.dominantClassCount
      && JSON.stringify(ranking) === JSON.stringify(stored.classRanking) });
  binChecks.push({ bin: `reads.${armK}.opponentDisplacementShareRederives`,
    ok: sameNum(ratio(sum(rows.map((r) => r.outfieldWrittenByClass[BCI('holdClearance')])),
      sum(rows.map((r) => r.outfieldWritten))), stored.opponentDisplacementShare) });
}
{
  const perArm = disk.reads.perArm as Record<string, ReadBlock>;
  const agree = perArm.E13.selected === perArm.D13.selected;
  binChecks.push({ bin: 'reads.dosedAgreementIsStored',
    ok: agree === (disk.reads.dosedAgrees as boolean)
      && (disk.reads.agreementWordPrinted as string)
        === (agree ? AGREE_SENTENCE.agrees : AGREE_SENTENCE.disagrees)
      && (disk.reads.readOfRecord as string) === perArm.E13.sentence
      && (disk.reads.counterfactualWordForD13 as string) === perArm.D13.sentence });
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
      && (nReq <= N_FROZEN) === r.resolvableAtNFrozen
      && (r.hwSmoke === 0) === r.degenerate,
  });
}
const FACES_OK = faceChecks.every((f) => f.ok) && binChecks.every((b) => b.ok);
gates.gFaces = {
  ok: FACES_OK,
  note: `${faceChecks.filter((f) => f.ok).length}/${faceChecks.length} face-and-Δ checks and `
    + `${binChecks.filter((b) => b.ok).length}/${binChecks.length} stored-bin / median / `
    + 'partition / READ-WORD / sizing checks re-derived from the SERIALIZED artifact off disk — '
    + 'canon, VERBATIM: "the re-derivation gate covers EVERY published face; a percentile face '
    + 'requires stored bins". BOTH read selectors, both printed sentences, the dominant-class '
    + 'ranking, the opponent-displacement share and the dosed-agreement word are INCLUDED',
};
gates.gReadWords = {
  ok: binChecks.filter((b) => b.bin.startsWith('reads.')).every((b) => b.ok),
  note: '⭐⭐ THE READ WORDS ARE STORED, NOT TYPED: both selector booleans, the ball-jump share '
    + 'with its numerator and denominator, the selected read, the printed sentence, the '
    + 'dominant-class RANKING and the dosed-agreement word are RE-DERIVED by applying the '
    + 'FROZEN rules to the SERIALIZED per-seed cells off disk, and every printed sentence must '
    + 'be one of the three frozen literals. canon, VERBATIM: "a universal sentence about a '
    + 'table (\'every bin\', \'the one bin\') is a stored boolean or is not written"',
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
    + `${BODY_SCHEMA.length}-key schema is complete, covers the per-seed cells, the `
    + 'construction receipt, the code facts AND `allGreen`, and EXCLUDES `hashedBodySha256`, '
    + '`gFacesDetail` and `receipts`; the body hash is computed LAST — after every body key is '
    + 'assigned — and a NON-body `receipts.hashReproducesFromFile` records that it reproduces '
    + 'from the written file',
};
gates.gStage = {
  ok: (artifact.stage as { instrument: string; instrumentSha256: string }).instrument
    === INSTRUMENT_PATH
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
banner(`GK-C0 — ${ALL_GREEN_FINAL ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to .RED'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner('--- §R1 THE KEEPER\'S WRITTEN TICKS ---');
for (const armK of ARMS) {
  banner(`  ${armK} keeper ticks/match ${f6(face('keeper.ticksPerMatch', armK).value)} · `
    + `written ${f6(face('keeper.writtenShare', armK).value)} (n=`
    + `${face('keeper.writtenShare', armK).denominator}) · outside restarts `
    + `${f6(face('keeper.writtenOutsideRestartsShare', armK).value)}`);
  banner(`    mean |Δpos| ${f6(face('keeper.meanDisplacementMetres', armK).value)} m vs cap `
    + `${f6(face('keeper.meanCapMetres', armK).value)} m · max `
    + `${f6(Math.max(...armRows(armK).map((r) => r.keeperMaxDisp)))} m`);
  banner(`    written by class: ${KEEPER_CLASSES.map((c) => `${c} `
    + `${face(`keeperClass.compositionOfWritten.${c}`, armK).numerator}`).join(' · ')}`);
}
banner('');
banner('--- §R2 THE SAVES ---');
for (const armK of ARMS) {
  banner(`  ${armK} save events/match ${f6(face('save.eventsPerMatch', armK).value)} · `
    + `ledger flips/match ${f6(face('save.ledgerFlipsPerMatch', armK).value)} · join `
    + `${f6(face('save.joinAgreementShare', armK).value)}`);
  banner(`    kinds: ${SAVE_KINDS.map((k) => `${k} ${f6(face(`saveKind.${k}`, armK).value)}`)
    .join(' · ')}  catch share (catch+parry) `
    + `${f6(face('save.catchShareOfShotSaves', armK).value)}`);
  banner(`    distance at the save ${f6(face('save.meanDistanceMetres', armK).value)} m · `
    + `reach ${f6(face('save.meanReconstructedReachMetres', armK).value)} · ×1.35 `
    + `${f6(face('save.meanReachTimesStretchMetres', armK).value)}`);
  banner(`    catches > 1 m ${f6(face('catch.gt1mShare', armK).value)} · > 2 m `
    + `${f6(face('catch.gt2mShare', armK).value)} · > 3 m `
    + `${f6(face('catch.gt3mShare', armK).value)}`);
  banner(`    ⭐ BALL JUMP at the catch ${f6(face('ballJump.catchShare', armK).value)} (n=`
    + `${face('ballJump.catchShare', armK).denominator}) · mean move `
    + `${f6(face('ballJump.catchMeanMetres', armK).value)} m · parry beside `
    + `${f6(face('ballJump.parryShare', armK).value)} / `
    + `${f6(face('ballJump.parryMeanMetres', armK).value)} m`);
}
banner('');
banner('--- §R3 ALL BODIES ---');
for (const armK of ARMS) {
  banner(`  ${armK} GK written ${f6(face('body.gkWrittenShare', armK).value)} · outfield `
    + `${f6(face('body.outfieldWrittenShare', armK).value)} · hold-clearance share of written `
    + `outfield ${f6(face('opponentDisplacement.holdClearanceShareOfWritten', armK).value)}`);
}
banner('');
banner('--- §R4 THE CODE FACTS ---');
banner(`  ${WRITE_SITES.length} pos-write sites · ${SPANS.length} spans · save closure `
  + `${SAVE_CLOSURE.nodes.length}@d${SAVE_CLOSURE.depth} · keeper closure `
  + `${KEEPER_CLOSURE.nodes.length}@d${KEEPER_CLOSURE.depth}`);
banner(`  savePathWritesNoKeeperPos = ${savePathWritesNoKeeperPos} · closure = `
  + `${savePathClosureWritesNoKeeperPos} (${SAVE_CLOSURE_WRITES.map(
    (w) => `${w.file}:${w.line} ${w.fn} [${w.klass}]`).join(', ') || 'none'})`);
banner(`  ownLaneDoorAbsentFromKeeperPaths = ${ownLaneDoorAbsentFromKeeperPaths} `
  + `(the door lives at ${OWN_LANE_ANYWHERE.join(', ')})`);
banner('');
banner('--- §R5 THE READS, PRINTED ---');
banner(`  [E13, of record] ${READ_OF_RECORD}`);
banner(`  ${READ_ANNOTATION}`);
banner(`  opponent-displacement share (beside): ${f6(READS.E13.opponentDisplacementShare)}`);
banner(`  [D13, counterfactual] ${READS.D13.sentence}`);
banner(`  opponent-displacement share (beside): ${f6(READS.D13.opponentDisplacementShare)}`);
banner(`  ${AGREE_WORD}`);
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
