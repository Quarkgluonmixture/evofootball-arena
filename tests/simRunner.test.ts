import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { runHeadless, type SimProgress } from '../src/sim/simRunner';

/**
 * The sim-worker core must be indistinguishable from simulating on the League
 * directly: same seed ⇒ byte-identical save JSON. This is what makes the
 * worker swap safe — the main thread can adopt the returned league blindly.
 */

const makeLeague = (seed = 99) => new League({ seed, matchDuration: 30 });

/** What postMessage's structured clone does in the worker path. */
const cloneData = (league: League): Record<string, unknown> =>
  JSON.parse(JSON.stringify(league.toJSON())) as Record<string, unknown>;

const playSeasonDirect = (league: League): void => {
  while (!league.seasonDone) {
    const f = league.nextFixture()!;
    league.applyResult(f, league.createMatch(f).runToCompletion());
  }
  league.finishSeason();
};

describe('simRunner (sim worker core)', () => {
  it('one season via runHeadless is byte-identical to direct simulation', () => {
    const direct = makeLeague();
    const viaWorker = cloneData(direct); // both start from the same state
    playSeasonDirect(direct);
    const out = runHeadless(viaWorker, { kind: 'toGeneration', target: 2 });

    expect(out.seasonsCompleted).toBe(1);
    expect(out.matches).toBe(71); // 56 league + 15 cup
    expect(JSON.stringify(out.league)).toBe(JSON.stringify(direct.toJSON()));
  });

  it('mid-season handoff continues exactly where the main thread stopped', () => {
    const direct = makeLeague(7);
    // Main thread plays into the cup R16 (16 league + 3 ties), then hands off.
    for (let i = 0; i < 19; i++) {
      const f = direct.nextFixture()!;
      direct.applyResult(f, direct.createMatch(f).runToCompletion());
    }
    const handoff = cloneData(direct);
    playSeasonDirect(direct);
    const out = runHeadless(handoff, { kind: 'toGeneration', target: 2 });

    expect(out.matches).toBe(71 - 19);
    expect(JSON.stringify(out.league)).toBe(JSON.stringify(direct.toJSON()));
  });

  it('multi-season runs advance evolution identically', () => {
    const direct = makeLeague(41);
    const viaWorker = cloneData(direct);
    for (let s = 0; s < 3; s++) playSeasonDirect(direct);
    const out = runHeadless(viaWorker, { kind: 'toGeneration', target: 4 });

    expect(out.seasonsCompleted).toBe(3);
    const restored = League.fromJSON(out.league);
    expect(restored.generation).toBe(4);
    expect(restored.history.map((r) => r.championName)).toEqual(direct.history.map((r) => r.championName));
    expect(JSON.stringify(out.league)).toBe(JSON.stringify(direct.toJSON()));
  });

  it("a 'round' request stops exactly where GameApp's round grouping stops", () => {
    const league = makeLeague(11);
    const out = runHeadless(cloneData(league), { kind: 'round' });
    expect(out.matches).toBe(8); // round 1 = 4 fixtures per division
    const restored = League.fromJSON(out.league);
    expect(restored.currentRound()).toBe(2);
    expect(restored.generation).toBe(1);

    // From inside a cup block, 'round' finishes just the cup round.
    // (8 more league fixtures reach 16 played — the R16 splice point.)
    for (let i = 0; i < 8; i++) {
      const f = restored.nextFixture()!;
      restored.applyResult(f, restored.createMatch(f).runToCompletion());
    }
    expect(restored.nextFixture()!.cup).toBe(true);
    const cupRun = runHeadless(cloneData(restored), { kind: 'round' });
    expect(cupRun.matches).toBe(8); // the whole R16, nothing more
    expect(League.fromJSON(cupRun.league).nextFixture()!.cup).toBeUndefined();
  });

  it('streams monotonic progress and flags season boundaries', () => {
    const seen: SimProgress[] = [];
    runHeadless(cloneData(makeLeague(3)), { kind: 'toGeneration', target: 2 }, (p) => seen.push({ ...p }));
    expect(seen.length).toBeGreaterThan(3);
    for (let i = 1; i < seen.length; i++) expect(seen[i].matches).toBeGreaterThanOrEqual(seen[i - 1].matches);
    expect(seen[seen.length - 1].seasonFinished).toBe(true);
    expect(seen[seen.length - 1].generation).toBe(2);
  });
});
