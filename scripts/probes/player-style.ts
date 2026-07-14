/**
 * Phase 54 probe — does PERSONAL style actually emerge? Everyone is born
 * ×1.0 (the coach's policy verbatim); divergence can only come from
 * bloodline mutation + crossover + selection. Report per-key population
 * spread, how role means differentiate (do STs evolve shot-hungry, MFs
 * combination-minded?), the style-trait census, and the most distinctive
 * individuals the nameplate grammar finds.
 *
 *   npx tsx scripts/probes/player-style.ts [gens] [seed ...]
 */
import { SQUAD_ROLES } from '../../src/evolution/playerGenome';
import {
  PLAYER_STYLE_KEYS, playerDimStats, playerNameplate, playerVector,
} from '../../src/evolution/playerStyle';
import { TRAIT_EMOJI, traitsOf } from '../../src/evolution/traits';
import { League } from '../../src/sim/League';

const gens = Number(process.argv[2] ?? 30);
const seeds = process.argv.slice(3).map(Number);
if (seeds.length === 0) seeds.push(424242, 777);

for (const seed of seeds) {
  const league = new League({ seed });
  const t0 = performance.now();
  const spreadCurve: number[] = [];
  for (let s = 0; s < gens; s++) {
    while (!league.seasonDone) {
      const f = league.nextFixture()!;
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
    league.finishSeason();
    const all = league.franchises.flatMap((f) => f.squadStyles);
    const mean = PLAYER_STYLE_KEYS.map((k) => all.reduce((a, x) => a + x[k], 0) / all.length);
    spreadCurve.push(
      PLAYER_STYLE_KEYS.reduce((acc, k, i) =>
        acc + Math.sqrt(all.reduce((a, x) => a + (x[k] - mean[i]) ** 2, 0) / all.length), 0) /
      PLAYER_STYLE_KEYS.length,
    );
  }
  console.log(`\n===== seed ${seed} — ${gens} gens in ${((performance.now() - t0) / 1000).toFixed(0)}s =====`);
  console.log(`style spread (mean per-key std, born 0): ${spreadCurve.filter((_, i) => i % 5 === 4).map((v) => v.toFixed(3)).join(' ')}`);

  // Per-role mean multipliers — differentiated means = role identities EMERGED.
  console.log('role means per key (deviation from ×1.0):');
  for (const key of PLAYER_STYLE_KEYS) {
    const byRole = ['GK', 'DF', 'MF', 'WG', 'ST'].map((role) => {
      const vals = league.franchises.flatMap((f) =>
        f.squadStyles.filter((_, i) => SQUAD_ROLES[i] === role).map((x) => x[key]));
      return `${role} ${(vals.reduce((a, b) => a + b, 0) / vals.length - 1).toFixed(2)}`;
    });
    console.log(`  ${key.padEnd(12)} ${byRole.join('  ')}`);
  }

  // Style-trait census + the most distinctive individuals.
  const stats = playerDimStats(
    league.franchises.flatMap((f) => f.squad.map((p, i) => playerVector(p, f.squadStyles[i]))));
  let styleTraits = 0;
  const plates: Array<{ who: string; words: string[] }> = [];
  for (const f of league.franchises) {
    f.squad.forEach((p, i) => {
      const tr = traitsOf(p, SQUAD_ROLES[i], f.squadStyles[i]);
      if (tr.some((t) => t === 'maverick' || t === 'trickster' || t === 'shadow')) styleTraits++;
      const words = playerNameplate(playerVector(p, f.squadStyles[i]), stats);
      if (words.length > 0) plates.push({ who: `${f.playerNames[i]} (${f.short} ${SQUAD_ROLES[i]}) ${tr.map((t) => TRAIT_EMOJI[t]).join('')}`, words });
    });
  }
  console.log(`style-trait wearers: ${styleTraits}/96 · players with a personal nameplate: ${plates.length}/96`);
  for (const p of plates.slice(0, 8)) console.log(`  ${p.who} — ${p.words.join(', ')}`);
}
