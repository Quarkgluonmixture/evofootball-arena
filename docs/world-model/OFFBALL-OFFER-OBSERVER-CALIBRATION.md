# O4c — Observer-specific Offer-transition Calibration

Status: **INCONCLUSIVE at the fresh truth-replication gate. Observer selector
work stopped; no live consumer.**

Date: 2026-07-21

## 1. Question

O4b established a truth-ceiling mediator: a generic target's
`opponentArrivalMargin` predicts the stable-control transition after the mover
executes that target and receives the existing ordinary pass. O4c asks whether
the already accepted S3 observation representation preserves enough of that
relationship:

```text
same fixed world point and physical profiles
→ mover-specific FOV / scan clock / memory / deterministic observation error
→ perceived opponent-arrival margin
→ unchanged movement, pass and Oracle-v2 transition
```

Perception is measurement only. It cannot select a different candidate or alter
the branch.

## 2. Fresh states and unchanged intervention

Use the unchanged O4a/O4b state, candidate, movement and forced-pass rules on the
first 128 valid states from seed offset **25000**.

For each match maintain S3 `PerceptionMemory` for every active player at the
already established synthetic awareness levels:

```text
0.2 / 0.5 / 0.8
```

Call `perceiveSnapshot` every complete simulation tick so scan intervals,
last-known observations and retention age genuinely accumulate before a state is
sampled. The observer is the off-ball mover. Keyed observation error consumes no
Match RNG and cannot affect the physical continuation.

Truth still chooses hold/legacy/forward/lateral/backward exactly as O4b. Each
observer snapshot evaluates those same immutable world points through
`evaluateOffBallCandidate`. A missing carrier, missing defence or expired memory
returns unsupported; it does not consult truth or choose a replacement point.

Physical execution and Oracle-v2 outcomes remain common across awareness levels.

## 3. Fresh truth replication gate

Before interpreting perception, pool all successfully forced branches and repeat
the frozen O4b truth-margin quartiles.

```text
records                                      >= 400
truth Q4-Q1 intended reception              >= +10pp
truth Q4-Q1 opponent interception           <= -10pp
```

If this fresh truth sample misses either gate, verdict is:

```text
INCONCLUSIVE — truth-ceiling ecology did not replicate
```

It is not a perception failure, and the sample is not enlarged or replaced.

## 4. Observer metrics

For each awareness level report:

* supported estimates / all successful forced passes;
* raw perceived-vs-truth margin MAE;
* sign agreement around zero;
* mean observation age for the mover and carrier plus observed opponent count;
* perceived-margin quartile intended/opponent/other transition rates;
* geometry composition in every quartile.

Quartiles use only supported finite perceived estimates, sorted by perceived
margin with deterministic record order as the tie break. Every supported record
keeps its actual transition; adverse, rare and censored results are not removed.

Low and medium awareness are diagnostics. They cannot fail or rescue the high
awareness gate.

## 5. Frozen high-awareness gate

At awareness 0.8:

```text
supported estimate coverage                  >= 80%
perceived Q4-Q1 intended reception           >= +8pp
perceived Q4-Q1 opponent interception        <= -8pp
```

The 8pp thresholds pre-register retention of 80% of O4b's practical 10pp
truth-ceiling target. They are not fitted to O4c data.

The following are diagnostic rather than hard gates:

* high-awareness MAE no worse than medium, and medium no worse than low;
* high-awareness sign agreement no worse than medium/low;
* quartile-by-quartile monotonicity;
* paired truth calibration within each awareness-supported subset.

These diagnostics expose representation behaviour without turning several facts
into a post-hoc composite.

## 6. Exact validity gates

```text
fresh frozen states                          = 128
clone/oracle force failures                  = 0
deterministic rerun differences              = 0
active target changes                        = 0
unexplained intervention changes             = 0
non-finite supported estimates               = 0
awareness changed physical branch outcome    = 0
Match RNG draws caused by perception          = 0 by construction
production Match/brain/pass changes          = 0
```

Default O4a and O4b invocations must retain their frozen hashes. O4c must produce
an identical full-output hash on repeat.

## 7. Stop rule

Stop observer-specific selector work if truth replicates but awareness 0.8 misses
coverage or either 8pp transition gate. Do not:

* use a truth fallback for unsupported views;
* promote awareness 1.0/oracle to the player path;
* tune FOV, scan rate, retention or observation noise;
* choose a different point from the perceived snapshot;
* replace margin with teammate spacing after observing the result;
* combine facts into a score;
* map awareness to a player gene;
* add a new vision attribute; or
* wire the snapshot into live AI.

A pass authorises only a separate offline cheap-selector contract. That contract
must state how multiple generic facts remain a partial preference and how shared
offer occupancy prevents duplicate commitments. It still cannot authorise live
movement.

## 8. Emergence boundary

Candidate directions remain numbered geometry. Named patterns such as cut-inside,
overlap, underlap, check-back or third-man movement are forbidden as policy inputs.
They may later classify realised trajectories for telemetry and play-test clips.

## 9. Frozen result

The 128-state run at seed offset 25000 passed every mechanism and observation
validity gate, but stopped at the pre-registered fresh truth-replication gate:

```text
successful forced-pass truth records          502
clone / deterministic / intervention failures 0 / 0 / 0
oracle force failures                          0
truth / observer non-finite facts              0 / 0

fresh truth opponentArrivalMargin Q4-Q1:
  intended reception                           +3.6pp  (required +10pp)
  opponent interception                        +1.1pp  (required -10pp)
```

This is `INCONCLUSIVE — truth-ceiling ecology did not replicate`, exactly as
pre-registered. It is not a perception failure. The state count, seed range,
primary fact and thresholds were not changed, and no alternative diagnostic was
promoted.

The observer representation itself remained well behaved:

| awareness | coverage | margin MAE | sign agreement | carrier age | opponents seen |
|---:|---:|---:|---:|---:|---:|
| 0.2 | 82.1% | 0.141s | 91.5% | 6.68 ticks | 4.03 |
| 0.5 | 93.0% | 0.098s | 92.7% | 6.90 ticks | 4.78 |
| 0.8 | 95.0% | 0.096s | 92.9% | 6.27 ticks | 5.34 |

At awareness 0.8 the perceived-margin Q4-Q1 split was -3.8pp intended reception
and +5.4pp opponent control. Those rates do **not** diagnose perception because
the matching supported truth subset was also non-predictive (+3.8pp intended,
+1.2pp opponent). High numerical fidelity cannot manufacture an outcome gradient
absent from the sampled physical ecology.

Two complete O4c runs produced the identical output hash
`04563c9bf4da0ff2f113ab9f2c09cb8a5b6e0501bbd8b6e26d4d8c2b27650ce9`.
The previously frozen O4a and O4b hashes remained unchanged.

The cheap single-fact selector path therefore stops here. O4b remains a valid
finite-suite causal result, but O4c shows it is not yet robust enough across a
fresh 128-state ecology to become an observation or policy authority. Re-entry
would require a genuinely different, pre-registered generalisation contract—not
another seed range, a larger sample, a new threshold or post-hoc substitution of
teammate spacing.
