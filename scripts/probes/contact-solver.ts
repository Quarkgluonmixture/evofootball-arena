/**
 * M1 mechanism probe — the position-only overlap solver leaves both bodies'
 * closing normal velocity intact, so the same pair drives straight back into
 * penetration on the next tick. A frozen two-body scene measures the direct
 * mediator, not match outcomes:
 *
 *   npx tsx scripts/probes/contact-solver.ts
 */
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { DT, PLAYER_MIN_DIST } from '../../src/sim/constants';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

type SolverAccess = { resolveOverlaps(): void };

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name,
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `${name}${i}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

const solve = (m: Match): void => {
  (m as unknown as SolverAccess).resolveOverlaps();
};

const distance = (a: Player, b: Player): number =>
  Math.hypot(a.pos.x - b.pos.x, a.pos.y - b.pos.y);

/** Closing speed along the current centre normal; 0 means separating/tangent. */
const inwardSpeed = (a: Player, b: Player): number => {
  const dx = a.pos.x - b.pos.x;
  const dy = a.pos.y - b.pos.y;
  const d = Math.hypot(dx, dy);
  if (d < 1e-8) return 0;
  const relativeNormal = (a.vel.x - b.vel.x) * (dx / d) + (a.vel.y - b.vel.y) * (dy / d);
  return Math.max(0, -relativeNormal);
};

interface Result {
  oneShotInwardBefore: number;
  oneShotInwardAfter: number;
  oneShotSeparation: number;
  meanPreSolvePenetration: number;
  meanPostSolveInward: number;
  maxPostSolveError: number;
}

function run(nx: number, ny: number): Result {
  const m = new Match({ seed: 91, teamA: team('A', 1), teamB: team('B', 2), duration: 1 });
  const a = m.teams[0].players[1];
  const b = m.teams[1].players[1];

  // Keep every unrelated core outside the pair scan.
  for (const p of m.allPlayers) p.pos = { x: 100 + p.gid * 10, y: 100 };
  a.pos = { x: -nx * 0.5, y: -ny * 0.5 };
  b.pos = { x: nx * 0.5, y: ny * 0.5 };
  a.vel = { x: nx * 4, y: ny * 4 };
  b.vel = { x: -nx * 4, y: -ny * 4 };
  a.desiredVel = { ...a.vel };
  b.desiredVel = { ...b.vel };

  const oneShotInwardBefore = inwardSpeed(a, b);
  solve(m);
  const oneShotInwardAfter = inwardSpeed(a, b);
  const oneShotSeparation = distance(a, b);

  let penetration = 0;
  let postInward = 0;
  let maxPostSolveError = 0;
  const frames = 120;
  for (let i = 0; i < frames; i++) {
    a.physicsStep(DT);
    b.physicsStep(DT);
    penetration += Math.max(0, PLAYER_MIN_DIST - distance(a, b));
    solve(m);
    postInward += inwardSpeed(a, b);
    maxPostSolveError = Math.max(maxPostSolveError, Math.abs(distance(a, b) - PLAYER_MIN_DIST));
  }

  return {
    oneShotInwardBefore,
    oneShotInwardAfter,
    oneShotSeparation,
    meanPreSolvePenetration: penetration / frames,
    meanPostSolveInward: postInward / frames,
    maxPostSolveError,
  };
}

const axis = run(1, 0);
const invSqrt2 = 1 / Math.sqrt(2);
const diagonal = run(invSqrt2, invSqrt2);

const line = (name: string, r: Result): void => {
  console.log(
    `${name}: one-shot inward ${r.oneShotInwardBefore.toFixed(3)}→${r.oneShotInwardAfter.toFixed(3)} m/s` +
    ` · separation ${r.oneShotSeparation.toFixed(6)}m` +
    ` · 120f mean penetration ${r.meanPreSolvePenetration.toFixed(6)}m` +
    ` · post-solve inward ${r.meanPostSolveInward.toFixed(3)} m/s` +
    ` · separation error ${r.maxPostSolveError.toExponential(2)}m`,
  );
};

console.log('M1 CONTACT-SOLVER MECHANISM');
line('axis', axis);
line('diag', diagonal);
