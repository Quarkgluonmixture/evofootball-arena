/**
 * M2 frozen counterfactual scene — same actor/ball distance, change only
 * facing or blocker position. This measures the world fact directly:
 *
 *   npx tsx scripts/probes/ball-access.ts
 */
import { BALL_RADIUS, CONTROL_RADIUS, PLAYER_CORE_RADIUS } from '../../src/sim/constants';
import { directBallAccess, type BallAccessBody } from '../../src/sim/physical';

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

const ball = { pos: { x: 1.2, y: 0 }, radius: BALL_RADIUS };
const actor = body(0, 0, 0, 0);

const scenes = [
  ['front', directBallAccess(actor, ball, [], CONTROL_RADIUS)],
  ['side', directBallAccess(body(0, 0, 0, 0, 0, 1), ball, [], CONTROL_RADIUS)],
  ['back', directBallAccess(body(0, 0, 0, 0, -1, 0), ball, [], CONTROL_RADIUS)],
  ['screened', directBallAccess(actor, ball, [body(6, 1, 1.05, 0)], CONTROL_RADIUS)],
  ['off-line', directBallAccess(actor, ball, [body(6, 1, 1.05, 0.7)], CONTROL_RADIUS)],
] as const;

console.log('M2 BALL-ACCESS COUNTERFACTUAL');
for (const [name, access] of scenes) {
  console.log(
    `${name.padEnd(8)} sector=${access.geometry.sector.padEnd(5)}` +
    ` d=${access.geometry.centerDistance.toFixed(3)}m` +
    ` reach=${access.sectorCenterReach.toFixed(3)}m` +
    ` blocker=${access.blockedByGid ?? '-'}` +
    ` turn=${access.mustTurn ? 'yes' : 'no'}` +
    ` around=${access.mustGoAround ? 'yes' : 'no'}` +
    ` direct=${access.canDirectlyContact ? 'yes' : 'no'}`,
  );
}
