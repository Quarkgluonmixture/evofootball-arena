# E2 — Emergent Pass-return Census

Status: **PASS as telemetry-only primitive coverage. No live change.**

Date: 2026-07-21

## 1. Question

The current engine has an explicit `wallRun` licence and return-pass bonus. E2
asks a narrower migration question before any replacement is designed:

> Does the ordinary pass policy ever complete an immediate A→B→A exchange
> without the `wallRun` authority, and does the original passer ever receive the
> return materially farther upfield?

The post-hoc name “pass-return” exists only in this probe. E2 does not reward,
select or increase the pattern.

## 2. Episode authority

Run 120 ordinary five-minute matches from seed offset 28,000. Detect stable pass
completion solely from a new `lastCompletedPass` record.

An episode begins when A→B completes during live play. It succeeds only if the
next completed pass by that team is B→A within 3.0 seconds, with no opponent
stable control or dead-ball phase in between. Any other completed team pass,
stable control by a same-team player other than B, opponent control, dead ball,
expiry or match end closes the episode without a return.

Several A→B episodes may overlap in time, but every distinct completion key is
started and closed once. The probe never mutates Match or player state.

## 3. Geometry and authority flags

From the first completion until return/termination, record A's real trajectory
in its team's attack frame:

```text
return gain       A local-x at return - A local-x at first completion
peak forward gain max A local-x - A local-x at first completion
path length        integrated real movement
```

A completed exchange is **materially progressive** when `return gain >= 2m`.
This is a post-hoc geometry label, not a live gate.

Separately record whether A was exposed at any tick to:

* a live same-partner `wallRun` licence;
* `team.runners`, `team.arriver` or `team.overlapper` assignment;
* `SupportBallCarrier` or `MakeRun` action.

The key unlicensed stratum is `wallRun exposed = false`. The stricter
`no combo/run/support authority` stratum is diagnostic because the accepted
baseline still uses hand-authored formation/support movement.

## 4. Outputs

Report:

* completed passes and started/closed/unfinished episode conservation;
* return exchanges per match and match coverage;
* materially progressive returns;
* wallRun-exposed versus unlicensed returns;
* strict no-authority returns;
* return gain, peak gain, path and elapsed-time distributions;
* action/assignment exposure anatomy;
* existing `team.stats.oneTwos` as a separate named-baseline diagnostic.

E2 does not use goals, wins or an aggregate quality score.

## 5. Frozen validity/non-vacuity gates

```text
matches                                      = 120
episode start/close conservation             exact
duplicate completion keys                    = 0
non-finite trajectory facts                  = 0
unfinished episodes after match close        = 0
completed immediate returns                  >= 10
wallRun-unlicensed returns                   >= 5 across >= 5 matches
wallRun-unlicensed materially progressive    >= 1
same-seed complete output                     byte-identical
production source changes                     = 0
```

The strict no-combo/run/support count is diagnostic, not a gate.

## 6. Stop rule

If unlicensed returns are absent or vacuous, do not widen `wallRun`, lower its
gene gate or add a new one-two action. The result means the generic pass-choice
and/or movement substrate still does not support the phenomenon without its
named authority.

If unlicensed returns exist, do not infer that their frequency or payoff is
good. Passing authorises only a later generic pass-and-move representation or
trajectory-to-outcome anatomy under a separate contract. It does not authorise
retiring the current named script.

## 7. Frozen result

The 120-match census passed every validity and non-vacuity gate:

```text
stable completed passes / episodes              10,830 / 10,830
duplicate completion keys                            0
unfinished episodes                                  0
non-finite facts                                      0
immediate A→B→A returns                             522 (4.350/match)
matches with a return                            113 / 120
wallRun-unlicensed returns                          444 (85.1%)
matches with an unlicensed return               113 / 120
unlicensed returns gaining at least 2m               93 (63 matches)
strict no combo/run/support-authority returns         45
named baseline oneTwos                               65
```

| trajectory fact | mean | q10 | q50 | q90 |
|---|---:|---:|---:|---:|
| return gain | −1.081m | −6.332m | −1.191m | 4.460m |
| peak forward gain | 1.430m | 0.000m | 0.067m | 4.489m |
| path length | 5.204m | 1.837m | 5.132m | 8.118m |
| completion time | 1.180s | 0.750s | 1.167s | 1.583s |

Two full reruns produced the identical output hash
`a2f834116b88075e6a003d489d4d4ec78f4fbab55349adf109e2bc89062facbc`.

## 8. Verdict

The ordinary pass policy already contains a generic **return exchange**: 85.1%
of observed immediate returns completed without the dedicated `wallRun`
authority, and 93 unlicensed returns materially advanced the original passer.
The named football phenomenon therefore does not require a special return-pass
action to be possible.

That is not yet a clean replacement for the current one-two script. The median
return lost 1.191m, 453/522 returns exposed `SupportBallCarrier` or `MakeRun`, and
216 exposed a runner/arriver/overlapper assignment. Only 45 returns avoided all
recorded combo/run/support authorities. The generic **pass choice** exists; the
generic **shared movement intent and payoff** remain unfinished.

No named script is retired and no frequency is promoted. The next valid work is
a separately contracted trajectory-to-outcome anatomy or a generic pass-event →
movement-intent representation, never a wider `wallRun` gate.
