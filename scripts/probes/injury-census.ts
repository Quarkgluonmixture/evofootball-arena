// Probe (Phase 118): the INJURY CENSUS — does the rate land on the
// user-ratified budget (~1-2 injuries per club-season, mostly knocks)?
// Also watches the foul economy (injuries must be a side effect, not a
// perturbation) and the serious-injury absence machinery.
//   npx tsx scripts/probes/injury-census.ts [gens]
import { League } from '../../src/sim/League';
import { ROSTER_SIZE } from '../../src/sim/types';

const GENS = Number(process.argv[2] ?? 12);

for (const seed of [991, 424242]) {
  const league = new League({ seed });
  let injuries = 0;
  let serious = 0;
  let roundsOut = 0;
  let fouls = 0;
  let goals = 0;
  let matches = 0;
  let seasons = 0;
  for (let g = 0; g < GENS; g++) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      const res = league.createMatch(fx).runToCompletion();
      matches++;
      for (const side of [0, 1] as const) {
        injuries += res.stats[side].injuries;
        goals += res.stats[side].goals;
        fouls += res.stats[side].fouls;
      }
      for (let ri = 0; ri < ROSTER_SIZE * 2; ri++) {
        const r = res.injuries?.[ri] ?? 0;
        if (r > 0) {
          serious++;
          roundsOut += r;
        }
      }
      league.applyResult(fx, res);
    }
    league.finishSeason();
    seasons++;
  }
  const perClubSeason = injuries / (seasons * 16);
  console.log(`\nworld ${seed} (${seasons} seasons, ${matches} matches):`);
  console.log(
    `  injuries ${injuries} (${(injuries / matches).toFixed(2)}/match · ${perClubSeason.toFixed(2)}/club-season)` +
    ` · serious ${serious} (${((serious / Math.max(injuries, 1)) * 100).toFixed(0)}%) · avg out ${(roundsOut / Math.max(serious, 1)).toFixed(1)} rounds`,
  );
  console.log(`  economy: fouls ${(fouls / matches).toFixed(2)}/match · goals ${(goals / matches).toFixed(2)}/match`);
}
