// Probe (Phase 98): does the genome actually steer the keeper's release?
// Four coach schools with identical squads, 5×300s matches each vs a
// neutral opponent — count what the distributing keeper chose.
//   npx tsx scripts/probes/keeper-distribution.ts
import type { TacticalGenome } from '../../src/evolution/genome';
import { GENE_KEYS } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { dist } from '../../src/utils/vec';

const attrs = (): PlayerAttributes => {
  const p = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) p[k] = 0.5;
  return p;
};
const genome = (over: Partial<Record<string, number>>): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  for (const [k, v] of Object.entries(over)) (g as unknown as Record<string, number>)[k] = v!;
  return g;
};
const team = (n: string, over: Partial<Record<string, number>>): TeamInfo => ({
  id: n, name: n, short: n.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
  genome: genome(over),
  squad: Array.from({ length: TEAM_SIZE }, attrs),
});

const SCHOOLS: Array<[string, Partial<Record<string, number>>]> = [
  ['neutral   ', {}],
  ['build-up  ', { passBias: 0.9, riskTolerance: 0.7 }],
  ['counter   ', { counterAttackBias: 0.9 }],
  ['punt-first', { passBias: 0.1, riskTolerance: 0.1 }],
];

for (const [label, over] of SCHOOLS) {
  const mix: Record<string, number> = {};
  for (const seed of [11, 12, 13, 14, 15]) {
    const m = new Match({ seed, teamA: team('A', over), teamB: team('B', {}), duration: 300 });
    let wasDistributing = false;
    while (!m.finished) {
      m.step(DT);
      const gk = m.teams[0].goalkeeper;
      const holdingNow = m.ball.owner === gk && gk.gkDistributing;
      if (wasDistributing && !holdingNow) {
        // The release happened this frame — the keeper's action names it.
        const a = gk.action.type;
        let key: string = a;
        if (a === 'ThrowOut') {
          const t = m.allPlayers[(gk.action as unknown as { targetIdx: number }).targetIdx];
          key = t && dist(gk.pos, t.pos) <= 16 ? 'roll-to-feet' : 'counter-sling';
        } else if (a === 'LoftedPass') key = 'PUNT';
        mix[key] = (mix[key] ?? 0) + 1;
      }
      wasDistributing = holdingNow;
    }
  }
  const total = Object.values(mix).reduce((a, b) => a + b, 0);
  const parts = Object.entries(mix).sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k} ${((v / total) * 100).toFixed(0)}%`).join(' · ');
  console.log(`${label} (${total} releases): ${parts}`);
}
