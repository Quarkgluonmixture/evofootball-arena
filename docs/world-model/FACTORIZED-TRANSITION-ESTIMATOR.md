# T0b-R — Factorised State-Baseline + Target-Relative Transition Estimator

Status: **PRE-REGISTERED — one bounded estimator-family revisit. No external
validation row may be read until the development preflight passes.**

Date: 2026-07-21

## 1. Why this is causally different

T0b fitted one multinomial softmax directly to each candidate's full kick-time
feature vector. It strongly distinguished targets, but the same parameters could
also alter the decision's overall transition ecology. T0b-F measured that mixing:
the mean action-aware vector differed from the state-only vector by `0.115585` L1
per decision, while the tiny macro-ECE point loss was below cluster-bootstrap
resolution.

T0b-R tests one new representation:

```text
decision-mean facts
→ state baseline P(transition | decision)

candidate facts - decision-mean facts
→ target-relative pattern

state baseline + balanced relative pattern
→ candidate transition probabilities
```

The relative component is prohibited from changing the average transition mass
of the decision. It may only redistribute that fixed mass among candidate
targets. This is a law-of-total-probability boundary, not a temperature patch or
a relaxed T0b gate.

## 2. Data authority

Reuse the unchanged Oracle-v2 generator, five labels, candidate boundary and
`kick-transition-features-v1` projection.

```text
development fit:
  seeds 40000–40239 where (seed - 40000) mod 4 != 3

development preflight:
  seeds 40000–40239 where (seed - 40000) mod 4 == 3

external validation:
  seeds 41000–41119 — sealed until development preflight passes

final test:
  seeds 42000–42239 — remains sealed throughout T0b-R
```

The development preflight is not described as fresh evidence: its outcomes were
seen during T0b and T0b-F. It is only a mechanical/falsification gate for the new
family. External validation is the first unseen payoff authority.

Expected development authority:

```text
240 clusters · 19,164 decisions · 93,636 actions
69,922 fit rows · 22,974 preflight rows · 740 administrative censors
training digest: 17eebdd52a883daabddc7d7a69c1c7455e398cf5ba2dd91f687a2df4befc0427
```

No seed, label, candidate, feature, censor or row may migrate.

## 3. Frozen model

### 3.1 State baseline

Fit the unchanged `transition-softmax-v1` to each row's decision-mean feature
vector. This reproduces the T0b state-only model. Its output for decision `d` is:

```text
p_state[d, k]
```

All candidates in one decision must receive byte-identical state probabilities.

### 3.2 Target-relative model

For action `a` in decision `d`, define the 14-dimensional relative input:

```text
delta[d, a] = actionFeatures[d, a] - stateFeatures[d]
```

Fit one deterministic five-class softmax to these deltas. Reuse T0b's model
basis and optimiser exactly:

```text
fit-only population mean/standard deviation
standardised clipping [-6, 6]
intercept + 14 linear + 14 squared terms
natural-frequency cross entropy
L2 1e-4 on non-intercepts
30 epochs · batch 1024 · learning rate 0.01
Adam 0.9 / 0.999 / 1e-8
zero initial weights
```

Use a new fixed shuffle namespace. No shared state fact, target identity, role,
future fact or hand-labelled football pattern enters this model. An intercept is
allowed inside its raw softmax, but cannot change final decision-level mass
because the composition below balances every decision.

Call the raw relative probabilities:

```text
q_relative[d, a, k]
```

They are an internal relative pattern, not publishable transition probabilities.

### 3.3 Deterministic balanced composition

For a decision with `A` evaluated candidates, initialise a strictly positive
`A × 5` matrix:

```text
M[a, k] = max(1e-12, p_state[d, k] * q_relative[d, a, k])
```

Run exactly 128 iterations of deterministic matrix balancing in fixed
candidate/class order. Each iteration:

```text
1. scale every class column so sum_a M[a,k] = A * p_state[d,k]
2. scale every action row so sum_k M[a,k] = 1
```

There is no tolerance-based early stop. The final row is the candidate's
transition vector. Single-candidate decisions return `p_state` exactly.

The composition must satisfy:

```text
all probabilities finite and strictly positive
every action row sum                         ~= 1 within 1e-12
mean action vector per decision             ~= p_state within L1 1e-10
candidate-order permutation equivariance    == within 1e-12 after undoing permutation
identical relative inputs in one decision   → identical final probabilities
```

Failure to converge within the fixed 128 iterations fails the family. Iterations
may not be increased after seeing results.

## 4. Frozen metrics

Use the unchanged T0b score definitions:

```text
multiclass log loss
multiclass Brier score
five one-vs-rest Brier scores
five equal-count-decile calibration errors
top-class accuracy (diagnostic)
within-decision maximum candidate L1 separation
```

Scores are averaged per match before comparison. Score improvements use 10,000
deterministic match-cluster bootstrap draws.

For calibration, freeze each model's original ten equal-count bins, then carry
whole-match bin ledgers through 10,000 deterministic cluster resamples. Report
the 95% interval for:

```text
macro ECE(factorised) - macro ECE(state)
```

This does not claim binned ECE identifies true calibration. Proper log loss and
Brier remain the primary probability scores; the ECE interval is a bounded
non-inferiority diagnostic. No bin count, cumulative metric or calibration map
may be introduced after results.

## 5. Development preflight and external gates

The same gates apply first to development preflight and then external validation:

```text
validity:
  semantic/identity/finite/determinism failures       == 0
  all five outcomes present                           == yes
  model fit twice byte-identical                      == yes
  balance/conservation/permutation failures           == 0

factorised vs global:
  relative mean log-loss improvement                  >= 5%
  relative mean Brier improvement                     >= 5%
  95% cluster-bootstrap LCB on both                    > 0

factorised vs state:
  relative mean log-loss improvement                  >= 2%
  relative mean Brier improvement                     >= 2%
  95% cluster-bootstrap LCB on both                    > 0

classwise vs state:
  intended and opponent Brier improvement LCB          > 0
  teammate/loose/dead Brier absolute regression        <= 0.001 each

calibration:
  absolute macro classwise ECE                         <= 0.04
  cluster-bootstrap UCB95 of ECE difference            <= +0.005
  absolute calibration-in-the-large residual:
    intended/opponent                                  <= 0.02 each
    teammate/loose/dead                                <= 0.01 each

target specificity:
  decisions with differing probability                >= 95%
  median within-decision max L1                        >= 0.10

causal factorisation:
  mean decision-vector L1 from state baseline          <= 1e-10
```

The `+0.005` ECE non-inferiority margin is frozen before T0b-R is run. It is
one eighth of the already-frozen absolute `0.04` ceiling and larger than the
T0b-F audit's unresolved upper difference `+0.003031`; it does not retroactively
change T0b's exact failed gate.

## 6. Invariants

```text
Match / PlayerBrain / TeamBrain changes                = 0
live feature or probability consumer                    = 0
training population/hash changes                        = 0
external rows read before preflight PASS                 = 0
final-test rows read                                     = 0
new model fits after seeing a gate result                = 0
probability calibration / temperature maps               = 0
feature, label, candidate, class or tolerance changes     = 0
named tactics, roles, genes or utility scores             = 0
RNG or simulation-state writes                            = 0
default fingerprint changes                               = 0
```

## 7. Verdict and stop rule

Development preflight must pass every gate before external validation opens.
External validation must then pass every same gate. Final-test seeds remain
sealed regardless.

Any failure stops T0b-R and parks this estimator line. It does not authorise:

* more matrix-balancing iterations;
* a different probability floor;
* temperature, isotonic or Dirichlet calibration;
* changed ECE bins/margin or score thresholds;
* new feature interactions, epochs, learning rate or regularisation;
* merging rare outcomes;
* another immediate estimator family;
* conditional payoff composition or live pass selection.

A full pass authorises only a separately pre-registered conditional-payoff
estimator contract. It does not make these probabilities live.

This is the single bounded revisit justified by T0b-F's new structural mediator.
If it fails, work returns to the decentralised S3–S8 mainline without another
transition-estimator retry.
