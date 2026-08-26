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

*(written by the results commit, from the committed artifact's own fields)*
