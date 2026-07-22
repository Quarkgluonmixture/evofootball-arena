# D-LANE-0 — Observer-Grounded Space-Time Pass Corridor Lab

Status: **COMPLETE — FAIL; point-response defensive line parked.**

Date: 2026-07-22

Verification at the frozen result commit:

* typecheck and production build pass;
* corridor plus shared-cover focused tests: `18/18` pass;
* the unchanged D-COVER mode still produces its accepted historical SHA
  `f082ae8ebb4a2e374182002c57453e23ef67403d3cb0016d734006b4a6c5943b`;
* default football fingerprint remains
  `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.

## 1. Causal question

D-COVER-0 established that shared movement intent and a two-body kinematic
handoff are real, but its endpoint-arrival handoff changed forced-pass first
control only `25/314` times (`8.0%`) across `13/64` states. It failed its frozen
H1/H3 gates and is closed.

The failed representation asked whether a defender could reach the receiver's
endpoint. A ground pass is instead available for interception at every fixed
simulation tick before that endpoint. D-LANE-0 tests the causally different
mediator:

```text
observed passer/target/defender motion at pass time
→ intended fixed-step ground-ball trajectory
→ defender arrival to every trajectory sample
→ earliest and strongest space-time interception margin
→ unchanged Oracle-v2 first transition
```

This is one multi-layer calibration experiment, not a selector or another
independent Pareto axis. It must either explain materially more of the already
real two-body transition effects than endpoint arrival did, or close this
defensive-response line.

## 2. Frozen comparison world

D-LANE-0 replays the exact D-COVER-0 world construction:

```text
states                         64
match seed range               62000..62127
maximum scanned seeds          128
match duration                 240 seconds
sampling cadence               1 second
minimum match time             10 seconds
administrative clearance       8 seconds
awareness                      0.8
movement window                0.75 seconds
Oracle replicates              4 per outlet/response world
attacking/defending candidates unchanged
```

Carrier, A, B, D1 and D2 receive the same fixed actions for the same movement
window. All movement is executed by the existing `Match.step()` and
`Player.physicsStep()` path. The forced ordinary passes and five-class first
transition authority remain Oracle-v2.

The following D-COVER result is a frozen historical control, not a threshold
that may be re-estimated:

```text
endpoint-arrival transition handoffs       25 / 314 = 8.0%
states with endpoint transition handoff    13 / 64
```

No movement duration, candidate, pass power, control shell, Oracle replicate,
transition step or world-selection rule may change.

## 3. Pass-time observation

After the 0.75-second movement intervention and before the forced pass, the
probe captures a new `PerceptionSnapshot` from D2 using the frozen awareness
and a deterministic probe namespace. This observation:

* consumes zero Match RNG;
* may omit unseen identities rather than consulting truth;
* supplies observed position, velocity and body direction for carrier, target,
  D1 and D2;
* uses only the already-known physical reach profiles;
* never reads TeamBrain marks, chasers, runners, roles or tactical mode.

A corridor evaluation is supported only when all required observed identities
are present. Missing observation is counted, never filled from `Match` truth.

## 4. Dormant corridor representation

The pure representation accepts one observed passer, target and defender plus a
known reach profile. It first calls the existing `predictGroundPass()` and then
replays the engine's ground-ball order exactly:

```text
ball.pos += ball.vel × DT
ball.vel *= exp(-BALL_FRICTION_K × DT)
```

At every tick from launch through intended arrival it evaluates the defender's
existing `estimateReach()` to that ball point with the accepted
`CONTROL_RADIUS`. For trajectory sample `i`:

```text
ballTime_i       = i × DT
defenderEta_i    = estimateReach(observed defender, ballPoint_i)
margin_i         = ballTime_i - defenderEta_i
```

Positive margin means the defender is predicted to reach the interaction shell
before the ball. The representation returns separate facts only:

```ts
interface PassCorridorInterceptionFacts {
  defenderGid: number;
  passerGid: number;
  targetGid: number;
  flightReachable: boolean;
  sampleCount: number;
  strongestMargin: number;
  strongestPoint: V2;
  strongestBallTime: number;
  strongestDefenderEta: number;
  strongestPathFraction: number;
  earliestFeasiblePoint: V2 | null;
  earliestFeasibleBallTime: number | null;
  targetObservationAgeTicks: number;
  defenderObservationAgeTicks: number;
}
```

There is no probability, score, action, response winner, task, role or movement
permission. `strongestMargin` is a physical time difference in seconds, not a
utility. The helper may not call `directBallAccess`, alter the ball, or add
swept contact semantics.

For two defenders, both individual margins remain in telemetry. The team's
predicted corridor access for one outlet is only the physical race identity:

```text
max(D1 strongestMargin, D2 strongestMargin)
```

This is not a tactical score; it states which of two bodies is predicted to
arrive first to some sampled point on the same pass.

## 5. Pre-registered classifications

All thresholds are frozen before the first run and reuse D-COVER's existing
material time threshold.

### D1 creates a corridor dilemma

Relative to D1-hold in the D2-hold world, a non-hold D1 movement must:

* improve D1's strongest corridor margin to one outlet by at least `0.10s`;
* worsen D1's strongest corridor margin to the other by at least `0.10s`.

The improved outlet is telemetry-labelled **occupied** and the worsened outlet
**exposed**. No football role is assigned.

### D2 completes a corridor handoff

Under the identical D1 movement, relative to D2-hold, a D2 response must:

* improve the two-body maximum corridor margin on the exposed outlet by at
  least `0.10s`;
* not worsen the two-body maximum corridor margin on the occupied outlet by
  more than `0.10s`;
* retain D-COVER's existing `0.25m` target-progress fact;
* keep all intervention actions and targets fixed.

### Real transition handoff

The football consequence remains unchanged from D-COVER. Relative to D2-hold:

* defender first-control probability on the exposed outlet improves by at least
  `0.25`;
* defender first-control probability on the occupied outlet does not fall by
  more than `0.25`.

With four replicates these are exact one-replicate changes.

## 6. Direct calibration

Across all supported completed response-world/outlet observations, place the
two-body maximum strongest margin into fixed bins:

```text
late       margin <= -0.10s
borderline -0.10s < margin < +0.10s
early      margin >= +0.10s
```

For each world/outlet, the observed label is the unchanged four-replicate
Oracle probability of `opponentInterception`. This calibration is descriptive
of the physical representation; no coefficient is fitted.

## 7. Gates

### Exact validity

```text
accepted states                         = 64
force failures                          = 0
snapshot Match-RNG changes              = 0
action/target mutations                  = 0
non-finite supported facts               = 0
clone/identity failures                  = 0
child-seed collisions                    = 0
deterministic rerun differences          = 0
order-dependent classifications          = 0
Match/brain/gene/save consumers added    = 0
```

### Support and execution

```text
completed two-defender branches          >= 70%
pass-time corridor observations           >= 70% of completed branches
Oracle opportunity support               >= 90%
D1/D2 target progress                     >= 90%
```

### Corridor representation

```text
states with both exposed directions       >= 24 / 64
supported D1 corridor dilemmas             >= 35% of non-hold D1 responses
states with a corridor handoff             >= 40 / 64
late-bin world/outlet observations         >= 100
early-bin world/outlet observations        >= 100
early − late opponent-first-control rate   >= +15 percentage points
```

### Consequence and historical enrichment

```text
corridor handoffs with transition effect   >= 13%
states with transition corridor handoff    >= 20 / 64
rate edge over endpoint history            >= +5 percentage points
state edge over endpoint history           >= +5 states
```

The `13%` / `20-state` gates are the frozen `8%` / `13-state` endpoint result
plus the pre-registered practical improvement. They are not confidence claims.

## 8. Exact-zero anti-script gates

```text
named press/cover/balance role enums      = 0
fixed first/second/third defender state   = 0
central demand publication                = 0
marks/chasers copied into representation  = 0
aggregate tactical/utility score          = 0
response selector                         = 0
outcome-aware candidate generation        = 0
truth fallback for missing observations   = 0
ball/contact/possession writes             = 0
swept-contact changes                      = 0
new RNG draw in Match                      = 0
new attribute/gene/coach hook              = 0
live PlayerBrain/TeamBrain consumer        = 0
```

## 9. Stop and authority

Any failed exact-validity gate invalidates the experiment. If support or
representation gates fail, the corridor fact is too weak or too unavailable.
If calibration or historical-enrichment gates fail, the space-time corridor
does not repair D-COVER's missing football consequence.

On failure:

* do not increase samples or replicates;
* do not tune the `0.10s`, `0.25m`, `0.25` or bin thresholds;
* do not modify pass/contact physics;
* do not train a selector;
* do not open a live sandbox;
* park this point-response defensive line and return to a VISION-level choice
  such as temporal delay/cover rotation or another world-model gap.

Passing authorises only a separate default-off live-sandbox contract in which
the same corridor facts can be read. It does not authorise production wiring,
commander removal, genes, a named defensive role, ecology, league evolution or
script retirement.

## 10. Result

Two complete executions were byte-identical:

```text
SHA-256  5d9a904a67f438d72382b2ee455a141441c7deba8aa45c1cde56173a7efcb421
```

All exact validity gates passed. The helper remained observer-grounded and
read-only; the 35,288 Oracle opportunities completed without force failure;
actions, targets, Match RNG and physical outcomes were unchanged by the query.

```text
accepted states                         64 / 64
completed two-defender branches       4411 / 5086   86.7%
supported pass-time corridor worlds   2455 / 4411   55.7%  FAIL (>=70%)
Oracle opportunities                 35288 / 35288 100.0%

D1 corridor dilemmas                     74 / 262    28.2%  FAIL (>=35%)
states with both exposed directions       12 / 64            FAIL (>=24)
corridor handoffs                          41
states with a corridor handoff             13 / 64            FAIL (>=40)

transition-changing corridor handoffs       2 / 41      4.9%  FAIL (>=13%)
states with transition corridor handoff     2 / 64             FAIL (>=20)

late margin observations                 1584 @ 45.5% opponent first control
borderline observations                   733 @ 49.5%
early margin observations                2593 @ 48.8%
early − late calibration edge                    +3.3pp        FAIL (>=15pp)
```

The result is stronger than a support-only failure. Even among thousands of
supported response-world/outlet observations, the predicted ability to arrive
early somewhere on the intended pass path barely separated actual opponent
first control. Corridor handoffs changed real transitions less often than the
already failed endpoint handoffs (`4.9%` versus `8.0%`) and in only `2/64`
states rather than `13/64`.

Therefore the missing mechanism is not another static spatial target or a
cheaper path-scanning ETA. Current first control also depends on a coupled
sequence of body orientation, arrival velocity, contact readiness, ball timing,
other bodies and decisions that change while the pressure develops. Encoding
those consequences into one more fixed response fact would repeat the failed
single-feature pattern.

D-LANE-0 is closed. Its thresholds, support window and representation must not
be tuned. No live sandbox, selector, ecology or commander removal is authorised.
The point-response defensive line is parked; any restart requires a causally
different temporal multi-body process contract, or a return to another ranked
world-model gap.
