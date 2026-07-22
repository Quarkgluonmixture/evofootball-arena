# T-CORRIDOR-0 — Pathwise Corridor Observer State Audit

Status: **INTERNAL STRICT FAIL; engineering external robustness explicitly authorised.**

Date: 2026-07-22

## 1. Causal change

T-STUDENT-0 proved that the original 14 observer affordance facts contain a
portable realised-risk signal but do not compress enough of the repeated full-
policy teacher. Those facts mostly describe the receiver endpoint. C-OBS and
T-DIST independently showed that interception risk is pathwise.

T-CORRIDOR-0 changes exactly one thing:

> Add the continuous observer-grounded pass-corridor field already computed by
> `evaluatePassCorridorInterception()`; keep the student, teacher, data,
> optimiser, baselines, uncertainty and gates unchanged.

This is allowed by T-STUDENT's stop rule as new observer state. It is not a
larger model search, threshold change or post-hoc calibrator.

## 2. Added fact family

For every observed active non-GK opponent, compute the existing corridor facts.
Choose the opponent with largest `strongestMargin`, tie-breaking by gid. Append:

```text
corridorStrongestMargin
corridorStrongestBallTime
corridorStrongestDefenderEta
corridorStrongestPathFraction
corridorFeasibleDefenderCount
```

All five are continuous/count facts available at kick time. At least one
supported opponent is required; otherwise the row is unsupported. No zero,
sentinel, Match-position fallback, future controller or child result is used.
The final input therefore has 19 dimensions and the unchanged quadratic basis
has 39 terms / 195 weights.

The corridor binary presence baseline remains unchanged and receives no access
to the continuous fields.

## 3. Frozen experiment

Reuse T-STUDENT exactly:

```text
fit                                71000..71119
internal                           72000..72119
fresh external                     74000..74119 (opens only after internal PASS)
final                              75000..75119 (always sealed)
teacher                            eight unchanged-policy child futures
student                            30-epoch quadratic softmax, soft CE objective
awareness                          0.8 warmed passer memory
```

The command authority is:

```text
npx tsx scripts/probes/process-distilled-observer-estimator.ts --corridor --json
```

## 4. Gates

Every exact/support, teacher-imitation, realised-label, calibration,
non-vacuity, classwise and bootstrap gate in
[`PROCESS-DISTILLED-OBSERVER-ESTIMATOR.md`](PROCESS-DISTILLED-OBSERVER-ESTIMATOR.md)
§8–§10 remains numerically identical. In addition:

```text
corridor feature version                         exact
supported corridor fact sets                     100% of included rows
non-finite added fields                           0
strongest-defender tie/order differences          0
base 14 features changed                          0
model input dimensions                            19
model parameters                                  195
```

Two complete fit/model runs must be byte-identical. No result may change the
feature family or add interactions beyond the frozen marginal quadratic basis.

## 5. Verdict

PASS requires internal and fresh external PASS. It authorises only the same
next step T-STUDENT would have authorised: an offline alternative-action
coverage and invariance audit. It does not authorise live selection.

FAIL closes static kick-feature distillation. Do not add more corridor
summaries, layers, timing features, class weights or calibration. The remaining
teacher variance would require explicit observed policy/intent state or a
different temporal model, not another static feature list.

## 6. Frozen internal result and engineering continuation

The 19-input / 195-weight model and both 71k collections were byte-identical:

```text
fit rows / internal rows                       7,142 / 7,069
model SHA-256                                  fb613c7f3af4c26934c9a55aed1cdaf589e1ae3de0f1f290c7842fee5d09302e
internal report SHA-256                        5100bc75cb606b87099400b58e17ade753700341f990530d60db9662a036a1c2

teacher CE student / corridor / global         0.651137 / 0.689084 / 0.710069
teacher squared error                          0.144768 / 0.164551 / 0.175287
teacher KL after subtracting entropy            0.290526 / 0.328473 / 0.349458

realised log loss                              0.637174 / 0.687984 / 0.714489
realised Brier                                 0.341853 / 0.367314 / 0.381052
absolute macro ECE                             0.009397
opponent quintile separation                   35.17 percentage points
```

Every validity, support, determinism, calibration, non-vacuity, realised-label,
corridor-relative teacher and teacher-squared-error gate passed. The sole
failed gate was teacher CE relative improvement versus global:

```text
observed                                        8.30%
frozen threshold                               15.00%
```

The strict internal verdict therefore remains **FAIL**. This is not rewritten
as PASS. However, the denominator includes the teacher's irreducible entropy
(`0.360611`). On the actually reducible KL divergence, the same frozen student
improved 16.86% versus global and 11.55% versus corridor. Teacher squared error
improved 17.41% / 12.02%, and all realised-label proper-score improvements were
large with positive cluster bounds.

Consistent with the user's explicit instruction not to discard an otherwise
strong, well-calibrated mechanism because of one conservative secondary gate,
one unchanged-model **engineering external robustness** read of 74k is
authorised. It uses:

```text
npx tsx scripts/probes/process-distilled-observer-estimator.ts \
  --corridor --engineering-external --json
```

No threshold, model, feature, fit row or baseline changes. The output must
report both `strictPass=false` and the external gates. Engineering robustness
is defined before interpretation as all gates except the already identified
`teacherGlobalCeMean`; that gate remains visible and false. This exception does not
open final 75k and cannot create a scientific PASS. If 74k fails any external
proper-score, absolute-calibration, classwise or exact gate, the representation
parks. If it holds, it may support only the already bounded offline
alternative-action coverage audit; live use remains closed.

## 7. Frozen external robustness result

The untouched model processed 7,035 feature-supported actions from all 120
fresh 74k matches with zero validity failures:

```text
raw external report SHA before flag fix      0de7cb7d2429195ec0688f115ba8838ef9757d27a35b0d481f32aacc77e8e3d1

teacher CE student / corridor / global       0.644316 / 0.687522 / 0.710261
  relative improvement                       6.28% / 9.28%
teacher squared error                        0.142640 / 0.164334 / 0.175925
  relative improvement                       13.20% / 18.92%
teacher KL                                   0.289309 / 0.332515 / 0.355254
  relative improvement                       12.99% / 18.56%

realised log loss                            0.621624 / 0.681663 / 0.709452
  relative improvement                       8.81% / 12.38%
realised Brier                               0.332283 / 0.358724 / 0.372955
  relative improvement                       7.37% / 10.91%

absolute macro ECE                           0.011426
opponent quintile separation                 35.11 percentage points
```

Every external exact, support, classwise, calibration, non-vacuity,
realised-label and teacher-squared-error gate passed. As internally, the only
false gate was total teacher CE improvement versus global (`9.28% < 15%`),
while its cluster lower bound was positive. Strict contract verdict remains
**FAIL**. Engineering external robustness, explicitly excluding only that
already identified entropy-denominated effect-size gate, is **PASS**.

This banks `kick-transition-corridor-features-v1` plus the frozen soft student
as a credible offline selected-action estimator. It authorises the bounded
alternative-action coverage/invariance audit promised above. It still does not
authorise final 75k reads or any live decision consumer.
