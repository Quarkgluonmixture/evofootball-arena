import { describe, expect, it } from 'vitest';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { Match } from '../src/sim/Match';
import { cloneSimulationState } from '../src/sim/cloneState';
import { classifyBallControl } from '../src/sim/physical';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name,
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

describe('B0 ball-control representation', () => {
  it('separates a secured ball, an owned knock, and a genuinely free ball', () => {
    expect(classifyBallControl({
      live: true,
      ownerGid: 4,
      ownerIsKeeper: false,
      keeperHolding: false,
      knockedByGid: null,
      knockExpiresAt: null,
    })).toEqual({ kind: 'secured', controllerGid: 4 });

    expect(classifyBallControl({
      live: true,
      ownerGid: null,
      ownerIsKeeper: false,
      keeperHolding: false,
      knockedByGid: 4,
      knockExpiresAt: 12.5,
    })).toEqual({ kind: 'knocked', controllerGid: 4, expiresAt: 12.5 });

    expect(classifyBallControl({
      live: true,
      ownerGid: null,
      ownerIsKeeper: false,
      keeperHolding: false,
      knockedByGid: null,
      knockExpiresAt: null,
    })).toEqual({ kind: 'free' });
  });

  it('derives keeper-held and dead-ball phases without mutating source facts', () => {
    const facts = {
      live: true,
      ownerGid: 0,
      ownerIsKeeper: true,
      keeperHolding: true,
      knockedByGid: null,
      knockExpiresAt: null,
    } as const;
    expect(classifyBallControl(facts)).toEqual({ kind: 'keeperHeld', controllerGid: 0 });
    expect(classifyBallControl({ ...facts, live: false })).toEqual({ kind: 'deadBall' });
    expect(facts).toEqual({
      live: true,
      ownerGid: 0,
      ownerIsKeeper: true,
      keeperHolding: true,
      knockedByGid: null,
      knockExpiresAt: null,
    });
  });

  it('stays a derived invariant across a structural clone', () => {
    const match = new Match({
      seed: 91,
      teamA: team('A', 101),
      teamB: team('B', 102),
      duration: 60,
    });
    const carrier = match.teams[0].players[3];
    match.phase = 'playing';
    match.ball.owner = null;
    match.dribbleTouch = { gid: carrier.gid, until: 7.25 };

    const cloned = cloneSimulationState(match);
    expect(cloned.ballControlPhase).toEqual(match.ballControlPhase);
    expect(cloned.ballControlPhase).toEqual({
      kind: 'knocked',
      controllerGid: carrier.gid,
      expiresAt: 7.25,
    });
  });
});
