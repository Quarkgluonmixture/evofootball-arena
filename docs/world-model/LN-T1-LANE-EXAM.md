# LN-T1 — 「让眼睛来站位」 THE LANE EXAM（眼睛能不能把挤人和弹回压下去，而且不弄坏别的东西）

> **STATUS at this commit: RESULTS.** §0, §P and §DEV-PREFLIGHT below are frozen **BEFORE any
> battery seed is walked**, together with the complete instrument
> [`scripts/probes/ln-t1-lane-exam.ts`](../../scripts/probes/ln-t1-lane-exam.ts). The results
> sections are written in the SECOND commit, and between the two the instrument is
> **byte-identical** (`git diff FREEZE..RESULTS -- scripts/probes/ln-t1-lane-exam.ts` EMPTY).
> ⛔ **§P is never edited after sight.** If §P turns out to be wrong once the numbers are in, a
> **§DEVIATIONS** entry records it; the frozen text stands.
>
> canon, VERBATIM: *"freeze the instrument commit BEFORE the battery; artifact records the
> instrument hash"* (home: ruling #266.3(c), via [`CANON.md`](CANON.md)).

**在说人话的层面**：用户说 12 号世界还是「有人挤人」「传到人身上弹回」。上一步的普查
（LN-C0）已经证明这两件事都出在**决策层**，不是阵型表格。这一步问的是：把**感知式无球
跑位**（球员用自己眼睛看到的东西决定往哪站）打开，这两件事会不会下去？会不会顺手弄坏
别的？⛔ 这一步**什么都不上线**，只出一张表和一句冻结的话。

---

## §0 WHAT THIS IS AND WHY

### THE RULING (COMMANDER RULING #389 item 4, quoted)

> **LN-T1 DISPATCHED — 「让眼睛来站位」 THE LANE EXAM** (a T1 exam; the OBM-T1 / BQ-T1 form;
> X-SRC-ZERO — the seam, the flag and the genome door all exist; definitions frozen at the
> executor's §P). (i) ARMS, FIVE, PAIRED on shared seeds, all on world 13's EMPTY-BOOK
> composition (LN-C0's E13, the read of record: `a4MatchFlags(13)` + `armA4World(m, null, 13)`):
> **ABSENT** (E13 as it is) · **ARMED-ZERO** (`obmMovement: true` + the all-zero 16-weight matrix
> on ALL THREE genome views of BOTH teams — must be byte-identical to ABSENT on every seed,
> whole-match signature rng state included: FLAG-HYGIENE) · **MARKER-ESCAPE** · **SPACE-SEEK** ·
> **KITCHEN-SINK** (OBM-T1's own matrices, ±1 corners of the frozen signed domain, COPIED BYTE
> FOR BYTE from `scripts/probes/obm-t1-policy-exam.ts` with an anchor gate on the copy;
> `ctbSupportPlane` never passed). D13 is NOT walked — the entry rung, if one is named, walks the
> chosen dose on the form the user plays as its own pin. (ii) PRIMARY RULERS, paired Δ vs ABSENT,
> DOWN resolved = helpful: **R1** 撞车 = LN-C0's `crowd.crashShare` (E13 0.467745; PT-C0's limb
> byte for byte, DUP_RUN_M 4 / SAMPLE_EVERY 10 anchored) · **R2** the visible 「弹回」 = LN-C0's
> `firstBody.ownNonTarget` (E13 0.104711; the `ball.lastTouch` first-body channel).

The rest of item 4 — the secondaries, the guards, the band, the five frozen reads and the gate
set — is the specification §P below implements clause by clause, and item 4's own wording is
quoted at each clause rather than paraphrased.

### THE REASONS (#389 item 3, quoted in the two sentences that bind this exam)

> ⭐ **ONE DOOR, NOT TWO**: `obmMovement` ALONE — `ctbSupportPlane` is NEVER passed (OBM-T1's
> two-doors declaration kept, asserted per arm). The audit's literal words were "arm obmMovement
> + ctbSupportPlane"; the census's crowd read makes the static plane the WRONG door — CTB-T1
> (#226) disqualified two static doses for CLUMPING, the very face this exam must move DOWN — and
> the dynamic policy the right one (guard-clean, the only recorded decreases). The deviation from
> the audit's words is stated here, once.

> ⚠ OBM's four features read OPPONENTS and the body's OWN reading age — none reads a TEAMMATE;
> whatever thinning the policy buys is bought INDIRECTLY (widening, dropping off a congested
> target). That is a labelled limit of the seat, not a reason to withhold the exam: the record
> shows it moved the face.

### THE BASELINES (#389 item 2, quoted by field name)

The ABSENT arm of this exam is LN-C0's **E13** arm re-walked, so LN-C0's committed levels are the
levels this exam expects to reproduce. Quoted from the ruling by field name:
`lane.passesWithOccupantShare` **0.328098** · `lane.occupantsPerPass` **0.390020** ·
`crowd.crashShare` **0.467745** · `firstBody.ownNonTarget` **0.104711** ·
`crowd.dupRunPairsPerSample` **0.676866** · `context.goalsPerMatch` **3.237475** ·
`context.shotsPerMatch` **12.409820** · `context.passCompletion` **0.587186** ·
`context.ownedBallSampleShare` **0.336958**. ⭐ **G-REPRO-LNC0** does not assert those numbers —
it RE-WALKS LN-C0's own first twelve seeds on this exam's ABSENT arm and matches the committed
`perSeedCells[].E13` rows **field for field**, which is a stronger statement than any level.

### THE RECORD THIS DOSE FAMILY COMES FROM (#389 item 3, quoted)

> the record of OBM-T1 (#230) holds the ONE dose family that ever moved the user's first
> sentence's own face in the right direction with every guard held — `spacingUnder4` DOWN
> resolved at MARKER-ESCAPE (−0.002623 [−0.004373, −0.000889]) and KITCHEN-SINK (−0.005513
> [−0.007308, −0.003776]) at N = 356, SPACE-SEEK −0.0115 at smoke grain; offside a resolved
> DECREASE at KITCHEN-SINK (−0.252809); no breach on any limb at any dose.

⚠ Those are **OBM-T1's** numbers on **OBM-T1's** world (a bare percept-armed match), quoted as
the reason the three corners were chosen. They are **not** predictions for this exam and nothing
below is compared to them: this exam walks **world 13's** composition, so its ABSENT level is a
different level and only its own paired Δ is read.

### WHAT THIS EXAM IS NOT

⛔ It **arms nothing for the user**. The `obmMovement` flag stays **default OFF**, world 13's
bytes are untouched, and no file under `src/` or `tests/` is created or edited (**X-SRC-ZERO**,
gated). ⛔ It does not walk **D13**, the dosed form the user plays (#389 item 4(i)): the entry
rung, if one is named, walks the chosen dose on that form **as its own pin**. This exam's
question is whether the policy moves the two faces **at all**, and that must be read against
**one** composition — LN-C0's E13, the read of record. ⛔ It is not a supply exam: #389 item 3
records that the supply exams are of record and FAILED, and says this is *"a different question
and a different ruler"*.

---

## §P THE FREEZE — every definition, arm, ruler, guard, tolerance, read literal, seed and
## sizing rule, fixed BEFORE any battery seed

### §P.A THE FIVE ARMS — paired on shared seeds, the world's own composer CALLED

Every arm is built on **world 13's EMPTY-BOOK composition**, which is LN-C0's `buildMatch(seed,
'E13')` **byte for byte**: `new Match({ seed, teamA, teamB, ...a4MatchFlags(13) })` followed by
`armA4World(m, null, 13)`. ⭐ **The composer is CALLED; the flag set is never copied.** The team
construction (`randomGenome(new Rng(seed*2+1))` / `randomSquad`) is LN-C0's, byte for byte —
G-REPRO-LNC0 depends on it.

| arm | construction | matrix |
|---|---|---|
| **ABSENT** | E13 exactly as LN-C0 walked it — **the control** | none (`offballMovementWeights` absent on every view) |
| **ARMED-ZERO** | E13 **+ `obmMovement: true`** in the MatchConfig, then the matrix written | the **all-zero** 16-weight matrix on **all three genome views of BOTH teams** |
| **MARKER-ESCAPE** | E13 + `obmMovement: true` + matrix | `matrix([O_DEPTH, F2, MAX], [O_WIDTH, F2, MAX])` |
| **SPACE-SEEK** | E13 + `obmMovement: true` + matrix | `matrix([O_WIDTH, F3, MAX], [O_DEPTH, F3, MIN])` |
| **KITCHEN-SINK** | E13 + `obmMovement: true` + matrix | all sixteen slots at a domain corner: depth MIN · width MAX · support MAX · run MIN, for every feature |

* **THE MATRICES ARE BYTE-COPIED** from `scripts/probes/obm-t1-policy-exam.ts` — the
  `matrix()` / `IDX` / `F1..F4` / `O_DEPTH..O_RUN` / `ZERO_MATRIX` idiom and the three dose
  lines, each an **anchored needle with a want-count and a line receipt** (§P.F, `gAnchoredConstants`).
  `OBM_WEIGHT_MIN` / `OBM_WEIGHT_MAX` / `OBM_WEIGHT_SLOTS` / `OBM_FEATURE_KEYS` /
  `OBM_OUTPUT_KEYS` are **IMPORTED from `src/evolution/genome.ts`**, never typed.
* **⭐⭐ G-DOSE-COPY** re-derives every matrix **from those exports** by a **second,
  independently shaped sweep** (a full output × feature fill from a per-arm rule) and compares
  **slot for slot**, and asserts every non-zero entry is a **domain corner** and every matrix is
  `OBM_WEIGHT_SLOTS` long.
* **⭐⭐ THE ARMING IDIOM** is OBM-T1's `armMatrix`, copied: the matrix is written on
  `t.info.genome`, `t.baseGenome` and `t.effGenome` of **both** teams (3 × 2 = 6 views).
  ⚠ **DECLARED, NOT HIDDEN:** the house dose-placement canon (*"dose NEVER in info.genome"*,
  #270.2 / #334 item 1) is **superseded for this one channel by #389 item 4(i)**, which names
  *"the all-zero 16-weight matrix written on ALL THREE genome views of BOTH teams"* in terms. The
  16-slot `offballMovementWeights` matrix is therefore the **one** gene channel this exam writes
  on `info.genome`; `gWorld` still asserts that every **scalar** RA / corridor / RC / CTB / OBM
  gene is absent from `info.genome` on every walked match.
* **⭐⭐ THE TWO-DOORS DECLARATION, ASSERTED PER ARM:** `ctbSupportPlane` is **NEVER passed in
  any arm**, so the policy's intercept is a hard 0 and what is dosed is the **dynamic term
  alone** on the incumbent `supportSpot` geometry as its zero point. This is read off a
  **constructed match object** of each arm (the construction receipt at scratch seed
  900,003,570), never off the intent that built it.
* **⭐⭐ FLAG-HYGIENE:** ARMED-ZERO must be **byte-identical to ABSENT on every battery seed** —
  every stored row field **and** the whole-match signature **including the rng stream state**.
  The excluded fields are `obmFlag`, `matrixOnAllViews`, `policyCacheEntries`, LN-C0's
  `seamsAbsent` config echo and `wallMs`: the arm's own definition, its code-path receipts and a
  machine timing. **Excluded and stated, never quietly dropped.**

### §P.B THE POPULATIONS, THE RULERS AND THE SECONDARIES

Every population, predicate, corridor test, designation read and crowd limb is **LN-C0's, copied
byte for byte and anchored at its own source line**; §P does not restate them — the authoritative
statement is [`LN-C0-LANE-CENSUS.md`](LN-C0-LANE-CENSUS.md) §P.B, and this instrument's
`definitions` block quotes the same words. What is frozen HERE is which of them are **scored**.

| ruler | field | direction | what it is |
|---|---|---|---|
| **R1 撞车** | `crowd.crashShare` | **DOWN resolved = helpful** | the share of sampled attacking ticks whose **minimum pairwise** outfield distance is under `DUP_RUN_M` = 4 m (PT-C0's limb, `SAMPLE_EVERY` = 10, open play, attributable side) |
| **R2 THE CAROM** | `firstBody.ownNonTarget` | **DOWN resolved = helpful** | the share of measured ground passes whose **first body** (the `ball.lastTouch` channel) is an own outfielder who is **not** the target |

**RESOLVED** = the **95 % cluster-bootstrap interval of the paired Δ excludes zero**. `down` =
`ciHi < 0`; `up` = `ciLo > 0`. Both are **stored booleans**.

**SECONDARY — published, NEVER gating:** `lane.passesWithOccupantShare` ·
`lane.occupantsPerPass` · `crowd.dupRunPairsPerSample` · the **occupant composition by cause**
and the **carom by cause** under **each arm** (LN-C0's L1 / L2 / L3a / L3b / L4 with its frozen
precedence, **plus** the fourth licence below) · the **pair composition** P1..P5 · and
**`spacingUnder4` in OBM-T1's own form beside R1** (both stored).

⚠ **UNIT WARNING, FROZEN HERE:** `crowd.crashShare` is a **per-sampled-tick** share whose
denominator is *attributable sampled ticks*; `guard.spacingUnder4` is a **mean of per-match PAIR
shares** whose denominator is *matches*. They are two faces of one sentence and they are **never
added, never compared as levels, and never described in the same unit**.

#### ⭐⭐ THE FOURTH LICENCE — L1w, and where it sits

LN-C0 §COMMANDER CORRECTIONS item 1 recorded that `MakeRun` has a **third push that needs no
team-set licence** — the one-two burst gated on `p.wallRun` — so a body carrying that licence
read as **L4** in LN-C0's five-class ladder. #389 item 4(ii) requires it read out here.

* **THE PREDICATE (frozen):** `p.wallRun !== null && simTime < p.wallRun.until` — the **licence
  window**, read off `Player.wallRun`, whose **one write** is `src/sim/mechanics.ts`
  (`passer.wallRun = { until: match.simTime + 2.3, partnerGid: mate.gid }`, anchored).
  ⚠ The brain's own **burst** gate is the narrower `simTime < until − 1.1` (also anchored). This
  class reads the **LICENCE**, not the burst, and **says so** — so **L1w is an UPPER BOUND** on
  bodies actually bursting.
* **⭐⭐ WHERE L1w SITS:** in a **SECOND, PARALLEL precedence `L1 > L1w > L2 > L3a > L3b > L4`**,
  stored **beside** the five-class composition on the **same denominator** and **never folded
  into L1**. A body already carrying a **team-set** designation stays **L1** (the engine's own
  ledger is still read first, per the engine-ledgers canon); an **undesignated** body whose
  licence is live becomes **L1w**; everything else falls through unchanged.
  `gWalkFixtures` proves the two ladders agree **exactly** wherever no licence is live, and
  `gFaces` proves both ladders sum to the **same** occupant count and the same carom count.
* The **raw incidence** (`lane.wallRunLiveOccupantShare`, live-licence occupants ÷ all occupants,
  **before** any precedence) is stored beside, so L1w's precedence loss is visible.

### §P.C THE GUARDS, THE OFFSIDE FLAG AND THE WORLD-13 DO-NO-HARM BAND

**THE TOLERANCE FORM (frozen, and never typed as a decimal):**
`tolerance = NI_FRACTION · |control level|`, with `NI_FRACTION = 1 − 0.275/0.380` — PM-T1 §5,
inherited from A4-S2P1-VECTOR-CENSUS §4. The **expression** is copied from OBM-T1's own probe
line and that line is **anchored** with a want-count; the decimal is never written down.
**BREACH = resolved AND beyond tolerance IN THE HARMFUL DIRECTION.** A breach **disqualifies**
the arm.

| guard | field | direction | harmful |
|---|---|---|---|
| interceptions per match | `guard.interceptionsPerMatch` | **ceiling** | Δ > +tolerance |
| median pair spacing | `guard.spacingMedian` | **floor** | Δ < −tolerance |
| out-of-possession y-spread | `guard.spreadYOut` | **floor** | Δ < −tolerance |

**THE GUARD ARITHMETIC IS OBM-T1's, COPIED** (each fold anchored): `spreadYOut` = the sd of
outfield y positions for the side **not** in possession, meaned within a match; `spacingMedian` =
the **median** same-side outfield **pair** distance over the match's pairs, subsampled every
`PAIR_SUBSAMPLE` = 6 guard samples; `spacingUnder4` = the share of those pairs under
`CLOSE_PAIR_M` = 4 m. Each is a **per-match** value, then **meaned over matches** (OBM-T1's own
fold) — the denominator is **matches**, and the unit name says so. They are read at **LN-C0's own
already-anchored sample site** (`tick % SAMPLE_EVERY === 0 && playing`) and — unlike the crowd
limbs — are **ungated by possession**, on **both** teams, exactly as OBM-T1 reads them.

**THE OFFSIDE LIMB, in the #157 FLAG form:** `guard.offsidesPerMatch` is stored per arm; a
**resolved INCREASE raises a FLAG and flips no gate**. It enters neither `breach` nor
`disqualified`.

**⭐⭐ THE WORLD-13 DO-NO-HARM BAND** on LN-C0's own context faces, the **same** tolerance form
(control level = this exam's own ABSENT arm), with the harmful direction frozen per face:

| band face | harmful direction | why |
|---|---|---|
| `context.goalsPerMatch` | **BOTH** | the exam claims **no effect** on goals, so either direction beyond tolerance is a violation |
| `context.shotsPerMatch` | **BOTH** | same |
| `context.passCompletion` | **DOWN** | a completion drop is harm |
| `context.ownedBallSampleShare` | **DOWN** | a possession drop is harm |

**THE A4-S2P3 EQUILIBRIUM BAND IS OMITTED, and the omission is stated.** #389 item 4(iii) allows
either publishing it as context with its exclusion rule or omitting it; world 13's ABSENT arm
sits outside its goals row **by construction**, so every row would carry an exclusion note and no
reader could use it. The world-13 do-no-harm band above, built on **this exam's own** control
levels, is the band of record.

### §P.D THE ESTIMATOR

**CLUSTER BOOTSTRAP over the SHARED seeds** (clusters = seeds, **2,000 draws**, rng seeded from
the block base **12,545,000**) — LN-C0's estimator. All five arms of a seed move together inside
every draw, so **every interval is PAIRED by construction**. Point estimates are
**ratio-of-sums**, so every headline re-derives from the stored per-seed cells.

**LEAVE-ONE-OUT flip counting** on every paired Δ, reported for R1 and R2 on every dose arm (the
#346/#348 orders): drop each seed, re-derive the **point** Δ, and count a **FLIP** when the frozen
DOWN (or UP) verdict changes with the interval **shifted** by that seed's influence. ⚠ **THE
CONSERVATIVE POINT-SHIFT FORM** — stated, never hidden. It is a **receipt**; it gates no direction.

**⭐ ZERO STATS CONSUMED.** Registry **74** at this freeze; the stats floor stays ≥ **117,600**.

### §P.E SEEDS AND SIZING

* **Block 12,545,000–999** (#389 items 4(vi) and 7 — the frontier of record at #389 is
  `next sim ≥ 12,545,000`, and this block opens at this freeze). Battery
  **12,545,000–12,545,997** (**N_FROZEN = 998 shared seeds**, each walked **once per arm**, in
  **each of the two X-DET passes** ⇒ **9,990 exam walks booked = walked**); construction receipt
  **12,545,999**; the **unwalked tail is DECLARED**: seed **12,545,998**, stored in the `seeds`
  block.
* **Scratch band 900,003,500–599** (out of band, ≥ 900,000,000 — canon, VERBATIM: *"verifier
  scratch walks use the stage's own consumed band or the out-of-band scratch range (≥
  900,000,000) — never the next virgin block"*): the **12-seed sizing smoke** 900,003,500–511 ·
  the smoke receipt **900,003,520** · the **delivered-dose read** **900,003,540** · the **world
  pin** **900,003,570** · the **lockstep pair** **900,003,590–591**.
* **⭐ RE-WALKS, NOT CONSUMPTION: 12,544,000–011** — LN-C0's own first twelve battery seeds,
  re-walked on this exam's ABSENT arm for **G-REPRO-LNC0**. Block 12,544,000–999 is LN-C0's,
  consumed whole of record; nothing here consumes it a second time.
* **THE SIZING RULE (the house form LN-C0 used), frozen:**
  `se(n) = hw(n)/z.975` · `se(needed) = |target|/(z.975 + z.80)` ·
  `N = ceil(n · (se(n)/se(needed))²)` · `MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975`.
  **DECLARED TARGETS on the paired Δ: R1 0.02 absolute · R2 0.01 absolute.** The variance input is
  the disclosed 12-cluster scratch smoke's **realised paired-Δ half-width at the CEILING arm
  (KITCHEN-SINK)** — the arm with the largest expressible movement, so the sizing is done against
  the noisiest contrast the exam can produce. **N_FROZEN is the largest N the block affords after
  the construction receipt**; if the required N exceeded that, N would be the block's affordance
  and the MDE at N published. Which of the two happened is a **stored** field
  (`sizing.whichHappened`), and the required N and MDE(N_FROZEN) are published either way.

### §P.F THE GATES (all liveness / receipt — **NEVER direction**; all stored)

The house set — **`xDet`** (the WHOLE core, battery + construction receipt, walked twice from
scratch; the two digests byte-identical, `wallMs` the one excluded field and it is named) ·
**`xFpProd`** (the production fingerprint recomputed in-probe through the shipped
`League` / `runHeadless` path; the baseline **extracted** from OBM-T1's own anchored probe line,
never re-typed) · **`gSrcUntouched`** (`git diff --stat HEAD` **and** `git status --porcelain`
over **`src/` AND `tests/`**, all empty) · **`gSeedDisjoint`** · **`gSeedsBookedEqualWalked`** ·
**`gN`** · **`gFaces`** (every face, every paired Δ, every stored bin, every median, every
partition, every guard/band/offside verdict, every selector boolean, every read word, the dose
copy and every sizing row, re-derived off the **SERIALIZED artifact on disk**) ·
**`gReadWords`** · **`gHashOrder`** (`allGreen` **inside** the allowlist; a **non-body**
`receipts.hashReproducesFromFile`) · **`gTwoFractions`** (every face carries its own numerator
and denominator and its value is exactly their ratio) · **`gLoo`** · **`gLockstep`** ·
**`gWorld`** · **`gAnchoredConstants`** · **`gWalkFixtures`** · **`gClassesNonVacuous`** ·
**`gCrowdArithmeticReproduces`** — **PLUS**:

* **`gFlagHygiene`** — ARMED-ZERO ≡ ABSENT on **every** seed, whole-match signature with rng
  state; **0 differing fields**.
* **`gArm`** — on every seed of every **armed** arm the matrix is present and full-length on
  **all three genome views of both teams**, the `obmMovement` flag is on, and ⭐ **the seat is
  REACHED**: the counter is **`(match as { obmPolicies: Map }).obmPolicies.size` read at full
  time** — the match's own policy cache, whose **only** writer is the single `obmMovement` fork
  in `PlayerBrain.decideOffBall` (both anchored) — and it is **> 0 on every armed seed**. On the
  ABSENT arm the flag is off, no matrix is on any view, and the cache is **empty on every seed**.
* **`gBlindWorld`** — world 13 is **percept-armed** (`edsPerceivedChoice` is in
  `A4_WORLD_FLAGS`, anchored), asserted TRUE on every **constructed** match of every arm and on
  every walked match; and the **delivered-dose read** publishes the **snapshot-seen share** and
  the **four feature means** per arm and requires them non-degenerate. ⚠ That read runs on its
  **own declared out-of-band seed**, one match per arm, because asking the seat again advances
  the body's percept memory; it is **descriptive only** — no exam row, no CI and no gate LEVEL
  comes from it.
* **`gDoseCopy`** — above.
* **⭐ `gReproLnc0`** — LN-C0's seeds **12,544,000–011** re-walked on the ABSENT arm and matched
  **field for field** against the committed `perSeedCells[].E13` rows of
  `docs/world-model/data/ln-c0-lane-census.json`. **Every field LN-T1 also computes is
  compared**, with **`wallMs` the one exclusion** (a machine timing, not a world quantity),
  and **0 mismatches** are required.
* **`gAnchoredConstants`** carries **G-ANCHORS**: `DUP_RUN_M` · `SAMPLE_EVERY` ·
  `DV_CORRIDOR_SCALE` · `DV_CLEAR_RADIUS` · `CONTROL_RADIUS` · the `obmMovement` fork's **three
  read sites** (the one brain fork with its two score sites; the executor's
  `SupportBallCarrier` plane READ and APPLY) · the **four `MakeRun` push sites**
  (the licensed run · the one-two burst *"bursting for the one-two return"* · the overlap
  *"overlapping outside the carrier"* · the keeper-up corner) · the **`p.wallRun` write** in
  `src/sim/mechanics.ts` — each an **anchored needle with a want-count and a line receipt**,
  never a first-occurrence.

### §P.G THE READS — FIVE FROZEN LITERALS on STORED booleans

**THE SELECTOR RANGES OVER THE THREE DOSED CORNERS ONLY** (MARKER-ESCAPE · SPACE-SEEK ·
KITCHEN-SINK). ARMED-ZERO is the **identity arm**: FLAG-HYGIENE requires it to be byte-identical
to the control, so its every Δ is exactly 0 and it can never be an arm of record. **Its selector
booleans are stored anyway**, for the record.

Per dose arm the instrument stores `r1Down`, `r2Down`, `r1Up`, `r2Up`, `breach` (any guard or
band breach) and `disqualified = r1Up || r2Up || breach`, together with the **face that
disqualified** it. The literals below are copied **verbatim** from #389 item 4(iv):

1. **READ 1** — some non-disqualified arm has `r1Down && r2Down` ⇒
   *"THE EYES CLEAR THE CROWD AND THE LANE AT `<ARM>` — the entry rung LN-ENTRY is named with
   that dose."* with the **arm of record = the largest R1 decrease among qualifying arms**
   (the comparison is **stored**, never asserted in prose).
2. **READ 2** — some non-disqualified arm has `r1Down`, none has `r2Down` ⇒
   *"THE EYES THIN THE CROWD BUT THE CAROM STANDS — the commander decides with the table; ⑤ (the
   passer's eyes) is named beside."*
3. **READ 3** — some non-disqualified arm has `r2Down`, none has `r1Down` ⇒
   *"THE EYES CLEAR THE LANE BUT THE CROWD STANDS — the commander decides with the table."*
4. **READ 4 = F-LN-a** — no non-disqualified arm has `r1Down` or `r2Down` ⇒
   *"THE EYES MOVE NEITHER FACE — step ③ (retire the hand-written designations) is named next;
   this exam's ABSENT arm is its control."*
5. **READ 5** — every dose arm disqualified ⇒
   *"THE EYES HARM — the seat stays dormant; step ③ is named next."*

**⭐⭐ THE COUNTERFACTUAL WORD IS STORED FOR EVERY REPORTED ARM** — canon, VERBATIM: *"a
counterfactual verdict sentence ('had X been scored, the rule would read W') quotes a word the
instrument STORED by applying the frozen rule to X's stored interval; a universal sentence about
a table ('every bin', 'the one bin') is a stored boolean or is not written"* (home:
[`BF-T1-FACING-COST-EXAM.md`](BF-T1-FACING-COST-EXAM.md) §COMMANDER CORRECTIONS items 1–2, ruling
#378 item 2). Every dose arm's row therefore carries **what this exam would read if that row were
the whole table**. And **every universal sentence in the results below is a stored boolean**
(`reads.universals`) or it is not written.

---

## §DEV-PREFLIGHT — the sizing smoke, disclosed in full

⚠ **A SCRATCH RUN.** 12 clusters on the out-of-band scratch band **900,003,500–511**, receipt
**900,003,520**, world pin **900,003,570**, lockstep **900,003,590–591**, dose read
**900,003,540**; artifact written to `/tmp`, **never committed**, **never read by a gate**.
12 clusters is a **noisy** variance estimate and the sizing says so. **All 22 gates were GREEN in
this smoke**, including `xDet`, `xFpProd`, `gFlagHygiene` (0 differing fields), `gArm`,
`gBlindWorld`, `gDoseCopy` and `gReproLnc0` (**912 field comparisons over 12 seeds × 76 fields,
0 mismatches**), with `gFaces` at **855/855 face-and-Δ + 247/247** stored-bin / partition /
guard / band / selector / read-word / dose-copy / sizing checks off the serialized artifact.

**THE SMOKE'S OWN LEVELS AND PAIRED Δ (12 clusters — orientation only, never a finding):**

| face | ABSENT level (num/den) | MARKER-ESCAPE Δ | SPACE-SEEK Δ | KITCHEN-SINK Δ |
|---|---|---|---|---|
| **R1 `crowd.crashShare`** | 0.483535 (4684/9687) | −0.016796 [−0.052819, +0.017632] | +0.006708 [−0.027041, +0.041800] | **−0.034827 [−0.062893, −0.005018]** |
| **R2 `firstBody.ownNonTarget`** | 0.101499 (88/867) | +0.004303 [−0.022836, +0.034348] | +0.006109 [−0.028440, +0.042886] | −0.002598 [−0.017654, +0.017420] |

Other ABSENT levels in the smoke, for orientation: `lane.passesWithOccupantShare` 0.356401
(309/867) · `lane.occupantsPerPass` 0.432526 (375/867) · `crowd.dupRunPairsPerSample` 0.687106
(6656/9687) · `guard.spacingUnder4` 0.073805 (0.885654974866882/12) ·
`guard.interceptionsPerMatch` 27.250000 (327/12) · `guard.spacingMedian` 14.207156
(170.4858688717715/12) · `guard.spreadYOut` 6.086816 (73.04179327731619/12) ·
`guard.offsidesPerMatch` 2.083333 (25/12) · `context.goalsPerMatch` 2.333333 (28/12) ·
`context.shotsPerMatch` 12.833333 (154/12) · `context.passCompletion` 0.576840 (533/924) ·
`context.ownedBallSampleShare` 0.327777 (4916/14998). ⚠ **A 12-seed scratch level is not a
level of record**; the levels of record are §R's, at N = 998, on the block.

**THE ARMING RECEIPTS IN THE SMOKE (⚠ receipts, never football effect sizes):** the policy cache
held entries on **12/12** seeds of every armed arm (KITCHEN-SINK total 120) and **0** on every
ABSENT seed; `receipt.policyCacheEntriesPerMatch` on ABSENT = 0.000000 (0/12). The delivered-dose
read on the ABSENT arm: `sawSnapshotShare` 0.99824780976 · `someFeatureNonZeroShare`
0.96946182728 · `allFeaturesZeroShare` 0.03053817272 · feature means
[0.16982029234, 0.46261048827, 0.19966368811, 0.23911351608] over 7,990 samples — the percept
trunk is live, so a null result could not be blindness.

**THE FOURTH LICENCE IS NON-VACUOUS IN THE SMOKE:** ABSENT composition under the parallel ladder
L1 0.389333 · **L1w 0.008000** · L2 0.341333 · L3a 0.093333 · L3b 0.114667 · L4 0.053333 (n = 375).

### THE SIZING TABLE (the frozen form, on the smoke's own half-widths)

| ruler (at the CEILING arm) | hw(12) | target | se(12) | se(needed) | **N required** | **MDE at N = 998** |
|---|---|---|---|---|---|---|
| **R1 `crowd.crashShare`** | 0.02893749919645197 | 0.02 | 0.014764 | 0.007139 | **52** | **0.004536** |
| **R2 `firstBody.ownNonTarget`** | 0.01753664982651569 | 0.01 | 0.008947 | 0.003569 | **76** | **0.002749** |

⇒ **the required N is within what the block affords on both sized rulers.** N_FROZEN is therefore
the block's affordance, **998** — the house form LN-C0 used — and the MDE at that N is published
above and re-derived by `gFaces` off the artifact. (Every number in this table is recomputed by
the instrument from `hwSmoke` and `target` and re-derived off disk; the two half-widths are the
only inputs, and they are read out of the smoke artifact's own `deltas[].halfWidth` fields.)

**WALL:** the smoke's own reading was **0.146650 s per match** on this machine; at 998 seeds × 5
arms × 2 X-DET passes plus receipts, the battery is planned in the tens of minutes and is run in
the background with its output polled.

---


## §R RESULTS — every number below QUOTES the artifact's own fields at 6 dp; the artifact
## [`data/ln-t1-lane-exam.json`](data/ln-t1-lane-exam.json) is the numbers of record

**THE RUN.** 998 seeds × 5 arms, block **12,545,000–12,545,997**, construction receipt
**12,545,999**, declared unwalked tail **12,545,998**; **each seed walked once per arm in each of
the two X-DET passes ⇒ BOOKED = WALKED = 9,990** exam walks. **22/22 gates GREEN.** `gFaces`
**855/855** face-and-Δ checks and **247/247** stored-bin / median / partition / guard / band /
offside / selector / read-word / dose-copy / sizing checks, all re-derived off the **serialized
artifact on disk**. `xDet` digests identical
(`70582790f6d970fb75c614e45bed983fe3123e65a62d4e2dd087cb34085e4ae2`, twice). `xFpProd`
**57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673 UNCHANGED**. ZERO stats,
registry **74**. Wall **1449.145 s** (`perf.batteryWallSeconds`), **0.140370 s** per match
(`perf.meanWallSecondsPerMatch`, pass 1's own timing).

### §R1 ⭐⭐ THE TWO RULERS — paired Δ vs ABSENT, DOWN resolved = helpful

**THE CONTROL (ABSENT = LN-C0's E13 re-walked at N = 998):**
**R1 `crowd.crashShare` = 0.469990** (387,452 / 824,383 attributable sampled ticks) ·
**R2 `firstBody.ownNonTarget` = 0.102758** (7,665 / 74,593 measured ground passes).

| arm | R1 撞车 level (num/den) | R1 paired Δ [95 % CI] | hw · \|Δ\|÷hw | verdict | LOO flips (down/up) |
|---|---|---|---|---|---|
| **ABSENT** | 0.469990 (387,452/824,383) | — (control) | — | — | — |
| **ARMED-ZERO** | 0.469990 (387,452/824,383) | 0.000000 [0.000000, 0.000000] | 0.000000 · NaN | — | 0 / 0 |
| **MARKER-ESCAPE** | 0.457211 (376,781/824,085) | **−0.012779 [−0.018640, −0.007265]** | 0.005687 · **2.246856** | **DOWN, resolved** | **0 / 0** |
| **SPACE-SEEK** | 0.472391 (388,219/821,817) | +0.002401 [−0.003855, +0.008735] | 0.006295 · 0.381357 | — | 0 / 0 |
| **KITCHEN-SINK** | 0.470757 (390,928/830,425) | +0.000766 [−0.005435, +0.006714] | 0.006074 · 0.126147 | — | 0 / 0 |

| arm | R2 `firstBody.ownNonTarget` level (num/den) | R2 paired Δ [95 % CI] | hw · \|Δ\|÷hw | verdict | LOO flips (down/up) |
|---|---|---|---|---|---|
| **ABSENT** | 0.102758 (7,665/74,593) | — (control) | — | — | — |
| **ARMED-ZERO** | 0.102758 (7,665/74,593) | 0.000000 [0.000000, 0.000000] | 0.000000 · NaN | — | 0 / 0 |
| **MARKER-ESCAPE** | 0.103504 (7,786/75,224) | +0.000747 [−0.002219, +0.003526] | 0.002873 · 0.259899 | — | 0 / 0 |
| **SPACE-SEEK** | 0.105331 (7,874/74,755) | +0.002573 [−0.000530, +0.005550] | 0.003040 · 0.846391 | — | 0 / 0 |
| **KITCHEN-SINK** | 0.104240 (7,958/76,343) | +0.001482 [−0.001356, +0.004332] | 0.002844 · 0.521200 | — | 0 / 0 |

⭐⭐ **ONE ARM MOVED THE CROWD.** MARKER-ESCAPE's R1 Δ is **−0.012779**, |Δ| ÷ half-width
**2.246856**, **0 leave-one-out flips**; it is the **stored** `r1Down` boolean and the only one
among the three dosed corners (`reads.universals.noDosedCornerHasR1Down` = **false**;
`everyDosedCornerHasR1Down` = **false**). ⛔ **NO ARM MOVED THE CAROM** — the stored boolean
`reads.universals.noDosedCornerHasR2Down` is **true**, and every R2 interval above contains zero.

⭐ **THE MDE SAYS THIS WAS DETECTABLE, AND THE CROWD MOVE IS SMALLER THAN THE DECLARED TARGET.**
§DEV-PREFLIGHT's sizing put MDE(998) at **0.004536** on R1 and **0.002749** on R2 against declared
targets of 0.02 and 0.01. MARKER-ESCAPE's R1 move (0.012779) is **above** the R1 MDE and **below**
the declared R1 target; every R2 move is **below** the R2 target and unresolved. ⛔ The exam's rule
is *resolution*, not target-attainment: the target sized the battery, it never gated a read.

**THE ARMED-ZERO ROW IS EXACTLY ZERO ON BOTH RULERS AND EVERYWHERE ELSE** — see §R2's hygiene
receipt. ⚠ Its **one** resolved Δ in the whole artifact is
`receipt.policyCacheEntriesPerMatch` (**+10.000000 [10.000000, 10.000000]**, 10 policy-cache
entries per match against 0 on ABSENT), which is an **arming receipt and never a football effect
size** (canon: *receipts ≠ effect sizes*).

#### `spacingUnder4` BESIDE R1 — the two faces of one sentence, both stored

⚠ **DIFFERENT UNITS, NEVER ADDED** (frozen at §P.B): R1 is a **per-sampled-tick** share; this is a
**mean of per-match PAIR shares**.

| arm | `guard.spacingUnder4` (mean per-match share) | paired Δ [95 % CI] | `guard.spacingUnder4Pooled` (share of pairs) | pooled Δ [95 % CI] |
|---|---|---|---|---|
| **ABSENT** | 0.069028 (68.8904364445121/998) | — | 0.068949 (287,443/4,168,926) | — |
| **ARMED-ZERO** | 0.069028 | 0.000000 [0.000000, 0.000000] | 0.068949 | 0.000000 [0.000000, 0.000000] |
| **MARKER-ESCAPE** | 0.067724 | **−0.001305 [−0.002089, −0.000539] DOWN** | 0.067632 | **−0.001317 [−0.002096, −0.000543] DOWN** |
| **SPACE-SEEK** | 0.069140 | +0.000112 [−0.000706, +0.000868] | 0.069077 | +0.000128 [−0.000696, +0.000895] |
| **KITCHEN-SINK** | 0.068979 | −0.000050 [−0.000935, +0.000809] | 0.068960 | +0.000011 [−0.000857, +0.000861] |

⭐ **THE TWO FACES AGREE AT MARKER-ESCAPE and only there** — both the per-tick 撞车 face and both
forms of the per-pair `spacingUnder4` face are DOWN and resolved at that arm, and at no other.
(This is the one place the exam touches OBM-T1's own scored face; the levels are **not**
comparable across the two exams — see §HONEST LIMITS item 4.)

#### THE OTHER SECONDARIES (published, never gating)

| face | ABSENT (num/den) | MARKER-ESCAPE Δ | SPACE-SEEK Δ | KITCHEN-SINK Δ |
|---|---|---|---|---|
| `lane.passesWithOccupantShare` | 0.320915 (23,938/74,593) | +0.001708 [−0.002866, +0.006309] | −0.003438 [−0.008140, +0.001458] | **−0.019014 [−0.023846, −0.013989] DOWN** |
| `lane.occupantsPerPass` | 0.381323 (28,444/74,593) | +0.000032 [−0.005971, +0.006538] | **−0.010712 [−0.016952, −0.004388] DOWN** | **−0.028428 [−0.034816, −0.021913] DOWN** |
| `crowd.dupRunPairsPerSample` | 0.672673 (554,540/824,383) | **−0.016166 [−0.027519, −0.005670] DOWN** | +0.002451 [−0.008881, +0.013438] | +0.010111 [−0.002539, +0.022152] |
| `crowd.nearestMateMeanMetres` | 8.889460 (36,556,472.44640652/4,112,339) | **+0.080548 [+0.042927, +0.120333] UP** | **+0.079779 [+0.041228, +0.120063] UP** | **+0.276560 [+0.234046, +0.317967] UP** |
| `context.groundPassesPerMatch` | 74.742485 (74,593/998) | +0.632265 [−0.131263, +1.395792] | +0.162325 [−0.600200, +0.920842] | **+1.753507 [+0.950902, +2.560120] UP** |
| `lane.wallRunLiveOccupantShare` | 0.016032 (456/28,444) | +0.001328 [−0.000740, +0.003387] | **+0.002305 [+0.000037, +0.004409] UP** | **+0.005571 [+0.003182, +0.008066] UP** |

⭐⭐ **THE THREE CORNERS DID DIFFERENT THINGS, AND THE ONE THAT MOVED 撞车 IS NOT THE ONE THAT
EMPTIED THE LANE.** MARKER-ESCAPE thinned the **crowd** (撞车 and dup-run pairs DOWN) while leaving
`lane.occupantsPerPass` where it was; KITCHEN-SINK **emptied the lane** (occupants per pass and
passes-with-an-occupant both DOWN, the largest of the three on both — a **stored** comparison, the
rows above) while leaving 撞车 flat. ⛔ Neither moved the **carom**. All three pushed the mean
nearest-mate distance **UP** — the bodies did spread — and none of that reached R2.

### §R2 ⭐⭐ THE GUARDS, THE OFFSIDE FLAG, THE BAND AND THE HYGIENE RECEIPT

**EVERY GUARD HELD ON EVERY DOSE ARM** — `reads.universals.everyGuardHeldOnEveryDoseArm` =
**true** (a stored boolean). Tolerance = NI_FRACTION · |control level|, the expression inherited
from OBM-T1's probe line.

| guard [direction] | control (tolerance) | ARMED-ZERO Δ | MARKER-ESCAPE Δ | SPACE-SEEK Δ | KITCHEN-SINK Δ |
|---|---|---|---|---|---|
| `guard.interceptionsPerMatch` [ceiling] | 26.790581 (±7.402661) | 0.000000 [0.000000, 0.000000] | +0.516032 [+0.104208, +0.937876] **resolved, inside** | +0.325651 [−0.115230, +0.743487] | +0.397796 [−0.067134, +0.852705] |
| `guard.spacingMedian` [floor] | 14.326019 (±3.958505) | 0.000000 | +0.037075 [−0.005457, +0.084937] | +0.118900 [+0.074581, +0.161970] **resolved, helpful side** | +0.378336 [+0.331116, +0.428364] **resolved, helpful side** |
| `guard.spreadYOut` [floor] | 6.246359 (±1.725968) | 0.000000 | +0.101759 [+0.074337, +0.128070] **resolved, helpful side** | +0.077665 [+0.052644, +0.103698] **resolved, helpful side** | +0.318583 [+0.290061, +0.344799] **resolved, helpful side** |

⚠ Several guard Δ are **resolved** — but a guard's predicate is **breach = resolved AND beyond
tolerance IN THE HARMFUL DIRECTION**, and every `beyondTolerance` flag above is **false**. The
interceptions rise at MARKER-ESCAPE (+0.516032) is a resolved move **toward** the ceiling and
**0.516032 against a tolerance of 7.402661**; the spacing and spread moves are all resolved in the
**helpful** direction for a floor. **No breach, anywhere.**

**THE OFFSIDE LIMB (#157 FLAG form — flips no gate).** Control **2.565130 offsides per match**
(2,560/998). ARMED-ZERO 0.000000 · MARKER-ESCAPE −0.090180 [−0.221443, +0.046092] · SPACE-SEEK
−0.003006 [−0.136273, +0.132265] · KITCHEN-SINK **−0.189379 [−0.318637, −0.056112], a resolved
DECREASE**. A flag fires only on a resolved **increase**, so
`reads.universals.noOffsideFlagOnAnyDoseArm` = **true** (stored).

**THE WORLD-13 DO-NO-HARM BAND** — `reads.universals.everyBandFaceHeldOnEveryDoseArm` = **true**
(stored).

| band face [harmful] | control (num/den; tolerance) | MARKER-ESCAPE Δ | SPACE-SEEK Δ | KITCHEN-SINK Δ |
|---|---|---|---|---|
| `context.goalsPerMatch` [BOTH] | 3.257515 (3,251/998; ±0.900103) | +0.024048 [−0.129259, +0.170341] | +0.042084 [−0.104208, +0.188377] | +0.002004 [−0.146293, +0.154309] |
| `context.shotsPerMatch` [BOTH] | 12.696393 (12,671/998; ±3.508214) | −0.236473 [−0.493988, +0.024048] | −0.179359 [−0.439880, +0.072144] | −0.854709 [−1.112224, −0.596192] **resolved, inside** |
| `context.passCompletion` [DOWN] | 0.588817 (46,851/79,568; ±0.162699) | −0.007355 [−0.011757, −0.003014] **resolved, inside** | −0.004652 [−0.009308, −0.000084] **resolved, inside** | −0.011147 [−0.015882, −0.006634] **resolved, inside** |
| `context.ownedBallSampleShare` [DOWN] | 0.338702 (426,619/1,259,569; ±0.093589) | −0.005282 [−0.008868, −0.001790] **resolved, inside** | +0.003695 [+0.000057, +0.007566] | +0.002005 [−0.002008, +0.005945] |

⚠ **THE COMPLETION DROP IS RESOLVED ON ALL THREE CORNERS AND IS WELL INSIDE THE BAND** (the
largest, KITCHEN-SINK's −0.011147, is **0.011147 against a tolerance of 0.162699**). It is a real,
repeatable, small cost and it is stated here rather than left in the artifact: **arming the eyes
costs about one completed pass in a hundred**. **Goals did not move on any arm** (every interval
contains zero).

**⭐⭐ FLAG-HYGIENE.** ARMED-ZERO is byte-identical to ABSENT on **998/998 seeds**: **0 differing
fields** across 998 seeds × **93** compared fields, and the **whole-match signature including the
rng stream state is identical on 998/998 seeds**. The five excluded fields are named at §P.A and
in the artifact.

**⭐⭐ G-ARM — THE TREATMENT WAS DELIVERED.** On each of the four armed arms the matrix was present
and full-length on all three genome views of both teams on **998/998** seeds, the flag was on on
**998/998**, and the match's own policy cache held entries on **998/998** seeds (**9,980** entries
per arm across the battery = 10 per match). On ABSENT: **0** seeds with a matrix, **0** with the
flag, **0** cache entries.

**⭐⭐ G-BLIND-WORLD — THE EYES COULD SEE, SO A NULL IS NOT BLINDNESS.** `edsPerceivedChoice` TRUE
on every constructed and every walked match of every arm. The delivered-dose read, per arm
(descriptive only, one match per arm at scratch seed 900,003,540):

| arm | snapshot-seen share | some-feature-non-zero | all-features-zero | feature means (f1 · f2 · f3 · f4) | output means (depth · width · support · run) | samples |
|---|---|---|---|---|---|---|
| ABSENT | 0.998248 | 0.969462 | 0.030538 | 0.169820 · 0.462610 · 0.199664 · 0.239114 | 0.000000 · 0.000000 · 0.000000 · 0.000000 | 7,990 |
| ARMED-ZERO | 0.998248 | 0.969462 | 0.030538 | 0.169820 · 0.462610 · 0.199664 · 0.239114 | 0.000000 · 0.000000 · 0.000000 · 0.000000 | 7,990 |
| MARKER-ESCAPE | 0.998259 | 0.970149 | 0.029851 | 0.154712 · 0.461092 · 0.213820 · 0.234787 | 0.115273 · 0.115273 · 0.000000 · 0.000000 | 8,040 |
| SPACE-SEEK | 0.998250 | 0.950250 | 0.049750 | 0.185532 · 0.422564 · 0.219829 · 0.239979 | −0.054957 · 0.054957 · 0.000000 · 0.000000 | 8,000 |
| KITCHEN-SINK | 0.998364 | 0.967874 | 0.032126 | 0.178592 · 0.420809 · 0.233621 · 0.233209 | −0.266558 · 0.266558 · 0.266558 · −0.266558 | 8,560 |

⭐ **DOSE ≠ DELIVERED, VISIBLE**: each arm's output means are non-zero exactly on the axes its
matrix doses and **exactly 0.000000** on the axes it does not — MARKER-ESCAPE and SPACE-SEEK leave
both score axes at zero, KITCHEN-SINK moves all four.

### §R3 ⭐⭐ THE OCCUPANT COMPOSITION AND THE CAROM BY CAUSE, UNDER EACH ARM, WITH L1w

**THE FIVE-CLASS LADDER** (LN-C0's precedence, unchanged), share of own lane occupants:

| arm | L1 DESIGNATED | L2 SUPPORT | L3a SPOT-IN-LANE | L3b PATH-ACROSS | L4 OTHER | occupants |
|---|---|---|---|---|---|---|
| ABSENT | 0.371467 (10,566) | 0.374947 (10,665) | 0.100830 (2,868) | 0.106912 (3,041) | 0.045844 (1,304) | 28,444 |
| ARMED-ZERO | 0.371467 (10,566) | 0.374947 (10,665) | 0.100830 (2,868) | 0.106912 (3,041) | 0.045844 (1,304) | 28,444 |
| MARKER-ESCAPE | 0.378499 (10,858) | 0.369261 (10,593) | 0.101893 (2,923) | 0.105518 (3,027) | 0.044829 (1,286) | 28,687 |
| SPACE-SEEK | 0.388197 (10,755) | 0.355243 (9,842) | 0.101390 (2,809) | 0.109980 (3,047) | 0.045190 (1,252) | 27,705 |
| KITCHEN-SINK | 0.415723 (11,200) | 0.328273 (8,844) | 0.101852 (2,744) | 0.108793 (2,931) | 0.045358 (1,222) | 26,941 |

**⭐⭐ THE SIX-CLASS LADDER WITH THE FOURTH LICENCE** (`L1 > L1w > L2 > L3a > L3b > L4`), same
denominator, stored beside — never folded into L1:

| arm | L1 | **L1w** | L2 | L3a | L3b | L4 | occupants |
|---|---|---|---|---|---|---|---|
| ABSENT | 0.371467 (10,566) | **0.006680 (190)** | 0.373330 (10,619) | 0.099775 (2,838) | 0.104838 (2,982) | 0.043911 (1,249) | 28,444 |
| ARMED-ZERO | 0.371467 (10,566) | **0.006680 (190)** | 0.373330 (10,619) | 0.099775 (2,838) | 0.104838 (2,982) | 0.043911 (1,249) | 28,444 |
| MARKER-ESCAPE | 0.378499 (10,858) | **0.007948 (228)** | 0.367344 (10,538) | 0.100324 (2,878) | 0.103427 (2,967) | 0.042458 (1,218) | 28,687 |
| SPACE-SEEK | 0.388197 (10,755) | **0.007941 (220)** | 0.353258 (9,787) | 0.100018 (2,771) | 0.107706 (2,984) | 0.042880 (1,188) | 27,705 |
| KITCHEN-SINK | 0.415723 (11,200) | **0.008983 (242)** | 0.325675 (8,774) | 0.100479 (2,707) | 0.106343 (2,865) | 0.042797 (1,153) | 26,941 |

⭐ **L1w IS SMALL AND IT DOES NOT COME OUT OF L1.** The raw live-licence incidence over all
occupants is **0.016032** (456/28,444) on ABSENT, and the class the precedence gives L1w is
**0.006680** (190/28,444) — the rest of the licence-carrying occupants are **already designated**
and stay in L1, exactly as the precedence says. L1w's paired Δ is unresolved at MARKER-ESCAPE
(+0.001268 [−0.000107, +0.002650]) and SPACE-SEEK (+0.001261 [−0.000134, +0.002653]) and a
resolved **increase** at KITCHEN-SINK (+0.002303 [+0.000735, +0.003847]).

**⭐⭐ THE CAROM BY CAUSE UNDER EACH ARM** — P(first body = this occupant | class), six-class
ladder:

| arm | L1 | **L1w** | L2 | L3a | L3b | L4 | all (5-class) |
|---|---|---|---|---|---|---|---|
| ABSENT | 0.109218 (1,154/10,566) | **0.142105 (27/190)** | 0.122987 (1,306/10,619) | 0.476039 (1,351/2,838) | 0.361502 (1,078/2,982) | 0.169736 (212/1,249) | 0.180284 (5,128/28,444) |
| ARMED-ZERO | 0.109218 (1,154/10,566) | **0.142105 (27/190)** | 0.122987 (1,306/10,619) | 0.476039 (1,351/2,838) | 0.361502 (1,078/2,982) | 0.169736 (212/1,249) | 0.180284 (5,128/28,444) |
| MARKER-ESCAPE | 0.107202 (1,164/10,858) | **0.140351 (32/228)** | 0.124502 (1,312/10,538) | 0.449618 (1,294/2,878) | 0.379845 (1,127/2,967) | 0.192118 (234/1,218) | 0.179977 (5,163/28,687) |
| SPACE-SEEK | 0.107020 (1,151/10,755) | **0.168182 (37/220)** | 0.141514 (1,385/9,787) | 0.481054 (1,333/2,771) | 0.370979 (1,107/2,984) | 0.216330 (257/1,188) | 0.190218 (5,270/27,705) |
| KITCHEN-SINK | 0.110893 (1,242/11,200) | **0.144628 (35/242)** | 0.157853 (1,385/8,774) | 0.450683 (1,220/2,707) | 0.367888 (1,054/2,865) | 0.185603 (214/1,153) | 0.191158 (5,150/26,941) |

⭐⭐ **LN-C0's INVERSION SURVIVES EVERY ARM, INCLUDING THE ONE THAT THINNED THE CROWD.** In every
one of the five arms the two SHAPE classes L3a and L3b are hit far more often than the designated
and support bodies — and no dose changes that ordering. That is why the crowd moved and the carom
did not: **the policy moves the bodies that were never the ones being hit.**

**THE PAIR COMPOSITION** (share of dup-run pairs; the crowd's own partition):

| arm | P1 TABLE | P2 DESIGNATED | P3 SUPPORT | P4 SHAPE-PATHS | P5 OTHER | pairs |
|---|---|---|---|---|---|---|
| ABSENT | 0.000002 (1) | 0.502959 (278,911) | 0.287357 (159,351) | 0.097964 (54,325) | 0.111718 (61,952) | 554,540 |
| ARMED-ZERO | 0.000002 (1) | 0.502959 (278,911) | 0.287357 (159,351) | 0.097964 (54,325) | 0.111718 (61,952) | 554,540 |
| MARKER-ESCAPE | 0.000006 (3) | 0.523712 (283,337) | 0.266223 (144,031) | 0.094833 (51,306) | 0.115227 (62,340) | 541,017 |
| SPACE-SEEK | 0.000005 (3) | 0.499681 (277,237) | 0.292240 (162,143) | 0.095967 (53,245) | 0.112107 (62,200) | 554,828 |
| KITCHEN-SINK | 0.000011 (6) | 0.494318 (280,279) | 0.311289 (176,501) | 0.087887 (49,832) | 0.106495 (60,383) | 567,001 |

⭐ **P1 TABLE STAYS AT ONE PAIR IN HALF A MILLION** on the control — LN-C0's exoneration of the
formation table reproduces at this N (1 of 554,540 on ABSENT), and no arm changes it materially.

**THE FIRST-BODY CHANNEL IN FULL** (shares of measured ground passes; the four classes partition
them exactly, and `gFaces` proves the partition off disk):

| arm | none | ownTarget | **ownNonTarget (R2)** | opponent |
|---|---|---|---|---|
| ABSENT | 0.001260 | 0.577641 | **0.102758** | 0.318341 |
| ARMED-ZERO | 0.001260 | 0.577641 | **0.102758** | 0.318341 |
| MARKER-ESCAPE | 0.000931 | 0.570350 | **0.103504** | 0.325215 |
| SPACE-SEEK | 0.000843 | 0.577339 | **0.105331** | 0.316487 |
| KITCHEN-SINK | 0.001310 | 0.566247 | **0.104240** | 0.328203 |

### §R4 ⭐⭐ THE READ

**THE STORED SELECTORS, PER ARM** (the artifact's `reads.selectors`):

| arm | r1Down | r2Down | r1Up | r2Up | breach | **disqualified** | disqualifying face | offside flag |
|---|---|---|---|---|---|---|---|---|
| ARMED-ZERO | false | false | false | false | false | **false** | — | false |
| MARKER-ESCAPE | **true** | false | false | false | false | **false** | — | false |
| SPACE-SEEK | false | false | false | false | false | **false** | — | false |
| KITCHEN-SINK | false | false | false | false | false | **false** | — | false |

**NO ARM WAS DISQUALIFIED** (`reads.disqualifiedArms` is empty; `everyDosedCornerDisqualified` =
**false**). The qualifying arms are all three dosed corners. `anyQualifyingR1Down` = **true**;
`anyQualifyingR2Down` = **false**; `anyQualifyingBoth` = **false** ⇒ the selector picks **READ 2**,
and the arm-of-record comparison is empty because READ 2 names no arm of record.

> ### **THE EYES THIN THE CROWD BUT THE CAROM STANDS — the commander decides with the table; ⑤ (the passer's eyes) is named beside.**

**THE COUNTERFACTUAL WORD FOR EVERY REPORTED ARM** — the frozen rule applied to that arm's stored
intervals alone, i.e. what this exam would read if that row were the whole table:

| arm | counterfactual word | the sentence that word prints |
|---|---|---|
| ARMED-ZERO | **read4** | *"THE EYES MOVE NEITHER FACE — step ③ (retire the hand-written designations) is named next; this exam's ABSENT arm is its control."* |
| **MARKER-ESCAPE** | **read2** | *"THE EYES THIN THE CROWD BUT THE CAROM STANDS — the commander decides with the table; ⑤ (the passer's eyes) is named beside."* |
| SPACE-SEEK | **read4** | *"THE EYES MOVE NEITHER FACE — …"* |
| KITCHEN-SINK | **read4** | *"THE EYES MOVE NEITHER FACE — …"* |

⇒ **the read of record rests on ONE arm**: MARKER-ESCAPE alone. Had it not been walked, this exam
would have printed **F-LN-a** (READ 4) and named step ③.

**THE UNIVERSAL SENTENCES, EACH A STORED BOOLEAN** (`reads.universals`): every dosed corner
disqualified **false** · no dosed corner has r1Down **false** · **no dosed corner has r2Down
true** · every dosed corner has r1Down **false** · every dosed corner has r2Down **false** · every
guard held on every dose arm **true** · every band face held on every dose arm **true** · no
offside flag on any dose arm **true** · ARMED-ZERO identical on every seed **true** · every arm is
percept-armed **true** · `ctbSupportPlane` shut in every arm **true**.

### §R5 在说人话的层面

打开「用眼睛站位」这个座位以后：**MARKER-ESCAPE 那一档真的让人挤人少了一点**（撞车从
0.469990 掉到 0.457211，区间不含零；同一档的 4 米内近距离配对份额也一起下去了），**而且三条
守卫、四条不许变坏的底线、越位那一条全都没破**。但是**「传到人身上弹回」一点没动**——三档都
不动，区间全部含零。原因在 §R3 那张表上：**被打到的一直是站着守形状的那两类身体（L3a/L3b），
而这个座位挪的是别的人**。代价说清楚：**传球成功率掉了大约百分之一**（最大的一档 −0.011147，
容差是 0.162699），进球没变。

---
## §HONEST LIMITS

⛔ canon, VERBATIM: *"a stage doc's HONEST LIMITS list is the ONE home; the artifact stores that
list verbatim or stores none"* (home: [`RC-C0-COOPERATION-CENSUS.md`](RC-C0-COOPERATION-CENSUS.md)
§COMMANDER CORRECTIONS item 3, ruling #367 item 3). **The artifact stores NONE.**

1. **THE SEAT'S FOUR FEATURES NEVER READ A TEAMMATE.** #389 item 3, VERBATIM: *"OBM's four
   features read OPPONENTS and the body's OWN reading age — none reads a TEAMMATE; whatever
   thinning the policy buys is bought INDIRECTLY (widening, dropping off a congested target)."*
   Whatever this exam measures on R1 and R2 is therefore an **indirect** effect, and no mechanism
   claim about *how* the crowd thinned is licensed by these numbers.
2. **THREE CORNERS ARE NOT THE DOSE SPACE.** The three matrices are ±1 corners of the frozen
   signed domain, chosen because they are the corners the record already moved. A null on three
   corners is **not** a null on the seat, and a movement at one corner is **not** a
   recommendation of that corner.
3. **D13 IS NOT WALKED.** Nothing here transfers automatically to the form the user actually
   plays; #389 item 4(i) puts that walk on the entry rung, as its own pin.
4. **THE ABSOLUTE LEVELS ARE NOT OBM-T1's.** OBM-T1 walked a bare percept-armed match; this exam
   walks world 13's whole composition. Its ABSENT level is a different level and the two exams'
   absolute numbers are **not comparable** — only paired Δ within this exam is read.
5. **L1w IS AN UPPER BOUND.** The class reads the `p.wallRun` **licence window**
   (`simTime < until`), while the brain's own one-two burst gate is the narrower
   `simTime < until − 1.1`. So L1w counts every body that *could* burst, not every body that did.
6. **THE FORMATION AND SUPPORT SPOTS ARE DECLARED RECONSTRUCTIONS** (inherited from LN-C0):
   `formationSpot` / `supportSpot` are CALLED at the exam's own instant, which is not necessarily
   the instant the body last decided; `hasBall = TRUE` is the exam's declared argument and the
   receipt `receipt.hasBallRecipeAgreesShare` publishes how often the production recipe agrees.
7. **THE CORRIDOR IS A CONSTRUCTION.** The engine ships **no boolean corridor width** — its
   shipped corridor is a soft exposure. The membership test is this family's construction from
   the engine's own two constants (`DV_CORRIDOR_SCALE`, `DV_CLEAR_RADIUS`), with `CONTROL_RADIUS`
   published beside as a tight robustness bin.
8. **THE GUARD FOLD WEIGHS MATCHES, NOT PAIRS.** `spacingMedian`, `spreadYOut` and
   `spacingUnder4` are per-match values meaned over matches (OBM-T1's own fold), so a match with
   few sampled pairs weighs the same as one with many. The denominator-stable pooled companion
   `guard.spacingUnder4Pooled` is published beside for exactly that reason.
9. **THE DELIVERED-DOSE READ IS ONE MATCH PER ARM ON A SCRATCH SEED**, and it perturbs that
   match's percept memory by construction. It is descriptive only; `allFeaturesZeroShare` is an
   **upper bound** on genuine blindness, never a measurement of it.
10. **THE SIZING VARIANCE INPUT IS A 12-CLUSTER SMOKE** — a noisy estimate, and it was taken at
    the CEILING arm, so the implied N for a quieter corner is understated.
11. **LOO IS THE CONSERVATIVE POINT-SHIFT FORM** — it shifts the whole interval by a dropped
    seed's influence on the point; it is not a re-bootstrapped interval.
12. **THE WALL FIGURE IS A MACHINE READING ON ONE MACHINE**, pass 1 only, and it times the walk
    including the observer reads and the two called spot reconstructions — never the game's frame
    cost.
13. **NO CAUSAL CLAIM ABOUT WHICH `MakeRun` PUSH MOVED.** The four push sites are anchored so the
    reader knows they exist; this exam counts occupants and caroms, it does not attribute a
    movement to a push site.

## §DEVIATIONS (declared by the executor; the commander disposes)

1. **THE 16-SLOT MATRIX IS WRITTEN ON `info.genome`** — a deviation from the house dose-placement
   canon (*"dose NEVER in info.genome; truth-dosing writes census values through the shipped
   writer"*, home: ruling #270.2, recurrence struck at #334 item 1). **AUTHORIZED IN TERMS** by
   #389 item 4(i), which specifies *"the all-zero 16-weight matrix written on ALL THREE genome
   views of BOTH teams"*, and it is OBM-T1's own `armMatrix` idiom, byte-copied and anchored.
   Declared in §P.A before sight. `gWorld` still asserts every **scalar** RA / corridor / RC /
   CTB / OBM gene is absent from `info.genome` on every walked match; the 16-slot matrix is the
   **one** gene channel this exam writes there.
2. **THE A4-S2P3 EQUILIBRIUM BAND IS OMITTED.** #389 item 4(iii) permits publishing it as context
   with its exclusion rule **or** omitting it; this exam omits it and says why (world 13's ABSENT
   arm sits outside its goals row by construction). Declared in §P.C.
3. **`spacingUnder4` IS A SECONDARY HERE, NOT A GUARD.** OBM-T1 gated on it; #389 item 4(iii)
   names exactly three guards (interceptions ceiling · `spacingMedian` floor · `spreadYOut`
   floor) and puts `spacingUnder4` among the SECONDARIES *"beside R1"*. This exam follows the
   ruling. Declared in §P.B / §P.C.
4. **THE GUARD LIMBS ARE READ AT LN-C0's SAMPLE SITE.** OBM-T1's guard block runs off its own
   walk's tick counter; this instrument computes the same arithmetic (same `SAMPLE_EVERY` = 10,
   same `PAIR_SUBSAMPLE` = 6, same `CLOSE_PAIR_M` = 4, same folds, all anchored) at LN-C0's
   already-anchored sample site, so the exam has ONE sampling cadence rather than two. The guard
   levels are therefore **this exam's own**, never compared with OBM-T1's. Declared in §P.C.
5. **THE READ SELECTOR EXCLUDES ARMED-ZERO.** #389 item 4(iv) says *"per dose arm"*; ARMED-ZERO is
   the identity arm and FLAG-HYGIENE requires its every Δ to be exactly 0, so including it would
   make READ 5 unreachable by construction. Its selector booleans are STORED anyway. Declared in
   §P.G.
6. **FIVE FIELDS ARE EXCLUDED FROM FLAG-HYGIENE AND ONE FROM G-REPRO-LNC0 AND FROM THE X-DET
   DIGEST.** FLAG-HYGIENE excludes `obmFlag`, `matrixOnAllViews`, `policyCacheEntries`, LN-C0's
   `seamsAbsent` config echo and `wallMs`; G-REPRO-LNC0 and the X-DET digest exclude `wallMs`
   alone. Each is the arm's own definition, a code-path receipt, or a machine timing — never a
   world quantity. Declared in §P.A / §P.F.
7. **LN-C0's `seamsAbsent` FIELD NO LONGER DESCRIBES THE ARMED ARMS.** It is an inherited row
   field whose predicate is `obmMovement !== true && ctbSupportPlane !== true`; on the four armed
   arms it reads FALSE by construction. It is kept unchanged so G-REPRO-LNC0 can compare
   field-for-field, it is excluded from FLAG-HYGIENE, and `gWorld` reads `ctbPlaneShut` (the half
   that still means what its name says) instead.
8. **THREE TRUNCATED DIGITS IN §DEV-PREFLIGHT PROSE WERE CORRECTED AT THIS COMMIT.** The frozen
   commit transcribed three smoke values by truncation rather than rounding:
   `allFeaturesZeroShare` (written `0.03053817271`, stored `0.03053817272` at 11 dp) and two
   feature means (written `0.19966368810` / `0.23911351607`, stored `0.19966368811` /
   `0.23911351608` at 11 dp). Corrected **in place** at the RESULTS commit and recorded here.
   ⛔ No gate, no selector, no read word and no sizing input reads any of the three — the sizing
   inputs are the two half-widths, which were transcribed at full precision and are re-derived
   off the artifact by `gFaces`. ⚠ **§P itself was NOT edited**; the three digits sit in
   §DEV-PREFLIGHT.
9. **§DEV-PREFLIGHT's SIZING TABLE COULD NOT BE READ OUT OF THE SMOKE ARTIFACT ITSELF.** The
   smoke necessarily ran with the sizing constants still at their placeholder 0 (they are the
   smoke's own outputs), so that scratch artifact's `sizing.rows` are zeros. The table in
   §DEV-PREFLIGHT is the **frozen instrument's own computation** from the two transcribed
   half-widths, and it is re-derived step by step off the **RESULTS** artifact by `gFaces`
   (`sizing.*` checks, all green) — where `nRequired` reads **52** and **76** and
   `mdeAtNFrozen` reads **0.004535676743482769** and **0.0027487024444213487**, matching the
   §DEV-PREFLIGHT table at 6 dp.
10. **THE STATUS BANNER AT THE HEAD OF THE DOC WAS FLIPPED FROM "FREEZE" TO "RESULTS"** at this
    commit (two words and a tense). Recorded for completeness.

---

## §GATES — 22/22 GREEN, with derived notes

| gate | verdict | the note, derived from the same pinned values the gate checks |
|---|---|---|
| **`xDet`** | ✅ | the whole core (998 seeds × 5 arms + the construction receipt) walked **twice** from scratch; both digests `70582790f6d970fb75c614e45bed983fe3123e65a62d4e2dd087cb34085e4ae2`. `wallMs` is the one excluded field and it is named. |
| **`xFpProd`** | ✅ | the production fingerprint recomputed in-probe (2 seasons at seed 1337 through the shipped `League` / `runHeadless` path): observed **57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673** = the baseline **extracted** from OBM-T1's own anchored probe line. **UNCHANGED.** |
| **`gSrcUntouched`** | ✅ | `git diff --stat HEAD` **and** `git status --porcelain` over **`src/` AND `tests/`**, all four empty. **X-SRC-ZERO.** |
| **`gSeedDisjoint`** | ✅ | the block base **12,545,000** equals the published frontier at #389 item 7; the block is disjoint from both quoted consumed intervals (BQ-T1 12,543,000–999, LN-C0 12,544,000–999); every battery seed and the receipt are in-block; every scratch seed is ≥ 900,000,000; the G-REPRO-LNC0 seeds lie inside LN-C0's own block and are **declared re-walks**. |
| **`gSeedsBookedEqualWalked`** | ✅ | **998** distinct battery seeds + the receipt at 12,545,999, each walked once per arm in each of two passes ⇒ **9,990** exam walks booked = walked. Tail **12,545,998** declared. |
| **`gN`** | ✅ | no override env at all; the battery ran at exactly **N_FROZEN = 998** seeds × 5 arms in each pass. |
| **`gWorld`** | ✅ | per arm, on every walked match and the receipt: `bqArmedVersion` = 13 · `bqCushion` TRUE · `ctbSupportPlane` FALSE · RC/BF flags absent · `edsPerceivedChoice` TRUE · `info.genome` clean of every **scalar** RA/corridor/RC/CTB/OBM gene · `emergentPosOn()` TRUE (world 13 takes the `emergentStation` path). Pinned again on a constructed match of each arm at scratch seed 900,003,570. |
| **`gAnchoredConstants`** | ✅ | **78** anchored sites, each with a want-count and a line receipt, covering LN-C0's inherited sites, **G-ANCHORS**' new sites (the `obmMovement` fork's three read sites, the four `MakeRun` push sites, the `p.wallRun` write, `A4_WORLD_FLAGS` and both `edsPerceivedChoice: true` occurrences, the genome door, the three OBM_* exports) and **every line of OBM-T1's probe this instrument copies**. The 23-name action vocabulary is read off `ActionType`'s own union. |
| **`gWalkFixtures`** | ✅ | **101/101** walk-side predicate fixtures — including the six-class L1w ladder's agreement with the five-class ladder wherever no licence is live, the `p.wallRun` liveness predicate on both sides of its expiry, OBM-T1's three guard folds and the dose-copy slot lists. |
| **`gClassesNonVacuous`** | ✅ | liveness only: every arm has measured ground passes, own lane occupants, designated occupants, dup-run pairs, 撞车 ticks, subsampled guard pairs and own-non-target first bodies. |
| **`gCrowdArithmeticReproduces`** | ✅ | LN-C0's second, independently shaped implementation of the two crowd quantities recomputed on every sampled tick of every walked match and receipt in all five arms; agrees cell for cell. |
| **`gLockstep`** | ✅ | observed ≡ unobserved, byte-identical whole-match signature, on all **10** arm × out-of-band-scratch-seed walks. |
| **`gFlagHygiene`** | ✅ | ARMED-ZERO ≡ ABSENT: **0** differing fields across **998** seeds × **93** compared fields, and the whole-match signature including the rng stream state identical on **998/998** seeds. |
| **`gArm`** | ✅ | every armed arm: matrix on all six genome views **998/998**, flag on **998/998**, policy-cache writes **998/998** (9,980 entries per arm). ABSENT: 0 / 0 / 0. |
| **`gBlindWorld`** | ✅ | `edsPerceivedChoice` TRUE in every arm; snapshot-seen share and all four feature means strictly positive in every arm (§R2's table). |
| **`gDoseCopy`** | ✅ | **5/5** arms agree slot for slot between the byte-copied matrices and the second, independently shaped re-derivation from the OBM_* exports; every non-zero entry a domain corner; every matrix 16 long. |
| **`gReproLnc0`** | ✅ | LN-C0's seeds **12,544,000–011** re-walked on the ABSENT arm: **912** field comparisons (12 seeds × **76** fields), **0 mismatches**, against `docs/world-model/data/ln-c0-lane-census.json`. `wallMs` the one exclusion. **Declared re-walks, not consumption.** |
| **`gTwoFractions`** | ✅ | all **475** face rows carry their own numerator and denominator and each value is exactly their ratio (or NaN on an empty denominator). |
| **`gLoo`** | ✅ | leave-one-out in the conservative point-shift form on every paired Δ; reported for R1 and R2 on every dose arm at §R1 (**0 flips everywhere**, max influence share 0.028058 at the one resolved ruler row). A receipt — it gates no direction. |
| **`gFaces`** | ✅ | **855/855** face-and-Δ checks and **247/247** stored-bin / median / partition / guard / band / offside / selector / read-word / dose-copy / sizing checks, all re-derived off the **serialized artifact on disk**. |
| **`gReadWords`** | ✅ | every selector boolean, every disqualification, the arm-of-record comparison, the selected read, the printed sentence, every counterfactual word and every universal re-derived by applying the frozen rules to the serialized artifact; the printed sentence is one of the frozen literals. |
| **`gHashOrder`** | ✅ | the **37**-key allowlist schema is complete, covers the per-seed cells and `allGreen`, and excludes `hashedBodySha256`, `gFacesDetail` and `receipts`; the body hash is computed last and the **non-body** `receipts.hashReproducesFromFile` is **true**. |

**THE ARTIFACT OF RECORD.** `docs/world-model/data/ln-t1-lane-exam.json` —
`hashedBodySha256` **a09275180c6a5bfb699385dedf596f63c9284f39506a96071887caf90fa6d41f**,
file byte sha256 **f87be002b800fe6ed96040c02ade59a47e8198c3f63d32f0992c5d41079f401f**,
**14,299,524** bytes, compact JSON (no indentation), **475** face rows, **380** paired Δ rows,
**998** per-seed cells × 5 arms.

**THE INSTRUMENT WAS NOT TOUCHED BETWEEN THE TWO COMMITS.**
`git diff <FREEZE>..<RESULTS> -- scripts/probes/ln-t1-lane-exam.ts` is **EMPTY**, and
`npx tsc --noEmit` is clean at both.

**THE PROSE SWEEP** (canon, VERBATIM: *"a stage doc's numeric sweep covers EVERY numeric literal
in prose at ANY precision; a hand-written percentage is the likeliest second copy"* — home:
[`BF-C0-MOVEMENT-FACING-CENSUS.md`](BF-C0-MOVEMENT-FACING-CENSUS.md) §COMMANDER CORRECTIONS item
6, ruling #374 item 3). All **1,170** numeric literals in this document were swept against three
artifacts — this exam's own, the disclosed scratch smoke's, and LN-C0's committed census. **14**
literals match none of the three, and every one of them is accounted for here:

* **0.002623 · 0.004373 · 0.000889 · 0.005513 · 0.007308 · 0.003776 · 0.252809** — OBM-T1's
  numbers, quoted **verbatim from #389 item 3** inside a block quotation and explicitly marked as
  *"not predictions for this exam"*.
* **0.03053817271 · 0.19966368810 · 0.23911351607** — the **incorrect** pre-correction digits,
  quoted inside §DEVIATIONS item 8 as the thing that was corrected.
* **011** — the tail of the seed range `12,544,000–011` (the seed itself is 12,544,011 in the
  artifact's `seeds.reproLnc0SeedsRewalked`).
* **70582790** — the first eight hex characters of the X-DET digest, whose full 64 characters are
  in the artifact.
* **900,000,000** — the scratch-band floor, quoted from the seed-discipline canon.
* **266.3 · 270.2** — ruling numbers.
* **14,299,524** — the artifact's own **file byte count**, which is self-referential by
  construction and therefore lives in the doc rather than in the artifact (the `receipts` block
  says so in terms).

⛔ **NO PERCENTAGE IN THIS DOCUMENT RESTATES A STORED SHARE.** Every `%` character in the whole
file is either the interval level (the bootstrap's own 95 %) or the modulo operator inside a
quoted code line — `grep -n '%'` shows nothing else. Every share is the stored decimal with
its numerator and denominator beside it; the one place a rate is described in words — *"about one
completed pass in a hundred"* in §R5 — is a plain-language paraphrase standing next to its own
stored decimal (−0.011147) in the same section, not a second copy of it.
