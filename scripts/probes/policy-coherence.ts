// Do coherent TEAM IDENTITIES emerge (does a club's defence relate to its
// attack)? The policy + tactical genes mutate/crossover INDEPENDENTLY, so any
// cross-gene correlation across evolved franchises is created purely by
// SELECTION — coherent styles (e.g. press + play-direct = gegenpress) winning
// and reproducing together. r≈0 everywhere = styles are independent scatter (a
// substrate/selection lever, NOT something to hand-wire). Run after evolving.
//   npx tsx scripts/probes/policy-coherence.ts [gens] [seed]
import { League } from '../../src/sim/League';

const GENS = Number(process.argv[2] ?? 40);
const SEED = Number(process.argv[3] ?? 424242);
const league = new League({ seed: SEED });

const pearson = (xs: number[], ys: number[]): number => {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { const dx = xs[i] - mx, dy = ys[i] - my; sxy += dx * dy; sxx += dx * dx; syy += dy * dy; }
  const d = Math.sqrt(sxx * syy);
  return d < 1e-9 ? 0 : sxy / d;
};

for (let g = 0; g < GENS; g++) {
  while (!league.seasonDone) {
    const fx = league.nextFixture()!;
    league.applyResult(fx, league.createMatch(fx).runToCompletion());
  }
  league.finishSeason();
}

const F = league.franchises;
const pol = (k: string): number[] => F.map((f) => (f.coach.policy as unknown as Record<string, number>)[k]);
const gene = (k: string): number[] => F.map((f) => (f.coach.genome as unknown as Record<string, number>)[k]);

const pairs: Array<[string, number[], number[]]> = [
  ['pressGene ↔ chase  (does a pressing gene co-select a chasing policy?)', gene('pressIntensity'), pol('chaseBase')],
  ['dribbleGene ↔ dribblePolicy (dribble identity coheres?)', gene('dribbleBias'), pol('dribbleBase')],
  ['chase ↔ fwdPass   (press → play direct = gegenpress?)', pol('chaseBase'), pol('passFwdBase')],
  ['width ↔ cross     (wide → crossing?)', gene('attackingWidth'), pol('crossBase')],
  ['counter ↔ fwdPass (counter-attack → direct?)', gene('counterAttackBias'), pol('passFwdBase')],
  ['shoot ↔ longShot  (shoot-happy identity?)', pol('shootBase'), pol('longShotW')],
  ['passBase ↔ dribble(build via pass vs via carry?)', pol('passBase'), pol('dribbleBase')],
  ['mark ↔ intercept  (defensive method coheres?)', pol('markBase'), pol('interceptScore')],
];

console.log(`seed ${SEED}, after ${GENS} gens — cross-franchise gene correlation r (over ${F.length} clubs)`);
console.log('(|r|>~0.4 = a coherent identity emerged by selection; ~0 = independent scatter)');
for (const [label, xs, ys] of pairs) {
  console.log(`  r=${pearson(xs, ys).toFixed(2).padStart(5)}  ${label}`);
}
