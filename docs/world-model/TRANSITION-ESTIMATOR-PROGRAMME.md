# T0 — Kick-time Transition Estimator Programme

Status: **T0a SUPPORT CENSUS PASSED. T0b STOPPED on its pre-registered internal
holdout: action-specific transition signal was strong, but the strict relative-
calibration gate failed. T0b-F later found that the tiny binned-ECE gap is below
cluster-bootstrap resolution, but this does not reverse the frozen failure.
External validation and final test remain sealed. No pass selector or live
consumer is authorised.**

Date: 2026-07-21

The bounded estimator-family revisit in
[`FACTORIZED-TRANSITION-ESTIMATOR.md`](FACTORIZED-TRANSITION-ESTIMATOR.md). It
separates decision-state probability from target-relative redistribution and
enforces the former as an exact per-decision marginal. Its development preflight
passed and opened external validation. All external predictive and calibration
gates passed, but two of 9,535 multi-action decisions missed the fixed balancing
tolerance after 128 iterations. It therefore stopped on validity. Final test,
conditional payoff and live selection remain unauthorised; the estimator line is
now parked.

## 1. Why this is a new programme

The parked S7e-0C experiment repeatedly rolled the same 509 chosen-versus-
alternative pairs and asked whether each pair's five-dimensional mean had a
stable Pareto relation. Its Oracle v2 semantics were valid, but `R=32` could not
classify those per-pair means reliably. Adding continuations, changing tolerances
or running the withheld final remains forbidden.

T0 asks a different statistical and causal question:

> Can kick-time state/action facts learned across many independent match states
> predict which physical transition occurs in previously unseen matches?

Its units are independent match clusters and decision/action observations, not
repeated estimates of one action's private outcome distribution. Information is
pooled across states through an explicit estimator and evaluated on match seeds
that were never used to design or fit it.

The intended factorisation is:

```text
kick-time state + candidate target
→ P(intended / teammate / opponent / loose / dead)

kick-time state + candidate target + transition outcome
→ conditional ComparablePassPayoffV1

transition distribution × conditional payoff
→ one predicted multi-dimensional action outcome
```

The output remains a vector. T0 must not introduce a universal football utility,
named tactic, safety bonus, gene or live action.

## 2. Frozen data partitions

All matches last 240 simulated seconds and use the existing random team/squad
construction.

```text
T0a support census / future training:
  seeds 40000–40239  (240 match clusters)

T0b model validation:
  seeds 41000–41119  (120 sealed match clusters)

T0c final test:
  seeds 42000–42239  (240 sealed match clusters)
```

T0a may read only the first range. Validation and test outcomes stay unread until
their separately pre-registered stages. No seed may migrate between partitions.
Failure to meet a T0a support gate does not authorise extending the seed range.

## 3. Decision and action population

At every fresh ordinary live pass, capture the immediately pre-decision structural
clone under the same preconditions already used by Oracle v2:

```text
phase == playing
stable carrier exists
carrier decision timer <= 0
carrier kick cooldown <= 0
the next live action creates a fresh ordinary pass from that carrier
```

The live target identifies the decision event but does not define the candidate
set. From the frozen state, build an oracle-perception `PassAffordanceResult` for
every non-sent-off teammate other than the passer. Retain every candidate whose
ordinary ground flight is reachable and whose existing `passNextStateValue()` is
non-null.

For each retained target, independently clone the same frozen state and execute
one `runOracleV2Branch()` intervention. The chosen target is included once; no
action is duplicated because it appears in an old Pareto pair. All actions from
one decision share the frozen RNG state. This is a deterministic common-start
intervention, not a promise that later football events consume paired random
draws.

This changes the old sample authority deliberately:

```text
old S7e: only chosen and old-S7 dominators, repeatedly continued
T0:      every viable target at many fresh decisions, one continuation each
```

## 4. Frozen kick-time feature authority

T0a records only facts already available from the S3–S5 representation before the
kick. Exact oracle perception is legal for this first estimator ceiling, but the
schema must also be computable from a future observer-specific
`PerceptionSnapshot`; direct future Match truth is forbidden.

The continuous/count feature vector is fixed before the census:

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

`controlProbability` and `offsideRisk` are excluded because they are hand-derived
compressions of retained raw features. Gid, role, team identity, match seed,
future controller and payoff are forbidden as estimator features. Match seed,
decision tick and gids remain ledger identity only.

Every feature must be finite. Feature order and names are versioned as
`kick-transition-features-v1` and may not be changed after T0a results are seen.

## 5. Label and payoff authority

The label is Oracle v2's frozen first-transition authority:

```text
intendedReception
teammateRecovery
opponentInterception
loose
deadBall
```

Administrative censors remain censors, not a sixth football class. A censored
record stays in the audit ledger but is not an estimator row. Any force failure,
identity loss, residual outcome or Oracle conservation violation fails T0a.

`ComparablePassPayoffV1` is retained beside every record for future conditional-
value research. T0a does not fit, compare or select using it.

## 6. T0a support census

T0a is a data-mechanism gate, not a model result. It reports:

* match clusters, decision events and unique action records;
* candidates per decision and chosen-target inclusion;
* all five transition counts overall and by four fixed match folds
  (`(seed - 40000) mod 4`);
* administrative censor and Oracle failure counts;
* per-feature min/max/mean and non-finite counts;
* decisions with more than one candidate and decisions whose candidate actions
  produce more than one transition outcome;
* exact record hash and an independent deterministic audit rerun.

The frozen pass gates are:

```text
completed match clusters                    == 240
decision events                             >= 12000
unique action records                       >= 48000
decisions with >=2 candidates               >= 95%
chosen target present exactly once          == 100%
all five outcomes overall                   >= 100 records each
all five outcomes in every fixed fold       >= 20 records each
within-decision observed outcome variation  >= 15%
action-feature variation within decision    >= 95%

force failures                              == 0
identity/residual/conservation failures     == 0
duplicate decision/action identities        == 0
non-finite features/payoffs                  == 0
censored estimator rows                     == 0
administrative censors                      <= 1% of actions
sealed validation/test seeds read           == 0
deterministic audit differences             == 0
```

The 15% outcome-variation gate is descriptive support for action effects, not a
claim that all differences were caused only by target choice. Its denominator is
decisions with at least two completed, resolved actions.

The deterministic audit reruns the first valid decision from each of seeds
40000–40007 and requires byte-identical feature, transition and payoff records.
The full census itself is not adaptively repeated with more seeds.

## 7. What T0a can authorise

Passing T0a authorises one new, pre-registered T0b estimator contract. That
contract must freeze before reading validation outcomes:

* standardisation from training only;
* transition model family, regularisation and optimiser;
* action-aware and action-agnostic baselines;
* probability scoring and calibration gates on unseen match clusters;
* treatment of rare branches;
* a separate conditional-value model and its baselines;
* mixture-vector validation without scalarising dimensions.

T0a does not authorise fitting a model during the census, opening the validation
or test ranges, changing pass candidates, or wiring PlayerBrain.

## 8. Stop rule

Stop T0 and leave live football unchanged if T0a misses any frozen gate. Do not:

* extend or swap the training seeds;
* add repeated continuations to manufacture rare outcomes;
* merge `loose` or `deadBall` into another class;
* remove hard candidate states after seeing their outcome;
* add target identity, role labels or future truth as features;
* fall back to the old 509 pairs;
* fit an estimator against censored or invalid records;
* weaken the five-class objective because one branch is difficult.

If T0a passes, T0b remains offline and still cannot select a pass. A future live
consumer would require a separate observer-specific, counterfactual-payoff and
play-test contract after estimator generalisation has passed.

## 9. Frozen T0a result

The pre-registered training-only command completed all 240 match clusters:

```text
fresh ordinary live passes:       19,173
represented decision events:      19,164
unrepresented live passes:             9
unique candidate-action records:  93,636
resolved estimator rows:          92,896
administrative censors:               740 (0.79%)
mean candidates per decision:       4.89
```

Every retained decision had at least two candidates and action-dependent feature
variation. Among 19,058 decisions with at least two resolved branches, 15,084
(79.15%) produced more than one first-transition outcome when only the target
action changed.

The five-class support was:

| outcome | records |
|---|---:|
| intended reception | 58,611 |
| teammate recovery | 4,379 |
| opponent interception | 27,762 |
| loose | 651 |
| dead ball | 1,493 |

Every fixed fold retained at least 151 loose records and 363 dead-ball records;
all other classes were above 1,000 per fold. The rare classes therefore remain
real estimator targets rather than being merged or manufactured with repeated
continuations.

All semantic/mechanism gates passed:

```text
force failures / conservation failures / duplicate identities: 0 / 0 / 0
non-finite features or payoffs: 0
censored rows admitted to estimator: 0
deterministic audit differences: 0 across 8/8 audit decisions
sealed validation/test seeds read: 0
```

Nine fresh live passes did not contain their chosen target in the frozen finite
candidate representation, consistent with the already-known tiny intended-flight
reachability tail. They are reported and excluded from T0 training; the candidate
boundary was not enlarged after observation.

The complete ordered record digest is:

```text
ee3d58b10817e7ae904fe2d946f4bc015977b4e157f46d38acecae37b62ca84c
```

T0a therefore passes and authorises only a pre-registered T0b estimator contract.
The result does not yet show that any model can generalise, compose conditional
payoff, or improve a pass decision.

## 10. T0b — Five-transition probability estimator

Status: **PRE-REGISTERED BEFORE READING SEEDS 41000–41119.**

T0b asks only:

> Can the frozen kick-time feature vector predict Oracle v2's five first-
> transition classes on unseen match clusters, and does the candidate-specific
> information add value beyond the general ecology of the decision state?

It does not estimate `ComparablePassPayoffV1`, compare targets or choose a pass.

### 10.1 Fit and evaluation partitions

The already-observed training range is split deterministically:

```text
fit:              seed 40000–40239 where (seed - 40000) mod 4 != 3
internal holdout: seed 40000–40239 where (seed - 40000) mod 4 == 3
external validate: sealed seeds 41000–41119
final test:         seeds 42000–42239 remain sealed
```

No row from one match may appear in another partition. The model, optimiser,
bases and gates below are frozen before the internal holdout or external
validation scores are computed.

### 10.2 Fixed model basis

For each of the 14 `kick-transition-features-v1` dimensions, calculate mean and
population standard deviation on fit actions only. A standard deviation below
`1e-12` is replaced with `1`; this keeps constant training facts as zero-valued
features rather than deleting or filling rows. Standardised values are clipped
to `[-6, 6]`.

The model basis is fixed as:

```text
intercept
14 standardised linear facts
14 squared standardised facts
```

There are no cross-feature interactions, target identities, role labels or
future facts. The estimator is one five-class multinomial logistic regression.

Training is deterministic mini-batch Adam:

```text
loss: unweighted natural-frequency cross entropy
L2: 1e-4 on non-intercept weights
epochs: 30
batch size: 1024
learning rate: 0.01
beta1 / beta2 / epsilon: 0.9 / 0.999 / 1e-8
epoch order: deterministic Fisher–Yates from namespace 0x74306231 + epoch
initial weights: exactly zero
```

Every class remains in the softmax denominator. There is no class weighting,
oversampling, probability smoothing, temperature fitting, early stopping or
hyperparameter search.

### 10.3 Frozen baselines

T0b compares three probability sources:

1. **Global base rate:** raw five-class frequencies in fit actions. All classes
   have positive fit support, so no smoothing is needed.
2. **State-only model:** the same logistic model and optimiser, but every action
   in a decision receives the component-wise mean of all candidate feature
   vectors from that decision. It can learn match/state ecology but cannot tell
   targets apart.
3. **Action-aware model:** the candidate's own feature vector.

Both learned models calculate separate fit-only standardisation authorities.
Rows and natural class frequencies are otherwise identical.

### 10.4 Frozen metrics

For every resolved holdout/validation action, report:

```text
multiclass log loss
multiclass Brier score
five one-vs-rest Brier scores
five equal-count-decile calibration errors
top-class accuracy (diagnostic only)
```

Scores are first averaged per match seed. Inference uses a deterministic 10,000-
draw cluster bootstrap over match seeds. For an improvement, positive means the
baseline score minus the action-aware score.

Action specificity is measured per multi-action decision as the maximum L1
distance between any two candidate probability vectors. Report the median and
the fraction above `1e-6`.

### 10.5 Internal and external gates

The same frozen gates apply first to the 60-cluster internal holdout and then to
the 120-cluster external validation:

```text
semantic/identity/finite/determinism failures == 0
all five outcomes present                    == yes

action-aware vs global:
  relative mean log-loss improvement         >= 5%
  relative mean Brier improvement            >= 5%
  95% cluster-bootstrap LCB on both           > 0

action-aware vs state-only:
  relative mean log-loss improvement         >= 2%
  relative mean Brier improvement            >= 2%
  95% cluster-bootstrap LCB on both           > 0

classwise:
  intended and opponent Brier improvement
  vs state-only 95% cluster-bootstrap LCB     > 0
  teammate/loose/dead Brier absolute change
  vs state-only                               <= +0.001 each

calibration:
  action-aware macro classwise ECE            <= state-only macro ECE
  action-aware macro classwise ECE            <= 0.04

action specificity:
  decisions with differing probability       >= 95%
  median within-decision max L1 distance      >= 0.10
```

The internal holdout must pass before external validation is opened. Failure is
a model-family stop, not permission to change the learning rate, basis,
regularisation, epochs, clipping, seed split or gates.

### 10.6 T0b verdict and authority

`PASS` requires every internal and external gate. `FAIL` means this fixed cheap
estimator does not generalise sufficiently and T0 returns to the mainline choice;
the sealed final test remains unread. There is no statistical `INCONCLUSIVE`
escape hatch because the cluster sizes, practical effects and bootstrap authority
were fixed after T0a established ample support and before validation.

Passing T0b authorises only a new conditional-payoff estimator contract. It does
not authorise reading the final test, multiplying transition probabilities by
payoff estimates, comparing targets or wiring a live decision.

## 11. Frozen T0b result — strong action signal, calibration stop

The fixed training generator exactly reproduced T0a's population:

```text
240 clusters · 19,164 decisions · 93,636 actions
69,922 fit rows · 22,974 internal-holdout rows · 740 administrative censors
force / invariant / duplicate failures: 0 / 0 / 0
training digest: 17eebdd52a883daabddc7d7a69c1c7455e398cf5ba2dd91f687a2df4befc0427
```

The action-aware model trained twice byte-identically. The frozen action/state
models and global probabilities hash to:

```text
6e388d0a6263229a0dc6d8f74c96022c780168afb7e963f37e67bc6e25920865
```

All five outcomes were present in the 60-cluster internal holdout. The main
predictive results were:

| score | action-aware | state-only | global | improvement vs state-only |
|---|---:|---:|---:|---:|
| log loss | 0.784033 | 0.859588 | 0.906217 | 8.79% |
| multiclass Brier | 0.458157 | 0.503100 | 0.516170 | 8.93% |
| top-class accuracy (diagnostic) | 65.31% | 62.40% | 62.35% | +2.91pp |

The cluster-bootstrap lower bounds were positive for both scores against both
baselines. Intended-reception and opponent-interception classwise Brier lower
bounds passed; all three rare-class non-regression gates passed. Every one of
4,733 multi-action decisions received differing candidate probabilities, with a
median within-decision maximum L1 distance of `0.756038` against the frozen
minimum `0.10`.

The one failed hard gate was calibration relative to the state-only model:

```text
macro equal-count-decile ECE
action-aware: 0.007320
state-only:   0.006991

required:
action-aware <= state-only
```

The action-aware model easily passed the absolute `ECE <= 0.04` gate, but the
pre-registered relative gate admits no numerical grace band. T0b therefore fails
and stops. Seeds `41000–41119` were not opened, and seeds `42000–42239` remain
sealed. No temperature fitting, changed bins, longer training, new basis or
relaxed comparison is authorised after seeing this result.

This is not evidence that target-specific transition facts are useless. On the
contrary, the action-vs-state predictive gains and specificity mediator are
large. The narrower conclusion is:

> This fixed uncalibrated quadratic-softmax authority did not meet every frozen
> probability contract, so it cannot be promoted into conditional-value
> composition or live pass selection.

The probe and dormant feature projection remain research assets. Any future
transition-estimator revisit must state a causally/inferentially new calibration
authority before opening new validation clusters; immediately adding temperature
scaling or changing the failed ECE gate would be an adaptive retry.

### 11.1 T0b-F failure anatomy

The separately pre-registered read-only audit reproduced the original population,
training/model hashes and action/state ECE exactly, then resampled the 60 internal
match clusters 10,000 times while preserving the original bins. Its interval for
`ECE(action) - ECE(state)` was `[-0.003229, +0.003031]`; the frozen point gap was
`+0.000329`. Therefore the exact T0b gate remains failed, but the audit cannot
support the stronger statement that action-aware calibration is broadly worse.

The anatomy also found a mean decision-level probability-mass shift of `0.115585`
L1: averaging over target actions lowered intended reception by `0.008823` and
raised opponent interception by `0.010804` relative to the shared state-only
prediction. This suggests that one unfactored softmax is changing both the
decision's base transition ecology and the target-relative differences. It is
motivation—not authorisation—for a future state-baseline + centred target-effect
family. Any such family needs a new pre-registered inference contract, proper
scores and a statistically supported calibration diagnostic. No external seed
was opened. Authority:
[`TRANSITION-CALIBRATION-FAILURE-AUDIT.md`](TRANSITION-CALIBRATION-FAILURE-AUDIT.md).
