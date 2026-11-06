import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { League } from '../src/sim/League';
import type { Match } from '../src/sim/Match';
import { runHeadless, type SimRequest } from '../src/sim/simRunner';
import {
  a4ArmedVersion, a4HeadlessWorld, a4MatchFlags, armA4World,
  poolPcDoseTable, poolT1DoseCells, type A4LeagueWorld,
} from '../src/game/a4World';
import type { SimWorkerMessage, SimWorkerRequest } from '../src/game/simWorker';

/**
 * THE LEAGUE PLAYS THE CHOSEN WORLD (user decision 2026-11-06, docs/STATUS.md): world 18 is the
 * default, and the fast-simmed league — main-thread fallback AND sim worker — must play exactly
 * what a watched world-18 fixture plays: same construction flags, same per-match arm, same doses.
 *
 * Bugs these tests catch:
 *  - the worker / headless league silently playing world 0 while world 18 is selected
 *    (the pre-2026-11-06 behaviour: `League.fromJSON` carries no `matchFlags`, no arm);
 *  - the headless league diverging from the main-thread loop for the same seed in world 18
 *    (e.g. books carried across the worker boundary, a different dose, a missed arm);
 *  - a save written before any of this (no world field anywhere) failing to load or to play.
 */

const repoText = (p: string): string => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const L3_DOSE = poolT1DoseCells(
  JSON.parse(repoText('docs/world-model/data/l3-t1-convergence-exam.json')) as unknown,
);
const PC_DOSE = poolPcDoseTable(
  JSON.parse(repoText('docs/world-model/data/pc-t1-learning-exam.json')) as unknown,
);

const W18: A4LeagueWorld = { version: 18, tables: null, l3Dose: L3_DOSE, pcDose: PC_DOSE };
const W0: A4LeagueWorld = { version: 0, tables: null, l3Dose: null, pcDose: null };
const SEASON: SimRequest = { kind: 'toGeneration', target: 2 };

const makeLeague = (seed: number): League => new League({ seed, matchDuration: 30 });
/** What postMessage's structured clone does in the worker path. */
const cloneData = (league: League): Record<string, unknown> =>
  JSON.parse(JSON.stringify(league.toJSON())) as Record<string, unknown>;

/** The MAIN-THREAD way: flags on the live league, every fixture built then armed (GameApp). */
const playDirect = (league: League, world: A4LeagueWorld, fixtures = Infinity): void => {
  if (world.version !== 0) league.matchFlags = a4MatchFlags(world.version);
  let n = 0;
  while (n < fixtures) {
    const f = league.nextFixture()!;
    const m = league.createMatch(f);
    // the app's guard reduces to `version !== 0` for every world that needs no census tables
    if (world.version !== 0) armA4World(m, world.tables, world.version, world.l3Dose, world.pcDose);
    league.applyResult(f, m.runToCompletion());
    n++;
    if (league.seasonDone) {
      league.finishSeason();
      if (fixtures === Infinity) return;
    }
  }
};

describe('the headless league plays the chosen world', () => {
  it('world 18: runHeadless is byte-identical to the main-thread loop, and differs from world 0', () => {
    const direct = makeLeague(424242);
    const data = cloneData(direct);
    const data0 = cloneData(direct);
    playDirect(direct, W18);
    const out = runHeadless(data, SEASON, undefined, undefined, a4HeadlessWorld(W18));
    expect(out.seasonsCompleted).toBe(1);
    expect(JSON.stringify(out.league)).toBe(JSON.stringify(direct.toJSON()));
    // ⛔ the old behaviour — no world — is a DIFFERENT league: the pin above is not vacuous
    const bare = runHeadless(data0, SEASON);
    expect(JSON.stringify(bare.league)).not.toBe(JSON.stringify(out.league));
  }, 120_000);

  it('every headless fixture in world 18 is a world-18 match (flags at construction + the arm)', () => {
    const w = a4HeadlessWorld(W18);
    expect(w.arm).toBeDefined();
    const seen = new Map<number, number>();
    const spy = { ...w, arm: (m: Match) => {
      w.arm!(m);
      const v = a4ArmedVersion(m);
      seen.set(v, (seen.get(v) ?? 0) + 1);
    } };
    const out = runHeadless(cloneData(makeLeague(31313)), { kind: 'round' }, undefined, undefined, spy);
    expect(out.matches).toBeGreaterThan(0);
    expect([...seen.entries()]).toEqual([[18, out.matches]]);
  }, 60_000);

  it('mid-season handoff in world 18: main thread plays some fixtures, the worker continues identically', () => {
    const direct = makeLeague(1337);
    playDirect(direct, W18, 19); // into the cup R16, books touched on the main thread
    const handoff = cloneData(direct); // books and flags are NOT in the save
    playDirect(direct, W18);
    const out = runHeadless(handoff, SEASON, undefined, undefined, a4HeadlessWorld(W18));
    expect(out.matches).toBe(71 - 19);
    expect(JSON.stringify(out.league)).toBe(JSON.stringify(direct.toJSON()));
  }, 120_000);

  it('world 0 builds no arm; its flags are whatever the caller passes (the EDS preview set)', () => {
    expect(a4HeadlessWorld(W0)).toEqual({ matchFlags: {} });
    const eds = { edsPerceivedChoice: true };
    expect(a4HeadlessWorld(W0, eds)).toEqual({ matchFlags: eds });
  });

  it('a census world whose tables have not landed (v2, tables null) arms nothing, as the app skips it', () => {
    const w = a4HeadlessWorld({ ...W0, version: 2 });
    const league = makeLeague(5);
    league.matchFlags = w.matchFlags;
    const m = league.createMatch(league.nextFixture()!);
    w.arm!(m);
    expect(m.stationEye).toBeNull();
    expect(a4ArmedVersion(m)).toBe(0);
  });
});

describe('the sim worker plays the chosen world', () => {
  const posted: SimWorkerMessage[] = [];
  const ctx = {
    postMessage: (m: SimWorkerMessage) => { posted.push(m); },
    onmessage: null as ((ev: { data: SimWorkerRequest }) => void) | null,
  };
  const worker = async (msg: SimWorkerRequest): Promise<Record<string, unknown>> => {
    (globalThis as unknown as { self: unknown }).self = ctx;
    await import('../src/game/simWorker');
    posted.length = 0;
    ctx.onmessage!({ data: msg });
    const done = posted.find((m) => m.type !== 'progress');
    if (done?.type !== 'done') throw new Error(`worker did not finish: ${JSON.stringify(done)}`);
    return done.league;
  };

  it('a world-18 message plays world 18 — the same league the main thread would have', async () => {
    const direct = makeLeague(2026);
    const msg: SimWorkerRequest = {
      league: cloneData(direct), req: SEASON, matchFlags: a4MatchFlags(18), a4: W18,
    };
    playDirect(direct, W18);
    expect(JSON.stringify(await worker(msg))).toBe(JSON.stringify(direct.toJSON()));
  }, 120_000);

  it('a message from before the world fields (or a save without them) still runs — as world 0', async () => {
    const base = makeLeague(2027);
    const save = cloneData(base);
    expect('matchFlags' in save).toBe(false); // the save format did not change
    const viaWorker = await worker({ league: cloneData(base), req: SEASON });
    expect(JSON.stringify(viaWorker)).toBe(JSON.stringify(runHeadless(save, SEASON).league));
  }, 120_000);
});

describe('GameApp hands the worker its world', () => {
  const APP = repoText('src/game/GameApp.ts');
  it('the posted request carries the live flags and the armed payload', () => {
    expect(APP).toContain('matchFlags: this.league.matchFlags,');
    expect(APP).toContain('a4: this.a4LeagueWorld(),');
    expect(APP).toContain(
      'return { version: this.a4World, tables: this.a4Tables, l3Dose: this.l3Dose, pcDose: this.pcDose };',
    );
    // the watched fixture arms with the very same four fields
    expect(APP).toContain('armA4World(this.match, this.a4Tables, this.a4World, this.l3Dose, this.pcDose);');
  });

  it('a fast-sim waits for a world still loading', () => {
    const run = APP.slice(APP.indexOf('private runSim('));
    expect(run.slice(0, run.indexOf('ensureSimWorker()'))).toContain('const arming = this.a4Arming;');
  });
});
