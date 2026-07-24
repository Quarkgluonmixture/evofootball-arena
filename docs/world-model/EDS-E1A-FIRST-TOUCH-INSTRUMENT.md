# EDS E1a — The first-touch instrument

Status: **PRE-REGISTERED — no run yet.** (Commander ruling #4, 2026-07-24:
[`EMBODIED-DECISION-SLICE.md`](EMBODIED-DECISION-SLICE.md) §3 amended to
E1a → E1b, because E0/E0b measured their own instruments instead of the physics.)

Date: 2026-07-24

## 1. Why an instrument comes before any curve

Three reception measurements currently contradict each other on the same states
and seeds:

```text
eventual control (C1-A2, E0)    0.119 / 0.121 / 0.118    flat
raw 4-tick ownership (E0b)      0.220 / 0.227 / 0.158    INVERTED
the formula itself (E0 mirror)  0.073 / 0.091 / 0.113    +4.0pp
```

No touch-cost change can be validated against that. E1a builds one measurement
that is taken **at the real adjudication** — the `attemptFirstTouch` call
inside `Match.resolvePendingControlAttempt` — instead of inferred from who owns
the ball N ticks later, and it logs the **term decomposition** per event so the
speed term can be separated from the pressure and blind-side terms.

## 2. Authorised seat — logging only, zero physics

* `src/sim/Match.ts`: an opt-in `traceFirstTouch?: boolean` config flag
  (default **false**), exactly like the existing `traceContests` precedent, plus
  a `firstTouchTrace` array appended to only when the flag is on.
* `src/sim/mechanics.ts`: `attemptFirstTouch` pushes one record when tracing is
  on — `{tick, gid, intendedTarget, relativeSpeed, pressure, misalign, technique,
  positioning, pFail, clean}` — after it has computed those values for its own
  roll. No value is recomputed, no branch is added before the roll, and the RNG
  is untouched.
* New probe. No other `src/**` change; no physics, no thresholds, no curve.

## 3. Frozen gates

### Exact validity (zero-behaviour proof)

```text
fingerprint with the flag OFF        57b0bdab…c673 unchanged
flag ON vs OFF, same seed            identical result signature (score, ball,
                                     every player pos/vel, RNG state) at full time
trace completeness                   every logged event's pFail equals
                                     touchFailChance(its own logged terms)  exactly
two invocations byte-identical       shared SHA-256
tsc + build clean · full suite green
```

### I1 — the instrument must see known physics

Synthetic controlled sweeps: staged passes to an isolated stationary receiver
facing the ball, with the nearest opponent held far away, so `pressure ≈ 0` and
`misalign ≈ 0` and only arrival speed varies.

```text
>= 400 traced events per speed bucket, buckets at 7 / 9 / 11 / 13 m/s
empirical spill rate per bucket must rise monotonically
| empirical spill rate − mean logged pFail | <= 2.0pp per bucket
```

An instrument that cannot recover the formula's own speed term where that term
provably exists is broken, and E1b cannot be validated by it.

### I2 — the instrument must SETTLE the E0b inversion

Re-run C1-A2's isolated states (seeds `93,000..`, near-stationary receiver, the
three powers) with tracing on, and decompose the adjudication:

```text
report per power: clean rate at the real adjudication, mean relativeSpeed,
                  mean pressure, mean misalign, mean pFail
adjudication (the gate is that the instrument DECIDES, not which way):
  pressure-relief confound CONFIRMED  if mean pressure at touch falls with
    power AND the pressure term's fall >= the speed term's rise
  contamination CONFIRMED             if the inversion disappears under the
    clean adjudication (clean rate no longer rises with power)
minimum sample                        >= 40 traced target-receptions per power
```

## 4. Stop rules

* **I1 fails** → the instrument is wrong; fix the instrument, never the formula,
  and re-run. If the formula's own terms cannot be recovered under held
  conditions, the reception model is not measurable and E1b is blocked — report to
  the user rather than flipping a curve blind.
* **Any behaviour difference between flag ON and OFF** → revert immediately; a
  logging hook that changes the world is not a logging hook.
* **I2 cannot decide** (sample below floor) → report; do not guess which
  explanation holds.
* E1a authorises no curve change of any kind. E1b is a separate
  pre-registration, and it may only be drafted after I1 passes.
