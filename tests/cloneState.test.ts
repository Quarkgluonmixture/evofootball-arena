import { describe, expect, it } from 'vitest';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { Match } from '../src/sim/Match';
import { cloneSimulationState } from '../src/sim/cloneState';
import { DT } from '../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name,
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

const match = (): Match => new Match({
  seed: 71,
  teamA: team('A', 101),
  teamB: team('B', 102),
  duration: 240,
});

const dynamicSnapshot = (match: Match): string => JSON.stringify({
  tick: match.simTick,
  time: match.simTime,
  phase: match.phase,
  score: match.score,
  ball: {
    pos: match.ball.pos,
    vel: match.ball.vel,
    owner: match.ball.owner?.gid ?? null,
    lastTouch: match.ball.lastTouch?.gid ?? null,
  },
  players: match.allPlayers.map((player) => ({
    pos: player.pos,
    vel: player.vel,
    bodyDir: player.bodyDir,
    action: player.action,
    stamina: player.stamina,
    decisionTimer: player.decisionTimer,
  })),
  assignments: match.teams.map((side) => ({
    chasers: [...side.chasers],
    runners: [...side.runners],
    marks: [...side.marks],
  })),
  rng: (match.rng as unknown as { s: number }).s,
});

describe('offline simulation-state clone', () => {
  it('remaps shared refs and continues byte-identically', () => {
    const original = match();
    for (let tick = 0; tick < 1800; tick++) original.step(DT);
    const cloned = cloneSimulationState(original);

    expect(cloned).toBeInstanceOf(Match);
    expect(cloned).not.toBe(original);
    expect(cloned.ball).not.toBe(original.ball);
    expect(cloned.rng).not.toBe(original.rng);
    if (original.ball.owner) {
      expect(cloned.ball.owner).not.toBe(original.ball.owner);
      expect(cloned.ball.owner).toBe(cloned.allPlayers[original.ball.owner.gid]);
    }
    expect(dynamicSnapshot(cloned)).toBe(dynamicSnapshot(original));

    for (let tick = 0; tick < 240; tick++) {
      original.step(DT);
      cloned.step(DT);
      expect(dynamicSnapshot(cloned)).toBe(dynamicSnapshot(original));
    }
  });

  it('rejects unsupported mutable container kinds loudly', () => {
    expect(() => cloneSimulationState({ cache: new WeakMap() })).toThrow(/Unsupported/);
  });
});
