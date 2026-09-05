# LN-T1 — 「让眼睛来站位」 THE LANE EXAM（眼睛能不能把挤人和弹回压下去，而且不弄坏别的东西）

> **STATUS at this commit: FREEZE.** §0, §P and §DEV-PREFLIGHT below are frozen **BEFORE any
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
0.96946182728 · `allFeaturesZeroShare` 0.03053817271 · feature means
[0.16982029234, 0.46261048827, 0.19966368810, 0.23911351607] over 7,990 samples — the percept
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

## §HONEST LIMITS

*(written at the RESULTS commit — this is the ONE home for the list, and the artifact stores
none)*

---

## §DEVIATIONS

*(written at the RESULTS commit; **required even if it reads "none"**)*
