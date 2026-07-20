import { describe, expect, it } from 'vitest';
import type { PlayerAttributes } from '../src/evolution/playerGenome';
import { Ball } from '../src/sim/Ball';
import {
  BALL_RADIUS,
  BODY_SCALE,
  BOX_DEPTH,
  BOX_WIDTH,
  CONTROL_RADIUS,
  CONTROL_REACH_SCALE,
  FIELD_SCALE,
  GOAL_AND_BOX_SCALE,
  GOAL_HEIGHT,
  GOAL_WIDTH,
  PITCH_LENGTH,
  PITCH_WIDTH,
  PLAYER_CORE_RADIUS,
  PLAYER_MIN_DIST,
  SPEED_TIME_SCALE,
  SURFACE_PROFILE,
} from '../src/sim/constants';
import {
  accessLineGeometry,
  ballAccessGeometry,
  discContactGeometry,
  firstContestContact,
  type ContestEpisode,
} from '../src/sim/physical';
import { Player } from '../src/sim/Player';

const attrs: PlayerAttributes = {
  pace: 0.5,
  passing: 0.5,
  dribbling: 0.5,
  finishing: 0.5,
  defending: 0.5,
  strength: 0.5,
  stamina: 0.5,
  reflexes: 0.5,
  positioning: 0.5,
};

describe('world-model M0 representation', () => {
  it('backfills every independent parameter to the pre-M0 effective world', () => {
    expect(FIELD_SCALE).toBe(0.7);
    expect(GOAL_AND_BOX_SCALE).toBe(0.7);
    expect(BODY_SCALE).toBe(1);
    expect(CONTROL_REACH_SCALE).toBe(1);
    expect(SPEED_TIME_SCALE).toBe(1);

    expect(PITCH_LENGTH).toBe(90 * 0.7);
    expect(PITCH_WIDTH).toBe(58 * 0.7);
    expect(GOAL_WIDTH).toBe(7 * 0.7);
    expect(BOX_DEPTH).toBe(13 * 0.7);
    expect(BOX_WIDTH).toBe(28 * 0.7);
    expect(GOAL_HEIGHT).toBe(2.44); // deliberately not scaled
    expect(PLAYER_MIN_DIST).toBe(1.05);
    expect(CONTROL_RADIUS).toBe(1.25);
    expect(SURFACE_PROFILE).toMatchObject({
      id: 'current', ballFrictionK: 0.55, ballBounce: 0.45, bounceDamp: 0.72,
    });
  });

  it('bodyDir and coreRadius are derived aliases, not drifting duplicate state', () => {
    const p = new Player(0, 2, 'MF', 'Body', attrs);
    p.heading = { x: 0, y: 1 };
    p.vel = { x: 6, y: 0 };

    expect(p.bodyDir).toBe(p.heading);
    expect(p.bodyDir).toEqual({ x: 0, y: 1 });
    expect(p.bodyDir).not.toEqual(p.vel); // facing can differ from movement
    expect(p.coreRadius).toBe(PLAYER_CORE_RADIUS);
    expect(p.coreRadius * 2).toBe(PLAYER_MIN_DIST);
  });

  it('derives ball physical mode without changing the existing ball state', () => {
    const ball = new Ball();
    const p = new Player(0, 2, 'MF', 'Owner', attrs);

    expect(ball.radius).toBe(BALL_RADIUS);
    expect(ball.physicalMode).toBe('freeGround');
    ball.z = 0.8;
    expect(ball.physicalMode).toBe('freeAirborne');
    ball.owner = p;
    expect(ball.physicalMode).toBe('controlled');
    expect(ball.owner).toBe(p);
    expect(ball.z).toBe(0.8);
  });

  it('reports symmetric disc contact without resolving it', () => {
    const a = { x: 0, y: 0 };
    const b = { x: 0.75, y: 0 };
    const ab = discContactGeometry(a, 0.5, b, 0.5);
    const ba = discContactGeometry(b, 0.5, a, 0.5);

    expect(ab).toMatchObject({ centerDistance: 0.75, surfaceGap: -0.25, penetration: 0.25, touching: true });
    expect(ab.normal).toEqual({ x: 1, y: 0 });
    expect(ba.normal).toEqual({ x: -1, y: 0 });
    expect(a).toEqual({ x: 0, y: 0 });
    expect(b).toEqual({ x: 0.75, y: 0 });
  });

  it('makes body orientation visible to the same ball-access scene', () => {
    const ball = { pos: { x: 1, y: 0 }, radius: BALL_RADIUS };
    const front = ballAccessGeometry(
      { pos: { x: 0, y: 0 }, bodyDir: { x: 1, y: 0 }, coreRadius: PLAYER_CORE_RADIUS },
      ball,
      CONTROL_RADIUS,
    );
    const back = ballAccessGeometry(
      { pos: { x: 0, y: 0 }, bodyDir: { x: -1, y: 0 }, coreRadius: PLAYER_CORE_RADIUS },
      ball,
      CONTROL_RADIUS,
    );

    expect(front.sector).toBe('front');
    expect(back.sector).toBe('back');
    expect(front.centerDistance).toBe(back.centerDistance);
    expect(front.withinCenterReach).toBe(true);
    expect(front.surfaceGap).toBeCloseTo(1 - PLAYER_CORE_RADIUS - BALL_RADIUS, 12);
  });

  it('represents a core occupying the direct ball-access line', () => {
    const ball = { pos: { x: 3, y: 0 }, radius: BALL_RADIUS };
    const blocked = accessLineGeometry({ x: 0, y: 0 }, ball, { x: 1.5, y: 0 }, PLAYER_CORE_RADIUS);
    const open = accessLineGeometry({ x: 0, y: 0 }, ball, { x: 1.5, y: 1 }, PLAYER_CORE_RADIUS);

    expect(blocked.blocked).toBe(true);
    expect(blocked.closestT).toBe(0.5);
    expect(open.blocked).toBe(false);
  });

  it('allows an uncapped multi-player contest ledger without selecting a winner', () => {
    const episode: ContestEpisode = {
      id: 7,
      startedTick: 120,
      origin: 'looseBall',
      initialBallMode: 'freeGround',
      possessionSideAtStart: -1,
      contenderGids: [1, 7, 4],
      contacts: [],
    };

    expect(episode.contenderGids).toEqual([1, 7, 4]);
    expect(firstContestContact(episode)).toBeUndefined();
    expect(episode.resolution).toBeUndefined();
  });
});
