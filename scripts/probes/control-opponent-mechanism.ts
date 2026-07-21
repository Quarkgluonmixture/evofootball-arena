// B1c-2 isolated one-opponent lease-boundary gate.
// A real exposed opponent contact must break the sequence and hand off to M3;
// own contact and screened proximity must not.
//   npx tsx scripts/probes/control-opponent-mechanism.ts
import { resolveControlLeaseContact } from '../../src/sim/controlCoupling';
import type { ActiveControlSequence, BallAccessBody } from '../../src/sim/physical';

const controller: BallAccessBody = {
  gid: 3,
  side: 0,
  pos: { x: 0, y: 0 },
  bodyDir: { x: 1, y: 0 },
  coreRadius: 0.525,
};
const opponentExposed: BallAccessBody = {
  gid: 9,
  side: 1,
  pos: { x: 1.45, y: 0 },
  bodyDir: { x: -1, y: 0 },
  coreRadius: 0.525,
};
const opponentScreened: BallAccessBody = {
  gid: 9,
  side: 1,
  pos: { x: -0.9, y: 0 },
  bodyDir: { x: 1, y: 0 },
  coreRadius: 0.525,
};
const sequence: ActiveControlSequence = {
  id: 12,
  controllerGid: controller.gid,
  origin: 'reception',
  startedTick: 100,
  lastOwnTouchTick: 104,
  touchIndex: 2,
  status: 'active',
};

const run = () => {
  const own = resolveControlLeaseContact({
    sequence,
    actor: controller,
    controllerSide: controller.side,
    ball: { pos: { x: 0.75, y: 0 }, radius: 0.11 },
    bodies: [controller],
    maxCenterReach: 1.25,
    tick: 110,
  });
  const exposed = resolveControlLeaseContact({
    sequence,
    actor: opponentExposed,
    controllerSide: controller.side,
    ball: { pos: { x: 0.8, y: 0 }, radius: 0.11 },
    bodies: [controller, opponentExposed],
    maxCenterReach: 1.25,
    tick: 112,
  });
  const screened = resolveControlLeaseContact({
    sequence,
    actor: opponentScreened,
    controllerSide: controller.side,
    ball: { pos: { x: 0.2, y: 0 }, radius: 0.11 },
    bodies: [controller, opponentScreened],
    maxCenterReach: 1.25,
    tick: 112,
  });
  return { own, exposed, screened };
};

const result = run();
if (JSON.stringify(result) !== JSON.stringify(run())) {
  throw new Error('one-opponent lease boundary is not deterministic');
}

const ownTouchOpenedM3 = result.own.handoff === 'm3' ? 1 : 0;
const ownTouchChangedSequence = result.own.sequence.id === sequence.id ? 0 : 1;
const opponentContactDidNotBreak =
  result.exposed.kind === 'opponentContact' && result.exposed.sequence.status === 'broken' ? 0 : 1;
const blockedContactBrokeLease = result.screened.sequence.status === 'broken' ? 1 : 0;
const winnerFields =
  ('ownerGid' in result.exposed ? 1 : 0) + ('winnerGid' in result.exposed ? 1 : 0);

console.log(
  `own contact: kind=${result.own.kind} · handoff=${result.own.handoff ?? 'none'} · ` +
  `sequence ${sequence.id}→${result.own.sequence.id} · touches ` +
  `${sequence.touchIndex}→${result.own.sequence.touchIndex}`,
);
console.log(
  `exposed opponent: access=${result.exposed.access.canDirectlyContact ? 'yes' : 'NO'} · ` +
  `kind=${result.exposed.kind} · status=${result.exposed.sequence.status} · ` +
  `handoff=${result.exposed.handoff ?? 'none'}`,
);
console.log(
  `screened opponent: access=${result.screened.access.canDirectlyContact ? 'YES' : 'no'} · ` +
  `blockedBy=${result.screened.access.blockedByGid ?? 'none'} · ` +
  `status=${result.screened.sequence.status} · handoff=${result.screened.handoff ?? 'none'}`,
);
console.log(
  `EXACT ZERO ownTouchOpenedM3=${ownTouchOpenedM3} · ` +
  `ownTouchChangedSequence=${ownTouchChangedSequence} · ` +
  `opponentContactDidNotBreak=${opponentContactDidNotBreak} · ` +
  `blockedContactBrokeLease=${blockedContactBrokeLease} · winnerFields=${winnerFields}`,
);

if (
  ownTouchOpenedM3 !== 0 ||
  ownTouchChangedSequence !== 0 ||
  opponentContactDidNotBreak !== 0 ||
  blockedContactBrokeLease !== 0 ||
  winnerFields !== 0
) {
  process.exitCode = 1;
}
