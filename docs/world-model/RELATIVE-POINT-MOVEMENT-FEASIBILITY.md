# R0a — Relative-point Clone Feasibility

Status: **COMPLETE — FORWARD AXIS FAILED; stopped.**

Date: 2026-07-21

## 1. Question

R0 can derive a moving world target from a reference player and a fixed
attack-frame offset. R0a asks whether that dormant relation survives real
`Match.step()` composition:

> While one teammate moves through ordinary `MoveToPoint`, can another teammate
> close a fixed relative offset through `TrackRelativePoint` without target
> mutation, direct physics writes or a named football instruction?

This is execution feasibility, not evidence that any relative offset is useful.

## 2. Frozen sample

Scan at most 128 independent five-minute match seeds beginning at 32,000 and
accept the first 64 states, at most one state per seed, satisfying:

* live play with a stable outfield owner using ordinary `Dribble`;
* at least two other active same-team outfielders;
* a deterministic lowest-gid reference/mover pair for which the reference's
  world target, and all four relative target endpoints, stay inside the pitch's
  existing two-metre candidate inset.

The reference world target is exactly 5m attack-forward from its frozen
position. The carrier holds through the existing `HoldPosition` action.

## 3. Symmetric relations

Express the mover's frozen current relation to the reference as:

```text
base.x = attackDir × (mover.x - reference.x)
base.y = mover.y - reference.y
```

Create exactly four branches, in fixed order:

```text
forward  base + (+4m,  0m)
backward base + (-4m,  0m)
lateral+ base + ( 0m, +4m)
lateral- base + ( 0m, -4m)
```

These labels describe axes only. No branch is preferred, scored or associated
with an overlap/check/drop role.

From the same frozen clone:

```text
carrier    HoldPosition
reference  MoveToPoint(reference start + 5m attack-forward)
mover      TrackRelativePoint(reference gid, fixed branch offset)
```

Freeze only those three decision timers. Run 90 normal `Match.step(DT)` ticks.
Do not write position, velocity, heading, speed, acceleration, ball or possession.

## 4. Outcome and validity

For each branch record:

* start/end reference position and distance to its immutable target;
* start/end mover distance to the derived moving relative target;
* reference displacement and relative-target displacement;
* actor/reference/action/offset identity each tick;
* phase/control/removal attrition;
* non-finite facts and determinism rerun parity.

The moving-target identity requires, to numerical equality:

```text
relative-target displacement == reference displacement
```

Coverage and mechanism gates:

```text
independent frozen states                         = 64
successful branches                              >= 192 / 256
reference moves >= 3m in completed branches      >= 95%
mover ends closer to moving target                >= 90%
target/reference/action/offset changes             = 0
direct player/ball state writes                    = 0 by construction
clone/determinism/non-finite failures              = 0
same-seed complete output                           byte-identical
production fingerprint                             unchanged
```

Report each axis separately; an aggregate pass cannot hide one direction with
zero completion or systematic divergence.

## 5. Stop rule

Stop without candidate or live work if the actor cannot follow the moving
relation inside current movement limits, if a branch requires special speed or
physics, if the target/offset must be retimed, or if validity/coverage fails.

Passing authorises only a later representation-only symmetric relative-candidate
set. It does not authorise a live emitter, offset preference, task commitment,
off-ball selector, overlap migration, payoff probe or play-test build.

## 6. Frozen result

Two complete runs produced the identical output hash
`6327988d08ad444d57236d70aff85f2655957485fc5393d98b224e7e3a690bf3`.

### Validity and attrition

```text
independent frozen states / scanned seeds       64 / 64
completed branches                             203 / 256
control-ended attrition                         53 / 256
clone / determinism failures                     0 / 0
action / offset / reference drift                0 / 0 / 0
moving-target identity / non-finite failures     0 / 0
```

The transform and composition were exact: every derived target moved by the
same vector as its reference, and all interventions remained immutable.

### Per-axis result

| axis | completed | reference moved ≥3m | mover ended closer | mean final error |
|---|---:|---:|---:|---:|
| forward | 51 | 50/51 (98.0%) | **45/51 (88.2%)** | 1.796m |
| backward | 51 | 49/51 (96.1%) | 50/51 (98.0%) | 1.060m |
| lateral+ | 50 | 50/50 (100.0%) | 50/50 (100.0%) | 1.021m |
| lateral− | 51 | 49/51 (96.1%) | 51/51 (100.0%) | 0.697m |

Across all axes, references moved at least 3m in 97.5% of completed branches
and movers closed the moving target in 96.6%. Those aggregate numbers do not
override the frozen per-axis rule. The forward relation closed in only 88.2%,
below the required 90%; six forward cases finished the full intervention yet
ended at least as far from the target as they started.

## 7. Verdict

R0's dormant vocabulary remains valid, but R0a does **not** authorise a symmetric
relative-candidate representation. A raw fixed offset that moves forward with
another already-moving player can outrun the actor under current speed,
acceleration, onside and avoidance constraints. The other axes cannot average
that failure away.

Do not lower the forward gate, shorten the reference move, reduce the offset,
add speed or filter these same branches after observing the result. A future
re-entry would need a genuinely new mover+reference recoverability model that
predicts whether a relation is dynamically maintainable before commitment. That
is a new reachability/inference contract, not R0a-2, and is not authorised here.
No live emitter, candidate set, task allocation, overlap migration or play-test
build follows from this result.
