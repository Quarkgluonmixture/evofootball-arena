import { GENE_KEYS, type TacticalGenome } from '../evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../evolution/playerGenome';
import { DEFAULT_POLICY, type PolicyParams, type TeamInfo } from '../sim/types';

/**
 * The Wildcard XI: a benchmark team whose tactical genes AND per-role brain
 * weights are learned together by the ES trainer (Phase 23 co-training; in
 * Phase 18 the genes were pinned neutral). Its squad stays deliberately
 * neutral (all 0.5) — the experiment measures learned decision-making, not
 * physique. It never joins a league: it exists for exhibitions and headless
 * benchmarks only, so saves, fitness and evolution are untouched.
 */

export const WILDCARD_NAME = 'Wildcard XI';

/**
 * A stored champion, possibly trained before newer policy keys existed —
 * its role vectors are treated as partial and backfilled from
 * DEFAULT_POLICY when the team is built (Phase 28 added five keys).
 */
export interface StoredWildcardCandidate {
  genome: TacticalGenome;
  policies: Array<Partial<PolicyParams>>;
}

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
export function buildWildcardTeamInfo(candidate: StoredWildcardCandidate | undefined): TeamInfo {
  return {
    id: 'wildcard',
    name: WILDCARD_NAME,
    short: 'WLD',
    colors: { primary: 0xf5f7fa, secondary: 0x1c1f26 },
    playerNames: ['Zero', 'Vector', 'Tensor', 'Sigma', 'Delta'],
    genome: candidate ? { ...candidate.genome } : neutralGenome(),
    squad: neutralSquad(),
    rolePolicies: candidate?.policies.map((p) => ({ ...DEFAULT_POLICY, ...p })),
  };
}
