# E4 — Emergent Central-arrival Census

Status: **PRE-REGISTERED. Telemetry only; no live change.**

Date: 2026-07-21

## 1. Question

The live baseline explicitly assigns `team.arriver` when possession enters a
wide attacking channel, and `MakeRun` routes that player toward the central
edge-of-box arc. E4 asks whether the underlying movement is already possible
without that named authority:

> After a team enters a wide attacking channel, do teammates who start outside
> the central arrival zone ever move materially into it without being licensed
> as `team.arriver`?

“Central arrival” is a post-hoc trajectory label only. It is not a run action,
role, target, gene, score or delivery instruction.

## 2. Frozen episodes

Run 120 deterministic five-minute matches from seed offset 34,000 with ordinary
random teams.

A wide-channel event starts on the first post-step snapshot of a false→true
transition:

```text
phase == playing
stable outfield owner exists
owner team local ball x > HALF_L - 21m
|ball y| > 10m
```

The trigger must become false before another event may start. Events may remain
in observation after the ball leaves the channel because the arrival is meant
to serve the next delivery. Each event lasts at most 4.0 seconds and ends early
on opponent stable control, dead ball or match end.

At event start, create one episode for every active same-team outfielder other
than the carrier who is not already inside the arrival zone. Identity is
`match:event:mover`; each starts and closes exactly once.

## 3. Geometry-only classification

In the attack frame, define the central arrival zone:

```text
HALF_L - 20m <= local x <= HALF_L - 10m
|y| <= 7m
```

An episode succeeds at its first post-step snapshot satisfying:

```text
mover is inside the arrival zone
integrated mover path since trigger >= 3.0m
```

This includes forward, inward and diagonal arrivals; no role or route is
privileged. Record start/end local x/y, forward/lateral displacement, path and
time.

At every episode tick record exposure to:

* `team.arriver === mover.index`;
* `team.runners` or `team.overlapper`;
* `MakeRun` or `SupportBallCarrier`;
* a live `wallRun`.

The primary natural stratum is `arriver exposed = false`. A strict stratum with
none of these authorities is diagnostic.

## 4. Outputs and gates

Report event and mover-episode conservation, termination anatomy, arrivals per
match/match coverage, licensed versus unlicensed arrivals, strict arrivals,
post-hoc roles and trajectory distributions.

```text
matches                                      = 120
episode start/close conservation             exact
duplicate identities                         = 0
non-finite facts                              = 0
unfinished episodes                          = 0
central-arrival trajectories                 >= 10
arriver-unlicensed trajectories              >= 5 across >= 5 matches
same-seed complete output                     byte-identical
production source changes                     = 0
```

Strict-clean count and pass/shot/goal outcomes are not gates.

## 5. Stop rule

If unlicensed arrival is absent or vacuous, retain the named baseline. Do not
widen the trigger, enlarge the zone, reduce path length, add an `ArriveForCutback`
action or change player roles after observing the result.

If unlicensed trajectories exist, bank only primitive coverage. Do not infer
payoff, ideal frequency, delivery choice or script retirement. Any later
movement-intent, transition payoff, live selection or migration needs a separate
contract.
