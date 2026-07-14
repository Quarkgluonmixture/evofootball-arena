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

  it('creates 16 uniquely named franchises in two divisions', () => {
    const league = makeLeague();
    expect(league.franchises.length).toBe(16);
    expect(new Set(league.franchises.map((f) => f.name)).size).toBe(16);
    expect(league.division(0).length).toBe(8);
    expect(league.division(1).length).toBe(8);
    expect(league.fixtures.length).toBe(56);
  });

  it('plays a season: table is consistent, Elo is zero-sum', () => {
    const league = makeLeague();
    playSeason(league);
    const totalPlayed = league.table.reduce((a, r) => a + r.played, 0);
    expect(totalPlayed).toBe(112); // 56 matches × 2 teams
    for (const row of league.table) {
      expect(row.played).toBe(7);
      expect(row.w * 3 + row.d).toBe(row.pts);
    }
    const gf = league.table.reduce((a, r) => a + r.gf, 0);
    const ga = league.table.reduce((a, r) => a + r.ga, 0);
    expect(gf).toBe(ga);
    const eloSum = league.franchises.reduce((a, f) => a + f.elo, 0);
    expect(eloSum).toBeCloseTo(16 * 1500, 6);
  });

  it('evolves per division: elites survive, D2 bottom is reborn from D1 parents', () => {
    const league = makeLeague();
    playSeason(league);
    const namesBefore = league.franchises.map((f) => f.name);
    const d1Names = league.division(0).map((f) => f.name);
    const d2Slots = league.division(1).map((f) => f.slot);
    const rec = league.finishSeason();

    expect(league.generation).toBe(2);
    expect(rec.evolution.entries.length).toBe(16);
    expect(rec.evolution.entries.filter((e) => e.kind === 'elite').length).toBe(4); // 2 per division
    expect(rec.evolution.entries.filter((e) => e.kind === 'mutated').length).toBe(9); // 6 D1 + 3 D2
    expect(rec.evolution.entries.filter((e) => e.kind === 'reborn').length).toBe(3);

    // Champion is always kept as elite.
    expect(rec.evolution.entries.find((e) => e.slot === rec.championSlot)?.kind).toBe('elite');

    // Reborn slots are all D2 (as played), with new names and D1 parents.
    for (const e of rec.evolution.entries.filter((x) => x.kind === 'reborn')) {
      expect(d2Slots).toContain(e.slot);
      const f = league.franchise(e.slot);
      expect(namesBefore).not.toContain(f.name);
      const rebornEntry = [...f.lineage].reverse().find((l) => l.event === 'reborn');
      expect(rebornEntry?.parents?.length).toBe(2);
      for (const parent of rebornEntry!.parents!) expect(d1Names).toContain(parent);
    }

    // Next season is scheduled and fresh.
    expect(league.seasonDone).toBe(false);
    expect(league.table.every((r) => r.played === 0)).toBe(true);
  });

  it('playoff mode: 8th down, 1st up, 7th-vs-2nd decider — deterministic', () => {
    const run = () => {
      const league = new League({ seed: 4242, matchDuration: 30 });
      league.promotionMode = 'playoff';
      // Regular season + cup: 56 league fixtures and 15 cup ties, then the
      // decider appears — the playoff is always the season's last match.
      for (let i = 0; i < 56 + 15; i++) {
        const f = league.nextFixture()!;
        expect(f.playoff).toBeUndefined();
        league.applyResult(f, league.createMatch(f).runToCompletion());
      }
      expect(league.seasonDone).toBe(false); // playoff still pending
      const decider = league.nextFixture()!;
      expect(decider.playoff).toBe(true);
      expect(decider.home).toBe(league.standings(0)[6].slot); // Premier 7th hosts
      expect(decider.away).toBe(league.standings(1)[1].slot); // Challenger 2nd

      const tableBefore = JSON.stringify(league.table);
      league.applyResult(decider, league.createMatch(decider).runToCompletion());
      // The decider is a standalone tie: league table untouched.
      expect(JSON.stringify(league.table)).toBe(tableBefore);

      const rec = league.finishSeason();
      return { rec, decider };
    };

    const a = run();
    const b = run();
    expect(a.rec.playoff).toBeDefined();
    expect(a.rec.playoff).toEqual(b.rec.playoff); // deterministic decider
    expect(a.rec.promoted).toEqual(b.rec.promoted);

    const challengerWon = a.rec.playoff!.score[1] > a.rec.playoff!.score[0];
    if (challengerWon) {
      expect(a.rec.promoted!.length).toBe(2);
      expect(a.rec.relegated!.length).toBe(2);
      expect(a.rec.playoff!.winnerName).toBe(a.rec.playoff!.awayName);
    } else {
      // Premier side wins or draws: only the automatic spots move.
      expect(a.rec.promoted!.length).toBe(1);
      expect(a.rec.relegated!.length).toBe(1);
      expect(a.rec.playoff!.winnerName).toBe(a.rec.playoff!.homeName);
    }
  });

  it('identity follows the team across divisions (name, colors, genome)', () => {
    const league = makeLeague();
    playSeason(league);
    const upSlot = league.standings(1)[0].slot;
    const downSlot = league.standings(0)[7].slot;
    const upBefore = JSON.parse(JSON.stringify(league.franchise(upSlot)));
    const downBefore = JSON.parse(JSON.stringify(league.franchise(downSlot)));
    league.finishSeason();

    // Promoted champion of D2: elite-protected — the identity survives the
    // move. The squad is the same PEOPLE a season older (attributes drift
    // with age via the careers pass — exact attr equality stopped being the
    // contract in Phase 26; anyone whose name changed must be a newgen).
    const up = league.franchise(upSlot);
    expect(up.division).toBe(0);
    expect(up.name).toBe(upBefore.name);
    expect(up.colors).toEqual(upBefore.colors);
    expect(up.genome).toEqual(upBefore.genome);
    up.ages.forEach((age, i) => {
      if (up.playerNames[i] === (upBefore.playerNames as string[])[i]) {
        expect(age).toBe((upBefore.ages as number[])[i] + 1);
      } else {
        expect(age).toBeLessThanOrEqual(19); // a retiree's newgen replacement
      }
    });

    // Relegated team: identity (name/colors/lineage) survives; genes may
    // mutate per the rebuild policy, but it is never reborn.
    const down = league.franchise(downSlot);
    expect(down.division).toBe(1);
    expect(down.name).toBe(downBefore.name);
    expect(down.colors).toEqual(downBefore.colors);
    expect(down.lineage.length).toBeGreaterThan(downBefore.lineage.length);
    expect(down.lineage.some((l) => l.event === 'reborn' && l.generation === 2)).toBe(false);
  });

  it('promotes the D2 top two and relegates the D1 bottom two, by table', () => {
    const league = makeLeague();
    playSeason(league);
    const downSlots = league.standings(0).slice(-2).map((r) => r.slot);
    const upSlots = league.standings(1).slice(0, 2).map((r) => r.slot);
    const rec = league.finishSeason();

    expect(rec.relegated!.map((r) => r.slot)).toEqual(downSlots);
    expect(rec.promoted!.map((r) => r.slot)).toEqual(upSlots);
    for (const s of upSlots) {
      expect(league.franchise(s).division).toBe(0);
      expect(league.franchise(s).lineage.some((l) => l.event === 'promoted')).toBe(true);
      // Promoted teams are protected: never reborn on the way up.
      expect(rec.evolution.entries.find((e) => e.slot === s)?.kind).toBe('elite');
    }
    for (const s of downSlots) {
      expect(league.franchise(s).division).toBe(1);
      expect(league.franchise(s).lineage.some((l) => l.event === 'relegated')).toBe(true);
    }
    // Both divisions still have 8 teams and a full fixture list.
    expect(league.division(0).length).toBe(8);
    expect(league.division(1).length).toBe(8);
    expect(league.fixtures.length).toBe(56);
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

  it('migrates a v12 save: combo policy genes backfill at 1.0, evolved keys kept', () => {
    const league = makeLeague();
    const json = JSON.parse(JSON.stringify(league.toJSON())) as {
      version: number;
      franchises: Array<{ policy: Record<string, number> }>;
    };
    json.version = 12;
    for (const f of json.franchises) {
      delete f.policy.wallPassW;
      delete f.policy.thirdManW;
      delete f.policy.overlapW;
      f.policy.shootBase = 2.5; // an "evolved" v12 value that must survive
    }
    const restored = League.fromJSON(json as unknown as Record<string, unknown>);
    for (const f of restored.franchises) {
      expect(f.policy.wallPassW).toBe(1);
      expect(f.policy.thirdManW).toBe(1);
      expect(f.policy.overlapW).toBe(1);
      expect(f.policy.shootBase).toBe(2.5);
    }
  });

  it('migrates a v13 save: technique splits into passing+dribbling, strength/stamina neutral', () => {
    const league = makeLeague();
    const json = JSON.parse(JSON.stringify(league.toJSON())) as {
      version: number;
      franchises: Array<{ squad: Array<Record<string, number>> }>;
      history: Array<{ attrMeans?: Record<string, number> }>;
    };
    json.version = 13;
    for (const f of json.franchises) {
      f.squad = f.squad.map((p) => ({
        pace: p.pace, technique: 0.63, finishing: p.finishing,
        defending: p.defending, reflexes: p.reflexes,
      }));
    }
    const restored = League.fromJSON(json as unknown as Record<string, unknown>);
    for (const f of restored.franchises) {
      for (const p of f.squad) {
        expect(p.passing).toBe(0.63);
        expect(p.dribbling).toBe(0.63);
        expect(p.strength).toBe(0.4);
        expect(p.stamina).toBe(0.4);
        expect((p as unknown as Record<string, number>).technique).toBeUndefined();
      }
    }
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
