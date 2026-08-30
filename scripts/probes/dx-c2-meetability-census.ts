/**
 * ⭐⭐ DX-C2 — THE MEETABILITY CENSUS (docs/world-model/DX-C2-MEETABILITY-CENSUS.md).
 *
 * Authorized by COMMANDER RULING #359 item 2 (the user's #358-fork election, verbatim:
 * 「①′ 接应时间入价」), bound by docs/world-model/DX-DELIVERY-EXECUTION-CONTRACT.md.
 * Predecessors: docs/world-model/DX-C1-ARRIVAL-CENSUS.md (the instrument family this census
 * adapts; artifact docs/world-model/data/dx-c1-arrival-census.json) and
 * docs/world-model/DX-T2-LEAD-DOSE-EXAM.md. Form of record: BK-C2 via DX-C1.
 *
 * ⛔ THIS IS A CENSUS. It publishes MEASUREMENTS. It scores no hypothesis, arms no mechanism
 * and adjudicates nothing — the commander rules. ⭐ ONE PRE-COMMITMENT RIDES ON IT (#359
 * item 2(b)): a margin that does NOT discriminate the unresolved bucket blocks the
 * receiver-access seat and returns the arc to the user.
 *
 * THE THREE FROZEN QUESTION GROUPS (#359 item 2, verbatim scope):
 *   (a) THE UNMEETABLE SHARE — of ELECTED wind-up passes, per delivery class, the share whose
 *       aim point is UNMEETABLE at election time under the frozen access-time account, plus
 *       the access-margin distribution.
 *   (b) ⭐ THE DISCRIMINATING FACE — outcome binned by access margin: does the margin predict
 *       the unresolved bucket? Rule frozen at §P.C.
 *   (c) THE ACCOUNT'S OWN HONESTY — predicted receiver arrival vs the MEASURED arrival
 *       (DX-C1 (b)'s own arrival read), so the price the seat would charge is calibrated
 *       against the world it prices, never assumed.
 *
 * ⭐ THE ACCOUNT IS TRACED, NEVER INVENTED (#359 item 3; the #201 mechanism):
 *   tBall(E)  = dist(passer, E) / PTP_FLIGHT_SPEED     — the chooser's own flight law (the
 *               through-ball loop's `/ 18`, the SAME family member the lead law prices with);
 *   tMate(E)  = dist(mate, E) / max(mate.topSpeed, 0.1) + 0.15
 *               — `interceptBall`'s OWN time-to-point form, byte for byte (perception.ts:
 *               `const ts = Math.max(p.topSpeed, 0.1)` · `const tMe = … / ts + 0.15`);
 *   margin(E) = tBall − tMate  (positive ⇒ the mate is at the point BEFORE the ball);
 *   MEETABLE  ⇔ dist(mate, E) ≤ CONTROL_RADIUS  OR  margin ≥ 0
 *               — the presence clause is the engine's own control cut (a body standing at the
 *               point needs no chase), the sign cut is the account's own zero. NO taste
 *               threshold anywhere; the FULL margin histogram is stored so any other cut
 *               re-derives off disk.
 *
 * ONE ARM ONLY — the DX-T1 ARMED composition at the PINNED MAXIMUM (#359 item 4):
 *   a4MatchFlags(11) + `dlcDeliveryChoice` + `dlcStrikePlane` + `bkGroundCorridor`
 *   + `dxWindupAim` + armA4World(m, null, 11) + `passLeadSupport` = 1 MATCH-LOCAL
 *
 * ⛔ X-SRC-ZERO. No file under `src/` is edited. The probe CALLS the shipped exports and reads
 * Match state per tick. Observation wrappers follow the DX-C1 §3 precedent: they delegate
 * unchanged and `gLockstep` proves them byte-inert.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
import { Match } from '../../src/sim/Match';
import { CONTROL_RADIUS, DT, GRAVITY } from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, corridorArmedVersion,
  CORRIDOR_WORLD_VERSION, CORRIDOR_WORLD_WEIGHT,
} from '../../src/game/a4World';
import { PTP_FLIGHT_SPEED, PTP_LEAD_FLIGHT_MUL } from '../../src/ai/passLeadSeat';
import { dist, type V2 } from '../../src/utils/vec';
import {
  passLeadSupportWeight, randomGenome, type TacticalGenome,
} from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE — no bypass, the DX-C1 §1 form                          */
/* ========================================================================== */
const ENV_WHITELIST = ['DXC2_MODE', 'DXC2_N', 'DXC2_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('DXC2_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`DX-C2 FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.DXC2_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('DX-C2 FATAL — DXC2_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.DXC2_N !== undefined ? Number(process.env.DXC2_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('DX-C2 FATAL — DXC2_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.DXC2_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`DXC2_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`DXC2_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`DXC2_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/dx-c2-meetability-census.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/dx-c2-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('DX-C2 FATAL — an override run may never write the canonical artifact path');
  process.exit(3);
}

/* ========================================================================== */
/* §2 SMALL HELPERS (the DX-C1 §2 set, unchanged)                              */
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
const binOf = (v: number, width: number, n: number): number => {
  const i = Math.floor(v / width);
  return i < 0 ? 0 : i >= n ? n - 1 : i;
};
/** signed bin: index 0 = ≤ −half, index n−1 = ≥ +half; centre bin holds 0 */
const signedBinOf = (v: number, width: number, n: number): number => {
  const half = Math.floor(n / 2);
  const i = half + Math.round(v / width);
  return i < 0 ? 0 : i >= n ? n - 1 : i;
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
/* §3 THE ANCHORED SITES — anchored needle + line receipt, never first-occurrence */
/* ========================================================================== */
const MATCH_PATH = 'src/sim/Match.ts';
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const MECH_PATH = 'src/sim/mechanics.ts';
const SEAT_PATH = 'src/ai/passLeadSeat.ts';
const CONST_PATH = 'src/sim/constants.ts';
const PERC_PATH = 'src/ai/perception.ts';
const EXEC_PATH = 'src/ai/actionExecutor.ts';
const PLAYER_PATH = 'src/sim/Player.ts';
const MATCH_SRC = readFileSync(MATCH_PATH, 'utf8');
const BRAIN_SRC = readFileSync(BRAIN_PATH, 'utf8');
const MECH_SRC = readFileSync(MECH_PATH, 'utf8');
const SEAT_SRC = readFileSync(SEAT_PATH, 'utf8');
const CONST_SRC = readFileSync(CONST_PATH, 'utf8');
const PERC_SRC = readFileSync(PERC_PATH, 'utf8');
const EXEC_SRC = readFileSync(EXEC_PATH, 'utf8');
const PLAYER_SRC = readFileSync(PLAYER_PATH, 'utf8');
const A4_SRC = readFileSync('src/game/a4World.ts', 'utf8');
const lineOf = (src: string, idx: number): number => src.slice(0, idx).split('\n').length;
const occurrences = (src: string, needle: string): { line: number }[] => {
  const out: { line: number }[] = [];
  let i = src.indexOf(needle);
  while (i >= 0) { out.push({ line: lineOf(src, i) }); i = src.indexOf(needle, i + needle.length); }
  return out;
};

/** ⭐⭐ THE ACCOUNT'S OWN TRACE — the three source lines the frozen arithmetic is TAKEN from. */
const TS_CLAMP_NEEDLE = '  const ts = Math.max(p.topSpeed, 0.1);';
const TS_CLAMP_HITS = occurrences(PERC_SRC, TS_CLAMP_NEEDLE);
/** interceptBall's time-to-point form — TWO honest occurrences (airborne + ground branches) */
const TME_NEEDLE = 'const tMe = Math.sqrt(dx * dx + dy * dy) / ts + 0.15;';
const TME_HITS = occurrences(PERC_SRC, TME_NEEDLE);
/** the DEFENCE's own half of the same account — the #201 precedent, quoted as symmetry */
const MARKSAG_NEEDLE = '  const tBall = dist(ballPos, markPos) / MARK_SAG_BALL_SPEED;';
const MARKSAG_HITS = occurrences(EXEC_SRC, MARKSAG_NEEDLE);
/** topSpeed is a PURE getter (stamina-scaled base speed) — pinned so reads stay side-effect-free */
const TOPSPEED_NEEDLE = '    return this.baseSpeed * (0.62 + 0.38 * this.stamina);';
const TOPSPEED_HITS = occurrences(PLAYER_SRC, TOPSPEED_NEEDLE);

/** ⭐⭐ THE STRUCTURAL PIN, inherited from DX-C1 — the struck point sits BEYOND the priced one */
const STRUCK_LEAD_NEEDLE = '  const struckLead = add(mate.pos, scale(mate.vel, flight * 0.8));';
const STRUCK_LEAD_HITS = occurrences(MECH_SRC, STRUCK_LEAD_NEEDLE);
const STRUCK_AIM_NEEDLE = '  const lead = ptpLead === null ? struckLead\n'
  + '    : v2(struckLead.x + ptpLead.x, struckLead.y + ptpLead.y);';
const STRUCK_AIM_HITS = occurrences(MECH_SRC, STRUCK_AIM_NEEDLE);
/** the PTP law's own two constants */
const PTP_SPEED_NEEDLE = 'export const PTP_FLIGHT_SPEED = ';
const PTP_SPEED_HITS = occurrences(SEAT_SRC, PTP_SPEED_NEEDLE);
const PTP_MUL_NEEDLE = 'export const PTP_LEAD_FLIGHT_MUL = ';
const PTP_MUL_HITS = occurrences(SEAT_SRC, PTP_MUL_NEEDLE);
/** the presence clause's anchored cut */
const CONTROL_R_NEEDLE = 'export const CONTROL_RADIUS = ';
const CONTROL_R_HITS = occurrences(CONST_SRC, CONTROL_R_NEEDLE);

/** the DX seam sites — DX-T1 §P8's `gSeamSitesPinned`, re-asserted at battery time */
const DX_FORK_NEEDLE = '        if (match.dxWindupAim && passMate === bestMate && (bestLeadX !== 0 || bestLeadY !== 0)) {';
const DX_FORK_HITS = occurrences(BRAIN_SRC, DX_FORK_NEEDLE);
const DX_ARM_NEEDLE = '      this.dxWindupAim && dxDeposit !== null';
const DX_ARM_HITS = occurrences(MATCH_SRC, DX_ARM_NEEDLE);
const DX_RESOLVE_NEEDLE = '    this.performPass(passer, mate, pp.offsideExempt, 1, pp.aimLead);';
const DX_RESOLVE_HITS = occurrences(MATCH_SRC, DX_RESOLVE_NEEDLE);
const DX_DEPOSIT_WRITES = (BRAIN_SRC.match(/match\.dxStrikeAim = \{/g) ?? []).length;
const ARM_DEFS = (MATCH_SRC.match(/armPendingPass\(/g) ?? []).length;
const BRAIN_ARM_CALLS = (BRAIN_SRC.match(/match\.armPendingPass\(/g) ?? []).length;
const GC_FORK_NEEDLE = '  const gcSeat = match.bkGroundCorridor ? deliveryValueSeatOf(g) : null;';
const GC_FORK_HITS = occurrences(BRAIN_SRC, GC_FORK_NEEDLE);
const DLC_FORK_NEEDLE = '  const dlcSeat = match.dlcDeliveryChoice ? deliveryChoiceSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
const DLC_FORK_HITS = occurrences(BRAIN_SRC, DLC_FORK_NEEDLE);
const SP_FORK_NEEDLE = '  const spSeat = match.dlcStrikePlane ? strikePlaneSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
const SP_FORK_HITS = occurrences(BRAIN_SRC, SP_FORK_NEEDLE);
const DOORS_ABSENT_FROM_A4 = !A4_SRC.includes('dxWindupAim') && !A4_SRC.includes('dxStrikeAim')
  && !A4_SRC.includes('bkGroundCorridor') && !A4_SRC.includes('dlcDeliveryChoice')
  && !A4_SRC.includes('dlcStrikePlane');

const SEAM_OK = DX_FORK_HITS.length === 1 && DX_ARM_HITS.length === 1
  && DX_RESOLVE_HITS.length === 1 && DX_DEPOSIT_WRITES === 1 && ARM_DEFS === 1
  && BRAIN_ARM_CALLS === 1 && GC_FORK_HITS.length === 1 && DLC_FORK_HITS.length === 1
  && SP_FORK_HITS.length === 1 && DOORS_ABSENT_FROM_A4;
const ANCHORS_OK = STRUCK_LEAD_HITS.length === 1 && STRUCK_AIM_HITS.length === 1
  && PTP_SPEED_HITS.length === 1 && PTP_MUL_HITS.length === 1 && CONTROL_R_HITS.length === 1
  && PTP_FLIGHT_SPEED === 18 && PTP_LEAD_FLIGHT_MUL === 1.6
  && TS_CLAMP_HITS.length === 1 && TME_HITS.length === 2
  && MARKSAG_HITS.length === 1 && TOPSPEED_HITS.length === 1;

/* ========================================================================== */
/* §4 THE PREDECESSOR'S BYTES — hashed BEFORE parsing (canon: dose-source guard) */
/* ========================================================================== */
const DXC1_PATH = 'docs/world-model/data/dx-c1-arrival-census.json';
const DXC1_BYTES = readFileSync(DXC1_PATH, 'utf8');
const DXC1_SHA = sha(DXC1_BYTES);
const DXC1 = JSON.parse(DXC1_BYTES) as {
  hashedBodySha256: string;
  faces: { face: string; value: number; numerator: number; denominator: number }[];
};
const dxc1Face = (k: string): { value: number; numerator: number; denominator: number } => {
  const f = DXC1.faces.find((x) => x.face === k);
  if (f === undefined) { banner(`DX-C2 FATAL — DX-C1 face missing: ${k}`); process.exit(3); }
  return f!;
};
/** quoted for CONTEXT ONLY (⚠ DIFFERENT BATTERY, block 12,528,000–999; no Δ across batteries) */
const DXC1_CARRIED_COMPLETION = dxc1Face('completion.carried');
const DXC1_MEAN_LEAD = dxc1Face('arrival.meanCarriedLeadMetres');
const DXC1_ARRIVAL_REACHED = dxc1Face('arrivalShare.reached');
const DXC1_QUOTED_OK = DXC1_SHA.length === 64 && DXC1.hashedBodySha256.length === 64
  && Number.isFinite(DXC1_CARRIED_COMPLETION.value) && Number.isFinite(DXC1_MEAN_LEAD.value)
  && Number.isFinite(DXC1_ARRIVAL_REACHED.value);

/* ========================================================================== */
/* §5 SEEDS — block 12,530,000–999 (#359 item 5)                                */
/* ========================================================================== */
const BLOCK_BASE = 12_530_000;
const BLOCK_TOP = 12_530_999;
/** 900, sized by the §DEV-PREFLIGHT smoke: the 0.05 target on the discriminating contrast
 *  needs 802 clusters (800 would miss it by two); the block affords 900 + the receipt. */
const N_FROZEN = 900;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_001_100;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + 100 + i : BLOCK_BASE + i));
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 90 : BLOCK_TOP;
const LOCKSTEP_SEEDS = [SCRATCH_BASE, SCRATCH_BASE + 1, SCRATCH_BASE + 2];

/* ========================================================================== */
/* §6 THE ARM — the DX-T1 ARMED composition, the world's own composer CALLED    */
/* ========================================================================== */
const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const DLC_GENE_VALUE = 1;
/** DX-T1 §4's own MATCH-LOCAL dose idiom, byte for byte (canon: dose placement, #270.2) */
const setPassLeadLocal = (match: Match, side: Side, value: number): void => {
  const team = match.teams[side];
  const view = { ...team.baseGenome, passLeadSupport: value } as TacticalGenome;
  team.baseGenome = view;
  team.effGenome = view;
};
const buildMatch = (seed: number): Match => {
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(CORRIDOR_WORLD_VERSION),
    dlcDeliveryChoice: true, dlcStrikePlane: true,
    bkGroundCorridor: true, dxWindupAim: true,
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, CORRIDOR_WORLD_VERSION);
  for (const side of [0, 1] as const) setPassLeadLocal(m, side, DLC_GENE_VALUE);
  return m;
};

/* ========================================================================== */
/* §7 THE WALK-SIDE PREDICATES — PURE, fixture-backed (canon, #334 item 2)      */
/* ========================================================================== */
type Klass = 'shot' | 'headerShot' | 'headerClearance' | 'headerKnockdown' | 'clearance'
  | 'cross' | 'cutback' | 'throughBall' | 'loftedPass' | 'shortPass' | 'keeperThrow' | 'other';
interface StatDelta {
  shots: number; clearances: number; passes: number; crosses: number; cutbacks: number;
  throughBalls: number; longBalls: number; headersWon: number;
}
/** DX-C1 / BK-C2's release classifier, byte for byte in substance */
const klassOf = (d: StatDelta, pendingChangedHere: boolean): Klass | null => {
  let klass: Klass | null = null;
  if (d.shots > 0) klass = d.headersWon > 0 ? 'headerShot' : 'shot';
  if (d.clearances > 0 && klass === null) {
    klass = d.headersWon > 0 ? 'headerClearance' : 'clearance';
  }
  if (d.passes > 0 && klass === null) {
    klass = d.crosses > 0 ? 'cross'
      : d.cutbacks > 0 ? 'cutback'
        : d.throughBalls > 0 ? 'throughBall'
          : d.longBalls > 0 ? 'loftedPass' : 'shortPass';
  }
  if (d.headersWon > 0 && klass === null) klass = 'headerKnockdown';
  if (klass === null && pendingChangedHere) klass = 'other';
  return klass;
};
const isDelivery = (k: Klass): boolean =>
  k !== 'shot' && k !== 'headerShot' && k !== 'headerKnockdown' && k !== 'headerClearance';
const isGroundLaunch = (grounded: boolean, vzAfterGravity: number): boolean =>
  grounded || !(vzAfterGravity > 0);
const isMeasurableGroundPass = (k: Klass, ground: boolean, hasTarget: boolean): boolean =>
  ground && hasTarget && (k === 'shortPass' || k === 'throughBall' || k === 'cutback');

/** the DX-C1 carry-class partition, byte for byte in substance */
const CARRY_CLASSES = ['carried', 'windupToFeet', 'syncLed', 'syncToFeet', 'otherGround'] as const;
type CarryClass = (typeof CARRY_CLASSES)[number];
const carryClassOf = (
  viaPerformPass: boolean, fromWindup: boolean, leadMetres: number,
): CarryClass => {
  if (!viaPerformPass) return 'otherGround';
  if (fromWindup) return leadMetres > 0 ? 'carried' : 'windupToFeet';
  return leadMetres > 0 ? 'syncLed' : 'syncToFeet';
};

/** the DX-C1 outcome ladder, byte for byte in substance */
const OUTCOMES = ['completed', 'intercepted', 'out', 'unresolved'] as const;
type Outcome = (typeof OUTCOMES)[number];
const outcomeOf = (
  completedHere: boolean, interceptedHere: boolean, wentDead: boolean,
): Outcome => (completedHere ? 'completed'
  : interceptedHere ? 'intercepted' : wentDead ? 'out' : 'unresolved');

/**
 * ⭐⭐ THE FROZEN ACCOUNT (§P.A — traced, never invented).
 *   tBall  = dBallPath / PTP_FLIGHT_SPEED           (the chooser's own flight law, `/ 18`)
 *   tMate  = dMate / max(topSpeed, 0.1) + 0.15      (interceptBall's own time-to-point form)
 *   margin = tBall − tMate                          (positive ⇒ the mate beats the ball there)
 */
const marginOf = (dBallPath: number, dMate: number, topSpeed: number): number =>
  dBallPath / PTP_FLIGHT_SPEED - (dMate / Math.max(topSpeed, 0.1) + 0.15);
/**
 * ⭐⭐ MEETABLE (§P.B): presence (the engine's own control cut) OR a non-negative margin.
 * A sign cut on the account's own zero plus an anchored constant — no taste threshold.
 */
const meetableOf = (dMate: number, margin: number): boolean =>
  dMate <= CONTROL_RADIUS || margin >= 0;
/**
 * ⭐ (c)'s FROZEN PREDICTION (§P.D): the straight-chase kinematics of the SAME account —
 * where the account says the receiver stands when the ball reaches the elected point.
 *   predictedArrDist = max(0, dMate − max(0, tBall − 0.15) · max(topSpeed, 0.1))
 */
const predictedArrDistOf = (dBallPath: number, dMate: number, topSpeed: number): number => {
  const tBall = dBallPath / PTP_FLIGHT_SPEED;
  const chase = Math.max(0, tBall - 0.15) * Math.max(topSpeed, 0.1);
  return Math.max(0, dMate - chase);
};

/* --- THE COMPOSITION FIXTURES (canon: a headline-bearing predicate needs one) --- */
const D0: StatDelta = {
  shots: 0, clearances: 0, passes: 0, crosses: 0, cutbacks: 0,
  throughBalls: 0, longBalls: 0, headersWon: 0,
};
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
fx('klassOf.shortPass', klassOf({ ...D0, passes: 1 }, false), 'shortPass');
fx('klassOf.cutback', klassOf({ ...D0, passes: 1, cutbacks: 1 }, false), 'cutback');
fx('klassOf.throughBall', klassOf({ ...D0, passes: 1, throughBalls: 1 }, false), 'throughBall');
fx('klassOf.loftedPass', klassOf({ ...D0, passes: 1, longBalls: 1 }, false), 'loftedPass');
fx('klassOf.cross', klassOf({ ...D0, passes: 1, crosses: 1 }, false), 'cross');
fx('klassOf.shotBeatsPass', klassOf({ ...D0, shots: 1, passes: 1 }, false), 'shot');
fx('klassOf.headerKnockdown', klassOf({ ...D0, headersWon: 1 }, false), 'headerKnockdown');
fx('klassOf.other', klassOf(D0, true), 'other');
fx('klassOf.null', klassOf(D0, false), null);
fx('isDelivery.shot', isDelivery('shot'), false);
fx('isDelivery.shortPass', isDelivery('shortPass'), true);
fx('isGroundLaunch.grounded', isGroundLaunch(true, 5), true);
fx('isGroundLaunch.rising', isGroundLaunch(false, 0.5), false);
fx('isGroundLaunch.falling', isGroundLaunch(false, -0.5), true);
fx('measurable.shortPass', isMeasurableGroundPass('shortPass', true, true), true);
fx('measurable.crossExcluded', isMeasurableGroundPass('cross', true, true), false);
fx('measurable.noTarget', isMeasurableGroundPass('shortPass', true, false), false);
fx('carryClassOf.carried', carryClassOf(true, true, 3.2), 'carried');
fx('carryClassOf.windupToFeetNull', carryClassOf(true, true, 0), 'windupToFeet');
fx('carryClassOf.syncLed', carryClassOf(true, false, 1.1), 'syncLed');
fx('carryClassOf.syncToFeet', carryClassOf(true, false, 0), 'syncToFeet');
fx('carryClassOf.otherGround', carryClassOf(false, false, 0), 'otherGround');
fx('outcomeOf.completed', outcomeOf(true, true, true), 'completed');
fx('outcomeOf.intercepted', outcomeOf(false, true, true), 'intercepted');
fx('outcomeOf.out', outcomeOf(false, false, true), 'out');
fx('outcomeOf.unresolved', outcomeOf(false, false, false), 'unresolved');
/* the account's own arithmetic, walked at pinned inputs */
fx('marginOf.toFeet10m', marginOf(10, 0, 8), 10 / 18 - 0.15);
fx('marginOf.lead7mSlow', marginOf(15, 7, 7) < 0, true);
fx('marginOf.shortReachable', marginOf(9, 2, 8) > 0, true);
fx('meetable.presence', meetableOf(CONTROL_RADIUS * 0.5, -9), true);
fx('meetable.positiveMargin', meetableOf(5, 0.01), true);
fx('meetable.zeroMargin', meetableOf(5, 0), true);
fx('meetable.unmeetable', meetableOf(5, -0.01), false);
fx('predictedArrDist.standStill', predictedArrDistOf(2, 0, 8), 0);
fx('predictedArrDist.chaseCloses',
  predictedArrDistOf(18, 4, 8), Math.max(0, 4 - (1 - 0.15) * 8));
fx('predictedArrDist.floorAtZero', predictedArrDistOf(36, 1, 8), 0);
const FIXTURES_OK = FIXTURES.every((f) => f.ok);

/* ========================================================================== */
/* §8 THE FROZEN BINS (frozen at the FREEZE COMMIT, before any battery seed)   */
/* ========================================================================== */
/** margin seconds: signed 0.1 s bins, 21 bins, centre holds 0, ends are overflow */
const MARGIN_BIN_S = 0.1;
const MARGIN_BINS = 21;
/** (c) calibration diff (measured − predicted) metres: signed 0.5 m bins, 13 bins */
const CAL_BIN_M = 0.5;
const CAL_BINS = 13;
/** receiver→elected-point distance at ball arrival: DX-C1's own 1 m × 10 */
const ARR_BIN_M = 1;
const ARR_BINS = 10;
/** the carried lead's own magnitude: DX-T1's own histogram bins, inherited */
const LEAD_BIN_M = 0.5;
const LEAD_BINS = 13;
const FLIGHT_RETIRE_TICKS = 720; // R9's own retire cap, inherited (BK-C1 §3)

/* ========================================================================== */
/* §9 THE PER-MATCH ROW — per-seed cells (canon, home ruling #282.2(ii))        */
/* ========================================================================== */
const CI = (c: CarryClass): number => CARRY_CLASSES.indexOf(c);
const OI = (o: Outcome): number => OUTCOMES.indexOf(o);
const MEET_CLASSES = ['meetable', 'unmeetable'] as const;
const MI = (meet: boolean): number => (meet ? 0 : 1);

interface Row {
  worldOk: boolean; armedVersion: number; flagsOk: boolean; geneOk: boolean; genomeClean: boolean;
  ticks: number; matches: number; wallMs: number;
  /* engine receipts (never football findings) */
  depCaptures: number; depCarriedOk: number; depNullOk: number; depMismatch: number;
  depResolves: number; depResolveOk: number; depResolveMismatch: number;
  /* the population */
  deliveries: number; gpMeasured: number;
  byClass: number[];                       // [CARRY_CLASSES]
  byClassOutcome: number[][];              // [CARRY_CLASSES][OUTCOMES]
  /* (a) the account, per class, at the ELECTION instant */
  marginN: number[];                       // [CARRY_CLASSES] flights with a margin read
  unmeetableN: number[];                   // [CARRY_CLASSES] unmeetable at election
  marginSum: number[];                     // [CARRY_CLASSES] Σ marginElect seconds
  marginElectBins: number[][];             // [CARRY_CLASSES][MARGIN_BINS] signed
  /* (b) carried-only: meetable × outcome — THE DISCRIMINATING TABLE */
  meetOutcome: number[][];                 // [MEET_CLASSES][OUTCOMES]
  meetN: number[];                         // [MEET_CLASSES]
  /* carried-only margin context */
  marginStrikeSum: number; marginStrikeN: number;
  marginStrikeBins: number[];              // [MARGIN_BINS] signed
  leadBins: number[]; leadSum: number; leadN: number;
  dMateElectSum: number;                   // Σ dist(mate@arm, elected point)
  /* (c) calibration — carried flights whose ball reached the elected point */
  calN: number; calPredictedSum: number; calMeasuredSum: number;
  calDiffBins: number[];                   // [CAL_BINS] signed (measured − predicted)
  calMeetableN: number; calMeetablePredictedSum: number; calMeetableMeasuredSum: number;
  arrDistBins: number[];                   // measured receiver→point at arrival (context)
  /* the game faces (context, per match) */
  goals: number; passes: number; passesCompleted: number; interceptions: number;
}
const emptyRow = (): Row => ({
  worldOk: false, armedVersion: 0, flagsOk: false, geneOk: false, genomeClean: false,
  ticks: 0, matches: 1, wallMs: 0,
  depCaptures: 0, depCarriedOk: 0, depNullOk: 0, depMismatch: 0,
  depResolves: 0, depResolveOk: 0, depResolveMismatch: 0,
  deliveries: 0, gpMeasured: 0,
  byClass: zeros(CARRY_CLASSES.length),
  byClassOutcome: zeros2(CARRY_CLASSES.length, OUTCOMES.length),
  marginN: zeros(CARRY_CLASSES.length),
  unmeetableN: zeros(CARRY_CLASSES.length),
  marginSum: zeros(CARRY_CLASSES.length),
  marginElectBins: zeros2(CARRY_CLASSES.length, MARGIN_BINS),
  meetOutcome: zeros2(MEET_CLASSES.length, OUTCOMES.length),
  meetN: zeros(MEET_CLASSES.length),
  marginStrikeSum: 0, marginStrikeN: 0, marginStrikeBins: zeros(MARGIN_BINS),
  leadBins: zeros(LEAD_BINS), leadSum: 0, leadN: 0,
  dMateElectSum: 0,
  calN: 0, calPredictedSum: 0, calMeasuredSum: 0, calDiffBins: zeros(CAL_BINS),
  calMeetableN: 0, calMeetablePredictedSum: 0, calMeetableMeasuredSum: 0,
  arrDistBins: zeros(ARR_BINS),
  goals: 0, passes: 0, passesCompleted: 0, interceptions: 0,
});

/* ========================================================================== */
/* §10 THE WALK — one match; pure reads + the shipped exports CALLED            */
/* ========================================================================== */
const STAT_KEYS = ['passes', 'passesCompleted', 'longBalls', 'crosses', 'throughBalls',
  'cutbacks', 'clearances', 'shots', 'headersWon', 'interceptions', 'tackles', 'goals'] as const;
type StatKey = (typeof STAT_KEYS)[number];

interface ArmState {
  tick: number; targetGid: number; readyTick: number;
  aimX: number; aimY: number;               // the record's own arm-time aim (= mate.pos)
  matePosX: number; matePosY: number;
  passerX: number; passerY: number;         // the passer's own position at the SAME instant
  mateTopSpeed: number;                     // the mate's topSpeed getter at the SAME instant
}
interface StrikeState {
  gid: number; tick: number; fromWindup: boolean; leadMetres: number;
  leadX: number; leadY: number; targetGid: number;
  arm: ArmState | null;
  electX: number; electY: number;           // the ELECTED POINT: record.aim + aimLead
  /* the account at the ELECTION instant (arm-time for wind-ups, strike-time for syncs) */
  dMateElect: number; marginElect: number; meetableElect: boolean; predictedArrDist: number;
  /* the account re-read at the STRIKE instant, same elected point (carried context) */
  marginStrike: number;
}
interface Flight {
  tick: number; gid: number; side: Side; ground: boolean;
  live: boolean; measured: boolean;
  klass: CarryClass; strike: StrikeState | null;
  launchX: number; launchY: number;
  reachedPoint: boolean; arrDist: number;
  completedHere: boolean; interceptedHere: boolean; wentDead: boolean;
}

const walkMatch = (m: Match, trace: boolean): Row => {
  const t0 = Date.now();
  const row = emptyRow();
  row.armedVersion = corridorArmedVersion(m);
  const mm = m as unknown as {
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
    pendingPassWindup: {
      gid: number; readyTick: number; aim: V2; targetGid: number; aimLead: V2 | null;
    } | null;
    dxStrikeAim: { gid: number; lead: V2; tick: number } | null;
    dxWindupAim: boolean; o1PassWindup: boolean;
    dlcDeliveryChoice: boolean; dlcStrikePlane: boolean;
    armPendingPass: (passer: Player, mate: Player, offsideExempt?: boolean) => void;
    resolvePendingPassWindup: () => void;
  };
  row.flagsOk = mm.dxWindupAim === true && m.bkGroundCorridor === true
    && mm.dlcDeliveryChoice === true && mm.dlcStrikePlane === true && mm.o1PassWindup === true;
  row.worldOk = row.armedVersion === CORRIDOR_WORLD_VERSION && row.flagsOk;
  row.geneOk = ([0, 1] as const).every((s) => {
    const eff = m.teams[s].effGenome as TacticalGenome;
    const bas = m.teams[s].baseGenome as TacticalGenome;
    return eff.dvExposureWeight === CORRIDOR_WORLD_WEIGHT
      && bas.dvExposureWeight === CORRIDOR_WORLD_WEIGHT
      && eff.passLeadSupport === DLC_GENE_VALUE && bas.passLeadSupport === DLC_GENE_VALUE
      && passLeadSupportWeight(eff) === DLC_GENE_VALUE
      && passLeadSupportWeight(m.teams[s].genome as TacticalGenome) === DLC_GENE_VALUE;
  });
  row.genomeClean = ([0, 1] as const).every((s) => {
    const f = m.teams[s].info.genome as TacticalGenome;
    return f.dvExposureWeight === undefined && f.passLeadSupport === undefined;
  });

  const players = m.allPlayers;
  const armState = new Map<number, ArmState>();
  const strikes: StrikeState[] = [];
  let inResolveLead: V2 | null | undefined;

  if (trace) {
    /* ⭐⭐ WRAPPER 1 — the ARM. DX-C1's deposit pin RE-RUN, plus this census's own
       ELECTION-INSTANT capture (passer pos + mate topSpeed added; nothing else new).
       Delegates with the IDENTICAL arguments. */
    const origArm = mm.armPendingPass.bind(m);
    mm.armPendingPass = (passer: Player, mate: Player, offsideExempt = false): void => {
      const dep = mm.dxStrikeAim;
      const eligible = dep !== null && dep.gid === passer.gid && dep.tick === m.simTick;
      const want: V2 | null = (mm.dxWindupAim === true && eligible)
        ? { x: dep!.lead.x, y: dep!.lead.y } : null;
      const snap: Omit<ArmState, 'readyTick'> = {
        tick: m.simTick, targetGid: mate.gid,
        aimX: mate.pos.x, aimY: mate.pos.y, matePosX: mate.pos.x, matePosY: mate.pos.y,
        passerX: passer.pos.x, passerY: passer.pos.y,
        mateTopSpeed: mate.topSpeed,
      };
      origArm(passer, mate, offsideExempt);
      const rec = mm.pendingPassWindup;
      const got = rec?.aimLead ?? null;
      row.depCaptures += 1;
      if (want === null) {
        if (got === null) row.depNullOk += 1; else row.depMismatch += 1;
      } else if (got !== null && got.x === want.x && got.y === want.y) {
        row.depCarriedOk += 1;
      } else row.depMismatch += 1;
      if (rec !== null && rec.gid === passer.gid) {
        armState.set(passer.gid, { ...snap, readyTick: rec.readyTick });
      }
    };
    /* ⭐ WRAPPER 2 — the RESOLVE. Marks the wind-up channel and carries the record's lead. */
    const origResolve = mm.resolvePendingPassWindup.bind(m);
    mm.resolvePendingPassWindup = (): void => {
      const rec = mm.pendingPassWindup;
      inResolveLead = rec === null ? undefined : rec.aimLead;
      origResolve();
      inResolveLead = undefined;
    };
    /* ⭐⭐ WRAPPER 3 — the STRIKE. The class, the elected point, and the ACCOUNT reads. */
    const origPerformPass = m.performPass.bind(m);
    (m as unknown as { performPass: unknown }).performPass = (
      pp: Player, mate: Player, offsideExempt = false, powerChoice = 1,
      ptpLead: Readonly<V2> | null = null,
    ): void => {
      const fromWindup = inResolveLead !== undefined;
      if (fromWindup) {
        row.depResolves += 1;
        const want = inResolveLead!;
        const ok = want === null ? ptpLead === null
          : ptpLead !== null && ptpLead.x === want.x && ptpLead.y === want.y;
        if (ok) row.depResolveOk += 1; else row.depResolveMismatch += 1;
      }
      const lx = ptpLead?.x ?? 0;
      const ly = ptpLead?.y ?? 0;
      const leadMetres = Math.hypot(lx, ly);
      const arm0 = fromWindup ? (armState.get(pp.gid) ?? null) : null;
      const arm = (arm0 !== null && arm0.targetGid === mate.gid) ? arm0 : null;
      /* THE ELECTED POINT (§P.B): the arm-time record's own aim PLUS the carried lead —
         exactly `mate.pos(arm) + lead`, the point `groundCandidate` scored. A synchronous
         strike's election instant IS the strike instant. */
      const electX = (arm !== null ? arm.aimX : mate.pos.x) + lx;
      const electY = (arm !== null ? arm.aimY : mate.pos.y) + ly;
      const elect: V2 = { x: electX, y: electY };
      /* ⭐ THE ACCOUNT AT THE ELECTION INSTANT — all four inputs from the SAME instant */
      const matePosE: V2 = arm !== null
        ? { x: arm.matePosX, y: arm.matePosY } : { x: mate.pos.x, y: mate.pos.y };
      const passerPosE: V2 = arm !== null
        ? { x: arm.passerX, y: arm.passerY } : { x: pp.pos.x, y: pp.pos.y };
      const tsE = arm !== null ? arm.mateTopSpeed : mate.topSpeed;
      const dMateElect = dist(matePosE, elect);
      const dBallElect = dist(passerPosE, elect);
      const marginElect = marginOf(dBallElect, dMateElect, tsE);
      /* the account RE-READ at the strike instant, SAME elected point (staleness context) */
      const marginStrike = marginOf(
        dist(pp.pos, elect), dist(mate.pos, elect), mate.topSpeed,
      );
      const st: StrikeState = {
        gid: pp.gid, tick: m.simTick, fromWindup, leadMetres, leadX: lx, leadY: ly,
        targetGid: mate.gid, arm,
        electX, electY,
        dMateElect, marginElect,
        meetableElect: meetableOf(dMateElect, marginElect),
        predictedArrDist: predictedArrDistOf(dBallElect, dMateElect, tsE),
        marginStrike,
      };
      strikes.push(st);
      origPerformPass(pp, mate, offsideExempt, powerChoice, ptpLead);
    };
  }

  const prevStats: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of STAT_KEYS) prevStats[k] = [0, 0];
  let prevPendingPassT: number | null = mm.pendingPass?.t ?? null;
  let flight: Flight | null = null;

  const bookFlight = (f: Flight): void => {
    if (!f.measured) return;
    row.gpMeasured += 1;
    const outcome = outcomeOf(f.completedHere, f.interceptedHere, f.wentDead);
    const ci = CI(f.klass);
    row.byClass[ci] += 1;
    row.byClassOutcome[ci][OI(outcome)] += 1;
    const s = f.strike;
    if (s !== null && f.klass !== 'otherGround') {
      /* (a) the account per class, at the election instant */
      row.marginN[ci] += 1;
      row.marginSum[ci] += s.marginElect;
      row.marginElectBins[ci][signedBinOf(s.marginElect, MARGIN_BIN_S, MARGIN_BINS)] += 1;
      if (!s.meetableElect) row.unmeetableN[ci] += 1;
      if (f.klass === 'carried') {
        /* (b) THE DISCRIMINATING TABLE */
        const mi = MI(s.meetableElect);
        row.meetN[mi] += 1;
        row.meetOutcome[mi][OI(outcome)] += 1;
        /* carried margin context */
        row.marginStrikeSum += s.marginStrike;
        row.marginStrikeN += 1;
        row.marginStrikeBins[signedBinOf(s.marginStrike, MARGIN_BIN_S, MARGIN_BINS)] += 1;
        row.leadBins[binOf(s.leadMetres, LEAD_BIN_M, LEAD_BINS)] += 1;
        row.leadSum += s.leadMetres;
        row.leadN += 1;
        row.dMateElectSum += s.dMateElect;
        /* (c) calibration — only where the ball actually reached the elected point */
        if (f.reachedPoint && Number.isFinite(f.arrDist)) {
          row.calN += 1;
          row.calPredictedSum += s.predictedArrDist;
          row.calMeasuredSum += f.arrDist;
          row.calDiffBins[signedBinOf(f.arrDist - s.predictedArrDist, CAL_BIN_M, CAL_BINS)] += 1;
          row.arrDistBins[binOf(f.arrDist, ARR_BIN_M, ARR_BINS)] += 1;
          if (s.meetableElect) {
            row.calMeetableN += 1;
            row.calMeetablePredictedSum += s.predictedArrDist;
            row.calMeetableMeasuredSum += f.arrDist;
          }
        }
      }
    }
  };
  const retire = (): void => { if (flight !== null) { bookFlight(flight); flight = null; } };

  while (!m.finished) {
    m.step(DT);
    const tick = m.simTick;
    row.ticks += 1;
    const ball = m.ball;
    const playing = m.phase === 'playing';
    const ballIsLive = playing || m.phase === 'restart';
    const lastTouchGid = ball.lastTouch?.gid ?? null;

    const d: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
    for (const k of STAT_KEYS) {
      const a = m.teams[0].stats[k] as number;
      const b = m.teams[1].stats[k] as number;
      d[k] = [a - prevStats[k][0], b - prevStats[k][1]];
      prevStats[k] = [a, b];
    }

    /* release detection — DX-C1 §10's ladder, inherited */
    const passT = mm.pendingPass?.t ?? null;
    const passChangedSide: Side | null = (passT !== null && passT !== prevPendingPassT)
      ? (mm.pendingPass?.side ?? null) : null;
    prevPendingPassT = passT;
    const releases: { gid: number; klass: Klass }[] = [];
    if (ballIsLive) {
      for (const side of [0, 1] as const) {
        const k0 = klassOf({
          shots: d.shots[side], clearances: d.clearances[side], passes: d.passes[side],
          crosses: d.crosses[side], cutbacks: d.cutbacks[side],
          throughBalls: d.throughBalls[side], longBalls: d.longBalls[side],
          headersWon: d.headersWon[side],
        }, passChangedSide === side);
        if (k0 === null) continue;
        let klass = k0;
        let gid = -1;
        if (passChangedSide === side && mm.pendingPass !== null) gid = mm.pendingPass.passerGid;
        else if (lastTouchGid !== null && players[lastTouchGid].side === side) gid = lastTouchGid;
        if (gid < 0) continue;
        if (klass === 'shortPass' && players[gid].action.type === 'ThrowOut') klass = 'keeperThrow';
        releases.push({ gid, klass });
      }
    }

    const hSpeedNow = Math.hypot(ball.vel.x, ball.vel.y);
    for (const rel of releases) {
      if (!isDelivery(rel.klass) || hSpeedNow < 1e-6) continue;
      const p = players[rel.gid];
      const grounded = ball.z === 0 && ball.vz === 0;
      const vz0 = grounded ? 0 : ball.vz + GRAVITY * DT;
      const ground = isGroundLaunch(grounded, vz0);
      const targetGid = (mm.pendingPass !== null && mm.pendingPass.passerGid === rel.gid)
        ? mm.pendingPass.targetGid : null;
      retire();
      row.deliveries += 1;
      const measurable = isMeasurableGroundPass(rel.klass, ground, targetGid !== null);
      /* the strike this release came from — this tick, this body (the wrapper's own record) */
      let st: StrikeState | null = null;
      for (let i = strikes.length - 1; i >= 0; i--) {
        if (strikes[i].gid === rel.gid && strikes[i].tick === tick) { st = strikes[i]; break; }
        if (strikes[i].tick < tick - 1) break;
      }
      if (st !== null && targetGid !== null && st.targetGid !== targetGid) st = null;
      const klass = carryClassOf(st !== null, st?.fromWindup ?? false, st?.leadMetres ?? 0);
      const ox = ball.pos.x - ball.vel.x * DT;
      const oy = ball.pos.y - ball.vel.y * DT;
      flight = {
        tick, gid: rel.gid, side: p.side as Side, ground,
        live: true, measured: measurable,
        klass, strike: st,
        launchX: ox, launchY: oy,
        reachedPoint: false, arrDist: Number.NaN,
        completedHere: false, interceptedHere: false, wentDead: false,
      };
      strikes.length = 0;
    }

    /* THE ARRIVAL READ — DX-C1's own geometric read, inherited: the ball has travelled as far
       along its launch→elected-point line as the elected point itself. */
    if (flight !== null && flight.live && !flight.reachedPoint
      && flight.strike !== null && flight.klass === 'carried') {
      const s = flight.strike;
      const ux = s.electX - flight.launchX;
      const uy = s.electY - flight.launchY;
      const L = Math.hypot(ux, uy);
      if (L > 1e-6) {
        const proj = ((ball.pos.x - flight.launchX) * ux + (ball.pos.y - flight.launchY) * uy) / L;
        if (proj >= L) {
          flight.reachedPoint = true;
          flight.arrDist = dist(players[s.targetGid].pos, { x: s.electX, y: s.electY });
        }
      }
    }

    /* the flight's own outcome — the ENGINE's counters, attributed temporally */
    if (flight !== null && flight.live) {
      const mySide = flight.side;
      if (d.passesCompleted[mySide] > 0) flight.completedHere = true;
      if (d.interceptions[1 - mySide] > 0) flight.interceptedHere = true;
      if (!ballIsLive) flight.wentDead = true;
    }

    if (flight !== null) {
      if (ball.owner !== null && ball.owner.gid !== flight.gid) retire();
      else if (flight.completedHere || flight.interceptedHere || flight.wentDead) retire();
      else if (tick - flight.tick > FLIGHT_RETIRE_TICKS) retire();
    }
  }
  retire();
  const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<StatKey, number>[];
  row.goals = st[0].goals + st[1].goals;
  row.passes = st[0].passes + st[1].passes;
  row.passesCompleted = st[0].passesCompleted + st[1].passesCompleted;
  row.interceptions = st[0].interceptions + st[1].interceptions;
  row.wallMs = Date.now() - t0;
  return row;
};

/* ========================================================================== */
/* §11 THE LOCKSTEP RECEIPT — the wrappers are BYTE-INERT (DX-C1 §11's form)    */
/* ========================================================================== */
const signatureOf = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((pp) => ({
    gid: pp.gid, pos: pp.pos, vel: pp.vel, heading: pp.heading, stamina: pp.stamina,
  })),
}));
banner('DX-C2 — the lockstep receipt (the observation wrappers, traced vs untraced)');
const lockstepRows = LOCKSTEP_SEEDS.map((seed) => {
  const traced = buildMatch(seed);
  walkMatch(traced, true);
  const untraced = buildMatch(seed);
  walkMatch(untraced, false);
  return { seed, traced: signatureOf(traced), untraced: signatureOf(untraced) };
});
const LOCKSTEP_OK = lockstepRows.every((r) => r.traced === r.untraced);
banner(`  G-LOCKSTEP ${LOCKSTEP_OK ? 'GREEN' : 'RED'} (${lockstepRows.length} scratch seeds)`);

/* ========================================================================== */
/* §12 THE BATTERY                                                             */
/* ========================================================================== */
interface Cell { seed: number; row: Row }
const cells: Cell[] = [];
banner(`DX-C2 — the battery: ${N} walks of the DX-T1 ARMED composition, seeds `
  + `${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]}`);
const CHUNK = 100;
for (let start = 0; start < batterySeeds.length; start += CHUNK) {
  const slice = batterySeeds.slice(start, start + CHUNK);
  for (const seed of slice) {
    const m = buildMatch(seed);
    cells.push({ seed, row: walkMatch(m, true) });
  }
  banner(`  … ${Math.min(start + CHUNK, batterySeeds.length)}/${batterySeeds.length} walked `
    + `(${((Date.now() - t0Wall) / 1000).toFixed(1)} s)`);
}
/** the world-construction receipt, one walk, its own seed (booked = walked) */
const receiptMatch = buildMatch(RECEIPT_SEED);
const receiptRow = walkMatch(receiptMatch, true);
const walksBooked = cells.length + 1;

/* ========================================================================== */
/* §13 THE ESTIMATOR — CLUSTER BOOTSTRAP over match seeds (consumes NO stats)   */
/* ========================================================================== */
const BOOTSTRAP = 2000;
const rngBoot = new Rng(BLOCK_BASE);
const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: cells.length }, () => Math.floor(rngBoot.next() * cells.length) % cells.length));
const pctl = (s: number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.floor(q * s.length))]);
interface FaceDef { unit: string; what: string; den: string;
  num: (r: Row) => number; dn: (r: Row) => number }
const FACES: Record<string, FaceDef> = {};
const defFace = (
  key: string, unit: string, what: string, den: string,
  num: (r: Row) => number, dn: (r: Row) => number,
): void => { FACES[key] = { unit, what, den, num, dn }; };

for (const k of CARRY_CLASSES) {
  const i = CI(k);
  defFace(`completion.${k}`, 'share', `context — completion rate of the ${k} class`,
    'flights of that class', (r) => r.byClassOutcome[i][OI('completed')], (r) => r.byClass[i]);
  defFace(`unresolvedShare.${k}`, 'share', `context — unresolved share of the ${k} class`,
    'flights of that class', (r) => r.byClassOutcome[i][OI('unresolved')], (r) => r.byClass[i]);
  defFace(`volumeShare.${k}`, 'share', `context — volume share of the ${k} class`,
    'measured ground passes', (r) => r.byClass[i], (r) => r.gpMeasured);
  if (k !== 'otherGround') {
    defFace(`meet.unmeetableShare.${k}`, 'share',
      `⭐ (a) share of ${k} elections UNMEETABLE at the election instant (frozen account)`,
      'flights of that class with a margin read', (r) => r.unmeetableN[i], (r) => r.marginN[i]);
    defFace(`meet.marginMeanSeconds.${k}`, 'seconds',
      `(a) mean access margin (tBall − tMate) of the ${k} class at the election instant`,
      'flights of that class with a margin read', (r) => r.marginSum[i], (r) => r.marginN[i]);
  }
}
for (const mc of MEET_CLASSES) {
  const i = mc === 'meetable' ? 0 : 1;
  defFace(`meet.completion.${mc}`, 'share',
    `⭐ (b) completion of CARRIED passes whose election was ${mc}`,
    `carried passes ${mc} at election`,
    (r) => r.meetOutcome[i][OI('completed')], (r) => r.meetN[i]);
  defFace(`meet.unresolved.${mc}`, 'share',
    `⭐⭐ (b) unresolved share of CARRIED passes whose election was ${mc} — THE DISCRIMINATING `
    + 'PAIR', `carried passes ${mc} at election`,
    (r) => r.meetOutcome[i][OI('unresolved')], (r) => r.meetN[i]);
  defFace(`meet.interceptedShare.${mc}`, 'share',
    `(b) intercepted share of CARRIED passes whose election was ${mc}`,
    `carried passes ${mc} at election`,
    (r) => r.meetOutcome[i][OI('intercepted')], (r) => r.meetN[i]);
  defFace(`meet.volumeShare.${mc}`, 'share',
    `(b) share of CARRIED passes whose election was ${mc}`,
    'carried passes with a margin read', (r) => r.meetN[i], (r) => r.meetN[0] + r.meetN[1]);
}
defFace('margin.meanStrikeSeconds.carried', 'seconds',
  '(a) the carried account RE-READ at the strike instant, same elected point',
  'carried passes with a strike re-read', (r) => r.marginStrikeSum, (r) => r.marginStrikeN);
defFace('arrival.meanCarriedLeadMetres', 'metres', 'context — mean carried lead magnitude',
  'carried passes with a margin read', (r) => r.leadSum, (r) => r.leadN);
defFace('arrival.meanDMateElectMetres', 'metres',
  'context — mean receiver→elected-point distance AT ELECTION',
  'carried passes with a margin read', (r) => r.dMateElectSum, (r) => r.leadN);
defFace('cal.meanPredictedArrDistMetres', 'metres',
  '⭐ (c) the account\'s PREDICTED receiver→point distance at ball arrival (straight chase)',
  'carried passes whose ball reached the elected point', (r) => r.calPredictedSum, (r) => r.calN);
defFace('cal.meanMeasuredArrDistMetres', 'metres',
  '⭐ (c) the MEASURED receiver→point distance at ball arrival (DX-C1\'s own read)',
  'carried passes whose ball reached the elected point', (r) => r.calMeasuredSum, (r) => r.calN);
defFace('cal.meanDiffMetres', 'metres',
  '⭐⭐ (c) measured − predicted (positive ⇒ the receiver ends FARTHER than the ideal chase — '
  + 'the behaviour gap the cooperation seat would own)',
  'carried passes whose ball reached the elected point',
  (r) => r.calMeasuredSum - r.calPredictedSum, (r) => r.calN);
defFace('cal.meetable.meanDiffMetres', 'metres',
  '(c) measured − predicted on MEETABLE elections only',
  'meetable carried passes whose ball reached the elected point',
  (r) => r.calMeetableMeasuredSum - r.calMeetablePredictedSum, (r) => r.calMeetableN);
defFace('context.passCompletion', 'share',
  'context — the engine\'s own whole-match pass completion (⚠ ALL deliveries)',
  'passes', (r) => r.passesCompleted, (r) => r.passes);
defFace('context.goalsPerMatch', 'goals per match (240 s match clock)', 'context — goals',
  'matches walked', (r) => r.goals, (r) => r.matches);
defFace('context.measuredGroundPassesPerMatch', 'passes per match (240 s match clock)',
  'context — the census population\'s own volume', 'matches walked',
  (r) => r.gpMeasured, (r) => r.matches);

const FACE_KEYS = Object.keys(FACES).sort();
interface FaceRow {
  face: string; unit: string; what: string; denNote: string;
  value: number; numerator: number; denominator: number;
  ciLo: number; ciHi: number; halfWidth: number;
}
const faces: FaceRow[] = FACE_KEYS.map((key) => {
  const f = FACES[key];
  const nu = cells.map((c) => f.num(c.row));
  const de = cells.map((c) => f.dn(c.row));
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
    face: key, unit: f.unit, what: f.what, denNote: f.den,
    value: point, numerator: sum(nu), denominator: sum(de),
    ciLo: lo, ciHi: hi, halfWidth: (hi - lo) / 2,
  };
});
const face = (k: string): FaceRow => {
  const f = faces.find((x) => x.face === k);
  if (f === undefined) { banner(`DX-C2 FATAL — unknown face ${k}`); process.exit(3); }
  return f!;
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
  const nl = cells.map((c) => fl.num(c.row));
  const dl = cells.map((c) => fl.dn(c.row));
  const nr = cells.map((c) => fr.num(c.row));
  const dr = cells.map((c) => fr.dn(c.row));
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
const CONTRASTS: [string, string, string][] = [
  ['discriminationUnresolved', 'meet.unresolved.unmeetable', 'meet.unresolved.meetable'],
  ['completionMeetableVsUnmeetable', 'meet.completion.meetable', 'meet.completion.unmeetable'],
  ['interceptedMeetableVsUnmeetable', 'meet.interceptedShare.meetable',
    'meet.interceptedShare.unmeetable'],
  ['marginStrikeVsElect', 'margin.meanStrikeSeconds.carried', 'meet.marginMeanSeconds.carried'],
];
const deltas = CONTRASTS.map(([k, l, r]) => contrast(k, l, r));
const delta = (k: string): DeltaRow => {
  const d = deltas.find((x) => x.key === k);
  if (d === undefined) { banner(`DX-C2 FATAL — unknown contrast ${k}`); process.exit(3); }
  return d!;
};

/* ========================================================================== */
/* §14 THE (b) DISCRIMINATION — the FROZEN rule applied to the frozen numbers   */
/* ========================================================================== */
/**
 * ⭐⭐ THE RULE, FROZEN AT §P.C BEFORE ANY BATTERY SEED, carrying #359 item 2(b)'s
 * PRE-COMMITMENT:
 *   DISCRIMINATES ⇒ the (unmeetable − meetable) unresolved-share contrast on CARRIED passes
 *     has its 95 % interval ENTIRELY ABOVE ZERO. Reading: the account's sign predicts the
 *     loss bucket ⇒ the receiver-access PRICE has its licence (the commander rules).
 *   DOES-NOT-DISCRIMINATE ⇒ the interval CONTAINS ZERO ⇒ per the pre-commitment the seat is
 *     NOT dispatched and the arc returns to the user.
 *   INVERTED ⇒ the interval lies ENTIRELY BELOW ZERO ⇒ the account is WRONG about the world;
 *     blocks the seat the same way, and the finding is reported as-is.
 */
const disc = delta('discriminationUnresolved');
const DISCRIMINATION: 'DISCRIMINATES' | 'DOES-NOT-DISCRIMINATE' | 'INVERTED' =
  disc.excludesZeroAbove ? 'DISCRIMINATES'
    : disc.excludesZeroBelow ? 'INVERTED' : 'DOES-NOT-DISCRIMINATE';
const DISCRIMINATION_READING = DISCRIMINATION === 'DISCRIMINATES'
  ? 'THE MARGIN PREDICTS THE UNRESOLVED BUCKET — the receiver-access price has its licence '
    + '(the commander rules; this census adjudicates nothing).'
  : DISCRIMINATION === 'INVERTED'
    ? 'INVERTED — unmeetable elections resolve BETTER than meetable ones; the account is wrong '
      + 'about the world. Per #359 item 2(b) the seat is BLOCKED and the arc returns to the user.'
    : 'THE MARGIN DOES NOT DISCRIMINATE at this power. Per #359 item 2(b)\'s pre-commitment the '
      + 'seat is NOT dispatched and the arc returns to the user.';

/* ========================================================================== */
/* §15 THE SIZING, SHOWN — the house form, from THIS census's own scratch smoke */
/* ========================================================================== */
/**
 * ⭐ THE HOUSE FORM (DX-C1 §15B's own, byte for byte in substance):
 *   1  se(n)      = half-width(n) / z.975
 *   2  se(needed) = |target| / (z.975 + z.80)
 *   3  N          = ceil( n · (se(n) / se(needed))² )
 *   4  MDE(N)     = half-width(n) · sqrt(n/N) · (z.975 + z.80) / z.975
 * ⚠ IT ASSUMES the battery's per-seed cluster variance is the smoke's — 12 scratch clusters is
 * a NOISY variance estimate. Said here, before the battery. The smoke is DISCLOSED IN FULL at
 * the doc's §DEV-PREFLIGHT. Targets = 0.05 and 0.03, the DX-C1 discriminating-face precedent.
 */
const Z975 = 1.959963985;
const Z80 = 0.8416212336;
const ZSUM = Z975 + Z80;
const SMOKE_N = 12;
/** the SCRATCH SMOKE's own realised Δ half-widths (seeds 900,001,200–211; §DEV-PREFLIGHT),
 *  read out of the smoke artifact's own `deltas[].halfWidth` fields — never re-typed from
 *  the console's rounded print */
const SIZING_INPUTS: { face: string; group: string; hwSmoke: number; target: number }[] = [
  { face: 'discriminationUnresolved', group: '(b)', hwSmoke: 0.2858294188081422, target: 0.05 },
  { face: 'discriminationUnresolved@0.03', group: '(b)',
    hwSmoke: 0.2858294188081422, target: 0.03 },
  { face: 'completionMeetableVsUnmeetable', group: '(b)',
    hwSmoke: 0.3792824822236587, target: 0.05 },
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
  };
});
const SIZING_OK = sizingRows.every((r) => Number.isFinite(r.nRequired) && r.nRequired > 0);

/* ========================================================================== */
/* §16 THE GATES                                                               */
/* ========================================================================== */
const totalGp = cells.reduce((a, c) => a + c.row.gpMeasured, 0);
const totalByClass = zeros(CARRY_CLASSES.length);
for (const c of cells) addInto(totalByClass, c.row.byClass);
const totalOutcome = zeros2(CARRY_CLASSES.length, OUTCOMES.length);
for (const c of cells) addInto2(totalOutcome, c.row.byClassOutcome);
const totalMeetN = zeros(MEET_CLASSES.length);
for (const c of cells) addInto(totalMeetN, c.row.meetN);
const totalMeetOutcome = zeros2(MEET_CLASSES.length, OUTCOMES.length);
for (const c of cells) addInto2(totalMeetOutcome, c.row.meetOutcome);
const totalCarriedMarginN = cells.reduce((a, c) => a + c.row.marginN[CI('carried')], 0);

const walkedSeeds = [...new Set(cells.map((c) => c.seed))].sort((a, b) => a - b);
const inBlock = (s: number): boolean => s >= BLOCK_BASE && s <= BLOCK_TOP;

const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: cells.every((c) => c.row.worldOk) && receiptRow.worldOk,
    note: 'every walked match is world 11 with `dxWindupAim`, `bkGroundCorridor`, both DLC '
      + 'doors and `o1PassWindup` ALL TRUE — asserted off the REAL constructed match',
  },
  gGeneValuePinned: {
    ok: cells.every((c) => c.row.geneOk) && receiptRow.geneOk,
    note: 'BOTH genes checked BY VALUE on BOTH match-local views of BOTH teams, every walked '
      + 'match; the DLC gene read back through the SHIPPED `passLeadSupportWeight` map',
  },
  gGenomeClean: {
    ok: cells.every((c) => c.row.genomeClean) && receiptRow.genomeClean,
    note: 'the FRANCHISE genome carries NEITHER gene (canon: dose placement, #270.2 / #334.1)',
  },
  gSeamSitesPinned: {
    ok: SEAM_OK,
    note: 'ONE `dxWindupAim` fork · ONE arm-time consumption gate · ONE plumb-through · ONE '
      + 'deposit write · ONE `armPendingPass` definition + ONE brain call site · ONE GC fork · '
      + 'ONE `dlcDeliveryChoice` fork · ONE `dlcStrikePlane` fork · ZERO of the four doors in '
      + '`a4World.ts`',
  },
  gAnchoredConstants: {
    ok: ANCHORS_OK,
    note: '⭐⭐ THE ACCOUNT\'S OWN TRACE — `interceptBall`\'s ts-clamp (1 hit) and time-to-point '
      + 'form (2 hits, both branches, stated), the MARK_SAG account line (1 hit — the defence\'s '
      + 'own half of the same account), the PURE `topSpeed` getter (1 hit); plus the inherited '
      + 'structural pins: `struckLead`, the aim composition, `PTP_FLIGHT_SPEED`, '
      + '`PTP_LEAD_FLIGHT_MUL`, `CONTROL_RADIUS`',
  },
  gWalkFixtures: {
    ok: FIXTURES_OK,
    note: `${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length} walk-side predicate `
      + 'fixtures — every headline-bearing predicate (the account arithmetic INCLUDED) is a '
      + 'PURE function called by BOTH the walk and this table',
  },
  gCarryPartition: {
    ok: sum(totalByClass) === totalGp && totalGp > 0
      && CARRY_CLASSES.every((_, i) => sum(totalOutcome[i]) === totalByClass[i]),
    note: 'every measured ground pass lands in EXACTLY ONE carry class, and every class row\'s '
      + 'outcomes sum to its own count',
  },
  gMeetPartition: {
    ok: sum(totalMeetN) === totalCarriedMarginN && totalCarriedMarginN > 0
      && MEET_CLASSES.every((_, i) => sum(totalMeetOutcome[i]) === totalMeetN[i]),
    note: 'every carried pass with a margin read lands in EXACTLY ONE meetability class, and '
      + 'each class\'s outcomes sum to its own count',
  },
  gClassesNonVacuous: {
    ok: totalMeetN[0] > 0 && totalMeetN[1] > 0
      && totalByClass[CI('windupToFeet')] > 0
      && cells.reduce((a, c) => a + c.row.calN, 0) > 0,
    note: '⛔ no face is computed on an empty cell: BOTH meetability classes of the carried '
      + 'class are populated (the discriminating pair has two live denominators), the to-feet '
      + 'anchor class is populated, and the (c) calibration has a denominator. ⚠ this gate '
      + 'reads LIVENESS, never a direction and never a magnitude',
  },
  gDepositCarriesElection: {
    ok: cells.every((c) => c.row.depMismatch === 0 && c.row.depResolveMismatch === 0)
      && receiptRow.depMismatch === 0
      && cells.reduce((a, c) => a + c.row.depCarriedOk, 0) > 0,
    note: 'DX-T1 §R6\'s pin RE-RUN on this block: an eligible deposit ⇒ `aimLead` EQUALS it '
      + 'component for component; otherwise EXACTLY `null`; the release hands `performPass` '
      + 'that same record value. ZERO mismatches',
  },
  gLockstep: {
    ok: LOCKSTEP_OK,
    note: '⭐ the THREE observation wrappers are BYTE-INERT (the DX-C1 precedent): the same '
      + 'scratch seed walked traced and untraced yields a BYTE-IDENTICAL whole-match signature',
  },
  gQuotedSourceIntact: {
    ok: DXC1_QUOTED_OK,
    note: 'DX-C1\'s artifact bytes are HASHED BEFORE PARSING and its context fields are READ, '
      + 'never re-typed from prose (canon: dose-source guards)',
  },
  gSrcUntouched: {
    ok: gitOut('git diff --stat HEAD -- src') === ''
      && gitOut('git status --porcelain -- src') === '',
    note: 'worktree-vs-HEAD over `src/`: `git diff --stat HEAD -- src` AND '
      + '`git status --porcelain -- src` both EMPTY (canon: xSrcUntouched)',
  },
  gSeedsBookedEqualWalked: {
    ok: !IS_OVERRIDE
      ? (walkedSeeds.length === N_FROZEN && walkedSeeds.every(inBlock) && inBlock(RECEIPT_SEED)
        && walksBooked === N_FROZEN + 1
        && LOCKSTEP_SEEDS.every((s) => s >= 900_000_000))
      : (walkedSeeds.length === N && walksBooked === N + 1
        && LOCKSTEP_SEEDS.every((s) => s >= 900_000_000)),
    note: 'BOOKED = WALKED, derived from the CELLS\' OWN distinct seeds; every battery seed and '
      + 'the construction receipt lie inside block 12,530,000–999; every lockstep seed is '
      + 'out-of-band scratch (≥ 900,000,000)',
  },
  gN: {
    ok: SIZING_OK && (!IS_OVERRIDE
      ? (cells.length === N_FROZEN && OVERRIDE_REASONS.length === 0)
      : (cells.length === N && !isCanonical(OUT_BASE) && OVERRIDE_REASONS.length > 0)),
    note: IS_OVERRIDE
      ? 'THE OVERRIDE ARM: the override is DECLARED, the walked n equals the n it declared, '
        + 'and the artifact sits OFF every canonical path'
      : 'THE FROZEN ARM: no override env at all, and the battery ran at exactly N_FROZEN = 900',
  },
};

/* ========================================================================== */
/* §17 THE ARTIFACT                                                            */
/* ========================================================================== */
const perSeedCells = cells.map((c) => ({ seed: c.seed, ...c.row }));
const pooledMarginElect = zeros2(CARRY_CLASSES.length, MARGIN_BINS);
const pooledMarginStrike = zeros(MARGIN_BINS);
const pooledCalDiff = zeros(CAL_BINS);
const pooledLead = zeros(LEAD_BINS);
const pooledArr = zeros(ARR_BINS);
for (const c of cells) {
  addInto2(pooledMarginElect, c.row.marginElectBins);
  addInto(pooledMarginStrike, c.row.marginStrikeBins);
  addInto(pooledCalDiff, c.row.calDiffBins);
  addInto(pooledLead, c.row.leadBins);
  addInto(pooledArr, c.row.arrDistBins);
}

const BODY_SCHEMA = [
  'stage', 'gates', 'faces', 'deltas', 'discrimination', 'bins', 'account',
  'carryClasses', 'meetClasses', 'outcomes', 'seeds', 'stats',
  'quotedContext', 'anchoredSites', 'fixtures', 'lockstep', 'perf', 'honestLimits', 'sizing',
] as const;

const artifact: Record<string, unknown> = {
  stage: {
    id: 'DX-C2',
    title: 'THE MEETABILITY CENSUS — the unmeetable share per delivery class under the traced '
      + 'access-time account · the margin→unresolved discriminating face · the account\'s own '
      + 'calibration against measured arrivals',
    doc: 'docs/world-model/DX-C2-MEETABILITY-CENSUS.md',
    contract: 'docs/world-model/DX-DELIVERY-EXECUTION-CONTRACT.md',
    predecessor: 'docs/world-model/DX-C1-ARRIVAL-CENSUS.md',
    censusFormOfRecord: 'docs/world-model/BK-C2-CAROM-CENSUS.md (via DX-C1)',
    authorizedBy: 'COMMANDER RULING #359 item 2 (the user\'s #358-fork election, verbatim: '
      + '「①′ 接应时间入价」)',
    kind: 'CENSUS — it publishes MEASUREMENTS; it scores no hypothesis, arms no mechanism and '
      + 'ADJUDICATES NOTHING. ⭐ ONE PRE-COMMITMENT RIDES ON IT (#359 item 2(b)): a margin that '
      + 'does not discriminate the unresolved bucket BLOCKS the receiver-access seat.',
    arm: 'ONE ARM — the DX-T1 ARMED composition at the PINNED MAXIMUM: a4MatchFlags(11) + '
      + '`dlcDeliveryChoice` + `dlcStrikePlane` + `bkGroundCorridor` + `dxWindupAim` + '
      + 'armA4World(m, null, 11) + `passLeadSupport` = 1 written MATCH-LOCAL.',
    xSrcZero: 'no file under `src/` is edited. The probe CALLS the shipped exports and reads '
      + 'Match state per tick. Three observation wrappers (`armPendingPass`, '
      + '`resolvePendingPassWindup`, `performPass`) delegate unchanged and are proven '
      + 'byte-inert by `gLockstep`.',
    mode: MODE ?? 'full', overrideReasons: OVERRIDE_REASONS,
    generatedAtUtc: new Date().toISOString(),
    instrument: 'scripts/probes/dx-c2-meetability-census.ts',
    instrumentSha256: sha(readFileSync('scripts/probes/dx-c2-meetability-census.ts', 'utf8')),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: {
      [MATCH_PATH]: sha(MATCH_SRC), [BRAIN_PATH]: sha(BRAIN_SRC), [MECH_PATH]: sha(MECH_SRC),
      [SEAT_PATH]: sha(SEAT_SRC), [CONST_PATH]: sha(CONST_SRC), [PERC_PATH]: sha(PERC_SRC),
      [EXEC_PATH]: sha(EXEC_SRC), [PLAYER_PATH]: sha(PLAYER_SRC),
    },
  },
  account: {
    tBall: 'dist(passer, E) / PTP_FLIGHT_SPEED — the chooser\'s own flight law (`/ 18`)',
    tMate: 'dist(mate, E) / max(mate.topSpeed, 0.1) + 0.15 — `interceptBall`\'s own '
      + 'time-to-point form, byte for byte',
    margin: 'tBall − tMate (positive ⇒ the mate is at the point BEFORE the ball)',
    meetable: 'dist(mate, E) ≤ CONTROL_RADIUS OR margin ≥ 0 — the presence clause is the '
      + 'engine\'s own control cut; the sign cut is the account\'s own zero. NO taste '
      + 'threshold; the full margin histogram is stored so any other cut re-derives off disk.',
    electionInstant: 'wind-up flights: the ARM instant (the deposit tick — where the seat '
      + 'would price). Synchronous flights: the strike instant IS the election instant.',
    predictedArrDist: 'max(0, dMate − max(0, tBall − 0.15) · max(topSpeed, 0.1)) — the same '
      + 'account\'s straight-chase kinematics; (c) compares it against DX-C1\'s own measured '
      + 'arrival read.',
    symmetryPrecedent: 'the MARKING law already runs this account on the defence\'s side '
      + '(`tBall = dist / MARK_SAG_BALL_SPEED`, actionExecutor.ts — the #201 mechanism); '
      + 'this census measures the attack\'s missing half.',
  },
  anchoredSites: [
    { what: '⭐⭐ interceptBall\'s ts clamp — the traced chase speed', file: PERC_PATH,
      needle: TS_CLAMP_NEEDLE, occurrences: TS_CLAMP_HITS },
    { what: '⭐⭐ interceptBall\'s time-to-point form (2 honest occurrences: airborne + ground)',
      file: PERC_PATH, needle: TME_NEEDLE, occurrences: TME_HITS },
    { what: '⭐ the MARK_SAG account — the defence\'s own half of the same account (#201)',
      file: EXEC_PATH, needle: MARKSAG_NEEDLE, occurrences: MARKSAG_HITS },
    { what: 'the PURE topSpeed getter the account reads', file: PLAYER_PATH,
      needle: TOPSPEED_NEEDLE, occurrences: TOPSPEED_HITS },
    { what: '⭐⭐ THE STRUCTURAL PIN — the receiver\'s position is RE-READ AT STRIKE TIME',
      file: MECH_PATH, needle: STRUCK_LEAD_NEEDLE, occurrences: STRUCK_LEAD_HITS },
    { what: '⭐⭐ THE AIM COMPOSITION — `struckLead + ptpLead` (the ball is struck BEYOND the '
      + 'priced point)', file: MECH_PATH, needle: STRUCK_AIM_NEEDLE,
    occurrences: STRUCK_AIM_HITS },
    { what: 'PTP_FLIGHT_SPEED', file: SEAT_PATH, needle: PTP_SPEED_NEEDLE,
      occurrences: PTP_SPEED_HITS, extracted: PTP_FLIGHT_SPEED },
    { what: 'PTP_LEAD_FLIGHT_MUL', file: SEAT_PATH, needle: PTP_MUL_NEEDLE,
      occurrences: PTP_MUL_HITS, extracted: PTP_LEAD_FLIGHT_MUL },
    { what: 'CONTROL_RADIUS — the presence clause\'s anchored cut', file: CONST_PATH,
      needle: CONTROL_R_NEEDLE, occurrences: CONTROL_R_HITS, extracted: CONTROL_RADIUS },
    { what: 'THE ONE `dxWindupAim` FORK', file: BRAIN_PATH, needle: DX_FORK_NEEDLE,
      occurrences: DX_FORK_HITS },
    { what: 'THE ONE ARM-TIME CONSUMPTION GATE', file: MATCH_PATH, needle: DX_ARM_NEEDLE,
      occurrences: DX_ARM_HITS },
    { what: 'THE ONE PLUMB-THROUGH', file: MATCH_PATH, needle: DX_RESOLVE_NEEDLE,
      occurrences: DX_RESOLVE_HITS },
  ],
  fixtures: FIXTURES,
  lockstep: lockstepRows,
  sizing: {
    form: 'se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/'
      + 'se(needed))²) · MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975',
    varianceSource: 'THIS census\'s own 12-cluster SCRATCH SMOKE (seeds 900,001,200–211), '
      + 'DISCLOSED IN FULL at the doc\'s §DEV-PREFLIGHT. ⚠ 12 clusters is a NOISY variance '
      + 'estimate. Targets 0.05 / 0.03 — the DX-C1 discriminating-face precedent.',
    nFrozen: N_FROZEN,
    rows: sizingRows,
  },
  gates,
  allGreen: Object.values(gates).every((g) => g.ok),
  faces,
  deltas,
  discrimination: {
    face: 'discriminationUnresolved',
    frozenRule: 'DISCRIMINATES ⇒ the (unmeetable − meetable) unresolved-share contrast on '
      + 'CARRIED passes has its 95 % interval ENTIRELY ABOVE ZERO. DOES-NOT-DISCRIMINATE ⇒ '
      + 'the interval CONTAINS ZERO ⇒ per #359 item 2(b)\'s PRE-COMMITMENT the seat is NOT '
      + 'dispatched and the arc returns to the user. INVERTED ⇒ entirely below zero — blocks '
      + 'the same way, reported as-is. FROZEN AT §P.C BEFORE ANY BATTERY SEED.',
    verdict: DISCRIMINATION,
    reading: DISCRIMINATION_READING,
    delta: disc,
  },
  carryClasses: CARRY_CLASSES,
  meetClasses: MEET_CLASSES,
  outcomes: OUTCOMES,
  bins: {
    marginElectSecondsByClass: { width: MARGIN_BIN_S, bins: MARGIN_BINS, centreHoldsZero: true,
      classes: CARRY_CLASSES, pooled: pooledMarginElect },
    marginStrikeSecondsCarried: { width: MARGIN_BIN_S, bins: MARGIN_BINS, centreHoldsZero: true,
      pooled: pooledMarginStrike },
    calibrationDiffMetres: { width: CAL_BIN_M, bins: CAL_BINS, centreHoldsZero: true,
      pooled: pooledCalDiff },
    carriedLeadMetres: { width: LEAD_BIN_M, bins: LEAD_BINS, overflowIsLast: true,
      pooled: pooledLead },
    arrivalDistanceMetres: { width: ARR_BIN_M, bins: ARR_BINS, overflowIsLast: true,
      pooled: pooledArr },
  },
  seeds: {
    block: [BLOCK_BASE, BLOCK_TOP],
    batterySeeds: [batterySeeds[0], batterySeeds[batterySeeds.length - 1]],
    distinctWalked: walkedSeeds.length,
    constructionReceiptSeed: RECEIPT_SEED,
    walksBooked,
    lockstepScratchSeedsWalked: LOCKSTEP_SEEDS,
    bootstrapRngSeededFrom: BLOCK_BASE,
  },
  stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 73 },
  quotedContext: {
    dxC1: {
      role: '⚠ DIFFERENT-BATTERY CONTEXT (block 12,528,000–999). Quoted so the reader can see '
        + 'the pathology this census dissects without re-walking it. ⛔ NO Δ IS COMPUTED '
        + 'ACROSS BATTERIES.',
      source: { path: DXC1_PATH, sha256: DXC1_SHA },
      hashedBodySha256: DXC1.hashedBodySha256,
      carriedCompletion: DXC1_CARRIED_COMPLETION,
      meanCarriedLeadMetres: DXC1_MEAN_LEAD,
      arrivalShareReached: DXC1_ARRIVAL_REACHED,
    },
  },
  perf: {
    batteryWallSeconds: (Date.now() - t0Wall) / 1000,
    meanWallSecondsPerMatch: cells.reduce((a, c) => a + c.row.wallMs, 0) / 1000 / cells.length,
    note: '⚠ A MACHINE READING ON ONE MACHINE. The timed region is the WALK, observer reads '
      + 'and the three wrappers included — never the game\'s frame cost.',
  },
  honestLimits: [
    '⭐⭐ THE ACCOUNT IS THE CHOOSER-SIDE ACCOUNT. tBall uses the chooser\'s own flight law '
    + '(`d / 18`, friction-free); the REAL ball decays by friction and is struck BEYOND the '
    + 'priced point (`struckLead + ptpLead`, anchored). (c) exists exactly to size what those '
    + 'idealisations cost — the account is calibrated against the world, never assumed.',
    '⭐⭐ (c) CONFLATES MODEL ERROR WITH BEHAVIOUR, AND SAYS SO. predictedArrDist assumes an '
    + 'ideal straight chase from the election instant; the live receiver has no ReceivePass '
    + 'until the ball is struck and targeted at him. A large positive (measured − predicted) '
    + 'on MEETABLE elections is therefore evidence about the COOPERATION half (the receiver '
    + 'does not chase what the account says he could reach) — a finding, not an instrument '
    + 'error.',
    '⚠ THE MARGIN AT THE ELECTION INSTANT IS STATIC: dist/topSpeed from a standing start plus '
    + 'one reaction beat. The receiver\'s own velocity at election is NOT credited (the traced '
    + 'form does not credit it either — `interceptBall` re-solves per tick instead). The '
    + 'strike-instant re-read is published beside it so the wind-up\'s staleness is visible.',
    '⚠ THE PRESENCE CLAUSE (dMate ≤ CONTROL_RADIUS ⇒ meetable) exists because the traced '
    + 'form charges a 0.15 s reaction beat even to a body already standing at the point — '
    + 'without it every pass shorter than 2.7 m would read unmeetable by arithmetic. It is '
    + 'the engine\'s own control cut, anchored, and it cannot fire on the carried class\'s '
    + 'multi-metre leads.',
    '⚠ THE OUTCOME LADDER IS TEMPORAL, NOT CAUSAL (BK-C2 §P.7\'s own warning).',
    '⚠ ONE ARM at the PINNED MAXIMUM (gene = 1) — the pathology in volume, per #359 item 4. '
    + 'No dose sweep here; DX-T2 owns the dose question.',
    '⚠ SYNCHRONOUS classes\' election instant IS their strike instant, so their marginElect '
    + 'carries no staleness by construction — stated so the per-class comparison is read '
    + 'correctly.',
    '⚠ CLOCK. 1 sim-s = 60 ticks = 22.5 display-s; the match is 240 sim-seconds. Every '
    + 'per-match COUNT face carries the clock in its unit string; every SHARE face is '
    + 'clock-invariant.',
  ],
  perSeedCells,
  constructionReceipt: receiptRow,
};
const body: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body[k] = artifact[k];
artifact.hashedBodySha256 = sha(canonicalJson(body));

/* ========================================================================== */
/* §18 gFaces — RE-DERIVE EVERY PUBLISHED FACE OFF THE SERIALIZED ARTIFACT      */
/* ========================================================================== */
const ALL_GREEN_PRE = Object.values(gates).every((g) => g.ok);
const OUT_PATH_PRE = OUT_BASE;
writeFileSync(OUT_PATH_PRE, `${JSON.stringify(artifact, null, 2)}\n`);
const disk = JSON.parse(readFileSync(OUT_PATH_PRE, 'utf8')) as typeof artifact & {
  perSeedCells: (Row & { seed: number })[];
  faces: FaceRow[]; deltas: DeltaRow[];
  bins: Record<string, { pooled?: number[] | number[][] }>;
  discrimination: { verdict: string; delta: DeltaRow };
};
const dcells = disk.perSeedCells;
const faceChecks: { face: string; ok: boolean }[] = [];
for (const f of disk.faces) {
  const def = FACES[f.face];
  const nu = sum(dcells.map((c) => def.num(c)));
  const de = sum(dcells.map((c) => def.dn(c)));
  const v = ratio(nu, de);
  const ok = nu === f.numerator && de === f.denominator
    && (Number.isNaN(v) ? Number.isNaN(f.value) : v === f.value);
  faceChecks.push({ face: f.face, ok });
}
for (const dd of disk.deltas) {
  const fl = FACES[dd.left];
  const fr = FACES[dd.right];
  const pl = ratio(sum(dcells.map((c) => fl.num(c))), sum(dcells.map((c) => fl.dn(c))));
  const pr = ratio(sum(dcells.map((c) => fr.num(c))), sum(dcells.map((c) => fr.dn(c))));
  const ok = (Number.isNaN(pl) ? Number.isNaN(dd.leftValue) : pl === dd.leftValue)
    && (Number.isNaN(pr) ? Number.isNaN(dd.rightValue) : pr === dd.rightValue)
    && (Number.isNaN(pl - pr) ? Number.isNaN(dd.delta) : pl - pr === dd.delta);
  faceChecks.push({ face: `delta.${dd.key}`, ok });
}
const binChecks: { bin: string; ok: boolean }[] = [];
{
  const got = zeros2(CARRY_CLASSES.length, MARGIN_BINS);
  for (const c of dcells) addInto2(got, c.marginElectBins);
  binChecks.push({ bin: 'marginElectSecondsByClass',
    ok: JSON.stringify(got) === JSON.stringify(disk.bins.marginElectSecondsByClass.pooled) });
}
const reBin = (key: string, pick: (r: Row) => number[]): void => {
  const got = zeros(pick(dcells[0]).length);
  for (const c of dcells) addInto(got, pick(c));
  binChecks.push({ bin: key,
    ok: JSON.stringify(got) === JSON.stringify(disk.bins[key]?.pooled ?? []) });
};
reBin('marginStrikeSecondsCarried', (r) => r.marginStrikeBins);
reBin('calibrationDiffMetres', (r) => r.calDiffBins);
reBin('carriedLeadMetres', (r) => r.leadBins);
reBin('arrivalDistanceMetres', (r) => r.arrDistBins);
/** ⭐ THE VERDICT ITSELF is re-derived from the serialized delta */
const dsd = disk.discrimination.delta;
const reVerdict = dsd.ciLo > 0 ? 'DISCRIMINATES' : dsd.ciHi < 0 ? 'INVERTED'
  : 'DOES-NOT-DISCRIMINATE';
binChecks.push({ bin: 'discrimination.verdict', ok: reVerdict === disk.discrimination.verdict });
/** ⭐ THE PARTITIONS re-derive off disk too */
{
  const bc = zeros(CARRY_CLASSES.length);
  for (const c of dcells) addInto(bc, c.byClass);
  const gp = dcells.reduce((a, c) => a + c.gpMeasured, 0);
  binChecks.push({ bin: 'partition.carry', ok: sum(bc) === gp });
  const mn = zeros(MEET_CLASSES.length);
  for (const c of dcells) addInto(mn, c.meetN);
  binChecks.push({ bin: 'partition.meet',
    ok: sum(mn) === dcells.reduce((a, c) => a + c.marginN[CI('carried')], 0) });
}
/** ⭐ EVERY SIZING ROW's ARITHMETIC re-derives off disk, step by step */
{
  const sz = (disk as unknown as { sizing: { rows: typeof sizingRows } }).sizing.rows;
  for (const r of sz) {
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
}
const FACES_OK = faceChecks.every((f) => f.ok) && binChecks.every((b) => b.ok);
gates.gFaces = {
  ok: FACES_OK,
  note: `${faceChecks.filter((f) => f.ok).length}/${faceChecks.length} face-and-Δ checks and `
    + `${binChecks.filter((b) => b.ok).length}/${binChecks.length} stored-bin / partition / `
    + 'VERDICT checks re-derived from the SERIALIZED artifact off disk',
};
artifact.gates = gates;
artifact.gFacesDetail = { faceChecks, binChecks };
const ALL_GREEN = ALL_GREEN_PRE && FACES_OK;
artifact.allGreen = ALL_GREEN;
/** ⭐ THE RED-ROUTING IDIOM, IN CODE (#334 item 5) — evaluated after `gFaces` */
const OUT_PATH = ALL_GREEN ? OUT_BASE : `${OUT_BASE}.RED.json`;
writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);
if (OUT_PATH !== OUT_PATH_PRE) {
  try { execSync(`rm -f ${JSON.stringify(OUT_PATH_PRE)}`); } catch { /* nothing */ }
}

/* ========================================================================== */
/* §19 THE CONSOLE READ                                                        */
/* ========================================================================== */
banner('');
banner(`DX-C2 — ${ALL_GREEN ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to the .RED path'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner('--- (a) THE UNMEETABLE SHARE, per class (election instant) ---');
for (const k of CARRY_CLASSES) {
  if (k === 'otherGround') continue;
  const u = face(`meet.unmeetableShare.${k}`);
  const mg = face(`meet.marginMeanSeconds.${k}`);
  banner(`  ${k.padEnd(13)} unmeetable ${u.value.toFixed(6)} [${u.ciLo.toFixed(6)}, `
    + `${u.ciHi.toFixed(6)}]  n=${u.denominator}  mean margin ${mg.value.toFixed(4)} s`);
}
banner(`  carried strike-instant margin ${face('margin.meanStrikeSeconds.carried').value
  .toFixed(4)} s; mean lead ${face('arrival.meanCarriedLeadMetres').value.toFixed(4)} m; `
  + `mean dMate@elect ${face('arrival.meanDMateElectMetres').value.toFixed(4)} m`);
banner('');
banner('--- (b) THE DISCRIMINATING FACE (carried, meetable vs unmeetable) ---');
for (const mc of MEET_CLASSES) {
  const u = face(`meet.unresolved.${mc}`);
  const c = face(`meet.completion.${mc}`);
  const v = face(`meet.volumeShare.${mc}`);
  banner(`  ${mc.padEnd(10)} share ${v.value.toFixed(6)} (n=${v.numerator})  unresolved `
    + `${u.value.toFixed(6)} [${u.ciLo.toFixed(6)}, ${u.ciHi.toFixed(6)}]  completion `
    + `${c.value.toFixed(6)}`);
}
banner(`  Δ unresolved (unmeetable − meetable): ${disc.delta.toFixed(6)} `
  + `[${disc.ciLo.toFixed(6)}, ${disc.ciHi.toFixed(6)}] `
  + `(${disc.absDeltaOverHalfWidth.toFixed(3)} hw)  ⇒ ${DISCRIMINATION}`);
const dcomp = delta('completionMeetableVsUnmeetable');
banner(`  Δ completion (meetable − unmeetable): ${dcomp.delta.toFixed(6)} `
  + `[${dcomp.ciLo.toFixed(6)}, ${dcomp.ciHi.toFixed(6)}]`);
banner('');
banner('--- (c) THE ACCOUNT\'S OWN CALIBRATION ---');
banner(`  predicted ${face('cal.meanPredictedArrDistMetres').value.toFixed(4)} m vs measured `
  + `${face('cal.meanMeasuredArrDistMetres').value.toFixed(4)} m; diff `
  + `${face('cal.meanDiffMetres').value.toFixed(4)} m (meetable-only diff `
  + `${face('cal.meetable.meanDiffMetres').value.toFixed(4)} m, n=`
  + `${face('cal.meetable.meanDiffMetres').denominator})`);
banner('');
banner(`artifact → ${OUT_PATH}`);
banner(`hashedBodySha256 = ${artifact.hashedBodySha256 as string}`);
banner(`wall ${((Date.now() - t0Wall) / 1000).toFixed(2)} s`);
if (!ALL_GREEN) process.exit(1);
