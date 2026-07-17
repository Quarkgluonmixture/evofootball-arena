// Probe: do goals/match WARM as ecologies evolve? (Phase 82 — the lead
// surfaced by phase-81's ③: the same seeds read ~2.5 over 4 seasons but
// ~3.3 over 8.) Plays N generations per world and prints the per-season
// goals/match curve. Observation only.
//   npx tsx scripts/probes/goals-warming.ts [gens]
import { League } from '../../src/sim/League';

const GENS = Number(process.argv[2] ?? 24);

for (const seed of [424242, 991, 777]) {
  const league = new League({ seed });
  const curve: number[] = [];
  for (let g = 0; g < GENS; g++) {
    let goals = 0;
    let matches = 0;
    let shots = 0;
    let xg = 0;
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      const res = league.createMatch(fx).runToCompletion();
      goals += res.score[0] + res.score[1];
      shots += res.stats[0].shots + res.stats[1].shots;
      xg += res.stats[0].xg + res.stats[1].xg;
      matches++;
      league.applyResult(fx, res);
    }
    league.finishSeason();
    curve.push(goals / matches);
    if (g < 3 || g >= GENS - 3) {
      console.log(
        `  s${String(g + 1).padStart(2)}: goals ${(goals / matches).toFixed(2)} ` +
        `shots ${(shots / matches).toFixed(1)} xg/shot ${(xg / shots).toFixed(3)} ` +
        `conv ${(goals / shots * 100).toFixed(1)}% overperf ${(goals / xg).toFixed(2)}x`,
      );
    }
    if (g === 0 || g === Math.floor(GENS / 2) || g === GENS - 1) {
      // Diagnosis: where does the inflation live — attributes or genes?
      const attr = (k: string): number => {
        let s0 = 0;
        let n = 0;
        for (const f of league.franchises) for (const q of f.squad) { s0 += (q as unknown as Record<string, number>)[k]; n++; }
        return s0 / n;
      };
      const gene = (k: string): number => {
        let s0 = 0;
        for (const f of league.franchises) s0 += (f.coach.genome as unknown as Record<string, number>)[k] ?? 0.5;
        return s0 / league.franchises.length;
      };
      console.log(
        `  [gen ${g}] fin ${attr('finishing').toFixed(2)} pace ${attr('pace').toFixed(2)} ` +
        `def ${attr('defending').toFixed(2)} refl ${attr('reflexes').toFixed(2)} str ${attr('strength').toFixed(2)} | ` +
        `shootB ${gene('shootBias').toFixed(2)} press ${gene('pressIntensity').toFixed(2)} width ${gene('attackingWidth').toFixed(2)} jockey ${gene('jockeyBias').toFixed(2)} cover ${gene('coverBias').toFixed(2)}`,
      );
    }
  }
  const fmt = (xs: number[]): string => xs.map((v) => v.toFixed(2)).join(' ');
  const early = curve.slice(0, 6);
  const late = curve.slice(-6);
  const mean = (xs: number[]): number => xs.reduce((a, b) => a + b, 0) / xs.length;
  console.log(`world ${seed}: seasons 1-6 [${fmt(early)}] … last 6 [${fmt(late)}]`);
  console.log(`  early mean ${mean(early).toFixed(2)} → late mean ${mean(late).toFixed(2)} (Δ ${(mean(late) - mean(early)).toFixed(2)})`);
}
