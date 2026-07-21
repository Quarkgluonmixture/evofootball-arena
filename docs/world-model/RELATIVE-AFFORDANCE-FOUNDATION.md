# R1 — Relative-affordance Foundation

Status: **R1 DORMANT REPRESENTATION COMPLETE. R1a STOPPED: core prediction
gates passed, but the frozen completed-branch coverage gate failed 187<192.
No candidate set or live selector authorised.**

Date: 2026-07-21

## 1. Authorised question

R0 proved that the executor can follow a fixed relation to a moving player.
R0a failed its forward-axis gate; R0b then showed that five of six misses had
committed a future target already beyond the offside line. The user has now
authorised the causally new next question:

> Before committing to a relation with a moving teammate, can an agent
> represent where that relation will be, whether it can arrive in time, whether
> the endpoint is onside/in bounds/allowed, and whether another teammate is
> already occupying the same offer?

The query must not know whether the realised motion would later be called an
overlap, underlap, check-back, third-player run, box arrival or defensive cover.

## 2. R1 representation

Add one pure dormant module with a generic reference intent:

```ts
interface RelativeReferenceIntent {
  referenceGid: number;
  targetPoint: V2;
  arrivalTime: number;
}
```

`targetPoint` is a shared/predicted teammate endpoint supplied by the prediction
or communication layer. R1 does not decide that endpoint and does not infer a
football task from it.

For one mover, carrier, reference intent and fixed attack-frame offset, expose
separate facts:

```text
reference start and intended endpoint
derived future relation point
self ETA and arrival slack
current and projected offside lines/margins
physical-pitch margin
opposing-box intrusion when the phase bars entry
fixed-point O0 access facts
existing O3 same-carrier commitment/occupancy facts
```

Exact booleans may state:

```text
reachable by intent horizon
inside physical pitch
projected onside
allowed by the supplied barred-area state
```

They remain separate. R1 must not emit an aggregate score, preference,
`committable` authority or pattern label. A later probe may pre-register their
conjunction as an experimental eligibility gate; production code may not.

## 3. Prediction boundary

The reference's intended endpoint is explicit input. Other moving bodies use
the already accepted short-horizon `predictObservedPosition()` projection.

The projected offside line is the maximum of:

```text
projected second-last active opponent
projected carrier/ball locus
halfway
```

If the reference is the stable carrier, its supplied intent endpoint is the
projected ball locus. Otherwise the carrier uses its observed motion. Current
and projected lines are both exposed; R1 does not claim the projection is a
future law event or that a pass will occur at the horizon.

The offside fact is role-neutral and uses the law line, not the executor's
role-specific hold depth. Any resulting near-line false positive remains honest
validation evidence.

Missing carrier ownership, mover/reference identity, reference observation,
physical profiles, defence, finite endpoint/horizon or O3 facts returns null.
An out-of-pitch endpoint is a valid negative fact, not missing data.

## 4. R1 focused gates

Tests must prove:

1. attack-direction mirroring changes only the attack-frame x transform;
2. changing only the reference intent changes the future relation point;
3. changing opponent velocity changes projected but not current offside facts;
4. faster mover physics improves ETA/slack at identical geometry;
5. outside-pitch and barred-box endpoints remain represented as exact negative
   facts rather than being silently clamped or dropped;
6. existing O0 point-access and O3 occupancy facts survive without a score;
7. own/reference/carrier identity, malformed input and missing defence/profile
   facts are rejected;
8. inputs are immutable and repeated evaluation is deterministic;
9. no PlayerBrain, TeamBrain or Match producer imports or emits R1;
10. full tests, TypeScript/build and production fingerprint remain green.

Passing R1 authorises only R1a below.

## 5. R1a fresh clone validation

Use the first 64 valid states, at most one per independent five-minute match,
from seed offset **36,000**, scanning at most 128 seeds.

A valid state has live play, a stable outfield carrier using ordinary
`Dribble`, and two other active same-team outfielders. Choose the first
deterministic gid-ordered reference/mover pair whose **reference** intent target
stays inside the existing two-metre pitch inset. Do not pre-filter any relative
terminal endpoint by offside, pitch, reach or result.

Define the reference motion direction from its current physical motion:

```text
speed >= 1m/s → normalised current velocity
otherwise      → current body direction
```

Its immutable shared intent is 5m along that world direction with a 1.5s
horizon. Freeze the mover's current attack-frame relation to the reference and
create the same four symmetric perturbations as R0a:

```text
forward  (+4m,  0m)
backward (-4m,  0m)
lateral+ ( 0m, +4m)
lateral- ( 0m, -4m)
```

Before execution, evaluate every branch through R1 using an oracle perception
snapshot and empty O3 commitments. The probe-only eligibility conjunction is:

```text
reachableByIntent
AND insidePhysicalPitch
AND projectedOnside
AND barredAreaAllowed
```

All branches execute regardless of eligibility:

```text
carrier   HoldPosition
reference MoveToPoint(shared intent endpoint)
mover     TrackRelativePoint(reference, immutable offset)
```

Run 90 ordinary `Match.step(DT)` ticks. Stop a branch on the same phase,
control, removal or intervention changes as R0a. No position, velocity, speed,
heading, ball, possession or physics write is allowed.

## 6. Frozen R1a outcomes and gates

For every branch record the complete R1 facts plus actual initial/final target
error, target/reference displacement identity, reference motion, endpoint
actual offside line and termination cause.

```text
independent frozen states                         = 64
successful completed branches                    >= 192 / 256
eligible completed branches per axis              >= 24
eligible target-closure rate per axis             >= 90%
eligible target-closure rate overall              >= 92%
retained actual closures                          >= 70%
ineligible completed branches                     >= 8
reference moves >= 3m in completed branches       >= 90%
action/offset/reference/intent changes              = 0
clone/determinism/identity/non-finite failures      = 0
same-seed complete output                           byte-identical
production fingerprint                             unchanged
```

Target closure retains R0a's definition:

```text
final distance to live relative target < initial distance
```

`retained actual closures` means eligible-and-closed divided by all completed
closed branches. This prevents a formally precise gate that discards most
working relations. Report every axis separately; other axes cannot hide a
forward failure.

Current/projected/actual offside-line error, rejected-branch closure and O0/O3
facts are diagnostics. They cannot rescue a failed primary gate.

## 7. Stop rule

Stop and retain only dormant R0/R1 if any gate fails. Do not:

* reuse the 32,000 sample or delete R0a misses;
* change the 4m relation, 5m reference motion or 1.5s horizon;
* widen the line margin, add role-specific hold depth or lower closure gates;
* choose another reference direction after seeing results;
* turn projected offside into a hidden speed boost or target clamp;
* add a named run, role preference, gene, score or task;
* infer pass payoff, delivery choice or script retirement;
* wire PlayerBrain, TeamBrain, Match or saves.

Passing R1a would bank only a generic, legality-aware relative-affordance
representation. A candidate set, observer-specific use, transition payoff,
task allocation, live selection and migration each need later contracts.

## 8. R1 representation result

R1 landed at the registered dormant boundary in `ai/relativeAffordance.ts`.
It accepts one explicit generic reference intent and fixed relation, then
returns separate reach, current/projected offside, pitch, barred-box, O0 access
and O3 occupancy facts. It contains no score, `committable` field, tactical
name, offset preference or live consumer.

Seven focused R1 tests plus the existing O0/O3/R0 suites pass (37 focused tests
in total). Full single-worker regression, build and fingerprint are green:

```text
test files / tests     79 / 570
production fingerprint 57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673
```

Import/construction search finds no PlayerBrain, TeamBrain or Match emitter.
R1 therefore authorises only the already-frozen R1a fresh clone validation.

## 9. R1a frozen result

Two complete runs were byte-identical:

```text
sha256 11c5efd37743110f364632715ba421cb07406fa7698844078443ec27dd3a947d
```

Every representation and execution validity invariant passed:

```text
frozen states / scanned independent seeds        64 / 64
query / clone failures                             0 / 0
determinism differences                               0
action / offset / reference / intent drift      0 / 0 / 0 / 0
target-displacement identity / non-finite         0 / 0
reference moved >=3m                         187 / 187
```

The eligibility mediator retained working relations rather than deleting them:

| axis | completed | eligible | eligible closed | all closed |
|---|---:|---:|---:|---:|
| forward | 47 | 29 | **29/29 (100%)** | 39/47 |
| backward | 46 | 44 | **44/44 (100%)** | 46/46 |
| lateral+ | 47 | 42 | **40/42 (95.2%)** | 45/47 |
| lateral− | 47 | 28 | **28/28 (100%)** | 45/47 |

```text
eligible closure overall                 141 / 143 (98.6%; gate >=92%)
retained actual closures                 141 / 175 (80.6%; gate >=70%)
ineligible completed branches                         44 (gate >=8)
eligible completed per axis                    28–44 (gate >=24)
```

All causal precision/retention gates passed. However, only **187/256** branches
completed the full 1.5-second intervention, below the frozen minimum of 192.
Sixty-eight branches ended when the carrier lost stable control and one ended
on dead ball/restart. The result therefore fails the pre-registered coverage
gate even though the observed eligible subset was 98.6% precise.

## 10. Verdict

R1 remains a valid dormant world-model fact: knowing teammate intent, mover
reach and projected constraints can distinguish maintainable relative movement
without a named pattern. R1a does **not** authorise a relative candidate set or
live selection because its required full-horizon sample coverage was not met.

Do not enlarge the sample, ignore control-ended branches, lower 192, shorten the
horizon or rerun with another carrier-hold rule. Those would adapt the experiment
after seeing the result. The honest banked result is:

```text
representation/mechanism evidence: strong
pre-registered R1a verdict: FAIL — insufficient completed-branch coverage
production authority: dormant R1 only
```
