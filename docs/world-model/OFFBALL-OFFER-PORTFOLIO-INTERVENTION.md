# O6 — Paired Offer-portfolio Intervention

Status: **COMPLETE — PRIMARY PAYOFF FAILED; bearing-only portfolio path stopped.**

Date: 2026-07-21

## 1. Hypothesis

Two individually feasible off-ball commitments can still provide nearly the
same carrier-facing line. A same-carrier portfolio that exposes substantially
different lines should more often leave the carrier at least one ordinary pass
whose intended receiver establishes stable control.

This is a portfolio-level hypothesis. It is not the rejected O4 single-margin
selector, and it does not assert that large separation is universally better.
Concentration can remain valuable in later football contexts; O6 asks only
whether generic pair geometry has a measurable causal effect in this bounded
receiving experiment.

## 2. Frozen sample

Use the first 128 eligible match seeds beginning at 27,000, scanning at most 256
seeds and accepting at most one frozen state from each seed. Sample once per
simulation second when:

* play is live with at least six seconds remaining;
* a non-goalkeeper dribbler has stable ownership;
* at least two attacking non-carrier outfielders each have two or more O0
  candidates satisfying `non-hold + onside + opponentArrivalMargin > 0`;
* one same-player-pair intervention defined below exists.

All candidates use the truth snapshot and current reach profiles. No current
role, named run, policy, gene, legacy support target or later football outcome
enters portfolio construction.

## 3. One deterministic intervention per state

For every unordered player pair, enumerate all pairs of individually eligible
O0 candidates. Convert each candidate pair to two O3 commitments and evaluate
it through O5. Discard unsupported or null-bearing portfolios.

Choose one lower-bearing and one higher-bearing portfolio jointly, subject to:

```text
same carrier
same two players
both players use a different candidate between branches
higher bearing separation - lower bearing separation >= PI / 4
```

Across all valid joint interventions, choose the largest bearing-separation
difference, then lowest player gids, then lexicographic lower candidate IDs,
then lexicographic higher candidate IDs. These tie-breaks are frozen before the
result and read no football payoff.

Target distance, arrival-time separation and corridor separation are reported
as covarying diagnostics. They are not matched, weighted or silently optimized.

## 4. Clone execution

From the same frozen `Match`, make a lower-bearing and a higher-bearing clone.
In each clone:

1. hold the carrier through the existing `HoldPosition` action;
2. give both selected players the existing `MoveToPoint` action with immutable
   world targets;
3. set only their decision timers to infinity;
4. run exactly 90 normal `Match.step(DT)` ticks;
5. never write position, velocity, heading, speed, acceleration or ball state.

The branch terminates categorically if the carrier loses stable ownership,
play stops, a selected player is removed/substituted, or an intervention action
changes unexpectedly. Branch-specific attrition is never relabelled as a pass
failure.

If both movement branches remain valid, force an ordinary pass separately to
each selected player from the resulting clone through Oracle v2. For each
receiver use four pre-registered child streams:

```text
childSeed = hashSeed(O6_NAMESPACE, matchSeed, freezeTick, receiverOrdinal, replicate)
replicate = 0..3
```

The same receiver ordinal and replicate receive the same child stream in both
portfolio branches. Each forced pass starts from its branch's unchanged
post-movement state. No branch is continued from another pass result.

## 5. Primary outcome

For each state and child replicate, the two forced passes are two possible
next actions, not two simultaneous passes. Define:

```text
portfolioReceptionCoverage = 1
  iff at least one of the two forced passes ends first transition as
  intendedReception
else 0
```

The sole primary payoff is:

```text
higher-bearing coverage rate - lower-bearing coverage rate >= +5pp
```

This is a transition-coverage fact, not a universal action utility. Later
possession, xG, goals and named combination patterns are outside O6.

## 6. Causal mediators and diagnostics

Hard mechanism mediators:

* planned bearing difference is at least 45 degrees in every accepted state;
* after movement, actual carrier-centric player bearing separation is greater
  in the higher-bearing branch in at least 75% of jointly completed states;
* both movers close distance to their immutable targets in at least 95% of
  completed mover interventions;
* target changes, unexplained action changes, direct state writes, non-finite
  facts and determinism differences are exactly zero.

Payoff mediators:

* report per-option intended, teammate, opponent, loose, dead and censored
  first-transition rates;
* report `neither / exactly one / both intended` per portfolio replicate;
* higher-bearing per-option opponent control may not increase by more than 5pp;
* all Oracle force failures are exactly zero.

Diagnostics include planned/actual target, bearing, arrival and corridor facts;
target closure; pre-pass interruption anatomy; and receiver-specific outcomes.
No diagnostic is promoted after seeing the result.

## 7. Coverage and conservation gates

```text
eligible independent match seeds                 = 128
scanned match seeds                              <= 256
jointly completed movement states                >= 96
successful forced-pass opportunities per branch >= 96 * 2 * 4
clone failures                                   = 0
portfolio construction/evaluation failures       = 0
carrier/player/pair identity failures            = 0
target/intervention changes                       = 0
non-finite facts                                  = 0
Oracle force failures                             = 0
determinism differences                           = 0
```

The lower and higher movement completion rates may differ by at most 5pp. The
primary denominator contains only the pre-registered jointly completed states;
all excluded states remain visible in the attrition ledger.

## 8. Stop rule

O6 stops and does not authorise allocation if:

* 128 independent eligible seeds cannot be found within the frozen scan;
* the intervention needs a score, role gate, named football pattern or live
  state;
* planned separation does not survive real movement;
* the coverage edge is below +5pp;
* opponent first control regresses beyond the frozen allowance;
* a different pair fact, threshold, sample, seed range, replicate count or
  outcome is promoted after seeing the result; or
* Match, PlayerBrain, TeamBrain, production action selection or the simulation
  fingerprint changes.

Passing O6 authorises only a separately pre-registered **offline** portfolio
relation/allocator experiment. It does not authorise live commitments,
`supportSpot` replacement, team bidding, genes or a play-test build.

## 9. Frozen result

The full pre-registered run completed twice with identical output hash
`b6fa4bd03f932b29f23b716f788291b1cabe6fbe89bbe7614bbd4d02232f419d`.

### Validity and mechanism

```text
independent frozen match seeds                 128 / 128
jointly completed movement states              102 (gate >= 96)
lower / higher movement completions            103 / 102
successful forced-pass opportunities           816 / 816
portfolio / identity / non-finite failures       0 / 0 / 0
clone / determinism / target / action failures   0 / 0 / 0 / 0
movement non-finite / Oracle failures            0 / 0
movers closing immutable targets               410 / 410 (100.0%)
actual higher-bearing direction                101 / 102 (99.0%)
```

The planned bearing difference averaged 100.764° and the real post-movement
difference averaged 62.114°. The intervention therefore worked physically.

### Primary payoff

| branch | at least one intended reception | intended per option | opponent control | dead ball |
|---|---:|---:|---:|---:|
| lower bearing | 83/408 (20.3%) | 88/816 (10.8%) | 630/816 (77.2%) | 16/816 (2.0%) |
| higher bearing | 99/408 (24.3%) | 104/816 (12.7%) | 482/816 (59.1%) | 143/816 (17.5%) |

```text
primary coverage edge          +3.9pp  (required >= +5pp)  FAIL
opponent-control edge          -18.1pp (allowed <= +5pp)   PASS
```

The lower opponent-control rate cannot be promoted after the result. Much of
that apparent improvement changed into dead balls rather than intended stable
receptions. The higher-bearing construction also covaried with +13.390m target
distance and +6.640m corridor separation, exactly why O6 pre-registered those
facts as diagnostics rather than silently calling direction spread valuable.

## 10. Verdict

O6 proved that generic portfolio geometry can be represented and physically
executed by two players, but **bearing separation alone did not clear its football
payoff gate**. No allocator, relation, live commitment, gene or `supportSpot`
migration is authorised.

This result stops only the bearing-extremes hypothesis. Re-entry requires a
causally new portfolio representation; swapping in target/corridor/arrival after
seeing this result, changing the 5pp gate, or promoting opponent-control reduction
would be the prohibited adaptive retry.
