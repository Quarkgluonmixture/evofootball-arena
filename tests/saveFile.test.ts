import { describe, expect, it } from 'vitest';
import { exportLeagueJSON, importLeagueJSON, isLeagueSaveData } from '../src/data/save';
import { League } from '../src/sim/League';

describe('save file export / import (Phase 21)', () => {
  it('roundtrips a mid-season league byte-identically and keeps simulating identically', () => {
    const league = new League({ seed: 987 });
    for (let i = 0; i < 5; i++) {
      const f = league.nextFixture()!;
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
    const text = exportLeagueJSON(league);
    const imported = importLeagueJSON(text);
    expect(imported).not.toBeNull();
    expect(JSON.stringify(imported!.toJSON())).toBe(text);

    // The imported league's future replays exactly (derived seeds, no RNG state).
    const r1 = league.createMatch(league.nextFixture()!).runToCompletion();
    const r2 = imported!.createMatch(imported!.nextFixture()!).runToCompletion();
    expect(r2.score).toEqual(r1.score);
  });

  it('rejects garbage, non-objects and unknown versions instead of throwing', () => {
    expect(importLeagueJSON('not json at all')).toBeNull();
    expect(importLeagueJSON('42')).toBeNull();
    expect(importLeagueJSON('{"hello":1}')).toBeNull();
    expect(importLeagueJSON(JSON.stringify({ version: 999, seed: 1, generation: 1 }))).toBeNull();
  });

  it('isLeagueSaveData accepts every real save the game writes', () => {
    expect(isLeagueSaveData(new League({ seed: 3 }).toJSON())).toBe(true);
  });
});
