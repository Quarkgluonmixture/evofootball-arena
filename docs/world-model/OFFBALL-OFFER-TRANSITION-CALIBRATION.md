# O4b — Offer Fact to Reception-transition Calibration

Status: **PRE-REGISTERED. Not yet run. No live selector.**

Date: 2026-07-21

## 1. Question

O4a proved that generic off-ball movement changes the first stable-control
transition after an ordinary pass. It did not show that a cheap kick-time fact
can predict that change. O4b asks exactly one narrower question:

```text
truth-ceiling O0 opponent-arrival margin at the committed target
→ mover executes that fixed target for 1.5s
→ existing ordinary pass is forced once
→ Oracle-v2 first transition
```

If the fact does not calibrate against the real transition, it cannot support an
offline selector and must not be wired into live AI.

## 2. Fresh sample and frozen branches

Use the unchanged O4a state/candidate/intervention rules on the first 128 valid
states from seed offset **24000**. This is disjoint from O4a's offset 23000.

For every state retain the same five branches:

```text
hold / legacy / forward / lateral / backward
```

Forward, lateral and backward keep O4a's feasibility rule: onside, positive
opponent-arrival margin, then lowest self ETA and candidate ID. Hold is the
existing O0 hold affordance. Legacy `supportSpot` is evaluated as one fixed world
point through the same truth snapshot and O0 evaluator; it receives no special
score or exemption.

The movement and forced-pass phases remain O4a exactly:

* immutable `MoveToPoint` for the mover and fixed `HoldPosition` for the carrier;
* real `Match.step`, contacts and all other agents for 90 ticks;
* pre-pass football transitions remain categorical and out of the pass sample;
* release only the probe-local decision suppressions;
* call existing `performPass(carrier, mover)` once;
* use the same child RNG seed across the five geometry branches;
* observe Oracle-v2 first transition, not first contact and not three-second S7
  payoff.

S7e remains parked.

## 3. Primary fact and outcome

The only primary predictor is the O0 truth-ceiling value captured **before the
movement intervention**:

```text
opponentArrivalMargin = nearestOpponentArrival - moverArrival
```

Pool every successfully forced branch record, including censoring. Sort records
by numeric margin with original deterministic record order as the exact-tie
break, then split the sorted finite ledger into four index quartiles.

Per quartile report:

* record count and mean margin;
* intended-reception rate;
* opponent-interception rate;
* all-other rate, retaining teammate/loose/dead/censored counts in the ledger;
* hold/legacy/forward/lateral/backward composition.

All rates use the full quartile count. Censoring and rare transitions are not
deleted or filled into another outcome.

## 4. Frozen primary gates

```text
fresh frozen states                         = 128
pooled successful forced-pass records       >= 400
clone/oracle force failures                 = 0
deterministic rerun differences             = 0
active target changes                       = 0
unexplained intervention changes            = 0
non-finite calibration facts                = 0

Q4 intended-reception rate - Q1 rate        >= +10 percentage points
Q4 opponent-interception rate - Q1 rate     <= -10 percentage points
```

Quartile-by-quartile monotonicity is diagnostic, not a gate. The hypothesis is a
coarse calibration claim at the extremes, not a fitted response curve.

The old O4a five-branch intended-reception range is also diagnostic in this fresh
sample. O4b does not move or reuse O4a's 5pp non-vacuity gate.

## 5. Diagnostic facts

The following O0 facts receive the identical quartile anatomy, but cannot rescue
or fail the primary hypothesis:

```text
carrierLaneClearance
nearestTeammateDistanceAtArrival
selfArrival
forwardDelta
```

They are retained to explain a pass/fail and to expose branch-composition
confounding. O4b does not combine them, fit weights, choose a threshold, perform
residualisation or create a score.

## 6. Validity and determinism

The default O4a invocation and output must remain byte-identical, including its
accepted hash. O4b is an explicit probe mode and must itself produce an identical
complete-output hash on repeat.

No production source, Match ordering, PlayerBrain, TeamBrain, pass execution,
M3, candidate generator, relation, gene or live emitter may change.

## 7. Stop rule

Stop the cheap-selector path if either primary rate difference misses its frozen
gate. Do not respond by:

* making one of the diagnostic facts primary;
* adding facts to a scalar or lexicographic rule;
* moving quartile boundaries or thresholds;
* dropping hold/legacy or adverse/censored outcomes;
* increasing the state count;
* changing movement duration, candidate choice or pass execution;
* reopening S7e payoff inference; or
* wiring truth facts into live AI.

A pass only authorises an observer-specific replication of this calibration.
It does not authorise a selector. The observer-specific facts must first retain
the truth-ceiling ordering/payoff link; only then may a separate, bounded offline
selector contract be proposed.

## 8. Emergence boundary

`forward`, `lateral` and `backward` are probe geometry bins, not football actions.
No `cutInside`, overlap, check-back, underlap, third-man or role label enters the
world state or policy. Named football patterns may later be detected from generic
trajectories for telemetry and play-test clips only.
