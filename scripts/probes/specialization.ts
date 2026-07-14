// Does the RESOURCE BUDGET force specialisation (Phase 48)? Without a cap,
// evolution maxes every attribute and archetypes stay faint. Tracks:
//   total    league-mean squad total (must PLATEAU at SQUAD_BUDGET, not inflate)
//   spec     within-player attr std, league mean (specialists ↑: points piled
//            into few attrs instead of spread evenly)
//   starGap  within-squad player-total spread (star-plus-role-players vs a
//            balanced six — an evolvable axis the budget creates)
//   clubStd  cross-club std of WG dribbling (clubs DISAGREEING about what
//            their winger is worth = emergent identity)
//   npx tsx scripts/probes/specialization.ts [gens] [seed]
import { League } from '../../src/sim/League';
import { ATTR_KEYS, SQUAD_BUDGET, squadTotal } from '../../src/evolution/playerGenome';
import { SQUAD_ROLES } from '../../src/evolution/playerGenome';

const GENS = Number(process.argv[2] ?? 40);
const SEED = Number(process.argv[3] ?? 424242);
const league = new League({ seed: SEED });

const stats = (): { total: number; spec: number; starGap: number; clubStd: number } => {
  let totalSum = 0;
  let specSum = 0, specN = 0;
  let gapSum = 0;
  const wgDrb: number[] = [];
  for (const f of league.franchises) {
    totalSum += squadTotal(f.squad);
    const pTotals: number[] = [];
    let wg = 0, wgN = 0;
    for (let i = 0; i < f.squad.length; i++) {
      const p = f.squad[i];
      const vals = ATTR_KEYS.map((k) => p[k]);
      const m = vals.reduce((a, b) => a + b, 0) / vals.length;
      specSum += Math.sqrt(vals.reduce((a, b) => a + (b - m) ** 2, 0) / vals.length);
      specN++;
      pTotals.push(vals.reduce((a, b) => a + b, 0));
      if (SQUAD_ROLES[i] === 'WG') { wg += p.dribbling; wgN++; }
    }
    const pm = pTotals.reduce((a, b) => a + b, 0) / pTotals.length;
    gapSum += Math.sqrt(pTotals.reduce((a, b) => a + (b - pm) ** 2, 0) / pTotals.length);
    wgDrb.push(wg / Math.max(wgN, 1));
  }
  const n = league.franchises.length;
  const wm = wgDrb.reduce((a, b) => a + b, 0) / n;
  return {
    total: totalSum / n,
    spec: specSum / specN,
    starGap: gapSum / n,
    clubStd: Math.sqrt(wgDrb.reduce((a, b) => a + (b - wm) ** 2, 0) / n),
  };
};

console.log(`seed ${SEED}, ${GENS} gens — budget cap ${SQUAD_BUDGET}`);
console.log('gen | total (cap) | spec | starGap | WGdrb clubStd');
for (let g = 0; g <= GENS; g++) {
  if (g % 5 === 0 || g === GENS) {
    const s = stats();
    console.log(
      `${String(g).padStart(3)} | ${s.total.toFixed(1)}       | ${s.spec.toFixed(3)} | ${s.starGap.toFixed(2)}    | ${s.clubStd.toFixed(3)}`,
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
