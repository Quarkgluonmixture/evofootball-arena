import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { candidateFrom, crossoverCandidate, mutateCandidate, type WildcardCandidate } from '../src/ai/policy';
import { buildWildcardTeamInfo, neutralGenome } from '../src/ai/wildcard';
import { WILDCARD as PREV_CHAMPION } from '../src/ai/wildcardPolicy';
import { describeIdentity } from '../src/evolution/genome';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DEFAULT_POLICY, type TeamInfo } from '../src/sim/types';
import { Rng, hashSeed } from '../src/utils/rng';

/**
 * Wildcard trainer (Phase 23 co-training): (μ+λ) evolution strategy over the
 * full WildcardCandidate — 14 tactical genes PLUS five per-role PlayerBrain
 * weight vectors ([GK, DF, MF, WG, ST]) — evaluated by playing real matches
 * against panels of teams from EVOLVED leagues. Squad DNA stays pinned
 * neutral: the experiment measures learned decision-making, not physique.
 * Fully deterministic for a given config — every match seed is hashed from
 * (trainSeed, generation, candidate, matchIndex). The previous champion
 * (src/ai/wildcardPolicy.ts) warm-starts the population, so successive runs
 * keep climbing instead of restarting.
 *
 *   npx tsx scripts/train-wildcard.ts [generations] [population] [panelSize]
 *
 * Writes the champion to src/ai/wildcardPolicy.ts and prints a held-out
 * benchmark (train panels come from league seeds 9001–9003, eval from 4242).
 */

const GENERATIONS = Number(process.argv[2] ?? 24);
const POP = Number(process.argv[3] ?? 18);
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
function evaluate(candidate: WildcardCandidate | undefined, panel: TeamInfo[], gen: number, cand: number): number {
  const wildcard = buildWildcardTeamInfo(candidate);
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
console.log(
  `Wildcard co-training ES: genes + 5 role vectors · pop ${POP} (elite ${ELITE}), ` +
  `${GENERATIONS} generations, panel ${PANEL}×2 matches/eval\n`,
);

// Three train panels from different league histories, rotated per generation:
// a candidate only survives if it beats opponents it did NOT just overfit to.
const panels = [9001, 9002, 9003].map((seed) => buildPanel(seed, PANEL));
panels.forEach((p, i) => console.log(`train panel ${i} (league ${[9001, 9002, 9003][i]}): ${p.map((t) => t.name).join(', ')}`));

const rng = new Rng(hashSeed(TRAIN_SEED, 0xe5));
const base = candidateFrom(neutralGenome(), DEFAULT_POLICY);
let pop: WildcardCandidate[] = [base, PREV_CHAMPION];
while (pop.length < POP) pop.push(mutateCandidate(pop.length % 2 ? PREV_CHAMPION : base, rng, 0.12));

let best: { candidate: WildcardCandidate; fitness: number } | null = null;
for (let gen = 1; gen <= GENERATIONS; gen++) {
  const panel = panels[gen % panels.length];
  const scored = pop
    .map((candidate, i) => ({ candidate, fitness: evaluate(candidate, panel, gen, i) }))
    .sort((a, b) => b.fitness - a.fitness);
  // "Best" is judged across ALL train panels, not the round's — anti-overfit.
  const genBestAll = panels.reduce((a, pn, pi) => a + evaluate(scored[0].candidate, pn, 0xa0 + gen, pi), 0);
  if (!best || genBestAll > best.fitness) best = { candidate: scored[0].candidate, fitness: genBestAll };
  const elites = scored.slice(0, ELITE);
  console.log(
    `gen ${String(gen).padStart(2)}: panel ${gen % panels.length} best ${scored[0].fitness.toFixed(2)}/${PANEL * 6} ` +
    `· all-panels ${genBestAll.toFixed(2)}/${PANEL * 18} · mean ${(scored.reduce((a, x) => a + x.fitness, 0) / POP).toFixed(2)}`,
  );
  pop = elites.map((e) => e.candidate);
  while (pop.length < POP) {
    const a = elites[rng.int(0, ELITE - 1)].candidate;
    const b = elites[rng.int(0, ELITE - 1)].candidate;
    pop.push(mutateCandidate(crossoverCandidate(a, b, rng), rng, 0.06));
  }
}

// Held-out benchmark: a league the trainer never saw.
const evalPanel = buildPanel(4242, 8);
const report = (label: string, candidate: WildcardCandidate | undefined, idx: number): number => {
  const pts = Math.round(evaluate(candidate, evalPanel, 0xbe, idx));
  console.log(`  ${label.padEnd(18)} ${pts}/${evalPanel.length * 6} pts vs held-out top-8`);
  return pts;
};
console.log('\nheld-out benchmark (league 4242, 8 seasons, top 8, home+away):');
const basePts = report('default brain', undefined, 0);
const prevPts = report('previous champion', PREV_CHAMPION, 1);
const coPts = report('co-trained', best!.candidate, 2);

const file = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'ai', 'wildcardPolicy.ts');
writeFileSync(
  file,
  `import type { WildcardCandidate } from './policy';

/**
 * GENERATED by scripts/train-wildcard.ts — do not hand-edit.
 * Phase 23 co-training: (μ+λ) ES over 14 tactical genes + five per-role
 * PlayerBrain weight vectors (squad pinned neutral 0.5).
 * Train: seed ${TRAIN_SEED}, pop ${POP} (elite ${ELITE}), ${GENERATIONS} gens, panels 9001/9002/9003 rotated.
 * Held-out (league 4242 top-8, home+away): co-trained ${coPts}/48 · previous ${prevPts}/48 · default ${basePts}/48.
 * Learned identity: ${describeIdentity(best!.candidate.genome).join(', ')}.
 */
export const WILDCARD: WildcardCandidate = ${JSON.stringify(best!.candidate, null, 2)};
`,
);
console.log(`\nchampion fitness ${best!.fitness.toFixed(2)} · identity: ${describeIdentity(best!.candidate.genome).join(', ')}`);
console.log(`→ src/ai/wildcardPolicy.ts · done in ${((performance.now() - t0) / 1000).toFixed(1)}s`);
