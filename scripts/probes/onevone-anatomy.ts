/**
 * Probe (Phase 119b): the 1v1 ANATOMY — why does the late ecology convert
 * breakaways at 56-67% (attack-economics probe) when the real game runs
 * 35-45%? Decomposes every oneVone shot's save chain link by link:
 *
 *   1. did the ball's path ever enter the keeper's reach? (performSaves
 *      early-outs on dist > keeperReach — a shot that never crosses the
 *      corridor NEVER ROLLS saveP, no matter what the formula says; the
 *      phase-106 closeIn sweep's null result smells like this)
 *   2. if it rolled, what saveP did the formula offer (reconstructed from
 *      the exposed pendingShot.difficulty/closeIn + xg + reflexes)?
 *
 * Late-ecology worlds are SNAPSHOTTED to /tmp on first run (evolving 21
 * gens costs ~2min; reloading costs nothing) — sweeps stay cheap.
 *
 *   npx tsx scripts/probes/onevone-anatomy.ts [gens]
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { League } from '../../src/sim/League';
import { DT, HALF_L } from '../../src/sim/constants';

const GENS = Number(process.argv[2] ?? 21);

interface ShotTrace {
  xg: number;
  difficulty: number;
  closeIn: number;
  reach: number;
  minGkBall: number;
  gkAtStrike: number;
  shooterGoalD: number;
  outcome: string;
  reflexes: number;
}

function loadWorld(seed: number): League {
  const path = `/tmp/evo-snap-${seed}-g${GENS}.json`;
  if (existsSync(path)) {
    return League.fromJSON(JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>);
  }
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
  const traces: ShotTrace[] = [];
  let allShots = 0;
  let allGoals = 0;
  let matches = 0;
  const channelGoals: Record<string, number> = {};

  while (!league.seasonDone) {
    const fx = league.nextFixture()!;
    const m = league.createMatch(fx);
    let cur: { logIndex: number; trace: ShotTrace } | null = null;
    while (!m.finished) {
      m.step(DT);
      const ps = m.pendingShot;
      if (cur) {
        const log = m.shotLog[cur.logIndex];
        const gk = m.teams[1 - log.side].goalkeeper;
        cur.trace.minGkBall = Math.min(
          cur.trace.minGkBall,
          Math.hypot(gk.pos.x - m.ball.pos.x, gk.pos.y - m.ball.pos.y),
        );
        if (log.outcome !== 'pending') {
          cur.trace.outcome = log.outcome;
          traces.push(cur.trace);
          cur = null;
        }
      }
      if (!cur && ps && !ps.resolved && m.shotLog[ps.logIndex]?.oneVone && m.shotLog[ps.logIndex].outcome === 'pending') {
        const side = ps.side;
        const gk = m.teams[1 - side].goalkeeper;
        const defG = m.teams[1 - side].info.genome;
        const goalX = m.teams[side].attackDir * HALF_L;
        const shooter = m.allPlayers[ps.shooterGid];
        cur = {
          logIndex: ps.logIndex,
          trace: {
            xg: ps.xg,
            difficulty: ps.difficulty,
            closeIn: ps.closeIn ?? 0,
            reach:
              2.05 + (defG.keeperAggression ?? 0.5) * 0.4 + (gk.attrs.reflexes - 0.5) * 0.5 +
              (gk.traits.includes('cat') ? 0.12 : 0),
            minGkBall: Infinity,
            gkAtStrike: Math.hypot(gk.pos.x - m.ball.pos.x, gk.pos.y - m.ball.pos.y),
            shooterGoalD: shooter ? Math.hypot(goalX - shooter.pos.x, shooter.pos.y) : NaN,
            outcome: 'pending',
            reflexes: gk.attrs.reflexes,
          },
        };
      }
    }
    matches++;
    for (const s of m.shotLog) {
      if (s.outcome === 'pending') continue;
      allShots++;
      if (s.outcome === 'goal') {
        allGoals++;
        const c = s.channel ?? 'buildup';
        channelGoals[c] = (channelGoals[c] ?? 0) + 1;
      }
    }
    league.applyResult(fx, m.getResult());
  }
  league.finishSeason();

  const n = traces.length;
  const goals = traces.filter((t) => t.outcome === 'goal');
  const saved = traces.filter((t) => t.outcome === 'saved');
  const untouchable = traces.filter((t) => t.minGkBall > t.reach);
  const untouchableGoals = goals.filter((t) => t.minGkBall > t.reach);
  const rolled = traces.filter((t) => t.minGkBall <= t.reach);
  const mean = (xs: number[]): number => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
  const reconstructedP = (t: ShotTrace): number => {
    const base = Math.min(0.92, Math.max(0.1, 0.48 - t.xg * 0.45 + (t.reflexes - 0.5) * 0.28)) * t.difficulty;
    return Math.min(0.95, base * (1 + t.closeIn * 0.9));
  };

  console.log(`\nworld ${seed} (gen ${GENS}, one traced season): ${n} oneVone shots`);
  console.log(`  outcomes: goal ${goals.length} (${((goals.length / n) * 100).toFixed(0)}%) · saved ${saved.length} · miss ${n - goals.length - saved.length}`);
  console.log(`  geometry: shooter->goal ${mean(traces.map((t) => t.shooterGoalD)).toFixed(1)}m · gk->ball at strike ${mean(traces.map((t) => t.gkAtStrike)).toFixed(1)}m`);
  console.log(`  NEVER IN REACH (no saveP roll possible): ${untouchable.length}/${n} (${((untouchable.length / n) * 100).toFixed(0)}%) — of the goals: ${untouchableGoals.length}/${goals.length} (${((untouchableGoals.length / Math.max(goals.length, 1)) * 100).toFixed(0)}%)`);
  console.log(`    minGkBall mean ${mean(traces.map((t) => t.minGkBall)).toFixed(2)}m vs reach mean ${mean(traces.map((t) => t.reach)).toFixed(2)}m`);
  console.log(`  ROLLED subset: ${rolled.length} shots, realized save ${saved.length}/${rolled.length} (${((saved.length / Math.max(rolled.length, 1)) * 100).toFixed(0)}%), reconstructed saveP mean ${mean(rolled.map(reconstructedP)).toFixed(2)} (difficulty ${mean(rolled.map((t) => t.difficulty)).toFixed(2)}, closeIn ${mean(rolled.map((t) => t.closeIn)).toFixed(2)}, xg ${mean(rolled.map((t) => t.xg)).toFixed(2)})`);
  console.log(`  season totals: ${matches} matches · ${allGoals} goals (${(allGoals / matches).toFixed(2)}/match) · conv ${((allGoals / Math.max(allShots, 1)) * 100).toFixed(1)}% · goal channels: ${Object.entries(channelGoals).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
}
