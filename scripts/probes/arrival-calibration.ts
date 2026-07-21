// Probe: ARRIVAL CALIBRATION (BASELINE-NOW — docs/PROBE-CONTRACTS.md §5, the
// "reliability-curve half"; the prediction-MAE half waits for S4). For every pass,
// at the KICK it computes the intended receiver's ETA to the ball vs the nearest
// defender's ETA (both via the engine's own interceptBall solver), then buckets by
// the signed MARGIN (defenderETA − receiverETA; +ve = receiver gets there first) and
// records the OUTCOME: received / intercepted / died-in-flight, and stable@1.5s.
// The expected shape: margin ↑ → received ↑; margin ↓ (defender first) → intercepted ↑;
// near zero → most contested. This is the structural acceptance curve for slice-1's
// pass/affordance work — a truer signal than any absolute completion %.
//   npx tsx scripts/probes/arrival-calibration.ts [matches] [seedOffset]
import { Match } from '../../src/sim/Match';
import { CONTROL_RADIUS, DT } from '../../src/sim/constants';
import { interceptBall } from '../../src/ai/perception';
import { timeToReach } from '../../src/ai/reachability';
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

const LABELS = ['<-0.5', '-0.5..-0.2', '-0.2..0', '0..0.2', '0.2..0.5', '>0.5'];
const marginBucket = (mgn: number): number =>
  mgn < -0.5 ? 0 : mgn < -0.2 ? 1 : mgn < 0 ? 2 : mgn < 0.2 ? 3 : mgn <= 0.5 ? 4 : 5;
const makeBuckets = () => LABELS.map(() => ({ n: 0, received: 0, intercepted: 0, died: 0, stable: 0 }));
const legacyBuckets = makeBuckets();
const reachBuckets = makeBuckets();
const byKind = new Map<string, { n: number; received: number; intercepted: number }>();
const kindOf = (k: string): { n: number; received: number; intercepted: number } => {
  let o = byKind.get(k);
  if (!o) { o = { n: 0, received: 0, intercepted: 0 }; byKind.set(k, o); }
  return o;
};

interface Tracked {
  passerGid: number;
  targetGid: number;
  side: 0 | 1;
  kickT: number;
  mgnBucket: number;
  reachBucket: number;
  kind: string;
  ints0: number;
}

for (let seed = OFF; seed < OFF + N; seed++) {
  const m = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240 });
  const ints = (): number => m.teams[0].stats.interceptions + m.teams[1].stats.interceptions;
  let prevPass = m.pendingPass;
  let tracked: Tracked | null = null;
  const stableChecks: Array<{ side: 0 | 1; t: number; legacy: number; reach: number }> = [];

  const resolve = (tr: Tracked): void => {
    const lcp = m.lastCompletedPass;
    const received = !!lcp && lcp.passerGid === tr.passerGid && lcp.t >= tr.kickT;
    const intercepted = !received && ints() > tr.ints0;
    const legacy = legacyBuckets[tr.mgnBucket];
    const reach = reachBuckets[tr.reachBucket];
    legacy.n++;
    reach.n++;
    const kd = kindOf(tr.kind);
    kd.n++;
    if (received) {
      legacy.received++;
      reach.received++;
      kd.received++;
      stableChecks.push({ side: tr.side, t: m.simTime, legacy: tr.mgnBucket, reach: tr.reachBucket });
    } else if (intercepted) {
      legacy.intercepted++;
      reach.intercepted++;
      kd.intercepted++;
    } else {
      legacy.died++;
      reach.died++;
    }
  };

  while (!m.finished) {
    m.step(DT);
    const pass = m.pendingPass;
    if (pass !== prevPass) {
      if (tracked) resolve(tracked);
      tracked = null;
      if (pass && m.phase === 'playing') {
        const passer = m.allPlayers[pass.passerGid];
        const target = m.allPlayers[pass.targetGid];
        if (passer && target) {
          const side = passer.side as 0 | 1;
          const opp = m.teams[side === 0 ? 1 : 0].players.filter((p) => !p.sentOff);
          const rs = interceptBall(target, m.ball);
          const recvETA = rs.reachable ? rs.tMe : 999;
          const recvReachETA = rs.reachable
            ? timeToReach(target, rs.point, { reachRadius: CONTROL_RADIUS })
            : 999;
          let defMin = 999;
          let defReachMin = 999;
          for (const d of opp) {
            const s = interceptBall(d, m.ball);
            const e = s.reachable ? s.tMe : 999;
            if (e < defMin) defMin = e;
            const reachEta = s.reachable
              ? timeToReach(d, s.point, { reachRadius: CONTROL_RADIUS })
              : 999;
            if (reachEta < defReachMin) defReachMin = reachEta;
          }
          const mgn = defMin - recvETA; // +ve = receiver arrives first
          const reachMgn = defReachMin - recvReachETA;
          tracked = {
            passerGid: pass.passerGid, targetGid: pass.targetGid, side,
            kickT: m.simTime, mgnBucket: marginBucket(mgn), reachBucket: marginBucket(reachMgn),
            kind: m.lastPassKind?.kind ?? 'pass', ints0: ints(),
          };
        }
      }
    }
    prevPass = pass;
    for (let i = stableChecks.length - 1; i >= 0; i--) {
      const s = stableChecks[i];
      if (m.simTime >= s.t + 1.5) {
        if (m.possessionSide === s.side) {
          legacyBuckets[s.legacy].stable++;
          reachBuckets[s.reach].stable++;
        }
        stableChecks.splice(i, 1);
      }
    }
  }
  if (tracked) resolve(tracked);
}

const p = (v: number, d: number): string => `${((v / Math.max(d, 1)) * 100).toFixed(0)}%`;
const total = legacyBuckets.reduce((a, b) => a + b.n, 0);
console.log(`n=${N} (seeds ${OFF}-${OFF + N - 1})   passes tracked ${(total / N).toFixed(1)}/match`);
const printCurve = (name: string, buckets: ReturnType<typeof makeBuckets>): void => {
  console.log(`\n${name} — arrival margin (defenderETA − receiverETA) → outcome:`);
  console.log(`  margin        share   received  interc.  died   stable@1.5s(of recv)`);
  for (let i = 0; i < buckets.length; i++) {
    const b = buckets[i];
    console.log(
      `  ${LABELS[i].padEnd(11)} ${p(b.n, total).padStart(5)}   ${p(b.received, b.n).padStart(6)}   ${p(b.intercepted, b.n).padStart(5)}  ${p(b.died, b.n).padStart(5)}   ${p(b.stable, b.received).padStart(5)}`,
    );
  }
};
printCurve('legacy interceptBall reliability', legacyBuckets);
printCurve('S1 kinematic timeToReach reliability', reachBuckets);
console.log(`\nby pass kind:`);
for (const [k, o] of [...byKind.entries()].sort((a, b) => b[1].n - a[1].n)) {
  console.log(`  ${k.padEnd(8)} ${(o.n / N).toFixed(1)}/match   received ${p(o.received, o.n)}   intercepted ${p(o.intercepted, o.n)}`);
}
