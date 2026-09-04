import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { runHeadless } from '../src/sim/simRunner';
import { DT } from '../src/sim/constants';
import {
  GENE_KEYS, crossoverGenomes, mutateGenome, randomGenome, rcAnticipationWeightOf,
  type TacticalGenome,
} from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells } from '../src/game/a4World';
import { Rng } from '../src/utils/rng';
import {
  PC_N_COVER, PC_TIER_CHOICE_TICKS, PC_TIER_SIMPLE_TICKS, PcLatencySeat, PcRecognitionBook,
  pcRecognitionKey, pcTierTicks, preCueTicks as preCueTicksFromPc,
} from '../src/ai/pcLatency';
import {
  RC_BELIEF_BY_RANK, RC_BELIEF_DENOMINATOR, RC_BELIEF_NUMERATORS, RC_PRECUE_FLOOR_TICKS,
  alignmentRank, preCueTicks, rcBeliefForRank,
} from '../src/ai/receiverAnticipationSeat';

/**
 * ⭐⭐ RC T0 — THE PRE-CUE DORMANT SEAM (docs/world-model/RC-T0-PRECUE-SEAM.md; ruling #369
 * item 6; contracts RC-RECEIVER-COOPERATION-CONTRACT.md §2-AMENDMENT M-RC.3a and
 * PC-PERCEPTION-CONTRACT.md §2-AMENDMENT M-PC.1b) — THE SEAM'S PERMANENT PIN SUITE, in the
 * house form (`raAccessPrice.test.ts` / `pcLatencySeam.test.ts`).
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * 「看见他正对着我起腿的人,球出脚时反应得快」 — armed, an own-side body armed by the
 * `passRelease` detector meets the release as a PRE-CUED stimulus in proportion to his
 * ALIGNMENT RANK on the passer's body (RC-C0 §P.A's cue) times RC-C0's own measured rank
 * table, and his hold INTERPOLATES the two certified PC tiers. The book still wins.
 *
 * The pins:
 *   • ⭐⭐ THE PROHIBITION SET — no world, no preset, no env, no bundle names the flag or the
 *     gene; `a4World.ts` contains NEITHER string at any version.
 *   • ⭐ NO SERIALIZATION — `League.toJSON` omits the flag; the gene is BORN ABSENT and
 *     `JSON.stringify` omits it.
 *   • ⭐⭐ G-OFF — flag ABSENT ≡ flag EXPLICITLY FALSE, byte for byte, on the BARE world AND on
 *     WORLD 12's composition × 2 scratch seeds each, pooled digest.
 *   • ⭐⭐ G-BORN / G-ZERO — armed with the gene ABSENT ≡ shut (structurally: no pre-cue is
 *     ever built); armed at gene 0 ≡ shut with the path LIVE (`preCuedArms > 0` while the
 *     whole-match signatures match).
 *   • ⭐⭐ G-BOOK — a cell his own book COVERS ignores the pre-cue: SIMPLE, regardless.
 *   • ⭐⭐ G-BITE — the fixture ticks are `preCueTicks(12, 27, 1, TABLE[r])` DERIVED, and a
 *     world-12 walk at weight 1 really does produce pre-cued `passRelease` holds SHORTER than
 *     the choice tier.
 *   • ⭐ G-FLOOR / G-CEIL — the hold never leaves [SIMPLE, CHOICE] across the (w, belief) grid.
 *   • ⭐ G-OPP / G-INITIATOR — relation `opp` never reaches the branch; the passer pays nothing.
 *   • ⭐⭐ G-TABLE — the five values RE-DERIVED from RC-C0's artifact ON DISK, bit-exact, with
 *     the artifact's byte-hash asserted.
 *   • ⭐ G-RANK — the cue on constructed geometries (ties to the lowest gid, degenerate
 *     excluded, keeper included) against a naive independent re-implementation.
 *   • ⭐⭐ CHANNEL CLOSURE — the seat module's import list and source; the LIVE call site's
 *     argument list pinned as the read set (canon: anchored extraction).
 *   • ⭐⭐ THE SEAM MAP — occurrence COUNTS per needle, EVERY site enumerated.
 *   • ⭐ G-RNG — the pricing/arming path draws ZERO rng; flag-off mutate/crossover streams
 *     UNMOVED; the opt-in draws only when asked, strictly after every existing block.
 *   • ⭐ THE FINGERPRINT OF RECORD — a literal in this suite; the seam may not move it.
 *
 * ⚠ Every walk in this file lives in the OUT-OF-BAND SCRATCH CLASS 900,002,000–099 (canon:
 * "verifier scratch walks use the stage's own consumed band or the out-of-band scratch range
 * (≥ 900,000,000) — never the next virgin block"). ZERO frontier consumption.
 */

/** The production fingerprint of record (#305 item 1) — this seam may not move it. */
const FINGERPRINT_OF_RECORD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⚠ OUT-OF-BAND SCRATCH SEEDS — RC-T0's own band, 900,002,000–099. */
const SEED_A = 900_002_000;
const SEED_B = 900_002_001;
const SEED_C = 900_002_002;
const SEED_D = 900_002_003;

/** RC-C0's artifact — the belief table's ONE source, and its byte-hash of record (#367.1). */
const RC_ARTIFACT_PATH = 'docs/world-model/data/rc-c0-cooperation-census.json';
const RC_ARTIFACT_SHA =
  '79ec2953761a2a7748eb77de9b3b64954601e0ecc3abc8506730549517c4a7b3';

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
  rc?: boolean;
  /** pass the door EXPLICITLY as false rather than omitting it (dormancy's other half) */
  rcExplicitFalse?: boolean;
  /** the anticipation gene, written on all three genome views of BOTH teams (#196.3-D6) */
  weight?: number;
  /** write the gene on ONE side only (the G-OPP walk) */
  weightSideZeroOnly?: number;
  /** world 12's composition — the form the user plays */
  world?: 12;
  /**
   * ⚠ world 12 with the recognition books left BORN ABSENT (`?pcdose=0`, PC-T2's `v7pcEmpty`
   * arm) — RC-C0's OWN form: it measured the `passRelease` hold at the CHOICE tier there
   * (25.27 applied ticks), which is the form in which a pre-cue has anything to shorten.
   */
  emptyBooks?: boolean;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const base = a.world === undefined ? {} : a4MatchFlags(a.world);
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240,
    ...base,
    ...(a.rc === true ? { rcAnticipate: true } : {}),
    ...(a.rcExplicitFalse === true ? { rcAnticipate: false } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (a.world !== undefined) {
    armA4World(m, null, a.world, L3_DOSE, a.emptyBooks === true ? null : PC_DOSE);
  }
  for (const t of m.teams) {
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      if (a.weight !== undefined) g.rcAnticipationWeight = a.weight;
    }
  }
  if (a.weightSideZeroOnly !== undefined) {
    const t = m.teams[0];
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      g.rcAnticipationWeight = a.weightSideZeroOnly;
    }
  }
  return m;
};

/** The house world-identity signature (PW-T0b's, verbatim via GC-T0 / RA-T0). */
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

/** Every DISTINCT hold armed over a walk, collected off the seat's own read-only snapshot. */
interface WalkedHold {
  gid: number; ticks: number; tier: string; klass: string; key: string;
  preCued: boolean; belief: number;
}
const walkHolds = (m: Match): WalkedHold[] => {
  const seen = new Map<string, WalkedHold>();
  while (!m.finished) {
    m.step(DT);
    const seat = m.pcLatency;
    if (seat === null) continue;
    for (const { gid, hold } of seat.holdSnapshot()) {
      seen.set(`${gid}:${hold.armedTick}`, {
        gid, ticks: hold.ticks, tier: hold.tier, klass: hold.klass, key: hold.key,
        preCued: hold.preCued, belief: hold.belief,
      });
    }
  }
  return [...seen.values()];
};

const src = (rel: string): string =>
  readFileSync(new URL(`../src/${rel}`, import.meta.url), 'utf8');
const seatSource = src('ai/receiverAnticipationSeat.ts');
const pcSource = src('ai/pcLatency.ts');
const matchSource = src('sim/Match.ts');
const leagueSource = src('sim/League.ts');
const genomeSource = src('evolution/genome.ts');
const a4Source = src('game/a4World.ts');
const count = (hay: string, needle: RegExp): number => (hay.match(needle) ?? []).length;
const linesOf = (hay: string, line: string): number =>
  hay.split('\n').filter((l) => l === line).length;
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = join(dir, e);
  return statSync(full).isDirectory() ? srcFiles(full) : full.endsWith('.ts') ? [full] : [];
});

/** A seat with EMPTY books — every cell born absent, so every tier is CHOICE (the novice). */
const emptySeat = (): PcLatencySeat =>
  new PcLatencySeat([new PcRecognitionBook(), new PcRecognitionBook()]);
const PASS_KEY = pcRecognitionKey('passRelease', false, 'own');

/* ========================================================================== */
/* ROAD B — HYGIENE, THE PROHIBITION SET AND STRONG DORMANCY                  */
/* ========================================================================== */

describe('RC T0 — the pre-cue is dormant (Road B)', () => {
  it('⭐⭐ THE PROHIBITION SET: no world, no preset, no env and no default names the flag or the gene', () => {
    expect(matchSource).toContain('this.rcAnticipate = cfg.rcAnticipate ?? false;');
    // ⛔ the entry layer names NEITHER: world 13 is a later stage's business (#369 item 5)
    expect(a4Source).not.toContain('rcAnticipate');
    expect(a4Source).not.toContain('rcAnticipationWeight');
    for (const v of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const) {
      const flags = a4MatchFlags(v as never) as Record<string, unknown>;
      expect(flags.rcAnticipate).toBeUndefined();
      expect(JSON.stringify(flags)).not.toContain('rcAnticipate');
    }
    const bare = new Match({ seed: 7, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.rcAnticipate).toBe(false);
    expect(matchOf(SEED_A).rcAnticipate).toBe(false);
    expect(matchOf(SEED_A, { world: W12 }).rcAnticipate).toBe(false);
    const league = new League({ seed: SEED_A });
    expect(league.createMatch(league.nextFixture()!).rcAnticipate).toBe(false);
    // no env / bundle door anywhere on a seam line
    for (const f of [
      'src/sim/Match.ts', 'src/sim/League.ts', 'src/ai/receiverAnticipationSeat.ts',
      'src/ai/pcLatency.ts', 'src/evolution/genome.ts',
    ]) {
      for (const line of readFileSync(f, 'utf8').split('\n')) {
        if (!/rcAnticipate|rcAnticipationWeight|preCue|alignmentRank|rcBelief/i.test(line)) {
          continue;
        }
        expect(line).not.toMatch(/envArmed|EDS_BUNDLE_ARMED|process\.env/);
      }
    }
  });

  it('⭐ NO SERIALIZATION: the flag never reaches a serialized League, and the gene stays born absent', () => {
    const league = new League({ seed: SEED_A });
    league.matchFlags = { rcAnticipate: true };
    expect(JSON.stringify(league.toJSON())).not.toContain('rcAnticipate');
    expect((GENE_KEYS as readonly string[])).not.toContain('rcAnticipationWeight');
    const g = randomGenome(new Rng(SEED_A));
    expect(g.rcAnticipationWeight).toBeUndefined();
    expect(rcAnticipationWeightOf(g)).toBeNull();
    expect(JSON.stringify(g)).not.toContain('rcAnticipationWeight');
  });

  it('⭐⭐ G-OFF: ABSENT ≡ EXPLICIT-FALSE — the bare world AND world 12\'s composition × 2 seeds', () => {
    const absent: string[] = [];
    const explicitFalse: string[] = [];
    for (const world of [undefined, W12] as const) {
      for (const seed of [SEED_A, SEED_B]) {
        absent.push(signatureOf(matchOf(seed, { world })));
        explicitFalse.push(signatureOf(matchOf(seed, { world, rcExplicitFalse: true })));
      }
    }
    expect(explicitFalse).toEqual(absent);
    expect(digest(explicitFalse)).toBe(digest(absent));
    expect(new Set(absent).size).toBe(4); // one digest per (world × seed) cell
  });

  it('⭐⭐ G-BORN: armed with the gene ABSENT ≡ shut, byte for byte (no pre-cue is ever built)', () => {
    for (const seed of [SEED_A, SEED_B]) {
      const shut = signatureOf(matchOf(seed, { world: W12 }));
      const armed = signatureOf(matchOf(seed, { world: W12, rc: true }));
      expect(armed).toBe(shut);
    }
    const live = matchOf(SEED_A, { world: W12, rc: true });
    expect(live.rcAnticipate).toBe(true);
    for (const t of live.teams) expect(rcAnticipationWeightOf(t.effGenome)).toBeNull();
    // and structurally: the absent gene means no arm ever took the pre-cue branch
    const holds = walkHolds(live);
    expect(holds.length).toBeGreaterThan(0);
    expect(holds.filter((h) => h.preCued).length).toBe(0);
    expect(live.pcLatency!.ledger.preCuedArms).toBe(0);
  }, 60_000);

  it('⭐⭐ G-ZERO: armed with the gene PRESENT AT ZERO ≡ shut, with the path LIVE', () => {
    // ⚠ THE COMPARATOR CARRIES THE SAME GENE (the GC-T0 lesson): both arms hold the gene at 0
    // so the ONLY difference is the flag.
    const shut: string[] = [];
    const armedZero: string[] = [];
    for (const seed of [SEED_A, SEED_B]) {
      shut.push(signatureOf(matchOf(seed, { world: W12, weight: 0 })));
      armedZero.push(signatureOf(matchOf(seed, { world: W12, weight: 0, rc: true })));
    }
    expect(armedZero).toEqual(shut);
    expect(digest(armedZero)).toBe(digest(shut));
    // ⭐ THE PATH IS LIVE, not skipped: the branch really ran, and every pre-cued arm came out
    // at EXACTLY the choice tier — which is why the signatures above are identical.
    const live = matchOf(SEED_C, { world: W12, weight: 0, rc: true, emptyBooks: true });
    const holds = walkHolds(live);
    const preCued = holds.filter((h) => h.preCued);
    expect(live.pcLatency!.ledger.preCuedArms).toBeGreaterThan(0);
    expect(preCued.length).toBeGreaterThan(0);
    for (const h of preCued) expect(h.ticks).toBe(PC_TIER_CHOICE_TICKS);
  }, 60_000);
});

/* ========================================================================== */
/* THE LAW ON FIXTURES — M-RC.3a / M-PC.1b, and the two certified endpoints   */
/* ========================================================================== */

describe('RC T0 §LAW — the interpolation, on fixtures', () => {
  it('⭐⭐ G-BITE (fixture): the pre-cued hold is EXACTLY preCueTicks(SIMPLE, CHOICE, w, TABLE[r])', () => {
    for (const rank of [1, 2, 3, 4, 5]) {
      const seat = emptySeat();
      const belief = RC_BELIEF_BY_RANK[rank - 1];
      const hold = seat.arm(3, 3, 0, 'passRelease', PASS_KEY, 100, { belief, weight: 1 });
      // DERIVED, never typed: the expectation is the law's own arithmetic on the two certified
      // tier constants and the census table.
      expect(hold.ticks).toBe(
        preCueTicks(PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS, 1, belief),
      );
      expect(hold.preCued).toBe(true);
      expect(hold.belief).toBe(belief);
      // ⭐ the TIER LABEL stays the BOOK's decision — the ledger keeps counting the book
      expect(hold.tier).toBe('choice');
      expect(seat.ledger.armedByTier.choice).toBe(1);
      expect(seat.ledger.preCuedArms).toBe(1);
      expect(hold.untilTick).toBe(100 + 1 + hold.ticks);
    }
    // the two ends of the census table, on the numbers of record
    const r1 = emptySeat().arm(1, 1, 0, 'passRelease', PASS_KEY, 5,
      { belief: RC_BELIEF_BY_RANK[0], weight: 1 }).ticks;
    const r5 = emptySeat().arm(1, 1, 0, 'passRelease', PASS_KEY, 5,
      { belief: RC_BELIEF_BY_RANK[4], weight: 1 }).ticks;
    expect(r1).toBe(preCueTicks(PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS, 1,
      RC_BELIEF_BY_RANK[0]));
    expect(r5).toBe(preCueTicks(PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS, 1,
      RC_BELIEF_BY_RANK[4]));
    expect(r1).toBeGreaterThan(PC_TIER_SIMPLE_TICKS); // ⭐ THE HONEST CEILING: 17, not 12
    expect(r1).toBe(RC_PRECUE_FLOOR_TICKS);
    expect(r5).toBe(PC_TIER_CHOICE_TICKS); // rank 5 buys essentially nothing
  });

  it('⭐⭐ G-BOOK: a cell his own book COVERS ignores the pre-cue — SIMPLE, regardless', () => {
    const seat = emptySeat();
    for (let i = 0; i < PC_N_COVER; i++) seat.books[0].note(4, PASS_KEY);
    expect(seat.books[0].tierFor(4, PASS_KEY)).toBe('simple');
    for (const belief of [RC_BELIEF_BY_RANK[0], RC_BELIEF_BY_RANK[4], 0, 1]) {
      const hold = seat.arm(4, 4, 0, 'passRelease', PASS_KEY, 200, { belief, weight: 1 });
      expect(hold.ticks).toBe(PC_TIER_SIMPLE_TICKS);
      expect(hold.ticks).toBe(pcTierTicks('simple'));
      expect(hold.tier).toBe('simple');
      expect(hold.preCued).toBe(false);
      expect(hold.belief).toBe(0); // the field never implies a belief nobody spent
    }
    expect(seat.ledger.preCuedArms).toBe(0);
  });

  it('⭐ ABSENT / NULL pre-cue ⇒ arm() is byte-for-byte today\'s (the two tier constants)', () => {
    const a = emptySeat().arm(2, 2, 1, 'passRelease', PASS_KEY, 50);
    const b = emptySeat().arm(2, 2, 1, 'passRelease', PASS_KEY, 50, null);
    for (const h of [a, b]) {
      expect(h.ticks).toBe(PC_TIER_CHOICE_TICKS);
      expect(h.preCued).toBe(false);
      expect(h.belief).toBe(0);
    }
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('⭐ G-FLOOR / G-CEIL: the hold NEVER leaves [SIMPLE, CHOICE], corners included', () => {
    const grid = [0, 0.0001, 0.25, 1 / 3, 0.5, 0.681429, 0.75, 0.9999, 1];
    for (const w of grid) {
      for (const belief of grid) {
        const t = preCueTicks(PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS, w, belief);
        expect(t).toBeGreaterThanOrEqual(PC_TIER_SIMPLE_TICKS);
        expect(t).toBeLessThanOrEqual(PC_TIER_CHOICE_TICKS);
        expect(Number.isInteger(t)).toBe(true);
      }
    }
    // the two identities: no trust or no belief ⇒ the CHOICE tier EXACTLY (today's world)
    for (const belief of grid) {
      expect(preCueTicks(PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS, 0, belief))
        .toBe(PC_TIER_CHOICE_TICKS);
    }
    for (const w of grid) {
      expect(preCueTicks(PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS, w, 0))
        .toBe(PC_TIER_CHOICE_TICKS);
    }
    // total certainty at full trust lands ON the simple floor and never under it
    expect(preCueTicks(PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS, 1, 1))
      .toBe(PC_TIER_SIMPLE_TICKS);
    // out-of-range arguments are clamped, not extrapolated (no negative-trust world)
    expect(preCueTicks(PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS, -5, 1))
      .toBe(PC_TIER_CHOICE_TICKS);
    expect(preCueTicks(PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS, 5, 5))
      .toBe(PC_TIER_SIMPLE_TICKS);
    // and it is monotone in the product, as the law's shape claims
    let prev = PC_TIER_CHOICE_TICKS + 1;
    for (const b of [0, 0.2, 0.4, 0.6, 0.8, 1]) {
      const t = preCueTicks(PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS, 1, b);
      expect(t).toBeLessThanOrEqual(prev);
      prev = t;
    }
  });

  it('⭐ THE ACCESSOR distinguishes ABSENT from ZERO, and clamps like its family', () => {
    expect(rcAnticipationWeightOf({} as TacticalGenome)).toBeNull();
    expect(rcAnticipationWeightOf({ rcAnticipationWeight: 0 } as TacticalGenome)).toBe(0);
    expect(rcAnticipationWeightOf({ rcAnticipationWeight: 0.4 } as TacticalGenome)).toBe(0.4);
    expect(rcAnticipationWeightOf({ rcAnticipationWeight: 2 } as TacticalGenome)).toBe(1);
    expect(rcAnticipationWeightOf({ rcAnticipationWeight: -1 } as TacticalGenome)).toBe(0);
    expect(rcAnticipationWeightOf(
      { rcAnticipationWeight: Number.NaN } as TacticalGenome,
    )).toBe(0);
  });
});

/* ========================================================================== */
/* G-TABLE — RC-C0's OWN MEASUREMENT, RE-DERIVED FROM THE ARTIFACT ON DISK    */
/* ========================================================================== */

describe('RC T0 §G-TABLE — the belief table is the census\'s, re-derived off disk', () => {
  it('⭐⭐ the five values re-derive BIT-EXACTLY from RC-C0\'s artifact, whose bytes are hashed', () => {
    const bytes = readFileSync(RC_ARTIFACT_PATH);
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(RC_ARTIFACT_SHA);
    const art = JSON.parse(bytes.toString('utf8')) as {
      bins: { ambiguityAtLastTick: { pooled: number[] } };
      licence: { pLockLast: { denominator: number } };
    };
    const pooled = art.bins.ambiguityAtLastTick.pooled;
    const den = art.licence.pLockLast.denominator;
    // the transcription IS the artifact's own integers
    expect([...RC_BELIEF_NUMERATORS]).toEqual(pooled.slice(0, 5));
    expect(RC_BELIEF_DENOMINATOR).toBe(den);
    expect(den).toBe(42248);
    // ⭐ BIT-EXACT quotients (`toBe`, not `toBeCloseTo`) — stored as numerator/denominator
    for (let r = 1; r <= 5; r++) {
      expect(rcBeliefForRank(r)).toBe(pooled[r - 1] / den);
      expect(RC_BELIEF_BY_RANK[r - 1]).toBe(pooled[r - 1] / den);
    }
    // the overflow bin is empty — no wind-up ever put the target past rank 5 in that battery
    expect(pooled[5]).toBe(0);
    // rank 1 IS `cue.pLockLast` (0.681429 at the artifact's own 6 dp), and the five sum to 1
    expect(RC_BELIEF_BY_RANK[0].toFixed(6)).toBe('0.681429');
    expect(RC_BELIEF_BY_RANK.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 12);
    // and OUTSIDE the table there is no belief, hence no pre-cue (the identity)
    for (const r of [0, -1, 6, 7, 99, 1.5, Number.NaN]) expect(rcBeliefForRank(r)).toBe(0);
  });
});

/* ========================================================================== */
/* G-RANK — RC-C0 §P.A's cue, on constructed geometries                       */
/* ========================================================================== */

describe('RC T0 §G-RANK — the alignment cue (RC-C0 §P.A, byte for byte)', () => {
  const M = (gid: number, x: number, y: number) => ({ gid, x, y });

  it('⭐⭐ the rank is the census\'s: strict argmin, TIES TO THE LOWEST GID, degenerate excluded', () => {
    // passer at the origin facing +x; three mates at 0°, 45°, 180°
    const mates = [M(5, 10, 0), M(6, 10, 10), M(7, -10, 0)];
    expect(alignmentRank(0, 0, 1, 0, mates, 5)).toBe(1);
    expect(alignmentRank(0, 0, 1, 0, mates, 6)).toBe(2);
    expect(alignmentRank(0, 0, 1, 0, mates, 7)).toBe(3);
    // ⭐ TIES: mirrored bodies have IDENTICAL θ ⇒ the LOWEST gid takes the better rank
    const tied = [M(9, 5, 5), M(4, 5, -5)];
    expect(alignmentRank(0, 0, 1, 0, tied, 4)).toBe(1);
    expect(alignmentRank(0, 0, 1, 0, tied, 9)).toBe(2);
    // ⭐ DEGENERATE bodies are EXCLUDED from the vector (they take no rank and cost none):
    // a mate standing ON the passer names no bearing
    const withDegenerate = [M(1, 0, 0), M(2, 10, 10), M(3, 10, 0)];
    expect(alignmentRank(0, 0, 1, 0, withDegenerate, 1)).toBe(0); // no cue for HIM
    expect(alignmentRank(0, 0, 1, 0, withDegenerate, 3)).toBe(1); // and he costs nobody a rank
    expect(alignmentRank(0, 0, 1, 0, withDegenerate, 2)).toBe(2);
    // ⭐ a degenerate HEADING names no angle at all ⇒ nobody has a rank
    for (const gid of [2, 3]) expect(alignmentRank(0, 0, 0, 0, withDegenerate, gid)).toBe(0);
    // ⭐ the heading need not be unit (RC-C0's `cue.headingNotUnit` fixture)
    expect(alignmentRank(0, 0, 7, 0, mates, 5)).toBe(1);
    // a body who is not in the population has no rank
    expect(alignmentRank(0, 0, 1, 0, mates, 42)).toBe(0);
    // ⭐ THE KEEPER IS INCLUDED — he is just another same-side body: put him best-aligned and
    // he takes rank 1 off the outfielders (RC-C0 §P.A's mate population, verbatim)
    const withKeeper = [M(0, 2, 0), M(5, 10, 4)];
    expect(alignmentRank(0, 0, 1, 0, withKeeper, 0)).toBe(1);
    expect(alignmentRank(0, 0, 1, 0, withKeeper, 5)).toBe(2);
  });

  it('⭐ it matches a NAIVE independent re-implementation on random fixtures', () => {
    // an independently-written cue: atan2 difference, wrapped to [0, π] — a different
    // arithmetic route to the same angle, so a transcription slip would show.
    const naiveRank = (
      px: number, py: number, hx: number, hy: number,
      mates: readonly { gid: number; x: number; y: number }[], myGid: number,
    ): number => {
      const theta = (m: { x: number; y: number }): number => {
        const dl = Math.hypot(m.x - px, m.y - py);
        const hl = Math.hypot(hx, hy);
        if (!(dl > 1e-6) || !(hl > 1e-6)) return Number.NaN;
        let d = Math.atan2(m.y - py, m.x - px) - Math.atan2(hy, hx);
        while (d > Math.PI) d -= 2 * Math.PI;
        while (d < -Math.PI) d += 2 * Math.PI;
        return Math.abs(d);
      };
      const me = mates.find((m) => m.gid === myGid);
      if (me === undefined) return 0;
      const tm = theta(me);
      if (!Number.isFinite(tm)) return 0;
      let r = 1;
      for (const m of mates) {
        if (m.gid === myGid) continue;
        const t = theta(m);
        if (!Number.isFinite(t)) continue;
        // ⚠ the two arithmetic routes agree to ~1e-12, not bit for bit, so a near-tie is
        // decided by the gid rule in BOTH implementations rather than by float noise.
        if (Math.abs(t - tm) < 1e-9) { if (m.gid < myGid) r += 1; } else if (t < tm) r += 1;
      }
      return r;
    };
    const rng = new Rng(SEED_D);
    let checked = 0;
    for (let trial = 0; trial < 400; trial++) {
      const px = rng.range(-40, 40);
      const py = rng.range(-25, 25);
      const ang = rng.range(-Math.PI, Math.PI);
      const mates = Array.from({ length: 5 }, (_, i) => ({
        gid: i, x: rng.range(-40, 40), y: rng.range(-25, 25),
      }));
      for (const m of mates) {
        expect(alignmentRank(px, py, Math.cos(ang), Math.sin(ang), mates, m.gid))
          .toBe(naiveRank(px, py, Math.cos(ang), Math.sin(ang), mates, m.gid));
        checked += 1;
      }
    }
    expect(checked).toBe(2000); // non-vacuity: the loop really ran
    // and a rank vector is a PERMUTATION of 1..k when nothing is degenerate
    const mates = Array.from({ length: 5 }, (_, i) => ({
      gid: i * 3, x: 5 + i * 4, y: (i % 2 === 0 ? 1 : -1) * (2 + i),
    }));
    const ranks = mates.map((m) => alignmentRank(0, 0, 1, 0, mates, m.gid)).sort();
    expect(ranks).toEqual([1, 2, 3, 4, 5]);
  });
});

/* ========================================================================== */
/* THE WALK SIDE — G-BITE, G-OPP, G-INITIATOR on world 12's composition       */
/* ========================================================================== */

describe('RC T0 §WALK — armed at weight 1 on world 12\'s composition', () => {
  it('⭐⭐ G-BITE (walk): pre-cued `passRelease` holds appear, SHORTER than the choice tier', () => {
    // ⚠ world 12 with the books BORN ABSENT (`?pcdose=0`) — RC-C0's own form, where the
    // release is met at the CHOICE tier and a pre-cue therefore has something to shorten.
    const m = matchOf(SEED_A, { world: W12, rc: true, weight: 1, emptyBooks: true });
    const holds = walkHolds(m);
    const preCued = holds.filter((h) => h.preCued);
    expect(preCued.length).toBeGreaterThan(0);
    const shortened = preCued.filter((h) => h.ticks < PC_TIER_CHOICE_TICKS);
    expect(shortened.length).toBeGreaterThan(0);
    // every pre-cued hold obeys the law: the class, the relation, the band, and the ticks
    for (const h of preCued) {
      expect(h.klass).toBe('passRelease');
      // the book cell is one of the class's own two `own` cells (open / pressed) and nothing
      // else — the key's shape is `class|pressed?|relation` (`pcRecognitionKey`)
      expect([
        pcRecognitionKey('passRelease', false, 'own'),
        pcRecognitionKey('passRelease', true, 'own'),
      ]).toContain(h.key);
      expect(h.tier).toBe('choice');
      expect(h.ticks).toBe(preCueTicks(PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS, 1, h.belief));
      expect(h.ticks).toBeGreaterThanOrEqual(PC_TIER_SIMPLE_TICKS);
      expect(h.ticks).toBeLessThanOrEqual(PC_TIER_CHOICE_TICKS);
      // the belief is one of the census's own five values, or 0 (a rank the census never saw)
      expect(h.belief === 0 || RC_BELIEF_BY_RANK.includes(h.belief)).toBe(true);
    }
    // the shortest hold reached is the ceiling of record — 17 ticks at rank 1 and w = 1
    expect(Math.min(...preCued.map((h) => h.ticks))).toBe(RC_PRECUE_FLOOR_TICKS);
    // ⭐ NOTHING LEAKED INTO THE GENOME OR THE RESULT (the gene is the only channel)
    expect(JSON.stringify(m.getResult())).not.toContain('rcAnticipation');
    expect(JSON.stringify(m.getResult())).not.toContain('preCue');
    for (const t of m.teams) {
      expect(JSON.stringify(t.info.genome)).toContain('rcAnticipationWeight'); // WE wrote it
      expect((GENE_KEYS as readonly string[])).not.toContain('rcAnticipationWeight');
    }
  }, 60_000);

  it('⭐⭐ G-OPP + G-INITIATOR: only OWN-side non-initiators are ever pre-cued', () => {
    // the gene on side 0 ONLY — so only side-0 bodies can be pre-cued at all, and every
    // pre-cued hold must belong to a body on the PASSER's side (relation `own`).
    const m = matchOf(SEED_B, {
      world: W12, rc: true, weightSideZeroOnly: 1, emptyBooks: true,
    });
    const holds = walkHolds(m);
    const preCued = holds.filter((h) => h.preCued);
    expect(preCued.length).toBeGreaterThan(0);
    const side0 = new Set(m.teams[0].players.map((p) => p.gid));
    for (const h of preCued) {
      expect(side0.has(h.gid)).toBe(true);
      expect(h.key.endsWith('|own')).toBe(true);
    }
    // ⭐ STRUCTURAL, at the LIVE call site: the branch's own conjuncts (canon: a src-extracted
    // constant pins its extraction to the NAMED call site — anchored match + line receipt —
    // never first-occurrence).
    expect(linesOf(matchSource,
      "        if (this.rcAnticipate && w.klass === 'passRelease' && w.rel === 'own'")).toBe(1);
    expect(linesOf(matchSource, '          && w.initiatorGid !== null) {')).toBe(1);
    // ⭐ G-INITIATOR: the passer is excluded before any of this — the UNCHANGED exclusion,
    // and `passRelease`'s initiator does not pay (PC_INITIATOR_PAYS, M-PC.4).
    expect(linesOf(matchSource,
      '          if (initiator !== null && p.gid === initiator.gid && !initiatorPays) continue;'))
      .toBe(1);
    expect(pcSource).toContain('  turnover: false, knockRelease: false, deflection: false, passRelease: false,');
  }, 60_000);
});

/* ========================================================================== */
/* CHANNEL CLOSURE — the module's imports, and the LIVE read set at the site  */
/* ========================================================================== */

describe('RC T0 §CHANNEL CLOSURE — the seat is blind, and the read set is pinned', () => {
  it('⭐⭐ the seat module\'s IMPORT LIST is closed (the pcLatency.ts discipline)', () => {
    const imports = [...seatSource.matchAll(/^import [\s\S]*?from '(.*?)';$/gm)]
      .map((mm) => mm[1]);
    expect(imports).toEqual(['./pcLatency']);
    // ⛔ the module's CODE cannot NAME the world, the bodies, the private commitment or the
    // plan. ⚠ Read off the COMMENT-STRIPPED source: the docblock legitimately says which
    // names it may not touch (a forbidden-name scan of the prose would flag its own
    // prohibition), so the scan runs on what the compiler sees.
    const seatCode = seatSource
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
    expect(seatCode).toContain('export function alignmentRank(');
    expect(seatCode).not.toContain('⭐'); // the stripper really did remove the prose
    for (const forbidden of [
      'Match', 'Player', 'TeamBrain', 'pendingPassWindup', 'faceTarget', 'pendingPass',
      'runners', 'arriver', 'overlapper', 'wallRun', 'info.genome', 'Rng', 'rng',
      'Math.random', 'perceivedSnapshot', 'localStorage', 'process.env',
    ]) {
      expect(`${forbidden}:${seatCode.includes(forbidden)}`).toBe(`${forbidden}:false`);
    }
    // the law has ONE home: the seat module RE-EXPORTS pcLatency's function, it does not
    // re-implement it (same function object).
    expect(preCueTicks).toBe(preCueTicksFromPc);
    expect(seatSource).toContain('export { preCueTicks };');
    expect(count(seatSource, /const preCueTicks|function preCueTicks/g)).toBe(0);
  });

  it('⭐⭐ THE LIVE READ SET: the arm-loop call site\'s argument list, anchored with receipts', () => {
    const lines = matchSource.split('\n');
    const at = (needle: string): number => {
      const idx = lines.findIndex((l) => l === needle);
      expect(lines.filter((l) => l === needle).length).toBe(1);
      expect(idx).toBeGreaterThan(0);
      return idx + 1; // 1-based line receipt
    };
    // (1) the ONE arm call, WITH the pre-cue argument — the anchored site
    const armLine = '        seat.arm(gid, p.rosterIdx, side, w.klass, key, this.stepCount, preCue);';
    const armAt = at(armLine);
    expect(count(matchSource, /seat\.arm\(/g)).toBe(1);
    // (2) THE READ SET, line by line — the initiator's EXTERNAL body state, the mates'
    // EXTERNAL fields, the arming body's gid, and the team's own gene. NOTHING ELSE.
    const readSet = [
      '          const initiator = players[w.initiatorGid] as Player | undefined;',
      '          const weight = rcAnticipationWeightOf(this.teams[side].effGenome);',
      '                if (q.gid === initiator.gid || q.side !== initiator.side || q.sentOff) continue;',
      '                mates.push({ gid: q.gid, x: q.pos.x, y: q.pos.y });',
      '            const rank = alignmentRank(',
      '              initiator.pos.x, initiator.pos.y, initiator.heading.x, initiator.heading.y,',
      '              mates, p.gid,',
      '            );',
      '            preCue = { belief: rcBeliefForRank(rank), weight };',
    ];
    const receipts = readSet.map(at);
    for (let i = 1; i < receipts.length; i++) expect(receipts[i]).toBeGreaterThan(receipts[i - 1]);
    expect(armAt).toBeGreaterThan(receipts[receipts.length - 1]);
    // (3) ⛔ THE FORBIDDEN CHANNELS never appear in the seam's own block (the whole span from
    // the pre-cue declaration to the arm call).
    const blockStart = matchSource.indexOf(
      '        let preCue: { belief: number; weight: number } | null = null;',
    );
    expect(blockStart).toBeGreaterThan(0);
    const block = matchSource.slice(blockStart, matchSource.indexOf(armLine) + armLine.length);
    for (const forbidden of [
      'pendingPassWindup', 'faceTarget', 'pendingPass', 'runners', 'arriver', 'overlapper',
      'wallRun', 'info.genome', 'scores', 'aim', 'targetGid', 'this.rng',
    ]) {
      expect(`${forbidden}:${block.includes(forbidden)}`).toBe(`${forbidden}:false`);
    }
    // (4) the ONE fork on the flag, and the ONE gene read
    expect(count(matchSource, /this\.rcAnticipate/g)).toBe(2); // the initialiser + the fork
    expect(count(matchSource, /rcAnticipationWeightOf\(/g)).toBe(1);
  });
});

/* ========================================================================== */
/* §SEAM MAP                                                                  */
/* ========================================================================== */

describe('RC T0 §SEAM MAP — occurrence COUNTS per needle (canon: PC-C0 §CORR item 1)', () => {
  it('⭐⭐ THE NEEDLE FAMILY — counted and sited', () => {
    // PREFIX STATED: the seam's whole needle family is the flag `rcAnticipate`, the gene
    // `rcAnticipationWeight` (+ its accessor `rcAnticipationWeightOf` and opt-in
    // `evolveReceiverAnticipation`), the seat's exports (`alignmentRank`, `rcBeliefForRank`,
    // `RC_BELIEF_*`, `RC_PRECUE_FLOOR_TICKS`) and the hold law `preCueTicks` / the `preCue`
    // parameter. No other spelling exists in `src/**`.
    const files = srcFiles('src');
    const SITES = [
      'src/ai/receiverAnticipationSeat.ts', 'src/ai/pcLatency.ts',
      'src/sim/Match.ts', 'src/sim/League.ts', 'src/evolution/genome.ts',
    ];
    const FAMILY = /rcAnticipate|rcAnticipationWeight|rcAnticipationWeightOf|evolveReceiverAnticipation|alignmentRank|rcBeliefForRank|RC_BELIEF|RC_PRECUE|preCueTicks|preCued|preCue/g;
    const FAMILY_I = new RegExp(FAMILY.source, 'gi');
    for (const f of files) {
      const hay = readFileSync(f, 'utf8');
      if (count(hay, FAMILY) > 0) expect(SITES).toContain(f);
      if (!SITES.includes(f)) expect(hay).not.toMatch(FAMILY_I);
    }
    // Match.ts — the config field, the readonly field, the initialiser, the ONE fork, the ONE
    // gene read, the ONE seat-import line, the pre-cue local + its two writes, the arm call
    expect(count(matchSource, /^ {2}rcAnticipate\?: boolean;$/gm)).toBe(1);
    expect(count(matchSource, /^ {2}readonly rcAnticipate: boolean;$/gm)).toBe(1);
    expect(count(matchSource, /this\.rcAnticipate = cfg\.rcAnticipate \?\? false;/g)).toBe(1);
    expect(count(matchSource, /this\.rcAnticipate &&/g)).toBe(1);
    expect(count(matchSource,
      /import \{ alignmentRank, rcBeliefForRank \} from '\.\.\/ai\/receiverAnticipationSeat';/g,
    )).toBe(1);
    expect(count(matchSource, /alignmentRank\(/g)).toBe(1); // the ONE call (the import has no `(`)
    expect(count(matchSource, /rcBeliefForRank\(/g)).toBe(1); // the ONE call
    expect(count(matchSource, /alignmentRank/g)).toBe(2); // + the ONE import naming
    expect(count(matchSource, /rcBeliefForRank/g)).toBe(2); // + the ONE import naming
    // the local, its ONE write, and the ONE argument — three sites, enumerated by line below
    expect(count(matchSource, /preCue/g)).toBe(3);
    expect(linesOf(matchSource,
      '        let preCue: { belief: number; weight: number } | null = null;')).toBe(1);
    expect(linesOf(matchSource,
      '            preCue = { belief: rcBeliefForRank(rank), weight };')).toBe(1);
    expect(linesOf(matchSource,
      '        seat.arm(gid, p.rosterIdx, side, w.klass, key, this.stepCount, preCue);')).toBe(1);
    expect(count(matchSource, /preCueTicks/g)).toBe(0); // Match never names the hold law
    // League.ts — the matchFlags key union, and nowhere else
    expect(count(leagueSource, /rcAnticipate/g)).toBe(1);
    // pcLatency.ts — the law (definition + the ONE application), the parameter, the two
    // record fields and the ONE ledger counter
    expect(count(pcSource, /export const preCueTicks = \(/g)).toBe(1);
    expect(count(pcSource, /preCueTicks\(/g)).toBe(1); // the ONE application inside arm()
    expect(count(pcSource, /preCue\?: \{ belief: number; weight: number \} \| null/g)).toBe(1);
    expect(count(pcSource, /^ {2}preCued: boolean;$/gm)).toBe(1);
    expect(count(pcSource, /^ {2}preCuedArms: number;$/gm)).toBe(1);
    expect(count(pcSource, /this\.ledger\.preCuedArms\+\+/g)).toBe(1);
    // genome.ts — the field, the accessor, the MutateOptions field, ONE mutate block, ONE
    // crossover block, and the crossover parameter
    expect(count(genomeSource, /rcAnticipationWeight\?: number;/g)).toBe(1);
    expect(count(genomeSource, /export function rcAnticipationWeightOf\(/g)).toBe(1);
    expect(count(genomeSource, /evolveReceiverAnticipation\?: boolean;/g)).toBe(1);
    expect(count(genomeSource, /opts\.evolveReceiverAnticipation === true/g)).toBe(1);
    expect(count(genomeSource, /if \(evolveReceiverAnticipation\) \{/g)).toBe(1);
    // the seat module — the exports, defined once each
    expect(count(seatSource, /export function alignmentRank\(/g)).toBe(1);
    expect(count(seatSource, /export function rcBeliefForRank\(/g)).toBe(1);
    expect(count(seatSource, /export const RC_BELIEF_BY_RANK/g)).toBe(1);
  });

  it('⭐ the fingerprint of record is a literal in this suite, and the seam may not move it', () => {
    expect(FINGERPRINT_OF_RECORD).toBe(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
    const bare = new Match({ seed: 1, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.rcAnticipate).toBe(false);
    expect(bare.raAccessPrice).toBe(false);
    expect(bare.pcReactionLatency).toBe(false);
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

/* ========================================================================== */
/* G-RNG — the seam draws nothing; the flag-off genome streams are UNMOVED    */
/* ========================================================================== */

describe('RC T0 §G-RNG', () => {
  it('G-RNG: the cue, the table and the hold law draw ZERO rng', () => {
    const m = matchOf(SEED_C, { world: W12, rc: true, weight: 1 });
    for (let i = 0; i < 300; i++) m.step(DT);
    const before = (m.rng as unknown as { s: number }).s;
    let priced = 0;
    const mates = m.teams[0].players.map((p) => ({ gid: p.gid, x: p.pos.x, y: p.pos.y }));
    for (const p of m.teams[0].players) {
      const q = m.teams[1].players[0];
      const rank = alignmentRank(q.pos.x, q.pos.y, q.heading.x, q.heading.y, mates, p.gid);
      preCueTicks(PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS, 1, rcBeliefForRank(rank));
      priced += 1;
    }
    // and an ARMING draws nothing either
    const seat = emptySeat();
    seat.arm(0, 0, 0, 'passRelease', PASS_KEY, 10, { belief: RC_BELIEF_BY_RANK[0], weight: 1 });
    expect(priced).toBeGreaterThan(0);
    expect((m.rng as unknown as { s: number }).s).toBe(before);
  });

  it('G-RNG (genome): with the opt-in OFF the mutate/crossover streams are UNMOVED', () => {
    const streamOf = (evolve: boolean): { genomes: string; state: number } => {
      const rng = new Rng(900_002_050);
      let a = randomGenome(new Rng(1));
      let b = randomGenome(new Rng(2));
      for (let i = 0; i < 8; i++) {
        const child = crossoverGenomes(
          a, b, rng, false, false, false, false, false, false, false, false, false, false,
          evolve,
        );
        a = mutateGenome(child, rng, {
          rate: 0.5, scale: 0.15, evolveReceiverAnticipation: evolve,
        });
        b = mutateGenome(b, rng, { rate: 0.5, scale: 0.15 });
      }
      return { genomes: JSON.stringify([a, b]), state: (rng as unknown as { s: number }).s };
    };
    const off = streamOf(false);
    expect(off.genomes).not.toContain('rcAnticipationWeight');
    const on = streamOf(true);
    expect(on.state).not.toBe(off.state); // the opt-in DOES draw when asked
    expect(on.genomes).toContain('rcAnticipationWeight');
    // flag-off crossover CARRIES parent A's value through with no draw
    const pa = { rcAnticipationWeight: 0.4 } as TacticalGenome;
    const child = crossoverGenomes(pa, randomGenome(new Rng(3)), new Rng(4));
    expect(child.rcAnticipationWeight).toBe(0.4);
  });

  it('⭐⭐ the opt-in draws STRICTLY AFTER every existing block, in BOTH mutate and crossover', () => {
    // ⭐ THE PROOF SHAPE: turn on the LAST pre-existing opt-in (`evolveReceiverAccess`) and
    // compare ONE call with the anticipation opt-in off vs on. If the new draws sat anywhere
    // but LAST, the older gene's drawn value would move.
    const crossOnce = (rc: boolean): TacticalGenome => crossoverGenomes(
      { raAccessWeight: 0.3, rcAnticipationWeight: 0.2 } as TacticalGenome,
      { raAccessWeight: 0.9, rcAnticipationWeight: 0.8 } as TacticalGenome,
      new Rng(900_002_051),
      // 11 flags in signature order; #10 = `evolveReceiverAccess` ON, #11 = this slice's
      false, false, false, false, false, false, false, false, false, true, rc,
    );
    expect(crossOnce(true).raAccessWeight).toBe(crossOnce(false).raAccessWeight);
    expect(crossOnce(false).rcAnticipationWeight).toBe(0.2); // parent A carried, no draw
    expect(crossOnce(true).rcAnticipationWeight).not.toBeUndefined();
    const mutateOnce = (rc: boolean): TacticalGenome => mutateGenome(
      { raAccessWeight: 0.3, rcAnticipationWeight: 0.2 } as TacticalGenome,
      new Rng(900_002_052),
      { rate: 1, scale: 0.2, evolveReceiverAccess: true, evolveReceiverAnticipation: rc },
    );
    expect(mutateOnce(true).raAccessWeight).toBe(mutateOnce(false).raAccessWeight);
    expect(mutateOnce(false).rcAnticipationWeight).toBe(0.2); // untouched, no draw
    expect(mutateOnce(true).rcAnticipationWeight).not.toBe(0.2); // drawn when asked
    // and the source order says the same thing (anchored): the anticipation blocks are LAST
    expect(genomeSource.indexOf('if (opts.evolveReceiverAnticipation === true) {'))
      .toBeGreaterThan(genomeSource.indexOf('if (opts.evolveReceiverAccess === true) {'));
    expect(genomeSource.indexOf('if (evolveReceiverAnticipation) {'))
      .toBeGreaterThan(genomeSource.indexOf('if (evolveReceiverAccess) {'));
  });
});
