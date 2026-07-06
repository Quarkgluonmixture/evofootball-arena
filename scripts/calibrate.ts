/**
 * Headless calibration: run a few full-length seasons and print per-match
 * averages so gameplay constants can be tuned toward watchable football.
 * Run with: npm run calibrate
 */
import { League } from '../src/sim/League';

const SEASONS = 2;
const SEED = 20260702;

const league = new League({ seed: SEED });

let matches = 0;
let goals = 0;
let shots = 0;
let onTarget = 0;
let passes = 0;
let completed = 0;
let throughBalls = 0;
let saves = 0;
let fouls = 0;
let penalties = 0;
let yellows = 0;
let reds = 0;
let tackles = 0;
let interceptions = 0;
let possA = 0;
let possB = 0;
let xg = 0;

const t0 = performance.now();
for (let s = 0; s < SEASONS; s++) {
  while (!league.seasonDone) {
    const f = league.nextFixture()!;
    const r = league.createMatch(f).runToCompletion();
    league.applyResult(f, r);
    matches++;
    goals += r.score[0] + r.score[1];
    for (const st of r.stats) {
      shots += st.shots;
      onTarget += st.shotsOnTarget;
      passes += st.passes;
      completed += st.passesCompleted;
      throughBalls += st.throughBalls;
      saves += st.saves;
      fouls += st.fouls;
      penalties += st.penalties;
      yellows += st.yellows;
      reds += st.reds;
      tackles += st.tackles;
      interceptions += st.interceptions;
      xg += st.xg;
    }
    possA += r.stats[0].possessionTime;
    possB += r.stats[1].possessionTime;
  }
  const rec = league.finishSeason();
  console.log(`season ${rec.generation}: champion=${rec.championName}`);
}
const elapsed = (performance.now() - t0) / 1000;

const per = (v: number) => (v / matches).toFixed(2);
console.log(`\n${matches} matches in ${elapsed.toFixed(1)}s (${(elapsed / matches * 1000).toFixed(0)} ms/match)`);
console.log(`goals/match:        ${per(goals)}`);
console.log(`shots/match:        ${per(shots)}  (on target: ${per(onTarget)}, xG: ${per(xg)})`);
console.log(`passes/match:       ${per(passes)}  (completion: ${(completed / Math.max(passes, 1) * 100).toFixed(0)}%, through balls: ${per(throughBalls)})`);
console.log(`saves/match:        ${per(saves)}`);
console.log(`fouls/match:        ${per(fouls)}  (penalties: ${per(penalties)})`);
console.log(`cards/match:        ${per(yellows)} 🟨  ${per(reds)} 🟥`);
console.log(`tackles/match:      ${per(tackles)}`);
console.log(`interceptions/match:${per(interceptions)}`);
console.log(`possession balance: ${(possA / (possA + possB) * 100).toFixed(0)}% / ${(possB / (possA + possB) * 100).toFixed(0)}%`);
console.log(`ball-in-play share: ${((possA + possB) / (matches * 240) * 100).toFixed(0)}%`);
