import { describe, expect, it } from 'vitest';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS } from '../src/evolution/playerGenome';
import type { Franchise } from '../src/evolution/franchise';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import type { TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

function makeTeam(name: string, seed: number): TeamInfo {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wg', 'St'],
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
        const gids = side === 0 ? [0, 1, 2, 3, 4] : [5, 6, 7, 8, 9];
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
    expect(lines.length).toBe(40); // 8 teams × 5 players
    const totalGoals = lines.reduce((a, l) => a + l.goals, 0);
    const tableGf = league.table.reduce((a, r) => a + r.gf, 0);
    expect(totalGoals).toBeLessThanOrEqual(tableGf);

    const rec = league.finishSeason();
    expect(rec.awards).toBeDefined();
    const scorers = rec.awards!.topScorers;
    for (let i = 1; i < scorers.length; i++) {
      expect(scorers[i - 1].goals).toBeGreaterThanOrEqual(scorers[i].goals);
    }
    if (rec.awards!.topKeeper) expect(rec.awards!.topKeeper.role).toBe('GK');

    // Gene/attr means cover every key and stay in [0,1].
    for (const k of GENE_KEYS) {
      expect(rec.geneMeans![k]).toBeGreaterThanOrEqual(0);
      expect(rec.geneMeans![k]).toBeLessThanOrEqual(1);
    }
    for (const k of ATTR_KEYS) expect(rec.attrMeans![k]).toBeGreaterThanOrEqual(0);

    // Points timeline: 8 slots × 7 rounds, final column equals the table.
    expect(rec.pointsTimeline!.length).toBe(8);
    for (const row of rec.pointsTimeline!) expect(row.length).toBe(7);
    for (const t of rec.table) {
      expect(rec.pointsTimeline![t.slot][6]).toBe(t.pts);
    }
    // Elo snapshot present.
    expect(rec.table[0].elo).toBeTypeOf('number');

    // New season resets player aggregates.
    expect(league.playerLines().every((l) => l.goals === 0 && l.shots === 0)).toBe(true);
  });
});

describe('save migrations preserve old saves', () => {
  it('v2 (no playerAgg) and v1 (no squads) both load', () => {
    const league = new League({ seed: 7, matchDuration: 30 });
    for (let i = 0; i < 6; i++) {
      const f = league.nextFixture()!;
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
    const v3 = JSON.parse(JSON.stringify(league.toJSON())) as Record<string, unknown>;

    // Simulate a v2 save: player aggregates didn't exist.
    const v2 = JSON.parse(JSON.stringify(v3)) as Record<string, unknown>;
    delete v2.playerAgg;
    v2.version = 2;
    const fromV2 = League.fromJSON(v2);
    expect(fromV2.playerAgg.length).toBe(8);
    expect(fromV2.playerAgg[0].length).toBe(5);
    expect(fromV2.cursor).toBe(league.cursor);

    // Simulate a v1 save: squads didn't exist either.
    const v1 = JSON.parse(JSON.stringify(v3)) as Record<string, unknown>;
    delete v1.playerAgg;
    for (const f of v1.franchises as Franchise[]) delete (f as Partial<Franchise>).squad;
    v1.version = 1;
    const fromV1 = League.fromJSON(v1);
    expect(fromV1.franchises[0].squad.length).toBe(5);
    expect(fromV1.playerAgg.length).toBe(8);

    // Migrated leagues still produce identical future results.
    const fa = fromV2.nextFixture()!;
    const fb = league.nextFixture()!;
    expect(fromV2.createMatch(fa).runToCompletion().score).toEqual(
      league.createMatch(fb).runToCompletion().score,
    );
  });
});
