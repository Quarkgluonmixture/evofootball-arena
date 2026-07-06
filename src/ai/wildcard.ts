import { GENE_KEYS, type TacticalGenome } from '../evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../evolution/playerGenome';
import type { TeamInfo } from '../sim/types';
import type { WildcardCandidate } from './policy';

/**
 * The Wildcard XI: a benchmark team whose tactical genes AND per-role brain
 * weights are learned together by the ES trainer (Phase 23 co-training; in
 * Phase 18 the genes were pinned neutral). Its squad stays deliberately
 * neutral (all 0.5) — the experiment measures learned decision-making, not
 * physique. It never joins a league: it exists for exhibitions and headless
 * benchmarks only, so saves, fitness and evolution are untouched.
 */

export const WILDCARD_NAME = 'Wildcard XI';

export const neutralGenome = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};

export const neutralSquad = (): PlayerAttributes[] =>
  Array.from({ length: 5 }, () => {
    const p = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) p[k] = 0.5;
    return p;
  });

/** Undefined candidate = the untrained baseline: neutral genes, default brain. */
export function buildWildcardTeamInfo(candidate: WildcardCandidate | undefined): TeamInfo {
  return {
    id: 'wildcard',
    name: WILDCARD_NAME,
    short: 'WLD',
    colors: { primary: 0xf5f7fa, secondary: 0x1c1f26 },
    playerNames: ['Zero', 'Vector', 'Tensor', 'Sigma', 'Delta'],
    genome: candidate ? { ...candidate.genome } : neutralGenome(),
    squad: neutralSquad(),
    rolePolicies: candidate?.policies,
  };
}
