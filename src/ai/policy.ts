import type { Rng } from '../utils/rng';
import { DEFAULT_POLICY, type PolicyParams } from '../sim/types';

/**
 * Wildcard policy space (Phase 18): the PlayerBrain's utility weights as an
 * evolvable vector. DEFAULT_POLICY (sim/types.ts) is the hand-tuned brain;
 * the ES trainer (scripts/train-wildcard.ts) searches inside POLICY_BOUNDS
 * for weights that win matches outright. Deterministic: all randomness comes
 * from a seeded Rng passed in.
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
