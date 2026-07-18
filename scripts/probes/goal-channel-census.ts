// Probe (Phase 113): the GOAL-CHANNEL census — validates the in-engine
// channel classifier (Match.goalChannelFor + the band-entry tracker) before
// it goes player-facing. Cross-check against launch-anatomy/final15: late-gen
// goals are 60-75% breakaway walk-ins, so the breakaway family
// (walkin+carry+through+keeper) should dominate late worlds, with setpiece
// and buildup carrying the rest. Also hard-checks the invariant that every
// goal banks exactly one channel (sum over channels === goals, both sides).
//   npx tsx scripts/probes/goal-channel-census.ts [gens]
import { League } from '../../src/sim/League';
import { GOAL_CHANNELS, emptyChannels } from '../../src/sim/types';

const GENS = Number(process.argv[2] ?? 22);

for (const seed of [991, 424242]) {
  const league = new League({ seed });
  for (let g = 0; g < GENS - 2; g++) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    }
    league.finishSeason();
  }

  const mix = emptyChannels();
  const byClub = new Map<string, { gf: ReturnType<typeof emptyChannels>; ga: ReturnType<typeof emptyChannels> }>();
  let goals = 0;
  let mismatches = 0;
  for (let g = 0; g < 2; g++) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      const m = league.createMatch(fx);
      const res = m.runToCompletion();
      for (const side of [0, 1] as const) {
        const st = res.stats[side];
        const chSum = GOAL_CHANNELS.reduce((a, c) => a + st.goalChannels[c], 0);
        if (chSum !== st.goals) mismatches++;
        goals += st.goals;
        const name = m.teams[side].info.name;
        const club = byClub.get(name) ?? { gf: emptyChannels(), ga: emptyChannels() };
        for (const c of GOAL_CHANNELS) {
          club.gf[c] += st.goalChannels[c];
          club.ga[c] += res.stats[1 - side].goalChannels[c];
        }
        byClub.set(name, club);
      }
      league.applyResult(fx, res);
    }
    league.finishSeason();
  }

  for (const [, club] of byClub) for (const c of GOAL_CHANNELS) mix[c] += club.gf[c];
  const pct = (n: number): string => `${((n / Math.max(goals, 1)) * 100).toFixed(0)}%`;
  console.log(`\nworld ${seed} (gens ${GENS - 2}→${GENS}): ${goals} goals, channel-sum mismatches ${mismatches}`);
  console.log(`  mix: ${GOAL_CHANNELS.map((c) => `${c} ${pct(mix[c])}`).join(' · ')}`);
  const breakaway = mix.walkin + mix.carry + mix.through + mix.keeper;
  console.log(`  breakaway family (walkin+carry+through+keeper): ${pct(breakaway)}`);
  // The two most channel-skewed clubs, both directions — the "schools read"
  // check: defensive identities should CONCEDE differently.
  const rows = [...byClub.entries()].map(([name, c]) => {
    const gaTot = Math.max(1, GOAL_CHANNELS.reduce((a, k) => a + c.ga[k], 0));
    const top = GOAL_CHANNELS.reduce((a, k) => (c.ga[k] > c.ga[a] ? k : a), 'buildup' as (typeof GOAL_CHANNELS)[number]);
    return { name, top, share: c.ga[top] / gaTot };
  });
  rows.sort((a, b) => b.share - a.share);
  for (const r of rows.slice(0, 3)) {
    console.log(`  concedes-skew ${r.name.padEnd(16)} ${r.top} ${(r.share * 100).toFixed(0)}%`);
  }
}
