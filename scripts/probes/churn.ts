// Diagnostic: midfield churn (user report "还是有点中场乱抢"). WHERE does the
// ball change hands, and how long does a side keep it? Buckets loose touches
// AND possession turnovers by pitch third (world x: middle = |x|<15 on a
// 90-long pitch), and measures possession lifespan (time a side owns the ball
// before losing it) and how turnovers resolve.
//   npx tsx scripts/probes/churn.ts [seedOffset]
import { Match } from '../../src/sim/Match';
import { DT, HALF_L } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

const N = 150;
const OFF = Number(process.argv[2] ?? 0);
const THIRD = HALF_L / 3; // ±15m band = the middle third

const third = (x: number): 'def' | 'mid' | 'att' => (x < -THIRD ? 'def' : x > THIRD ? 'att' : 'mid');

let looseTouch = { def: 0, mid: 0, att: 0 };
let turnovers = { def: 0, mid: 0, att: 0 }; // possession-side flips, by where the ball was
let ownershipSpells = 0;
let ownershipTime = 0;    // total seconds a side clearly owned the ball
let spellDurs: number[] = [];
let t_i = 0, miscontrols = 0, goals = 0;

for (let seed = OFF; seed < OFF + N; seed++) {
  const m = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240 });
  let lastTouchGid = -1;
  let ownerSide = -1;       // which side currently OWNS (via ball.owner)
  let spellStart = 0;
  while (!m.finished) {
    m.step(DT);
    const b = m.ball;
    if (m.phase !== 'playing') { lastTouchGid = b.lastTouch ? b.lastTouch.gid : -1; continue; }
    // Loose touch (owner null, toucher changed) — the scramble surface.
    const lt = b.lastTouch;
    if (b.owner === null && lt && lt.gid !== lastTouchGid) looseTouch[third(b.pos.x)]++;
    lastTouchGid = lt ? lt.gid : -1;
    // Possession spell + turnover accounting keyed off actual ownership.
    const os = b.owner ? b.owner.side : -1;
    if (os !== -1) {
      if (ownerSide === -1) { spellStart = m.simTime; }
      else if (os !== ownerSide) {
        // A turnover: previous side's spell ends, count it where the ball is.
        turnovers[third(b.pos.x)]++;
        spellDurs.push(m.simTime - spellStart);
        ownershipSpells++;
        ownershipTime += m.simTime - spellStart;
        spellStart = m.simTime;
      }
      ownerSide = os;
    }
  }
  goals += m.score[0] + m.score[1];
  for (const t of m.teams) { t_i += t.stats.tackles + t.stats.interceptions; miscontrols += t.stats.miscontrols; }
}

const per = (v: number): string => (v / N).toFixed(2);
const meanSpell = ownershipSpells ? ownershipTime / ownershipSpells : 0;
spellDurs.sort((a, b) => a - b);
const median = spellDurs.length ? spellDurs[Math.floor(spellDurs.length / 2)] : 0;
const tot = (o: { def: number; mid: number; att: number }): number => o.def + o.mid + o.att;
console.log(`n=${N} (seeds ${OFF}-${OFF + N - 1})   goals/match ${per(goals)}   t+i/match ${per(t_i)}   miscontrols/match ${per(miscontrols)}`);
console.log(`loose touches/match by third:  def ${per(looseTouch.def)}  MID ${per(looseTouch.mid)}  att ${per(looseTouch.att)}   (mid share ${(looseTouch.mid / Math.max(tot(looseTouch), 1) * 100).toFixed(0)}%)`);
console.log(`turnovers/match by third:      def ${per(turnovers.def)}  MID ${per(turnovers.mid)}  att ${per(turnovers.att)}   (mid share ${(turnovers.mid / Math.max(tot(turnovers), 1) * 100).toFixed(0)}%)`);
console.log(`possession spells/match: ${per(ownershipSpells)}   mean spell ${meanSpell.toFixed(2)}s   median ${median.toFixed(2)}s`);
