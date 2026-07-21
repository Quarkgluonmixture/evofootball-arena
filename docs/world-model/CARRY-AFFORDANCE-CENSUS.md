# K0a — Carry-affordance Support and Tradeoff Census

Status: **PRE-REGISTERED — fresh-state observational census only.**

Date: 2026-07-21

## 1. Question

K0 proves that a stable controller can be shown a symmetric, unscored set of
carry directions and separate world facts. K0a asks the next representation-only
question:

> In real 6v6 possession states, are those directions broadly supported and do
> they expose genuine conflicts between moving toward goal and retaining physical
> access, rather than collapsing to one constant or universally best direction?

This is not a direction-payoff probe. It does not move the controller, touch the
ball, select a candidate, infer a football pattern or compare match outcomes.

## 2. Frozen state suite

Run 120 deterministic four-minute matches with fresh seeds:

```text
43,000 ... 43,119 inclusive
```

Sample at the first complete playing tick on or after every whole simulated
second. A state is eligible only when:

* `phase === playing`;
* the ball has one stable, non-sent-off outfield owner;
* an oracle `PerceptionSnapshot` for that owner contains self, ball, at least one
  teammate and at least one opponent;
* every observed player has a valid current physical reach profile.

The oracle snapshot isolates candidate/geometry support from S3 observation error.
It does not authorise omniscient live consumption. At most one state is recorded
per match-second; state identity is `(matchSeed, simTick, controllerGid)` and must
be unique.

The seed range, cadence, eligibility rule and match duration are frozen before the
probe exists. They may not be enlarged after seeing the result.

## 3. Measurements

For every eligible state, run `evaluateCarryAffordances()` exactly once and record:

* total candidate count;
* support count for each of the 32 non-hold `(horizon, direction)` IDs;
* count of distinct direction indices at each horizon;
* within-state range for self arrival, opponent arrival margin, endpoint opponent
  distance, travel-corridor clearance, teammate distance, goalward progression,
  goal-corridor clearance and field margin;
* observation ages and observed body counts;
* the tradeoff indicators below.

`hold` is retained for conservation but excluded from range and tradeoff
calculations. Comparisons are only between candidates with the same horizon, so a
longer sample is never declared better merely because it travels farther.

## 4. Pre-registered tradeoffs

A state has a **progress/access tradeoff** when, at either horizon, an ordered pair
of legal candidates `(A, B)` exists such that:

```text
A.goalwardProgression >= B.goalwardProgression + 0.25m
B.opponentArrivalMargin >= A.opponentArrivalMargin + DT
```

The thresholds are not a utility function: `0.25m` is a sub-body spatial
separation and `DT` is exactly one simulation tick. The indicator only proves that
the two world facts disagree materially.

Two diagnostics use the same fixed spatial/timing differences:

```text
endpoint/corridor tradeoff:
  A.opponentArrivalMargin >= B.opponentArrivalMargin + DT
  B.travelCorridorClearance >= A.travelCorridorClearance + 0.25m

progress/field tradeoff:
  A.goalwardProgression >= B.goalwardProgression + 0.25m
  B.fieldMargin >= A.fieldMargin + 0.25m
```

These are post-hoc descriptions of fact conflict, never candidate labels or live
preferences.

## 5. Frozen gates

### Exact validity

```text
matches represented                         = 120
eligible states                             >= 1,000
duplicate state identities                  = 0
null K0 evaluations in eligible states      = 0
non-finite facts                            = 0
duplicate candidate IDs                     = 0
missing or duplicate hold candidates        = 0
candidate points outside the 2m inset        = 0
candidate/controller or owner mismatches     = 0
snapshot/profile/input mutations             = 0
live Match/brain/executor writes              = 0
RNG draws caused by evaluation                = 0
```

Every one of the 32 non-hold candidate IDs must appear in all 120 matches and in
at least 1,000 eligible states across the suite. Otherwise the nominal symmetric
space lacks real-ecology support.

### Non-vacuity mediators

Across eligible states, the q10 of the within-state range must be strictly above:

```text
goalward progression range       > 0.25m
opponent arrival-margin range     > DT
travel-corridor clearance range  > 0.25m
teammate-distance range           > 0.25m
```

This means at least the broad lower tail—not merely a few showcase states—contains
different causal facts.

### Primary outcome

At least 50% of eligible states must contain a pre-registered progress/access
tradeoff. This is the one primary K0a outcome. The endpoint/corridor and
progress/field rates are diagnostics and cannot rescue a primary failure.

### Determinism

Two complete runs must emit byte-identical canonical JSON and SHA-256. The
production fingerprint must remain
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.

## 6. Stop rule

K0a fails and stops before any execution primitive if:

* a support, non-vacuity or primary gate fails;
* a candidate must be scored, filtered or renamed to make the census pass;
* the sample range/cadence is changed after result;
* facts are collapsed into an aggregate “space” or “carry value”;
* oracle truth is described as a live perception solution; or
* a cut-inside/down-line/take-on label enters candidate generation.

Passing K0a authorises only a separately pre-registered dormant
`DribbleToPoint`-style execution-feasibility slice. It does not authorise a live
selector, candidate payoff claim, gene, script retirement or play-test build.
