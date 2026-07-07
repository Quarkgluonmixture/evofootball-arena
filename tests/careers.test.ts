import { describe, expect, it } from 'vitest';
import {
  developPlayer, emptyCareer, retireChance, rookieAge, veteranAge,
} from '../src/evolution/careers';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { League, SAVE_VERSION } from '../src/sim/League';
import { Rng } from '../src/utils/rng';

const neutral = (): PlayerAttributes => ({
  pace: 0.5, technique: 0.5, finishing: 0.5, defending: 0.5, reflexes: 0.5,
});

/** Play a full season headless. */
const playSeason = (league: League): ReturnType<League['finishSeason']> => {
  while (!league.seasonDone) {
    const f = league.nextFixture()!;
    league.applyResult(f, league.createMatch(f).runToCompletion());
  }
  return league.finishSeason();
};

describe('player careers (Phase 26)', () => {
  it('development is directional: teenagers grow, veterans decline, pace fades fastest', () => {
    let young = 0;
    let old = 0;
    let oldPace = 0;
    let oldTech = 0;
    const N = 400;
    for (let s = 0; s < N; s++) {
      const y = developPlayer(neutral(), 18, new Rng(s));
      const o = developPlayer(neutral(), 33, new Rng(s + 10000));
      for (const k of ATTR_KEYS) {
        young += y[k] - 0.5;
        old += o[k] - 0.5;
      }
      oldPace += o.pace - 0.5;
      oldTech += o.technique - 0.5;
    }
    expect(young / N).toBeGreaterThan(0.05); // clear growth at 18
    expect(old / N).toBeLessThan(-0.05); // clear decline at 33
    expect(oldPace / N).toBeLessThan(oldTech / N); // pace declines hardest
  });

  it('retirement curve: nobody before 32, certain by 36', () => {
    for (let age = 17; age < 32; age++) expect(retireChance(age)).toBe(0);
    expect(retireChance(32)).toBeGreaterThan(0.1);
    expect(retireChance(36)).toBe(1);
    for (let s = 0; s < 50; s++) {
      const rng = new Rng(s);
      expect(rookieAge(rng)).toBeGreaterThanOrEqual(17);
      expect(rookieAge(rng)).toBeLessThanOrEqual(19);
      expect(veteranAge(rng)).toBeGreaterThanOrEqual(20);
      expect(veteranAge(rng)).toBeLessThanOrEqual(32);
    }
  });

  it('everyone ages a year per season; careers bank the season stats', () => {
    const league = new League({ seed: 11, matchDuration: 30 });
    // Young squads: nobody retires, nobody is reborn young — pin ages low.
    for (const f of league.franchises) f.ages = f.ages.map(() => 21);
    const before = league.franchises.map((f) => [...f.ages]);
    const rec = playSeason(league);
    const reborn = new Set(rec.evolution.entries.filter((e) => e.kind === 'reborn').map((e) => e.slot));
    for (const f of league.franchises) {
      if (reborn.has(f.slot)) {
        for (const age of f.ages) expect(age).toBeLessThanOrEqual(24); // fresh academy intake
        for (const c of f.careers) expect(c.seasons).toBe(0);
      } else {
        f.ages.forEach((age, i) => expect(age).toBe(before[f.slot][i] + 1));
        for (const c of f.careers) expect(c.seasons).toBe(1);
      }
    }
    // Somebody scored this season, so some career ledger holds goals.
    const careerGoals = league.franchises.reduce(
      (a, f) => a + f.careers.reduce((b, c) => b + c.goals, 0), 0);
    expect(careerGoals).toBeGreaterThan(0);
  });

  it('a squad of 35-year-olds retires en masse into newgens, filling the report and legends', () => {
    const league = new League({ seed: 7, matchDuration: 30 });
    const target = league.franchises[0];
    target.ages = target.ages.map(() => 35); // 36 after ageing ⇒ retireChance 1
    const oldNames = [...target.playerNames];
    const rec = playSeason(league);
    const reborn = new Set(rec.evolution.entries.filter((e) => e.kind === 'reborn').map((e) => e.slot));
    if (!reborn.has(0)) {
      const retiredFromTarget = rec.retirements!.filter((r) => r.team === target.name);
      expect(retiredFromTarget).toHaveLength(5);
      for (const r of retiredFromTarget) expect(r.age).toBe(36);
      target.ages.forEach((age) => {
        expect(age).toBeGreaterThanOrEqual(17);
        expect(age).toBeLessThanOrEqual(19);
      });
      for (const c of target.careers) expect(c).toEqual(emptyCareer());
      // Newgens took fresh names (surnames may repeat across the league, but
      // the squad itself must have turned over).
      expect(target.playerNames).not.toEqual(oldNames);
      // The retirees entered the hall's ledger.
      expect(league.legends.length).toBeGreaterThan(0);
    }
    expect(rec.retirements!.length).toBeGreaterThanOrEqual(5 - (reborn.has(0) ? 5 : 0));
  });

  it('long run: 12 seasons keep mean age and mean attributes in sane bands', async () => {
    const league = new League({ seed: 21, matchDuration: 30 });
    for (let s = 0; s < 12; s++) {
      playSeason(league);
      await new Promise((r) => setImmediate(r)); // keep vitest's worker RPC alive on slow CI
    }
    let ageSum = 0;
    let attrSum = 0;
    let n = 0;
    for (const f of league.franchises) {
      for (let i = 0; i < 5; i++) {
        ageSum += f.ages[i];
        for (const k of ATTR_KEYS) attrSum += f.squad[i][k];
        n++;
      }
    }
    const meanAge = ageSum / n;
    const meanAttr = attrSum / (n * ATTR_KEYS.length);
    expect(meanAge).toBeGreaterThan(21);
    expect(meanAge).toBeLessThan(30);
    expect(meanAttr).toBeGreaterThan(0.35);
    expect(meanAttr).toBeLessThan(0.65);
    // Ages stay in the human range — no immortals, no toddlers.
    for (const f of league.franchises) {
      for (const age of f.ages) {
        expect(age).toBeGreaterThanOrEqual(17);
        expect(age).toBeLessThanOrEqual(36);
      }
    }
  }, 60000);

  it('determinism: same seed ⇒ identical careers, ages and legends across seasons', () => {
    const a = new League({ seed: 33, matchDuration: 30 });
    const b = new League({ seed: 33, matchDuration: 30 });
    for (let s = 0; s < 3; s++) {
      playSeason(a);
      playSeason(b);
    }
    expect(JSON.stringify(a.franchises)).toBe(JSON.stringify(b.franchises));
    expect(JSON.stringify(a.legends)).toBe(JSON.stringify(b.legends));
  });

  it('save/load: v7 roundtrips ages, careers and legends; the future replays identically', () => {
    const league = new League({ seed: 13, matchDuration: 30 });
    for (let s = 0; s < 4; s++) playSeason(league); // build some legends
    const copy = League.fromJSON(JSON.parse(JSON.stringify(league.toJSON())) as Record<string, unknown>);
    expect(JSON.stringify(copy.legends)).toBe(JSON.stringify(league.legends));
    expect(JSON.stringify(copy.franchises)).toBe(JSON.stringify(league.franchises));
    playSeason(league);
    playSeason(copy);
    expect(JSON.stringify(copy.franchises)).toBe(JSON.stringify(league.franchises));
  });

  it('v6 saves migrate: seeded ages backfill, blank careers, empty legends', () => {
    const league = new League({ seed: 5, matchDuration: 30 });
    const data = league.toJSON() as Record<string, unknown> & {
      version: number;
      franchises: Array<Record<string, unknown>>;
    };
    data.version = 6; // forge a pre-careers save
    for (const f of data.franchises) {
      delete f.ages;
      delete f.careers;
    }
    delete data.legends;
    const loaded = League.fromJSON(JSON.parse(JSON.stringify(data)) as Record<string, unknown>);
    expect(loaded.legends).toEqual([]);
    for (const f of loaded.franchises) {
      expect(f.ages).toHaveLength(5);
      for (const age of f.ages) {
        expect(age).toBeGreaterThanOrEqual(20);
        expect(age).toBeLessThanOrEqual(32);
      }
      for (const c of f.careers) expect(c).toEqual(emptyCareer());
    }
    // Deterministic backfill: migrating twice gives identical ages.
    const again = League.fromJSON(JSON.parse(JSON.stringify(data)) as Record<string, unknown>);
    expect(JSON.stringify(again.franchises.map((f) => f.ages)))
      .toBe(JSON.stringify(loaded.franchises.map((f) => f.ages)));
    // And the migrated league keeps playing.
    playSeason(loaded);
    expect(loaded.generation).toBe(2);
    expect((loaded.toJSON() as { version: number }).version).toBe(SAVE_VERSION);
  });
});
