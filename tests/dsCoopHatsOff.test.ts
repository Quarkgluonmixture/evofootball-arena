import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { Match } from '../src/sim/Match';
import { League } from '../src/sim/League';
import { runHeadless } from '../src/sim/simRunner';
import { DT } from '../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import type { Player } from '../src/sim/Player';
import type { Team } from '../src/sim/Team';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import {
  a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells, type A4ArmedVersion,
} from '../src/game/a4World';
import { Rng } from '../src/utils/rng';

/**
 * ⭐⭐⭐ DS T0d — 「配合帽子 · 开关」 THE COOPERATION HATS' SWITCH
 * (docs/world-model/DS-T0-OWN-RUN-SEAM.md §SWITCH-D / §PINS-D; contract
 * DS-DESIGNATION-CONTRACT.md §2 M-DS.8; COMMANDER RULING #412 item 5) — THE SWITCH'S
 * PERMANENT PIN SUITE, in the `tests/dsOwnRun.test.ts` form.
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * WHAT THIS IS: ONE dormant flag (`match.dsCoopHatsOff`) and TWO purely additive gates —
 * `TeamBrain.assignRunners`' 套边 block and `mechanics.performPass`' 2过1 trigger. NO law, NO
 * constant, NO gene, NO percept read. It is an INSTRUMENT for the measurement DS-T1d makes.
 *
 * The pins (§PINS-D of the stage doc is the inventory; this file IS the living copy):
 *   D1  G-OFF        the flag absent ⇒ whole-match signatures (rng state included) equal the
 *                    digests RECORDED AT THE DISPATCH HEAD f1a46b1 in a clean throwaway
 *                    worktree, in the bare world and worlds 13, 15 and 16, on 12 scratch
 *                    seeds; ABSENT ≡ EXPLICITLY FALSE; the production fingerprint unchanged.
 *   D2  ARMED        over WHOLE matches on worlds 13 and 16: `team.overlapper` null on every
 *                    stepped tick for both sides, `p.wallRun` null on every stepped tick for
 *                    every body, the two hat `why` literals never in the decision record, and
 *                    — through a NON-INVASIVE accessor spy — every read of both fields
 *                    returning null, so the passer's 套边-release and wall-return bonus
 *                    branches are never entered. NON-VACUITY: all four observed > 0 with the
 *                    flag ABSENT on the same seeds.
 *   D3  NOT THIS     with `dsCoopHatsOff` armed ALONE the runner/arriver board still fills,
 *       FLAG'S BOARD the corner crash and the live corner still license, and `dsHatsOff`'s two
 *                    gates are byte-unchanged.
 *   D4  THE SEAM MAP per-file executable-line occurrence counts of the flag; the two gate
 *                    lines as source literals; `keepOverlap` OUTSIDE gate 1 (by string index);
 *                    the shipped statements inside both gates byte-identical to the dispatch
 *                    head's after stripping leading whitespace.
 *   D5  THE MUTANT WALK — four mutants, each with the pin that kills it.
 *   D6  NARROWED PINS — the pins this switch touches, narrowed POSITIVELY.
 *
 * ⚠ Every walk in this file lives in the OUT-OF-BAND SCRATCH BAND 900,007,400–499 that ruling
 * #412 item 5(v) gives this stage, and EVERY base is derived from the ONE declared `BASE`
 * below (the #410 §CORR-C 3 form), with a pin of its own asserting the band. Canon, VERBATIM:
 * "verifier scratch walks use the stage's own consumed band or the out-of-band scratch range
 * (≥ 900,000,000) — never the next virgin block". ZERO frontier consumption.
 *
 * ⭐ Receipts are receipts (home: ruling #289 item 1): every count below is ARMING PLUMBING.
 * What the cooperation hats PRODUCE is DS-T1d's question, and this stage claims none of it.
 */

/** The production fingerprint of record (#305 item 1) — this switch may not move it. */
const FINGERPRINT_OF_RECORD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⚠ THE ONE DECLARED BASE. Every seed in this file is `BASE + k`, `0 ≤ k ≤ 99`. */
const BASE = 900_007_400;
const SEEDS: readonly number[] = Array.from({ length: 12 }, (_, i) => BASE + i);
/** the armed whole-match walks (D2) — four seeds per world */
const ARMED_SEEDS: readonly number[] = Array.from({ length: 4 }, (_, i) => BASE + 20 + i);
/** the board walk (D3) */
const BOARD_SEEDS: readonly number[] = Array.from({ length: 4 }, (_, i) => BASE + 30 + i);

/**
 * ⭐⭐ THE DIGESTS OF RECORD — RECORDED AT THE DISPATCH HEAD `f1a46b1` (ruling #412's own
 * wrap-up commit) in a clean throwaway worktree (`git worktree add /tmp/ds-t0d-base f1a46b1`)
 * BEFORE one byte of this switch existed, on the 12 seeds 900,007,400–411, and pasted here as
 * literals. They are what "byte-identical to the dispatch HEAD" MEANS.
 */
const HEAD_COMMIT = 'f1a46b1';
const HEAD_DIGESTS = {
  bare: 'a81e40542c6f2c1d2266514d93d24fa2ae989eea40d0e65054129ffa21a80245',
  w13: 'd7b9b9e6f96b0dd15d29e2293ed80b9e1f9aacbbabbcb6401fd92be9f2ec2f88',
  w15: '1c959b52dfb95d3283836456c63800a1b3993b720c8cb41cad4d05473422b9b5',
  w16: '2b78c8a9312610ac7d847f8ca8d8c40a632c7eab468ff59f614e1fc19f994b61',
} as const;

/** the two hat `why` literals whose pushes lose their input when the flag is armed */
const OVERLAP_WHY = 'overlapping outside the carrier';
const BURST_WHY = 'bursting for the one-two return';

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
  coop?: boolean;
  coopExplicitFalse?: boolean;
  hatsOff?: boolean;
  world?: 13 | 15 | 16;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const base = a.world === undefined ? {} : a4MatchFlags(a.world);
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    duration: 240,
    ...base,
    ...(a.coop === true ? { dsCoopHatsOff: true } : {}),
    ...(a.coopExplicitFalse === true ? { dsCoopHatsOff: false } : {}),
    ...(a.hatsOff === true ? { dsHatsOff: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (a.world !== undefined) armA4World(m, null, a.world, L3_DOSE, PC_DOSE);
  return m;
};

/**
 * ⭐⭐ THE WORLD-IDENTITY SIGNATURE (the house form, `tests/dsOwnRun.test.ts` verbatim): the
 * trace PLUS the ball's height channel, every body's velocity and stamina, the phase, and —
 * the last thing the digest eats — ONE DRAW off the finished match's own rng.
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
const teamSource = src('ai/TeamBrain.ts');
const mechSource = src('sim/mechanics.ts');
const matchSource = src('sim/Match.ts');
const leagueSource = src('sim/League.ts');
const playerSource = src('ai/PlayerBrain.ts');
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
/** the re-indent transformation, applied to BOTH sides of every block-identity pin */
const stripIndent = (text: string): string => text.split('\n').map((l) => l.trim()).join('\n');

/* ================================================================== */
/*  THE DISPATCH HEAD'S OWN BYTES — recordings, in the sense the        */
/*  digests above are (read out of the clean worktree at f1a46b1).      */
/* ================================================================== */

/** `src/ai/TeamBrain.ts:385–422` at `f1a46b1` — the WHOLE 套边 block, gate 1's interior. */
const OVERLAP_BLOCK_AT_HEAD = `  // 套边 (Phase 34): a WIDE carrier confronted in the attacking half pulls
  // one trailing teammate around the OUTSIDE. Wide-play genes look for it;
  // narrow sides leave the lane to the carrier's own drive.
  if (
    team.overlapper === null && // a flight-preserved license stands
    carrier &&
    carrier.role !== 'GK' &&
    Math.abs(carrier.pos.y) > 10 &&
    team.localX(carrier.pos.x) > 0 &&
    // Width gene × the evolved overlap appetite (Phase 45) crosses the gate.
    team.genome.attackingWidth * team.policy.overlapW > 0.3
  ) {
    const cLocal = team.localX(carrier.pos.x);
    const confronted = match.teams[1 - team.side].players.some(
      (o) =>
        !o.sentOff &&
        dist(o.pos, carrier.pos) < 5.5 &&
        match.teams[1 - team.side].localX(o.pos.x) < match.teams[1 - team.side].localX(carrier.pos.x) + 0.5,
    );
    if (confronted) {
      let pick: Player | null = null;
      let bd = Infinity;
      for (const p of team.players) {
        if (p.role === 'GK' || p === carrier || p.sentOff) continue;
        if (team.runners.has(p.index) || team.arriver === p.index || p.stamina < 0.3) continue;
        // Same wing (or central enough to swing out); trailing but reachable.
        if (Math.sign(p.pos.y) !== Math.sign(carrier.pos.y) && Math.abs(p.pos.y) > 8) continue;
        const behind = cLocal - team.localX(p.pos.x);
        if (behind < 1 || behind > 24) continue;
        const d = dist(p.pos, carrier.pos);
        if (d < bd) {
          bd = d;
          pick = p;
        }
      }
      if (pick) team.overlapper = pick.index;
    }
  }`;

/** `src/sim/mechanics.ts:422–443` at `f1a46b1` — the 2过1 trigger, gate 2's interior. */
const WALL_BLOCK_AT_HEAD = `  // 2过1 (Phase 34): a short pass played UNDER PRESSURE licenses the passer
  // to burst past his marker for the return — the "go" half of the
  // give-and-go. Sides that play at speed (tempo + passBias) look for it;
  // slow ones take the touch and keep shape. Not from the defensive third
  // (a wall pass at your own box is how counters are born).
  // Window 2.3s: the round trip is ~0.7s out + the wall's touch + ~0.7s
  // back — a 1.15s license expired before any return could arrive (probed).
  // Attacking half only: granted from build-up, the flip bonus turned the
  // midfield into a wall-pass ping-pong that ate 0.3 goals/match (probed
  // against the same calibrate seeds) — the one-two is a PENETRATION device.
  // The gene score is scaled by the franchise's evolved wallPassW (Phase 45)
  // before the gate — appetite for the one-two is style, not a constant.
  if (
    passer.role !== 'GK' &&
    d < 15 &&
    pressure > 0.2 &&
    passer.stamina > 0.3 &&
    team.localX(passer.pos.x) > 0 &&
    ((team.genome.tempo + team.genome.passBias) / 2) * team.policies[passer.index].wallPassW > 0.35
  ) {
    passer.wallRun = { until: match.simTime + 2.3, partnerGid: mate.gid };
  }`;

/**
 * sha256 of `src/ai/TeamBrain.ts:344–383` at `f1a46b1` — `dsHatsOff`'s TWO gates and
 * everything between them, whole. (A digest rather than a verbatim literal because that
 * region's comments contain backticks; the property pinned is the same one.)
 */
const HATS_GATES_SHA_AT_HEAD =
  '7d0ae97412da5692d52366be48b2a172134856a9866566678bec6b8a8a6bbd04';

/* ------------------------------------------------------------------ */
/* D1 — G-OFF: the OFF world is the DISPATCH HEAD's, byte for byte      */
/* ------------------------------------------------------------------ */

describe('DS T0d — G-OFF: the flag absent ⇒ the world is the dispatch HEAD\'s', () => {
  it('the BARE world reproduces the digest recorded at HEAD', () => {
    const sigs = SEEDS.map((s) => signatureOf(matchOf(s)));
    expect(sigs).toHaveLength(12);
    expect(digest(sigs)).toBe(HEAD_DIGESTS.bare);
    expect(HEAD_COMMIT).toBe('f1a46b1');
  }, 120_000);

  it('world 13 reproduces the digest recorded at HEAD', () => {
    expect(digest(SEEDS.map((s) => signatureOf(matchOf(s, { world: 13 }))))).toBe(HEAD_DIGESTS.w13);
  }, 120_000);

  it('world 15 reproduces the digest recorded at HEAD', () => {
    expect(digest(SEEDS.map((s) => signatureOf(matchOf(s, { world: 15 }))))).toBe(HEAD_DIGESTS.w15);
  }, 120_000);

  it('world 16 — the LIVE own-run world — reproduces the digest recorded at HEAD', () => {
    expect(digest(SEEDS.map((s) => signatureOf(matchOf(s, { world: 16 }))))).toBe(HEAD_DIGESTS.w16);
  }, 120_000);

  it('ABSENT ≡ EXPLICITLY FALSE (the other half of dormancy)', () => {
    for (const seed of SEEDS.slice(0, 4)) {
      expect(signatureOf(matchOf(seed, { coopExplicitFalse: true })))
        .toBe(signatureOf(matchOf(seed)));
      expect(signatureOf(matchOf(seed, { world: 16, coopExplicitFalse: true })))
        .toBe(signatureOf(matchOf(seed, { world: 16 })));
    }
  }, 120_000);

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
/* D2 — ARMED BEHAVIOUR, over WHOLE matches                             */
/* ------------------------------------------------------------------ */

/**
 * ⭐⭐ THE SPY (a throwaway match's own objects, never a src edit). Each `Team.overlapper` and
 * each `Player.wallRun` is replaced by an ACCESSOR over a private backing field that returns
 * exactly what the field held and counts (a) every read and (b) every read that returned
 * non-null. It is measurement, not intervention — `identical` below proves the spied match
 * digests EXACTLY as the unspied one.
 *
 * ⚠ HONEST SCOPE (declared, §DEVIATIONS-D 3): the spy cannot separate the passer's bonus-branch
 * read from any other read of the same field. It measures the SUPERSET — every read anywhere in
 * the engine — which is strictly stronger: if no read whatsoever returned non-null, then in
 * particular the read inside `mate.wallRun !== null` and inside `team.overlapper === mate.index`
 * did not, and those branches were not entered. The read COUNTS being > 0 is what makes the
 * measurement non-vacuous.
 */
interface Obs {
  ticks: number;
  overlapperNonNullTicks: number;
  wallRunNonNullTicks: number;
  overlapWhy: number;
  burstWhy: number;
  overlapReads: number;
  overlapNonNullReads: number;
  wallReads: number;
  wallNonNullReads: number;
  minIndex: number;
}

const installSpy = (m: Match, o: Obs): void => {
  for (const t of m.teams as Team[]) {
    let backing = t.overlapper;
    Object.defineProperty(t, 'overlapper', {
      configurable: true,
      get(): number | null {
        o.overlapReads++;
        if (backing !== null) o.overlapNonNullReads++;
        return backing;
      },
      set(v: number | null): void { backing = v; },
    });
    for (const p of t.players as Player[]) {
      let wb = p.wallRun;
      Object.defineProperty(p, 'wallRun', {
        configurable: true,
        get(): { until: number; partnerGid: number } | null {
          o.wallReads++;
          if (wb !== null) o.wallNonNullReads++;
          return wb;
        },
        set(v: { until: number; partnerGid: number } | null): void { wb = v; },
      });
    }
  }
};

const walk = (seed: number, a: Arm): Obs => {
  const o: Obs = {
    ticks: 0, overlapperNonNullTicks: 0, wallRunNonNullTicks: 0, overlapWhy: 0, burstWhy: 0,
    overlapReads: 0, overlapNonNullReads: 0, wallReads: 0, wallNonNullReads: 0,
    minIndex: Number.POSITIVE_INFINITY,
  };
  const m = matchOf(seed, a);
  installSpy(m, o);
  let ticks = 0;
  while (!m.finished && ticks < 60_000) {
    m.step(DT);
    ticks++;
    for (const t of m.teams) {
      if (t.overlapper !== null) o.overlapperNonNullTicks++;
      for (const p of t.players) {
        if (p.wallRun !== null) o.wallRunNonNullTicks++;
        if (p.index < o.minIndex) o.minIndex = p.index;
        for (const s of p.action.scores) {
          if (s.why === OVERLAP_WHY) o.overlapWhy++;
          if (s.why === BURST_WHY) o.burstWhy++;
        }
      }
    }
  }
  o.ticks = ticks;
  return o;
};

describe('DS T0d — ARMED: the two cooperation hats are never issued', () => {
  for (const world of [13, 16] as const) {
    it(`world ${world}: overlapper and wallRun are null on EVERY stepped tick, and the two hat pushes are never recorded`, () => {
      let ticks = 0;
      let reads = 0;
      let wreads = 0;
      for (const seed of ARMED_SEEDS) {
        const o = walk(seed, { world, coop: true });
        expect(o.overlapperNonNullTicks).toBe(0);
        expect(o.wallRunNonNullTicks).toBe(0);
        expect(o.overlapWhy).toBe(0);
        expect(o.burstWhy).toBe(0);
        // the two bonus branches: every read of their input returned null, and the other
        // side of the 套边 comparator (`mate.index`) is never negative — so
        // `team.overlapper === mate.index` and `mate.wallRun !== null` were false at EVERY
        // evaluation. Branch entry is a MEASUREMENT (#401), and this is the measurement.
        expect(o.overlapNonNullReads).toBe(0);
        expect(o.wallNonNullReads).toBe(0);
        expect(o.minIndex).toBeGreaterThanOrEqual(0);
        ticks += o.ticks;
        reads += o.overlapReads;
        wreads += o.wallReads;
      }
      // NON-VACUITY of the instrument itself: the fields WERE read, many times.
      expect(ticks).toBeGreaterThan(20_000);
      expect(reads).toBeGreaterThan(1_000);
      expect(wreads).toBeGreaterThan(1_000);
    }, 240_000);

    it(`world ${world}: NON-VACUITY — with the flag ABSENT all four are observed > 0 on the same seeds`, () => {
      let overlapperTicks = 0;
      let wallTicks = 0;
      let overlapWhy = 0;
      let burstWhy = 0;
      let nonNullOverlapReads = 0;
      let nonNullWallReads = 0;
      for (const seed of ARMED_SEEDS) {
        const o = walk(seed, { world });
        overlapperTicks += o.overlapperNonNullTicks;
        wallTicks += o.wallRunNonNullTicks;
        overlapWhy += o.overlapWhy;
        burstWhy += o.burstWhy;
        nonNullOverlapReads += o.overlapNonNullReads;
        nonNullWallReads += o.wallNonNullReads;
      }
      expect(overlapperTicks).toBeGreaterThan(0);
      expect(wallTicks).toBeGreaterThan(0);
      expect(overlapWhy).toBeGreaterThan(0);
      expect(burstWhy).toBeGreaterThan(0);
      expect(nonNullOverlapReads).toBeGreaterThan(0);
      expect(nonNullWallReads).toBeGreaterThan(0);
    }, 240_000);
  }

  it('the spy is NON-INVASIVE: a spied match digests exactly as the unspied one', () => {
    for (const seed of ARMED_SEEDS.slice(0, 2)) {
      for (const a of [{ world: 13 } as Arm, { world: 13, coop: true } as Arm]) {
        const plain = matchOf(seed, a);
        const spied = matchOf(seed, a);
        const o: Obs = {
          ticks: 0, overlapperNonNullTicks: 0, wallRunNonNullTicks: 0, overlapWhy: 0,
          burstWhy: 0, overlapReads: 0, overlapNonNullReads: 0, wallReads: 0,
          wallNonNullReads: 0, minIndex: Number.POSITIVE_INFINITY,
        };
        installSpy(spied, o);
        expect(signatureOf(spied)).toBe(signatureOf(plain));
        expect(o.overlapReads).toBeGreaterThan(0);
      }
    }
  }, 180_000);

  it('the two hat `why` literals are the ones the read sites belong to (anchored, exactly once each)', () => {
    expect(count(playerSource, new RegExp(`why: '${OVERLAP_WHY}'`, 'g'))).toBe(1);
    expect(count(playerSource, new RegExp(`why: '${BURST_WHY}'`, 'g'))).toBe(1);
    // the two bonus branches, at source, with the conjunct the measurement reads
    expect(playerSource).toContain('        team.overlapper === mate.index &&');
    expect(playerSource).toContain('        mate.wallRun !== null &&');
    // and the pushes' own guards
    expect(playerSource).toContain('if (team.overlapper === p.index && carrier && carrier !== p) {');
    expect(playerSource).toContain('if (p.wallRun && match.simTime < p.wallRun.until - 1.1 && carrier && carrier !== p) {');
  });
});

/* ------------------------------------------------------------------ */
/* D3 — THE RUNNER/ARRIVER BOARD IS NOT THIS FLAG'S                     */
/* ------------------------------------------------------------------ */

describe('DS T0d — armed ALONE, the runner/arriver board is untouched', () => {
  it('world 13: runners fill and the arriver is picked on > 100 coach ticks each; the corner crash and the live corner still license', () => {
    let runnersTicks = 0;
    let arriverTicks = 0;
    let liveCornerWithCrashers = 0;
    let heldCrashKept = 0;
    let overlapSet = 0;
    let wallFired = 0;
    for (const seed of BOARD_SEEDS) {
      const m = matchOf(seed, { world: 13, coop: true });
      expect(m.dsCoopHatsOff).toBe(true);
      expect(m.dsHatsOff).toBe(false);
      let ticks = 0;
      while (!m.finished && ticks < 60_000) {
        const clock = m.simTime + DT;
        const pre = m.teams.map((t) => {
          const liveCorner = m.phase === 'restart' && m.restart?.kind === 'corner'
            && m.restart.side === t.side;
          const heldCrash = !liveCorner && t.cornerCrash !== null && clock < t.cornerCrash.until;
          return { coachRan: t.brainTimer - DT <= 0, poss: m.possessionSide === t.side, liveCorner, heldCrash };
        });
        m.step(DT);
        ticks++;
        for (const t of m.teams) {
          const a = pre[t.side];
          if (a.coachRan && a.poss) {
            if (t.runners.size > 0) runnersTicks++;
            if (t.arriver !== null) arriverTicks++;
            if (a.liveCorner && t.runners.size > 0) liveCornerWithCrashers++;
            if (a.heldCrash && t.runners.size > 0) heldCrashKept++;
          }
          if (t.overlapper !== null) overlapSet++;
          for (const p of t.players) {
            if (p.wallRun !== null) wallFired++;
          }
        }
      }
    }
    expect(runnersTicks).toBeGreaterThan(100);
    expect(arriverTicks).toBeGreaterThan(100);
    expect(liveCornerWithCrashers).toBeGreaterThan(0);
    expect(heldCrashKept).toBeGreaterThan(0);
    // and this flag's own two hats stayed off the whole time
    expect(overlapSet).toBe(0);
    expect(wallFired).toBe(0);
  }, 240_000);

  it('`dsHatsOff`\'s TWO gates and everything between them are BYTE-UNCHANGED from the dispatch head', () => {
    const lines = teamSource.split('\n');
    const open = lines.findIndex((l) => l === '  if (!match.dsHatsOff) {');
    expect(open).toBeGreaterThan(0);
    const region = lines.slice(open, open + 40).join('\n');
    expect(createHash('sha256').update(region).digest('hex')).toBe(HATS_GATES_SHA_AT_HEAD);
    expect(count(codeLines(teamSource).join('\n'), /if \(!match\.dsHatsOff\) \{/g)).toBe(2);
  });
});

/* ------------------------------------------------------------------ */
/* D4 — THE SEAM MAP                                                    */
/* ------------------------------------------------------------------ */

describe('DS T0d — the seam map', () => {
  it('the flag is read at exactly the sites the doc names, and nowhere else', () => {
    const perFile = new Map<string, number>();
    for (const f of srcFiles('src')) {
      const n = count(codeLines(readFileSync(f, 'utf8')).join('\n'), /dsCoopHatsOff/g);
      if (n > 0) perFile.set(f, n);
    }
    expect([...perFile.keys()].sort()).toEqual([
      'src/ai/TeamBrain.ts', 'src/sim/League.ts', 'src/sim/Match.ts', 'src/sim/mechanics.ts',
    ]);
    // Match.ts: FOUR — the optional config key, the readonly field, and the init line
    // `this.dsCoopHatsOff = cfg.dsCoopHatsOff ?? false;`, which names it TWICE (the
    // `dsOwnRun` / `dsHatsOff` count of 4 each has the same shape).
    expect(perFile.get('src/sim/Match.ts')).toBe(4);
    expect(perFile.get('src/sim/League.ts')).toBe(1);
    expect(perFile.get('src/ai/TeamBrain.ts')).toBe(1);
    expect(perFile.get('src/sim/mechanics.ts')).toBe(1);
    // the ENTRY LAYER names it ZERO times — no world, no preset, no URL.
    expect(count(a4Source, /dsCoopHatsOff/g)).toBe(0);
    expect(count(playerSource, /dsCoopHatsOff/g)).toBe(0);
    expect(count(execSource, /dsCoopHatsOff/g)).toBe(0);
  });

  it('the two gate lines are the source literals the doc quotes', () => {
    expect(count(teamSource, /^ {2}if \(!match\.dsCoopHatsOff\) \{$/gm)).toBe(1);
    expect(count(mechSource, /^ {2}if \(!match\.dsCoopHatsOff\) \{$/gm)).toBe(1);
    expect(matchSource).toContain('  dsCoopHatsOff?: boolean;');
    expect(matchSource).toContain('  readonly dsCoopHatsOff: boolean;');
    expect(matchSource).toContain('this.dsCoopHatsOff = cfg.dsCoopHatsOff ?? false;');
    expect(leagueSource).toContain("| 'dsOwnRun' | 'dsHatsOff' | 'dsCoopHatsOff'");
    // ⛔ no env door, no bundle default, no world armer anywhere in src/
    expect(count(matchSource, /dsCoopHatsOff\s*\?\?\s*EDS_BUNDLE_ARMED|process\.env[^\n]*dsCoop/g)).toBe(0);
    // the ONLY assignment in all of `src/**` is the constructor's own init: no armer
    // anywhere writes the flag onto a match, and nothing sets it true.
    for (const f of srcFiles('src')) {
      const text = readFileSync(f, 'utf8');
      expect(count(text, /\.dsCoopHatsOff\s*=[^=]/g)).toBe(f === 'src/sim/Match.ts' ? 1 : 0);
      expect(count(text, /dsCoopHatsOff: true/g)).toBe(0);
    }
  });

  it('the flight-preserving `keepOverlap` statement is OUTSIDE gate 1, and above it', () => {
    const keep = teamSource.indexOf('  if (!keepOverlap) team.overlapper = null;');
    const gate = teamSource.indexOf('  if (!match.dsCoopHatsOff) {');
    expect(keep).toBeGreaterThan(0);
    expect(gate).toBeGreaterThan(keep);
    // and it is byte-identical to the head's, at the same nesting (two spaces).
    expect(teamSource).toContain('\n  if (!keepOverlap) team.overlapper = null;\n');
  });

  it('the shipped statements inside BOTH gates are byte-identical to the dispatch head\'s (re-indent excepted)', () => {
    const tbLines = teamSource.split('\n');
    const g1 = tbLines.findIndex((l) => l === '  if (!match.dsCoopHatsOff) {');
    const inner1 = tbLines.slice(g1 + 1, g1 + 1 + OVERLAP_BLOCK_AT_HEAD.split('\n').length).join('\n');
    expect(stripIndent(inner1)).toBe(stripIndent(OVERLAP_BLOCK_AT_HEAD));
    // and the re-indent is EXACTLY two spaces on every non-blank line — nothing else moved.
    expect(inner1).toBe(OVERLAP_BLOCK_AT_HEAD.split('\n')
      .map((l) => (l.trim() === '' ? l : `  ${l}`)).join('\n'));
    expect(tbLines[g1 + 1 + OVERLAP_BLOCK_AT_HEAD.split('\n').length]).toBe('  }');

    const mcLines = mechSource.split('\n');
    const g2 = mcLines.findIndex((l) => l === '  if (!match.dsCoopHatsOff) {');
    const inner2 = mcLines.slice(g2 + 1, g2 + 1 + WALL_BLOCK_AT_HEAD.split('\n').length).join('\n');
    expect(stripIndent(inner2)).toBe(stripIndent(WALL_BLOCK_AT_HEAD));
    expect(inner2).toBe(WALL_BLOCK_AT_HEAD.split('\n')
      .map((l) => (l.trim() === '' ? l : `  ${l}`)).join('\n'));
    expect(mcLines[g2 + 1 + WALL_BLOCK_AT_HEAD.split('\n').length]).toBe('  }');
    // `registerPass` still sits ABOVE gate 2, outside it (string index, the keepOverlap form)
    expect(mechSource.indexOf('  registerPass(match, passer, mate, offsideExempt);'))
      .toBeLessThan(mechSource.indexOf('  if (!match.dsCoopHatsOff) {'));
  });

  it('Road B: no world and no preset carries the flag; League.toJSON omits matchFlags', () => {
    const worlds: A4ArmedVersion[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    expect(worlds).toHaveLength(16);
    for (const w of worlds) {
      const flags = a4MatchFlags(w) as Record<string, unknown>;
      expect(flags.dsCoopHatsOff).toBeUndefined();
    }
    expect(matchOf(BASE).dsCoopHatsOff).toBe(false);
    expect(matchOf(BASE, { world: 16 }).dsCoopHatsOff).toBe(false);
    const l = new League({ seed: BASE });
    expect(JSON.stringify(l.toJSON())).not.toContain('matchFlags');
    expect(JSON.stringify(l.toJSON())).not.toContain('dsCoopHatsOff');
  });
});

/* ------------------------------------------------------------------ */
/* D5 — THE MUTANT WALK                                                 */
/* ------------------------------------------------------------------ */

describe('DS T0d — the mutant walk', () => {
  it('N1 — gate 1 dropped (the overlap set again with the flag armed): killed by D2', () => {
    // the killing property, stated as the pin that owns it: armed, `team.overlapper` is null
    // on EVERY stepped tick — a mutant that dropped gate 1 would set it (the flag-absent arm
    // of D2 observes it non-null on the same seeds).
    const armed = walk(ARMED_SEEDS[0], { world: 13, coop: true });
    const off = walk(ARMED_SEEDS[0], { world: 13 });
    expect(armed.overlapperNonNullTicks).toBe(0);
    expect(off.overlapperNonNullTicks).toBeGreaterThan(0);
  }, 180_000);

  it('N2 — gate 2 dropped (`wallRun` set with the flag armed): killed by D2', () => {
    const armed = walk(ARMED_SEEDS[1], { world: 13, coop: true });
    const off = walk(ARMED_SEEDS[1], { world: 13 });
    expect(armed.wallRunNonNullTicks).toBe(0);
    expect(off.wallRunNonNullTicks).toBeGreaterThan(0);
  }, 180_000);

  it('N3 — a gate wrapped around the corner-crash `heldCrash` branch: killed by D3', () => {
    // the corner branches sit ABOVE gate 1 and return; the flag may not reach them. The
    // source pin: the `heldCrash` branch is not inside any `dsCoopHatsOff` gate.
    const gate = teamSource.indexOf('  if (!match.dsCoopHatsOff) {');
    expect(teamSource.indexOf('  if (heldCrash) {')).toBeLessThan(gate);
    expect(teamSource.indexOf('  if (liveCorner) {')).toBeLessThan(gate);
    expect(teamSource.indexOf('  const cf = team.crossFlight;')).toBeLessThan(gate);
    expect(count(codeLines(teamSource).join('\n'), /dsCoopHatsOff/g)).toBe(1);
  });

  it('N4 — the flag read INVERTED (`if (match.dsCoopHatsOff)`): killed by G-OFF and by D2', () => {
    expect(count(teamSource, /if \(match\.dsCoopHatsOff\)/g)).toBe(0);
    expect(count(mechSource, /if \(match\.dsCoopHatsOff\)/g)).toBe(0);
    // behaviourally: inverted, the FLAG-ABSENT world would lose both hats — which is exactly
    // what the flag-absent arm of D2 observes NOT to happen, and what G-OFF's four digests
    // would redden on.
    const off = walk(ARMED_SEEDS[2], { world: 13 });
    expect(off.overlapperNonNullTicks).toBeGreaterThan(0);
    expect(off.wallRunNonNullTicks).toBeGreaterThan(0);
  }, 180_000);
});

/* ------------------------------------------------------------------ */
/* D6 — the pins this switch touches, narrowed POSITIVELY               */
/* ------------------------------------------------------------------ */

describe('DS T0d — narrowed pins, and the scratch band', () => {
  it('the match-flag key union grew by EXACTLY one, dormant', () => {
    const union = leagueSource.slice(
      leagueSource.indexOf('matchFlags: Partial<Pick<MatchConfig,'),
      leagueSource.indexOf('>> = {};'),
    );
    expect(count(union, /'dsOwnRun'/g)).toBe(1);
    expect(count(union, /'dsHatsOff'/g)).toBe(1);
    expect(count(union, /'dsCoopHatsOff'/g)).toBe(1);
  });

  it('the DS-T0/T0b/T0c seam map is UNCHANGED: this switch adds no `dsOwnRun` / `dsHatsOff` read', () => {
    expect(count(codeLines(teamSource).join('\n'), /match\.dsHatsOff/g)).toBe(2);
    expect(count(codeLines(playerSource).join('\n'), /match\.dsOwnRun/g)).toBe(1);
    expect(count(codeLines(teamSource).join('\n'), /dsOwnRun/g)).toBe(0);
  });

  it('the READ SITES are byte-untouched: PlayerBrain, the executor and `registerPass`', () => {
    expect(count(playerSource, /action: 'MakeRun'/g) + count(playerSource, /type: 'MakeRun'/g))
      .toBe(6);
    expect(execSource).toContain("} else if (team.overlapper === p.index && ball.owner && ball.owner.side === p.side) {");
    expect(mechSource).toContain('function registerPass(match: Match, passer: Player, target: Player, exempt: boolean): void {');
  });

  it('EVERY seed this file walks is derived from the ONE declared base and inside the band', () => {
    expect(BASE).toBe(900_007_400);
    for (const s of [...SEEDS, ...ARMED_SEEDS, ...BOARD_SEEDS]) {
      expect(s).toBeGreaterThanOrEqual(BASE);
      expect(s).toBeLessThanOrEqual(BASE + 99);
    }
  });
});
