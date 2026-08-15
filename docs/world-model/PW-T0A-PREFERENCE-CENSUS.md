# PW-T0a — THE PREFERENCE CENSUS (instrument-only)

> **Contract**: [`PW-PASSWEIGHT-CONTRACT.md`](PW-PASSWEIGHT-CONTRACT.md) §2 **M-PW.2** (the chooser
> is the ONE TABLE — no new pricing table) and **M-PW.3** (the dominance hazard), with the stage
> itself picked by [`PW-C0-WEIGHT-PHYSICS-CENSUS.md`](PW-C0-WEIGHT-PHYSICS-CENSUS.md) **§E.3** and
> bound by **ruling #291.6**.
> **Freeze** `b3da9d8` → result; probe **byte-unchanged** between freeze and result.
> **Artifact** [`data/pw-t0a-preference-census.json`](data/pw-t0a-preference-census.json)
> · **18/18 gates · 69/69 mutants LIVE · G-DET bit-identical · ZERO `src/**` edits**.

---

## §SOURCES READ FIRST (the citation hunt is at SEVEN strikes — and it now covers this brief)

⭐ **#291.5's new discipline, executed first**: an executor's FIRST hunt act is verifying the
DISPATCH BRIEF's own attributions. Every (doc, section) pair in the brief was opened before any
code was written. **Result: every attribution holds in substance; three are loose in FORM, and
one number is loose in KIND. Recorded, because the last two strikes both began as "close enough".**

| the brief cited | what is actually there | verdict |
| --- | --- | --- |
| `PW-PASSWEIGHT-CONTRACT.md` §2 M-PW.2 / M-PW.3 | §2 M-PW.2 (one table, no move library) · M-PW.3 (the dominance hazard) | ✅ exact |
| `PROGRAMME-RULINGS.md` #290 / #291 as the charter | #290 binds the contract and dispatches PW-C0; **#291.6** binds THIS stage's order, populations and verdict form | ✅ exact |
| PW-C0 **§RECEIVING-COST (iii)** — the joining rule + the dominance ledger | the section is **§C THE RECEIVING-COST AUDIT**; the joining rule is **§C.3(iii)**, the ledger **§C.3(ii)** | ⚠ loose form, right content |
| PW-C0 **§CHOOSER-SLICE DESIGN** — `PASS_CANARY_POWERS` at `PlayerBrain.ts:32` | the section is **§E THE CHOOSER-SLICE DESIGN PICK**; the line cite is in **§E.1** | ⚠ loose form, right content |
| PW-C0 **§CORRECTIONS 1(c) / 2** | the section is **§COMMANDER CORRECTIONS OF RECORD (#291)**; items 1(c) and 2 are as cited | ⚠ loose form, right content |
| "PW-C0's execution **σ ≈ 6.7 %**" as the noise floor for a PRICE margin | §A.2 / #291.1: σ ≈ 0.0765 is the standard deviation of the **struck power multiplier** at the ceiling (~6.7 % *of the ball's pace*) — it is **not** a σ on any price or share | ⚠ **loose in KIND** — see §DOUBTS 2; this doc never converts it into a price CI, and the one face that touches it is labelled a PROXY |

**Line cites verified by hand before use** (and re-verified by the probe at run time, so they
cannot rot silently):

* `PlayerBrain.ts:32` — `const PASS_CANARY_POWERS: readonly number[] = [PASS_POWER_MIN, 1, PASS_POWER_MAX];`
  ✅ **exactly line 32**, and the literal is exactly the ladder this stage runs.
* `perceivedPassChoice.ts` — `preferredPassPower` exists, is exported, takes `powers` and
  `heavyTouchCost`, and its joining rule is the one PW-C0 §C.3(iii) pre-registered, verbatim.
  ✅ The probe traces the price line, the ratio line, the argmax line and the curve-selector line
  and publishes their line numbers in `srcReceipts.joiningRule`.
* Also read in full, because they bind quotation: **BU-C0 §COMMANDER CORRECTIONS** (correction 1
  — the ladder is GK-inclusive, so every instrument quoting it carries **GK-split rungs**;
  correction 5 — the CORRECTED `xSrcUntouched` form, ruling #286.1), and **PW-C0 §COMMANDER
  CORRECTIONS OF RECORD** in full (the HIGH — **DIVERGENCE-1** — and the **moving-denominator**
  correction both bind this stage and are honoured structurally, not in prose).

---

## §0 THE QUESTION, in football

⭐ **他到底想传多重的球?** PW-C0 opened the physics door: a firmer ball really does shorten every
corridor window, and at the population MEAN the hardest expressible ball wins under both of the
engine's shipped receiving-cost curves. But a chooser does not act on a population mean — it
stands over ONE ball, at ONE moment, with ONE team-mate in mind, and asks *this* pass how hard it
wants to be hit. This stage asks the only question that can be asked before a chooser is built:

> **When the shipped rule is asked option by option, does it actually WANT different weights in
> different situations — or does it want the same thing every single time?**

If it wants the same thing every time, then building the chooser buys a menu with one item on it,
and the arc must reframe **before** any `src` work is spent. That is the whole point of running
this before PW-T0b: it is cheap, and it is honest.

**Nothing is armed, nothing is built, no seam gains a caller, `src/**` is byte-untouched.**

---

## §FORM

### The world

| | |
| --- | --- |
| **arm** | **the v7 world** — `new Match({ seed, teamA, teamB, ...a4MatchFlags(7) })` + `armA4World(m, null, 7, poolT1DoseCells(L3-T1))`, the CB layer + the learning defence at the SHIPPED entry's own POOLED matured dose. Asserted **live on every walked match** (`gArms`, #283.2(iv)) — PW-C0's arm verbatim. |
| **seeds** | **VIRGIN**: battery `12,491,100–299` (200 matches). Smoke `12,491,000–019`, preflight/guard `12,491,040–059`, world-identity `12,491,900` — all declared, all disjoint, all inside the dispatched block. |
| **clock** | ENGINE DEFAULT, **APPLIED not nominal** (`gClock` asserts `duration === MATCH_DURATION` on every walk): 240 sim-s match; the display clock 90′ is read out of `Match.minute()`'s own expression ⇒ **1 sim-s = 22.5 display-s**. ⭐ **Every face in this document is a SHARE or a per-option MEAN** — dimensionless, identical on both clock axes. No per-match count is published as a headline, so the convention-A/B fork never bites here. |
| **rule** | the SHIPPED `preferredPassPower`, **CALLED**. Not one price in this document was computed by the probe. |
| **ladder** | `{PASS_POWER_MIN, 1, PASS_POWER_MAX}` = **{0.85, 1.00, 1.15}**, the literal EXTRACTED from `PlayerBrain.ts:32` at run time. |
| **curves** | **BOTH** shipped touch curves, selected through the rule's own `heavyTouchCost` parameter — the same switch `evaluatePassOption` itself reads. The walked world's own per-match selector (`match.edsTouchCost`) is asserted **OFF = the base curve**, as PW-C0 recorded. |

### ⭐⭐ THE DESIGN: one scene, one rule, two curves — PAIRED WITHIN OPTION

The contrast is not world-vs-world; it is **curve-vs-curve on the same photograph, option by
option**. At every reception the ladder is run at each rung, and for every surviving candidate the
shipped rule is asked TWICE — same passer, same team-mate, same defenders, same tick — changing
only which of the two shipped receiving-cost curves it prices with. `gPaired` asserts that the
option COUNT in every slice is byte-identical across the two curve columns; that is the pairing
*proof*, not a comment.

### ⭐ THE POWER-DEPENDENT DENOMINATOR, DISCLOSED BY CONSTRUCTION (PW-C0 §CORRECTIONS 2)

The published option set MOVES with power — that is the whole finding of PW-C0 §B. So this census
publishes **three declared populations** rather than picking one and hoping:

| population | definition | why |
| --- | --- | --- |
| **`ref`** (primary) | options published (L1∧L2∧L3∧L4) at the **reference rung 1.00** | the set a chooser enumerating **today's** ladder actually sees |
| **`union`** | published at **ANY** of the three rungs | the set a rung-aware enumerator would see |
| **`all3`** | published at **ALL** three rungs | the fully paired set, where the denominator cannot move at all |

Every face carries its own `den`. The three read the same story (§B.4), which is what makes the
disclosure a receipt rather than a hedge.

### The ladder — BU-C0's definition VERBATIM

| rung | asks | whose code answers |
| --- | --- | --- |
| **L1 POSITION** | `Δ = localX(mate) − localX(ball)`; BEHIND ⇔ `Δ ≤ −2 m` | the ±2 m band **EXTRACTED at run time** from the engine's own forward-pass line — never typed |
| **L2 RANGE** | does the ball arrive at all at this power? | `predictGroundPass(..., powerMultiplier)` |
| **L3 RACE** | `arrivalMargin > 0` at this power | `evaluatePassAffordance(..., powerMultiplier)` |
| **L4 CORRIDOR** | can anyone meet it on its path at this power? | `evaluatePassCorridorInterception(..., powerMultiplier)` |

**THE PUBLISHED OPTION IS L1 ∧ L2 ∧ L3 ∧ L4**, GK-split throughout (#286.1's debt, honoured).

---

## §PRE-REGISTERED READING RULES (frozen in the probe at `b3da9d8`, BEFORE the battery)

> **These are not written here for the first time.** They live in the probe's own frozen body
> (`frozen.readingRules` in the artifact, committed at the freeze commit before a single battery
> seed was walked) and are reproduced from it. The artifact is the truth source.

* **THE VERDICT IS A DISTRIBUTION SHAPE, NEVER A TASTE THRESHOLD** (#291.6). No cutoff is invented
  in this document; the shares and their CIs are published and the **commander adjudicates**.
* **DEGENERATE** — ONE rung takes essentially the whole distribution **under both curves**. If
  this reads, the chooser as designed **cannot** produce a chosen region and the arc must reframe
  **before** any `src` work.
* **STRUCTURED** — the preferred rung varies **systematically** with a scene feature (distance ·
  threat · direction · pressure), shown by the CONDITIONAL distributions, each with its own
  denominator and CI.
* **MIXED** — anything between, described in words with the numbers that make it so.
* **THE MARGIN RULE** — a preference the noise floor erases is not a preference. The margin
  distribution is published in full (histogram + mean + the float-epsilon tie share).
* ⭐ **WHAT MUST NOT BE REDISCOVERED AS NEWS**: PW-C0 §C.3(iii) already established that at
  **population means** max weight wins under both curves (2.30 : 1 shipped, 1.20 : 1 heavy). That
  is this stage's **background**, not its finding. This stage's question is the **SHAPE** of the
  per-option distribution around that mean.
* Every starred finding states **|Δ| ÷ half-width** (#288 canon); plumbing receipts are **never**
  quoted as effect sizes (#289 canon).

**The tie epsilon is DERIVED, not chosen**: `16 · Number.EPSILON` — a power-of-two round-up of the
8ε bound on the representation error of a *difference* of two prices (each price is a table lookup
multiplied by a quotient of two differences: four rounding sites, operands ≤ 1). It is float
precision, never taste, and the full margin **histogram** is published so any other threshold can
be applied to the same numbers afterwards.

---

## §A THE POPULATION (denominators first, the BU-T1 form)

| | |
| --- | --- |
| walks | **200** matches, seeds `12,491,100–299`, every one asserted v7-armed live |
| receptions | **27,375** (PW-C0's own population on its own virgin seeds: 27,715 — a replication-consistency reading across seed blocks, not a re-run) |
| pressed receptions | **17,765** (64.9 %) |
| candidate options in the **union** | **38,205** |
| ⭐ rule calls | **76,410** (38,205 options × 2 shipped curves) |
| ⚠ rule REFUSALS | **4,858** (6.4 % of calls) — `preferredPassPower` returns `null` when the engine's own `evaluatePassOption` cannot price the option at **every** rung. These options are in NO face's denominator; the refusal count is published (`ruleReceipt`) so the exclusion is visible, not silent. |
| **`ref` population** (primary) | **31,160** priced options |
| **`union` population** | **35,776** |
| **`all3` population** | **24,128** |
| ladder oracle nulls | **0** |

⭐ **NON-VACUITY, in the form that distinguishes the two zeroes**: 88 face-cells have a zero
denominator, and **every one of them is a threat-quintile slice `q1`–`q4`**. That is
**NEVER-OCCURRED, and structurally so** — not "unmeasured". See §B.2: it is the finding, not a
gap.

---

## §B THE PREFERRED-RUNG DISTRIBUTION

### B.1 ⭐⭐ THE HEADLINE — the shipped rule wants the SOFTEST ball, and it is not close

Share of options whose argmax price is each rung, on the **primary `ref` population**
(31,160 options; 95 % cluster-bootstrap CIs over the 200 match seeds):

| population | curve | **0.85** | **1.00** | **1.15** |
| --- | --- | --- | --- | --- |
| **`ref`** (today's enumerable set) | **base (shipped)** | **80.03 %** [79.47, 80.59] | 17.51 % [16.99, 18.04] | **2.46 %** [2.27, 2.67] |
| | heavy (banked) | **82.12 %** [81.58, 82.67] | 17.56 % [17.02, 18.11] | **0.31 %** [0.25, 0.38] |
| **`union`** (rung-aware set) | base | 70.94 % | 20.27 % | **8.79 %** |
| | heavy | 72.80 % | 20.74 % | 6.46 % |
| **`all3`** (fully paired set) | base | **95.72 %** | 2.13 % | 2.15 % |
| | heavy | **98.15 %** | 1.60 % | 0.26 % |

⭐⭐ **THE FINDING, in football**: asked one ball at a time, the engine's own pre-registered rule
answers **"softer"** four times out of five — and on the set where the option exists at every
weight, **nineteen times out of twenty**. The corner it lands in is the **opposite** one from the
population-mean ordering PW-C0 published (§C.3(iii): 1.00 → 1.12 shipped, 1.00 → 1.11 heavy).

⚠ **THIS DOES NOT CONTRADICT PW-C0, AND PW-C0'S NUMBERS ARE NOT DISPUTED.** PW-C0 priced the rule
at the population MEANS of its two factors — a ratio of means over a **step function**. This stage
prices it **inside each option**, where the step usually never steps (§B.2). Both readings are
arithmetic on the same shipped rule; they differ because a mean of a step function is not the step
function of a mean. **The per-option shape is the thing a chooser would actually experience**, and
it is what #291.6 asked for.

### B.2 ⭐⭐ THE MECHANISM — the corridor half of the price is SATURATED before the rule is asked

| face (`ref`, both curves identical by construction) | value | denominator |
| --- | --- | --- |
| options in threat quintile **q0** at the reference rung | **100.00 %** | 31,160 |
| options in **q1 · q2 · q3 · q4** | **0 · 0 · 0 · 0** (NEVER-OCCURRED) | 31,160 |
| ⭐ threat quintile **identical at all three rungs** | **83.73 %** [83.19, 84.26] | 31,160 |
| ⭐ threat quintile identical at all three rungs, `all3` population | **100.00 %** | 24,128 |
| ⭐ threat quintile **IMPROVES** at the ceiling rung | **0.0000** (zero options, `ref` and `all3`) | 31,160 / 24,128 |
| the same, on the **`union`** population | **6.20 %** | 35,776 |

**Why q1–q4 are empty is not luck, it is the ladder's own definition.** L4 publishes an option only
when **no** defender has a feasible interception point, and `earliestFeasiblePoint` is non-null
exactly when some sampled point has `margin ≥ 0` (`passCorridorInterception.ts:129`). So a
published option has `strongestMargin < 0` for every defender, and the oracle's first quintile
covers everything up to `+0.0386 s`. ⇒ **Every published option is already in the BEST threat
quintile.** The corridor half of the rule's price is **pinned at its maximum for the entire
chooser-facing population**: it cannot improve, and a slower ball can only push it *down*.

⇒ The rule's arithmetic reduces, on 83.7 % of options (and on **100 %** of the fully-paired ones),
to the touch-fail ratio alone — which is monotone in favour of the softer ball. **The corridor gain
PW-C0 measured is real, and this price cannot see it.**

⭐ **AND WHERE THE FIRMER BALL DOES WIN, IT WINS BY ADMISSION, NOT BY PRICE**: the `union`
population — the one that includes options today's ladder does **not** publish at 1.00 — is the
only place the quintile ever improves (6.20 %) and the only place the ceiling takes a real share
(**8.79 %**, vs 2.46 % on `ref`). A firmer ball's value in this engine lives in **which options
exist**, not in what the published ones are worth.

### B.3 THE CONDITIONAL DISTRIBUTIONS (the STRUCTURED clause, tested feature by feature)

`ref` population, shipped base curve, share preferring each rung. ⚠ These CIs are **independent
per slice** (disjoint option subsets), so reading them for cross-slice separation is a
**conservative** test — only the curve contrast in §B.5 carries a paired |Δ| ÷ half-width.

| slice | n | 0.85 | 1.00 | **1.15** | quintile flat |
| --- | --- | --- | --- | --- | --- |
| **all** | 31,160 | 80.03 % | 17.51 % | 2.46 % | 83.73 % |
| GK target | 10,799 | 80.16 % | 19.59 % | 0.25 % | 83.26 % |
| outfield target | 20,361 | 79.96 % | 16.40 % | 3.64 % | 83.97 % |
| **backward** | 20,444 | 80.13 % | 18.89 % | 0.98 % | 82.63 % |
| **lateral** | 5,083 | 86.98 % | 9.54 % | 3.48 % | 91.64 % |
| **forward** | 5,633 | 73.39 % | 19.67 % | **6.94 %** | 80.58 % |
| ⭐ **outfield backward** (this arc's slice) | 9,707 | 80.17 % | 18.03 % | **1.80 %** | 81.99 % |
| GK backward | 10,737 | 80.10 % | 19.67 % | 0.23 % | 83.20 % |
| pressed | 21,840 | 80.81 % | 16.14 % | 3.06 % | 84.99 % |
| unpressed | 9,320 | 78.21 % | 20.72 % | 1.07 % | 80.76 % |
| inside the live chooser window | 12,630 | 75.59 % | 20.67 % | 3.75 % | 79.34 % |
| outside it | 18,530 | 83.05 % | 15.35 % | 1.59 % | 86.71 % |
| distance 6–10 m | 5,239 | 80.07 % | 14.37 % | **5.55 %** | 87.44 % |
| distance 10–14 m | 4,495 | 82.00 % | 15.46 % | 2.54 % | 85.63 % |
| distance 14–18 m | 3,610 | 84.21 % | 14.74 % | 1.05 % | 85.46 % |
| distance 18–22 m | 2,916 | 83.61 % | 15.47 % | 0.93 % | 84.02 % |
| distance 22–26 m | 2,868 | 85.77 % | 13.56 % | 0.66 % | 85.91 % |
| distance 26–30 m | 2,820 | 72.02 % | 27.73 % | 0.25 % | 75.74 % |
| outside the prior table (<6 m or >30 m) | 9,212 | 76.93 % | 20.12 % | 2.95 % | 81.68 % |
| threat quintile q0 | 31,160 | 80.03 % | 17.51 % | 2.46 % | 83.73 % |
| threat quintiles q1–q4 | **0** | NEVER-OCCURRED | | | |

**What varies, and it varies coherently:**

* ⭐ **DIRECTION**: the ceiling share is **6.94 % forward · 3.48 % lateral · 0.98 % backward**
  (CIs disjoint between forward and backward). The firmer ball is wanted **where the ball is going
  towards the danger**, which is exactly where a defender is close enough for the corridor read to
  move at all — and it is wanted **least** on the backward ball this arc opened the door for.
* ⭐ **DISTANCE**: the ceiling share falls **monotonically 5.55 % → 0.25 %** from the 6–10 m band
  to the 26–30 m band. Short balls are the ones a step can still step on; long ones are already
  past the pace clamp (PW-C0 §A: beyond ~23 m every shipped ball is the same 22 m/s base).
* ⭐ **PRESSURE**: pressed 3.06 % vs unpressed 1.07 % ceiling — a pressed receiver's corridor is
  the one a firmer ball can still rescue.
* **GK-SPLIT**: the keeper's ball almost never wants the ceiling (0.25 %), the outfielder's is 14×
  more likely to (3.64 %). The split is honoured; it does not change the shape.

**What does NOT vary: the winner.** In **every** slice, at **every** distance, under **both**
curves, the floor rung takes 72–87 % and wins outright.

### B.4 THE THREE DENOMINATORS AGREE (the moving-denominator disclosure, discharged)

The floor share reads **80.03 % (`ref`) · 70.94 % (`union`) · 95.72 % (`all3`)**. The spread
between them is itself informative and in the expected direction — `union` adds the options that
only exist at some rungs (where the firmer ball earns its 8.79 %), `all3` removes them (leaving a
population where the quintile is flat 100 % of the time and the touch ratio decides everything).
**No population inverts the ordering.** The disclosure PW-C0 §CORRECTIONS 2 demanded is therefore a
receipt here, not a caveat.

### B.5 THE CURVE CONTRAST (paired, |Δ| ÷ half-width)

| face (`ref`, all) | base | heavy | Δ | \|Δ\|÷hw | resolved |
| --- | --- | --- | --- | --- | --- |
| ⭐ share preferring **1.15** | 2.46 % | 0.31 % | **−2.15 pp** | **11.88×** | ✅ |
| ⭐ share preferring **0.85** | 80.03 % | 82.12 % | **+2.10 pp** | **11.51×** | ✅ |
| share preferring 1.00 | 17.51 % | 17.56 % | +0.06 pp | 0.55× | ✗ |
| ⭐ mean margin of preference | 0.0122 | 0.0223 | **+0.0101** | **166.6×** | ✅ |
| mean price spread across the ladder | 0.0631 | 0.0812 | +0.0181 | 105.9× | ✅ |

⭐ **THE BANKED HEAVY CURVE MAKES IT WORSE, NOT BETTER.** PW-C0 §C.3(ii) offered the heavy curve as
the derived way to blunt the firm ball's dominance (1.20 : 1 instead of 2.30 : 1 at the mean).
Per option it does the opposite of what an axis needs: it drives the ceiling's share to **0.31 %**
and nearly **doubles** the margin by which the floor wins. **Neither shipped curve produces a
chosen region; the heavy one produces less of one.**

---

## §C THE MARGIN OF PREFERENCE (is the preference even there?)

| face (`ref`, all) | base | heavy |
| --- | --- | --- |
| mean \|price(argmax) − price(runner-up)\| | **0.0122** [0.01216, 0.01234] | **0.0223** [0.02218, 0.02244] |
| mean price spread across the whole ladder | 0.0631 | 0.0812 |
| ⭐ **tie share at the derived float epsilon** (16ε) | **0.19 %** [0.14, 0.24] | **0.19 %** |
| ⚠ share below the execution-noise PROXY | 7.71 % | 7.39 % |

**The margin histogram** (`ref`, all, 31,160 options; edges are decades, published raw so any other
threshold can be applied to these same numbers):

| margin | ≤16ε | ≤1e−12 | ≤1e−9 | ≤1e−6 | ≤1e−4 | ≤1e−3 | ≤1e−2 | ≤1e−1 | >1e−1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **base** | 58 | 0 | 1 | 26 | 228 | 816 | 9,585 | **20,445** | 1 |
| **heavy** | 58 | 0 | 0 | 20 | 154 | 403 | 2,342 | **28,182** | 1 |

⭐ **THE PREFERENCE IS REAL, NOT A FLOATING-POINT ARTEFACT.** Exact ties are **0.19 %**; 66 % of
options have a margin above 1 % of a price, and under the heavy curve 90 % do. **The rule is not
indifferent between the rungs — it is decided, and it decides for the floor.** (⚠ The
execution-noise column is a declared FIRST-ORDER PROXY — see §DOUBTS 2 — and even taken at face
value it erases only ~8 % of the preferences.)

---

## §D THE CONTEXT FACE — DIVERGENCE-1, MEASURED ON THESE VERY OPTIONS

`orientationPowerMul` **is** exported by `src/sim/mechanics.ts`, so the face the brief made
conditional is measurable and is reported (read-only import; nothing re-implemented), on the
options published at the reference rung. ⚠ That denominator is **31,844, not 31,160**: it
counts every reference-rung option, including the ones the rule refused to price (§A) — the body
geometry is defined whether or not a price is. Stated, not silently reconciled.

| face | value | 95 % CI |
| --- | --- | --- |
| mean kick misalignment toward the option | 0.568 | [0.563, 0.573] |
| ⭐ **mean `orientationPowerMul`** | **0.8971** | [0.8960, 0.8980] |
| share below 0.95 | 70.33 % | [69.74, 70.93] |
| share below 0.90 | 54.06 % | [53.38, 54.78] |
| ⭐⭐ **share below the substrate's own power FLOOR (0.85)** | **35.11 %** | [34.38, 35.85] |
| ⭐⭐ share where the orientation loss exceeds the whole ceiling gain (0.15) | **35.11 %** | [34.38, 35.85] |

⭐⭐ **On more than a third of the options, the passer's own body already takes more pace off the
ball than the entire weight axis could ever put on it** — and the oracle that produced every price
above cannot see it. The term-list diff (`gDivergence`, #291.5 canon — the identifier sets of
`mechanics.performPass` and `prediction.predictGroundPass` are extracted and differenced, never
merely evaluated) confirms `orientationPowerMul` **and** `executedPassPower` are **SIM-ONLY**
terms. This is PW-C0 §CORRECTIONS 1 (HIGH) restated on this stage's own population, and it routes
to PW-T0b exactly as #291.1 bound it. ⚠ **It is a CONTEXT face, not this stage's finding**: the
preference distribution above is what the chooser's own oracle prefers, which is the honest
question for a chooser that would ship with that same oracle.

---

## §E ⭐⭐ THE VERDICT, against the clauses as written

> ### **MIXED — and the mixture is the wrong way round.**

Scored clause by clause, with nothing invented:

* **DEGENERATE?** — Nearly. **One rung takes 80.0 % / 82.1 % (`ref`) and 95.7 % / 98.2 % (`all3`)
  under BOTH curves.** But it is not "essentially the whole distribution": the shipped default
  holds a stable, tightly-estimated **17.5 %** [16.99, 18.04] under both curves, and the residual
  is not noise.
* **STRUCTURED?** — **Yes, in the residual, and coherently**: the ceiling's share varies with
  direction (6.94 % forward → 0.98 % backward), with distance (5.55 % → 0.25 %, monotone across six
  engine bands), with pressure (3.06 % vs 1.07 %) and with the GK split (3.64 % vs 0.25 %). The
  variation has a mechanism (§B.2) rather than a shape.
* ⇒ **MIXED**: a floor-dominated distribution with a real, feature-conditioned tail.

⭐ **THE THREE FACTS THE COMMANDER IS BEING HANDED** (each with its own arithmetic, none of them a
taste call):

1. **The chosen region exists — at the WRONG END.** The rule as shipped, armed as designed, would
   have the team asking for the **softest** legal ball on ~4 of every 5 options; on the
   outfield-backward slice this arc exists for, the ceiling is chosen **1.80 %** of the time
   (0.06 % under the heavy curve). The contract's §4 named failure mode is an **all-rockets
   world**; what the shipped rule actually produces is its mirror — an **all-feathers** one.
2. **The reason is structural and diagnosable, not a tuning problem.** L4 admission already
   guarantees threat quintile 0, so the corridor half of the price is saturated for **100 %** of
   the chooser-facing population and the step function never steps (83.7 % flat on `ref`, **100 %**
   on `all3`). PW-C0's measured corridor gain is real and this price is **blind to it by
   construction**. Neither shipped curve fixes that; the heavy curve makes it worse (§B.5).
3. **The firmer ball's value is in ADMISSION, not in PRICE.** The only population where the ceiling
   earns a real share (8.79 %) and the only one where the quintile ever improves (6.20 %) is
   `union` — the options today's ladder does **not** publish at 1.00. That is the same place
   PW-C0's +3.94 pp end-to-end movement came from: **the weight axis buys OPTIONS, and the shipped
   joining rule prices only the options it already had.**

⚠ **WHAT THIS STAGE DOES NOT SAY.** It does not say the weight axis is dead — PW-C0's admission
gain is untouched by anything here. It does not say what a chooser *should* price (that is a
design question, and it is the commander's). It does not measure usage: nobody passed anything.
And it emphatically does **not** re-discover that max weight wins at the mean — that is PW-C0's
finding, quoted as background in §B.1 and left standing.

---

## §F WHAT THIS IMPLIES FOR PW-T0b — stated as options, not as a decision

Written in plain football first, because the fork is the commander's (#291.6 bound PW-T0b's
existence, not its design):

* **① SHIP THE CHOOSER AS DESIGNED ANYWAY** — knowing it will mostly ask for softer balls. The
  honest prediction from §B: shorter passes, longer flight times, and the corridor gain PW-C0
  measured going **unclaimed**. This census exists so that outcome is a prediction and not a
  surprise.
* **② ENUMERATE AT RUNG GRAIN** — let the weight rungs into the **admission** step (L2/L3/L4 per
  rung), which is where §B.2 says the value is, and price the resulting set with the same one
  table. This is the `union` population, and it is the only one where the ceiling is chosen at a
  real rate.
* **③ FIX THE BLIND TERM FIRST** — the orientation-aware oracle #291.1 already routed here (§D:
  35 % of options carry a body loss bigger than the whole axis).
* **④ REFRAME** — accept that this pass-weight door needs a price that can see a corridor gain, and
  say so before spending `src`.

**No recommendation is made here.** The census was dispatched to answer whether a non-degenerate
chosen region exists before src is spent; it does — 80/17.5/2.5 under the shipped curve — and it
sits at the opposite end of the axis from the mechanism the arc opened the door for.

---

## §DOUBTS (the executor's own, before anyone else's)

1. ⭐ **THE 6.4 % REFUSAL SET IS UNPRICED, AND IT IS NOT RANDOM.** `preferredPassPower` returns
   `null` unless the option prices at **all three** rungs, so 4,858 of 76,410 calls produced
   nothing and those options appear in no denominator. They are disproportionately the options that
   *stop being priceable* somewhere on the ladder — plausibly the very marginal ones. The count is
   published; the composition is **UNMEASURED**, and a chooser that enumerated per rung would meet
   them.
2. ⚠ **THE EXECUTION-NOISE FACE IS A PROXY AND THE BRIEF'S σ CITE IS LOOSE IN KIND.** PW-C0's
   σ ≈ 6.7 % is a σ on the **struck power multiplier**, not on a price or a share; no honest CI on
   a price margin can be derived from it. What this document publishes instead is a declared
   first-order proxy (`slope × σ`, both terms measured: the slope is a finite difference of the
   rule's own prices, σ is the shipped law evaluated for the actual passer) — **and it is
   first-order on a step function, which is the one function a derivative describes worst.** Read
   it as an order of magnitude (≈8 % of preferences), never as a test. The real answer is PW-T1's
   sim exam, exactly where #291.1 put it.
3. ⚠ **NO SIMULATION WAS PERTURBED — A PREFERENCE IS NOT A USAGE.** Every number here is what the
   rule *would* pick at a real decision moment. `gNonPerturbing` proves the instrument changed
   nothing (15/15 signature-identical control walks). Whether a live chooser reaches these options
   at all is PW-T0b's and PW-T1's question.
4. ⚠ **THE PRICES INHERIT THE SHIPPED OPTIMISM.** The oracle carries no orientation term and no
   execution error (§D, proven by term-list diff). Levels are optimistic; the *shape* is what the
   chooser's own instrument would see, which is why the shape is what is reported.
5. **THE `ref` POPULATION IS A CHOICE, AND IT IS DISCLOSED THREE WAYS.** Defining the option set at
   the reference rung is the honest model of *today's* enumerator, but it is one of three defensible
   definitions. All three are published in full (§B.4) and none inverts the ordering — but a fourth
   definition (per-rung enumeration with per-rung admission) is exactly option ② in §F and is
   **not measured here**.
6. **THE THREAT-QUINTILE FACE IS A SINGLE CELL.** The brief asked for the distribution "by threat
   quintile (the oracle's own quintiles)"; the honest answer is that the chooser-facing population
   occupies exactly one of them. It is reported as NEVER-OCCURRED with the structural reason
   (§B.2), not quietly dropped — but it does mean this stage cannot say what the rule would prefer
   in a threatened corridor, because the shipped ladder never publishes one.
7. **CROSS-SLICE READINGS ARE CONSERVATIVE, NOT PAIRED.** Only the curve contrast carries a paired
   |Δ| ÷ half-width; the direction/distance/pressure comparisons are read off independent cluster
   CIs, which understates resolution. No starred finding in §E rests on a cross-slice comparison
   alone.

---

## §HYGIENE RECEIPTS

| item | receipt |
| --- | --- |
| freeze | `b3da9d8`, committed **before** the battery; probe **byte-unchanged** at result (`git diff --stat b3da9d8 -- scripts/probes/pw-t0a-preference-census.ts` = empty) |
| `xSrcUntouched` (corrected form, #286.1) | `git diff --stat HEAD -- src` empty **AND** `git status --porcelain -- src` empty |
| gates · mutants | **18/18** · **69/69 LIVE**, coverage map machine-derived, exactly-one enforced (#268.3(a)) |
| G-DET | two full runs, digests bit-identical |
| `gFaces` (#287.1) | the SERIALIZED artifact is parsed **back off disk** and every published point re-derived from the stored per-seed cells |
| per-seed cells | stored for all 200 seeds (#282.2(ii)) |
| envelope (#266.3(a) / #289.1) | `preflight`, `preflightReasons`, `mode`, `head`, `outPath`, `wallMs`, `generatedAt` are **named** by the exclusion gate and live outside the hashed body; a cross-out with a different envelope re-derives the identical digest |
| data-source guard (#289 canon) | the L3-T1 dose artifact's **FILE BYTES** are hashed and its own digest re-derived from them |
| env | whitelist-or-refuse (`PWT0A_MODE｜PWT0A_N｜PWT0A_OUT`), all ten engine doors refused, preflight may not write a canonical path (both refusals exercised by hand before the freeze) |
| no parallel oracle (M-PW.2 / #256.2) | the probe's own bytes are scanned for pricing identifiers **assembled at run time**, so the check cannot self-match; 0 hits |
| divergence claims (#291.5) | term-list diff, published in full (`divergenceOneTermDiff`) |
| clock | 240 sim-s APPLIED per walk; every face dimensionless |
| `resultSha256` | `962ebb1586b3097cc68735dbd57ffcfe5354db3844229f2ea841bf8ac94939a8` |

**CONSUMPTION** — block `12,491,000–999`: battery `100–299` (200 walks × 2 G-DET runs) ·
perturbation controls `100–114` (15 quiet re-walks) · smoke `000–002` walked of booked `000–019` ·
preflight/guard `040–042` walked of booked `040–059` · world-identity `900` **constructed,
never stepped**. Booked-not-walked tails retire with the block. **Stats base 112,600 exactly**
(bootstrap 2,000 draws, cluster over match seeds).


## §COMMANDER CORRECTIONS OF RECORD (ruling #292, 2026-08-15 — read BEFORE quoting this doc)

Verify PASS-WITH-FINDINGS (2 MED + 4 LOW). Every headline distribution re-derived
independently (the verifier's own pooling AND own 4,000-draw bootstrap). The mechanism finding
(q0 saturation ⇒ the price is blind to the corridor by construction) STANDS and is the stage's
lasting contribution. Corrections binding on quotation:

1. **(MED) THE `ref` POPULATION IS NOT BU-C0's LADDER VERBATIM**: L1 (the behind-ball band) is
   never applied as admission — `ref` = L2∧L3∧L4 over ALL directions (34.4 % of it is
   forward/lateral, which BU-C0's L1 excludes by definition). The receipt "L1∧L2∧L3∧L4
   verbatim" is FALSE as written. The finding survives on every slice (outfield-backward:
   80.17 / 18.03 / 1.80 %), but the headline 80.03 % is an all-direction share.
2. **(MED) THE HEADLINE IS NOT A CHOOSER-FACING SHARE**: 59.5 % of `ref` sits outside the live
   chooser's own enumeration window (6–30 m, GK excluded — GK-target options alone are
   34.7 %). The chooser-facing (in-window) shares: floor 75.59 % base / 78.55 % heavy,
   ceiling 3.75 % / 0.29 % — the direction survives; quote the in-window split when talking
   about the live chooser.
3. **(LOW) THE VERDICT LABEL IS POPULATION-CONTINGENT**: on the fully-paired `all3` population
   (the denominator-stable one) the pre-registered DEGENERATE clause reads TRUE (95.72 /
   98.15 % floor under base/heavy). `ref` was declared primary in the frozen body before the
   battery, so MIXED stands procedurally — but the reading of record is: **floor-degenerate
   on priced survivors, with a structured residual** (ceiling share higher forward · short ·
   pressed · outfield), and the mechanism is the story, not the label.
4. **(LOW) "The quintile improves at the ceiling for ZERO options" is a TAUTOLOGY on
   `ref`/`all3`** (100 % of survivors are q0 at reference, and q0 is the minimum band —
   improvement is impossible by construction). Quote the structural fact (L4 admission ⇒ q0),
   not the zero as if it were a measurement.
5. **(LOW) Brief-level denominator slips, doc-corrected**: DIVERGENCE-1's faces carry
   den = 31,844 (not 31,160); the union headline n = 35,776 is the rule-PRICED subset of the
   38,205-option union (6.4 % refusals unpriced, composition honestly UNMEASURED).
6. **(LOW) The shipped argmax breaks exact ties toward the FLOOR** (58 options, 0.19 %,
   floor share 80.03 → 79.84 % without them — negligible, published, stated here for the
   record).
