// Probe: WHERE do late-generation goals come from? (Phase 86 telemetry —
// the phase-85 lesson: the inflating shots are pressure≈0 by construction;
// this splits them by serving situation so the upstream defensive gene
// (trap / sweeper / standoff marking) gets built for the pipe that pays.
//   npx tsx scripts/probes/shot-context-anatomy.ts [gens]
import { League } from '../../src/sim/League';

const GENS = Number(process.argv[2] ?? 20);

for (const seed of [991, 424242]) {
  const league = new League({ seed });
  for (let g = 0; g < GENS - 2; g++) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    }
    league.finishSeason();
  }
  // Final two seasons: collect goal contexts.
  const byAssist: Record<string, number> = {};
  let goals = 0;
  let lowP = 0;
  let oneVones = 0;
  let pSum = 0;
  for (let g = 0; g < 2; g++) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      const match = league.createMatch(fx);
      const res = match.runToCompletion();
      for (const s of match.shotLog) {
        if (s.outcome !== 'goal') continue;
        goals++;
        const a = s.assist ?? 'untagged';
        byAssist[a] = (byAssist[a] ?? 0) + 1;
        if ((s.pressure ?? 1) < 0.15) lowP++;
        if (s.oneVone) oneVones++;
        pSum += s.pressure ?? 0;
      }
      league.applyResult(fx, res);
    }
    league.finishSeason();
  }
  const pct = (n: number): string => `${((n / goals) * 100).toFixed(0)}%`;
  console.log(`world ${seed} (gens ${GENS - 2}-${GENS}): ${goals} goals`);
  console.log(`  assist mix: ${Object.entries(byAssist).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${pct(v)}`).join(' · ')}`);
  console.log(`  pressure<0.15: ${pct(lowP)} · composed 1v1: ${pct(oneVones)} · mean pressure ${(pSum / goals).toFixed(2)}`);
}
