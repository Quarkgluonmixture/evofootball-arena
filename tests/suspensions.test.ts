import { describe, expect, it } from 'vitest';
import type { Franchise } from '../src/evolution/franchise';
import { League, RED_BAN, SUSPENSION_YELLOWS } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { Team } from '../src/sim/Team';
import {
  ROSTER_SIZE, TEAM_SIZE, emptyPlayerStats, emptyStats, type MatchResult, type PlayerMatchStats,
} from '../src/sim/types';

/**
 * CARDS THAT BIND (Phase 62): discipline is personal — bookings land on
 * roster rows, reds and every SUSPENSION_YELLOWS-th league yellow cost the
 * man the club's next match, and the like-for-like bench body covers his
 * slot. These tests pin attribution, the lineup cover, serving, the season
 * slate-wipe, and the v19 migration.
 */

const fakeResult = (
  edit?: (playerStats: PlayerMatchStats[]) => void,
): MatchResult => {
  const playerStats = Array.from({ length: ROSTER_SIZE * 2 }, () => emptyPlayerStats());
  for (let i = 0; i < playerStats.length; i++) {
    if (i % ROSTER_SIZE < TEAM_SIZE) playerStats[i].apps = 1;
  }
  edit?.(playerStats);
  return {
    score: [0, 0],
    stats: [emptyStats(), emptyStats()],
    playerStats,
    events: [],
    duration: 240,
  };
};

describe('card attribution (Phase 62)', () => {
  it('personal yellows/reds sum to the team tallies across seeds', { timeout: 120000 }, () => {
    // Seed 5 → 37 (Phase 92): containment cut desperate lunges and with
    // them the card volume in short matches; re-scanned for a producer.
    const league = new League({ seed: 37, matchDuration: 60 });
    let cards = 0;
    for (let i = 0; i < 10; i++) {
      const f = league.nextFixture()!;
      const m = league.createMatch(f);
      const res = m.runToCompletion();
      for (const side of [0, 1] as const) {
        const rows = res.playerStats.slice(side * ROSTER_SIZE, (side + 1) * ROSTER_SIZE);
        expect(rows.reduce((a, s) => a + s.yellows, 0)).toBe(res.stats[side].yellows);
        expect(rows.reduce((a, s) => a + s.reds, 0)).toBe(res.stats[side].reds);
        cards += res.stats[side].yellows + res.stats[side].reds;
      }
      league.applyResult(f, res);
    }
    expect(cards).toBeGreaterThan(0); // the sample actually exercised the sites
  });
});

describe('suspensions', () => {
  it('a banned starter is covered by the like-for-like bench body', () => {
    const league = new League({ seed: 9, matchDuration: 30 });
    const f = league.franchise(0);
    f.suspensions[5] = 1; // the ST sits one out
    const info = league.teamInfo(0);
    expect(info.lineup).toBeDefined();
    expect(info.lineup![5]).toBe(8); // nominal-ST bench row takes the slot
    expect(info.lineup).not.toContain(5);
    expect(info.lineup!.slice(TEAM_SIZE).sort()).toEqual([6, 7]);

    const team = new Team(0, info);
    expect(team.players[5].rosterIdx).toBe(8);
    expect(team.players[5].role).toBe('ST'); // the SLOT keeps its role
    expect(team.players[5].name).toBe(f.playerNames[8]);
    expect(team.bench.map((b) => b.rosterIdx).sort()).toEqual([6, 7]);
  });

  it('nobody suspended ⇒ no lineup field, bit-identical construction', () => {
    const league = new League({ seed: 9, matchDuration: 30 });
    const info = league.teamInfo(1);
    expect(info.lineup).toBeUndefined();
    const team = new Team(0, info);
    team.players.forEach((p, i) => expect(p.rosterIdx).toBe(i));
  });

  it('a red banks a ban that starts NEXT fixture; bans tick down when served', () => {
    const league = new League({ seed: 3, matchDuration: 30 });
    const fx = league.nextFixture()!;
    const homeRow = 2;
    league.applyResult(fx, fakeResult((ps) => {
      ps[homeRow].reds = 1;
      ps[homeRow].yellows = 1; // the second-yellow convention: counted in both
    }));
    const f = league.franchise(fx.home);
    expect(f.suspensions[homeRow]).toBe(RED_BAN); // not decremented by ITS OWN match
    // His club's next fixture serves it.
    let next = league.nextFixture()!;
    while (next.home !== fx.home && next.away !== fx.home) {
      league.applyResult(next, fakeResult());
      next = league.nextFixture()!;
    }
    const info = league.teamInfo(fx.home);
    expect(info.lineup).toBeDefined();
    expect(info.lineup!).not.toContain(homeRow);
    league.applyResult(next, fakeResult());
    expect(f.suspensions[homeRow]).toBe(0); // served
  });

  it('every Nth league yellow of the season is a one-match ban', () => {
    const league = new League({ seed: 7, matchDuration: 30 });
    const fx = league.nextFixture()!;
    const awayRow = 3;
    league.playerAgg[fx.away][awayRow].yellows = SUSPENSION_YELLOWS - 1;
    league.applyResult(fx, fakeResult((ps) => {
      ps[ROSTER_SIZE + awayRow].yellows = 1; // crosses the threshold
    }));
    expect(league.franchise(fx.away).suspensions[awayRow]).toBe(1);
    // One short of the NEXT threshold: no double-charge.
    expect(league.playerAgg[fx.away][awayRow].yellows).toBe(SUSPENSION_YELLOWS);
  });

  it('the season end wipes the discipline slate', () => {
    const league = new League({ seed: 11, matchDuration: 30 });
    league.franchise(0).suspensions[4] = 2;
    while (!league.seasonDone) {
      const f = league.nextFixture()!;
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
    league.finishSeason();
    for (const f of league.franchises) {
      expect(f.suspensions.every((s) => s === 0)).toBe(true);
    }
  });

  it('v18 saves migrate: clean slates, zero personal cards, deterministic', () => {
    const league = new League({ seed: 13, matchDuration: 30 });
    for (let i = 0; i < 2; i++) {
      const f = league.nextFixture()!;
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
    const data = JSON.parse(JSON.stringify(league.toJSON())) as Record<string, unknown> & {
      franchises: Franchise[];
      playerAgg: Array<Array<Record<string, unknown>>>;
    };
    data.version = 18;
    for (const f of data.franchises) delete (f as Partial<Franchise>).suspensions;
    for (const arr of data.playerAgg) {
      for (const s of arr) {
        delete s.yellows;
        delete s.reds;
      }
    }
    const loaded = League.fromJSON(JSON.parse(JSON.stringify(data)) as Record<string, unknown>);
    for (const f of loaded.franchises) {
      expect(f.suspensions).toHaveLength(ROSTER_SIZE);
      expect(f.suspensions.every((s) => s === 0)).toBe(true);
    }
    for (const arr of loaded.playerAgg) {
      for (const s of arr) {
        expect(s.yellows).toBe(0);
        expect(s.reds).toBe(0);
      }
    }
    const again = League.fromJSON(JSON.parse(JSON.stringify(data)) as Record<string, unknown>);
    expect(JSON.stringify(again.toJSON())).toBe(JSON.stringify(loaded.toJSON()));
    const next = loaded.nextFixture()!;
    expect(() => loaded.applyResult(next, loaded.createMatch(next).runToCompletion())).not.toThrow();
  });

  it('integration: a full season under real physics produces served bans', { timeout: 240000 }, () => {
    // FULL-length matches: card volume scales with duration, and a
    // 60s-match season legitimately produces ~zero bans.
    const league = new League({ seed: 21 });
    let bansSeen = 0;
    while (!league.seasonDone) {
      const f = league.nextFixture()!;
      for (const slot of [f.home, f.away]) {
        bansSeen += league.franchise(slot).suspensions.filter((s) => s > 0).length;
      }
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
    expect(bansSeen).toBeGreaterThan(0); // discipline is ALIVE, not dead wire
  });
});

describe('match-side sanity with a lineup', () => {
  it('a covering bench body starts and his stats land on HIS roster row', () => {
    const league = new League({ seed: 17, matchDuration: 30 });
    const fx = league.nextFixture()!;
    league.franchise(fx.home).suspensions[5] = 1;
    const m = league.createMatch(fx);
    expect(m.teams[0].players[5].rosterIdx).toBe(8);
    const res = m.runToCompletion();
    // The banned man never appeared; his cover did.
    expect(res.playerStats[5].apps).toBe(0);
    expect(res.playerStats[8].apps).toBe(1);
  });
});
