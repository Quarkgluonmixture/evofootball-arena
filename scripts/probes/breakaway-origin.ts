/**
 * Probe (Phase 119d — the user's second playtest hypothesis): most 1v1s
 * aren't CREATED (a pass or a clean beat) — they're SCRAMBLE-BORN (bodies
 * pile up, the ball squirts out to someone with only the keeper to beat),
 * and the short window while the breakaway forms is wasted because every
 * defender is MAN-MARKING a teammate — nobody is free to cover.
 *
 * At the instant a clean breakaway forms (carrier < 32m from goal, no
 * opponent outfielder goal-side of the ball — the breakaway.ts detector),
 * records:
 *   ORIGIN — created (a completed pass to the carrier < 2s ago) · beat (he
 *     carried it continuously > 1.5s) · scramble (neither — a loose ball /
 *     tackle / knockdown he just picked up).
 *   COVER — of the defending outfielders, how many are MarkOpponent-glued
 *     to a man vs FREE (not marking) and goal-side enough to recover; the
 *     "spare man" real defences carry and ours may not.
 *
 *   npx tsx scripts/probes/breakaway-origin.ts [gens]
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { League } from '../../src/sim/League';
import { DT, HALF_L } from '../../src/sim/constants';
import type { Match } from '../../src/sim/Match';

const GENS = Number(process.argv[2] ?? 21);

function loadWorld(seed: number): League {
  const path = `/tmp/evo-snap-${seed}-g${GENS}.json`;
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
  const origin = { created: 0, beat: 0, scramble: 0 };
  let breakaways = 0;
  let coverFreeSum = 0;
  let markingSum = 0;
  let zeroCover = 0;
  let goals = 0;
  let matches = 0;
  const ownedSince = new Map<number, number>();

  while (!league.seasonDone) {
    const fx = league.nextFixture()!;
    const m: Match = league.createMatch(fx);
    matches++;
    let epActive = false;
    while (!m.finished) {
      m.step(DT);
      const b = m.ball;
      const owner = b.owner;
      // track continuous ownership
      if (owner) {
        if (!ownedSince.has(owner.gid)) ownedSince.set(owner.gid, m.simTime);
        for (const gid of [...ownedSince.keys()]) if (gid !== owner.gid) ownedSince.delete(gid);
      } else {
        ownedSince.clear();
      }
      if (m.phase !== 'playing') { epActive = false; continue; }

      // Breakaway detection (breakaway.ts): outfield carrier < 32m from goal,
      // no opponent outfielder goal-side of the ball.
      let isBreak = false;
      let side = -1;
      if (owner && owner.role !== 'GK') {
        side = owner.side;
        const goalX = m.teams[side].attackDir * HALF_L;
        const dGoal = Math.abs(goalX - b.pos.x);
        if (dGoal < 32) {
          let cover = false;
          for (const o of m.teams[1 - side].players) {
            if (o.role === 'GK' || o.sentOff) continue;
            if (Math.abs(goalX - o.pos.x) < dGoal - 1) { cover = true; break; }
          }
          isBreak = !cover;
        }
      }
      if (isBreak && !epActive && owner) {
        epActive = true;
        breakaways++;
        // ORIGIN
        const lp = m.lastCompletedPass;
        const since = ownedSince.get(owner.gid) ?? m.simTime;
        if (lp && lp.receiverGid === owner.gid && lp.passerGid !== owner.gid && m.simTime - lp.t < 2) {
          origin.created++;
        } else if (m.simTime - since > 1.5) {
          origin.beat++;
        } else {
          origin.scramble++;
        }
        // COVER: defending outfielders marking-a-man vs free-and-goal-side.
        const goalX = m.teams[side].attackDir * HALF_L;
        const dGoal = Math.abs(goalX - b.pos.x);
        let marking = 0;
        let free = 0;
        for (const o of m.teams[1 - side].players) {
          if (o.role === 'GK' || o.sentOff) continue;
          if (o.action.type === 'MarkOpponent') marking++;
          else if (Math.abs(goalX - o.pos.x) < dGoal + 8) free++; // roughly recoverable
        }
        markingSum += marking;
        coverFreeSum += free;
        if (free === 0) zeroCover++;
      } else if (!isBreak) {
        epActive = false;
      }
    }
    goals += m.score[0] + m.score[1];
    league.applyResult(fx, m.getResult());
  }
  league.finishSeason();

  const zonalClubs = [...league.division(0), ...league.division(1)].filter((f) => f.coach.style.scheme === 'zonal').length;
  const pct = (n: number): string => `${((n / Math.max(breakaways, 1)) * 100).toFixed(0)}%`;
  console.log(`\nworld ${seed} (gen ${GENS}, one traced season): ${breakaways} breakaways formed · ${(goals / matches).toFixed(2)} goals/match · ZONAL clubs ${zonalClubs}/16`);
  console.log(`  ORIGIN: created(pass) ${pct(origin.created)} · beat(dribble>1.5s) ${pct(origin.beat)} · scramble ${pct(origin.scramble)}`);
  console.log(`  COVER at formation: marking-a-man x̄ ${(markingSum / Math.max(breakaways, 1)).toFixed(2)} · free-and-recoverable x̄ ${(coverFreeSum / Math.max(breakaways, 1)).toFixed(2)} · ZERO cover ${pct(zeroCover)}`);
}
