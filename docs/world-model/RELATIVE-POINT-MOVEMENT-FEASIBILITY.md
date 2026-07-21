# R0a — Relative-point Clone Feasibility

Status: **PRE-REGISTERED. Offline mechanism only.**

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
