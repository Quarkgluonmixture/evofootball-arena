/**
 * EDS E3 — the perceived pass CHOICE, as a live consumer.
 * Authority: docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md §2.1
 *
 * Everything the slice measured before this file ran dormant: E2b-1R priced real
 * decision moments inside a probe and forced the winner through
 * `forcedPassTarget`. Nothing had ever CHOSEN a pass inside a live match. This
 * module is that chooser, lifted out of the probe unchanged in substance so the
 * live path and the validated path are the same arithmetic:
 *
 *   READ         target and lane both in the passer's current percept
 *                → E2b-0's measured exchange rate (threat quintile → probability)
 *   SEEN-UNREAD  the man is perceived, the lane is not readable
 *                → E2a-2's option-space band prior at the PERCEIVED distance
 *   UNSEEN       no percept of the man at all
 *                → the option-space marginal; priced always, never executable
 *                  (ruling #8 (l): a man you cannot aim at cannot be kicked to)
 *
 * One measured probability axis, no hand-set weight anywhere: every number comes
 * out of `passPrior.ts`, which is committed census DATA.
 *
 * Two deliberate faithfulness notes, both pinned by the E3 probe's X4 gate:
 *
 * 1. The READ price here reads `THREAT_CALIBRATION[q].realizedSuccess` — the
 *    banked composite — where E2b-1R's probe multiplied its two re-derived
 *    factors (`reached × cleanGivenReached`). E2b-1R's X5 asserted those agree
 *    to <1e-12, and X4 asserts the substitution changes no choice.
 * 2. The candidate WINDOW (6–30 m, E0's censused window — the only range any of
 *    these priors was measured over) is measured on true positions, exactly as
 *    the probe enumerated it. The window decides which options exist; the
 *    PRICE and the executable rule are perceived. Registered as a v1 boundary
 *    beside ruling #11.3's aiming registration.
 */
import {
  OPTION_SPACE_PRIOR_MARGINAL, optionSpacePriorAt, THREAT_CALIBRATION,
} from './passPrior';
import { evaluatePassOption } from './passOptionValue';
import type { PerceptionSnapshot } from './perceptionSnapshot';
import type { KnownReachProfile } from './reachability';

/** E0's candidate window, and the range every prior in `passPrior.ts` covers. */
export const PASS_CHOICE_MIN_METRES = 6;
export const PASS_CHOICE_MAX_METRES = 30;

export type PassInfoClass = 'READ' | 'SEEN-UNREAD' | 'UNSEEN';

export interface PricedPassOption {
  readonly targetGid: number;
  readonly infoClass: PassInfoClass;
  /** Measured probability the intended man ends up in clean control. */
  readonly price: number;
  readonly executable: boolean;
  /** PERCEIVED distance; NaN for UNSEEN — he does not know, and it must not read as 0. */
  readonly distance: number;
}

export interface PerceivedPassChoice {
  readonly targetGid: number;
  readonly price: number;
  readonly infoClass: PassInfoClass;
  readonly distance: number;
  readonly options: readonly PricedPassOption[];
  /** Look-pressure, read axis: a blind option out-prices every executable one. */
  readonly blindOutpricesRead: boolean;
  /** Look-pressure, band axis: it also beats the best executable BAND price. */
  readonly blindOutpricesBand: boolean;
}

export interface PerceivedPassChoiceInput {
  readonly snapshot: PerceptionSnapshot;
  readonly passerGid: number;
  /** In window order, as the roster iterates — ties resolve by lower gid anyway. */
  readonly candidateGids: readonly number[];
  readonly attackDir: 1 | -1;
  readonly reachProfiles: ReadonlyMap<number, KnownReachProfile>;
}

const distanceBetween = (
  left: Readonly<{ x: number; y: number }>, right: Readonly<{ x: number; y: number }>,
): number => Math.hypot(left.x - right.x, left.y - right.y);

/**
 * E2b-0's curve as a price: which quintile of predicted corridor threat this
 * option falls in, and what share of THOSE options historically ended with the
 * intended man in clean control. The last quintile catches everything above it.
 */
export function threatQuintilePrice(threatSeconds: number): number {
  for (const row of THREAT_CALIBRATION) if (threatSeconds <= row.keyTo) return row.realizedSuccess;
  return THREAT_CALIBRATION[THREAT_CALIBRATION.length - 1].realizedSuccess;
}

/** The window is a truth-measured scope (see the header note), never a price. */
export function passChoiceCandidateGids(
  passer: Readonly<{ gid: number; pos: Readonly<{ x: number; y: number }> }>,
  teammates: readonly Readonly<{
    gid: number; pos: Readonly<{ x: number; y: number }>; role: string; sentOff: boolean;
  }>[],
): number[] {
  const gids: number[] = [];
  for (const mate of teammates) {
    if (mate.gid === passer.gid || mate.sentOff || mate.role === 'GK') continue;
    const d = distanceBetween(mate.pos, passer.pos);
    if (d < PASS_CHOICE_MIN_METRES || d > PASS_CHOICE_MAX_METRES) continue;
    gids.push(mate.gid);
  }
  return gids;
}

/**
 * Price ONE candidate on the single measured axis. The information class decides
 * WHICH census answers, and nothing here is weighted by hand.
 */
export function pricePassOption(input: {
  readonly snapshot: PerceptionSnapshot;
  readonly passerGid: number;
  readonly targetGid: number;
  readonly attackDir: 1 | -1;
  readonly reachProfiles: ReadonlyMap<number, KnownReachProfile>;
}): PricedPassOption {
  const { snapshot, passerGid, targetGid, attackDir, reachProfiles } = input;
  const seenTarget = snapshot.players.find((entry) => entry.gid === targetGid);
  const seenPasser = snapshot.players.find((entry) => entry.gid === passerGid);
  if (!seenTarget || !seenPasser) {
    const row = OPTION_SPACE_PRIOR_MARGINAL;
    return {
      targetGid,
      infoClass: 'UNSEEN',
      price: row.reachedRate * row.cleanGivenReached,
      executable: false,
      distance: Number.NaN,
    };
  }
  const distance = distanceBetween(seenPasser.pos, seenTarget.pos);
  const value = evaluatePassOption({
    snapshot, passerGid, targetGid, powerMultiplier: 1, attackDir, reachProfiles,
  });
  if (value === null) {
    const row = optionSpacePriorAt(distance);
    return {
      targetGid,
      infoClass: 'SEEN-UNREAD',
      price: row.reachedRate * row.cleanGivenReached,
      executable: true,
      distance,
    };
  }
  return {
    targetGid,
    infoClass: 'READ',
    price: threatQuintilePrice(value.interceptionThreatSeconds),
    executable: true,
    distance,
  };
}

/**
 * The chooser. Prices every candidate, picks the best EXECUTABLE one (ties to
 * the lower gid, as the probe's reduce did), and reports whether a blind option
 * out-priced the field — the look-pressure statistic a future gaze consumer
 * will answer. Returns null when no candidate is executable: the passer sees
 * nobody he could aim at, and this module refuses to invent an aim point.
 */
export function choosePerceivedPassTarget(
  input: PerceivedPassChoiceInput,
): PerceivedPassChoice | null {
  const { snapshot, passerGid, candidateGids, attackDir, reachProfiles } = input;
  const options = candidateGids.map((targetGid) => pricePassOption({
    snapshot, passerGid, targetGid, attackDir, reachProfiles,
  }));
  const executable = options.filter((option) => option.executable);
  if (executable.length === 0) return null;
  const best = executable.reduce((winner, option) => (
    option.price > winner.price
      || (option.price === winner.price && option.targetGid < winner.targetGid)
      ? option : winner));
  const blind = options.filter((option) => !option.executable);
  let blindOutpricesRead = false;
  let blindOutpricesBand = false;
  if (blind.length > 0) {
    blindOutpricesRead = blind[0].price > best.price;
    const bestBand = Math.max(...executable.map((option) => (Number.isNaN(option.distance)
      ? OPTION_SPACE_PRIOR_MARGINAL.receptionSuccessRate
      : optionSpacePriorAt(option.distance).receptionSuccessRate)));
    blindOutpricesBand = blind[0].price > bestBand;
  }
  return {
    targetGid: best.targetGid,
    price: best.price,
    infoClass: best.infoClass,
    distance: best.distance,
    options,
    blindOutpricesRead,
    blindOutpricesBand,
  };
}

/**
 * E3's no-strict-dominance CANARY instrument (E0's canary, made live).
 *
 * The live game has no power chooser — `performPass`'s `powerChoice` has no
 * production caller, C1-C was deferred into this slice and E2b-* priced power
 * 1.0 only — so "the share of passes PLAYED at the highest power" has no live
 * quantity behind it. What E0 and E1b's canaries actually measured is the
 * EVALUATOR's preference, and that is what this reports: at a real decision
 * moment, which power would the bundle's own pricing pick for the target it
 * chose?
 *
 * The joining rule is fixed here, before any result, and reports its parts:
 *   price(power) = quintilePrice(threat(power)) × (1 − touchFail(power)) / (1 − touchFail(1.0))
 * At power 1.0 this is exactly the choice axis (no double counting at the
 * reference point); away from it, the measured corridor axis is scaled by the
 * relative first-touch survival the E1a-certified formula predicts. Every
 * component is reported per power so any other joining rule can be applied to
 * the same numbers afterwards.
 */
export interface PowerPreference {
  readonly powers: readonly number[];
  readonly prices: readonly number[];
  readonly threatSeconds: readonly number[];
  readonly touchFailPriors: readonly number[];
  readonly preferredIndex: number;
}

export function preferredPassPower(input: {
  readonly snapshot: PerceptionSnapshot;
  readonly passerGid: number;
  readonly targetGid: number;
  readonly attackDir: 1 | -1;
  readonly reachProfiles: ReadonlyMap<number, KnownReachProfile>;
  readonly powers: readonly number[];
  readonly heavyTouchCost: boolean;
}): PowerPreference | null {
  const { snapshot, passerGid, targetGid, attackDir, reachProfiles, powers } = input;
  const values = powers.map((powerMultiplier) => evaluatePassOption({
    snapshot,
    passerGid,
    targetGid,
    powerMultiplier,
    attackDir,
    reachProfiles,
    heavyTouchCost: input.heavyTouchCost,
  }));
  if (values.some((value) => value === null)) return null;
  const reference = powers.indexOf(1);
  if (reference < 0) return null;
  const referenceSurvival = 1 - values[reference]!.touchFailPrior;
  if (!(referenceSurvival > 0)) return null;
  const prices = values.map((value) => threatQuintilePrice(value!.interceptionThreatSeconds)
    * ((1 - value!.touchFailPrior) / referenceSurvival));
  let preferredIndex = 0;
  for (let index = 1; index < prices.length; index++) {
    if (prices[index] > prices[preferredIndex]) preferredIndex = index;
  }
  return {
    powers,
    prices,
    threatSeconds: values.map((value) => value!.interceptionThreatSeconds),
    touchFailPriors: values.map((value) => value!.touchFailPrior),
    preferredIndex,
  };
}
