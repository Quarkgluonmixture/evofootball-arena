// Probe: orientation-aware receiving A/B (Phase 34.3). All metrics are
// recomputed from PUBLIC sim state, so the same script runs on any
// historical worktree for the baseline side:
//   git worktree add /tmp/efb-base phase-34.2
//   sed 's|\.\./\.\.|/tmp/efb-base|g' scripts/probes/orientation-ab.ts > /tmp/o.ts && npx tsx /tmp/o.ts
// Measures, per 32 same-seed matches:
//  1. back-to-goal PRESSURED receptions → possession retained 2.5s later
//  2. ST hold-up episodes per match (the pivot actually shielding)
//  3. wide pressured carriers: share of next-1.2s carry that went OUTWARD
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
let btgEpisodes = 0, btgRetained = 0;
let holdupEpisodes = 0;
let wideEpisodes = 0, wideOutward = 0, turnovers2s = 0;
for (let seed = 0; seed < N; seed++) {
  const m = new Match({ seed, teamA: team('A', 3000 + seed), teamB: team('B', 4000 + seed), duration: MATCH_DURATION });
  type Ep = { side: 0 | 1; until: number; kind: 'btg' | 'wide'; gid: number; y0: number; ySign: number; yMaxOut: number; carryUntil: number };
  const open: Ep[] = [];
  const cooldown = [0, 0];
  const inHold = [false, false];
  let prevOwnerGid: number | null = null;
  while (!m.finished) {
    m.step(DT);
    const t = m.simTime;
    // hold-up episode counting (entry edges), per side
    for (const side of [0, 1] as const) {
      const st = m.teams[side].players.find((q) => q.role === 'ST');
      const holding = st !== undefined && st.action.type === 'HoldUp';
      if (holding && !inHold[side]) holdupEpisodes++;
      inHold[side] = holding ?? false;
    }
    for (let i = open.length - 1; i >= 0; i--) {
      const ep = open[i];
      const c = m.allPlayers[ep.gid];
      if (ep.kind === 'wide' && t < ep.carryUntil && m.ball.owner === c) {
        ep.yMaxOut = Math.max(ep.yMaxOut, (c.pos.y - ep.y0) * ep.ySign);
      }
      if (t >= ep.until) {
        if (ep.kind === 'btg') {
          btgEpisodes++;
          if (m.possessionSide === ep.side) btgRetained++;
          else turnovers2s++;
        } else {
          wideEpisodes++;
          if (ep.yMaxOut > 0.6) wideOutward++;
        }
        open.splice(i, 1);
      }
    }
    // new receptions: owner changed to a pressured player
    const owner = m.ball.owner;
    if (owner && owner.gid !== prevOwnerGid && owner.role !== 'GK' && m.phase === 'playing') {
      const side = owner.side;
      if (t > cooldown[side]) {
        const tm = m.teams[side];
        const lx = tm.localX(owner.pos.x);
        let dMin = Infinity;
        for (const o of m.teams[1 - side].players) {
          if (!o.sentOff) dMin = Math.min(dMin, Math.hypot(o.pos.x - owner.pos.x, o.pos.y - owner.pos.y));
        }
        const pressured = dMin < 3.5;
        const backToGoal = owner.heading.x * tm.attackDir < -0.2;
        if (pressured && backToGoal && lx < 20) {
          open.push({ side, until: t + 2.5, kind: 'btg', gid: owner.gid, y0: owner.pos.y, ySign: 1, yMaxOut: 0, carryUntil: t });
          cooldown[side] = t + 3;
        } else if (pressured && Math.abs(owner.pos.y) > 10 && lx < 15) {
          open.push({
            side, until: t + 2.5, kind: 'wide', gid: owner.gid,
            y0: owner.pos.y, ySign: Math.sign(owner.pos.y), yMaxOut: 0, carryUntil: t + 1.2,
          });
          cooldown[side] = t + 3;
        }
      }
    }
    prevOwnerGid = owner ? owner.gid : null;
  }
}
console.log(`back-to-goal pressured receptions: ${btgEpisodes} · retained@2.5s ${((btgRetained / Math.max(btgEpisodes, 1)) * 100).toFixed(1)}%`);
console.log(`ST hold-up episodes/match: ${(holdupEpisodes / N).toFixed(2)}`);
console.log(`wide pressured receptions: ${wideEpisodes} · carried OUTWARD (≥0.6m within 1.2s): ${((wideOutward / Math.max(wideEpisodes, 1)) * 100).toFixed(1)}%`);
