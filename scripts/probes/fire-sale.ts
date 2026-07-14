/**
 * Phase 55 probe — the fire-sale's ecology. The channel must actually FLOW
 * (signings happen), stay honest (no budget violations, ever), and feed the
 * REBUILDING rather than the rich (headroom = the leaver's value at the cap,
 * so mature squads mostly can't buy upgrades — measure who signs).
 *
 *   npx tsx scripts/probes/fire-sale.ts [gens] [seed ...]
 */
import { SQUAD_BUDGET, squadTotal } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';

const gens = Number(process.argv[2] ?? 30);
const seeds = process.argv.slice(3).map(Number);
if (seeds.length === 0) seeds.push(424242, 777);

for (const seed of seeds) {
  const league = new League({ seed });
  const t0 = performance.now();
  let signings = 0;
  const perWindow: number[] = [];
  let windowCount = 0;
  let d2Signings = 0;
  let violations = 0;
  let signedAges = 0;
  let bestContinuedCareer = { name: '', goals: 0 };
  for (let s = 0; s < gens; s++) {
    while (!league.seasonDone) {
      const f = league.nextFixture()!;
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
    const rec = league.finishSeason();
    for (const sg of rec.signings ?? []) {
      signings++;
      windowCount++;
      signedAges += sg.age;
      const club = league.franchises.find((x) => x.name === sg.club);
      if (club?.division === 1) d2Signings++;
    }
    for (const f of league.franchises) {
      if (squadTotal(f.squad) > SQUAD_BUDGET + 1e-6) violations++;
    }
    if ((s + 1) % 10 === 0) {
      perWindow.push(windowCount);
      windowCount = 0;
    }
    // Track the longest career still running through a signing.
    for (const f of league.franchises) {
      f.careers.forEach((c, i) => {
        if (c.seasons >= 2 && c.goals > bestContinuedCareer.goals && (rec.signings ?? []).some(
          (sg) => sg.club === f.name && sg.player === f.playerNames[i])) {
          bestContinuedCareer = { name: `${f.playerNames[i]} (${f.name})`, goals: c.goals };
        }
      });
    }
  }
  console.log(`\n===== seed ${seed} — ${gens} gens in ${((performance.now() - t0) / 1000).toFixed(0)}s =====`);
  console.log(`signings: ${signings} total (~${(signings / gens).toFixed(2)}/season) · per-10-gen windows: ${perWindow.join(' ')}`);
  console.log(`who buys: D2 ${d2Signings}/${signings} (${Math.round((d2Signings / Math.max(signings, 1)) * 100)}%) · mean signing age ${(signedAges / Math.max(signings, 1)).toFixed(1)}`);
  console.log(`budget violations: ${violations} ${violations === 0 ? '✓' : '✗ CAP BREACHED'}`);
  console.log(`pool at the end: ${league.freeAgents.length} agents`);
  if (bestContinuedCareer.name) console.log(`a career that survived its club: ${bestContinuedCareer.name} — ${bestContinuedCareer.goals} career goals`);
}
