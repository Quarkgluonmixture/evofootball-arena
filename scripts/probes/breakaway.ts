// Diagnostic (user report: on a 单刀/breakaway the carrier pushes the ball too
// far — 趟球太大 — and it runs into the keeper's arms). Measures: of clean
// breakaways (carrier driving at goal, ONLY the keeper goal-side of the ball),
// how the episode resolves — a SHOT, the KEEPER collecting a loose ball with NO
// shot ("fed to the keeper", the reported bug), a recovering DEFENDER, or other.
//   npx tsx scripts/probes/breakaway.ts [seedOffset]
import { Match } from '../../src/sim/Match';
import { DT, HALF_L } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

// `max` mode: force the BEST-possible genome (control + finishing maxed) to test
// whether EVOLUTION could route around the heavy touch, or it's a substrate cap.
const MAX = process.argv[2] === 'max';
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  const squad = randomSquad(rng);
  if (MAX) for (const p of squad) { p.dribbling = 0.95; p.finishing = 0.9; }
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad,
  };
};

const N = 150;
const OFF = MAX ? 0 : Number(process.argv[2] ?? 0);
let breakaways = 0;
const out = { shot: 0, keeperNoShot: 0, defender: 0, other: 0 };

for (let seed = OFF; seed < OFF + N; seed++) {
  const m = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240 });
  let epActive = false, epSide = -1, epShot = false, epStart = 0;
  const resolve = (k: keyof typeof out): void => { out[epShot ? 'shot' : k]++; epActive = false; };
  while (!m.finished) {
    m.step(DT);
    if (m.phase !== 'playing') { if (epActive) resolve('other'); continue; }
    const b = m.ball;
    const owner = b.owner;
    if (epActive && m.pendingShot && m.pendingShot.side === epSide) epShot = true;
    // Breakaway: an outfield carrier within 32m of the opp goal, with NO opp
    // outfielder goal-side of the ball (only the keeper left to beat).
    let isBreak = false, side = -1;
    if (owner && owner.role !== 'GK') {
      side = owner.side;
      const goalX = m.teams[side].attackDir * HALF_L;
      const dGoal = Math.abs(goalX - b.pos.x);
      if (dGoal < 32) {
        let cover = false;
        for (const o of m.teams[1 - side].players) {
          if (o.role === 'GK' || o.sentOff) continue;
          if (Math.abs(goalX - o.pos.x) < dGoal - 1) { cover = true; break; }
        }
        isBreak = !cover;
      }
    }
    if (isBreak && !epActive) { epActive = true; epSide = side; epShot = false; epStart = m.simTime; breakaways++; }
    if (epActive) {
      const gk = m.teams[1 - epSide].goalkeeper;
      if (b.owner === gk || gk.gkHoldTimer > 0) resolve('keeperNoShot');
      else if (b.owner && b.owner.side === 1 - epSide) resolve('defender');
      else if (m.simTime - epStart > 3.5) resolve('other');
    }
  }
}

const pct = (n: number): string => `${((100 * n) / Math.max(breakaways, 1)).toFixed(0)}%`;
console.log(`n=${N} matches (seeds ${OFF}-${OFF + N - 1}) — clean breakaways: ${breakaways} (${(breakaways / N).toFixed(1)}/match)`);
console.log(`  shot taken:              ${out.shot}  ${pct(out.shot)}`);
console.log(`  KEEPER collects, NO shot:${out.keeperNoShot}  ${pct(out.keeperNoShot)}   <- 趟球太大送门将`);
console.log(`  defender recovers:       ${out.defender}  ${pct(out.defender)}`);
console.log(`  other/fizzled:           ${out.other}  ${pct(out.other)}`);
