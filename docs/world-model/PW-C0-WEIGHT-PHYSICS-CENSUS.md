# PW-C0 — THE WEIGHT-PHYSICS CENSUS (instrument-only)

> **Contract**: [`PW-PASSWEIGHT-CONTRACT.md`](PW-PASSWEIGHT-CONTRACT.md) §3 PW-C0 (M-PW.1 physics
> honesty first · M-PW.3 the dominance hazard), bound by **#290.2**, dispatched by **#290.3**.
> **Freeze** `baf6263` → result; probe **byte-unchanged** between freeze and result.
> **Artifact** [`data/pw-c0-weight-physics-census.json`](data/pw-c0-weight-physics-census.json)
> · `resultSha256` `39c19e4f6d95ef571681982614677bed2b530f3160f408de152f7b0bd51f4926`
> · **17/17 gates · 70/70 mutants LIVE · G-DET bit-identical · ZERO `src/**` edits**.

---

## §SOURCES READ FIRST (the citation hunt is at SIX strikes — every clause below was opened)

* **`PW-PASSWEIGHT-CONTRACT.md`** — §2 M-PW.1 (the expressible range is DERIVED from the shipped
  clamp's own bounds; rungs derived, never taste; the BU-T0b λ_LIN idiom) and M-PW.3 (the
  dominance hazard: if the engine charges nothing for receiving a faster ball, max weight
  strictly dominates); §3's four instruments; §4's non-claims.
* **`PROGRAMME-RULINGS.md` #286–#290** in full. Binding here: **#286.1** (the GK-split debt and
  the CORRECTED `xSrcUntouched` form — `git diff --stat HEAD -- src` **AND**
  `git status --porcelain -- src`) · **#287.1** (re-derivation gates read the **SERIALIZED**
  artifact, never the in-memory objects) · **#288.4** (a starred finding states its
  **|Δ| ÷ half-width**) · **#289.1** (preflight facts belong in the **ENVELOPE**, named by the
  exclusion gate; arming receipts are never quoted as effect sizes; a data-source guard hashes
  the **FILE BYTES** it reads) · **#283.2(iv)** (fixtures play the SHIPPED world ⇒ construct
  every match directly and assert the arming live).
* **`BU-C0-RECEPTION-OPTION-CENSUS.md` §COMMANDER CORRECTIONS OF RECORD (#286)** — read before
  any number was quoted. Binding: correction 1 (the ladder is **GK-inclusive**; any instrument
  quoting it carries **GK-SPLIT RUNGS**) and correction 5 (the `xSrcUntouched` canon, used here
  in its corrected form).
* **`BU-T0-DV-COMPOSITION.md`**, **`BU-T0B-PRICE-SEPARATION.md`**, **`BU-T1-MT-COMPOSITION.md`**
  §COMMANDER CORRECTIONS — the numbers of record taken forward are **BU-T1's**: outfield
  corridor survival **24.56 %**, outfield end-to-end **21.08 %**, options/reception
  **0.766–0.794**, keeper lane survival **56.90 %**, keeper share **53.89 %**, and the corridor
  owning **82.08 %** of the outfield option loss. Every one of them **replicates here on virgin
  seeds at the reference rung** (§B.0 below) — which is what makes the rung rows
  commensurable rather than merely comparable.
* ⚠ **The λ_LIN idiom is BU-T0b's, not a formula**: "find the linear/faithful region, cap at its
  edge, never invent a transform." It is applied here to a DIFFERENT algebra and the derivation
  is printed in full rather than gestured at.

---

## §0 THE QUESTION, in football

⭐ **球只有一种速度。** At every range the engine strikes exactly one pace. The corridor is a race
between a defender's ETA and the ball's travel time, and today the passer cannot enter that race
with anything except the one ball the distance formula hands him. This stage asks four things
before anything is built:

1. If a player *could* hit it harder, would the engine carry that honestly all the way to the
   receiver's foot — or does something quietly eat it?
2. **How much does a firmer ball actually buy the pass backwards?** (the whole point)
3. What does the engine charge him for receiving a firmer ball? If nothing, "hit everything as
   hard as possible" wins and the axis is dead on arrival.
4. Do firmer balls sail past people and out?

**Nothing is armed, nothing is built, no seam gains a caller, `src/**` is byte-untouched.**

---

## §FORM

### The world

| | |
| --- | --- |
| **arm** | **the v7 world** — `new Match({ seed, teamA, teamB, ...a4MatchFlags(7) })` + `armA4World(m, null, 7, poolT1DoseCells(L3-T1))`: the CB layer + the learning defence at the SHIPPED entry's own POOLED matured dose. Asserted **live on every walked match** (`gArms`, #283.2(iv)). |
| **seeds** | **VIRGIN**: battery `12,490,100–299` (200 matches). Smoke `12,490,000–019`, preflight/guard `12,490,040–059`, world-identity `12,490,900` — all declared, all disjoint, all inside the dispatched block. |
| **clock** | ENGINE DEFAULT, **APPLIED not nominal** (`gClock` asserts `duration === MATCH_DURATION` on every walk): 240 sim-s match; the display clock 90′ is read out of `Match.minute()`'s own expression ⇒ **1 sim-s = 22.5 display-s**. Shares and per-option means are dimensionless; `receptionsPerMatch` is convention B (our match IS the 90′). ⚠ **Flight/travel seconds are SIM seconds** — the ×22.5 mapping is a match-clock convention for per-match COUNTS, never a rescaling of ball physics. |
| **population** | 27,715 receptions · 18,313 pressed receptions · 42,538 pressed-carrier moments · 441,436 oracle calls **per rung** · 1,622,341 corridor calls at the reference rung · 99,634 surviving options at the reference rung. |

### ⭐⭐ THE DESIGN: one arm, many rungs, PAIRED WITHIN SCENE

The contrast is not armed-vs-bare, it is **rung-vs-rung on the same photograph**. At every
reception the census is taken **six times** — same carrier, same team-mates, same defenders, same
tick — changing only the `powerMultiplier` the engine's own evaluator is asked with. `gPaired`
asserts that the **L1 body counts are byte-identical across every rung column** (3,000 checks, 0
bad); that is the pairing *proof*, not a comment. It is why the deltas below have half-widths a
fifteenth the size of the effects.

### The ladder — BU-C0's definition VERBATIM, with power threaded through

| rung | asks | whose code answers |
| --- | --- | --- |
| **L1 POSITION** | `Δ = localX(mate) − localX(ball)`; BEHIND ⇔ `Δ ≤ −2 m` | the ±2 m band **EXTRACTED at run time** from the engine's own forward-pass line (`src/sim/mechanics.ts:419`) — never typed |
| **L2 RANGE** | does the ball arrive at all **at this power**? | `predictGroundPass(..., powerMultiplier)` reachability |
| **L3 RACE** | `arrivalMargin > 0` **at this power** | `evaluatePassAffordance(..., powerMultiplier)` |
| **L4 CORRIDOR** | can anyone meet it **on its path** at this power? | `evaluatePassCorridorInterception(..., powerMultiplier)` |

⭐ **THE PUBLISHED OPTION IS L1 ∧ L2 ∧ L3 ∧ L4** — BU-C0/BU-T0/BU-T0b/BU-T1's frozen definition,
so every row is commensurable by construction, and **every rung of the ladder is split GK /
outfield** (#286.1's debt, honoured).

---

## §A THE PHYSICS AUDIT — every derivation printed

### A.1 The pipeline, machine-read from `src/**` at run time

1. **CHOICE** — `performPass(match, passer, mate, offsideExempt, powerChoice = 1, ptpLead)`. The
   weight **input already exists**.
2. ⭐ **THE ONLY POWER CLAMP** — `intended = clamp(powerChoice, 0.85, 1.15)`
   (`mechanics.ts:370`). Occurrences of that clamp in `src`: **exactly 1** (gated).
3. **LEAD** — `flight = dist / (16 · orientation·intended)`, receiver led by `vel · flight · 0.8`.
   The passer leads on **what he meant**.
4. **EXECUTION ERROR** — `executedPassPower`: `gaussian × |intended − 1| × 0.60 × (1.35 −
   passing)`, clamped to `[0.70, 1.30]`. ⭐ **At `intended === 1` it returns 1 and draws NO RNG** —
   which is exactly why the axis can be armed with byte-identity off.
5. **STRIKE** — `speed = clamp(d·0.6 + 8.2, 9, 22) · executedMul` (`mechanics.ts:392`).
6. **THE ORACLE MIRROR** — `predictGroundPass` (`prediction.ts:50`): the **same law**, but power
   is **floored only** (`Math.max(0.1, powerMultiplier)`, `prediction.ts:55`) and carries **no**
   execution error.
7. **FRICTION** — `groundBallTravelTime` walks the engine's own geometric series
   (`decay = exp(−0.55·DT)` per tick). Range ceiling = `launchSpeed × 1.826528` m.
8. **ARRIVAL SPEED** — `groundBallSpeedAt = launchSpeed · exp(−k·t)` (`passOptionValue.ts:95`).
9. **PROPAGATION** — the multiplier reaches `evaluatePassAffordance` (`passAffordance.ts:89`),
   `evaluatePassCorridorInterception` (`passCorridorInterception.ts:84`) and `evaluatePassOption`
   (`passOptionValue.ts:176`). Each defaults it to 1.

**Live callers (gated receipt)**: 3 `performPass` call sites in `PlayerBrain`; **1** supplies an
explicit power argument and it is the literal `1`; **0** choose a non-default weight. The axis is
dormant, exactly as the contract's §0 records. (The power slot is argument index 3 of the
**wrapper** `Match.performPass(p, mate, offsideExempt, powerChoice, ptpLead)`, and the wrapper's
own signature is a gate conjunct — see §DOUBTS 1 for why that matters.)

### A.2 ⭐⭐ DOES THE MULTIPLIER PROPAGATE HONESTLY? — YES, and the proof is arithmetic

The clamp is applied **to the distance law and then multiplied**:

```
speed(d, p) = clamp(d·0.6 + 8.2, 9, 22) · p
            = B(d) · p          where B(d) is a CONSTANT for a given d
⇒ ∂speed/∂p = B(d)              — exactly linear in p, at every distance
```

So **there is no saturation of the power axis itself and no transform is needed or invented**.
Measured, not asserted: over 8 distances × 6 rungs the oracle's own `predictGroundPass` matches
`B(d)·p` with **maximum relative error 0** (exactly zero, gated at `< 1e-12`). The sim's line and
the oracle's line carry **identical constants** (0.6 / 8.2 / 9 / 22) and identical lead divisors
(16), also gated.

⭐⭐ **THE ONE DIVERGENCE, and it is the whole design constraint**: the **SIM clamps the CHOSEN
power to [0.85, 1.15]**; the **ORACLE only floors it at 0.1**. Inside the sim's clamp the two
agree exactly. Outside it, the oracle keeps happily pricing a ball the sim would never strike —
**the oracle would lie**.

⭐ **THE SECOND DIVERGENCE, declared**: the oracle prices the **INTENDED** power; the sim strikes
the **EXECUTED** one (σ = `|p−1| · 0.60 · (1.35 − passing)`; at p = 1.15 and an average passer
that is σ ≈ 0.0765, ~6.7 % of the ball). At p = 1 the error is identically zero. Every rung row
in §B away from 1.0 is therefore an **unbiased but noiseless — i.e. optimistic — reading** of
what would really be struck. This is a known, stated optimism, not a hidden one, and the chooser
slice must carry it.

### A.3 WHERE THE CLAMPS BITE (they bite on distance, never on power)

```
low  clamp:  d ≤ (9  − 8.2)/0.6 =  1.3333 m  → the base pins at  9 m/s
high clamp:  d ≥ (22 − 8.2)/0.6 = 23.0000 m  → the base pins at 22 m/s
```

⭐ **Beyond 23 m EVERY ball is the same 22 m/s base — that IS the "one pace per range" the
contract's §0 names, and it is precisely where a weight choice has the most to add.** Range
ceilings: `22 × 1.826528 = 40.18 m` at the base cap; `22 × 1.15 × 1.826528 = 46.21 m` at max
weight.

### A.4 ⭐⭐ THE EXPRESSIBLE REGION — derived, then capped at its own edge

The λ_LIN idiom asks: *where is the seam faithful, and what is the edge?* Here the faithful
region is **the whole line** (§A.2 — the law is exactly linear in p). What bounds the axis is not
fidelity but the **substrate's own clamp**:

> **EXPRESSIBLE WEIGHT REGION = [PASS_POWER_MIN, PASS_POWER_MAX] = [0.85, 1.15]**, taken verbatim
> from `mechanics.ts:370`. Any rung outside it is priced by the oracle and **not struck** by the
> sim ⇒ unexpressible. **Cap at the edge; invent nothing.**

The **execution envelope** `[0.70, 1.30]` (`PASS_POWER_EXECUTED_MIN/MAX`) is a *consequence* of a
choice — where the technique error can carry a ball — **never a choice**. It is not part of the
chooser's region.

### A.5 ⭐⭐ THE RUNG LADDER — from the region's own arithmetic, never taste

| rung | power | derivation | expressible |
| --- | --- | --- | --- |
| `p0850` | **0.850** | `PASS_POWER_MIN` — the substrate's own floor | ✅ |
| `p0925` | **0.925** | `(PASS_POWER_MIN + REF)/2` — declared midpoint of the lower half | ✅ |
| `p1000` | **1.000** | `REF` = the shipped default `powerChoice = 1`, the value every live caller passes | ✅ **reference** |
| `p1075` | **1.075** | `(REF + PASS_POWER_MAX)/2` — declared midpoint of the upper half | ✅ |
| `p1150` | **1.150** | `PASS_POWER_MAX` — the substrate's own ceiling | ✅ |
| `p1300` | **1.300** | ⚠ `PASS_POWER_EXECUTED_MAX` — **THE DIAGNOSTIC RUNG**, outside the region | ❌ |

`p1300` exists to **exhibit** the divergence, and the exhibit is gated: at every expressible rung
`simIntended === oraclePriced` (honest); at `p1300` the sim would clamp a *choice* back to 1.15
while the oracle prices 1.30 (**proven dishonest**). It is reported throughout as an upper bound
on what the physics could do, and **never offered to a chooser**.

Per-rung arithmetic at a 15 m ball (the oracle's own numbers):

| rung | launch (m/s) | travel (sim-s) | arrival (m/s) | range ceiling (m) |
| --- | --- | --- | --- | --- |
| 0.850 | 14.62 | 1.5000 | 6.41 | 26.70 |
| 0.925 | 15.91 | 1.3333 | 7.64 | 29.06 |
| **1.000** | **17.20** | **1.1833** | **8.97** | **31.42** |
| 1.075 | 18.49 | 1.0833 | 10.19 | 33.77 |
| 1.150 | 19.78 | 0.9833 | 11.52 | 36.13 |
| ⚠ 1.300 | 22.36 | 0.8333 | 14.14 | 40.84 |

---

## §B THE CORRIDOR-RESPONSE CENSUS — what a firmer ball buys

### B.0 ⭐ REPLICATION at the reference rung (why these rows are commensurable)

| face | BU-T1 / BU-T0 of record | PW-C0 `p1000`, virgin seeds |
| --- | --- | --- |
| outfield backward **corridor survival** | 24.56 % | **24.49 %** |
| outfield backward **end-to-end** (L4/L1) | 21.08 % | **21.09 %** |
| behind-ball **options / reception** | 0.766–0.794 | **0.7732** |
| **keeper** lane survival | 56.90 % | **57.06 %** |
| **keeper share** of surviving backward options | 53.89 % | **53.83 %** |
| corridor's share of the outfield option loss | 82.08 % | **82.42 %** |

The instrument lands on the banked world exactly. Everything below is therefore a **response**,
not a re-measurement.

### B.1 ⭐⭐ THE KEY NUMBER — outfield BACKWARD corridor survival, per rung

| rung | survival | 95 % CI | Δ vs 1.000 | Δ CI | **\|Δ\|÷half-width** | relative |
| --- | --- | --- | --- | --- | --- | --- |
| 0.850 | 0.1944 | [0.1878, 0.2011] | −5.05 pp | [−5.33, −4.77] | **17.9×** | −20.6 % |
| 0.925 | 0.2222 | [0.2153, 0.2293] | −2.27 pp | [−2.45, −2.10] | **12.9×** | −9.3 % |
| **1.000** | **0.2449** | [0.2379, 0.2523] | — | — | — | — |
| 1.075 | 0.2640 | [0.2568, 0.2715] | +1.91 pp | [+1.75, +2.07] | **11.7×** | +7.8 % |
| ⭐ **1.150** | **0.2791** | [0.2716, 0.2869] | **+3.42 pp** | [+3.21, +3.65] | **15.4×** | **+14.0 %** |
| ⚠ 1.300 | 0.3106 | [0.3029, 0.3185] | +6.57 pp | [+6.29, +6.84] | 23.9× | +26.8 % |

**In football**: at the hardest ball the substrate lets him mean, a backward pass that wins the
race survives the corridor **24.5 % → 27.9 %** of the time. **Resolvedly real, and small.**

The same in the shapes that matter downstream:

| face | 1.000 | 1.150 | Δ | \|Δ\|÷hw | relative |
| --- | --- | --- | --- | --- | --- |
| outfield backward **end-to-end** (L4/L1) | 0.2109 | 0.2504 | +3.94 pp | **19.8×** | +18.7 % |
| outfield backward **options / reception** | 0.3570 | 0.4237 | +0.0668 | **18.7×** | +18.7 % |
| behind-ball options / reception (GK-incl) | 0.7732 | 0.9263 | +0.1531 | **23.3×** | +19.8 % |
| … at **pressed** receptions | 1.1702 | 1.4018 | +0.2316 | **22.5×** | +19.8 % |
| **all-direction** options / reception | 1.1590 | 1.3925 | +0.2335 | **30.7×** | +20.1 % |
| **flight time** on surviving options (sim-s) | 1.1800 | 1.0752 | −0.1048 | **11.5×** | −8.9 % |

⭐ **THE MECHANISM IS VISIBLE AND IT IS THE ONE THE CONTRACT NAMED**: flight time falls ~9 %, and
every downstream rung moves with it. Nothing else changed — same bodies, same tick.

### B.2 ⭐⭐ DIRECTION × GK-SPLIT — the finding the direction pre-registration must hear

Corridor survival, **1.000 → 1.150**:

| lane | 1.000 | 1.150 | Δ (pp) | \|Δ\|÷hw | **relative** |
| --- | --- | --- | --- | --- | --- |
| **outfield backward** | 0.2449 | 0.2791 | **+3.42** | 15.4× | +14.0 % |
| **GK backward** | 0.5706 | 0.6095 | **+3.88** | 7.1× | +6.8 % |
| **lateral** | 0.2790 | 0.3155 | **+3.65** | 10.5× | +13.1 % |
| **forward** | 0.1451 | 0.1772 | **+3.21** | 15.3× | **+22.1 %** |

⭐⭐ **THE WEIGHT AXIS IS DIRECTION-NEUTRAL IN ABSOLUTE TERMS.** Every lane gains the same
**3.2–3.9 pp**. It does not *re-route* the ball backwards — it lifts the whole pitch by one flat
slab. Because the forward lane starts lowest (14.5 %), the **forward** ball gains the most in
*relative* terms (+22.1 %, and +26.6 % in options/reception).

⭐ Corroborating: the **keeper share of surviving backward options** is 0.5383 → 0.5425
(+0.42 pp, **1.38×** — MARGINAL, not resolved as a football fact). A firmer ball does **not**
shift the backward mix away from the goalkeeper.

**This is a pre-registered-direction problem, stated now rather than discovered later.** H-PW.2
pre-registers that "a surviving backward ball should be CHOSEN more without any nudge". PW-C0
shows the *supply* side rises for backward balls — but it rises at least as much everywhere else,
so a chooser fed this axis has **no structural reason to prefer backwards**. If PW-T0's usage
face comes back forward-shifted, that is the *predicted* outcome of this geometry, not a surprise.

### B.3 ⭐ WHERE THE LOSS GOES — the corridor's share RISES with weight

Outfield backward ladder, per reception (L1 is rung-independent by construction):

| rung | L1 | L2 range | L3 race | L4 corridor | range loss | race loss | **CORRIDOR loss** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0.850 | 1.6925 | 1.6280 | 1.3653 | 0.2654 | 4.52 % | 18.41 % | **77.08 %** |
| **1.000** | 1.6925 | 1.6670 | 1.4577 | 0.3570 | 1.90 % | 15.68 % | **82.42 %** |
| 1.150 | 1.6925 | 1.6863 | 1.5183 | 0.4237 | 0.49 % | 13.24 % | **86.27 %** |
| ⚠ 1.300 | 1.6925 | 1.6924 | 1.5547 | 0.4828 | 0.00 % | 11.39 % | **88.61 %** |

⭐⭐ **A FIRMER BALL DOES NOT DISSOLVE THE CORRIDOR — IT CONCENTRATES THE LOSS INTO IT.** Range
loss essentially vanishes (1.90 % → 0.49 %) and race loss falls (15.68 % → 13.24 %), so the
corridor's share of everything that goes wrong rises from **82.4 % to 86.3 %**. The fourth
independent confirmation that **the corridor's lethality is a property of the pitch** (#288.3):
even at the substrate's ceiling, three-quarters of the outfield backward bodies still have no
live ball to receive.

---

## §C THE RECEIVING-COST AUDIT (M-PW.3) — the dominance-hazard verdict

### C.1 What the engine charges TODAY, machine-read

1. **A FREE ZONE.** `attemptFirstTouch` returns clean **without rolling** when the closing speed
   ≤ **6 m/s**, and **always** for a goalkeeper.
2. **A SPEED TERM.** `touchFailChance`: `clamp01((s − 6)/8) · 0.07` — the shipped curve
   **saturates at 14 m/s**, and its entire span is worth **0.07 raw pFail units**
   (× 0.875 for a generic receiver ⇒ **6.13 pp absolute** end to end).
3. **A HARD CEILING** at pFail 0.4.
4. **THE ORACLE MIRRORS IT** — `mirroredTouchFailChance` restates the same curve and publishes
   `touchFailPrior`; a contract test pins the two equal.
5. ⭐⭐ **THE CHOOSER-FACING GAP** — the published **option ladder** (L1∧L2∧L3∧L4), which is what
   BU-C0/BU-T1 and this census measure *and what the live `perceivedPassChoice` prices by*
   (`threatQuintilePrice(interceptionThreatSeconds)`), **does not read `touchFailPrior` at all**.
6. ⭐⭐ **A DERIVED ALTERNATIVE ALREADY SHIPS.** `TOUCH_SPEED_COST.heavy` (span 16, weight 0.24)
   is in `src` today, flag-selected per call (`match.edsTouchCost`, **OFF** in the walked world —
   gated). Its saturation lands at **22 m/s = the ground-pass launch cap exactly**.

### C.2 What it actually costs, measured on the surviving-option population

| face | 0.850 | **1.000** | 1.150 | ⚠1.300 | Δ(1.15−1.00) | \|Δ\|÷hw |
| --- | --- | --- | --- | --- | --- | --- |
| mean **arrival speed** (m/s) | 6.21 | **8.15** | 10.22 | 12.45 | +2.073 | **91.5×** |
| mean **closing speed** (m/s) | 7.45 | **9.22** | 11.21 | 13.39 | +1.990 | **70.0×** |
| share **below the free threshold** (≤6 m/s) | 28.65 % | **13.78 %** | 7.14 % | 3.67 % | −6.64 pp | **15.8×** |
| share **at/above BASE saturation** (≥14 m/s) | 1.11 % | **8.40 %** | 18.53 % | 48.11 % | +10.13 pp | **27.6×** |
| share at/above **HEAVY** saturation (≥22 m/s) | 0.00 % | **0.00 %** | 0.00 % | 0.02 % | — | — |
| share at the pFail **ceiling** (0.4) | 0.00 % | **0.00 %** | 0.00 % | 0.00 % | — | — |
| mean **base speed term** (raw) | 0.0170 | **0.0295** | 0.0439 | 0.0565 | +0.0144 | **64.5×** |
| mean **heavy speed term** (raw) | 0.0291 | **0.0517** | 0.0801 | 0.1119 | +0.0284 | **76.7×** |
| mean **`touchFailPrior`** (full, oracle's own) | 0.0482 | **0.0592** | 0.0723 | 0.0843 | +0.0131 | **48.2×** |

### C.3 ⭐⭐ THE VERDICT OF RECORD

> **THE ENGINE DOES CHARGE — the hazard's literal antecedent ("if the engine charges NOTHING")
> is FALSE. But the charge is roughly HALF the gain, and the CHOOSER THE CONTRACT NAMES CANNOT
> SEE IT. The dominance hazard therefore FIRES — CHOOSER-SIDE, not physics-side.**

Three findings, in order:

**(i) The physics charge is real, monotone and unsaturated.** Only 8.4 % of surviving options are
already past the shipped curve's 14 m/s saturation at the reference rung, and still only 18.5 %
at the ceiling rung — **81 % of the population sits on the responsive part of the curve**, and
nothing is pinned at the hard 0.4 ceiling. The engine has *not* run out of ability to charge.

**(ii) The ledger, on the slice this arc is about** (outfield backward survivors; arithmetic over
the published points, absolute pFail = raw × 0.875, so these ratios carry **no CI of their own**):

| rung | Δ corridor survival | Δ charge (shipped curve) | ratio | Δ charge (heavy curve) | ratio |
| --- | --- | --- | --- | --- | --- |
| 0.850 | −5.05 pp | −1.28 pp | 3.94 | −2.24 pp | 2.26 |
| 1.075 | +1.91 pp | +0.74 pp | 2.57 | +1.37 pp | 1.39 |
| **1.150** | **+3.42 pp** | **+1.48 pp** | **2.30** | **+2.84 pp** | **1.20** |
| ⚠ 1.300 | +6.57 pp | +2.61 pp | 2.51 | +5.80 pp | 1.13 |

The firmer ball is favoured about **2.3 : 1** under the shipped curve and about **1.2 : 1** under
the banked heavy one. **A trade-off exists; it is simply lop-sided.**

**(iii) ⭐⭐ THE JOINING RULE ALREADY EXISTS IN `src`, PRE-REGISTERED, AND IT DOES NOT SAVE US.**
`perceivedPassChoice.preferredPassPower` (the E3 canary) already fixes the rule *before any
result*:

```
price(power) = quintilePrice(threat(power)) × (1 − touchFail(power)) / (1 − touchFail(1.0))
```

Evaluated at this census's own population means on the outfield-backward slice:

| rung | corridor factor | survival factor (shipped) | **price** | survival factor (heavy) | **price (heavy)** |
| --- | --- | --- | --- | --- | --- |
| 0.850 | 0.7938 | 1.0118 | 0.8031 | 1.0215 | 0.8108 |
| **1.000** | 1.0000 | 1.0000 | **1.0000** | 1.0000 | **1.0000** |
| 1.075 | 1.0778 | 0.9931 | 1.0704 | 0.9868 | 1.0636 |
| **1.150** | 1.1396 | 0.9861 | **1.1238** | 0.9726 | **1.1083** |

⭐⭐ **AT POPULATION MEANS, MAX EXPRESSIBLE WEIGHT STILL WINS UNDER BOTH CURVES** — monotone,
1.0 → 1.12 (shipped) and 1.0 → 1.11 (heavy). The shipped joining rule prices the receiving cost
honestly and **the cost is simply too small to reverse the ordering at the mean.**

⇒ **THE NAMED PREREQUISITE, restated in the form the evidence supports.** The contract's M-PW.3
says a derived receiving cost becomes a named prerequisite slice "if nothing" is charged.
Something *is* charged, so the prerequisite is **not "build a cost"** — it is:

> **WIRE THE EXISTING COST INTO THE ENUMERATION, AND MEASURE WHETHER A NON-DEGENERATE CHOSEN
> REGION EXISTS AT ALL.** Both halves already exist in `src` (`preferredPassPower`'s joining rule
> and `TOUCH_SPEED_COST.heavy`); neither is taste; neither needs a new pricing table, which is
> exactly M-PW.2's requirement.

⚠ **What this census CANNOT settle** (§DOUBTS 3): the mean says max wins; the chooser acts
**per option**. Whether the per-option `preferredIndex` distribution is degenerate (one corner)
or genuinely spread is **UNMEASURED here** — and it is the single number that decides whether
H-PW.1's clause (a) can ever pass. It is PW-T0's first duty, not a post-hoc addition to a frozen
battery.

---

## §D THE OVERSHOOT FACE

Two measurements, both through the engine's own closed forms
(`rolledDistance`, `D∞ = v / BALL_FRICTION_K`, `src/sim/carryBeat.ts`), on the surviving-option
population.

| face | 0.850 | **1.000** | 1.150 | ⚠1.300 | Δ(1.15−1.00) | \|Δ\|÷hw |
| --- | --- | --- | --- | --- | --- | --- |
| **overruns the control envelope** (>1.25 m past a LATE receiver) | 0.07 % | **0.10 %** | 0.12 % | 0.17 % | +0.020 pp | **1.01×** |
| mean overrun (m) | 0.0026 | **0.0033** | 0.0044 | 0.0058 | +0.0010 | 5.06× |
| ⭐ **roll-out endpoint leaves the pitch** | 43.56 % | **49.05 %** | 59.36 % | 69.42 % | **+10.32 pp** | **19.1×** |
| mean **D∞** past the receiver (m) | 11.29 | **14.82** | 18.59 | 22.64 | +3.769 | **91.5×** |

**(a) THE RECEIVER-OVERRUN FACE IS A NULL, and honestly so.** The class **does occur** (it is not
a zero denominator, not "UNMEASURED": ~0.1 % of ~100k survivors) but it barely moves — **1.01×
half-width, MARGINAL**. The reason is structural and worth stating: L3 already requires
`arrivalMargin > 0`, so on a *surviving* option the receiver is essentially never late to the
landing point. **The engine's geometry does not punish a firmer ball at the receiver's feet.**

**(b) ⭐ THE "SAILS AWAY" FACE IS LOUD.** At the ceiling rung, **59 %** of surviving options have
an *untouched* roll-out endpoint outside the pitch, and the ball would still be travelling
**18.6 m** past the receiver when it got there. ⚠ **This is geometry on an untouched ball** — the
engine's receiver usually touches it. It does not predict balls going out; it prices the
**consequence of failing the touch**, which is the only route from "too firm" to "bad outcome"
this engine has today:

> **firmer ball → higher `touchFailChance` → loose ball → a roll-out that leaves the pitch 59 %
> of the time.** The receiving cost is the ONLY gate, and what sits behind it is severe. That
> makes §C's "wire the existing cost in" the load-bearing slice, not a nicety.

---

## §E ⭐⭐ THE CHOOSER-SLICE DESIGN PICK (contract §3: the census picks it)

Argued from the rows above, not from taste.

### E.1 The rungs PW-T0 enumerates

> **THREE: `{0.85, 1.00, 1.15}` — the substrate's floor, the shipped default, the substrate's
> ceiling.**

Why not five: the two midpoints are **redundant for enumeration**. Every face in §B and §C is
**monotone in power across all six rungs with no interior structure whatsoever** — 0.925 and
1.075 land almost exactly on the interpolation between their neighbours (e.g. outfield backward
survival 0.2222 / 0.2640 against midpoints 0.2196 / 0.2620). A chooser gains nothing from rungs
that add candidates without adding a distinguishable trade-off, and each extra rung multiplies
the per-decision oracle cost. The midpoints remain in the **census** (they are what proves the
monotonicity and rules out an interior optimum), and PW-T0 can add them later if the three-rung
world shows an interior preference.

Why exactly these three: they are the **only** rungs that are not arithmetic on other rungs —
each is a shipped constant. `PASS_POWER_MIN`, the default every live caller passes, and
`PASS_POWER_MAX`. This is also **exactly the ladder `PASS_CANARY_POWERS` already declares in
`PlayerBrain.ts:32`** (`[PASS_POWER_MIN, 1, PASS_POWER_MAX]`, fed to `preferredPassPower` under the `traceChoice`
flag at `PlayerBrain.ts:1210`) — the substrate has already picked these three for itself, which
is the strongest possible "never taste" argument.

**`1.30` is excluded and must stay excluded** — §A.5 proves it dishonest.

### E.2 ⭐ Must the receiving cost be built FIRST? — **NO. It must be WIRED first.**

M-PW.3's antecedent is false (the engine charges) but its *consequence* is live (max weight wins
at the mean under both curves, §C.3(iii)). The prerequisite is therefore **not a new mechanism**:

* the **joining rule** is already written and pre-registered in `src`
  (`perceivedPassChoice.preferredPassPower`), and it is the only rule that composes the corridor
  price with the touch price **without inventing a second pricing table** (M-PW.2, satisfied);
* the **cost curve** has two shipped candidates — `TOUCH_SPEED_COST.base` (2.30 : 1 in favour of
  firm) and `TOUCH_SPEED_COST.heavy` (1.20 : 1) — both derived, neither taste, the heavy one
  saturating exactly at the launch cap.

⇒ **No new-mechanism slice is needed before the chooser.** What *is* needed before the chooser
ships is the **measurement** that decides between "a real chosen region" and "an all-rockets
world" (the contract's §4 named failure mode).

### E.3 THE ORDER

| # | slice | why here |
| --- | --- | --- |
| **PW-T0a** | ⭐ **THE PREFERENCE CENSUS** (instrument-only, no src). Run `preferredPassPower` over the SAME reception population at `{0.85, 1.00, 1.15}` and publish the **per-option `preferredIndex` distribution** under BOTH shipped curves — plus the same table on the outfield-backward slice alone. | This is the one number §C could not settle and the one H-PW.1(a) is scored on. If it is degenerate at 1.15 under both curves, the chooser as designed **cannot** produce a chosen region and the arc must reframe **before** any src work — a cheap, honest gate. It needs no new mechanism: the function already exists and already has a frozen joining rule. |
| **PW-T0b** | the **weight chooser**, flag-gated, byte-identical off, enumerating the three rungs through the existing oracle and the existing score, with the curve PW-T0a selected. | Only build it once its own degeneracy question is answered. Byte-identity off is free here: `executedPassPower(1) === 1` draws no RNG (§A.1 step 4). |
| **PW-T1** | the **exam at the composition** (v7 vs v7+PW) on the BU faces, commensurable, with H-PW.2's standing institutions reported. | The composition law (M-BU.2, carried by M-PW.4). ⚠ **Pre-register §B.2's finding**: the axis is direction-neutral in pp, so a forward-shifted usage mix is the *predicted* result, not a failure of arming. |
| **PW-T2** | the entry rung, then the **play-test USER GATE**. | Contract §3. |

⚠ **The S∧¬T guard debt (#287.3/#289.1) is NOT triggered by this plan** — nothing in PW-T0a/b
touches the CB seat's arming block. If PW-T0b's implementation ends up doing so, M-PW.4 makes the
debt fall due in the same slice.

### E.4 The honest expectation, stated before the work

The ceiling this census establishes: at the substrate's maximum expressible weight, **outfield
backward end-to-end conversion goes 21.1 % → 25.0 %**, and **86 % of what remains is still the
corridor**. That is the biggest single-lever movement the whole BU arc has seen (every DV rung
had this face pinned flat; MT moved it +0.87 pp at 1.40×) — and it is **still a lane that kills
three balls in four**. **The weight door opens the lane's physics; it does not cure the lane.**
The contract's §4 already says this; the census now says it with numbers.

---

## §RECEIPTS

`17/17 gates` — gDet (bit-identical double run) · xSrcUntouched (**the corrected #286.1 form**:
`git diff --stat HEAD -- src` **and** `git status --porcelain -- src`, both empty) · gArms
(200/200 walks carry the v7 arm live; the identity seed separates the worlds) · gDose (⭐ #289
canon: the L3-T1 artifact's **own bytes** are hashed and its digest **re-derived from them**,
matching the shipped `L3_T1_SHA`) · gNonPerturbing (15/15 instrumented walks bit-identical to the
quiet walks — the oracle does not move the football) · **gPhysics** (14 conjuncts: both launch
laws extracted from `src` and identical; the power clamp occurs exactly once; the oracle has no
upper clamp; linearity error 0; every expressible rung honest and the diagnostic rung proven
dishonest; the live-caller receipt and the wrapper's signature) · **gPaired** (3,000 checks, 0
bad) · gOracle (every rung ran the corridor sampler and saw both verdicts and both sides of the
GK split) · **gTouchCost** (both curves are the shipped constants; the walked world uses the
SHIPPED curve, not the heavy one) · gNonVacuity (0 zero-denominator cells) · **gFaces** (⭐ #287.1:
the artifact is parsed **back off disk** and all 6 rung columns of all 39 faces re-derived from
the stored per-seed cells) · gClock (APPLIED) · gSeed · gStats · gEnvClean · gHashEnvelope (⭐ #289
correction 1: `preflight`, `preflightReasons`, `mode`, `head`, `outPath`, `wallMs`, `generatedAt`
are **named** in the exclusion list and live in the envelope; a cross-out with a different
envelope has the identical digest) · gMutants.
`70/70 mutants LIVE`, machine-derived coverage over all 67 conjuncts, exactly-one enforced.

**CONSUMPTION (BOOKED = WALKED)**: sim block `12,490,000–999` — battery `100–299` (200 seeds,
×2 G-DET runs) · non-perturbation controls `100–114` · smoke `000–002` (block `000–019` booked)
· **preflight/guard `040–042`** (block `040–059` booked; declared and disjoint — the timing
preflight and the two receipt-fix verification runs) · world-identity `900`
(**constructed, not stepped**). Booked-not-walked tails retire with the block.
**Stats walked `112,400` exactly** (cluster bootstrap, 2,000 resamples, seeded once, paired
draws shared across rungs). Next stats base ≥ **112,600**.

---

## §DOUBTS (honest, mine)

1. ⚠⚠ **A RECEIPT IN THE FIRST BATTERY WAS FALSE, AND I CAUGHT IT ONLY BY READING ITS OWN
   OUTPUT.** The first freeze (`0212f5d`) published
   `callSitesPassingANonDefaultPower: 3` — i.e. "all three live callers choose a weight", which
   contradicts the contract's §0 and the engine's own comment. The regex's negative lookahead
   sat on the *second* argument, so any ≥2-argument call matched. The probe was re-frozen
   (`baf6263`) with a **balanced-paren argument reader**, the power slot pinned to the
   **wrapper's own signature** (a gate conjunct), and three new gated conjuncts + mutants; the
   battery was re-run from that freeze. **No face, rung or measured number changed** (the
   corrected run reproduces every §B/§C/§D number). The lesson generalises past this probe: a
   *published-but-ungated* receipt is a number nobody checks. Everything derived from `src` text
   in this probe is now gated. ⚠ I cannot rule out that an equally silly regex survives somewhere
   in the extraction block — the ones that are gated are the ones I trust.
2. ⚠ **THE ORACLE PRICES A BALL NOBODY STRUCK.** Every rung row is a re-evaluation of the *same*
   walked world; nobody actually passed harder. What is measured is the option SET a chooser
   would *see*, and it omits the execution error (§A.2's second divergence). At 1.15 that is
   σ ≈ 6.7 % of the ball, one-sided in neither direction but **variance the chooser will not
   price**. The corridor is a threshold test, so added variance is not obviously neutral — it
   could cut either way and this census cannot say which.
3. ⚠⚠ **THE DOMINANCE VERDICT IS A MEAN, NOT A DISTRIBUTION.** §C.3(iii) evaluates the shipped
   joining rule at population means. A chooser acts per option, and the per-option
   `preferredIndex` distribution is **UNMEASURED here**. I deliberately refused to bolt it onto
   a frozen battery after seeing the results (the BU-T0 precedent, ratified) — it is PW-T0a's
   whole job. Until it exists, "max weight wins" is a statement about the average option, and the
   arc's degeneracy risk is **argued, not measured**.
4. ⚠ **THE OVERRUN NULL MIGHT BE A DEFINITION ARTEFACT.** I measure overrun only on options that
   already passed L3 (`arrivalMargin > 0`), which selects away exactly the receivers who are
   late. The face is honest for the population it names (surviving options — the set a chooser
   picks from) but it is **not** the general claim "firmer balls never overrun anybody". A
   census of *attempted* passes in the sim would be a different, and probably louder, instrument.
5. ⚠ **THE "LEAVES THE PITCH" FACE IS AN UNTOUCHED-BALL BOUND.** 59 % is what would happen if
   nobody touched it. The engine's receiver usually does. It bounds the pressure; it does not
   predict throw-ins.
6. ⚠ **THE THREE-RUNG PICK RESTS ON MONOTONICITY OVER SIX RUNGS**, which is strong evidence
   against an interior optimum in the *aggregate* faces — but an interior optimum could still
   exist **per option** (a 15 m ball to a turned receiver may genuinely prefer 1.0). §E.1 keeps
   the midpoints in the census for exactly this reason, and PW-T0a's distribution is what would
   reveal it.
7. ⚠ **`shareSurvivingOptionsAtOrAboveHeavySaturation` is 0.00 % at every expressible rung.** Its
   denominator is non-zero (~100k), so this is "**the class essentially never occurs**", not
   "unmeasured" — the heavy curve has full headroom across the whole expressible region. I report
   it as a headroom fact and gate nothing on it.
8. ⚠ **I did not measure usage, and this stage cannot.** Every face here is CAPABILITY. The whole
   BU arc's lesson (#289.4) is that existence and use are uncoupled through this chooser; nothing
   in §B licenses any expectation about what a chooser would *do*.

## §COMMANDER CORRECTIONS OF RECORD (ruling #291, 2026-08-15 — read BEFORE quoting this doc)

Verify PASS-WITH-FINDINGS (1 HIGH + 2 MED + 1 LOW). The rung ladder, the [0.85, 1.15]
expressible region, the reference-rung replication of the BU ladders, and the chooser-slice
design STAND. Corrections binding on quotation:

1. **(HIGH — DIVERGENCE-1, named of record) THE ORACLE DOES NOT PRICE THE PASSER'S
   ORIENTATION, AT ANY POWER**: the sim's strike and lead both carry `orientationPowerMul`
   (mechanics.ts:366–392: `powerMul = orientation·intended`, `executedMul = orientation·
   executedPassPower(intended)`) while the oracle (prediction.ts:50–66) carries no
   orientation term at all — a PRE-EXISTING divergence of the same order as the whole
   expressible power axis, present at the shipped default power 1. The audit's sentence
   "inside the clamp the two agree exactly" is FALSE as written; the true claim: they agree
   exactly FOR AN ALIGNED PASSER (orientation = 1). CONSEQUENCES, stated: (a) every rung row
   here is what the CHOOSER'S OWN ORACLE sees — the same optimistic instrument the live
   chooser uses, so the census answers its own question honestly and the BU-ladder
   replication is genuine (same oracle both sides); (b) absolute survival levels inherit the
   shipped optimism; the rung CONTRASTS are within-instrument and stand; (c) ⭐ ROUTED TO
   PW-T0b: pricing the passer's OWN body orientation is SELF-knowledge (INFO-DOCTRINE §0:
   self-initiated action is latency-free knowledge) — the orientation-aware oracle enters
   UNDER THE PW FLAG ONLY (production byte-identical); PW-T1's sim exam is where execution
   honesty (orientation × gaussian error) is finally measured. gPhysics is structurally
   blind to this class (it compares the two formulas' shared terms) — a divergence audit
   must DIFF THE TERM LISTS, not evaluate the shared expression.
2. **(MED) POWER-DEPENDENT DENOMINATORS, undisclosed**: the corridor-survival face is
   conditioned on L3 race-winners (+4.2 % from reference to ceiling) and every
   `...OnSurvivingOptions` face on the surviving set (+20 %) — "paired within scene" is
   proven only at L1. ⭐ THE DENOMINATOR-STABLE FACE IS THE ONE OF RECORD GOING FORWARD:
   outfield backward END-TO-END conversion (L4/L1, L1 power-independent) 21.09 % → 25.04 %
   (+3.94 pp, 19.8×) — same story, clean pairing. Quote survival and conditional faces WITH
   the moving-denominator caveat.
3. **(MED — ⭐ THE SEVENTH CITATION STRIKE, and the COMMANDER OWNS IT AGAIN)**: §SOURCES
   attributes the "numbers of record taken forward" (24.56 % · 21.08 % · 56.90 % · 53.89 % ·
   82.08 %) to **BU-T1**; they are **BU-T0's** GK-split numbers, ruled of record by #287.4
   — and the wrong attribution ORIGINATED IN THE COMMANDER'S DISPATCH PROMPT; the executor
   propagated it and compounded it (BU-T1's own v7 column differs slightly, and the doc
   quotes the more favourable keeper baseline). No conclusion changes (the replication
   matched within noise). ⭐ NEW DISCIPLINE: dispatch briefs cite (doc, section) pairs;
   an executor's FIRST citation-hunt act is verifying the BRIEF's own attributions.
4. **(LOW) The live-caller receipt is scoped to PlayerBrain**: a fourth live `performPass`
   site exists — Match.ts:2900, the pendingPass/wind-up resolution path — and it also
   passes no power (dormancy stands). ⭐ PW-T0b DESIGN NOTE of record: a chosen weight must
   RIDE THE PENDING PASS through the wind-up resolution, or the chooser silently loses its
   choice on every wound-up ball.
5. **(ACCEPTED, disclosed by the draft)**: the first freeze's live-caller receipt was false
   (a regex matched any ≥2-argument call); caught by the executor reading its own output,
   RE-FROZEN at `baf6263` BEFORE the battery (freeze discipline preserved), with the power
   slot pinned to the wrapper's own signature as a gate conjunct.
