import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import type { Player } from '../src/sim/Player';
import { runHeadless } from '../src/sim/simRunner';
import { DT } from '../src/sim/constants';
import { decidePlayer } from '../src/ai/PlayerBrain';
import { laneOpenness } from '../src/ai/perception';
import { ownLaneOpenness, ownLanePrice, ownLaneScopeGids } from '../src/ai/ownLaneSeat';
import {
  GENE_KEYS, crossoverGenomes, lnOwnLaneWeightOf, mutateGenome, randomGenome,
  type TacticalGenome,
} from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells } from '../src/game/a4World';
import { Rng } from '../src/utils/rng';
import { choosePerceivedPassTarget, type PerceivedPassChoiceInput } from '../src/ai/perceivedPassChoice';
import type { PerceptionSnapshot } from '../src/ai/perceptionSnapshot';
import type { KnownReachProfile } from '../src/ai/reachability';

/**
 * ⭐⭐ LN T0 — THE OWN-LANE PRICE (docs/world-model/LN-T0-OWN-LANE-PRICE.md; contract
 * LN-OWN-LANE-CONTRACT.md; COMMANDER RULING #393 item 5) — THE SEAM'S PERMANENT PIN SUITE,
 * in the house form (`bqCushion.test.ts` / `gcGroundCorridor.test.ts` / `raAccessPrice.test.ts`).
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * 「让传球者看见自己人」 — armed, the passer's three pricers stop being blind to his own men.
 * Each pays `w · (1 − ownLaneOpenness)` — the SHIPPED `laneOpenness` geometry over his own
 * outfield bodies minus himself minus the intended target — for a line one of ours is
 * standing in. The shell stays, the argmax still decides, no line is banned.
 *
 * The pins:
 *   • ⭐⭐ G-OFF — flag ABSENT ≡ flag EXPLICITLY FALSE, byte for byte (score, phase, ball
 *     pos/vel/z/vz, every body's pos/vel/heading/stamina, AND the rng stream state), on
 *     twelve scratch seeds, in the BARE world AND in world 13's composition.
 *   • ⭐⭐ G-IDENT — flag ON with the gene ABSENT ≡ flag OFF, byte for byte, on the same
 *     seeds and both worlds: the born-absent zero is an IEEE-exact identity even though the
 *     scope statement, the two subtractions and the perceived factor all RUN.
 *   • ⭐⭐ G-BITE — flag ON at `w = 1` ⇒ the signature DIFFERS on at least one of those seeds
 *     in each world shape. The seam is alive.
 *   • ⭐⭐ THE PER-SITE EXACTNESS FIXTURES — (a) the lane argmax's winning candidate score
 *     falls by EXACTLY `ownLanePrice(w, ownLaneOpenness(...))`; (b) the kick-off play-back
 *     scorer prefers the own-CLEAR mate 14 m back over the blocked 12 m mate at `w = 1`;
 *     (c) the perceived chooser's executable option price is multiplied by exactly
 *     `1 − w · (1 − ownLane)` and the winner flips, while an unexecutable option is left
 *     alone; and the SCOPE carries the own gids only when the flag is on.
 *   • ⭐⭐ THE GEOMETRY — a body on the segment ⇒ 0 (price `w`); 4 m off ⇒ 1 (price 0); a
 *     body inside `laneOpenness`'s own 1.5 m clear-the-kicker guard ⇒ ignored; the passer,
 *     the target, the keeper and a sent-off body excluded; and `ownLaneOpenness` EQUALS
 *     `laneOpenness` on the filtered `Player[]` — the two populations, one law.
 *   • ⭐⭐ THE ANCHORS — the flag's occurrence counts per file with every site enumerated,
 *     ONE `ownLaneOpenness` call at each of the three read sites, the scope statement
 *     guarded, `a4World.ts` and every preset free of the flag, the gene outside GENE_KEYS.
 *   • ⭐⭐ THE MUTANTS — every exactness pin recomputed with a deliberately wrong law (the
 *     price with the wrong sign, the guard radius moved, the target not excluded, the
 *     keeper not excluded) and asserted UNEQUAL, so no pin can be vacuous.
 *   • ⭐ NO SERIALIZATION — `League.toJSON` omits the flag; the gene is born absent and the
 *     mutate / crossover rng streams are UNMOVED.
 *   • ⭐ THE FINGERPRINT OF RECORD — a literal in this suite, and the suite RUNS it.
 *
 * ⚠ Every walk in this file lives in the OUT-OF-BAND SCRATCH CLASS 900,004,000–099 (canon,
 * VERBATIM: "verifier scratch walks use the stage's own consumed band or the out-of-band
 * scratch range (≥ 900,000,000) — never the next virgin block"; home:
 * PW-T0C-OBJECTIVE-FIDELITY.md §COMMANDER CORRECTIONS item 6). ZERO frontier consumption.
 *
 * ⭐ Receipts are receipts (home: ruling #289 item 1): the fixture metres and the flip
 * counts below are ARMING PLUMBING — the law's arithmetic proved on a handful of bodies —
 * and are never quoted as football effect sizes. What the price BUYS is LN-T1′'s question.
 */

/** The production fingerprint of record (#305 item 1) — this seam may not move it. */
const FINGERPRINT_OF_RECORD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⚠ OUT-OF-BAND SCRATCH SEEDS — LN-T0's own band, 900,004,000–099. */
const SEEDS: readonly number[] = Array.from({ length: 12 }, (_, i) => 900_004_000 + i);
const SEED_FIXTURE = 900_004_050;

/** World 13 — the composition the user plays, and the one LN-T1′ will exam on. */
const W13 = 13 as const;

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
  ln?: boolean;
  /** pass the door EXPLICITLY as false rather than omitting it (dormancy's other half) */
  lnExplicitFalse?: boolean;
  /** the own-lane weight, written on all three genome views of BOTH teams (#196.3-D6) */
  weight?: number;
  /** world 13's composition — the form the user plays */
  world?: 13;
  duration?: number;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const base = a.world === undefined ? {} : a4MatchFlags(a.world);
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    duration: a.duration ?? 240,
    ...base,
    ...(a.ln === true ? { lnOwnLanePrice: true } : {}),
    ...(a.lnExplicitFalse === true ? { lnOwnLanePrice: false } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (a.world !== undefined) armA4World(m, null, a.world, L3_DOSE, PC_DOSE);
  if (a.weight !== undefined) {
    for (const t of m.teams) {
      for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
        g.lnOwnLaneWeight = a.weight;
      }
    }
  }
  return m;
};

/**
 * ⭐⭐ THE WORLD-IDENTITY SIGNATURE, widened for this seam (#393 item 5(iv)): the house
 * signature's trace PLUS the ball's height channel, every body's velocity and stamina, the
 * phase, and — the last thing the digest eats — ONE DRAW off the finished match's own rng.
 * A draw is a pure function of the stream state, so an equal digest means the two arms
 * consumed the same number of draws in the same order as well as reaching the same world.
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
          trace.push(
            p.pos.x, p.pos.y, p.vel.x, p.vel.y, p.heading.x, p.heading.y, p.stamina,
          );
        }
      }
    }
  }
  const r = m.getResult();
  // The rng stream state, read the only way a caller can: one draw off the finished match.
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
const brainSource = src('ai/PlayerBrain.ts');
const matchSource = src('sim/Match.ts');
const leagueSource = src('sim/League.ts');
const seatSource = src('ai/ownLaneSeat.ts');
const chooserSource = src('ai/perceivedPassChoice.ts');
const genomeSource = src('evolution/genome.ts');
const a4Source = src('game/a4World.ts');
const count = (hay: string, needle: RegExp): number => (hay.match(needle) ?? []).length;
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = join(dir, e);
  return statSync(full).isDirectory() ? srcFiles(full) : full.endsWith('.ts') ? [full] : [];
});

/** ⭐ MEMOISED so the identity and bite arms are compared against ONE computed control. */
const offCache = new Map<string, string>();
const offSignature = (seed: number, world: 13 | undefined): string => {
  const key = `${seed}:${world ?? 0}`;
  const hit = offCache.get(key);
  if (hit !== undefined) return hit;
  const sig = signatureOf(matchOf(seed, world === undefined ? {} : { world }));
  offCache.set(key, sig);
  return sig;
};

/* ------------------------------------------------------------------ */
/* THE FIXTURES                                                        */
/* ------------------------------------------------------------------ */

interface GroundScene {
  m: Match; p: Player; target: Player; blocker: Player;
}
/**
 * SITE (a)'s fixture — the lane argmax. One carrier, one clear target 14 m ahead, one of
 * OUR OWN bodies standing exactly on the line to him at 7 m, the rest of both teams parked
 * out of the picture. Only the bodies are placed; every score is the ENGINE's own.
 */
const groundScene = (arm: Arm): GroundScene => {
  const m = matchOf(SEED_FIXTURE, { ...arm, duration: 600 });
  while (m.phase !== 'playing') m.step(DT);
  const t = m.teams[0];
  const o = m.teams[1];
  const dir = t.attackDir;
  const p = t.players[2];
  const target = t.players[5];
  const blocker = t.players[1];
  p.pos = { x: 0, y: 0 };
  target.pos = { x: 14 * dir, y: 0 };
  blocker.pos = { x: 7 * dir, y: 0 };
  t.players[0].pos = { x: -45 * dir, y: 0 };
  t.players[3].pos = { x: -30 * dir, y: 26 };
  t.players[4].pos = { x: -30 * dir, y: -26 };
  o.players.forEach((q, i) => { q.pos = { x: 45 * dir, y: (i - 2.5) * 5 }; });
  for (const body of [...t.players, ...o.players]) {
    body.vel = { x: 0, y: 0 };
    body.kickCooldown = 0;
  }
  m.ball.owner = p;
  m.ball.pos = { x: 0.4 * dir, y: 0 };
  m.ball.vel = { x: 0, y: 0 };
  m.ball.z = 0;
  m.ball.vz = 0;
  m.possessionSide = 0;
  m.pendingPass = null;
  m.kickoffKickGid = null;
  m.restartKickGid = null;
  return { m, p, target, blocker };
};

const passScore = (p: Player): number => {
  const row = p.action.scores.find((s) => s.action === 'Pass');
  return row === undefined ? Number.NaN : row.score;
};
const passWhy = (p: Player): string => {
  const row = p.action.scores.find((s) => s.action === 'Pass');
  return row === undefined ? '' : row.why;
};

interface KickoffScene {
  m: Match; p: Player; near: Player; far: Player; blocker: Player;
}
/**
 * SITE (b)'s fixture — the kick-off play-back. The 12 m mate (whom the shipped scorer's
 * `|d − 12| · 0.02` band prefers) has one of OURS standing on the line to him; the 14 m mate,
 * off to the side, has a clear line. LN-C3 measured this family at 0.403488 of ALL caroms.
 */
const kickoffScene = (arm: Arm): KickoffScene => {
  const m = matchOf(SEED_FIXTURE, { ...arm, duration: 600 });
  while (m.phase !== 'playing') m.step(DT);
  const t = m.teams[0];
  const o = m.teams[1];
  const dir = t.attackDir;
  const p = t.players[2];
  const near = t.players[5];
  const far = t.players[3];
  const blocker = t.players[4];
  p.pos = { x: 0, y: 0 };
  near.pos = { x: -12 * dir, y: 0 };
  far.pos = { x: -14 * dir, y: 8 };
  blocker.pos = { x: -2 * dir, y: 0 };
  t.players[0].pos = { x: -45 * dir, y: 0 };
  t.players[1].pos = { x: -40 * dir, y: -26 };
  o.players.forEach((q, i) => { q.pos = { x: 42 * dir, y: (i - 2.5) * 5 }; });
  // ONE opponent stood over the blocker, so the shipped scorer's own radial openness
  // makes HIM a poor target: the fixture's question is near-vs-far, not near-vs-blocker.
  o.players[0].pos = { x: -2 * dir, y: 1 };
  for (const body of [...t.players, ...o.players]) {
    body.vel = { x: 0, y: 0 };
    body.kickCooldown = 0;
  }
  m.ball.owner = p;
  m.ball.pos = { x: 0, y: 0 };
  m.ball.vel = { x: 0, y: 0 };
  m.possessionSide = 0;
  m.pendingPass = null;
  m.restartKickGid = null;
  m.kickoffKickGid = p.gid;
  return { m, p, near, far, blocker };
};

/** SITE (c)'s fixture — a hand-built snapshot, so the chooser's arithmetic is visible. */
const OBSERVED = (gid: number, side: 0 | 1, x: number, y: number) => ({
  gid, side: side as 0 | 1, pos: { x, y }, vel: { x: 0, y: 0 }, bodyDir: { x: 1, y: 0 },
  observedTick: 0, ageTicks: 0,
});
const chooserFixture = (): {
  input: PerceivedPassChoiceInput; snapshot: PerceptionSnapshot; ownBodies: ReturnType<typeof OBSERVED>[];
} => {
  const passer = OBSERVED(0, 0, 0, 0);
  const blocked = OBSERVED(1, 0, 12, 0); // one of OURS stands on this line
  const clear = OBSERVED(2, 0, 0, 12); // nobody of ours near this one
  const own = OBSERVED(3, 0, 6, 0); // the body on the line to `blocked`
  const opp = OBSERVED(9, 1, 40, 30);
  const players = [passer, blocked, clear, own, opp];
  const snapshot: PerceptionSnapshot = {
    tick: 0, observerGid: 0, awareness: 1, ball: null, players,
  };
  const reachProfiles = new Map<number, KnownReachProfile>(
    players.map((e) => [e.gid, { topSpeed: 7, accel: 6, dribbling: 0.5 }]),
  );
  return {
    snapshot,
    ownBodies: [own],
    input: {
      snapshot, passerGid: 0, candidateGids: [1, 2], attackDir: 1, reachProfiles,
    },
  };
};

/* ------------------------------------------------------------------ */

describe('LN T0 — Road B: the own-lane price is DORMANT', () => {
  it('⭐⭐ THE PROHIBITION SET — no world, no preset, no env, no bundle names the flag', () => {
    expect(a4Source).not.toContain('lnOwnLanePrice');
    expect(a4Source).not.toContain('lnOwnLaneWeight');
    const VERSIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;
    for (const v of VERSIONS) {
      expect(Object.prototype.hasOwnProperty.call(a4MatchFlags(v), 'lnOwnLanePrice')).toBe(false);
    }
    const bare = new Match({ seed: 1, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.lnOwnLanePrice).toBe(false);
    const w13 = matchOf(SEEDS[0], { world: W13 });
    expect(w13.lnOwnLanePrice).toBe(false);
    const league = new League({ seed: 4242 });
    expect(league.createMatch(league.nextFixture()!).lnOwnLanePrice).toBe(false);
    // no env or bundle door anywhere in src/**
    for (const file of srcFiles('src')) {
      const text = readFileSync(file, 'utf8');
      if (!text.includes('lnOwnLanePrice')) continue;
      expect(['Match.ts', 'League.ts', 'PlayerBrain.ts', 'perceivedPassChoice.ts', 'genome.ts']
        .some((tail) => file.endsWith(tail))).toBe(true);
      expect(text).not.toContain('EDS_BUNDLE_ARMED && cfg.lnOwnLanePrice');
      expect(/process\.env[^\n]*lnOwnLanePrice/.test(text)).toBe(false);
    }
  });

  it('⭐ NO SERIALIZATION, and the gene is BORN ABSENT outside GENE_KEYS', () => {
    const league = new League({ seed: 99 });
    expect(JSON.stringify(league.toJSON())).not.toContain('lnOwnLanePrice');
    expect((GENE_KEYS as readonly string[]).includes('lnOwnLaneWeight')).toBe(false);
    // the born-absent draw discipline: the key is never written and no rng moves
    const g = randomGenome(new Rng(7));
    expect(Object.prototype.hasOwnProperty.call(g, 'lnOwnLaneWeight')).toBe(false);
    expect(JSON.stringify(g)).not.toContain('lnOwnLane');
    const mutRng = new Rng(11);
    const mutated = mutateGenome(g, mutRng);
    expect(Object.prototype.hasOwnProperty.call(mutated, 'lnOwnLaneWeight')).toBe(false);
    const crossed = crossoverGenomes(g, randomGenome(new Rng(8)), new Rng(12));
    expect(Object.prototype.hasOwnProperty.call(crossed, 'lnOwnLaneWeight')).toBe(false);
    // the accessor's own law: absent, non-finite and out-of-range all resolve safely
    expect(lnOwnLaneWeightOf(g)).toBe(0);
    expect(lnOwnLaneWeightOf({ ...g, lnOwnLaneWeight: Number.NaN })).toBe(0);
    expect(lnOwnLaneWeightOf({ ...g, lnOwnLaneWeight: -3 })).toBe(0);
    expect(lnOwnLaneWeightOf({ ...g, lnOwnLaneWeight: 5 })).toBe(1);
    expect(lnOwnLaneWeightOf({ ...g, lnOwnLaneWeight: 0.25 })).toBe(0.25);
  });

  it('⭐⭐ G-OFF: flag ABSENT ≡ flag EXPLICITLY FALSE, byte for byte — bare AND world 13', () => {
    const absent: string[] = [];
    const explicitFalse: string[] = [];
    for (const world of [undefined, W13] as const) {
      for (const seed of SEEDS) {
        absent.push(offSignature(seed, world));
        explicitFalse.push(signatureOf(matchOf(seed, {
          lnExplicitFalse: true, ...(world === undefined ? {} : { world }),
        })));
      }
    }
    expect(explicitFalse).toEqual(absent);
    expect(digest(explicitFalse)).toBe(digest(absent));
    // one distinct cell per (world × seed): the pin is not comparing a degenerate constant
    expect(new Set(absent).size).toBe(SEEDS.length * 2);
  }, 600_000);

  it('⭐⭐ G-IDENT: flag ON with the gene ABSENT ≡ flag OFF, byte for byte — the IEEE zero', () => {
    for (const world of [undefined, W13] as const) {
      for (const seed of SEEDS) {
        const armed = signatureOf(matchOf(seed, {
          ln: true, ...(world === undefined ? {} : { world }),
        }));
        expect(armed).toBe(offSignature(seed, world));
      }
    }
    // and the path really is LIVE while that holds — the seat exists, at weight zero
    const live = matchOf(SEEDS[0], { ln: true, world: W13 });
    expect(live.lnOwnLanePrice).toBe(true);
    for (const t of live.teams) expect(lnOwnLaneWeightOf(t.effGenome)).toBe(0);
  }, 600_000);

  it('⭐⭐ G-BITE: flag ON at w = 1 MOVES the world — bare AND world 13', () => {
    for (const world of [undefined, W13] as const) {
      let moved = 0;
      for (const seed of SEEDS) {
        const armed = signatureOf(matchOf(seed, {
          ln: true, weight: 1, ...(world === undefined ? {} : { world }),
        }));
        if (armed !== offSignature(seed, world)) moved++;
      }
      expect(moved).toBeGreaterThan(0);
    }
  }, 600_000);
});

describe('LN T0 §M-LN.1 — THE GEOMETRY IS THE SHIPPED ONE, over LN-C1\'s own population', () => {
  const from = { x: 0, y: 0 };
  const aim = { x: 12, y: 0 };
  const body = (gid: number, x: number, y: number, extra: Partial<{
    sentOff: boolean; role: string;
  }> = {}) => ({ gid, pos: { x, y }, ...extra });

  it('⭐⭐ a body ON the segment ⇒ openness 0 ⇒ the price is exactly w', () => {
    const o = ownLaneOpenness(from, aim, [body(3, 6, 0)], 0, 1);
    expect(o).toBe(0);
    expect(ownLanePrice(1, o)).toBe(1);
    expect(ownLanePrice(0.25, o)).toBe(0.25);
    // MUTANT: the same body moved off the line does NOT price at w
    expect(ownLanePrice(1, ownLaneOpenness(from, aim, [body(3, 6, 4)], 0, 1))).not.toBe(1);
  });

  it('⭐⭐ a body 4 m off ⇒ openness 1 ⇒ the price is exactly zero', () => {
    const o = ownLaneOpenness(from, aim, [body(3, 6, 4)], 0, 1);
    expect(o).toBe(1);
    expect(ownLanePrice(1, o)).toBe(0);
    // MUTANT: at 3.9 m the clamp has NOT yet saturated, so the pin is not vacuous
    expect(ownLaneOpenness(from, aim, [body(3, 6, 3.9)], 0, 1)).toBeLessThan(1);
  });

  it('⭐⭐ the 1.5 m clear-the-kicker guard is `laneOpenness`\'s OWN, and it bites', () => {
    // a body 1 m up the line from the kicker is IGNORED — the kick clears him
    expect(ownLaneOpenness(from, aim, [body(3, 1, 0)], 0, 1)).toBe(1);
    // MUTANT: the same body at 2 m — outside the guard — is NOT ignored
    expect(ownLaneOpenness(from, aim, [body(3, 2, 0)], 0, 1)).toBe(0);
  });

  it('⭐⭐ the passer, the target, the keeper and a sent-off body are all EXCLUDED', () => {
    const on = (gid: number, extra = {}) => [body(gid, 6, 0, extra)];
    expect(ownLaneOpenness(from, aim, on(0), 0, 1)).toBe(1); // the passer himself
    expect(ownLaneOpenness(from, aim, on(1), 0, 1)).toBe(1); // the intended target
    expect(ownLaneOpenness(from, aim, on(3, { role: 'GK' }), 0, 1)).toBe(1); // the keeper
    expect(ownLaneOpenness(from, aim, on(3, { sentOff: true }), 0, 1)).toBe(1); // sent off
    // MUTANT: a plain outfield body at the SAME spot is not excluded
    expect(ownLaneOpenness(from, aim, on(3, { role: 'ST' }), 0, 1)).toBe(0);
  });

  it('⭐⭐ ownLaneOpenness EQUALS laneOpenness on the filtered Players — one law, two populations', () => {
    const m = matchOf(SEED_FIXTURE, {});
    while (m.phase !== 'playing') m.step(DT);
    const t = m.teams[0];
    const p = t.players[2];
    const target = t.players[5];
    p.pos = { x: 0, y: 0 };
    target.pos = { x: 14, y: 0 };
    t.players[1].pos = { x: 7, y: 0.5 };
    t.players[3].pos = { x: 7, y: 3 };
    t.players[4].sentOff = true;
    t.players[4].pos = { x: 7, y: 0 };
    const filtered = t.players.filter((b) => (
      b.gid !== p.gid && b.gid !== target.gid && !b.sentOff && b.role !== 'GK'
    ));
    const mine = ownLaneOpenness(p.pos, target.pos, t.players, p.gid, target.gid);
    expect(mine).toBe(laneOpenness(p.pos, target.pos, filtered));
    expect(mine).toBeGreaterThan(0);
    expect(mine).toBeLessThan(1);
    // MUTANT: the UNFILTERED population is a different number — the filter is load-bearing
    expect(mine).not.toBe(laneOpenness(p.pos, target.pos, t.players));
  });

  it('⭐ ownLaneScopeGids is the same filter, minus the target clause', () => {
    const m = matchOf(SEED_FIXTURE, {});
    const t = m.teams[0];
    t.players[4].sentOff = true;
    const gids = ownLaneScopeGids(t.players[2].gid, t.players);
    expect(gids).not.toContain(t.players[2].gid); // the passer
    expect(gids).not.toContain(t.players[0].gid); // the keeper
    expect(gids).not.toContain(t.players[4].gid); // sent off
    expect(gids).toContain(t.players[5].gid);
    expect(gids.length).toBe(TEAM_SIZE - 3);
  });

  it('⭐ the price is the SINGLE owner of the arithmetic, and it is exact', () => {
    for (const w of [0, 0.25, 0.5, 1]) {
      for (const o of [0, 0.125, 0.5, 0.875, 1]) {
        expect(ownLanePrice(w, o)).toBe(w * (1 - o));
      }
    }
    // the born-absent zero: an exact `+0`, so `s − price` is bit-identical to `s`
    expect(ownLanePrice(0, 0.37)).toBe(0);
    expect(1 - ownLanePrice(0, 0.37)).toBe(1);
    for (const s of [0, -0, 1.25, -3.5, 1e-300, 1e300]) {
      expect(s - ownLanePrice(0, 0.37)).toBe(s);
      expect(s * (1 - ownLanePrice(0, 0.37))).toBe(s);
    }
  });
});

describe('LN T0 §M-LN.3 — THE THREE SITES, EXACT, ON HAND-BUILT FIXTURES', () => {
  it('⭐⭐ SITE (a) THE LANE ARGMAX — the winning candidate falls by EXACTLY w · (1 − ownLane)', () => {
    const W = 0.05; // small enough that the argmax's winner cannot flip — the FALL is the pin
    const shut = groundScene({});
    decidePlayer(shut.p, shut.m);
    const shutScore = passScore(shut.p);
    const shutWhy = passWhy(shut.p);
    expect(Number.isFinite(shutScore)).toBe(true);

    const armed = groundScene({ ln: true, weight: W });
    decidePlayer(armed.p, armed.m);
    const armedScore = passScore(armed.p);
    expect(passWhy(armed.p)).toBe(shutWhy); // the SAME winner, so the delta is the price alone

    const winner = armed.m.teams[0].players.find((q) => shutWhy.startsWith(`to ${q.name} `))!;
    const price = ownLanePrice(W, ownLaneOpenness(
      armed.p.pos, winner.pos, armed.m.teams[0].players, armed.p.gid, winner.gid,
    ));
    expect(price).toBeGreaterThan(0);
    expect(armedScore).toBe(shutScore - price);

    // MUTANT 1 — the wrong sign: adding the price is a different double
    expect(armedScore).not.toBe(shutScore + price);
    // MUTANT 2 — the BODY SET is load-bearing: with no own bodies handed in, the openness
    // is 1, the price is exactly zero and the armed score would be the shut one
    expect(ownLanePrice(W, ownLaneOpenness(armed.p.pos, winner.pos, [], armed.p.gid, winner.gid)))
      .toBe(0);
    expect(armedScore).not.toBe(shutScore);
    // MUTANT 3 — the blocker is what makes the lane cost: move him off the line and the
    // engine's own armed score returns to the shut one
    const cleared = groundScene({ ln: true, weight: W });
    cleared.blocker.pos = { x: cleared.blocker.pos.x, y: 30 };
    decidePlayer(cleared.p, cleared.m);
    expect(passScore(cleared.p)).toBe(shutScore);
  }, 120_000);

  it('⭐⭐ SITE (a) BITES — at w = 1 the argmax prefers the own-CLEAR man', () => {
    const shut = groundScene({});
    decidePlayer(shut.p, shut.m);
    const armed = groundScene({ ln: true, weight: 1 });
    decidePlayer(armed.p, armed.m);
    expect(passScore(armed.p)).toBeLessThan(passScore(shut.p));
  }, 120_000);

  it('⭐⭐ SITE (b) THE KICK-OFF PLAY-BACK — shut takes the blocked 12 m mate, armed takes the clear one', () => {
    const shut = kickoffScene({});
    decidePlayer(shut.p, shut.m);
    expect(shut.p.action.type).toBe('Pass');
    expect(shut.p.action.targetIdx).toBe(shut.near.gid);

    const armed = kickoffScene({ ln: true, weight: 1 });
    // the price the seam charges the shipped winner, computed OUTSIDE the engine
    const nearPrice = ownLanePrice(1, ownLaneOpenness(
      armed.p.pos, armed.near.pos, armed.m.teams[0].players, armed.p.gid, armed.near.gid,
    ));
    const farPrice = ownLanePrice(1, ownLaneOpenness(
      armed.p.pos, armed.far.pos, armed.m.teams[0].players, armed.p.gid, armed.far.gid,
    ));
    expect(nearPrice).toBe(1); // one of ours stands exactly on the 12 m line
    expect(farPrice).toBeLessThan(nearPrice);
    decidePlayer(armed.p, armed.m);
    expect(armed.p.action.type).toBe('Pass');
    expect(armed.p.action.targetIdx).toBe(armed.far.gid);

    // MUTANT — the blocker removed from the line: the armed scorer goes back to the 12 m mate
    const mutant = kickoffScene({ ln: true, weight: 1 });
    mutant.blocker.pos = { x: mutant.blocker.pos.x, y: 30 };
    decidePlayer(mutant.p, mutant.m);
    expect(mutant.p.action.targetIdx).toBe(mutant.near.gid);
  }, 120_000);

  it('⭐⭐ SITE (c2) THE PERCEIVED CHOOSER — the executable price is multiplied by exactly the factor', () => {
    const { input, ownBodies } = chooserFixture();
    const shut = choosePerceivedPassTarget(input)!;
    expect(shut).not.toBeNull();
    const W = 0.5;
    const factorOf = (targetGid: number): number => {
      const seenPasser = input.snapshot.players.find((e) => e.gid === input.passerGid)!;
      const seenTarget = input.snapshot.players.find((e) => e.gid === targetGid)!;
      return 1 - ownLanePrice(W, ownLaneOpenness(
        seenPasser.pos, seenTarget.pos, ownBodies, input.passerGid, targetGid,
      ));
    };
    expect(factorOf(1)).toBe(0.5); // our man stands on the line to gid 1
    expect(factorOf(2)).toBe(1); // nobody of ours near the line to gid 2

    const armed = choosePerceivedPassTarget({ ...input, ownLaneFactor: factorOf })!;
    for (const option of armed.options) {
      const shutOption = shut.options.find((o) => o.targetGid === option.targetGid)!;
      if (!option.executable) {
        expect(option.price).toBe(shutOption.price); // a man he cannot aim at is left alone
        continue;
      }
      expect(option.price).toBe(shutOption.price * factorOf(option.targetGid));
    }
    // the argmax compares `price`, so the read landed on the compared quantity
    expect(armed.price).toBe(armed.options.find((o) => o.targetGid === armed.targetGid)!.price);
    // and the winner FLIPS: the blocked man out-priced the clear one before the price
    expect(shut.targetGid).toBe(1);
    expect(armed.targetGid).toBe(2);

    // MUTANT — the factor applied with the wrong sign (a BONUS for a blocked lane)
    const wrongSign = choosePerceivedPassTarget({
      ...input, ownLaneFactor: (gid) => 1 + ownLanePrice(W, ownLaneOpenness(
        input.snapshot.players.find((e) => e.gid === input.passerGid)!.pos,
        input.snapshot.players.find((e) => e.gid === gid)!.pos,
        ownBodies, input.passerGid, gid,
      )),
    })!;
    expect(wrongSign.targetGid).not.toBe(armed.targetGid);
    // MUTANT — no hook at all is the shipped chooser, unchanged
    expect(choosePerceivedPassTarget({ ...input, ownLaneFactor: undefined })!.price)
      .toBe(shut.price);
  });

  it('⭐⭐ SITE (c1) THE SCOPE — the own gids enter the snapshot ONLY under the flag', () => {
    const m = matchOf(SEED_FIXTURE, { world: W13, duration: 600 });
    while (m.phase !== 'playing') m.step(DT);
    for (let i = 0; i < 200; i++) m.step(DT);
    const t = m.teams[0];
    const p = t.players[2];
    const oppTeam = m.teams[1];
    const shippedScope = new Set<number>([p.gid]);
    for (const other of oppTeam.players) if (!other.sentOff) shippedScope.add(other.gid);
    const armedScope = new Set<number>(shippedScope);
    for (const gid of ownLaneScopeGids(p.gid, t.players)) armedScope.add(gid);
    expect(armedScope.size).toBeGreaterThan(shippedScope.size);
    const shipped = m.perceivedSnapshot(p, shippedScope);
    const widened = m.perceivedSnapshot(p, armedScope);
    expect(shipped).not.toBeNull();
    expect(widened).not.toBeNull();
    const ownSeen = widened!.players.filter((e) => e.side === p.side && e.gid !== p.gid);
    expect(ownSeen.length).toBeGreaterThan(0);
    expect(shipped!.players.filter((e) => e.side === p.side && e.gid !== p.gid).length)
      .toBe(0);
    // the widened snapshot carries the SAME entries for every gid the shipped one had:
    // the passer perceives his own men through the same eyes, at the snapshot's own age
    for (const entry of shipped!.players) {
      const twin = widened!.players.find((e) => e.gid === entry.gid)!;
      expect(JSON.stringify(twin)).toBe(JSON.stringify(entry));
    }
  }, 120_000);
});

describe('LN T0 §SEAM MAP — the anchors (canon: PC-C0 §CORR item 1)', () => {
  it('⭐⭐ THE FLAG `lnOwnLanePrice` — counts per file, every site enumerated', () => {
    const perFile = srcFiles('src')
      .map((f) => [f, count(readFileSync(f, 'utf8'), /lnOwnLanePrice/g)] as const)
      .filter(([, n]) => n > 0);
    // three EXECUTABLE homes plus two docblock cross-references that name the flag
    expect(new Set(perFile.map(([f]) => f.replace(/\\/g, '/')))).toEqual(new Set([
      'src/sim/Match.ts', 'src/sim/League.ts', 'src/ai/PlayerBrain.ts',
      'src/ai/perceivedPassChoice.ts', 'src/evolution/genome.ts',
    ]));
    // the two cross-references are PROSE — neither file can read the flag
    for (const doc of [chooserSource, genomeSource]) {
      for (const line of doc.split('\n').filter((l) => l.includes('lnOwnLanePrice'))) {
        expect(line.trimStart().startsWith('*')).toBe(true);
      }
    }
    // Match.ts: the config field, the readonly field, the constructor `?? false` (twice on
    // that one line), and the two docblock mentions of the flag's own name.
    expect(count(matchSource, /lnOwnLanePrice\?: boolean;/g)).toBe(1);
    expect(count(matchSource, /readonly lnOwnLanePrice: boolean;/g)).toBe(1);
    expect(count(matchSource, /this\.lnOwnLanePrice = cfg\.lnOwnLanePrice \?\? false;/g)).toBe(1);
    expect(count(leagueSource, /^ {4}\| 'lnOwnLanePrice'$/gm)).toBe(1);
    // ⭐⭐ EXACTLY ONE EXECUTABLE READ IN THE BRAIN — one seat, four sites
    expect(count(brainSource, /match\.lnOwnLanePrice/g)).toBe(1);
    expect(brainSource).toContain(
      '  const lnSeat = match.lnOwnLanePrice ? { w: lnOwnLaneWeightOf(g) } : null;',
    );
  });

  it('⭐⭐ ONE `ownLaneOpenness` CALL AT EACH OF THE THREE READ SITES, and no fourth', () => {
    expect(count(brainSource, /ownLaneOpenness\(/g)).toBe(3);
    expect(count(brainSource, /ownLanePrice\(/g)).toBe(3);
    expect(count(brainSource, /ownLaneScopeGids\(/g)).toBe(1);
    // site (a) — the lane argmax, between `sGc` and `sRa`
    expect(brainSource).toContain('      const sLn = lnSeat === null ? sGc\n');
    expect(brainSource).toContain(
      '        : sGc - ownLanePrice(lnSeat.w, ownLaneOpenness(p.pos, aim, team.players, p.gid, mate.gid));',
    );
    expect(brainSource).toContain('      const sRa = raSeat === null ? sLn\n');
    // site (b) — the kick-off play-back scorer, inside its own loop
    expect(brainSource).toContain(
      '        s -= ownLanePrice(lnSeat.w, ownLaneOpenness(p.pos, mate.pos, team.players, p.gid, mate.gid));',
    );
    // site (c1) — the scope, GUARDED: the else-branch is the only place a gid is added
    expect(brainSource).toContain(
      '    const lnOwnGids = lnSeat === null ? null : ownLaneScopeGids(p.gid, team.players);',
    );
    expect(brainSource).toContain(
      '    if (lnOwnGids !== null) for (const gid of lnOwnGids) scope.add(gid);',
    );
    expect(count(brainSource, /scope\.add\(/g)).toBe(2);
    // site (c2) — the factor is handed to the chooser, which owns the ONE argmax
    expect(brainSource).toContain('        ownLaneFactor: lnOwnLaneFactor,');
    expect(count(chooserSource, /ownLaneFactor/g)).toBe(3); // the field and its two reads
    expect(chooserSource).toContain('  const priced = input.ownLaneFactor === undefined ? options');
    // ⛔ NO OTHER SCORER: the through ball, the cutback and TeamBrain never name the seam
    const through = brainSource.slice(
      brainSource.indexOf('// --- Through ball:'), brainSource.indexOf('// --- Cross (Phase 28)'),
    );
    expect(through.length).toBeGreaterThan(200);
    expect(through).not.toContain('ownLane');
    expect(src('ai/TeamBrain.ts')).not.toContain('ownLane');
  });

  it('⭐⭐ THE SEAT MODULE reads nothing but what it is handed — no Match, no rng, no percept pull', () => {
    // the CODE, with every comment line stripped — the docblocks are allowed to NAME the
    // things the code may not touch (canon: a needle list is a confirmation, not a census)
    const seatCode = seatSource.split('\n')
      .filter((l) => !/^\s*(\/\*|\*|\/\/)/.test(l)).join('\n');
    for (const forbidden of ['match.', 'Math.random', 'rng', 'perceivedSnapshot', 'Rng']) {
      expect(seatCode).not.toContain(forbidden);
    }
    expect(seatCode).not.toContain("import { Match");
    // it CALLS the shipped geometry rather than restating it
    expect(count(seatCode, /laneOpenness\(from, aim, kept as unknown as Player\[\]\)/g)).toBe(1);
    expect(seatCode).not.toContain('closestPointOnSegment');
    expect(seatCode).not.toContain('/ 4');
    expect(seatCode).not.toContain('1.5');
    // the gene's accessor is the SINGLE owner of the clamp
    expect(count(genomeSource, /lnOwnLaneWeight\b/g)).toBeGreaterThan(0);
    expect(count(genomeSource, /export function lnOwnLaneWeightOf/g)).toBe(1);
    expect(count(brainSource, /lnOwnLaneWeightOf\(/g)).toBe(1);
  });
});

describe('LN T0 — the fingerprint of record', () => {
  it('⭐ the fingerprint literal is in this suite, and the seam may not move it', () => {
    expect(FINGERPRINT_OF_RECORD).toBe(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
  });

  it('⭐⭐ THE PRODUCTION FINGERPRINT IS UNCHANGED (57b0bdab…c673) — the a4HomeGrant form', () => {
    const league = new League({ seed: 1337 });
    const out = runHeadless(league.toJSON() as Record<string, unknown>, {
      kind: 'toGeneration', target: league.generation + 2,
    });
    expect(createHash('sha256').update(JSON.stringify(out.league)).digest('hex'))
      .toBe(FINGERPRINT_OF_RECORD);
  }, 180_000);
});
