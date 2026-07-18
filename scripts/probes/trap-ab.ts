// Probe (Phase 109): the offside-trap MECHANISM A/B. A trap-0.9 side vs a
// trap-0.1 side (all else neutral): does holding the line actually spring
// the phase-71 law (offside free kicks WON), what does it concede when
// beaten, and is either side systematically better (that answer belongs
// to selection, but a one-sided blowout here = mispriced substrate).
//   npx tsx scripts/probes/trap-ab.ts [matches]
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { GENE_KEYS, type TacticalGenome } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';

const attrs = (): PlayerAttributes => {
  const p = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) p[k] = 0.5;
  return p;
};
const team = (name: string, trap: number): TeamInfo => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  g.trapBias = trap;
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
    genome: g, squad: Array.from({ length: TEAM_SIZE }, attrs),
  };
};

const N = Number(process.argv[2] ?? 60);
let goalsTrap = 0;
let goalsTrack = 0;
let offsidesSprung = 0; // offside awards WON by the trap side
let offsidesTrack = 0;
for (let i = 0; i < N; i++) {
  for (const flip of [0, 1]) {
    const m = new Match({
      seed: 5000 + i,
      teamA: flip ? team('TRACK', 0.1) : team('TRAP', 0.9),
      teamB: flip ? team('TRAP', 0.9) : team('TRACK', 0.1),
      duration: 240,
    });
    const trapSide = flip ? 1 : 0;
    let prevRestart: unknown = null;
    while (!m.finished) {
      m.step(DT);
      if (m.restart && m.restart !== prevRestart) {
        prevRestart = m.restart;
        if (m.restart.offside) {
          // the award goes TO the defending side that sprang it
          if (m.restart.side === trapSide) offsidesSprung++;
          else offsidesTrack++;
        }
      }
    }
    goalsTrap += m.score[trapSide];
    goalsTrack += m.score[1 - trapSide];
  }
}
console.log(`${N * 2} side-balanced matches (trap 0.9 vs track 0.1, else neutral):`);
console.log(`  goals: trap ${goalsTrap} vs track ${goalsTrack}`);
console.log(`  offside awards won: trap-side ${offsidesSprung} vs track-side ${offsidesTrack} ` +
  `(${(offsidesSprung / (N * 2)).toFixed(2)} vs ${(offsidesTrack / (N * 2)).toFixed(2)} per match)`);
