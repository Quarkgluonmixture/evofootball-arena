import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { BALL_RADIUS, DT, PLAYER_CORE_RADIUS } from '../src/sim/constants';
import { GENE_KEYS, randomGenome, type TacticalGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import {
  a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells,
} from '../src/game/a4World';
import { Rng } from '../src/utils/rng';
import { deliveryValueSeatOf, groundShellHazard } from '../src/ai/deliveryValueSeat';

/**
 * ⭐⭐ GC T0 — THE GROUND-CORRIDOR DORMANT SEAM (docs/world-model/GC-T0-DORMANT-SEAM.md;
 * contract GC-GROUND-CORRIDOR-CONTRACT.md §2 M-GC.1/M-GC.2/M-GC.3; ruling #343 item 4,
 * serving the user's play-test RED of #341 — 弹身体感觉很影响比赛) — THE SEAM'S PERMANENT
 * PIN SUITE, in the house form (`bkCorridorPrice.test.ts` / `dfAssignPersist.test.ts` /
 * `dfCapOff.test.ts`).
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * The pins:
 *   • ⭐⭐ ROAD B DORMANCY (STRONG) — flag ABSENT ≡ flag EXPLICITLY FALSE ≡ ARMED AT GENE
 *     ZERO, byte for byte, in BOTH world shapes (bare · world 11, the GC-T1 exam's own
 *     stack) × 2 scratch seeds, pooled digest.
 *   • ⭐⭐ THE PROHIBITION SET (the `dfCapOff` form) — NO world and NO preset names the
 *     flag: `a4World.ts` does not contain the string at all, `a4MatchFlags` never carries
 *     it at any version, a League match is false, and no serialized League can reach it.
 *   • ⭐⭐ THE PREDICATE LAW ON CONSTRUCTED FIXTURES — BK-C2 §P.4's discriminator,
 *     translated: BOTH SIDES, minus the kicker, minus the INTENDED RECEIVER (BK-C1 §4(ii)'s
 *     arriving rule), shell = `coreRadius + ball.radius`, SHORT of the target
 *     (`along < d − shell`), NO 1.5 m guard, NO cooldown gate, values exactly 0 or 1.
 *   • ⭐⭐ GROUND ONLY — the term sits inside the ONE hoisted `groundCandidate` and the
 *     LOFTED chain (`sL` … `bkCorridorPriceLed`) never names it, so the lofted family that
 *     `bkCorridorPrice` owns is not double-priced.
 *   • ⭐⭐ THE SEAM MAP — occurrence COUNTS per needle, PREFIX stated (canon VERBATIM: "a
 *     seam-map gate pins occurrence COUNTS per needle and enumerates EVERY occurrence's
 *     site", home PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 1).
 *   • ⭐ NO SERIALIZATION — the flag never reaches a serialized League (canon, VERBATIM:
 *     "WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits matchFlags; true
 *     since #155, stated now, test-pinned; refines #270's E4 correction; matches the perf
 *     diagnostic)" — home: ruling #283.2(iv)), and the gene it rides is still born absent.
 *   • ⭐ THE FINGERPRINT OF RECORD — a literal in this suite; the seam may not move it.
 *
 * ⚠ Every walk in this file lives in the OUT-OF-BAND SCRATCH CLASS (canon, VERBATIM:
 * "verifier scratch walks use the stage's own consumed band or the out-of-band scratch
 * range (≥ 900,000,000) — never the next virgin block", home:
 * PW-T0C-OBJECTIVE-FIDELITY.md §COMMANDER CORRECTIONS item 6). ZERO frontier consumption.
 */

/** The production fingerprint of record (#305 item 1) — this seam may not move it. */
const FINGERPRINT_OF_RECORD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⚠ OUT-OF-BAND SCRATCH SEEDS (≥ 900,000,000) — no frontier block is consumed. */
const SEED_A = 900_000_100;
const SEED_B = 900_000_101;
const SEED_C = 900_000_102;

/** The GC-T1 exam's own stack: world 11 (world 10 + the corridor price at the 0.5 pin). */
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
  gc?: boolean;
  /** pass the door EXPLICITLY as false rather than omitting it (dormancy's other half) */
  gcExplicitFalse?: boolean;
  /**
   * the DV exposure gene, written on all three genome views of BOTH teams (the arming
   * checklist, #196.3-D6). `undefined` ⇒ leave the world's own value alone — which is
   * ABSENT in the bare shape and world 11's own pinned 0.5 in the armed shape.
   */
  weight?: number;
  world?: 11;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const base = a.world === undefined ? {} : a4MatchFlags(a.world);
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240,
    ...base,
    ...(a.gc === true ? { bkGroundCorridor: true } : {}),
    ...(a.gcExplicitFalse === true ? { bkGroundCorridor: false } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (a.world !== undefined) armA4World(m, null, a.world, L3_DOSE, PC_DOSE);
  if (a.weight !== undefined) {
    for (const t of m.teams) {
      for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
        g.dvExposureWeight = a.weight;
      }
    }
  }
  return m;
};

/** The house world-identity signature (PW-T0b's, verbatim via PC-T0, BK-T0/T1, DF, BK-T3). */
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
const seatSource = src('ai/deliveryValueSeat.ts');
const matchSource = src('sim/Match.ts');
const leagueSource = src('sim/League.ts');
const count = (hay: string, needle: RegExp): number => (hay.match(needle) ?? []).length;
const linesOf = (hay: string, line: string): number =>
  hay.split('\n').filter((l) => l === line).length;
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = join(dir, e);
  return statSync(full).isDirectory() ? srcFiles(full) : full.endsWith('.ts') ? [full] : [];
});

/* ========================================================================== */
/* THE FIXTURE BODY — exactly what the predicate reads, and nothing more      */
/* ========================================================================== */

const SHELL = PLAYER_CORE_RADIUS + BALL_RADIUS;
let nextGid = 100;
const body = (x: number, y: number, opts: { gid?: number; sentOff?: boolean } = {}): {
  gid: number; pos: { x: number; y: number }; sentOff: boolean; coreRadius: number;
} => ({
  gid: opts.gid ?? nextGid++,
  pos: { x, y },
  sentOff: opts.sentOff ?? false,
  coreRadius: PLAYER_CORE_RADIUS,
});
/* eslint-disable @typescript-eslint/no-explicit-any */
const hazardOf = (
  from: { x: number; y: number }, aim: { x: number; y: number },
  sides: any[][], kickerGid: number, receiverGid: number,
): number => groundShellHazard(from, aim, sides as any, kickerGid, receiverGid);
/* eslint-enable @typescript-eslint/no-explicit-any */

/** The line every fixture prices: `from` → `aim`, 20 m along the x axis. */
const FROM = { x: -10, y: 0 };
const AIM = { x: 10, y: 0 };
const KICKER = 1;
const RECEIVER = 2;

/* ========================================================================== */
/* ROAD B — HYGIENE, THE PROHIBITION SET AND STRONG DORMANCY                  */
/* ========================================================================== */

describe('GC T0 — the ground-corridor price is dormant (Road B)', () => {
  it('⭐⭐ THE PROHIBITION SET: no world, no preset and no default names the flag', () => {
    expect(matchSource).toContain('this.bkGroundCorridor = cfg.bkGroundCorridor ?? false;');
    // ⭐ THE dfCapOff-STYLE PROHIBITION — unlike `bkCorridorPrice` (which world 11 arms),
    // GC-T0 is armed by NOTHING: the entry layer does not name the flag at all. The entry
    // rung is GC-T1's business (contract §3), not this stage's.
    expect(src('game/a4World.ts')).not.toContain('bkGroundCorridor');
    for (const v of [6, 7, 8, 9, 10, 11] as const) {
      expect((a4MatchFlags(v) as Record<string, unknown>).bkGroundCorridor).toBeUndefined();
      expect(JSON.stringify(a4MatchFlags(v))).not.toContain('bkGroundCorridor');
    }
    const bare = new Match({ seed: 7, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.bkGroundCorridor).toBe(false);
    expect(matchOf(SEED_A).bkGroundCorridor).toBe(false);
    expect(matchOf(SEED_A, { world: W11 }).bkGroundCorridor).toBe(false);
    const league = new League({ seed: SEED_A });
    expect(league.createMatch(league.nextFixture()!).bkGroundCorridor).toBe(false);
    // no env door anywhere on a seam line
    for (const f of [
      'src/sim/Match.ts', 'src/sim/League.ts', 'src/ai/deliveryValueSeat.ts',
      'src/ai/PlayerBrain.ts',
    ]) {
      for (const line of readFileSync(f, 'utf8').split('\n')) {
        if (!/bkGroundCorridor|groundShellHazard/i.test(line)) continue;
        expect(line).not.toMatch(/envArmed|EDS_BUNDLE_ARMED|process\.env/);
      }
    }
  });

  it('⭐ NO SERIALIZATION: the flag never reaches a serialized League, and the gene stays born absent', () => {
    // CANON, VERBATIM (home: ruling #283.2(iv)): "WORKER-SIMMED fixtures play the SHIPPED
    // world (League.toJSON omits matchFlags; true since #155, stated now, test-pinned;
    // refines #270's E4 correction; matches the perf diagnostic)".
    const league = new League({ seed: SEED_A });
    league.matchFlags = { bkGroundCorridor: true };
    expect(JSON.stringify(league.toJSON())).not.toContain('bkGroundCorridor');
    // ⭐ THE GENE IS THE DV SEAT'S OWN — no new gene is created by this stage.
    expect((GENE_KEYS as readonly string[])).not.toContain('dvExposureWeight');
    const g = randomGenome(new Rng(SEED_A));
    expect(g.dvExposureWeight).toBeUndefined();
    expect(deliveryValueSeatOf(g)).toBeNull();
    expect(JSON.stringify(g)).not.toContain('dvExposureWeight');
  });

  it('⭐⭐ G-OFF: ABSENT ≡ EXPLICIT-FALSE, both world shapes × 2 seeds, pooled', () => {
    const absent: string[] = [];
    const explicitFalse: string[] = [];
    for (const world of [undefined, W11] as const) {
      for (const seed of [SEED_A, SEED_B]) {
        absent.push(signatureOf(matchOf(seed, { world })));
        explicitFalse.push(signatureOf(matchOf(seed, { world, gcExplicitFalse: true })));
      }
    }
    expect(explicitFalse).toEqual(absent);
    expect(digest(explicitFalse)).toBe(digest(absent));
    expect(new Set(absent).size).toBe(4); // one digest per (world × seed) cell
  });

  it('⭐⭐ G-BORN: armed with the gene ABSENT ≡ shut, byte for byte (no seat at all)', () => {
    // The bare world's genomes never carry `dvExposureWeight`, so arming the flag builds
    // NO seat: the arming rule's second limb is what makes this structural, not arithmetic.
    for (const seed of [SEED_A, SEED_B]) {
      const shut = signatureOf(matchOf(seed));
      const armed = signatureOf(matchOf(seed, { gc: true }));
      expect(armed).toBe(shut);
    }
    const live = matchOf(SEED_A, { gc: true });
    expect(live.bkGroundCorridor).toBe(true);
    for (const t of live.teams) expect(deliveryValueSeatOf(t.effGenome)).toBeNull();
  });

  it('⭐⭐ G-ZERO: armed with the gene PRESENT AT ZERO ≡ shut, with the path LIVE', () => {
    // ⚠ THE COMPARATOR CARRIES THE SAME GENE. World 11 pins `dvExposureWeight` at 0.5 for
    // its OWN lofted corridor price, so the honest zero-arm control is the SAME world with
    // the SAME gene forced to 0 — otherwise this would measure the LOFTED price, not ours.
    const shut: string[] = [];
    const armedZero: string[] = [];
    for (const world of [undefined, W11] as const) {
      for (const seed of [SEED_A, SEED_B]) {
        shut.push(signatureOf(matchOf(seed, { world, weight: 0 })));
        armedZero.push(signatureOf(matchOf(seed, { world, weight: 0, gc: true })));
      }
    }
    expect(armedZero).toEqual(shut);
    expect(digest(armedZero)).toBe(digest(shut));
    // the code path really is live in the armed-zero arm (a seat exists on every view)
    const live = matchOf(SEED_A, { gc: true, weight: 0 });
    expect(live.bkGroundCorridor).toBe(true);
    for (const t of live.teams) {
      for (const g of [t.baseGenome, t.effGenome] as TacticalGenome[]) {
        expect(deliveryValueSeatOf(g)).not.toBeNull();
        expect(deliveryValueSeatOf(g)!.exposureWeight).toBe(0);
      }
    }
  });

  it('⭐ THE ZERO POINT IS IEEE-EXACT, not approximate', () => {
    const seat = deliveryValueSeatOf({ dvExposureWeight: 0 } as TacticalGenome)!;
    const sides = [[body(0, 0, { gid: 9 })], []];
    const price = seat.exposureWeight * hazardOf(FROM, AIM, sides, KICKER, RECEIVER);
    expect(hazardOf(FROM, AIM, sides, KICKER, RECEIVER)).toBe(1); // the hazard really bites
    expect(Object.is(price, 0)).toBe(true); // exactly +0, not merely ≈ 0
    for (const s of [0, 0.37, 1.25, -0.5]) expect(s - price).toBe(s);
  });

  it('⭐ G-BITE: a dosed gene genuinely REPRICES — the armed world diverges', () => {
    for (const seed of [SEED_C]) {
      const shut = signatureOf(matchOf(seed, { world: W11 }));
      const dosed = signatureOf(matchOf(seed, { world: W11, gc: true }));
      expect(dosed).not.toBe(shut); // world 11 already carries the 0.5 pin
      const bareShut = signatureOf(matchOf(seed, { weight: 1 }));
      const bareDosed = signatureOf(matchOf(seed, { weight: 1, gc: true }));
      expect(bareDosed).not.toBe(bareShut);
    }
  });
});

/* ========================================================================== */
/* THE PREDICATE LAW — BK-C2 §P.4, TRANSLATED, ON CONSTRUCTED FIXTURES        */
/* ========================================================================== */

describe('GC T0 §PREDICATE LAW — BK-C2 §P.4\'s discriminator, on fixtures', () => {
  it('⭐ the range is EXACTLY 0 or 1 — a binary discriminator, never graded', () => {
    for (const y of [0, 0.2, SHELL * 0.99, SHELL * 1.01, 3, 40]) {
      const h = hazardOf(FROM, AIM, [[body(0, y, { gid: 9 })], []], KICKER, RECEIVER);
      expect(h === 0 || h === 1).toBe(true);
      expect(Number.isInteger(h)).toBe(true);
    }
    expect(hazardOf(FROM, AIM, [[], []], KICKER, RECEIVER)).toBe(0);
  });

  it('⭐⭐ BOTH TEAMS — a TEAMMATE on the line blocks exactly as an opponent does', () => {
    // BK-C2 (ii): 40.9/43.1 % of attributable caroms hit the passer's OWN teammate, which
    // BK-T3's opponents-only form structurally cannot see (§CORR 3's ADOPTED departure).
    const onLine = body(0, 0, { gid: 9 });
    expect(hazardOf(FROM, AIM, [[onLine], []], KICKER, RECEIVER)).toBe(1); // own side
    expect(hazardOf(FROM, AIM, [[], [onLine]], KICKER, RECEIVER)).toBe(1); // the opposition
    expect(hazardOf(FROM, AIM, [[onLine], [onLine]], KICKER, RECEIVER)).toBe(1);
  });

  it('⭐⭐ THE ARRIVING RULE — the INTENDED RECEIVER is named out (BK-C1 §4(ii))', () => {
    // "a delivery that reaches its man and is met there is a delivery ARRIVING, not a
    // block" — BK-C2 §P.4 measured 74/74 ground lines BLOCKED without this exclusion.
    const receiverAtAim = body(AIM.x, AIM.y, { gid: RECEIVER });
    const receiverOnLine = body(0, 0, { gid: RECEIVER });
    expect(hazardOf(FROM, AIM, [[receiverAtAim], []], KICKER, RECEIVER)).toBe(0);
    expect(hazardOf(FROM, AIM, [[receiverOnLine], []], KICKER, RECEIVER)).toBe(0);
    // …and he is named out on EITHER side of the pitch, by GID and not by membership
    expect(hazardOf(FROM, AIM, [[], [receiverOnLine]], KICKER, RECEIVER)).toBe(0);
    // a DIFFERENT body standing at the very same place still blocks
    expect(hazardOf(FROM, AIM, [[body(0, 0, { gid: 77 })], []], KICKER, RECEIVER)).toBe(1);
  });

  it('⭐ THE KICKER is named out, and so is a SENT-OFF body', () => {
    expect(hazardOf(FROM, AIM, [[body(0, 0, { gid: KICKER })], []], KICKER, RECEIVER)).toBe(0);
    expect(
      hazardOf(FROM, AIM, [[body(0, 0, { gid: 9, sentOff: true })], []], KICKER, RECEIVER),
    ).toBe(0);
  });

  it('⭐⭐ THE SHELL is the contact law\'s own `coreRadius + ball.radius`, and it is the ONLY width', () => {
    // canon, VERBATIM: "a src-extracted constant pins its extraction to the NAMED call
    // site — anchored match + line receipt — never first-occurrence" (home: BK-C0 §CORR
    // item 1). The contact law's own expression, in `Match.ts`:
    const shellLine = '      const shell = p.coreRadius + ball.radius;';
    expect(linesOf(matchSource, shellLine)).toBe(1);
    // just INSIDE the shell blocks; just OUTSIDE it does not — the boundary is the shell
    expect(hazardOf(FROM, AIM, [[body(0, SHELL * 0.999, { gid: 9 })], []], KICKER, RECEIVER)).toBe(1);
    expect(hazardOf(FROM, AIM, [[body(0, SHELL * 1.001, { gid: 9 })], []], KICKER, RECEIVER)).toBe(0);
    // the seam re-types no width of its own: ONE code line, the other two occurrences
    // being the docblock's own transcription of the predicate and of its provenance
    expect(linesOf(seatSource, '      const shell = o.coreRadius + BALL_RADIUS;')).toBe(1);
    expect(count(seatSource, /o\.coreRadius \+ BALL_RADIUS/g)).toBe(3);
  });

  it('⭐⭐ SHORT OF THE TARGET — `along < d − shell`, BK-C1 §4(ii)\'s second condition', () => {
    const d = 20; // FROM → AIM
    // a body sitting on the line a comfortable distance short of the target blocks…
    expect(hazardOf(FROM, AIM, [[body(5, 0, { gid: 9 })], []], KICKER, RECEIVER)).toBe(1);
    // …and one AT the target's own shell does not (he is where the ball arrives)
    const justShort = FROM.x + (d - SHELL) * 0.999;
    const justBeyond = FROM.x + (d - SHELL) * 1.001;
    expect(hazardOf(FROM, AIM, [[body(justShort, 0, { gid: 9 })], []], KICKER, RECEIVER)).toBe(1);
    expect(hazardOf(FROM, AIM, [[body(justBeyond, 0, { gid: 9 })], []], KICKER, RECEIVER)).toBe(0);
    // a body BEYOND the target entirely is never on this delivery's line
    expect(hazardOf(FROM, AIM, [[body(18, 0, { gid: 9 })], []], KICKER, RECEIVER)).toBe(0);
  });

  it('⭐⭐ NO 1.5 m GUARD — the deliberate departure from `laneOpenness` (#340 item 2(c))', () => {
    // `DV_CLEAR_RADIUS = 1.5` is laneOpenness's "the kick clears them", which the contact
    // law made FALSE. BK-C2 §P.4 does not apply it to the shell predicate; nor do we.
    expect(hazardOf(FROM, AIM, [[body(-9.5, 0, { gid: 9 })], []], KICKER, RECEIVER)).toBe(1);
    expect(seatSource.split('export function groundShellHazard(')[1])
      .not.toContain('DV_CLEAR_RADIUS');
  });

  it('⭐⭐ NO COOLDOWN GATE and NO SPEED READ — the hazard is GEOMETRIC (BK-C2 (iii))', () => {
    // The census proved position-at-choice predicts and cooldown-at-choice does not, so the
    // function's body may not name a clock, a speed or a flight at all.
    const fn = seatSource.split('export function groundShellHazard(')[1].split('\n}')[0];
    for (const forbidden of [
      'kickCooldown', 'stunTimer', 'topSpeed', 'lastTouch', 'DV_FLIGHT_SPEED',
      'DV_CORRIDOR_SCALE', 'clamp01', 'simTime', 'vel',
    ]) {
      expect(fn).not.toContain(forbidden);
    }
  });

  it('⭐ PURE and CHANNEL-CLOSED: the seat module still cannot reach the world', () => {
    // The DV/BK epistemic pin, unweakened: no `Match` import, no percept pull, no rng.
    expect(seatSource).not.toMatch(/^import .*['"]\.\.\/sim\/Match['"];$/m);
    const fn = seatSource.split('export function groundShellHazard(')[1].split('\n}')[0];
    for (const forbidden of ['match.', 'Math.random', 'rng', 'perceptionSnapshot']) {
      expect(fn).not.toContain(forbidden);
    }
  });
});

/* ========================================================================== */
/* GROUND ONLY — the term prices what the contract says and nothing else      */
/* ========================================================================== */

describe('GC T0 §SCOPE — the term touches the FOUR GROUND candidate kinds only', () => {
  it('⭐⭐ ONE hoisted pricer, FOUR ground call sites, and the LOFTED chain names nothing', () => {
    // M-GC.1: the ONE hoisted `groundCandidate` — declared once, called four times, and
    // every one of those four calls IS a ground candidate: (a) to feet, (b) the DLC-T0 led
    // ball, (c) the DLC-T0s strike plane, (d) the CB-T2 knock (a delivery to yourself).
    expect(count(brainSource, /const groundCandidate = \(/g)).toBe(1);
    expect(count(brainSource, /groundCandidate\(/g)).toBe(4); // the FOUR ground calls
    // …and the hazard is called EXACTLY ONCE, inside it
    expect(count(brainSource, /groundShellHazard\(/g)).toBe(1);
    const pricer = brainSource.split('const groundCandidate = (')[1]
      .split('    for (const mate of team.players) {')[0];
    expect(count(pricer, /groundShellHazard\(/g)).toBe(1);
    // ⭐⭐ THE LOFTED FAMILY IS NOT DOUBLE-PRICED: `bkCorridorPrice` owns it, on its own
    // `sL` chain, and that slice names neither this seam's seat nor its hazard.
    const lofted = brainSource.split('let sL = (W.loftBase')[1].split('if (sL > bestLoft)')[0];
    expect(lofted).toContain('bkCorridorPriceLed(');
    expect(lofted).not.toContain('groundShellHazard');
    expect(lofted).not.toContain('gcSeat');
    expect(lofted).not.toContain('gcBodies');
    // the through-ball / cross / cutback / shot chains do not price through this pricer
    // either — they never call it (the count above is the whole inventory).
  });

  it('⭐ THE HAZARD READS THIS CANDIDATE\'S OWN AIM AND OWN RECEIVER', () => {
    expect(brainSource).toContain(
      ': sDv - gcSeat.exposureWeight * groundShellHazard(p.pos, aim, gcBodies, p.gid, mate.gid);',
    );
    // …and the body set is the collections the loop already holds — no new channel
    expect(brainSource).toContain('gcSeat === null ? [] : [team.players, opp.players];');
    expect(count(brainSource, /gcBodies/g)).toBe(2); // the declaration + the ONE use
  });

  it('⭐ THE ARMING RULE IS THE BK SEAT\'S OWN — same accessor, same gene', () => {
    expect(linesOf(brainSource, '  const gcSeat = match.bkGroundCorridor ? deliveryValueSeatOf(g) : null;')).toBe(1);
    expect(linesOf(brainSource, '  const bkSeat = match.bkCorridorPrice ? deliveryValueSeatOf(g) : null;')).toBe(1);
    // the gene presence rule lives in ONE place and this stage did not add a second one
    expect(count(seatSource, /export function deliveryValueSeatOf\(/g)).toBe(1);
  });
});

/* ========================================================================== */
/* §SEAM MAP                                                                  */
/* ========================================================================== */

describe('GC T0 §SEAM MAP — occurrence COUNTS per needle (canon: PC-C0 §CORR item 1)', () => {
  it('⭐⭐ THE NEEDLES `bkGroundCorridor` and `groundShellHazard` — counted and sited', () => {
    // PREFIX STATED: this seam's whole needle family is exactly two names — the flag
    // `bkGroundCorridor` and the exported predicate `groundShellHazard`. There is no
    // third spelling, no type, no constant and no gene.
    const files = srcFiles('src');
    const SITES = [
      'src/ai/deliveryValueSeat.ts', 'src/ai/PlayerBrain.ts',
      'src/sim/Match.ts', 'src/sim/League.ts',
    ];
    for (const f of files) {
      const hay = readFileSync(f, 'utf8');
      const all = count(hay, /bkGroundCorridor|groundShellHazard/g);
      if (all > 0) expect(SITES).toContain(f);
      // no other casing or spelling of the family exists anywhere
      expect(count(hay, /bkGroundCorridor|groundShellHazard/gi))
        .toBe(count(hay, /bkGroundCorridor|groundShellHazard/g));
    }
    for (const f of files) {
      if (SITES.includes(f)) continue;
      expect(readFileSync(f, 'utf8')).not.toMatch(/bkGroundCorridor|groundShellHazard/i);
    }
    // Match.ts — 4: the config field, the readonly field, and the `this.`/`cfg.` pair on
    // the single initialiser line (the prose above them never re-types the flag name)
    expect(count(matchSource, /bkGroundCorridor/g)).toBe(4);
    expect(count(matchSource, /^ {2}bkGroundCorridor\?: boolean;$/gm)).toBe(1);
    expect(count(matchSource, /^ {2}readonly bkGroundCorridor: boolean;$/gm)).toBe(1);
    expect(count(matchSource, /this\.bkGroundCorridor = cfg\.bkGroundCorridor \?\? false;/g)).toBe(1);
    expect(count(matchSource, /groundShellHazard/g)).toBe(1); // the config docblock's prose
    // League.ts — the matchFlags key union, and nowhere else
    expect(count(leagueSource, /bkGroundCorridor/g)).toBe(1);
    expect(count(leagueSource, /groundShellHazard/g)).toBe(0);
    // deliveryValueSeat.ts — ONE definition, ZERO internal calls, and it never names the flag
    expect(count(seatSource, /export function groundShellHazard\(/g)).toBe(1);
    expect(count(seatSource, /groundShellHazard\(/g)).toBe(2); // + the docblock's pseudocode
    expect(count(seatSource, /bkGroundCorridor/g)).toBe(0);
    // PlayerBrain.ts — ONE flag fork, ONE import, ONE hazard call
    expect(count(brainSource, /bkGroundCorridor/g)).toBe(2); // the fork + the docblock's prose
    expect(count(brainSource, /match\.bkGroundCorridor/g)).toBe(1);
    expect(count(brainSource, /groundShellHazard/g)).toBe(3); // import + prose + the ONE call
    expect(count(brainSource, /groundShellHazard\(/g)).toBe(1);
    expect(count(brainSource, /gcSeat/g)).toBe(4); // the decl + the bodies guard + 2 in the pricer
  });

  it('⭐ the fingerprint of record is a literal in this suite, and the seam may not move it', () => {
    expect(FINGERPRINT_OF_RECORD).toBe(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
    const bare = new Match({ seed: 1, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.bkGroundCorridor).toBe(false);
    expect(bare.bkCorridorPrice).toBe(false);
    expect(bare.dvDeliveryValue).toBe(false);
  });
});
