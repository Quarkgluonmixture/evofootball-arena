import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { Match } from '../src/sim/Match';
import { League } from '../src/sim/League';
import { runHeadless } from '../src/sim/simRunner';
import { DT } from '../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import type { Player } from '../src/sim/Player';
import type { Team } from '../src/sim/Team';
import { decidePlayer } from '../src/ai/PlayerBrain';
import type { PerceptionMemory } from '../src/ai/perceptionSnapshot';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import {
  a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells, type A4ArmedVersion,
} from '../src/game/a4World';
import { Rng } from '../src/utils/rng';

/**
 * ⭐⭐⭐ IF T0b — 「球在飞时的前插 · 看见出脚」 THE FLIGHT-RUN SEAM, RESTRAINED
 * (docs/world-model/IF-T0-FLIGHT-RUN-SEAM.md §LAW-B; contract IF-FLIGHT-RUN-CONTRACT.md §2
 * M-IF.1–6; COMMANDER RULING #417 item 3 as AMENDED by #418 item 5, CORRECTED by #419
 * items 2–4 and ⭐ AMENDED AGAIN by #422 items 2–3) — THE SEAM'S PERMANENT PIN SUITE, in the
 * `tests/dsCoopHatsOff.test.ts` form.
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * WHAT THIS IS: ONE dormant flag (`match.ifFlightRun`), ONE per-body belief
 * (`match.ifLastSeenOwnerGid`, now a RECORD `{ ownerGid, look }`), ONE per-body LOOK COUNTER
 * (`match.ifLook`), ONE more PERCEIVED state inside the own-run fork, and ONE more `why` —
 * 'own run onto the flight', the EIGHTH literal. NO constant, NO gene, NO truth read, NO
 * second percept pull. Dormant. Ships nothing.
 *
 * ⭐⭐⭐ WHAT IF-T0b ADDS (ruling #422 item 2, the user's delegation 「按照vision来吧」 ⇒ 乙 + 甲):
 *   **M-IF.5 — THE GAME IS LIVE.** The eighth state additionally requires
 *   `match.phase === 'playing'`. At a dead ball it is FALSE; the seventh is untouched.
 *   **M-IF.6 — HE SAW IT LEAVE.** The belief carries the INDEX OF THE LOOK that wrote it, and
 *   the eighth state holds ONLY when that index is his IMMEDIATELY PREVIOUS look
 *   (`belief.look === thisLook - 1`) — an index equality of the `cands.length - 1` kind, ⛔
 *   NOT a tick bound, ⛔ NOT an age bound. A sighting two looks ago, an opponent, himself, or
 *   no sighting at all ⇒ he does not start.
 *
 * ⭐⭐⭐ THE ARCHITECTURE (canon "digests carry their architecture", home: ruling #418 item 2).
 * Every whole-match digest and the fingerprint of record are keyed by `process.arch`. The
 * **x64** column was RE-RECORDED BY THE EXECUTOR at this stage's dispatch head `59cd9f7` in a clean
 * throwaway worktree before one byte of this seam existed. The **arm64** column is INHERITED
 * BY IDENTITY from `tests/dsCoopHatsOff.test.ts`'s `HEAD_DIGESTS` — the SAME twelve seeds
 * (900,007,400–411), the SAME `signatureOf` recipe and the SAME pooling digest, on worlds
 * that are byte-identical since `f1a46b1` (#413 / #415) — literal for literal, the source
 * suite named. World 17 has NO arm64 literal of record with this recipe ⇒ it is **ABSENT**,
 * and its pin SKIPS on arm64 and says so in its title. ⛔ Never a guess, never a number
 * typed from memory.
 *
 * The pins (§PINS-B of the stage doc is the inventory; this file IS the living copy):
 *   F0  THE FIXTURE   ⭐ the INTENDED-RECEIVER fixture FIRST (canon "walk-side definitions
 *                     pinned", FIFTH strike, #416 item 3(i)): a FIRING and a NON-FIRING case
 *                     for `pendingPass.targetGid === p.gid`, the predicate IF-C0 carried
 *                     unfixtured. Same pass, same target, opposite outcomes — so the face has
 *                     both arms, and the seam is shown to read the BELIEF, never the pass.
 *   F0b ⭐ THE SEVEN FIXTURES of IF-T0b (#422 item 3(ii)), each built BY HAND on a
 *                     constructed match and a constructed body: (a) the previous look saw a
 *                     MATE with the ball, this look sees it ownerless, the phase is 'playing'
 *                     ⇒ the EIGHTH `why`; (b) the same with the phase a RESTART ⇒ NOT;
 *                     (c) the sighting TWO looks ago ⇒ NOT; (d) the previous look saw an
 *                     OPPONENT ⇒ NOT; (e) the previous look saw HIMSELF ⇒ NOT; (f) NO
 *                     previous look at all ⇒ NOT; (g) the look counter increments EXACTLY
 *                     ONCE per evaluation and the pull count stays ONE (the DS-T1c idiom).
 *   F1  G-OFF        the flag absent ⇒ whole-match signatures (rng draw included) reproduce
 *                    the ARCH-KEYED digests recorded at the dispatch head; the fingerprint;
 *                    ABSENT ≡ EXPLICITLY FALSE.
 *   F2  THE MAPS      BOTH maps EMPTY over whole matches with the flag absent (COUNTS, not a
 *                     text claim); non-vacuously written when armed.
 *   F3  ARMED         worlds 16 and 17 + the flag: the eighth `why` appears in
 *                     `p.action.scores` and the SEVENTH still appears.
 *   F4  CONTAINED     the flag on a world WITHOUT `dsOwnRun` (13, bare) ⇒ ZERO eighth-why
 *                     decisions and BOTH maps still EMPTY.
 *   F5  THE PULL      one `perceivedSnapshot` per own-run evaluation, UNCHANGED by the flag
 *                     (the DS-T1c spied-vs-unspied idiom).
 *   F6  THE READ SET  source needles over the seam span: `pendingPass` · `match.ball` ·
 *                     `ball.owner` · `lastTouch` · `info.genome` each ZERO; ⭐ `match.phase`
 *                     ALLOWED from #422 item 2 and COUNTED at exactly its occurrences.
 *   F7  THE SEAM MAP  per-file executable-line occurrence counts, paths normalized to '/'
 *                     (#418 item 2(iv) — `join()` yields a backslash on this host).
 *   F8  THE LITERALS  the SEVEN unchanged + the eighth exactly once.
 *   F9  THE MUTANT WALK — SEVEN mutants at RUNTIME and at SOURCE, each row carrying its
 *                     EXACT mutation text; M4 dies on a stored seed where the PERCEIVED and
 *                     the TRUTH owner DIVERGE, found by scan.
 *   F10 THE BAND      every walk but G-OFF inside 900,008,600–699, every base derived from
 *                     the ONE declared `BASE`.
 *
 * ⚠ THE SEED BANDS. Every walk in this file but ONE lives in the scratch band
 * **900,008,600–699** that ruling #422 item 3(iv) gives this stage, derived from the ONE
 * declared `BASE`. The EXCEPTION is G-OFF, which ruling #418 item 5(i) moves to DS-T0d's own
 * twelve seeds **900,007,400–411** so that the arm64 column can be INHERITED BY IDENTITY —
 * a DECLARED positive deviation for that pin only (stage doc §DEVIATIONS-B 3). Canon, VERBATIM:
 * "verifier scratch walks use the stage's own consumed band or the out-of-band scratch range
 * (≥ 900,000,000) — never the next virgin block". ZERO frontier, ZERO stats.
 *
 * ⭐ Receipts are receipts (home: ruling #289 item 1): every count below is ARMING PLUMBING.
 * What the flight run PRODUCES is IF-T1's question, and this stage claims none of it.
 */

const ARCH = process.arch;

/**
 * The production fingerprint of record, ARCH-KEYED (#418 items 1 and 5(ii)): arm64
 * `57b0bdab…c673` is the value of record (the Mac, CI `macos-latest`) and is copied literal
 * for literal from `tests/dsOwnRun.test.ts`; x64 `59f42aa7…a072d` is ruling #418 item 1's own
 * measured value, of record from that ruling.
 */
const FINGERPRINT_OF_RECORD: Readonly<Record<string, string>> = {
  arm64: '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
  x64: '59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d',
};

/** ⚠ THE ONE DECLARED BASE. Every seed in this file but G-OFF's is `BASE + k`, `0 ≤ k ≤ 99`. */
const BASE = 900_008_600;
/** ⚠ G-OFF's own band — DS-T0d's, by ruling #418 item 5(i). Declared, §DEVIATIONS 3. */
const G_BASE = 900_007_400;
const G_SEEDS: readonly number[] = Array.from({ length: 12 }, (_, i) => G_BASE + i);
/** the armed whole-match walks (F2/F3) */
const ARMED_SEEDS: readonly number[] = Array.from({ length: 4 }, (_, i) => BASE + 20 + i);
/** the containment walks (F4) — the flag on a world WITHOUT `dsOwnRun` */
const CONTAINED_SEEDS: readonly number[] = Array.from({ length: 4 }, (_, i) => BASE + 30 + i);
/** the pull counter (F5) */
const PULL_SEED = BASE + 40;
/** the M4 divergence scan (F9) */
const M4_SCAN_SEEDS: readonly number[] = Array.from({ length: 12 }, (_, i) => BASE + 60 + i);
/**
 * ⭐ THE STORED M4 SEED — the FIRST seed of the scan band on which the body's OWN FRESH
 * memory of the last owner (M-IF.6: the entry written at his immediately previous look) and
 * the TRUTH's current owner DIVERGE at a live flight evaluation, so that the honest state
 * fires where a `match.ball.owner` read does not (or the reverse). FOUND BY SCAN (the scan is
 * re-run below and must return exactly this seed), never chosen. RE-DERIVED at IF-T0b in the
 * new band: EVERY seed of 900,008,660–671 diverges (863 · 1,609 · 1,216 · 764 · 926 · 709 ·
 * 1,098 · 919 · 930 · 1,152 · 924 · 702), so the stored seed is the band's FIRST and the scan
 * REPRODUCES it rather than SELECTING it (the #419 item 4(ii) wording, inherited).
 */
const M4_SEED = 900_008_660;

/**
 * ⭐⭐ THE DIGESTS OF RECORD, ARCH-KEYED.
 *
 * **x64** — RE-RECORDED AT THIS STAGE'S DISPATCH HEAD `59cd9f7` (ruling #422's own commit)
 * in a clean throwaway worktree (`git worktree add <scratch>/if-t0b-base 59cd9f7`,
 * `node_modules` given by a Windows junction, `git status --short` EMPTY) BEFORE one byte of
 * IF-T0b existed, on the twelve seeds 900,007,400–411, and pasted here as literals. They are
 * what "byte-identical to the dispatch HEAD" MEANS on this architecture.
 * ⭐ MEASURED, and stated either way: all five are CHARACTER-FOR-CHARACTER the literals IF-T0
 * recorded at `595a555`. The OFF world CANNOT move — IF-T0 banked DORMANT and nothing between
 * the two heads touched `src/**` — and the pin below asserts that identity explicitly rather
 * than leaving it as prose.
 *
 * **arm64** — INHERITED BY IDENTITY (#418 item 2(ii) route (a)) from
 * `tests/dsCoopHatsOff.test.ts`'s `HEAD_DIGESTS`, recorded at `f1a46b1`: the same twelve
 * seeds, the same `signatureOf`, the same pooling digest, and worlds ≤ 16 byte-identical
 * since that head (#413 / #415). Literal for literal:
 *   bare `a81e4054…0245` · w13 `d7b9b9e6…2f88` · w15 `1c959b52…b9b5` · w16 `2b78c8a9…4b61`.
 * World **17** has no arm64 literal of record with this recipe ⇒ **ABSENT** (the pin skips on
 * arm64 and says so in its title). ⛔ No arm64 number here was measured on this host.
 */
const HEAD_COMMIT = '59cd9f7';
const HEAD_DIGESTS: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  x64: {
    bare: '43d4174d25ace8232eb866b917c10835da26f4399b67d3be0a0897e29c6a1d16',
    w13: '796b13a3050dbc9e7c64adf8e97f6593db59974c08135ed71b00fdc13b8693f0',
    w15: '7b5fcd1b7951aa8804149a550f9abd51206694285518c87b4a238163126cf805',
    w16: '4ca9ac542702cf53ae0d2c020cbe0af0b70fcf2aec7efe2dbdde349ee02ecfa0',
    w17: '6b5ecaa31b9e50f5be52c19dba216e75e647aa29d8b82793d96c241364e5971d',
  },
  arm64: {
    bare: 'a81e40542c6f2c1d2266514d93d24fa2ae989eea40d0e65054129ffa21a80245',
    w13: 'd7b9b9e6f96b0dd15d29e2293ed80b9e1f9aacbbabbcb6401fd92be9f2ec2f88',
    w15: '1c959b52dfb95d3283836456c63800a1b3993b720c8cb41cad4d05473422b9b5',
    w16: '2b78c8a9312610ac7d847f8ca8d8c40a632c7eab468ff59f614e1fc19f994b61',
  },
};
/**
 * ⭐⭐ IF-T0's OWN x64 COLUMN, recorded at `595a555` and copied here literal for literal so
 * that the re-record can be STATED EITHER WAY (#422 item 3(ii): "they should equal IF-T0's x64
 * literals — the OFF world cannot move — state it either way"). The pin below asserts the
 * equality; if a future head ever moves the OFF world, this pin is what says so out loud.
 */
const IF_T0_X64_DIGESTS: Readonly<Record<string, string>> = {
  bare: '43d4174d25ace8232eb866b917c10835da26f4399b67d3be0a0897e29c6a1d16',
  w13: '796b13a3050dbc9e7c64adf8e97f6593db59974c08135ed71b00fdc13b8693f0',
  w15: '7b5fcd1b7951aa8804149a550f9abd51206694285518c87b4a238163126cf805',
  w16: '4ca9ac542702cf53ae0d2c020cbe0af0b70fcf2aec7efe2dbdde349ee02ecfa0',
  w17: '6b5ecaa31b9e50f5be52c19dba216e75e647aa29d8b82793d96c241364e5971d',
};

/** the arm64 column's SOURCE SUITE, named as the inheritance requires */
const ARM64_SOURCE_SUITE = 'tests/dsCoopHatsOff.test.ts';
const ARM64_SOURCE_HEAD = 'f1a46b1';

/** the SEVENTH (DS-T0's) and the EIGHTH (this seam's, the ONLY string it adds to the menu) */
const OWN_RUN_WHY = 'own run in behind';
const FLIGHT_RUN_WHY = 'own run onto the flight';

/** the six census literals, READ OFF THE ARTIFACT by field name (canon "doc-prose fidelity") */
const CENSUS = JSON.parse(readFileSync(
  'docs/world-model/data/ds-c0-designation-census.json', 'utf8',
)) as { definitions: { engineConstants: { whyLiterals: Record<string, string> } } };
const WHY_LITERALS = CENSUS.definitions.engineConstants.whyLiterals;

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
  flight?: boolean;
  flightExplicitFalse?: boolean;
  own?: boolean;
  eager?: boolean;
  world?: 13 | 15 | 16 | 17;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const base = a.world === undefined ? {} : a4MatchFlags(a.world);
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    duration: 240,
    ...base,
    ...(a.flight === true ? { ifFlightRun: true } : {}),
    ...(a.flightExplicitFalse === true ? { ifFlightRun: false } : {}),
    ...(a.own === true ? { dsOwnRun: true, edsPerceivedDefence: true } : {}),
    ...(a.eager === true ? { edsEagerPerception: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (a.world !== undefined) armA4World(m, null, a.world, L3_DOSE, PC_DOSE);
  return m;
};

/**
 * ⭐⭐ THE WORLD-IDENTITY SIGNATURE — BYTE-EQUAL to `tests/dsCoopHatsOff.test.ts`'s
 * `signatureOf`, which is what makes the arm64 column INHERITABLE BY IDENTITY. Do not touch
 * it without re-recording both columns.
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

/**
 * ⭐ THE SEAM SPAN — from the two ALIAS lines (the flag and the belief, the FIRST two
 * statements INSIDE the own-run fork — M-IF.4's placement, restored by ruling #419 item 2)
 * through the fork's own closing brace. Every read-set pin below runs over THIS text.
 */
const SEAM_SPAN = ((): string => {
  const lines = playerSource.split('\n');
  const start = lines.findIndex((l) => l.trim() === 'const ifFlightRun = match.ifFlightRun;');
  expect(start).toBeGreaterThan(0);
  const end = lines.findIndex((l, i) => i > start && l === '    }');
  expect(end).toBeGreaterThan(start);
  return lines.slice(start, end + 1).join('\n');
})();

/* ------------------------------------------------------------------ */
/* F0 — ⭐ THE INTENDED-RECEIVER FIXTURE (the suite's FIRST fixture)     */
/* ------------------------------------------------------------------ */

/** A staged in-possession moment: an unhatted, untired, non-carrier outfield body. */
interface Scene { m: Match; p: Player; t: Team }
const stage = (seed: number, a: Arm = {}): Scene => {
  const m = matchOf(seed, { own: true, eager: true, flight: true, ...a });
  for (let ticks = 0; ticks < 8_000; ticks++) {
    m.step(DT);
    if (m.phase !== 'playing') continue;
    const side = m.possessionSide;
    if (side !== 0 && side !== 1) continue;
    const t = m.teams[side];
    for (const p of t.players) {
      if (p.role === 'GK' || p.sentOff || m.ball.owner === p) continue;
      if (p.stamina < 0.4 && t.genome.staminaConservation > 0.5) continue;
      t.runners.clear();
      t.arriver = null;
      t.overlapper = null;
      p.wallRun = null;
      return { m, p, t };
    }
  }
  throw new Error('no staged subject');
};

/**
 * Write ONE body's perception memory by hand (the `tests/dsOwnRun.test.ts` helper). With
 * `edsEagerPerception` armed `perceivedSnapshot` materialises the memory AS GIVEN, so this IS
 * the snapshot the seam reads.
 */
const inject = (m: Match, p: Player, ownerGid: number | null, seesBall = true): void => {
  const players = new Map<number, {
    gid: number; side: 0 | 1; pos: { x: number; y: number }; vel: { x: number; y: number };
    bodyDir: { x: number; y: number }; observedTick: number;
  }>();
  for (const q of m.allPlayers) {
    players.set(q.gid, {
      gid: q.gid, side: q.side, pos: { x: q.pos.x, y: q.pos.y }, vel: { x: 0, y: 0 },
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

const unhat = (s: Scene): void => {
  s.t.runners.clear();
  s.t.arriver = null;
  s.t.overlapper = null;
  s.p.wallRun = null;
};

/** the score pushed under a given `why`, or null when that candidate does not exist */
const whyScore = (m: Match, p: Player, why: string): number | null => {
  const c = p.action.scores.find((x) => x.why === why);
  return c === undefined ? null : c.score;
};

/** a same-side mate who is neither the subject nor the keeper */
const mateOf = (s: Scene): Player =>
  s.t.players.filter((q) => q.gid !== s.p.gid && q.role !== 'GK' && !q.sentOff)[0];

/** his belief AS A RECORD (M-IF.6): `{ ownerGid, look }`, or null when he has none */
const beliefOf = (m: Match, p: Player): { ownerGid: number; look: number } | null =>
  m.ifLastSeenOwnerGid.get(p.gid) ?? null;
/** his look counter (M-IF.6) — 0 when the fork has never evaluated for him under the door */
const lookOf = (m: Match, p: Player): number => m.ifLook.get(p.gid) ?? 0;
/**
 * ⭐ HAND-BUILD the body: wipe HIS OWN two entries so the fixture below starts from a state
 * the test wrote, not one the staging walk left behind. (`stage()` steps a live armed match,
 * so a subject may arrive with looks and a belief already counted.)
 */
const resetBody = (m: Match, p: Player): void => {
  m.ifLastSeenOwnerGid.delete(p.gid);
  m.ifLook.delete(p.gid);
};

/** ⭐ the pass that the census's unfixtured predicate reads: THIS body is the intended target */
const aimAt = (s: Scene, passerGid: number): void => {
  s.m.pendingPass = {
    side: s.t.side, passerGid, targetGid: s.p.gid, t: s.m.simTime,
    offside: false, offsideSpot: null,
  };
};

describe('IF T0 — ⭐ the INTENDED-RECEIVER fixture (#416 item 3(i); canon walk-side definitions)', () => {
  it('FIRING — the pass is aimed AT HIM, his eyes say the ball is loose and the last body he saw with it was a mate ⇒ the EIGHTH `why`', () => {
    const s = stage(BASE + 1, { world: 16 });
    const mate = mateOf(s);
    // (1) he SEES a mate on the ball — the seam writes his belief and the SEVENTH fires
    inject(s.m, s.p, mate.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(beliefOf(s.m, s.p)?.ownerGid).toBe(mate.gid);
    expect(beliefOf(s.m, s.p)?.look).toBe(lookOf(s.m, s.p));
    expect(whyScore(s.m, s.p, OWN_RUN_WHY)).not.toBeNull();
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).toBeNull();
    // (2) the ball leaves the mate's foot AND IS AIMED AT HIM — the predicate IF-C0 could not
    //     fixture. His eyes now show a ball with NO owner; his memory still holds the mate.
    inject(s.m, s.p, null);
    aimAt(s, mate.gid);
    expect(s.m.pendingPass?.targetGid).toBe(s.p.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    const eighth = whyScore(s.m, s.p, FLIGHT_RUN_WHY);
    expect(eighth).not.toBeNull();
    // the two states are MUTUALLY EXCLUSIVE — the seventh is not also pushed
    expect(whyScore(s.m, s.p, OWN_RUN_WHY)).toBeNull();
    // M-IF.3: the SAME candidate at the SAME score — the only difference is the label
    expect(s.p.action.scores.filter((x) => x.action === 'MakeRun')).toHaveLength(1);
    expect(eighth).toBeGreaterThanOrEqual(0);
  });

  it('NON-FIRING — the SAME pass aimed at the SAME body, but the last body he saw with the ball was an OPPONENT ⇒ no candidate at all', () => {
    const s = stage(BASE + 2, { world: 16 });
    const mate = mateOf(s);
    const opp = s.m.teams[1 - s.t.side].players.filter((q) => q.role !== 'GK')[0];
    // an opponent seen with the ball CLEARS the mate state (M-IF.2)
    inject(s.m, s.p, opp.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(beliefOf(s.m, s.p)?.ownerGid).toBe(opp.gid);
    expect(whyScore(s.m, s.p, OWN_RUN_WHY)).toBeNull();
    // the pass is aimed at him exactly as in the firing case…
    inject(s.m, s.p, null);
    aimAt(s, mate.gid);
    expect(s.m.pendingPass?.targetGid).toBe(s.p.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    // …and NOTHING fires: the seam reads HIS BELIEF, never the pass.
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).toBeNull();
    expect(whyScore(s.m, s.p, OWN_RUN_WHY)).toBeNull();
  });

  it('NON-FIRING — the pass is aimed at him and he never SAW anybody with the ball ⇒ an empty memory starts nobody', () => {
    const s = stage(BASE + 3, { world: 16 });
    const mate = mateOf(s);
    inject(s.m, s.p, null);
    aimAt(s, mate.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(s.m.ifLastSeenOwnerGid.has(s.p.gid)).toBe(false);
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).toBeNull();
  });

  it('HIMSELF remembered ⇒ no flight run (the state needs a MATE who is not him)', () => {
    const s = stage(BASE + 4, { world: 16 });
    inject(s.m, s.p, s.p.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(beliefOf(s.m, s.p)?.ownerGid).toBe(s.p.gid);
    inject(s.m, s.p, null);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).toBeNull();
  });

  it('the flag ABSENT ⇒ the same scene fires NOTHING and writes NOTHING', () => {
    const s = stage(BASE + 5, { world: 16, flight: false });
    const mate = mateOf(s);
    inject(s.m, s.p, mate.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(s.m.ifLastSeenOwnerGid.size).toBe(0);
    expect(s.m.ifLook.size).toBe(0);
    inject(s.m, s.p, null);
    aimAt(s, mate.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).toBeNull();
    expect(s.m.ifLastSeenOwnerGid.size).toBe(0);
    expect(s.m.ifLook.size).toBe(0);
  });
});

/* ------------------------------------------------------------------ */
/* F0b — ⭐ THE SEVEN FIXTURES of IF-T0b (M-IF.5 and M-IF.6)             */
/* ------------------------------------------------------------------ */

/**
 * ⭐⭐⭐ Each fixture below is built BY HAND on a constructed match and a constructed body:
 * the two per-body entries are wiped (`resetBody`), his perception memory is written by hand
 * (`inject`), his hats are removed (`unhat`), and each `decidePlayer` call is exactly ONE
 * LOOK. That makes "the previous look" a fact the test CONSTRUCTS rather than one it hopes
 * for. The phase is set on the match object, which is what M-IF.5 reads.
 */
describe('IF T0b — ⭐ the SEVEN FIXTURES: he starts only when he SAW IT LEAVE, and only live', () => {
  it('(a) FIRING — the PREVIOUS look saw a MATE with the ball, THIS look sees it ownerless, phase `playing` ⇒ the EIGHTH `why`', () => {
    const s = stage(BASE + 1, { world: 16 });
    const mate = mateOf(s);
    resetBody(s.m, s.p);
    s.m.phase = 'playing';
    // LOOK 1 — a mate has it. The belief is written AT THIS LOOK.
    inject(s.m, s.p, mate.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(lookOf(s.m, s.p)).toBe(1);
    expect(beliefOf(s.m, s.p)).toEqual({ ownerGid: mate.gid, look: 1 });
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).toBeNull();
    // LOOK 2 — the ball he sees has NO owner, and his belief is the PREVIOUS look's.
    inject(s.m, s.p, null);
    aimAt(s, mate.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(lookOf(s.m, s.p)).toBe(2);
    expect(beliefOf(s.m, s.p)?.look).toBe(lookOf(s.m, s.p) - 1);
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).not.toBeNull();
    // the two states stay MUTUALLY EXCLUSIVE and it is still ONE candidate (M-IF.3)
    expect(whyScore(s.m, s.p, OWN_RUN_WHY)).toBeNull();
    expect(s.p.action.scores.filter((x) => x.action === 'MakeRun')).toHaveLength(1);
  });

  it('(b) NOT — the SAME two looks, but the phase is a RESTART (M-IF.5: the game is not live)', () => {
    const s = stage(BASE + 2, { world: 16 });
    const mate = mateOf(s);
    resetBody(s.m, s.p);
    s.m.phase = 'playing';
    inject(s.m, s.p, mate.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(beliefOf(s.m, s.p)).toEqual({ ownerGid: mate.gid, look: 1 });
    // …the whistle goes. ⚠ The restart is given a TAKER WHO IS NOT HIM, so he still runs
    // his normal off-ball logic and REACHES the fork — without a `restart` object
    // `decidePlayer` returns above the fork and the fixture would prove nothing.
    s.m.phase = 'restart';
    s.m.restart = {
      kind: 'kickIn', side: s.t.side, pos: { x: s.p.pos.x, y: s.p.pos.y },
      timer: 0, takerGid: mate.gid,
    };
    inject(s.m, s.p, null);
    unhat(s);
    decidePlayer(s.p, s.m);
    // HE LOOKED (the fork ran for him) — and the belief is still his PREVIOUS look's…
    expect(lookOf(s.m, s.p)).toBe(2);
    expect(beliefOf(s.m, s.p)?.look).toBe(lookOf(s.m, s.p) - 1);
    // …and NOTHING fires, because the game is not live.
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).toBeNull();
    // ⭐ THE CONTROL that isolates the phase ALONE: put the whistle back and rebuild the
    // same two looks on the same body — it fires.
    s.m.phase = 'playing';
    s.m.restart = null;
    resetBody(s.m, s.p);
    inject(s.m, s.p, mate.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    inject(s.m, s.p, null);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).not.toBeNull();
  });

  it('(c) NOT — the sighting was TWO looks ago (M-IF.6: only the IMMEDIATELY previous look)', () => {
    const s = stage(BASE + 3, { world: 16 });
    const mate = mateOf(s);
    resetBody(s.m, s.p);
    s.m.phase = 'playing';
    // LOOK 1 — a mate has it.
    inject(s.m, s.p, mate.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(beliefOf(s.m, s.p)).toEqual({ ownerGid: mate.gid, look: 1 });
    // LOOK 2 — HE SEES NO BALL AT ALL: nothing is written, nothing fires.
    inject(s.m, s.p, null, false);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(lookOf(s.m, s.p)).toBe(2);
    expect(beliefOf(s.m, s.p)).toEqual({ ownerGid: mate.gid, look: 1 });
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).toBeNull();
    // LOOK 3 — the ball is ownerless, the memory is UNCHANGED but it is now TWO looks old.
    inject(s.m, s.p, null);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(lookOf(s.m, s.p)).toBe(3);
    expect(beliefOf(s.m, s.p)?.look).toBe(lookOf(s.m, s.p) - 2);
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).toBeNull();
  });

  it('(d) NOT — the previous look saw an OPPONENT (the roster resolves his side)', () => {
    const s = stage(BASE + 4, { world: 16 });
    const opp = s.m.teams[1 - s.t.side].players.filter((q) => q.role !== 'GK')[0];
    resetBody(s.m, s.p);
    s.m.phase = 'playing';
    inject(s.m, s.p, opp.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(beliefOf(s.m, s.p)).toEqual({ ownerGid: opp.gid, look: 1 });
    inject(s.m, s.p, null);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(beliefOf(s.m, s.p)?.look).toBe(lookOf(s.m, s.p) - 1);
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).toBeNull();
  });

  it('(e) NOT — the previous look saw HIMSELF (the state needs a mate who is NOT him)', () => {
    const s = stage(BASE + 5, { world: 16 });
    resetBody(s.m, s.p);
    s.m.phase = 'playing';
    inject(s.m, s.p, s.p.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(beliefOf(s.m, s.p)).toEqual({ ownerGid: s.p.gid, look: 1 });
    inject(s.m, s.p, null);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(beliefOf(s.m, s.p)?.look).toBe(lookOf(s.m, s.p) - 1);
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).toBeNull();
  });

  it('(f) NOT — NO previous look at all: his FIRST evaluation starts nobody', () => {
    const s = stage(BASE + 6, { world: 16 });
    resetBody(s.m, s.p);
    s.m.phase = 'playing';
    expect(lookOf(s.m, s.p)).toBe(0);
    expect(beliefOf(s.m, s.p)).toBeNull();
    inject(s.m, s.p, null);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(lookOf(s.m, s.p)).toBe(1);
    expect(beliefOf(s.m, s.p)).toBeNull();
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).toBeNull();
  });

  it('(g) THE CADENCE — the look counter increments EXACTLY ONCE per evaluation, and the pull count is still ONE (spied vs unspied)', () => {
    const s = stage(BASE + 7, { world: 16 });
    const mate = mateOf(s);
    resetBody(s.m, s.p);
    s.m.phase = 'playing';
    const real = s.m.perceivedSnapshot.bind(s.m);
    let calls = 0;
    (s.m as unknown as { perceivedSnapshot: unknown }).perceivedSnapshot = (
      q: Player, scope?: ReadonlySet<number> | null,
    ) => { calls++; return real(q, scope ?? null); };
    for (let k = 1; k <= 6; k++) {
      inject(s.m, s.p, k % 2 === 0 ? null : mate.gid);
      unhat(s);
      calls = 0;
      decidePlayer(s.p, s.m);
      // ⭐ ONE look, ONE pull — the flight door adds neither a second look nor a second pull
      expect(lookOf(s.m, s.p), `look after evaluation ${k}`).toBe(k);
      expect(calls, `pulls in evaluation ${k}`).toBe(1);
    }
    // …and the UNSPIED control: the door absent leaves the counter untouched altogether
    const off = stage(BASE + 8, { world: 16, flight: false });
    unhat(off);
    inject(off.m, off.p, mateOf(off).gid);
    decidePlayer(off.p, off.m);
    expect(off.m.ifLook.size).toBe(0);
    expect(off.m.ifLastSeenOwnerGid.size).toBe(0);
  });
});

/* ------------------------------------------------------------------ */
/* F1 — G-OFF: the OFF world is the DISPATCH HEAD's, byte for byte      */
/* ------------------------------------------------------------------ */

const gOff = (world: 13 | 15 | 16 | 17 | undefined): string =>
  digest(G_SEEDS.map((s) => signatureOf(matchOf(s, world === undefined ? {} : { world }))));

describe('IF T0 — G-OFF: the flag absent ⇒ the world is the dispatch HEAD\'s (ARCH-KEYED)', () => {
  it('the arch-keyed table is honest: x64 RECORDED here, arm64 INHERITED BY IDENTITY, world 17 ABSENT on arm64', () => {
    expect(HEAD_COMMIT).toBe('59cd9f7');
    expect(Object.keys(HEAD_DIGESTS).sort()).toEqual(['arm64', 'x64']);
    expect(Object.keys(HEAD_DIGESTS.x64).sort()).toEqual(['bare', 'w13', 'w15', 'w16', 'w17']);
    // ⭐ ABSENT, not guessed: world 17 has no arm64 literal of record with this recipe.
    expect(Object.keys(HEAD_DIGESTS.arm64).sort()).toEqual(['bare', 'w13', 'w15', 'w16']);
    expect(HEAD_DIGESTS.arm64.w17).toBeUndefined();
    // the INHERITANCE, stated literal for literal with the source suite named
    expect(ARM64_SOURCE_SUITE).toBe('tests/dsCoopHatsOff.test.ts');
    const source = readFileSync(ARM64_SOURCE_SUITE, 'utf8');
    expect(source).toContain(`const HEAD_COMMIT = '${ARM64_SOURCE_HEAD}';`);
    for (const key of ['bare', 'w13', 'w15', 'w16'] as const) {
      expect(source).toContain(`${key}: '${HEAD_DIGESTS.arm64[key]}'`);
    }
    // the same twelve seeds and the same declared base as the source suite
    expect(source).toContain('const BASE = 900_007_400;');
    expect(G_SEEDS).toEqual(Array.from({ length: 12 }, (_, i) => 900_007_400 + i));
    // and this host's own column is the one that can be checked here
    expect(ARCH === 'x64' || ARCH === 'arm64').toBe(true);
  });

  it('⭐ the RE-RECORD at `59cd9f7` is IDENTICAL to the IF-T0 x64 column at `595a555` — the OFF world did not move', () => {
    // #422 item 3(ii) asks for this either way. It is EQUAL: IF-T0 banked DORMANT, and the
    // commits between the two heads touched no `src/**` file, so the door-shut world is the
    // same world. The five literals are compared one by one, not as a digest of digests.
    for (const key of ['bare', 'w13', 'w15', 'w16', 'w17'] as const) {
      expect(HEAD_DIGESTS.x64[key], key).toBe(IF_T0_X64_DIGESTS[key]);
    }
  });

  it('the BARE world reproduces the digest recorded at HEAD for this architecture', () => {
    expect(gOff(undefined)).toBe(HEAD_DIGESTS[ARCH].bare);
  }, 180_000);

  it('world 13 reproduces the digest recorded at HEAD for this architecture', () => {
    expect(gOff(13)).toBe(HEAD_DIGESTS[ARCH].w13);
  }, 180_000);

  it('world 15 reproduces the digest recorded at HEAD for this architecture', () => {
    expect(gOff(15)).toBe(HEAD_DIGESTS[ARCH].w15);
  }, 180_000);

  it('world 16 — the LIVE own-run world — reproduces the digest recorded at HEAD for this architecture', () => {
    expect(gOff(16)).toBe(HEAD_DIGESTS[ARCH].w16);
  }, 180_000);

  it.skipIf(ARCH !== 'x64')('world 17 reproduces the digest recorded at HEAD on x64 (SKIPPED on arm64 — ABSENT, no literal of record)', () => {
    expect(gOff(17)).toBe(HEAD_DIGESTS.x64.w17);
  }, 180_000);

  it('ABSENT ≡ EXPLICITLY FALSE (the other half of dormancy)', () => {
    for (const seed of G_SEEDS.slice(0, 4)) {
      expect(signatureOf(matchOf(seed, { flightExplicitFalse: true })))
        .toBe(signatureOf(matchOf(seed)));
      expect(signatureOf(matchOf(seed, { world: 17, flightExplicitFalse: true })))
        .toBe(signatureOf(matchOf(seed, { world: 17 })));
    }
    expect(matchOf(BASE).ifFlightRun).toBe(false);
    expect(matchOf(BASE, { flightExplicitFalse: true }).ifFlightRun).toBe(false);
    expect(matchOf(BASE, { flight: true }).ifFlightRun).toBe(true);
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
/* F2/F3/F4 — the belief, the armed behaviour, the containment          */
/* ------------------------------------------------------------------ */

interface Obs {
  ticks: number;
  seventh: number;
  eighth: number;
  beliefSize: number;
  lookSize: number;
}

const walk = (seed: number, a: Arm): Obs => {
  const m = matchOf(seed, a);
  const o: Obs = { ticks: 0, seventh: 0, eighth: 0, beliefSize: 0, lookSize: 0 };
  let ticks = 0;
  while (!m.finished && ticks < 60_000) {
    m.step(DT);
    ticks++;
    for (const t of m.teams) {
      for (const p of t.players) {
        for (const s of p.action.scores) {
          if (s.why === OWN_RUN_WHY) o.seventh++;
          if (s.why === FLIGHT_RUN_WHY) o.eighth++;
        }
      }
    }
  }
  o.ticks = ticks;
  o.beliefSize = m.ifLastSeenOwnerGid.size;
  o.lookSize = m.ifLook.size;
  return o;
};

describe('IF T0b — BOTH maps are EMPTY with the flag absent, and written when armed', () => {
  for (const world of [16, 17] as const) {
    it(`world ${world}: the flag ABSENT ⇒ BOTH per-body maps are EMPTY over whole matches (COUNTS) and the eighth \`why\` never appears`, () => {
      let ticks = 0;
      let seventh = 0;
      for (const seed of ARMED_SEEDS) {
        const o = walk(seed, { world });
        expect(o.beliefSize).toBe(0);
        expect(o.lookSize).toBe(0);
        expect(o.eighth).toBe(0);
        ticks += o.ticks;
        seventh += o.seventh;
      }
      // NON-VACUITY: the own-run fork really did run on these seeds
      expect(ticks).toBeGreaterThan(20_000);
      expect(seventh).toBeGreaterThan(0);
    }, 300_000);

    it(`world ${world} + the flag: the EIGHTH \`why\` appears in p.action.scores and the SEVENTH still appears`, () => {
      let eighth = 0;
      let seventh = 0;
      let belief = 0;
      let look = 0;
      for (const seed of ARMED_SEEDS) {
        const o = walk(seed, { world, flight: true });
        expect(o.eighth, `seed ${seed} world ${world}`).toBeGreaterThan(0);
        eighth += o.eighth;
        seventh += o.seventh;
        belief += o.beliefSize;
        look += o.lookSize;
      }
      // ⚠ NON-VACUITY, and it is the POINT of IF-T0b: the eighth state is NARROWER now
      // (live phase + the previous look only), so it fires LESS — but it still fires on
      // EVERY seed of the stored band, which is what this pin records.
      expect(eighth).toBeGreaterThan(0);
      expect(seventh).toBeGreaterThan(0);
      expect(belief).toBeGreaterThan(0);
      expect(look).toBeGreaterThan(0);
    }, 300_000);
  }
});

describe('IF T0b — CONTAINED: the flag on a world WITHOUT `dsOwnRun` does nothing', () => {
  for (const world of [13, undefined] as const) {
    it(`${world === undefined ? 'the BARE world' : `world ${world}`} + the flag ⇒ ZERO eighth-why decisions and BOTH maps still EMPTY`, () => {
      let ticks = 0;
      for (const seed of CONTAINED_SEEDS) {
        const m = matchOf(seed, world === undefined
          ? { flight: true } : { world, flight: true });
        expect(m.ifFlightRun).toBe(true);
        expect(m.dsOwnRun).toBe(false);
        const o = walk(seed, world === undefined
          ? { flight: true } : { world, flight: true });
        expect(o.eighth).toBe(0);
        expect(o.seventh).toBe(0);
        expect(o.beliefSize).toBe(0);
        expect(o.lookSize).toBe(0);
        ticks += o.ticks;
      }
      expect(ticks).toBeGreaterThan(20_000);
    }, 300_000);
  }
});

/* ------------------------------------------------------------------ */
/* F5 — the percept pull is UNCHANGED by this flag                      */
/* ------------------------------------------------------------------ */

describe('IF T0b — the pull count per own-run evaluation is UNCHANGED', () => {
  it('ZERO pulls with `dsOwnRun` absent · exactly ONE with it armed · exactly ONE with the flag TOO (the DS-T1c idiom)', () => {
    const seen: Record<string, string[]> = {};
    for (const own of [false, true]) {
      for (const flight of [false, true]) {
        const key = `own${own ? 1 : 0}if${flight ? 1 : 0}`;
        const m = matchOf(PULL_SEED, {
          world: 13, ...(own ? { own: true } : {}), ...(flight ? { flight: true } : {}),
        });
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
        seen[key] = Object.keys(dist);
        expect(subjects).toBeGreaterThan(100);
      }
    }
    // the flight door adds NO pull: the fork's existing single snapshot serves both states.
    expect(seen.own0if0).toEqual(['0']);
    expect(seen.own0if1).toEqual(['0']);
    expect(seen.own1if0).toEqual(['1']);
    expect(seen.own1if1).toEqual(['1']);
  }, 300_000);
});

/* ------------------------------------------------------------------ */
/* F6 — the fork's READ SET, by source needles over the seam span       */
/* ------------------------------------------------------------------ */

describe('IF T0b — the READ SET of the seam span', () => {
  it('⛔ no truth read: `pendingPass` · `match.ball` · `ball.owner` · `lastTouch` · `info.genome` each count ZERO', () => {
    const code = codeLines(SEAM_SPAN).join('\n');
    for (const banned of ['pendingPass', 'match.ball', 'ball.owner', 'lastTouch',
      'info.genome', 'pendingPassWindup', 'opp.', 'allPlayers', 'dist(', 'topSpeed']) {
      expect(count(code, new RegExp(banned.replace(/[.()]/g, '\\$&'), 'g')), banned).toBe(0);
    }
    // the span really does contain the seam (non-vacuity of the needle scan)
    expect(code).toContain('const ifFlightRun = match.ifFlightRun;');
    expect(code).toContain('const ifLastSeenOwner = match.ifLastSeenOwnerGid;');
    expect(code).toContain('const ifLookMap = match.ifLook;');
    expect(code).toContain('const ifPhase = match.phase;');
    expect(code).toContain(`why: '${OWN_RUN_WHY}'`);
    expect(code).toContain(`'${FLIGHT_RUN_WHY}'`);
  });

  it('⭐ `match.phase` is ALLOWED from #422 item 2, and COUNTED at EXACTLY its occurrences', () => {
    const code = codeLines(SEAM_SPAN).join('\n');
    // M-IF.5's read: the whistle, aliased ONCE inside the fork and read ONCE in the state.
    expect(count(code, /match\.phase/g)).toBe(1);
    expect(count(code, /ifPhase/g)).toBe(2);
    expect(code).toContain("const ifOntoFlight = ifFlightRun && ifPhase === 'playing'");
    // ⛔ and it is an IDENTITY test on a game state — no `restart` object is reached into,
    // no set-piece branch is read, no clock is compared.
    expect(count(code, /match\.restart/g)).toBe(0);
    expect(count(code, /crashLive|crossLive/g)).toBe(0);
    // ⭐ THE SEVEN `match` MEMBERS of the widened fork (#422 item 2). SIX of them are named
    // inside the SPAN; the seventh is `match.dsOwnRun`, the fork's own gate, which sits on
    // the line ABOVE the span's first alias — asserted here, and the SEVEN-member set over
    // the whole block is `tests/dsOwnRun.test.ts`'s narrowed pin (5 → 7, #422 item 2).
    expect([...new Set((code.match(/match\.[A-Za-z]+/g) ?? []))].sort()).toEqual([
      'match.ifFlightRun', 'match.ifLastSeenOwnerGid', 'match.ifLook',
      'match.perceivedSnapshot', 'match.phase', 'match.simTime',
    ]);
    const brainLines = playerSource.split('\n');
    const anchor = brainLines.findIndex((l) => l.trim() === 'const ifFlightRun = match.ifFlightRun;');
    expect(anchor).toBeGreaterThan(0);
    // the last EXECUTABLE line above the span's first alias IS the fork's own gate
    const above = codeLines(brainLines.slice(0, anchor).join('\n'));
    expect(above[above.length - 1]).toBe('if (match.dsOwnRun) {');
  });

  it('⛔ ONE pull, and it is the fork\'s existing one', () => {
    expect(count(codeLines(SEAM_SPAN).join('\n'), /match\.perceivedSnapshot/g)).toBe(1);
    expect(SEAM_SPAN).toContain('const snapshot = match.perceivedSnapshot(p);');
    // and the whole file still takes exactly three (the pass chooser's two plus this one)
    expect(count(codeLines(playerSource).join('\n'), /match\.perceivedSnapshot/g)).toBe(3);
  });

  it('⛔ NO predicate on a football quantity (#200): the seam\'s own lines are identity tests and index equalities', () => {
    const own = codeLines(SEAM_SPAN)
      .filter((l) => l.includes('ifFlightRun') || l.includes('ifLastSeenOwner')
        || l.includes('ifOntoFlight') || l.includes('ifMateRemembered')
        || l.includes('ifCand') || l.includes('ifLastSeenGid') || l.includes('ifPhase')
        || l.includes('ifLookMap') || l.includes('ifThisLook') || l.includes('ifPrev'))
      .join('\n');
    // ⛔ NO inequality anywhere in the seam's own text — M-IF.6 is an EQUALITY on an index
    expect(/[<>]/.test(own)).toBe(false);
    // ⭐ and the ONLY numeric literals are the counter's own `0` and `1`: the empty-counter
    // default, the increment, "the PREVIOUS look" (`- 1`) and the candidate index (`- 1`).
    // No third number exists — no tick bound, no age bound, no distance, no threshold.
    expect([...new Set(own.match(/\d+(\.\d+)?/g) ?? [])].sort()).toEqual(['0', '1']);
    expect(own).toContain("const ifOntoFlight = ifFlightRun && ifPhase === 'playing'");
    // ⚠ this conjunct sits on its own continuation line, which carries no `if…` needle:
    // it is asserted over the SPAN, where it is the seam's line all the same.
    expect(codeLines(SEAM_SPAN).join('\n'))
      .toContain('&& seenBall !== null && ownerGid === null');
    expect(own).toContain('&& ifLastSeenGid !== null && ifLastSeenGid !== p.gid && ifMateRemembered;');
    expect(own).toContain('carrierIsMate = carrierIsMate || ifOntoFlight;');
  });

  it('the belief is written ONLY from the pulled snapshot\'s owner WITH the look index, and read ONLY from his own entry', () => {
    const code = codeLines(SEAM_SPAN).join('\n');
    expect(code).toContain('const ifThisLook = ifFlightRun ? (ifLookMap.get(p.gid) ?? 0) + 1 : 0;');
    expect(code).toContain('? (ifLookMap.set(p.gid, ifThisLook), ifLastSeenOwner.get(p.gid) ?? null)');
    expect(code).toContain('const ifLastSeenGid = ifFlightRun && ownerGid !== null');
    expect(code).toContain('? (ifLastSeenOwner.set(p.gid, { ownerGid, look: ifThisLook }), null)');
    expect(code).toContain(': (ifPrev !== null && ifPrev.look === ifThisLook - 1 ? ifPrev.ownerGid : null);');
    // exactly ONE write site and ONE read site PER MAP in all of `src/**`, and always `p.gid`
    let writes = 0;
    let reads = 0;
    let lookWrites = 0;
    let lookReads = 0;
    for (const f of srcFiles('src')) {
      const text = codeLines(readFileSync(f, 'utf8')).join('\n');
      writes += count(text, /ifLastSeenOwner\.set\(/g);
      reads += count(text, /ifLastSeenOwner\.get\(/g);
      lookWrites += count(text, /ifLookMap\.set\(/g);
      lookReads += count(text, /ifLookMap\.get\(/g);
    }
    expect(writes).toBe(1);
    expect(reads).toBe(1);
    expect(lookWrites).toBe(1);
    expect(lookReads).toBe(1);
    // ⛔ never another body's entry: every access is keyed by HIS OWN gid
    expect(count(code, /ifLastSeenOwner\.(get|set)\(p\.gid/g)).toBe(2);
    expect(count(code, /ifLookMap\.(get|set)\(p\.gid/g)).toBe(2);
  });
});

/* ------------------------------------------------------------------ */
/* F7 — THE SEAM MAP (paths normalized to '/')                          */
/* ------------------------------------------------------------------ */

describe('IF T0b — the seam map', () => {
  it('the flag, the belief and the LOOK COUNTER are named at exactly the files the doc names, and nowhere else', () => {
    const flagFiles = new Map<string, number>();
    const beliefFiles = new Map<string, number>();
    const lookFiles = new Map<string, number>();
    for (const f of srcFiles('src')) {
      const code = codeLines(readFileSync(f, 'utf8')).join('\n');
      const a = count(code, /ifFlightRun/g);
      const b = count(code, /ifLastSeenOwnerGid/g);
      // ⚠ word-boundary: `ifLookMap`, the fork's alias, is NOT an occurrence of `ifLook`
      const c = count(code, /ifLook\b/g);
      if (a > 0) flagFiles.set(f, a);
      if (b > 0) beliefFiles.set(f, b);
      if (c > 0) lookFiles.set(f, c);
    }
    expect([...flagFiles.keys()].sort())
      .toEqual(['src/ai/PlayerBrain.ts', 'src/sim/League.ts', 'src/sim/Match.ts']);
    // Match.ts: FOUR — the optional config key, the readonly field, and the init line, which
    // names it TWICE (the `dsCoopHatsOff` count of 4 has the same shape).
    expect(flagFiles.get('src/sim/Match.ts')).toBe(4);
    expect(flagFiles.get('src/sim/League.ts')).toBe(1);
    // PlayerBrain.ts: SIX — the alias line (twice, the fork's FIRST statement) and the FOUR
    // reads of the alias (the look counter, the previous belief, the write, the state).
    expect(flagFiles.get('src/ai/PlayerBrain.ts')).toBe(6);
    expect([...beliefFiles.keys()].sort())
      .toEqual(['src/ai/PlayerBrain.ts', 'src/sim/Match.ts']);
    expect(beliefFiles.get('src/sim/Match.ts')).toBe(2);
    expect(beliefFiles.get('src/ai/PlayerBrain.ts')).toBe(1);
    // ⭐ THE LOOK COUNTER (#422 item 2): the readonly field and the constructor's init in
    // Match.ts; the ONE alias read in PlayerBrain.ts. ⛔ League.ts does NOT name it — it is
    // NOT a config key, so the match-flag union is byte-unchanged.
    expect([...lookFiles.keys()].sort())
      .toEqual(['src/ai/PlayerBrain.ts', 'src/sim/Match.ts']);
    expect(lookFiles.get('src/sim/Match.ts')).toBe(2);
    expect(lookFiles.get('src/ai/PlayerBrain.ts')).toBe(1);
    // ⭐ THE ENTRY LAYER names NONE of the three — no world and no preset arms this seam.
    expect(count(a4Source, /ifFlightRun|ifLastSeenOwnerGid|ifLook\b/g)).toBe(0);
    expect(count(leagueSource, /ifLook\b|ifLastSeenOwnerGid/g)).toBe(0);
  });

  it('the gate lines are the source literals the doc quotes', () => {
    expect(matchSource).toContain('  ifFlightRun?: boolean;');
    expect(matchSource).toContain('  readonly ifFlightRun: boolean;');
    expect(matchSource).toContain(
      '  readonly ifLastSeenOwnerGid: Map<number, { ownerGid: number; look: number }>;');
    expect(matchSource).toContain('  readonly ifLook: Map<number, number>;');
    expect(matchSource).toContain('this.ifFlightRun = cfg.ifFlightRun ?? false;');
    expect(matchSource).toContain('this.ifLastSeenOwnerGid = new Map();');
    expect(matchSource).toContain('this.ifLook = new Map();');
    expect(leagueSource).toContain("| 'ifFlightRun'");
    // ⭐ M-IF.4's PLACEMENT, PINNED (#419 item 2, EXTENDED at #422 item 2): the FOUR aliases
    // are the FIRST four executable statements INSIDE `if (match.dsOwnRun) {`.
    const brainLines = playerSource.split('\n');
    const forkAt = brainLines.findIndex((l) => l.trim() === 'if (match.dsOwnRun) {');
    expect(forkAt).toBeGreaterThan(0);
    expect(brainLines.slice(forkAt + 1).filter((l) => codeLines(l).length > 0).slice(0, 4))
      .toEqual(['      const ifFlightRun = match.ifFlightRun;',
        '      const ifLastSeenOwner = match.ifLastSeenOwnerGid;',
        '      const ifLookMap = match.ifLook;',
        '      const ifPhase = match.phase;']);
    // ⛔ no env door, no bundle default, no world armer anywhere in src/
    expect(count(matchSource, /ifFlightRun\s*\?\?\s*EDS_BUNDLE_ARMED|process\.env[^\n]*ifFlight/g))
      .toBe(0);
    for (const f of srcFiles('src')) {
      const text = readFileSync(f, 'utf8');
      expect(count(text, /\.ifFlightRun\s*=[^=]/g), f).toBe(f === 'src/sim/Match.ts' ? 1 : 0);
      expect(count(text, /ifFlightRun: true/g), f).toBe(0);
    }
  });

  it('Road B: NO world 1–17 carries the flag; `League.toJSON` omits it', () => {
    const worlds: A4ArmedVersion[] =
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    expect(worlds).toHaveLength(17);
    for (const w of worlds) {
      expect((a4MatchFlags(w) as Record<string, unknown>).ifFlightRun, `world ${w}`)
        .toBeUndefined();
    }
    for (const w of [13, 15, 16, 17] as const) {
      expect(matchOf(BASE, { world: w }).ifFlightRun, `world ${w}`).toBe(false);
    }
    const l = new League({ seed: BASE });
    expect(JSON.stringify(l.toJSON())).not.toContain('ifFlightRun');
    expect(JSON.stringify(l.toJSON())).not.toContain('matchFlags');
  });

  it('the match-flag key union grew by EXACTLY one, dormant', () => {
    const union = leagueSource.slice(
      leagueSource.indexOf('matchFlags: Partial<Pick<MatchConfig,'),
      leagueSource.indexOf('>> = {};'),
    );
    expect(count(union, /'ifFlightRun'/g)).toBe(1);
    expect(count(union, /'dsOwnRun'/g)).toBe(1);
    expect(count(union, /'dsCoopHatsOff'/g)).toBe(1);
  });

  it('BOTH per-body maps are created EMPTY in the constructor and nowhere else', () => {
    expect(count(matchSource, /ifLastSeenOwnerGid = new Map\(\)/g)).toBe(1);
    expect(count(matchSource, /ifLastSeenOwnerGid\.(set|delete|clear)\(/g)).toBe(0);
    expect(count(matchSource, /ifLook = new Map\(\)/g)).toBe(1);
    expect(count(matchSource, /ifLook\.(set|delete|clear)\(/g)).toBe(0);
    expect(matchOf(BASE).ifLastSeenOwnerGid.size).toBe(0);
    expect(matchOf(BASE, { flight: true }).ifLastSeenOwnerGid.size).toBe(0);
    expect(matchOf(BASE).ifLook.size).toBe(0);
    expect(matchOf(BASE, { flight: true }).ifLook.size).toBe(0);
  });
});

/* ------------------------------------------------------------------ */
/* F8 — the SEVEN literals unchanged + the eighth exactly once          */
/* ------------------------------------------------------------------ */

describe('IF T0b — the `why` literal set', () => {
  it('the SIX census literals are byte-unchanged in src/, and the SEVENTH is still present exactly once', () => {
    const all = srcFiles('src').map((f) => readFileSync(f, 'utf8')).join('\n');
    const six = Object.entries(WHY_LITERALS)
      .filter(([k]) => k !== 'cutbackPrefix')
      .map(([, v]) => v);
    expect(six).toHaveLength(6);
    for (const lit of six) expect(all.includes(`'${lit}'`), lit).toBe(true);
    expect(six).not.toContain(OWN_RUN_WHY);
    expect(six).not.toContain(FLIGHT_RUN_WHY);
    let seventh = 0;
    for (const f of srcFiles('src')) {
      const inCode = codeLines(readFileSync(f, 'utf8'))
        .filter((l) => l.includes(`'${OWN_RUN_WHY}'`)).length;
      seventh += inCode;
      if (inCode > 0) expect(f).toBe('src/ai/PlayerBrain.ts');
    }
    expect(seventh).toBe(1);
    // …and the shipped push that carries it is byte-unchanged
    expect(playerSource)
      .toContain(`cands.push({ action: 'MakeRun', score: s, why: '${OWN_RUN_WHY}' });`);
  });

  it('the EIGHTH is present exactly once in src/, in PlayerBrain, and adds NO `MakeRun` push', () => {
    let eighth = 0;
    for (const f of srcFiles('src')) {
      const inCode = codeLines(readFileSync(f, 'utf8'))
        .filter((l) => l.includes(`'${FLIGHT_RUN_WHY}'`)).length;
      eighth += inCode;
      if (inCode > 0) expect(f).toBe('src/ai/PlayerBrain.ts');
    }
    expect(eighth).toBe(1);
    // ⭐ THE SAME CANDIDATE: the push count is the SIX of record — the eighth `why` is a
    // RELABEL of the candidate the shipped statement pushed, not a second push.
    expect(count(playerSource, /action: 'MakeRun'/g) + count(playerSource, /type: 'MakeRun'/g))
      .toBe(6);
    expect(playerSource)
      .toContain(`ifCand.why = ifOntoFlight ? '${FLIGHT_RUN_WHY}' : ifCand.why;`);
  });
});

/* ------------------------------------------------------------------ */
/* F9 — THE MUTANT WALK (runtime AND source)                            */
/* ------------------------------------------------------------------ */

/**
 * ⭐ THE M4 SCAN. A body's belief is what HE saw; `match.ball.owner` is what is TRUE now. The
 * scan walks armed matches and counts evaluations at which the two DISAGREE in a way that
 * flips the state: his eyes show a ball with no owner, his FRESH memory (M-IF.6: the entry
 * written at his immediately previous look) holds a same-side mate (the honest state FIRES)
 * while the TRUTH owner is not a same-side mate other than him (a `match.ball.owner` read
 * would NOT fire) — or the exact reverse. The first seed of the scan band on which that
 * happens is the stored `M4_SEED`.
 */
const m4Divergences = (seed: number): number => {
  const m = matchOf(seed, { world: 16, flight: true });
  let diverged = 0;
  for (let ticks = 0; ticks < 3_000 && !m.finished; ticks++) {
    m.step(DT);
    if (m.phase !== 'playing') continue;
    const side = m.possessionSide;
    if (side !== 0 && side !== 1) continue;
    const t = m.teams[side];
    for (const p of t.players) {
      if (p.role === 'GK' || p.sentOff || m.ball.owner === p) continue;
      const snap = m.perceivedSnapshot(p);
      if (snap === null || snap.ball === null) continue;
      if (snap.ball.ownerGid !== null) continue; // only the flight state is at issue
      const isMate = (gid: number | null): boolean =>
        gid !== null && gid !== p.gid && t.players.some((q) => q.gid === gid);
      const b = beliefOf(m, p);
      // FRESH = written at the look BEFORE the fork's next one, i.e. at his LAST look
      const fresh = b !== null && b.look === lookOf(m, p);
      const honest = fresh && isMate(b === null ? null : b.ownerGid);
      const truthy = isMate(m.ball.owner === null ? null : m.ball.owner.gid);
      if (honest !== truthy) diverged++;
    }
  }
  return diverged;
};

/**
 * ⭐⭐⭐ THE MUTATION TEXTS OF RECORD (#422 item 3(ii): "each with the pin that kills it and
 * its exact mutation text in the table"). Each row is the STRING REPLACED → THE REPLACEMENT,
 * exactly as it was applied to `src/ai/PlayerBrain.ts` in place before the whole file was
 * re-run and the original restored and sha256-verified. The pin below asserts that every
 * `from` string still occurs EXACTLY ONCE in the shipped source, which is what makes the
 * table REPRODUCIBLE rather than a story about a past run.
 */
const MUTANTS: readonly { id: string; from: string; to: string; red: number }[] = [
  {
    id: 'M1 — the FLIGHT clause dropped',
    from: '          && seenBall !== null && ownerGid === null',
    to: '          && true',
    red: 0,
  },
  {
    id: 'M2 — the belief NEVER WRITTEN',
    from: '          ? (ifLastSeenOwner.set(p.gid, { ownerGid, look: ifThisLook }), null)',
    to: '          ? null',
    red: 0,
  },
  {
    id: 'M3 — the door read INVERTED at the alias line (kills by COLLECTION FAILURE)',
    from: '      const ifFlightRun = match.ifFlightRun;',
    to: '      const ifFlightRun = !match.ifFlightRun;',
    red: 0,
  },
  {
    id: 'M4 — the last-owner test reading TRUTH `match.ball.owner`',
    from: '          : (ifPrev !== null && ifPrev.look === ifThisLook - 1 ? ifPrev.ownerGid : null);',
    to: '          : (match.ball.owner === null ? null : match.ball.owner.gid);',
    red: 0,
  },
  {
    id: 'M5 — the PHASE test dropped (M-IF.5 removed)',
    from: "        const ifOntoFlight = ifFlightRun && ifPhase === 'playing'",
    to: '        const ifOntoFlight = ifFlightRun',
    red: 0,
  },
  {
    id: 'M6 — the LOOK EQUALITY dropped (M-IF.6 removed: a stale memory admitted)',
    from: '          : (ifPrev !== null && ifPrev.look === ifThisLook - 1 ? ifPrev.ownerGid : null);',
    to: '          : (ifPrev !== null ? ifPrev.ownerGid : null);',
    red: 0,
  },
  {
    id: 'M7 — the LOOK COUNTER never incremented',
    from: '          ? (ifLookMap.set(p.gid, ifThisLook), ifLastSeenOwner.get(p.gid) ?? null)',
    to: '          ? (ifLastSeenOwner.get(p.gid) ?? null)',
    red: 0,
  },
];

describe('IF T0b — the mutant walk (SEVEN mutants, at runtime AND at source)', () => {
  it('⭐ the mutation table is REPRODUCIBLE: every `from` string occurs EXACTLY ONCE in the shipped source, and every `to` occurs ZERO times', () => {
    // ⚠ WHOLE LINES, not substrings: M5's replacement is a PREFIX of the line it replaces,
    // so a substring count would read 1 and say nothing. A line-exact comparison is what
    // "apply this mutation" actually means.
    const lines = playerSource.split('\n');
    for (const m of MUTANTS) {
      expect(lines.filter((l) => l === m.from).length,
        `${m.id} — the string replaced`).toBe(1);
      expect(lines.filter((l) => l === m.to).length,
        `${m.id} — the replacement`).toBe(0);
      expect(m.to, `${m.id} — the mutation changes something`).not.toBe(m.from);
    }
    expect(MUTANTS).toHaveLength(7);
  });

  it('M1 — the flight clause DROPPED: killed at runtime by F0/F0b/F3 and at source by the state line', () => {
    // SOURCE: the two conjuncts that ARE the flight state
    expect(SEAM_SPAN).toContain('&& seenBall !== null && ownerGid === null');
    expect(SEAM_SPAN).toContain('carrierIsMate = carrierIsMate || ifOntoFlight;');
    // RUNTIME: with the clause dropped the seventh state would take the eighth label — here
    // the seventh fires on its own state and the eighth on its own.
    const s = stage(BASE + 10, { world: 16 });
    const mate = mateOf(s);
    resetBody(s.m, s.p);
    s.m.phase = 'playing';
    inject(s.m, s.p, mate.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(whyScore(s.m, s.p, OWN_RUN_WHY)).not.toBeNull();
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).toBeNull();
    inject(s.m, s.p, null);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).not.toBeNull();
  });

  it('M2 — the belief NEVER WRITTEN: killed at runtime by the empty-memory scene and at source by the one write site', () => {
    expect(SEAM_SPAN).toContain('(ifLastSeenOwner.set(p.gid, { ownerGid, look: ifThisLook }), null)');
    const s = stage(BASE + 11, { world: 16 });
    const mate = mateOf(s);
    resetBody(s.m, s.p);
    s.m.phase = 'playing';
    expect(beliefOf(s.m, s.p)).toBeNull();
    inject(s.m, s.p, mate.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(beliefOf(s.m, s.p)).toEqual({ ownerGid: mate.gid, look: 1 });
    inject(s.m, s.p, null);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).not.toBeNull();
  });

  it('M3 — the flag read INVERTED: killed by G-OFF, by the empty-map counts and by the source form', () => {
    // ⚠ M3's PRIMARY form inverts the door AT THE ALIAS (the fork's first statement), which
    // destroys the seam-span anchor above and kills by COLLECTION FAILURE; M3′ is the
    // surgical form, its exact mutation text in the stage doc's §PINS-B table.
    expect(count(playerSource, /!ifFlightRun/g)).toBe(0);
    expect(count(playerSource, /!match\.ifFlightRun/g)).toBe(0);
    expect(SEAM_SPAN).toContain('const ifThisLook = ifFlightRun ? (ifLookMap.get(p.gid) ?? 0) + 1 : 0;');
    // RUNTIME: inverted, the flag-ABSENT world would write both maps and push the eighth —
    // which F1's digests, F2's zero counts and this walk all observe NOT to happen.
    const o = walk(BASE + 12, { world: 16 });
    expect(o.beliefSize).toBe(0);
    expect(o.lookSize).toBe(0);
    expect(o.eighth).toBe(0);
  }, 180_000);

  it('M4 — the last-owner test reading TRUTH `match.ball.owner`: dies on the STORED divergence seed', () => {
    // SOURCE: the truth ball is not named anywhere in the span (F6 holds this too)
    expect(count(codeLines(SEAM_SPAN).join('\n'), /match\.ball/g)).toBe(0);
    expect(count(codeLines(SEAM_SPAN).join('\n'), /ball\.owner/g)).toBe(0);
    // RUNTIME: the scan re-derives the stored seed — the FIRST in the band where the body's
    // own FRESH memory and the truth's owner disagree at a live flight evaluation.
    const found = M4_SCAN_SEEDS.find((x) => m4Divergences(x) > 0);
    expect(found).toBe(M4_SEED);
    expect(m4Divergences(M4_SEED)).toBeGreaterThan(0);
  }, 300_000);

  it('M5 — the PHASE test DROPPED: killed at runtime by fixture (b) and at source by the state line', () => {
    // SOURCE: M-IF.5 is a conjunct of the state, not a comment
    expect(SEAM_SPAN).toContain("const ifOntoFlight = ifFlightRun && ifPhase === 'playing'");
    // RUNTIME: the SAME two looks, once live and once at a restart — only the live one fires.
    const s = stage(BASE + 13, { world: 16 });
    const mate = mateOf(s);
    resetBody(s.m, s.p);
    s.m.phase = 'playing';
    inject(s.m, s.p, mate.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    s.m.phase = 'restart';
    inject(s.m, s.p, null);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).toBeNull();
    // the live control on the same body: the belief is re-made live and it DOES fire
    s.m.phase = 'playing';
    resetBody(s.m, s.p);
    inject(s.m, s.p, mate.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    inject(s.m, s.p, null);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).not.toBeNull();
  });

  it('M6 — the LOOK EQUALITY DROPPED (a stale memory admitted): killed at runtime by fixture (c) and at source by the equality', () => {
    // SOURCE: "the PREVIOUS look" is an INDEX EQUALITY, present exactly once
    expect(count(codeLines(SEAM_SPAN).join('\n'), /ifPrev\.look === ifThisLook - 1/g)).toBe(1);
    // RUNTIME: a sighting TWO looks ago must NOT fire — with the equality dropped it would.
    const s = stage(BASE + 14, { world: 16 });
    const mate = mateOf(s);
    resetBody(s.m, s.p);
    s.m.phase = 'playing';
    inject(s.m, s.p, mate.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    inject(s.m, s.p, null, false); // he sees no ball at all: nothing written, nothing fires
    unhat(s);
    decidePlayer(s.p, s.m);
    inject(s.m, s.p, null);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(beliefOf(s.m, s.p)).toEqual({ ownerGid: mate.gid, look: 1 });
    expect(lookOf(s.m, s.p)).toBe(3);
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).toBeNull();
  });

  it('M7 — the LOOK COUNTER NEVER INCREMENTED: killed at runtime by fixture (g) and by the firing fixture, and at source by the one write site', () => {
    // SOURCE: the increment is the counter's only write, inside the door
    expect(SEAM_SPAN).toContain('(ifLookMap.set(p.gid, ifThisLook), ifLastSeenOwner.get(p.gid) ?? null)');
    // RUNTIME: without the increment every look is look 1, so `belief.look === thisLook - 1`
    // could never hold and NOTHING would ever fire — here the counter advances and it fires.
    const s = stage(BASE + 15, { world: 16 });
    const mate = mateOf(s);
    resetBody(s.m, s.p);
    s.m.phase = 'playing';
    inject(s.m, s.p, mate.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(lookOf(s.m, s.p)).toBe(1);
    inject(s.m, s.p, null);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(lookOf(s.m, s.p)).toBe(2);
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).not.toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/* F10 — the narrows, and the scratch bands                             */
/* ------------------------------------------------------------------ */

describe('IF T0b — the narrowed pins, and the scratch band', () => {
  it('the DS-T0/T0b/T0c/T0d seam map is UNCHANGED: this seam adds no flag read to any other fork', () => {
    expect(count(codeLines(playerSource).join('\n'), /match\.dsOwnRun/g)).toBe(1);
    expect(count(codeLines(src('ai/TeamBrain.ts')).join('\n'), /match\.dsHatsOff/g)).toBe(2);
    expect(count(codeLines(src('ai/TeamBrain.ts')).join('\n'), /dsCoopHatsOff/g)).toBe(1);
    expect(count(codeLines(src('sim/mechanics.ts')).join('\n'), /dsCoopHatsOff/g)).toBe(1);
  });

  it('the percept trunk, the OBM seat and the executor are byte-untouched by this seam', () => {
    expect(count(src('ai/perceptionSnapshot.ts'), /ifFlightRun|ifLastSeenOwnerGid/g)).toBe(0);
    expect(count(src('ai/offballEyes.ts'), /ifFlightRun|ifLastSeenOwnerGid/g)).toBe(0);
    expect(count(src('ai/actionExecutor.ts'), /ifFlightRun|ifLastSeenOwnerGid/g)).toBe(0);
    expect(count(src('sim/mechanics.ts'), /ifFlightRun|ifLastSeenOwnerGid/g)).toBe(0);
    expect(count(src('ai/TeamBrain.ts'), /ifFlightRun|ifLastSeenOwnerGid/g)).toBe(0);
  });

  it('EVERY seed this file walks is derived from the ONE declared base and inside the band', () => {
    expect(BASE).toBe(900_008_600);
    for (const s of [...ARMED_SEEDS, ...CONTAINED_SEEDS, ...M4_SCAN_SEEDS,
      PULL_SEED, M4_SEED, BASE + 1, BASE + 2, BASE + 3, BASE + 4, BASE + 5, BASE + 6,
      BASE + 7, BASE + 8, BASE + 10, BASE + 11, BASE + 12, BASE + 13, BASE + 14, BASE + 15]) {
      expect(s).toBeGreaterThanOrEqual(BASE);
      expect(s).toBeLessThanOrEqual(BASE + 99);
    }
    // ⚠ THE ONE DECLARED DEVIATION (#418 item 5(i), carried): G-OFF walks DS-T0d's own
    // twelve seeds so the arm64 column stays INHERITABLE. Stage doc §DEVIATIONS-B 3.
    expect(G_BASE).toBe(900_007_400);
    for (const s of G_SEEDS) {
      expect(s).toBeGreaterThanOrEqual(G_BASE);
      expect(s).toBeLessThanOrEqual(G_BASE + 11);
    }
  });
});
