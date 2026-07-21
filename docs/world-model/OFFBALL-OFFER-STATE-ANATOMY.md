# O2a — Off-ball Offer-state Anatomy

Status: **PASS as offline conditional-state anatomy. No live selector or full
football-payoff claim.**

Date: 2026-07-21

## 1. Question

O0 exposes generic spatial choices and O1/O1a proves those fixed points can be
executed through the accepted movement stack. The next missing mediator is not a
score. It is whether the movement creates a measurably different **conditional
receiving state**:

```text
same stable carrier and frozen Match
→ hold / legacy / forward / lateral / backward mover target
→ real locomotion for 1.5s
→ if the same carrier still controls the ball:
     measure the pass option and local offer facts
   else:
     record the physical transition and stop
```

This is deliberately narrower than `counterfactual-value`. It does not execute a
pass, score a goal, or claim that a candidate improves the full action outcome.
S7b/S7e already proved that conditional next-state quality must not be confused
with the probability of reaching that state.

## 2. Frozen state and intervention

Collect the first 128 deterministic states from seed offset 21000 in which:

* play is live with a stable outfield carrier whose current action is `Dribble`;
* one non-carrier outfielder currently has `SupportBallCarrier`;
* O0 exposes an onside, positive-opponent-margin forward, lateral and backward
  point;
* at least two seconds remain.

The same candidate rule as O1a is frozen: lowest self ETA, then candidate ID.
Clone five branches from each state:

```text
hold / legacy supportSpot / forward / lateral / backward
```

The mover receives one fixed `MoveToPoint` action and an infinite decision timer.
The carrier keeps the already selected `Dribble` action and receives only an
infinite decision timer, preventing a fresh pass/shot decision during this
mechanism experiment. Neither action is restored after a real football event.
All other agents, contacts and ball physics continue normally.

## 3. First-transition boundary

After every complete `Match.step(DT)`, stop the branch at the first of:

```text
sameCarrierLostToOpponent
sameCarrierLostToTeammate
sameCarrierBecameLoose
deadBallOrRestart
moverRemovedOrSubstituted
unexpectedInterventionChange
```

If none occurs for 90 ticks, the branch reaches `offerState`.

The transition categories are anatomy, not numerical penalties. A branch that
does not reach `offerState` is not filled with a zero pass vector and is not
silently removed from the transition counts.

## 4. Conditional offer facts

At `offerState`, capture a full-truth snapshot without advancing another tick.
Measure:

* the existing ordinary-pass affordance from the same carrier to the mover;
* the existing `PassNextStateValue` when the ground pass is reachable;
* current mover/opponent access margin;
* current nearest-teammate spacing;
* carrier-to-mover corridor clearance;
* mover path length and stamina spent.

`PassNextStateValue` remains a conditional vector only. Its eight dimensions and
frozen tolerance/comparator are reused for anatomy; no new utility, coefficient or
preference is added.

For a candidate-vs-hold pair, a relation is computed only if both branches reach
`offerState` and both pass vectors are supported. Unsupported pairs remain counted
as unsupported with their transition reasons.

## 5. Validity and non-vacuity gates

```text
frozen states                         = 128
clone failures                        = 0
deterministic rerun differences       = 0
target changes while intervention live = 0
unexplained action changes            = 0
non-finite supported facts            = 0
direct position/velocity writes       = 0 by probe
Match/brain/source changes            = 0
live emitters                         = 0
```

Each forward/lateral/backward sector must have at least 64 supported paired
comparisons against hold. In each sector, at least half of supported pairs must
be non-equivalent under the already frozen pass-next-state tolerance. This only
proves that the generic movement creates a non-vacuous conditional choice set.
There is deliberately no requirement that alternatives dominate hold.

## 6. Stop rule

Stop before any value relation or live selection if:

* the same-carrier condition is too rare to support the pre-registered pairs;
* pass facts require macro possession or a named tactic label;
* missing conditional states must be filled with zero;
* the mover or carrier action must be reasserted after a football event;
* the branch needs a Match hook, target movement, direct state write or new score;
* the conditional vector remains mostly equivalent to hold; or
* deterministic reruns differ.

Passing O2a would authorise design of a separate task-occupancy/value contract.
It would not authorise a live `supportSpot` replacement, a scalar selector, a new
gene, or retirement of any named baseline script.

## 7. Frozen result

The 128-state run at seed offset 21000 passed every validity and non-vacuity
gate:

```text
clone failures / deterministic differences       0 / 0
target / unexplained-action / non-finite failures 0 / 0 / 0
supported candidate-vs-hold pairs:
  forward / lateral / backward                    77 / 77 / 78
non-equivalent relations                          100.0% / 98.7% / 100.0%
```

Two complete reruns produced the identical output hash
`670f83281e7f48cd007a42aca6a8d129778eace1e5a877c4786a0928fba6e184`.

Branches reached the same-carrier `offerState` in 77–78 of 128 states. Forty-six
or forty-seven branches instead reached a real owner-free ball before the fixed
horizon, and four or five reached a dead-ball/restart phase. These were retained
as categorical transitions and never filled with numeric pass values.

Conditional candidate-vs-hold relations were:

| geometry | candidate dominates | hold dominates | tradeoff | equivalent |
|---|---:|---:|---:|---:|
| forward | 20.8% | 0.0% | 79.2% | 0.0% |
| lateral | 40.3% | 13.0% | 45.5% | 1.3% |
| backward | 0.0% | 6.4% | 93.6% | 0.0% |

These are not action-payoff rates. They show that real generic movement creates
distinct conditional offer states: forward movement commonly exchanges safety
for progression, lateral movement sometimes improves several dimensions at once,
and backward movement commonly exchanges progression for access/security. No
direction is a universal answer.

The legacy target reached a conditional offer state in 77 cases but had lower
mean access margin and teammate spacing than hold, while gaining progression and
line breaks. This is useful baseline anatomy, not evidence to remove it.
