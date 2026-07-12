/**
 * 5v6 sanity probe (Phase 30.5): replicates the cards.test.ts directional
 * harness (60 side-balanced seeds, neutral genomes, MF sent off at kickoff)
 * so balance levers can be bisected against the "playing short must hurt"
 * invariant without a full vitest run.
 * Run with: npx tsx scripts/probe-shorthand.ts
 */
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { Match } from '../src/sim/Match';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';

const neutralGenome = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};
const neutralSquad = (): PlayerAttributes[] =>
  Array.from({ length: TEAM_SIZE }, () => {
    const a = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) a[k] = 0.5;
    return a;
  });
const team = (name: string): TeamInfo => ({
  id: name,
  name,
  short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
  genome: neutralGenome(),
  squad: neutralSquad(),
});

let shorthandedGoals = 0;
let fullGoals = 0;
let fullTotal = 0;
let shortShots = 0;
let fullShots = 0;
for (let seed = 0; seed < 60; seed++) {
  const full = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 240 }).runToCompletion();
  const m = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 240 });
  const shortSide = seed % 2;
  m.sendOff(m.teams[shortSide].players[2]);
  const r = m.runToCompletion();
  shorthandedGoals += r.score[shortSide];
  fullGoals += full.score[shortSide];
  fullTotal += full.score[0] + full.score[1];
  shortShots += r.stats[shortSide].shots;
  fullShots += full.stats[shortSide].shots;
}
console.log(`shorthanded goals ${shorthandedGoals} vs full ${fullGoals} (need < ${(fullGoals * 0.9).toFixed(1)})`);
console.log(`shorthanded shots ${shortShots} vs full ${fullShots}`);
console.log(`neutral-mirror total goals/match: ${(fullTotal / 60).toFixed(2)}`);
