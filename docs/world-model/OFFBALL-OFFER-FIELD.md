# O0 — Off-ball Offer Field Representation

Status: **O0 COMPLETE as an offline, representation-only S5/S6 slice. No live
consumer, action selection, gene hook or named football pattern.**

Date: 2026-07-21

## 1. Hypothesis

The current `supportSpot` gives an attacker one hand-authored point, normally in
front of the ball. Before replacing it, the world model must be able to express a
role-neutral set of places the player could move to and the separate causal facts
that make each place different.

The missing representation is:

```text
observer-specific snapshot
+ known player reach profiles
+ symmetric spatial samples
→ unscored off-ball affordance vectors
```

This should make forward, backward, lateral and diagonal possibilities representable
through one interface. It does not assert that any one is valuable or should be
selected.

## 2. Causal lever

O0 adds exactly one lever: **candidate-space and affordance representation**.

Candidate generation uses two fixed time horizons and eight evenly spaced directions
in the team's attack frame, plus the player's current point. Directions are numbered,
not named. Points outside a two-metre pitch inset are rejected rather than moved to a
tactical landmark.

Each point emits separate facts:

* player ETA and turn time;
* nearest observed opponent ETA and the arrival margin;
* predicted opponent and teammate spacing at the player's arrival;
* carrier distance and opponent clearance along the carrier-to-point corridor;
* local forward/lateral displacement and field margin;
* perceived offside margin/risk;
* observation coverage/age.

There is no aggregate score, Pareto relation, tactic label or winner.

## 3. Authority and missing facts

The module consumes only `PerceptionSnapshot` plus explicit physical reach profiles.
It must not import `Match`, `Team`, `PlayerBrain`, `TeamBrain`, formations or policy
genes. Missing self, carrier, opponent or reach-profile facts return `null`; an
unobserved defence is not interpreted as open space.

O0 uses the currently accepted cheap S1 `estimateReach()` and S4 constant-velocity
observed-player projection. It does not claim exact arrival-body readiness or a
learned pitch-control probability.

## 4. Counterfactual gates

Focused tests must show:

1. deterministic, unique, in-bounds and role-neutral candidate generation;
2. the same central state exposes positive, negative and lateral local displacement;
3. moving an opponent onto a point reduces opponent spacing and arrival margin;
4. moving a teammate onto a point reduces teammate spacing;
5. putting an opponent on the carrier corridor reduces lane clearance;
6. increasing the off-ball player's physical reach improves their ETA/margin;
7. moving the candidate across the perceived offside line changes only the relevant
   output facts—not the candidate label or a hidden score;
8. inputs remain unchanged and repeated calls are identical.

## 5. Exact-zero and non-goals

```text
Match consumers                 = 0
PlayerBrain/TeamBrain consumers = 0
supportSpot replacements        = 0
new action types                = 0
named tactic labels             = 0
role checks                     = 0
genes/attributes added          = 0
aggregate scores                = 0
RNG draws                       = 0
```

O0 does not prove payoff, good positioning, coordination, selection or watchability.
Passing it authorises only a later, separately contracted observational calibration
probe. A live off-ball consumer must still defeat the accepted `supportSpot` baseline
without resurrecting named behaviours.

## 6. Result

O0 passed its bounded contract:

* `generateOffBallCandidates()` produces hold plus up to sixteen symmetric
  attack-frame points from two time horizons and eight numbered directions;
* `evaluateOffBallCandidate()` keeps world geometry fixed for physical/profile
  counterfactuals;
* `evaluateOffBallAffordances()` emits the unscored vector and returns `null` when
  self, carrier, defence or required reach profiles are unknown;
* seven focused tests cover symmetry, boundaries, opponent pressure, teammate
  occupancy, corridor blocking, fixed-point reach, offside, missing facts,
  determinism and input purity;
* all 537 repository tests, TypeScript and the production build pass;
* the default two-season fingerprint remains exactly
  `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`;
* import census finds no Match, brain, formation or live simulation consumer.

One test design was corrected before acceptance: comparing the same candidate ID
across different top-speed profiles changed the candidate's world coordinate and
was not a valid speed counterfactual. The public fixed-point evaluator now makes
that geometry explicit; the faster profile improves ETA and arrival margin to the
same point.

This result proves representation coverage and causal direction only. It does not
authorise candidate selection or claim that the generated points pay in matches.
