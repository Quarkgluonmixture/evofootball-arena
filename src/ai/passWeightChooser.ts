/**
 * PW T0b — THE RUNG-GRAIN PASS-WEIGHT CHOOSER
 * (docs/world-model/PW-T0B-WEIGHT-CHOOSER.md; contract PW-PASSWEIGHT-CONTRACT.md §2 M-PW.2,
 * design FIXED by ruling #292.4).
 *
 * The live game has one pace per range: `performPass`'s `powerChoice` input has existed since
 * C1-A and every live caller passes the literal 1 (PW-C0 §A.1). This module is the chooser that
 * would use it — and NOTHING ELSE. It has exactly one caller, `PlayerBrain`'s `pwWeightChooser`
 * block, which is dormant in every production path.
 *
 * ⭐⭐ THE GRAIN IS THE POINT (#292.4). PW-T0a measured the SHIPPED joining rule
 * (`preferredPassPower`) per option and found it wants the softest legal ball ~4/5 of the time —
 * because L4 admission puts 100 % of PUBLISHED survivors in threat quintile q0, so the corridor
 * half of the price is saturated before the rule is asked. The firmer ball's value therefore
 * lives in ADMISSION, not in price: the only population where the quintile ever improves is the
 * UNION — options today's ladder does not publish at 1.00 (PW-T0a §B.2). So this chooser is
 * enumerated at RUNG GRAIN:
 *
 *   * every (mate × rung) pair is asked of the SHIPPED affordance oracle AT THAT RUNG'S POWER,
 *     and each pair stands alone — an option dead at 1.00 and alive at 1.15 ENTERS the candidate
 *     set as its own candidate, and an option that prices at only one rung is a candidate at
 *     that rung. `preferredPassPower`'s all-three-rungs refusal is NOT inherited: it is a
 *     per-option normalisation artefact (its price divides by the reference rung's touch
 *     survival, which does not exist when the option does not exist at 1.00), and it is exactly
 *     the mechanism that hides the admission population.
 *   * ONE TABLE, no new constants (M-PW.2): the price is the SAME two factors the shipped rule
 *     joins — the oracle's own threat-quintile price at that rung × the BASE touch-fail survival
 *     at that rung. The heavy curve is STRUCK for the chooser (#292.3: measured to make the axis
 *     MORE floor-degenerate), so the base curve is the one asked, always.
 *   * the argmax picks (mate, weight) JOINTLY over one flat candidate list.
 *
 * ⭐ DIVERGENCE-1 (#291.1(c), magnitude measured at #292.3): the sim strikes with
 * `orientationPowerMul` (the passer's own body alignment) and the oracle prices without it, at
 * every power. Under the PW flag ONLY the caller hands this module the passer's OWN orientation
 * multiplier per target, and it rides INTO the oracle's `powerMultiplier` — self-knowledge, the
 * INFO-DOCTRINE §0 class (a body knows which way it is turned). Production paths never reach
 * this module, so no production price gains the term.
 *
 * Pure: it reads a `PerceptionSnapshot`, the reach profiles and the caller's own orientation
 * table. No Match, no truth, no RNG, no mutation of its inputs.
 */
import { evaluatePassOption } from './passOptionValue';
import { threatQuintilePrice } from './perceivedPassChoice';
import type { PerceptionSnapshot } from './perceptionSnapshot';
import type { KnownReachProfile } from './reachability';

/** One (mate × rung) pair that the oracle ADMITTED at that rung, priced at that rung. */
export interface PassWeightCandidate {
  readonly targetGid: number;
  /** Index into the ladder the caller supplied (the engine's own PASS_CANARY_POWERS). */
  readonly powerIndex: number;
  /** ⭐ THE INTENDED WEIGHT — what `performPass` is asked for; never the oracle-facing product. */
  readonly power: number;
  /** The power the ORACLE was asked with: `power × orientation` (the flag's own term). */
  readonly oraclePower: number;
  /** quintilePrice(threat at this rung) × (1 − touchFail at this rung), base curve. */
  readonly price: number;
  readonly threatSeconds: number;
  readonly touchFailPrior: number;
  readonly arrivalMarginSeconds: number;
  /**
   * ⭐ PURE OBSERVATION, NEVER A FILTER: whether this pair also clears the CENSUS ladder's own
   * race and corridor rungs at this power (BU-C0's L3 `arrivalMargin > 0` ∧ L4 "no defender has
   * a feasible interception point", the latter read as the oracle's own `threat < 0` — see
   * PW-T0a §B.2's derivation of that equivalence). Admission here is the ORACLE'S NULL CONTRACT
   * (#292.4 as written); this flag exists so the stage can COUNT the census-grain admission
   * population without the chooser ever acting on it.
   */
  readonly liveOnCensusLadder: boolean;
}

export interface PassWeightChoice {
  readonly targetGid: number;
  /** ⭐ the weight that must ride the pending pass all the way to the strike. */
  readonly power: number;
  readonly powerIndex: number;
  readonly price: number;
  readonly candidates: readonly PassWeightCandidate[];
  /** (mate × rung) pairs ASKED of the oracle — the ×3 cost receipt's numerator. */
  readonly pairsAsked: number;
  /** Mates with at least one admitted rung. */
  readonly matesAdmitted: number;
  /**
   * ⭐ THE ADMISSION RECEIPT (#292.4): pairs admitted at a NON-DEFAULT rung whose own mate is
   * NOT admitted at the reference rung 1.00 — the population PW-T0a's `ref` set could not see.
   */
  readonly pairsAdmittedOnlyOffReference: number;
  /** Mates admitted at some rung but NOT at the reference rung. */
  readonly matesAdmittedOnlyOffReference: number;
  /**
   * ⭐ THE REFUSAL-INHERITANCE RECEIPT: pairs dropped for failing to price at ANOTHER rung.
   * Structurally 0 — each pair stands alone — and published so the claim is a count, not a
   * comment.
   */
  readonly pairsDroppedForOtherRungRefusal: number;
  /**
   * ⭐ THE CENSUS-GRAIN ADMISSION OBSERVATION (never acted on): pairs that are LIVE on the census
   * ladder at a NON-DEFAULT rung whose own mate is NOT live at the reference rung — the
   * "alive at 1.15, dead at 1.00" population PW-T0a's `ref` set could not see (#292.2). Counted
   * because the oracle's own null contract turns out never to bind inside the live 6–30 m
   * window (ground-pass range at the window's near edge already exceeds it), so the null-grain
   * counters above would report the admission story as an empty one.
   */
  readonly pairsLiveOnlyOffReference: number;
  readonly matesLiveOnlyOffReference: number;
  /** Pairs live on the census ladder at all, and mates with at least one such pair. */
  readonly pairsLive: number;
  readonly matesLive: number;
}

export interface PassWeightChooserInput {
  readonly snapshot: PerceptionSnapshot;
  readonly passerGid: number;
  /** In window order, as the roster iterates — the live chooser's own candidate list. */
  readonly candidateGids: readonly number[];
  readonly attackDir: 1 | -1;
  readonly reachProfiles: ReadonlyMap<number, KnownReachProfile>;
  /** The engine's own canary ladder, handed in by the caller (never restated here). */
  readonly powers: readonly number[];
  /**
   * ⭐ DIVERGENCE-1, under the flag only: the passer's OWN orientation power multiplier for each
   * target gid, computed by the caller from the sim's own `orientationPowerMul` on the PERCEIVED
   * direction. A gid the caller did not supply prices at 1 — the shipped (blind) oracle.
   */
  readonly orientationMul: ReadonlyMap<number, number>;
}

/**
 * Enumerate (mate × rung), admit per rung through the shipped oracle, price each admitted pair
 * on the one table at its own rung, and take the joint argmax. Returns null when no pair is
 * admitted at any rung — the caller then keeps the incumbent decision untouched, exactly as the
 * E3 chooser's own null does.
 *
 * Ties break FIRST-WINS on a strict `>` — the shipped argmax's own rule (`perceivedPassChoice`),
 * which with the ladder in `{PASS_POWER_MIN, 1, PASS_POWER_MAX}` order means an exact tie goes to
 * the SOFTER ball (PW-T0a §CORRECTIONS 6: the shipped rule breaks ties toward the floor too).
 */
export function choosePassWeight(input: PassWeightChooserInput): PassWeightChoice | null {
  const {
    snapshot, passerGid, candidateGids, attackDir, reachProfiles, powers, orientationMul,
  } = input;
  const candidates: PassWeightCandidate[] = [];
  const referenceIndex = powers.indexOf(1);
  let pairsAsked = 0;
  let matesAdmitted = 0;
  let matesAdmittedOnlyOffReference = 0;
  let pairsAdmittedOnlyOffReference = 0;
  let pairsLive = 0;
  let matesLive = 0;
  let pairsLiveOnlyOffReference = 0;
  let matesLiveOnlyOffReference = 0;
  for (const targetGid of candidateGids) {
    const orientation = orientationMul.get(targetGid) ?? 1;
    const mine: PassWeightCandidate[] = [];
    let admittedAtReference = false;
    for (let powerIndex = 0; powerIndex < powers.length; powerIndex++) {
      const power = powers[powerIndex];
      const oraclePower = power * orientation;
      pairsAsked++;
      const value = evaluatePassOption({
        snapshot, passerGid, targetGid, powerMultiplier: oraclePower, attackDir, reachProfiles,
      });
      // PER-RUNG ADMISSION: a null here retires THIS pair and nothing else. No sibling rung is
      // consulted, so no pair is ever dropped for another rung's refusal.
      if (value === null) continue;
      if (powerIndex === referenceIndex) admittedAtReference = true;
      mine.push({
        targetGid,
        powerIndex,
        power,
        oraclePower,
        price: threatQuintilePrice(value.interceptionThreatSeconds) * (1 - value.touchFailPrior),
        threatSeconds: value.interceptionThreatSeconds,
        touchFailPrior: value.touchFailPrior,
        arrivalMarginSeconds: value.arrivalMarginSeconds,
        liveOnCensusLadder: value.arrivalMarginSeconds > 0 && value.interceptionThreatSeconds < 0,
      });
    }
    if (mine.length === 0) continue;
    matesAdmitted++;
    if (!admittedAtReference) {
      matesAdmittedOnlyOffReference++;
      pairsAdmittedOnlyOffReference += mine.length;
    }
    const live = mine.filter((c) => c.liveOnCensusLadder);
    pairsLive += live.length;
    if (live.length > 0) {
      matesLive++;
      if (!live.some((c) => c.powerIndex === referenceIndex)) {
        matesLiveOnlyOffReference++;
        pairsLiveOnlyOffReference += live.length;
      }
    }
    for (const c of mine) candidates.push(c);
  }
  if (candidates.length === 0) return null;
  let best = candidates[0];
  for (let i = 1; i < candidates.length; i++) {
    if (candidates[i].price > best.price) best = candidates[i];
  }
  return {
    targetGid: best.targetGid,
    power: best.power,
    powerIndex: best.powerIndex,
    price: best.price,
    candidates,
    pairsAsked,
    matesAdmitted,
    pairsAdmittedOnlyOffReference,
    matesAdmittedOnlyOffReference,
    pairsDroppedForOtherRungRefusal: 0,
    pairsLiveOnlyOffReference,
    matesLiveOnlyOffReference,
    pairsLive,
    matesLive,
  };
}
