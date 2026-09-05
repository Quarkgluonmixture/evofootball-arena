import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import type { Player } from '../src/sim/Player';
import { runHeadless } from '../src/sim/simRunner';
import {
  BALL_FRICTION_K, CONTACT_CONTROL_DELAY_TICKS, CONTACT_CONTROL_RETENTION_MARGIN,
  CONTACT_RELEASE_INCOMING_SHARE, CONTACT_RELEASE_MAX_SPEED, CONTACT_RELEASE_MIN_SPEED,
  CONTACT_TANGENTIAL_RETENTION, CONTROL_RADIUS, DT, PLAYER_CORE_RADIUS,
  PLAYER_MIN_DIST,
} from '../src/sim/constants';
import { directBallAccess } from '../src/sim/physical';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../src/sim/types';
import { a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells } from '../src/game/a4World';
import { Rng } from '../src/utils/rng';

/**
 * ⭐⭐ BQ T0 — THE DORMANT CUSHION LAW (docs/world-model/BQ-T0-CUSHION-LAW.md; COMMANDER
 * RULING #384 items 5–6; contract BK-BODYBALL-CONTRACT.md §2-AMENDMENT M-BK.5) — THE SEAM'S
 * PERMANENT PIN SUITE, in the house form (`bfFacingCost.test.ts` / `rcReady.test.ts`).
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * 「缓冲留球：脚碰到球，球跟着人走，三拍之后还在脚边；球能不能拿住由停球那一掷决定，对手能不能
 * 戳走由对抗决定」 — armed, `applyControlContact` gives the ball the BODY's velocity and nothing
 * else: the outward release along the body→ball normal and the tangential retention are RETIRED
 * on the armed path, and the relative velocity after a cushioning touch is EXACTLY ZERO. The
 * window, the retention margin, the first-touch roll, the contest inside the window, the
 * body-strike and deflection channels are untouched.
 *
 * The pins:
 *   • ⭐⭐ THE PROHIBITION SET — no world, no preset, no env, no bundle names the flag;
 *     `a4World.ts` contains the string nowhere; every version 1–12 carries no flag; a bare
 *     Match, a world-12 Match and a League match all read `false`.
 *   • ⭐ NO SERIALIZATION — `League.toJSON` omits the flag.
 *   • ⭐⭐ G-OFF — flag ABSENT ≡ flag EXPLICITLY FALSE, byte for byte, on the BARE world AND
 *     on WORLD 12's composition × 2 scratch seeds each, pooled digest, four distinct cells.
 *   • ⭐⭐ G-KEEP — BQ-C1's own mechanism on a fixture: a body running ACROSS the ball's line at
 *     the census's mean 3.405157 m/s meets it at 8 m/s relative, at a centre distance DERIVED
 *     from the resolver's own two constants. SHUT the ball drifts out of
 *     `sectorCenterReach + CONTACT_CONTROL_RETENTION_MARGIN` before the third tick and the
 *     resolver returns false with no roll; ARMED it is still inside and the roll RUNS. The
 *     shut drift is compared against the law's own arithmetic integrated OUTSIDE the engine.
 *   • ⭐⭐ G-CONTEST — an opponent inside `CONTROL_RADIUS` of the resting ball at contact + 1
 *     REPLACES the attempt, armed exactly as shut; with him removed the armed attempt resolves.
 *   • ⭐⭐ G-ROLL — the roll still runs at `readyTick` on an armed world-12 walk, a forced
 *     failure still knocks the ball inside [3.5, 6.5] m/s, and `attemptFirstTouch` /
 *     `touchFailChance` are byte-identical to the dispatch HEAD.
 *   • ⭐⭐ G-STRIKE — `bkApplyBodyStrike` and the applied-deflection branch byte-identical.
 *   • ⭐⭐ G-SOLVER — `resolveOverlaps` byte-identical, `contactSolver.test.ts`'s own invariant
 *     re-run with the door ARMED, and the armed law's own anti-penetration property proved on
 *     a live walk (every cushion leaves the ball at EXACTLY the body's velocity).
 *   • ⭐⭐ G-WINDOW — `CONTACT_CONTROL_DELAY_TICKS`, the margin line and the whole resolver
 *     byte-identical to the dispatch HEAD.
 *   • ⭐⭐ THE SEAM MAP — occurrence COUNTS per needle, EVERY site enumerated; and the FOUR
 *     RETIRED CONSTANTS' occurrence counts UNCHANGED (they still live in the shipped path).
 *   • ⭐ G-RNG — an armed contact consumes exactly the rng a shut one does (zero draws added).
 *   • ⭐ THE FINGERPRINT OF RECORD — a literal in this suite, and the suite RUNS it.
 *
 * ⚠ Every walk in this file lives in the OUT-OF-BAND SCRATCH CLASS 900,003,100–199 (canon,
 * VERBATIM: "verifier scratch walks use the stage's own consumed band or the out-of-band
 * scratch range (≥ 900,000,000) — never the next virgin block"; home:
 * PW-T0C-OBJECTIVE-FIDELITY.md §COMMANDER CORRECTIONS item 6). ZERO frontier consumption.
 *
 * ⭐ Receipts are receipts (home: ruling #289 item 1 + BU-T1-MT-COMPOSITION.md §COMMANDER
 * CORRECTIONS item 5): the fixture metres and the walk counts below are ARMING PLUMBING and
 * are never quoted as football effect sizes. What the law BUYS is BQ-T1's question.
 */

/** The production fingerprint of record (#305 item 1) — this seam may not move it. */
const FINGERPRINT_OF_RECORD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⚠ OUT-OF-BAND SCRATCH SEEDS — BQ-T0's own band, 900,003,100–199. */
const SEED_A = 900_003_100;
const SEED_B = 900_003_101;
const SEED_WALK = 900_003_120;
/** ⭐ G-ROLL's forced failure: the ONE (seed, gid) the search below re-finds every run. */
const SEED_ROLL_FAIL = 900_003_129;
const GID_ROLL_FAIL = 1;

const W12 = 12 as const;
const L3_DOSE = poolT1DoseCells(JSON.parse(
  readFileSync('docs/world-model/data/l3-t1-convergence-exam.json', 'utf8'),
) as Record<string, unknown>);
const PC_DOSE = poolPcDoseTable(JSON.parse(
  readFileSync('docs/world-model/data/pc-t1-learning-exam.json', 'utf8'),
) as Record<string, unknown>);

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
  /** arm THIS slice's door */
  bq?: boolean;
  /** pass the door EXPLICITLY as false rather than omitting it (dormancy's other half) */
  bqExplicitFalse?: boolean;
  /** world 12's composition — the form the user plays */
  world?: 12;
  duration?: number;
  trace?: boolean;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const base = a.world === undefined ? {} : a4MatchFlags(a.world);
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    duration: a.duration ?? 240,
    ...base,
    ...(a.trace === true ? { traceFirstTouch: true, traceContests: true } : {}),
    ...(a.bq === true ? { bqCushion: true } : {}),
    ...(a.bqExplicitFalse === true ? { bqCushion: false } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (a.world !== undefined) armA4World(m, null, a.world, L3_DOSE, PC_DOSE);
  return m;
};

/** The house world-identity signature (PW-T0b's, verbatim via GC-T0 / RA-T0 / RC-T0 / BF-T0). */
const signatureOf = (m: Match): string => {
  const trace: number[] = [];
  let ticks = 0;
  while (!m.finished && ticks < 60_000) {
    m.step(DT);
    ticks++;
    if (ticks % 37 === 0) {
      trace.push(m.ball.pos.x, m.ball.pos.y, m.ball.vel.x, m.ball.vel.y, m.score[0], m.score[1]);
      for (const t of m.teams) for (const p of t.players) trace.push(p.pos.x, p.pos.y, p.heading.x);
    }
  }
  const r = m.getResult();
  return createHash('sha256').update(JSON.stringify({
    trace: trace.map((v) => Math.round(v * 1e9)),
    score: r.score, stats: r.stats, events: r.events.length, ticks,
  })).digest('hex');
};
const digest = (xs: string[]): string =>
  createHash('sha256').update(xs.join('|')).digest('hex');

const src = (rel: string): string =>
  readFileSync(new URL(`../src/${rel}`, import.meta.url), 'utf8');
const matchSource = src('sim/Match.ts');
const leagueSource = src('sim/League.ts');
const mechSource = src('sim/mechanics.ts');
const constantsSource = src('sim/constants.ts');
const a4Source = src('game/a4World.ts');
const contactSolverSuite = readFileSync(
  new URL('./contactSolver.test.ts', import.meta.url), 'utf8',
);
const count = (hay: string, needle: RegExp): number => (hay.match(needle) ?? []).length;
const linesOf = (hay: string, line: string): number =>
  hay.split('\n').filter((l) => l === line).length;
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = join(dir, e);
  return statSync(full).isDirectory() ? srcFiles(full) : full.endsWith('.ts') ? [full] : [];
});
/** Anchored slice: from a NAMED opening line to a NAMED closing marker (never first-occurrence). */
const between = (hay: string, from: string, to: string): string => {
  const a = hay.indexOf(from);
  const b = hay.indexOf(to, a + from.length);
  if (a < 0 || b < 0) return `MISSING(${from})`;
  return hay.slice(a, b);
};
/** G-STRIKE anchor: `bkApplyBodyStrike` VERBATIM at the dispatch HEAD (83e8a95). */
const BODY_STRIKE_BLOCK = [
  "  private bkApplyBodyStrike(",
  "    claim: GroundContactClaim,",
  "    allClaims: readonly GroundContactClaim[],",
  "  ): void {",
  "    const ball = this.ball;",
  "    const p = claim.player;",
  "    const n = claim.access.geometry.direction;",
  "    const incoming = Math.sqrt(ball.vel.x * ball.vel.x + ball.vel.y * ball.vel.y);",
  "    // the DEFLECT family's own two draws, in its own order",
  "    const spread = this.rng.range(-1.2, 1.2);",
  "    const pace = Math.min(incoming, this.rng.range(4, 8));",
  "    const cos = Math.cos(spread);",
  "    const sin = Math.sin(spread);",
  "    ball.vel.x = (n.x * cos - n.y * sin) * pace;",
  "    ball.vel.y = (n.x * sin + n.y * cos) * pace;",
  "    ball.lastTouch = p;",
  "    this.pendingControl = null; // the deflection precedent: that attempt's ball is gone",
  "    const led = this.bkContactLedger;",
  "    led.strikesApplied += 1;",
  "    if (p.kickCooldown > 0) led.strikesAppliedCooldown += 1; else led.strikesAppliedStunned += 1;",
  "    if (claim.relativeSpeed > led.maxStrikeRelativeSpeed) {",
  "      led.maxStrikeRelativeSpeed = claim.relativeSpeed;",
  "    }",
  "    this.traceContact(allClaims, p, 'body');",
  "  }",
].join('\n');

/** G-STRIKE anchor: `tryCapture`'s APPLIED-DEFLECTION branch VERBATIM at the dispatch HEAD (83e8a95). */
const APPLIED_DEFLECTION_BLOCK = [
  "      if (claim.kind === 'deflection') {",
  "        if (mech.tryDeflection(this, p)) {",
  "          this.pendingControl = null;",
  "          this.traceContact(claims, p, 'deflection');",
  "          return;",
  "        }",
  "        continue; // a whiff is not contact; the next snapshot claim may meet it",
  "      }",
].join('\n');

/** G-WINDOW anchor: `resolvePendingControlAttempt` VERBATIM at the dispatch HEAD (83e8a95). */
const RESOLVER_BLOCK = [
  "  private resolvePendingControlAttempt(): boolean {",
  "    const attempt = this.pendingControl;",
  "    if (attempt === null || this.stepCount < attempt.readyTick) return false;",
  "    this.pendingControl = null;",
  "    const p = this.allPlayers[attempt.gid];",
  "    if (!p || p.sentOff || p.stunTimer > 0) return false;",
  "    const access = directBallAccess(p, this.ball, this.allPlayers, CONTROL_RADIUS);",
  "    // Screening gates the EARLIER contact claim. Once this body has actually",
  "    // touched the ball, re-applying the blocker test makes two nearby cores",
  "    // mutually veto control forever. A rival must submit a real new contact",
  "    // during the window; mere presence does not cancel an established touch.",
  "    if (access.geometry.centerDistance > access.sectorCenterReach + CONTACT_CONTROL_RETENTION_MARGIN) return false;",
  "    p.kickCooldown = 0; // this player's contact commitment has completed",
  "    const clean = mech.attemptFirstTouch(this, p, {",
  "      relativeSpeed: attempt.relativeSpeed,",
  "      incomingDir: attempt.incomingDir,",
  "    });",
  "    if (clean) this.giveBall(p);",
  "    return true; // clean or spilled: this control attempt consumed the tick",
  "  }",
].join('\n');

/** G-SOLVER anchor: `resolveOverlaps` VERBATIM at the dispatch HEAD (83e8a95). */
const OVERLAPS_BLOCK = [
  "  private resolveOverlaps(): void {",
  "    const ps = this.allPlayers;",
  "    for (let i = 0; i < ps.length; i++) {",
  "      const a = ps[i];",
  "      if (a.sentOff) continue;",
  "      for (let j = i + 1; j < ps.length; j++) {",
  "        const b = ps[j];",
  "        if (b.sentOff) continue;",
  "        // Cheap reject before the sqrt: \u221a(x\u00b2+y\u00b2) \u2265 |x| holds bitwise in IEEE",
  "        // round-to-nearest, so |dx| or |dy| \u2265 PLAYER_MIN_DIST guarantees the",
  "        // d-check below would continue anyway. Most of the 45 pairs exit here.",
  "        const dx = a.pos.x - b.pos.x;",
  "        if (dx >= PLAYER_MIN_DIST || dx <= -PLAYER_MIN_DIST) continue;",
  "        const dy = a.pos.y - b.pos.y;",
  "        if (dy >= PLAYER_MIN_DIST || dy <= -PLAYER_MIN_DIST) continue;",
  "        const d = Math.sqrt(dx * dx + dy * dy);",
  "        if (d >= PLAYER_MIN_DIST) continue;",
  "        if (d < 1e-6) {",
  "          a.pos.x += 0.02 * (i + 1);",
  "          a.pos.y += 0.01;",
  "          continue;",
  "        }",
  "        // Flat form of the old norm/scale/add push \u2014 same op order, in place.",
  "        const k = (PLAYER_MIN_DIST - d) / 2;",
  "        const nx = dx / d;",
  "        const ny = dy / d;",
  "        const px = nx * k;",
  "        const py = ny * k;",
  "        // A keeper stands their ground in their own box against opponents",
  "        // (Phase 28): the carrier bounces off \u2014 nobody bulldozes the keeper",
  "        // back into the net a half-push at a time.",
  "        const gkA = a.role === 'GK' && b.side !== a.side && this.inPenaltyBox(a.pos, a.side);",
  "        const gkB = b.role === 'GK' && a.side !== b.side && this.inPenaltyBox(b.pos, b.side);",
  "        if (gkA && !gkB) {",
  "          b.pos.x -= px * 2;",
  "          b.pos.y -= py * 2;",
  "        } else if (gkB && !gkA) {",
  "          a.pos.x += px * 2;",
  "          a.pos.y += py * 2;",
  "        } else {",
  "          a.pos.x += px;",
  "          a.pos.y += py;",
  "          b.pos.x -= px;",
  "          b.pos.y -= py;",
  "        }",
  "",
  "        // M1 (World-Model Foundation): position-only separation left the",
  "        // pair's velocity driving straight back into penetration next frame.",
  "        // Remove ONLY closing relative velocity along the contact normal:",
  "        // tangential motion and already-separating pairs stay untouched. Equal",
  "        // bodies share the correction (mean normal velocity is conserved); an",
  "        // anchored in-box keeper gives the whole correction to the opponent.",
  "        // Pair order + one fixed pass remain the determinism contract \u2014 no",
  "        // convergence tolerance or early-stop loop.",
  "        const relativeNormal = (a.vel.x - b.vel.x) * nx + (a.vel.y - b.vel.y) * ny;",
  "        if (relativeNormal < 0) {",
  "          const remove = -relativeNormal;",
  "          if (gkA && !gkB) {",
  "            b.vel.x -= nx * remove;",
  "            b.vel.y -= ny * remove;",
  "          } else if (gkB && !gkA) {",
  "            a.vel.x += nx * remove;",
  "            a.vel.y += ny * remove;",
  "          } else {",
  "            const half = remove / 2;",
  "            a.vel.x += nx * half;",
  "            a.vel.y += ny * half;",
  "            b.vel.x -= nx * half;",
  "            b.vel.y -= ny * half;",
  "          }",
  "        }",
  "      }",
  "    }",
  "  }",
].join('\n');

/** G-ROLL anchor: `touchFailChance` VERBATIM at the dispatch HEAD (83e8a95). */
const TOUCH_FAIL_CHANCE_BLOCK = [
  "export function touchFailChance(",
  "  speed: number, pressure: number, misalign: number, technique: number, positioning = 0.5,",
  "  heavyTouchCost = false,",
  "): number {",
  "  // POSITIONING (Phase 119j) reads the ball and shapes the body EARLY, so it",
  "  // tames the PRESSURE and BLIND-SIDE penalties (the awareness half of a first",
  "  // touch); technique still tames the whole thing (the clean contact). Neutral",
  "  // at 0.5 \u2014 `aware` = 1.0 there, so the pre-119j curve is bit-for-bit intact",
  "  // and backfilled 0.5 saves play unchanged; a reader (1.0) cuts the",
  "  // pressure/blind penalty ~30%, a spatially-blind player (0) pays ~30% more.",
  "  const aware = 1 - (positioning - 0.5) * 0.6; // 0.7 .. 1.3",
  "  const cost = heavyTouchCost ? TOUCH_SPEED_COST.heavy : TOUCH_SPEED_COST.base;",
  "  const raw = 0.01 + clamp01((speed - 6) / cost.span) * cost.weight",
  "    + (pressure * 0.1 + misalign * 0.05) * aware;",
  "  return clamp(raw * (1.3 - technique * 0.85), 0, 0.4);",
  "}",
].join('\n');

/** G-ROLL anchor: `attemptFirstTouch` VERBATIM at the dispatch HEAD (83e8a95). */
const ATTEMPT_FIRST_TOUCH_BLOCK = [
  "export function attemptFirstTouch(",
  "  match: Match,",
  "  p: Player,",
  "  contact?: FirstTouchContactContext,",
  "): boolean {",
  "  const ball = match.ball;",
  "  // A dropping ball is harder to kill than a rolled one (Phase 28): the",
  "  // vertical speed counts toward touch difficulty. Ground balls: vz = 0.",
  "  const speed = contact?.relativeSpeed ?? (len(ball.vel) + Math.abs(ball.vz) * 0.6);",
  "  if (p.role === 'GK' || speed <= 6) return true;",
  "  const hSpeed = Math.max(len(ball.vel), 1e-6);",
  "  const inx = contact?.incomingDir.x ?? ball.vel.x / hSpeed;",
  "  const iny = contact?.incomingDir.y ?? ball.vel.y / hSpeed;",
  "  // Ball arriving at the face = 0, arriving from behind the body = 1.",
  "  const misalign = (1 + (inx * p.heading.x + iny * p.heading.y)) / 2;",
  "  const pressure = pressureAt(p.pos, match.teams[1 - p.side].players);",
  "  let pFail = touchFailChance(",
  "    speed, pressure, misalign, p.attrs.dribbling, p.attrs.positioning, match.edsTouchCost,",
  "  );",
  "  // Re-collecting your OWN pushed touch (Phase 36): the ball rolls away",
  "  // from the body, which reads as a blind-side reception to the misalign",
  "  // term \u2014 but he watched it leave his own boot. Priced well down, not",
  "  // free: overhit knock-and-runs still get away.",
  "  if (match.dribbleTouch !== null && match.dribbleTouch.gid === p.gid) pFail *= 0.45;",
  "  const clean = !match.rng.chance(pFail);",
  "  // EDS E1a instrument: log the adjudication with the exact terms the roll used.",
  "  // The roll has already happened; this branch cannot influence it, and it is",
  "  // inert unless the trace flag was explicitly enabled.",
  "  if (match.traceFirstTouch) {",
  "    match.firstTouchTrace.push({",
  "      tick: match.simTick,",
  "      gid: p.gid,",
  "      intendedTarget: match.pendingPass !== null",
  "        && match.pendingPass.targetGid === p.gid",
  "        && match.pendingPass.side === p.side,",
  "      relativeSpeed: speed,",
  "      pressure,",
  "      misalign,",
  "      technique: p.attrs.dribbling,",
  "      positioning: p.attrs.positioning,",
  "      pFail,",
  "      clean,",
  "    });",
  "  }",
  "  if (clean) return true;",
  "",
  "  match.teams[p.side].stats.miscontrols++;",
  "  match.stat(p.gid).miscontrols++;",
  "  ball.lastTouch = p; // a heavy touch out of play concedes the restart",
  "  ball.vel = scale(rotate(v2(inx, iny), match.rng.range(-0.8, 0.8)), match.rng.range(3.5, 6.5));",
  "  ball.vz = 0; // the touch kills any remaining flight \u2014 the ball drops",
  "  p.kickCooldown = 0.5; // off balance \u2014 can't instantly regather",
  "  return false;",
  "}",
].join('\n');

/* ========================================================================== */
/* THE CUSHION FIXTURE — BQ-C1's own mechanism, on two bodies                  */
/* ========================================================================== */

/** BQ-C1 §R5 `physics.meanBodySpeedAtContact`, arm E (m/s) — the census's own stored face. */
const CENSUS_BODY_SPEED = 3.405157;
/**
 * The relative speed at contact. Chosen ABOVE `attemptFirstTouch`'s own no-roll gate
 * (`speed <= 6` returns clean without a roll), so the fixture reaches the roll — BQ-C1 §R5's
 * `relativeSpeed` bins straddle it.
 */
const FIXTURE_RELATIVE_SPEED = 8;
/**
 * ⭐⭐ THE CONTACT DISTANCE IS DERIVED, NEVER TYPED. `directBallAccess`'s front/side envelope
 * is `CONTROL_RADIUS` itself (`BALL_ACCESS_SIDE_EXTENSION_FACTOR` = 1), and the resolver asks
 * three ticks later for `centerDistance <= sectorCenterReach + CONTACT_CONTROL_RETENTION_MARGIN`.
 * A touch made ONE MARGIN inside the envelope is "at the edge of reach"; both constants are
 * IMPORTED, and the fixture asserts the reach it actually got from `directBallAccess` CALLED.
 */
const FIXTURE_D = CONTROL_RADIUS - CONTACT_CONTROL_RETENTION_MARGIN;
/** ⚠ The dispatch's illustrative 1.20 m, kept as the honest counter-receipt (see G-KEEP). */
const DISPATCH_D = 1.2;

type ContactAccess = {
  stepCount: number;
  tryCapture(): void;
  stepBall(dt: number): void;
  resolveOverlaps(): void;
  pendingControl: { gid: number; readyTick: number; relativeSpeed: number } | null;
};
const access = (m: Match): ContactAccess => m as unknown as ContactAccess;

interface CushionOpts {
  armed: boolean;
  d?: number;
  seed?: number;
  gid?: number;
  /** place a free opponent this far along +x from the ball at tick contact + 1 */
  opponentOffset?: number;
}
interface CushionRun {
  m: Match;
  p: Player;
  opponent: Player | null;
  /** `directBallAccess` CALLED at the contact tick, with the resolver's own arguments */
  reachAtContact: number;
  sectorAtContact: string;
  dAtContact: number;
  /** the ball's velocity at the END of the contact tick, and it MINUS the body's */
  ballVelAfterContact: { x: number; y: number };
  relativeVelAfterContact: { x: number; y: number };
  pendingAtContact: { gid: number; readyTick: number; relativeSpeed: number } | null;
  pendingAtEnd: { gid: number; readyTick: number; relativeSpeed: number } | null;
  /** `directBallAccess` CALLED again at `readyTick`, after the window */
  dAtReady: number;
  barAtReady: number;
  owner: Player | null;
  traceEntries: readonly { gid: number; clean: boolean }[];
  ballSpeedAtReady: number;
  rngMoved: boolean;
}

/**
 * ⭐⭐ THE FIXTURE. A receiver runs ACROSS the ball's line at the census's mean body speed; the
 * ball arrives at him so that the RELATIVE speed is exactly `FIXTURE_RELATIVE_SPEED`; the touch
 * is made at centre distance `d`. The contact and the whole window are driven through the
 * ENGINE's own `tryCapture` / `stepBall` (the `contactControl.test.ts` type-view idiom), so the
 * ball is moved by the shipped ball physics and the resolver is the shipped resolver. ⚠ ONLY the
 * BODY is held on a straight line at constant velocity — a DECLARED fixture control, so the
 * outside-the-engine prediction can be exact.
 */
const cushion = (opts: CushionOpts): CushionRun => {
  const d = opts.d ?? FIXTURE_D;
  const seed = opts.seed ?? SEED_A;
  const gid = opts.gid ?? 3;
  const m = matchOf(seed, { bq: opts.armed || undefined, duration: 1, trace: true });
  const a = access(m);
  while (m.phase !== 'playing') m.step(DT);
  for (const q of m.allPlayers) {
    q.pos = { x: 60 + q.gid * 2, y: 30 };
    q.vel = { x: 0, y: 0 };
    q.kickCooldown = 0;
    q.stunTimer = 0;
  }
  const p = m.teams[0].players[gid];
  // the ball's own approach speed, so that |ball.vel − p.vel| is exactly the fixture's
  const approach = Math.sqrt(
    FIXTURE_RELATIVE_SPEED * FIXTURE_RELATIVE_SPEED - CENSUS_BODY_SPEED * CENSUS_BODY_SPEED,
  );
  const pos0 = { x: -d, y: 0 };
  p.pos = { ...pos0 };
  p.vel = { x: 0, y: CENSUS_BODY_SPEED }; // ACROSS the ball's line
  p.heading = { x: 0, y: 1 };             // a running body faces where it runs
  m.ball.owner = null;
  m.ball.lastTouch = null;
  m.ball.pos = { x: 0, y: 0 };
  m.ball.vel = { x: -approach, y: 0 };    // arriving AT him along the body→ball normal
  m.ball.z = 0;
  m.ball.vz = 0;
  m.ball.spin = 0;
  m.pendingPass = null;
  m.dribbleTouch = null;
  const accessAtContact = directBallAccess(p, m.ball, m.allPlayers, CONTROL_RADIUS);
  const rngBefore = (m.rng as unknown as { s: number }).s;
  a.tryCapture();
  const rngAfter = (m.rng as unknown as { s: number }).s;
  const ballVelAfterContact = { x: m.ball.vel.x, y: m.ball.vel.y };
  const relativeVelAfterContact = {
    x: m.ball.vel.x - p.vel.x,
    y: m.ball.vel.y - p.vel.y,
  };
  const pendingAtContact = a.pendingControl === null ? null : { ...a.pendingControl };
  let opponent: Player | null = null;
  for (let k = 1; k <= CONTACT_CONTROL_DELAY_TICKS; k++) {
    a.stepCount += 1;
    p.pos = { x: pos0.x, y: pos0.y + CENSUS_BODY_SPEED * DT * k };
    p.vel = { x: 0, y: CENSUS_BODY_SPEED };
    if (k === 1 && opts.opponentOffset !== undefined) {
      opponent = m.teams[1].players[5];
      opponent.pos = { x: m.ball.pos.x + opts.opponentOffset, y: m.ball.pos.y };
      opponent.vel = { x: 0, y: 0 };
      opponent.heading = { x: -1, y: 0 };
      opponent.kickCooldown = 0;
      opponent.stunTimer = 0;
    }
    a.stepBall(DT);
  }
  const accessAtReady = directBallAccess(p, m.ball, m.allPlayers, CONTROL_RADIUS);
  return {
    m,
    p,
    opponent,
    reachAtContact: accessAtContact.sectorCenterReach,
    sectorAtContact: accessAtContact.geometry.sector,
    dAtContact: accessAtContact.geometry.centerDistance,
    ballVelAfterContact,
    relativeVelAfterContact,
    pendingAtContact,
    pendingAtEnd: a.pendingControl === null ? null : { ...a.pendingControl },
    dAtReady: accessAtReady.geometry.centerDistance,
    barAtReady: accessAtReady.sectorCenterReach + CONTACT_CONTROL_RETENTION_MARGIN,
    owner: m.ball.owner,
    traceEntries: m.firstTouchTrace,
    ballSpeedAtReady: Math.hypot(m.ball.vel.x, m.ball.vel.y),
    rngMoved: rngBefore !== rngAfter,
  };
};

/**
 * ⭐⭐ THE SHUT LAW'S OWN ARITHMETIC, INTEGRATED OUTSIDE THE ENGINE — the release and the
 * retention are IMPORTED constants, never re-typed, and the ball's three ticks of travel use the
 * shipped ground-friction form (`Math.exp(-BALL_FRICTION_K * dt)`, applied AFTER the advance,
 * `stepBall`'s own order). This is what G-KEEP compares the engine's shut drift against.
 */
const predictShutDrift = (d: number): { vel: { x: number; y: number }; dist: number } => {
  const approach = Math.sqrt(
    FIXTURE_RELATIVE_SPEED * FIXTURE_RELATIVE_SPEED - CENSUS_BODY_SPEED * CENSUS_BODY_SPEED,
  );
  const n = { x: 1, y: 0 };                       // body→ball, the fixture's own geometry
  const pv = { x: 0, y: CENSUS_BODY_SPEED };
  const rvx = -approach - pv.x;
  const rvy = 0 - pv.y;
  const relativeNormal = rvx * n.x + rvy * n.y;
  const tx = rvx - relativeNormal * n.x;
  const ty = rvy - relativeNormal * n.y;
  const release = Math.min(
    CONTACT_RELEASE_MAX_SPEED,
    Math.max(
      CONTACT_RELEASE_MIN_SPEED,
      CONTACT_RELEASE_MIN_SPEED + Math.abs(relativeNormal) * CONTACT_RELEASE_INCOMING_SHARE,
    ),
  );
  const vel = {
    x: pv.x + n.x * release + tx * CONTACT_TANGENTIAL_RETENTION,
    y: pv.y + n.y * release + ty * CONTACT_TANGENTIAL_RETENTION,
  };
  let vx = vel.x;
  let vy = vel.y;
  let px = 0;
  let py = 0;
  const fr = Math.exp(-BALL_FRICTION_K * DT);
  for (let k = 1; k <= CONTACT_CONTROL_DELAY_TICKS; k++) {
    px += vx * DT;
    py += vy * DT;
    vx *= fr;
    vy *= fr;
  }
  const bodyX = -d;
  const bodyY = CENSUS_BODY_SPEED * DT * CONTACT_CONTROL_DELAY_TICKS;
  return { vel, dist: Math.hypot(px - bodyX, py - bodyY) };
};

/* ========================================================================== */
/* ROAD B — HYGIENE, THE PROHIBITION SET AND STRONG DORMANCY                  */
/* ========================================================================== */

describe('BQ T0 — the cushion law is dormant (Road B)', () => {
  it('⭐⭐ THE PROHIBITION SET: no world, no preset, no env and no default names the flag', () => {
    expect(matchSource).toContain('this.bqCushion = cfg.bqCushion ?? false;');
    // ⛔ the entry layer names it NOWHERE: the entry rung is a later stage's business
    expect(a4Source).not.toContain('bqCushion');
    for (const v of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const) {
      const flags = a4MatchFlags(v as never) as Record<string, unknown>;
      expect(flags.bqCushion).toBeUndefined();
      expect(JSON.stringify(flags)).not.toContain('bqCushion');
    }
    const bare = new Match({ seed: 7, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.bqCushion).toBe(false);
    expect(matchOf(SEED_A).bqCushion).toBe(false);
    expect(matchOf(SEED_A, { world: W12 }).bqCushion).toBe(false);
    const league = new League({ seed: SEED_A });
    expect(league.createMatch(league.nextFixture()!).bqCushion).toBe(false);
    // no env / bundle door anywhere on a seam line
    for (const f of ['src/sim/Match.ts', 'src/sim/League.ts']) {
      for (const line of readFileSync(f, 'utf8').split('\n')) {
        if (!/bqCushion/i.test(line)) continue;
        expect(line).not.toMatch(/envArmed|EDS_BUNDLE_ARMED|process\.env/);
      }
    }
  });

  it('⭐ NO SERIALIZATION: the flag never reaches a serialized League', () => {
    const league = new League({ seed: SEED_A });
    league.matchFlags = { bqCushion: true };
    expect(JSON.stringify(league.toJSON())).not.toContain('bqCushion');
  });

  it('⭐⭐ G-OFF: ABSENT ≡ EXPLICIT-FALSE — the bare world AND world 12\'s composition × 2 seeds', () => {
    const absent: string[] = [];
    const explicitFalse: string[] = [];
    for (const world of [undefined, W12] as const) {
      for (const seed of [SEED_A, SEED_B]) {
        absent.push(signatureOf(matchOf(seed, { world })));
        explicitFalse.push(signatureOf(matchOf(seed, { world, bqExplicitFalse: true })));
      }
    }
    expect(explicitFalse).toEqual(absent);
    expect(digest(explicitFalse)).toBe(digest(absent));
    expect(new Set(absent).size).toBe(4); // one digest per (world × seed) cell
  }, 120_000);
});

/* ========================================================================== */
/* §G-KEEP — the census's mechanism, reproduced on a fixture                   */
/* ========================================================================== */

describe('BQ T0 §G-KEEP — a touch at the edge of reach', () => {
  it('⭐⭐ SHUT the ball is gone at the third tick; ARMED it is still there and the roll runs', () => {
    // the fixture's own geometry, read from `directBallAccess` CALLED (never assumed)
    const shut = cushion({ armed: false });
    const armed = cushion({ armed: true });
    for (const r of [shut, armed]) {
      expect(r.reachAtContact).toBe(CONTROL_RADIUS);          // the side/front envelope
      expect(r.dAtContact).toBeCloseTo(FIXTURE_D, 12);
      expect(r.dAtContact).toBeLessThan(r.reachAtContact);     // the touch was LAWFUL
      expect(r.pendingAtContact).not.toBeNull();               // …and it opened the window
      expect(r.pendingAtContact!.gid).toBe(r.p.gid);
      expect(r.pendingAtContact!.relativeSpeed).toBeCloseTo(FIXTURE_RELATIVE_SPEED, 12);
      expect(r.barAtReady).toBeCloseTo(CONTROL_RADIUS + CONTACT_CONTROL_RETENTION_MARGIN, 12);
    }

    // ⭐ SHUT: OUTSIDE the bar at `readyTick` ⇒ the resolver returns false BEFORE the roll —
    // no possession, and NO trace entry at all (the roll was never asked)
    expect(shut.dAtReady).toBeGreaterThan(shut.barAtReady);
    expect(shut.owner).toBeNull();
    expect(shut.traceEntries).toHaveLength(0);

    // ⭐⭐ ARMED: INSIDE the bar ⇒ the resolver reaches the roll, and the roll RUNS
    expect(armed.dAtReady).toBeLessThan(armed.barAtReady);
    expect(armed.traceEntries).toHaveLength(1);
    expect(armed.traceEntries[0].gid).toBe(armed.p.gid);
    expect(armed.owner).toBe(armed.p); // this seed's roll came up clean

    // ⭐⭐ AND THE RELATIVE VELOCITY AFTER THE ARMED CONTACT IS EXACTLY ZERO — both components,
    // read at the END of the contact tick, before the ball has moved a millimetre
    expect(armed.relativeVelAfterContact.x).toBe(0);
    expect(armed.relativeVelAfterContact.y).toBe(0);
    expect(armed.ballVelAfterContact).toEqual({ x: 0, y: CENSUS_BODY_SPEED });
    // …and the shipped law's is NOT (the pin is alive)
    expect(shut.relativeVelAfterContact.x).not.toBe(0);
    expect(shut.relativeVelAfterContact.y).not.toBe(0);
  });

  it('⭐⭐ THE SHUT DRIFT IS THE LAW\'S OWN ARITHMETIC, integrated outside the engine', () => {
    const shut = cushion({ armed: false });
    const predicted = predictShutDrift(FIXTURE_D);
    // the velocity the shipped expression produces, from the IMPORTED constants
    expect(shut.ballVelAfterContact.x).toBeCloseTo(predicted.vel.x, 12);
    expect(shut.ballVelAfterContact.y).toBeCloseTo(predicted.vel.y, 12);
    // …and the whole three-tick drive, ball physics included
    expect(shut.dAtReady).toBeCloseTo(predicted.dist, 12);
    // the prediction is not vacuous: the ARMED drive disagrees with it by the whole release
    const armed = cushion({ armed: true });
    expect(Math.abs(armed.dAtReady - predicted.dist)).toBeGreaterThan(
      CONTACT_RELEASE_MIN_SPEED * DT * CONTACT_CONTROL_DELAY_TICKS,
    );
    // ⭐ the armed ball has NOT frozen in the body's frame — the shipped ground friction still
    // bleeds its speed inside the window, so it slips back by a hair (an HONEST LIMIT, pinned)
    expect(armed.dAtReady).toBeGreaterThan(FIXTURE_D);
    expect(armed.dAtReady - FIXTURE_D).toBeLessThan(0.01);
  });

  it('⭐ THE COUNTER-RECEIPT: at 1.20 m the shipped law does NOT lose the ball', () => {
    // ⚠ DECLARED DEVIATION (§DEVIATIONS 1): the dispatch's illustrative d = 1.20 m sits FIVE
    // centimetres inside the envelope, and the shipped law's own three-tick drift at this
    // geometry is smaller than that — so the losing band is narrower than the contract's
    // "~5 cm". Pinned POSITIVELY here rather than hidden: at 1.20 m the shut ball is still
    // inside the bar and the roll runs, which is exactly why the fixture of record uses the
    // DERIVED distance instead.
    const shut = cushion({ armed: false, d: DISPATCH_D });
    expect(shut.dAtContact).toBeCloseTo(DISPATCH_D, 12);
    expect(shut.dAtReady).toBeLessThan(shut.barAtReady);
    expect(shut.traceEntries).toHaveLength(1);
    // the drift itself, derived: it is under the 0.07 m this geometry would need
    expect(shut.dAtReady - shut.dAtContact).toBeLessThan(
      CONTROL_RADIUS + CONTACT_CONTROL_RETENTION_MARGIN - DISPATCH_D,
    );
  });
});

/* ========================================================================== */
/* §G-CONTEST — the duel inside the window survives                           */
/* ========================================================================== */

describe('BQ T0 §G-CONTEST — an opponent inside the window still takes it', () => {
  it('⭐⭐ ARMED EXACTLY AS SHUT: his claim REPLACES the attempt, and the ledger records him', () => {
    for (const armed of [false, true]) {
      const r = cushion({ armed, opponentOffset: 0.5 });
      expect(r.opponent).not.toBeNull();
      expect(r.pendingAtContact!.gid).toBe(r.p.gid);
      // the engine's OWN field: the attempt now names the OPPONENT (BQ-C1's
      // `abandonedContactOpponent` — the eleventh ending, the creation site's overwrite)
      expect(r.pendingAtEnd).not.toBeNull();
      expect(r.pendingAtEnd!.gid).toBe(r.opponent!.gid);
      expect(r.pendingAtEnd!.gid).not.toBe(r.p.gid);
      // canon, VERBATIM: "an event attribution reads the engine's own record when one exists
      // (`shotLog`, the contest episodes, `lastTouch`); a heuristic is written only where no
      // record exists, and says so" (home: RC-T1B-READY-EXAM.md §COMMANDER CORRECTIONS item 5)
      const contacts = r.m.contestEpisodes.flatMap((e) => e.contacts.map((c) => `${c.gid}:${c.kind}`));
      expect(contacts).toContain(`${r.p.gid}:controlAttempt`);
      expect(contacts).toContain(`${r.opponent!.gid}:controlAttempt`);
      expect(r.m.ball.lastTouch).toBe(r.opponent);
      // the receiver's own attempt never resolved — no roll ran for him
      expect(r.traceEntries).toHaveLength(0);
      expect(r.owner).toBeNull();
    }
  });

  it('⭐ THE MUTANT READ: with the opponent removed, the ARMED attempt resolves', () => {
    const armed = cushion({ armed: true });
    expect(armed.pendingAtEnd).toBeNull();      // the resolver consumed it
    expect(armed.traceEntries).toHaveLength(1); // the roll ran
    expect(armed.owner).toBe(armed.p);
  });
});

/* ========================================================================== */
/* §G-ROLL — the roll still runs, and a failure still knocks                   */
/* ========================================================================== */

describe('BQ T0 §G-ROLL — the quality law is untouched', () => {
  it('⭐⭐ `attemptFirstTouch` and `touchFailChance` are BYTE-IDENTICAL to the dispatch HEAD', () => {
    expect(between(mechSource, 'export function touchFailChance(', '\n}\n') + '\n}')
      .toBe(TOUCH_FAIL_CHANCE_BLOCK);
    expect(between(mechSource, 'export function attemptFirstTouch(', '\n}\n') + '\n}')
      .toBe(ATTEMPT_FIRST_TOUCH_BLOCK);
    // ⛔ the roll's own file never learns this flag exists
    expect(mechSource).not.toContain('bqCushion');
  });

  it('⭐⭐ THE ROLL RUNS ON AN ARMED WORLD-12 WALK — and every cushion leaves the ball on the body', () => {
    const m = matchOf(SEED_WALK, { world: W12, bq: true, trace: true });
    const a = access(m);
    let prev: { gid: number; readyTick: number } | null = null;
    let cushions = 0;
    let exact = 0;
    while (!m.finished) {
      m.step(DT);
      const pc = a.pendingControl;
      if (pc !== null && (prev === null || prev.gid !== pc.gid || prev.readyTick !== pc.readyTick)) {
        cushions += 1;
        const body = m.allPlayers[pc.gid];
        if (m.ball.vel.x === body.vel.x && m.ball.vel.y === body.vel.y) exact += 1;
      }
      prev = pc === null ? null : { gid: pc.gid, readyTick: pc.readyTick };
    }
    // ⭐ the roll is alive on the armed path: adjudications happened, and some of them FAILED
    expect(m.firstTouchTrace.length).toBeGreaterThan(0);
    expect(m.firstTouchTrace.some((t) => !t.clean)).toBe(true);
    // ⭐⭐ THE ARMED LAW'S OWN PROPERTY, on a live match: EVERY cushion left the ball at exactly
    // the body's velocity. The note derives from the pinned counts (canon: "a gate's NOTE
    // derives from the same pinned values the gate checks").
    expect(cushions).toBeGreaterThan(0);
    expect(`${exact}/${cushions}`).toBe(`${cushions}/${cushions}`);
  }, 120_000);

  it('⭐ THE SHUT WALK IS THE MUTANT: not one cushion leaves the ball on the body', () => {
    const m = matchOf(SEED_WALK, { world: W12, trace: true });
    const a = access(m);
    let prev: { gid: number; readyTick: number } | null = null;
    let cushions = 0;
    let exact = 0;
    while (!m.finished) {
      m.step(DT);
      const pc = a.pendingControl;
      if (pc !== null && (prev === null || prev.gid !== pc.gid || prev.readyTick !== pc.readyTick)) {
        cushions += 1;
        const body = m.allPlayers[pc.gid];
        if (m.ball.vel.x === body.vel.x && m.ball.vel.y === body.vel.y) exact += 1;
      }
      prev = pc === null ? null : { gid: pc.gid, readyTick: pc.readyTick };
    }
    expect(cushions).toBeGreaterThan(0);
    expect(`${exact}/${cushions}`).toBe(`0/${cushions}`);
  }, 120_000);

  it('⭐⭐ A FORCED FAILURE STILL KNOCKS THE BALL INSIDE [3.5, 6.5] m/s', () => {
    // ⭐ HOW IT IS FORCED: through the PUBLIC seam only — a SEED SEARCH over this stage's own
    // scratch band (900,003,100–199 × the first five outfield slots), taking the FIRST armed
    // fixture whose stored trace entry reads `clean === false`. No rng is reached into, no
    // private field is written, `touchFailChance` is untouched (pinned above).
    let hit: { seed: number; gid: number } | null = null;
    for (let seed = SEED_A; seed <= SEED_ROLL_FAIL && hit === null; seed++) {
      for (let gid = 1; gid < 6 && hit === null; gid++) {
        const r = cushion({ armed: true, seed, gid });
        if (r.traceEntries.length === 1 && !r.traceEntries[0].clean) hit = { seed, gid };
      }
    }
    expect(hit).toEqual({ seed: SEED_ROLL_FAIL, gid: GID_ROLL_FAIL });
    const failed = cushion({ armed: true, seed: SEED_ROLL_FAIL, gid: GID_ROLL_FAIL });
    expect(failed.traceEntries).toHaveLength(1);
    expect(failed.traceEntries[0].clean).toBe(false);
    expect(failed.owner).toBeNull();                       // a failed touch grants nothing
    expect(failed.ballSpeedAtReady).toBeGreaterThanOrEqual(3.5);
    expect(failed.ballSpeedAtReady).toBeLessThanOrEqual(6.5);
    expect(failed.m.teams[0].stats.miscontrols).toBeGreaterThan(0);
  }, 120_000);
});

/* ========================================================================== */
/* §G-STRIKE / §G-WINDOW / §G-SOLVER — the channels this seam does not touch   */
/* ========================================================================== */

describe('BQ T0 §G-STRIKE — the body-strike and deflection channels stand', () => {
  it('⭐⭐ `bkApplyBodyStrike` is BYTE-IDENTICAL to the dispatch HEAD', () => {
    expect(between(matchSource, '  private bkApplyBodyStrike(',
      '\n\n  /** Contact changes the independent ball')).toBe(BODY_STRIKE_BLOCK);
    // ⛔ and it never learns this flag exists
    expect(BODY_STRIKE_BLOCK).not.toContain('bqCushion');
  });

  it('⭐⭐ `tryCapture`\'s APPLIED-DEFLECTION branch is BYTE-IDENTICAL to the dispatch HEAD', () => {
    expect(between(matchSource, "      if (claim.kind === 'deflection') {", '\n\n      const intended ='))
      .toBe(APPLIED_DEFLECTION_BLOCK);
    expect(APPLIED_DEFLECTION_BLOCK).not.toContain('bqCushion');
  });
});

describe('BQ T0 §G-WINDOW — the window, the margin and the resolver stand', () => {
  it('⭐⭐ the three-tick window and the 2 cm margin are the shipped constants, anchored', () => {
    expect(linesOf(constantsSource, 'export const CONTACT_CONTROL_DELAY_TICKS = 3;')).toBe(1);
    expect(CONTACT_CONTROL_DELAY_TICKS).toBe(3);
    expect(linesOf(constantsSource, 'export const CONTACT_CONTROL_RETENTION_MARGIN = 0.02;')).toBe(1);
    expect(CONTACT_CONTROL_RETENTION_MARGIN).toBe(0.02);
    // the resolver's own margin line, verbatim
    expect(linesOf(matchSource,
      '    if (access.geometry.centerDistance > access.sectorCenterReach + CONTACT_CONTROL_RETENTION_MARGIN) return false;'))
      .toBe(1);
    // the creation site's readyTick, verbatim
    expect(linesOf(matchSource,
      '      readyTick: this.stepCount + CONTACT_CONTROL_DELAY_TICKS,')).toBe(1);
  });

  it('⭐⭐ `resolvePendingControlAttempt` is BYTE-IDENTICAL to the dispatch HEAD', () => {
    expect(between(matchSource, '  private resolvePendingControlAttempt(): boolean {',
      '\n\n  private tryCapture(): void {')).toBe(RESOLVER_BLOCK);
    expect(RESOLVER_BLOCK).not.toContain('bqCushion');
  });
});

describe('BQ T0 §G-SOLVER — the overlap solver is untouched', () => {
  it('⭐⭐ `resolveOverlaps` is BYTE-IDENTICAL to the dispatch HEAD', () => {
    expect(between(matchSource, '  private resolveOverlaps(): void {',
      '\n\n  private clampPlayersToPitch')).toBe(OVERLAPS_BLOCK);
    expect(OVERLAPS_BLOCK).not.toContain('bqCushion');
  });

  it('⭐⭐ contactSolver.test.ts\'s OWN invariant, RE-RUN with the door ARMED', () => {
    // the invariant is REUSED, not re-invented: these are that suite's own assertion lines,
    // anchored here so the reuse is provable (canon: anchored extraction, home
    // BK-C0-BODYBALL-CENSUS.md §COMMANDER CORRECTIONS item 1)
    for (const line of [
      '    expect(Math.hypot(a.pos.x - b.pos.x, a.pos.y - b.pos.y)).toBe(PLAYER_MIN_DIST);',
      '    expect(a.vel.x).toBe(1);',
      '    expect(b.vel.x).toBe(1);',
      '    expect(a.vel.y).toBe(2); // tangent survives',
    ]) expect(linesOf(contactSolverSuite, line)).toBe(1);

    const m = new Match({
      seed: 19, teamA: team('A', 1), teamB: team('B', 2), duration: 1, bqCushion: true,
    } as ConstructorParameters<typeof Match>[0]);
    expect(m.bqCushion).toBe(true);
    const a = m.teams[0].players[1];
    const b = m.teams[1].players[1];
    for (const q of m.allPlayers) q.pos = { x: 100 + q.gid * 10, y: 100 };
    a.pos = { x: -0.5, y: 0 };
    b.pos = { x: 0.5, y: 0 };
    a.vel = { x: 4, y: 2 };
    b.vel = { x: -2, y: -1 };
    access(m).resolveOverlaps();
    expect(Math.hypot(a.pos.x - b.pos.x, a.pos.y - b.pos.y)).toBe(PLAYER_MIN_DIST);
    expect(a.vel.x).toBe(1);
    expect(b.vel.x).toBe(1);
    expect(a.vel.y).toBe(2); // tangent survives
    expect(b.vel.y).toBe(-1);
  });

  it('⭐ THE ARMED LAW CANNOT DRIVE THE BALL INTO A BODY — it removes the push, it adds none', () => {
    // the armed contact leaves ZERO relative velocity, so the radial CLOSING speed immediately
    // after a cushion is exactly 0; the shipped law's is strictly OUTWARD (positive along the
    // body→ball normal). Neither can be negative — the seam introduces no closing term.
    const armed = cushion({ armed: true });
    const shut = cushion({ armed: false });
    const radial = (r: CushionRun): number => r.relativeVelAfterContact.x; // n = (1, 0)
    expect(radial(armed)).toBe(0);
    expect(radial(shut)).toBeGreaterThan(0);
    // ⚠ STATED, NOT HIDDEN: the shipped engine has NO ball–body separation solver at all
    // (`resolveOverlaps` separates BODIES), so a free ball's centre can sit inside a body's
    // core in the shipped world too — that geometry is BK-C0's 球穿身, not this seam's.
    expect(OVERLAPS_BLOCK).not.toContain('this.ball');
    expect(PLAYER_CORE_RADIUS).toBe(PLAYER_MIN_DIST / 2);
  });
});

/* ========================================================================== */
/* §SEAM MAP                                                                  */
/* ========================================================================== */

describe('BQ T0 §SEAM MAP — occurrence COUNTS per needle (canon: PC-C0 §CORR item 1)', () => {
  it('⭐⭐ THE NEEDLE `bqCushion` — counted and sited, and it exists NOWHERE else', () => {
    // canon, VERBATIM: "a seam-map gate pins occurrence COUNTS per needle and enumerates
    // EVERY occurrence's site" (home: PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS
    // item 1). PREFIX STATED: this seam's whole needle family is the single flag
    // `bqCushion`. It introduces NO new constant, NO new module, NO new field and NO new
    // function — zero is the ABSENCE of a push, not a number chosen (#384 item 5).
    const SITES = ['src/sim/Match.ts', 'src/sim/League.ts'];
    for (const f of srcFiles('src')) {
      const hay = readFileSync(f, 'utf8');
      if (count(hay, /bqCushion/g) > 0) expect(SITES).toContain(f);
      if (!SITES.includes(f)) expect(hay).not.toMatch(/bqCushion/i);
    }
    expect(count(matchSource, /bqCushion/g)).toBe(5);
    expect(count(leagueSource, /bqCushion/g)).toBe(1);
    // ⭐ EVERY EXECUTABLE SITE, ENUMERATED BY ITS OWN LINE
    expect(linesOf(matchSource, '  bqCushion?: boolean;')).toBe(1);
    expect(linesOf(matchSource, '  readonly bqCushion: boolean;')).toBe(1);
    expect(linesOf(matchSource, '    this.bqCushion = cfg.bqCushion ?? false;')).toBe(1);
    expect(linesOf(matchSource, '    if (!this.bqCushion) {')).toBe(1);
    expect(linesOf(leagueSource, "    | 'bqCushion'")).toBe(1);
    // ⭐⭐ THE SHIPPED EXPRESSION, CHARACTER FOR CHARACTER (the BK-T1 idiom at Match.ts's own
    // z-partition seam: flag OFF ⇒ the shipped expression, unchanged)
    expect(linesOf(matchSource,
      '      ball.vel.x = p.vel.x + n.x * release + tx * CONTACT_TANGENTIAL_RETENTION;')).toBe(1);
    expect(linesOf(matchSource,
      '      ball.vel.y = p.vel.y + n.y * release + ty * CONTACT_TANGENTIAL_RETENTION;')).toBe(1);
    // ⭐⭐ THE ARMED EXPRESSION — the body's velocity and NOTHING else; no arithmetic at all
    expect(linesOf(matchSource, '      ball.vel.x = p.vel.x;')).toBe(1);
    expect(linesOf(matchSource, '      ball.vel.y = p.vel.y;')).toBe(1);
    // and the armed branch contains NO operator beyond the two assignments
    const armedBranch = between(matchSource, '    } else {\n      ball.vel.x = p.vel.x;', '\n    }');
    for (const forbidden of ['release', 'CONTACT_', 'n.x', 'n.y', 'tx', 'ty', 'rng', '+', '*']) {
      expect(`${forbidden}:${armedBranch.includes(forbidden)}`).toBe(`${forbidden}:false`);
    }
  });

  it('⭐⭐ THE FOUR RETIRED CONSTANTS ARE UNMOVED — they still live in the shipped expression', () => {
    // #384 item 5: "the constants stay for the shipped path, character for character". Their
    // occurrence counts across `src/**` are the dispatch HEAD's, per needle, per file.
    const RETIRED: Record<string, Record<string, number>> = {
      CONTACT_RELEASE_MIN_SPEED: { 'src/sim/Match.ts': 3, 'src/sim/constants.ts': 1 },
      CONTACT_RELEASE_MAX_SPEED: { 'src/sim/Match.ts': 2, 'src/sim/constants.ts': 1 },
      CONTACT_RELEASE_INCOMING_SHARE: { 'src/sim/Match.ts': 2, 'src/sim/constants.ts': 1 },
      CONTACT_TANGENTIAL_RETENTION: { 'src/sim/Match.ts': 3, 'src/sim/constants.ts': 1 },
    };
    // ⚠ `CONTACT_TANGENTIAL_RETENTION` is counted TWICE inside the seam because the SHIPPED
    // expression names it on both the x line and the y line; the third occurrence is the
    // import. `CONTACT_RELEASE_MIN_SPEED` reads 3 because the `release` clamp names it twice.
    for (const [needle, perFile] of Object.entries(RETIRED)) {
      const seen: Record<string, number> = {};
      for (const f of srcFiles('src')) {
        const n = count(readFileSync(f, 'utf8'), new RegExp(needle, 'g'));
        if (n > 0) seen[f] = n;
      }
      expect(`${needle}:${JSON.stringify(seen)}`).toBe(`${needle}:${JSON.stringify(perFile)}`);
    }
    // their definitions, anchored at their own definition sites
    expect(linesOf(constantsSource, 'export const CONTACT_RELEASE_MIN_SPEED = 0.25;')).toBe(1);
    expect(linesOf(constantsSource, 'export const CONTACT_RELEASE_MAX_SPEED = 1.2;')).toBe(1);
    expect(linesOf(constantsSource, 'export const CONTACT_RELEASE_INCOMING_SHARE = 0.12;')).toBe(1);
    expect(linesOf(constantsSource, 'export const CONTACT_TANGENTIAL_RETENTION = 0.35;')).toBe(1);
    expect(CONTACT_RELEASE_MIN_SPEED).toBe(0.25);
    expect(CONTACT_RELEASE_MAX_SPEED).toBe(1.2);
    expect(CONTACT_RELEASE_INCOMING_SHARE).toBe(0.12);
    expect(CONTACT_TANGENTIAL_RETENTION).toBe(0.35);
  });
});

/* ========================================================================== */
/* §G-RNG and THE FINGERPRINT                                                 */
/* ========================================================================== */

describe('BQ T0 §G-RNG and the fingerprint of record', () => {
  it('⭐ G-RNG: an ARMED cushion consumes exactly the rng a SHUT one does — zero draws added', () => {
    const shut = cushion({ armed: false });
    const armed = cushion({ armed: true });
    expect(armed.rngMoved).toBe(shut.rngMoved);
    expect(armed.rngMoved).toBe(false); // this contact draws nothing on EITHER arm
    // and the seam's own branch reaches no rng at all
    const seam = between(matchSource, '    if (!this.bqCushion) {', '\n    ball.vz *= 0.25;');
    for (const forbidden of ['rng', 'Math.random', 'chance(']) {
      expect(`${forbidden}:${seam.includes(forbidden)}`).toBe(`${forbidden}:false`);
    }
    // ⭐ the CONTESTED contact does draw (the shipped blind-contact coin lives above the seam)
    // — and it draws the SAME on both arms, from the same state
    const rngAfter = (armed: boolean): number => {
      const r = cushion({ armed, opponentOffset: 0.5 });
      return (r.m.rng as unknown as { s: number }).s;
    };
    expect(rngAfter(true)).toBe(rngAfter(false));
    // and this slice adds NO gene
    const g = randomGenome(new Rng(900_003_150));
    expect(JSON.stringify(g)).not.toContain('cushion');
    expect(JSON.stringify(g)).not.toContain('bqCushion');
  }, 60_000);

  it('⭐ the fingerprint of record is a literal in this suite, and the seam may not move it', () => {
    expect(FINGERPRINT_OF_RECORD).toBe(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
    const bare = new Match({ seed: 1, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.bqCushion).toBe(false);
    expect(bare.bkContactLaw).toBe(false);
    expect(bare.bfFacingCost).toBe(false);
  });

  it('⭐⭐ THE PRODUCTION FINGERPRINT IS UNCHANGED (57b0bdab…c673) — the a4HomeGrant form', () => {
    const league = new League({ seed: 1337 });
    const out = runHeadless(league.toJSON() as Record<string, unknown>, {
      kind: 'toGeneration', target: league.generation + 2,
    });
    expect(createHash('sha256').update(JSON.stringify(out.league)).digest('hex'))
      .toBe(FINGERPRINT_OF_RECORD);
  }, 120_000);
});
