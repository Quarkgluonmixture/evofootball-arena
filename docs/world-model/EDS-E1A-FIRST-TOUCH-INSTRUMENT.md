# EDS E1a — The first-touch instrument

Status: **RUN 2026-07-24 — §6 is the frozen result: I1 PASSES, I2 does not
decide, probe verdict FAIL.** (Commander ruling #4, 2026-07-24:
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

## 5. E1a INTERIM — instrument built and behaviour-proven; I1's staging blocked (2026-07-24)

**Not a verdict on the frozen gates.** I1 and I2 were not evaluated at their
pre-registered samples, because the synthetic sweep cannot yet produce
adjudications across all four buckets. What is established:

### Established

* **The instrument exists and is honest.** `Match.traceFirstTouch` (default off,
  same pattern as `traceContests`) + a push inside `attemptFirstTouch` after its
  own roll. Logged per event: tick, gid, intended-target flag, relative speed,
  pressure, misalign, technique, positioning, pFail, clean.
* **Zero-behaviour proof PASSES.** Three full matches (seeds 7001–7003) run with
  the flag on and off produce identical result signatures — score, phase, ball
  state, every player's position/velocity/heading, and the RNG state at full
  time. Production fingerprint `57b0bdab…c673` unchanged with the flag off.
* **It reads the physics where an adjudication happens.** A staged reception
  logged `relativeSpeed 10.32, pressure 0.000, misalign 0.0001, pFail 0.0406,
  clean true` — the decomposition E0/E0b lacked.

### Two structural findings about where reception can be measured at all

1. **Below 6 m/s the world does not adjudicate.** `attemptFirstTouch` returns
   clean *before* the roll for `speed <= 6` (`mechanics.ts:130`), so no event
   exists to log. The instrument is blind there by construction — and so is any
   reception measurement, including C1-A2's and E0b's. Slow receptions are free
   by fiat, not by outcome.
2. **A loose rolled ball frequently never reaches an adjudication.** In the
   sweeps the M3 contact cushions the ball out of the retention window
   (`Match.ts:2051`), so the pending control attempt is abandoned and
   `attemptFirstTouch` is never called — the ball simply rolls to a stop with
   `lastTouch` set. Buckets 7 and 13 produced 60/60 events while 9 and 11
   produced none, which is this effect, not sampling noise.

Consequence: **I1 must stage a real intended pass** (`performPass` from a pinned
passer, sweeping power to sweep arrival speed) rather than a rolled loose ball,
because the intended target is the case the world actually adjudicates
(`maxSpeed` 24 for the intended target vs `CONTROL_MAX_SPEED` 14, `Match.ts:1978`).
That is a redesign of the sweep, not a gate change: I1's gates (monotone spill
rate, |empirical − logged pFail| ≤ 2.0pp per bucket, ≥400 events/bucket) and
I2's stand exactly as frozen.

### Status

`E1a` remains **in progress**: instrument accepted, sweep staging to be
rebuilt, then I1 and I2 run at their pre-registered samples. No curve may be
flipped until I1 passes — E1b stays unopened.

## 6. FROZEN RESULT — I1 PASSES, I2 DOES NOT DECIDE (2026-07-24, re-staged run)

Run at HEAD `0c54a74` under commander ruling #5.3 (re-staging, not
gate-changing: every I1/I2 gate value is the one frozen in §3).
Two invocations byte-identical, shared SHA
`93897f7995fcf39e14306b01d17be4113d51eae14e1aba5d2cab7a7e42c79c09`.
Probe verdict as emitted: **FAIL** — I1 passes, I2's adjudication returns
`unexplained`, and the probe requires both.

### The re-stage

I1 now stages a **real intended pass**: a pinned passer square to the ball
plays `performPass` to a pinned teammate facing him, every other body parked at
the far ends, and the arrival speed is swept by **power** (0.85…1.15, the legal
`PASS_POWER_MIN..MAX` range) crossed with distance 6…30 m (launch speed is
`clamp(d*0.6+8.2, 9, 22)`, so distance is the second lever). 300 reps of a
weighted grid = **44,100 staged passes**; the world adjudicated **25,491** of
them (57.8%) and 14,424 landed inside a bucket window. The held conditions
came out genuinely held: **mean pressure exactly 0** and **mean misalign
≤ 0.0005** in every bucket.

The staging fix that mattered, beyond the ruling's own diagnosis: the frozen
world must **never be allowed to play on**. An earlier cut let the engine run
restarts between trials; with every body parked the ball simply walked into an
empty net, over and over, and each restart corrupted the next staging. A staged
trial now either completes in a held world or the match is discarded.

### I1 — the instrument recovers the formula's own speed term

```text
bucket   events    empirical spill   mean logged pFail   |Δ|      analytic
 7 m/s    2,780        1.691%             1.697%        0.006pp    1.641%
 9 m/s    4,302        3.278%             3.159%        0.118pp    3.172%
11 m/s    4,478        4.757%             4.727%        0.030pp    4.703%
13 m/s    2,864        6.494%             6.183%        0.311pp    6.234%
```

Every gate clears with room: ≥400 events per bucket (6.9–11.2× the floor),
**strictly monotone** empirical spill, and |empirical − logged pFail| ≤ 0.311pp
against a 2.0pp tolerance. The empirical rate also lands within 0.31pp of the
closed-form `touchFailChance` at each bucket centre — the instrument sees known
physics where that physics provably exists. **I1 PASSES.** Per §4 that is the
condition E1b's drafting was waiting on.

### Exact validity

```text
fingerprint, flag off      57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673 (unchanged)
flag ON vs OFF             identical result signatures, seeds 7001–7003
two invocations            byte-identical, shared SHA above
tsc + build clean · 708/708 tests green · zero new src/** changes
```

### I2 — the sample cannot settle the inversion

```text
power    events   clean rate   rel. speed   pressure   misalign   mean pFail
0.85       53       0.8868        8.61        0.350      0.100      0.0739
1.00       60       0.9000        9.32        0.362      0.208      0.0843
1.15       74       0.8919       10.54        0.332      0.348      0.0978
```

Term decomposition across the outer arms: **speed +1.63pp**, **misalign
+1.24pp**, **pressure −0.23pp**.

* The **pressure-relief confound is refuted as the explanation.** Pressure at
  touch does fall with power, but by 0.23pp — an order of magnitude short of
  the 1.63pp the speed term rises. §3's first branch does not fire.
* An unbooked third term showed up instead: **misalign rises steeply with
  power** (0.100 → 0.348). A faster ball arrives before the receiver has turned
  to face it, so pace buys blind-side cost as well as speed cost. Predicted
  cost therefore rises +2.4pp in pFail across the arms.
* The measured clean rate does **not** follow it: 0.8868 / 0.9000 / 0.8919 —
  flat and non-monotone, with the middle arm highest.

The probe encoded §3's "clean rate no longer rises with power" as a two-endpoint
strict inequality, and 0.8919 > 0.8868 trips it as *rising* — by 0.5pp, on
n ≈ 60 per arm where the standard error of that difference is ≈ 5.6pp. So the
coded discriminator routes to `unexplained` rather than to `contamination
CONFIRMED`, and the probe's verdict is FAIL.

**This is reported, not patched.** Rewriting the predicate after seeing the
numbers is exactly the move the pre-registration discipline forbids, and the
sample floor (≥40/power, met at 53/60/74) was never large enough to resolve a
2.4pp predicted difference in the first place — I2 is **underpowered by
construction**, not by seed luck. The honest reading of the numbers is that
E0b's inversion does not reproduce at the clean adjudication; the honest
reading of the *gate* is that this run cannot certify which explanation holds.

### Where this leaves E1

Per the self-drive protocol a non-PASS stops the queue. Two questions belong to
the user / commander, in this order:

1. **Does I1's pass unblock E1b on its own?** §4 says E1b may be drafted "after
   I1 passes", and I1 passed on gates that were never touched. E1b's validation
   needs the instrument, which is now proven; it does not need I2's verdict.
2. **Is I2 redrawn or retired?** A powered redraw is a new pre-registration
   (more states, or the discriminator stated as an interval test rather than a
   point comparison, frozen before the run). Retiring it is also defensible:
   the decomposition already refuted the pressure-relief hypothesis it was
   built to test.
