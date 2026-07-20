/**
 * COORDINATED-DENSITY PROBE (2026-07-20). VISION §1 names two load-bearing
 * substrate roots behind the endless width/position reverts: (A) space/density
 * and (B) emergent positioning. This probe tests defect A *coordinated with* B:
 * shrink the playing field (FIELD_SCALE, set via env) with EMERGENT positioning
 * ON (fractional stations auto-fit the smaller pitch; the fixed tables can't),
 * and measure against the VISION acceptance table — SHIP ONLY IF ALL THREE PASS:
 *
 *   §3 LINK/COMBINATION UP  — completion, cutbacks, one-touch, passes-per-
 *                             possession (chain length), goals.
 *   §2 SCRAMBLE NOT WORSE   — scramble-born goals (≥2 possession flips in the 4s
 *                             before the goal = pinball 乱抢) + players packed
 *                             within a PITCH-PROPORTIONAL radius of the ball.
 *   §1 SHAPE EMERGES        — strong-side (possessing team's y-centroid tracks
 *                             ball.y, Pearson r) + spread (nn distance, reported
 *                             scale-normalised).
 *
 * The metrics are SCALE-INVARIANT (clump radius ×scale, spread ÷scale, goal
 * scaled with the pitch so scoring difficulty is constant) so the two arms are
 * comparable. Run both and diff (same seeds/teams; only the field scale differs):
 *   EMERGENT_POS=1 FIELD_SCALE=1 GOAL_AND_BOX_SCALE=1 npx tsx scripts/probes/density-probe.ts [gens]
 *   EMERGENT_POS=1 FIELD_SCALE=0.82 GOAL_AND_BOX_SCALE=0.82 npx tsx scripts/probes/density-probe.ts [gens]
 *
 * Naive shrink is BANNED by VISION §2 if it worsens 乱抢 — this probe is the gate.
 */
import { setEmergentPos } from '../../src/ai/formations';
import { DT, HALF_L, PITCH_LENGTH, PITCH_WIDTH } from '../../src/sim/constants';
import { League } from '../../src/sim/League';

setEmergentPos(true); // density requires fractional stations (see header)

const GENS = Number(process.argv[2] ?? 8);
const SEEDS = [991, 424242];
const SAMPLE_EVERY = 6; // ticks (~0.1s)
const SCALE = PITCH_LENGTH / 90;
const CLUMP_R = 8 * SCALE; // pitch-proportional "near the ball" radius

const dist = (ax: number, ay: number, bx: number, by: number) =>
  Math.hypot(ax - bx, ay - by);

let goals = 0;
let scrambleGoals = 0;
let matches = 0;
let passes = 0;
let completed = 0;
let cutbacks = 0;
let oneTouch = 0;
let clumpSum = 0;
let samples = 0;
let spreadSum = 0;
let spreadN = 0;
let n = 0;
let sx = 0;
let sy = 0;
let sxy = 0;
let sxx = 0;
let syy = 0;

for (const seed of SEEDS) {
  const league = new League({ seed });
  for (let g = 0; g < GENS - 1; g++) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    }
    league.finishSeason();
  }
  // measure the final (evolved) season by STEPPING each match
  while (!league.seasonDone) {
    const fx = league.nextFixture()!;
    const m = league.createMatch(fx);
    let tick = 0;
    let lastSolidSide = -1;
    const flips: number[] = [];
    let prevGoals = 0;
    while (!m.finished) {
      m.step(DT);
      const own = m.ball.owner;
      if (own && !own.sentOff) {
        if (lastSolidSide !== -1 && own.side !== lastSolidSide) flips.push(m.simTime);
        lastSolidSide = own.side;
      }
      // classify a freshly-scored goal by the pinball before it (乱抢)
      const gc = m.teams[0].stats.goals + m.teams[1].stats.goals;
      if (gc > prevGoals) {
        prevGoals = gc;
        const t = m.simTime;
        if (flips.filter((f) => t - f <= 4).length >= 2) scrambleGoals++;
      }
      if (tick++ % SAMPLE_EVERY !== 0) continue;
      const bx = m.ball.pos.x;
      const by = m.ball.pos.y;
      let near = 0;
      for (const team of m.teams) {
        const out = team.players.filter((p) => p.role !== 'GK' && !p.sentOff);
        for (const p of out) if (dist(p.pos.x, p.pos.y, bx, by) < CLUMP_R) near++;
        if (out.length >= 2) {
          let nnSum = 0;
          for (const p of out) {
            let best = Infinity;
            for (const q of out) {
              if (q === p) continue;
              const d = dist(p.pos.x, p.pos.y, q.pos.x, q.pos.y);
              if (d < best) best = d;
            }
            nnSum += best;
          }
          spreadSum += nnSum / out.length;
          spreadN++;
        }
      }
      clumpSum += near;
      samples++;
      const owner = m.ball.owner;
      if (owner && !owner.sentOff) {
        const out = m.teams[owner.side].players.filter((p) => p.role !== 'GK' && !p.sentOff);
        if (out.length) {
          const yc = out.reduce((a, p) => a + p.pos.y, 0) / out.length;
          n++;
          sx += yc;
          sy += by;
          sxy += yc * by;
          sxx += yc * yc;
          syy += by * by;
        }
      }
    }
    const res = m.getResult();
    goals += res.score[0] + res.score[1];
    for (const st of res.stats) {
      passes += st.passes;
      completed += st.passesCompleted;
      cutbacks += st.cutbacks;
      oneTouch += st.oneTouch;
    }
    matches++;
    league.applyResult(fx, res);
  }
  league.finishSeason();
}

const pearson =
  n > 1
    ? (n * sxy - sx * sy) / (Math.sqrt(n * sxx - sx * sx) * Math.sqrt(n * syy - sy * sy) || 1e-9)
    : 0;
const areaPerPlayer = (PITCH_LENGTH * PITCH_WIDTH) / 12;
const pct = (x: number) => `${((x / Math.max(goals, 1)) * 100).toFixed(0)}%`;

console.log(`\n=== DENSITY PROBE — scale ${SCALE.toFixed(2)} (pitch ${PITCH_LENGTH.toFixed(0)}×${PITCH_WIDTH.toFixed(0)}, ${areaPerPlayer.toFixed(0)} m²/player, HALF_L ${HALF_L.toFixed(1)}) ===`);
console.log(`emergent ON · goal scaled with pitch · ${matches} measured matches, gen ${GENS}\n`);
console.log(`§3 LINK/COMBINATION (want UP):`);
console.log(`   completion ${((completed / Math.max(passes, 1)) * 100).toFixed(1)}%  ·  cutbacks/match ${(cutbacks / matches).toFixed(2)}  ·  one-touch/match ${(oneTouch / matches).toFixed(2)}  ·  goals/match ${(goals / matches).toFixed(2)}`);
console.log(`§2 SCRAMBLE/CLUMP (want DOWN):`);
console.log(`   scramble-born goals ${pct(scrambleGoals)} (${scrambleGoals}/${goals})  ·  players within ${CLUMP_R.toFixed(1)}m (∝pitch) of ball ${(clumpSum / Math.max(samples, 1)).toFixed(2)}`);
console.log(`§1 SHAPE EMERGENCE (want UP):`);
console.log(`   strong-side r ${pearson.toFixed(3)}  ·  spread ${(spreadSum / Math.max(spreadN, 1)).toFixed(2)}m → scale-norm ${(spreadSum / Math.max(spreadN, 1) / SCALE).toFixed(2)}m`);
