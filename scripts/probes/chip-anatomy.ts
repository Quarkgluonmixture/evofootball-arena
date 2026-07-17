// Probe: the CHIP (Phase 69) — mechanism rates and the keeperAggression
// 相性. The chip is the ecology's first punishment for the sweeper keeper:
// his line height IS the gap behind him. Two shells differing only in
// keeperAggression face the same attacker; side-balanced.
//   * chips/match should SCALE with the shell's KA (geometry feasibility)
//   * chip conversion should be real but not free (over-bar/claim/smother)
//   * the KA=0.9 shell should concede MORE than it used to (the new tax)
//   npx tsx scripts/probes/chip-anatomy.ts [nPairs]
import type { TacticalGenome } from '../../src/evolution/genome';
import { GENE_KEYS } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';

const N = Number(process.argv[2] ?? 150);

const genome = (over: Partial<TacticalGenome> = {}): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return { ...g, ...over };
};
const squad = (): PlayerAttributes[] =>
  Array.from({ length: TEAM_SIZE }, () => {
    const p = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) p[k] = 0.5;
    return p;
  });
const team = (name: string, g: TacticalGenome): TeamInfo => ({
  id: name, name, short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
  genome: g, squad: squad(),
});

for (const ka of [0.1, 0.5, 0.9]) {
  const atk = team('ATK', genome());
  const shell = team('SHL', genome({ keeperAggression: ka }));
  let chips = 0;
  let chipGoals = 0;
  let chipSaved = 0;
  let chipMiss = 0;
  let atkGoals = 0;
  let shellGoals = 0;
  let matches = 0;
  for (let seed = 0; seed < N; seed++) {
    for (const order of [0, 1]) {
      const m = new Match({
        seed: seed * 2 + order,
        teamA: order === 0 ? atk : shell,
        teamB: order === 0 ? shell : atk,
        duration: 240,
      });
      m.runToCompletion();
      matches++;
      const atkSide = order === 0 ? 0 : 1;
      atkGoals += m.score[atkSide];
      shellGoals += m.score[1 - atkSide];
      for (const s of m.shotLog) {
        if (!s.chip || s.side !== atkSide) continue;
        chips++;
        if (s.outcome === 'goal') chipGoals++;
        else if (s.outcome === 'saved') chipSaved++;
        else chipMiss++;
      }
    }
  }
  console.log(
    `KA ${ka.toFixed(1)}: chips ${(chips / matches).toFixed(2)}/match ` +
    `(goal ${chipGoals} · saved ${chipSaved} · miss ${chipMiss}` +
    `${chips > 0 ? ` · conv ${((chipGoals / chips) * 100).toFixed(0)}%` : ''}) | ` +
    `atk ${(atkGoals / matches).toFixed(2)} shell ${(shellGoals / matches).toFixed(2)} goals/match`,
  );
}
