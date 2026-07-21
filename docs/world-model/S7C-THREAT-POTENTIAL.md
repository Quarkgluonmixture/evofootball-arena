# S7c — Two-Sided Pass Threat Potential

Status: **payoff gate failed; implementation fully reverted; no live consumer.**

Date: 2026-07-21

## 1. Why this hypothesis exists

S7a proved that the current pass target is sometimes dominated on the measured
arrival state. S7b then disproved the implied payoff: over 509 paired three-second
rollouts, the proposed dominator beat the chosen branch 34.4% while the chosen
branch beat it 35.6%. The arrival-only vector had omitted important next-state
causes.

S7c tests exactly two additional world-state facts:

1. **threat created after a clean reception** — shooting window, distance and
   opponent bodies occupying the route to goal;
2. **threat conceded if control flips at that point** — distance/central access to
   the receiver's own goal and teammate bodies covering that route.

These remain separate Pareto dimensions. There is no weighted score and no claim
that either dimension should always beat safety, progression or exit options.

## 2. Counterfactual contract

Holding the reception point and all attributes fixed:

- moving the point centrally must widen the shooting window and increase created
  threat;
- putting an opponent on the shot corridor must reduce created threat;
- putting a teammate goal-side on the turnover corridor must reduce conceded
  threat;
- observed bodies are projected to the same predicted arrival horizon and the
  evaluator must not mutate the observation.

The estimator is deliberately attribute-neutral and decision-neutral. It reads
only observed position, velocity, side, the predicted reception point/time and
pitch geometry.

## 3. Offline-only boundary

`evaluatePassThreat()` may feed `evaluatePassAffordance()` and the offline S7
Pareto/oracle probes. `Match`, `PlayerBrain`, `TeamBrain`, pass execution and the
renderers must not import or consume it. Therefore accepted live fingerprints must
remain exact.

This slice does **not** add xG weights, preferred tactical styles, a new gene,
rest-defence behaviours, run selection or a live pass filter.

## 4. Pre-registered payoff gate

Use the existing `pass-target-counterfactual` protocol: freeze the true
pre-decision state, force chosen and S7c-dominating target branches from identical
RNG, and roll both for 3.0 seconds.

At 120 matches S7c passes only if all are true:

- force failures are exactly zero;
- at least 100 paired rollouts remain (the result must not be made vacuous by
  adding dimensions);
- `alternativeDominates − chosenDominates` is at least **+5 percentage points**;
- alternative own-team possession at 3.0 seconds is not lower than chosen;
- mean alternative-minus-chosen progression is non-negative;
- mean alternative-minus-chosen xG is non-negative.

These thresholds were recorded before the first S7c counterfactual run. A failure
does not authorise coefficient/tolerance sweeps.

## 5. Result and verdict

The four static mechanism counterfactuals passed, including input purity. The
12-match pilot was already directionally poor, but the pre-registered protocol
required the full 120-match run and the estimator was not changed between runs.

At 120 matches:

- 334 live choices were classified as dominated;
- 363 paired rollouts completed with **zero** force failures;
- alternative dominated chosen: **34.4%**;
- chosen dominated alternative: **35.0%**;
- mean alternative-minus-chosen progression: **+0.443 m**;
- mean xG: **+0.001**;
- own-team possession at 3.0 seconds: **53.4% → 47.1%**.

The sample-size, force, progression and xG checks passed, but the two decisive
checks failed: there was no dominance edge (−0.6 percentage points rather than
at least +5), and possession degraded by 6.3 percentage points. Static shooting
geometry plus rest-defence corridor cover therefore does not predict the branch's
actual near-future value.

No tolerance, coefficient or formula sweep was attempted. `passThreat.ts`, its
tests and both added Pareto dimensions were removed. This document is the retained
negative result; accepted S7a/S7b code and all live behaviour remain unchanged.
