# Off-ball Mainline Decision

Status: **A stopped at R1a's frozen coverage gate. User-selected B passed its
data-support census, then stopped at T0b's strict relative-calibration gate before
external validation. The user selected C next; C0 completed as a dormant
demand/claim occupancy representation. No demand producer, movement selector,
task allocator or live pass estimator is authorised.**

Date: 2026-07-21

## 1. What is now known

The off-ball investigation has separated four different questions that were
previously bundled together as “make the positioning smarter”.

### Natural football phenomena already covered

* Ordinary wide carries already produce inward/cut-inside trajectories: E1
  found 398/574 materially goalward wide carries moving inward.
* Ordinary pass choice already produces immediate return exchanges: E2 found
  444/522 without the dedicated `wallRun` licence.
* Teammates already make central edge-of-box arrivals after wide entry: E4
  found 1,188, including 844 without `team.arriver`, across 118/120 matches.

These phenomena must remain post-hoc labels. No `CutInside`, `OneTwo` or
`ArriveForCutback` live action is needed.

### Natural coverage still absent

E3 found only four overlap-shaped paths in 8,058 eligible episodes, all still
using another run/support authority. The existing fixed-point movement stack
does not naturally maintain a useful relation to a moving teammate.

### The generic mechanism exists but its commitment model is incomplete

R0 added dormant `TrackRelativePoint`: a role-neutral moving reference plus an
attack-frame offset, executed through the common movement stack. R0a proved
backward and lateral relations close in 98–100% of completed branches, but the
forward relation missed its frozen gate at 45/51. R0b found that five of the six
forward misses were already beyond the offside line at commitment, although all
six were physically ETA-reachable.

The missing fact is therefore not another overlap instruction or a larger
movement allowance. A future commitment would need to know whether a moving
relation remains both **reachable and legally executable** before selecting it.

### Local point access is not a pass transition model

H0 moved the recent passer to a locally favourable forward point and forced the
ordinary return pass. Movement was exact, yet intended reception fell and
opponent control rose. H0a then showed that 87/99 targets still had positive
local opponent-arrival margin at pass time; even the widest carrier-lane
quartile ended in opponent first control 86.9% of the time.

The missing fact is the complete carrier → ball flight/contact → stable
controller transition. A point can be locally reachable and still be a bad pass
destination.

### The current transition-value research is honestly parked

Oracle v2 produced valid transition semantics and a total comparable payoff.
The S7e replicated-ceiling pilot then failed both frozen statistical stability
gates. The final was not run. Re-entry requires a genuinely new inference
contract that handles transition composition and independent match-cluster
generalisation; more continuations, new tolerances or another endpoint axis are
not authorised.

## 2. Why there is a real fork now

The next useful change cannot be another read-only census. The evidence points
to three different missing causal layers, and implementing any one first sets
the next research cost and risk:

```text
moving-relation feasibility
        ↓
action transition/value
        ↓
team task allocation and live positioning
```

They are related, but they are not one safe serial phase. The first can improve
movement expressiveness without proving football payoff. The second can delay
visible play for a substantial offline inference project. The third can produce
the largest visible change while depending on two upstream relations that are
not yet proven.

## 3. The three defensible choices

### A — Relative-affordance foundation first (**recommended**)

Authorise a new, offline-only contract for a role-neutral relative candidate
that jointly represents:

* the moving reference and fixed relation;
* mover/reference future reachability;
* offside, pitch and barred-area legality at commitment;
* existing shared-offer occupancy, without a football-pattern label.

This is not an R0a retry with an observed miss filtered away. It would introduce
the missing causal mediator—commit-time legality of a future moving relation—on
fresh states and keep the remaining dynamic miss honest.

Why first: it is the narrowest known representation gap, directly addresses
the failed overlap coverage, and is reusable for checking short, pulling wide,
third-player movement, defensive cover and strong/weak-side relations. It does
not yet choose or reward any of those patterns.

Cost/risk: medium. Passing the offline representation would still not authorise
live selection or prove a carrier can complete a pass to the mover.

### B — Transition-estimator research first

Authorise a new inference contract that predicts, from kick-time state/action
facts on genuinely independent train/test match clusters:

```text
P(intended / teammate / opponent / loose / dead)
×
conditional multi-dimensional outcome
```

Why first: this is the direct blocker exposed by H0/H0a and S7. It is the most
principled route to deciding whether any off-ball offer is worth serving.

Cost/risk: high. It needs substantially more independent match ecology and a
new estimator authority. Even success would initially authorise only more
offline work, not live AI.

### C — Dynamic task/occupancy foundation first

Authorise a dormant S8 contract in which the team publishes generic needs such
as outlet, depth, width, central protection or pressure, and players bid by
reachability/occupancy instead of `TeamBrain` naming a runner or arriver.

Why first: this attacks VISION's largest visible violation—the commander-style
formation and duplicated/absent team functions—and creates the clearest route
to visibly different team shapes.

Cost/risk: highest. Without a qualified transition/value relation, task demand
can become another hand-written tactical table under different names. It should
remain representation-only until the upstream facts can pay.

## 4. Recommendation

Choose **A** next.

It follows the strongest fresh causal evidence, adds the smallest missing world
fact, and preserves the architecture needed by C without pretending that B is
solved. It is also the only option whose immediate falsification can stay
compact and symmetric: can an agent represent a reachable, legal relation to a
moving reference before commitment, across forward/backward/lateral cases,
without a named football interpretation?

If A fails on fresh states, keep R0 dormant and choose B or C explicitly; do not
shrink the offset or lower R0a's old gate. If A passes, the next decision is
still whether to qualify a generic relative candidate set or invest in B before
any live selection.

## 5. What is not waiting for a decision

The accepted live baseline remains unchanged and deterministic. Named
`overlapper`, `arriver`, `runners`, `wallRun` and cutback logic remain migration
debt rather than being removed early. B1c stays closed, B1d stays isolated and
S7e stays parked.

The user selected A on 2026-07-21. Its authority and frozen gates are now in
[`RELATIVE-AFFORDANCE-FOUNDATION.md`](RELATIVE-AFFORDANCE-FOUNDATION.md).
The other choices remain parked rather than rejected:

```text
A — legal/reachable moving relations (selected)
B — transition estimator
C — dynamic team task allocation
```

## 6. A result and renewed decision boundary

R1 successfully added the dormant fact boundary. On fresh states, its
pre-commit eligibility was followed by real target closure in 141/143 completed
branches (98.6%), retained 80.6% of all real closures, and passed every
directional precision gate. But only 187 branches completed the full window;
the frozen contract required 192. Most attrition was the carrier losing control,
not a query or movement error.

The stop rule still binds. Do not convert this near-pass into authority by adding
states, ignoring possession loss or changing the horizon. R1 remains available
as a dormant fact, while relative candidate generation/live selection remains
closed.

The next mainline choice is therefore between the two previously parked causal
layers:

```text
B — invest in a new transition-estimator programme before movement selection
C — build dormant dynamic team-task/occupancy representation before payoff
```

Neither has been started automatically. B directly addresses carrier→ball→
controller value but is an expensive inference project. C follows VISION's
largest visible positioning gap but carries higher risk of becoming another
hand-written commander until transition value exists.

The user selected **B** after the R1a stop. Its new inferential authority is
[`TRANSITION-ESTIMATOR-PROGRAMME.md`](TRANSITION-ESTIMATOR-PROGRAMME.md). Unlike
the parked replicated ceiling, T0 pools kick-time state/action examples across
fresh independent match clusters and seals separate validation/test ranges. T0a
was only a training-support census and did not fit or wire an estimator. It passed
with 19,164 decisions / 93,636 candidate actions, all five outcomes supported in
every fixed fold, 79.15% within-decision outcome variation and zero Oracle or
identity failures. Validation and test ranges remain unread.

T0b then demonstrated a strong target-specific mediator on a 60-match internal
holdout: action features improved log loss by 8.79% and Brier by 8.93% over the
otherwise identical state-only model, and every multi-action decision received
different probabilities. It nevertheless failed its pre-registered relative
calibration gate (`ECE 0.007320` versus `0.006991`). Per stop rule, external
validation and final test remain sealed; no post-result temperature fit or gate
change is allowed.

The remaining mainline fork is now explicit:

```text
C — start the dormant dynamic task/occupancy representation
P — park implementation work and commission a genuinely new estimator-calibration audit
```

C has the highest visible tactical payoff but must remain representation-only;
T0b did not authorise using its probabilities to score tasks or passes. P may use
the banked target-specific signal, but cannot be an immediate patch to the failed
ECE comparison.

The user selected **C**. Its first bounded authority is
[`TEAM-TASK-OCCUPANCY-FOUNDATION.md`](TEAM-TASK-OCCUPANCY-FOUNDATION.md): an
opaque demand with explicit capacity and arrival window, explicit player claims,
and a pure conservation ledger for missing/excess participation. C0 deliberately
does not publish demands, score players, allocate tasks or alter live movement.
It passed all 12 focused representation tests, the full 588-test suite, build
and the unchanged default fingerprint. The next bounded question is demand publication from
generic world relations; copying current runner/arriver/chaser assignments into
the new types is explicitly forbidden.

## 7. C0 result and the demand-publication boundary

C0 completes everything that can safely be built before deciding who may
publish a team need. The next change is no longer neutral plumbing.

### D — Decentralised player offers; park central demand publication (**recommended**)

Treat O0/R1 candidate facts, O3 shared commitments and C0 occupancy as dormant
interfaces. A future player sees ball, opponents, teammates, offside/field law,
own reach and teammates' intent, then chooses among generic candidates. Central
team demand is not invented first.

This best matches the user's emergence model: the dimensions are hand-built,
but the run, role and shape arise from individual choices plus shared occupancy.
It also respects the current causal map: S7 value/transition must qualify before
S8 can allocate. In practice this parks C0 and returns the next research cut to
a genuinely new, pre-registered estimator/calibration authority; it is not
permission to patch T0b's failed ECE gate.

### G — World-anchored generic demand publisher, offline only

Authorise a new representation for needs anchored only to world objects and
relations—for example a point, moving reference, line or region—with no named
football behaviour, role, priority, score or allocator. This could later express
ball access, field coverage and teammate-relative occupation without saying
“overlap” or “arriver”.

The risk is architectural rather than mechanical: choosing which anchors,
capacity and windows to publish already defines team tactics. Without a qualified
value relation, G can become a hand-written task menu even if every type name is
generic. It therefore needs explicit user authorisation and must remain offline.

### Forbidden shortcut

Do not derive C0 demands from `team.runners`, `team.arriver`, `team.overlapper`,
`team.chasers`, marks, formation slots or their current thresholds. That would
reproduce the commander exactly while making the migration debt harder to see.

The user selected **D**. C0 is now parked as dormant coordination language; no
central demand publisher follows. The next cut returns to player-level
perception/affordance/value and begins with the read-only T0b calibration failure
audit in
[`TRANSITION-CALIBRATION-FAILURE-AUDIT.md`](TRANSITION-CALIBRATION-FAILURE-AUDIT.md).
That audit cannot patch T0b or open the sealed validation/test ranges.
