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
import { frontContactOf } from '../src/ai/frontContact';
import {
  choosePerceivedPassTarget, pricePassOption, threatBandIndex, threatQuintilePrice,
  type PerceivedPassChoiceInput,
} from '../src/ai/perceivedPassChoice';
import { attemptValueAt, THREAT_CALIBRATION } from '../src/ai/passPrior';
import type { PassOptionValue } from '../src/ai/passOptionValue';
import { predictGroundPass } from '../src/ai/prediction';
import type { ObservedPlayer, PerceptionSnapshot } from '../src/ai/perceptionSnapshot';
import type { KnownReachProfile } from '../src/ai/reachability';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import {
  a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells, type A4ArmedVersion,
} from '../src/game/a4World';
import { Rng } from '../src/utils/rng';
import type { V2 } from '../src/utils/vec';

/**
 * ⭐⭐⭐ OP T0b — 「身前那个人 · 挑线」 THE FRONT-CHOOSER SEAM (docs/world-model/OP-T0B-FRONT-CHOOSER-SEAM.md;
 * contract OP-FRONT-MAN-CONTRACT.md §2 M-OP.5; COMMANDER RULING #435 items 3–4 — 「身前贴着的人要
 * 算进去」 applied to WHO) — THE SEAM'S PERMANENT PIN SUITE, in the `tests/opFrontMan.test.ts` form.
 *
 * WHAT THIS IS: ONE dormant flag (`match.opFrontChooser`), ONE pure fact (`frontContactOf`, new
 * file `src/ai/frontContact.ts`), ONE optional input (`frontContact?` on
 * `choosePerceivedPassTarget` → `pricePassOption`), ONE seat (inside `pricePassOption`'s READ
 * branch: an option with front contact is priced in the calibration's LAST band), and ONE
 * call-site argument (`PlayerBrain.ts`). NO constant, NO gene, NO weight. Dormant. Ships nothing.
 *
 * ⭐⭐⭐ THE ARCHITECTURE (ruling #418 item 2). The G-OFF table is keyed by `process.arch`. The
 * **x64** column was RECORDED BY THE EXECUTOR at the dispatch head `cbc30c5` (ruling #435's own
 * commit), IN PROCESS on the clean tree BEFORE one byte of this seam existed (`git status
 * --short` EMPTY), with a recorder whose recipe was first CHECKED by reproducing
 * `tests/opFrontMan.test.ts`'s four x64 literals (bare · w13 · w17 · w18) on its own seeds
 * 900,009,800–811. The **arm64** column is **ABSENT**: no literal of record exists on these
 * scratch seeds; its pins SKIP on arm64 and say so in their titles. The arm64 argument is BY
 * IDENTITY OF THE CODE PATH — with the door shut the seat's guard is `false` before any call and
 * `frontContactOf` is never invoked (F2 COUNTS that), so the shut world executes HEAD's
 * statements on every architecture. ⛔ Never a guess, never a number typed from memory.
 *
 * The pins (§PINS of the stage doc is the inventory; this file IS the living copy):
 *   F0  THE FIXTURES   `frontContactOf` — item 4(ii)'s list, in order; plus the segment's end is
 *                      the predicted `targetPoint`, not the target's position.
 *   F0b THE AGREEMENT  ⭐ over a random sweep, `frontContactOf` is TRUE exactly when
 *                      `laneOpennessFront` on the same segment and the same live opponents reads
 *                      below 1 because of a man inside the partition.
 *   F1  THE SEAT       `pricePassOption`: absent ≡ false ≡ shipped; armed with front contact ⇒
 *                      the LAST row on both axes; armed without ⇒ shipped; the read NOT mutated.
 *   F2  G-OFF          bare · 13 · 17 · 18 · 18 + `opFrontMan` reproduce the x64 digests
 *                      recorded at HEAD; ABSENT ≡ EXPLICITLY FALSE; the fingerprint.
 *   F3  DORMANT        the flag absent ⇒ `frontContactOf` is called ZERO times (COUNTS).
 *   F4  ARMED          on scratch walks the chosen target differs from the shut chooser's ONLY
 *                      on choices where some option had front contact, and DOES differ on some.
 *   F5  THE SEAM MAP   source pins and per-file counts, paths normalized to '/'.
 *   F6  THE MUTANT WALK M1–M4 with their EXACT texts and the pins that kill them.
 *   F7  THE BAND       every seed inside 900,010,400–499 from the ONE declared `BASE`.
 *
 * ⚠ THE SEED BAND (#435 item 4(iv)): scratch **900,010,400–499** from ONE base; verifier
 * 900,010,500–599. ZERO frontier, ZERO stats.
 * ⭐ Receipts are receipts (ruling #289 item 1): every count below is ARMING PLUMBING. What the
 * seat does to the football is OP-T1b's question, and this stage claims none of it.
 */

/**
 * ⭐ THE RECORDERS (the in-process HEAD-vs-seam A/B — no worktree). Each wrapper returns the
 * original's value untouched, so it changes nothing it observes.
 *   frontContactOf          — counted (F3), the original reachable for the tests' own reads.
 *   evaluatePassOption      — every returned read captured with a shallow copy (F1: not mutated).
 *   choosePerceivedPassTarget — an armed call is ALSO priced shut on the same input (F4).
 */
const probe = vi.hoisted(() => ({
  frontCalls: 0,
  reads: null as null | { obj: unknown; copy: unknown }[],
  choose: null as null | ((input: unknown, armed: unknown) => void),
}));
vi.mock('../src/ai/frontContact', async (importOriginal) => {
  const orig = await importOriginal<typeof import('../src/ai/frontContact')>();
  return {
    ...orig,
    frontContactOf: (...args: Parameters<typeof orig.frontContactOf>): boolean => {
      probe.frontCalls++;
      return orig.frontContactOf(...args);
    },
  };
});
vi.mock('../src/ai/passOptionValue', async (importOriginal) => {
  const orig = await importOriginal<typeof import('../src/ai/passOptionValue')>();
  return {
    ...orig,
    evaluatePassOption: (input: Parameters<typeof orig.evaluatePassOption>[0]) => {
      const v = orig.evaluatePassOption(input);
      if (probe.reads !== null) probe.reads.push({ obj: v, copy: v === null ? null : { ...v } });
      return v;
    },
  };
});
vi.mock('../src/ai/perceivedPassChoice', async (importOriginal) => {
  const orig = await importOriginal<typeof import('../src/ai/perceivedPassChoice')>();
  return {
    ...orig,
    choosePerceivedPassTarget: (input: Parameters<typeof orig.choosePerceivedPassTarget>[0]) => {
      const v = orig.choosePerceivedPassTarget(input);
      if (probe.choose !== null) probe.choose(input, v);
      return v;
    },
  };
});

/** the UNWRAPPED originals, for the tests' own reads (never counted) */
const actualFront = (await vi.importActual<typeof import('../src/ai/frontContact')>(
  '../src/ai/frontContact')).frontContactOf;
const actualChoose = (await vi.importActual<typeof import('../src/ai/perceivedPassChoice')>(
  '../src/ai/perceivedPassChoice')).choosePerceivedPassTarget;

const ARCH = process.arch;

/** The production fingerprint of record, ARCH-KEYED (copied from `tests/opFrontMan.test.ts`). */
const FINGERPRINT_OF_RECORD: Readonly<Record<string, string>> = {
  arm64: '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
  x64: '59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d',
};

/** ⚠ THE ONE DECLARED BASE. Every seed in this file is `BASE + k`, `0 ≤ k ≤ 99`. */
const BASE = 900_010_400;
/** G-OFF's twelve seeds (≥ 12, #435 item 4(ii)) */
const G_SEEDS: readonly number[] = Array.from({ length: 12 }, (_, i) => BASE + i);
/** the dormancy walks (F3) */
const DORMANT_SEEDS: readonly number[] = Array.from({ length: 3 }, (_, i) => BASE + 20 + i);
/** the armed liveness walks (F4) */
const ARMED_SEEDS: readonly number[] = Array.from({ length: 3 }, (_, i) => BASE + 30 + i);
/** the agreement sweep (F0b) */
const SWEEP_SEED = BASE + 50;
/** the armed ≠ shut whole-match check (F4) */
const MOVE_SEEDS: readonly number[] = Array.from({ length: 2 }, (_, i) => BASE + 60 + i);

/**
 * ⭐⭐ THE DIGESTS OF RECORD, ARCH-KEYED. **x64** — RECORDED at the dispatch head `cbc30c5`
 * (ruling #435's commit) on the twelve seeds 900,010,400–411 before the seam existed, and
 * RE-DERIVED after the seam with the door shut (identical). **arm64** — ABSENT (no literal of
 * record on these seeds; skipped by title). `w18op` = world 18 + `opFrontMan: true` (OP-T0's
 * door armed, this one shut).
 */
const HEAD_COMMIT = 'cbc30c5';
const HEAD_DIGESTS: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  x64: {
    bare: '335339cea1a61e48c10c7c0ddb9877bdab288fadea7f9de8eda5a2b648aaaec5',
    w13: 'fca46900dadc4c68b1ec84aeb0bcc696d8b6bc9426ec8895f5741cd709dde2da',
    w17: '20e8e7c99cdd743f7e4dabfbd20da2cb1939e9818b62003b6d4982a7d68820bd',
    w18: '501be87cf9e166ebdf7912d2326f1b8f0c5f09c8fbaaf054745cc3488fae758e',
    w18op: '30c37c19d33147b7a3cd3ccf29990f88ac3d086f7105ea35ea8b47b07259a74f',
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
  chooser?: boolean;
  chooserExplicitFalse?: boolean;
  frontMan?: boolean;
  world?: 13 | 17 | 18;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const base = a.world === undefined ? {} : a4MatchFlags(a.world);
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    duration: 240,
    ...base,
    ...(a.frontMan === true ? { opFrontMan: true } : {}),
    ...(a.chooser === true ? { opFrontChooser: true } : {}),
    ...(a.chooserExplicitFalse === true ? { opFrontChooser: false } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (a.world !== undefined) armA4World(m, null, a.world, L3_DOSE, PC_DOSE);
  return m;
};

/**
 * ⭐⭐ THE WORLD-IDENTITY SIGNATURE — BYTE-EQUAL to `tests/opFrontMan.test.ts`'s (and so to
 * `tests/ifFlightRun.test.ts`'s) `signatureOf`. Do not touch it without re-recording.
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
const gOff = (a: Arm): string => digest(G_SEEDS.map((seed) => signatureOf(matchOf(seed, a))));

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
const chooserSource = src('ai/perceivedPassChoice.ts');
const frontSource = src('ai/frontContact.ts');
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

/** the seat's guard and block, VERBATIM — the ONE fork on the input */
const SEAT_GUARD = [
  '  const frontSeat = input.frontContact === true',
  '    && frontContactOf(snapshot, passerGid, targetGid, reachProfiles, 1);',
  '  if (frontSeat) {',
].join('\n');
/** the shipped READ branch, VERBATIM — byte-unchanged by this seam */
const SHIPPED_READ = [
  '  const reception = threatQuintilePrice(read.interceptionThreatSeconds);',
  '  const band = threatBandIndex(read.interceptionThreatSeconds);',
  '  const value = valueAxis ? attemptValueAt(cell, band) : 1;',
  '  return {',
  '    targetGid,',
  "    infoClass: 'READ',",
  '    cell,',
  '    band,',
  '    price: valueAxis ? value : reception,',
  '    reception,',
  '    value,',
  '    executable: true,',
  '    distance,',
  '  };',
  '}',
].join('\n');
/** the call-site argument, VERBATIM */
const CALL_SITE_LINE = '        frontContact: match.opFrontChooser,';
/** OP-T0's seat line, VERBATIM — untouched by this stage */
const OP_T0_SEAT_LINE =
  '      const laneOpenness = match.opFrontMan ? laneOpennessFront : laneOpennessShipped;';

/* ---------------- fixtures: a passer's own snapshot ---------------- */

const LAST = THREAT_CALIBRATION.length - 1;
const seen = (gid: number, side: 0 | 1, x: number, y: number, vx = 0, vy = 0): ObservedPlayer => ({
  gid, side, pos: { x, y }, vel: { x: vx, y: vy }, bodyDir: { x: 1, y: 0 },
  observedTick: 0, ageTicks: 0,
});
const snapshotOf = (players: ObservedPlayer[]): PerceptionSnapshot => ({
  tick: 0,
  observerGid: 0,
  awareness: 0.8,
  ball: { pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, ownerGid: 0, observedTick: 0, ageTicks: 0 },
  players,
});
const profiles = (gids: readonly number[]): Map<number, KnownReachProfile> =>
  new Map(gids.map((gid) => [gid, { topSpeed: 7, accel: 6, dribbling: 0.5 }]));
/** passer 0 at the origin, target 1 at (10, 0) standing still, ONE opponent 9 at (x, y) */
const oneMan = (x: number, y: number): { snap: PerceptionSnapshot; prof: Map<number, KnownReachProfile> } => ({
  snap: snapshotOf([seen(0, 0, 0, 0), seen(1, 0, 10, 0), seen(9, 1, x, y)]),
  prof: profiles([0, 1, 9]),
});
const fc = (x: number, y: number): boolean => {
  const { snap, prof } = oneMan(x, y);
  return frontContactOf(snap, 0, 1, prof, 1);
};

/* ------------------------------------------------------------------ */
/* F0 — THE FIXTURES (item 4(ii), in order)                            */
/* ------------------------------------------------------------------ */

describe('OP T0b — the frontContactOf FIXTURES (ruling #435 item 4(ii))', () => {
  it('a man 1 m AHEAD on the line ⇒ TRUE', () => {
    expect(fc(1, 0)).toBe(true);
  });

  it('a man BEHIND the passer ⇒ FALSE', () => {
    expect(fc(-1, 0)).toBe(false);
    expect(fc(-0.3, 0.2)).toBe(false);
  });

  it('a man LEVEL with the passer ⇒ FALSE (his closest point IS the passer)', () => {
    expect(fc(0, 0.5)).toBe(false);
    expect(fc(0, 0)).toBe(false);
  });

  it('1 m ahead at EXACTLY CONTROL_RADIUS aside ⇒ FALSE; just inside ⇒ TRUE', () => {
    expect(fc(1, CONTROL_RADIUS)).toBe(false);
    expect(fc(1, -CONTROL_RADIUS)).toBe(false);
    expect(fc(1, CONTROL_RADIUS - 1e-9)).toBe(true);
    expect(fc(1, -(CONTROL_RADIUS - 1e-9))).toBe(true);
  });

  it('at EXACTLY 1.5 m along the line ⇒ FALSE; just inside ⇒ TRUE', () => {
    expect(fc(1.5, 0)).toBe(false);
    expect(fc(1.5 - 1e-9, 0)).toBe(true);
    expect(fc(3, 0)).toBe(false);
  });

  it('a SENT-OFF man (no reach profile: `Match.reachProfiles` skips him) ⇒ FALSE', () => {
    const { snap } = oneMan(1, 0);
    expect(frontContactOf(snap, 0, 1, profiles([0, 1]), 1)).toBe(false);
  });

  it('a man the SNAPSHOT does not hold ⇒ FALSE (no truth is read)', () => {
    const snap = snapshotOf([seen(0, 0, 0, 0), seen(1, 0, 10, 0)]);
    expect(frontContactOf(snap, 0, 1, profiles([0, 1, 9]), 1)).toBe(false);
  });

  it('a TEAMMATE 1 m ahead on the line ⇒ FALSE', () => {
    const snap = snapshotOf([seen(0, 0, 0, 0), seen(1, 0, 10, 0), seen(2, 0, 1, 0)]);
    expect(frontContactOf(snap, 0, 1, profiles([0, 1, 2]), 1)).toBe(false);
  });

  it('the segment ends at the PREDICTED targetPoint (the corridor\'s own `predictGroundPass`), not the target\'s position', () => {
    // target 1 at (10, 0) running at (0, 8): targetPoint = (10, 4). A man at (1, 1.3) is
    // ~0.836 m from the passer → targetPoint line, but 1.3 m from the passer → target line.
    const snap = snapshotOf([seen(0, 0, 0, 0), seen(1, 0, 10, 0, 0, 8), seen(9, 1, 1, 1.3)]);
    const tp = predictGroundPass({ x: 0, y: 0 }, snap.players[1], 1).targetPoint;
    expect(tp.x).toBeCloseTo(10, 12);
    expect(tp.y).toBeCloseTo(4, 12);
    expect(1.3).toBeGreaterThan(CONTROL_RADIUS);
    expect(frontContactOf(snap, 0, 1, profiles([0, 1, 9]), 1)).toBe(true);
    // the passer or the target missing from his snapshot ⇒ FALSE (never a guess)
    expect(frontContactOf(snap, 0, 7, profiles([0, 1, 9]), 1)).toBe(false);
    expect(frontContactOf(snap, 5, 1, profiles([0, 1, 9]), 1)).toBe(false);
  });
});

/* ------------------------------------------------------------------ */
/* F0b — ⭐ THE AGREEMENT PIN with laneOpennessFront                    */
/* ------------------------------------------------------------------ */

/** a stand-in body for the lane forms: they read `pos` and `sentOff` and nothing else */
const body = (p: Readonly<V2>): Player => ({ pos: { x: p.x, y: p.y }, sentOff: false }) as unknown as Player;

describe('OP T0b — ⭐ THE AGREEMENT: frontContactOf ≡ "laneOpennessFront reads below 1 because of a man inside the partition"', () => {
  it('random sweep, 4,000 lanes: TRUE exactly when some live observed opponent reads below 1 under the front form and 1 under the shipped one (the partition man), on the same segment', () => {
    const rng = new Rng(SWEEP_SEED);
    let yes = 0;
    let no = 0;
    for (let k = 0; k < 4_000; k++) {
      const from = { x: rng.range(-20, 20), y: rng.range(-12, 12) };
      const ang = rng.range(-Math.PI, Math.PI);
      const len = rng.range(6, 30);
      const tgt = seen(1, 0, from.x + Math.cos(ang) * len, from.y + Math.sin(ang) * len,
        rng.range(-6, 6), rng.range(-6, 6));
      const players: ObservedPlayer[] = [seen(0, 0, from.x, from.y), tgt];
      const live: number[] = [0, 1];
      const n = 1 + Math.floor(rng.next() * 5);
      for (let i = 0; i < n; i++) {
        const gid = 10 + i;
        const side: 0 | 1 = rng.next() < 0.15 ? 0 : 1;
        const a = rng.range(-1, 3);
        const b = rng.range(-2.5, 2.5);
        players.push(seen(gid, side,
          from.x + Math.cos(ang) * a - Math.sin(ang) * b,
          from.y + Math.sin(ang) * a + Math.cos(ang) * b));
        if (rng.next() >= 0.05) live.push(gid);
      }
      const snap = snapshotOf(players);
      const prof = profiles(live);
      const to = predictGroundPass(snap.players[0].pos, tgt, 1).targetPoint;
      const opponents = players.filter((p) => p.side === 1 && prof.has(p.gid));
      const expected = opponents.some((o) =>
        laneOpennessFront(from, to, [body(o.pos)]) < laneOpenness(from, to, [body(o.pos)]));
      const got = frontContactOf(snap, 0, 1, prof, 1);
      expect(got, `lane ${k}`).toBe(expected);
      if (got) {
        yes++;
        // and the aggregate form agrees: the front form reads the lane below 1
        expect(laneOpennessFront(from, to, opponents.map((o) => body(o.pos)))).toBeLessThan(1);
      } else {
        no++;
      }
    }
    // non-vacuity: both partitions populated
    expect(yes).toBeGreaterThan(500);
    expect(no).toBeGreaterThan(500);
  });
});

/* ------------------------------------------------------------------ */
/* F1 — THE SEAT inside pricePassOption                                */
/* ------------------------------------------------------------------ */

describe('OP T0b — THE SEAT: pricePassOption\'s READ branch, armed ⇒ the LAST band; absent ⇒ shipped', () => {
  const price = (x: number, y: number, valueAxis: boolean, frontContact?: boolean) => {
    const { snap, prof } = oneMan(x, y);
    return pricePassOption({
      snapshot: snap, passerGid: 0, targetGid: 1, attackDir: 1, reachProfiles: prof, valueAxis,
      ...(frontContact === undefined ? {} : { frontContact }),
    });
  };

  it('a man 1 m ahead on the line: the SHIPPED read prices his lane below the worst band (the misread), on both axes', () => {
    for (const axis of [false, true]) {
      const shut = price(1, 0, axis);
      expect(shut.infoClass).toBe('READ');
      expect(shut.band).toBeLessThan(LAST);
    }
  });

  it('ABSENT ≡ EXPLICITLY FALSE ≡ shipped, and frontContactOf is not called', () => {
    for (const axis of [false, true]) {
      probe.frontCalls = 0;
      const absent = price(1, 0, axis);
      const off = price(1, 0, axis, false);
      expect(off).toEqual(absent);
      expect(probe.frontCalls).toBe(0);
    }
  });

  it('ARMED with front contact ⇒ band = the LAST row, reception = its realizedSuccess, value = attemptValueAt(cell, last) on the value axis', () => {
    for (const axis of [false, true]) {
      const shut = price(1, 0, axis);
      const armed = price(1, 0, axis, true);
      expect(armed.band).toBe(LAST);
      expect(armed.band).toBe(threatBandIndex(Number.POSITIVE_INFINITY));
      expect(armed.reception).toBe(THREAT_CALIBRATION[LAST].realizedSuccess);
      expect(armed.reception).toBe(threatQuintilePrice(Number.POSITIVE_INFINITY));
      expect(armed.value).toBe(axis ? attemptValueAt(shut.cell, LAST) : 1);
      expect(armed.price).toBe(axis ? armed.value : armed.reception);
      // every other field is the shipped option's
      expect({ ...armed, band: 0, reception: 0, value: 0, price: 0 })
        .toEqual({ ...shut, band: 0, reception: 0, value: 0, price: 0 });
      expect(armed.price).not.toBe(shut.price);
    }
  });

  it('ARMED without front contact (a man 3 m ahead, one 1 m ahead at CONTROL_RADIUS aside) ⇒ shipped, field for field', () => {
    for (const axis of [false, true]) {
      for (const [x, y] of [[3, 0], [1, CONTROL_RADIUS], [-1, 0]] as const) {
        expect(price(x, y, axis, true)).toEqual(price(x, y, axis));
      }
    }
  });

  it('⛔ THE READ OBJECT IS NOT MUTATED: every read evaluatePassOption returned is field-for-field what it returned, after the armed seat priced it', () => {
    probe.reads = [];
    try {
      for (const axis of [false, true]) price(1, 0, axis, true);
    } finally {
      const reads = probe.reads;
      probe.reads = null;
      expect(reads.length).toBe(2);
      for (const r of reads) {
        expect(r.obj).not.toBeNull();
        expect(r.obj).toEqual(r.copy);
        expect(Number.isFinite((r.obj as PassOptionValue).interceptionThreatSeconds)).toBe(true);
      }
    }
  });

  it('the chooser threads the input: choosePerceivedPassTarget(frontContact: true) prices the contact option LAST and plays the clean one', () => {
    // two mates: 1 at (10, 0) behind a man 1 m ahead; 2 at (0, 10) with a clear lane
    const snap = snapshotOf([seen(0, 0, 0, 0), seen(1, 0, 10, 0), seen(2, 0, 0, 10), seen(9, 1, 1, 0)]);
    const input: PerceivedPassChoiceInput = {
      snapshot: snap, passerGid: 0, candidateGids: [1, 2], attackDir: 1,
      reachProfiles: profiles([0, 1, 2, 9]), valueAxis: false,
    };
    const shut = choosePerceivedPassTarget(input)!;
    const armed = choosePerceivedPassTarget({ ...input, frontContact: true })!;
    expect(armed.options[0].band).toBe(LAST);
    expect(armed.options[1]).toEqual(shut.options[1]);
    expect(choosePerceivedPassTarget({ ...input, frontContact: false })).toEqual(shut);
  });
});

/* ------------------------------------------------------------------ */
/* F2 — G-OFF, ARCH-KEYED                                              */
/* ------------------------------------------------------------------ */

describe('OP T0b — G-OFF: the flag absent ⇒ the world is the dispatch HEAD\'s (ARCH-KEYED)', () => {
  it('the arch-keyed table is honest: x64 RECORDED at the dispatch head, arm64 ABSENT', () => {
    expect(HEAD_COMMIT).toBe('cbc30c5');
    expect(Object.keys(HEAD_DIGESTS)).toEqual(['x64']);
    expect(Object.keys(HEAD_DIGESTS.x64).sort()).toEqual(['bare', 'w13', 'w17', 'w18', 'w18op']);
    expect(HEAD_DIGESTS.arm64).toBeUndefined();
    expect(G_SEEDS).toEqual(Array.from({ length: 12 }, (_, i) => 900_010_400 + i));
  });

  it.skipIf(ARCH !== 'x64')('the BARE world reproduces the x64 digest recorded at HEAD (SKIPPED on arm64 — ABSENT)', () => {
    expect(gOff({})).toBe(HEAD_DIGESTS.x64.bare);
  }, 180_000);

  it.skipIf(ARCH !== 'x64')('world 13 reproduces the x64 digest recorded at HEAD (SKIPPED on arm64 — ABSENT)', () => {
    expect(gOff({ world: 13 })).toBe(HEAD_DIGESTS.x64.w13);
  }, 180_000);

  it.skipIf(ARCH !== 'x64')('world 17 reproduces the x64 digest recorded at HEAD (SKIPPED on arm64 — ABSENT)', () => {
    expect(gOff({ world: 17 })).toBe(HEAD_DIGESTS.x64.w17);
  }, 180_000);

  it.skipIf(ARCH !== 'x64')('world 18 — the user\'s play — reproduces the x64 digest recorded at HEAD (SKIPPED on arm64 — ABSENT)', () => {
    expect(gOff({ world: 18 })).toBe(HEAD_DIGESTS.x64.w18);
  }, 180_000);

  it.skipIf(ARCH !== 'x64')('world 18 + opFrontMan (OP-T0\'s door) reproduces the x64 digest recorded at HEAD (SKIPPED on arm64 — ABSENT)', () => {
    expect(gOff({ world: 18, frontMan: true })).toBe(HEAD_DIGESTS.x64.w18op);
  }, 180_000);

  it('ABSENT ≡ EXPLICITLY FALSE (the other half of dormancy), bare · world 18 · world 18 + opFrontMan', () => {
    for (const seed of G_SEEDS.slice(0, 3)) {
      expect(signatureOf(matchOf(seed, { chooserExplicitFalse: true })))
        .toBe(signatureOf(matchOf(seed)));
      expect(signatureOf(matchOf(seed, { world: 18, chooserExplicitFalse: true })))
        .toBe(signatureOf(matchOf(seed, { world: 18 })));
      expect(signatureOf(matchOf(seed, { world: 18, frontMan: true, chooserExplicitFalse: true })))
        .toBe(signatureOf(matchOf(seed, { world: 18, frontMan: true })));
    }
    expect(matchOf(BASE).opFrontChooser).toBe(false);
    expect(matchOf(BASE, { chooserExplicitFalse: true }).opFrontChooser).toBe(false);
    expect(matchOf(BASE, { chooser: true }).opFrontChooser).toBe(true);
    // the two doors are independent
    expect(matchOf(BASE, { chooser: true }).opFrontMan).toBe(false);
    expect(matchOf(BASE, { frontMan: true }).opFrontChooser).toBe(false);
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
/* F3 — DORMANT: frontContactOf is never called with the door shut      */
/* ------------------------------------------------------------------ */

describe('OP T0b — DORMANT: with the flag absent `frontContactOf` is never called (COUNTS)', () => {
  for (const world of [undefined, 18] as const) {
    it(`${world === undefined ? 'the BARE world' : `world ${world}`}: ZERO calls over whole matches with the flag absent`, () => {
      for (const seed of DORMANT_SEEDS) {
        probe.frontCalls = 0;
        play(matchOf(seed, { world }));
        expect(probe.frontCalls, `seed ${seed} shut`).toBe(0);
        probe.frontCalls = 0;
        play(matchOf(seed, { world, frontMan: true }));
        expect(probe.frontCalls, `seed ${seed} shut, opFrontMan armed`).toBe(0);
      }
      probe.frontCalls = 0;
    }, 180_000);
  }

  it('armed on world 18 it IS called (the chooser runs there: edsPerceivedChoice is world 18\'s)', () => {
    probe.frontCalls = 0;
    play(matchOf(DORMANT_SEEDS[0], { world: 18, chooser: true }));
    expect(probe.frontCalls).toBeGreaterThan(0);
    probe.frontCalls = 0;
  }, 180_000);
});

/* ------------------------------------------------------------------ */
/* F4 — ARMED liveness: the chosen target vs the SHUT chooser's         */
/* ------------------------------------------------------------------ */

interface Live {
  choices: number; withFront: number; differ: number; differWithoutFront: number;
  optionsMoved: number; optionsMovedWithoutFront: number;
}
const liveWalk = (seed: number, a: Arm): Live => {
  const o: Live = {
    choices: 0, withFront: 0, differ: 0, differWithoutFront: 0, optionsMoved: 0, optionsMovedWithoutFront: 0,
  };
  probe.choose = (rawInput, rawArmed) => {
    const input = rawInput as PerceivedPassChoiceInput;
    if (input.frontContact !== true) return;
    const armed = rawArmed as ReturnType<typeof actualChoose>;
    const shut = actualChoose({ ...input, frontContact: undefined });
    o.choices++;
    const contact = new Map(input.candidateGids.map((g) => [g,
      actualFront(input.snapshot, input.passerGid, g, input.reachProfiles, 1)]));
    const any = [...contact.values()].some((v) => v);
    if (any) o.withFront++;
    if ((armed?.targetGid ?? -1) !== (shut?.targetGid ?? -1)) {
      o.differ++;
      if (!any) o.differWithoutFront++;
    }
    const ao = armed?.options ?? [];
    const so = shut?.options ?? [];
    expect(ao.length).toBe(so.length);
    for (let i = 0; i < ao.length; i++) {
      if (JSON.stringify(ao[i]) !== JSON.stringify(so[i])) {
        o.optionsMoved++;
        if (contact.get(ao[i].targetGid) !== true) o.optionsMovedWithoutFront++;
      }
    }
  };
  try {
    play(matchOf(seed, { ...a, chooser: true }));
  } finally {
    probe.choose = null;
  }
  return o;
};

describe('OP T0b — ARMED: the chosen target differs from the shut chooser\'s ONLY where some option had front contact, and DOES differ', () => {
  for (const [label, a] of [['world 18', { world: 18 }], ['world 18 + opFrontMan', { world: 18, frontMan: true }]] as const) {
    it(`${label} + the flag, ${ARMED_SEEDS.length} scratch seeds: every differing choice had a front-contact option; some differ`, () => {
      const total: Live = {
        choices: 0, withFront: 0, differ: 0, differWithoutFront: 0, optionsMoved: 0, optionsMovedWithoutFront: 0,
      };
      for (const seed of ARMED_SEEDS) {
        const o = liveWalk(seed, a as Arm);
        for (const k of Object.keys(total) as (keyof Live)[]) total[k] += o[k];
      }
      // the record line (x64, this host) — read by the stage doc's §GATES
      console.log(`[OP-T0b armed ${label}] ${JSON.stringify(total)}`);
      expect(total.choices).toBeGreaterThan(100);
      expect(total.differWithoutFront).toBe(0);
      expect(total.optionsMovedWithoutFront).toBe(0);
      expect(total.differ).toBeGreaterThan(0);
      expect(total.differ).toBeLessThanOrEqual(total.withFront);
    }, 180_000);
  }

  it('armed, the world MOVES (world 18, whole-match signature ≠ the shut world)', () => {
    for (const seed of MOVE_SEEDS) {
      expect(signatureOf(matchOf(seed, { world: 18, chooser: true })))
        .not.toBe(signatureOf(matchOf(seed, { world: 18 })));
    }
  }, 180_000);
});

/* ------------------------------------------------------------------ */
/* F5 — THE SEAM MAP                                                   */
/* ------------------------------------------------------------------ */

describe('OP T0b — the seam map', () => {
  it('THE SEAT: the guard sits between the SEEN-UNREAD branch and the shipped READ lines, which are byte-unchanged', () => {
    const span = fnSpan(chooserSource, 'pricePassOption');
    expect(span).toContain(SEAT_GUARD);
    expect(span.endsWith(SHIPPED_READ)).toBe(true);
    expect(span.indexOf('  if (read === null) {')).toBeLessThan(span.indexOf(SEAT_GUARD));
    expect(span.indexOf(SEAT_GUARD)).toBeLessThan(span.indexOf(SHIPPED_READ));
    const code = codeLines(span).join('\n');
    expect(count(code, /frontContactOf\(/g)).toBe(1);
    expect(count(code, /input\.frontContact\b/g)).toBe(1);
    expect(count(code, /Number\.POSITIVE_INFINITY/g)).toBe(1);
    // ⛔ the read is never written: no assignment to it or to its threat
    expect(count(chooserSource, /interceptionThreatSeconds\s*=[^=]/g)).toBe(0);
    expect(count(chooserSource, /\bread\.\w+\s*=[^=]/g)).toBe(0);
    expect(count(chooserSource, /\bread\s*=[^=]/g)).toBe(1); // its one declaration, shipped
    expect(count(code, /read\.interceptionThreatSeconds/g)).toBe(2);
    // ⛔ NO NEW NUMBER in the seat: its literals are the shipped `1` (the read's own power, the
    // off-axis value) and nothing else
    const seat = span.slice(span.indexOf(SEAT_GUARD), span.indexOf(SHIPPED_READ));
    const nums = [...new Set(codeLines(seat).join('\n').match(/(?<![\w.])\d+(\.\d+)?(?![\w.])/g) ?? [])].sort();
    expect(nums).toEqual(['1']);
    // the shipped read is priced at power 1 — the seat reads the same flight
    expect(span).toContain('    snapshot, passerGid, targetGid, powerMultiplier: 1, attackDir, reachProfiles,');
  });

  it('THE THREAD: choosePerceivedPassTarget hands `frontContact` to pricePassOption on ONE new line; the shipped lines byte-present', () => {
    const span = fnSpan(chooserSource, 'choosePerceivedPassTarget');
    expect(span).toContain([
      '  const options = candidateGids.map((targetGid) => pricePassOption({',
      '    snapshot, passerGid, targetGid, attackDir, reachProfiles, valueAxis,',
      '    frontContact: input.frontContact,',
      '  }));',
    ].join('\n'));
    expect(count(codeLines(span).join('\n'), /frontContact/g)).toBe(2);
    // the LN hook's pins hold (lnOwnLane.test.ts): three `ownLaneFactor`, the shipped `priced`
    expect(count(chooserSource, /ownLaneFactor/g)).toBe(3);
    expect(chooserSource).toContain('  const priced = input.ownLaneFactor === undefined ? options');
    // ⛔ preferredPassPower (the canary) is not given the seat
    expect(fnSpan(chooserSource, 'preferredPassPower')).not.toContain('frontContact');
  });

  it('THE CALL SITE: ONE argument at the ONE chooser call in PlayerBrain; OP-T0\'s seat untouched', () => {
    expect(count(playerSource, /choosePerceivedPassTarget\(/g)).toBe(1);
    expect(playerSource).toContain([
      '        valueAxis: match.edsValueAxis,',
      '        ownLaneFactor: lnOwnLaneFactor,',
    ].join('\n'));
    expect(playerSource.split('\n').filter((l) => l === CALL_SITE_LINE)).toHaveLength(1);
    expect(codeLines(playerSource).filter((l) => /frontContact|opFrontChooser/.test(l)))
      .toEqual([CALL_SITE_LINE.trim()]);
    expect(count(playerSource, /frontContactOf/g)).toBe(0);
    expect(playerSource).toContain(OP_T0_SEAT_LINE);
    expect(count(codeLines(playerSource).join('\n'), /opFrontMan/g)).toBe(1);
  });

  it('THE FACT: frontContactOf — numbers {0, 1.5}, CONTROL_RADIUS imported, the corridor\'s own predictGroundPass, no Match / rng / truth', () => {
    const code = codeLines(fnSpan(frontSource, 'frontContactOf')).join('\n');
    const nums = [...new Set(code.match(/(?<![\w.])\d+(\.\d+)?(?![\w.])/g) ?? [])].sort();
    expect(nums).toEqual(['0', '1.5']);
    expect(code).toContain('if (!(along > 0 && along < 1.5)) continue;');
    expect(code).toContain('if (dist(cp, entry.pos as V2) < CONTROL_RADIUS) return true;');
    expect(code).toContain('const to = predictGroundPass(passer.pos, target, powerMultiplier).targetPoint;');
    expect(code).toContain('if (!reachProfiles.has(entry.gid)) continue;');
    expect(frontSource).toContain("import { CONTROL_RADIUS } from '../sim/constants';");
    expect(frontSource).toContain("import { predictGroundPass } from './prediction';");
    const imports = codeLines(frontSource).filter((l) => l.startsWith('import'));
    expect(imports).toHaveLength(5);
    expect(count(codeLines(frontSource).join('\n'), /Match|Rng|rng|truth|Math\.random/g)).toBe(0);
    // the corridor builds its flight with the same call
    expect(src('ai/passCorridorInterception.ts')).toContain(
      '  const flight = predictGroundPass(passer.pos, target, input.powerMultiplier ?? 1);');
  });

  it('the flag, the fact and the input are named at exactly the files the doc names, and nowhere else (paths normalized to /)', () => {
    const flagFiles = new Map<string, number>();
    const factFiles = new Map<string, number>();
    const inputFiles = new Map<string, number>();
    for (const f of srcFiles('src')) {
      const code = codeLines(readFileSync(f, 'utf8')).join('\n');
      const a = count(code, /opFrontChooser/g);
      const b = count(code, /frontContactOf/g);
      const c = count(code, /\bfrontContact\b/g);
      if (a > 0) flagFiles.set(f, a);
      if (b > 0) factFiles.set(f, b);
      if (c > 0) inputFiles.set(f, c);
    }
    expect([...flagFiles.keys()].sort())
      .toEqual(['src/ai/PlayerBrain.ts', 'src/sim/League.ts', 'src/sim/Match.ts']);
    // Match.ts: the config key, the readonly field, and the init line (which names it TWICE)
    expect(flagFiles.get('src/sim/Match.ts')).toBe(4);
    expect(flagFiles.get('src/sim/League.ts')).toBe(1);
    expect(flagFiles.get('src/ai/PlayerBrain.ts')).toBe(1);
    // the fact: its definition; the chooser's import and the seat's call
    expect([...factFiles.keys()].sort()).toEqual(['src/ai/frontContact.ts', 'src/ai/perceivedPassChoice.ts']);
    expect(factFiles.get('src/ai/frontContact.ts')).toBe(1);
    expect(factFiles.get('src/ai/perceivedPassChoice.ts')).toBe(2);
    // the input: the chooser's field, pricePassOption's field, the seat's read, the thread
    // (key + read), the module path; and the ONE call-site key
    expect([...inputFiles.keys()].sort()).toEqual(['src/ai/PlayerBrain.ts', 'src/ai/perceivedPassChoice.ts']);
    expect(inputFiles.get('src/ai/perceivedPassChoice.ts')).toBe(6);
    expect(inputFiles.get('src/ai/PlayerBrain.ts')).toBe(1);
  });

  it('⛔ no other consumer: the corridor, the option value, the affordance, the lane forms, the snapshot and the weight chooser name none of it', () => {
    for (const f of ['ai/passCorridorInterception.ts', 'ai/passOptionValue.ts', 'ai/passAffordance.ts',
      'ai/perception.ts', 'ai/ownLaneSeat.ts', 'ai/deliveryValueSeat.ts', 'ai/perceptionSnapshot.ts',
      'ai/passWeightChooser.ts', 'ai/reachability.ts', 'ai/prediction.ts'] as const) {
      expect(count(src(f), /frontContact|opFrontChooser/g), f).toBe(0);
    }
    // OP-T0's pin holds: the chooser module names neither OP-T0 name
    expect(count(chooserSource, /laneOpennessFront|opFrontMan/g)).toBe(0);
  });

  it('the gate lines are the source literals the doc quotes; the ONLY assignment is the constructor\'s', () => {
    expect(matchSource).toContain('  opFrontChooser?: boolean;');
    expect(matchSource).toContain('  readonly opFrontChooser: boolean;');
    expect(matchSource).toContain('    this.opFrontChooser = cfg.opFrontChooser ?? false;');
    expect(leagueSource).toContain("    | 'opFrontChooser'");
    for (const f of srcFiles('src')) {
      const text = readFileSync(f, 'utf8');
      expect(count(text, /\.opFrontChooser\s*=[^=]/g), f).toBe(f === 'src/sim/Match.ts' ? 1 : 0);
      expect(count(text, /opFrontChooser:\s*true/g), f).toBe(0);
      expect(count(text, /process\.env[^\n]*opFrontChooser/g), f).toBe(0);
    }
  });

  it('Road B: NO world 1–18 carries the flag; `a4World.ts` names none of it; `League.toJSON` omits it', () => {
    expect(count(a4Source, /opFrontChooser|frontContact/g)).toBe(0);
    const worlds: A4ArmedVersion[] =
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    for (const w of worlds) {
      expect((a4MatchFlags(w) as Record<string, unknown>).opFrontChooser, `world ${w}`).toBeUndefined();
    }
    for (const w of [13, 17, 18] as const) {
      expect(matchOf(BASE, { world: w }).opFrontChooser, `world ${w}`).toBe(false);
    }
    const l = new League({ seed: BASE });
    expect(JSON.stringify(l.toJSON())).not.toContain('opFrontChooser');
  });

  it('the match-flag key union grew by EXACTLY one, dormant', () => {
    const union = leagueSource.slice(
      leagueSource.indexOf('matchFlags: Partial<Pick<MatchConfig,'),
      leagueSource.indexOf('>> = {};'),
    );
    expect(count(union, /'opFrontChooser'/g)).toBe(1);
    expect(count(union, /'opFrontMan'/g)).toBe(1);
    expect(union).toContain("    | 'opFrontMan'\n    | 'opFrontChooser'\n");
  });
});

/* ------------------------------------------------------------------ */
/* F6 — THE MUTANT WALK                                                */
/* ------------------------------------------------------------------ */

/**
 * ⭐⭐⭐ THE MUTATION TEXTS OF RECORD. Each row is the WHOLE LINE REPLACED → THE REPLACEMENT in
 * the named file, exactly as applied in place before this whole file was re-run and the
 * original restored and sha256-verified (stage doc §PINS records the observed red counts).
 */
const MUTANTS: readonly { id: string; file: string; edits: readonly { from: string; to: string }[] }[] = [
  {
    id: 'M1 — the seat IGNORES the flag',
    file: 'ai/perceivedPassChoice.ts',
    edits: [{ from: '  const frontSeat = input.frontContact === true', to: '  const frontSeat = true' }],
  },
  {
    id: 'M2 — the 1.5 bound DROPPED',
    file: 'ai/frontContact.ts',
    edits: [{
      from: '    if (!(along > 0 && along < 1.5)) continue;',
      to: '    if (!(along > 0)) continue;',
    }],
  },
  {
    id: 'M3 — `<=` for `<` on CONTROL_RADIUS',
    file: 'ai/frontContact.ts',
    edits: [{
      from: '    if (dist(cp, entry.pos as V2) < CONTROL_RADIUS) return true;',
      to: '    if (dist(cp, entry.pos as V2) <= CONTROL_RADIUS) return true;',
    }],
  },
  {
    id: 'M4 — the seat applied to the corridor READ itself, not the price',
    file: 'ai/perceivedPassChoice.ts',
    edits: [{
      from: '  if (frontSeat) {',
      to: '  if (frontSeat && !((read as { interceptionThreatSeconds: number }).interceptionThreatSeconds = Number.POSITIVE_INFINITY)) {',
    }],
  },
];

describe('OP T0b — the mutant walk (FOUR mutants, each with the pins that kill it)', () => {
  it('⭐ the mutation table is REPRODUCIBLE: every `from` line occurs EXACTLY ONCE in its file, every `to` ZERO times', () => {
    for (const m of MUTANTS) {
      const lines = src(m.file).split('\n');
      for (const e of m.edits) {
        expect(lines.filter((l) => l === e.from).length, `${m.id} — replaced`).toBe(1);
        expect(lines.filter((l) => l === e.to).length, `${m.id} — replacement`).toBe(0);
        expect(e.to, m.id).not.toBe(e.from);
      }
    }
    expect(MUTANTS).toHaveLength(4);
  });

  it('M1 — the seat ignores the flag: killed by ABSENT ≡ shipped on a front-contact fixture, by G-OFF on world 18, and by the zero-call count', () => {
    const { snap, prof } = oneMan(1, 0);
    const absent = pricePassOption({ snapshot: snap, passerGid: 0, targetGid: 1, attackDir: 1, reachProfiles: prof });
    expect(absent.band).toBeLessThan(LAST);
    expect(chooserSource).toContain(SEAT_GUARD);
  });

  it('M2 — the 1.5 bound dropped: killed by the 1.5 m fixture and the agreement sweep', () => {
    expect(fc(1.5, 0)).toBe(false);
    expect(fc(2, 0.5)).toBe(false);
  });

  it('M3 — `<=` on CONTROL_RADIUS: killed by the CONTROL_RADIUS-aside fixture', () => {
    expect(fc(1, CONTROL_RADIUS)).toBe(false);
  });

  it('M4 — the read mutated instead of the price: killed by the not-mutated pin and at source', () => {
    probe.reads = [];
    try {
      const { snap, prof } = oneMan(1, 0);
      pricePassOption({
        snapshot: snap, passerGid: 0, targetGid: 1, attackDir: 1, reachProfiles: prof, frontContact: true,
      });
    } finally {
      const reads = probe.reads;
      probe.reads = null;
      expect(reads).toHaveLength(1);
      expect(reads[0].obj).toEqual(reads[0].copy);
    }
    expect(count(chooserSource, /interceptionThreatSeconds\s*=[^=]/g)).toBe(0);
  });
});

/* ------------------------------------------------------------------ */
/* F7 — THE BAND                                                       */
/* ------------------------------------------------------------------ */

describe('OP T0b — the scratch band', () => {
  it('EVERY seed this file walks is derived from the ONE declared base and inside 900,010,400–499', () => {
    expect(BASE).toBe(900_010_400);
    const all = [...G_SEEDS, ...DORMANT_SEEDS, ...ARMED_SEEDS, SWEEP_SEED, ...MOVE_SEEDS];
    for (const s of all) {
      expect(s).toBeGreaterThanOrEqual(900_010_400);
      expect(s).toBeLessThanOrEqual(900_010_499);
    }
    // ⛔ the verifier's band 900,010,500–599 is not touched
    expect(all.some((s) => s >= 900_010_500)).toBe(false);
  });
});
