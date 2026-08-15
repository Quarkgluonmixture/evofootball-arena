/**
 * L3 T0 — the DORMANT DEFENCE-BOOK SEAM's pins (docs/world-model/L3-T0-DEFENCE-BOOK-SEAM.md).
 *
 * The receipts live in the probe (`scripts/probes/l3-t0-defence-book-seam.ts`); these are the
 * DURABLE pins the suite keeps honest: the doors are hard false, the book is born absent, the
 * veto is the EK-T0 idiom and is DECLINE-ONLY, the window and the cut are DERIVED from engine
 * constants (never typed), and an armed-to-learn world is byte-identical to the shipped one.
 *
 * Seeds: 12,482,900–911 (the stage's own test-file block).
 */
import { describe, expect, it } from 'vitest';
import { Match } from '../src/sim/Match';
import { League } from '../src/sim/League';
import { DT } from '../src/sim/constants';
import {
  DefenceAccountBook, LungeLabelLedger, L3_DEFENCE_GROUPS, L3_DEFENCE_WINDOW_S,
  L3_RECKLESS_ARRIVAL, arrivalGroup,
} from '../src/ai/defenceBook';
import { ACCEL, TURN_RATE } from '../src/sim/Player';
import { CB_TACKLE_RADIUS } from '../src/sim/carryBeat';
import { a4MatchFlags, armA4World, cbArmedVersion, CB_WORLD_VERSION } from '../src/game/a4World';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const matchOf = (seed: number, cfg: Record<string, unknown> = {}, armed = false): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...(armed ? a4MatchFlags(CB_WORLD_VERSION) : {}), ...cfg,
  } as never);
  if (armed) armA4World(m, null, CB_WORLD_VERSION);
  return m;
};
const signature = (m: Match): string => JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: m.ball.pos, rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => [p.gid, p.pos.x, p.pos.y, p.vel.x, p.vel.y]),
});
const run = (m: Match): Match => { while (!m.finished) m.step(DT); return m; };

describe('L3-T0 — the doors are shut (Road B: nothing ships)', () => {
  it('a fresh Match carries both doors FALSE and no ledger seat', () => {
    const m = matchOf(12_482_900);
    expect(m.l3DefenceLearn).toBe(false);
    expect(m.l3DefenceVeto).toBe(false);
    expect(m.l3Defence).toBeNull();
  });

  it('a League match carries no seat and an unarmed League allocates no book', () => {
    const league = new League({ seed: 12_482_901 });
    const f = league.nextFixture();
    expect(f).toBeTruthy();
    expect(league.createMatch(f!).l3Defence).toBeNull();
    expect(league.defenceBooks).toBeNull();
  });

  it('the index read and the veto are both inert with the doors shut', () => {
    const m = matchOf(12_482_902);
    m.step(DT);
    expect(m.l3DefenceGroup(m.allPlayers[1])).toBe(-1);
    expect(m.l3DefenceDeclines(0, 1)).toBe(false);
  });

  it('the seam is absent from every save', () => {
    const league = new League({ seed: 12_482_903 });
    expect(JSON.stringify(league.toJSON())).not.toContain('l3Defence');
  });
});

describe('L3-T0 — the window and the cut are DERIVED, never typed (#279.3(2))', () => {
  it('the window is the stationary misser\'s recovery bound, in engine constants', () => {
    expect(L3_DEFENCE_WINDOW_S)
      .toBe(Math.sqrt((2 * CB_TACKLE_RADIUS) / ACCEL) + Math.PI / TURN_RATE);
  });

  it('the cut is v* = sqrt(2·ACCEL·R) and satisfies the braking identity exactly', () => {
    expect(L3_RECKLESS_ARRIVAL).toBe(Math.sqrt(2 * ACCEL * CB_TACKLE_RADIUS));
    expect((L3_RECKLESS_ARRIVAL ** 2) / (2 * ACCEL)).toBeCloseTo(CB_TACKLE_RADIUS, 12);
  });

  it('the grain is g2 and the groups are the census\'s own order', () => {
    expect(L3_DEFENCE_GROUPS).toBe(2);
    expect(arrivalGroup(0)).toBe(0);
    expect(arrivalGroup(L3_RECKLESS_ARRIVAL - 1e-9)).toBe(0);
    expect(arrivalGroup(L3_RECKLESS_ARRIVAL)).toBe(1);
    expect(arrivalGroup(L3_RECKLESS_ARRIVAL + 5)).toBe(1);
  });
});

describe('L3-T0 — the book is born absent and counts what it is told', () => {
  it('an empty book serves NO belief and declines nothing', () => {
    const b = new DefenceAccountBook();
    expect(b.total).toBe(0);
    expect(b.beliefVector()).toBeNull();
    expect(b.declinesLunge(0)).toBe(false);
    expect(b.declinesLunge(1)).toBe(false);
  });

  it('the belief is the marginal punished/lunges, 0 on an unseen group', () => {
    const b = new DefenceAccountBook();
    b.note(1, true); b.note(1, true); b.note(1, false);
    expect(b.beliefVector()).toEqual([0, 2 / 3]);
    expect(b.total).toBe(3);
  });

  it('an out-of-range group is ignored, and a reset wipes everything', () => {
    const b = new DefenceAccountBook();
    b.note(9, true);
    expect(b.total).toBe(0);
    b.note(0, true);
    b.reset();
    expect(b.total).toBe(0);
    expect(b.beliefVector()).toBeNull();
  });
});

describe('L3-T0 — the veto is the EK-T0 idiom and is DECLINE-ONLY', () => {
  const build = (l: [number, number], p: [number, number]): DefenceAccountBook => {
    const b = new DefenceAccountBook();
    for (let g = 0; g < 2; g++) for (let k = 0; k < l[g]; k++) b.note(g, k < p[g]);
    return b;
  };

  it('a one-group book has no cross-group reference and declines nothing', () => {
    const b = build([4, 0], [4, 0]);
    expect(b.beliefVector()).not.toBeNull();
    expect(b.declinesLunge(0)).toBe(false);
    expect(b.declinesLunge(1)).toBe(false);
  });

  it('a tie declines nothing (the only literal is 0 — an emptiness test, not a threshold)', () => {
    const b = build([4, 4], [2, 2]);
    expect(b.declinesLunge(0)).toBe(false);
    expect(b.declinesLunge(1)).toBe(false);
  });

  it('the strictly worse group declines and the strictly better one never does', () => {
    const b = build([4, 4], [1, 3]);
    expect(b.declinesLunge(1)).toBe(true);
    expect(b.declinesLunge(0)).toBe(false);
  });

  it('the predicate agrees with an independent float re-derivation over a sweep', () => {
    for (let l0 = 0; l0 <= 3; l0++) for (let p0 = 0; p0 <= l0; p0++) {
      for (let l1 = 0; l1 <= 3; l1++) for (let p1 = 0; p1 <= l1; p1++) {
        const b = build([l0, l1], [p0, p1]);
        const ref = (g: number): boolean => {
          const here = g === 0 ? l0 : l1;
          const other = g === 0 ? l1 : l0;
          const kHere = g === 0 ? p0 : p1;
          const kOther = g === 0 ? p1 : p0;
          if (here === 0 || other === 0) return false;
          return kHere / here > kOther / other;
        };
        expect(b.declinesLunge(0)).toBe(ref(0));
        expect(b.declinesLunge(1)).toBe(ref(1));
      }
    }
  });
});

describe('L3-T0 — the label ledger (M-L3.1, the #279.3 label)', () => {
  it('closes PUNISHED when the carrier gained separation over the window', () => {
    const books: [DefenceAccountBook, DefenceAccountBook] = [
      new DefenceAccountBook(), new DefenceAccountBook(),
    ];
    const led = new LungeLabelLedger(books);
    led.noteMiss(0, 1, 10, 3, 9, 1.0);
    const p = led.open[0];
    led.observeSeparation(p.key, 9, 10 + L3_DEFENCE_WINDOW_S / 2); // too early — nothing moves
    expect(led.closedLabels).toBe(0);
    led.observeSeparation(p.key, 2.5, 10 + L3_DEFENCE_WINDOW_S);
    expect(books[0].lunges).toEqual([0, 1]);
    expect(books[0].punished).toEqual([0, 1]);
  });

  it('closes UNPUNISHED when the carrier lost separation, at the zero-metre threshold', () => {
    const books: [DefenceAccountBook, DefenceAccountBook] = [
      new DefenceAccountBook(), new DefenceAccountBook(),
    ];
    const led = new LungeLabelLedger(books);
    led.noteMiss(1, 0, 0, 3, 9, 2.0);
    led.observeSeparation(led.open[0].key, 1.5, L3_DEFENCE_WINDOW_S + 1);
    expect(books[1].lunges).toEqual([1, 0]);
    expect(books[1].punished).toEqual([0, 0]);
  });

  it('the whistle CENSORS an open window — it is never a zero', () => {
    const books: [DefenceAccountBook, DefenceAccountBook] = [
      new DefenceAccountBook(), new DefenceAccountBook(),
    ];
    const led = new LungeLabelLedger(books);
    led.noteMiss(0, 0, 5, 3, 9, 1.0);
    led.flush();
    expect(led.censored).toBe(1);
    expect(led.closedLabels).toBe(0);
    expect(books[0].total).toBe(0);
  });
});

describe('L3-T0 — dormancy in the world', () => {
  it('the flag ABSENT and the flag FALSE build the same match, armed world', () => {
    const off = signature(run(matchOf(12_482_904, {}, true)));
    const explicit = signature(run(matchOf(12_482_904, { l3DefenceLearn: false }, true)));
    expect(explicit).toBe(off);
  });

  it('armed to LEARN alone the world is byte-identical — and the book fills', () => {
    const books: [DefenceAccountBook, DefenceAccountBook] = [
      new DefenceAccountBook(), new DefenceAccountBook(),
    ];
    const learn = run(matchOf(
      12_482_905, { l3DefenceLearn: true, l3DefenceBooks: books }, true,
    ));
    const off = run(matchOf(12_482_905, {}, true));
    expect(cbArmedVersion(learn)).toBe(CB_WORLD_VERSION);
    expect(signature(learn)).toBe(signature(off));
    expect(learn.l3Defence).not.toBeNull();
    expect(learn.l3Defence!.closedLabels).toBeGreaterThan(0);
    expect(books[0].total + books[1].total).toBe(learn.l3Defence!.closedLabels);
  });

  it('BOTH doors armed on a book born ABSENT leave the world identical until it has earned '
    + 'evidence in both groups (empty ⇒ absent)', () => {
    const both = matchOf(12_482_906, {
      l3DefenceLearn: true, l3DefenceVeto: true,
    }, true);
    const learnOnly = matchOf(12_482_906, { l3DefenceLearn: true }, true);
    while (!both.finished && !learnOnly.finished) {
      if (both.l3Defence!.vetoes > 0) break;
      both.step(DT); learnOnly.step(DT);
      expect(both.l3Defence!.vetoes > 0 || signature(both) === signature(learnOnly)).toBe(true);
    }
  });

  it('an armed League allocates one book per franchise and wipes them at the boundary', () => {
    const league = new League({ seed: 12_482_907 });
    league.matchFlags = { l3DefenceLearn: true };
    const f = league.nextFixture()!;
    const m = league.createMatch(f);
    expect(m.l3Defence).not.toBeNull();
    const books = league.defenceBooks!;
    expect(m.l3Defence!.books[0]).toBe(books[f.home]);
    expect(m.l3Defence!.books[1]).toBe(books[f.away]);
    books[f.home].note(1, true);
    league.finishSeason();
    expect(league.defenceBooks!.every((b) => b.total === 0)).toBe(true);
  });

  it('the seam draws no rng at all', () => {
    const armed = matchOf(12_482_908, { l3DefenceLearn: true }, true);
    const off = matchOf(12_482_908, {}, true);
    for (let i = 0; i < 600; i++) { armed.step(DT); off.step(DT); }
    expect((armed.rng as unknown as { s: number }).s)
      .toBe((off.rng as unknown as { s: number }).s);
  });
});
