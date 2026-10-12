import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { Match } from '../src/sim/Match';
import { League } from '../src/sim/League';
import { runHeadless } from '../src/sim/simRunner';
import { CONTROL_RADIUS, DT } from '../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import type { Player } from '../src/sim/Player';
import { laneOpenness, laneOpennessFront } from '../src/ai/perception';
import { ownLaneOpenness } from '../src/ai/ownLaneSeat';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import {
  a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells, type A4ArmedVersion,
} from '../src/game/a4World';
import { Rng } from '../src/utils/rng';
import { closestPointOnSegment, dist, type V2 } from '../src/utils/vec';

/**
 * ⭐⭐⭐ OP T0 — 「身前那个人 · 缝」 THE FRONT-MAN SEAM (docs/world-model/OP-T0-FRONT-MAN-SEAM.md;
 * contract OP-FRONT-MAN-CONTRACT.md §2 M-OP.1–4, §3 OP-T0; COMMANDER RULING #432 item 3 — the
 * user's 「甲吧」 ⇒ 「身前贴着的人要算进去」) — THE SEAM'S PERMANENT PIN SUITE, in the
 * `tests/ifFlightRun.test.ts` form. ⭐ CANON "pin suites from birth" (ruling #297 item 7).
 *
 * WHAT THIS IS: ONE dormant flag (`match.opFrontMan`), ONE pure geometry function beside the
 * shipped one (`laneOpennessFront`), and ONE seat — the licence's lane, the ONE `laneOpenness`
 * call inside the hoisted `groundCandidate` pricer. NO constant, NO gene, NO weight; no other
 * `laneOpenness` caller changes. Dormant. Ships nothing.
 *
 * ⭐⭐⭐ THE ARCHITECTURE (canon "digests carry their architecture", ruling #418 item 2). The
 * G-OFF table is keyed by `process.arch`. The **x64** column was RECORDED BY THE EXECUTOR at
 * this stage's dispatch head `1b352f7` (ruling #432's own commit), IN PROCESS on the clean tree
 * BEFORE one byte of this seam existed (`git status --short` EMPTY), with a recorder whose
 * recipe was first CHECKED byte-equal to `tests/ifFlightRun.test.ts`'s by reproducing that
 * suite's x64 bare · w13 · w17 literals on its own seeds 900,007,400–411. The **arm64** column
 * is **ABSENT**: no arm64 literal of record exists for these scratch seeds. Its pins SKIP on
 * arm64 and say so in their titles. The arm64 argument is BY IDENTITY OF THE CODE PATH — with
 * the door shut the seat resolves to the SHIPPED `laneOpenness` function object itself and
 * `laneOpennessFront` is never called (F2 COUNTS that), so the shut world executes HEAD's
 * statements on every architecture. ⛔ Never a guess, never a number typed from memory.
 *
 * The pins (§PINS of the stage doc is the inventory; this file IS the living copy):
 *   F0  THE FIXTURES  ⭐ the three geometric cases FIRST — a man BEHIND the kicker (skipped,
 *                     = `laneOpenness`), a man LEVEL with the kicker (skipped), a man 1 m AHEAD
 *                     on the line (read, 0) — then the 1.5 m edge, a man 1 m ahead and
 *                     `CONTROL_RADIUS` aside (open, 1), and `laneOpennessFront ≡ laneOpenness`
 *                     whenever no opponent's closest point lies in (from, 1.5 m].
 *   F1  G-OFF        the flag absent ⇒ whole-match signatures on bare · 13 · 17 · 18 over the
 *                    twelve scratch seeds reproduce the x64 digests recorded at HEAD;
 *                    ABSENT ≡ EXPLICITLY FALSE; the fingerprint.
 *   F2  DORMANT      the flag absent ⇒ `laneOpennessFront` is called ZERO times over whole
 *                    matches (COUNTS); armed ⇒ called.
 *   F3  ARMED        on a scratch walk, every licence evaluation is priced by BOTH forms on the
 *                    SAME arguments: they differ ONLY where a man's closest point lies strictly
 *                    ahead of the kicker within 1.5 m, and DO differ on some.
 *   F4  THE SEAT     the ONE seat inside `groundCandidate`: the shipped lane statement
 *                    byte-unchanged, the fork its FIRST statement, the other callers untouched.
 *   F5  THE FORM     `laneOpennessFront` is `laneOpenness` line for line except the guard.
 *   F6  THE SEAM MAP  per-file executable-line occurrence counts, paths normalized to '/'
 *                     (#418 item 2(iv)); Road B; the key union grew by exactly one.
 *   F7  THE MUTANT WALK — four mutants with their EXACT mutation texts (M1 the shipped guard
 *                     kept · M2 the 4 m normaliser inside 1.5 m · M3 the flag inverted · M4 the
 *                     seat applied to `ownLaneOpenness`), each with the pins that kill it.
 *   F8  THE BAND      every seed inside 900,009,800–899, derived from the ONE declared `BASE`.
 *
 * ⚠ THE SEED BAND (#432 item 3(iv)): scratch **900,009,800–899** from ONE base; verifier
 * 900,009,900–999. ZERO frontier, ZERO stats.
 * ⭐ Receipts are receipts (ruling #289 item 1): every count below is ARMING PLUMBING. What the
 * seat does to the football is OP-T1's question, and this stage claims none of it.
 */

/**
 * ⭐ THE LICENCE RECORDER. `laneOpennessFront` has exactly ONE caller in `src/**` (F6 pins it):
 * the seat inside `groundCandidate`. Wrapping the export therefore observes EVERY licence
 * evaluation the armed seat makes, with its arguments, and lets the shipped `laneOpenness` be
 * evaluated on the SAME arguments — the in-process HEAD-vs-seam A/B (no worktree). The wrapper
 * returns the original's value untouched, so it changes nothing it observes.
 */
const probe = vi.hoisted(() => ({
  calls: 0,
  rec: null as null | ((from: V2, to: V2, opponents: Player[], value: number) => void),
}));
vi.mock('../src/ai/perception', async (importOriginal) => {
  const orig = await importOriginal<typeof import('../src/ai/perception')>();
  return {
    ...orig,
    laneOpennessFront: (from: V2, to: V2, opponents: Player[]): number => {
      const v = orig.laneOpennessFront(from, to, opponents);
      probe.calls++;
      if (probe.rec !== null) probe.rec(from, to, opponents, v);
      return v;
    },
  };
});

const ARCH = process.arch;

/** The production fingerprint of record, ARCH-KEYED (copied from `tests/ifFlightRun.test.ts`). */
const FINGERPRINT_OF_RECORD: Readonly<Record<string, string>> = {
  arm64: '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
  x64: '59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d',
};

/** ⚠ THE ONE DECLARED BASE. Every seed in this file is `BASE + k`, `0 ≤ k ≤ 99`. */
const BASE = 900_009_800;
/** G-OFF's twelve seeds (≥ 12, #432 item 3(ii)) */
const G_SEEDS: readonly number[] = Array.from({ length: 12 }, (_, i) => BASE + i);
/** the dormancy walks (F2) */
const DORMANT_SEEDS: readonly number[] = Array.from({ length: 3 }, (_, i) => BASE + 20 + i);
/** the armed liveness walks (F3) */
const ARMED_SEEDS: readonly number[] = Array.from({ length: 3 }, (_, i) => BASE + 30 + i);
/** the random-geometry sweep (F0) */
const SWEEP_SEED = BASE + 50;
/** the armed ≠ shut whole-match check (F3) */
const MOVE_SEEDS: readonly number[] = Array.from({ length: 2 }, (_, i) => BASE + 60 + i);
/** the M3 dormancy walk (F7) */
const M3_SEED = BASE + 70;

/**
 * ⭐⭐ THE DIGESTS OF RECORD, ARCH-KEYED. **x64** — RECORDED at the dispatch head `1b352f7`
 * (ruling #432's commit) on the twelve seeds 900,009,800–811 before the seam existed, and
 * RE-DERIVED after the seam with the door shut (identical). **arm64** — ABSENT (no literal of
 * record on these seeds; skipped by title).
 */
const HEAD_COMMIT = '1b352f7';
const HEAD_DIGESTS: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  x64: {
    bare: '8ed1d9702efea342c5de8a70c05c2a1b56e3e6ee68f81e37401cfe8cf2597481',
    w13: 'fd6d74430962151905ce4e49708e472e1bdb301cebee1b55eca9f5a853ef80c3',
    w17: '3f85b15e9fb141065da62453aac304727031f7f3bbca9801765dc24a9de6c1ed',
    w18: '9fcfa3164d90e153f0badf9f0c851b74861f244efae8dc7291df2db98286ac00',
  },
};

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
  front?: boolean;
  frontExplicitFalse?: boolean;
  world?: 13 | 17 | 18;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const base = a.world === undefined ? {} : a4MatchFlags(a.world);
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    duration: 240,
    ...base,
    ...(a.front === true ? { opFrontMan: true } : {}),
    ...(a.frontExplicitFalse === true ? { opFrontMan: false } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (a.world !== undefined) armA4World(m, null, a.world, L3_DOSE, PC_DOSE);
  return m;
};

/**
 * ⭐⭐ THE WORLD-IDENTITY SIGNATURE — BYTE-EQUAL to `tests/ifFlightRun.test.ts`'s (and so to
 * `tests/dsCoopHatsOff.test.ts`'s) `signatureOf`. Do not touch it without re-recording.
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
const gOff = (world: 13 | 17 | 18 | undefined): string =>
  digest(G_SEEDS.map((seed) => signatureOf(matchOf(seed, { world }))));

/** run a whole match, nothing else */
const play = (m: Match): void => {
  let ticks = 0;
  while (!m.finished && ticks < 60_000) {
    m.step(DT);
    ticks++;
  }
};

const src = (rel: string): string =>
  readFileSync(new URL(`../src/${rel}`, import.meta.url), 'utf8');
const playerSource = src('ai/PlayerBrain.ts');
const perceptionSource = src('ai/perception.ts');
const ownLaneSource = src('ai/ownLaneSeat.ts');
const matchSource = src('sim/Match.ts');
const leagueSource = src('sim/League.ts');
const a4Source = src('game/a4World.ts');
const count = (hay: string, needle: RegExp): number => (hay.match(needle) ?? []).length;
/** ⚠ #418 item 2(iv): `join()` yields a BACKSLASH on this host — every path normalizes to '/'. */
const norm = (p: string): string => p.split(sep).join('/');
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = join(dir, e);
  return statSync(full).isDirectory() ? srcFiles(full) : full.endsWith('.ts') ? [norm(full)] : [];
});
/** lines that are neither blank nor a comment — the EXECUTABLE text of a file. */
const codeLines = (text: string): string[] => text.split('\n')
  .map((l) => l.trim())
  .filter((l) => l !== '' && !l.startsWith('//') && !l.startsWith('*') && !l.startsWith('/*'));

/** a function's text, from its `export function NAME(` line through its closing `}` */
const fnSpan = (text: string, name: string): string => {
  const lines = text.split('\n');
  const start = lines.findIndex((l) => l.startsWith(`export function ${name}(`));
  expect(start, name).toBeGreaterThanOrEqual(0);
  const end = lines.findIndex((l, i) => i > start && l === '}');
  expect(end, name).toBeGreaterThan(start);
  return lines.slice(start, end + 1).join('\n');
};

/** ⭐ THE SEAT SPAN — the hoisted `groundCandidate` closure, header through its closing `    };` */
const SEAT_SPAN = ((): string => {
  const lines = playerSource.split('\n');
  const start = lines.findIndex((l) =>
    l === '    const groundCandidate = (mate: Player, aim: Readonly<V2>, d: number): {');
  expect(start).toBeGreaterThan(0);
  const ret = lines.findIndex((l, i) => i > start && l === '      return { s: sRa, lane, open, gain, mul };');
  expect(ret).toBeGreaterThan(start);
  expect(lines[ret + 1]).toBe('    };');
  return lines.slice(start, ret + 2).join('\n');
})();

/** the seat line, VERBATIM — the ONE fork on the door */
const SEAT_LINE =
  '      const laneOpenness = match.opFrontMan ? laneOpennessFront : laneOpennessShipped;';
/** the shipped licence statement, VERBATIM — byte-unchanged by this seam */
const SHIPPED_LANE = [
  '      const lane = Math.min(',
  '        1,',
  "        laneOpenness(p.pos, aim, opp.players) * (p.traits.includes('playmaker') ? 1.15 : 1),",
  '      );',
].join('\n');

/** a stand-in body: `laneOpenness` / `laneOpennessFront` read `pos` and `sentOff` and nothing else */
const man = (x: number, y: number, sentOff = false): Player =>
  ({ pos: { x, y }, sentOff }) as unknown as Player;

/** the geometry the seam separates: some live man's closest point strictly ahead and inside 1.5 m */
const hasFrontMan = (from: V2, to: V2, opponents: readonly Player[]): boolean =>
  opponents.some((o) => {
    if (o.sentOff) return false;
    const along = dist(closestPointOnSegment(from, to, o.pos), from);
    return along > 0 && along < 1.5;
  });

const FROM: V2 = { x: 0, y: 0 };
const TO: V2 = { x: 10, y: 0 };

/* ------------------------------------------------------------------ */
/* F0 — ⭐ THE FIXTURES (the three geometric cases FIRST)                */
/* ------------------------------------------------------------------ */

describe('OP T0 — ⭐ the laneOpennessFront FIXTURES (contract §3 OP-T0, the three geometric cases first)', () => {
  it('(1) a man BEHIND the kicker ⇒ SKIPPED, equal to laneOpenness', () => {
    for (const o of [man(-0.5, 0.3), man(-1.2, 0), man(-0.1, -0.05)]) {
      expect(laneOpennessFront(FROM, TO, [o])).toBe(1);
      expect(laneOpennessFront(FROM, TO, [o])).toBe(laneOpenness(FROM, TO, [o]));
    }
  });

  it('(2) a man LEVEL with the kicker ⇒ SKIPPED (his closest point IS the kicker)', () => {
    for (const o of [man(0, 0.4), man(0, -1), man(0, 0)]) {
      expect(dist(closestPointOnSegment(FROM, TO, o.pos), FROM)).toBe(0);
      expect(laneOpennessFront(FROM, TO, [o])).toBe(1);
      expect(laneOpennessFront(FROM, TO, [o])).toBe(laneOpenness(FROM, TO, [o]));
    }
  });

  it('(3) ⭐ a man 1 m AHEAD on the line ⇒ READ, 0 (laneOpenness skips him: 1)', () => {
    expect(laneOpennessFront(FROM, TO, [man(1, 0)])).toBe(0);
    expect(laneOpenness(FROM, TO, [man(1, 0)])).toBe(1);
  });

  it('(4) the 1.5 m EDGE — at exactly 1.5 m along the line both forms read d / 4; just inside, the front form reads d / CONTROL_RADIUS', () => {
    expect(laneOpennessFront(FROM, TO, [man(1.5, 1)])).toBe(0.25);
    expect(laneOpenness(FROM, TO, [man(1.5, 1)])).toBe(0.25);
    expect(laneOpennessFront(FROM, TO, [man(1.49, 1)])).toBe(Math.min(1, 1 / CONTROL_RADIUS));
    expect(laneOpenness(FROM, TO, [man(1.49, 1)])).toBe(1);
    // beyond 1.5 m: unchanged
    expect(laneOpennessFront(FROM, TO, [man(3, 2)])).toBe(laneOpenness(FROM, TO, [man(3, 2)]));
    expect(laneOpennessFront(FROM, TO, [man(3, 2)])).toBe(0.5);
  });

  it('(5) a man 1 m ahead and CONTROL_RADIUS aside ⇒ OPEN, 1 (the engine\'s reach, not the 4 m normaliser)', () => {
    expect(laneOpennessFront(FROM, TO, [man(1, CONTROL_RADIUS)])).toBe(1);
    expect(laneOpennessFront(FROM, TO, [man(1, -CONTROL_RADIUS)])).toBe(1);
    // and half of it aside reads one half
    expect(laneOpennessFront(FROM, TO, [man(1, CONTROL_RADIUS / 2)])).toBe(0.5);
  });

  it('a SENT-OFF man is skipped by both; the DEGENERATE segment keeps the shipped behaviour', () => {
    expect(laneOpennessFront(FROM, TO, [man(1, 0, true)])).toBe(1);
    expect(laneOpennessFront(FROM, FROM, [man(0.5, 0), man(1, 1)]))
      .toBe(laneOpenness(FROM, FROM, [man(0.5, 0), man(1, 1)]));
    expect(laneOpennessFront(FROM, FROM, [man(0.5, 0), man(1, 1)])).toBe(1);
  });

  it('⭐ ≡ laneOpenness whenever NO closest point lies in (from, 1.5 m]; ≤ it always; and different ONLY with such a man (random sweep, 4,000 lanes)', () => {
    const rng = new Rng(SWEEP_SEED);
    let without = 0;
    let withMan = 0;
    let differ = 0;
    for (let k = 0; k < 4_000; k++) {
      const from = { x: rng.range(-20, 20), y: rng.range(-12, 12) };
      const to = { x: from.x + rng.range(-25, 25), y: from.y + rng.range(-15, 15) };
      const n = 1 + Math.floor(rng.next() * 5);
      const opponents: Player[] = [];
      for (let i = 0; i < n; i++) {
        opponents.push(man(from.x + rng.range(-4, 6), from.y + rng.range(-4, 4), rng.next() < 0.05));
      }
      const a = laneOpennessFront(from, to, opponents);
      const b = laneOpenness(from, to, opponents);
      expect(a).toBeLessThanOrEqual(b);
      if (hasFrontMan(from, to, opponents)) {
        withMan++;
        if (a !== b) differ++;
      } else {
        without++;
        expect(a).toBe(b);
      }
    }
    // non-vacuity: both partitions populated, and the front man DOES move the price
    expect(without).toBeGreaterThan(500);
    expect(withMan).toBeGreaterThan(500);
    expect(differ).toBeGreaterThan(0);
  });
});

/* ------------------------------------------------------------------ */
/* F1 — G-OFF, ARCH-KEYED                                              */
/* ------------------------------------------------------------------ */

describe('OP T0 — G-OFF: the flag absent ⇒ the world is the dispatch HEAD\'s (ARCH-KEYED)', () => {
  it('the arch-keyed table is honest: x64 RECORDED at the dispatch head, arm64 ABSENT', () => {
    expect(HEAD_COMMIT).toBe('1b352f7');
    expect(Object.keys(HEAD_DIGESTS)).toEqual(['x64']);
    expect(Object.keys(HEAD_DIGESTS.x64).sort()).toEqual(['bare', 'w13', 'w17', 'w18']);
    expect(HEAD_DIGESTS.arm64).toBeUndefined();
    expect(G_SEEDS).toEqual(Array.from({ length: 12 }, (_, i) => 900_009_800 + i));
  });

  it.skipIf(ARCH !== 'x64')('the BARE world reproduces the x64 digest recorded at HEAD (SKIPPED on arm64 — ABSENT)', () => {
    expect(gOff(undefined)).toBe(HEAD_DIGESTS.x64.bare);
  }, 180_000);

  it.skipIf(ARCH !== 'x64')('world 13 reproduces the x64 digest recorded at HEAD (SKIPPED on arm64 — ABSENT)', () => {
    expect(gOff(13)).toBe(HEAD_DIGESTS.x64.w13);
  }, 180_000);

  it.skipIf(ARCH !== 'x64')('world 17 reproduces the x64 digest recorded at HEAD (SKIPPED on arm64 — ABSENT)', () => {
    expect(gOff(17)).toBe(HEAD_DIGESTS.x64.w17);
  }, 180_000);

  it.skipIf(ARCH !== 'x64')('world 18 — the user\'s play — reproduces the x64 digest recorded at HEAD (SKIPPED on arm64 — ABSENT)', () => {
    expect(gOff(18)).toBe(HEAD_DIGESTS.x64.w18);
  }, 180_000);

  it('ABSENT ≡ EXPLICITLY FALSE (the other half of dormancy), bare AND world 18', () => {
    for (const seed of G_SEEDS.slice(0, 3)) {
      expect(signatureOf(matchOf(seed, { frontExplicitFalse: true })))
        .toBe(signatureOf(matchOf(seed)));
      expect(signatureOf(matchOf(seed, { world: 18, frontExplicitFalse: true })))
        .toBe(signatureOf(matchOf(seed, { world: 18 })));
    }
    expect(matchOf(BASE).opFrontMan).toBe(false);
    expect(matchOf(BASE, { frontExplicitFalse: true }).opFrontMan).toBe(false);
    expect(matchOf(BASE, { front: true }).opFrontMan).toBe(true);
  }, 180_000);

  it('the production fingerprint is unchanged (ARCH-KEYED — #418 item 1)', () => {
    const l = new League({ seed: 1337 });
    const out = runHeadless(l.toJSON() as Record<string, unknown>, {
      kind: 'toGeneration', target: l.generation + 2,
    });
    const sha = createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
    expect(sha).toBe(FINGERPRINT_OF_RECORD[ARCH]);
  }, 240_000);
});

/* ------------------------------------------------------------------ */
/* F2 — DORMANT: the front form is never called with the door shut      */
/* ------------------------------------------------------------------ */

describe('OP T0 — DORMANT: with the flag absent `laneOpennessFront` is never called (COUNTS)', () => {
  for (const world of [undefined, 18] as const) {
    it(`${world === undefined ? 'the BARE world' : `world ${world}`}: ZERO calls over whole matches with the flag absent; > 0 armed`, () => {
      for (const seed of DORMANT_SEEDS) {
        probe.calls = 0;
        play(matchOf(seed, { world }));
        expect(probe.calls, `seed ${seed} shut`).toBe(0);
      }
      probe.calls = 0;
      play(matchOf(DORMANT_SEEDS[0], { world, front: true }));
      expect(probe.calls).toBeGreaterThan(0);
      probe.calls = 0;
    }, 180_000);
  }
});

/* ------------------------------------------------------------------ */
/* F3 — ARMED liveness: different from HEAD ONLY with a man in front    */
/* ------------------------------------------------------------------ */

interface Live { evaluations: number; withMan: number; differ: number; differWithoutMan: number }
const liveWalk = (seed: number, world: 18 | undefined): Live => {
  const o: Live = { evaluations: 0, withMan: 0, differ: 0, differWithoutMan: 0 };
  probe.rec = (from, to, opponents, v) => {
    o.evaluations++;
    const head = laneOpenness(from, to, opponents);
    const front = hasFrontMan(from, to, opponents);
    if (front) o.withMan++;
    if (v !== head) {
      o.differ++;
      if (!front) o.differWithoutMan++;
    }
  };
  try {
    play(matchOf(seed, { world, front: true }));
  } finally {
    probe.rec = null;
  }
  return o;
};

describe('OP T0 — ARMED: the licence\'s lane differs from HEAD\'s ONLY with a man strictly ahead within 1.5 m, and DOES differ', () => {
  for (const world of [18, undefined] as const) {
    it(`${world === undefined ? 'the BARE world' : `world ${world}`} + the flag, ${ARMED_SEEDS.length} scratch seeds: every differing licence evaluation has such a man; some differ`, () => {
      const total: Live = { evaluations: 0, withMan: 0, differ: 0, differWithoutMan: 0 };
      for (const seed of ARMED_SEEDS) {
        const o = liveWalk(seed, world);
        total.evaluations += o.evaluations;
        total.withMan += o.withMan;
        total.differ += o.differ;
        total.differWithoutMan += o.differWithoutMan;
      }
      // the record line (x64, this host) — read by the stage doc's §GATES
      console.log(`[OP-T0 armed ${world === undefined ? 'bare' : `w${world}`}] ${JSON.stringify(total)}`);
      expect(total.evaluations).toBeGreaterThan(1_000);
      expect(total.differWithoutMan).toBe(0);
      expect(total.differ).toBeGreaterThan(0);
      expect(total.differ).toBeLessThanOrEqual(total.withMan);
    }, 180_000);
  }

  it('armed, the world MOVES (world 18, whole-match signature ≠ the shut world)', () => {
    for (const seed of MOVE_SEEDS) {
      expect(signatureOf(matchOf(seed, { world: 18, front: true })))
        .not.toBe(signatureOf(matchOf(seed, { world: 18 })));
    }
  }, 180_000);
});

/* ------------------------------------------------------------------ */
/* F4 — THE SEAT (M-OP.1)                                              */
/* ------------------------------------------------------------------ */

describe('OP T0 — THE SEAT: the ONE `laneOpenness` call inside `groundCandidate`, and nothing else', () => {
  it('the fork is the closure\'s FIRST executable statement; the shipped licence statement is byte-unchanged', () => {
    const lines = SEAT_SPAN.split('\n');
    // header (3 lines) then the closure's first executable line
    expect(lines[2]).toBe('    } => {');
    const body = lines.slice(3).filter((l) => codeLines(l).length > 0);
    expect(body[0]).toBe(SEAT_LINE);
    expect(SEAT_SPAN).toContain(SHIPPED_LANE);
    const seatCode = codeLines(SEAT_SPAN).join('\n');
    expect(count(seatCode, /laneOpenness\(/g)).toBe(1);
    expect(count(seatCode, /opFrontMan/g)).toBe(1);
    // the playmaker's ×1.15 and the min(1, …) stay exactly as they are
    expect(count(seatCode, /includes\('playmaker'\) \? 1\.15 : 1\)/g)).toBe(1);
    expect(count(seatCode, /const lane = Math\.min\(/g)).toBe(1);
  });

  it('the other `laneOpenness` callers are OUTSIDE the closure, name the SHIPPED import, and are untouched', () => {
    // bkCorridorPrice's frozen count holds: FOUR calls in PlayerBrain, one of them the seat's
    expect(count(playerSource, /laneOpenness\(/g)).toBe(4);
    expect(playerSource).toContain('      const lane = laneOpenness(p.pos, point, opp.players);');
    expect(playerSource).toContain('      const lane = laneOpenness(p.pos, arr.pos, opp.players);');
    expect(playerSource).toContain('      sT *= 0.3 + laneOpenness(p.pos, mate.pos, opp.players) * 0.7;');
    const outside = playerSource.replace(SEAT_SPAN, '').replace(
      "import { laneOpenness as laneOpennessShipped, laneOpennessFront } from './perception';", '');
    expect(count(outside, /laneOpennessFront|opFrontMan|const laneOpenness =/g)).toBe(0);
    // the shipped import line is byte-unchanged; the seam's import is a NEW line
    expect(playerSource).toContain(
      '  airLaneOpenness, canInterceptPass, effectiveBlockers, interceptBall, laneOpenness, opennessAt,');
    expect(playerSource).toContain(
      "import { laneOpenness as laneOpennessShipped, laneOpennessFront } from './perception';");
  });

  it('⛔ no other lane: ownLaneOpenness, airLaneOpenness, the snapshot chooser and the exposure terms name neither the door nor the front form', () => {
    for (const f of ['ai/ownLaneSeat.ts', 'ai/perceivedPassChoice.ts', 'ai/deliveryValueSeat.ts',
      'ai/perceptionSnapshot.ts', 'ai/passCorridorInterception.ts'] as const) {
      expect(count(src(f), /laneOpennessFront|opFrontMan/g), f).toBe(0);
    }
    expect(fnSpan(perceptionSource, 'airLaneOpenness')).not.toContain('Front');
    expect(fnSpan(perceptionSource, 'laneOpenness')).not.toContain('CONTROL_RADIUS');
  });
});

/* ------------------------------------------------------------------ */
/* F5 — THE FORM (M-OP.2)                                              */
/* ------------------------------------------------------------------ */

describe('OP T0 — THE FORM: `laneOpennessFront` is `laneOpenness` line for line except the guard', () => {
  it('the executable lines differ EXACTLY in the guard and the normaliser, enumerated', () => {
    const a = codeLines(fnSpan(perceptionSource, 'laneOpenness'));
    const b = codeLines(fnSpan(perceptionSource, 'laneOpennessFront'));
    expect(a[0]).toBe('export function laneOpenness(from: V2, to: V2, opponents: Player[]): number {');
    expect(b[0]).toBe('export function laneOpennessFront(from: V2, to: V2, opponents: Player[]): number {');
    const onlyShipped = a.slice(1).filter((l) => !b.includes(l));
    const onlyFront = b.slice(1).filter((l) => !a.includes(l));
    expect(onlyShipped).toEqual([
      'if (dist(cp, from) < 1.5) continue;',
      'worst = Math.min(worst, clamp01(d / 4));',
    ]);
    expect(onlyFront).toEqual([
      'const along = dist(cp, from);',
      'if (along === 0) continue;',
      'worst = Math.min(worst, clamp01(d / (along < 1.5 ? CONTROL_RADIUS : 4)));',
    ]);
    expect(b.length).toBe(a.length + 1);
  });

  it('⛔ NO NEW CONSTANT: the numbers are 1 · 1.5 · 4 (shipped) and 0 (the clamp\'s own output); CONTROL_RADIUS is the engine\'s, imported', () => {
    const code = codeLines(fnSpan(perceptionSource, 'laneOpennessFront')).join('\n');
    const nums = [...new Set(code.match(/(?<![\w.])\d+(\.\d+)?(?![\w.])/g) ?? [])].sort();
    expect(nums).toEqual(['0', '1', '1.5', '4']);
    expect(perceptionSource).toContain("import { CONTROL_RADIUS } from '../sim/constants';");
    // the shipped import line is byte-unchanged; CONTROL_RADIUS arrives on a NEW line
    expect(perceptionSource).toContain(
      "import { BALL_FRICTION_K, GRAVITY, HALF_L, HALF_W, UNSET_BLOCK_WEIGHT } from '../sim/constants';");
  });
});

/* ------------------------------------------------------------------ */
/* F6 — THE SEAM MAP                                                   */
/* ------------------------------------------------------------------ */

describe('OP T0 — the seam map', () => {
  it('the flag and the front form are named at exactly the files the doc names, and nowhere else (paths normalized to /)', () => {
    const flagFiles = new Map<string, number>();
    const formFiles = new Map<string, number>();
    const aliasFiles = new Map<string, number>();
    for (const f of srcFiles('src')) {
      const code = codeLines(readFileSync(f, 'utf8')).join('\n');
      const a = count(code, /opFrontMan/g);
      const b = count(code, /laneOpennessFront/g);
      const c = count(code, /laneOpennessShipped/g);
      if (a > 0) flagFiles.set(f, a);
      if (b > 0) formFiles.set(f, b);
      if (c > 0) aliasFiles.set(f, c);
    }
    // #437 item 4 (OP-ENTRY): the entry layer `src/game/a4World.ts` joins the map with EXACTLY
    // its two executable sites — world 19's `OP_WORLD_DOORS` literal and `opArmedVersion`'s ONE read
    expect([...flagFiles.keys()].sort())
      .toEqual(['src/ai/PlayerBrain.ts', 'src/game/a4World.ts', 'src/sim/League.ts', 'src/sim/Match.ts']);
    // Match.ts: the config key, the readonly field, and the init line (which names it TWICE)
    expect(flagFiles.get('src/sim/Match.ts')).toBe(4);
    expect(flagFiles.get('src/sim/League.ts')).toBe(1);
    expect(flagFiles.get('src/ai/PlayerBrain.ts')).toBe(1);
    expect(flagFiles.get('src/game/a4World.ts')).toBe(2);
    // the front form: its definition, and the seat's import + the seat line
    expect([...formFiles.keys()].sort()).toEqual(['src/ai/PlayerBrain.ts', 'src/ai/perception.ts']);
    expect(formFiles.get('src/ai/perception.ts')).toBe(1);
    expect(formFiles.get('src/ai/PlayerBrain.ts')).toBe(2);
    expect([...aliasFiles.entries()]).toEqual([['src/ai/PlayerBrain.ts', 2]]);
  });

  it('the gate lines are the source literals the doc quotes', () => {
    expect(matchSource).toContain('  opFrontMan?: boolean;');
    expect(matchSource).toContain('  readonly opFrontMan: boolean;');
    expect(matchSource).toContain('    this.opFrontMan = cfg.opFrontMan ?? false;');
    expect(leagueSource).toContain("    | 'opFrontMan'");
    expect(playerSource).toContain(SEAT_LINE);
    for (const f of srcFiles('src')) {
      const text = readFileSync(f, 'utf8');
      expect(count(text, /\.opFrontMan\s*=[^=]/g), f).toBe(f === 'src/sim/Match.ts' ? 1 : 0);
      // #437 item 4: the flag is SET true in exactly ONE src place — world 19's door literal
      expect(count(text, /opFrontMan:\s*true/g), f).toBe(f === 'src/game/a4World.ts' ? 1 : 0);
      expect(count(text, /process\.env[^\n]*opFrontMan/g), f).toBe(0);
    }
  });

  it('Road B: NO world 1–18 carries the flag; `a4World.ts` names it only in world 19\'s bundle and reader; `League.toJSON` omits it', () => {
    // #437 item 4: world 19's OWN two executable sites (the door literal; the version reader),
    // nowhere in prose; the front FORM is still named nowhere in the entry layer
    expect(count(a4Source, /opFrontMan/g)).toBe(2);
    expect(count(a4Source, /laneOpennessFront/g)).toBe(0);
    const worlds: A4ArmedVersion[] =
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    for (const w of worlds) {
      expect((a4MatchFlags(w) as Record<string, unknown>).opFrontMan, `world ${w}`).toBeUndefined();
    }
    expect((a4MatchFlags(19) as Record<string, unknown>).opFrontMan).toBe(true);
    for (const w of [13, 17, 18] as const) {
      expect(matchOf(BASE, { world: w }).opFrontMan, `world ${w}`).toBe(false);
    }
    const l = new League({ seed: BASE });
    expect(JSON.stringify(l.toJSON())).not.toContain('opFrontMan');
  });

  it('the match-flag key union grew by EXACTLY one, dormant', () => {
    const union = leagueSource.slice(
      leagueSource.indexOf('matchFlags: Partial<Pick<MatchConfig,'),
      leagueSource.indexOf('>> = {};'),
    );
    expect(count(union, /'opFrontMan'/g)).toBe(1);
    expect(count(union, /'ifFlightRun'/g)).toBe(1);
    expect(count(union, /'bkGroundCorridor'/g)).toBe(1);
  });
});

/* ------------------------------------------------------------------ */
/* F7 — THE MUTANT WALK                                                */
/* ------------------------------------------------------------------ */

/**
 * ⭐⭐⭐ THE MUTATION TEXTS OF RECORD. Each row is the WHOLE LINE REPLACED → THE REPLACEMENT in
 * the named file, exactly as applied in place before this whole file was re-run and the
 * original restored and sha256-verified (stage doc §PINS records the observed red counts).
 * M4 is TWO replacements in one file (the call and the import it needs).
 */
const MUTANTS: readonly { id: string; file: string; edits: readonly { from: string; to: string }[] }[] = [
  {
    id: 'M1 — the SHIPPED guard kept',
    file: 'ai/perception.ts',
    edits: [{ from: '    if (along === 0) continue;', to: '    if (along < 1.5) continue;' }],
  },
  {
    id: 'M2 — the 4 m normaliser used inside 1.5 m',
    file: 'ai/perception.ts',
    edits: [{
      from: '    worst = Math.min(worst, clamp01(d / (along < 1.5 ? CONTROL_RADIUS : 4)));',
      to: '    worst = Math.min(worst, clamp01(d / 4));',
    }],
  },
  {
    id: 'M3 — the flag INVERTED',
    file: 'ai/PlayerBrain.ts',
    edits: [{
      from: SEAT_LINE,
      to: '      const laneOpenness = !match.opFrontMan ? laneOpennessFront : laneOpennessShipped;',
    }],
  },
  {
    id: 'M4 — the seat applied to ownLaneOpenness too',
    file: 'ai/ownLaneSeat.ts',
    edits: [
      {
        from: "import { laneOpenness } from './perception';",
        to: "import { laneOpenness, laneOpennessFront } from './perception';",
      },
      {
        from: '  return laneOpenness(from, aim, kept as unknown as Player[]);',
        to: '  return laneOpennessFront(from, aim, kept as unknown as Player[]);',
      },
    ],
  },
];

describe('OP T0 — the mutant walk (FOUR mutants, each with the pins that kill it)', () => {
  it('⭐ the mutation table is REPRODUCIBLE: every `from` line occurs EXACTLY ONCE in its file, every `to` ZERO times', () => {
    // M2's replacement is the SHIPPED normaliser line, which exists once in `laneOpenness`
    // itself — so its `to` count is ONE (the shipped function), never two.
    for (const m of MUTANTS) {
      const lines = src(m.file).split('\n');
      for (const e of m.edits) {
        expect(lines.filter((l) => l === e.from).length, `${m.id} — replaced`).toBe(1);
        expect(lines.filter((l) => l === e.to).length, `${m.id} — replacement`)
          .toBe(m.id.startsWith('M2') ? 1 : 0);
        expect(e.to, m.id).not.toBe(e.from);
      }
    }
    expect(MUTANTS).toHaveLength(4);
  });

  it('M1 — the shipped guard kept: killed by fixture (3) (a man 1 m ahead on the line must read 0) and at source by the form', () => {
    expect(laneOpennessFront(FROM, TO, [man(1, 0)])).toBe(0);
    expect(laneOpennessFront(FROM, TO, [man(0.3, 0.1)])).toBeLessThan(1);
    expect(fnSpan(perceptionSource, 'laneOpennessFront')).toContain('    if (along === 0) continue;');
  });

  it('M2 — the 4 m normaliser inside 1.5 m: killed by fixture (5) (CONTROL_RADIUS aside must read 1) and at source by the form', () => {
    expect(laneOpennessFront(FROM, TO, [man(1, CONTROL_RADIUS)])).toBe(1);
    expect(laneOpennessFront(FROM, TO, [man(1, CONTROL_RADIUS / 2)])).toBe(0.5);
    expect(fnSpan(perceptionSource, 'laneOpennessFront')).toContain('CONTROL_RADIUS : 4');
  });

  it('M3 — the flag inverted: killed by G-OFF, by the ZERO-call count with the door shut, and at source by the seat line', () => {
    expect(count(playerSource, /!match\.opFrontMan/g)).toBe(0);
    expect(playerSource).toContain(SEAT_LINE);
    probe.calls = 0;
    play(matchOf(M3_SEED, { world: 18 }));
    expect(probe.calls).toBe(0);
  }, 180_000);

  it('M4 — the seat applied to ownLaneOpenness: killed by the own-lane fixture (an own man 1 m ahead stays SKIPPED) and by the seam map', () => {
    const body = (gid: number, x: number, y: number) =>
      ({ gid, pos: { x, y }, sentOff: false, role: 'MF' });
    // passer gid 1, target gid 2; one own man 1 m ahead on the line — the LN law skips him
    expect(ownLaneOpenness(FROM, TO, [body(1, 0, 0), body(2, 10, 0), body(3, 1, 0)], 1, 2)).toBe(1);
    expect(count(ownLaneSource, /laneOpennessFront|opFrontMan/g)).toBe(0);
    expect(ownLaneSource).toContain('  return laneOpenness(from, aim, kept as unknown as Player[]);');
  });
});

/* ------------------------------------------------------------------ */
/* F8 — THE BAND                                                       */
/* ------------------------------------------------------------------ */

describe('OP T0 — the scratch band', () => {
  it('EVERY seed this file walks is derived from the ONE declared base and inside 900,009,800–899', () => {
    expect(BASE).toBe(900_009_800);
    const all = [...G_SEEDS, ...DORMANT_SEEDS, ...ARMED_SEEDS, SWEEP_SEED, ...MOVE_SEEDS, M3_SEED];
    for (const s of all) {
      expect(s).toBeGreaterThanOrEqual(900_009_800);
      expect(s).toBeLessThanOrEqual(900_009_899);
    }
    // ⛔ the verifier's band 900,009,900–999 is not touched
    expect(all.some((s) => s >= 900_009_900)).toBe(false);
  });
});
