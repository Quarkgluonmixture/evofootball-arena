# C-AC0 — Coupled Arrival/Contact Race Ceiling

Status: **COMPLETE — PASS. Observer-grounded narrowphase contract authorised;
no live authority.**

Date: 2026-07-22

## 1. Why this is the next authority

The defensive local-process branch is closed. D-COVER and D-LANE showed that a
receiver endpoint and a pointwise corridor ETA do not reliably predict actual
first control. A0 separately showed that kick-time relative arrival speed is
not a useful single residual feature. T0b and T0b-R already exhausted the
current transition-estimator family.

The remaining causally different question is not another feature:

> If the existing cheap corridor query supplies only a broad candidate set,
> does running those candidates through the real fixed-step locomotion, moving
> ball, oriented access, screening, first contact and delayed control process
> explain actual intended reception versus opponent interception materially
> better than the corridor query alone?

C-AC0 is an oracle ceiling for that coupled process. It does not create a live
predictor or change any football behaviour.

## 2. Frozen ecology

```text
fresh match seeds                    68000..68119
matches                              120
match duration                       240 seconds
actions                              actually selected ordinary ground passes
candidate generator                  unchanged live generator
administrative clearance            5 seconds
```

Immediately before a decision-ready stable owner acts, freeze the Match. Keep a
record only if that action creates an ordinary pending pass to the frozen
target. The target must be an active non-GK. Eligibility may not read a future
transition or race result.

Every accepted record keeps three views of the same kick state:

1. the unchanged Oracle-v2 branch with normal continuation;
2. the existing corridor broadphase;
3. the coupled race arm below.

All five Oracle-v2 outcomes remain in the conservation ledger. The primary
comparison is pre-registered on records whose actual outcome is either
`intendedReception` or `opponentInterception`; teammate recovery, loose and dead
are reported and count as incorrect coupled predictions rather than being
silently reassigned.

## 3. Frozen broadphase baseline

Use an oracle-truth `PerceptionSnapshot` only because this is a physical ceiling,
not an observer audit. For every active non-GK opponent, run the existing
`evaluatePassCorridorInterception()` on the same intended ordinary pass.

A player enters the broadphase race set iff the existing corridor fact reports:

```text
strongestMargin >= 0
```

The intended target always enters. No margin, distance, participant count or
observation threshold is added or fitted.

The baseline binary prediction is:

```text
any opponent in broadphase set → opponent
otherwise                      → intended target
```

## 4. Coupled race arm

Clone the same frozen Match and force the exact same pass before changing any
action. The kick therefore consumes the same RNG path and creates the same
pending-pass identity as the normal branch.

After the kick, only inside this probe clone:

* intended target receives existing `ReceivePass`;
* every other broadphase participant receives existing `InterceptPass`;
* passer and non-participants receive existing `HoldPosition`;
* all PlayerBrains and TeamBrains are disabled for the bounded race;
* no position, velocity, heading, desired velocity, stamina, speed, action
  target, contact rule or ball state is written by the probe.

Then run ordinary `Match.step(DT)`. First-transition authority is the unchanged
Oracle-v2 ordering:

```text
law-dead → first stable owner → pending-pass-ended loose → censor
```

The arm therefore composes, without reimplementing them:

```text
Player.physicsStep
ground-ball fixed ticks
oriented directBallAccess + screening
simultaneous M3 claims
contact impulse
three-tick pending control
actual first-touch attempt
```

This is deliberately a ceiling, not a proposed live action policy. All players
chasing a candidate corridor is not authorised gameplay.

## 5. Primary estimand

For actual binary direct contests, map the coupled outcome as:

```text
intendedReception       → intended
opponentInterception    → opponent
teammate/loose/dead     → incorrect for that actual label
censored/forceFailure   → validity failure
```

Compute intended recall and opponent recall for baseline and coupled arms, then:

```text
balancedAccuracy = (intendedRecall + opponentRecall) / 2
```

Frozen PASS gates:

```text
actual binary records                         >= 5,000
coupled resolved transitions                  >= 95% of accepted records
baseline and coupled finite predictions       = 100%

coupled balanced accuracy                     >= 60%
coupled - baseline balanced-accuracy edge      >= +5 percentage points
coupled intended recall                       >= 50%
coupled opponent recall                       >= 50%
```

## 6. Required mediators

```text
baseline/coupled predictions differ           >= 10% of binary records
on changed records:
  coupled correct - baseline correct           >= +10 percentage points

actual opponent rate when coupled says opponent
  - actual opponent rate when coupled says intended
                                                >= +15 percentage points

at least 10% of coupled transitions contain an
actual first-contact → delayed-control interval
```

Also report full five-class actual/race tables, exact-controller identity
agreement, broadphase participant counts, contact counts, control-delay ticks,
and teammate-recovery predictions. These are diagnostics and do
not replace the primary gates.

## 7. Exact validity

```text
matches represented                           = 120
duplicate pass identities                     = 0
normal Oracle force failures                  = 0
coupled force failures                        = 0
transition conservation failures              = 0
administrative censors                        = 0
frozen Match mutation by either query          = 0
query-caused Match RNG draws                   = 0
kick-state / kick-RNG mismatch between arms    = 0
TeamBrain firings in coupled arm               = 0
PlayerBrain firings in coupled arm             = 0
new action types                               = 0
probe targetPos writes                         = 0
probe player/ball physical writes after kick   = 0
non-finite fields                              = 0
outcome-dependent eligibility                  = 0
```

Two complete runs must emit byte-identical canonical JSON and SHA-256. The
production fingerprint must remain
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.

## 8. Stop and authority

C-AC0 fails and closes this coupled-race attempt if any validity, support,
primary or mediator gate fails. Do not add participants, change the zero-margin
broadphase, let brains re-decide, tune action cadence, replace HoldPosition,
extend the transition cap, merge outcomes, fit probabilities or add a scalar
readiness score after seeing the result.

PASS authorises only a separately pre-registered observer-grounded narrowphase
representation contract. It does not authorise production imports, live pass
selection, defensive assignment, PlayerBrain/TeamBrain removal, payoff,
evolution, genes or a visual sandbox.

## 9. Frozen result

Two full 120-match runs were byte-identical:

```text
matches represented                         120 / 120
ordinary passes accepted                   8845 / 9711
actual intended/opponent binary records          8223

corridor baseline balanced accuracy              64.1%
  intended recall / opponent recall         46.2% / 81.9%

coupled race balanced accuracy                    87.2%
  intended recall / opponent recall         97.4% / 77.0%
coupled - corridor edge                           +23.2pp

different predictions                     3827 / 8223 (46.5%)
correct on changed records:
  corridor → coupled                         6.7% → 92.6%
actual-opponent separation                         84.9pp

delayed first-contact/control intervals     8609 / 8845
exact first-controller identity agreement          91.9%
report sha256 1780f0278576bb921c969ef68abdbe56581cf765700578724406d349bf815db9
```

Every support, primary, mediator and exact-validity gate passed. The kick and
RNG state were identical between arms; queries did not mutate the frozen Match
or consume RNG; all transitions conserved controller identities; the coupled
arm had no brain/coordination publication, new action vocabulary or target
write; and all records resolved without censor or force failure.

The result is not evidence that all players should chase corridor points in
live football. It establishes a narrower fact: the existing corridor query is
a useful broadphase, but the decisive narrowphase is the coupled execution of
movement, actual ball ticks, oriented access/screening, contact and delayed
control. A point ETA cannot safely stand in for that process. The next authorised
work is only to determine whether the same narrowphase signal survives honest
observer-specific inputs without consulting global truth.
