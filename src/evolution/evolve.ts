import type { Rng } from '../utils/rng';
import { crossoverGenomes, geneDistance, mutateGenome } from './genome';
import type { Franchise } from './franchise';
import { generatePlayerNames, shortName, uniqueTeamName } from './names';
import { crossoverSquads, mutateSquad } from './playerGenome';

/**
 * End-of-season evolution over the 8 league slots (ranked by fitness):
 *   ranks 1–2  ELITE    — genome untouched; proven tactics survive intact
 *   ranks 3–5  MUTATED  — small gaussian tweaks; mid-table teams experiment
 *   ranks 6–8  REBORN   — replaced by a crossover child of two elite-pool
 *                          parents plus a bigger mutation; the slot (and kit
 *                          color) survives so lineages stay followable.
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

export function evolveFranchises(
  franchises: Franchise[],
  fitnessBySlot: Map<number, number>,
  generation: number,
  rng: Rng,
): EvolutionReport {
  const ranked = [...franchises].sort(
    (a, b) => (fitnessBySlot.get(b.slot) ?? 0) - (fitnessBySlot.get(a.slot) ?? 0) || a.slot - b.slot,
  );
  const takenNames = new Set(franchises.map((f) => f.name));
  const entries: EvolutionEntry[] = [];
  const nextGen = generation + 1;

  // Weighted parent pool: top 4, weights 4/3/2/1.
  const pool = ranked.slice(0, 4);
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
    if (rank < 2) {
      f.lineage.push({ generation: nextGen, event: 'elite', fitness });
      entries.push({ slot: f.slot, name: f.name, kind: 'elite', fitness, drift: 0 });
    } else if (rank < 5) {
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

  return { generation: nextGen, entries };
}
