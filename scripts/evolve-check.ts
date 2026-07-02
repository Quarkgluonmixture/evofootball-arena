/**
 * Long-run evolution sanity check: 10 headless seasons. Prints champions,
 * tactical identities and Elo spread so you can see whether the ecosystem
 * develops distinct, drifting identities. Run with: npx tsx scripts/evolve-check.ts
 */
import { describeIdentity } from '../src/evolution/genome';
import { squadSummary } from '../src/evolution/playerGenome';
import { League } from '../src/sim/League';

const league = new League({ seed: 424242 });

const t0 = performance.now();
for (let s = 0; s < 10; s++) {
  while (!league.seasonDone) {
    const f = league.nextFixture()!;
    league.applyResult(f, league.createMatch(f).runToCompletion());
  }
  const rec = league.finishSeason();
  const reborn = rec.evolution.entries.filter((e) => e.kind === 'reborn').length;
  console.log(
    `gen ${String(rec.generation).padStart(2)} champion: ${rec.championName.padEnd(18)} ` +
    `(pts ${rec.table[0].pts}, gd ${rec.table[0].gf - rec.table[0].ga}) reborn: ${reborn}`,
  );
}
console.log(`\n10 seasons in ${((performance.now() - t0) / 1000).toFixed(1)}s\n`);

console.log('Final population:');
for (const f of [...league.franchises].sort((a, b) => b.elo - a.elo)) {
  const gens = f.lineage.filter((l) => l.event === 'elite').length;
  const s = squadSummary(f.squad);
  const attrs = `pace ${s.pace.toFixed(2)} tec ${s.technique.toFixed(2)} fin ${s.finishing.toFixed(2)} def ${s.defending.toFixed(2)} ref ${s.reflexes.toFixed(2)}`;
  console.log(
    `  ${f.name.padEnd(18)} elo ${String(Math.round(f.elo)).padStart(4)}  ` +
    `elite×${gens}  [${describeIdentity(f.genome).join(', ')}]\n` +
    `  ${''.padEnd(18)} squad: ${attrs}`,
  );
}
