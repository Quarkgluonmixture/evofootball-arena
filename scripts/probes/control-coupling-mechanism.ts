// B1c-1 isolated single-player mechanism gate.
// No Match consumer calls these helpers: this synthetic scene proves that
// distance-driven gait can issue bounded velocity-only touches while the real
// ball stays recoverable.
//   npx tsx scripts/probes/control-coupling-mechanism.ts
import {
  advanceVirtualGait,
  applyControlledTouchImpulse,
  planControlledTouch,
  virtualFootAnchor,
  type VirtualFootSide,
} from '../../src/sim/controlCoupling';
import { BALL_FRICTION_K, CONTROL_RADIUS, DT } from '../../src/sim/constants';
import { recordOwnControlTouch, type ActiveControlSequence } from '../../src/sim/physical';

type Scenario = {
  name: string;
  speed: number;
  turnDemand: number;
  pressure: number;
};

type Result = {
  name: string;
  touches: number;
  touchesPerSecond: number;
  meanFootError: number;
  maxFootError: number;
  recoverableRate: number;
  meanControllerDistance: number;
  maxControllerDistance: number;
  meanImpulse: number;
  maxImpulse: number;
  sequenceIdChanges: number;
};

const DURATION = 10;
const scenarios: Scenario[] = [
  { name: 'walk-open', speed: 1.8, turnDemand: 0, pressure: 0 },
  { name: 'jog-open', speed: 4, turnDemand: 0, pressure: 0 },
  { name: 'jog-pressed-turn', speed: 4, turnDemand: 0.8, pressure: 1 },
  { name: 'sprint-open', speed: 7, turnDemand: 0, pressure: 0 },
];

const run = (scenario: Scenario): Result => {
  const player = { pos: { x: 0, y: 0 }, vel: { x: scenario.speed, y: 0 }, bodyDir: { x: 1, y: 0 } };
  const initialFoot: VirtualFootSide = 'left';
  const ball = {
    pos: virtualFootAnchor(player.pos, player.bodyDir, initialFoot),
    vel: { x: scenario.speed, y: 0 },
  };
  let sequence: ActiveControlSequence = {
    id: 1,
    controllerGid: 0,
    origin: 'reception',
    startedTick: 0,
    lastOwnTouchTick: 0,
    touchIndex: 0,
    status: 'active',
  };
  let gait = { phase: 0, touchIndex: 1 };
  let touches = 1;
  let footErrorSum = 0;
  let maxFootError = 0;
  let recoverable = 1;
  let controllerDistanceSum = 0;
  let maxControllerDistance = 0;
  let impulseSum = 0;
  let maxImpulse = 0;
  let samples = 0;
  let sequenceIdChanges = 0;

  const firstPlan = planControlledTouch({
    playerPos: player.pos,
    playerVel: player.vel,
    bodyDir: player.bodyDir,
    ballPos: ball.pos,
    footSide: initialFoot,
    speed: scenario.speed,
    turnDemand: scenario.turnDemand,
    pressure: scenario.pressure,
  });
  const firstImpulse = applyControlledTouchImpulse(ball, firstPlan);
  impulseSum += firstImpulse.magnitude;
  maxImpulse = firstImpulse.magnitude;
  sequence = recordOwnControlTouch(sequence, 0);

  const steps = Math.round(DURATION / DT);
  for (let tick = 1; tick <= steps; tick++) {
    player.pos.x += player.vel.x * DT;
    player.pos.y += player.vel.y * DT;
    ball.pos.x += ball.vel.x * DT;
    ball.pos.y += ball.vel.y * DT;
    const decay = Math.exp(-BALL_FRICTION_K * DT);
    ball.vel.x *= decay;
    ball.vel.y *= decay;

    const distance = Math.hypot(ball.pos.x - player.pos.x, ball.pos.y - player.pos.y);
    controllerDistanceSum += distance;
    maxControllerDistance = Math.max(maxControllerDistance, distance);
    samples++;

    const advanced = advanceVirtualGait(
      gait,
      scenario.speed * DT,
      scenario.speed,
      scenario.turnDemand,
      scenario.pressure,
    );
    gait = advanced.state;
    for (const touch of advanced.touches) {
      const anchor = virtualFootAnchor(player.pos, player.bodyDir, touch.footSide);
      const footError = Math.hypot(ball.pos.x - anchor.x, ball.pos.y - anchor.y);
      footErrorSum += footError;
      maxFootError = Math.max(maxFootError, footError);
      if (footError <= CONTROL_RADIUS) recoverable++;

      const plan = planControlledTouch({
        playerPos: player.pos,
        playerVel: player.vel,
        bodyDir: player.bodyDir,
        ballPos: ball.pos,
        footSide: touch.footSide,
        speed: scenario.speed,
        turnDemand: scenario.turnDemand,
        pressure: scenario.pressure,
      });
      const impulse = applyControlledTouchImpulse(ball, plan);
      impulseSum += impulse.magnitude;
      maxImpulse = Math.max(maxImpulse, impulse.magnitude);
      const beforeId = sequence.id;
      sequence = recordOwnControlTouch(sequence, tick);
      if (sequence.id !== beforeId) sequenceIdChanges++;
      touches++;
    }
  }

  return {
    name: scenario.name,
    touches,
    touchesPerSecond: touches / DURATION,
    meanFootError: footErrorSum / Math.max(touches - 1, 1),
    maxFootError,
    recoverableRate: recoverable / touches,
    meanControllerDistance: controllerDistanceSum / Math.max(samples, 1),
    maxControllerDistance,
    meanImpulse: impulseSum / touches,
    maxImpulse,
    sequenceIdChanges,
  };
};

const results = scenarios.map(run);
const repeated = scenarios.map(run);
if (JSON.stringify(results) !== JSON.stringify(repeated)) {
  throw new Error('control-coupling mechanism is not deterministic');
}

for (const result of results) {
  console.log(
    `${result.name.padEnd(17)} touches ${result.touchesPerSecond.toFixed(2)}/s · ` +
    `foot error mean/max ${result.meanFootError.toFixed(3)}/${result.maxFootError.toFixed(3)}m · ` +
    `recoverable ${(result.recoverableRate * 100).toFixed(1)}% · ` +
    `controller distance mean/max ${result.meanControllerDistance.toFixed(3)}/${result.maxControllerDistance.toFixed(3)}m · ` +
    `impulse mean/max ${result.meanImpulse.toFixed(3)}/${result.maxImpulse.toFixed(3)}m/s`,
  );
}

const openJog = results.find((result) => result.name === 'jog-open')!;
const pressedJog = results.find((result) => result.name === 'jog-pressed-turn')!;
const allRecoverable = results.every((result) => result.recoverableRate === 1);
const idStable = results.every((result) => result.sequenceIdChanges === 0);
const pressureDirection = pressedJog.touchesPerSecond > openJog.touchesPerSecond;

console.log(
  `gates deterministic=yes · all recoverable=${allRecoverable ? 'yes' : 'NO'} · ` +
  `sequence id stable=${idStable ? 'yes' : 'NO'} · ` +
  `pressure/turn cadence↑=${pressureDirection ? 'yes' : 'NO'}`,
);

if (!allRecoverable || !idStable || !pressureDirection) process.exitCode = 1;
