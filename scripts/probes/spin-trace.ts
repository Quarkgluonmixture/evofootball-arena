// Trace one spin-loss example frame by frame (companion to spin-loss.ts):
//   npx tsx scripts/probes/spin-trace.ts <seed> <tFrom> <tTo> <side> <index>
// Prints the carrier's action, body angle, STEERING angle (desiredVel) and
// pressure picture every few ticks — the steering sequence tells orbit
// (monotonic) from flip-flop (alternating) from target-behind (180° jumps).
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { DT } from '../../src/sim/constants';
import { Match } from '../../src/sim/Match';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import { dist } from '../../src/utils/vec';

const [seed, tFrom, tTo, sideArg, idxArg] = process.argv.slice(2).map(Number);

const team = (name: string, s: number): TeamInfo => {
  const rng = new Rng(s);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

const m = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240 });
const p = m.teams[sideArg].players[idxArg];
const deg = (x: number, y: number): string => ((Math.atan2(y, x) * 57.3 + 360) % 360).toFixed(0).padStart(3);
let tick = 0;
while (!m.finished && m.simTime < tTo) {
  m.step(DT);
  if (m.simTime < tFrom) continue;
  if (tick++ % 3 !== 0) continue;
  const own = m.ball.owner === p ? '●' : m.ball.owner === null ? '·' : '○';
  let nearD = Infinity;
  let nearN = 0;
  for (const o of m.teams[1 - p.side].players) {
    if (o.sentOff) continue;
    const d = dist(o.pos, p.pos);
    if (d < nearD) nearD = d;
    if (d < 3.5) nearN++;
  }
  console.log(
    `t=${m.simTime.toFixed(2)} ${own} ${p.action.type.padEnd(14)} ` +
    `pos(${p.pos.x.toFixed(1)},${p.pos.y.toFixed(1)}) ` +
    `body ${deg(p.heading.x, p.heading.y)}° steer ${deg(p.desiredVel.x, p.desiredVel.y)}° ` +
    `v ${Math.hypot(p.vel.x, p.vel.y).toFixed(1)} opp ${nearD.toFixed(1)}m×${nearN}` +
    `${p.stunTimer > 0 ? ' STUN' : ''}${m.dribbleTouch?.gid === p.gid ? ' push' : ''}`,
  );
}
