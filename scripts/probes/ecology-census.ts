// Probe: league ecology (Phase 40). Long headless runs answer: (1) do
// rivalries ARM at a sensible pace (a feud a decade, not one a season or
// none ever), (2) how many league fixtures play as derbies once armed,
// (3) does the CAPPED prestige bias leave champion churn intact (the
// monoculture gate — mirrors evolve-check).
//   npx tsx scripts/probes/ecology-census.ts
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';

for (const seed of [424242, 991, 20260713]) {
  const seedLg = new League({ seed });
  const out = runHeadless(seedLg.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration',
    target: seedLg.generation + 20,
  });
  const lg = League.fromJSON(out.league as Record<string, unknown>);
  const meetings = [...lg.rivalryMeetings().entries()];
  const armed = meetings.filter(([, n]) => n >= 2);
  const champs = new Set(lg.history.map((r) => r.championSlot));
  const derbies = lg.fixtures.filter((f) => !f.cup && !f.playoff && lg.isDerby(f.home, f.away)).length;
  const topPrestige = Math.max(...lg.franchises.map((f) => lg.prestigeOf(f.slot)));
  console.log(
    `seed ${seed}: gen ${lg.generation} — pairs met ${meetings.length}, ARMED ${armed.length} ` +
    `(${armed.map(([k, n]) => `${k}×${n}`).join(', ') || 'none'}), ` +
    `derby fixtures this season ${derbies}, distinct champions ${champs.size}/${lg.history.length}, ` +
    `top prestige ${topPrestige.toFixed(2)}`,
  );
}
