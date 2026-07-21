import { describe, expect, it } from 'vitest';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import {
  advanceVirtualGait,
  applyControlledTouchImpulse,
  controlledTouchSpacing,
  planControlledTouch,
  virtualFootAnchor,
  virtualFootForTouch,
} from '../src/sim/controlCoupling';
import { Match } from '../src/sim/Match';
import { recordOwnControlTouch, type ActiveControlSequence } from '../src/sim/physical';
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

describe('B1c-1 isolated controlled-ball coupling', () => {
  it('derives cadence from travel and alternates feet without a timer', () => {
    const still = advanceVirtualGait({ phase: 0.9, touchIndex: 0 }, 0, 4, 0, 0);
    expect(still.touches).toHaveLength(0);
    expect(still.state).toEqual({ phase: 0.9, touchIndex: 0 });

    const spacing = controlledTouchSpacing(4, 0, 0);
    const moved = advanceVirtualGait({ phase: 0, touchIndex: 0 }, spacing * 2.1, 4, 0, 0);
    expect(moved.touches).toEqual([
      { touchIndex: 0, footSide: 'left' },
      { touchIndex: 1, footSide: 'right' },
    ]);
    expect(moved.state.touchIndex).toBe(2);
    expect(moved.state.phase).toBeCloseTo(0.1, 12);
    expect(virtualFootForTouch(2)).toBe('left');
  });

  it('compresses touch spacing under pressure and turn demand', () => {
    const open = controlledTouchSpacing(4, 0, 0);
    const pressured = controlledTouchSpacing(4, 0, 1);
    const turning = controlledTouchSpacing(4, 1, 0);
    const both = controlledTouchSpacing(4, 1, 1);

    expect(pressured).toBeLessThan(open);
    expect(turning).toBeLessThan(open);
    expect(both).toBeLessThan(pressured);
    expect(both).toBeLessThan(turning);
  });

  it('uses mirrored virtual foot query points without moving the ball', () => {
    const left = virtualFootAnchor({ x: 1, y: 2 }, { x: 1, y: 0 }, 'left');
    const right = virtualFootAnchor({ x: 1, y: 2 }, { x: 1, y: 0 }, 'right');

    expect(left.x).toBeCloseTo(right.x, 12);
    expect(left.x).toBeGreaterThan(1);
    expect(left.y - 2).toBeCloseTo(2 - right.y, 12);
  });

  it('applies a bounded velocity impulse toward a recoverable future target', () => {
    const ball = { pos: { x: 0.715, y: 0.16 }, vel: { x: 0, y: 0 } };
    const positionBefore = { ...ball.pos };
    const plan = planControlledTouch({
      playerPos: { x: 0, y: 0 },
      playerVel: { x: 4, y: 0 },
      bodyDir: { x: 1, y: 0 },
      ballPos: ball.pos,
      footSide: 'left',
      speed: 4,
      turnDemand: 0,
      pressure: 0,
    });
    const result = applyControlledTouchImpulse(ball, plan);

    expect(ball.pos).toEqual(positionBefore);
    expect(result.magnitude).toBeLessThanOrEqual(plan.maxImpulse);
    expect(ball.vel.x).toBeGreaterThan(0);

    ball.pos.x += ball.vel.x * plan.horizon;
    ball.pos.y += ball.vel.y * plan.horizon;
    expect(ball.pos.x).toBeCloseTo(plan.nextTouchTarget.x, 10);
    expect(ball.pos.y).toBeCloseTo(plan.nextTouchTarget.y, 10);
  });

  it('records an own touch inside one sequence without opening match transitions', () => {
    const match = new Match({
      seed: 401,
      teamA: team('A', 402),
      teamB: team('B', 403),
      duration: 60,
      traceContests: true,
    });
    const carrier = match.teams[0].players[3];
    const sequence: ActiveControlSequence = {
      id: 1,
      controllerGid: carrier.gid,
      origin: 'reception',
      startedTick: 10,
      lastOwnTouchTick: 10,
      touchIndex: 0,
      status: 'active',
    };
    match.phase = 'playing';
    match.possessionSide = carrier.side;
    match.ball.owner = null;
    match.ball.pos = virtualFootAnchor(carrier.pos, carrier.bodyDir, 'left');
    match.controlSequence = sequence;

    const possessionBefore = match.possessionSide;
    const contestsBefore = match.contestEpisodes.length;
    const passBefore = match.pendingPass;
    const plan = planControlledTouch({
      playerPos: carrier.pos,
      playerVel: { x: 3, y: 0 },
      bodyDir: carrier.bodyDir,
      ballPos: match.ball.pos,
      footSide: 'left',
      speed: 3,
      turnDemand: 0.2,
      pressure: 0.5,
    });
    const ballPositionBefore = { ...match.ball.pos };
    applyControlledTouchImpulse(match.ball, plan);
    match.controlSequence = recordOwnControlTouch(sequence, 20);

    expect(match.controlSequence.id).toBe(sequence.id);
    expect(match.controlSequence.touchIndex).toBe(1);
    expect(match.controlSequence.lastOwnTouchTick).toBe(20);
    expect(match.ball.pos).toEqual(ballPositionBefore);
    expect(match.ball.owner).toBeNull();
    expect(match.possessionSide).toBe(possessionBefore);
    expect(match.pendingPass).toBe(passBefore);
    expect(match.contestEpisodes).toHaveLength(contestsBefore);
  });
});
