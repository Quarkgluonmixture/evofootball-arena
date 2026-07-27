# C4 T1-FLIGHT — the ball gets up

Status: **PRE-REGISTERED 2026-07-27 — everything below is frozen before any
implementation and before any data.** C4 v1's first stage under **commander
ruling #30.3** and the design contract's
[§5.5 re-aim amendment](C4-AERIAL-ARRIVAL.md). Autonomous mode, one experiment
in flight. Nothing here may be tuned after first sight of results.

Date: 2026-07-27

## 1. What T1-FLIGHT is

T0b closed C2 with residual zero and named the seat: **H0 height-preempted
56.78%** — the ball was never inside the outfield header band when it arrived,
so no contest could occur whoever was standing there. Its deliveries peak at a
median **1.00–1.06 m** against a **1.35 m** floor. #30.2's banked sentence:
*nobody is absent — the aerial game fails by a third of a metre of flight and
half a metre of arrival.*

T1-FLIGHT makes the ball get up. **Aim geometry is untouched** (Q1's surviving
half), the mechanism is derived from the code in §2 below, and every guard is
carried: I2 HARD, the §2 band, the behavioural suite, the #20 battery and
co-evolution.

## 2. The mechanism, derived from the code before any data (#30.3)

### 2.1 The arithmetic

`performCross` (`mechanics.ts:552-595`) delegates the flight to
`loftKick(match, crosser, spot, 0.5, 0.038, 0.7, 1.7, 1.1, spin)`
(`mechanics.ts:512-544`), which computes

```text
T  = clamp(tBase + dEff·tPerM, tMin, tMax)   = clamp(0.5 + dEff·0.038, 0.7, 1.7)
kickBall(..., speed = dEff / T, loft = GRAVITY·T/2)
```

That is a plain ballistic launch: apex at `T/2`, and

```text
peak = vz² / 2g = (gT/2)² / 2g = g·T² / 8 = 1.22625 · T²      (GRAVITY 9.81, constants.ts:176)
```

Setting `peak ≥ HEADER_MIN_HEIGHT` (1.35 m, `constants.ts:186`):

```text
T    ≥ √(8 · 1.35 / 9.81)      = 1.04925 s
dEff ≥ (1.04925 − 0.5) / 0.038 = 14.454 m
```

⭐ **A cross whose effective range is under ~14.5 m cannot reach header height.
That is arithmetic, not tuning.** At the current `tMin` of 0.7 s the apex is
**0.601 m**; at `tMax` 1.7 s it is 3.544 m.

### 2.2 The prediction this makes about T0b's own numbers

Inverting `peak = 1.22625·T²` on the measured medians, **registered here as an
ex-ante prediction the run will check**:

```text
H0 (peak 1.00–1.06 m)  ⇒ T ≈ 0.903–0.930 s ⇒ dEff ≈ 10.6–11.3 m
BAL crosses (2.19–2.26) ⇒ T ≈ 1.337–1.358 s ⇒ dEff ≈ 22.0–22.6 m
```

⭐⭐ **If that holds, the archetype gap is a DISTANCE gap, not a flight-law
gap**: CROSS-archetype deliveries (60–62% headable) are struck from ~11 m and
BAL's (76–84%) from ~22 m, through one shared law. The flight curve is not
broken; it is *a function of distance only*, and a short cross therefore cannot
be lofted. **F3 measures this and it is REPORTED, not gated** — if it holds it
is a finding the commander needs, because it says the cross TRIGGER's distance
is a second seat that neither the aim nor the flight owns.

### 2.3 The intervention

**Flag `c4Flight` (`MatchConfig`, default `EDS_BUNDLE_ARMED` = false).** In
`performCross` **only** — no other `loftKick` caller is touched — the flight
time gains a floor at the apex that clears the band:

```text
T_HEAD = √(8 · HEADER_MIN_HEIGHT / GRAVITY)     // 1.04925 s, DERIVED
tMin:  0.7  →  T_HEAD          (crosses only, flag on)
```

**One derived constant and no free parameter.** The value is not chosen; it is
the solution of `peak(T) = HEADER_MIN_HEIGHT`, and it is written in the code as
that expression, not as a literal.

Everything the change carries with it is automatic, and is **reported, never
tuned**:

* **horizontal speed falls** to `dEff/T` on short crosses (a 10 m delivery:
  11.4 → 9.5 m/s);
* **hang time rises** (10 m: 0.88 → 1.049 s) — and that gives the DEFENCE the
  same extra time it gives the attack. An honest symmetric cost, not a
  subsidy;
* **the Magnus pre-compensation** `−spin·T/2` scales with T, so the closed-form
  landing invariance the comment at `mechanics.ts:539-542` describes still
  holds.

**Why technique does not scale the floor.** Getting a cross airborne is not the
hard part of crossing; putting it in the right place is — and that half is
*already* technique-priced through `loftKick`'s existing noise and range-error
channels (`1.3 − passing·0.55`, `1.25 − passing·0.5`, `orientationNoiseMul`,
`orientationPowerMul`). Adding a second technique term to the capability would
price the same attribute twice, which is exactly the double-pay hazard #28.5
registered for `attacking = 0.3`.

### 2.4 ⚠️ The one interpretive call, surfaced for the commander to reverse

`performCross` leads the target's run by `target.vel × flight0 ×
CROSS_LEAD_FRAC` where `flight0 = clamp(0.5 + d·0.038, 0.7, 1.7)` — **the same
law**, used as the crosser's estimate of his own flight time. So "aim
untouched" has two readings:

* **literal** — leave `flight0` alone. The aim NUMBER is unchanged, and the aim
  RULE ("lead the run by a meetable fraction of the flight") silently becomes
  wrong: on short crosses the true flight is now longer than the estimate, so
  every running target is systematically under-led.
* **rule-preserving** — `flight0` takes the same floor. The aim number moves,
  by at most `CROSS_LEAD_MAX` 3.5 m and only for moving targets, and the rule
  keeps meaning what it says.

**PRIMARY = rule-preserving**, because #30 protected Q1's surviving half, and
Q1's surviving half is the *rule* (lead/pull/curl are well built), not a stale
input to it. A lead computed from a flight time the ball no longer has is not
the aim geometry being preserved; it is the aim geometry being broken by
omission.

**The literal variant runs as a REPORTED Phase-A arm** so the choice is
measured rather than argued, and **this is flagged as the single place I
interpreted the ruling** — the commander can reverse it before the run at no
cost.

## 3. Staging, frozen

| item | value |
| --- | --- |
| Phase A block | seeds **900,000+**, fresh (830/840/850/860/870/880/890/909 all seen) |
| Phase A staging | T0R's six archetype × shell combinations and its per-combination match budgets, verbatim (295/296/354/524/566/660) |
| arms | **paired same-seed**: flag OFF vs flag ON, plus the §2.4 literal-lead variant (reported) |
| Phase B | the live battery, §5 — 8-season paired calibrate seed `20260702` + fresh evo |
| cluster unit | the match seed (#20) |
| bootstrap | 2,000 resamples, frozen seed **50013** |

**Pairing is why one block suffices**: T0R already established the census
replicates across blocks (S1 max 0.85pp), and every gate below is a same-seed
DIFFERENCE, not a level.

## 4. Phase A — gates

Every gate is powered ex ante; **none is disclosed as weak** (#29.5).

### 4.1 X — identity

| gate | predicate |
| --- | --- |
| **X1** | flag OFF: `npm run fingerprint` returns `57b0bdab…c673`, unchanged |
| **X2** | flag OFF: byte-identical world signatures to the pre-change HEAD on 3 league seeds × 2 seasons |
| **X3** | **no other lofted kick moves**: a test asserts `c4Flight` is read in exactly one place and that every other `loftKick` call site passes unchanged parameters |
| **X4** | **AIM IDENTITY — the exact form of "aim untouched"**: for a frozen set of cross states with a **stationary** target (`target.vel = 0` ⇒ lead = 0 ⇒ `spot` cannot depend on `flight0`), the designed landing `spot` is **byte-identical** flag-on vs flag-off. This pin survives the §2.4 fork and is the one that makes the claim checkable |
| **X5** | two `runExperiment()` calls byte-identical, SHA emitted |

### 4.2 F — the mechanism fires (layer 1 of the six-layer chain)

```text
F1  the LAUNCH-derived apex, vz^2/(2g), is >= HEADER_MIN_HEIGHT for 100% of
    crosses, flag ON                                    (exact, no sampling)
F2  the measured maxZ matches that launch-derived apex to within 1e-3 m
```

⚠️ **AMENDED BEFORE THE RUN, in its own commit.** As first frozen, F1 tested
the *sampled* `maxZ` against 1.35 m and F2 asked for 1e-6. Both are
**unpassable by construction**: the floor puts a short cross's apex at exactly
1.35 m, and a parabola read at tick boundaries under-reads its apex by up to
`g·(dt/2)²/2 = 3.4e-4 m`, so the sampled value can sit just below the very
threshold the mechanism guarantees. F1 now reads the LAUNCH (`vz`, exact and
sampling-free); F2's tolerance is **3× the analytic sampling bound**. The
`maxZ`-based headable share is reported alongside for continuity with T0R's
instrument. #29.5 applied to my own gates — a predicate that cannot fire is
not a gate.

**F1 is tautological by construction, and that is exactly why it is a FIRES
gate and not a payoff.** It proves the mechanism reached the world; it proves
nothing about whether the world is better. The payoff is D1.

### 4.2c ⚠️ Instrument facts disclosed before the run, in their own commit

Four things a read-only sizing smoke surfaced. None touches a gate value, the
mechanism, D1, I2's margin, the band or §6's readings; all four are about
making the F gates measure what they claim.

1. **The apex reference is the ENGINE's own integration, not the textbook
   parabola.** `Match.stepBall` is semi-implicit Euler (`z += vz·dt;
   vz -= g·dt`), whose discrete apex sits ≈`vz·dt/2` ABOVE the continuous
   `vz²/(2g)` — **measured at 0.053 m**, which is 50× the tick-sampling bound
   F2's tolerance was derived against. The probe now replays the recurrence, so
   the reference is exact rather than approximate; the frozen 1e-3 tolerance is
   untouched and the smoke's worst error is **0**.
2. **F1/F2's population is deliveries whose LAUNCH was actually captured.** On
   ~2–5% of `stats.crosses` increments the ball reads as a low BOUNCING ball at
   the capture boundary rather than a fresh loft. ⚠️ **This is pre-existing and
   arm-independent — it occurs with the flag OFF too — so it is not caused by
   T1-FLIGHT, and it equally affects the banked T0/T0R census, which shares
   this detection code.** The validity threshold is taken from the FLAG-OFF
   floor (`vz ≥ g·0.7/2 − g·dt`) so the two arms are filtered identically; the
   excluded count is reported per arm. **Registered for the commander: the
   cause was not chased, because it changes no class and no gate — but it is a
   latent caveat on a banked instrument.**
3. **F2 additionally needs a flight that REACHED its apex**: untouched through
   the window and not truncated by the next cross's early-close (cross-anatomy's
   inherited rule). A delivery cut out on the way up never reaches its apex and
   its `|maxZ − apex|` is large and honest.
4. **`maxZ` stops at the first non-crosser touch.** It was folding a header's
   own rebound into the delivery's peak — a 1.47 m error on the smoke.

### 4.3 D — the deliverable (#28.4's "CONTESTS, never goals")

```text
D1  the CONTEST share of crosses — (C3atk + C3def) — RISES flag-on vs
    flag-off, paired same-seed, 95% cluster-bootstrap CI lower bound > 0
```

**Power, derived**: contests run at 57.75% of crosses (T0R: 25.13 + 32.62), so
at n ≈ 5,400 per arm the unpaired difference SE is 0.95pp and the MDE at 80% is
**2.7pp** — pairing shrinks it further. The expected effect: **14.9% of all
crosses are height-preempted** (H0 56.78% × C2 26.21%), so converting even a
third of them to contests is **≈ +5pp** — a **1.9×** margin over the MDE.

### 4.4 The T0b ladder re-runs — the partition question answered (#30.3)

The ladder re-runs flag-on, verbatim. **Reported, not gated**, because it is
the measurement T2-ARRIVAL is sized from:

```text
L1  H0's share of C2 flag-on (expected to collapse — the mechanism's own echo)
L2  H3's SURVIVING share and its distance geometry — whatever half-metre
    remains once the height problem is gone is T2-ARRIVAL's measured target,
    and this is the direct answer to T0R §7.4's partition-not-causal caveat
L3  H1 keeper: was exactly 0.00%. A ball that hangs longer spends more time
    inside GK_CLAIM_HEIGHT, so this is the pre-laid place for the mechanism to
    backfire, and it is watched rather than assumed
```

### 4.5 I2 — the conversion ceiling, HARD (#30.4)

**Re-derived, because the obvious form cannot fire.** A resolved-increase test
on goal-within-window is under-powered for the effect that matters: at
p ≈ 0.105 and n ≈ 5,400 the difference SE is 0.59pp, while a +5pp contest rise
at unchanged per-contest conversion moves goals by ≈0.5pp — **below the MDE**,
so the gate would pass trivially whatever happened. #29.5 forbids running a
gate that cannot distinguish its own readings, so I2 takes the interval form
PROBE-CONTRACTS §2 names for exactly this claim:

```text
I2  the 95% cluster-bootstrap CI UPPER bound on the paired difference in
    goal-within-4.0s-window must be BELOW +1.5pp                    (HARD)
```

**1.5pp is derived, not chosen**: T0R measured the block-to-block spread of
this very quantity at **1.2–1.46pp** (10.48% vs 11.94%), and #30.4 says I2 is
judged against that spread. An increase smaller than the census's own block
noise cannot honestly be called a conversion rise; one larger than it can. At
SE 0.59pp the upper bound sits ≈1.16pp above the point estimate, so a true zero
passes with room and a true +1.5pp fails.

Reference = the T0R census's banked per-combination rates (#30.4, superseding
#28.5). **Reported beside it**: goals per contest, the quantity that says
whether a rise came from more contests or from better ones.

### 4.6 Reported, never gated

Cross distance distribution and the §2.2 prediction check (F3); hang time and
horizontal speed distributions; C0's composition (a longer flight is a longer
window to be cut out — the honest place for the change to cost something);
the §2.4 literal-lead arm; per-combination everything.

## 5. Phase B — the live battery

**Phase B runs only if Phase A's X-series and D1 pass.** A mechanism that does
not reach the world, or reaches it and buys no contests, does not deserve an
8-season calibrate. Frozen here so the sequencing cannot be re-argued later.

### 5.1 §2 EQUILIBRIUM BAND (hard abort — C1 §4 verbatim, inherited whole)

8-season paired calibrate, seed `20260702`, against the frozen baseline
`goals 2.3944 · crosses 2.4894 · headers 9.1039 · long balls 6.2042 ·
cutbacks 3.8151`:

```text
goals/match        within ±15%        2.0352 .. 2.7536
crosses            within ±25%        1.8671 .. 3.1118
headers won        within ±25%        6.8279 .. 11.3799
long balls         within ±25%        4.6532 .. 7.7553
cutbacks           within ±25%        2.8613 .. 4.7689
```

⚠️ **Registered in advance: headers-won ±25% is the binding constraint against
this stage's own deliverable, and the two can both be right.** T1-FLIGHT exists
to produce more aerial contests; the band caps them at +25%; E3's bundle broke
this exact dimension at +30.44%. **If the deliverable passes and the band
breaks, that is an honest FAIL and it returns to the commander** — it would
mean *honest flight is worth more contests than the watchability band allows*,
which is a real finding about the game and not a reason to weaken either side.
Per #30.3 the band is a guard, never a hand re-tune.

### 5.2 BEHAVIOURAL CONTRACT SUITE

```text
aerial.test.ts   "wide teams cross more" — must NOT invert
stamina.test.ts  "a full match SPENDS the tank"
freeAgents.test.ts / market
full vitest suite green
```

A suite test encoding old cross numbers and failing is **a finding to report,
not something to re-baseline** (C1-B §12.4, verbatim).

### 5.3 CO-EVOLUTION RESTORATION

```text
sealed fresh evo, >= 10 seasons, both sides under the flag:
  the attacking advantage at generation 1 must SHRINK by generation 10
  style diversity: the spread must not fall below 60% of the flags-off run's
```

#30.3 says selection choosing more crossing on honest flight is **emergence,
not a defect**. This is where that is checked rather than asserted: emergence
is a defence that co-evolves, a runaway is one that does not.

### 5.4 WATCHABILITY + PERF (#20)

Ruling #15's six counters reported (forward-pass share, third-man, overlaps,
give-and-gos, shots, longest chain); the **offside canary** reported (a flight
change moves no bodies, so a move here would falsify that expectation); perf
budget per PROBE-CONTRACTS §5.5, phone-binding.

**No second dominance canary is invented.** #30.3 makes the band and the
ceiling the guards against crossing running away; adding another threshold
would be a number nobody powered.

## 6. Pre-laid readings

```text
(a) FIRES + PAYS + guards hold        the flight was the seat. T2-ARRIVAL
                                      then runs on L2's measured residual.
(b) FIRES, no PAYS (D1 flat)          the ball gets up and contests do NOT
                                      rise ⇒ the half-metre of ARRIVAL was the
                                      binding constraint all along, H0 was a
                                      correlate, and T0R §7.4's caveat is
                                      answered against the flight. Returns to
                                      the commander; T2-ARRIVAL becomes v1.
(c) FIRES + PAYS, band breaks         honest flight buys more aerial football
                                      than §2 permits. Commander's call, and
                                      the numbers say which dimension.
(d) I2 fires                          conversion rose past the block noise ⇒
                                      HARD abort by #30.4, whatever else passed.
```

## 7. Result — PHASE A RUN 2026-07-27: ⛔ **FAIL on F2. Everything the stage exists to measure landed.**

SHA `7a1afab2…5075`, twice byte-identical. **5,547 / 5,633 / 5,548 crosses**
across the three arms on block 900,000. Fingerprint `57b0bdab…c673` unchanged
with the flag off; **820/820** tests green; tsc + build clean.

| gate | result | |
| --- | --- | --- |
| **X1** fingerprint, flag off | `57b0bdab…c673` unchanged | ✅ |
| **F1** launch apex ≥ 1.35 m for 100% of crosses, flag ON | **100.00%** (flag off: 74.02%) | ✅ |
| **F2** measured `maxZ` matches the engine-recurrence apex ≤1e-3 | worst **1.0219 m** — on **1 cross of 5,547**; the other 5,546 are **exactly 0** | ⛔ |
| **D1** contests up, CI lower > 0 | **57.36% → 60.78% = +3.42pp**, CI **[2.14, 4.69]** | ✅ |
| **I2** goal-window CI upper < +1.5pp (HARD) | **−2.05pp**, CI **[−2.82, −1.35]** | ✅ |
| partition · ladder partition · determinism | all hold, two runs byte-identical | ✅ |

### 7.1 The FAIL is my gate, again, and I am not re-scoping it

F2 is a **max over 5,547 records with a 1e-3 tolerance**. It fired on exactly
one delivery, whose measured peak (2.661 m) is 1.02 m ABOVE the apex its launch
capture implies (1.639 m) — the ball rose higher than the kick that was
recorded. Diagnosed read-only: it is a delivery **re-struck by the same player
inside its own window**, so `lastTouch` never changes, the `maxZ` guard never
trips, and the capture's apex and the observed peak describe two different
kicks. Its class is `C3def`, `band = 40`, no touch registered.

**A max-statistic over thousands of records at a tight tolerance is a
coupon-collector gate** — it asks that no single record anywhere be
pathological, which is a different claim from "the arithmetic reached the
world". That is a gate-design defect I own, and it is the **second time in this
stage** my own instrument has fired rather than the world (the first, F1/F2's
sampling forms, was caught before the run; this one was not).

**It is not re-scoped after sight** (§8), and the honest verdict stands: the
stage FAILED. What the commander needs alongside it is that the arithmetic is
verified on **5,546 of 5,547** crosses at error exactly **0**, and F1 — the
launch-side statement of the same claim, evaluated on all 5,466 valid launches
— passes at **100.00%**.

### 7.2 ⭐⭐ The mechanism works, and it does exactly what it was aimed at

```text
apex        1.871 → 1.964 m          headable by launch  74.02% → 100.00%
bandTicks   15.37 → 16.92            headable by maxZ    69.66% →  85.74%
H0 height-preempted   54.76% → 1.62% of C2
```

H0 — the rung that motivated the whole re-aim — **collapses from 54.76% to
1.62%**. The ball gets up.

### 7.3 ⭐⭐⭐ And the payoff is real but it goes to the DEFENCE

Contests rise **+3.42pp** (CI [2.14, 4.69]), clearing the pre-registered 2.7pp
MDE. Split by side:

```text
C3atk   24.19% → 25.17%   +0.98pp
C3def   33.17% → 35.61%   +2.44pp     ← 71% of the new contests
```

**A higher ball favours the defending side in this substrate.** Nobody designed
that; it falls out of giving both sides the same extra hang time, which §2.3
registered in advance as an honest symmetric cost.

And conversion moved the other way, resolved:

```text
goals within the window   10.76% →  8.72%    −2.05pp  CI [−2.82, −1.35]
shots within the window   35.19% → 34.00%    −1.19pp  CI [−2.41, −0.10]
```

Per #31.2 the point is reported beside the verdict: this is not "did not rise
beyond resolution" — it is a **resolved DECREASE**. I2's ceiling is respected
with enormous room, and the honest reading is that **honest flight makes
crossing produce more aerial football and fewer goals.**

### 7.4 ⭐⭐ The partition question is answered — against the flight

T0R §7.4 flagged that H0 and H3 were a partition, not a causal decomposition,
and warned that *"fix the height and H3 shrinks too"* was untestable then. It
is tested now, and the answer is the opposite:

```text
H3 as a share of C2         43.63% → 95.13%
H3 as a share of ALL crosses 11.74% → 22.90%     ← it nearly DOUBLED
H3 nearest man, median       2.08 m →  2.39 m    ← and got FARTHER
H3 within 2 m                47.0%  →  33.0%
```

**Fixing the height did not shrink the arrival problem; it enlarged it.**
Deliveries that were previously un-headable by construction now arrive
headable — and find nobody inside the contest radius. The half-metre of arrival
is no longer one of two stories; it is the whole remaining story, and it is
T2-ARRIVAL's measured target, sized here at **22.90% of all crosses**.

### 7.5 §2.4's fork cost nothing — measured, as registered

The stale-lead arm, run only so the choice would be measured rather than
argued:

```text
                    rule-preserving (primary)   stale-lead (variant)
contests                    60.78%                    60.71%
goals                        8.72%                     9.19%
H0 share of C2               1.62%                     1.89%
```

**The two are indistinguishable on the deliverable.** #31.1's call was right and
also cheap — the interpretation the discipline preferred cost nothing, which is
worth knowing the next time the same fork appears.

### 7.6 Reported

Not-a-launch-at-capture 150 / 167 / 173 per arm (the pre-existing §4.2c
caveat, flag-independent as predicted); clean-flight population 198 / 193 / 188
(F2's slice is 3.5% of crosses, which is itself a scoping fact worth the
commander's eye); C0 10.76% → 11.68% (a longer flight is a longer window to be
cut out — the honest place for the change to cost something, and it does);
C1 4.98% → 3.46%; C2 26.90% → 24.07%.

### 7.7 Disposition

**FAIL ⇒ the fork returns to the commander** (§8). **Phase B does NOT run** —
its condition (X-series + D1) is met in substance, but §8 makes a FAIL stop the
stage before the expensive half, and running an 8-season calibrate off a failed
stage would be exactly the improvisation the discipline forbids.

Nothing shipped: `c4Flight` is default OFF, the flags-off fingerprint is
untouched, and the suite is green. The `src` change stays committed and dormant
so the next ruling has it in hand (the E1b precedent).

**What the commander is holding**: a mechanism that provably works (F1 100%, H0
1.62%), a resolved deliverable (+3.42pp contests) that is 71% defensive, a
resolved conversion DECREASE, a doubled arrival gap that names T2-ARRIVAL's
target — and one instrument gate that fired on a single re-struck delivery.

## 8. Stop rules

* **Any X gate fails ⇒ FAIL**; a flagged stage that moves the flags-off world
  has failed at its only unconditional job.
* **F1/F2 fail ⇒ FAIL** — the arithmetic did not reach the world.
* **D1 fails ⇒ reading (b)**, stop, return to the commander. No re-pose of the
  mechanism by this session.
* **I2 fires ⇒ HARD abort** (#30.4), regardless of every other gate.
* **§2 band or the behavioural suite breaks ⇒ FAIL and honest revert**, the
  C1-B precedent; the flag stays default-off and nothing ships either way.
* Nothing ships from this stage in any case: the ship gate is the E4 preview
  round, the user's, per #26.1.
* No re-cutting after sight — not `T_HEAD`, not the band, not I2's margin, not
  §6's readings. No second redraw of the mechanism without a ruling.
