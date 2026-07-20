import { describe, expect, it } from 'vitest';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { HALF_L, PLAYER_MIN_DIST } from '../src/sim/constants';
import { Match } from '../src/sim/Match';
import type { Player } from '../src/sim/Player';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

type SolverAccess = { resolveOverlaps(): void };

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name,
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `${name}${i}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

const match = (): Match => new Match({ seed: 19, teamA: team('A', 1), teamB: team('B', 2), duration: 1 });

const solve = (m: Match): void => {
  (m as unknown as SolverAccess).resolveOverlaps();
};

const isolate = (m: Match, a: Player, b: Player): void => {
  for (const p of m.allPlayers) p.pos = { x: 100 + p.gid * 10, y: 100 };
  a.pos = { x: -0.5, y: 0 };
  b.pos = { x: 0.5, y: 0 };
};

describe('M1 contact velocity response', () => {
  it('removes only closing relative normal velocity for an equal pair', () => {
    const m = match();
    const a = m.teams[0].players[1];
    const b = m.teams[1].players[1];
    isolate(m, a, b);
    a.vel = { x: 4, y: 2 };
    b.vel = { x: -2, y: -1 };

    solve(m);

    expect(Math.hypot(a.pos.x - b.pos.x, a.pos.y - b.pos.y)).toBe(PLAYER_MIN_DIST);
    expect(a.vel.x).toBe(1);
    expect(b.vel.x).toBe(1);
    expect(a.vel.y).toBe(2); // tangent survives
    expect(b.vel.y).toBe(-1);
  });

  it('does not damp a pair that is already separating', () => {
    const m = match();
    const a = m.teams[0].players[1];
    const b = m.teams[1].players[1];
    isolate(m, a, b);
    a.vel = { x: -2, y: 0.5 };
    b.vel = { x: 3, y: -0.25 };

    solve(m);

    expect(a.vel).toEqual({ x: -2, y: 0.5 });
    expect(b.vel).toEqual({ x: 3, y: -0.25 });
  });

  it('keeps an in-box keeper anchored and removes the opponent closing speed', () => {
    const m = match();
    const gk = m.teams[0].players[0];
    const opponent = m.teams[1].players[5];
    for (const p of m.allPlayers) p.pos = { x: 100 + p.gid * 10, y: 100 };
    gk.pos = { x: -HALF_L + 1, y: 0 };
    opponent.pos = { x: gk.pos.x + 1, y: 0 };
    gk.vel = { x: 0, y: 0 };
    opponent.vel = { x: -4, y: 1 };
    const keeperPos = { ...gk.pos };

    solve(m);

    expect(gk.pos).toEqual(keeperPos);
    expect(gk.vel).toEqual({ x: 0, y: 0 });
    expect(opponent.vel).toEqual({ x: 0, y: 1 });
    expect(Math.hypot(gk.pos.x - opponent.pos.x, gk.pos.y - opponent.pos.y)).toBeCloseTo(PLAYER_MIN_DIST, 12);
  });
});
