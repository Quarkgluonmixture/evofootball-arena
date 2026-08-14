/**
 * CB T0 — THE DORMANT LAYER-1 SEAM (docs/world-model/CB-T0-DORMANT-LAYER1-SEAM.md).
 *
 * Contract CB-CARRY-BEAT-CONTRACT.md §2 M-CB.1 + §3 CB-T0, bound by #265.3, dispatched by
 * #266.5 (THE DEEPEST ENGINE CUT OF THE PROGRAMME SO FAR, declared). Every gate below is FROZEN
 * in the stage doc's §GATES — in ITS OWN COMMIT, before this file existed (#266.3(c)) — and
 * every number the doc publishes is quoted from this probe's artifact (#229.2).
 *
 * ⭐ #266.3(a): the HASHED canonical body excludes ALL invocation context — no timing, no date,
 * and NO PATH OR OUTPUT LOCATION — so `resultSha256` re-derives across differing `CBT0_OUT`
 * invocations. Paths, wall clocks and the head sha ride the UNHASHED envelope.
 *
 * ⭐ ENV SURFACE — WHITELISTED-OR-REFUSE (#261.2 / #262.2), including the ENGINE's own doors:
 *   accepted: CBT0_MODE (smoke|full, REQUIRED) · CBT0_N · CBT0_SMOKE_N · CBT0_SKIP_FP · CBT0_OUT
 * Any other `CBT0_*` variable is a FATAL refusal, and so is ANY engine door (EDS_BUNDLE,
 * EDS_TRACE_CHOICE, EMERGENT_POS, the five constants.ts scale doors). Every override that
 * changes WHAT IS MEASURED — CBT0_OUT included (#262.2) — makes the run a PREFLIGHT: routed onto
 * the guard block, G-CLEAN-INVOCATION goes RED, and a canonical repo path may never be written.
 *
 * RUN: CBT0_MODE=full npx tsx scripts/probes/cb-t0-dormant-layer1-seam.ts
 * EXIT: 0 = every HARD gate green · 1 = a gate is RED · 2 = a refusal.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve as pathResolve, sep as pathSep } from 'node:path';
import { League } from '../../src/sim/League';
import { Match, type MatchConfig } from '../../src/sim/Match';
import * as mech from '../../src/sim/mechanics';
import { runHeadless } from '../../src/sim/simRunner';
import { DT } from '../../src/sim/constants';
import {
  CB_TACKLE_RADIUS, beatsDefender, commitmentFactor, duelHorizon, overcommitSpeed,
  recoveryInterval, rolledDistance, touchPastPush, touchRaceWindow, type CbBody,
} from '../../src/sim/carryBeat';
import { a4MatchFlags } from '../../src/game/a4World';
import { GENE_KEYS, randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 FROZEN CONSTANTS                                                         */
/* ========================================================================== */
/** ⭐ INSTRUMENT-SIDE ONLY (#247): the probe may read the census; `src/**` may not. */
const CBC0_PATH = 'docs/world-model/data/cb-c0-dispossession-census.json';
const MECHANICS_PATH = 'src/sim/mechanics.ts';
const PLAYER_PATH = 'src/sim/Player.ts';
const SEAM_PATH = 'src/sim/carryBeat.ts';
const MATCH_PATH = 'src/sim/Match.ts';

const FINGERPRINT_SEASONS = 2;
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const LEAGUE_IDENT_BASELINES: readonly { seed: number; baseline: string }[] = [
  { seed: 1337, baseline: FINGERPRINT_BASELINE },
  { seed: 20260728, baseline: 'c6e319a45693424d707f0faeb2b5f7561955af9bd07a33e2da6a7f13533ff080' },
  { seed: 424242, baseline: '45d98c7441765fde680d1d42fcb228a7631416980bba40ec92b85be042a39f26' },
];

/**
 * ⭐ THE BANKED FLAG FAMILIES — every behaviour-bearing construction flag the programme has
 * banked, enumerated from `MatchConfig` itself (the doors matrix's other axis, G-CROSS).
 */
const BANKED_FLAGS = [
  'edsTouchCost', 'edsPerceivedDefence', 'edsPerceivedChoice', 'edsValueAxis',
  'edsEagerPerception', 'c5Hold', 'c5TouchFork', 'c4Flight', 'c4Arrival', 'c4ArrivalReroute',
  'c6Carry', 'c7Windup', 'o1PassWindup', 'o2Look', 'pmLaneConvergence', 'mtMarkSag',
  'ctbSupportPlane', 'obmMovement', 'ptpPassLead', 'dlcDeliveryChoice', 'dlcStrikePlane',
  'dvDeliveryValue', 'dvLearnedMap', 'ekHoldLearn', 'ekHoldVeto',
] as const;

/* ========================================================================== */
/* §2 ⭐ ENV — WHITELIST-OR-REFUSE + THE PREFLIGHT ROUTING                     */
/* ========================================================================== */
const ENV_WHITELIST = ['CBT0_MODE', 'CBT0_N', 'CBT0_SMOKE_N', 'CBT0_SKIP_FP', 'CBT0_OUT'] as const;
const ENGINE_DOORS = [
  'EDS_BUNDLE', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE',
] as const;
const rogue = Object.keys(process.env)
  .filter((k) => k.startsWith('CBT0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
if (rogue.length > 0) {
  console.error(`CB-T0 FATAL — unrecognised env override(s): ${rogue.join(', ')}. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse, #261.2).`);
  process.exit(2);
}
const engineDoorsSet = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (engineDoorsSet.length > 0) {
  console.error(`CB-T0 FATAL — the ENGINE's own env doors are set: ${engineDoorsSet.join(', ')}. `
    + 'This probe measures the shipped world and refuses a scaled or bundle-armed one (#262.2).');
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.CBT0_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`CB-T0 FATAL — CBT0_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const intEnv = (v: string | undefined): number | null => (v ? Math.max(1, Number.parseInt(v, 10)) : null);
const N_ENV = intEnv(process.env.CBT0_N);
const SMOKE_N_ENV = intEnv(process.env.CBT0_SMOKE_N);
const SKIP_FP = process.env.CBT0_SKIP_FP === '1';
const OUT_ENV = process.env.CBT0_OUT;
const OVERRIDES: { name: string; set: boolean }[] = [
  { name: 'CBT0_N', set: N_ENV !== null },
  { name: 'CBT0_SMOKE_N', set: SMOKE_N_ENV !== null },
  { name: 'CBT0_SKIP_FP', set: SKIP_FP },
  // ⭐ #262.2's THIRD-VISIT correction: an OUTPUT-PATH variable IS an override.
  { name: 'CBT0_OUT', set: OUT_ENV !== undefined },
];
const IS_PREFLIGHT = OVERRIDES.some((o) => o.set);
const PREFLIGHT_REASONS = OVERRIDES.filter((o) => o.set).map((o) => o.name);
const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/cb-t0-dormant-layer1-seam-smoke.json',
  full: 'docs/world-model/data/cb-t0-dormant-layer1-seam.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/cb-t0-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('CB-T0 FATAL — a PREFLIGHT invocation may not write a canonical repo path (the '
    + `canonical-write guard, #260.2(i)). Preflight because: ${PREFLIGHT_REASONS.join(' + ')}.`);
  process.exit(2);
}

/* ========================================================================== */
/* §3 SEED LEDGER (#163)                                                       */
/* ========================================================================== */
const GUARD_BLOCK = 12_472_050;
const RECEIPT_BLOCK = IS_PREFLIGHT ? GUARD_BLOCK : 12_472_000;
const READ_BASE = IS_PREFLIGHT ? GUARD_BLOCK + 20 : 12_472_020;
const SIZING_BASE = IS_PREFLIGHT ? GUARD_BLOCK + 30 : 12_472_100;
const SMOKE_BASE = IS_PREFLIGHT ? GUARD_BLOCK + 40 : 12_472_200;
const WORLD_SEED = 12_472_999;
const N = N_ENV ?? (MODE === 'smoke' ? 2 : 12);
const CROSS_N = Math.min(N, 2);
const SIZING_N = MODE === 'smoke' ? 2 : 20;
const SMOKE_CAP = 200;

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
  { name: '⭐ CB-C0 dispossession census (#265.4/#266)', range: [12_470_000, 12_471_799] },
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
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const srcFiles = (): string[] => {
  const out: string[] = [];
  const walk = (dir: string): void => {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (p.endsWith('.ts') || p.endsWith('.tsx')) out.push(p);
    }
  };
  walk('src');
  return out;
};

/* ========================================================================== */
/* §5 THE TWO WORLD SHAPES                                                     */
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

interface Arm {
  /** flag omitted entirely (`absent`) vs explicitly false vs true. */
  commit?: 'absent' | boolean;
  touch?: 'absent' | boolean;
  /** (A) the ARMED SUBSTRATE — the richest banked world the programme ships. */
  armedSubstrate?: boolean;
  /** one banked flag, for the doors matrix. */
  banked?: string;
  /** dose the probe-only touch-past seam (never a production behaviour). */
  dose?: boolean;
}
const matchOf = (seed: number, a: Arm): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
  ...(a.armedSubstrate === true ? a4MatchFlags(3) : {}),
  ...(a.banked !== undefined ? { [a.banked]: true } as Partial<MatchConfig> : {}),
  ...(a.commit === undefined || a.commit === 'absent' ? {} : { cbCommitPhysics: a.commit }),
  ...(a.touch === undefined || a.touch === 'absent' ? {} : { cbTouchPast: a.touch }),
});

/**
 * ⭐ THE TOUCH-PAST DOSER — the instrument's own driver, PUBLIC STATE ONLY (who owns the ball,
 * his role, the phase, a tick spacing), so an armed arm and an off arm dose exactly the same
 * moments. The DIRECTION is the instrument's: straight back down the carrier's own heading —
 * the half of the compass the incumbent push can never reach (CB-C0: the duel is frontal by
 * construction), which is the cheapest possible probe of "does the aimed knock work at all".
 * It prices nothing and chooses nothing: CB-T2 owns the seat (#266.5).
 */
const DOSE_SPACING = 60;
class TouchDoser {
  private since = DOSE_SPACING;

  preStep(m: Match): void {
    this.since += 1;
    if (this.since < DOSE_SPACING) return;
    const owner: Player | null = m.ball.owner;
    if (m.phase !== 'playing' || owner === null || owner.role === 'GK' || owner.sentOff) return;
    if (owner.kickCooldown > 0 || owner.gkHoldTimer > 0) return;
    m.forcedTouchPast = { gid: owner.gid, dir: { x: -owner.heading.x, y: -owner.heading.y } };
    this.since = 0;
  }
}

const runMatch = (m: Match, dose: boolean): void => {
  const doser = new TouchDoser();
  while (!m.finished) {
    if (dose) doser.preStep(m);
    m.step(DT);
  }
};

/** The whole-match signature, INCLUDING the rng stream state (the banked form). */
const signature = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
}));
/**
 * ⭐ A WITHIN-PASS MEMO. The doors matrix asks for the same arm many times over (the OFF world
 * alone is the reference for 25 banked flags), and re-walking it is wasted determinism. The memo
 * is CLEARED between the two G-DET passes (`walkMemo.clear()`), so pass B recomputes every walk
 * from scratch and the digest comparison stays a real double run, not a cache read.
 */
const walkMemo = new Map<string, string>();
const walk = (seed: number, a: Arm): string => {
  const key = `${seed}|${canonical(a)}`;
  const hit = walkMemo.get(key);
  if (hit !== undefined) return hit;
  const m = matchOf(seed, a);
  runMatch(m, a.dose === true);
  const sig = signature(m);
  walkMemo.set(key, sig);
  return sig;
};

/* ========================================================================== */
/* §6 THE ARMED OBSERVATION WALKER (the REPORTED smoke's instrument)           */
/* ========================================================================== */
/**
 * The per-match observation, walked identically in every arm. The duel populations are read
 * exactly as CB-C0 read them — a STRICT INCREASE of `tackleCooldown` across one step is a duel
 * mechanic firing, and the post value names which one — except that the armed arm's beaten
 * price is no longer the constant 1.2, so the classification uses the pair (won ⇒ 0.5) and
 * everything else that is not one of the four other mechanics' own constants.
 */
interface Obs {
  duelsWon: number; duelsMissed: number;
  missBySpeedBin: number[]; winBySpeedBin: number[];
  fouls: number; cards: number; sendOffs: number;
  turnovers: number; goals: number; shots: number;
  recoverySum: number; recoveryMax: number; stunSum: number;
  ledger: Record<string, number>;
  /** the arrival speeds of every tabulated lunge (bin edges are CB-C0's quarters of v*). */
  overcommittedMisses: number;
}
const SPEED_BINS = 5;
const speedBin = (v: number, vStar: number): number => {
  const q = vStar / 4;
  return Math.min(SPEED_BINS - 1, Math.floor(v / q));
};
const OTHER_MECHANIC_COOLDOWNS = [2.5, 2.0, 0.9];

function observe(seed: number, a: Arm): Obs {
  const m = matchOf(seed, a);
  const doser = new TouchDoser();
  const o: Obs = {
    duelsWon: 0, duelsMissed: 0,
    missBySpeedBin: Array.from({ length: SPEED_BINS }, () => 0),
    winBySpeedBin: Array.from({ length: SPEED_BINS }, () => 0),
    fouls: 0, cards: 0, sendOffs: 0,
    turnovers: 0, goals: 0, shots: 0,
    recoverySum: 0, recoveryMax: 0, stunSum: 0,
    ledger: {}, overcommittedMisses: 0,
  };
  const prevCd = new Map<number, number>();
  const prevSpeed = new Map<number, number>();
  let prevOwnerSide: number | null = null;
  for (const p of m.allPlayers) { prevCd.set(p.gid, p.tackleCooldown); prevSpeed.set(p.gid, 0); }
  while (!m.finished) {
    if (a.dose === true) doser.preStep(m);
    // the pre-step speeds are the ones the mechanic saw (it runs after `physicsStep`)
    for (const p of m.allPlayers) prevSpeed.set(p.gid, Math.hypot(p.vel.x, p.vel.y));
    m.step(DT);
    for (const p of m.allPlayers) {
      const before = prevCd.get(p.gid) ?? 0;
      const now = p.tackleCooldown;
      prevCd.set(p.gid, now);
      if (!(now > before)) continue;
      if (OTHER_MECHANIC_COOLDOWNS.some((c) => Math.abs(now - c) < 1e-9)) continue;
      const v = Math.hypot(p.vel.x, p.vel.y);
      const vStar = overcommitSpeed(p.accel);
      const bin = speedBin(v, vStar);
      if (Math.abs(now - 0.5) < 1e-9) { o.duelsWon++; o.winBySpeedBin[bin]++; continue; }
      // a MISS: the incumbent 1.2 constant, or the armed physics-derived interval
      o.duelsMissed++;
      o.missBySpeedBin[bin]++;
      if (v >= vStar) o.overcommittedMisses++;
      o.recoverySum += now;
      if (now > o.recoveryMax) o.recoveryMax = now;
      o.stunSum += p.stunTimer;
    }
    const owner = m.ball.owner;
    if (m.phase === 'playing' && owner !== null) {
      if (prevOwnerSide !== null && prevOwnerSide !== owner.side) o.turnovers++;
      prevOwnerSide = owner.side;
    } else if (m.phase !== 'playing') prevOwnerSide = null;
  }
  const stats = [m.teams[0].stats, m.teams[1].stats];
  o.fouls = stats[0].fouls + stats[1].fouls;
  o.cards = stats[0].yellows + stats[1].yellows + stats[0].reds + stats[1].reds;
  o.sendOffs = stats[0].reds + stats[1].reds;
  o.goals = m.score[0] + m.score[1];
  o.shots = stats[0].shots + stats[1].shots;
  o.ledger = { ...m.cbLedger };
  return o;
}
const zeroObs = (): Obs => ({
  duelsWon: 0, duelsMissed: 0,
  missBySpeedBin: Array.from({ length: SPEED_BINS }, () => 0),
  winBySpeedBin: Array.from({ length: SPEED_BINS }, () => 0),
  fouls: 0, cards: 0, sendOffs: 0, turnovers: 0, goals: 0, shots: 0,
  recoverySum: 0, recoveryMax: 0, stunSum: 0, ledger: {}, overcommittedMisses: 0,
});
const addObs = (a: Obs, b: Obs): Obs => {
  const out = zeroObs();
  out.duelsWon = a.duelsWon + b.duelsWon;
  out.duelsMissed = a.duelsMissed + b.duelsMissed;
  for (let i = 0; i < SPEED_BINS; i++) {
    out.missBySpeedBin[i] = a.missBySpeedBin[i] + b.missBySpeedBin[i];
    out.winBySpeedBin[i] = a.winBySpeedBin[i] + b.winBySpeedBin[i];
  }
  for (const k of ['fouls', 'cards', 'sendOffs', 'turnovers', 'goals', 'shots',
    'recoverySum', 'recoveryMax', 'stunSum', 'overcommittedMisses'] as const) {
    out[k] = k === 'recoveryMax' ? Math.max(a[k], b[k]) : a[k] + b[k];
  }
  const keys = new Set([...Object.keys(a.ledger), ...Object.keys(b.ledger)]);
  for (const k of keys) out.ledger[k] = (a.ledger[k] ?? 0) + (b.ledger[k] ?? 0);
  return out;
};

/* ========================================================================== */
/* §7 THE RECEIPTS CORE (run TWICE for G-DET)                                  */
/* ========================================================================== */
const SEEDS = Array.from({ length: N }, (_, i) => RECEIPT_BLOCK + i);
const SHAPES = [
  { tag: 'bare', arm: {} as Partial<Arm> },
  { tag: 'armedSubstrate', arm: { armedSubstrate: true } as Partial<Arm> },
] as const;

/* --- G-GEOMETRY's own sweep, ONE function every claim and every mutant re-invokes --- */
type GeomMutant = 'none' | 'distanceOnly' | 'noMomentum' | 'ignoreGap' | 'ignoreTurn'
  | 'ignoreSpeed' | 'randomBeat' | 'directionBlind' | 'unnormalised' | 'reachless';
const body = (px: number, py: number, vx: number, vy: number, accel = 14): CbBody =>
  ({ pos: { x: px, y: py }, vel: { x: vx, y: vy }, accel });

function chiOf(b: CbBody, ball: CbBody['pos'], ballVel: CbBody['vel'], mut: GeomMutant): number {
  if (mut === 'distanceOnly') {
    // the FAILED form the stage doc names: a χ that is a function of distance alone
    const d = Math.hypot(ball.x - b.pos.x, ball.y - b.pos.y);
    return Math.max(0, Math.min(1, (CB_TACKLE_RADIUS - d) / CB_TACKLE_RADIUS));
  }
  if (mut === 'noMomentum') return commitmentFactor({ ...b, vel: { x: 0, y: 0 } }, ball, ballVel);
  // the slack left in METRES instead of in units of the challenge radius — the perfect body
  // then reads R, not 1, and χ stops being a share of anything
  if (mut === 'unnormalised') return commitmentFactor(b, ball, ballVel) * CB_TACKLE_RADIUS;
  return commitmentFactor(b, ball, ballVel);
}
function recoveryOf(b: CbBody, ball: CbBody['pos'], facing: CbBody['vel'], mut: GeomMutant): number {
  const r = recoveryInterval(b, ball, facing);
  if (mut === 'ignoreGap') return r.brake + r.turn;
  if (mut === 'ignoreTurn') return r.brake + r.close;
  if (mut === 'ignoreSpeed') return r.turn + r.close;
  return r.total;
}
function beatsOf(
  ballPos: CbBody['pos'], dir: CbBody['vel'], speed: number, push: number, d: CbBody,
  mut: GeomMutant, rng?: Rng,
): boolean {
  if (mut === 'randomBeat') return (rng as Rng).chance(0.5);
  if (mut === 'directionBlind') {
    return beatsDefender(ballPos, { x: 1, y: 0 }, speed, push, d);
  }
  if (mut === 'reachless') {
    // the body must be ON the ball to the metre — his own control reach dropped from the test
    const window = touchRaceWindow(push);
    const steps = Math.ceil(window / DT);
    for (let i = 0; i <= steps; i++) {
      const t = Math.min(i * DT, window);
      const rolled = rolledDistance(speed, t);
      const bx = ballPos.x + dir.x * rolled;
      const by = ballPos.y + dir.y * rolled;
      const dx = bx - (d.pos.x + d.vel.x * t);
      const dy = by - (d.pos.y + d.vel.y * t);
      if (Math.hypot(dx, dy) < (d.accel * t * t) / 2) return false;
    }
    return true;
  }
  return beatsDefender(ballPos, dir, speed, push, d);
}

/** ⭐ THE ONE GEOMETRY SWEEP — every conjunct, returned as booleans. */
type GeomConjunct = 'antiCollapse' | 'overcommitPunished' | 'perfectIsOne'
  | 'recoveryMonotone' | 'touchDeterministic' | 'onBallNeverBeaten';
function geometrySweep(mut: GeomMutant): Record<GeomConjunct, boolean> {
  const rng = new Rng(90_210);
  // (i) ANTI-COLLAPSE: same distance, different velocity ⇒ different answer
  const ball = { x: 0, y: 0 };
  const bVel = { x: 4, y: 0 };
  const sameDistance = [0, 2, 4, 6, 8, 9].map((v) => chiOf(body(-1, 0, v, 0), ball, bVel, mut));
  const antiCollapse = new Set(sameDistance.map((x) => round(x, 9))).size > 1;
  // (ii) OVERCOMMITMENT: single-peaked in arrival speed, dying to 0, scaled by his own accel
  const chiAt = (v: number, a = 14): number => chiOf(body(1.2, 1, -v, 0, a), ball, { x: 0, y: 4 }, mut);
  const grid = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => chiAt(v));
  let argmax = 0;
  for (let i = 1; i < grid.length; i++) if (grid[i] > grid[argmax]) argmax = i;
  let tailFalls = true;
  for (let i = argmax + 1; i < grid.length; i++) if (grid[i] > grid[i - 1]) tailFalls = false;
  const overcommitPunished = argmax > 0 && argmax < grid.length - 1 && grid[argmax] > 0
    && tailFalls && grid[grid.length - 1] === 0 && chiAt(6, 16.8) > chiAt(6, 12.6);
  // (iii) the perfect body reads 1
  const perfectIsOne = chiOf(body(0, 0, 3, 0), { x: 0, y: 0 }, { x: 3, y: 0 }, mut) === 1;
  // (iv) the recovery is strictly increasing in each of its three inputs
  const target = { x: 1, y: 0 };
  const facing = { x: 1, y: 0 };
  const monotone = (xs: number[]): boolean => xs.every((x, i) => i === 0 || x > xs[i - 1]);
  const bySpeed = [0, 1, 2, 4, 6, 8].map((v) => recoveryOf(body(0, 0, v, 0), target, facing, mut));
  const byTurn = [0, 0.5, 1.2, 2.0, Math.PI]
    .map((ang) => recoveryOf(body(0, 0, 5 * Math.cos(ang), 5 * Math.sin(ang)), target, facing, mut));
  const byGap = [0.2, 0.6, 1.0, 1.15, 2.0]
    .map((d) => recoveryOf(body(0, 0, 3, 0), { x: d, y: 0 }, facing, mut));
  const recoveryMonotone = monotone(bySpeed) && monotone(byTurn) && monotone(byGap);
  // (v) the touch-past predicate is deterministic, direction- and momentum-dependent
  const push = touchPastPush(10, 0.5);
  const set = body(2.4, 0, 0, 0);
  const first = beatsOf(ball, { x: 1, y: 0 }, 5, push, set, mut, rng);
  let deterministic = true;
  for (let i = 0; i < 40; i++) {
    if (beatsOf(ball, { x: 1, y: 0 }, 5, push, set, mut, rng) !== first) deterministic = false;
  }
  const directionDependent = beatsOf(ball, { x: -1, y: 0 }, 5, push, set, mut, rng)
    !== beatsOf(ball, { x: 1, y: 0 }, 5, push, set, mut, rng);
  const momentumDependent = beatsOf(ball, { x: 1, y: 0 }, 5, push, body(2.4, 0, 0, 9), mut, rng)
    !== beatsOf(ball, { x: 1, y: 0 }, 5, push, set, mut, rng);
  // (vi) a body ON the ball is never beaten
  const onBallNeverBeaten = [0, 1, 2, 3, 4, 5].every((ang) => beatsOf(
    ball, { x: Math.cos(ang), y: Math.sin(ang) }, 6, push, body(0, 0, 0, 0), mut, rng,
  ) === false);
  return {
    antiCollapse,
    overcommitPunished,
    perfectIsOne,
    recoveryMonotone,
    touchDeterministic: deterministic && directionDependent && momentumDependent,
    onBallNeverBeaten,
  };
}

function receipts(): Record<string, unknown> {
  /* ---- G-OFF / G-BORN-B / G-BITE ---------------------------------------- */
  const offBorn = SEEDS.map((seed) => {
    const row: Record<string, unknown> = { seed };
    for (const shape of SHAPES) {
      const off = walk(seed, { ...shape.arm });
      const flagsFalse = walk(seed, { commit: false, touch: false, ...shape.arm });
      const touchAlone = walk(seed, { touch: true, ...shape.arm });
      const commitArmed = walk(seed, { commit: true, ...shape.arm });
      const dosed = matchOf(seed, { touch: true, ...shape.arm });
      runMatch(dosed, true);
      row[shape.tag] = {
        gOff: off === flagsFalse,
        gBornB: off === touchAlone,
        dosedTouchPasts: dosed.cbLedger.touchPasts,
        dosedBeaten: dosed.cbLedger.touchPastBeaten,
        dosedChallengers: dosed.cbLedger.touchPastChallengers,
        dosedCleanBeats: dosed.cbLedger.touchPastCleanBeats,
        gBite: commitArmed !== off,
      };
    }
    return row;
  });
  const shapeRow = (r: Record<string, unknown>, tag: string): Record<string, number | boolean> =>
    r[tag] as Record<string, number | boolean>;
  const gOff = offBorn.every((r) => SHAPES.every((s) => shapeRow(r, s.tag).gOff === true));
  const gBornIdentical = offBorn.every((r) => SHAPES.every((s) => shapeRow(r, s.tag).gBornB === true));
  const gBornLive = offBorn.every((r) => SHAPES.every((s) => (shapeRow(r, s.tag).dosedTouchPasts as number) > 0));
  const gBornB = gBornIdentical && gBornLive;
  const gBite = offBorn.every((r) => SHAPES.every((s) => shapeRow(r, s.tag).gBite === true));

  /* ---- ⭐⭐ G-CROSS — the doors matrix vs EVERY banked flag family --------- */
  const crossSeeds = SEEDS.slice(0, CROSS_N);
  const crossRows = BANKED_FLAGS.map((flag) => {
    let absentEqFalse = true;
    let absentEqTouchDoor = true;
    let bankedMovesWorld = false;
    for (const seed of crossSeeds) {
      const bankedOnly = walk(seed, { banked: flag });
      if (bankedOnly !== walk(seed, { banked: flag, commit: false, touch: false })) absentEqFalse = false;
      if (bankedOnly !== walk(seed, { banked: flag, touch: true })) absentEqTouchDoor = false;
      if (bankedOnly !== walk(seed, {})) bankedMovesWorld = true;
    }
    return { flag, absentEqFalse, absentEqTouchDoor, bankedMovesWorld };
  });
  const dormantAll = crossSeeds.every((seed) => walk(seed, {}) === walk(seed, { commit: false, touch: false }));
  // ⭐ DISCRIMINATION: an armed-commitment world is not any banked flag's world
  const discrimination = crossSeeds.every((seed) => {
    const armed = walk(seed, { commit: true });
    return BANKED_FLAGS.every((flag) => walk(seed, { banked: flag }) !== armed);
  });
  const gCross = crossRows.every((r) => r.absentEqFalse && r.absentEqTouchDoor)
    && dormantAll && discrimination;

  /* ---- ⭐⭐ G-GEOMETRY + its mutants ------------------------------------- */
  const geomBase = geometrySweep('none');
  const GEOM_MUTANTS = ([
    { name: 'χ collapses to DISTANCE ONLY', mut: 'distanceOnly', conjunct: 'antiCollapse' },
    { name: 'χ ignores the taker\'s own momentum', mut: 'noMomentum', conjunct: 'overcommitPunished' },
    { name: 'recovery drops the CLOSE leg', mut: 'ignoreGap', conjunct: 'recoveryMonotone' },
    { name: 'recovery drops the TURN leg', mut: 'ignoreTurn', conjunct: 'recoveryMonotone' },
    { name: 'recovery drops the BRAKE leg', mut: 'ignoreSpeed', conjunct: 'recoveryMonotone' },
    { name: 'the touch-past becomes a COIN FLIP', mut: 'randomBeat', conjunct: 'touchDeterministic' },
    { name: 'the touch-past ignores the chosen DIRECTION', mut: 'directionBlind', conjunct: 'touchDeterministic' },
    { name: 'χ left UNNORMALISED (metres, not a share of the radius)', mut: 'unnormalised', conjunct: 'perfectIsOne' },
    { name: 'the beat test drops the body\'s own CONTROL REACH', mut: 'reachless', conjunct: 'onBallNeverBeaten' },
  ] as const).map(({ name, mut, conjunct }) => {
    const swept = geometrySweep(mut);
    return { name, conjunct, flipped: swept[conjunct as GeomConjunct] === false, swept };
  });
  const geomConjuncts = Object.keys(geomBase);
  const geomCovered = new Set(GEOM_MUTANTS.map((m) => m.conjunct));
  const geomUncovered = geomConjuncts.filter((c) => !geomCovered.has(c as never));
  const gGeometry = Object.values(geomBase).every(Boolean) && GEOM_MUTANTS.every((m) => m.flipped);

  /* ---- ⭐ G-MATH --------------------------------------------------------- */
  const mathRows = [12.6, 13.4, 14, 15.2, 16.8].map((a) => {
    const t = duelHorizon(a);
    return {
      accel: a,
      discIsRadius: Math.abs((a * t * t) / 2 - CB_TACKLE_RADIUS) < 1e-12,
      vStarIdentity: Math.abs((overcommitSpeed(a) ** 2) / (2 * a) - CB_TACKLE_RADIUS) < 1e-12,
      horizonIsBrakeTime: Math.abs(overcommitSpeed(a) / a - t) < 1e-12,
    };
  });
  // `rolledDistance` vs the engine's own per-tick decay, integrated on DT
  let integrated = 0;
  let v = 6;
  const H = 0.4;
  for (let t = 0; t < H - 1e-12; t += DT) {
    integrated += v * DT;
    v *= Math.exp(-0.55 * DT);
  }
  const closedForm = rolledDistance(6, H);
  const gMathRows = {
    identities: mathRows.every((r) => r.discIsRadius && r.vStarIdentity && r.horizonIsBrakeTime),
    decayMatchesIntegration: Math.abs(closedForm - integrated) < 0.02,
  };
  const gMath = Object.values(gMathRows).every(Boolean);

  /* ---- ⭐ G-NORNG -------------------------------------------------------- */
  const rngSeed = READ_BASE;
  const rngMatch = matchOf(rngSeed, { touch: true });
  let touched = false;
  let rngBefore = 0;
  let rngAfter = 0;
  while (!rngMatch.finished && !touched) {
    const owner = rngMatch.ball.owner;
    if (owner !== null && owner.role !== 'GK' && rngMatch.phase === 'playing'
      && owner.kickCooldown <= 0 && rngMatch.forcedTouchPast === null) {
      // drive the touch DIRECTLY at the head of the very next step and read the stream around it
      rngMatch.forcedTouchPast = { gid: owner.gid, dir: { x: -owner.heading.x, y: -owner.heading.y } };
      rngBefore = (rngMatch.rng as unknown as { s: number }).s;
      const before = rngMatch.cbLedger.touchPasts;
      // the fork lives in `stepBall`; call the mechanic itself so nothing else can draw
      mech.performTouchPast(rngMatch, owner, rngMatch.forcedTouchPast.dir);
      rngAfter = (rngMatch.rng as unknown as { s: number }).s;
      touched = rngMatch.cbLedger.touchPasts > before;
      rngMatch.forcedTouchPast = null;
      break;
    }
    rngMatch.step(DT);
  }
  const seamSrc = readFileSync(SEAM_PATH, 'utf8');
  const mechSrc = readFileSync(MECHANICS_PATH, 'utf8');
  const executableOf = (src: string): string => src.split('\n')
    .filter((l) => !l.trim().startsWith('*') && !l.trim().startsWith('/*')
      && !l.trim().startsWith('//') && !l.trim().startsWith('*/'))
    .join('\n');
  const armedDuelBlock = mechSrc.slice(
    mechSrc.indexOf('const cbArmed = match.cbCommitPhysics;'),
    mechSrc.indexOf('if (match.rng.chance(p)) {', mechSrc.indexOf('const cbArmed')),
  );
  const touchFnBody = mechSrc.slice(
    mechSrc.indexOf('export function performTouchPast'),
    mechSrc.indexOf('const CB_CHALLENGER_RANGE'),
  );
  const gNoRngRows = {
    touchFired: touched,
    touchDrawsNothing: rngBefore === rngAfter,
    armedDuelBlockHasNoRng: !armedDuelBlock.includes('rng'),
    touchFnHasNoRng: !touchFnBody.includes('rng'),
    seamModuleHasNoRng: !executableOf(seamSrc).includes('rng'),
    /** the armed take still calls `rng.chance` exactly ONCE per challenge, as the incumbent does */
    oneChanceCallPerChallenge:
      (mechSrc.match(/if \(match\.rng\.chance\(p\)\) \{/g) ?? []).length === 1,
  };
  const gNoRng = Object.values(gNoRngRows).every(Boolean);

  /* ---- G-LEDGER ---------------------------------------------------------- */
  const prodLedger = matchOf(READ_BASE + 1, {});
  runMatch(prodLedger, false);
  const substrateLedger = matchOf(READ_BASE + 2, { armedSubstrate: true });
  runMatch(substrateLedger, false);
  const armedLedgerMatch = matchOf(READ_BASE + 3, { commit: true, touch: true });
  runMatch(armedLedgerMatch, true);
  const allZero = (l: Record<string, number>): boolean => Object.values(l).every((x) => x === 0);
  const gLedgerRows = {
    zeroInProduction: allZero({ ...prodLedger.cbLedger }),
    zeroInArmedSubstrate: allZero({ ...substrateLedger.cbLedger }),
    armedIsNonVacuous: armedLedgerMatch.cbLedger.armedChallenges > 0
      && armedLedgerMatch.cbLedger.recoveries > 0
      && armedLedgerMatch.cbLedger.touchPasts > 0,
  };
  const gLedger = Object.values(gLedgerRows).every(Boolean);

  /* ---- G-TRACE ----------------------------------------------------------- */
  const playerSrc = readFileSync(PLAYER_PATH, 'utf8');
  const cooldownWrites = (mechSrc.match(/\.tackleCooldown = /g) ?? []).length;
  const gTraceRows = {
    tackleRadiusLiteral: mechSrc.includes('if (d < 1.15 && d < best)') && CB_TACKLE_RADIUS === 1.15,
    accelConstant: playerSrc.includes('const ACCEL = 14;'),
    perBodyAccel: playerSrc.includes('ACCEL * (0.9 + attrs.pace * 0.2)'),
    turnRateExported: playerSrc.includes('export const TURN_RATE = 6.5;'),
    seamImportsConstants: seamSrc.includes("from './constants'") && seamSrc.includes("from './Player'"),
    pushLawVerbatim: mechSrc.includes('(TOUCH_PUSH_BASE + open * TOUCH_PUSH_SPACE) * (1.05 - p.attrs.dribbling * 0.15)')
      && mechSrc.includes('Math.min(Math.max(aheadD - 2, 0), 9)')
      && seamSrc.includes('(TOUCH_PUSH_BASE + open * TOUCH_PUSH_SPACE) * (1.05 - dribbling * 0.15)')
      && seamSrc.includes('Math.min(Math.max(openAhead - 2, 0), 9)'),
    incumbentMissPriceSurvives: mechSrc.includes('tackler.tackleCooldown = 1.2;')
      && mechSrc.includes('tackler.stunTimer = 0.35;'),
    /** ⭐ CB-C0 counted SIX writers; this seam adds exactly ONE. */
    sevenCooldownWriters: cooldownWrites === 7,
  };
  const gTrace = Object.values(gTraceRows).every(Boolean);

  /* ---- ⭐ G-EPI ---------------------------------------------------------- */
  const seamExecutable = executableOf(seamSrc);
  const FORBIDDEN = ['Match', 'match.', 'Team', 'rng', 'readFileSync', 'docs/', 'import(',
    'process.env', 'genome', 'attrs'];
  const epiHits = FORBIDDEN.filter((n) => seamExecutable.includes(n));
  const importLines = (seamSrc.match(/from '[^']+';/g) ?? []);
  const gEpiRows = {
    forbiddenNamesAbsent: epiHits.length === 0,
    importsOnlyTwoModules: importLines.length === 2
      && importLines.every((l) => l === "from './constants';" || l === "from './Player';"),
  };
  const gEpi = Object.values(gEpiRows).every(Boolean);

  /* ---- ⭐⭐ G-NOTABLE — the #247 split ------------------------------------ */
  const census = JSON.parse(readFileSync(CBC0_PATH, 'utf8'));
  const needles = new Set<string>();
  let excludedByFloor = 0;
  const collect = (x: unknown): void => {
    if (typeof x === 'number') {
      if (!Number.isFinite(x)) return;
      const raw = x.toString();
      const dec = raw.includes('.') ? raw.split('.')[1].length : 0;
      // ⭐ THE DECLARED FLOOR: fewer than FOUR decimals collides with ordinary engine constants
      // by arithmetic accident (EK-T0's own three-decimal floor, tightened by one place after a
      // preflight measured 3-dp forms colliding with shipped coefficients — §DEV).
      if (dec < 4) { excludedByFloor++; return; }
      needles.add(x.toFixed(5));
      needles.add((x * 100).toFixed(3));
      return;
    }
    if (Array.isArray(x)) { for (const y of x) collect(y); return; }
    if (x !== null && typeof x === 'object') { for (const y of Object.values(x)) collect(y); }
  };
  // the PUBLISHED tables only — the values a reader of the census could copy (the per-cluster
  // cells are raw storage, not published numbers, and are excluded by declaration)
  const published = { ...(census.result ?? {}) } as Record<string, unknown>;
  delete published.perClusterCells;
  collect(published);
  const files = srcFiles();
  const blobs = files.map((f) => readFileSync(f, 'utf8'));
  const allSrc = blobs.join('\n');
  /** ⭐ A needle must match a WHOLE number, not a prefix of a longer one: `0.584` occurring
   *  inside a banked prior table's `0.5846153…` is an arithmetic accident, not a leak. */
  const valueHits = [...needles].filter((n) => new RegExp(
    `${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![0-9])`,
  ).test(allSrc));
  const CONTROL_NEEDLE = '1.15';
  const gNotableRows = {
    noValueHits: valueHits.length === 0,
    noArtifactName: !allSrc.includes('cb-c0-dispossession-census'),
    noDocPathInSeam: !seamSrc.includes('docs/world-model/data'),
    controlNeedleFound: allSrc.includes(CONTROL_NEEDLE),
    needlesNonVacuous: needles.size > 100,
  };
  const gNotable = Object.values(gNotableRows).every(Boolean);

  /* ---- G-HYGIENE --------------------------------------------------------- */
  const a4Src = readFileSync('src/game/a4World.ts', 'utf8');
  const matchSrc = readFileSync(MATCH_PATH, 'utf8');
  const freshMatch = new Match({ seed: WORLD_SEED, teamA: team('A', 1), teamB: team('B', 2) });
  const leagueForMatch = new League({ seed: 4242 });
  const leagueMatch = leagueForMatch.createMatch(leagueForMatch.fixtures[0]);
  const seamLines = matchSrc.split('\n').filter((l) => l.includes('cbCommitPhysics') || l.includes('cbTouchPast'));
  const gHygieneRows = {
    absentFromA4: !a4Src.includes('cbCommitPhysics') && !a4Src.includes('cbTouchPast'),
    defaultFalseInit: matchSrc.includes('this.cbCommitPhysics = cfg.cbCommitPhysics ?? false;')
      && matchSrc.includes('this.cbTouchPast = cfg.cbTouchPast ?? false;'),
    freshMatchOff: freshMatch.cbCommitPhysics === false && freshMatch.cbTouchPast === false
      && freshMatch.forcedTouchPast === null,
    leagueMatchOff: leagueMatch.cbCommitPhysics === false && leagueMatch.cbTouchPast === false,
    noEnvDoorOnSeamLines: seamLines.every((l) => !l.includes('process.env') && !l.includes('envArmed')
      && !l.includes('EDS_BUNDLE_ARMED')),
    noNewGeneKey: !GENE_KEYS.some((k) => String(k).toLowerCase().includes('cb')
      || String(k).toLowerCase().includes('carry') || String(k).toLowerCase().includes('touchpast')),
    neverSerialized: !JSON.stringify(new League({ seed: 99 }).toJSON()).includes('cbLedger'),
    envWhitelistEnforced: ENV_WHITELIST.length === 5 && ENGINE_DOORS.length === 9,
  };
  const gHygiene = Object.values(gHygieneRows).every(Boolean);

  /* ---- G-FORK ------------------------------------------------------------ */
  const occurrences: { file: string; line: number; text: string; klass: string }[] = [];
  const classify = (file: string, text: string): string => {
    const t = text.trim();
    if (file === MECHANICS_PATH && t.startsWith('const cbArmed = match.cbCommitPhysics;')) return 'FORK-1-duel';
    if (file === MATCH_PATH && t.startsWith('this.cbTouchPast &&')) return 'FORK-2-touch';
    if (file === MATCH_PATH && t.startsWith('this.cbCommitPhysics = cfg.')) return 'init';
    if (file === MATCH_PATH && t.startsWith('this.cbTouchPast = cfg.')) return 'init';
    if (t.startsWith('cbCommitPhysics?:') || t.startsWith('cbTouchPast?:')) return 'declaration';
    if (t.startsWith('readonly cbCommitPhysics') || t.startsWith('readonly cbTouchPast')) return 'declaration';
    if (file === 'src/sim/League.ts') return 'league-union-key';
    if (t.startsWith('*') || t.startsWith('//') || t.startsWith('/*')) return 'comment';
    if (t.includes('cbArmed')) return 'guarded-use';
    return 'UNCLASSIFIED';
  };
  for (let i = 0; i < files.length; i++) {
    const lines = blobs[i].split('\n');
    for (let j = 0; j < lines.length; j++) {
      if (!lines[j].includes('cbCommitPhysics') && !lines[j].includes('cbTouchPast')) continue;
      occurrences.push({ file: files[i], line: j + 1, text: lines[j].trim().slice(0, 90), klass: classify(files[i], lines[j]) });
    }
  }
  const forkCount = (k: string): number => occurrences.filter((o) => o.klass === k).length;
  const touchPastCalls = (matchSrc.match(/mech\.performTouchPast\(/g) ?? []).length;
  const forcedConsumed = matchSrc.includes('this.forcedTouchPast = null;');
  const gForkRows = {
    oneDuelFork: forkCount('FORK-1-duel') === 1,
    oneTouchFork: forkCount('FORK-2-touch') === 1,
    twoInits: forkCount('init') === 2,
    oneTouchCallSite: touchPastCalls === 1,
    armingIsConsumed: forcedConsumed,
    zeroUnclassified: forkCount('UNCLASSIFIED') === 0,
  };
  const gFork = Object.values(gForkRows).every(Boolean);

  /* ---- G-PINS ------------------------------------------------------------ */
  const diffNames = execSync('git diff --name-only HEAD~1 HEAD -- src tests', { encoding: 'utf8' })
    .split('\n').map((s) => s.trim()).filter(Boolean);
  const untouched = (p: string): boolean =>
    execSync(`git diff --stat HEAD~1 HEAD -- ${p}`, { encoding: 'utf8' }).trim() === '';
  const gPinsRows = {
    srcDiffConfined: diffNames.filter((f) => f.startsWith('src/')).every((f) => [
      'src/sim/carryBeat.ts', 'src/sim/mechanics.ts', 'src/sim/Match.ts', 'src/sim/League.ts',
    ].includes(f)),
    whetherEyeUntouched: untouched('src/ai/whetherEye.ts'),
    holdBookUntouched: untouched('src/ai/holdAccountBook.ts'),
    deliveryBookUntouched: untouched('src/ai/deliveryAccountBook.ts'),
    a4WorldUntouched: untouched('src/game/a4World.ts'),
    playerBrainUntouched: untouched('src/ai/PlayerBrain.ts'),
    onlyNewTestFile: diffNames.filter((f) => f.startsWith('tests/'))
      .every((f) => f === 'tests/carryBeat.test.ts'),
  };
  const gPins = Object.values(gPinsRows).every(Boolean);

  /* ---- G-SEED ------------------------------------------------------------ */
  const intervals: { name: string; lo: number; hi: number }[] = [
    { name: 'receipts', lo: RECEIPT_BLOCK, hi: RECEIPT_BLOCK + N - 1 },
    { name: 'reads', lo: READ_BASE, hi: READ_BASE + 9 },
    { name: 'sizing', lo: SIZING_BASE, hi: SIZING_BASE + SIZING_N - 1 },
    { name: 'world', lo: WORLD_SEED, hi: WORLD_SEED },
  ];
  const clash = (lo: number, hi: number): string | null => {
    for (const c of CONSUMED) if (lo <= c.range[1] && hi >= c.range[0]) return c.name;
    return null;
  };
  const seedRows = intervals.map((iv) => ({ ...iv, clash: clash(iv.lo, iv.hi) }));
  const ordered = intervals.every((iv, i) => i === 0 || iv.lo > intervals[i - 1].hi);
  const gSeed = seedRows.every((r) => r.clash === null) && ordered;

  return {
    gOff, gBornB, gBite, gCross, gGeometry, gMath, gNoRng, gLedger, gTrace, gEpi, gNotable,
    gHygiene, gFork, gPins, gSeed,
    detail: {
      offBorn,
      cross: { rows: crossRows, dormantAll, discrimination, seeds: crossSeeds.length },
      geometry: { base: geomBase, mutants: GEOM_MUTANTS.map((m) => ({ name: m.name, conjunct: m.conjunct, flipped: m.flipped })), conjuncts: geomConjuncts, uncoveredConjuncts: geomUncovered },
      math: { rows: mathRows, ...gMathRows, closedForm: round(closedForm), integrated: round(integrated) },
      noRng: { ...gNoRngRows, rngBefore, rngAfter },
      ledger: { ...gLedgerRows, armed: { ...armedLedgerMatch.cbLedger } },
      trace: { ...gTraceRows, cooldownWrites },
      epi: { ...gEpiRows, importLines },
      notable: { ...gNotableRows, needles: needles.size, excludedByFloor, srcFiles: files.length, valueHits },
      hygiene: gHygieneRows,
      fork: { ...gForkRows, occurrences },
      pins: { ...gPinsRows, diffNames },
      seed: { rows: seedRows, ordered },
    },
  };
}

/* ========================================================================== */
/* §8 THE REPORTED SMOKE + THE N RULE                                          */
/* ========================================================================== */
interface SmokeOut {
  n: number; block: [number, number];
  arms: Record<string, Obs>;
  perSeed: Record<string, unknown>[];
}
function smoke(base: number, n: number): SmokeOut {
  const arms: Record<string, Obs> = { off: zeroObs(), commit: zeroObs(), touch: zeroObs() };
  const perSeed: Record<string, unknown>[] = [];
  for (let i = 0; i < n; i++) {
    const seed = base + i;
    const off = observe(seed, {});
    const commit = observe(seed, { commit: true });
    const touch = observe(seed, { touch: true, dose: true });
    arms.off = addObs(arms.off, off);
    arms.commit = addObs(arms.commit, commit);
    arms.touch = addObs(arms.touch, touch);
    perSeed.push({
      seed,
      off: { won: off.duelsWon, missed: off.duelsMissed, fouls: off.fouls, turnovers: off.turnovers, goals: off.goals },
      commit: { won: commit.duelsWon, missed: commit.duelsMissed, fouls: commit.fouls, turnovers: commit.turnovers, goals: commit.goals, overcommittedMisses: commit.overcommittedMisses },
      touch: { touchPasts: touch.ledger.touchPasts ?? 0, beaten: touch.ledger.touchPastBeaten ?? 0, challengers: touch.ledger.touchPastChallengers ?? 0, cleanBeats: touch.ledger.touchPastCleanBeats ?? 0, goals: touch.goals },
    });
  }
  return { n, block: [base, base + n - 1], arms, perSeed };
}

/* ========================================================================== */
/* §9 RUN                                                                      */
/* ========================================================================== */
const t0 = Date.now();
banner(`CB-T0 · mode=${MODE} · N=${N}${IS_PREFLIGHT ? ` · PREFLIGHT (${PREFLIGHT_REASONS.join('+')})` : ''}`);
const passA = receipts();
walkMemo.clear(); // ⭐ pass B never reads pass A's work
const passB = receipts();
const digestA = sha(canonical(passA));
const digestB = sha(canonical(passB));
const gDet = digestA === digestB;

/* ---- G-IDENT / X-FP-PROD ------------------------------------------------- */
const identRows = SKIP_FP ? [] : LEAGUE_IDENT_BASELINES.map(({ seed, baseline }) => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  const observed = sha(JSON.stringify(out.league));
  return { seed, baseline, observed, match: observed === baseline };
});
const gIdent = !SKIP_FP && identRows.every((r) => r.match);
const xFpProd = !SKIP_FP && identRows[0]?.observed === FINGERPRINT_BASELINE;

/* ---- the sizing smoke + the frozen N rule -------------------------------- */
const sizingT0 = Date.now();
const sizing = smoke(SIZING_BASE, SIZING_N);
const sizingMs = Date.now() - sizingT0;
const msPerMatch = sizingMs / (SIZING_N * 3);
const rarestPerMatch = sizing.arms.commit.overcommittedMisses / SIZING_N;
const precisionTerm = rarestPerMatch > 0 ? Math.max(25, Math.ceil(60 / rarestPerMatch)) : Infinity;
const wallTerm = Math.floor((0.5 * 3_600_000) / (msPerMatch * 3 * 2));
const nStar = Math.min(precisionTerm, wallTerm, SMOKE_CAP);
const SMOKE_N = SMOKE_N_ENV ?? (MODE === 'smoke' ? 2 : nStar);
const gNDerived = SMOKE_N_ENV === null ? SMOKE_N === nStar : false;

const armed = smoke(SMOKE_BASE, SMOKE_N);
const gCleanInvocation = !IS_PREFLIGHT;

const gates: Record<string, boolean> = {
  gIdent, xFpProd, gOff: passA.gOff as boolean, gBornB: passA.gBornB as boolean,
  gCross: passA.gCross as boolean, gBite: passA.gBite as boolean,
  gGeometry: passA.gGeometry as boolean, gMath: passA.gMath as boolean,
  gNoRng: passA.gNoRng as boolean, gLedger: passA.gLedger as boolean,
  gTrace: passA.gTrace as boolean, gEpi: passA.gEpi as boolean,
  gNotable: passA.gNotable as boolean, gHygiene: passA.gHygiene as boolean,
  gFork: passA.gFork as boolean, gPins: passA.gPins as boolean,
  gCleanInvocation, gNDerived, gSeed: passA.gSeed as boolean, gDet,
  gMutants: (passA.detail as Record<string, any>).geometry.uncoveredConjuncts.length === 0
    && (passA.detail as Record<string, any>).geometry.mutants.every((m: any) => m.flipped),
};

/** ⭐ #266.3(a): the HASHED body carries NO invocation context — no path, no timing, no date. */
const hashedBody = {
  schema: 'cb-t0-dormant-layer1-seam/v1',
  mode: MODE,
  seeds: { receipts: [RECEIPT_BLOCK, RECEIPT_BLOCK + N - 1], reads: READ_BASE, sizing: sizing.block, armed: armed.block, world: WORLD_SEED },
  gates,
  ident: identRows,
  detail: passA.detail,
  nRule: {
    rule: 'N* = min( ceil(60 / rarestArmedCellPerMatch) ↑25, floor(0.5h / (ms/match × 3 arms × 2 X-DET)), 200 )',
    numerator: 'a MISSED standing challenge in the OVERCOMMITTED arrival bin (v ≥ sqrt(2·a·R), the body\'s own a), commitment-armed arm',
    rarestPerMatch: round(rarestPerMatch),
    precisionTerm: Number.isFinite(precisionTerm) ? precisionTerm : null,
    wallTerm, cap: SMOKE_CAP, nStar, ran: SMOKE_N,
  },
  sizing: { n: sizing.n, block: sizing.block, overcommittedMisses: sizing.arms.commit.overcommittedMisses },
  smoke: {
    n: armed.n, block: armed.block,
    arms: Object.fromEntries(Object.entries(armed.arms).map(([k, o]) => [k, {
      duelsWon: o.duelsWon, duelsMissed: o.duelsMissed,
      takeRate: o.duelsWon + o.duelsMissed > 0 ? round(o.duelsWon / (o.duelsWon + o.duelsMissed)) : null,
      missBySpeedBin: o.missBySpeedBin, winBySpeedBin: o.winBySpeedBin,
      overcommittedMisses: o.overcommittedMisses,
      fouls: o.fouls, cards: o.cards, sendOffs: o.sendOffs,
      turnovers: o.turnovers, goals: o.goals, shots: o.shots,
      meanRecovery: o.duelsMissed > 0 ? round(o.recoverySum / o.duelsMissed) : null,
      maxRecovery: round(o.recoveryMax), meanStun: o.duelsMissed > 0 ? round(o.stunSum / o.duelsMissed) : null,
      ledger: o.ledger,
    }])),
    perSeed: armed.perSeed,
  },
};
const resultSha256 = sha(canonical(hashedBody));
const allGreen = Object.values(gates).every(Boolean);

const artifact = {
  ...hashedBody,
  resultSha256,
  /** ⭐ THE UNHASHED ENVELOPE (#258.3 / #266.3(a)): every invocation fact lives here. */
  envelope: {
    generatedAt: new Date().toISOString(),
    head: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
    outPath: OUT_PATH,
    preflight: IS_PREFLIGHT,
    preflightReasons: PREFLIGHT_REASONS,
    wallMs: Date.now() - t0,
    msPerMatch: round(msPerMatch, 2),
    digestA, digestB,
  },
};
writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);
const red = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
banner(red.length === 0
  ? `GATES GREEN (${Object.keys(gates).length}) · resultSha256 ${resultSha256} · ${OUT_PATH}`
  : `GATES *** RED ***: ${red.join(', ')} (${Object.keys(gates).length - red.length}/${Object.keys(gates).length}) · ${OUT_PATH}`);
process.exit(allGreen ? 0 : 1);
