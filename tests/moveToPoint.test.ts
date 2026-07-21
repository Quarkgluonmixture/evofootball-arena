import { describe, expect, it } from 'vitest';
import { executeAction } from '../src/ai/actionExecutor';
import { GENE_KEYS, type TacticalGenome } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';

const neutralGenome = (): TacticalGenome => {
  const result = {} as TacticalGenome;
  for (const key of GENE_KEYS) result[key] = 0.5;
  return result;
};

const neutralSquad = (): PlayerAttributes[] => Array.from({ length: TEAM_SIZE }, () => {
  const result = {} as PlayerAttributes;
  for (const key of ATTR_KEYS) result[key] = 0.5;
  return result;
});

const team = (name: string): TeamInfo => ({
  id: name,
  name,
  short: name,
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `${name}${index}`),
  genome: neutralGenome(),
  squad: neutralSquad(),
});

const staged = (): Match => new Match({
  seed: 71,
  teamA: team('A'),
  teamB: team('B'),
  duration: 60,
});

const isolatedMover = (match: Match) => {
  const player = match.teams[0].players[2];
  for (const body of match.allPlayers) if (body !== player) body.sentOff = true;
  match.ball.owner = null;
  match.possessionSide = -1;
  return player;
};

describe('O1 dormant MoveToPoint primitive', () => {
  it('turns opposite immutable targets into opposite desired movement without moving the body', () => {
    const rightMatch = staged();
    const right = isolatedMover(rightMatch);
    right.pos = { x: 0, y: 0 };
    right.vel = { x: 0, y: 0 };
    const rightTarget = { x: 6, y: 0 };
    right.action = { type: 'MoveToPoint', targetPos: rightTarget, scores: [] };
    const rightBefore = { ...right.pos };
    executeAction(right, rightMatch, DT);

    const leftMatch = staged();
    const left = isolatedMover(leftMatch);
    left.pos = { x: 0, y: 0 };
    left.vel = { x: 0, y: 0 };
    const leftTarget = { x: -6, y: 0 };
    left.action = { type: 'MoveToPoint', targetPos: leftTarget, scores: [] };
    executeAction(left, leftMatch, DT);

    expect(right.pos).toEqual(rightBefore);
    expect(right.desiredVel.x).toBeGreaterThan(0);
    expect(left.desiredVel.x).toBeLessThan(0);
    expect(right.desiredVel.y).toBeCloseTo(-left.desiredVel.y, 12);
    expect(rightTarget).toEqual({ x: 6, y: 0 });
    expect(leftTarget).toEqual({ x: -6, y: 0 });
  });

  it('moves only through physicsStep and respects the existing acceleration envelope', () => {
    const match = staged();
    const player = isolatedMover(match);
    player.pos = { x: 0, y: 0 };
    player.vel = { x: 0, y: 0 };
    player.action = { type: 'MoveToPoint', targetPos: { x: 8, y: 3 }, scores: [] };

    executeAction(player, match, DT);
    expect(player.pos).toEqual({ x: 0, y: 0 });

    player.physicsStep(DT);
    expect(Math.hypot(player.vel.x, player.vel.y)).toBeLessThanOrEqual(player.accel * DT + 1e-12);
    expect(Math.hypot(player.vel.x, player.vel.y)).toBeLessThanOrEqual(player.topSpeed + 1e-12);
    expect(player.pos.x).toBeGreaterThan(0);
    expect(player.pos.y).toBeGreaterThan(0);
  });

  it('holds the current point when no target is supplied', () => {
    const match = staged();
    const player = isolatedMover(match);
    player.pos = { x: 3, y: -2 };
    player.vel = { x: 0, y: 0 };
    player.action = { type: 'MoveToPoint', scores: [] };
    executeAction(player, match, DT);
    expect(player.desiredVel).toEqual({ x: 0, y: 0 });
    expect(player.pos).toEqual({ x: 3, y: -2 });
  });
});
