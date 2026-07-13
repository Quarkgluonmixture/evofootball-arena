// Probe: 🎼 pass-move feed rate + MOTM + rating spread (Phase 33).
// Run: npx tsx scripts/probes/chain-rates.ts — informed PASS_MOVE_FEED_MIN=6
// (6 ⇒ ~2.1 lines/match, 8 ⇒ ~0.75).
import { Match } from '../../src/sim/Match';
import { DT, MATCH_DURATION } from '../../src/sim/constants';
import { GENE_KEYS, randomGenome } from '../../src/evolution/genome';
import { ATTR_KEYS, randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

let lines = 0, matches = 20, motm = 0, chainSum = 0, ratings: number[] = [];
const feedNs: number[] = [];
for (let seed = 0; seed < matches; seed++) {
  const m = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: MATCH_DURATION });
  const res = m.runToCompletion();
  for (const e of m.events) {
    if (e.text.includes('-pass move')) { lines++; feedNs.push(Number(e.text.match(/(\d+)-pass/)![1])); }
    if (e.text.includes('Man of the match')) motm++;
  }
  chainSum += res.stats[0].bestPassChain + res.stats[1].bestPassChain;
  for (const s of res.playerStats) ratings.push(s.rating);
}
console.log(`🎼 lines/match: ${(lines / matches).toFixed(2)} (Ns: ${feedNs.sort((a, b) => b - a).slice(0, 8).join(',')})`);
console.log(`avg bestPassChain per team: ${(chainSum / matches / 2).toFixed(1)}`);
console.log(`MOTM lines: ${motm}/${matches}`);
console.log(`ratings: min ${Math.min(...ratings).toFixed(2)} max ${Math.max(...ratings).toFixed(2)} mean ${(ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)}`);
