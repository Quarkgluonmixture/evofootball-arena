// Diagnostic: the loose-ball ping-pong (user report "球在两个球员之间弹来
// 弹去"). A "loose touch" = ball.lastTouch changes while nobody OWNS the ball
// (a deflection or a heavy first-touch spill). A "rally" = ≥3 loose touches
// by ≥2 distinct players inside a 1.5s window with the ball never owned — the
// pinball the user sees. Buckets the touch SPEED and HEIGHT so we know which
// band to give a cushion to.
//   npx tsx scripts/probes/pingpong.ts [seedOffset]
import { Match } from '../../src/sim/Match';
import { CONTROL_MAX_SPEED, CONTROL_MAX_HEIGHT, DEFLECT_MAX_SPEED, DT } from '../../src/sim/constants';
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

const N = 150;
const OFF = Number(process.argv[2] ?? 0);

let looseTouches = 0;
let rallies = 0;         // ≥3 loose touches, ≥2 players, ball never owned, <1.5s apart
let rallyTouches = 0;    // touches that were part of a rally
let traps = 0;           // possession GAINED while the ball was in the chest band (28.6)
let goals = 0;
// Speed band of the ball at the loose touch (what could a cushion have caught?).
const band = { slow: 0, control: 0, cushion: 0, deflect: 0, fast: 0 };
// Height band at the loose touch.
const height = { ground: 0, low: 0, dead: 0, air: 0 }; // <0.4 / <1.3 / 1.3-1.35 / >1.35

for (let seed = OFF; seed < OFF + N; seed++) {
  const m = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240 });
  let lastTouchGid = -1;
  let prevOwner = -1;
  // Rolling window of the current loose exchange.
  let run: { gids: Set<number>; touches: number; lastT: number } | null = null;
  while (!m.finished) {
    const wasZ = m.ball.z;
    m.step(DT);
    const b = m.ball;
    // A chest-band trap: possession gained this step while the ball was in the
    // (CONTROL_MAX_HEIGHT, CHEST_TRAP band] a step ago — brought down, not headed.
    if (b.owner && b.owner.gid !== prevOwner && wasZ > CONTROL_MAX_HEIGHT && wasZ <= 1.7) traps++;
    prevOwner = b.owner ? b.owner.gid : -1;
    const lt = b.lastTouch;
    if (m.phase === 'playing' && b.owner === null && lt && lt.gid !== lastTouchGid) {
      // A fresh loose touch (owner null, toucher changed).
      looseTouches++;
      const sp = Math.hypot(b.vel.x, b.vel.y);
      if (sp <= 6) band.slow++;
      else if (sp <= CONTROL_MAX_SPEED) band.control++;
      else if (sp <= 20) band.cushion++;
      else if (sp <= DEFLECT_MAX_SPEED) band.deflect++;
      else band.fast++;
      if (b.z < 0.4) height.ground++;
      else if (b.z <= CONTROL_MAX_HEIGHT) height.low++;
      else if (b.z <= 1.35) height.dead++;
      else height.air++;
      // Rally accounting.
      if (run && m.simTime - run.lastT < 1.5) {
        run.touches++;
        run.gids.add(lt.gid);
        run.lastT = m.simTime;
      } else {
        run = { gids: new Set([lt.gid]), touches: 1, lastT: m.simTime };
      }
      if (run.touches === 3 && run.gids.size >= 2) { rallies++; rallyTouches += 3; }
      else if (run.touches > 3 && run.gids.size >= 2) rallyTouches++;
    }
    lastTouchGid = lt ? lt.gid : -1;
    if (b.owner) run = null; // ownership breaks any rally
  }
  goals += m.score[0] + m.score[1];
}

const per = (v: number): string => (v / N).toFixed(2);
console.log(`n=${N} (seeds ${OFF}-${OFF + N - 1})`);
console.log(`loose touches/match: ${per(looseTouches)}   chest-band traps/match: ${per(traps)}   goals/match: ${per(goals)}`);
console.log(`rallies (≥3 loose, ≥2 players, <1.5s): ${per(rallies)}/match   touches in rallies: ${per(rallyTouches)}`);
console.log(`loose-touch SPEED band: slow≤6 ${per(band.slow)}  ctrl≤14 ${per(band.control)}  cushion14-20 ${per(band.cushion)}  deflect20-24 ${per(band.deflect)}  fast>24 ${per(band.fast)}`);
console.log(`loose-touch HEIGHT band: ground<0.4 ${per(height.ground)}  low<1.3 ${per(height.low)}  dead1.3-1.35 ${per(height.dead)}  air>1.35 ${per(height.air)}`);
