import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { Player, TURN_RATE } from '../src/sim/Player';
import { runHeadless } from '../src/sim/simRunner';
import { DT, STAMINA_DRAIN, STAMINA_RECOVERY } from '../src/sim/constants';
import {
  BF_DEPTH, BF_OFF_HEADING_FRACTION, facingCosine, facingFactor,
} from '../src/sim/bodyFacing';
import { randomGenome } from '../src/evolution/genome';
import { randomPlayer, randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../src/sim/types';
import { a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells } from '../src/game/a4World';
import { Rng } from '../src/utils/rng';

/**
 * ⭐⭐ BF T0 — THE DORMANT FACING-COST LAW (docs/world-model/BF-T0-FACING-COST-SEAM.md;
 * COMMANDER RULING #374 item 5, amended by #375; contract BF-BODY-FACING-CONTRACT.md §2
 * M-BF.1 / M-BF.3) — THE SEAM'S PERMANENT PIN SUITE, in the house form
 * (`rcAnticipate.test.ts` / `raAccessPrice.test.ts`).
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * 「背着跑、侧着跑，跑不出全速」 — armed, a body's CLAMPED TARGET VELOCITY is scaled inside
 * `Player.physicsStep`, AFTER the top-speed clamp and BEFORE the stun multiplier and the accel
 * approach (⭐ ruling #376 item 2, CORRECTING #374 item 4(iv)'s pre-clamp order — on the raw
 * intent the price vanished wherever the executor over-saturates), by how far its heading is
 * from where it intends to go: full ahead, `BF_OFF_HEADING_FRACTION` = 0.70 once it is 90° or
 * more off, flat near 0° so a nearly-straight run pays nothing.
 *
 * The pins:
 *   • ⭐⭐ THE PROHIBITION SET — no world, no preset, no env, no bundle names the flag;
 *     `a4World.ts` contains the string nowhere; a bare Match, a world-12 Match and a League
 *     match all read `false`, and every body in them carries `facingDepth === 0`.
 *   • ⭐ NO SERIALIZATION — `League.toJSON` omits the flag.
 *   • ⭐⭐ G-OFF — flag ABSENT ≡ flag EXPLICITLY FALSE, byte for byte, on the BARE world AND
 *     on WORLD 12's composition × 2 scratch seeds each, pooled digest.
 *   • ⭐⭐ G-DEPTH — armed, EVERY body of both teams carries `BF_DEPTH`, and so does a
 *     SUBSTITUTE the moment he steps on; shut, every body carries 0, subs included.
 *   • ⭐⭐ G-AHEAD — `cos φ = 1` ⇒ the factor is EXACTLY 1, and a body driven straight ahead
 *     covers the SAME distance armed and shut with the path LIVE.
 *   • ⭐⭐ G-SIDE — BF-C0 §R3's own two-body fixture: armed, the body told to face 90° off
 *     covers LESS ground, and exactly as much as the law's own step-by-step prediction
 *     integrated OUTSIDE the engine (DERIVED, never typed); shut, the ratio is exactly 1.
 *   • ⭐⭐ G-SATURATED (#376 item 4(iii)) — an intent of 3× topSpeed 90° off heading settles at
 *     EXACTLY the same speed as an intent of 1× topSpeed, and at `BF_OFF_HEADING_FRACTION` ×
 *     the shut body's settled speed. RED before the fix (the 3× body paid nothing).
 *   • ⭐⭐ G-BACK — LAW half: a 180° standing start pays `1 − D` on its first tick and rises
 *     monotonically to 1 within `ceil(π / (TURN_RATE·DT))` ticks as the heading integrates.
 *     ENGINE half (#376 item 4(iv)): heading LOCKED behind the run, speeds compared AFTER the
 *     accel transient — priced = k × shut, with a mutant-liveness check inside the pin.
 *   • ⭐ G-SMALL / G-MONOTONE — f(7.5°) ≥ 0.997 (derived); non-increasing in φ on [0, π],
 *     flat for φ ≥ 90°, corners exact.
 *   • ⭐⭐ G-TURNRATE — the heading-rotation block byte-identical to the dispatch HEAD;
 *     `TURN_RATE` = 6.5 unchanged.
 *   • ⭐⭐ G-SITES — every `faceTarget` occurrence RECOUNTED against BF-C0 §R3's seam map:
 *     57 occurrences in 8 files, per-file counts pinned.
 *   • ⭐⭐ THE SEAM MAP — occurrence COUNTS per needle, EVERY site enumerated.
 *   • ⭐ G-RNG — the law draws ZERO rng and the module is import-free and stateless.
 *   • ⭐ THE FINGERPRINT OF RECORD — a literal in this suite, and the suite RUNS it.
 *
 * ⚠ Every walk in this file lives in the OUT-OF-BAND SCRATCH CLASS 900,002,400–499 (canon,
 * VERBATIM: "verifier scratch walks use the stage's own consumed band or the out-of-band
 * scratch range (≥ 900,000,000) — never the next virgin block"; home:
 * PW-T0C-OBJECTIVE-FIDELITY.md §COMMANDER CORRECTIONS item 6). ZERO frontier consumption.
 *
 * ⭐ Receipts are receipts (home: ruling #289 item 1 + BU-T1-MT-COMPOSITION.md §COMMANDER
 * CORRECTIONS item 5): the fixture metres below are ARMING PLUMBING — the law's arithmetic
 * proved on two bodies in a vacuum — and are never quoted as football effect sizes. What the
 * price BUYS is BF-T1's question.
 */

/** The production fingerprint of record (#305 item 1) — this seam may not move it. */
const FINGERPRINT_OF_RECORD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⚠ OUT-OF-BAND SCRATCH SEEDS — BF-T0's own band, 900,002,400–499. */
const SEED_A = 900_002_400;
const SEED_B = 900_002_401;
const SEED_C = 900_002_402;

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
  bf?: boolean;
  /** pass the door EXPLICITLY as false rather than omitting it (dormancy's other half) */
  bfExplicitFalse?: boolean;
  /** world 12's composition — the form the user plays */
  world?: 12;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const base = a.world === undefined ? {} : a4MatchFlags(a.world);
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240,
    ...base,
    ...(a.bf === true ? { bfFacingCost: true } : {}),
    ...(a.bfExplicitFalse === true ? { bfFacingCost: false } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (a.world !== undefined) armA4World(m, null, a.world, L3_DOSE, PC_DOSE);
  return m;
};

/** The house world-identity signature (PW-T0b's, verbatim via GC-T0 / RA-T0 / RC-T0). */
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
const bodyFacingSource = src('sim/bodyFacing.ts');
const playerSource = src('sim/Player.ts');
const matchSource = src('sim/Match.ts');
const leagueSource = src('sim/League.ts');
const rendezvousSource = src('sim/rendezvousRecovery.ts');
const a4Source = src('game/a4World.ts');
const count = (hay: string, needle: RegExp): number => (hay.match(needle) ?? []).length;
const linesOf = (hay: string, line: string): number =>
  hay.split('\n').filter((l) => l === line).length;
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = join(dir, e);
  return statSync(full).isDirectory() ? srcFiles(full) : full.endsWith('.ts') ? [full] : [];
});

/** ⭐ G-TURNRATE's anchor: the heading-rotation block of `Player.physicsStep`, VERBATIM at
 * the dispatch HEAD (0de6f7e). BF-T0 scales the INTENT above this block and does not touch a
 * character of it (contract M-BF.3: `TURN_RATE` unchanged, every facing decision unchanged). */
const HEADING_BLOCK = [
  '    const sp = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);',
  '    // Rotate heading toward the face target (backpedal, 27.5) or, failing',
  '    // that, the movement direction — capped at TURN_RATE either way.',
  '    // No trig in the loop: the per-step rotation\'s cos/sin are cached per dt.',
  '    if (dt !== turnDt) {',
  '      turnDt = dt;',
  '      turnCos = Math.cos(TURN_RATE * dt);',
  '      turnSin = Math.sin(TURN_RATE * dt);',
  '    }',
  '    const ft = this.faceTarget;',
  '    let wx = 0;',
  '    let wy = 0;',
  '    let turn = false;',
  '    if (ft) {',
  '      const fx = ft.x - this.pos.x;',
  '      const fy = ft.y - this.pos.y;',
  '      const fl = Math.sqrt(fx * fx + fy * fy);',
  '      if (fl > 1e-6) {',
  '        wx = fx / fl;',
  '        wy = fy / fl;',
  '        turn = true;',
  '      }',
  '    } else if (sp > 0.5) {',
  '      wx = this.vel.x / sp;',
  '      wy = this.vel.y / sp;',
  '      turn = true;',
  '    }',
  '    if (turn) {',
  '      const hx = this.heading.x;',
  '      const hy = this.heading.y;',
  '      if (hx * wx + hy * wy >= turnCos) {',
  '        this.heading = { x: wx, y: wy };',
  '      } else {',
  '        const s = hx * wy - hy * wx >= 0 ? turnSin : -turnSin;',
  '        this.heading = { x: hx * turnCos - hy * s, y: hx * s + hy * turnCos };',
  '      }',
  '    }',
].join('\n');

/* ========================================================================== */
/* THE FIXTURE — BF-C0 §R3's own two bodies, re-used                          */
/* ========================================================================== */

/**
 * ⭐⭐ BF-C0 §R3's `facingFreeReceipt` fixture, re-used verbatim in construction
 * (`scripts/probes/bf-c0-movement-facing-census.ts` §7): two identical bodies driven at ONE
 * target for 120 ticks at their own top speed, one told to face 90° off its velocity. On the
 * shipped engine both cover the SAME distance (`distanceRatio` exactly 1); armed, the faced
 * one must fall behind by exactly what the law predicts.
 */
const FIXTURE_TICKS = 120;
const FIXTURE_TARGET_X = 100;
const mkFixtureBody = (depth: number): Player => {
  const p = new Player(0 as Side, 2, 'MF', 'FIX', randomPlayer(new Rng(4242), 'MF'));
  p.pos = { x: 0, y: 0 };
  p.vel = { x: 0, y: 0 };
  p.heading = { x: 1, y: 0 };
  p.stamina = 1;
  p.facingDepth = depth;
  return p;
};
/** Drive the fixture THROUGH THE ENGINE. `faceOff` = the 90°-off body. */
const driveFixture = (faceOff: boolean, depth: number): { dist: number; heading: [number, number] } => {
  const p = mkFixtureBody(depth);
  for (let t = 0; t < FIXTURE_TICKS; t++) {
    const dx = FIXTURE_TARGET_X - p.pos.x;
    const dy = 0 - p.pos.y;
    const dl = Math.sqrt(dx * dx + dy * dy);
    p.desiredVel = { x: (dx / dl) * p.topSpeed, y: (dy / dl) * p.topSpeed };
    p.faceTarget = faceOff ? { x: p.pos.x, y: p.pos.y + 50 } : null;
    p.physicsStep(DT);
  }
  return { dist: p.pos.x, heading: [p.heading.x, p.heading.y] };
};

/**
 * ⭐⭐ THE SAME DRIVE, INTEGRATED OUTSIDE THE ENGINE — the law's own prediction, step by
 * step, from `facingFactor` / `facingCosine` and nothing the engine hands us. DERIVED, never
 * typed: this re-implements the clamp, THE FACING PRICE ON THE CLAMPED TARGET (ruling #376
 * item 2's corrected order), the accel approach, the position advance and the heading
 * rotation at `TURN_RATE`, in that order, and is the expectation G-SIDE compares the engine
 * against.
 */
const predictFixture = (faceOff: boolean, depth: number): number => {
  const proto = mkFixtureBody(depth);
  const baseSpeed = proto.baseSpeed;
  const accel = proto.accel;
  const drainMul = proto.staminaDrainMul;
  const staminaAttr = proto.attrs.stamina;
  let stamina = 1;
  const turnCos = Math.cos(TURN_RATE * DT);
  const turnSin = Math.sin(TURN_RATE * DT);
  let px = 0; let py = 0; let vx = 0; let vy = 0; let hx = 1; let hy = 0;
  for (let t = 0; t < FIXTURE_TICKS; t++) {
    const topSpeed = baseSpeed * (0.62 + 0.38 * stamina); // the shipped `topSpeed` getter
    const dx = FIXTURE_TARGET_X - px;
    const dy = 0 - py;
    const dl = Math.sqrt(dx * dx + dy * dy);
    const ix = (dx / dl) * topSpeed;
    const iy = (dy / dl) * topSpeed;
    // the shipped clamp FIRST (ruling #376 item 2 — the corrected order)
    const ml = Math.sqrt(ix * ix + iy * iy);
    let tx = ix;
    let ty = iy;
    if (ml > topSpeed && ml > 1e-8) {
      tx = ix * (topSpeed / ml);
      ty = iy * (topSpeed / ml);
    }
    // THE LAW, on the CLAMPED TARGET (the only thing BF-T0 adds), before the stun
    // multiplier and the accel approach
    if (depth > 0) {
      const tl = Math.sqrt(tx * tx + ty * ty);
      if (tl > 1e-8) {
        const f = facingFactor(facingCosine(hx, hy, tx / tl, ty / tl), depth);
        tx *= f;
        ty *= f;
      }
    }
    // the shipped accel approach
    const maxDelta = accel * DT;
    const ax = tx - vx;
    const ay = ty - vy;
    const al = Math.sqrt(ax * ax + ay * ay);
    if (al <= maxDelta || al < 1e-8) {
      vx = tx;
      vy = ty;
    } else {
      vx += ax * (maxDelta / al);
      vy += ay * (maxDelta / al);
    }
    const px0 = px;
    const py0 = py;
    px += vx * DT;
    py += vy * DT;
    // the shipped heading rotation. ⚠ `faceTarget` was written from the PRE-step position
    // (the executor's own order), and `physicsStep` reads it AFTER the advance — so the face
    // direction is (px0 − px, py0 + 50 − py), not a clean +y. Mirrored exactly.
    const sp = Math.sqrt(vx * vx + vy * vy);
    let wx = 0;
    let wy = 0;
    let turn = false;
    if (faceOff) {
      const fx = px0 - px;
      const fy = py0 + 50 - py;
      const fl = Math.sqrt(fx * fx + fy * fy);
      if (fl > 1e-6) {
        wx = fx / fl;
        wy = fy / fl;
        turn = true;
      }
    } else if (sp > 0.5) {
      wx = vx / sp;
      wy = vy / sp;
      turn = true;
    }
    if (turn) {
      if (hx * wx + hy * wy >= turnCos) {
        hx = wx;
        hy = wy;
      } else {
        const s = hx * wy - hy * wx >= 0 ? turnSin : -turnSin;
        const nx = hx * turnCos - hy * s;
        const ny = hx * s + hy * turnCos;
        hx = nx;
        hy = ny;
      }
    }
    // the shipped stamina economy — it feeds back into `topSpeed`, and the PRICED body runs
    // slower and therefore tires LESS, so a prediction that froze it would be wrong
    const effort = sp / baseSpeed;
    if (effort > 0.55) {
      stamina = Math.max(0.05, stamina
        - STAMINA_DRAIN * effort * effort * DT * drainMul * (1.24 - staminaAttr * 0.6));
    } else {
      stamina = Math.min(1, stamina + STAMINA_RECOVERY * DT * (0.88 + staminaAttr * 0.3));
    }
  }
  return px;
};

/**
 * ⭐⭐ THE LOCKED-HEADING FIXTURE (ruling #376 item 4(iii)–(iv)) — the G-SIDE/BF-C0 idiom with
 * the heading PINNED: one body driven along +x with a `faceTarget` that keeps its heading ~90°
 * off the run (`'side'`) or ~180° behind it (`'back'`), so after the turn settles `cos φ ≤ 0`
 * and the factor is EXACTLY `BF_OFF_HEADING_FRACTION` every tick. Two controls make the pin
 * read the FACTOR and nothing else: the stamina is held at full (every arm therefore shares ONE
 * `topSpeed`, so the priced body's lighter drain cannot leak into the ratio) and the speed is
 * read only after the accel transient has ended. `intentMul` over-saturates the intent the way
 * the shipped executors do (`arrive(…, topSpeed·speedF)` + `separation` + `avoidOpponents`,
 * `src/ai/actionExecutor.ts` ~ll.1304–1321) — the case the pre-fix order let off free.
 */
const LOCKED_TICKS = 120;
/** Tolerance DERIVED from the engine's own accel step (the settled speed is hit exactly). */
const ACCEL_STEP = mkFixtureBody(0).accel * DT;
const LOCKED_TOL = ACCEL_STEP * 1e-9;
const driveLocked = (
  lock: 'side' | 'back', depth: number, intentMul: number,
): { speed: number; cosPhi: number; topSpeed: number } => {
  const p = mkFixtureBody(depth);
  let top = p.topSpeed;
  for (let t = 0; t < LOCKED_TICKS; t++) {
    p.stamina = 1; // held full: ONE topSpeed across every arm of the fixture
    top = p.topSpeed;
    p.desiredVel = { x: top * intentMul, y: 0 };
    p.faceTarget = lock === 'side'
      ? { x: p.pos.x, y: p.pos.y + 50 }
      : { x: p.pos.x - 50, y: p.pos.y };
    p.physicsStep(DT);
  }
  const sp = Math.sqrt(p.vel.x * p.vel.x + p.vel.y * p.vel.y);
  return {
    speed: sp,
    cosPhi: facingCosine(p.heading.x, p.heading.y, p.vel.x / sp, p.vel.y / sp),
    topSpeed: top,
  };
};

/* ========================================================================== */
/* ROAD B — HYGIENE, THE PROHIBITION SET AND STRONG DORMANCY                  */
/* ========================================================================== */

describe('BF T0 — the facing cost is dormant (Road B)', () => {
  it('⭐⭐ THE PROHIBITION SET: no world, no preset, no env and no default names the flag', () => {
    expect(matchSource).toContain('this.bfFacingCost = cfg.bfFacingCost ?? false;');
    // ⛔ the entry layer names it NOWHERE: the entry rung is a later stage's business
    expect(a4Source).not.toContain('bfFacingCost');
    expect(a4Source).not.toContain('facingDepth');
    for (const v of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const) {
      const flags = a4MatchFlags(v as never) as Record<string, unknown>;
      expect(flags.bfFacingCost).toBeUndefined();
      expect(JSON.stringify(flags)).not.toContain('bfFacingCost');
    }
    const bare = new Match({ seed: 7, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.bfFacingCost).toBe(false);
    expect(matchOf(SEED_A).bfFacingCost).toBe(false);
    expect(matchOf(SEED_A, { world: W12 }).bfFacingCost).toBe(false);
    const league = new League({ seed: SEED_A });
    expect(league.createMatch(league.nextFixture()!).bfFacingCost).toBe(false);
    // and every body in every one of them carries NO depth
    for (const m of [bare, matchOf(SEED_A), matchOf(SEED_A, { world: W12 }),
      league.createMatch(league.nextFixture()!)]) {
      for (const t of m.teams) for (const p of t.players) expect(p.facingDepth).toBe(0);
    }
    // no env / bundle door anywhere on a seam line
    for (const f of [
      'src/sim/Match.ts', 'src/sim/League.ts', 'src/sim/Player.ts', 'src/sim/bodyFacing.ts',
      'src/sim/rendezvousRecovery.ts',
    ]) {
      for (const line of readFileSync(f, 'utf8').split('\n')) {
        if (!/bfFacingCost|facingDepth|facingFactor|facingCosine|BF_DEPTH|BF_OFF/i.test(line)) {
          continue;
        }
        expect(line).not.toMatch(/envArmed|EDS_BUNDLE_ARMED|process\.env/);
      }
    }
  });

  it('⭐ NO SERIALIZATION: the flag never reaches a serialized League', () => {
    const league = new League({ seed: SEED_A });
    league.matchFlags = { bfFacingCost: true };
    expect(JSON.stringify(league.toJSON())).not.toContain('bfFacingCost');
  });

  it('⭐⭐ G-OFF: ABSENT ≡ EXPLICIT-FALSE — the bare world AND world 12\'s composition × 2 seeds', () => {
    const absent: string[] = [];
    const explicitFalse: string[] = [];
    for (const world of [undefined, W12] as const) {
      for (const seed of [SEED_A, SEED_B]) {
        absent.push(signatureOf(matchOf(seed, { world })));
        explicitFalse.push(signatureOf(matchOf(seed, { world, bfExplicitFalse: true })));
      }
    }
    expect(explicitFalse).toEqual(absent);
    expect(digest(explicitFalse)).toBe(digest(absent));
    expect(new Set(absent).size).toBe(4); // one digest per (world × seed) cell
  }, 120_000);

  it('⭐⭐ G-DEPTH (shut): every body carries 0 — through a whole match, substitutes included', () => {
    const m = matchOf(SEED_C, { world: W12 });
    while (!m.finished) m.step(DT);
    for (const t of m.teams) for (const p of t.players) expect(p.facingDepth).toBe(0);
    // and the SUBSTITUTION path writes 0 too (the entering man is this same slot object)
    const shut = matchOf(SEED_C);
    const victim = shut.teams[0].players[3];
    (shut as unknown as { forceSubstitution(p: Player): void }).forceSubstitution(victim);
    expect(shut.teams[0].subsUsed).toBe(1);
    expect(victim.facingDepth).toBe(0);
  }, 120_000);

  it('⭐⭐ G-DEPTH (armed): every body carries BF_DEPTH — and so does a substitute as he enters', () => {
    const m = matchOf(SEED_C, { world: W12, bf: true });
    expect(m.bfFacingCost).toBe(true);
    for (const t of m.teams) for (const p of t.players) expect(p.facingDepth).toBe(BF_DEPTH);
    while (!m.finished) m.step(DT);
    for (const t of m.teams) for (const p of t.players) expect(p.facingDepth).toBe(BF_DEPTH);
    // THE SUB PATH, exercised: a new man in an old pitch slot carries the same depth
    const armed = matchOf(SEED_C, { bf: true });
    const victim = armed.teams[0].players[3];
    const before = victim.name;
    (armed as unknown as { forceSubstitution(p: Player): void }).forceSubstitution(victim);
    expect(armed.teams[0].subsUsed).toBe(1);
    expect(victim.name).not.toBe(before); // a DIFFERENT man, same slot object
    expect(victim.facingDepth).toBe(BF_DEPTH);
  }, 120_000);
});

/* ========================================================================== */
/* §LAW — the factor on scalars and on the BF-C0 fixture                      */
/* ========================================================================== */

describe('BF T0 §LAW — the cosine-flat facing factor', () => {
  it('⭐ THE CONSTANTS ARE TRACED, AND THE DEPTH IS DERIVED (never typed twice)', () => {
    expect(BF_OFF_HEADING_FRACTION).toBe(0.7);
    expect(BF_DEPTH).toBe(1 - BF_OFF_HEADING_FRACTION);
    expect(bodyFacingSource).toContain('export const BF_DEPTH = 1 - BF_OFF_HEADING_FRACTION;');
    // ⛔ 0.30 is NOWHERE typed as a literal: the depth has ONE source, the anchor constant
    expect(bodyFacingSource).not.toMatch(/BF_DEPTH = 0\.3/);
    // the docblock traces both to their rulings
    expect(bodyFacingSource).toContain('#374 item 4(ii)');
    expect(bodyFacingSource).toContain('#375 item 2');
  });

  it('⭐⭐ G-AHEAD: cos φ = 1 ⇒ the factor is EXACTLY 1, and dead-ahead running is free', () => {
    for (const depth of [BF_DEPTH, 0.2, 0.5, 1]) expect(facingFactor(1, depth)).toBe(1);
    expect(facingCosine(1, 0, 1, 0)).toBe(1);
    // the fixture: the UNFACED body's heading follows its own velocity, so it is aligned
    // from the first tick — armed and shut cover the SAME ground, with the path LIVE.
    const shut = driveFixture(false, 0);
    const armed = driveFixture(false, BF_DEPTH);
    expect(armed.dist).toBe(shut.dist);
    expect(shut.dist).toBeGreaterThan(5); // the fixture really moved
    expect(Math.abs(armed.heading[0] - 1)).toBeLessThan(1e-9);
  });

  it('⭐⭐ G-SIDE: the 90°-off body covers LESS — exactly the law\'s own predicted distance', () => {
    // SHUT: BF-C0 §R3's receipt at this HEAD — facing is still free (ratio exactly 1).
    const shutFree = driveFixture(false, 0);
    const shutFaced = driveFixture(true, 0);
    expect(shutFaced.dist).toBe(shutFree.dist);
    expect(shutFaced.dist / shutFree.dist).toBe(1);
    // the fixture is ALIVE: the faced body really turned away from its motion (BF-C0's own
    // liveness check, `facingFree.fixtureIsAlive.facedBodyTurnedAway`: φ > 1.5 rad), while
    // the free body faces exactly where it runs
    expect(Math.acos(Math.min(1, Math.abs(shutFaced.heading[0])))).toBeGreaterThan(1.5);
    expect(Math.abs(shutFree.heading[0] - 1)).toBeLessThan(1e-9);
    // ARMED: shorter, and equal to the OUTSIDE-THE-ENGINE integration of the same law
    const armedFaced = driveFixture(true, BF_DEPTH);
    expect(armedFaced.dist).toBeLessThan(shutFaced.dist);
    expect(armedFaced.dist).toBeCloseTo(predictFixture(true, BF_DEPTH), 9);
    // the prediction is not vacuous: it also reproduces the SHUT drive and the free drive
    expect(predictFixture(true, 0)).toBeCloseTo(shutFaced.dist, 9);
    expect(predictFixture(false, BF_DEPTH)).toBeCloseTo(driveFixture(false, BF_DEPTH).dist, 9);
    // and the saturated price is the anchor constant itself: after the heading has settled
    // 90° off, each tick's intent is scaled by exactly k
    expect(facingFactor(facingCosine(0, 1, 1, 0), BF_DEPTH)).toBe(BF_OFF_HEADING_FRACTION);
  });

  it('⭐⭐ G-BACK: a 180° standing start pays 1 − D and rises to 1 as the heading integrates', () => {
    // THE LAW'S OWN CLOCK: the heading rotates at TURN_RATE toward the intent; the factor is
    // read each tick from that heading. DERIVED — the tick budget is the engine's own
    // full-reversal cost, ceil(π / (TURN_RATE · DT)).
    const budget = Math.ceil(Math.PI / (TURN_RATE * DT));
    const turnCos = Math.cos(TURN_RATE * DT);
    const turnSin = Math.sin(TURN_RATE * DT);
    let hx = 1; let hy = 0;               // facing +x
    const ix = -1; const iy = 0;          // intending to go -x: a full 180°
    const factors: number[] = [];
    for (let t = 0; t <= budget; t++) {
      factors.push(facingFactor(facingCosine(hx, hy, ix, iy), BF_DEPTH));
      if (t === budget) break; // the reading AFTER the last of the budget's rotations
      if (hx * ix + hy * iy >= turnCos) {
        hx = ix;
        hy = iy;
      } else {
        const s = hx * iy - hy * ix >= 0 ? turnSin : -turnSin;
        const nx = hx * turnCos - hy * s;
        const ny = hx * s + hy * turnCos;
        hx = nx;
        hy = ny;
      }
    }
    expect(factors[0]).toBe(1 - BF_DEPTH);
    expect(factors[0]).toBe(BF_OFF_HEADING_FRACTION);
    for (let i = 1; i < factors.length; i++) {
      expect(factors[i]).toBeGreaterThanOrEqual(factors[i - 1]);
    }
    expect(factors.length).toBe(budget + 1);
    expect(factors[factors.length - 1]).toBe(1); // home within the budget, exactly
    expect(budget).toBe(Math.ceil(Math.PI / (TURN_RATE * DT)));
    // AND IN THE ENGINE: a body at rest, facing +x, told to run -x is priced at k on tick one.
    const p = mkFixtureBody(BF_DEPTH);
    p.desiredVel = { x: -p.topSpeed, y: 0 };
    p.faceTarget = null;
    const firstTickFactor = facingFactor(facingCosine(p.heading.x, p.heading.y, -1, 0), BF_DEPTH);
    expect(firstTickFactor).toBe(BF_OFF_HEADING_FRACTION);
    // ⭐⭐ THE ENGINE HALF, REBUILT (ruling #376 item 4(iv)). The pre-fix half compared the
    // first-tick speeds of two bodies that were BOTH accel-capped (maxDelta ≈ 0.21–0.26 m/s
    // against targets of 4.5–7.6 m/s) — two numbers equal BY PHYSICS, a check that would have
    // passed with the seam deleted. Instead: the heading LOCKED behind the run and the speeds
    // compared AFTER the accel transient, where the priced body settles at exactly k × shut.
    const pricedBack = driveLocked('back', BF_DEPTH, 1);
    const shutBack = driveLocked('back', 0, 1);
    expect(pricedBack.cosPhi).toBeLessThanOrEqual(0); // the lock held: heading 180° off the run
    expect(shutBack.speed).toBeGreaterThan(5);        // the fixture really ran
    expect(shutBack.speed).toBeCloseTo(shutBack.topSpeed, 9); // the shut body settles at top
    expect(Math.abs(pricedBack.speed - BF_OFF_HEADING_FRACTION * shutBack.speed))
      .toBeLessThan(LOCKED_TOL);
    // ⭐ MUTANT LIVENESS (canon: "every gate conjunct provably alive", home: ruling #268.3(a)):
    // force `facingDepth` to 0 on the priced body and the assertion above MUST fail — the two
    // settled speeds become EQUAL, so the check genuinely depends on the seam.
    const mutant = driveLocked('back', 0, 1);
    expect(Math.abs(mutant.speed - shutBack.speed)).toBeLessThan(LOCKED_TOL);
    expect(Math.abs(mutant.speed - BF_OFF_HEADING_FRACTION * shutBack.speed))
      .toBeGreaterThan(LOCKED_TOL);
  });

  it('⭐⭐ G-SATURATED: an intent of 3× topSpeed 90° off pays EXACTLY what 1× pays', () => {
    // ⭐⭐ THE PIN THE FIX EXISTS FOR (ruling #376 item 2 / item 4(iii)). BEFORE THE FIX THIS
    // WOULD HAVE BEEN RED for the 3× body: with the factor on the RAW intent, 3·topSpeed·k =
    // 2.1·topSpeed still clamps back to topSpeed, so an over-saturated sprint paid NOTHING —
    // and the shipped executors over-saturate routinely. After the fix the price lands on the
    // CLAMPED target, so headroom cannot absorb it.
    const armed1x = driveLocked('side', BF_DEPTH, 1);
    const armed3x = driveLocked('side', BF_DEPTH, 3);
    const shut = driveLocked('side', 0, 1);
    // the lock held on every arm: the heading really is 90°-or-more off the run
    for (const arm of [armed1x, armed3x, shut]) expect(arm.cosPhi).toBeLessThanOrEqual(0);
    expect(shut.speed).toBeGreaterThan(5);                     // alive
    expect(shut.speed).toBeCloseTo(shut.topSpeed, 9);          // shut settles at topSpeed
    // (a) the two priced bodies settle at the SAME speed — headroom buys nothing
    expect(Math.abs(armed3x.speed - armed1x.speed)).toBeLessThan(LOCKED_TOL);
    // (b) and that speed is k × the shut body's, DERIVED from the law and the clamp
    expect(Math.abs(armed1x.speed - BF_OFF_HEADING_FRACTION * shut.speed))
      .toBeLessThan(LOCKED_TOL);
    // ⭐ MUTANT LIVENESS on the ORDER ITSELF: the OLD (pre-fix) arithmetic, evaluated here —
    // price the RAW 3× intent, then clamp — predicts the FULL topSpeed, i.e. no price at all,
    // and it disagrees with what the engine now does by the whole depth.
    const oldOrder3x = Math.min(shut.topSpeed, 3 * shut.topSpeed * BF_OFF_HEADING_FRACTION);
    expect(oldOrder3x).toBe(shut.topSpeed);
    expect(Math.abs(oldOrder3x - armed3x.speed))
      .toBeCloseTo(BF_DEPTH * shut.topSpeed, 9);
  });

  it('⭐ G-SMALL: a nearly-straight run pays essentially nothing — f(7.5°) ≥ 0.997, DERIVED', () => {
    const phi = (7.5 * Math.PI) / 180; // BF-C0's φ bin 0 centre
    const f = facingFactor(Math.cos(phi), BF_DEPTH);
    expect(f).toBe(1 - BF_DEPTH * (1 - Math.cos(phi)));
    expect(f).toBeGreaterThanOrEqual(0.997);
    // the ruling's own readings of the shape, re-derived (⛔ never typed as literals)
    expect(facingFactor(Math.cos(Math.PI / 4), BF_DEPTH))
      .toBeCloseTo(1 - BF_DEPTH * (1 - Math.SQRT1_2), 15);
  });

  it('⭐ G-MONOTONE: non-increasing on [0, π], FLAT beyond 90°, corners exact', () => {
    let prev = Infinity;
    for (let deg = 0; deg <= 180; deg += 1) {
      const f = facingFactor(Math.cos((deg * Math.PI) / 180), BF_DEPTH);
      expect(f).toBeLessThanOrEqual(prev + 1e-15);
      prev = f;
      if (deg >= 90) expect(f).toBe(1 - BF_DEPTH);
    }
    expect(facingFactor(Math.cos(0), BF_DEPTH)).toBe(1);
    expect(facingFactor(Math.cos(Math.PI / 2), BF_DEPTH)).toBe(1 - BF_DEPTH);
    expect(facingFactor(Math.cos(Math.PI), BF_DEPTH)).toBe(1 - BF_DEPTH);
    // out-of-range cosines are CLAMPED, never extrapolated
    expect(facingFactor(5, BF_DEPTH)).toBe(1);
    expect(facingFactor(-5, BF_DEPTH)).toBe(1 - BF_DEPTH);
    // a zero depth is the identity at every angle (the shipped value, if it ever ran)
    for (let deg = 0; deg <= 180; deg += 15) {
      expect(facingFactor(Math.cos((deg * Math.PI) / 180), 0)).toBe(1);
    }
  });

  it('⭐ DEGENERATE INPUTS name no angle ⇒ no penalty; the scaling never turns the intent', () => {
    expect(facingCosine(0, 0, 1, 0)).toBe(1);
    expect(facingCosine(1, 0, 0, 0)).toBe(1);
    expect(facingCosine(0, 0, 0, 0)).toBe(1);
    // a standing body with a zero intent is untouched (|dv| ≈ 0 ⇒ factor 1 by construction)
    const p = mkFixtureBody(BF_DEPTH);
    p.desiredVel = { x: 0, y: 0 };
    p.faceTarget = null;
    p.physicsStep(DT);
    expect(p.vel.x).toBe(0);
    expect(p.vel.y).toBe(0);
    // ⚠ THE DIRECTION OF THE INTENT NEVER MOVES: both components take the SAME factor, so an
    // armed body accelerates along exactly the bearing a shut one does.
    const armed = mkFixtureBody(BF_DEPTH);
    const shut = mkFixtureBody(0);
    for (const b of [armed, shut]) {
      b.heading = { x: 0, y: 1 };
      b.desiredVel = { x: b.topSpeed * 0.6, y: b.topSpeed * 0.8 };
      b.faceTarget = { x: b.pos.x, y: b.pos.y + 50 };
      b.physicsStep(DT);
    }
    expect(armed.vel.x / armed.vel.y).toBeCloseTo(shut.vel.x / shut.vel.y, 12);
  });
});

/* ========================================================================== */
/* §ENGINE — what the seam did NOT touch                                      */
/* ========================================================================== */

describe('BF T0 §ENGINE — TURN_RATE and every facing decision are untouched', () => {
  it('⭐⭐ G-TURNRATE: the heading-rotation block is byte-identical to the dispatch HEAD', () => {
    expect(TURN_RATE).toBe(6.5);
    expect(playerSource).toContain('export const TURN_RATE = 6.5;');
    expect(playerSource).toContain(HEADING_BLOCK);
    // the seam sits ABOVE the block (it prices the target, never the heading) and the
    // block is reached exactly once
    expect(count(playerSource, /const ft = this\.faceTarget;/g)).toBe(1);
    const seamAt = playerSource.indexOf('if (this.facingDepth > 0) {');
    expect(seamAt).toBeGreaterThan(-1);
    expect(seamAt).toBeLessThan(playerSource.indexOf(HEADING_BLOCK));
    // ⭐ THE CORRECTED ORDER (ruling #376 item 2): the price lands AFTER the top-speed clamp
    // and BEFORE the stun multiplier — clamp → facing → stun → accel approach.
    const clampAt = playerSource.indexOf('    const max = this.topSpeed;');
    const stunAt = playerSource.indexOf('    if (this.stunTimer > 0) {');
    const accelAt = playerSource.indexOf('    const maxDelta = this.accel * dt; // approachV');
    expect(clampAt).toBeGreaterThan(-1);
    expect(seamAt).toBeGreaterThan(clampAt);
    expect(seamAt).toBeLessThan(stunAt);
    expect(stunAt).toBeLessThan(accelAt);
    // and the seam scales the CLAMPED target in place — the two statements, by their lines
    expect(linesOf(playerSource, '        tx *= f;')).toBe(1);
    expect(linesOf(playerSource, '        ty *= f;')).toBe(1);
  });

  it('⭐⭐ G-SITES: every `faceTarget` occurrence RECOUNTED against BF-C0 §R3\'s seam map', () => {
    // BF-C0 §R3 (ruling #374 item 1, the verifier recounted all 57 with line receipts):
    // 57 occurrences in 8 of the `.ts` files under `src/`. This seam changed NO site.
    //
    // ⚠ NARROWED BY RC-T0b (ruling #378 item 6), the DF-T0 §P7 form — stated POSITIVELY and
    // never deleted. RC-T0b's READY limb adds exactly ONE new `faceTarget` WRITE (the
    // receiver's pre-strike face at `actionExecutor.ts`) and three prose mentions beside it,
    // so the recount is 61 in the same 8 files. BF-T0's substantive claim is unweakened and is
    // re-stated below as the thing it actually asserts: the number of `faceTarget` ASSIGNMENT
    // statements per file, which BF-T0 left untouched and RC-T0b moved by exactly one, and
    // `Player.ts`'s own three sites, which are byte-identical.
    const MAP: Record<string, number> = {
      'src/ai/PlayerBrain.ts': 2,
      'src/ai/actionExecutor.ts': 21,
      'src/ai/inLookAct.ts': 1,
      'src/ai/pcLatency.ts': 1,
      'src/ai/receiverAnticipationSeat.ts': 1,
      'src/sim/Match.ts': 12,
      'src/sim/Player.ts': 3,
      'src/sim/rendezvousRecovery.ts': 20,
    };
    const files = srcFiles('src');
    const seen: Record<string, number> = {};
    let total = 0;
    for (const f of files) {
      const n = count(readFileSync(f, 'utf8'), /faceTarget/g);
      if (n > 0) {
        seen[f] = n;
        total += n;
      }
    }
    expect(seen).toEqual(MAP);
    expect(total).toBe(61);
    expect(Object.keys(seen).length).toBe(8);
    // ⭐ THE SUBSTANTIVE CLAIM, POSITIVELY: the facing DECISIONS themselves. BF-C0 §R3's 14
    // writes in `actionExecutor.ts` stand, plus RC-T0b's ONE; every other file's write count
    // is exactly what it was, and BF-T0 still changes none of them.
    const WRITES: Record<string, number> = {
      'src/ai/actionExecutor.ts': 15,
      'src/sim/Player.ts': 1,
      'src/sim/Match.ts': 4,
      'src/ai/pcLatency.ts': 1,
      'src/sim/rendezvousRecovery.ts': 4,
    };
    for (const [f, n] of Object.entries(WRITES)) {
      expect(`${f}:${count(readFileSync(f, 'utf8'), /faceTarget = /g)}`).toBe(`${f}:${n}`);
    }
    // the three `Player.ts` sites, enumerated and anchored (canon, VERBATIM: "a src-extracted
    // constant pins its extraction to the NAMED call site — anchored match + line receipt —
    // never first-occurrence"; home: BK-C0-BODYBALL-CENSUS.md §COMMANDER CORRECTIONS item 1)
    for (const line of [
      '  faceTarget: V2 | null = null;',
      '    this.faceTarget = null;',
      '    const ft = this.faceTarget;',
    ]) expect(linesOf(playerSource, line)).toBe(1);
  });
});

/* ========================================================================== */
/* §SEAM MAP                                                                  */
/* ========================================================================== */

describe('BF T0 §SEAM MAP — occurrence COUNTS per needle (canon: PC-C0 §CORR item 1)', () => {
  it('⭐⭐ THE NEEDLE FAMILY — counted and sited', () => {
    // canon, VERBATIM: "a seam-map gate pins occurrence COUNTS per needle and enumerates
    // EVERY occurrence's site" (home: PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS
    // item 1). PREFIX STATED: the seam's whole needle family is the flag `bfFacingCost`, the
    // per-body number `facingDepth` (+ Match's private writer `setFacingDepth`), the pure
    // module's two functions `facingFactor` / `facingCosine` and its two constants
    // `BF_DEPTH` / `BF_OFF_HEADING_FRACTION`. No other spelling exists in `src/**`.
    const SITES = [
      'src/sim/bodyFacing.ts', 'src/sim/Player.ts', 'src/sim/Match.ts', 'src/sim/League.ts',
      'src/sim/rendezvousRecovery.ts',
    ];
    const FAMILY = /bfFacingCost|setFacingDepth|facingDepth|facingFactor|facingCosine|BF_DEPTH|BF_OFF_HEADING_FRACTION/g;
    const FAMILY_I = new RegExp(FAMILY.source, 'gi');
    for (const f of srcFiles('src')) {
      const hay = readFileSync(f, 'utf8');
      if (count(hay, FAMILY) > 0) expect(SITES).toContain(f);
      if (!SITES.includes(f)) expect(hay).not.toMatch(FAMILY_I);
    }
    // PER-NEEDLE, PER-FILE COUNTS (docblocks included — a new mention is a new site to justify)
    const per = (hay: string, needle: string): number => count(hay, new RegExp(needle, 'g'));
    expect(per(matchSource, 'bfFacingCost')).toBe(5);
    expect(per(leagueSource, 'bfFacingCost')).toBe(1);
    expect(per(playerSource, 'bfFacingCost')).toBe(1);
    expect(per(bodyFacingSource, 'bfFacingCost')).toBe(1);
    expect(per(playerSource, 'facingDepth')).toBe(6);
    expect(per(matchSource, 'facingDepth')).toBe(2);
    expect(per(bodyFacingSource, 'facingDepth')).toBe(2);
    expect(per(rendezvousSource, 'facingDepth')).toBe(5);
    expect(per(matchSource, 'setFacingDepth')).toBe(4);
    expect(per(bodyFacingSource, 'facingFactor')).toBe(2);
    expect(per(playerSource, 'facingFactor')).toBe(2);
    expect(per(matchSource, 'facingFactor')).toBe(1);
    expect(per(bodyFacingSource, 'facingCosine')).toBe(1);
    expect(per(playerSource, 'facingCosine')).toBe(2);
    expect(per(bodyFacingSource, 'BF_DEPTH')).toBe(2);
    expect(per(matchSource, 'BF_DEPTH')).toBe(3);
    expect(per(playerSource, 'BF_DEPTH')).toBe(1);
    expect(per(bodyFacingSource, 'BF_OFF_HEADING_FRACTION')).toBe(4);
    expect(per(matchSource, 'BF_OFF_HEADING_FRACTION')).toBe(1);
    // ⭐ EVERY EXECUTABLE SITE, ENUMERATED BY ITS OWN LINE:
    // Match.ts — the config field, the readonly field, the initialiser, the import, the
    // writer and its THREE call sites (construction + the two substitution paths)
    expect(linesOf(matchSource, '  bfFacingCost?: boolean;')).toBe(1);
    expect(linesOf(matchSource, '  readonly bfFacingCost: boolean;')).toBe(1);
    expect(linesOf(matchSource, '    this.bfFacingCost = cfg.bfFacingCost ?? false;')).toBe(1);
    expect(linesOf(matchSource, "import { BF_DEPTH } from './bodyFacing';")).toBe(1);
    expect(linesOf(matchSource, '  private setFacingDepth(): void {')).toBe(1);
    expect(linesOf(matchSource, '    const depth = this.bfFacingCost ? BF_DEPTH : 0;')).toBe(1);
    expect(linesOf(matchSource,
      '    for (const t of this.teams) for (const p of t.players) p.facingDepth = depth;')).toBe(1);
    expect(count(matchSource, /this\.setFacingDepth\(\);/g)).toBe(3);
    expect(linesOf(matchSource, '    this.setFacingDepth();')).toBe(1); // the constructor's
    expect(count(matchSource,
      /this\.setFacingDepth\(\); \/\/ ⭐ BF T0: the new man carries this match's depth too/g,
    )).toBe(2); // the two substitution paths
    // League.ts — the matchFlags key union, and nowhere else
    expect(linesOf(leagueSource, "    | 'bfFacingCost'")).toBe(1);
    // Player.ts — the import, the field, and THE ONE SEAM (a branch and four statements)
    expect(linesOf(playerSource, "import { facingCosine, facingFactor } from './bodyFacing';"))
      .toBe(1);
    expect(linesOf(playerSource, '  facingDepth = 0;')).toBe(1);
    expect(count(playerSource, /if \(this\.facingDepth > 0\) \{/g)).toBe(1);
    expect(count(playerSource, /facingFactor\(/g)).toBe(1); // the ONE call (the import has none)
    expect(count(playerSource, /facingCosine\(/g)).toBe(1);
    // ⭐ THE FIX (#376 item 4(i)): the seam scales `tx`/`ty` in place, so the module scratch
    // vector is GONE and `dv` is `const` again — the shipped path's binding is byte-identical
    // to the pre-seam engine, and the whole shipped-path delta is the branch test.
    expect(count(playerSource, /bfIntent/g)).toBe(0);
    expect(linesOf(playerSource, '    const dv = this.desiredVel;')).toBe(1);
    expect(playerSource).not.toContain('let dv');
    // rendezvousRecovery.ts — the complete-shadow trio, so the write never escapes
    expect(linesOf(rendezvousSource, '  readonly facingDepth: number;')).toBe(1);
    expect(linesOf(rendezvousSource, '    facingDepth: player.facingDepth,')).toBe(1);
    expect(linesOf(rendezvousSource, '  player.facingDepth = snapshot.facingDepth;')).toBe(1);
    // the module — the two functions and the two constants, defined once each
    expect(count(bodyFacingSource, /export function facingFactor\(/g)).toBe(1);
    expect(count(bodyFacingSource, /export function facingCosine\(/g)).toBe(1);
    expect(count(bodyFacingSource, /export const BF_OFF_HEADING_FRACTION = /g)).toBe(1);
    expect(count(bodyFacingSource, /export const BF_DEPTH = /g)).toBe(1);
  });

  it('⭐ THE MODULE IS PURE: no imports, no state, no rng', () => {
    expect(count(bodyFacingSource, /^import /gm)).toBe(0);
    // the CODE, with every comment stripped (the docblock names `Match`/`Player` only to say
    // it knows nothing about them — the RC-T0 channel-closure idiom)
    const code = bodyFacingSource
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    for (const forbidden of [
      'Match', 'Player', 'rng', 'Rng', 'Math.random', 'let ', 'class ', 'require(', 'import',
    ]) {
      expect(`${forbidden}:${code.includes(forbidden)}`).toBe(`${forbidden}:false`);
    }
    // stateless: the same arguments give the same answer forever
    for (let i = 0; i < 64; i++) {
      const c = -1 + (2 * i) / 63;
      expect(facingFactor(c, BF_DEPTH)).toBe(facingFactor(c, BF_DEPTH));
    }
  });

  it('⭐ G-RNG: the law draws ZERO rng, armed or shut', () => {
    const m = matchOf(SEED_C, { world: W12, bf: true });
    for (let i = 0; i < 300; i++) m.step(DT);
    const before = (m.rng as unknown as { s: number }).s;
    let priced = 0;
    for (const t of m.teams) {
      for (const p of t.players) {
        facingFactor(facingCosine(p.heading.x, p.heading.y, 1, 0), p.facingDepth);
        priced += 1;
      }
    }
    expect(priced).toBe(2 * TEAM_SIZE);
    expect((m.rng as unknown as { s: number }).s).toBe(before);
    // and a genome stream is untouched by this slice: it adds NO gene at all
    const g = randomGenome(new Rng(900_002_450));
    expect(JSON.stringify(g)).not.toContain('facing');
    expect(JSON.stringify(g)).not.toContain('bfFacing');
  }, 60_000);

  it('⭐ the fingerprint of record is a literal in this suite, and the seam may not move it', () => {
    expect(FINGERPRINT_OF_RECORD).toBe(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
    const bare = new Match({ seed: 1, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.bfFacingCost).toBe(false);
    expect(bare.rcAnticipate).toBe(false);
    expect(bare.bkContactLaw).toBe(false);
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
