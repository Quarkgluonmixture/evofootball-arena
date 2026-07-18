// Probe (Phase 112 pre-work): what do teams DO in the 3 seconds after a
// turnover TODAY? The counter-defense audit found six channels answering a
// RUNNING counter (cover/jockey/chasers/slide/grab/keeper) but no gene on
// the transition INSTANT — and launch-anatomy showed 69-78% of breakaways
// are carry-throughs born in that window. Before pricing gegenpress vs
// drop-and-recover, measure the current substrate response:
//   pressers   — max simultaneous losing-team bodies engaged at the ball
//   latency    — time to first losing-team contact (≤2m of the ball)
//   retreat    — goalward drift of the NON-engaged losers over the window
//   regain     — losing side has the ball again within 6s
//   launch     — winner reaches a breakaway band entry within 8s
// Split by turnover zone (where the loser lost it, in the loser's frame)
// and by the loser's pressIntensity (does the existing gene already
// differentiate the window?). Observation only.
//   npx tsx scripts/probes/transition-anatomy.ts [gens]
import { League } from '../../src/sim/League';
import { DT, HALF_L } from '../../src/sim/constants';
import type { Match } from '../../src/sim/Match';
import type { Side } from '../../src/sim/types';

const GENS = Number(process.argv[2] ?? 22);
const ENTRY_X = HALF_L - 15;
const WINDOW = 3.0;

interface Episode {
  loser: Side;
  t0: number;
  zone: string; // loser-frame ball localX at the flip
  hiPress: boolean;
  startX: number[]; // loser outfielders' localX at t0 (by index)
  engaged: Set<number>;
  maxEngaged: number;
  chaserSum: number;
  chaserSamples: number;
  latency: number | null;
  windowClosed: boolean;
  retreat: number | null;
  regained: boolean;
  launched: boolean;
  done: boolean;
}

interface Bucket {
  n: number;
  maxEngaged: number;
  chasers: number;
  latencySum: number;
  latencyN: number;
  retreatSum: number;
  retreatN: number;
  regains: number;
  launches: number;
}

const mkBucket = (): Bucket => ({
  n: 0, maxEngaged: 0, chasers: 0, latencySum: 0, latencyN: 0,
  retreatSum: 0, retreatN: 0, regains: 0, launches: 0,
});

for (const seed of [991, 424242]) {
  const league = new League({ seed });
  for (let g = 0; g < GENS - 2; g++) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    }
    league.finishSeason();
  }

  const buckets = new Map<string, Bucket>();
  let turnovers = 0;
  let matches = 0;

  const zoneOf = (lx: number): string => (lx > 10 ? 'attacking' : lx < -10 ? 'deep' : 'middle');

  const collect = (m: Match, eps: Episode[]): void => {
    const ball = m.ball;
    for (const ep of eps) {
      if (ep.done) continue;
      const dt = m.simTime - ep.t0;
      const loserTeam = m.teams[ep.loser];
      if (!ep.windowClosed && dt <= WINDOW && m.phase === 'playing') {
        let engagedNow = 0;
        for (const p of loserTeam.players) {
          if (p.role === 'GK' || p.sentOff) continue;
          const dx = ball.pos.x - p.pos.x;
          const dy = ball.pos.y - p.pos.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const closing = d > 1e-6 ? (p.vel.x * dx + p.vel.y * dy) / d : 0;
          if (d < 6 && closing > 1) {
            engagedNow++;
            ep.engaged.add(p.index);
          }
          if (d < 2 && ep.latency === null) ep.latency = dt;
        }
        ep.maxEngaged = Math.max(ep.maxEngaged, engagedNow);
        ep.chaserSum += loserTeam.chasers.size;
        ep.chaserSamples++;
      } else if (!ep.windowClosed) {
        ep.windowClosed = true;
        // Retreat: mean goalward gain of the outfielders who never engaged.
        let sum = 0;
        let n = 0;
        for (const p of loserTeam.players) {
          if (p.role === 'GK' || p.sentOff || ep.engaged.has(p.index)) continue;
          const s0 = ep.startX[p.index];
          if (s0 === undefined) continue;
          sum += s0 - loserTeam.localX(p.pos.x); // + = moved toward own goal
          n++;
        }
        ep.retreat = n > 0 ? sum / n : null;
      }
      if (!ep.regained && dt <= 6 && m.possessionSide === ep.loser) ep.regained = true;
      // Launch: the winner's carrier crosses the entry band with nobody
      // goal-side (launch-anatomy's breakaway test).
      const o = ball.owner;
      if (!ep.launched && dt <= 8 && o && o.side !== ep.loser && o.role !== 'GK' && m.phase === 'playing') {
        const wt = m.teams[o.side];
        const ox = wt.localX(o.pos.x);
        if (ox >= ENTRY_X) {
          const gs = loserTeam.players.some(
            (q) => q.role !== 'GK' && !q.sentOff && wt.localX(q.pos.x) > ox,
          );
          if (!gs) ep.launched = true;
        }
      }
      if (dt > 8 && ep.windowClosed) {
        ep.done = true;
        const key = `${ep.zone}|${ep.hiPress ? 'hiPress' : 'loPress'}`;
        let b = buckets.get(key);
        if (!b) buckets.set(key, (b = mkBucket()));
        b.n++;
        b.maxEngaged += ep.maxEngaged;
        b.chasers += ep.chaserSamples > 0 ? ep.chaserSum / ep.chaserSamples : 0;
        if (ep.latency !== null) {
          b.latencySum += ep.latency;
          b.latencyN++;
        }
        if (ep.retreat !== null) {
          b.retreatSum += ep.retreat;
          b.retreatN++;
        }
        if (ep.regained) b.regains++;
        if (ep.launched) b.launches++;
      }
    }
  };

  for (let g = 0; g < 2; g++) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      const m = league.createMatch(fx);
      matches++;
      const eps: Episode[] = [];
      let prevPos: Side | -1 = -1;
      while (!m.finished) {
        m.step(DT);
        const pos = m.possessionSide;
        if (
          pos !== -1 && prevPos !== -1 && pos !== prevPos &&
          m.phase === 'playing' && m.restartKickGid === null
        ) {
          const loser = prevPos as Side;
          const lt = m.teams[loser];
          turnovers++;
          const startX: number[] = [];
          for (const p of lt.players) startX[p.index] = lt.localX(p.pos.x);
          eps.push({
            loser,
            t0: m.simTime,
            zone: zoneOf(lt.localX(m.ball.pos.x)),
            hiPress: lt.genome.pressIntensity > 0.5,
            startX,
            engaged: new Set(),
            maxEngaged: 0,
            chaserSum: 0,
            chaserSamples: 0,
            latency: null,
            windowClosed: false,
            retreat: null,
            regained: false,
            launched: false,
            done: false,
          });
        }
        if (pos !== -1) prevPos = pos;
        collect(m, eps);
      }
      league.applyResult(fx, m.getResult());
    }
    league.finishSeason();
  }

  console.log(`\nworld ${seed} (gens ${GENS - 2}→${GENS}): ${turnovers} open-play turnovers / ${matches} matches (${(turnovers / matches).toFixed(1)}/match)`);
  console.log('  zone      press    n    maxEng  chasers  latency  retreat  regain6s  launch8s');
  const keys = [...buckets.keys()].sort();
  for (const key of keys) {
    const b = buckets.get(key)!;
    const [zone, press] = key.split('|');
    console.log(
      `  ${zone.padEnd(9)} ${press.padEnd(7)} ${String(b.n).padStart(4)}` +
      `  ${(b.maxEngaged / b.n).toFixed(2).padStart(6)}` +
      `  ${(b.chasers / b.n).toFixed(2).padStart(7)}` +
      `  ${(b.latencyN > 0 ? (b.latencySum / b.latencyN).toFixed(2) : '—').padStart(7)}s` +
      `  ${(b.retreatN > 0 ? (b.retreatSum / b.retreatN).toFixed(2) : '—').padStart(6)}m` +
      `  ${((b.regains / b.n) * 100).toFixed(0).padStart(7)}%` +
      `  ${((b.launches / b.n) * 100).toFixed(0).padStart(7)}%`,
    );
  }
}
