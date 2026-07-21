// B1d-0 isolated fixed-rendezvous falsification lab.
// No Match, AI, M3, possession or ControlSequence consumer imports this path.
//   npx tsx scripts/probes/rendezvous-recovery-mechanism.ts
import type { PlayerAttributes } from '../../src/evolution/playerGenome';
import { Player } from '../../src/sim/Player';
import { BALL_RADIUS } from '../../src/sim/constants';
import { virtualFootAnchor } from '../../src/sim/controlCoupling';
import {
  executeFixedRendezvous,
  planFixedRendezvous,
  type FixedMovementIntent,
} from '../../src/sim/rendezvousRecovery';

const attrs: PlayerAttributes = {
  pace: 0.5, passing: 0.5, dribbling: 0.5, finishing: 0.5, defending: 0.5,
  strength: 0.5, stamina: 0.5, reflexes: 0.5, positioning: 0.5,
};

type Scenario = {
  name: string;
  velocity: { x: number; y: number };
  heading: { x: number; y: number };
  intent: FixedMovementIntent;
  touchDirection: { x: number; y: number };
  stamina?: number;
};

const scenarios: Scenario[] = [
  {
    name: 'straight-jog', velocity: { x: 4, y: 0 }, heading: { x: 1, y: 0 },
    intent: { desiredVel: { x: 4, y: 0 }, faceTarget: null }, touchDirection: { x: 1, y: 0 },
  },
  {
    name: 'brake-to-trap', velocity: { x: 6, y: 0 }, heading: { x: 1, y: 0 },
    intent: { desiredVel: { x: 0, y: 0 }, faceTarget: null }, touchDirection: { x: 1, y: 0 },
  },
  {
    name: '45deg-turn', velocity: { x: 4, y: 0 }, heading: { x: 1, y: 0 },
    intent: { desiredVel: { x: 3, y: 3 }, faceTarget: null }, touchDirection: { x: 1, y: 0 },
  },
  {
    name: '90deg-turn', velocity: { x: 4, y: 0 }, heading: { x: 1, y: 0 },
    intent: { desiredVel: { x: 0, y: 4 }, faceTarget: null }, touchDirection: { x: 1, y: 0 },
  },
  {
    name: 'low-stamina', velocity: { x: 5, y: 0 }, heading: { x: 1, y: 0 }, stamina: 0.25,
    intent: { desiredVel: { x: 2, y: 0 }, faceTarget: null }, touchDirection: { x: 1, y: 0 },
  },
];

const run = (scenario: Scenario) => {
  const player = new Player(0, 2, 'MF', scenario.name, attrs);
  player.pos = { x: 0, y: 0 };
  player.vel = { ...scenario.velocity };
  player.heading = { ...scenario.heading };
  player.desiredVel = { ...scenario.intent.desiredVel };
  player.stamina = scenario.stamina ?? 1;
  const plan = planFixedRendezvous({
    id: 1,
    player,
    ball: {
      pos: virtualFootAnchor(player.pos, player.bodyDir, 'left'),
      vel: { ...player.vel },
      radius: BALL_RADIUS,
    },
    movementIntent: scenario.intent,
    touchDirection: scenario.touchDirection,
    gait: { phase: 0, touchIndex: 1 },
  });
  if (!plan) throw new Error(`${scenario.name}: no feasible fixed rendezvous`);
  const recovery = executeFixedRendezvous(plan);
  const ablated = executeFixedRendezvous(plan, { recoveryEnabled: false });
  return {
    name: scenario.name,
    tick: plan.fixedContactTick,
    impulse: Math.hypot(plan.singleImpulse.x, plan.singleImpulse.y),
    recovery: recovery.status,
    recoveryError: recovery.footError,
    ablated: ablated.status,
    ablatedError: ablated.footError,
    ledger: recovery.ledger,
  };
};

const results = scenarios.map(run);
const repeated = scenarios.map(run);
if (JSON.stringify(results) !== JSON.stringify(repeated)) {
  throw new Error('B1d-0 rendezvous lab is not deterministic');
}

for (const result of results) {
  console.log(
    `${result.name.padEnd(15)} tick ${result.tick.toString().padStart(2)} · `
    + `impulse ${result.impulse.toFixed(3)}m/s · `
    + `recovery ${result.recovery} (${result.recoveryError.toFixed(3)}m) · `
    + `ablated ${result.ablated} (${result.ablatedError.toFixed(3)}m)`,
  );
}

const allRecovery = results.every((result) => result.recovery === 'contacted');
const ablationHasTeeth = results.some((result) => result.ablated === 'missed');
const invariants = results.every((result) => {
  const ledger = result.ledger;
  return ledger.initialBallImpulses === 1
    && ledger.controllerBallCorrectionsAfterCommit === 0
    && ledger.contactTargetChanges === 0
    && ledger.contactTickChanges === 0
    && ledger.retimes === 0
    && ledger.directPlayerPositionWrites === 0
    && ledger.directPlayerVelocityWrites === 0
    && ledger.directHeadingWrites === 0
    && ledger.topSpeedOverrides === 0
    && ledger.accelOverrides === 0
    && ledger.m3Calls === 0
    && ledger.contestEpisodesCreated === 0
    && ledger.giveBallCalls === 0
    && ledger.possessionWrites === 0
    && ledger.controlSequenceWrites === 0
    && ledger.possessionLocusReads === 0
    && ledger.rngDraws === 0;
});

console.log(
  `gates deterministic=yes · recovery all contact=${allRecovery ? 'yes' : 'NO'} · `
  + `ablation has teeth=${ablationHasTeeth ? 'yes' : 'NO'} · exact-zero invariants=${invariants ? 'yes' : 'NO'}`,
);

if (!allRecovery || !ablationHasTeeth || !invariants) process.exitCode = 1;
