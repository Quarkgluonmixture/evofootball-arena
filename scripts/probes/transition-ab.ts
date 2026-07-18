// Probe (Phase 112): the transition-press MECHANISM A/B. A gegenpress-0.9
// side vs a drop-and-recover-0.1 side (all else neutral): does the window
// response actually move the transition economy — regains within 6s of a
// loss, breakaway launches CONCEDED within 8s of a loss — and is either
// side systematically better (that answer belongs to selection; a
// one-sided blowout here = mispriced substrate).
//   npx tsx scripts/probes/transition-ab.ts [matches]
import { Match } from '../../src/sim/Match';
import { DT, HALF_L } from '../../src/sim/constants';
import { GENE_KEYS, type TacticalGenome } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import type { Side } from '../../src/sim/types';

const attrs = (): PlayerAttributes => {
  const p = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) p[k] = 0.5;
  return p;
};
const team = (name: string, tp: number): TeamInfo => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  g.transitionPress = tp;
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
    genome: g, squad: Array.from({ length: TEAM_SIZE }, attrs),
  };
};

const ENTRY_X = HALF_L - 15;
const N = Number(process.argv[2] ?? 60);
const stats = {
  gegen: { goals: 0, losses: 0, regains: 0, regainsFast: 0, regainsHigh: 0, launchesConceded: 0, stamina: 0 },
  drop: { goals: 0, losses: 0, regains: 0, regainsFast: 0, regainsHigh: 0, launchesConceded: 0, stamina: 0 },
};

for (let i = 0; i < N; i++) {
  for (const flip of [0, 1]) {
    const m = new Match({
      seed: 6000 + i,
      teamA: flip ? team('DROP', 0.1) : team('GEGEN', 0.9),
      teamB: flip ? team('GEGEN', 0.9) : team('DROP', 0.1),
      duration: 240,
    });
    const gegenSide = flip ? 1 : 0;
    // Open episodes per losing side: [t0, regained?, launched?]
    const eps: Array<{ loser: Side; t0: number; regained: boolean; launched: boolean }> = [];
    let prevPos: Side | -1 = -1;
    while (!m.finished) {
      m.step(DT);
      const pos = m.possessionSide;
      if (pos !== -1 && prevPos !== -1 && pos !== prevPos && m.phase === 'playing' && m.restartKickGid === null) {
        eps.push({ loser: prevPos as Side, t0: m.simTime, regained: false, launched: false });
        const k = (prevPos as Side) === gegenSide ? 'gegen' : 'drop';
        stats[k].losses++;
      }
      if (pos !== -1) prevPos = pos;
      for (const ep of eps) {
        const dt = m.simTime - ep.t0;
        if (dt > 8) continue;
        if (!ep.regained && dt <= 6 && m.possessionSide === ep.loser) {
          ep.regained = true;
          const s = stats[ep.loser === gegenSide ? 'gegen' : 'drop'];
          s.regains++;
          if (dt <= 3) s.regainsFast++; // won back inside the window itself
          // Regained in the opponent's half = the counter-press's playmaker
          // value (the ball comes back where the attack already stands).
          if (m.teams[ep.loser].localX(m.ball.pos.x) > 0) s.regainsHigh++;
        }
        const o = m.ball.owner;
        if (!ep.launched && o && o.side !== ep.loser && o.role !== 'GK' && m.phase === 'playing') {
          const wt = m.teams[o.side];
          const ox = wt.localX(o.pos.x);
          if (ox >= ENTRY_X) {
            const gs = m.teams[ep.loser].players.some(
              (q) => q.role !== 'GK' && !q.sentOff && wt.localX(q.pos.x) > ox,
            );
            if (!gs) {
              ep.launched = true;
              stats[ep.loser === gegenSide ? 'gegen' : 'drop'].launchesConceded++;
            }
          }
        }
      }
      // Trim closed episodes so the scan stays short.
      while (eps.length > 0 && m.simTime - eps[0].t0 > 8) eps.shift();
    }
    stats.gegen.goals += m.score[gegenSide];
    stats.drop.goals += m.score[1 - gegenSide];
    for (const p of m.teams[gegenSide].players) stats.gegen.stamina += 1 - p.stamina;
    for (const p of m.teams[1 - gegenSide].players) stats.drop.stamina += 1 - p.stamina;
  }
}

console.log(`${N * 2} side-balanced matches (gegenpress 0.9 vs drop-and-recover 0.1, else neutral):`);
for (const [name, s] of Object.entries(stats)) {
  console.log(
    `  ${name.padEnd(6)} goals ${String(s.goals).padStart(4)} · losses ${s.losses}` +
    ` · regain6s ${((s.regains / s.losses) * 100).toFixed(0)}% (in-window ${((s.regainsFast / s.losses) * 100).toFixed(0)}% · high ${((s.regainsHigh / s.losses) * 100).toFixed(0)}%)` +
    ` · launches conceded ${s.launchesConceded} (${((s.launchesConceded / s.losses) * 100).toFixed(1)}% of losses)` +
    ` · FT fatigue ${(s.stamina / (N * 2 * TEAM_SIZE)).toFixed(3)}`,
  );
}
