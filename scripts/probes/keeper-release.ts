/**
 * Probe (the spill/keeper-release re-examination, 2026-07-18): the user's
 * two playtest reports —
 *   (1) first-touch SPILLS are everywhere (停球失误), and
 *   (2) the keeper's release hits an opponent and bounces back into his own
 *       box (开球开到对面人身上,又弹回禁区).
 *
 * Distinguishes the two keeper-release code paths at HEAD:
 *   - GOAL KICK: taken from the FEET, routed through the normal pass loop,
 *     which DOES check laneOpenness (lane-aware).
 *   - HANDS distribution (throw / sling / punt): target chosen by
 *     opennessOf(receiver) ONLY — the LANE between keeper and mate is never
 *     read (PlayerBrain.ts ~703-752). Hypothesis: this is the bounce-back.
 *
 * For every keeper release (detected via a fresh pendingPass whose passer is
 * a GK), snapshots the lane openness to the chosen target and then watches
 * the resolution: first outfielder to OWN the ball = complete-to-mate vs
 * turnover-to-opponent vs loose-spill. Turnovers are located (own defensive
 * third?) and charged a shot-against within 8s. Also the league-wide
 * first-touch spill rate (miscontrols) for context.
 *
 *   npx tsx scripts/probes/keeper-release.ts [gens]
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { League } from '../../src/sim/League';
import { DT, HALF_L } from '../../src/sim/constants';
import { laneOpenness } from '../../src/ai/perception';
import type { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';

const GENS = Number(process.argv[2] ?? 21);
const TAG = process.env.SNAP_TAG ? `-${process.env.SNAP_TAG}` : '';

function loadWorld(seed: number): League {
  const path = `/tmp/evo-snap${TAG}-${seed}-g${GENS}.json`;
  if (existsSync(path)) return League.fromJSON(JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>);
  const league = new League({ seed });
  for (let g = 0; g < GENS; g++) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    }
    league.finishSeason();
  }
  writeFileSync(path, JSON.stringify(league.toJSON()));
  return league;
}

interface Release {
  kind: 'goalKick' | 'hands';
  side: number;
  targetGid: number;
  laneOpen: number;
  t: number;
  resolved: boolean;
}

for (const seed of [991, 424242]) {
  const league = loadWorld(seed);
  let matches = 0;
  const blank = (): {
    n: number; laneSum: number; blockedLane: number;
    complete: number; spillByReceiver: number; laneHit: number;
    intercepted: number; other: number; turnDefThird: number;
  } => ({
    n: 0, laneSum: 0, blockedLane: 0,
    complete: 0, spillByReceiver: 0, laneHit: 0, intercepted: 0, other: 0, turnDefThird: 0,
  });
  const tally = { goalKick: blank(), hands: blank() };
  let miscontrols = 0;
  let shotsFor = 0;

  while (!league.seasonDone) {
    const fx = league.nextFixture()!;
    const m: Match = league.createMatch(fx);
    matches++;
    let lastPassT = -1;
    const pending: Release[] = [];
    // gkDistributing is cleared the instant the keeper kicks — capture the
    // PREVIOUS tick's value so we can tell a hands release from a goal kick.
    const prevDist = new Map<number, boolean>();

    while (!m.finished) {
      const preDist = new Map(prevDist);
      m.step(DT);
      const b = m.ball;

      // --- detect a fresh keeper release ---
      const pp = m.pendingPass;
      if (pp && pp.t !== lastPassT) {
        lastPassT = pp.t;
        const passer = m.teams[pp.side].players.find((q) => q.gid === pp.passerGid);
        if (passer && passer.role === 'GK') {
          const target = m.teams[pp.side].players.find((q) => q.gid === pp.targetGid);
          if (target) {
            const kind: 'goalKick' | 'hands' = preDist.get(passer.gid) ? 'hands' : 'goalKick';
            const opp = m.teams[1 - pp.side].players;
            const lane = laneOpenness(passer.pos, target.pos, opp);
            pending.push({ kind, side: pp.side, targetGid: pp.targetGid, laneOpen: lane, t: m.simTime, resolved: false });
            tally[kind].n++;
            tally[kind].laneSum += lane;
            if (lane < 0.35) tally[kind].blockedLane++;
          }
        }
      }

      // --- resolve on the FIRST outfield touch after release ---
      if (pending.length && b.lastTouch && b.lastTouch.role !== 'GK') {
        const toucher = b.lastTouch;
        for (const rec of pending) {
          if (rec.resolved || m.simTime - rec.t < 1e-9) continue;
          if (m.simTime - rec.t > 4) { rec.resolved = true; tally[rec.kind].other++; continue; }
          const t = tally[rec.kind];
          if (toucher.side !== rec.side) {
            // an opponent got the first touch: lane-hit (blocked at release) vs a read of the flight
            rec.resolved = true;
            if (rec.laneOpen < 0.35) t.laneHit++;
            else t.intercepted++;
            const lx = m.teams[rec.side].localX(b.pos.x);
            if (lx < -HALF_L / 3) t.turnDefThird++;
          } else if (toucher.gid === rec.targetGid) {
            // the intended mate touched it: kept it (owns) or spilled (loose)
            rec.resolved = true;
            if (b.owner && b.owner.gid === toucher.gid) t.complete++;
            else t.spillByReceiver++;
          } else if (b.owner && b.owner.side === rec.side) {
            rec.resolved = true;
            t.complete++; // a different teammate settled it — still retained
          }
        }
      }
      for (const rec of pending) {
        if (!rec.resolved && m.simTime - rec.t > 4) { rec.resolved = true; tally[rec.kind].other++; }
      }
      while (pending.length && pending[0].resolved) pending.shift();

      // refresh prev-tick distributing flags
      prevDist.clear();
      for (const team of m.teams) {
        const gk = team.goalkeeper;
        prevDist.set(gk.gid, gk.gkDistributing);
      }
    }
    miscontrols += m.teams[0].stats.miscontrols + m.teams[1].stats.miscontrols;
    shotsFor += m.teams[0].stats.shots + m.teams[1].stats.shots;
    league.applyResult(fx, m.getResult());
  }
  league.finishSeason();

  const pct = (n: number, d: number): string => `${((n / Math.max(d, 1)) * 100).toFixed(0)}%`;
  console.log(`\nworld ${seed} (gen ${GENS}, one traced season, ${matches} matches):`);
  console.log(`  first-touch spills (miscontrols): ${(miscontrols / matches).toFixed(1)}/match · shots ${(shotsFor / matches).toFixed(1)}/match`);
  for (const kind of ['goalKick', 'hands'] as const) {
    const t = tally[kind];
    const turn = t.laneHit + t.intercepted;
    console.log(`  ${kind === 'goalKick' ? 'GOAL KICK (feet, lane-aware)' : 'HANDS throw/sling/punt (opennessOf only)'}: ${(t.n / matches).toFixed(1)}/match · lane-open x̄ ${(t.laneSum / Math.max(t.n, 1)).toFixed(2)} · blocked-lane ${pct(t.blockedLane, t.n)}`);
    console.log(`      first touch → complete ${pct(t.complete, t.n)} · receiver-SPILL ${pct(t.spillByReceiver, t.n)} · lane-HIT(opp,blocked) ${pct(t.laneHit, t.n)} · intercepted(opp,open) ${pct(t.intercepted, t.n)} · other ${pct(t.other, t.n)}`);
    console.log(`      turnovers in OWN defensive third: ${pct(t.turnDefThird, turn)} of ${turn} opp-touch turnovers`);
  }
}
