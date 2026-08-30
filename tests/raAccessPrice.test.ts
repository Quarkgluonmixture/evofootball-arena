import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { CONTROL_RADIUS, DT } from '../src/sim/constants';
import {
  GENE_KEYS, crossoverGenomes, mutateGenome, raAccessWeightOf, randomGenome,
  type TacticalGenome,
} from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells } from '../src/game/a4World';
import { Rng } from '../src/utils/rng';
import { PTP_FLIGHT_SPEED } from '../src/ai/passLeadSeat';
import {
  RA_CHASE_MIN_SPEED, RA_CHASE_REACTION, RA_FLIGHT_SPEED,
  receiverAccessDeficit, receiverAccessSeatOf,
} from '../src/ai/receiverAccessSeat';

/**
 * ⭐⭐ RA T0 — THE RECEIVER-ACCESS DORMANT SEAM (docs/world-model/RA-T0-DORMANT-SEAM.md;
 * rulings #358 → #359 → #360: the user's reality question re-cut the DX fork, the user
 * elected 「①′ 接应时间入价」, DX-C2's DISCRIMINATES granted the licence, #360 item 3
 * dispatched this seam) — THE SEAM'S PERMANENT PIN SUITE, in the house form
 * (`gcGroundCorridor.test.ts` / `dvDeliveryValue.test.ts`).
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * The pins:
 *   • ⭐⭐ ROAD B DORMANCY (STRONG) — flag ABSENT ≡ flag EXPLICITLY FALSE, byte for byte,
 *     in BOTH world shapes (bare · world 11) × 2 scratch seeds, pooled digest.
 *   • ⭐⭐ THE PROHIBITION SET — NO world and NO preset names the flag OR the gene:
 *     `a4World.ts` contains neither string, `a4MatchFlags` never carries the flag at any
 *     version, a bare match and a League match are false.
 *   • ⭐⭐ G-BORN / G-ZERO / G-INERT / G-BITE — armed-gene-absent ≡ shut (structural);
 *     armed-at-zero ≡ shut with the path LIVE (IEEE-exact); armed at weight 1 with NO
 *     displaced candidate in the world ≡ shut (the term can only touch a displaced aim);
 *     armed at weight 1 WITH the DLC led candidates ⇒ the world genuinely diverges.
 *   • ⭐⭐ THE ACCOUNT LAW ON CONSTRUCTED FIXTURES — DX-C2 §P.A byte for byte: the traced
 *     flight law, `interceptBall`'s own time-to-point form (source lines asserted
 *     VERBATIM), the presence clause on the engine's own `CONTROL_RADIUS`, the
 *     self-delivery GATE, the `max(0, ·)` half-wave.
 *   • ⭐⭐ GROUND ONLY, ONE PRICER — the term is the LAST subtraction of the ONE hoisted
 *     `groundCandidate`; the LOFTED chain never names it.
 *   • ⭐⭐ THE SEAM MAP — occurrence COUNTS per needle, PREFIX stated (canon: a seam-map
 *     gate pins occurrence COUNTS per needle and enumerates EVERY occurrence's site).
 *   • ⭐ NO SERIALIZATION — the flag never reaches a serialized League; the gene is BORN
 *     ABSENT and the flag-off mutate/crossover rng streams are UNMOVED.
 *   • ⭐ THE FINGERPRINT OF RECORD — a literal in this suite; the seam may not move it.
 *
 * ⚠ Every walk in this file lives in the OUT-OF-BAND SCRATCH CLASS (≥ 900,000,000).
 * ZERO frontier consumption.
 */

/** The production fingerprint of record (#305 item 1) — this seam may not move it. */
const FINGERPRINT_OF_RECORD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⚠ OUT-OF-BAND SCRATCH SEEDS (≥ 900,000,000) — no frontier block is consumed. */
const SEED_A = 900_001_300;
const SEED_B = 900_001_301;
const SEED_C = 900_001_302;

const W11 = 11 as const;
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
  ra?: boolean;
  /** pass the door EXPLICITLY as false rather than omitting it (dormancy's other half) */
  raExplicitFalse?: boolean;
  /** the RA gene, written on all three genome views of BOTH teams (#196.3-D6). */
  weight?: number;
  /** the DLC door + its gene — the displaced-candidate supply for G-BITE */
  dlc?: boolean;
  lead?: number;
  world?: 11;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const base = a.world === undefined ? {} : a4MatchFlags(a.world);
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240,
    ...base,
    ...(a.dlc === true ? { dlcDeliveryChoice: true } : {}),
    ...(a.ra === true ? { raAccessPrice: true } : {}),
    ...(a.raExplicitFalse === true ? { raAccessPrice: false } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (a.world !== undefined) armA4World(m, null, a.world, L3_DOSE, PC_DOSE);
  for (const t of m.teams) {
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      if (a.weight !== undefined) g.raAccessWeight = a.weight;
      if (a.lead !== undefined) g.passLeadSupport = a.lead;
    }
  }
  return m;
};

/** The house world-identity signature (PW-T0b's, verbatim via GC-T0). */
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
const brainSource = src('ai/PlayerBrain.ts');
const seatSource = src('ai/receiverAccessSeat.ts');
const matchSource = src('sim/Match.ts');
const leagueSource = src('sim/League.ts');
const genomeSource = src('evolution/genome.ts');
const perceptionSource = src('ai/perception.ts');
const count = (hay: string, needle: RegExp): number => (hay.match(needle) ?? []).length;
const linesOf = (hay: string, line: string): number =>
  hay.split('\n').filter((l) => l === line).length;
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = join(dir, e);
  return statSync(full).isDirectory() ? srcFiles(full) : full.endsWith('.ts') ? [full] : [];
});

/* ========================================================================== */
/* THE FIXTURE BODY — exactly what the deficit reads, and nothing more        */
/* ========================================================================== */

/* eslint-disable @typescript-eslint/no-explicit-any */
const mate = (x: number, y: number, topSpeed: number, gid = 42): any =>
  ({ gid, pos: { x, y }, topSpeed });
const deficitOf = (
  from: { x: number; y: number }, aim: { x: number; y: number }, m: any, kickerGid = 1,
): number => receiverAccessDeficit(from, aim, m, kickerGid);
/* eslint-enable @typescript-eslint/no-explicit-any */

const FROM = { x: -10, y: 0 };

/* ========================================================================== */
/* ROAD B — HYGIENE, THE PROHIBITION SET AND STRONG DORMANCY                  */
/* ========================================================================== */

describe('RA T0 — the receiver-access price is dormant (Road B)', () => {
  it('⭐⭐ THE PROHIBITION SET: no world, no preset and no default names the flag or the gene', () => {
    expect(matchSource).toContain('this.raAccessPrice = cfg.raAccessPrice ?? false;');
    // ⭐ NARROWED, NOT DELETED, by the RA ENTRY (ruling #365; the DF-T0 §P7 form): the entry
    // layer now names the flag and the gene — as world 12's own door and pin and NOWHERE
    // ELSE. Worlds 6–11 still carry nothing (the loop below); world 12 carries them,
    // positively, at the exam pins.
    expect((a4MatchFlags(12 as never) as Record<string, unknown>).raAccessPrice).toBe(true);
    for (const v of [6, 7, 8, 9, 10, 11] as const) {
      expect((a4MatchFlags(v) as Record<string, unknown>).raAccessPrice).toBeUndefined();
      expect(JSON.stringify(a4MatchFlags(v))).not.toContain('raAccessPrice');
    }
    const bare = new Match({ seed: 7, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.raAccessPrice).toBe(false);
    expect(matchOf(SEED_A).raAccessPrice).toBe(false);
    expect(matchOf(SEED_A, { world: W11 }).raAccessPrice).toBe(false);
    const league = new League({ seed: SEED_A });
    expect(league.createMatch(league.nextFixture()!).raAccessPrice).toBe(false);
    // no env door anywhere on a seam line
    for (const f of [
      'src/sim/Match.ts', 'src/sim/League.ts', 'src/ai/receiverAccessSeat.ts',
      'src/ai/PlayerBrain.ts', 'src/evolution/genome.ts',
    ]) {
      for (const line of readFileSync(f, 'utf8').split('\n')) {
        if (!/raAccessPrice|raAccessWeight|receiverAccessDeficit/i.test(line)) continue;
        expect(line).not.toMatch(/envArmed|EDS_BUNDLE_ARMED|process\.env/);
      }
    }
  });

  it('⭐ NO SERIALIZATION: the flag never reaches a serialized League, and the gene stays born absent', () => {
    const league = new League({ seed: SEED_A });
    league.matchFlags = { raAccessPrice: true };
    expect(JSON.stringify(league.toJSON())).not.toContain('raAccessPrice');
    expect((GENE_KEYS as readonly string[])).not.toContain('raAccessWeight');
    const g = randomGenome(new Rng(SEED_A));
    expect(g.raAccessWeight).toBeUndefined();
    expect(receiverAccessSeatOf(g)).toBeNull();
    expect(JSON.stringify(g)).not.toContain('raAccessWeight');
  });

  it('⭐⭐ G-OFF: ABSENT ≡ EXPLICIT-FALSE, both world shapes × 2 seeds, pooled', () => {
    const absent: string[] = [];
    const explicitFalse: string[] = [];
    for (const world of [undefined, W11] as const) {
      for (const seed of [SEED_A, SEED_B]) {
        absent.push(signatureOf(matchOf(seed, { world })));
        explicitFalse.push(signatureOf(matchOf(seed, { world, raExplicitFalse: true })));
      }
    }
    expect(explicitFalse).toEqual(absent);
    expect(digest(explicitFalse)).toBe(digest(absent));
    expect(new Set(absent).size).toBe(4); // one digest per (world × seed) cell
  });

  it('⭐⭐ G-BORN: armed with the gene ABSENT ≡ shut, byte for byte (no seat at all)', () => {
    for (const seed of [SEED_A, SEED_B]) {
      const shut = signatureOf(matchOf(seed));
      const armed = signatureOf(matchOf(seed, { ra: true }));
      expect(armed).toBe(shut);
    }
    const live = matchOf(SEED_A, { ra: true });
    expect(live.raAccessPrice).toBe(true);
    for (const t of live.teams) expect(receiverAccessSeatOf(t.effGenome)).toBeNull();
  });

  it('⭐⭐ G-ZERO: armed with the gene PRESENT AT ZERO ≡ shut, with the path LIVE', () => {
    // ⚠ THE COMPARATOR CARRIES THE SAME GENE (the GC-T0 lesson): both arms hold the gene
    // at 0 so the ONLY difference is the flag.
    const shut: string[] = [];
    const armedZero: string[] = [];
    for (const world of [undefined, W11] as const) {
      for (const seed of [SEED_A, SEED_B]) {
        shut.push(signatureOf(matchOf(seed, { world, weight: 0 })));
        armedZero.push(signatureOf(matchOf(seed, { world, weight: 0, ra: true })));
      }
    }
    expect(armedZero).toEqual(shut);
    expect(digest(armedZero)).toBe(digest(shut));
    const live = matchOf(SEED_A, { ra: true, weight: 0 });
    expect(live.raAccessPrice).toBe(true);
    for (const t of live.teams) {
      for (const g of [t.baseGenome, t.effGenome] as TacticalGenome[]) {
        expect(receiverAccessSeatOf(g)).not.toBeNull();
        expect(receiverAccessSeatOf(g)!.weight).toBe(0);
      }
    }
  });

  it('⭐ THE ZERO POINT IS IEEE-EXACT, not approximate', () => {
    const seat = receiverAccessSeatOf({ raAccessWeight: 0 } as TacticalGenome)!;
    // an aim 8 m beyond a slow mate: the deficit really bites…
    const deficit = deficitOf(FROM, { x: 10, y: 0 }, mate(2, 0, 6));
    expect(deficit).toBeGreaterThan(0);
    // …and the zero-weight price is exactly +0
    const price = seat.weight * deficit * 0.2;
    expect(Object.is(price, 0)).toBe(true);
    for (const s of [0, 0.37, 1.25, -0.5]) expect(s - price).toBe(s);
  });

  it('⭐⭐ G-INERT: armed at weight 1 with NO displaced candidate ≡ shut, byte for byte', () => {
    // In a bare world every priced ground aim is the mate's own feet (dMate = 0 ⇒ the
    // presence clause) or the knock's own point (the self-delivery GATE) — the term can
    // only ever touch a DISPLACED aim, so a world without one is untouched even at full
    // weight. The G-BITE row below is what proves the path can bite at all.
    for (const seed of [SEED_A, SEED_B]) {
      const shut = signatureOf(matchOf(seed, { weight: 1 }));
      const armed = signatureOf(matchOf(seed, { weight: 1, ra: true }));
      expect(armed).toBe(shut);
    }
  });

  it('⭐ G-BITE: with the DLC led candidates in the world, a dosed gene genuinely REPRICES', () => {
    for (const seed of [SEED_C]) {
      const shut = signatureOf(matchOf(seed, { dlc: true, lead: 1, weight: 1 }));
      const dosed = signatureOf(matchOf(seed, { dlc: true, lead: 1, weight: 1, ra: true }));
      expect(dosed).not.toBe(shut);
    }
  });
});

/* ========================================================================== */
/* THE ACCOUNT LAW — DX-C2 §P.A, BYTE FOR BYTE, ON CONSTRUCTED FIXTURES       */
/* ========================================================================== */

describe('RA T0 §ACCOUNT LAW — the DX-C2 §P.A account, on fixtures', () => {
  it('⭐⭐ THE TRACE HOLDS: the constants ARE the traced family, and the source lines exist VERBATIM', () => {
    // the flight law is the banked PTP constant ITSELF, imported — never re-typed
    expect(RA_FLIGHT_SPEED).toBe(PTP_FLIGHT_SPEED);
    expect(RA_FLIGHT_SPEED).toBe(18);
    expect(seatSource).toContain('export const RA_FLIGHT_SPEED = PTP_FLIGHT_SPEED;');
    // interceptBall's own time-to-point form — the ts clamp (1) and the tMe form (2:
    // airborne + ground), asserted on the live source so the family cannot drift
    expect(linesOf(perceptionSource, '  const ts = Math.max(p.topSpeed, 0.1);')).toBe(1);
    expect(count(perceptionSource,
      /const tMe = Math\.sqrt\(dx \* dx \+ dy \* dy\) \/ ts \+ 0\.15;/g)).toBe(2);
    expect(RA_CHASE_REACTION).toBe(0.15);
    expect(RA_CHASE_MIN_SPEED).toBe(0.1);
    // the defence's own half of the same account still ships (#201 / #358 item 3(c))
    expect(src('ai/actionExecutor.ts'))
      .toContain('  const tBall = dist(ballPos, markPos) / MARK_SAG_BALL_SPEED;');
  });

  it('⭐⭐ THE PRESENCE CLAUSE: a mate at the point owes nothing — the engine\'s own control cut', () => {
    // dMate ≤ CONTROL_RADIUS ⇒ exactly 0, even where the raw arithmetic would charge
    expect(deficitOf(FROM, { x: 10, y: 0 }, mate(10, 0, 6))).toBe(0);
    expect(deficitOf(FROM, { x: 10, y: 0 }, mate(10 - CONTROL_RADIUS * 0.999, 0, 0.05))).toBe(0);
    // just OUTSIDE the clause the traced arithmetic takes over, continuously
    const justOut = deficitOf(FROM, { x: 10, y: 0 }, mate(10 - CONTROL_RADIUS * 1.5, 0, 6));
    const dMate = CONTROL_RADIUS * 1.5;
    const want = Math.max(0, (dMate / 6 + RA_CHASE_REACTION) - 20 / RA_FLIGHT_SPEED);
    expect(justOut).toBe(want);
  });

  it('⭐⭐ THE SELF-DELIVERY GATE: a knock (receiver = kicker) is out of scope', () => {
    // the same geometry that charges a TEAMMATE charges the kicker himself NOTHING
    expect(deficitOf(FROM, { x: 10, y: 0 }, mate(2, 0, 6, 99), 99)).toBe(0);
    expect(deficitOf(FROM, { x: 10, y: 0 }, mate(2, 0, 6, 42), 99)).toBeGreaterThan(0);
  });

  it('⭐⭐ THE HALF-WAVE: meetable ⇒ exactly 0; unmeetable ⇒ the account\'s own seconds', () => {
    // a fast mate near the aim: tMate < tBall ⇒ exactly 0 (the max, not a small number)
    expect(deficitOf(FROM, { x: 10, y: 0 }, mate(7, 0, 9))).toBe(0);
    // a slow mate far from the aim: the deficit is EXACTLY tMate − tBall
    const d = deficitOf(FROM, { x: 10, y: 0 }, mate(0, 0, 5));
    expect(d).toBe((10 / 5 + RA_CHASE_REACTION) - 20 / RA_FLIGHT_SPEED);
    // the min-speed clamp keeps a stopped body finite (interceptBall's own guard)
    const stopped = deficitOf(FROM, { x: 10, y: 0 }, mate(6, 0, 0));
    expect(Number.isFinite(stopped)).toBe(true);
    expect(stopped).toBe((4 / RA_CHASE_MIN_SPEED + RA_CHASE_REACTION) - 20 / RA_FLIGHT_SPEED);
  });

  it('⭐ PURE and CHANNEL-CLOSED: the seat module cannot reach the world', () => {
    expect(seatSource).not.toMatch(/^import .*['"]\.\.\/sim\/Match['"];$/m);
    for (const forbidden of ['match.', 'Math.random', 'rng', 'perceptionSnapshot']) {
      expect(seatSource.split('export function receiverAccessDeficit(')[1])
        .not.toContain(forbidden);
    }
  });
});

/* ========================================================================== */
/* GROUND ONLY — the term prices what the ruling says and nothing else        */
/* ========================================================================== */

describe('RA T0 §SCOPE — the term is the ONE pricer\'s LAST subtraction', () => {
  it('⭐⭐ ONE hoisted pricer, ONE deficit call inside it, and the LOFTED chain names nothing', () => {
    expect(count(brainSource, /const groundCandidate = \(/g)).toBe(1);
    expect(count(brainSource, /receiverAccessDeficit\(/g)).toBe(1);
    const pricer = brainSource.split('const groundCandidate = (')[1]
      .split('    for (const mate of team.players) {')[0];
    expect(count(pricer, /receiverAccessDeficit\(/g)).toBe(1);
    // the RA term is the LAST subtraction: the pricer returns its result directly
    expect(pricer).toContain(
      ': sGc - raSeat.weight * receiverAccessDeficit(p.pos, aim, mate, p.gid) * W.passBase;',
    );
    expect(pricer).toContain('return { s: sRa, lane, open, gain, mul };');
    // the LOFTED family names neither the seat nor the deficit
    const lofted = brainSource.split('let sL = (W.loftBase')[1].split('if (sL > bestLoft)')[0];
    expect(lofted).not.toContain('receiverAccessDeficit');
    expect(lofted).not.toContain('raSeat');
  });

  it('⭐ THE ARMING RULE is one fork, one seat, built once per decision', () => {
    expect(linesOf(brainSource,
      '  const raSeat = match.raAccessPrice ? receiverAccessSeatOf(g) : null;')).toBe(1);
    expect(count(brainSource, /match\.raAccessPrice/g)).toBe(1);
    expect(count(seatSource, /export function receiverAccessSeatOf\(/g)).toBe(1);
  });
});

/* ========================================================================== */
/* §SEAM MAP                                                                  */
/* ========================================================================== */

describe('RA T0 §SEAM MAP — occurrence COUNTS per needle (canon: PC-C0 §CORR item 1)', () => {
  it('⭐⭐ THE NEEDLE FAMILY — counted and sited', () => {
    // PREFIX STATED: the seam's whole needle family is the flag `raAccessPrice`, the gene
    // `raAccessWeight` (+ its accessor `raAccessWeightOf` and opt-in
    // `evolveReceiverAccess`), and the seat's two exports. No other spelling exists.
    const files = srcFiles('src');
    // ⭐ NARROWED at the RA ENTRY (ruling #365): the entry layer (a4World + GameApp) now
    // legitimately names the family; the SEAM itself still lives only in the five original
    // sites — the entry sites arm, they never re-implement.
    const SITES = [
      'src/ai/receiverAccessSeat.ts', 'src/ai/PlayerBrain.ts',
      'src/sim/Match.ts', 'src/sim/League.ts', 'src/evolution/genome.ts',
      'src/game/a4World.ts', 'src/game/GameApp.ts',
    ];
    const FAMILY = /raAccessPrice|raAccessWeight|receiverAccessDeficit|receiverAccessSeatOf|evolveReceiverAccess/g;
    const FAMILY_I = /raAccessPrice|raAccessWeight|receiverAccessDeficit|receiverAccessSeatOf|evolveReceiverAccess/gi;
    for (const f of files) {
      const hay = readFileSync(f, 'utf8');
      if (count(hay, FAMILY) > 0) expect(SITES).toContain(f);
      expect(count(hay, FAMILY_I)).toBe(count(hay, FAMILY));
    }
    for (const f of files) {
      if (SITES.includes(f)) continue;
      expect(readFileSync(f, 'utf8')).not.toMatch(FAMILY_I);
    }
    // Match.ts — the config field, the readonly field, and the `this.`/`cfg.` pair, plus
    // the config docblock's ONE mention of the gene by name
    expect(count(matchSource, /^ {2}raAccessPrice\?: boolean;$/gm)).toBe(1);
    expect(count(matchSource, /^ {2}readonly raAccessPrice: boolean;$/gm)).toBe(1);
    expect(count(matchSource, /this\.raAccessPrice = cfg\.raAccessPrice \?\? false;/g)).toBe(1);
    // League.ts — the matchFlags key union, and nowhere else
    expect(count(leagueSource, /raAccessPrice/g)).toBe(1);
    // PlayerBrain.ts — ONE flag fork, ONE import line, ONE deficit call
    expect(count(brainSource, /match\.raAccessPrice/g)).toBe(1);
    expect(count(brainSource, /receiverAccessDeficit\(/g)).toBe(1);
    expect(count(brainSource,
      /import \{ receiverAccessSeatOf, receiverAccessDeficit \} from '\.\/receiverAccessSeat';/g,
    )).toBe(1);
    // genome.ts — the field, the accessor (definition + one docblock naming), the
    // MutateOptions field, ONE mutate block, ONE crossover block
    expect(count(genomeSource, /raAccessWeight\?: number;/g)).toBe(1);
    expect(count(genomeSource, /export function raAccessWeightOf\(/g)).toBe(1);
    expect(count(genomeSource, /evolveReceiverAccess\?: boolean;/g)).toBe(1);
    expect(count(genomeSource, /opts\.evolveReceiverAccess === true/g)).toBe(1);
    expect(count(genomeSource, /if \(evolveReceiverAccess\) \{/g)).toBe(1);
    // the seat module — the two exports, defined once each
    expect(count(seatSource, /export function receiverAccessDeficit\(/g)).toBe(1);
    expect(count(seatSource, /export function receiverAccessSeatOf\(/g)).toBe(1);
  });

  it('⭐ the fingerprint of record is a literal in this suite, and the seam may not move it', () => {
    expect(FINGERPRINT_OF_RECORD).toBe(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
    const bare = new Match({ seed: 1, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.raAccessPrice).toBe(false);
    expect(bare.bkGroundCorridor).toBe(false);
    expect(bare.dvDeliveryValue).toBe(false);
  });
});

/* ========================================================================== */
/* G-RNG — the seam draws nothing; the flag-off genome streams are UNMOVED    */
/* ========================================================================== */

describe('RA T0 §G-RNG', () => {
  it('G-RNG: an armed, dosed access price draws ZERO rng', () => {
    const m = matchOf(SEED_C, { ra: true, weight: 1 });
    for (let i = 0; i < 300; i++) m.step(DT);
    const before = (m.rng as unknown as { s: number }).s;
    let priced = 0;
    for (const p of m.teams[0].players) {
      for (const o of m.teams[0].players) {
        if (o === p) continue;
        receiverAccessDeficit(p.pos, o.pos, o, p.gid);
        priced += 1;
      }
    }
    expect(priced).toBeGreaterThan(0);
    expect((m.rng as unknown as { s: number }).s).toBe(before);
  });

  it('G-RNG (genome): with the opt-in OFF the mutate/crossover streams are UNMOVED', () => {
    const streamOf = (evolve: boolean): { genomes: string; state: number } => {
      const rng = new Rng(900_001_303);
      let a = randomGenome(new Rng(1));
      let b = randomGenome(new Rng(2));
      for (let i = 0; i < 8; i++) {
        const child = crossoverGenomes(
          a, b, rng, false, false, false, false, false, false, false, false, false, evolve,
        );
        a = mutateGenome(child, rng, { rate: 0.5, scale: 0.15, evolveReceiverAccess: evolve });
        b = mutateGenome(b, rng, { rate: 0.5, scale: 0.15 });
      }
      return {
        genomes: JSON.stringify([a, b]),
        state: (rng as unknown as { s: number }).s,
      };
    };
    const off = streamOf(false);
    expect(off.genomes).not.toContain('raAccessWeight');
    const on = streamOf(true);
    expect(on.state).not.toBe(off.state); // the opt-in DOES draw when asked
    expect(on.genomes).toContain('raAccessWeight');
    // the accessor clamps and zero-guards (the dvExposureWeightOf law, verbatim)
    expect(raAccessWeightOf({} as TacticalGenome)).toBe(0);
    expect(raAccessWeightOf({ raAccessWeight: Number.NaN } as TacticalGenome)).toBe(0);
    expect(raAccessWeightOf({ raAccessWeight: 2 } as TacticalGenome)).toBe(1);
    expect(raAccessWeightOf({ raAccessWeight: -1 } as TacticalGenome)).toBe(0);
    // flag-off crossover CARRIES parent A's value through with no draw
    const pa = { raAccessWeight: 0.4 } as TacticalGenome;
    const child = crossoverGenomes(pa, randomGenome(new Rng(3)), new Rng(4));
    expect(child.raAccessWeight).toBe(0.4);
  });
});
