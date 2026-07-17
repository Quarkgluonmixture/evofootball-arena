// Probe: fitBias under selection (Phase 81 observation for Phase 80, N6).
// Does the board's recruitment-philosophy gene (a) drift off its 0.5-ish
// founder mean, (b) DIVERGE across clubs (two board cultures coexisting),
// and (c) actually move the market (signings per season stay healthy)?
// Observation only — no gates, no sim change.
//   npx tsx scripts/probes/market-fit-anatomy.ts [gens]
import { League } from '../../src/sim/League';

const GENS = Number(process.argv[2] ?? 40);

for (const seed of [424242, 991]) {
  const league = new League({ seed });
  const rows: string[] = [];
  let totalSignings = 0;
  for (let g = 0; g <= GENS; g++) {
    const vals = league.franchises.map((f) => f.coach.genome.fitBias ?? 0.5);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    if (g % 10 === 0 || g === GENS) {
      rows.push(
        `gen ${String(g).padStart(2)}: fitBias mean ${mean.toFixed(2)} ` +
        `spread [${min.toFixed(2)}..${max.toFixed(2)}] | signings so far ${totalSignings}`,
      );
    }
    if (g < GENS) {
      while (!league.seasonDone) {
        const fx = league.nextFixture()!;
        league.applyResult(fx, league.createMatch(fx).runToCompletion());
      }
      league.finishSeason();
      const rec = league.history[league.history.length - 1];
      totalSignings += rec?.signings?.length ?? 0;
    }
  }
  console.log(`world ${seed}:`);
  for (const r of rows) console.log(`  ${r}`);
}
