# T0 — Kick-time Transition Estimator Programme

Status: **T0a PRE-REGISTERED. User selected transition-estimator research after
R1a reached its frozen stop. No estimator, pass selector or live consumer is yet
authorised.**

Date: 2026-07-21

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
