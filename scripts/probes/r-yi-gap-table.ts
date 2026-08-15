/**
 * ⭐⭐ R-乙 — THE STANDING GAP TABLE (an INSTITUTION, not a one-shot).
 *
 * Stage doc: `docs/world-model/R-YI-STANDING-GAP-TABLE.md`.
 * Authority:  `docs/world-model/RULER-COVERAGE-CONTRACT.md` §1 R-乙, dispatched by ruling #271.2
 *             (blind spot 5 of §0: "THE GAP TABLE IS NOT AN INSTITUTION" — the #170–#173 census
 *             was one-shot and no arc since has re-run it).
 *
 * WHAT IT IS: a battery that measures ~20 frozen quantities of our football beside their published
 * real-football references, and APPENDS the row-set to a versioned, append-only ledger under a
 * LABEL. The standing-ness is the deliverable: two runs of this instrument diff cleanly, and the
 * drift between them is what goes to the ruling chain.
 *
 * ⭐ THE RE-RUN CLAUSE, EMBODIED:
 *   · `RYI_LABEL` names the EPOCH (e.g. `post-CB`). Every row-set carries it.
 *   · the ledger `docs/world-model/data/r-yi-gap-table-ledger.jsonl` is APPEND-ONLY: one line per
 *     (label, arm, quantity), never rewritten. A label that already has rows is a FATAL refusal,
 *     so history cannot be silently overwritten — the diff between epochs is always real.
 *   · the per-epoch detail artifact is `docs/world-model/data/r-yi-gap-table-<label>.json`.
 *
 * ⭐ THE STATUS COLUMN IS NEVER WRITTEN HERE. Every row ships `UNADJUDICATED`. Deliberate arcade
 * deviation vs gap vs unknown is the ruling chain's word (contract §1 and §4, #203). This probe
 * computes NO pass/fail against any real value, anywhere.
 *
 * ⭐⭐ INSTRUMENT ROUND WITH ONE DECLARED `src/**` CHANGE (#272.4(b), fix (i)). Everything measured
 * is a tick-walk over PUBLIC match state plus reads of the engine's own source for its constants,
 * plus CALLS into `src/game/a4World.ts` for the CB arming (never a re-typed flag). The single
 * engine change this round authorises is `cbLedger.touchPastContested` — a PURE ADDITIVE COUNTER
 * written once inside `performTouchPast` (unreachable without the CB door) and read NOWHERE in
 * `src/**`. It is the only way to key Q10/Q11 on the commensurable take-on population, and
 * `G-ADDITIVE-COUNTER` proves its additivity from the engine's own source at run time.
 * ⚠ `xSrcCleanTree` therefore proves what it now says: the working tree's `src` equals the
 * COMMITTED src, i.e. the battery measured the committed engine (it is no longer the claim "this
 * round changed no src byte", which would be false — the honest form, #272.3's own lesson).
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 / #262.2):
 *   accepted: RYI_MODE (smoke|full, REQUIRED) · RYI_LABEL (REQUIRED in BOTH modes — the sizing
 *             smoke is per-epoch too, so an epoch can never read another epoch's rates) ·
 *             RYI_N · RYI_SKIP_FP · RYI_OUT · RYI_RESUME.
 *   ANY other `RYI_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   RYI_N / RYI_SKIP_FP / RYI_OUT are OVERRIDES: each makes the run a PREFLIGHT, which may never
 *   write a canonical repo path or the canonical ledger, and REDS G-CLEAN-INVOCATION.
 *   RYI_RESUME is NOT an override — it cannot move a measured number, because pass B never
 *   resumes (X-DET is the checkpoint's integrity proof) — and it rides the UNHASHED envelope.
 *
 * ⭐ THE ENVELOPE (the CB-T1 form): `resultSha256` covers the FROZEN DESIGN + the QUANTITY LIST +
 * the MEASURED CORE and NOTHING ELSE. Every machine timing, path, git fact, preflight reason,
 * checkpoint count and invocation-dependent gate lives in the UNHASHED envelope, so the same
 * measurement re-derives the same receipt from any output path (the cross-OUT acceptance test).
 *
 * RUN:  RYI_MODE=smoke npx tsx scripts/probes/r-yi-gap-table.ts
 *       RYI_MODE=full RYI_LABEL=post-CB npx tsx scripts/probes/r-yi-gap-table.ts
 * EXIT: 0 = every HARD gate green · 1 = a gate is RED · 2 = a refusal.
 */

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { DT, MATCH_DURATION, TOUCH_CONTROL_DIST } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';
import { a4MatchFlags, armA4World, cbArmedVersion, CB_WORLD_DOSE } from '../../src/game/a4World';
import {
  ARM_DEFINITIONS, ARMS, CLOCK_LAW, CONTEXT_KEYS, QUANTITIES, type Arm, type Quantity,
} from './rYiQuantities';

/* ========================================================================== */
/* §0 ⭐ ENV — WHITELIST-OR-REFUSE incl. THE ENGINE DOORS                       */
/* ========================================================================== */
const ENV_WHITELIST = ['RYI_MODE', 'RYI_LABEL', 'RYI_N', 'RYI_SKIP_FP', 'RYI_OUT', 'RYI_RESUME'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_TRACE_CHOICE', 'EMERGENT_POS', 'PITCH_SCALE',
  'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('RYI_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  console.error('R-乙 FATAL — refused env surface. '
    + `rogue RYI_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')}; the engine doors must be UNSET.`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.RYI_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`R-乙 FATAL — RYI_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const LABEL_RE = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,31}$/;
const LABEL_ENV = process.env.RYI_LABEL;
if (LABEL_ENV === undefined || !LABEL_RE.test(LABEL_ENV)) {
  console.error('R-乙 FATAL — RYI_LABEL naming the EPOCH is REQUIRED in both modes '
    + `(matching ${String(LABEL_RE)}); the re-run clause has no meaning without it, and the `
    + 'sizing smoke is per-epoch so an epoch can never size itself off another epoch\'s rates.');
  process.exit(2);
}
const EPOCH = LABEL_ENV;
const LABEL = MODE === 'full' ? EPOCH : `smoke-${EPOCH}`;
const N_ENV = process.env.RYI_N !== undefined ? Math.max(1, Number.parseInt(process.env.RYI_N, 10)) : null;
const SKIP_FP = process.env.RYI_SKIP_FP === '1';
const OUT_ENV = process.env.RYI_OUT;
const RESUME = process.env.RYI_RESUME === '1';
const OVERRIDES = [
  { name: 'RYI_N', set: N_ENV !== null },
  { name: 'RYI_SKIP_FP', set: SKIP_FP },
  { name: 'RYI_OUT', set: OUT_ENV !== undefined },
];
const PREFLIGHT_REASONS = OVERRIDES.filter((o) => o.set).map((o) => o.name);
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
/** ⭐ PER-EPOCH: epoch 1's committed smoke stays untouched on disk, and every later epoch sizes
 *  itself on ITS OWN band's rates (booked = walked, per epoch). */
const SMOKE_PATH = `docs/world-model/data/r-yi-gap-table-sizing-smoke-${EPOCH}.json`;
const OUT_PATH = OUT_ENV
  ?? (IS_PREFLIGHT ? '/tmp/r-yi-preflight.json'
    : MODE === 'smoke' ? SMOKE_PATH : `docs/world-model/data/r-yi-gap-table-${LABEL}.json`);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('R-乙 FATAL — a PREFLIGHT invocation may not write a canonical repo path '
    + `(the canonical-write guard, #260.2(i)). Preflight because: ${PREFLIGHT_REASONS.join(' + ')}.`);
  process.exit(2);
}
/** ⭐ THE APPEND-ONLY LEDGER — the re-run clause's own artifact. */
const LEDGER_CANONICAL = 'docs/world-model/data/r-yi-gap-table-ledger.jsonl';
const LEDGER_PATH = IS_PREFLIGHT || MODE === 'smoke' ? `/tmp/r-yi-ledger-${MODE}.jsonl` : LEDGER_CANONICAL;
const CHECKPOINT_PATH = `/tmp/r-yi-checkpoint-${MODE}-${LABEL}.jsonl`;
const DONE_MARKER = `/tmp/r-yi-done-${MODE}-${LABEL}`;
const wall0 = Date.now();

/* ========================================================================== */
/* §1 SMALL TOOLS (the house forms)                                           */
/* ========================================================================== */
const canonical = (v: unknown): string => {
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
const sha = (v: unknown): string => createHash('sha256').update(canonical(v)).digest('hex');
const round = (v: number, d = 6): number => (Number.isFinite(v) ? Math.round(v * 10 ** d) / 10 ** d : Number.NaN);
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : sum(xs) / xs.length);
const allTrue = (c: Record<string, boolean>): boolean => Object.values(c).every(Boolean);
const quantileSorted = (s: readonly number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.max(0, Math.floor(q * (s.length - 1))))]);

/* ========================================================================== */
/* §2 ⭐⭐ TRACED CONSTANTS — imported, or EXTRACTED from src/** at run time      */
/*    (#200: no invented literal; every number below has a source in the engine) */
/* ========================================================================== */
const CONST_SRC_PATH = 'src/sim/constants.ts';
const MATCH_SRC_PATH = 'src/sim/Match.ts';
const CONST_SRC = readFileSync(CONST_SRC_PATH, 'utf8');
const MATCH_SRC = readFileSync(MATCH_SRC_PATH, 'utf8');
const OWN_SRC = readFileSync('scripts/probes/r-yi-gap-table.ts', 'utf8');
const lineOf = (src: string, re: RegExp): number => {
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) if (re.test(lines[i])) return i + 1;
  return 0;
};
const extractNum = (src: string, re: RegExp): number => {
  const m = re.exec(src);
  return m === null ? Number.NaN : Number(m[1]);
};
/** ⭐ THE PRESSURE RADIUS — the substrate's OWN "under pressure" switch (#173's frozen radius). */
const PRESSURE_R = TOUCH_CONTROL_DIST;
const PRESSURE_R_TEXT = extractNum(CONST_SRC, /export const TOUCH_CONTROL_DIST = ([\d.]+);/);
const PRESSURE_R_LINE = lineOf(CONST_SRC, /export const TOUCH_CONTROL_DIST = [\d.]+;/);
/** ⭐ THE MATCH CLOCK — 240 sim-seconds displayed as 90′. Never overridden by this probe. */
const MATCH_DURATION_TEXT = extractNum(CONST_SRC, /export const MATCH_DURATION = (\d+);/);
/** ⭐⭐ THE ONE CLOCK CONVENTION (fixed of record #272.3→ (ii)): the display clock's 90 is read
 *  out of the ENGINE'S OWN display-clock expression, `Match.minute()`, not typed here. */
const DISPLAY_MINUTES = extractNum(
  MATCH_SRC, /Math\.min\(45, Math\.floor\(\(this\.simTime \/ this\.duration\) \* (\d+)\)\)/);
const DISPLAY_MINUTES_LINE = lineOf(
  MATCH_SRC, /Math\.min\(45, Math\.floor\(\(this\.simTime \/ this\.duration\) \* \d+\)\)/);
const SIM_S_PER_DISPLAY_MIN = MATCH_DURATION / DISPLAY_MINUTES;
/** ⭐ THE MAPPING BOTH CONVENTIONS TURN ON: 1 sim-second = this many display-seconds. */
const DISPLAY_S_PER_SIM_S = (DISPLAY_MINUTES * 60) / MATCH_DURATION;
/** the engine's own 一脚出球 window — context for the hold distribution, traced not typed. */
const FIRST_TOUCH_S = extractNum(MATCH_SRC, /p\.firstTouchWindow = (0\.\d+);/);
const FIRST_TOUCH_LINE = lineOf(MATCH_SRC, /p\.firstTouchWindow = 0\.\d+;/);
/** Ticks after a spell's terminating tick within which a foul is attributed to it (#173's value). */
const FOUL_LOOKAHEAD_TICKS = 6;

/* ========================================================================== */
/* §3 SEEDS AND STATS — booked = walked, exact ledger                          */
/* ========================================================================== */
const BAND: readonly [number, number] = [12_479_000, 12_479_999];
const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: 'tempo census (#170–#173)', range: [12_293_000, 12_299_999] },
  { name: 'O1 / O2 / PM / MT / CTB / OBM / PTP / DLC bands', range: [12_300_000, 12_428_999] },
  { name: 'DV bands (#249–#258)', range: [12_429_000, 12_447_999] },
  { name: 'EK bands (#259–#263)', range: [12_448_000, 12_465_999] },
  { name: 'CB-C0 dispossession census (#265.4/#266)', range: [12_470_000, 12_471_799] },
  { name: 'CB-T0 dormant layer-1 seam (#266.5/#267)', range: [12_472_000, 12_472_999] },
  { name: 'CB-T1 beaten-event exam (#267.5/#268)', range: [12_473_000, 12_473_999] },
  { name: 'CB-T2 choice seat (#268.3)', range: [12_474_000, 12_474_999] },
  { name: 'CB frontend visibility rung (#269.4/#270)', range: [12_475_000, 12_475_999] },
  { name: 'R-甲 event-vocabulary census (#271.2)', range: [12_476_000, 12_476_999] },
  { name: 'R-乙 standing gap table, epoch post-CB (#271.2/#272)', range: [12_477_000, 12_477_999] },
  { name: 'CB aftermath polish (#272.4(a))', range: [12_478_000, 12_478_999] },
];
/** ⭐ THE ONE DECLARED RE-WALK: G-SEMANTICS-INHERITED re-walks the #173 census's OWN smoke block
 *  to prove this probe's spell/touch walker reproduces that instrument EXACTLY. It is a re-walk of
 *  a CONSUMED block, declared here and exempted by name in the disjointness gate (the CB-C0
 *  precedent: `gReproDvc0` re-walked DV-C0's own smoke rows). It draws no statistic. */
const REWALK = { name: 'tempo census (#170–#173) sizing smoke — the semantics receipt', base: 12_293_000, n: 40 } as const;
const SMOKE_BASE = 12_479_000; const SMOKE_N = 25;
const CORE_BASE = 12_479_100; const SEED_ROOM = 500;      // → ≤ 12,479,599
const WORLD_SEED = 12_479_900;                            // G-WORLD read-back, never stepped
/** stats: #272.4(b)'s floor is 110,400, on the 200-step grid (#163.2.iii); 110,400 is itself the
 *  CB-polish round's published base, so this epoch takes the next free rung. */
const STATS_BASE = 110_600;
const STATS_FLOOR = 110_400;
const STATS_STEP = 200;
const STATS_PUBLISHED_BASES: readonly number[] = [
  105_800, 106_000, 106_200, 106_400, 106_600, 106_800,
  107_000, 107_200, 107_400, 107_600, 107_800,
  108_000, 108_200, 108_400, 108_600, 108_800, 109_000, 109_200, 109_400,
  109_600, 109_800, 110_000,
  110_200,                                                // R-乙 epoch post-CB (#272)
  110_400,                                                // CB aftermath polish (#272.4(a))
];
const BOOTSTRAP = 2_000;
/** quantile CIs re-form the pooled sample inside every resample, so they get their own, smaller
 *  resample count — declared ex ante, and it is a PREFIX of the shared matrix so the quantile
 *  intervals stay paired with every other interval. */
const BOOTSTRAP_Q = 500;

/* --- the N rule, FROZEN before the smoke ran -------------------------------- */
/** the binding claim grain is a MATCH-LEVEL SHARE (Q17–Q19): worst-case Bernoulli variance
 *  p = 0.5, target SE ≤ 0.025 ⇒ N ≥ 0.25 / 0.025² = 400. */
const SHARE_SE_TARGET = 0.025;
/** open-play spells per arm for a readable quantile triple (#170's own target, scaled to 2 arms). */
const TARGET_SPELLS_PER_ARM = 12_000;
/** aimed knocks in the CB arm for a success-rate SE ≈ 1.3 % at p ≈ 0.5. */
const TARGET_KNOCKS_CB = 1_500;
const N_STEP = 25;
const WALL_BUDGET_HOURS = 0.5;
const XDET_FACTOR = 2;

/* ========================================================================== */
/* §4 THE ARMS — armed by CALLING src/game/a4World.ts, never by typed flags     */
/* ========================================================================== */
const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  const g = randomGenome(rng);
  const squad = randomSquad(rng);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: g, squad,
  };
};
/** ⭐ the CB world's construction flags, CALLED from the entry's own composer. */
const CB_FLAGS = a4MatchFlags(6) as unknown as Record<string, unknown>;
const CB_VERSION = 6;
const matchFor = (arm: Arm, seed: number): Match => {
  // ⭐ #173's own constructor, byte for byte (the prod arm of the tempo census).
  const base = { seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2) };
  if (arm === 'bare') return new Match(base);
  // ⭐ the entry's TWO calls: the flags at construction (the same channel League.createMatch uses —
  // it spreads `...this.matchFlags` into `new Match`), then the post-construction arming.
  const m = new Match({ ...base, ...a4MatchFlags(CB_VERSION) });
  armA4World(m, null, CB_VERSION);
  return m;
};

/* ========================================================================== */
/* §5 THE WALK — #173's spell/touch semantics, re-derived and gate-proven       */
/* ========================================================================== */
type Terminator = 'opponentControl' | 'fouledWon' | 'foulCommitted' | 'goal' | 'outOfPlay' | 'matchEnd';
interface Spell {
  team: Side; startTick: number; endTick: number; ownedTicks: number; touches: number;
  origin: 'openPlay' | 'restart' | 'kickoff'; terminator: Terminator;
  firstTouchIdx: number; lastTouchIdx: number;
}
interface Touch {
  gid: number; side: Side; spellIdx: number; startTick: number; endTick: number;
  nearestOpp: number; isFirstOfSpell: boolean;
  outcome: 'retainedSelf' | 'releasedToTeammate' | 'lost' | 'fouled' | 'foulCommitted'
  | 'goal' | 'outOfPlay' | 'matchEnd';
}
/** ONE cluster = one match seed (the #20 cluster unit). Raw counters only; every rate is derived. */
interface Row {
  seed: number;
  simSeconds: number; wallSeconds: number; totalTicks: number; inPlayTicks: number;
  ownedTicks: number; ownedTicksBySide: [number, number];
  openSpells: number; openSpellTickSum: number; openSpellDurations: number[];
  openSpellTouchSum: number;
  touches: number; holdTickSum: number; holds: number[];
  turnovers: number;
  firstReceptions: number; firstReceptionsPressed: number;
  score: [number, number];
  stats: {
    passes: number; passesCompleted: number; passesForward: number; shots: number;
    fouls: number; yellows: number; reds: number; headersWon: number; dribbles: number;
    tackles: number; interceptions: number; offsides: number; corners: number; goals: number;
  };
  cb: {
    touchPasts: number; touchPastChallengers: number; touchPastBeaten: number;
    touchPastCleanBeats: number; touchPastContested: number;
    armedChallenges: number; geometricMisses: number;
    recoveries: number; recoverySeconds: number;
  };
  cbVersionObserved: number;
}

const nearestOpponent = (m: Match, p: Player): number => {
  let best = Number.POSITIVE_INFINITY;
  for (const o of m.teams[(1 - p.side) as Side].players) {
    if (o.sentOff) continue;
    const dx = o.pos.x - p.pos.x; const dy = o.pos.y - p.pos.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < best) best = d;
  }
  return best;
};

function walkOne(arm: Arm, seed: number): Row {
  const m = matchFor(arm, seed);
  const cbVersionObserved = cbArmedVersion(m);
  const spells: Spell[] = [];
  const touches: Touch[] = [];
  const foulTicks: { tick: number; side: Side }[] = [];
  let cur: Spell | null = null;
  let curTouch: Touch | null = null;
  let prevOwnerGid: number | null = null;
  let prevFouls: [number, number] = [0, 0];
  let prevScore: [number, number] = [0, 0];
  let inPlayTicks = 0; let ownedTicks = 0;
  const ownedBySide: [number, number] = [0, 0];
  let goalThisTick = false;

  const finishSpell = (s: Spell, tick: number, terminator: Terminator): void => {
    s.endTick = tick; s.terminator = terminator; s.lastTouchIdx = touches.length - 1;
    spells.push(s);
  };
  const newSpell = (team: Side, tick: number, origin: Spell['origin']): Spell => ({
    team, startTick: tick, endTick: tick, ownedTicks: 0, touches: 0, origin,
    terminator: 'matchEnd', firstTouchIdx: touches.length, lastTouchIdx: -1,
  });

  while (!m.finished) {
    m.step(DT);
    const tick = m.simTick;
    const phase = m.phase;
    const owner = m.ball.owner;
    const ownerGid = owner === null ? null : owner.gid;

    for (const s of [0, 1] as const) {
      const f = m.teams[s].stats.fouls;
      if (f > prevFouls[s]) foulTicks.push({ tick, side: s });
      prevFouls[s] = f;
    }
    goalThisTick = m.score[0] !== prevScore[0] || m.score[1] !== prevScore[1];
    prevScore = [m.score[0], m.score[1]];

    if (prevOwnerGid !== null && ownerGid !== prevOwnerGid && curTouch !== null) {
      curTouch.endTick = tick; curTouch = null;
    }
    if (phase !== 'playing') {
      // #171.1.i — the dead-ball leak fix: the ownership episode closes at the SAME boundary
      // that closes the spell, and the resumption registers as a FRESH episode.
      if (curTouch !== null) { curTouch.endTick = tick; curTouch = null; }
      if (cur !== null) { finishSpell(cur, tick, goalThisTick ? 'goal' : 'outOfPlay'); cur = null; }
      prevOwnerGid = null;
      continue;
    }
    inPlayTicks++;
    if (owner === null) { prevOwnerGid = null; continue; }
    ownedTicks++;
    const side = owner.side;
    ownedBySide[side]++;
    if (cur !== null && cur.team !== side) { finishSpell(cur, tick, 'opponentControl'); cur = null; }
    if (cur === null) {
      const origin: Spell['origin'] = m.kickoffKickGid === owner.gid ? 'kickoff'
        : m.restartKickGid === owner.gid ? 'restart' : 'openPlay';
      cur = newSpell(side, tick, origin);
    }
    const spell: Spell = cur;
    spell.ownedTicks++;
    if (ownerGid !== prevOwnerGid) {
      const t: Touch = {
        gid: owner.gid, side, spellIdx: spells.length, startTick: tick, endTick: tick,
        nearestOpp: nearestOpponent(m, owner), isFirstOfSpell: spell.touches === 0,
        outcome: 'matchEnd',
      };
      touches.push(t); curTouch = t; spell.touches++;
    }
    prevOwnerGid = ownerGid;
  }
  if (curTouch !== null) curTouch.endTick = m.simTick;
  if (cur !== null) finishSpell(cur, m.simTick, 'matchEnd');

  for (const s of spells) {
    if (s.terminator !== 'outOfPlay') continue;
    const f = foulTicks.find((x) => x.tick >= s.endTick - FOUL_LOOKAHEAD_TICKS
      && x.tick <= s.endTick + FOUL_LOOKAHEAD_TICKS);
    if (f === undefined) continue;
    s.terminator = f.side === s.team ? 'foulCommitted' : 'fouledWon';
  }
  for (const s of spells) {
    for (let i = s.firstTouchIdx; i <= s.lastTouchIdx && i < touches.length; i++) {
      const t = touches[i];
      if (i < s.lastTouchIdx) {
        t.outcome = touches[i + 1].gid === t.gid ? 'retainedSelf' : 'releasedToTeammate';
      } else {
        t.outcome = s.terminator === 'opponentControl' ? 'lost'
          : s.terminator === 'fouledWon' ? 'fouled'
            : s.terminator === 'foulCommitted' ? 'foulCommitted'
              : s.terminator === 'goal' ? 'goal'
                : s.terminator === 'matchEnd' ? 'matchEnd' : 'outOfPlay';
      }
    }
  }

  const open = spells.filter((s) => s.origin === 'openPlay');
  const firstOpen = touches.filter((t) => t.isFirstOfSpell && spells[t.spellIdx]?.origin === 'openPlay');
  const st = [m.teams[0].stats, m.teams[1].stats] as const;
  const both = (k: keyof (typeof st)[0]): number => Number(st[0][k]) + Number(st[1][k]);
  const L = m.cbLedger;
  return {
    seed,
    simSeconds: m.simTime, wallSeconds: m.simTick * DT, totalTicks: m.simTick, inPlayTicks,
    ownedTicks, ownedTicksBySide: ownedBySide,
    openSpells: open.length,
    openSpellTickSum: sum(open.map((s) => s.endTick - s.startTick)),
    openSpellDurations: open.map((s) => (s.endTick - s.startTick) * DT),
    openSpellTouchSum: sum(open.map((s) => s.touches)),
    touches: touches.length,
    holdTickSum: sum(touches.map((t) => t.endTick - t.startTick)),
    holds: touches.map((t) => (t.endTick - t.startTick) * DT),
    turnovers: spells.filter((s) => s.terminator === 'opponentControl').length,
    firstReceptions: firstOpen.length,
    firstReceptionsPressed: firstOpen.filter((t) => t.nearestOpp <= PRESSURE_R).length,
    score: [m.score[0], m.score[1]],
    stats: {
      passes: both('passes'), passesCompleted: both('passesCompleted'),
      passesForward: both('passesForward'), shots: both('shots'), fouls: both('fouls'),
      yellows: both('yellows'), reds: both('reds'), headersWon: both('headersWon'),
      dribbles: both('dribbles'), tackles: both('tackles'),
      interceptions: both('interceptions'), offsides: both('offsides'),
      corners: both('corners'), goals: m.score[0] + m.score[1],
    },
    cb: {
      touchPasts: L.touchPasts, touchPastChallengers: L.touchPastChallengers,
      touchPastBeaten: L.touchPastBeaten, touchPastCleanBeats: L.touchPastCleanBeats,
      touchPastContested: L.touchPastContested,
      armedChallenges: L.armedChallenges, geometricMisses: L.geometricMisses,
      recoveries: L.recoveries, recoverySeconds: L.recoverySeconds,
    },
    cbVersionObserved,
  };
}

/* ========================================================================== */
/* §6 CHECKPOINTED PASS A + a naked PASS B (X-DET)                            */
/* ========================================================================== */
const rowKey = (arm: Arm, seed: number): string => `${arm}:${seed}`;
const loadCheckpoint = (): Map<string, Row> => {
  const out = new Map<string, Row>();
  if (!RESUME || !existsSync(CHECKPOINT_PATH)) return out;
  for (const line of readFileSync(CHECKPOINT_PATH, 'utf8').split('\n')) {
    if (line.trim() === '') continue;
    try {
      const r = JSON.parse(line) as { arm: Arm; row: Row };
      out.set(rowKey(r.arm, r.row.seed), r.row);
    } catch { /* a truncated tail line is simply not reused */ }
  }
  return out;
};

let freshWalks = 0;
function walkAll(seeds: readonly number[], label: string, useCheckpoint: boolean): Record<Arm, Row[]> {
  const done = useCheckpoint ? loadCheckpoint() : new Map<string, Row>();
  const out = { bare: [] as Row[], cb: [] as Row[] };
  for (const arm of ARMS) {
    for (let i = 0; i < seeds.length; i++) {
      const seed = seeds[i];
      const k = rowKey(arm, seed);
      const cached = done.get(k);
      let row: Row;
      if (cached !== undefined) { row = cached; } else {
        row = walkOne(arm, seed);
        freshWalks++;
        if (useCheckpoint) appendFileSync(CHECKPOINT_PATH, `${JSON.stringify({ arm, row })}\n`);
      }
      out[arm].push(row);
      if ((i + 1) % 25 === 0 || i + 1 === seeds.length) {
        process.stderr.write(`[r-yi ${label}] ${arm} ${i + 1}/${seeds.length}`
          + ` (fresh ${freshWalks}, ${((Date.now() - wall0) / 1000).toFixed(0)}s)\n`);
      }
    }
  }
  return out;
}

/* ========================================================================== */
/* §7 THE ESTIMATOR — cluster bootstrap by match seed, ONE shared index matrix  */
/* ========================================================================== */
type CI = [number, number];
const makeMatrix = (nClusters: number, seed: number): number[][] => {
  const rng = new Rng(seed);
  return Array.from({ length: BOOTSTRAP }, () =>
    Array.from({ length: nClusters }, () => Math.floor(rng.next() * nClusters)));
};
interface Estimate { point: number; ci95: CI; num: number; den: number; n: number }
const ratioEstimate = (num: readonly number[], den: readonly number[], M: number[][]): Estimate => {
  const N = sum(num); const D = sum(den);
  const out: number[] = [];
  for (const idx of M) {
    let a = 0; let b = 0;
    for (const j of idx) { a += num[j]; b += den[j]; }
    if (b > 0) out.push(a / b);
  }
  out.sort((x, y) => x - y);
  return {
    point: D > 0 ? round(N / D) : Number.NaN,
    ci95: out.length === 0 ? [Number.NaN, Number.NaN]
      : [round(quantileSorted(out, 0.025)), round(quantileSorted(out, 0.975))],
    num: round(N), den: round(D), n: den.length,
  };
};
/** the quantile triple with a CLUSTER bootstrap CI: the pooled sample is RE-FORMED inside each
 *  resample (a prefix of the shared matrix — see BOOTSTRAP_Q). */
const quantileEstimate = (perCluster: readonly number[][], M: number[][]): {
  p25: number; median: number; p75: number; ci25: CI; ciMed: CI; ci75: CI; n: number;
} => {
  const pooled = perCluster.flat().sort((a, b) => a - b);
  const draws: [number[], number[], number[]] = [[], [], []];
  for (let b = 0; b < Math.min(BOOTSTRAP_Q, M.length); b++) {
    const buf: number[] = [];
    for (const j of M[b]) for (const v of perCluster[j]) buf.push(v);
    buf.sort((x, y) => x - y);
    draws[0].push(quantileSorted(buf, 0.25));
    draws[1].push(quantileSorted(buf, 0.5));
    draws[2].push(quantileSorted(buf, 0.75));
  }
  const ci = (xs: number[]): CI => {
    const s = xs.filter(Number.isFinite).sort((a, b) => a - b);
    return s.length === 0 ? [Number.NaN, Number.NaN]
      : [round(quantileSorted(s, 0.025)), round(quantileSorted(s, 0.975))];
  };
  return {
    p25: round(quantileSorted(pooled, 0.25)), median: round(quantileSorted(pooled, 0.5)),
    p75: round(quantileSorted(pooled, 0.75)),
    ci25: ci(draws[0]), ciMed: ci(draws[1]), ci75: ci(draws[2]), n: pooled.length,
  };
};

/* ========================================================================== */
/* §8 THE QUANTITY TABLE — every row derived from the raw counters              */
/* ========================================================================== */
const ones = (n: number): number[] => Array.from({ length: n }, () => 1);

interface Reading { point: number; ci95: CI }
interface Readings {
  dimension: Quantity['clock']; nativeConvention: 'A' | 'B' | 'both';
  factor: number; conventionA: Reading; conventionB: Reading;
  law: string;
}
interface MeasuredRow {
  id: string; key: string; unit: string;
  point: number; ci95: CI; num: number; den: number; clusters: number;
  /** ⭐ BOTH CLOCK AXES, on EVERY row (fixed of record #272.3→ (ii)). */
  readings: Readings;
  extra?: Record<string, unknown>;
}
/**
 * ⭐⭐ THE DUAL-AXIS LAW, applied mechanically to every row from its declared `clock` dimension.
 * A duration is measured ON convention A (sim-seconds are seconds) and must be STRETCHED by the
 * engine's own mapping to be read on the display clock; a per-match count and a per-display-minute
 * rate are measured ON convention B (our match IS the 90′) and must be MULTIPLIED by the same
 * mapping to be read on sim time. `invariant` rows read identically on both — which is exactly
 * why they, and only they, were never at risk of the two-clock artifact.
 */
const readingsFor = (dim: Quantity['clock'], point: number, ci95: CI): Readings => {
  const f = DISPLAY_S_PER_SIM_S;
  const scaled = (r: Reading): Reading => ({
    point: round(r.point * f), ci95: [round(r.ci95[0] * f), round(r.ci95[1] * f)],
  });
  const native: Reading = { point, ci95 };
  if (dim === 'invariant') {
    return {
      dimension: dim, nativeConvention: 'both', factor: f,
      conventionA: native, conventionB: native,
      law: 'a SHARE (or a per-spell count) is dimensionless in time: the two conventions give the '
        + 'same number, and this row carries no clock artifact.',
    };
  }
  if (dim === 'duration') {
    return {
      dimension: dim, nativeConvention: 'A', factor: f,
      conventionA: native, conventionB: scaled(native),
      law: `convention A = the measured sim-seconds; convention B = × ${f} display-seconds per `
        + 'sim-second (the engine\'s own display-clock mapping).',
    };
  }
  return {
    dimension: dim, nativeConvention: 'B', factor: f,
    conventionA: scaled(native), conventionB: native,
    law: dim === 'perMatchCount'
      ? `convention B = the measured count per OUR match (which the display clock calls 90′); `
        + `convention A = × ${f}, the same count expressed per 90 REAL minutes.`
      : `convention B = the measured rate per display-minute; convention A = × ${f}, the rate `
        + 'per SIM-minute (what the user watches at 1×).',
  };
};
function measureArm(arm: Arm, rows: readonly Row[], M: number[][]): {
  quantities: Record<string, MeasuredRow>;
  context: Record<string, number | CI | Record<string, unknown>>;
  quantileRow: ReturnType<typeof quantileEstimate>;
} {
  const K = rows.length;
  const one = ones(K);
  const R = (num: readonly number[], den: readonly number[]): Estimate => ratioEstimate(num, den, M);
  const per = (f: (r: Row) => number): number[] => rows.map(f);
  const mk = (q: Quantity, e: Estimate, extra?: Record<string, unknown>): MeasuredRow => ({
    id: q.id, key: q.key, unit: q.unit,
    point: e.point, ci95: e.ci95, num: e.num, den: e.den, clusters: K,
    readings: readingsFor(q.clock, e.point, e.ci95),
    extra,
  });
  const byId = (id: string): Quantity => {
    const q = QUANTITIES.find((x) => x.id === id);
    if (q === undefined) throw new Error(`R-乙 internal: no quantity ${id}`);
    return q;
  };

  const quantileRow = quantileEstimate(rows.map((r) => r.openSpellDurations), M);
  const out: Record<string, MeasuredRow> = {};

  // Q01 spell mean duration (ticks → seconds, ratio of sums)
  {
    const e = R(per((r) => r.openSpellTickSum), per((r) => r.openSpells));
    out.Q01 = mk(byId('Q01'), {
      point: round(e.point * DT), ci95: [round(e.ci95[0] * DT), round(e.ci95[1] * DT)],
      num: e.num, den: e.den, n: e.n,
    }, { meanTicks: e.point, spells: e.den });
  }
  // Q02 quantiles
  out.Q02 = {
    id: 'Q02', key: byId('Q02').key, unit: byId('Q02').unit,
    point: quantileRow.median, ci95: quantileRow.ciMed,
    num: Number.NaN, den: quantileRow.n, clusters: K,
    readings: readingsFor(byId('Q02').clock, quantileRow.median, quantileRow.ciMed),
    extra: {
      p25: quantileRow.p25, ci25: quantileRow.ci25,
      median: quantileRow.median, ciMedian: quantileRow.ciMed,
      p75: quantileRow.p75, ci75: quantileRow.ci75,
      resamples: Math.min(BOOTSTRAP_Q, M.length),
    },
  };
  // Q03 hold per touch
  {
    const e = R(per((r) => r.holdTickSum), per((r) => r.touches));
    out.Q03 = mk(byId('Q03'), {
      point: round(e.point * DT), ci95: [round(e.ci95[0] * DT), round(e.ci95[1] * DT)],
      num: e.num, den: e.den, n: e.n,
    }, { meanTicks: e.point, touches: e.den });
  }
  // Q04 turnovers per display-minute (and per sim-minute in context)
  {
    const e = R(per((r) => r.turnovers), per((r) => r.simSeconds));
    const f = SIM_S_PER_DISPLAY_MIN;
    out.Q04 = mk(byId('Q04'), {
      point: round(e.point * f), ci95: [round(e.ci95[0] * f), round(e.ci95[1] * f)],
      num: e.num, den: e.den, n: e.n,
    }, {
      perSimSecond: e.point, perSimMinute: round(e.point * 60),
      perDisplayMinute: round(e.point * f), mappingFactor: round(f),
      axisLaw: `perDisplayMinute = perSimSecond × (${MATCH_DURATION} / ${DISPLAY_MINUTES})`,
    });
  }
  // Q05 touches per open-play spell
  out.Q05 = mk(byId('Q05'), R(per((r) => r.openSpellTouchSum), per((r) => r.openSpells)));
  // Q06 pass completion
  out.Q06 = mk(byId('Q06'), R(per((r) => r.stats.passesCompleted), per((r) => r.stats.passes)));
  // Q07 forward-pass share (complement pooled)
  {
    const e = R(per((r) => r.stats.passesForward), per((r) => r.stats.passes));
    out.Q07 = mk(byId('Q07'), e, {
      notForwardSharePooled: round(1 - e.point),
      pooledNote: 'BACKWARD + LATERAL, pooled: the engine has one forward counter and no direction '
        + 'field, so the split is not separable with existing semantics.',
    });
  }
  // Q08 shots per team per match
  out.Q08 = mk(byId('Q08'), R(per((r) => r.stats.shots / 2), one));
  // Q09 goals per match
  out.Q09 = mk(byId('Q09'), R(per((r) => r.stats.goals), one));
  // Q10 CONTESTED take-on attempts per team per match (RE-KEYED, #272.3→ (i))
  out.Q10 = mk(byId('Q10'), R(per((r) => r.cb.touchPastContested / 2), one), {
    bothTeamsPerMatch: round(mean(per((r) => r.cb.touchPastContested))),
    ledgerField: 'cbLedger.touchPastContested',
    allKnocksBothTeamsPerMatch: round(mean(per((r) => r.cb.touchPasts))),
    uncontestedBothTeamsPerMatch: round(mean(per((r) => r.cb.touchPasts - r.cb.touchPastContested))),
    uncontestedShare: (() => {
      const t = sum(per((r) => r.cb.touchPasts));
      return t > 0 ? round((t - sum(per((r) => r.cb.touchPastContested))) / t) : Number.NaN;
    })(),
    reKeyNote: 'epoch 1 published `touchPasts` / 2 here; the uncontested knocks are now CONTEXT, '
      + 'never folded into the take-on population (#272.3→ (i)).',
  });
  // Q11 take-on success (clean beats / CONTESTED knocks) — RE-KEYED, #272.3→ (i)
  out.Q11 = mk(byId('Q11'), R(per((r) => r.cb.touchPastCleanBeats), per((r) => r.cb.touchPastContested)), {
    onTheOldDenominator: (() => {
      const e = R(per((r) => r.cb.touchPastCleanBeats), per((r) => r.cb.touchPasts));
      return { point: e.point, ci95: e.ci95, den: e.den, note: 'epoch 1\'s form — kept so the two epochs stay comparable.' };
    })(),
  });
  // Q12 fouls per team per match
  out.Q12 = mk(byId('Q12'), R(per((r) => r.stats.fouls / 2), one));
  // Q13 yellows per match
  out.Q13 = mk(byId('Q13'), R(per((r) => r.stats.yellows), one));
  // Q14 pressed-reception share
  out.Q14 = mk(byId('Q14'), R(per((r) => r.firstReceptionsPressed), per((r) => r.firstReceptions)), {
    radiusM: PRESSURE_R, radiusTrace: `TOUCH_CONTROL_DIST, ${CONST_SRC_PATH}:${PRESSURE_R_LINE}`,
  });
  // Q15 aerials won per team per match
  out.Q15 = mk(byId('Q15'), R(per((r) => r.stats.headersWon / 2), one));
  // Q16 ground duels per team per match
  out.Q16 = mk(byId('Q16'), R(per((r) => (r.stats.tackles + r.stats.interceptions) / 2), one));
  // Q17–Q19 the margin tail
  const margin = (r: Row): number => Math.abs(r.score[0] - r.score[1]);
  out.Q17 = mk(byId('Q17'), R(per((r) => (margin(r) === 0 ? 1 : 0)), one));
  out.Q18 = mk(byId('Q18'), R(per((r) => (margin(r) === 1 ? 1 : 0)), one));
  out.Q19 = mk(byId('Q19'), R(per((r) => (margin(r) >= 3 ? 1 : 0)), one), {
    margin2Share: round(mean(per((r) => (margin(r) === 2 ? 1 : 0)))),
    marginMax: Math.max(...per(margin)),
    realBoundNote: 'the real column is UNSOURCED but bounded above by 37.0 % (Q17/Q18 complement).',
  });
  // Q20 possession balance — the PER-MATCH LEADER's share, per-match mean (#272.3→ (v))
  const perMatchMaxShare = (r: Row): number => {
    const t = r.ownedTicksBySide[0] + r.ownedTicksBySide[1];
    return t > 0 ? Math.max(r.ownedTicksBySide[0], r.ownedTicksBySide[1]) / t : Number.NaN;
  };
  out.Q20 = mk(byId('Q20'), R(per(perMatchMaxShare), one), {
    ratioOfSums: (() => {
      const e = R(
        per((r) => Math.max(r.ownedTicksBySide[0], r.ownedTicksBySide[1])),
        per((r) => r.ownedTicksBySide[0] + r.ownedTicksBySide[1]),
      );
      return { point: e.point, ci95: e.ci95, note: 'epoch 1\'s published estimator (Σmax / Σtotal) — a different functional, kept as context.' };
    })(),
    labelNote: 'the PER-MATCH LEADER, an upward-biased maximum over two random draws — NOT "the '
      + 'stronger team". 0.5 is the floor of this statistic, not its neutral value.',
  });
  // Q21 dead-ball share of the clock (+ the NOMINAL-clock re-basing, #272.3→ (vi))
  {
    const e = R(per((r) => r.totalTicks - r.inPlayTicks), per((r) => r.totalTicks));
    const nominalTicks = MATCH_DURATION / DT;
    const eNom = R(per((r) => r.totalTicks - r.inPlayTicks), per(() => nominalTicks));
    out.Q21 = mk(byId('Q21'), e, {
      inPlayShare: round(1 - e.point),
      onNominalClock: {
        point: eNom.point, ci95: eNom.ci95,
        note: 'the LIKE-FOR-LIKE reading: the real value is a share of the NOMINAL 90, so ours is '
          + 're-based on MATCH_DURATION instead of the elapsed pause-inclusive clock.',
      },
      elapsedOverNominal: round(mean(per((r) => (r.totalTicks * DT) / MATCH_DURATION))),
      denominatorNote: 'the headline divides the PAUSE-INCLUSIVE elapsed clock (simTick) — the '
        + 'only clock on which a dead-ball SHARE is meaningful, and the one #173 emitted; every '
        + 'RATE in this table divides match.simTime instead. ⚠ The real value divides the NOMINAL '
        + '90, which our elapsed clock exceeds by ≈4.7 %, so `onNominalClock` is the reading the '
        + 'distance table carries (#272.3→ (vi)).',
    });
  }

  const context: Record<string, number | CI | Record<string, unknown>> = {
    engineDribblesPerTeam: round(mean(per((r) => r.stats.dribbles / 2))),
    takeOnPerChallengerSuccess: (() => {
      const e = R(per((r) => r.cb.touchPastBeaten), per((r) => r.cb.touchPastChallengers));
      return { point: e.point, ci95: e.ci95, num: e.num, den: e.den };
    })(),
    allKnocksPerTeam: round(mean(per((r) => r.cb.touchPasts / 2))),
    uncontestedKnocksPerTeam: round(mean(per((r) => (r.cb.touchPasts - r.cb.touchPastContested) / 2))),
    uncontestedKnockShare: (() => {
      const t = sum(per((r) => r.cb.touchPasts));
      return t > 0 ? round((t - sum(per((r) => r.cb.touchPastContested))) / t) : Number.NaN;
    })(),
    takeOnSuccessAllKnocks: (() => {
      const t = sum(per((r) => r.cb.touchPasts));
      return t > 0 ? round(sum(per((r) => r.cb.touchPastCleanBeats)) / t) : Number.NaN;
    })(),
    possessionBalanceRatioOfSums: (() => {
      const d = sum(per((r) => r.ownedTicksBySide[0] + r.ownedTicksBySide[1]));
      return d > 0 ? round(sum(per((r) => Math.max(r.ownedTicksBySide[0], r.ownedTicksBySide[1]))) / d) : Number.NaN;
    })(),
    deadShareOnNominalClock: (() => {
      const nominal = (MATCH_DURATION / DT) * rows.length;
      return nominal > 0 ? round(sum(per((r) => r.totalTicks - r.inPlayTicks)) / nominal) : Number.NaN;
    })(),
    redsPerMatch: round(mean(per((r) => r.stats.reds))),
    turnoversPerSimMin: round(sum(per((r) => r.turnovers)) / sum(per((r) => r.simSeconds)) * 60),
    completedPassesPerSpell: round(sum(per((r) => r.stats.passesCompleted)) / Math.max(1, sum(per((r) => r.openSpells)))),
    armedChallengesPerTeam: round(mean(per((r) => r.cb.armedChallenges / 2))),
    geometricMissesPerTeam: round(mean(per((r) => r.cb.geometricMisses / 2))),
    recoveriesPerTeam: round(mean(per((r) => r.cb.recoveries / 2))),
    meanRecoveryS: round(sum(per((r) => r.cb.recoverySeconds)) / Math.max(1, sum(per((r) => r.cb.recoveries)))),
    offsidesPerTeam: round(mean(per((r) => r.stats.offsides / 2))),
    cornersPerTeam: round(mean(per((r) => r.stats.corners / 2))),
    inPlaySecondsPerMatch: round(mean(per((r) => r.inPlayTicks * DT))),
    simSecondsPerMatch: round(mean(per((r) => r.simSeconds))),
    wallSecondsPerMatch: round(mean(per((r) => r.wallSeconds))),
    ownedSecondsPerMatch: round(mean(per((r) => r.ownedTicks * DT))),
    cbVersionObserved: rows.length > 0 ? rows[0].cbVersionObserved : Number.NaN,
    armDefinition: { text: ARM_DEFINITIONS[arm] },
  };
  return { quantities: out, context, quantileRow };
}

/* ========================================================================== */
/* §9 THE RUN                                                                  */
/* ========================================================================== */
/** the smoke's job: the event rates the N rule needs, and the wall cost. */
const SIZING_SEEDS = Array.from({ length: SMOKE_N }, (_, i) => SMOKE_BASE + i);
const smokeT0 = Date.now();
const smokeRows = MODE === 'smoke' ? walkAll(SIZING_SEEDS, 'sizing', false) : null;
const smokeMs = Date.now() - smokeT0;
const msPerMatchSmoke = smokeRows === null ? Number.NaN
  : smokeMs / (SIZING_SEEDS.length * ARMS.length);

/** the N rule reads the SMOKE artifact in full mode (the disclosed rates), never a fresh guess. */
interface SizingInputs { spellsPerMatchBinding: number; knocksPerMatchCb: number; msPerMatch: number }
const sizingInputs: SizingInputs = (() => {
  if (smokeRows !== null) {
    return {
      spellsPerMatchBinding: Math.min(...ARMS.map((a) => mean(smokeRows[a].map((r) => r.openSpells)))),
      knocksPerMatchCb: mean(smokeRows.cb.map((r) => r.cb.touchPasts)),
      msPerMatch: msPerMatchSmoke,
    };
  }
  if (!existsSync(SMOKE_PATH)) {
    console.error(`R-乙 FATAL — full mode needs the committed sizing smoke at ${SMOKE_PATH} `
      + '(the N rule reads its DISCLOSED rates; it may not invent them).');
    process.exit(2);
  }
  const s = JSON.parse(readFileSync(SMOKE_PATH, 'utf8')) as {
    sizing: { inputs: SizingInputs };
  };
  return s.sizing.inputs;
})();

const derivedN = (() => {
  const shareTerm = Math.ceil(0.25 / SHARE_SE_TARGET ** 2);
  const spellTerm = sizingInputs.spellsPerMatchBinding > 0
    ? Math.ceil(TARGET_SPELLS_PER_ARM / sizingInputs.spellsPerMatchBinding) : Number.POSITIVE_INFINITY;
  const knockTerm = sizingInputs.knocksPerMatchCb > 0
    ? Math.ceil(TARGET_KNOCKS_CB / sizingInputs.knocksPerMatchCb) : Number.POSITIVE_INFINITY;
  const precision = Math.max(shareTerm, spellTerm, knockTerm);
  const stepped = Math.ceil(precision / N_STEP) * N_STEP;
  const wallTerm = Math.floor((WALL_BUDGET_HOURS * 3_600_000)
    / Math.max(1, sizingInputs.msPerMatch * ARMS.length * XDET_FACTOR));
  /** ⭐ THE DESIGN TERM — free of every timing, so it can live inside `resultSha256`. */
  const nStarDesign = Math.min(stepped, SEED_ROOM);
  /** the wall CAP; G-N-DERIVED.wallTermNotBinding requires it never to bind, so that no machine
   *  timing can move a hashed number (the envelope form). */
  const nStar = Math.min(stepped, wallTerm, SEED_ROOM);
  return {
    shareTerm, spellTerm, knockTerm, precision, stepped, wallTerm, seedRoom: SEED_ROOM,
    nStar, nStarDesign,
    targets: {
      shareSeTarget: SHARE_SE_TARGET, spellsPerArm: TARGET_SPELLS_PER_ARM,
      knocksCb: TARGET_KNOCKS_CB, step: N_STEP, wallBudgetHours: WALL_BUDGET_HOURS,
    },
    arithmeticDesign: `N*(design) = min( max(${shareTerm}, ${spellTerm}, ${knockTerm}) ↑${N_STEP}`
      + ` = ${stepped}, seedRoom=${SEED_ROOM} ) = ${nStarDesign}   [no timing enters this line]`,
    arithmetic: `N* = min( max( ceil(0.25/${SHARE_SE_TARGET}²)=${shareTerm} [match-level share], `
      + `ceil(${TARGET_SPELLS_PER_ARM}/${round(sizingInputs.spellsPerMatchBinding, 3)})=${spellTerm} [spell quantiles], `
      + `ceil(${TARGET_KNOCKS_CB}/${round(sizingInputs.knocksPerMatchCb, 3)})=${knockTerm} [take-on rate] ) `
      + `↑${N_STEP} = ${stepped}, floor(${WALL_BUDGET_HOURS} h / (${round(sizingInputs.msPerMatch, 1)} ms × `
      + `${ARMS.length} arms × ${XDET_FACTOR} X-DET))=${wallTerm}, seedRoom=${SEED_ROOM} ) = ${nStar}`,
    bindingTerm: nStar === stepped ? 'precision' : nStar === wallTerm ? 'wall' : 'seed room',
    bindingPrecisionTerm: precision === shareTerm ? 'match-level share'
      : precision === spellTerm ? 'spell quantiles' : 'take-on rate',
  };
})();

const RAN_N = MODE === 'smoke' ? SMOKE_N : (N_ENV ?? derivedN.nStar);
const CORE_SEEDS = MODE === 'smoke' ? SIZING_SEEDS
  : Array.from({ length: RAN_N }, (_, i) => CORE_BASE + i);

const passAT0 = Date.now();
const passA = smokeRows ?? walkAll(CORE_SEEDS, 'passA', true);
const passAMs = Date.now() - passAT0;
const digestA = sha(passA);
const xDetT0 = Date.now();
const passB = MODE === 'smoke' ? passA : walkAll(CORE_SEEDS, 'passB', false);
const xDetMs = Date.now() - xDetT0;
const digestB = MODE === 'smoke' ? digestA : sha(passB);
const msPerMatchMeasured = MODE === 'smoke' ? msPerMatchSmoke
  : passAMs / Math.max(1, CORE_SEEDS.length * ARMS.length);

const M = makeMatrix(CORE_SEEDS.length, STATS_BASE);
const measured = Object.fromEntries(ARMS.map((a) => [a, measureArm(a, passA[a], M)])) as
  Record<Arm, ReturnType<typeof measureArm>>;

/* ========================================================================== */
/* §10 THE GATES — frozen ex ante, ALL computed in-probe; every composite gate  */
/*     is a FUNCTION so G-MUTANTS can RE-INVOKE it on a mutated input           */
/* ========================================================================== */
type GateOut = { pass: boolean; conjuncts: Record<string, boolean>; [k: string]: unknown };

/* --- G-TRACE: every constant read out of the engine, not typed here ---------- */
interface TraceIn {
  pressureImported: number; pressureText: number; durationImported: number; durationText: number;
  firstTouch: number; dt: number; observedDurationSeconds: number; cbDose: number;
  displayMinutes: number; displayPerSim: number;
}
const TRACE_IN: TraceIn = {
  pressureImported: PRESSURE_R, pressureText: PRESSURE_R_TEXT,
  durationImported: MATCH_DURATION, durationText: MATCH_DURATION_TEXT,
  displayMinutes: DISPLAY_MINUTES, displayPerSim: DISPLAY_S_PER_SIM_S,
  firstTouch: FIRST_TOUCH_S, dt: DT,
  observedDurationSeconds: (() => { const m = matchFor('bare', WORLD_SEED); return m.duration; })(),
  cbDose: CB_WORLD_DOSE,
};
const gTraceFn = (v: TraceIn): GateOut => {
  const c = {
    pressureRadiusAgrees: Number.isFinite(v.pressureImported) && v.pressureImported === v.pressureText,
    matchClockAgrees: v.durationImported === v.durationText,
    /** ⭐ THE #270.2 LESSON, MADE A GATE: the battery runs on the REAL match clock. */
    ranOnTheMatchClock: v.observedDurationSeconds === v.durationImported,
    firstTouchWindowFound: Number.isFinite(v.firstTouch) && v.firstTouch > 0 && v.firstTouch < 1,
    dtPositive: v.dt > 0 && v.dt < 1,
    cbDoseFromModule: v.cbDose === 1,
    /** ⭐⭐ THE ONE CLOCK CONVENTION, TRACED (fixed of record #272.3→ (ii)): the display clock's
     *  own 90 is read out of `Match.minute()`'s expression, and the mapping both conventions turn
     *  on is DERIVED from it and MATCH_DURATION — no 22.5 is typed anywhere in this instrument. */
    displayClockTracedAndMappingDerives: Number.isFinite(v.displayMinutes) && v.displayMinutes > 0
      && v.displayPerSim === (v.displayMinutes * 60) / v.durationImported && v.displayPerSim > 1,
  };
  return {
    pass: allTrue(c), conjuncts: c,
    traced: {
      displayMinutes: { value: v.displayMinutes, at: `${MATCH_SRC_PATH}:${DISPLAY_MINUTES_LINE} (Match.minute())` },
      displaySecondsPerSimSecond: v.displayPerSim,
      TOUCH_CONTROL_DIST: { value: v.pressureImported, at: `${CONST_SRC_PATH}:${PRESSURE_R_LINE}` },
      MATCH_DURATION: { value: v.durationImported, at: `${CONST_SRC_PATH}:${lineOf(CONST_SRC, /export const MATCH_DURATION = \d+;/)}` },
      firstTouchWindow: { value: v.firstTouch, at: `${MATCH_SRC_PATH}:${FIRST_TOUCH_LINE}` },
      DT: { value: v.dt }, CB_WORLD_DOSE: { value: v.cbDose, at: 'src/game/a4World.ts (imported)' },
      observedMatchDuration: v.observedDurationSeconds,
    },
  };
};
const gTrace = gTraceFn(TRACE_IN);

/* --- G-ARMING-FROM-ENTRY: the CB arm IS the entry's arming ------------------- */
const CB_DOOR_KEYS = ['cbCommitPhysics', 'cbTouchPast', 'cbChoiceSeat'] as const;
interface ArmIn {
  flagKeys: string[]; flagsTrue: string[]; typedDoorAssignments: number;
  cbVersionOnCbArm: number; cbVersionOnBareArm: number;
  dvLearnedMap: unknown; ekHoldLearn: unknown; doorsPresent: boolean;
}
const ARM_IN: ArmIn = {
  flagKeys: Object.keys(CB_FLAGS).sort(),
  flagsTrue: Object.entries(CB_FLAGS).filter(([, v]) => v === true).map(([k]) => k).sort(),
  /** the probe's OWN source may not ASSIGN a CB door literal anywhere (it must CALL for them). */
  typedDoorAssignments: CB_DOOR_KEYS
    .reduce((n, k) => n + (OWN_SRC.match(new RegExp(`${k}\\s*:\\s*(true|false)`, 'g')) ?? []).length, 0),
  cbVersionOnCbArm: measured.cb.context.cbVersionObserved as number,
  cbVersionOnBareArm: measured.bare.context.cbVersionObserved as number,
  dvLearnedMap: CB_FLAGS.dvLearnedMap, ekHoldLearn: CB_FLAGS.ekHoldLearn,
  doorsPresent: CB_DOOR_KEYS.every((k) => CB_FLAGS[k] === true),
};
const gArmingFn = (v: ArmIn): GateOut => {
  const c = {
    doorsComeFromTheModule: v.doorsPresent,
    noDoorLiteralTypedInThisProbe: v.typedDoorAssignments === 0,
    cbArmReadsBackAsTheEntrysWorld: v.cbVersionOnCbArm === 6,
    bareArmReadsBackUnarmed: v.cbVersionOnBareArm === 0,
    /** the "same channel as League.createMatch" claim: neither League-side fork is requested. */
    noLeagueSideForkRequested: v.dvLearnedMap !== true && v.ekHoldLearn !== true,
    flagSetNonEmpty: v.flagsTrue.length > 0,
  };
  return { pass: allTrue(c), conjuncts: c, flagKeys: v.flagKeys, flagsTrue: v.flagsTrue };
};
const gArming = gArmingFn(ARM_IN);

/* --- G-SEMANTICS-INHERITED: the walker reproduces #173's own smoke EXACTLY --- */
const TEMPO_SMOKE_PATH = 'docs/world-model/data/tempo-census-sizing-smoke.json';
const tempoRepro = (() => {
  const A = JSON.parse(readFileSync(TEMPO_SMOKE_PATH, 'utf8')) as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  const p = A.result.arms.prod;
  const seeds = Array.from({ length: REWALK.n }, (_, i) => REWALK.base + i);
  const rows = seeds.map((s) => walkOne('bare', s));
  const openDur = rows.flatMap((r) => r.openSpellDurations).sort((a, b) => a - b);
  const holds = rows.flatMap((r) => r.holds).sort((a, b) => a - b);
  const touchCounts = rows.map((r) => r.openSpellTouchSum);
  const observed = {
    matches: rows.length,
    simSecondsPerMatch: round(mean(rows.map((r) => r.simSeconds)), 4),
    inPlaySimSecondsPerMatch: round(mean(rows.map((r) => r.inPlayTicks * DT)), 4),
    ownedSimSecondsPerMatch: round(mean(rows.map((r) => r.ownedTicks * DT)), 4),
    openSpellN: openDur.length,
    openSpellMean: round(mean(openDur), 4),
    openSpellMedian: round(quantileSorted(openDur, 0.5), 4),
    openSpellP75: round(quantileSorted(openDur, 0.75), 4),
    touchesPerPossessionMean: round(sum(touchCounts) / Math.max(1, openDur.length), 4),
    holdN: holds.length,
    holdMean: round(mean(holds), 4),
    pressedShareFirstOpen: round(sum(rows.map((r) => r.firstReceptionsPressed))
      / Math.max(1, sum(rows.map((r) => r.firstReceptions))), 5),
    passesPerMatch: round(mean(rows.map((r) => r.stats.passes)), 4),
    turnoversPerMatch: round(mean(rows.map((r) => r.turnovers)), 4),
  };
  const expected = {
    matches: p.matches,
    simSecondsPerMatch: p.simSecondsPerMatch,
    inPlaySimSecondsPerMatch: p.inPlaySimSecondsPerMatch,
    ownedSimSecondsPerMatch: p.ownedSimSecondsPerMatch,
    openSpellN: p.possessionSpell.openPlay.n,
    openSpellMean: p.possessionSpell.openPlay.mean,
    openSpellMedian: p.possessionSpell.openPlay.median,
    openSpellP75: p.possessionSpell.openPlay.p75,
    touchesPerPossessionMean: p.touchesPerPossession.mean,
    holdN: p.timeOnBallPerTouch.n,
    holdMean: p.timeOnBallPerTouch.mean,
    pressedShareFirstOpen: p.pressContext.firstReceptionsOfSpell.pressedShare,
    passesPerMatch: p.eventsPerMinute.passes.perMatch,
    turnoversPerMatch: p.eventsPerMinute.turnovers.perMatch,
  };
  return { observed, expected, keys: Object.keys(expected) };
})();
const gSemanticsFn = (v: { observed: Record<string, number>; expected: Record<string, number>; keys: string[] }): GateOut => {
  /** ⚠ `noMismatch` was a conjunct in epoch 1 and is NOT one now: it is the CONJUNCTION of the
   *  per-field conjuncts below, so no input can ever flip it alone and the EXACTLY-ONE mutant
   *  rule (#272.3→ (v)) cannot be satisfied for it. A summary of siblings is not an independent
   *  claim; it is published as evidence (`mismatches`) instead. */
  const c: Record<string, boolean> = {
    fieldsPresent: v.keys.length === 14,
  };
  for (const k of v.keys) c[`match_${k}`] = v.observed[k] === v.expected[k];
  return {
    pass: allTrue(c), conjuncts: c,
    fieldsChecked: v.keys.length,
    mismatches: v.keys.filter((k) => v.observed[k] !== v.expected[k]),
    block: `${REWALK.base}..${REWALK.base + REWALK.n - 1}`,
    source: TEMPO_SMOKE_PATH,
  };
};
const gSemantics = gSemanticsFn(tempoRepro as unknown as { observed: Record<string, number>; expected: Record<string, number>; keys: string[] });

/* --- G-WORLD: read back on a never-stepped match ---------------------------- */
const worldIn = (() => {
  const bare = matchFor('bare', WORLD_SEED);
  const armed = matchFor('cb', WORLD_SEED);
  return {
    bareVersion: cbArmedVersion(bare), armedVersion: cbArmedVersion(armed),
    bareLedgerZero: Object.values(bare.cbLedger).every((x) => x === 0),
    armedLedgerZero: Object.values(armed.cbLedger).every((x) => x === 0),
    bareEye: bare.stationEye, armedEye: armed.stationEye,
    bareTicks: bare.simTick, armedTicks: armed.simTick,
    bareLedgerZeroAfterWalk: passA.bare.every((r) => Object.values(r.cb).every((x) => x === 0)),
  };
})();
const gWorldFn = (v: typeof worldIn): GateOut => {
  const c = {
    bareUnarmed: v.bareVersion === 0,
    armedIsSix: v.armedVersion === 6,
    ledgersStartZero: v.bareLedgerZero && v.armedLedgerZero,
    noEyeOnEitherArm: v.bareEye === null && v.armedEye === null,
    neverStepped: v.bareTicks === 0 && v.armedTicks === 0,
    /** ⭐ the OFF world stays dormant through a FULL walk — the Road-B receipt. */
    bareLedgerStaysZeroThroughTheWalk: v.bareLedgerZeroAfterWalk,
  };
  return { pass: allTrue(c), conjuncts: c, seed: WORLD_SEED };
};
const gWorld = gWorldFn(worldIn);

/* --- G-SEED-DISJOINT -------------------------------------------------------- */
const walkedBlocks = (() => {
  const all = [
    { name: 'sizing smoke', lo: SMOKE_BASE, hi: SMOKE_BASE + SMOKE_N - 1 },
    { name: 'core battery', lo: CORE_SEEDS[0], hi: CORE_SEEDS[CORE_SEEDS.length - 1] },
    { name: 'G-WORLD read-back', lo: WORLD_SEED, hi: WORLD_SEED },
    { name: `⭐ DECLARED RE-WALK: ${REWALK.name}`, lo: REWALK.base, hi: REWALK.base + REWALK.n - 1 },
  ];
  // ⚠ in SMOKE mode the core battery IS the sizing block (one walk, two names) — the ledger lists
  // the block ONCE so the mutual-disjointness conjunct measures real overlap, not double naming.
  const seen = new Set<string>();
  return all.filter((b) => {
    const k = `${b.lo}:${b.hi}`;
    if (seen.has(k)) return false;
    seen.add(k); return true;
  });
})();
const seedIn = { blocks: walkedBlocks, band: BAND, consumed: CONSUMED, rewalkName: REWALK.name };
const gSeedDisjointFn = (v: typeof seedIn): GateOut => {
  const own = v.blocks.filter((b) => !b.name.includes('RE-WALK'));
  const rewalk = v.blocks.filter((b) => b.name.includes('RE-WALK'));
  const overlaps = (a: { lo: number; hi: number }, b: { lo: number; hi: number }): boolean =>
    a.lo <= b.hi && b.lo <= a.hi;
  const c = {
    everyOwnBlockInsideTheBand: own.every((b) => b.lo >= v.band[0] && b.hi <= v.band[1]),
    ownBlocksMutuallyDisjoint: own.every((a, i) => own.every((b, j) => i === j || !overlaps(a, b))),
    noOwnBlockHitsAConsumedRange: own.every((b) => v.consumed.every(
      (x) => !overlaps(b, { lo: x.range[0], hi: x.range[1] }))),
    /** ⭐ THE PREDICATE INVERTED for the one declared re-walk: it MUST hit a consumed range,
     *  which is exactly what makes it a reproduction rather than a fresh measurement. */
    theDeclaredRewalkDoesHitAConsumedRange: rewalk.length === 1 && v.consumed.some(
      (x) => overlaps(rewalk[0], { lo: x.range[0], hi: x.range[1] })),
    /** ⚠ the block-count clause was dropped of record (#272.3→ (v)): it made this conjunct move
     *  whenever a BLOCK mutant ran, so EXACTLY-ONE was unsatisfiable for the inverted re-walk
     *  conjunct. The blocks are covered by the three conjuncts above; this one is the LEDGER's. */
    ledgerNonVacuous: v.consumed.length >= 10,
  };
  return {
    pass: allTrue(c), conjuncts: c, band: v.band,
    blocks: v.blocks, ledgerEntries: v.consumed.length,
  };
};
const gSeedDisjoint = gSeedDisjointFn(seedIn);

/* --- G-STATS-DISJOINT ------------------------------------------------------- */
const statsIn = { base: STATS_BASE, floor: STATS_FLOOR, step: STATS_STEP, published: STATS_PUBLISHED_BASES };
const gStatsDisjointFn = (v: typeof statsIn): GateOut => {
  const gaps = v.published.map((p) => Math.abs(p - v.base));
  const c = {
    atOrAboveFloor: v.base >= v.floor,
    onTheGrid: v.base % v.step === 0,
    gapFromEveryPublishedBase: gaps.every((g) => g >= v.step),
    nonVacuousLedger: v.published.length > 0,
  };
  return { pass: allTrue(c), conjuncts: c, base: v.base, minGap: Math.min(...gaps), published: v.published.length };
};
const gStatsDisjoint = gStatsDisjointFn(statsIn);

/* --- G-CLEAN-INVOCATION (⚠ INVOCATION CONTEXT — outside resultSha256) ------- */
/** ⭐ the canonical-write guard, as a PURE PREDICATE so it can be exercised live on a synthetic
 *  input (the ledger-refusal form) instead of being restated as a property of this invocation. */
const wouldRefuseCanonicalWrite = (preflight: boolean, out: string): boolean =>
  preflight && isCanonicalPath(out);
const cleanIn = {
  preflight: IS_PREFLIGHT, reasons: PREFLIGHT_REASONS, outCanonical: isCanonicalPath(OUT_PATH),
  out: OUT_PATH, resume: RESUME,
  /** exercised LIVE on a synthetic preflight aimed at a canonical path — the guard must refuse. */
  guardRefusesASyntheticPreflight: wouldRefuseCanonicalWrite(true, SMOKE_PATH)
    && !wouldRefuseCanonicalWrite(false, SMOKE_PATH) && !wouldRefuseCanonicalWrite(true, '/tmp/x.json'),
};
const gCleanInvocationFn = (v: typeof cleanIn): GateOut => {
  /** ⚠ RESTRUCTURED of record #272.3→ (v): epoch 1's `preflightNeverCanonical` could not be
   *  flipped without also flipping `noOverrideSet` (any state where it is false has preflight
   *  true), so EXACTLY-ONE was unsatisfiable for it. The guard is now proven by EXERCISING the
   *  predicate on a synthetic input, which is an independent claim and a stronger one. */
  const c = {
    noOverrideSet: !v.preflight,
    outIsCanonicalForACleanRun: v.preflight ? true : v.outCanonical,
    canonicalWriteGuardRefusesAPreflight: v.guardRefusesASyntheticPreflight,
    reasonsMatchPreflight: v.preflight === (v.reasons.length > 0),
  };
  return {
    pass: allTrue(c), conjuncts: c, preflight: v.preflight, reasons: v.reasons,
    resumeRequested: v.resume,
    note: 'RYI_RESUME is NOT an override: pass B never resumes, so X-DET is the checkpoint\'s '
      + 'integrity proof, and the request rides the UNHASHED envelope.',
  };
};
const gCleanInvocation = gCleanInvocationFn(cleanIn);

/* --- G-N-DERIVED ------------------------------------------------------------ */
const nIn = {
  mode: MODE, ran: RAN_N, derived: derivedN.nStar, design: derivedN.nStarDesign,
  stepped: derivedN.stepped, wallTerm: derivedN.wallTerm, smokeN: SMOKE_N,
};
const gNDerivedFn = (v: typeof nIn): GateOut => {
  const c = {
    ranEqualsDerived: v.mode === 'smoke' ? v.ran === v.smokeN : v.ran === v.derived,
    derivedIsFinitePositive: Number.isFinite(v.derived) && v.derived > 0,
    withinSeedRoom: v.ran <= SEED_ROOM,
    /** ⭐ THE ENVELOPE DISCIPLINE MADE A GATE: the wall term must NEVER bind, so no machine timing
     *  can move a number inside `resultSha256`. If it ever binds, this reds and the round is
     *  re-designed rather than silently hashing a stopwatch. */
    wallTermNotBinding: v.wallTerm >= v.stepped && v.derived === v.design,
  };
  return { pass: allTrue(c), conjuncts: c, ...v };
};
const gNDerived = gNDerivedFn(nIn);

/* --- G-NON-VACUITY at CLAIM GRAIN ------------------------------------------- */
const vacuityIn = (() => {
  const cells: { arm: Arm; id: string; den: number; point: number; declaredZero: boolean }[] = [];
  for (const arm of ARMS) {
    for (const q of QUANTITIES) {
      const row = measured[arm].quantities[q.id];
      cells.push({
        arm, id: q.id, den: row === undefined ? 0 : row.den,
        point: row === undefined ? Number.NaN : row.point,
        declaredZero: (q.zeroByStructure ?? []).includes(arm),
      });
    }
  }
  return { cells, quantities: QUANTITIES.length, arms: ARMS.length };
})();
const gNonVacuityFn = (v: typeof vacuityIn): GateOut => {
  /** ⭐ VACUITY IS A MISSING DENOMINATOR, not a zero level. A share that measures 0.000 over 400
   *  matches is a FINDING (the thing never happened); a ratio with no denominator is a cell that
   *  says nothing, and it is admissible ONLY where the quantity declared that arm
   *  zero-by-structure ex ante. */
  const empties = v.cells.filter((x) => !(x.den > 0));
  const undeclaredEmpties = empties.filter((x) => !x.declaredZero);
  const declaredNotReadingZero = v.cells.filter((x) => x.declaredZero
    && !(x.den === 0 || x.point === 0));
  const c = {
    everyCellPresent: v.cells.length === v.quantities * v.arms,
    noUndeclaredEmptyCell: undeclaredEmpties.length === 0,
    /** ⭐ the structural claim, checked the other way: a row declared zero-by-structure on an arm
     *  MUST read exactly zero (or have no denominator) there. If it moved, the claim moved. */
    everyDeclaredStructuralZeroReadsZero: declaredNotReadingZero.length === 0,
  };
  return {
    pass: allTrue(c), conjuncts: c,
    cells: v.cells.length, emptyCells: empties.map((x) => `${x.arm}.${x.id}`),
    undeclaredEmpties: undeclaredEmpties.map((x) => `${x.arm}.${x.id}`),
    declaredNotReadingZero: declaredNotReadingZero.map((x) => `${x.arm}.${x.id}`),
    declaredStructuralZeros: v.cells.filter((x) => x.declaredZero).map((x) => `${x.arm}.${x.id}`),
  };
};
const gNonVacuity = gNonVacuityFn(vacuityIn);

/* --- G-REAL-HONEST: the REAL column's own hygiene, machine-checked ---------- */
const tempoBands = (() => {
  const A = JSON.parse(readFileSync('docs/world-model/data/tempo-census.json', 'utf8')) as
    { referenceBands: { bands: { id: string; lo: number | null; hi: number | null }[] } };
  return A.referenceBands.bands;
})();
const B170_BY_ROW: Record<string, string> = {
  B1: 'spellDurationMean', B2: 'spellDurationQuantiles', B3: 'passesPerSpell',
  B4: 'timeOnBallPerTouch', B5: 'turnoversPerDisplayMinute', B7: 'pressedFirstTouchDeath',
  B9: 'shotsPerTeam', B10: 'foulsPerTeam',
};
/**
 * ⭐⭐ BAND FIDELITY (fixed of record #272.3→ (iv)) — a band the source never stated is not a
 * source. For every SOURCED row: a cited POINT must be stored as a point (lo = hi = centre) and
 * must occur VERBATIM in the row's own citation text; a cited RANGE must have BOTH edges verbatim
 * in the citation; a DERIVED point/range must carry a receipt that shows the arithmetic and
 * contains the value(s); an INHERITED band's receipt is the #170 vetting (its edges are separately
 * proven equal to the committed tempo artifact). This is a machine check against the STORED
 * CITATION FIELDS, not an assertion.
 */
const numeralIn = (text: string, v: number): boolean => {
  const forms = new Set<string>();
  for (const s of [String(v), String(round(v * 100, 6)), v.toFixed(1), v.toFixed(2), v.toFixed(3),
    (v * 100).toFixed(1), (v * 100).toFixed(2), (v * 100).toFixed(4)]) {
    if (/^\d/.test(s)) forms.add(s.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, ''));
  }
  return [...forms].some((f) => new RegExp(`(?<![\\d.])${f.replace(/\./g, '\\.')}(?![\\d])`).test(text));
};
const bandFidelityChecks = QUANTITIES.filter((q) => q.real.confidence !== 'UNSOURCED').map((q) => {
  const { lo, hi, centre, bandKind, bandReceipt, source } = q.real;
  const edges = [lo, hi].filter((x): x is number => x !== null);
  const isPointKind = bandKind === 'citedPoint' || bandKind === 'derivedPoint';
  const storedAsPoint = lo !== null && hi !== null && lo === hi && centre === lo;
  const text = bandKind === 'citedPoint' || bandKind === 'citedRange' ? source : bandReceipt;
  const receiptWhereNeeded = bandKind === 'citedPoint' || bandKind === 'citedRange'
    ? true : bandReceipt.length > 40;
  const edgesTraceable = bandKind === 'inheritedVetted'
    ? bandReceipt.includes(q.real.b170 ?? '«none»')
    : edges.length === 2 && edges.every((e) => numeralIn(text, e));
  return {
    id: q.id, bandKind, ok: bandKind !== 'none' && receiptWhereNeeded && edgesTraceable
      && (!isPointKind || storedAsPoint),
    storedAsPoint, receiptWhereNeeded, edgesTraceable,
  };
});
const realIn = (() => {
  const inheritedChecks = QUANTITIES.filter((q) => q.real.inherited === '#170').map((q) => {
    const bandId = B170_BY_ROW[q.real.b170 ?? ''];
    const band = tempoBands.find((b) => b.id === bandId);
    return {
      id: q.id, b170: q.real.b170 ?? null, found: band !== undefined,
      agrees: band !== undefined && band.lo === q.real.lo && band.hi === q.real.hi,
    };
  });
  return {
    rows: QUANTITIES.map((q) => ({
      id: q.id, confidence: q.real.confidence, lo: q.real.lo, hi: q.real.hi,
      sourceLen: q.real.source.length, hasUrl: /https?:\/\//.test(q.real.source),
      status: q.status as string, semanticsLen: q.oursSemantics.length,
    })),
    inheritedChecks,
    bandChecks: bandFidelityChecks,
  };
})();
const gRealHonestFn = (v: typeof realIn): GateOut => {
  const c = {
    everyRowHasSemantics: v.rows.every((r) => r.semanticsLen > 40),
    everyRowUnadjudicated: v.rows.every((r) => r.status === 'UNADJUDICATED'),
    unsourcedRowsCarryNoBand: v.rows.every((r) => r.confidence !== 'UNSOURCED' || (r.lo === null && r.hi === null)),
    sourcedRowsCarryABand: v.rows.every((r) => r.confidence === 'UNSOURCED' || (r.lo !== null && r.hi !== null)),
    everyRowExplainsItsSource: v.rows.every((r) => r.sourceLen > 40),
    /** a sourced row must cite a URL; an UNSOURCED row must NOT pretend to. */
    sourcedRowsCiteAUrl: v.rows.every((r) => r.confidence === 'UNSOURCED' || r.hasUrl),
    /** ⭐ THE #170 INHERITANCE IS PROVEN, NOT CLAIMED: every inherited band equals the committed
     *  tempo-census artifact's own band, low and high. */
    inheritedBandsMatchTheCommittedArtifact: v.inheritedChecks.length > 0
      && v.inheritedChecks.every((x) => x.found && x.agrees),
    /** ⭐⭐ THE NEW CONJUNCT (#272.3→ (iv)): every sourced row's band shape matches its own
     *  citation — cited points stored as points, every width carrying a receipt. */
    bandFidelity: v.bandChecks.length > 0 && v.bandChecks.every((x) => x.ok),
  };
  return {
    pass: allTrue(c), conjuncts: c,
    rows: v.rows.length,
    inherited: v.inheritedChecks.length,
    inheritedChecks: v.inheritedChecks,
    bandChecks: v.bandChecks,
    bandKinds: v.bandChecks.reduce<Record<string, number>>((a, x) => {
      a[x.bandKind] = (a[x.bandKind] ?? 0) + 1; return a;
    }, {}),
    byConfidence: v.rows.reduce<Record<string, number>>((a, r) => {
      a[r.confidence] = (a[r.confidence] ?? 0) + 1; return a;
    }, {}),
  };
};
const gRealHonest = gRealHonestFn(realIn);

/* --- ⭐⭐ G-ADDITIVE-COUNTER: the round's ONE src change, proven additive ------- */
/**
 * The instrument needed a denominator the engine did not expose: knocks that HAD a challenger.
 * `cbLedger.touchPastContested` is that counter. The claim "adding it cannot move the world" is
 * not asserted here — it is PROVEN from the engine's own source at run time:
 *   · the field is written EXACTLY ONCE in all of `src/**`, and that write is inside
 *     `performTouchPast` (itself unreachable without the CB door: `Match.forcedTouchPast`);
 *   · the field is READ NOWHERE in `src/**` — a value nothing reads cannot change a trajectory;
 *   · it is initialised to 0 and reads 0 on a never-stepped match and through the whole OFF walk
 *     (G-WORLD's own conjuncts, cross-referenced);
 *   · the production League fingerprint re-derives unchanged (`xFpProd`).
 */
const COUNTER_FIELD = 'touchPastContested';
const counterIn = (() => {
  const occurrences: { file: string; line: number; text: string }[] = [];
  for (const f of execSync('git ls-files src', { encoding: 'utf8' }).split('\n').filter((x) => x.endsWith('.ts'))) {
    const lines = readFileSync(f, 'utf8').split('\n');
    lines.forEach((t, i) => { if (t.includes(COUNTER_FIELD)) occurrences.push({ file: f, line: i + 1, text: t.trim() }); });
  }
  const writes = occurrences.filter((x) => /touchPastContested\s*(\+\+|\+=|=\s*0)/.test(x.text));
  const declarations = occurrences.filter((x) => /touchPastContested\s*:/.test(x.text));
  const comments = occurrences.filter((x) => /^\s*(\*|\/\/)/.test(x.text));
  const other = occurrences.filter((x) => !writes.includes(x) && !declarations.includes(x) && !comments.includes(x));
  const mech = readFileSync('src/sim/mechanics.ts', 'utf8');
  const fnStart = mech.indexOf('export function performTouchPast(');
  const fnEnd = mech.indexOf('\n}', fnStart);
  const inPerformTouchPast = fnStart >= 0 && fnEnd > fnStart
    && mech.slice(fnStart, fnEnd).includes(`cbLedger.${COUNTER_FIELD}++`);
  return {
    incrementSites: writes.filter((x) => x.text.includes('++')).length,
    initSites: declarations.filter((x) => x.file.endsWith('Match.ts')).length,
    readSites: other.length, inPerformTouchPast,
    startsZero: worldIn.bareLedgerZero && worldIn.armedLedgerZero,
    offLedgerStaysZero: worldIn.bareLedgerZeroAfterWalk,
    occurrences,
  };
})();
const gAdditiveCounterFn = (v: typeof counterIn): GateOut => {
  const c = {
    writtenExactlyOnce: v.incrementSites === 1,
    writtenInsideTheArmedOnlyPath: v.inPerformTouchPast,
    declaredOnceInTheLedgerType: v.initSites === 2,   // the type member + the initialiser
    neverReadAnywhereInSrc: v.readSites === 0,
    startsZeroOnAFreshMatch: v.startsZero,
    stillZeroThroughTheWholeOffWalk: v.offLedgerStaysZero,
  };
  return {
    pass: allTrue(c), conjuncts: c, field: `cbLedger.${COUNTER_FIELD}`,
    occurrences: v.occurrences,
    note: 'THE ROUND\'S ONE DECLARED src CHANGE (#272.4(b)). A field written once behind the CB '
      + 'door and read nowhere in src cannot move any trajectory; the production fingerprint '
      + '(xFpProd) and the all-zero OFF ledger are the independent backstops.',
  };
};
const gAdditiveCounter = gAdditiveCounterFn(counterIn);

/* --- G-VALUES-NOT-IMPORTED: no REAL number reached a sim value --------------- */
/**
 * ⭐ THE HONEST FORM OF THIS GATE. The load-bearing proof that no published real-football number
 * reached a sim value is that THIS ROUND CHANGED ZERO `src/**` BYTES — that is a proof, and it is
 * the gated conjunct. The needle SCAN below is REPORTED, NOT GATED, because a band edge coinciding
 * with an unrelated engine literal is a coincidence, not an import: `4.2` is the pressure radius,
 * `0.35` is a stun, `9` and `12` are everywhere. Gating on zero hits would be gating on a
 * coincidence, which is exactly the kind of green-that-means-nothing the mutant canon exists to
 * kill. The hit list is published in full so the ruling chain can read it.
 */
let srcDiff = '';
try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }
const srcFiles = execSync('git ls-files src', { encoding: 'utf8' }).split('\n')
  .filter((f) => f.endsWith('.ts'));
const needles = (() => {
  const out = new Set<string>();
  for (const q of QUANTITIES) {
    for (const v of [q.real.lo, q.real.hi, q.real.centre]) {
      if (v === null || !Number.isFinite(v)) continue;
      out.add(String(v));
      out.add(String(round(v * 100, 4)));
    }
  }
  // 0 / 1 / small integers are structural everywhere and are NOT evidence of an import.
  for (const trivial of ['0', '1', '2', '3', '4', '10', '12', '100']) out.delete(trivial);
  return [...out].sort();
})();
const reachIn = (() => {
  const hits: { file: string; needle: string }[] = [];
  for (const f of srcFiles) {
    const src = readFileSync(f, 'utf8');
    for (const n of needles) {
      if (new RegExp(`(?<![\\d.])${n.replace('.', '\\.')}(?![\\d])`).test(src)) hits.push({ file: f, needle: n });
    }
  }
  return { files: srcFiles.length, needles, hits, srcUnchanged: srcDiff === '' };
})();
const gValuesNotImportedFn = (v: typeof reachIn): GateOut => {
  const c = {
    scanNonVacuous: v.files > 50 && v.needles.length > 5,
    /** ⭐ THE LOAD-BEARING CONJUNCT, RESTATED HONESTLY (#272.4(b)): epoch 1 could say "this round
     *  changed no src byte". This round changed exactly one — a counter — so the claim is now
     *  (a) the working tree matches the committed engine the battery measured, and (b) the one
     *  change is proven ADDITIVE by G-ADDITIVE-COUNTER (written once behind the armed door, read
     *  nowhere), which no band value could hide inside. */
    srcTreeMatchesTheCommittedEngine: v.srcUnchanged,
  };
  return {
    pass: allTrue(c), conjuncts: c, filesScanned: v.files, needleCount: v.needles.length,
    coincidentalHits: v.hits.length, hits: v.hits,
    hitsNote: '⚠ REPORTED, NOT GATED — see the block comment above the gate. A hit is a coincidence '
      + 'between a band edge and an engine literal, not evidence of an import.',
  };
};
const gValuesNotImported = gValuesNotImportedFn(reachIn);

/* --- G-LEDGER-APPEND: the RE-RUN CLAUSE, exercised not asserted -------------- */
interface LedgerRow {
  kind: 'row'; label: string; arm: Arm; id: string; key: string; unit: string;
  point: number; ci95: CI; num: number; den: number; clusters: number;
  /** ⭐ BOTH clock readings ride the ledger, so no future epoch can diff two different clocks. */
  clock: string; conventionA: number; conventionB: number;
  realLo: number | null; realHi: number | null; realCentre: number | null;
  bandKind: string; confidence: string; status: string;
}
/** ⭐ A SUPERSESSION is a NEW LINE, never an edit of an old one (the ledger is append-only). */
interface LedgerSupersession {
  kind: 'supersession'; label: string; arm: Arm; id: string; field: string;
  was: unknown; now: unknown; supersededByLabel: string; ruling: string; reason: string;
}
const ledgerRows: LedgerRow[] = ARMS.flatMap((arm) => QUANTITIES.map((q) => {
  const r = measured[arm].quantities[q.id];
  return {
    kind: 'row' as const, label: LABEL, arm, id: q.id, key: q.key, unit: q.unit,
    point: r.point, ci95: r.ci95, num: r.num, den: r.den, clusters: r.clusters,
    clock: q.clock, conventionA: r.readings.conventionA.point, conventionB: r.readings.conventionB.point,
    realLo: q.real.lo, realHi: q.real.hi, realCentre: q.real.centre, bandKind: q.real.bandKind,
    confidence: q.real.confidence, status: q.status,
  };
}));
/**
 * ⭐⭐ THE SUPERSESSIONS OF RECORD (#272.3→ (i), (iv), (v)). Epoch 1's rows STAY on disk exactly
 * as written; these new lines say what about them no longer stands and which epoch replaces it.
 * The ledger is never rewritten — that is the whole institution.
 */
const SUPERSEDED_EPOCH = 'post-CB';
const SUPERSESSIONS: readonly { id: string; field: string; was: unknown; now: unknown; ruling: string; reason: string }[] = [
  { id: 'Q09', field: 'realLo/realHi', was: [2.8, 2.9], now: [2.82, 2.88], ruling: '#272.3 (iv)',
    reason: 'the band was INVENTED around two cited numbers; both edges are now the cited numbers themselves.' },
  { id: 'Q13', field: 'realLo/realHi', was: [4.0, 4.2], now: [4.076, 4.076], ruling: '#272.3 (iv)',
    reason: 'a width was invented around a single derived point (1,549 / 380); it is a POINT.' },
  { id: 'Q17', field: 'realLo/realHi', was: [0.24, 0.27], now: [0.255, 0.255], ruling: '#272.3 (iv)',
    reason: 'a width was invented around a single cited point (25.5 %); it is a POINT.' },
  { id: 'Q18', field: 'realLo/realHi', was: [0.35, 0.4], now: [0.375, 0.375], ruling: '#272.3 (iv)',
    reason: 'a width was invented around a single cited point (37.5 %) and that width is what printed "CI overlaps" over a CI that EXCLUDES the cited value.' },
  { id: 'Q21', field: 'realLo/realHi', was: [0.35, 0.39], now: [0.366852, 0.366852], ruling: '#272.3 (iv), (vi)',
    reason: 'a width was invented around a single derived point, and the source was transcribed as 56:58 where it publishes 56:59.' },
  { id: 'Q10', field: 'oursSemantics/denominator', was: 'cbLedger.touchPasts / 2 (EVERY aimed knock)', now: 'cbLedger.touchPastContested / 2 (knocks with a contesting body)', ruling: '#272.3 (i)',
    reason: 'the stated semantics ("an aimed knock past a contesting body") was false for the uncontested share of the count.' },
  { id: 'Q11', field: 'oursSemantics/denominator', was: 'cleanBeats / touchPasts', now: 'cleanBeats / touchPastContested', ruling: '#272.3 (i)',
    reason: 'the denominator included knocks structurally incapable of a clean beat; the corrected reading INVERTS this row\'s sign against the real band.' },
  { id: 'Q20', field: 'estimator', was: 'ratioOfSums (Σmax / Σtotal)', now: 'perMatchMean (mean of the per-match leader share)', ruling: '#272.3 (v)',
    reason: 'the published estimator was not the one §1.1 described; the label "stronger team" is also corrected to the per-match LEADER.' },
];
const supersessionRows: LedgerSupersession[] = ARMS.flatMap((arm) => SUPERSESSIONS.map((s) => ({
  kind: 'supersession' as const, label: SUPERSEDED_EPOCH, arm, id: s.id, field: s.field,
  was: s.was, now: s.now, supersededByLabel: LABEL, ruling: s.ruling, reason: s.reason,
})));
/** the append+refusal machinery, as a pure function of (existing lines, new rows). */
const ledgerApply = (
  existing: readonly string[], rows: readonly LedgerRow[], supers: readonly LedgerSupersession[],
): { ok: boolean; reason: string; labelsBefore: string[]; toAppend: string[] } => {
  const labels = new Set<string>();
  for (const line of existing) {
    if (line.trim() === '') continue;
    try {
      const o = JSON.parse(line) as { label: string; kind?: string };
      // ⭐ only MEASUREMENT rows claim a label; a supersession ANNOTATES an old label and must
      // never be mistaken for a second row-set under it.
      if (o.kind === undefined || o.kind === 'row') labels.add(o.label);
    } catch { labels.add('«unparseable»'); }
  }
  const label = rows.length > 0 ? rows[0].label : '';
  if (labels.has(label)) {
    return { ok: false, reason: `label ${label} already has rows — the ledger is APPEND-ONLY`, labelsBefore: [...labels], toAppend: [] };
  }
  return {
    ok: true, reason: '', labelsBefore: [...labels],
    toAppend: [...rows.map((r) => JSON.stringify(r)), ...supers.map((s) => JSON.stringify(s))],
  };
};
const existingLedger = existsSync(LEDGER_PATH) ? readFileSync(LEDGER_PATH, 'utf8').split('\n') : [];
const applyReal = ledgerApply(existingLedger, ledgerRows, supersessionRows);
/** the DUPLICATE-REFUSAL branch, exercised on a synthetic input so the refusal is proven live. */
const applyDupe = ledgerApply([JSON.stringify({ ...ledgerRows[0] })], ledgerRows, supersessionRows);
/** ⭐ and the OTHER half of the same claim, also exercised live: a SUPERSESSION line carrying an
 *  old label must NOT be read as that label having rows (else no epoch could ever supersede). */
const applySuper = ledgerApply(
  [JSON.stringify({ ...supersessionRows[0], label: LABEL })], ledgerRows, supersessionRows);
const ledgerIn = {
  ok: applyReal.ok, dupeRefused: !applyDupe.ok, rows: ledgerRows.length,
  expected: ARMS.length * QUANTITIES.length,
  labelsBefore: applyReal.labelsBefore, label: LABEL,
  preservedCount: existingLedger.filter((l) => l.trim() !== '').length,
  supersessions: supersessionRows.length,
  supersessionsExpected: ARMS.length * SUPERSESSIONS.length,
  supersessionNotReadAsARowSet: applySuper.ok,
};
const gLedgerAppendFn = (v: typeof ledgerIn): GateOut => {
  const c = {
    appendAccepted: v.ok,
    duplicateLabelRefused: v.dupeRefused,
    rowCountIsArmsTimesQuantities: v.rows === v.expected,
    labelNotAlreadyPresent: !v.labelsBefore.includes(v.label),
    /** ⭐ the supersessions of record are APPENDED, one per (arm × corrected row) … */
    supersessionsAppended: v.supersessions === v.supersessionsExpected && v.supersessions > 0,
    /** … and a supersession line is never mistaken for a second row-set under its label. */
    supersessionIsNotARowSet: v.supersessionNotReadAsARowSet,
  };
  return {
    pass: allTrue(c), conjuncts: c, ledgerPath: LEDGER_PATH,
    rowsAppended: v.rows, supersessionsAppended: v.supersessions,
    labelsBefore: v.labelsBefore, rowsPreserved: v.preservedCount,
    supersededEpoch: SUPERSEDED_EPOCH, supersessions: SUPERSESSIONS,
  };
};
const gLedgerAppend = gLedgerAppendFn(ledgerIn);

/* --- X-family (srcDiff is computed above, for G-VALUES-NOT-IMPORTED) --------- */
const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
let fpObserved = 'skipped';
if (!SKIP_FP) {
  const l = new League({ seed: 1337 });
  const out = runHeadless(l.toJSON() as Record<string, unknown>, { kind: 'toGeneration', target: l.generation + 2 });
  fpObserved = createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
}
const xFpProdPass = SKIP_FP ? true : fpObserved === FINGERPRINT_BASELINE;

/* --- ⭐⭐ G-MUTANTS: every conjunct of every composite gate must flip ---------- */
/**
 * ⭐⭐ EXACTLY-ONE, ENFORCED (fixed of record #272.3→ (v)). Epoch 1 ASSERTED that each mutant
 * flips "exactly that conjunct" and only checked that it flipped it — a double-flipping mutant
 * would have passed, which is the same green-that-means-nothing the mutant canon exists to kill
 * (the CB-T1 form, `live = flipped && othersSurvived`, existed and was not inherited). Here the
 * harness compares the mutated gate's WHOLE conjunct map against the base gate's: the named
 * conjunct must go true→false AND every sibling must be unchanged (same key set, same values).
 */
interface Mutant {
  gate: string; conjunct: string; flipped: boolean; othersSurvived: boolean; live: boolean;
  brokeSiblings: string[];
}
const mutants: Mutant[] = [];
/** the base conjunct maps, taken from the gate objects themselves (never re-typed). */
const baseConjuncts: Record<string, Record<string, boolean>> = {};
const runMutant = (gate: string, conjunct: string, out: GateOut): void => {
  const base = baseConjuncts[gate] ?? {};
  const flipped = base[conjunct] === true && out.conjuncts[conjunct] === false;
  const keys = new Set([...Object.keys(base), ...Object.keys(out.conjuncts)]);
  const brokeSiblings = [...keys].filter((k) => k !== conjunct && out.conjuncts[k] !== base[k]);
  mutants.push({
    gate, conjunct, flipped, othersSurvived: brokeSiblings.length === 0,
    live: flipped && brokeSiblings.length === 0, brokeSiblings,
  });
};
/** ⭐ THE COMPOSITE GATES, in ONE place: the mutant harness's base maps and the coverage map are
 *  both derived from this object, so a gate cannot exist without being covered. */
const COMPOSITE_GATES: Record<string, GateOut> = {
  gTrace, gArming, gSemantics, gWorld, gSeedDisjoint, gStatsDisjoint, gCleanInvocation,
  gNDerived, gNonVacuity, gRealHonest, gAdditiveCounter, gValuesNotImported, gLedgerAppend,
};
for (const [k, g] of Object.entries(COMPOSITE_GATES)) baseConjuncts[k] = g.conjuncts;
/**
 * ⭐⭐ THE MUTANT BASE FOR `gCleanInvocation` IS A SYNTHETIC CLEAN INVOCATION, not this one
 * (instrument correction, declared in §DEV). Mutant liveness is a property of the GATE FUNCTION,
 * not of how the probe happened to be called; leaving the live invocation as the base made
 * `gMutants` — a HASHED gate — depend on invocation context, which the envelope law forbids and
 * the CROSS-OUT acceptance test exposes (a preflight to another path could not re-derive the
 * receipt). The measured core is untouched by this: no mutant reads a measurement.
 */
const CLEAN_INVOCATION: typeof cleanIn = {
  preflight: false, reasons: [], outCanonical: true, out: SMOKE_PATH, resume: false,
  guardRefusesASyntheticPreflight: cleanIn.guardRefusesASyntheticPreflight,
};
baseConjuncts.gCleanInvocation = gCleanInvocationFn(CLEAN_INVOCATION).conjuncts;

// G-TRACE
runMutant('gTrace', 'pressureRadiusAgrees', gTraceFn({ ...TRACE_IN, pressureText: TRACE_IN.pressureText + 1 }));
runMutant('gTrace', 'matchClockAgrees', gTraceFn({ ...TRACE_IN, durationText: TRACE_IN.durationText + 1 }));
runMutant('gTrace', 'ranOnTheMatchClock', gTraceFn({ ...TRACE_IN, observedDurationSeconds: 600 }));
runMutant('gTrace', 'firstTouchWindowFound', gTraceFn({ ...TRACE_IN, firstTouch: Number.NaN }));
runMutant('gTrace', 'dtPositive', gTraceFn({ ...TRACE_IN, dt: 0 }));
runMutant('gTrace', 'cbDoseFromModule', gTraceFn({ ...TRACE_IN, cbDose: 0.5 }));
runMutant('gTrace', 'displayClockTracedAndMappingDerives',
  gTraceFn({ ...TRACE_IN, displayMinutes: Number.NaN, displayPerSim: Number.NaN }));
// G-ARMING
runMutant('gArming', 'doorsComeFromTheModule', gArmingFn({ ...ARM_IN, doorsPresent: false }));
runMutant('gArming', 'noDoorLiteralTypedInThisProbe', gArmingFn({ ...ARM_IN, typedDoorAssignments: 1 }));
runMutant('gArming', 'cbArmReadsBackAsTheEntrysWorld', gArmingFn({ ...ARM_IN, cbVersionOnCbArm: 0 }));
runMutant('gArming', 'bareArmReadsBackUnarmed', gArmingFn({ ...ARM_IN, cbVersionOnBareArm: 6 }));
runMutant('gArming', 'noLeagueSideForkRequested', gArmingFn({ ...ARM_IN, dvLearnedMap: true }));
runMutant('gArming', 'flagSetNonEmpty', gArmingFn({ ...ARM_IN, flagsTrue: [] }));
// G-SEMANTICS-INHERITED
{
  const o = tempoRepro.observed as unknown as Record<string, number>;
  const e = tempoRepro.expected as unknown as Record<string, number>;
  const keys = tempoRepro.keys;
  // ⭐ EXACTLY-ONE: the key list is lengthened by REPEATING a key, so the dynamic `match_*`
  // conjunct SET is unchanged (a duplicate key rewrites the same value) and only the arity
  // conjunct moves. Slicing a key off would also delete that key's own conjunct — a second flip.
  runMutant('gSemantics', 'fieldsPresent', gSemanticsFn({ observed: o, expected: e, keys: [...keys, keys[0]] }));
  for (const k of keys) {
    runMutant('gSemantics', `match_${k}`, gSemanticsFn({ observed: { ...o, [k]: o[k] - 1 }, expected: e, keys }));
  }
}
// G-WORLD
runMutant('gWorld', 'bareUnarmed', gWorldFn({ ...worldIn, bareVersion: 6 }));
runMutant('gWorld', 'armedIsSix', gWorldFn({ ...worldIn, armedVersion: 0 }));
runMutant('gWorld', 'ledgersStartZero', gWorldFn({ ...worldIn, bareLedgerZero: false }));
runMutant('gWorld', 'noEyeOnEitherArm', gWorldFn({ ...worldIn, bareEye: {} as never }));
runMutant('gWorld', 'neverStepped', gWorldFn({ ...worldIn, bareTicks: 1 }));
runMutant('gWorld', 'bareLedgerStaysZeroThroughTheWalk', gWorldFn({ ...worldIn, bareLedgerZeroAfterWalk: false }));
// G-SEED-DISJOINT
runMutant('gSeedDisjoint', 'everyOwnBlockInsideTheBand',
  gSeedDisjointFn({ ...seedIn, blocks: [...walkedBlocks, { name: 'rogue', lo: 1, hi: 2 }] }));
runMutant('gSeedDisjoint', 'ownBlocksMutuallyDisjoint',
  gSeedDisjointFn({ ...seedIn, blocks: [...walkedBlocks, { name: 'overlap', lo: SMOKE_BASE, hi: SMOKE_BASE }] }));
// ⭐ EXACTLY-ONE: the CONSUMED ledger is mutated to swallow this round's own core block (adding a
// block outside the band would also flip `everyOwnBlockInsideTheBand`).
runMutant('gSeedDisjoint', 'noOwnBlockHitsAConsumedRange', gSeedDisjointFn({
  ...seedIn, consumed: [...CONSUMED, { name: 'synthetic clash', range: [CORE_SEEDS[0], CORE_SEEDS[0]] as const }],
}));
runMutant('gSeedDisjoint', 'theDeclaredRewalkDoesHitAConsumedRange',
  gSeedDisjointFn({ ...seedIn, blocks: walkedBlocks.filter((b) => !b.name.includes('RE-WALK')) }));
// ⭐ EXACTLY-ONE: shortening the ledger below the floor, rather than emptying it — an EMPTY
// ledger would also flip the inverted re-walk conjunct (nothing left for it to hit).
runMutant('gSeedDisjoint', 'ledgerNonVacuous', gSeedDisjointFn({ ...seedIn, consumed: CONSUMED.slice(0, 9) }));
// G-STATS-DISJOINT
// ⭐ EXACTLY-ONE: the FLOOR is raised rather than the base lowered onto a published rung (which
// would also flip `gapFromEveryPublishedBase`).
runMutant('gStatsDisjoint', 'atOrAboveFloor', gStatsDisjointFn({ ...statsIn, floor: STATS_BASE + STATS_STEP }));
runMutant('gStatsDisjoint', 'onTheGrid', gStatsDisjointFn({ ...statsIn, base: STATS_BASE + 1 }));
runMutant('gStatsDisjoint', 'gapFromEveryPublishedBase',
  gStatsDisjointFn({ ...statsIn, published: [...STATS_PUBLISHED_BASES, STATS_BASE + 1] }));
runMutant('gStatsDisjoint', 'nonVacuousLedger', gStatsDisjointFn({ ...statsIn, published: [] }));
// G-CLEAN-INVOCATION
runMutant('gCleanInvocation', 'noOverrideSet',
  gCleanInvocationFn({ ...CLEAN_INVOCATION, preflight: true, reasons: ['RYI_N'], out: '/tmp/x.json', outCanonical: false }));
runMutant('gCleanInvocation', 'outIsCanonicalForACleanRun',
  gCleanInvocationFn({ ...CLEAN_INVOCATION, out: '/tmp/x.json', outCanonical: false }));
runMutant('gCleanInvocation', 'canonicalWriteGuardRefusesAPreflight',
  gCleanInvocationFn({ ...CLEAN_INVOCATION, guardRefusesASyntheticPreflight: false }));
runMutant('gCleanInvocation', 'reasonsMatchPreflight',
  gCleanInvocationFn({ ...CLEAN_INVOCATION, reasons: ['RYI_N'] }));
// G-N-DERIVED
runMutant('gNDerived', 'ranEqualsDerived', gNDerivedFn({ ...nIn, ran: nIn.ran + 25, smokeN: SMOKE_N + 1 }));
// ⭐ EXACTLY-ONE: ran/derived/design move TOGETHER, so only the finiteness claim can move.
runMutant('gNDerived', 'derivedIsFinitePositive',
  gNDerivedFn({ ...nIn, ran: 0, derived: 0, design: 0, smokeN: 0 }));
runMutant('gNDerived', 'withinSeedRoom', gNDerivedFn({
  ...nIn, ran: SEED_ROOM + 1, derived: SEED_ROOM + 1, design: SEED_ROOM + 1, smokeN: SEED_ROOM + 1,
}));
runMutant('gNDerived', 'wallTermNotBinding', gNDerivedFn({ ...nIn, wallTerm: 1 }));
// G-NON-VACUITY
runMutant('gNonVacuity', 'everyCellPresent',
  gNonVacuityFn({ ...vacuityIn, cells: vacuityIn.cells.slice(1) }));
// ⭐ EXACTLY-ONE: a cell is REPLACED, never appended — appending would also flip the arity
// conjunct `everyCellPresent`.
runMutant('gNonVacuity', 'noUndeclaredEmptyCell', gNonVacuityFn({
  ...vacuityIn,
  cells: vacuityIn.cells.map((x, i) => (i === 0 ? { ...x, den: 0, declaredZero: false } : x)),
}));
runMutant('gNonVacuity', 'everyDeclaredStructuralZeroReadsZero', gNonVacuityFn({
  ...vacuityIn,
  cells: vacuityIn.cells.map((x, i) => (i === 0 ? { ...x, den: 7, point: 3, declaredZero: true } : x)),
}));
// G-REAL-HONEST
runMutant('gRealHonest', 'everyRowHasSemantics', gRealHonestFn({
  ...realIn, rows: realIn.rows.map((r, i) => (i === 0 ? { ...r, semanticsLen: 3 } : r)),
}));
runMutant('gRealHonest', 'everyRowUnadjudicated', gRealHonestFn({
  ...realIn, rows: realIn.rows.map((r, i) => (i === 0 ? { ...r, status: 'GAP' } : r)),
}));
runMutant('gRealHonest', 'unsourcedRowsCarryNoBand', gRealHonestFn({
  ...realIn, rows: realIn.rows.map((r) => (r.confidence === 'UNSOURCED' ? { ...r, lo: 1, hi: 2 } : r)),
}));
runMutant('gRealHonest', 'sourcedRowsCarryABand', gRealHonestFn({
  ...realIn, rows: realIn.rows.map((r) => (r.confidence === 'UNSOURCED' ? r : { ...r, lo: null, hi: null })),
}));
runMutant('gRealHonest', 'everyRowExplainsItsSource', gRealHonestFn({
  ...realIn, rows: realIn.rows.map((r, i) => (i === 0 ? { ...r, sourceLen: 1 } : r)),
}));
runMutant('gRealHonest', 'sourcedRowsCiteAUrl', gRealHonestFn({
  ...realIn, rows: realIn.rows.map((r) => (r.confidence === 'UNSOURCED' ? r : { ...r, hasUrl: false })),
}));
runMutant('gRealHonest', 'inheritedBandsMatchTheCommittedArtifact', gRealHonestFn({
  ...realIn, inheritedChecks: realIn.inheritedChecks.map((x, i) => (i === 0 ? { ...x, agrees: false } : x)),
}));
runMutant('gRealHonest', 'bandFidelity', gRealHonestFn({
  ...realIn, bandChecks: realIn.bandChecks.map((x, i) => (i === 0 ? { ...x, ok: false } : x)),
}));
// G-VALUES-UNREACHABLE
runMutant('gValuesNotImported', 'scanNonVacuous', gValuesNotImportedFn({ ...reachIn, needles: [] }));
// ⭐ same reason: the BASE for this conjunct's mutant is a clean tree, so the hashed gMutants
// never depends on how the tree happened to look when the probe was called.
baseConjuncts.gValuesNotImported = gValuesNotImportedFn({ ...reachIn, srcUnchanged: true }).conjuncts;
runMutant('gValuesNotImported', 'srcTreeMatchesTheCommittedEngine',
  gValuesNotImportedFn({ ...reachIn, srcUnchanged: false }));
// G-ADDITIVE-COUNTER
runMutant('gAdditiveCounter', 'writtenExactlyOnce', gAdditiveCounterFn({ ...counterIn, incrementSites: 2 }));
runMutant('gAdditiveCounter', 'writtenInsideTheArmedOnlyPath', gAdditiveCounterFn({ ...counterIn, inPerformTouchPast: false }));
runMutant('gAdditiveCounter', 'declaredOnceInTheLedgerType', gAdditiveCounterFn({ ...counterIn, initSites: 1 }));
runMutant('gAdditiveCounter', 'neverReadAnywhereInSrc', gAdditiveCounterFn({ ...counterIn, readSites: 1 }));
runMutant('gAdditiveCounter', 'startsZeroOnAFreshMatch', gAdditiveCounterFn({ ...counterIn, startsZero: false }));
runMutant('gAdditiveCounter', 'stillZeroThroughTheWholeOffWalk', gAdditiveCounterFn({ ...counterIn, offLedgerStaysZero: false }));
// G-LEDGER-APPEND
runMutant('gLedgerAppend', 'appendAccepted', gLedgerAppendFn({ ...ledgerIn, ok: false }));
runMutant('gLedgerAppend', 'duplicateLabelRefused', gLedgerAppendFn({ ...ledgerIn, dupeRefused: false }));
runMutant('gLedgerAppend', 'rowCountIsArmsTimesQuantities', gLedgerAppendFn({ ...ledgerIn, rows: ledgerIn.rows - 1 }));
runMutant('gLedgerAppend', 'labelNotAlreadyPresent',
  gLedgerAppendFn({ ...ledgerIn, labelsBefore: [...ledgerIn.labelsBefore, LABEL] }));
runMutant('gLedgerAppend', 'supersessionsAppended', gLedgerAppendFn({ ...ledgerIn, supersessions: 0 }));
runMutant('gLedgerAppend', 'supersessionIsNotARowSet',
  gLedgerAppendFn({ ...ledgerIn, supersessionNotReadAsARowSet: false }));

/** ⭐ #268.3(a): the coverage map is MACHINE-DERIVED from the gate objects themselves — not a
 *  hand-kept list — and every conjunct of every composite gate must appear in the mutant list. */
const MUTANT_COVERAGE = Object.keys(COMPOSITE_GATES);
const uncoveredConjuncts: string[] = [];
for (const g of MUTANT_COVERAGE) {
  for (const c of Object.keys(COMPOSITE_GATES[g].conjuncts)) {
    if (!mutants.some((m) => m.gate === g && m.conjunct === c)) uncoveredConjuncts.push(`${g}.${c}`);
  }
}
const strayMutants = mutants.filter((m) => COMPOSITE_GATES[m.gate] === undefined
  || COMPOSITE_GATES[m.gate].conjuncts[m.conjunct] === undefined);
const deadMutants = mutants.filter((m) => !m.flipped);
/** ⭐⭐ THE ENFORCEMENT (#272.3→ (v)): a mutant that flips its conjunct AND a sibling proves
 *  NECESSITY but not SPECIFICITY — it is not live. */
const impreciseMutants = mutants.filter((m) => m.flipped && !m.othersSurvived);
const deadOrImprecise = mutants.filter((m) => !m.live);
/** ⭐ THE REFUSAL (#268.3(a), the CB-T1 form): an uncovered or stray conjunct is not a red gate
 *  buried in an artifact — the probe REFUSES TO RUN before any battery is read. In this probe the
 *  map can only be built after the gates exist, so the refusal fires here, before the write. */
if (uncoveredConjuncts.length > 0 || strayMutants.length > 0) {
  console.error('R-乙 FATAL (#268.3(a)) — the MACHINE-DERIVED coverage map is incomplete:');
  for (const u of uncoveredConjuncts) console.error(`  · uncovered conjunct ${u}`);
  for (const m of strayMutants) console.error(`  · stray mutant ${m.gate}.${m.conjunct}`);
  process.exit(3);
}
const gMutants = {
  pass: deadOrImprecise.length === 0 && uncoveredConjuncts.length === 0 && strayMutants.length === 0,
  conjuncts: {
    noDeadMutant: deadMutants.length === 0,
    /** ⭐⭐ EXACTLY-ONE, ENFORCED not asserted. */
    everyMutantFlipsExactlyItsOwnConjunct: impreciseMutants.length === 0,
    everyConjunctCovered: uncoveredConjuncts.length === 0,
    noStrayMutant: strayMutants.length === 0,
  },
  mutantsRun: mutants.length, dead: deadMutants.length, deadList: deadMutants,
  imprecise: impreciseMutants.length,
  impreciseList: impreciseMutants.map((m) => ({ gate: m.gate, conjunct: m.conjunct, brokeSiblings: m.brokeSiblings })),
  live: mutants.filter((m) => m.live).length,
  coverage: MUTANT_COVERAGE, coverageDerivedFrom: 'Object.keys(COMPOSITE_GATES) — machine-derived',
  conjunctsEnumerated: MUTANT_COVERAGE.reduce((a, g) => a + Object.keys(COMPOSITE_GATES[g].conjuncts).length, 0),
  uncoveredConjuncts, strayMutants,
  note: '⭐⭐ every mutant RE-INVOKES the gate\'s own function on a mutated input and must flip its '
    + 'own conjunct AND leave every sibling conjunct of that gate unchanged (`live = flipped && '
    + 'othersSurvived`, the CB-T1 form, ENFORCED here — #272.3→ (v) closed the epoch-1 gap where '
    + 'this was asserted only). The coverage map is derived from the gate objects (#268.3(a)), so '
    + 'a new conjunct cannot be added without its mutant, and an incomplete map REFUSES the run.',
};

/* ========================================================================== */
/* §11 THE GATE TABLE — hand-checked count                                     */
/* ========================================================================== */
const gates = {
  xDet: {
    pass: digestA === digestB, conjuncts: { digestsIdentical: digestA === digestB },
    digestA, digestB, passBResumed: false,
    note: MODE === 'smoke'
      ? '⚠ SMOKE: the sizing walk is not double-run (the smoke adjudicates nothing); the full run is.'
      : 'the whole measured core walked TWICE (pass B never resumes from the checkpoint).',
  },
  /** ⚠ RENAMED of record (#272.4(b)): this gate proves the working tree's `src` equals the
   *  COMMITTED src — i.e. the battery measured the committed engine. It is NOT the epoch-1 claim
   *  "this round changed no src byte": this round changed exactly one, the declared additive
   *  counter, and `gAdditiveCounter` is what carries that claim. */
  xSrcCleanTree: {
    pass: srcDiff === '', conjuncts: { gitDiffEmpty: srcDiff === '' }, diff: srcDiff,
    note: 'the working tree\'s src == the committed src (what the battery walked).',
  },
  xFpProd: {
    pass: xFpProdPass, conjuncts: { fingerprintUnchanged: xFpProdPass },
    baseline: FINGERPRINT_BASELINE, observed: fpObserved, skipped: SKIP_FP,
  },
  gTrace, gArming, gSemantics, gWorld, gSeedDisjoint, gStatsDisjoint, gCleanInvocation,
  gNDerived, gNonVacuity, gRealHonest, gAdditiveCounter, gValuesNotImported, gLedgerAppend,
  gMutants,
};
const GATE_NAMES = Object.keys(gates);
const allGatesPass = Object.values(gates).every((g) => (g as { pass: boolean }).pass);
/** ⚠ the gates that depend on HOW the probe was invoked, excluded from resultSha256. */
const INVOCATION_GATES = ['gCleanInvocation', 'xSrcCleanTree', 'xFpProd', 'gLedgerAppend'] as const;
const hashedGates = Object.fromEntries(Object.entries(gates)
  .filter(([k]) => !(INVOCATION_GATES as readonly string[]).includes(k))
  .map(([k, v]) => [k, { pass: (v as { pass: boolean }).pass, conjuncts: (v as GateOut).conjuncts }]));

/* ========================================================================== */
/* §12 THE ARTIFACT                                                            */
/* ========================================================================== */
const frozenDesign = {
  contract: 'docs/world-model/RULER-COVERAGE-CONTRACT.md §1 R-乙',
  ruling: '#271.2 (dispatched; seeds 12,477,000–999, stats from 110,200)',
  doc: 'docs/world-model/R-YI-STANDING-GAP-TABLE.md',
  arms: ARMS, armDefinitions: ARM_DEFINITIONS,
  matchClock: {
    matchDurationSimSeconds: MATCH_DURATION, displayMinutes: DISPLAY_MINUTES,
    simSecondsPerDisplayMinute: round(SIM_S_PER_DISPLAY_MIN),
    /** ⭐⭐ THE ONE DECLARED CONVENTION (#272.3→ (ii)), both terms traced out of `src/**`. */
    displaySecondsPerSimSecond: DISPLAY_S_PER_SIM_S,
    displayMinutesTrace: `Match.minute(), ${MATCH_SRC_PATH}:${DISPLAY_MINUTES_LINE}`,
    matchDurationTrace: `MATCH_DURATION, ${CONST_SRC_PATH}:${lineOf(CONST_SRC, /export const MATCH_DURATION = \d+;/)}`,
    convention: CLOCK_LAW,
    law: '⭐ #270.2: NO user-facing rate is published on a non-match clock. This battery runs the '
      + 'ENGINE DEFAULT MATCH_DURATION (240 sim-seconds = one real match, displayed as 90′) and '
      + 'never overrides it; G-TRACE.ranOnTheMatchClock proves it from a constructed match.',
  },
  frozenRadiusM: PRESSURE_R,
  frozenRadiusTrace: `TOUCH_CONTROL_DIST, ${CONST_SRC_PATH}:${PRESSURE_R_LINE}`,
  firstTouchWindowS: FIRST_TOUCH_S,
  firstTouchTrace: `p.firstTouchWindow, ${MATCH_SRC_PATH}:${FIRST_TOUCH_LINE}`,
  estimator: `cluster bootstrap by match seed (#20), ${BOOTSTRAP} resamples (${BOOTSTRAP_Q} for the `
    + 'quantile triple, a PREFIX of the same matrix so every interval is paired), percentile 95 % '
    + `CI, ratio-of-sums; stats base ${STATS_BASE}.`,
  seeds: {
    band: BAND, smoke: [SMOKE_BASE, SMOKE_BASE + SMOKE_N - 1],
    core: [CORE_SEEDS[0], CORE_SEEDS[CORE_SEEDS.length - 1]],
    gWorld: WORLD_SEED, declaredRewalk: [REWALK.base, REWALK.base + REWALK.n - 1],
    walkedNote: 'booked = walked: every block listed here was walked in full this run.',
  },
  statsBase: STATS_BASE,
  /** ⭐ the HASHED half of the N rule: targets + the terms derived from EVENT RATES. Every
   *  timing-dependent term (the wall cap, ms/match, the full arithmetic line) lives in the
   *  UNHASHED envelope, and G-N-DERIVED.wallTermNotBinding proves the cap never bound. */
  nRule: {
    targets: derivedN.targets,
    shareTerm: derivedN.shareTerm, spellTerm: derivedN.spellTerm, knockTerm: derivedN.knockTerm,
    precision: derivedN.precision, stepped: derivedN.stepped, seedRoom: derivedN.seedRoom,
    nStar: derivedN.nStarDesign,
    bindingPrecisionTerm: derivedN.bindingPrecisionTerm,
    arithmetic: derivedN.arithmeticDesign,
  },
  bandFidelity: {
    law: '⭐⭐ #272.3→ (iv): a cited POINT is stored as a point; any WIDTH carries a receipt; the '
      + 'edges are machine-checked against the row\'s own citation fields by '
      + 'G-REAL-HONEST.bandFidelity. Five epoch-1 rows (Q09/Q13/Q17/Q18/Q21) carried widths their '
      + 'sources never stated and are corrected here and SUPERSEDED in the ledger.',
    kinds: gRealHonest.bandKinds,
  },
  supersessions: SUPERSESSIONS,
  reRunClause: {
    label: LABEL,
    ledger: LEDGER_CANONICAL,
    law: '⭐ APPEND-ONLY. One line per (label, arm, quantity); a label that already has rows is a '
      + 'FATAL refusal, so an epoch can never be silently overwritten and successive runs diff '
      + 'cleanly. The contract\'s re-run trigger is "after every arc that lands a world-facing '
      + 'mechanism"; drift between labels is REPORTED to the ruling chain, never adjudicated here.',
  },
};
const result = {
  run: {
    mode: MODE, label: LABEL, matches: CORE_SEEDS.length, arms: ARMS.length,
    simSecondsPerMatch: Object.fromEntries(ARMS.map((a) => [a, measured[a].context.simSecondsPerMatch])),
  },
  ours: Object.fromEntries(ARMS.map((a) => [a, {
    quantities: measured[a].quantities, context: measured[a].context,
  }])),
  ledgerRows,
  supersessionRows,
  perCluster: Object.fromEntries(ARMS.map((a) => [a, passA[a].map((r) => ({
    // ⭐ per-seed CELLS stored so every CI re-derives from the artifact alone.
    seed: r.seed, simSeconds: round(r.simSeconds, 4), totalTicks: r.totalTicks,
    inPlayTicks: r.inPlayTicks, ownedTicks: r.ownedTicks, ownedTicksBySide: r.ownedTicksBySide,
    openSpells: r.openSpells, openSpellTickSum: r.openSpellTickSum,
    openSpellTouchSum: r.openSpellTouchSum, touches: r.touches, holdTickSum: r.holdTickSum,
    turnovers: r.turnovers, firstReceptions: r.firstReceptions,
    firstReceptionsPressed: r.firstReceptionsPressed, score: r.score, stats: r.stats, cb: r.cb,
  }))])),
};
const body = {
  stage: 'R-乙',
  quantities: QUANTITIES,
  contextKeys: CONTEXT_KEYS,
  frozenDesign,
  result,
  hashedGates,
  deviations: [
    '⭐⭐ THIS EPOCH CHANGED ONE `src/**` SURFACE, DECLARED: `cbLedger.touchPastContested`, a pure '
    + 'additive counter written once inside `performTouchPast` (unreachable without the CB door) '
    + 'and read NOWHERE in src. It is the only way to key Q10/Q11 on the commensurable take-on '
    + 'population (#272.3→ (i)); G-ADDITIVE-COUNTER proves the additivity from the engine\'s own '
    + 'source, xFpProd re-derives the production fingerprint, and the OFF ledger stays all-zero '
    + 'through the full walk. The epoch-1 phrase "zero src/** bytes" is therefore RETIRED for '
    + 'this epoch and the gate that carried it is renamed `xSrcCleanTree`.',
    '⭐⭐ BOTH CLOCK CONVENTIONS ARE PRINTED ON EVERY BANDED ROW (#272.3→ (ii)). The distance '
    + 'table declares convention A as its basis and prints B beside it; no cross-row pattern may '
    + 'be assembled out of two different clocks, which is what epoch 1\'s "every row sits below '
    + 'real" was.',
    '⭐ FIVE REAL BANDS WERE CORRECTED TO THEIR CITED POINTS (Q09/Q13/Q17/Q18/Q21) and the '
    + 'epoch-1 rows SUPERSEDED by new ledger lines — never by editing the old ones (#272.3→ (iv)).',
    '⭐ Q20\'s published estimator is now the per-match mean §1.1 always described, with the '
    + 'epoch-1 ratio-of-sums kept beside it as context, and the "stronger team" label corrected '
    + 'to the per-match LEADER (#272.3→ (v)).',
    '⭐ Q21 carries its DENOMINATOR correction into the reading (#272.3→ (vi)): ours divides the '
    + 'elapsed pause-inclusive clock (≈4.7 % longer than the nominal 240 s) while the real value '
    + 'is a share of the nominal 90, so the nominal-clock re-basing is published and is what the '
    + 'distance table reads. The source transcription is corrected to 56:59.',
    '⭐⭐ THE TWO DISPATCHED RUNS ARE THE TWO ARMS OF ONE EPOCH, walked on SHARED SEEDS. The '
    + 're-run clause\'s unit is the LABEL (the epoch), not the arm: pairing bare against CB-armed '
    + 'on the same seeds is strictly more informative than two unpaired invocations, and the '
    + 'ledger keys every row by (label, arm, quantity) so a future epoch diffs against both.',
    'A TOUCH IS AN OWNERSHIP EPISODE, not a foot-ball contact (#173\'s own deviation, inherited '
    + 'with its reason): `Match` exposes `ball.owner`, not a contact event, so an episode shorter '
    + 'than one tick is invisible. Deriving it from observable state is REQUIRED by X-SRC-ZERO.',
    'SPELL DURATION INCLUDES IN-SPELL LOOSE TIME (the Opta "sequence" shape) so Q01 is read '
    + 'against Q01\'s band like for like — #173\'s inherited choice.',
    'THE PER-TEAM ROWS HALVE A BOTH-TEAMS SUM. The arms are symmetric by construction, so the '
    + 'halving is exact in EXPECTATION over the seed set, not per match (#171.1.iii).',
    'BACKWARD vs LATERAL PASSING IS NOT MEASURABLE with existing instrument semantics (Q07): the '
    + 'engine has one forward-pass counter and no direction field on a pass. The pooled complement '
    + 'is published; no semantics were invented to split it.',
    'THE REAL COLUMN IS ELEVEN-A-SIDE, FULL-PITCH, 90-MINUTE FOOTBALL. Ours is 6v6 on a '
    + '0.70-scaled pitch over a 240 s clock. COUNT rows (shots, fouls, cards, aerials, duels) are '
    + 'the least comparable across that gap; DURATION and SHARE rows are the most comparable, '
    + 'because a human body\'s time and a possession\'s shape are the same in both games.',
    'EIGHT OF THE 21 ROWS SHIP REAL = UNSOURCED (Q02 spell quantiles · Q07 forward-pass share · '
    + 'Q10 take-on attempts · Q14 pressed-reception share · Q15 aerial duels · Q16 ground duels · '
    + 'Q19 the ≥3-goal tail · Q20 possession balance). Each row\'s `source` field records WHAT was '
    + 'searched and why nothing citable was found; two of them (Q02, Q14) inherit #170\'s own '
    + 'ABSENT verdict on the same quantity. That is the contract\'s honest form, not a hole to be '
    + 'filled with a plausible number.',
  ],
  registeredNonClaims: [
    'NOTHING SHIPS THAT ANY BODY CAN READ: the one src change is a counter no code reads, the '
    + 'production fingerprint re-derives unchanged, and every flag is armed ONLY inside this '
    + 'instrument. ⚠ This is deliberately NOT the epoch-1 wording ("zero src/** bytes"), which '
    + 'would be false this epoch.',
    '⭐⭐ NO GAP IS A GATE (contract §4). No PASS/FAIL is computed against any real value anywhere '
    + 'in this probe; the gates are the X-family, the trace/arming/semantics gates, the ledger '
    + 'hygiene gates and the mutant-liveness proof.',
    '⭐ THE STATUS COLUMN IS UNADJUDICATED ON EVERY ROW. Deliberate arcade deviation vs gap vs '
    + 'unknown is the ruling chain\'s (#203); the executor never writes it.',
    'THE ARM CONTRAST IS DESCRIPTIVE. The CB arm differs from bare in several ways at once (three '
    + 'doors + the A4 census substrate + the wind-up seam + the proneness dose), so no '
    + 'single-factor causal claim is made or permitted — it is the world the play-test entry '
    + 'actually arms, measured as a whole.',
    'NO WATCHABILITY CLAIM. Whether any of this LOOKS like football is the user\'s eyes (#157).',
  ],
  verdict: `R-乙 STANDING GAP TABLE [${LABEL}] at N=${CORE_SEEDS.length} × ${ARMS.length} arms — `
    + `${Object.values(gates).filter((g) => (g as { pass: boolean }).pass).length}/${GATE_NAMES.length} gates. `
    + 'The table is DESCRIPTIVE; every STATUS is UNADJUDICATED and the commander rules.',
};
/** ⭐ THE HASHED BODY EXCLUDES ALL INVOCATION CONTEXT (the CB-T1 envelope form). */
const resultSha256 = createHash('sha256').update(canonical({
  quantities: body.quantities, contextKeys: body.contextKeys,
  frozenDesign: body.frozenDesign, result: body.result, hashedGates: body.hashedGates,
})).digest('hex');

writeFileSync(OUT_PATH, `${JSON.stringify({
  ...body,
  resultSha256,
  gates,
  allGatesPass,
  gateCount: GATE_NAMES.length,
  gateNames: GATE_NAMES,
  sizing: MODE === 'smoke' ? {
    inputs: sizingInputs,
    derived: derivedN,
    note: 'the FULL run reads `sizing.inputs` from this committed artifact — the N rule may not '
      + 'invent its own rates.',
  } : { note: 'sizing is a SMOKE-mode output; the full run\'s N came from the committed smoke.' },
  /** ⭐ THE UNHASHED ENVELOPE: every machine timing, path and git fact lives HERE. */
  envelope: {
    preflight: IS_PREFLIGHT, reasons: PREFLIGHT_REASONS, resumeRequested: RESUME,
    outPath: OUT_PATH, outPathResolved: pathResolve(OUT_PATH), canonicalPath: isCanonicalPath(OUT_PATH),
    ledgerPath: LEDGER_PATH, checkpointPath: CHECKPOINT_PATH, doneMarker: DONE_MARKER,
    freshWalks,
    head: (() => { try { return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { return 'git-unavailable'; } })(),
    wall: {
      passAMs, xDetMs, totalMs: Date.now() - wall0, msPerMatch: round(msPerMatchMeasured, 1),
      note: 'CONTEXT ONLY and OUTSIDE resultSha256 (#128 / #258.3). `sizing.inputs.msPerMatch` is '
        + 'the one timing number with a job: the N rule\'s wall term reads it.',
    },
    nRuleWall: {
      msPerMatch: round(sizingInputs.msPerMatch, 1), wallTerm: derivedN.wallTerm,
      wallBudgetHours: WALL_BUDGET_HOURS, bindingTerm: derivedN.bindingTerm,
      arithmeticFull: derivedN.arithmetic,
      note: 'the wall CAP and its inputs — outside resultSha256 by construction.',
    },
    crossOutAcceptance: 'resultSha256 covers quantities + frozenDesign + result + the '
      + 'invocation-INDEPENDENT gates only, so the same measurement written to /tmp re-derives the '
      + 'same receipt byte for byte.',
  },
}, null, 2)}\n`);

/* ⭐ THE APPEND — only on a clean, gate-green, full invocation (rows AND supersessions). */
let ledgerAppended = 0;
if (applyReal.ok && applyReal.toAppend.length > 0 && allGatesPass && (MODE === 'full' ? !IS_PREFLIGHT : true)) {
  appendFileSync(LEDGER_PATH, `${applyReal.toAppend.join('\n')}\n`);
  ledgerAppended = applyReal.toAppend.length;
}

/* ========================================================================== */
/* §13 STDOUT — rows, never verdicts (#203)                                    */
/* ========================================================================== */
const o = (s = ''): void => { process.stdout.write(`${s}\n`); };
const fmt = (x: number, dp = 4): string => (Number.isFinite(x) ? x.toFixed(dp) : 'n/a');
o();
o(`=== R-乙 STANDING GAP TABLE — ${MODE} — label ${LABEL} — ${CORE_SEEDS.length} seeds × ${ARMS.length} arms `
  + `— block ${CORE_SEEDS[0]}..${CORE_SEEDS[CORE_SEEDS.length - 1]} ===`);
o();
o(`match clock ${MATCH_DURATION} sim-s (⇔ ${DISPLAY_MINUTES}′, 1 sim-s = ${DISPLAY_S_PER_SIM_S} display-s) `
  + `· pressure radius ${PRESSURE_R} m · first-touch window ${FIRST_TOUCH_S} s · N rule: ${derivedN.arithmetic}`);
o();
o('id   quantity                                          OURS(bare)              OURS(cb)                REAL');
for (const q of QUANTITIES) {
  const b = measured.bare.quantities[q.id];
  const c = measured.cb.quantities[q.id];
  const cell = (r: MeasuredRow): string => `${fmt(r.point)} [${fmt(r.ci95[0])}, ${fmt(r.ci95[1])}]`;
  o(`${q.id}  ${q.name.slice(0, 48).padEnd(49)} ${cell(b).padEnd(23)} ${cell(c).padEnd(23)} `
    + `${q.real.text} (${q.real.confidence})`);
  // ⭐ BOTH CLOCKS, every row (#272.3→ (ii)).
  o(`     clock ${q.clock.padEnd(14)} A ${fmt(b.readings.conventionA.point).padEnd(12)}`
    + `B ${fmt(b.readings.conventionB.point).padEnd(12)}| cb A ${fmt(c.readings.conventionA.point).padEnd(12)}`
    + `B ${fmt(c.readings.conventionB.point)}`);
}
o();
o('CONTEXT (measured, compared to NO band)');
for (const ck of CONTEXT_KEYS) {
  const b = measured.bare.context[ck.key]; const c = measured.cb.context[ck.key];
  const s = (v: unknown): string => (typeof v === 'number' ? fmt(v) : JSON.stringify(v)?.slice(0, 40) ?? 'n/a');
  o(`  ${ck.key.padEnd(28)} bare ${s(b).padEnd(14)} cb ${s(c)}`);
}
o();
o(`GATES ${allGatesPass ? 'GREEN' : '*** RED ***'} (${GATE_NAMES.length}): `
  + Object.entries(gates).map(([k, v]) => `${k} ${(v as { pass: boolean }).pass ? 'ok' : 'FAIL'}`).join(' · '));
o(`  G-SEMANTICS-INHERITED ${gSemantics.fieldsChecked} fields · ${(gSemantics.mismatches as string[]).length} mismatches `
  + `· block ${gSemantics.block}`);
o(`  G-MUTANTS ${gMutants.mutantsRun} mutants · ${gMutants.live} LIVE · ${gMutants.dead} dead · `
  + `${gMutants.imprecise} imprecise (exactly-one ENFORCED) · ${gMutants.conjunctsEnumerated} conjuncts `
  + `enumerated from ${gMutants.coverage.length} gate objects · uncovered ${gMutants.uncoveredConjuncts.length}`);
o(`  G-NON-VACUITY ${gNonVacuity.cells} cells · declared-zero ${(gNonVacuity.emptyCells as string[]).join(', ') || 'none'}`);
o(`  G-REAL-HONEST ${JSON.stringify(gRealHonest.byConfidence)} · #170-inherited ${gRealHonest.inherited}`);
o(`  G-REAL-HONEST band kinds ${JSON.stringify(gRealHonest.bandKinds)} · bandFidelity `
  + `${gRealHonest.conjuncts.bandFidelity ? 'ok' : 'FAIL'}`);
o(`  G-ADDITIVE-COUNTER ${gAdditiveCounter.field} — ${(gAdditiveCounter.occurrences as unknown[]).length} src occurrences, `
  + `${gAdditiveCounter.conjuncts.neverReadAnywhereInSrc ? '0 reads' : 'READS FOUND'}`);
o(`  LEDGER ${LEDGER_PATH} — appended ${ledgerAppended} lines under label ${LABEL} `
  + `(${ledgerRows.length} rows + ${supersessionRows.length} supersessions of ${SUPERSEDED_EPOCH})`);
o(`X-DET digest ${digestA}`);
o(`resultSha256 ${resultSha256}`);
o(`wall ${((Date.now() - wall0) / 1000).toFixed(1)}s · ${fmt(msPerMatchMeasured, 1)} ms/match · artifact ${OUT_PATH}`);
o(`VERDICT: ${body.verdict}`);
if (MODE === 'smoke') o('⚠ SMOKE ADJUDICATES NOTHING — every number above is plumbing evidence, not a finding.');

/** ⭐ TIER-1 DONE MARKER (the long-task rule): written LAST, and only on a green run. */
if (allGatesPass) writeFileSync(DONE_MARKER, `${resultSha256}\n`);
if (!allGatesPass) process.exit(1);
process.exit(0);
