import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { clampPolicy, crossoverPolicy, mutatePolicy } from '../src/ai/policy';
import { buildWildcardTeamInfo } from '../src/ai/wildcard';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DEFAULT_POLICY, type PolicyParams, type TeamInfo } from '../src/sim/types';
import { Rng, hashSeed } from '../src/utils/rng';

/**
 * Wildcard trainer: (μ+λ) evolution strategy over the PlayerBrain's utility
 * weights, evaluated by playing real matches against a panel of teams from an
 * EVOLVED league. Fully deterministic for a given config — every match seed
 * is hashed from (trainSeed, generation, candidate, matchIndex).
 *
 *   npx tsx scripts/train-wildcard.ts [generations] [population] [panelSize]
 *
 * Writes the champion to src/ai/wildcardPolicy.ts and prints a held-out
 * benchmark (train panel comes from league seed A, eval panel from seed B).
 */

const GENERATIONS = Number(process.argv[2] ?? 15);
const POP = Number(process.argv[3] ?? 16);
const PANEL = Number(process.argv[4] ?? 4);
const ELITE = 4;
const TRAIN_SEED = 0x57c4;
const MATCH_DURATION = 120; // half-length matches: 2× throughput, same football

/** Mature opponents: evolve a league for 8 seasons, take the top of D1. */
function buildPanel(leagueSeed: number, size: number): TeamInfo[] {
  const league = new League({ seed: leagueSeed, matchDuration: MATCH_DURATION });
  for (let s = 0; s < 8; s++) {
    while (!league.seasonDone) {
      const f = league.nextFixture()!;
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
    league.finishSeason();
  }
  return league.standings(0).slice(0, size).map((r) => league.teamInfo(r.slot));
}

/** Points (3/1/0) + goal-difference tiebreak across home/away vs the panel. */
function evaluate(policy: PolicyParams | undefined, panel: TeamInfo[], gen: number, cand: number): number {
  const wildcard = buildWildcardTeamInfo(policy);
  let pts = 0;
  let gd = 0;
  let idx = 0;
  for (const opp of panel) {
    for (const home of [true, false]) {
      const seed = hashSeed(TRAIN_SEED, gen, cand, idx++);
      const m = new Match({
        seed,
        teamA: home ? wildcard : opp,
        teamB: home ? opp : wildcard,
        duration: MATCH_DURATION,
      });
      const r = m.runToCompletion();
      const [wc, other] = home ? [r.score[0], r.score[1]] : [r.score[1], r.score[0]];
      pts += wc > other ? 3 : wc === other ? 1 : 0;
      gd += wc - other;
    }
  }
  return pts + gd * 0.01; // GD breaks ties, never outranks a point
}

const t0 = performance.now();
console.log(`Wildcard ES: pop ${POP} (elite ${ELITE}), ${GENERATIONS} generations, panel ${PANEL}×2 matches/eval\n`);

// Three train panels from different league histories, rotated per generation:
// a policy only survives if it beats opponents it did NOT just overfit to.
const panels = [9001, 9002, 9003].map((seed) => buildPanel(seed, PANEL));
panels.forEach((p, i) => console.log(`train panel ${i} (league ${[9001, 9002, 9003][i]}): ${p.map((t) => t.name).join(', ')}`));

const rng = new Rng(hashSeed(TRAIN_SEED, 0xe5));
let pop: PolicyParams[] = [clampPolicy({ ...DEFAULT_POLICY })];
while (pop.length < POP) pop.push(mutatePolicy(DEFAULT_POLICY, rng, 0.12));

let best: { policy: PolicyParams; fitness: number } | null = null;
for (let gen = 1; gen <= GENERATIONS; gen++) {
  const panel = panels[gen % panels.length];
  const scored = pop
    .map((policy, i) => ({ policy, fitness: evaluate(policy, panel, gen, i) }))
    .sort((a, b) => b.fitness - a.fitness);
  // "Best" is judged across ALL train panels, not the round's — anti-overfit.
  const genBestAll = panels.reduce((a, pn, pi) => a + evaluate(scored[0].policy, pn, 0xa0 + gen, pi), 0);
  if (!best || genBestAll > best.fitness) best = { policy: scored[0].policy, fitness: genBestAll };
  const elites = scored.slice(0, ELITE);
  console.log(
    `gen ${String(gen).padStart(2)}: panel ${gen % panels.length} best ${scored[0].fitness.toFixed(2)}/${PANEL * 6} ` +
    `· all-panels ${genBestAll.toFixed(2)}/${PANEL * 18} · mean ${(scored.reduce((a, x) => a + x.fitness, 0) / POP).toFixed(2)}`,
  );
  pop = elites.map((e) => e.policy);
  while (pop.length < POP) {
    const a = elites[rng.int(0, ELITE - 1)].policy;
    const b = elites[rng.int(0, ELITE - 1)].policy;
    pop.push(mutatePolicy(crossoverPolicy(a, b, rng), rng, 0.06));
  }
}

// Held-out benchmark: a league the trainer never saw.
const evalPanel = buildPanel(4242, 8);
const report = (label: string, policy: PolicyParams | undefined): number => {
  const score = evaluate(policy, evalPanel, 0xbe, label === 'wildcard' ? 1 : 0);
  const pts = Math.round(score);
  console.log(`  ${label.padEnd(16)} ${pts}/${evalPanel.length * 6} pts vs held-out top-8`);
  return pts;
};
console.log('\nheld-out benchmark (league 4242, 8 seasons, top 8, home+away):');
const basePts = report('default policy', undefined);
const wildPts = report('wildcard', best!.policy);

const file = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'ai', 'wildcardPolicy.ts');
writeFileSync(
  file,
  `import type { PolicyParams } from '../sim/types';

/**
 * GENERATED by scripts/train-wildcard.ts — do not hand-edit.
 * (μ+λ) ES over PlayerBrain utility weights; genes/squad neutral (0.5).
 * Train: seed ${TRAIN_SEED}, pop ${POP}, ${GENERATIONS} gens, panel league 9001.
 * Held-out (league 4242 top-8, home+away): wildcard ${wildPts}/48 pts vs default ${basePts}/48.
 */
export const WILDCARD_POLICY: PolicyParams = ${JSON.stringify(best!.policy, null, 2)};
`,
);
console.log(`\nchampion fitness ${best!.fitness.toFixed(2)} → src/ai/wildcardPolicy.ts`);
console.log(`done in ${((performance.now() - t0) / 1000).toFixed(1)}s`);
