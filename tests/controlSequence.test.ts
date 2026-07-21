import { describe, expect, it } from 'vitest';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { Match } from '../src/sim/Match';
import { cloneSimulationState } from '../src/sim/cloneState';
import {
  derivePossessionLocus,
  type ControlSequence,
} from '../src/sim/physical';
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

const activeSequence = (controllerGid: number): ControlSequence => ({
  id: 7,
  controllerGid,
  origin: 'reception',
  startedTick: 100,
  lastOwnTouchTick: 104,
  touchIndex: 2,
  status: 'active',
});

describe('B1c-0 control-sequence representation', () => {
  it('uses the authoritative ball when no active sequence exists', () => {
    const ballPos = { x: 3, y: -2 };
    const locus = derivePossessionLocus({
      ballPos,
      controlSequence: null,
      controllerPos: null,
    });

    expect(locus).toEqual({
      pos: ballPos,
      source: 'ball',
      sequenceId: null,
      controllerGid: null,
    });
    expect(locus.pos).toBe(ballPos);
  });

  it('projects an active sequence to its controller without copying a second trajectory', () => {
    const ballPos = { x: 3, y: -2 };
    const controllerPos = { x: 2.4, y: -1.8 };
    const locus = derivePossessionLocus({
      ballPos,
      controlSequence: activeSequence(4),
      controllerPos,
    });

    expect(locus).toEqual({
      pos: controllerPos,
      source: 'controller',
      sequenceId: 7,
      controllerGid: 4,
    });
    expect(locus.pos).toBe(controllerPos);
  });

  it('falls back to the ball for terminal or unresolvable sequences', () => {
    const ballPos = { x: 1, y: 5 };
    const broken: ControlSequence = {
      ...activeSequence(4),
      status: 'broken',
      endedTick: 109,
      breakCause: 'opponentContact',
    };

    expect(derivePossessionLocus({
      ballPos,
      controlSequence: broken,
      controllerPos: { x: 0, y: 0 },
    }).source).toBe('ball');
    expect(derivePossessionLocus({
      ballPos,
      controlSequence: activeSequence(99),
      controllerPos: null,
    }).pos).toBe(ballPos);
  });

  it('starts null and remains a derived invariant across a structural clone', () => {
    const match = new Match({
      seed: 301,
      teamA: team('A', 302),
      teamB: team('B', 303),
      duration: 60,
    });
    expect(match.controlSequence).toBeNull();
    expect(match.possessionLocus).toEqual({
      pos: match.ball.pos,
      source: 'ball',
      sequenceId: null,
      controllerGid: null,
    });
    expect(match.possessionLocus.pos).toBe(match.ball.pos);

    const carrier = match.teams[0].players[3];
    match.controlSequence = activeSequence(carrier.gid);
    const cloned = cloneSimulationState(match);

    expect(cloned.controlSequence).toEqual(match.controlSequence);
    expect(cloned.controlSequence).not.toBe(match.controlSequence);
    expect(cloned.possessionLocus).toEqual({
      pos: cloned.allPlayers[carrier.gid].pos,
      source: 'controller',
      sequenceId: 7,
      controllerGid: carrier.gid,
    });
    expect(cloned.possessionLocus.pos).toBe(cloned.allPlayers[carrier.gid].pos);
    expect(cloned.possessionLocus.pos).not.toBe(carrier.pos);
  });
});
