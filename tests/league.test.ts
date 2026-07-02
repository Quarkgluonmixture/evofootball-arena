import { describe, expect, it } from 'vitest';
import { League, buildRoundRobin } from '../src/sim/League';

describe('buildRoundRobin', () => {
  it('schedules every pair exactly once, one match per team per round', () => {
    const fixtures = buildRoundRobin(8);
    expect(fixtures.length).toBe(28);
    const pairs = new Set(fixtures.map((f) => [Math.min(f.home, f.away), Math.max(f.home, f.away)].join('-')));
    expect(pairs.size).toBe(28);
    for (let r = 0; r < 7; r++) {
      const round = fixtures.filter((f) => f.round === r);
      expect(round.length).toBe(4);
      const teams = new Set(round.flatMap((f) => [f.home, f.away]));
      expect(teams.size).toBe(8);
    }
  });
});

describe('League', () => {
  const makeLeague = () => new League({ seed: 99, matchDuration: 30 });

  const playSeason = (league: League) => {
    while (!league.seasonDone) {
      const f = league.nextFixture()!;
      const result = league.createMatch(f).runToCompletion();
      league.applyResult(f, result);
    }
  };

  it('creates 8 uniquely named franchises', () => {
    const league = makeLeague();
    expect(league.franchises.length).toBe(8);
    expect(new Set(league.franchises.map((f) => f.name)).size).toBe(8);
  });

  it('plays a season: table is consistent, Elo is zero-sum', () => {
    const league = makeLeague();
    playSeason(league);
    const totalPlayed = league.table.reduce((a, r) => a + r.played, 0);
    expect(totalPlayed).toBe(56); // 28 matches × 2 teams
    for (const row of league.table) {
      expect(row.played).toBe(7);
      expect(row.w * 3 + row.d).toBe(row.pts);
    }
    const gf = league.table.reduce((a, r) => a + r.gf, 0);
    const ga = league.table.reduce((a, r) => a + r.ga, 0);
    expect(gf).toBe(ga);
    const eloSum = league.franchises.reduce((a, f) => a + f.elo, 0);
    expect(eloSum).toBeCloseTo(8 * 1500, 6);
  });

  it('evolves after a season: elites survive, reborn get new lineage', () => {
    const league = makeLeague();
    playSeason(league);
    const namesBefore = league.franchises.map((f) => f.name);
    const rec = league.finishSeason();

    expect(league.generation).toBe(2);
    expect(league.history.length).toBe(1);
    expect(rec.evolution.entries.filter((e) => e.kind === 'elite').length).toBe(2);
    expect(rec.evolution.entries.filter((e) => e.kind === 'mutated').length).toBe(3);
    expect(rec.evolution.entries.filter((e) => e.kind === 'reborn').length).toBe(3);

    // Champion is always kept as elite.
    expect(rec.evolution.entries.find((e) => e.slot === rec.championSlot)?.kind).toBe('elite');

    // Reborn teams have new names + lineage entries with parents.
    for (const e of rec.evolution.entries.filter((x) => x.kind === 'reborn')) {
      const f = league.franchise(e.slot);
      expect(namesBefore).not.toContain(f.name);
      const last = f.lineage[f.lineage.length - 1];
      expect(last.event).toBe('reborn');
      expect(last.parents?.length).toBe(2);
    }

    // Next season is scheduled and fresh.
    expect(league.seasonDone).toBe(false);
    expect(league.table.every((r) => r.played === 0)).toBe(true);
  });

  it('save/load roundtrip preserves state and future results', () => {
    const league = makeLeague();
    // play half a season
    for (let i = 0; i < 14; i++) {
      const f = league.nextFixture()!;
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
    const json = JSON.parse(JSON.stringify(league.toJSON())) as Record<string, unknown>;
    const restored = League.fromJSON(json);

    expect(restored.cursor).toBe(league.cursor);
    expect(restored.generation).toBe(league.generation);

    // The next match must produce the identical result in both instances.
    const fa = league.nextFixture()!;
    const fb = restored.nextFixture()!;
    const ra = league.createMatch(fa).runToCompletion();
    const rb = restored.createMatch(fb).runToCompletion();
    expect(ra.score).toEqual(rb.score);
  });

  it('league runs are reproducible end to end', () => {
    const a = makeLeague();
    const b = makeLeague();
    playSeason(a);
    playSeason(b);
    expect(a.finishSeason().championName).toBe(b.finishSeason().championName);
    expect(a.franchises.map((f) => f.name)).toEqual(b.franchises.map((f) => f.name));
  });
});
