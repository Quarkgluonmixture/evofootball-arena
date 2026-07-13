// Probe: keeper hands vs the box line (Phase 28.5, user report "门将出击到
// 禁区外面用手接球了"). Classifies every fresh keeper possession by
// (inside / outside his own box) × (hands / feet). The bug is HANDS-OUTSIDE:
// a sweeper who rushed or chased off his line and then scooped the ball up
// and held it. After the fix that cell must be ~0 while the keeper still
// comes out — outside-box possessions survive, but as FEET.
//   npx tsx scripts/probes/keeper-hands.ts [seedOffset]
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

// Keeper possessions, split into the four cells.
let handsIn = 0;   // legal claim/hold in the box
let handsOut = 0;  // THE BUG: hands outside the box
let feetIn = 0;    // back-pass / feet keeper in the box
let feetOut = 0;   // the sweeper-keeper's legal feet clearance outside the box
let goals = 0;
let saves = 0;

for (let seed = OFF; seed < OFF + N; seed++) {
  const m = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240 });
  let prevOwner = -1;
  while (!m.finished) {
    m.step(DT);
    const o = m.ball.owner;
    if (o && o.role === 'GK' && o.gid !== prevOwner) {
      const inBox = m.inPenaltyBox(o.pos, o.side);
      const hands = o.gkHoldTimer > 0 || o.gkDistributing;
      if (hands) inBox ? handsIn++ : handsOut++;
      else inBox ? feetIn++ : feetOut++;
    }
    prevOwner = o ? o.gid : -1;
  }
  goals += m.score[0] + m.score[1];
  for (const t of m.teams) saves += t.stats.saves;
}

const per = (v: number): string => (v / N).toFixed(3);
console.log(`n=${N} (seeds ${OFF}-${OFF + N - 1})`);
console.log('keeper possessions / match:');
console.log(`  HANDS in-box:   ${per(handsIn)}   (legal claim/hold)`);
console.log(`  HANDS out-box:  ${per(handsOut)}   <-- the bug (must be ~0)`);
console.log(`  FEET  in-box:   ${per(feetIn)}   (back-pass / feet keeper)`);
console.log(`  FEET  out-box:  ${per(feetOut)}   (legal sweeper clearance)`);
console.log(`goals/match: ${per(goals)}   saves/match: ${per(saves)}`);
