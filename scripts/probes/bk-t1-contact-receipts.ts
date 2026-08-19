/**
 * ⭐ BK-T1 — THE CONTACT LAW'S RECEIPT WALKS (docs/world-model/BK-T1-CONTACT-LAW.md).
 *
 * Authorized by ruling #307 item 4 for EXACTLY this stage. This is NOT an exam and NOT a
 * census: it is the ARMING RECEIPT instrument for a dormant src seam — it shows the seam FIRES
 * and it proves the doors/lifecycle at the world-8 composition (M-BK.4 / M-BU.2 lineage).
 *
 * ⭐ CANON, COPIED FROM CANON.md BESIDE ITS ACTUAL HOME (never re-typed from memory, #301):
 *   · receipts ≠ effect sizes — arming/plumbing receipts are never quoted as football effect
 *     sizes.  HOMES: ruling #289 item 1 + BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS
 *     item 5. (paraphrase)   ⇒ EVERY face below is a RECEIPT. NO football claim.
 *   · freeze-before-battery — freeze the instrument commit BEFORE the battery; the artifact
 *     records the instrument hash.        HOME: ruling #266.3(c). (paraphrase)
 *   · composition proof — any world arming a new seam alongside the CB/L3 stack proves the
 *     doors/lifecycle at THAT composition first.  HOME: BU contract M-BU.2 (ruling #285),
 *     inherited by M-BK.4. (paraphrase)
 *   · "a field carries the unit its name claims".   HOME: ruling #294 item 3.
 *   · "a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated
 *     face".  HOME: PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4.
 *   · "a src-extracted constant pins its extraction to the NAMED call site — anchored match +
 *     line receipt — never first-occurrence".  HOME: BK-C0-BODYBALL-CENSUS.md §COMMANDER
 *     CORRECTIONS item 1 (ruling #306 item 4).
 *   · "the re-derivation gate parses the SERIALIZED artifact off disk". HOME: ruling #287
 *     item 1. (paraphrase)
 *   · seed discipline — BOOKED = WALKED reporting; blocks consumed whole of record.
 *     HOME: the standing frontier practice. (paraphrase)
 *
 * ⭐ THE INSTRUMENT IS BK-C0's, REUSED: the free-ball / playing-phase per-tick per-body sweep,
 *   the last-toucher + this-tick's-contact exclusions, the two radii (PLAYER_CORE_RADIUS
 *   visual · CONTROL_RADIUS reach), the 7-cause ladder in the census's own order, dead-band
 *   ball-ticks, cooldown-invisible body-ticks/episodes.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: BKT1_MODE (smoke|full, REQUIRED) · BKT1_N · BKT1_OUT.
 *   ANY other `BKT1_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *
 * RUN: BKT1_MODE=full npx tsx scripts/probes/bk-t1-contact-receipts.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED · 2 = a refusal · 3 = world/dose class BIT.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import {
  CONTROL_MAX_HEIGHT, CONTROL_MAX_SPEED, CONTROL_RADIUS, DEFLECT_MAX_SPEED, DT,
  GK_CLAIM_HEIGHT, GK_CONTROL_MAX_SPEED, HEADER_MIN_HEIGHT, PLAYER_CORE_RADIUS,
} from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells, type L3DoseCell,
} from '../../src/game/a4World';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const t0Wall = Date.now();
const sha = (s: string): string => createHash('sha256').update(s).digest('hex');
const banner = (s: string): void => { process.stdout.write(`${s}\n`); };
const die = (code: number, why: string): never => {
  banner(`BK-T1 RECEIPTS REFUSED: ${why}`);
  process.exit(code);
};

/* ========================================================================== */
/* §1 THE ENV SURFACE — WHITELIST OR REFUSE                                   */
/* ========================================================================== */
const ALLOWED = new Set(['BKT1_MODE', 'BKT1_N', 'BKT1_OUT']);
for (const k of Object.keys(process.env)) {
  if (k.startsWith('BKT1_') && !ALLOWED.has(k)) die(2, `unknown env override \`${k}\``);
  if (/^(EDS_|A4_|MT_|PC_|L3_|CB_|PW_|BK_)/.test(k) && !ALLOWED.has(k)) {
    die(2, `an engine env door is set: \`${k}\``);
  }
}
const MODE = process.env.BKT1_MODE;
if (MODE !== 'smoke' && MODE !== 'full') die(2, 'BKT1_MODE must be `smoke` or `full`');
const IS_OVERRIDE = process.env.BKT1_N !== undefined || process.env.BKT1_OUT !== undefined;
const CANONICAL_OUT = 'docs/world-model/data/bk-t1-contact-receipts.json';
const OUT_PATH = process.env.BKT1_OUT ?? CANONICAL_OUT;
if (IS_OVERRIDE && pathResolve(OUT_PATH) === pathResolve(CANONICAL_OUT)) {
  die(2, 'an OVERRIDE run may not write the canonical artifact path');
}

/* ========================================================================== */
/* §2 THE SEED LEDGER — BOOKED = WALKED, inside BK-T1's own block             */
/* ========================================================================== */
/** Block of record: 12,503,000–999 (ruling #307 item 4). */
const BLOCK = 12_503_000;
const N = Number(process.env.BKT1_N ?? (MODE === 'full' ? 40 : 4));
if (!Number.isInteger(N) || N < 1 || N > 400) die(2, 'BKT1_N must be an integer in [1, 400]');
/** The A/B receipt battery: each seed walked TWICE — the law armed, and the law shut. */
const BATTERY_SEEDS = Array.from({ length: N }, (_, i) => BLOCK + i);
/** The doors matrix seeds. */
const DOORS_SEEDS = [BLOCK + 500, BLOCK + 501, BLOCK + 502];
/** The world-construction receipt (the xxx,999 convention). */
const RECEIPT_SEED = BLOCK + 999;

/* ========================================================================== */
/* §3 THE DOSE SOURCES — FILE BYTES HASHED BEFORE THEY ARE PARSED             */
/* ========================================================================== */
const L3_T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_T1_PATH = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_BYTES = readFileSync(L3_T1_PATH, 'utf8');
const L3_BYTES_SHA = sha(L3_BYTES);
const L3_DOSE: L3DoseCell[] = poolT1DoseCells(JSON.parse(L3_BYTES) as Record<string, unknown>);
const PC_BYTES = readFileSync(PC_T1_PATH, 'utf8');
const PC_BYTES_SHA = sha(PC_BYTES);
const PC_DOSE = poolPcDoseTable(JSON.parse(PC_BYTES) as Record<string, unknown>);

/* ========================================================================== */
/* §4 THE SRC-EXTRACTED SITES — ANCHORED AT THEIR NAMED CALL SITES            */
/* ========================================================================== */
const MATCH_SRC = readFileSync('src/sim/Match.ts', 'utf8');
const MECH_SRC = readFileSync('src/sim/mechanics.ts', 'utf8');
const PHYS_SRC = readFileSync('src/sim/physical.ts', 'utf8');
const CONST_SRC = readFileSync('src/sim/constants.ts', 'utf8');

/** ⭐ THE CENSUS'S MOST-QUOTED CITATION — anchored TEXT + a LINE RECEIPT (BK-C0 §CORR 5). */
const GATE_TEXT = 'if (p.sentOff || p.kickCooldown > 0 || p.stunTimer > 0) continue;';
const gateLines = MATCH_SRC.split('\n')
  .map((l, i) => (l.includes(GATE_TEXT) ? i + 1 : 0)).filter((n) => n > 0);
if (gateLines.length !== 1) die(3, `the claim-filter gate occurs ${gateLines.length}× (expected 1)`);
const GATE_LINE = gateLines[0];

const anchored = (src: string, re: RegExp, what: string): string => {
  const m = re.exec(src);
  if (m === null) die(3, `anchored extraction failed for ${what}`);
  return m![1];
};
const SRC_CONTROL_MAX_HEIGHT = Number(
  anchored(CONST_SRC, /export const CONTROL_MAX_HEIGHT = ([0-9.]+);/, 'CONTROL_MAX_HEIGHT'),
);
const SRC_HEADER_MIN_HEIGHT = Number(
  anchored(CONST_SRC, /export const HEADER_MIN_HEIGHT = ([0-9.]+);/, 'HEADER_MIN_HEIGHT'),
);
if (SRC_CONTROL_MAX_HEIGHT !== CONTROL_MAX_HEIGHT || SRC_HEADER_MIN_HEIGHT !== HEADER_MIN_HEIGHT) {
  die(3, 'the z-band constants disagree with their anchored declarations');
}
const CLEARANCE_EXPR = 'const clearance = blockerCoreRadius + ball.radius;';
if (!PHYS_SRC.includes(CLEARANCE_EXPR)) die(3, 'the shell clearance expression moved');
const DEFLECT_OUTCOME = 'match.rng.range(-1.2, 1.2)), match.rng.range(4, 8))';
if (!MECH_SRC.includes(DEFLECT_OUTCOME)) die(3, 'the DEFLECT outcome expression moved');

/* ========================================================================== */
/* §5 THE INSTRUMENT — BK-C0's through-body sweep, reused                     */
/* ========================================================================== */
/** ⭐ THE CAUSE LADDER, in BK-C0 §3(b)'s OWN ORDER — one cell per body-tick. */
const CAUSES = [
  'aboveGkClaim', 'deadBand', 'aerialBand', 'cooldownInvisible', 'stunned',
  'speedAboveControl', 'rollOrClaimOrder',
] as const;
type Cause = (typeof CAUSES)[number];
const C = Object.fromEntries(CAUSES.map((c, i) => [c, i])) as Record<Cause, number>;
/** The engine's own trivially-trapped cut in `attemptFirstTouch` (`speed <= 6`). */
const TRIVIAL_TRAP_SPEED = 6;

interface Row {
  seed: number;
  armed: boolean;
  ticks: number;
  playingTicks: number;
  reachBodyTicks: number;
  reachEpisodes: number;
  coreBodyTicks: number;
  coreEpisodes: number;
  reachCauseTicks: number[];
  coreCauseTicks: number[];
  deadBandBallTicks: number;
  deadBandBallTicksWithBody: number;
  cooldownInvisibleBodyTicks: number;
  cooldownInvisibleEpisodes: number;
  /** the seam's own ledger, read off the engine at the end of the walk */
  strikeClaimsCooldown: number;
  strikeClaimsStunned: number;
  strikesApplied: number;
  strikesAppliedCooldown: number;
  strikesAppliedStunned: number;
  maxStrikeRelativeSpeed: number;
  partitionGroundTicks: number;
  /** LIFECYCLE: strikes booked on a tick whose phase was not `playing`. */
  strikesOutsidePlaying: number;
  /** SUPERPOWER: strikes after which the striking body owned the ball on the SAME tick. */
  strikesFollowedByOwnership: number;
  score: [number, number];
}

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

const buildMatch = (seed: number, flags: Record<string, unknown>): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(8), ...flags,
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, 8, L3_DOSE, PC_DOSE);
  return m;
};

const walk = (seed: number, armed: boolean): Row => {
  const m = buildMatch(seed, armed ? { bkContactLaw: true } : {});
  const row: Row = {
    seed, armed, ticks: 0, playingTicks: 0,
    reachBodyTicks: 0, reachEpisodes: 0, coreBodyTicks: 0, coreEpisodes: 0,
    reachCauseTicks: CAUSES.map(() => 0), coreCauseTicks: CAUSES.map(() => 0),
    deadBandBallTicks: 0, deadBandBallTicksWithBody: 0,
    cooldownInvisibleBodyTicks: 0, cooldownInvisibleEpisodes: 0,
    strikeClaimsCooldown: 0, strikeClaimsStunned: 0, strikesApplied: 0,
    strikesAppliedCooldown: 0, strikesAppliedStunned: 0, maxStrikeRelativeSpeed: 0,
    partitionGroundTicks: 0, strikesOutsidePlaying: 0, strikesFollowedByOwnership: 0,
    score: [0, 0],
  };
  const players: Player[] = m.allPlayers;
  const openReach = new Map<number, number>();
  const openCore = new Map<number, number>();
  const openCool = new Map<number, number>();
  const close = (map: Map<number, number>, gid: number, which: 'reach' | 'core' | 'cool'): void => {
    if (!map.has(gid)) return;
    map.delete(gid);
    if (which === 'reach') row.reachEpisodes++;
    else if (which === 'core') row.coreEpisodes++;
    else row.cooldownInvisibleEpisodes++;
  };
  let prevLastTouchGid: number | null = m.ball.lastTouch?.gid ?? null;
  let prevOwnerGid: number | null = m.ball.owner?.gid ?? null;
  let prevStrikes = 0;

  while (!m.finished) {
    m.step(DT);
    row.ticks++;
    const playing = m.phase === 'playing';
    if (playing) row.playingTicks++;
    const ball = m.ball;
    const ownerGid = ball.owner?.gid ?? null;
    const lastTouchGid = ball.lastTouch?.gid ?? null;
    const contactGid = lastTouchGid !== prevLastTouchGid ? lastTouchGid
      : (ownerGid !== null && ownerGid !== prevOwnerGid ? ownerGid : null);

    // ---- the seam's own lifecycle / superpower reads (ledger deltas) ----
    const strikes = m.bkContactLedger.strikesApplied;
    if (strikes > prevStrikes) {
      const delta = strikes - prevStrikes;
      if (!playing) row.strikesOutsidePlaying += delta;
      // the striking body is the ball's new lastTouch; a strike must NOT hand him the ball
      if (ownerGid !== null && ownerGid === lastTouchGid) row.strikesFollowedByOwnership += delta;
      prevStrikes = strikes;
    }

    // ---- BK-C0's through-body sweep ----
    const hSpeed = Math.hypot(ball.vel.x, ball.vel.y);
    const inDeadBand = ball.z > CONTROL_MAX_HEIGHT && ball.z < HEADER_MIN_HEIGHT;
    let anyBodyInReach = false;
    if (playing && ball.owner === null) {
      for (const p of players) {
        if (p.sentOff) continue;
        const dxp = p.pos.x - ball.pos.x;
        const dyp = p.pos.y - ball.pos.y;
        const dd = Math.hypot(dxp, dyp);
        if (dd < CONTROL_RADIUS) anyBodyInReach = true;
        const excluded = p.gid === lastTouchGid || p.gid === contactGid;
        const crossing = dd < CONTROL_RADIUS && !excluded;
        const core = dd < PLAYER_CORE_RADIUS && !excluded;
        if (crossing) {
          const cap = p.role === 'GK' ? GK_CONTROL_MAX_SPEED : CONTROL_MAX_SPEED;
          const cause: number = ball.z > GK_CLAIM_HEIGHT ? C.aboveGkClaim
            : inDeadBand ? C.deadBand
              : ball.z >= HEADER_MIN_HEIGHT ? C.aerialBand
                : p.kickCooldown > 0 ? C.cooldownInvisible
                  : p.stunTimer > 0 ? C.stunned
                    : hSpeed > cap && hSpeed > DEFLECT_MAX_SPEED ? C.speedAboveControl
                      : C.rollOrClaimOrder;
          row.reachBodyTicks++;
          row.reachCauseTicks[cause]++;
          if (!openReach.has(p.gid)) openReach.set(p.gid, row.ticks);
          if (core) {
            row.coreBodyTicks++;
            row.coreCauseTicks[cause]++;
            if (!openCore.has(p.gid)) openCore.set(p.gid, row.ticks);
          } else close(openCore, p.gid, 'core');
          if (ball.z <= CONTROL_MAX_HEIGHT && p.kickCooldown > 0) {
            row.cooldownInvisibleBodyTicks++;
            if (!openCool.has(p.gid)) openCool.set(p.gid, row.ticks);
          } else close(openCool, p.gid, 'cool');
        } else {
          close(openReach, p.gid, 'reach');
          close(openCore, p.gid, 'core');
          close(openCool, p.gid, 'cool');
        }
      }
      if (inDeadBand) {
        row.deadBandBallTicks++;
        if (anyBodyInReach) row.deadBandBallTicksWithBody++;
      }
    } else {
      for (const gid of [...openReach.keys()]) close(openReach, gid, 'reach');
      for (const gid of [...openCore.keys()]) close(openCore, gid, 'core');
      for (const gid of [...openCool.keys()]) close(openCool, gid, 'cool');
    }
    prevLastTouchGid = lastTouchGid;
    prevOwnerGid = ownerGid;
  }
  for (const gid of [...openReach.keys()]) close(openReach, gid, 'reach');
  for (const gid of [...openCore.keys()]) close(openCore, gid, 'core');
  for (const gid of [...openCool.keys()]) close(openCool, gid, 'cool');

  const led = m.bkContactLedger;
  row.strikeClaimsCooldown = led.strikeClaimsCooldown;
  row.strikeClaimsStunned = led.strikeClaimsStunned;
  row.strikesApplied = led.strikesApplied;
  row.strikesAppliedCooldown = led.strikesAppliedCooldown;
  row.strikesAppliedStunned = led.strikesAppliedStunned;
  row.maxStrikeRelativeSpeed = led.maxStrikeRelativeSpeed;
  row.partitionGroundTicks = led.partitionGroundTicks;
  row.score = [m.score[0], m.score[1]];
  return row;
};

/* ========================================================================== */
/* §6 THE BATTERY                                                             */
/* ========================================================================== */
let walksBooked = 0;
const rows: Row[] = [];
banner(`BK-T1 receipts: mode=${MODE} N=${N} block=${BLOCK}`);
for (const seed of BATTERY_SEEDS) {
  for (const armed of [false, true]) {
    rows.push(walk(seed, armed));
    walksBooked++;
  }
  if (BATTERY_SEEDS.indexOf(seed) % 10 === 0) {
    banner(`  …battery seed ${seed} (${walksBooked} walks, ${((Date.now() - t0Wall) / 1000).toFixed(0)}s)`);
  }
}

const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const ratio = (a: number, b: number): number => (b === 0 ? 0 : a / b);
const round = (x: number, d: number): number => Number(x.toFixed(d));
const side = (armed: boolean): Row[] => rows.filter((r) => r.armed === armed);

const faceOf = (armed: boolean): Record<string, number> => {
  const rs = side(armed);
  const M = rs.length;
  const reach = sum(rs.map((r) => r.reachBodyTicks));
  const core = sum(rs.map((r) => r.coreBodyTicks));
  const causeReach = CAUSES.map((_, i) => sum(rs.map((r) => r.reachCauseTicks[i])));
  const causeCore = CAUSES.map((_, i) => sum(rs.map((r) => r.coreCauseTicks[i])));
  return {
    matches: M,
    reachCrossingBodyTicks: reach,
    reachCrossingBodyTicksPerMatch: round(ratio(reach, M), 4),
    reachCrossingEpisodesPerMatch: round(ratio(sum(rs.map((r) => r.reachEpisodes)), M), 4),
    visualThroughBodyTicks: core,
    visualThroughBodyTicksPerMatch: round(ratio(core, M), 4),
    visualThroughBodyEpisodesPerMatch: round(ratio(sum(rs.map((r) => r.coreEpisodes)), M), 4),
    cooldownInvisibleReachShare: round(ratio(causeReach[C.cooldownInvisible], reach), 6),
    cooldownInvisibleCoreShare: round(ratio(causeCore[C.cooldownInvisible], core), 6),
    cooldownInvisibleBodyTicksPerMatch:
      round(ratio(sum(rs.map((r) => r.cooldownInvisibleBodyTicks)), M), 4),
    cooldownInvisibleEpisodesPerMatch:
      round(ratio(sum(rs.map((r) => r.cooldownInvisibleEpisodes)), M), 4),
    stunnedReachShare: round(ratio(causeReach[C.stunned], reach), 6),
    deadBandCauseBodyTicksPerMatch: round(ratio(causeReach[C.deadBand], M), 4),
    deadBandBallTicksPerMatch: round(ratio(sum(rs.map((r) => r.deadBandBallTicks)), M), 4),
    deadBandTicksWithBodyInReachPerMatch:
      round(ratio(sum(rs.map((r) => r.deadBandBallTicksWithBody)), M), 4),
    strikesAppliedPerMatch: round(ratio(sum(rs.map((r) => r.strikesApplied)), M), 4),
    strikeClaimsPerMatch: round(
      ratio(sum(rs.map((r) => r.strikeClaimsCooldown + r.strikeClaimsStunned)), M), 4,
    ),
    strikesAppliedCooldownTotal: sum(rs.map((r) => r.strikesAppliedCooldown)),
    strikesAppliedStunnedTotal: sum(rs.map((r) => r.strikesAppliedStunned)),
    partitionGroundTicksPerMatch: round(ratio(sum(rs.map((r) => r.partitionGroundTicks)), M), 4),
    maxStrikeRelativeSpeed: round(Math.max(0, ...rs.map((r) => r.maxStrikeRelativeSpeed)), 6),
    strikesOutsidePlayingTotal: sum(rs.map((r) => r.strikesOutsidePlaying)),
    strikesFollowedByOwnershipTotal: sum(rs.map((r) => r.strikesFollowedByOwnership)),
  };
};
const causeTable = (armed: boolean): Array<Record<string, number | string>> => {
  const rs = side(armed);
  const reach = sum(rs.map((r) => r.reachBodyTicks));
  const core = sum(rs.map((r) => r.coreBodyTicks));
  return CAUSES.map((c, i) => ({
    cause: c,
    reachBodyTicks: sum(rs.map((r) => r.reachCauseTicks[i])),
    reachShare: round(ratio(sum(rs.map((r) => r.reachCauseTicks[i])), reach), 6),
    coreBodyTicks: sum(rs.map((r) => r.coreCauseTicks[i])),
    coreShare: round(ratio(sum(rs.map((r) => r.coreCauseTicks[i])), core), 6),
  }));
};

const shutFaces = faceOf(false);
const armedFaces = faceOf(true);

/* ========================================================================== */
/* §7 THE DOORS MATRIX — the composition proof                                */
/* ========================================================================== */
interface DoorCell {
  facing: boolean;
  contact: boolean;
  seed: number;
  built: boolean;
  refusalMatched: boolean;
  strikesApplied: number;
  partitionGroundTicks: number;
  strikesOutsidePlaying: number;
  ledgerAllZero: boolean;
}
const doorCells: DoorCell[] = [];
/** One walk per cell, with the lifecycle read (a strike must never resolve outside `playing`). */
const walkCell = (seed: number, facing: boolean, contact: boolean): DoorCell => {
  const m = buildMatch(seed, {
    ...(facing ? { bkFacingLaw: true } : {}),
    ...(contact ? { bkContactLaw: true } : {}),
  });
  let prev = 0;
  let outside = 0;
  while (!m.finished) {
    m.step(DT);
    const now = m.bkContactLedger.strikesApplied;
    if (now > prev) {
      if (m.phase !== 'playing') outside += now - prev;
      prev = now;
    }
  }
  const led = m.bkContactLedger;
  return {
    facing,
    contact,
    seed,
    built: true,
    refusalMatched: false,
    strikesApplied: led.strikesApplied,
    partitionGroundTicks: led.partitionGroundTicks,
    strikesOutsidePlaying: outside,
    ledgerAllZero: led.strikesApplied === 0 && led.strikeClaimsCooldown === 0
      && led.strikeClaimsStunned === 0 && led.partitionGroundTicks === 0,
  };
};
for (const seed of DOORS_SEEDS) {
  for (const facing of [false, true]) {
    for (const contact of [false, true]) {
      doorCells.push(walkCell(seed, facing, contact));
      walksBooked++;
    }
  }
}
/** ⭐ THE REFUSAL-ADJACENT CELLS §5's table implies (build-only; no walks, no seeds burned). */
const refusalCells: Array<Record<string, unknown>> = [];
for (const seed of DOORS_SEEDS) {
  // (i) contact ALONE with NO wind-up channel: legal — it extends nothing
  let builtAlone = false;
  try {
    const m = new Match({
      seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
      c7Windup: false, o1PassWindup: false, bkContactLaw: true,
    });
    builtAlone = m.bkContactLaw;
  } catch { builtAlone = false; }
  // (ii) contact + facing with NO wind-up channel: BK-T0's inert-law door still refuses
  let refused = false;
  let named = false;
  try {
    // eslint-disable-next-line no-new
    new Match({
      seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
      c7Windup: false, o1PassWindup: false, bkFacingLaw: true, bkContactLaw: true,
    });
  } catch (e) {
    refused = true;
    named = String((e as Error).message).includes('INERT WITHOUT A WIND-UP CHANNEL');
  }
  refusalCells.push({ seed, contactAloneBuilt: builtAlone, facingInertRefused: refused, refusalNamesTheLaw: named });
}

/* ========================================================================== */
/* §8 THE WORLD RECEIPT                                                       */
/* ========================================================================== */
const receipt = buildMatch(RECEIPT_SEED, {});
walksBooked += 1;
const worldReceipt = {
  seed: RECEIPT_SEED,
  a4Flags: a4MatchFlags(8) as unknown as Record<string, unknown>,
  l3DoseFileBytesSha256: L3_BYTES_SHA,
  pcDoseFileBytesSha256: PC_BYTES_SHA,
  l3DoseCells: L3_DOSE.length,
  pcDoseRows: PC_DOSE.length,
  bkContactLawOnReceipt: receipt.bkContactLaw,
  bkFacingLawOnReceipt: receipt.bkFacingLaw,
};

/* ========================================================================== */
/* §9 THE GATES                                                               */
/* ========================================================================== */
const gitOut = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'GIT-FAILED'; }
};
const srcDiff = gitOut('git diff --stat HEAD -- src');
const srcStatus = gitOut('git status --porcelain -- src');

const gates: Record<string, boolean> = {
  gWorld: worldReceipt.bkContactLawOnReceipt === false && worldReceipt.bkFacingLawOnReceipt === false
    && L3_DOSE.length > 0 && PC_DOSE.length > 0,
  gDormant: side(false).every((r) => r.strikesApplied === 0 && r.strikeClaimsCooldown === 0
    && r.strikeClaimsStunned === 0 && r.partitionGroundTicks === 0),
  gSeamFires: (armedFaces.strikesAppliedPerMatch as number) > 0,
  gCooldownShareFalls:
    (armedFaces.cooldownInvisibleReachShare as number) < (shutFaces.cooldownInvisibleReachShare as number),
  gCoreCooldownFalls:
    (armedFaces.cooldownInvisibleCoreShare as number) < (shutFaces.cooldownInvisibleCoreShare as number),
  gDeadBandFalls:
    (armedFaces.deadBandCauseBodyTicksPerMatch as number) < (shutFaces.deadBandCauseBodyTicksPerMatch as number),
  gPartitionLive: (armedFaces.partitionGroundTicksPerMatch as number) > 0,
  gNoSuperpower: (armedFaces.strikesFollowedByOwnershipTotal as number) === 0,
  gLifecycle: (armedFaces.strikesOutsidePlayingTotal as number) === 0
    && doorCells.every((c) => c.strikesOutsidePlaying === 0),
  gDoors: doorCells.every((c) => c.built)
    && doorCells.filter((c) => !c.contact).every((c) => c.ledgerAllZero)
    && doorCells.filter((c) => c.contact).every((c) => c.strikesApplied > 0),
  gDoorInertness: doorCells.filter((c) => !c.contact).every((c) => c.ledgerAllZero),
  gRefusalSemantics: refusalCells.every((c) => c.contactAloneBuilt === true
    && c.facingInertRefused === true && c.refusalNamesTheLaw === true),
  gSrcUntouched: srcDiff === '' && srcStatus === '',
  gSeedsBookedEqualWalked: walksBooked === BATTERY_SEEDS.length * 2 + DOORS_SEEDS.length * 4 + 1,
};

/* ========================================================================== */
/* §10 THE ARTIFACT                                                           */
/* ========================================================================== */
const instrumentHash = sha(readFileSync(new URL(import.meta.url).pathname, 'utf8'));
const artifact = {
  stage: 'BK-T1',
  what: 'THE CONTACT LAW — arming receipts for a dormant src seam. RECEIPTS, NOT EFFECT SIZES.',
  doc: 'docs/world-model/BK-T1-CONTACT-LAW.md',
  contract: 'BK-BODYBALL-CONTRACT.md §2 M-BK.2 + H-BK.2',
  ruling: '#307 item 4',
  mode: MODE,
  instrumentSha256: instrumentHash,
  headCommit: gitOut('git rev-parse HEAD'),
  definitions: {
    strikeShell: 'p.coreRadius + ball.radius — physical.ts accessLineGeometry\'s own `clearance`',
    strikeShellMetres: PLAYER_CORE_RADIUS + 0.11,
    closingCondition: '(ball.vel - p.vel) · n < 0, n = body→ball (the M1 resolveOverlaps rule)',
    outcome: 'rotate(normal, rng.range(-1.2, 1.2)) × min(incoming, rng.range(4, 8)) — the DEFLECT family',
    censusGateText: GATE_TEXT,
    censusGateLineAtFreezeHead: GATE_LINE,
    censusGateLineAtCensusCommit: 4562,
    censusCommit: 'e310401',
    zBandsShipped: [CONTROL_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    zPartitionArmedEdge: HEADER_MIN_HEIGHT,
    visualThroughBodyRadiusMetres: PLAYER_CORE_RADIUS,
    reachCrossingRadiusMetres: CONTROL_RADIUS,
    trivialTrapSpeed: TRIVIAL_TRAP_SPEED,
    causeLadder: CAUSES,
    causeLadderRule: 'BK-C0 §3(b)\'s own order; one cell per body-tick; the residual is rollOrClaimOrder',
    exclusions: 'free ball, phase playing, not sentOff, not lastTouch, not this tick\'s contact',
  },
  world: worldReceipt,
  seeds: {
    block: BLOCK,
    batterySeeds: [BATTERY_SEEDS[0], BATTERY_SEEDS[BATTERY_SEEDS.length - 1]],
    batteryWalks: BATTERY_SEEDS.length * 2,
    doorsSeeds: DOORS_SEEDS,
    doorsWalks: DOORS_SEEDS.length * 4,
    receiptSeed: RECEIPT_SEED,
    walksBooked,
    pinSuiteSeeds: [12_503_800, 12_503_811],
  },
  shutFaces,
  armedFaces,
  causeTableShut: causeTable(false),
  causeTableArmed: causeTable(true),
  doorCells,
  refusalCells,
  perSeedRows: rows,
  gates,
  wallSeconds: round((Date.now() - t0Wall) / 1000, 1),
};

writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);
banner(`artifact → ${OUT_PATH}`);

/* ---- gFaces: re-derive every published face by RE-PARSING the artifact off disk ---- */
const onDisk = JSON.parse(readFileSync(OUT_PATH, 'utf8')) as typeof artifact;
const rederive = (armed: boolean): boolean => {
  const rs = onDisk.perSeedRows.filter((r) => r.armed === armed);
  const M = rs.length;
  const reach = sum(rs.map((r) => r.reachBodyTicks));
  const core = sum(rs.map((r) => r.coreBodyTicks));
  const f = armed ? onDisk.armedFaces : onDisk.shutFaces;
  const eq = (a: number, b: number): boolean => Math.abs(a - b) < 1e-9;
  return eq(f.matches as number, M)
    && eq(f.reachCrossingBodyTicksPerMatch as number, round(ratio(reach, M), 4))
    && eq(f.visualThroughBodyTicksPerMatch as number, round(ratio(core, M), 4))
    && eq(f.cooldownInvisibleReachShare as number,
      round(ratio(sum(rs.map((r) => r.reachCauseTicks[C.cooldownInvisible])), reach), 6))
    && eq(f.cooldownInvisibleCoreShare as number,
      round(ratio(sum(rs.map((r) => r.coreCauseTicks[C.cooldownInvisible])), core), 6))
    && eq(f.deadBandCauseBodyTicksPerMatch as number,
      round(ratio(sum(rs.map((r) => r.reachCauseTicks[C.deadBand])), M), 4))
    && eq(f.deadBandBallTicksPerMatch as number,
      round(ratio(sum(rs.map((r) => r.deadBandBallTicks)), M), 4))
    && eq(f.strikesAppliedPerMatch as number,
      round(ratio(sum(rs.map((r) => r.strikesApplied)), M), 4))
    && eq(f.partitionGroundTicksPerMatch as number,
      round(ratio(sum(rs.map((r) => r.partitionGroundTicks)), M), 4));
};
gates.gFaces = rederive(false) && rederive(true);
artifact.gates = gates;
writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);

/* ========================================================================== */
banner('');
banner('=== BK-T1 RECEIPTS ===');
banner(`gate site: ${GATE_TEXT}  @ Match.ts:${GATE_LINE}  (census cited 4562 at e310401)`);
for (const [k, v] of Object.entries(gates)) banner(`  ${v ? 'GREEN' : '**RED**'}  ${k}`);
banner('');
for (const k of Object.keys(armedFaces)) {
  banner(`  ${k}: shut=${shutFaces[k]}  armed=${armedFaces[k]}`);
}
banner(`walks booked = walked: ${walksBooked}`);
const red = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
if (red.length > 0) {
  banner(`RED GATES: ${red.join(', ')} — REPORTED, NOT PATCHED`);
  process.exit(1);
}
process.exit(0);
