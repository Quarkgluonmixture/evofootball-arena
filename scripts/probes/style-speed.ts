// How FAST does visible style diversity emerge on a fresh save (Phase 50)?
// The user's requirement is fast + visible divergence — this is its measuring
// stick. Tracks per generation: population style SPREAD (styleSpace metric,
// 0 = monoculture) and NAMEPLATE DIVERSITY (distinct non-Balanced fragments
// worn across the league — what a player actually SEES). Summary: first
// generation where spread ≥ 0.06 / 0.08 sustained for 2 gens.
//   npx tsx scripts/probes/style-speed.ts [gens] [seed]
import { League } from '../../src/sim/League';
import { dimStats, nameplates, styleSpread, styleValues } from '../../src/evolution/styleSpace';

const GENS = Number(process.argv[2] ?? 20);
const SEED = Number(process.argv[3] ?? 424242);
const league = new League({ seed: SEED });

const measure = (): { spread: number; plates: number } => {
  const srcs = league.franchises.map((f) => ({ genome: f.genome, policy: f.policy }));
  const spread = styleSpread(dimStats(srcs.map(styleValues)));
  const worn = new Set<string>();
  for (const plate of nameplates(srcs)) for (const w of plate) if (w !== 'Balanced') worn.add(w);
  return { spread, plates: worn.size };
};

const spreads: number[] = [];
console.log(`seed ${SEED}, ${GENS} gens — spread (0=monoculture) + distinct nameplate fragments`);
console.log('gen | spread | fragments');
for (let g = 0; g <= GENS; g++) {
  const m = measure();
  spreads.push(m.spread);
  console.log(`${String(g).padStart(3)} | ${m.spread.toFixed(3)}  | ${m.plates}`);
  if (g < GENS) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    }
    league.finishSeason();
  }
}
const firstSustained = (bar: number): number => {
  for (let i = 0; i + 1 < spreads.length; i++) {
    if (spreads[i] >= bar && spreads[i + 1] >= bar) return i;
  }
  return -1;
};
console.log(`gens to spread≥0.06 (sustained): ${firstSustained(0.06)}`);
console.log(`gens to spread≥0.08 (sustained): ${firstSustained(0.08)}`);
