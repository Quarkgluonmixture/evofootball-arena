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

### 3.2 ⚠️ DISCLOSED BEFORE THE RUN, in its own commit

Two implementation facts found by a sizing smoke and a read-only diagnostic,
**before** the frozen run. Neither moves a gate, a block or the §6 rule.

1. **`terminalZ` is the height the touch happened AT, not after it.** The
   contact resolves INSIDE the step, so by the time a boundary sees a new
   `lastTouch` the ball has already been knocked down. Read post-contact, H2
   (*taken down at head height*) was **unfireable by construction** — a class
   that can only ever return zero, which PROBE-CONTRACTS §2 outlaws. It now
   reads the previous boundary's height, which is the closest available
   estimate of the contact height. Same defect family as T0's §3.3.1, caught
   the same way.
2. **Two geometry quantities are ADDED to the reported set**, because the
   diagnostic showed the re-aim will turn on them and the ladder alone cannot
   express them. In the smoke, C2 crosses with a real band pass had the nearest
   body **1.44–1.88 m** away while the ball was headable — *just* outside the
   1.35 m radius — and were then collected at **1.15–1.32 m**, just below the
   band. **A body 0.1 m outside the contest radius and a body 4 m away are the
   same class and different worlds**, so H3 now reports its
   `minOutfieldDistInBand` distribution and its within-2 m / within-3 m shares,
   and H0 reports the median peak height of its deliveries. Reported, not
   gated — §6's decision rule is untouched.

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

## 7. Result — RUN 2026-07-27: ✅ **PASS, every gate. Re-aim = HEIGHT-DOMINATED.**

SHA `55b2e4a8…7528`, twice byte-identical. **5,571 crosses build / 5,517
held-out** over 5,390 matches. Zero `src/**`, fingerprint `57b0bdab…c673`
unchanged.

| gate | result | |
| --- | --- | --- |
| **X4** rollup pin on 909,000 | reproduces the unmodified `cross-anatomy` on all six combinations, exactly | ✅ |
| **X5** four-class partition | holds, both fresh blocks | ✅ |
| **X6** C2 ladder partition | holds, both fresh blocks | ✅ |
| **C1** ≥300 crosses per combination, both blocks | build **911–967**, held-out **849–996** (smallest **2.8×** the floor) | ✅ |
| **C2** ≥3,000 pooled | 5,571 / 5,517 | ✅ |
| **C3** ≥400 C2 pooled | **1,460** / 1,445 (3.6×) | ✅ |
| **S1** class shares ≤3.5pp | max **0.85pp** | ✅ |
| **S2** ladder shares ≤7.0pp | max **1.07pp** | ✅ |
| **D** determinism | two runs byte-identical | ✅ |

### 7.1 The budget model worked, and that is the whole point of T0R

Sizing to a common cross **target** instead of a common match count put every
combination between **911 and 967** on the build block and **849 and 996** on
the held-out one — the cell that failed T0 at 296 now returns **930 / 867**.
The derivation held: the worst block-to-block shortfall this run was well
inside the −13.2% the budgets were sized against.

**Nothing about the gate changed** — C1 is still "≥300 crosses per combination
in both blocks". Only the number of matches behind it moved, which is the only
thing #24 says was ever mine to move.

### 7.2 ⭐ The census replicates on two entirely fresh blocks

T0's numbers came from 909k/870k. These come from 880k/890k, and the four
classes land in the same place:

| | C0 | C1 | C2 | C3atk | C3def |
| --- | --- | --- | --- | --- | --- |
| T0 (909k) | 10.90 | 5.70 | 27.95 | 24.71 | 30.74 |
| **T0R build (880k)** | **10.05** | **6.00** | **26.21** | **25.13** | **32.62** |
| T0R held-out (890k) | 10.60 | 6.85 | 26.23 | 24.89 | 33.17 |

Independent replication of the headline — `noAerial` is still one part in eight
"nobody there" — on blocks that had never been looked at. The X4 pin
reproducing `cross-anatomy` exactly at the same time means both the old
instrument and the new one are intact.

### 7.3 ⭐⭐⭐ T0b: the ladder explains C2 completely, and the residual is ZERO

Pooled over the build block, **n = 1,460 C2 crosses**, 95% cluster bootstrap:

| rung | count | share | CI |
| --- | --- | --- | --- |
| **H0** height-preempted | 829 | **56.78%** | [54.19, 59.36] |
| **H1** keeper | 0 | **0.00%** | [0, 0] |
| **H2** taken down at head height | 20 | **1.37%** | [0.82, 1.99] |
| **H3** no contender at height | 611 | **41.85%** | [39.43, 44.59] |
| **H4** contender, no header — the residual | **0** | **0.00%** | [0, 0] |

Held-out agrees rung for rung (57.85 / 0 / 0.83 / 41.18 / **0.14**).

⭐ **H4 is empty.** A ladder derived from `tryAerial`'s own gate order, written
before the data, accounts for **every single C2 cross** but two out of 2,905.
That is the strongest possible form of "the code says where the gradient lives
before the data does" — there is no unexplained mass to go looking for.

⭐ **H1 is exactly zero, which is itself a finding**: keeper claims are real,
but they all happen *before* arrival — they sit in C0, not in C2. The keeper is
not why deliveries go unheaded.

⚠️ **H2 would have read zero without the pre-run fix.** §3.2 caught
`terminalZ` being read after the contact; at 1.37% the chest trap is small but
real, and an unfixed instrument would have reported it as absent and made the
ladder look cleaner than it is.

### 7.4 ⭐⭐ Both dominant rungs are MARGINS, not absences

This is the part that decides what C4 v1 can be.

**H0 — the ball never gets up.** The deliveries in this rung peak at a median
of **1.00–1.06 m** across all six combinations. `HEADER_MIN_HEIGHT` is 1.35 m,
so these are not marginal misses of the band: they are **a third of a metre
below its floor**, consistently. Pooled headable share (any cross reaching
1.35 m) is **60–62% for the CROSS archetype and 76–84% for BAL**.

**H3 — the bodies are 0.4–0.9 m short of a 1.35 m radius.** While the ball was
headable, the nearest outfielder's median distance was **1.75–2.20 m**, with
p10 **1.42–1.53 m** — i.e. even the closest tenth were *just* outside the
radius. And:

| combination | H3 n | median nearest | **within 2 m** | within 3 m |
| --- | --- | --- | --- | --- |
| CROSS vs NEUTRAL | 118 | 2.20 m | 39.8% | 79.7% |
| CROSS vs BUS | 113 | 2.07 m | 42.5% | 72.6% |
| CROSS vs PRESS | 115 | 2.08 m | 44.3% | 87.0% |
| BAL vs NEUTRAL | 96 | 1.75 m | **61.5%** | 84.4% |
| BAL vs BUS | 78 | 1.96 m | 53.8% | 91.0% |
| BAL vs PRESS | 91 | 1.77 m | **65.9%** | 91.2% |

**Nobody is absent. Everybody is close and nobody is close enough.** That
sharpens #28.3(ii) from "the box fills" to a number: the contest fails by
roughly half a metre.

⚠️ **Registered honestly: H0 and H3 are a PARTITION, not a causal
decomposition.** A low delivery also spends fewer ticks in the band, so it has
fewer chances to have someone inside the radius — the two rungs are not
independent, and "fix the height and H3 shrinks too" is a hypothesis this
census cannot test. Any contract built on the split has to own that.

### 7.5 The re-aim, by §6's frozen rule

```text
H0's share of C2 = 56.78%, CI [54.19, 59.36] — lower bound > 0.50
⇒ HEIGHT-DOMINATED
⇒ the delivery's FLIGHT PROFILE becomes C4 v1's named seat, in its own
  contract, with the I2 ceiling binding HARD (#28.4b, #28.5).
```

⚠️ **But the verdict is archetype-dependent and the pooled number hides it.**
H0's share of C2 is **59–61% for the CROSS archetype and 46–54% for BAL** — the
balanced side, whose deliveries DO get up (76–84% headable), is close to
contest-dominated by the same rule. The pooled verdict is what §6 froze and it
is what fires; whether a flight-profile contract should be scoped to the
cross-spam archetype or to the delivery generally is a commander call this
census can inform but did not pre-register.

### 7.6 I2's baseline, re-measured on fresh blocks

Shot-within-window **36.24%** build / 36.92% held-out; **goal-within-window
10.48% / 11.94%**.

⚠️ **#28.5 named the ceiling as T0's numbers (build 10.27% / held-out 10.73%),
which came from blocks that are now superseded.** These fresh-block figures are
0.2–1.2pp higher. Which pair the ceiling is pinned to is the commander's to
say; a stage gating on non-increase needs one named number, not two candidates.

### 7.7 Also carried forward

The arriver is nearer the Phase-31 cutback arc than the ball in **71–90%** of
crosses (T0: 74–89%) — unchanged, and still not the mechanism at C1 = 6.00%.
Every reported quantity from T0 re-ran on fresh blocks and none of them moved
materially.

### 7.8 Disposition

**PASS.** T0's uncertified cell is certified, C2 is decomposed, and §6's frozen
rule returns **HEIGHT-DOMINATED**. Per #28.4b that names the delivery's flight
profile as C4 v1's seat and sends the routing fix further back in the queue.
Nothing shipped: zero `src/**`, no flag, fingerprint untouched. **The
flight-profile contract is the commander's to draft** — §7.4's warning
(partition ≠ decomposition), §7.5's archetype split and §7.6's ceiling
ambiguity are the three things it has to resolve before it can gate anything.

## 8. Stop rules

* **Any X, C or S gate fails ⇒ FAIL**, and the fork returns to the commander.
  A second coverage failure after this re-sizing would mean the budget model
  itself is wrong, which is a finding and not a third redraw.
* **No re-cutting after sight**: not the ladder, not the band, not the radius,
  not the window, not the decision rule in §6.
* No third redraw of the coverage floor without a ruling.
* No stage may be rescued by tuning a neighbour.
