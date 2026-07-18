// Probe (Phase 111): the MORALE channel A/B — a full-confidence side
// (morale .9, sensitivity 1) vs a full-slump side (morale .1, sens 1),
// neutral genomes/squads otherwise, side-balanced. The channel is pass +
// shot noise (±9.6% at these extremes) — expect a real but modest edge.
// Measured at ship time: 120 matches, hot 154 goals / 5114 passes vs
// cold 139 / 4999 (+11% goals, +2.3% passes).
//   npx tsx scripts/probes/morale-ab.ts [matches]
import { Match } from '../../src/sim/Match';
import { GENE_KEYS, type TacticalGenome } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';

const attrs = (): PlayerAttributes => {
  const p = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) p[k] = 0.5;
  return p;
};
const team = (name: string, morale: number): TeamInfo => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  g.moraleSensitivity = 1;
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
    genome: g, squad: Array.from({ length: TEAM_SIZE }, attrs),
    morale,
  };
};
const N = Number(process.argv[2] ?? 60);
let gHot = 0; let gCold = 0; let pHot = 0; let pCold = 0;
for (let i = 0; i < N; i++) {
  for (const flip of [0, 1]) {
    const m = new Match({
      seed: 7000 + i,
      teamA: flip ? team('COLD', 0.1) : team('HOT', 0.9),
      teamB: flip ? team('HOT', 0.9) : team('COLD', 0.1),
      duration: 240,
    });
    const r = m.runToCompletion();
    const hot = flip ? 1 : 0;
    gHot += r.score[hot]; gCold += r.score[1 - hot];
    pHot += r.stats[hot].passes; pCold += r.stats[1 - hot].passes;
  }
}
console.log(`${N * 2} matches: hot ${gHot} goals / ${pHot} passes · cold ${gCold} goals / ${pCold} passes`);
