/**
 * Probe (119f-spill, 2026-07-18): the anatomy of the first-touch SPILL
 * (停球失误) — is our miscontrol rate HONEST football (fast / pressured /
 * blind-side / low-technique receptions, which SHOULD spill), or is some
 * term in `attemptFirstTouch` (mechanics.ts) mispriced so that easy
 * receptions — unpressured, facing the ball, controllable speed — spill too?
 *
 * Non-invasive: watches the miscontrols stat increment. On the tick it rises,
 * the spiller is `ball.lastTouch`; the PRE-STEP snapshot supplies the
 * incoming ball speed, the spiller's heading (→ misalign) and the pressure on
 * him. Bands each spill and, decisively, counts the "SHOULD-NOT-SPILL" ones:
 * unpressured (<0.2) AND facing (misalign<0.35) AND controllable (incoming
 * speed <= CONTROL_MAX_SPEED). Also the intended-receiver share (a pass AT
 * this man) vs loose/deflected receptions.
 *
 *   npx tsx scripts/probes/spill-anatomy.ts [gens]
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { League } from '../../src/sim/League';
import { DT, HALF_L, CONTROL_MAX_SPEED } from '../../src/sim/constants';
import { pressureAt } from '../../src/ai/perception';
import type { Match } from '../../src/sim/Match';
import { v2 } from '../../src/utils/vec';

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

for (const seed of [991, 424242]) {
  const league = loadWorld(seed);
  let matches = 0;
  let spills = 0;
  const speedBand = { control: 0, fast: 0, hot: 0 }; // <=14 / <=20 / >20
  const pressBand = { free: 0, some: 0, heavy: 0 }; // <0.2 / <0.5 / >=0.5
  const faceBand = { facing: 0, side: 0, blind: 0 }; // misalign <0.35 / <0.65 / >=
  let intended = 0;
  let shouldNot = 0; // free AND facing AND controllable
  let techSum = 0;
  const thirdOwn = { own: 0, mid: 0, att: 0 };
  let receptions = 0; // approx: completed passes + loose captures (for a rate denom)

  while (!league.seasonDone) {
    const fx = league.nextFixture()!;
    const m: Match = league.createMatch(fx);
    matches++;
    let prevMis = 0;
    let prevBallSpeed = 0;
    let prevBallVel = v2();
    const snap = new Map<number, { hx: number; hy: number; px: number; py: number }>();
    let prevPassTargets: Set<number> = new Set();

    // seed snapshot
    for (const team of m.teams) for (const p of team.players) snap.set(p.gid, { hx: p.heading.x, hy: p.heading.y, px: p.pos.x, py: p.pos.y });

    while (!m.finished) {
      const preSpeed = prevBallSpeed;
      const preVel = prevBallVel;
      const preTargets = prevPassTargets;
      const preSnap = new Map(snap);
      m.step(DT);

      const mis = m.teams[0].stats.miscontrols + m.teams[1].stats.miscontrols;
      if (mis > prevMis && m.phase === 'playing') {
        const spiller = m.ball.lastTouch;
        if (spiller && spiller.role !== 'GK') {
          spills++;
          const s = preSnap.get(spiller.gid);
          const inSpeed = preSpeed;
          // band incoming speed
          if (inSpeed <= CONTROL_MAX_SPEED) speedBand.control++;
          else if (inSpeed <= 20) speedBand.fast++;
          else speedBand.hot++;
          // misalign from pre-step heading vs incoming ball direction
          let misalign = 0.5;
          const vl = Math.hypot(preVel.x, preVel.y);
          if (s && vl > 1e-6) {
            const inx = preVel.x / vl;
            const iny = preVel.y / vl;
            misalign = (1 + (inx * s.hx + iny * s.hy)) / 2;
          }
          if (misalign < 0.35) faceBand.facing++;
          else if (misalign < 0.65) faceBand.side++;
          else faceBand.blind++;
          // pressure from pre-step positions
          const opp = m.teams[1 - spiller.side].players;
          const press = s ? pressureAt(v2(s.px, s.py), opp) : pressureAt(spiller.pos, opp);
          if (press < 0.2) pressBand.free++;
          else if (press < 0.5) pressBand.some++;
          else pressBand.heavy++;
          if (preTargets.has(spiller.gid)) intended++;
          techSum += spiller.attrs.dribbling;
          // location in the spiller's own attacking-local frame
          const lx = m.teams[spiller.side].localX(spiller.pos.x);
          if (lx < -HALF_L / 3) thirdOwn.own++;
          else if (lx < HALF_L / 3) thirdOwn.mid++;
          else thirdOwn.att++;
          // the decisive count
          if (press < 0.2 && misalign < 0.35 && inSpeed <= CONTROL_MAX_SPEED) shouldNot++;
        }
      }
      prevMis = mis;

      // refresh snapshot for next tick
      prevBallSpeed = Math.hypot(m.ball.vel.x, m.ball.vel.y) + Math.abs(m.ball.vz) * 0.6;
      prevBallVel = v2(m.ball.vel.x, m.ball.vel.y);
      snap.clear();
      for (const team of m.teams) for (const p of team.players) snap.set(p.gid, { hx: p.heading.x, hy: p.heading.y, px: p.pos.x, py: p.pos.y });
      prevPassTargets = new Set(m.pendingPass ? [m.pendingPass.targetGid] : []);
    }
    receptions += m.teams[0].stats.passesCompleted + m.teams[1].stats.passesCompleted;
    league.applyResult(fx, m.getResult());
  }
  league.finishSeason();

  const pct = (n: number): string => `${((n / Math.max(spills, 1)) * 100).toFixed(0)}%`;
  console.log(`\nworld ${seed} (gen ${GENS}, one traced season, ${matches} matches):`);
  console.log(`  spills ${(spills / matches).toFixed(1)}/match · completed passes ${(receptions / matches).toFixed(0)}/match · avg spiller dribbling ${(techSum / Math.max(spills, 1)).toFixed(2)}`);
  console.log(`  incoming speed: controllable(<=14) ${pct(speedBand.control)} · fast(<=20) ${pct(speedBand.fast)} · hot(>20) ${pct(speedBand.hot)}`);
  console.log(`  pressure:       free(<0.2) ${pct(pressBand.free)} · some(<0.5) ${pct(pressBand.some)} · heavy(>=0.5) ${pct(pressBand.heavy)}`);
  console.log(`  body:           facing(<0.35) ${pct(faceBand.facing)} · side ${pct(faceBand.side)} · blind(>=0.65) ${pct(faceBand.blind)}`);
  console.log(`  intended-receiver (a pass AT him): ${pct(intended)} · location own/mid/att ${pct(thirdOwn.own)}/${pct(thirdOwn.mid)}/${pct(thirdOwn.att)}`);
  console.log(`  ⭐ SHOULD-NOT-SPILL (free + facing + controllable): ${pct(shouldNot)} of spills (${(shouldNot / matches).toFixed(2)}/match)`);
}
