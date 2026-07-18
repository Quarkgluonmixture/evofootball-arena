import { describe, expect, it } from 'vitest';
import { GENE_KEYS, type TacticalGenome } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { GOAL_CHANNELS, TEAM_SIZE, type TeamInfo } from '../src/sim/types';

/**
 * Goal channels (Phase 113): every goal banks exactly one channel, the
 * shot-time classifier prices priorities correctly, and the ledgers survive
 * the save round-trip and the season record.
 */

const neutral = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};

const neutralSquad = (): PlayerAttributes[] =>
  Array.from({ length: TEAM_SIZE }, () => {
    const p = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) p[k] = 0.5;
    return p;
  });

function team(name: string): TeamInfo {
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
    genome: neutral(),
    squad: neutralSquad(),
    style: { formationAtk: 'wide-212', formationDef: 'press-23', scheme: 'man' },
  };
}

describe('goal channels (Phase 113)', () => {
  it('every goal banks exactly one channel (sum over channels === goals)', () => {
    for (const seed of [3, 17, 42]) {
      const m = new Match({ seed, teamA: team('A'), teamB: team('B') });
      const res = m.runToCompletion();
      for (const side of [0, 1] as const) {
        const st = res.stats[side];
        const sum = GOAL_CHANNELS.reduce((a, c) => a + st.goalChannels[c], 0);
        expect(sum).toBe(st.goals);
      }
    }
  });

  it('goalChannelFor prices the priority ladder', () => {
    const m = new Match({ seed: 5, teamA: team('A'), teamB: team('B'), duration: 120 });
    while (m.phase !== 'playing') m.step(1 / 60);
    const shooter = m.teams[0].players[5];

    // Nothing live → worked buildup.
    expect(m.goalChannelFor(shooter)).toBe('buildup');

    // A live breakaway entry owns the shot...
    m.attackEntry = { side: 0, kind: 'carry', t: m.simTime - 5 };
    expect(m.goalChannelFor(shooter)).toBe('carry');
    // ...unless it went stale (>12s) — then service class / buildup.
    m.attackEntry = { side: 0, kind: 'carry', t: m.simTime - 13 };
    expect(m.goalChannelFor(shooter)).toBe('buildup');
    // The opponent's entry never classifies our shot.
    m.attackEntry = { side: 1, kind: 'carry', t: m.simTime - 1 };
    expect(m.goalChannelFor(shooter)).toBe('buildup');

    // Cutback / cross service without an entry.
    m.attackEntry = null;
    m.lastCutback = { side: 0, t: m.simTime - 2 };
    expect(m.goalChannelFor(shooter)).toBe('cross');
    m.lastCutback = null;
    m.lastPassKind = { kind: 'cross', t: m.simTime - 1 };
    expect(m.goalChannelFor(shooter)).toBe('cross');

    // The set-piece stamp outranks everything within its 6s window.
    m.attackEntry = { side: 0, kind: 'carry', t: m.simTime - 1 };
    m.lastRestartKick = { kind: 'corner', side: 0, t: m.simTime - 3 };
    expect(m.goalChannelFor(shooter)).toBe('setpiece');
    // ...but not the OPPONENT'S set piece (the counter off a corner).
    m.lastRestartKick = { kind: 'corner', side: 1, t: m.simTime - 3 };
    expect(m.goalChannelFor(shooter)).toBe('carry');
    // ...and not once the window closes.
    m.lastRestartKick = { kind: 'freeKick', side: 0, t: m.simTime - 7 };
    expect(m.goalChannelFor(shooter)).toBe('carry');
  });

  it('season aggregates carry the ledgers and the record clones them', () => {
    const league = new League({ seed: 9, matchDuration: 30 });
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    }
    const aggBefore = league.agg.map((a) => ({ f: { ...a.chFor }, a: { ...a.chAgainst } }));
    const record = league.finishSeason();
    let goals = 0;
    for (const row of record.table) {
      expect(row.ch).toBeDefined();
      const f = GOAL_CHANNELS.reduce((s, c) => s + row.ch!.f[c], 0);
      const a = GOAL_CHANNELS.reduce((s, c) => s + row.ch!.a[c], 0);
      expect(f).toBe(row.gf);
      expect(a).toBe(row.ga);
      expect(row.ch!.f).toEqual(aggBefore[row.slot].f);
      expect(row.ch!.a).toEqual(aggBefore[row.slot].a);
      goals += row.gf;
    }
    expect(goals).toBeGreaterThan(0);
  });

  it('v27 saves migrate: channel ledgers backfill empty', () => {
    const league = new League({ seed: 13, matchDuration: 30 });
    const data = league.toJSON() as Record<string, unknown> & {
      version: number;
      agg: Array<Record<string, unknown>>;
    };
    data.version = 27; // forge a pre-channel save
    for (const a of data.agg) {
      delete a.chFor;
      delete a.chAgainst;
    }
    const loaded = League.fromJSON(JSON.parse(JSON.stringify(data)) as Record<string, unknown>);
    for (const a of loaded.agg) {
      for (const c of GOAL_CHANNELS) {
        expect(a.chFor[c]).toBe(0);
        expect(a.chAgainst[c]).toBe(0);
      }
    }
  });
});
