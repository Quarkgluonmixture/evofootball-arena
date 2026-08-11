// DV T0 — THE DORMANT RISK-PRICING SEAM (docs/world-model/DV-T0-DORMANT-SEAM.md).
// Contract: docs/world-model/DELIVERY-VALUE-CONTRACT.md §2 M-DV.1 / M-DV.2 (as amended by
// ruling #247) / M-DV.3. Rulings #245 (the map-vs-reality audit), #246 (method reality's,
// numbers this world's, SHAPE the fidelity check), #247 (⭐⭐ TRUTH vs BELIEF), #248 (the
// earned-knowledge ledger — this is the PILOT), #249 (DV-C0 banked, DV-T0 queued).
//
// 出球价值: the delivery pricer's map has two holes the #244 arc named. This seam adds the
// RISK limbs and nothing else:
//
//   (1) FLIGHT EXPOSURE (M-DV.1) — "can this be cut out ON THE WAY", a continuous hazard
//       over the ball's own travel, computed from the SAME opponent-position source the
//       pricer's corridor read already consumes. It is the corridor read MADE
//       TIME-AWARE: `laneOpenness`'s own geometry with the opponent's own closing
//       capability over the flight subtracted from the distance he still lacks.
//   (2) THE LOSS-COST BELIEF (M-DV.2 as amended by #247) — "what would losing it THERE
//       cost me", read as THREE evolvable per-zone weights applied to the candidate's
//       RECEPTION zone.
//
// ⭐⭐ THE #247 TRUTH/BELIEF SPLIT IS THE LAW OF THIS FILE, and it is structural, not a
// promise. THE TRUE TABLE — DV-C0's census-measured turnover→goal-against hazard, which
// lives in that stage's committed artifact — is INSTRUMENT-SIDE. It is not imported
// here, not typed here, and neither its file name nor any of its values appears anywhere
// in `src/**` (G-NOTABLE greps the whole tree for exactly that, on the artifact's own
// numbers rather than on a copy). What this file owns is the player's BELIEF: three
// weights BORN ABSENT, which a team can only ever acquire by evolving them. A wrong
// belief is legal and is STYLE. The census's ZONING is imported (the boundary is
// `HALF_L / 3`, re-derived from the pitch's own constant below) — the zoning is the
// STRUCTURE of the question, and per #248.1 structural dimensions may be hand-built; the
// ANSWERS (the hazards) are what must be earned.
//
// ⭐ NO NEW CHANNEL (M-DV §6 感知诚实). This module takes `opponents` — the very array
// `laneOpenness(p.pos, aim, opp.players)` is already called with one statement earlier —
// and `Player.topSpeed`, a body's knowledge of its own physics (#248.1: legitimately
// innate). It does not take `Match` at all, so it CANNOT read a percept snapshot, a
// truth channel or anything else: the epistemic pin is that the module's import list and
// its signature make the wider world unreachable. The DV term is therefore exactly as
// honest — no more, no less — as the corridor read it extends.
//
// ⭐ NO PREDICATES (#200). Both limbs are continuous and unconditional. The complete
// conditional set of this file is GATE (the arming rule), GUARD (`sentOff` and the
// clear-the-kicker radius, both inherited VERBATIM from `laneOpenness`), ZONE (the
// census's frozen three-way classifier — a SELECTOR that decides which evolvable weight
// is read, never whether an action happens) and the running max's comparison, which is
// `laneOpenness`'s own aggregation written as a max instead of a min.
//
// Dormant: `dvDeliveryValue` is a hard `false` in every production path, so nothing in
// this file is reached in the shipped game.
import { clamp01 } from '../utils/math';
import { closestPointOnSegment, dist } from '../utils/vec';
import type { V2 } from '../utils/vec';
import { HALF_L } from '../sim/constants';
import type { Player } from '../sim/Player';
import {
  DV_BELIEF_SLOTS, dvExposureWeightOf, dvLossBeliefVector, type TacticalGenome,
} from '../evolution/genome';
import { PTP_FLIGHT_SPEED } from './passLeadSeat';

/**
 * ⭐ THE FROZEN FLIGHT SPEED — TRACED, NOT INVENTED, and not even re-typed: it IS the
 * banked PTP-T0 seat's exported constant, imported.
 *
 * `PTP_FLIGHT_SPEED = 18` is the through-ball loop's own flight-time divisor
 * (`src/ai/PlayerBrain.ts`: `const flight = dist(p.pos, mate.pos) / 18;`), chosen there
 * by QUESTION IDENTITY — *"how long is the ball travelling on the way to him"* — which
 * is the exact question this limb's hazard is integrated over. Reusing the SAME symbol
 * (rather than a second literal) means the pass-lead family and the exposure family can
 * never drift apart.
 */
export const DV_FLIGHT_SPEED = PTP_FLIGHT_SPEED;

/**
 * ⭐ THE FROZEN CORRIDOR SCALE — TRACED, NOT INVENTED.
 *
 * `4` is `laneOpenness`'s OWN metre normalizer, `src/ai/perception.ts`:
 * `worst = Math.min(worst, clamp01(d / 4));`
 * i.e. the engine's standing answer to *"how many metres off a passing lane does a
 * defender have to be before he is irrelevant to it"*. The exposure limb asks that
 * question with the flight TIME added, so it takes the corridor family's own scale
 * whole. G-TRACE asserts the source line VERBATIM, so the family cannot drift.
 */
export const DV_CORRIDOR_SCALE = 4;

/**
 * ⭐ THE FROZEN CLEAR-THE-KICKER RADIUS — TRACED, NOT INVENTED.
 *
 * `1.5` is `laneOpenness`'s OWN guard, `src/ai/perception.ts`:
 * `if (dist(cp, from) < 1.5) continue; // Ignore defenders standing right on top of the passer`
 * — the kick clears a body at the passer's feet. The exposure limb inherits it verbatim
 * rather than inventing its own near-field rule. G-TRACE asserts the source line.
 */
export const DV_CLEAR_RADIUS = 1.5;

/**
 * ⭐⭐ THE ZONING — the census's own, RE-DERIVED from the pitch, never typed.
 *
 * DV-C0 §FORM froze the primary table's boundary as `HALF_L / 3` (itself the #188 /
 * PM-T1 `OWN_THIRD_LOCAL_X`, inherited through the #214 goal-genealogy census), in the
 * LOSING team's own frame: `localX < −HALF_L/3` = own third · `> +HALF_L/3` = final
 * third · else middle. This is the ONLY thing this file takes from the census — the
 * SHAPE OF THE QUESTION. Per #247 the ANSWERS (the hazard values) stay instrument-side
 * and are never wired into a player.
 */
export const DV_THIRD_BOUNDARY_LOCAL_X = HALF_L / 3;

/** The FROZEN zone order of the belief vector — the census's own `ordering` axis. */
export const DV_ZONES = ['own', 'middle', 'final'] as const;
export type DvZone = (typeof DV_ZONES)[number];

/**
 * The seat as the brain holds it for ONE on-ball decision: the two evolvable taste
 * weights, and nothing else. There is no world state in here at all — see the
 * no-new-channel note at the head of this file.
 */
export interface DeliveryValueSeat {
  /** `dvExposureWeightOf(g)` ∈ [0,1]. 0 ⇒ the exposure term is exactly `+0`. */
  readonly exposureWeight: number;
  /** The three per-zone loss-cost beliefs ∈ [0,1], in `DV_ZONES` order. */
  readonly belief: readonly number[];
}

/**
 * ⭐ THE ARMING RULE (M-DV.3's form for this stage), in ONE place: the risk price is
 * formed only when the flag's door is open (the caller's single fork) AND at least one
 * of the four DV genes is NON-ABSENT.
 *
 * Returning `null` for a fully absent set is the BORN-ABSENT IDENTITY made STRUCTURAL
 * rather than merely arithmetic: with no seat the pricer never computes an exposure,
 * never reads a belief and never performs the subtraction — it runs the shipped
 * statements alone. (With ANY of the four present the seat forms and the subtraction
 * happens at whatever the weights are; at all-zero the subtraction is exactly `−(+0)`,
 * which is an IEEE-754 identity. That identity is MEASURED as G-ZERO, not assumed.)
 *
 * PURE: no rng, no writes, no reads of anything but the genome.
 */
export function deliveryValueSeatOf(g: TacticalGenome): DeliveryValueSeat | null {
  if (g.dvExposureWeight === undefined && g.dvLossBelief === undefined) return null;
  return { exposureWeight: dvExposureWeightOf(g), belief: dvLossBeliefVector(g) };
}

/**
 * ⭐⭐ LIMB ONE — THE FLIGHT EXPOSURE (M-DV.1). THE EXACT FORM, and it is a MAX over the
 * opponents of a per-opponent hazard evaluated AT HIS OWN CLOSEST APPROACH to the flight:
 *
 * ```text
 * exposure(from, aim) = max over opponents o, o not sent off:
 *     cp    = closestPointOnSegment(from, aim, o.pos)      [laneOpenness's own geometry]
 *     SKIP    if dist(cp, from) < DV_CLEAR_RADIUS          [laneOpenness's own guard]
 *     t(o)  = dist(from, cp) / DV_FLIGHT_SPEED             [the ball's travel time to cp]
 *     lack  = dist(cp, o.pos) − o.topSpeed · t(o)          [the metres he STILL lacks
 *                                                           after closing for the whole
 *                                                           flight — his CAPABILITY]
 *     e(o)  = 1 − clamp01(lack / DV_CORRIDOR_SCALE)        [laneOpenness's own scale]
 *   with exposure = 0 when no opponent contributes.
 * ```
 *
 * ⭐ WHY THIS FORM AND NOT A SAMPLED INTEGRAL (declared sharpening — the contract says
 * "integrated over the ball's own travel" and is silent on the quadrature). A sampled
 * integral needs a SAMPLE COUNT, which would be an invented constant, and it needs a
 * per-sample kernel, which would be a second invented shape. The closest-approach point
 * is where the corridor family ALREADY evaluates a defender against a lane — it is the
 * point that maximises his chance over the whole segment for a straight-line closer — so
 * this form is the same integral's arg-max taken exactly, at zero new constants. The
 * aggregation over bodies is `laneOpenness`'s own (`worst = min`, here written as a
 * running max because exposure is openness's complement), so a lane's exposure is set by
 * its most dangerous body exactly as its openness is set by its nearest one.
 *
 * ⭐ IT DEGENERATES ONTO TODAY'S CORRIDOR READ, which is what makes it a SHARPENING and
 * not a new sense: at `topSpeed = 0` (or `t = 0`) the expression is
 * `1 − clamp01(d / 4)` — precisely `1 −` the term `laneOpenness` contributes for that
 * body. Everything the limb adds is the metres he can cover WHILE THE BALL FLIES.
 *
 * ⚠ HONEST LIMIT (stated, not hidden): the closing model is `topSpeed · t` — a body's own
 * top speed times the flight, with no acceleration, no reaction delay and no facing. It
 * is deliberately the CHEAPEST capability that is still time-aware; the engine's richer
 * `estimateReach` account belongs to the observer instruments (it needs a reach profile
 * and a percept snapshot), and importing it here would be a new channel. So this limb
 * OVERSTATES a stationary defender's closing and understates nothing.
 *
 * PURE: no rng, no writes, no allocation beyond `closestPointOnSegment`'s own.
 */
export function flightExposure(
  from: Readonly<V2>, aim: Readonly<V2>, opponents: readonly Player[],
): number {
  let worst = 0;
  for (const o of opponents) {
    if (o.sentOff) continue;
    const cp = closestPointOnSegment(from as V2, aim as V2, o.pos);
    // GUARD (laneOpenness's own, verbatim): the kick clears a body at the passer's feet.
    if (dist(cp, from as V2) < DV_CLEAR_RADIUS) continue;
    const t = dist(from as V2, cp) / DV_FLIGHT_SPEED;
    const lack = dist(cp, o.pos) - o.topSpeed * t;
    const e = 1 - clamp01(lack / DV_CORRIDOR_SCALE);
    if (e > worst) worst = e;
  }
  return worst;
}

/**
 * THE ZONE SELECTOR — the census's frozen three-way classification of a RECEPTION point,
 * given its `localX` in the PASSING team's own frame (which is the LOSER's frame: the
 * team that would pay for the turnover is the team playing the pass).
 *
 * ⚠ THIS IS A SELECTOR, NOT A PREDICATE (#200), and the distinction is exact: it decides
 * WHICH of three evolvable weights is read, never whether a candidate forms, competes or
 * wins. Every zone's weight is born absent and evolves independently; a team whose three
 * weights are equal is a team for which the zoning does not exist at all.
 */
export function receptionZoneIndex(localX: number): number {
  if (localX < -DV_THIRD_BOUNDARY_LOCAL_X) return 0; // own third
  if (localX > DV_THIRD_BOUNDARY_LOCAL_X) return 2; // final third
  return 1; // middle third
}

/**
 * ⭐⭐ THE COMPOSITION (M-DV.3), the WHOLE of it, in ONE owner:
 *
 * ```text
 * score′ = score − wExposure · exposure(from, aim) − belief[zone(aim)] · valueScale
 * ```
 *
 * returned here as the SUBTRACTION ITSELF, so the pricer's line reads `s − price(...)`.
 *
 * * `wExposure` and `belief[·]` are the born-absent genes. NO taste term beyond these
 *   two (the #236 no-taste lesson): no attribute, no mode multiplier, no gene of the
 *   incumbent chain, no threshold.
 * * `valueScale` is handed IN by the caller and is the pricer's OWN base value of a pass,
 *   `W.passBase` — the traced scale (declared: the alternative `W.passLaneW` was
 *   rejected because that is the weight on a CORRIDOR quantity, whereas a loss cost is a
 *   VALUE quantity, and `passBase` is the score's own statement of what a pass is worth
 *   before its qualities). It rides the per-player policy, so a wildcard carrying learned
 *   weights scales this term by his own.
 * * The exposure limb carries NO scale of its own — that is the commander's frozen form
 *   (`score − w·exposure`), kept literal rather than quietly normalised.
 *
 * ⭐ THE ZERO-POINT IS IEEE-EXACT, BY ARITHMETIC. With every weight 0 the return is
 * `0 · e + 0 · v`, i.e. exactly `+0` for any finite non-negative `e` and `v`, and
 * `s − (+0) === s` for every finite `s` (and for `−0`). So an armed world whose genes are
 * all zero prices byte-identically to the shipped one, with the code path LIVE. G-ZERO
 * measures that; it does not assume it.
 *
 * PURE: no rng, no writes.
 */
export function deliveryRiskPrice(
  seat: DeliveryValueSeat,
  from: Readonly<V2>,
  aim: Readonly<V2>,
  opponents: readonly Player[],
  aimLocalX: number,
  valueScale: number,
): number {
  const exposure = flightExposure(from, aim, opponents);
  const belief = seat.belief[receptionZoneIndex(aimLocalX)];
  return seat.exposureWeight * exposure + belief * valueScale;
}

/** The belief vector's frozen width, re-exported so consumers need one import. */
export const DV_ZONE_COUNT = DV_BELIEF_SLOTS;
