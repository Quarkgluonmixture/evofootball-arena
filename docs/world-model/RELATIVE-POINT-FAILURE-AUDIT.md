# R0b — Forward Relative-point Failure Audit

Status: **PRE-REGISTERED. Read-only diagnosis; R0a remains failed.**

Date: 2026-07-21

## 1. Question

R0a's forward relation missed target closure in 6/51 otherwise completed
branches. R0b distinguishes two causes without retrying the mechanism:

```text
A. known-at-commit infeasibility
   the terminal relation was already beyond current static reach and/or offside

B. joint dynamic failure
   the terminal relation looked statically reachable and onside, but following
   the moving reference through live constraints still diverged
```

Neither result changes R0a's failed verdict or its 90% gate.

## 2. Frozen audit

Rerun the exact 64 states, four branches, reference motion and 90 ticks:

```text
npx tsx scripts/probes/relative-point-move-feasibility.ts 64 32000 audit
```

Default R0a output must remain byte-identical to
`6327988d08ad444d57236d70aff85f2655957485fc5393d98b224e7e3a690bf3`.

For the forward branch only, compute at the frozen pre-commit snapshot:

* the exact terminal world target implied by the immutable reference target and
  relative offset;
* current-model `estimateReach()` ETA for the mover to that terminal point;
* `1.5s - ETA`;
* terminal target local-x minus the current offside line;
* straight-line distance and required mean speed.

Attach those read-only facts to the completed branch's actual closure result.
Do not change the target, offset, reference path, action, horizon or physics.

## 3. Classification

Define a pre-commit warning:

```text
static ETA > 1.5s OR terminal offside margin > 0
```

Among the six frozen non-closing completed branches, classify:

```text
KNOWN_COMMIT_FEASIBILITY_GAP
  at least 5/6 misses warned
  AND at most 20% of closing branches warned

JOINT_DYNAMIC_RELATION_GAP
  at least 5/6 misses did not warn

MIXED_OR_UNRESOLVED
  otherwise
```

Report ETA/offside contingency and closing/non-closing distributions. This is
failure anatomy, not a candidate selector calibration.

## 4. Validity and stop rule

```text
same 64 states / 203 completions / 51 forward completions
same six forward non-closures
audit records                                    = 51
audit/non-finite failures                         = 0
default R0a hash unchanged
Match/AI/action/physics changes                    = 0
```

R0b may only narrow the blocker. It cannot authorise a candidate set, filter,
new reach coefficient, offside exception, smaller offset, shorter reference
move, live emitter, overlap migration or another R0a run.
