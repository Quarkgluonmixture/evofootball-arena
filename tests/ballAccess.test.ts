import { describe, expect, it } from 'vitest';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import {
  BALL_RADIUS, CONTACT_CONTROL_DELAY_TICKS, CONTROL_RADIUS, PLAYER_CORE_RADIUS,
} from '../src/sim/constants';
import { Match } from '../src/sim/Match';
import { directBallAccess, type BallAccessBody } from '../src/sim/physical';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

type CaptureAccess = { stepCount: number; tryCapture(): void };

const body = (
  gid: number,
  side: 0 | 1,
  x: number,
  y: number,
  dirX = 1,
  dirY = 0,
): BallAccessBody => ({
  gid,
  side,
  pos: { x, y },
  bodyDir: { x: dirX, y: dirY },
  coreRadius: PLAYER_CORE_RADIUS,
});

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

const match = (): Match => new Match({ seed: 29, teamA: team('A', 1), teamB: team('B', 2), duration: 1 });

const capture = (m: Match): void => {
  (m as unknown as CaptureAccess).tryCapture();
};

describe('M2 direct ball-access world fact', () => {
  it('changes direct reach when the same body turns front, side, and back', () => {
    const ball = { pos: { x: 1.2, y: 0 }, radius: BALL_RADIUS };
    const front = directBallAccess(body(0, 0, 0, 0, 1, 0), ball, [], CONTROL_RADIUS);
    const side = directBallAccess(body(0, 0, 0, 0, 0, 1), ball, [], CONTROL_RADIUS);
    const back = directBallAccess(body(0, 0, 0, 0, -1, 0), ball, [], CONTROL_RADIUS);
    const nearBack = directBallAccess(
      body(0, 0, 0, 0, -1, 0),
      { pos: { x: 0.9, y: 0 }, radius: BALL_RADIUS },
      [],
      CONTROL_RADIUS,
    );

    expect(front.geometry.sector).toBe('front');
    expect(side.geometry.sector).toBe('side');
    expect(back.geometry.sector).toBe('back');
    expect(front.canDirectlyContact).toBe(true);
    expect(side.canDirectlyContact).toBe(true);
    expect(back.canDirectlyContact).toBe(false);
    expect(side.mustTurn).toBe(false);
    expect(back.mustTurn).toBe(true);
    expect(nearBack.canDirectlyContact).toBe(true); // a close back-heel remains possible
    expect(front.sectorCenterReach).toBe(CONTROL_RADIUS);
    expect(side.sectorCenterReach).toBe(CONTROL_RADIUS);
    expect(back.sectorCenterReach).toBeLessThan(CONTROL_RADIUS);
    expect(front.geometry.centerDistance).toBe(side.geometry.centerDistance);
    expect(side.geometry.centerDistance).toBe(back.geometry.centerDistance);
  });

  it('reports an opponent core on the access line, but not a teammate or lateral opponent', () => {
    const actor = body(0, 0, 0, 0);
    const ball = { pos: { x: 1.2, y: 0 }, radius: BALL_RADIUS };
    const opponent = body(6, 1, 1.05, 0);
    const teammate = body(1, 0, 1.05, 0);
    const lateralOpponent = body(6, 1, 1.05, 0.7);

    const blocked = directBallAccess(actor, ball, [opponent], CONTROL_RADIUS);
    const teammateOnly = directBallAccess(actor, ball, [teammate], CONTROL_RADIUS);
    const open = directBallAccess(actor, ball, [lateralOpponent], CONTROL_RADIUS);

    expect(blocked.blockedByGid).toBe(opponent.gid);
    expect(blocked.mustGoAround).toBe(true);
    expect(blocked.canDirectlyContact).toBe(false);
    expect(teammateOnly.blockedByGid).toBeNull();
    expect(teammateOnly.canDirectlyContact).toBe(true);
    expect(open.blockedByGid).toBeNull();
    expect(open.mustGoAround).toBe(false);
    expect(open.canDirectlyContact).toBe(true);
  });

  it('wires oriented reach into capture without deleting a close back-heel', () => {
    const far = match();
    const farActor = far.teams[0].players[1];
    for (const p of far.allPlayers) p.pos = { x: 100 + p.gid * 10, y: 100 };
    farActor.pos = { x: 0, y: 0 };
    farActor.heading = { x: -1, y: 0 };
    far.ball.owner = null;
    far.ball.pos = { x: 1.2, y: 0 };
    far.ball.vel = { x: 0, y: 0 };
    capture(far);
    expect(far.ball.owner).toBeNull();

    const near = match();
    const nearActor = near.teams[0].players[1];
    for (const p of near.allPlayers) p.pos = { x: 100 + p.gid * 10, y: 100 };
    nearActor.pos = { x: 0, y: 0 };
    nearActor.heading = { x: -1, y: 0 };
    near.ball.owner = null;
    near.ball.pos = { x: 0.9, y: 0 };
    near.ball.vel = { x: 0, y: 0 };
    capture(near);
    expect(near.ball.owner).toBeNull(); // M3: contact is not control
    expect(near.ball.lastTouch).toBe(nearActor);
    (near as unknown as CaptureAccess).stepCount += CONTACT_CONTROL_DELAY_TICKS;
    capture(near);
    expect(near.ball.owner).toBe(nearActor);
  });

  it('makes a physically screening opponent block ground capture even while in cooldown', () => {
    const m = match();
    const actor = m.teams[0].players[1];
    const blocker = m.teams[1].players[1];
    for (const p of m.allPlayers) p.pos = { x: 100 + p.gid * 10, y: 100 };
    actor.pos = { x: 0, y: 0 };
    actor.heading = { x: 1, y: 0 };
    blocker.pos = { x: 1.05, y: 0 };
    blocker.kickCooldown = 1; // cannot claim, but its core still exists in the world
    m.ball.owner = null;
    m.ball.pos = { x: 1.2, y: 0 };
    m.ball.vel = { x: 0, y: 0 };

    capture(m);

    expect(m.ball.owner).toBeNull();
  });
});
