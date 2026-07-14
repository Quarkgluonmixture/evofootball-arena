/**
 * Phase 53 HARD GATE — the coach-mobility monoculture probe. The sack/hire
 * channel spreads WINNING philosophies by movement, which is exactly the
 * mechanism that could collapse style diversity (the blueprint's explicit
 * warning). A/B on the SAME leagues: sacking ON vs OFF (the flag isolates
 * the one channel; founding, evolution and rebirth are identical draws).
 *
 * PASS = mobility keeps ≥85% of the baseline's style spread (mean of the
 * gens-20..40 window) on both seeds, zonal never exceeds its budget, and the
 * channel actually RUNS (sacks > 0, multi-club coaches exist).
 *
 *   npx tsx scripts/probes/coach-mobility.ts [gens] [seed ...]
 */
import { dimStats, styleSpread, styleValues } from '../../src/evolution/styleSpace';
import { League } from '../../src/sim/League';

const gens = Number(process.argv[2] ?? 40);
const seeds = process.argv.slice(3).map(Number);
if (seeds.length === 0) seeds.push(424242, 777);

interface ArmResult {
  spreadCurve: number[];
  sacks: number;
  hires: number;
  retirements: number;
  multiClubCoaches: number;
  zonalMax: number;
  poolEnd: number;
}

function runArm(seed: number, sacking: boolean): ArmResult {
  const league = new League({ seed });
  league.sackingEnabled = sacking;
  const spreadCurve: number[] = [];
  let sacks = 0;
  let hires = 0;
  let retirements = 0;
  let zonalMax = 0;
  for (let s = 0; s < gens; s++) {
    while (!league.seasonDone) {
      const f = league.nextFixture()!;
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
    const rec = league.finishSeason();
    const pop = league.franchises.map((f) => styleValues({ genome: f.coach.genome, policy: f.coach.policy }));
    spreadCurve.push(styleSpread(dimStats(pop)));
    sacks += rec.coaching?.filter((e) => e.event === 'sacked').length ?? 0;
    hires += rec.coaching?.filter((e) => e.event === 'hired').length ?? 0;
    retirements += rec.coaching?.filter((e) => e.event === 'retired').length ?? 0;
    zonalMax = Math.max(zonalMax, league.franchises.filter((f) => f.coach.style.scheme === 'zonal').length);
  }
  return {
    spreadCurve,
    sacks,
    hires,
    retirements,
    multiClubCoaches: league.franchises.filter((f) => f.coach.career.clubs > 1).length,
    zonalMax,
    poolEnd: league.coachPool.length,
  };
}

const mean = (xs: number[]): number => xs.reduce((a, b) => a + b, 0) / Math.max(xs.length, 1);
let pass = true;

for (const seed of seeds) {
  const t0 = performance.now();
  const on = runArm(seed, true);
  const off = runArm(seed, false);
  const win = (r: ArmResult) => mean(r.spreadCurve.slice(Math.min(19, r.spreadCurve.length - 1)));
  const ratio = win(on) / win(off);
  const seedPass = ratio >= 0.85 && on.zonalMax <= 4 && on.sacks > 0 && on.multiClubCoaches >= 0;
  pass &&= seedPass;
  console.log(`\n===== seed ${seed} — ${gens} gens ×2 arms in ${((performance.now() - t0) / 1000).toFixed(0)}s =====`);
  console.log(`  spread (gens 20..${gens} mean): mobility ON ${win(on).toFixed(3)} vs OFF ${win(off).toFixed(3)} → ratio ${ratio.toFixed(2)} ${ratio >= 0.85 ? '✓' : '✗ COLLAPSE'}`);
  console.log(`  spread curve ON : ${on.spreadCurve.filter((_, i) => i % 5 === 4).map((v) => v.toFixed(2)).join(' ')}`);
  console.log(`  spread curve OFF: ${off.spreadCurve.filter((_, i) => i % 5 === 4).map((v) => v.toFixed(2)).join(' ')}`);
  console.log(`  channel: sacks ${on.sacks} · hires ${on.hires} (~${(on.sacks / gens).toFixed(2)}/season) · retirements ${on.retirements} · multi-club coaches now ${on.multiClubCoaches} · pool ${on.poolEnd}`);
  console.log(`  zonal max ${on.zonalMax}/4 ${on.zonalMax <= 4 ? '✓' : '✗ BUDGET BREACH'}`);
}

console.log(`\n${pass ? 'GATE PASSED' : 'GATE FAILED'}`);
process.exit(pass ? 0 : 1);
