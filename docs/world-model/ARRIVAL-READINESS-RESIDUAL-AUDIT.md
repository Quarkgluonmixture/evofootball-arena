# A0 — Arrival-readiness Residual Audit

Status: **PRE-REGISTERED — read-only; no G3 representation or live consumer authorised.**

Date: 2026-07-21

## 1. Question

The accepted pass affordance represents receiver ETA, opponent ETA, pressure and
the receiver's current body turn toward the incoming ball. It does not represent
the ball–receiver relative velocity expected near arrival.

That omitted fact already has a real causal consequence in M3. A ground contact
records the ball–player relative speed, and the delayed first-touch attempt uses
it when deciding whether stable control is established. A receiver can therefore
have a favourable ETA and body-facing value while still meeting the ball with a
different control burden.

A0 asks:

> After holding current arrival margin, body readiness and flight time in narrow
> fixed cells, does a lower kick-time estimate of ball–receiver relative speed
> materially increase intended stable reception?

This is a residual-support audit. It does not add a predictor, change a pass,
move a player, alter first touch or select an action.

## 2. Frozen suite and action boundary

Run 120 fresh deterministic four-minute matches:

```text
45,000 ... 45,119 inclusive
```

Immediately before each decision-ready stable owner step, freeze the match. If
that step creates an ordinary live pass, evaluate only its actually selected
target from the frozen pre-decision state. The target must:

* be a non-goalkeeper teammate represented by the oracle pass-affordance query;
* have a finite predicted ground-ball flight;
* have `offsideMargin <= -0.2m` at the frozen kick state;
* be at least five simulated seconds before the current half's nominal
  administrative boundary, measured from frozen match state;
* produce one valid Oracle-v2 forced branch for that same target.

The forced branch is used only to obtain the existing five-class first stable
transition. It starts from the frozen state and does not change the live match.
No alternative target is generated or compared.

## 3. Pre-treatment relative-motion fact

Let the predicted ground pass have unit direction `u`, launch speed `v0`, and
arrival after `N` fixed ticks. With the accepted ground friction factor

```text
q = exp(-BALL_FRICTION_K * DT)
```

the ball velocity visible to the post-integration endpoint query is:

```text
predictedBallVelocityAtArrival = u * v0 * q^N
```

The one audited fact is:

```text
relativeArrivalSpeedProxy =
  length(predictedBallVelocityAtArrival - target.velAtKick)
```

It uses only frozen kick-time state and the existing ordinary-pass prediction.
It is not the later measured contact speed, does not read the Oracle result and
does not claim that the receiver keeps a constant velocity in live play.

Record separately as diagnostics:

* target speed at kick;
* velocity toward and across the predicted target point;
* predicted endpoint ball speed;
* target stopping distance under current acceleration;
* stopping slack to the current interaction shell;
* the accepted arrival margin, body readiness, flight time and pressure;
* Oracle first-transition outcome and identities.

No diagnostic is combined into a score or promoted after the result.

## 4. Frozen residual comparison

Partition eligible records without reading outcomes.

### Baseline cells

```text
arrivalMargin:
  <-0.5, -0.5..-0.2, -0.2..0, 0..0.2, 0.2..0.5, >=0.5 seconds

bodyReadiness:
  0..0.25, 0.25..0.5, 0.5..0.75, 0.75..1

ballArrival:
  0..0.5, 0.5..1.0, 1.0..1.5, >=1.5 seconds
```

A cell is supported when it has at least 40 records. Sort it by
`relativeArrivalSpeedProxy`, then by `(matchSeed, kickTick, passerGid,
targetGid)`. Compare the lowest and highest `floor(n / 4)` records. The cell is
mechanically informative only when the two group means differ by at least
`1.0m/s`; otherwise it remains in the ledger but not the primary denominator.

Every supported cell contributes equal-sized low/high groups. The aggregate
rate is weighted by that common group size, not by a fitted coefficient.

### Primary outcome

```text
intendedReception(low relative speed)
  - intendedReception(high relative speed)
  >= +10 percentage points
```

This is the single primary A0 outcome.

### Required mediators

* at least 12 informative cells and at least 800 low/high extreme records;
* at least 60% of informative cells have a positive intended-reception edge;
* opponent-interception rate in the low-relative-speed group is no more than
  five percentage points above the high-relative-speed group.

`teammateRecovery`, `loose` and `deadBall` remain explicit non-intended outcomes.
They are never deleted or reassigned to improve the reception rate.

## 5. Exact validity and determinism

```text
matches represented                         = 120
eligible chosen-pass records                >= 3,000
duplicate record identities                 = 0
non-finite pre-treatment facts              = 0
Oracle force failures                       = 0
Oracle transition conservation failures     = 0
administratively censored transitions        = 0
frozen/live Match mutations from audit       = 0
RNG draws caused by fact evaluation          = 0
outcome-dependent eligibility decisions      = 0
production imports or mechanics changes      = 0
```

Two full runs must emit byte-identical canonical JSON and SHA-256. The accepted
production fingerprint must remain
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.

## 6. Stop rule

A0 fails and G3 stays deferred if:

* any exact validity or support gate fails;
* the primary edge is below +10pp;
* the sign-consistency or opponent-control mediator fails;
* the result requires a fitted model, changed bins, a different quantile, more
  matches or an outcome-specific exclusion;
* actual future contact speed is substituted for the frozen kick-time fact; or
* a live pass, receiver route, first touch or movement rule must change.

Passing A0 authorises only a separately pre-registered pure representation that
adds a relative-arrival-speed fact to S4/S5. It does not authorise a probability,
score, selector, locomotion rewrite, `controlReadyAt`, live perception wiring or
play-test build.
