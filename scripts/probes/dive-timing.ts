// Set-keeper probe (34.2): the render gate is a pure function of sim state,
// so one headless run measures BOTH presentations — how long the old code
// held the full dive pose before the ball arrived (= the whole
// GoalkeeperSave action) vs when the new gate launches (ETA<0.38s).
import { Match } from '../../src/sim/Match';
import { DT, MATCH_DURATION } from '../../src/sim/constants';
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

const N = 32;
type Ep = { t0: number; tArm: number | null; tEnd: number };
const eps: Ep[] = [];
const openBy = new Map<number, Ep>();
for (let seed = 0; seed < N; seed++) {
  const m = new Match({ seed, teamA: team('A', 5000 + seed), teamB: team('B', 6000 + seed), duration: MATCH_DURATION });
  openBy.clear();
  while (!m.finished) {
    m.step(DT);
    for (const side of [0, 1] as const) {
      const gk = m.teams[side].goalkeeper;
      const cur = openBy.get(side);
      const saving = gk.action.type === 'GoalkeeperSave';
      if (saving && !cur) {
        openBy.set(side, { t0: m.simTime, tArm: null, tEnd: 0 });
      }
      const ep = openBy.get(side);
      if (ep && saving && ep.tArm === null) {
        // The 34.2 gate, verbatim.
        const dx = m.ball.pos.x - gk.pos.x;
        const dy = m.ball.pos.y - gk.pos.y;
        const d = Math.hypot(dx, dy) || 1e-6;
        const closing = -(dx * m.ball.vel.x + dy * m.ball.vel.y) / d;
        const eta = closing > 4 ? d / closing : Infinity;
        if (eta <= 0.38 || d <= 1.6 || gk.saveAnimTimer > 0) ep.tArm = m.simTime;
      }
      if (ep && !saving) {
        ep.tEnd = m.simTime;
        eps.push(ep);
        openBy.delete(side);
      }
    }
  }
}
const durs = eps.map((e) => e.tEnd - e.t0);
const preArm = eps.filter((e) => e.tArm !== null).map((e) => e.tArm! - e.t0);
const postArm = eps.filter((e) => e.tArm !== null).map((e) => e.tEnd - e.tArm!);
const never = eps.filter((e) => e.tArm === null).length;
const q = (a: number[], p: number) => a.slice().sort((x, y) => x - y)[Math.floor(p * a.length)] ?? 0;
const mean = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
console.log(`dive-pose episodes: ${eps.length} (${(eps.length / N).toFixed(1)}/match)`);
console.log(`OLD: full pose for the whole action — mean ${mean(durs).toFixed(2)}s, p90 ${q(durs, 0.9).toFixed(2)}s`);
console.log(`NEW: set crouch first — waits mean ${mean(preArm).toFixed(2)}s, p90 ${q(preArm, 0.9).toFixed(2)}s before launching`);
console.log(`NEW: airborne stretch lasts mean ${mean(postArm).toFixed(2)}s (was the whole thing)`);
console.log(`never launched at all (ball never actually arrived): ${never} (${((never / eps.length) * 100).toFixed(0)}% — the old code flopped on ALL of these)`);
