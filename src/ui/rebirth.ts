import type { Franchise, LineageEntry } from '../evolution/franchise';
import { GENE_KEYS, type GeneKey, type TacticalGenome } from '../evolution/genome';
import type { SeasonRecord } from '../sim/League';
import type { TeamStyle } from '../sim/types';

/**
 * Rebirth-ceremony view-model (Phase 32.5) — pure data mining, no DOM, so the
 * "what actually evolved" logic is unit-testable. The renderers consume this.
 */

type KitColors = { primary: number; secondary: number };

export interface CeremonyDeath {
  slot: number;
  /** The club that died to make room. */
  oldName: string;
  newName: string;
  parents: string[];
  /** Crossover inputs (dominant first) — snapshot, or null on pre-32.5 records. */
  parentGenomes: [TacticalGenome, TacticalGenome] | null;
  childGenome: TacticalGenome | null;
  inheritedStyle: TeamStyle | null;
  fitness: number;
  drift: number;
  /** Genes that landed OUTSIDE both parents' range — novel mutations. */
  mutated: GeneKey[];
  colors: KitColors | null;
  parentColors: Array<KitColors | null>;
}

export interface CeremonyModel {
  fromGen: number;
  toGen: number;
  deaths: CeremonyDeath[];
  /** Surviving clubs whose tactical identity switched a component. */
  switches: Array<{ name: string; note: string }>;
  elites: string[];
}

/**
 * Genes where the child sits outside [min(pa,pb) − eps, max(pa,pb) + eps].
 * Crossover can only produce a[k], b[k] or their mean — all inside the
 * range — so anything outside is a genuine mutation (mutations that landed
 * back inside the range are invisible by construction, and that's honest:
 * they didn't create anything the parents couldn't have).
 */
export function mutatedGenes(
  child: TacticalGenome,
  pa: TacticalGenome,
  pb: TacticalGenome,
  eps = 0.02,
): GeneKey[] {
  const out: GeneKey[] = [];
  for (const k of GENE_KEYS) {
    const lo = Math.min(pa[k], pb[k]) - eps;
    const hi = Math.max(pa[k], pb[k]) + eps;
    if (child[k] < lo || child[k] > hi) out.push(k);
  }
  return out;
}

const WAS_RE = /^was (.+)$/;

/**
 * Build the ceremony from a season record. `franchises` (the CURRENT league
 * population) supplies kit colors and a genome fallback for pre-32.5 records
 * — valid only while `rec` is the latest season, which is the only season a
 * ceremony is shown for.
 */
export function buildCeremony(rec: SeasonRecord, franchises: Franchise[]): CeremonyModel {
  const bySlot = new Map(franchises.map((f) => [f.slot, f]));
  const byName = new Map(franchises.map((f) => [f.name, f]));

  const deaths: CeremonyDeath[] = [];
  const switches: Array<{ name: string; note: string }> = [];
  const elites: string[] = [];

  for (const e of rec.evolution.entries) {
    if (e.kind === 'elite') {
      elites.push(e.name);
    } else if (e.kind === 'mutated') {
      if (e.note) switches.push({ name: e.name, note: e.note });
    } else {
      const f = bySlot.get(e.slot);
      const lineageReborn = f
        ? [...f.lineage].reverse().find((l) => l.event === 'reborn' && l.generation === rec.evolution.generation)
        : undefined;
      const oldName = e.oldName ?? lineageReborn?.note?.match(WAS_RE)?.[1] ?? '?';
      const parents = e.parents ?? lineageReborn?.parents ?? [];
      // Snapshots first; fall back to live franchise state for old records.
      const parentGenomes =
        e.parentGenomes ??
        (parents.length === 2 && parents.every((p) => byName.has(p))
          ? ([{ ...byName.get(parents[0])!.coach.genome }, { ...byName.get(parents[1])!.coach.genome }] as [
              TacticalGenome,
              TacticalGenome,
            ])
          : null);
      const childGenome = e.childGenome ?? (f ? { ...f.coach.genome } : null);
      deaths.push({
        slot: e.slot,
        oldName,
        newName: e.name,
        parents,
        parentGenomes,
        childGenome,
        inheritedStyle: e.inheritedStyle ?? f?.coach.style ?? null,
        fitness: e.fitness,
        drift: e.drift,
        mutated: parentGenomes && childGenome ? mutatedGenes(childGenome, parentGenomes[0], parentGenomes[1]) : [],
        colors: f?.colors ?? null,
        parentColors: parents.map((p) => byName.get(p)?.colors ?? null),
      });
    }
  }

  return {
    fromGen: rec.generation,
    toGen: rec.evolution.generation,
    deaths,
    switches,
    elites,
  };
}

/**
 * Family tree of a league slot: one hop per rebirth, newest first. Each
 * incarnation's born-name is reconstructed from the NEXT rebirth's
 * "was <name>" note (the club renamed at birth; the entry only knows who
 * died). Capped so a 40-season save doesn't flood a card.
 */
export function parentChain(
  lineage: LineageEntry[],
  currentName: string,
  max = 3,
): Array<{ generation: number; child: string; parents: string[] }> {
  const rebirths = lineage.filter((l) => l.event === 'reborn');
  const hops: Array<{ generation: number; child: string; parents: string[] }> = [];
  for (let i = rebirths.length - 1; i >= 0 && hops.length < max; i--) {
    const next = rebirths[i + 1];
    const child = i === rebirths.length - 1 ? currentName : next?.note?.match(WAS_RE)?.[1] ?? '?';
    hops.push({ generation: rebirths[i].generation, child, parents: rebirths[i].parents ?? [] });
  }
  return hops;
}

/** Short radar axis labels, in GENE_KEYS order (zh default, like the UI). */
export function geneAxisLabels(lang: 'zh' | 'en'): string[] {
  const ZH: Record<GeneKey, string> = {
    passBias: '传球', shootBias: '射门', dribbleBias: '盘带', pressIntensity: '逼抢',
    defensiveCompactness: '紧凑', attackingWidth: '宽度', riskTolerance: '冒险',
    counterAttackBias: '反击', staminaConservation: '节能', markingAggression: '盯人',
    keeperAggression: '门将', tempo: '节奏', formationDepth: '阵高', supportDistance: '接应',
    rotationBias: '轮换', underdogShift: '逆境', tinkerBias: '临场',
  };
  const EN: Record<GeneKey, string> = {
    passBias: 'pass', shootBias: 'shot', dribbleBias: 'drib', pressIntensity: 'press',
    defensiveCompactness: 'cmpct', attackingWidth: 'width', riskTolerance: 'risk',
    counterAttackBias: 'cntr', staminaConservation: 'stam', markingAggression: 'mark',
    keeperAggression: 'GK', tempo: 'tempo', formationDepth: 'depth', supportDistance: 'supp',
    rotationBias: 'rota', underdogShift: 'udog', tinkerBias: 'tink',
  };
  const m = lang === 'zh' ? ZH : EN;
  return GENE_KEYS.map((k) => m[k]);
}

/** Genome → values array in GENE_KEYS (radar axis) order. */
export const genomeValues = (g: TacticalGenome): number[] => GENE_KEYS.map((k) => g[k]);
