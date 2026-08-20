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
