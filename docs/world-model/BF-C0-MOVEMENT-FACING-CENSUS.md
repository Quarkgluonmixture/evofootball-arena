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
