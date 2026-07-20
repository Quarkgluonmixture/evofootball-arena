// Probe: RECEPTION SURVIVAL (BASELINE-NOW — docs/PROBE-CONTRACTS.md §5). First-touch
// itself is covered by spill-anatomy; this measures the 1.5s AFTER a completed pass —
// does "received the ball" actually become usable possession, or a stop-dead / instant
// turnover? On each `lastCompletedPass` it tracks the receiver: stableControl@0.5s &
// @1.5s, forwardReady@1.0s (turned toward goal), nextOptionCount at reception (open
// mates), receiveToTurnover@1.5s, receiveToProgression@1.5s (advanced upfield). New
// arrival systems that only raise "ball reaches a body" but leave him back-to-goal /
// dispossessed won't move these — that's the point.
//   npx tsx scripts/probes/reception-survival.ts [matches] [seedOffset]
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { laneOpenness } from '../../src/ai/perception';
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

const N = Number(process.argv[2] ?? 120);
const OFF = Number(process.argv[3] ?? 0);

let receptions = 0;
let teamRetain05 = 0;
let teamRetain15 = 0;
let stable05 = 0;
let stable15 = 0;
let forwardReady = 0;
let optionSum = 0;
let turnover = 0;
let progression = 0;
let goals = 0;

interface Pend {
  gid: number;
  side: 0 | 1;
  t: number;
  x0: number; // localX of the ball at reception (own attack frame)
  c05: boolean;
  c10: boolean;
}

for (let seed = OFF; seed < OFF + N; seed++) {
  const m = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240 });
  let prevLcp = m.lastCompletedPass;
  const pend: Pend[] = [];
  while (!m.finished) {
    m.step(DT);
    const b = m.ball;
    const owner = b.owner;

    // A completed pass just landed → start tracking its receiver.
    const lcp = m.lastCompletedPass;
    if (lcp && lcp !== prevLcp && m.phase === 'playing') {
      const recv = m.allPlayers[lcp.receiverGid];
      if (recv && !recv.sentOff) {
        receptions++;
        const side = recv.side as 0 | 1;
        const own = m.teams[side];
        const opp = m.teams[side === 0 ? 1 : 0];
        // open mates NOW (a clear lane to them): the receiver's usable options.
        const oppPlayers = opp.players.filter((p) => !p.sentOff);
        let opts = 0;
        for (const mate of own.players) {
          if (mate === recv || mate.sentOff) continue;
          if (laneOpenness(recv.pos, mate.pos, oppPlayers) > 0.7) opts++;
        }
        optionSum += opts;
        pend.push({ gid: recv.gid, side, t: m.simTime, x0: own.localX(b.pos.x), c05: false, c10: false });
      }
    }
    prevLcp = lcp;

    // Resolve tracked receptions at their checkpoints.
    for (let i = pend.length - 1; i >= 0; i--) {
      const r = pend[i];
      const own = m.teams[r.side];
      if (!r.c05 && m.simTime >= r.t + 0.5) {
        if (owner && owner.gid === r.gid) stable05++;
        if (m.possessionSide === r.side) teamRetain05++; // sticky: counts our pass in flight too
        r.c05 = true;
      }
      if (!r.c10 && m.simTime >= r.t + 1.0) {
        // turned to attack: owner still the receiver AND heading toward the opp goal.
        if (owner && owner.gid === r.gid && owner.heading.x * own.attackDir > 0.3) forwardReady++;
        r.c10 = true;
      }
      if (m.simTime >= r.t + 1.5) {
        if (owner && owner.gid === r.gid) stable15++;
        if (m.possessionSide === r.side) teamRetain15++;
        if (m.possessionSide === (1 - r.side)) turnover++;
        if (own.localX(b.pos.x) - r.x0 > 2) progression++;
        pend.splice(i, 1);
      }
    }
  }
  goals += m.score[0] + m.score[1];
}

const pct = (v: number): string => `${((v / Math.max(receptions, 1)) * 100).toFixed(1)}%`;
console.log(`n=${N} (seeds ${OFF}-${OFF + N - 1})   goals/match ${(goals / N).toFixed(2)}`);
console.log(`receptions tracked/match: ${(receptions / N).toFixed(2)}`);
console.log(`teamRetains@0.5s: ${pct(teamRetain05)}   @1.5s: ${pct(teamRetain15)}   (our ball, ANY player — the survival signal)`);
console.log(`sameReceiver holds@0.5s: ${pct(stable05)}   @1.5s: ${pct(stable15)}   (low = fast release, NOT loss)`);
console.log(`forwardReady@1.0s (turned to goal, still owns): ${pct(forwardReady)}`);
console.log(`nextOptionCount at reception (open mates, mean): ${(optionSum / Math.max(receptions, 1)).toFixed(2)}`);
console.log(`receiveToTurnover@1.5s (opponent has it): ${pct(turnover)}`);
console.log(`receiveToProgression@1.5s (ball +2m upfield): ${pct(progression)}`);
