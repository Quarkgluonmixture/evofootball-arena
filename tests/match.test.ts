import { describe, expect, it } from 'vitest';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { DT } from '../src/sim/constants';
import { Match, type MatchConfig } from '../src/sim/Match';
import type { TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

function makeTeam(name: string, seed: number): TeamInfo {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wg', 'St'],
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
}

function makeConfig(seed: number, duration = 40): MatchConfig {
  return { seed, teamA: makeTeam('Alpha', 100), teamB: makeTeam('Beta', 200), duration };
}

describe('Match', () => {
  it('same seed => identical result (determinism)', () => {
    const a = new Match(makeConfig(1234)).runToCompletion();
    const b = new Match(makeConfig(1234)).runToCompletion();
    expect(a.score).toEqual(b.score);
    expect(a.events.length).toBe(b.events.length);
    expect(a.events.map((e) => e.text)).toEqual(b.events.map((e) => e.text));
    expect(a.stats[0]).toEqual(b.stats[0]);
    expect(a.stats[1]).toEqual(b.stats[1]);
  });

  it('watched (step-by-step) equals headless (runToCompletion)', () => {
    const m1 = new Match(makeConfig(777));
    while (!m1.finished) m1.step(DT);
    const r1 = m1.getResult();
    const r2 = new Match(makeConfig(777)).runToCompletion();
    expect(r1.score).toEqual(r2.score);
    expect(r1.stats[0]).toEqual(r2.stats[0]);
  });

  it('different seeds diverge', () => {
    const results = [11, 22, 33, 44].map((s) => new Match(makeConfig(s, 60)).runToCompletion());
    const signatures = results.map((r) => `${r.score.join('-')}|${r.events.length}|${r.stats[0].passes}`);
    expect(new Set(signatures).size).toBeGreaterThan(1);
  });

  it('positions stay finite and inside the arena', () => {
    const m = new Match(makeConfig(555, 60));
    while (!m.finished) {
      m.step(DT);
      for (const p of m.allPlayers) {
        expect(Number.isFinite(p.pos.x)).toBe(true);
        expect(Number.isFinite(p.pos.y)).toBe(true);
        if (p.sentOff) continue; // parked on the apron OUTSIDE the pitch (Phase 25)
        expect(Math.abs(p.pos.x)).toBeLessThanOrEqual(46);
        expect(Math.abs(p.pos.y)).toBeLessThanOrEqual(30);
      }
      expect(Number.isFinite(m.ball.pos.x)).toBe(true);
      expect(Number.isFinite(m.ball.pos.y)).toBe(true);
    }
    expect(m.phase).toBe('fulltime');
  });

  it('football happens: shots and passes accumulate across seeds', () => {
    let shots = 0;
    let passes = 0;
    for (const seed of [1, 2, 3, 4, 5, 6]) {
      const r = new Match(makeConfig(seed, 60)).runToCompletion();
      shots += r.stats[0].shots + r.stats[1].shots;
      passes += r.stats[0].passes + r.stats[1].passes;
    }
    expect(shots).toBeGreaterThan(0);
    expect(passes).toBeGreaterThan(20);
  });

  it('the clock reaches full time and produces the fulltime event', () => {
    const r = new Match(makeConfig(9)).runToCompletion();
    expect(r.events.some((e) => e.type === 'fulltime')).toBe(true);
    expect(r.events.some((e) => e.type === 'halftime')).toBe(true);
  });
});
