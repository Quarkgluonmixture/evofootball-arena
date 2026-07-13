// Probe: trait census (Phase 39). Two questions: (1) RARITY — traits are
// individuality, so if everyone has two it's soup and if nobody has any
// it's dead code; measured on newgen squads AND after seasons of
// development (attrs drift, traits appear/disappear — they're derived).
// (2) The enforcer DISCONTINUITY: staged tackle trials at defending 0.79
// vs 0.81 — attrs differ by a hair, the step is the trait's own +0.04.
//   npx tsx scripts/probes/trait-census.ts
import { randomSquad, SQUAD_ROLES, type PlayerAttributes, ATTR_KEYS } from '../../src/evolution/playerGenome';
import { TRAIT_KEYS, traitsOf, type Trait } from '../../src/evolution/traits';
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';
import { Rng } from '../../src/utils/rng';

// ---- 1. Newgen census ----
const counts: Record<Trait, number> = { clinical: 0, playmaker: 0, enforcer: 0, engine: 0, poacher: 0, cat: 0 };
const perPlayer = [0, 0, 0]; // 0, 1, 2 traits
let players = 0;
{
  const rng = new Rng(20260713);
  for (let s = 0; s < 400; s++) {
    const squad = randomSquad(rng);
    squad.forEach((a, i) => {
      const tr = traitsOf(a, SQUAD_ROLES[i]);
      players++;
      perPlayer[tr.length]++;
      for (const t of tr) counts[t]++;
    });
  }
}
console.log(`newgen census (${players} players):`);
console.log(`  0/1/2 traits: ${perPlayer.map((c) => ((c / players) * 100).toFixed(1) + '%').join(' / ')}`);
for (const t of TRAIT_KEYS) console.log(`  ${t}: ${((counts[t] / players) * 100).toFixed(1)}%`);

// ---- 2. After development (8 seasons of league aging) ----
{
  const seedLg = new League({ seed: 4242 });
  const out = runHeadless(seedLg.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration',
    target: seedLg.generation + 8,
  });
  const lg = League.fromJSON(out.league as Record<string, unknown>);
  let n = 0;
  const withTrait = { any: 0 };
  const devCounts: Record<Trait, number> = { clinical: 0, playmaker: 0, enforcer: 0, engine: 0, poacher: 0, cat: 0 };
  for (const f of lg.franchises) {
    f.squad.forEach((a: PlayerAttributes, i: number) => {
      n++;
      const tr = traitsOf(a, SQUAD_ROLES[i]);
      if (tr.length) withTrait.any++;
      for (const t of tr) devCounts[t]++;
    });
  }
  console.log(`evolved league (gen 8, ${n} players): ${((withTrait.any / n) * 100).toFixed(1)}% carry a trait`);
  for (const t of TRAIT_KEYS) console.log(`  ${t}: ${((devCounts[t] / n) * 100).toFixed(1)}%`);
}

// ---- 3. Enforcer discontinuity (bar 0.8): tackle win rate step ----
// Direct mechanism trial: the tackle probability formula's inputs are all
// visible, so simulate the roll odds themselves across the bar.
{
  const mk = (defending: number): PlayerAttributes => {
    const a = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) a[k] = 0.5;
    a.defending = defending;
    return a;
  };
  const pWin = (defending: number): number => {
    const enforcer = traitsOf(mk(defending), 'DF').includes('enforcer');
    let p = 0.21 + 0.5 * 0.2 + defending * 0.24 - 0.5 * 0.08 - 0.5 * 0.12;
    if (enforcer) p += 0.04;
    return p;
  };
  const below = pWin(0.79);
  const above = pWin(0.81);
  console.log(`enforcer discontinuity: p(win) ${below.toFixed(3)} @0.79 → ${above.toFixed(3)} @0.81 (attr slope alone would add ${(0.02 * 0.24).toFixed(4)})`);
}
