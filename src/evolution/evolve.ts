import type { Rng } from '../utils/rng';
import { crossoverGenomes, geneDistance, mutateGenome } from './genome';
import type { Franchise } from './franchise';
import { generatePlayerNames, shortName, uniqueTeamName } from './names';
import { crossoverSquads, mutateSquad } from './playerGenome';

/**
 * End-of-season evolution, generalized for the two-division era. A group
 * (one division) is ranked by fitness and split into bands:
 *
 *   top eliteN            ELITE    — genome untouched; proven tactics survive
 *   middle                MUTATED  — small gaussian tweaks
 *   bottom rebornN        REBORN   — crossover child of two parents sampled
 *                                    from `parentPool` (defaults to the
 *                                    group's own top-4), heavier mutation,
 *                                    new name; the slot/kit survives.
 *
 * Division 1 runs with rebornN=0 (its bottom two relegate instead of dying);
 * Division 2 rebirths its bottom three from DIVISION 1's elite pool, so new
 * blood always enters the ecosystem at the bottom of the pyramid.
 */
export interface EvolutionEntry {
  slot: number;
  name: string;
  kind: 'elite' | 'mutated' | 'reborn';
  parents?: string[];
  fitness: number;
  /** Gene-space distance moved this generation (0 for elites). */
  drift: number;
}

export interface EvolutionReport {
  generation: number;
  entries: EvolutionEntry[];
}

export interface EvolvePlan {
  eliteN: number;
  rebornN: number;
  /** Parent candidates for reborn slots, strongest first (weights 4/3/2/1). */
  parentPool?: Franchise[];
}

export function evolveGroup(
  franchises: Franchise[],
  fitnessBySlot: Map<number, number>,
  generation: number,
  rng: Rng,
  plan: EvolvePlan,
  takenNames: Set<string>,
): EvolutionEntry[] {
  const ranked = [...franchises].sort(
    (a, b) => (fitnessBySlot.get(b.slot) ?? 0) - (fitnessBySlot.get(a.slot) ?? 0) || a.slot - b.slot,
  );
  const entries: EvolutionEntry[] = [];
  const nextGen = generation + 1;
  const rebornFrom = ranked.length - plan.rebornN;

  const pool = (plan.parentPool ?? ranked).slice(0, 4);
  const pickParent = (exclude?: Franchise): Franchise => {
    const cands = pool.filter((f) => f !== exclude);
    const weights = cands.map((f) => 4 - pool.indexOf(f));
    const totalW = weights.reduce((a, b) => a + b, 0);
    let r = rng.next() * totalW;
    for (let i = 0; i < cands.length; i++) {
      r -= weights[i];
      if (r <= 0) return cands[i];
    }
    return cands[cands.length - 1];
  };

  ranked.forEach((f, rank) => {
    const fitness = fitnessBySlot.get(f.slot) ?? 0;
    if (rank < plan.eliteN) {
      f.lineage.push({ generation: nextGen, event: 'elite', fitness });
      entries.push({ slot: f.slot, name: f.name, kind: 'elite', fitness, drift: 0 });
    } else if (rank < rebornFrom) {
      const before = f.genome;
      f.genome = mutateGenome(f.genome, rng, { rate: 0.4, scale: 0.08 });
      f.squad = mutateSquad(f.squad, rng, { rate: 0.3, scale: 0.06 });
      f.lineage.push({ generation: nextGen, event: 'mutated', fitness });
      entries.push({ slot: f.slot, name: f.name, kind: 'mutated', fitness, drift: geneDistance(before, f.genome) });
    } else {
      const pa = pickParent();
      const pb = pickParent(pa);
      const before = f.genome;
      f.genome = mutateGenome(crossoverGenomes(pa.genome, pb.genome, rng), rng, { rate: 0.5, scale: 0.15 });
      f.squad = mutateSquad(crossoverSquads(pa.squad, pb.squad, rng), rng, { rate: 0.4, scale: 0.1 });
      const oldName = f.name;
      takenNames.delete(oldName);
      f.name = uniqueTeamName(rng, takenNames);
      f.short = shortName(f.name);
      f.playerNames = generatePlayerNames(rng);
      f.id = `T${f.slot}-g${nextGen}`;
      f.elo = 1500; // a new project starts from scratch
      f.lineage.push({
        generation: nextGen,
        event: 'reborn',
        parents: [pa.name, pb.name],
        fitness,
        note: `was ${oldName}`,
      });
      entries.push({
        slot: f.slot,
        name: f.name,
        kind: 'reborn',
        parents: [pa.name, pb.name],
        fitness,
        drift: geneDistance(before, f.genome),
      });
    }
  });

  return entries;
}
