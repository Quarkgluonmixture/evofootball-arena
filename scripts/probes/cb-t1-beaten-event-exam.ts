/**
 * CB T1 — THE BEATEN-EVENT EXAM (docs/world-model/CB-T1-BEATEN-EVENT-EXAM.md).
 *
 * Contract CB-CARRY-BEAT-CONTRACT.md §1 H-CB.1 (the scored half) + §3 CB-T1, dispatched by
 * ruling #267.5. Every limb, bar, bin, the dosing policy, the N rule and the gate list are FROZEN
 * in the stage doc — IN ITS OWN COMMIT, before this file existed (#266.3(c)) — and every number
 * the doc publishes is quoted from this probe's artifact (#229.2).
 *
 * ⭐ INSTRUMENT-ONLY: `src/**` is byte-untouched (X-SRC-UNTOUCHED). The seam is CB-T0's; this
 * probe arms it from outside and scores what the world then does.
 *
 * ⭐⭐ #267.2(i) DISCHARGED BY FIELD NAME: `wallTerm`, `projectedHours`, `msPerMatch` and every
 * timing/path ride the UNHASHED ENVELOPE; `precisionTerm` / `cap` / `nStar` / `ran` stay in the
 * hashed body, and the wall term is computed from the COMMITTED SIZING ARTIFACT's envelope (a
 * fixed committed number), never from this run's realized clock — so `nStar`, and therefore the
 * whole body, re-derives on another machine. G-HASH-ENVELOPE runs the three-part acceptance test.
 *
 * ⭐ ENV SURFACE — WHITELISTED-OR-REFUSE (#261.2 / #262.2), including the ENGINE's own doors:
 *   accepted: CBT1_MODE (sizing|full, REQUIRED) · CBT1_N · CBT1_SIZING_N · CBT1_SKIP_FP · CBT1_OUT
 * Anything else `CBT1_*`, or ANY engine door, is a FATAL refusal (exit 2). Every override —
 * CBT1_OUT included — makes the run a PREFLIGHT: routed onto the guard block, G-ENV-CLEAN goes
 * RED, and a canonical repo path may never be written.
 *
 * RUN: CBT1_MODE=sizing npx tsx scripts/probes/cb-t1-beaten-event-exam.ts
 *      CBT1_MODE=full   npx tsx scripts/probes/cb-t1-beaten-event-exam.ts
 * EXIT: 0 = every HARD gate green · 1 = a gate is RED · 2 = a refusal.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { League } from '../../src/sim/League';
import { Match, type MatchConfig } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import {
  CONTEST_RADIUS, DT, TOUCH_CONTROL_DIST,
  TOUCH_RECOLLECT_BASE, TOUCH_RECOLLECT_PER_PUSH,
} from '../../src/sim/constants';
import {
  CB_TACKLE_RADIUS, beatsDefender, overcommitSpeed, recoveryInterval, touchPastPush,
  touchRaceWindow, type CbBody,
} from '../../src/sim/carryBeat';
import { a4MatchFlags } from '../../src/game/a4World';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 FROZEN CONSTANTS                                                         */
/* ========================================================================== */
const MECHANICS_PATH = 'src/sim/mechanics.ts';
const SIZING_PATH = 'docs/world-model/data/cb-t1-sizing-smoke.json';
const FINGERPRINT_SEASONS = 2;
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⭐ THE FROZEN BARS (stage doc §CLAIM). G-BARS asserts these ARE the published literals. */
const BAR_SOUNDNESS = 0.95;
const BAR_GAP = 0.05;
const BAR_CELL_MIN = 200;
const BAR_TWO_CELL_SEEDS_MIN = 8;
const BAR_L3A_SEED_SHARE = 0.8;

/** CB-C0's own arrival-speed grid: quarters of the BASE v* (§BINS, inherited with its arithmetic). */
const V_STAR_BASE = overcommitSpeed(14);
const SPEED_EDGES = [1, 2, 3, 4].map((k) => (V_STAR_BASE * k) / 4);
const SPEED_BIN_NAMES = ['s0 walk', 's1 jog', 's2 run', 's3 drive', 's4 OVERCOMMITTED'];
const speedBin = (v: number): number => {
  for (let i = 0; i < SPEED_EDGES.length; i++) if (v < SPEED_EDGES[i]) return i;
  return SPEED_EDGES.length;
};

/** the other four duel mechanics' own cooldown constants (CB-C0's detector, CB-T0 §DEV 7). */
const OTHER_MECHANIC_COOLDOWNS = [2.5, 2.0, 0.9];
const WON_COOLDOWN = 0.5;
/** the engine's own knock-possession marker lifetime (`dribbleTouch.until = simTime + 1.6`). */
const MECH_SRC = readFileSync(MECHANICS_PATH, 'utf8');
const MARKER_LIFETIME_S = (() => {
  const m = MECH_SRC.match(/match\.dribbleTouch = \{ gid: p\.gid, until: match\.simTime \+ (\d+(?:\.\d+)?) \}/);
  if (m === null) throw new Error('CB-T1: the knock-marker lifetime could not be read from src');
  return Number(m[1]);
})();
/** ⭐ CB-C0's H2 horizon = 2 × the incumbent miss cooldown, read out of `src/**` at run time. */
const INCUMBENT_MISS_COOLDOWN = (() => {
  /** ⚠ the MISS branch's constant, not the won branch's 0.5: the write immediately preceding
   *  `tackler.stunTimer = 0.35;` (the whiff-stun the same branch writes). */
  const stunAt = MECH_SRC.indexOf('tackler.stunTimer = 0.35;');
  if (stunAt < 0) throw new Error('CB-T1: the incumbent whiff stun could not be located in src');
  const before = MECH_SRC.slice(0, stunAt);
  const all = [...before.matchAll(/tackler\.tackleCooldown = (\d+(?:\.\d+)?);/g)];
  if (all.length === 0) throw new Error('CB-T1: the incumbent miss cooldown could not be read from src');
  return Number(all[all.length - 1][1]);
})();
const REENGAGE_HORIZON_S = 2 * INCUMBENT_MISS_COOLDOWN;
/** ⚠ the KEEPER SMOTHER's own miss pair (`trySmother`), read out of src: CB-C0's detector names
 *  it "1.2 & stun 0.8 (GK)", and it is NOT a standing challenge. Excluded by role AND by pair. */
const GK_SMOTHER = (() => {
  const stun = MECH_SRC.match(/gk\.stunTimer = (\d+(?:\.\d+)?);/);
  const cds = [...MECH_SRC.matchAll(/gk\.tackleCooldown = (\d+(?:\.\d+)?);/g)];
  if (stun === null || cds.length === 0) throw new Error('CB-T1: the smother pair is unreadable');
  return { stun: Number(stun[1]), cooldown: Number(cds[cds.length - 1][1]) };
})();
/** the banked #173 pressing radius. */
const PRESSURE_R = TOUCH_CONTROL_DIST;
/** the armed substrate's own key set — G-WORLD reads every one back off the built match. */
const SUBSTRATE_FLAGS = a4MatchFlags(3) as unknown as Record<string, boolean>;

/* ========================================================================== */
/* §2 ⭐ ENV — WHITELIST-OR-REFUSE + THE PREFLIGHT ROUTING                     */
/* ========================================================================== */
const ENV_WHITELIST = ['CBT1_MODE', 'CBT1_N', 'CBT1_SIZING_N', 'CBT1_SKIP_FP', 'CBT1_OUT'] as const;
const ENGINE_DOORS = [
  'EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'EDS_SCALE_PITCH', 'EDS_SCALE_SPEED', 'EDS_SCALE_BALL', 'EDS_SCALE_TIME', 'EDS_SCALE_STAMINA',
] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogue = Object.keys(process.env)
  .filter((k) => k.startsWith('CBT1_') && !(ENV_WHITELIST as readonly string[]).includes(k));
if (rogue.length > 0) {
  banner(`FATAL: unrecognised env ${rogue.join(', ')} — whitelist-or-refuse (#261.2)`);
  process.exit(2);
}
const doorsSet = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (doorsSet.length > 0) {
  banner(`FATAL: the ENGINE's own doors are set (${doorsSet.join(', ')}) — refused (#261.2)`);
  process.exit(2);
}
const MODES = ['sizing', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.CBT1_MODE as Mode | undefined;
if (MODE === undefined || !MODES.includes(MODE)) {
  banner('FATAL: CBT1_MODE is REQUIRED and must be one of sizing|full');
  process.exit(2);
}
const intEnv = (v: string | undefined): number | null => (v ? Math.max(1, Number.parseInt(v, 10)) : null);
const N_ENV = intEnv(process.env.CBT1_N);
const SIZING_N_ENV = intEnv(process.env.CBT1_SIZING_N);
const SKIP_FP = process.env.CBT1_SKIP_FP === '1';
const OUT_ENV = process.env.CBT1_OUT;
const OVERRIDES: { name: string; set: boolean }[] = [
  { name: 'CBT1_N', set: N_ENV !== null },
  { name: 'CBT1_SIZING_N', set: SIZING_N_ENV !== null },
  { name: 'CBT1_SKIP_FP', set: SKIP_FP },
  { name: 'CBT1_OUT', set: OUT_ENV !== undefined },
];
const IS_PREFLIGHT = OVERRIDES.some((o) => o.set);
const PREFLIGHT_REASONS = OVERRIDES.filter((o) => o.set).map((o) => o.name);
const OUT_BY_MODE: Record<Mode, string> = {
  sizing: SIZING_PATH,
  full: 'docs/world-model/data/cb-t1-beaten-event-exam.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const abs = pathResolve(p);
  return abs === CANONICAL_DIR_ABS || abs.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/cb-t1-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  banner(`FATAL: a PREFLIGHT may not write a canonical repo path (${OUT_PATH}) — #262.2`);
  process.exit(2);
}

/* ========================================================================== */
/* §3 SEED LEDGER (#163)                                                       */
/* ========================================================================== */
const GUARD_BLOCK = 12_473_050;
const IDENT_BLOCK = IS_PREFLIGHT ? GUARD_BLOCK : 12_473_000;
const SIZING_BASE = IS_PREFLIGHT ? GUARD_BLOCK + 20 : 12_473_100;
const BATTERY_BASE = IS_PREFLIGHT ? GUARD_BLOCK + 30 : 12_473_200;
const WORLD_SEED = 12_473_999;
const SIZING_N = SIZING_N_ENV ?? 20;
const CAP = 200;
const N_FLOOR = 12;
const BAND: readonly [number, number] = [12_473_000, 12_473_999];

const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: '#65 whether-seat sizing block', range: [8_500_000, 8_500_047] },
  { name: 'tempo census', range: [12_293_000, 12_299_999] },
  { name: 'O1 / O2 / PM / MT / CTB / OBM / PTP / DLC bands', range: [12_300_000, 12_428_999] },
  { name: 'DV-C0 smoke + guard + census (#249)', range: [12_429_000, 12_429_999] },
  { name: 'DV-T0 / DV-T1 receipts + battery (#250/#251)', range: [12_430_000, 12_430_999] },
  { name: 'DV-T1b (#252)', range: [12_431_000, 12_431_999] },
  { name: 'DV-T1c (#253/#254)', range: [12_432_000, 12_435_099] },
  { name: 'DV-T2-C0 census band (#255.4/#256)', range: [12_436_000, 12_436_999] },
  { name: 'DV-T2-T0 learning seam (#256.4/#257)', range: [12_437_000, 12_437_999] },
  { name: 'DV-T2-T1 convergence exam (#257.3/#258.4)', range: [12_438_000, 12_447_999] },
  { name: 'EK-C0 census band (#259.3/#260.4)', range: [12_448_000, 12_448_999] },
  { name: 'EK-C0b diagnostic band (#260.3/#261)', range: [12_449_000, 12_449_999] },
  { name: 'EK-T0 hold-belief seam (#261.4)', range: [12_450_000, 12_450_999] },
  { name: 'EK-T1 convergence exam (#262.3)', range: [12_451_000, 12_460_999] },
  { name: 'EK-C0c in-timeline census (#263.3)', range: [12_461_000, 12_465_999] },
  { name: 'CB-C0 dispossession census (#265.4/#266)', range: [12_470_000, 12_471_799] },
  { name: '⭐ CB-T0 dormant layer-1 seam (#266.5/#267)', range: [12_472_000, 12_472_999] },
];

/* ========================================================================== */
/* §4 SMALL HELPERS                                                            */
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
const sum = (a: readonly number[]): number => a.reduce((x, y) => x + y, 0);
const mean = (a: readonly number[]): number => (a.length === 0 ? Number.NaN : sum(a) / a.length);
const quantileSorted = (a: readonly number[], q: number): number => {
  if (a.length === 0) return Number.NaN;
  const i = (a.length - 1) * q;
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  return lo === hi ? a[lo] : a[lo] + (a[hi] - a[lo]) * (i - lo);
};
const stats6 = (values: readonly number[]): Record<string, number | null> => {
  if (values.length === 0) {
    return { n: 0, min: null, q1: null, median: null, q3: null, mean: null, max: null };
  }
  const s = [...values].sort((x, y) => x - y);
  return {
    n: s.length,
    min: round(s[0]), q1: round(quantileSorted(s, 0.25)), median: round(quantileSorted(s, 0.5)),
    q3: round(quantileSorted(s, 0.75)), mean: round(mean(s)), max: round(s[s.length - 1]),
  };
};

/* ========================================================================== */
/* §5 THE WORLD, THE ARMS, AND THE FROZEN DOSER                                */
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
type ArmName = 'off' | 'commit' | 'touch';
const ARMS: readonly ArmName[] = ['off', 'commit', 'touch'];
const armConfig = (arm: ArmName): Partial<MatchConfig> => ({
  cbCommitPhysics: arm === 'commit',
  cbTouchPast: arm === 'touch',
});
const matchOf = (seed: number, arm: ArmName): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
  ...a4MatchFlags(3),
  ...armConfig(arm),
});

/**
 * ⭐⭐ THE FROZEN DOSING POLICY (stage doc §FORM). Public state only. In the OFF and COMMIT arms
 * it runs in SHADOW: it records the eligible moment and NEVER writes `forcedTouchPast`.
 * The arming is valid for EXACTLY ONE TICK (the probe clears it at the head of every tick), so an
 * arming can never fire later with a stale aim.
 */
interface DoseRec {
  tick: number; carrierGid: number; side: number; live: boolean;
  e1: boolean; e2: boolean; e3: boolean; e4: boolean; e5: boolean;
  nearestGid: number; dirX: number; dirY: number; fellBack: boolean;
}
function eligibleDose(m: Match): DoseRec | null {
  const e1 = m.phase === 'playing';
  const owner: Player | null = m.ball.owner;
  const e2 = owner !== null && owner.role !== 'GK' && !owner.sentOff;
  if (!e1 || !e2 || owner === null) return null;
  const e3 = owner.gkHoldTimer <= 0 && owner.kickCooldown <= 0;
  const e4 = m.dribbleTouch === null;
  if (!e3 || !e4) return null;
  let nearest: Player | null = null;
  let bestD = Infinity;
  for (const o of m.teams[1 - owner.side].players) {
    if (o.sentOff) continue;
    const d = Math.hypot(o.pos.x - m.ball.pos.x, o.pos.y - m.ball.pos.y);
    if (d <= CONTEST_RADIUS && d < bestD) { bestD = d; nearest = o; }
  }
  if (nearest === null) return null;
  // THE AIM RULE: away from the nearest challenger. Predicate-independent by construction.
  let dx = m.ball.pos.x - nearest.pos.x;
  let dy = m.ball.pos.y - nearest.pos.y;
  let len = Math.hypot(dx, dy);
  let fellBack = false;
  if (!(len > 1e-9)) {
    dx = -owner.heading.x; dy = -owner.heading.y; len = Math.hypot(dx, dy); fellBack = true;
  }
  return {
    tick: m.simTick, carrierGid: owner.gid, side: owner.side, live: false,
    e1, e2, e3, e4, e5: true, nearestGid: nearest.gid, dirX: dx / len, dirY: dy / len, fellBack,
  };
}

/* ========================================================================== */
/* §6 THE WALKER — one match, one arm, every cell this exam publishes          */
/* ========================================================================== */
type Resolution = 'captured' | 'noCaptureInWindow' | 'censoredMatchEnd' | 'censoredPhase';
interface ChallengerObs {
  gid: number; predBeaten: boolean;
  reengageTicks: number; reengageCensored: boolean;
  sepCarrierT0: number; sepCarrierEnd: number | null;
  recTotal: number;
}
interface KnockRec {
  tick: number; carrierGid: number; side: number; push: number; speed: number; window: number;
  windowTicks: number;
  challengers: ChallengerObs[];
  captorGid: number | null; captorSide: number | null; captureOffset: number | null;
  resolution: Resolution;
  retainedAtMarker: boolean | null;
}
interface SeedRow {
  seed: number; arm: ArmName;
  duelsWon: number; duelsMissed: number;
  /** per event: [bin, total, brake, arrivalSpeed, observedSpeed, accel] */
  recoveryEvents: number[][];
  detectMismatches: number; engineTackles: number; smotherMisses: number; whistledMisses: number;
  knocks: number; doses: number; dosesFired: number;
  replicaMismatches: number; unarmedKnocks: number; offsetViolations: number;
  resolutions: Record<Resolution, number>;
  beatenResolvable: number; beatenNoCapture: number;
  notBeatenResolvable: number; notBeatenNoCapture: number;
  beatenNoSideRegain: number; notBeatenNoSideRegain: number;
  reengageBeaten: number[]; reengageNotBeaten: number[];
  windows: number[];
  sepBeatenT0: number[]; sepNotBeatenT0: number[];
  derivedRecoveryBeaten: number[];
  knockRetained: number; knockLost: number;
  shadowMoments: number; shadowRetained: number;
  turnovers: number; segments: number; segmentTickSum: number;
  goals: number; shots: number; fouls: number; yellows: number; reds: number; penalties: number;
  firstRecOpen: number; firstRecPressed: number;
  firstRecPressedLost: number; firstRecUnpressedLost: number;
  simSeconds: number;
  ledger: Record<string, number>;
}
const zeroRow = (seed: number, arm: ArmName): SeedRow => ({
  seed, arm,
  duelsWon: 0, duelsMissed: 0, recoveryEvents: [],
  detectMismatches: 0, engineTackles: 0, smotherMisses: 0, whistledMisses: 0,
  knocks: 0, doses: 0, dosesFired: 0,
  replicaMismatches: 0, unarmedKnocks: 0, offsetViolations: 0,
  resolutions: { captured: 0, noCaptureInWindow: 0, censoredMatchEnd: 0, censoredPhase: 0 },
  beatenResolvable: 0, beatenNoCapture: 0, notBeatenResolvable: 0, notBeatenNoCapture: 0,
  beatenNoSideRegain: 0, notBeatenNoSideRegain: 0,
  reengageBeaten: [], reengageNotBeaten: [], windows: [],
  sepBeatenT0: [], sepNotBeatenT0: [], derivedRecoveryBeaten: [],
  knockRetained: 0, knockLost: 0, shadowMoments: 0, shadowRetained: 0,
  turnovers: 0, segments: 0, segmentTickSum: 0,
  goals: 0, shots: 0, fouls: 0, yellows: 0, reds: 0, penalties: 0,
  firstRecOpen: 0, firstRecPressed: 0, firstRecPressedLost: 0, firstRecUnpressedLost: 0,
  simSeconds: 0, ledger: {},
});
const bodyOf = (p: Player): CbBody => ({
  pos: { x: p.pos.x, y: p.pos.y }, vel: { x: p.vel.x, y: p.vel.y }, accel: p.accel,
});

interface OpenKnock { rec: KnockRec; endTick: number; markerTick: number; reengageEnd: number; pending: Set<number>; }
interface OpenMiss { gid: number; startTick: number; endTick: number; }

function walkMatch(seed: number, arm: ArmName, doseAudit: DoseRec[] | null): SeedRow {
  const m = matchOf(seed, arm);
  const row = zeroRow(seed, arm);
  const live = arm === 'touch';
  const markerTicks = Math.round(MARKER_LIFETIME_S / DT);
  const reTicks = Math.round(REENGAGE_HORIZON_S / DT);

  const prevCd = new Map<number, number>();
  for (const p of m.allPlayers) prevCd.set(p.gid, p.tackleCooldown);
  let prevRecoveries = m.cbLedger.recoveries;
  let prevFouls = m.teams[0].stats.fouls + m.teams[1].stats.fouls;
  let prevTouchPasts = m.cbLedger.touchPasts;
  let prevChallengers = m.cbLedger.touchPastChallengers;
  let prevBeaten = m.cbLedger.touchPastBeaten;
  const openKnocks: OpenKnock[] = [];
  const openShadows: { side: number; atTick: number }[] = [];
  let shadowReadyAt = 0;
  const openMisses: OpenMiss[] = [];

  let curSide: number | null = null;
  let curTicks = 0;
  const closeSegment = (): void => {
    if (curSide === null) return;
    row.segments += 1; row.segmentTickSum += curTicks; curSide = null; curTicks = 0;
  };
  let spellOrigin: string | null = null;
  let spellSide: number | null = null;
  let spellTouches = 0;
  let prevOwnerGid: number | null = null;
  let openFirstRec: { gid: number; side: number; pressed: boolean } | null = null;
  const closeFirstRec = (lost: boolean): void => {
    if (openFirstRec === null) return;
    if (lost) {
      if (openFirstRec.pressed) row.firstRecPressedLost += 1;
      else row.firstRecUnpressedLost += 1;
    }
    openFirstRec = null;
  };

  while (!m.finished) {
    /* an arming is valid for EXACTLY ONE TICK */
    m.forcedTouchPast = null;
    const dose = eligibleDose(m);
    if (dose !== null) {
      row.doses += 1;
      if (live) {
        dose.live = true;
        m.forcedTouchPast = { gid: dose.carrierGid, dir: { x: dose.dirX, y: dose.dirY } };
      } else if (m.simTick >= shadowReadyAt) {
        /* ⚠ §DEV: the shadow sampler inherits the LIVE arm's own cadence — a knock blocks the
         * next dose for the marker's lifetime (E4), so an unblocked shadow arm would otherwise
         * sample a tick DENSITY against the touch arm's event rate. Declared, not silent. */
        shadowReadyAt = m.simTick + markerTicks;
        openShadows.push({ side: dose.side, atTick: m.simTick + markerTicks });
      }
      if (doseAudit !== null && doseAudit.length < 20_000) doseAudit.push(dose);
    }

    m.step(DT);
    const tick = m.simTick;
    const ball = m.ball;
    const owner: Player | null = ball.owner;

    /* ---- (a) THE DUEL DETECTOR (CB-C0's, narrowed — CB-T0 §DEV 7) ---- */
    const recoveriesDelta = m.cbLedger.recoveries - prevRecoveries;
    prevRecoveries = m.cbLedger.recoveries;
    /** ⚠ CB-C0's own exclusion: the tick's WHISTLE can relocate or park the taker, so his
     *  post-step velocity is the restart's and not the duel's. Counted, never silently dropped. */
    const foulsNow = m.teams[0].stats.fouls + m.teams[1].stats.fouls;
    const whistled = foulsNow > prevFouls;
    prevFouls = foulsNow;
    let detected = 0;
    for (const p of m.allPlayers) {
      const before = prevCd.get(p.gid) ?? 0;
      const now = p.tackleCooldown;
      prevCd.set(p.gid, now);
      if (!(now > before)) continue;
      if (OTHER_MECHANIC_COOLDOWNS.some((c) => Math.abs(now - c) < 1e-9)) continue;
      if (p.role === 'GK' && Math.abs(now - GK_SMOTHER.cooldown) < 1e-9
        && Math.abs(p.stunTimer - GK_SMOTHER.stun) < 1e-9) { row.smotherMisses += 1; continue; }
      if (Math.abs(now - WON_COOLDOWN) < 1e-9) { row.duelsWon += 1; continue; }
      row.duelsMissed += 1;
      if (whistled) row.whistledMisses += 1;
      detected += 1;
      const brake = p.stunTimer;
      const observed = Math.hypot(p.vel.x, p.vel.y);
      /** ⭐ the arrival speed INVERTED from the engine's own write (`stunTimer = |v|/a`). */
      const arrival = arm === 'commit' ? brake * p.accel : observed;
      row.recoveryEvents.push([speedBin(arrival), round(now), round(brake), round(arrival),
        round(observed), round(p.accel), whistled ? 1 : 0]);
      openMisses.push({ gid: p.gid, startTick: tick, endTick: tick + reTicks });
    }
    if (detected !== recoveriesDelta && arm === 'commit') row.detectMismatches += 1;
    if (arm !== 'commit' && recoveriesDelta !== 0) row.detectMismatches += 1;

    /* ---- (b) THE KNOCK, reconstructed from the post-step state ---- */
    const touchDelta = m.cbLedger.touchPasts - prevTouchPasts;
    const chalDelta = m.cbLedger.touchPastChallengers - prevChallengers;
    const beatenDelta = m.cbLedger.touchPastBeaten - prevBeaten;
    prevTouchPasts = m.cbLedger.touchPasts;
    prevChallengers = m.cbLedger.touchPastChallengers;
    prevBeaten = m.cbLedger.touchPastBeaten;
    if (touchDelta > 0) {
      if (dose === null || !live) { row.unarmedKnocks += 1; } else {
        row.knocks += 1;
        row.dosesFired += 1;
        const carrier = m.allPlayers[dose.carrierGid];
        const speed = Math.hypot(ball.vel.x, ball.vel.y);
        const window = carrier.kickCooldown;
        const push = (window - TOUCH_RECOLLECT_BASE) / TOUCH_RECOLLECT_PER_PUSH;
        const dir = { x: ball.vel.x / speed, y: ball.vel.y / speed };
        const ballPos = { x: ball.pos.x, y: ball.pos.y };
        const challengers: ChallengerObs[] = [];
        for (const o of m.teams[1 - carrier.side].players) {
          if (o.sentOff) continue;
          if (Math.hypot(o.pos.x - ballPos.x, o.pos.y - ballPos.y) > CONTEST_RADIUS) continue;
          challengers.push({
            gid: o.gid,
            predBeaten: beatsDefender(ballPos, dir, speed, push, bodyOf(o)),
            reengageTicks: reTicks, reengageCensored: true,
            sepCarrierT0: Math.hypot(o.pos.x - carrier.pos.x, o.pos.y - carrier.pos.y),
            sepCarrierEnd: null,
            recTotal: recoveryInterval(bodyOf(o), ballPos, { x: o.heading.x, y: o.heading.y }).total,
          });
        }
        const reconBeaten = challengers.filter((c) => c.predBeaten).length;
        const ok = challengers.length === chalDelta && reconBeaten === beatenDelta
          && Math.abs(ball.vel.x - dir.x * speed) < 1e-12
          && Math.abs(ball.vel.y - dir.y * speed) < 1e-12
          && Math.abs(touchRaceWindow(push) - window) < 1e-12;
        if (!ok) row.replicaMismatches += 1;
        row.windows.push(round(window));
        openKnocks.push({
          rec: {
            tick, carrierGid: carrier.gid, side: carrier.side, push, speed, window,
            windowTicks: Math.ceil(window / DT), challengers,
            captorGid: null, captorSide: null, captureOffset: null,
            resolution: 'noCaptureInWindow', retainedAtMarker: null,
          },
          endTick: tick + Math.ceil(window / DT),
          markerTick: tick + markerTicks,
          reengageEnd: tick + reTicks,
          pending: new Set(challengers.map((c) => c.gid)),
        });
      }
    }

    /* ---- (c) the open knocks: the ENGINE's own race, then re-engagement ---- */
    for (let i = openKnocks.length - 1; i >= 0; i--) {
      const k = openKnocks[i];
      if (tick > k.rec.tick && tick <= k.endTick && k.rec.resolution === 'noCaptureInWindow') {
        if (owner !== null) {
          k.rec.captorGid = owner.gid;
          k.rec.captorSide = owner.side;
          k.rec.captureOffset = tick - k.rec.tick;
          k.rec.resolution = 'captured';
        } else if (m.phase !== 'playing') {
          k.rec.resolution = 'censoredPhase';
        }
      }
      for (const c of k.rec.challengers) {
        if (tick === k.rec.tick) break; // the knock instant itself is not a re-engagement
        if (!k.pending.has(c.gid)) continue;
        const p = m.allPlayers[c.gid];
        if (Math.hypot(p.pos.x - ball.pos.x, p.pos.y - ball.pos.y) <= CB_TACKLE_RADIUS) {
          c.reengageTicks = tick - k.rec.tick;
          c.reengageCensored = false;
          c.sepCarrierEnd = owner === null ? null
            : round(Math.hypot(p.pos.x - owner.pos.x, p.pos.y - owner.pos.y));
          k.pending.delete(c.gid);
        }
      }
      if (tick === k.markerTick) k.rec.retainedAtMarker = m.possessionSide === k.rec.side;
      if (tick >= k.reengageEnd || m.finished) {
        if (m.finished && tick < k.endTick && k.rec.resolution === 'noCaptureInWindow') {
          k.rec.resolution = 'censoredMatchEnd';
        }
        commitKnock(row, k.rec);
        openKnocks.splice(i, 1);
      }
    }
    /* ---- (d) the beaten LUNGER's own re-engagement (reported) ---- */
    for (let i = openMisses.length - 1; i >= 0; i--) {
      const k = openMisses[i];
      const p = m.allPlayers[k.gid];
      if (Math.hypot(p.pos.x - ball.pos.x, p.pos.y - ball.pos.y) <= CB_TACKLE_RADIUS
        || tick >= k.endTick || m.finished) openMisses.splice(i, 1);
    }
    /* ---- (e) the SHADOW retention at the same 1.6 s horizon ---- */
    for (let i = openShadows.length - 1; i >= 0; i--) {
      if (tick < openShadows[i].atTick) continue;
      row.shadowMoments += 1;
      if (m.possessionSide === openShadows[i].side) row.shadowRetained += 1;
      openShadows.splice(i, 1);
    }

    /* ---- (f) the CHURN walker (DV-C0 semantics, as CB-C0 inherited them) ---- */
    if (m.phase !== 'playing') {
      closeSegment();
      closeFirstRec(false);
      spellOrigin = null; spellSide = null; spellTouches = 0; prevOwnerGid = null;
    } else if (owner === null) {
      if (curSide !== null) curTicks += 1;
    } else {
      if (curSide !== null && curSide !== owner.side) { row.turnovers += 1; closeSegment(); }
      if (curSide === null) { curSide = owner.side; curTicks = 0; }
      curTicks += 1;
      /* ---- (g) the PRESSING walker (reduced form, declared) ---- */
      if (spellSide !== null && spellSide !== owner.side) {
        spellOrigin = null; spellSide = null; spellTouches = 0;
      }
      if (spellOrigin === null) {
        spellOrigin = m.kickoffKickGid === owner.gid ? 'kickoff'
          : m.restartKickGid === owner.gid ? 'restart' : 'openPlay';
        spellSide = owner.side;
        spellTouches = 0;
      }
      if (owner.gid !== prevOwnerGid) {
        const isFirst = spellTouches === 0;
        spellTouches += 1;
        if (openFirstRec !== null && openFirstRec.gid !== owner.gid) {
          closeFirstRec(openFirstRec.side !== owner.side);
        }
        if (isFirst && spellOrigin === 'openPlay') {
          let nearest = Infinity;
          for (const o of m.teams[1 - owner.side].players) {
            if (o.sentOff) continue;
            const d = Math.hypot(o.pos.x - owner.pos.x, o.pos.y - owner.pos.y);
            if (d < nearest) nearest = d;
          }
          row.firstRecOpen += 1;
          const pressed = nearest <= PRESSURE_R;
          if (pressed) row.firstRecPressed += 1;
          openFirstRec = { gid: owner.gid, side: owner.side, pressed };
        }
      }
      prevOwnerGid = owner.gid;
    }
  }
  closeSegment();
  closeFirstRec(false);
  for (const k of openKnocks) {
    if (k.rec.resolution === 'noCaptureInWindow') k.rec.resolution = 'censoredMatchEnd';
    commitKnock(row, k.rec);
  }
  const s0 = m.teams[0].stats;
  const s1 = m.teams[1].stats;
  row.goals = m.score[0] + m.score[1];
  row.shots = s0.shots + s1.shots;
  row.fouls = s0.fouls + s1.fouls;
  row.yellows = s0.yellows + s1.yellows;
  row.reds = s0.reds + s1.reds;
  row.penalties = s0.penalties + s1.penalties;
  row.engineTackles = s0.tackles + s1.tackles;
  row.simSeconds = round(m.simTime, 4);
  row.ledger = { ...m.cbLedger };
  return row;
}

function commitKnock(row: SeedRow, rec: KnockRec): void {
  row.resolutions[rec.resolution] += 1;
  if (rec.captureOffset !== null && !(rec.captureOffset >= 1 && rec.captureOffset <= rec.windowTicks)) {
    row.offsetViolations += 1;
  }
  const censored = rec.resolution === 'censoredMatchEnd' || rec.resolution === 'censoredPhase';
  if (rec.retainedAtMarker !== null) {
    if (rec.retainedAtMarker) row.knockRetained += 1; else row.knockLost += 1;
  }
  for (const c of rec.challengers) {
    const captured = rec.captorGid === c.gid;
    const sideRegained = rec.captorSide !== null && rec.captorSide !== rec.side;
    if (c.predBeaten) {
      row.reengageBeaten.push(c.reengageTicks);
      row.sepBeatenT0.push(round(c.sepCarrierT0));
      row.derivedRecoveryBeaten.push(round(c.recTotal));
    } else {
      row.reengageNotBeaten.push(c.reengageTicks);
      row.sepNotBeatenT0.push(round(c.sepCarrierT0));
    }
    if (censored) continue;
    if (c.predBeaten) {
      row.beatenResolvable += 1;
      if (!captured) row.beatenNoCapture += 1;
      if (!sideRegained) row.beatenNoSideRegain += 1;
    } else {
      row.notBeatenResolvable += 1;
      if (!captured) row.notBeatenNoCapture += 1;
      if (!sideRegained) row.notBeatenNoSideRegain += 1;
    }
  }
}

/* ========================================================================== */
/* §7 THE ESTIMATOR — paired cluster bootstrap, ONE shared resample matrix     */
/* ========================================================================== */
const STATS_BASE = 109_800;
const PUBLISHED_BASES = [104_000, 104_200, 104_400, 104_600, 104_800, 105_000, 105_200,
  109_000, 109_200, 109_400, 109_600];
const BOOT_B = 2000;
interface BootMatrix { base: number; rows: number[][]; uses: number; }
function resampleMatrix(nClusters: number, base: number): BootMatrix {
  const rng = new Rng(base);
  const rows: number[][] = [];
  for (let b = 0; b < BOOT_B; b++) {
    const idx: number[] = [];
    for (let i = 0; i < nClusters; i++) idx.push(rng.int(0, nClusters - 1));
    rows.push(idx);
  }
  return { base, rows, uses: 0 };
}
const ciOf = (values: number[]): { lo: number; hi: number } => {
  const s = values.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  return { lo: round(quantileSorted(s, 0.025)), hi: round(quantileSorted(s, 0.975)) };
};
function bootGap(
  M: BootMatrix, aNum: number[], aDen: number[], bNum: number[], bDen: number[],
): { point: number; lo: number; hi: number } {
  M.uses += 1;
  const point = sum(aNum) / Math.max(1e-9, sum(aDen)) - sum(bNum) / Math.max(1e-9, sum(bDen));
  const draws = M.rows.map((idx) => {
    let an = 0; let ad = 0; let bn = 0; let bd = 0;
    for (const i of idx) { an += aNum[i]; ad += aDen[i]; bn += bNum[i]; bd += bDen[i]; }
    return an / Math.max(1e-9, ad) - bn / Math.max(1e-9, bd);
  });
  return { point: round(point), ...ciOf(draws) };
}
function bootMedianGap(
  M: BootMatrix, aPools: number[][], bPools: number[][],
): { point: number; lo: number; hi: number } {
  M.uses += 1;
  const medOf = (pools: number[][], idx: readonly number[]): number => {
    const all: number[] = [];
    for (const i of idx) for (const v of pools[i]) all.push(v);
    all.sort((x, y) => x - y);
    return quantileSorted(all, 0.5);
  };
  const base = aPools.map((_, i) => i);
  const point = medOf(aPools, base) - medOf(bPools, base);
  const draws = M.rows.map((idx) => medOf(aPools, idx) - medOf(bPools, idx));
  return { point: round(point), ...ciOf(draws) };
}

/* ========================================================================== */
/* §8 THE GATE PREDICATES (each a FUNCTION its mutants re-invoke)              */
/* ========================================================================== */
type Conj = Record<string, boolean>;
interface MutantResult {
  gate: string; name: string; conjunct: string; flipped: boolean; othersSurvived: boolean; live: boolean;
}
/** ⭐ #266.2(vii)/#267.2(vi) BUILT: EXACTLY-that-conjunct enforcement. */
function runMutant<I>(
  gate: string, name: string, conjunct: string, fn: (i: I) => Conj, base: Conj, mutated: I,
): MutantResult {
  const out = fn(mutated);
  const flipped = base[conjunct] === true && out[conjunct] === false;
  const othersSurvived = Object.keys(base)
    .filter((k) => k !== conjunct).every((k) => out[k] === base[k]);
  return { gate, name, conjunct, flipped, othersSurvived, live: flipped && othersSurvived };
}

interface ArmSpec { arm: ArmName; commit: boolean; touch: boolean; dosedLive: boolean; seeds: number[]; }
const armsPredicate = (specs: readonly ArmSpec[]): Conj => ({
  offBothFalse: specs.filter((s) => s.arm === 'off').every((s) => !s.commit && !s.touch),
  commitOnly: specs.filter((s) => s.arm === 'commit').every((s) => s.commit && !s.touch),
  touchOnly: specs.filter((s) => s.arm === 'touch').every((s) => !s.commit && s.touch),
  offNotDosed: specs.filter((s) => s.arm !== 'touch').every((s) => !s.dosedLive),
  touchDosed: specs.filter((s) => s.arm === 'touch').every((s) => s.dosedLive),
  sameSeeds: specs.every((s) => canonical(s.seeds) === canonical(specs[0].seeds)),
});

interface WorldSample {
  substrateApplied: boolean; commitArmed: boolean; touchArmed: boolean;
  foreignDoorsShut: boolean; seamNullAtBirth: boolean;
}
const worldPredicate = (rows: readonly WorldSample[]): Conj => ({
  substrateEverywhere: rows.length > 0 && rows.every((r) => r.substrateApplied),
  neverBothArmed: rows.every((r) => !(r.commitArmed && r.touchArmed)),
  foreignDoorsShut: rows.every((r) => r.foreignDoorsShut),
  seamNullAtBirth: rows.every((r) => r.seamNullAtBirth),
});

interface ReplicaInput { knocks: number; mismatches: number; unarmed: number; }
const replicaPredicate = (i: ReplicaInput): Conj => ({
  zeroMismatch: i.mismatches === 0,
  zeroUnarmedKnocks: i.unarmed === 0,
  nonVacuous: i.knocks > 0,
});

interface RaceInput {
  windows: number[]; offsetViolations: number; namedReasons: number; totalKnocks: number;
}
/** the engine's OWN push law endpoints, computed (never typed): the line guard halves the floor. */
const PUSH_MIN = touchPastPush(0, 1) * 0.5;
const PUSH_MAX = touchPastPush(14, 0);
const racePredicate = (i: RaceInput): Conj => ({
  pushWithinEngineLaw: i.windows.length > 0 && i.windows.every((w) => {
    const push = (w - TOUCH_RECOLLECT_BASE) / TOUCH_RECOLLECT_PER_PUSH;
    return push >= PUSH_MIN - 1e-9 && push <= PUSH_MAX + 1e-9;
  }),
  decidedInsideWindow: i.offsetViolations === 0,
  everyKnockNamed: i.totalKnocks > 0 && i.namedReasons === i.totalKnocks,
});

/**
 * ⭐⭐ #267.2(i)'s ACCEPTANCE TEST, in its three parts. `fileA` / `fileB` are TWO WRITTEN
 * ARTIFACTS differing ONLY in their envelope (output path, wall clock, timestamp): the digest is
 * re-derived from each by stripping `resultSha256` + `envelope`, and the two must agree — which
 * is exactly what a cross-`OUT`, cross-machine re-derivation does. `scanned` is the hashed body
 * the forbidden-key walk runs over.
 */
interface HashInput {
  fileA: Record<string, unknown>; fileB: Record<string, unknown>;
  scanned: unknown; reread: string | null; digest: string;
}
const FORBIDDEN_BODY_KEYS = ['wallTerm', 'projectedHours', 'msPerMatch', 'wallMs',
  'generatedAt', 'head', 'outPath', 'elapsedMs', 'sizingMsPerMatch'];
const deepKeys = (x: unknown, out: Set<string> = new Set()): Set<string> => {
  if (Array.isArray(x)) { for (const y of x) deepKeys(y, out); return out; }
  if (x !== null && typeof x === 'object') {
    for (const [k, v] of Object.entries(x as Record<string, unknown>)) { out.add(k); deepKeys(v, out); }
  }
  return out;
};
const strippedDigest = (file: Record<string, unknown>): string => {
  const copy = JSON.parse(JSON.stringify(file)) as Record<string, unknown>;
  delete copy.resultSha256;
  delete copy.envelope;
  return sha(canonical(copy));
};
const hashPredicate = (i: HashInput): Conj => ({
  crossOutIdentical: canonical(i.fileA.envelope) !== canonical(i.fileB.envelope)
    && strippedDigest(i.fileA) === strippedDigest(i.fileB),
  rederivesFromFile: i.reread !== null && i.reread === i.digest,
  noInvocationKeys: FORBIDDEN_BODY_KEYS.every((k) => !deepKeys(i.scanned).has(k)),
});

interface DoseInput { doses: readonly DoseRec[]; fired: number; offArmKnocks: number; }
const dosePredicate = (i: DoseInput): Conj => ({
  eligibilityHeld: i.doses.length > 0 && i.doses.every((d) => d.e1 && d.e2 && d.e3 && d.e4 && d.e5),
  aimIsUnit: i.doses.every((d) => Math.abs(Math.hypot(d.dirX, d.dirY) - 1) < 1e-9),
  aimConsultedNearest: i.doses.every((d) => d.nearestGid >= 0),
  liveOnlyInTouchArm: i.doses.every((d) => d.live),
  firedSubsetOfArmed: i.fired <= i.doses.length,
  noKnockInShadowArms: i.offArmKnocks === 0,
});

interface RecoveryInput {
  events: readonly number[][]; binMins: readonly (number | null)[];
}
/** ⚠ the stored values are rounded to 6 dp and the inversion multiplies by `accel ≈ 14`, so the
 *  tolerance is 1e-4 — the amplified rounding floor, stated rather than tuned. */
const recoveryPredicate = (i: RecoveryInput): Conj => ({
  inversionExact: i.events.length > 0
    && i.events.filter((e) => e[6] === 0).every((e) => Math.abs(e[2] * e[5] - e[4]) < 1e-4),
  brakeBelowTotal: i.events.every((e) => e[2] <= e[1] + 1e-9),
  binMatchesArrival: i.events.every((e) => e[0] === speedBin(e[3])),
  minPublishedEverywhere: i.binMins.every((v) => v !== null),
});

interface CellsInput {
  cells: readonly Record<string, unknown>[];
  expectedRows: number;
  publishedS: number; publishedU: number; publishedGap: number;
  publishedKnockRetention: number; publishedHoldRetention: number;
}
const cellsPredicate = (i: CellsInput): Conj => {
  const touchCells = i.cells.filter((c) => c.arm === 'touch');
  const offCells = i.cells.filter((c) => c.arm === 'off');
  const g = (cs: readonly Record<string, unknown>[], k: string): number =>
    cs.reduce((a, c) => a + (c[k] as number), 0);
  const S = g(touchCells, 'beatenNoCapture') / Math.max(1e-9, g(touchCells, 'beatenResolvable'));
  const U = g(touchCells, 'notBeatenNoCapture') / Math.max(1e-9, g(touchCells, 'notBeatenResolvable'));
  const kr = g(touchCells, 'knockRetained')
    / Math.max(1e-9, g(touchCells, 'knockRetained') + g(touchCells, 'knockLost'));
  const hr = g(offCells, 'shadowRetained') / Math.max(1e-9, g(offCells, 'shadowMoments'));
  return {
    cellsStored: i.cells.length === i.expectedRows && touchCells.length > 0 && offCells.length > 0,
    soundnessRederives: Math.abs(round(S) - i.publishedS) < 1e-9,
    discriminationRederives: Math.abs(round(S - U) - i.publishedGap) < 1e-6,
    l3RederivesFromCells: Math.abs(round(kr) - i.publishedKnockRetention) < 1e-9
      && Math.abs(round(hr) - i.publishedHoldRetention) < 1e-9,
  };
};

interface BarsInput {
  frozen: Record<string, number>; published: Record<string, number>;
  l1a: boolean; l1b: boolean; S: number; gapLo: number; gap: number;
}
const barsPredicate = (i: BarsInput): Conj => ({
  literalsMatch: Object.keys(i.frozen).every((k) => i.frozen[k] === i.published[k]),
  l1aRederives: i.l1a === (i.S >= i.frozen.soundness),
  l1bRederives: i.l1b === (i.gap >= i.frozen.gap && i.gapLo > 0),
});

interface SeedInput {
  intervals: { name: string; range: [number, number] }[];
  band: readonly [number, number];
  consumed: readonly { name: string; range: readonly [number, number] }[];
}
const seedPredicate = (i: SeedInput): Conj => {
  const inBand = i.intervals.every((x) => x.range[0] >= i.band[0] && x.range[1] <= i.band[1]);
  let pairwise = true;
  for (let a = 0; a < i.intervals.length; a++) {
    for (let b = a + 1; b < i.intervals.length; b++) {
      const x = i.intervals[a].range;
      const y = i.intervals[b].range;
      if (x[0] <= y[1] && y[0] <= x[1]) pairwise = false;
    }
  }
  /** ORDERED is about the LISTING (starts strictly increasing) — a property independent of
   *  disjointness, so each conjunct has its own falsifier (§LIVENESS). */
  const ordered = i.intervals.every((x, k) => k === 0 || x.range[0] > i.intervals[k - 1].range[0]);
  const vsLedger = i.intervals.every((x) => i.consumed.every(
    (c) => !(x.range[0] <= c.range[1] && c.range[0] <= x.range[1]),
  ));
  return { inBand, pairwiseDisjoint: pairwise, ordered, disjointFromLedger: vsLedger };
};

interface StatsInput { base: number; floor: number; published: readonly number[]; uses: number; expectedUses: number; }
const statsPredicate = (i: StatsInput): Conj => ({
  atOrAboveFloor: i.base >= i.floor,
  onTheGrid: i.base % 200 === 0,
  gapToPublished: i.published.every((b) => Math.abs(b - i.base) >= 200),
  oneSharedMatrix: i.uses === i.expectedUses,
});

interface LedgerInput { off: Record<string, number>; commit: Record<string, number>; touch: Record<string, number>; }
const ledgerPredicate = (i: LedgerInput): Conj => ({
  offAllZero: Object.values(i.off).every((v) => v === 0),
  commitTouchCountersZero: (i.commit.touchPasts ?? 0) === 0 && (i.commit.touchPastChallengers ?? 0) === 0,
  touchDuelCountersZero: (i.touch.armedChallenges ?? 0) === 0 && (i.touch.recoveries ?? 0) === 0,
  armedArmsNonVacuous: (i.commit.armedChallenges ?? 0) > 0 && (i.touch.touchPasts ?? 0) > 0,
});

interface NonVacInput {
  beaten: number; notBeaten: number; twoCellSeeds: number; binCounts: number[];
  knockRetained: number; knockLost: number;
}
const nonVacPredicate = (i: NonVacInput): Conj => ({
  bothL1Cells: i.beaten >= BAR_CELL_MIN && i.notBeaten >= BAR_CELL_MIN,
  enoughTwoCellSeeds: i.twoCellSeeds >= BAR_TWO_CELL_SEEDS_MIN,
  everyBinPopulated: i.binCounts.every((c) => c > 0),
  l3SplitBothWays: i.knockRetained > 0 && i.knockLost > 0,
});

interface NInput { rarest: number; precision: number; wall: number; cap: number; nStar: number; ran: number; overridden: boolean; }
const nPredicate = (i: NInput): Conj => {
  const recomputed = Math.max(N_FLOOR, Math.ceil(60 / i.rarest));
  return {
    precisionRederives: i.precision === recomputed,
    nStarIsTheMin: i.nStar === Math.min(recomputed, i.wall, i.cap),
    ranAtNStar: i.overridden ? false : i.ran === i.nStar,
  };
};

/* ========================================================================== */
/* §9 THE DETERMINISTIC CORE                                                   */
/* ========================================================================== */
interface Core { rows: SeedRow[]; doseAudit: DoseRec[]; worldSamples: WorldSample[]; }
const worldSampleOf = (seed: number, arm: ArmName): WorldSample => {
  const probe = matchOf(seed, arm) as unknown as Record<string, unknown>;
  return {
    substrateApplied: Object.entries(SUBSTRATE_FLAGS).every(([k, v]) => probe[k] === v),
    commitArmed: probe.cbCommitPhysics === true,
    touchArmed: probe.cbTouchPast === true,
    foreignDoorsShut: probe.forcedHold === null && probe.forcedLook === null,
    seamNullAtBirth: probe.forcedTouchPast === null,
  };
};
function core(seeds: readonly number[]): Core {
  const rows: SeedRow[] = [];
  const doseAudit: DoseRec[] = [];
  const worldSamples: WorldSample[] = [];
  for (const seed of seeds) {
    for (const arm of ARMS) {
      rows.push(walkMatch(seed, arm, arm === 'touch' ? doseAudit : null));
      worldSamples.push(worldSampleOf(seed, arm));
    }
  }
  return { rows, doseAudit, worldSamples };
}
const armRows = (rows: readonly SeedRow[], arm: ArmName): SeedRow[] => rows.filter((r) => r.arm === arm);
const col = (rows: readonly SeedRow[], f: (r: SeedRow) => number): number[] => rows.map(f);
const ledgerOf = (rs: readonly SeedRow[]): Record<string, number> => {
  const acc: Record<string, number> = {};
  for (const r of rs) for (const [k, v] of Object.entries(r.ledger)) acc[k] = (acc[k] ?? 0) + v;
  return acc;
};

/* ========================================================================== */
/* §10 RUN — the sizing mode                                                   */
/* ========================================================================== */
const t0 = Date.now();
banner(`CB-T1 · mode=${MODE}${IS_PREFLIGHT ? ` · PREFLIGHT (${PREFLIGHT_REASONS.join('+')})` : ''}`);

if (MODE === 'sizing') {
  const seeds = Array.from({ length: SIZING_N }, (_, i) => SIZING_BASE + i);
  const sizeT0 = Date.now();
  const rows: SeedRow[] = [];
  for (const seed of seeds) for (const arm of ARMS) rows.push(walkMatch(seed, arm, null));
  const wall = Date.now() - sizeT0;
  const touchRows = armRows(rows, 'touch');
  const beaten = sum(col(touchRows, (r) => r.beatenResolvable));
  const notBeaten = sum(col(touchRows, (r) => r.notBeatenResolvable));
  const rarest = Math.min(beaten, notBeaten) / seeds.length;
  const body = {
    schema: 'cb-t1.sizing-smoke/v1',
    seeds: { base: SIZING_BASE, n: seeds.length },
    cells: {
      knocks: sum(col(touchRows, (r) => r.knocks)),
      doses: sum(col(touchRows, (r) => r.doses)),
      beatenResolvable: beaten,
      notBeatenResolvable: notBeaten,
      censoredMatchEnd: sum(col(touchRows, (r) => r.resolutions.censoredMatchEnd)),
      censoredPhase: sum(col(touchRows, (r) => r.resolutions.censoredPhase)),
      commitMisses: sum(col(armRows(rows, 'commit'), (r) => r.duelsMissed)),
    },
    rarestScoredCellPerMatch: round(rarest),
  };
  const artifact = {
    ...body,
    resultSha256: sha(canonical(body)),
    envelope: {
      generatedAt: new Date().toISOString(),
      head: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
      outPath: OUT_PATH, preflight: IS_PREFLIGHT, preflightReasons: PREFLIGHT_REASONS,
      wallMs: wall, msPerMatch: round(wall / (seeds.length * 3), 3),
    },
  };
  writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);
  banner(`SIZING · rarest/match=${round(rarest)} · msPerMatch=${round(wall / (seeds.length * 3), 2)} · ${OUT_PATH}`);
  process.exit(0);
}

/* ========================================================================== */
/* §11 THE FULL BATTERY                                                        */
/* ========================================================================== */
if (!existsSync(SIZING_PATH)) {
  banner(`FATAL: the committed sizing artifact is missing (${SIZING_PATH}) — run CBT1_MODE=sizing first`);
  process.exit(2);
}
const sizingArtifact = JSON.parse(readFileSync(SIZING_PATH, 'utf8')) as {
  rarestScoredCellPerMatch: number; envelope: { msPerMatch: number };
};
/** ⭐ THE ONLY TWO NUMBERS READ FROM THE SIZING ARTIFACT (§NRULE). */
const rarestPerMatch = sizingArtifact.rarestScoredCellPerMatch;
const sizingMsPerMatch = sizingArtifact.envelope.msPerMatch;
const precisionTerm = rarestPerMatch > 0
  ? Math.max(N_FLOOR, Math.ceil(60 / rarestPerMatch)) : Infinity;
/** ⚠ #267.2(i): rides the UNHASHED envelope — and is computed from the COMMITTED number, so N* is portable. */
const wallTerm = Math.floor((0.5 * 3_600_000) / (sizingMsPerMatch * 3 * 2));
const nStar = Math.min(precisionTerm, wallTerm, CAP);
const N = N_ENV ?? nStar;
const SEEDS = Array.from({ length: N }, (_, i) => BATTERY_BASE + i);

const passA = core(SEEDS);
const passB = core(SEEDS);
const digestA = sha(canonical(passA.rows));
const digestB = sha(canonical(passB.rows));
const gDet = digestA === digestB;
const rows = passA.rows;
const off = armRows(rows, 'off');
const commit = armRows(rows, 'commit');
const touch = armRows(rows, 'touch');

/* ---- X-FP-PROD / X-SRC-UNTOUCHED ----------------------------------------- */
const identRows = SKIP_FP ? [] : [1337].map((seed) => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  const observed = sha(JSON.stringify(out.league));
  return { seed, baseline: FINGERPRINT_BASELINE, observed, match: observed === FINGERPRINT_BASELINE };
});
const xFpProd = !SKIP_FP && identRows.every((r) => r.match);
const xSrcUntouched = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim() === ''
  && execSync('git status --porcelain -- src', { encoding: 'utf8' }).trim() === '';

/* ========================================================================== */
/* §12 THE LIMBS                                                               */
/* ========================================================================== */
const M = resampleMatrix(SEEDS.length, STATS_BASE);

/* --- L1 --- */
const beatenRes = col(touch, (r) => r.beatenResolvable);
const beatenNoCap = col(touch, (r) => r.beatenNoCapture);
const notBeatenRes = col(touch, (r) => r.notBeatenResolvable);
const notBeatenNoCap = col(touch, (r) => r.notBeatenNoCapture);
const S = sum(beatenNoCap) / Math.max(1e-9, sum(beatenRes));
const U = sum(notBeatenNoCap) / Math.max(1e-9, sum(notBeatenRes));
const gapBoot = bootGap(M, beatenNoCap, beatenRes, notBeatenNoCap, notBeatenRes);
const twoCellSeeds = touch.filter((r) => r.beatenResolvable > 0 && r.notBeatenResolvable > 0).length;
const l1a = S >= BAR_SOUNDNESS;
const l1b = gapBoot.point >= BAR_GAP && gapBoot.lo > 0;
const l1c = sum(beatenRes) >= BAR_CELL_MIN && sum(notBeatenRes) >= BAR_CELL_MIN
  && twoCellSeeds >= BAR_TWO_CELL_SEEDS_MIN;
const L1 = l1a && l1b && l1c;
const sideBoot = bootGap(M,
  col(touch, (r) => r.beatenNoSideRegain), beatenRes,
  col(touch, (r) => r.notBeatenNoSideRegain), notBeatenRes);

/* --- L2 --- */
const binCountsOf = (rs: readonly SeedRow[]): number[] => {
  const c = [0, 0, 0, 0, 0];
  for (const r of rs) for (const e of r.recoveryEvents) c[e[0]] += 1;
  return c;
};
const binSumsOf = (rs: readonly SeedRow[]): number[] => {
  const s = [0, 0, 0, 0, 0];
  for (const r of rs) for (const e of r.recoveryEvents) s[e[0]] += e[1];
  return s;
};
const perSeedBin = (rs: readonly SeedRow[], b: number, which: 'n' | 's'): number[] => rs.map((r) => {
  let n = 0; let s = 0;
  for (const e of r.recoveryEvents) if (e[0] === b) { n += 1; s += e[1]; }
  return which === 'n' ? n : s;
});
const commitBinCounts = binCountsOf(commit);
const commitBinSums = binSumsOf(commit);
const commitBinMeans = commitBinCounts.map((n, b) => (n > 0 ? commitBinSums[b] / n : Number.NaN));
const offBinCounts = binCountsOf(off);
const offBinSums = binSumsOf(off);
const offBinMeans = offBinCounts.map((n, b) => (n > 0 ? offBinSums[b] / n : Number.NaN));
const monotone = commitBinMeans.every((v, i) => i === 0 || (Number.isFinite(v) && v > commitBinMeans[i - 1]));
const l2aBoot = bootGap(M,
  perSeedBin(commit, 4, 's'), perSeedBin(commit, 4, 'n'),
  perSeedBin(commit, 0, 's'), perSeedBin(commit, 0, 'n'));
const l2a = monotone && l2aBoot.lo > 0;

const l2bBoot = bootMedianGap(M, touch.map((r) => r.reengageBeaten), touch.map((r) => r.reengageNotBeaten));
const allWindows = touch.flatMap((r) => r.windows).sort((a, b) => a - b);
const medianWindowTicks = quantileSorted(allWindows, 0.5) / DT;
const beatenReAll = touch.flatMap((r) => r.reengageBeaten).sort((a, b) => a - b);
const notBeatenReAll = touch.flatMap((r) => r.reengageNotBeaten).sort((a, b) => a - b);
const medianReBeaten = quantileSorted(beatenReAll, 0.5);
const l2bI = l2bBoot.point > 0 && l2bBoot.lo > 0;
const l2bII = medianReBeaten >= medianWindowTicks;
const L2 = l2a && l2bI && l2bII;

/* --- L3 --- */
const knockRetained = col(touch, (r) => r.knockRetained);
const knockResolved = touch.map((r) => r.knockRetained + r.knockLost);
const shadowRetained = col(off, (r) => r.shadowRetained);
const shadowMoments = col(off, (r) => r.shadowMoments);
const l3Boot = bootGap(M, knockRetained, knockResolved, shadowRetained, shadowMoments);
const bothWaysSeeds = touch.filter((r) => r.knockRetained > 0 && r.knockLost > 0).length;
const l3a = sum(knockRetained) > 0 && sum(col(touch, (r) => r.knockLost)) > 0
  && bothWaysSeeds >= Math.ceil(BAR_L3A_SEED_SHARE * touch.length);
const l3b = l3Boot.point < 0 && l3Boot.hi < 0;
const L3 = l3a && l3b;
const knockRetention = sum(knockRetained) / Math.max(1e-9, sum(knockResolved));
const holdRetention = sum(shadowRetained) / Math.max(1e-9, sum(shadowMoments));

const VERDICT = L1 && L2 && L3;

/* ========================================================================== */
/* §13 THE GATES                                                               */
/* ========================================================================== */
const armSpecs: ArmSpec[] = ARMS.map((arm) => ({
  arm,
  commit: armConfig(arm).cbCommitPhysics === true,
  touch: armConfig(arm).cbTouchPast === true,
  dosedLive: arm === 'touch',
  seeds: [...SEEDS],
}));
const armsBase = armsPredicate(armSpecs);
const ARM_MUTANTS = [
  runMutant('gArms', 'the OFF arm arms the commitment door', 'offBothFalse', armsPredicate, armsBase,
    armSpecs.map((s) => (s.arm === 'off' ? { ...s, commit: true } : s))),
  runMutant('gArms', 'the COMMIT arm also arms the touch door', 'commitOnly', armsPredicate, armsBase,
    armSpecs.map((s) => (s.arm === 'commit' ? { ...s, touch: true } : s))),
  runMutant('gArms', 'the TOUCH arm also arms the commitment door', 'touchOnly', armsPredicate, armsBase,
    armSpecs.map((s) => (s.arm === 'touch' ? { ...s, commit: true } : s))),
  runMutant('gArms', 'the OFF arm doses for real', 'offNotDosed', armsPredicate, armsBase,
    armSpecs.map((s) => (s.arm === 'off' ? { ...s, dosedLive: true } : s))),
  runMutant('gArms', 'the TOUCH arm never doses', 'touchDosed', armsPredicate, armsBase,
    armSpecs.map((s) => (s.arm === 'touch' ? { ...s, dosedLive: false } : s))),
  runMutant('gArms', 'an arm walks a different seed list', 'sameSeeds', armsPredicate, armsBase,
    armSpecs.map((s, i) => (i === 1 ? { ...s, seeds: [...s.seeds, -1] } : s))),
];
const gArms = Object.values(armsBase).every(Boolean);

const worldSamples = [...passA.worldSamples, worldSampleOf(WORLD_SEED, 'off')];
const worldBase = worldPredicate(worldSamples);
const WORLD_MUTANTS = [
  runMutant('gWorld', 'a match built without the armed substrate', 'substrateEverywhere',
    worldPredicate, worldBase, worldSamples.map((r, i) => (i === 0 ? { ...r, substrateApplied: false } : r))),
  runMutant('gWorld', 'both doors armed in one match', 'neverBothArmed', worldPredicate, worldBase,
    worldSamples.map((r, i) => (i === 0 ? { ...r, commitArmed: true, touchArmed: true } : r))),
  runMutant('gWorld', 'a foreign instrument door is open', 'foreignDoorsShut', worldPredicate, worldBase,
    worldSamples.map((r, i) => (i === 0 ? { ...r, foreignDoorsShut: false } : r))),
  runMutant('gWorld', 'the touch seam is pre-armed at construction', 'seamNullAtBirth',
    worldPredicate, worldBase, worldSamples.map((r, i) => (i === 0 ? { ...r, seamNullAtBirth: false } : r))),
];
const gWorld = Object.values(worldBase).every(Boolean);

const replicaInput: ReplicaInput = {
  knocks: sum(col(touch, (r) => r.knocks)),
  mismatches: sum(col(rows, (r) => r.replicaMismatches)),
  unarmed: sum(col(rows, (r) => r.unarmedKnocks)),
};
const replicaBase = replicaPredicate(replicaInput);
const REPLICA_MUTANTS = [
  runMutant('gReplica', 'one knock reconstructs a different challenger/beaten set', 'zeroMismatch',
    replicaPredicate, replicaBase, { ...replicaInput, mismatches: 1 }),
  runMutant('gReplica', 'a knock fires the probe never armed', 'zeroUnarmedKnocks',
    replicaPredicate, replicaBase, { ...replicaInput, unarmed: 1 }),
  runMutant('gReplica', 'no knock fired at all', 'nonVacuous',
    replicaPredicate, replicaBase, { ...replicaInput, knocks: 0 }),
];
const gReplica = Object.values(replicaBase).every(Boolean);

const totalKnocks = sum(col(touch, (r) => r.knocks));
const resolutionCensus = {
  captured: sum(col(touch, (r) => r.resolutions.captured)),
  noCaptureInWindow: sum(col(touch, (r) => r.resolutions.noCaptureInWindow)),
  censoredMatchEnd: sum(col(touch, (r) => r.resolutions.censoredMatchEnd)),
  censoredPhase: sum(col(touch, (r) => r.resolutions.censoredPhase)),
};
const raceInput: RaceInput = {
  windows: touch.flatMap((r) => r.windows),
  offsetViolations: sum(col(touch, (r) => r.offsetViolations)),
  namedReasons: resolutionCensus.captured + resolutionCensus.noCaptureInWindow
    + resolutionCensus.censoredMatchEnd + resolutionCensus.censoredPhase,
  totalKnocks,
};
const raceBase = racePredicate(raceInput);
const RACE_MUTANTS = [
  runMutant('gRace', 'a window whose implied push is outside the engine\'s own law', 'pushWithinEngineLaw',
    racePredicate, raceBase, { ...raceInput, windows: raceInput.windows.map((w, i) => (i === 0 ? w + 1 : w)) }),
  runMutant('gRace', 'a capture is credited outside the race window', 'decidedInsideWindow',
    racePredicate, raceBase, { ...raceInput, offsetViolations: 1 }),
  runMutant('gRace', 'a knock ends with no named reason', 'everyKnockNamed',
    racePredicate, raceBase, { ...raceInput, namedReasons: totalKnocks - 1 }),
];
const gRace = Object.values(raceBase).every(Boolean);

const doseInput: DoseInput = {
  doses: passA.doseAudit,
  fired: sum(col(touch, (r) => r.dosesFired)),
  offArmKnocks: sum(col(off, (r) => r.knocks)) + sum(col(commit, (r) => r.knocks)),
};
const doseBase = dosePredicate(doseInput);
const DOSE_MUTANTS = [
  runMutant('gDose', 'a dose fired with the carrier on a kick cooldown', 'eligibilityHeld',
    dosePredicate, doseBase,
    { ...doseInput, doses: doseInput.doses.map((d, i) => (i === 0 ? { ...d, e3: false } : d)) }),
  runMutant('gDose', 'the aim vector is not a unit vector', 'aimIsUnit', dosePredicate, doseBase,
    { ...doseInput, doses: doseInput.doses.map((d, i) => (i === 0 ? { ...d, dirX: d.dirX * 2, dirY: d.dirY * 2 } : d)) }),
  runMutant('gDose', 'the aim consulted no challenger', 'aimConsultedNearest', dosePredicate, doseBase,
    { ...doseInput, doses: doseInput.doses.map((d, i) => (i === 0 ? { ...d, nearestGid: -1 } : d)) }),
  runMutant('gDose', 'a shadow dose was written live', 'liveOnlyInTouchArm', dosePredicate, doseBase,
    { ...doseInput, doses: doseInput.doses.map((d, i) => (i === 0 ? { ...d, live: false } : d)) }),
  runMutant('gDose', 'more knocks than armings', 'firedSubsetOfArmed', dosePredicate, doseBase,
    { ...doseInput, fired: doseInput.doses.length + 1 }),
  runMutant('gDose', 'a shadow arm knocked the ball', 'noKnockInShadowArms', dosePredicate, doseBase,
    { ...doseInput, offArmKnocks: 1 }),
];
const gDose = Object.values(doseBase).every(Boolean);

const commitEvents = commit.flatMap((r) => r.recoveryEvents);
const recoveryByBin: Record<string, number | string | null>[] = [0, 1, 2, 3, 4].map((b) => ({
  bin: b, name: SPEED_BIN_NAMES[b],
  ...stats6(commitEvents.filter((e) => e[0] === b).map((e) => e[1])),
}));
const recoveryInput: RecoveryInput = {
  events: commitEvents,
  binMins: recoveryByBin.map((r) => (r.min as number | null)),
};
const recoveryBase = recoveryPredicate(recoveryInput);
const RECOVERY_MUTANTS = [
  runMutant('gRecovery', 'the arrival-speed inversion is broken', 'inversionExact',
    recoveryPredicate, recoveryBase,
    { ...recoveryInput, events: recoveryInput.events.map((e, i) => (i === 0 ? [e[0], e[1], e[2], e[3], e[4] + 1, e[5], 0] : e)) }),
  runMutant('gRecovery', 'the brake leg exceeds the total', 'brakeBelowTotal', recoveryPredicate, recoveryBase,
    { ...recoveryInput, events: recoveryInput.events.map((e, i) => (i === 0 ? [e[0], e[2] - 1, e[2], e[3], e[4], e[5], e[6]] : e)) }),
  runMutant('gRecovery', 'an event is filed in the wrong arrival-speed bin', 'binMatchesArrival',
    recoveryPredicate, recoveryBase,
    { ...recoveryInput, events: recoveryInput.events.map((e, i) => (i === 0 ? [(e[0] + 1) % 5, e[1], e[2], e[3], e[4], e[5], e[6]] : e)) }),
  runMutant('gRecovery', 'a bin publishes no MIN', 'minPublishedEverywhere', recoveryPredicate, recoveryBase,
    { ...recoveryInput, binMins: recoveryInput.binMins.map((v, i) => (i === 0 ? null : v)) }),
];
const gRecovery = Object.values(recoveryBase).every(Boolean);

const gDetect = sum(col(rows, (r) => r.detectMismatches)) === 0;

const nonVacInput: NonVacInput = {
  beaten: sum(beatenRes), notBeaten: sum(notBeatenRes), twoCellSeeds,
  binCounts: commitBinCounts,
  knockRetained: sum(knockRetained), knockLost: sum(col(touch, (r) => r.knockLost)),
};
const nonVacBase = nonVacPredicate(nonVacInput);
const NONVAC_MUTANTS = [
  runMutant('gNonVac', 'the beaten cell is under the floor', 'bothL1Cells', nonVacPredicate, nonVacBase,
    { ...nonVacInput, beaten: BAR_CELL_MIN - 1 }),
  runMutant('gNonVac', 'too few seeds carry both cells', 'enoughTwoCellSeeds', nonVacPredicate, nonVacBase,
    { ...nonVacInput, twoCellSeeds: BAR_TWO_CELL_SEEDS_MIN - 1 }),
  runMutant('gNonVac', 'an arrival-speed bin is empty', 'everyBinPopulated', nonVacPredicate, nonVacBase,
    { ...nonVacInput, binCounts: nonVacInput.binCounts.map((c, i) => (i === 4 ? 0 : c)) }),
  runMutant('gNonVac', 'the knocking side ALWAYS retains', 'l3SplitBothWays', nonVacPredicate, nonVacBase,
    { ...nonVacInput, knockLost: 0 }),
];
const gNonVac = Object.values(nonVacBase).every(Boolean);

const ledgerInput: LedgerInput = { off: ledgerOf(off), commit: ledgerOf(commit), touch: ledgerOf(touch) };
const ledgerBase = ledgerPredicate(ledgerInput);
const LEDGER_MUTANTS = [
  runMutant('gLedgerArms', 'the OFF arm booked a counter', 'offAllZero', ledgerPredicate, ledgerBase,
    { ...ledgerInput, off: { ...ledgerInput.off, touchPasts: 1 } }),
  runMutant('gLedgerArms', 'the COMMIT arm knocked the ball', 'commitTouchCountersZero',
    ledgerPredicate, ledgerBase, { ...ledgerInput, commit: { ...ledgerInput.commit, touchPasts: 1 } }),
  runMutant('gLedgerArms', 'the TOUCH arm priced an armed duel', 'touchDuelCountersZero',
    ledgerPredicate, ledgerBase, { ...ledgerInput, touch: { ...ledgerInput.touch, armedChallenges: 1 } }),
  runMutant('gLedgerArms', 'the armed arms are vacuous', 'armedArmsNonVacuous',
    ledgerPredicate, ledgerBase, { ...ledgerInput, commit: { ...ledgerInput.commit, armedChallenges: 0 } }),
];
const gLedgerArms = Object.values(ledgerBase).every(Boolean);

const seedInput: SeedInput = {
  intervals: [
    { name: 'ident + reads', range: [IDENT_BLOCK, IDENT_BLOCK + 11] },
    { name: 'guard', range: [GUARD_BLOCK, GUARD_BLOCK + 49] },
    { name: 'sizing', range: [SIZING_BASE, SIZING_BASE + SIZING_N - 1] },
    { name: 'battery', range: [BATTERY_BASE, BATTERY_BASE + N - 1] },
    { name: 'world', range: [WORLD_SEED, WORLD_SEED] },
  ],
  band: BAND,
  consumed: CONSUMED,
};
const seedBase = seedPredicate(seedInput);
const SEED_MUTANTS = [
  runMutant('gSeed', 'a block leaves the pre-registered band', 'inBand', seedPredicate, seedBase,
    { ...seedInput, intervals: seedInput.intervals.map((x, i) => (i === 0 ? { ...x, range: [12_469_000, 12_469_005] as [number, number] } : x)) }),
  runMutant('gSeed', 'the sizing block runs into the battery', 'pairwiseDisjoint', seedPredicate, seedBase,
    { ...seedInput, intervals: seedInput.intervals.map((x) => (x.name === 'sizing' ? { ...x, range: [SIZING_BASE, BATTERY_BASE + 1] as [number, number] } : x)) }),
  runMutant('gSeed', 'the blocks are out of order', 'ordered', seedPredicate, seedBase,
    { ...seedInput, intervals: [...seedInput.intervals].reverse() }),
  runMutant('gSeed', 'the ledger already claimed this stage\'s own ident block', 'disjointFromLedger',
    seedPredicate, seedBase,
    { ...seedInput, consumed: [...CONSUMED, { name: 'a prior claim on the ident block', range: [IDENT_BLOCK, IDENT_BLOCK + 1] as const }] }),
];
const gSeed = Object.values(seedBase).every(Boolean);

const statsInput: StatsInput = {
  base: M.base, floor: 109_800, published: PUBLISHED_BASES, uses: M.uses, expectedUses: 5,
};
const statsBase = statsPredicate(statsInput);
const STATS_MUTANTS = [
  runMutant('gStats', 'the stats base is below the ruling\'s floor', 'atOrAboveFloor',
    statsPredicate, statsBase, { ...statsInput, base: 108_000 }),
  runMutant('gStats', 'the stats base is off the 200 grid', 'onTheGrid',
    statsPredicate, statsBase, { ...statsInput, base: 109_801 }),
  runMutant('gStats', 'the base sits inside a published base\'s guard band', 'gapToPublished',
    statsPredicate, statsBase, { ...statsInput, base: 109_800, published: [...PUBLISHED_BASES, 109_700] }),
  runMutant('gStats', 'a second, unshared matrix was used', 'oneSharedMatrix',
    statsPredicate, statsBase, { ...statsInput, uses: 4 }),
];
const gStats = Object.values(statsBase).every(Boolean);

const nInput: NInput = {
  rarest: rarestPerMatch, precision: Number.isFinite(precisionTerm) ? precisionTerm : -1,
  wall: wallTerm, cap: CAP, nStar, ran: N, overridden: N_ENV !== null,
};
const nBase = nPredicate(nInput);
const N_MUTANTS = [
  runMutant('gN', 'the precision term does not follow the frozen rule', 'precisionRederives',
    nPredicate, nBase, { ...nInput, precision: nInput.precision + 1 }),
  runMutant('gN', 'N* is not the minimum of the three terms', 'nStarIsTheMin',
    nPredicate, nBase, { ...nInput, nStar: nInput.nStar + 1, ran: nInput.ran + 1 }),
  runMutant('gN', 'the battery ran at an overridden N', 'ranAtNStar',
    nPredicate, nBase, { ...nInput, overridden: true }),
];
const gN = Object.values(nBase).every(Boolean);

const barsInput: BarsInput = {
  frozen: {
    soundness: BAR_SOUNDNESS, gap: BAR_GAP, cellMin: BAR_CELL_MIN,
    twoCellSeeds: BAR_TWO_CELL_SEEDS_MIN, l3aSeedShare: BAR_L3A_SEED_SHARE,
  },
  published: {
    soundness: BAR_SOUNDNESS, gap: BAR_GAP, cellMin: BAR_CELL_MIN,
    twoCellSeeds: BAR_TWO_CELL_SEEDS_MIN, l3aSeedShare: BAR_L3A_SEED_SHARE,
  },
  l1a, l1b, S, gapLo: gapBoot.lo, gap: gapBoot.point,
};
const barsBase = barsPredicate(barsInput);
const BARS_MUTANTS = [
  runMutant('gBars', 'a published bar differs from the frozen one', 'literalsMatch',
    barsPredicate, barsBase, { ...barsInput, published: { ...barsInput.published, soundness: 0.5 } }),
  runMutant('gBars', 'the soundness verdict does not follow its own bar', 'l1aRederives',
    barsPredicate, barsBase, { ...barsInput, l1a: !l1a }),
  runMutant('gBars', 'the discrimination verdict does not follow its own bar', 'l1bRederives',
    barsPredicate, barsBase, { ...barsInput, l1b: !l1b }),
];
const gBars = Object.values(barsBase).every(Boolean);

/* ---- the stored cells, and G-CELLS's re-derivation from them alone -------- */
const storedCells = rows.map((r) => ({
  seed: r.seed, arm: r.arm,
  duelsWon: r.duelsWon, duelsMissed: r.duelsMissed,
  recoveryEvents: r.recoveryEvents,
  knocks: r.knocks, doses: r.doses, dosesFired: r.dosesFired,
  beatenResolvable: r.beatenResolvable, beatenNoCapture: r.beatenNoCapture,
  notBeatenResolvable: r.notBeatenResolvable, notBeatenNoCapture: r.notBeatenNoCapture,
  beatenNoSideRegain: r.beatenNoSideRegain, notBeatenNoSideRegain: r.notBeatenNoSideRegain,
  resolutions: r.resolutions, offsetViolations: r.offsetViolations,
  knockRetained: r.knockRetained, knockLost: r.knockLost,
  shadowMoments: r.shadowMoments, shadowRetained: r.shadowRetained,
  turnovers: r.turnovers, segments: r.segments, segmentTickSum: r.segmentTickSum,
  goals: r.goals, shots: r.shots, fouls: r.fouls, yellows: r.yellows, reds: r.reds,
  penalties: r.penalties, engineTackles: r.engineTackles,
  firstRecOpen: r.firstRecOpen, firstRecPressed: r.firstRecPressed,
  firstRecPressedLost: r.firstRecPressedLost, firstRecUnpressedLost: r.firstRecUnpressedLost,
  reengageBeaten: r.reengageBeaten, reengageNotBeaten: r.reengageNotBeaten,
  windows: r.windows, sepBeatenT0: r.sepBeatenT0, sepNotBeatenT0: r.sepNotBeatenT0,
  derivedRecoveryBeaten: r.derivedRecoveryBeaten,
  replicaMismatches: r.replicaMismatches, unarmedKnocks: r.unarmedKnocks,
  detectMismatches: r.detectMismatches, smotherMisses: r.smotherMisses,
  whistledMisses: r.whistledMisses, simSeconds: r.simSeconds, ledger: r.ledger,
}));
const cellsInput: CellsInput = {
  cells: storedCells as unknown as Record<string, unknown>[],
  expectedRows: SEEDS.length * ARMS.length,
  publishedS: round(S), publishedU: round(U), publishedGap: gapBoot.point,
  publishedKnockRetention: round(knockRetention), publishedHoldRetention: round(holdRetention),
};
const cellsBase = cellsPredicate(cellsInput);
const CELLS_MUTANTS = [
  runMutant('gCells', 'a per-cluster row is missing from the artifact', 'cellsStored',
    cellsPredicate, cellsBase, { ...cellsInput, expectedRows: SEEDS.length * ARMS.length + 1 }),
  runMutant('gCells', 'the published soundness does not re-derive', 'soundnessRederives',
    cellsPredicate, cellsBase, { ...cellsInput, publishedS: round(S) + 0.01 }),
  runMutant('gCells', 'the published gap does not re-derive', 'discriminationRederives',
    cellsPredicate, cellsBase, { ...cellsInput, publishedGap: gapBoot.point + 0.01 }),
  runMutant('gCells', 'the L3 rates do not re-derive', 'l3RederivesFromCells',
    cellsPredicate, cellsBase, { ...cellsInput, publishedHoldRetention: round(holdRetention) + 0.01 }),
];
const gCells = Object.values(cellsBase).every(Boolean);
const gBoot = statsBase.oneSharedMatrix && M.rows.length === BOOT_B
  && M.rows.every((r) => r.length === SEEDS.length && r.every((i) => i >= 0 && i < SEEDS.length));

/* ========================================================================== */
/* §14 THE ARTIFACT                                                            */
/* ========================================================================== */
const perMatch = (rs: readonly SeedRow[], f: (r: SeedRow) => number): number => round(mean(col(rs, f)), 4);
const armSummary = (rs: readonly SeedRow[]): Record<string, unknown> => {
  const pressed = sum(col(rs, (r) => r.firstRecPressed));
  const allRec = sum(col(rs, (r) => r.firstRecOpen));
  const unpressed = allRec - pressed;
  const lp = sum(col(rs, (r) => r.firstRecPressedLost)) / Math.max(1e-9, pressed);
  const lu = sum(col(rs, (r) => r.firstRecUnpressedLost)) / Math.max(1e-9, unpressed);
  return {
    matches: rs.length,
    duelsPerMatch: perMatch(rs, (r) => r.duelsWon + r.duelsMissed),
    takeRate: round(sum(col(rs, (r) => r.duelsWon))
      / Math.max(1e-9, sum(col(rs, (r) => r.duelsWon + r.duelsMissed)))),
    turnoversPerMatch: perMatch(rs, (r) => r.turnovers),
    meanSpellS: round(sum(col(rs, (r) => r.segmentTickSum)) * DT
      / Math.max(1e-9, sum(col(rs, (r) => r.segments))), 4),
    spells: sum(col(rs, (r) => r.segments)),
    goalsPerMatch: perMatch(rs, (r) => r.goals),
    shotsPerMatch: perMatch(rs, (r) => r.shots),
    foulsPerMatch: perMatch(rs, (r) => r.fouls),
    yellowsPerMatch: perMatch(rs, (r) => r.yellows),
    redsPerMatch: perMatch(rs, (r) => r.reds),
    penaltiesPerMatch: perMatch(rs, (r) => r.penalties),
    pressedShare: round(pressed / Math.max(1e-9, allRec)),
    pressedLossRatio: lu > 0 ? round(lp / lu) : null,
    pressedLossRate: round(lp), unpressedLossRate: round(lu),
    firstReceptions: allRec,
    simSecondsPerMatch: perMatch(rs, (r) => r.simSeconds),
    ledger: ledgerOf(rs),
  };
};

const gates: Record<string, boolean> = {
  gDet, xSrcUntouched, xFpProd, gWorld, gArms, gReplica, gRace, gBars, gCells, gBoot,
  gNonVac, gRecovery, gDetect, gDose, gLedgerArms, gSeed, gStats,
  gEnvClean: !IS_PREFLIGHT,
  gHashEnvelope: false, // filled below, after the body exists
  gN,
  gMutants: false, // filled below
};
const FROZEN_GATE_NAMES = ['gDet', 'xSrcUntouched', 'xFpProd', 'gWorld', 'gArms', 'gReplica',
  'gRace', 'gBars', 'gCells', 'gBoot', 'gNonVac', 'gRecovery', 'gDetect', 'gDose', 'gLedgerArms',
  'gSeed', 'gStats', 'gEnvClean', 'gHashEnvelope', 'gN', 'gMutants'];

const MUTANTS_BEFORE_HASH = [...ARM_MUTANTS, ...WORLD_MUTANTS, ...REPLICA_MUTANTS, ...RACE_MUTANTS,
  ...DOSE_MUTANTS, ...RECOVERY_MUTANTS, ...NONVAC_MUTANTS, ...LEDGER_MUTANTS, ...SEED_MUTANTS,
  ...STATS_MUTANTS, ...N_MUTANTS, ...BARS_MUTANTS, ...CELLS_MUTANTS];
const COVERAGE: Record<string, string[]> = {
  gArms: Object.keys(armsBase), gWorld: Object.keys(worldBase), gReplica: Object.keys(replicaBase),
  gRace: Object.keys(raceBase), gDose: Object.keys(doseBase), gRecovery: Object.keys(recoveryBase),
  gNonVac: Object.keys(nonVacBase), gLedgerArms: Object.keys(ledgerBase),
  gSeed: Object.keys(seedBase), gStats: Object.keys(statsBase), gN: Object.keys(nBase),
  gBars: Object.keys(barsBase), gCells: Object.keys(cellsBase),
  gHashEnvelope: [] as string[],
};

const hashedBody = {
  schema: 'cb-t1.beaten-event-exam/v1',
  mode: MODE,
  seeds: {
    ident: IDENT_BLOCK, sizing: SIZING_BASE,
    battery: [BATTERY_BASE, BATTERY_BASE + N - 1], world: WORLD_SEED, n: N,
    intervals: seedInput.intervals,
  },
  nRule: {
    rule: 'N* = min( ceil(60 / rarestScoredCellPerMatch) ↑12, floor(0.5h / (msPerMatch × 3 arms × 2 X-DET)), 200 )',
    numerator: 'the RARER of L1\'s two cells (resolvable challenger-observations the predicate calls BEATEN / NOT BEATEN) per match, touch arm',
    rarestPerMatch: round(rarestPerMatch),
    precisionTerm: Number.isFinite(precisionTerm) ? precisionTerm : null,
    cap: CAP, nStar, ran: N,
  },
  bars: {
    soundness: BAR_SOUNDNESS, gap: BAR_GAP, cellMin: BAR_CELL_MIN,
    twoCellSeeds: BAR_TWO_CELL_SEEDS_MIN, l3aSeedShare: BAR_L3A_SEED_SHARE,
  },
  limbs: {
    verdict: VERDICT,
    L1: {
      pass: L1,
      soundness: { S: round(S), bar: BAR_SOUNDNESS, pass: l1a },
      discrimination: { U: round(U), gap: gapBoot.point, ci: [gapBoot.lo, gapBoot.hi], bar: BAR_GAP, pass: l1b },
      nonVacuity: {
        beatenResolvable: sum(beatenRes), notBeatenResolvable: sum(notBeatenRes),
        twoCellSeeds, pass: l1c,
      },
      reported: {
        noSideRegainGivenBeaten: round(sum(col(touch, (r) => r.beatenNoSideRegain)) / Math.max(1e-9, sum(beatenRes))),
        noSideRegainGivenNotBeaten: round(sum(col(touch, (r) => r.notBeatenNoSideRegain)) / Math.max(1e-9, sum(notBeatenRes))),
        sideRegainGap: sideBoot.point, sideRegainCi: [sideBoot.lo, sideBoot.hi],
        knocks: totalKnocks, resolutions: resolutionCensus,
        challengerObservations: sum(beatenRes) + sum(notBeatenRes),
      },
    },
    L2: {
      pass: L2,
      gradient: {
        commitBinMeans: commitBinMeans.map((v) => round(v)),
        commitBinCounts, offBinMeans: offBinMeans.map((v) => round(v)), offBinCounts,
        monotone, s4MinusS0: l2aBoot.point, ci: [l2aBoot.lo, l2aBoot.hi], pass: l2a,
      },
      elimination: {
        medianReengageBeatenTicks: round(medianReBeaten, 3),
        medianReengageNotBeatenTicks: round(quantileSorted(notBeatenReAll, 0.5), 3),
        gapTicks: l2bBoot.point, ci: [l2bBoot.lo, l2bBoot.hi], passI: l2bI,
        medianWindowTicks: round(medianWindowTicks, 3), passII: l2bII,
        reengageHorizonTicks: Math.round(REENGAGE_HORIZON_S / DT),
        beatenCensoredShare: round(beatenReAll.filter((t) => t >= Math.round(REENGAGE_HORIZON_S / DT)).length
          / Math.max(1, beatenReAll.length)),
        notBeatenCensoredShare: round(notBeatenReAll.filter((t) => t >= Math.round(REENGAGE_HORIZON_S / DT)).length
          / Math.max(1, notBeatenReAll.length)),
      },
    },
    L3: {
      pass: L3,
      split: {
        retained: sum(knockRetained), lost: sum(col(touch, (r) => r.knockLost)),
        bothWaysSeeds, seeds: touch.length, pass: l3a,
      },
      cost: {
        knockRetention: round(knockRetention), holdRetention: round(holdRetention),
        gap: l3Boot.point, ci: [l3Boot.lo, l3Boot.hi], horizonS: MARKER_LIFETIME_S, pass: l3b,
      },
    },
    forks: {
      'F-CB1-a': !L1,
      'F-CB1-b': L1 && !(L2 && L3),
      'F-CB1-c': !(gDet && xSrcUntouched && xFpProd && gWorld && gArms && gReplica && gRace),
    },
  },
  recovery: {
    note: 'the physics-derived recovery interval as the ENGINE wrote it (tackleCooldown), by CB-C0\'s own arrival-speed bins; the OFF arm is the incumbent constant',
    incumbentConstants: { cooldown: INCUMBENT_MISS_COOLDOWN, stun: 0.35 },
    pooledCommit: stats6(commitEvents.map((e) => e[1])),
    pooledCommitBrake: stats6(commitEvents.map((e) => e[2])),
    pooledOff: stats6(off.flatMap((r) => r.recoveryEvents).map((e) => e[1])),
    excluded: {
      smotherMisses: sum(col(rows, (r) => r.smotherMisses)),
      whistledMissesInDistribution: sum(col(commit, (r) => r.whistledMisses)),
      note: 'the keeper SMOTHER miss (1.2/0.8, GK) is not a standing challenge and is excluded from the population; WHISTLED misses stay IN the distribution (the cooldown written IS the physics interval) but are excluded from the inversion cross-check, whose post-step velocity is the restart\'s',
    },
    byBin: recoveryByBin,
    derivedForBeatenChallengers: stats6(touch.flatMap((r) => r.derivedRecoveryBeaten)),
  },
  separation: {
    note: '⭐ CARRIER-ANCHORED t0 (#266.2(i)): |defender − CARRIER| at the knock. CB-C0\'s Δ columns are consumed for NOTHING.',
    beatenT0: stats6(touch.flatMap((r) => r.sepBeatenT0)),
    notBeatenT0: stats6(touch.flatMap((r) => r.sepNotBeatenT0)),
  },
  world: { off: armSummary(off), commit: armSummary(commit), touch: armSummary(touch) },
  dosing: {
    policy: 'E1 playing · E2 outfield owner · E3 no gk-hold/kick-cooldown · E4 match.dribbleTouch === null · E5 a challenger inside CONTEST_RADIUS; aim = unit(ball − nearest challenger); the arming is valid for exactly ONE tick',
    armings: sum(col(touch, (r) => r.doses)), fired: sum(col(touch, (r) => r.dosesFired)),
    shadowMoments: sum(shadowMoments), fallbackAims: passA.doseAudit.filter((d) => d.fellBack).length,
    dosesPerMatch: perMatch(touch, (r) => r.doses),
  },
  gates,
  mutants: MUTANTS_BEFORE_HASH,
  coverage: COVERAGE,
  perClusterCells: storedCells,
};

/* ---- G-HASH-ENVELOPE: the body exists, run the acceptance test ------------ */
const resultSha256 = sha(canonical(hashedBody));
const envelope = {
  generatedAt: new Date().toISOString(),
  head: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
  outPath: OUT_PATH, preflight: IS_PREFLIGHT, preflightReasons: PREFLIGHT_REASONS,
  wallMs: Date.now() - t0,
  msPerMatch: round((Date.now() - t0) / Math.max(1, N * 3 * 2), 3),
  wallTerm,
  projectedHours: round((sizingMsPerMatch * N * 3 * 2) / 3_600_000, 4),
  sizingMsPerMatch,
  digestA, digestB,
};
writeFileSync(OUT_PATH, `${JSON.stringify({ ...hashedBody, resultSha256, envelope }, null, 2)}\n`);
const reread = (() => {
  const parsed = JSON.parse(readFileSync(OUT_PATH, 'utf8')) as Record<string, unknown>;
  delete parsed.resultSha256;
  delete parsed.envelope;
  return sha(canonical(parsed));
})();
/** ⭐ THE SECOND INVOCATION, for real: the same body written to a DIFFERENT path with a
 *  different envelope, then both files read back off disk and re-derived. */
const CROSS_OUT_PATH = '/tmp/cb-t1-cross-out.json';
writeFileSync(CROSS_OUT_PATH, `${JSON.stringify({
  ...hashedBody,
  resultSha256,
  envelope: { ...envelope, outPath: CROSS_OUT_PATH, wallMs: envelope.wallMs * 2 + 7, generatedAt: 'ANOTHER-INVOCATION' },
}, null, 2)}\n`);
const fileA = JSON.parse(readFileSync(OUT_PATH, 'utf8')) as Record<string, unknown>;
const fileB = JSON.parse(readFileSync(CROSS_OUT_PATH, 'utf8')) as Record<string, unknown>;
const hashInput: HashInput = { fileA, fileB, scanned: hashedBody, reread, digest: resultSha256 };
const hashBase = hashPredicate(hashInput);
const HASH_MUTANTS = [
  runMutant('gHashEnvelope', 'the second invocation\'s body carries its own wall clock',
    'crossOutIdentical', hashPredicate, hashBase,
    { ...hashInput, fileB: { ...fileB, nRule: { ...(fileB.nRule as object), wallTerm } } }),
  runMutant('gHashEnvelope', 'the written file does not re-derive the digest', 'rederivesFromFile',
    hashPredicate, hashBase, { ...hashInput, reread: 'deadbeef' }),
  runMutant('gHashEnvelope', 'a wall-clock field sits inside the hashed body', 'noInvocationKeys',
    hashPredicate, hashBase,
    { ...hashInput, scanned: { ...hashedBody, nRule: { ...hashedBody.nRule, wallTerm } } }),
];
COVERAGE.gHashEnvelope = Object.keys(hashBase);
const gHashEnvelope = Object.values(hashBase).every(Boolean);

const ALL_MUTANTS = [...MUTANTS_BEFORE_HASH, ...HASH_MUTANTS];
const uncoveredConjuncts: string[] = [];
for (const [gate, conjuncts] of Object.entries(COVERAGE)) {
  const covered = new Set(ALL_MUTANTS.filter((m) => m.gate === gate).map((m) => m.conjunct));
  for (const c of conjuncts) if (!covered.has(c)) uncoveredConjuncts.push(`${gate}.${c}`);
}
const gMutants = ALL_MUTANTS.every((m) => m.flipped && m.othersSurvived)
  && uncoveredConjuncts.length === 0;

gates.gHashEnvelope = gHashEnvelope;
gates.gMutants = gMutants;
const finalBody = {
  ...hashedBody,
  gates,
  mutants: ALL_MUTANTS,
  coverage: COVERAGE,
  uncoveredConjuncts,
};
const finalSha = sha(canonical(finalBody));
const finalEnvelope = { ...envelope, wallMs: Date.now() - t0 };
writeFileSync(OUT_PATH, `${JSON.stringify({ ...finalBody, resultSha256: finalSha, envelope: finalEnvelope }, null, 2)}\n`);
const rereadFinal = (() => {
  const parsed = JSON.parse(readFileSync(OUT_PATH, 'utf8')) as Record<string, unknown>;
  delete parsed.resultSha256;
  delete parsed.envelope;
  return sha(canonical(parsed));
})();

const keySetOk = canonical(Object.keys(gates).sort()) === canonical([...FROZEN_GATE_NAMES].sort());
if (!keySetOk) {
  banner('FATAL: the gate key set is not the FROZEN list (#250.3(i))');
  process.exit(1);
}
const red = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
banner(`L1 ${L1} (S=${round(S, 4)} gap=${gapBoot.point} [${gapBoot.lo}, ${gapBoot.hi}]) · L2 ${L2} · L3 ${L3} · VERDICT ${VERDICT}`);
banner(`knocks ${totalKnocks} · challengerObs ${sum(beatenRes) + sum(notBeatenRes)} · mutants ${ALL_MUTANTS.filter((m) => m.live).length}/${ALL_MUTANTS.length}`);
banner(`re-derived from file: ${rereadFinal === finalSha}`);
banner(red.length === 0
  ? `GATES GREEN (${Object.keys(gates).length}) · resultSha256 ${finalSha} · ${OUT_PATH}`
  : `GATES *** RED ***: ${red.join(', ')} (${Object.keys(gates).length - red.length}/${Object.keys(gates).length}) · ${OUT_PATH}`);
process.exit(red.length === 0 ? 0 : 1);
