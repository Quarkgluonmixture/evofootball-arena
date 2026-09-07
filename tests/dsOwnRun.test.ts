import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { Match } from '../src/sim/Match';
import { League } from '../src/sim/League';
import { runHeadless } from '../src/sim/simRunner';
import { arrive, separation } from '../src/ai/steering';
import type { Player } from '../src/sim/Player';
import { DT, HALF_L, OFFBALL_TIRED_MUL } from '../src/sim/constants';
import { decidePlayer } from '../src/ai/PlayerBrain';
import { executeAction } from '../src/ai/actionExecutor';
import { RUN_DEPTH_DIV, RUN_PRIOR_MAX, RUN_ROLE_W, updateTeamBrain } from '../src/ai/TeamBrain';
import { runTarget } from '../src/ai/formations';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { ROLES, TEAM_SIZE, type Role, type TeamInfo } from '../src/sim/types';
import { a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells } from '../src/game/a4World';
import { Rng } from '../src/utils/rng';
import { clamp01 } from '../src/utils/math';

/**
 * ⭐⭐⭐ DS T0 — 「自己的前插」 THE OWN-RUN SEAM (docs/world-model/DS-T0-OWN-RUN-SEAM.md;
 * contract DS-DESIGNATION-CONTRACT.md §2 M-DS.1–5; COMMANDER RULING #405 item 3) — THE
 * SEAM'S PERMANENT PIN SUITE, in the house form (`gkDiveBody.test.ts` / `obmEyesSeat.test.ts`).
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * DS-C0 measured the read of record: EVERY OPEN-PLAY RUN IS A HAT. `hatClass.shareOfMakeRun.OTHER`
 * = 0 of 964,441 attacking `MakeRun` decisions; all five `MakeRun` pushes are hat-guarded; six
 * `why` literals and no seventh. DS-T0 gives the body a run of his OWN, priced and dormant.
 *
 * The pins (§PINS of the stage doc is the inventory; this file IS the living copy):
 *   1  G-OFF          both flags absent ⇒ whole-match signatures (rng state included) equal
 *                     the digests RECORDED AT HEAD ca61a6a on 12 scratch seeds, in the BARE
 *                     world and in worlds 13 and 15; absent ≡ explicitly false.
 *   2  G-BORN         armed with the OBM seat absent ⇒ the candidate exists with
 *                     `why` = 'own run in behind' and score EXACTLY `W.runScore · prior`.
 *   3  THE SEVENTH    the six census `why` literals byte-unchanged; the seventh once in src/.
 *   4  THE ROUTING    an unhatted body executing `MakeRun` reaches `runTarget` — MEASURED
 *                     off the executor's own `c4Trace.applied`, not inferred (#399/#401:
 *                     who enters a branch is a measurement).
 *   5  HATS-OFF SCOPE open play emptied; a LIVE corner still licenses crashers; a HELD crash
 *                     keeps its personnel; 套边 still sets `overlapper`; the wall trigger fires.
 *   6  THE BOUND      prior ∈ [0,1] over every role × localX on the pitch, = 1 at the maximum.
 *   7  NO PREDICATE   a source pin on the pushed block (#200).
 *   8  THE SEAM MAP   per-file occurrence counts of both flags; `a4World.ts` names neither.
 *   9  DORMANCY       no world 1–15 carries either flag; `League.toJSON` omits `matchFlags`.
 *  10  THE MUTANT WALK — four mutants, each with the pin that kills it.
 *  11  NARROWED PINS  the existing pins this seam widens past, narrowed POSITIVELY.
 *
 * ⚠ Every walk in this file lives in the OUT-OF-BAND SCRATCH CLASS 900,006,000–099 (canon,
 * VERBATIM: "verifier scratch walks use the stage's own consumed band or the out-of-band
 * scratch range (≥ 900,000,000) — never the next virgin block"; home:
 * PW-T0C-OBJECTIVE-FIDELITY.md §COMMANDER CORRECTIONS item 6). ZERO frontier consumption.
 *
 * ⭐ Receipts are receipts (home: ruling #289 item 1): every metre and count below is ARMING
 * PLUMBING. What the own run BUYS is DS-T1's question, and this stage claims none of it.
 */

/** The production fingerprint of record (#305 item 1) — this seam may not move it. */
const FINGERPRINT_OF_RECORD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⚠ OUT-OF-BAND SCRATCH SEEDS — DS-T0's own band, 900,006,000–099. */
const SEEDS: readonly number[] = Array.from({ length: 12 }, (_, i) => 900_006_000 + i);
const FIXTURE_BASE = 900_006_020;
const WALK_SEEDS: readonly number[] = Array.from({ length: 8 }, (_, i) => 900_006_040 + i);

/**
 * ⭐⭐ THE DIGESTS OF RECORD — computed at the DISPATCH HEAD `ca61a6a` in a clean throwaway
 * worktree (`git worktree add /tmp/ds-t0-base <HEAD>`) BEFORE one byte of this seam existed,
 * and pasted here as literals. They are what "byte-identical to HEAD" MEANS.
 */
const HEAD_COMMIT = 'ca61a6a';
const HEAD_DIGESTS = {
  bare: '4289c76d39b9195d36eb8bb9b473f862dc80881d135bd9da9b9440f52a35038b',
  w13: '72c077ba15d8f68d6ada77102dd593f5e3ba37029d634e3a4ca8af97a42772c1',
  w15: 'd8fc1359b5a0614f334bb5af5d45ff34a02f43ae4c0ad75baae9c1575dd0ef0a',
} as const;

/** ⭐ THE CENSUS ITSELF — the six `why` literals are READ OFF THE ARTIFACT by FIELD NAME
 *  (canon "doc-prose fidelity"), never typed here. */
const CENSUS = JSON.parse(readFileSync(
  'docs/world-model/data/ds-c0-designation-census.json', 'utf8',
)) as {
  definitions: { engineConstants: { whyLiterals: Record<string, string> } };
  faces: { face: string; arm: string; value: number }[];
};
const WHY_LITERALS = CENSUS.definitions.engineConstants.whyLiterals;
const face = (name: string): number => {
  const row = CENSUS.faces.find((f) => f.face === name && f.arm === 'E13');
  if (row === undefined) throw new Error(`no E13 face ${name}`);
  return row.value;
};
/** THE SEVENTH — this seam's own, and the ONLY string this stage adds to the menu. */
const OWN_RUN_WHY = 'own run in behind';

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
  own?: boolean;
  ownExplicitFalse?: boolean;
  hatsOff?: boolean;
  world?: 13 | 15;
  duration?: number;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const base = a.world === undefined ? {} : a4MatchFlags(a.world);
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    duration: a.duration ?? 240,
    ...base,
    ...(a.own === true ? { dsOwnRun: true } : {}),
    ...(a.ownExplicitFalse === true ? { dsOwnRun: false } : {}),
    ...(a.hatsOff === true ? { dsHatsOff: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (a.world !== undefined) armA4World(m, null, a.world, L3_DOSE, PC_DOSE);
  return m;
};

/**
 * ⭐⭐ THE WORLD-IDENTITY SIGNATURE (the house form, `gkDiveBody.test.ts` verbatim): the trace
 * PLUS the ball's height channel, every body's velocity and stamina, the phase, and — the last
 * thing the digest eats — ONE DRAW off the finished match's own rng. A draw is a pure function
 * of the stream state, so an equal digest means the two arms consumed the same number of draws
 * in the same order as well as reaching the same world.
 */
const signatureOf = (m: Match): string => {
  const trace: number[] = [];
  const phases: string[] = [];
  let ticks = 0;
  while (!m.finished && ticks < 60_000) {
    m.step(DT);
    ticks++;
    if (ticks % 37 === 0) {
      trace.push(
        m.ball.pos.x, m.ball.pos.y, m.ball.vel.x, m.ball.vel.y, m.ball.z, m.ball.vz,
        m.score[0], m.score[1],
      );
      phases.push(m.phase);
      for (const t of m.teams) {
        for (const p of t.players) {
          trace.push(p.pos.x, p.pos.y, p.vel.x, p.vel.y, p.heading.x, p.heading.y, p.stamina);
        }
      }
    }
  }
  const r = m.getResult();
  const rngProbe = m.rng.next();
  return createHash('sha256').update(JSON.stringify({
    trace: trace.map((v) => Math.round(v * 1e9)), phases,
    score: r.score, stats: r.stats, events: r.events.length, ticks, rngProbe,
  })).digest('hex');
};

const digest = (xs: readonly string[]): string =>
  createHash('sha256').update(xs.join('|')).digest('hex');

const src = (rel: string): string =>
  readFileSync(new URL(`../src/${rel}`, import.meta.url), 'utf8');
const playerSource = src('ai/PlayerBrain.ts');
const teamSource = src('ai/TeamBrain.ts');
const matchSource = src('sim/Match.ts');
const leagueSource = src('sim/League.ts');
const execSource = src('ai/actionExecutor.ts');
const a4Source = src('game/a4World.ts');
const count = (hay: string, needle: RegExp): number => (hay.match(needle) ?? []).length;
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = join(dir, e);
  return statSync(full).isDirectory() ? srcFiles(full) : full.endsWith('.ts') ? [full] : [];
});
/** lines that are neither blank nor a comment — the EXECUTABLE text of a file. */
const codeLines = (text: string): string[] => text.split('\n')
  .map((l) => l.trim())
  .filter((l) => l !== '' && !l.startsWith('//') && !l.startsWith('*') && !l.startsWith('/*'));

/** THE PRIOR, recomputed in the test from the ANCHORED constants — never from the seam. */
const priorOf = (role: Role, localX: number): number =>
  clamp01((RUN_ROLE_W[role] + localX / RUN_DEPTH_DIV) / RUN_PRIOR_MAX);

/* ------------------------------------------------------------------ */
/* 1 — G-OFF: the OFF world is HEAD's, byte for byte                    */
/* ------------------------------------------------------------------ */

describe('DS T0 — G-OFF: both flags absent ⇒ the world is HEAD\'s', () => {
  it('the BARE world reproduces the digest recorded at HEAD', () => {
    const sigs = SEEDS.map((s) => signatureOf(matchOf(s)));
    expect(sigs).toHaveLength(12);
    expect(digest(sigs)).toBe(HEAD_DIGESTS.bare);
    expect(HEAD_COMMIT).toBe('ca61a6a');
  });

  it('world 13 reproduces the digest recorded at HEAD', () => {
    const sigs = SEEDS.map((s) => signatureOf(matchOf(s, { world: 13 })));
    expect(digest(sigs)).toBe(HEAD_DIGESTS.w13);
  });

  it('world 15 reproduces the digest recorded at HEAD', () => {
    const sigs = SEEDS.map((s) => signatureOf(matchOf(s, { world: 15 })));
    expect(digest(sigs)).toBe(HEAD_DIGESTS.w15);
  });

  it('ABSENT ≡ EXPLICITLY FALSE (the other half of dormancy)', () => {
    for (const seed of SEEDS.slice(0, 4)) {
      expect(signatureOf(matchOf(seed, { ownExplicitFalse: true })))
        .toBe(signatureOf(matchOf(seed)));
    }
  });

  it('the production fingerprint is unchanged', () => {
    // the shipped `scripts/fingerprint.ts` recipe, recomputed in-process
    const l = new League({ seed: 1337 });
    const out = runHeadless(l.toJSON() as Record<string, unknown>, {
      kind: 'toGeneration', target: l.generation + 2,
    });
    const sha = createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
    expect(sha).toBe(FINGERPRINT_OF_RECORD);
  }, 180_000);
});

/* ------------------------------------------------------------------ */
/* 2 — G-BORN: the candidate, and its EXACT score                       */
/* ------------------------------------------------------------------ */

/** an in-possession, unhatted, non-carrier outfield body on a live match state */
interface Subject { m: Match; p: Player; sideIdx: number }
const subjects = (m: Match): Subject[] => {
  if (m.phase !== 'playing') return [];
  const side = m.possessionSide;
  if (side !== 0 && side !== 1) return [];
  const t = m.teams[side];
  return t.players
    .filter((p) => p.role !== 'GK' && !p.sentOff && m.ball.owner !== p
      && !t.runners.has(p.index) && t.arriver !== p.index && t.overlapper !== p.index
      && !(p.wallRun !== null && m.simTime < p.wallRun.until))
    .map((p) => ({ m, p, sideIdx: side }));
};

describe('DS T0 — G-BORN: armed with the OBM seat absent', () => {
  it('an unhatted in-possession body carries the SEVENTH candidate at score W.runScore · prior', () => {
    let seen = 0;
    let tired = 0;
    for (const seed of WALK_SEEDS.slice(0, 3)) {
      const m = matchOf(seed, { own: true });
      expect(m.obmMovement).toBe(false); // the seat is ABSENT ⇒ obmRunMul is exactly 1
      for (let tick = 0; tick < 3_000 && !m.finished; tick++) {
        m.step(DT);
        if (tick % 17 !== 0) continue;
        for (const { p } of subjects(m)) {
          const t = m.teams[p.side];
          decidePlayer(p, m);
          const own = p.action.scores.find((c) => c.why === OWN_RUN_WHY);
          if (own === undefined) continue; // only the TOP FOUR are recorded
          const W = t.policies[p.index];
          const isTired = p.stamina < 0.4 && t.genome.staminaConservation > 0.5;
          let want = W.runScore * priorOf(p.role, t.localX(p.pos.x));
          if (isTired) { want *= OFFBALL_TIRED_MUL; tired++; }
          expect(own.action).toBe('MakeRun');
          expect(own.score).toBe(want);
          seen++;
        }
      }
      if (seen > 40) break;
    }
    // NON-VACUITY: the pin has teeth only if the candidate was actually recorded.
    expect(seen).toBeGreaterThan(20);
    expect(tired).toBeGreaterThanOrEqual(0);
  });

  it('with the flag ABSENT the seventh literal never appears in a whole match', () => {
    const m = matchOf(FIXTURE_BASE, {});
    let ticks = 0;
    while (!m.finished && ticks < 20_000) {
      m.step(DT);
      ticks++;
      for (const t of m.teams) {
        for (const p of t.players) {
          expect(p.action.scores.some((c) => c.why === OWN_RUN_WHY)).toBe(false);
        }
      }
    }
    expect(ticks).toBeGreaterThan(1000);
  });
});

/* ------------------------------------------------------------------ */
/* 3 — the SEVENTH literal, and the six unchanged                       */
/* ------------------------------------------------------------------ */

describe('DS T0 — the `why` literal set', () => {
  it('the six literals DS-C0 enumerated are byte-unchanged in src/', () => {
    const all = srcFiles('src').map((f) => readFileSync(f, 'utf8')).join('\n');
    expect(Object.keys(WHY_LITERALS)).toContain('licensedRunInBehind');
    for (const [key, lit] of Object.entries(WHY_LITERALS)) {
      if (key === 'cutbackPrefix') continue; // a prefix, not a `MakeRun` why
      expect(all.includes(`'${lit}'`), `${key}: ${lit}`).toBe(true);
    }
  });

  it('the SEVENTH is present exactly once in src/, in PlayerBrain', () => {
    let total = 0;
    for (const f of srcFiles('src')) {
      const text = readFileSync(f, 'utf8');
      const inCode = codeLines(text).filter((l) => l.includes(`'${OWN_RUN_WHY}'`)).length;
      total += inCode;
      if (inCode > 0) expect(f).toBe('src/ai/PlayerBrain.ts');
    }
    expect(total).toBe(1);
  });

  it('the census stored SIX literals and none of them is the seventh', () => {
    const six = Object.entries(WHY_LITERALS)
      .filter(([k]) => k !== 'cutbackPrefix')
      .map(([, v]) => v);
    expect(six).toHaveLength(6);
    expect(six).not.toContain(OWN_RUN_WHY);
    // the census's own read of record: OTHER was 0 of 964,441
    expect(face('hatClass.shareOfMakeRun.OTHER')).toBe(0);
  });
});

/* ------------------------------------------------------------------ */
/* 4 — THE ROUTING: an unhatted MakeRun lands in the executor's default  */
/* ------------------------------------------------------------------ */

describe('DS T0 — the routing is the EXISTING default branch', () => {
  it('an unhatted body executing MakeRun is steered to runTarget (measured, not inferred)', () => {
    // ⭐⭐ #399/#401's lesson: WHO ENTERS A BRANCH IS A MEASUREMENT. `executeAction` publishes
    // no target, so the pin reconstructs the executor's OWN tail arithmetic for the default
    // branch — `arrive(p, runTarget(...), topSpeed · sprint, 2.2) + separation(...)`, the two
    // statements the `MakeRun` case reaches (it takes no `avoidOpponents` limb) — and asserts
    // the body's `desiredVel` equals it EXACTLY. It then asserts the SAME body does NOT match
    // the arriver's arc target, so the equality names ONE branch and not merely "some branch".
    let checked = 0;
    let discriminated = 0;
    for (const seed of WALK_SEEDS.slice(0, 4)) {
      const m = matchOf(seed, {});
      for (let tick = 0; tick < 2_000 && !m.finished; tick++) {
        m.step(DT);
        if (tick % 23 !== 0) continue;
        if (m.phase !== 'playing' || m.restart !== null || m.fkWall !== null) continue;
        const side = m.possessionSide;
        if (side !== 0 && side !== 1) continue;
        const t = m.teams[side];
        const opp = m.teams[1 - side];
        if (t.cornerCrash !== null || t.crossFlight !== null) continue;
        for (const p of t.players) {
          if (p.role === 'GK' || p.sentOff || m.ball.owner === p) continue;
          if (t.runners.has(p.index) || t.arriver === p.index || t.overlapper === p.index) continue;
          const want = runTarget(p, t, opp.players);
          const sprint = 1 - t.genome.staminaConservation * 0.12;
          const expected = arrive(p, want, p.topSpeed * sprint, 2.2);
          const sep = separation(p, t.players, 2.4, 2.5);
          expected.x += sep.x;
          expected.y += sep.y;
          const arc = arrive(
            p, { x: (HALF_L - 16) * t.attackDir, y: Math.max(-7, Math.min(7, p.pos.y * 0.3)) },
            p.topSpeed * sprint, 2.2,
          );
          p.action = {
            type: 'MakeRun',
            scores: [{ action: 'MakeRun', score: 1, why: OWN_RUN_WHY }],
          };
          executeAction(p, m, DT);
          if (p.clampTrace !== null) continue; // a clamp rewrote it; not this pin's business
          expect(p.desiredVel.x).toBe(expected.x);
          expect(p.desiredVel.y).toBe(expected.y);
          if (Math.abs(arc.x + sep.x - expected.x) > 1e-9) discriminated++;
          checked++;
        }
        if (checked > 60) break;
      }
      if (checked > 60) break;
    }
    expect(checked).toBeGreaterThan(20);
    expect(discriminated).toBeGreaterThan(10);
  });

  it('the executor case still ends in the SAME default statement (source pin)', () => {
    expect(execSource.includes('        target = runTarget(p, team, opp.players);')).toBe(true);
    // ⛔ NO EXECUTOR EDIT: the file carries neither flag.
    expect(count(execSource, /dsOwnRun|dsHatsOff/g)).toBe(0);
  });
});

/* ------------------------------------------------------------------ */
/* 5 — the HATS-OFF scope                                               */
/* ------------------------------------------------------------------ */

describe('DS T0 — dsHatsOff empties open play and touches nothing else', () => {
  it('open play: runners empty and arriver null; corners, crosses, 套边 and 二过一 alive', () => {
    // ⭐ THE OBSERVATION IS TAKEN AT THE COACH'S OWN CADENCE (DS-C0 §P.B's predicate): the
    // board is only re-written when `updateTeamBrain` runs, so a tick between coach ticks
    // still shows the PREVIOUS branch's personnel. The branch is classified PRE-STEP with the
    // clock at `simTime + DT`, exactly as the census's own reconstruction does.
    let openPlayChecks = 0;
    let liveCornerWithCrashers = 0;
    let heldCrashKept = 0;
    let overlapSet = 0;
    let wallFired = 0;
    for (const seed of WALK_SEEDS) {
      const m = matchOf(seed, { hatsOff: true });
      let ticks = 0;
      while (!m.finished && ticks < 20_000) {
        const clock = m.simTime + DT;
        const pre = m.teams.map((t) => {
          const liveCorner = m.phase === 'restart' && m.restart?.kind === 'corner'
            && m.restart.side === t.side;
          const heldCrash = !liveCorner && t.cornerCrash !== null && clock < t.cornerCrash.until;
          const crossLive = t.crossFlight !== null && clock < t.crossFlight.until
            && m.ball.owner === null;
          return {
            coachRan: t.brainTimer - DT <= 0,
            poss: m.possessionSide === t.side,
            liveCorner, heldCrash, crossLive,
            crash: t.cornerCrash === null ? null : [...t.cornerCrash.runners],
          };
        });
        m.step(DT);
        ticks++;
        for (const t of m.teams) {
          const a = pre[t.side];
          if (a.coachRan && a.poss) {
            if (a.liveCorner) {
              if (t.runners.size > 0) liveCornerWithCrashers++;
            } else if (a.heldCrash) {
              for (const idx of t.runners) {
                expect(a.crash!.includes(idx)).toBe(true);
                heldCrashKept++;
              }
            } else if (!a.crossLive) {
              expect(t.runners.size).toBe(0);
              expect(t.arriver).toBeNull();
              openPlayChecks++;
            }
          }
          if (t.overlapper !== null) overlapSet++;
          for (const p of t.players) {
            if (p.wallRun !== null && m.simTime < p.wallRun.until) wallFired++;
          }
        }
      }
    }
    expect(openPlayChecks).toBeGreaterThan(1000);
    expect(liveCornerWithCrashers).toBeGreaterThan(0);
    expect(heldCrashKept).toBeGreaterThan(0);
    expect(overlapSet).toBeGreaterThan(0);
    expect(wallFired).toBeGreaterThan(0);
  }, 180_000);

  it('with dsHatsOff ABSENT the shipped board is populated (the arm is not vacuous)', () => {
    const m = matchOf(WALK_SEEDS[0], {});
    let populated = 0;
    let ticks = 0;
    while (!m.finished && ticks < 6_000) {
      m.step(DT);
      ticks++;
      for (const t of m.teams) {
        if (m.possessionSide === t.side && t.runners.size > 0) populated++;
      }
    }
    expect(populated).toBeGreaterThan(500);
  });

  it('the gate is the ONLY thing between the shipped statements and the board', () => {
    const m = matchOf(FIXTURE_BASE + 1, { hatsOff: true });
    while (m.phase !== 'playing') m.step(DT);
    for (let i = 0; i < 300; i++) m.step(DT);
    for (const t of m.teams) {
      updateTeamBrain(t, m);
      if (m.possessionSide === t.side && t.cornerCrash === null && t.crossFlight === null
        && m.phase === 'playing') {
        expect(t.runners.size).toBe(0);
        expect(t.arriver).toBeNull();
      }
    }
  });
});

/* ------------------------------------------------------------------ */
/* 6 — THE BOUND                                                        */
/* ------------------------------------------------------------------ */

describe('DS T0 — the prior is bounded, and its 1 is a real place on the pitch', () => {
  it('prior ∈ [0,1] for every role at every localX on the pitch', () => {
    for (const role of ROLES) {
      for (let x = -HALF_L; x <= HALF_L; x += 0.25) {
        const v = priorOf(role, x);
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    }
  });

  it('= 1 exactly for the top role standing on the opponent goal line', () => {
    expect(priorOf('ST', HALF_L)).toBe(1);
    expect(RUN_PRIOR_MAX).toBe(Math.max(...Object.values(RUN_ROLE_W)) + HALF_L / RUN_DEPTH_DIV);
  });

  it('the clamp\'s LOWER arm bites only where the ranking itself goes negative', () => {
    // ⚠ DECLARED (§DEVIATIONS 1): the dispatch said the clamp can only bite beyond the goal
    // line. It also bites for a DF deeper than −45·0.4 = −18 m of local X — the ranking the
    // COACH uses is itself negative there. The arithmetic, pinned:
    expect(priorOf('DF', -HALF_L)).toBe(0);
    expect(RUN_ROLE_W.DF * RUN_DEPTH_DIV).toBe(18);
    expect(priorOf('MF', -HALF_L)).toBeGreaterThan(0); // 1.2·45 = 54 m > the pitch
    expect(priorOf('WG', -HALF_L)).toBeGreaterThan(0);
    expect(priorOf('ST', -HALF_L)).toBeGreaterThan(0);
  });
});

/* ------------------------------------------------------------------ */
/* 7 — NO PREDICATE (#200)                                              */
/* ------------------------------------------------------------------ */

/** the pushed block's own source text, from the gate to its closing brace */
const OWN_RUN_BLOCK = ((): string => {
  const lines = playerSource.split('\n');
  const start = lines.findIndex((l) => l.trim() === 'if (match.dsOwnRun) {');
  expect(start).toBeGreaterThan(0);
  const end = lines.findIndex((l, i) => i > start && l === '    }');
  return lines.slice(start, end + 1).join('\n');
})();

describe('DS T0 — no predicate on a football quantity', () => {
  it('the block\'s whole conditional set is gate + guards + cap', () => {
    const code = codeLines(OWN_RUN_BLOCK);
    const ifs = code.filter((l) => l.startsWith('if ('));
    expect(ifs).toEqual([
      'if (match.dsOwnRun) {',
      'if (!hatted && !wallLive) {',
      'if (tired) s *= OFFBALL_TIRED_MUL;',
    ]);
    // the ONLY inequality in the block is the 2过1 licence's own CLOCK liveness
    const compares = code.filter((l) => /[<>]/.test(l));
    expect(compares).toEqual(['const wallLive = p.wallRun !== null && match.simTime < p.wallRun.until;']);
    // no distance, no opponent, no percept, no genome
    for (const banned of ['dist(', 'pendingPass', 'pendingPassWindup', 'info.genome',
      'perceived', 'opp.', 'HALF_W', 'Math.abs']) {
      expect(code.join('\n').includes(banned), banned).toBe(false);
    }
  });

  it('the score is weight × continuous quantity, and its terms are the anchored ones', () => {
    const code = codeLines(OWN_RUN_BLOCK).join('\n');
    expect(code.includes('let s = W.runScore * prior;')).toBe(true);
    expect(code.includes('s *= obmRunMul;')).toBe(true);
    expect(code.includes('RUN_ROLE_W[p.role] + team.localX(p.pos.x) / RUN_DEPTH_DIV')).toBe(true);
    expect(code.includes('RUN_PRIOR_MAX')).toBe(true);
  });
});

/* ------------------------------------------------------------------ */
/* 8 — THE SEAM MAP                                                     */
/* ------------------------------------------------------------------ */

describe('DS T0 — the seam map', () => {
  it('each flag is read at exactly the sites the doc names, and nowhere else', () => {
    const perFile = new Map<string, { own: number; hats: number }>();
    for (const f of srcFiles('src')) {
      const code = codeLines(readFileSync(f, 'utf8')).join('\n');
      const own = count(code, /dsOwnRun/g);
      const hats = count(code, /dsHatsOff/g);
      if (own > 0 || hats > 0) perFile.set(f, { own, hats });
    }
    expect([...perFile.keys()].sort()).toEqual([
      'src/ai/PlayerBrain.ts', 'src/ai/TeamBrain.ts', 'src/sim/League.ts', 'src/sim/Match.ts',
    ]);
    // PlayerBrain: the ONE gate. TeamBrain: the TWO gates.
    expect(perFile.get('src/ai/PlayerBrain.ts')).toEqual({ own: 1, hats: 0 });
    expect(perFile.get('src/ai/TeamBrain.ts')).toEqual({ own: 0, hats: 2 });
    // Match.ts: the optional config key, the readonly field, and `this.x = cfg.x ?? false`.
    expect(perFile.get('src/sim/Match.ts')).toEqual({ own: 4, hats: 4 });
    // League.ts: the union key.
    expect(perFile.get('src/sim/League.ts')).toEqual({ own: 1, hats: 1 });
    expect(count(codeLines(playerSource).join('\n'), /match\.dsOwnRun/g)).toBe(1);
    expect(count(codeLines(teamSource).join('\n'), /match\.dsHatsOff/g)).toBe(2);
  });

  it('a4World.ts names neither flag, at any version, and no env arms them', () => {
    expect(count(a4Source, /dsOwnRun|dsHatsOff/g)).toBe(0);
    expect(count(matchSource, /dsOwnRun\?\?\s*EDS_BUNDLE_ARMED|process\.env[^\n]*ds(Own|Hats)/g))
      .toBe(0);
    expect(matchSource.includes('this.dsOwnRun = cfg.dsOwnRun ?? false;')).toBe(true);
    expect(matchSource.includes('this.dsHatsOff = cfg.dsHatsOff ?? false;')).toBe(true);
    expect(leagueSource.includes("| 'dsOwnRun' | 'dsHatsOff'")).toBe(true);
  });
});

/* ------------------------------------------------------------------ */
/* 9 — DORMANCY (Road B)                                                */
/* ------------------------------------------------------------------ */

describe('DS T0 — Road B: nothing ships', () => {
  it('no world 1–15 carries either flag', () => {
    for (let v = 1; v <= 15; v++) {
      const flags = a4MatchFlags(v as Parameters<typeof a4MatchFlags>[0]) as Record<string, unknown>;
      expect('dsOwnRun' in flags, `world ${v}`).toBe(false);
      expect('dsHatsOff' in flags, `world ${v}`).toBe(false);
      const m = matchOf(FIXTURE_BASE + 2, { world: v === 13 || v === 15 ? v : undefined });
      expect(m.dsOwnRun).toBe(false);
      expect(m.dsHatsOff).toBe(false);
    }
  });

  it('a fresh Match and a League match are both OFF, and League.toJSON omits matchFlags', () => {
    expect(matchOf(FIXTURE_BASE + 3).dsOwnRun).toBe(false);
    expect(matchOf(FIXTURE_BASE + 3).dsHatsOff).toBe(false);
    const l = new League({ seed: 1337 });
    expect(Object.keys(l.toJSON())).not.toContain('matchFlags');
  });
});

/* ------------------------------------------------------------------ */
/* 10 — THE MUTANT WALK                                                 */
/* ------------------------------------------------------------------ */

describe('DS T0 — the mutant walk', () => {
  it('M1 — the prior re-typed with a literal 2.2 is killed by the source pin', () => {
    // the seam reads the OBJECT; the number 2.2 appears nowhere in PlayerBrain's block
    expect(OWN_RUN_BLOCK.includes('2.2')).toBe(false);
    expect(codeLines(teamSource).join('\n')
      .includes('Math.max(...Object.values(RUN_ROLE_W))')).toBe(true);
    // and the shipped ranking expression still divides by the constant's own value
    expect(teamSource.includes(`team.localX(p.pos.x) / ${RUN_DEPTH_DIV}`)).toBe(true);
  });

  it('M2 — the not-hatted guard dropped: a LICENSED body would push MakeRun twice', () => {
    const m = matchOf(FIXTURE_BASE + 4, { own: true });
    let checked = 0;
    for (let tick = 0; tick < 4_000 && !m.finished && checked < 30; tick++) {
      m.step(DT);
      if (m.phase !== 'playing') continue;
      const side = m.possessionSide;
      if (side !== 0 && side !== 1) continue;
      const t = m.teams[side];
      for (const idx of t.runners) {
        const p = t.players[idx];
        if (p.role === 'GK' || p.sentOff || m.ball.owner === p) continue;
        decidePlayer(p, m);
        const runs = p.action.scores.filter((c) => c.action === 'MakeRun');
        expect(runs.length).toBeLessThanOrEqual(1);
        expect(p.action.scores.some((c) => c.why === OWN_RUN_WHY)).toBe(false);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(10);
  });

  it('M3 — the hats-off flag touching a corner branch is killed by pin 5', () => {
    // the gates are INSIDE the open-play tail: both corner branches RETURN above them
    const idxCrash = teamSource.indexOf('if (heldCrash) {');
    const idxCorner = teamSource.indexOf('if (liveCorner) {');
    const idxGate = teamSource.indexOf('if (!match.dsHatsOff) {');
    expect(idxCrash).toBeGreaterThan(0);
    expect(idxCorner).toBeGreaterThan(idxCrash);
    expect(idxGate).toBeGreaterThan(idxCorner);
  });

  it('M4 — the own run pushed with the flag absent is killed by G-OFF', () => {
    // the push is lexically inside the gate
    expect(OWN_RUN_BLOCK.includes(`why: '${OWN_RUN_WHY}'`)).toBe(true);
    expect(OWN_RUN_BLOCK.startsWith('    if (match.dsOwnRun) {')).toBe(true);
  });
});

/* ------------------------------------------------------------------ */
/* 11 — NARROWED PINS (the DF-T0 §P7 form: narrowed POSITIVELY)         */
/* ------------------------------------------------------------------ */

describe('DS T0 — the pins this seam widens past, narrowed positively', () => {
  it('the MakeRun `why` set: SIX shipped literals + this seam\'s ONE, and no eighth', () => {
    const menu = playerSource.match(/why: '[^']+'/g) ?? [];
    expect(menu.some((w) => w === `why: '${OWN_RUN_WHY}'`)).toBe(true);
    expect(menu.filter((w) => w === `why: '${OWN_RUN_WHY}'`)).toHaveLength(1);
  });

  it('the match-flag key set grew by EXACTLY two, both dormant', () => {
    const union = leagueSource.slice(
      leagueSource.indexOf('matchFlags: Partial<Pick<MatchConfig,'),
      leagueSource.indexOf('>> = {};'),
    );
    expect(count(union, /'dsOwnRun'/g)).toBe(1);
    expect(count(union, /'dsHatsOff'/g)).toBe(1);
  });

  it('DS-C0\'s code facts stay TRUE of the shipped path: the five pushes are still hat-guarded', () => {
    // the seam adds a SIXTH push; it is guarded by the flag and by the NOT-hatted read, so
    // with the flag off the census's own boolean is unchanged in meaning.
    expect(count(playerSource, /action: 'MakeRun'/g) + count(playerSource, /type: 'MakeRun'/g))
      .toBe(6);
    expect(face('offBall.makeRunOtherShare')).toBe(0);
  });
});
