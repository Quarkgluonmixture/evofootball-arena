import { BALL_RADIUS } from '../sim/constants';
import { HUMAN_MODEL_SCALE } from './PlayerModel';
import type { RenderBall, RenderPlayer } from './RenderStateAdapter';

/**
 * The sphere stays oversized for a phone/tactical camera, but no longer
 * pretends a 22cm football is an 84cm exercise ball.
 *
 * F1 (Track F): the readability factor the user accepted at M4 was 2.6 —
 * accepted against the OLD body. Shrinking the bodies without the ball would
 * have quietly inflated it from 21% of a player's height to 33%, so the same
 * accepted RATIO is carried through the shrink rather than re-chosen. Radius
 * 0.286 → 0.183 m; the ball is still 66% bigger than a real one, on purpose.
 */
export const BALL_VISUAL_SCALE = 2.6 * HUMAN_MODEL_SCALE;
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
  // F1: the hands sit 0.3m in front of the OLD body; the offset rides the shrink.
  const reach = 0.3 * HUMAN_MODEL_SCALE;
  return {
    dx: owner.x + Math.sin(owner.yaw) * reach - ball.x,
    dz: owner.z + Math.cos(owner.yaw) * reach - ball.z,
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
