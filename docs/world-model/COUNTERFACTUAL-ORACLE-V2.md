# Counterfactual Oracle v2-0 — First-Transition Semantics

Status: **v2-0 event semantics and Comparable V1 preflight passed; the later
replicated pilot was statistically inconclusive. Probe-only, with no S7e
estimator or live consumer.**

Date: 2026-07-21

## 1. Question and boundary

The old counterfactual probe records both a pass `resolution` and a
`firstController`. They are useful anatomy, but they mix different clocks:
`pendingPass` bookkeeping, macro possession and the first stable physical owner.
M3 makes that ambiguity material because first contact is not stable control.

Oracle v2-0 introduces one mutually exclusive first-transition authority:

```text
intendedReception
teammateRecovery
opponentInterception
loose
deadBall
```

with a separate status:

```text
resolved | censored | forceFailure
```

This slice changes only scripts, tests and documentation. It must not modify
`Match`, RNG state, candidate generation, the S7 Pareto relation, tolerances or
live AI. It does not run a continuation ensemble and does not judge S7e payoff.

## 2. Frozen event authority

Observation begins immediately after a forced ordinary pass has created the
matching `pendingPass`. After every complete `branch.step(DT)`, the first matching
post-step event wins in this fixed order:

```text
administrative halftime/fulltime → censored
football-law dead event          → deadBall
first stable ball.owner          → intended / teammate / opponent
matching pendingPass ends unowned while playing → loose
otherwise continue
```

First contact, deflection and `pendingControl` creation do not terminate the
observation. `possessionSide` never classifies physical control, and
`lastCompletedPass` may corroborate a same-pass own-team completion but never
creates an outcome.

The pass key freezes all identities available in the current lifecycle:

```text
passerGid · targetGid · side · kickTick · kickTime · kind
```

The probe-only first-transition cap is fixed at **4.0s from kick**. The live
`pendingPass` lifetime is 3.5s; the extra 0.5s is bounded observation slack, not a
gameplay coefficient. A still-active matching pass at the cap is `censored`, not
loose. Losing identity without a lawful terminal event is `forceFailure`.

Goal, touchline restart and the deliberate goal-line `ballCoastingOut` state are
football-law dead evidence. Halftime/fulltime are administrative censors.

## 3. Snapshots and support masks

Each branch freezes three different facts:

1. **First transition:** the authoritative post-step event and controller, if any.
2. **Post-control state:** captured on the same tick, and supported only for the
   three stable-controller outcomes.
3. **Later payoff:** primary at the first tick at or after `kick + 3.0s`, plus a
   diagnostic at the first tick at or after `transition + 3.0s`.

The 3.0s-from-kick horizon remains the historical authority. The transition-relative
snapshot is anatomy only and cannot be selected by outcome.

When no stable owner exists, owner-dependent fields are `null`, never zero:

```text
physicalControl = none
possession = null
exitOptionCount = null
```

Macro `possessionSide` remains a separate diagnostic. Progression is supported only
while the ball is live; xG and goal delta remain event-history values. When an
opponent controls, possession is `-1` and attacking-side exit options retain the
old outcome-vector meaning of `0`.

## 4. Frozen candidate and run contract

The first census reuses the exact S7b state/candidate path:

- 120 matches, seeds 0–119;
- only fresh ordinary live passes;
- the existing S7b endpoint Pareto dominators;
- expected historical count: 509 chosen/alternative pairs;
- one structural clone per forced branch;
- no new target and no value comparison.

Command:

```text
npx tsx scripts/probes/counterfactual-oracle-v2.ts 120 0
```

The census reports the five-way partition, censor causes, transition latency,
support-mask coverage, physical-vs-macro disagreement and the concrete evidence
used for dead-ball classification. It does not recompute dominance.

## 5. Exact invariants

For every branch:

```text
N = intended + teammate + opponent + loose + dead + censored + forceFailure
other = 0
unresolved = 0
```

Controller conservation:

```text
intended → controller == target and same side
teammate → same side and controller != target
opponent → opposite side
loose / dead / censored / forceFailure → no authoritative controller
```

Lifecycle conservation:

```text
controlled → matching pass active before the step; owner exists after
loose      → matching pass active before, inactive after, owner null, playing
cap censor → matching pass remains active and no earlier transition exists
```

Post-control support holds iff the outcome has a stable controller. Unsupported
owner fields must remain null. Primary and diagnostic horizon ticks must lie in
their fixed half-open one-tick windows.

## 6. Stop rule

Do not proceed to S7e if any branch:

- satisfies two outcomes or needs a residual bucket;
- cannot identify stable control from the owner edge;
- needs macro possession to distinguish loose/interception;
- cannot distinguish football-law death from administrative truncation;
- is reclassified by a historical `lastCompletedPass`;
- fills unsupported owner values with zero;
- uses a result-dependent horizon;
- requires a `Match` modification to recover these events.

A material censor population must be reported, not hidden by lengthening the cap.
Even a clean v2-0 census only authorises the later replicated outcome-tree oracle;
it does not authorise S7e or a live pass consumer by itself.

## 7. Frozen 120-match result

The pre-registered command reproduced the exact historical candidate count:

```text
120 matches · seeds 0–119 · 509 chosen/alternative pairs
1018 branch records · 0 forced-pair failures
partition=yes · other=0 · unresolved=0 · conservation violations=0
```

| branch | resolved / censored / force | intended | teammate | opponent | loose | dead |
|---|---:|---:|---:|---:|---:|---:|
| chosen | 506 / 3 / 0 | 345 | 21 | 125 | 0 | 15 |
| alternative | 505 / 4 / 0 | 265 | 36 | 194 | 0 | 10 |

All seven censors were administrative boundary events: chosen had one halftime and
two fulltime censors; alternative had one halftime and three fulltime censors. All
25 dead transitions were concrete restarts. No horizon censor, identity loss or
residual lifecycle appeared; zero loose events is the observed outcome, not a
merged bucket.

Mean first-transition time was 0.702s for chosen and 0.776s for alternative.
Post-control snapshots were supported on exactly the stable-controller branches:
96.5% and 97.2%. The original nullable kick+3s capture was available for 98.8% of
both branches; transition+3s was available for 98.6% / 98.4%, with the shortfall
caused by match administrative termination rather than a result-dependent horizon.
The later Comparable V1 preflight absorbed the six early-fulltime records on each
branch to the same fixed kick+3s authority time, so primary payoff availability is
now 100% without changing the first-transition partition or choosing a shorter
horizon.

The support mask is not cosmetic. In the Comparable preflight, **317 chosen and 309 alternative
branches had no physical owner while macro possession still named a side**. They
retain raw `possession=null` and `exitOptionCount=null`, rather than silently
turning the macro label into physical possession or treating undefined options as
zero. A separate versioned `ComparablePassPayoffV1` projects these raw facts into
the total questions required by the replicated oracle; it does not overwrite the
raw record or read macro possession. Whenever a physical owner existed, its side
agreed with macro possession in this census.

The transition anatomy also confirms the reason S7 needs composition: compared
with chosen, the S7b alternatives reach their intended target much less often
(265 vs 345) and produce substantially more opponent-first stable control
(194 vs 125). Conditional next-state value cannot be interpreted as complete
action value without this transition layer.

Oracle v2-0 therefore passes its narrow semantics gate. The subsequent replicated
pilot also passed event/projection validity, but its two R=32 halves were not stable
enough (39/64 relation agreement; 3.222pp projected MC half-width). Its final suite
was consequently not run. No estimator, dominance claim or live consumer follows.

Repository gates also pass: TypeScript and the production build are clean; the
focused Oracle suite passes 21/21; the full suite passes **530/530 across 74 files**;
the default two-season fingerprint remains exactly
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.
Profiler-on/off determinism passes. The measured run was 5.34µs/step and 14.6
matches/s versus the frozen 5.32µs/step and 15.0 matches/s; the new code has no
production import, so this small wall-clock delta is recorded as run variance, not
a live-path allocation. The frozen perf JSON was restored after measurement.
