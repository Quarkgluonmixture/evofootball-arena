# R0b — Forward Relative-point Failure Audit

Status: **COMPLETE — KNOWN COMMIT FEASIBILITY GAP (offside). R0a remains failed.**

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

## 5. Frozen result

Two complete audit runs produced the identical output hash
`2ab810c7ba060e1e8cf9ffac5bca22e26f6d14cc5a010ca1bef3e1f47c160eb8`.
The default R0a output remained byte-identical at
`6327988d08ad444d57236d70aff85f2655957485fc5393d98b224e7e3a690bf3`.

```text
forward completed / closed / missed              51 / 45 / 6
audit records / failures                          51 / 0
pre-commit warning among closed                    4 / 45 (8.9%)
pre-commit warning among missed                    5 / 6 (83.3%)
misses warned by ETA / offside                     0 / 5
```

The static terminal distance was exactly 9m in every branch and required mean
speed was exactly 6m/s. Current-model reach did not distinguish the groups:

| group | mean ETA margin | mean terminal offside margin |
|---|---:|---:|
| closed | +0.195s | −6.012m |
| missed | +0.185s | **+2.209m** |

All six misses were predicted physically reachable within the 1.5-second
window. Five of them instead committed a terminal relation beyond the current
offside line, where the accepted common executor correctly clamps the mover's
target. Only one miss remained both statically reachable and onside.

## 6. Verdict

The pre-registered classification is:

```text
KNOWN_COMMIT_FEASIBILITY_GAP
```

More precisely, it is a **law/constraint feasibility** gap rather than a body
speed ETA gap. The raw symmetric relation was mechanically representable, but
its caller did not ask whether the implied terminal state was legal under the
same onside discipline that would execute it.

This does not retroactively pass R0a. Adding an onside filter now would select
away five observed misses after the result and violate the stop rule. The audit
only banks a future design requirement: any genuinely new relative-affordance
contract must treat endpoint legality as an input before commitment, while
leaving the one remaining onside miss as honest dynamic failure. No candidate,
filter, live action, overlap migration or payoff work is authorised here.
