/**
 * L3 T2 — THE ARMED WORLD READ (docs/world-model/L3-T2-ARMED-WORLD-READ.md).
 *
 * The defence book's VETO goes LIVE in the polished armed world and 乱抢's measured faces are
 * REPORTED — never gated (rung-one honesty; contract CB-L3-DEFENCE-BOOK-CONTRACT.md §3 L3-T2,
 * dispatched by ⭐ #281.4, with #281.3's BOTH-ARMS ruling: season-reset (the shipped law,
 * primary) and matured books (the contrast)).
 *
 * ⭐ INSTRUMENT-ONLY ROUND: `src/**` is BYTE-UNTOUCHED (xSrcUntouched compares WORKTREE vs HEAD).
 * ⭐ #247: this probe may READ the committed censuses; `src/**` may not (gValuesUnreachable).
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: L3T2_MODE (smoke|full, REQUIRED) · L3T2_R · L3T2_M · L3T2_SKIP_FP · L3T2_OUT.
 *   ANY other `L3T2_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   Every override is a PREFLIGHT: it routes onto the guard block and may not write a canonical
 *   repo path.
 *
 * RUN: L3T2_MODE=full npx tsx scripts/probes/l3-t2-armed-world-read.ts
 * EXIT: 0 = every HARD gate green · 1 = a gate is RED · 2 = a refusal · 3 = a liveness refusal.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';
import { Match } from '../../src/sim/Match';
import { DT, MATCH_DURATION, TOUCH_CONTROL_DIST } from '../../src/sim/constants';
import {
  DefenceAccountBook, LungeLabelLedger, L3_DEFENCE_GROUPS, L3_DEFENCE_WINDOW_S,
  L3_RECKLESS_ARRIVAL,
} from '../../src/ai/defenceBook';
import { a4MatchFlags, armA4World, cbArmedVersion, CB_WORLD_VERSION } from '../../src/game/a4World';
import { GENE_KEYS, randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo, type Side } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ⭐ ENV — WHITELIST-OR-REFUSE incl. THE ENGINE DOORS (#261.2 + #262.2)     */
/* ========================================================================== */
const ENV_WHITELIST = ['L3T2_MODE', 'L3T2_R', 'L3T2_M', 'L3T2_SKIP_FP', 'L3T2_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('L3T2_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  console.error('L3-T2 FATAL — refused env surface. '
    + `rogue L3T2_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.L3T2_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`L3-T2 FATAL — L3T2_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const intEnv = (v: string | undefined): number | null => (v !== undefined
  ? Math.max(1, Number.parseInt(v, 10)) : null);
const R_ENV = intEnv(process.env.L3T2_R);
const M_ENV = intEnv(process.env.L3T2_M);
const SKIP_FP = process.env.L3T2_SKIP_FP === '1';
const OUT_ENV = process.env.L3T2_OUT;
const OVERRIDES: { name: string; set: boolean }[] = [
  { name: 'L3T2_R', set: R_ENV !== null },
  { name: 'L3T2_M', set: M_ENV !== null },
  { name: 'L3T2_SKIP_FP', set: SKIP_FP },
  { name: 'L3T2_OUT', set: OUT_ENV !== undefined },
];
const PREFLIGHT_REASONS = OVERRIDES.filter((o) => o.set).map((o) => o.name);
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/l3-t2-armed-world-read-smoke.json',
  full: 'docs/world-model/data/l3-t2-armed-world-read.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/l3-t2-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('L3-T2 FATAL — a PREFLIGHT invocation may not write a canonical repo path '
    + `(the canonical-write guard, #260.2(i)). Preflight because: ${PREFLIGHT_REASONS.join(' + ')}.`);
  process.exit(2);
}

/* ========================================================================== */
/* §1 THE FROZEN DESIGN                                                        */
/* ========================================================================== */
const L3C0_PATH = 'docs/world-model/data/l3-c0-lunge-outcome-census.json';
const L3C0B_PATH = 'docs/world-model/data/l3-c0b-window-decomposition.json';
const L3T0_PATH = 'docs/world-model/data/l3-t0-defence-book-seam.json';
const L3T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';

const FINGERPRINT_SEASONS = 2;
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⭐ A SEASON = 7 FIXTURES PER TEAM — L3-T1's own trace of `League.ts`, inherited unchanged. */
const FIXTURES_PER_SEASON = 7;
const R_FROZEN = 8;
const M_FROZEN = 15;
const SEED_ROOM = 840;
/** the ⭐ APPLIED window, the law of record (#280.2(iii)): 54 ticks = 0.9000 s. */
const APPLIED_WINDOW_TICKS = 54;
/** the pressure radius of the Q14/#173 instrument — the ENGINE's own constant, never typed. */
const PRESSURE_R = TOUCH_CONTROL_DIST;
/** Ticks after a spell's terminating tick within which a foul is attributed to it (#173's value). */
const FOUL_LOOKAHEAD_TICKS = 6;

/** ⭐ THE EX-ANTE SIZING LITERALS — recomputed in-probe by gSizing from the committed artifacts. */
const FROZEN_SIZING = {
  source: 'L3-C0 committed g2 lungesPerTeamMatch moments + L3-T1 committed deff',
  deff: 1.875,
  meanControlled: 14.712025,
  sdControlled: 6.654872,
  meanReckless: 2.085443,
  sdReckless: 1.575819,
  clusters: 120,
  teamMatchesPerCluster: 14,
  z: 2.8015852189999997,
  sdClusterMeanControlled: 2.4354337763486815,
  sdClusterMeanReckless: 0.5766907038951318,
  sePairedControlled: 0.31441314855298275,
  sePairedReckless: 0.07445044973661594,
  mdeControlledPerTeamMatch: 0.8808552296452876,
  mdeRecklessPerTeamMatch: 0.20857927953000563,
  mdeControlledRelative: 0.05987314660254367,
  mdeRecklessRelative: 0.10001677318920038,
} as const;

/* ---- the estimator ---------------------------------------------------------------- */
const BOOTSTRAP = 2000;
const STATS_BASE = 111_400;
const STATS_PUBLISHED_BASES: readonly number[] = [
  100_000, 100_400, 101_000, 101_400, 102_000, 102_400, 103_000, 103_400, 104_000, 104_400,
  105_000, 105_400, 106_000, 106_200, 106_600, 107_000, 107_400, 107_800, 108_200, 108_600,
  108_800, 109_000, 110_400, 110_600, 110_800, 111_000, 111_200,
];
const STATS_STEP = 200;

/* ---- §SEED LEDGER (#163) ---------------------------------------------------------- */
const BATTERY_BASE = 12_484_000;
const SMOKE_BASE = 12_484_840;
const GUARD_BASE = 12_484_880;
const GUARD_SPAN = 20;
const GWORLD_SEED = 12_484_999;

const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: '#65 whether-seat sizing block', range: [8_500_000, 8_500_047] },
  { name: 'tempo census', range: [12_293_000, 12_299_999] },
  { name: 'O1 / O2 / MT / LADDER bands', range: [12_300_000, 12_421_999] },
  { name: 'O2-T1 · CTB · OBM · PTP · DLC bands', range: [12_422_000, 12_428_999] },
  { name: 'DV-C0 / DV-T0 / DV-T1 family', range: [12_429_000, 12_435_099] },
  { name: 'DV-T2-C0 census band (#255.4/#256)', range: [12_436_000, 12_436_999] },
  { name: 'DV-T2-T0 learning seam (#256.4/#257)', range: [12_437_000, 12_437_999] },
  { name: 'DV-T2-T1 convergence exam (#257.3/#258.4)', range: [12_438_000, 12_447_999] },
  { name: 'EK-C0 census band (#259.3/#260.4)', range: [12_448_000, 12_448_999] },
  { name: 'EK-C0b diagnostic band (#260.3/#261)', range: [12_449_000, 12_449_999] },
  { name: 'EK-T0 hold-belief seam (#261.4/#262)', range: [12_450_000, 12_450_999] },
  { name: 'EK-T1 convergence exam band (#262.4)', range: [12_451_000, 12_469_999] },
  { name: 'CB-C0 / CB-T0 / CB-T1 / CB-T2 bands (#264–#273)', range: [12_470_000, 12_479_999] },
  { name: 'L3-C0 lunge-outcome census (#277.2/#278)', range: [12_480_000, 12_480_999] },
  { name: 'L3-C0b window decomposition (#278.2/#279)', range: [12_481_000, 12_481_999] },
  { name: 'L3-T0 dormant defence-book seam (#279.4/#280)', range: [12_482_000, 12_482_999] },
  { name: '⭐ L3-T1 convergence exam (#280.3/#281)', range: [12_483_000, 12_483_999] },
];

/* ========================================================================== */
/* §2 SMALL HELPERS                                                            */
/* ========================================================================== */
const sha = (v: unknown): string => createHash('sha256').update(String(v)).digest('hex');
const canonical = (v: unknown): string => {
  const walkValue = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walkValue);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(o).sort()) out[k] = walkValue(o[k]);
      return out;
    }
    return x;
  };
  return JSON.stringify(walkValue(v));
};
const round = (v: number, d = 6): number => (Number.isFinite(v)
  ? Math.round(v * 10 ** d) / 10 ** d : Number.NaN);
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const readJson = (p: string): Record<string, unknown> => JSON.parse(readFileSync(p, 'utf8'));
const gitOut = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'GIT-FAILED'; }
};
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN
  : sum(xs) / xs.length);
const t0Wall = Date.now();

/* ========================================================================== */
/* §3 THE WORLD OF RECORD + THE FOUR ARMS                                      */
/* ========================================================================== */
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
type Books = readonly [DefenceAccountBook, DefenceAccountBook];
/**
 * THE FOUR WALK-ARMS.
 *  · `off`         — neither flag: the TRUE unarmed anchor (gByteIdentical's control).
 *  · `baseline`    — ARM A: learn ON, veto OFF. The book fills and NOTHING reads it, so the world
 *                    is byte-identical to `off` (gated, every seed) — this is the OFF world WITH
 *                    the engine's own meters switched on. Books reset at the season boundary.
 *  · `vetoReset`   — ARM B: learn + veto, books wiped at every season boundary (THE SHIPPED LAW).
 *  · `vetoMatured` — ARM C: learn + veto, books TRUTH-DOSED at every season boundary with L3-T1's
 *                    committed final-book cells (the exam idiom; instrument-side for ever).
 */
type ArmKind = 'off' | 'baseline' | 'vetoReset' | 'vetoMatured';
const ARMS: readonly ArmKind[] = ['off', 'baseline', 'vetoReset', 'vetoMatured'];
const LEARNS: Record<ArmKind, boolean> = {
  off: false, baseline: true, vetoReset: true, vetoMatured: true,
};
const VETOES: Record<ArmKind, boolean> = {
  off: false, baseline: false, vetoReset: true, vetoMatured: true,
};
const matchOf = (seed: number, arm: ArmKind, books: Books | null): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(CB_WORLD_VERSION),
    ...(LEARNS[arm]
      ? {
        l3DefenceLearn: true,
        ...(VETOES[arm] ? { l3DefenceVeto: true } : {}),
        ...(books !== null ? { l3DefenceBooks: books } : {}),
      }
      : {}),
  });
  armA4World(m, null, CB_WORLD_VERSION);
  return m;
};
const signature = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
}));

/** the ARM-IDENTITY conjuncts, derived FOR THIS READ (gArms). */
const armConjuncts = (
  m: Match, arm: ArmKind, books: Books | null, seed: number,
): Record<string, boolean> => {
  const mm = m as unknown as {
    l3DefenceLearn: boolean; l3DefenceVeto: boolean; l3Defence: LungeLabelLedger | null;
  };
  return {
    learnFlagMatchesTheArm: mm.l3DefenceLearn === LEARNS[arm],
    vetoFlagMatchesTheArm: mm.l3DefenceVeto === VETOES[arm],
    ledgerSeatMatchesTheArm: (mm.l3Defence !== null) === LEARNS[arm],
    booksArePersistentAndWired: !LEARNS[arm] || books === null
      || (mm.l3Defence !== null && mm.l3Defence.books[0] === books[0]
        && mm.l3Defence.books[1] === books[1]),
    theArmedWorldOfRecord: cbArmedVersion(m) === CB_WORLD_VERSION,
    noGeneAnywhere: !GENE_KEYS.some((k) => String(k).toLowerCase().includes('defence')),
    squadsRedrawnPerFixture:
      canonical(m.teams[0].info.genome) === canonical(team('A', seed * 2 + 1).genome)
      && canonical(m.teams[1].info.genome) === canonical(team('B', seed * 2 + 2).genome),
    theEngineClockIsTheDefault: m.duration === MATCH_DURATION,
  };
};

/* ========================================================================== */
/* §4 THE WALK — the seam's own meters + #173's spell/touch semantics           */
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

/** ONE match, ONE arm — RAW COUNTERS ONLY. Every published face is a ratio of these (gFaces). */
interface Row {
  seed: number;
  signature: string;
  armOk: boolean;
  /* --- the seam's own meters (the engine's view; zero in the `off` arm) --- */
  fired: number[];
  opened: number[];
  /** the ledger's OWN scalar count of opened labels — EXACT (the by-group scan can miss the
   *  handful the full-time flush opens and censors inside the SAME step; §DEV 8). */
  openedTotal: number;
  closed: number[];
  punished: number[];
  censored: number;
  vetoes: number;
  vetoByGroup: number[];
  vetoAmbiguous: number;
  spanTicks: number[];
  bookAtEnd: { lunges: number; punished: number }[][];
  /* --- the engine's own CB ledger --- */
  armedChallenges: number;
  geometricMisses: number;
  /* --- the #173 spell/touch instrument --- */
  openSpells: number;
  openSpellTickSum: number;
  turnovers: number;
  firstReceptions: number;
  firstReceptionsPressed: number;
  /* --- the team stat sheet (both teams summed) --- */
  fouls: number; yellows: number; reds: number; tackles: number; interceptions: number;
  goals: number;
  /* --- clock honesty --- */
  ticks: number; inPlayTicks: number; simSeconds: number;
}

const walk = (seed: number, arm: ArmKind, books: Books | null): Row => {
  const m = matchOf(seed, arm, books);
  const armOk = Object.values(armConjuncts(m, arm, books, seed)).every(Boolean);
  const led = (m as unknown as { l3Defence: LungeLabelLedger | null }).l3Defence;

  /* ⭐ THE VETO ATTRIBUTION (probe-side, and its ambiguity is COUNTED not hidden).
   * `LungeLabelLedger.vetoes` is a match-level scalar; the GROUP a veto was served on is
   * recovered from the books themselves. `declinesLunge(g)` is true for AT MOST ONE g in a
   * two-group book (the comparison is strict both ways), and the ONLY place a cell moves is
   * `observeSeparation`, which `Match.step` runs at the TOP of the tick — BEFORE the duel
   * mechanics that read the veto. So the state the veto saw at tick t is the state at the END of
   * tick t, which is what is read here. The read is EXACT whenever every side that declines
   * anything declines the SAME group; when the two sides decline DIFFERENT groups in the same
   * tick the increment cannot be assigned and is counted as AMBIGUOUS (published, and bounded:
   * every group's count is published with [attributed, attributed + ambiguous] brackets). */
  const decliningGroup = (b: DefenceAccountBook): number => {
    for (let g = 0; g < L3_DEFENCE_GROUPS; g++) if (b.declinesLunge(g)) return g;
    return -1;
  };
  const declaringSet = (): number[] => (books === null ? []
    : books.map(decliningGroup).filter((g) => g >= 0));

  const vetoByGroup = new Array<number>(L3_DEFENCE_GROUPS).fill(0);
  let vetoAmbiguous = 0;
  let prevVetoes = led?.vetoes ?? 0;
  const openedSeen = new Map<number, number>();

  const spells: Spell[] = [];
  const touches: Touch[] = [];
  const foulTicks: { tick: number; side: Side }[] = [];
  let cur: Spell | null = null;
  let curTouch: Touch | null = null;
  let prevOwnerGid: number | null = null;
  let prevFouls: [number, number] = [0, 0];
  let prevScore: [number, number] = [0, 0];
  let inPlayTicks = 0;
  const finishSpell = (s: Spell, tick: number, terminator: Terminator): void => {
    s.endTick = tick; s.terminator = terminator; s.lastTouchIdx = touches.length - 1;
    spells.push(s);
  };
  const newSpell = (side: Side, tick: number, origin: Spell['origin']): Spell => ({
    team: side, startTick: tick, endTick: tick, ownedTicks: 0, touches: 0, origin,
    terminator: 'matchEnd', firstTouchIdx: touches.length, lastTouchIdx: -1,
  });

  while (!m.finished) {
    m.step(DT);
    const tick = m.simTick;

    /* --- the veto meter, differenced per tick --- */
    if (led !== null) {
      const dv = led.vetoes - prevVetoes;
      prevVetoes = led.vetoes;
      if (dv > 0) {
        /* ⭐ WHOSE book was it? A standing challenge is offered to the CARRIER's opponents, so
         * the vetoing side is the one NOT in possession (`oppTeam.side` at the veto site is the
         * TACKLER's team). The carrier is read at the end of the tick; a VETOED challenge leaves
         * possession where it was, so this identification is exact for the event that fired. */
        const owner = m.ball.owner;
        const side = owner === null ? -1 : 1 - owner.side;
        const g = side >= 0 && books !== null ? decliningGroup(books[side]) : -1;
        if (dv === 1 && g >= 0) vetoByGroup[g] += 1;
        else {
          const uniq = new Set<number>(declaringSet());
          if (uniq.size === 1) vetoByGroup[[...uniq][0]] += dv;
          else vetoAmbiguous += dv;
        }
      }
      for (const p of led.open) if (!openedSeen.has(p.key)) openedSeen.set(p.key, p.group);
    }

    /* --- the #173 spell/touch walker, ported verbatim in semantics --- */
    const phase = m.phase;
    const owner = m.ball.owner;
    const ownerGid = owner === null ? null : owner.gid;
    for (const s of [0, 1] as const) {
      const f = m.teams[s].stats.fouls;
      if (f > prevFouls[s]) foulTicks.push({ tick, side: s });
      prevFouls[s] = f;
    }
    const goalThisTick = m.score[0] !== prevScore[0] || m.score[1] !== prevScore[1];
    prevScore = [m.score[0], m.score[1]];
    if (prevOwnerGid !== null && ownerGid !== prevOwnerGid && curTouch !== null) {
      curTouch.endTick = tick; curTouch = null;
    }
    if (phase !== 'playing') {
      if (curTouch !== null) { curTouch.endTick = tick; curTouch = null; }
      if (cur !== null) { finishSpell(cur, tick, goalThisTick ? 'goal' : 'outOfPlay'); cur = null; }
      prevOwnerGid = null;
      continue;
    }
    inPlayTicks++;
    if (owner === null) { prevOwnerGid = null; continue; }
    const side = owner.side;
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

  const open = spells.filter((s) => s.origin === 'openPlay');
  const firstOpen = touches.filter((t) => t.isFirstOfSpell
    && spells[t.spellIdx]?.origin === 'openPlay');
  const st = [m.teams[0].stats, m.teams[1].stats] as const;
  const both = (k: 'fouls' | 'yellows' | 'reds' | 'tackles' | 'interceptions' | 'goals'): number =>
    Number(st[0][k]) + Number(st[1][k]);

  const closed = new Array<number>(L3_DEFENCE_GROUPS).fill(0);
  const punished = new Array<number>(L3_DEFENCE_GROUPS).fill(0);
  const opened = new Array<number>(L3_DEFENCE_GROUPS).fill(0);
  const spanTicks = new Set<number>();
  if (led !== null) {
    for (const n of led.noted) {
      closed[n.group] += 1;
      if (n.punished) punished[n.group] += 1;
      spanTicks.add(Math.round((n.tClose - n.tMiss) / DT));
    }
    for (const g of openedSeen.values()) opened[g] += 1;
  }
  return {
    seed,
    signature: signature(m),
    armOk,
    fired: led === null ? new Array<number>(L3_DEFENCE_GROUPS).fill(0) : [...led.fired],
    opened,
    openedTotal: led?.opened ?? 0,
    closed,
    punished,
    censored: led?.censored ?? 0,
    vetoes: led?.vetoes ?? 0,
    vetoByGroup,
    vetoAmbiguous,
    spanTicks: [...spanTicks],
    bookAtEnd: books === null ? [] : books.map((b) => [0, 1]
      .map((g) => ({ lunges: b.lunges[g], punished: b.punished[g] }))),
    armedChallenges: m.cbLedger.armedChallenges,
    geometricMisses: m.cbLedger.geometricMisses,
    openSpells: open.length,
    openSpellTickSum: sum(open.map((s) => s.endTick - s.startTick)),
    turnovers: spells.filter((s) => s.terminator === 'opponentControl').length,
    firstReceptions: firstOpen.length,
    firstReceptionsPressed: firstOpen.filter((t) => t.nearestOpp <= PRESSURE_R).length,
    fouls: both('fouls'), yellows: both('yellows'), reds: both('reds'),
    tackles: both('tackles'), interceptions: both('interceptions'), goals: both('goals'),
    ticks: m.simTick, inPlayTicks, simSeconds: m.simTime,
  };
};

/* ========================================================================== */
/* §5 THE TRUTH-DOSE — L3-T1's COMMITTED FINAL-BOOK CELLS (the exam idiom)     */
/* ========================================================================== */
const l3t1 = readJson(L3T1_PATH);
interface T1Cell { lunges: number; punished: number }
/**
 * ⭐ THE DOSE SOURCE, READ (never typed): `perBookCells[r].books[side]`, LAST checkpoint
 * (M* = 15 seasons) — L3-T1's committed FINAL book cells, the world where the lesson has been
 * fully learned. Indexed [replicate][side] → the g2 pair.
 */
const T1_DOSE: T1Cell[][][] = ((l3t1.perBookCells ?? []) as {
  books: { seasons: number; all: T1Cell[] }[][];
}[]).map((rep) => rep.books.map((snaps) => snaps[snaps.length - 1].all
  .map((c) => ({ lunges: c.lunges, punished: c.punished }))));

/**
 * ⭐ THE DOSE, WRITTEN THROUGH THE BOOK'S OWN PUBLIC METHOD. `note(group, punished)` is the only
 * way a cell moves in the shipped seam, so the dosed book is a state the world could itself have
 * reached — no field surgery, no new capability, and nothing reachable from `src/**`.
 */
const doseBook = (b: DefenceAccountBook, cells: T1Cell[]): void => {
  b.reset();
  for (let g = 0; g < L3_DEFENCE_GROUPS; g++) {
    const c = cells[g] ?? { lunges: 0, punished: 0 };
    for (let i = 0; i < c.punished; i++) b.note(g, true);
    for (let i = 0; i < c.lunges - c.punished; i++) b.note(g, false);
  }
};

/* ========================================================================== */
/* §6 THE EX-ANTE SIZING — recomputed from the COMMITTED moments               */
/* ========================================================================== */
const l3c0 = readJson(L3C0_PATH);
const l3c0b = readJson(L3C0B_PATH);
const l3t0 = readJson(L3T0_PATH);
const C0_G2 = ((l3c0.tables as Record<string, unknown>).g2) as {
  band: string; lunges: number; wins: number; misses: number;
  takeRate: { point: number }; geometricMissShare: { point: number };
  lungesPerTeamMatch: { mean: number; sd: number };
}[];
const T1_DEFF = ((l3t1.sizing ?? {}) as { deff?: number }).deff ?? Number.NaN;

interface Sizing {
  deff: number;
  perTeamMatchMean: number[];
  perTeamMatchSd: number[];
  clusters: number;
  teamMatchesPerCluster: number;
  sdClusterMean: number[];
  sePaired: number[];
  mdeAbs: number[];
  mdeRelative: number[];
  z: number;
}
/** z for 80 % power at a two-sided 5 % test = z_{0.975} + z_{0.80}. */
const Z975 = 1.959963985;
const Z80 = 0.841621234;
const deriveSizing = (clusters: number, perCluster: number): Sizing => {
  const mu = C0_G2.map((r) => r.lungesPerTeamMatch.mean);
  const sd = C0_G2.map((r) => r.lungesPerTeamMatch.sd);
  // the cluster MEAN's sd, with the committed over-dispersion factor applied to the VARIANCE
  const sdCl = sd.map((s) => (s / Math.sqrt(perCluster)) * Math.sqrt(T1_DEFF));
  // paired contrast, treated CONSERVATIVELY as independent (pairing can only help)
  const se = sdCl.map((s) => (Math.sqrt(2) * s) / Math.sqrt(clusters));
  const z = Z975 + Z80;
  const mde = se.map((s) => z * s);
  return {
    deff: T1_DEFF,
    perTeamMatchMean: mu,
    perTeamMatchSd: sd,
    clusters,
    teamMatchesPerCluster: perCluster,
    sdClusterMean: sdCl,
    sePaired: se,
    mdeAbs: mde,
    mdeRelative: mde.map((v, i) => v / mu[i]),
    z,
  };
};

/* ========================================================================== */
/* §7 THE BATTERY                                                              */
/* ========================================================================== */
const R_RUN = R_ENV ?? (MODE === 'smoke' ? 2 : R_FROZEN);
const M_RUN = M_ENV ?? (MODE === 'smoke' ? 2 : M_FROZEN);
const MATCHES_PER_REPLICATE = FIXTURES_PER_SEASON * M_RUN;
const BASE_RUN = MODE === 'smoke' && R_ENV === null && M_ENV === null ? SMOKE_BASE
  : (IS_PREFLIGHT ? GUARD_BASE : BATTERY_BASE);

/** ⭐ THE CLUSTER = ONE (replicate, season) BLOCK — the unit of BOOK STATE in every armed arm. */
interface Cluster {
  r: number; season: number; arm: ArmKind; rows: Row[];
  bookAtSeasonStart: T1Cell[][];
  bookAtSeasonEnd: T1Cell[][];
}
interface Battery { clusters: Cluster[] }

const runBattery = (): Battery => {
  const clusters: Cluster[] = [];
  for (const arm of ARMS) {
    for (let r = 0; r < R_RUN; r++) {
      const books: Books | null = LEARNS[arm]
        ? [new DefenceAccountBook(), new DefenceAccountBook()] : null;
      for (let s = 0; s < M_RUN; s++) {
        // ⭐ THE SEASON BOUNDARY: B and the baseline WIPE (M-L3.2's own law); C is RE-DOSED.
        if (books !== null) {
          if (arm === 'vetoMatured') {
            for (let side = 0; side < 2; side++) {
              doseBook(books[side], T1_DOSE[r % T1_DOSE.length][side]);
            }
          } else for (const b of books) b.reset();
        }
        const start = books === null ? [] : books.map((b) => [0, 1]
          .map((g) => ({ lunges: b.lunges[g], punished: b.punished[g] })));
        const rows: Row[] = [];
        for (let i = 0; i < FIXTURES_PER_SEASON; i++) {
          const idx = s * FIXTURES_PER_SEASON + i;
          rows.push(walk(BASE_RUN + r * MATCHES_PER_REPLICATE + idx, arm, books));
        }
        clusters.push({
          r,
          season: s + 1,
          arm,
          rows,
          bookAtSeasonStart: start,
          bookAtSeasonEnd: books === null ? [] : books.map((b) => [0, 1]
            .map((g) => ({ lunges: b.lunges[g], punished: b.punished[g] }))),
        });
      }
      banner(`  [l3-t2] ${arm} replicate ${r + 1}/${R_RUN} done`);
    }
  }
  return { clusters };
};

/* ========================================================================== */
/* §8 THE FACES — every one a RATIO OF SUMS over the cluster's raw counters     */
/* ========================================================================== */
/** matches in a cluster × 2 teams = the TEAM-MATCH exposure. */
const teamMatches = (c: Cluster): number => c.rows.length * 2;
type Face = { num: (c: Cluster) => number; den: (c: Cluster) => number; unit: string; what: string };
const S = (f: (r: Row) => number) => (c: Cluster): number => sum(c.rows.map(f));
const FACES: Record<string, Face> = {
  lungesPerTeamMatch: {
    num: S((r) => r.fired[0] + r.fired[1]), den: teamMatches,
    unit: 'lunges / team / match', what: 'the swarm\'s throw rate — 乱抢\'s headline face',
  },
  lungesControlledPerTeamMatch: {
    num: S((r) => r.fired[0]), den: teamMatches,
    unit: 'lunges / team / match', what: '⭐ THE MECHANISM READ — the CONTROLLED group',
  },
  lungesRecklessPerTeamMatch: {
    num: S((r) => r.fired[1]), den: teamMatches,
    unit: 'lunges / team / match', what: '⭐⭐ THE MECHANISM READ — the RECKLESS group (the designed pathway)',
  },
  recklessShareOfLunges: {
    num: S((r) => r.fired[1]), den: S((r) => r.fired[0] + r.fired[1]),
    unit: 'share', what: 'the RECKLESS share of every lunge thrown',
  },
  hopelessLungeShare: {
    num: S((r) => r.geometricMisses), den: S((r) => r.armedChallenges),
    unit: 'share', what: 'the χ-condemned share — lunges the geometry beat before the roll',
  },
  pWonGivenLunged: {
    num: S((r) => r.fired[0] + r.fired[1] - r.openedTotal),
    den: S((r) => r.fired[0] + r.fired[1]),
    unit: 'share', what: 'P(won | lunged) — the armed standing challenge\'s take rate',
  },
  pWonControlled: {
    num: S((r) => r.fired[0] - r.opened[0]), den: S((r) => r.fired[0]),
    unit: 'share', what: 'P(won | lunged, CONTROLLED)',
  },
  pWonReckless: {
    num: S((r) => r.fired[1] - r.opened[1]), den: S((r) => r.fired[1]),
    unit: 'share', what: 'P(won | lunged, RECKLESS)',
  },
  vetoesPerTeamMatch: {
    num: S((r) => r.vetoes), den: teamMatches,
    unit: 'vetoes / team / match', what: 'the veto fire rate',
  },
  vetoesControlledPerTeamMatch: {
    num: S((r) => r.vetoByGroup[0]), den: teamMatches,
    unit: 'vetoes / team / match', what: 'veto fires attributed to CONTROLLED',
  },
  vetoesRecklessPerTeamMatch: {
    num: S((r) => r.vetoByGroup[1]), den: teamMatches,
    unit: 'vetoes / team / match', what: 'veto fires attributed to RECKLESS',
  },
  spellMeanSeconds: {
    num: (c) => S((r) => r.openSpellTickSum)(c) * DT, den: S((r) => r.openSpells),
    unit: 'seconds', what: 'Q01 — the open-play possession spell\'s mean duration',
  },
  pressedReceptionShare: {
    num: S((r) => r.firstReceptionsPressed), den: S((r) => r.firstReceptions),
    unit: 'share', what: 'Q14/#173 — first receptions of an open-play spell taken under pressure',
  },
  turnoversPerMatch: {
    num: S((r) => r.turnovers), den: (c) => c.rows.length,
    unit: 'turnovers / match', what: 'spells ended by the opponent taking control',
  },
  duelsPerTeamMatch: {
    num: S((r) => r.tackles + r.interceptions), den: teamMatches,
    unit: 'duels / team / match', what: 'Q16 — ground duels won (tackles + interceptions)',
  },
  foulsPerMatch: {
    num: S((r) => r.fouls), den: (c) => c.rows.length, unit: 'fouls / match', what: 'fouls',
  },
  yellowsPerMatch: {
    num: S((r) => r.yellows), den: (c) => c.rows.length, unit: 'yellows / match', what: 'bookings',
  },
  redsPerMatch: {
    num: S((r) => r.reds), den: (c) => c.rows.length, unit: 'reds / match', what: 'sendings-off',
  },
  goalsPerMatch: {
    num: S((r) => r.goals), den: (c) => c.rows.length, unit: 'goals / match', what: 'goals',
  },
};
const FACE_KEYS = Object.keys(FACES);

/** the bootstrap rng — the stats stream, opened at STATS_BASE. */
let statsRng = new Rng(STATS_BASE);
const resetStats = (): void => { statsRng = new Rng(STATS_BASE); };

interface FaceRow {
  face: string; unit: string; what: string;
  arms: Record<string, { point: number; num: number; den: number; ci95: [number, number] }>;
  contrasts: Record<string, { delta: number; ci95: [number, number]; relative: number }>;
}
const ratio = (num: number, den: number): number => (den === 0 ? Number.NaN : num / den);

const scoreFaces = (b: Battery): FaceRow[] => {
  const byArm: Record<string, Cluster[]> = {};
  for (const arm of ARMS) byArm[arm] = b.clusters.filter((c) => c.arm === arm);
  const K = byArm.baseline.length;
  // the paired resample index matrix — ONE draw, shared by every face and every arm (so the
  // contrasts and the levels are the SAME resampled worlds).
  resetStats();
  const draws: number[][] = [];
  for (let d = 0; d < BOOTSTRAP; d++) {
    const idx: number[] = [];
    for (let i = 0; i < K; i++) idx.push(Math.floor(statsRng.next() * K) % K);
    draws.push(idx);
  }
  const out: FaceRow[] = [];
  for (const key of FACE_KEYS) {
    const f = FACES[key];
    const nums: Record<string, number[]> = {};
    const dens: Record<string, number[]> = {};
    for (const arm of ARMS) {
      nums[arm] = byArm[arm].map((c) => f.num(c));
      dens[arm] = byArm[arm].map((c) => f.den(c));
    }
    const arms: FaceRow['arms'] = {};
    const point: Record<string, number> = {};
    for (const arm of ARMS) {
      const n = sum(nums[arm]); const d = sum(dens[arm]);
      point[arm] = ratio(n, d);
      const vals: number[] = [];
      for (const idx of draws) {
        let nn = 0; let dd = 0;
        for (const i of idx) { nn += nums[arm][i]; dd += dens[arm][i]; }
        vals.push(ratio(nn, dd));
      }
      const s = vals.filter(Number.isFinite).sort((x, y) => x - y);
      arms[arm] = {
        point: point[arm], num: n, den: d,
        ci95: [s[Math.floor(0.025 * s.length)],
          s[Math.min(s.length - 1, Math.floor(0.975 * s.length))]],
      };
    }
    const contrasts: FaceRow['contrasts'] = {};
    for (const arm of ['vetoReset', 'vetoMatured'] as const) {
      const vals: number[] = [];
      for (const idx of draws) {
        let nA = 0; let dA = 0; let nX = 0; let dX = 0;
        for (const i of idx) {
          nA += nums.baseline[i]; dA += dens.baseline[i];
          nX += nums[arm][i]; dX += dens[arm][i];
        }
        vals.push(ratio(nX, dX) - ratio(nA, dA));
      }
      const s = vals.filter(Number.isFinite).sort((x, y) => x - y);
      const delta = point[arm] - point.baseline;
      contrasts[`${arm}_minus_baseline`] = {
        delta,
        ci95: [s[Math.floor(0.025 * s.length)],
          s[Math.min(s.length - 1, Math.floor(0.975 * s.length))]],
        relative: point.baseline === 0 ? Number.NaN : delta / point.baseline,
      };
    }
    out.push({ face: key, unit: f.unit, what: f.what, arms, contrasts });
  }
  return out;
};

/* ========================================================================== */
/* §9 THE DETERMINISTIC CORE                                                   */
/* ========================================================================== */
interface Core { battery: Battery; sizing: Sizing; faces: FaceRow[] }
/** ⭐ THE FROZEN-SHAPE SIZING — the ex-ante arithmetic at (R*, M*) = (8, 15), the literals gSizing
 *  checks. Independent of the invocation's own shape, so the smoke checks the same numbers. */
const FROZEN_SHAPE_SIZING = (): Sizing => deriveSizing(
  R_FROZEN * M_FROZEN, FIXTURES_PER_SEASON * 2,
);
const runCore = (): Core => {
  const battery = runBattery();
  // ⭐ the REALISED sizing (what this invocation's cluster count actually buys).
  const sizing = deriveSizing(R_RUN * M_RUN, FIXTURES_PER_SEASON * 2);
  const faces = scoreFaces(battery);
  return { battery, sizing, faces };
};
const coreDigest = (c: Core): string => sha(canonical({
  sizing: c.sizing,
  faces: c.faces,
  clusters: c.battery.clusters.map((cl) => ({
    arm: cl.arm, r: cl.r, season: cl.season,
    start: cl.bookAtSeasonStart, end: cl.bookAtSeasonEnd,
    rows: cl.rows.map((r) => ({
      seed: r.seed, sig: r.signature, fired: r.fired, opened: r.opened,
      openedTotal: r.openedTotal, closed: r.closed,
      punished: r.punished, vetoes: r.vetoes, vetoByGroup: r.vetoByGroup,
      armed: r.armedChallenges, geom: r.geometricMisses, spells: r.openSpells,
      tickSum: r.openSpellTickSum, turnovers: r.turnovers, fr: r.firstReceptions,
      frp: r.firstReceptionsPressed, fouls: r.fouls, yellows: r.yellows, reds: r.reds,
      tackles: r.tackles, interceptions: r.interceptions, goals: r.goals, ticks: r.ticks,
    })),
  })),
}));

banner(`  [l3-t2] mode=${MODE} R=${R_RUN} M=${M_RUN} seasons · `
  + `${R_RUN * MATCHES_PER_REPLICATE} seeds × ${ARMS.length} arms × 2 G-DET runs`);
const coreA = runCore();
const digestA = coreDigest(coreA);
banner('  [l3-t2] G-DET second run…');
const coreB = runCore();
const digestB = coreDigest(coreB);
const C = coreA;
const CL = C.battery.clusters;
const armClusters = (a: ArmKind): Cluster[] => CL.filter((c) => c.arm === a);
const armRows = (a: ArmKind): Row[] => armClusters(a).flatMap((c) => c.rows);

/* ========================================================================== */
/* §10 THE READINGS THE GATES SCORE                                            */
/* ========================================================================== */
const byteIdentical = (() => {
  const off = armRows('off'); const base = armRows('baseline');
  let ok = 0;
  for (let i = 0; i < off.length; i++) {
    if (off[i].seed === base[i].seed && off[i].signature === base[i].signature) ok += 1;
  }
  return { ok, total: off.length };
})();

/** ⭐ the METER CROSS-CHECK: the seam's fired count IS the engine's own armed-challenge counter. */
const meterAgreement = (() => {
  let ok = 0; let total = 0; let labelsOk = 0; let scanOk = 0;
  let openedTotal = 0; let openedSeen = 0;
  for (const a of ['baseline', 'vetoReset', 'vetoMatured'] as const) {
    for (const r of armRows(a)) {
      total += 1;
      if (r.fired[0] + r.fired[1] === r.armedChallenges) ok += 1;
      // ⭐ THE LEDGER'S OWN BOOK-KEEPING, exact: every opened label closes or is censored.
      if (r.openedTotal === r.closed[0] + r.closed[1] + r.censored) labelsOk += 1;
      // the probe's by-group SCAN can only UNDER-count (§DEV 8) — never over-count.
      if (r.opened[0] + r.opened[1] <= r.openedTotal) scanOk += 1;
      openedTotal += r.openedTotal;
      openedSeen += r.opened[0] + r.opened[1];
    }
  }
  return {
    ok, total, labelsOk, scanOk, openedTotal, openedSeen,
    openedUnseen: openedTotal - openedSeen,
    openedUnseenShare: openedTotal === 0 ? 0 : (openedTotal - openedSeen) / openedTotal,
  };
})();

const vetoCounts = (() => {
  const per: Record<string, { total: number; byGroup: number[]; ambiguous: number }> = {};
  for (const a of ARMS) {
    const rows = armRows(a);
    per[a] = {
      total: sum(rows.map((r) => r.vetoes)),
      byGroup: [0, 1].map((g) => sum(rows.map((r) => r.vetoByGroup[g]))),
      ambiguous: sum(rows.map((r) => r.vetoAmbiguous)),
    };
  }
  return per;
})();

const spanTicksSeen = (() => {
  const s = new Set<number>();
  for (const c of CL) for (const r of c.rows) for (const t of r.spanTicks) s.add(t);
  return [...s].sort((a, b) => a - b);
})();

/** the DOSE receipt: every arm-C season starts on L3-T1's committed cells, exactly. */
const doseReceipt = (() => {
  let seasons = 0; let exact = 0;
  for (const c of armClusters('vetoMatured')) {
    seasons += 1;
    const want = T1_DOSE[c.r % T1_DOSE.length];
    const got = c.bookAtSeasonStart;
    if (canonical(got) === canonical(want)) exact += 1;
  }
  return { seasons, exact, doseTotalLabels: sum(T1_DOSE.flat(2).map((c) => c.lunges)) };
})();
/** the RESET receipt: every other armed arm starts each season EMPTY, and ends it non-empty. */
const resetReceipt = (() => {
  let seasons = 0; let empty = 0; let filled = 0;
  for (const c of CL) {
    if (c.arm !== 'vetoReset' && c.arm !== 'baseline') continue;
    seasons += 1;
    if (c.bookAtSeasonStart.every((b) => b.every((x) => x.lunges === 0))) empty += 1;
    if (c.bookAtSeasonEnd.some((b) => b.some((x) => x.lunges > 0))) filled += 1;
  }
  return { seasons, empty, filled };
})();

/* ---- the source-side reads --------------------------------------------------------- */
const stripComments = (t: string): string => t
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .split('\n').map((l) => l.replace(/\/\/.*$/, ' ')).join('\n');
const srcFiles = (() => {
  const list = gitOut('git ls-files src').split('\n').filter((f) => f.length > 0);
  return list.map((f) => {
    const text = readFileSync(f, 'utf8');
    return { path: f, text, code: stripComments(text) };
  });
})();
const mechanics = srcFiles.find((f) => f.path.endsWith('sim/mechanics.ts'));
const mechLines = (mechanics?.text ?? '').split('\n');
const IDX_JOCKEY = mechLines.findIndex((l) => l.includes('driveNow >') && l.includes('return;'));
const IDX_VETO = mechLines.findIndex((l) => l.includes('l3DefenceDeclines'));
const IDX_COMMIT = mechLines.findIndex((l, i) => i > IDX_VETO && l.includes('tackleAnimTimer'));
const declinesReadSites = srcFiles
  .reduce((a, f) => a + (f.code.match(/declinesLunge/g) ?? []).length, 0);
const vetoFlagInPresets = srcFiles.filter((f) => f.path.includes('game/'))
  .some((f) => f.text.includes('l3DefenceVeto'));

/** gValuesUnreachable — the keyed needle extraction, T1's form replayed. */
const CONTROL_NEEDLE = String(CB_WORLD_VERSION);
const DERIVED_EXEMPT = new Set<string>([
  String(L3_RECKLESS_ARRIVAL), String(L3_DEFENCE_WINDOW_S),
  L3_RECKLESS_ARRIVAL.toFixed(5), L3_DEFENCE_WINDOW_S.toFixed(5),
]);
const needleForms = new Set<string>();
const needleValues = new Set<number>();
let excludedForms = 0;
const addNeedle = (v: unknown): void => {
  if (typeof v !== 'number' || !Number.isFinite(v)) return;
  needleValues.add(v);
  const forms = [String(v), v.toFixed(5), (v * 100).toFixed(3)];
  for (const f of forms) {
    const digits = f.replace(/[^0-9]/g, '').replace(/^0+/, '');
    if (digits.length < 4 || !f.includes('.') || f.split('.')[1].length < 3) {
      excludedForms += 1; continue;
    }
    if (DERIVED_EXEMPT.has(f)) { excludedForms += 1; continue; }
    needleForms.add(f);
  }
};
const walkNeedles = (v: unknown, depth = 0): void => {
  if (depth > 8) return;
  if (Array.isArray(v)) { for (const x of v) walkNeedles(x, depth + 1); return; }
  if (v !== null && typeof v === 'object') {
    for (const x of Object.values(v as Record<string, unknown>)) walkNeedles(x, depth + 1);
    return;
  }
  addNeedle(v);
};
for (const key of ['tables', 'shape']) {
  walkNeedles((l3c0b as Record<string, unknown>)[key]);
  walkNeedles((l3c0 as Record<string, unknown>)[key]);
}
walkNeedles((l3t0 as Record<string, unknown>).smoke);
walkNeedles((l3t1 as Record<string, unknown>).yardstick);
walkNeedles((l3t1 as Record<string, unknown>).score);
const srcBlob = srcFiles.map((f) => f.text).join('\n');
const collisionRows: { form: string; tokens: string[]; sites: string[]; isLeak: boolean }[] = [];
const rawValueHits = [...needleForms].filter((n) => srcBlob.includes(n));
for (const form of rawValueHits) {
  const tokens = new Set<string>();
  const sites: string[] = [];
  for (const f of srcFiles) {
    f.text.split('\n').forEach((line, i) => {
      if (!line.includes(form)) return;
      sites.push(`${f.path}:${i + 1}`);
      for (const t of line.match(/-?\d+\.\d+/g) ?? []) if (t.includes(form)) tokens.add(t);
    });
  }
  const isLeak = [...tokens].some((t) => [...needleValues]
    .some((v) => Math.abs(Math.abs(v) - Math.abs(Number(t))) < 1e-9));
  collisionRows.push({ form, tokens: [...tokens], sites: sites.slice(0, 4), isLeak });
}
const valueHits = collisionRows.filter((r) => r.isLeak).map((r) => r.form);
const prefixCollisions = collisionRows.filter((r) => !r.isLeak);
const nameHits = ['l3-c0b-window-decomposition', 'l3-t0-defence-book-seam',
  'l3-c0-lunge-outcome-census', 'l3-t1-convergence-exam', 'l3-t2-armed-world-read']
  .filter((n) => srcBlob.includes(n));
const loaderHits = srcFiles.filter((f) => /readFileSync|docs\/world-model|import\(/.test(f.code)
  && /l3Defence|defenceBook/.test(f.code)).map((f) => f.path);
const controlNeedleFound = srcBlob.includes(CONTROL_NEEDLE);

/* ---- the league fingerprint, re-derived IN THIS PROCESS ---------------------------- */
const fingerprintOf = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const fpObserved = SKIP_FP ? 'SKIPPED' : fingerprintOf(1337);

/* ---- gSeed ------------------------------------------------------------------------ */
const CLAIMED: { name: string; range: [number, number] }[] = [
  ...(BASE_RUN === BATTERY_BASE
    ? [{
      name: 'L3-T2 battery',
      range: [BASE_RUN, BASE_RUN + R_RUN * MATCHES_PER_REPLICATE - 1] as [number, number],
    }]
    : []),
  { name: 'L3-T2 smoke sub-block', range: [SMOKE_BASE, SMOKE_BASE + 27] },
  { name: 'L3-T2 guard/preflight block', range: [GUARD_BASE, GUARD_BASE + GUARD_SPAN - 1] },
  { name: 'L3-T2 gWorld construction seed', range: [GWORLD_SEED, GWORLD_SEED] },
];
const overlaps = (a: readonly [number, number], b: readonly [number, number]): boolean =>
  a[0] <= b[1] && b[0] <= a[1];
const seedClashes = CLAIMED.flatMap((c) => CONSUMED
  .filter((p) => overlaps(c.range, p.range)).map((p) => `${c.name} ∩ ${p.name}`));
const claimedInternalClashes = CLAIMED.flatMap((c, i) => CLAIMED.slice(i + 1)
  .filter((d) => overlaps(c.range, d.range)).map((d) => `${c.name} ∩ ${d.name}`));
const allSeedsInBand = CL.every((c) => c.rows.every((r) => r.seed >= BASE_RUN
  && r.seed <= BASE_RUN + R_RUN * MATCHES_PER_REPLICATE - 1));

/* ---- gWorld ----------------------------------------------------------------------- */
const worldSeedMatch = matchOf(GWORLD_SEED, 'baseline', null);
const worldSeedOk = cbArmedVersion(worldSeedMatch) === CB_WORLD_VERSION;
const worldOkCount = CL.reduce((a, c) => a + c.rows.filter((r) => r.armOk).length, 0);
const worldTotal = CL.reduce((a, c) => a + c.rows.length, 0);

/* ---- gClusters -------------------------------------------------------------------- */
const clusterCheck = (() => {
  const perArm = ARMS.map((a) => armClusters(a).length);
  const seedsPerArm = ARMS.map((a) => armRows(a).map((r) => r.seed).join(','));
  return {
    clustersPerArm: perArm,
    equalAcrossArms: perArm.every((n) => n === perArm[0]),
    pairedSameSeeds: seedsPerArm.every((s) => s === seedsPerArm[0]),
    matchesPerCluster: [...new Set(CL.map((c) => c.rows.length))],
    totalRows: worldTotal,
  };
})();

/* ---- gFaces: the published faces re-derive from the stored raw rows alone ---------- */
const faceRederivation = (() => {
  let checked = 0; let bad = 0;
  for (const row of C.faces) {
    const f = FACES[row.face];
    for (const arm of ARMS) {
      const n = sum(armClusters(arm).map((c) => f.num(c)));
      const d = sum(armClusters(arm).map((c) => f.den(c)));
      checked += 1;
      const want = ratio(n, d);
      const got = row.arms[arm].point;
      if (!(Number.isNaN(want) && Number.isNaN(got)) && Math.abs(want - got) > 1e-12) bad += 1;
    }
  }
  return { checked, bad };
})();

/* ---- the MECHANISM READ (the pre-registered direction, MECHANICALLY flagged) -------- */
const faceOf = (k: string): FaceRow => C.faces.find((f) => f.face === k) as FaceRow;
const MECHANISM = (() => {
  const rec = faceOf('lungesRecklessPerTeamMatch');
  const ctl = faceOf('lungesControlledPerTeamMatch');
  const rel = (f: FaceRow, arm: string): number => f.contrasts[`${arm}_minus_baseline`].relative;
  return {
    recklessRelative: { vetoReset: rel(rec, 'vetoReset'), vetoMatured: rel(rec, 'vetoMatured') },
    controlledRelative: { vetoReset: rel(ctl, 'vetoReset'), vetoMatured: rel(ctl, 'vetoMatured') },
    /** ⭐ THE DESIGNED PATHWAY: the suppression is CONCENTRATED on RECKLESS. */
    rightPathway: {
      vetoReset: rel(rec, 'vetoReset') < 0
        && rel(rec, 'vetoReset') < rel(ctl, 'vetoReset'),
      vetoMatured: rel(rec, 'vetoMatured') < 0
        && rel(rec, 'vetoMatured') < rel(ctl, 'vetoMatured'),
    },
    /** ⚠ THE WRONG PATHWAY: controlled lunges suppressed harder than reckless ones. */
    wrongPathway: {
      vetoReset: rel(ctl, 'vetoReset') < rel(rec, 'vetoReset'),
      vetoMatured: rel(ctl, 'vetoMatured') < rel(rec, 'vetoMatured'),
    },
    preRegistered: {
      cSuppressesRecklessMost: rel(rec, 'vetoMatured') < rel(rec, 'vetoReset'),
      bBetweenAAndC: rel(rec, 'vetoReset') <= 0
        && rel(rec, 'vetoReset') >= rel(rec, 'vetoMatured'),
      spellsLengthen: {
        vetoReset: faceOf('spellMeanSeconds').contrasts.vetoReset_minus_baseline.delta > 0,
        vetoMatured: faceOf('spellMeanSeconds').contrasts.vetoMatured_minus_baseline.delta > 0,
      },
      pressedShareFalls: {
        vetoReset: faceOf('pressedReceptionShare').contrasts.vetoReset_minus_baseline.delta < 0,
        vetoMatured: faceOf('pressedReceptionShare').contrasts.vetoMatured_minus_baseline.delta < 0,
      },
      vetoesFireMostlyOnReckless: {
        vetoReset: vetoCounts.vetoReset.byGroup[1] > vetoCounts.vetoReset.byGroup[0],
        vetoMatured: vetoCounts.vetoMatured.byGroup[1] > vetoCounts.vetoMatured.byGroup[0],
      },
    },
  };
})();

/* ========================================================================== */
/* §11 THE GATE REGISTRY + THE MACHINE-DERIVED LIVENESS MAP (#268.3(a))        */
/* ========================================================================== */
type Conj = Record<string, boolean>;
interface MutantResult {
  gate: string; name: string; conjunct: string; flipped: boolean; othersSurvived: boolean;
  live: boolean;
}
interface GateSpec<I> {
  name: string;
  fn: (i: I) => Conj;
  input: I;
  mutants: readonly { conjunct: string; name: string; mutate: (i: I) => I }[];
}
const REGISTRY: GateSpec<never>[] = [];
const registerGate = <I>(spec: GateSpec<I>): void => {
  REGISTRY.push(spec as unknown as GateSpec<never>);
};
const runMutant = <I>(
  gate: string, name: string, conjunct: string, fn: (i: I) => Conj, base: Conj, mutated: I,
): MutantResult => {
  const out = fn(mutated);
  const flipped = base[conjunct] === true && out[conjunct] === false;
  const othersSurvived = Object.keys(base).filter((k) => k !== conjunct)
    .every((k) => out[k] === base[k]);
  return { gate, name, conjunct, flipped, othersSurvived, live: flipped && othersSurvived };
};

/* ---- 1 gDet ---- */
registerGate<{ equal: boolean; digest: string }>({
  name: 'gDet',
  fn: (i) => ({ rederivesBitIdentically: i.equal, digestNonEmpty: i.digest.length === 64 }),
  input: { equal: digestA === digestB, digest: digestA },
  mutants: [
    { conjunct: 'rederivesBitIdentically', name: 'the second run differed', mutate: (i) => ({ ...i, equal: false }) },
    { conjunct: 'digestNonEmpty', name: 'no digest was produced', mutate: (i) => ({ ...i, digest: '' }) },
  ],
});

/* ---- 2 xSrcUntouched ---- */
const srcDiff = gitOut('git diff --stat -- src');
const srcStatus = gitOut('git status --porcelain -- src');
registerGate<{ diff: string; status: string }>({
  name: 'xSrcUntouched',
  fn: (i) => ({ noWorktreeDiff: i.diff === '', noUntrackedOrStaged: i.status === '' }),
  input: { diff: srcDiff, status: srcStatus },
  mutants: [
    { conjunct: 'noWorktreeDiff', name: 'src moved in the worktree', mutate: (i) => ({ ...i, diff: 'src/sim/Match.ts | 2 +-' }) },
    { conjunct: 'noUntrackedOrStaged', name: 'an untracked src file appeared', mutate: (i) => ({ ...i, status: '?? src/x.ts' }) },
  ],
});

/* ---- 3 xFpProd ---- */
registerGate<{ observed: string; skipped: boolean }>({
  name: 'xFpProd',
  fn: (i) => ({
    theProductionFingerprintIsUnmoved: i.skipped || i.observed === FINGERPRINT_BASELINE,
    itWasActuallyRecomputed: !i.skipped,
  }),
  input: { observed: fpObserved, skipped: SKIP_FP },
  mutants: [
    { conjunct: 'theProductionFingerprintIsUnmoved', name: 'the fingerprint moved', mutate: (i) => ({ ...i, observed: 'deadbeef' }) },
    { conjunct: 'itWasActuallyRecomputed', name: 'the fingerprint was skipped', mutate: (i) => ({ ...i, skipped: true }) },
  ],
});

/* ---- 4 gWorld ---- */
registerGate<{ ok: number; total: number; constructionSeedOk: boolean }>({
  name: 'gWorld',
  fn: (i) => ({
    everyWalkIsTheWorldOfRecord: i.ok === i.total,
    theConstructionSeedIsTheWorldOfRecord: i.constructionSeedOk,
    nonVacuousWalkCount: i.total > 0,
  }),
  input: { ok: worldOkCount, total: worldTotal, constructionSeedOk: worldSeedOk },
  mutants: [
    { conjunct: 'everyWalkIsTheWorldOfRecord', name: 'one walk was not the world of record', mutate: (i) => ({ ...i, ok: i.ok - 1 }) },
    { conjunct: 'theConstructionSeedIsTheWorldOfRecord', name: 'the construction seed was not armed', mutate: (i) => ({ ...i, constructionSeedOk: false }) },
    { conjunct: 'nonVacuousWalkCount', name: 'no walk happened at all', mutate: (i) => ({ ...i, ok: 0, total: 0 }) },
  ],
});

/* ---- 5 gByteIdentical — ARM A *IS* THE OFF WORLD ---- */
registerGate<{ ok: number; total: number }>({
  name: 'gByteIdentical',
  fn: (i) => ({
    theBaselineArmIsTheOffWorld: i.ok === i.total,
    nonVacuousComparisonCount: i.total > 0,
  }),
  input: byteIdentical,
  mutants: [
    { conjunct: 'theBaselineArmIsTheOffWorld', name: 'one seed diverged', mutate: (i) => ({ ...i, ok: i.ok - 1 }) },
    { conjunct: 'nonVacuousComparisonCount', name: 'nothing was compared', mutate: (i) => ({ ...i, ok: 0, total: 0 }) },
  ],
});

/* ---- 6 gArms ---- */
const armsAllOk = CL.every((c) => c.rows.every((r) => r.armOk));
registerGate<{ allOk: boolean; rows: number; arms: number }>({
  name: 'gArms',
  fn: (i) => ({
    everyArmMatchesItsConfiguration: i.allOk,
    fourArmsWalked: i.arms === 4,
    nonVacuousRowCount: i.rows > 0,
  }),
  input: { allOk: armsAllOk, rows: worldTotal, arms: ARMS.length },
  mutants: [
    { conjunct: 'everyArmMatchesItsConfiguration', name: 'an arm was mis-configured', mutate: (i) => ({ ...i, allOk: false }) },
    { conjunct: 'fourArmsWalked', name: 'an arm was dropped', mutate: (i) => ({ ...i, arms: 3 }) },
    { conjunct: 'nonVacuousRowCount', name: 'no rows were walked', mutate: (i) => ({ ...i, rows: 0 }) },
  ],
});

/* ---- 7 gDose — arm C starts every season on L3-T1's COMMITTED cells ---- */
registerGate<{ seasons: number; exact: number; labels: number }>({
  name: 'gDose',
  fn: (i) => ({
    everyMaturedSeasonStartsOnTheCommittedCells: i.exact === i.seasons,
    theDoseIsNonEmpty: i.labels > 0,
    nonVacuousSeasonCount: i.seasons > 0,
  }),
  input: {
    seasons: doseReceipt.seasons, exact: doseReceipt.exact, labels: doseReceipt.doseTotalLabels,
  },
  mutants: [
    { conjunct: 'everyMaturedSeasonStartsOnTheCommittedCells', name: 'a dosed season started elsewhere', mutate: (i) => ({ ...i, exact: i.exact - 1 }) },
    { conjunct: 'theDoseIsNonEmpty', name: 'the dose was empty', mutate: (i) => ({ ...i, labels: 0 }) },
    { conjunct: 'nonVacuousSeasonCount', name: 'no dosed season existed', mutate: (i) => ({ ...i, seasons: 0, exact: 0 }) },
  ],
});

/* ---- 8 gReset — the SHIPPED LAW: every other armed season starts EMPTY ---- */
registerGate<{ seasons: number; empty: number; filled: number }>({
  name: 'gReset',
  fn: (i) => ({
    everyResetSeasonStartsEmpty: i.empty === i.seasons,
    andEndsWithEvidence: i.filled === i.seasons,
    nonVacuousResetSeasonCount: i.seasons > 0,
  }),
  input: resetReceipt,
  mutants: [
    { conjunct: 'everyResetSeasonStartsEmpty', name: 'a season began on a stale book', mutate: (i) => ({ ...i, empty: i.empty - 1 }) },
    { conjunct: 'andEndsWithEvidence', name: 'a season closed with an empty book', mutate: (i) => ({ ...i, filled: i.filled - 1 }) },
    { conjunct: 'nonVacuousResetSeasonCount', name: 'no reset season existed', mutate: (i) => ({ ...i, seasons: 0, empty: 0, filled: 0 }) },
  ],
});

/* ---- 9 gVetoLive — the veto is ARMED and FIRING in B and C, DARK in A ---- */
registerGate<{
  base: number; b: number; c: number; off: number; served: number; attributed: number;
  ambiguous: number;
}>({
  name: 'gVetoLive',
  fn: (i) => ({
    theBaselineArmServesNoVeto: i.base === 0 && i.off === 0,
    theSeasonResetArmFires: i.b > 0,
    theMaturedArmFires: i.c > 0,
    /** ⭐ the attribution BOOK-KEEPS: every served veto is either attributed to a group or
     *  counted AMBIGUOUS — none is lost, and the ambiguous share is REPORTED, never hidden. */
    everyVetoIsAttributedOrCountedAmbiguous: i.attributed + i.ambiguous === i.served,
  }),
  input: {
    base: vetoCounts.baseline.total,
    b: vetoCounts.vetoReset.total,
    c: vetoCounts.vetoMatured.total,
    off: vetoCounts.off.total,
    served: vetoCounts.vetoReset.total + vetoCounts.vetoMatured.total,
    attributed: sum(vetoCounts.vetoReset.byGroup) + sum(vetoCounts.vetoMatured.byGroup),
    ambiguous: vetoCounts.vetoReset.ambiguous + vetoCounts.vetoMatured.ambiguous,
  },
  mutants: [
    { conjunct: 'theBaselineArmServesNoVeto', name: 'the baseline served a veto', mutate: (i) => ({ ...i, base: 1 }) },
    { conjunct: 'theSeasonResetArmFires', name: 'the shipped arm never vetoed', mutate: (i) => ({ ...i, b: 0 }) },
    { conjunct: 'theMaturedArmFires', name: 'the matured arm never vetoed', mutate: (i) => ({ ...i, c: 0 }) },
    { conjunct: 'everyVetoIsAttributedOrCountedAmbiguous', name: 'a served veto went unaccounted', mutate: (i) => ({ ...i, attributed: i.attributed - 1 }) },
  ],
});

/* ---- 10 gVetoStructural — decline-only proven by POSITION (#280.2(ii)) ---- */
registerGate<{ jockey: number; veto: number; commit: number; sites: number; presets: boolean }>({
  name: 'gVetoStructural',
  fn: (i) => ({
    theVetoSitsBetweenTheJockeyGateAndTheCommitLine:
      i.jockey >= 0 && i.veto > i.jockey && i.commit > i.veto,
    exactlyTwoExecutableReadSites: i.sites === 2,
    noPresetArmsTheVeto: !i.presets,
  }),
  input: {
    jockey: IDX_JOCKEY, veto: IDX_VETO, commit: IDX_COMMIT,
    sites: declinesReadSites, presets: vetoFlagInPresets,
  },
  mutants: [
    { conjunct: 'theVetoSitsBetweenTheJockeyGateAndTheCommitLine', name: 'the veto site moved out of series', mutate: (i) => ({ ...i, veto: i.commit + 1 }) },
    { conjunct: 'exactlyTwoExecutableReadSites', name: 'a third read site appeared', mutate: (i) => ({ ...i, sites: 3 }) },
    { conjunct: 'noPresetArmsTheVeto', name: 'a shipped preset arms the veto', mutate: (i) => ({ ...i, presets: true }) },
  ],
});

/* ---- 11 gMeters — the seam's meter IS the engine's own counter ---- */
registerGate<{ ok: number; total: number; labelsOk: number; scanOk: number }>({
  name: 'gMeters',
  fn: (i) => ({
    firedEqualsTheEnginesArmedChallenges: i.ok === i.total,
    theLedgersOwnBookkeepingCloses: i.labelsOk === i.total,
    theByGroupScanNeverOverCounts: i.scanOk === i.total,
    nonVacuousMeterCount: i.total > 0,
  }),
  input: meterAgreement,
  mutants: [
    { conjunct: 'firedEqualsTheEnginesArmedChallenges', name: 'a walk\'s meters disagreed', mutate: (i) => ({ ...i, ok: i.ok - 1 }) },
    { conjunct: 'theLedgersOwnBookkeepingCloses', name: 'an opened label neither closed nor was censored', mutate: (i) => ({ ...i, labelsOk: i.labelsOk - 1 }) },
    { conjunct: 'theByGroupScanNeverOverCounts', name: 'the by-group scan invented a label', mutate: (i) => ({ ...i, scanOk: i.scanOk - 1 }) },
    { conjunct: 'nonVacuousMeterCount', name: 'no meters were read', mutate: (i) => ({ ...i, ok: 0, total: 0, labelsOk: 0, scanOk: 0 }) },
  ],
});

/* ---- 12 gWindowApplied ---- */
registerGate<{ spans: number[]; nominal: number }>({
  name: 'gWindowApplied',
  fn: (i) => ({
    everyLabelSpansTheAppliedWindow: i.spans.every((s) => s === APPLIED_WINDOW_TICKS),
    theAppliedWindowIsTheCeilingOfTheNominalOne:
      Math.ceil(i.nominal / DT) === APPLIED_WINDOW_TICKS,
    nonVacuousSpanSet: i.spans.length > 0,
  }),
  input: { spans: spanTicksSeen, nominal: L3_DEFENCE_WINDOW_S },
  mutants: [
    { conjunct: 'everyLabelSpansTheAppliedWindow', name: 'a label closed off-window', mutate: (i) => ({ ...i, spans: [...i.spans, 55] }) },
    { conjunct: 'theAppliedWindowIsTheCeilingOfTheNominalOne', name: 'the derivation stopped implying the applied window', mutate: (i) => ({ ...i, nominal: 2 }) },
    { conjunct: 'nonVacuousSpanSet', name: 'no label closed at all', mutate: (i) => ({ ...i, spans: [] }) },
  ],
});

/* ---- 13 gClusters ---- */
registerGate<{
  equal: boolean; paired: boolean; sizes: number[]; perArm: number[]; rows: number;
}>({
  name: 'gClusters',
  fn: (i) => ({
    everyArmHasTheSameClusterCount: i.equal,
    theArmsWalkTheSAMESeeds: i.paired,
    everyClusterIsOneSeason: i.sizes.length === 1 && i.sizes[0] === FIXTURES_PER_SEASON,
    nonVacuousClusterCount: i.perArm[0] > 0 && i.rows > 0,
  }),
  input: {
    equal: clusterCheck.equalAcrossArms, paired: clusterCheck.pairedSameSeeds,
    sizes: clusterCheck.matchesPerCluster, perArm: clusterCheck.clustersPerArm,
    rows: clusterCheck.totalRows,
  },
  mutants: [
    { conjunct: 'everyArmHasTheSameClusterCount', name: 'an arm ran short', mutate: (i) => ({ ...i, equal: false }) },
    { conjunct: 'theArmsWalkTheSAMESeeds', name: 'the arms were not paired', mutate: (i) => ({ ...i, paired: false }) },
    { conjunct: 'everyClusterIsOneSeason', name: 'a cluster was not one season', mutate: (i) => ({ ...i, sizes: [...i.sizes, 3] }) },
    { conjunct: 'nonVacuousClusterCount', name: 'no cluster existed', mutate: (i) => ({ ...i, perArm: [0], rows: 0 }) },
  ],
});

/* ---- 14 gFaces ---- */
registerGate<{ checked: number; bad: number; keys: number }>({
  name: 'gFaces',
  fn: (i) => ({
    everyPublishedFaceRederivesFromTheStoredRows: i.bad === 0,
    everyFrozenFaceIsPublished: i.keys === FACE_KEYS.length,
    nonVacuousFaceCount: i.checked > 0,
  }),
  input: { checked: faceRederivation.checked, bad: faceRederivation.bad, keys: C.faces.length },
  mutants: [
    { conjunct: 'everyPublishedFaceRederivesFromTheStoredRows', name: 'a face did not re-derive', mutate: (i) => ({ ...i, bad: 1 }) },
    { conjunct: 'everyFrozenFaceIsPublished', name: 'a face went missing', mutate: (i) => ({ ...i, keys: i.keys - 1 }) },
    { conjunct: 'nonVacuousFaceCount', name: 'nothing was re-derived', mutate: (i) => ({ ...i, checked: 0 }) },
  ],
});

/* ---- 15 gSizing ---- */
registerGate<{ s: Sizing; frozen: typeof FROZEN_SIZING; shapeOk: boolean }>({
  name: 'gSizing',
  fn: (i) => ({
    theDeffIsTheCommittedOne: Math.abs(i.s.deff - i.frozen.deff) < 1e-9,
    theCommittedMomentsAreTheFrozenOnes:
      Math.abs(i.s.perTeamMatchMean[0] - i.frozen.meanControlled) < 1e-6
      && Math.abs(i.s.perTeamMatchMean[1] - i.frozen.meanReckless) < 1e-6
      && Math.abs(i.s.perTeamMatchSd[0] - i.frozen.sdControlled) < 1e-6
      && Math.abs(i.s.perTeamMatchSd[1] - i.frozen.sdReckless) < 1e-6,
    theFrozenMdeIsTheRecomputedOne:
      Math.abs(i.s.mdeAbs[0] - i.frozen.mdeControlledPerTeamMatch) < 1e-5
      && Math.abs(i.s.mdeAbs[1] - i.frozen.mdeRecklessPerTeamMatch) < 1e-5,
    theBatteryRanAtTheFrozenShape: i.shapeOk,
  }),
  input: {
    s: FROZEN_SHAPE_SIZING(),
    frozen: FROZEN_SIZING,
    shapeOk: MODE !== 'full' || (R_RUN === R_FROZEN && M_RUN === M_FROZEN),
  },
  mutants: [
    { conjunct: 'theDeffIsTheCommittedOne', name: 'the deff was not the committed one', mutate: (i) => ({ ...i, s: { ...i.s, deff: 1 } }) },
    { conjunct: 'theCommittedMomentsAreTheFrozenOnes', name: 'the census moments moved', mutate: (i) => ({ ...i, s: { ...i.s, perTeamMatchMean: [0, 0] } }) },
    { conjunct: 'theFrozenMdeIsTheRecomputedOne', name: 'the frozen MDE disagrees with the derivation', mutate: (i) => ({ ...i, s: { ...i.s, mdeAbs: [0, 0] } }) },
    { conjunct: 'theBatteryRanAtTheFrozenShape', name: 'the full battery ran at another shape', mutate: (i) => ({ ...i, shapeOk: false }) },
  ],
});

/* ---- 16 gSeed ---- */
registerGate<{
  clashes: string[]; internal: string[]; inBand: boolean; ordered: boolean;
}>({
  name: 'gSeed',
  fn: (i) => ({
    noClashWithTheConsumedLedger: i.clashes.length === 0,
    noInternalClash: i.internal.length === 0,
    everyWalkedSeedIsInTheClaimedBattery: i.inBand,
    theClaimedBlocksAreOrdered: i.ordered,
  }),
  input: {
    clashes: seedClashes,
    internal: claimedInternalClashes,
    inBand: allSeedsInBand,
    ordered: CLAIMED.every((c) => c.range[0] <= c.range[1]),
  },
  mutants: [
    { conjunct: 'noClashWithTheConsumedLedger', name: 'a claimed block collided with a consumed one', mutate: (i) => ({ ...i, clashes: ['x'] }) },
    { conjunct: 'noInternalClash', name: 'two claimed blocks overlapped', mutate: (i) => ({ ...i, internal: ['x'] }) },
    { conjunct: 'everyWalkedSeedIsInTheClaimedBattery', name: 'a walk left the claimed band', mutate: (i) => ({ ...i, inBand: false }) },
    { conjunct: 'theClaimedBlocksAreOrdered', name: 'a block was inverted', mutate: (i) => ({ ...i, ordered: false }) },
  ],
});

/* ---- 17 gStats ---- */
const minGap = Math.min(...STATS_PUBLISHED_BASES.map((b) => Math.abs(STATS_BASE - b)));
registerGate<{ base: number; gap: number; resamples: number }>({
  name: 'gStats',
  fn: (i) => ({
    theBaseIsTheDispatchedFloor: i.base === 111_400,
    theGapToEveryPublishedBaseIsAtLeastTheStep: i.gap >= STATS_STEP,
    theResampleCountIsTheFrozenOne: i.resamples === BOOTSTRAP,
  }),
  input: { base: STATS_BASE, gap: minGap, resamples: BOOTSTRAP },
  mutants: [
    { conjunct: 'theBaseIsTheDispatchedFloor', name: 'the stats base moved', mutate: (i) => ({ ...i, base: 1 }) },
    { conjunct: 'theGapToEveryPublishedBaseIsAtLeastTheStep', name: 'the stream collided with a published base', mutate: (i) => ({ ...i, gap: 0 }) },
    { conjunct: 'theResampleCountIsTheFrozenOne', name: 'the resample count moved', mutate: (i) => ({ ...i, resamples: 1 }) },
  ],
});

/* ---- 18 gEnvClean ---- */
registerGate<{ rogue: number; doors: number; preflight: boolean; out: string }>({
  name: 'gEnvClean',
  fn: (i) => ({
    noRogueOwnVariable: i.rogue === 0,
    noEngineDoorIsSet: i.doors === 0,
    aPreflightNeverWritesACanonicalPath: !i.preflight || !isCanonicalPath(i.out),
  }),
  input: {
    rogue: rogueOwn.length, doors: rogueEngine.length, preflight: IS_PREFLIGHT, out: OUT_PATH,
  },
  mutants: [
    { conjunct: 'noRogueOwnVariable', name: 'a rogue L3T2_* var was accepted', mutate: (i) => ({ ...i, rogue: 1 }) },
    { conjunct: 'noEngineDoorIsSet', name: 'an engine door was set', mutate: (i) => ({ ...i, doors: 1 }) },
    { conjunct: 'aPreflightNeverWritesACanonicalPath', name: 'a preflight wrote the canonical artifact', mutate: (i) => ({ ...i, preflight: true, out: OUT_BY_MODE.full }) },
  ],
});

/* ---- 19 gValuesUnreachable ---- */
registerGate<{
  leaks: string[]; names: string[]; loaders: string[]; control: boolean; forms: number;
}>({
  name: 'gValuesUnreachable',
  fn: (i) => ({
    noMeasuredAnswerIsReachableFromSrc: i.leaks.length === 0,
    noArtifactNameIsReachableFromSrc: i.names.length === 0,
    noSeamFileLoadsAnArtifact: i.loaders.length === 0,
    theControlNeedleWasFound: i.control,
    nonVacuousNeedleSet: i.forms > 0,
  }),
  input: {
    leaks: valueHits, names: nameHits, loaders: loaderHits, control: controlNeedleFound,
    forms: needleForms.size,
  },
  mutants: [
    { conjunct: 'noMeasuredAnswerIsReachableFromSrc', name: 'a measured answer leaked into src', mutate: (i) => ({ ...i, leaks: ['0.12345'] }) },
    { conjunct: 'noArtifactNameIsReachableFromSrc', name: 'an artifact name appeared in src', mutate: (i) => ({ ...i, names: ['x'] }) },
    { conjunct: 'noSeamFileLoadsAnArtifact', name: 'the seam learned to read an artifact', mutate: (i) => ({ ...i, loaders: ['src/ai/defenceBook.ts'] }) },
    { conjunct: 'theControlNeedleWasFound', name: 'the search itself was broken', mutate: (i) => ({ ...i, control: false }) },
    { conjunct: 'nonVacuousNeedleSet', name: 'no needle was extracted', mutate: (i) => ({ ...i, forms: 0 }) },
  ],
});

/* ---- 20 gHashEnvelope ---- */
const envelopeInput = {
  crossOutIdentical: false, rederivesFromDisk: false, forbidden: [] as string[],
};
registerGate<typeof envelopeInput>({
  name: 'gHashEnvelope',
  fn: (i) => ({
    theBodyRederivesItsDigestFromDisk: i.rederivesFromDisk,
    aCrossOutWithAnotherEnvelopeHasTheIdenticalDigest: i.crossOutIdentical,
    noTimingFieldIsInTheHashedBody: i.forbidden.length === 0,
  }),
  input: envelopeInput,
  mutants: [
    { conjunct: 'theBodyRederivesItsDigestFromDisk', name: 'the artifact on disk did not re-derive', mutate: (i) => ({ ...i, rederivesFromDisk: false }) },
    { conjunct: 'aCrossOutWithAnotherEnvelopeHasTheIdenticalDigest', name: 'the envelope entered the digest', mutate: (i) => ({ ...i, crossOutIdentical: false }) },
    { conjunct: 'noTimingFieldIsInTheHashedBody', name: 'a wall-clock field entered the body', mutate: (i) => ({ ...i, forbidden: ['wallMs'] }) },
  ],
});

/* ---- 21 gMutants ---- */
const gMutantsInput = { uncovered: [] as string[], dead: 0, total: 0 };
registerGate<typeof gMutantsInput>({
  name: 'gMutants',
  fn: (i) => ({
    noUncoveredConjunctNoGhostNoDuplicate: i.uncovered.length === 0,
    everyMutantIsLive: i.dead === 0,
    nonVacuousMutantCount: i.total > 0,
  }),
  input: gMutantsInput,
  mutants: [
    { conjunct: 'noUncoveredConjunctNoGhostNoDuplicate', name: 'a conjunct owned no mutant', mutate: (i) => ({ ...i, uncovered: ['x'] }) },
    { conjunct: 'everyMutantIsLive', name: 'a mutant was dead', mutate: (i) => ({ ...i, dead: 1 }) },
    { conjunct: 'nonVacuousMutantCount', name: 'no mutant ran', mutate: (i) => ({ ...i, total: 0 }) },
  ],
});

/* ========================================================================== */
/* §12 THE COVERAGE MAP, EXACTLY-ONE ENFORCED (#268.3(a))                       */
/* ========================================================================== */
const COVERAGE_MAP: Record<string, string[]> = {};
const uncoveredConjuncts: string[] = [];
for (const spec of REGISTRY) {
  const keys = Object.keys(spec.fn(spec.input));
  COVERAGE_MAP[spec.name] = keys;
  for (const k of keys) {
    if (!spec.mutants.some((mu) => mu.conjunct === k)) uncoveredConjuncts.push(`${spec.name}.${k}`);
  }
  const seen = new Set<string>();
  for (const mu of spec.mutants) {
    if (!keys.includes(mu.conjunct)) uncoveredConjuncts.push(`${spec.name}.${mu.conjunct}(ghost)`);
    if (seen.has(mu.conjunct)) uncoveredConjuncts.push(`${spec.name}.${mu.conjunct}(duplicate)`);
    seen.add(mu.conjunct);
  }
}
const CONJUNCT_TOTAL = Object.values(COVERAGE_MAP).reduce((a, v) => a + v.length, 0);
if (uncoveredConjuncts.length > 0) {
  banner('L3-T2 REFUSES TO RUN — the coverage map is incomplete (#268.3(a)):');
  for (const u of uncoveredConjuncts) banner(`  · ${u}`);
  process.exit(3);
}

const runRegistry = (): { gates: Record<string, boolean>; mutants: MutantResult[] } => {
  const gates: Record<string, boolean> = {};
  const mutants: MutantResult[] = [];
  for (const spec of REGISTRY) {
    const base = spec.fn(spec.input);
    gates[spec.name] = Object.values(base).every(Boolean);
    for (const mu of spec.mutants) {
      mutants.push(runMutant(spec.name, mu.name, mu.conjunct, spec.fn, base, mu.mutate(spec.input)));
    }
  }
  return { gates, mutants };
};

/* ========================================================================== */
/* §13 THE ARTIFACT                                                            */
/* ========================================================================== */
const pubFace = (f: FaceRow): Record<string, unknown> => ({
  face: f.face, unit: f.unit, what: f.what,
  arms: Object.fromEntries(Object.entries(f.arms).map(([k, v]) => [k, {
    point: round(v.point, 6), num: v.num, den: v.den,
    ci95: v.ci95.map((x) => round(x, 6)),
  }])),
  contrasts: Object.fromEntries(Object.entries(f.contrasts).map(([k, v]) => [k, {
    delta: round(v.delta, 6), ci95: v.ci95.map((x) => round(x, 6)),
    relative: round(v.relative, 6),
    resolved: (v.ci95[0] > 0 && v.ci95[1] > 0) || (v.ci95[0] < 0 && v.ci95[1] < 0),
  }])),
});

const buildBody = (
  gates: Record<string, boolean>, mutants: MutantResult[],
): Record<string, unknown> => ({
  stage: 'L3-T2 — THE ARMED WORLD READ',
  doc: 'docs/world-model/L3-T2-ARMED-WORLD-READ.md',
  ruling: '#281.4 dispatched · #281.3 BOTH BOOK ARMS · #279.3 the label · #280.2 the applied window',
  mode: MODE,
  preflight: IS_PREFLIGHT,
  preflightReasons: PREFLIGHT_REASONS,
  envWhitelist: ENV_WHITELIST,
  engineEnvDoorsRefused: ENGINE_DOORS,
  frozen: {
    question: 'with the defence book LIVE (learning + veto armed) in the polished armed world, '
      + 'what happens to 乱抢\'s measured faces? — ALL REPORTED, NEVER GATED (rung-one honesty).',
    arms: {
      off: 'neither flag — the TRUE unarmed anchor (identity control only)',
      baseline: 'ARM A — learn ON, veto OFF: the OFF world with the seam\'s meters on '
        + '(byte-identical to `off`, gated on every seed)',
      vetoReset: 'ARM B — learn + veto, books WIPED at every season boundary (THE SHIPPED LAW, '
        + 'primary; its steady state is PERPETUAL SEASON-ONE BOOKS)',
      vetoMatured: 'ARM C — learn + veto, books TRUTH-DOSED at every season boundary with '
        + 'L3-T1\'s committed final-book cells (the world where the lesson is fully learned)',
    },
    cluster: '⭐ ONE (replicate, season) BLOCK = 7 fixtures = 14 team-matches — the unit of BOOK '
      + 'STATE in every armed arm; the arms are PAIRED on the same seeds.',
    window: {
      appliedTicks: APPLIED_WINDOW_TICKS,
      appliedSeconds: APPLIED_WINDOW_TICKS * DT,
      nominalSeconds: L3_DEFENCE_WINDOW_S,
    },
    clock: {
      matchDurationS: MATCH_DURATION,
      note: 'every per-match rate is on the ENGINE DEFAULT 240 s clock (applied = nominal here — '
        + 'the duration is never overridden); per-team rates divide by 2 teams.',
    },
    grain: `g2 — CONTROLLED (< v*) vs RECKLESS (>= v*); v* = ${String(L3_RECKLESS_ARRIVAL)}`,
    pressureRadiusM: PRESSURE_R,
    seasonLength: FIXTURES_PER_SEASON,
    sizingLiterals: FROZEN_SIZING,
  },
  sizingFrozenShape: {
    ...FROZEN_SHAPE_SIZING(),
    sdClusterMean: FROZEN_SHAPE_SIZING().sdClusterMean.map((v) => round(v)),
    sePaired: FROZEN_SHAPE_SIZING().sePaired.map((v) => round(v)),
    mdeAbs: FROZEN_SHAPE_SIZING().mdeAbs.map((v) => round(v)),
    mdeRelative: FROZEN_SHAPE_SIZING().mdeRelative.map((v) => round(v)),
  },
  sizing: {
    ...C.sizing,
    sdClusterMean: C.sizing.sdClusterMean.map((v) => round(v)),
    sePaired: C.sizing.sePaired.map((v) => round(v)),
    mdeAbs: C.sizing.mdeAbs.map((v) => round(v)),
    mdeRelative: C.sizing.mdeRelative.map((v) => round(v)),
    arithmetic: 'sd(cluster mean) = sd(team-match)/sqrt(14) × sqrt(deff) · '
      + 'se(paired) = sqrt(2)·sd(cluster mean)/sqrt(K) · MDE = (z_.975 + z_.80)·se',
  },
  run: {
    R: R_RUN,
    Mseasons: M_RUN,
    matchesPerReplicate: MATCHES_PER_REPLICATE,
    seeds: R_RUN * MATCHES_PER_REPLICATE,
    base: BASE_RUN,
    arms: ARMS.length,
    walks: worldTotal,
    clustersPerArm: clusterCheck.clustersPerArm[0],
    labelSpanTicksSeen: spanTicksSeen,
    lungesFired: Object.fromEntries(ARMS.map((a) => [a,
      sum(armRows(a).map((r) => r.fired[0] + r.fired[1]))])),
    labelsClosed: Object.fromEntries(ARMS.map((a) => [a,
      sum(armRows(a).map((r) => r.closed[0] + r.closed[1]))])),
  },
  faces: C.faces.map(pubFace),
  mechanismRead: MECHANISM,
  vetoCounts,
  doseReceipt: {
    ...doseReceipt,
    source: 'docs/world-model/data/l3-t1-convergence-exam.json · perBookCells[r].books[side] '
      + '@ seasons = 15 (the committed FINAL book cells)',
    cells: T1_DOSE,
  },
  resetReceipt,
  byteIdentical,
  meterAgreement,
  seeds: { claimed: CLAIMED, band: [BATTERY_BASE, 12_484_999] },
  stats: { base: STATS_BASE, bootstrap: BOOTSTRAP, floorFromRuling: 111_400, step: STATS_STEP },
  fingerprint: { baseline: FINGERPRINT_BASELINE, observed: fpObserved },
  notable: {
    needleValues: needleValues.size, needleForms: needleForms.size, excludedForms,
    rawValueHits, valueHits, prefixCollisions, nameHits, loaderHits,
    controlNeedleFound, derivedExemptions: [...DERIVED_EXEMPT],
  },
  gDetDigests: { runA: digestA, runB: digestB },
  gates,
  mutants,
  coverage: COVERAGE_MAP,
  conjunctTotal: CONJUNCT_TOTAL,
  uncoveredConjuncts,
  allGatesPass: Object.values(gates).every(Boolean),
  nonClaims: [
    '⭐ NOTHING HERE IS GATED ON A WORLD EFFECT (rung-one honesty, contract §1).',
    'No tempo cure is promised — the arc\'s contract promises the DUEL\'s learning (contract §4).',
    'The play-test after this stage is the USER GATE (乱抢少了吗).',
    'The season-boundary amendment (#281.3) is the COMMANDER\'s; this instrument only measures.',
    'src/** is byte-untouched; both flags stay hard false in every production path.',
  ],
});

const writeArtifact = (body: Record<string, unknown>, outPath: string): {
  digest: string; reread: string; crossOutIdentical: boolean;
} => {
  const digest = sha(canonical(body));
  const envelope = {
    generatedAt: new Date().toISOString(),
    head: gitOut('git rev-parse HEAD'),
    outPath, preflight: IS_PREFLIGHT, preflightReasons: PREFLIGHT_REASONS,
    wallMs: Date.now() - t0Wall,
  };
  writeFileSync(outPath, `${JSON.stringify({ ...body, resultSha256: digest, envelope }, null, 1)}\n`);
  const strip = (f: Record<string, unknown>): string => {
    const cc = JSON.parse(JSON.stringify(f)) as Record<string, unknown>;
    delete cc.resultSha256;
    delete cc.envelope;
    return sha(canonical(cc));
  };
  const crossPath = '/tmp/l3-t2-cross-out.json';
  writeFileSync(crossPath, `${JSON.stringify({
    ...body,
    resultSha256: digest,
    envelope: {
      ...envelope, outPath: crossPath, wallMs: envelope.wallMs * 2 + 7,
      generatedAt: 'ANOTHER-INVOCATION',
    },
  }, null, 1)}\n`);
  const fileA = readJson(outPath);
  const fileB = readJson(crossPath);
  return {
    digest,
    reread: strip(fileA),
    crossOutIdentical: canonical(fileA.envelope) !== canonical(fileB.envelope)
      && strip(fileA) === strip(fileB),
  };
};

let { gates, mutants } = runRegistry();
const pass1 = writeArtifact(buildBody(gates, mutants), OUT_PATH);
const FORBIDDEN_BODY_KEYS = ['wallMs', 'generatedAt', 'receiptsMs'];
envelopeInput.crossOutIdentical = pass1.crossOutIdentical;
envelopeInput.rederivesFromDisk = pass1.reread === pass1.digest;
envelopeInput.forbidden = FORBIDDEN_BODY_KEYS
  .filter((k) => canonical(buildBody(gates, mutants)).includes(`"${k}"`));
({ gates, mutants } = runRegistry());
const otherMutants = mutants.filter((m) => m.gate !== 'gMutants');
gMutantsInput.uncovered = uncoveredConjuncts;
gMutantsInput.dead = otherMutants.filter((m) => !m.live).length;
gMutantsInput.total = otherMutants.length;
({ gates, mutants } = runRegistry());
const final = writeArtifact(buildBody(gates, mutants), OUT_PATH);

const allPass = Object.values(gates).every(Boolean);
banner(`\n  [l3-t2] artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`    ${v ? 'PASS' : 'FAIL'}  ${k}`);
const dead = mutants.filter((m) => !m.live);
if (dead.length > 0) {
  banner('  [l3-t2] DEAD MUTANTS:');
  for (const m of dead) {
    banner(`    · ${m.gate}.${m.conjunct} — ${m.name} (flipped=${m.flipped} others=${m.othersSurvived})`);
  }
}
const rec = faceOf('lungesRecklessPerTeamMatch');
const ctl = faceOf('lungesControlledPerTeamMatch');
banner(`  [l3-t2] RECKLESS lunges/team/match — A ${rec.arms.baseline.point.toFixed(4)} · `
  + `B ${rec.arms.vetoReset.point.toFixed(4)} · C ${rec.arms.vetoMatured.point.toFixed(4)}`);
banner(`  [l3-t2] CONTROLLED lunges/team/match — A ${ctl.arms.baseline.point.toFixed(4)} · `
  + `B ${ctl.arms.vetoReset.point.toFixed(4)} · C ${ctl.arms.vetoMatured.point.toFixed(4)}`);
banner(`  [l3-t2] vetoes — B ${vetoCounts.vetoReset.total} (C ${vetoCounts.vetoReset.byGroup[0]} / `
  + `R ${vetoCounts.vetoReset.byGroup[1]}) · C ${vetoCounts.vetoMatured.total} `
  + `(C ${vetoCounts.vetoMatured.byGroup[0]} / R ${vetoCounts.vetoMatured.byGroup[1]})`);
banner(`  [l3-t2] ${Object.values(gates).filter(Boolean).length}/${Object.keys(gates).length} gates · `
  + `${mutants.filter((m) => m.live).length}/${mutants.length} mutants LIVE · resultSha256 ${final.digest}`);
process.exit(allPass ? 0 : 1);
