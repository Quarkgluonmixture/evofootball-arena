# D-COVER-0 — Decentralised Defensive Cover Handoff Lab

Status: **COMPLETE — FAIL at frozen H1/H3 gates; no live sandbox or ecology authorised.**

Date: 2026-07-22

Verification at the frozen result commit:

* typecheck and production build pass;
* focused defensive-coordination tests: `10/10` pass;
* full suite: `613/614` pass on the first parallel run; the sole failure was an
  unchanged careers test hitting its existing 20-second timeout while the
  worker pool was saturated;
* the required isolated retry passes `9/9` in `37.79s`, including the timed-out
  determinism case in `7.06s`;
* default football fingerprint remains
  `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.

## 1. Why this is the next cut

EOR-0 showed that an attacking mover rarely changes another attacker's embodied
world because the current commander hardly reacts. DDD-0 then showed that when
one defender is allowed to execute symmetric generic movements, a real
one-body dilemma appears:

```text
one outlet closes
→ another outlet opens
→ real pass/contact/control outcomes sometimes cross over
```

That is an atomic capacity fact, not a complete model of defending. Real
pressure is sustained by several bodies whose functional responsibilities
rotate as the ball and team-mates move. The missing causal fact is therefore:

```text
I observe that a team-mate has committed to move here by this time
+ I can predict which outlet/corridor his body will occupy
→ the locally exposed alternative becomes different for me
```

D-COVER-0 adds and tests that fact as one bounded multi-layer composition:

```text
observer-specific snapshot
→ generic defender movement candidates
→ short-lived team-mate movement commitment
→ separate two-outlet cover facts
→ two real Player.physicsStep locomotions
→ forced-pass Oracle-v2 first transition
```

It does not name a presser, cover player or balancing player. Those descriptions
may be applied only after a trajectory has occurred.

## 2. Hypotheses

### H1 — shared intent is informative

Within the same frozen state, distinct legal movements by defender D1 should
create materially different exposed-outlet facts for defender D2. At least some
states must contain both directions of demand:

```text
one D1 commitment makes A the relatively exposed outlet
another D1 commitment makes B the relatively exposed outlet
```

Without D1's commitment, D2's own initial snapshot is identical across those
counterfactuals. Therefore no single commitment-blind answer can represent both.

### H2 — a physical two-body handoff exists

When a D1 movement improves access to one outlet while exposing the other, at
least one legal D2 movement must improve access to the exposed outlet through
normal locomotion, without moving D1, either attacker or the ball after the
intervention is fixed.

### H3 — the handoff reaches football outcomes

For a supported subset, changing only D2's legal response behind the same D1
commitment must change the two-outlet Oracle-v2 first-transition tensor. This is
mechanism evidence, not a universal payoff or defensive score.

## 3. Frozen experiment

```text
states                         64
match seed range               62000..62127
match duration                 240 seconds
sampling cadence               1 second
minimum match time             10 seconds
administrative clearance       8 seconds
awareness                      0.8
movement window                0.75 seconds
Oracle replicates              4 per outlet/response world
```

Every accepted state has:

* one live non-GK carrier;
* two observable attacking outlets A and B;
* one deterministic, outcome-blind short A movement selected from the existing
  O0 surface by a state-keyed index;
* two observable non-GK defenders D1 and D2;
* hold plus at least six symmetric 0.75-second generic movement candidates for
  each defender.

D1 is the observed defender with the lowest arrival time to A's target. D2 is
the remaining observed defender with the lowest minimum arrival time to A or B.
These identities are probe metadata only. Nothing is written to TeamBrain,
marks, chasers, PlayerBrain, genes or saves.

All state discovery and defender selection use `PerceptionSnapshot`, not truth
coordinates. Known physical reach profiles remain the same S1 authority used by
the accepted affordance probes. Capturing snapshots must consume zero Match RNG.

## 4. Shared movement commitment

D-COVER-0 introduces one pure, dormant fact:

```ts
interface DefensiveMovementCommitment {
  playerGid: number;
  observedCarrierGid: number;
  targetPoint: Readonly<V2>;
  arrivalTime: number;
  expectedBodyDir: Readonly<V2>;
  committedTick: number;
  validUntilTick: number;
}
```

It records an already chosen movement; it does not choose one. It grants no
priority, collision right, speed, tackle authority, mark, chase assignment or
possession right.

For every D2 candidate, a pure evaluator returns separate facts only:

* D2 arrival to A and B;
* committed D1 arrival to A and B;
* each body's projected distance to carrier→A and carrier→B corridors;
* target, bearing and arrival-time separation between D1 and D2;
* which outlet is relatively more exposed by D1, or `null` on an exact tie;
* snapshot/commitment age and support status.

No aggregate coverage score, task demand, capacity, winner, action name or
football role exists. The query must not call `directBallAccess`: that function
answers actor→current-ball contact, not future pass-corridor occupation.

## 5. Physical arms

For each D1 candidate and every D2 candidate, clone the same frozen state and
execute:

```text
carrier      HoldPosition
A            MoveToPoint(frozen O0 target)
B            HoldPosition at its frozen point
D1           MoveToPoint(frozen D1 target)
D2           MoveToPoint(frozen D2 target)
all others   unchanged existing brains
```

The four logical comparisons are derived from the same enumerated surface:

```text
H  D1 hold + D2 hold
S  D1 moves + D2 hold
R  D1 moves + D2 moves
C  the same R world annotated only by D1's shared commitment facts
```

`C` cannot change physics relative to `R`; exact signature equality is required.
Its purpose is to prove that the shareable fact identifies which physical R
responses complement which D1 movement. There is deliberately no selector.

After the 0.75-second movement window, every completed response world is tested
with the unchanged Oracle-v2 forced ordinary pass to A and B. Four deterministic
child streams are paired across response worlds. First transition remains the
only transition authority.

## 6. Handoff definitions

All thresholds are frozen before the first run.

### D1 creates a one-body dilemma relative to hold

A non-hold D1 response must improve its arrival to one outlet by at least
`0.10s` and worsen its arrival to the other by at least `0.10s`, relative to
D1-hold in the same D2-hold world. The improved outlet is the **occupied** outlet;
the worsened outlet is the **exposed** outlet. These words are telemetry only.

### D2 completes a physical handoff

Relative to D2-hold under the identical D1 response, a non-hold D2 response must:

* improve D2 arrival to the exposed outlet by at least `0.10s`;
* make at least `0.25m` more progress toward its fixed target than the same
  candidate would receive from the D2-hold world;
* keep every intervention target and action unchanged for the whole movement
  window.

No total coverage score is calculated. Both outlet arrival facts remain in the
record.

### Coupled transition handoff

For the same D1 response, compare D2-hold with a physical handoff response. A
transition handoff exists when defender first-control probability on the exposed
outlet improves by at least `0.25` and defender first-control probability on the
occupied outlet does not fall by more than `0.25`. With four replicates these are
one-replicate exact steps, not fitted coefficients.

## 7. Primary gates

### Exact validity

```text
accepted states                         = 64
force failures                          = 0
snapshot Match-RNG changes              = 0
commitment physics changes (R vs C)      = 0
action/target mutations                  = 0
non-finite facts                         = 0
clone/identity failures                  = 0
child-seed collisions                    = 0
deterministic rerun differences          = 0
order-dependent classifications          = 0
Match/brain/gene/save consumers added    = 0
```

### Support and execution

```text
completed two-defender branches          >= 70%
Oracle opportunity support               >= 90%
D1/D2 target progress                     >= 90%
valid shared commitments                  >= 90%
```

### H1 — informative shared intent

```text
states with both exposed-outlet directions >= 24 / 64
supported D1 dilemmas                       >= 35% of non-hold D1 responses
```

### H2 — physical handoff

```text
D1 dilemmas with at least one D2 handoff   >= 50%
states with physical handoff                >= 40 / 64
```

### H3 — real transition consequence

```text
physical handoffs with transition effect   >= 10%
states with transition handoff              >= 16 / 64
```

H1, H2 and H3 are separate. A failure cannot be hidden by averaging them.

## 8. Exact-zero anti-script gates

```text
named press/cover/balance role enums      = 0
fixed first/second/third defender state   = 0
central demand publication                = 0
marks/chasers copied into commitment      = 0
aggregate coverage/utility score          = 0
learned/static response selector          = 0
outcome-aware candidate construction      = 0
directBallAccess semantic changes         = 0
swept-contact changes                      = 0
live behaviour changes                     = 0
```

## 9. Stop rule and authority

D-COVER-0 fails and stops without threshold tuning if:

* shared intent rarely changes which outlet is exposed;
* two bodies merely converge on the same outlet and cannot complete a physical
  handoff;
* handoffs exist only in arrival geometry but do not change real transitions;
* the result needs a named role, central publisher, coverage scalar, extra
  movement authority, contact change or outcome-aware selector;
* observer-specific snapshots cannot support the representation.

Passing authorises only:

1. a default-off visual sandbox contract using the same generic facts; and
2. after visual/mechanical validation, a separately pre-registered sealed
   two-sided ecology whose primary selection authority is actual match result,
   not this transition tensor.

It does not authorise production wiring, commander removal, genes, a live
selector, a named defensive task, full-league evolution or script retirement.

## 10. Result

Two complete executions were byte-identical:

```text
SHA-256  f082ae8ebb4a2e374182002c57453e23ef67403d3cb0016d734006b4a6c5943b
```

All exact validity gates passed. Observer snapshots consumed no Match RNG;
5,086 commitments were valid; annotating a response with the pure coordination
query changed no physical signature; all 35,288 expected Oracle opportunities
completed without force failure or nondeterminism.

```text
accepted states                         64 / 64
completed two-defender branches       4411 / 5086   86.7%
Oracle opportunities                 35288 / 35288 100.0%
valid commitments                      5086 / 5086  100.0%

D1 dilemmas                              147 / 506    29.1%  FAIL (>=35%)
states with both exposed directions       32 / 64            PASS (>=24)

dilemmas with a physical D2 handoff       126 / 147   85.7%  PASS (>=50%)
states with a physical handoff              49 / 64           PASS (>=40)

transition-changing physical handoffs       25 / 314    8.0%  FAIL (>=10%)
states with a transition handoff             13 / 64           FAIL (>=16)
```

The result preserves two important facts:

1. shared movement intent is not vacuous—32 states required opposite D2
   reactions under different D1 commitments while D2's initial self-state was
   unchanged;
2. two normal kinematic bodies can complete a local arrival handoff in 49/64
   states without central assignments or extra locomotion authority.

But the accepted handoff definition aimed D2 toward the **receiver endpoint**.
That geometry reached real first-transition consequences only 8.0% of the time.
The missing mediator is therefore not permission to lower the gate or fit a
response selector. A pass can be intercepted before its endpoint; the defender
must compare arrival to the moving ball along a space-time corridor. Existing
`carrierLaneClearance` is static distance, and live `canInterceptPass` is a
crude current-ball helper rather than an observer-grounded candidate prediction.

D-COVER-0 is closed. A causally different future contract may test a pure
space-time pass-corridor interception margin against these real response worlds.
It must keep the failed endpoint gates as historical controls and may not alter
the movement window, candidate set, Oracle replicates or live contact semantics.
