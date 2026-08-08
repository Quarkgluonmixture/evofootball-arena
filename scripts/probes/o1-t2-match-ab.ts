/**
 * O1 T2 — THE ARMED shortPass WIND-UP A/B (commander ruling #180.4)
 * ============================================================================
 * Authority: docs/world-model/O1-T2-MATCH-AB.md (the FROZEN pre-registration —
 * arms, gates, bands, seeds and the reported dimension list were fixed BEFORE a
 * single T2 datum existed), the OUTLET CONTRACT §3 invariants + §5 F-O1a/F-O1b,
 * ruling #180.3 (the three seam debts, fixed in the same commit) and #180.4
 * (this A/B's shape: the C7-T2 equilibrium form PLUS the tempo-census
 * dimensions on BOTH arms).
 *
 * TWO ARMS, PAIRED SAME SEEDS, both teams symmetric (the wind-up is physics,
 * not a choice — no adoption ladder, the C7-T2 §2 precedent):
 *   OFF    o1PassWindup false — must reproduce the shipped world bit-identically
 *   ARMED  o1PassWindup true on EVERY open-play, window-closed shortPass commit
 *          on BOTH sides — the deployment arm; the equilibrium band binds here
 * ONE mechanic per A/B: every other flag stays at its shipped default in both
 * arms (c6Carry / c7Windup / c5* absent).
 *
 * GATED (frozen ex ante):
 *   F-O1a  the §2 EQUILIBRIUM BAND (C1 §4, inherited whole — the C7-T2 values
 *          verbatim) on the ARMED arm's five headline rates. A break ⇒ STOP.
 *   X-FP-PROD · X-OFF-IDENT · X-DET · seed disjointness · arm-ledger
 *   unexplained 0 · seam-attributable releases 0 · W ∈ [3,11].
 *
 * REPORTED, NEVER GATED: the tempo-census dimensions on BOTH arms (open-play
 * spell mean/median, one-touch share, turnovers per watched minute, pressed at
 * reception and at release, reception-to-release), the realized W distribution,
 * the interruption mix INCLUDING the new INT-MATE cause, and the IN-ENGINE arm
 * ledger (arms / evictions / struck / cancelledMate / both precedence
 * counters). The F-O1b read (does the armed arm move tempo ≥ 20% of the #173.2
 * gap) is the COMMANDER'S at adjudication: the probe prints the arithmetic, it
 * decides nothing.
 *
 * AXIS HONESTY (TEMPO-CENSUS §2, binding): `match.simTime` — PLAYED sim-seconds
 * — denominates every rate on both axes; `perDisplayMinute = perSimSecond ×
 * 2.6667`; `simTick · DT` is used in NO rate and is emitted once per arm as
 * `wallSimSecondsPerMatch`, CONTEXT ONLY.
 *
 * HOW IT OBSERVES (no `src/**` instrumentation for the instrument): a tick-walk
 * that reads `phase` / `ball.owner` / `score` / `team.stats` / player state after
 * each `step(DT)` and writes nothing back, plus wrappers on the two PUBLIC Match
 * methods `armPendingPass` and `performPass` (they call through unchanged, add no
 * rng, write nothing back). The eviction / INT-MATE / precedence counters are read
 * from the ENGINE's own `o1WindupLedger` (#180.3(ii) — the accounting lives in the
 * engine, not in this wrapper).
 *
 * Determinism: no `Date.now()` / `Math.random()` on any result path; wall time is
 * measured OUTSIDE the compared core (#128) and excluded from `resultSha256`.
 *
 * Modes:
 *   O1T2_MODE=smoke            the sizing / wall / plumbing smoke (committed)
 *   O1T2_MODE=full O1T2_N=<N>  the frozen-N run
 */
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { runHeadless } from '../../src/sim/simRunner';
import { CONTEST_RADIUS, DT, TOUCH_CONTROL_DIST } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* frozen configuration (doc §STAGING / §GATES)                               */
/* ========================================================================== */

const MODE = (process.env.O1T2_MODE ?? 'smoke') as 'smoke' | 'full';
/** §SEED LEDGER: the smoke block sits directly above T1's consumed 12,302,000–039. */
const SMOKE_BLOCK = 12_302_040;
const SMOKE_N = 24;
/** §SEED LEDGER: the full-run block, disjoint from every consumed block. */
const FULL_BLOCK = 12_303_000;
const FULL_N_CAP = 1000; // the doc's §SIZING hard cap (block 12,303,000–12,303,999)
const RESERVED_BAND: [number, number] = [12_300_000, 12_309_999];
const CONSUMED: { name: string; range: [number, number] }[] = [
  { name: 'O1 phase-0 census', range: [12_300_000, 12_301_999] },
  { name: 'O1-T1 armed smoke', range: [12_302_000, 12_302_039] },
  { name: 'O1 phase-0 sizing smoke', range: [12_309_900, 12_309_923] },
];
const N = MODE === 'smoke' ? SMOKE_N
  : Math.max(1, Math.min(FULL_N_CAP, Number.parseInt(process.env.O1T2_N ?? '600', 10)));
const BLOCK = MODE === 'smoke' ? SMOKE_BLOCK : FULL_BLOCK;
const OUT_PATH = MODE === 'smoke'
  ? 'docs/world-model/data/o1-t2-sizing-smoke.json'
  : 'docs/world-model/data/o1-t2-match-ab.json';

/** #163 stats-stream disjointness: 102,600 was O1 phase-0's base ⇒ +200 floor. */
const BOOTSTRAP_SEED = 102_800;
const BOOTSTRAP_RESAMPLES = 2000;
const PUBLISHED_STATS_BASES = [102_000, 102_200, 102_400, 102_600];

/** TEMPO-CENSUS §3.6: the substrate's OWN pressure switch (constants.ts). */
const PRESSURE_R = TOUCH_CONTROL_DIST; // 4.2 m
const PRESSURE_R_SENS = CONTEST_RADIUS; // 3.0 m, sensitivity only
/** TEMPO-CENSUS §3.7: the engine's own 一脚出球 window (Match.ts:1725). */
const FIRST_TOUCH_S = 0.28;
/** TEMPO-CENSUS §2: 1 display-minute = 2.6667 played sim-seconds (240 s ⇔ 90′). */
const SIM_SEC_PER_DISPLAY_MIN = 240 / 90;

/* §2 EQUILIBRIUM BAND — C1 §4 baselines + tolerances, the C7-T2 §4.2 values
 * VERBATIM (inherited whole; nothing invented, nothing tightened). */
const BAND_BASELINE = {
  goals: 2.3944, crosses: 2.4894, headers: 9.1039, longBalls: 6.2042, cutbacks: 3.8151,
} as const;
const BAND_TOLERANCE = {
  goals: 0.15, crosses: 0.25, headers: 0.25, longBalls: 0.25, cutbacks: 0.25,
} as const;

/* #173.2 gap-table reference points (the arc's FROZEN baseline) — the F-O1b
 * arithmetic's reference lines. REPORTED, never gated. */
const GAP_SPELL_MEAN_PROD = 4.39; // s, prod arm
const GAP_SPELL_MEAN_REF_LO = 9.6; // s, Opta open-play sequence mean (2025-26)
const GAP_TURNOVERS_WATCHED_PROD = 8.6; // per watched (sim) minute, prod arm
const GAP_TURNOVERS_WATCHED_REF_HI = 4.5; // real football 3.0–4.5 / min
const F_O1B_FRACTION = 0.20; // "≥ 20% of the #173.2 gap" (contract §5 F-O1b)

/* O1-T1 §RESULT cross-check reference points (REPORTED, never gated). */
const T1_W_P50_TICKS = 6;
const T1_W_MEAN_TICKS = 6.343;
const T1_INT_RATE = 0.02797;
const T1_ARM_SHARE_ELIGIBLE = 0.7614;

const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;
const SKIP_FP = process.argv.includes('--skip-fp');
const RECEIPT_CAP = 1000;

/* ========================================================================== */
/* helpers                                                                    */
/* ========================================================================== */

const sha = (v: unknown): string => createHash('sha256').update(String(v)).digest('hex');
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
const round = (v: number, d = 6): number => {
  if (!Number.isFinite(v)) return Number.NaN;
  const m = 10 ** d;
  return Math.round(v * m) / m;
};
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN
  : xs.reduce((s, x) => s + x, 0) / xs.length);
const quantile = (xs: readonly number[], q: number): number => {
  if (xs.length === 0) return Number.NaN;
  const s = [...xs].sort((a, b) => a - b);
  const i = (s.length - 1) * q;
  const lo = Math.floor(i); const hi = Math.ceil(i);
  return lo === hi ? s[lo] : s[lo] + (s[hi] - s[lo]) * (i - lo);
};
const shareOf = (num: number, den: number): number => round(den === 0 ? Number.NaN : num / den, 6);

const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** ARMED / OFF differ in the ONE flag; `shipped` omits it entirely (X-OFF-IDENT). */
const matchOf = (seed: number, arm: 'OFF' | 'ARMED' | 'SHIPPED'): Match => new Match({
  seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
  ...(arm === 'SHIPPED' ? {} : { o1PassWindup: arm === 'ARMED' }),
});

/** the match signature (the C7-T2 / P2-B form, verbatim) — the flag-off pin. */
const signatureOf = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

const nearestOpponent = (m: Match, p: Player): number => {
  let best = Number.POSITIVE_INFINITY;
  for (const o of m.teams[(1 - p.side) as Side].players) {
    if (o.sentOff) continue;
    const d = Math.hypot(o.pos.x - p.pos.x, o.pos.y - p.pos.y);
    if (d < best) best = d;
  }
  return best;
};

/* ========================================================================== */
/* the per-match instrument                                                   */
/* ========================================================================== */

/** TEMPO-CENSUS §3.1: a maximal same-team control interval (the Opta shape). */
interface Spell {
  team: Side; startTick: number; endTick: number; ownedTicks: number;
  touches: number; origin: 'openPlay' | 'restart' | 'kickoff';
  terminator: 'opponentControl' | 'goal' | 'outOfPlay' | 'matchEnd';
  firstTouchIdx: number; lastTouchIdx: number;
}
/** TEMPO-CENSUS §3.3: one ownership episode (a TOUCH). */
interface Touch {
  gid: number; side: Side; spellIdx: number; startTick: number; endTick: number;
  nearestOpp: number; isFirstOfSpell: boolean;
  outcome: 'retainedSelf' | 'releasedToTeammate' | 'lost' | 'deadBall' | 'matchEnd';
}
/** Terminal classes for an ARM — every arm maps to exactly one (unexplained = 0). */
type ArmClass =
  | 'STRUCK'
  | 'INT-PHASE' | 'INT-LOSS' | 'INT-STUN' | 'INT-SENTOFF' | 'INT-COOLDOWN'
  | 'INT-MATE'        // #180.3(i): the arm-time mate left the pitch / is not him
  | 'E-ENDED' | 'EVICTED' | 'UNEXPLAINED';
const ARM_CLASSES: ArmClass[] = [
  'STRUCK', 'INT-PHASE', 'INT-LOSS', 'INT-STUN', 'INT-SENTOFF', 'INT-COOLDOWN',
  'INT-MATE', 'E-ENDED', 'EVICTED', 'UNEXPLAINED',
];
const INT_CLASSES: ArmClass[] = [
  'INT-LOSS', 'INT-PHASE', 'INT-STUN', 'INT-SENTOFF', 'INT-COOLDOWN', 'INT-MATE',
];

interface MatchRow {
  seed: number; arm: 'OFF' | 'ARMED';
  steps: number; simSeconds: number; wallSimSeconds: number;
  signature: string;
  /* equilibrium (both teams summed) */
  goals: number; shots: number; shotsOnTarget: number; crosses: number;
  headersWon: number; longBalls: number; cutbacks: number;
  passes: number; passesCompleted: number; fouls: number;
  looseCount: number;
  /* tempo */
  openSpells: number; spellLens: number[]; spellOwnedLens: number[];
  oneTouchStrict: number; oneTouchBare: number; turnovers: number;
  firstRecvOpen: number; firstRecvOpenPressed: number; firstRecvOpenPressedSens: number;
  holds: number[];
  /* the cut-1 release population (shortPass, both arms) */
  spReleases: number; spReleasesPressed: number;
  /* the seam (ARMED only) */
  wTicks: number[]; armClasses: Record<ArmClass, number>;
  ledger: {
    arms: number; evictions: number; struck: number; cancelledMate: number;
    cancelledPendingKick: number; cancelledByPendingKick: number;
  };
  seamAttributableReleases: number;
  receipts: { seed: number; tick: number; gid: number; cls: ArmClass }[];
}

const runMatch = (seed: number, arm: 'OFF' | 'ARMED'): MatchRow => {
  const m = matchOf(seed, arm);

  const spells: Spell[] = [];
  const touches: Touch[] = [];
  const wTicks: number[] = [];
  const armClasses = Object.fromEntries(ARM_CLASSES.map((c) => [c, 0])) as Record<ArmClass, number>;
  const receipts: MatchRow['receipts'] = [];
  let spReleases = 0; let spReleasesPressed = 0;
  let looseCount = 0;
  let seamAttributableReleases = 0;

  const close = (cls: ArmClass, tick: number, gid: number): void => {
    armClasses[cls]++;
    if (receipts.length < 40) receipts.push({ seed, tick, gid, cls });
  };

  /* ---- wrappers: arm + release events (call through unchanged) ---- */
  type Active = { gid: number; targetGid: number; targetRosterIdx: number; readyTick: number };
  const slot: { cur: Active | null } = { cur: null };
  let releasedThisTick = new Set<number>();

  const origArm = m.armPendingPass.bind(m);
  m.armPendingPass = (p: Player, mate: Player, offsideExempt?: boolean): void => {
    // the single slot: a live arm being overwritten is an eviction (the ENGINE
    // counts it too — #180.3(ii); this probe-side class keeps the ledger closed)
    if (slot.cur !== null) close('EVICTED', m.simTick, slot.cur.gid);
    origArm(p, mate, offsideExempt);
    const pp = m.pendingPassWindup!;
    wTicks.push(pp.readyTick - m.simTick);
    slot.cur = {
      gid: pp.gid, targetGid: pp.targetGid, targetRosterIdx: pp.targetRosterIdx,
      readyTick: pp.readyTick,
    };
  };
  const origPass = m.performPass.bind(m);
  m.performPass = (p: Player, mate: Player, offsideExempt?: boolean, powerChoice?: number): void => {
    spReleases++;
    if (nearestOpponent(m, p) <= PRESSURE_R) spReleasesPressed++;
    releasedThisTick.add(p.gid);
    origPass(p, mate, offsideExempt, powerChoice);
  };

  /* ---- the tick walk ---- */
  let cur: Spell | null = null;
  let curTouch: Touch | null = null;
  let prevOwnerGid: number | null = null;
  let prevOwner: Player | null = null;
  let prevScore: [number, number] = [0, 0];
  let steps = 0;

  const finishSpell = (s: Spell, tick: number, terminator: Spell['terminator']): void => {
    s.endTick = tick; s.terminator = terminator; s.lastTouchIdx = touches.length - 1;
    spells.push(s);
  };

  while (!m.finished) {
    releasedThisTick = new Set<number>();
    /* the state the head-of-tick resolve will read (the T1 pre-step convention) */
    const active = slot.cur;
    const pre = active === null ? null : (() => {
      const passer = m.allPlayers[active.gid];
      const mate = m.allPlayers[active.targetGid];
      return {
        phase: m.phase,
        owns: m.ball.owner === passer,
        stunned: passer !== undefined && passer.stunTimer > 0,
        sentOff: passer !== undefined && passer.sentOff,
        cooled: passer !== undefined && passer.kickCooldown > 0,
        mateGone: mate === undefined || mate.sentOff
          || mate.rosterIdx !== active.targetRosterIdx,
      };
    })();

    m.step(DT);
    steps++;
    const tick = m.simTick;

    /* ---- arm terminal classification ---- */
    if (slot.cur !== null && m.pendingPassWindup === null) {
      const { gid, readyTick } = slot.cur;
      slot.cur = null;
      if (releasedThisTick.has(gid)) close('STRUCK', readyTick, gid);
      else if (pre === null) close('UNEXPLAINED', readyTick, gid);
      else if (pre.phase !== 'playing') close('INT-PHASE', readyTick, gid);
      else if (!pre.owns) close('INT-LOSS', readyTick, gid);
      else if (pre.sentOff) close('INT-SENTOFF', readyTick, gid);
      else if (pre.stunned) close('INT-STUN', readyTick, gid);
      else if (pre.cooled) close('INT-COOLDOWN', readyTick, gid);
      else if (pre.mateGone) close('INT-MATE', readyTick, gid);
      else close('UNEXPLAINED', readyTick, gid);
      /* STRUCTURAL: an interrupted resolve must NEVER free the ball — the seam
       * writes `ball.owner` nowhere, so a release on this tick with no pass
       * struck and the passer still owning pre-step is seam-attributable. */
      if (!releasedThisTick.has(gid) && pre !== null && pre.owns && m.ball.owner === null) {
        const passer = m.allPlayers[gid];
        if (passer !== undefined && pre.phase === 'playing' && m.phase === 'playing') {
          seamAttributableReleases++;
        }
      }
    } else if (slot.cur !== null && m.finished) {
      close('E-ENDED', slot.cur.readyTick, slot.cur.gid);
      slot.cur = null;
    }

    const phase = m.phase;
    const owner = m.ball.owner;
    const ownerGid = owner === null ? null : owner.gid;
    const goalThisTick = m.score[0] !== prevScore[0] || m.score[1] !== prevScore[1];
    prevScore = [m.score[0], m.score[1]];

    /* loose-ball economy: an ownership release into no-owner (both arms) */
    if (prevOwner !== null && owner === null) looseCount++;

    /* close the previous episode on any ownership change */
    if (prevOwnerGid !== null && ownerGid !== prevOwnerGid && curTouch !== null) {
      curTouch.endTick = tick; curTouch = null;
    }

    if (phase !== 'playing') {
      // TEMPO-CENSUS #171.1.i: the episode closes at the SAME boundary as the
      // spell — no dead-ball tick is ever an on-ball tick.
      if (curTouch !== null) { curTouch.endTick = tick; curTouch = null; }
      if (cur !== null) { finishSpell(cur, tick, goalThisTick ? 'goal' : 'outOfPlay'); cur = null; }
      prevOwnerGid = null; prevOwner = owner;
      continue;
    }
    if (owner === null) { prevOwnerGid = null; prevOwner = null; continue; }

    const side = owner.side;
    if (cur !== null && cur.team !== side) { finishSpell(cur, tick, 'opponentControl'); cur = null; }
    if (cur === null) {
      const origin: Spell['origin'] = m.kickoffKickGid === owner.gid ? 'kickoff'
        : m.restartKickGid === owner.gid ? 'restart' : 'openPlay';
      cur = {
        team: side, startTick: tick, endTick: tick, ownedTicks: 0, touches: 0, origin,
        terminator: 'matchEnd', firstTouchIdx: touches.length, lastTouchIdx: -1,
      };
    }
    cur.ownedTicks++;
    if (ownerGid !== prevOwnerGid) {
      const t: Touch = {
        gid: owner.gid, side, spellIdx: spells.length, startTick: tick, endTick: tick,
        nearestOpp: nearestOpponent(m, owner), isFirstOfSpell: cur.touches === 0,
        outcome: 'matchEnd',
      };
      touches.push(t); curTouch = t; cur.touches++;
    }
    prevOwnerGid = ownerGid; prevOwner = owner;
  }
  if (curTouch !== null) curTouch.endTick = m.simTick;
  if (cur !== null) finishSpell(cur, m.simTick, 'matchEnd');
  if (slot.cur !== null) close('E-ENDED', slot.cur.readyTick, slot.cur.gid);

  /* ---- resolve each touch's outcome from what followed it (TEMPO §3.6) ---- */
  for (const s of spells) {
    for (let i = s.firstTouchIdx; i <= s.lastTouchIdx && i < touches.length; i++) {
      const t = touches[i];
      if (i < s.lastTouchIdx) {
        t.outcome = touches[i + 1].gid === t.gid ? 'retainedSelf' : 'releasedToTeammate';
      } else {
        t.outcome = s.terminator === 'opponentControl' ? 'lost'
          : s.terminator === 'matchEnd' ? 'matchEnd' : 'deadBall';
      }
    }
  }

  const open = spells.filter((s) => s.origin === 'openPlay');
  const firstOpen = touches.filter(
    (t) => t.isFirstOfSpell && spells[t.spellIdx]?.origin === 'openPlay');
  const st = m.teams.map((t) => t.stats);
  const sum = (f: (s: (typeof st)[number]) => number): number => f(st[0]) + f(st[1]);

  return {
    seed, arm, steps,
    simSeconds: m.simTime,
    wallSimSeconds: m.simTick * DT,
    signature: signatureOf(m),
    goals: sum((s) => s.goals),
    shots: sum((s) => s.shots),
    shotsOnTarget: sum((s) => s.shotsOnTarget),
    crosses: sum((s) => s.crosses),
    headersWon: sum((s) => s.headersWon),
    longBalls: sum((s) => s.longBalls),
    cutbacks: sum((s) => s.cutbacks),
    passes: sum((s) => s.passes),
    passesCompleted: sum((s) => s.passesCompleted),
    fouls: sum((s) => s.fouls),
    looseCount,
    openSpells: open.length,
    spellLens: open.map((s) => (s.endTick - s.startTick) * DT),
    spellOwnedLens: open.map((s) => s.ownedTicks * DT),
    oneTouchStrict: open.filter((s) => s.touches === 1 && s.terminator === 'opponentControl').length,
    oneTouchBare: open.filter((s) => s.touches === 1).length,
    turnovers: spells.filter((s) => s.terminator === 'opponentControl').length,
    firstRecvOpen: firstOpen.length,
    firstRecvOpenPressed: firstOpen.filter((t) => t.nearestOpp <= PRESSURE_R).length,
    firstRecvOpenPressedSens: firstOpen.filter((t) => t.nearestOpp <= PRESSURE_R_SENS).length,
    holds: touches.map((t) => (t.endTick - t.startTick) * DT),
    spReleases, spReleasesPressed,
    wTicks, armClasses,
    ledger: { ...m.o1WindupLedger },
    seamAttributableReleases,
    receipts,
  };
};

/* ========================================================================== */
/* paired cluster bootstrap (cluster = match seed, #20)                       */
/* ========================================================================== */

interface PairedCI {
  n: number; control: number; treated: number; diff: number;
  lower: number; upper: number; relative: number; resolved: boolean;
}
let ciOffset = 0;
const pairedCI = (treated: readonly number[], control: readonly number[]): PairedCI => {
  const diffs: number[] = []; const ctrl: number[] = []; const trt: number[] = [];
  for (let i = 0; i < treated.length; i++) {
    const d = treated[i] - control[i];
    if (Number.isFinite(d)) { diffs.push(d); ctrl.push(control[i]); trt.push(treated[i]); }
  }
  const rng = new Rng(BOOTSTRAP_SEED + ciOffset++);
  const n = diffs.length;
  const draws: number[] = [];
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    let s = 0;
    for (let i = 0; i < n; i++) s += diffs[rng.int(0, n - 1)];
    draws.push(s / (n || 1));
  }
  draws.sort((a, b) => a - b);
  const at = (q: number): number =>
    draws[Math.min(draws.length - 1, Math.max(0, Math.floor(q * (draws.length - 1))))];
  const base = mean(ctrl); const point = mean(diffs);
  const lower = at(0.025); const upper = at(0.975);
  return {
    n, control: round(base), treated: round(mean(trt)), diff: round(point),
    lower: round(lower), upper: round(upper),
    relative: round(point / (Math.abs(base) || Number.NaN)),
    resolved: Number.isFinite(lower) && Number.isFinite(upper) && (lower > 0 || upper < 0),
  };
};

/* ========================================================================== */
/* per-arm level summary                                                      */
/* ========================================================================== */

const bothAxes = (perMatch: number, simSecondsPerMatch: number) => {
  const perSimSecond = perMatch / simSecondsPerMatch;
  return {
    perMatch: round(perMatch),
    perSimSecond: round(perSimSecond),
    perWatchedMinute: round(perSimSecond * 60), // the played (sim) minute — #173.2's axis
    // TEMPO-CENSUS §2's frozen law: 1 display-minute = 2.6667 played sim-seconds ⇒
    // perDisplayMinute = perSimSecond × 2.6667, off the SAME simTime denominator.
    perDisplayMinute: round(perSimSecond * SIM_SEC_PER_DISPLAY_MIN),
  };
};

const armLevels = (rows: readonly MatchRow[]) => {
  const n = rows.length;
  const simSecPerMatch = mean(rows.map((r) => r.simSeconds));
  const allSpellLens = rows.flatMap((r) => r.spellLens);
  const allHolds = rows.flatMap((r) => r.holds);
  const allW = rows.flatMap((r) => r.wTicks);
  const armClasses = Object.fromEntries(ARM_CLASSES.map((c) => [c, 0])) as Record<ArmClass, number>;
  for (const r of rows) for (const c of ARM_CLASSES) armClasses[c] += r.armClasses[c];
  const ledger = rows.reduce((a, r) => ({
    arms: a.arms + r.ledger.arms, evictions: a.evictions + r.ledger.evictions,
    struck: a.struck + r.ledger.struck, cancelledMate: a.cancelledMate + r.ledger.cancelledMate,
    cancelledPendingKick: a.cancelledPendingKick + r.ledger.cancelledPendingKick,
    cancelledByPendingKick: a.cancelledByPendingKick + r.ledger.cancelledByPendingKick,
  }), {
    arms: 0, evictions: 0, struck: 0, cancelledMate: 0,
    cancelledPendingKick: 0, cancelledByPendingKick: 0,
  });
  const interrupted = INT_CLASSES.reduce((a, c) => a + armClasses[c], 0);
  const resolvedArms = armClasses.STRUCK + interrupted;
  const firstRecv = rows.reduce((a, r) => a + r.firstRecvOpen, 0);
  const firstRecvPressed = rows.reduce((a, r) => a + r.firstRecvOpenPressed, 0);
  const firstRecvPressedSens = rows.reduce((a, r) => a + r.firstRecvOpenPressedSens, 0);
  const spRel = rows.reduce((a, r) => a + r.spReleases, 0);
  const spRelPressed = rows.reduce((a, r) => a + r.spReleasesPressed, 0);

  return {
    matches: n,
    playedSimSecondsPerMatch: round(simSecPerMatch, 4),
    wallSimSecondsPerMatchContextOnly: round(mean(rows.map((r) => r.wallSimSeconds)), 4),
    /* --- equilibrium levels (both teams summed per match) --- */
    equilibrium: {
      goalsPerMatch: round(mean(rows.map((r) => r.goals)), 5),
      shotsPerMatch: round(mean(rows.map((r) => r.shots)), 5),
      shotsOnTargetPerMatch: round(mean(rows.map((r) => r.shotsOnTarget)), 5),
      onTargetRate: shareOf(rows.reduce((a, r) => a + r.shotsOnTarget, 0),
        rows.reduce((a, r) => a + r.shots, 0)),
      conversion: shareOf(rows.reduce((a, r) => a + r.goals, 0),
        rows.reduce((a, r) => a + r.shots, 0)),
      crossesPerMatch: round(mean(rows.map((r) => r.crosses)), 5),
      headersWonPerMatch: round(mean(rows.map((r) => r.headersWon)), 5),
      longBallsPerMatch: round(mean(rows.map((r) => r.longBalls)), 5),
      cutbacksPerMatch: round(mean(rows.map((r) => r.cutbacks)), 5),
      loosePerMatch: round(mean(rows.map((r) => r.looseCount)), 5),
      passesPerMatch: round(mean(rows.map((r) => r.passes)), 5),
      passCompletion: shareOf(rows.reduce((a, r) => a + r.passesCompleted, 0),
        rows.reduce((a, r) => a + r.passes, 0)),
      foulsPerMatch: round(mean(rows.map((r) => r.fouls)), 5),
    },
    /* --- the tempo dimensions (TEMPO-CENSUS definitions, both arms) --- */
    tempo: {
      openPlaySpells: allSpellLens.length,
      openPlaySpellsPerMatch: round(mean(rows.map((r) => r.openSpells)), 4),
      spellSeconds: {
        mean: round(mean(allSpellLens), 4),
        median: round(quantile(allSpellLens, 0.5), 4),
        p25: round(quantile(allSpellLens, 0.25), 4),
        p75: round(quantile(allSpellLens, 0.75), 4),
        p90: round(quantile(allSpellLens, 0.9), 4),
      },
      spellControlledOnlySeconds: {
        mean: round(mean(rows.flatMap((r) => r.spellOwnedLens)), 4),
        median: round(quantile(rows.flatMap((r) => r.spellOwnedLens), 0.5), 4),
      },
      oneTouchShareStrict: shareOf(rows.reduce((a, r) => a + r.oneTouchStrict, 0), allSpellLens.length),
      oneTouchShareBare: shareOf(rows.reduce((a, r) => a + r.oneTouchBare, 0), allSpellLens.length),
      turnovers: bothAxes(mean(rows.map((r) => r.turnovers)), simSecPerMatch),
      pressedAtReceptionOpenPlay: {
        n: firstRecv, share: shareOf(firstRecvPressed, firstRecv),
        shareSens3m: shareOf(firstRecvPressedSens, firstRecv), radius: PRESSURE_R,
      },
      pressedAtReleaseShortPass: {
        n: spRel, share: shareOf(spRelPressed, spRel), radius: PRESSURE_R,
        note: 'nearest non-sent-off opponent to the passer AT the performPass instant '
          + '(the release tick), over ALL shortPass releases — the cut-1 population. '
          + 'The phase-0 census read the same radius on a PRE-STEP snapshot (§P2.6); '
          + 'this is the release instant itself, identically on both arms.',
      },
      receptionToReleaseSeconds: {
        n: allHolds.length,
        mean: round(mean(allHolds), 4),
        median: round(quantile(allHolds, 0.5), 4),
        p75: round(quantile(allHolds, 0.75), 4),
        p90: round(quantile(allHolds, 0.9), 4),
        shareAtOrUnderFirstTouchWindow: shareOf(
          allHolds.filter((h) => h <= FIRST_TOUCH_S).length, allHolds.length),
        firstTouchWindowS: FIRST_TOUCH_S,
      },
    },
    /* --- the seam (all zero on the OFF arm by construction) --- */
    seam: {
      realizedW: {
        n: allW.length,
        p10: round(quantile(allW, 0.1), 4), p50: round(quantile(allW, 0.5), 4),
        p90: round(quantile(allW, 0.9), 4), mean: round(mean(allW), 4),
        min: allW.length === 0 ? Number.NaN : Math.min(...allW),
        max: allW.length === 0 ? Number.NaN : Math.max(...allW),
        seconds: {
          p50: round(quantile(allW, 0.5) * DT, 5), mean: round(mean(allW) * DT, 5),
        },
        histogram: Object.fromEntries(
          Array.from({ length: 9 }, (_, i) => i + 3).map((t) => [t, allW.filter((w) => w === t).length]),
        ),
        withinFrozenClamp: allW.every((w) => Number.isInteger(w) && w >= 3 && w <= 11),
        referenceT1: { p50: T1_W_P50_TICKS, mean: T1_W_MEAN_TICKS },
      },
      interruption: {
        arms: allW.length, resolvedArms, struck: armClasses.STRUCK, interrupted,
        rate: shareOf(interrupted, resolvedArms),
        causeMix: Object.fromEntries(INT_CLASSES.map((c) => [c, armClasses[c]])),
        causeShares: Object.fromEntries(INT_CLASSES.map((c) => [c, shareOf(armClasses[c], interrupted)])),
        excludedReported: { 'E-ENDED': armClasses['E-ENDED'], EVICTED: armClasses.EVICTED },
        referenceT1Rate: T1_INT_RATE,
      },
      armLedgerProbe: { ...armClasses, total: ARM_CLASSES.reduce((a, c) => a + armClasses[c], 0) },
      armLedgerEngine: ledger,
      /* the two ledgers must agree where they overlap (the #180.3(ii) obligation) */
      ledgerAgreement: {
        armsProbeVsEngine: [allW.length, ledger.arms],
        armsAgree: allW.length === ledger.arms,
        struckProbeVsEngine: [armClasses.STRUCK, ledger.struck],
        struckAgree: armClasses.STRUCK === ledger.struck,
        evictionsProbeVsEngine: [armClasses.EVICTED, ledger.evictions],
        evictionsAgree: armClasses.EVICTED === ledger.evictions,
        intMateProbeVsEngine: [armClasses['INT-MATE'], ledger.cancelledMate],
        intMateAgree: armClasses['INT-MATE'] === ledger.cancelledMate,
      },
      unexplained: armClasses.UNEXPLAINED,
      seamAttributableReleases: rows.reduce((a, r) => a + r.seamAttributableReleases, 0),
      armShareOfShortPassReleases: shareOf(allW.length, spRel + allW.length - armClasses.STRUCK),
      referenceT1ArmShareEligible: T1_ARM_SHARE_ELIGIBLE,
    },
  };
};

/* ========================================================================== */
/* the experiment core (X-DET: run twice, compare)                            */
/* ========================================================================== */

const runExperiment = () => {
  ciOffset = 0;
  const seeds = Array.from({ length: N }, (_, k) => BLOCK + k);
  const off: MatchRow[] = []; const armed: MatchRow[] = [];
  const offIdent: { seed: number; ok: boolean }[] = [];
  for (let i = 0; i < seeds.length; i++) {
    const seed = seeds[i];
    const o = runMatch(seed, 'OFF');
    const a = runMatch(seed, 'ARMED');
    off.push(o); armed.push(a);
    /* X-OFF-IDENT: the OFF arm must equal the SHIPPED world (flag ABSENT) */
    const shipped = matchOf(seed, 'SHIPPED');
    while (!shipped.finished) shipped.step(DT);
    offIdent.push({ seed, ok: signatureOf(shipped) === o.signature });
    if ((i + 1) % 4 === 0 || i + 1 === seeds.length) {
      process.stderr.write(`  [o1-t2] ${i + 1}/${seeds.length} paired seeds (seed ${seed})\n`);
    }
  }

  const offL = armLevels(off);
  const armedL = armLevels(armed);

  /* ---- F-O1a: the §2 equilibrium band on the ARMED arm (HARD) ---- */
  const bandRow = (key: keyof typeof BAND_BASELINE, value: number) => {
    const lo = BAND_BASELINE[key] * (1 - BAND_TOLERANCE[key]);
    const hi = BAND_BASELINE[key] * (1 + BAND_TOLERANCE[key]);
    return {
      dimension: key, baseline: BAND_BASELINE[key], tolerance: BAND_TOLERANCE[key],
      band: [round(lo, 5), round(hi, 5)], armed: round(value, 5),
      relativeToBaseline: round((value - BAND_BASELINE[key]) / BAND_BASELINE[key]),
      inside: value >= lo && value <= hi,
    };
  };
  const band = [
    bandRow('goals', armedL.equilibrium.goalsPerMatch),
    bandRow('crosses', armedL.equilibrium.crossesPerMatch),
    bandRow('headers', armedL.equilibrium.headersWonPerMatch),
    bandRow('longBalls', armedL.equilibrium.longBallsPerMatch),
    bandRow('cutbacks', armedL.equilibrium.cutbacksPerMatch),
  ];
  const bandOffArm = [
    bandRow('goals', offL.equilibrium.goalsPerMatch),
    bandRow('crosses', offL.equilibrium.crossesPerMatch),
    bandRow('headers', offL.equilibrium.headersWonPerMatch),
    bandRow('longBalls', offL.equilibrium.longBallsPerMatch),
    bandRow('cutbacks', offL.equilibrium.cutbacksPerMatch),
  ];
  const fO1a = { fired: band.some((b) => !b.inside), rows: band, offArmCrossCheck: bandOffArm };

  /* ---- paired contrasts (ARMED − OFF), cluster = match seed ---- */
  const perMatchRate = (rows: readonly MatchRow[], f: (r: MatchRow) => number): number[] =>
    rows.map(f);
  const paired = {
    goalsPerMatch: pairedCI(perMatchRate(armed, (r) => r.goals), perMatchRate(off, (r) => r.goals)),
    shotsPerMatch: pairedCI(perMatchRate(armed, (r) => r.shots), perMatchRate(off, (r) => r.shots)),
    conversion: pairedCI(
      perMatchRate(armed, (r) => (r.shots === 0 ? Number.NaN : r.goals / r.shots)),
      perMatchRate(off, (r) => (r.shots === 0 ? Number.NaN : r.goals / r.shots))),
    onTargetRate: pairedCI(
      perMatchRate(armed, (r) => (r.shots === 0 ? Number.NaN : r.shotsOnTarget / r.shots)),
      perMatchRate(off, (r) => (r.shots === 0 ? Number.NaN : r.shotsOnTarget / r.shots))),
    loosePerMatch: pairedCI(perMatchRate(armed, (r) => r.looseCount), perMatchRate(off, (r) => r.looseCount)),
    /* the REPORTED tempo contrasts (never gated) */
    spellMeanSeconds: pairedCI(
      perMatchRate(armed, (r) => mean(r.spellLens)), perMatchRate(off, (r) => mean(r.spellLens))),
    spellMedianSeconds: pairedCI(
      perMatchRate(armed, (r) => quantile(r.spellLens, 0.5)),
      perMatchRate(off, (r) => quantile(r.spellLens, 0.5))),
    oneTouchShareStrict: pairedCI(
      perMatchRate(armed, (r) => (r.openSpells === 0 ? Number.NaN : r.oneTouchStrict / r.openSpells)),
      perMatchRate(off, (r) => (r.openSpells === 0 ? Number.NaN : r.oneTouchStrict / r.openSpells))),
    turnoversPerWatchedMinute: pairedCI(
      perMatchRate(armed, (r) => (r.turnovers / r.simSeconds) * 60),
      perMatchRate(off, (r) => (r.turnovers / r.simSeconds) * 60)),
    pressedAtReceptionShare: pairedCI(
      perMatchRate(armed, (r) => (r.firstRecvOpen === 0 ? Number.NaN : r.firstRecvOpenPressed / r.firstRecvOpen)),
      perMatchRate(off, (r) => (r.firstRecvOpen === 0 ? Number.NaN : r.firstRecvOpenPressed / r.firstRecvOpen))),
    pressedAtReleaseShare: pairedCI(
      perMatchRate(armed, (r) => (r.spReleases === 0 ? Number.NaN : r.spReleasesPressed / r.spReleases)),
      perMatchRate(off, (r) => (r.spReleases === 0 ? Number.NaN : r.spReleasesPressed / r.spReleases))),
    receptionToReleaseMeanSeconds: pairedCI(
      perMatchRate(armed, (r) => mean(r.holds)), perMatchRate(off, (r) => mean(r.holds))),
    receptionToReleaseMedianSeconds: pairedCI(
      perMatchRate(armed, (r) => quantile(r.holds, 0.5)),
      perMatchRate(off, (r) => quantile(r.holds, 0.5))),
    passesPerMatch: pairedCI(perMatchRate(armed, (r) => r.passes), perMatchRate(off, (r) => r.passes)),
  };

  /* ---- the F-O1b ARITHMETIC FORM (printed, never decided here) ---- */
  const spellGap = GAP_SPELL_MEAN_REF_LO - offL.tempo.spellSeconds.mean;
  const turnGap = offL.tempo.turnovers.perWatchedMinute - GAP_TURNOVERS_WATCHED_REF_HI;
  const fO1bForm = {
    statedForm: 'the armed arm moves a tempo dimension at least F_O1B_FRACTION of the '
      + 'distance from the OFF arm level to the #173.2 reference edge. COMMANDER\'S READ '
      + 'AT ADJUDICATION — this probe computes the arithmetic and decides NOTHING.',
    fraction: F_O1B_FRACTION,
    referenceGapTable173_2: {
      spellMeanProd: GAP_SPELL_MEAN_PROD, spellMeanReferenceEdge: GAP_SPELL_MEAN_REF_LO,
      turnoversWatchedProd: GAP_TURNOVERS_WATCHED_PROD,
      turnoversWatchedReferenceEdge: GAP_TURNOVERS_WATCHED_REF_HI,
    },
    spellMean: {
      offArm: offL.tempo.spellSeconds.mean, armedArm: armedL.tempo.spellSeconds.mean,
      gapToReference: round(spellGap, 4),
      twentyPercentThreshold: round(offL.tempo.spellSeconds.mean + F_O1B_FRACTION * spellGap, 4),
      observedDelta: paired.spellMeanSeconds.diff,
      fractionOfGapMoved: round(paired.spellMeanSeconds.diff / (spellGap || Number.NaN), 4),
    },
    turnoversPerWatchedMinute: {
      offArm: offL.tempo.turnovers.perWatchedMinute,
      armedArm: armedL.tempo.turnovers.perWatchedMinute,
      gapToReference: round(turnGap, 4),
      twentyPercentThreshold: round(
        offL.tempo.turnovers.perWatchedMinute - F_O1B_FRACTION * turnGap, 4),
      observedDelta: paired.turnoversPerWatchedMinute.diff,
      fractionOfGapMoved: round(-paired.turnoversPerWatchedMinute.diff / (turnGap || Number.NaN), 4),
    },
  };

  /* ---- sizing arithmetic (the C7-T2 / P3′ idiom) ---- */
  const spellSds = (() => {
    const d = armed.map((r, i) => mean(r.spellLens) - mean(off[i].spellLens))
      .filter(Number.isFinite);
    const mu = mean(d);
    return Math.sqrt(d.reduce((s, x) => s + (x - mu) ** 2, 0) / Math.max(1, d.length - 1));
  })();
  const goalsSd = (() => {
    const d = armed.map((r, i) => r.goals - off[i].goals);
    const mu = mean(d);
    return Math.sqrt(d.reduce((s, x) => s + (x - mu) ** 2, 0) / Math.max(1, d.length - 1));
  })();

  return {
    mode: MODE, matches: N, block: BLOCK,
    seeds: { first: seeds[0], last: seeds[seeds.length - 1] },
    arms: { OFF: offL, ARMED: armedL },
    gates: {
      fO1a,
      xOffIdent: {
        pass: offIdent.every((x) => x.ok), checked: offIdent.length,
        mismatches: offIdent.filter((x) => !x.ok).map((x) => x.seed),
      },
      unexplainedArms: armedL.seam.unexplained + offL.seam.unexplained,
      seamAttributableReleases: armedL.seam.seamAttributableReleases,
      wWithinFrozenClamp: armedL.seam.realizedW.withinFrozenClamp,
      offArmSeamDead: offL.seam.realizedW.n === 0 && offL.seam.armLedgerEngine.arms === 0,
      ledgerAgreement: armedL.seam.ledgerAgreement,
    },
    paired,
    fO1bForm,
    sizing: {
      pairedGoalsDeltaSd: round(goalsSd, 5),
      pairedSpellMeanDeltaSd: round(spellSds, 5),
      note: 'per-match paired-delta SDs, measured on this smoke; N* arithmetic in the '
        + 'stage doc §SIZING uses these (MDE ≈ 2.8·SD/√N).',
    },
    receipts: armed.flatMap((r) => r.receipts).slice(0, RECEIPT_CAP),
    perSeed: armed.map((r, i) => ({
      seed: r.seed,
      offGoals: off[i].goals, armedGoals: r.goals,
      offSpellMean: round(mean(off[i].spellLens), 4), armedSpellMean: round(mean(r.spellLens), 4),
      arms: r.ledger.arms, struck: r.ledger.struck,
      offSimSeconds: round(off[i].simSeconds, 4), armedSimSeconds: round(r.simSeconds, 4),
    })),
  };
};

/* ========================================================================== */
/* main                                                                       */
/* ========================================================================== */

process.stderr.write(`=== O1 T2 MATCH A/B (${MODE}) — ${N} paired seeds, block ${BLOCK} ===\n`);
const wall0 = Date.now(); // OUTSIDE the compared core; excluded from resultSha256
const runA = runExperiment();
const digestA = sha(canonical(runA));
process.stderr.write(`  [o1-t2] run A digest ${digestA}\n  [o1-t2] X-DET second run...\n`);
const runB = runExperiment();
const digestB = sha(canonical(runB));
const xDet = digestA === digestB;
process.stderr.write(`  [o1-t2] run B digest ${digestB} — X-DET ${xDet ? 'PASS' : 'FAIL'}\n`);

let fingerprint = 'skipped'; let xFpProd = false;
if (SKIP_FP) { fingerprint = 'skipped (--skip-fp)'; } else {
  const fpLeague = new League({ seed: FINGERPRINT_SEED });
  const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: fpLeague.generation + FINGERPRINT_SEASONS,
  });
  fingerprint = createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex');
  xFpProd = fingerprint === FINGERPRINT_BASELINE;
}
const wallMs = Date.now() - wall0;

let head = '';
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }
let srcDiff = '';
try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }

const seedDisjoint = (() => {
  const first = BLOCK; const last = BLOCK + N - 1;
  const inBand = first >= RESERVED_BAND[0] && last <= RESERVED_BAND[1];
  const clashes = CONSUMED.filter((c) => !(last < c.range[0] || first > c.range[1]));
  const other = MODE === 'smoke'
    ? { name: 'O1-T2 full-run block', range: [FULL_BLOCK, FULL_BLOCK + FULL_N_CAP - 1] as [number, number] }
    : { name: 'O1-T2 sizing smoke', range: [SMOKE_BLOCK, SMOKE_BLOCK + SMOKE_N - 1] as [number, number] };
  const otherClash = !(last < other.range[0] || first > other.range[1]);
  return {
    first, last, inReservedBand: inBand, reservedBand: RESERVED_BAND,
    consumedBlocks: CONSUMED, collisions: clashes.map((c) => c.name),
    siblingBlock: other, disjointFromSibling: !otherClash,
    pass: inBand && clashes.length === 0 && !otherClash,
  };
})();
const statsDisjoint = {
  base: BOOTSTRAP_SEED, published: PUBLISHED_STATS_BASES,
  minGap: Math.min(...PUBLISHED_STATS_BASES.map((b) => Math.abs(BOOTSTRAP_SEED - b))),
  pass: Math.min(...PUBLISHED_STATS_BASES.map((b) => Math.abs(BOOTSTRAP_SEED - b))) >= 200,
};

const g = runA.gates;
const gatesPass = xDet && (SKIP_FP || xFpProd) && g.xOffIdent.pass && seedDisjoint.pass
  && statsDisjoint.pass && g.unexplainedArms === 0 && g.seamAttributableReleases === 0
  && g.wWithinFrozenClamp && g.offArmSeamDead && !g.fO1a.fired
  && g.ledgerAgreement.armsAgree && g.ledgerAgreement.struckAgree
  && g.ledgerAgreement.evictionsAgree && g.ledgerAgreement.intMateAgree;

const body = {
  stage: `O1 T2 — the armed shortPass wind-up A/B (${MODE})`,
  ruling: '#180.4 (the A/B) + #180.3 (the three seam debts, fixed in the same commit)',
  contract: 'docs/world-model/OUTLET-CONTRACT.md',
  doc: 'docs/world-model/O1-T2-MATCH-AB.md',
  head,
  gates: {
    xDet: { pass: xDet, digestA, digestB },
    xFpProd: { pass: xFpProd, baseline: FINGERPRINT_BASELINE, observed: fingerprint, skipped: SKIP_FP },
    xOffIdent: g.xOffIdent,
    seedDisjoint,
    statsStreamDisjoint: statsDisjoint,
    fO1a: g.fO1a,
    unexplainedArms: g.unexplainedArms,
    seamAttributableReleases: g.seamAttributableReleases,
    wWithinFrozenClamp: g.wWithinFrozenClamp,
    offArmSeamDead: g.offArmSeamDead,
    ledgerAgreement: g.ledgerAgreement,
    allPass: gatesPass,
    srcDiffStatContextOnly: srcDiff,
  },
  result: runA,
};
const resultSha256 = createHash('sha256').update(canonical(body)).digest('hex');
writeFileSync(OUT_PATH, `${JSON.stringify({ ...body, resultSha256, wallMsContextOnly: wallMs }, null, 2)}\n`);

/* ---- the printed report ---- */
const o = (s: string): void => { process.stdout.write(`${s}\n`); };
const A = runA.arms.ARMED; const O = runA.arms.OFF;
o('');
o(`=== O1 T2 MATCH A/B (${MODE}) — HEAD ${head} — ${N} paired seeds, block ${BLOCK} ===`);
o(`X-DET ${xDet ? 'PASS' : 'FAIL'} · X-FP-PROD ${SKIP_FP ? 'skipped' : (xFpProd ? 'PASS' : 'FAIL')}`
  + ` · X-OFF-IDENT ${g.xOffIdent.pass ? 'PASS' : 'FAIL'} (${g.xOffIdent.checked} seeds)`
  + ` · seeds ${seedDisjoint.pass ? 'PASS' : 'FAIL'} · stats base ${statsDisjoint.pass ? 'PASS' : 'FAIL'}`);
o(`unexplained ${g.unexplainedArms} · seam-attributable releases ${g.seamAttributableReleases}`
  + ` · W clamp ${g.wWithinFrozenClamp ? 'PASS' : 'FAIL'} · OFF seam dead ${g.offArmSeamDead ? 'PASS' : 'FAIL'}`);
o(`F-O1a (equilibrium band on ARMED) ${g.fO1a.fired ? '*** FIRED — STOP ***' : 'quiet'}`);
for (const r of g.fO1a.rows) {
  o(`  ${r.dimension.padEnd(10)} armed ${String(r.armed).padStart(9)} band [${r.band[0]}, ${r.band[1]}]`
    + ` rel ${r.relativeToBaseline} ${r.inside ? 'inside' : 'OUTSIDE'}`);
}
o('');
o('-- EQUILIBRIUM (paired ARMED − OFF) --');
for (const [k, v] of Object.entries(runA.paired).slice(0, 5)) {
  o(`  ${k.padEnd(30)} OFF ${String(v.control).padStart(10)} ARMED ${String(v.treated).padStart(10)}`
    + ` Δ ${String(v.diff).padStart(10)} CI [${v.lower}, ${v.upper}] rel ${v.relative} ${v.resolved ? 'RESOLVED' : 'null'}`);
}
o('');
o('-- TEMPO (REPORTED on both arms; never gated) --');
o(`  spell mean s        OFF ${O.tempo.spellSeconds.mean} · ARMED ${A.tempo.spellSeconds.mean}`);
o(`  spell median s      OFF ${O.tempo.spellSeconds.median} · ARMED ${A.tempo.spellSeconds.median}`);
o(`  one-touch (strict)  OFF ${O.tempo.oneTouchShareStrict} · ARMED ${A.tempo.oneTouchShareStrict}`);
o(`  turnovers /watched  OFF ${O.tempo.turnovers.perWatchedMinute} · ARMED ${A.tempo.turnovers.perWatchedMinute}`
  + `  (display-min OFF ${O.tempo.turnovers.perDisplayMinute} · ARMED ${A.tempo.turnovers.perDisplayMinute})`);
o(`  pressed @reception  OFF ${O.tempo.pressedAtReceptionOpenPlay.share} · ARMED ${A.tempo.pressedAtReceptionOpenPlay.share}`);
o(`  pressed @release    OFF ${O.tempo.pressedAtReleaseShortPass.share} · ARMED ${A.tempo.pressedAtReleaseShortPass.share}`);
o(`  recv→release s      OFF mean ${O.tempo.receptionToReleaseSeconds.mean} med ${O.tempo.receptionToReleaseSeconds.median}`
  + ` · ARMED mean ${A.tempo.receptionToReleaseSeconds.mean} med ${A.tempo.receptionToReleaseSeconds.median}`);
o('');
o('-- THE SEAM (ARMED arm) --');
o(`  arms ${A.seam.realizedW.n} · W p10 ${A.seam.realizedW.p10} p50 ${A.seam.realizedW.p50} p90 ${A.seam.realizedW.p90}`
  + ` mean ${A.seam.realizedW.mean} (${A.seam.realizedW.seconds.mean} s)`);
o(`  interruption rate ${A.seam.interruption.rate} · mix ${JSON.stringify(A.seam.interruption.causeMix)}`);
o(`  engine ledger ${JSON.stringify(A.seam.armLedgerEngine)}`);
o(`  probe ledger  ${JSON.stringify(A.seam.armLedgerProbe)}`);
o('');
o('-- F-O1b ARITHMETIC (the COMMANDER\'s read at adjudication) --');
o(`  spell mean: OFF ${runA.fO1bForm.spellMean.offArm} → 20% threshold ${runA.fO1bForm.spellMean.twentyPercentThreshold}`
  + ` · ARMED ${runA.fO1bForm.spellMean.armedArm} (moved ${runA.fO1bForm.spellMean.fractionOfGapMoved} of the gap)`);
o(`  turnovers/watched-min: OFF ${runA.fO1bForm.turnoversPerWatchedMinute.offArm} → 20% threshold `
  + `${runA.fO1bForm.turnoversPerWatchedMinute.twentyPercentThreshold} · ARMED `
  + `${runA.fO1bForm.turnoversPerWatchedMinute.armedArm} (moved ${runA.fO1bForm.turnoversPerWatchedMinute.fractionOfGapMoved})`);
o('');
o(`-- SIZING -- paired goals Δ SD ${runA.sizing.pairedGoalsDeltaSd} · paired spell-mean Δ SD ${runA.sizing.pairedSpellMeanDeltaSd}`);
o(`gates ${gatesPass ? 'PASS' : 'FAIL'} · resultSha256 ${resultSha256}`);
o(`output ${OUT_PATH}`);
o(`wall ${round(wallMs / 1000, 1)} s (CONTEXT ONLY — USED IN NO RATE) · per paired seed `
  + `${round(wallMs / N, 1)} ms`);
