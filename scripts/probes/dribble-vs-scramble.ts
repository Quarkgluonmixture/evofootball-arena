/**
 * Probe (2026-07-20, the user's reframe): DISTINGUISH 乱抢 from 盘带. A rising
 * carry share isn't inherently bad — a CLEAN dribble is a skill and good to
 * watch; a SCRAMBLE (pinball → breakaway) is the ugly kind. Earlier the census
 * lumped both into "breakaway family" and mis-judged the emergent field.
 *
 * Method: evolve GENS-1 seasons (fast), then STEP the final season and, per
 * GOAL, ask "was it preceded by a pinball?" — >= 2 possession FLIPS (a side
 * gain differing from the last solid side) in the 4s before the goal ⇒ a
 * SCRAMBLE goal (乱抢); otherwise CLEAN. A `carry`-channel goal that is CLEAN
 * is real dribbling (盘带). Compare EMERGENT_POS on vs off.
 *
 *   npx tsx scripts/probes/dribble-vs-scramble.ts [gens]
 *   EMERGENT_POS=1 npx tsx scripts/probes/dribble-vs-scramble.ts [gens]
 */
import { League } from '../../src/sim/League';
import { DT } from '../../src/sim/constants';

const GENS = Number(process.argv[2] ?? 10);

for (const seed of [991, 424242]) {
  const league = new League({ seed });
  for (let g = 0; g < GENS - 1; g++) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    }
    league.finishSeason();
  }

  let goals = 0;
  let scrambleGoals = 0;
  let cleanCarry = 0;
  let scrambleCarry = 0;
  let carryGoals = 0;
  while (!league.seasonDone) {
    const fx = league.nextFixture()!;
    const m = league.createMatch(fx);
    const flips: number[] = []; // timestamps of possession flips
    let lastSolidSide = -1;
    let prevGoalCount = 0;
    while (!m.finished) {
      m.step(DT);
      const own = m.ball.owner;
      if (own) {
        if (lastSolidSide !== -1 && own.side !== lastSolidSide) flips.push(m.simTime);
        lastSolidSide = own.side;
      }
      // a fresh goal? (either side's tally rose) — classify at the moment it lands
      const gc = m.teams[0].stats.goals + m.teams[1].stats.goals;
      if (gc > prevGoalCount) {
        prevGoalCount = gc;
        const t = m.simTime;
        const recentFlips = flips.filter((f) => t - f <= 4).length;
        const scramble = recentFlips >= 2;
        // channel of the scoring shot (last resolved goal in the log)
        const lastGoal = [...m.shotLog].reverse().find((e) => e.outcome === 'goal');
        const ch = lastGoal?.channel ?? 'buildup';
        goals++;
        if (scramble) scrambleGoals++;
        if (ch === 'carry') {
          carryGoals++;
          if (scramble) scrambleCarry++;
          else cleanCarry++;
        }
      }
    }
    league.applyResult(fx, m.getResult());
  }
  league.finishSeason();

  const pct = (n: number) => `${((n / Math.max(goals, 1)) * 100).toFixed(0)}%`;
  console.log(`\nworld ${seed} (gen ${GENS}): ${goals} goals`);
  console.log(`  SCRAMBLE goals (乱抢, >=2 flips in 4s pre-goal): ${scrambleGoals} (${pct(scrambleGoals)})`);
  console.log(`  CLEAN goals: ${goals - scrambleGoals} (${pct(goals - scrambleGoals)})`);
  console.log(`  carry-channel goals: ${carryGoals} (${pct(carryGoals)}) — of which CLEAN dribble ${cleanCarry} (${pct(cleanCarry)}) · scramble-carry ${scrambleCarry} (${pct(scrambleCarry)})`);
}
console.log(`\n⭐ the reframe: MORE carry is FINE if it's CLEAN dribble (盘带, a skill); only the SCRAMBLE share (乱抢) is the ugly kind. Compare EMERGENT_POS on vs off.`);
