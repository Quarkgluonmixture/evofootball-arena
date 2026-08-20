# IN-T1 — THE LOOK (抬头观察): SCANNING AS A BODY ACT (the dormant src seam)

> **Ordered by** COMMANDER RULING #327 item 5 (the #325 ladder's named next).
> **Bound by** [`IN-SNAPSHOT-CONTRACT.md`](IN-SNAPSHOT-CONTRACT.md) §2 — M-IN.2 (scanning as an
> ACT, at a TIME cost derived from the shipped facing/turn algebra; the o2Look extend-vs-new
> ruling and its conditional debt), M-IN.3 (no new attributes, no new genes) and M-IN.4
> (flags off ⇒ byte-identity per seam; composition proof at the world-9 stack; pin suites
> from birth). **§4 binds too: an ALL-SCANNING world is a FAILURE mode.**
> **The seam it extends**: [`IN-T0-SNAPSHOT-LAW.md`](IN-T0-SNAPSHOT-LAW.md) — §R9 hands this
> stage its measured mandate (**a book that ages to a mean of 29.71 sim-seconds** at the field
> of record, max ≈ a whole match, "because a reader refreshes ONLY WHILE CARRYING").
> **The census of record**: [`IN-C0-PERCEPTION-SURFACE.md`](IN-C0-PERCEPTION-SURFACE.md) §R3
> (the o2Look inventory: the banked look **CANNOT TURN**; `ObserverGaze` sits unwired) — the
> extend-vs-new homework is discharged row by row in §P2(d) below.
> **Road B**: nothing ships. Flag `inLookAct`, default OFF, absent from `a4World`.

---

## §PRE-REGISTRATION (frozen before the battery — freeze commit)

### §P0 What this stage is, and is NOT

It is a **dormant src seam plus its permanent pin suite plus arming RECEIPTS**. Canon:
**receipts ≠ effect sizes** (homes: ruling #289 item 1 + BU-T1 §CORR item 5) — the walks below
publish counts with units and **make no football claim**. H-IN.1 (looks genuinely taken;
information differentiating outcomes) is the EXAM's business. What this stage owes is: the
look exists, it costs real time, situations differentiate, and the 29.71 sim-second hole is
re-measured armed.

### §P1 The scope, as bound at dispatch (#327 item 5)

* **THE LOOK IS A BODY ACT** that refreshes the looker's PRIVATE SNAPSHOT — IN-T0's store,
  not a new memory — for bodies inside the **LOOKED** field.
* **THE COST IS TIME**, derived from the shipped `TURN_RATE`/facing algebra by **anchored
  extraction with a line receipt**. No taste constants (#200).
* **ANY BODY MAY LOOK** (the 接球前观察 story). **THE CONSUMER IS UNCHANGED**: IN-T0's carrier
  gateway, already live (#324 item 4's carrier scoping still governs it).
* **NO new attrs/genes** (M-IN.3); **staleness stays FREE wrongness**; **physics stays truth**;
  **the receiver surface stays untouched**.
* Flag `inLookAct`, default OFF, absent from `a4World`; flags-off byte-identity in the STRONG
  form; the fingerprint of record `57b0bdab…c673` unmoved.

### §P2 ⭐⭐ THE FIVE DESIGN QUESTIONS, ANSWERED BEFORE THE CODE

**(a) WHO LOOKS, AND WHEN — a PRICED election at ONE seat, never a coached pattern.**

The fork is **ONE** `if` at the head of `decidePlayer`, **above** the carrier / keeper /
off-ball dispatch — which is precisely what makes the look available to **ANY BODY** without a
second cadence (no new tick, no new call site; the IN-T0 idiom). No role carve-out: a carve-out
would be taste (#200), so the keeper is in the same law as everyone else and the receipts
publish what he does with it.

The election is **PRICED IN ONE CURRENCY — BODY-TICKS OF STALENESS — at a DERIVED THRESHOLD OF
ZERO** (the DF-T2 "one currency" idiom, #327 item 1). For a candidate aim `a`:

```
gain(a) = Σ over remembered bodies INSIDE field(a) of min(ageTicks, AGE_CAP)
loss(a) = turnTicks(a) × |remembered bodies INSIDE field(heading) and OUTSIDE field(a)|
elect argmax(gain − loss); TAKE IT iff gain > loss
```

* `gain` is the staleness the look **erases**; `loss` is the staleness it **creates**, because
  every body he can see right now and would stop seeing goes on ageing for the whole window.
  Both sides are BODY-TICKS. The threshold is **0** — nothing is chosen.
* **He prices what he BELIEVES, never what is true**: every position in the election comes out
  of **his own book**. The roster is walked for identity only. A body he has never seen cannot
  be aimed at and contributes no staleness — he is not on the map.
* **A look at what you can already see is not a look**: a candidate must lie **OUTSIDE** the
  reader's current field, which is also why the price is never zero (at F2 the smallest
  possible turn is > 90°, i.e. ≥ 15 ticks).
* Determinism: the roster order is the sim's own and the improvement test is STRICT, so the
  first best aim wins every tie. No rng is drawn (I1).

**⚠ THE ALL-SCANNING FAILURE MODE (§4), and why this election is not it.** The `loss` term is
the whole defence: a body who can see six men pays six body-ticks of loss per tick of turn, so
looking away is expensive exactly when there is a lot in front of him — and cheap when he is
alone. The AGE CAP (below) is the second half: without it the benefit would be unbounded while
the cost stayed bounded, and every body would scan for ever. **The receipts are read in BOTH
directions** — the look must be USED (> 0) and DECLINED (< 1), and the three situations must
not agree. `gLookUsedAndDeclined` and `gCostDifferentiatesSituations` are frozen gates on
exactly that, and a red one stays red.

**(b) WHAT A LOOK REFRESHES — the looked field, from the shipped blind algebra, and nothing
else.** IN-T0's field law verbatim, with the CENTRE as the only parameter: a body is inside iff
`(centre · (body.pos − reader.pos)) / |…| ≥ dotMin(field)` or the degenerate guard
`|…| ≤ 1e-9` (felt, not seen). `dotMin` is **IN-T0's own** `inFieldDotMin(match.inSnapshotField)`
— **the look introduces no field of its own and no new knob**; the F2/F4 parameter is shared.
A body inside the looked field is written to the book at TRUTH (cold-started if never seen);
a body outside it is **not read at all**. Position and velocity only, exactly as IN-T0
(#324 item 4); `heading`/`bodyDir` are never staled and never refreshed by this seam.

⭐ **THE PASSIVE HALF, stated as the design decision it is.** Under IN-T0 a body refreshed only
while carrying. A look that could only refresh what a *carrier* refreshes would leave every
off-ball body permanently blind, and the 接球前观察 story impossible. So this seam arms
**M-IN.1's own sentence** — *"refreshed each tick for bodies inside his VISION FIELD"* — for
**every** body at his own decision, free, centred on his **heading**: **sight is free, a LOOK is
a turn.** While a look window is open the passive half is **SUSPENDED** (his eyes are on the
aim), which is what makes the `loss` term real rather than notional.

⚠ **THE CONSEQUENCE, DISCLOSED, NOT HIDDEN**: the armed arm therefore arms **BOTH** halves, and
the staleness buy-back is their joint product. The ledger splits it in BODY-TICKS
(`lookAgeErasedTicks` vs `passiveAgeErasedTicks`) and the receipts publish
`lookAgeErasedShare`, so the headline can never be misattributed to the look alone. A frozen
gate (`gLookBuysARealShare`) requires the look's own share to be real.

⚠ **A body who has never carried and never looked has an EMPTY book, so he cannot elect a
look** (he has no remembered man to aim at). His first passive pass seeds him, and from that
decision on he is a normal looker. Stated as a property of the cold-start rule, which
M-IN.3 forbids this slice from changing.

**(c) ⭐⭐ THE COST ALGEBRA — the BK facing law's own turn, and what the body gives up.**

`turnTicks = ceil(theta / (TURN_RATE · DT))`, where `theta` is the rotation from the body's
heading to the aim. Taken by **ANCHORED EXTRACTION** — canon VERBATIM: *"a src-extracted
constant pins its extraction to the NAMED call site — anchored match + line receipt — never
first-occurrence"* (home: BK-C0 §CORR item 1) — from **ONE named line** which must occur
**exactly once** in its file:

| id | file | the NAMED anchor line, verbatim | enclosing function |
|---|---|---|---|
| `bkTurnTicksForm` | `src/sim/Match.ts` | `  const turnTicks = Math.ceil(theta / (TURN_RATE * DT));` | `bkFacingExtraTicks` |

⭐ **AND IT IS CROSS-CHECKED LIVE, not merely matched as text**: outside the BK cone the shipped
`bkFacingExtraTicks` returns `turnTicks − BK_CONE_TICKS`, so the look's price must equal
`bkFacingExtraTicks(θ) + BK_CONE_TICKS` at every θ tested. The pin suite and the probe both run
that comparison, so **the look's price and the BK facing law's price cannot drift apart**.

⭐ **THE AGE CAP IS THE SAME ALGEBRA**: `IN_LOOK_AGE_CAP_TICKS = ceil(π / (TURN_RATE · DT))` =
**29 ticks** — the FULL REVERSAL, which is BK-T0 §LAW's own phrase for it in `Match.ts`
(*"θ ≤ π ⇒ turnTicks ≤ 29, the full reversal of record"*). A memory older than the time it
takes to turn all the way round is simply OLD. Not a chosen number: it is the cost algebra
evaluated at its own maximum.

**WHAT HE GIVES UP WHILE LOOKING**: he **does not re-decide** for the window, and the passive
half is suspended. That is the whole price. ⚠ **THE INTERACTION WITH THE BK FACING LAW'S TURN
SUBSTRATE, STATED**: the look **does NOT write the heading, the `faceTarget`, the velocity or
the action**. The engine has ONE facing, and the contract's own §7 REALITY audit fixes the
approximation of record — *"no eye/head model (the engine has ONE facing — head-independent
scanning is approximated by the look act's turn cost)"*. So the turn is charged **once, in
time**, and the BK facing law goes on charging the strike turn from the body's **untouched**
heading; the two prices are the same algebra applied to two different acts, never the same
charge levied twice.

⚠ **THE PRICE LANDS ON THE SHIPPED DECIDE CADENCE, stated not hidden**: `decidePlayer` runs
every `AI_INTERVAL`, so a `turnTicks`-tick window costs the body the DECISIONS that fall inside
it. Both are published (`turnTicksPerLook` in ticks and sim-seconds; `lockedDecisionsPerLook`
in decisions), so the two can never be confused.

⚠ Aborts are EXISTING channels only (the C7 I3 form): the phase leaving `playing`, a stun, a
sending-off — and ⭐ **THE BALL ARRIVING**, which ends the look and lets him decide immediately
on the book the look just refreshed. That is the 接球前观察 payoff moment, and it is counted
(`abortedBallArrivedShare`).

**(d) ⭐⭐ EXTEND-vs-NEW, ruled ROW BY ROW — the verdict is NEW, and the o2Look debt therefore
does NOT fall due.**

IN-C0 §R7 item 6 recommended **EXTEND** — *"but the look must TURN"*. That recommendation
predates #327's binding scope (ANY body · a TURN_RATE-derived cost · IN-T0's store as the
memory). Against that scope the banked seam cannot carry the act, and the argument is per row,
not in aggregate:

| row | what the banked o2Look seam IS | what #327 item 5 requires | can it carry it? |
|---|---|---|---|
| **eligibility** | `o2LookEligible`: `match.ball.owner === p` **and** `!mustKick` **and** `p.role !== 'GK'` **and** `topAction !== 'Shoot'/'ClearBall'` — i.e. **CARRIER ONLY**, and gated on `topAction`, which only exists **after** `decideCarrier`'s ladder is sorted | **ANY BODY may look**, including off-ball (the whole 接球前观察 story) and the keeper | ⛔ **NO** — carrier-only by construction, and two of its four parameters do not exist off the ball |
| **the trigger** | `o2LookDecision`: instrument-forced only (`Match.forcedLook`), **born incumbent-equivalent**; and #222's F-O2a STOP proved its intended consumer (the whether-seat) **does not move** | a **PRICED election** in one currency at a derived threshold | ⛔ **NO** — the decision would be replaced wholesale, and the seam's own "born incumbent-equivalent" property is the thing being deleted |
| **the direction** | **NONE.** IN-C0 §R3's decisive fact, verbatim: the look records extra scan MOMENTS and *"opens NO new information channel: `visibleDistance`'s cone is applied unchanged … so what his heading does not cover stays uncovered"* — **the look cannot turn** | a **GAZE DIRECTION** is the entire point: a look that cannot turn buys nothing under a vision field | ⛔ **NO** — the missing half is the half this slice is |
| **the cost** | `O2_LOOK_TICKS = round(C7_W_CAP · 60)` = a **FIXED 11 ticks**, derived from the **WIND-UP** ceiling, spent as a **PLANT** (he stands still — an executor behaviour) | `ceil(θ/(TURN_RATE·DT))`, **direction-dependent**, derived from the **TURN** substrate; and the cost must DIFFERENTIATE | ⛔ **NO** — wrong constant family, and a fixed cost cannot differentiate directions at all |
| **the memory** | scan MOMENTS through `recordObserverScanFrame` — **slice 1's percept memory** | **IN-T0's `inSnapshotStore`** — slice 2's private book | ⛔ **NO** — two different memories; nothing to compose |
| **the window** | ONE global `o2LookWindow` on `Match` | **per-body** windows (several bodies may look at once) | ⛔ **NO** |
| **the pins** | `tests/o2Look.test.ts` pins the seam as banked | — | ⛔ **A PINNED TEST IS A STOP, NEVER AN EDIT** (the house rule stated in `PlayerBrain.ts`'s own DLC-T0s §SEAM comment): changing eligibility, cost or consumer would break banked pins |

**VERDICT: NEW MODULE (`src/ai/inLookAct.ts`); the banked o2Look seam is UNTOUCHED**, byte for
byte, and the pin suite asserts the two seams are mutually byte-clean of each other's needle.
The census's recommendation is honoured in **substance** — *the look TURNS* — while its
proposed **home** is refused on the evidence it itself gathered.

⇒ **THE STANDING o2Look COMPOSITION-DISCHARGE DEBT DOES NOT FALL DUE HERE.** M-IN.2's clause is
conditional (*"if extended, the standing o2Look composition-discharge debt falls due IN THIS
ARC"*), and this slice does not extend it. **The debt STANDS, unpaid and unmoved**, on the
commander's menu (`o2Look/ekHoldVeto discharges`). Reported as a deviation, not smuggled.

⭐ **WHAT *IS* COMPOSED, NOT DUPLICATED**: the book's own writers. `coldStart` and `refresh` are
exported from `inSnapshotView.ts` (a two-word additive edit, zero behaviour change) and the look
writes IN-T0's store through them — so `inLookAct.ts` is that module's **SECOND consumer**. The
precedent is #327 item 3's ratified second reader of the defence book: a pure composition of a
banked account is a strength, and IN-T0 §P5's "ONE consumer" sentence is **historical as of this
stage**, its physics-gate integrity untouched (this module never hands a body to a chooser).

⚠ **`ObserverGaze` / `chooseAttentionGaze` STAY UNWIRED** (IN-C0 §R7 item 6's other half). They
belong to slice 1's percept-memory layer (`PerceptionSnapshot` / `ObservedPlayer`), not to
IN-T0's store, and their only caller remains the `whatIfGaze` debug overlay. Wiring them would
have meant carrying a second memory through the act for no product. Named out, with the reason.

**(e) THE TICK/CADENCE SEAT AND THE PERF BOUND.** The seat is the shipped `AI_INTERVAL` decide
cadence — the fork runs once per body per decision, **no new tick and no new call site**. Per
decision the work is one O(11) passive pass plus, at most, an O(11 × 11) election over
remembered candidates: **≈ 132 field tests per decision** at the structural maximum, against
IN-T0's own 132-record bookkeeping ceiling. Budget, the DF-C0/IN-T0 anchor idiom:
`docs/perf/baseline.json` hashed as BYTES, its own fields quoted, and **the budget is 20 % of
the anchor's own `decide` phase**. ⭐ Unlike IN-T0, the flip oracle runs **OUTSIDE** the step
timer on **both** arms, so the armed-minus-shut wall delta is a clean arm-to-arm comparison of
the engine step itself (still a wall measurement, never a profiler attribution). The window
store's structural ceiling is **12** (one per body on the pitch).

### §P3 ⭐⭐ THE LAW, EXACT (frozen)

```
AT EVERY DECISION, for every body p (flag armed):

  1. LOCK      if a window is open and not aborted → he does NOT re-decide. STOP.
               (abort channels: the ball arrived · phase ≠ playing · stun · sent off)
  2. PASSIVE   refresh p's book for every body inside field(p.heading).      [free]
  3. ELECT     over remembered bodies OUTSIDE field(p.heading):
                 turnTicks = ceil(theta / (TURN_RATE · DT))
                 gain      = Σ_{inside field(aim)}  min(age, 29)
                 loss      = turnTicks × |inside field(heading), outside field(aim)|
               take argmax(gain − loss) iff gain > loss
  4. ACT       refresh p's book for every body inside field(aim);
               open the window at tick + turnTicks; he does NOT re-decide. STOP.
```

`field(u)` is IN-T0's field law about the direction `u`, at IN-T0's own
`inFieldDotMin(match.inSnapshotField)`. Nothing else is read; nothing else is written.

### §P4 ⭐⭐ THE SEAM MAP + THE PREFIX

**Needle PREFIX stated** (canon VERBATIM: *"a seam-map gate pins occurrence COUNTS per needle
and enumerates EVERY occurrence's site"*, home PC-C0 §CORR item 1): the needle family is
**`inLook*` in all three of the engine's casings** — `inLook…`, `InLook…`, `IN_LOOK…`. Its
members are exactly: the flag **`inLookAct`** (which is also the MODULE name), the two
per-match states **`inLookWindows`** / **`inLookLedger`**, the factory **`createInLookLedger`**,
the fork **`inLookGate`**, the pure law **`chooseInLook`** · **`inLookTurnTicks`** ·
**`inLookRefreshField`** · **`inLookSituation`**, the constant **`IN_LOOK_AGE_CAP_TICKS`**, and
the types **`InLookLedger`** · **`InLookWindows`** · **`InLookElection`** ·
**`InLookRefreshReceipt`**.

| file | sites | disposition |
|---|---|---|
| `src/ai/inLookAct.ts` | the module | ⭐ **THE LAW** — new, and the only place any of it lives |
| `src/sim/Match.ts` | `inLookAct?: boolean` (config) · `readonly inLookAct` · `readonly inLookWindows` · `readonly inLookLedger` · the initialiser · the import line | **STATE ONLY** — the engine holds the door and the books; it owns none of the law |
| `src/ai/PlayerBrain.ts` | ONE import + **ONE fork**: `  if (match.inLookAct && inLookGate(p, match)) return;` | ⭐ **THE ONE FORK**, above the carrier dispatch (which is what makes it ANY body's) |
| `src/sim/League.ts` | the `matchFlags` key union, ONCE | the door is nameable by a probe; `League.toJSON` still omits `matchFlags` |
| `src/ai/inSnapshotView.ts` | **no `inLook` needle at all** — two `export` keywords added | the composition: IN-T0's own writers, shared |

**NAMED OUT, each with its reason** (the pin suite asserts the needle is absent from all of
them): `actionExecutor.ts` · `TeamBrain.ts` · `defensiveCoordination.ts` · `mechanics.ts` ·
`Player.ts` · `Team.ts` · `Ball.ts` · `cloneState.ts` · `RenderStateAdapter.ts` ·
`a4World.ts` — **M-IN.1 (physics stays truth)** and **Road B** respectively. And
`src/ai/lookSeat.ts` — **the banked O2 seam, untouched** (§P2(d)).

### §P5 The pin suite (from birth — canon: *pin suites from birth*, home ruling #297 item 7)

`tests/inLookAct.test.ts`, in the house form (`inSnapshotLaw.test.ts` / `dfSurface.test.ts`):
**29 pins** — strong dormancy (absent ≡ explicitly false, byte for byte, BOTH world shapes ×
2 seeds, pooled digest) · the windows and the ledger empty when shut **while IN-T0's store is
demonstrably filling** (a non-vacuous shut arm) · arming is a real change with and without
IN-T0 · **the cost law** (the anchored line, singular; the enclosing function resolved; the
**LIVE cross-check against the shipped `bkFacingExtraTicks`**; the age cap = the full reversal)
· **the look law on a constructed fixture** (a look refreshes EXACTLY the looked field and the
bodies outside it are untouched **to the byte**; the price is EXACTLY the derived turn; the aim
is taken from MEMORY, not truth) · **no-look-no-change** (an empty book, and a picture entirely
in field, elect nothing) · **the zero threshold bites** (the same geometry declines with two
men in front and elects with none) · the age cap is a cap · sent-off bodies neither aimed at
nor priced · cold starts erase no age · **ANY BODY looks** (all three situations, all 12 gids,
on one walk) · **the buy-back is real** (armed mean age < shut mean age, both halves erasing) ·
the ball-arrived abort is a live path · the store and the windows stay bounded · **physics
stays truth** (no heading / `faceTarget` / vel / pos / action / `perform*` / rng / genome /
attrs write, on the CODE half of the file, with a line-classed stripper whose classification is
itself pinned and whose corpus is proven non-vacuous — canon *text-census corpus integrity*,
home IN-C0 §CORR item 2) · the import list pinned exactly · no executor/physics/marking/render
file names the needle · **the O2 seam is mutually byte-clean** · no serialization · **the
16-cell power set** {inLookAct} × {inSnapshotLaw} × {dfAssignPersist} × {dfSurface} on the
world-9 stack · lifecycle clean and distinct · armed-without-its-consumer is legal and stated ·
no refusal · **the seam map** (occurrence COUNTS per needle, PREFIX stated) · ⭐ **the §CORR 3
comment fix present and TRUE** (the clause is there, and `whetherEye.ts:147` really is that
roster walk) · the fingerprint of record.

### §P6 Gates (frozen; a RED gate stays red and is reported)

`gWorldOkEveryWalk` · `gSeedsBookedEqualWalked` · `gArmsPairedPerSeed` · `gAnchorResolvesOnce` ·
`gShutLookLedgerEmpty` · `gInLawFiresBothArms` · `gLookFiresEveryArmedWalk` ·
⭐⭐ `gStalenessBoughtBack` (armed mean age strictly lower **and the intervals do not touch**) ·
⭐⭐ `gLookUsedAndDeclined` (**both directions** of §4's non-degeneracy) ·
⭐⭐ `gCostDifferentiatesSituations` (the three situation shares spread by > 0.05) ·
⭐ `gLookBuysARealShare` (the look's own share of erased staleness > 0.05 — not a passenger) ·
`gEveryBodyLooks` (no three-body corner — the DF-T2 lesson) · `gPaidTimeWithinDerivedBand` ·
`gWindowsAccounted` · `gFlipPopulationNonEmpty` · `gStoreWithinCeiling` ·
⭐⭐ `gDormancyByteIdentical` · `gFingerprintUnmoved`.

### §P7 Seeds and stats (pre-registered — BOOKED = WALKED, the block consumed whole)

* **Block 12,513,000–999**, opened by #327 item 5, **consumed whole**.
* Battery: `12,513,000–039` (40 seeds) **+ the block's `12,513,999` receipt seed** = 41 seeds
  × **2 arms** (`lookShut` · `lookArmed`, both with IN-T0's law armed at **F2**) = **82 walks**.
* Smoke prefix **in band**: `12,513,800/801/802` — the same seeds the permanent pin suite uses.
* **STATS: none expected.** The receipts publish counts; cluster CIs are bootstrap resamples of
  the walked seeds, not a registry-consuming statistic (the IN-T0 / DF-T2 precedent). The next
  stats base stays ≥ **115,200**.

### §P8 PERF — the budget is a BUDGET (the DF-C0 anchor idiom)

`docs/perf/baseline.json` is hashed as **bytes** and its own fields quoted; the budget is
**20 % of the anchor's own `decide` phase**. The election's structural ceiling is 132 field
tests per decision; the window store's is **12** records. ⭐ The oracle runs OUTSIDE the step
timer on both arms, so `armedMinusShutUsPerStep` is a clean arm-to-arm wall delta of the engine
step — published as a wall measurement, never as a profiler attribution and never as a speed-up
if it comes back negative (the #327 item 1 caveat).

### §P9 Declared doubts (before the battery)

1. **The look may be TOO CHEAP at the margin.** The `loss` term and the age cap are what stop
   an all-scanning world, and both were reasoned, not measured, before the code. If the usage
   share comes back near 1 with the three situations agreeing, `gLookUsedAndDeclined` /
   `gCostDifferentiatesSituations` go RED and are reported as the honest shape of the seam —
   not patched (the #320 discipline).
2. **The buy-back is JOINTLY produced.** The armed arm arms the free passive half as well as
   the priced look; `lookAgeErasedShare` is the only thing that separates them, and it is a
   BODY-TICK attribution, not a counterfactual. A clean look-only counterfactual would need a
   third arm and is named as the exam's, not smuggled in here.
3. **The flip oracle's denominator MOVES between arms** (the arms are different worlds), and it
   is read at every carrier tick rather than every decision tick — so the flip share stays a
   LOWER BOUND, exactly as in IN-T0 §P9(2). Comparisons across arms read as interval overlap;
   no paired test is frozen, and none will be invented afterwards.
4. **`oracleStaleShare` may RISE while ages fall.** A fuller book means more bodies are
   *eligible* to be served from memory (IN-T0's cold-start rule serves TRUTH for a body never
   seen), so the share and the age can move in opposite directions. Pre-registered here so it
   is read as mechanism, not as a contradiction.

---

## §RESULTS — THE RECEIPT WALKS

> **Instrument**: `scripts/probes/in-t1-the-look.ts`
> (`instrument.sha256` = `c8f799571c2c45923eca06cc48ab73060b9d05c9483fb53f5d1bf218f8eeba0e`).
> ⛔ **Artifact of record**: `docs/world-model/data/in-t1-the-look.RED.json`
> (`bodySha256` = `5d23c99798b70a59a8cf29e1117ed0728bb084c864eda30e1046599c33efa77e`) —
> **the RED SIDE PATH, because ONE FROZEN GATE IS RED** (`gEveryBodyLooks`; §R6). The probe
> refused the canonical path by construction (#319 §CORR 2's ordered mitigation, working).
> **82 walks** (41 seeds × 2 arms: `lookShut` · `lookArmed`), every `worldOk` true,
> **17 of 18 gates GREEN**, `srcTouched.head` = `f711e6d481115e62bcc62dbaba0aee7746824212`
> (the freeze commit) with `gitStatusSrc` EMPTY.
> ⭐ These are RECEIPTS, not effect sizes — **no football claim is made here**.
> Every number below is quoted VERBATIM from an artifact field (canon: *"a stage doc's prose
> quotes artifact FIELDS verbatim or the number becomes a gated face"*, home PC-T2 §CORR
> item 4). ⭐ **BOTH ARMS CARRY IN-T0's LAW ARMED AT F2** — the arms differ in `inLookAct`
> and nothing else.

### §R1 ⭐⭐ THE BUY-BACK — the 29.71 sim-second hole, re-measured armed

| face | `lookShut` | `lookArmed` | unit (verbatim) |
|---|---:|---:|---|
| `staleAgeMeanTicks` | **1649.32209226** [1508.98545426, 1826.39244522] | **56.8843572535** [51.8315384615, 62.1994775145] | TICKS (sim ticks; 1 tick = DT sim-seconds) |
| `staleAgeMeanSimSeconds` | **27.4887015376** [25.149757571, 30.4398740871] | **0.948072620891** [0.863858974359, 1.03665795857] | sim-seconds (the dual axis; clock honesty) |
| `chooserReadsStaleShare` | 0.423787819168 [0.386919481907, 0.468222940833] | 0.0965747619285 [0.0848250985656, 0.111334114738] | share of the carrier chooser's other-body reads served from the private book |
| `chooserReadsInFieldShare` | 0.564418284365 [0.51999392675, 0.602185340771] | 0.899951804025 [0.884876023346, 0.912059795889] | share refreshed to truth |
| `chooserReadsColdStartShare` | 0.0117938964673 [0.0106202231351, 0.0130616331593] | 0.0034734340463 [0.00293233525875, 0.00428170961177] | share served by the cold-start rule |

`staleAgeMaxTicks` = `{ "lookShut": 15315, "lookArmed": 1128 }` (a MAX face, reported as a max —
canon: *"a max−min face reports a noise-floor comparison, not a zero-null CI"*).

**THE RECEIPT, IN ONE LINE**: the man on the ball was pricing his options against a book that
was, on average, **27.49 sim-seconds old**; with the look armed it is **0.95 sim-seconds old**.
The worst case falls from **15,315 ticks — essentially a whole 240 s match — to 1,128**.
⭐ **|Δ|÷half-width** (canon: *"a starred finding states its |Δ|÷half-width ratio"*, home
BU-T0B §CORR item 2): Δ = 26.5406289167 sim-seconds against a summed half-width of
2.73145775014 = **9.72 half-widths**. `gStalenessBoughtBack` GREEN (the intervals do not touch).

⚠⚠ **THE ESTIMAND IS MATCHED; THE SEED DRAW IS NOT, AND THE DENOMINATOR MOVED.** IN-T0 §R1
published **29.7099041099 sim-seconds** on block 12,511,000–999. This battery's `lookShut` arm
is the **same world, same field, same instrument, a different 41-seed draw**, and it reads
**27.4887015376** — the mandate reproduces, and the baseline of record for THIS stage is the
`lookShut` value, never IN-T0's. Canon *moving denominators*, discharged by publishing both
sides of every face (artifact `buyBack.denominatorMoved`, verbatim): stale reads
**77,543 → 5,811**; other-body reads viewed **182,976 → 60,171**; and
`viewsBuiltPerMatch` **409.829268293 → 133.585365854**, because a carrier who is inside a look
window does not re-decide, so he builds fewer chooser views. **The age face is therefore a mean
over a much smaller and differently-composed population, and it is quoted as such.**

### §R2 ⭐⭐ THE LOOK USAGE — used, declined, and the cost differentiates

| face | value | unit (verbatim) |
|---|---:|---|
| `lookShareOfDecisions` | **0.559702040136** [0.546273048993, 0.573643359102] | share of decisions at which a look was ELECTED and taken |
| `declineShareOfDecisions` | **0.440297959864** [0.426362583018, 0.453779140997] | share of decisions at which the election ran and DECLINED |
| ⭐ `lookShare_carrier` | **0.774553387668** [0.725632244468, 0.818530999746] | share of carrier decisions that elect a look |
| ⭐ `lookShare_offBall` | **0.687301577478** [0.668574207175, 0.705280618437] | share of off-ball decisions that elect a look |
| ⭐ `lookShare_keeper` | **0.105391317954** [0.0864214280177, 0.124574141579] | share of keeper decisions that elect a look |
| `turnTicksPerLook` | 19.8996670798 [19.7210871272, 20.0644013464] | TICKS charged per look (the derived turn time) |
| `turnSimSecondsPerLook` | **0.331661117997** [0.328684785453, 0.334406689106] | sim-seconds charged per look |
| `lockedDecisionsPerLook` | 0.967740910247 [0.928782231749, 1.0074363175] | DECISIONS lost per look |
| `looksPerMatch` | 6139.31707317 [6017.31707317, 6272.14634146] | looks per match (whole squad) |
| `lookTicksPaidPerMatch` | 122170.365854 [119888.829268, 124478.634146] | TICKS of look time charged across the whole squad per match |
| `gainPerLook` | 137.048456172 [133.402807882, 140.959991123] | BODY-TICKS of capped staleness the elected look claimed to erase |
| `lossPerLook` | 27.6344790872 [26.629712255, 28.6373486168] | BODY-TICKS of staleness the elected look accepted to create |
| `abortedBallArrivedShare` | **0.0721697813374** [0.0602303903353, 0.0846365310815] | share of looks ended by THE BALL ARRIVING |
| `bodiesPerLook` | 9.12902841342 [9.0682313556, 9.18589264296] | bodies written into the book per look |
| `bodiesPerPassivePass` | 6.42356773584 [6.33222952102, 6.51354716981] | bodies written into the book per free passive pass |

⭐⭐ **THE NON-DEGENERACY RECEIPT, READ IN BOTH DIRECTIONS** (contract §4). The look is USED —
**56.0 %** of decisions elect one — and it is **DECLINED at 44.0 %**: the price is refused
almost as often as it is paid, and the decline share sits **32.17 half-widths** below 1, so
this is **not an all-scanning world**. `gLookUsedAndDeclined` GREEN.

⭐⭐ **AND THE COST DIFFERENTIATES SITUATIONS, hard**: the keeper looks at **10.5 %** of his
decisions against the carrier's **77.5 %** — Δ **0.669162069714** at a summed half-width of
0.0655257344197 = **10.21 half-widths**, `gCostDifferentiatesSituations` GREEN. The mechanism
is the `loss` term doing exactly what it was designed to do: a keeper faces the play with his
whole team in front of him, so turning away is expensive and there is little behind him worth
buying. **Nobody wrote that rule.**

⚠ **A look costs 0.3317 sim-seconds and about ONE decision.** The two are published separately
on purpose (§P2(c)): the charge is in ticks, the body pays it on the shipped `AI_INTERVAL`
cadence, and `lockedDecisionsPerLook` **0.968** is what the price actually costs him.

### §R3 ⭐⭐ THE ATTRIBUTION — how much of the buy-back the LOOK itself bought

`lookAgeErasedShare` = **0.458299187949** [0.448087454201, 0.468431232228] — *"share of ALL
erased staleness (BODY-TICKS) erased by an elective LOOK"*. **45.8 %** of the erased staleness
was bought by the priced look; the rest by the free passive half. **45.06 half-widths from
zero**, `gLookBuysARealShare` GREEN. ⚠ Pre-registered §P9(2) stands: this is a BODY-TICK
attribution, **not a counterfactual** — a look-only arm was not walked, and a clean separation
is the exam's, not this stage's.

### §R4 THE FLIP AND STALE-SHARE MOVEMENT (IN-T0's instrument, on the REAL book)

| face | `lookShut` | `lookArmed` |
|---|---:|---:|
| `flipShare` | **0.248047283208** [0.221769424159, 0.285268663252] | **0.0264163950865** [0.0218590232581, 0.0314208460055] |
| `anyOutOfFieldShare` | 0.747758081842 [0.703628715389, 0.791584260043] | 0.868744516169 [0.837774683504, 0.899024103762] |
| `oracleStaleShare` | 0.450259558416 [0.419045212084, 0.486075856103] | **0.630365118575** [0.578611682796, 0.678600153327] |
| `oracleStaleAgeMeanTicks` | 1694.52813099 [1581.8381173, 1836.57553557] | 57.617500933 [13.7300373021, 119.273417677] |

⭐ **THE FLIP SHARE FALLS 0.2480 → 0.0264** — Δ 0.221630888122 at a summed half-width of
0.0365305309203 = **6.07 half-widths**. Believing your own book sends the ball to a different
man **one time in four** without the look and **one time in thirty-eight** with it. ⚠ It stays
a **LOWER BOUND** (`instrument.flipOracleLimits`, verbatim): *"the oracle is the
PERCEIVED-CHOICE chooser, not decideCarrier's full ladder; and it is read at EVERY carrier tick
(a superset of his decision ticks), so the flip share is a LOWER BOUND. Its denominator MOVES
between arms because the arms are different worlds — disclosed per face."*

⚠⚠ **`oracleStaleShare` RISES while the ages collapse — PRE-REGISTERED as mechanism, not as a
contradiction (§P9(4)).** A body a reader has NEVER seen is not in his book at all, and IN-T0's
cold-start rule then serves him TRUTH. The look fills the book, so **more** bodies become
*eligible* to be served from memory even as what memory says becomes **28× fresher**
(`oracleStaleAgeMeanTicks` 1694.53 → 57.62). Share and age move in opposite directions, and the
flip share — which is what actually decides anything — follows the AGE.

### §R5 DORMANCY, THE ANCHOR, PERF, AND THE FINGERPRINT

`gDormancyByteIdentical` GREEN over **both world shapes × 2 seeds**: for every cell the
signature with `inLookAct` **ABSENT** and with it **EXPLICITLY FALSE** is the SAME string.
`dormancy.pooledDigest` = **`af606f2500b8285dcbfdce55ff504fde45505cc6ca92f792aeff38fc0ce86fec`**.

`fingerprint.ofRecord` = `fingerprint.recomputed` =
**`sha256=57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`**
(`gFingerprintUnmoved` GREEN — recomputed by the probe's own hands, and independently by
`npx tsx scripts/fingerprint.ts` before the freeze commit).

⭐ **THE ANCHORED EXTRACTION** (`anchoredExtraction`, line receipt REPORTED never asserted): the
named line `  const turnTicks = Math.ceil(theta / (TURN_RATE * DT));` matched **exactly once**,
at **line 226** of `src/sim/Match.ts`, captured `TURN_RATE`, enclosing function
`bkFacingExtraTicks` resolved. `ageCapTicks` = **29**. ⭐ And the **LIVE CROSS-CHECK against the
shipped `bkFacingExtraTicks`** agrees at every tested angle — 100°/17 · 110°/18 · 120°/20 ·
130°/21 · 140°/23 · 150°/25 · 160°/26 · 170°/28 · 180°/29 — so the look's price and the BK
facing law's price are provably the same algebra.

**PERF**: `anchorSha256` `192ed9481524eea3186e4acbf62b77cf0ed8b16741413cd8da8518d66647bd3a` ·
`anchorHead` `c07a19b` · `anchorUsPerStep` **5.32** · `anchorDecideUsPerStep` **0.54** ·
`budgetUsPerStep` **0.108**. Measured: `lookShutWallUsPerStep` **28.3190021581** ·
`lookArmedWallUsPerStep` **28.2021862185** · `armedMinusShutUsPerStep` **−0.11681593966**
µs/step. ⚠ **THE ARMED ARM MEASURED FASTER, AND THAT IS PUBLISHED AS AN INSTRUMENT CAVEAT,
NEVER AS A SPEED-UP** (the #327 item 1 form): the look changes the *work the engine does*
(locked bodies skip whole `decideCarrier` ladders, and a fresher book allocates far fewer
prototype view objects), so the two arms are not the same computation. What is established is
that **no cost outside the 0.108 µs/step budget was detected**. Memory: `storeEntriesAtFullTime`
**131.658536585 → 132** (the book reaches its structural ceiling of 132 armed);
`windowRecordsCeiling` **12**, `gStoreWithinCeiling` GREEN.

`goalsPerMatch` receipts, same run: `lookShut` **2.92682926829**, `lookArmed` **1.80487804878**.
⚠ These are **receipts of the walk, not findings** — the exam owns football, and no between-arm
test was frozen for them.

### §R6 ⛔ THE RED GATE, REPORTED AND NOT PATCHED

`gEveryBodyLooks` is **RED**. It required all **12** bodies to take at least one look on
**every** armed walk. Measured `gidsThatLookedPerMatch` = **11.9756097561** [11.9268292683, 12]:
**40 of 41 walks had all 12**; on seed **12,513,036** it was **11**.

⭐ **THE CAUSE IS PINNED, AND IT IS THE MECHANISM, NOT A DEFECT**: the one body who never
looked is **gid 0, role GK, not sent off** (re-derived live at that seed). The keeper's usage
share is 0.105 — the lowest of the three situations by a factor of seven — precisely because
the `loss` term makes turning away expensive for the one body who faces the whole game. On one
seed in forty-one his election never cleared zero. **The gate that went red is the gate whose
red proves the gate beside it**: `gCostDifferentiatesSituations` is GREEN for the same reason.

**The gate was frozen before the battery and stays as frozen** (#320's discipline honoured to
the letter). The commander owns whether the right conjunct is "every body" or "every OUTFIELD
body"; this session does not touch a frozen predicate after sight, and the artifact stayed on
the RED side path.

`looksPerGidSpread` = **706.780487805** (a MAX−MIN face; no zero-null CI attached) — the body
grain is a spread, not a corner: min 281 and max 704 looks on the red seed itself.

### §R7 ⭐⭐ MUTANTS (run live, restored from `/tmp` BYTE COPIES — never `git checkout`)

| mutant | edit, verbatim | pins killed |
|---|---|---:|
| **M1 THE THRESHOLD** | `    if (gain <= loss) continue;` → `    if (gain < 0) continue;` (every aim elects) | **2** |
| **M2 THE AGE CAP** | `        gain += age > IN_LOOK_AGE_CAP_TICKS ? IN_LOOK_AGE_CAP_TICKS : age;` → `        gain += age;` | **2** |
| **M3 THE COST** | `  return Math.ceil(theta / (TURN_RATE * DT));` → `  return theta > 0 ? 1 : 0;` (a look is one tick) | **6** |
| **M4 THE LOOKED FIELD** | `    if (!(d <= 1e-9 \|\| (ux * dx + uy * dy) / d >= dotMin)) continue;` → `    if (false) continue;` (a look refreshes everyone) | **7** |
| **M5 THE LOCK** | `      return true; // the price, being paid: he does not re-decide` → `      return false;` (the look is free) | **1** |
| **M6 THE CANDIDATE GATE** | `    if (c >= dotMin) continue; // already in field — not a LOOK` → `    if (false) continue;` | **2** |
| **M7 THE EXCLUSIVITY** | `      } else if ((reader.heading.x * qx + reader.heading.y * qy) / ql >= dotMin) {` → `      }` + `      if ((reader.heading.x * qx + reader.heading.y * qy) / ql >= dotMin) {` | **1** |
| **M9 THE LOSS MULTIPLIER** | `        loss += turnTicks;` → `        loss += 1;` (the cost stops scaling with the turn) | **2** |

**23 pin deaths over eight mutants.** `src/ai/inLookAct.ts` was restored by **`/tmp` byte copy**
and `cmp`-verified after every mutant (sha
`f0e09b5101d9c1f5156e14306a668d9dddda3d1e7201a124697f3a5b1bcf5c93`, identical before and after
all eight), `git diff --stat HEAD -- src` **empty** at commit time, and the suite is **31/31
green** on the restored tree.

⭐⭐ **THE UNPINNED-TERM HUNT FOUND TWO — AND THIS IS THE POINT OF RUNNING IT** (the DF-T2
lesson, #327 §CORR 1). On the first sweep **M5 and M7 each killed ZERO pins**:

1. **THE LOCK — the look's entire price — was unpinned.** With `return true` turned into
   `return false` a body inside a live window re-decides every decision: **the look becomes
   free** and the seam's whole cost disappears. Twenty-nine pins stayed green. ⚠ The trap was
   subtle and worth recording: the ledger's `lockedDecisions` counter is bumped **before** the
   return, so a broken lock **still increments the receipt that looks like the pin**. The pin
   had to be the gate's own ANSWER, plus the passive half's suspension.
2. **THE GAIN/LOSS EXCLUSIVITY was unpinned.** Turning `} else if (` into a second `if (`
   charges a body who stays visible as BOTH gain and loss — the man is paid for twice. The two
   fields genuinely overlap for any turn short of a full reversal, so this was a live error
   shape, not a contrivance.

Both are now pinned (`THE LOCK IS THE PRICE` · `GAIN AND LOSS ARE EXCLUSIVE`), each kills
**exactly one** pin — the pin that names it and no other, which is what makes them *specific*
rather than merely present. ⚠ **They landed on COMMIT 2, not commit 1** — the ordering
deviation is §R8 item 1. The seam's own bytes did not move, so the battery above stands
unaffected.

### §R8 DEVIATIONS (honest)

1. ⚠ **THE TWO HUNT-ORDERED PINS LANDED ON COMMIT 2.** The dispatch asked for the unpinned-term
   hunt *before the freeze*; the mutants were run after it, so the two pins the hunt ordered are
   in the receipts commit. Nothing in `src/**` changed between the two commits (`git diff
   --stat HEAD -- src` empty; the module sha is identical before and after every mutant), so
   the frozen instrument, the frozen gates and all 82 walks are unaffected — but the ORDER was
   wrong and is reported rather than smoothed.
2. ⛔ **ONE FROZEN GATE IS RED** (`gEveryBodyLooks`), the artifact of record is therefore the
   **`.RED.json` side path**, and the cause is a keeper on one seed in forty-one (§R6). Not
   patched, not re-run to green.
3. ⭐ **THE o2Look COMPOSITION-DISCHARGE DEBT DOES NOT FALL DUE AND IS NOT PAID.** §P2(d) rules
   the seam NEW on a row-by-row argument, and M-IN.2's clause is conditional on extending. The
   debt **STANDS**, unmoved, on the commander's menu.
4. ⚠ **THE ARMED ARM ARMS BOTH HALVES.** The free passive refresh for every body is a genuine
   widening of IN-T0's carrier-only refresh — M-IN.1's own sentence, applied where the contract
   always wrote it, but **not** something #327 item 5 named in so many words. It is
   pre-registered in §P2(b) with its reason (without it an off-ball look is impossible and the
   接球前观察 story cannot exist), and the buy-back is split by the ledger, but the commander
   should read it as a scope call, not as a detail.
5. ⚠ **`viewsBuiltPerMatch` FALLS BY TWO THIRDS ARMED** (409.83 → 133.59) because a locked
   carrier does not re-decide. Every share and mean in §R1 therefore has a materially different
   denominator between arms; both numerators and denominators are published so any face can be
   re-derived either way.
6. **The armed arm measured FASTER** (−0.117 µs/step). Published as an instrument caveat, never
   as a speed-up (§R5).
7. ⭐ **`inSnapshotView.ts` GAINED A SECOND CONSUMER**, by exporting `coldStart` and `refresh`
   (two `export` keywords, zero behaviour change). IN-T0 §P5's "the module has exactly ONE
   consumer" sentence is **historical as of this stage**; its physics-gate pins are untouched
   and all 26 IN-T0 pins are green.
8. ⚠ **THE COMMENT RIDER IS THE ONLY EDIT TO IN-T0's SEAM COMMENT**, and it is prose: the clause
   naming `whetherEye.ts:147`'s identity-only re-entry. Byte-identity in this stage is
   therefore **flag-OFF vs flag-ABSENT signature identity on this tree** (proven, §R5), and the
   fingerprint law is proven separately and independently — comments cannot move it, and it
   did not move.
9. **`ObserverGaze` / `chooseAttentionGaze` remain UNWIRED**, with the reason in §P2(d). The
   `attentionPolicy.ts:8` stale-comment note (IN-C0 §CORR item 4) is **not** discharged here —
   it is not on PROGRAMME's standing-debt list and this slice never calls that function.
10. ⚠ **BOTH COMMITS LAND ON `main`**, as every prior stage commit in this programme does.
    Nothing was pushed.
11. **`PROGRAMME.md`, the rulings file and every other stage doc are NOT edited by this
    session** (executor iron rule). The queue's status line, the frontier update (next sim
    block ≥ **12,514,000**; stats still ≥ **115,200**) and the ruling are the commander's.

### §R9 SEEDS AND STATS

**BOOKED = WALKED**: `12,513,000–039` + `12,513,999` = **41 seeds, 82 walks**
(`gSeedsBookedEqualWalked` and `gArmsPairedPerSeed` GREEN). The pin suite walks
`12,513,800/801/802` (the smoke prefix, in band); the dormancy cells walk
`12,513,800/801`. **Block 12,513,000–999 CONSUMED WHOLE.**
**STATS: NONE CONSUMED** (`statsConsumed` = 0) — the CIs are bootstrap resamples of the walked
seeds; the next stats base remains ≥ **115,200**.

### §R10 WHAT THIS STAGE HANDS FORWARD (no claims, just the open items)

* **The hole is bought back**: 27.49 → 0.95 sim-seconds, flips 0.248 → 0.026. Whether that
  buys FOOTBALL is H-IN.1's question, and the exam now has a working, priced instrument to
  ask it with.
* **The look-only counterfactual is unwalked.** The exam wants a third arm (passive half alone)
  to separate free sight from the priced look beyond the BODY-TICK attribution.
* **The usage share is 0.56 and the situation spread is 10.2 half-widths.** Whether 0.56 is
  *football* — elite scanning rates are the user's own §-1(3) story — is a question for the
  play-test, not for a receipt.
* **The keeper is the seam's quiet corner** (0.105) and he is what turned `gEveryBodyLooks`
  red. The commander owns the gate's conjunct.
* **The receiver surface is still untouched** (IN-C0 §R4: the receiver is the blindest situation
  at every field), and the o2Look debt still stands.

## §COMMANDER CORRECTIONS OF RECORD (ruling #329, 2026-08-20 — frozen bytes stand)

1. **(verify MED 1) THE ELECTION'S `− loss` SELECTION TERM IS UNPINNED — the DF-T2
   lesson's third instance.** Neutralising the argmax to `gain`-only leaves 31/31 pins
   green while the armed world visibly moves (the verifier's own scratch receipts). The
   THRESHOLD is pinned (M1); the SELECTION rule is not. ORDERED: the IN exam's commit 1
   adds the pin (a constructed fixture with two aims of equal gain and different loss),
   alongside the two inert-guard pins from the LOW finding (the write-side sent-off
   guard, the degenerate guard) as the same batch.
2. **(verify MED 2) THE PAY-AFTER-SERVE ORDERING IS NAMED OF RECORD AS THE SLICE'S
   SECOND REALITY APPROXIMATION**: the looked field is served at truth INSTANTLY and the
   turn is paid AFTERWARDS (a physical sweep yields sight as it completes), and the
   ball-arrived abort refunds the unpaid balance on 7.22 % of looks at exactly the
   payoff moment. Both halves are frozen §P3 law and published faces — the gap was that
   §7's approximation list named only head-independence. It now reads, of record:
   approximation 2 = "sight before payment, with an arrival refund" — a CHEAPENING
   direction. The exam re-checks the all-scanning guard with this named (the receipts'
   44 % decline share at 32 hw says the cost still bites; the exam owns the re-check).
3. **THE RED GATE IS RATIFIED AS FROZEN HONESTY; THE CONJUNCT WAS MIS-PITCHED AT
   FREEZE.** `gEveryBodyLooks` demanded every-BODY universality over a role whose
   geometry legitimately declines: the keeper faces the play with eleven men in front —
   the loss term makes turning away expensive, so a keeper who almost never looks is
   footballing sense EMERGING from the price, not a defect. Red stays red; the .RED.json
   stays the artifact of record (the BK arc's two ratified reds are the precedent). The
   exam's form of this gate is usage NON-DEGENERACY BY SITUATION, never per-body
   universality.
4. **THE PASSIVE-HALF SCOPE CALL IS RATIFIED.** Arming both halves (free heading-field
   refresh for every body at his own decision + the priced look) is M-IN.1's own
   sentence applied where the contract always wrote it — without it an off-ball look is
   impossible and the 接球前观察 story cannot exist. Pre-registered §P2(b), attribution
   split published (the priced look bought 45.8 % of the erased staleness). Within
   contract.
5. **THE EXTEND-vs-NEW RULING IS RATIFIED: the look is NEW, and IN-C0 §R7 item 6's
   EXTEND recommendation is SUPERSEDED of record** on the census's own evidence (o2Look
   is carrier-only, instrument-forced, cannot turn, pays a plant not a turn, writes
   slice-1's memory, one global window, STOP-pinned). The o2Look composition-discharge
   debt therefore does NOT fall due and STANDS on the menu, unmoved.
6. **HOUSEKEEPING OF RECORD**: IN-T0 §P5's "exactly ONE consumer" sentence is historical
   as of this stage (the look writes through IN-T0's exported writers — the #327 item 3
   second-reader precedent, applied symmetrically). The QUEUE's STANDING DEBTS line
   still listed the anti-pinball comment anchor — discharged at #313, verified in
   Match.ts by this stage's executor; struck from the QUEUE this round. The
   commit-2-pins ordering deviation (the hunt's two pins landed after the freeze; src
   byte-identical, disclosed) is ratified as reported-not-smoothed.
