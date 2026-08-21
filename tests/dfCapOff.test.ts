import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { updateTeamBrain } from '../src/ai/TeamBrain';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import {
  a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells,
} from '../src/game/a4World';
import { Rng } from '../src/utils/rng';

/**
 * ⭐⭐ DF T4 — THE CAP-OFF ARM (docs/world-model/DF-T4-CAP-OFF-TRIAL.md; contract
 * DF-DEFENSIVE-BRAIN-CONTRACT.md §2 M-DF.2 — *"the cap-off arm proves the surface alone
 * holds the band"*; ruling #336 item 5) — THE SEAM'S PERMANENT PIN SUITE, in the house form
 * (`dfSurface.test.ts` / `dfAssignPersist.test.ts`).
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * The pins:
 *   • ⭐⭐ ROAD B DORMANCY, STRONG FORM — flag ABSENT ≡ flag EXPLICIT-FALSE, byte for byte,
 *     in BOTH world shapes × 2 seeds, with a POOLED DIGEST.
 *   • ⭐⭐ THE SHIPPED CAP IS NEVER DELETED OR REWORDED — every one of the Phase-31 /
 *     Phase-112 / Phase-30.5 / Phase-28.3 statements is still present VERBATIM, exactly
 *     once, and the bypass is two PURELY ADDITIVE flag-gated statements beside them.
 *   • ⭐⭐ THE EXPLICIT PIN THAT REPLACES DF-T2'S SHA DISCIPLINE (ruling #336 item 5): with
 *     the flag OFF the four-chaser bin is EXACTLY ZERO as ever, on a full armed walk.
 *   • ⭐⭐ THE BYPASS IS A REAL CHANGE WHEN ARMED — a constructed fixture in which a FOURTH
 *     chaser is scored-for by the shipped arithmetic and THE CAP ALONE stops him.
 *   • ⭐⭐ EACH BYPASS STATEMENT IS SEPARATELY LOAD-BEARING — one fixture per statement
 *     (the OR-collapse's missing +1; the Phase-112 `Math.min(…, 3)` ceiling).
 *   • ⭐⭐ COMPOSITION at the world-9 + dfAssignPersist + dfSurface stack (the H-DF.1-passing
 *     stack the trial's BOTH arms carry), plus the inSnapshotLaw / inLookAct named subset.
 *   • ⭐ NO SERIALIZATION — the door adds no state at all.
 *   • ⭐⭐ THE SEAM MAP — occurrence COUNTS per needle, PREFIX stated (canon VERBATIM: "a
 *     seam-map gate pins occurrence COUNTS per needle and enumerates EVERY occurrence's
 *     site", home PC-C0 §CORR item 1).
 */

/** The production fingerprint of record (#305 item 1) — this seam may not move it. */
const FINGERPRINT_OF_RECORD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⚠ These seeds live inside DF-T4's OWN booked block (ruling #336 item 5: 12,521,000–999). */
const SEED_A = 12_521_800;
const SEED_B = 12_521_801;
const SEED_C = 12_521_802;

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
  /** retire the Phase-31 cap in this arm */
  capOff?: boolean;
  /** pass the door EXPLICITLY as false rather than omitting it (dormancy's other half) */
  capOffExplicitFalse?: boolean;
  /** DF-T0's persistence law — the trial's floor, armed in BOTH arms */
  persist?: boolean;
  /** DF-T2's decision surface — the trial's floor, armed in BOTH arms */
  surface?: boolean;
  /** IN-T0's snapshot law (the named composition subset) */
  snapshot?: boolean;
  /** IN-T1's look act (the named composition subset) */
  look?: boolean;
  world?: 8 | 9;
  duration?: number;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const base = a.world === undefined
    ? { c7Windup: true, o1PassWindup: true }
    : a4MatchFlags(a.world);
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...(a.duration === undefined ? {} : { duration: a.duration }),
    ...base,
    ...(a.persist === true ? { dfAssignPersist: true } : {}),
    ...(a.surface === true ? { dfSurface: true } : {}),
    ...(a.snapshot === true ? { inSnapshotLaw: true } : {}),
    ...(a.look === true ? { inSnapshotLaw: true, inLookAct: true } : {}),
    ...(a.capOff === true ? { dfCapOff: true } : {}),
    ...(a.capOffExplicitFalse === true ? { dfCapOff: false } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (a.world !== undefined) armA4World(m, null, a.world, L3_DOSE, PC_DOSE);
  return m;
};

/** The house world-identity signature (PW-T0b's, verbatim via PC-T0, BK-T0, BK-T1, DF-T0/T2). */
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
const teamBrainSource = src('ai/TeamBrain.ts');
const matchSource = src('sim/Match.ts');
const hits = (hay: string, needle: RegExp): number => (hay.match(needle) ?? []).length;
const lineHits = (hay: string, line: string): number =>
  hay.split('\n').filter((l) => l === line).length;
const chaserSlice = (source: string): string => source.slice(
  source.indexOf('function assignChasers(team: Team, match: Match): void {'),
  source.indexOf('/**\n * Marks: each non-chasing outfielder'),
);

/* ========================================================================== */
/* THE FOURTH-CHASER FIXTURE — the count the cap ALONE refuses                 */
/* ========================================================================== */
/**
 * A hand-placed out-of-possession picture driven by a DIRECT `updateTeamBrain` pass (never by
 * physics), in the DF-T0/DF-T2 form. Every term of the shipped scoring is set explicitly so
 * the arithmetic is asserted, not hoped for:
 *
 *   base                                                 1
 *   `team.mode === 'Press'`                             +1   (the OR's first disjunct)
 *   `team.genome.pressIntensity > 0.78`                 +1   ⭐ the disjunct the OR SWALLOWS
 *   the Phase-112 window, `transitionPress` at the top  +1   ⭐ clipped by `Math.min(…, 3)`
 *                                                       ---
 *   the shipped docblock's own additive total             4
 *
 * so cap-ON must produce THREE chasers and cap-OFF must produce FOUR. The carrier is placed
 * at the centre circle with the ball dead at his feet, which keeps the Phase-32.1 landing
 * chase (an early `return`) and the Phase-30.5 loose-ball duel out of the picture, and the
 * phase is `playing`, which keeps the Phase-28.3/29 dead-ball counts out of it.
 *
 * ⚠ HONEST NOTE ON THE TWO DISJUNCTS: `team.mode` is DERIVED — `updateTeamBrain` recomputes
 * it from `pressScore = pressIntensity + position + hysteresis + derby + window` against the
 * shipped 0.62 threshold every pass, so it cannot be hand-set. The knobs here are therefore
 * the GENE and the BALL's position, and the two disjuncts are separated the world's own way:
 * a 0.7 gene with the ball high presses on MODE alone (the OR fires, the cap-off conjunct
 * does not), while a 0.95 gene fires both.
 */
interface ChaserFixture { m: Match; us: Match['teams'][number] }
const chaserFixture = (
  seed: number, capOff: boolean,
  o: { intense?: number; carrierX?: number; window?: boolean } = {},
): ChaserFixture => {
  const m = matchOf(seed, { world: W9, persist: true, surface: true, capOff });
  while (m.phase !== 'playing') m.step(DT);
  const us = m.teams[0];
  const them = m.teams[1];
  (us.genome as { pressIntensity: number }).pressIntensity = o.intense ?? 0.95;
  (us.genome as { transitionPress: number }).transitionPress = o.window === false ? 0.5 : 1;
  const carrier = them.players[1];
  const cx = o.carrierX ?? 0;
  m.ball.owner = carrier;
  m.possessionSide = 1;
  carrier.pos = { x: cx, y: 0 };
  carrier.vel = { x: 0, y: 0 };
  m.ball.pos = { x: cx, y: 0 };
  m.ball.vel = { x: 0, y: 0 };
  m.ball.z = 0;
  m.ball.vz = 0;
  // the Phase-112 window: we lost it 1.0 s ago, inside the shipped 3.0 s
  (m as { simTime: number }).simTime = 1.0;
  (them as { possessionGainedAt: number }).possessionGainedAt = 0.0;
  updateTeamBrain(us, m);
  return { m, us };
};

/* ========================================================================== */
/* §DORMANCY                                                                  */
/* ========================================================================== */
describe('DF T4 — the cap-off arm is dormant (Road B)', () => {
  it('⭐ default-off: dfCapOff false everywhere, and absent from every shipped world', () => {
    const bare = new Match({ seed: 7, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.dfCapOff).toBe(false);
    const league = new League({ seed: 20260822 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.dfCapOff).toBe(false);
    for (const w of [W8, W9] as const) {
      expect((a4MatchFlags(w) as Record<string, unknown>).dfCapOff).toBeUndefined();
    }
    expect(src('game/a4World.ts')).not.toContain('dfCapOff');
  });

  it('⭐⭐ ROAD B DORMANCY (STRONG): ABSENT ≡ EXPLICIT-FALSE, both worlds × 2 seeds, pooled', () => {
    const absent: string[] = [];
    const explicitFalse: string[] = [];
    for (const world of [W8, W9] as const) {
      for (const seed of [SEED_A, SEED_B]) {
        absent.push(signatureOf(matchOf(seed, { world })));
        explicitFalse.push(signatureOf(matchOf(seed, { world, capOffExplicitFalse: true })));
      }
    }
    // per-cell AND pooled — the pooled digest is the one line a mutant must move
    expect(explicitFalse).toEqual(absent);
    const digest = (xs: string[]): string =>
      createHash('sha256').update(xs.join('|')).digest('hex');
    expect(digest(explicitFalse)).toBe(digest(absent));
  });

  it('⭐⭐ DORMANCY AT THE TRIAL\'S OWN STACK — absent ≡ explicit-false with persist+surface', () => {
    for (const seed of [SEED_A, SEED_B]) {
      const absent = signatureOf(matchOf(seed, { world: W9, persist: true, surface: true }));
      const ef = signatureOf(matchOf(seed, {
        world: W9, persist: true, surface: true, capOffExplicitFalse: true,
      }));
      expect(ef).toBe(absent);
    }
  });

  /**
   * ⚠⚠ AN HONEST PIN, NOT A CONVENIENT ONE: arming this door is a real change, but NOT on
   * every walk. The bypass fires only where the shipped scoring already wanted the extra
   * body (Press mode AND `pressIntensity > 0.78` in the same pass, or the Phase-112 window
   * on top of an already-3 count), and a random genome pair may never present that picture
   * in 240 s. Measured at this commit over the suite's three seeds × both world shapes:
   * 12,521,800 SAME in both worlds · 12,521,801 MOVES in both · 12,521,802 MOVES in world 8,
   * SAME in world 9 — so the pin is POOLED (≥1 moving cell per world), and the deterministic
   * evidence that the seam bites lives in the constructed fixture below.
   */
  it('⭐ arming it is a REAL change — pooled over seeds, each world has a moving cell', () => {
    for (const world of [W8, W9] as const) {
      const moves = [SEED_A, SEED_B, SEED_C].map((seed) => {
        const shut = signatureOf(matchOf(seed, { world, persist: true, surface: true }));
        const open = signatureOf(matchOf(seed, {
          world, persist: true, surface: true, capOff: true,
        }));
        return open !== shut;
      });
      expect(moves.some(Boolean)).toBe(true);
    }
  });
});

/* ========================================================================== */
/* §THE SHIPPED CAP — NEVER DELETED, NEVER REWORDED                            */
/* ========================================================================== */
describe('DF T4 §THE SHIPPED CAP CODE IS UNTOUCHED (the bypass is purely ADDITIVE)', () => {
  it('⭐⭐ every shipped `assignChasers` statement is still VERBATIM, exactly once', () => {
    const slice = chaserSlice(teamBrainSource);
    expect(slice.length).toBeGreaterThan(1000);
    // the DF-T0 pin's own list (tests/dfAssignPersist.test.ts), inherited VERBATIM — plus
    // the docblock line whose ADDITIVE arithmetic the cap-off arm restores.
    for (const rule of [
      '  let count = 1;',
      '    if (team.mode === \'Press\' || team.genome.pressIntensity > 0.78) count += 1;',
      '    if (possession === -1) count = Math.min(count, 1);',
      '        if (tp > 0.3) count = Math.min(count + 1, 3);',
      '        else if (tp < -0.3) count = Math.min(count, 1);',
      '  if (match.phase === \'restart\') count = match.restart?.kind === \'goalKick\' ? 0 : 1;',
      '  for (const p of byDist.slice(0, count)) team.chasers.add(p.index);',
    ]) {
      expect(lineHits(slice, rule)).toBe(1);
    }
    // the docblock's own additive form — the cap-off arm's SOURCE OF ARITHMETIC, not a taste
    expect(lineHits(teamBrainSource,
      ' * shape/marks. Count scales with pressing: 1 base, +1 in Press mode, +1 for')).toBe(1);
    expect(lineHits(teamBrainSource, ' * extreme pressIntensity.')).toBe(1);
    // the surface's needles never reach this function (M-DF.2's letter, inherited)
    expect(slice).not.toContain('dfSurface');
    expect(slice).not.toContain('markSagMetres');
    expect(slice).not.toContain('dfAssignPersist');
  });

  it('⭐⭐ the bypass is TWO flag-gated statements, and the slice sha is recorded', () => {
    const slice = chaserSlice(teamBrainSource);
    expect(hits(slice, /match\.dfCapOff/g)).toBe(2);
    expect(lineHits(slice,
      '    if (match.dfCapOff && team.mode === \'Press\' && team.genome.pressIntensity > 0.78) count += 1;',
    )).toBe(1);
    expect(lineHits(slice, '        if (match.dfCapOff && tp > 0.3) count = beforeWindow + 1;')).toBe(1);
    expect(lineHits(slice, '        const beforeWindow = count;')).toBe(1);
    // ⚠ DF-T2 §R6's sha of record (5b4a21d0…703c) MOVED BY CONSTRUCTION at this commit —
    // the seam lives inside the sliced function. The sha stays as a CHANGE DETECTOR at its
    // new value; the DISCIPLINE it used to carry is the four-chaser-bin pin below
    // (ruling #336 item 5: "the cap slice's sha discipline is replaced by an explicit pin").
    expect(createHash('sha256').update(slice).digest('hex')).toBe(
      '0ae63c71098c8fe12ddf262b8aed57c0b707d21ddef49dc581f1fa49d9c71d62',
    );
  });

  it('⭐⭐ FLAG OFF ⇒ THE FOUR-CHASER BIN IS EXACTLY ZERO AS EVER (the explicit pin)', () => {
    const m = matchOf(SEED_C, { world: W9, persist: true, surface: true, duration: 240 });
    const bins = [0, 0, 0, 0, 0];
    while (!m.finished) {
      m.step(DT);
      if (m.phase !== 'playing') continue;
      for (const t of m.teams) {
        if (m.possessionSide === t.side) continue;
        bins[Math.min(4, t.chasers.size)] += 1;
      }
    }
    expect(bins[4]).toBe(0);
    expect(bins[0] + bins[1] + bins[2] + bins[3]).toBeGreaterThan(0);
  });
});

/* ========================================================================== */
/* §THE BYPASS IS A REAL CHANGE — the fourth chaser the cap ALONE refuses       */
/* ========================================================================== */
describe('DF T4 §THE BYPASS BITES — a fourth chaser is scored-for and the cap stops him', () => {
  it('⭐⭐ the constructed fixture: cap-ON licenses THREE, cap-OFF licenses FOUR', () => {
    for (const seed of [SEED_A, SEED_B, SEED_C]) {
      const on = chaserFixture(seed, false);
      const off = chaserFixture(seed, true);
      // the shipped scoring's own terms, ASSERTED (never assumed) on both arms
      for (const f of [on, off]) {
        expect(f.us.mode).toBe('Press');
        expect(f.us.genome.pressIntensity).toBeGreaterThan(0.78);
        expect(f.m.phase).toBe('playing');
        expect(f.m.possessionSide).toBe(1);
      }
      expect(on.us.chasers.size).toBe(3); // ⭐ the cap's own ceiling
      expect(off.us.chasers.size).toBe(4); // ⭐ the docblock's additive total
      expect(on.m.dfCapOff).toBe(false);
      expect(off.m.dfCapOff).toBe(true);
    }
  });

  it('⭐⭐ STATEMENT 1 IS LOAD-BEARING — the OR-collapse\'s swallowed +1, window OUT', () => {
    // no transition window: the shipped OR gives 2 (Press ∨ intense), the additive form 3.
    for (const seed of [SEED_A, SEED_C]) {
      const on = chaserFixture(seed, false, { window: false });
      const off = chaserFixture(seed, true, { window: false });
      expect(on.us.mode).toBe('Press');
      expect(on.us.chasers.size).toBe(2);
      expect(off.us.chasers.size).toBe(3);
    }
    // ⭐ SPECIFICITY: it fires ONLY when BOTH disjuncts hold. A 0.7 gene with the ball high
    // presses on MODE alone — the shipped OR still gives its +1, and the cap-off statement
    // adds NOTHING, because the shipped scoring never wanted a third body here.
    for (const seed of [SEED_A, SEED_C]) {
      const on = chaserFixture(seed, false, { window: false, intense: 0.7, carrierX: 30 });
      const off = chaserFixture(seed, true, { window: false, intense: 0.7, carrierX: 30 });
      expect(on.us.mode).toBe('Press');
      expect(on.us.genome.pressIntensity).toBeLessThan(0.78);
      expect(on.us.chasers.size).toBe(2);
      expect(off.us.chasers.size).toBe(2);
    }
    // …and with neither disjunct (a calm gene, the ball deep) both arms license ONE
    for (const seed of [SEED_A, SEED_C]) {
      const on = chaserFixture(seed, false, { window: false, intense: 0.1 });
      const off = chaserFixture(seed, true, { window: false, intense: 0.1 });
      expect(on.us.mode).toBe('Defend');
      expect(on.us.chasers.size).toBe(1);
      expect(off.us.chasers.size).toBe(1);
    }
  });

  it('⭐⭐ STATEMENT 2 IS LOAD-BEARING — the Phase-112 `Math.min(…, 3)` ceiling', () => {
    // a NON-pressing side with a calm gene: base 1 + the window's 1 = 2 either way, so the
    // ceiling is not reached and statement 2 must change NOTHING.
    for (const seed of [SEED_A, SEED_C]) {
      const on = chaserFixture(seed, false, { intense: 0.1 });
      const off = chaserFixture(seed, true, { intense: 0.1 });
      expect(on.us.mode).toBe('Defend');
      expect(on.us.chasers.size).toBe(2);
      expect(off.us.chasers.size).toBe(2);
    }
    // the ceiling BITES only once the additive count is already at 3 — the full fixture,
    // where cap-off's 4 exists ONLY because statement 2 lifted min(4, 3) back to 4.
    expect(chaserFixture(SEED_B, true).us.chasers.size).toBe(4);
    expect(chaserFixture(SEED_B, false).us.chasers.size).toBe(3);
  });

  it('⭐ the NON-cap rules of that function are untouched by the door', () => {
    // Phase-28.3/29 dead ball: the count is the restart count in BOTH arms (1 or 0), so the
    // bypass cannot leak into a restart even with every scoring term maxed.
    for (const capOff of [false, true]) {
      const f = chaserFixture(SEED_A, capOff);
      const m = f.m;
      (m as { phase: string }).phase = 'restart';
      (m as { restart: { kind: string; takerGid: number } | null }).restart =
        { kind: 'throwIn', takerGid: m.teams[1].players[1].gid };
      updateTeamBrain(f.us, m);
      expect(f.us.chasers.size).toBe(1);
    }
    // the opposing keeper holding it ⇒ ZERO pressers in BOTH arms (Phase 28.1/29.1/31.9)
    for (const capOff of [false, true]) {
      const f = chaserFixture(SEED_A, capOff);
      const gk = f.m.teams[1].players.find((p) => p.role === 'GK')!;
      f.m.ball.owner = gk;
      (gk as { gkHoldTimer: number }).gkHoldTimer = 1;
      updateTeamBrain(f.us, f.m);
      expect(f.us.chasers.size).toBe(0);
    }
  });
});

/* ========================================================================== */
/* §COMPOSITION                                                               */
/* ========================================================================== */
describe('DF T4 §FLAG SEMANTICS — it composes freely, and owns no refusal', () => {
  it('⭐⭐ THE POWER SET BUILDS: {dfCapOff} × {dfAssignPersist} × {dfSurface} at world 9', () => {
    for (const capOff of [false, true]) {
      for (const persist of [false, true]) {
        for (const surface of [false, true]) {
          const m = matchOf(SEED_A, { world: W9, capOff, persist, surface });
          expect(m.dfCapOff).toBe(capOff);
          expect(m.dfAssignPersist).toBe(persist);
          expect(m.dfSurface).toBe(surface);
          m.step(DT); // it RUNS in every cell — no refusal, no inert composition
        }
      }
    }
  });

  it('⭐ the NAMED SUBSET: + inSnapshotLaw and + inLookAct both build and run', () => {
    for (const capOff of [false, true]) {
      const snap = matchOf(SEED_B, {
        world: W9, persist: true, surface: true, snapshot: true, capOff,
      });
      expect(snap.inSnapshotLaw).toBe(true);
      expect(snap.dfCapOff).toBe(capOff);
      snap.step(DT);
      const look = matchOf(SEED_B, {
        world: W9, persist: true, surface: true, look: true, capOff,
      });
      expect(look.inLookAct).toBe(true);
      expect(look.dfCapOff).toBe(capOff);
      look.step(DT);
    }
  });

  it('⭐ the trial\'s FOUR stack cells are DISTINCT worlds (none is a no-op of another)', () => {
    const sig = (capOff: boolean, surface: boolean): string =>
      signatureOf(matchOf(SEED_B, { world: W9, persist: true, surface, capOff }));
    const cells = [sig(false, false), sig(false, true), sig(true, false), sig(true, true)];
    expect(new Set(cells).size).toBe(4);
  });

  it('⭐ no constructor refusal anywhere names this flag', () => {
    for (const chunk of matchSource.split('throw new Error(').slice(1)) {
      expect(chunk.slice(0, 600)).not.toContain('dfCapOff');
    }
  });

  it('⭐ the seam adds NO SERIALIZED state at all', () => {
    const leagueSource = src('sim/League.ts');
    expect(hits(leagueSource, /dfCapOff/g)).toBe(1); // the matchFlags key union only
    expect(src('sim/Team.ts')).not.toContain('dfCapOff');
    expect(src('sim/cloneState.ts')).not.toContain('dfCapOff');
    expect(src('render3d/RenderStateAdapter.ts')).not.toContain('dfCapOff');
    const league = new League({ seed: 20260822 });
    expect(JSON.stringify(league.toJSON())).not.toContain('dfCapOff');
    // canon VERBATIM: "WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits
    // matchFlags; true since #155, stated now, test-pinned; refines #270's E4 correction;
    // matches the perf diagnostic)" (home: ruling #283.2(iv))
    league.matchFlags = { dfCapOff: true, dfAssignPersist: true, dfSurface: true };
    expect(JSON.stringify(league.toJSON())).not.toContain('dfCapOff');
    expect(league.createMatch(league.nextFixture()!).dfCapOff).toBe(true);
  });
});

/* ========================================================================== */
/* §SEAM MAP                                                                  */
/* ========================================================================== */
describe('DF T4 §SEAM MAP — occurrence COUNTS per needle (canon: PC-C0 §CORR item 1)', () => {
  it('⭐⭐ THE PREFIX `dfCapOff` — every occurrence, counted and sited', () => {
    // PREFIX STATED: ONE needle family, `dfCapOff` (there is no second spelling — the door
    // carries no ledger, no type and no constant).
    // Match.ts: 4 — the cfg field · the readonly field · the `this.`/`cfg.` pair (ONE line,
    // TWO occurrences). No prose mention: both docblocks name the door by its role.
    expect(hits(matchSource, /dfCapOff\?: boolean;/g)).toBe(1);
    expect(hits(matchSource, /^ {2}readonly dfCapOff: boolean;$/gm)).toBe(1);
    expect(hits(matchSource, /this\.dfCapOff = cfg\.dfCapOff \?\? false;/g)).toBe(1);
    expect(hits(matchSource, /dfCapOff/g)).toBe(4);
    // TeamBrain.ts: the ONE consuming site is `assignChasers` — every read is `match.dfCapOff`
    expect(hits(teamBrainSource, /match\.dfCapOff/g)).toBe(2);
    expect(hits(teamBrainSource, /dfCapOff/g)).toBe(3); // + the ONE docblock mention
    expect(hits(chaserSlice(teamBrainSource), /dfCapOff/g)).toBe(3);
    // League.ts: the matchFlags key union only
    expect(hits(src('sim/League.ts'), /dfCapOff/g)).toBe(1);
    // nothing else in src names the seam at all
    for (const rel of ['ai/PlayerBrain.ts', 'ai/actionExecutor.ts', 'sim/mechanics.ts',
      'sim/Player.ts', 'sim/Team.ts', 'sim/cloneState.ts', 'game/a4World.ts',
      'ai/defensiveCoordination.ts', 'render3d/RenderStateAdapter.ts']) {
      expect(src(rel)).not.toContain('dfCapOff');
    }
  });

  it('⭐⭐ THE COORDINATION MODULE STAYS UNWIRED (M-DF.4 — coordination is OUT)', () => {
    for (const rel of ['ai/TeamBrain.ts', 'ai/PlayerBrain.ts', 'ai/actionExecutor.ts',
      'sim/Match.ts', 'sim/mechanics.ts', 'game/a4World.ts']) {
      expect(src(rel)).not.toMatch(/from '[^']*defensiveCoordination'/);
      expect(src(rel)).not.toMatch(/import\([^)]*defensiveCoordination/);
    }
  });
});

describe('DF T4 — the production world is untouched', () => {
  it('⭐ the fingerprint of record is a literal in this suite, and the seam may not move it', () => {
    expect(FINGERPRINT_OF_RECORD).toBe(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
    expect(new Match({ seed: 1, teamA: team('A', 1), teamB: team('B', 2) }).dfCapOff)
      .toBe(false);
  });
});
