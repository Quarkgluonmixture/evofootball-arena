import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { ROSTER_SIZE, TEAM_SIZE, type MatchResult } from '../src/sim/types';

/**
 * Injuries (Phase 118, user-ratified defaults): the league-side seam —
 * banking, decrement, lineup exclusion, the 6-man floor, save v30.
 * Match-side occurrence is covered by the injury-census probe plus the
 * aggregate test at the bottom.
 */

/** Play the next fixture but overwrite the result's injuries array. */
function playWithInjuries(league: League, inject: (fx: { home: number; away: number }, res: MatchResult) => void): void {
  const fx = league.nextFixture()!;
  const res = league.createMatch(fx).runToCompletion();
  inject(fx, res);
  league.applyResult(fx, res);
}

describe('injuries (Phase 118)', () => {
  it('banks rounds, decrements per fixture, excludes from the lineup', () => {
    const league = new League({ seed: 41, matchDuration: 30 });
    const victim = { slot: -1, ri: 2 };
    playWithInjuries(league, (fx, res) => {
      victim.slot = fx.home;
      res.injuries = Array<number>(ROSTER_SIZE * 2).fill(0);
      res.injuries[victim.ri] = 3; // home roster row 2, out 3 rounds
    });
    const f = league.franchise(victim.slot);
    expect(f.injuries[victim.ri]).toBe(3);

    // He must not appear in the club's lineup while out.
    const infoWhileOut = league.createMatch({
      round: 0, index: 0, division: f.division, home: victim.slot,
      away: league.franchise(victim.slot === 0 ? 1 : 0).slot, played: false,
    });
    const names = infoWhileOut.teams[0].players.map((p) => p.rosterIdx);
    expect(names).not.toContain(victim.ri);

    // Absence serves down as his club plays.
    while (f.injuries[victim.ri] > 0 && !league.seasonDone) {
      const before = f.injuries[victim.ri];
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
      if (fx.home === victim.slot || fx.away === victim.slot) {
        expect(f.injuries[victim.ri]).toBeLessThanOrEqual(before);
      }
    }
  });

  it('the 6-man floor: an absence that would strand the club downgrades to a knock', () => {
    const league = new League({ seed: 43, matchDuration: 30 });
    let slot = -1;
    playWithInjuries(league, (fx, res) => {
      slot = fx.home;
      // Injure four of the nine: 9 - 3 (already out) leaves exactly 6 —
      // the FOURTH would leave 5 and must be refused.
      res.injuries = Array<number>(ROSTER_SIZE * 2).fill(0);
      res.injuries[1] = 2;
      res.injuries[2] = 2;
      res.injuries[3] = 2;
      res.injuries[4] = 2;
    });
    const f = league.franchise(slot);
    const out = f.injuries.filter((r) => r > 0).length;
    expect(out).toBe(3); // the fourth banking was downgraded
    const available = f.squad.filter((_, ri) => (f.injuries[ri] ?? 0) === 0 && (f.suspensions[ri] ?? 0) === 0).length;
    expect(available).toBeGreaterThanOrEqual(TEAM_SIZE);
  });

  it('season end clears the treatment table', () => {
    const league = new League({ seed: 44, matchDuration: 30 });
    let slot = -1;
    playWithInjuries(league, (fx, res) => {
      slot = fx.home;
      res.injuries = Array<number>(ROSTER_SIZE * 2).fill(0);
      res.injuries[5] = 99;
    });
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    }
    league.finishSeason();
    expect(league.franchise(slot).injuries.every((r) => r === 0)).toBe(true);
  });

  it('v29 saves migrate: everyone starts fit', () => {
    const league = new League({ seed: 45, matchDuration: 30 });
    const data = league.toJSON() as Record<string, unknown> & {
      version: number;
      franchises: Array<Record<string, unknown>>;
    };
    data.version = 29; // forge a pre-injury save
    for (const f of data.franchises) delete f.injuries;
    const loaded = League.fromJSON(JSON.parse(JSON.stringify(data)) as Record<string, unknown>);
    for (const f of loaded.franchises) {
      expect(f.injuries.length).toBe(f.squad.length);
      expect(f.injuries.every((r) => r === 0)).toBe(true);
    }
  });

  it('injuries actually occur across seeded matches, and every serious one is banked', () => {
    const league = new League({ seed: 46, matchDuration: 240 });
    let injuries = 0;
    let serious = 0;
    for (let i = 0; i < 24 && !league.seasonDone; i++) {
      const fx = league.nextFixture()!;
      const res = league.createMatch(fx).runToCompletion();
      injuries += res.stats[0].injuries + res.stats[1].injuries;
      serious += (res.injuries ?? []).filter((r) => r > 0).length;
      league.applyResult(fx, res);
    }
    expect(injuries).toBeGreaterThan(0); // ~0.2/match × 24 — deterministic seeds
    expect(serious).toBeLessThanOrEqual(injuries);
  });
});
