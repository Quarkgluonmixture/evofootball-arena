import { describe, expect, it } from 'vitest';
import { ATTACK_FORMATIONS, DEFEND_FORMATIONS } from '../src/ai/formations';
import { League } from '../src/sim/League';

/** The shape timeline's data (Phase 116, save v29): styleMatrix rows carry
 * the discrete formation identity each season. */
describe('shape history (Phase 116)', () => {
  it('finishSeason records every club\'s formation identity', () => {
    const league = new League({ seed: 31, matchDuration: 30 });
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    }
    const record = league.finishSeason();
    expect(record.styleMatrix).toBeDefined();
    expect(record.styleMatrix!.length).toBe(16);
    for (const row of record.styleMatrix!) {
      expect(row.style).toBeDefined();
      expect(Object.keys(ATTACK_FORMATIONS)).toContain(row.style!.formationAtk);
      expect(Object.keys(DEFEND_FORMATIONS)).toContain(row.style!.formationDef);
      expect(['man', 'zonal']).toContain(row.style!.scheme);
    }
  });

  it('v28 saves migrate: pre-shape styleMatrix rows stay valid', () => {
    const league = new League({ seed: 32, matchDuration: 30 });
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    }
    league.finishSeason();
    const data = league.toJSON() as Record<string, unknown> & {
      version: number;
      history: Array<{ styleMatrix?: Array<Record<string, unknown>> }>;
    };
    data.version = 28; // forge a pre-shape save
    for (const r of data.history) for (const row of r.styleMatrix ?? []) delete row.style;
    const loaded = League.fromJSON(JSON.parse(JSON.stringify(data)) as Record<string, unknown>);
    expect(loaded.history[0].styleMatrix![0].style).toBeUndefined();
    expect(loaded.generation).toBe(league.generation);
  });
});
