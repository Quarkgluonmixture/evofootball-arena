// Probe: the conceded-goals anchor λ sweep (Phase 95, pre-authorized
// fallback A). One world, 24 gens per λ — pick the LEAST λ whose late-gen
// goals curve stabilizes (≤~3.8 and not rising). Absolute term: see
// FITNESS_ANCHOR in evolution/fitness.ts.
//   npx tsx scripts/probes/anchor-sweep.ts <lambda> [seed] [gens]
import { FITNESS_ANCHOR } from '../../src/evolution/fitness';
import { League } from '../../src/sim/League';

const LAMBDA = Number(process.argv[2]);
const SEED = Number(process.argv[3] ?? 424242);
const GENS = Number(process.argv[4] ?? 24);
if (!Number.isFinite(LAMBDA)) throw new Error('usage: anchor-sweep.ts <lambda> [seed] [gens]');
FITNESS_ANCHOR.conceded = LAMBDA;

const league = new League({ seed: SEED });
const curve: number[] = [];
for (let g = 0; g < GENS; g++) {
  let goals = 0;
  let matches = 0;
  while (!league.seasonDone) {
    const fx = league.nextFixture()!;
    const res = league.createMatch(fx).runToCompletion();
    goals += res.score[0] + res.score[1];
    matches++;
    league.applyResult(fx, res);
  }
  league.finishSeason();
  curve.push(goals / matches);
}
const gene = (k: string): number => {
  let s = 0;
  for (const f of league.franchises) s += (f.coach.genome as unknown as Record<string, number>)[k] ?? 0.5;
  return s / league.franchises.length;
};
const attr = (k: string): number => {
  let s = 0;
  let n = 0;
  for (const f of league.franchises) for (const q of f.squad) { s += (q as unknown as Record<string, number>)[k]; n++; }
  return s / n;
};
const mean = (xs: number[]): number => xs.reduce((a, b) => a + b, 0) / xs.length;
const fmt = (xs: number[]): string => xs.map((v) => v.toFixed(2)).join(' ');
console.log(`λ=${LAMBDA} world ${SEED}: early [${fmt(curve.slice(0, 6))}] … late [${fmt(curve.slice(-6))}]`);
console.log(
  `  early mean ${mean(curve.slice(0, 6)).toFixed(2)} → late mean ${mean(curve.slice(-6)).toFixed(2)} | ` +
  `slope(last6) ${(curve[curve.length - 1] - curve[curve.length - 6]).toFixed(2)} | ` +
  `def ${attr('defending').toFixed(2)} jockey ${gene('jockeyBias').toFixed(2)} cover ${gene('coverBias').toFixed(2)} press ${gene('pressIntensity').toFixed(2)}`,
);
