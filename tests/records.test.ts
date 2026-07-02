import { describe, expect, it } from 'vitest';
import { League, type SeasonRecord } from '../src/sim/League';
import {
  challengerTitles, greatestComeback, longestPremierStreak, movementCounts, premierTitles,
  seasonStories,
} from '../src/sim/records';

/** Minimal hand-crafted season record for narrative/record mining tests. */
function rec(
  generation: number,
  opts: {
    champion: [number, string];
    d2Champion?: string;
    promoted?: Array<[number, string]>;
    relegated?: Array<[number, string]>;
    table?: SeasonRecord['table'];
  },
): SeasonRecord {
  return {
    generation,
    championSlot: opts.champion[0],
    championName: opts.champion[1],
    d2Champion: opts.d2Champion,
    promoted: opts.promoted?.map(([slot, name]) => ({ slot, name })),
    relegated: opts.relegated?.map(([slot, name]) => ({ slot, name })),
    table:
      opts.table ??
      Array.from({ length: 16 }, (_, slot) => ({
        slot,
        name: `T${slot}`,
        pts: 10,
        w: 3,
        d: 1,
        l: 3,
        gf: 8,
        ga: 8,
        division: (slot < 8 ? 0 : 1) as 0 | 1,
      })),
    fitness: [],
    evolution: { generation: generation + 1, entries: [] },
  };
}

describe('record mining', () => {
  it('counts premier and challenger titles by name', () => {
    const h = [
      rec(1, { champion: [0, 'Wolves'], d2Champion: 'Herons' }),
      rec(2, { champion: [0, 'Wolves'], d2Champion: 'Pilots' }),
      rec(3, { champion: [3, 'Comets'], d2Champion: 'Herons' }),
    ];
    expect(premierTitles(h).get('Wolves')).toBe(2);
    expect(premierTitles(h).get('Comets')).toBe(1);
    expect(challengerTitles(h).get('Herons')).toBe(2);
  });

  it('finds the greatest comeback (relegated, later champion)', () => {
    const h = [
      rec(1, { champion: [0, 'Wolves'], relegated: [[5, 'Pilots'], [6, 'Orbit']] }),
      rec(2, { champion: [0, 'Wolves'] }),
      rec(3, { champion: [5, 'Pilots'] }), // fell in S1, champions in S3
    ];
    const cb = greatestComeback(h)!;
    expect(cb.name).toBe('Pilots');
    expect(cb.fellSeason).toBe(1);
    expect(cb.wonSeason).toBe(3);
    expect(greatestComeback([rec(1, { champion: [0, 'W'] })])).toBeNull();
  });

  it('tracks the longest premier streak per slot', () => {
    const mkTable = (d2slots: number[]): SeasonRecord['table'] =>
      Array.from({ length: 16 }, (_, slot) => ({
        slot, name: `T${slot}`, pts: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0,
        division: (d2slots.includes(slot) ? 1 : 0) as 0 | 1,
      }));
    // Slot 0 premier in all three seasons; slot 1 drops out in season 2.
    const h = [
      rec(1, { champion: [0, 'A'], table: mkTable([8, 9, 10, 11, 12, 13, 14, 15]) }),
      rec(2, { champion: [0, 'A'], table: mkTable([1, 9, 10, 11, 12, 13, 14, 15]) }),
      rec(3, { champion: [0, 'A'], table: mkTable([8, 9, 10, 11, 12, 13, 14, 15]) }),
    ];
    const league = new League({ seed: 1, matchDuration: 30 });
    const streak = longestPremierStreak(h, league.franchises)!;
    expect(streak.length).toBeGreaterThanOrEqual(3);
    expect([0, 2, 3, 4, 5, 6, 7].includes(streak.slot)).toBe(true);
  });

  it('counts promotions/relegations from lineage', () => {
    const league = new League({ seed: 2, matchDuration: 30 });
    league.franchise(3).lineage.push({ generation: 2, event: 'relegated' });
    league.franchise(3).lineage.push({ generation: 4, event: 'promoted' });
    const moves = movementCounts(league.franchises);
    const t3 = moves.find((m) => m.name === league.franchise(3).name)!;
    expect(t3.promotions).toBe(1);
    expect(t3.relegations).toBe(1);
  });

  it('tells season stories: retained titles and fallen champions', () => {
    const h = [
      rec(1, { champion: [0, 'Wolves'] }),
      rec(2, { champion: [0, 'Wolves'], relegated: [[0, 'Wolves']] }),
    ];
    // Note: champion also relegated is impossible in the real league; this
    // just exercises both narrative branches independently.
    const stories = seasonStories(h);
    expect(stories.some((s) => s.includes('retained the Premier title'))).toBe(true);
    const h2 = [
      rec(1, { champion: [4, 'Comets'] }),
      rec(2, { champion: [0, 'Wolves'], relegated: [[4, 'Comets']] }),
    ];
    expect(seasonStories(h2).some((s) => s.includes('Former champions Comets fell'))).toBe(true);
  });
});
