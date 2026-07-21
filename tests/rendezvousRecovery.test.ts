import { describe, expect, it } from 'vitest';
import type { PlayerAttributes } from '../src/evolution/playerGenome';
import { Player } from '../src/sim/Player';
import { BALL_RADIUS, DT } from '../src/sim/constants';
import { virtualFootAnchor } from '../src/sim/controlCoupling';
import {
  clonePlayerForPhysics,
  executeFixedRendezvous,
  planFixedRendezvous,
  snapshotPlayerPhysics,
  type FixedMovementIntent,
} from '../src/sim/rendezvousRecovery';

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

const makePlayer = (): Player => {
  const player = new Player(0, 2, 'MF', 'Lab', attrs);
  player.pos = { x: 0, y: 0 };
  player.vel = { x: 4, y: 0 };
  player.desiredVel = { x: 4, y: 0 };
  player.heading = { x: 1, y: 0 };
  return player;
};

const intent = (x: number, y: number): FixedMovementIntent => ({
  desiredVel: { x, y },
  faceTarget: null,
});

const makePlan = (
  player = makePlayer(),
  movementIntent = intent(0, 0),
  touchDirection = { x: 1, y: 0 },
) => planFixedRendezvous({
  id: 7,
  player,
  ball: {
    pos: virtualFootAnchor(player.pos, player.bodyDir, 'left'),
    vel: { x: player.vel.x, y: player.vel.y },
    radius: BALL_RADIUS,
  },
  movementIntent,
  touchDirection,
  gait: { phase: 0, touchIndex: 1 },
})!;

describe('B1d-0 fixed-rendezvous integrator parity', () => {
  it('keeps shadow prediction bit-identical to isolated real physicsStep across the parity matrix', () => {
    const cases = [
      { name: 'stationary', vel: { x: 0, y: 0 }, desired: { x: 0, y: 0 } },
      { name: 'accelerating-jog', vel: { x: 0, y: 0 }, desired: { x: 4, y: 0 } },
      { name: 'high-speed', vel: { x: 6, y: 0 }, desired: { x: 6, y: 0 } },
      { name: 'decelerating', vel: { x: 6, y: 0 }, desired: { x: 0, y: 0 } },
      { name: '45-degree', vel: { x: 4, y: 0 }, desired: { x: 3, y: 3 } },
      {
        name: 'face-target', vel: { x: 4, y: 0 }, desired: { x: 4, y: 0 },
        faceTarget: { x: 0, y: 10 },
      },
      { name: 'low-stamina', vel: { x: 5, y: 0 }, desired: { x: 5, y: 0 }, stamina: 0.2 },
      { name: 'stunned', vel: { x: 4, y: 0 }, desired: { x: 6, y: 0 }, stunTimer: 0.2 },
    ];

    for (const scenario of cases) {
      const executed = makePlayer();
      executed.vel = { ...scenario.vel };
      executed.desiredVel = { ...scenario.desired };
      executed.faceTarget = scenario.faceTarget ? { ...scenario.faceTarget } : null;
      executed.stamina = scenario.stamina ?? 0.73;
      executed.stunTimer = scenario.stunTimer ?? 0;
      executed.kickCooldown = 0.5;
      executed.touchTimer = 0.3;
      const predicted = clonePlayerForPhysics(executed);

      for (let tick = 0; tick < 30; tick++) {
        // Exercise both faceTarget branches and a deterministic schedule change.
        const desired = tick === 15
          ? { x: -scenario.desired.y, y: scenario.desired.x }
          : scenario.desired;
        const faceTarget = tick >= 20
          ? { x: -2, y: 1 }
          : (scenario.faceTarget ?? null);

        predicted.desiredVel.x = desired.x;
        predicted.desiredVel.y = desired.y;
        predicted.faceTarget = faceTarget ? { ...faceTarget } : null;
        executed.desiredVel.x = desired.x;
        executed.desiredVel.y = desired.y;
        executed.faceTarget = faceTarget ? { ...faceTarget } : null;
        predicted.physicsStep(DT);
        executed.physicsStep(DT);
        expect(snapshotPlayerPhysics(predicted), `${scenario.name} tick ${tick}`)
          .toEqual(snapshotPlayerPhysics(executed));
      }
    }
  });

  it('commits one bounded impulse to one immutable future foot contact', () => {
    const player = makePlayer();
    const ballPos = virtualFootAnchor(player.pos, player.bodyDir, 'left');
    const plan = makePlan(player);

    expect(plan).not.toBeNull();
    expect(plan.ballBefore.pos).toEqual(ballPos);
    expect(plan.ballAfterSingleImpulse.pos).toEqual(ballPos);
    expect(plan.fixedContactTick).toBeGreaterThan(0);
    expect(plan.fixedFootSide).toBe('right');
    expect(plan.status).toBe('planned');

    const result = executeFixedRendezvous(plan);
    expect(result.status).toBe('contacted');
    expect(result.actualBallAtContact.pos.x).toBeCloseTo(plan.fixedContactPoint.x, 12);
    expect(result.actualBallAtContact.pos.y).toBeCloseTo(plan.fixedContactPoint.y, 12);
    expect(result.footError).toBeLessThanOrEqual(BALL_RADIUS * 2);
    expect(result.ledger).toMatchObject({
      initialBallImpulses: 1,
      controllerBallCorrectionsAfterCommit: 0,
      contactTargetChanges: 0,
      contactTickChanges: 0,
      retimes: 0,
      directPlayerPositionWrites: 0,
      directPlayerVelocityWrites: 0,
      directHeadingWrites: 0,
      topSpeedOverrides: 0,
      accelOverrides: 0,
      m3Calls: 0,
      contestEpisodesCreated: 0,
      giveBallCalls: 0,
      possessionWrites: 0,
      controlSequenceWrites: 0,
      possessionLocusReads: 0,
      rngDraws: 0,
    });
  });

  it('depends on player recovery rather than a semantic lease', () => {
    const player = makePlayer();
    player.vel = { x: 6, y: 0 };
    player.desiredVel = { x: 0, y: 0 };
    const plan = makePlan(player, intent(0, 0));
    const recovery = executeFixedRendezvous(plan);
    const ablated = executeFixedRendezvous(plan, { recoveryEnabled: false });

    expect(recovery.status).toBe('contacted');
    expect(ablated.status).toBe('missed');
    expect(recovery.footError).toBeLessThan(ablated.footError);
    expect(ablated.ledger.m3Calls).toBe(0);
    expect(ablated.ledger.possessionWrites).toBe(0);
  });

  it('honestly misses when the controller is frozen after the touch', () => {
    const player = makePlayer();
    player.vel = { x: 1.5, y: 0 };
    const plan = makePlan(player, intent(0, 0));
    const frozen = executeFixedRendezvous(plan, { stunAtTick: 1, stunDuration: 2 });

    expect(frozen.status).toBe('missed');
    expect(frozen.ledger.controllerBallCorrectionsAfterCommit).toBe(0);
  });

  it('never moves the target or repairs a perturbed ball', () => {
    const plan = makePlan();
    const pointBefore = JSON.stringify(plan.fixedContactPoint);
    const perturbed = executeFixedRendezvous(plan, {
      ballPerturbation: { tick: 3, impulse: { x: 0, y: 5 } },
    });

    expect(perturbed.status).toBe('missed');
    expect(JSON.stringify(plan.fixedContactPoint)).toBe(pointBefore);
    expect(perturbed.ledger.externalBallPerturbations).toBe(1);
    expect(perturbed.ledger.controllerBallCorrectionsAfterCommit).toBe(0);
    expect(perturbed.ledger.contactTargetChanges).toBe(0);
    expect(perturbed.ledger.retimes).toBe(0);
  });

  it('invalidates an intent change instead of replanning', () => {
    const plan = makePlan();
    const result = executeFixedRendezvous(plan, { intentChangeAtTick: 2 });

    expect(result.status).toBe('invalidatedIntent');
    expect(result.ledger.retimes).toBe(0);
    expect(result.ledger.contactTargetChanges).toBe(0);
    expect(result.ledger.initialBallImpulses).toBe(1);
  });

  it('is deterministic and never mutates the committed plan', () => {
    const plan = makePlan();
    const before = JSON.stringify(plan);
    const first = executeFixedRendezvous(plan);
    const second = executeFixedRendezvous(plan);

    expect(second).toEqual(first);
    expect(JSON.stringify(plan)).toBe(before);
  });
});
