// Ball-Control Foundation baseline / layer-gate.
// Measures the current secured↔knocked process without changing it:
//   npx tsx scripts/probes/ball-control-anatomy.ts [matches] [seedOffset]
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { DT, TOUCH_CONTROL_DIST } from '../../src/sim/constants';
import { Match } from '../../src/sim/Match';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const N = Number(process.argv[2] ?? 120);
const OFF = Number(process.argv[3] ?? 0);

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

type Knock = {
  gid: number;
  side: number;
  startedAt: number;
  maxDistance: number;
};

let playingFrames = 0;
let securedFrames = 0;
let pressuredSecuredFrames = 0;
let movingSecuredFrames = 0;
let securedDistance = 0;
let pressuredDistance = 0;
let securedDistanceChanges = 0;
let knocks = 0;
let knockDuration = 0;
let knockMaxDistance = 0;
let selfRegather = 0;
let teammateGather = 0;
let opponentGather = 0;
let unresolved = 0;
let goals = 0;

for (let seed = OFF; seed < OFF + N; seed++) {
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: 240,
  });
  let activeKnock: Knock | null = null;
  let priorSecuredGid = -1;
  let priorSecuredDistance = 0;

  while (!match.finished) {
    match.step(DT);
    if (match.phase !== 'playing') {
      priorSecuredGid = -1;
      continue;
    }
    playingFrames++;

    const phase = match.ballControlPhase;
    if (phase.kind === 'secured') {
      const owner = match.allPlayers[phase.controllerGid];
      if (owner.role !== 'GK') {
        const distance = Math.hypot(
          match.ball.pos.x - owner.pos.x,
          match.ball.pos.y - owner.pos.y,
        );
        securedFrames++;
        securedDistance += distance;
        if (Math.hypot(owner.vel.x, owner.vel.y) > 2.5) movingSecuredFrames++;

        let nearestOpponent = Infinity;
        for (const opponent of match.teams[1 - owner.side].players) {
          if (opponent.sentOff) continue;
          nearestOpponent = Math.min(
            nearestOpponent,
            Math.hypot(opponent.pos.x - owner.pos.x, opponent.pos.y - owner.pos.y),
          );
        }
        if (nearestOpponent <= TOUCH_CONTROL_DIST) {
          pressuredSecuredFrames++;
          pressuredDistance += distance;
        }

        if (
          priorSecuredGid === owner.gid &&
          Math.abs(priorSecuredDistance - distance) > 0.02
        ) {
          securedDistanceChanges++;
        }
        priorSecuredGid = owner.gid;
        priorSecuredDistance = distance;
      } else {
        priorSecuredGid = -1;
      }
    } else {
      priorSecuredGid = -1;
    }

    if (phase.kind === 'knocked') {
      const controller = match.allPlayers[phase.controllerGid];
      const distance = Math.hypot(
        match.ball.pos.x - controller.pos.x,
        match.ball.pos.y - controller.pos.y,
      );
      if (activeKnock === null || activeKnock.gid !== controller.gid) {
        if (activeKnock !== null) unresolved++;
        activeKnock = {
          gid: controller.gid,
          side: controller.side,
          startedAt: match.simTime,
          maxDistance: distance,
        };
        knocks++;
      } else {
        activeKnock.maxDistance = Math.max(activeKnock.maxDistance, distance);
      }
    } else if (activeKnock !== null) {
      knockDuration += match.simTime - activeKnock.startedAt;
      knockMaxDistance += activeKnock.maxDistance;
      if (phase.kind === 'secured' || phase.kind === 'keeperHeld') {
        if (phase.controllerGid === activeKnock.gid) selfRegather++;
        else if (match.allPlayers[phase.controllerGid].side === activeKnock.side) teammateGather++;
        else opponentGather++;
      } else {
        unresolved++;
      }
      activeKnock = null;
    }
  }
  if (activeKnock !== null) unresolved++;
  goals += match.score[0] + match.score[1];
}

const ratio = (value: number, total: number): string =>
  total === 0 ? '0.0%' : `${((value / total) * 100).toFixed(1)}%`;
const perMatch = (value: number): string => (value / N).toFixed(2);

console.log(`n=${N} (seeds ${OFF}-${OFF + N - 1})  goals/match ${(goals / N).toFixed(2)}`);
console.log(
  `outfield secured: ${ratio(securedFrames, playingFrames)} of playing frames · ` +
  `moving ${ratio(movingSecuredFrames, securedFrames)} · pressured ${ratio(pressuredSecuredFrames, securedFrames)}`,
);
console.log(
  `secured ball distance: mean ${(securedDistance / Math.max(securedFrames, 1)).toFixed(3)}m · ` +
  `pressured ${(pressuredDistance / Math.max(pressuredSecuredFrames, 1)).toFixed(3)}m · ` +
  `visible distance changes ${(securedDistanceChanges / N).toFixed(2)}/match`,
);
console.log(
  `knocks: ${perMatch(knocks)}/match · duration ${(knockDuration / Math.max(knocks, 1)).toFixed(3)}s · ` +
  `max carrier distance ${(knockMaxDistance / Math.max(knocks, 1)).toFixed(3)}m`,
);
console.log(
  `knock outcomes: self ${ratio(selfRegather, knocks)} · teammate ${ratio(teammateGather, knocks)} · ` +
  `opponent ${ratio(opponentGather, knocks)} · unresolved/dead ${ratio(unresolved, knocks)}`,
);
