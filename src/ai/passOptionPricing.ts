/**
 * EDS E2a — the pricing layer.
 * Authority: docs/world-model/EDS-E2A-CENSUS-PRIORS.md
 *
 * `evaluatePassOption` returns null when the passer's snapshot cannot support
 * the question, and E0 measured what that costs: 55 of 120 states priced
 * NOTHING, every one of them because the teammate was simply absent from the
 * snapshot. Deleting those options is what made not-looking informationally
 * superior in S3b.
 *
 * This layer never returns null. A seen option keeps E0's full physical read
 * and gains its distance band's population prior; an unseen one gets the
 * census MARGINAL and no physical dimensions at all — an unknown must read as
 * unknown, never as zero. Pure: no Match, no truth, no RNG, no mutation, and
 * no live caller.
 */
import { evaluatePassOption, type PassOptionInput, type PassOptionValue } from './passOptionValue';
import { PASS_PRIOR_MARGINAL, passPriorAt, passPriorBandIndex, type PassPriorRow } from './passPrior';

export type PassOptionSource = 'observed' | 'prior';

export interface PricedPassOption {
  readonly targetGid: number;
  readonly powerMultiplier: number;
  readonly source: PassOptionSource;
  /**
   * Expected chance the intended man ends up in clean control. For an observed
   * option this is its own distance band's censused rate; for an unseen one the
   * population marginal. This is the ONE dimension both sources share, which is
   * what makes an unseen option comparable instead of deleted.
   */
  readonly receptionSuccessPrior: number;
  readonly interceptedPrior: number;
  /** Band index the prior came from; null when the marginal was used. */
  readonly priorBand: number | null;
  /**
   * E0's physical read — present ONLY for an observed option. Null here means
   * "the passer does not know", and every consumer must treat it that way
   * rather than substituting a default.
   */
  readonly observed: PassOptionValue | null;
}

export interface PricePassOptionInput extends PassOptionInput {
  /**
   * Distance to the target if the passer OBSERVES it. Deliberately not derived
   * from truth: when the target is missing from the snapshot there is no
   * distance to have, and the marginal is the honest price.
   */
  readonly observedDistanceMetres?: number;
}

const priced = (
  input: PricePassOptionInput,
  source: PassOptionSource,
  row: PassPriorRow,
  band: number | null,
  observed: PassOptionValue | null,
): PricedPassOption => ({
  targetGid: input.targetGid,
  powerMultiplier: input.powerMultiplier,
  source,
  receptionSuccessPrior: row.receptionSuccessRate,
  interceptedPrior: row.interceptedRate,
  priorBand: band,
  observed,
});

/**
 * Price one option (target × power). Always returns a value: an option the
 * passer cannot see is unpriceable in physics, not unavailable in football.
 */
export function pricePassOption(input: PricePassOptionInput): PricedPassOption {
  const observed = evaluatePassOption(input);
  if (observed === null) {
    // Unseen: no distance, so no band. The marginal is what an honest passer
    // knows about a pass to a man he cannot see.
    return priced(input, 'prior', PASS_PRIOR_MARGINAL, null, null);
  }
  const distance = input.observedDistanceMetres;
  if (distance === undefined || !Number.isFinite(distance)) {
    return priced(input, 'observed', PASS_PRIOR_MARGINAL, null, observed);
  }
  return priced(input, 'observed', passPriorAt(distance), passPriorBandIndex(distance), observed);
}

/** True when the option carries a real physical read rather than a base rate. */
export function isObservedOption(option: PricedPassOption): boolean {
  return option.source === 'observed' && option.observed !== null;
}
