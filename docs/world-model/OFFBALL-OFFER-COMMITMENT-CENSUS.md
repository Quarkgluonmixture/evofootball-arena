# O3a — Multi-player Offer-commitment Census

Status: **COMPLETE as a probe-only census. Coverage/non-vacuity passed; no
allocator or live intent.**

Date: 2026-07-21

## 1. Question

O3 can represent whether another teammate has committed to a geometrically
similar offer. O3a asks whether that representation produces non-vacuous,
variable facts in real team states, before any coordination rule is designed.

It does not ask which player should move where.

## 2. Synthetic null commitments

Run deterministic matches 0–119. Once per sim-second during live stable control,
evaluate O0 for every attacking non-carrier outfielder. For each player, create at
most one **feasibility-only null commitment**:

```text
non-hold
+ onside
+ positive opponent-arrival margin
→ lowest self ETA
→ candidate ID tie-break
```

This rule is intentionally not a football value function. It creates a transparent
independent-choice null model so O3 can be exercised with several simultaneous
commitments. The commitment exists only inside the probe and has an explicit
90-tick lifetime; no Match object or live action sees it.

## 3. Measurements

For every synthetic commitment, evaluate it against all other same-carrier
commitments and report distributions of:

* active teammate commitment count;
* nearest target distance;
* nearest carrier-bearing separation;
* nearest arrival-time separation;
* nearest corridor separation.

Each continuous fact is reported as mean plus q10/q50/q90. No distance or angle
is converted to `duplicate`, `overlap`, `third man` or any other football label.

## 4. Gates

```text
matches                              = 120
missing O0 evaluations               = 0 under truth snapshots
commitment construction failures     = 0
coordination evaluation failures     = 0
active-count conservation violations = 0
non-finite numeric facts              = 0
Match/brain writes                    = 0
live consumers                        = 0
```

At least 80% of sampled team states must contain two or more synthetic
commitments. Every nearest-fact distribution must have observations and a
strictly wider q10–q90 range; otherwise the representation is vacuous in the
current 6v6 ecology.

## 5. Stop rule

Stop before allocation design if:

* the census needs a weighted candidate score;
* missing teammates are interpreted as unoccupied capacity;
* a named action/role is required to create the synthetic commitment;
* any threshold is added after observing the distribution; or
* the probe changes the frozen fingerprint.

Passing O3a authorises only a separately contracted offline allocation experiment.
It does not authorise live commitments, task bidding or `supportSpot` replacement.

## 6. Frozen result

The 120-match census (seeds 0–119) passed:

```text
sampled team states                         10,689
states with at least two commitments        10,590 (99.1%)
synthetic commitments                       43,150
multi-commitment evaluations                43,060
missing/construction/evaluation/count errors 0 / 0 / 0 / 0
non-finite facts                             0
```

| continuous occupancy fact | mean | q10 | q50 | q90 |
|---|---:|---:|---:|---:|
| nearest target distance | 9.967m | 1.554m | 9.158m | 19.228m |
| nearest bearing separation | 29.778° | 2.808° | 19.717° | 73.023° |
| nearest arrival separation | 0.051s | 0.002s | 0.021s | 0.131s |
| nearest corridor separation | 2.830m | 0.240m | 1.849m | 6.721m |

The near tail shows that independent feasible choices often provide almost the
same carrier-centric line at almost the same time; the wide q10–q90 ranges prove
the representation is not a constant duplicate flag. No threshold is inferred
from these values.

Two full reruns produced the identical output hash
`456133643e93fdae4007f9b131e9a51983a94872e4c310b8794d121fa3221be2`.
The default simulation fingerprint remained unchanged.
