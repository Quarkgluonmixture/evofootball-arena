// Does decision STYLE emerge (Phase 42)? Every franchise is BORN at the shared
// DEFAULT_POLICY, so at gen 0 the cross-franchise spread of every attacking-
// style gene is exactly 0. This tracks that spread (population std dev, shown as
// a % of each gene's default) over generations. Rising / persistent spread =
// distinct styles evolved (direct vs patient, shoot-happy vs build-up, …); a
// spread stuck near 0 = the substrate doesn't reward divergence (DEFAULT is a
// sharp optimum) and they all stay put.
//   npx tsx scripts/probes/policy-emergence.ts [gens] [seed]
import { League } from '../../src/sim/League';
import { POLICY_GENE_KEYS, defaultPolicyGenes, policyGeneStd, type PolicyGeneKey } from '../../src/evolution/policyGenome';

const GENS = Number(process.argv[2] ?? 50);
const SEED = Number(process.argv[3] ?? 424242);
const league = new League({ seed: SEED });
const def = defaultPolicyGenes();

const pct = (std: Record<PolicyGeneKey, number>, k: PolicyGeneKey): string =>
  `${((100 * std[k]) / def[k]).toFixed(0)}%`;

const row = (g: number): void => {
  const std = policyGeneStd(league.franchises.map((f) => f.policy));
  const avg = (POLICY_GENE_KEYS.reduce((s, k) => s + std[k] / def[k], 0) / POLICY_GENE_KEYS.length) * 100;
  console.log(
    `${String(g).padStart(3)} | shoot ${pct(std, 'shootBase')} dribble ${pct(std, 'dribbleBase')} ` +
    `fwd ${pct(std, 'passFwdBase')} through ${pct(std, 'throughBase')} cross ${pct(std, 'crossBase')} ` +
    `long ${pct(std, 'longShotW')} | avg ${avg.toFixed(0)}%`,
  );
};

console.log(`seed ${SEED}, ${GENS} gens — cross-franchise attacking-style spread (std as % of DEFAULT)`);
console.log('gen | per-gene std | avg');
for (let g = 0; g <= GENS; g++) {
  if (g % 5 === 0 || g === GENS) row(g);
  if (g < GENS) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    }
    league.finishSeason();
  }
}
