// Probe: the ground BENDER (Phase 70/71) at the per-delivery level —
// staged pinched THROUGH BALLS (the last defender's leg near the seam,
// a runner bursting). Ordinary circulation passes stay deliberately
// straight (the bender taxed pressing — mechanics.ts). Run on both trees
// (stash dance, FOREGROUND ONLY — fm 28) to compare.
//   npx tsx scripts/probes/bend-anatomy.ts [n]
import type { TacticalGenome } from '../../src/evolution/genome';
import { GENE_KEYS } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { DT } from '../../src/sim/constants';
import { Match } from '../../src/sim/Match';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { v2 } from '../../src/utils/vec';

const N = Number(process.argv[2] ?? 400);
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

let got = 0, stolen = 0, loose = 0, bent = 0;
for (let seed = 0; seed < N; seed++) {
  const m = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 120 });
  while (m.phase !== 'playing') m.step(DT);
  m.kickoffKickGid = null;
  for (const p of m.allPlayers) {
    p.pos = v2(p.side === 0 ? -40 + p.index : 40 - p.index, 24);
    p.vel = v2(0, 0);
  }
  const passer = m.teams[0].players[2];
  const runner = m.teams[0].players[5];
  const leg = m.teams[1].players[1];
  // Vary the seam geometry deterministically per seed.
  const off = 0.3 + (seed % 7) * 0.12; // 0.3..1.02m off the seam
  const side = seed % 2 === 0 ? 1 : -1;
  passer.pos = v2(-6, 0);
  runner.pos = v2(6, 2);
  runner.vel = v2(6, 0.5); // bursting — the delivery leads the run
  leg.pos = v2(1 + (seed % 5) * 0.7, 1.2 + side * off);
  leg.vel = v2(0, 0);
  m.ball.owner = passer;
  m.ball.pos = v2(passer.pos.x, passer.pos.y);
  m.possessionSide = 0;
  passer.kickCooldown = 0;
  m.performThroughBall(passer, runner);
  if (m.ball.spin !== 0) bent++;
  let taken: number | null = null;
  for (let t = 0; t < 300 && taken === null; t++) {
    m.step(DT);
    if (m.ball.owner !== null) taken = m.ball.owner.gid;
  }
  if (taken === runner.gid) got++;
  else if (taken !== null && m.allPlayers[taken].side === 1) stolen++;
  else loose++;
}
console.log(
  `pinched-lane passes n=${N}: receiver ${(got / N * 100).toFixed(1)}% · ` +
  `stolen ${(stolen / N * 100).toFixed(1)}% · other ${(loose / N * 100).toFixed(1)}% · ` +
  `bent ${(bent / N * 100).toFixed(0)}%`,
);
