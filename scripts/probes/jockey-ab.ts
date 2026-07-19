// Probe: does containment WIN head-to-head? (Phase 91 — the phase-88
// finding: two worlds abandoned jockey and re-inflated; before any fix we
// need to know whether high-jockey is individually advantageous (then the
// instability is the red-queen hole → fitness anchor fork) or individually
// bad (then the containment mechanism is mispriced → rebalance fork).
//   npx tsx scripts/probes/jockey-ab.ts [matches]
import { Match } from '../../src/sim/Match';
import { GENE_KEYS, type TacticalGenome } from '../../src/evolution/genome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';

const N = Number(process.argv[2] ?? 150);

const attrs = (over: Partial<Record<string, number>> = {}) => ({
  pace: 0.5, passing: 0.5, dribbling: 0.5, finishing: 0.5,
  defending: 0.5, strength: 0.5, stamina: 0.5, reflexes: 0.5, positioning: 0.5, ...over,
});
const genome = (over: Partial<TacticalGenome> = {}): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return { ...g, ...over };
};
const team = (name: string, g: TacticalGenome, squad: ReturnType<typeof attrs>): TeamInfo => ({
  id: name, name, short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
  genome: g,
  squad: Array.from({ length: TEAM_SIZE }, () => ({ ...squad })),
});

function duel(label: string, squad: ReturnType<typeof attrs>): void {
  let w = 0; let d = 0; let l = 0; let gf = 0; let ga = 0;
  for (let seed = 1; seed <= N; seed++) {
    // Alternate sides so kickoff/side bias cancels.
    const jockeyHome = seed % 2 === 0;
    const A = team('Jockey', genome({ jockeyBias: 0.9 }), squad);
    const B = team('DiveIn', genome({ jockeyBias: 0.1 }), squad);
    const m = new Match({ seed, teamA: jockeyHome ? A : B, teamB: jockeyHome ? B : A });
    const res = m.runToCompletion();
    const j = jockeyHome ? 0 : 1;
    const jg = res.score[j];
    const og = res.score[1 - j];
    gf += jg; ga += og;
    if (jg > og) w++; else if (jg === og) d++; else l++;
  }
  const pts = w * 3 + d;
  const oppPts = l * 3 + d;
  console.log(
    `${label}: jockey0.9 W${w} D${d} L${l} | GF ${(gf / N).toFixed(2)} GA ${(ga / N).toFixed(2)} ` +
    `| pts/match ${(pts / N).toFixed(2)} vs ${(oppPts / N).toFixed(2)}`,
  );
}

duel('neutral squads      ', attrs());
// The late-gen meta environment: both squads pace/dribble-heavy, funded by
// thinner defending/reflexes (budget-realistic trade).
duel('dribble-meta squads ', attrs({ pace: 0.65, dribbling: 0.65, defending: 0.4, reflexes: 0.42 }));
