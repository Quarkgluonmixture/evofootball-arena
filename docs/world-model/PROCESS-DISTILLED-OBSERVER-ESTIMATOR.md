# T-STUDENT-0 — Process-Distilled Observer Transition Estimator

Status: **PRE-REGISTERED — model/thresholds frozen; fresh external seeds unopened.**

Date: 2026-07-22

## 1. Question

T-DIST-0 established a strong but computationally non-portable teacher:

```text
actual selected ordinary pass
+ unchanged post-kick policy
+ eight independent futures
→ five-class transition distribution
```

It cut unseen log loss and Brier by roughly half, but requires Match clones and
future simulation. T-STUDENT-0 asks the next causally different question:

> Can a small deterministic model, reading only the passer's kick-time observed
> pass-affordance facts, predict that process distribution on unseen matches and
> retain useful calibration against one independently realised transition?

This is not a retry of T0b/T0b-R. Those models learned one-hot outcomes from
oracle-perception forced alternatives. This model learns the soft distribution
of repeated **unchanged-policy actual actions** from observer-specific facts.
It does not compare or select alternative targets.

## 2. Frozen partitions

```text
fit teacher/model                    seeds 71000..71119 (already opened by T-DIST)
internal validation                 seeds 72000..72119 (already opened by T-DIST)
fresh external validation           seeds 74000..74119 (sealed until internal PASS)
final test                          seeds 75000..75119 (sealed regardless)
matches per partition               120 × 240 seconds
awareness                           0.8, warmed passer memory
teacher futures                     R = 8
teacher child namespace             0x7d157001
transition cap                      4.0 seconds
```

The 71k/72k aggregate T-DIST scores are already known, but no kick-feature to
teacher association has been fitted or inspected. They may be replayed only
under this frozen model. No architecture, feature, threshold or partition may
change after internal validation. External 74k opens only after internal exact,
support and learning gates pass. Final 75k remains sealed whatever happens.

## 3. Observer input authority

For the actually selected target, compute the existing observer-only S4/S5
affordance from the passer's warmed `PerceptionSnapshot`, stable roster reach
profiles and no Match-position fallback. Project exactly
`kick-transition-features-v1` in its frozen order:

```text
flightDistance
launchSpeed
ballArrival
receiverArrival
opponentArrival
arrivalMargin
receivePressure
bodyReadiness
progressionMetres
lineBreakCount
offsideMargin
exitOptionCount
targetObservationAgeTicks
observedOpponentCount
```

No future state, actual transition, child count, child RNG, Match truth position,
macro possession or candidate identity may be an input. An unsupported or
non-finite feature row is excluded honestly; no sentinel or imputation is
allowed.

## 4. Teacher and actual label

For every supported action, reproduce the T-DIST process exactly:

* one untouched-RNG branch supplies the realised five-class label;
* eight private child streams supply raw outcome counts;
* the fit partition's realised labels define the frozen global prior
  `g[k] = (count[k] + 0.5) / (N + 2.5)`;
* every teacher vector is `q[k] = (childCount[k] + g[k]) / 9`.

All five classes remain separate. The teacher is a finite empirical authority,
not a claim that eight samples identify the true per-state distribution.

## 5. Frozen student

Fit one probe-only five-class quadratic softmax:

```text
input standardisation              fit partition only
basis                              [1, z_1..z_14, z_1²..z_14²]
parameters                         5 × 29
objective                          mean soft-label cross entropy to q
epochs                             30
batch size                         1024
Adam learning rate                 0.01
L2                                1e-4 (intercepts excluded)
shuffle namespace                  0x7d157501
```

There are no class weights, temperature, isotonic/Dirichlet calibration,
feature selection, interaction search, early stopping or hyperparameter sweep.
Training labels do not enter the gradient; only the soft teacher vectors do.

## 6. Frozen baselines

Fit from the 71k realised labels only:

* global five-class prior;
* observer corridor-presence two-bucket prior, using T-DIST's unchanged
  zero-margin corridor broadphase and one effective global-prior observation.

The corridor is a coarse baseline, not a calibration ceiling. T-DIST showed
that a nearly constant predictor can have marginally lower ECE while losing
about half the proper-score information. Therefore T-STUDENT uses absolute
calibration gates and proper scores; it does **not** require lower ECE than the
corridor.

## 7. Scores

### Teacher imitation

Against soft teacher `q`, compute multiclass cross entropy and squared
five-vector error for student/global/corridor. Report KL by subtracting the
teacher entropy. Pair uncertainty by match-cluster bootstrap.

### Realised transition

Against the untouched-RNG one-hot label, compute natural-log loss, multiclass
Brier, five one-vs-rest Brier scores, fixed-width ten-bin classwise ECE and
calibration-in-the-large residuals.

All averages and 10,000 deterministic bootstrap samples use match seed as the
cluster. Whole five-vectors remain together. Top-class accuracy is diagnostic
only.

## 8. Fit/internal preflight

Both 71k and 72k must satisfy:

```text
represented matches                              = 120 / 120
feature-supported complete rows                   >= 5,000
feature support among T-DIST complete rows        >= 70%
label and all child transitions resolved          >= 95%
all five actual and aggregate child classes       present
force / identity / conservation failures         = 0
kick mismatches / child collisions                = 0
perception or frozen-Match mutations              = 0
truth fallbacks / non-finite features              = 0
probability/model non-finite values                = 0
two complete fit/model runs byte-identical         = yes
```

## 9. Internal learning gates

On 72k only:

```text
teacher imitation vs global:
  cross-entropy and squared-error improvement      >= 15%
  paired cluster-bootstrap LCB on both              > 0

teacher imitation vs corridor:
  cross-entropy and squared-error improvement      >= 5%
  paired cluster-bootstrap LCB on both              > 0

realised labels vs global:
  log-loss and Brier improvement                    >= 5%
  paired cluster-bootstrap LCB on both              > 0

realised labels vs corridor:
  log-loss and Brier improvement                    >= 2%
  paired cluster-bootstrap LCB on both              > 0

absolute calibration:
  student macro fixed-width ECE                     <= 0.04
  calibration-in-the-large residual:
    intended/opponent                               <= 0.03 each
    teammate/loose/dead                             <= 0.015 each

non-vacuity:
  median row L1(student, global)                    >= 0.08
  top-vs-bottom student opponent quintile realised
    opponent-rate separation                        >= 15 percentage points
```

Every gate must pass before 74k external validation opens. No internal result
may alter the student or thresholds.

## 10. Fresh external gates

The 74k partition repeats every exact/support gate and every learning gate from
§9 without refitting the model, prior, standardiser or corridor baseline.
Additionally:

```text
intended and opponent Brier improvement vs corridor LCB    > 0
teammate/loose/dead Brier regression vs corridor UCB        <= +0.002 each
```

Calibration relative to corridor is reported as anatomy, not gated. Absolute
calibration and strictly proper predictive scores remain authority.

## 11. Exact invariants

```text
Match / PlayerBrain / TeamBrain source changes    = 0
live feature or probability consumer              = 0
post-kick action/target intervention               = 0
teacher child facts exposed to student input      = 0
observer identity fallback to Match truth          = 0
result-dependent row deletion                      = 0
post-result calibration/model refit                = 0
alternative-target selection                       = 0
final-test reads                                   = 0
production fingerprint changes                     = 0
```

## 12. Verdict and authority

PASS requires internal and fresh external gates. It proves only:

> The selected action's repeated-policy transition distribution is partially
> portable from kick-time observer facts.

PASS authorises one separate **alternative-action coverage and invariance
audit**: can the same observer feature boundary be computed for non-selected
targets without policy leakage, support bias or hidden truth? It does not
authorise live target choice, a pass score, conditional payoff, utility scalar,
gene, evolution, Match clones or production code.

FAIL parks this student representation. Do not add layers, tune temperature,
change class weights, relax calibration, expand seeds or open final. A restart
requires new observer state or a different causal representation, not a larger
model.
