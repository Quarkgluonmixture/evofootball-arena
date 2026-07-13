// Probe: discrete dribble touches (Phase 36). Measures the touch economy
// itself (cadence, roll length, gap, who wins the free ball) plus the
// downstream duel/possession stats the spec says must be re-tuned
// (t+i ~45, completion 66-68%). Current-build only (the mechanic doesn't
// exist at phase-35); compare aggregate rows to the phase-35 calibrate.
//   npx tsx scripts/probes/touch-rates.ts [seedOffset]
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

const N = 150;
const OFF = Number(process.argv[2] ?? 0);

let pushes = 0;
let recollects = 0;
let pokes = 0; // opponent captured the free touch
let teammatePickups = 0;
let ranOut = 0; // touch rolled dead / out of play / expired
let gapSum = 0;
let gapMax = 0;
let flightSum = 0;
let goals = 0;
let tackles = 0;
let interceptions = 0;
let passes = 0;
let passesCompleted = 0;
let miscontrols = 0;
let fouls = 0;

for (let seed = OFF; seed < OFF + N; seed++) {
  const m = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240 });
  let live: { gid: number; start: number; maxGap: number } | null = null;
  while (!m.finished) {
    m.step(DT);
    const dt = m.dribbleTouch;
    if (dt && m.ball.owner === null) {
      if (!live || live.gid !== dt.gid || live.start > m.simTime) {
        if (live) ranOut++; // a previous flight never resolved to a capture
        live = { gid: dt.gid, start: m.simTime, maxGap: 0 };
        pushes++;
      }
      const p = m.allPlayers[dt.gid];
      const gap = Math.hypot(p.pos.x - m.ball.pos.x, p.pos.y - m.ball.pos.y);
      if (gap > live.maxGap) live.maxGap = gap;
    } else if (live) {
      const owner = m.ball.owner;
      if (owner) {
        if (owner.gid === live.gid) recollects++;
        else if (owner.side === m.allPlayers[live.gid].side) teammatePickups++;
        else pokes++;
        flightSum += m.simTime - live.start;
        gapSum += live.maxGap;
        if (live.maxGap > gapMax) gapMax = live.maxGap;
      } else {
        ranOut++; // dead ball / expiry without a capture
      }
      live = null;
    }
  }
  goals += m.score[0] + m.score[1];
  for (const t of m.teams) {
    tackles += t.stats.tackles;
    interceptions += t.stats.interceptions;
    passes += t.stats.passes;
    passesCompleted += t.stats.passesCompleted;
    miscontrols += t.stats.miscontrols;
    fouls += t.stats.fouls;
  }
}

const per = (v: number): string => (v / N).toFixed(2);
console.log(`n=${N} (seeds ${OFF}-${OFF + N - 1})`);
console.log(`pushes/match: ${per(pushes)}  (resolution: recollect ${((recollects / Math.max(pushes, 1)) * 100).toFixed(1)}%, poke ${((pokes / Math.max(pushes, 1)) * 100).toFixed(1)}%, teammate ${((teammatePickups / Math.max(pushes, 1)) * 100).toFixed(1)}%, dead/expired ${((ranOut / Math.max(pushes, 1)) * 100).toFixed(1)}%)`);
console.log(`touch flight: mean ${(flightSum / Math.max(recollects + pokes + teammatePickups, 1)).toFixed(2)}s, mean max-gap ${(gapSum / Math.max(recollects + pokes + teammatePickups, 1)).toFixed(2)}m, biggest ${gapMax.toFixed(2)}m`);
console.log(`goals/match: ${per(goals)}`);
console.log(`t+i/match: ${per(tackles + interceptions)}  (tackles ${per(tackles)}, interceptions ${per(interceptions)})`);
console.log(`completion: ${((passesCompleted / Math.max(passes, 1)) * 100).toFixed(1)}%  (passes ${per(passes)})`);
console.log(`miscontrols/match: ${per(miscontrols)}  fouls/match: ${per(fouls)}`);
