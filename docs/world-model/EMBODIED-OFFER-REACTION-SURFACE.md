# Embodied Offer Reaction Surface

Status: **H/M/C contract pre-registered; probe not yet implemented or run.**

Date: 2026-07-22

## 1. Decision

D1 proved that observer-specific perception, generic off-ball candidates,
shared commitments, locomotion and physical pass resolution can be composed.
D2a then stopped the first selection family: one static nine-weight preference
vector improved development coverage by only 7.8 percentage points and missed
both frozen development gates.

That result does not authorise another score, context table or named movement.
Before learning who should choose which offer, the project must establish a
more basic causal fact:

```text
one player's real movement
-> defenders and the observed world respond
-> another player's candidate surface changes
```

It must also separate that embodied effect from the extra information carried
by an explicit O3 commitment.

The next bounded experiment is therefore **EOR-0 — Embodied Offer Reaction
Surface**, with three conditions:

```text
H — A is held at its initial world point
M — A performs one real generic O0 movement
C — the identical M world is read with A's explicit O3 commitment
```

`M - H` measures embodied world mediation. `C - M` measures information added
by declared intent beyond the same visible physical trajectory. C is an
information query over the M world, not a separately simulated world.

## 2. Correction to the closed-loop proposal

The D1 carrier was decision-frozen in all legacy, independent and coordinated
branches. `HoldPosition` still executes the ordinary formation/physics path; it
does not pin the player's coordinates. The 53.3 percentage-point legacy gap is
therefore not caused by freezing only the decentralised carrier.

A live repeated-decision lab would currently bundle three unqualified choices:

* which offer selector owns each re-decision;
* how the unchanged legacy carrier brain reads O3 commitments, which it cannot
  currently do;
* how retention, progression, options and turnover are compared without
  becoming a new scalar utility.

EOR-0 stays one layer below those choices. It asks whether the world contains a
real reaction surface worth selecting over.

## 3. Hypotheses

### EOR-H1 — embodied mediation

For the same frozen state and fixed B candidate points, replacing A's hold with
one real generic movement changes at least some opponents' physical trajectories
and produces candidate-dependent changes in B's opponent-facing affordance
facts.

### EOR-H2 — explicit intent has separate information capacity

On the exact M physical snapshot, adding A's active O3 commitment produces
finite, non-constant coordination facts across B's fixed candidate surface.
The base O0 affordances must remain byte-identical because C does not alter the
world.

Neither hypothesis says that a particular movement is good, that B should
choose a particular response, or that the commitment deserves a bonus.

## 4. Frozen substrate

The following remain unchanged:

* S3 `PerceptionSnapshot`, scan cadence, memory and keyed observation error;
* O0 symmetric candidate generation and every `OffBallAffordance` fact;
* O3 commitment schema and coordination fact functions;
* S6 `MoveToPoint`, steering, physical integration and contact;
* TeamBrain and PlayerBrain for every non-intervened player;
* ball physics, possession, M2/M3 and all match law;
* every live selector, score, gene, save field and UI consumer.

EOR-0 is a probe-only composition. Production modules may be imported by the
probe, but no production module may import the probe.

## 5. Frozen states and actors

Use fresh match seeds beginning at `50000`:

```text
required accepted states = 96
maximum scanned seeds     = 192
match duration            = 240 seconds
state sampling cadence    = 1.0 second
minimum match time        = 10 seconds
awareness                 = 0.8
```

States within eight seconds of an administrative boundary are ineligible. The
phase must be `playing`; the stable carrier must be an outfield player.

Eligible off-ball players must be outfield teammates of the carrier with:

* a valid observer-specific O0 surface;
* a finite, onside `hold` candidate;
* at least four finite, onside, non-hold candidates from the existing
  `0.75s` horizon.

Sort eligible players by existing `decisionTimer`, then gid. The first is A and
the second is B. This order is fixed and does not inspect outcomes, roles,
candidate values or named football patterns.

## 6. A intervention enumeration

Do not select A's “best” offer. Enumerate every eligible A candidate from the
existing `0.75s` horizon in stable candidate-id order.

World and law may remove pitch-invalid or offside candidates; no direction is
otherwise preferred. There is no score, learned weight, random choice or named
movement class.

For every enumerated intervention, freeze:

* A's candidate id, world target and initial evaluated affordance;
* B's complete initial finite/onside O0 candidate surface;
* the carrier, A and B gids;
* B's perception memory at the intervention tick;
* the complete simulation state and RNG state.

## 7. Physical branches

The observation window is exactly one existing `TEAM_AI_INTERVAL`:

```text
0.4 seconds = 24 fixed simulation ticks
```

This is not a new re-decision cadence. It is the existing team coordination
cadence used as a measurement boundary.

In both H and M:

* the carrier's current decision is replaced by `HoldPosition` and its decision
  timer is frozen, exactly as in D1;
* B receives `MoveToPoint` at B's initial world position and its decision timer
  is frozen;
* all other players keep their ordinary live brains, assignments, movement and
  contacts;
* the ball and carrier must remain in the same stable-control relationship;
* B's perception memory advances after every complete `Match.step(DT)` using
  the ordinary deterministic perception path.

The only H/M difference is A:

```text
H: MoveToPoint(A initial position)
M: MoveToPoint(A enumerated generic candidate point)
```

A's decision timer is frozen in both. No position, velocity, heading, opponent
assignment or ball state is written directly.

If phase, carrier identity, roster identity or an intervened action changes,
the paired intervention is classified by cause and excluded from completed
mechanism denominators. It is never silently deleted.

## 8. B reaction surface

At the end of H and M, evaluate every frozen initial B candidate point again
with B's corresponding observer-specific snapshot and the current reach
profiles. Fixed world points prevent candidate regeneration from moving the
question.

For each matched candidate, preserve the full raw H and M vectors. The primary
world-facing deltas are:

```text
opponentArrivalMargin
nearestOpponentDistanceAtArrival
carrierLaneClearance
offsideMargin
```

Also report self-arrival, teammate distance, carrier distance, observation ages
and observed-player counts as diagnostics. No dimensions are added together.

The paired physical mediator is the maximum final H/M displacement of any
opponent, matched by gid.

An intervention has a **material embodied reaction** only when all are true:

1. A closes at least `0.25m` more distance toward its target in M than H;
2. at least one opponent's H/M final position differs by `0.25m` or more;
3. B has at least five matched, finite fixed-point affordances in H and M;
4. across those points, at least one candidate-dependent H/M delta range is
   material:

```text
range(delta opponentArrivalMargin) >= 0.05 seconds
OR
range(delta nearestOpponentDistanceAtArrival) >= 0.10 metres
OR
range(delta carrierLaneClearance) >= 0.10 metres
OR
range(delta offsideMargin) >= 0.10 metres
```

These are probe measurement resolutions, not gameplay coefficients and not
candidate preferences.

## 9. C information query

Create A's O3 commitment from the frozen initial affordance:

```text
committedTick  = intervention tick
validUntilTick = intervention tick + 45
```

At the 24-tick observation boundary it is therefore still active. Evaluate O3
coordination facts for every matched B candidate on the M snapshot, using B's
observed carrier point.

C is informative for an intervention when:

* every read is finite or a schema-valid null;
* the active commitment count is exactly one;
* at least one of target distance, bearing separation, arrival-time separation
  or corridor separation is non-constant across B's candidates.

The M base-affordance bytes before and after all C queries must be identical.
There is no C movement branch, no commitment consumer and no score.

## 10. Primary gates

EOR-0 passes only if all gates pass:

### Validity

```text
accepted states                         = 96
enumerated paired interventions         >= 384
jointly completed H/M interventions     >= 75%
perception RNG-state changes             = 0
non-finite raw facts                     = 0
target or action mutations               = 0
clone / gid / roster failures            = 0
M/C physical-state differences           = 0
production fingerprint changes           = 0
```

### Embodied mechanism

```text
material embodied reactions
  >= 25% of jointly completed interventions

states with at least one material embodied reaction
  >= 60 / 96
```

The intervention-level gate prevents a few spectacular states from carrying
the result; the state-level gate prevents many candidate directions from one
small ecology from doing so.

### Intent information

```text
informative C queries
  >= 95% of jointly completed interventions

base O0 mutations caused by C
  = 0
```

### Determinism

Two complete executions must emit byte-identical JSON and SHA-256 digests.

## 11. Required anatomy

Always report, by H/M pair and aggregated by state:

* A target progress;
* maximum and mean opponent displacement;
* which opponents changed marks/chasers, as telemetry only;
* number of B fixed candidates successfully re-evaluated;
* per-dimension H/M delta distributions and delta ranges;
* whether B currently observes A, the changed opponent and the carrier;
* O3 non-constant dimensions and fact-read count;
* all attrition causes;
* candidate direction and horizon indices as geometric labels only.

Named football patterns must not appear in executable enums, branches or gates.

## 12. Counterfactual controls

The focused probe must include:

1. **H/H replay:** identical hold interventions yield exact physical and
   affordance equality.
2. **M/M replay:** identical movement interventions yield exact equality.
3. **Commitment mutation:** adding/removing O3 changes only coordination facts,
   never Match or base O0 state.
4. **Macro-label mutation:** changing no macro label is allowed; all reaction
   facts come from observer snapshots and physical state.
5. **Candidate-order reversal:** aggregate anatomy is invariant to enumeration
   order after stable id sorting.
6. **No-defender-response anatomy:** interventions with no opponent displacement
   remain honest negatives even if A itself moved.

## 13. Interpretation and stop rule

Possible conclusions are deliberately asymmetric:

```text
H1 pass, H2 pass
  real embodied coupling and explicit intent are both available;
  authorise a separate closed-loop process contract.

H1 pass, H2 fail
  visible world change is sufficient at this layer;
  do not build selection around O3.

H1 fail, H2 pass
  O3 can describe intended separation but the live world does not mediate it;
  stop selector/learning work and inspect defender reaction/candidate substrate.

H1 fail, H2 fail
  current O0/O3 composition lacks a reaction surface;
  park this decentralised route.
```

Do not respond to failure by extending the window, lowering displacement
resolutions, filtering directions, selecting favourable actors, adding weights
or restoring named runs.

Passing EOR-0 authorises only a separately pre-registered closed-loop
possession-development mechanism contract. It does not authorise:

* a live selector or PlayerBrain consumer;
* repeated re-decision;
* a process scalar or new utility;
* genes or league evolution;
* central task publication;
* removal of the accepted legacy commander;
* a play-test build.

