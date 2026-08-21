import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import {
  BALL_RADIUS, DT, GRAVITY, HEADER_MIN_HEIGHT, PLAYER_CORE_RADIUS,
} from '../src/sim/constants';
import { GENE_KEYS, randomGenome, type TacticalGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import {
  a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells,
} from '../src/game/a4World';
import { Rng } from '../src/utils/rng';
import {
  BK_CORRIDOR_FAMILIES, DV_CLEAR_RADIUS, DV_CORRIDOR_SCALE, DV_FLIGHT_SPEED,
  bkCorridorClearsBody, bkCorridorFlightOf, bkCorridorHazard, bkCorridorHeightAt,
  bkCorridorPriceOf, deliveryValueSeatOf, flightExposure, type BkCorridorFamily,
} from '../src/ai/deliveryValueSeat';

/**
 * BK T3 — THE CORRIDOR-HAZARD SLICE (docs/world-model/BK-T3-CORRIDOR-HAZARD.md; ruling
 * #333 item 5, the design pick ratified at #331 item 3, serving the USER MANDATE of
 * #328/#330) — THE SEAM'S PERMANENT PIN SUITE, in the house form (`dvDeliveryValue.test.ts`
 * / `inLookAct.test.ts` / `dfSurface.test.ts`).
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * The pins:
 *   • ⭐⭐ ROAD B DORMANCY (STRONG) — flag ABSENT ≡ flag EXPLICITLY FALSE ≡ ARMED AT GENE
 *     ZERO, byte for byte, BOTH world shapes × 2 seeds (pooled digest); the zero point is
 *     IEEE-exact, not approximate.
 *   • ⭐⭐ THE PRICE LAW ON CONSTRUCTED FIXTURES — a body UNDER the arc inside his own
 *     strike shell prices; a body the flight passes ENTIRELY over does not; a body off the
 *     corridor does not; the gate's boundary REPRODUCES BK-C1's published `x_clear` closed
 *     form; and the hazard DEGENERATES exactly onto the shipped `flightExposure` when the
 *     flight clears nobody.
 *   • ⭐⭐ EVERY CONSTANT ANCHORED — the four family tuples are extracted from the NAMED
 *     `loftKick` call sites (canon: "a src-extracted constant pins its extraction to the
 *     NAMED call site — anchored match + line receipt — never first-occurrence"); the
 *     strike surface's edge and shell from their own named lines; the CROSS family is
 *     provably ABSENT (BK-C1 §R8's honest exclusion).
 *   • ⭐⭐ EXTEND, NOT DUPLICATE — ONE corridor loop (`flightExposure`, `aloft === null` ⇒
 *     HEAD's arithmetic); the hand throw's shipped `laneOpenness` factor is untouched and
 *     NO second lane term is added anywhere; the DV pricer's own call site still stands
 *     alone.
 *   • ⭐ NO SERIALIZATION — the flag never reaches a serialized League (canon, VERBATIM:
 *     "WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits matchFlags; true
 *     since #155, stated now, test-pinned; refines #270's E4 correction; matches the perf
 *     diagnostic)" — home: ruling #283.2(iv)), and the gene it rides is still born absent.
 *   • ⭐⭐ COMPOSITION — the world-9 + `dfAssignPersist` + `dfSurface` + `inSnapshotLaw` +
 *     `inLookAct` stack: armed-at-zero ≡ shut byte for byte, dosed is a distinct world,
 *     lifecycle clean (a stated economical subset).
 *   • ⭐⭐ THE SEAM MAP — occurrence COUNTS per needle, PREFIX stated (canon: PC-C0 §CORR 1).
 *   • ⛔ #328 item 3 — no default arc raised: no launch parameterization line moves, and
 *     the seam names no `loftKick` argument in `mechanics.ts` at all.
 */

/** The production fingerprint of record (#305 item 1) — this seam may not move it. */
const FINGERPRINT_OF_RECORD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⚠ These seeds are BK-T3's own in-band smoke prefix (ruling #333 item 5: 12,517,000–999). */
const SEED_A = 12_517_800;
const SEED_B = 12_517_801;
const SEED_C = 12_517_802;

const W8 = 8 as const;
const W9 = 9 as const;

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
  bk?: boolean;
  /** pass the door EXPLICITLY as false rather than omitting it (dormancy's other half) */
  bkExplicitFalse?: boolean;
  /** the DV exposure gene: `undefined` ⇒ BORN ABSENT (no key written at all) */
  weight?: number;
  /** the neighbour doors of the composition stack */
  dv?: boolean;
  df?: boolean;
  dfs?: boolean;
  in?: boolean;
  look?: boolean;
  world?: 8 | 9;
  duration?: number;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const base = a.world === undefined ? {} : a4MatchFlags(a.world);
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...(a.duration === undefined ? {} : { duration: a.duration }),
    ...base,
    ...(a.bk === true ? { bkCorridorPrice: true } : {}),
    ...(a.bkExplicitFalse === true ? { bkCorridorPrice: false } : {}),
    ...(a.dv === true ? { dvDeliveryValue: true } : {}),
    ...(a.df === true ? { dfAssignPersist: true } : {}),
    ...(a.dfs === true ? { dfSurface: true } : {}),
    ...(a.in === true ? { inSnapshotLaw: true } : {}),
    ...(a.look === true ? { inLookAct: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (a.world !== undefined) armA4World(m, null, a.world, L3_DOSE, PC_DOSE);
  // THE ARMING CHECKLIST (#196.3-D6): all three genome views of BOTH teams.
  if (a.weight !== undefined) {
    for (const t of m.teams) {
      for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
        g.dvExposureWeight = a.weight;
      }
    }
  }
  return m;
};

/** The house world-identity signature (PW-T0b's, verbatim via PC-T0, BK-T0/T1, DF, IN). */
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

const src = (rel: string): string =>
  readFileSync(new URL(`../src/${rel}`, import.meta.url), 'utf8');
const brainSource = src('ai/PlayerBrain.ts');
const seatSource = src('ai/deliveryValueSeat.ts');
const matchSource = src('sim/Match.ts');
const mechSource = src('sim/mechanics.ts');
const leagueSource = src('sim/League.ts');
const count = (hay: string, needle: RegExp): number => (hay.match(needle) ?? []).length;
const linesOf = (hay: string, line: string): number =>
  hay.split('\n').filter((l) => l === line).length;
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = join(dir, e);
  return statSync(full).isDirectory() ? srcFiles(full) : full.endsWith('.ts') ? [full] : [];
});

/**
 * ⭐ CODE LINES ONLY (the IN-T1 idiom, and canon "text-census corpus integrity", home:
 * IN-C0 §CORR item 2): prose may NAME what code may not touch. The stripper is
 * LINE-CLASSED so the #317 phantom-block bug cannot occur, and the classification is
 * asserted for every line of the file it is applied to.
 */
const codeLinesOf = (source: string): string => {
  const lines = source.split('\n');
  for (const l of lines) {
    const t = l.trim();
    const isCommentLine = t.startsWith('*') || t.startsWith('/*') || t.startsWith('//');
    if (!isCommentLine) expect(l.includes('/*') || l.includes('*/')).toBe(false);
  }
  return lines.filter((l) => {
    const t = l.trim();
    return !(t.startsWith('*') || t.startsWith('/*') || t.startsWith('//'));
  }).join('\n');
};

/** A frozen body-shaped stub: exactly what the corridor loop reads, and nothing more. */
const body = (x: number, y: number, topSpeed = 0, sentOff = false): {
  pos: { x: number; y: number }; topSpeed: number; sentOff: boolean; coreRadius: number;
} => ({ pos: { x, y }, topSpeed, sentOff, coreRadius: PLAYER_CORE_RADIUS });
/* eslint-disable @typescript-eslint/no-explicit-any */
const hazardOf = (
  from: { x: number; y: number }, aim: { x: number; y: number }, os: any[],
  family: BkCorridorFamily,
) => bkCorridorHazard(from, aim, os, family);
const exposureOf = (
  from: { x: number; y: number }, aim: { x: number; y: number }, os: any[],
) => flightExposure(from, aim, os);
/* eslint-enable @typescript-eslint/no-explicit-any */

const SHELL = PLAYER_CORE_RADIUS + BALL_RADIUS;

/* ========================================================================== */
/* ROAD B — HYGIENE AND STRONG DORMANCY                                       */
/* ========================================================================== */

describe('BK T3 — the corridor-hazard price is dormant (Road B)', () => {
  it('HYGIENE: the flag is an explicit hard false, absent from a4World and every default', () => {
    expect(matchSource).toContain('this.bkCorridorPrice = cfg.bkCorridorPrice ?? false;');
    const a4 = src('game/a4World.ts');
    expect(a4).not.toContain('bkCorridorPrice');
    expect(JSON.stringify(a4MatchFlags(W9))).not.toContain('bkCorridorPrice');
    expect(JSON.stringify(a4MatchFlags(W8))).not.toContain('bkCorridorPrice');
    expect(matchOf(SEED_A).bkCorridorPrice).toBe(false);
    expect(matchOf(SEED_A, { world: W9 }).bkCorridorPrice).toBe(false);
    const league = new League({ seed: SEED_A });
    expect(league.createMatch(league.nextFixture()!).bkCorridorPrice).toBe(false);
    // no env door anywhere on a seam line
    for (const f of [
      'src/sim/Match.ts', 'src/sim/League.ts', 'src/ai/deliveryValueSeat.ts',
      'src/ai/PlayerBrain.ts',
    ]) {
      for (const line of readFileSync(f, 'utf8').split('\n')) {
        if (!/bkCorridor|BK_CORRIDOR/i.test(line)) continue;
        expect(line).not.toMatch(/envArmed|EDS_BUNDLE_ARMED|process\.env/);
      }
    }
  });

  it('⭐ NO SERIALIZATION: the flag never reaches a serialized League, and the gene stays born absent', () => {
    // CANON, VERBATIM (home: ruling #283.2(iv)): "WORKER-SIMMED fixtures play the SHIPPED
    // world (League.toJSON omits matchFlags; true since #155, stated now, test-pinned;
    // refines #270's E4 correction; matches the perf diagnostic)".
    const league = new League({ seed: SEED_A });
    league.matchFlags = { bkCorridorPrice: true };
    expect(JSON.stringify(league.toJSON())).not.toContain('bkCorridorPrice');
    // the gene this seam rides is the DV seat's own, and it is still outside GENE_KEYS
    expect((GENE_KEYS as readonly string[])).not.toContain('dvExposureWeight');
    const g = randomGenome(new Rng(SEED_A));
    expect(g.dvExposureWeight).toBeUndefined();
    expect(deliveryValueSeatOf(g)).toBeNull();
    expect(JSON.stringify(g)).not.toContain('dvExposureWeight');
  });

  it('⭐⭐ ROAD B DORMANCY (STRONG): ABSENT ≡ EXPLICIT-FALSE ≡ ARMED-AT-GENE-ZERO, both worlds × 2 seeds, pooled', () => {
    const pool: string[] = [];
    for (const world of [undefined, W9] as const) {
      for (const seed of [SEED_A, SEED_B]) {
        const shut = signatureOf(matchOf(seed, { world, duration: 240 }));
        const explicitFalse = signatureOf(
          matchOf(seed, { world, duration: 240, bkExplicitFalse: true }),
        );
        const bornAbsent = signatureOf(matchOf(seed, { world, duration: 240, bk: true }));
        const armedZero = signatureOf(
          matchOf(seed, { world, duration: 240, bk: true, weight: 0 }),
        );
        expect(explicitFalse).toBe(shut);
        expect(bornAbsent).toBe(shut); // armed, gene ABSENT ⇒ no seat at all
        expect(armedZero).toBe(shut); // armed, gene PRESENT AT ZERO ⇒ the path is LIVE
        pool.push(shut, explicitFalse, bornAbsent, armedZero);
      }
    }
    // the code path really is live in the armed-zero arm (a seat exists on every view)
    const live = matchOf(SEED_A, { bk: true, weight: 0 });
    expect(live.bkCorridorPrice).toBe(true);
    for (const t of live.teams) expect(deliveryValueSeatOf(t.effGenome)).not.toBeNull();
    expect(new Set(pool).size).toBe(4); // one digest per (world × seed) cell, nothing else
  });

  it('⭐ THE ZERO POINT IS IEEE-EXACT, not approximate', () => {
    const seat = deliveryValueSeatOf({ dvExposureWeight: 0 } as TacticalGenome)!;
    const os = [body(0, 0.4, 8), body(6, 1.2, 7)];
    for (const family of Object.values(BK_CORRIDOR_FAMILIES)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const price = bkCorridorPriceOf(seat, { x: -20, y: 0 }, { x: 20, y: 0 }, os as any, family);
      expect(Object.is(price, 0)).toBe(true); // exactly +0, not merely ≈ 0
      for (const s of [0, 0.37, 1.25, -0.5]) expect(s - price).toBe(s);
    }
  });

  it('⭐ G-BITE: a dosed gene genuinely REPRICES — the armed world diverges, both world shapes', () => {
    for (const world of [undefined, W9] as const) {
      const shut = signatureOf(matchOf(SEED_C, { world, duration: 240 }));
      const dosed = signatureOf(matchOf(SEED_C, { world, duration: 240, bk: true, weight: 1 }));
      expect(dosed).not.toBe(shut);
    }
  });
});

/* ========================================================================== */
/* THE PRICE LAW — CONSTRUCTED FIXTURES                                       */
/* ========================================================================== */

describe('BK T3 §PRICE LAW — the height-aware corridor hazard, on fixtures', () => {
  it('⭐⭐ THE FAMILY TUPLES ARE ANCHORED to the NAMED `loftKick` call sites', () => {
    // canon, VERBATIM (home: BK-C0 §CORR item 1): "a src-extracted constant pins its
    // extraction to the NAMED call site — anchored match + line receipt — never
    // first-occurrence".
    const lines = mechSource.split('\n');
    const tupleAt = (fn: string): { tuple: number[]; line: number } => {
      const start = lines.findIndex((l) => l.startsWith(`export function ${fn}(`));
      expect(start).toBeGreaterThan(0);
      for (let i = start + 1; i < lines.length; i++) {
        // never leave the named body
        if (lines[i].startsWith('export function ')) break;
        if (!lines[i].includes('loftKick(')) continue;
        const nums = (lines[i].match(/-?\d+\.\d+|-?\d+/g) ?? []).map(Number);
        expect(nums.length).toBeGreaterThanOrEqual(5); // tBase tPerM tMin tMax noiseMul
        return { tuple: nums.slice(0, 4), line: i + 1 };
      }
      throw new Error(`no loftKick call inside ${fn}`);
    };
    const asTuple = (f: BkCorridorFamily): number[] => [f.tBase, f.tPerM, f.tMin, f.tMax];
    const loft = tupleAt('performLoftedPass');
    const throwOut = tupleAt('performKeeperThrow');
    const dink = tupleAt('performThroughBall');
    expect(asTuple(BK_CORRIDOR_FAMILIES.loft)).toEqual(loft.tuple);
    expect(asTuple(BK_CORRIDOR_FAMILIES.keeperThrow)).toEqual(throwOut.tuple);
    expect(asTuple(BK_CORRIDOR_FAMILIES.dink)).toEqual(dink.tuple);
    // the LINE RECEIPTS of record (BK-C1 §R2's own sites; re-anchored, never trusted)
    expect(lines[loft.line - 1]).toContain('loftKick(match, passer, lead, 0.55, 0.033, 1.1, 2.1, 0.9, swing);');
    expect(lines[throwOut.line - 1]).toContain('loftKick(match, gk, lead, 0.62, 0.03, 0.9, 1.5, 0.45);');
    expect(lines[dink.line - 1]).toContain('loftKick(match, passer, lead, 0.55, 0.045, 0.8, 2.0, 1.0, swing);');
    // the needle count of record (canon: needle-occurrence counts) — 1 declaration + 4 calls
    expect(count(mechSource, /loftKick\(/g)).toBe(5);
    // ⛔ THE CROSS FAMILY IS ABSENT — BK-C1 §R8's honest exclusion, provably. Its call
    // site is the ONE whose tMin is not even a literal (BK-C1 §R2's † — `tMinCross`), so
    // it is identified by its own (tBase, tPerM) pair, which no family here carries.
    const crossLine = lines.findIndex((l) => l.includes('loftKick(match, crosser,'));
    expect(crossLine).toBeGreaterThan(0);
    expect(lines[crossLine]).toContain('loftKick(match, crosser, spot, 0.5, 0.038, tMinCross, 1.7, 1.1, spin);');
    for (const f of Object.values(BK_CORRIDOR_FAMILIES)) {
      expect([f.tBase, f.tPerM]).not.toEqual([0.5, 0.038]);
    }
    expect(Object.keys(BK_CORRIDOR_FAMILIES)).toEqual(['loft', 'keeperThrow', 'dink']);
  });

  it('⭐⭐ THE STRIKE SURFACE IS ANCHORED — the armed edge and the contact shell, own lines', () => {
    expect(linesOf(
      matchSource,
      '    const aerialOnly = this.bkContactLaw ? ball.z >= HEADER_MIN_HEIGHT : ball.z > CONTROL_MAX_HEIGHT;',
    )).toBe(1);
    expect(count(matchSource, /const shell = p\.coreRadius \+ ball\.radius;/g)).toBe(1);
    expect(HEADER_MIN_HEIGHT).toBe(1.35);
    expect(SHELL).toBe(0.635);
    // and the price reads the BODY's own core plus the ball's own radius, not a literal
    expect(codeLinesOf(seatSource)).toContain('const shell = body.coreRadius + BALL_RADIUS;');
  });

  it('⭐⭐ THE FLIGHT AND ITS HEIGHT — `loftKick`\'s own clamp and BK-C1\'s closed form', () => {
    for (const family of Object.values(BK_CORRIDOR_FAMILIES)) {
      for (const d of [4, 8, 16, 24, 30, 42, 48, 60, 90]) {
        const f = bkCorridorFlightOf(family, d);
        expect(f.d).toBe(d);
        expect(f.T).toBe(Math.min(Math.max(family.tBase + d * family.tPerM, family.tMin), family.tMax));
        // the apex is `g·T²/8` at half distance, and both ends are on the grass
        expect(bkCorridorHeightAt(0, f)).toBe(0);
        expect(bkCorridorHeightAt(d, f)).toBeCloseTo(0, 12);
        expect(bkCorridorHeightAt(d / 2, f)).toBeCloseTo((GRAVITY * f.T * f.T) / 8, 12);
        // symmetry, and the parabola the census published
        for (const u of [0.1, 0.25, 0.4]) {
          expect(bkCorridorHeightAt(u * d, f)).toBeCloseTo(bkCorridorHeightAt((1 - u) * d, f), 12);
          expect(bkCorridorHeightAt(u * d, f)).toBeCloseTo(
            4 * ((GRAVITY * f.T * f.T) / 8) * u * (1 - u), 12,
          );
        }
      }
    }
    // the punt of record: d = 48 ⇒ T is AT the family cap and the apex is BK-C1's 5.408 m
    const punt = bkCorridorFlightOf(BK_CORRIDOR_FAMILIES.loft, 48);
    expect(punt.T).toBe(2.1);
    expect(bkCorridorHeightAt(24, punt)).toBeCloseTo(5.408, 3);
  });

  it('⭐⭐ THE GATE REPRODUCES BK-C1\'s PUBLISHED `x_clear` CLOSED FORM', () => {
    // BK-C1 §R3: `x_clear = (d/2)·(1 − sqrt(1 − h/apex))`, the along-line distance at which
    // the ball first reaches head height. A body clears iff his NEAR shell edge is beyond
    // it (and, symmetrically, his FAR edge is before the descent's own crossing).
    for (const [family, d] of [
      [BK_CORRIDOR_FAMILIES.loft, 48], [BK_CORRIDOR_FAMILIES.loft, 30],
      [BK_CORRIDOR_FAMILIES.dink, 24], [BK_CORRIDOR_FAMILIES.keeperThrow, 20],
    ] as const) {
      const f = bkCorridorFlightOf(family, d);
      const apex = (GRAVITY * f.T * f.T) / 8;
      if (apex <= HEADER_MIN_HEIGHT) {
        // a flight that never reaches head height clears NOBODY, anywhere on the line
        for (const along of [2, 5, 10, d / 2]) {
          expect(bkCorridorClearsBody(f, along, body(0, 0) as never)).toBe(false);
        }
        continue;
      }
      const xClear = (d / 2) * (1 - Math.sqrt(1 - HEADER_MIN_HEIGHT / apex));
      // the boundary of record: cleared ⇔ along − shell ≥ x_clear (near side)
      expect(bkCorridorClearsBody(f, xClear + SHELL + 1e-6, body(0, 0) as never)).toBe(true);
      expect(bkCorridorClearsBody(f, xClear + SHELL - 1e-6, body(0, 0) as never)).toBe(false);
      // …and the DESCENT half is the same crossing mirrored
      expect(bkCorridorClearsBody(f, d - xClear - SHELL - 1e-6, body(0, 0) as never)).toBe(true);
      expect(bkCorridorClearsBody(f, d - xClear - SHELL + 1e-6, body(0, 0) as never)).toBe(false);
    }
  });

  it('⭐⭐ THE PRICE LAW: under the arc PRICES, over the flight does NOT, off the corridor does NOT', () => {
    const from = { x: -24, y: 0 };
    const aim = { x: 24, y: 0 }; // d = 48, the punt of record
    const family = BK_CORRIDOR_FAMILIES.loft;
    const f = bkCorridorFlightOf(family, 48);
    const apex = (GRAVITY * f.T * f.T) / 8;
    const xClear = 24 * (1 - Math.sqrt(1 - HEADER_MIN_HEIGHT / apex));
    // (a) a body ON the line, INSIDE the climb-out — the user's own pattern — PRICES
    const under = body(from.x + xClear - 0.2, 0, 0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hUnder = hazardOf(from, aim, [under] as any, family);
    expect(hUnder).toBeGreaterThan(0);
    expect(hUnder).toBe(exposureOf(from, aim, [under] as never)); // he is on the line, so it IS the shipped exposure
    // (b) the SAME body one shell further out — the flight is over his head — prices ZERO
    const over = body(from.x + xClear + SHELL + 0.2, 0, 0);
    expect(hazardOf(from, aim, [over] as never, family)).toBe(0);
    expect(exposureOf(from, aim, [over] as never)).toBeGreaterThan(0); // …and the height-BLIND read charges him
    // (c) a body under the arc but OFF the corridor prices zero (the inherited scale)
    const wide = body(from.x + xClear - 0.2, DV_CORRIDOR_SCALE + 0.01, 0);
    expect(hazardOf(from, aim, [wide] as never, family)).toBe(0);
    // (d) the guards are the inherited ones: sent off, and at the kicker's feet
    expect(hazardOf(from, aim, [body(from.x + 1, 0, 0, true)] as never, family)).toBe(0);
    expect(hazardOf(from, aim, [body(from.x + DV_CLEAR_RADIUS - 0.01, 0, 0)] as never, family)).toBe(0);
    // (e) no bodies at all ⇒ exactly zero
    expect(hazardOf(from, aim, [], family)).toBe(0);
    // (f) A BODY AT THE DROP is never cleared — the ball IS on the grass there
    expect(hazardOf(from, aim, [body(aim.x - 0.3, 0, 0)] as never, family)).toBeGreaterThan(0);
    // (g) THE DEGENERATE FLIGHT GUARD, pinned by direct call (an exported contract): a
    // zero-length delivery clears nobody. (Unreachable through the hazard itself — the
    // inherited clear-the-kicker guard fires first — so it is pinned HERE, not by proxy.)
    expect(bkCorridorClearsBody({ d: 0, T: 1 }, 0, body(0, 0) as never)).toBe(false);
    expect(hazardOf(from, from, [body(from.x, 0, 0)] as never, family)).toBe(0);
  });

  it('⭐ THE HAZARD IS THE SHIPPED EXPOSURE, RESTRICTED — it degenerates and it never exceeds', () => {
    const from = { x: -10, y: 0 };
    const aim = { x: 10, y: 0 };
    const os = [body(-4, 1, 6), body(0, 2.5, 3), body(5, 0.5, 7)];
    for (const family of Object.values(BK_CORRIDOR_FAMILIES)) {
      const h = hazardOf(from, aim, os as never, family);
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThanOrEqual(exposureOf(from, aim, os as never));
    }
    // THE DEGENERACY: the keeper throw at its SHORT end (8 m, where T sits on the family's
    // own tMin) peaks at 0.99 m — under the strike edge for its whole flight — so it clears
    // NOBODY and the hazard IS the shipped exposure, exactly
    const flat = bkCorridorFlightOf(BK_CORRIDOR_FAMILIES.keeperThrow, 8);
    expect(flat.T).toBe(BK_CORRIDOR_FAMILIES.keeperThrow.tMin);
    expect((GRAVITY * flat.T * flat.T) / 8).toBeLessThan(HEADER_MIN_HEIGHT);
    const f20 = { x: -4, y: 0 };
    const a20 = { x: 4, y: 0 };
    const near = [body(-2, 1, 6), body(0, 2.5, 3), body(2, 0.5, 7)];
    expect(hazardOf(f20, a20, near as never, BK_CORRIDOR_FAMILIES.keeperThrow))
      .toBe(exposureOf(f20, a20, near as never));
    // and the closing-capability half is still the DV limb's own (time-aware)
    const still = hazardOf(f20, a20, [body(0, 3.5, 0)] as never, BK_CORRIDOR_FAMILIES.keeperThrow);
    const quick = hazardOf(f20, a20, [body(0, 3.5, 8)] as never, BK_CORRIDOR_FAMILIES.keeperThrow);
    expect(quick).toBeGreaterThan(still);
    expect(DV_FLIGHT_SPEED).toBe(18);
  });

  it('⭐ THE PRICE is `w · hazard` and NOTHING else — linear in the gene, monotone, bounded', () => {
    const from = { x: -20, y: 0 };
    const aim = { x: 20, y: 0 };
    const os = [body(-17, 0.5, 4)];
    const family = BK_CORRIDOR_FAMILIES.loft;
    const h = hazardOf(from, aim, os as never, family);
    expect(h).toBeGreaterThan(0);
    let prev = -1;
    for (const w of [0, 0.25, 0.5, 0.75, 1]) {
      const seat = deliveryValueSeatOf({ dvExposureWeight: w } as TacticalGenome)!;
      const price = bkCorridorPriceOf(seat, from, aim, os as never, family);
      expect(price).toBe(w * h);
      expect(price).toBeGreaterThanOrEqual(prev);
      expect(price).toBeLessThanOrEqual(1);
      prev = price;
    }
    // the gene's own domain is [0,1] (`dvExposureWeightOf`'s clamp) — the DOSE OF RECORD
    // is that domain's MAXIMUM, so the price can never exceed the hazard's own range
    const capped = deliveryValueSeatOf({ dvExposureWeight: 5 } as TacticalGenome)!;
    expect(capped.exposureWeight).toBe(1);
  });

  it('⭐ NO RNG: an armed, dosed corridor price draws nothing', () => {
    const m = matchOf(SEED_C, { bk: true, weight: 1 });
    for (let i = 0; i < 300; i++) m.step(DT);
    const before = (m.rng as unknown as { s: number }).s;
    const seat = deliveryValueSeatOf(m.teams[0].effGenome)!;
    let priced = 0;
    for (const p of m.allPlayers) {
      for (const family of Object.values(BK_CORRIDOR_FAMILIES)) {
        bkCorridorPriceOf(seat, p.pos, m.ball.pos, m.teams[1].players, family);
        priced += 1;
      }
    }
    expect(priced).toBeGreaterThan(0);
    expect((m.rng as unknown as { s: number }).s).toBe(before);
  });
});

/* ========================================================================== */
/* EXTEND, NOT DUPLICATE + THE ⛔ #328 PROHIBITION                            */
/* ========================================================================== */

describe('BK T3 §EXTEND-NOT-DUPLICATE — one corridor loop, no double charge', () => {
  it('⭐⭐ ONE corridor loop: `aloft === null` is HEAD\'s arithmetic, and the DV pricer is untouched', () => {
    // exactly ONE `for (const o of opponents)` walk in the seat module — the height half is
    // a statement INSIDE the shipped loop, never a second loop that could drift
    expect(count(seatSource, /for \(const o of opponents\)/g)).toBe(1);
    expect(count(codeLinesOf(seatSource), /closestPointOnSegment\(/g)).toBe(1);
    // the shipped three-argument call still means exactly what it meant
    const from = { x: -10, y: 0 };
    const aim = { x: 10, y: 0 };
    const os = [body(0, 1.5, 5), body(4, 3, 2)];
    expect(flightExposure(from, aim, os as never))
      .toBe(flightExposure(from, aim, os as never, null));
    // the DV risk price still has ONE call site, and it is the ground pricer's
    expect(count(brainSource, /deliveryRiskPrice\(/g)).toBe(1);
    expect(brainSource).toContain(
      '        : s - deliveryRiskPrice(dvSeat, p.pos, aim, opp.players, team.localX(aim.x), W.passBase);',
    );
  });

  it('⭐⭐ THE HAND THROW: its shipped ground-lane factor is UNTOUCHED and no second lane term appears', () => {
    expect(linesOf(brainSource, '      sT *= 0.3 + laneOpenness(p.pos, mate.pos, opp.players) * 0.7;')).toBe(1);
    // the four added statements name NO lane read, no attribute, no gene, no multiplier
    const added = brainSource.split('\n').filter((l) => l.includes('bkCorridorPriceOf('));
    expect(added.length).toBe(4);
    for (const l of added) {
      for (const banned of [
        'laneOpenness', 'airLane', 'opennessAt', 'riskTolerance', 'passBias', 'attrs.', '*=',
      ]) expect(l).not.toContain(banned);
      expect(l.trim().startsWith('s')).toBe(true); // a pure subtraction from the score
      expect(l).toContain('-= bkCorridorPriceOf(');
    }
    // the shipped height-blind reads all still stand, at their own counts
    expect(count(brainSource, /airLaneOpenness\(/g)).toBe(1);
    expect(count(brainSource, /laneOpenness\(/g)).toBe(4);
  });

  it('⭐⭐ THE FOUR PRICED STATEMENTS, VERBATIM — each chooser\'s own AIM and its own family', () => {
    // ⭐ THE UNPINNED-TERM HUNT'S FIRST CATCH (canon: "a scored face's walk-side predicate
    // is pinned … because the re-derivation gate proves arithmetic, not definitions"; the
    // same discipline applied to a PRICE's own arguments): the occurrence counts above
    // cannot see WHICH POINT each chooser prices, so the aim of every site is pinned here.
    for (const stmt of [
      // the open-play loft switch — the INCUMBENT's body pricing (M-PTP.4)
      '          sL -= bkCorridorPriceOf(bkSeat, p.pos, mate.pos, opp.players, BK_CORRIDOR_FAMILIES.loft);',
      // the dink over the top — the aim this chooser already judges the chip at
      '          sC -= bkCorridorPriceOf(bkSeat, p.pos, point, opp.players, BK_CORRIDOR_FAMILIES.dink);',
      // the keeper's hand throw — his own target
      '        sT -= bkCorridorPriceOf(bkSeat, p.pos, mate.pos, opp.players, BK_CORRIDOR_FAMILIES.keeperThrow);',
      // ⭐⭐ the punt — the first corridor term this delivery has ever carried
      '        sP -= bkCorridorPriceOf(bkSeat, p.pos, puntMate.pos, opp.players, BK_CORRIDOR_FAMILIES.loft);',
    ]) expect(linesOf(brainSource, stmt)).toBe(1);
  });

  it('⭐ THE HAZARD\'S OWN FLIGHT comes from the PRICED delivery\'s own distance', () => {
    // THE HUNT'S SECOND CATCH: nothing above pins WHICH distance the family's T is
    // evaluated at, so the composition identity is pinned directly.
    const from = { x: -18, y: 0 };
    const os = [body(-12, 0.8, 5), body(3, 2, 4)];
    for (const aim of [{ x: 6, y: 0 }, { x: 24, y: 8 }, { x: -4, y: -12 }]) {
      for (const family of Object.values(BK_CORRIDOR_FAMILIES)) {
        const flight = bkCorridorFlightOf(family, Math.hypot(aim.x - from.x, aim.y - from.y));
        expect(hazardOf(from, aim, os as never, family))
          .toBe(flightExposure(from, aim, os as never, flight));
      }
    }
  });

  it('⛔ #328 item 3: NO DEFAULT ARC IS RAISED — the launch parameterization is not touched', () => {
    // the seam names no `loftKick` argument in the engine at all: every family constant it
    // knows is a COPY pinned to the call site, and `mechanics.ts` is clean of the needle
    expect(count(mechSource, /bkCorridor|BK_CORRIDOR/gi)).toBe(0);
    expect(count(mechSource, /clamp\(tBase \+ dEff \* tPerM, tMin, tMax\)/g)).toBe(1);
    expect(mechSource).toContain('const T = clamp(tBase + dEff * tPerM, tMin, tMax);');
    // and no chooser gained a hand rule: the seam adds no `if` on a body's presence, only
    // the ONE seat fork and the FOUR nullable-seat guards
    expect(count(brainSource, /if \(bkSeat !== null\)/g)).toBe(4);
    expect(count(brainSource, /match\.bkCorridorPrice/g)).toBe(1);
  });

  it('⭐ G-EPI: the seat module still cannot reach the world', () => {
    const code = codeLinesOf(seatSource);
    expect(code).not.toContain('Match');
    expect(code).not.toContain('match.');
    expect(code).not.toContain('perceivedSnapshot');
    expect(seatSource).not.toContain("from '../sim/Match'");
    for (const banned of ['riskTolerance', 'passBias', 'attrs.', 'traits', 'Math.random']) {
      expect(code).not.toContain(banned);
    }
    // its position source is the caller's own `opp.players` — the SAME array the shipped
    // corridor reads are called with, so it inherits the IN law's epistemics unchanged
    for (const l of brainSource.split('\n').filter((x) => x.includes('bkCorridorPriceOf('))) {
      expect(l).toContain('opp.players');
    }
    expect(codeLinesOf(seatSource)).toContain('const t = dist(from as V2, cp) / DV_FLIGHT_SPEED;');
  });
});

/* ========================================================================== */
/* COMPOSITION                                                                */
/* ========================================================================== */

describe('BK T3 §COMPOSITION — the world-9 + DF + IN stack', () => {
  it('⭐⭐ armed-at-zero ≡ shut on the FULL stack; dosed is a DISTINCT, terminating world', () => {
    // A STATED ECONOMICAL SUBSET (the M-BU.2 composition proof, one cell per neighbour
    // plus the full stack): world-9 + dfAssignPersist + dfSurface + inSnapshotLaw +
    // inLookAct, one seed, 240 s.
    const stack = {
      world: W9, df: true, dfs: true, in: true, look: true, duration: 240,
    } as const;
    const shut = signatureOf(matchOf(SEED_A, stack));
    expect(signatureOf(matchOf(SEED_A, { ...stack, bk: true }))).toBe(shut); // gene absent
    expect(signatureOf(matchOf(SEED_A, { ...stack, bk: true, weight: 0 }))).toBe(shut);
    const dosed = signatureOf(matchOf(SEED_A, { ...stack, bk: true, weight: 1 }));
    expect(dosed).not.toBe(shut);
    // lifecycle clean: the dosed world really finished, and it is a real match
    const live = matchOf(SEED_A, { ...stack, bk: true, weight: 1 });
    while (!live.finished) live.step(DT);
    expect(live.finished).toBe(true);
    expect(live.getResult().stats[0].passes).toBeGreaterThan(0);
  });

  it('⭐ G-CROSS: the DV door and this door share the gene without either becoming the other', () => {
    const base = { world: W9, duration: 240 } as const;
    const dvAlone = signatureOf(matchOf(SEED_B, { ...base, dv: true, weight: 1 }));
    const bkAlone = signatureOf(matchOf(SEED_B, { ...base, bk: true, weight: 1 }));
    const both = signatureOf(matchOf(SEED_B, { ...base, dv: true, bk: true, weight: 1 }));
    const shut = signatureOf(matchOf(SEED_B, base));
    for (const s of [dvAlone, bkAlone, both]) expect(s).not.toBe(shut);
    expect(bkAlone).not.toBe(dvAlone); // this seam is not the DV seam
    expect(both).not.toBe(dvAlone);
    expect(both).not.toBe(bkAlone);
    // and with the gene ABSENT both doors are no-ops, together
    expect(signatureOf(matchOf(SEED_B, { ...base, dv: true, bk: true }))).toBe(shut);
  });
});

/* ========================================================================== */
/* §SEAM MAP                                                                  */
/* ========================================================================== */

describe('BK T3 §SEAM MAP — occurrence COUNTS per needle (canon: PC-C0 §CORR item 1)', () => {
  it('⭐⭐ THE PREFIX `bkCorridor` / `BkCorridor` / `BK_CORRIDOR` — every occurrence, counted and sited', () => {
    // PREFIX STATED: the needle family is `bkCorridor*` in all three of the engine's
    // casings. Its members are exactly: the flag `bkCorridorPrice`, the family table
    // `BK_CORRIDOR_FAMILIES`, the flight constructor `bkCorridorFlightOf`, the height law
    // `bkCorridorHeightAt`, the gate `bkCorridorClearsBody`, the hazard
    // `bkCorridorHazard`, the price `bkCorridorPriceOf`, and the two types
    // `BkCorridorFamily` / `BkCorridorFlight`.
    const members = new RegExp(
      '(bkCorridorPrice|bkCorridor(FlightOf|HeightAt|ClearsBody|Hazard|PriceOf)'
      + '|BK_CORRIDOR_FAMILIES|BkCorridor(Family|Flight))', 'g',
    );
    const files = srcFiles('src');
    let total = 0;
    for (const f of files) {
      const hay = readFileSync(f, 'utf8');
      const all = count(hay, /bkCorridor|BkCorridor|BK_CORRIDOR/gi);
      expect(all).toBe(count(hay, members)); // no member outside the enumerated set
      total += all;
      if (all > 0) {
        expect([
          'src/ai/deliveryValueSeat.ts', 'src/ai/PlayerBrain.ts', 'src/sim/Match.ts',
          'src/sim/League.ts',
        ]).toContain(f);
      }
    }
    expect(total).toBeGreaterThan(0);
    // Match.ts: the config declaration + the readonly declaration + the initialiser, and
    // the prose of the two docblocks — the ONLY places the engine names the flag
    expect(count(matchSource, /^ {2}bkCorridorPrice\?: boolean;$/gm)).toBe(1);
    expect(count(matchSource, /^ {2}readonly bkCorridorPrice: boolean;$/gm)).toBe(1);
    expect(count(matchSource, /this\.bkCorridorPrice = cfg\.bkCorridorPrice \?\? false;/g)).toBe(1);
    // League.ts: the matchFlags key union, and nowhere else
    expect(count(leagueSource, /bkCorridorPrice/g)).toBe(1);
    // PlayerBrain.ts: ONE fork line, ONE import, FOUR priced choosers, THREE families used
    expect(linesOf(brainSource, '  const bkSeat = match.bkCorridorPrice ? deliveryValueSeatOf(g) : null;')).toBe(1);
    expect(count(brainSource, /bkCorridorPriceOf\(/g)).toBe(4);
    expect(count(brainSource, /BK_CORRIDOR_FAMILIES\.loft/g)).toBe(2); // the switch AND the punt
    expect(count(brainSource, /BK_CORRIDOR_FAMILIES\.keeperThrow/g)).toBe(1);
    expect(count(brainSource, /BK_CORRIDOR_FAMILIES\.dink/g)).toBe(1);
    // deliveryValueSeat.ts: one definition each, and the gate is called from exactly one
    // place — inside the shipped corridor loop
    for (const sym of [
      'bkCorridorFlightOf', 'bkCorridorHeightAt', 'bkCorridorClearsBody', 'bkCorridorHazard',
      'bkCorridorPriceOf',
    ]) {
      expect(count(seatSource, new RegExp(`export function ${sym}\\(`, 'g'))).toBe(1);
    }
    expect(count(seatSource, /bkCorridorClearsBody\(/g)).toBe(2); // the definition + the ONE call
    // NO OTHER FILE — no executor, physics, render, evolution or League consumer
    for (const f of files) {
      if ([
        'src/ai/deliveryValueSeat.ts', 'src/ai/PlayerBrain.ts', 'src/sim/Match.ts',
        'src/sim/League.ts',
      ].includes(f)) continue;
      expect(readFileSync(f, 'utf8')).not.toMatch(/bkCorridor/i);
    }
  });

  it('⭐ the fingerprint of record is a literal in this suite, and the seam may not move it', () => {
    expect(FINGERPRINT_OF_RECORD).toBe(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
    const bare = new Match({ seed: 1, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.bkCorridorPrice).toBe(false);
    expect(bare.dvDeliveryValue).toBe(false);
  });
});
