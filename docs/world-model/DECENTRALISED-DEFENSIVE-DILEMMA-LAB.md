# Decentralised Defensive Dilemma Lab

Status: **DDD-0 contract pre-registered; probe not yet implemented or run.**

Date: 2026-07-22

## 1. Why this is next

EOR-0 found a clean split:

```text
A made a material generic movement                  503 / 634
B's fixed candidate response range changed          234 / 634
an opponent moved materially                        111 / 634
mark/chaser assignments changed                       2 / 634
full embodied reaction                               70 / 634
```

Explicit O3 intent was informative in 97.5% of completed interventions, but the
ordinary defensive world rarely turned an attacking run into a changed world
for another attacker. This stops the attacking-selector line. It does not yet
tell us whether the missing piece is:

* no generic defensive action space can express the response; or
* the actions exist, but the central commander does not select them.

DDD-0 separates those causes. It is a bounded, coupled attacker × defender
experiment using real movement and real pass/contact/control transitions. It
does not train or score a defender.

## 2. Causal question

For one frozen possession:

```text
A performs one generic O0 movement
-> D performs each symmetric generic movement in turn
-> the carrier makes the same physical pass to A or to B
-> Oracle-v2 records first stable control
```

Does D's physical response set contain real trade-offs, such that one response
closes A while exposing B and another closes B while exposing A?

This is a defensive dilemma without naming overlap, underlap, decoy, cover or
man-marking. Those names may be applied only after the fact to replay telemetry.

## 3. Hypotheses

### DDD-H1 — generic defensive action capacity

Across A interventions, D's symmetric movements commonly create an arrival
cross-over between the two attacking outlets: at least one response gets D
materially earlier to A and later to B than another response.

### DDD-H2 — the capacity reaches real football transitions

For a non-trivial subset of those arrival cross-overs, paired Oracle-v2 passes
also cross over: the response that increases opponent first control against A
reduces it against B, or vice versa.

H1 asks whether the movement substrate can express the choice. H2 asks whether
the choice matters after ball flight, contact, recontest and stable control.

## 4. Frozen substrate

The experiment reuses without modification:

* S3 observer-specific perception and memory;
* O0 symmetric attacking candidates;
* `generateOffBallCandidates()` only as a role-neutral symmetric point generator
  for D; no attacking affordance values are applied to defence;
* `MoveToPoint`, steering, physics, player contact and law;
* M2/M3 and Oracle-v2 first-transition semantics;
* current PlayerBrain and TeamBrain for all non-intervened players.

No production module may import DDD-0. No live action, policy weight, gene, task,
mark assignment, candidate score or save field changes.

## 5. Fresh states

```text
seed start                  51000
required accepted states       64
maximum scanned seeds          128
match duration                 240 seconds
sampling cadence                 1 second
minimum match time              10 seconds
awareness                      0.8
administrative clearance         8 seconds
```

The phase must be `playing`; the stable carrier must be an outfield player.

Choose A and B exactly as EOR-0 did: eligible carrier teammates with a valid
observer-specific O0 surface, at least four finite/onside non-hold candidates at
the existing `0.75s` horizon, sorted by decision timer then gid. A is first, B
second. No role or outcome is read.

Enumerate every eligible A candidate at the `0.75s` horizon in stable candidate
id order. Do not choose the best direction.

## 6. Choosing the measured defender

DDD-0 needs one defender to expose a one-body capacity constraint; it does not
allocate a live defensive task.

For each A candidate, select D offline as the active opposing outfielder with
the minimum existing `estimateReach()` ETA to A's fixed target point from D's
own observer snapshot. Exact ties use gid.

Requirements:

* D's proprioceptive state and reach profile must be present;
* D must observe the carrier and A, or the intervention is unsupported;
* the selection is probe metadata only and is never written to TeamBrain,
  `marks`, `chasers` or PlayerBrain.

This chooses the physically relevant measured subject without claiming that a
live team knows the oracle-best assignment.

## 7. Symmetric D response set

Generate D's points from its observed physical state with the existing symmetric
candidate generator and D's team attack frame. Keep:

* `hold` at D's observed point;
* every pitch-valid direction at the existing `0.75s` horizon;
* stable candidate-id ordering.

Offside is irrelevant to the defending mover and is not used as a filter. No
direction receives a name, prior, weight or score. At least six non-hold
directions plus hold are required for an intervention.

## 8. Physical response branches

Each A × D-response branch starts from the same frozen Match and RNG state.

For exactly `0.75s = 45 ticks`:

* carrier: decision-frozen `HoldPosition`, ordinary execution/physics;
* A: decision-frozen `MoveToPoint` at its enumerated O0 point;
* B: decision-frozen `MoveToPoint` at B's initial physical point;
* D: decision-frozen `MoveToPoint` at its enumerated symmetric point;
* every other player: unchanged live brain and physics.

The longer interval than EOR-0 is not an EOR retry. EOR measured passive world
response at one existing TeamBrain cadence; DDD-0 executes a new defender action
whose candidate horizon is already 0.75s.

Completed branches require stable carrier control, playing phase, unchanged
roster identity and unchanged intervention actions/targets. Every attrition cause
is counted. No player state is written directly.

## 9. Arrival trade-off

At each completed endpoint, use the same reachability authority to calculate:

```text
D ETA to A's current physical point
D ETA to B's current physical point
```

For two D responses `r1` and `r2`, an **arrival cross-over** exists when either:

```text
ETA_A(r1) <= ETA_A(r2) - 0.10s
AND
ETA_B(r1) >= ETA_B(r2) + 0.10s
```

or the mirror relation holds.

Also report carrier→A/B lane distance, goal-side relation, D travel and nearest
defensive-teammate distance separately. They are diagnostics and are never
summed into coverage.

The `0.10s` threshold is a probe resolution, not a gameplay coefficient or
selection preference.

## 10. Real transition tensor

For every completed D response, force the unchanged ordinary pass twice:

```text
carrier -> A
carrier -> B
```

Use four deterministic paired child streams per target. The same child stream
is used for every D response within an A intervention and separately cloned from
the physical endpoint. Record the full Oracle-v2 partition:

```text
intendedReception
teammateRecovery
opponentInterception
loose
deadBall
censored
```

No branch outcome is converted to utility.

For two D responses, a **transition cross-over** exists when their opponent-first-
control rates differ in opposite directions by at least one of four replicates:

```text
opp_A(r1) >= opp_A(r2) + 0.25
AND
opp_B(r1) <= opp_B(r2) - 0.25
```

or the mirror relation holds.

The primary coupled event requires an arrival cross-over and a transition
cross-over for the same A intervention. It does not require that the analytically
earlier response be the transition winner; any mismatch is reported as model
anatomy rather than deleted.

## 11. Primary gates

DDD-0 passes only if all gates pass.

### Validity

```text
accepted states                         = 64
enumerated A interventions              >= 256
enumerated D response branches          >= 1,792
jointly completed response branches     >= 70%
valid Oracle opportunities              >= 90% of completed responses × 8
force failures                          = 0
perception RNG-state changes            = 0
non-finite facts                        = 0
action / target mutation                = 0
clone / identity failures               = 0
child-seed collisions                   = 0
production fingerprint changes          = 0
```

### Execution

Among completed non-hold D responses:

```text
D closes >=0.25m more target distance than hold
  in >= 90% of branches
```

### Defensive capacity

```text
A interventions with an arrival cross-over
  >= 50% of supported A interventions

states with at least one arrival cross-over
  >= 48 / 64
```

### Football transition

```text
A interventions with arrival + transition cross-over
  >= 20% of supported A interventions

states with at least one coupled cross-over
  >= 32 / 64
```

### Determinism

Two complete executions must emit byte-identical JSON and SHA-256 digests.

## 12. Mediators and anti-vacuity

Always report:

* actor and candidate support by geometric direction;
* D target closure and actual endpoint spread;
* ETA_A/ETA_B ranges and pairwise cross-over counts;
* lane/goal-side/teammate-distance trade-offs;
* complete transition tensors for A and B;
* whether cross-overs are distributed across directions and states;
* the incumbent hold response in every matrix;
* all administrative, control-loss and roster attrition.

Hard anti-vacuity rules:

* geometry alone cannot pass H2;
* one rare goal/dead-ball event cannot count as opponent first control;
* a response must physically move D; target-coordinate changes without body
  movement are not capacity;
* do not delete B outcomes because A is the intended attacking movement;
* do not pick a favourable D response after reading Oracle outcomes;
* do not collapse the two-outlet tensor into one success rate.

## 13. Counterfactual controls

1. Hold/hold and response/response reruns must be exact.
2. Reversing D candidate enumeration must reproduce the id-keyed tensor.
3. Swapping Oracle child-stream iteration order must not change id-keyed counts.
4. Force A and B from independently cloned endpoints; the first pass may not
   mutate the second pass's initial state.
5. A synthetic endpoint pair with the same D position must not create an arrival
   cross-over.
6. An arrival cross-over with identical transition tensors remains an honest H2
   negative.

## 14. Interpretation and stop rule

```text
H1 pass, H2 pass
  the generic action space can express a real defender dilemma;
  authorise a separately pre-registered decentralised defensive selector or
  sealed co-adaptation contract.

H1 pass, H2 fail
  geometry can move the defender between outlets but does not affect real pass
  transitions; inspect ball-flight/access composition, not preferences.

H1 fail
  symmetric point movement is not a sufficient defensive response substrate;
  do not train a defender selector.
```

Failure may not trigger a longer horizon, fewer directions, a hand-picked D,
lower cross-over thresholds, named marking points or a scalar coverage score.

Passing DDD-0 does not authorise live wiring, genes, central allocation, removal
of `marks/chasers`, full-match evolution or play-test. It authorises only the
next separately frozen selection/ecology question.

