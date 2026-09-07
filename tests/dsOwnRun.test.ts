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
import {
  RUN_DEPTH_DIV, RUN_PRIOR_MAX, RUN_ROLE_W, runnerCount, updateTeamBrain,
} from '../src/ai/TeamBrain';
import { runTarget } from '../src/ai/formations';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { ROLES, TEAM_SIZE, type Role, type TeamInfo, type TeamMode } from '../src/sim/types';
import type { Team } from '../src/sim/Team';
import type { PerceptionMemory, PerceptionSnapshot } from '../src/ai/perceptionSnapshot';
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

/**
 * ⚠ OUT-OF-BAND SCRATCH SEEDS. DS-T0's own pins keep DS-T0's own consumed band
 * (900,006,020 fixtures · 900,006,040–047 walks); everything DS-T0b adds — and the
 * RE-RECORDED G-OFF band — lives in **900,006,400–499**, the band ruling #407 item 5(vii)
 * gives this stage. Canon, VERBATIM: "verifier scratch walks use the stage's own consumed
 * band or the out-of-band scratch range (≥ 900,000,000) — never the next virgin block".
 */
const SEEDS: readonly number[] = Array.from({ length: 12 }, (_, i) => 900_006_400 + i);
const FIXTURE_BASE = 900_006_020;
const WALK_SEEDS: readonly number[] = Array.from({ length: 8 }, (_, i) => 900_006_040 + i);
/** DS-T0b's own fixture band — the hand-built scenes and the pull counters. */
const B_BASE = 900_006_440;

/**
 * ⭐⭐ THE DIGESTS OF RECORD — RE-RECORDED FOR DS-T0b at the DISPATCH HEAD `b05d3d9`
 * (ruling #407's own wrap-up commit) in a clean throwaway worktree
 * (`git worktree add /tmp/ds-t0b-base b05d3d9`) BEFORE one byte of the restraint slice
 * existed, on the 12 seeds 900,006,400–411, and pasted here as literals. They are what
 * "byte-identical to the dispatch HEAD" MEANS. ⭐ DS-T0's own digests (recorded at `ca61a6a`
 * on 900,006,000–011) are NOT deleted knowledge: they were the same property at the previous
 * head, and this stage re-proves it at ITS head on ITS band.
 *
 * `w12x4` / `w14x4` are the FIRST FOUR seeds only — DS-T0 checked worlds 12 and 14
 * out-of-suite; DS-T0b brings them INTO the suite (ruling #407's "worlds 12–15
 * byte-identical") at four seeds each, which is what the wall clock affords.
 */
const HEAD_COMMIT = 'b05d3d9';
const HEAD_DIGESTS = {
  bare: '16a2fca6b41000d43acfbb885c17047b80afcc6f67db3ec52a9ddee1ca1caa8c',
  w13: 'e68bc4f149cb46191954183b4ea846ae5da88f10e0e6c27c2a7016bdb80cdd22',
  w15: '5fd8fe71f93302c4f2b70a247bae8b49c565a6aaea154469460e4407b669f5ca',
  w12x4: '2ce9b4353453bfd853c483fbf3c33c93ca8835605cbafbe11f294b30abe95374',
  w14x4: '600bdd61880c49072dee2eefe084d0bf45b742d5445e816cf26ef6bc96cfb91f',
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
  /** DS-T0b: the percept trunk, hand-armed (the own run needs eyes — §PINS-B 9(a)). */
  percept?: boolean;
  /** DS-T0b: E3's reference path — `perceivedSnapshot` materialises the memory AS GIVEN. */
  eager?: boolean;
  /** DS-T0b: the OBM seat, for the shared-vs-second-pull pin. */
  obm?: boolean;
  ownExplicitFalse?: boolean;
  hatsOff?: boolean;
  world?: 12 | 13 | 14 | 15;
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
    ...(a.percept === true ? { edsPerceivedDefence: true } : {}),
    ...(a.eager === true ? { edsEagerPerception: true } : {}),
    ...(a.obm === true ? { obmMovement: true } : {}),
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

/**
 * ⭐⭐ DS T0b — THE COACH'S COUNT EXPRESSION AS IT STOOD AT THE DISPATCH HEAD `b05d3d9`,
 * recorded here VERBATIM (the two source lines of `assignRunners`, joined). The seam MOVED
 * this expression into `runnerCount`; the only transformation allowed is stripping the
 * receiver prefixes, and `stripReceivers` below is that transformation, applied to BOTH
 * sides of the pin. ⛔ Nothing re-types the numbers: this literal is a RECORDING of what the
 * source said, in the sense the HEAD digests are.
 */
const SHIPPED_COUNT_EXPR_AT_HEAD = `      (team.mode === 'CounterAttack' || team.genome.tempo > 0.65 ? 2 : 1) +
      (team.mentality.urgency > 0.65 ? 1 : 0);`;
const stripReceivers = (text: string): string => text
  .replace(/team\.genome\./g, '')
  .replace(/team\.mentality\./g, '')
  .replace(/team\./g, '')
  .replace(/\s+/g, ' ')
  .replace(/;\s*$/, '')
  .trim();

/**
 * THE COUNT, RE-IMPLEMENTED in the test from the recorded expression — the frozen reference
 * the moved function is measured against on the full corner grid. This copy is DELIBERATE
 * (it is the pin's reference), and the source pin above proves the shipped one and the moved
 * one are the same bytes.
 */
const COUNT_REF = (mode: TeamMode, tempo: number, urgency: number): number =>
  (mode === 'CounterAttack' || tempo > 0.65 ? 2 : 1) + (urgency > 0.65 ? 1 : 0);

/**
 * ⭐⭐ THE RESTRAINT, RE-DERIVED in the test from the body's OWN snapshot and the ROSTER —
 * M-DS.6(b)/(c) written out independently of the seam (the seam is never read back). The
 * observer's own `topSpeed` is the normaliser; the perceived carrier, the keeper, a sent-off
 * body and the observer himself are excluded.
 */
const restraintOf = (p: Player, t: Team, snap: PerceptionSnapshot): number => {
  const ownerGid = snap.ball === null ? null : snap.ball.ownerGid;
  let mates = 0;
  for (const mate of t.players) {
    if (mate.gid === p.gid || mate.gid === ownerGid) continue;
    if (mate.role === 'GK' || mate.sentOff) continue;
    for (const body of snap.players) {
      if (body.gid !== mate.gid || body.side !== p.side) continue;
      mates += clamp01((body.vel.x * t.attackDir) / p.topSpeed);
    }
  }
  return clamp01(1 - mates / COUNT_REF(t.mode, t.genome.tempo, t.mentality.urgency));
};

/* ------------------------------------------------------------------ */
/* 1 — G-OFF: the OFF world is HEAD's, byte for byte                    */
/* ------------------------------------------------------------------ */

describe('DS T0 — G-OFF: both flags absent ⇒ the world is HEAD\'s', () => {
  it('the BARE world reproduces the digest recorded at HEAD', () => {
    const sigs = SEEDS.map((s) => signatureOf(matchOf(s)));
    expect(sigs).toHaveLength(12);
    expect(digest(sigs)).toBe(HEAD_DIGESTS.bare);
    expect(HEAD_COMMIT).toBe('b05d3d9');
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

  it('worlds 12 and 14 reproduce the digests recorded at HEAD (4 seeds each)', () => {
    const four = SEEDS.slice(0, 4);
    expect(digest(four.map((s) => signatureOf(matchOf(s, { world: 12 })))))
      .toBe(HEAD_DIGESTS.w12x4);
    expect(digest(four.map((s) => signatureOf(matchOf(s, { world: 14 })))))
      .toBe(HEAD_DIGESTS.w14x4);
  }, 180_000);

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

/**
 * ⭐⭐ DS T0b NARROWING (§PINS-B 9(a), declared): DS-T0's G-BORN walked the BARE world. The
 * restraint slice reads the body's OWN percept, and in a world with no percept trunk
 * `perceivedSnapshot` returns null (`refreshPerception` is gated on
 * `edsPerceivedDefence || edsPerceivedChoice || stationEye` — the OBM seat's own
 * born-blind note), so THERE IS NO OWN RUN THERE AT ALL. The pin is narrowed POSITIVELY: the
 * exact-score walk moves to the PERCEPT-ARMED world 13 (DS-T1's own control substrate) and
 * the bare world gains its own explicit pin that the candidate never appears.
 */
describe('DS T0b — G-BORN′: armed with the OBM seat absent, in a percept-armed world', () => {
  it('an unhatted in-possession body scores EXACTLY W.runScore · prior · restraint', () => {
    let seen = 0;
    let tired = 0;
    let restrained = 0;
    for (const seed of SEEDS.slice(0, 3)) {
      const m = matchOf(seed, { own: true, world: 13 });
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
          // the restraint RE-DERIVED from the body's own snapshot (the pull is idempotent
          // inside a tick — pinned below), never read back off the seam
          const snap = m.perceivedSnapshot(p);
          expect(snap).not.toBeNull();
          const restraint = restraintOf(p, t, snap!);
          if (restraint < 1) restrained++;
          let want = W.runScore * priorOf(p.role, t.localX(p.pos.x)) * restraint;
          if (isTired) { want *= OFFBALL_TIRED_MUL; tired++; }
          expect(own.action).toBe('MakeRun');
          expect(own.score).toBe(want);
          seen++;
        }
      }
      if (seen > 40) break;
    }
    // NON-VACUITY: the pin has teeth only if the candidate was actually recorded, AND only
    // if the new factor was ever anything but 1 (a restraint that never bites is not pinned).
    expect(seen).toBeGreaterThan(20);
    expect(restrained).toBeGreaterThan(0);
    expect(tired).toBeGreaterThanOrEqual(0);
  }, 120_000);

  it('in a world with NO percept trunk the own run does not exist (the declared narrowing)', () => {
    const m = matchOf(B_BASE + 1, { own: true });
    expect(m.edsPerceivedDefence).toBe(false);
    expect(m.edsPerceivedChoice).toBe(false);
    let ticks = 0;
    let blind = 0;
    while (!m.finished && ticks < 3_000) {
      m.step(DT);
      ticks++;
      for (const t of m.teams) {
        for (const p of t.players) {
          expect(p.action.scores.some((c) => c.why === OWN_RUN_WHY)).toBe(false);
          if (p.role !== 'GK' && !p.sentOff && m.perceivedSnapshot(p) === null) blind++;
        }
      }
    }
    expect(blind).toBeGreaterThan(1000);
  }, 120_000);

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

describe('DS T0b — no predicate on a football quantity (the amended block)', () => {
  it('the block\'s whole conditional set is gate + guards (identity) + cap', () => {
    const code = codeLines(OWN_RUN_BLOCK);
    const ifs = code.filter((l) => l.startsWith('if ('));
    // ⭐ NARROWED POSITIVELY (§PINS-B 9(b)): DS-T0's three `if`s become NINE, and every new
    // one is an IDENTITY test — a gid, a side, a role, a null — never a football quantity.
    expect(ifs).toEqual([
      'if (match.dsOwnRun) {',
      'if (!hatted && !wallLive) {',
      'if (ownerGid !== null && ownerGid !== p.gid) {',
      'if (mate.gid === ownerGid) carrierIsMate = true;',
      'if (snapshot !== null && carrierIsMate) {',
      'if (mate.gid === p.gid || mate.gid === ownerGid) continue;',
      "if (mate.role === 'GK' || mate.sentOff) continue;",
      'if (body.gid !== mate.gid || body.side !== p.side) continue;',
      'if (tired) s *= OFFBALL_TIRED_MUL;',
    ]);
    // the ONLY inequality in the block is STILL the 2过1 licence's own CLOCK liveness — the
    // count's own comparisons are the coach's expression, moved whole, and live in TeamBrain
    const compares = code.filter((l) => /[<>]/.test(l));
    expect(compares).toEqual(['const wallLive = p.wallRun !== null && match.simTime < p.wallRun.until;']);
    // no distance, no truth ball, no opponent, no genome
    for (const banned of ['dist(', 'match.ball', 'ball.owner', 'pendingPass',
      'pendingPassWindup', 'info.genome', 'opp.', 'allPlayers', 'HALF_W', 'Math.abs']) {
      expect(code.join('\n').includes(banned), banned).toBe(false);
    }
  });

  it('the ONLY `match` members the block touches are the flag, the clock and the percept', () => {
    const code = codeLines(OWN_RUN_BLOCK).join('\n');
    const members = [...new Set((code.match(/match\.[A-Za-z]+/g) ?? []))].sort();
    expect(members).toEqual(['match.dsOwnRun', 'match.perceivedSnapshot', 'match.simTime']);
    // every other body enters through the SNAPSHOT's copies or through the ROSTER's identity
    // fields — never through a truth `pos` or `vel`
    expect([...new Set((code.match(/[A-Za-z]+\.vel(\.[xy])?/g) ?? []))]).toEqual(['body.vel.x']);
    expect([...new Set((code.match(/[A-Za-z]+\.pos(\.[xy])?/g) ?? []))]).toEqual(['p.pos.x']);
    const mateReads = [...new Set((code.match(/mate\.[A-Za-z]+/g) ?? []))].sort();
    expect(mateReads).toEqual(['mate.gid', 'mate.role', 'mate.sentOff']);
    const bodyReads = [...new Set((code.match(/body\.[A-Za-z]+/g) ?? []))].sort();
    expect(bodyReads).toEqual(['body.gid', 'body.side', 'body.vel']);
  });

  it('the score is weight × continuous quantity, and its terms are the anchored ones', () => {
    const code = codeLines(OWN_RUN_BLOCK).join('\n');
    expect(code.includes('let s = W.runScore * prior * restraint;')).toBe(true);
    expect(code.includes('s *= obmRunMul;')).toBe(true);
    expect(code.includes('RUN_ROLE_W[p.role] + team.localX(p.pos.x) / RUN_DEPTH_DIV')).toBe(true);
    expect(code.includes('RUN_PRIOR_MAX')).toBe(true);
    expect(code.includes('const restraint = clamp01(1 - runningMates / runnerCount(')).toBe(true);
    expect(code.includes('runningMates += clamp01((body.vel.x * team.attackDir) / p.topSpeed);'))
      .toBe(true);
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

/* ================================================================== */
/* DS T0b — THE RESTRAINT SLICE (ruling #407 item 5). §PINS-B.          */
/*                                                                     */
/*  B1  THE COUNT FUNCTION  the code-move: source pin + the full        */
/*                          (mode × tempo × urgency) corner grid.       */
/*  B2  G-BORN′ EXACT       hand-built scenes: no mate running ⇒        */
/*                          `W.runScore · prior`; `count` mates at top  */
/*                          speed ⇒ exactly 0; half ⇒ exactly ·0.5.     */
/*  B3  THE STATE GUARD     no candidate when the PERCEIVED ball is     */
/*                          loose, an opponent's, his own, or unseen.   */
/*  B4  RUNNING MATES       forward · backward · sideways · keeper ·    */
/*                          sent off · the carrier · himself.           */
/*  B5  PERCEPT-ONLY        the truth says one thing, his eyes another  */
/*                          — the run follows HIS EYES.                 */
/*  B6  THE PULL            zero pulls with the flag absent; exactly    */
/*                          one armed; two with the OBM seat armed      */
/*                          (the DECLARED second pull), and idempotent. */
/*  B7  THE MUTANT WALK     five mutants, each with its killing pin.    */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/* B1 — the coach's count, CODE-MOVED and never re-typed               */
/* ------------------------------------------------------------------ */

describe('DS T0b — the count is the coach\'s expression, moved', () => {
  it('the moved function carries the shipped expression byte-for-byte (receivers stripped)', () => {
    const body = teamSource.slice(
      teamSource.indexOf('export function runnerCount('),
      teamSource.indexOf('function assignRunners('),
    );
    const ret = body.slice(body.indexOf('return ') + 'return '.length, body.indexOf(';', body.indexOf('return ')));
    expect(stripReceivers(ret)).toBe(stripReceivers(SHIPPED_COUNT_EXPR_AT_HEAD));
    // …and the SHIPPED call site now CALLS it — the expression exists ONCE in src/
    expect(teamSource.includes(
      'const count = runnerCount(team.mode, team.genome.tempo, team.mentality.urgency);',
    )).toBe(true);
    // the count's own comparison exists EXACTLY ONCE in TeamBrain — the coach's copy is gone
    expect(count(codeLines(teamSource).join('\n'), /=== 'CounterAttack' \|\| /g)).toBe(1);
    expect(count(codeLines(teamSource).join('\n'), /0\.65/g)).toBe(2); // both are the count's
    expect(codeLines(OWN_RUN_BLOCK).join('\n').includes('0.65')).toBe(false);
  });

  it('it equals the shipped expression on EVERY corner of the grid, values 1 · 2 · 3', () => {
    const modes: TeamMode[] = ['BuildUp', 'Attack', 'Defend', 'Press', 'CounterAttack', 'ResetShape'];
    const values = new Set<number>();
    for (const mode of modes) {
      for (const tempo of [0, 0.65, 0.650001, 1]) {
        for (const urgency of [0, 0.65, 0.650001, 1]) {
          const got = runnerCount(mode, tempo, urgency);
          expect(got, `${mode}/${tempo}/${urgency}`).toBe(COUNT_REF(mode, tempo, urgency));
          values.add(got);
        }
      }
    }
    // NON-VACUITY: every value the coach's count can take was actually produced
    expect([...values].sort()).toEqual([1, 2, 3]);
  });

  it('the shipped board is unchanged by the move (the arm is not vacuous)', () => {
    const m = matchOf(B_BASE + 2, {});
    let populated = 0;
    let ticks = 0;
    while (!m.finished && ticks < 4_000) {
      m.step(DT);
      ticks++;
      for (const t of m.teams) {
        if (m.possessionSide === t.side && t.runners.size > 0) populated++;
      }
    }
    expect(populated).toBeGreaterThan(300);
  });
});

/* ------------------------------------------------------------------ */
/* B2–B5 — the hand-built scenes                                       */
/* ------------------------------------------------------------------ */

/** A staged in-possession moment: an unhatted, untired, non-carrier outfield body. */
interface Scene { m: Match; p: Player; t: Team; W: { runScore: number } }
const stage = (seed: number, extra: Arm = {}): Scene => {
  const m = matchOf(seed, { own: true, percept: true, eager: true, ...extra });
  for (let ticks = 0; ticks < 8_000; ticks++) {
    m.step(DT);
    if (m.phase !== 'playing') continue;
    const side = m.possessionSide;
    if (side !== 0 && side !== 1) continue;
    const t = m.teams[side];
    for (const p of t.players) {
      if (p.role === 'GK' || p.sentOff || m.ball.owner === p) continue;
      if (p.stamina < 0.4 && t.genome.staminaConservation > 0.5) continue; // keep `tired` out
      // the board is cleared BY HAND so the scene is the law's, not the coach's
      t.runners.clear();
      t.arriver = null;
      t.overlapper = null;
      p.wallRun = null;
      return { m, p, t, W: t.policies[p.index] };
    }
  }
  throw new Error('no staged subject');
};

/**
 * Write ONE body's perception memory by hand. With `edsEagerPerception` armed
 * `perceivedSnapshot` materialises the memory AS GIVEN (it does not re-run the recorder
 * trunk), so this IS the snapshot the seam will read.
 */
const inject = (
  m: Match, p: Player, ownerGid: number | null,
  vel: ReadonlyMap<number, { x: number; y: number }>,
  seesBall = true,
): void => {
  const players = new Map<number, {
    gid: number; side: 0 | 1; pos: { x: number; y: number }; vel: { x: number; y: number };
    bodyDir: { x: number; y: number }; observedTick: number;
  }>();
  for (const q of m.allPlayers) {
    players.set(q.gid, {
      gid: q.gid, side: q.side, pos: { x: q.pos.x, y: q.pos.y },
      vel: { ...(vel.get(q.gid) ?? { x: 0, y: 0 }) },
      bodyDir: { x: 1, y: 0 }, observedTick: 0,
    });
  }
  const memory = {
    nextScanTick: Number.MAX_SAFE_INTEGER,
    ball: seesBall
      ? { pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, ownerGid, observedTick: 0 }
      : null,
    players,
  } as unknown as PerceptionMemory;
  m.perceptionMemories.set(p.gid, memory);
};

const ownScore = (m: Match, p: Player): number | null => {
  decidePlayer(p, m);
  const c = p.action.scores.find((x) => x.why === OWN_RUN_WHY);
  return c === undefined ? null : c.score;
};

/** the mates the law counts: same side, not me, not the carrier, not the keeper */
const countableMates = (t: Team, p: Player, ownerGid: number): Player[] => t.players
  .filter((q) => q.gid !== p.gid && q.gid !== ownerGid && q.role !== 'GK' && !q.sentOff);

describe('DS T0b — G-BORN′: the restraint, exactly', () => {
  it('a perceived same-side carrier and NOBODY running ⇒ score = W.runScore · prior exactly', () => {
    const { m, p, t, W } = stage(B_BASE + 10);
    const owner = countableMates(t, p, -1)[0];
    inject(m, p, owner.gid, new Map()); // every perceived velocity is zero
    const got = ownScore(m, p);
    expect(got).not.toBeNull();
    expect(got).toBe(W.runScore * priorOf(p.role, t.localX(p.pos.x)));
  });

  it('`count` mates running at HIS OWN top speed ⇒ score EXACTLY 0', () => {
    const { m, p, t } = stage(B_BASE + 11);
    const owner = countableMates(t, p, -1)[0];
    const mates = countableMates(t, p, owner.gid);
    const n = COUNT_REF(t.mode, t.genome.tempo, t.mentality.urgency);
    expect(mates.length).toBeGreaterThanOrEqual(n);
    const vel = new Map<number, { x: number; y: number }>();
    for (const q of mates.slice(0, n)) vel.set(q.gid, { x: p.topSpeed * t.attackDir, y: 0 });
    inject(m, p, owner.gid, vel);
    expect(ownScore(m, p)).toBe(0);
  });

  it('HALF of `count` running ⇒ score EXACTLY W.runScore · prior · 0.5', () => {
    const { m, p, t, W } = stage(B_BASE + 12);
    const owner = countableMates(t, p, -1)[0];
    const mates = countableMates(t, p, owner.gid);
    const n = COUNT_REF(t.mode, t.genome.tempo, t.mentality.urgency);
    const vel = new Map<number, { x: number; y: number }>();
    const full = Math.floor(n / 2);
    for (let i = 0; i < full; i++) vel.set(mates[i].gid, { x: p.topSpeed * t.attackDir, y: 0 });
    if (n % 2 === 1) vel.set(mates[full].gid, { x: p.topSpeed * 0.5 * t.attackDir, y: 0 });
    inject(m, p, owner.gid, vel);
    expect(ownScore(m, p)).toBe(W.runScore * priorOf(p.role, t.localX(p.pos.x)) * 0.5);
  });

  it('MORE than `count` running still clamps at 0 (the cap, not a negative score)', () => {
    const { m, p, t } = stage(B_BASE + 13);
    const owner = countableMates(t, p, -1)[0];
    const vel = new Map<number, { x: number; y: number }>();
    for (const q of countableMates(t, p, owner.gid)) {
      vel.set(q.gid, { x: p.topSpeed * 4 * t.attackDir, y: 0 });
    }
    inject(m, p, owner.gid, vel);
    expect(ownScore(m, p)).toBe(0);
  });
});

describe('DS T0b — M-DS.7: the state guard, read off his own eyes', () => {
  it('a LOOSE perceived ball ⇒ no own-run candidate at all', () => {
    const { m, p } = stage(B_BASE + 14);
    inject(m, p, null, new Map());
    expect(ownScore(m, p)).toBeNull();
  });

  it('an OPPONENT perceived on the ball ⇒ no own-run candidate', () => {
    const { m, p, t } = stage(B_BASE + 15);
    const opp = m.teams[1 - t.side].players[5];
    inject(m, p, opp.gid, new Map());
    expect(ownScore(m, p)).toBeNull();
  });

  it('HIMSELF perceived on the ball ⇒ no own-run candidate', () => {
    const { m, p } = stage(B_BASE + 16);
    inject(m, p, p.gid, new Map());
    expect(ownScore(m, p)).toBeNull();
  });

  it('NO ball reading at all ⇒ no own-run candidate (a blind body does not go)', () => {
    const { m, p, t } = stage(B_BASE + 17);
    const owner = countableMates(t, p, -1)[0];
    inject(m, p, owner.gid, new Map(), false);
    expect(ownScore(m, p)).toBeNull();
  });

  it('the CARRIER himself is excluded structurally (decidePlayer returns above the menu)', () => {
    const m = matchOf(B_BASE + 18, { own: true, percept: true });
    let checked = 0;
    for (let ticks = 0; ticks < 3_000 && !m.finished; ticks++) {
      m.step(DT);
      const carrier = m.ball.owner;
      if (carrier === null) continue;
      expect(carrier.action.scores.some((c) => c.why === OWN_RUN_WHY)).toBe(false);
      checked++;
    }
    expect(checked).toBeGreaterThan(500);
  });
});

describe('DS T0b — runningMates on a hand-built snapshot', () => {
  it('forward · backward · sideways · keeper · sent off · the carrier · himself', () => {
    const { m, p, t, W } = stage(B_BASE + 19);
    const keeper = t.players[0];
    expect(keeper.role).toBe('GK');
    const others = t.players.filter((q) => q.gid !== p.gid && q.role !== 'GK');
    const owner = others[0];
    const forward = others[1];
    const backward = others[2];
    const sideways = others[3];
    // a SENT-OFF body of his own side, running flat out: the roster guard drops him
    sideways.sentOff = true;
    const top = p.topSpeed;
    const vel = new Map<number, { x: number; y: number }>([
      [forward.gid, { x: top * 0.5 * t.attackDir, y: 0 }],        // counts 0.5
      [backward.gid, { x: -top * t.attackDir, y: 0 }],            // clamped to 0
      [sideways.gid, { x: top * t.attackDir, y: top }],           // sent off ⇒ dropped
      [keeper.gid, { x: top * t.attackDir, y: 0 }],               // a keeper ⇒ dropped
      [owner.gid, { x: top * t.attackDir, y: 0 }],                // the carrier ⇒ dropped
      [p.gid, { x: top * t.attackDir, y: 0 }],                    // himself ⇒ dropped
    ]);
    inject(m, p, owner.gid, vel);
    const n = COUNT_REF(t.mode, t.genome.tempo, t.mentality.urgency);
    const want = W.runScore * priorOf(p.role, t.localX(p.pos.x)) * clamp01(1 - 0.5 / n);
    expect(ownScore(m, p)).toBe(want);
    // and the SIDEWAYS component itself is worth nothing: the same body, not sent off,
    // moving purely across the pitch, changes nothing
    const scene2 = stage(B_BASE + 20);
    const others2 = scene2.t.players.filter((q) => q.gid !== scene2.p.gid && q.role !== 'GK');
    inject(scene2.m, scene2.p, others2[0].gid, new Map([
      [others2[1].gid, { x: 0, y: scene2.p.topSpeed * 9 }],
    ]));
    expect(ownScore(scene2.m, scene2.p))
      .toBe(scene2.W.runScore * priorOf(scene2.p.role, scene2.t.localX(scene2.p.pos.x)));
  });

  it('an OPPONENT sprinting forward is not a running mate (side is read, not just gid)', () => {
    const { m, p, t, W } = stage(B_BASE + 21);
    const owner = t.players.filter((q) => q.gid !== p.gid && q.role !== 'GK')[0];
    const vel = new Map<number, { x: number; y: number }>();
    for (const q of m.teams[1 - t.side].players) {
      vel.set(q.gid, { x: p.topSpeed * 3 * t.attackDir, y: 0 });
    }
    inject(m, p, owner.gid, vel);
    expect(ownScore(m, p)).toBe(W.runScore * priorOf(p.role, t.localX(p.pos.x)));
  });

  it('a mate his eyes do NOT hold counts as NO running (staleness/absence is data)', () => {
    const { m, p, t, W } = stage(B_BASE + 22);
    const others = t.players.filter((q) => q.gid !== p.gid && q.role !== 'GK');
    const owner = others[0];
    const runner = others[1];
    // he IS running in truth — the observer simply has no reading of him
    runner.vel.x = p.topSpeed * t.attackDir;
    runner.vel.y = 0;
    inject(m, p, owner.gid, new Map([[runner.gid, { x: p.topSpeed * t.attackDir, y: 0 }]]));
    const withReading = ownScore(m, p);
    inject(m, p, owner.gid, new Map());
    const memory = m.perceptionMemories.get(p.gid)!;
    memory.players.delete(runner.gid); // outside the cone: not in the snapshot at all
    const withoutReading = ownScore(m, p);
    expect(withReading).toBeLessThan(withoutReading!);
    expect(withoutReading).toBe(W.runScore * priorOf(p.role, t.localX(p.pos.x)));
  });
});

describe('DS T0b — the run follows the SNAPSHOT, never the truth', () => {
  it('truth says a mate carries; his eyes say the ball is loose ⇒ NO own run', () => {
    const { m, p, t } = stage(B_BASE + 23);
    const owner = t.players.filter((q) => q.gid !== p.gid && q.role !== 'GK')[0];
    m.giveBall(owner);
    expect(m.ball.owner).toBe(owner);
    inject(m, p, null, new Map()); // his eyes: nobody has it
    expect(ownScore(m, p)).toBeNull();
  });

  it('truth says the ball is loose; his eyes say a mate carries ⇒ the own run FIRES', () => {
    const { m, p, t, W } = stage(B_BASE + 24);
    const owner = t.players.filter((q) => q.gid !== p.gid && q.role !== 'GK')[0];
    m.ball.owner = null;
    expect(m.ball.owner).toBeNull();
    inject(m, p, owner.gid, new Map());
    expect(ownScore(m, p)).toBe(W.runScore * priorOf(p.role, t.localX(p.pos.x)));
  });
});

/* ------------------------------------------------------------------ */
/* B6 — the percept pull: gated, counted, idempotent                   */
/* ------------------------------------------------------------------ */

describe('DS T0b — the percept pull is gated by the flag and counted', () => {
  it('ZERO pulls with the flag absent · exactly ONE armed · TWO with the OBM seat armed', () => {
    const seen: Record<string, Record<number, number>> = {};
    for (const own of [false, true]) {
      for (const obm of [false, true]) {
        const key = `own${own ? 1 : 0}obm${obm ? 1 : 0}`;
        const m = matchOf(B_BASE + 30, { world: 13, own: own || undefined, obm: obm || undefined });
        const real = m.perceivedSnapshot.bind(m);
        let calls = 0;
        (m as unknown as { perceivedSnapshot: unknown }).perceivedSnapshot = (
          q: Player, scope?: ReadonlySet<number> | null,
        ) => { calls++; return real(q, scope ?? null); };
        const dist: Record<number, number> = {};
        let subjects = 0;
        for (let ticks = 0; ticks < 800 && !m.finished && subjects < 120; ticks++) {
          m.step(DT);
          if (m.phase !== 'playing') continue;
          const side = m.possessionSide;
          if (side !== 0 && side !== 1) continue;
          const t = m.teams[side];
          for (const p of t.players) {
            if (p.role === 'GK' || p.sentOff || m.ball.owner === p) continue;
            if (t.runners.has(p.index) || t.arriver === p.index || t.overlapper === p.index) continue;
            if (p.wallRun !== null && m.simTime < p.wallRun.until) continue;
            calls = 0;
            decidePlayer(p, m);
            dist[calls] = (dist[calls] ?? 0) + 1;
            subjects++;
          }
        }
        seen[key] = dist;
        expect(subjects).toBeGreaterThan(100);
      }
    }
    // ⭐ THE FORM CHOSEN (§DEVIATIONS-B 1): a SECOND, idempotent pull when the OBM seat is
    // armed — `obmOffballPolicy`'s signature is untouched because `offballEyes.ts` is
    // off-limits to this stage (ruling #407 item 5(vi)) — so the counts are 0 · 1 · 1 · 2.
    expect(Object.keys(seen.own0obm0)).toEqual(['0']);
    expect(Object.keys(seen.own0obm1)).toEqual(['1']);
    expect(Object.keys(seen.own1obm0)).toEqual(['1']);
    expect(Object.keys(seen.own1obm1)).toEqual(['2']);
  }, 180_000);

  it('the second pull is IDEMPOTENT and draws no rng (what makes it affordable)', () => {
    const m = matchOf(B_BASE + 31, { world: 13, own: true, obm: true });
    let checked = 0;
    for (let ticks = 0; ticks < 400 && !m.finished; ticks++) {
      m.step(DT);
      for (const t of m.teams) {
        for (const p of t.players) {
          if (p.role === 'GK' || p.sentOff) continue;
          const rngBefore = JSON.stringify(m.rng);
          const a = JSON.stringify(m.perceivedSnapshot(p));
          const b = JSON.stringify(m.perceivedSnapshot(p));
          expect(b).toBe(a);
          expect(JSON.stringify(m.rng)).toBe(rngBefore);
          checked++;
        }
      }
    }
    expect(checked).toBeGreaterThan(1000);
  }, 180_000);
});

/* ------------------------------------------------------------------ */
/* B7 — the mutant walk (five, each with its killing pin)              */
/* ------------------------------------------------------------------ */

describe('DS T0b — the mutant walk', () => {
  it('M5 — the restraint dropped: killed by G-BORN′ (`count` runners ⇒ score 0)', () => {
    // the factor is IN the score statement and the cap is the only thing between it and 1
    expect(OWN_RUN_BLOCK.includes('let s = W.runScore * prior * restraint;')).toBe(true);
    expect(OWN_RUN_BLOCK.includes('const restraint = clamp01(1 - runningMates / runnerCount('))
      .toBe(true);
  });

  it('M6 — `count` re-typed with a literal: killed by the code-move source pin', () => {
    expect(codeLines(OWN_RUN_BLOCK).join('\n').includes('0.65')).toBe(false);
    expect(codeLines(OWN_RUN_BLOCK).join('\n').includes('CounterAttack')).toBe(false);
    expect(codeLines(OWN_RUN_BLOCK).join('\n').includes('runnerCount(')).toBe(true);
  });

  it('M7 — the guard reading `match.ball.owner`: killed by the source pin AND the scene', () => {
    expect(codeLines(OWN_RUN_BLOCK).join('\n').includes('match.ball')).toBe(false);
    expect(OWN_RUN_BLOCK.includes('const ownerGid = seenBall === null ? null : seenBall.ownerGid;'))
      .toBe(true);
    // the behavioural half is the pair above: truth-loose + eyes-carrier ⇒ FIRES;
    // truth-carrier + eyes-loose ⇒ SILENT. A truth read cannot produce both.
  });

  it('M8 — the running-mates sum including himself: killed by the hand-built scene', () => {
    expect(OWN_RUN_BLOCK.includes('if (mate.gid === p.gid || mate.gid === ownerGid) continue;'))
      .toBe(true);
    const { m, p, t, W } = stage(B_BASE + 40);
    const owner = t.players.filter((q) => q.gid !== p.gid && q.role !== 'GK')[0];
    // he himself is flying forward; a sum that included him would price his run at ≤ 0
    inject(m, p, owner.gid, new Map([[p.gid, { x: p.topSpeed * t.attackDir, y: 0 }]]));
    expect(ownScore(m, p)).toBe(W.runScore * priorOf(p.role, t.localX(p.pos.x)));
  });

  it('M9 — the pull made unconditional: killed by G-OFF and by the pull counter', () => {
    // the pull is lexically INSIDE both the gate and the not-hatted guard
    expect(OWN_RUN_BLOCK.startsWith('    if (match.dsOwnRun) {')).toBe(true);
    const idxGuard = OWN_RUN_BLOCK.indexOf('if (!hatted && !wallLive) {');
    const idxPull = OWN_RUN_BLOCK.indexOf('const snapshot = match.perceivedSnapshot(p);');
    expect(idxGuard).toBeGreaterThan(0);
    expect(idxPull).toBeGreaterThan(idxGuard);
    // three pulls in the whole file: the pass chooser's two (carrier-side) and this one
    expect(count(codeLines(playerSource).join('\n'), /match\.perceivedSnapshot/g)).toBe(3);
  });
});

/* ------------------------------------------------------------------ */
/* B8 — the narrowed pins, listed POSITIVELY                           */
/* ------------------------------------------------------------------ */

describe('DS T0b — the pins this slice narrows, narrowed positively', () => {
  it('the seam map is UNCHANGED: the code-move adds no flag read anywhere', () => {
    expect(count(codeLines(playerSource).join('\n'), /match\.dsOwnRun/g)).toBe(1);
    expect(count(codeLines(teamSource).join('\n'), /match\.dsHatsOff/g)).toBe(2);
    expect(count(codeLines(teamSource).join('\n'), /runnerCount/g)).toBe(2);
  });

  it('the seventh literal is still the only one this seam adds', () => {
    const menu = playerSource.match(/why: '[^']+'/g) ?? [];
    expect(menu.filter((w) => w === `why: '${OWN_RUN_WHY}'`)).toHaveLength(1);
    expect(count(playerSource, /action: 'MakeRun'/g) + count(playerSource, /type: 'MakeRun'/g))
      .toBe(6);
  });

  it('the OBM seat is byte-untouched by this slice', () => {
    const eyes = src('ai/offballEyes.ts');
    expect(count(eyes, /dsOwnRun|dsHatsOff|runnerCount/g)).toBe(0);
    expect(playerSource.includes(
      'p, match, g, supportSpot(p, team, ball, match.ctbSupportPlane), match.ctbSupportPlane,',
    )).toBe(true);
  });
});
