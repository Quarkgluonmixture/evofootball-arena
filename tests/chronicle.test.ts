import { describe, expect, it } from 'vitest';
import { chronicleChapters, titleRace } from '../src/sim/chronicle';
import type { CupRecord } from '../src/sim/cup';
import type { SeasonRecord } from '../src/sim/League';

/** Minimal hand-crafted season record (same shape as records.test.ts). */
function rec(
  generation: number,
  opts: {
    champion: [number, string];
    table?: SeasonRecord['table'];
    pointsTimeline?: number[][];
    cup?: CupRecord;
    awards?: SeasonRecord['awards'];
    longestChain?: SeasonRecord['longestChain'];
    entries?: SeasonRecord['evolution']['entries'];
    promoted?: Array<[number, string]>;
    relegated?: Array<[number, string]>;
  },
): SeasonRecord {
  return {
    generation,
    championSlot: opts.champion[0],
    championName: opts.champion[1],
    promoted: opts.promoted?.map(([slot, name]) => ({ slot, name })),
    relegated: opts.relegated?.map(([slot, name]) => ({ slot, name })),
    table:
      opts.table ??
      Array.from({ length: 16 }, (_, slot) => ({
        slot, name: `T${slot}`, pts: slot === opts.champion[0] ? 20 : 10,
        w: 3, d: 1, l: 3, gf: 8, ga: 8,
        division: (slot < 8 ? 0 : 1) as 0 | 1,
      })),
    pointsTimeline: opts.pointsTimeline,
    cup: opts.cup,
    awards: opts.awards,
    longestChain: opts.longestChain,
    fitness: [],
    evolution: { generation: generation + 1, entries: opts.entries ?? [] },
  };
}

/** A 4-team Premier table with explicit points. */
function d1Table(pts: number[]): SeasonRecord['table'] {
  return pts.map((p, slot) => ({
    slot, name: `T${slot}`, pts: p, w: 0, d: 0, l: 0, gf: 10 + slot, ga: 8,
    division: 0 as const,
  }));
}

/** A played cup final between two slots (entrants named so no '?' grudges). */
function cupFinal(winner: number, loser: number, score: [number, number]): CupRecord {
  return {
    winnerSlot: winner,
    winnerName: `T${winner}`,
    runnerUpName: `T${loser}`,
    entrants: [winner, loser].map((slot, i) => ({
      slot, name: `T${slot}`, division: 0 as const, seed: i + 1, elo: 1500,
    })),
    ties: [{
      round: 3, index: 0, home: winner, away: loser, played: true,
      scoreH: score[0], scoreA: score[1], winner,
    }],
    upsets: [],
    topScorer: null,
  };
}

describe('titleRace', () => {
  it('finds the mathematically decided round and a wire-to-wire lead', () => {
    const tl: number[][] = [];
    tl[0] = [3, 6, 9, 12, 15, 18, 21];
    tl[1] = [0, 1, 2, 3, 4, 5, 6];
    tl[2] = [1, 1, 1, 1, 1, 1, 1];
    tl[3] = [0, 0, 0, 0, 0, 0, 0];
    const race = titleRace(rec(1, { champion: [0, 'T0'], table: d1Table([21, 6, 1, 0]), pointsTimeline: tl }))!;
    // Round 5 is the first where lead 11 > 3 × (2 rounds left).
    expect(race.decidedRound).toBe(5);
    expect(race.ledFrom).toBe(1);
    expect(race.byGoalDifference).toBe(false);
    expect(race.margin).toBe(15);
    expect(race.runnerUp).toBe('T1');
  });

  it('flags a goal-difference title as a final-day race', () => {
    const tl: number[][] = [];
    tl[0] = [0, 3, 6, 9, 12, 15, 18];
    tl[1] = [3, 6, 9, 12, 15, 18, 18];
    const race = titleRace(rec(1, { champion: [0, 'T0'], table: d1Table([18, 18]), pointsTimeline: tl }))!;
    expect(race.decidedRound).toBe(7);
    expect(race.byGoalDifference).toBe(true);
    expect(race.margin).toBe(0);
    expect(race.ledFrom).toBe(7);
  });

  it('measures the halfway rank of a comeback champion', () => {
    const tl: number[][] = [];
    tl[0] = [0, 3, 3, 6, 9, 12, 15];
    tl[1] = [3, 4, 5, 7, 7, 7, 7];
    tl[2] = [3, 5, 6, 8, 8, 8, 8];
    tl[3] = [3, 6, 7, 9, 9, 9, 9];
    const race = titleRace(rec(1, { champion: [0, 'T0'], table: d1Table([15, 7, 8, 9]), pointsTimeline: tl }))!;
    expect(race.halfwayRank).toBe(4);
    expect(race.decidedRound).toBe(7);
  });

  it('returns null without a points timeline', () => {
    expect(titleRace(rec(1, { champion: [0, 'T0'] }))).toBeNull();
  });
});

describe('chronicleChapters', () => {
  it('writes one chapter per season with coronation-flavored headlines', () => {
    const h = [
      rec(1, { champion: [0, 'Wolves'] }),
      rec(2, { champion: [0, 'Wolves'] }),
      rec(3, { champion: [0, 'Wolves'] }),
      rec(4, { champion: [3, 'Comets'] }),
      rec(5, { champion: [0, 'Wolves'] }),
    ];
    const ch = chronicleChapters(h);
    expect(ch).toHaveLength(5);
    expect(ch[0].headline).toContain('inaugural');
    expect(ch[1].headline).toContain('retained the title');
    expect(ch[2].headline).toContain('3 titles in a row');
    expect(ch[3].headline).toContain('first Premier crown');
    expect(ch[4].headline).toContain('took the title back from Comets');
  });

  it('folds the race into the headline', () => {
    const tl: number[][] = [];
    tl[0] = [3, 6, 9, 12, 15, 18, 21];
    tl[1] = [0, 1, 2, 3, 4, 5, 6];
    const ch = chronicleChapters([
      rec(1, { champion: [0, 'T0'], table: d1Table([21, 6]), pointsTimeline: tl }),
    ]);
    expect(ch[0].headline).toContain('sealed in round 5/7');
    expect(ch[0].headline).toContain('led wire-to-wire');
  });

  it('compacts routine funerals and singles out a fallen giant', () => {
    const h = [
      rec(1, { champion: [5, 'Dead Owls'] }),
      rec(2, {
        champion: [0, 'T0'],
        entries: [
          { slot: 5, name: 'New Suns', kind: 'reborn', fitness: 0.1, drift: 1, oldName: 'Dead Owls', parents: ['T0', 'T3'] },
          { slot: 9, name: 'Fresh FC', kind: 'reborn', fitness: 0.1, drift: 1, oldName: 'Turbo Pumas' },
          { slot: 0, name: 'T0', kind: 'elite', fitness: 0.9, drift: 0 },
        ],
      }),
    ];
    const ch = chronicleChapters(h);
    const giant = ch[1].lines.find((l) => l.icon === '🏚')!;
    expect(giant.text).toContain('Dead Owls');
    expect(giant.text).toContain('1×🏆');
    expect(giant.text).toContain('New Suns rose');
    const routine = ch[1].lines.find((l) => l.icon === '💀')!;
    expect(routine.text).toContain('Turbo Pumas folded');
    expect(routine.text).toContain('Fresh FC entered the pyramid');
    expect(routine.text).not.toContain('Dead Owls');
  });

  it('marks a cup final between repeat decider opponents as a derby', () => {
    const h = [
      rec(1, { champion: [0, 'T0'], cup: cupFinal(0, 1, [2, 1]) }),
      rec(2, { champion: [0, 'T0'], cup: cupFinal(1, 0, [1, 0]) }),
      rec(3, { champion: [0, 'T0'], cup: cupFinal(0, 1, [3, 2]) }),
    ];
    const ch = chronicleChapters(h);
    expect(ch[0].lines.some((l) => l.icon === '🔥')).toBe(false);
    expect(ch[1].lines.some((l) => l.icon === '🔥')).toBe(false);
    const derby = ch[2].lines.find((l) => l.icon === '🔥')!;
    expect(derby.text).toContain('3rd meeting in a decider');
  });

  it('only calls a record after enough prior seasons, and only when beaten', () => {
    const boot = (goals: number): SeasonRecord['awards'] => ({
      topScorers: [{
        slot: 0, name: 'Ace', team: 'T0', role: 'ST', goals, assists: 2,
        shots: 20, saves: 0, recoveries: 0, miscontrols: 0, rating: 40, avgRating: 8,
      }],
      topAssists: [],
      topKeeper: null,
    });
    const h = [
      rec(1, { champion: [0, 'T0'], table: d1Table([20, 10]), awards: boot(9) }),
      rec(2, { champion: [0, 'T0'], table: d1Table([20, 10]), awards: boot(7) }),
      rec(3, { champion: [0, 'T0'], table: d1Table([20, 10]), awards: boot(8) }),
      rec(4, { champion: [0, 'T0'], table: d1Table([25, 10]), awards: boot(11) }),
      rec(5, { champion: [0, 'T0'], table: d1Table([24, 10]), awards: boot(10) }),
    ];
    const ch = chronicleChapters(h);
    // Seasons 1–3: too little history for any record to mean something.
    for (const c of ch.slice(0, 3)) {
      expect(c.lines.some((l) => l.icon === '📈' || l.icon === '⚽')).toBe(false);
    }
    expect(ch[3].lines.some((l) => l.icon === '📈' && l.text.includes('25 pts'))).toBe(true);
    expect(ch[3].lines.some((l) => l.icon === '⚽' && l.text.includes('Ace'))).toBe(true);
    // Season 5 beats neither mark.
    expect(ch[4].lines.some((l) => l.icon === '📈' || l.icon === '⚽')).toBe(false);
  });
});
