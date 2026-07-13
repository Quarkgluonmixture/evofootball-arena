// Probe: body-contact choreography (Phase 38). The render layer is a pure
// fn of sim state (invariant 11's headless-choreography rule): build
// RenderStates from real matches and count how often each contact behavior
// actually fires — a pose that never triggers is dead weight, one that
// fires constantly is noise. Zero sim changes this phase: fingerprint must
// still read f6d49cda (checked by the ship gate, not here).
//   npx tsx scripts/probes/contact-choreo.ts
import { jostling, rideSide, shielding } from '../../src/render3d/AnimationSystem';
import { buildRenderState } from '../../src/render3d/RenderStateAdapter';
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

const N = 60;
let shieldFrames = 0;
let rideFrames = 0;
let rideBouts = 0;
let jostleFrames = 0;
let cornerSetupFrames = 0;
let frames = 0;
const riding = new Set<number>();

for (let seed = 0; seed < N; seed++) {
  const m = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240 });
  riding.clear();
  let step = 0;
  while (!m.finished) {
    m.step(DT);
    // Sample at render cadence (every 3rd sim step ≈ 20fps) — plenty.
    if (++step % 3 !== 0) continue;
    frames++;
    const rs = buildRenderState(m, false);
    const isCornerSetup = m.phase === 'restart' && m.restart?.kind === 'corner';
    if (isCornerSetup) cornerSetupFrames++;
    for (const p of rs.players) {
      if ((p.action === 'HoldUp' && rs.ball.ownerGid === p.gid) || shielding(p, rs)) shieldFrames++;
      const side = p.speed >= 4 ? rideSide(p, rs.players, rs.ball) : 0;
      if (side !== 0) {
        rideFrames++;
        if (!riding.has(p.gid)) {
          riding.add(p.gid);
          rideBouts++;
        }
      } else {
        riding.delete(p.gid);
      }
      if (isCornerSetup && jostling(p, rs)) jostleFrames++;
    }
  }
}

const perMatch = (v: number): string => (v / N).toFixed(2);
console.log(`n=${N} matches, ${frames} sampled frames (20fps)`);
console.log(`shield (HoldUp on the ball): ${perMatch(shieldFrames / 20)}s/match visible`);
console.log(`shoulder rides: ${perMatch(rideBouts)} bouts/match, ${perMatch(rideFrames / 20)}s/match total`);
console.log(`corner jostle: ${perMatch(jostleFrames / 20)} player-seconds/match (setup time ${perMatch(cornerSetupFrames / 20)}s/match)`);
