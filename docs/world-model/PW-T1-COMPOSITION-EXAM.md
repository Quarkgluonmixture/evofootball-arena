# PW-T1 — THE COMPOSITION EXAM (球能选大小之后,回传的球路活了吗?)

> Dispatched by **ruling #294 item 5**, instrument-only (**ZERO src edits** — the seam is banked
> and pinned by PW-T0b/PW-T0c). Contract: [`PW-PASSWEIGHT-CONTRACT.md`](PW-PASSWEIGHT-CONTRACT.md)
> §1 — **H-PW.1 is SCORED HERE**; every H-PW.2 face is **REPORTED and never gated**.

| | |
| --- | --- |
| probe freeze | `73693bb` — `scripts/probes/pw-t1-composition-exam.ts`, sha256 `aebc58ec…`, **byte-unchanged between freeze and result** |
| artifact | [`data/pw-t1-composition-exam.json`](data/pw-t1-composition-exam.json) · `resultSha256` `87734956…` |
| gates | **22 / 22 PASS · 128 / 128 mutants LIVE** (coverage map machine-derived from the gate objects; 128 conjuncts, an uncovered one exits 3) |
| src | ⭐ **ZERO src edits** — `git diff --stat HEAD -- src` empty AND `git status --porcelain -- src` empty (the #286.1-corrected `xSrcUntouched`) |
| arms | `v7` (base) vs `v7pw` (**one flag**: `pwWeightChooser`; no gene, no dose, ⭐ **no `pwPowerLadder`** — the DEFAULT ladder, #294 item 3) |
| battery | N = **200** paired seeds × 2 arms × 2 G-DET runs (bit-identical); paired cluster bootstrap, **2,000** resamples, ONE shared index matrix |
| populations | 55,785 receptions · 29,338 real strikes · 14,097 open-play spells · 880,260 oracle calls |
| seeds | booked `12,495,000–999`; **walked**: doors `500–502`, battery `100–299`, preflight `020–027`, identity `900`. **BOOKED = WALKED.** ⭐ the `12,494,000` block was NOT touched (RETIRED AS TAINTED, #294 item 4) |
| stats | base **112,800** exactly (the ruled floor); 2,000 resamples |

---

## §SOURCES — the brief's own attributions, verified as the FIRST act (#291.5 / #292.1)

The citation hunt stands at **seven strikes** and covers dispatch prompts, so the brief was
checked before a line was written.

| cite in the brief | verified |
| --- | --- |
| "#294.5 is your spec" | ✅ **ruling #294 item 5** — the PW-T1 dispatch, verbatim. (There is no separately numbered "#294.5"; the arc's rulings number their items, and item 5 is the spec. Noted, not a strike.) |
| "the exam runs the DEFAULT ladder (#294.3)" | ✅ #294 item 3 + PW-T0c §COMMANDER CORRECTIONS 2, verbatim: "do NOT set pwPowerLadder … the exam runs the default ladder". |
| "the closure equation, binding (#294.3)" | ✅ #294 item 3 + PW-T0c §CORRECTIONS 5: "any non-zero silent-loss residue is a stage-stopping finding". |
| "12,494,000 RETIRED AS TAINTED (#294.3/#294.4)" | ✅ item 4 retires the block; item 3 records the verifier's walks in it. Both hold. |
| "the FORWARD-SHIFTED usage mix is PREDICTED (#291.3)" | ✅ #291 item 3, verbatim. |
| "the chosen region may be THIN (#292.4)" | ✅ #292 item 4 clause (d), verbatim. |
| "execution honesty routed here (#291.1)" | ✅ #291 item 1 + PW-C0 §CORRECTIONS 1: "PW-T1's sim exam is where execution honesty … is finally measured". |
| "the DENOMINATOR-STABLE face (PW-C0 §CORRECTIONS 2)" | ✅ outfield backward END-TO-END conversion, L4/L1. |
| "terminals are L3-veto entangled (BU-C0 §CORRECTIONS 3)" | ✅ verbatim. |
| "xSrcUntouched corrected form (BU-C0 §CORRECTIONS 5, #286.1)" | ✅ the canon is BU-C0 correction 5; ruling #286 item 1 names the same defect. Both hold. |

**No loose cite found in this brief; the hunt stays at seven.**

---

## §0 THE QUESTION, in football

⭐ **他现在能选球的力度了 —— 回传的球路,活了吗?**

PW-C0 priced the axis through the oracle: a firmer ball buys **+3.94 pp** of outfield backward
end-to-end conversion at the ceiling rung, the biggest single-lever movement the programme had
seen **on the oracle's own ledger**. PW-T0a found the shipped price wants the *softest* legal
ball on published survivors (correct football: 无压力回敲用小力), so the firm ball's value must
live in **admission**. PW-T0b built the rung-grain chooser; PW-T0c re-based it on the world's own
objective and proved by DIGEST that at ladder `{1}` the armed world is byte-identical to the
door-shut world.

Everything up to here is an oracle's opinion about counterfactual balls. **This stage asks the
sim about the balls that were actually struck.**

---

## §1 ORDER OF PROOF, STEP 1 — THE LIFECYCLE / DOORS PROOF AT CB+L3+PW

M-BU.2's composition law: an armed world beside the CB/L3 stack proves the lifecycle **at its own
composition** before it measures one football face. #287.3 discharged CB+L3+DV, #289 CB+L3+MT;
**CB+L3+PW is new** — and it brings a SECOND slot of the same idiom (`Match.pwStrikePower`, the
`forcedTouchPast` form), so both are read at the same step boundary.

**THE MATRIX**: the FULL power set of this composition's six doors — `C` cbCommitPhysics · `T`
cbTouchPast · `S` cbChoiceSeat (+ the declared proneness) · `L` l3DefenceLearn (+ the matured
dose) · `V` l3DefenceVeto · ⭐ `W` pwWeightChooser — **2⁶ = 64 cells × 3 seeds = 192 walks** on the
`a4MatchFlags(3)` substrate (CALLED, not copied).

### THE VERDICT — a trichotomy, all three limbs clean

| limb | reading |
| --- | --- |
| (a) where an aim CAN fire (`T`), **96 cell-walks** | carry-overs **0** · across an owner change **0** · across a phase change **0** · live at the whistle **0** · at construction **0** · longest arming life **0 ticks** — on **304 armings / 304 knocks fired** (non-vacuous) |
| (b) ⭐ the **S∧¬T EXHIBIT**, **45 cell-walks holding an unconsumed arming** | 47,934 carry-over ticks, longest life 3,028 ticks, one arming live at a whistle — and **0 knocks fired**. **REPRODUCED AND INERT, exactly as expected**; it is a configuration no armed world constructs |
| (c) ⭐⭐ the **PW deposit slot**, every cell | **0** deposits alive at a step boundary — in the 192 doors walks **and** across the battery's **6,051,225 ticks**. A chosen weight is deposited and consumed inside one tick, or swept |

**THE PW DOOR'S OWN INERTNESS LAW** (its analogue of a partnerless door — the seam has no gene to
withhold): with `W` shut the seam is *structurally silent*. Checked on **96 door-shut walks**:
every one of the 19 chooser-ledger counters **0**, `chosenByRung` `[0,0,0]`, the deposit slot null
at every boundary and at the whistle. **0 failures.**

**THE PARTNERLESS-DOOR LAWS** (48 checks each, 0 failures): `cbTouchPast` inert without the choice
seat · `l3DefenceLearn` inert without the veto · `l3DefenceVeto` inert without the book.

**LIVENESS** (a door that cannot move the world is a dead door): commit-physics **96/96** · the
choice seat **45** · the L3 veto **45** · ⭐⭐ **the PW door 96/96 — and 3/3 on the full CB+L3
stack**, i.e. the exam's own composition.

**THE STRUCTURAL HALF**, machine-read from `src/**`: 1 arming write site
(`PlayerBrain.ts:1379`) · 1 withdrawal (`:1380`) · 2 slot clears · 1 firing fork
(`Match.ts:3133`) · ⭐ **1 PW deposit writer** (`PlayerBrain.ts:1317`) · **1 chooser call site** ·
**1 consumption** (`Match.ts:2471`) · **1 sweep** (`:2129`) · **6 void-accounting sites** · the
chooser calls the SHIPPED pricer **once** and restates no price. Non-vacuity: `o1PassWindup` and
`c7Windup` (the two early returns above the seat's block) **are** armed in the v7 substrate, so
the exposure is real — a zero measured in a world with no exposure would be a zero of absence.

⭐ **PTP × PW** (PW-T0c clause (d)) exercised as a receipt: both doors armed ⇒ the constructor
**throws**, the message names ruling `#293.3` (311 chars), and **either door alone still builds**.

**SCOPE, stated**: `o2Look`, `ekHoldVeto`, PTP, DV and MT are NOT armed here, so this discharge is
for **CB+L3+PW only**.

---

## §2 THE PRE-REGISTERED READS (written into the frozen probe BEFORE the battery ran)

1. **(a) is a DISTRIBUTION SHAPE, never a taste threshold** (the PW-T0a idiom): the rung
   distribution of **REAL STRIKES** in the armed arm is NON-DEGENERATE iff every rung takes a
   non-zero share and no single rung takes ≥ **95 %**. The shares themselves are the finding.
2. **(b)**: the BACKWARD outfield corridor-survival face rises with its paired 95 % CI strictly
   above 0, **or** the LATERAL limb does, and neither falls resolvedly; the **denominator-stable**
   face (L4/L1) is quoted alongside and a contradiction is reported as CONTESTED.
3. ⭐ **STANDING (#291.3)**: a FORWARD-SHIFTED usage mix is the **PREDICTED** outcome of arming
   this axis — its appearance is **NOT** a failure.
4. ⭐ **STANDING (#292.4 (d))**: the chosen region may be **THIN**.
5. **No gate reads any of it.** The gates prove the instrument; the score is a reading.

---

## §3 ⭐⭐ H-PW.1 — SCORED: **NEGATIVE** ((a) PASSES loudly, (b) FAILS)

### (a) IS THE WEIGHT ACTUALLY CHOSEN, AT STRIKE GRAIN? — **YES, NON-DEGENERATE**

The population is **real struck balls** in the armed arm (14,584 of them, **0 off-ladder**), read
by a camera on the engine's own `performPass`, not an oracle preference.

| population | 0.85 (floor) | 1.00 (reference) | 1.15 (ceiling) |
| --- | --- | --- | --- |
| ⭐ **ALL real strikes** (14,584) | 3,469 = **23.79 %** | 6,390 = **43.81 %** | 4,725 = **32.40 %** |
| ⭐⭐ **PW-CHOSEN strikes only** (11,314) | 3,469 = **30.66 %** | 3,120 = **27.58 %** | 4,725 = **41.76 %** |

**VERDICT (a): NON-DEGENERATE** on the pre-registered rule (max rung share 43.81 %, far under the
95 % clause; no rung empty). The conservative reading — all strikes, including the 3,270 the
chooser never touched (restart takers and every path outside its scope, all at 1.00) — passes,
and on the chosen population alone the axis is *more* spread, with the CEILING the modal rung.
⭐ **77.58 %** of all strikes in the armed arm carried a chooser decision.

### (b) DID BACKWARD / LATERAL CORRIDOR SURVIVAL RISE? — **NO. Every face is FLAT.**

Measured on the BU-C0 census instrument, definitions verbatim, GK-SPLIT rungs, paired.

| face (outfield unless stated) | v7 | v7+PW | Δ | 95 % CI | \|Δ\|÷hw |
| --- | --- | --- | --- | --- | --- |
| ⭐⭐ **backward corridor survival** (L4/L3) — THE SCORED FACE | 0.2568 | 0.2544 | **−0.0024** | [−0.0094, +0.0049] | **0.34** |
| ⭐ **lateral corridor survival** (L4/L3) | 0.2714 | 0.2724 | +0.0010 | [−0.0091, +0.0109] | 0.10 |
| ⭐⭐ **backward END-TO-END** (L4/L1) — **the DENOMINATOR-STABLE face of record** | 0.2216 | 0.2195 | **−0.0021** | [−0.0086, +0.0047] | **0.31** |
| lateral END-TO-END (L4/L1) | 0.2500 | 0.2517 | +0.0017 | [−0.0075, +0.0107] | 0.19 |
| GK corridor survival | 0.5771 | 0.5772 | +0.0001 | [−0.0106, +0.0108] | 0.00 |
| forward corridor survival | 0.1435 | 0.1461 | +0.0025 | [−0.0033, +0.0083] | 0.44 |

**VERDICT (b): NEGATIVE** — nothing rises resolvedly and nothing falls resolvedly; the corridor is
**unmoved**, and the denominator-stable face agrees with the scored one (no CONTESTED reading).
⚠ **MOVING DENOMINATOR, disclosed** (PW-C0 §CORRECTIONS 2): the survival faces are conditioned on
the L3 race-winner set, itself power-dependent in the oracle; the end-to-end faces (L1 is
power-independent) are the clean pairing and say the same thing.

### ⭐⭐ **H-PW.1 = NEGATIVE.** 能选,是真的能选;回传的球路,没活。

---

## §4 THE MECHANISM — why (a) can pass loudly and (b) still fail

**The census asks a different question from the chooser.** BU-C0's ladder prices every mate at the
SHIPPED default power (the oracle's own `evaluatePassAffordance`, no `powerMultiplier`): it is a
census of **what the world affords at 1.00**, taken at every reception. PW-C0's +3.94 pp was that
same census **re-priced at a fixed ceiling rung for every option at once** — a counterfactual
world in which every ball is firm.

The walked world is not that world. Here **one** ball per decision is struck firmer, chosen by an
argmax that also has softer and default rungs available; the *supply* of live corridors at the
next reception is a property of where the bodies are, and the bodies did not move:

| the world's own supply | v7 | v7+PW | Δ | \|Δ\|÷hw |
| --- | --- | --- | --- | --- |
| behind-ball options / reception | 0.8015 | 0.8038 | +0.0023 | 0.16 |
| zero-option share | 0.4260 | 0.4237 | −0.0022 | 0.25 |
| L1 outfield bodies / reception | 1.6995 | 1.7264 | +0.0270 | 0.97 |
| L4 outfield options / reception | 0.3766 | 0.3790 | +0.0024 | 0.23 |
| mean team-mate longitudinal offset (m) | −5.63 | −5.74 | −0.110 | 0.48 |

⭐⭐ **THE STRUCTURAL FACT, fourth independent confirmation**: outfield end-to-end conversion sits
at **0.2216 → 0.2195** — the same ~21–22 % it has held under DV's price rungs (#288.3), under MT
(#289) and in BU-C0 itself. **THE CORRIDOR'S LETHALITY IS A PROPERTY OF THE PITCH.** The weight
door opens the physics of *one ball*; it does not open the lane.

---

## §5 THE OBSERVATION LEDGER — the emergence receipt (#293.2's routing)

Of the armed arm's **11,314 PW-chosen strikes**, the camera re-ran the chooser at the decision
moment and **LINKED 11,287 (99.76 %)** by exact (mate, power) agreement; the 27 unlinked are
published, not dropped.

### (i) ⭐ WHAT THE WEIGHT BOUGHT — the census-grain admission

| | count | of 11,287 linked |
| --- | --- | --- |
| chosen pair live on the CENSUS ladder (race ∧ corridor) | 2,620 | **23.21 %** |
| ⭐⭐ chosen pair live **ONLY at its own rung** | **557** | **4.94 %** |
| …of which at the **ceiling** rung | **556** | 99.8 % of them |
| …at the floor rung | 1 | — |
| chosen mate also live at the reference rung | 2,268 | 20.09 % |

⭐ **THE REGION IS THIN, exactly as #292.4 (d) pre-registered**: on ~1 chosen ball in 20 the
corridor the man played into was **dead at 1.00 and alive at 1.15**. That is the admission the
weight bought, and it is essentially a one-directional phenomenon — the firm ball buys corridors,
the soft ball buys none (1 case in 11,287).

### (ii) THE CROSS-TABS — rung × direction × pressure (armed arm, real strikes)

| rung | forward | backward | lateral | **pressed** | **unpressed** |
| --- | --- | --- | --- | --- | --- |
| 0.85 | 1,806 | 1,042 | 621 | 3,201 (**92.3 %** of its rung) | 268 |
| 1.00 | 3,954 | 1,650 | 786 | 4,193 (65.6 %) | 2,197 |
| 1.15 | 2,946 | 963 | 816 | 4,257 (**90.1 %**) | 468 |

### (iii) ⭐⭐ THE SHAPE QUESTION — does 小力到脚 + 大力穿缝 appear? **HALF OF IT.**

* **大力穿缝 — YES, resolvedly.** The ceiling rung takes **36.54 %** [0.3559, 0.3752] of strikes
  made under pressure and only **15.96 %** [0.1438, 0.1752] of unpressed ones — **2.29×**, with
  non-overlapping intervals. A pressed passer reaches for the firm ball.
* **小力到脚 — NO, not as written.** The doctrine's soft ball is "to a free man's feet"; the floor
  rung is played **92.3 % under pressure** (268 unpressed strikes out of 3,469). Among *unpressed*
  backward strikes the floor takes 25.61 % [0.1667, 0.3467] — real but a minority.
* ⭐ **THE SHAPE THAT ACTUALLY EMERGED: 有压力才改力度.** With no opponent within
  4.2 m the passer keeps the default on **74.9 %** of strikes (2,197 / 2,933). Under pressure the
  default drops to 36.0 % and the two extremes take the rest (ceiling 36.5 %, floor 27.5 %).
  ⭐ Pressure is what makes him touch the dial at all; the direction he then turns it splits.
* **BY LANE**: the ceiling takes **33.84 %** of FORWARD strikes vs **26.35 %** of BACKWARD ones,
  and the floor takes 28.51 % of backward. The firm ball goes forward; backward stays nearer the
  default and softer. 大力穿缝 is happening **up the pitch**, not on the circulation ball.

### (iv) THE MATE-SWITCH RATE — the axis moves the MAN too

**1,370 / 11,375 chooser decisions = 12.04 %** moved the man off the base arm's own chooser pick.
Attributable to a **rung** and to nothing else: PW-T0c proved objective fidelity (the same shipped
price, the same candidate set, the same tie-break). ⭐ A PLUMBING-GRADE RECEIPT, never an effect
size (#289) — 12 % of decisions changed target, and the census faces still did not move.

---

## §6 EXECUTION HONESTY (#291.1's routed exam) — the oracle's optimism, finally measured

The camera re-derives every strike's launch speed from the engine's own functions and a **clone**
of its rng at the pre-strike state (no draw consumed). Agreement: **max relative error 1 × 10⁻¹⁵**
across all 29,338 strikes (dimensionless, not metres — #294.1). The trace is a trace, not a
parallel oracle.

| at the chosen rung | 0.85 | 1.00 | 1.15 |
| --- | --- | --- | --- |
| strikes | 3,469 | 6,390 | 4,725 |
| mean INTENDED power | 0.850 | 1.000 | 1.150 |
| ⭐ mean **EXECUTED** power | **0.8497** | 1.0000 | **1.1494** |
| mean observed launch speed (m/s) | 12.61 | 15.67 | 17.73 |
| ⭐ **completion rate** | **64.37 %** | **75.04 %** | **67.30 %** |
| lost to an opponent | 32.34 % | 21.42 % | 27.85 % |
| ⭐ ball dead before anyone controlled it | 3.11 % | 3.49 % | **4.74 %** |
| mean **D∞ past the receiver** (m) | 9.77 | 14.64 | 18.30 |
| untouched roll-out endpoint outside the pitch | 29.17 % | 40.72 % | **53.29 %** |

⭐⭐ **THE REALISED-VS-PRICED GAP, honestly**: the execution noise is **mean-preserving** — the
gaussian gives back 0.8497 for an intended 0.85 and 1.1494 for 1.15, so the oracle's optimism does
**not** show up as a systematic power shortfall. It shows up in **outcomes**: the balls the chooser
sends off the default rung complete **7–11 pp WORSE** than the balls left at 1.00, and the ceiling
ball dies out of play **1.25 pp** more often. The oracle admitted them and priced them well; the
sim did not repay it. ⚠ **A CONTAMINATED COMPARISON, stated**: the 1.00 cell also contains the
3,270 strikes the chooser never touched (restart takers etc.), which are systematically easier —
so the cross-rung completion gap is an upper bound on the chooser's own penalty, not a clean one.
The clean statement is the aggregate: **Q06 completion is FLAT (0.6672 → 0.6663, 0.10× half-width)**
— the axis **reallocates** difficulty across rungs, it does not create completions.

⭐ **PW-C0 §D's overshoot face, now on REAL strikes**: the "sails away" geometry is loud (53 % of
ceiling strikes would roll out untouched, D∞ 18.3 m past the receiver) but the realised out rate is
**4.74 %**. PW-C0's own caution — "geometry on an untouched ball … it prices the consequence of
failing the touch" — is vindicated by measurement.

---

## §7 THE REPORTED FACES (H-PW.2 — never gated, every one commensurable)

⚠ **TERMINALS ARE L3-VETO ENTANGLED AT THE LEVEL** (BU-C0 §CORRECTIONS 3); both arms carry the
veto, so the **contrasts** are entanglement-free and the **levels** are not.

| face | v7 | v7+PW | Δ | 95 % CI | \|Δ\|÷hw |
| --- | --- | --- | --- | --- | --- |
| behind-ball options / reception (GK-split L4) | 0.8015 | 0.8038 | +0.0023 | [−0.0123, +0.0168] | 0.16 |
| …per PRESSED reception | 0.8723 | 0.8744 | +0.0021 | [−0.0155, +0.0203] | 0.12 |
| …per pressed-carrier moment | 0.7093 | 0.7114 | +0.0020 | [−0.0181, +0.0213] | 0.10 |
| zero-option share | 0.4260 | 0.4237 | −0.0022 | [−0.0110, +0.0068] | 0.25 |
| 2+ options share | 0.1907 | 0.1904 | −0.0003 | [−0.0073, +0.0064] | 0.04 |
| keeper share of surviving options | 0.5302 | 0.5285 | −0.0017 | [−0.0102, +0.0071] | 0.19 |
| **Q07** forward share of ATTEMPTS | 0.5749 | 0.5687 | −0.0062 | [−0.0161, +0.0041] | 0.61 |
| backward share of attempts | 0.2895 | 0.2896 | +0.0001 | [−0.0085, +0.0082] | 0.01 |
| lateral share of attempts | 0.1356 | 0.1417 | +0.0061 | [−0.0018, +0.0138] | 0.78 |
| forward share of COMPLETIONS | 0.5689 | 0.5699 | +0.0010 | [−0.0103, +0.0132] | 0.08 |
| backward share of completions | 0.3015 | 0.2950 | −0.0065 | [−0.0161, +0.0032] | 0.68 |
| lateral share of completions | 0.1295 | 0.1351 | +0.0056 | [−0.0044, +0.0155] | 0.56 |
| ⭐ circulation (back+lat) completions | 0.4311 | 0.4301 | −0.0010 | [−0.0131, +0.0105] | 0.08 |
| **Q06** completion rate | 0.6672 | 0.6663 | −0.0009 | [−0.0098, +0.0081] | 0.10 |
| terminals — intercepted | 0.4967 | 0.5023 | +0.0056 | [−0.0107, +0.0217] | 0.35 |
| terminals — tackled | 0.0446 | 0.0458 | +0.0012 | [−0.0052, +0.0079] | 0.18 |
| terminals — goal | 0.0373 | 0.0352 | −0.0022 | [−0.0086, +0.0042] | 0.34 |
| ⭐ total loss to an opponent | 0.6745 | 0.6870 | +0.0125 | [−0.0024, +0.0282] | 0.82 |
| **R-乙 Q01** spell mean (sim-s) | 4.1356 | 4.1794 | +0.0437 | [−0.1115, +0.1946] | 0.29 |
| **Q05** touches / spell | 2.5950 | 2.6023 | +0.0073 | [−0.0508, +0.0687] | 0.12 |
| ⭐ **Q14-shaped** pressed-reception share | 0.6527 | 0.6664 | **+0.0137** | [+0.0051, +0.0226] | **1.57 ⚠ MARGINAL** |
| goals / match | 2.5600 | 2.4150 | −0.1450 | [−0.4600, +0.1700] | 0.46 |
| pass attempts / match | 94.31 | 93.27 | −1.04 | [−3.15, +0.91] | 0.51 |
| receptions / match | 140.14 | 138.79 | −1.36 | [−3.85, +0.95] | 0.57 |

**THREE FACES CROSS THE LINE, all MARGINAL and all reported as such** (inside 2× of their own
half-width, never rounded up): pressed-reception share **+1.37 pp (1.57×)**; L2 outfield bodies
**+0.0266 (1.00×)**; L3 outfield **+0.0235 (1.00×)**. The two ladder rows sit exactly *on* their
half-width — the weakest possible resolution — and the rung they would have to reach (L4, the
corridor) does not move at all (0.23×).

⭐ **THE PRE-REGISTERED FORWARD SHIFT (#291.3) DID NOT APPEAR**: forward share of attempts moved
**−0.62 pp (0.61×, UNRESOLVED)**. The prediction was on the record as *not a failure if it
appeared*; it simply did not. Honest reading: the usage mix is unmoved in every direction — this
world neither circulates more nor attacks more.

---

## §8 ⭐⭐ THE CLOSURE EQUATION (#294 item 3 — stage-stopping if it fails)

`depositsNonDefault = struckAtChosenPower + windupChoiceVoided + depositsAbandoned + inFlightAtWhistle`

| arm | deposits | struck | wind-up VOIDED | abandoned | in flight at the whistle | **residue** |
| --- | --- | --- | --- | --- | --- | --- |
| `v7` (door shut) | 0 | 0 | 0 | 0 | 0 | **0** |
| `v7pw` | **8,261** | **8,194** | **65** | 0 | **2** | **0** |

⭐⭐ **THE LEDGER CLOSES EXACTLY, AND NOT TRIVIALLY**: PW-T0c could only close it with all three
fate columns at zero (314 = 314) and one *constructed* cancel. Over 200 matches the natural
population appears — **65 cancelled wind-ups** really did void a chosen weight, and **2** weights
were still in flight at the whistle. **NO SILENT LOSS ANYWHERE** (residue 0 on both arms), and the
engine's own `struckAtChosenPower` agrees with the camera's independent count of non-default
strikes to the unit (**8,194 = 8,194**). The PW-T0b anomaly's whole class is now closed by
measurement rather than by argument.

---

## §HYGIENE — gate by gate (22 / 22, 128 conjuncts, 128 mutants live)

| gate | what it holds |
| --- | --- |
| `gDet` | the whole core re-derives bit-identically across two runs (one digest) |
| ⭐ `xSrcUntouched` | the #286.1-corrected form: worktree-vs-**HEAD** diff empty AND `git status --porcelain -- src` empty |
| `gArms` | every walked match carries its arm LIVE (#283.2(iv)); the two arms are different worlds; the arms walk the same seeds; ⭐ `pwPowerLadder` is null on every walk |
| ⭐ `gDose` | the L3 dose guard hashes **FILE BYTES** (#289 canon) against a declared sha, plus the artifact's own digest |
| ⭐⭐ `gLifecycle` | §1 in 26 conjuncts, including the PW slot's own law on both populations and the seam's silence with the door shut |
| ⭐⭐ `gDoors` | the identity and liveness laws + the PTP×PW constructor refusal |
| `gNonPerturbing` | **50/50** — the instrumented walk IS the quiet walk (world signature, spells, engine passes, chooser decisions). ⭐ THE CAMERA AND THE CHOOSER RE-RUN ARE PROVEN INERT, not asserted |
| `gOracle` | the engine's own evaluator ran, both verdicts occur at both rungs, the GK split sees both sides, the lateral lane is non-empty, the ±2 m band traces to src |
| ⭐⭐ `gStrikeCamera` | both arms struck real balls · the armed arm chose · **the base arm chose nothing and never left the reference rung** · the cross-tabs close on all 400 rows · no strike off the engine's ladder · the wind-up path carried strikes |
| ⭐⭐ `gChoiceLedger` | §8: closure per arm, zero residue, non-vacuous deposits, and the engine-vs-camera strike agreement |
| ⭐ `gLadder` | `pwPowerLadder` never set (measured on four constructed matches) · the ladder is the brain's own canary literal · endpoints are the shipped clamp's · the reference rung is present and is 1 · the chooser still CALLS the shipped pricer |
| ⭐ `gExecution` | the trace agrees with the engine's ball to < 1e-9 relative; the observation ledger linked 99.76 % |
| `gQ07` | 37,516 of 37,518 engine passes attributed (2 unattributed, published); forward and completion counts never exceed the engine's own |
| `gSpells` | every spell lands in exactly one terminal class |
| `gNonVacuity` | no UNDECLARED rate has a zero denominator; every arm-structural zero is on the base arm and declared; every PW face is measured on the armed arm |
| ⭐⭐ `gFaces` | all 89 faces re-derived from the **SERIALIZED artifact off disk** (#287.1) |
| `gClock` | 240 s match clock APPLIED (not nominal); 90 display-minutes read out of `Match.minute()`; 1 sim-s = 22.5 display-s derived, not typed; shares dimensionless |
| `gSeed` | every claimed band inside `12,495,000–999`, disjoint from the consumed ledger (which now includes the RETIRED `12,494,000` block) and from each other |
| `gStats` | base 112,800 exactly; ≥ 200 from every published base; 2,000 resamples |
| `gEnvClean` | whitelist-or-refuse (own vars AND the engine's doors); a preflight may never write a canonical path |
| `gHashEnvelope` | the body re-derives its digest from disk; a cross-out with a different envelope gives the identical digest; `wallMs`/`generatedAt`/`head`/`outPath`/`preflight` are named exclusions (#289.1) |
| `gMutants` | coverage derived from the gate objects; **128 conjuncts, 128 mutants, all live** |

**Freeze discipline**: the probe was committed (`73693bb`) **before a single battery seed was
walked**, and its sha256 is `aebc58ec…` both at freeze and at result.

---

## §DOUBTS (the executor's own, unprompted)

1. ⭐⭐ **(b) MAY BE THE WRONG INSTRUMENT FOR THIS SEAM, and I ran it anyway because the contract
   names it.** The BU-C0 census prices every option at the **shipped default power** — it is a
   census of the world's affordance at 1.00. Arming the weight axis changes *which ball is struck*,
   so it can only move that census through second-order effects (bodies standing elsewhere). A
   reader could fairly say (b) was nearly blind to the seam by construction. Two things keep it
   honest anyway: the contract wrote (b) at *reception grain* before anything was built, and the
   emergence receipt (§5(i)) measures the admission the weight bought **at census definitions**,
   where it is real but thin (4.94 %). ⭐ If the commander wants the counterfactual face instead,
   that is a NEW instrument (re-price the census at each option's own chosen rung) and a new stage.
2. **The reference-rung cell mixes chosen and unchosen strikes.** 3,270 of the 6,390 rung-1
   strikes never passed through the chooser (restart takers, `mustKick`, the cutback path, GK
   paths). Every cross-rung comparison in §6 inherits that contamination; the aggregate Q06 face
   does not, which is why the flat-Q06 statement is the load-bearing one.
3. **The flight-outcome classes are PROBE-SIDE.** "completed / lost / outOfPlay / retained /
   superseded" is my own state machine on ball owner + phase, declared in the artifact. The
   engine's own completion counter is published beside it (25,015 attributed completions, ratio
   1.000) and Q06 uses the ENGINE's counter — but the per-rung completion rates are mine.
4. ⚠ **27 chosen strikes (0.24 %) did not link to a re-run decision.** They are counted and
   published. The most likely cause is a wind-up whose arm-time re-run slot was overwritten by a
   later arm (the engine's single-slot eviction, mirrored); I did not chase it because the
   population is 0.24 % and the ledger's own counters are engine-side.
5. **The chooser re-run calls `perceivedSnapshot` a second time in the same tick.** It is a pure
   read *by construction of the shipped code path* (the brain itself calls it twice already, which
   is how PW-T0c's byte-identity digest holds) and `gNonPerturbing` proves it empirically on 50
   paired walks — but it is still an extra call, and if a future perception seam makes that call
   stateful this instrument becomes a lever.
6. **`mateSwitches` (12.04 %) is a decision-grain counter with no per-decision detail.** I can say
   the axis moved the man on one decision in eight; I cannot say *to which man* or *whether it was
   better football*, because the engine's ledger aggregates.
7. **Three marginal faces could be noise.** Pressed-reception share (1.57×) and the two L2/L3
   ladder rows (1.00× each) are exactly the regime BU-T0b's sizing note warns about at N = 200. I
   have NOT told a story about them; if the commander wants one, it needs its own replication.
8. **A negative on (b) is not a verdict on the door.** The axis is capability, chosen at strike
   grain, with a measurable admission population and a real cost profile. What this stage shows is
   that the *chooser's current appetite* (an argmax over the shipped price) converts that
   capability into no change in the world's option supply. Whether a different appetite — or the
   entry rung PW-T2 owns — would, is unmeasured here.
9. **The 45 S∧¬T cells hold armings for up to 3,028 ticks and one is live at a whistle.** That is
   the exhibit reproducing exactly as #287.3 described, and no knock fires there — but it remains
   a configuration that would be a real bug if any world ever constructed it, and nothing in `src`
   prevents constructing it.

## §COMMANDER CORRECTIONS OF RECORD (ruling #295, 2026-08-16 — read BEFORE quoting this doc)

Verify PASS-WITH-FINDINGS (2 MED + 5 LOW; 12 independent re-derivations, out-of-band scratch
seeds canon-legal). H-PW.1's NEGATIVE, the doors proof, the closure equation (residue 0 with a
NATURAL population: 65 voided + 2 in-flight), and the emergence receipts all STAND. Corrections
binding on quotation:

1. **(MED — THE ESTIMAND RULING the verifier demanded)**: H-PW.1(b) was scored on the BU
   census instrument, which calls the oracle with NO powerMultiplier in both arms — so (b)
   measures THE WORLD'S OPTION SUPPLY AT THE DEFAULT POWER (the contract's own pre-registered
   estimand: did the world get more circulation options), NOT the chosen ball's own survival.
   RULED: the NEGATIVE STANDS AS WRITTEN, because the seam's first-order channel was measured
   BESIDE it and AGREES — the admission region is thin (4.94 % of chosen strikes, ~2.8/match),
   aggregate Q06 is FLAT (the axis reallocates difficulty), and the supply/body faces are
   unmoved. Both estimands say: no build-up movement. The negative is robust; no re-instrument
   is ordered.
2. **(MED) The execution-honesty exam answered the MEAN half of #291.1 only**, and the
   reference rung is NOISE-FREE BY CONSTRUCTION (`executedPassPower(1)` returns 1, no
   gaussian) — the starred cross-rung completion table (64/75/67 %) therefore mixes "weight
   level" with "added spray" ON TOP of the disclosed chosen/unchosen contamination. The
   load-bearing statement is the FLAT aggregate Q06; the per-rung gaps are upper bounds twice
   over. The σ half of #291.1 remains open (a named face for any future PW slice).
3. **(LOW — the unit-name canon recurs, #294 item 1)**: `meanExecutedOverIntendedAtRung{k}`
   holds the mean EXECUTED multiplier (0.8497), not executed÷intended (≈0.9996) — the `unit`
   string is right, THE NAME LIES, and the name is what a reader greps.
4. **(LOW) `pwWindupLiveAtWhistle` counts ANY live wind-up** (door-shut cells read 3), not
   one carrying a chosen weight — the closure equation's `inFlightAtWhistle = 2` is the
   authoritative chosen-weight count.
5. **(LOW) Marginal-face count**: FIVE faces carry the MARGINAL label (the doc says three;
   the report enumerates two crossings) — the omitted two (meanLaunchSpeed 1.71×,
   rollOutLeavesThePitchAtRung1 1.04×) are mechanism/instrument faces (a rising launch speed
   IS the seam), no story lost. Twin attempt denominators (18,862 vs 18,863) reconcile via
   the q07Receipt.
6. **(CITATION ADJUDICATION, no strike)**: the "plumbing receipts never effect sizes" canon
   is legitimately citable to ruling #289 item 1 ("arming receipts, not football findings")
   — the verifier's claim that #289 lacks it is itself overstated; the crisper wording lives
   at #294 item 2. ⭐ The citation FORM of record going forward: "#294 item 5", never
   "#294.5" (rulings number items, not decimal clauses).
