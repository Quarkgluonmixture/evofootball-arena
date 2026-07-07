/**
 * Phase 28 tuning probe: per-mechanism aerial tallies over a bag of seeded
 * matches — corner threat, header outcomes, keeper claims, delivery volume.
 * Run with: npx tsx scripts/probe-aerial.ts [matches]
 */
import { League } from '../src/sim/League';

const N = Number(process.argv[2] ?? 60);
const league = new League({ seed: 987001 });

let matches = 0;
let corners = 0;
let cornerShots8s = 0; // corners followed by a shot inside 8s
let cornerGoals = 0; // ...or a goal inside 8s
let headerShots = 0;
let claims = 0;
let crosses = 0;
let headers = 0;
let longBalls = 0;
let goals = 0;
let shots = 0;

while (matches < N && !league.seasonDone) {
  const f = league.nextFixture()!;
  const m = league.createMatch(f);
  const r = m.runToCompletion();
  league.applyResult(f, r);
  matches++;
  goals += r.score[0] + r.score[1];
  for (const st of r.stats) {
    crosses += st.crosses;
    headers += st.headersWon;
    longBalls += st.longBalls;
    corners += st.corners;
    shots += st.shots;
  }
  for (let i = 0; i < r.events.length; i++) {
    const ev = r.events[i];
    if (ev.type === 'shot' && ev.text.includes('heads it')) headerShots++;
    if (ev.type === 'save' && ev.text.includes('claims the high ball')) claims++;
    if (ev.type === 'corner') {
      let shot = false;
      let goal = false;
      for (let j = i + 1; j < r.events.length; j++) {
        const e2 = r.events[j];
        if (e2.t - ev.t > 8) break;
        if (e2.type === 'shot' && e2.side === ev.side) shot = true;
        if (e2.type === 'goal' && e2.side === ev.side) goal = true;
      }
      if (shot || goal) cornerShots8s++;
      if (goal) cornerGoals++;
    }
  }
}

const per = (v: number) => (v / matches).toFixed(2);
console.log(`${matches} matches`);
console.log(`goals ${per(goals)} · shots ${per(shots)}`);
console.log(`crosses ${per(crosses)} · headers won ${per(headers)} · long balls ${per(longBalls)} · gk claims ${per(claims)}`);
console.log(`header shots/match ${per(headerShots)}`);
console.log(
  `corners ${per(corners)} → shot inside 8s: ${((cornerShots8s / Math.max(corners, 1)) * 100).toFixed(0)}%` +
  ` · goal inside 8s: ${((cornerGoals / Math.max(corners, 1)) * 100).toFixed(1)}%`,
);
