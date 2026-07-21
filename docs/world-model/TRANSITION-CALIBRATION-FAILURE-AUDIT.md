# T0b-F — Transition Calibration Failure Audit

Status: **COMPLETE — valid failure anatomy; T0b remains failed. The frozen-bin
cluster interval includes zero, so the exact ECE point gap is below this audit's
resolution. No new estimator or external-data access was authorised.**

Date: 2026-07-21

## 0. Result

The frozen population, training digest, model digest and original ECE values all
matched exactly. The audit read no external validation or final-test row. Its
10,000 deterministic fixed-bin match-cluster resamples found:

```text
macro ECE(action) - macro ECE(state)
point estimate: +0.000329
percentile 95% interval: [-0.003229, +0.003031]
bootstrap sha256: d699ead00d3affdd82fb61967a7c67ee5490e3473d071216b1272bd2ae349652
```

The interval includes zero. Under the pre-registered interpretation this is
**diagnosis 3: point estimate below audit resolution**. This does not reverse
T0b's exact frozen failure; it says the existing ten-bin ECE comparison cannot
support a broader claim that the action-aware estimator is truly less calibrated.

Per-class anatomy was:

| transition | action ECE | state ECE | action-state gap | observed | action mean prediction | state mean prediction | action signed residual | state signed residual |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| intended reception | 0.010683 | 0.015566 | -0.004882 | 0.625098 | 0.615349 | 0.624593 | -0.009749 | -0.000505 |
| teammate recovery | 0.006408 | 0.002835 | +0.003573 | 0.048620 | 0.044926 | 0.047106 | -0.003694 | -0.001514 |
| opponent interception | 0.013603 | 0.012541 | +0.001062 | 0.302864 | 0.313421 | 0.302616 | +0.010557 | -0.000248 |
| loose | 0.000588 | 0.001600 | -0.001012 | 0.006573 | 0.006975 | 0.007036 | +0.000402 | +0.000463 |
| dead ball | 0.005318 | 0.002414 | +0.002904 | 0.016845 | 0.019329 | 0.018649 | +0.002484 | +0.001804 |

Across 4,733 multi-action decisions, the L1 distance between the mean
action-aware probability vector and the shared state-only probability vector was:

```text
mean / median / p90: 0.115585 / 0.095023 / 0.221643
mean signed class shift:
  intendedReception      -0.008823
  teammateRecovery       -0.002325
  opponentInterception   +0.010804
  loose                  -0.000143
  deadBall               +0.000487
```

This is a structural mediator, not a new pass/fail gate. It shows that the one
action-aware softmax changes decision-level base transition mass as well as
separating candidate targets. A future estimator may therefore justify an
explicit state baseline plus centred target-relative effect, but that family,
its metrics and its gates require a separately frozen contract. This audit did
not test or authorise it.

All audit invariants were zero: malformed rows, bin-conservation failures,
state-within-decision differences and non-finite outputs. The focused tests,
TypeScript build and original model/ECE parity passed.

## 1. Authority and question

T0b remains failed. Its action-aware quadratic softmax beat the state-only model
by 8.79% log loss and 8.93% Brier on the 60-cluster internal holdout, but its
equal-count-decile macro classwise ECE was `0.007320` versus `0.006991`. The exact
relative gate failed, so external validation and final test stayed sealed.

This audit asks only:

> Did the action-aware model lose calibration broadly, or did one independently
> fitted softmax mix decision-level base risk with target-relative effects in a
> way that a coarse binned point estimate cannot localise?

The audit cannot pass T0b retroactively. It cannot fit temperature, Dirichlet,
isotonic or any other calibration map.

## 2. Frozen population

Reproduce exactly the existing T0b development population:

```text
fit:              seeds 40000–40239, modulo-4 folds 0/1/2
internal holdout: seeds 40000–40239, modulo-4 fold 3
external validate seeds 41000–41119: sealed
final test seeds 42000–42239: sealed
```

Use the same dataset generator, feature projection, model weights, state-only
baseline, global baseline and Oracle-v2 labels. Expected population and model
hashes must match the banked T0b result before any anatomy is reported.

## 3. Frozen diagnostics

### A. Per-class calibration anatomy

For each of the five outcomes and for action/state predictions separately,
report:

* equal-count-decile ECE using the unchanged T0b implementation;
* observed frequency;
* mean predicted probability;
* signed calibration-in-the-large residual (`predicted - observed`);
* action ECE minus state ECE.

All ten bins must conserve every holdout row exactly. Empty or non-finite bins
are hard failures, not skipped observations.

### B. Decision-level probability-mass shift

For every multi-action decision:

1. average the action-aware probability vectors across its candidate targets;
2. compare that vector with the state-only probability vector shared by those
   targets;
3. report mean, median and p90 L1 distance;
4. report the mean signed shift per transition class;
5. verify state-only predictions are identical for all actions in one decision.

This is a structural mediator. It does not assert that decision means must equal
state-only predictions; it measures whether one action-aware model is changing
both base ecology and relative target effects at once.

### C. Fixed-bin cluster-bootstrap uncertainty

Freeze the original action/state equal-count-decile bin membership. Run 10,000
deterministic resamples of the 60 match clusters, carrying each cluster's complete
bin counts, predicted sums and observed sums. Report the percentile 95% interval
for:

```text
macro ECE(action) - macro ECE(state)
```

This quantifies cluster sampling uncertainty conditional on the frozen bins. It
does not replace the failed point-estimate gate or claim the true calibration
error is identified.

Binned ECE is known to depend on bin construction and to have finite-sample
bias; the audit records that limitation rather than choosing a more favourable
bin count after the result. See [Roelofs et al., 2022](https://proceedings.mlr.press/v151/roelofs22a.html)
and [Arrieta-Ibarra et al., 2022](https://www.jmlr.org/papers/v23/22-0658.html).

## 4. Exact invariants

```text
training population/hash changes                = 0
model hash changes                              = 0
fit/holdout row changes                         = 0
external validation/test rows read              = 0
model fits beyond the frozen T0b models          = 0
probability transforms/calibration maps          = 0
feature, label, candidate or gate changes         = 0
non-finite probabilities/residuals                = 0
bin conservation failures                        = 0
state-within-decision probability differences     = 0
bootstrap nondeterminism                          = 0
production Match/AI changes                       = 0
default fingerprint changes                       = 0
```

## 5. Pre-registered interpretation

The audit may support only one of these diagnoses:

1. **Broad structural calibration loss:** the bootstrap interval is wholly
   above zero and several classes contribute positive ECE gaps. Any revisit
   needs a structurally different state-baseline + target-relative estimator,
   not post-hoc scaling of T0b.
2. **Localised class failure:** most of the point gap is attributable to a
   specific transition branch. Any revisit must model that branch causally or
   preserve it as unsupported; it may not merge the class.
3. **Point estimate below audit resolution:** the bootstrap interval includes
   zero. T0b still fails exactly as frozen, but a future contract should use
   proper scores plus a pre-registered statistically supported calibration
   diagnostic instead of another exact comparison of two biased binned point
   estimates.

Decision-level probability-mass shift is reported independently. A substantial
shift can motivate a hierarchical state-plus-action model, but this audit does
not define “substantial”, choose a model or test a correction.

## 6. Stop rule

Stop without a new estimator contract if any invariant fails. Do not:

* open seeds 41000+;
* alter bin count or binning method;
* fit a temperature or multiclass calibration map;
* try a centred-logit or hierarchical correction;
* reinterpret T0b as pass because an interval includes zero;
* change its ECE gate, feature basis, optimiser or training split;
* promote log-loss/Brier success directly into live use.

Passing this audit means only that the failed gate has a reproducible anatomy.
A new estimator family, metrics, partitions and gates must be frozen separately
before any external validation is opened.
