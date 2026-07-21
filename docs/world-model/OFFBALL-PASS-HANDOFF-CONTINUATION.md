# H0 — Recent-handoff Continuation Intervention

Status: **COMPLETE — PRIMARY AND OPPONENT-CONTROL GATES FAILED; stopped.**

Date: 2026-07-21

## 1. Hypothesis

E2 proved that ordinary pass choice often returns the ball without `wallRun`,
but most original passers still move through named legacy support/run authority.
The missing generic fact is temporal shared context:

```text
A has just transferred stable control to B
```

H0 asks whether, in that exact context, moving A through the already accepted
role-neutral O0/O1 substrate to a feasible forward point makes a later ordinary
B→A pass more likely to reach stable intended control than keeping A at the
handoff point.

This is not a one-two action, return-pass bonus or live selector. The football
name remains observational.

## 2. Frozen sample

Use the first 128 eligible match seeds beginning at 29,000, scanning at most 256
seeds and accepting at most one state per seed.

Freeze immediately after a new live stable completed pass A→B when:

* A and B are same-team outfielders and still on the pitch;
* B is the current stable owner and ordinary dribbler;
* at least six seconds remain;
* truth O0 for A, with B as carrier, supports `hold` and at least one candidate
  satisfying `forwardDelta > 0`, `onside`, and
  `opponentArrivalMargin > 0`.

Choose the forward candidate with lowest self ETA, then candidate ID. This is
the same transparent feasibility ordering used in earlier O0/O4 probes. No
`wallRun`, role, gene, policy, named assignment, pass outcome or later value is
read by candidate selection.

## 3. Paired movement branches

From the same frozen post-handoff Match:

```text
hold branch          A MoveToPoint at current world point
continuation branch  A MoveToPoint at selected forward O0 point
```

In both branches B uses the existing `HoldPosition` action. A and B decision
timers alone are frozen. Run exactly 90 normal `Match.step(DT)` ticks. The probe
never writes position, velocity, heading, speed, acceleration or ball state.

Terminate categorically if B loses stable control, play stops, A/B is
removed/substituted or the intervention action changes unexpectedly. Excluded
states remain in the attrition ledger.

## 4. Forced return transition

When both movement branches remain valid, force the existing ordinary B→A pass
through Oracle v2 using four fixed child streams:

```text
childSeed = hashSeed(H0_NAMESPACE, matchSeed, freezeTick, replicate)
replicate = 0..3
```

The same child stream is used in both branches. Every pass begins from its own
unchanged post-movement clone. No `wallRun`, one-touch, target priority or
controller privilege is injected by the probe.

## 5. Primary outcome and mediators

Primary:

```text
continuation intended-reception rate - hold intended-reception rate >= +5pp
```

Hard mediators:

* continuation A closes its immutable target in at least 95% of completed
  interventions;
* continuation-minus-hold A local-x at pass time is positive in at least 90%
  of jointly completed states;
* target/action changes, clone failures, determinism differences, non-finite
  facts and Oracle force failures are exactly zero;
* continuation opponent-control rate may not increase by more than 5pp.

Report all five first-transition outcomes plus censoring, movement distance,
forward displacement, pre-pass attrition and the O0 candidate facts. Later
possession/xG/goals are outside H0.

## 6. Coverage gates

```text
eligible independent match seeds                 = 128
scanned match seeds                              <= 256
jointly completed movement states                >= 96
successful forced-pass opportunities per branch >= 96 * 4
hold/continuation completion-rate difference     <= 5pp
```

## 7. Stop rule

Stop without live or representation work if the +5pp reception gate fails, the
movement mediator fails, opponent control regresses, or validity/coverage fails.
Do not then change to lateral/backward, maximize another O0 fact, widen the
sample, alter the child count or lower the threshold.

Passing H0 authorises only a separate byte-identical representation contract
for recent control-transfer context. It does not authorise live pass-and-move,
`supportSpot` replacement, retiring `wallRun`, a gene or a play-test build.

## 8. Frozen result

Two complete runs produced the identical output hash
`f3c006512648fb36cdb531529a3e8e07610225fef799d804769bcad79b328c2b`.

### Mechanism and validity

```text
independent frozen states                         128 / 128
jointly completed movement states                  99 (gate >= 96)
hold / continuation completions                   100 / 99
forced-pass opportunities per branch                  396
clone/determinism/target/action failures        0 / 0 / 0 / 0
non-finite / Oracle force failures                   0 / 0
continuation target closures                       99 / 99 (100.0%)
positive continuation-minus-hold movement          99 / 99 (100.0%)
```

The selected generic target lay 4.439m forward on average. A arrived 4.472m
forward in the continuation branch versus 0.008m in hold, leaving a 4.465m
paired movement difference at pass time. The intended physical intervention
therefore worked exactly.

### Transition payoff

| branch | intended reception | opponent control | teammate recovery | loose | dead |
|---|---:|---:|---:|---:|---:|
| hold | 39/396 (9.8%) | 301/396 (76.0%) | 34 | 17 | 5 |
| continuation | 34/396 (8.6%) | 338/396 (85.4%) | 11 | 13 | 0 |

```text
continuation - hold intended reception   -1.3pp  (required >= +5pp) FAIL
continuation - hold opponent control     +9.3pp  (allowed <= +5pp)  FAIL
```

## 9. Verdict

The recent transfer identity is real, and E2's ordinary return choice is real,
but **unconditionally sending the original passer to the nearest feasible
forward point makes the physical return worse**. It is a generic recreation of
the old “go” instruction, not a sufficient pass-and-move substrate.

No handoff representation, live continuation, gene, selector or `wallRun`
retirement is authorised. Changing direction, maximizing a different O0 fact,
or lowering the threshold after this result would violate the stop rule. A
separate read-only failure audit may inspect whether the 1.5s commitment made
the initial affordance stale; it cannot retroactively turn H0 into a pass.

That audit is now complete in
[`OFFBALL-HANDOFF-FAILURE-AUDIT.md`](OFFBALL-HANDOFF-FAILURE-AUDIT.md).
It found that 87.9% of continuation points still had positive local access
margin at pass time. H0 therefore failed at the carrier→ball→controller
transition boundary, not primarily because its point commitment went stale.
