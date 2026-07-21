import { describe, expect, it } from 'vitest';
import { executeAction, relativePointTarget } from '../src/ai/actionExecutor';
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
  seed: 73,
  teamA: team('A'),
  teamB: team('B'),
  duration: 60,
});

const isolatePair = (match: Match, side: 0 | 1) => {
  const actor = match.teams[side].players[2];
  const reference = match.teams[side].players[3];
  for (const body of match.allPlayers) {
    if (body !== actor && body !== reference) body.sentOff = true;
  }
  match.ball.owner = null;
  match.possessionSide = -1;
  actor.pos = { x: 0, y: 0 };
  actor.vel = { x: 0, y: 0 };
  reference.pos = { x: 2, y: 3 };
  reference.vel = { x: 0, y: 0 };
  return { actor, reference };
};

describe('R0 dormant TrackRelativePoint primitive', () => {
  it('mirrors attack-forward offsets while preserving pitch-lateral offsets', () => {
    const rightMatch = staged();
    const rightPair = isolatePair(rightMatch, 0);
    const rightOffset = { x: 5, y: -2 };
    rightPair.actor.action = {
      type: 'TrackRelativePoint',
      relativeToGid: rightPair.reference.gid,
      relativeOffset: rightOffset,
      scores: [],
    };
    executeAction(rightPair.actor, rightMatch, DT);

    const leftMatch = staged();
    const leftPair = isolatePair(leftMatch, 1);
    leftPair.reference.pos = { ...rightPair.reference.pos };
    const leftOffset = { ...rightOffset };
    leftPair.actor.action = {
      type: 'TrackRelativePoint',
      relativeToGid: leftPair.reference.gid,
      relativeOffset: leftOffset,
      scores: [],
    };
    executeAction(leftPair.actor, leftMatch, DT);

    expect(relativePointTarget(rightPair.reference.pos, 1, rightOffset)).toEqual({ x: 7, y: 1 });
    expect(relativePointTarget(leftPair.reference.pos, -1, leftOffset)).toEqual({ x: -3, y: 1 });
    expect(rightPair.actor.desiredVel.x).toBeGreaterThan(0);
    expect(leftPair.actor.desiredVel.x).toBeLessThan(0);
    expect(rightOffset).toEqual({ x: 5, y: -2 });
    expect(leftOffset).toEqual({ x: 5, y: -2 });
  });

  it('recomputes the target from the moving reference without moving the actor directly', () => {
    const match = staged();
    const { actor, reference } = isolatePair(match, 0);
    const action = {
      type: 'TrackRelativePoint' as const,
      relativeToGid: reference.gid,
      relativeOffset: { x: 4, y: 0 },
      scores: [],
    };
    actor.action = action;
    const before = { ...actor.pos };
    executeAction(actor, match, DT);
    const firstDesired = { ...actor.desiredVel };
    expect(actor.pos).toEqual(before);

    reference.pos = { x: -6, y: 8 };
    executeAction(actor, match, DT);
    expect(actor.pos).toEqual(before);
    expect(actor.desiredVel).not.toEqual(firstDesired);
    expect(action.relativeOffset).toEqual({ x: 4, y: 0 });

    actor.physicsStep(DT);
    expect(Math.hypot(actor.vel.x, actor.vel.y)).toBeLessThanOrEqual(actor.accel * DT + 1e-12);
    expect(Math.hypot(actor.vel.x, actor.vel.y)).toBeLessThanOrEqual(actor.topSpeed + 1e-12);
  });

  it.each(['missing', 'self', 'sentOff', 'nonFinite'] as const)(
    'holds safely for an invalid %s relation',
    (kind) => {
      const match = staged();
      const { actor, reference } = isolatePair(match, 0);
      const action = {
        type: 'TrackRelativePoint' as const,
        relativeToGid: reference.gid,
        relativeOffset: { x: 4, y: 1 },
        scores: [],
      };
      if (kind === 'missing') action.relativeToGid = 999;
      if (kind === 'self') action.relativeToGid = actor.gid;
      if (kind === 'sentOff') reference.sentOff = true;
      if (kind === 'nonFinite') action.relativeOffset = { x: Number.NaN, y: 1 };
      actor.action = action;
      actor.vel = { x: 0, y: 0 };
      executeAction(actor, match, DT);
      expect(actor.desiredVel).toEqual({ x: 0, y: 0 });
    },
  );
});
