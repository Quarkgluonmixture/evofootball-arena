import type { V2 } from '../utils/vec';
import type { Side } from './types';

/**
 * Physical state of the independent ball object. This is deliberately
 * separate from PossessionPhase: a free ball may be rolling or airborne,
 * while dead-ball/restart is a match-law state rather than a physical mode.
 */
export type BallPhysicalMode = 'controlled' | 'freeGround' | 'freeAirborne';

/** Minimal body facts used by the M0 geometry layer. */
export interface OrientedBody {
  readonly pos: Readonly<V2>;
  /** Unit facing vector; independent of velocity direction. */
  readonly bodyDir: Readonly<V2>;
  /** Radius of the stable kinematic core disc. */
  readonly coreRadius: number;
}

/** Minimal ball facts needed by access queries. */
export interface PhysicalBall {
  readonly pos: Readonly<V2>;
  readonly radius: number;
}

export interface DiscContactGeometry {
  /** Unit normal from A to B. Coincident centres use deterministic +x. */
  readonly normal: V2;
  readonly centerDistance: number;
  /** Signed edge-to-edge distance: negative means penetration. */
  readonly surfaceGap: number;
  readonly penetration: number;
  readonly touching: boolean;
}

export type BodySector = 'front' | 'side' | 'back';

export interface BallAccessGeometry {
  /** Unit direction from the body's centre toward the ball. */
  readonly direction: V2;
  readonly centerDistance: number;
  /** Signed distance between the core and ball surfaces. */
  readonly surfaceGap: number;
  /** Ball displacement in the body's local frame. */
  readonly forward: number;
  readonly lateral: number;
  readonly sector: BodySector;
  /** Point on the core boundary facing the ball. */
  readonly coreContactPoint: V2;
  /** Eligibility under the caller's centre-to-centre reach envelope. */
  readonly withinCenterReach: boolean;
}

export interface AccessLineGeometry {
  /** Closest point on actor→ball, expressed as t in [0,1]. */
  readonly closestT: number;
  readonly closestPoint: V2;
  readonly blockerDistance: number;
  readonly clearance: number;
  readonly blocked: boolean;
}

/**
 * Pure disc-contact query. It reports geometry only; it never resolves
 * penetration, changes velocity, or awards possession.
 */
export function discContactGeometry(
  aPos: Readonly<V2>,
  aRadius: number,
  bPos: Readonly<V2>,
  bRadius: number,
): DiscContactGeometry {
  const dx = bPos.x - aPos.x;
  const dy = bPos.y - aPos.y;
  const d = Math.sqrt(dx * dx + dy * dy);
  const normal = d > 1e-8 ? { x: dx / d, y: dy / d } : { x: 1, y: 0 };
  const surfaceGap = d - (aRadius + bRadius);
  return {
    normal,
    centerDistance: d,
    surfaceGap,
    penetration: Math.max(0, -surfaceGap),
    touching: surfaceGap <= 0,
  };
}

/**
 * Ball position in a body's oriented frame plus the current reach envelope.
 * Front/back are 90° cones; the two remaining quadrants are the side band.
 */
export function ballAccessGeometry(
  body: OrientedBody,
  ball: PhysicalBall,
  maxCenterReach: number,
): BallAccessGeometry {
  const dx = ball.pos.x - body.pos.x;
  const dy = ball.pos.y - body.pos.y;
  const d = Math.sqrt(dx * dx + dy * dy);
  const direction = d > 1e-8 ? { x: dx / d, y: dy / d } : { x: 1, y: 0 };

  const hl = Math.sqrt(body.bodyDir.x * body.bodyDir.x + body.bodyDir.y * body.bodyDir.y);
  const hx = hl > 1e-8 ? body.bodyDir.x / hl : 1;
  const hy = hl > 1e-8 ? body.bodyDir.y / hl : 0;
  const forward = dx * hx + dy * hy;
  const lateral = dx * -hy + dy * hx;
  const facingCos = direction.x * hx + direction.y * hy;
  const sector: BodySector = facingCos >= Math.SQRT1_2
    ? 'front'
    : facingCos <= -Math.SQRT1_2
      ? 'back'
      : 'side';

  return {
    direction,
    centerDistance: d,
    surfaceGap: d - body.coreRadius - ball.radius,
    forward,
    lateral,
    sector,
    coreContactPoint: {
      x: body.pos.x + direction.x * body.coreRadius,
      y: body.pos.y + direction.y * body.coreRadius,
    },
    withinCenterReach: d <= maxCenterReach,
  };
}

/**
 * Does another core occupy the direct actor→ball access corridor? The
 * corridor includes the ball radius, so grazing the ball's path counts.
 * This is a world-fact query only; M0 has no caller in Match or the AI.
 */
export function accessLineGeometry(
  actorPos: Readonly<V2>,
  ball: PhysicalBall,
  blockerPos: Readonly<V2>,
  blockerCoreRadius: number,
): AccessLineGeometry {
  const abx = ball.pos.x - actorPos.x;
  const aby = ball.pos.y - actorPos.y;
  const l2 = abx * abx + aby * aby;
  const rawT = l2 > 1e-8
    ? ((blockerPos.x - actorPos.x) * abx + (blockerPos.y - actorPos.y) * aby) / l2
    : 0;
  const closestT = Math.max(0, Math.min(1, rawT));
  const closestPoint = {
    x: actorPos.x + abx * closestT,
    y: actorPos.y + aby * closestT,
  };
  const dx = blockerPos.x - closestPoint.x;
  const dy = blockerPos.y - closestPoint.y;
  const blockerDistance = Math.sqrt(dx * dx + dy * dy);
  const clearance = blockerCoreRadius + ball.radius;
  return {
    closestT,
    closestPoint,
    blockerDistance,
    clearance,
    // The actor endpoint is excluded; a body occupying the ball endpoint blocks.
    blocked: rawT > 0 && rawT <= 1 && blockerDistance <= clearance,
  };
}

export type ContestOrigin =
  | 'looseBall'
  | 'passArrival'
  | 'firstTouch'
  | 'tackle'
  | 'deflection'
  | 'aerial'
  | 'keeperSpill';

export type ContestContactKind = 'controlAttempt' | 'poke' | 'deflection' | 'header' | 'body';

export interface ContestContact {
  readonly tick: number;
  readonly gid: number;
  readonly side: Side;
  readonly kind: ContestContactKind;
  readonly ballModeAfter: BallPhysicalMode;
}

export type ContestResolution =
  | { readonly kind: 'controlled'; readonly tick: number; readonly gid: number; readonly side: Side }
  | { readonly kind: 'deadBall'; readonly tick: number }
  | { readonly kind: 'out'; readonly tick: number }
  | { readonly kind: 'stillLoose'; readonly tick: number };

/**
 * Append-only contest ledger shape for M3 probes/replay/dedup/keyed noise.
 * It records what happened; it never pre-selects or hands the ball to a
 * winner. `contenderGids` is intentionally unbounded — third players count.
 */
export interface ContestEpisode {
  readonly id: number;
  readonly startedTick: number;
  readonly origin: ContestOrigin;
  readonly initialBallMode: BallPhysicalMode;
  readonly contenderGids: readonly number[];
  readonly contacts: readonly ContestContact[];
  readonly resolution?: ContestResolution;
}

/** First contact is derived from the ordered ledger, never duplicated state. */
export function firstContestContact(episode: ContestEpisode): ContestContact | undefined {
  return episode.contacts[0];
}
