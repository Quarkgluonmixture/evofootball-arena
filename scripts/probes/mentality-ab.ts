// Probe: game-state tactics A/B (Phase 35). Cross-version safe: reads only
// score/minute/stats that exist at phase-34.3, plus keeperUp via a loose
// index (undefined → falsy on the baseline). Run on BOTH trees, same seeds:
//   npx tsx scripts/probes/mentality-ab.ts            (current)
//   git worktree add /tmp/efb-base phase-34.3
//   cp scripts/probes/mentality-ab.ts /tmp/efb-base/scripts/probes/
//   cd /tmp/efb-base && npx tsx scripts/probes/mentality-ab.ts
// Metrics: trailing-side last-quarter shot share (expect ↑), comeback rate
// from 75' (expect ↑ but BOUNDED — the rubber-band trap), goals conceded by
// the chasing side after 75' (the chase must COST, expect ↑), leading-side
// late keep-ball, keeper-up sightings (current build only).
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
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
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

const N = 300;
const OFF = Number(process.argv[2] ?? 0); // seed offset — 2nd block checks lever noise

let lateShotsTrail = 0;
let lateShotsLead = 0;
let gamesWithGap = 0;
let trail75 = 0;
let comebacks = 0; // trailing at 75' → drew or won
let chaseConceded = 0; // goals conceded by the 75'-trailing side after 75'
let chaseScored = 0; // goals scored by the 75'-trailing side after 75'
let latePassesLead = 0;
let latePassesTrail = 0;
let keeperUpMatches = 0;
let keeperUpSteps = 0;
let goalsTotal = 0;

for (let seed = OFF; seed < OFF + N; seed++) {
  const m = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240 });
  let snap68: { score: [number, number]; shots: [number, number]; passes: [number, number] } | null = null;
  let score75: [number, number] | null = null;
  let sawKeeperUp = false;
  while (!m.finished) {
    m.step(DT);
    if (m.half === 2 && m.minute() >= 68 && snap68 === null) {
      snap68 = {
        score: [m.score[0], m.score[1]],
        shots: [m.teams[0].stats.shots, m.teams[1].stats.shots],
        passes: [m.teams[0].stats.passesCompleted, m.teams[1].stats.passesCompleted],
      };
    }
    if (m.half === 2 && m.minute() >= 75 && score75 === null) score75 = [m.score[0], m.score[1]];
    for (const t of m.teams) {
      if ((t as unknown as { keeperUp?: boolean }).keeperUp) {
        keeperUpSteps++;
        sawKeeperUp = true;
      }
    }
  }
  goalsTotal += m.score[0] + m.score[1];
  if (sawKeeperUp) keeperUpMatches++;

  if (snap68 && snap68.score[0] !== snap68.score[1]) {
    gamesWithGap++;
    const trailSide = snap68.score[0] < snap68.score[1] ? 0 : 1;
    lateShotsTrail += m.teams[trailSide].stats.shots - snap68.shots[trailSide];
    lateShotsLead += m.teams[1 - trailSide].stats.shots - snap68.shots[1 - trailSide];
    latePassesTrail += m.teams[trailSide].stats.passesCompleted - snap68.passes[trailSide];
    latePassesLead += m.teams[1 - trailSide].stats.passesCompleted - snap68.passes[1 - trailSide];
  }
  if (score75 && score75[0] !== score75[1]) {
    trail75++;
    const trailSide = score75[0] < score75[1] ? 0 : 1;
    const finalDiff = m.score[trailSide] - m.score[1 - trailSide];
    if (finalDiff >= 0) comebacks++;
    chaseScored += m.score[trailSide] - score75[trailSide];
    chaseConceded += m.score[1 - trailSide] - score75[1 - trailSide];
  }
}

const pct = (a: number, b: number): string => (b === 0 ? 'n/a' : ((a / b) * 100).toFixed(1) + '%');
console.log(`n=${N} matches (seeds ${OFF}-${OFF + N - 1}), goals/match ${(goalsTotal / N).toFixed(2)}`);
console.log(`games with a gap at 68': ${gamesWithGap}`);
console.log(`  trailing-side late shot share: ${pct(lateShotsTrail, lateShotsTrail + lateShotsLead)} (${lateShotsTrail} vs ${lateShotsLead})`);
console.log(`  trailing-side late completed-pass share: ${pct(latePassesTrail, latePassesTrail + latePassesLead)}`);
console.log(`trailing at 75': ${trail75}`);
console.log(`  comeback (≥draw) rate: ${pct(comebacks, trail75)} (${comebacks})`);
console.log(`  chase goals scored after 75': ${chaseScored} (${(chaseScored / Math.max(trail75, 1)).toFixed(2)}/game)`);
console.log(`  chase goals CONCEDED after 75': ${chaseConceded} (${(chaseConceded / Math.max(trail75, 1)).toFixed(2)}/game)`);
console.log(`keeper-up: ${keeperUpMatches} matches, ${(keeperUpSteps / 60).toFixed(1)}s total licensed time`);
