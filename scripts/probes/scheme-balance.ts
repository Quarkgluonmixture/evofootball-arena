/**
 * Probe (2026-07-19, the marking-scheme freeing re-examination): at CURRENT
 * HEAD, how IMBALANCED is zonal vs man defensively — and can the attack pull
 * a zone apart? The code comment behind the hand-lock claims zonal concedes
 * ~3.5 vs man's ~8 shots (a parked lattice doesn't get dragged out of shape).
 * If that gap still holds, freeing the scheme into a gene is DANGEROUS without
 * an attacking counter (zonal would dominate → league collapse). Re-measured
 * fresh because the balance shifts every phase.
 *
 * Per DEFENDING scheme (the team NOT in possession), tallies goals + shots +
 * xg conceded, and DISPLACEMENT: mean distance of the defending outfielders
 * from their (out-of-possession) formation spots — high = pulled out of shape
 * (man), low = holding the lattice (zonal). The displacement gap is the direct
 * test of "the attack can't break a zone".
 *
 *   npx tsx scripts/probes/scheme-balance.ts [gens]
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { League } from '../../src/sim/League';
import { DT } from '../../src/sim/constants';
import { formationSpot } from '../../src/ai/formations';
import type { Match } from '../../src/sim/Match';

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
  const nZonal = [...league.division(0), ...league.division(1)].filter((f) => f.coach.style.scheme === 'zonal').length;

  const acc = {
    man: { defMatches: 0, goalsConc: 0, shotsConc: 0, dispSum: 0, dispN: 0 },
    zonal: { defMatches: 0, goalsConc: 0, shotsConc: 0, dispSum: 0, dispN: 0 },
  };
  let matches = 0;
  let sampleTick = 0;

  while (!league.seasonDone) {
    const fx = league.nextFixture()!;
    const m: Match = league.createMatch(fx);
    matches++;
    // per-side displacement while DEFENDING (opponent in possession)
    while (!m.finished) {
      m.step(DT);
      if (m.phase !== 'playing') continue;
      sampleTick++;
      if (sampleTick % 20 === 0 && m.possessionSide !== -1) {
        const defSide = 1 - m.possessionSide;
        const team = m.teams[defSide];
        const scheme = team.style.scheme;
        let sum = 0;
        let n = 0;
        for (const p of team.players) {
          if (p.role === 'GK' || p.sentOff) continue;
          const spot = formationSpot(p, team, m.ball, false);
          sum += Math.hypot(p.pos.x - spot.x, p.pos.y - spot.y);
          n++;
        }
        acc[scheme].dispSum += sum / Math.max(n, 1);
        acc[scheme].dispN++;
      }
    }
    const r = m.getResult();
    for (const side of [0, 1] as const) {
      const scheme = m.teams[side].style.scheme;
      acc[scheme].defMatches++;
      acc[scheme].goalsConc += r.score[1 - side];
      acc[scheme].shotsConc += r.stats[1 - side].shots;
    }
    league.applyResult(fx, r);
  }
  league.finishSeason();

  console.log(`\nworld ${seed} (gen ${GENS}, ${matches} matches) — ZONAL clubs ${nZonal}/16:`);
  for (const scheme of ['man', 'zonal'] as const) {
    const a = acc[scheme];
    if (a.defMatches === 0) {
      console.log(`  ${scheme.padEnd(5)}: (no clubs)`);
      continue;
    }
    console.log(`  ${scheme.padEnd(5)}: defending in ${a.defMatches} team-matches · conceded ${(a.goalsConc / a.defMatches).toFixed(2)} goals · ${(a.shotsConc / a.defMatches).toFixed(1)} shots · off-spot displacement x̄ ${(a.dispSum / Math.max(a.dispN, 1)).toFixed(1)}m`);
  }
}
