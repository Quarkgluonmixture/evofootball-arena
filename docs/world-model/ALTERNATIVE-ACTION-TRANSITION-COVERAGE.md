# T-ALT-0 — Alternative-Action Transition Coverage Audit

Status: **COMPLETE — FAIL on alternative-action calibration-in-the-large.**

Date: 2026-07-22

## 1. Question

T-CORRIDOR-0 established engineering robustness only on actions selected by the
current live policy. A model that merely explains that policy's familiar action
distribution cannot compare targets. T-ALT-0 asks:

> Without refitting, does the frozen observer-corridor student retain support,
> calibration and transition signal when the pass target is a deterministic
> random visible teammate that the live policy did not choose?

This is an offline counterfactual coverage test, not a selector or payoff test.

## 2. Frozen population

```text
model fit                          selected actions, seeds 71000..71119
fresh alternative audit           seeds 77000..77119
matches                            120 × 240 seconds
awareness                          0.8 warmed passer memory
teacher futures                    R = 8, namespace 0x7d157001
alternative chooser namespace      0x7a170001
final 75000..75119                 remains sealed
```

At every actual ordinary-pass decision, form the passer-observed teammate set:

* active same-side non-GK;
* not the passer;
* not the actually selected target;
* identity supported by the launch snapshot.

Sort by gid, then choose exactly one index with
`hashSeed(namespace, seed, kickTick, passerGid) mod candidateCount`. Selection
must occur before feature projection and may not read scores, positions,
teacher results or future transitions.

Force only that alternative ordinary pass in probe clones. One untouched-RNG
branch supplies the realised transition and eight child streams supply the
teacher. Post-kick brains and actions remain unchanged.

## 3. Frozen estimator

Refit exactly the banked T-CORRIDOR student on selected 71k rows:

```text
14 kick-transition-features-v1
+ 5 kick-transition-corridor-features-v1
quadratic softmax · 195 weights
soft teacher CE · unchanged optimiser
```

The fit dataset/model digests must match T-CORRIDOR exactly:

```text
fit digest                         c99d3be12c7c2d65d35cc1be6b2aec88f7b5fc2ba0c863710e6ed20e10fd9547
model digest                       fb613c7f3af4c26934c9a55aed1cdaf589e1ae3de0f1f290c7842fee5d09302e
```

No alternative row may refit the prior, standardiser, weights or corridor
baseline.

## 4. Gates

### Exact/support

```text
represented matches                              = 120 / 120
decisions with at least one observed alternative >= 7,000
feature-supported alternative rows               >= 5,000
feature support among chosen alternatives         >= 70%
all five realised/child classes                   present
force/censor/conservation/kick failures            = 0
RNG/perception/frozen-Match mutations              = 0
alternative-choice order differences               = 0
chosen target accidentally reused                  = 0
future/feature-dependent chooser reads              = 0
non-finite vectors/features                         = 0
```

### Predictive

Use match-cluster means and 10,000 deterministic cluster bootstraps:

```text
teacher reducible KL improvement:
  vs global                                      >= 10%
  vs corridor                                    >= 5%
  paired LCB on both                              > 0

teacher squared-error improvement:
  vs global                                      >= 10%
  vs corridor                                    >= 5%
  paired LCB on both                              > 0

realised log-loss/Brier improvement:
  vs global                                      >= 5%
  vs corridor                                    >= 2%
  paired LCB on all four                          > 0

absolute macro ECE                               <= 0.04
calibration-in-the-large:
  intended/opponent                              <= 0.03
  teammate/loose/dead                            <= 0.015

median L1(student, global)                       >= 0.08
opponent top-bottom quintile separation          >= 15pp
intended/opponent Brier improvement LCB          > 0
rare-class Brier regression UCB                  <= +0.002
```

Total teacher CE is reported but not gated; T-CORRIDOR showed why irreducible
teacher entropy makes its relative percentage a misleading compression scale.
KL and squared distance are fixed before these new seeds open.

## 5. Authority

PASS proves only that the observer estimator transports from selected to a
neutral sample of non-selected targets. It authorises a separate offline
candidate-comparison/payoff contract. It does not authorise live target choice.

FAIL means selected-action robustness was policy-distribution specific. Park
the estimator. Do not choose easier alternatives, filter by its predictions,
refit on alternatives, add features or open final seeds.

## 6. Frozen result

```text
fresh alternative rows / matches               8,243 / 120
alternative opportunities                       8,284
feature unsupported                              41
force / censor / conservation failures           0
report SHA-256                                   03b831bbc7b430d568913243badef45017669aa12a52c8b5f33bc6b6595b5afc

teacher KL student / corridor / global           0.358188 / 0.413916 / 0.463135
teacher squared error                            0.189466 / 0.241899 / 0.275613
realised log loss                                0.822130 / 0.884987 / 0.941665
realised Brier                                   0.466301 / 0.528950 / 0.566819
macro ECE                                        0.029016
opponent quintile separation                     46.97 percentage points
```

Every support, exact, teacher-KL, teacher-squared-error, realised proper-score,
classwise, macro-ECE and non-vacuity gate passed. The selected-action student
transported substantial ordinal risk signal to random alternatives.

The strict verdict is nevertheless **FAIL** because calibration-in-the-large
did not transport:

```text
intended residual                                0.057541 > 0.03
opponent residual                                0.066968 > 0.03
```

Random alternatives were a different action ecology: realised intended control
fell to 60.3% and opponent control rose to 34.2%, versus roughly 76%/18% in the
selected-action fit population. A selected-policy training distribution can
rank much of this risk but cannot supply calibrated probability mass for it.

The estimator therefore remains closed to target selection. The result does,
however, identify a concrete causal remedy rather than a new feature: training
support must include neutral alternative-action interventions. Any revisit
requires a separately frozen selected+randomised training contract and two
fresh validation strata. It may not post-hoc calibrate this model or train and
score on the same 77k alternatives.
