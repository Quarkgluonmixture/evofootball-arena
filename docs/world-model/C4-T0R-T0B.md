# C4 T0R + T0b — the floor redrawn per archetype, and C2 decomposed

Status: **PRE-REGISTERED 2026-07-27 — everything below is frozen before any
implementation and before any data.** One narrow stage, counting only, zero
`src/**`, authorised at **commander ruling #28.4** and unblocked by C5 T1
landing (#29.4: C4's chain moves to the head of the road, one experiment in
flight). Nothing here may be tuned after first sight of results.

Date: 2026-07-27

## 1. What this stage is, in two halves

* **T0R** — T0's census re-run with its **coverage floor made attainable per
  archetype**. The gate text is untouched; what changes is the match budget
  behind it. C3R discipline: the seen 909,000 block DERIVES the budgets and
  does not judge; certification happens on two fresh blocks.
* **T0b** — **C2 decomposes before any v1 re-scope** (#28.4b). C2 is 27.95% of
  the crosses and is currently one number with at least two meanings: *the ball
  was never headable when it got there* and *it was headable and the contest
  did not happen*. The third application of the same rule that produced this
  stage's own headline.

**T0b's split decides C4 v1's re-aim** (#28.4b), so §6 pre-registers the
decision rule before the numbers exist.

## 2. What T0R changes, and what it may not

The failing gate was **C1: ≥300 crosses per (archetype × shell) in BOTH
blocks**, and held-out BAL vs PRESS produced 296. #28.4a fixes the remedy:

> floors derive ex ante from the build block's own per-combination cross rates,
> sized against the ATTAINABLE population via the match budget (#24: cross rate
> is population-bound, matches are not), certified on a FRESH block, gate text
> untouched.

**The cross rate is a property of the world and cannot be raised. The match
budget is mine.** So each combination gets its own budget, sized to a common
cross target rather than a common match count — which is what T0 got wrong by
running 250 matches everywhere and letting the quietest archetype fall short.

### 2.1 The per-combination budgets, derived

Target **T = 900 crosses per combination per block**, i.e. **3× the 300 floor**.
Budgets from T0's build-block rates (banked, seen — deriving is what a seen
block is for):

| combination | banked rate /match | matches = ⌈900 / rate⌉ |
| --- | --- | --- |
| CROSS vs NEUTRAL | 3.060 | **295** |
| CROSS vs BUS | 3.044 | **296** |
| CROSS vs PRESS | 2.544 | **354** |
| BAL vs NEUTRAL | 1.720 | **524** |
| BAL vs BUS | 1.592 | **566** |
| BAL vs PRESS | 1.364 | **660** |
| | | **2,695 per block** |

**Sized against block-to-block rate variation, not just against the mean.** T0
measured the build→held-out rate shift per combination: −2.5, +1.2, +0.8, −7.9,
+3.8 and **−13.2%** (BAL vs PRESS, the cell that failed). Taking the worst
observed shortfall, the minimum expected yield is **900 × 0.868 ≈ 781** crosses
— **2.6× the floor**. That margin, not the point estimate, is the reason this
floor is attainable.

### 2.2 Blocks

| role | seeds | why |
| --- | --- | --- |
| build | **880,000+** | fresh; 909k / 870k are T0's and have been seen |
| held-out | **890,000+** | fresh, disjoint |
| X4 pin | **909,000+, 250 matches** | the pin can ONLY live on `cross-anatomy`'s own staging — it compares against that probe's printed output |

The X4 pin runs **once, outside the determinism pair** (T1's `tempo`
precedent), because it is a fixed-staging equality check whose own content is
the comparison; the census that the determinism pin covers is judged on the
fresh blocks. Disclosed here rather than discovered in the diff.

## 3. What T0b measures

For every C2 cross, the arrival window additionally records:

* `bandTicks` — ticks of the descent with `HEADER_MIN_HEIGHT ≤ z ≤
  HEADER_MAX_HEIGHT`, i.e. `tryAerial`'s own outfield gate
  (`mechanics.ts:743` and `778`);
* `minOutfieldDistInBand` / `minAtkDistInBand` — the closest any outfielder /
  any attacker came to the ball **while it was in that band**;
* the window's terminal touch: role (GK or not), side, and the ball's `z`.

### 3.1 The ladder, derived from the code ex ante

`tryAerial`'s gates in their own order are what the classes are made of — the
T0R lesson applied before the data (*the code says where the gradient lives
first*). Applied to C2 crosses only, in this order:

```text
H0  HEIGHT-PREEMPTED       bandTicks == 0. The ball was never inside the
                           outfield header band during its descent, so gates 1
                           and 3 refused a contest whoever was standing there.
H1  KEEPER                 bandTicks > 0, terminal touch by a GK — gate 2.
H2  TAKEN DOWN AT HEIGHT   bandTicks > 0, terminal touch by an outfielder with
                           z >= HEADER_MIN_HEIGHT: the chest/thigh trap
                           pre-empting the header — gate 4 (`mechanics.ts:781`).
H3  NO CONTENDER AT HEIGHT bandTicks > 0, not H1/H2, and no outfielder came
                           within HEADER_RADIUS during any in-band tick — the
                           contest had no contender (gate 5). He met the ball,
                           but below the band.
H4  CONTENDER, NO HEADER   the residual. Under the code this should be close to
                           empty; it is reported as the honest unexplained
                           bucket rather than folded into a neighbour.
```

Exhaustive and mutually exclusive by construction; §4 asserts it.

**The census-geometry rule binds (#28.4b): where C2's mass sits is MEASURED,
never asserted.** Reported beside the ladder: the `bandTicks` distribution, the
ball's `z` at closest approach and at the terminal touch, and
`minOutfieldDistInBand`'s distribution — so a reader can see the geometry the
classes are cut from.

## 4. Gates

Everything from T0 is re-earned rather than assumed. **No gate below is
disclosed as under-powered — per ruling #29.5 that is now a freeze-time
requirement, not something a pre-run note can excuse.**

### 4.1 X — identity and definition

| gate | predicate | power / margin |
| --- | --- | --- |
| **X1** | fingerprint `57b0bdab…c673` unchanged | exact |
| **X2** | zero `src/**`; `cross-anatomy` / `aerial-anatomy` / `cutback-anatomy` unedited | exact |
| **X3** | two `runExperiment()` calls byte-identical, SHA emitted | exact |
| **X4** | the rollup pin, on 909,000: the recomputed old statistic reproduces the unmodified `cross-anatomy`'s printed output on all six combinations, and the rollup identity holds to the integer | exact; earned at T0, re-earned here |
| **X5** | the four classes partition the crosses, both fresh blocks | exact |
| **X6** | the **C2 ladder** partitions C2 exactly (H0…H4 sum to C2, no cross in two) | exact |

### 4.2 C — coverage, each floor sized with a stated margin

```text
C1  >= 300 crosses per combination, BOTH blocks     expected >= 781  (2.6x)
C2  >= 3,000 crosses pooled, BOTH blocks            expected ~5,300  (1.8x)
C3  >= 400 C2 crosses pooled, BOTH blocks           expected ~1,480  (3.7x)
```

C3's floor is derived from what the split needs rather than from a habit: a
sub-share resolved to ±5pp at 95% needs n ≈ 400. The expectation uses T0's
banked pooled C2 share of 0.2795 on the smallest plausible pooled yield.

### 4.3 S — stability across disjoint blocks

```text
S1  | share_build − share_heldout | <= 3.5pp  for each of C0, C1, C2, C3
S2  | share_build − share_heldout | <= 7.0pp  for each of H0..H4, as a share of C2
```

S1's tolerance is T0's, verbatim, and is **better powered here**: at ~5,300
pooled the difference SE at the worst-case share 0.5 is 0.96pp, so 3.5pp is
**3.6σ** (T0 ran it at 2.85σ and said so). S2 is derived the same way: at
~1,480 pooled C2 the difference SE at 0.5 is ≈1.9pp, so 7.0pp is **3.7σ**.

### 4.4 What is NOT gated

The census, the arriver geometry, the flight profile, the conversion baseline
and the C2 ladder's own shares — all reported. A baseline gated against itself
is circular, and #28.4b makes the ladder's shares a DECISION input, which is a
different job from a gate.

## 5. I2's baseline, now named

#28.5 names the conversion ceiling as **this census's goal-within-4.0 s-window
per combination** (T0 banked build 10.27% / held-out 10.73%; ROADMAP's ≈5% is
retired from gate duty). T0R re-measures it on two fresh blocks and reports it
per combination and pooled. **T0R changes no code, so conversion cannot move
here** — this is the ceiling's re-measurement on clean blocks, not a test.

## 6. The decision rule — pre-registered before the numbers (#28.4b)

T0b's split decides C4 v1's re-aim. The rule is fixed now, on H0's share of C2
with a 95% cluster bootstrap over match seeds:

```text
HEIGHT-DOMINATED    H0's CI lower bound > 0.50
                    ⇒ the delivery's FLIGHT PROFILE becomes C4 v1's named
                      seat, in its own contract. The I2 ceiling binds any
                      delivery change HARD (#28.5), and Q1's amendment
                      (#28.5: aim healthy, flight not covered) is the ground
                      it stands on.

CONTEST-DOMINATED   H0's CI upper bound < 0.50
                    ⇒ Q3's deferral is formally reversed and the CONTEST
                      (time, the rng(0,0.45) die, preemption) becomes v1's
                      seat — #28.3(ii) already refuted "a duel model without
                      arrivals has nothing to contest".

MIXED               the interval straddles 0.50
                    ⇒ sequenced on the measured shares, commander's call.
```

In all three the routing fix (old T1) stays demoted to a 5.70pp repair, queued
behind the re-aim with its expectations re-registered (#28.4b).

**None of the three is a FAIL.** T0R+T0b fails only on §4.

## 7. Result

*(empty — this document is the pre-registration. The run fills this section.)*

## 8. Stop rules

* **Any X, C or S gate fails ⇒ FAIL**, and the fork returns to the commander.
  A second coverage failure after this re-sizing would mean the budget model
  itself is wrong, which is a finding and not a third redraw.
* **No re-cutting after sight**: not the ladder, not the band, not the radius,
  not the window, not the decision rule in §6.
* No third redraw of the coverage floor without a ruling.
* No stage may be rescued by tuning a neighbour.
