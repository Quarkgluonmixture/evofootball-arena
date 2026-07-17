// Probe: the formation LIBRARY under selection (Phase 67, N5). The novel
// shapes (twin-st, false-nine) enter only through the rare style mutation
// at ×0.35 weight — this measures, per world, whether they (a) get TRIED
// at all, (b) sometimes PERSIST on results, and (c) never RUN AWAY into a
// structural monoculture (the zonal lesson / failure mode 21 gate).
// Also watches the def menu (the phase-64/41.2 low-32 skew).
//   npx tsx scripts/probes/shape-emergence.ts [gens]
import { League } from '../../src/sim/League';

const GENS = Number(process.argv[2] ?? 60);

for (const seed of [424242, 991]) {
  const league = new League({ seed });
  const shareRows: string[] = [];
  const count = (): Record<string, number> => {
    const atk: Record<string, number> = {};
    for (const f of league.franchises) {
      atk[f.coach.style.formationAtk] = (atk[f.coach.style.formationAtk] ?? 0) + 1;
    }
    return atk;
  };
  let novelTried = 0; // generations where a novel shape held ≥1 club
  let novelPeak = 0;
  const defCount = (): Record<string, number> => {
    const def: Record<string, number> = {};
    for (const f of league.franchises) {
      def[f.coach.style.formationDef] = (def[f.coach.style.formationDef] ?? 0) + 1;
    }
    return def;
  };
  for (let g = 0; g <= GENS; g++) {
    const atk = count();
    const novel = (atk['twin-st'] ?? 0) + (atk['false-nine'] ?? 0);
    if (novel > 0) novelTried++;
    if (novel > novelPeak) novelPeak = novel;
    if (g % 10 === 0 || g === GENS) {
      const def = defCount();
      shareRows.push(
        `gen ${String(g).padStart(2)}: wide ${atk['wide-212'] ?? 0} narrow ${atk['narrow-122'] ?? 0} ` +
        `twin ${atk['twin-st'] ?? 0} false9 ${atk['false-nine'] ?? 0} | ` +
        `def low ${def['low-32'] ?? 0} press ${def['press-23'] ?? 0} mid41 ${def['mid-41'] ?? 0} hiline ${def['high-line'] ?? 0}`,
      );
    }
    if (g < GENS) {
      while (!league.seasonDone) {
        const fx = league.nextFixture()!;
        league.applyResult(fx, league.createMatch(fx).runToCompletion());
      }
      league.finishSeason();
    }
  }
  console.log(`world ${seed}: novel shapes present in ${novelTried}/${GENS + 1} generations, peak ${novelPeak}/16 clubs`);
  for (const r of shareRows) console.log(`  ${r}`);
}
