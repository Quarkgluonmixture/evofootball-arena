// Probe: 脱压带球 A/B (Phase 34.2). The predicate is COPIED here so the same
// script runs on ANY historical tree — for the baseline side:
//   git worktree add /tmp/efb-base <tag> && (point imports there) && npx tsx
// Same seeds both builds; compare retained@3s and backward-carry meters.
// Original note: same seeds, run against the CURRENT build and (via
// git stash) the baseline. The predicate is COPIED here so the probe runs
// identically on a tree that doesn't have escapeCarry yet.
import { Match } from '../../src/sim/Match';
import { DT, HALF_L, MATCH_DURATION } from '../../src/sim/constants';
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

// --- standalone copy of the escape situation predicate (34.2 thresholds) ---
type P = { pos: { x: number; y: number }; sentOff: boolean };
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
function pressureAt(pos: { x: number; y: number }, opps: P[]): number {
  let best = Infinity;
  for (const o of opps) if (!o.sentOff) best = Math.min(best, Math.hypot(o.pos.x - pos.x, o.pos.y - pos.y));
  return clamp01(1 - best / 6);
}
function spaceAhead(pos: { x: number; y: number }, dir: { x: number; y: number }, opps: P[]): number {
  const l = Math.hypot(dir.x, dir.y) || 1;
  const probe = { x: pos.x + (dir.x / l) * 7, y: pos.y + (dir.y / l) * 7 };
  let crowd = 0;
  for (const o of opps) {
    if (o.sentOff) continue;
    const d = Math.hypot(o.pos.x - probe.x, o.pos.y - probe.y);
    if (d < 8) crowd += 1 - d / 8;
  }
  return clamp01(1 - crowd / 2);
}
function escapeSituation(carrier: P, attackDir: number, localX: number, opps: P[]): boolean {
  if (localX > 15) return false;
  if (pressureAt(carrier.pos, opps) < 0.45) return false;
  let rx = 0, ry = 0;
  for (const o of opps) {
    if (o.sentOff) continue;
    const dx = carrier.pos.x - o.pos.x;
    const dy = carrier.pos.y - o.pos.y;
    const d2 = dx * dx + dy * dy;
    if (d2 > 64 || d2 < 1e-6) continue;
    rx += dx / d2; ry += dy / d2;
  }
  if (rx === 0 && ry === 0) return false;
  ry += Math.sign(ry || carrier.pos.y || 1) * 0.35 * Math.hypot(rx, ry);
  const l = Math.hypot(rx, ry) || 1;
  if (spaceAhead(carrier.pos, { x: attackDir, y: 0 }, opps) > 0.55) return false;
  return spaceAhead(carrier.pos, { x: rx / l, y: ry / l }, opps) >= 0.25;
}

// --- episodes: pressured back-field carrier, front closed. Track outcome. ---
const N = 32;
let episodes = 0, retained = 0, backSum = 0, backN = 0;
for (let seed = 0; seed < N; seed++) {
  const m = new Match({ seed, teamA: team('A', 3000 + seed), teamB: team('B', 4000 + seed), duration: MATCH_DURATION });
  type Ep = { side: 0 | 1; until: number; gid: number; x0: number; minX: number; carryUntil: number };
  const open: Ep[] = [];
  const cooldown = [0, 0];
  while (!m.finished) {
    m.step(DT);
    const t = m.simTime;
    for (let i = open.length - 1; i >= 0; i--) {
      const ep = open[i];
      const carrier = m.allPlayers[ep.gid];
      const tm = m.teams[ep.side];
      if (t < ep.carryUntil && m.ball.owner === carrier) ep.minX = Math.min(ep.minX, tm.localX(carrier.pos.x));
      if (t >= ep.until) {
        episodes++;
        if (m.possessionSide === ep.side) retained++;
        backSum += Math.max(0, ep.x0 - ep.minX);
        backN++;
        open.splice(i, 1);
      }
    }
    const c = m.ball.owner;
    if (c && c.role !== 'GK' && m.phase === 'playing') {
      const side = c.side;
      if (t > cooldown[side]) {
        const tm = m.teams[side];
        const lx = tm.localX(c.pos.x);
        if (escapeSituation(c, tm.attackDir, lx, m.teams[1 - side].players)) {
          open.push({ side, until: t + 3, gid: c.gid, x0: lx, minX: lx, carryUntil: t + 1.5 });
          cooldown[side] = t + 4;
        }
      }
    }
  }
}
console.log(
  `episodes/match ${(episodes / N).toFixed(1)} · retained@3s ${((retained / episodes) * 100).toFixed(1)}% · ` +
  `mean backward carry (1.5s, while on the ball) ${(backSum / backN).toFixed(2)}m`,
);
