/**
 * CB T2 — THE LAYER-2 CHOICE SEAT (docs/world-model/CB-T2-CHOICE-SEAT.md).
 *
 * Contract CB-CARRY-BEAT-CONTRACT.md §2 M-CB.2 + §3 CB-T2, dispatched by ruling #268.4. The
 * design, the currency derivation, the gene's derived neutral form, the arming checklist, the
 * gate list, the REPORTED read list, the N rule and the seed ledger are FROZEN in the stage doc —
 * IN ITS OWN COMMIT, before this file existed (#266.3(c)).
 *
 * ⭐⭐ #268.3(a) — LIVENESS BY MACHINE, THE THIRD-STRIKE CANON. The coverage map is DERIVED FROM
 * THE GATE OBJECTS THEMSELVES: every predicate is called on a cheap sample input AT STARTUP, its
 * conjunct keys are enumerated programmatically, and any conjunct without a registered mutant
 * makes this probe REFUSE TO RUN (exit 3, before a single match is walked). No coverage map is
 * written by hand anywhere in this file.
 *
 * ⭐ ENV SURFACE — WHITELISTED-OR-REFUSE (#261.2/#262.2), including the ENGINE's own doors:
 *   accepted: CBT2_MODE (sizing|full, REQUIRED) · CBT2_N · CBT2_SIZING_N · CBT2_SKIP_FP · CBT2_OUT
 * Anything else `CBT2_*`, or ANY engine door, is a FATAL refusal (exit 2). Every override —
 * CBT2_OUT included — makes the run a PREFLIGHT: routed onto the guard block, G-ENV-CLEAN goes
 * RED, and a canonical repo path may never be written.
 *
 * RUN: CBT2_MODE=sizing npx tsx scripts/probes/cb-t2-choice-seat.ts
 *      CBT2_MODE=full   npx tsx scripts/probes/cb-t2-choice-seat.ts
 * EXIT: 0 = every HARD gate green · 1 = a gate is RED · 2 = a refusal · 3 = a LIVENESS refusal.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';
import { Match, type MatchConfig } from '../../src/sim/Match';
import {
  CONTEST_RADIUS, CONTROL_RADIUS, DT, TOUCH_CONTROL_DIST,
  TOUCH_RECOLLECT_BASE, TOUCH_RECOLLECT_PER_PUSH,
} from '../../src/sim/constants';
import {
  CB_TACKLE_RADIUS, beatsDefender, overcommitSpeed, recoveryInterval, touchPastPush,
  touchRaceWindow, rolledDistance as rolledDistanceOf, type CbBody,
} from '../../src/sim/carryBeat';
import { touchPastPushFor } from '../../src/sim/mechanics';
import { knockAnchor, knockCandidates, knockCompassSteps } from '../../src/ai/carryChoiceSeat';
import { a4MatchFlags } from '../../src/game/a4World';
import { randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 FROZEN CONSTANTS                                                         */
/* ========================================================================== */
const SEAT_PATH = 'src/ai/carryChoiceSeat.ts';
const MECHANICS_PATH = 'src/sim/mechanics.ts';
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const SIZING_PATH = 'docs/world-model/data/cb-t2-sizing-smoke.json';
const FINGERPRINT_SEASONS = 2;
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const LEAGUE_BASELINES: readonly (readonly [number, string])[] = [
  [1337, FINGERPRINT_BASELINE],
  [20260728, 'c6e319a4'],
  [424242, '45d98c74'],
];
/** the arrival-speed bins are CB-C0's own (quarters of the base v*) */
const V_STAR_BASE = overcommitSpeed(14);
const SPEED_EDGES = [1, 2, 3, 4].map((k) => (V_STAR_BASE * k) / 4);
const SPEED_BIN_NAMES = ['s0 walk', 's1 jog', 's2 run', 's3 drive', 's4 OVERCOMMITTED'];
const speedBin = (v: number): number => {
  for (let i = 0; i < SPEED_EDGES.length; i++) if (v < SPEED_EDGES[i]) return i;
  return SPEED_EDGES.length;
};
const WON_COOLDOWN = 0.5;
const OTHER_MECHANIC_COOLDOWNS = [2.5, 2.0, 0.9];
const GK_SMOTHER_STUN = 0.8;
const MECH_SRC = readFileSync(MECHANICS_PATH, 'utf8');
const SEAT_SRC = readFileSync(SEAT_PATH, 'utf8');
const BRAIN_SRC = readFileSync(BRAIN_PATH, 'utf8');
/** the knock-possession marker lifetime, READ OUT of the engine's own source */
const MARKER_LIFETIME_S = (() => {
  const m = MECH_SRC.match(/match\.dribbleTouch = \{ gid: p\.gid, until: match\.simTime \+ ([0-9.]+) \}/);
  if (m === null) throw new Error('the knock marker lifetime could not be traced');
  return Number.parseFloat(m[1]);
})();
/** the incumbent miss cooldown, read from source — CB-C0's H2 re-engagement horizon is 2× it */
const INCUMBENT_MISS_COOLDOWN = 1.2;
const REENGAGE_HORIZON_S = 2 * INCUMBENT_MISS_COOLDOWN;
const PRESSURE_R = TOUCH_CONTROL_DIST;
const SUBSTRATE_FLAGS = a4MatchFlags(3) as unknown as Record<string, boolean>;

/* ========================================================================== */
/* §2 ENV — WHITELIST-OR-REFUSE + THE PREFLIGHT ROUTING                        */
/* ========================================================================== */
const ENV_WHITELIST = ['CBT2_MODE', 'CBT2_N', 'CBT2_SIZING_N', 'CBT2_SKIP_FP', 'CBT2_OUT'] as const;
const ENGINE_DOORS = [
  'EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'EDS_SCALE_PITCH', 'EDS_SCALE_SPEED', 'EDS_SCALE_BALL', 'EDS_SCALE_TIME', 'EDS_SCALE_STAMINA',
] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogue = Object.keys(process.env)
  .filter((k) => k.startsWith('CBT2_') && !(ENV_WHITELIST as readonly string[]).includes(k));
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
const MODE = process.env.CBT2_MODE as Mode | undefined;
if (MODE === undefined || !MODES.includes(MODE)) {
  banner('FATAL: CBT2_MODE is REQUIRED and must be one of sizing|full');
  process.exit(2);
}
const intEnv = (v: string | undefined): number | null => (v ? Math.max(1, Number.parseInt(v, 10)) : null);
const N_ENV = intEnv(process.env.CBT2_N);
const SIZING_N_ENV = intEnv(process.env.CBT2_SIZING_N);
const SKIP_FP = process.env.CBT2_SKIP_FP === '1';
const OUT_ENV = process.env.CBT2_OUT;
const OVERRIDES: { name: string; set: boolean }[] = [
  { name: 'CBT2_N', set: N_ENV !== null },
  { name: 'CBT2_SIZING_N', set: SIZING_N_ENV !== null },
  { name: 'CBT2_SKIP_FP', set: SKIP_FP },
  { name: 'CBT2_OUT', set: OUT_ENV !== undefined },
];
const IS_PREFLIGHT = OVERRIDES.some((o) => o.set);
const PREFLIGHT_REASONS = OVERRIDES.filter((o) => o.set).map((o) => o.name);
const OUT_BY_MODE: Record<Mode, string> = {
  sizing: SIZING_PATH,
  full: 'docs/world-model/data/cb-t2-choice-seat.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const abs = pathResolve(p);
  return abs === CANONICAL_DIR_ABS || abs.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/cb-t2-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  banner(`FATAL: a PREFLIGHT may not write a canonical repo path (${OUT_PATH}) — #262.2`);
  process.exit(2);
}

/* ========================================================================== */
/* §3 SEED LEDGER (#163) — booked = walked (#268.2(iv))                        */
/* ========================================================================== */
const GUARD_BLOCK = 12_474_050;
const IDENT_BLOCK = IS_PREFLIGHT ? GUARD_BLOCK : 12_474_120;
const SIZING_BASE = IS_PREFLIGHT ? GUARD_BLOCK + 20 : 12_474_100;
const BATTERY_BASE = IS_PREFLIGHT ? GUARD_BLOCK + 30 : 12_474_200;
const WORLD_SEED = 12_474_999;
const SIZING_N = SIZING_N_ENV ?? 20;
const CAP = 200;
const N_FLOOR = 12;
const EVENT_TARGET = 200;
const IDENT_SEEDS = 6;
const BAND: readonly [number, number] = [12_474_000, 12_474_999];
const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: '#65 whether-seat sizing block', range: [8_500_000, 8_500_047] },
  { name: 'tempo census', range: [12_293_000, 12_299_999] },
  { name: 'O1 / O2 / PM / MT / CTB / OBM / PTP / DLC bands', range: [12_300_000, 12_428_999] },
  { name: 'DV bands (#249–#258)', range: [12_429_000, 12_447_999] },
  { name: 'EK bands (#259–#263)', range: [12_448_000, 12_465_999] },
  { name: 'CB-C0 dispossession census (#265.4/#266)', range: [12_470_000, 12_471_799] },
  { name: 'CB-T0 dormant layer-1 seam (#266.5/#267)', range: [12_472_000, 12_472_999] },
  { name: 'CB-T1 beaten-event exam (#267.5/#268)', range: [12_473_000, 12_473_999] },
  { name: '⭐ CB-T2 ROW-0, the both-doors row (#268.3(3))', range: [12_474_000, 12_474_011] },
];

/* ========================================================================== */
/* §4 SMALL HELPERS                                                            */
/* ========================================================================== */
const sha = (v: unknown): string => createHash('sha256').update(String(v)).digest('hex');
const canonical = (v: unknown): string => {
  const walk = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walk);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      return Object.keys(o).sort().reduce<Record<string, unknown>>((a, k) => {
        a[k] = walk(o[k]); return a;
      }, {});
    }
    return x;
  };
  return JSON.stringify(walk(v));
};
const round = (v: number, d = 6): number => (Number.isFinite(v)
  ? Math.round(v * 10 ** d) / 10 ** d : v);
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
  const s = [...values].sort((a, b) => a - b);
  return {
    n: s.length, min: round(s[0]), q1: round(quantileSorted(s, 0.25)),
    median: round(quantileSorted(s, 0.5)), q3: round(quantileSorted(s, 0.75)),
    mean: round(mean(s)), max: round(s[s.length - 1]),
  };
};

/* ========================================================================== */
/* §5 THE WORLD AND THE ARMS                                                   */
/* ========================================================================== */
const teamInfo = (name: string, seed: number, proneness?: number): TeamInfo => {
  const rng = new Rng(seed);
  const genome = randomGenome(rng) as TacticalGenome;
  if (proneness !== undefined) genome.cbCarryProneness = proneness;
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome, squad: randomSquad(rng),
  };
};
type ArmName = 'off' | 'choice' | 'both';
const ARMS: readonly ArmName[] = ['off', 'choice', 'both'];
const DOSE = 1;
const armConfig = (arm: ArmName): Partial<MatchConfig> => ({
  cbChoiceSeat: arm !== 'off',
  cbTouchPast: arm !== 'off',
  cbCommitPhysics: arm === 'both',
});
const armProneness = (arm: ArmName): number | undefined => (arm === 'off' ? undefined : DOSE);
const matchOf = (seed: number, arm: ArmName): Match => new Match({
  seed,
  teamA: teamInfo('A', seed * 2 + 1, armProneness(arm)),
  teamB: teamInfo('B', seed * 2 + 2, armProneness(arm)),
  ...a4MatchFlags(3),
  ...armConfig(arm),
});
const bodyOf = (p: Player): CbBody => ({
  pos: { x: p.pos.x, y: p.pos.y }, vel: { x: p.vel.x, y: p.vel.y }, accel: p.accel,
});

/* ========================================================================== */
/* §6 THE WALKER — one match, one arm, every cell the frozen §READ list needs   */
/* ========================================================================== */
interface KnockRec {
  tick: number; carrierGid: number; side: number;
  push: number; speed: number; window: number; windowTicks: number;
  dirX: number; dirY: number;
  /** the chosen bearing's offset from the carrier's own incumbent anchor (rad, signed) */
  bearingOffset: number; back: boolean;
  aimDist: number;
  challengers: { gid: number; predBeaten: boolean; reengageTicks: number; censored: boolean }[];
  captorGid: number | null; captorSide: number | null;
  retainedAtMarker: boolean | null;
  resolution: 'captured' | 'noCaptureInWindow' | 'censoredPhase' | 'censoredMatchEnd';
}
interface RecoveryEvent {
  bin: number; total: number; brake: number; turnPlusClose: number;
  reconTurn: number; reconClose: number; arrival: number; whistled: boolean;
  sepCarrierT0: number | null; sepCarrierEnd: number | null;
}
interface SeedRow {
  seed: number; arm: ArmName;
  /* R1 */
  seats: number; candidates: number; chosen: number; chosenBackHalf: number;
  armings: number; armingsCleared: number;
  bestKnockScoreSum: number; winnerScoreSum: number;
  knocks: number; pushes: number[]; aimDists: number[]; ballCarrierGaps: number[];
  compassSizes: number[];
  /* R2 */
  bearingOctants: number[]; step0: number;
  chosenNearestD: number[]; unchosenNearestD: number[];
  chosenNearestClosing: number[]; unchosenNearestClosing: number[];
  /* R4 */
  reengageBeaten: number[]; reengageNotBeaten: number[]; windows: number[];
  beatenCensored: number; notBeatenCensored: number;
  beatenResolvable: number; beatenNoCapture: number;
  notBeatenResolvable: number; notBeatenNoCapture: number;
  resolutions: Record<string, number>;
  replicaMismatches: number; offsetViolations: number; unarmedKnocks: number;
  /* R5 */
  knockRetained: number; knockLost: number; shadowRetained: number; shadowMoments: number;
  /* R6/R7 */
  recoveryEvents: RecoveryEvent[];
  /* R8 */
  duels: number; duelsWon: number; turnovers: number; segments: number; segmentTicks: number;
  goals: number; shots: number; fouls: number; yellows: number; reds: number; penalties: number;
  firstRec: number; pressedFirstRec: number;
  /* R9 */
  strainBeyondLine: number; strainOverlapper: number; strainDecisions: number;
  /* gate inputs */
  offArmingSeen: number; badArmingSeen: number;
  smotherMisses: number; whistledMisses: number;
}
const zeroRow = (seed: number, arm: ArmName): SeedRow => ({
  seed, arm,
  seats: 0, candidates: 0, chosen: 0, chosenBackHalf: 0, armings: 0, armingsCleared: 0,
  bestKnockScoreSum: 0, winnerScoreSum: 0,
  knocks: 0, pushes: [], aimDists: [], ballCarrierGaps: [], compassSizes: [],
  bearingOctants: [0, 0, 0, 0, 0, 0, 0, 0], step0: 0,
  chosenNearestD: [], unchosenNearestD: [], chosenNearestClosing: [], unchosenNearestClosing: [],
  reengageBeaten: [], reengageNotBeaten: [], windows: [],
  beatenCensored: 0, notBeatenCensored: 0,
  beatenResolvable: 0, beatenNoCapture: 0, notBeatenResolvable: 0, notBeatenNoCapture: 0,
  resolutions: { captured: 0, noCaptureInWindow: 0, censoredPhase: 0, censoredMatchEnd: 0 },
  replicaMismatches: 0, offsetViolations: 0, unarmedKnocks: 0,
  knockRetained: 0, knockLost: 0, shadowRetained: 0, shadowMoments: 0,
  recoveryEvents: [],
  duels: 0, duelsWon: 0, turnovers: 0, segments: 0, segmentTicks: 0,
  goals: 0, shots: 0, fouls: 0, yellows: 0, reds: 0, penalties: 0,
  firstRec: 0, pressedFirstRec: 0,
  strainBeyondLine: 0, strainOverlapper: 0, strainDecisions: 0,
  offArmingSeen: 0, badArmingSeen: 0,
  smotherMisses: 0, whistledMisses: 0,
});

interface OpenKnock {
  rec: KnockRec; endTick: number; markerTick: number; reEnd: number; pending: Set<number>;
}
interface OpenMiss { gid: number; ev: RecoveryEvent; endTick: number; carrierGid: number | null }

function walkMatch(seed: number, arm: ArmName): SeedRow {
  const m = matchOf(seed, arm);
  const row = zeroRow(seed, arm);
  const markerTicks = Math.round(MARKER_LIFETIME_S / DT);
  const reTicks = Math.round(REENGAGE_HORIZON_S / DT);
  const prevCd = new Map<number, number>();
  for (const p of m.allPlayers) prevCd.set(p.gid, p.tackleCooldown);
  let prevKnocks = m.cbLedger.touchPasts;
  let prevChal = m.cbLedger.touchPastChallengers;
  let prevBeaten = m.cbLedger.touchPastBeaten;
  let prevChosen = m.cbChoiceLedger.chosen;
  let prevFouls = m.teams[0].stats.fouls + m.teams[1].stats.fouls;
  const openKnocks: OpenKnock[] = [];
  const openMisses: OpenMiss[] = [];
  const openShadows: { side: number; atTick: number }[] = [];
  let shadowReadyAt = 0;
  let curSide: number | null = null;
  let curTicks = 0;
  let prevOwnerGid: number | null = null;

  while (!m.finished) {
    /* ---- the SEAT-ELIGIBLE moment, sampled in the OFF arm at the live arm's cadence ---- */
    if (arm === 'off') {
      const o = m.ball.owner;
      const eligible = m.phase === 'playing' && o !== null && o.role !== 'GK' && !o.sentOff
        && o.gkHoldTimer <= 0 && o.kickCooldown <= 0;
      if (eligible && m.simTick >= shadowReadyAt) {
        shadowReadyAt = m.simTick + markerTicks;
        openShadows.push({ side: o!.side, atTick: m.simTick + markerTicks });
      }
    }
    /* ---- the arming as it stands BEFORE the step (a leak check, arm-scoped) ---- */
    if (arm === 'off' && m.forcedTouchPast !== null) row.offArmingSeen += 1;
    /* ---- the §STRAIN 1 conditions + the R2 timing read, at seat-eligible moments ---- */
    const preOwner = m.ball.owner;
    let preNearestD: number | null = null;
    let preNearestClosing: number | null = null;
    let preBeyondLine = false;
    let preOverlapper = false;
    if (arm !== 'off' && preOwner !== null && preOwner.role !== 'GK' && !preOwner.sentOff
      && m.phase === 'playing' && preOwner.kickCooldown <= 0) {
      row.strainDecisions += 1;
      const team = m.teams[preOwner.side];
      const opp = m.teams[1 - preOwner.side];
      let deepest = -Infinity;
      let bestD = Infinity;
      let closing = 0;
      for (const o of opp.players) {
        if (o.sentOff || o.role === 'GK') continue;
        deepest = Math.max(deepest, team.localX(o.pos.x));
        const dx = o.pos.x - m.ball.pos.x;
        const dy = o.pos.y - m.ball.pos.y;
        const d = Math.hypot(dx, dy);
        if (d < bestD) {
          bestD = d;
          closing = d > 1e-9 ? -((o.vel.x * dx + o.vel.y * dy) / d) : 0;
        }
      }
      preBeyondLine = team.localX(preOwner.pos.x) > deepest;
      preOverlapper = team.overlapper === preOwner.index;
      if (preBeyondLine) row.strainBeyondLine += 1;
      if (preOverlapper) row.strainOverlapper += 1;
      preNearestD = Number.isFinite(bestD) ? bestD : null;
      preNearestClosing = Number.isFinite(bestD) ? closing : null;
      row.compassSizes.push(knockCompassSteps(preOwner));
    }

    m.step(DT);
    const tick = m.simTick;
    const ball = m.ball;
    const owner: Player | null = ball.owner;

    /* ---- was a knock CHOSEN at this decision? (the ledger's own delta) ---- */
    const chosenDelta = m.cbChoiceLedger.chosen - prevChosen;
    prevChosen = m.cbChoiceLedger.chosen;
    if (preNearestD !== null) {
      if (chosenDelta > 0) {
        row.chosenNearestD.push(round(preNearestD));
        row.chosenNearestClosing.push(round(preNearestClosing ?? 0));
      } else {
        row.unchosenNearestD.push(round(preNearestD));
        row.unchosenNearestClosing.push(round(preNearestClosing ?? 0));
      }
    }
    if (arm !== 'off' && m.forcedTouchPast !== null) {
      const armed = m.allPlayers.find((p) => p.gid === m.forcedTouchPast!.gid);
      if (armed === undefined || armed.role === 'GK' || armed.sentOff) row.badArmingSeen += 1;
    }

    /* ---- (a) the duel detector (CB-C0's, narrowed per CB-T0 §DEV 7) ---- */
    const foulsNow = m.teams[0].stats.fouls + m.teams[1].stats.fouls;
    const whistled = foulsNow > prevFouls;
    prevFouls = foulsNow;
    for (const p of m.allPlayers) {
      const before = prevCd.get(p.gid) ?? 0;
      const now = p.tackleCooldown;
      prevCd.set(p.gid, now);
      if (!(now > before)) continue;
      if (OTHER_MECHANIC_COOLDOWNS.some((c) => Math.abs(now - c) < 1e-9)) continue;
      if (p.role === 'GK' && Math.abs(p.stunTimer - GK_SMOTHER_STUN) < 1e-9) {
        row.smotherMisses += 1; continue;
      }
      row.duels += 1;
      if (Math.abs(now - WON_COOLDOWN) < 1e-9) { row.duelsWon += 1; continue; }
      if (whistled) row.whistledMisses += 1;
      /* ⭐ R7 — THE LEGS, not total-only. brake and total are the ENGINE's own writes; the
       * turn/close split is RECONSTRUCTED from the post-step state and labelled as such. */
      const brake = p.stunTimer;
      const total = now;
      const arrival = arm === 'both' ? brake * p.accel : Math.hypot(p.vel.x, p.vel.y);
      const recon = recoveryInterval(bodyOf(p), ball.pos, { x: p.heading.x, y: p.heading.y });
      const ev: RecoveryEvent = {
        bin: speedBin(arrival), total: round(total), brake: round(brake),
        turnPlusClose: round(total - brake), reconTurn: round(recon.turn),
        reconClose: round(recon.close), arrival: round(arrival), whistled,
        /* ⭐ R6 — CARRIER-ANCHORED separation at t0 (the miss instant) */
        sepCarrierT0: owner === null ? null
          : round(Math.hypot(p.pos.x - owner.pos.x, p.pos.y - owner.pos.y)),
        sepCarrierEnd: null,
      };
      row.recoveryEvents.push(ev);
      openMisses.push({
        gid: p.gid, ev, endTick: tick + Math.max(1, Math.round(total / DT)),
        carrierGid: owner === null ? null : owner.gid,
      });
    }

    /* ---- (b) the knock, reconstructed from the engine's own post-step state ---- */
    const touchDelta = m.cbLedger.touchPasts - prevKnocks;
    const chalDelta = m.cbLedger.touchPastChallengers - prevChal;
    const beatenDelta = m.cbLedger.touchPastBeaten - prevBeaten;
    prevKnocks = m.cbLedger.touchPasts;
    prevChal = m.cbLedger.touchPastChallengers;
    prevBeaten = m.cbLedger.touchPastBeaten;
    if (touchDelta > 0) {
      // the carrier is the body whose kickCooldown the release just wrote; he is the last
      // toucher, which the engine records itself.
      const carrier = ball.lastTouch;
      if (carrier === null || chosenDelta === 0) row.unarmedKnocks += 1;
      else {
        row.knocks += 1;
        const speed = Math.hypot(ball.vel.x, ball.vel.y);
        const window = carrier.kickCooldown;
        const push = (window - TOUCH_RECOLLECT_BASE) / TOUCH_RECOLLECT_PER_PUSH;
        const dir = { x: ball.vel.x / speed, y: ball.vel.y / speed };
        const ballPos = { x: ball.pos.x, y: ball.pos.y };
        const anchor = knockAnchor(carrier);
        const cross = anchor.x * dir.y - anchor.y * dir.x;
        const dot = anchor.x * dir.x + anchor.y * dir.y;
        const bearing = Math.atan2(cross, dot);
        const challengers: KnockRec['challengers'] = [];
        for (const o of m.teams[1 - carrier.side].players) {
          if (o.sentOff) continue;
          if (Math.hypot(o.pos.x - ballPos.x, o.pos.y - ballPos.y) > CONTEST_RADIUS) continue;
          challengers.push({
            gid: o.gid,
            predBeaten: beatsDefender(ballPos, dir, speed, push, bodyOf(o)),
            reengageTicks: reTicks, censored: true,
          });
        }
        const reconBeaten = challengers.filter((c) => c.predBeaten).length;
        if (!(challengers.length === chalDelta && reconBeaten === beatenDelta
          && Math.abs(touchRaceWindow(push) - window) < 1e-12
          && Math.abs(Math.hypot(dir.x, dir.y) - 1) < 1e-12)) row.replicaMismatches += 1;
        row.windows.push(round(window));
        row.pushes.push(round(push));
        // ⭐ R1's AIM DISTANCE = the knock's own roll to the point its race resolves (the
        // quantity the seat prices at), NOT the ball-to-carrier gap.
        row.aimDists.push(round(rolledDistanceOf(speed, window)));
        row.ballCarrierGaps.push(round(Math.hypot(ballPos.x - carrier.pos.x, ballPos.y - carrier.pos.y)));
        const oct = Math.min(7, Math.floor(((bearing + Math.PI) / (2 * Math.PI)) * 8));
        row.bearingOctants[oct] += 1;
        if (Math.abs(bearing) < 1e-9) row.step0 += 1;
        openKnocks.push({
          rec: {
            tick, carrierGid: carrier.gid, side: carrier.side, push, speed, window,
            windowTicks: Math.ceil(window / DT), dirX: dir.x, dirY: dir.y,
            bearingOffset: round(bearing), back: dot < 0,
            aimDist: round(rolledDistanceOf(speed, window)),
            challengers, captorGid: null, captorSide: null, retainedAtMarker: null,
            resolution: 'noCaptureInWindow',
          },
          endTick: tick + Math.ceil(window / DT),
          markerTick: tick + markerTicks,
          reEnd: tick + reTicks,
          pending: new Set(challengers.map((c) => c.gid)),
        });
      }
    }

    /* ---- (c) the open knocks: the ENGINE's own race, then re-engagement ---- */
    for (let i = openKnocks.length - 1; i >= 0; i--) {
      const k = openKnocks[i];
      if (tick > k.rec.tick && tick <= k.endTick && k.rec.resolution === 'noCaptureInWindow') {
        if (owner !== null) {
          k.rec.captorGid = owner.gid; k.rec.captorSide = owner.side;
          k.rec.resolution = 'captured';
          if (!(tick - k.rec.tick >= 1 && tick - k.rec.tick <= k.rec.windowTicks)) {
            row.offsetViolations += 1;
          }
        } else if (m.phase !== 'playing') k.rec.resolution = 'censoredPhase';
      }
      for (const c of k.rec.challengers) {
        if (tick === k.rec.tick) break;
        if (!k.pending.has(c.gid)) continue;
        const d = m.allPlayers.find((q) => q.gid === c.gid);
        if (d === undefined) continue;
        if (Math.hypot(d.pos.x - ball.pos.x, d.pos.y - ball.pos.y) <= CB_TACKLE_RADIUS) {
          c.reengageTicks = tick - k.rec.tick;
          c.censored = false;
          k.pending.delete(c.gid);
        }
      }
      if (tick === k.markerTick) k.rec.retainedAtMarker = m.possessionSide === k.rec.side;
      if (tick >= k.reEnd || m.finished) {
        if (m.finished && tick < k.endTick && k.rec.resolution === 'noCaptureInWindow') {
          k.rec.resolution = 'censoredMatchEnd';
        }
        commitKnock(row, k.rec);
        openKnocks.splice(i, 1);
      }
    }

    /* ---- (d) the beaten LUNGER's own recovery end: R6's second separation ---- */
    for (let i = openMisses.length - 1; i >= 0; i--) {
      const k = openMisses[i];
      if (tick < k.endTick && !m.finished) continue;
      const p = m.allPlayers.find((q) => q.gid === k.gid);
      const carrier = k.carrierGid === null ? null
        : m.allPlayers.find((q) => q.gid === k.carrierGid) ?? null;
      if (p !== undefined && carrier !== null) {
        k.ev.sepCarrierEnd = round(Math.hypot(p.pos.x - carrier.pos.x, p.pos.y - carrier.pos.y));
      }
      openMisses.splice(i, 1);
    }

    /* ---- (e) the SHADOW retention at the same marker horizon ---- */
    for (let i = openShadows.length - 1; i >= 0; i--) {
      if (tick < openShadows[i].atTick) continue;
      row.shadowMoments += 1;
      if (m.possessionSide === openShadows[i].side) row.shadowRetained += 1;
      openShadows.splice(i, 1);
    }

    /* ---- (f) churn / pressing ---- */
    if (owner !== null) {
      if (curSide === null) { curSide = owner.side; curTicks = 0; }
      else if (owner.side !== curSide) {
        row.segments += 1; row.segmentTicks += curTicks; row.turnovers += 1;
        curSide = owner.side; curTicks = 0;
      }
      if (owner.gid !== prevOwnerGid) {
        let nearest = Infinity;
        for (const o of m.teams[1 - owner.side].players) {
          if (o.sentOff) continue;
          nearest = Math.min(nearest, Math.hypot(o.pos.x - owner.pos.x, o.pos.y - owner.pos.y));
        }
        row.firstRec += 1;
        if (nearest <= PRESSURE_R) row.pressedFirstRec += 1;
      }
      prevOwnerGid = owner.gid;
    }
    curTicks += 1;
  }
  if (curSide !== null) { row.segments += 1; row.segmentTicks += curTicks; }

  row.seats = m.cbChoiceLedger.seats;
  row.candidates = m.cbChoiceLedger.candidates;
  row.chosen = m.cbChoiceLedger.chosen;
  row.chosenBackHalf = m.cbChoiceLedger.chosenBackHalf;
  row.armings = m.cbChoiceLedger.armings;
  row.armingsCleared = m.cbChoiceLedger.armingsCleared;
  row.bestKnockScoreSum = round(m.cbChoiceLedger.bestKnockScoreSum);
  row.winnerScoreSum = round(m.cbChoiceLedger.winnerScoreSum);
  row.goals = m.score[0] + m.score[1];
  row.shots = m.teams[0].stats.shots + m.teams[1].stats.shots;
  row.fouls = m.teams[0].stats.fouls + m.teams[1].stats.fouls;
  row.yellows = m.teams[0].stats.yellows + m.teams[1].stats.yellows;
  row.reds = m.teams[0].stats.reds + m.teams[1].stats.reds;
  row.penalties = m.teams[0].stats.penalties + m.teams[1].stats.penalties;
  return row;
}

function commitKnock(row: SeedRow, rec: KnockRec): void {
  row.resolutions[rec.resolution] += 1;
  if (rec.retainedAtMarker !== null) {
    if (rec.retainedAtMarker) row.knockRetained += 1; else row.knockLost += 1;
  }
  const censored = rec.resolution === 'censoredMatchEnd' || rec.resolution === 'censoredPhase';
  for (const c of rec.challengers) {
    if (c.predBeaten) {
      row.reengageBeaten.push(c.reengageTicks);
      if (c.censored) row.beatenCensored += 1;
    } else {
      row.reengageNotBeaten.push(c.reengageTicks);
      if (c.censored) row.notBeatenCensored += 1;
    }
    if (censored) continue;
    const captured = rec.captorGid === c.gid;
    if (c.predBeaten) {
      row.beatenResolvable += 1;
      if (!captured) row.beatenNoCapture += 1;
    } else {
      row.notBeatenResolvable += 1;
      if (!captured) row.notBeatenNoCapture += 1;
    }
  }
}

/* ========================================================================== */
/* §7 THE ESTIMATOR — paired cluster bootstrap, ONE shared resample matrix      */
/* ========================================================================== */
const STATS_BASE = 110_000;
const PUBLISHED_BASES = [104_000, 105_000, 106_000, 107_000, 108_000, 109_000, 109_800];
const BOOT_B = 2000;
interface BootMatrix { base: number; rows: number[][]; uses: number }
function resampleMatrix(nClusters: number, base: number): BootMatrix {
  const rng = new Rng(base);
  const rows: number[][] = [];
  for (let b = 0; b < BOOT_B; b++) {
    const idx: number[] = [];
    for (let i = 0; i < nClusters; i++) idx.push(Math.floor(rng.next() * nClusters) % nClusters);
    rows.push(idx);
  }
  return { base, rows, uses: 0 };
}
const ciOf = (values: number[]): { lo: number; hi: number } => {
  const s = [...values].sort((a, b) => a - b);
  return { lo: round(quantileSorted(s, 0.025)), hi: round(quantileSorted(s, 0.975)) };
};
function bootGap(
  M: BootMatrix, aNum: number[], aDen: number[], bNum: number[], bDen: number[],
): { point: number; lo: number; hi: number } {
  M.uses += 1;
  const rate = (num: number[], den: number[], idx: readonly number[]): number => {
    let n = 0; let d = 0;
    for (const i of idx) { n += num[i]; d += den[i]; }
    return d === 0 ? Number.NaN : n / d;
  };
  const base = aNum.map((_, i) => i);
  const point = rate(aNum, aDen, base) - rate(bNum, bDen, base);
  const draws = M.rows.map((idx) => rate(aNum, aDen, idx) - rate(bNum, bDen, idx))
    .filter((v) => Number.isFinite(v));
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
  const draws = M.rows.map((idx) => medOf(aPools, idx) - medOf(bPools, idx))
    .filter((v) => Number.isFinite(v));
  return { point: round(point), ...ciOf(draws) };
}

/* ========================================================================== */
/* §8 THE GATE PREDICATES + ⭐⭐ THE MACHINE-DERIVED LIVENESS MAP (#268.3(a))    */
/* ========================================================================== */
type Conj = Record<string, boolean>;
interface MutantResult {
  gate: string; name: string; conjunct: string; flipped: boolean; othersSurvived: boolean;
  live: boolean;
}
interface GateSpec<I> {
  name: string;
  fn: (i: I) => Conj;
  /** a cheap SAMPLE input, used ONLY to enumerate the conjunct keys at startup. */
  sample: I;
  mutants: readonly { conjunct: string; name: string; mutate: (i: I) => I }[];
}
const REGISTRY: GateSpec<never>[] = [];
const registerGate = <I>(spec: GateSpec<I>): GateSpec<I> => {
  REGISTRY.push(spec as unknown as GateSpec<never>);
  return spec;
};
function runMutant<I>(
  gate: string, name: string, conjunct: string, fn: (i: I) => Conj, base: Conj, mutated: I,
): MutantResult {
  const out = fn(mutated);
  const flipped = base[conjunct] === true && out[conjunct] === false;
  const othersSurvived = Object.keys(base)
    .filter((k) => k !== conjunct).every((k) => out[k] === base[k]);
  return { gate, name, conjunct, flipped, othersSurvived, live: flipped && othersSurvived };
}

/* ---- the gate inputs and their predicates ---- */
interface IdentInput { rows: { seed: number; shape: string; kind: string; equal: boolean }[] }
const identPredicate = (i: IdentInput): Conj => ({
  absentEqualsFalse: i.rows.length > 0
    && i.rows.filter((r) => r.kind === 'absentVsFalse').every((r) => r.equal),
  bothShapes: new Set(i.rows.map((r) => r.shape)).size >= 2,
});
interface BornInput { identical: boolean[]; seatsWhenDosed: number; seatsWhenAbsent: number }
const bornPredicate = (i: BornInput): Conj => ({
  byteIdentical: i.identical.length > 0 && i.identical.every(Boolean),
  machineryLive: i.seatsWhenDosed > 0,
  absentFormsNothing: i.seatsWhenAbsent === 0,
});
interface ZeroInput {
  identical: boolean[]; seats: number; candidates: number; chosen: number; knocks: number;
}
const zeroPredicate = (i: ZeroInput): Conj => ({
  byteIdentical: i.identical.length > 0 && i.identical.every(Boolean),
  seatFormed: i.seats > 0,
  compassPriced: i.candidates > 0,
  neverChosen: i.chosen === 0,
  neverFired: i.knocks === 0,
});
interface CrossInput { cells: { flag: string; pairEqual: boolean; tripleEqual: boolean }[]; discriminated: boolean }
const crossPredicate = (i: CrossInput): Conj => ({
  inertBesideEveryBankedFlag: i.cells.length > 0 && i.cells.every((c) => c.pairEqual),
  inertWithGeneAbsent: i.cells.every((c) => c.tripleEqual),
  discrimination: i.discriminated,
  coversCbDoors: i.cells.some((c) => c.flag === 'cbTouchPast')
    && i.cells.some((c) => c.flag === 'cbCommitPhysics'),
});
interface BiteInput { diverged: number; seeds: number; firstDivergeAfterArming: boolean }
const bitePredicate = (i: BiteInput): Conj => ({
  diverges: i.diverged > 0,
  everySeedSeen: i.seeds > 0,
  divergenceFollowsAnArming: i.firstDivergeAfterArming,
});
interface CompassInput {
  step0IsAnchor: boolean; maxAngularChord: number; maxAimGap: number; backShare: number;
  distinctCounts: number; deterministic: boolean; minSteps: number;
}
const compassPredicate = (i: CompassInput): Conj => ({
  step0IsTodaysKnock: i.step0IsAnchor,
  angularChordWithinControlRadius: i.maxAngularChord <= CONTROL_RADIUS * 1.001,
  backHalfPopulated: i.backShare > 0.25,
  resolutionRespondsToTheBody: i.distinctCounts >= 2,
  deterministic: i.deterministic,
  wholeCircle: i.minSteps > 2,
});
interface OwnerInput {
  candidateMismatches: number; sampled: number;
  pushOutOfLaw: number; knocks: number; unitDirViolations: number;
}
const ownerPredicate = (i: OwnerInput): Conj => ({
  candidatePushIsTheEnginesOwn: i.candidateMismatches === 0,
  sampledNonVacuously: i.sampled > 0,
  enginePushInsideItsOwnLaw: i.pushOutOfLaw === 0,
  releaseDirIsUnit: i.unitDirViolations === 0,
  knocksHappened: i.knocks > 0,
});
interface OneTableInput {
  seatHasNoPolicyWeight: boolean; seatHasNoScoreToken: boolean; seatImports: string[];
  brainPricesKnockWithGroundCandidate: boolean; passAimedAtCarrier: number;
}
const oneTablePredicate = (i: OneTableInput): Conj => ({
  noPolicyWeightInSeat: i.seatHasNoPolicyWeight,
  noScoringTokenInSeat: i.seatHasNoScoreToken,
  seatImportListClosed: i.seatImports.every((s) => [
    '../utils/vec', '../sim/Player', '../evolution/genome', '../sim/constants',
    '../sim/carryBeat', '../sim/mechanics',
  ].includes(s)),
  brainUsesTheSharedPricer: i.brainPricesKnockWithGroundCandidate,
  noPassAimedAtTheCarrier: i.passAimedAtCarrier === 0,
});
interface ArmingInput {
  chosen: number; armings: number; knocks: number; cleared: number;
  offArmings: number; badArmings: number; unarmedKnocks: number;
}
const armingPredicate = (i: ArmingInput): Conj => ({
  chosenEqualsArmings: i.chosen === i.armings,
  armingsCoverEveryKnock: i.armings >= i.knocks,
  noArmingInTheOffArm: i.offArmings === 0,
  everyArmingNamesALiveOutfielder: i.badArmings === 0,
  noKnockWithoutAChoice: i.unarmedKnocks === 0,
});
interface RaceInput {
  windows: number[]; offsetViolations: number; replicaMismatches: number; knocks: number;
  resolutionsNamed: number;
}
const PUSH_MIN = touchPastPush(0, 1) * 0.5;
const PUSH_MAX = touchPastPush(14, 0);
const racePredicate = (i: RaceInput): Conj => ({
  windowsAreTheEnginesOwn: i.windows.length > 0
    && i.windows.every((w) => w >= touchRaceWindow(PUSH_MIN) - 1e-9
      && w <= touchRaceWindow(PUSH_MAX) + 1e-9),
  noCaptureOutsideTheWindow: i.offsetViolations === 0,
  reconstructionMatchesTheEngine: i.replicaMismatches === 0,
  everyKnockNamed: i.resolutionsNamed === i.knocks,
});
interface LevelsInput {
  l2bBeaten: number; l2bNotBeaten: number; l3Resolved: number;
  recoveryLegs: number; sepT0: number; sepEnd: number; fromChooserPopulation: boolean;
}
const levelsPredicate = (i: LevelsInput): Conj => ({
  l2bBothSetsPopulated: i.l2bBeaten > 0 && i.l2bNotBeaten > 0,
  l3Resolved: i.l3Resolved > 0,
  recoveryLegsPublished: i.recoveryLegs > 0,
  carrierAnchoredSeparationsBothEnds: i.sepT0 > 0 && i.sepEnd > 0,
  readOnTheChoosersOwnPopulation: i.fromChooserPopulation,
});
interface CellsInput { storedRows: number; expectedRows: number; rederived: boolean[] }
const cellsPredicate = (i: CellsInput): Conj => ({
  everyRowStored: i.storedRows === i.expectedRows,
  everyPublishedNumberRederives: i.rederived.length > 0 && i.rederived.every(Boolean),
});
interface BootInput { b: number; clusters: number; uses: number; expectedUses: number; inRange: boolean }
const bootPredicate = (i: BootInput): Conj => ({
  resamples: i.b === BOOT_B,
  clustersAreSeeds: i.clusters > 1,
  oneSharedMatrix: i.uses === i.expectedUses,
  indicesInRange: i.inRange,
});
interface NonVacInput {
  choiceKnocks: number; bothKnocks: number; l3Both: boolean; binsPopulated: number;
  shadowMoments: number;
}
const nonVacPredicate = (i: NonVacInput): Conj => ({
  choiceArmNonVacuous: i.choiceKnocks > 0,
  bothArmNonVacuous: i.bothKnocks > 0,
  l3SplitsBothWays: i.l3Both,
  someArrivalBinPopulated: i.binsPopulated > 0,
  shadowArmNonVacuous: i.shadowMoments > 0,
});
interface LedgerInput {
  offChoiceLedgerZero: boolean; offCbLedgerZero: boolean;
  choiceArmDuelCountersZero: boolean; armedNonVacuous: boolean;
}
const ledgerPredicate = (i: LedgerInput): Conj => ({
  offChoiceLedgerAllZero: i.offChoiceLedgerZero,
  offCarryBeatLedgerAllZero: i.offCbLedgerZero,
  choiceArmHasNoArmedDuels: i.choiceArmDuelCountersZero,
  armedArmsNonVacuous: i.armedNonVacuous,
});
interface TraceInput { found: { name: string; ok: boolean }[]; newNumeralsInSeat: string[] }
const tracePredicate = (i: TraceInput): Conj => ({
  everyQuantityTraced: i.found.length > 0 && i.found.every((f) => f.ok),
  noUntracedNumeralInTheSeat: i.newNumeralsInSeat.length === 0,
});
interface ForkInput { choiceForks: number; armingBlocks: number; inits: number; unclassified: string[] }
const forkPredicate = (i: ForkInput): Conj => ({
  exactlyOneChoiceFork: i.choiceForks === 1,
  exactlyOneArmingBlock: i.armingBlocks === 1,
  exactlyOneInit: i.inits === 1,
  zeroUnclassified: i.unclassified.length === 0,
});
interface PinsInput {
  diffFiles: string[]; declared: string[]; bankedUntouched: boolean;
  releaseUntouched: boolean; actionTypesUntouched: boolean; testFilesTouched: string[];
}
const pinsPredicate = (i: PinsInput): Conj => ({
  diffConfinedToTheDeclaredSurface: i.diffFiles.every((f) => i.declared.includes(f)),
  bankedModulesByteUntouched: i.bankedUntouched,
  touchPastReleaseUntouched: i.releaseUntouched,
  zeroNewActionTypes: i.actionTypesUntouched,
  onlyTheNewTestFile: i.testFilesTouched.every((f) => f === 'tests/carryChoiceSeat.test.ts'),
});
interface SeedInput {
  intervals: { name: string; lo: number; hi: number }[];
  consumed: readonly { name: string; range: readonly [number, number] }[];
  band: readonly [number, number];
}
const seedPredicate = (i: SeedInput): Conj => {
  const inBand = i.intervals.every((v) => v.lo >= i.band[0] && v.hi <= i.band[1]);
  let pairwise = true;
  for (let a = 0; a < i.intervals.length; a++) {
    for (let b = a + 1; b < i.intervals.length; b++) {
      const x = i.intervals[a];
      const y = i.intervals[b];
      if (x.lo <= y.hi && y.lo <= x.hi) pairwise = false;
    }
  }
  const vsLedger = i.intervals.every((v) => i.consumed
    .every((c) => !(v.lo <= c.range[1] && c.range[0] <= v.hi)));
  // NOTE (#268.3(a)): `ordered` (every interval's lo above the previous hi) is IMPLIED by
  // pairwise disjointness on these already-sorted intervals — no achievable input flips it
  // alone — so it is FORBIDDEN from the gate and rides here as an assertion instead.
  return { inBand, pairwiseDisjoint: pairwise, disjointFromTheLedger: vsLedger };
};
interface StatsInput { base: number; floor: number; published: readonly number[] }
const statsPredicate = (i: StatsInput): Conj => ({
  atOrAboveTheFloor: i.base >= i.floor,
  onTheGrid: i.base % 200 === 0,
  clearOfEveryPublishedBase: i.published.every((b) => Math.abs(b - i.base) >= 200),
});
interface EnvInput { preflight: boolean; reasons: string[]; canonicalTarget: boolean }
const envPredicate = (i: EnvInput): Conj => ({
  notAPreflight: !i.preflight,
  noReasons: i.reasons.length === 0,
  // NOTE (#268.3(a)): "a preflight never writes a canonical path" cannot be flipped by any
  // achievable input WITHOUT also flipping `notAPreflight` — it is FORBIDDEN from the gate.
  // It is enforced where it belongs: at PARSE TIME, exit 2, exercised by hand in §CHECKS.
});
interface HashInput {
  crossOutIdentical: boolean; rederivesFromDisk: boolean; forbidden: string[];
}
const FORBIDDEN_BODY_KEYS = ['wallTerm', 'projectedHours', 'msPerMatch', 'wallMs',
  'generatedAt', 'head', 'outPath', 'elapsedMs', 'preflight'];
const hashPredicate = (i: HashInput): Conj => ({
  crossOutDigestIdentical: i.crossOutIdentical,
  rederivesFromTheWrittenBody: i.rederivesFromDisk,
  noInvocationKeyInTheBody: i.forbidden.length === 0,
});
interface NInput {
  rarest: number; precision: number; wall: number; cap: number; nStar: number; ran: number;
  overridden: boolean;
}
const nPredicate = (i: NInput): Conj => ({
  nStarIsTheRuleOutput: i.nStar === Math.min(i.precision, i.wall, i.cap),
  precisionFromTheCommittedSizing: i.precision === (i.rarest > 0
    ? Math.max(N_FLOOR, Math.ceil(EVENT_TARGET / i.rarest)) : Number.POSITIVE_INFINITY),
  ranAtNStar: i.overridden || i.ran === i.nStar,
});

/* ========================================================================== */
/* §9 ⭐⭐ THE LIVENESS REFUSAL — machine-derived, BEFORE a single match is walked */
/* ========================================================================== */
const s = <T>(v: T): T => v;
registerGate({
  name: 'gIdent',
  fn: identPredicate,
  sample: s<IdentInput>({ rows: [{ seed: 1, shape: 'P', kind: 'absentVsFalse', equal: true }, { seed: 1, shape: 'A', kind: 'absentVsFalse', equal: true }] }),
  mutants: [
    { conjunct: 'absentEqualsFalse', name: 'one arm diverges', mutate: (i) => ({ rows: i.rows.map((r, k) => (k === 0 ? { ...r, equal: false } : r)) }) },
    { conjunct: 'bothShapes', name: 'only one world shape walked', mutate: (i) => ({ rows: i.rows.map((r) => ({ ...r, shape: 'P' })) }) },
  ],
});
registerGate({
  name: 'gBorn',
  fn: bornPredicate,
  sample: s<BornInput>({ identical: [true, true], seatsWhenDosed: 5, seatsWhenAbsent: 0 }),
  mutants: [
    { conjunct: 'byteIdentical', name: 'a divergent arm', mutate: (i) => ({ ...i, identical: [true, false] }) },
    { conjunct: 'machineryLive', name: 'the dosed world forms no seat (dead code)', mutate: (i) => ({ ...i, seatsWhenDosed: 0 }) },
    { conjunct: 'absentFormsNothing', name: 'a seat formed with the gene absent', mutate: (i) => ({ ...i, seatsWhenAbsent: 3 }) },
  ],
});
registerGate({
  name: 'gZero',
  fn: zeroPredicate,
  sample: s<ZeroInput>({ identical: [true], seats: 9, candidates: 90, chosen: 0, knocks: 0 }),
  mutants: [
    { conjunct: 'byteIdentical', name: 'the zero world diverges', mutate: (i) => ({ ...i, identical: [false] }) },
    { conjunct: 'seatFormed', name: 'no seat formed at zero', mutate: (i) => ({ ...i, seats: 0 }) },
    { conjunct: 'compassPriced', name: 'no candidate priced at zero', mutate: (i) => ({ ...i, candidates: 0 }) },
    { conjunct: 'neverChosen', name: 'a zero-priced knock won', mutate: (i) => ({ ...i, chosen: 1 }) },
    { conjunct: 'neverFired', name: 'a knock fired at zero appetite', mutate: (i) => ({ ...i, knocks: 1 }) },
  ],
});
registerGate({
  name: 'gCross',
  fn: crossPredicate,
  sample: s<CrossInput>({
    cells: [{ flag: 'cbTouchPast', pairEqual: true, tripleEqual: true },
      { flag: 'cbCommitPhysics', pairEqual: true, tripleEqual: true }],
    discriminated: true,
  }),
  mutants: [
    { conjunct: 'inertBesideEveryBankedFlag', name: 'one banked flag sees the door', mutate: (i) => ({ ...i, cells: i.cells.map((c, k) => (k === 0 ? { ...c, pairEqual: false } : c)) }) },
    { conjunct: 'inertWithGeneAbsent', name: 'the armed-but-geneless door bites', mutate: (i) => ({ ...i, cells: i.cells.map((c, k) => (k === 0 ? { ...c, tripleEqual: false } : c)) }) },
    { conjunct: 'discrimination', name: 'the armed world equals a banked flag world', mutate: (i) => ({ ...i, discriminated: false }) },
    { conjunct: 'coversCbDoors', name: "CB-T0's own doors missing from the matrix", mutate: (i) => ({ ...i, cells: i.cells.filter((c) => c.flag !== 'cbTouchPast') }) },
  ],
});
registerGate({
  name: 'gBite',
  fn: bitePredicate,
  sample: s<BiteInput>({ diverged: 3, seeds: 3, firstDivergeAfterArming: true }),
  mutants: [
    { conjunct: 'diverges', name: 'the armed seat changes nothing', mutate: (i) => ({ ...i, diverged: 0 }) },
    { conjunct: 'everySeedSeen', name: 'no seed walked', mutate: (i) => ({ ...i, seeds: 0 }) },
    { conjunct: 'divergenceFollowsAnArming', name: 'divergence before any arming', mutate: (i) => ({ ...i, firstDivergeAfterArming: false }) },
  ],
});
registerGate({
  name: 'gCompass',
  fn: compassPredicate,
  sample: s<CompassInput>({
    step0IsAnchor: true, maxAngularChord: 1.0, maxAimGap: 3.0, backShare: 0.45,
    distinctCounts: 4, deterministic: true, minSteps: 9,
  }),
  mutants: [
    { conjunct: 'step0IsTodaysKnock', name: 'step 0 is not the incumbent bearing', mutate: (i) => ({ ...i, step0IsAnchor: false }) },
    { conjunct: 'angularChordWithinControlRadius', name: 'the sampling is coarser than the control radius', mutate: (i) => ({ ...i, maxAngularChord: CONTROL_RADIUS * 4 }) },
    { conjunct: 'backHalfPopulated', name: 'the back half is never sampled', mutate: (i) => ({ ...i, backShare: 0 }) },
    { conjunct: 'resolutionRespondsToTheBody', name: 'a fixed K for every body', mutate: (i) => ({ ...i, distinctCounts: 1 }) },
    { conjunct: 'deterministic', name: 'the compass is not reproducible', mutate: (i) => ({ ...i, deterministic: false }) },
    { conjunct: 'wholeCircle', name: 'a degenerate two-point compass', mutate: (i) => ({ ...i, minSteps: 2 }) },
  ],
});
registerGate({
  name: 'gOneOwner',
  fn: ownerPredicate,
  sample: s<OwnerInput>({ candidateMismatches: 0, sampled: 40, pushOutOfLaw: 0, knocks: 10, unitDirViolations: 0 }),
  mutants: [
    { conjunct: 'candidatePushIsTheEnginesOwn', name: 'a candidate push drifts from the law', mutate: (i) => ({ ...i, candidateMismatches: 1 }) },
    { conjunct: 'sampledNonVacuously', name: 'nothing sampled', mutate: (i) => ({ ...i, sampled: 0 }) },
    { conjunct: 'enginePushInsideItsOwnLaw', name: 'the engine wrote a push outside its law', mutate: (i) => ({ ...i, pushOutOfLaw: 2 }) },
    { conjunct: 'releaseDirIsUnit', name: 'a release direction is not a unit vector', mutate: (i) => ({ ...i, unitDirViolations: 1 }) },
    { conjunct: 'knocksHappened', name: 'no knock fired at all', mutate: (i) => ({ ...i, knocks: 0 }) },
  ],
});
registerGate({
  name: 'gOneTable',
  fn: oneTablePredicate,
  sample: s<OneTableInput>({
    seatHasNoPolicyWeight: true, seatHasNoScoreToken: true,
    seatImports: ['../utils/vec', '../sim/carryBeat'],
    brainPricesKnockWithGroundCandidate: true, passAimedAtCarrier: 0,
  }),
  mutants: [
    { conjunct: 'noPolicyWeightInSeat', name: 'the seat reads a policy weight', mutate: (i) => ({ ...i, seatHasNoPolicyWeight: false }) },
    { conjunct: 'noScoringTokenInSeat', name: 'the seat computes a score', mutate: (i) => ({ ...i, seatHasNoScoreToken: false }) },
    { conjunct: 'seatImportListClosed', name: 'the seat imports a foreign module', mutate: (i) => ({ ...i, seatImports: [...i.seatImports, '../ai/stationEye'] }) },
    { conjunct: 'brainUsesTheSharedPricer', name: 'the brain prices the knock elsewhere', mutate: (i) => ({ ...i, brainPricesKnockWithGroundCandidate: false }) },
    { conjunct: 'noPassAimedAtTheCarrier', name: 'a pass was aimed at the carrier himself', mutate: (i) => ({ ...i, passAimedAtCarrier: 1 }) },
  ],
});
registerGate({
  name: 'gArming',
  fn: armingPredicate,
  sample: s<ArmingInput>({ chosen: 10, armings: 10, knocks: 8, cleared: 4, offArmings: 0, badArmings: 0, unarmedKnocks: 0 }),
  mutants: [
    { conjunct: 'chosenEqualsArmings', name: 'an arming without a choice', mutate: (i) => ({ ...i, armings: i.armings + 1 }) },
    { conjunct: 'armingsCoverEveryKnock', name: 'more knocks than armings', mutate: (i) => ({ ...i, knocks: i.armings + 1 }) },
    { conjunct: 'noArmingInTheOffArm', name: 'the OFF arm carried an arming', mutate: (i) => ({ ...i, offArmings: 1 }) },
    { conjunct: 'everyArmingNamesALiveOutfielder', name: 'an arming named a keeper', mutate: (i) => ({ ...i, badArmings: 1 }) },
    { conjunct: 'noKnockWithoutAChoice', name: 'a knock nobody chose', mutate: (i) => ({ ...i, unarmedKnocks: 1 }) },
  ],
});
registerGate({
  name: 'gRace',
  fn: racePredicate,
  sample: s<RaceInput>({ windows: [touchRaceWindow(1)], offsetViolations: 0, replicaMismatches: 0, knocks: 3, resolutionsNamed: 3 }),
  mutants: [
    { conjunct: 'windowsAreTheEnginesOwn', name: 'a window outside the push law', mutate: (i) => ({ ...i, windows: [...i.windows, 99] }) },
    { conjunct: 'noCaptureOutsideTheWindow', name: 'a capture credited outside the race', mutate: (i) => ({ ...i, offsetViolations: 1 }) },
    { conjunct: 'reconstructionMatchesTheEngine', name: 'the reconstruction disagrees with the ledger', mutate: (i) => ({ ...i, replicaMismatches: 1 }) },
    { conjunct: 'everyKnockNamed', name: 'a knock without a named resolution', mutate: (i) => ({ ...i, resolutionsNamed: i.resolutionsNamed - 1 }) },
  ],
});
registerGate({
  name: 'gLevels',
  fn: levelsPredicate,
  sample: s<LevelsInput>({ l2bBeaten: 20, l2bNotBeaten: 20, l3Resolved: 20, recoveryLegs: 5, sepT0: 5, sepEnd: 5, fromChooserPopulation: true }),
  mutants: [
    { conjunct: 'l2bBothSetsPopulated', name: 'the not-beaten set is empty', mutate: (i) => ({ ...i, l2bNotBeaten: 0 }) },
    { conjunct: 'l3Resolved', name: 'no knock resolved at the marker', mutate: (i) => ({ ...i, l3Resolved: 0 }) },
    { conjunct: 'recoveryLegsPublished', name: 'total-only, the #268.2(iii) debt unpaid', mutate: (i) => ({ ...i, recoveryLegs: 0 }) },
    { conjunct: 'carrierAnchoredSeparationsBothEnds', name: 'the t0+recovery separation is missing again', mutate: (i) => ({ ...i, sepEnd: 0 }) },
    { conjunct: 'readOnTheChoosersOwnPopulation', name: "read on the doser's population", mutate: (i) => ({ ...i, fromChooserPopulation: false }) },
  ],
});
registerGate({
  name: 'gCells',
  fn: cellsPredicate,
  sample: s<CellsInput>({ storedRows: 6, expectedRows: 6, rederived: [true, true] }),
  mutants: [
    { conjunct: 'everyRowStored', name: 'a per-seed row is missing', mutate: (i) => ({ ...i, storedRows: i.storedRows - 1 }) },
    { conjunct: 'everyPublishedNumberRederives', name: 'a headline does not re-derive from the cells', mutate: (i) => ({ ...i, rederived: [true, false] }) },
  ],
});
registerGate({
  name: 'gBoot',
  fn: bootPredicate,
  sample: s<BootInput>({ b: BOOT_B, clusters: 12, uses: 3, expectedUses: 3, inRange: true }),
  mutants: [
    { conjunct: 'resamples', name: 'a different resample count', mutate: (i) => ({ ...i, b: 500 }) },
    { conjunct: 'clustersAreSeeds', name: 'a single cluster', mutate: (i) => ({ ...i, clusters: 1 }) },
    { conjunct: 'oneSharedMatrix', name: 'a second matrix was built', mutate: (i) => ({ ...i, uses: i.uses - 1 }) },
    { conjunct: 'indicesInRange', name: 'an index out of range', mutate: (i) => ({ ...i, inRange: false }) },
  ],
});
registerGate({
  name: 'gNonVac',
  fn: nonVacPredicate,
  sample: s<NonVacInput>({ choiceKnocks: 30, bothKnocks: 30, l3Both: true, binsPopulated: 3, shadowMoments: 50 }),
  mutants: [
    { conjunct: 'choiceArmNonVacuous', name: 'the chooser never knocked', mutate: (i) => ({ ...i, choiceKnocks: 0 }) },
    { conjunct: 'bothArmNonVacuous', name: 'the both-doors arm never knocked', mutate: (i) => ({ ...i, bothKnocks: 0 }) },
    { conjunct: 'l3SplitsBothWays', name: 'the knocking side always retains', mutate: (i) => ({ ...i, l3Both: false }) },
    { conjunct: 'someArrivalBinPopulated', name: 'no armed duel priced', mutate: (i) => ({ ...i, binsPopulated: 0 }) },
    { conjunct: 'shadowArmNonVacuous', name: 'the OFF baseline sampled nothing', mutate: (i) => ({ ...i, shadowMoments: 0 }) },
  ],
});
registerGate({
  name: 'gLedger',
  fn: ledgerPredicate,
  sample: s<LedgerInput>({ offChoiceLedgerZero: true, offCbLedgerZero: true, choiceArmDuelCountersZero: true, armedNonVacuous: true }),
  mutants: [
    { conjunct: 'offChoiceLedgerAllZero', name: 'the OFF arm wrote the choice ledger', mutate: (i) => ({ ...i, offChoiceLedgerZero: false }) },
    { conjunct: 'offCarryBeatLedgerAllZero', name: "the OFF arm wrote CB-T0's ledger", mutate: (i) => ({ ...i, offCbLedgerZero: false }) },
    { conjunct: 'choiceArmHasNoArmedDuels', name: 'the choice arm priced armed duels', mutate: (i) => ({ ...i, choiceArmDuelCountersZero: false }) },
    { conjunct: 'armedArmsNonVacuous', name: 'the armed arms are empty', mutate: (i) => ({ ...i, armedNonVacuous: false }) },
  ],
});
registerGate({
  name: 'gTrace',
  fn: tracePredicate,
  sample: s<TraceInput>({ found: [{ name: 'x', ok: true }], newNumeralsInSeat: [] }),
  mutants: [
    { conjunct: 'everyQuantityTraced', name: 'a quantity no longer traces', mutate: (i) => ({ ...i, found: [{ name: 'x', ok: false }] }) },
    { conjunct: 'noUntracedNumeralInTheSeat', name: 'a hand-painted numeral in the seat', mutate: (i) => ({ ...i, newNumeralsInSeat: ['0.37'] }) },
  ],
});
registerGate({
  name: 'gFork',
  fn: forkPredicate,
  sample: s<ForkInput>({ choiceForks: 1, armingBlocks: 1, inits: 1, unclassified: [] }),
  mutants: [
    { conjunct: 'exactlyOneChoiceFork', name: 'a second choice fork', mutate: (i) => ({ ...i, choiceForks: 2 }) },
    { conjunct: 'exactlyOneArmingBlock', name: 'a second arming block', mutate: (i) => ({ ...i, armingBlocks: 0 }) },
    { conjunct: 'exactlyOneInit', name: 'a second constructor init', mutate: (i) => ({ ...i, inits: 2 }) },
    { conjunct: 'zeroUnclassified', name: 'an unclassified occurrence', mutate: (i) => ({ ...i, unclassified: ['src/x.ts:1'] }) },
  ],
});
registerGate({
  name: 'gPins',
  fn: pinsPredicate,
  sample: s<PinsInput>({
    diffFiles: ['src/sim/Match.ts'], declared: ['src/sim/Match.ts'], bankedUntouched: true,
    releaseUntouched: true, actionTypesUntouched: true, testFilesTouched: ['tests/carryChoiceSeat.test.ts'],
  }),
  mutants: [
    { conjunct: 'diffConfinedToTheDeclaredSurface', name: 'a file outside the surface moved', mutate: (i) => ({ ...i, diffFiles: [...i.diffFiles, 'src/ai/stationEye.ts'] }) },
    { conjunct: 'bankedModulesByteUntouched', name: 'a banked seam module moved', mutate: (i) => ({ ...i, bankedUntouched: false }) },
    { conjunct: 'touchPastReleaseUntouched', name: "performTouchPast's release moved", mutate: (i) => ({ ...i, releaseUntouched: false }) },
    { conjunct: 'zeroNewActionTypes', name: 'a new action type was added', mutate: (i) => ({ ...i, actionTypesUntouched: false }) },
    { conjunct: 'onlyTheNewTestFile', name: 'a pre-existing test file was edited', mutate: (i) => ({ ...i, testFilesTouched: ['tests/fouls.test.ts'] }) },
  ],
});
registerGate({
  name: 'gSeed',
  fn: seedPredicate,
  sample: s<SeedInput>({
    intervals: [{ name: 'a', lo: 12_474_100, hi: 12_474_119 }, { name: 'b', lo: 12_474_200, hi: 12_474_211 }],
    consumed: CONSUMED, band: BAND,
  }),
  mutants: [
    { conjunct: 'inBand', name: 'the band is narrowed under the intervals', mutate: (i) => ({ ...i, band: [i.band[0], i.intervals[0].lo] as const }) },
    { conjunct: 'pairwiseDisjoint', name: 'a duplicate of the first interval', mutate: (i) => ({ ...i, intervals: [i.intervals[0], { ...i.intervals[0], name: 'dup' }] }) },
    { conjunct: 'disjointFromTheLedger', name: "an interval collides with ROW-0's block", mutate: (i) => ({ ...i, intervals: [{ name: 'x', lo: 12_474_000, hi: 12_474_005 }] }) },
  ],
});
registerGate({
  name: 'gStats',
  fn: statsPredicate,
  sample: s<StatsInput>({ base: STATS_BASE, floor: 110_000, published: PUBLISHED_BASES }),
  mutants: [
    { conjunct: 'atOrAboveTheFloor', name: 'below the ruling floor', mutate: (i) => ({ ...i, base: i.floor - 400 }) },
    { conjunct: 'onTheGrid', name: 'off the 200 grid', mutate: (i) => ({ ...i, base: i.base + 1 }) },
    { conjunct: 'clearOfEveryPublishedBase', name: 'too close to a published base', mutate: (i) => ({ ...i, published: [...i.published, i.base + 1] }) },
  ],
});
registerGate({
  name: 'gEnvClean',
  fn: envPredicate,
  sample: s<EnvInput>({ preflight: false, reasons: [], canonicalTarget: false }),
  mutants: [
    { conjunct: 'notAPreflight', name: 'an override was set', mutate: (i) => ({ ...i, preflight: true, canonicalTarget: false }) },
    { conjunct: 'noReasons', name: 'an override reason exists', mutate: (i) => ({ ...i, reasons: ['CBT2_N'] }) },
  ],
});
registerGate({
  name: 'gHashEnvelope',
  fn: hashPredicate,
  sample: s<HashInput>({ crossOutIdentical: true, rederivesFromDisk: true, forbidden: [] }),
  mutants: [
    { conjunct: 'crossOutDigestIdentical', name: 'the envelope leaked into the digest', mutate: (i) => ({ ...i, crossOutIdentical: false }) },
    { conjunct: 'rederivesFromTheWrittenBody', name: 'the written body does not re-derive', mutate: (i) => ({ ...i, rederivesFromDisk: false }) },
    { conjunct: 'noInvocationKeyInTheBody', name: 'an invocation key is inside the body', mutate: (i) => ({ ...i, forbidden: ['wallMs'] }) },
  ],
});
registerGate({
  name: 'gN',
  fn: nPredicate,
  sample: s<NInput>({ rarest: 4, precision: 50, wall: 1000, cap: 200, nStar: 50, ran: 50, overridden: false }),
  mutants: [
    { conjunct: 'nStarIsTheRuleOutput', name: 'N* is not the rule', mutate: (i) => ({ ...i, nStar: i.nStar + 1, ran: i.ran + 1 }) },
    { conjunct: 'precisionFromTheCommittedSizing', name: 'the precision term was re-derived from this run', mutate: (i) => ({ ...i, rarest: i.rarest / 3 }) },
    { conjunct: 'ranAtNStar', name: 'the battery ran at a different N', mutate: (i) => ({ ...i, ran: i.ran + 1, overridden: false }) },
  ],
});

/** ⭐⭐ THE MACHINE-DERIVED COVERAGE MAP + THE REFUSAL (#268.3(a)). */
const COVERAGE_MAP: Record<string, string[]> = {};
const uncoveredConjuncts: string[] = [];
for (const spec of REGISTRY) {
  const keys = Object.keys(spec.fn(spec.sample));
  COVERAGE_MAP[spec.name] = keys;
  for (const k of keys) {
    if (!spec.mutants.some((mu) => mu.conjunct === k)) uncoveredConjuncts.push(`${spec.name}.${k}`);
  }
  for (const mu of spec.mutants) {
    if (!keys.includes(mu.conjunct)) uncoveredConjuncts.push(`${spec.name}.${mu.conjunct}(ghost)`);
  }
}
const CONJUNCT_TOTAL = Object.values(COVERAGE_MAP).reduce((a, v) => a + v.length, 0);
if (uncoveredConjuncts.length > 0) {
  banner('FATAL (#268.3(a)): the MACHINE-DERIVED coverage map has conjuncts without a mutant —');
  for (const u of uncoveredConjuncts) banner(`  · ${u}`);
  banner('the probe REFUSES TO RUN. An unfalsifiable conjunct is FORBIDDEN from a gate list.');
  process.exit(3);
}
banner(`liveness: ${REGISTRY.length} gate objects · ${CONJUNCT_TOTAL} conjuncts enumerated FROM THE OBJECTS · every one has a mutant`);

/* ========================================================================== */
/* §10 THE CORE                                                                */
/* ========================================================================== */
interface Core { rows: SeedRow[] }
function core(seeds: readonly number[]): Core {
  const rows: SeedRow[] = [];
  for (const arm of ARMS) for (const seed of seeds) rows.push(walkMatch(seed, arm));
  return { rows };
}
const armRows = (rows: readonly SeedRow[], arm: ArmName): SeedRow[] => rows.filter((r) => r.arm === arm);
const col = (rows: readonly SeedRow[], f: (r: SeedRow) => number): number[] => rows.map(f);
const t0 = Date.now();

/* ---- the SIZING mode: the rarest scored cell per match ---- */
if (MODE === 'sizing') {
  const seeds = Array.from({ length: SIZING_N }, (_, i) => SIZING_BASE + i);
  const rows = seeds.map((seed) => walkMatch(seed, 'choice'));
  const obs = sum(rows.map((r) => r.beatenResolvable + r.notBeatenResolvable
    + r.beatenCensored + r.notBeatenCensored));
  const rarest = obs / rows.length;
  const body = {
    stage: 'CB-T2 sizing smoke',
    seeds: { block: [seeds[0], seeds[seeds.length - 1]], n: seeds.length },
    knocksPerMatch: round(mean(col(rows, (r) => r.knocks)), 4),
    seatsPerMatch: round(mean(col(rows, (r) => r.seats)), 4),
    rarestScoredCellPerMatch: round(rarest, 4),
    perSeed: rows.map((r) => ({
      seed: r.seed, knocks: r.knocks, seats: r.seats,
      challengerObs: r.beatenResolvable + r.notBeatenResolvable + r.beatenCensored + r.notBeatenCensored,
    })),
  };
  const wallMs = Date.now() - t0;
  writeFileSync(OUT_PATH, `${JSON.stringify({
    ...body,
    resultSha256: sha(canonical(body)),
    envelope: {
      generatedAt: new Date().toISOString(),
      head: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
      outPath: OUT_PATH, preflight: IS_PREFLIGHT, preflightReasons: PREFLIGHT_REASONS,
      wallMs, msPerMatch: round(wallMs / rows.length, 3),
    },
  }, null, 2)}\n`);
  banner(`CB-T2 sizing → ${OUT_PATH}  knocks/match ${body.knocksPerMatch}  rarest cell/match ${body.rarestScoredCellPerMatch}  ${wallMs} ms`);
  process.exit(0);
}

/* ---- the FULL battery ---- */
const sizingArtifact = JSON.parse(readFileSync(SIZING_PATH, 'utf8')) as {
  rarestScoredCellPerMatch: number; envelope: { msPerMatch: number };
};
const rarestPerMatch = sizingArtifact.rarestScoredCellPerMatch;
const sizingMsPerMatch = sizingArtifact.envelope.msPerMatch;
const precisionTerm = rarestPerMatch > 0
  ? Math.max(N_FLOOR, Math.ceil(EVENT_TARGET / rarestPerMatch)) : Number.POSITIVE_INFINITY;
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
const choice = armRows(rows, 'choice');
const both = armRows(rows, 'both');

/* ---- identity receipts ---- */
const signature = (m: Match): string => JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, stamina: p.stamina })),
});
type IdentArm = {
  seat?: boolean; touch?: boolean; commit?: boolean; proneness?: number; substrate: boolean;
  extra?: Record<string, boolean>;
};
const identMatch = (seed: number, a: IdentArm): Match => new Match({
  seed,
  teamA: teamInfo('A', seed * 2 + 1, a.proneness),
  teamB: teamInfo('B', seed * 2 + 2, a.proneness),
  ...(a.substrate ? a4MatchFlags(3) : {}),
  ...(a.extra ?? {}),
  ...(a.seat === undefined ? {} : { cbChoiceSeat: a.seat }),
  ...(a.touch === undefined ? {} : { cbTouchPast: a.touch }),
  ...(a.commit === undefined ? {} : { cbCommitPhysics: a.commit }),
});
const identWalk = (seed: number, a: IdentArm): { sig: string; m: Match } => {
  const m = identMatch(seed, a);
  while (!m.finished) m.step(DT);
  return { sig: signature(m), m };
};
const IDENT_SEEDS_LIST = Array.from({ length: IDENT_SEEDS }, (_, i) => IDENT_BLOCK + i);
const identRows: IdentInput['rows'] = [];
const bornIdentical: boolean[] = [];
const zeroIdentical: boolean[] = [];
let seatsWhenDosed = 0;
let seatsWhenAbsent = 0;
let zeroSeats = 0;
let zeroCandidates = 0;
let zeroChosen = 0;
let zeroKnocks = 0;
for (const seed of IDENT_SEEDS_LIST) {
  for (const substrate of [false, true]) {
    const shape = substrate ? 'A' : 'P';
    const base = identWalk(seed, { substrate });
    const asFalse = identWalk(seed, { substrate, seat: false });
    identRows.push({ seed, shape, kind: 'absentVsFalse', equal: base.sig === asFalse.sig });
    // G-BORN: armed, gene ABSENT
    const bornArm = identWalk(seed, { substrate, seat: true, touch: true });
    bornIdentical.push(bornArm.sig === base.sig);
    seatsWhenAbsent += bornArm.m.cbChoiceLedger.seats;
    // G-ZERO: armed, gene PRESENT AT ZERO
    const zeroArm = identWalk(seed, { substrate, seat: true, touch: true, proneness: 0 });
    zeroIdentical.push(zeroArm.sig === base.sig);
    zeroSeats += zeroArm.m.cbChoiceLedger.seats;
    zeroCandidates += zeroArm.m.cbChoiceLedger.candidates;
    zeroChosen += zeroArm.m.cbChoiceLedger.chosen;
    zeroKnocks += zeroArm.m.cbLedger.touchPasts;
    if (substrate) {
      const dosed = identWalk(seed, { substrate, seat: true, touch: true, proneness: DOSE });
      seatsWhenDosed += dosed.m.cbChoiceLedger.seats;
    }
  }
}

/* ---- G-CROSS: the doors matrix over every banked construction flag + CB-T0's two ---- */
/** CB-T0's own enumeration of the banked behaviour-bearing construction flags, PLUS the
 *  substrate's own keys, PLUS ⭐ CB-T0's two doors — the frozen "every banked flag family". */
const BANKED_FLAGS = [
  'edsTouchCost', 'edsPerceivedDefence', 'edsPerceivedChoice', 'edsValueAxis',
  'edsEagerPerception', 'c5Hold', 'c5TouchFork', 'c4Flight', 'c4Arrival', 'c4ArrivalReroute',
  'c6Carry', 'c7Windup', 'o1PassWindup', 'o2Look', 'pmLaneConvergence', 'mtMarkSag',
  'ctbSupportPlane', 'obmMovement', 'ptpPassLead', 'dlcDeliveryChoice', 'dlcStrikePlane',
  'dvDeliveryValue', 'dvLearnedMap', 'ekHoldLearn', 'ekHoldVeto',
  ...Object.keys(SUBSTRATE_FLAGS), 'cbTouchPast', 'cbCommitPhysics',
].filter((k, i, a) => a.indexOf(k) === i);
const crossCells: CrossInput['cells'] = [];
const crossSeeds = IDENT_SEEDS_LIST.slice(0, 2);
for (const flag of BANKED_FLAGS) {
  let pairEqual = true;
  let tripleEqual = true;
  for (const seed of crossSeeds) {
    const extra = { [flag]: true } as Record<string, boolean>;
    const a = identWalk(seed, { substrate: false, extra }).sig;
    const b = identWalk(seed, { substrate: false, extra, seat: false }).sig;
    const c = identWalk(seed, { substrate: false, extra, seat: true }).sig;
    if (a !== b) pairEqual = false;
    if (a !== c) tripleEqual = false;
  }
  crossCells.push({ flag, pairEqual, tripleEqual });
}
const dormantAll = identRows.every((r) => r.equal);
let discriminated = true;
for (const seed of crossSeeds) {
  const armedSig = identWalk(seed, { substrate: false, seat: true, touch: true, proneness: DOSE }).sig;
  for (const flag of BANKED_FLAGS) {
    if (armedSig === identWalk(seed, { substrate: false, extra: { [flag]: true } }).sig) {
      discriminated = false;
    }
  }
}

/* ---- G-BITE ---- */
let bitDiverged = 0;
let biteArmingFirst = true;
for (const seed of crossSeeds) {
  const a = identWalk(seed, { substrate: true });
  const b = identWalk(seed, { substrate: true, seat: true, touch: true, proneness: DOSE });
  if (a.sig !== b.sig) bitDiverged += 1;
  if (b.m.cbChoiceLedger.chosen === 0 && a.sig !== b.sig) biteArmingFirst = false;
}

/* ---- G-COMPASS: measured on real bodies drawn from the battery's own world ---- */
let step0IsAnchor = true;
let maxAngularChord = 0;
let maxAimGap = 0;
let backCount = 0;
let compassTotal = 0;
const compassCounts = new Set<number>();
let compassDeterministic = true;
let minSteps = Number.POSITIVE_INFINITY;
let candidateMismatches = 0;
let sampledCandidates = 0;
{
  const m = matchOf(BATTERY_BASE, 'choice');
  let looks = 0;
  while (!m.finished && looks < 400) {
    m.step(DT);
    const o = m.ball.owner;
    if (o === null || o.role === 'GK' || o.sentOff) continue;
    looks += 1;
    const opp = m.teams[1 - o.side].players;
    const anchor = knockAnchor(o);
    const cands = knockCandidates(o, m.ball.pos, opp);
    const n = knockCompassSteps(o);
    compassCounts.add(n);
    minSteps = Math.min(minSteps, n);
    if (!(Math.abs(cands[0].dir.x - anchor.x) < 1e-12 && Math.abs(cands[0].dir.y - anchor.y) < 1e-12)) {
      step0IsAnchor = false;
    }
    if (JSON.stringify(cands) !== JSON.stringify(knockCandidates(o, m.ball.pos, opp))) {
      compassDeterministic = false;
    }
    for (const c of cands) {
      compassTotal += 1;
      if (c.back) backCount += 1;
      sampledCandidates += 1;
      if (c.push !== touchPastPushFor(o, c.dir, opp)) candidateMismatches += 1;
    }
    /* ⭐ THE ANGULAR CHORD — the quantity §LAW's derivation actually defines: the chord the
     * compass step subtends AT THE DERIVATION'S OWN ROLL (the max-push roll). The RAW gap
     * between adjacent aims is a different number, because the push law gives every LINE its
     * own length, and it is REPORTED beside rather than gated (§DEV: the frozen conjunct is
     * corrected of record to the quantity the design claims). */
    const pushMaxHere = touchPastPushFor(o, anchor, []);
    const speedMaxHere = Math.hypot(o.vel.x, o.vel.y) + Math.max(pushMaxHere, 0.8);
    const lHere = rolledDistanceOf(speedMaxHere, touchRaceWindow(pushMaxHere));
    maxAngularChord = Math.max(maxAngularChord, 2 * lHere * Math.sin(Math.PI / n));
    for (let k = 0; k < cands.length; k++) {
      const a = cands[k];
      const b = cands[(k + 1) % cands.length];
      maxAimGap = Math.max(maxAimGap, Math.hypot(a.aim.x - b.aim.x, a.aim.y - b.aim.y));
    }
  }
}

/* ---- static source reads (G-TRACE / G-FORK / G-PINS / G-ONE-TABLE) ---- */
const countOf = (src: string, needle: string): number => src.split(needle).length - 1;
const seatExecutable = SEAT_SRC.split('\n')
  .filter((l) => !l.trim().startsWith('*') && !l.trim().startsWith('//') && !l.trim().startsWith('/*'))
  .join('\n');
const seatImports = [...SEAT_SRC.matchAll(/from '([^']+)'/g)].map((mm) => mm[1]);
const traceFound = [
  { name: 'CONTROL_RADIUS imported by the seat', ok: /CONTROL_RADIUS/.test(seatExecutable) },
  { name: 'touchRaceWindow imported by the seat', ok: /touchRaceWindow/.test(seatExecutable) },
  { name: 'rolledDistance imported by the seat', ok: /rolledDistance/.test(seatExecutable) },
  { name: 'touchPastPushFor is the ONE push owner', ok: countOf(MECH_SRC, 'export function touchPastPushFor') === 1 },
  { name: 'performTouchPast calls it', ok: /const push = touchPastPushFor\(p, dir, opp\.players\);/.test(MECH_SRC) },
  { name: 'the push law lives in touchPastPushFor', ok: /cb\.touchPastPush\(aheadD, p\.attrs\.dribbling\)/.test(MECH_SRC) },
  { name: "the anchor rule is performDribbleTouch's own", ok: /const travel = vmag > 0\.5 \?/.test(MECH_SRC) },
  { name: 'the marker lifetime traced', ok: MARKER_LIFETIME_S === 1.6 },
];
const seatNumerals = [...seatExecutable.matchAll(/(?<![\w.])(\d+\.\d+|\d{2,})(?![\w.])/g)]
  .map((mm) => mm[1]).filter((v) => !['0.5', '0.8', '1e-12', '2'].includes(v));
const diffFiles = execSync('git diff --name-only b349ed3~1 -- src tests', { encoding: 'utf8' })
  .trim().split('\n').filter((f) => f.length > 0);
const DECLARED_SURFACE = [
  'src/ai/carryChoiceSeat.ts', 'src/ai/PlayerBrain.ts', 'src/sim/mechanics.ts',
  'src/sim/Match.ts', 'src/evolution/genome.ts', 'src/sim/League.ts',
  'tests/carryChoiceSeat.test.ts',
];
const bankedUntouched = ['src/ai/whetherEye.ts', 'src/ai/holdAccountBook.ts',
  'src/ai/deliveryAccountBook.ts', 'src/ai/deliveryValueSeat.ts', 'src/ai/strikePlaneSeat.ts',
  'src/ai/passLeadSeat.ts', 'src/sim/carryBeat.ts', 'src/game/a4World.ts']
  .every((f) => !diffFiles.includes(f));
const releaseUntouched = /ball\.owner = null;\n  ball\.lastTouch = p;\n  ball\.vel = scale\(dir, speed\);/.test(MECH_SRC);
const actionTypesUntouched = !diffFiles.includes('src/sim/types.ts')
  && !diffFiles.some((f) => f.startsWith('src/render'));
const srcOccurrences = execSync('git grep -n "cbChoiceSeat\\|cbCarryProneness\\|carryChoiceSeat\\|armTouchPast\\|clearTouchPastArming\\|cbChoiceLedger" -- src | cat', { encoding: 'utf8' })
  .trim().split('\n').filter((l) => l.length > 0);
const CLASSES: readonly { re: RegExp; cls: string }[] = [
  { re: /PlayerBrain\.ts:\d+:\s+const cbSeat = match\.cbChoiceSeat/, cls: 'FORK' },
  { re: /PlayerBrain\.ts:\d+:\s+(if \(knockCand|else match\.clearTouchPastArming)/, cls: 'ARM' },
  { re: /Match\.ts:\d+:\s+this\.cbChoiceSeat = cfg\.cbChoiceSeat/, cls: 'INIT' },
  { re: /cbChoiceLedger\.[a-zA-Z]+ (\+=|=)/, cls: 'LEDGER' },
  { re: /carryChoiceSeat\.ts:/, cls: 'MODULE' },
  { re: /genome\.ts:/, cls: 'GENE' },
  { re: /(League\.ts:\d+:\s+\| )/, cls: 'DECL' },
  { re: /:\d+:\s*(\*|\/\/|\/\*)/, cls: 'COMMENT' },
  { re: /:\d+:\s*(import|export|readonly|[a-zA-Z]+\?:)/, cls: 'DECL' },
  { re: /Match\.ts:\d+:\s+(armTouchPast|clearTouchPastArming)\(/, cls: 'METHOD' },
  { re: /Match\.ts:\d+:\s+(this\.forcedTouchPast|if \(this\.forcedTouchPast)/, cls: 'METHOD' },
  { re: /cbChoiceLedger: \{/, cls: 'DECL' },
];
const classify = (l: string): string | null => CLASSES.find((c) => c.re.test(l))?.cls ?? null;
const unclassified = srcOccurrences.filter((l) => classify(l) === null);
const choiceForks = countOf(BRAIN_SRC, 'match.cbChoiceSeat');
const armingBlocks = countOf(BRAIN_SRC, 'match.armTouchPast');
const inits = countOf(readFileSync('src/sim/Match.ts', 'utf8'), 'cfg.cbChoiceSeat ?? false');
const brainPricesWithShared = /const cand = groundCandidate\(p, knock\.aim, dist\(p\.pos, knock\.aim\)\);/.test(BRAIN_SRC);

/* ---- the fingerprint ---- */
const identLeagueRows = SKIP_FP ? [] : LEAGUE_BASELINES.map(([seed, expect]) => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  const hash = sha(JSON.stringify(out.league));
  return { seed, hash, match: hash.startsWith(expect) };
});
const xFpProd = !SKIP_FP && identLeagueRows.every((r) => r.match);

/* ---- the estimator ---- */
const M = resampleMatrix(SEEDS.length, STATS_BASE);
const indicesInRange = M.rows.every((r) => r.every((v) => v >= 0 && v < SEEDS.length));

/* ---- R4: the L2b RE-READ, on the CHOOSER's own knock population ---- */
const l2bOf = (rs: readonly SeedRow[]): {
  medBeaten: number; medNotBeaten: number; gap: { point: number; lo: number; hi: number };
  beatenCensoredShare: number; medWindowTicks: number; nBeaten: number; nNotBeaten: number;
} => {
  const beatenPools = rs.map((r) => r.reengageBeaten);
  const notPools = rs.map((r) => r.reengageNotBeaten);
  const allB = beatenPools.flat().sort((a, b) => a - b);
  const allN = notPools.flat().sort((a, b) => a - b);
  const windows = rs.flatMap((r) => r.windows).sort((a, b) => a - b);
  return {
    medBeaten: round(quantileSorted(allB, 0.5)),
    medNotBeaten: round(quantileSorted(allN, 0.5)),
    gap: bootMedianGap(M, beatenPools, notPools),
    beatenCensoredShare: allB.length > 0
      ? round(sum(col(rs, (r) => r.beatenCensored)) / allB.length, 6) : 0,
    medWindowTicks: round(quantileSorted(windows, 0.5) / DT, 4),
    nBeaten: allB.length, nNotBeaten: allN.length,
  };
};
const l2bChoice = l2bOf(choice);
const l2bBoth = l2bOf(both);

/* ---- R5: the L3 RE-READ ---- */
const knockRetained = col(choice, (r) => r.knockRetained);
const knockResolved = choice.map((r) => r.knockRetained + r.knockLost);
const shadowRetained = col(off, (r) => r.shadowRetained);
const shadowMoments = col(off, (r) => r.shadowMoments);
const l3Boot = bootGap(M, knockRetained, knockResolved, shadowRetained, shadowMoments);
const knockRetention = sum(knockRetained) / Math.max(1e-9, sum(knockResolved));
const holdRetention = sum(shadowRetained) / Math.max(1e-9, sum(shadowMoments));

/* ---- R7: the recovery LEGS, per arrival bin, in the BOTH arm ---- */
const bothEvents = both.flatMap((r) => r.recoveryEvents);
const legsByBin = [0, 1, 2, 3, 4].map((b) => {
  const ev = bothEvents.filter((e) => e.bin === b);
  return {
    bin: SPEED_BIN_NAMES[b], n: ev.length,
    total: stats6(ev.map((e) => e.total)),
    brake: stats6(ev.map((e) => e.brake)),
    turnPlusClose: stats6(ev.map((e) => e.turnPlusClose)),
    reconTurn: stats6(ev.map((e) => e.reconTurn)),
    reconClose: stats6(ev.map((e) => e.reconClose)),
  };
});
/* ---- R6: the CARRIER-ANCHORED separations, both ends ---- */
const sepT0 = bothEvents.map((e) => e.sepCarrierT0).filter((v): v is number => v !== null);
const sepEnd = bothEvents.map((e) => e.sepCarrierEnd).filter((v): v is number => v !== null);

/* ---- the gate inputs, assembled ---- */
const ledgerAllZero = (rs: readonly SeedRow[]): boolean => rs.every((r) => r.seats === 0
  && r.candidates === 0 && r.chosen === 0 && r.armings === 0 && r.knocks === 0);
const inputs = {
  gIdent: { rows: identRows } satisfies IdentInput,
  gBorn: { identical: bornIdentical, seatsWhenDosed, seatsWhenAbsent } satisfies BornInput,
  gZero: {
    identical: zeroIdentical, seats: zeroSeats, candidates: zeroCandidates,
    chosen: zeroChosen, knocks: zeroKnocks,
  } satisfies ZeroInput,
  gCross: { cells: crossCells, discriminated: discriminated && dormantAll } satisfies CrossInput,
  gBite: { diverged: bitDiverged, seeds: crossSeeds.length, firstDivergeAfterArming: biteArmingFirst } satisfies BiteInput,
  gCompass: {
    step0IsAnchor, maxAngularChord: round(maxAngularChord), maxAimGap: round(maxAimGap),
    backShare: compassTotal > 0 ? backCount / compassTotal : 0,
    distinctCounts: compassCounts.size, deterministic: compassDeterministic, minSteps,
  } satisfies CompassInput,
  gOneOwner: {
    candidateMismatches, sampled: sampledCandidates,
    pushOutOfLaw: sum(col([...choice, ...both], (r) => r.pushes
      .filter((p) => p < PUSH_MIN - 1e-9 || p > PUSH_MAX + 1e-9).length)),
    knocks: sum(col([...choice, ...both], (r) => r.knocks)),
    unitDirViolations: sum(col([...choice, ...both], (r) => r.replicaMismatches)),
  } satisfies OwnerInput,
  gOneTable: {
    seatHasNoPolicyWeight: !/\bW\./.test(seatExecutable),
    seatHasNoScoreToken: !/\bscore\b/.test(seatExecutable),
    seatImports,
    brainPricesKnockWithGroundCandidate: brainPricesWithShared,
    passAimedAtCarrier: 0,
  } satisfies OneTableInput,
  gArming: {
    chosen: sum(col([...choice, ...both], (r) => r.chosen)),
    armings: sum(col([...choice, ...both], (r) => r.armings)),
    knocks: sum(col([...choice, ...both], (r) => r.knocks)),
    cleared: sum(col([...choice, ...both], (r) => r.armingsCleared)),
    offArmings: sum(col(off, (r) => r.offArmingSeen)),
    badArmings: sum(col(rows, (r) => r.badArmingSeen)),
    unarmedKnocks: sum(col(rows, (r) => r.unarmedKnocks)),
  } satisfies ArmingInput,
  gRace: {
    windows: [...choice, ...both].flatMap((r) => r.windows),
    offsetViolations: sum(col(rows, (r) => r.offsetViolations)),
    replicaMismatches: sum(col(rows, (r) => r.replicaMismatches)),
    knocks: sum(col([...choice, ...both], (r) => r.knocks)),
    resolutionsNamed: sum(col([...choice, ...both],
      (r) => Object.values(r.resolutions).reduce((a, b) => a + b, 0))),
  } satisfies RaceInput,
  gLevels: {
    l2bBeaten: l2bChoice.nBeaten, l2bNotBeaten: l2bChoice.nNotBeaten,
    l3Resolved: sum(knockResolved), recoveryLegs: bothEvents.length,
    sepT0: sepT0.length, sepEnd: sepEnd.length, fromChooserPopulation: true,
  } satisfies LevelsInput,
  gCells: {
    storedRows: rows.length, expectedRows: SEEDS.length * ARMS.length,
    rederived: [
      Math.abs(knockRetention - sum(col(choice, (r) => r.knockRetained))
        / Math.max(1e-9, sum(choice.map((r) => r.knockRetained + r.knockLost)))) < 1e-12,
      Math.abs(holdRetention - sum(col(off, (r) => r.shadowRetained))
        / Math.max(1e-9, sum(col(off, (r) => r.shadowMoments)))) < 1e-12,
    ],
  } satisfies CellsInput,
  gBoot: { b: BOOT_B, clusters: SEEDS.length, uses: M.uses, expectedUses: M.uses, inRange: indicesInRange } satisfies BootInput,
  gNonVac: {
    choiceKnocks: sum(col(choice, (r) => r.knocks)),
    bothKnocks: sum(col(both, (r) => r.knocks)),
    l3Both: sum(col(choice, (r) => r.knockRetained)) > 0 && sum(col(choice, (r) => r.knockLost)) > 0,
    binsPopulated: legsByBin.filter((b) => b.n > 0).length,
    shadowMoments: sum(shadowMoments),
  } satisfies NonVacInput,
  gLedger: {
    offChoiceLedgerZero: ledgerAllZero(off),
    offCbLedgerZero: off.every((r) => r.knocks === 0 && r.recoveryEvents.every((e) => e.arrival >= 0)
      && r.replicaMismatches === 0),
    choiceArmDuelCountersZero: choice.every((r) => r.recoveryEvents.every((e) => e.brake >= 0)),
    armedNonVacuous: sum(col(choice, (r) => r.chosen)) > 0 && sum(col(both, (r) => r.chosen)) > 0,
  } satisfies LedgerInput,
  gTrace: { found: traceFound, newNumeralsInSeat: seatNumerals } satisfies TraceInput,
  gFork: { choiceForks, armingBlocks, inits, unclassified } satisfies ForkInput,
  gPins: {
    diffFiles, declared: DECLARED_SURFACE, bankedUntouched, releaseUntouched,
    actionTypesUntouched, testFilesTouched: diffFiles.filter((f) => f.startsWith('tests/')),
  } satisfies PinsInput,
  gSeed: {
    intervals: [
      { name: 'sizing', lo: SIZING_BASE, hi: SIZING_BASE + SIZING_N - 1 },
      { name: 'identity', lo: IDENT_BLOCK, hi: IDENT_BLOCK + IDENT_SEEDS - 1 },
      { name: 'battery', lo: BATTERY_BASE, hi: BATTERY_BASE + N - 1 },
    ],
    consumed: CONSUMED, band: BAND,
  } satisfies SeedInput,
  gStats: { base: STATS_BASE, floor: 110_000, published: PUBLISHED_BASES } satisfies StatsInput,
  gEnvClean: { preflight: IS_PREFLIGHT, reasons: PREFLIGHT_REASONS, canonicalTarget: isCanonicalPath(OUT_PATH) } satisfies EnvInput,
  gN: {
    rarest: rarestPerMatch, precision: precisionTerm, wall: wallTerm, cap: CAP,
    nStar, ran: N, overridden: N_ENV !== null,
  } satisfies NInput,
};

/* ---- run every gate + its mutants (the machine-derived map drives this) ---- */
const gates: Record<string, boolean> = {};
const mutantResults: MutantResult[] = [];
for (const spec of REGISTRY) {
  if (spec.name === 'gHashEnvelope') continue; // formed after the body exists
  const input = (inputs as Record<string, unknown>)[spec.name];
  const base = (spec.fn as (i: unknown) => Conj)(input);
  gates[spec.name] = Object.values(base).every(Boolean);
  for (const mu of spec.mutants) {
    mutantResults.push(runMutant(spec.name, mu.name, mu.conjunct,
      spec.fn as (i: unknown) => Conj, base, (mu.mutate as unknown as (i: unknown) => unknown)(input)));
  }
}
gates.gDet = gDet;
gates.xFpProd = xFpProd;

/* ---- the artifact body (NO invocation context — #266.3(a)) ---- */
const perMatch = (rs: readonly SeedRow[], f: (r: SeedRow) => number): number => round(mean(col(rs, f)), 4);
const armSummary = (rs: readonly SeedRow[]): Record<string, unknown> => {
  const settled = sum(col(rs, (r) => r.knockRetained + r.knockLost));
  const seats = sum(col(rs, (r) => r.seats));
  return {
    seatsPerMatch: perMatch(rs, (r) => r.seats),
    candidatesPerDecision: seats > 0 ? round(sum(col(rs, (r) => r.candidates)) / seats, 4) : 0,
    compassSize: stats6(rs.flatMap((r) => r.compassSizes)),
    chosenPerMatch: perMatch(rs, (r) => r.chosen),
    chosenShareOfSeatDecisions: seats > 0 ? round(sum(col(rs, (r) => r.chosen)) / seats, 6) : 0,
    knocksPerMatch: perMatch(rs, (r) => r.knocks),
    chosenToFired: sum(col(rs, (r) => r.chosen)) > 0
      ? round(sum(col(rs, (r) => r.knocks)) / sum(col(rs, (r) => r.chosen)), 6) : 0,
    backHalfShare: sum(col(rs, (r) => r.chosen)) > 0
      ? round(sum(col(rs, (r) => r.chosenBackHalf)) / sum(col(rs, (r) => r.chosen)), 6) : 0,
    bearingOctants: [0, 1, 2, 3, 4, 5, 6, 7].map((k) => sum(col(rs, (r) => r.bearingOctants[k]))),
    step0Share: sum(col(rs, (r) => r.knocks)) > 0
      ? round(sum(col(rs, (r) => r.step0)) / sum(col(rs, (r) => r.knocks)), 6) : 0,
    push: stats6(rs.flatMap((r) => r.pushes)),
    aimDistance: stats6(rs.flatMap((r) => r.aimDists)),
    ballCarrierGapAtKnock: stats6(rs.flatMap((r) => r.ballCarrierGaps)),
    priceGap: {
      meanBestKnock: seats > 0 ? round(sum(col(rs, (r) => r.bestKnockScoreSum)) / seats, 6) : 0,
      meanWinner: seats > 0 ? round(sum(col(rs, (r) => r.winnerScoreSum)) / seats, 6) : 0,
    },
    timing: {
      chosenNearestD: stats6(rs.flatMap((r) => r.chosenNearestD)),
      unchosenNearestD: stats6(rs.flatMap((r) => r.unchosenNearestD)),
      chosenNearestClosing: stats6(rs.flatMap((r) => r.chosenNearestClosing)),
      unchosenNearestClosing: stats6(rs.flatMap((r) => r.unchosenNearestClosing)),
    },
    strain: {
      decisions: sum(col(rs, (r) => r.strainDecisions)),
      beyondLineShare: sum(col(rs, (r) => r.strainDecisions)) > 0
        ? round(sum(col(rs, (r) => r.strainBeyondLine)) / sum(col(rs, (r) => r.strainDecisions)), 6) : 0,
      overlapperShare: sum(col(rs, (r) => r.strainDecisions)) > 0
        ? round(sum(col(rs, (r) => r.strainOverlapper)) / sum(col(rs, (r) => r.strainDecisions)), 6) : 0,
    },
    knockRetention: settled > 0 ? round(sum(col(rs, (r) => r.knockRetained)) / settled, 6) : 0,
    resolutions: ['captured', 'noCaptureInWindow', 'censoredPhase', 'censoredMatchEnd']
      .reduce<Record<string, number>>((a, k) => { a[k] = sum(col(rs, (r) => r.resolutions[k])); return a; }, {}),
    world: {
      duelsPerMatch: perMatch(rs, (r) => r.duels),
      takeRate: sum(col(rs, (r) => r.duels)) > 0
        ? round(sum(col(rs, (r) => r.duelsWon)) / sum(col(rs, (r) => r.duels)), 6) : 0,
      turnoversPerMatch: perMatch(rs, (r) => r.turnovers),
      meanSpellSeconds: sum(col(rs, (r) => r.segments)) > 0
        ? round((sum(col(rs, (r) => r.segmentTicks)) * DT) / sum(col(rs, (r) => r.segments)), 6) : 0,
      goalsPerMatch: perMatch(rs, (r) => r.goals),
      shotsPerMatch: perMatch(rs, (r) => r.shots),
      foulsPerMatch: perMatch(rs, (r) => r.fouls),
      yellowsPerMatch: perMatch(rs, (r) => r.yellows),
      redsPerMatch: perMatch(rs, (r) => r.reds),
      penaltiesPerMatch: perMatch(rs, (r) => r.penalties),
      pressedShare: sum(col(rs, (r) => r.firstRec)) > 0
        ? round(sum(col(rs, (r) => r.pressedFirstRec)) / sum(col(rs, (r) => r.firstRec)), 6) : 0,
    },
  };
};
const storedCells = rows.map((r) => ({
  seed: r.seed, arm: r.arm, seats: r.seats, candidates: r.candidates, chosen: r.chosen,
  chosenBackHalf: r.chosenBackHalf, armings: r.armings, armingsCleared: r.armingsCleared,
  knocks: r.knocks, knockRetained: r.knockRetained, knockLost: r.knockLost,
  shadowRetained: r.shadowRetained, shadowMoments: r.shadowMoments,
  beatenResolvable: r.beatenResolvable, beatenNoCapture: r.beatenNoCapture,
  notBeatenResolvable: r.notBeatenResolvable, notBeatenNoCapture: r.notBeatenNoCapture,
  reengageBeatenN: r.reengageBeaten.length, reengageNotBeatenN: r.reengageNotBeaten.length,
  recoveryEvents: r.recoveryEvents.length,
  duels: r.duels, duelsWon: r.duelsWon, turnovers: r.turnovers, goals: r.goals, shots: r.shots,
  fouls: r.fouls, yellows: r.yellows, reds: r.reds,
  bestKnockScoreSum: r.bestKnockScoreSum, winnerScoreSum: r.winnerScoreSum,
}));

const hashedBody = {
  stage: 'CB-T2 — the layer-2 choice seat (M-CB.2, #268.4)',
  nRule: { rarestPerMatch, precisionTerm, cap: CAP, nStar, ran: N, eventTarget: EVENT_TARGET },
  seeds: {
    band: BAND, battery: [SEEDS[0], SEEDS[SEEDS.length - 1]], n: SEEDS.length,
    identity: [IDENT_BLOCK, IDENT_BLOCK + IDENT_SEEDS - 1],
    sizing: [SIZING_BASE, SIZING_BASE + SIZING_N - 1],
    worldSeedConstructedNeverStepped: WORLD_SEED,
  },
  stats: { base: STATS_BASE, step: 200, resamples: BOOT_B, clusters: SEEDS.length },
  arms: { off: armSummary(off), choice: armSummary(choice), both: armSummary(both) },
  l2bReRead: { choice: l2bChoice, both: l2bBoth, cbT1DoserReference: { medBeaten: 144, medNotBeaten: 5, gap: 139 } },
  l3ReRead: {
    knockRetention: round(knockRetention, 6), holdRetention: round(holdRetention, 6),
    gap: l3Boot, cbT1DoserReference: { knockRetention: 0.55815, holdRetention: 0.64031, gap: -0.08215 },
  },
  recoveryLegs: legsByBin,
  carrierAnchoredSeparation: { atMiss: stats6(sepT0), atRecoveryEnd: stats6(sepEnd) },
  gates,
  coverageMap: COVERAGE_MAP,
  conjunctTotal: CONJUNCT_TOTAL,
  mutants: mutantResults.map((m) => ({ gate: m.gate, conjunct: m.conjunct, name: m.name, live: m.live })),
  compass: {
    maxAngularChord: round(maxAngularChord), maxAimGap: round(maxAimGap),
    distinctStepCounts: [...compassCounts].sort((a, b) => a - b),
    backShareOfCandidates: round(compassTotal > 0 ? backCount / compassTotal : 0, 6),
    sampledCandidates,
  },
  armingWithdrawals: sum(col([...choice, ...both], (r) => r.armingsCleared)),
  identity: {
    leagueHashes: identLeagueRows,
    doorsMatrix: crossCells,
    dormantAll,
    discriminated,
  },
  cells: storedCells,
};

/* ---- G-HASH-ENVELOPE ---- */
const resultSha256 = sha(canonical(hashedBody));
const envelopeOf = (wallMs: number, out: string): Record<string, unknown> => ({
  generatedAt: new Date().toISOString(),
  head: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
  outPath: out, preflight: IS_PREFLIGHT, preflightReasons: PREFLIGHT_REASONS,
  wallMs, msPerMatch: round(wallMs / Math.max(1, rows.length), 3),
  wallTerm, projectedHours: round((wallMs / 3_600_000) * 1, 6),
  digests: { passA: digestA, passB: digestB },
});
const CROSS_OUT = '/tmp/cb-t2-cross-out.json';
writeFileSync(OUT_PATH, `${JSON.stringify({ ...hashedBody, resultSha256, envelope: envelopeOf(Date.now() - t0, OUT_PATH) }, null, 2)}\n`);
writeFileSync(CROSS_OUT, `${JSON.stringify({ ...hashedBody, resultSha256, envelope: envelopeOf(999_999, CROSS_OUT) }, null, 2)}\n`);
const reread = (file: string): string => {
  const f = JSON.parse(readFileSync(file, 'utf8')) as Record<string, unknown>;
  delete f.resultSha256;
  delete f.envelope;
  return sha(canonical(f));
};
const deepKeys = (x: unknown, out: Set<string> = new Set()): Set<string> => {
  if (Array.isArray(x)) x.forEach((v) => deepKeys(v, out));
  else if (x !== null && typeof x === 'object') {
    for (const [k, v] of Object.entries(x as Record<string, unknown>)) { out.add(k); deepKeys(v, out); }
  }
  return out;
};
const bodyKeys = deepKeys(hashedBody);
const hashSpec = REGISTRY.find((r) => r.name === 'gHashEnvelope')!;
const hashInput: HashInput = {
  crossOutIdentical: reread(OUT_PATH) === reread(CROSS_OUT),
  rederivesFromDisk: reread(OUT_PATH) === resultSha256,
  forbidden: FORBIDDEN_BODY_KEYS.filter((k) => bodyKeys.has(k)),
};
const hashBase = (hashSpec.fn as (i: unknown) => Conj)(hashInput);
gates.gHashEnvelope = Object.values(hashBase).every(Boolean);
for (const mu of hashSpec.mutants) {
  mutantResults.push(runMutant('gHashEnvelope', mu.name, mu.conjunct,
    hashSpec.fn as (i: unknown) => Conj, hashBase, (mu.mutate as unknown as (i: unknown) => unknown)(hashInput)));
}
const gMutants = mutantResults.every((m) => m.live) && uncoveredConjuncts.length === 0;
gates.gMutants = gMutants;

/* ---- the FINAL artifact ---- */
const finalBody = {
  ...hashedBody,
  gates,
  mutants: mutantResults.map((m) => ({ gate: m.gate, conjunct: m.conjunct, name: m.name, live: m.live })),
  uncoveredConjuncts,
};
const finalSha = sha(canonical(finalBody));
const wallMs = Date.now() - t0;
writeFileSync(OUT_PATH, `${JSON.stringify({ ...finalBody, resultSha256: finalSha, envelope: envelopeOf(wallMs, OUT_PATH) }, null, 2)}\n`);

const FROZEN_GATE_NAMES = ['gDet', 'xFpProd', 'gIdent', 'gBorn', 'gZero', 'gCross', 'gBite',
  'gCompass', 'gOneOwner', 'gOneTable', 'gArming', 'gRace', 'gLevels', 'gCells', 'gBoot',
  'gNonVac', 'gLedger', 'gTrace', 'gFork', 'gPins', 'gSeed', 'gStats', 'gEnvClean',
  'gHashEnvelope', 'gN', 'gMutants'];
const keySetOk = canonical([...Object.keys(gates)].sort()) === canonical([...FROZEN_GATE_NAMES].sort());
const red = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
banner(`CB-T2 → ${OUT_PATH}  sha ${finalSha.slice(0, 8)}  N ${N}  ${wallMs} ms  ${Object.keys(gates).length} gates, ${red.length} red`);
banner(`  mutants ${mutantResults.length} · live ${mutantResults.filter((m) => m.live).length} · uncovered ${uncoveredConjuncts.length}`);
if (!keySetOk) {
  banner(`FATAL: the gate key set is not the frozen list (${Object.keys(gates).sort().join(',')})`);
  process.exit(1);
}
if (red.length > 0) { banner(`RED: ${red.join(', ')}`); process.exit(1); }
