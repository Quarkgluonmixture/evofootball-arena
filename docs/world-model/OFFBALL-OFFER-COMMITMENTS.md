# O3 — Shared Off-ball Offer Commitments

Status: **O3 COMPLETE as representation-only S8/S9 substrate. No allocation,
score or live consumer.**

Date: 2026-07-21

## 1. Missing causal fact

O0–O2a now provide and execute individual off-ball choices, but every player
would still evaluate those choices independently. That cannot answer:

> Is another teammate already moving to provide substantially the same option?

The missing state is a generic commitment, not a named team instruction:

```text
player + current carrier + fixed target point + expected arrival time
```

An overlap, third-player run, check-back or weak-side occupation may later be
recognised from several such commitments and their resulting trajectories. None
of those pattern names belongs in this representation.

## 2. Representation

`OffBallOfferCommitment` contains only:

* player and carrier identity;
* immutable target world coordinate;
* expected arrival time;
* committed tick and caller-owned expiry tick.

For one O0 candidate, `evaluateOffBallOfferCoordination()` returns separate
continuous facts against other active same-carrier commitments:

* number of active teammate commitments;
* nearest committed target distance;
* nearest carrier-centric bearing separation;
* nearest arrival-time separation;
* nearest corridor separation;
* identity of the commitment supplying each minimum.

No threshold turns these facts into `duplicate=true`; no aggregate score chooses
a winner. Zero geometric separation is a fact, not a penalty.

## 3. Authority boundaries

* The module consumes an existing `OffBallAffordance`, current carrier point,
  explicit commitments and current tick.
* It does not import `Match`, `Team`, either brain, formations, roles, genes,
  policies or action execution.
* Expiry is explicit caller state. The module must not invent commitment
  duration or silently keep stale intent alive.
* A relevant malformed commitment makes the evaluation unsupported (`null`);
  unknown intent is not interpreted as free capacity.
* With no active teammate commitment, the count is zero and all nearest fields
  are `null`, not infinity or a fabricated open-space bonus.

## 4. Counterfactual gates

Focused tests must prove:

1. no active commitments produces count zero and nullable nearest facts;
2. identical targets produce zero target, bearing and corridor separation;
3. same-ray different-depth targets preserve zero bearing/corridor separation
   while target distance stays positive;
4. orthogonal targets produce the expected carrier-centric angle;
5. arrival-time separation is independent of geometry;
6. other-carrier, self and expired commitments do not occupy the candidate;
7. a relevant malformed commitment returns `null`;
8. mirrored geometry preserves all unsigned occupancy facts;
9. inputs remain unchanged and repeated calls are identical.

## 5. Exact-zero gates

```text
Match/Team/brain imports       = 0
live commitments created       = 0
allocation/selection           = 0
aggregate scores               = 0
named pattern labels           = 0
role/gene/policy checks         = 0
target or input mutation        = 0
RNG draws                       = 0
default fingerprint changes     = 0
```

Passing O3 authorises only a multi-player offline occupancy census. It does not
authorise a task allocator, live movement, a preference gene or retirement of
the current `TeamBrain` assignments.

## 6. Result

O3 passed:

* same-target, same-ray/different-depth, orthogonal and mirrored commitments
  produce the expected separate geometric facts;
* arrival-time difference changes independently of target geometry;
* self, other-carrier and expired commitments do not occupy the candidate;
* malformed relevant intent returns `null`, while no active intent returns an
  honest zero count with nullable nearest fields;
* the commitment helper copies the target and accepts only caller-supplied valid
  tick intervals;
* nine focused coordination tests plus the ten O0/O1 focused tests pass;
* TypeScript and the production build pass;
* source census finds no Match, brain, role, gene, policy or named-pattern
  consumer/import;
* the default fingerprint remains
  `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.
* the completed O0–O4 milestone passes all 549 repository tests in a
  low-concurrency run (77 files), avoiding the known local worker-RPC timeout.

This result provides a language for shared spatial intent. It does not create an
intent in live play or decide whether two nearby offers are harmful duplication.
