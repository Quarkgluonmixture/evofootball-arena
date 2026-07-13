import { describe, expect, it } from 'vitest';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS } from '../src/evolution/playerGenome';
import type { Franchise } from '../src/evolution/franchise';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, emptyPlayerStats, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

function makeTeam(name: string, seed: number): TeamInfo {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
}

const playSeason = (league: League) => {
  while (!league.seasonDone) {
    const f = league.nextFixture()!;
    league.applyResult(f, league.createMatch(f).runToCompletion());
  }
};

describe('player match stats (passive counters)', () => {
  it('are internally consistent with team stats across seeds', () => {
    for (const seed of [11, 42, 99, 777]) {
      const m = new Match({ seed, teamA: makeTeam('A', 1), teamB: makeTeam('B', 2), duration: 120 });
      const r = m.runToCompletion();
      const ownGoals = r.events.filter((e) => e.text.includes('(og)')).length;

      for (const side of [0, 1] as const) {
        const gids = Array.from({ length: TEAM_SIZE }, (_, i) => side * TEAM_SIZE + i);
        const sum = (k: 'goals' | 'assists' | 'shots' | 'saves' | 'recoveries') =>
          gids.reduce((a, g) => a + r.playerStats[g][k], 0);
        expect(sum('shots')).toBe(r.stats[side].shots);
        expect(sum('saves')).toBe(r.stats[side].saves);
        expect(sum('recoveries')).toBe(r.stats[side].tackles + r.stats[side].interceptions);
        expect(sum('assists')).toBeLessThanOrEqual(sum('goals'));
        // Own goals credit no player; everything else must be attributed.
        expect(sum('goals')).toBeLessThanOrEqual(r.score[side]);
        expect(sum('goals')).toBeGreaterThanOrEqual(r.score[side] - ownGoals);
      }
    }
  });
});

describe('season report data', () => {
  const makeLeague = () => new League({ seed: 99, matchDuration: 60 });

  it('aggregates player lines and builds awards + timelines at season end', () => {
    const league = makeLeague();
    playSeason(league);

    const lines = league.playerLines();
    expect(lines.length).toBe(16 * TEAM_SIZE); // 16 teams × squad size
    const totalGoals = lines.reduce((a, l) => a + l.goals, 0);
    const tableGf = league.table.reduce((a, r) => a + r.gf, 0);
    expect(totalGoals).toBeLessThanOrEqual(tableGf);

    const d1Slots = league.division(0).map((f) => f.slot);
    const rec = league.finishSeason();
    expect(rec.awards).toBeDefined();
    const scorers = rec.awards!.topScorers;
    for (let i = 1; i < scorers.length; i++) {
      expect(scorers[i - 1].goals).toBeGreaterThanOrEqual(scorers[i].goals);
    }
    // Awards are a Division 1 honor.
    for (const l of scorers) expect(d1Slots).toContain(l.slot);
    if (rec.awards!.topKeeper) expect(rec.awards!.topKeeper.role).toBe('GK');

    // Gene/attr means cover every key and stay in [0,1].
    for (const k of GENE_KEYS) {
      expect(rec.geneMeans![k]).toBeGreaterThanOrEqual(0);
      expect(rec.geneMeans![k]).toBeLessThanOrEqual(1);
    }
    for (const k of ATTR_KEYS) expect(rec.attrMeans![k]).toBeGreaterThanOrEqual(0);

    // Points timeline: 16 slots × 7 rounds, final column equals the table.
    expect(rec.pointsTimeline!.length).toBe(16);
    for (const row of rec.pointsTimeline!) expect(row.length).toBe(7);
    for (const t of rec.table) {
      expect(rec.pointsTimeline![t.slot][6]).toBe(t.pts);
    }
    // Elo + division snapshots present.
    expect(rec.table[0].elo).toBeTypeOf('number');
    expect(rec.table.filter((r) => r.division === 0).length).toBe(8);
    expect(rec.table.filter((r) => r.division === 1).length).toBe(8);

    // New season resets player aggregates.
    expect(league.playerLines().every((l) => l.goals === 0 && l.shots === 0)).toBe(true);
  });
});

describe('save migrations preserve old saves', () => {
  /**
   * Craft an authentic v3-era (8-team, single-division) save. The v4
   * constructor draws its first 8 franchises from the same RNG sequence the
   * v3 constructor used, so slicing a fresh v4 league IS a v3 league.
   */
  const craftV3 = (seed: number, matchDuration: number, playMatches: number) => {
    const league = new League({ seed, matchDuration });
    // Play some D1 fixtures (they are exactly the fixtures a v3 league had).
    let played = 0;
    while (played < playMatches) {
      const f = league.nextFixture()!;
      if (f.division !== 0) {
        league.cursor++; // skip D2 fixtures — they don't exist in a v3 save
        continue;
      }
      league.applyResult(f, league.createMatch(f).runToCompletion());
      played++;
    }
    const v4 = JSON.parse(JSON.stringify(league.toJSON())) as Record<string, unknown>;
    const v3 = { ...v4 };
    v3.version = 3;
    v3.franchises = (v4.franchises as Franchise[]).slice(0, 8).map((f) => {
      const copy = { ...f } as Partial<Franchise>;
      delete copy.division;
      return copy;
    });
    v3.fixtures = (v4.fixtures as Array<Record<string, unknown>>)
      .filter((f) => f.division === 0)
      .map((f) => {
        const copy = { ...f };
        delete copy.division;
        return copy;
      });
    v3.cursor = (v3.fixtures as Array<{ played: boolean }>).filter((f) => f.played).length;
    v3.table = (v4.table as unknown[]).slice(0, 8);
    v3.agg = (v4.agg as unknown[]).slice(0, 8);
    v3.playerAgg = (v4.playerAgg as unknown[]).slice(0, 8);
    return { league, v3: JSON.parse(JSON.stringify(v3)) as Record<string, unknown> };
  };

  it('v3 (8-team era) becomes Division 1 with a fresh Division 2 beneath', () => {
    const { league, v3 } = craftV3(7, 30, 6);
    const migrated = League.fromJSON(v3);

    expect(migrated.franchises.length).toBe(16);
    expect(migrated.division(0).length).toBe(8);
    expect(migrated.division(1).length).toBe(8);
    expect(new Set(migrated.franchises.map((f) => f.name)).size).toBe(16);
    expect(migrated.fixtures.length).toBe(56);
    expect(migrated.playerAgg.length).toBe(16);

    // Old D1 results survive the migration.
    expect(migrated.fixtures.filter((f) => f.played).length).toBe(6);

    // The old league's franchises are untouched (same genomes -> same future).
    for (let s = 0; s < 8; s++) {
      expect(migrated.franchise(s).name).toBe(league.franchise(s).name);
      expect(migrated.franchise(s).genome).toEqual(league.franchise(s).genome);
    }
    // Remaining D1 fixtures still produce identical results (same seeds).
    const nextD1 = migrated.fixtures.find((f) => !f.played && f.division === 0)!;
    const same = league.fixtures.find(
      (f) => f.division === 0 && f.round === nextD1.round && f.index === nextD1.index,
    )!;
    expect(migrated.createMatch(nextD1).runToCompletion().score).toEqual(
      league.createMatch(same).runToCompletion().score,
    );
  });

  it('v2 (no playerAgg) and v1 (no squads) chain-migrate to v4', () => {
    const { v3 } = craftV3(11, 30, 4);

    const v2 = JSON.parse(JSON.stringify(v3)) as Record<string, unknown>;
    delete v2.playerAgg;
    v2.version = 2;
    const fromV2 = League.fromJSON(v2);
    expect(fromV2.franchises.length).toBe(16);
    expect(fromV2.playerAgg.length).toBe(16);
    // The chain now runs to v8 (6v6) — loaded shapes are current-era shapes.
    expect(fromV2.playerAgg[0].length).toBe(TEAM_SIZE);

    const v1 = JSON.parse(JSON.stringify(v3)) as Record<string, unknown>;
    delete v1.playerAgg;
    for (const f of v1.franchises as Franchise[]) delete (f as Partial<Franchise>).squad;
    v1.version = 1;
    const fromV1 = League.fromJSON(v1);
    expect(fromV1.franchises[0].squad.length).toBe(TEAM_SIZE);
    expect(fromV1.franchises.length).toBe(16);
    expect(fromV1.division(1).length).toBe(8);
  });

  it('v7 (5-a-side era) saves grow a second winger at slot 4, neighbors intact', () => {
    const league = new League({ seed: 31, matchDuration: 30 });
    for (let i = 0; i < 4; i++) {
      const f = league.nextFixture()!;
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
    // Forge an authentic v7 save by reversing the v8 splice: drop slot 4
    // (WGR) from every player-shaped array, leaving the old 5-slot order
    // [GK, DF, MF, WG, ST].
    const data = JSON.parse(JSON.stringify(league.toJSON())) as Record<string, unknown> & {
      version: number;
      franchises: Franchise[];
      playerAgg: Array<Array<Record<string, number>>>;
      cup: { playerGoals: number[][] } | null;
    };
    data.version = 7;
    for (const f of data.franchises) {
      f.playerNames.splice(4, 1);
      f.squad.splice(4, 1);
      f.ages.splice(4, 1);
      f.careers.splice(4, 1);
    }
    for (const arr of data.playerAgg) arr.splice(4, 1);
    if (data.cup) for (const g of data.cup.playerGoals) g.splice(4, 1);

    const loaded = League.fromJSON(JSON.parse(JSON.stringify(data)) as Record<string, unknown>);
    for (const [i, f] of loaded.franchises.entries()) {
      const orig = league.franchises[i];
      expect(f.squad).toHaveLength(TEAM_SIZE);
      expect(f.playerNames).toHaveLength(TEAM_SIZE);
      expect(f.ages).toHaveLength(TEAM_SIZE);
      expect(f.careers).toHaveLength(TEAM_SIZE);
      // The splice lands BETWEEN the old WG and ST: 0-3 untouched, ST at 5.
      expect(f.playerNames.slice(0, 4)).toEqual(orig.playerNames.slice(0, 4));
      expect(f.playerNames[5]).toBe(orig.playerNames[5]);
      expect(new Set(f.playerNames).size).toBe(TEAM_SIZE); // newgen avoids clashes
    }
    for (const arr of loaded.playerAgg) {
      expect(arr).toHaveLength(TEAM_SIZE);
      // Today's empty shape — v9 added rating/miscontrol zeros (Phase 33).
      expect(arr[4]).toEqual(emptyPlayerStats());
    }
    if (loaded.cup) for (const g of loaded.cup.playerGoals) expect(g).toHaveLength(TEAM_SIZE);

    // Migration is deterministic (seed-derived newgens), and the loaded
    // league keeps simulating.
    const again = League.fromJSON(JSON.parse(JSON.stringify(data)) as Record<string, unknown>);
    expect(JSON.stringify(again.toJSON())).toBe(JSON.stringify(loaded.toJSON()));
    const next = loaded.nextFixture()!;
    expect(() => loaded.applyResult(next, loaded.createMatch(next).runToCompletion())).not.toThrow();
  });
});
