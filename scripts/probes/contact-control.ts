/**
 * M3 mechanism probe: a rolling dribble touch meets a defender, then reports
 * first physical contact separately from final stable control.
 *
 *   npx tsx scripts/probes/contact-control.ts
 */
import type { TacticalGenome } from '../../src/evolution/genome';
import { GENE_KEYS } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { DT } from '../../src/sim/constants';
import { Match } from '../../src/sim/Match';
import { performDribbleTouch } from '../../src/sim/mechanics';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { v2 } from '../../src/utils/vec';

const attrs = (): PlayerAttributes => {
  const p = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) p[k] = 0.5;
  return p;
};
const genome = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};
const team = (name: string): TeamInfo => ({
  id: name,
  name,
  short: name,
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `${name}${i}`),
  genome: genome(),
  squad: Array.from({ length: TEAM_SIZE }, attrs),
});

let defenderFirst = 0;
let defenderControls = 0;
let firstNotFinal = 0;
for (let seed = 0; seed < 8; seed++) {
  const m = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 120, traceContests: true });
  while (m.phase !== 'playing') m.step(DT);
  m.kickoffKickGid = null;
  const carrier = m.teams[0].players[5];
  carrier.pos = v2(-10, 0);
  carrier.vel = v2(5, 0);
  carrier.heading = v2(1, 0);
  for (const p of m.allPlayers) {
    if (p === carrier) continue;
    p.pos = v2(p.side === 0 ? -35 : 38, p.gid % 2 === 0 ? 20 : -20);
    p.vel = v2(0, 0);
  }
  m.ball.owner = carrier;
  m.ball.pos = v2(carrier.pos.x, carrier.pos.y);
  m.ball.vel = v2(0, 0);
  m.possessionSide = 0;
  m.pendingPass = null;
  performDribbleTouch(m, carrier);
  const defender = m.teams[1].players[1];
  defender.pos = v2(carrier.pos.x + 2.6, carrier.pos.y);
  defender.vel = v2(0, 0);
  const episodeStart = m.contestEpisodes.length;

  for (let t = 0; t < 60 && !m.finished && m.ball.owner === null; t++) m.step(DT);
  const episode = m.contestEpisodes[episodeStart];
  const first = episode?.contacts[0]?.gid ?? -1;
  const final = episode?.resolution?.kind === 'controlled' ? episode.resolution.gid : -1;
  if (first === defender.gid) defenderFirst++;
  if (final === defender.gid) defenderControls++;
  if (first !== -1 && final !== -1 && first !== final) firstNotFinal++;
  console.log(
    `seed ${seed}: first=${first} contacts=[${episode?.contacts.map((c) => c.gid).join(',') ?? ''}]` +
    ` final=${final} owner=${m.ball.owner?.gid ?? '-'}`,
  );
}

console.log(
  `M3 CONTACT→CONTROL: defender-first ${defenderFirst}/8` +
  ` · defender-controls ${defenderControls}/8 · first≠final ${firstNotFinal}/8`,
);
