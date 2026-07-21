# O4c — Observer-specific Offer-transition Calibration

Status: **PRE-REGISTERED. Not yet run. No live consumer.**

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
