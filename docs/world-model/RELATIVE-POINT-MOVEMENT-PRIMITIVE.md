# R0 — Relative-point Movement Primitive

Status: **COMPLETE — dormant, byte-identical, no live emitter.**

Date: 2026-07-21

## 1. Causal gap

E3 found that current live movement almost never produces a clean
overlap-shaped path. This does not authorise an overlap instruction. It exposes
a more general missing action primitive:

```text
MoveToPoint:
  target is one immutable world coordinate

missing:
  target is one immutable spatial relation to a moving player
```

The same relation can later support an attacker offering outside/inside/ahead/
behind a carrier, a defender protecting a moving lane, or a teammate preserving
spacing. The primitive must not know any of those football names.

## 2. Representation

Add one generic `ActionType`:

```ts
type: "TrackRelativePoint"
relativeToGid: number
relativeOffset: {
  x: number; // metres in the acting team's attack-forward axis
  y: number; // metres on the fixed pitch lateral axis
}
```

Every executor frame derives exactly one world target:

```text
target.x = reference.pos.x + team.attackDir × relativeOffset.x
target.y = reference.pos.y + relativeOffset.y
```

The offset is caller-owned and immutable for the action. The world point moves
only because the referenced physical player moves.

If the reference is absent, sent off, self-referential or the offset is missing/
non-finite, the action holds the actor's current point. It must not fall back to
the ball, a role spot or a named tactical target.

## 3. Execution boundary

`TrackRelativePoint` may only:

* derive a target from current reference position and the fixed offset;
* request desired velocity through the existing `arrive`/steering path;
* use the same onside, barred-box, avoidance, pitch and `Player.physicsStep`
  constraints as `MoveToPoint`.

It may not:

* write position, velocity, heading, speed or acceleration;
* choose a reference or offset;
* read role, tactic, gene, policy, pass result or football-pattern label;
* imply priority, task ownership or commitment;
* enter PlayerBrain, TeamBrain, Match state, saves or live selection.

## 4. Acceptance

Focused counterfactual tests must prove:

1. the same positive forward offset mirrors in world x when attack direction
   flips;
2. lateral offset remains a pitch-axis y displacement;
3. moving the reference with the same actor state changes desired movement;
4. no `executeAction` call directly moves the actor;
5. subsequent movement stays inside current acceleration/top-speed limits;
6. invalid/self references and non-finite/missing offsets hold safely;
7. the action/offset objects are not mutated;
8. no PlayerBrain/TeamBrain/live emitter imports or constructs the action;
9. TypeScript, full tests and the frozen production fingerprint remain green.

## 5. Stop rule

If the primitive requires an overlap-specific offset, carrier-only branch,
role/gene gate, special speed, physics write or existing-action change, revert
it. R0 is a vocabulary addition, not football payoff.

Passing R0 authorises only a separate offline clone-feasibility probe with
pre-registered symmetric relative offsets and a mechanically moving reference.
It does not authorise a candidate set, live commitment, selector, task allocator,
script retirement or play-test build.

## 6. Frozen result

R0 landed exactly at the registered boundary:

* `TrackRelativePoint` carries only a reference gid and fixed attack-frame
  offset;
* `relativePointTarget()` is a pure finite coordinate transform;
* the executor recomputes the world target from the current reference position
  and then uses the existing arrival, onside, barred-box, opponent-avoidance and
  player-physics path;
* invalid, sent-off and self references and invalid/missing offsets hold the
  actor's current point;
* the renderer has only a neutral debug label;
* no PlayerBrain, TeamBrain, Match or probe consumer emits the action.

Six focused tests cover attack-direction mirroring, fixed pitch-lateral
semantics, reference motion, zero direct body movement, the existing
acceleration/top-speed envelope, input immutability and all invalid-reference
cases. The existing three `MoveToPoint` tests remain green. Full tests,
TypeScript/build and the production fingerprint pass:

```text
sha256 57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673
```

The first test draft incorrectly expected final desired-y symmetry after the
shared teammate-separation force had been applied. The mechanism was not
changed to satisfy that false assertion; the pure transform is now tested
directly while executor tests separately verify physical bounds.

R0 proves only that the engine can express and execute a moving spatial
relation without a named tactic. The next permitted work is a separately
pre-registered clone-feasibility probe; no offset is preferred yet.
