/**
 * Probe (Phase 119d-2): size the GIVE-AND-GO as a scoring weapon. The
 * reframe target is carry + combination CO-dominance; the substrate exists
 * (`wallRun`/2过1, Phase 34) but 89% of late goals are unassisted (119b).
 * Is it rare because the gene GATE throttles it (few teams clear
 * `(tempo+passBias)/2·wallPassW > 0.35`), or because the mechanic is WEAK
 * (licenses fire but the return doesn't complete / doesn't score)?
 *
 * Per traced season on the gen-21 snapshots:
 *   - oneTwos / thirdMan / oneTouch per match (the combination stats)
 *   - goal ASSIST mix (wall/through/cutback/cross/pass/none) from the shotLog
 *   - the gene gate: fraction of clubs that CLEAR the wall-pass threshold
 *
 *   npx tsx scripts/probes/give-and-go.ts [gens]
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { League } from '../../src/sim/League';
import { DEFAULT_POLICY } from '../../src/sim/types';

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
  // Gene gate: how many clubs clear the wall-pass threshold? wallPassW is a
  // per-player policy multiplier; the coach's squad mean stands in.
  let clearGate = 0;
  for (const f of [...league.division(0), ...league.division(1)]) {
    const wpw = f.squadStyles
      ? f.squadStyles.reduce((a, s) => a + (s.wallPassW ?? DEFAULT_POLICY.wallPassW), 0) / f.squadStyles.length
      : DEFAULT_POLICY.wallPassW;
    const g = f.coach.genome;
    if (((g.tempo + g.passBias) / 2) * wpw > 0.35) clearGate++;
  }
  const nClubs = league.division(0).length + league.division(1).length;

  let matches = 0;
  let oneTwos = 0;
  let thirdMan = 0;
  let oneTouch = 0;
  let goals = 0;
  const assist: Record<string, number> = {};
  while (!league.seasonDone) {
    const fx = league.nextFixture()!;
    const m = league.createMatch(fx);
    const res = m.runToCompletion();
    matches++;
    for (const side of [0, 1] as const) {
      oneTwos += res.stats[side].oneTwos;
      thirdMan += res.stats[side].thirdMan;
      oneTouch += res.stats[side].oneTouch;
    }
    for (const s of m.shotLog) {
      if (s.outcome !== 'goal') continue;
      goals++;
      const k = s.assist ?? 'none';
      assist[k] = (assist[k] ?? 0) + 1;
    }
    league.applyResult(fx, res);
  }
  league.finishSeason();

  console.log(`\nworld ${seed} (gen ${GENS}, one traced season, ${matches} matches):`);
  console.log(`  gene gate: ${clearGate}/${nClubs} clubs clear the wall-pass threshold`);
  console.log(`  combination stats/match: oneTwos ${(oneTwos / matches).toFixed(2)} · thirdMan ${(thirdMan / matches).toFixed(2)} · oneTouch ${(oneTouch / matches).toFixed(2)}`);
  console.log(`  ${goals} goals · assist mix: ${Object.entries(assist).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v} (${((v / goals) * 100).toFixed(0)}%)`).join(' · ')}`);
}
