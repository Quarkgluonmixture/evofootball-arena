// Probe: goal-kick CHERRY-PICKING (user report: a teammate stands at/in
// the opponent's goal and the keeper's punt finds him — legally, since
// goal kicks are offside-exempt like the real law). Measures, at every
// goal-kick launch: the kicking side's deepest outfielder vs the
// defending side's offside line, plus punts aimed beyond the line and
// what they produce.
//   npx tsx scripts/probes/cherrypick-anatomy.ts [n]
import type { TacticalGenome } from '../../src/evolution/genome';
import { GENE_KEYS } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { DT } from '../../src/sim/constants';
import { Match } from '../../src/sim/Match';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';

const N = Number(process.argv[2] ?? 40);
const genome = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};
const squad = (): PlayerAttributes[] =>
  Array.from({ length: TEAM_SIZE }, () => {
    const p = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) p[k] = 0.5;
    return p;
  });
const team = (name: string): TeamInfo => ({
  id: name, name, short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
  genome: genome(), squad: squad(),
});

let kicks = 0;
let beyond = 0; // deepest attacker stands beyond the defending line at launch
let deep = 0;   // deepest attacker in the final 12m (goalmouth camping)
let targeted = 0; // the kick's pendingPass target stood beyond the line
let goals10 = 0; // goals within 10s of a beyond-line-targeted kick
const depths: number[] = [];

for (let seed = 0; seed < N; seed++) {
  const m = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 240 });
  let wasGoalKick: { side: 0 | 1 } | null = null;
  let armedUntil = -1;
  let armedScore = 0;
  let armedSide: 0 | 1 = 0;
  while (!m.finished) {
    const r = m.restart;
    if (r && r.kind === 'goalKick') wasGoalKick = { side: r.side as 0 | 1 };
    const before = m.pendingPass;
    m.step(DT);
    // The launch: the restart just dissolved into a kick with a fresh pass.
    if (wasGoalKick && m.restart === null && m.pendingPass && m.pendingPass !== before && m.pendingPass.side === wasGoalKick.side) {
      const atk = m.teams[wasGoalKick.side];
      const def = m.teams[1 - wasGoalKick.side];
      // Defending line: second-last defender's localX from the ATTACKER's view.
      const defXs = def.players.filter((p) => !p.sentOff).map((p) => atk.localX(p.pos.x)).sort((a, b) => b - a);
      const line = Math.max(defXs[1] ?? 0, 0);
      let deepest = -99;
      for (const p of atk.players) {
        if (p.role === 'GK' || p.sentOff) continue;
        deepest = Math.max(deepest, atk.localX(p.pos.x));
      }
      kicks++;
      depths.push(deepest);
      if (deepest > line + 1) beyond++;
      if (deepest > 33) deep++;
      const tgt = m.allPlayers[m.pendingPass.targetGid];
      if (tgt && atk.localX(tgt.pos.x) > line + 1) {
        targeted++;
        armedUntil = m.simTime + 10;
        armedScore = m.score[wasGoalKick.side];
        armedSide = wasGoalKick.side;
      }
      wasGoalKick = null;
    }
    if (armedUntil > 0 && m.simTime <= armedUntil && m.score[armedSide] > armedScore) {
      goals10++;
      armedUntil = -1;
    }
  }
}
depths.sort((a, b) => a - b);
const q = (f: number): string => (depths[Math.floor(f * depths.length)] ?? 0).toFixed(1);
console.log(
  `goal kicks ${kicks}: deepest-attacker localX q50/q90/max ${q(0.5)}/${q(0.9)}/${depths[depths.length - 1]?.toFixed(1)} ` +
  `| beyond the line ${beyond} (${((beyond / kicks) * 100).toFixed(0)}%) | in the final 12m ${deep} ` +
  `| punt TARGETED beyond ${targeted} → goals ≤10s ${goals10}`,
);
