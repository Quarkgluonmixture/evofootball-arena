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

interface Mix {
  goals: number;
  shots: number;
  xg: number;
  bigChances: number; // xG ≥ 0.25 — the "finished, not contested" channel
  bigGoals: number;
}
const emptyMix = (): Mix => ({ goals: 0, shots: 0, xg: 0, bigChances: 0, bigGoals: 0 });
const short = emptyMix();
const fullBase = emptyMix();
let fullTotal = 0;
for (let seed = 0; seed < 60; seed++) {
  const full = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 240 });
  const fullR = full.runToCompletion();
  const m = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 240 });
  const shortSide = seed % 2;
  m.sendOff(m.teams[shortSide].players[2]);
  const r = m.runToCompletion();
  const tally = (mix: Mix, match: Match, side: number, score: number): void => {
    mix.goals += score;
    for (const s of match.shotLog) {
      if (s.side !== side) continue;
      mix.shots++;
      mix.xg += s.xg;
      if (s.xg >= 0.25) {
        mix.bigChances++;
        if (s.outcome === 'goal') mix.bigGoals++;
      }
    }
  };
  tally(short, m, shortSide, r.score[shortSide]);
  tally(fullBase, full, shortSide, fullR.score[shortSide]);
  fullTotal += fullR.score[0] + fullR.score[1];
}
const show = (label: string, m: Mix): void =>
  console.log(
    `${label}: goals ${m.goals}, shots ${m.shots}, xG/shot ${(m.xg / m.shots).toFixed(3)}, big chances ${m.bigChances} (→${m.bigGoals} goals), conv ${((m.goals / m.shots) * 100).toFixed(1)}%`,
  );
show('shorthanded', short);
show('full-base  ', fullBase);
console.log(`invariant: ${short.goals} must be < ${(fullBase.goals * 0.9).toFixed(1)}`);
console.log(`neutral-mirror total goals/match: ${(fullTotal / 60).toFixed(2)}`);
