# D1 — Decentralised Offer-loop Composition Lab

Status: **PRE-REGISTERED — offline three-branch composition experiment; no live selector.**

Date: 2026-07-21

## 1. Why this is a composition experiment

The project has enough isolated parts to express an off-ball decision:

```text
S3 observer-specific perception
→ O0 generic off-ball candidates and world facts
→ O3 explicit teammate commitments
→ MoveToPoint through normal locomotion/contact
→ Oracle-v2 pass/contact/stable-control transition
```

The parts have not yet been closed into one decentralised loop. Repeatedly
auditing one more fact has now produced diminishing returns: carry-direction
support, secured-ball access and kick-time arrival relative speed all stopped at
their frozen gates. D1 therefore tests composition, not another feature.

The causal question is:

> Holding perception, player preferences, candidate sets and execution fixed,
> does allowing later individual decisions to read earlier teammates' explicit
> spatial commitments produce a more useful set of real receiving options?

No team demand is published. No commander allocates a runner. Each player uses
their own observed world, generic candidate set and probe-owned preference vector.

## 2. Frozen state suite

Scan at most 256 deterministic four-minute matches beginning at seed 46,000.
Accept the first eligible state from each seed and stop at exactly 128 states.

The probe maintains one S3 memory per outfield player by calling the accepted
perception query every complete live tick with fixed `awareness = 0.8`. A state
is eligible only when:

* at least ten simulated seconds have elapsed and at least eight remain before
  the current half's nominal administrative boundary;
* play is live with one stable, non-goalkeeper carrier;
* at least three non-carrier outfield teammates have a supported O0 evaluation;
* each of those players sees self, carrier, at least one teammate and opponent;
* each exposes at least five perceived-onside candidates, including `hold`;
* all physical profiles and facts are finite.

Choose exactly three movers by earliest current decision timer, then gid. This
order is a deterministic asynchronous decision order, not a role priority.

## 3. Probe-only spatial preferences

D1 needs a selector to compose the layers, but must not install a universal
football utility or hand-name styles. Every mover therefore receives a fixed,
probe-only positive preference vector over nine generic facts:

```text
opponent arrival margin
teammate distance at arrival
carrier-lane clearance
forward displacement
negative self-arrival time
nearest committed-target distance
nearest committed-bearing separation
nearest committed-arrival-time separation
nearest committed-corridor separation
```

Weights are generated before any outcome from:

```text
rawWeight(player, dimension) =
  0.5 + (hashSeed(D1_NAMESPACE, matchSeed, playerGid, dimension) % 1001) / 1000

weight = rawWeight / sum(all rawWeight)
```

They are synthetic lab interventions—not genes, attributes, roles or proposed
defaults. Their only purpose is to establish player-to-player preference
heterogeneity while keeping the same vector in every branch.

For each player's perceived-onside candidate set, convert each fact independently
to a within-set percentile rank. Exact ties receive the same rank; a constant
dimension gives every candidate `0.5`. The weighted mean of the nine ranks is the
probe-local choice value. Highest value wins; exact ties use candidate ID.

This rank projection avoids fitted metres/seconds coefficients. It remains an
experimental scalar and may not leave the probe.

## 4. Three branches

Clone the same frozen state into:

### L — legacy

Hold the carrier for the 90-tick movement window. The three movers keep their
normal brain-selected actions and decision cadence.

### I — independent decentralised offers

Hold the carrier. In frozen decision order, each mover evaluates and selects its
candidate with the same perception and preference vector, but all four commitment
facts are constant `0.5`; no teammate intent is visible. Freeze each resulting
`MoveToPoint` action for the movement window.

### C — commitment-aware decentralised offers

Hold the carrier. The first mover sees no commitments. After selecting, it
publishes one O3 commitment lasting exactly 90 ticks. The second and third movers
evaluate their same candidates against the already published commitments and add
the four O3 percentile ranks to their unchanged preference vector. Each selected
point becomes an immutable `MoveToPoint` action and a commitment for the next
decision.

There is no retry, bargaining, central arbitration or demand. Earlier decisions
are not revised when a later player chooses.

## 5. Real execution and outcome

Run every branch through exactly 90 normal `Match.step(DT)` ticks. The probe may
write only action, decision timer and the carrier's `HoldPosition` action; it may
not write position, velocity, heading, ball, speed, acceleration, ownership or
contact state.

A movement branch terminates categorically if the carrier loses stable control,
play stops, a mover is removed/substituted or a frozen intervention changes.
Attrition remains visible and is never filled with a failed pass.

For every jointly completed state, force the existing ordinary pass separately
to each of the same three movers from each post-movement branch. Use four fixed
paired child streams per mover. Each pass starts from an untouched clone of that
branch state and resolves through Oracle v2.

For one state/replicate:

```text
portfolioReceptionCoverage = 1
  iff at least one of the three pass options ends first transition as
  intendedReception
```

This asks whether the carrier has at least one physically completed receiving
option. It does not choose the pass in live play or score later goals.

## 6. Frozen gates

### Exact validity

```text
eligible independent states                     = 128
scanned match seeds                              <= 256
jointly completed L/I/C movement states          >= 96
successful Oracle opportunities per branch       >= 96 * 3 * 4
clone / Oracle / identity failures                = 0
missing/non-finite perception or affordance facts = 0 in accepted states
target or intervention changes                    = 0
direct physical or ball-state writes              = 0
RNG child collisions / deterministic differences  = 0
named pattern / role / legacy-assignment reads     = 0 in I/C selection
production Match/brain/executor changes            = 0
```

Each pair of L/I/C movement completion rates may differ by at most five
percentage points.

### Mechanism

* at least 50% of accepted states change one or more mover selections between I
  and C;
* target satisfaction holds in at least 95% of completed I/C interventions:
  a non-hold mover reduces target distance by at least `0.25m`, while a `hold`
  choice remains within `0.5m` of its committed point;
* commitment-aware scoring reads at least one non-constant O3 fact for the
  second and third mover in at least 95% of accepted states;
* the first mover's selected candidate is exactly identical in I and C.

Portfolio target, bearing, arrival and corridor separation are reported before
and after movement. None is a primary gate: O6 already proved that one separation
axis cannot stand in for football payoff.

### Primary composition payoff

```text
C portfolio reception coverage
  - I portfolio reception coverage
  >= +5 percentage points
```

### Baseline and adverse-transition gates

```text
C coverage - L coverage                    >= -2 percentage points
C opponent-first-control per option
  - I opponent-first-control per option    <= +5 percentage points
C dead-ball per option
  - I dead-ball per option                 <= +5 percentage points
```

Report every five-class transition for every option. Teammate recovery, loose,
dead and censor outcomes are not recoded as intended reception.

## 7. Determinism and stop rule

Two full runs must emit byte-identical canonical output and SHA-256. The default
production fingerprint must remain
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.

D1 fails and stops if any validity, mechanism, primary, baseline or adverse gate
fails. It may not be rescued by:

* changing awareness, weights, ranks, horizons, mover count or decision order;
* promoting one separation diagnostic after the result;
* adding a central demand, task name, role bonus or legacy assignment;
* using the parked T0/S7 transition estimator;
* deleting `hold`, risky, loose, dead or intercepted outcomes;
* adding more seeds or child streams; or
* weakening current contact/pass physics.

Passing D1 authorises only a separately pre-registered experimental full-match
consumer behind a default-off switch. It does not authorise live default wiring,
new genes, `supportSpot` retirement, C0 demand publication or a play-test build.
