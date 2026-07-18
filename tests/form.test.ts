import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { recentForm } from '../src/ui/form';

/** Form strip data (Phase 114): the last-5 tape agrees with the table. */
describe('recentForm (Phase 114)', () => {
  it('matches the season table while ≤5 rounds are played, cup ties excluded', () => {
    const league = new League({ seed: 21, matchDuration: 30 });
    for (let round = 0; round < 4; round++) {
      for (let i = 0; i < 8; i++) {
        const fx = league.nextFixture()!;
        league.applyResult(fx, league.createMatch(fx).runToCompletion());
      }
    }
    for (const row of league.table) {
      if (row.played > 5) continue;
      const form = recentForm(league, row.slot);
      expect(form.length).toBe(row.played);
      expect(form.filter((r) => r === 'W').length).toBe(row.w);
      expect(form.filter((r) => r === 'D').length).toBe(row.d);
      expect(form.filter((r) => r === 'L').length).toBe(row.l);
    }
  });

  it('caps at the last five once the season runs longer', () => {
    const league = new League({ seed: 22, matchDuration: 30 });
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    }
    for (const f of [...league.division(0), ...league.division(1)]) {
      expect(recentForm(league, f.slot).length).toBe(5);
    }
  });
});
