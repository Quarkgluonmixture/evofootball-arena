# O1 — Generic Move-to-point Primitive

Status: **O1 COMPLETE as a dormant, byte-identical S6 execution primitive. No
brain emits it.**

Date: 2026-07-21

## 1. Why this is a separate slice

O0/O0a established a multi-directional candidate space, but the executor can
only turn named or hand-derived actions into movement targets:

```text
SupportBallCarrier → supportSpot
MakeRun            → runTarget / arriver / overlapper / corner cases
MoveToFormation    → formationSpot
```

An offline counterfactual cannot honestly test a generic candidate while this
gap remains. Teleporting the player would bypass acceleration, turning, contact,
offside discipline and stamina; writing velocity directly would introduce a
movement boost.

O1 adds one generic primitive:

```text
MoveToPoint(targetPos)
→ existing action executor steering
→ existing Player.physicsStep
```

It names no football tactic and makes no value decision.

## 2. Execution contract

`MoveToPoint`:

* reads only the immutable world-coordinate `ActionState.targetPos`;
* uses the existing `arrive`, teammate separation and opponent-avoidance paths;
* remains subject to the common onside hold, barred-box discipline, pitch clamp,
  overlap solver, top speed, acceleration, turning, stamina and contact response;
* never writes position, velocity, heading, ball, ownership or possession directly;
* has no special role, gene, policy weight, score or tactical label.

Missing `targetPos` means hold current position; it does not fall back to a named
formation or run routine.

## 3. Exact-zero gates

```text
PlayerBrain emitters            = 0
TeamBrain emitters              = 0
live action selections          = 0
genes/policies added            = 0
role checks in the new case     = 0
direct player-state writes      = 0
ball/possession writes          = 0
named football pattern strings  = 0
```

Existing action paths and the default fingerprint must remain byte-identical.

## 4. Focused tests

1. targets to opposite sides produce opposite desired movement;
2. action execution does not move the body before `physicsStep`;
3. `physicsStep` alone advances the body within existing acceleration/top-speed
   limits;
4. the supplied target object and action state are not mutated;
5. a missing target produces no invented destination;
6. no live brain source references `MoveToPoint`.

## 5. What passing authorises

O1 passing authorises only an offline clone feasibility probe that can hold or
move one player through real locomotion. It does not authorise candidate scoring,
live selection, script retirement or a payoff claim.

## 6. Result

O1 passed:

* `ActionType` and the executor now recognise `MoveToPoint` with a generic
  `targetPos` and the exhaustive renderer map calls it only `point`;
* the case contains no role, gene, policy, tactic or ball/possession logic;
* common onside, barred-box and steering code still runs after the case;
* `Player.physicsStep` remains the sole movement integrator;
* three focused tests cover mirrored targets, no pre-physics movement, existing
  acceleration/top-speed enforcement, target immutability and missing-target hold;
* all 540 repository tests, TypeScript and the production build pass;
* the default fingerprint remains
  `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`;
* source census finds no `PlayerBrain` or `TeamBrain` emitter.

The first test draft incorrectly required the steering sum itself to stay below
top speed. Existing teammate separation and opponent avoidance may push
`desiredVel` above that value; the accepted physical authority clamps it inside
`Player.physicsStep`. The corrected gate isolates primary direction and verifies
the real post-integration speed/acceleration limits.
