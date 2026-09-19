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
 * ⭐⭐⭐ IF T0 — 「球在飞时的前插 · 缝」 THE FLIGHT-RUN SEAM
 * (docs/world-model/IF-T0-FLIGHT-RUN-SEAM.md; contract IF-FLIGHT-RUN-CONTRACT.md §2
 * M-IF.1–4; COMMANDER RULING #417 item 3 as AMENDED by #418 item 5) — THE SEAM'S PERMANENT
 * PIN SUITE, in the `tests/dsCoopHatsOff.test.ts` form.
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * WHAT THIS IS: ONE dormant flag (`match.ifFlightRun`), ONE per-body belief
 * (`match.ifLastSeenOwnerGid`), ONE more PERCEIVED state inside the own-run fork, and ONE
 * more `why` — 'own run onto the flight', the EIGHTH literal. NO constant, NO gene, NO truth
 * read, NO second percept pull. Dormant. Ships nothing.
 *
 * ⭐⭐⭐ THE ARCHITECTURE (canon "digests carry their architecture", home: ruling #418 item 2).
 * Every whole-match digest and the fingerprint of record are keyed by `process.arch`. The
 * **x64** column was RECORDED BY THE EXECUTOR at the dispatch head `595a555` in a clean
 * throwaway worktree before one byte of this seam existed. The **arm64** column is INHERITED
 * BY IDENTITY from `tests/dsCoopHatsOff.test.ts`'s `HEAD_DIGESTS` — the SAME twelve seeds
 * (900,007,400–411), the SAME `signatureOf` recipe and the SAME pooling digest, on worlds
 * that are byte-identical since `f1a46b1` (#413 / #415) — literal for literal, the source
 * suite named. World 17 has NO arm64 literal of record with this recipe ⇒ it is **ABSENT**,
 * and its pin SKIPS on arm64 and says so in its title. ⛔ Never a guess, never a number
 * typed from memory.
 *
 * The pins (§PINS of the stage doc is the inventory; this file IS the living copy):
 *   F0  THE FIXTURE   ⭐ the INTENDED-RECEIVER fixture FIRST (canon "walk-side definitions
 *                     pinned", FIFTH strike, #416 item 3(i)): a FIRING and a NON-FIRING case
 *                     for `pendingPass.targetGid === p.gid`, the predicate IF-C0 carried
 *                     unfixtured. Same pass, same target, opposite outcomes — so the face has
 *                     both arms, and the seam is shown to read the BELIEF, never the pass.
 *   F1  G-OFF        the flag absent ⇒ whole-match signatures (rng draw included) reproduce
 *                    the ARCH-KEYED digests recorded at the dispatch head; the fingerprint;
 *                    ABSENT ≡ EXPLICITLY FALSE.
 *   F2  THE BELIEF    EMPTY over whole matches with the flag absent (a COUNT, not a text
 *                     claim); non-vacuously written when armed.
 *   F3  ARMED         worlds 16 and 17 + the flag: the eighth `why` appears in
 *                     `p.action.scores` and the SEVENTH still appears.
 *   F4  CONTAINED     the flag on a world WITHOUT `dsOwnRun` (13, bare) ⇒ ZERO eighth-why
 *                     decisions and the belief still EMPTY.
 *   F5  THE PULL      one `perceivedSnapshot` per own-run evaluation, UNCHANGED by the flag
 *                     (the DS-T1c spied-vs-unspied idiom).
 *   F6  THE READ SET  source needles over the seam span: `pendingPass` · `match.ball` ·
 *                     `ball.owner` · `lastTouch` · `info.genome` each ZERO.
 *   F7  THE SEAM MAP  per-file executable-line occurrence counts, paths normalized to '/'
 *                     (#418 item 2(iv) — `join()` yields a backslash on this host).
 *   F8  THE LITERALS  the SEVEN unchanged + the eighth exactly once.
 *   F9  THE MUTANT WALK — four mutants at RUNTIME and at SOURCE; M4 dies on a stored seed
 *                     where the PERCEIVED and the TRUTH owner DIVERGE, found by scan.
 *   F10 THE BAND      every walk but G-OFF inside 900,008,200–299, every base derived from
 *                     the ONE declared `BASE`.
 *
 * ⚠ THE SEED BANDS. Every walk in this file but ONE lives in the scratch band
 * **900,008,200–299** that ruling #417 item 3(iv) gives this stage, derived from the ONE
 * declared `BASE`. The EXCEPTION is G-OFF, which ruling #418 item 5(i) moves to DS-T0d's own
 * twelve seeds **900,007,400–411** so that the arm64 column can be INHERITED BY IDENTITY —
 * a DECLARED positive deviation for that pin only (stage doc §DEVIATIONS 3). Canon, VERBATIM:
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
const BASE = 900_008_200;
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
 * ⭐ THE STORED M4 SEED — the FIRST seed of the scan band on which the body's OWN memory of
 * the last owner and the TRUTH's current owner DIVERGE at a live flight evaluation, so that
 * the honest state fires where a `match.ball.owner` read does not (or the reverse). FOUND BY
 * SCAN (the scan is re-run below and must return exactly this seed), never chosen.
 */
const M4_SEED = 900_008_260;

/**
 * ⭐⭐ THE DIGESTS OF RECORD, ARCH-KEYED.
 *
 * **x64** — RECORDED AT THE DISPATCH HEAD `595a555` (ruling #418's own commit) in a clean
 * throwaway worktree (`git worktree add <scratch>/if-t0-base HEAD`, `node_modules` given by a
 * Windows junction, `git status --short` EMPTY) BEFORE one byte of this seam existed, on the
 * twelve seeds 900,007,400–411, and pasted here as literals. They are what "byte-identical to
 * the dispatch HEAD" MEANS on this architecture.
 *
 * **arm64** — INHERITED BY IDENTITY (#418 item 2(ii) route (a)) from
 * `tests/dsCoopHatsOff.test.ts`'s `HEAD_DIGESTS`, recorded at `f1a46b1`: the same twelve
 * seeds, the same `signatureOf`, the same pooling digest, and worlds ≤ 16 byte-identical
 * since that head (#413 / #415). Literal for literal:
 *   bare `a81e4054…0245` · w13 `d7b9b9e6…2f88` · w15 `1c959b52…b9b5` · w16 `2b78c8a9…4b61`.
 * World **17** has no arm64 literal of record with this recipe ⇒ **ABSENT** (the pin skips on
 * arm64 and says so in its title). ⛔ No arm64 number here was measured on this host.
 */
const HEAD_COMMIT = '595a555';
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
 * ⭐ THE SEAM SPAN — from the two ALIAS lines (the flag and the belief, taken one line above
 * the own-run fork so DS-T0c's frozen block pins stay green — stage doc §DEVIATIONS 2)
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
    expect(s.m.ifLastSeenOwnerGid.get(s.p.gid)).toBe(mate.gid);
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
    expect(s.m.ifLastSeenOwnerGid.get(s.p.gid)).toBe(opp.gid);
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
    expect(s.m.ifLastSeenOwnerGid.get(s.p.gid)).toBe(s.p.gid);
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
    inject(s.m, s.p, null);
    aimAt(s, mate.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).toBeNull();
    expect(s.m.ifLastSeenOwnerGid.size).toBe(0);
  });
});

/* ------------------------------------------------------------------ */
/* F1 — G-OFF: the OFF world is the DISPATCH HEAD's, byte for byte      */
/* ------------------------------------------------------------------ */

const gOff = (world: 13 | 15 | 16 | 17 | undefined): string =>
  digest(G_SEEDS.map((s) => signatureOf(matchOf(s, world === undefined ? {} : { world }))));

describe('IF T0 — G-OFF: the flag absent ⇒ the world is the dispatch HEAD\'s (ARCH-KEYED)', () => {
  it('the arch-keyed table is honest: x64 RECORDED here, arm64 INHERITED BY IDENTITY, world 17 ABSENT on arm64', () => {
    expect(HEAD_COMMIT).toBe('595a555');
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
}

const walk = (seed: number, a: Arm): Obs => {
  const m = matchOf(seed, a);
  const o: Obs = { ticks: 0, seventh: 0, eighth: 0, beliefSize: 0 };
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
  return o;
};

describe('IF T0 — the belief is EMPTY with the flag absent, and written when armed', () => {
  for (const world of [16, 17] as const) {
    it(`world ${world}: the flag ABSENT ⇒ the belief map is EMPTY over whole matches (a COUNT) and the eighth \`why\` never appears`, () => {
      let ticks = 0;
      let seventh = 0;
      for (const seed of ARMED_SEEDS) {
        const o = walk(seed, { world });
        expect(o.beliefSize).toBe(0);
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
      for (const seed of ARMED_SEEDS) {
        const o = walk(seed, { world, flight: true });
        eighth += o.eighth;
        seventh += o.seventh;
        belief += o.beliefSize;
      }
      expect(eighth).toBeGreaterThan(0);
      expect(seventh).toBeGreaterThan(0);
      expect(belief).toBeGreaterThan(0);
    }, 300_000);
  }
});

describe('IF T0 — CONTAINED: the flag on a world WITHOUT `dsOwnRun` does nothing', () => {
  for (const world of [13, undefined] as const) {
    it(`${world === undefined ? 'the BARE world' : `world ${world}`} + the flag ⇒ ZERO eighth-why decisions and the belief still EMPTY`, () => {
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
        ticks += o.ticks;
      }
      expect(ticks).toBeGreaterThan(20_000);
    }, 300_000);
  }
});

/* ------------------------------------------------------------------ */
/* F5 — the percept pull is UNCHANGED by this flag                      */
/* ------------------------------------------------------------------ */

describe('IF T0 — the pull count per own-run evaluation is UNCHANGED', () => {
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

describe('IF T0 — the READ SET of the seam span', () => {
  it('⛔ no truth read: `pendingPass` · `match.ball` · `ball.owner` · `lastTouch` · `info.genome` each count ZERO', () => {
    const code = codeLines(SEAM_SPAN).join('\n');
    for (const banned of ['pendingPass', 'match.ball', 'ball.owner', 'lastTouch',
      'info.genome', 'pendingPassWindup', 'opp.', 'allPlayers', 'dist(', 'topSpeed']) {
      expect(count(code, new RegExp(banned.replace(/[.()]/g, '\\$&'), 'g')), banned).toBe(0);
    }
    // the span really does contain the seam (non-vacuity of the needle scan)
    expect(code).toContain('const ifFlightRun = match.ifFlightRun;');
    expect(code).toContain('const ifLastSeenOwner = match.ifLastSeenOwnerGid;');
    expect(code).toContain(`why: '${OWN_RUN_WHY}'`);
    expect(code).toContain(`'${FLIGHT_RUN_WHY}'`);
  });

  it('⛔ ONE pull, and it is the fork\'s existing one', () => {
    expect(count(codeLines(SEAM_SPAN).join('\n'), /match\.perceivedSnapshot/g)).toBe(1);
    expect(SEAM_SPAN).toContain('const snapshot = match.perceivedSnapshot(p);');
    // and the whole file still takes exactly three (the pass chooser's two plus this one)
    expect(count(codeLines(playerSource).join('\n'), /match\.perceivedSnapshot/g)).toBe(3);
  });

  it('⛔ NO predicate on a football quantity (#200): the seam\'s own lines are identity tests', () => {
    const own = codeLines(SEAM_SPAN)
      .filter((l) => l.includes('ifFlightRun') || l.includes('ifLastSeenOwner')
        || l.includes('ifOntoFlight') || l.includes('ifMateRemembered')
        || l.includes('ifSawOwner') || l.includes('ifCand') || l.includes('ifLastSeenGid'))
      .join('\n');
    // no inequality, no arithmetic on a football quantity, no numeric literal but the
    // accumulator-free `- 1` of the candidate index
    expect(/[<>]/.test(own)).toBe(false);
    expect(own.match(/\d+(\.\d+)?/g)).toEqual(['1']);
    expect(own).toContain('const ifOntoFlight = ifFlightRun && seenBall !== null && ownerGid === null');
    expect(own).toContain('&& ifLastSeenGid !== null && ifLastSeenGid !== p.gid && ifMateRemembered;');
    expect(own).toContain('carrierIsMate = carrierIsMate || ifOntoFlight;');
  });

  it('the belief is written ONLY from the pulled snapshot\'s owner, and read ONLY from his own entry', () => {
    const code = codeLines(SEAM_SPAN).join('\n');
    expect(code).toContain('const ifSawOwner = ifFlightRun && ownerGid !== null;');
    expect(code).toContain('? (ifLastSeenOwner.set(p.gid, ownerGid), ownerGid)');
    expect(code).toContain(': (ifFlightRun ? (ifLastSeenOwner.get(p.gid) ?? null) : null);');
    // exactly ONE write site and ONE read site in all of `src/**`
    let writes = 0;
    let reads = 0;
    for (const f of srcFiles('src')) {
      const text = codeLines(readFileSync(f, 'utf8')).join('\n');
      writes += count(text, /ifLastSeenOwner\.set\(/g);
      reads += count(text, /ifLastSeenOwner\.get\(/g);
    }
    expect(writes).toBe(1);
    expect(reads).toBe(1);
  });
});

/* ------------------------------------------------------------------ */
/* F7 — THE SEAM MAP (paths normalized to '/')                          */
/* ------------------------------------------------------------------ */

describe('IF T0 — the seam map', () => {
  it('the flag and the belief are named at exactly the files the doc names, and nowhere else', () => {
    const flagFiles = new Map<string, number>();
    const beliefFiles = new Map<string, number>();
    for (const f of srcFiles('src')) {
      const code = codeLines(readFileSync(f, 'utf8')).join('\n');
      const a = count(code, /ifFlightRun/g);
      const b = count(code, /ifLastSeenOwnerGid/g);
      if (a > 0) flagFiles.set(f, a);
      if (b > 0) beliefFiles.set(f, b);
    }
    expect([...flagFiles.keys()].sort())
      .toEqual(['src/ai/PlayerBrain.ts', 'src/sim/League.ts', 'src/sim/Match.ts']);
    // Match.ts: FOUR — the optional config key, the readonly field, and the init line, which
    // names it TWICE (the `dsCoopHatsOff` count of 4 has the same shape).
    expect(flagFiles.get('src/sim/Match.ts')).toBe(4);
    expect(flagFiles.get('src/sim/League.ts')).toBe(1);
    // PlayerBrain.ts: FIVE — the alias line (twice) and the three reads of the alias.
    expect(flagFiles.get('src/ai/PlayerBrain.ts')).toBe(5);
    expect([...beliefFiles.keys()].sort())
      .toEqual(['src/ai/PlayerBrain.ts', 'src/sim/Match.ts']);
    expect(beliefFiles.get('src/sim/Match.ts')).toBe(2);
    expect(beliefFiles.get('src/ai/PlayerBrain.ts')).toBe(1);
    // ⭐ THE ENTRY LAYER names NEITHER — no world and no preset arms this seam (Road B).
    expect(count(a4Source, /ifFlightRun|ifLastSeenOwnerGid/g)).toBe(0);
  });

  it('the gate lines are the source literals the doc quotes', () => {
    expect(matchSource).toContain('  ifFlightRun?: boolean;');
    expect(matchSource).toContain('  readonly ifFlightRun: boolean;');
    expect(matchSource).toContain('  readonly ifLastSeenOwnerGid: Map<number, number | null>;');
    expect(matchSource).toContain('this.ifFlightRun = cfg.ifFlightRun ?? false;');
    expect(matchSource).toContain('this.ifLastSeenOwnerGid = new Map();');
    expect(leagueSource).toContain("| 'ifFlightRun'");
    expect(playerSource).toContain('    const ifFlightRun = match.ifFlightRun;');
    expect(playerSource).toContain('    const ifLastSeenOwner = match.ifLastSeenOwnerGid;');
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

  it('the belief map is created EMPTY in the constructor and nowhere else', () => {
    expect(count(matchSource, /ifLastSeenOwnerGid = new Map\(\)/g)).toBe(1);
    expect(count(matchSource, /ifLastSeenOwnerGid\.(set|delete|clear)\(/g)).toBe(0);
    expect(matchOf(BASE).ifLastSeenOwnerGid.size).toBe(0);
    expect(matchOf(BASE, { flight: true }).ifLastSeenOwnerGid.size).toBe(0);
  });
});

/* ------------------------------------------------------------------ */
/* F8 — the SEVEN literals unchanged + the eighth exactly once          */
/* ------------------------------------------------------------------ */

describe('IF T0 — the `why` literal set', () => {
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
 * flips the state: his eyes show a ball with no owner, his MEMORY holds a same-side mate (the
 * honest state FIRES) while the TRUTH owner is not a same-side mate other than him (a
 * `match.ball.owner` read would NOT fire) — or the exact reverse. The first seed of the scan
 * band on which that happens is the stored `M4_SEED`.
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
      const remembered = m.ifLastSeenOwnerGid.get(p.gid) ?? null;
      const isMate = (gid: number | null): boolean =>
        gid !== null && gid !== p.gid && t.players.some((q) => q.gid === gid);
      const honest = isMate(remembered);
      const truthy = isMate(m.ball.owner === null ? null : m.ball.owner.gid);
      if (honest !== truthy) diverged++;
    }
  }
  return diverged;
};

describe('IF T0 — the mutant walk', () => {
  it('M1 — the flight clause DROPPED: killed at runtime by F0/F3 and at source by the state line', () => {
    // SOURCE: the two conjuncts that ARE the flight state
    expect(SEAM_SPAN).toContain('seenBall !== null && ownerGid === null');
    expect(SEAM_SPAN).toContain('carrierIsMate = carrierIsMate || ifOntoFlight;');
    // RUNTIME: with the clause dropped the eighth `why` could never appear — F0's firing
    // fixture and F3's armed walks observe it appearing, on this seed too.
    const s = stage(BASE + 10, { world: 16 });
    const mate = mateOf(s);
    inject(s.m, s.p, mate.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    inject(s.m, s.p, null);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).not.toBeNull();
  });

  it('M2 — the belief NEVER WRITTEN: killed at runtime by the empty-memory scene and at source by the one write site', () => {
    expect(SEAM_SPAN).toContain('(ifLastSeenOwner.set(p.gid, ownerGid), ownerGid)');
    // RUNTIME: without the write the memory stays empty and nothing can ever fire — here it
    // is written, and the scene that reads it fires.
    const s = stage(BASE + 11, { world: 16 });
    const mate = mateOf(s);
    expect(s.m.ifLastSeenOwnerGid.size).toBe(0);
    inject(s.m, s.p, mate.gid);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(s.m.ifLastSeenOwnerGid.get(s.p.gid)).toBe(mate.gid);
    inject(s.m, s.p, null);
    unhat(s);
    decidePlayer(s.p, s.m);
    expect(whyScore(s.m, s.p, FLIGHT_RUN_WHY)).not.toBeNull();
  });

  it('M3 — the flag read INVERTED: killed by G-OFF, by the empty-belief count and by the source form', () => {
    // SOURCE: every read of the door is POSITIVE — there is no `!ifFlightRun` anywhere.
    expect(count(playerSource, /!ifFlightRun/g)).toBe(0);
    expect(count(playerSource, /!match\.ifFlightRun/g)).toBe(0);
    expect(SEAM_SPAN).toContain('const ifSawOwner = ifFlightRun && ownerGid !== null;');
    // RUNTIME: inverted, the flag-ABSENT world would write the belief and push the eighth —
    // which F1's digests, F2's zero count and this scene all observe NOT to happen.
    const o = walk(BASE + 12, { world: 16 });
    expect(o.beliefSize).toBe(0);
    expect(o.eighth).toBe(0);
  }, 180_000);

  it('M4 — the last-owner test reading TRUTH `match.ball.owner`: dies on the STORED divergence seed', () => {
    // SOURCE: the truth ball is not named anywhere in the span (F6 holds this too)
    expect(count(codeLines(SEAM_SPAN).join('\n'), /match\.ball/g)).toBe(0);
    expect(count(codeLines(SEAM_SPAN).join('\n'), /ball\.owner/g)).toBe(0);
    // RUNTIME: the scan re-derives the stored seed — the FIRST in the band where the body's
    // own memory and the truth's owner disagree at a live flight evaluation.
    const found = M4_SCAN_SEEDS.find((s) => m4Divergences(s) > 0);
    expect(found).toBe(M4_SEED);
    expect(m4Divergences(M4_SEED)).toBeGreaterThan(0);
  }, 300_000);
});

/* ------------------------------------------------------------------ */
/* F10 — the narrows, and the scratch bands                             */
/* ------------------------------------------------------------------ */

describe('IF T0 — the narrowed pins, and the scratch band', () => {
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
    expect(BASE).toBe(900_008_200);
    for (const s of [...ARMED_SEEDS, ...CONTAINED_SEEDS, ...M4_SCAN_SEEDS,
      PULL_SEED, M4_SEED, BASE + 1, BASE + 2, BASE + 3, BASE + 4, BASE + 5,
      BASE + 10, BASE + 11, BASE + 12]) {
      expect(s).toBeGreaterThanOrEqual(BASE);
      expect(s).toBeLessThanOrEqual(BASE + 99);
    }
    // ⚠ THE ONE DECLARED DEVIATION (#418 item 5(i)): G-OFF walks DS-T0d's own twelve seeds so
    // that the arm64 column can be INHERITED BY IDENTITY. Stage doc §DEVIATIONS 3.
    expect(G_BASE).toBe(900_007_400);
    for (const s of G_SEEDS) {
      expect(s).toBeGreaterThanOrEqual(G_BASE);
      expect(s).toBeLessThanOrEqual(G_BASE + 11);
    }
  });
});
