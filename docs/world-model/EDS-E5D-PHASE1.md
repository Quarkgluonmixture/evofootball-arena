# EDS E5d Phase 1 — The attempt axis, censused where it is deployed

Status: **PRE-REGISTERED 2026-07-26 — gates frozen below before any
implementation.** Drafted by the autonomous session under **commander ruling
#18.4**, constraints (a)–(e). Nothing here may be tuned after first sight of
results.

Date: 2026-07-26

## 1. What Phase 0 settled and what it left

Phase 0 answered #17.4 yes: the attempt axis restores the ordering sign
(+2.02pp against reality's +3.18pp, where the composition scored +0.05pp) and
**70 real decisions changed hands** (argmax picks the licensed runner
23.78% → 39.33%). It also fired two gates, and ruling #18 disposed of both:
X6 closed the E5a file (its V table was depressed 1.91pp, relative 27%, by a
late window start plus the zero-value convention), and C3's near-miss became
the house law's third appearance — **a table is honest only on the population
it is deployed on**.

Phase 1 is that correction, plus the live swap.

## 2. What is measured

### 2.1 The population (constraint a)

**Licence-triggered decision moments**: a plain ground pass moment at which at
least one window candidate carries the legacy loop's own third-man or
wall-return licence. At each, the **full candidate set** — licensed and not —
is enumerated and fork-and-forced. Both arms come from the same moments, as in
E5c (b) and Phase 0.

> ⚠️ **A boundary I want on the record, stated before the run and not as an
> excuse afterwards.** The live chooser runs at EVERY plain-ground-pass moment,
> not only licence-triggered ones, so "deployment population" admits two
> readings: the moments where the chooser fires (all of them), or the moments
> where its errors were measured and where watchability is decided (these).
> Ruling #18.4 (a) names the second, and this contract follows it. To keep the
> question answerable by measurement rather than argument, **the same
> calibration is computed on the GENERAL population and REPORTED (never
> gated)** — so if aligning one end misaligns the other, the number says so
> instead of the audit discovering it downstream.

### 2.2 The quantity (constraint b)

```text
EV̂(option) = P(the passing team takes a shot within 240 ticks OF THE KICK
              | this pass is ATTEMPTED, destination cell × threat band)
```

Every fork's window is simulated and counted — clean, spilled, intercepted,
never-adjudicated alike. **No adjudication conditioning anywhere**, which is
what makes both E5a defects structurally impossible here rather than merely
absent.

### 2.3 The features (constraint c)

**Destination cell × threat band**, the two validated axes: E5a's eight zones ×
E2b-0's five threat quintiles, the passer's own corridor read from his own
snapshot at awareness 0.8. Frozen fallback ladder, as Phase 0:
**(cell × band) → cell → marginal**, at a 200-attempt floor.

**The pattern-state feature is deliberately NOT added.** Ruling #18.4 (c): at
deployment-population frequencies part of Phase 0's +3.4pp premium is absorbed
naturally, and the feature question returns only if third-man still misses.

### 2.4 The staging, and why it needs its own pin

Phase 0 cloned the world every tick. This population is ~9× rarer per match, so
the same staging would cost hours. Phase 1 uses E5c's proven two-walk staging —
scout the pass ticks, then replay and clone only there — and, per ruling #18.2's
codification, **pins the staging SEPARATELY from the definition, one gate per
claim**: S1 below compares stagings with the definition held fixed, D1 below
compares definitions with the staging held fixed. That is the direct lesson of
writing X6 twice as a mixed gate.

### 2.5 The swap and the audit (constraint e)

Table committed as SHA'd data; `pricePassOption` under `edsValueAxis` returns
**EV̂ itself** — the composition is removed, not re-weighted, so `price = V̂` and
the reception half survives only as a reported diagnostic. Then
`eds-e5b-value-axis-audit.ts` **verbatim and unedited**, and on a PASS the queue
stops at **E4 round 2**.

## 3. Authorised seat

* New probe `scripts/probes/eds-e5d-p1-deployment-census.ts`.
* `src/ai/passPrior.ts` — the attempt table as new committed data; E5a's and
  E5c's tables stay untouched so their own gates keep reproducing.
* `src/ai/perceivedPassChoice.ts` — the axis swap, behind the existing flag.
* `tests/valueAxis.test.ts` — the pins follow the axis they guard.
* **`scripts/probes/eds-e5b-value-axis-audit.ts` MUST NOT BE EDITED.**
* No other `src/**` change. Flags default OFF, fingerprint unchanged.

## 4. Frozen gates

### EXACT — one gate per claim

```text
X1 production fingerprint 57b0bdab…c673 unchanged
X2 tsc + build clean · full suite green
X3 two invocations byte-identical                     shared SHA-256
X4 zero live callers of the probe; the only src changes are the committed
   table and the flagged axis swap
X5 HARNESS — forcing the target the brain itself chose replays the match
   bit-identically on three seeds (E2a-2's gate, inherited verbatim)
S1 STAGING PIN, definition held fixed — over a common seed block the two-walk
   staging and Phase 0's per-tick-clone staging must produce IDENTICAL attempt
   records (moment, cell, band, reached, adjudicated, clean, shot), in order
D1 DEFINITION PIN, staging held fixed — over Phase 0's own population and seed
   block this probe's window must return Phase 0's banked attempt marginal
   EXACTLY: 14,114 attempts at 0.06327051154881677
T1 the committed table equals this run's census
```

S1 and D1 are the same experiment split in two, which is the whole point: X6
failed twice because one gate carried both claims and could not say which had
moved.

### C1 — COVERAGE

```text
gated buckets   >= 200 attempts per (cell x band) in BOTH sets · >= 8 gated
under-filled buckets take the frozen ladder and are REPORTED, never merged
after seeing results
```

### C2 — HELD-OUT CALIBRATION ON DEPLOYMENT MOMENTS (constraint d)

The gate C3 missed by 0.08pp in Phase 0, now on the aligned population and
powered before the fact:

```text
pattern arm   | mean EV̂ − realized |  <= 2.0pp
control arm   | mean EV̂ − realized |  <= 2.0pp
marginal      | mean EV̂ − realized |  <= 1.0pp
```

Powering: at p ≈ 0.08 a 2.0pp band needs SE ≲ 0.7pp, i.e. **n ≥ 1,500 attempts
per arm** on the held-out set — a floor this contract meets by construction
(C1's budget yields ≈1,700 attempts per 450 moments, and the held-out set runs
to the same budget as the census). **The band is NOT widened** (ruling #18.3);
the population is aligned instead.

### C3 — THE AXIS IS A MEASUREMENT

```text
discrimination   | best gated bucket − worst gated bucket |  >= 5.0pp
held out         | EV_A − EV_B |  <= 5.0pp per gated bucket, <= 1.5pp marginal
```

### THE LIVE AUDIT — `eds-e5b-value-axis-audit.ts`, verbatim

Every gate as that file already carries them, unedited:

```text
Y4V flag-off identity      0 disagreements / 10,292 · 7/7 banked families
§2 band                    goals ±15% · crosses/headers/long balls/cutbacks ±25%
                           and the flags-off arm reproducing all five to 4 dp
no-strict-dominance        20% <= share <= 80%
perf                       mean <= 1.25x · p95 <= 1.50x
H1 third-man   >= 0.85x    H2 overlap  >= 0.70x
H3 forward share >= −2.0pp H4 shots    >= 0.97x
```

H1–H4 are E5b's own frozen gates and are **not** re-derived here. The whole
slice has been trying to pass them; moving them now would be the one thing that
makes the attempt worthless.

### Reported, never gated

```text
R1 the attempt table itself, both sets, with the bucket census beside it
R2 the SAME calibration on the GENERAL population — the boundary in §2.1,
   answered by measurement
R3 the argmax comparison Phase 0 ran, re-measured on the deployed table
R4 the six watchability instruments arm for arm, and the E4 round-1 reproduction
   the E5b probe already carries
R5 what happens to the reception half: it is no longer in the price, so its
   correlation with the realized outcome is reported as the record of what was
   removed
```

## 5. Stop rules

* **S1 fails** → the two-walk staging is not Phase 0's staging. Withdraw it and
  re-run on the slow staging; do not reconcile after seeing numbers.
* **D1 fails** → the window or the conditioning moved. My defect; fix and re-run.
* **C2 fails on the aligned population** → the misalignment was not the
  population, and that is a finding about the FEATURES, not a licence to widen
  the band. Report; ruling #18.4 (c)'s pattern-state question opens at the
  commander.
* **Any live-audit gate fails — including H1** → nothing ships, flags stay
  default OFF, E4 round 2 does not open, the fork returns to the commander. In
  particular H1 failing after an aligned census is the specific evidence that
  reopens the pattern-state feature.
* **PASS on everything** → the flags stay default OFF, the preview toggle is
  extended to arm all three together, and the queue stops at **E4 round 2, the
  user's eyes.**

## 6. Result

### 6.1 The deployment census — RUN 2026-07-26: **the alignment WORKED, one held-out bucket fired, and the phase STOPS there**

Probe `scripts/probes/eds-e5d-p1-deployment-census.ts`, SHA `f9a1395b…707e`,
two invocations byte-identical, fingerprint `57b0bdab…c673` unchanged.

```text
X5 harness                          PASS  3/3 seeds
S1 staging pin                      PASS  two-walk ≡ per-tick-clone, record for record
D1 definition pin                   PASS  14,114 attempts @ 0.06327051154881677,
                                          Phase 0's banked marginal to the last digit
C1 coverage                         PASS  16 gated buckets · both arms ≥ 1,500
C2 calibration, deployment moments  PASS  see below
C3 discrimination                   PASS  13.41pp (floor 5.0pp)
C3 held-out marginal                PASS  5.62% vs 6.03%
C3 held-out buckets                 FAIL  one bucket, see below
T1 committed = census               vacuous — the phase stopped before committing
```

**The split pins are the X6 lesson working.** S1 held the definition fixed and
asked only about the staging: the fast two-walk staging produces attempt records
identical to Phase 0's per-tick-clone staging, in order, field for field. D1
held the staging fixed and asked only about the definition: this window returns
Phase 0's banked attempt marginal **exactly**. Two claims, two gates, each able
to say which one moved — which is precisely what X6 could not do, twice.

#### C2 — the gate this whole phase existed to fix, PASSES

Phase 0 missed by 0.08pp on a table censused over general touches. Censused
where it is deployed:

```text
                 n        predicted   realized    gap      band
pattern       5,195         6.822%     8.046%   −1.22pp   ±2.0pp  ✅
control      10,269         5.651%     5.005%   +0.65pp   ±2.0pp  ✅
marginal     15,464         6.044%     6.027%   +0.02pp   ±1.0pp  ✅
```

Both arms clear the power floor (n ≥ 1,500) by 3–7×, and the band was not
widened — ruling #18.3's instruction was to align the population, and aligning
it moved the control arm's error from +2.08pp to +0.65pp.

#### R2 — the boundary I registered before the run, answered by measurement

§2.1 flagged that the live chooser fires at every pass moment while #18.4 (a)
names licence-triggered ones as the deployment population, and promised the
general-population calibration as a reported number so a trade-off could not
hide. There is no trade-off:

```text
general population, scored with the deployment table
  all options        n = 14,114     gap  −0.72pp
  licensed           n =  1,758     gap  −1.09pp
  unlicensed         n = 12,356     gap  −0.66pp
```

The deployment-censused table is **inside the 2.0pp band on the general
population too**. Aligning one end did not misalign the other, and the question
is closed by a number rather than an argument.

#### ⛔ C3's held-out bucket check FAILED — one bucket, and my tolerance was mis-powered

```text
cell 4 (attacking third outer, central) × band 2
   set A  235 attempts @ 11.91%      set B  234 @ 17.09%      error 5.18pp
   tolerance 5.0pp
next worst: cell3×band1 2.83pp · cell4×band3 2.74pp · cell3×band0 2.68pp
```

At n ≈ 235 and p ≈ 0.145 the SE of that difference is **3.25pp, so 5.18pp is
1.59σ** — thin-bucket noise. But the gate fired, and the reason it could fire is
**my own design error, stated plainly**: I inherited C3's 5.0pp tolerance
verbatim from E5a's V3, where cells carried n ≈ 1,000 and 5.0pp was 3.4σ. Paired
with this contract's 200-attempt bucket floor, the same tolerance is only 1.6σ —
a floor and a tolerance chosen from different experiments and never checked
against each other. **Re-choosing either after seeing which bucket fired is
exactly what the discipline forbids**, so the gate stands as fired and the
disposition is the commander's.

#### What the census found, for the record

The attempt-value gradient over the eight cells on the deployment population:

```text
own third central 1.16% · own third wide 0.68% · middle central 4.30%
middle wide 6.88% · att. outer central 9.48% · att. outer wide 14.25%
att. inner central 16.62% · att. inner wide 21.33%      marginal 5.62%
```

**R5 — the size of what the composition was discarding:** of 15,398 attempts,
9,846 reach the target and 8,970 count as clean receptions, which pay **8.10%**
— but the 6,428 attempts that are NOT clean receptions pay **2.15%**, not zero,
and 1,648 arrivals never adjudicate at all. Clean-conditioning was throwing away
a fifth of the realized value, unevenly across cells. That is the same defect
family X6 exposed in E5a, now quantified on the population that matters.

#### Disposition

**Non-PASS, and the phase stops before the swap.** Governance is explicit — a
FAIL anywhere binds the step's stop rule and forbids skipping ahead — so the
axis was **not** swapped, `ATTEMPT_VALUE_TABLE` was **not** committed as data,
the E5b watchability probe was **not** run, and E4 round 2 does not open. No
`src/**` behaviour changed; the table scaffold in `passPrior.ts` is empty and
has no callers.

What the commander has: the population alignment **worked** — C2 passes on both
arms and on the general population too — and the single failing gate is a
tolerance/floor mismatch I introduced, at 1.6σ, in the thinnest gated bucket.

## 7. C3R — the floor rises to meet the tolerance

**PRE-REGISTERED 2026-07-26 under commander ruling #19.2**, before any
implementation and before any new data. C3 is redrawn, not retired:
per-bucket honesty is load-bearing, because the argmax compares options
bucket by bucket and an aggregate can hide a bad cell.

### 7.1 What changes and what does not

```text
KEEPS   the 5.0pp tolerance, with its V3 meaning intact
KEEPS   the gate text, verbatim: | EV_A − EV_B | <= 5.0pp per GATED bucket
KEEPS   C1 (>= 8 gated), C2 (2.0pp arms / 1.0pp marginal), C3 discrimination,
        the fallback ladder, the population, the window, the features
RAISES  the per-bucket floor, until 5.0pp is >= 3.4σ for that bucket
```

`n_min(bucket) = max(200, ⌈2·p·(1−p)·(3.4/0.05)²⌉)`, with **p taken from the
A-set rates already banked in §6.1** — ex ante in the only sense that matters
here: the floors are computed from data that has already been seen and frozen
below, never from the data that will judge them.

```text
        band0  band1  band2  band3  band4
cell 0    211    200    200    200    200
cell 1    200    200    200    462    200
cell 2    651    493    435    388    418
cell 3   1074    923    610    529    450
cell 4    883   1007    971    780    632
cell 5   1376    966   1034   1712    585
cell 6   2220   1958   1734   1233   1032
cell 7   1918   1585    420    200    200
```

A bucket is **GATED iff n_A ≥ n_min AND n_B ≥ n_min**; otherwise it takes the
frozen ladder and is reported, exactly as before. The committed table carries
that decision per row, so the live consumer's ladder and the gate cannot drift
apart.

At the Phase-1 budget nine buckets already clear their own floor. The bucket
that fired — cell 4 × band 2 — needs **4.15×** its 235 attempts, so the budget
rises to **18,000 moments per set** (≈4.5×, ≈787 matches), which is what a
targeted top-up means here: more of the same census under the same rules, sized
by the floors above.

### 7.2 A FRESH held-out split (ruling #19.2)

Set A extends the existing block (seeds 750,000+). **Set B is a fresh block,
seeds 770,000+** — the 760,000+ split has been looked at and cannot judge the
redraw. C2 and C3R are both computed against the fresh B.

**Every candidate at every accepted moment is still forked.** "Targeted" sizes
the budget, never the sampling: forking only the buckets that need filling
would bias the cell rows and the marginal, which are the ladder's own rungs.

### 7.3 What is forbidden here, restated

Re-running the old check on the old data with a new number — in either
direction. C3R is a new floor on a new split, with the tolerance and the gate
text untouched.

### 7.4 Result — RUN 2026-07-26: **C3R PASSES; the live audit fires on H1 and H2**

#### The census: PASS on every gate

Probe SHA `5f837f4a…7221`, two invocations byte-identical, table committed as
data at SHA `e0e73505…ea6b`.

```text
                        Phase 1        C3R
worst held-out bucket   5.18pp  ⛔     1.23pp  ✅
gated buckets              16            17
attempts per set       15,398        69,532
C2 pattern / control  −1.22/+0.65  −0.61/+0.68pp
discrimination          13.41pp       12.56pp
general population      −0.72pp       −0.75pp   (reported)
```

X5, S1 and D1 all held again — D1 returning Phase 0's attempt marginal to the
last digit for the third time. Raising the floor to meet the tolerance did
exactly what it was supposed to: the worst bucket error fell by 4× while the
tolerance and the gate text never moved.

⚠️ **Reported, not chased: the bucket that caused the redraw is still ungated.**
Cell 4 × band 2 came back with **956 attempts against its own floor of 971** —
fifteen short — so it takes the cell rung. Its held-out error is 2.85pp, inside
the tolerance it would have faced. **The budget was NOT raised to push one
bucket over its own line**: sizing a census at a named cell after watching it
just miss is the move the discipline exists to prevent.

#### The live audit: 30 gates pass, H1 and H2 fire

`eds-e5b-value-axis-audit.ts` byte-unchanged (`git diff` empty), world SHA
`5bafff1f…e54c`, world-deterministic, fingerprint `57b0bdab…c673` unchanged,
760/760, flags default OFF.

```text
Y4V flag-off identity   0 / 10,292 · 7/7 banked families        ✅
§2 band                 goals −0.07% · crosses −0.07% · headers +1.95%
                        long balls −6.75% · cutbacks +7.98%     ✅
                        baseline reproducing all five to 4 dp
dominance               30.96%                                  ✅
perf                    5.625 → 6.672 µs = 1.186x · p95 1.149x  ✅
```

**That §2 band is the tightest any arm in this slice has produced** — goals move
by seven hundredths of a percent. The equilibrium is not being bent to buy the
shots.

```text
                 flags-off   v1 bundle   composed axis   ATTEMPT axis    gate
third-man           6.851    4.130         2.707        4.400  0.642x    ⛔
overlap            0.0927   0.0687        0.0734       0.0434  0.468x    ⛔
forward share      59.81%   57.24%        59.60%       61.30%  +1.50pp   ✅
shots               12.52    13.18         15.54        15.28  1.221x    ✅
```

**H3 goes positive for the first time in the slice** — the forward share is now
**above** flags-off, not merely recovered — and shots hold at +22%. **H1 is the
best third-man figure any chooser has produced** (0.642× against the composed
axis's 0.395× and even the v1 bundle's 0.603×), and it still misses 0.85.

⛔ **H2 is the new information, and it moved the wrong way**: overlap releases
fall to **0.468×**, worse than the v1 bundle (0.741×) and much worse than the
composed axis (0.791–0.835×). Across the slice the two combination counters have
now moved in **opposite directions under every axis** — the composed axis had
overlap healthy and third-man dead; the attempt axis has third-man at its best
and overlap at its worst. Reported as measured; the reading below is labelled as
a reading.

**A reading, not a result.** The two patterns compete for the same ball. The
attempt table prices the attacking third's inner cells highest (16.62% central,
21.33% wide) and the outer-wide cell — where an overlap release lands — at
14.25%, so a chooser reading value alone takes the more advanced man whenever it
can see one, and the overlap runner loses the comparison he used to win on the
legacy ×1.3. That is testable and is NOT tested here.

Other measured context: passes/match 68.91 (flags-off 80.80, v1 70.67), longest
chain 3.69, give-and-gos 0.416 (flags-off 0.457), divergence from the legacy
brain 58.36%, mean price 0.0882 — which, with the composition removed, IS the
mean EV̂.

#### Disposition

**Non-PASS. E4 round 2 does not open** and the fork returns to the commander,
per the standing instruction that any fire comes back. Nothing ships: both v1
flags and `edsValueAxis` stay default OFF, `edsValueAxis` stays out of the
preview toggle (pinned), the fingerprint is unchanged and the suite is green.
The attempt table and the axis swap stay committed but dormant, so the next
ruling has them in hand.

What the commander now has: **the best equilibrium and the best progression
numbers of the whole slice** (§2 band essentially neutral, forward share above
flags-off, shots +22%, third-man at its slice best) with **one counter that
regressed** — and the regression is in the pattern whose destination the value
table prices below the men behind it.
