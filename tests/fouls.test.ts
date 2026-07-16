import { describe, expect, it } from 'vitest';
import { GENE_KEYS, type TacticalGenome } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { DT, HALF_L, PENALTY_CLEARANCE, PENALTY_SPOT_DIST } from '../src/sim/constants';
import { Match } from '../src/sim/Match';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { dist, v2 } from '../src/utils/vec';

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
const team = (name: string, genome = neutral()): TeamInfo => ({
  id: name,
  name,
  short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
  genome,
  squad: neutralSquad(),
});

const playingMatch = (seed = 5, a = team('Alpha'), b = team('Beta')): Match => {
  const m = new Match({ seed, teamA: a, teamB: b, duration: 240 });
  while (m.phase !== 'playing') m.step(DT);
  return m;
};

describe('fouls — award rules (Phase 20)', () => {
  it('a foul outside the box plays advantage: counted and carded, never a stoppage (27.2)', () => {
    const m = playingMatch(11);
    m.ball.pos = v2(4, -6); // midfield — nobody's box
    const offender = m.teams[1].players[1];
    const victim = m.teams[0].players[3];
    m.awardFoul(offender, victim);

    // Play continues — the only fouls this sim produces are FAILED tackles,
    // so the carrier kept the ball and a whistle would punish the attackers.
    expect(m.phase).toBe('playing');
    expect(m.restart).toBeNull();
    expect(m.teams[1].stats.fouls).toBe(1);
    expect(m.teams[0].stats.penalties).toBe(0);
    expect(m.events.some((e) => e.type === 'foul' && e.text.includes('advantage'))).toBe(true);
  });

  it('a foul in the offender own box is a penalty at the drawn spot', () => {
    const m = playingMatch(12);
    // Team 0 attacks +x, so its own box is at the -x end.
    m.ball.pos = v2(-HALF_L + 5, 3);
    const offender = m.teams[0].players[1];
    const victim = m.teams[1].players[4];
    m.awardFoul(offender, victim);

    expect(m.restart!.kind).toBe('penalty');
    expect(m.restart!.side).toBe(victim.side);
    expect(m.restart!.pos.x).toBeCloseTo(-(HALF_L - PENALTY_SPOT_DIST), 5);
    expect(m.restart!.pos.y).toBeCloseTo(0, 5);
    expect(m.teams[0].stats.fouls).toBe(1);
    expect(m.teams[1].stats.penalties).toBe(1);
  });

  it('the penalty taker is the fouled team best finisher (outfielders only)', () => {
    const info = team('Beta');
    info.squad[2].finishing = 0.95; // the MF is the designated taker
    const m = playingMatch(13, team('Alpha'), info);
    m.ball.pos = v2(-HALF_L + 4, 0);
    m.awardFoul(m.teams[0].players[1], m.teams[1].players[4]);
    expect(m.restart!.takerGid).toBe(m.teams[1].players[2].gid);
  });

  it('penalty setup clears everyone but the taker and the defending keeper', () => {
    const m = playingMatch(14);
    m.ball.pos = v2(HALF_L - 5, -2); // team 1's own box (they defend +x)
    m.awardFoul(m.teams[1].players[2], m.teams[0].players[4]);
    expect(m.restart!.kind).toBe('penalty');
    const spot = { x: m.restart!.pos.x, y: m.restart!.pos.y };
    const takerGid = m.restart!.takerGid;

    // Let the setup phase run for a bit, then check the clearance circle.
    for (let i = 0; i < 90 && m.restart; i++) m.step(DT);
    if (m.restart) {
      for (const p of m.allPlayers) {
        if (p.gid === takerGid) continue;
        if (p.side === 1 && p.role === 'GK') continue; // keeper holds the line
        expect(dist(p.pos, spot)).toBeGreaterThanOrEqual(PENALTY_CLEARANCE - 0.05);
      }
    }
  });

  it('a penalty first touch is a shot by the taker', () => {
    const m = playingMatch(15);
    m.ball.pos = v2(HALF_L - 5, 2);
    m.awardFoul(m.teams[1].players[3], m.teams[0].players[4]);
    const takerGid = m.restart!.takerGid;
    const takerShotsBefore = m.stat(takerGid).shots;
    const teamShotsBefore = m.teams[0].stats.shots;

    // Run through setup + the kick itself.
    let kicked = false;
    for (let i = 0; i < 60 * 12 && !kicked; i++) {
      m.step(DT);
      if (m.teams[0].stats.shots > teamShotsBefore) kicked = true;
      if (m.finished) break;
    }
    expect(kicked).toBe(true);
    expect(m.stat(takerGid).shots).toBe(takerShotsBefore + 1);
  });

  it('same seed ⇒ identical fouls, penalties, score and events', () => {
    const run = () => {
      const m = new Match({ seed: 777, teamA: team('Alpha'), teamB: team('Beta'), duration: 240 });
      const r = m.runToCompletion();
      return {
        score: r.score,
        fouls: [r.stats[0].fouls, r.stats[1].fouls],
        pens: [r.stats[0].penalties, r.stats[1].penalties],
        events: r.events.length,
      };
    };
    expect(run()).toEqual(run());
  });

  it('directional: an aggressive-marking side commits more fouls (side-balanced)', () => {
    const aggressive = neutral();
    aggressive.markingAggression = 0.95;
    const careful = neutral();
    careful.markingAggression = 0.05;

    let aggFouls = 0;
    let carefulFouls = 0;
    for (const seed of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
      // Swap which side carries the trait to cancel any home/side bias.
      const m1 = new Match({
        seed, teamA: team('Agg', aggressive), teamB: team('Care', careful), duration: 240,
      });
      const r1 = m1.runToCompletion();
      aggFouls += r1.stats[0].fouls;
      carefulFouls += r1.stats[1].fouls;
      const m2 = new Match({
        seed: seed + 100, teamA: team('Care', careful), teamB: team('Agg', aggressive), duration: 240,
      });
      const r2 = m2.runToCompletion();
      carefulFouls += r2.stats[0].fouls;
      aggFouls += r2.stats[1].fouls;
    }
    expect(aggFouls).toBeGreaterThan(carefulFouls);
  });

  it('fouls occur at a sane rate across seeds (not zero, not a whistle-fest)', () => {
    let fouls = 0;
    let matches = 0;
    for (const seed of [21, 42, 63, 84]) {
      const m = new Match({ seed, teamA: team('Alpha'), teamB: team('Beta'), duration: 240 });
      const r = m.runToCompletion();
      fouls += r.stats[0].fouls + r.stats[1].fouls;
      matches++;
    }
    const perMatch = fouls / matches;
    expect(perMatch).toBeGreaterThan(0.5);
    expect(perMatch).toBeLessThan(12);
  });
});
