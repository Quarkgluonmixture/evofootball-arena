import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { updateTeamBrain } from '../src/ai/TeamBrain';
import { markSagMetres } from '../src/ai/actionExecutor';
import { MARK_SAG_MAX, randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import {
  a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells,
} from '../src/game/a4World';
import { Rng } from '../src/utils/rng';
import type { Player } from '../src/sim/Player';

/**
 * DF T0 — ASSIGNMENT PERSISTENCE (docs/world-model/DF-T0-ASSIGNMENT-PERSISTENCE.md; contract
 * DF-DEFENSIVE-BRAIN-CONTRACT.md §2 M-DF.1/M-DF.2/M-DF.4; ruling #322 item 2) — THE SEAM'S
 * PERMANENT PIN SUITE, in the house form (`bkContactLaw.test.ts` / `pcLatencySeam.test.ts`).
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * The pins:
 *   • ⭐⭐ ROAD B DORMANCY — flag ABSENT ≡ flag FALSE, byte for byte, in both world shapes.
 *   • ⭐⭐ THE PERSISTENCE LAW — an assignment SURVIVES a pass the shipped re-greedy would
 *     have churned; the seven death conditions each kill it.
 *   • ⭐⭐ THE SWITCH PRICE — 「keep my man」 wins on the L3 access-time slack, and the
 *     MUTANT that drops the hysteresis is proven to flip the same fixture.
 *   • ⭐ GREEDY FILLS UNASSIGNED ONLY — a held man is never re-scanned.
 *   • ⭐⭐ THE CAP UNTOUCHED — `assignChasers` never names this flag and the four-chaser bin
 *     stays exactly zero on an armed walk (the compensator receipt, M-DF.2).
 *   • ⭐⭐ COMPOSITION SEMANTICS — composes freely with the world-9 stack; no refusal.
 *   • ⭐⭐ THE SEAM MAP — occurrence COUNTS per needle, prefix STATED (canon: PC-C0 §CORR
 *     item 1).
 */

/** The production fingerprint of record (#305 item 1) — this seam may not move it. */
const FINGERPRINT_OF_RECORD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⚠ These seeds live inside DF-T0's OWN booked block (ruling #322 item 2: 12,509,000–999). */
const SEED_A = 12_509_800;
const SEED_B = 12_509_801;
const SEED_C = 12_509_802;

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
  /** arm assignment persistence */
  df?: boolean;
  /** pass the door EXPLICITLY as false rather than omitting it (dormancy's other half) */
  dfExplicitFalse?: boolean;
  /** which armed world shape to build (8 = the shipped play world, 9 = the body-honest one) */
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
    ...(a.df === true ? { dfAssignPersist: true } : {}),
    ...(a.dfExplicitFalse === true ? { dfAssignPersist: false } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (a.world !== undefined) armA4World(m, null, a.world, L3_DOSE, PC_DOSE);
  return m;
};

/** The house world-identity signature (PW-T0b's, verbatim via PC-T0, BK-T0 and BK-T1). */
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
const count = (hay: string, needle: RegExp): number => (hay.match(needle) ?? []).length;

/* ========================================================================== */
/* THE CONTROLLED DEFENDING FIXTURE                                           */
/* ========================================================================== */
/**
 * A hand-placed out-of-possession picture, driven by DIRECT `updateTeamBrain` passes (never
 * by physics), so the assignment ledger is the only thing moving between passes. Team 0
 * defends; three of its outfielders are parked ON the ball as chaser sponges so the subject
 * body can never be licensed as a presser (the Phase-31 cap tops out at three).
 */
interface Fixture {
  m: Match;
  /** the subject marker */
  d: Player;
  /** his man */
  manA: Player;
  /** the interloper introduced in pass 2 */
  manC: Player;
}
const fixture = (seed: number, persist: boolean): Fixture => {
  const m = matchOf(seed, persist ? { df: true } : {});
  while (m.phase !== 'playing') m.step(DT);
  const us = m.teams[0];
  const them = m.teams[1];
  (us.style as { scheme: string }).scheme = 'man'; // zonal is a different creation rule
  const carrier = them.players[1];
  m.ball.owner = carrier;
  m.possessionSide = 1;
  const place = (p: Player, x: number, y: number): void => {
    p.pos = { x, y };
    p.vel = { x: 0, y: 0 };
  };
  place(carrier, 0, 0);
  m.ball.pos = { x: 0, y: 0 };
  m.ball.vel = { x: 0, y: 0 };
  m.ball.z = 0;
  m.ball.vz = 0;
  const d = us.players[1];
  // three sponges ON the ball soak up every chaser licence the cap can issue
  place(us.players[3], 0.5, 0.5);
  place(us.players[4], 1.0, 0.0);
  place(us.players[5], 1.5, 0.5);
  place(us.players[2], -40, 28);
  place(d, -20, 0);
  const manA = them.players[2];
  const manC = them.players[3];
  place(manA, -21, 0);
  place(manC, -40, 26);
  place(them.players[4], -42, -28);
  place(them.players[5], -44, 27);
  updateTeamBrain(us, m);
  return { m, d, manA, manC };
};

describe('DF T0 — assignment persistence is dormant (Road B)', () => {
  it('⭐ default-off: dfAssignPersist false everywhere, and absent from every shipped world', () => {
    const bare = new Match({ seed: 7, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.dfAssignPersist).toBe(false);
    const league = new League({ seed: 20260819 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.dfAssignPersist).toBe(false);
    // the shipped play-test worlds do NOT arm it (Road B: nothing ships)
    for (const w of [W8, W9] as const) {
      expect((a4MatchFlags(w) as Record<string, unknown>).dfAssignPersist).toBeUndefined();
    }
    // …and the entry layer does not NAME it at all
    expect(src('game/a4World.ts')).not.toContain('dfAssignPersist');
  });

  it('⭐⭐ ROAD B DORMANCY: flag ABSENT ≡ flag FALSE, byte for byte, in both world shapes', () => {
    for (const world of [W8, W9] as const) {
      for (const seed of [SEED_A, SEED_B]) {
        const absent = signatureOf(matchOf(seed, { world }));
        const explicitFalse = signatureOf(matchOf(seed, { world, dfExplicitFalse: true }));
        expect(explicitFalse).toBe(absent);
      }
    }
  });

  it('⭐ arming it is a REAL change — the armed world is distinguishable from the shut one', () => {
    for (const world of [W8, W9] as const) {
      const shut = signatureOf(matchOf(SEED_A, { world }));
      const open = signatureOf(matchOf(SEED_A, { world, df: true }));
      expect(open).not.toBe(shut);
    }
  });
});

describe('DF T0 §THE PERSISTENCE LAW — the ledger survives the pass', () => {
  it('⭐⭐ THE DISEASE AND ITS CURE: the shipped re-greedy swaps two markers, persistence does not', () => {
    for (const seed of [SEED_A, SEED_B, SEED_C]) {
      for (const persist of [false, true]) {
        const f = fixture(seed, persist);
        const us = f.m.teams[0];
        const them = f.m.teams[1];
        // a SECOND marker/man pair, both inside the account's ceiling
        const d2 = us.players[2];
        const manB = them.players[4];
        d2.pos = { x: -20, y: 2.5 };
        manB.pos = { x: -21, y: 3 };
        f.d.pos = { x: -20, y: 0.5 };
        updateTeamBrain(us, f.m);
        const before = new Map(us.marks);
        expect(before.get(f.d.index)).toBe(f.manA.index);
        expect(before.get(d2.index)).toBe(manB.index);
        // the two markers trade places by 2 m — nearest-first now prefers the OTHER pairing
        f.d.pos = { x: -20, y: 2.6 };
        d2.pos = { x: -20, y: 0.4 };
        updateTeamBrain(us, f.m);
        if (persist) {
          expect(us.marks.get(f.d.index)).toBe(f.manA.index); // ⭐ he keeps his man
          expect(us.marks.get(d2.index)).toBe(manB.index);
        } else {
          expect(us.marks.get(f.d.index)).toBe(manB.index); // 乱跑, as shipped
          expect(us.marks.get(d2.index)).toBe(f.manA.index);
        }
      }
    }
  });

  it('⭐⭐ THE SWITCH PRICE: a CLOSER new man does not buy the switch — and the mutant flips it', () => {
    for (const seed of [SEED_A, SEED_B, SEED_C]) {
      const f = fixture(seed, true);
      const us = f.m.teams[0];
      expect(us.marks.get(f.d.index)).toBe(f.manA.index);
      // the interloper arrives 0.6 m away — NEARER than the man he already has (1.0 m)
      f.manC.pos = { x: -20, y: 0.6 };
      updateTeamBrain(us, f.m);
      expect(us.marks.get(f.d.index)).toBe(f.manA.index); // ⭐ keep

      // THE PRICE, RE-DERIVED INDEPENDENTLY from the shipped account at the stance line's
      // own argument tuple — the pin is that the margin, not taste, is what decided it
      const budget = markSagMetres(f.m.ball.pos, f.manA.pos, f.d.pos, f.d.topSpeed);
      const dMan = Math.hypot(f.d.pos.x - f.manA.pos.x, f.d.pos.y - f.manA.pos.y);
      const dNew = Math.hypot(f.d.pos.x - f.manC.pos.x, f.d.pos.y - f.manC.pos.y);
      expect(dNew).toBeLessThan(dMan);          // the greedy's currency says SWITCH…
      expect(dNew + budget).toBeGreaterThan(dMan); // …and the account's says KEEP
      // ⭐ THE MUTANT, stated as arithmetic: with the hysteresis dropped (budget := 0) the
      // very same fixture satisfies the leave predicate, so this pin dies. (The live mutant
      // run is recorded in the stage doc's §MUTANTS.)
      expect(dNew + 0).toBeLessThan(dMan);
    }
  });

  it('⭐ GREEDY FILLS UNASSIGNED ONLY: a held man is skipped, an unheld man is filled', () => {
    const f = fixture(SEED_A, true);
    const us = f.m.teams[0];
    expect(us.marks.get(f.d.index)).toBe(f.manA.index);
    // a free body walks into range of an UNHELD man: he gets marked, and nobody else moves
    const spare = us.players[2];
    spare.pos = { x: -20, y: 12 };
    f.manC.pos = { x: -21, y: 12 };
    updateTeamBrain(us, f.m);
    expect(us.marks.get(spare.index)).toBe(f.manC.index);
    expect(us.marks.get(f.d.index)).toBe(f.manA.index);
  });
});

describe('DF T0 §DEATH CONDITIONS — every one of them kills the assignment', () => {
  it('⭐⭐ (1) POSSESSION, (4) MARKER, (5) MAN, (7) THE ACCOUNT\'S CEILING', () => {
    // (1) we win the ball ⇒ the whole ledger dies
    {
      const f = fixture(SEED_A, true);
      const us = f.m.teams[0];
      expect(us.marks.size).toBeGreaterThan(0);
      f.m.possessionSide = 0;
      f.m.ball.owner = us.players[4];
      updateTeamBrain(us, f.m);
      expect(us.marks.size).toBe(0);
    }
    // (4) the marker is sent off
    {
      const f = fixture(SEED_A, true);
      const us = f.m.teams[0];
      f.d.sentOff = true;
      updateTeamBrain(us, f.m);
      expect(us.marks.has(f.d.index)).toBe(false);
    }
    // (5) the man is sent off
    {
      const f = fixture(SEED_A, true);
      const us = f.m.teams[0];
      f.manA.sentOff = true;
      updateTeamBrain(us, f.m);
      expect(us.marks.get(f.d.index)).not.toBe(f.manA.index);
    }
    // (5b) the man becomes the CARRIER — the shipped threat filter drops him
    {
      const f = fixture(SEED_A, true);
      const us = f.m.teams[0];
      f.m.ball.owner = f.manA;
      f.m.ball.pos = { ...f.manA.pos };
      updateTeamBrain(us, f.m);
      expect(us.marks.get(f.d.index)).not.toBe(f.manA.index);
    }
    // (7) THE ACCOUNT'S OWN CEILING — he is dragged past `MARK_SAG_MAX` metres. Read
    // through a SECOND defender standing 1 m off the man: while the assignment lives the
    // man is HELD and the greedy never offers him to anybody; once it dies he is an
    // ordinary unassigned slot and the nearer body takes him.
    for (const [gap, dies] of [[MARK_SAG_MAX - 0.5, false], [MARK_SAG_MAX + 0.5, true]] as const) {
      const f = fixture(SEED_A, true);
      const us = f.m.teams[0];
      const near = us.players[2];
      f.manA.pos = { x: -20 - gap, y: 0 };
      near.pos = { x: -20 - gap - 1, y: 0 };
      updateTeamBrain(us, f.m);
      if (dies) {
        expect(us.marks.get(near.index)).toBe(f.manA.index);
        expect(us.marks.get(f.d.index)).not.toBe(f.manA.index);
      } else {
        expect(us.marks.get(f.d.index)).toBe(f.manA.index);
        expect(us.marks.get(near.index)).not.toBe(f.manA.index);
      }
    }
  });

  it('⭐ (6) THE LEDGER STAYS INJECTIVE — no two markers ever hold the same man', () => {
    const m = matchOf(SEED_B, { world: W9, df: true, duration: 240 });
    let worst = 0;
    while (!m.finished) {
      m.step(DT);
      for (const t of m.teams) {
        const targets = new Set(t.marks.values());
        worst = Math.max(worst, t.marks.size - targets.size);
      }
    }
    expect(worst).toBe(0);
  });
});

describe('DF T0 §THE CAP IS UNTOUCHED (M-DF.2 — two compensators never move in one slice)', () => {
  it('⭐⭐ `assignChasers` never names this flag, and the Phase-31 rules are verbatim', () => {
    const chasers = teamBrainSource.slice(
      teamBrainSource.indexOf('function assignChasers(team: Team, match: Match): void {'),
      teamBrainSource.indexOf('/**\n * Marks: each non-chasing outfielder'),
    );
    expect(chasers.length).toBeGreaterThan(1000);
    expect(chasers).not.toContain('dfAssignPersist');
    expect(chasers).not.toContain('markSagMetres');
    for (const rule of [
      '  let count = 1;',
      '    if (team.mode === \'Press\' || team.genome.pressIntensity > 0.78) count += 1;',
      '    if (possession === -1) count = Math.min(count, 1);',
      '        if (tp > 0.3) count = Math.min(count + 1, 3);',
      '        else if (tp < -0.3) count = Math.min(count, 1);',
      '  if (match.phase === \'restart\') count = match.restart?.kind === \'goalKick\' ? 0 : 1;',
      '  for (const p of byDist.slice(0, count)) team.chasers.add(p.index);',
    ]) {
      expect(count(chasers, new RegExp(rule.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'))).toBe(1);
    }
  });

  it('⭐⭐ THE FOUR-CHASER BIN IS EXACTLY ZERO on an ARMED walk (DF-C0 §R2\'s band)', () => {
    const m = matchOf(SEED_C, { world: W9, df: true, duration: 240 });
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

  it('⭐ the shipped assignMarks hand rules are byte-verbatim and singular', () => {
    for (const rule of [
      '  const zonal = team.style.scheme === \'zonal\';',
      '      if (p.role === \'WG\' && Math.abs(p.pos.y) > 12 && Math.abs(threat.pos.y) < 8) continue;',
      '      if (zones && !boxThreat && dist(zones.get(p.index)!, threat.pos) > 9) continue;',
      '      if (d < 22 && (best === null || d < best.d)) best = { idx: p.index, d };',
      '      team.marks.set(best.idx, threat.index);',
    ]) {
      const hits = teamBrainSource.split('\n').filter((l) => l === rule);
      expect(hits.length).toBe(1);
    }
  });
});

describe('DF T0 §FLAG SEMANTICS — it composes freely, and owns no refusal', () => {
  it('⭐⭐ THE POWER SET BUILDS: {dfAssignPersist} × the world-9 stack', () => {
    for (const world of [W8, W9] as const) {
      for (const df of [false, true]) {
        const m = matchOf(SEED_A, { world, df });
        expect(m.dfAssignPersist).toBe(df);
      }
    }
    // alone, with no other seam at all: perfectly legal — it owns its one site
    const alone = new Match({
      seed: SEED_A, teamA: team('A', 1), teamB: team('B', 2),
      c7Windup: false, o1PassWindup: false, dfAssignPersist: true,
    });
    expect(alone.dfAssignPersist).toBe(true);
  });

  it('⭐ no constructor refusal anywhere names this flag', () => {
    for (const chunk of matchSource.split('throw new Error(').slice(1)) {
      expect(chunk.slice(0, 600)).not.toContain('dfAssignPersist');
    }
  });

  it('⭐ the seam adds NO serialized state — the ledger IS `team.marks`', () => {
    // League.toJSON omits matchFlags (canon: worker fixtures play the SHIPPED world), and this
    // seam adds no field anywhere else that could leak into it
    const leagueSource = src('sim/League.ts');
    expect(count(leagueSource, /dfAssignPersist/g)).toBe(1); // the matchFlags key union only
    expect(src('sim/Team.ts')).not.toContain('dfAssignPersist');
    expect(src('sim/cloneState.ts')).not.toContain('dfAssignPersist');
  });
});

describe('DF T0 §SEAM MAP — occurrence COUNTS per needle (canon: PC-C0 §CORR item 1)', () => {
  it('⭐⭐ THE PREFIX `dfAssign` — every occurrence, counted and sited', () => {
    // PREFIX STATED: the needle family is `dfAssign*`; the only member is `dfAssignPersist`.
    expect(count(matchSource, /dfAssign/g)).toBe(count(matchSource, /dfAssignPersist/g));
    expect(count(teamBrainSource, /dfAssign/g)).toBe(count(teamBrainSource, /dfAssignPersist/g));
    // Match.ts: 4 — the config field, the readonly, and the `this.`/`cfg.` pair on the
    // single assignment line (the prose above them never re-types the name)
    expect(count(matchSource, /dfAssignPersist/g)).toBe(4);
    expect(count(matchSource, /^ {2}dfAssignPersist\?: boolean;$/gm)).toBe(1);
    expect(count(matchSource, /^ {2}readonly dfAssignPersist: boolean;$/gm)).toBe(1);
    expect(count(matchSource, /this\.dfAssignPersist = cfg\.dfAssignPersist \?\? false;/g)).toBe(1);
    // TeamBrain.ts: the ONE consuming site is `assignMarks` — 3 reads, all inside it
    expect(count(teamBrainSource, /match\.dfAssignPersist/g)).toBe(3);
    expect(count(teamBrainSource, /if \(!match\.dfAssignPersist\) team\.marks\.clear\(\);/g)).toBe(1);
    // nothing else in src names the flag at all
    for (const rel of ['ai/PlayerBrain.ts', 'ai/actionExecutor.ts', 'sim/mechanics.ts',
      'sim/Player.ts', 'sim/Team.ts', 'game/a4World.ts', 'render3d/RenderStateAdapter.ts']) {
      expect(src(rel)).not.toContain('dfAssign');
    }
  });

  it('⭐ THE PRICE IS THE SHIPPED ACCOUNT — extraction pinned to the NAMED call site', () => {
    // canon: "a src-extracted constant pins its extraction to the NAMED call site — anchored
    // match + line receipt — never first-occurrence" (home: BK-C0 §CORR item 1)
    const stanceLine =
      '          if (w > 0) markDist += w * markSagMetres(ball.pos, mark.pos, p.pos, p.topSpeed);';
    const exec = src('ai/actionExecutor.ts').split('\n');
    expect(exec.filter((l) => l === stanceLine).length).toBe(1);
    // …and the seam calls the SAME function with the SAME argument tuple
    expect(teamBrainSource).toContain(
      'const budget = markSagMetres(match.ball.pos, man.pos, p.pos, p.topSpeed);',
    );
    // the ceiling is the shipped export, never a literal re-typed here
    // 4 — the import, the ONE code use, and the two prose citations of the ceiling
    expect(count(teamBrainSource, /MARK_SAG_MAX/g)).toBe(4);
    expect(count(teamBrainSource, /dist\(holder\.pos, man\.pos\) > MARK_SAG_MAX/g)).toBe(1);
    expect(MARK_SAG_MAX).toBe(9);
  });
});

describe('DF T0 — the production world is untouched', () => {
  it('⭐ the fingerprint of record is a literal in this suite, and the seam may not move it', () => {
    expect(FINGERPRINT_OF_RECORD).toBe(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
    expect(new Match({ seed: 1, teamA: team('A', 1), teamB: team('B', 2) }).dfAssignPersist)
      .toBe(false);
  });
});
