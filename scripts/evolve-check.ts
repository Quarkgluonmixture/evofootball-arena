/**
 * Long-run evolution sanity check: 10 headless seasons. Prints champions,
 * tactical identities and Elo spread so you can see whether the ecosystem
 * develops distinct, drifting identities. Run with: npx tsx scripts/evolve-check.ts
 */
import { nameplates } from '../src/evolution/styleSpace';
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

// Formation-identity ecology (Phase 31): styles are franchise DNA now —
// watch for monoculture/extinction the same way gene identities are watched.
const shares = league.history[league.history.length - 1]?.styleShares;
if (shares) {
  const fmt = (r: Record<string, number>): string =>
    Object.entries(r).map(([k, v]) => `${k} ${v}`).join(' · ');
  console.log(`Formation identities: atk [${fmt(shares.atk)}]  def [${fmt(shares.def)}]  marking [${fmt(shares.scheme)}]`);
  const switches = league.franchises.reduce(
    (a, f) => a + f.lineage.filter((l) => l.note?.startsWith('🔧')).length, 0);
  console.log(`Style switches across all lineages: ${switches}\n`);
}

console.log('Final population:');
const sorted = [...league.franchises].sort((a, b) => a.division - b.division || b.elo - a.elo);
const plates = nameplates(sorted.map((f) => ({ genome: f.coach.genome, policy: f.coach.policy })));
for (const [idx, f] of sorted.entries()) {
  const gens = f.lineage.filter((l) => l.event === 'elite').length;
  const moves =
    f.lineage.filter((l) => l.event === 'promoted').length +
    f.lineage.filter((l) => l.event === 'relegated').length;
  const s = squadSummary(f.squad);
  const attrs = `pac ${s.pace.toFixed(2)} pas ${s.passing.toFixed(2)} drb ${s.dribbling.toFixed(2)} fin ${s.finishing.toFixed(2)} def ${s.defending.toFixed(2)} str ${s.strength.toFixed(2)} sta ${s.stamina.toFixed(2)} ref ${s.reflexes.toFixed(2)}`;
  console.log(
    `  D${f.division + 1} ${f.name.padEnd(18)} elo ${String(Math.round(f.elo)).padStart(4)}  ` +
    `elite×${gens} moves×${moves}  [${plates[idx].join(', ')}]\n` +
    `     ${''.padEnd(18)} squad: ${attrs}`,
  );
}
