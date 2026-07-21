# S7d — Pass-Flight Interception Margin

Status: **calibration passed, counterfactual payoff failed; implementation fully
reverted; no live consumer.**

Date: 2026-07-21

## 1. Evidence before the hypothesis

The accepted S7b oracle was extended with observational anatomy only; its target
selection and rollout comparison were unchanged. Across the same 120 matches / 509
paired branches:

| First pass outcome | chosen target | S7b endpoint dominator |
|---|---:|---:|
| intended target resolved the pass | 68.0% | 52.5% |
| opponent resolved the pass | 24.8% | 38.3% |
| intended target was first physical controller | 68.0% | 52.5% |
| opponent was first physical controller | 26.3% | 39.1% |

Mean first-control time was 0.721s versus 0.786s. The failure therefore begins
before post-reception option quality: S7b compares arrival at the endpoint but does
not ask whether an opponent can meet the ball anywhere along its flight.

## 2. New causal fact

For every fixed-timestep point on the intended ordinary ground-pass trajectory:

```text
flight interception margin = opponent ETA to point − ball ETA to point
```

The minimum across opponents and intermediate points is the pass's flight safety.
Larger is safer. The existing receiver-versus-opponent arrival margin at the target
remains a separate dimension.

This is temporal reachability, not the live AI's static `laneOpenness` score. It
reads the S1 kinematic reach model, opponent position/velocity/body direction, the
engine's fixed-step ball decay and the intended pass trajectory. It adds no success
roll, tactical preference, attribute bonus or outcome label.

## 3. Counterfactual contract

Holding the pass and endpoint fixed:

- putting a defender on an intermediate flight point must reduce safety;
- moving the same defender away from the corridor must increase safety;
- a defender moving toward the future corridor must be more dangerous than one
  moving away;
- bodies only at the passer's immediate kick-clearance zone or beyond the target
  must not create a false intermediate interception;
- inputs must not be mutated.

## 4. Offline-only boundary

The new fact may feed `evaluatePassAffordance()`, S7 Pareto comparison and offline
probes only. `Match`, `PlayerBrain`, `TeamBrain`, mechanics and renderers must not
read it. Live fingerprints must remain exact.

## 5. Pre-registered gates

Before any 120-match S7d payoff result is observed:

1. the static/moving-body counterfactual tests above pass;
2. `pass-affordance-calibration` reports at least 100 samples in both its risky
   (`margin < 0s`) and safe (`margin >= 0.35s`) exact-truth buckets, with safe
   passes receiving at least 10 percentage points more often and being intercepted
   at least 10 points less often;
3. the unchanged three-second oracle has zero force failures and at least 100
   paired rollouts;
4. `alternativeDominates − chosenDominates` is at least **+5 percentage points**;
5. alternative own-team possession at 3.0 seconds is not lower;
6. mean alternative-minus-chosen progression and xG are both non-negative;
7. the alternative's intended-target first-control rate is not lower and its
   opponent-first-control rate is not higher.

Failure does not authorise tolerance, sample-count or coefficient sweeps. S7d is
either retained as one causal dimension or fully reverted and recorded.

## 6. Results

The pure mechanism passed all four counterfactual/purity tests. Its independent
calibration signal was strong even in the 12-match pilot (934 ordinary passes):

| exact-truth flight margin | n | target received | intercepted |
|---|---:|---:|---:|
| risky `< 0s` | 448 | 64.7% | 28.6% |
| middle `0..0.35s` | 344 | 83.7% | 11.3% |
| safe `>= 0.35s` | 142 | 88.7% | 3.5% |

That proves the temporal route query measured real interception exposure. It did
**not** prove that adding this fact to Pareto dominance selected a better complete
next state.

At the pre-registered 120-match payoff gate:

- 206 live choices were classified as dominated;
- 219 paired rollouts completed with zero force failures;
- alternative dominated chosen: **36.5%**;
- chosen dominated alternative: **35.6%**;
- mean progression: **+0.956m**;
- mean xG: **−0.007**;
- own-team possession at 3.0 seconds: **51.1% → 47.0%**;
- intended target first-controlled: **63.9% → 63.0%**;
- opponent first-controlled: **30.1% → 32.0%**.

Sample size, force failures and progression passed. Dominance edge (+0.9pp rather
than +5pp), possession, xG and both first-controller directionality checks failed.
No coefficient, margin or tolerance sweep followed.

## 7. Verdict

Per the pre-registered stop rule, `passFlightRisk.ts`, its unit tests, calibration
field and S7 Pareto dimension were removed. The accepted S7b estimator and live
simulation are restored exactly.

The negative result is still informative: endpoint-only S7b omitted a large real
flight-path cause, but correcting that cause merely removed many false dominators;
it did not make the remaining Pareto relation a useful total action-value oracle.

### Post-revert conditional anatomy

The accepted S7b 509-pair run was then stratified by the first physical controller,
without changing candidates or rollouts. In the **212 pairs where both branches
reached their intended target**, the S7b alternative did have a real edge:

- alternative/chosen dominance: **38.2% / 28.8%**;
- own possession: **65.6% → 67.5%**;
- mean progression: **+1.181m**;
- mean xG: **+0.006**.

The asymmetric reception strata explain the aggregate failure. When only the
alternative reached its target, it dominated 62.2/11.1%; when only the chosen
branch reached its target, that inverted to 17.9/53.8%.

This revises the next question. The conditional post-reception vector is not simply
dead; it has payoff when its assumed transition actually occurs. What is missing is
a principled composition of mutually exclusive transition states—intended reception,
teammate recovery, opponent interception, dead ball and unresolved/loose—with the
conditional value after each. Another independent Pareto dimension cannot perform
that composition. S7e must research a distributional/contingent next-state model
without collapsing football into one hand-written universal utility score.
