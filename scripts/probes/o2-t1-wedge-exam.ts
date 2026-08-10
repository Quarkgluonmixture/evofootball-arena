// O2 T1 — THE WEDGE EXAM: the #186 sizing form re-run with the LOOK FORCED.
//
// Doc:      docs/world-model/O2-T1-WEDGE-EXAM.md   (§FORM / §SEEDS / §GATES frozen before sight)
// Contract: docs/world-model/O2-LOOK-CONTRACT.md §3 O2-T1
// Rulings:  #219.2 (this dispatch) · #186/#185.2 (the instrument, inherited VERBATIM) ·
//           #193.2/#194 (the o2Look seam + its HONESTY LIMITS + the abort-mix quirk) ·
//           #181.2 (every HARD gate's evidence computed in-probe and committed) ·
//           #197-M1/#198 (hashed body vs UNHASHED envelope) · #163 (seed/stats disjointness) ·
//           #20 (cluster = match seed) · #128 (wall outside the compared core) ·
//           #207 (per-seed checkpoint/resume) · #203 (PER-ARM ROWS, never verdict lines).
//
// ⭐ THE FORM IS #186's, NOT A NEW INSTRUMENT. Every eligibility test, exclusion, constant
// and metric column is lifted VERBATIM from `scripts/probes/o2-whether-sizing-rerun.ts`
// (itself #65's). The verbatim-ness is PROVED, not asserted — gate G-REPRO-186 re-walks two
// committed blocks with THIS probe's walker and reproduces their committed numbers exactly.
//
// TWO ARMS on the SAME seeds (paired on the match seed):
//   CONTROL = the #186 `o1armed` arm verbatim (CENSUS_FLAGS + o1PassWindup)
//   LOOK    = CONTROL + `o2Look: true` + the forcing harness (ONE LOOK PER RECEPTION,
//             the O2-T0 `forcedLook` idiom; CONTINUOUS forcing is forbidden)
//
// ⚠ THIS PROBE EMITS NO VERDICT (#203). It emits per-arm rows, paired deltas and the
// mechanical `resolved` CI flags (#186's own field). F-O2a / F-O2b are the commander's.
//
//   O2T1_MODE=smoke|full   (default smoke: 12 seeds @ 12,422,000)
//   O2T1_RESUME=1          full mode only — restore finished (pass, seed) units (#207 form)
//   O2T1_CHECKPOINT=<path> the /tmp scratch checkpoint (never committed, never read by a gate)
//   O2T1_N=<n> / O2T1_SKIP_FP=1  — OVERRIDES: routed onto the EXIT-SEMANTICS GUARD BLOCK,
//                          turn gate G-CLEAN-INVOCATION RED and exit 1. Such a run
//                          adjudicates nothing.
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { pressureAt } from '../../src/ai/perception';
import { Match, O2_LOOK_TICKS } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';
import { whetherEyeDecision, type RecensusCostTable } from '../../src/ai/whetherEye';

const wall0 = Date.now();
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const sha = (v: string): string => createHash('sha256').update(v).digest('hex');
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
const gitSay = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'git-unavailable'; }
};

/* ========================================================================== */
/* §1 FROZEN PARAMETERS — #186 (= #65) VERBATIM                               */
/* ========================================================================== */
const MATCH_DURATION = 240;
const PER_MATCH_CAP = 80;
const MOMENT_SPACING = 30;
const HORIZON = 240;
const SUPPORT_MIN_M = 6;
const SUPPORT_MAX_M = 30;
const N_HOLD_FLOOR = 446;
const SHARE_FLOOR = 0.0029;
/** The forcing runway: the O2-T0 harness's own 40 ticks (`o2-t0-look-seam.ts:166`). */
const FORCE_RUNWAY_TICKS = 40;

/* --- §2 the seed ledger (stage doc §SEEDS) ---------------------------------- */
const MODE = (process.env.O2T1_MODE ?? 'smoke') === 'full' ? 'full' : 'smoke';
const SMOKE_BASE = 12_422_000;
const SMOKE_N = 12;
/** Where EVERY bounded / overridden / fp-skipped invocation is routed (the census idiom). */
const GUARD_BLOCK: readonly [number, number] = [12_422_050, 12_422_099];
const BATTERY_BASE = 12_422_100;
/** Honest hard cap = the reserved battery block 12,422,100..12,422,899. A SEED-BUDGET cap. */
const N_CAP = 800;
/** #186's own fresh block — the G-REPRO-186 limb (b) receipt. Never fresh data. */
const REPRO186_BASE = 12_310_000;
const REPRO186_N = 12;
/** #65's own block — the G-REPRO-186 limb (a) receipt. Never fresh data. */
const REPRO65_BASE = 8_500_000;
const REPRO65_N = 48;
/** The COMPLETE consumed-block ledger: the goal-genealogy census probe's list (the completest
 *  to date) + the census's OWN consumption + the two repro blocks. */
const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: '#65 whether-seat block (repro receipt)', range: [8_500_000, 8_500_047] },
  { name: 'tempo census', range: [12_293_000, 12_299_999] },
  { name: 'O1 phase-0 census', range: [12_300_000, 12_301_999] },
  { name: 'O1-T1 smoke', range: [12_302_000, 12_302_039] },
  { name: 'O1-T2 sizing smoke', range: [12_302_040, 12_302_063] },
  { name: 'O1-T2 full A/B', range: [12_303_000, 12_303_999] },
  { name: 'O1 phase-0 sizing smoke', range: [12_309_900, 12_309_923] },
  { name: 'O2 opening sizing (#186)', range: [12_310_000, 12_310_199] },
  { name: 'far-side forensic (reserved in full)', range: [12_310_200, 12_310_999] },
  { name: 'O2-T0 receipts + freshness read', range: [12_311_000, 12_311_024] },
  { name: 'PM-T0 receipts + boundary/ASK read', range: [12_311_100, 12_311_124] },
  { name: 'PM-T1 sizing smoke', range: [12_311_200, 12_311_205] },
  { name: 'PM-T1 battery (#199)', range: [12_311_300, 12_311_949] },
  { name: 'MT-T0 receipts + stance census + lockstep', range: [12_312_000, 12_312_025] },
  { name: 'MT-T0 test-file seeds', range: [12_312_900, 12_312_901] },
  { name: 'MT-T1 smoke + exit-check + battery (#204)', range: [12_313_000, 12_313_999] },
  { name: 'MT-T2 reserved band (#208)', range: [12_320_000, 12_419_999] },
  { name: 'MT-LADDER reserved band (#211)', range: [12_420_000, 12_420_999] },
  { name: 'goal-genealogy census band (#214/#217)', range: [12_421_000, 12_421_999] },
];
/** §4.2 the stats stream — a SEPARATE namespace. The census's base was 104,400 ⇒ the next
 *  legal base under the #163 200-floor is 104,600. The ledger below is the census probe's
 *  COMPLETE ≥91,100-regime list + 104,400 (the census's own base). Older pre-regime bases
 *  (90,730 and the 50xxx family) predate the ledger and sit ≥ 13,000 away — they cannot move
 *  the minimum. */
const BOOTSTRAP_SEED = 104_600;
const BOOTSTRAP_RESAMPLES = 2000;
const PUBLISHED_STATS_BASES = [
  91_100, 91_110, 92_110, 93_003, 97_003, 98_003, 99_003, 99_203, 99_403, 99_503, 99_603,
  99_703, 99_803, 99_903,
  100_003, 100_203, 100_303, 100_403, 100_503, 100_603, 100_703, 100_803, 100_903,
  101_003, 101_103, 101_203, 101_303, 101_403, 101_503, 101_513, 101_523, 101_800,
  102_000, 102_200, 102_400, 102_600, 102_800,
  103_000, 103_200, 103_400, 103_600, 103_800,
  104_000, 104_200, 104_400,
];

/* --- §3 the X-family pins --------------------------------------------------- */
const TABLE_PATH = 'docs/world-model/data/c5-recensus.json';
const SIZING186_PATH = 'docs/world-model/data/o2-whether-sizing-rerun.json';
const MATCH_SRC_PATH = 'src/sim/Match.ts';
/** The receipt paths are FIXED by mode (no env override — the canonical-write hole is simply
 *  not opened). An OVERRIDDEN run is not a receipt, so it writes to /tmp and can never
 *  clobber a committed artifact. */
const OUT_PATH = process.env.O2T1_N || process.env.O2T1_SKIP_FP === '1'
  ? '/tmp/o2-t1-guard-run.json'
  : (MODE === 'smoke'
    ? 'docs/world-model/data/o2-t1-wedge-exam-smoke.json'
    : 'docs/world-model/data/o2-t1-wedge-exam.json');
const EXPECTED_TABLE_SHA = '184d1e84b787c312b6da95d7abcb6aee79c386e239a4f1c98e1783bfc0e20b53';
const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;
const EXPECTED_SCAN_FRAME_RING = 16;
/** #186's committed G-REPRO65 target (its own artifact's `gRepro65.published65`). */
const REPRO65_TARGET = {
  qualifying: 3840, eligible: 2835, dHold: 4,
  classes: { 'D-HOLD': 4, 'E-ACTNOW-DECLINED': 816, 'E-ABSTAIN-UNSEEN': 2004, 'E-NOCELL': 11 },
  agreeOverall: 0.502439, ctxPlaced: 820,
} as const;

/* --- §4 the invocation guard (G-CLEAN-INVOCATION) --------------------------- */
const N_ENV = process.env.O2T1_N ? Math.max(1, Number.parseInt(process.env.O2T1_N, 10)) : null;
const SKIP_FP = process.env.O2T1_SKIP_FP === '1';
const OVERRIDDEN = N_ENV !== null || SKIP_FP;

/* ========================================================================== */
/* §5 HELPERS — #186 verbatim                                                 */
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
const distance = (a: { x: number; y: number }, b: { x: number; y: number }): number =>
  Math.hypot(a.x - b.x, a.y - b.y);
const mean = (xs: number[]): number => (xs.length === 0 ? NaN : xs.reduce((a, b) => a + b, 0) / xs.length);
const round = (x: number, dp = 6): number => (Number.isFinite(x) ? Number(x.toFixed(dp)) : NaN);

/* --- the certified table, INJECTED (#65's P2 convention) ------------------- */
const rawTableBytes = readFileSync(TABLE_PATH, 'utf8');
const raw = JSON.parse(rawTableBytes) as Record<string, any>;
if (raw.tableSha !== EXPECTED_TABLE_SHA) {
  throw new Error(`certified table SHA drift: ${String(raw.tableSha)} != ${EXPECTED_TABLE_SHA}`);
}
const params = raw.parameters;
const TABLE: RecensusCostTable = {
  pressureBands: params.pressureBands,
  staleBands: params.staleBands,
  supportCuts: params.supportCuts,
  supportWindowM: params.supportWindowM,
  cells: raw.build.table.cells.map((c: any) => ({
    pressureBand: c.pressureBand, staleBand: c.staleBand, supportBand: c.supportBand,
    costs: c.costs.map((k: any) => ({
      holdTicks: k.holdTicks, point: k.point, lower: k.lower, upper: k.upper, reachesZero: k.reachesZero,
    })),
  })),
};
const HOLDABLE_CELLS = TABLE.cells
  .filter((c) => c.costs.some((k) => k.reachesZero))
  .map((c) => `${c.pressureBand}|${c.staleBand}|${c.supportBand}`)
  .sort();
if (HOLDABLE_CELLS.length !== 1 || HOLDABLE_CELLS[0] !== '0|0|0') {
  throw new Error(`holdable-cell set drift: ${JSON.stringify(HOLDABLE_CELLS)} != ["0|0|0"]`);
}

/** X-RING-PIN: the (iv) instrument's premise is READ OUT OF SOURCE, never believed. */
const ringPinObserved = (() => {
  const m = /const SCAN_FRAME_RING = (\d+);/.exec(readFileSync(MATCH_SRC_PATH, 'utf8'));
  return m === null ? -1 : Number(m[1]);
})();
const SCAN_FRAME_RING = ringPinObserved;

type Band = 0 | 1 | 2;
const pressureBandOf = (v: number): Band =>
  (v < TABLE.pressureBands[0] ? 0 : v < TABLE.pressureBands[1] ? 1 : 2);
const staleBandOf = (v: number): Band =>
  (v < TABLE.staleBands[0] ? 0 : v < TABLE.staleBands[1] ? 1 : 2);
const supportBandOf = (v: number): Band =>
  (v < TABLE.supportCuts.low ? 0 : v >= TABLE.supportCuts.high ? 2 : 1);

/** A0 (untouched): one fork step to read the decided action — #186 verbatim. */
const decidedActionOf = (before: Match, ownerGid: number): string => {
  const fork = cloneSimulationState(before);
  const owner = fork.allPlayers.find((p) => p.gid === ownerGid)!;
  let action = owner.action.type;
  const startTick = fork.simTick;
  for (let t = 0; t < HORIZON; t++) {
    if (fork.finished) break;
    fork.step(DT);
    if (fork.simTick - startTick === 1) { action = owner.action.type; break; }
  }
  return action;
};

/** The TRUE-context cell (census keying) — #186 verbatim. */
const trueCellOf = (match: Match, owner: Player): { key: string; bands: [Band, Band, Band] } => {
  const side = owner.side;
  const pB = pressureBandOf(pressureAt(owner.pos, match.teams[1 - side].players));
  const sB = staleBandOf(match.teams[side].staleTime);
  const support = match.teams[side].players.filter((p) => (
    p.gid !== owner.gid && p.role !== 'GK' && !p.sentOff
    && distance(p.pos, owner.pos) >= SUPPORT_MIN_M && distance(p.pos, owner.pos) <= SUPPORT_MAX_M
  )).length;
  return { key: `${pB}|${sB}|${supportBandOf(support)}`, bands: [pB, sB, supportBandOf(support)] };
};

type DecisionClass = 'D-HOLD' | 'E-ACTNOW-DECLINED' | 'E-ABSTAIN-UNSEEN' | 'E-NOCELL';
const CLASSES: DecisionClass[] = ['D-HOLD', 'E-ACTNOW-DECLINED', 'E-ABSTAIN-UNSEEN', 'E-NOCELL'];

/* ========================================================================== */
/* §6 THE ARMS (stage doc §FORM)                                              */
/* ========================================================================== */
/** The enriched census world (#65 §0.1) — the world the table was priced on. */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;
type ArmName = 'control' | 'look' | 'repro65';
const ARM_FLAGS: Record<ArmName, Record<string, boolean>> = {
  /** the #186 `o1armed` arm, VERBATIM */
  control: { ...CENSUS_FLAGS, o1PassWindup: true },
  /** CONTROL + the ONE flag under exam */
  look: { ...CENSUS_FLAGS, o1PassWindup: true, o2Look: true },
  /** receipts only (G-REPRO-186 limb (a)) — the #186 `baseline` arm; never exam data */
  repro65: { ...CENSUS_FLAGS },
};
const matchOf = (seed: number, arm: ArmName): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
  duration: MATCH_DURATION, ...ARM_FLAGS[arm],
} as ConstructorParameters<typeof Match>[0]);

/* ========================================================================== */
/* §7 THE WALK — #186's loop VERBATIM + the declared new columns only          */
/* ========================================================================== */
interface PerMatch {
  seed: number;
  /* ---- #186 columns, verbatim ---- */
  qualifying: number;
  eligible: number;
  exFirstTouch: number;
  exMustKick: number;
  exShoot: number;
  exClear: number;
  classCounts: Record<DecisionClass, number>;
  dHold: number;
  holdCells: Record<string, number>;
  trueHoldable: number;
  ctxPlaced: number;
  ctxAgreeAll: number;
  ctxAgreeFeature: [number, number, number];
  perceivedCellCounts: Record<string, number>;
  /* ---- (i) the LOOK ledger ---- */
  looks: number;
  lookScans: number;
  lookCompleted: number;
  lookAbortedLoss: number;
  lookAbortedPhase: number;
  lookEndedLive: number;
  liveWindowTicks: number;
  /* ---- (ii) F-O2b exposure instruments ---- */
  ticksWalked: number;
  possessionSpells: number;
  turnovers: number;
  turnoversUnderLiveLook: number;
  abortedLossOwnTeamRecovery: number;
  abortedLossUnresolvedAtWalkEnd: number;
  /* ---- (iv) ring pressure ---- */
  ringReadable: number;
  ringFull: number;
  ringPressure: number;
  ringOccupancySum: number;
  ringOldestAgeSum: number;
  /* ---- (v) the carried remainder of the #218 ruler ---- */
  goalsInWalkedWindow: number;
  reachedFullTime: number;
  retentionTicks: number;
}

const emptyRow = (seed: number): PerMatch => ({
  seed, qualifying: 0, eligible: 0, exFirstTouch: 0, exMustKick: 0, exShoot: 0, exClear: 0,
  classCounts: { 'D-HOLD': 0, 'E-ACTNOW-DECLINED': 0, 'E-ABSTAIN-UNSEEN': 0, 'E-NOCELL': 0 },
  dHold: 0, holdCells: {}, trueHoldable: 0,
  ctxPlaced: 0, ctxAgreeAll: 0, ctxAgreeFeature: [0, 0, 0], perceivedCellCounts: {},
  looks: 0, lookScans: 0, lookCompleted: 0, lookAbortedLoss: 0, lookAbortedPhase: 0,
  lookEndedLive: 0, liveWindowTicks: 0,
  ticksWalked: 0, possessionSpells: 0, turnovers: 0, turnoversUnderLiveLook: 0,
  abortedLossOwnTeamRecovery: 0, abortedLossUnresolvedAtWalkEnd: 0,
  ringReadable: 0, ringFull: 0, ringPressure: 0, ringOccupancySum: 0, ringOldestAgeSum: 0,
  goalsInWalkedWindow: 0, reachedFullTime: 0, retentionTicks: 0,
});

/** (iv) the observer's scan ring, read off the SAME clone the classifier reads. */
const ringRead = (m: Match, gid: number): { occupancy: number; oldestAge: number } | null => {
  const rings = (m as unknown as {
    scanFrames: Map<number, { frames: { tick: number }[]; next: number }>;
  }).scanFrames;
  const ring = rings === undefined ? undefined : rings.get(gid);
  if (ring === undefined) return null;
  const ticks = ring.frames.map((f) => f.tick).filter((t) => t >= 0);
  if (ticks.length === 0) return null;
  return { occupancy: ticks.length, oldestAge: m.simTick - Math.min(...ticks) };
};

/**
 * Walk ONE match. The sampling loop, the exclusions and the classification are #186's
 * verbatim; `force` adds the O2-T0 forcing harness (ONE LOOK PER RECEPTION) and the
 * declared observation columns, none of which write anything back into the match.
 */
const walkSeed = (seed: number, arm: ArmName): PerMatch => {
  const match = matchOf(seed, arm);
  const force = arm === 'look';
  const retentionTicks = Math.round(15 + Math.min(1, Math.max(0, match.edsAwareness)) * 45);
  let sinceLast = MOMENT_SPACING;
  let inMatch = 0;
  let lastOwner = -1;
  let prevOwnerGid: number | null = null;
  let prevSide: number | null = null;
  /**
   * ⭐ THE LOSS-TICK READING (the #215 census lesson; commander-ruled PRE-BATTERY re-spec).
   * `lossTickUnderLook` carries, for the body currently in control, whether a look window of
   * HIS was live at his MOST RECENT CONTROLLED TICK. When the owning side next changes, that
   * reading IS the losing team's last-controlled-tick reading — the loose-ball gap between the
   * loss and the opponent's regain is spanned by construction, not by an adjacency window.
   */
  let lossTickUnderLook = false;
  /** aborted-by-loss windows awaiting the next established control (own-team recovery vs turnover) */
  const pendingAbortLossSides: number[] = [];
  const r = emptyRow(seed);
  r.retentionTicks = retentionTicks;
  while (!match.finished && inMatch < PER_MATCH_CAP) {
    // --- THE FORCING RULE (stage doc §FORM): one look per reception, T0 idiom -----
    const carrier = match.ball.owner;
    if (force && carrier !== null && carrier.gid !== lastOwner && carrier.role !== 'GK') {
      lastOwner = carrier.gid;
      match.forcedLook = { gid: carrier.gid, untilTick: match.simTick + FORCE_RUNWAY_TICKS };
    }
    // --- #186's sampling block, VERBATIM ------------------------------------------
    const owner: Player | null = match.ball.owner;
    const qualifies = match.phase === 'playing' && owner !== null
      && owner.role !== 'GK' && !owner.sentOff
      && owner.decisionTimer <= 0 && sinceLast >= MOMENT_SPACING;
    if (qualifies) {
      r.qualifying += 1;
      const gid = owner!.gid;
      const before = cloneSimulationState(match);
      if (owner!.firstTouchWindow > 0) {
        r.exFirstTouch += 1;
      } else if (match.restartKickGid === gid) {
        r.exMustKick += 1;
      } else {
        const decided = decidedActionOf(before, gid);
        if (decided === 'Shoot') {
          r.exShoot += 1;
        } else if (decided === 'ClearBall') {
          r.exClear += 1;
        } else {
          r.eligible += 1;
          // (iv) ring pressure, read on the clone the classifier is about to read
          const rr = ringRead(before, gid);
          if (rr !== null) {
            r.ringReadable += 1;
            r.ringOccupancySum += rr.occupancy;
            r.ringOldestAgeSum += rr.oldestAge;
            const full = rr.occupancy >= SCAN_FRAME_RING;
            if (full) r.ringFull += 1;
            if (full && rr.oldestAge < retentionTicks) r.ringPressure += 1;
          }
          const cloneOwner = before.allPlayers.find((p) => p.gid === gid)!;
          const decision = whetherEyeDecision(cloneOwner, before, TABLE);
          r.classCounts[decision.cls as DecisionClass] += 1;
          if (decision.cls === 'D-HOLD') {
            r.dHold += 1;
            const cell = decision.cell ?? '?';
            r.holdCells[cell] = (r.holdCells[cell] ?? 0) + 1;
          }
          const truth = trueCellOf(match, owner!);
          if (HOLDABLE_CELLS.includes(truth.key)) r.trueHoldable += 1;
          if (decision.perceived !== null) {
            const pb = [decision.perceived.pressureBand, decision.perceived.staleBand,
              decision.perceived.supportBand];
            const perceivedKey = `${pb[0]}|${pb[1]}|${pb[2]}`;
            r.perceivedCellCounts[perceivedKey] = (r.perceivedCellCounts[perceivedKey] ?? 0) + 1;
            r.ctxPlaced += 1;
            if (perceivedKey === truth.key) r.ctxAgreeAll += 1;
            for (let f = 0; f < 3; f++) if (pb[f] === truth.bands[f]) r.ctxAgreeFeature[f] += 1;
          }
        }
      }
      sinceLast = 0;
      inMatch += 1;
    }
    // --- the tick, and the per-tick observation columns ---------------------------
    const winBefore = match.o2LookWindow;
    const abortedLossBefore = match.o2LookLedger.abortedLoss;
    match.step(DT);
    r.ticksWalked += 1;
    sinceLast += 1;
    const win = match.o2LookWindow;
    if (win !== null) r.liveWindowTicks += 1;
    // the engine closed a window as abortedLoss on THIS step: park the looker's side until the
    // next established control decides whether the spell ended as a team-level turnover.
    if (match.o2LookLedger.abortedLoss > abortedLossBefore && winBefore !== null) {
      const looker = match.allPlayers[winBefore.gid] as Player | undefined;
      if (looker !== undefined) pendingAbortLossSides.push(looker.side);
    }
    const now = match.ball.owner;
    if (now !== null) {
      if (now.gid !== prevOwnerGid) {
        r.possessionSpells += 1;
        if (prevSide !== null && now.side !== prevSide) {
          r.turnovers += 1;
          // ⭐ LOSS-TICK ATTRIBUTION (re-specified before the battery, #215 census lesson): the
          // turnover is look-attributed iff the LOSING team's LAST-CONTROLLED tick of that spell
          // was held by a body with a live look window of his own. No adjacency window is used,
          // so the loose-ball gap cannot zero the column by construction.
          if (lossTickUnderLook) r.turnoversUnderLiveLook += 1;
        }
        if (pendingAbortLossSides.length > 0) {
          for (const side of pendingAbortLossSides) {
            if (side === now.side) r.abortedLossOwnTeamRecovery += 1;
          }
          pendingAbortLossSides.length = 0;
        }
        prevOwnerGid = now.gid;
        prevSide = now.side;
      }
      // this tick the carrier IS in control: refresh his last-controlled-tick look reading
      lossTickUnderLook = win !== null && win.gid === now.gid;
    }
  }
  r.abortedLossUnresolvedAtWalkEnd = pendingAbortLossSides.length;
  const led = match.o2LookLedger;
  r.looks = led.looks;
  r.lookScans = led.scans;
  r.lookCompleted = led.completed;
  r.lookAbortedLoss = led.abortedLoss;
  r.lookAbortedPhase = led.abortedPhase;
  r.lookEndedLive = match.o2LookWindow === null ? 0 : 1;
  r.goalsInWalkedWindow = match.score[0] + match.score[1];
  r.reachedFullTime = match.finished ? 1 : 0;
  return r;
};

/* ========================================================================== */
/* §8 SUMMARIES + the paired cluster bootstrap (the #186 (A3) estimator)       */
/* ========================================================================== */
const RATE_KEYS = [
  'perceivedHoldShare', 'trueContextShare', 'abstainUnseenShare',
  'actNowDeclinedShare', 'noCellShare', 'ctxAgreement',
  'ctxAgreePressure', 'ctxAgreeStale', 'ctxAgreeSupport',
  'turnoverPerSpell', 'turnoversPer1000Ticks', 'ringPressureShare',
] as const;
type RateKey = typeof RATE_KEYS[number];
const rateOf = (rows: readonly PerMatch[], key: RateKey): number => {
  const s = (f: (r: PerMatch) => number): number => rows.reduce((a, r) => a + f(r), 0);
  const elig = Math.max(1, s((r) => r.eligible));
  const placed = Math.max(1, s((r) => r.ctxPlaced));
  switch (key) {
    case 'perceivedHoldShare': return s((r) => r.dHold) / elig;
    case 'trueContextShare': return s((r) => r.trueHoldable) / elig;
    case 'abstainUnseenShare': return s((r) => r.classCounts['E-ABSTAIN-UNSEEN']) / elig;
    case 'actNowDeclinedShare': return s((r) => r.classCounts['E-ACTNOW-DECLINED']) / elig;
    case 'noCellShare': return s((r) => r.classCounts['E-NOCELL']) / elig;
    case 'ctxAgreement': return s((r) => r.ctxAgreeAll) / placed;
    case 'ctxAgreePressure': return s((r) => r.ctxAgreeFeature[0]) / placed;
    case 'ctxAgreeStale': return s((r) => r.ctxAgreeFeature[1]) / placed;
    case 'ctxAgreeSupport': return s((r) => r.ctxAgreeFeature[2]) / placed;
    case 'turnoverPerSpell': return s((r) => r.turnovers) / Math.max(1, s((r) => r.possessionSpells));
    case 'turnoversPer1000Ticks': return (s((r) => r.turnovers) * 1000) / Math.max(1, s((r) => r.ticksWalked));
    case 'ringPressureShare': return s((r) => r.ringPressure) / Math.max(1, s((r) => r.ringReadable));
  }
};
const wedgeOf = (rows: readonly PerMatch[]): number => {
  const p = rateOf(rows, 'perceivedHoldShare');
  return p > 0 ? rateOf(rows, 'trueContextShare') / p : NaN;
};
/**
 * The percentile of an ALREADY-FINITE, ALREADY-SORTED sample.
 *
 * ⚠ The #186 helper filtered the non-finite draws AFTER sorting. `Array.prototype.sort`
 * with a subtraction comparator is order-UNDEFINED once a NaN is present, so on a
 * degenerate arm (the wedge is NaN in every resample with zero holds) the surviving
 * finite values came out unordered and the interval could read lower > upper. The filter
 * now runs BEFORE the sort, and the finite-draw count is published so a degenerate
 * interval is auditable rather than silent. This repairs the ESTIMATOR's arithmetic; it
 * re-cuts no criterion (see the stage doc's recorded deviations).
 */
const pctl = (sortedFinite: number[], q: number): number => {
  if (sortedFinite.length === 0) return NaN;
  const i = Math.min(sortedFinite.length - 1, Math.max(0, Math.floor(q * (sortedFinite.length - 1))));
  return sortedFinite[i];
};

const armSummary = (rows: PerMatch[]) => {
  const s = (f: (r: PerMatch) => number): number => rows.reduce((a, r) => a + f(r), 0);
  const totalElig = s((r) => r.eligible);
  const holdCellAgg: Record<string, number> = {};
  const perceivedMix: Record<string, number> = {};
  for (const r of rows) {
    for (const [k, v] of Object.entries(r.holdCells)) holdCellAgg[k] = (holdCellAgg[k] ?? 0) + v;
    for (const [k, v] of Object.entries(r.perceivedCellCounts)) perceivedMix[k] = (perceivedMix[k] ?? 0) + v;
  }
  const holdsPerMatch = mean(rows.map((r) => r.dHold));
  return {
    matches: rows.length,
    qualifyingTotal: s((r) => r.qualifying),
    eligibleTotal: totalElig,
    eligibleFraction: round(totalElig / Math.max(1, s((r) => r.qualifying))),
    eligiblePerMatch: {
      mean: round(mean(rows.map((r) => r.eligible)), 3),
      min: Math.min(...rows.map((r) => r.eligible)), max: Math.max(...rows.map((r) => r.eligible)),
    },
    exclusions: {
      firstTouch: s((r) => r.exFirstTouch), mustKick: s((r) => r.exMustKick),
      a0Shoot: s((r) => r.exShoot), a0Clear: s((r) => r.exClear),
    },
    decisionClassShares: Object.fromEntries(CLASSES.map((c) => [c, {
      count: s((r) => r.classCounts[c]),
      share: round(s((r) => r.classCounts[c]) / Math.max(1, totalElig)),
    }])),
    chooserHold: {
      total: s((r) => r.dHold),
      rateOfEligible: round(rateOf(rows, 'perceivedHoldShare')),
      perMatchMean: round(holdsPerMatch, 4),
      perMatchMax: Math.max(...rows.map((r) => r.dHold)),
      byCell: holdCellAgg,
    },
    trueContext: {
      holdableCells: HOLDABLE_CELLS,
      total: s((r) => r.trueHoldable),
      shareOfEligible: round(rateOf(rows, 'trueContextShare')),
    },
    wedgeRatio: round(wedgeOf(rows), 4),
    mCtxPerceptionPrice: {
      placed: s((r) => r.ctxPlaced),
      agreeOverall: round(rateOf(rows, 'ctxAgreement')),
      agreePressure: round(rateOf(rows, 'ctxAgreePressure')),
      agreeStale: round(rateOf(rows, 'ctxAgreeStale')),
      agreeSupport: round(rateOf(rows, 'ctxAgreeSupport')),
      perceivedCellMix: perceivedMix,
      honestyLimit2: 'T0 HONESTY LIMIT 2: a look refreshes PRESSURE and SUPPORT toward truth '
        + 'while making STALENESS strictly worse (staleBand reads the team\'s own possession '
        + 'clock, which runs while he stands there — it is not a percept). The overall '
        + 'agreement number cannot be read without this decomposition.',
    },
    devFloor: {
      shareFloorPp: round(SHARE_FLOOR * 100, 4),
      nHoldFloor: N_HOLD_FLOOR,
      shareClearsFloor: rateOf(rows, 'perceivedHoldShare') >= SHARE_FLOOR,
      matchesForNfloor: holdsPerMatch > 0 ? Math.ceil(N_HOLD_FLOOR / holdsPerMatch) : null,
    },
    /* (i) THE LOOK LEDGER — read ONLY with the #194 abort-mix price stated beside it. */
    lookLedger: {
      looks: s((r) => r.looks),
      scans: s((r) => r.lookScans),
      completed: s((r) => r.lookCompleted),
      abortedLoss: s((r) => r.lookAbortedLoss),
      abortedPhase: s((r) => r.lookAbortedPhase),
      endedLive: s((r) => r.lookEndedLive),
      liveWindowTicks: s((r) => r.liveWindowTicks),
      seedsWithLooks: rows.filter((r) => r.looks > 0).length,
      scansEqualLiveTicks: s((r) => r.lookScans) === s((r) => r.liveWindowTicks),
      unexplainedArms: s((r) => r.looks)
        - (s((r) => r.lookCompleted) + s((r) => r.lookAbortedLoss)
          + s((r) => r.lookAbortedPhase) + s((r) => r.lookEndedLive)),
      frozenTicks: O2_LOOK_TICKS,
      abortMixPrice194: '⚠ #194: `stepO2Look`\'s phase bail is largely unreachable (Match.step '
        + 'returns early during kickoff/goalPause/halftime BEFORE stepO2Look), so goal-pause '
        + 'windows close as abortedLoss and abortedPhase reads ≈0 BY CONSTRUCTION. abortedLoss '
        + 'means "not owned at the next head-of-tick" — a SUPERSET of a duel loss, and not a '
        + 'clean exposure-cost estimator on its own. The exposure block below is the '
        + 'independent instrument.',
    },
    /* (ii) F-O2b EXPOSURE — the free-option predicate's components, pre-registered. */
    exposure: {
      ticksWalked: s((r) => r.ticksWalked),
      possessionSpells: s((r) => r.possessionSpells),
      turnovers: s((r) => r.turnovers),
      turnoverPerSpell: round(rateOf(rows, 'turnoverPerSpell')),
      turnoversPer1000Ticks: round(rateOf(rows, 'turnoversPer1000Ticks'), 4),
      turnoversUnderLiveLook: s((r) => r.turnoversUnderLiveLook),
      turnoversUnderLiveLookPredicate: 'LOSS-TICK semantics (commander-ruled PRE-BATTERY '
        + 're-spec, the #215 census lesson): the team-level turnover definition is UNCHANGED '
        + '(the owning side changes); it is look-attributed iff at the LOSING team\'s '
        + 'LAST-CONTROLLED tick of that spell the body in control held a live look window of '
        + 'his own. Derived from this walk\'s own spell tracking, so the loose-ball gap between '
        + 'the loss and the opponent\'s regain is spanned — the earlier adjacency wording read 0 '
        + 'BY CONSTRUCTION and is superseded. 0 in CONTROL by construction (no windows exist).',
      engineAbortedLoss: s((r) => r.lookAbortedLoss),
      abortedLossOwnTeamRecovery: s((r) => r.abortedLossOwnTeamRecovery),
      abortedLossUnresolvedAtWalkEnd: s((r) => r.abortedLossUnresolvedAtWalkEnd),
      companionColumnsNote: 'THE TWO COMPANIONS ARE DATA WITH NO ASSUMED IDENTITY. '
        + '(a) engineAbortedLoss = the engine ledger\'s own abortedLoss ("not owned by the '
        + 'looker at the next head-of-tick" — the #194 superset, priced in the ledger block). '
        + '(b) abortedLossOwnTeamRecovery = of those aborted-by-loss windows, how many were '
        + 'followed by an established control by the LOOKER\'S OWN side (own-team recovery of '
        + 'the loose ball), i.e. the abort did NOT end as a team-level turnover. '
        + 'abortedLossUnresolvedAtWalkEnd counts aborts whose next established control never '
        + 'arrived before the walk stopped, so (b) is auditable against (a). NO claim is made '
        + 'that any of these three columns measures the same thing.',
    },
    /* (iv) RING PRESSURE — REPORTED (T0 HONESTY LIMIT 3). */
    ringPressure: {
      scanFrameRing: SCAN_FRAME_RING,
      retentionTicks: rows.length === 0 ? null : rows[0].retentionTicks,
      momentsReadable: s((r) => r.ringReadable),
      ringFull: s((r) => r.ringFull),
      ringPressureMoments: s((r) => r.ringPressure),
      ringPressureShare: round(rateOf(rows, 'ringPressureShare')),
      meanOccupancy: round(s((r) => r.ringOccupancySum) / Math.max(1, s((r) => r.ringReadable)), 3),
      meanOldestFrameAgeTicks: round(s((r) => r.ringOldestAgeSum) / Math.max(1, s((r) => r.ringReadable)), 3),
    },
    /* (v) what survives of the #218 build-up ruler in a TRUNCATED walk. */
    buildUpCarried: {
      goalsInWalkedWindow: s((r) => r.goalsInWalkedWindow),
      ticksWalked: s((r) => r.ticksWalked),
      matchesReachingFullTime: s((r) => r.reachedFullTime),
      dropped: 'the #218 constructed-goal share and scramble share are NOT measured here: the '
        + 'census origin classifier needs a WHOLE-MATCH walk and this walk truncates at '
        + 'PER_MATCH_CAP (see matchesReachingFullTime). Per-arm goal counts over the sampled '
        + 'window are carried in their place. Stated plainly, not silently capped.',
    },
  };
};

/** The #186 (A3) paired cluster bootstrap, extended to the wedge and the new columns. */
const bootstrap = (ctrl: PerMatch[], look: PerMatch[]) => {
  const n = ctrl.length;
  const rng = new Rng(BOOTSTRAP_SEED);
  const draws: Record<string, { control: number[]; look: number[]; delta: number[] }> = {};
  for (const k of RATE_KEYS) draws[k] = { control: [], look: [], delta: [] };
  draws.wedgeRatio = { control: [], look: [], delta: [] };
  for (let b = 0; b < BOOTSTRAP_RESAMPLES; b++) {
    const idx: number[] = [];
    for (let i = 0; i < n; i++) idx.push(Math.min(n - 1, Math.floor(rng.next() * n)));
    const rc = idx.map((i) => ctrl[i]);
    const rl = idx.map((i) => look[i]);
    for (const k of RATE_KEYS) {
      const vc = rateOf(rc, k); const vl = rateOf(rl, k);
      draws[k].control.push(vc); draws[k].look.push(vl); draws[k].delta.push(vl - vc);
    }
    const wc = wedgeOf(rc); const wl = wedgeOf(rl);
    draws.wedgeRatio.control.push(wc); draws.wedgeRatio.look.push(wl);
    draws.wedgeRatio.delta.push(wl - wc);
  }
  const ci = (xs: number[], dp: number) => {
    const s = xs.filter((v) => Number.isFinite(v)).sort((x, y) => x - y);
    return {
      lower: round(pctl(s, 0.025), dp), upper: round(pctl(s, 0.975), dp),
      finiteDraws: s.length, draws: xs.length,
    };
  };
  const out: Record<string, unknown> = {};
  for (const k of [...RATE_KEYS, 'wedgeRatio']) {
    const dp = k === 'wedgeRatio' ? 4 : 6;
    const pc = k === 'wedgeRatio' ? wedgeOf(ctrl) : rateOf(ctrl, k as RateKey);
    const pl = k === 'wedgeRatio' ? wedgeOf(look) : rateOf(look, k as RateKey);
    const d = ci(draws[k].delta, dp);
    const lookCi = ci(draws[k].look, dp);
    out[k] = {
      control: { point: round(pc, dp), ...ci(draws[k].control, dp) },
      look: { point: round(pl, dp), ...lookCi },
      pairedDelta: { point: round(pl - pc, dp), ...d },
      resolved: Number.isFinite(d.lower) && Number.isFinite(d.upper) && (d.lower > 0 || d.upper < 0),
      ...(k === 'wedgeRatio' ? {
        lookWedgeCiExcludesControlPoint: Number.isFinite(lookCi.lower) && Number.isFinite(lookCi.upper)
          && (lookCi.lower > pc || lookCi.upper < pc),
        note: 'a mechanical CI property, NOT a verdict (#203)',
      } : {}),
    };
  }
  return {
    method: 'per-match (seed-clustered) PAIRED bootstrap, ratio-of-totals estimator, '
      + '2.5/97.5 percentiles; one resampled seed-index set feeds BOTH arms (#20 cluster = seed)',
    statsBase: BOOTSTRAP_SEED, resamples: BOOTSTRAP_RESAMPLES, clusters: n,
    deltaDirection: 'LOOK − CONTROL', rates: out,
  };
};

/* ========================================================================== */
/* §9 THE N RULE — derived in-probe from the COMMITTED #186 artifact          */
/* ========================================================================== */
const Z975 = 1.959963985;
const Z80 = 0.841621234;
/** the committed #186 artifact, READ ONCE — every #186 number in this probe comes from here */
const SIZING186 = existsSync(SIZING186_PATH)
  ? (() => {
    const bytes = readFileSync(SIZING186_PATH);
    return { bytes, j: JSON.parse(bytes.toString('utf8')) as any };
  })()
  : null;
const nRule = (() => {
  if (SIZING186 === null) {
    return { available: false, note: `absent: ${SIZING186_PATH}`, nStar: null as number | null };
  }
  const { bytes, j } = SIZING186;
  const a = j.arms.o1armed;
  const b = j.arms.baseline;
  const m186 = (a.eligibleTotal + b.eligibleTotal) / 2;
  const eligPerSeed = a.eligibleTotal / j.matches;
  const deffOf = (halfWidth: number, pb: number, pa: number): number => {
    const seBoot = halfWidth / Z975;
    const seIid = Math.sqrt((pb * (1 - pb) + pa * (1 - pa)) / m186);
    return (seBoot * seBoot) / (seIid * seIid);
  };
  const half = (c: { lower: number; upper: number }): number => (c.upper - c.lower) / 2;
  const mIid = (p0: number, p1: number): number =>
    ((Z975 + Z80) ** 2 * (p0 * (1 - p0) + p1 * (1 - p1))) / ((p1 - p0) ** 2);

  const p0q1 = a.chooserHold.rateOfEligible as number;
  const trueShare = a.trueContext.shareOfEligible as number;
  const p1q1 = p0q1 + (trueShare - p0q1) / 2; // HALF-CLOSURE of the wedge (frozen ex ante)
  const cq1 = j.contrasts.rates.perceivedHoldShare;
  const deffQ1 = deffOf(half(cq1.pairedDelta), cq1.baseline.point, cq1.o1armed.point);
  const mReqQ1 = deffQ1 * mIid(p0q1, p1q1);
  const nQ1 = Math.ceil(mReqQ1 / eligPerSeed);

  const p0q2 = a.decisionClassShares['E-ABSTAIN-UNSEEN'].share as number;
  const p1q2 = p0q2 - 0.02; // a 2 pp absolute fall (frozen ex ante)
  const cq2 = j.contrasts.rates.abstainUnseenShare;
  const deffQ2 = deffOf(half(cq2.pairedDelta), cq2.baseline.point, cq2.o1armed.point);
  const mReqQ2 = deffQ2 * mIid(p0q2, p1q2);
  const nQ2 = Math.ceil(mReqQ2 / eligPerSeed);

  const nRaw = Math.max(nQ1, nQ2);
  const nStar = Math.min(N_CAP, nRaw);
  return {
    available: true,
    source: SIZING186_PATH,
    sourceSha256: createHash('sha256').update(bytes).digest('hex'),
    sourceResultSha: j.resultSha as string,
    rule: 'm_iid = (z.975+z.80)^2 (p0(1-p0)+p1(1-p1)) / (p1-p0)^2 ; DEFF measured off the #186 '
      + 'paired-delta CI ; m_req = DEFF·m_iid ; N(q) = ceil(m_req / eligiblePerSeed186) ; '
      + 'N = min(cap, max_q N(q))',
    inputs186: {
      eligibleTotalO1Armed: a.eligibleTotal, matches: j.matches, eligiblePerSeed: round(eligPerSeed, 4),
      perceivedHold: p0q1, trueContextShare: trueShare, abstainUnseen: p0q2, m186,
    },
    q1PerceivedHold: {
      p0: p0q1, p1: round(p1q1, 8), effect: 'HALF-CLOSURE of the wedge',
      deff: round(deffQ1, 4), mIid: round(mIid(p0q1, p1q1), 1), mReq: round(mReqQ1, 1), n: nQ1,
    },
    q2AbstainUnseen: {
      p0: p0q2, p1: round(p1q2, 8), effect: '−2 pp absolute',
      deff: round(deffQ2, 4), mIid: round(mIid(p0q2, p1q2), 1), mReq: round(mReqQ2, 1), n: nQ2,
    },
    binding: nQ1 >= nQ2 ? 'q1PerceivedHold' : 'q2AbstainUnseen',
    nRaw, cap: N_CAP, capBinds: nRaw > N_CAP, nStar,
    batteryBlock: `${BATTERY_BASE}..${BATTERY_BASE + nStar - 1}`,
  };
})();

/* ========================================================================== */
/* §10 MODE / SEED ROUTING (the exit-semantics guard block)                    */
/* ========================================================================== */
const RUN_N = MODE === 'smoke' ? (N_ENV ?? SMOKE_N) : (N_ENV ?? (nRule.nStar ?? 0));
const RUN_BASE = OVERRIDDEN ? GUARD_BLOCK[0]
  : (MODE === 'smoke' ? SMOKE_BASE : BATTERY_BASE);
if (MODE === 'full' && RUN_N <= 0) {
  console.error('O2-T1 FATAL — full mode needs the committed #186 artifact for the N rule '
    + `(${SIZING186_PATH}).`);
  process.exit(2);
}

banner('');
banner('=============================================================================');
banner(`O2-T1 WEDGE EXAM (#219.2) · mode ${MODE} · N ${RUN_N} seeds × 2 arms (CONTROL vs LOOK)`);
banner(`seeds ${RUN_BASE}..${RUN_BASE + RUN_N - 1}`);
banner(`arms differ by EXACTLY o2Look; forcing = ONE LOOK PER RECEPTION (${FORCE_RUNWAY_TICKS}-tick runway,`
  + ` ${O2_LOOK_TICKS}-tick window)`);
banner(`N rule ⇒ N* ${String(nRule.nStar)} (cap ${N_CAP}${nRule.available && (nRule as any).capBinds ? ', BINDING' : ''})`);
if (OVERRIDDEN) {
  banner('⚠ OVERRIDE IN FORCE (O2T1_N / O2T1_SKIP_FP) — routed onto the EXIT-SEMANTICS GUARD');
  banner(`  BLOCK ${GUARD_BLOCK[0]}..${GUARD_BLOCK[1]}; G-CLEAN-INVOCATION goes RED and this run`);
  banner('  adjudicates NOTHING.');
}
banner('=============================================================================');

/* ========================================================================== */
/* §11 CHECKPOINT / RESUME — RESILIENCE ONLY, MEASURES NOTHING (#207 form)     */
/* ========================================================================== */
/**
 * The checkpointed unit is EXACTLY the per-(pass, seed) pair of PerMatch rows the
 * uninterrupted loop builds. Nothing pooled is stored: every rate, CI, gate, digest and
 * `resultSha256` is recomputed downstream from the union, by the same code, in the same
 * order — so a RESUMED run is byte-identical to a FRESH one. Guarded on HEAD / probe sha /
 * src-diff sha / mode / frozen-config sha; any mismatch REFUSES. `/tmp` scratch, never
 * committed, never read by a gate. JSON's NaN→null trap is handled with a sentinel plus a
 * payload hash and an encode(decode(encode(x))) === encode(x) round-trip check.
 */
const CKPT_PATH = process.env.O2T1_CHECKPOINT ?? '/tmp/o2-t1-checkpoint.jsonl';
const RESUME = process.env.O2T1_RESUME === '1';
const CHECKPOINTING = MODE === 'full';
const PROBE_SELF_PATH = 'scripts/probes/o2-t1-wedge-exam.ts';
const NONFINITE_TAG = '__nonFinite__';
const encTransport = (v: unknown): unknown => {
  if (typeof v === 'number' && !Number.isFinite(v)) {
    return { [NONFINITE_TAG]: Number.isNaN(v) ? 'NaN' : v > 0 ? 'Infinity' : '-Infinity' };
  }
  if (Array.isArray(v)) return v.map(encTransport);
  if (v !== null && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(o)) out[k] = encTransport(o[k]);
    return out;
  }
  return v;
};
const decTransport = (v: unknown): unknown => {
  if (Array.isArray(v)) return v.map(decTransport);
  if (v !== null && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    const keys = Object.keys(o);
    if (keys.length === 1 && keys[0] === NONFINITE_TAG) {
      const t = o[NONFINITE_TAG];
      return t === 'NaN' ? Number.NaN : t === 'Infinity' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }
    const out: Record<string, unknown> = {};
    for (const k of keys) out[k] = decTransport(o[k]);
    return out;
  }
  return v;
};
interface SeedUnit { seedIdx: number; seed: number; control: PerMatch; look: PerMatch }
const encodeUnit = (u: SeedUnit): string => JSON.stringify(encTransport(u));
const ckptConfigEcho = {
  mode: MODE, runN: RUN_N, runBase: RUN_BASE, armFlags: ARM_FLAGS,
  momentSpacing: MOMENT_SPACING, perMatchCap: PER_MATCH_CAP, horizon: HORIZON,
  duration: MATCH_DURATION, supportWindow: [SUPPORT_MIN_M, SUPPORT_MAX_M],
  forceRunway: FORCE_RUNWAY_TICKS, lookTicks: O2_LOOK_TICKS, ring: SCAN_FRAME_RING,
  tableSha: EXPECTED_TABLE_SHA, holdable: HOLDABLE_CELLS,
  bootstrapSeed: BOOTSTRAP_SEED, resamples: BOOTSTRAP_RESAMPLES,
  repro: [REPRO65_BASE, REPRO65_N, REPRO186_BASE, REPRO186_N],
};
const ckptHeader = {
  kind: 'header' as const,
  version: 1,
  headFull: gitSay('git rev-parse HEAD'),
  probeSha256: existsSync(PROBE_SELF_PATH) ? sha(readFileSync(PROBE_SELF_PATH, 'utf8')) : 'probe-unreadable',
  srcDiffSha256: sha(gitSay('git diff -- src')),
  mode: MODE,
  configSha256: sha(canonical(ckptConfigEcho)),
};
type CkptHeader = typeof ckptHeader;
const restoredUnits = new Map<string, SeedUnit>();
const ckptKey = (pass: number, seedIdx: number): string => `${pass}:${seedIdx}`;
const refuse = (why: string): never => {
  console.error(`O2-T1 FATAL — REFUSING TO RESUME: ${why}`);
  console.error(`  checkpoint: ${CKPT_PATH}`);
  console.error('  Resuming across a changed world would silently mix two worlds. Delete the '
    + 'checkpoint to start a genuinely fresh run, or check out the commit it was made on.');
  process.exit(1);
};
const startCheckpoint = (): void => {
  if (!CHECKPOINTING) return;
  const exists = existsSync(CKPT_PATH);
  if (RESUME && exists) {
    const lines = readFileSync(CKPT_PATH, 'utf8').split('\n').filter((l) => l.trim() !== '');
    let hdr: CkptHeader | null = null;
    let bad = 0;
    for (const line of lines) {
      let rec: Record<string, unknown>;
      try { rec = JSON.parse(line) as Record<string, unknown>; } catch { bad += 1; continue; }
      if (rec.kind === 'header') { if (hdr === null) hdr = rec as unknown as CkptHeader; continue; }
      if (rec.kind !== 'unit' || hdr === null) { bad += 1; continue; }
      const payload = rec.payload as string;
      if (typeof payload !== 'string' || sha(payload) !== rec.sha) { bad += 1; continue; }
      let unit: SeedUnit;
      try { unit = decTransport(JSON.parse(payload)) as SeedUnit; } catch { bad += 1; continue; }
      if (encodeUnit(unit) !== payload) { bad += 1; continue; }
      if (unit.seed !== RUN_BASE + unit.seedIdx
        || unit.control.seed !== unit.seed || unit.look.seed !== unit.seed) { bad += 1; continue; }
      restoredUnits.set(ckptKey(rec.pass as number, unit.seedIdx), unit);
    }
    if (hdr === null) refuse('the checkpoint has no readable header record (corrupt or truncated).');
    const h = hdr as CkptHeader;
    const mismatches = ([
      ['git HEAD', h.headFull, ckptHeader.headFull],
      ['probe file', h.probeSha256, ckptHeader.probeSha256],
      ['src working tree', h.srcDiffSha256, ckptHeader.srcDiffSha256],
      ['mode', h.mode, ckptHeader.mode],
      ['frozen config', h.configSha256, ckptHeader.configSha256],
    ] as const).filter(([, was, now]) => was !== now);
    if (mismatches.length > 0) {
      refuse(`${mismatches.length} guard field(s) changed since the checkpoint was written — `
        + mismatches.map(([w, was, now]) => `${w}: ${String(was)} → ${String(now)}`).join(' · '));
    }
    banner(`RESUME — checkpoint ${CKPT_PATH} accepted · ${restoredUnits.size} (pass, seed) unit(s) `
      + `restored${bad > 0 ? ` · ${bad} unusable record(s) DISCARDED and will be recomputed` : ''}`);
    return;
  }
  if (RESUME && !exists) banner(`RESUME requested but no checkpoint at ${CKPT_PATH} — starting FRESH.`);
  writeFileSync(CKPT_PATH, `${JSON.stringify(ckptHeader)}\n`);
  banner(`checkpoint ARMED at ${CKPT_PATH} (one line per finished (pass, seed) unit)`);
};
const appendCheckpoint = (pass: number, u: SeedUnit): void => {
  if (!CHECKPOINTING) return;
  const payload = encodeUnit(u);
  try {
    appendFileSync(CKPT_PATH, `${JSON.stringify({
      kind: 'unit', pass, seedIdx: u.seedIdx, seed: u.seed, sha: sha(payload), payload,
    })}\n`);
  } catch (e) {
    banner(`⚠ checkpoint append FAILED (${String(e)}) — the run continues, unprotected.`);
  }
};
startCheckpoint();

/* ========================================================================== */
/* §12 THE CORE (X-DET: run TWICE)                                            */
/* ========================================================================== */
interface Core {
  control: PerMatch[];
  look: PerMatch[];
  repro65: PerMatch[];
  repro186: PerMatch[];
  restored: string[];
  computed: string[];
}
const computeCore = (pass: number): Core => {
  const control: PerMatch[] = [];
  const look: PerMatch[] = [];
  const restored: string[] = []; const computed: string[] = [];
  const t0 = Date.now();
  for (let i = 0; i < RUN_N; i++) {
    const seed = RUN_BASE + i;
    const already = restoredUnits.get(ckptKey(pass, i));
    let unit: SeedUnit;
    if (already !== undefined) {
      unit = already;
      restored.push(ckptKey(pass, i));
      banner(`  pass ${pass} · seed ${i + 1}/${RUN_N} (${seed}) · SKIPPED — restored from checkpoint`);
    } else {
      unit = { seedIdx: i, seed, control: walkSeed(seed, 'control'), look: walkSeed(seed, 'look') };
      computed.push(ckptKey(pass, i));
      appendCheckpoint(pass, unit);
      banner(`  pass ${pass} · seed ${i + 1}/${RUN_N} (${seed}) · both arms done · `
        + `${((Date.now() - t0) / 1000).toFixed(1)} s`);
    }
    control.push(unit.control);
    look.push(unit.look);
  }
  banner(`  pass ${pass} · G-REPRO-186 (a): #65 block ${REPRO65_BASE} (${REPRO65_N} matches, REPRO65 flags)...`);
  const repro65: PerMatch[] = [];
  for (let i = 0; i < REPRO65_N; i++) repro65.push(walkSeed(REPRO65_BASE + i, 'repro65'));
  banner(`  pass ${pass} · G-REPRO-186 (b): #186 block ${REPRO186_BASE} (${REPRO186_N} matches, CONTROL arm)...`);
  const repro186: PerMatch[] = [];
  for (let i = 0; i < REPRO186_N; i++) repro186.push(walkSeed(REPRO186_BASE + i, 'control'));
  return { control, look, repro65, repro186, restored, computed };
};

const coreBody = (core: Core) => {
  const s186 = armSummary(core.repro65);
  const observed65 = {
    qualifying: s186.qualifyingTotal, eligible: s186.eligibleTotal, dHold: s186.chooserHold.total,
    classes: Object.fromEntries(CLASSES.map((c) => [c, s186.decisionClassShares[c].count])),
    agreeOverall: s186.mCtxPerceptionPrice.agreeOverall, ctxPlaced: s186.mCtxPerceptionPrice.placed,
  };
  const identical65 = JSON.stringify(observed65) === JSON.stringify({
    qualifying: REPRO65_TARGET.qualifying, eligible: REPRO65_TARGET.eligible,
    dHold: REPRO65_TARGET.dHold, classes: REPRO65_TARGET.classes,
    agreeOverall: REPRO65_TARGET.agreeOverall, ctxPlaced: REPRO65_TARGET.ctxPlaced,
  });
  /* limb (b): the CONTROL arm re-walks #186's own block and must reproduce its committed rows. */
  const committed186 = existsSync(SIZING186_PATH)
    ? (JSON.parse(readFileSync(SIZING186_PATH, 'utf8')) as any).perMatch.o1armed as any[]
    : [];
  const rows186 = core.repro186.map((r) => ({
    seed: r.seed, eligible: r.eligible, dHold: r.dHold, trueHoldable: r.trueHoldable,
    abstainUnseen: r.classCounts['E-ABSTAIN-UNSEEN'], ctxPlaced: r.ctxPlaced, ctxAgreeAll: r.ctxAgreeAll,
  }));
  const mismatches186 = rows186.filter((row, i) => {
    const want = committed186[i];
    return want === undefined || JSON.stringify(row) !== JSON.stringify({
      seed: want.seed, eligible: want.eligible, dHold: want.dHold, trueHoldable: want.trueHoldable,
      abstainUnseen: want.abstainUnseen, ctxPlaced: want.ctxPlaced, ctxAgreeAll: want.ctxAgreeAll,
    });
  });
  return {
    arms: { control: armSummary(core.control), look: armSummary(core.look) },
    contrasts: bootstrap(core.control, core.look),
    gRepro186: {
      limbA: {
        block: `${REPRO65_BASE}..${REPRO65_BASE + REPRO65_N - 1}`,
        flags: 'REPRO65 (= CENSUS_FLAGS, the #186 `baseline` arm)',
        target: REPRO65_TARGET, observed: observed65, identical: identical65,
      },
      limbB: {
        block: `${REPRO186_BASE}..${REPRO186_BASE + REPRO186_N - 1}`,
        flags: 'CONTROL (= the #186 `o1armed` arm)',
        rowsChecked: rows186.length, committedRowsAvailable: committed186.length,
        mismatches: mismatches186.length, observedRows: rows186,
        identical: rows186.length > 0 && mismatches186.length === 0
          && committed186.length >= rows186.length,
      },
      note: 'INSTRUMENT INHERITANCE PROVED, NOT ASSERTED: this probe\'s own walker re-derives '
        + 'two committed blocks — #65\'s block via the #186 G-REPRO65 target (limb a) and #186\'s '
        + 'OWN fresh block row-for-row on the CONTROL arm (limb b, the stronger form for THIS '
        + 'exam: it proves CONTROL *is* #186\'s o1armed arm on #186\'s own data).',
    },
    perMatch: {
      control: core.control.map((r) => ({
        seed: r.seed, eligible: r.eligible, dHold: r.dHold, trueHoldable: r.trueHoldable,
        abstainUnseen: r.classCounts['E-ABSTAIN-UNSEEN'], ctxPlaced: r.ctxPlaced,
        ctxAgreeAll: r.ctxAgreeAll, looks: r.looks, scans: r.lookScans,
        liveWindowTicks: r.liveWindowTicks, turnovers: r.turnovers,
        possessionSpells: r.possessionSpells, ticksWalked: r.ticksWalked,
        goals: r.goalsInWalkedWindow, ringPressure: r.ringPressure,
      })),
      look: core.look.map((r) => ({
        seed: r.seed, eligible: r.eligible, dHold: r.dHold, trueHoldable: r.trueHoldable,
        abstainUnseen: r.classCounts['E-ABSTAIN-UNSEEN'], ctxPlaced: r.ctxPlaced,
        ctxAgreeAll: r.ctxAgreeAll, looks: r.looks, scans: r.lookScans,
        liveWindowTicks: r.liveWindowTicks, turnovers: r.turnovers,
        possessionSpells: r.possessionSpells, ticksWalked: r.ticksWalked,
        goals: r.goalsInWalkedWindow, ringPressure: r.ringPressure,
      })),
    },
  };
};

const coreA = computeCore(1);
const bodyA = coreBody(coreA);
const digestA = sha(canonical(bodyA));
banner(`  [o2-t1] pass 1 digest ${digestA} — X-DET second pass...`);
const coreB = computeCore(2);
const bodyB = coreBody(coreB);
const digestB = sha(canonical(bodyB));
const xDet = digestA === digestB;
banner(`  [o2-t1] pass 2 digest ${digestB} — X-DET ${xDet ? 'PASS' : 'FAIL'}`);

/* --- X-FP-PROD, recomputed in-probe (#181.2) ------------------------------- */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const fpObserved = SKIP_FP ? 'skipped (O2T1_SKIP_FP)' : leagueHash(FINGERPRINT_SEED);
const xFpProd = !SKIP_FP && fpObserved === FINGERPRINT_BASELINE;

/* ========================================================================== */
/* §13 GATES — all computed IN-PROBE (#181.2)                                 */
/* ========================================================================== */
const srcDiff = gitSay('git diff --stat -- src');
const head = gitSay('git rev-parse --short HEAD');

const walkedBlocks = [
  { name: 'exam', first: RUN_BASE, last: RUN_BASE + RUN_N - 1 },
  { name: 'repro186', first: REPRO186_BASE, last: REPRO186_BASE + REPRO186_N - 1 },
  { name: 'repro65', first: REPRO65_BASE, last: REPRO65_BASE + REPRO65_N - 1 },
];
const collisionsOf = (first: number, last: number, allow: readonly string[]): string[] =>
  CONSUMED.filter((c) => !allow.includes(c.name))
    .filter((c) => !(last < c.range[0] || first > c.range[1])).map((c) => c.name);
const examCollisions = collisionsOf(RUN_BASE, RUN_BASE + RUN_N - 1, []);
const subBlocksOrdered = SMOKE_BASE + SMOKE_N - 1 < GUARD_BLOCK[0]
  && GUARD_BLOCK[1] < BATTERY_BASE && BATTERY_BASE + N_CAP - 1 === 12_422_899;
const statsMinGap = Math.min(...PUBLISHED_STATS_BASES.map((b) => Math.abs(BOOTSTRAP_SEED - b)));

const ctrlLedger = bodyA.arms.control.lookLedger;
const lookLedger = bodyA.arms.look.lookLedger;
const gForce = lookLedger.looks > 0
  && lookLedger.seedsWithLooks === RUN_N
  && lookLedger.scansEqualLiveTicks
  && lookLedger.unexplainedArms === 0
  && ctrlLedger.looks === 0 && ctrlLedger.scans === 0 && ctrlLedger.liveWindowTicks === 0;

const gates = {
  xDet: {
    pass: xDet, digestA, digestB,
    note: 'the WHOLE computation (both arms + both repro walks + summaries + bootstrap) run '
      + 'twice; the two HASHED BODIES are byte-identical and resultSha256 is run 1\'s digest',
  },
  xFpProd: {
    pass: xFpProd, baseline: FINGERPRINT_BASELINE, observed: fpObserved,
    seed: FINGERPRINT_SEED, seasons: FINGERPRINT_SEASONS,
  },
  gRepro186: {
    pass: bodyA.gRepro186.limbA.identical && bodyA.gRepro186.limbB.identical,
    limbA: bodyA.gRepro186.limbA.identical, limbB: bodyA.gRepro186.limbB.identical,
    limbBMismatches: bodyA.gRepro186.limbB.mismatches,
  },
  xSrcUntouched: { pass: srcDiff === '' },
  xRingPin: { pass: ringPinObserved === EXPECTED_SCAN_FRAME_RING, observed: ringPinObserved, expected: EXPECTED_SCAN_FRAME_RING },
  seedDisjoint: {
    pass: examCollisions.length === 0 && subBlocksOrdered,
    walkedBlocks, examCollisions, subBlocksOrdered,
    subBlocks: {
      smoke: `${SMOKE_BASE}..${SMOKE_BASE + SMOKE_N - 1}`,
      exitSemanticsGuard: `${GUARD_BLOCK[0]}..${GUARD_BLOCK[1]}`,
      battery: `${BATTERY_BASE}..${BATTERY_BASE + N_CAP - 1}`,
    },
    reproBlocksNote: 'the two repro blocks are DELIBERATE re-walks of #65\'s and #186\'s own '
      + 'committed blocks (receipts, never fresh data), so their overlap with the ledger is the '
      + 'point; only the EXAM block must be clash-free.',
    consumedLedger: CONSUMED,
  },
  statsDisjoint: {
    pass: statsMinGap >= 200, base: BOOTSTRAP_SEED, minGap: statsMinGap,
    published: PUBLISHED_STATS_BASES,
    publishedScope: 'the goal-genealogy census probe\'s COMPLETE ≥91,100-regime ledger + 104,400 '
      + '(the census\'s own base). Pre-regime bases (90,730, the 50xxx family) are ≥ 13,000 away '
      + 'and cannot move the minimum.',
  },
  flagHygiene: {
    pass: JSON.stringify(ARM_FLAGS.control) === JSON.stringify({ ...CENSUS_FLAGS, o1PassWindup: true })
      && ARM_FLAGS.look.o2Look === true
      && Object.keys(ARM_FLAGS.look).length === Object.keys(ARM_FLAGS.control).length + 1
      && Object.keys(ARM_FLAGS.control).every((k) => ARM_FLAGS.look[k] === ARM_FLAGS.control[k]),
    control: ARM_FLAGS.control, look: ARM_FLAGS.look,
    note: 'the arms differ by EXACTLY one flag: o2Look (plus the probe-level forcing harness)',
  },
  tableDrift: {
    pass: raw.tableSha === EXPECTED_TABLE_SHA
      && JSON.stringify(HOLDABLE_CELLS) === JSON.stringify(['0|0|0']),
    sha: EXPECTED_TABLE_SHA, holdableCells: HOLDABLE_CELLS,
  },
  gForce: {
    pass: gForce,
    look: {
      looks: lookLedger.looks, seedsWithLooks: lookLedger.seedsWithLooks, seeds: RUN_N,
      scans: lookLedger.scans, liveWindowTicks: lookLedger.liveWindowTicks,
      scansEqualLiveTicks: lookLedger.scansEqualLiveTicks,
      unexplainedArms: lookLedger.unexplainedArms,
    },
    control: { looks: ctrlLedger.looks, scans: ctrlLedger.scans, liveWindowTicks: ctrlLedger.liveWindowTicks },
    note: 'the arms are what they claim: the seam is reached at scale on EVERY seed of the LOOK '
      + 'arm (with the T0 cadence identity scans === live window ticks) and is entirely absent '
      + 'from CONTROL',
  },
  gCleanInvocation: {
    pass: !OVERRIDDEN, envN: N_ENV, skipFp: SKIP_FP,
    routedToGuardBlock: OVERRIDDEN,
    note: 'any O2T1_N / O2T1_SKIP_FP override is BY DEFINITION not the exam: the run is routed '
      + 'onto the exit-semantics guard block, this gate goes RED and the process exits 1.',
  },
};
const allGatesPass = Object.values(gates).every((g) => (g as { pass: boolean }).pass === true);

/* ========================================================================== */
/* §14 THE ARTIFACT — hashed body vs UNHASHED envelope (#197-M1 / #198)        */
/* ========================================================================== */
const body = {
  stage: 'O2 T1 — THE WEDGE EXAM (the #186 sizing form re-run with the LOOK forced)',
  ruling: '#219.2 (the dispatch) · O2-LOOK-CONTRACT §3 O2-T1 · #181.2 (the standing receipt rule)',
  doc: 'docs/world-model/O2-T1-WEDGE-EXAM.md',
  mode: MODE,
  block: `${RUN_BASE}..${RUN_BASE + RUN_N - 1}`,
  seeds: RUN_N,
  armDefinitions: {
    control: 'CENSUS_FLAGS + o1PassWindup — the #186 `o1armed` arm VERBATIM',
    look: 'CONTROL + o2Look:true + the forcing harness (ONE LOOK PER RECEPTION)',
    forcingRule: `on a NEW-OWNERSHIP edge by a non-GK body, forcedLook = {gid, untilTick: `
      + `simTick + ${FORCE_RUNWAY_TICKS}}; the seat arms ONE ${O2_LOOK_TICKS}-tick window and `
      + 'refuses to stack on a live one; a body who REGAINS later gets a fresh look; a body who '
      + 'merely keeps the ball is armed once. CONTINUOUS forcing is FORBIDDEN (it would pin the '
      + 'carrier via the re-decide lock and the world would stop playing football).',
  },
  populationRulings: [
    'the #186 eligible-moment predicate, spacing, per-match cap, pristine-clone classification '
      + 'and every metric column are inherited VERBATIM — zero population edits, zero re-cuts; '
      + 'the DEV floor is NOT re-cut',
    'moments falling inside a live look window STAY in the population (they are honestly '
      + 'mid-price moments)',
    'declared consequence: under the re-decide lock the A0 one-step fork reads the incumbent '
      + 'Dribble label, so the Shoot/ClearBall exclusions fire less often in the LOOK arm — the '
      + 'per-arm exclusion mix is published so the shift is visible',
  ],
  preRegisteredSuccess: 'contract §3: the perceived-context hold rate rises toward the '
    + 'true-context rate (the wedge point falls toward 1× with the paired CI excluding the '
    + 'CONTROL wedge) and E-ABSTAIN-UNSEEN falls resolvedly. FAIL branches pre-named: F-O2a '
    + '(looks complete and percepts refresh but classification does not move) · F-O2b (hold/'
    + 'survival improves at ~zero measured exposure cost). ⚠ THIS PROBE FIRES NEITHER: it emits '
    + 'PER-ARM ROWS and paired deltas with mechanical `resolved` CI flags only (#203); '
    + 'adjudication is the commander\'s.',
  tableSha: EXPECTED_TABLE_SHA,
  frozenInterval: { o2LookTicks: O2_LOOK_TICKS, forceRunwayTicks: FORCE_RUNWAY_TICKS },
  nRule,
  reference186: {
    block: '12310000..12310199', arm: 'o1armed',
    perceivedHold: SIZING186 === null ? null
      : SIZING186.j.arms.o1armed.chooserHold.rateOfEligible as number,
    trueContextShare: SIZING186 === null ? null
      : SIZING186.j.arms.o1armed.trueContext.shareOfEligible as number,
    wedgeRatio: SIZING186 === null ? null : SIZING186.j.arms.o1armed.wedgeRatio as number,
    abstainUnseen: SIZING186 === null ? null
      : SIZING186.j.arms.o1armed.decisionClassShares['E-ABSTAIN-UNSEEN'].share as number,
    eligible: SIZING186 === null ? null : SIZING186.j.arms.o1armed.eligibleTotal as number,
    matches: SIZING186 === null ? null : SIZING186.j.matches as number,
    note: 'READ FIELD-FOR-FIELD out of the committed data/o2-whether-sizing-rerun.json '
      + '(arms.o1armed: chooserHold.rateOfEligible · trueContext.shareOfEligible · wedgeRatio · '
      + 'decisionClassShares["E-ABSTAIN-UNSEEN"].share · eligibleTotal, and the top-level '
      + 'matches) — nothing here is re-derived from rounded shares, so no CITED number can '
      + 'differ from its source; re-derived in-probe by gate G-REPRO-186 limb (b), never '
      + 'trusted as prose',
  },
  ...bodyA,
  gates,
  allGatesPass,
};
const resultSha256 = sha(canonical(body));

const wallMs = Date.now() - wall0;
writeFileSync(OUT_PATH, `${JSON.stringify({
  ...body,
  resultSha256,
  /* ⭐ #197-M1/#198: EVERYTHING below rides OUTSIDE resultSha256 — git head, wall clock,
   * paths and checkpoint state. resultSha256 recomputes identically at any later commit,
   * from any cwd. */
  envelopeContextOnly: {
    headContextOnly: head,
    wallMsContextOnly: wallMs,
    wallNote: 'CONTEXT ONLY (#128) — used in NO rate and in no gate',
    outPath: OUT_PATH,
    srcDiffStat: srcDiff,
    tablePath: TABLE_PATH,
    sizing186Path: SIZING186_PATH,
    checkpoint: {
      armed: CHECKPOINTING, path: CHECKPOINTING ? CKPT_PATH : null, resumeRequested: RESUME,
      restoredPass1: coreA.restored.length, computedPass1: coreA.computed.length,
      restoredPass2: coreB.restored.length, computedPass2: coreB.computed.length,
      note: 'RESILIENCE ONLY. The unit is the per-(pass, seed) pair of PerMatch rows; nothing '
        + 'pooled is stored and every quantity, gate, digest and resultSha256 is recomputed '
        + 'from the union — a resumed run is byte-identical to a fresh one. /tmp scratch, never '
        + 'committed, never read by a gate.',
    },
  },
}, null, 2)}\n`);

/* ========================================================================== */
/* §15 THE TRANSCRIPT — PER-ARM ROWS AND DELTAS ONLY (#203, no verdict lines)  */
/* ========================================================================== */
const pct = (x: number): string => `${(x * 100).toFixed(4)}%`;
const A = bodyA.arms;
const C = bodyA.contrasts.rates as Record<string, any>;
const o = (s: string): void => { process.stdout.write(`${s}\n`); };
const row = (label: string, key: string, asPct = true): void => {
  const c = C[key];
  const f = (v: number): string => (asPct ? pct(v) : String(v));
  o(`  ${label.padEnd(26)} CONTROL ${f(c.control.point).padStart(11)}`
    + ` · LOOK ${f(c.look.point).padStart(11)}`
    + ` · Δ ${c.pairedDelta.point} [${c.pairedDelta.lower}, ${c.pairedDelta.upper}]`
    + ` resolved=${c.resolved}`);
};
o('');
o(`=== O2-T1 WEDGE EXAM · mode ${MODE} · ${body.block} (${RUN_N} seeds/arm, shared) ===`);
o(`eligible moments  CONTROL ${A.control.eligibleTotal} · LOOK ${A.look.eligibleTotal}`
  + `   (qualifying ${A.control.qualifyingTotal} / ${A.look.qualifyingTotal})`);
o('THE RATES (paired per-match bootstrap, ratio-of-totals, 2.5/97.5, stats base '
  + `${BOOTSTRAP_SEED}, ${BOOTSTRAP_RESAMPLES} resamples; Δ = LOOK − CONTROL)`);
row('PERCEIVED hold', 'perceivedHoldShare');
o(`      n_hold           CONTROL ${A.control.chooserHold.total} · LOOK ${A.look.chooserHold.total}`);
row('TRUE-context share', 'trueContextShare');
o(`      n_true           CONTROL ${A.control.trueContext.total} · LOOK ${A.look.trueContext.total}`);
o(`  ${'WEDGE (true÷perceived)'.padEnd(26)} CONTROL ${A.control.wedgeRatio}×`
  + ` · LOOK ${A.look.wedgeRatio}×`
  + ` · Δ ${C.wedgeRatio.pairedDelta.point} [${C.wedgeRatio.pairedDelta.lower}, ${C.wedgeRatio.pairedDelta.upper}]`
  + ` resolved=${C.wedgeRatio.resolved}`);
o(`      LOOK wedge CI [${C.wedgeRatio.look.lower}, ${C.wedgeRatio.look.upper}]`
  + ` · excludesControlPoint=${C.wedgeRatio.lookWedgeCiExcludesControlPoint}`);
row('E-ABSTAIN-UNSEEN', 'abstainUnseenShare');
row('E-ACTNOW-DECLINED', 'actNowDeclinedShare');
row('E-NOCELL', 'noCellShare');
row('M-CTX agreement', 'ctxAgreement');
row('M-CTX  pressure', 'ctxAgreePressure');
row('M-CTX  stale', 'ctxAgreeStale');
row('M-CTX  support', 'ctxAgreeSupport');
o(`  DEV floor 0.29% cleared?   CONTROL ${A.control.devFloor.shareClearsFloor}`
  + ` · LOOK ${A.look.devFloor.shareClearsFloor}   (NOT re-cut, #65.1)`);
o('EXCLUSION MIX (firstTouch / mustKick / A0-Shoot / A0-Clear)');
o(`  CONTROL ${A.control.exclusions.firstTouch} / ${A.control.exclusions.mustKick}`
  + ` / ${A.control.exclusions.a0Shoot} / ${A.control.exclusions.a0Clear}`
  + `   ·   LOOK ${A.look.exclusions.firstTouch} / ${A.look.exclusions.mustKick}`
  + ` / ${A.look.exclusions.a0Shoot} / ${A.look.exclusions.a0Clear}`);
o('(i) LOOK LEDGER   (the #194 abort-mix price is stated in the artifact beside these counts)');
o(`  CONTROL looks ${ctrlLedger.looks} · scans ${ctrlLedger.scans} · liveTicks ${ctrlLedger.liveWindowTicks}`);
o(`  LOOK    looks ${lookLedger.looks} · completed ${lookLedger.completed}`
  + ` · abortedLoss ${lookLedger.abortedLoss} · abortedPhase ${lookLedger.abortedPhase}`
  + ` · E-ENDED ${lookLedger.endedLive} · scans ${lookLedger.scans}`
  + ` · liveTicks ${lookLedger.liveWindowTicks} · seedsWithLooks ${lookLedger.seedsWithLooks}/${RUN_N}`);
o('(ii) F-O2b EXPOSURE INSTRUMENTS');
row('turnover per spell', 'turnoverPerSpell', false);
row('turnovers /1000 ticks', 'turnoversPer1000Ticks', false);
o(`  turnovers look-attributed at the LOSS TICK   CONTROL ${A.control.exposure.turnoversUnderLiveLook}`
  + ` · LOOK ${A.look.exposure.turnoversUnderLiveLook}`);
o(`  companions (no assumed identity): engine abortedLoss ${A.control.exposure.engineAbortedLoss}`
  + `/${A.look.exposure.engineAbortedLoss}`
  + ` · abortedLoss with OWN-team recovery ${A.control.exposure.abortedLossOwnTeamRecovery}`
  + `/${A.look.exposure.abortedLossOwnTeamRecovery}`
  + ` · unresolved at walk end ${A.control.exposure.abortedLossUnresolvedAtWalkEnd}`
  + `/${A.look.exposure.abortedLossUnresolvedAtWalkEnd}`);
o(`  spells ${A.control.exposure.possessionSpells}/${A.look.exposure.possessionSpells}`
  + ` · turnovers ${A.control.exposure.turnovers}/${A.look.exposure.turnovers}`
  + ` · ticks ${A.control.exposure.ticksWalked}/${A.look.exposure.ticksWalked}`);
o(`(iv) RING PRESSURE (ring ${SCAN_FRAME_RING}, retention ${A.look.ringPressure.retentionTicks} ticks)`);
row('ringPressure share', 'ringPressureShare');
o(`  ringFull  CONTROL ${A.control.ringPressure.ringFull}/${A.control.ringPressure.momentsReadable}`
  + ` · LOOK ${A.look.ringPressure.ringFull}/${A.look.ringPressure.momentsReadable}`
  + ` · mean occupancy ${A.control.ringPressure.meanOccupancy}/${A.look.ringPressure.meanOccupancy}`
  + ` · mean oldest age ${A.control.ringPressure.meanOldestFrameAgeTicks}/${A.look.ringPressure.meanOldestFrameAgeTicks}`);
o('(v) BUILD-UP RULER — constructed/scramble shares DROPPED (whole-match classifier vs a walk');
o('    truncated at PER_MATCH_CAP); carried instead:');
o(`  goals in walked window  CONTROL ${A.control.buildUpCarried.goalsInWalkedWindow}`
  + ` · LOOK ${A.look.buildUpCarried.goalsInWalkedWindow}`
  + ` · matches reaching full time ${A.control.buildUpCarried.matchesReachingFullTime}`
  + `/${A.look.buildUpCarried.matchesReachingFullTime} of ${RUN_N}`);
o('N RULE (in-probe, from the committed #186 artifact)');
if (nRule.available) {
  const nr = nRule as any;
  o(`  q1 perceived-hold half-closure: DEFF ${nr.q1PerceivedHold.deff} · m_req ${nr.q1PerceivedHold.mReq}`
    + ` ⇒ N ${nr.q1PerceivedHold.n}`);
  o(`  q2 E-ABSTAIN-UNSEEN −2pp:       DEFF ${nr.q2AbstainUnseen.deff} · m_req ${nr.q2AbstainUnseen.mReq}`
    + ` ⇒ N ${nr.q2AbstainUnseen.n}`);
  o(`  binding ${nr.binding} ⇒ N* ${nr.nStar} (cap ${N_CAP}, binds=${nr.capBinds}) · battery block ${nr.batteryBlock}`);
}
o('GATES');
for (const [k, g] of Object.entries(gates)) o(`  ${k.padEnd(18)} ${(g as any).pass ? 'PASS' : '*** FAIL ***'}`);
o(`  ALL                ${allGatesPass ? 'PASS' : '*** FAIL ***'}`);
o(`resultSha256 ${resultSha256}`);
o(`wall ${Math.round(wallMs / 1000)} s (CONTEXT ONLY) · artifact ${OUT_PATH}`);
if (!allGatesPass) process.exitCode = 1;
