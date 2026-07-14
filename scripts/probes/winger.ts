// Diagnostic: the winger's game (user: "边锋被紧逼太紧,没有用 (更多无球跑?)").
// Per role, aggregated: receptions/match, how tightly marked at reception
// (nearest opponent), how long they keep it, and the OFF-BALL action mix while
// their side has the ball (are wingers just standing on a spot, never running?).
//   npx tsx scripts/probes/winger.ts [seedOffset]
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo, type Role } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

const N = 150;
const OFF = Number(process.argv[2] ?? 0);
const ROLES: Role[] = ['DF', 'MF', 'WG', 'ST'];
const z = (): Record<Role, number> => ({ GK: 0, DF: 0, MF: 0, WG: 0, ST: 0 });

const receptions = z();
const pressSum = z();       // nearest-opp distance at reception (smaller = tighter mark)
const holdSum = z();        // seconds held after reception
const lostFast = z();       // receptions where the SIDE lost it to opp within 1s
const targeted = z();       // times a teammate's pass targeted this role
const received = z();       // ...and it arrived
// Off-ball action ticks while OWN side has possession and player is not the owner.
const offMakeRun = z(), offSupport = z(), offSpot = z(), offOther = z();

for (let seed = OFF; seed < OFF + N; seed++) {
  const m = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240 });
  let prevOwnerGid = -1;
  let liveRecv: { gid: number; role: Role; side: number; start: number } | null = null;
  while (!m.finished) {
    m.step(DT);
    if (m.phase !== 'playing') continue;
    const o = m.ball.owner;
    // Reception (fresh owner).
    if (o && o.gid !== prevOwnerGid && o.role !== 'GK') {
      receptions[o.role]++;
      let near = Infinity;
      for (const q of m.teams[1 - o.side].players) {
        if (q.sentOff) continue;
        const d = Math.hypot(q.pos.x - o.pos.x, q.pos.y - o.pos.y);
        if (d < near) near = d;
      }
      pressSum[o.role] += near;
      if (liveRecv) holdSum[liveRecv.role] += m.simTime - liveRecv.start; // prev hold ended
      liveRecv = { gid: o.gid, role: o.role, side: o.side, start: m.simTime };
      // pass bookkeeping: was this the intended target?
      const lp = m.lastCompletedPass;
      if (lp && lp.receiverGid === o.gid && lp.t === m.simTime) received[o.role]++;
    } else if (!o && liveRecv) {
      holdSum[liveRecv.role] += m.simTime - liveRecv.start;
      liveRecv = null;
    }
    // Did the side lose it fast? track when opp gains within 1s of a reception.
    if (o && liveRecv && o.side !== liveRecv.side && m.simTime - liveRecv.start < 1) {
      lostFast[liveRecv.role]++;
      liveRecv = null;
    }
    prevOwnerGid = o ? o.gid : -1;
    // Pending pass target role.
    const pp = m.pendingPass;
    if (pp && pp.t === m.simTime) {
      const tgt = m.allPlayers[pp.targetGid];
      if (tgt && tgt.side === pp.side) targeted[tgt.role]++;
    }
    // Off-ball action mix (own possession, not owner).
    for (const p of m.allPlayers) {
      if (p.role === 'GK' || p.sentOff) continue;
      if (m.possessionSide !== p.side) continue;
      if (o && o.gid === p.gid) continue;
      const a = p.action.type;
      if (a === 'MakeRun') offMakeRun[p.role]++;
      else if (a === 'SupportBallCarrier') offSupport[p.role]++;
      else if (a === 'MoveToFormationSpot' || a === 'HoldPosition') offSpot[p.role]++;
      else offOther[p.role]++;
    }
  }
}

const per = (v: number): string => (v / N).toFixed(2);
console.log(`n=${N} (seeds ${OFF}-${OFF + N - 1})   [WG counts are TWO wingers combined]`);
console.log('role   recv/m  mark@recv  hold(s)  lost<1s%   targeted/m  arrived/m');
for (const r of ROLES) {
  const rc = receptions[r] || 1;
  console.log(
    `${r.padEnd(6)} ${per(receptions[r]).padStart(6)}  ${(pressSum[r] / rc).toFixed(2).padStart(7)}m  ${(holdSum[r] / rc).toFixed(2).padStart(6)}  ${((lostFast[r] / rc) * 100).toFixed(0).padStart(6)}%   ${per(targeted[r]).padStart(8)}   ${per(received[r]).padStart(7)}`,
  );
}
console.log('\noff-ball action mix while OWN side has the ball (% of ticks):');
console.log('role    MakeRun  Support  HoldSpot  other');
for (const r of ROLES) {
  const tot = offMakeRun[r] + offSupport[r] + offSpot[r] + offOther[r] || 1;
  const p = (v: number): string => `${((v / tot) * 100).toFixed(0)}%`;
  console.log(`${r.padEnd(6)}  ${p(offMakeRun[r]).padStart(6)}  ${p(offSupport[r]).padStart(6)}  ${p(offSpot[r]).padStart(7)}  ${p(offOther[r]).padStart(5)}`);
}
