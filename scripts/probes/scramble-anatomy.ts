/**
 * Probe (the 乱抢 re-examination, 2026-07-18): the full anatomy of the
 * midfield scramble at current HEAD — how often, where, how dense (人堆),
 * what feeds it, what kills it, and what it PAYS. Evolved gen-21 worlds
 * (breakaway-origin's /tmp snapshots reused), one traced season each.
 *
 * A SCRAMBLE EPISODE = a maximal chain of contest events (possession
 * FLIPS between teams + loose touches while nobody owns the ball) with
 * consecutive gaps < 2.0s, containing >= 2 flips — i.e. the ball changed
 * TEAMS at least twice without either side settling. One clean turnover
 * is football; two-plus inside two-second gaps is the pinball.
 *
 * Per episode: duration, flips, third-of-pitch, crowd within 6m of the
 * ball (the 人堆 metric) vs the open-play baseline, mean distance of
 * outfielders from their formation spots (shape damage) vs baseline,
 * ENTRY event (tackle squirt / contested pass flight / dribble knock /
 * spill), and the PAYOFF: a clean breakaway forming (breakaway.ts
 * detector) within 5s for the side that came out with it, and a goal
 * within 8s. Also the churn baseline (spell-dist grammar) on the same
 * evolved worlds.
 *
 *   npx tsx scripts/probes/scramble-anatomy.ts [gens]
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { League } from '../../src/sim/League';
import { DT, HALF_L } from '../../src/sim/constants';
import { formationSpot } from '../../src/ai/formations';
import type { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';

const GENS = Number(process.argv[2] ?? 21);
const GAP = 2.0; // max seconds between contest events inside one episode
const THIRD = HALF_L / 3; // |x| < 15 = the middle third
// SNAP_TAG isolates snapshot caches across physics variants: evolving FRESH
// under changed mechanics must not collide with the baseline worlds.
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

interface Chain {
  t0: number;
  lastT: number;
  events: number;
  flips: number;
  entry: string;
  frames: number;
  sumCrowd: number;
  peakCrowd: number;
  sumShape: number;
  sumBallX: number;
}

for (const seed of [991, 424242]) {
  const league = loadWorld(seed);

  // --- accumulators ---
  let matches = 0;
  let episodes = 0;
  let epDur = 0;
  let epFlips = 0;
  let epCrowd = 0;
  let epPeakCrowd = 0;
  let epShape = 0;
  let epFrames = 0;
  const epThird = { def: 0, mid: 0, att: 0 }; // by mean ball |x| (def/att meaningless unsided — use raw |x|)
  const entry: Record<string, number> = {};
  let openFrames = 0;
  let baseCrowd = 0;
  let baseShape = 0;
  let openTime = 0;
  let epTime = 0;
  // churn baseline (spell-dist grammar)
  let sideSpells = 0;
  let subSec = 0;
  let subSecMid = 0;
  // payoff
  let epBreakaway = 0;
  let epGoal = 0;
  let goalsTotal = 0;
  let goalsAfterScramble = 0;

  while (!league.seasonDone) {
    const fx = league.nextFixture()!;
    const m: Match = league.createMatch(fx);
    matches++;

    let chain: Chain | null = null;
    let lastSolidSide = -1; // last 0/1 possession seen (for flip detection)
    let sideStart = 0;
    let prevOwnerGid = -1;
    let prevOwnerNull = true;
    let prevLastTouchGid = -1;
    let prevScore = 0;
    // closed episodes awaiting payoff attribution
    const closed: { closeT: number; exitSide: number; brk: boolean; goal: boolean }[] = [];
    let epActive = false; // breakaway detector edge

    const closeChain = (c: Chain, exitSide: number): void => {
      if (c.flips >= 2) {
        episodes++;
        epDur += c.lastT - c.t0;
        epTime += c.lastT - c.t0;
        epFlips += c.flips;
        epCrowd += c.sumCrowd;
        epPeakCrowd += c.peakCrowd;
        epShape += c.sumShape;
        epFrames += c.frames;
        entry[c.entry] = (entry[c.entry] ?? 0) + 1;
        const mx = Math.abs(c.sumBallX / Math.max(c.frames, 1));
        if (mx < THIRD) epThird.mid++;
        else if (mx < THIRD * 2) epThird.def++; // unsided: "outer" band
        else epThird.att++;
        closed.push({ closeT: c.lastT, exitSide, brk: false, goal: false });
      }
    };

    while (!m.finished) {
      m.step(DT);
      const b = m.ball;
      const owner = b.owner;
      const playing = m.phase === 'playing';

      // goals (attribute to a recent scramble exit within 8s)
      const sc = m.score[0] + m.score[1];
      if (sc > prevScore) {
        const scorer = m.score[0] > prevScore - m.score[1] + m.score[0] - sc + m.score[1] ? 0 : 1; // which index rose
        const who = m.score[0] + m.score[1] - prevScore === 1 && m.score[1] === (prevScore - m.score[0] + 1) ? 1 : 0;
        void scorer; void who; // side attribution via closed list below (any side match)
        goalsTotal++;
        for (const c of closed) {
          if (!c.goal && m.simTime - c.closeT < 8) {
            c.goal = true;
            epGoal++;
            goalsAfterScramble++;
            break;
          }
        }
        prevScore = sc;
      }

      if (!playing) {
        if (chain) {
          closeChain(chain, -1);
          chain = null;
        }
        prevOwnerNull = owner === null;
        prevOwnerGid = owner?.gid ?? -1;
        prevLastTouchGid = b.lastTouch?.gid ?? -1;
        continue;
      }

      openTime += DT;
      openFrames++;

      // --- contest events ---
      let event = false;
      let isFlip = false;
      // possession flip: a side GAIN differing from the last solid side
      if (owner && lastSolidSide !== -1 && owner.side !== lastSolidSide) {
        // churn spell bookkeeping
        const dur = m.simTime - sideStart;
        sideSpells++;
        if (dur < 1) {
          subSec++;
          if (Math.abs(b.pos.x) < THIRD) subSecMid++;
        }
        sideStart = m.simTime;
        event = true;
        isFlip = true;
      }
      if (owner && lastSolidSide === -1) sideStart = m.simTime;
      if (owner) lastSolidSide = owner.side;
      // loose touch: toucher changed while nobody owns it
      const ltg = b.lastTouch?.gid ?? -1;
      if (!owner && ltg !== -1 && ltg !== prevLastTouchGid) event = true;

      if (event) {
        if (chain && m.simTime - chain.lastT > GAP) {
          closeChain(chain, lastSolidSide);
          chain = null;
        }
        if (!chain) {
          // ENTRY classification at the chain's first event
          let e = 'spill/other';
          if (m.pendingPass !== null) e = 'pass-contest';
          else if (m.dribbleTouch !== null) e = 'dribble-knock';
          else if (!prevOwnerNull && owner === null) e = 'tackle-squirt';
          chain = {
            t0: m.simTime, lastT: m.simTime, events: 0, flips: 0, entry: e,
            frames: 0, sumCrowd: 0, peakCrowd: 0, sumShape: 0, sumBallX: 0,
          };
        }
        chain.lastT = m.simTime;
        chain.events++;
        if (isFlip) chain.flips++;
      } else if (chain && m.simTime - chain.lastT > GAP) {
        closeChain(chain, lastSolidSide);
        chain = null;
      }

      // --- per-frame density + shape ---
      let crowd = 0;
      let shapeSum = 0;
      let shapeN = 0;
      for (const team of m.teams) {
        const hasBall = m.possessionSide === team.side;
        for (const p of team.players) {
          if (p.role === 'GK' || p.sentOff) continue;
          const dx = p.pos.x - b.pos.x;
          const dy = p.pos.y - b.pos.y;
          if (dx * dx + dy * dy < 36) crowd++;
          const spot = formationSpot(p, team, b, hasBall);
          shapeSum += Math.hypot(p.pos.x - spot.x, p.pos.y - spot.y);
          shapeN++;
        }
      }
      const shape = shapeSum / Math.max(shapeN, 1);
      baseCrowd += crowd;
      baseShape += shape;
      if (chain) {
        chain.frames++;
        chain.sumCrowd += crowd;
        if (crowd > chain.peakCrowd) chain.peakCrowd = crowd;
        chain.sumShape += shape;
        chain.sumBallX += b.pos.x;
      }

      // --- breakaway detector (breakaway-origin grammar) for payoff ---
      let isBreak = false;
      let brkSide = -1;
      if (owner && owner.role !== 'GK') {
        brkSide = owner.side;
        const goalX = m.teams[brkSide].attackDir * HALF_L;
        const dGoal = Math.abs(goalX - b.pos.x);
        if (dGoal < 32) {
          let cover = false;
          for (const o of m.teams[1 - brkSide].players) {
            if (o.role === 'GK' || o.sentOff) continue;
            if (Math.abs(goalX - (o as Player).pos.x) < dGoal - 1) {
              cover = true;
              break;
            }
          }
          isBreak = !cover;
        }
      }
      if (isBreak && !epActive) {
        for (const c of closed) {
          if (!c.brk && m.simTime - c.closeT < 5 && (c.exitSide === -1 || c.exitSide === brkSide)) {
            c.brk = true;
            epBreakaway++;
            break;
          }
        }
      }
      epActive = isBreak;

      // prune the closed list
      while (closed.length && m.simTime - closed[0].closeT > 10) closed.shift();

      prevOwnerNull = owner === null;
      prevOwnerGid = owner?.gid ?? -1;
      void prevOwnerGid;
      prevLastTouchGid = ltg;
    }
    if (chain) closeChain(chain, lastSolidSide);
    league.applyResult(fx, m.getResult());
  }
  league.finishSeason();

  const pct = (n: number, d: number): string => `${((n / Math.max(d, 1)) * 100).toFixed(0)}%`;
  console.log(`\nworld ${seed} (gen ${GENS}, one traced season, ${matches} matches):`);
  console.log(`  churn: ${(sideSpells / matches).toFixed(1)} side-spells/match · sub-1s ${pct(subSec, sideSpells)} · of sub-1s, middle third ${pct(subSecMid, subSec)}`);
  console.log(`  scrambles (>=2 flips, gap<${GAP}s): ${(episodes / matches).toFixed(2)}/match · mean dur ${(epDur / Math.max(episodes, 1)).toFixed(2)}s · mean flips ${(epFlips / Math.max(episodes, 1)).toFixed(1)} · ${pct(epTime, openTime)} of open play`);
  console.log(`  location (mean |x|): middle ${pct(epThird.mid, episodes)} · outer ${pct(epThird.def, episodes)} · final-third band ${pct(epThird.att, episodes)}`);
  console.log(`  人堆: within-6m of ball during scramble x̄ ${(epCrowd / Math.max(epFrames, 1)).toFixed(2)} (peak x̄ ${(epPeakCrowd / Math.max(episodes, 1)).toFixed(1)}) vs open-play baseline ${(baseCrowd / Math.max(openFrames, 1)).toFixed(2)}`);
  console.log(`  shape: dist-from-spot during scramble x̄ ${(epShape / Math.max(epFrames, 1)).toFixed(1)}m vs baseline ${(baseShape / Math.max(openFrames, 1)).toFixed(1)}m`);
  const entries = Object.entries(entry).sort((a, b2) => b2[1] - a[1]).map(([k, v]) => `${k} ${pct(v, episodes)}`).join(' · ');
  console.log(`  entry: ${entries}`);
  console.log(`  payoff: breakaway <5s after ${pct(epBreakaway, episodes)} of scrambles · goal <8s after ${pct(epGoal, episodes)} · scramble-preceded goals ${pct(goalsAfterScramble, goalsTotal)} of ${goalsTotal}`);
}
