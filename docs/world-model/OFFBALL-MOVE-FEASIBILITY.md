# O1a — Move-to-point Clone Feasibility

Status: **PASS as an offline mechanism probe. No action-value or football payoff
claim.**

Date: 2026-07-21

## 1. Question

O1 is dormant and unit-tested. O1a asks whether the primitive can be used inside
a real cloned Match continuation without adding a Match hook, teleporting a body
or letting the normal brain overwrite the intervention. A real football event
may still terminate it:

```text
same frozen match
→ hold current world point
→ legacy supportSpot world point
→ one feasible forward / lateral / backward O0 point
→ real executor + physics + contacts for 1.5s
```

The probe measures movement only. It deliberately does not read goals, possession,
xG, pass selection or later chance creation.

## 2. Frozen pilot

Collect the first 64 deterministic attacking states in which:

* play is live with a stable carrier;
* one non-carrier outfielder currently has `SupportBallCarrier`;
* O0 has at least one onside, positive-opponent-margin point in each of the
  forward, lateral and backward sectors;
* at least two seconds of the match remain.

For each sector, choose the lowest self-ETA qualifying point, with candidate ID as
the deterministic tie-break. This is a feasibility choice, not an action-value
relation.

Each branch clones the same frozen Match, sets only:

```text
player.action = MoveToPoint(frozen target)
player.decisionTimer = Infinity
```

and runs 90 normal `Match.step(DT)` calls. `Infinity` is probe-local decision
suppression; it does not alter movement, ball physics or any other player.

The intervention ends immediately if the forced player becomes the physical
controller, play enters a dead-ball/restart phase, the player is removed, or the
slot is substituted. The probe must not restore `MoveToPoint` after any such
event. These are reported as interruptions; any other action replacement is an
unexplained hard failure.

## 3. Primary mechanism outcomes

Report per branch:

* target-closure rate and mean metres closed;
* final target distance;
* player path length;
* displacement in the local forward/lateral frame;
* mean hold-branch drift as the physical/separation control.

These are mechanism measurements. `closure` means only `final distance < initial
distance`; it is not success at football.

## 4. Hard gates

```text
frozen states                    = 64
clone/branch failures            = 0
deterministic rerun differences  = 0
targetPos changes while active   = 0
unexplained action changes        = 0
non-finite player states         = 0
direct position/velocity writes  = 0 by probe code
Match source changes             = 0
goals/possession/value reads      = 0
```

Physical-owner and phase reads are permitted only to classify the termination
of the intervention. They are not payoff inputs. Interruption counts are always
reported, and their paths remain in the all-state closure diagnostics rather
than being silently dropped.

At least one non-hold branch must alter the physical path relative to hold, and
each geometric sector must close its target in a majority of the 64 states. These
are falsification gates for a usable movement primitive, not a claim that every
candidate should be reached within 1.5s.

Instantaneous `speed / currentTopSpeed` is diagnostic, not a hard gate. In the
accepted integrator, stamina can lower the current speed envelope before existing
velocity has decelerated to it; contact correction can also change velocity. O1's
isolated unit test, not a live-state inequality, guards the no-boost boundary.

## 5. Stop rule

Stop before value research if the primitive requires:

* a new Match update hook;
* direct player-state writes after branch setup;
* target retiming or moving target coordinates;
* supernormal speed/acceleration;
* named action logic; or
* outcome-dependent candidate replacement.

Passing O1a authorises design of an offline payoff estimand. It still does not
authorise a live brain emitter.

## 6. Frozen result

The 64-state run at seed offset 20000 passed:

```text
frozen states                    64
clone failures                   0
deterministic rerun differences  0
target changes while active      0
unexplained action changes       0
non-finite states                0
completed interventions          319 / 320
became-controller interruptions  1
other interruptions              0
non-hold paths != hold           252 / 256
```

Two complete reruns produced the identical output hash
`95e3c3719d1a98b10c0c6e62cab726c21125b72796605b6a8aefc6b7ba8a6ae1`.

Target closure was 100% for forward, lateral and backward candidates and 90.6%
for legacy `supportSpot`. Mean final distances were 0.197m, 0.314m, 0.825m and
4.065m respectively. Hold drifted 0.150m under ordinary contacts/separation.

The first 64-state draft reported 81 target and 81 action violations. Source
audit showed these were repeated per-tick counts after one legitimate
`giveBall()` event changed the new controller to `Dribble`; the missing
`targetPos` was then incorrectly called target drift. The accepted probe does
not restore the forced action. It terminates and classifies that intervention at
the physical event, while unexplained action changes remain a hard failure.

The result establishes execution feasibility only: generic fixed points can
produce real forward, lateral and backward paths through the accepted movement
stack. It does not say which point should be chosen or that any observed path is
good football.
