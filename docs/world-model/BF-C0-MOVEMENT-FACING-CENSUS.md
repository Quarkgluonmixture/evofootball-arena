# BF-C0 — THE MOVEMENT-FACING CENSUS（今天有多少跑动是背着、侧着朝向在跑；转身代价会砸到谁）

> **The census that sizes the blast radius of a facing law.** Authorized by **COMMANDER
> RULING #373 item 6**. Bound by [`BF-BODY-FACING-CONTRACT.md`](BF-BODY-FACING-CONTRACT.md)
> (§-1 the doctrine, §0 the code facts, §2 the law family **M-BF.1–4**, §3 the arc — this
> stage is **BF-C0**).
> Lineage: [`RC-C0B-DETECTOR-CENSUS.md`](RC-C0B-DETECTOR-CENSUS.md) **§P.E / §R3 — the (c)
> code fact and its two-body fixture** (turning is FREE in this engine, verified twice) →
> **ruling #373 item 4** (a free action cannot be an honest trait) → **#373 item 6**.
> Instrument family: RC-C0b (the run envelope, `buildMatch`, the per-tick read-only
> observation, the two-arm pairing, the cluster bootstrap, the sizing form, the corrected
> hash ORDER, the receipts block, `gFaces` off disk) and
> [`PT-C0-PLAYTEST-FORENSIC-CENSUS.md`](PT-C0-PLAYTEST-FORENSIC-CENSUS.md) **arm D** (the
> SHIPPED-default construction path CALLED, with its `gShippedConstruction` fixture REUSED).
> Instrument: `scripts/probes/bf-c0-movement-facing-census.ts`.
> Artifact: `docs/world-model/data/bf-c0-movement-facing-census.json`
> (**or its `.RED.json` SIDE PATH** if any gate is red — the red-routing idiom, #334 item 5).
>
> ⛔ **THIS IS A CENSUS.** It publishes MEASUREMENTS. It **applies no factor**, scores no
> hypothesis, arms no mechanism, **adjudicates nothing** and ships nothing. It carries **NO
> pre-commitment** — a blast-radius census (#373 item 6's own words). `LATERAL` and `BACK`
> are **RATIFIED BY THE COMMANDER AT BANKING**, not chosen here.
> ⛔ **X-SRC-ZERO**: no file under `src/` is created or edited. The probe CALLS the shipped
> exports and reads `Match` state per tick. **THERE IS NO WRAPPER AT ALL** — `gLockstep`
> proves observed ≡ unobserved byte for byte.
> ⛔ **WORLD 12'S COMPOSITION AND BYTES ARE UNTOUCHED**; this stage is Road B, the user's
> world-12 play-test gate stays open in parallel, and no world 13 is cut here.

## §0 THE WORDS OF RECORD, AND WHAT THIS CENSUS IS FOR

**Ruling #373 item 6, the scope this census instruments, VERBATIM:**

> *"⭐⭐ **BF-C0 DISPATCHED — THE MOVEMENT-FACING CENSUS** (the census form; X-SRC-ZERO;
> compact JSON; the hash receipt; definitions frozen at the executor's §P): (a) TODAY'S
> MISALIGNMENT — over every open-play tick on which a body MOVES (|vel| above the shipped
> heading-follow floor, anchored), φ = the angle between heading and velocity (15° bins
> stored), by action class × speed bin × role × side-of-ball; the share of moving ticks with
> φ > 45° and > 90°; the speed achieved per φ bin (the isotropic envelope's receipt: the same
> top speed regardless); metres/match covered misaligned; (b) THE EXPOSURE TABLE — per action
> class and role, the moving ticks and metres a facing factor would scale (counts; no factor
> applied — a census applies nothing); (c) THE `faceTarget` SEAM MAP — every src site that
> sets it, anchored with line receipts and its action class (who faces away from motion by
> decision today); (d) THE REALITY ANCHOR — the literature's lateral-shuffle and backpedal
> speed fractions vs forward sprint, cited with sources and the executor's access stated
> honestly (unverified if from memory); the constants are RATIFIED at banking, not chosen by
> the census. ARMS: world 12 EMPTY-BOOK and the SHIPPED DEFAULT (PT-C0 arm D's construction —
> the law would reach both), paired on shared seeds. No pre-commitment (a blast-radius
> census). Block **12,537,000–999**; scratch 900,002,300–399; ZERO stats; registry 73;
> standing orders."*

**The contract's doctrine sentence, VERBATIM** ([`BF-BODY-FACING-CONTRACT.md`](BF-BODY-FACING-CONTRACT.md) §-1):

> *"⇒ **THE LAW: a body's achievable velocity toward its desired direction is scaled by how
> far its heading is from that direction — full ahead, less to the side, least backwards —
> with the shape a body fact and the size of the penalty the body's own `agility`.**"*

### in plain football language

In this engine a body runs at full speed no matter which way it is facing. RC-C0b proved it
twice: two identical bodies driven at the same target for two seconds covered **the same
distance to the last float**, with one of them facing 90° away from where it was going. Real
players do not work like that. Running backwards is slower than running forwards, and a
sideways shuffle is slower again — and **that price is exactly what makes "face the ball" a
decision** instead of a free bonus.

The commander has ruled that the price gets written before the receiver's ready-limb is
built. Before the law is written, he needs to see **what it would touch**:

1. **How much of today's running is already off-heading?** Every tick a body is moving, how
   far is its body pointing from where it is going? How often is that more than 45°, and how
   often more than 90° — a body going, in part, backwards?
2. **Who does it?** Which roles (the keeper backpedalling along his line, the marker, the
   drifting receiver) and which actions?
3. **Is it a decision or is it lag?** A body is off-heading either because an executor
   **told** it to face somewhere (`faceTarget`), or because its heading is still swinging
   round to catch up after it changed direction. Only the first is a decision the law would
   price; the second is the turn cap doing its job.
4. **Where in the code is a body told to face away from where it is going?** Every one of
   those lines becomes a line that COSTS something the day the law lands.
5. **What does the literature say the price should be?** Backpedal and lateral shuffle as
   fractions of a forward sprint — cited, with this executor's verification stated honestly.

⛔ Nothing here is decided. The census publishes the five answers and stops. It does not
apply a factor to a single body, and its three illustrative (LATERAL, BACK) pairs are
**arithmetic over the census**, not a simulation.

## §P THE FREEZE (all of it BEFORE any battery seed)

### §P.A THE POPULATION AND THE CELL

| quantity | frozen form |
|---|---|
| **THE POPULATION** | **every OPEN-PLAY tick** (`match.phase === 'playing'`) on which a body is **MOVING**, for **BOTH SIDES** and **ALL 12 BODIES — THE KEEPER INCLUDED** (flagged by role); a sent-off body (`sentOff === true`) is excluded. Read at the END of each `m.step(DT)` — there is no wrapper. |
| **⭐⭐ "MOVING" — THE SHIPPED FLOOR, ANCHORED** | `\|vel\| > 0.5` m/s — the engine's **OWN** heading-follow floor, the `} else if (sp > 0.5) {` in `Player.physicsStep`, anchored with a line receipt. Below it a body with no `faceTarget` **does not rotate its heading at all**, so "which way is he facing relative to where he is going" is not a question the engine answers there. ⛔ **NOT a taste constant.** |
| **⭐⭐ φ — THE MOVEMENT-FACING ANGLE** | the angle between the body's `heading` and its `vel`, in **RADIANS**, both read at the SAME tick AFTER `m.step(DT)` — exactly the pair `physicsStep` left behind. **15° bins to 180° (12 bins), STORED.** φ is **sign-blind**: 60° left and 60° right are the same bin. |
| **THE READ SET** | ⭐ **EXTERNAL / ENGINE STATE ONLY**: `heading`, `vel`, `action.type`, `role`, `ball.owner` and whether `faceTarget` is null. **A census reads truth** — there is no percept discipline to keep here and none is claimed. |
| **⚠ THE `faceTarget` READ IS EXACT** | `faceTarget` is written by the executor EVERY frame (`p.faceTarget = null` at the head of `applyAction`, then a case may set it) and READ by `physicsStep` in the same tick — so the value read after the step **IS** the value that tick's heading rotation used. |

**⭐⭐ THE CELL = (action.type × role × side-of-ball × speed bin × φ bin × faceTargetSet).**

| axis | frozen form | anchored to |
|---|---|---|
| **ACTION** | the shipped **23-label `ActionType` vocabulary**, read off its own union, **+ one OVERFLOW slot** (an unnamed label would be visible) ⇒ **24** | `src/sim/types.ts`, anchored |
| **ROLE** | `GK · DF · MF · WG · ST`, read off the `Role` union ⇒ **5** | `src/sim/types.ts`, anchored |
| **SIDE-OF-BALL** | `own` (my side owns the ball) · `opp` (the opponents own it) · `loose` (`ball.owner === null`) ⇒ **3**, from `ball.owner` alone | — |
| **SPEED** | `\|vel\|` in m/s, cut on the moving floor: **(0.5,2) · [2,4) · [4,6) · [6,∞)** ⇒ **4** | the shipped `BASE_SPEED` role table (top entry **7.9**) × the pace span (`0.88 + 0.24·pace` ≤ 1.12) and the PURE `topSpeed` getter (`baseSpeed · (0.62 + 0.38·stamina)`), which together cap a body **under 8.9 m/s** — so the top bin is genuinely open |
| **φ** | **15° × 12 bins to 180°** | — |
| **faceTargetSet** | **0** = `faceTarget` is NULL (the heading FOLLOWS motion) · **1** = SET (an executor made a deliberate facing decision this frame) ⇒ **2** | `Player.faceTarget`, anchored |

**⇒ 24 × 5 × 3 × 4 × 12 × 2 = 34,560 CELLS.** Per **arm × seed** the occupied cells are stored
**SPARSELY** as a flat `[idx, count, idx, count, …]` array sorted by index — **AGGREGATE
CELLS, NEVER RAW TICKS** — and every published tick face re-derives from those per-seed arrays
(canon: per-seed cells, ruling #282.2(ii)).

**⚠ METRES CANNOT BE RECOVERED FROM COUNTS.** So the census also stores, **per arm × seed**,
`expSpeedSumMps` — **Σ |vel| in m/s** over the moving ticks of each **(action × role × φ bin)**
cell (1,440 slots). **METRES = `expSpeedSumMps` × DT.** Canon, VERBATIM: *"a field carries the
unit its name claims"* (home: ruling #294 item 3) — the field is a **sum of speeds**, and every
metres face derives it by the one multiplication.

**⭐ THE TWO CUTS FALL ON STORED BIN EDGES.** 45° is the lower edge of φ bin **3** and 90° the
lower edge of φ bin **6**, so `share45` and `share90` re-derive from the stored φ histogram
with **no interpolation** — and `gFaces` re-derives both by that independent route as well as
from the per-seed cells.

### §P.B THE FACES OF (a) — TODAY'S MISALIGNMENT

Per arm, each a cluster-bootstrap face with counts and a 95 % interval:

* **THE HEADLINE** `share45` = the share of moving ticks with **φ > 45°**; **THE BACKPEDAL
  SHARE** `share90` = the share with **φ > 90°**.
* the same two **BY ROLE** (5), **BY SIDE-OF-BALL** (3), **BY SPEED BIN** (4), **BY
  `faceTarget` CLASS** (2) and **BY ACTION CLASS** (24).
* the **φ DISTRIBUTION**: the share of moving ticks in each of the 12 bins (**bins stored**),
  and the **BIN-DERIVED MEDIAN φ** (the lower edge, in degrees, of the bin whose cumulative
  count first reaches n/2).
* ⭐⭐ **THE MEAN SPEED PER φ BIN — THE ISOTROPIC ENVELOPE'S RECEIPT.** Today the engine
  charges nothing for facing, so this row is the **baseline the law's own exam is read
  against**. ⚠ Said here, before the battery: this row is **NOT** a test of the envelope — it
  is a **selection** statistic (a body sprinting in a straight line is aligned *because* the
  heading follows the motion). The envelope itself is proved by the **fixture**, §P.G's
  `gWalkFixtures`, which drives two identical bodies and reads the distance ratio.
* **METRES per match** (Σ |vel|·DT on the **240 s match clock**): total, **φ > 45°**, **φ >
  90°**, overall **and by role**.
* **THE DECISION SPLIT**: the share of moving ticks with `faceTarget` **SET**; and of the
  **misaligned** (φ > 45°) ticks, the share that are **`faceTarget`-DRIVEN** against the share
  that are **MOTION-FOLLOW LAG** (φ > 45° with `faceTarget` **null** — a heading still catching
  up at `TURN_RATE` after the velocity changed direction). The same split for φ > 90°.
* **CONTEXT** on the 240 s match clock: moving ticks/match, open-play ticks/match, the moving
  share of body-ticks, mean speed, goals/match, ground passes/match, pass completion.

### §P.C THE EXPOSURE TABLE AND THE FROZEN SENSITIVITY PAIRS — (b)

**THE EXPOSURE TABLE**, per arm: for every **ACTION CLASS × ROLE**, the **moving TICKS** and
the **METRES** in **each φ bin** — the table a facing factor would scale. It is published in
FULL as stored bins (`bins.<arm>.exposureTicks` and `bins.<arm>.exposureMetres`, both
24 × 5 × 12), and **`gFaces` re-derives EVERY entry of both halves from the per-seed cells off
disk**. ⛔ **NO FACTOR IS APPLIED.**

⚠ **STATED HONESTLY, BEFORE THE BATTERY**: bootstrap intervals are published on the **MARGINS**
(by role, by action, by side-of-ball, by speed bin, by `faceTarget` class, by φ bin) and **NOT**
on each of the 1,440 individual exposure entries, most of which are empty or hold a handful of
ticks. An interval on each would be noise dressed as information.

**THE FROZEN SENSITIVITY** — ⛔⛔ **ARITHMETIC OVER THE CENSUS, NOT A SIMULATION. The real law
is BF-T0's and its effect is BF-T1's.** For three **ILLUSTRATIVE** (LATERAL, BACK) pairs, the
metres the factor would subtract from the ground **this world actually ran**, **IF every body
ran exactly the same paths**:

| pair | LATERAL | BACK |
|---|---|---|
| `gentle` | 0.90 | 0.80 |
| `moderate` | 0.75 | 0.60 |
| `steep` | 0.60 | 0.45 |

**THE SHAPE, FROZEN:** `f(φ)` is **LINEAR IN φ** with knots at **0 ⇒ 1**, **π/2 ⇒ LATERAL** and
**π ⇒ BACK**, evaluated at each stored φ bin's **CENTRE** ((i + 0.5)·15°). The shape is a
**DECLARED CHOICE** — contract M-BF.1's own words: *"the interpolation shape between them is a
declared choice"*. `metresLost = Σ_bins metres_bin · (1 − f(centre_bin))`, published per match
and as a share of all moving metres, per arm.

⛔ **THE CENSUS DOES NOT CHOOSE `LATERAL` OR `BACK`.** Contract M-BF.1 makes them the REALITY
ANCHOR's own fractions, **ratified by ruling at this census's banking** (the PC-tier precedent).
The three pairs above exist only so the exposure has a scale.

### §P.D THE `faceTarget` SEAM MAP — (c)

Canon, VERBATIM: *"a seam-map gate pins occurrence COUNTS per needle and enumerates EVERY
occurrence's site"* (home: `PC-C0-REACTION-BASELINE.md` §COMMANDER CORRECTIONS item 1).

* Every `.ts` file under `src/` is scanned for the needle **`faceTarget`**; the **per-file
  occurrence COUNT is PINNED** and **every occurrence's LINE is enumerated**. Pinned at this
  freeze: `src/ai/PlayerBrain.ts` 1 · `src/ai/actionExecutor.ts` 18 · `src/ai/inLookAct.ts` 1 ·
  `src/ai/pcLatency.ts` 1 · `src/ai/receiverAnticipationSeat.ts` 1 · `src/sim/Match.ts` 12 ·
  `src/sim/Player.ts` 3 · `src/sim/rendezvousRecovery.ts` 20 — **57 in 8 files**.
* Every `<obj>.faceTarget =` **WRITE MATCH** is enumerated with its **file:line**, its **source
  line VERBATIM**, and a **FROZEN CLASSIFICATION**: what it serves, whether it is live /
  dormant / armed-only-in-world-12, and whether it aims the body **AWAY from its motion BY
  DESIGN**. Pinned: **24 matches = 18 DECISION writes (can write a non-null point) + 4 NULL
  RESETS + 2 that sit inside COMMENTS** (they quote the pattern), of which **2 are
  away-by-design**. A site that did not exist at this freeze is labelled `UNKNOWN` and turns
  the gate **RED**.

### §P.E THE REALITY ANCHOR — (d): WHAT WILL BE CITED AND HOW

The census publishes, for **BACKPEDAL** and **LATERAL SHUFFLE** separately: a **RANGE** as a
fraction of maximal forward sprint speed, the **SOURCES** (author / year / journal where
known), and **PER SOURCE** a verbatim statement of **how far this executor verified it** —
`VERIFIED BY WEB SEARCH on <date>` (with "full text NOT read" said where true) or ⛔ `FROM
MEMORY, UNVERIFIED`. The whole block lives in the artifact under `realityAnchor` and is
reproduced at §R4.

⛔ **NO NUMBER IN THIS CENSUS'S MEASURED FACES DEPENDS ON ANY OF IT.** The anchor is evidence
for a ruling, not an input to a measurement. `LATERAL` and `BACK` are **ratified at banking**.

### §P.F THE ARMS — two, PAIRED on shared seeds

Arm `k` walks seed `s` with the **IDENTICAL population construction** (RC-C0's own `buildMatch`
plumbing: genomes and squads drawn from the seed exactly as it does, the same 240 s match), so
the two arms differ **ONLY** in the world's own composition and every contrast is **PAIRED per
seed**.

| arm | composition — the composer **CALLED, never copied** | gate on the match |
|---|---|---|
| **E** | **world 12 EMPTY-BOOK — the exams' form**: `a4MatchFlags(12)` + `armA4World(m, null, 12)` | `raArmedVersion(m) === 12` |
| **S** | **THE SHIPPED DEFAULT** — a `Match` built EXACTLY as the league's worker builds a fixture: **no a4 flags, no arming**, contact law OFF. PT-C0 **arm D**'s own construction path. | `raArmedVersion(m) === 0`; `gShippedConstruction` |

Canon, VERBATIM: *"WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits
matchFlags; true since #155, stated now, test-pinned; refines #270's E4 correction; matches the
perf diagnostic)"* (home: ruling #283.2(iv)) — **PT-C0 arm D's own fixture is REUSED**: a
League round-tripped through `toJSON`/`fromJSON` exactly as the worker's `simRunner` does, then
`League.createMatch(f)` against a Match built with the arm-S constructor shape at the SAME
derived seed; the two **whole-match signatures** must be identical after both run out, with
three receipts beside (`matchFlags` absent from `toJSON`, undefined on the `fromJSON` league,
and the BOOLEAN FLAG SET of a worker-built match equal to a bare `new Match({ seed, teamA,
teamB })`).

**⛔ NEITHER ARM ARMS `rcAnticipate`.** `gWorld` asserts, on every walked match of both arms
and on both construction receipts, that the `rcAnticipate` match flag is **FALSE** and that
`rcAnticipationWeightOf` returns **null** on **both** teams — the gene is provably **ABSENT**.

**⚠ THE TWO WORLDS DIFFER IN WAYS THIS CENSUS DOES NOT CONTROL** (said before the battery):
world 12 arms the pass wind-up (`o1PassWindup`), the corridor stack and the RA doors; the
shipped default arms none of them. The **E − S contrast is REPORTED, PAIRED, and NEVER
SCORED** (#373 item 6: *"the E−S contrast on the misalignment faces is REPORTED (paired), not
scored"*). No Δ here is a finding about either world's football.

**NO WRAPPER.** Observation = per-tick reads of `Match` state after each `m.step(DT)`.
`gLockstep` proves observed ≡ unobserved byte for byte on out-of-band scratch seeds, on **both**
arms.

### §P.G SEEDS AND SIZING

* **Block 12,537,000–999**: battery seeds **12,537,000–12,537,199** (**N_FROZEN = 200**),
  construction receipt **12,537,999** — the two arms **SHARE** every seed, so the walk count is
  (200 + 1) × 2 = **402**. **BOOKED = WALKED.** The **UNWALKED TAIL IS DECLARED**:
  **12,537,200–12,537,998**. Smokes on out-of-band scratch **900,002,300–311**; lockstep on
  **900,002,390–391**.
* **Stats consumed: ZERO.** Registry **73** untouched.
* **Env whitelist**: `BFC0_MODE`, `BFC0_N`, `BFC0_OUT` — any other `BFC0_*` or any engine door
  env aborts the run with exit 3, and an override run may never write a canonical path.
* **SIZING** (the RC-C0 §15 house form; §DEV-PREFLIGHT's smoke is the variance source). Target
  **0.01** on the headline φ > 45° share and **0.02** on the by-role φ > 90° backpedal share,
  for **every** role:

| face | realised hw (12 clusters) | target | N required | expected hw at N_FROZEN = 200 |
|---|---|---|---|---|
| `E.share45` (**THE HEADLINE**) | 0.007320786611218696 | 0.01 | **14** | 0.001793219 |
| `E.role.GK.share90` | 0.013966872200510655 | 0.02 | **12** | 0.003421171 |
| `E.role.DF.share90` | 0.003477301039615311 | 0.02 | **1** | 0.000851761 |
| `E.role.MF.share90` | 0.001944557306702704 | 0.02 | **1** | 0.000476317 |
| `E.role.WG.share90` | 0.002085388575960179 | 0.02 | **1** | 0.000510814 |
| `E.role.ST.share90` | 0.001940631404803652 | 0.02 | **1** | 0.000475356 |

  **⭐ WHY N_FROZEN IS 200 AND NOT THE BLOCK'S 999 — STATED BEFORE THE BATTERY.** Every row
  resolves at **14 clusters**; the block affords 999; the **BINDING CONSTRAINT IS THE
  ARTIFACT**. The 12-cluster smoke wrote **45,972 compact bytes per seed-pair**, so 999 shared
  seeds would write a **~46 MB** artifact — against RC-C0b's 4.36 MB and the very number the
  compact-artifact canon was created over (RC-T1a's 35.6 MB). Canon, VERBATIM: *"an artifact is
  written as compact JSON — no indentation; the hash is over the canonical body regardless;
  pretty-printing is a reader's tool, not a storage form"* (home: ruling #372 item 5).
  **N_FROZEN = 200 is 14× the largest sizing requirement** and lands the artifact near 9–10 MB.
  ⚠ The block is therefore **NOT consumed whole**; the tail above is declared and stays virgin.
* **Bins** (frozen): φ 15° × 12 · speed edges `[2, 4, 6]` on the 0.5 m/s floor · 3 sides of
  ball · 24 action slots · 5 roles · 2 `faceTarget` classes. **Estimator**: cluster bootstrap,
  clusters = seeds, **2,000 draws**, rng seeded from the block base. **The median is
  BIN-DERIVED** so `gFaces` re-derives it off disk — canon, VERBATIM: *"the re-derivation gate
  covers EVERY published face; a percentile face requires stored bins"* (home: ruling #287
  item 1 + `PC-C0-REACTION-BASELINE.md` §COMMANDER CORRECTIONS item 4).

### §P.H THE GATES (all liveness/receipt — NEVER direction)

`gWorld` (both arms: the armed version each arm wants, `rcAnticipate` FALSE, the gene ABSENT) ·
`gShippedConstruction` (arm S ≡ the worker's own construction, whole-match signature; PT-C0's
fixture REUSED) · `gGenomeClean` (`info.genome` never written — canon: dose placement, #270.2 /
#334 item 1) · `gAnchoredConstants` (**anchored extraction with line receipts**: the **SEVEN
LINES of `physicsStep`** that carry #373 item 2(d)'s code fact **in the order they run** — the
`desiredVel` clamp by `topSpeed` alone, the `accel · dt` limit, the POSITION integration from
VELOCITY, the `sp` the floor tests, ⭐ **the heading-follow floor `sp > 0.5` this census's
population is cut on**, the heading rotation that WRITES `heading` and reads nothing back, and
the shipped docstring *"remains independent of velocity direction"* — plus `TURN_RATE`,
`BASE_SPEED` and the pure `topSpeed` getter, `ACCEL`, `DT`, `AI_INTERVAL`, `heading`,
`faceTarget`, world 12's flag composition and arming lines, the league's ONE `new Match(` site
and the `...this.matchFlags` spread, the dormant `rcAnticipate` flag and
`rcAnticipationWeightOf`, and the `ActionType` and `Role` vocabularies read off their own
unions) · `gSeamMap` (§P.D's pinned per-file occurrence counts and every enumerated site) ·
`gWalkFixtures` (the φ arithmetic on constructed vectors; the bin grid and the proof that both
cuts fall on stored edges; the cell index and its six decoders; the frozen facing-factor shape
and its monotonicity; **the metres-lost arithmetic on a constructed bin table**; and ⭐⭐
**RC-C0b's TWO-BODY FACING FIXTURE RE-RUN AT THIS HEAD** as a receipt that facing is still
free — the baseline the law would move, with the fixture's own liveness asserted) ·
`gClassesNonVacuous` (every ROLE live, every SIDE-OF-BALL class live, **both team sides**
moving, the `faceTarget`-SET class live, the **φ > 90°** class live — on both arms) ·
`gLockstep` · `gSrcUntouched` (`git diff --stat HEAD -- src` **AND** `git status --porcelain --
src` both empty — canon: xSrcUntouched) · `gSeedsBookedEqualWalked` · `gN` (N_FROZEN honoured
and every sizing row resolvable at it) · `gHashOrder` (**the corrected order**; its NOTE derives
from the pinned values it checks — canon, VERBATIM: *"a gate's NOTE derives from the same pinned
values the gate checks; a count typed beside its pin is a second copy"*) · `gFaces` (**EVERY**
published face, Δ, stored bin, **the whole EXPOSURE TABLE**, the bin-derived median, both
headline shares **re-derived by an independent route from the stored φ histogram**, every
sensitivity row re-derived from the stored exposure metres, the seam-map counts and the
facing-free fixture, all off the **SERIALIZED** artifact off disk).
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
field carries the unit its name claims"* (home: ruling #294 item 3); VERBATIM: *"a seam-map gate
pins occurrence COUNTS per needle and enumerates EVERY occurrence's site"* (home:
`PC-C0-REACTION-BASELINE.md` §COMMANDER CORRECTIONS item 1); VERBATIM: *"a scored face's
walk-side predicate is pinned — anchored extraction or fixture — because the re-derivation gate
proves arithmetic, not definitions"* (home: `DF-T3-SURFACE-EXAM.md` §COMMANDER CORRECTIONS item
2); VERBATIM: *"a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a
gated face"* (home: `PC-T2-ARMED-WORLD-READ.md` §COMMANDER CORRECTIONS item 4); VERBATIM: *"a
starred finding states its |Δ|÷half-width ratio"* (home: `BU-T0B-PRICE-SEPARATION.md` §COMMANDER
CORRECTIONS item 2); VERBATIM: *"a gate's NOTE derives from the same pinned values the gate
checks; a count typed beside its pin is a second copy"* (home:
`PT-C0-PLAYTEST-FORENSIC-CENSUS.md` §COMMANDER CORRECTIONS item 1, ruling #369 item 3);
VERBATIM: *"a stage doc's HONEST LIMITS list is the ONE home; the artifact stores that list
verbatim or stores none"* (home: `RC-C0-COOPERATION-CENSUS.md` §COMMANDER CORRECTIONS item 3,
ruling #367 item 3) — **this artifact stores `honestLimits: null`; the list at §R HONEST LIMITS
is the ONE home**; VERBATIM: *"verifier scratch walks use the stage's own consumed band or the
out-of-band scratch range (≥ 900,000,000) — never the next virgin block"* (home:
`PW-T0C-OBJECTIVE-FIDELITY.md` §COMMANDER CORRECTIONS item 6); VERBATIM: *"WORKER-SIMMED
fixtures play the SHIPPED world (League.toJSON omits matchFlags; true since #155, stated now,
test-pinned; refines #270's E4 correction; matches the perf diagnostic)"* (home: ruling
#283.2(iv)) — **INVOKED here**, because arm S IS that construction. Canon, VERBATIM: *"a
max−min face reports a noise-floor comparison, not a zero-null CI"* (home:
`PC-T1-LEARNING-EXAM.md` §COMMANDER CORRECTIONS item 3) — named and **NOT invoked**: this census
publishes no max−min face. Canon (paraphrase): **receipts ≠ effect sizes** (homes: ruling #289
item 1 + `BU-T1-MT-COMPOSITION.md` §COMMANDER CORRECTIONS item 5) — the facing-free fixture's
ratio of 1 is a **RECEIPT**, never a football effect size.

## §DEV-PREFLIGHT — the sizing smoke, disclosed in full

A **12-cluster scratch smoke** (`BFC0_MODE=smoke BFC0_N=12`, seeds **900,002,300–311**, lockstep
on **900,002,390–391**, artifact off the canonical path under `/tmp`) was run **BEFORE this
freeze**. Its realised half-widths were read out of the smoke artifact's own `faces[].halfWidth`
fields — **never re-typed from the console's rounded print** — and are hardcoded in the
instrument's `SIZING_INPUTS` (the six rows in §P.G's table).

**Disclosed honestly:**

* On that run **`gN` was RED by construction**: `SIZING_INPUTS` still carried placeholder
  half-widths of `0.0`, so `nRequired` was 0 and `SIZING_OK` was false, and the artifact routed
  to its `.RED.json` side path — which is exactly what the red-routing idiom is for. **Every
  other gate was GREEN on that first run** (12/13), including `gShippedConstruction`,
  `gSeamMap`, `gWalkFixtures`, `gClassesNonVacuous`, `gLockstep` and `gFaces`. No instrument
  defect was found and nothing else was changed between the smoke and this freeze except the
  six half-widths and `N_FROZEN`.
* The smoke also fixed the **artifact-size** fact §P.G's N decision rests on: **45,972 compact
  bytes per seed-pair** (551,667 bytes of `perSeedCells` over 12 seeds), total 843,209 bytes;
  wall **4.64 s**; **3,386** of the 34,560 cells occupied on arm E and **3,034** on arm S.
* ⚠ **12 clusters is a NOISY variance estimate** — a strictly weaker assumption than sizing off
  a published battery. Said here, before the battery.
* ⚠ The smoke's own POINT readings are **UNPOWERED and bind nothing**. For the record, so nobody
  can claim the freeze was written after seeing a battery: the smoke read `E.share45` ≈ 0.1375,
  `E.share90` ≈ 0.0315, `E.faceTargetSetShare` ≈ 0.1019, the misaligned split ≈ 0.653
  faceTarget-driven / 0.347 motion-follow, metres/match ≈ 8,787 total · 490 above 45° · 117
  above 90°, GK `share90` ≈ 0.0922 (E) and ≈ 0.1539 (S), and the three sensitivity rows ≈ 121 /
  297 / 471 m per match on E. **None of these numbers is a finding**; the battery's own §R
  replaces every one of them.
* **This section binds nothing.** The freeze is §0–§P.H above.

## §R RESULTS (results commit; every number below QUOTES the artifact's own fields at 6 dp —
## the artifact is the numbers of record, per the #357 standing order)

**RUN RECEIPTS.** Freeze **`5010777`**. `git diff 5010777..<results> -- scripts/probes/bf-c0-*.ts`
is **EMPTY** — no frozen constant, bin edge, cut, pair, shape or pin moved after sight.
**13/13 gates green**; `gFaces` **411/411 face-and-Δ** checks and **38/38 stored-bin /
EXPOSURE-TABLE / median / headline-from-histogram / sensitivity / seam-map /
facing-free-fixture / sizing** checks re-derived from the SERIALIZED artifact off disk.
**394 faces · 17 Δ · 53/53 walk-side fixtures · 23 anchored sites.** Artifact
`docs/world-model/data/bf-c0-movement-facing-census.json`, **COMPACT JSON** (the file opens
`{"stage":{"id":"BF-C0",…` with no indentation), **9,620,457 bytes**,
`instrumentSha256 = 6b73d5cc3cb55a4cb33774502ae5e8d508a4858e7b0c75e0a69b8ec123a58cb5`,
`hashedBodySha256 = 94a2c3fca2cfd0f8828e8831ed1690af796edd79bff7749d9bc93782caa4abfd`,
**file byte-hash `481371bcbc770a669a3060dd5df298c1fe522e368f1fea814b849da809e416d3`**.
⭐⭐ **THE HASH RECEIPT, OUTSIDE THE BODY**: `receipts.hashReproducesFromFile` = **true** — the
instrument re-read the written file and recomputed the **28-key** body hash equal to the
recorded one. Battery **200 shared seeds (12,537,000–12,537,199) × 2 arms + the construction
receipt 12,537,999 in both arms, BOOKED = WALKED = 402 walks**; **⚠ the block is NOT consumed
whole — the unwalked tail 12,537,200–12,537,998 is DECLARED and stays virgin** (§P.G's
artifact-size reason, frozen before the battery). Lockstep on scratch 900,002,390–391 (both
arms); the sizing smoke on scratch 900,002,300–311. **ZERO stats consumed** — registry **73**.
X-SRC-ZERO. `npm run typecheck` clean with the probe in the tree; `npm run fingerprint` =
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — **the literal of record in
`tests/a4HomeGrant.test.ts` (line 38), UNCHANGED** (a census cannot move it). Instrument wall
**45.06 s** (`perf.batteryWallSeconds` **43.249000**, `perf.meanWallSecondsPerMatch`
**0.098395**).

### §R1 (a) TODAY'S MISALIGNMENT

**⭐⭐ THE HEADLINE.** In the world the exams are run on, **one moving tick in seven is spent
running more than 45° off the body's heading, and one in thirty-one is spent going, in part,
backwards.**

| face | **E (world 12 empty-book)** | **S (the shipped default)** |
|---|---|---|
| `share45` — φ > 45° | **0.138256** [0.137030, 0.139510] | **0.139851** [0.138427, 0.141322] |
| `share90` — φ > 90° (backpedal) | **0.031930** [0.031367, 0.032462] | **0.036486** [0.035620, 0.037395] |
| `faceTargetSetShare` | **0.103659** [0.102340, 0.105000] | **0.100551** [0.099093, 0.102001] |
| `misalignedFaceTargetDrivenShare` | **0.657389** [0.652933, 0.661933] | **0.650318** [0.642077, 0.657965] |
| `misalignedMotionFollowShare` | **0.342611** [0.338084, 0.347072] | **0.349682** [0.342078, 0.357934] |
| `backpedalFaceTargetDrivenShare` | 0.339971 [0.331360, 0.347870] | 0.399526 [0.390495, 0.408363] |
| `movingShareOfBodyTicks` | 0.876502 | 0.872354 |
| `movingTicksPerMatch` | 131475.280000 | 135378.860000 |
| `openPlayTicksPerMatch` | 12525.505000 | 12976.590000 |
| `meanSpeedOverall` (m/s) | 4.164864 | 4.091324 |

Denominators: **26,295,056** moving open-play body-ticks on E and **27,075,772** on S;
**3,635,440** (E) and **3,786,570** (S) of them misaligned past 45°; **839,609** (E) and
**987,875** (S) past 90°.

**⭐⭐ TWO THIRDS OF THE MISALIGNMENT IS A DECISION, NOT LAG.** `faceTarget` is set on only
**0.103659** of moving ticks, but **0.657389** of the misaligned ticks are `faceTarget`-driven.
Split by class the two populations barely overlap: a body with **`faceTarget` NULL** is past
45° on **0.052846** of its moving ticks (n = 23,569,348); a body with **`faceTarget` SET** is
past 45° on **0.876800** of them (n = 2,725,708). ⇒ **the law would be pricing decisions the
executors already make, not punishing the turn cap for being slow.** ⚠ The complement is real
and is not zero: **0.342611** of misaligned ticks are motion-follow lag, a heading still
swinging round at `TURN_RATE` after the velocity changed direction, and **nobody decided that**.

**METRES on the 240 s match clock.** Total ground covered while moving: **9126.277078** m/match
(E), **9231.313992** (S). Of it, **518.721098** m/match is run past 45° (E; **533.477361** S)
and **126.556763** m/match past 90° (E; **155.479703** S) — **5.68 %** and **1.39 %** of the
moving metres on E.

**⭐⭐ BY ROLE — IT IS THE KEEPER, AND IT IS NOT CLOSE.**

| role | `share45` E | `share90` E | 95 % CI (share90 E) | `faceTargetSetShare` E | metres45/match E | metres90/match E | `share90` S |
|---|---|---|---|---|---|---|---|
| **GK** | **0.855206** | **0.096296** | [0.092669, 0.099884] | **0.950631** | **309.410965** | **50.887482** | **0.132274** |
| DF | 0.070517 | 0.033064 | [0.032325, 0.033817] | 0.004880 | 47.920551 | 18.151644 | 0.032983 |
| MF | 0.053927 | 0.024040 | [0.023432, 0.024688] | 0.005070 | 42.225608 | 15.503303 | 0.026847 |
| WG | 0.046582 | 0.020244 | [0.019837, 0.020666] | 0.004026 | 76.918004 | 26.656090 | 0.020356 |
| ST | 0.054210 | 0.024643 | [0.024051, 0.025223] | 0.004128 | 42.245971 | 15.358244 | 0.024161 |

The keeper spends **0.855206** of his moving ticks off-heading and has a facing decision live on
**0.950631** of them; every outfield role sits between **0.046582** and **0.070517**. Of the
**518.721098** misaligned metres per match, the keeper runs **309.410965** — **59.649 %** of them,
from **10.5 %** of the moving ticks. **⚠ THE OUTFIELD ROLES ARE NOT ZERO** (a DF still runs
**47.920551** m/match past 45°), but on today's numbers **a facing law is, first and foremost, a
law about goalkeepers.**

**⭐ THE φ DISTRIBUTION (bins stored) AND THE ENVELOPE RECEIPT.** The bin-derived **median φ is
0** degrees on both arms (`medians.values.<arm>.phiDegAtLowerEdge` — bin 0 alone holds
**0.820570** of E's moving ticks).

| φ bin | share E | **mean speed E (m/s)** | 95 % CI | share S | mean speed S |
|---|---|---|---|---|---|
| 0–15° | 0.820570 | **4.656679** | [4.637974, 4.675297] | 0.818533 | 4.585736 |
| 15–30° | 0.022916 | 2.580511 | [2.566507, 2.593991] | 0.023955 | 2.431704 |
| 30–45° | 0.018259 | 2.622092 | [2.605095, 2.640192] | 0.017661 | 2.438018 |
| 45–60° | 0.015647 | 2.618946 | [2.595373, 2.642568] | 0.014356 | 2.423901 |
| 60–75° | 0.018194 | 2.469348 | [2.447033, 2.490521] | 0.014240 | 2.461720 |
| **75–90°** | **0.072485** | **1.283893** | [1.270022, 1.297767] | **0.074769** | 1.306364 |
| 90–105° | 0.008555 | 1.920440 | [1.902593, 1.938424] | 0.010087 | 1.951716 |
| 105–120° | 0.006825 | 1.830647 | [1.808605, 1.852522] | 0.007613 | 1.913609 |
| 120–135° | 0.005519 | 1.725931 | [1.701076, 1.749346] | 0.006177 | 1.794219 |
| 135–150° | 0.004461 | 1.656025 | [1.619146, 1.694421] | 0.004967 | 1.719189 |
| 150–165° | 0.003366 | 1.687989 | [1.642197, 1.730904] | 0.003984 | 1.856827 |
| 165–180° | 0.003203 | 1.946542 | [1.890642, 2.001256] | 0.003657 | 2.087137 |

**⚠⚠ READ THIS ROW CORRECTLY — IT IS A SELECTION STATISTIC, NOT AN ENVELOPE TEST**, and §P.B
said so before the battery. Mean speed falls from **4.656679** m/s at φ ≈ 0 to about **1.7–1.9**
m/s past 90°. **That is NOT the engine charging for facing.** The engine charges nothing —
`facingFreeReceipt.distanceRatio` = **1**, §R3. It falls because of **who ends up in those
bins**: above the 0.5 m/s floor a body with no facing decision has its heading dragged onto its
velocity at `TURN_RATE`, so a fast straight runner is aligned *by construction*, and the
off-heading bins are filled by slow bodies (keepers on their line, bodies changing direction).
**⇒ The baseline the law's exam is read against is the FIXTURE's ratio of 1, not this column.**

**⭐ THE 75–90° SPIKE IS THE KEEPER.** Bin 5 holds **0.072485** of all moving ticks against
**0.015647–0.018259** in its neighbours — because **0.624788** of the keeper's own moving ticks
sit there (`bins.E.roleXphiTicks[0]`): `GoalkeeperPosition` faces the ball while shuffling
**along** his line, which is very close to exactly 90°.

**⭐⭐ BY ACTION CLASS — the five highest `share90` on E among live classes, with their weight:**

| action | `share90` E | 95 % CI | `share45` E | share of all moving ticks | n (E) | `share90` S |
|---|---|---|---|---|---|---|
| `GoalkeeperSave` | **0.795217** | [0.760317, 0.827637] | 0.898034 | 0.000627 | 16,476 | 0.768271 |
| `ThrowOut` | 0.566667 | [0.000000, 1.000000] | 0.666667 | 0.000001 | **30** | 0.130435 |
| `HoldPosition` | **0.528189** | [0.487620, 0.564109] | 0.886939 | 0.002729 | 71,749 | 0.453518 |
| `Cross` | **0.405540** | [0.364297, 0.445891] | 0.494915 | 0.000176 | 4,621 | 0.375084 |
| `HoldUp` | 0.309117 | [0.085246, 0.521925] | 0.475783 | 0.000027 | **702** | 0.274379 |

⚠ **`ThrowOut` (n = 30) and `HoldUp` (n = 702) are tiny and their intervals say so** — `ThrowOut`'s
runs the whole unit interval. The class that actually carries the weight is **`GoalkeeperPosition`:
`share90` 0.082484 [0.078935, 0.085990] but `share45` 0.897403 on 2,522,792 ticks — 0.095942 of
every moving tick in the world and 347.015642 metres per match**, of which **287.910860** are run
past 45°.

**⭐⭐ THE STORY THAT DID NOT SURVIVE CONTACT — THE MARKER DOES NOT BACKPEDAL.** `MarkOpponent`
is the **second-biggest** action class by moving ticks (**0.277846** of them, 7,305,963 ticks,
2634.307958 m/match) and its misalignment is **ordinary**: `share45` **0.047027**, `share90`
**0.021026** [0.020529, 0.021554]. The dispatch's own example ("backpedalling markers") is not
what this engine does: **`MarkOpponent` never writes `faceTarget`** (§R3's seam map — the
"backpedal, 27.5" comment lives on the KEEPER), so a marker's heading simply follows wherever he
runs. ⇒ **under a facing law as drafted, markers would pay almost nothing today** — and whether
they *should* start backpedalling is an emergence question for BF-T1, not a census finding.

**BY SIDE-OF-BALL** (E): with my own side in possession `share45` **0.124325** / `share90`
**0.037872** (0.154878 of moving ticks); with the opponents on the ball **0.105130** /
**0.024077** (0.153841); with the ball **loose** **0.148749** / **0.032347** — and loose is
**0.691281** of every moving tick. ⚠ "Loose" dominates because it includes every tick between
touches, not only scrambles.

**BY SPEED BIN** (E): the misalignment lives at walking pace and vanishes at sprint —
(0.5,2) m/s `share45` **0.432562** · [2,4) **0.140406** · [4,6) **0.029982** · [6,∞)
**0.001551**; `share90` **0.094367** · **0.038585** · **0.006080** · **0.000920**. The four bins
hold **0.226542 / 0.220711 / 0.296012 / 0.256735** of moving ticks. **⇒ a facing factor would
bite almost entirely on slow movement** — which is exactly the region VISION S11 already names
as glue (转身/低速).

### §R2 (b) THE EXPOSURE TABLE AND THE FROZEN SENSITIVITY

**THE TABLE** is published in full in the artifact: `bins.E.exposureTicks` /
`bins.E.exposureMetres` and the same for S, each **24 actions × 5 roles × 12 φ bins**, with
`gFaces` re-deriving **every entry of both halves** from the per-seed cells off disk. **71** of
the 120 (action × role) rows are occupied on E; **6,032** of the 34,560 full cells are non-empty
on E and **5,467** on S.

**The fourteen rows that carry the most misaligned ground (arm E).** ⚠ The metres columns are
**DERIVED** from the artifact's own `bins.E.exposureMetres[action][role]` (a 200-match TOTAL, in
metres) by summing the φ bins at or above the stated cut and dividing by the 200 matches walked;
the ticks column is `bins.E.exposureTicks[action][role]` summed over all φ bins, as stored:

| action × role | metres45/match | metres90/match | total metres/match | moving ticks |
|---|---|---|---|---|
| **`GoalkeeperPosition` × GK** | **287.910860** | **37.627961** | 347.015642 | 2,522,792 |
| `MoveToFormationSpot` × WG | 26.565861 | 9.245297 | 1095.801401 | 2,873,594 |
| `MoveToFormationSpot` × DF | 20.853854 | 8.198906 | 451.131333 | 1,899,929 |
| `MarkOpponent` × WG | 18.044413 | 6.118181 | 1192.289708 | 3,045,317 |
| `MoveToFormationSpot` × ST | 13.343728 | 4.717916 | 434.800936 | 1,279,580 |
| `MoveToFormationSpot` × MF | 12.680061 | 4.466350 | 466.536919 | 1,428,038 |
| `HoldPosition` × GK | 12.511223 | 7.377850 | 14.102757 | 71,749 |
| `MarkOpponent` × DF | 12.415415 | 4.861669 | 395.674593 | 1,256,085 |
| `MarkOpponent` × MF | 11.286541 | 4.141286 | 487.625324 | 1,425,132 |
| `MarkOpponent` × ST | 10.960902 | 4.046386 | 558.718334 | 1,579,429 |
| `ChaseBall` × WG | 9.049899 | 3.440641 | 580.090539 | 1,161,016 |
| `MakeRun` × ST | 7.242747 | 2.493175 | 273.382223 | 739,765 |
| `ChaseBall` × MF | 6.987053 | 2.959824 | 340.703170 | 787,955 |
| `SupportBallCarrier` × WG | 6.687458 | 2.365531 | 271.163623 | 667,711 |

One row is **half the exposure**; the rest is a long thin tail spread across formation movement,
marking and chasing.

**⛔⛔ THE SENSITIVITY — ARITHMETIC OVER THE CENSUS, NOT A SIMULATION.** These rows apply the
frozen linear f(φ) to the metres **this world actually ran** and report what it would subtract
**if every body ran exactly the same paths**. Bodies would **not**: pricing a decision changes
the decision, which is the entire point. **The real law is BF-T0's and its effect is BF-T1's.**

| (LATERAL, BACK) | E metres lost / match | 95 % CI | as a share of moving metres (E) | S metres lost / match | S share |
|---|---|---|---|---|---|
| `gentle` (0.90, 0.80) | **126.341152** | [125.315254, 127.377800] | **0.013844** | 130.361591 | 0.014122 |
| `moderate` (0.75, 0.60) | **310.868084** | [308.333291, 313.480234] | **0.034063** | 319.715624 | 0.034634 |
| `steep` (0.60, 0.45) | **492.902617** | [488.861925, 497.069283] | **0.054009** | 505.975481 | 0.054811 |

**⇒ THE BLAST RADIUS, IN ONE SENTENCE: even the steep pair takes only 5.4 % of the ground this
world covers — and roughly 60 % of that comes off one role.** A facing law is a **small,
concentrated** change to today's movement, not a world-wide brake. ⚠ Which is also the warning:
if the law is meant to give `agility` a *movement* consequence for outfield bodies, today's
exposure gives it **1.6 %–3.5 %** of an outfielder's ground to work with, and its real force
would have to come from bodies **changing what they do**.

### §R3 (c) THE `faceTarget` SEAM MAP

The needle `faceTarget` occurs **57 times in 8 of the 152 `.ts` files under `src/`**, each
per-file count PINNED and each occurrence's line enumerated (`gSeamMap`):
`src/ai/PlayerBrain.ts` 1 · `src/ai/actionExecutor.ts` 18 · `src/ai/inLookAct.ts` 1 ·
`src/ai/pcLatency.ts` 1 · `src/ai/receiverAnticipationSeat.ts` 1 · `src/sim/Match.ts` 12 ·
`src/sim/Player.ts` 3 · `src/sim/rendezvousRecovery.ts` 20.

Of the **24** `<obj>.faceTarget =` matches: **2 sit inside COMMENTS**
(`src/ai/actionExecutor.ts:1270`, `src/ai/pcLatency.ts:275` — they quote the pattern), **4 are
NULL RESETS** and **18 are DECISION writes** that can set a non-null point. **The decisions the
law would price:**

| file:line | what it serves | away from motion by design? | live? |
|---|---|---|---|
| `actionExecutor.ts:683` | ⭐⭐ **`GoalkeeperPosition` — "backpedal facing the play (27.5)"**: he works along his line with his body pointed at the ball. **THE SITE THE LAW WAS WRITTEN FOR** — and §R1/§R2 say it is also the only one with real weight. | **YES** | shipped, open play |
| `actionExecutor.ts:663` | **`HoldUp`** — the pivot shield: drifts away from the nearest opponent while facing **his own goal** ("chest toward our own half so the lay-off is played with the facing"). | **YES** | shipped, open play |
| `actionExecutor.ts:615` | `ShieldBall` — turns away from the nearest threat **and moves the same way**: aligned by construction, so it pays nothing. | no | shipped, open play |
| `actionExecutor.ts:624` | `ShieldBall` with no threat found — faces the opponent goal while **standing** (target = his own position). | depends | shipped, open play |
| `actionExecutor.ts:671` | `GoalkeeperSave` — faces the ball while moving to the intercept point (`share90` **0.795217**: in practice, mostly against his motion). | depends | shipped, open play |
| `actionExecutor.ts:679` | `GoalkeeperRush` — faces the ball **and runs at it**: aligned by construction. | no | shipped, open play |
| `actionExecutor.ts:736` | the free-kick **wall** — faces the ball's spot while walking to his slot. A restart state, so mostly outside this census's open-play population. | depends | shipped, restarts |
| `actionExecutor.ts:1178` | C7 T1 — the **shot** wind-up plant (faces the aim, held on his own spot). | depends | dormant (`c7Windup`) |
| `actionExecutor.ts:1192` | ⭐ O1 T1 — **the pass wind-up plant** (faces the aim, held on his own spot). | depends | armed in world 12, dormant shipped |
| `actionExecutor.ts:1288` | the PC latency **hold** — a surprised body keeps the facing he applied before the event was observable. | depends | dormant (`pcLatency`) |
| `actionExecutor.ts:1341` | the keeper **holding the ball** squares up to the opponent goal (Phase 51.2). | depends | shipped |
| `actionExecutor.ts:1347` | the **restart taker** standing over the ball faces the play. | depends | shipped, restarts |
| `Match.ts:3845` | the **shooter's aim lock** during the C7 wind-up. | depends | dormant (`c7Windup`) |
| `Match.ts:3975` | ⭐ **the wind-up passer's aim lock** (`passer.faceTarget = mate.pos`) — **this is the turn RC-C0b measured and found free**. | depends | armed in world 12, dormant shipped |
| `rendezvousRecovery.ts:187 · 214 · 247 · 416` | restore / apply / shadow / commit — they **replay** a facing another site authored; they author none. | depends | rendezvous recovery |

**THE NULL RESETS** (`kind: 'reset'`): `actionExecutor.ts:155` — **the per-frame default, and the
single most important line in this census**: every body starts each executor pass with **no**
facing decision, which is why **0.896341** (= 1 − `E.faceTargetSetShare` 0.103659) of moving
ticks let the heading simply follow the
motion; `Match.ts:3864` and `Match.ts:3998` — the shooter's and the passer's aim locks released
at the strike; `Player.ts:246` — `becomeSub`.

**⭐⭐ WHAT THE MAP SAYS, PLAINLY: only TWO of the eighteen decision sites aim a body away from
its motion on purpose, and between those two, `GoalkeeperPosition` × GK carries **287.910860** of their **287.974045**
misaligned metres per match (`HoldUp` contributes **0.063185**). On its own that one row is
**55.504 %** of ALL the misaligned ground in the world.** The
census's own name for the other pattern — a receiver drifting while facing the ball, a marker
backpedalling — is that **it does not exist in this engine yet**. `ReceivePass` reads `share90`
**0.021463** and `MarkOpponent` **0.021026**, both at the outfield baseline. ⇒ **the law would
not price behaviours that are already there; it would open a price at which such behaviours
could evolve.**

### §R4 (d) THE REALITY ANCHOR — AND MY ACCESS, STATED

⛔ **THE CENSUS DOES NOT CHOOSE `LATERAL` OR `BACK`.** Contract M-BF.1 makes them the anchor's
own fractions, **ratified by the commander at banking**.

**BACKWARD RUNNING — range of record 0.60–0.75 of maximal forward sprint speed.**

* **Uthoff A., Oliver J., Cronin J., Harrison C., Winwood P.** — the backward-running programme
  of work; *"Sprint-Specific Training in Youth: Backward Running vs. Forward Running Training on
  Speed and Power Measures in Adolescent Male Athletes"*, **Journal of Strength and Conditioning
  Research (2020) 34(4)**. Uthoff's own summary of the field: *"backward running is about 70 %
  of the speed of forward"*. — **VERIFIED BY WEB SEARCH on 2026-09-04**: the paper (title,
  journal, year, issue) and the ~70 % summary were both returned. ⚠ **FULL TEXT NOT READ**; the
  70 % is quoted from a secondary summary, not from a table I opened.
* **A randomised controlled trial comparing backward and forward running in collegiate
  athletes** (ScienceDirect S2213398424002367, 2024): forward was faster than backward by
  **26 % (slow), 28 % (moderate), 26 % (fast)** ⇒ backward ≈ **0.72–0.74** of forward at matched
  intensities. — **VERIFIED BY WEB SEARCH on 2026-09-04** (the percentages were returned). ⚠
  **FULL TEXT NOT READ.**
* **Flynn & Soutas-Little (1993)**; **Wright & Weyand (2001)** on the mechanics and the energetic
  cost of backward running — the biomechanical background for *why* it is slower. — ⛔ **FROM
  MEMORY, UNVERIFIED.**

**LATERAL SHUFFLE — range of record 0.55–0.75, and I could NOT verify a clean
max-shuffle ÷ max-sprint ratio.**

* **Comparison of lateral shuffle and side-step cutting in young recreational athletes**
  (ScienceDirect S096663621500987X): **approach velocity 2.1 ± 0.4 m/s in the shuffle against
  3.4 ± 0.6 m/s in the cut** (≈ 0.62). — **VERIFIED BY WEB SEARCH on 2026-09-04** (both
  velocities returned). ⚠ **THIS IS NOT THE RATIO THE LAW NEEDS**: it compares a shuffle
  approach with a *cut* approach, not maximal shuffle with maximal sprint. **FULL TEXT NOT
  READ.**
* **Physiological and Neuromuscular Fatigue after 3-Minute Lateral Shuffle Movement at Different
  Speeds and Distances** (PMC11812171): the protocol shuffles at **1.8 and 2.0 m/s**, against
  team-sport maximal sprint speeds of 8–9 m/s. — **VERIFIED BY WEB SEARCH on 2026-09-04** that
  the protocol uses those speeds. ⛔ **IT DOES NOT LICENCE A RATIO** — those are *prescribed
  submaximal* speeds.
* the practitioner's figure — a defensive shuffle at roughly **two thirds** of forward sprint
  speed, 20-yard shuffle times **1.3–1.5×** the 20-yard forward sprint. — ⛔ **FROM MEMORY,
  UNVERIFIED.**

**⭐⭐ THE ONE THING THE COMMANDER MUST RATIFY AS A CHOICE, NOT A MEASUREMENT.** M-BF.1 requires
`f` **monotone decreasing** in φ, i.e. **BACK ≤ LATERAL**. The evidence above does **not compel
that ordering**: it establishes forward > backward and forward > lateral, and it does **not
resolve which of backward and lateral is slower**. Backward running is a **trained, practised
gait**; a defensive shuffle is a shorter, more braced one, and the two published numbers I could
verify (backward ≈ 0.72–0.74 of forward; shuffle approach ≈ 0.62 of a cut approach) point, if
anything, the *other* way. **⇒ BACK ≤ LATERAL is a MODELLING CHOICE and should be ratified as
one.**

**MY ACCESS, HONESTLY.** I **had** web search in this session and used it. **Four of the seven**
citations were confirmed against search results (titles, journals, years, and the quoted
percentages); **no full text was opened**, so every number is quoted at one remove. The three
marked *FROM MEMORY, UNVERIFIED* were not confirmed at all. ⛔ **No number in this census's
measured faces depends on any of them.**

### §R5 THE E vs S CONTRAST (paired on seeds; REPORTED, NEVER SCORED)

| face | Δ (E − S) | 95 % CI | \|Δ\|÷hw | reads |
|---|---|---|---|---|
| `share45` | −0.001595 | [−0.002869, −0.000262] | 1.223575 | resolvedly below (barely) |
| **`share90`** | **−0.004555** | [−0.005479, −0.003676] | **5.053954** | resolvedly below |
| `faceTargetSetShare` | +0.003108 | [+0.002151, +0.004091] | 3.203708 | resolvedly above |
| `misalignedFaceTargetDrivenShare` | +0.007071 | [−0.000110, +0.014765] | 0.950750 | **contains zero** |
| `metres45PerMatch` | −14.756263 | [−20.906838, −8.812054] | 2.440104 | resolvedly below |
| **`metres90PerMatch`** | **−28.922940** | [−32.374673, −25.605110] | **8.544995** | resolvedly below |
| `metresPerMatch` | −105.036914 | [−207.115218, +5.441939] | 0.988317 | **contains zero** |
| `movingTicksPerMatch` | −3903.580000 | [−5153.640000, −2633.715000] | 3.098172 | resolvedly below |
| `meanSpeedOverall` | +0.073539 | [+0.054869, +0.091884] | 3.973519 | resolvedly above |
| **`role.GK.share90`** | **−0.035978** | [−0.040580, −0.031390] | **7.829708** | resolvedly below |
| `role.DF.share90` | +0.000081 | [−0.001146, +0.001221] | 0.068489 | contains zero |
| `role.MF.share90` | −0.002806 | [−0.003977, −0.001719] | 2.485392 | resolvedly below |
| `role.WG.share90` | −0.000111 | [−0.000916, +0.000606] | 0.146305 | contains zero |
| `role.ST.share90` | +0.000483 | [−0.000541, +0.001504] | 0.472042 | contains zero |
| `sensitivity.steep.metresLostPerMatch` | −13.072864 | [−17.766763, −8.342478] | 2.774293 | resolvedly below |

**⭐ THE HEADLINE IS THE SAME IN BOTH WORLDS, AND THE DIFFERENCE THAT EXISTS IS THE KEEPER'S.**
`share45` moves by **0.0016** across two structurally different worlds — the exposure a facing
law would meet is essentially **world-independent**. The one Δ with real size is
**`role.GK.share90` −0.035978 (7.83 hw)**, and it drags `share90` (−0.004555, 5.05 hw) and
`metres90PerMatch` (−28.92 m/match, 8.54 hw) with it: **the shipped default's keeper backpedals
more than world 12's** (0.132274 vs 0.096296). ⚠ **NO ATTRIBUTION IS OFFERED.** The two worlds
differ in the pass wind-up, the corridor stack and the RA doors all at once, and the shipped
default also plays a visibly different game (pass completion **0.732760** vs **0.575237**,
goals/match **2.245000** vs **3.320000**, ground passes **99.405000** vs **78.020000**). This is
a REPORTED contrast; ⛔ **nothing here is scored, and no metre of it is claimed for any
mechanism.**

### §R6 CONTEXT (rates on the 240 s match clock; 1 sim-s = 22.5 display-s)

| face | E (world 12 empty-book) | S (the shipped default) |
|---|---|---|
| open-play ticks / match | 12525.505000 | 12976.590000 |
| moving body-ticks / match | 131475.280000 | 135378.860000 |
| moving share of open-play body-ticks | 0.876502 | 0.872354 |
| mean speed while moving (m/s) | 4.164864 | 4.091324 |
| metres covered while moving / match | 9126.277078 | 9231.313992 |
| goals / match | 3.320000 | 2.245000 |
| engine ground passes / match | 78.020000 | 99.405000 |
| engine whole-match pass completion | 0.575237 | 0.732760 |

⚠ **`movingShareOfBodyTicks` = 0.876502** — nearly nine open-play body-ticks in ten are above the
0.5 m/s floor, so the census population is very nearly "every body, every open-play tick". The
0.5 m/s floor removes standing bodies, **and with them every standing turn**: see HONEST LIMITS 4.

## §R HONEST LIMITS

1. **⛔⛔ A CENSUS CANNOT SAY WHAT BODIES WOULD DO ONCE TURNING COSTS SOMETHING.** Every number
   here describes a world in which facing is FREE. Under a real law a keeper who pays for
   backpedalling may stop backpedalling; a receiver who pays for opening his body may open it
   anyway because the reception is worth more. **The exposure table sizes what the law would
   TOUCH, not what it would DO.** That is BF-T1's question and nothing here answers it.
2. **⛔⛔ THE SENSITIVITY ROWS ARE ARITHMETIC, NOT A SIMULATION.** §R2's 126 / 311 / 493 m per
   match apply a frozen factor to the ground this world actually ran, holding every path fixed.
   Paths would not stay fixed — pricing a decision changes the decision. ⛔ **None of those three
   numbers is a prediction of BF-T1's Δ.** The (L, B) pairs are ILLUSTRATIVE and were frozen
   before the battery precisely so they could not be reverse-engineered from the answer.
3. **⚠ THE MEAN-SPEED-PER-φ-BIN ROW IS SELECTION, NOT A CHARGE.** Speed falls with φ (4.657 →
   ~1.7 m/s) because slow bodies and keepers populate the high-φ bins, not because the engine
   charges anything. The engine's own answer is the FIXTURE: two identical bodies, one facing
   90° off, covered **12.503856421401169 m each — the same IEEE double** — with the faced body's
   heading **1.573171785161599 rad** off its velocity. `facingFreeReceipt.distanceRatio` = **1**.
   ⭐ **That ratio is a RECEIPT, never an effect size.**
4. **⚠ THE 0.5 m/s FLOOR EXCLUDES STANDING TURNS, AND THAT IS A REAL HOLE.** The floor is the
   engine's own (`sp > 0.5`), and below it a body with no `faceTarget` does not rotate at all —
   but a body with `faceTarget` set **does**, and a real law would presumably charge a
   pivot-on-the-spot too. **0.123498** (= 1 − `E.movingShareOfBodyTicks` 0.876502) of open-play
   body-ticks (E) sit below the floor and this
   census says **nothing** about them. A standing turn is not in any number on this page.
5. **⚠ "MOTION-FOLLOW LAG" IS A LABEL, NOT A MECHANISM.** The 0.342611 of misaligned ticks with
   `faceTarget` null are ticks on which the heading is behind the velocity — usually because the
   velocity changed direction faster than `TURN_RATE` could follow. The census **cannot
   distinguish** that from a body whose velocity is oscillating around a slow drift. The
   distinction that IS clean is the one the cell carries: decision vs no decision.
6. **⚠ SIDE-OF-BALL "LOOSE" IS 0.691281 OF THE POPULATION** and is not a synonym for a scramble:
   `ball.owner === null` covers every tick between touches, including flighted passes. ⛔ Do not
   read `loose` as "chaos".
7. **⚠ SMALL ACTION CLASSES ARE SMALL.** `ThrowOut` (n = 30 moving ticks on E) and `HoldUp`
   (n = 702) carry the two widest intervals on the page ([0.000000, 1.000000] and [0.085246,
   0.521925]). Three classes — `MoveToPoint`, `TrackRelativePoint`, `ShieldHold` — are **empty on
   both arms** and their faces round-trip as `null`; so does the overflow slot, which is the
   receipt that no unnamed action label appeared.
8. **⚠ THE BLOCK IS NOT CONSUMED WHOLE.** N_FROZEN = 200 against a block of 999, for the
   artifact-size reason frozen at §P.G (999 seeds ⇒ ~46 MB). The tail **12,537,200–12,537,998**
   is declared and virgin. Every sizing row resolved at ≤ 14 clusters and realised far inside its
   target: the headline `share45` half-width is **0.001240** against a 0.01 target, and
   `role.GK.share90`'s is **0.003607** against 0.02.
9. **⚠ TWO WORLDS, AND THEIR DIFFERENCE IS NOT ATTRIBUTED.** §R5's contrast is REPORTED. The two
   arms differ in the pass wind-up, the corridor stack and the RA doors simultaneously, and they
   play visibly different football. ⛔ No Δ in §R5 is evidence about any single mechanism.
10. **⚠ THE SEAM MAP IS A STATIC READ OF `src/`, AND ITS "LIVE / DORMANT" COLUMN IS A CODE
    READING.** `gSeamMap` pins occurrence counts and enumerates every site, but the census does
    **not** attribute a runtime tick to the site that set its `faceTarget` — it only knows SET vs
    NULL. Which of the eighteen decision sites produced a given misaligned tick is inferred from
    the action class, not measured.
11. **⚠ THE REALITY ANCHOR IS QUOTED AT ONE REMOVE.** Four of seven citations were confirmed by
    web search on 2026-09-04; **no full text was opened**; three are from memory and unverified.
    The monotone ordering M-BF.1 assumes (BACK ≤ LATERAL) is **not established** by that
    evidence — §R4. ⛔ The commander ratifies the constants; this census supplies evidence, not a
    choice.
12. **⛔ THIS CENSUS ADJUDICATES NOTHING.** It has no pre-commitment and prints no verdict word.
    What the exposure implies for M-BF.1's shape, whether `agility` can carry a penalty that only
    touches 1.6–3.5 % of an outfielder's ground, and whether the keeper-dominated blast radius
    changes the sequencing are the commander's (#373 items 4–6). The world-12 play-test gate
    remains the user's and remains open in parallel.
