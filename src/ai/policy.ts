import type { Rng } from '../utils/rng';
import { clamp01 } from '../utils/math';
import { GENE_KEYS, type TacticalGenome } from '../evolution/genome';
import { DEFAULT_POLICY, ROLES, type PolicyParams } from '../sim/types';

/**
 * Wildcard policy space (Phase 18): the PlayerBrain's utility weights as an
 * evolvable vector. DEFAULT_POLICY (sim/types.ts) is the hand-tuned brain;
 * the ES trainer (scripts/train-wildcard.ts) searches inside POLICY_BOUNDS
 * for weights that win matches outright. Deterministic: all randomness comes
 * from a seeded Rng passed in.
 *
 * Phase 23 widens the search to a WildcardCandidate: the 14 tactical genes
 * are co-trained with FIVE per-role weight vectors ([GK, DF, MF, WG, ST]).
 * Squad DNA stays pinned neutral — physique is deliberately NOT part of the
 * learned experiment (maxed attributes would win trivially and say nothing
 * about the brain).
 */

export const POLICY_KEYS = Object.keys(DEFAULT_POLICY) as Array<keyof PolicyParams>;

/** Search bounds per weight — wide enough to change styles, not break scoring. */
export const POLICY_BOUNDS: Record<keyof PolicyParams, [number, number]> = {
  shootBase: [0.5, 4.0],
  shootGene: [0.5, 4.0],
  shootModeMul: [1.0, 1.6],
  shootPressurePen: [0.0, 0.6],
  passBase: [0.05, 0.5],
  passLaneW: [0.05, 0.7],
  passOpenW: [0.05, 0.5],
  passFwdBase: [0.0, 1.0],
  passFwdRisk: [0.0, 1.5],
  passBackPen: [0.0, 0.6],
  passOutletMul: [1.0, 1.5],
  dribbleBase: [0.05, 0.7],
  dribbleSpaceW: [0.1, 1.2],
  dribbleGeneBase: [0.2, 1.0],
  dribbleGeneW: [0.3, 1.8],
  dribblePressurePen: [0.0, 0.7],
  clearBase: [0.02, 0.4],
  clearPressureW: [0.1, 1.2],
  supportBase: [0.1, 0.7],
  supportProxW: [0.1, 0.7],
  formationBase: [0.2, 0.8],
  chaseBase: [0.5, 1.2],
  markBase: [0.3, 1.0],
  interceptScore: [0.6, 1.3],
  runScore: [0.5, 1.15],
  throughBase: [0.05, 0.6],
  throughOpenW: [0.1, 0.7],
  throughBehindW: [0.1, 0.9],
};

export function clampPolicy(p: PolicyParams): PolicyParams {
  const out = { ...p };
  for (const k of POLICY_KEYS) {
    const [lo, hi] = POLICY_BOUNDS[k];
    out[k] = Math.min(hi, Math.max(lo, out[k]));
  }
  return out;
}

/** Gaussian mutation: each weight drifts by `scale` × its bounded range. */
export function mutatePolicy(base: PolicyParams, rng: Rng, scale: number): PolicyParams {
  const out = { ...base };
  for (const k of POLICY_KEYS) {
    const [lo, hi] = POLICY_BOUNDS[k];
    out[k] = base[k] + rng.gaussian() * (hi - lo) * scale;
  }
  return clampPolicy(out);
}

/** Uniform per-key crossover of two parents. */
export function crossoverPolicy(a: PolicyParams, b: PolicyParams, rng: Rng): PolicyParams {
  const out = { ...a };
  for (const k of POLICY_KEYS) out[k] = rng.chance(0.5) ? a[k] : b[k];
  return out;
}

/* ------------------------------------------------------------------ */
/* Co-trained candidate (Phase 23): genes + per-role policy vectors    */
/* ------------------------------------------------------------------ */

export interface WildcardCandidate {
  /** Learned tactical genes, all clamped to [0, 1]. */
  genome: TacticalGenome;
  /** Per-role policy vectors in role order [GK, DF, MF, WG, ST]. */
  policies: PolicyParams[];
}

/** A candidate from one shared policy (the pre-Phase-23 representation). */
export function candidateFrom(genome: TacticalGenome, policy: PolicyParams): WildcardCandidate {
  return { genome: { ...genome }, policies: ROLES.map(() => ({ ...policy })) };
}

/**
 * Gaussian mutation of the whole candidate. RNG order is fixed (genes first,
 * then policies role by role) — reordering would silently change every
 * trained result for a given seed. Gene range is 1, so `scale` acts directly.
 */
export function mutateCandidate(base: WildcardCandidate, rng: Rng, scale: number): WildcardCandidate {
  const genome = { ...base.genome };
  for (const k of GENE_KEYS) genome[k] = clamp01(base.genome[k] + rng.gaussian() * scale);
  return { genome, policies: base.policies.map((p) => mutatePolicy(p, rng, scale)) };
}

/** Uniform crossover: genes per key, then each role's vector per key. */
export function crossoverCandidate(a: WildcardCandidate, b: WildcardCandidate, rng: Rng): WildcardCandidate {
  const genome = {} as TacticalGenome;
  for (const k of GENE_KEYS) genome[k] = rng.chance(0.5) ? a.genome[k] : b.genome[k];
  return { genome, policies: a.policies.map((p, i) => crossoverPolicy(p, b.policies[i], rng)) };
}
