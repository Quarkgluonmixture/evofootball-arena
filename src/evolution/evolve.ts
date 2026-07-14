import type { TeamStyle } from '../sim/types';
import type { Rng } from '../utils/rng';
import { emptyCareer, rookieAge } from './careers';
import { crossoverGenomes, geneDistance, mutateGenome, type TacticalGenome } from './genome';
import type { Franchise } from './franchise';
import { generatePlayerNames, shortName, uniqueTeamName } from './names';
import { crossoverSquads, enforceBudget } from './playerGenome';
import { crossoverPolicyGenes, mutatePolicyGenes } from './policyGenome';

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
  /** Style-switch lineage note for mutated clubs (e.g. "🔧 switched to low-32"). */
  note?: string;
  // Rebirth snapshots (Phase 32.5): the ceremony replays the moment of
  // evolution from the record alone — parents' genomes are copied HERE
  // because the living parents keep evolving after this generation.
  /** Reborn: the club that died to make room. */
  oldName?: string;
  /** Reborn: the crossover inputs, dominant parent first. */
  parentGenomes?: [TacticalGenome, TacticalGenome];
  /** Reborn: the newborn genome (crossover + heavy mutation). */
  childGenome?: TacticalGenome;
  /** Reborn: tactical identity inherited from the dominant parent. */
  inheritedStyle?: TeamStyle;
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
  /**
   * Shared zonal budget (Phase 31): how many MORE clubs may become zonal
   * this evolution pass, across both divisions. Zonal out-defends man
   * structurally (failure mode 18) and inheritance lets selection compound
   * it — without an ecological cap a lucky lineage turned the league 10/16
   * zonal in ten seasons and scoring sank with it. The League computes
   * room = max(0, 4 − current zonal count) and passes ONE mutable object
   * to both division passes.
   */
  zonal?: { room: number };
}

/**
 * Rare, single-component style mutation (Phase 31, ~0.08/season): the club
 * switches ONE of attack formation / defend formation / marking scheme to
 * its alternative. Returns the lineage note when a switch happened. Zonal
 * entry is extra-guarded (×0.3) so the league never drifts zonal-heavy.
 */
function mutateStyle(style: TeamStyle, rng: Rng, zonal?: { room: number }): string | undefined {
  if (!rng.chance(0.08)) return undefined;
  const component = rng.int(0, 2);
  if (component === 0) {
    style.formationAtk = style.formationAtk === 'wide-212' ? 'narrow-122' : 'wide-212';
    return `🔧 switched to ${style.formationAtk}`;
  }
  if (component === 1) {
    style.formationDef = style.formationDef === 'low-32' ? 'press-23' : 'low-32';
    return `🔧 switched to ${style.formationDef}`;
  }
  if (style.scheme === 'zonal') {
    style.scheme = 'man';
    if (zonal) zonal.room += 1;
    return '🔧 switched to man marking';
  }
  // Zonal stays the RARE identity: a second roll AND an open ecology slot.
  if (!rng.chance(0.3)) return undefined;
  if (!zonal || zonal.room <= 0) return undefined;
  zonal.room -= 1;
  style.scheme = 'zonal';
  return '🔧 switched to zonal marking';
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
      // Attacking-style policy drifts too (Phase 42) — decision STYLE evolves.
      f.policy = mutatePolicyGenes(f.policy, rng);
      // Squads no longer take random mutation — since Phase 26 they change
      // through the careers pass instead (development, retirement, newgens).
      // Formations are franchise DNA (Phase 31): a surviving club's style
      // occasionally mutates — ONE component switches to its alternative,
      // logged as a lineage event. Zonal is guarded (failure mode 18: the
      // lattice out-defends man — a zonal-heavy league stops scoring), so
      // mutating INTO it needs a second, rarer roll.
      const styleNote = mutateStyle(f.style, rng, plan.zonal);
      f.lineage.push({ generation: nextGen, event: 'mutated', fitness, note: styleNote });
      entries.push({
        slot: f.slot, name: f.name, kind: 'mutated', fitness,
        drift: geneDistance(before, f.genome), note: styleNote,
      });
    } else {
      const pa = pickParent();
      const pb = pickParent(pa);
      const before = f.genome;
      f.genome = mutateGenome(crossoverGenomes(pa.genome, pb.genome, rng), rng, { rate: 0.5, scale: 0.15 });
      // Formations are franchise DNA (Phase 31): a reborn club INHERITS its
      // tactical identity from the dominant parent — the dynasty's shape
      // survives the rebirth (it used to be re-derived from the child
      // genome, which broke identity continuity every generation). The
      // zonal budget applies to inheritance too: this was THE compounding
      // channel (zonal elite win → parent the reborn → zonal multiplies).
      const wasZonal = f.style.scheme === 'zonal';
      f.style = { ...pa.style };
      if (f.style.scheme === 'zonal' && !wasZonal) {
        if (plan.zonal && plan.zonal.room > 0) plan.zonal.room -= 1;
        else f.style.scheme = 'man';
      } else if (wasZonal && f.style.scheme !== 'zonal' && plan.zonal) {
        plan.zonal.room += 1;
      }
      // The academy intake: attributes cross over from both parents' squads,
      // but the players themselves are NEW — young, unnamed, blank careers.
      // Budget-enforced (Phase 48): two rich parents can't compound past the cap.
      f.squad = enforceBudget(crossoverSquads(pa.squad, pb.squad, rng));
      // The reborn club inherits a blend of both parents' styles, then mutates
      // harder (Phase 42) — a new philosophy from the crossover pool.
      f.policy = mutatePolicyGenes(crossoverPolicyGenes(pa.policy, pb.policy, rng), rng, { rate: 0.5, scale: 0.15 });
      f.ages = f.squad.map(() => rookieAge(rng) + rng.int(0, 5)); // 17–24
      f.careers = f.squad.map(() => emptyCareer());
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
        oldName,
        parentGenomes: [{ ...pa.genome }, { ...pb.genome }],
        childGenome: { ...f.genome },
        inheritedStyle: { ...f.style },
      });
    }
  });

  return entries;
}
