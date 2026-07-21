# O0a — Off-ball Offer Field Census

Status: **COMPLETE as a probe-only observational census. Coverage gate passed;
no payoff claim and no live consumer.**

Date: 2026-07-21

## 1. Question

O0 proved that generic off-ball points and their separate causal facts can be
represented. O0a asks a narrower live-world question:

> During real attacking possessions, does that representation expose physically
> distinct forward, backward and lateral opportunities that the single legacy
> `supportSpot` cannot express?

This is a coverage census, not an action-value experiment. It cannot say which
point a player should choose or whether moving there would improve match results.

## 2. Sampling contract

For deterministic matches, once per sim-second while play is live and a carrier
exists:

1. freeze one full-truth `PerceptionSnapshot` for each on-pitch attacking
   outfielder other than the carrier;
2. evaluate the O0 generic candidate field using live top speed and acceleration;
3. evaluate the existing `supportSpot` world point through the same fixed-point
   vector interface;
4. aggregate facts by local displacement only:
   `forwardDelta > 0`, `< 0`, pure lateral displacement, or zero displacement
   (`hold`). Hold is reported separately so its zero self-arrival cannot make
   lateral availability look artificially strong.

The forward/back/lateral words are probe classifications after geometry exists;
they are not imported by any live module.

## 3. Descriptive outcomes

The census reports:

* eligible/evaluated states and missing-fact failures;
* candidate count and boundary-pruned count per state;
* by sector: count, self ETA, opponent-arrival margin, teammate spacing,
  carrier-lane clearance, onside rate and positive-margin rate, with hold and
  lateral kept separate;
* state-level availability of at least one onside candidate with positive
  opponent-arrival margin in each sector;
* the same causal facts for legacy `supportSpot`;
* legacy target displacement direction, without treating it as a tactical label.

`onside && opponentArrivalMargin > 0` is a transparent anatomy conjunction, not
a scalar value or a ship criterion.

## 4. Hard validity gates

```text
non-finite fields        = 0
missing-fact evaluations = 0 in full-truth snapshots
role/action labels read  = 0 by the O0 module
Match/brain writes       = 0
RNG draws                = 0
live behaviour changes   = 0
```

Repeated runs with the same match seeds must print identical football counts and
sums. Runtime timing is not part of the output.

## 5. Stop rule

Stop before live selection if:

* the candidate field is usually empty or non-finite;
* full-truth snapshots cannot evaluate it without hidden Match facts;
* backward/lateral points exist only as boundary artefacts;
* the probe needs a weighted score to make coverage look useful; or
* adding the probe changes the frozen simulation fingerprint.

A successful census authorises only design of a separate candidate-value/payoff
contract. It does not authorise replacing `supportSpot`.

## 6. Frozen result

The frozen `120 matches · seeds 0..119` census produced:

```text
eligible / evaluated / missing states: 46,920 / 46,920 / 0
generic candidates per state:          15.577
boundary-pruned candidates per state:   1.423
non-finite fields:                      0
```

At least one onside candidate with positive opponent-arrival margin existed in:

| geometric sector | states with candidate | states with joint window |
|---|---:|---:|
| forward | 99.8% | 40.5% |
| lateral | 100.0% | 64.4% |
| backward | 99.5% | 70.7% |
| hold | 100.0% | 97.9% |

Hold is reported only as the necessary no-move baseline; its zero self ETA makes
its high margin unsurprising and it must not be used to claim useful movement.
The first probe draft incorrectly combined hold with lateral. It was corrected
before acceptance, without changing candidates or thresholds, because the combined
97.9% bucket did not identify lateral coverage.

The single legacy `supportSpot` was forward relative to the player in 55.0% of
states and backward in 45.0%; it produced no pure lateral or hold point. Its joint
window appeared in 12.1% (forward) plus 20.2% (backward) of all evaluated states.
This corrects the casual shorthand that `supportSpot` always sends the player
forward: it is always placed ahead of the **ball**, not necessarily ahead of the
off-ball player's current position.

Two full reruns printed byte-identical output with SHA-256
`97427c50a2adb46a85ffabd4194c7d475b72c5a7e02881cb7946dcf01e08ba9a`.
The result establishes non-vacuous multi-directional coverage. It does not show
that any generic candidate has action payoff, nor does it supply a selection
relation.
