/**
 * Phase 52 probe — the chronicle over REAL history. Runs headless seasons on
 * two seeds and reports what the chronicle/era layer mines from them: era
 * count + lengths + names (is ERA_SPLIT_DRIFT a handful of ages, not
 * confetti?), how the title races read, and the chapter-line texture
 * (derbies, funerals, records). Pure read — the sim is untouched.
 *
 *   npx tsx scripts/probes/chronicle-demo.ts [seasons] [seed ...]
 */
import { detectEras } from '../../src/evolution/eras';
import { chronicleChapters } from '../../src/sim/chronicle';
import { League } from '../../src/sim/League';

const seasons = Number(process.argv[2] ?? 30);
const seeds = process.argv.slice(3).map(Number);
if (seeds.length === 0) seeds.push(424242, 777);

for (const seed of seeds) {
  const league = new League({ seed });
  const t0 = performance.now();
  for (let s = 0; s < seasons; s++) {
    while (!league.seasonDone) {
      const f = league.nextFixture()!;
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
    league.finishSeason();
  }
  console.log(`\n===== seed ${seed} — ${seasons} seasons in ${((performance.now() - t0) / 1000).toFixed(1)}s =====`);

  const eras = detectEras(league.history);
  console.log(`\nERAS (${eras.length}):`);
  for (const era of eras) {
    const label =
      era.label.kind === 'dynasty' ? `DYNASTY: ${era.label.club}` :
      era.label.kind === 'style' ? `STYLE: ${era.label.word}` : 'contested';
    const honours = era.honours.slice(0, 2).map((h) => `${h.name}×${h.titles}`).join(', ');
    console.log(`  S${era.start}–S${era.end} (${era.seasons}) ${label.padEnd(28)} [${honours}]`);
  }

  const chapters = chronicleChapters(league.history);
  const raced = chapters.filter((c) => c.race);
  const decidedEarly = raced.filter((c) => c.race!.decidedRound < c.race!.totalRounds);
  const wire = raced.filter((c) => c.race!.ledFrom === 1);
  const gd = raced.filter((c) => c.race!.byGoalDifference);
  const comeback = raced.filter((c) => c.race!.halfwayRank >= 4);
  const count = (icon: string) => chapters.reduce((a, c) => a + c.lines.filter((l) => l.icon === icon).length, 0);
  console.log(`\nCHAPTERS: ${chapters.length}, with race data ${raced.length}`);
  console.log(
    `  decided before the final day ${decidedEarly.length} · wire-to-wire ${wire.length} · ` +
    `GD titles ${gd.length} · comeback (≥4th at half) ${comeback.length}`,
  );
  console.log(
    `  lines/chapter ${(chapters.reduce((a, c) => a + c.lines.length, 0) / chapters.length).toFixed(1)} · ` +
    `derby finals ${count('🔥')} · upsets ${count('⚡')} · funerals ${count('💀')} · ` +
    `records ${count('📈') + count('⚽') + count('🎼')} · story frags ${count('📖')}`,
  );

  console.log('\nFIRST + LAST THREE HEADLINES:');
  for (const c of [...chapters.slice(0, 3), ...chapters.slice(-3)]) {
    console.log(`  S${c.generation}: ${c.headline}`);
  }
  const last = chapters[chapters.length - 1];
  console.log('\nLATEST CHAPTER LINES:');
  for (const line of last.lines) console.log(`  ${line.icon} ${line.text}`);
}
