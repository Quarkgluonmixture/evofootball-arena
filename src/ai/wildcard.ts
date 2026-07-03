import { GENE_KEYS, type TacticalGenome } from '../evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../evolution/playerGenome';
import type { PolicyParams, TeamInfo } from '../sim/types';

/**
 * The Wildcard XI: a benchmark team whose BRAIN WEIGHTS are learned by the
 * ES trainer while its genes and squad stay deliberately neutral (all 0.5) —
 * isolating "learned policy" from the league's gene-evolution axis. It never
 * joins a league: it exists for exhibitions and headless benchmarks only, so
 * saves, fitness and evolution are untouched.
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

export function buildWildcardTeamInfo(policy: PolicyParams | undefined): TeamInfo {
  return {
    id: 'wildcard',
    name: WILDCARD_NAME,
    short: 'WLD',
    colors: { primary: 0xf5f7fa, secondary: 0x1c1f26 },
    playerNames: ['Zero', 'Vector', 'Tensor', 'Sigma', 'Delta'],
    genome: neutralGenome(),
    squad: neutralSquad(),
    policy,
  };
}
