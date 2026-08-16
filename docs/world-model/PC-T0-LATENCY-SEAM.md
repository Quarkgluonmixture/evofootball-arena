# PC-T0 — THE DORMANT REACTION-LATENCY SEAM (build slice)

> Dispatched by ruling **#297 item 7** with its design FIXED by **#297 items 3–5**, under
> [`PC-PERCEPTION-CONTRACT.md`](PC-PERCEPTION-CONTRACT.md) §2 (M-PC.1–5), which implements
> [`INFO-DOCTRINE.md`](INFO-DOCTRINE.md) §0–§1 primitive 2. Substrate:
> [`PC-C0-REACTION-BASELINE.md`](PC-C0-REACTION-BASELINE.md), read **with** its
> §COMMANDER CORRECTIONS.
>
> **BUILD SLICE**: the seam is built, flag-gated and ASLEEP. Nothing is scored, no baseline is
> paired, no CI is drawn. H-PC.1 and H-PC.2 belong to PC-T1/PC-T2.
>
> Seam [`src/ai/pcLatency.ts`](../../src/ai/pcLatency.ts) · pins
> [`tests/pcLatencySeam.test.ts`](../../tests/pcLatencySeam.test.ts) (20) · probe
> [`scripts/probes/pc-t0-seam-receipts.ts`](../../scripts/probes/pc-t0-seam-receipts.ts) ·
> artifact [`data/pc-t0-seam-receipts.json`](data/pc-t0-seam-receipts.json)
> (`resultSha256` `a7c2f198…529654`) · **15/15 gates · 54/54 mutants LIVE · G-DET bit-identical**.

## §0 THE QUESTION, in football

PC-C0 measured it: **处理时间在这个世界里根本不存在**. Six of seven surprise classes re-target the
truth ball at the first possible tick at exactly 1.000000, and the only latency the world pays is
one flat, event-blind cadence constant. This slice builds the CAPACITY to be surprised — and
leaves it switched off.

---

## §1 THE DESIGN, CLAUSE BY CLAUSE AGAINST #297

| #297 clause | what was built | where |
| --- | --- | --- |
| item 7 — a new match flag, house naming | `pcReactionLatency`, Road B: explicit boolean, never env-armed, never `EDS_BUNDLE_ARMED`, absent from `a4World` and every preset | `Match.ts` `MatchConfig` |
| item 5 — TRIGGERS: the seven census classes as state-transition predicates over public state | PC-C0's predicates **reused verbatim** in one detector; the census remains the source of truth for what counts as each class | `Match.pcLatencyObserve` |
| item 5 — build order / priority, turnover first-class | `PC_CLASSES` **is** the priority order; `PC_CLASS_RANK` derives from it, so the order has one home. Per BODY, the earliest class wins | `pcLatency.ts` |
| item 5 — WHO PAYS: every affected body on the surprise side, the census's relevance form | every non-initiator inside `PC_RELEVANCE_M = 25` m of the ball at the event tick | detector |
| item 5 — the FIVE initiator paths untouched BY NAME | untouched **by exclusion**, never by name-checking: an initiator is never in his own surprise set. `knockAndGo` (`mechanics.ts:1606`) · `captureSettle` · `gkFeetOverride` · `oneTouchWindow` · `substitutionArrival`. `mechanics.ts` is byte-untouched by this slice | detector + `gSeamMap` |
| item 4 **H4** — the one-touch window is the PRE-PROCESSING channel, kept as-is | a body with `firstTouchWindow > 0` is SKIPPED (counted: `preProcessedSkips`). Pre-processed = fast, surprised = slow | detector |
| item 4 **H5** — the ordinary-push author keeps today's cadence | he is the `dribblePush` initiator ⇒ excluded ⇒ nothing changes for him. The seam grants zero latency to nobody | `PC_INITIATOR_PAYS.dribblePush = false` |
| item 4 **H6** — the SPILLER pays | `PC_INITIATOR_PAYS.looseBallSpill = true` — the one class whose initiator is inside his own surprise set | `pcLatency.ts` |
| M-PC.2 — THE HOLD, the `markAnchor` idiom generalised | ONE per-body gate at the executor surface, after every case and after both clamps — the single point the FULL per-tick steering set passes through | `actionExecutor.ts` |
| item 5 — the hold surface, now +2 channels | `interceptSolution · jockeyStandoff · mark.stance · mark.trapHold · receive.descentReroute · formationSpot · support · gk.position · gk.rush · **GoalkeeperSave** · **MakeRun**` — the two amended by §CORRECTIONS 1 | one gate covers all |
| ⭐ vectors COPIED, never aliased | `remember` copies in, the gate copies out. Pinned three ways against the `faceTarget = ball.pos` hazard | pin suite |
| M-PC.2 — the decide-loop AND-gate | `p.decisionTimer <= 0 && !pcHeld`; `decisionTimer` is **never written** by this seam and never re-armed while held | `Match.ts` decide loop |
| item 4 **H3** — mid-hold team reassignment | the hold is the BODY's. `TeamBrain.ts` is byte-untouched and PC-free (machine-asserted); the executor keeps the stale target whatever the paper says. Counted: `heldThroughReassignment` | pin + receipt |
| item 3 — THE TIERS, derived twice over, read from ONE place | `PC_TIER_SIMPLE_SIM_S = 0.20` (**12 applied ticks**) · `PC_TIER_CHOICE_SIM_S = 0.45` (**27 applied ticks**), ticks derived over the shipped `DT`, the #280 form | `pcLatency.ts` |
| M-PC.3 — THE RECOGNITION BOOK, fifth instantiation | gene-free · born ABSENT · own exposures only · match-local views · season reset · no franchise writes · nothing in `info.genome` | `PcRecognitionBook` + `League` |
| item 4 **H1** — the key | `class × pressed × relation` = 7 × 2 × 2 = **28 cells**, every component an engine-written context bit, zero information cost | `pcRecognitionKey` |
| item 4 **H1** — N_COVER derived + sensitivity hooks | **18**, derived below; `PC_N_COVER_SENSITIVITY = [9, 18, 36]` and `MatchConfig.pcNCover` let PC-T1 sweep the band | §2 |
| overlapping surprises — rule it explicitly | **MONOTONE RESTART**, §3 | `PcLatencySeat.arm` |
| ⭐ ADDITIVITY (binding) | the seam never touches `decisionTimer`; the world's ≈6.54-tick cadence keeps running underneath, so PC-T1/T2 measure **added-lag = armed − base** | §4 |
| item 4 **H2** — role differentiation is a REPORTED face, never a scored promise | nothing role-keyed exists in `src`. Whether role-flat exposure yields role-flat reaction is PC-T1's finding | (not built, by ruling) |

### The three sentences that are the whole mechanism

1. On a surprise, every affected non-initiator inside 25 m is ARMED for his tier.
2. While armed, his executor re-applies the target and facing he applied on the tick **before**
   the event was observable, and his decision slot does not open.
3. His book learns the cell — **after** the tier was decided, so the surprise he is paying for
   never makes itself recognised.

---

## §2 ⭐⭐ N_COVER — THE DERIVATION, PRINTED

**ANCHOR.** The programme has exactly one *measured* book-sufficiency figure: the **L3 τ
yardstick** ([`L3-T1-CONVERGENCE-EXAM.md`](L3-T1-CONVERGENCE-EXAM.md)) — the rare cell's per-book
fill was **184 labels**, and τ cleared at 12 seasons. PC-C0 §EXPOSURE transfers it explicitly and
warns, in §DOUBTS 4, that it is a transfer.

**THE DISCOUNT.** L3's book must **ORDER two outcome rates** (punished/lunges across two arrival
groups): it needs enough labels for two *rates* to separate at τ. A PC recognition book only needs
**COVERAGE** of a cell (M-PC.3) — a count, with no second quantity and no separation to achieve.
The census names the size of that gap in its own words: a coverage book *"plausibly needs an order
of magnitude less"*.

> **N_cover = floor(184 ÷ 10) = 18.**

The discount is the census's own stated bound taken at face value. It is a **STRUCTURE choice, not
an answer** — which is precisely why #297 item 4 H1 orders it sensitivity-checked, and why the
`[9, 18, 36]` band and the `pcNCover` world parameter are built here rather than argued.

### The census fill-time arithmetic at N = 18

The key multiplies the class by `pressed × relation`. Taking PC-C0's measured exposures/body/season
and its measured per-class pressed shares, and splitting `relation` **50/50** (a stated assumption,
not a measurement — see §DOUBTS 3), the seasons a body needs to cover a cell:

| class | fastest cell | seasons | slowest cell | seasons |
| --- | --- | ---: | --- | ---: |
| `deflection` | MF · pressed | **0.084** | GK · open | 0.40 |
| `passRelease` | MF · pressed | **0.091** | GK · open | 0.61 |
| `turnover` | MF · pressed | 0.217 | GK · open | 2.20 |
| `knockRelease` | MF · pressed | 0.323 | GK · open | 3.39 |
| `shotRelease` | MF · pressed | 0.664 | GK · open | 3.46 |
| `dribblePush` | MF · open | 0.898 | GK · pressed | **39.13** |
| `looseBallSpill` | MF · pressed | 1.885 | GK · open | **∞ (never)** |

⭐ **This is the shape the finer key was chosen for.** At CLASS grain PC-C0 showed the book
saturating inside one match and H-PC.1(a) becoming unfalsifiable. At `class × pressed × relation`
the same world contains cells that fill in **half a match** and cells a keeper will **never** fill
— `dribblePush|GK|pressed` at 39 seasons and `looseBallSpill|GK|open` at never, because the
production push is gated on `nearOpp > 4.2 m` and a spill is 100 % pressed. A book with permanent
holes is what "the novice pays long BY CONSTRUCTION" means at career scale.

### Measured against the arithmetic, on the real battery

One 240 sim-s match, 12 bodies × 28 cells = **336 body-cells per match**:

| N | body-cells covered after ONE match (8 seeds) |
| ---: | --- |
| **9** (N/2) | 84 · 90 · 91 · 91 · 93 · 97 · 101 · 107 |
| **18** (N) | 21 · 33 · 35 · 39 · 40 · 42 · 45 · 47 |
| **36** (2N) | 0 · 0 · 0 · 0 · 1 · 4 · 6 · 0 |

The band is doing exactly the job #297 item 4 H1 asked of it: at N/2 a quarter of the book is
already covered in ninety minutes, at 2N almost none is. **A conclusion that flips across this
band is no conclusion** — and PC-T1 now has the instrument to say so.

---

## §3 ⭐⭐ THE OVERLAP RULE — MONOTONE RESTART (pinned)

A new surprise during a live hold **restarts the timer at the NEW event's tier**, and the expiry
**never moves earlier**:

```text
untilTick = max(oldUntilTick, nowTick + 1 + tierTicks(newTier))
```

Two reasons, stated so the choice is auditable rather than natural-looking:

1. A body who has not finished processing the first surprise cannot be *helped* by a second one.
   Without the `max`, a SIMPLE event landing mid-hold would cut a live CHOICE hold short — a
   second surprise would make him faster.
2. Monotonicity makes the hold length a deterministic function of the event stream with no
   ordering hazard inside a tick.

⚠ **The stale plan is NOT re-captured on a restart.** He has reacted to nothing yet, so there is
no newer plan to freeze. Measured on the battery: **6,016** restarts, of which **151** did not
extend the expiry (the rule refusing to shorten), and **141** records were extended.

---

## §4 ⭐ ADDITIVITY (the #297 item 5 binding)

The seam **never writes `decisionTimer`** — machine-asserted: no assignment to that field exists
in `src/ai/pcLatency.ts` or in `src/ai/actionExecutor.ts`. While a body is held his slot simply
does not open and his timer is not re-armed, so the world's own phase-staggered 9-tick cadence
(free lag of record **mean ≈ 6.54 / median 7**, the k−1-corrected values, §CORRECTIONS 2) keeps
running underneath. The seam's contribution is therefore **separable in measurement**:

> added-lag = armed − base, at event grain. The world's own ≈6.54-tick cadence is **not** the
> seam's credit, and PC-T1/T2 must never report the raw total.

---

## §5 THE DORMANCY PROOF (the hard gate)

Two independent instruments, both at the house form, both **UNMOVED**:

| instrument | value | at clean HEAD | verdict |
| --- | --- | --- | --- |
| pooled world identity, 10 bare + 10 v7-armed matches (seeds 12,492,900–909; ball state + all 12 bodies every 37th tick) | `5dafce81…f70c` | `5dafce81…f70c` | **IDENTICAL** |
| the repo's own league fingerprint, `scripts/fingerprint.ts 1337 2` | `57b0bdab…c673` | `57b0bdab…c673` | **UNMOVED** |
| flag **ABSENT** ≡ flag **FALSE**, per seed, per world shape (bare and v7) | 4/4 true | — | **IDENTICAL** |

Plus the pin suite's own dormancy test across 2 seeds × 2 world shapes, and the whole suite green:
**143 files / 1,543 tests** (the 20 new pins included).

⭐ And the **converse**, so dormancy is not vacuous: arming the door on the same seed produces a
**different** world signature (pinned). The seam is asleep, not absent.

---

## §6 THE RECEIPTS (8 walks × 14,400+ applied ticks = 119,714 applied ticks)

### (2) Trigger firings and arms, per class

| class | events fired | bodies armed |
| --- | ---: | ---: |
| `deflection` | 715 | 6,369 |
| `passRelease` | 659 | 5,672 |
| `turnover` | 189 | 1,725 |
| `dribblePush` | 132 | 1,175 |
| `knockRelease` | 122 | 1,106 |
| `shotRelease` | 94 | 712 |
| `looseBallSpill` | 19 | 194 |
| **total** | **1,930** | **16,953** |

Every arm found a live stale plan to freeze (`armedWithMemory` = 16,953 = arms) and wrote exactly
one exposure (`exposuresNoted` = 16,953), and the books hold exactly those exposures. Held
executor ticks **360,336**; decision slots suppressed **306,587**; H3 reassignment ticks
**1,369**; H4 pre-processing skips **6**.

⭐ **Tier split: 1,549 SIMPLE (9.1 %) vs 15,404 CHOICE (90.9 %).** In ONE match, with born-absent
books, nine tenths of all surprises are paid at the long tier. That is M-PC.3 working — the SIMPLE
tier is what PC-T1 has to **earn** across a season, not something the world hands out.

### (3) ⭐⭐ Hold durations are EXACTLY the derived ticks

The CLEAN population (ran out on its own: not superseded by a re-arm, not extended by an overlap,
not cut by the whistle, not straddling a dead-ball pause) — **10,699 records**, and its length
histogram has exactly **two non-empty bins**:

| length (applied ticks) | records | tier |
| ---: | ---: | --- |
| **12** | 989 | SIMPLE (0.20 sim-s) |
| **27** | 9,710 | CHOICE (0.45 sim-s) |

`p50 = 27`, `p90 = 27`, both derived from the **stored** bins (§CORRECTIONS 4). The other four
populations are counted, never dropped: superseded 6,016 · extended 141 · open at the whistle 28 ·
spanning a dead ball 122 (§DOUBTS 1).

### (4) ⭐⭐ The book fills from OWN exposure only — an INDEPENDENT camera

The camera re-implements no predicate. Each tick it records, from public engine state, every
body's distance to the ball; the next tick it asks of every body whose book grew: *were you inside
the relevance radius in the geometry the detector actually read?*

> **1,569 / 1,569** book-growth events came from a body inside the radius.
> **Max distance of any body who gained coverage: 24.94 m** (radius 25 m).

Nobody ever gained coverage from an event outside his own relevance.

### (5) The seam map, occurrence COUNTS with every site enumerated

`gSeamMap` pins 24 needles by **expected occurrence count** and enumerates **every** site
(§CORRECTIONS 1's canon: one needle with one site is a lie of omission). It includes the two
amended channels, the ONE gate, the ONE detector, the ONE arming fork, the five initiator paths —
and `st.decisionTimer = 0.05`, the kick-off striker, enumerated explicitly so `= 0.05` has no
silent third site. `TeamBrain.ts` and `PlayerBrain.ts` are asserted to contain **zero**
occurrences of any PC token (H3, and M-PC.5 / M-PW.4's form: the CB seat's arming block untouched).

### (6) The armed smoke shape — a receipt, never the exam

| seed | goals | shots | passes completed | holds armed | held executor ticks |
| ---: | --- | --- | --- | ---: | ---: |
| 12,497,000 | 1–2 | 5–6 | 38–32 | 2,751 | 51,826 |
| 12,497,001 | 5–0 | 12–2 | 19–39 | 2,170 | 45,706 |
| 12,497,002 | 5–1 | 8–2 | 33–30 | 2,439 | 50,392 |

⚠ No baseline is paired and no CI is drawn. These prove an armed world still plays football and
the seam fires in it. **They are not an effect size** (#289 item 1).

---

## §7 THE SRC SCOPE

Four files, machine-asserted against the dispatch commit `49bfd46` by `gDiffScope` (both
directions: nothing undeclared moved, and nothing declared failed to move):

| file | what changed |
| --- | --- |
| `src/ai/pcLatency.ts` (**NEW**) | the tiers · the class list and order · the recognition book · N_cover and its band · the seat, the holds and the stale-plan memory. **Import list closed to `../sim/constants`** — it cannot name `Match`, `Player`, `Team` or an rng (the `defenceBook.ts` discipline, pinned) |
| `src/sim/Match.ts` | the flag, the nullable seat + its ONE arming fork, the detector, the decide-loop AND-gate, the `pcPrev` snapshot |
| `src/ai/actionExecutor.ts` | THE ONE per-body gate |
| `src/sim/League.ts` | the season books, their season-boundary reset, the `matchFlags` widening |

**NOT touched:** `src/sim/mechanics.ts` (so `knockAndGo` is byte-identical), `src/ai/TeamBrain.ts`
(H3), `src/ai/PlayerBrain.ts` — **the CB seat's arming block is machine-asserted UNTOUCHED, the
PW-T0b way** (zero PC tokens in the file, and the file is outside the diff scope), so the S∧¬T
guard does **not** fall due in this slice (M-PC.5 / M-PW.4's form). `src/sim/Player.ts` is
untouched too: the seam keeps its per-body state in the seat's own maps, so no new field can leak
into any serialization.

**No gene. No genome write. No serialization.** Pinned: no `GENE_KEYS` entry starts with `pc` or
mentions latency/recognition; a League with the door armed and books allocated serializes no PC
token; a finished armed match's result carries none.

---

## §8 SEEDS — BOOKED = WALKED

```text
block            12,497,000 – 12,497,999   (ruling #297 item 6)
smoke            12,497,000 – 12,497,002   (armed smoke shape)
receipt battery  12,497,100 – 12,497,107   8 seeds, 14,400+ applied ticks each
own-exposure cam 12,497,200                (1 walk, tick by tick)
pin suite        12,497,800 – 12,497,802   (tests/pcLatencySeam.test.ts)
world identity   12,492,900 – 12,492,909   ⚠ FOREIGN and DISCLOSED — the CONSUMED PW-T0b band,
                                            re-walked for the identity comparison ONLY
preflight band   12,497,900 – 12,497,919   DECLARED, disjoint by construction; NOT drawn
retired          12,494,000 – 12,494,999   NEVER TOUCHED (gSeeds asserts, with its own mutant)
stats stream     ZERO DRAWN — a build slice draws no CI. Floor 113,200 STANDS.
```

**PREFLIGHTS DECLARED** (three, all `PCT0_OUT` to `/tmp` with `PCT0_N`, none writing a canonical
path): they drew receipt seeds 12,497,100–101, smoke 12,497,000–001, camera 12,497,200 and
identity 12,492,900–901 — every one inside the booked band or the disclosed identity band. The
declared preflight band was not drawn.

## §9 GATES — the set, frozen ex ante (**15**, 54 mutants, all LIVE)

| gate | what it proves |
| --- | --- |
| `gDet` | G-DET: the whole receipt core runs TWICE and re-derives bit-identically. |
| `gDormancy` | ⭐⭐ THE HARD GATE: the pooled bare+v7 digest and the league fingerprint both re-derive their clean-HEAD constants, the baseline is the COMPLETE one, and flag-absent ≡ flag-false everywhere. |
| `gDiffScope` | the src files touched since the dispatch commit are EXACTLY the declared four — neither more nor fewer — and the working tree's `src` is committed at result time. |
| `gArms` | every receipt walk carries the v7 arm live, the L3 dose live, and the latency door open. |
| `gDose` | ⭐ #289 canon: the dose file's own BYTES are hashed and its digest RE-DERIVED from them. |
| `gClock` | APPLIED, not nominal: shipped `DT`, shipped `MATCH_DURATION`, tiers = 12 / 27 ticks derived over the shipped tick, every walk stepped its full match. |
| `gSeamMap` | ⭐ every needle has EXACTLY its expected occurrence count, every occurrence is enumerated as a site, every source file hashed. |
| `gTriggers` | all seven classes fired; every arm froze a live stale plan; every arm wrote exactly one exposure. |
| `gHoldLength` | ⭐⭐ every CLEAN hold ran its own tier's length; every hold's declared length is its tier's constant; the only clean lengths are the two tier constants; the bins account for every clean record; both tiers were actually observed. |
| `gOwnExposure` | ⭐⭐ the independent camera: every book growth came from a body inside his relevance, and no grower stood beyond the radius. |
| `gBooks` | the books hold exactly the exposures written; the key space is the ruled 28; N_cover is the derived 18 with the half/one/double band. |
| `gSeeds` | every walked seed is booked or a disclosed identity seed; the retired block untouched; the preflight band disjoint. |
| `gEnvelope` | #289 item 1: no invocation fact inside the hashed body; a cross-OUT with a DIFFERENT envelope has the IDENTICAL digest; the disk copy re-derives its own digest. |
| `gFaces` | ⭐ #287 item 1 + §CORRECTIONS 4: EVERY published face re-derived by parsing the SERIALIZED artifact off disk — including both percentiles, from STORED bins. |
| `gMutants` | ⭐⭐ #268.3(a): machine-derived coverage — every conjunct owns exactly one mutant, flipping it flips only its own conjunct; an incomplete map REFUSES THE RUN (exit 3). |

**Freeze order (#266.3(c)):** `3c040a0` (the freeze) precedes the battery; the probe is
**byte-unchanged** between freeze and result (`git diff --stat HEAD -- scripts/probes/pc-t0-seam-receipts.ts`
empty at result time).

## §10 NON-CLAIMS

* RECEIPTS ONLY. Nothing here scores H-PC.1 or H-PC.2. No baseline is paired, no CI is drawn, and
  no number in this document is an effect size.
* The armed smoke shape is a LIVENESS receipt. A goal count from an armed world with no paired
  control says nothing about the seam's effect and is not offered as saying it.
* N_cover = 18 is a DERIVED STRUCTURE, not a measured threshold. The tier-transition curves at
  9 · 18 · 36 are PC-T1's to report; this slice built the capability.
* The class predicates are PC-C0's, reused verbatim; they are state-transition detectors over
  public state, not engine callbacks, and can under- or over-count at the margin exactly as the
  census disclosed.
* Role differentiation (H2) is NOT built and NOT promised. Nothing in `src` is role-keyed.

## §DOUBTS

1. ⚠⚠ **THE LATENCY CLOCK RUNS THROUGH DEAD BALLS; THE WORLD'S OWN CADENCE DOES NOT.** `simTick`
   advances during `kickoff` / `goalPause` / `halftime`, but `Match.step` returns before the
   decide and execute loops in those phases — and `Player.update` (which decrements
   `decisionTimer`) is skipped with them. So a hold armed just before a stoppage can expire
   without the body paying those ticks, while the world's own cadence freezes. **122 of 16,953
   records (0.72 %)** straddled such a pause on this battery; they are excluded from the CLEAN
   population and published as `recordsSpanningDeadBall`. Football arguably agrees that a
   stoppage gives you time to process — but the two clocks disagreeing is a design fact, not a
   measurement artifact, and the commander may want it ruled before PC-T1.
2. ⚠ **The own-exposure camera proves the RELEVANCE bound, not the class label.** It shows nobody
   distant gains coverage. It does **not** independently re-derive WHICH cell a body was exposed
   to, because the detector is the only implementation of those predicates in the tree. A wrong
   class label would be invisible to this receipt (it would be visible to PC-C0's published
   per-class counts, which the firing table is broadly consistent with at 8 walks vs 200).
3. ⚠ **The 50/50 relation split in §2's fill-time table is a STATED ASSUMPTION, not a
   measurement.** PC-C0 published exposures per class per role but not per relation. If the real
   split is lopsided the fastest cells fill faster and the slowest cells slower — i.e. the table's
   spread is an under-statement of the true spread, which strengthens rather than weakens the
   finer-key argument. PC-T1 can measure it directly from a walked book.
4. ⚠ **`armedWithMemory` is a conservation identity, not proof the memory is the RIGHT plan.**
   It proves every arm found *a* stored plan. That the stored plan is the pre-event one follows
   from the ordering (executor at tick T, detector at the head of T+1) and is pinned behaviourally
   in the suite — but no receipt independently reconstructs the pre-event target.
5. ⚠ **One full-suite run showed 1 failure I could not identify.** The run's tail captured only
   the summary line (`1 failed | 1542 passed`); two immediately subsequent full runs were
   **1,543/1,543 green**. The leading explanation is that a new untracked file was written into
   `scripts/probes/` while that run was in flight; I could not reproduce it and I am not able to
   name the test. Recorded rather than rounded away.
6. ⚠ **The exposure write is once per body per tick, by priority winner.** A body surprised by
   two classes on one tick learns only the class he pays for. That is a defensible reading of
   "own exposures" but it is a CHOICE, and it makes book fill slightly slower than the raw class
   arithmetic in §2 predicts.
7. ⚠ **The two facing writes below the executor gate are outside it** (a keeper holding the ball,
   a restart taker over it). Both are dead-ball states, and the gate is deliberately kept to ONE
   site rather than duplicated. Stated so it is not discovered later.
8. ⚠ **CITATION DEFECT IN THE DISPATCH BRIEF (strike-eight candidate, fair hit or not — the
   commander decides).** The brief cites the unit-name canon as "#294 item 1 · #295 item 3". Both
   item numbers are wrong: the canon lives at **#294 item 3** (CORRECTIONS: *"a field carries the
   unit its name claims"*) and **#295 item 4** (CORRECTIONS: *"the unit-name canon recurs"*).
   #294 item 1 and #295 item 3 are the LANDED and EMERGENCE items respectively. Every other cite
   in the brief was checked and is correct in both number and form (#297 items 3/4/5/7, #297
   corrections items 1/4/6, #294 item 3 for verifier-scratch, #289 item 1, #280's applied-tick
   form, #270's no-genome rule, the `actionExecutor.ts:381` `markAnchor` precedent, and both pin-
   suite precedents). The canon itself is substantively correct and was obeyed.
