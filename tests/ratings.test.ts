import { describe, expect, it } from 'vitest';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { League } from '../src/sim/League';
import { MATCH_DURATION } from '../src/sim/constants';
import { Match } from '../src/sim/Match';
import { matchRating } from '../src/sim/ratings';
import { TEAM_SIZE, emptyPlayerStats, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * Phase 33 — the watching experience's numbers: match ratings (deterministic,
 * bounded, outcome-aware) and the tiki-taka pass-chain counter (one feed line
 * per qualifying move, the season's longest-chain record).
 */

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

const play = (seed: number) => {
  const m = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: MATCH_DURATION,
  });
  const res = m.runToCompletion();
  return { m, res };
};

describe('matchRating (pure)', () => {
  it('applies the ROADMAP weights exactly', () => {
    const s = emptyPlayerStats();
    expect(matchRating(s, -1)).toBeCloseTo(6.5, 10); // did the job, lost
    expect(matchRating(s, 0)).toBeCloseTo(6.6, 10);
    expect(matchRating(s, 2)).toBeCloseTo(6.8, 10);
    s.goals = 1;
    s.assists = 1;
    s.saves = 2;
    s.recoveries = 3;
    s.miscontrols = 2;
    // 6.5 + 1.2 + 0.8 + 0.5 + 0.3 − 0.2 + 0.1 (draw)
    expect(matchRating(s, 0)).toBeCloseTo(9.2, 10);
  });

  it('is bounded to [6, 10]', () => {
    const hero = emptyPlayerStats();
    hero.goals = 9;
    expect(matchRating(hero, 5)).toBe(10);
    const calamity = emptyPlayerStats();
    calamity.miscontrols = 50;
    expect(matchRating(calamity, -5)).toBe(6);
  });
});

describe('ratings in a played match', () => {
  it('every player gets a bounded FT rating, and the MOTM line names the best', () => {
    for (const seed of [3, 11, 42]) {
      const { m, res } = play(seed);
      const best = Math.max(...res.playerStats.map((s) => s.rating));
      for (const s of res.playerStats) {
        expect(s.rating).toBeGreaterThanOrEqual(6);
        expect(s.rating).toBeLessThanOrEqual(10);
      }
      const motm = m.events.filter((e) => e.text.includes('Man of the match'));
      expect(motm.length).toBe(1);
      expect(motm[0].text).toContain(`(${best.toFixed(1)})`);
      expect(motm[0].t).toBeGreaterThanOrEqual(m.events.find((e) => e.type === 'fulltime')!.t);
    }
  });

  it('is deterministic: same seed ⇒ identical ratings', () => {
    const a = play(7).res.playerStats.map((s) => s.rating);
    const b = play(7).res.playerStats.map((s) => s.rating);
    expect(a).toEqual(b);
  });
});

describe('the tiki-taka counter', () => {
  it('records a best chain for both sides and feeds only qualifying moves', () => {
    let lines = 0;
    let matches = 0;
    for (const seed of [1, 2, 3, 4, 5, 6]) {
      const { m, res } = play(seed);
      matches++;
      for (const side of [0, 1] as const) {
        expect(res.stats[side].bestPassChain).toBeGreaterThanOrEqual(0);
      }
      for (const e of m.events) {
        const hit = e.text.match(/^🎼 (\d+)-pass move/);
        if (!hit) continue;
        lines++;
        const n = Number(hit[1]);
        expect(n).toBeGreaterThanOrEqual(6); // the feed threshold
        // The team credited actually built a chain at least that long.
        expect(res.stats[e.side as 0 | 1].bestPassChain).toBeGreaterThanOrEqual(n);
      }
    }
    // Feed discipline (failure mode 7): rare but alive — the probe measured
    // ~2/match; a dead counter or a spamming one both fail here.
    expect(lines).toBeGreaterThan(0);
    expect(lines / matches).toBeLessThan(6);
  });

  it('the goal line follows the move line that produced it', () => {
    // Structural: any 🎼 line immediately followed by a GOAL for the same
    // side belongs to the same sim instant (endPassMove runs inside onGoal).
    const { m } = play(9);
    m.events.forEach((e, i) => {
      const next = m.events[i + 1];
      if (e.text.startsWith('🎼') && next?.type === 'goal' && next.side === e.side) {
        expect(next.t).toBeCloseTo(e.t, 5);
      }
    });
  });
});

describe('season integration (Phase 33)', () => {
  it('accumulates rating sums, crowns an MVP and keeps the longest-chain record', () => {
    const league = new League({ seed: 21, matchDuration: 30 });
    while (!league.seasonDone) {
      const f = league.nextFixture()!;
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
    const lines = league.playerLines();
    expect(lines.every((l) => l.avgRating >= 6 && l.avgRating <= 10)).toBe(true);
    const premier = league.playerLines(0); // the MVP award is per division
    const rec = league.finishSeason();
    expect(rec.awards?.mvp).toBeTruthy();
    expect(rec.awards!.mvp!.avgRating).toBeGreaterThanOrEqual(
      Math.max(...premier.map((l) => l.avgRating)) - 1e-9,
    );
    expect(rec.longestChain).toBeTruthy();
    expect(rec.longestChain!.length).toBeGreaterThanOrEqual(6); // some side strings six together in 56 matches
  });

  it('v8 saves migrate: rating/miscontrol/chain counters backfill to zero', () => {
    const league = new League({ seed: 5, matchDuration: 30 });
    const json = JSON.parse(JSON.stringify(league.toJSON())) as Record<string, unknown>;
    json.version = 8;
    for (const arr of json.playerAgg as Array<Array<Record<string, unknown>>>) {
      for (const s of arr) {
        delete s.miscontrols;
        delete s.rating;
      }
    }
    for (const a of json.agg as Array<Record<string, unknown>>) delete a.longestChain;
    const restored = League.fromJSON(json);
    expect(restored.playerAgg.every((arr) => arr.every((s) => s.rating === 0 && s.miscontrols === 0))).toBe(true);
    expect(restored.agg.every((a) => a.longestChain === 0)).toBe(true);
  });
});
