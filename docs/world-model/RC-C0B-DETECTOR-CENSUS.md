# RC-C0b — THE DETECTOR CENSUS（他是不是要传了、是不是传给我：从身体上读得出来吗）

> **The census that licenses (or blocks) the FACING LIMB.** Authorized by **COMMANDER RULING
> #372 item 6**, whose scope is **#371 item 5 VERBATIM**. Bound by
> [`RC-RECEIVER-COOPERATION-CONTRACT.md`](RC-RECEIVER-COOPERATION-CONTRACT.md)
> **§2-AMENDMENT M-RC.3b — THE READY LIMB**, which names this census as its precondition in
> exactly these words: *"⚠ Its belief needs a PRE-STRIKE external detector ("a same-side
> carrier is holding and turning", from ball.owner / carrier speed / heading angular speed —
> never `pendingPassWindup`) whose calibration RC-C0 did NOT measure (its cue was read only on
> wind-up ticks). ⇒ **RC-C0b** … is REQUIRED before this limb."*
> Lineage: [`RC-C0-COOPERATION-CENSUS.md`](RC-C0-COOPERATION-CENSUS.md) (the census form of
> record, whose §P.A cue this census reuses BYTE FOR BYTE as the rank) →
> [`PT-C0-PLAYTEST-FORENSIC-CENSUS.md`](PT-C0-PLAYTEST-FORENSIC-CENSUS.md) (the DOSED
> composition and the BK `BodySector` classifier, **CALLED**) → RC-T0 →
> [`RC-T1A-PRECUE-EXAM.md`](RC-T1A-PRECUE-EXAM.md) (the corrected hash ORDER and the
> artifact-reload receipt) → **#372**.
> Instrument: `scripts/probes/rc-c0b-detector-census.ts`.
> Artifact: `docs/world-model/data/rc-c0b-detector-census.json`
> (**or its `.RED.json` SIDE PATH** if any gate is red — the red-routing idiom, #334 item 5).
>
> ⛔ **THIS IS A CENSUS.** It publishes MEASUREMENTS. It scores no hypothesis, arms no
> mechanism and makes no football claim. **IT ADJUDICATES NOTHING** except the ONE
> pre-committed licence rule frozen at §P.C, whose verdict word it PRINTS FROM THE RULE —
> the commander rules.
> ⛔ **X-SRC-ZERO**: no file under `src/` is created or edited. The probe CALLS the shipped
> exports and reads `Match` state per tick. **THERE IS NO WRAPPER AT ALL** — `gLockstep`
> proves observed ≡ unobserved byte for byte.
> ⛔ **WORLD 12'S COMPOSITION AND BYTES ARE UNTOUCHED** (contract M-RC.5): this stage is Road
> B, the user's world-12 play-test gate stays open in parallel, and no world 13 is cut here.
> ⭐ **TWO NEW CANONS APPLY FROM THIS INSTRUMENT ON** (#372 items 3 and 5): the artifact is
> written as **COMPACT JSON**, and a **NON-body receipt field** records that the body hash
> reproduces from the written file.

## §0 THE WORDS OF RECORD, AND WHAT THIS CENSUS IS FOR

**Ruling #371 item 5, the scope this census instruments, VERBATIM:**

> *"⭐⭐ **RC-C0b — PRE-SCOPED (the facing limb's detector census; dispatched at the fix's
> banking, definitions frozen at the executor's §P):** THE QUESTION — can a receiver tell,
> from EXTERNAL fields alone and BEFORE the strike, that a same-side carrier is about to pass,
> and to whom — and what would turning to face him cost? (a) THE DETECTOR TABLE: over every
> open-play tick a same-side body OWNS the ball ("carrying ticks"), the truth label = a wind-up
> is live for that owner (`pendingPassWindup.gid === owner.gid` — the census's right, never the
> seat's); the EXTERNAL cell = the carrier's speed bin × his heading angular-speed bin
> (|Δheading|/tick) × my alignment rank (RC-C0 §P.A's cue); publish P(wind-up live | cell) with
> counts, the base rate P(wind-up live | carrying tick), and P(wind-up live ∧ target = me |
> cell) — the table the READY limb's belief would use. ⭐ PRE-COMMITMENT: the limb is LICENSED
> iff a cell family frozen IN ADVANCE (the executor names it at §P from the engine's own grain
> — e.g. the top angular-speed decile ∧ rank 1) identifies a live wind-up resolvedly ABOVE the
> base rate (CI separation); otherwise the receiver cannot tell a wind-up from a dribble by the
> body alone — the facing limb has no honest pre-strike percept and returns to the commander
> with the look and the offer channel named. (b) THE FACING GEOMETRY of the TARGET during the
> wind-up: at the arm tick and the last pre-release tick, the sector the ball WOULD meet if
> struck now (the BK `BodySector` classifier CALLED with the passer→target approach), the turn
> he would need (θ between his heading and the bearing to the passer) and its cost in ticks at
> `TURN_RATE` against W — the room and the price of the limb. (c) THE COST OF FACING, a code
> fact: does the engine charge MOVEMENT for a heading misaligned with velocity (`steering.ts` /
> `physical.ts`, anchored)? If yes, "face the passer while drifting" costs metres and the limb
> has a trade; if free, the realism gap (VISION S11: 转身/低速仍是胶水) is stated, not hidden.
> ARMS: world 12 EMPTY-BOOK and DOSED, paired on shared seeds (the detector concerns the
> passer's body — expected book-independent; the dosed arm shows whether matured books change
> wind-up frequency or geometry). X-SRC-ZERO. Block **12,536,000–999**; scratch
> 900,002,200–299; ZERO stats; registry 73; the census form (RC-C0 / PT-C0); standing orders of
> record."*

**Ruling #372 item 4's strategic sentence, VERBATIM** — why this census exists at all:

> *"⭐ THE STRATEGIC SENTENCE: **the dosed gap is 2.756300 m with matured books — the
> cooperation gap is NOT a book problem.** In the world the user plays the reaction lever is
> spent by the book (M-PC.3 working as designed); the receiver's remaining problem is his
> BODY — side-on 0.571574 on completed passes (PT-C0)."*

### in plain football language

The last limb we built made the receiver **react faster** to a pass once it was struck. In the
novice world that bought something; in the world the user actually plays, the players already
know the pass is coming — their books are full — so it bought nothing. And the receiver is
**still 2.76 m away when the ball arrives**, and still takes it **on his side two times in
three**. That is not a reaction problem any more. It is a **body** problem: he is standing the
wrong way round.

The next limb would have him **turn toward the passer before the ball is struck**. Three things
have to be true first, and this census measures all three.

1. **Can he tell a pass is coming at all?** Not from the truth object — from the passer's
   **body**: how fast he is moving, how hard he is swinging his shoulders round, and how
   squarely that swing points at *me*. Over every single tick a teammate has the ball, how
   often is a pass actually being wound up? And in the moments where he is turning hard and
   turning onto *me* — how much more often? If the answer is "no more often than usual", the
   receiver has nothing honest to believe on and the limb is dead.
2. **Is there room, and would it help?** During the wind-up, which side of the target's body
   would the ball actually hit if it were struck right now — his front, his flank, or his back?
   How far would he have to turn to face the passer, and could he finish that turn before the
   ball leaves the foot?
3. **What would turning cost him?** In real football, opening your body while you drift costs
   you a step. Does this engine charge for that at all? That is a question about the code, not
   about the pitch, so it is answered by reading the code and proving it with a fixture.

⛔ Nothing here is decided. The census publishes the three answers, prints the ONE frozen
verdict word, and stops.

## §P THE FREEZE (all of it BEFORE any battery seed)

### §P.A THE POPULATION AND THE LABEL

| quantity | frozen form |
|---|---|
| **THE POPULATION** | **every OPEN-PLAY tick** (`match.phase === 'playing'`) on which a body **OWNS** the ball (`ball.owner !== null`, `sentOff === false`) — **"carrying ticks"**, **BOTH SIDES**. Read at the END of each `m.step(DT)` — there is no wrapper. |
| **⭐⭐ THE TRUTH LABEL** | `L = 'windup'` iff `pendingPassWindup` is live for that owner (`pendingPassWindup.gid === owner.gid`) at a **PRE-RELEASE tick** (`tick < readyTick`); else `L = 'carry'`. |
| **THE TICK INDEXING** (RC-C0 §P.A's own, anchored with line receipts) | `armPendingPass` writes `readyTick = this.stepCount + wTicks + bkTicks` during the brain phase of the arm tick, and `resolvePendingPassWindup` runs at the **HEAD** of the step whose `stepCount >= readyTick`, behind `if (!this.o1PassWindup \|\| pp === null \|\| this.stepCount < pp.readyTick) return;`. The probe reads state **after** `m.step(DT)`, so the record is observable at the END of ticks **t0 … readyTick − 1** (THE PRE-RELEASE TICKS) and the **RELEASE tick is `readyTick`**. |
| **⭐ THE CENSUS'S RIGHT, STATED** | the instrument reads `pendingPassWindup.{gid, targetGid, readyTick}` **ONLY to LABEL** the tick and the target. **THE CELL IS COMPUTED FROM EXTERNAL FIELDS ALONE.** This is the census's right (#371 item 5) — and it is **not** the seat's: RC-T0b's percept may not read any of those fields (contract M-RC.1). |
| **"ME" — THE OBSERVER POPULATION** | every same-side **OFF-BALL** body that is not the owner and is on the pitch (`sentOff === false`) — **all five in 6v6, the KEEPER INCLUDED** (RC-C0 §P.A's population, the authority of record at ruling #370 item 3). |

### §P.B THE EXTERNAL CELL — the read set, stated

**THE CELL = (carrier SPEED bin × carrier heading ANGULAR-SPEED bin × my alignment RANK).**

**⭐⭐ THE READ SET.** The cell reads **the owner's `pos`, `heading` (at this tick and the
previous tick) and `vel`, plus my own `pos` — and NOTHING ELSE.** ⛔ Not `faceTarget`, not
`pendingPassWindup`, not `pendingPass`, not `action`/`scores`, not any TeamBrain designation,
not `info.genome`. `gCueChannel` proves it with a fixture (two carriers, identical external
state, different private commitments ⇒ **byte-identical cell vector**; and two live negative
halves — reversing the external heading, or changing the external velocity, **does** move it).

| axis | frozen form | anchored to |
|---|---|---|
| **SPEED** | `\|owner.vel\|` in m/s, bins **[0,1) · [1,2) · [2,3.5) · [3.5,5) · [5,∞)** (5 bins) | the shipped `BASE_SPEED` role table (top entry **7.9**) × the pace span (`0.88 + attrs.pace · 0.24`, so ≤ 1.12) and the PURE `topSpeed` getter (`baseSpeed · (0.62 + 0.38 · stamina)`) — together they cap any body **under 8.9 m/s**, so the top bin is genuinely open and the four edges cut the walk / jog / run / sprint span the engine actually produces |
| **ANGULAR SPEED** | the angle between the owner's `heading` **at this tick** and **at the previous tick**, divided by `DT` — rad/s; bins **[0,0.5) · [0.5,2) · [2,4) · [4, TURN_RATE]** (4 bins) | **`TURN_RATE = 6.5`**, the engine's own cap (`Player.ts`, anchored). No body can exceed it, so the top bin is "turning at **60 %+ of the fastest a body can turn**". A tick whose angular speed is not finite (a degenerate heading) enters **NO** cell |
| **RANK** | **RC-C0 §P.A's cue BYTE FOR BYTE**, extended from the argmin to the whole vector: θ_i = the angle between the owner's `heading` and `unit(mate_i.pos − owner.pos)`; `rank(i) = 1 + #{ j ≠ i : θ_j < θ_i, or (θ_j === θ_i and gid_j < gid_i) }` over the **FINITE** entries. **Rank 1 is EXACTLY RC-C0's `argminFinite`** (strict argmin, ties to the **LOWEST gid**). Bins **1 · 2 · 3 · 4 · 5 · ≥6** (6 slots) | RC-C0 §P.A, and the `heading` declaration in `Player.ts` |
| **DEGENERATE** | a bearing of length ≤ 1e-6 (mate standing ON the carrier) or a heading of length ≤ 1e-6 names no angle ⇒ **NaN**, and that mate is **EXCLUDED** from the tick (RC-C0's own rule) | — |

**⇒ 5 × 4 × 6 = 120 CELLS.** Per cell the census stores **COUNTS**: `cellTicks` (carrying ticks
× mates falling in the cell), `cellWindup` (label `windup`), `cellWindupTargetMe`
(label `windup` ∧ `pendingPassWindup.targetGid === my gid`).

**⚠ THE PER-TICK BASE COUNTS ARE STORED SEPARATELY**, independent of me: `carryTicks`,
`windupTicks`, `carryTicksPressed`, the per-**TICK** speed and angular-speed histograms by
label, and `mateSumByLabel` (Σ over ticks of the finite-ranked mate count). **So
P(wind-up | carrying tick) — THE BASE RATE — re-derives WITHOUT the mate multiplicity**, and
`gBaseRateConsistency` proves the two tiers agree exactly (Σ per-cell counts = the recorded Σ
multiplicity; ⚠ never a constant 5, because a sending-off changes it).

**THE FACES OF (a).** the base rate per arm · P(wind-up | cell) for **every** one of the 120
cells (stored as counts — the table the READY limb's belief would use) · P(wind-up ∧ target =
me | cell) · the **MARGINALS** by each axis alone (5 speed + 4 angular-speed + 6 rank, per
arm) · the **LIFT** of F over the cell-tier base rate · and the frozen family's own block below.

### §P.C THE FROZEN FAMILY F, THE LICENCE RULE, AND THE COVERAGE/PRECISION FACES

**⭐⭐ THE FROZEN CELL FAMILY F = the TOP angular-speed bin `[4, TURN_RATE]` ∧ RANK 1** —
**「他正在转向我」**: the carrier is swinging his body at 60 %+ of the fastest a body in this
engine can turn, and of all his mates I am the one his heading points nearest to. This is the
natural candidate the commander named (#371 item 5 / #372 item 6), and it is cut **from the
engine's own grain**: the angular-speed edge is a fraction of `TURN_RATE`, the shipped cap, and
rank 1 is RC-C0's own argmin. **No taste constant enters.** F is the **union over all five
speed bins** — the family says nothing about how fast he is running (cells 18, 42, 66, 90, 114).

> **⭐ THE PRE-COMMITMENT (exact form, frozen here BEFORE any battery seed):**
> **LICENSED** ⇔ the 95 % cluster-bootstrap CI of
> **Δ_F = P(wind-up \| F) − P(wind-up \| carrying tick)** lies **ENTIRELY ABOVE ZERO**
> (`ciLo > 0`) on the **EMPTY-BOOK arm** (the exam form).
> **BLOCKED** ⇔ otherwise (the interval contains zero, or lies entirely below it) — the
> receiver cannot tell a wind-up from a dribble by the body alone, and **the FACING LIMB
> RETURNS TO THE COMMANDER with the look (the O2 scan, built and unwired) and the OFFER
> CHANNEL (要球) NAMED** as the alternatives.
> **The DOSED arm's Δ_F is REPORTED beside (the user's form) and is NEVER gated.**

The verdict **word** is printed from the rule; the per-seed cells it re-derives from are stored,
and `gFaces` re-derives the verdict itself off the serialized artifact. **This executor does not
act on it — the commander rules.**

**PUBLISHED BESIDE THE RULE, NEVER PART OF IT:**

* **THE COVERAGE OF F** = the share of all **(wind-up tick × TARGET mate)** pairs that fall in F
  — **the limb's SENSITIVITY**: how often the family would fire at all for the man the pass is
  actually going to.
* **THE PRECISION FOR THE TARGET** = **P(the target is me \| F ∧ a wind-up is live)** — when the
  family fires on a live wind-up, how often is the believer the right man.
* **Δ_F with its `|Δ|÷half-width` ratio** (canon, VERBATIM: *"a starred finding states its
  |Δ|÷half-width ratio"*), and the LIFT of F over the **cell-tier** base rate
  P(wind-up | any cell) — ⚠ a **different denominator** from the licence rule's per-tick base
  rate, and labelled as such in the artifact.
* **⭐ THE BEST CELL, REPORTED, NEVER A RULE**: the cell with the highest P(wind-up | cell)
  among cells with **n ≥ 1,000** (carrying tick × mate) pairs. **The floor is frozen here,
  before the battery**, so the winner cannot be a rare cell picked after sight.

### §P.D THE FACING GEOMETRY (b)

**POPULATION**: every wind-up observed (the RC-C0 group-(a) population — cancellations
included, since a cancelled wind-up still gave its evidence away), **the TARGET only**.
**INSTANTS**: the **ARM tick t0** (the first tick the record is observable from state) and the
**LAST pre-release tick**.

| quantity | frozen form |
|---|---|
| **⭐⭐ (i) THE SECTOR the ball WOULD meet if struck now** | the BK law's **OWN** classifier, **CALLED** (never re-implemented): `ballAccessGeometry({ pos: target.pos, bodyDir: target.heading, coreRadius }, { pos: passer.pos, radius: BALL_RADIUS }, CONTROL_RADIUS).sector`. `front` ⇔ `facingCos ≥ Math.SQRT1_2`, `back` ⇔ `facingCos ≤ −Math.SQRT1_2`, else `side`. The classifier reads **only the UNIT direction target→ball**, and the ball would come **FROM the passer**, so passing the passer's own position gives the approach direction **exactly**. The five-line classifier is **anchored VERBATIM**; the vocabulary is read off `BodySector`'s own union. Counts per instant |
| **(ii) THE TURN he needs to FACE the passer** | the angle between his `heading` and the bearing target→passer — the same pure `cueAngle` the cell uses, with the roles swapped. **5° bins to 180°, stored**; the median is **bin-derived** |
| **(iii) THE TICKS that turn needs, against the window** | `turnTicks = ceil(turn / (TURN_RATE · DT))`, read at the **ARM instant t0**, against **W = readyTick − t0**. Published as the **SHARE with `turnTicks ≤ W`** (the targets who could complete the turn inside the window) and the **SIGNED distribution of `turnTicks − W`** (1 tick × 41 bins, centre holds 0) |
| **(iv) THE SHARE ALREADY FRONT-ON** at each instant | the `front` share of (i) |
| **THE CONTRAST** | the **EMPTY-BOOK vs DOSED** contrast on every one of these is **REPORTED, PAIRED ON SEEDS** — never gated |

### §P.E THE COST OF FACING (c) — A CODE FACT, FROZEN HERE

**⭐⭐ FACING THE PASSER WHILE DRIFTING IS FREE IN THIS ENGINE.**

`Player.physicsStep` (`src/sim/Player.ts`) does exactly three things in this order, and every
line of it is anchored with a line receipt in the artifact's `anchoredSites`:

1. it derives the velocity from `desiredVel` **clamped by `topSpeed` alone**
   (`const dv = this.desiredVel; const max = this.topSpeed; const dl = …// clampLen`) and
   rate-limits the change by **`accel · dt`** (`const maxDelta = this.accel * dt; // approachV`)
   — **the heading appears in neither expression**;
2. it advances the position **from the velocity**
   (`this.pos.x = this.pos.x + this.vel.x * dt;` …) — **before the heading is touched at all**;
3. **only then** does it rotate `heading` toward `faceTarget` (*"backpedal, 27.5"*) or, failing
   that, toward the movement direction, capped at `TURN_RATE` — a block that **WRITES**
   `heading` and never reads it back into `vel` or `pos`.

The shipped docstring says it in the source's own words: the body direction *"remains
independent of velocity direction"*. ⇒ **A body whose heading is misaligned with its velocity
does NOT move slower, does NOT accelerate less, and its velocity is NOT turned toward its
heading.**

**THE FIXTURE** (`gWalkFixtures`) proves the magnitude rather than asserting it: two identical
bodies are driven toward the same far target for **120 ticks (2 sim-seconds)** at their own
`topSpeed`, one with `faceTarget` set **90° off its velocity** and one with none. The published
face is the **DISTANCE RATIO**. The fixture's own **liveness** is asserted beside it — the faced
body's heading really did leave its movement direction (the angle is published in radians), so a
ratio of 1 cannot be a fixture that did nothing.

**⚠ THE REALISM GAP IS NAMED, NOT HIDDEN: VISION S11 — 转身/低速/受压仍是胶水.** A real receiver
who opens his body to the passer pays in pace and in the first step. This engine charges him
nothing. That makes the READY limb **cheap**, and it makes "cheap" a property of the *model*,
not of football.

### §P.F THE ARMS — two, PAIRED on shared seeds

Arm `k` walks seed `s` with the **IDENTICAL population construction** (RC-C0's own `buildMatch`
plumbing: genomes and squads drawn from the seed exactly as it does, the same 240 s match), so
the two arms differ **ONLY** in the two DOSES and every (b) contrast is **PAIRED per seed**.

| arm | composition — the composer **CALLED, never copied** | gate on the match |
|---|---|---|
| **E** | **world 12 EMPTY-BOOK — the exams' form**: `a4MatchFlags(12)` + `armA4World(m, null, 12)` | `raArmedVersion(m) === 12` |
| **D** | **world 12 DOSED — THE FORM THE USER PLAYS**: `a4MatchFlags(12)` + `armA4World(m, null, 12, l3Dose, pcDose)`, the doses from the **SHIPPED LOADERS THEMSELVES** (`loadL3Dose` / `loadPcDose`, CALLED) | `raArmedVersion(m) === 12` |

**⛔ NEITHER ARM ARMS `rcAnticipate`.** The seat is **not the census's business**: `gWorld`
asserts, on every walked match of both arms and on both construction receipts, that the
`rcAnticipate` match flag is **FALSE** and that `rcAnticipationWeightOf` returns **null** on
**both** teams — the gene is provably **ABSENT**.

**THE DOSE PINS.** `gDoseSource` hashes the **FILE BYTES this process read** from the two paths
the loaders name and compares each against the **BYTE-HASH OF RECORD pinned from PT-C0's
artifact `doseSource.files`** — discharging #369 §COMMANDER CORRECTIONS item 2(i) (*"any future
dosed arm PINS those two byte-hashes as expected values"*). Canon, VERBATIM: *"a dose-source
guard should hash the bytes it reads, not a self-declared field"* (home:
`BU-T1-MT-COMPOSITION.md` §COMMANDER CORRECTIONS item 6).

* `docs/world-model/data/l3-t1-convergence-exam.json` → `a41a114c…37db`
* `docs/world-model/data/pc-t1-learning-exam.json` → `0301d710…982f`

If the doses had not been reachable the instrument would **REFUSE TO RUN** (`process.exit(3)`)
rather than silently approximate one.

**NO WRAPPER.** Observation = per-tick reads of `Match` state after each `m.step(DT)`.
`gLockstep` proves observed ≡ unobserved byte for byte on out-of-band scratch seeds anyway, on
**both** arms.

### §P.G SEEDS AND SIZING

* **Block 12,536,000–999**: battery seeds **12,536,000–12,536,998** (**N_FROZEN = 999**),
  construction receipt **12,536,999** — the two arms **SHARE** every seed, so the walk count is
  (999 + 1) × 2 = **2,000**. **BOOKED = WALKED.** The block is consumed WHOLE and the tail is
  EMPTY. Smokes on out-of-band scratch **900,002,200–211**; lockstep on **900,002,290–291**.
* **Stats consumed: ZERO.** Registry **73** untouched.
* **Env whitelist**: `RCC0B_MODE`, `RCC0B_N`, `RCC0B_OUT` — any other `RCC0B_*` or any engine
  door env aborts the run with exit 3, and an override run may never write a canonical path.
* **SIZING** (the RC-C0 §15 house form; §DEV-PREFLIGHT's smoke is the variance source):

| face | realised hw (12 clusters) | target | N required | resolvable at 999 |
|---|---|---|---|---|
| `delta.deltaF.E` (§P.C, **THE LICENCE**) | 0.028115630379545453 | 0.05 | **8** | ✅ |
| `E.facing.frontShareAtLast` ((b), empty book) | 0.04429968819737651 | 0.05 | **20** | ✅ |
| `D.facing.frontShareAtLast` ((b), dosed, beside) | 0.05005827442744923 | 0.05 | **25** | ✅ |

  All three rows resolve; **N_FROZEN takes the block's own maximum — 999 shared seeds** — so the
  realised half-widths are expected to beat the 0.05 target comfortably. ⚠ 12 clusters is a
  **NOISY** variance estimate, said here before the battery.
* **Bins** (frozen): speed edges `[1, 2, 3.5, 5]` · angular-speed edges `[0.5, 2, 4]` · rank 6
  slots · turn-to-face 5° × 36 · turnTicks 1 × 31 · (turnTicks − W) signed 1 × 41 · W 1 tick ×
  32 · the 3-label `BodySector` vocabulary · the 23-label `ActionType` vocabulary + overflow.
  **Estimator**: cluster bootstrap, clusters = seeds, **2,000 draws**, rng seeded from the block
  base. **Medians are BIN-DERIVED** so `gFaces` re-derives every one off disk — canon, VERBATIM:
  *"the re-derivation gate covers EVERY published face; a percentile face requires stored
  bins"* (home: ruling #287 item 1 + `PC-C0-REACTION-BASELINE.md` §COMMANDER CORRECTIONS item 4).

### §P.H THE GATES (all liveness/receipt — NEVER direction)

`gWorld` (both arms: `raArmedVersion === 12`, `rcAnticipate` FALSE, the gene ABSENT) ·
`gGenomeClean` (`info.genome` never written — canon: dose placement, #270.2 / #334 item 1) ·
`gDoseSource` (the two byte-hashes **PINNED**) · `gAnchoredConstants` (**anchored extraction
with line receipts** for `TURN_RATE` · `BASE_SPEED` and the PURE `topSpeed` getter · `ACCEL` ·
`AI_INTERVAL` · `CONTROL_RADIUS` · `BALL_RADIUS` · `TOUCH_CONTROL_DIST` · the `BodySector` union
**and** the law's five-line sector classifier VERBATIM · **the four lines of the heading
integrator that carry §P.E's code fact** · `pendingPassWindup`'s own field list and the three
TICK-INDEXING sites · world 12's flag composition and arming lines and `armA4World`'s dose
parameters · the dormant `rcAnticipate` flag and `rcAnticipationWeightOf` · the `ActionType`
vocabulary) · `gCueChannel` (**the RC-C0 fixture form**: identical external state, different
private target ⇒ identical CELL; two live negative halves) · `gWalkFixtures` (the angle and rank
arithmetic, the angular-speed arithmetic against `TURN_RATE`'s own cap, the frozen bin edges,
the cell index, the turn-ticks ceil, **the sector classifier CALLED on constructed geometries**,
every bin helper, and **the (c) coupling fixture**) · `gClassesNonVacuous` (both labels live on
both arms; **F non-empty on both arms**; the target population live; both facing instants
populated) · `gBaseRateConsistency` (**the two tiers agree exactly**) · `gLockstep` ·
`gSrcUntouched` (`git diff --stat HEAD -- src` **AND** `git status --porcelain -- src` both
empty — canon: xSrcUntouched) · `gSeedsBookedEqualWalked` · `gN` (N_FROZEN honoured) ·
`gHashOrder` (**the corrected order**; its NOTE derives from the pinned values it checks —
canon, VERBATIM: *"a gate's NOTE derives from the same pinned values the gate checks; a count
typed beside its pin is a second copy"*) · `gFaces` (**EVERY** published face, Δ, bin, median,
**the licence WORD**, the family's **coverage and precision re-derived straight off the
serialized cell table**, the best cell under its frozen floor, the tier consistency, the (c)
fixture ratio and every sizing row, all re-derived off the **SERIALIZED** artifact off disk).
**Plus the NON-body receipt `receipts.hashReproducesFromFile`.**

Canon quoted where it applies — VERBATIM: *"the hashed body is built from an explicit ALLOWLIST
SCHEMA — a field not in the schema never enters the body; forbidden-name lists are retired"*
(home: `PC-T0-LATENCY-SEAM.md` §COMMANDER CORRECTIONS item 1); VERBATIM: *"the body hash is
computed after every body key is assigned, and a NON-body receipt field records that the hash
reproduces from the written file"* (home: `RC-T1A-PRECUE-EXAM.md` §COMMANDER CORRECTIONS item 3,
ruling #372 item 3); VERBATIM: *"an artifact is written as compact JSON — no indentation; the
hash is over the canonical body regardless; pretty-printing is a reader's tool, not a storage
form"* (home: ruling #372 item 5); VERBATIM: *"a src-extracted constant pins its extraction to
the NAMED call site — anchored match + line receipt — never first-occurrence"* (home:
`BK-C0-BODYBALL-CENSUS.md` §COMMANDER CORRECTIONS item 1, ruling #306 item 4); VERBATIM: *"a
field carries the unit its name claims"* (home: ruling #294 item 3); VERBATIM: *"a scored face's
walk-side predicate is pinned — anchored extraction or fixture — because the re-derivation gate
proves arithmetic, not definitions"* (home: `DF-T3-SURFACE-EXAM.md` §COMMANDER CORRECTIONS item
2); VERBATIM: *"a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a
gated face"* (home: `PC-T2-ARMED-WORLD-READ.md` §COMMANDER CORRECTIONS item 4); VERBATIM: *"a
starred finding states its |Δ|÷half-width ratio"* (home: `BU-T0B-PRICE-SEPARATION.md` §COMMANDER
CORRECTIONS item 2); VERBATIM: *"a stage doc's HONEST LIMITS list is the ONE home; the artifact
stores that list verbatim or stores none"* (home: `RC-C0-COOPERATION-CENSUS.md` §COMMANDER
CORRECTIONS item 3, ruling #367 item 3) — **this artifact stores `honestLimits: null`; the list
below is the ONE home**; VERBATIM: *"verifier scratch walks use the stage's own consumed band or
the out-of-band scratch range (≥ 900,000,000) — never the next virgin block"* (home:
`PW-T0C-OBJECTIVE-FIDELITY.md` §COMMANDER CORRECTIONS item 6). No fixture here is
worker-simmed, so the worker-fixture canon is named and NOT invoked: VERBATIM *"WORKER-SIMMED
fixtures play the SHIPPED world (League.toJSON omits matchFlags; true since #155, stated now,
test-pinned; refines #270's E4 correction; matches the perf diagnostic)"* (home: ruling
#283.2(iv)) — every fixture in this instrument is a PURE arithmetic table or a direct call of a
shipped pure function, and every simmed walk is a real `Match` built by world 12's own composer
in-process.

## §DEV-PREFLIGHT — the sizing smoke, disclosed in full

A **12-cluster scratch smoke** (`RCC0B_MODE=smoke RCC0B_N=12`, seeds **900,002,200–211**,
lockstep on **900,002,290–291**, artifact off the canonical path under `/tmp`) was run **BEFORE
this freeze**. Its realised half-widths were read out of the smoke artifact's own
`deltas[].halfWidth` / `faces[].halfWidth` fields — **never re-typed from the console's rounded
print** — and are hardcoded in the instrument's `SIZING_INPUTS` (the three rows in §P.G's table).

**Disclosed honestly:**

* On the first 12-cluster run **`gN` was RED by construction**: `SIZING_INPUTS` still carried
  placeholder half-widths of `0.0`, so `nRequired` was 0 and `SIZING_OK` was false, and the
  artifact routed to its `.RED.json` side path — which is exactly what the red-routing idiom is
  for. **Two other gates were also red on that first run, and both were instrument defects
  caught and fixed BEFORE the freeze, with the fixes stated here:**
  (i) `gWalkFixtures` — the (c) coupling fixture's **liveness** assertion demanded the faced
  body's heading be exactly `(0, 1)`; it converges to 90° **plus a hair**, because the aim point
  is taken at the START of the tick and the body advances a few centimetres inside it. The
  assertion was rewritten as the **ANGLE** between the faced body's heading and its velocity
  (> 1.5 rad), and the angle itself is now a published field. **The distance-ratio assertion —
  the fixture's actual finding — was never in question and never changed.**
  (ii) `gFaces` — 44 of the 120 × 2 per-cell faces are **EMPTY cells** whose `value` is `NaN`,
  and **JSON has no NaN**: they round-trip as `null`. The re-derivation check was corrected to
  accept `null` **exactly where the re-derivation itself is NaN, and nowhere else**.
  After the half-widths were filled in, the same 12-cluster smoke re-ran **14/14 GREEN**, with
  `gFaces` at **401/401 face-and-Δ** and **33/33 stored-bin / median / VERDICT / family-coverage
  / family-precision / best-cell / tier-consistency / (c)-fixture / sizing** checks.
* ⚠ **12 clusters is a NOISY variance estimate** — a strictly weaker assumption than sizing off
  a published battery. Said here, before the battery.
* ⚠ The smoke's own POINT readings are **UNPOWERED and bind nothing**. For the record, so nobody
  can claim the freeze was written after seeing a battery: the smoke read base rate ≈ 0.0925,
  P(wind-up | F) ≈ 0.381, Δ_F ≈ +0.289, coverage ≈ 0.361, precision ≈ 0.411; front-on at the last
  pre-release tick ≈ 0.351, side ≈ 0.539, back ≈ 0.110, turn ≈ 71.1°, turnTicks ≈ 12.1 against
  W ≈ 10.1 with ≈ 0.504 completable; best cell #90 (speed bin 3 × top angular-speed bin × rank 1)
  at ≈ 0.552 on n = 1,714; and the (c) distance ratio **exactly 1**. **None of these numbers is a
  finding**; the battery's own §R replaces every one of them.
* The smoke ALSO confirmed instrument liveness: both labels populated on both arms, F non-empty
  on both arms, both facing instants populated, `gCueChannel` green **including both negative
  halves**, and the two dose byte-hashes matching their pins.
* **This section binds nothing.** The freeze is §0–§P.H above.

## §R RESULTS (results commit; every number below QUOTES the artifact's own fields at 6 dp —
## the artifact is the numbers of record, per the #357 standing order)

**RUN RECEIPTS.** Freeze **`76f212d`**. `git diff 76f212d..<results> -- scripts/probes/rc-c0b-*.ts`
is **EMPTY** — no frozen constant, bin edge, family, floor or rule moved after sight. **14/14
gates green**; `gFaces` **401/401 face-and-Δ** checks and **33/33 stored-bin / median / VERDICT /
family-coverage / family-precision / best-cell / tier-consistency / (c)-fixture / sizing** checks
re-derived from the SERIALIZED artifact off disk. Artifact
`docs/world-model/data/rc-c0b-detector-census.json`, **COMPACT JSON** (the new canon: the file
opens `{"stage":{"id":"RC-C0b",…` with no indentation), **4,359,578 bytes**,
`instrumentSha256 = fc8c17b72a19a0f188f9961e6027e72ee03351292eb712165cd4e6864167aeb0`,
`hashedBodySha256 = 37cdff0b108e24ea0517882e089387c0a4e2124b221c0984c0b7d96606edf41b`,
**file byte-hash `a07d5692879f98173b7b470ed47b704525dd5236ec6573026b8f334d95bd0f83`**.
⭐⭐ **THE HASH RECEIPT, OUTSIDE THE BODY**: `receipts.hashReproducesFromFile` = **true** — the
instrument re-read the written file and recomputed the 31-key body hash equal to the recorded
one (and an independent re-implementation of `canonicalJson` outside the instrument reproduces
`37cdff0b…f41b` from the published file as well). Battery **999 shared seeds
(12,536,000–12,536,998) × 2 arms + the construction receipt 12,536,999 in both arms, BOOKED =
WALKED = 2,000 walks** — block 12,536,000–999 **CONSUMED WHOLE, the unwalked tail is EMPTY**
(`seeds.unwalkedTail = null`). Lockstep on scratch 900,002,290–291 (both arms); the sizing smoke
on scratch 900,002,200–211. **ZERO stats consumed** — registry **73**. `npm run typecheck` clean
with the probe in the tree; `npm run fingerprint` =
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — **the literal of record in
`tests/a4HomeGrant.test.ts`, UNCHANGED** (a census cannot move it). Wall **202.139 s**
(`perf.meanWallSecondsPerMatch` **0.098969**).

### §R1 (a) THE DETECTOR TABLE — ⭐⭐ **LICENSED** (the frozen §P.C rule's own verdict word)

| arm | base rate P(wind-up \| carrying tick) | P(wind-up \| F) | ⭐⭐ Δ_F | \|Δ\|÷hw | coverage of F | precision for the target |
|---|---|---|---|---|---|---|
| **E (empty book)** — **THE RULE** | **0.101168** [0.098965, 0.103577] | **0.399333** [0.394385, 0.404106] | **+0.298165** [0.295059, 0.301409] | **93.899398** | **0.339729** [0.335637, 0.343652] | **0.379738** [0.375162, 0.384241] |
| **D (dosed)** — REPORTED beside | 0.103365 [0.100844, 0.105881] | 0.389957 [0.385117, 0.394747] | **+0.286592** [0.283547, 0.289671] | 93.599981 | 0.329053 [0.325154, 0.333011] | 0.367903 [0.363472, 0.372495] |

Denominators: the empty-book base rate on **4,181,862 carrying ticks**; P(wind-up | F) on
**947,825** (carrying tick × mate) pairs; the coverage on **423,072** (wind-up tick × target
mate) pairs.

**⭐⭐ THE VERDICT, PRINTED BY THE FROZEN RULE: `LICENSED`.** Its own sentence, verbatim from
`licence.reading`: *"THE FROZEN FAMILY F IDENTIFIES A LIVE WIND-UP RESOLVEDLY ABOVE THE BASE
RATE on the EMPTY-BOOK arm — the READY limb has an honest PRE-STRIKE percept to believe on. Its
COVERAGE and its PRECISION for the target are published beside and are NOT part of the rule. Per
#371 item 5 the commander rules on what follows; this census adjudicates nothing else."*

**⭐⭐ THE HONEST DECOMPOSITION — ALL OF Δ_F IS THE TURNING AXIS, AND NONE OF IT IS THE
ALIGNMENT AXIS.** The census can split F because it published both marginals:

| contrast (empty book) | Δ | 95 % CI | \|Δ\|÷hw |
|---|---|---|---|
| `topAngVsCellBase.E` — the TOP ANGULAR-SPEED bin alone vs the cell-tier base rate | **+0.298178** | [0.295042, 0.301422] | **93.483541** |
| `rank1VsCellBase.E` — RANK 1 alone vs the same base rate | **−0.000070** | [−0.000118, −0.000024] | 1.493541 |

Δ_F (+0.298165) and the turning axis alone (+0.298178) are **the same number**. **The rank
carries no information at all about WHETHER a pass is being wound up — and it cannot, by
construction**: rank is a **PARTITION of the mates within a tick** (exactly one mate is rank 1,
one is rank 2, …), so P(wind-up | rank r) is the base rate itself up to sendings-off — and it is:
`E.marginal.rank0` **0.101168**, `rank1` 0.101168, `rank2` 0.101168, `rank3` 0.101169, `rank4`
0.101522, against a base rate of 0.101168. ⚠ **This is a structural fact about the axis, not a
finding about football, and it was not anticipated at §P.** The family F is licensed on the
strength of its angular-speed half alone.

**⭐⭐ WHAT THE RANK *DOES* CARRY IS THE OTHER QUESTION — 「传给谁」.** On the same denominator,
P(wind-up ∧ the target is me | rank r) falls monotonically: **0.042914** (rank 1) → **0.024323**
→ **0.017643** → **0.010794** → **0.005561** (rank 5). And inside F, the precision for the target
is **0.379738** against a mate multiplicity of **4.988062** — a believer who fires on F and
assumes the ball is for *him* is right nearly twice as often as a man picking uniformly among the
carrier's mates, and **wrong about three times in five**.

**THE FIVE CELLS OF F, PUBLISHED** (empty book; F is the union over the five speed bins):

| cell | speed bin | P(wind-up \| cell) | n |
|---|---|---|---|
| 18 | [0,1) | 0.528628 [0.521430, 0.535628] | 191,229 |
| 42 | [1,2) | 0.266593 [0.261909, 0.271334] | 238,667 |
| 66 | [2,3.5) | 0.298213 [0.293301, 0.303261] | 284,022 |
| 90 | [3.5,5) | 0.558926 [0.550930, 0.566718] | 134,660 |
| 114 | [5,∞) | 0.542263 [0.532962, 0.551364] | 99,247 |

**⭐ THE BEST CELL (REPORTED, floor n ≥ 1,000, frozen before the battery):** on **both** arms it
is **cell #94 = speed bin 3 × the top angular-speed bin × RANK 5** — empty book **0.559405**
(n = 133,440), dosed 0.554457 (n = 148,264). Its rank-1 twin, cell #90, reads **0.558926** — the
two differ in the fourth decimal. **The best cell is a rank-5 cell only because rank does not
matter to this question at all**; reported exactly as the frozen floor selected it, not re-cut.

**⭐ THE DETECTOR'S RAW MATERIAL** (per TICK, empty book; bins stored). The carrier's heading
angular speed is a near-switch: on **wind-up** ticks **0.894642** of ticks sit in the top bin
[4, TURN_RATE], against **0.151465** on carry ticks; the bottom bin [0,0.5) is **0.092029** on
wind-up ticks against **0.505764** on carry ticks. The carrier's **SPEED** separates far more
weakly: the top speed bin [5,∞) holds **0.139501** of wind-up ticks against **0.359988** of carry
ticks, and the four remaining bins overlap heavily (wind-up 0.270562 / 0.166931 / 0.222726 /
0.200280 against carry 0.253821 / 0.100406 / 0.140203 / 0.145581). The speed marginals say the
same: P(wind-up | speed bin) runs 0.107228 · 0.157746 · 0.151745 · 0.134139 · **0.041843** — a
sprinting carrier is the one who is *least* likely to be winding up.

### §R2 (b) THE TARGET'S FACING GEOMETRY DURING THE WIND-UP

| arm | instant | front | side | back | turn to face the passer (mean) |
|---|---|---|---|---|---|
| **E** | at the arm tick t0 | 0.325193 | 0.530665 | 0.144142 | 74.574757° |
| **E** | at the last pre-release tick | **0.346119** [0.341569, 0.350848] | **0.515405** | **0.138476** | **72.564729°** [72.077747, 73.017109] |
| **D** | at the arm tick t0 | 0.332746 | 0.528471 | 0.138784 | 73.787395° |
| **D** | at the last pre-release tick | 0.351862 | 0.511848 | 0.136289 | 71.736462° |

Denominators: 41,480 wind-ups (E) and 46,504 (D). Bin-derived medians: the turn is **65°** at
both instants on both arms.

**⭐⭐ THE ROOM, AND WHY IT IS TIGHT.** The turn costs **12.518756** ticks at `TURN_RATE`
(bin-derived median **12**) against a window of **10.273505** ticks — **0.171225 sim-seconds**
(bin-derived median **8** ticks). **`turnCompletableInWShare` = 0.453206** [0.448257, 0.458129]:
**fewer than half** of targets could finish the turn inside the wind-up even if they started at
the arm tick and turned at the engine's maximum rate the whole way. The bin-derived median of
(turnTicks − W) is **+2** ticks, and the stored signed histogram's top slot (turnTicks − W ≥ +20)
holds **1,757** of the 41,480 wind-ups.

**⭐ THE STARTING POINT IS ALREADY BAD, AND THE WIND-UP BARELY IMPROVES IT.** Front-on rises only
from 0.325193 at the arm to 0.346119 at the last pre-release tick; **side-on is the modal sector
at both instants**, and one target in seven has his **back** to the ball he is about to be given.
This is PT-C0's H2 read seen from the other end of the flight, on a different population.

### §R3 (c) THE COST OF FACING — ⭐⭐ **FREE**

`costOfFacing.fixtureDistanceRatio` = **1**. Two identical bodies driven toward the same target
for 120 ticks covered **12.503856421401169 m each** — the same IEEE double, not a rounded match —
while the faced body's heading ended **1.573171785161599 rad (≈ 90°) off its velocity**. The
fixture is alive and the cost is exactly zero.

The code fact frozen at §P.E stands as written: `Player.physicsStep` clamps `desiredVel` by
`topSpeed`, rate-limits by `accel · dt`, advances `pos` from `vel`, and **only then** rotates
`heading` — a block that writes the heading and never reads it back. The shipped docstring's own
words: the body direction *"remains independent of velocity direction"*.

⇒ **FACING THE PASSER WHILE DRIFTING IS FREE IN THIS ENGINE.** The READY limb therefore has
**no trade to make** — and that is a property of the model, not of football. **THE REALISM GAP IS
NAMED, NOT HIDDEN: VISION S11 — 转身/低速/受压仍是胶水.**

### §R4 THE DOSED ARM BESIDE (paired on seeds; REPORTED, never gated)

| face | Δ (D − E) | 95 % CI | reads |
|---|---|---|---|
| `deltaF` (the licence quantity) | — | — | +0.286592 dosed vs +0.298165 empty book; **both intervals lie entirely above zero** |
| `baseRate` | +0.002197 | [−0.000062, +0.004177] | **contains zero** |
| `wMeanTicks` (the window) | −0.005292 | [−0.076775, +0.066947] | **contains zero** |
| `frontShareAtLast` | +0.005744 | [−0.000407, +0.012117] | **contains zero** |
| `frontShareAtArm` | +0.007553 | [+0.001797, +0.013714] | resolvedly above (1.267579 hw) |
| `sideShareAtLast` | −0.003557 | [−0.010139, +0.002809] | contains zero |
| `backShareAtLast` | −0.002187 | [−0.006670, +0.002362] | contains zero |
| `turnMeanDegAtLast` | −0.828267 | [−1.464941, −0.209612] | resolvedly below (1.319601 hw) |
| `turnCompletableInWShare` | +0.002604 | [−0.003514, +0.008878] | contains zero |
| `pressedCarrierShare` | **+0.045114** | [+0.036353, +0.053453] | resolvedly above (5.276506 hw) |

**⭐ THE DETECTOR IS BOOK-INDEPENDENT, AS #371 item 5 EXPECTED.** The base rate, the window and
every sector share at the last pre-release tick are indistinguishable across the two arms; the
two facing faces that do separate move by **less than one degree** and by **0.0076** of a share.
⚠ The **matured world runs more wind-ups** — 46.550551 arms/match against 41.521522, and
472.630631 wind-up ticks/match against 423.495495 — so the limb would fire *more often* there,
not differently.

### §R5 CONTEXT (rates on the 240 s match clock; 1 sim-s = 22.5 display-s)

| face | E (empty book) | D (dosed) |
|---|---|---|
| carrying ticks / match | 4186.048048 | 4572.435435 |
| wind-up ticks / match | 423.495495 | 472.630631 |
| wind-ups armed / match | 41.521522 | 46.550551 |
| wind-ups reaching their last pre-release tick / match | 41.499499 | 46.525526 |
| **pressed-carrier share of carrying ticks** | **0.510162** | **0.555276** |
| goals / match | 3.228228 | 2.653654 |
| engine ground passes / match | 78.696697 | 87.325325 |
| engine whole-match pass completion | 0.583467 | 0.590568 |

**⚠ PRESSURE IS NOT A CHEAPER CUE.** The commander asked for the pressed bit so it could be
compared. A carrier is pressed on **0.510162** of carrying ticks in the empty-book world — barely
better than a coin — while a wind-up is live on only **0.101168**. **Pressure fires five times as
often as the thing it would be predicting.** The angular-speed bin fires on **0.151465** of carry
ticks and **0.894642** of wind-up ticks; pressure does nothing comparable.

**THE TARGET'S ACTION AT THE ARM TICK** (RC-C0's face, for continuity; empty book / dosed):
`SupportBallCarrier` 0.267695 / 0.469637 · `MoveToFormationSpot` 0.274590 / 0.109969 ·
`MakeRun` 0.188886 / 0.382010 · `ChaseBall` 0.027580 / 0.006322 · **`ReceivePass` 0.002290 /
0.000516** · `HoldPosition` 0.000000 / 0.000000. ⚠ RC-C0 read `ReceivePass` at **exact zero** on
its own population (the MEETABLE CARRIED class); this census reads **every** wind-up, and the
handful of non-zero cases are targets still finishing an EARLIER pass when the next one is armed
at them. The strike gate is the same gate; the populations differ.

## §R HONEST LIMITS

1. **⭐⭐ THE LICENCE IS THE TURNING AXIS, NOT THE FAMILY'S NAME.** F was frozen as
   「他正在转向我」 and it separates hugely — but §R1 shows **the whole of Δ_F is the top
   angular-speed bin, and the rank contributes −0.000070**. The rank axis is a **PARTITION of the
   mates inside a tick**, so it cannot move P(wind-up | ·) at all; that is arithmetic, not
   evidence. The honest statement of what was licensed: **"a same-side carrier who is swinging
   his body at 60 %+ of the engine's turn cap is winding up a pass on 0.399333 of those ticks
   against a base rate of 0.101168"**. Whether the ball is coming to *me* is a **separate** question,
   answered by the rank, and answered much less sharply (precision 0.379738).
2. **⭐⭐ A DETECTOR TABLE CANNOT SAY THAT READING IT HELPS.** Everything here is calibration —
   how often a cue coincides with a wind-up. Whether a receiver who *acts* on that belief ends up
   better placed, and whether the passer's choices shift under him, is **RC-T1b's** question and
   nothing in this census answers it. ⛔ No metre of the 2.756 m gap is claimed here.
3. **⭐⭐ THE COVERAGE IS WHAT THE LIMB WOULD ACTUALLY SEE.** F fires on only **0.339729** of the
   (wind-up tick × target mate) pairs. Two of every three passes aimed at a man would arrive with
   his own belief silent — either the carrier was not turning hard on that tick, or he was
   turning onto somebody else. A limb built on F is a **sometimes** limb by construction, and the
   coverage — not Δ_F — is the number that sizes what it could ever buy.
4. **⭐⭐ THE FALSE-POSITIVE SIDE IS LARGE AND IS NOT A DEFECT OF THE INSTRUMENT.** P(wind-up | F)
   = 0.399333 means **three fires in five are on a carrier who is NOT winding up**, and within
   the true fires the believer is the intended target only 0.379738 of the time. A belief spent
   at this calibration is wrong far more often than it is right. That is the honest raw material
   the READY limb would weigh, and it is exactly the shape from which a **dummy** emerges for
   free (contract §4).
5. **⚠ THE CELL TIER AND THE TICK TIER HAVE DIFFERENT DENOMINATORS, BY DESIGN.** The licence Δ_F
   subtracts a **per-TICK** base rate (0.101168) from a **per-(tick × mate)** conditional
   (0.399333) — that is #371 item 5's frozen form and it is honoured literally. The census
   publishes the cell-tier base rate beside it (`pWindupGivenAllCells` **0.101238**), and the two
   differ only in the fourth decimal because the mate multiplicity (**4.988062**) is very nearly
   constant. The lift over the cell-tier base (+0.298095) is therefore the same number as Δ_F.
   `gBaseRateConsistency` proves the two tiers agree exactly on counts.
6. **⚠ MATE MULTIPLICITY IS INSIDE EVERY CELL COUNT.** A cell's `n` counts (tick × mate) pairs,
   not ticks: one carrying tick contributes about five of them, and they are **not independent**
   — the five mates share one carrier, one heading and one truth label. The cluster bootstrap
   resamples **seeds**, so the interval is honest at the match level, but no cell's `n` should be
   read as a count of independent observations.
7. **⚠ THE ≤ 1-TICK INDEXING SUBTLETIES.** The angular speed is a **backward difference** across
   one tick, so the tick a wind-up arms on carries the heading change of the tick *before* the
   arm. The record is observable only from the END of the arm tick, so the true first evidence
   may precede t0 by up to one tick. And a record sitting live **at or past** `readyTick` behind a
   dead-ball phase gate is **not** labelled `windup` here (the label requires `tick < readyTick`)
   — those ticks fall into `carry`, which makes the base rate marginally **conservative**.
8. **⚠ THE FACING POPULATION IS EVERY WIND-UP, NOT THE MEETABLE CARRIED CLASS.** RC-C0's
   arrival-anatomy faces were conditioned on meetable carried elections; §R2's are not. The two
   sets of sector numbers are therefore **not** comparable as a Δ, and none is computed.
   Similarly PT-C0's 0.571574 side-on was measured **at the receiver's first touch on completed
   passes**; §R2's 0.515405 is measured **during the wind-up on every wind-up**. ⛔ Different
   instants, different populations, no Δ across them.
9. **⚠ THE TURN-TICKS FACE IS AN UPPER-BOUND OF ROOM, NOT A PREDICTION.** `turnTicks` spends the
   whole window turning at `TURN_RATE` from the arm tick, with no reaction delay, no AI cadence
   (`AI_INTERVAL` = 0.15 s ≈ 9 ticks — larger than the median window of 8 ticks) and no
   competing movement plan. A real believer would start later and turn less. **0.453206 is the
   ceiling of who *could* be ready, not a forecast of who *would* be.**
10. **⚠ THE (c) ANSWER IS ABOUT MOVEMENT ONLY.** "Free" means the heading does not enter the
    velocity, acceleration or position integration. It does **not** mean facing is free of every
    consequence: the heading feeds the BK reception sector (which is the entire point of the
    limb), the carrier's glued-ball offset, and several perception-side reads. This census
    measured the **movement** coupling the ruling asked about, and nothing else.
11. **⚠ EMPTY CELLS ARE PUBLISHED AS `null`.** 44 of the 240 per-cell faces have `n = 0`; JSON has
    no NaN, so their `value` round-trips as `null`. `gFaces` accepts `null` **exactly where the
    re-derivation itself is NaN and nowhere else**. The rank-6 slot is empty on both arms by
    construction (6v6 gives five mates), and `marginal.rank3`/`rank4` carry slightly smaller
    denominators than the base rate because of sendings-off.
12. **⚠ TWO ARMS, ONE WORLD.** World 12's own composition in the empty-book and dosed forms. No
    dose sweep, no shut arm, no other world. Every number here is a property of **this** world.
13. **⚠ 12 SCRATCH CLUSTERS SIZED THIS BATTERY**, and the block capped it at 999 shared seeds
    regardless. All three sizing rows were declared resolvable and all three realised
    comfortably: the licence Δ_F needed 8 clusters and realised a half-width of **0.003175**
    against its 0.05 target; the front-on share needed 20 and realised **0.004639** (E,
    `E.facing.frontShareAtLast.halfWidth`).
14. **⛔ THIS CENSUS ADJUDICATES NOTHING** beyond printing §P.C's verdict word. What **LICENSED**
    buys, whether limb 3b is built, and what the coverage of 0.339729 implies for its size are
    the commander's (#371 item 5 / #372 item 6). The world-12 play-test gate remains the user's
    and remains open in parallel.

## §COMMANDER CORRECTIONS (ruling #373 item 3 — the verifier's one MEDIUM, disposed; numbers of record UNCHANGED)

1. **MEDIUM — a per-TICK coverage was re-labelled as a per-PASS coverage in the one sentence the
   commander sizes the limb by.** `E.coverageF` = 143,730 / 423,072 = 0.339729 is the share of
   (wind-up tick × target mate) PAIRS in F — the artifact's own `denNote` says so. HONEST LIMITS 3's
   "two of every three passes aimed at a man would arrive with his belief silent" and the results
   commit's subject ("F covers only 0.339729 of passes") convert it silently to a per-PASS share.
   With a mean window of 10.273505 ticks a flight fires if F holds on ANY of its ticks, so the
   per-FLIGHT coverage is ≥ 0.339729 and is NOT computable from the stored per-tick cells. The
   sentence is STRUCK to "on a third of wind-up ticks aimed at him"; the commit subject stands as
   written but is WRONG of record on that clause; **RC-T0b's pin suite (or the next instrument
   that walks wind-ups) publishes the per-FLIGHT coverage of F** — the number the limb actually
   lives on.
2. **Of record — the licence is the TURNING axis alone, and the doc said so first.** rank is a
   strict partition of the mates inside a tick (Σ over rank-1 cells of `cellTicks` = the carrying
   tick count exactly), so P(wind-up | rank r) is pinned to the base rate by arithmetic; what F
   licenses is 「他正在转身」. The 「传给谁」 half lives in a DIFFERENT face — P(target = me |
   wind-up, rank) — which the READY limb's belief must carry SEPARATELY (rank 1 within F: 0.379738).
3. **Of record — turning is FREE in this engine** (question (c), verified by the verifier's own
   reading of `Player.physicsStep` at more sites than the author anchored): the heading is written
   after position and never read back into velocity or position; two identical bodies driven at the
   same target for 120 ticks cover the SAME distance (ratio exactly 1) with one facing 90° off. This
   is the S1 substrate debt SUBSTRATE-MAP names verbatim ("movement remains one isotropic accel
   envelope + a separately rotating heading"; `agility` = "a flat TURN_RATE 6.5, attr-blind"). It
   decides the READY limb's sequencing — ruling #373 item 4.
