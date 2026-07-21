# E2 — Emergent Pass-return Census

Status: **PRE-REGISTERED. Telemetry only; no live change.**

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
opponent control, dead ball, expiry or match end closes the episode without a
return.

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

