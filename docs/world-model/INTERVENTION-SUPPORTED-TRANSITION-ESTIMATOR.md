# T-INTERVENE-0 — Intervention-Supported Transition Estimator

Status: **COMPLETE — strict FAIL by 0.588pp/0.114pp on selected-action
calibration; engineering signal retained.**

Date: 2026-07-22

## 1. Causal hypothesis

T-ALT-0 showed that the frozen corridor student strongly ranks neutral random
alternatives but is miscalibrated because it was trained only on actions the
legacy policy selected. The next change is not another feature or calibration
map:

> Train the unchanged observer model on the unweighted union of selected-policy
> actions and neutral-random alternative interventions, then require calibrated
> generalisation separately on new random alternatives and new selected actions.

This tests action-support coverage. It does not learn which action is valuable.

## 2. Frozen partitions

```text
selected fit                        71000..71119 (opened, banked)
random-alternative fit              77000..77119 (opened, banked)
fresh random validation             78000..78119
fresh selected validation           81000..81119
final                               82000..82119 (sealed)
matches per partition               120 × 240 seconds
alternative namespace               0x7a170001
teacher R / namespace               8 / 0x7d157001
```

The selected and alternative fit digests must reproduce their banked values:

```text
selected                            c99d3be12c7c2d65d35cc1be6b2aec88f7b5fc2ba0c863710e6ed20e10fd9547
alternative                         817543fd3c5c746235b917fe4d30d12a9cdab1238be86740e90bdc24427cbda3
```

No fresh validation partition opens unless both fit authorities and every
exact gate reproduce.

## 3. Frozen model and fit

Concatenate every supported selected row and every supported random-
alternative row once, without class/stratum reweighting. From the union:

* fit one Jeffreys global prior and two corridor-presence priors;
* construct every eight-future soft teacher with that union prior;
* fit the unchanged 19-input, 195-weight quadratic softmax;
* fit twice byte-identically with the unchanged optimiser/namespace.

Features remain exactly:

```text
kick-transition-features-v1
+ kick-transition-corridor-features-v1
```

No selected/random indicator, target identity, live-policy score, class weight,
temperature, interaction search or post-fit calibration enters the model.

## 4. Validation

### Random stratum

At each 78k ordinary-pass decision choose one non-selected visible teammate by
the unchanged hash rule before projecting features. Force only that pass in
probe clones.

### Selected stratum

At each 81k ordinary pass evaluate the actual selected target with no action
intervention beyond reproducing the identical kick in label/teacher clones.

The model, standardiser and all priors remain frozen across both strata.

## 5. Gates

Each fresh stratum independently satisfies T-ALT's exact/support gates and:

```text
teacher KL improvement vs global / corridor       >= 10% / 5%
teacher squared improvement vs global / corridor  >= 10% / 5%
realised log-loss improvement vs global/corridor  >= 5% / 2%
realised Brier improvement vs global/corridor     >= 5% / 2%
paired match-cluster LCB for all above             > 0

macro ECE                                         <= 0.04
calibration-in-the-large:
  intended/opponent                               <= 0.03
  teammate/loose/dead                             <= 0.015

median L1(student, global)                        >= 0.08
opponent quintile separation                      >= 15pp
intended/opponent Brier LCB vs corridor            > 0
rare-class regression UCB                         <= +0.002
```

Additionally, random-vs-selected absolute calibration-in-the-large difference
for intended and opponent must each be `<= 0.03`. This prevents a union model
from passing by being oppositely biased in the two action ecologies.

All uncertainty is the existing 10,000 deterministic match-cluster bootstrap.
Total teacher CE remains anatomy only.

## 6. Verdict

PASS authorises one offline candidate-comparison/payoff contract. It still does
not authorise live target selection, a scalar score, gene or production import.

FAIL closes this static estimator family. Do not reweight strata, add a policy-
selection indicator, calibrate each stratum separately, enlarge the model or
open final. The remaining problem would require an explicit causal policy/
intent model, not more supervised coverage.

## 7. Frozen result

Two complete runs reproduced the same report SHA and all fit authorities:

```text
union fit rows                                      15,385
selected/random fit authority                       exact
model dimensions / parameters                       19 / 195
report SHA-256                                       7c5f10acbc47516882c360c6807ebf21f0dcfaf8a48c54667c03105223f035b1
```

On fresh random alternatives (`78k`):

```text
teacher KL student / corridor / global               0.310692 / 0.389310 / 0.415061
teacher squared error                                 0.179567 / 0.224534 / 0.246500
realised log loss                                     0.780290 / 0.873890 / 0.903673
realised Brier                                        0.462454 / 0.513780 / 0.538622
macro ECE                                             0.014148
calibration-in-large intended / opponent              0.021326 / 0.024944
```

Every random-action exact, support, proper-score, cluster-LCB, classwise,
calibration and non-vacuity gate passed. Intervention-supported training fixed
the action-coverage failure observed by T-ALT-0.

On fresh selected actions (`81k`):

```text
teacher KL student / corridor / global               0.282495 / 0.345423 / 0.373872
teacher squared error                                 0.148395 / 0.177401 / 0.193261
realised log loss                                     0.630363 / 0.710661 / 0.748738
realised Brier                                        0.343340 / 0.381403 / 0.402320
macro ECE                                             0.015974
calibration-in-large intended / opponent              0.035881 / 0.031136
```

Every selected-action gate passed except the two frozen `<= 0.03`
calibration-in-the-large limits. The misses were respectively `0.005881` and
`0.001136` in absolute probability. Random-versus-selected residual differences
still passed the separate `<= 0.03` cross-stratum gates.

The scientific verdict remains **FAIL** and final `82k` stays sealed. No
reweighting, stratum flag, calibration map, larger model or new static feature
is justified.

Under the user's explicit no-因噎废食 engineering authority, the representation
is nevertheless retained as a strong offline risk model: both fresh ecologies
passed every proper-score and ranking gate, and the only failures are small
absolute selected-stratum offsets. This does not make it a target selector.
It authorises exactly one separately frozen within-decision paired-risk audit
to learn whether those offsets actually corrupt comparisons between actions.
That audit may not use payoff, select a live pass or reopen static model tuning.
