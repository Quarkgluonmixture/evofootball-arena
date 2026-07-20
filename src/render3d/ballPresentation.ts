import { BALL_RADIUS } from '../sim/constants';
import type { RenderBall, RenderPlayer } from './RenderStateAdapter';

/**
 * The sphere stays oversized for a phone/tactical camera, but no longer
 * pretends a 22cm football is an 84cm exercise ball.
 */
export const BALL_VISUAL_SCALE = 2.6;
export const BALL_VISUAL_RADIUS = BALL_RADIUS * BALL_VISUAL_SCALE;
export const BALL_SHADOW_RADIUS = BALL_VISUAL_RADIUS * 0.82;

type CarryBall = Pick<RenderBall, 'x' | 'z' | 'ownerGid' | 'heldByGk'>;
type CarryOwner = Pick<RenderPlayer, 'x' | 'z' | 'yaw'>;

/**
 * A controlled outfield ball is drawn at the authoritative sim position.
 * The keeper-hands anchor is the sole positional exception: it expresses
 * height/pose while the sim remains deliberately 2D at the keeper's feet.
 */
export function carryDisplayOffset(
  ball: CarryBall,
  owner: CarryOwner | undefined,
): { dx: number; dz: number } | null {
  if (!owner || ball.ownerGid === null || ball.heldByGk !== true) return null;
  return {
    dx: owner.x + Math.sin(owner.yaw) * 0.3 - ball.x,
    dz: owner.z + Math.cos(owner.yaw) * 0.3 - ball.z,
  };
}

export type ContactCue = 'touch' | 'tackle';

/**
 * Render-only detection of a real loose-ball contact. Kicks keep the same
 * lastTouch gid, so they do not masquerade as a tackle/contact cue.
 */
export function contactCue(
  previousLastTouchGid: number | null | undefined,
  ball: Pick<RenderBall, 'ownerGid' | 'lastTouchGid'>,
  players: ReadonlyArray<Pick<RenderPlayer, 'gid' | 'tackling'>>,
): ContactCue | null {
  const gid = ball.lastTouchGid;
  if (ball.ownerGid !== null || gid === null || gid === undefined || gid === previousLastTouchGid) return null;
  return players.some((p) => p.gid === gid && p.tackling === true) ? 'tackle' : 'touch';
}
