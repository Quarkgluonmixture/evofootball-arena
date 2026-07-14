// Diagnostic: possession-spell DURATION distribution (user: "看下零点几秒到
// 丢失球权"). A spell = from when a side gains clear ownership until the OTHER
// side does. The mean (~4.7s) hid the short tail — this buckets it and shows
// what fraction of spells die sub-second, and where on the pitch they die.
//   npx tsx scripts/probes/spell-dist.ts [seedOffset]
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
const THIRD = HALF_L / 3;

// Side-level spells (possession until the opponent gains it).
const sideBuckets = { '<0.5': 0, '0.5-1': 0, '1-2': 0, '2-4': 0, '4-8': 0, '>8': 0 };
let sideSpells = 0;
// Player-level holds (a player owns the ball until it LEAVES him — pass, tackle,
// spill, anything). How long does an individual keep the ball on his foot?
const playerBuckets = { '<0.5': 0, '0.5-1': 0, '1-2': 0, '2-4': 0, '>4': 0 };
let playerHolds = 0;
let subSecLossMid = 0; // side spells that died <1s AND in the middle third
let subSecLossTot = 0;

const bump = (b: Record<string, number>, keys: string[], dur: number): void => {
  for (const k of keys) {
    const [lo, hi] = k.includes('-') ? k.split('-').map(Number) : k.startsWith('<') ? [0, Number(k.slice(1))] : [Number(k.slice(1)), Infinity];
    if (dur >= lo && dur < hi) { b[k]++; return; }
  }
};

for (let seed = OFF; seed < OFF + N; seed++) {
  const m = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240 });
  let ownerSide = -1, sideStart = 0;
  let holdGid = -1, holdStart = 0;
  while (!m.finished) {
    m.step(DT);
    if (m.phase !== 'playing') continue;
    const o = m.ball.owner;
    // Side spell.
    const os = o ? o.side : ownerSide; // loose time stays with the last owner's side
    if (o && ownerSide !== -1 && o.side !== ownerSide) {
      const dur = m.simTime - sideStart;
      bump(sideBuckets, ['<0.5', '0.5-1', '1-2', '2-4', '4-8', '>8'], dur);
      sideSpells++;
      if (dur < 1) { subSecLossTot++; if (Math.abs(m.ball.pos.x) < THIRD) subSecLossMid++; }
      sideStart = m.simTime;
    }
    if (o && ownerSide === -1) sideStart = m.simTime;
    if (o) ownerSide = o.side;
    // Player hold.
    if (o && o.gid !== holdGid) {
      if (holdGid !== -1) { bump(playerBuckets, ['<0.5', '0.5-1', '1-2', '2-4', '>4'], m.simTime - holdStart); playerHolds++; }
      holdGid = o.gid; holdStart = m.simTime;
    } else if (!o && holdGid !== -1) {
      bump(playerBuckets, ['<0.5', '0.5-1', '1-2', '2-4', '>4'], m.simTime - holdStart); playerHolds++; holdGid = -1;
    }
  }
}

const pct = (v: number, tot: number): string => `${((v / Math.max(tot, 1)) * 100).toFixed(0)}%`;
console.log(`n=${N} (seeds ${OFF}-${OFF + N - 1})`);
console.log(`SIDE spells/match: ${(sideSpells / N).toFixed(1)}`);
for (const [k, v] of Object.entries(sideBuckets)) console.log(`  ${k.padEnd(6)}s: ${pct(v, sideSpells)}  (${(v / N).toFixed(2)}/match)`);
console.log(`sub-second (<1s) losses: ${pct(sideBuckets['<0.5'] + sideBuckets['0.5-1'], sideSpells)} of all spells; ${pct(subSecLossMid, subSecLossTot)} of those die in the MIDDLE third`);
console.log(`PLAYER holds/match: ${(playerHolds / N).toFixed(1)}`);
for (const [k, v] of Object.entries(playerBuckets)) console.log(`  ${k.padEnd(6)}s: ${pct(v, playerHolds)}  (${(v / N).toFixed(2)}/match)`);
