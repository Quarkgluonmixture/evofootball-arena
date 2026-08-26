# GC-T1B — THE ALTERNATIVES ARM (给他别的线可选,他就会换线传吗)

> **SHUT vs ARMED on the world-11 stack + the BANKED DLC PAIR — the probe #345 item 4's reading
> asked for.** Authorized by **COMMANDER RULING #345 item 5**; bound by
> [`GC-GROUND-CORRIDOR-CONTRACT.md`](GC-GROUND-CORRIDOR-CONTRACT.md) §3, re-arming
> [`GC-T1-GROUND-CORRIDOR-EXAM.md`](GC-T1-GROUND-CORRIDOR-EXAM.md)'s own instruments.
> Seams under exam: [`GC-T0-DORMANT-SEAM.md`](GC-T0-DORMANT-SEAM.md) (`bkGroundCorridor` +
> `groundShellHazard`) composed with the banked
> [`DLC-T1-CHOICE-EXAM.md`](DLC-T1-CHOICE-EXAM.md) (`4d0120e`, #238) and
> [`DLC-T1S-STRIKE-EXAM.md`](DLC-T1S-STRIKE-EXAM.md) (`fe955b9`, #243).
> Design facts: [`BK-C2-CAROM-CENSUS.md`](BK-C2-CAROM-CENSUS.md) (#342 item 2).
> Instrument: `scripts/probes/gc-t1b-alternatives-arm.ts`.
> Artifact: `docs/world-model/data/gc-t1b-alternatives-arm.json`
> (**or its `.RED.json` SIDE PATH** if any gate is red — the red-routing idiom, #334 item 5,
> implemented as the instrument's own line).
>
> **THIS STAGE SHIPS NOTHING.** `bkGroundCorridor`, `dlcDeliveryChoice` and `dlcStrikePlane` all
> stay default OFF and **absent from `a4World.ts` at every version** (re-asserted at battery time
> by `gSeamSitesPinned`); the production fingerprint
> `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` is unmoved. ⛔ **X-SRC-ZERO**:
> no file under `src/` is edited — the probe arms every flag IN-INSTRUMENT, as construction flags
> on its own `Match`.

## §0 THE WORDS OF RECORD, AND THE QUESTION THIS EXAM ANSWERS

The user, at the play-test gate that made this THE RED (#341 item 1, verbatim):

> 「我直接看的最后一版,传球像人,防守还可以,乱跑缓解,**但是弹身体感觉很影响比赛**,门将球
> 合理了」

GC-T1 armed the ground price on the world-11 stack and **H-GC.1 FAILED on (a)(b)(c)**. Its stored
joint cells located the mechanism: the blocked cells lost 453 of the 526 missing ground passes
while the clear cells barely moved, and the deliveries fell with them — **the declined line was
not re-aimed, it was not played**. #345 item 4 wrote the reading of record as a LABELLED
HYPOTHESIS and sent it here:

> the binary price at 0.5 can only make a blocked line WORSE — it cannot rank one blocked line
> against another, and **the world-11 chooser holds NO alternative ground lines to re-aim
> through**. BK-T4 §CORR 3's constraint in a new place: **RE-AIM REQUIRES ALTERNATIVES.**

**THIS EXAM, in one sentence**: give the chooser the banked alternatives in BOTH arms, price the
ground in one of them, and find out whether **suppression converts to re-aim**.

---

# §P PRE-REGISTRATION (frozen at the FREEZE COMMIT, BEFORE any battery seed was read)

## §CORRECTIONS-READ — every canon sentence COPIED from [`CANON.md`](CANON.md), never re-typed

Per ruling #301 item 2's mechanism fix: the ledger is where a brief copies from. ⚠ Per **#342
item 3** (the MED-1 lesson), a constraint that binds this executor beyond the ruling's own
sentences is cited as **"the dispatch brief"**, never as the ruling.

| canon, verbatim | its home | how it binds here |
| --- | --- | --- |
| ⭐⭐ **composition proof** — *"any world arming a new seam alongside the CB/L3 stack proves the doors/lifecycle at THAT composition first."* (paraphrase) | **BU contract M-BU.2 (ruling #285)**, inherited by M-PW.4 / M-PC.5 | **DLC × the world-11 stack is UNMEASURED.** §P11's ten receipts run on OUT-OF-BAND SCRATCH seeds **before any battery seed**, gated by `gCompositionProof`, and they are what establishes what the ordered world actually IS |
| ⭐⭐ **dose placement** — *"dose NEVER in info.genome; truth-dosing writes census values through the shipped writer."* (paraphrase) Recurrence struck at #334 item 1: BK-T3's probe dosed info.genome (impact nil, receipts stand, compliance claim corrected); the ratified form = the match-local-copy idiom (bu-t1's setMtDoseLocal shape) PLUS an info.genome-cleanliness world conjunct, **required of every future dosing instrument** | **ruling #270.2 (the house law)** | `passLeadSupport` is written in the SHIPPED `setCorridorWeight` SHAPE (base + eff copies, `info.genome` NEVER touched) — a **DECLARED DEPARTURE** from DLC-T1's own `armGene`, which wrote all three views and predates #334 (§P1b). `gGenomeClean` asserts the franchise object carries NEITHER gene, on every walked match, every receipt and every composition world |
| freeze-before-battery — freeze the instrument commit BEFORE the battery; artifact records the instrument hash (paraphrase) | **ruling #266.3(c)** | COMMIT 1 lands this §P + the probe; the artifact records `instrumentSha256` and `headAtRun` |
| *"the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not in the schema never enters the body; forbidden-name lists are retired"* | **PC-T0-LATENCY-SEAM.md §COMMANDER CORRECTIONS item 1** | `BODY_SCHEMA` is the 18-key allowlist; `hashedBodySha256` is computed LAST, over the final gate values |
| mutant liveness — every gate conjunct provably alive, exactly-one enforced, or the probe refuses to run (paraphrase) | **ruling #268.3(a)** | `gPriceFires` gates the price's EVALUATION (the corrected form, #334 item 4), `gArmsDiverge` gates the bite, `gAlternativesLive` gates the DLC machinery's delivery; §P8 states which gates are receipts and which can fail |
| per-seed cells — per-seed/per-cluster cells stored so every headline re-derives (paraphrase) | **ruling #282.2(ii)** | `perSeedCells` stores ALL FOUR arms' full rows per cell |
| *"the re-derivation gate covers EVERY published face; a percentile face requires stored bins"* | **PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 4** | `gFaces` re-derives every face, every Δ point estimate, every stored bin table, the composition relations, the quotations and the VERDICT itself off the SERIALIZED artifact |
| *"a field carries the unit its name claims"* | **ruling #294 item 3** | every `…PerMatch` face is on the 240 s match clock; every `…Share` is a share of its own named denominator; `…Metres` is metres |
| *"a src-extracted constant pins its extraction to the NAMED call site — anchored match + line receipt — never first-occurrence"* | **BK-C0-BODYBALL-CENSUS.md §COMMANDER CORRECTIONS item 1** | the shell, the open-lane line and `KICK_COOLDOWN` are anchored with occurrence counts and line receipts |
| *"a seam-map gate pins occurrence COUNTS per needle and enumerates EVERY occurrence's site"* | **PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 1** | `gSeamSitesPinned` re-asserts at battery time: ONE `bkGroundCorridor` fork, ONE pricer statement, ONE hazard call, ONE definition, **ONE `dlcDeliveryChoice` fork, ONE `dlcStrikePlane` fork, ONE PRECEDENCE GUARD**, and ZERO of the three doors in `a4World.ts` |
| *"a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated face"* | **PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4** | every number in §R below is a FIELD of the committed artifact at source precision |
| *"a starred finding states its \|Δ\|÷half-width ratio"* | **BU-T0B-PRICE-SEPARATION.md §COMMANDER CORRECTIONS item 2** | every paired Δ publishes `absDeltaOverHalfWidth` |
| *"a scored face's walk-side predicate is pinned — anchored extraction or fixture — because the re-derivation gate proves arithmetic, not definitions"*; REFINED at #334 item 2 | **DF-T3-SURFACE-EXAM.md §COMMANDER CORRECTIONS item 2** (+ **BK-T3 §CORR item 2**) | `klassOf` · `isDelivery` · `isGroundLaunch` · `isMeasurableGroundPass` are PURE functions called by BOTH the walk and a published fixture table, gated by `gWalkFixtures` |
| *"a dose-source guard should hash the bytes it reads, not a self-declared field"* | **BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 6** | BK-C2's AND GC-T1's quoted numbers are READ out of their committed artifacts with the bytes hashed first, never re-typed from prose |
| *"arming receipts, not football findings"* (receipts ≠ effect sizes) | **ruling #289 item 1** (+ BU-T1 §CORR item 5) | every composition-proof relation, `strikeAttributionCompleteness`, `priceEvalNonZeroShare` and the world receipts are labelled INSTRUMENT RECEIPTS wherever they appear |
| *"WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits matchFlags; …)"* | **ruling #283.2(iv)** | this probe builds `Match` DIRECTLY and never round-trips a League, so no worker fixture is generated |
| *"verifier scratch walks use the stage's own consumed band or the out-of-band scratch range (≥ 900,000,000) — never the next virgin block"* | **PW-T0C-OBJECTIVE-FIDELITY.md §COMMANDER CORRECTIONS item 6** | the COMPOSITION PROOF walked **900,000,300–302** and the SIZING SMOKE walked **900,000,400–439** only; no battery seed was walked before this freeze |
| seed discipline — BOOKED = WALKED reporting; blocks consumed whole of record (paraphrase) | the standing frontier practice (**rulings #286 item 5 onward**) | `gSeedsBookedEqualWalked` compares the CELLS' OWN distinct-seed sets to the booked lists and checks every walked seed is inside the block |
| clock honesty — every rate on the 240 s match clock or dual-axis (1 sim-s = 22.5 display-s); APPLIED values, never nominal (paraphrase) | **ruling #280.2(iii)** + PC-T2 §CORR item 3 | every per-match count carries the clock in its unit string; §人话 opens with the dual-clock declaration (#339) |
| ⭐ provenance hashes are COPIED from the artifact's own field, never from a terminal scroll-back (paraphrase) | **ruling #345 item 1 (the standing order)** | GC-T1's `hashedBodySha256` is published by COPYING that field out of its artifact; the file's own BYTE hash is published separately and re-checked by `gFaces` |
| ⭐ the geneOk VALUE-check order | **GC-T1-GROUND-CORRIDOR-EXAM.md §COMMANDER CORRECTIONS item 2** (the #345 rider) | `gGeneValuePinned` checks BOTH genes **by VALUE** on BOTH match-local views of BOTH teams, every walked match, and reads the DLC gene back through the SHIPPED `passLeadSupportWeight` map on the receipts |

## §P1 THE ARMS — FOUR, IN TWO PAIRS, ONE CONSTRUCTION FLAG APART INSIDE EACH PAIR

| arm | construction | `bkGroundCorridor` | `dlcDeliveryChoice` | `dlcStrikePlane` | `dvExposureWeight` | `passLeadSupport` |
|---|---|---|---|---|---|---|
| ⭐ **`shut`** | `a4MatchFlags(11)` + both DLC doors + `armA4World(m, null, 11)` + the gene | **false** | true | true | **0.5** | **1** |
| ⭐ **`armed`** | THE SAME, plus `bkGroundCorridor: true` | **true** | true | true | **0.5** | **1** |
| `shutPlane` | `a4MatchFlags(11)` + `dlcStrikePlane` ALONE + `armA4World` + the gene | **false** | false | true | **0.5** | **1** |
| `armedPlane` | THE SAME, plus `bkGroundCorridor: true` | **true** | false | true | **0.5** | **1** |

* ⭐⭐ **H-GC.2 IS SCORED ON `shut` → `armed` ONLY.** The `shutPlane` / `armedPlane` pair is
  **REPORTED, NEVER GATED, and enters NO conjunct.** Why it exists is §P1c.
* **THE WORLD'S OWN COMPOSER IS CALLED, NEVER COPIED** — `a4MatchFlags(CORRIDOR_WORLD_VERSION)`
  is the substrate and the three doors are the only literals. `gArmsIsolated` compares the two
  constructed worlds of EACH pair AS OBJECTS over `a4MatchFlags(11)`'s own key set plus the three
  doors, and requires each pair's difference set to be **exactly `['bkGroundCorridor']`**.
* ⭐⭐ **THE DLC AXIS DOES NOT DIFFER BETWEEN THE SCORED ARMS** (the dispatch's own requirement) —
  asserted off the REAL constructed matches by `gWorld`'s `dlcAxisIdentical` conjunct, never
  merely stated.
* **SHARED VIRGIN SEEDS, PAIRED WALKS**: inside each pair every seed is walked by both arms and
  the bootstrap CLUSTER IS THE CELL, so every Δ below is paired by construction. ⚠ The two pairs
  walk DIFFERENT sub-bands: **pairing is WITHIN a pair, and no Δ is ever computed ACROSS pairs.**
* ⛔ **NO WEIGHT LADDER ON EITHER AXIS.** `dvExposureWeight` is pinned at world 11's own 0.5 in
  every arm (#345 item 5's order); `passLeadSupport` is pinned at **1**, DLC-T1's own
  `PTP_GENE_MAX` — the value its CONTEST arms used. What a different value of either would do is
  unmeasured and named.

### §P1b THE GENE-WRITING CHECKLIST, AND THE ONE DECLARED DEPARTURE FROM DLC-T1's OWN

DLC-T1's arming checklist (`armGene` in its own probe) wrote `passLeadSupport` on **all three**
genome views — `info.genome`, `baseGenome`, `effGenome` — of both teams. **That probe predates
ruling #334 item 1.** Canon's dose-placement law (copied verbatim above, home ruling #270.2) is
*"dose NEVER in info.genome"*, with the ratified form = the match-local-copy idiom PLUS an
info.genome-cleanliness world conjunct, *"required of every future dosing instrument"*.

So the gene is written in the **SHIPPED `setCorridorWeight` SHAPE** — `baseGenome` and `effGenome`
replaced by COPIES carrying the gene, `info.genome` never touched. **The checklist's SUBSTANCE is
kept in full**: the flag, a NON-ABSENT gene on the views the chooser actually reads
(`team.genome` IS `effGenome`, `src/sim/Team.ts`'s getter; mentality rebuilds spread from
`baseGenome`), and a **read-back through the SHIPPED `passLeadSupportWeight` map** rather than off
the object this probe wrote. `gGeneValuePinned` proves the VALUE, `gGenomeClean` proves the
franchise object is clean, and §P11's `CANDIDATES-FORM` relation proves the doors actually
DELIVER at this composition. Declared here, not discovered later.

### §P1c ⚠⚠ THE FROZEN PRECEDENCE LAW, AND WHY THERE IS A SECOND, REPORTED PAIR

`src/sim/Match.ts` says of `dlcStrikePlane`, verbatim:

> ⭐ Its relation to the banked doors is FROZEN: `ptpPassLead` and `dlcDeliveryChoice` keep
> PRECEDENCE — no grid forms while either seat exists, so armed-both is the banked door armed
> alone, byte for byte (gated, not promised).

The guard itself is one line in `PlayerBrain.decideOnBall`
(`if (spSeat !== null && dlcSeat === null && ptpSeat === null)`), pinned VERBATIM by
`gSeamSitesPinned`. **The dispatch orders BOTH doors armed; under that law the ORDERED world IS
the two-point contest and the K = 9 grid is structurally inert in it.** Two things follow, and
both are pre-registered rather than discovered:

1. The composition proof **MEASURES** that identity (`G-PRECEDENCE`) instead of quoting it — the
   law says "gated, not promised", so this exam gates it.
2. So that the commander's alternatives question is not answered by half, a **SECOND pair walks
   the grid door ALONE**. It is REPORTED ONLY: it is not in the dispatch's arms, so it is in no
   conjunct, and no Δ is computed between the pairs.

## §P2 THE INSTRUMENTS — GC-T1's OWN, RE-ARMED

* **THE STRIKE ATTRIBUTION**, **THE LIVE FLIGHT**, **THE MEASURED GROUND PASS**, **THE SHELL
  READ** (the SHIPPED `groundShellHazard` itself, called with the pricer's own body set), **THE
  OPEN-LANE CUT** (BK-C2's extraction of the chooser's literal, BK-C2 §CORR item 5 riding
  unchanged) and **THE MOMENT OF CHOICE** are GC-T1 §P2's, unchanged. `gStrikeLedgerAgrees`,
  `gStrikeAttributionComplete`, `gJointPartition` and `gWalkFixtures` ride with them.
* ⚠⚠ **GC-T1 §P2b's INSTRUMENT-FIDELITY GATE IS DELIBERATELY NOT INHERITED.** GC-T1's shut arm
  WAS BK-C2's `w11` world, so BK-C2's intervals were a fidelity reference there. **This exam's
  shut arm carries the DLC pair, so it is NOT BK-C2's `w11` world** — and it is not GC-T1's shut
  arm either. BK-C2's and GC-T1's published numbers are quoted as **DIFFERENT-BATTERY CONTEXT**,
  labelled as such wherever they appear. What IS gated (`gQuotationsFaithful`) is that the quoted
  numbers are the source artifacts' OWN fields, read from hashed bytes. **There is no
  `gInstrumentReDerivesBkC2` in this exam.**

### §P2b ⭐⭐ THE ALTERNATIVES USAGE READ — TWO INSTRUMENTS, AND DLC-T1s's CORRECTION RIDING

**(i) THE DELIVERED LEAD, off the STRIKE ITSELF.** DLC-T1s's OWN observation idiom, copied: a
wrapper on the match's `performPass` that RECORDS the chooser's `ptpLead` argument and DELEGATES
with identical arguments. `ledDeliveredShare` = strikes carrying a non-zero lead ÷ every
`performPass` call; `ledDeliveredShareSupportScoped` = the same on the DLC seats' OWN SCOPE (a
`SupportBallCarrier` target is the only class either door can lead, because `passLeadOffset`
returns exactly ZERO for every other action type) — **DLC-T1 #238 item 2's own support-scoped
idiom**. ⚠ It is a TRACE, so it is proven inert: §P11's `G-LOCKSTEP` walks every composition world
twice, with the wrapper installed and absent, and requires **byte-identical whole-match
signatures**.

**(ii) THE WIND-UP SEAT's OWN AIM**, compared with the target's **PRE-STEP** position (the
positions the chooser saw — `Match.step` runs the brains and THEN the physics; comparing against
the post-step position would credit every to-feet kick with one tick of the target's own motion,
measured at ≈ 0.076 m in the scratch smoke). The world-11 stack does NOT arm `inSnapshotLaw`, so
the chooser's rosters ARE the truth objects and this is his own read.

> ⛔⛔ **NEITHER IS A DECLINE RATE, AND DLC-T1s's OWN RETRACTION IS WHY.** #243 item 1 retracted
> its first delivered-rate statistic because it *"scored two OPPOSITE facts identically: the plane
> offered another kick and the decision declined it (a real zero-point win) and the plane had
> nothing to offer (a fully degenerate grid — the treatment was impossible at that decision)"*,
> and the symptom that proved it mattered was that **the old statistic was NOT MONOTONE IN
> TREATMENT** (PLANE-INERT scored 0.3846, HIGHER than PLANE's 0.3000). Its corrected form
> conditions on GRID LIVENESS per decision. **That conditioning is not available here**: liveness
> needs the seat's own remembered motion, i.e. a `match.perceivedSnapshot` pull that RECONSTRUCTS
> the body's percept memory in place and could perturb the walk it is measuring. So this exam
> publishes a **USAGE** share only, never a decline rate, and the support-scoped form is published
> beside it because it removes the largest STRUCTURAL zero class.

## §P3 H-GC.2(a) — THE GROUND-STRIKE FACES FALL RESOLVEDLY

> **FROZEN RULE.** At **BOTH** named faces, the **PAIRED per-cell bootstrap Δ (`armed` − `shut`)**
> has its **95 % interval ENTIRELY BELOW ZERO** (the house resolution form).

| face | what it is |
|---|---|
| ⭐⭐ `groundStrikesPerMatch` | attributed body strikes on a **GROUND** flight, per match — published as a per-match **COUNT** so a fall cannot be manufactured by a shrinking denominator |
| ⭐⭐ `caromedGroundOnOpenLaneShare` | of the measured ground passes that ACTUALLY caromed, the share played on a line the chooser's OWN gate called OPEN (BK-C2 §R2(i)'s face verbatim) |

* **THE PAIRED FORM**: the same cell in both arms of the pair is one pair; each of the 2,000
  bootstrap draws resamples CELLS once and re-derives BOTH arms' pooled ratios inside that draw.
  Percentile interval, resample rng seeded from the block base **12,525,000**.
* `absDeltaOverHalfWidth` is published for every Δ (canon: starred |Δ|÷half-width).

## §P4 H-GC.2(b) ⭐ NON-SUPPRESSION — THE BAND, AND ITS EXACT CONSTRUCTION

> **FROZEN RULE.** `armed.groundPassesPerMatch`'s point estimate sits **AT OR ABOVE THIS EXAM'S
> OWN `shut` ARM'S 95 % interval's LOWER EDGE**.

* **THE BAND IS DERIVED FROM THIS BATTERY'S OWN CONTROL ARM** — BK-T4 §P3 / GC-T1 §P4's form
  exactly, applied to **THIS exam's shut arm** as the dispatch brief orders. **No taste constant**
  (no "within 10 %", no absolute floor, and **not GC-T1's 70.775** — that number belongs to a
  different world on a different block): the band is
  `faces['shut.groundPassesPerMatch'].ci95[0]`, computed by the same bootstrap as every other
  interval and published beside the verdict.
* **THE UNIT IS PER MATCH** on the engine's own 240 s match clock (one row = one match).
* ⛔ **IF (a) PASSES ONLY WHERE VOLUME COLLAPSES, (b) FAILS AND THAT IS THE RESULT.** The rule is
  not re-cut after sight, and a failed conjunct is a measurement, not a red gate.
* **REPORTED BESIDE IT, GATED BY NOTHING**: `passCompletion` · `possessionSpellSeconds` ·
  `possessionFlipsPerMatch` · `flipsCaromLastContactShare` · `deliveriesPerMatch`.

## §P5 H-GC.2(c) THE TEAMMATE FACE · H-GC.2(d) THE LOFTED CONTROLS

> **(c) FROZEN RULE.** `teammateStrikesPerMatch` — attributed strikes whose struck body is the
> PASSER'S OWN TEAMMATE, per match — has its **paired Δ 95 % interval ENTIRELY BELOW ZERO**, the
> same form as (a). (GC-T1 missed this by **0.0625** on the interval's upper edge; ⚠ that is a
> DIFFERENT battery on a different world, quoted as context, and **nothing here is sized to it**
> — #345 item 5 ordered no re-sizing and none is invented.)

> **(d) FROZEN RULE.** Each lofted-family control's **ARMED point estimate lies INSIDE THIS
> EXAM'S OWN `shut` arm's 95 % interval** [lo, hi] (BK-T4 §P2's control form):
> `loftedDeliveriesPerMatch` · `crossesPerMatch`.

⚠ **THE CONTROLS ARE NOT PERFECTLY INSULATED AND THAT IS DECLARED** (GC-T1 §P5's limit,
inherited): the ground price changes what the chooser picks at ONE argmax that also contains the
lofted switch, so a *substitution* effect can move a lofted volume without the term ever being
applied to it. (d) tests that the price does not REACH the flighted lines; it cannot separate
"not priced" from "not substituted into".

## §P6 ⭐ REPORTED, NEVER GATED — THE RE-AIM SIGNATURE AND THE REST

* ⭐⭐ **THE RE-AIM SIGNATURE.** The `jointLaneOpenByShellBlocked` cells
  (`[laneOpen, laneContested]` × `[shellBlocked, shellClear]`) per arm, their within-pair cell
  differences, the blocked/clear column deltas, and `groundPassesPerMatch` +
  `deliveriesPerMatch` beside them. **The reading rule, stated before the battery**: a RE-AIM
  signature is blocked mass falling **while the CLEAR column RISES and the delivery volume
  holds**; a SUPPRESSION signature is blocked mass falling with the clear column flat and the
  deliveries falling too (GC-T1 §R2's own reading). GC-T1's published cells are quoted beside
  ours as ⚠ **DIFFERENT-BATTERY CONTEXT** — different world (no DLC pair), different block.
* **THE USAGE SHARES** (§P2b), per arm and per pair.
* **completion + possession spells** · **the interception-decomposition face** · **goals/shots**.
* **THE PLANE PAIR**, whole.
* ⛔ **NO SEASON LADDER.** #345 item 5 orders none and GC-T1 §R6's stands; the block is not spent
  on it.

## §P7 THE PERF FACE — GC-T1 §P7's METHOD, INHERITED VERBATIM

`wallSecondsPerMatch`, per arm. **METHOD**: each walk is timed end to end (`Date.now()` around
the walk); the two arms of a pair are walked **BACK TO BACK on the same seed** (shut first, armed
second), so scheduler and thermal drift are spread across both arms rather than concentrated in
one; the face is Σ wall seconds ÷ walks, and its paired Δ is published like any other.

⚠ **WHAT IT MEASURES AND WHAT IT DOES NOT.** The timed region is the **WALK**, not the engine
alone: the observer's own `laneOpenness` and `groundShellHazard` reads and the `performPass`
trace sit inside it **in EVERY arm**, so the **DIFFERENCE** is the priced chooser's cost and the
**LEVEL** is not the game's frame cost. It is a **MACHINE reading on one machine**, never a
portable number.

## §P8 THE GATES (frozen; a red gate is REPORTED, never patched, and ROUTES THE ARTIFACT)

`gWorld` · `gArmsIsolated` · `gSharedSeeds` · `gAnchoredConstants` · `gSeamSitesPinned` ·
`gWalkFixtures` · `gStrikeLedgerAgrees` · `gStrikeAttributionComplete` · `gJointPartition` ·
`gPriceFires` · `gArmsDiverge` · `gQuotationsFaithful` · `gGenomeClean` · **`gGeneValuePinned`** ·
**`gCompositionProof`** · **`gAlternativesLive`** · `gNonVacuous` · `gSrcUntouched` ·
`gSeedsBookedEqualWalked` · `gFaces` — **20 gates**.

1. ⭐⭐ **NO GATE THAT CANNOT FAIL** (#334 item 3). There is deliberately **no `gStatsZero`**: a
   hardcoded `true` is not a gate. Zero registry statistics are drawn anywhere in this file and
   the stats ledger is a **FIELD** (`stats.consumed = 0`).
2. ⭐⭐ **NO TAUTOLOGICAL GATE, AND NO GATE ON A DIRECTION.** `gPriceFires` is the corrected
   liveness form (#334 item 4); `gArmsDiverge` requires only that SOME paired cell differ inside
   each pair (a bite receipt); `gAlternativesLive` requires only that the DLC machinery DELIVER a
   non-zero lead somewhere in every arm. **No gate asks any face to move in any direction** —
   that is H-GC.2's business, and H-GC.2 is a VERDICT, not a gate.
3. **`gFaces` FROM DISK** covers every published face, every Δ point estimate, every stored bin
   table, the composition relations, both quotations **and the VERDICT ITSELF** (the four
   conjuncts are re-evaluated from the serialized faces and deltas and compared to the published
   verdict).
4. **BOOKED = WALKED FROM THE CELLS** (#335 item 4): `gSeedsBookedEqualWalked` derives both
   walked sets from the CELLS' own distinct seeds, checks the counts against the booked lists,
   checks the walk arithmetic, and checks every walked seed lies inside the authorized block and
   every composition seed is out-of-band scratch.
5. ⭐ **THE RED-ROUTING IDIOM, IN CODE** (#334 item 5): `outPath = ALL_GREEN ? OUT : OUT +
   '.RED.json'` is the instrument's own line, evaluated after `gFaces`.

## §P9 SEEDS, SIZING AND STATS

* **BLOCK 12,525,000–999**, opened by #345 item 5 and **consumed WHOLE of record**. The sub-band
  split, declared here:
  * ⭐ **the SCORED pair** = **12,525,000–159** (160 seeds × 2 arms = **320 walks**);
  * **the REPORTED plane pair** = **12,525,200–359** (160 seeds × 2 arms = **320 walks**);
  * **world-construction receipts** = **12,525,999**, one per arm (**4 constructions**).
  * **BOOKED = WALKED**: `gSeedsBookedEqualWalked` requires **644** against 160 distinct scored
    seeds and 160 distinct plane seeds.
* **OUT-OF-BAND SCRATCH ONLY** (canon: verifier scratch seeds): the COMPOSITION PROOF walked
  **900,000,300–302** (7 worlds × 2 trace states × 3 seeds = **42 walks**) and the SIZING SMOKE
  walked **900,000,400–439**. **No battery seed was walked before this freeze.**
* **SIZING, and what the smoke already showed — DECLARED HERE RATHER THAN EXPLAINED LATER.** On
  40 scratch seeds the paired Δ half-width on `groundStrikesPerMatch` was **3.8375** strikes per
  match. A cluster bootstrap's half-width falls like `1/√n`, so **160 seeds** gives ≈ **1.92**
  strikes per match. 160 is taken because the block must hold TWO paired batteries and is
  consumed whole either way.
  ⚠⚠ **AND THE SMOKE'S OWN Δ POINT ESTIMATES ARE DISCLOSED NOW, BEFORE THE BATTERY, BECAUSE I SAW
  THEM** (GC-T1 §DEV 1's form, commended at #345 item 3). On the 40 scratch seeds, scored pair:
  `groundStrikesPerMatch` Δ = **−2.775** [−6.825, +0.85] · `caromedGroundOnOpenLaneShare` Δ =
  **−0.007007** [−0.052126, +0.040643] · `groundPassesPerMatch` Δ = **−3.625** [−6.85, −0.325] ·
  `deliveriesPerMatch` Δ = **−2.975** [−5.85, −0.1] · `teammateStrikesPerMatch` Δ = **−2.15**
  [−6.125, +0.45] · `ledDeliveredShare` Δ = **+0.00009**. An earlier 3-seed smoke was also seen.
  **The conjunct FORMS above are ruling #345 item 5's, not mine, and NOT ONE OF THEM is re-cut**
  on the strength of that sight. If a conjunct fails on the battery, that failure is the result.
* **STATS CONSUMED: ZERO.** Every interval is a percentile bootstrap over the WALKED CELLS (the
  IN-T0 / DF-T2 / IN-T1 / BK-C1 / BK-C2 / GC-T1 precedent, #329 item 4), not a registry-consuming
  statistic. Next stats base remains ≥ **117,600**, registry of record **73**.

## §P10 HONEST LIMITS, STATED BEFORE THE BATTERY

1. ⚠ **NO CLAIM THAT THE CAROM DISAPPEARS** (contract §4): the price is a price, not a wall.
2. ⚠⚠ **THE ORDERED ARMS ARM BOTH DLC DOORS, AND THE FROZEN PRECEDENCE LAW MAKES THE K = 9 GRID
   STRUCTURALLY INERT IN THEM** (§P1c; measured at §P11's `G-PRECEDENCE`). The alternatives the
   SCORED verdict is about are therefore **the two-point contest's led candidates**. The grid
   door's own effect is the REPORTED pair's and is not scored.
3. ⚠⚠ **`o1PassWindup` KEEPS PRECEDENCE OVER THE LEAD ON THIS COMPOSITION** (§P11's
   `O1-WINDUP-PRECEDENCE`). World 11 arms `o1PassWindup`, and `PlayerBrain.decideOnBall`'s
   execution branch takes the wind-up FIRST, so a wound-up pass resolves through
   `armPendingPass`'s own aim (`{x: mate.pos.x, y: mate.pos.y}`) and carries **no lead at all**.
   A delivered re-aim on this composition rides the ONE-TOUCH BYPASS only. **This is the
   composition fact the canon's proof exists to find, and it is stated before the battery, not
   after the verdict.**
4. ⚠ **BOTH GENES ARE PINNED** (0.5 and 1). No ladder on either axis; other values are unmeasured
   and NAMED DOORS, not findings here.
5. ⚠ **THE USAGE SHARES ARE NOT DECLINE RATES** (§P2b — DLC-T1s's retraction rides in full).
6. ⚠ **THE CONTROLS CANNOT SEPARATE "NOT PRICED" FROM "NOT SUBSTITUTED INTO"** (§P5).
7. ⚠ **THE INTERCEPTION DECOMPOSITION IS TEMPORAL, NOT CAUSAL** (BK-C2 §P.7's own warning).
8. ⚠ **THE PERF FACE IS A MACHINE READING** (§P7), not a portable cost.
9. ⚠ **THE OPEN-LANE CUT IS BK-C2's EXTRACTION** of the chooser's literal (BK-C2 §CORR item 5),
   carried unchanged; the full lane histogram is stored so any other cut re-derives off disk.
10. ⚠ **THIS EXAM'S SHUT ARM IS NEITHER GC-T1's SHUT ARM NOR BK-C2's `w11` WORLD** (§P2). Every
    quotation from either is labelled DIFFERENT-BATTERY CONTEXT, and no Δ is computed across
    batteries.
11. ⚠ **NO SEASON LADDER** (§P6), so nothing here is a claim about evolution or about the shipped
    League.

## §P11 ⭐⭐ THE COMPOSITION PROOF — DLC × THE WORLD-11 STACK, BEFORE ANY SCORING

Canon's own form (copied verbatim at §CORRECTIONS-READ). Seven worlds are constructed and walked
to completion on the scratch seeds **900,000,300–302**, twice each (traced / untraced), and
compared by **WHOLE-MATCH SIGNATURE** (tick · score · phase · ball · **rng stream state** · every
body's pos/vel/heading/stamina — the CTB-T0 / DLC-T1 form):

| world | construction | relation |
|---|---|---|
| `base` | world 11, no DLC door, gene absent | the reference |
| `bothAbsent` | + BOTH doors, gene **ABSENT** | ≡ `base` — **G-BORN.bothDoors** |
| `bothZero` | + BOTH doors, gene **0** | ≡ `base` — **G-ZERO.contest**, DLC-T0 §LAW's own G-law (the gene has NO zero-dose semantics under this door: the candidate FORMS at 0 and loses every tie; #238's ARMED-ZERO ≡ ABSENT receipt) |
| `bothOne` | + BOTH doors, gene **1** — THE SCORED ARMS' WORLD | ≠ `base` — **G-BITE.bothOne** (⚠ an arming receipt, never an effect size) |
| `contestOnly` | + `dlcDeliveryChoice` ALONE, gene 1 | ≡ `bothOne` — ⭐⭐ **G-PRECEDENCE**, the frozen src law MEASURED |
| `planeAbsent` | + `dlcStrikePlane` ALONE, gene ABSENT | ≡ `base` — **G-BORN.planeAlone** (#243's PLANE-INERT ≡ ABSENT identity) |
| `planeOne` | + `dlcStrikePlane` ALONE, gene 1 — the REPORTED pair's world | ≠ `base` — **G-BITE.planeOne** |

Plus three relations over all seven:

* **LIFECYCLE** — no constructor refusal; `corridorArmedVersion` reads **11**; the contact ledger
  is all-zero at construction; the franchise `info.genome` carries NEITHER gene; the match runs
  to `finished`.
* **CANDIDATES-FORM** — in every armed composition the machinery actually **DELIVERS** a non-zero
  lead into a strike somewhere (candidate formation, not merely seat construction, measured off
  the SHIPPED `performPass` argument), and in every gene-absent / gene-zero composition it
  delivers **nothing**.
* ⭐ **G-LOCKSTEP** — the `performPass` trace is INERT: every world on every scratch seed produces
  a **byte-identical** whole-match signature traced and untraced (DLC-T1s's `lockstep` receipt,
  in this exam's own hands).
* ⭐⭐ **O1-WINDUP-PRECEDENCE** — the wind-up seat's own aim is displaced from the target's
  pre-step position on **exactly zero** decisions, in every world (§P10 item 3's measurement).

⚠ **THESE ARE ARMING RECEIPTS, NEVER FOOTBALL FINDINGS** (canon: receipts ≠ effect sizes), and
`gCompositionProof` is red if any relation fails.

---

<!-- ⛔ NOTHING ABOVE THIS MARKER IS EDITED AFTER THE FREEZE COMMIT. -->

# RESULTS

> Freeze `8481e18` → this commit. **20/20 GATES GREEN**, so the artifact sits at the **CANONICAL
> path** `docs/world-model/data/gc-t1b-alternatives-arm.json` (the red-routing branch was live and
> not taken). **644 battery walks** (160 seeds × 2 arms × 2 pairs + 4 world-construction
> receipts) **+ 42 composition-proof scratch walks**; `batteryWallSeconds` **75.447**.
> `gFaces` re-derived **176/176** face-and-Δ checks and **85/85** stored-bin /
> composition / quotation / **verdict** checks off the serialized artifact, 0 failures; **30/30**
> walk-side fixtures pass. `hashedBodySha256 = f6cf8262b3e803caa879e5aad686d245f421f6424e07d345dadaca6561bce207`.
> `strikeAttributionCompleteness` = **1** in ALL FOUR arms — ⚠ an instrument receipt, never a
> football finding.
>
> ⭐ **EVERY NUMBER BELOW IS A QUOTED ARTIFACT FIELD AT SOURCE PRECISION** (canon: doc-prose
> fidelity). No number in this section is computed here; where two faces are compared, both are
> quoted with their intervals and the comparison is stated in words.

## §R0 THE VERDICT, IN ONE LINE

**H-GC.2 FAILS AS A CONJUNCTION: (a) FAIL · (b) ⭐⭐ PASS · (c) FAIL · (d) FAIL — but the
FAILURES ARE NOT GC-T1's FAILURES, AND THE HEADLINE FLIPS.** With alternatives in the chooser's
hands, **the ground price stops buying its change by not passing**: (b) — GC-T1's headline fail,
the one that said 「别传了」 — **PASSES**, the volume holds inside its own band, and the joint
cells show the blocked mass **moving to the clear cells instead of vanishing**. And half of (a)
resolves for the first time: **the ground-strike COUNT falls resolvedly** (Δ **−2.15625**, **1.1558**
half-widths), where GC-T1's did not. What still fails: the stale-map SHARE does not move, the
teammate face misses its interval's upper edge by **0.05625** (GC-T1 missed by 0.0625), and the
CROSS control lands **0.0125** below its own band's lower edge. ⛔ **Reported exactly as frozen.
Nothing is re-cut.**

## §R1 ⭐⭐ THE COMPOSITION PROOF — TEN RELATIONS, ALL HOLD, AND TWO OF THEM ARE FINDINGS

`gCompositionProof` GREEN; 7 worlds × 2 trace states × 3 scratch seeds (**900,000,300–302**) =
**42 walks**, compared by whole-match signature. ⚠ ARMING RECEIPTS, NEVER FOOTBALL FINDINGS.

| relation | holds? | what it establishes |
|---|---|---|
| `G-BORN.bothDoors` | ✅ | world 11 + BOTH doors, gene ABSENT ≡ world 11 alone, byte for byte |
| `G-ZERO.contest` | ✅ | + BOTH doors at gene **0** ≡ world 11 alone — DLC-T0 §LAW's own no-zero-dose G-law reproduced at THIS composition (#238's ARMED-ZERO ≡ ABSENT) |
| `G-BITE.bothOne` | ✅ | the scored arms' world (gene 1) DIFFERS — the doors reach the chooser |
| ⭐⭐ `G-PRECEDENCE` | ✅ | **armed-both ≡ `dlcDeliveryChoice` ALONE, byte for byte.** The src law said "gated, not promised"; it is now gated. **⇒ THE K = 9 GRID IS STRUCTURALLY INERT IN THE SCORED ARMS** |
| `G-BORN.planeAlone` | ✅ | `dlcStrikePlane` alone + gene ABSENT ≡ world 11 alone (#243's PLANE-INERT ≡ ABSENT) |
| `G-BITE.planeOne` | ✅ | the reported pair's world DIFFERS — the grid reaches the chooser |
| `LIFECYCLE` | ✅ | no constructor refusal · `corridorArmedVersion` = 11 · ledger all-zero at birth · franchise `info.genome` carries NEITHER gene · every match runs to `finished` |
| `CANDIDATES-FORM` | ✅ | every armed composition DELIVERS a non-zero lead somewhere; every absent/zero composition delivers exactly nothing |
| `G-LOCKSTEP` | ✅ | the `performPass` trace is INERT — byte-identical signatures traced vs untraced, all 7 worlds × 3 seeds |
| ⭐⭐ `O1-WINDUP-PRECEDENCE` | ✅ | the wind-up seat's own aim is displaced from the target's pre-step position on **EXACTLY ZERO** decisions, in every world |

⭐⭐ **THE TWO PRECEDENCE RELATIONS ARE THE COMPOSITION FACTS THIS PROOF EXISTED TO FIND, AND
THEY NARROW WHAT THE VERDICT IS ABOUT** (both were declared at §P1c / §P10 item 3 before the
battery, not discovered after it):

1. **The alternatives the SCORED verdict tests are the two-point contest's LED CANDIDATES.** The
   dispatch ordered both DLC doors armed; the frozen src law makes the grid inert beside the
   contest, and that is now measured rather than quoted.
2. **On the world-11 stack `o1PassWindup` strips the lead off every wound-up pass.** The battery
   confirms it at scale: `altDisplacedShare` = **0** in ALL FOUR arms, over **7418 / 7100 / 7969 /
   7831** wind-up-seat decisions. A DELIVERED re-aim on this composition rides the one-touch
   bypass ONLY — which is why the delivered-lead shares at §R5 are small, and why **the
   alternatives act mostly through WHICH LINE IS PRICED AND CHOSEN rather than through where the
   ball is finally struck.**

## §R2 H-GC.2(a) — THE COUNT FALLS RESOLVEDLY; THE STALE-MAP SHARE DOES NOT ❌ (1 of 2)

| face | shut | armed | paired Δ | Δ ci95 | \|Δ\|÷hw | interval below 0? |
|---|---|---|---|---|---|---|
| ⭐⭐ `groundStrikesPerMatch` | **18.3875** [16.75, 20.325] (2942/160) | **16.23125** [14.90625, 17.6375] (2597/160) | **−2.15625** | [−4.15625, **−0.425**] | **1.1558** | ✅ |
| ⭐⭐ `caromedGroundOnOpenLaneShare` | **0.51273738** [0.49042504, 0.53556677] (1107/2159) | **0.49876543** [0.47579815, 0.5210858] (1010/2025) | **−0.01397195** | [−0.03905224, 0.01151973] | **0.5526** | ❌ |

**(a) FAILS BECAUSE IT IS A CONJUNCTION, AND THE HALF THAT PASSES IS THE ONE GC-T1 COULD NOT
RESOLVE.** ⚠ GC-T1's own reading is quoted as DIFFERENT-BATTERY CONTEXT (different world — no DLC
pair — and a different block, 12,524,000–159): there the same count face read Δ **−0.65625**
[−2.66875, 1.7375], 0.2979 half-widths. **Here the fall is Δ −2.15625 strikes a match with the whole
interval below zero.** No Δ is computed across the two batteries and none is implied.

The base rate moves the same way and again just misses: `groundCaromRate` **0.17077994**
[0.16377449, 0.17784711] → **0.16257225** [0.15523696, 0.17006962], Δ **−0.00820769**
[−0.01689049, **+0.00032008**], **0.9538** half-widths — falling, not resolved — the interval's upper edge is **+0.00032008**.

## §R3 H-GC.2(b) ⭐⭐ NON-SUPPRESSION PASSES — THE HEADLINE, AND IT IS A FLIP ✅

> Frozen band = **THIS EXAM'S OWN** shut arm's 95 % interval LOWER EDGE, **76.98125** ground
> passes per match. Armed point estimate: **77.85**.

| face | shut | armed | paired Δ | Δ ci95 | \|Δ\|÷hw |
|---|---|---|---|---|---|
| ⭐⭐ `groundPassesPerMatch` | **79.0125** [76.98125, 81.11875] (12642/160) | **77.85** [75.84375, 79.95] (12456/160) | **−1.1625** | [−3.00625, +0.69375] | **0.6284** |

**The armed arm plays 77.85 ground passes a match, ABOVE its own control's interval floor, and
the paired Δ does not resolve away from zero. (b) PASSES.** ⚠ GC-T1's (b), as
DIFFERENT-BATTERY CONTEXT: **72.86875 → 69.58125**, Δ **−3.2875** [−4.9125, −1.64375], **2.0115**
half-widths, out of its band — the conjunct that made #345 item 2's headline.

⭐⭐ **AND THE STORED JOINT TABLES SAY WHERE THE BLOCKED PASSES WENT — TO THE CLEAR CELLS.**
`jointLaneOpenByShellBlocked`, rows `[laneOpen, laneContested]` × cols `[shellBlocked,
shellClear]`, over every measured ground pass:

| arm | measured | open·blocked | open·clear | contested·blocked | contested·clear |
|---|---|---|---|---|---|
| `shut` | 12642 | **1481** | 6780 | 1976 | 2405 |
| `armed` | 12456 | **1240** | 6910 | 1899 | 2407 |

⚠ The numbers that follow are FIELDS of `reAimSignature.byPair[0]`, re-derived by `gFaces` from
the cells above: `cellDeltas` **[[−241, +130], [−77, +2]]** · `blockedColumnDelta` **−318** ·
`clearColumnDelta` **+132** · `measuredGroundPassDelta` **−186** · `deliveriesDelta` **−234**.

⭐⭐ **THE SIGNATURE, READ AGAINST ITS OWN PRE-REGISTERED RULE (§P6).** The rule frozen before the
battery: *a RE-AIM signature is blocked mass falling while the CLEAR column RISES and the delivery
volume holds; a SUPPRESSION signature is blocked mass falling with the clear column flat and the
deliveries falling too.* **The blocked column falls 318, the clear column RISES 132, and the
volume holds inside its band.** ⚠ GC-T1's own cells, as DIFFERENT-BATTERY CONTEXT: shut
**[[1447, 6365], [1772, 2075]]** → armed **[[1134, 6349], [1632, 2018]]** — there the clear
column FELL (6365→6349 and 2075→2018). **The clear column changed sign between the two
batteries.** ⚠⚠ It is a PARTIAL conversion, not a whole one: 132 of the 318 blocked lines come
back as clear ground passes, `deliveriesPerMatch` **84.21875** [82.3625, 86.20625] → **82.75625**
[80.9, 84.6625] (Δ **−1.4625** [−3.05625, +0.15], 0.9123 hw) still drifts down without resolving,
and no conjunct was frozen on the clear column — **this is the REPORTED signature, not a gated
face.**

⭐ **THE PHYSICS PER LINE CLASS IS UNCHANGED, so this is selection and not luck**:
`caromRateOnOpenLaneShellBlocked` **0.30587441** [0.28090659, 0.33096591] → **0.31532258**
[0.28387097, 0.34891217] and `caromRateOnOpenLaneShellClear` **0.09646018** [0.08978559,
0.10382676] → **0.08958032** [0.08303835, 0.09627598]. The price's own liveness census
`priceEvalNonZeroShare` falls **0.27345357** [0.26488562, 0.28255568] → **0.25200706**
[0.24271767, 0.260511], and `groundOpenLaneButShellBlockedShare` **0.11714919** [0.11090107,
0.12404625] → **0.09955042** [0.0942097, 0.10463897].

**REPORTED BESIDE (b), GATED BY NOTHING:**

| face | shut | armed | Δ ci95 |
|---|---|---|---|
| `passCompletion` | **0.58304833** [0.57468864, 0.59161641] | **0.58119464** [0.57290819, 0.58965048] | [−0.01203184, 0.00788274] |
| `possessionSpellSeconds` | **4.3482321** [4.2513643, 4.45312554] | **4.31681206** [4.22135345, 4.40656917] | [−0.13919753, 0.07230588] |
| `possessionFlipsPerMatch` | **48.66875** [47.4875, 49.8625] | **48.71875** [47.65625, 49.8875] | — |
| `flipsCaromLastContactShare` | **0.10581739** [0.09825694, 0.11308232] | **0.10493906** [0.09749047, 0.11268504] | — |
| `goalsPerMatch` | **3.35625** [3.09375, 3.63125] | **3.45625** [3.19375, 3.71875] | [−0.19375, 0.3875] |
| `shotsPerMatch` | **12.91875** [12.35625, 13.51875] | **12.675** [12.1, 13.29375] | — |

⭐ **THE HONEST OTHER HALF, AND IT IS DIFFERENT FROM GC-T1's**: there the team that passed less
kept the ball slightly better, and that was the consolation prize for suppression. Here nothing
in the possession family moves at all — completion, spell length and flip count are all flat.
**The price is no longer being paid for in volume, and it is not being paid for in possession
either.**

## §R4 H-GC.2(c) THE TEAMMATE FACE ❌ · H-GC.2(d) THE LOFTED CONTROLS ❌

| face | shut | armed | paired Δ | Δ ci95 | \|Δ\|÷hw |
|---|---|---|---|---|---|
| ⭐⭐ `teammateStrikesPerMatch` | **7.675** [6.7625, 8.84375] (1228/160) | **6.6875** [6.04375, 7.34375] (1070/160) | **−0.9875** | [−2.29375, **+0.05625**] | **0.8404** |

**(c) IS A NEAR MISS FOR THE SECOND TIME, AND IT IS REPORTED AS THE FAIL IT IS.** The interval's
upper edge is **+0.05625**; the frozen rule demands the whole interval below zero and it is not.
⚠ GC-T1 missed by **0.0625** on the same face — a different battery on a different world, quoted
as context and **not** used to re-size or re-cut anything here (§P5 froze that before the run).
The share form is flat: `strikeShareTeammateOfKicker` **0.40946982** [0.37556878, 0.44682927] →
**0.40362127** [0.37757597, 0.42922859].

⭐ BK-C2 §R1(iii)'s sharpest fact survives this composition too: the striking body's
`perpDistanceFromLineAtKick` median bin lower edge is **0.5** m in both scored arms (shut bins
**[1285, 592, 269, 206, 131, 90, 84, 56, 44, 41, 27, 15, 159]**, armed **[1009, 579, 275, 183,
100, 101, 83, 50, 39, 35, 27, 19, 151]**) — **the man who gets hit was still standing on the line
when the ball left, alternatives or no alternatives.**

| control | shut ci95 (the band) | armed point | inside? |
|---|---|---|---|
| `loftedDeliveriesPerMatch` | **5.20625** [4.8125, 5.56875] | **4.90625** | ✅ |
| ⛔ `crossesPerMatch` | **3.90625** [**3.60625**, 4.18125] | **3.59375** | ❌ (below the lower edge by **0.0125**) |

**(d) FAILS ON THE CROSS CONTROL BY 0.0125 CROSSES PER MATCH** — 625 crosses in the shut arm
against 575 in the armed arm over 160 matches each, Δ **−0.3125** [−0.66875, **+0.0375**], 0.885
half-widths, i.e. **not resolved as a movement and still outside the band**, because the band is
a LEVEL test on a tight interval. ⚠ GC-T1's crosses were **identical to eight figures** between
its arms; here they are not. §P5's declared limit rides in full: this conjunct tests that the
price is not APPLIED to the lofted family and **cannot separate that from "not substituted
into"** — and with the DLC pair open the argmax now has more ground candidates to substitute
toward, which is exactly the mechanism §P5 said it could not rule out. **Reported as the fail it
is; no predicate re-cut.**

## §R5 ⭐ REPORTED — THE ALTERNATIVES USAGE, THE INTERCEPTION DECOMPOSITION, THE PERF FACE

**THE USAGE SHARES** (⛔ usage, never a decline rate — §P2b's declared limit and DLC-T1s's
retraction ride in full):

| arm | `performPass` calls | to a support target | led strikes (non-zero) | `ledDeliveredShare` | `ledDeliveredShareSupportScoped` | mean delivered lead (m) | max (m) |
|---|---|---|---|---|---|---|---|
| `shut` | 11161 | 3906 | **176** | **0.0157692** [0.01345458, 0.01809584] | **0.04505888** [0.03880521, 0.05145414] | **6.03136369** | **16.618679** |
| `armed` | 10910 | 3923 | **163** | **0.01494042** [0.01242179, 0.01753084] | **0.04154983** [0.03478261, 0.04844912] | **6.2895577** | **13.994117** |
| `shutPlane` | 12018 | 4155 | **268** | **0.02229988** [0.01960946, 0.02498329] | **0.06450060** [0.05752106, 0.07153076] | **8.40891646** | **22.584362** |
| `armedPlane` | 11834 | 4256 | **245** | **0.02070306** [0.01800368, 0.02361111] | **0.05756579** [0.04996271, 0.06538735] | **8.58404039** | **23.889041** |

⭐ **THE STRIKE_GUARD IDENTITY HOLDS IN EVERY ARM**: `ledStrikesHandled === ledStrikesNonZero`
(176 = 176 · 163 = 163 · 268 = 268 · 245 = 245) — DLC-T1s's G-ARM receipt reproduced at this
composition. ⚠ An instrument receipt.

⭐⭐ **THE USAGE IS SMALL AND §R1 SAYS WHY**: `o1PassWindup` strips the lead off every wound-up
pass, so only the one-touch bypass can deliver one. The price does **not** change how often the
alternatives are delivered — `ledDeliveredShare` Δ **−0.00082877** [−0.00373624, +0.00212837]
(0.2826 hw), support-scoped Δ **−0.00350905** [−0.01150774, +0.00483096] (0.4295 hw). **So the
re-aim visible in §R3's joint cells is NOT the led ball being played more; it is the chooser
picking a DIFFERENT LINE from a menu the led candidates changed the pricing of.** ⚠ A labelled
reading of the numbers above, not a finding — this exam stores the joint tables and the delivered
leads, not the argmax's runner-up.

**THE INTERCEPTION DECOMPOSITION (BK-C2 §R4's form):**

| face | shut | armed | paired Δ | Δ ci95 | \|Δ\|÷hw |
|---|---|---|---|---|---|
| `interceptionsPerMatch` | **29.26875** [28.34375, 30.23125] | **28.625** [27.66875, 29.56875] | **−0.64375** | [−1.575, +0.3375] | **0.6732** |
| `interceptionCaromPrecededShare` | **0.35447363** [0.34034786, 0.36973138] | **0.34519651** [0.33145458, 0.3592042] | **−0.00927712** | [−0.02629556, +0.00893162] | **0.5267** |

⭐ **BOTH ARE NOW UNRESOLVED, AND THE COUNT NO LONGER FALLS.** ⚠ In GC-T1 the count fell
resolvedly (−1.44375 [−2.375, −0.5]) *because the passing fell with it*. Here the passing holds,
and so does the interception pile. A third of everything this engine scores as an "interception"
still has a body carom on the ball before it. ⚠ Temporal, not causal (§P10 item 7).

**THE PERF FACE (§P7's method):**

| arm | wall seconds total | walks | `wallSecondsPerMatch` |
|---|---|---|---|
| `shut` | **18.528** | 160 | **0.1158** [0.1140875, 0.117875] |
| `armed` | **18.871** | 160 | **0.11794375** [0.1155875, 0.12071875] |

Paired Δ **+0.00214375** s [−0.0004875, +0.00495625], **0.7876** half-widths — **not resolved**.
⚠ Read §P7 before quoting: the timed region is the WALK (observer reads and the `performPass`
trace included, in every arm), so the DIFFERENCE is the number and the LEVEL is not the game's
frame cost. It is a machine reading on one machine.

⚠ **ONE ANATOMY NOTE, BECAUSE A WIDE INTERVAL DESERVES ITS CAUSE.** `strikesPerMatch` (ALL
attributed strikes, ground and lofted and no-live-flight together) reads **25.675** [23.44375,
28.24375] → **28.49375** [24.03125, 34.40625], Δ **+2.81875** [−0.975, +7.25625], 0.6849 hw. The
`bySideTeammateOpponentNoFlight` split locates it: **[1228, 1771, 1109]** → **[1070, 1581,
1908]** — the growth is entirely in the **NO-LIVE-FLIGHT** bucket, and the per-seed cells show it
concentrated in ONE seed (**12,525,152**: 151 attributed strikes in `shut`, 386 in `armed`,
against a typical cell of ~26). That bucket enters **no scored face** — (a) and (c) both count
strikes attributed to a LIVE FLIGHT — and the cells are stored so the whole thing re-derives.
⚠ Reported, not excluded: no seed was dropped and no face was re-cut.

## §R6 ⭐ THE REPORTED PAIR — THE K = 9 GRID ALONE (IN NO CONJUNCT)

⛔ **NOTHING IN THIS SECTION IS PART OF H-GC.2.** It exists because §P1c's precedence law makes
the grid inert in the scored arms, and the commander's alternatives question named both doors.

| face | `shutPlane` | `armedPlane` | paired Δ | Δ ci95 | \|Δ\|÷hw |
|---|---|---|---|---|---|
| `groundStrikesPerMatch` | **21.04375** [18.41875, 25.35625] | **18.66875** [17.65625, 19.75] | **−2.375** | [−6.69375, +0.46875] | **0.6632** |
| `caromedGroundOnOpenLaneShare` | **0.45454545** [0.43437765, 0.47468628] | **0.47875108** [0.45780051, 0.5] | **+0.02420563** | [−0.00141452, +0.04990647] | **0.9433** |
| `groundPassesPerMatch` | **83.79375** [81.81875, 85.90625] | **82.85625** [80.65625, 85.10625] | **−0.9375** | [−2.64375, +0.75] | **0.5525** |
| `teammateStrikesPerMatch` | **7.4375** [6.85625, 8.04375] | **7.59375** [6.9625, 8.3125] | **+0.15625** | [−0.65625, +0.975] | **0.1916** |

Its joint cells: shut **[[1429, 6976], [2275, 2727]]** → armed **[[1301, 7133], [2115, 2708]]**,
`blockedColumnDelta` **−288**, `clearColumnDelta` **+138**, `measuredGroundPassDelta` **−150**,
`deliveriesDelta` **−133**. ⭐ **The same shape as §R3's** — blocked mass down, clear mass up,
volume roughly holding — on a world where the alternatives are the 9-grid rather than the
two-point contest, and with a delivered-lead share and a mean delivered lead both LARGER than the contest's
(⚠ compare the §R5 table's own fields; no ratio is computed here). ⚠ Four faces, one pair, no gate, **and no Δ is computed between the two pairs.**

## §R7 THE GATES

All twenty GREEN: `gWorld` (all four arms world 11, the DLC axis identical across the scored
pair) · `gArmsIsolated` (each pair's difference set is exactly `['bkGroundCorridor']`) ·
`gSharedSeeds` · `gAnchoredConstants` · `gSeamSitesPinned` (ONE GC fork, ONE pricer statement,
ONE hazard call, ONE definition, ONE `dlcDeliveryChoice` fork, ONE `dlcStrikePlane` fork, ONE
PRECEDENCE GUARD, ZERO of the three doors in `a4World.ts`) · `gWalkFixtures` (30/30) ·
`gStrikeLedgerAgrees` · `gStrikeAttributionComplete` (**1** in all four arms) · `gJointPartition`
· `gPriceFires` · `gArmsDiverge` · `gQuotationsFaithful` · `gGenomeClean` · **`gGeneValuePinned`**
(both genes by VALUE on both match-local views of both teams, every walked match; the DLC gene
read back through the shipped `passLeadSupportWeight` map on all four receipts) ·
**`gCompositionProof`** (10/10 relations) · **`gAlternativesLive`** · `gNonVacuous` ·
`gSrcUntouched` · `gSeedsBookedEqualWalked` · `gFaces`.

**THE SEAM'S OWN RECEIPT**: the production fingerprint
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` is unmoved, and
`bkGroundCorridor`, `dlcDeliveryChoice` and `dlcStrikePlane` are still named by no world and no
preset.

**PROVENANCE, COPIED FROM THE ARTIFACTS' OWN FIELDS** (the #345 item 1 standing order):
BK-C2's byte hash of record `84a78ea92d895a0f3fc5afbf1af61ae0704a0527188cea7adb4411dc553cdcba`
(this artifact's `quotedContext.bkC2.source.sha256`) · GC-T1's byte hash
`8c99601e1f0f5b7126c2cd9f736525b64734841e3462b4d9faa732c5127b59c2`
(`quotedContext.gcT1.source.sha256`) and GC-T1's own
`hashedBodySha256 = d5bdc4cf5dd3a7b4fb54f09aebc24414690063cfa5cc92cddde8b997ce8d246a`
(copied from `reAimSignature.gcT1Context.gcT1HashedBodySha256`, which the probe reads out of
GC-T1's artifact — **not** from a terminal).

## §R8 SEEDS AND STATS, AS CONSUMED

Block **12,525,000–999 CONSUMED WHOLE**: the SCORED pair **12,525,000–159** × 2 arms = **320
walks** · the REPORTED plane pair **12,525,200–359** × 2 arms = **320 walks** (booked = walked,
gated from the CELLS' own distinct-seed sets: 160 distinct seeds each, 160 paired rows) · the
**12,525,999** construction receipts, one per arm (**4**) — **644 total**. The COMPOSITION PROOF
walked the out-of-band scratch range **900,000,300–302** (**42 walks**) and the SIZING SMOKE
walked **900,000,400–439**; the bootstrap's own resample rng was seeded from **12,525,000**.
**STATS CONSUMED: ZERO** — every interval is a percentile bootstrap over walked cells; registry
of record stays **73**, next stats base ≥ **117,600**, next sim ≥ **12,526,000**.

## §DOUBTS (declared)

1. ⭐⭐ **THE VERDICT IS A CONJUNCTION AND IT FAILED; THE PATTERN OF FAILURE IS NOT THE SAME
   PATTERN.** (b) — the conjunct #345 item 2 made the headline of — passed, and half of (a)
   resolved for the first time. Nothing here says the bundle is ready; it says the mechanism
   named at #345 item 4 is **supported at the joint-cell grain**, on ONE composition, at ONE
   pair of gene values.
2. ⭐⭐ **THE RE-AIM READING IS A LABELLED HYPOTHESIS, NOT A FINDING** (有故事就要有探针). §R3's
   arithmetic — blocked column −318, clear column +132, volume inside its band — is consistent
   with *"the chooser now has a better ground line to move to, so it moves"*. But **this exam
   froze no probe of the argmax's runner-up either**: it stores the joint tables, the lane
   histograms and the delivered leads, not what the chooser compared. And §R5 shows the delivered
   lead share is FLAT between the arms, so whatever moved, it was not "the led ball got played
   more". The next probe of this story is the CHOICE TRACE, and it is unbuilt.
3. ⚠⚠ **TWO PRECEDENCE LAWS NARROW WHAT WAS ACTUALLY TESTED** (§R1): the K = 9 grid is inert
   beside the contest, and `o1PassWindup` strips the lead off every wound-up pass. **A world that
   wanted the alternatives DELIVERED rather than merely PRICED would have to resolve the wind-up
   seat's precedence — that is a NAMED, UNMEASURED door, and it is not this exam's to open.**
4. **(c) MISSED BY 0.05625, THE SECOND NEAR MISS IN A ROW.** GC-T1 §DOUBTS 3 said a future exam
   wanting this face should SIZE FOR IT rather than re-read the old one; #345 item 5 ordered no
   re-sizing, so none was done, and the face missed again. It is now a twice-observed near miss
   and still not a pass.
5. **(d) FAILED ON A LEVEL TEST WITH 0.0125 OF MARGIN**, on a control whose own declared limit
   (§P5) says it cannot separate "not priced" from "not substituted into" — and the DLC pair
   gives the argmax more ground candidates to substitute toward. The failure is real and the
   reading of it is limited by the conjunct's own construction.
6. **ONE COMPOSITION, TWO PINNED GENES, NO LADDER.** DV + GC double-arming remains unmeasured
   (contract §4), no weight ladder was walked on either axis, and no season ladder was run —
   nothing here is a claim about evolution or about the shipped League.
7. **THE PERF LEVEL ROSE WITH THE COMPOSITION** (0.1158 s/match here vs GC-T1's 0.1093625), which
   is the DLC seats' own cost plus this exam's extra trace — ⚠ a MACHINE reading across two runs
   on one machine, quoted as an order of magnitude and never as a portable comparison.
8. **THE 12,525,152 OUTLIER** (§R5) is stored, not dropped, and enters no scored face.

## §DEV — the deviations, declared

1. ⚠⚠ **THE SIZING SMOKE'S Δ POINT ESTIMATES WERE SEEN BEFORE THE FREEZE**, and were disclosed at
   §P9 in the freeze commit itself (GC-T1 §DEV 1's form, commended at #345 item 3). A 3-seed
   preflight smoke was also seen. **Not one predicate was re-cut** after either sight or after
   the battery.
2. ⭐⭐ **A SECOND, REPORTED-ONLY PAIR WAS ADDED TO THE DISPATCH'S ARMS** (§P1c, §R6). The dispatch
   ordered `dlcDeliveryChoice` + `dlcStrikePlane` armed together; the frozen src precedence law
   makes that world the contest armed alone, byte for byte (now measured at §R1's
   `G-PRECEDENCE`). The ordered arms were built EXACTLY AS ORDERED and carry the scored verdict;
   the plane-alone pair was added, pre-registered at the freeze, so the grid door's own behaviour
   is not silently absent from a report about alternatives. It is in NO conjunct.
3. ⭐ **THE GENE-WRITING IDIOM DEPARTS FROM DLC-T1's OWN `armGene`** (§P1b): match-local views
   only, `info.genome` never touched, because canon's dose-placement law requires it of every
   future dosing instrument and DLC-T1's probe predates #334 item 1. The checklist's substance is
   kept whole and read-back is through the shipped map.
4. ⭐ **GC-T1 §P2b's INSTRUMENT-FIDELITY GATE WAS NOT INHERITED** (§P2): this exam's shut arm is
   not BK-C2's `w11` world, so an overlap gate against BK-C2's intervals would have been a gate
   on a mismatch. BK-C2's and GC-T1's numbers are quoted as different-battery context and
   `gQuotationsFaithful` proves the quotation, not the reproduction.
5. **THE LIVENESS CONDITIONING DLC-T1s's §CORR REQUIRES IS NOT AVAILABLE HERE** (§P2b), because
   it needs a percept pull that could perturb the walk. The usage faces are published as USAGE
   shares with the retraction quoted, never as decline rates.
6. **NO WEIGHT LADDER, NO SEASON LADDER, NO ENTRY RUNG.** #345 item 5 ordered none of the three.
7. **`PROGRAMME.md` / the rulings file are NOT edited by this session** (executor iron rule:
   governance files are the commander's). The queue's status line, the verdict of record and the
   next dispatch are the commander's to write.

## §人话 — 给他别的线可以选,他就不是「别传了」了

> ⚠ **先说钟**(#339 立的双钟法条):我们一场球显示钟走满 90 分钟,按 sim 秒直读只有 240 秒
> (1 sim 秒 = 22.5 显示秒)。下面所有「每场几次」都按**我们这一场**读,也就是显示钟的一场
> 90 分钟。占比类的数换钟不变。
>
> 上一轮(GC-T1)我们让传球为它路上要撞到的身体扣分,结果是**他学会了别传**。这一轮两个世界
> 还是只差那一个价格,但**两边都先给了他"别的线可以选"**(两个早就做好、一直没开的门:
> 带球路线的第二个候选点、和以此为中心的 9 格射线网)。同一批 160 个种子,两边各踢一遍。

### 一、上次最扎心的那条 —— 这次没发生 ✅

上次每场地面传球从 **72.86875** 掉到 **69.58125**,**掉出了对照区间**,而且少掉的球哪儿也没去。

这次:**79.0125 → 77.85**,对照区间的下边缘是 **76.98125** —— **在里面。** 传球量没塌。

更要紧的是**少掉的那些"线上有人挡着"的球去哪了**:挡着的那一列少了 **318** 次,而**干净的
那一列多了 132 次**。上次这一列是**往下走的**。也就是说:这次他确实**换了条线传**,不是
不传了 —— 虽然只换回来了三分之一多一点,整体出球还是轻微往下飘(每场 **84.21875** → **82.75625**,
没量准)。

### 二、你抱怨的「弹身体」 —— 这次真的降了(一半)

每场撞身体从 **18.3875** 次降到 **16.23125** 次,**这个降幅是结实的**(区间整段在零以下)。
上次同一个数的 Δ 只有 **−0.65625**,压根没量准。

但另一半还是没动:**真的弹了的那些球里,有多少是「老图说这条线是通的」**,从 **0.51273738** 到
**0.49876543** —— 几乎没变。**按出手前定死的规矩,这一条算没过。**

### 三、撞自己人 —— 又差一点点

每场从 **7.675** 到 **6.6875**。方向对,但区间上边缘是 **+0.05625**,差 0.05625 就整段在
零以下。**上一轮差 0.0625,这一轮差 0.05625 —— 连着两次差一点点。** 我们不会因为「差一点」
就改规矩,也没有为它重新算过样本量(这一轮的派单没让我们算)。

### 四、传中被误伤了 —— 这次是真的 ❌

每场传中 **3.90625 → 3.59375**,对照区间的下边缘是 **3.60625** —— **差 0.0125 掉出去了**
(160 场里少了 50 次)。吊传还在区间里。这一条我们特意设成"这个价格不许碰高空球",这次它
碰到了边 —— 但要说清楚:**这条规矩本来就分不清"被扣分了"和"他改去传地面球了"**,而这一轮
恰恰是我们给了他更多地面选项。

### 五、⚠ 两条我们出手前不知道、这一轮量出来的机制事实

1. **两个门一起开 = 只开了一个。** 引擎里写死的优先级:两点候选在,9 格网就不生成。所以
   派单说的"两个门都开",实际上就是"两点候选那个门"。我们**量了它**(整场逐字节一样),
   并且**另外单跑了一对只开 9 格网的**,只报告、不进判定。
2. **11 号世界的"传球引拍"会把这个"换点"扣掉。** 引拍一旦成立,球就按"队友脚下"那个点出去,
   路上算好的偏移丢了。所以真正把"换的点"踢出去的,只剩一触球那条路 —— 全场 11161 次传球
   里只有 176 次。⭐ **这说明这一轮的"换线"不是"他更爱传提前量球了",而是"菜单变了,他挑了
   另一条线"。**

> **一句话收尾**:上一版的毛病是**他学会了别传**;这一版**他没有少传,他换了线** ——
> 「弹身体」的次数也第一次结实地降了。但四条里还是只过了一条,**没到可以给你上线的程度**:
> 老地图那条占比一动不动,撞自己人又差一点点,传中被蹭到了。⛔ **这一版什么都没上线**,
> 你现在玩的那个世界一个字节都没动。
