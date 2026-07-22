# T-PAIR-0 — Within-Decision Transition-Risk Audit

Status: **COMPLETE — strict FAIL; strong ordinal paired-risk signal retained,
calibrated counterfactual probability closed.**

Date: 2026-07-22

## 1. Question

T-INTERVENE-0 learned a strong transition distribution in both selected and
random-action ecologies, but selected-action intended/opponent calibration
missed the frozen absolute limits by `0.588pp/0.114pp`. Before discarding the
representation or using it to compare targets, ask the decision-relevant
question directly:

> Within the same frozen pass decision, does the unchanged model correctly
> estimate how transition risk changes when the selected target is replaced by
> one neutral random visible alternative?

This is a paired transition audit. It does not decide which football outcome is
valuable and does not select an action.

## 2. Frozen authority

```text
selected fit                         71000..71119 (banked)
random-alternative fit               77000..77119 (banked)
fresh paired audit                   83000..83119
matches                              120 × 240 seconds
teacher futures                      R = 8
alternative namespace               0x7a170001
features                             unchanged 19 observer features
model                                unchanged 195-weight quadratic softmax
final 82000..82119                   remains sealed
```

Refit the exact unweighted T-INTERVENE union and require both banked fit
digests. No paired row may alter priors, standardisation, weights or chooser.

For every supported ordinary pass in 83k, collect two probe branches from the
same pre-decision state:

* the actual selected target;
* the unchanged hash-selected visible non-selected teammate.

Join only exact `(matchSeed, kickTick, passerGid, selectedTargetGid)` identities.
Neither future result nor model prediction may affect the alternative.

## 3. Paired estimand

For source `s ∈ {student, corridor, global}`, action `a` and class `k`, let
`p[s,a,k]` be its five-class probability. For each pair:

```text
predicted delta[s,k] = p[s,alternative,k] - p[s,selected,k]
teacher delta[k]     = teacher[alternative,k] - teacher[selected,k]
actual delta[k]      = 1(alternative outcome=k) - 1(selected outcome=k)
```

The global-prior delta is exactly zero. The corridor-prior delta can change only
when corridor-presence differs between actions.

Primary losses preserve the complete five-class vector:

```text
teacher delta squared error = sum_k (predicted delta[k] - teacher delta[k])²
actual delta squared error  = sum_k (predicted delta[k] - actual delta[k])²
```

Every pair and every class shares one denominator. No outcome is ordered or
collapsed into a utility.

## 4. Gates

### Exact/support

```text
represented matches                              = 120 / 120
one-to-one supported pairs                        >= 7,000
paired support / smaller arm                      >= 98%
duplicate paired identities                       = 0
selected/random dataset exact gates               all true
banked fit authorities/model dimensions           exact
finite probability/delta vectors                  100%
all five actual/teacher outcomes per arm           present
Match/RNG/frozen-state/chooser mutations           = 0
```

### Complete-vector comparison

Use equal-weight match-cluster means and 10,000 deterministic cluster
bootstraps:

```text
teacher-delta squared-error improvement:
  vs global zero delta                            >= 10%
  vs corridor delta                               >= 5%
  paired cluster LCB on both                      > 0

actual-delta squared-error improvement:
  vs global zero delta                            >= 5%
  vs corridor delta                               >= 2%
  paired cluster LCB on both                      > 0
```

### Intended/opponent directional anatomy

For intended and opponent classes separately:

```text
sign concordance on non-zero teacher deltas        >= 60%
concordance edge over corridor                     >= 5pp

student-delta top-vs-bottom quintile separation:
  teacher delta                                    >= 10pp
  actual delta                                     >= 8pp

absolute mean(predicted delta - actual delta)      <= 3pp
10-bin absolute delta calibration error             <= 5pp
```

Anti-vacuity additionally requires median absolute predicted opponent delta at
least `0.03`, and at least 20% of pairs on each side of zero. Exact zero deltas
are not assigned a favourable sign.

## 5. Verdict

Strict PASS requires every gate. PASS banks an observer-grounded paired
transition-risk representation and permits a separate transition-tree
composition design. It still does not authorise payoff ordering, target
selection, live AI, a scalar utility or a gene.

FAIL closes this estimator family. Do not add features, adjust calibration,
choose easier alternatives, change thresholds or open final. The remaining
missing state would be explicit temporal policy/intent or a different dynamic
decision representation—not another static kick vector.

## 6. Frozen result

The fresh 83k audit produced:

```text
supported pairs / matches                         6,635 / 120
paired support of smaller arm                     96.8896%
report SHA-256                                    3f3d326a324b20c031de2b4a3434e2dfbf6f925a295935e832950d6f36d74861

teacher-delta squared error:
  student / corridor / global                     0.296793 / 0.356649 / 0.415146
  improvement vs corridor / global                16.78% / 28.51%

actual-delta squared error:
  student / corridor / global                     0.660395 / 0.734062 / 0.802597
  improvement vs corridor / global                10.04% / 17.72%
```

All complete-vector mean and cluster-LCB gates passed. The within-decision
directional signal was large and non-vacuous:

```text
teacher sign concordance, intended:
  student / corridor                              75.18% / 34.70%
teacher sign concordance, opponent:
  student / corridor                              75.76% / 35.15%

student top-bottom quintile separation:
  intended teacher / realised delta               58.23pp / 64.96pp
  opponent teacher / realised delta               47.64pp / 53.28pp

median absolute predicted opponent delta          15.25pp
positive / negative opponent deltas               74.45% / 25.55%
```

The strict verdict is nevertheless **FAIL** for four frozen gates:

```text
pairs                                               6,635 < 7,000
paired support                                      96.89% < 98%
intended delta calibration-in-large                 4.740% > 3%
opponent delta calibration-in-large                 4.593% > 3%
```

Both 10-bin delta ECE gates passed just under 5%, so the failure is a coherent
aggregate offset rather than absent ranking. That distinction matters:

* the representation is banked as a strong **ordinal counterfactual risk
  signal**;
* it is not a calibrated transition-probability authority;
* it cannot be multiplied by conditional payoff or used to choose a live pass.

Per the frozen stop rule, the static kick-vector estimator programme is now
closed. Final `82k` remains sealed. No threshold relaxation, extra action
support, calibration map, feature, model or paired rerun follows.
