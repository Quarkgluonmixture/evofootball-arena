# C4 T0 — Definitions + the arrival census (instrument first)

Status: **PRE-REGISTERED 2026-07-27 — everything below is frozen before any
implementation and before any data.** Drafted by the autonomous session under
the C4 design contract ([`C4-AERIAL-ARRIVAL.md`](C4-AERIAL-ARRIVAL.md) §2 IN.1,
§3 Q6), authorised by **commander ruling #27.5** (C4 T0 runs after C5 T0R
lands; one experiment in flight). Nothing here may be tuned after first sight
of results.

Date: 2026-07-27

## 1. What T0 is for

Q6 is an order of operations, not an opinion: *"split `noAerial` FIRST. 'No
header' ≠ 'nobody there'; an aerial contract gating on the conflated number
would repeat the E5a window defect."* T1's routing fix, T2's A/B and T3's
battery all gate on arrival numbers, so the arrival numbers have to mean one
thing each before any of them is written.

T0 therefore does exactly two things, and builds nothing:

1. **Splits the instrument** — one number with three meanings becomes four
   numbers with one meaning each (§3).
2. **Censuses the arrival** — where the licensed bodies actually are when a
   cross comes down, per team archetype (§4), including the direct measurement
   of the Phase-0 map's sharpest claim: *the one late body a wide ball licenses
   is aimed at a different zone from the one a cross lands in.*

Zero `src/**`. Nothing is flagged, nothing is priced, nothing ships.

## 2. Staging, frozen

| item | value | why |
| --- | --- | --- |
| build block | **`cross-anatomy.ts`'s staging verbatim** — seeds **909,000+**, 250 matches × 2 attacking archetypes (CROSS = `crossBase × 2.2`, BAL) × 3 defensive shells (NEUTRAL, BUS, PRESS), neutral genomes/squads at 0.5, `wide-212`/`press-23` for the attacker | the pin in §5 X4 is only possible against identical staging: a new definition is only a new definition if everything underneath it is unchanged (E5d's X6 lesson) |
| held-out block | seeds **870,000+**, same 6 combinations, same 250 matches each | fresh — 830/840 (C5 T0/T0R) and 850/860 (C5 T1) are all spoken for. C3R: the block that defines may not also certify stability |
| cluster unit | the **match seed** | ruling #20 |
| bootstrap | 2,000 resamples, frozen seed **50011** | T0R's estimator family, new seed |
| window | **4.0 s** from the cross | `cross-anatomy.ts`'s own `WINDOW`, verbatim — changing it would break the pin |

Reused verbatim from `cross-anatomy.ts` and NOT re-derived: the archetypes, the
shells, the window, and the early-close rule (a new cross closes an open
window). The existing probe is **not edited**.

## 3. The split — four classes, one meaning each

Every cross by the attacking team falls in **exactly one** class. The classes
are evaluated against the **arrival moment**, which is itself a frozen
definition:

> **ARRIVAL** = the first tick after the cross at which the ball is
> **descending** (`vz < 0`) and **within contest height** (`z ≤
> HEADER_MAX_HEIGHT` 2.5 m, `constants.ts:187`) — the moment the ball becomes
> contestable, read from physics alone. No intent, no telepathy.

```text
C0  NEVER-ARRIVED   the ball is touched by anyone other than the crosser, or
                    play stops, or the 4 s window expires, BEFORE arrival.
                    Sub-reasons reported, never merged: defensive touch in
                    flight · keeper claim · out of play · window expiry
C1  NOBODY-THERE    it arrives, and NO attacking player is within
                    HEADER_RADIUS (1.35 m, `constants.ts:189`) of the ball at
                    that tick — the horizontal 2-D distance `tryAerial` itself
                    uses (`mechanics.ts:786-789`)
C2  ARRIVED-NO-HEADER  an attacker IS inside the radius at arrival, and no
                    header is won by either side inside the window
                    (`headersWon` unchanged both sides) — the chested-down
                    and controlled-on-the-ground deliveries the Phase-0 map
                    flagged as the load-bearing miscount
C3  HEADER          a header is won inside the window, split atk / def
```

**C0 is a class the design contract did not name and it is added here, on the
record, rather than folded.** A cross cut out in flight never posed the arrival
question at all; pooling it with "nobody was there" would put two meanings back
into one number on the very stage that exists to take them apart. §5 X5 asserts
the four classes partition the crosses exactly.

### 3.1 Precedence — HEADER FIRST, and why that ordering is forced

Classes are assigned in this order: **C3 → C0 → C1 → C2**.

A cross headed clear by a defender in flight would otherwise be C0 by the
never-arrived rule *and* `defHeader` by the old one, and the rollup below would
break. Header-first resolves it in the direction that is also the true one: a
headed clearance IS an aerial contest, which is exactly what C3 means. The
arrival detector still runs on those crosses, so their census rows survive even
though their class does not come from arrival.

**The rollup identity** (this is what makes the split a re-description rather
than a new measurement):

```text
cross-anatomy's atkHeader / defHeader  ==  C3 atk / C3 def
cross-anatomy's noAerial               ==  C0 + C1 + C2
```

⚠️ Stated plainly rather than dressed up: given the §3.1 ladder this identity
is **true by construction**, not a discovery. Its force lives entirely in the
EXTERNAL half of X4 — that the numbers match the unmodified probe's own output
on the same staging, which is what proves the staging, the window and the
early-close rule really are unchanged.

### 3.2 When the arrival condition is read

The arrival predicate is evaluated on the **pre-step** state of each tick, i.e.
the state `tryAerial` will resolve the contest from during that step
(`Match.ts:1383` → `mechanics.ts:741`). Reading it post-step would miss the
arrival tick of every headed cross — the header has already moved the ball —
and would bias the census toward deliveries nobody attacked. The cost is that
the census is read at most one tick (≈0.16 m of ball drop) before the contest;
that is stated here rather than discovered later.

### 3.3 ⚠️ AMENDED BEFORE THE RUN, in its own commit, on the sizing smoke

Three defects in the definitions I froze above were found by a sizing smoke and
a read-only diagnostic, **before** the frozen run. Each is corrected toward the
contract's own words and toward the code's own semantics, never toward a
number, and each is recorded here rather than in the result — the E1b §4.1 /
E5d X6 precedent for amending an unsatisfiable or self-defeating predicate
before it fires, and T0 §6.5's precedent for smoke-stage corrections.

1. **C1/C2 are decided over the WHOLE descent, not at one instant.** As frozen,
   §3 read the radius "at that tick". Measured, that put the nearest attacker
   **5.4 m** away on average at a moment when 48% of the same crosses went on to
   be headed — the read happens the instant the ball dips below 2.5 m, several
   metres and several tenths of a second before it can be met. A single-instant
   read reports an emptier box than the world contains, on the stage whose
   entire job is to say how empty the box is. The census now samples every tick
   boundary of the descent and keeps the **closest-approach** sample; C1 means
   *no attacker came inside the radius at any point of the contestable descent*,
   which is the reading `tryAerial` would have acted on.
2. **C2 also fires on an attacking TOUCH inside the window.** The chest trap
   (`mechanics.ts:781`) is exactly "arrived and did not head it" — the case C2
   exists for — and it was landing in C1 because the contest resolves INSIDE
   the step, so no tick boundary ever shows the attacker inside the radius. A
   touch is lag-free and unambiguous. The two triggers are counted separately
   and reported separately, never merged.
3. **The descent is the whole descent, not the header band.** An intermediate
   version restricted arrival to `HEADER_MIN_HEIGHT ≤ z ≤ HEADER_MAX_HEIGHT`.
   The diagnostic then found this engine's crosses fly LOW — a large share
   never rise to 1.35 m at all — so that version classified them "never
   arrived", which is a third meaning inside C0 and the precise error this
   stage exists to prevent. Arrival is back to the frozen §3 predicate
   (descending, `z ≤ HEADER_MAX_HEIGHT`), and the flight height is **reported**
   as its own instrument (`flight.maxZMean`, `headableShare`) — because *a
   delivery nobody could head whoever was standing there* is a real C4 finding,
   not a bookkeeping problem.

Nothing about the gates, the staging, the blocks, the window, the tolerances or
the §6 readings is touched by any of this.

## 4. The census — reported in full, gated nowhere

At the **kick tick** and again at the **arrival tick**, per cross, per
(archetype × shell):

**Flight.** Peak height per cross, and the share of deliveries that ever reach
`HEADER_MIN_HEIGHT` — a ball that never gets to head height cannot be headed by
anyone (added by §3.3.3).

**Occupancy.** Attacking bodies within 1.35 / 2 / 3 / 5 m of the ball at
arrival; attackers inside the box (`localX > HALF_L − BOX_DEPTH`, `|y| ≤
BOX_WIDTH/2`) at kick and at arrival; the same two counts for defenders;
nearest-attacker and nearest-defender distance distributions (mean, median,
p10, p90).

**The licensed bodies.** Whether `team.arriver` is set at the kick tick
(`Team.ts:66`), and `team.runners`' size (`Team.ts:60`); for the arriver, at
arrival: distance to the ball, distance to the **cutback arc target**
`((HALF_L − 16)·attackDir, clamp(y·0.3, −7, 7))` (`actionExecutor.ts:351-355`),
and distance to the **penalty spot** (`PENALTY_SPOT_DIST`, `constants.ts:221`).

**The map's sharp claim, measured directly** — the share of crosses where

```text
dist(arriver, arcTarget)  <  dist(arriver, ball at arrival)
```

i.e. the licensed late body is nearer the zone Phase 31 sent him to than the
zone the ball actually came down in.

**The conversion baseline (I2).** Shot-within-window and goal-within-window per
combination, from `cross-anatomy`'s own `shotLog` read. T0 changes no code, so
conversion cannot move here; this run is where the **ceiling every later stage
gates against** is written down.

All of §4 is **reported**. Nothing in it is a gate, because nothing in it is a
claim — it is the baseline the later stages pin against.

## 5. Gates

### 5.1 X-series — identity and definition (any failure ⇒ FAIL)

| gate | predicate |
| --- | --- |
| **X1** | `npm run fingerprint` returns `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`, unchanged |
| **X2** | **zero `src/**` changes**, audited by diff; `cross-anatomy.ts`, `aerial-anatomy.ts` and `cutback-anatomy.ts` are **not edited** |
| **X3** | two `runExperiment()` calls byte-identical; SHA-256 emitted |
| **X4** | **THE ROLLUP PIN.** Computing the OLD statistic inside this probe — `headersWon` deltas over the same 4 s window with the same early-close rule — reproduces `atkHeader` / `defHeader` / `noAerial` for all six combinations, and the rollup identity of §3 holds **exactly, to the integer**, in every combination. The reference is the **unmodified `cross-anatomy.ts`'s own output** on the same staging, captured before this probe runs |
| **X5** | **PARTITION.** The four classes are mutually exclusive and their counts sum to the total crosses, in every combination |

X4 is the E5d X6 move: it is a predicate about staging, not a number, so it is
frozen without knowing what the numbers will be.

**The reference, captured 2026-07-27 by running the UNMODIFIED
`scripts/probes/cross-anatomy.ts` before this stage's probe existed:**

```text
CROSS vs NEUTRAL  crosses 3.06/m  atkHeader 22.1%  defHeader 27.6%  noAerial 50.3%
CROSS vs BUS      crosses 3.04/m  atkHeader 19.1%  defHeader 25.6%  noAerial 55.3%
CROSS vs PRESS    crosses 2.54/m  atkHeader 21.4%  defHeader 25.3%  noAerial 53.3%
BAL   vs NEUTRAL  crosses 1.72/m  atkHeader 33.7%  defHeader 40.0%  noAerial 26.3%
BAL   vs BUS      crosses 1.59/m  atkHeader 28.4%  defHeader 41.5%  noAerial 30.2%
BAL   vs PRESS    crosses 1.36/m  atkHeader 33.7%  defHeader 35.2%  noAerial 31.1%
```

Two things worth recording about this reference. It **reproduces the banked
datum** the Phase-0 map leaned on (`ROADMAP.md:1288-1291`: a balanced team's
`noAerial` 26%, `atkHeader` 33%) to the decimal, which is itself evidence the
staging is the banked one. And the comparison is at the **printed precision** —
one decimal place on the shares, two on crosses/match — because that is all the
unmodified probe exposes; the exact-to-the-integer half of X4 is the internal
rollup identity of §3.

### 5.2 C — coverage

```text
C1  >= 300 crosses per (archetype x shell) in BOTH blocks
C2  >= 3,000 crosses pooled in BOTH blocks
```

**Derived, not hoped** (#24): E5h banked a base rate of **2.49 crosses per
match**, so 250 matches yields ≈ **622** per combination (2.1× the floor) and
≈ 3,700 pooled (1.2×). The CROSS archetype runs `crossBase × 2.2` and will
exceed that; using the unamplified rate is the conservative direction for a
floor.

⚠️ **Disclosed, because the X4 reference arrived after the floors were
written**: at the reference's own rates the smallest combination is **BAL vs
PRESS at ≈340** crosses — above the 300 floor, but at 1.1× rather than the 2.1×
the E5h rate suggested, because a BALANCED team crosses far less than the
league-wide average. Pooled is ≈**3,328**. The floors are NOT moved to fit
this: 300 and 3,000 were derived from banked data first and they still hold.
What does change is honesty about the margin, and about S's σ (§5.3).

### 5.3 S — stability (the split is a property of the world, not of a block)

Pooled over the six combinations, per class:

```text
| share_build − share_heldout |  <=  3.5pp   for each of C0, C1, C2, C3
```

**Derived**: at ≈3,700 crosses per block the SE of a share near 0.5 is 0.82pp,
so a difference SE is ≈1.16pp and 3.5pp is **3σ**. Using the widest possible
share (0.5) is the conservative direction for a gate that should not fire on
noise.

⚠️ **Recomputed at the reference's own counts, and NOT loosened**: 3,328 pooled
gives a difference SE of ≈1.23pp, so 3.5pp is **2.85σ** rather than 3σ for a
class sitting near 0.5. Every class here is smaller than 0.5, so each one's own
σ is wider than that worst case; the tolerance stays where it was frozen, and
the shortfall is recorded instead of repaired.

Per-combination stability is **reported**, not gated: at ≈622 crosses the
per-combination interval is three times wider, and a floor I could only reach
by loosening is not a floor.

### 5.4 D — determinism

Two `runExperiment()` calls byte-identical (X3 above); shared SHA-256 printed
and recorded in §7.

### 5.5 What is deliberately NOT gated

* **Every number in §4.** The census is the deliverable; gating a baseline
  against itself is circular.
* **Conversion.** I2 is a ceiling on *later* stages; T0 writes the baseline it
  will be measured against. A stage that changes nothing cannot fail a
  non-increase gate, and pretending otherwise would be a gate for show.
* **Any threshold on C1's size.** "How empty is too empty" is a design
  judgement for the commander on this table, not a number for me to invent
  before seeing it — T0's A3 is the standing lesson.

## 6. Pre-laid readings — exhaustive over the map's claim

The census either supports the contract's premise or refutes it. Both branches
are written now.

```text
(a) THE MISMATCH IS REAL         C1 is a large share of the old noAerial, AND
                                 the arriver sits nearer the arc target than
                                 the ball at arrival in a large share of
                                 crosses. T1's routing fix is aimed at a
                                 measured defect and pre-registers as drafted.

(b) THE MISMATCH IS REAL BUT     C1 small, C2 large — bodies ARE arriving and
    SMALL, C2 DOMINATES          not heading. Then the routing fix is not the
                                 binding link and the contest (Q3: 1.35 m, no
                                 TIME) moves up the queue. That is a REDRAW
                                 of C4 v1's scope and returns to the
                                 commander, since Q1 fixed v1 = arrival.

(c) C0 DOMINATES                 the cross mostly never survives the flight.
                                 Neither arrival nor contest is the seat; the
                                 delivery's "healthy" verdict (§1 of the
                                 design contract) would itself need revisiting.
                                 Returns to the commander.

(d) THE ARRIVER IS ALREADY       he is nearer the ball than the arc at arrival.
    WELL PLACED                  The map's sharpest claim is REFUTED by its own
                                 census, T1 as drafted would fix nothing, and
                                 that returns to the commander before a line of
                                 it is written.
```

None of the four is a T0 FAIL — T0 fails only on §5. Which one occurs decides
what T1 is allowed to be, and (d) in particular is the reason this stage runs
before T1 rather than beside it.

## 7. Result — RUN 2026-07-27: ⛔ **FAIL on C1 (coverage). The queue stops.**

SHA `21f42c3d…dd66`, twice byte-identical. **3,331 crosses build / 3,262
held-out** over 3,000 matches. Zero `src/**` (`git diff` = 0 lines), fingerprint
`57b0bdab…c673` unchanged, **820/820** tests green, tsc clean.

| gate | result | |
| --- | --- | --- |
| **X1** fingerprint | `57b0bdab…c673` unchanged | ✅ |
| **X2** zero `src/**`; the three existing probes unedited | 0 lines of `src` diff | ✅ |
| **X3 / D** two runs byte-identical | SHA `21f42c3d…dd66` | ✅ |
| **X4** the rollup pin, external + internal | **exact on all six combinations** | ✅ |
| **X5** partition | four classes sum to the crosses, both blocks | ✅ |
| **C1** ≥300 crosses per combo, BOTH blocks | **held-out BAL vs PRESS = 296** | ⛔ |
| **C2** ≥3,000 pooled, both blocks | 3,331 / 3,262 | ✅ |
| **S** stability ≤3.5pp per class | max **1.40pp** (C0); C1 1.10 · C2 1.25 · C3atk 1.07 · C3def 0.18 | ✅ |

### 7.1 The FAIL is mine, and it is the #24 family again

**Held-out BAL vs PRESS produced 296 crosses against a floor of 300 — short by
four.** Not a budget shortfall: 250 matches is the whole block, and a BALANCED
team against a PRESS shell simply crosses **1.18 times a match**. The floor came
from E5h's **league-wide 2.49 crosses per match**, a rate that describes neither
of this staging's archetypes and least of all its quietest cell.

That is ruling #19/#24's codified error: a floor inherited from a population it
does not describe. §5.2 had already recorded the margin collapsing from 2.1× to
1.1× when the X4 reference arrived, and I left the floor where it was frozen —
correct conduct, and it is what let the gate fire honestly instead of being
tuned into a pass. **It is not re-derived now.** The build block cleared the
same floor at 341 for the same cell, so the finding is that the floor was
right-shaped and mis-sized, and a re-powered C4 T0R would size it off THIS
run's per-archetype rates rather than a league marginal.

⚠️ Stated because it matters more than the gate: **the census itself is not in
doubt.** Every other gate passed, the split is stable to 1.4pp across disjoint
blocks, and the numbers below are on ~3,300 crosses per block. The FAIL is
about one cell's certification, not about whether the instrument works.

### 7.2 ⭐ X4 is exact — the split really is a re-description

The recomputed old statistic reproduces the unmodified `cross-anatomy.ts` on
every combination, to the printed precision, shares and cross rate alike:

```text
CROSS vs NEUTRAL  3.06/m  atk 22.1  def 27.6  noAerial 50.3   ← identical
CROSS vs BUS      3.04/m  atk 19.1  def 25.6  noAerial 55.3   ← identical
CROSS vs PRESS    2.54/m  atk 21.4  def 25.3  noAerial 53.3   ← identical
BAL   vs NEUTRAL  1.72/m  atk 33.7  def 40.0  noAerial 26.3   ← identical
BAL   vs BUS      1.59/m  atk 28.4  def 41.5  noAerial 30.2   ← identical
BAL   vs PRESS    1.36/m  atk 33.7  def 35.2  noAerial 31.1   ← identical
```

### 7.3 ⭐⭐⭐ The headline: `noAerial` was almost never "nobody there"

Pooled over the build block, with 95% cluster-bootstrap intervals:

| class | share | CI |
| --- | --- | --- |
| **C0** never-arrived | **10.90%** | [9.73, 12.05] |
| **C1** nobody-there | **5.70%** | [4.93, 6.49] |
| **C2** arrived-no-header | **27.95%** | [26.38, 29.48] |
| **C3atk** | 24.71% | [23.16, 26.31] |
| **C3def** | 30.74% | [29.14, 32.36] |

The conflated `noAerial` is **43.6%** pooled, and **C1 is 5.70 of it — about one
part in eight.** Per archetype the same shape holds: CROSS vs NEUTRAL's 50.3%
is C0 11.6 / C1 6.1 / **C2 32.5**; BAL vs NEUTRAL's 26.3% is C0 7.9 / C1 1.9 /
**C2 16.5**.

**This is reading (b), and it fires the stop rule.** Q6 was right that the
number had to be split before anything gated on it, and the split says the C4
premise as drafted was aimed at the smaller part: bodies ARE arriving, and they
are not heading it.

### 7.4 ⭐⭐ And the new instrument says why — the delivery does not get up

`flight`, added at §3.3.3 after the diagnostic:

| combo | mean peak height | median | **share ever reaching 1.35 m** |
| --- | --- | --- | --- |
| CROSS vs NEUTRAL | 1.65 m | 1.86 | **63.0%** |
| CROSS vs BUS | 1.61 m | 1.67 | **60.3%** |
| CROSS vs PRESS | 1.60 m | 1.65 | **62.6%** |
| BAL vs NEUTRAL | 2.00 m | 2.26 | **84.0%** |
| BAL vs BUS | 1.95 m | 2.23 | **82.9%** |
| BAL vs PRESS | 1.93 m | 2.23 | **81.2%** |

**Roughly two of every five cross-archetype deliveries never rise to header
height at all** — no arrival plan can produce a header on those, whoever is
standing there. And among C1 crosses only **24–58%** were headable, so even the
small "nobody there" class is substantially "nobody could have".

⚠️ **This lands on a Q1 verdict.** The design contract took the delivery as
**healthy and untouched** on the Phase-0 map's reading of `performCross`'s aim,
lead, curl and pricing. Its aim geometry is indeed well built — but the
archetype that crosses **2.2× more often** does it with deliveries that are
**20 percentage points less likely to be headable**, and that is a delivery
property, not an arrival one. Whether Q1 survives is the commander's, not mine.

### 7.5 ⭐ The map's sharpest claim: CONFIRMED, and it is not what empties the box

| combo | arriver licensed | to the ball | to the arc | **nearer the arc** |
| --- | --- | --- | --- | --- |
| CROSS vs NEUTRAL | 55.4% | 8.57 m | 5.00 m | **84.5%** |
| CROSS vs BUS | 56.9% | 8.95 m | 5.12 m | **84.3%** |
| CROSS vs PRESS | 55.7% | 9.41 m | 5.34 m | **88.6%** |
| BAL vs NEUTRAL | 28.1% | 7.73 m | 5.90 m | **74.0%** |
| BAL vs BUS | 28.9% | 8.61 m | 6.42 m | **73.8%** |
| BAL vs PRESS | 25.5% | 9.08 m | 6.13 m | **84.4%** |

The licensed late body is nearer the Phase-31 cutback arc than the ball in
**74–89%** of crosses, and he is **8–9 m from the ball** when it comes down.
Reading (a)'s second half is measured and true.

**So the verdict splits (a) and (b), and both halves have to be said together**:
the routing mismatch T1 was drafted to fix is REAL, and it is **not** the
mechanism behind the number that motivated fixing it. Sending the arriver to
the right radius would move one body in about half the crosses; C1 is 5.70%.

### 7.6 The rest of the census, reported

* **C0 is the defence, not the pitch furniture.** Of 89/99/81/34/30/30 C0
  crosses per combo, the terminal was a **defensive touch** in 74/84/64/30/27/25
  of them; keeper claims 0–1, out of play 0–5, window expiry 0–1. "Never
  arrived" means *cut out*, almost always.
* **Occupancy at closest approach**: attackers within 1.35 m 0.14–0.33, within
  2 m 0.61–0.83, within 3 m 0.83–1.04, within 5 m 1.31–1.61. Defenders within
  1.35 m 0.03–0.19.
* **The box is outnumbered about two to one, and it fills between kick and
  arrival**: attackers/defenders in the box 0.70–1.03 / 1.06–1.82 at the kick,
  0.98–1.53 / 1.84–2.94 at arrival.
* **Even C1 is rarely an empty box**: the nearest attacker's median is
  1.75–2.30 m, and 69–93% of C1 crosses had someone within 3 m. C1 means "not
  within 1.35 m", which at this radius is a near miss far more often than an
  absence.
* **Where the ball lands**: 4.8–8.0 m from the penalty spot, `localX` 22.5–24.4,
  `|y|` 3.8–4.8.
* **C2's two triggers, kept apart**: inside the radius 40–169 per combo, touch
  only 16–102. Both are real; neither is the whole class.
* **I2's conversion baseline** — shot within the window **34.40%** build /
  35.41% held-out; goal **10.27%** / 10.73%.

⚠️ **The baseline needs a name attached before I2 can gate on it.** These are
`cross-anatomy`'s own window statistics, and 10.3% is not the *"cross→goal
≈5%"* the design contract's I2 quotes from `ROADMAP.md:1292-1300` — two
different measurements of "conversion". A stage that gates on non-increase must
say which one, or it will gate on the wrong number.

### 7.7 Disposition

**FAIL ⇒ the fork returns to the commander**, by two independent routes that
agree: gate C1 fired, and reading (b) fired. Nothing shipped, nothing flagged,
nothing built — the fingerprint could not move because this stage wrote no
`src/**` at all. The instrument, the split and the census stand as measured and
are available to whatever the commander draws next.

## 8. Stop rules

* **Any X, C, S or D gate fails ⇒ FAIL**, and the fork returns to the
  commander. X4 is the sharpest of them: a split that does not roll back up to
  the banked number is not a split, it is a different measurement wearing the
  same name.
* **No re-cutting after sight**: not the arrival definition, not the radius,
  not the window, not the classes. A different definition is a new stage with a
  new pre-registration.
* Readings (b), (c) and (d) each stop the C4 queue and return to the commander
  (design contract §5), even though the gates pass.
* No stage may be rescued by tuning a neighbour.
