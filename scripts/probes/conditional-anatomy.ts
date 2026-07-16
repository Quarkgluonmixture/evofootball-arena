/**
 * Probe: CONDITIONAL ANATOMY (Phase 64 — the underdog shift).
 *
 * Two questions, failure-mode-25 order:
 *   1. MECHANISM — does bending toward the bus actually help an outgunned
 *      side? Same weak squad vs the same strong squad (flat 0.42 vs 0.58,
 *      Elo labels 300 apart = full factor), underdogShift 0 / 0.5 / 1.
 *      If the pragmatist doesn't out-point the purist HERE, the gene has
 *      nothing to select for and the shift vector needs work.
 *   2. EXPRESSION — in real league worlds, how big are kickoff Elo gaps
 *      (the factor the gene multiplies), and does selection move the gene?
 *
 *   npx tsx scripts/probes/conditional-anatomy.ts
 */
import { Match } from '../../src/sim/Match';
import type { TacticalGenome } from '../../src/evolution/genome';
import { GENE_KEYS } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';

const neutral = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  g.underdogShift = 0;
  return g;
};
const flatSquad = (v: number): PlayerAttributes[] =>
  Array.from({ length: TEAM_SIZE }, () => {
    const p = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) p[k] = v;
    return p;
  });
const team = (name: string, genome: TacticalGenome, attr: number, elo: number): TeamInfo => ({
  id: name, name, short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
  genome, squad: flatSquad(attr), elo,
  style: { formationAtk: 'narrow-122', formationDef: 'press-23', scheme: 'man' },
});

const MATCHES = 600;
for (const [wAttr, sAttr, gap] of [[0.45, 0.55, 150], [0.42, 0.58, 300]] as const) {
  console.log(`== mechanism: weak (${wAttr}) vs strong (${sAttr}), Elo gap ${gap} ==`);
  for (const gene of [0, 0.5, 1]) {
    const g = neutral();
    g.underdogShift = gene;
    let pts = 0;
    let gf = 0;
    let ga = 0;
    for (let k = 0; k < MATCHES; k++) {
      // Side-balanced: the weak side plays home and away alternately.
      const weakHome = k % 2 === 0;
      const weak = team('WEAK', g, wAttr, 1500 - gap / 2);
      const strong = team('STRONG', neutral(), sAttr, 1500 + gap / 2);
      const m = new Match({
        seed: 640000 + k,
        teamA: weakHome ? weak : strong,
        teamB: weakHome ? strong : weak,
      });
      while (!m.finished) m.step(1 / 60);
      const wIdx = weakHome ? 0 : 1;
      const [ws, ss] = [m.score[wIdx], m.score[1 - wIdx]];
      gf += ws;
      ga += ss;
      pts += ws > ss ? 3 : ws === ss ? 1 : 0;
    }
    console.log(
      `  underdogShift ${gene.toFixed(1)}: pts/match ${(pts / MATCHES).toFixed(2)}  ` +
      `goals ${(gf / MATCHES).toFixed(2)}-${(ga / MATCHES).toFixed(2)}  GD ${((gf - ga) / MATCHES).toFixed(2)}`,
    );
  }
}

console.log('\n== 2. expression: kickoff Elo factors + the gene under selection ==');
for (const seed of [424242, 991]) {
  const league = new League({ seed });
  const factors: number[] = [];
  const report = (gen: number | string): void => {
    const gs = league.franchises.map((f) => f.coach.genome.underdogShift ?? 0);
    const mean = gs.reduce((a, b) => a + b, 0) / gs.length;
    console.log(
      `  world ${seed} gen ${String(gen).padStart(2)}: gene mean ${mean.toFixed(3)} ` +
      `[${Math.min(...gs).toFixed(2)}–${Math.max(...gs).toFixed(2)}]` +
      (factors.length
        ? `  kickoff factor mean ${(factors.reduce((a, b) => a + b, 0) / factors.length).toFixed(3)} ` +
          `(p90 ${factors.sort((a, b) => a - b)[Math.floor(factors.length * 0.9)].toFixed(2)})`
        : ''),
    );
    factors.length = 0;
  };
  report(1);
  for (let s = 0; s < 12; s++) {
    while (!league.seasonDone) {
      const f = league.nextFixture()!;
      const gap = Math.abs(league.franchise(f.home).elo - league.franchise(f.away).elo);
      factors.push(Math.min(1, gap / 150)); // must mirror Match's sensor
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
    league.finishSeason();
    if (s % 4 === 3) report(league.generation);
  }
}
console.log('\nverdict inputs — (1) pts/GD monotone in the gene, (2) factors non-trivial + gene moves');
