import { describe, expect, it } from 'vitest';
import { emptyCareer } from '../src/evolution/careers';
import {
  FREE_AGENT_MAX_AGE, FREE_AGENT_POOL_MAX, agentTotal, trimPool, type FreeAgent,
} from '../src/evolution/freeAgents';
import { ATTR_KEYS, SQUAD_BUDGET, squadTotal, type PlayerAttributes } from '../src/evolution/playerGenome';
import { neutralStyle } from '../src/evolution/playerStyle';
import { League } from '../src/sim/League';

const attrs = (v: number): PlayerAttributes => {
  const a = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) a[k] = v;
  return a;
};

const agent = (name: string, v: number, age = 24, role: FreeAgent['role'] = 'ST'): FreeAgent => ({
  name, role, attrs: attrs(v), style: neutralStyle(), age,
  career: { ...emptyCareer(), seasons: 3, goals: 9 },
  lastClub: 'Gone FC', sinceGen: 1,
});

const playSeason = (league: League) => {
  while (!league.seasonDone) {
    const f = league.nextFixture()!;
    league.applyResult(f, league.createMatch(f).runToCompletion());
  }
  return league.finishSeason();
};

describe('the free-agent fire-sale (Phase 55)', () => {
  it('dead clubs\' players hit the market with genes, ages and careers intact', () => {
    const league = new League({ seed: 99, matchDuration: 30 });
    const rec = playSeason(league);
    const dead = rec.evolution.entries.filter((e) => e.kind === 'reborn').map((e) => e.oldName!);
    expect(dead).toHaveLength(3);
    expect(league.freeAgents.length).toBeGreaterThan(0);
    expect(league.freeAgents.length).toBeLessThanOrEqual(FREE_AGENT_POOL_MAX);
    for (const a of league.freeAgents) {
      expect(dead).toContain(a.lastClub);
      expect(a.attrs.pace).toBeGreaterThanOrEqual(0);
      // The intake ages with everyone (the pool-aging pass runs the same season).
      expect(a.age).toBeGreaterThan(17);
    }
  });

  it('a retirement vacancy signs from the market — career continuing, budget held', () => {
    const league = new League({ seed: 41, matchDuration: 30 });
    const target = league.franchises[2];
    target.ages[5] = 35; // the striker retires this season, guaranteed
    const rec = playSeason(league);
    // This seed's three club deaths feed the market the same season the
    // vacancies open — signings happen (the diag run showed five).
    expect(rec.signings!.length).toBeGreaterThanOrEqual(1);
    const signing = rec.signings!.find((s) => s.club === target.name);
    expect(signing).toBeDefined();
    const slot = target.playerNames.indexOf(signing!.player);
    expect(slot).toBeGreaterThanOrEqual(0);
    // The discriminator vs an academy newgen: a signed man ARRIVES with a
    // past (newgen careers start at zero seasons).
    expect(target.careers[slot].seasons).toBeGreaterThanOrEqual(1);
    expect(target.ages[slot]).toBeGreaterThanOrEqual(18);
    for (const s of rec.signings!) {
      const club = league.franchises.find((f) => f.name === s.club)!;
      expect(squadTotal(club.squad)).toBeLessThanOrEqual(SQUAD_BUDGET + 1e-9);
    }
  });

  it('the board never signs over the budget or below the academy bar', () => {
    const league = new League({ seed: 42, matchDuration: 30 });
    const target = league.franchises[1];
    target.ages[5] = 35;
    // A god-squad agent that would blow the cap, and a scrub below bloodline.
    league.freeAgents.push(agent('Overpriced', 0.99, 24, 'ST'));
    league.freeAgents.push(agent('Scrub', 0.05, 24, 'ST'));
    const before = squadTotal(target.squad);
    const rec = playSeason(league);
    expect(rec.signings!.some((s) => s.player === 'Scrub')).toBe(false);
    // Overpriced signs ONLY where the headroom genuinely allows it.
    for (const s of rec.signings ?? []) {
      const club = league.franchises.find((f) => f.name === s.club)!;
      expect(squadTotal(club.squad)).toBeLessThanOrEqual(SQUAD_BUDGET + 1e-9);
    }
    expect(before).toBeLessThanOrEqual(SQUAD_BUDGET + 1e-9);
  });

  it('the pool is bounded and ages out', () => {
    const pool = Array.from({ length: 30 }, (_, i) => agent(`A${i}`, 0.3 + i * 0.01));
    expect(trimPool(pool)).toHaveLength(FREE_AGENT_POOL_MAX);
    expect(agentTotal(trimPool(pool)[0])).toBeGreaterThanOrEqual(agentTotal(trimPool(pool)[11]));

    const league = new League({ seed: 91, matchDuration: 30 });
    league.freeAgents.push(agent('Fossil', 0.9, FREE_AGENT_MAX_AGE + 2, 'ST'));
    league.freeAgents.push(agent('Forgotten', 0.2, 22, 'ST'));
    league.freeAgents[1].sinceGen = -5;
    playSeason(league);
    expect(league.freeAgents.some((a) => a.name === 'Fossil')).toBe(false);
    expect(league.freeAgents.some((a) => a.name === 'Forgotten')).toBe(false);
  });

  it('v16 saves migrate with an EMPTY market and the save roundtrips', () => {
    const league = new League({ seed: 8, matchDuration: 30 });
    playSeason(league);
    const json = JSON.parse(JSON.stringify(league.toJSON())) as Record<string, unknown> & { version: number };
    const rt = League.fromJSON(JSON.parse(JSON.stringify(json)) as Record<string, unknown>);
    expect(JSON.stringify(rt.toJSON())).toBe(JSON.stringify(json));
    json.version = 16;
    delete json.freeAgents;
    const restored = League.fromJSON(json);
    expect(restored.freeAgents).toEqual([]);
  });
});
