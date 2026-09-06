# GK-T1 — 「身体跟着手走 · 考试」 THE DIVE EXAM

> **STATUS: WALKED — the battery has run at N = 999 × six arms; 23 of 24 gates GREEN, ONE RED
> (`gBite`, on one seed of 607, diagnosed and NOT re-scoped), so the artifact sits at its RED
> path by the house's own red-routing idiom.** The FREEZE commit was **`5bffe4e`**; §P (the
> protocol) and
> [`scripts/probes/gk-t1-dive-exam.ts`](../../scripts/probes/gk-t1-dive-exam.ts) were frozen
> BEFORE any battery seed was walked and are byte-identical between the two commits — neither
> was edited after sight of a result.
> §DEV-PREFLIGHT below DISCLOSES the 12-seed scratch smoke that sized N — in full, including
> the one place where the ruling's expectation did not survive contact with the engine.
> Authorized by **COMMANDER RULING #401 item 3**. Artifact:
> [`data/gk-t1-dive-exam.json.RED.json`](data/gk-t1-dive-exam.json.RED.json).
> HONEST LIMITS live in this doc, at §HONEST LIMITS, and nowhere else.

---

## §0 WHAT AND WHY

### The user's sentence, verbatim

> 「并且门将现在仍然有的时候最后一刻突然瞬移到球的那个地方」

### What GK-C0 answered

[`GK-C0-KEEPER-JUMP-CENSUS.md`](GK-C0-KEEPER-JUMP-CENSUS.md), banked as measurement at ruling
#398, read the sentence like this: **the keeper's body is not written in play; THE BALL jumps.**
A save resolves up to the fingertip reach from where his body stands — the ball↔keeper distance
at the save tick averages `save.meanDistanceMetres` **1.968465 m** on GK-C0's E13 arm — and on
`ballJump.catchShare` **0.985375** of catches the carry law then snaps the owned ball into his
feet in one tick, a mean `ballJump.catchMeanMetres` **1.711552 m**. The renderer stretches his
sprite toward the ball while it happens. The eye reads the ball's jump and the sprite's stretch
as *him*.

### The seam this exam examines

GK-T0 → T0b → T0c built the answer and left it **dormant behind one flag**
(`gkDiveBody`, default OFF, in no world and no preset — see
[`GK-T0-DIVE-LAW.md`](GK-T0-DIVE-LAW.md) and
[`GK-KEEPER-BODY-CONTRACT.md`](GK-KEEPER-BODY-CONTRACT.md) §2):

* **M-GK.1** — `tryKeeperSave` records the contact point on the KEEPER (`Player.saveContact
  { x, y, caught }`), the catch branch marking it `caught: true` as the LAST statement of its
  branch, the parry branch `caught: false`.
* **M-GK.2′** — the executor steers him to the contact at `speedF = 1` on EVERY tick the field
  is set (`clampToBox` unless `GoalkeeperRush`).
* **M-GK.3′** — the carry law HOLDS a caught ball AT the contact until the body's own carry
  point comes within `carry`; released by ARRIVAL, by LOSS OF OWNERSHIP (one guarded sweep), or
  by a FRESH GAIN (`giveBall`'s clear). `becomeSub` / `resetForKickoff` clear both; a parry
  contact dies with the sprite's window.

No new constant across the three builds. No save roll, reach, outcome or ledger entry moves at
the tick of the save.

### The question this exam asks — and nothing else

**With the law ON, does the caught ball stop jumping — and what does it cost?**

It is an EXAM. It arms nothing in the game; nothing ships; the flag lives only inside this
instrument's own match constructors. Its reads NAME **GK-ENTRY** (world 15 = world 14 + the dive
door) or STOP. The commander rules.

---

## §P THE FROZEN PROTOCOL

### §P.1 ARMS — six walks per seed, paired on shared seeds

The law has **no dose**, so the axis is ABSENT vs ARMED, on THREE compositions:

| composition | arms | what it is |
|---|---|---|
| **E13** | `E13-ABSENT` · `E13-ARMED` | world 13 EMPTY-BOOK — **THE READ OF RECORD** |
| **D13** | `D13-ABSENT` · `D13-ARMED` | world 13 DOSED — the form the user plays, BESIDE |
| **E14** | `E14-ABSENT` · `E14-ARMED` | world 14 EMPTY-BOOK — BESIDE, because the own-lane door prices the keeper's DISTRIBUTION (#398 item 1(ii)) |

**CONSTRUCTION** — copied from `tests/gkDiveBody.test.ts` l.148–156: the flag goes into the
CONSTRUCTOR's flags beside `a4MatchFlags(<world>)`, and the world is armed AFTER
(`armA4World(m, null, <world>)`, or with the two shipped doses on D13). ABSENT is the same
object with the key **absent**, never `false` — that is the shipped shape (`cfg.gkDiveBody ??
false`, anchored).

**`gWorld`, on every walked match of every arm and on the construction receipt:**
`bqArmedVersion(m) === 13` with `bqCushion` true · on E14 `lnOwnLanePrice` true and
`lnArmedVersion(m) === 14`, on E13/D13 both absent · `gkDiveBody` exactly as the arm is due ·
`edsPerceivedChoice` true · every OBM / CTB / RC / BF seam absent · `info.genome` clean of the
own-lane / RC / CTB / OBM genes. Re-pinned on a CONSTRUCTED match of each arm at scratch seed
900,005,470.

**DOSE PLACEMENT** — canon: never `info.genome`. D13 doses through the SHIPPED LOADERS
(`loadL3Dose` / `loadPcDose` → `armA4World`, which writes `baseGenome` + `effGenome` match-local
copies); both dose files' BYTES are hashed against pinned values and a mismatch is exit 3
BEFORE any seed is walked; the `info.genome`-cleanliness conjunct is inside `gWorld`.

### §P.2 THE WALKER, AND THE RESIDUAL PREDICATE

GK-C0's walker is **INHERITED** — the keeper per-tick series read before and after
`match.step(DT)`, the save join to `shotLog`'s own pending→saved flip, the four save-event
families read off the engine's OWN event text (`catches it` / `parries!` / `claims the high
ball` / `smothers at`), the `keeperReach` reconstruction, the frozen bins — and **RE-ANCHORED AT
THIS HEAD**, because the catch branch changed at GK-T0c and the three release sites are new
spans. 91 anchored sites with line receipts; the whole seam is among them.

**ADDED, read off the engine's own state every tick:** `gk.saveContact` (null / caught / parry),
`ball.owner`, the ball's position, the keeper's position and his **carry point reconstructed
EXACTLY as the waiting branch writes it** (`cx = owner.pos.x + owner.heading.x · carry −
contact.x`, same for y; HELD while `cx² + cy² > carry²` — the squared form is the engine's own,
not a distance paraphrase), `saveAnimTimer`, `gkHoldTimer`, `gkDistributing`, `action.type`,
`match.phase` and `match.restartKickGid`, and whether the catch was one the engine treated as
**`gkFeet`**.

**`gkFeet`** is a local const inside `giveBall`, so it is read TWO ways and both are stored: (a)
**the engine's own consequence** — the `Dribble` action that branch sets, the only way a KEEPER
leaves `giveBall` with it — which is the FACE; (b) the geometric RECONSTRUCTION `restartKickGid
!== gid ∧ (backPass ∨ ¬inPenaltyBox(pos, side))` with the engine's own public `inPenaltyBox`
CALLED and `backPass` read on the PRE-STEP `pendingPass` — published as an AGREEMENT SHARE,
never as a face that gates.

#### THE RESIDUAL PREDICATE (it replaces GK-C0's cap predicate for "written")

> a keeper tick is **RESIDUAL-WRITTEN** iff
> `|pos_after − (pos_before + vel_after · DT)| > 1 mm`
> — the body moved by something other than its own integrated velocity.

`physicsStep` writes `pos += vel · dt` with the SAME `vel` that survives the step (both lines
anchored), so a pure integrated step has residual **exactly 0**. Fixtures, on shipped objects:

| fixture | result |
|---|---|
| a full-speed INTEGRATED step of a shipped `Player` at saturation | residual **exactly 0** — does NOT fire (and the step DID move him, 0.104914 m) |
| the same body's `resetForKickoff` displacement | residual 22.360680 m — **FIRES** |
| the same body's `becomeSub` placement | **FIRES** |
| exactly 1 mm / a hair over 1 mm / zero | does not fire / fires / does not fire |
| **a `resolveOverlaps`-touched step** | **TESTED — and it FIRES. See §DEV-PREFLIGHT.** |

GK-C0's **cap predicate is kept BESIDE as its upper bound** (#398 item 1(i)); both are counted
on both arms.

### §P.3 R1 — THE PRIMARY RULER, THE USER'S FACE

Over every CATCH (the `catches it` event with `giveBall` to the keeper), the ball's per-tick
displacement on every tick of the **OWNED-CAUGHT EPISODE**, its **MAXIMUM per catch**, binned on
the frozen edges **0.1 · 0.3 · 0.5 · 1.0 · 2.0 · 3.0 m** plus the two tails.

**R1 = the SHARE OF CATCHES whose maximum exceeds 1.0 m.** Paired Δ ARMED − ABSENT per
composition, cluster bootstrap, 2,000 draws seeded from the block base.
`r1Down` = the Δ's interval is RESOLVED (excludes zero) AND NEGATIVE.

**The episode, frozen:**
* **ABSENT** — the CATCH TICK and the tick after (there is no contact).
* **ARMED** — the catch tick, every WAITING tick, the RELEASE tick and the one after.
* An episode ends early at loss of ownership or a restart; **how it ended is recorded** as the
  release class (§P.4).

Two things are said out loud rather than assumed away. **(a) The catch tick is included on both
arms.** On that tick the ball is still in FLIGHT — the owned-ball placement sits at the head of
`stepBall`, above `tryKeeperSave` — and the catch branch requires `speed < 21` (anchored), so
its displacement is bounded by 21 · DT = 0.35 m and cannot by itself put a catch over the 1.0 m
threshold. **(b) ARMED's episode is a SUPERSET of ABSENT's in ticks.** Adding ticks can only
RAISE a maximum, so a DOWN reading on the paired Δ is CONSERVATIVE.

**PUBLISHED BESIDE:** the mean maximum per arm; GK-C0's cap-based `ballJump.catchShare` and
`ballJump.catchMeanMetres` recomputed on BOTH arms; the `|Δ| ÷ half-width` ratio wherever a
finding is starred.

### §P.4 THE SEAM'S OWN FACES (published, never gating)

Per composition, ARMED unless stated.

* **THE RELEASE COMPOSITION per catch** — `arrival` · `ownershipLoss` · `freshGain` ·
  `substitution` · `restartPlacement` · `matchEndUnreleased`. ⚠ **AN INFERENCE FROM THE
  ENGINE'S STATE, not a call-site record** — the engine keeps no ledger of which clear fired.
  The frozen precedence, evaluated on the release tick, and its fixtures:
  `matchEndUnreleased` > `substitution` (the keeper's `rosterIdx` changed) > `restartPlacement`
  (the engine's own restart state) > `ownershipLoss` (the ball's owner is no longer him) >
  `arrival` (he still owns it AND his carry point is INSIDE `carry`) > `freshGain` (he still
  owns it AND the carry point is still OUTSIDE `carry`, so the arrival test would have HELD —
  the only remaining clear that runs while he owns the ball). Every branch is fixture-pinned
  with a case where it fires and one where it does not.
* **THE WAIT LENGTH in ticks** per catch — bins, mean, and the share of waits longer than
  **42 ticks**. The 42 is DERIVED, never typed: the sprite's `saveAnimTimer = 0.7` s and `DT`
  are each EXTRACTED from their anchored lines and divided.
* **THE BODY↔CONTACT DISTANCE at the release tick** (bins) and the share of releases with the
  **BODY** — not the carry point — inside `carry`. This is the carry-point-vs-body fork's data.
* **THE MAX ball↔owner distance while waiting.**
* **THE `gkFeet` CATCHES per match on BOTH arms**, and the share lost to a change of ownership
  within 10 ticks.
* **THE CLAIMS' ball displacement at the claim tick on both arms** — a RECEIPT. The claim path
  sets no contact: both `saveContact` writes are inside `tryKeeperSave` (the enumerated
  occurrence census proves it), so the claim's snap is unchanged by construction, and the
  stored boolean that carries that statement is `codeFacts.absentArmIsShippedPath`'s sibling —
  the enumerated write sites themselves.
* **THE KEEPER'S RESIDUAL-WRITTEN TICKS by GK-C0's classes on BOTH arms**, with the `crowded`
  proximity marker beside. **ARMED must add none in the save window** — stored as
  `residualAdds.<composition>.armedAddsNoResidualWrites`, the paired COUNT comparison, with the
  paired Δ of the per-match rate beside.
* **THE SAVE-WINDOW POCKET, on ABSENT-E13 — H-GK-2.** `pocketIsRestartPlacement` = the share of
  save-window residual-written keeper ticks (`saveAnimTimer > 0`, WITHOUT the class precedence)
  that coincide with the engine's own restart placement state — `match.phase` not `playing` at
  the end of the tick, or the phase CHANGED across it, or `match.restartKickGid !== null` — is
  **> 0.5**. If it does not hold, the DOMINANT CLASS is stored and named.

### §P.5 THE GUARDS (F-GK-b)

**TOLERANCE = `NI_FRACTION · |control level|`**, with `NI_FRACTION` **INHERITED BY ANCHOR as an
EXPRESSION** — `1 - 0.275 / 0.380` — read out of `scripts/probes/ctb-t1-supply-exam.ts`'s own
line, cross-read from `scripts/probes/dlc-t1-choice-exam.ts` and required to agree, and
EVALUATED FROM ITS TWO NUMERALS. It is never typed as a decimal anywhere in the instrument.
**BREACH = the paired Δ's interval RESOLVED *and* beyond the tolerance IN THE HARMFUL
DIRECTION.** `breach` on a composition = any gating guard breached there.

| # | face | harmful direction |
|---|---|---|
| **G8** | the keeper's **TIME-TO-DISTRIBUTION** — ticks from the catch to his release kick | **CEILING** — longer is the real cost, and it is printed FIRST |
| G1 | goals per match | both |
| G2 | saves per match | both |
| G3 | the catch share of saves | both |
| G4 | xG-per-shot conversion — goals ÷ Σ`xg` off `shotLog` | both |
| G5 | shots per match | both |
| G6 | `passCompletion` | floor |
| G7 | interceptions per match | ceiling |
| G9 | the keeper's holds per match | both |
| G10 | the keeper's passes per match | both |
| G11 | offsides per match | **the #157 FLAG form** — a resolved INCREASE raises a flag and gates NOTHING |

**G8's site**, read off the engine's own record: the tick on which the keeper stops owning the
ball with `ball.lastTouch` still him and the ball moving — what `kickBall` leaves behind
(anchored). Catches whose release never arrives before full time are COUNTED (`ttdUnresolved`)
and excluded from the mean; the denominator is published as `context.ttdResolvedShare`.
**G10 on E14** is the family the own-lane door prices — LN-T1′b measured that door's own effect
on it; this exam measures the DIVE law's effect on the same face and points at LN-T1′b for the
door's, copying no number.

Every guard row stores: control level · Δ · interval · tolerance · harmful direction ·
`resolved` · `beyondTolerance` · `breach` · the LOO flip counts.

### §P.6 THE READS — frozen literals on stored booleans

Copied VERBATIM from ruling #401 item 3(v). **E13 is the read of record**; D13 and E14 carry
AGREE booleans and their own COUNTERFACTUAL WORDS, computed by the SAME frozen rule on their own
stored intervals. Nothing is interpolated into a literal.

* `r1Down` ∧ ¬`breach` ⇒
  *"THE BODY GOES TO THE BALL AND THE CAUGHT BALL STOPS JUMPING — GK-ENTRY is named: world 15 =
  world 14 + the dive door."*
* `r1Down` ∧ `breach` ⇒
  *"THE JUMP IS GONE BUT A GUARD BREAKS — the guard is named; the commander decides with the
  table."* — the breached guard(s) on a SEPARATE annotation line.
* ¬`r1Down` ⇒
  *"THE LAW DOES NOT REACH THE EYE — the seam stays dormant; the commander decides with the
  table."*

BESIDE every read, **the pocket sentence**:

* `pocketIsRestartPlacement` ⇒ *"THE POCKET IS RESTART PLACEMENT (H-GK-2 holds)."*
* else ⇒ *"THE POCKET IS A WRITE IN PLAY — the dominant class is named."* — the class on an
  annotation line.

…and **the G8 Δ printed beside, FIRST, as the cost.**

### §P.7 SEEDS AND SIZING

* **BLOCK 12,552,000–999**, verified fresh against the consumed list (LN-C0 12,544,000–999 ·
  LN-T1 …545 · LN-C1 …546 · LN-C2 …547 · LN-C3 …548 · LN-T1′ …549 · LN-T1′b 12,550,000–999 ·
  GK-C0 12,551,000–999). Frontier of record: next sim ≥ 12,552,000 (#401 item 6).
* **N_FROZEN = 999** — seeds 12,552,000–12,552,998 walked, **12,552,999 the construction
  receipt**; six walks per seed ⇒ 6,000 walks booked. The unwalked tail is declared (expected
  none).
* **ZERO stats consumed**: `stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 81 }`.
* **SCRATCH, all out-of-band (≥ 900,000,000) and all STORED in the `seeds` block:** the smoke
  band 900,005,400–499 (the 12 sized seeds 900,005,400–411, receipt 900,005,420); the world pin
  900,005,470; lockstep and X-DET 900,005,490–491; the fixtures' attribute draw and the overlap
  scene 900,005,499.
* **RE-WALKS 12,551,000–011** for G-REPRO-GKC0 — GK-C0's OWN consumed band, **not a
  consumption** (canon: verifier scratch walks use the stage's own consumed band).
* **SIZING** — the house form, off §DEV-PREFLIGHT's disclosed 12-cluster smoke, at a **declared
  0.05 half-width** on R1's paired Δ (E13). **It asks for more seeds than the block holds** —
  exactly as #401 item 3(vii) predicted, because catches run ≈ 0.5 per match. N is therefore
  **the block's affordance**, `sizing.rows[].resolvableAtNFrozen` stores that it is not
  resolvable at N, and the **REALISED half-width and MDE at N** are published beside the
  projection.

### §P.8 THE GATE SET

The house set — **X-DET** twice on a scratch pair · **X-FP-PROD** (the production fingerprint
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` RECOMPUTED in-process, not
quoted) · **X-SRC-UNTOUCHED** over `src` AND `tests` · **SEED-DISJOINT** · **gN** · **gFaces**
off the SERIALIZED artifact (every published face, every stored bin, every median, every
partition, the guard table, the pocket, the residual-adds, the read words and every sizing row
re-derived from `perSeedCells` off disk) · **gReadWords** · **gHashOrder** (an explicit
allowlist schema; the body hash computed LAST; a NON-body receipt that it reproduces from the
written file) · **BOOKED = WALKED** · **gLoo** (scoped) · **gTwoFractions** · **gStage** ·
**gWorld** — PLUS:

* **G-BITE** — on EVERY battery seed with at least one CATCH on either arm of a composition, the
  ABSENT and ARMED whole-match signatures DIFFER. The liveness receipt.
* **gFlagHygiene** — the flag has no gene and no world, so there is no ARMED-ZERO dose arm. The
  half that exists is proven: the flag KEY ABSENT ≡ the flag passed EXPLICITLY FALSE, on every
  composition × scratch seed. **The other half — OFF ≡ HEAD-BEFORE-THE-SEAM — is G-REPRO-GKC0.**
* **gLockstep** — observed ≡ unobserved whole-match signatures, on BOTH arms of every
  composition. (There is no wrapper at all; this proves it anyway.)
* **G-REPRO-GKC0** — RE-WALK 12,551,000–011 on E13-ABSENT and match **FIELD FOR FIELD** every
  `perSeedCells[].E13` field this exam also computes. The compared set is the INTERSECTION of
  this exam's row keys with GK-C0's, minus `wallMs`, and it is STORED. The residual faces, the
  episode faces and the guard-context fields are NEW and not compared; GK-C0's outfield
  population is not walked here and is not compared (§DEVIATIONS). **A mismatch is RED.**
* **gResidualFixtures** · **gPredicateFixtures** — every predicate with a case where it FIRES
  and one where it does not.
* **gClassesNonVacuous** — catches and parries non-empty on EVERY arm; waits and releases
  non-empty on every ARMED arm. ⛔ Waits and releases are STRUCTURALLY ZERO on every ABSENT arm
  — there is no contact to wait on — so the gate scopes them and the reads are stated on what
  exists.
* **gCodeFactGraph** — the occurrence census and the extracted call graph (§P.9 below).

### §P.9 THE CODE FACTS (the extracted call-graph canon)

Every `saveContact` and every `gkDiveBody` occurrence under `src/**` is ENUMERATED with its
file, line, text and enclosing span, and the **assignment COUNT is gated**. The seam's FIVE
sites — `tryKeeperSave` (both writes), the executor's ONE post-switch override, the ownership
sweep, the `giveBall` clear, the waiting branch — are each hashed WHOLE with their **EXTRACTED**
callee lists (never typed), and the closure is stored beside.

Two stored booleans:

* **`absentArmIsShippedPath`** — with `gkDiveBody` absent, no `saveContact` write is reachable.
  DERIVED from the enumerated assignment sites' own text: exactly TWO assignments carry the flag
  in their own guard; FIVE carry a `saveContact !== null` guard; ONE — the waiting branch's
  arrival consume — sits inside `if (gkHands !== null)` whose own `gkHands` definition line
  carries `this.gkDiveBody`; NONE is ungated; and the field's initialiser is `null`.
* **`ownLaneDoorTouchesNoKeeperPath`** — re-derived at THIS head. GK-C0 published this over FIVE
  roots and ruling #398 item 1(ii) struck it (`decidePlayer`'s first branch routes the ball's
  OWNER into `decideCarrier`, and the keeper owns the ball after every catch). The boolean OF
  RECORD here is the SIX-root one; the five-root value is stored beside as the correction's own
  receipt. **E14 is walked beside because of it.**

---

## §DEV-PREFLIGHT — the disclosed smoke

A 12-seed scratch smoke on **900,005,400–411** (six walks per seed, receipt 900,005,420),
artifact off every canonical path. It sized N and it shook the instrument out. Everything it
found is here.

**1. THE SIZING.** Read out of the smoke artifact's own `deltas[].halfWidth` on the E13 pair —
never re-typed from a rounded console print — and carried into the battery artifact as
`sizing.rows[].hwSmoke`:

| row | smoke half-width | `nRequired` at a 0.05 target | block affords | resolvable at N? |
|---|---|---|---|---|
| `r1.catchMaxOverOneMetreShare@E13` | 0.5769230769230769 | **3,265** | 999 | **no** |
| `guard.timeToDistributionTicks@E13` | 98.88106060606061 | 95,891,247 | 999 | no |

⇒ **N = the block's affordance, 999**, exactly as #401 item 3(vii) said it would be. The
projected half-width at that N is `sizing.rows[].expectedHalfWidthAtNFrozen` and the projected
MDE `sizing.rows[].mdeAtNFrozen`; the **realised** half-widths at N are published at §R1 from
this battery's own paired Δ, never from the projection. ⚠ 12 clusters is a NOISY variance
estimate, and G8's row is on a mean-of-ticks whose spread is large — both said before the
battery.

**2. ⚠⚠ THE RULING'S EXPECTATION ABOUT `resolveOverlaps` DID NOT SURVIVE CONTACT WITH THE
ENGINE, AND IT IS NOT HIDDEN.** Ruling #401 item 3(i) expects the residual predicate NOT to fire
on a `resolveOverlaps`-touched step, "because the overlap resolver writes velocity, not
position". Read at this head, `resolveOverlaps` writes **both**: `a.pos.x += px` / `b.pos.x -=
px` (anchored) as well as the closing-normal velocity removal (anchored). The fixture was
therefore run on the SHIPPED engine — a scratch match stepped into open play, two outfield
bodies of the two sides moved onto the same spot by the probe, one step — and it **FIRES**:
residuals **0.438620 m** and **0.449538 m** on the two pushed bodies, on a tick where **9**
bodies carried no residual at all. ⇒ The residual predicate at this head separates *"not its own
integrated velocity"* from *"integrated"*; it does **not** separate a teleport from an overlap
push. So the exam counts GK-C0's `crowded` PROXIMITY MARKER (another body inside
`PLAYER_MIN_DIST` at the tick's start) **beside every residual face**, stores the overlap class
separately in that marker, and claims nothing stronger. §DEVIATIONS carries this too.

**3. THE OTHER FIXTURE RESULTS, as run:** a full-speed integrated step of a shipped `Player` at
saturation moved him **0.104914 m** with residual **exactly 0**; `resetForKickoff` gave residual
**22.360680 m**; `becomeSub` fires; the 1 mm boundary is pinned on both sides. The ARRIVAL
predicate is pinned in the waiting branch's own SQUARED form, including the **abeam case** the
seam's honest limits name: a body INSIDE `carry` of the contact whose carry point is not, which
still HOLDS.

**4. THREE DEFECTS THE SMOKE CAUGHT, all in the instrument, all fixed before the freeze:**
(a) `faces`, `deltas`, `perSeedCells` and `constructionReceipt` were declared in `BODY_SCHEMA`
but never assigned into the artifact object — `gFaces` could not run at all; (b) `allGreen` was
assigned only after `gHashOrder` read the schema, so the schema-completeness gate went RED on a
field that existed; (c) the abeam ARRIVAL fixture was written with the contact exactly ON the
body, which sits precisely on the `cx² + cy² > carry²` boundary and releases — the fixture was
asserting the wrong thing and said so.

**5. WHAT THE SMOKE DID *NOT* DECIDE.** No read word, no selector, no guard verdict and no face
from the smoke enters this document or the battery artifact. The only smoke values that cross
the freeze line are the two half-widths in the table above (as `sizing.rows[].hwSmoke`) and the
fixture receipts in items 2–3, which are deterministic functions of the fixture seed and
recompute identically in the battery run.

**6. THE CLOCK.** The smoke ran 12 seeds × 6 arms in 28.9 s — `perf.meanWallSecondsPerMatch`
0.11586111111111112 s. At N = 999 that projects to roughly twelve minutes of battery.

---

## §R1 — R1, THE PRIMARY RULER (E13 OF RECORD)

Paired Δ = ARMED − ABSENT, cluster bootstrap, 2,000 draws seeded from the block base.
`down` = the interval is RESOLVED **and** negative.

| composition | ABSENT `r1.catchMaxOverOneMetreShare` | ARMED | paired Δ | 95 % interval | resolved | **down** | \|Δ\| ÷ half-width |
|---|---|---|---|---|---|---|---|
| **E13** *(of record)* | **0.835740** (463 / 554) | **0.104907** (62 / 591) | **−0.730833** | [−0.770071, −0.691559] | true | **true** | **18.617013** |
| D13 | 0.843111 (618 / 733) | 0.117733 (81 / 688) | −0.725378 | [−0.760184, −0.689840] | true | true | 20.623565 |
| E14 | 0.851724 (494 / 580) | 0.103679 (62 / 598) | −0.748045 | [−0.784265, −0.708440] | true | true | 19.730771 |

**`r1Down` is TRUE on all three compositions**, and no gating guard breaches on any of them
(§R2), so all three select the same frozen literal.

**BESIDE — the mean maximum per arm** (`r1.catchMeanMaximumMetres`): E13 **1.692131 m →
0.644729 m** · D13 1.667129 → 0.861765 · E14 1.719185 → 0.729138.

**BESIDE — GK-C0's own cap-based face recomputed on both arms** (`ballJump.catchShare`, and
`ballJump.catchMeanMetres` for the size of the move):

| composition | ABSENT share | ARMED share | ABSENT mean | ARMED mean |
|---|---|---|---|---|
| E13 | 0.985455 (542 / 550) | **0.018966** (11 / 580) | 1.699204 m | **0.003860 m** |
| D13 | 0.990331 (717 / 724) | 0.022157 (15 / 677) | 1.682398 m | 0.004720 m |
| E14 | 0.987762 (565 / 572) | 0.023810 (14 / 588) | 1.737839 m | 0.004999 m |

GK-C0's E13 census read **0.985375** on this face; the ABSENT arm here reads 0.985455 on a
different block of seeds. The ARMED arm's 0.003860 m is the honest shape of the law: the ball
next to the catch no longer moves at all, because it is waiting where the hands are.

**THE FROZEN BINS** (`bins.<arm>.catchEpisodeMaximumM.pooled`, edges 0.1 · 0.3 · 0.5 · 1.0 ·
2.0 · 3.0 m):

| arm | <0.1 | 0.1–0.3 | 0.3–0.5 | 0.5–1.0 | 1.0–2.0 | 2.0–3.0 | ≥3.0 |
|---|---|---|---|---|---|---|---|
| E13-ABSENT | 0 | 23 | 20 | 48 | 234 | 229 | 0 |
| **E13-ARMED** | 0 | **497** | 30 | 2 | 51 | 5 | 6 |
| D13-ABSENT | 0 | 32 | 25 | 58 | 348 | 270 | 0 |
| D13-ARMED | 0 | 566 | 39 | 2 | 63 | 6 | 12 |
| E14-ABSENT | 0 | 25 | 22 | 39 | 271 | 223 | 0 |
| E14-ARMED | 0 | 503 | 27 | 6 | 51 | 3 | 8 |

The bin-derived median of the per-catch maximum
(`medians.values.<arm>.catchEpisodeMaximumMetres`) moves from **1** m on E13-ABSENT to **0.1** m
on E13-ARMED.

**THE REALISED PRECISION AT N** (`sizing.realisedAtN`, this battery's own paired Δ — never the
projection): E13 half-width **0.03925619785816409**, MDE **0.05611306355946099**; D13
0.03517228642863024 / 0.05027549410241324; E14 0.03791261841038768 / 0.05419254239175489. The
projection from the disclosed smoke was `sizing.rows[0].expectedHalfWidthAtNFrozen`
**0.06323037973282973** — the battery came in tighter than the 12-cluster estimate feared, and
R1's Δ is **eighteen half-widths from zero**.

**LOO, SCOPED** to R1 and G8 on the three compositions (`loo.rows`, 999 seeds dropped one at a
time): R1's `looMaxInfluenceShare` is **0.005586187065469971** on E13 and **zero** flips in
either direction on every R1 row. ⚠ This is a receipt on those six rows and nothing else.

---

## §R2 — THE GUARDS (G8 FIRST — the cost)

Tolerance = `NI_FRACTION · |control level|`, `NI_FRACTION` inherited by anchor as the expression
`1 - 0.275 / 0.380`. BREACH = resolved **and** beyond the tolerance in the harmful direction.
Control = the composition's ABSENT arm.

### E13 — the read of record

| # | face | control | Δ | 95 % interval | tolerance | direction | resolved | **breach** |
|---|---|---|---|---|---|---|---|---|
| **G8** | `guard.timeToDistributionTicks` | **353.194605** | **+2.738122** | [−6.924280, +12.052622] | 97.593246 | ceiling | **false** | **false** |
| G1 | `guard.goalsPerMatch` | 3.296296 | −0.126126 | [−0.249249, +0.003003] | 0.910819 | both | false | false |
| G2 | `guard.savesPerMatch` | 5.145145 | +0.050050 | [−0.094094, +0.200200] | 1.421685 | both | false | false |
| G3 | `guard.catchShareOfSaves` | 0.110778 | +0.006764 | [−0.003693, +0.017776] | 0.030610 | both | false | false |
| G4 | `guard.xgConversion` | 1.465122 | −0.054493 | [−0.100534, −0.007875] | 0.404836 | both | **true** | false |
| G5 | `guard.shotsPerMatch` | 12.633634 | −0.042042 | [−0.251251, +0.186186] | 3.490872 | both | false | false |
| G6 | `guard.passCompletion` | 0.588525 | −0.000511 | [−0.004248, +0.003254] | 0.162619 | floor | false | false |
| G7 | `guard.interceptionsPerMatch` | 26.967968 | +0.050050 | [−0.293293, +0.397397] | 7.451675 | ceiling | false | false |
| G9 | `guard.keeperHoldsPerMatch` | 46.794795 | +0.264264 | [−1.842843, +2.421421] | 12.930141 | both | false | false |
| G10 | `guard.keeperPassesPerMatch` | 8.568569 | +0.012012 | [−0.167167, +0.195195] | 2.367631 | both | false | false |
| G11 | `guard.offsidesPerMatch` (FLAG form) | 0.011011 Δ, [−0.103103, +0.126126] | — | — | — | flag only | false | **flag false** |

**`breach` = false on E13.** ⭐ **G4 is the one guard whose Δ is RESOLVED** (goals per unit xG
falls by 0.054493 on a control of 1.465122, an interval that excludes zero) — and it sits **well
inside** its tolerance of 0.404836, so it does not breach. It is named here because a resolved
move deserves naming even when it is tolerated: the save roll is untouched, so this is
downstream — a keeper whose body is at the ball is a keeper standing somewhere else on the next
phase.

### D13 and E14 — the same table, the same verdict

`breach` is **false** on both. The only other RESOLVED guard rows in the whole battery are
**G4 on E14** (Δ −0.050934, [−0.099593, −0.002925], tolerance 0.408053 — the same downstream
move) and **G10 on D13** (the keeper's passes, Δ −0.191191, [−0.366366, −0.010010], tolerance
2.527778). No offside FLAG is raised on any composition
(`offsides.rows.<composition>.flag` false ×3).

### G8, said plainly

**The cost did not resolve.** On E13 the keeper takes **+2.738122 ticks** longer to get the ball
away, on a control of **353.194605 ticks** — an interval that spans zero
(`reads.g8PrintedFirst`). D13 +5.569766 [−1.868426, +12.818250]; E14 +3.639206 [−7.057999,
+14.035840]. ⚠ G8's own LOO influence is large (`loo.rows` `looMaxInfluenceShare`
**0.4670426718152576** on E13) — a mean of ticks with a long tail. **What this row says is that
at N = 999 the delay is not resolvable, not that it is zero.** The denominator receipt is
`context.ttdResolvedShare` **0.936823** (ABSENT) / **0.930626** (ARMED): the catches whose
release kick never arrived before full time are counted (`ttdUnresolved`, 19 ABSENT / 25 ARMED on
E13) and excluded from the mean.

---

## §R3 — THE SEAM'S OWN FACES

### The release composition (ARMED, per catch — an INFERENCE from the engine's state)

| composition | arrival | ownershipLoss | freshGain | substitution | restartPlacement | matchEndUnreleased | catches |
|---|---|---|---|---|---|---|---|
| **E13** | **512** | 58 | **0** | **0** | 6 | 15 | 591 |
| D13 | 588 | 72 | 0 | 0 | 13 | 15 | 688 |
| E14 | 516 | 61 | 0 | 0 | 8 | 13 | 598 |

**ARRIVAL is the usual release**, ownership loss is a real minority, and **`freshGain` — release
(c), the GK-T0c one-statement close — has ZERO observations in 5,994 walked matches**, exactly
as GK-T0's own honest limit predicted (the engine cannot lose and regain inside one step). The
close remains defence-in-depth with an in-play population of zero.

### The wait

`wait.meanTicks` **82.609375** ticks over 576 released waits on E13 (D13 84.659733 / 673;
E14 83.273504 / 585); bin-derived median `medians.values.E13-ARMED.waitLengthTicks` **50** ticks;
the longest single wait stored in any cell is **422** ticks.
**`wait.overSpriteShare` = 0.819444 (472 / 576)** on E13 — four waits in five outlive the
sprite's 42 ticks, which is the seam's own design statement, measured.

### The body at the release, and the fork it feeds

`release.bodyContactMeanMetres` **0.505872 m** over 576 releases on E13, and
**`release.bodyInsideCarryShare` 0.211806 (122 / 576)**: on four releases in five the BODY is
still further from the contact than `carry` when the wait ends — the release is granted by the
**carry point**, which the hold-facing rule swings sideways. That is the carry-point-vs-body
fork's data, and it says the fork is real: making the BODY the arrival predicate would lengthen
roughly four waits in five.

`wait.maxBallOwnerMeanMetres` **2.183924 m** (the mean of the per-episode maximum ball↔owner
distance while waiting); the largest stored in any cell is **4.511243918342705 m**.

### `gkFeet`, the unprotected catch

`gkFeet.catchesPerMatch` on E13: **0.007007** ABSENT (7 catches in 999 matches) and 0.006006
ARMED (6). **`gkFeet.lostWithin10Share` is 0 / 7 and 0 / 6** — not one of them was lost inside
ten ticks, on either arm. `gkFeet.reconAgreementShare` is **1.000000** on every arm: the
geometric reconstruction and the engine's own consequence agree on every catch in the battery.
⚠ The population is thirteen episodes across two arms; the seam's honest limit stands — this
exposure is *rare*, not *safe*.

### The claims (a receipt)

`claim.meanNextDisplacementMetres` E13: **1.388442 m** ABSENT (675 claims) vs **1.353315 m**
ARMED (693). The claim path sets no contact — the code fact carries that, not the arithmetic:
`codeFacts.saveContactAssignments` enumerates all **8** assignments and **both** flag-guarded
writes are inside `tryKeeperSave`. The two arms are not byte-equal here and were never going to
be: once a body has dived, the world moves on from a different place. **The claim still snaps,
under this law as before it.**

### The keeper's residual-written ticks, and the pocket

`residual.keeperShare` on E13: **0.047739602335822424** ABSENT (1,457,542 of 30,531,088 keeper
ticks) and **0.03837648173246955** ARMED. GK-C0's cap face beside on the same population:
`overCap.keeperShare` 0.000304 / 0.000302. ⚠ The residual predicate counts **two orders of
magnitude more** ticks than the cap predicate — that is the `resolveOverlaps` position push
(§DEV-PREFLIGHT item 2), and the proximity marker `residual.crowdedShareOfWritten` is
**0.017645** ABSENT / 0.017139 ARMED.

**`armedAddsNoResidualWrites`** (`residualAdds`, the paired COUNT comparison in the save window):
**TRUE on E13** (336,515 → 322,514) and **TRUE on E14** (339,110 → 329,066); **FALSE on D13**
(272,411 → 279,441). ⚠ Reported as it stands: the D13 count rises, and the paired Δ of the
per-match rate is **+7.0370370370370665 [−6.388388388388421, +19.934934934934915] — NOT
resolved**, as are E13's (−14.015015 [−27.636637, +0.400400]) and E14's. **The law adds no
resolvable residual write on any composition; on one of the three the raw count is higher.**

**THE POCKET — H-GK-2 (ABSENT-E13, the shipped path).**
`pocket.share` = **0.9924609601355066** (333,978 of 336,515 save-window residual-written keeper
ticks coincide with the engine's own restart placement state) — **> 0.5, so
`pocketIsRestartPlacement` is TRUE and H-GK-2 HOLDS.** The class ranking behind it has exactly
two non-empty entries: `restartPlacement` **333,978** and `saveWindow` **2,537**; every other
GK-C0 class is zero. `pocket.crowdedShareOfPocket` 0.017901133679033624.

### The parry contact

`parryContact.spriteClearShare` is **1** on E13-ARMED (4,428 of 4,428 parry contacts cleared with
`saveAnimTimer === 0`) and 0.999742334449884 on D13-ARMED. The alternative branch is counted, not
assumed away — it fires once on D13. The face is NaN on every ABSENT arm (0 / 0), by
construction.

---

## §R4 — THE CODE FACTS

Over all **155** `src/**` files, **71** graph files and **579** extracted function spans:

* **`saveContact`: 22 occurrences**, of which **8 are ASSIGNMENTS** — every one enumerated with
  its file, line, text and enclosing span. **`gkDiveBody`: 11 occurrences**, likewise.
* **THE SEAM'S FIVE SITES**, each hashed WHOLE with its EXTRACTED callee list:
  `src/sim/mechanics.ts:2138-2259:tryKeeperSave` (the two writes) ·
  `src/ai/actionExecutor.ts:123-1459:executeAction` (the post-switch override) ·
  `src/sim/Match.ts:3233-3534:step` (the ownership sweep) ·
  `src/sim/Match.ts:3829-3994:giveBall` (release (c)) ·
  `src/sim/Match.ts:4344-4581:stepBall` (the waiting branch). The seam closure is stored beside;
  nothing is capped.
* **`absentArmIsShippedPath` = TRUE.** Two assignments are flag-guarded, five carry a
  `saveContact !== null` guard, one sits inside `if (gkHands !== null)` whose own definition line
  carries `this.gkDiveBody`, none is ungated, and the field's initialiser is `null`.
* **`ownLaneDoorTouchesNoKeeperPath` = FALSE** at this head, over the SIX-root closure — and the
  hit is named: **`src/ai/PlayerBrain.ts:165-1813:decideCarrier`**. The five-root value
  (GK-C0's own) is **TRUE**, stored beside. ⇒ Ruling #398 item 1(ii)'s correction reproduces
  exactly at this head, and **E14 was rightly walked beside**.

---

## §R5 — THE READS, PRINTED

**THE COST, FIRST** (`reads.g8PrintedFirst`): G8's paired Δ on E13 is **+2.738122 ticks**,
interval [−6.924280, +12.052622], on a control of **353.194605 ticks** — **not resolved**.

> **[E13, THE READ OF RECORD]**
> **THE BODY GOES TO THE BALL AND THE CAUGHT BALL STOPS JUMPING — GK-ENTRY is named: world 15 =
> world 14 + the dive door.**
>
> *breaching guards (E13): none*
>
> **THE POCKET IS RESTART PLACEMENT (H-GK-2 holds).**
>
> *dominant save-window residual class (E13-ABSENT): restartPlacement (333978 ticks)*

**D13 agrees** (`reads.d13Agrees` true) and **E14 agrees** (`reads.e14Agrees` true); both
counterfactual words, computed by the same frozen rule on their own stored intervals, are the
same literal.

Selectors, stored: `r1Down` true on all three; `breach` false on all three; `offsideFlag` false
on all three.

---

## §R6 — 在说人话的层面

**用户那句话说的是真的,而这次考试回答的是「把身体接上去以后,球还跳不跳」。**

不跳了。在用户自己那个世界(E13)上,门将扑到球以后**球一格里跳过一米的比例从 0.835740 掉到
0.104907**;GK-C0 量的那个「一格跳进脚下」的动作,平均位移从 **1.699204 米变成 0.003860 米** ——
球就停在手上,等身体走过去。这个差是 **十八个半宽**,不是噪音。三种组合(空书 v13、加料 v13、
v14)读出同一句话。

**代价没测出来。** 门将把球送出去的时间只多了 **2.738122 帧**(基准 353.194605 帧),而这个区间
跨过零 —— 在 999 场的分辨率下,这不叫「慢了」,只叫「没量出来」。十一道守门里没有一道破。唯一
分辨出来的一格是 **xG 转化率往下走了一点点**(远在容差里):门将站的位置变了,下一段进攻就从别的
地方开始 —— 这是下游,不是掷骰子变了。

**还有两件事要说给指挥官听。** 第一,**等待普遍比动画长**:五次里有四次(0.819444)等超过
42 帧,这是设计里就写好的、现在量到了。第二,**放行的判据是「持球点」不是身体**:五次里有四次
放行时身体离接触点还比 `carry` 远(身体进 `carry` 的只有 0.211806)—— 那个岔路口(用身体做判据)
是真的存在的,而且会把四成以上的等待再拉长。

**门将的身体在场上仍然几乎不被写。** 扑救窗口里那 336,515 个「被写」的帧,**0.992461 落在引擎
自己的重开球摆位状态上** —— H-GK-2 成立,那个口袋是重开球,不是场上的瞬移。

---

## §HONEST LIMITS

*(canon: this list is the ONE home; the artifact stores none of it and points here.)*

1. **⚠⚠ R1's ARMED ARM IS INFLATED BY RESTART BALL PLACEMENTS, AND THE INFLATION IS ON THE
   CONSERVATIVE SIDE.** An ARMED episode runs to the tick after the ball leaves the contact. When
   the release class is `restartPlacement`, the tick that ends the episode is a tick on which the
   ENGINE places the ball for a restart — a move of tens of metres that has nothing to do with
   this law. That is where E13-ARMED's six catches in the ≥ 3.0 m bin come from. It can only
   RAISE ARMED's R1, so the DOWN reading is conservative; but **ARMED's 0.104907 is an UPPER
   BOUND on "the ball still jumps under the law", not a measurement of it.**
2. **⚠⚠ THE RESIDUAL PREDICATE DOES NOT SEPARATE A TELEPORT FROM AN OVERLAP PUSH.**
   `resolveOverlaps` writes POSITION as well as velocity at this head (§DEV-PREFLIGHT item 2),
   so every overlap push is a residual. Ruling #401 item 3(i) expected otherwise. The `crowded`
   proximity marker is published beside every residual face and is a MARKER, not call-site
   attribution. The residual share is two orders of magnitude above GK-C0's cap share for
   exactly this reason.
3. **⚠⚠ THE RELEASE COMPOSITION IS AN INFERENCE.** The engine keeps no ledger of which clear
   fired. The classifier reads state transitions in a frozen precedence and is fixture-pinned at
   every branch — but `arrival` vs `freshGain` is separated by re-running the waiting branch's
   own test on the release tick, not by observing the call.
4. **⚠ G8 IS UNRESOLVED, NOT ZERO.** At N = 999 the time-to-distribution Δ spans zero on all
   three compositions and its LOO influence share is large (0.4670426718152576 on E13). The
   exam cannot say the law is free; it can say the delay is smaller than this battery resolves.
   The projected N for a 0.05-tick target on this face is 95,891,247 seeds — the face is not
   sizeable at this precision, and that is stated, not worked around.
5. **⚠ G4 MOVED AND WAS TOLERATED.** xG conversion falls with a resolved interval on E13 and
   E14, inside tolerance both times. A tolerance is a decision rule, not a proof of no effect.
6. **⚠ THE `gkFeet` POPULATION IS THIRTEEN EPISODES.** Zero losses within ten ticks is a real
   observation on a tiny denominator, not a safety claim. The seam's own limit — a catch outside
   the area has no hold bubble — is untouched by this result.
7. **⚠ SIX WALKS PER SEED IS A PAIRING, NOT A CONTROL FOR EVERYTHING.** The arms share seeds and
   populations; they diverge in trajectory from the first catch onward. Every guard Δ is a
   whole-match difference and therefore DOWNSTREAM of the law, never a changed roll.
8. **⚠ THE WAIT LENGTHS INCLUDE DEAD TIME.** A contact set just before a whistle survives the
   dead ball until `resetForKickoff` clears it (that is exactly the `gBite` seed, §DEVIATIONS 3).
   Those ticks are counted in the wait because the contact was set; nothing was waiting on a ball
   in play.
9. **⚠ THE SEAM'S OWN LIMITS BEAR ON THIS READING AND ARE NOT RE-LITIGATED HERE** (#401 item 2):
   the dive is capped at `topSpeed`, so the body routinely arrives after the sprite ends — the
   0.819444 share of waits over 42 ticks IS that limit, measured; the arrival predicate is the
   CARRY POINT, so an abeam contact can wait until the keeper's own distribution — the
   0.211806 body-inside-`carry` share IS that limit, measured; a `gkFeet` catch is unprotected;
   the high-ball claim sets no contact and still snaps.
10. **⚠ E14 IS A SECOND WORLD, NOT A SECOND SAMPLE.** It is walked because the own-lane door
    demonstrably reaches the keeper's carrier path (`decideCarrier`, §R4). Its agreement with
    E13 is evidence that the dive law survives that composition, not that the two are
    interchangeable.
11. **⚠ THE EXAM ARMS NOTHING.** The flag lives only in this instrument's constructors; the
    shipped worlds 12/13/14 are byte-identical, and the production fingerprint is unchanged
    (recomputed in-process, not quoted).

---

## §DEVIATIONS

1. **⭐⭐⭐ `gBite` IS RED, AND IT IS REPORTED RED RATHER THAN RE-SCOPED.** §P.8 froze G-BITE as:
   on EVERY battery seed with at least one CATCH, the ABSENT and ARMED whole-match signatures
   DIFFER. It holds 547/547 on E13 and 561/561 on E14, and **606 of 607 on D13**. The one
   exception is **seed 12,552,083**. §P was not edited after sight; the gate stands RED and the
   artifact is routed to `.RED.json` by the instrument's own red-routing idiom.
   **THE MECHANISM, DIAGNOSED.** That match's only catch lands on the last tick before HALF TIME.
   The stored cell says the rest: `D13-ARMED` has `waitTicksSum` **71**, a release class of
   `restartPlacement`, and an episode maximum of **28.99174998985759 m**, against `D13-ABSENT`'s
   **0.2008148540806846 m**. While `match.phase === 'halftime'` the engine runs `stepRestart`,
   **not** `stepBall` — so the waiting branch never executes. The contact sits through 71 ticks
   of dead time and is cleared by `resetForKickoff`; the 28.99 m is the half-time restart placing
   the ball, counted inside the ARMED episode (§HONEST LIMITS 1). **On that seed the flag
   genuinely did not bite**, and a hand diagnostic — build both D13 arms at that seed, step them
   in lockstep, compare every body's position every tick — finds no divergence anywhere and a
   maximum keeper separation of zero. ⛔ THE DIAGNOSTIC IS DECLARED, NOT GATED: it was a
   throwaway walk on this stage's own consumed band and its script is not committed; every
   QUANTITATIVE claim above is a stored `perSeedCells` field.
   **WHAT SURVIVES THE RED.** Derived by hand from the SERIALIZED artifact at reporting time and
   offered as a receipt, not a gate: on **every** seed with a catch, on **all three**
   compositions, the two arms' stored ROWS differ — 547/547, 607/607, 561/561, zero identical
   rows. The whole-match end-state signature is a LAGGING witness of a law that only moves
   bodies; the per-seed row is the tighter one. A future exam that wants this gate should compare
   per-tick signatures or the stored rows, and should EXEMPT a catch that lands in dead time.
2. **THE OUTFIELD POPULATION IS NOT WALKED.** GK-C0 counted every outfielder's over-cap tick;
   this exam is about the keeper and the ball, and dropping the O(n²) outfield accounting is what
   made six arms × 999 seeds affordable (705.993 s of battery). Consequence, stated: GK-C0's
   outfield fields are NOT in G-REPRO-GKC0's compared set. The compared set is the INTERSECTION
   of the two row shapes minus `wallMs` — **60 fields × 12 seeds, all matching**.
3. **THE CATCH TICK IS INSIDE THE EPISODE ON BOTH ARMS**, with the flight bound argued at §P.3(a)
   rather than assumed away; and ARMED's episode is a SUPERSET of ABSENT's in ticks, which is
   conservative for the DOWN read (§P.3(b)).
4. **`freshGain` HAS A POPULATION OF ZERO** in 5,994 matches. The class is COUNTED, printed and
   reported as zero — it is not evidence that release (c) is unnecessary, it is evidence that its
   in-play population at this head is zero, exactly as GK-T0c said.
5. **`armedAddsNoResidualWrites` IS FALSE ON D13** and is reported false, with its unresolved Δ
   beside (§R3). The frozen field is a COUNT comparison; it was not softened after sight.
6. **N IS THE BLOCK'S AFFORDANCE, NOT THE SIZING'S ANSWER.** The disclosed smoke asked for 3,265
   seeds for a 0.05 half-width on R1 and 95,891,247 for G8; the block affords 999.
   `resolvableAtNFrozen` is false on both rows and the realised half-widths are published
   (§R1). #401 item 3(vii) predicted this in advance.
7. **THE GUARD SET IS ELEVEN LIMBS AND G11 IS NOT ONE OF THE TEN GATING ROWS** — it is the #157
   FLAG form, stored separately in `offsides`, entering neither `breach` nor any read.
8. **G10 ON E14 POINTS AT LN-T1′b RATHER THAN COPYING ITS NUMBERS.** The ruling asks for the
   LN-T1′b KEEPER-pass family beside on E14; this exam measures its OWN keeper-passes-per-match
   face on E14 (control 8.458458, Δ −0.126126, unresolved) and names
   [`LN-T1PB-OWN-LANE-EXAM-RERUN.md`](LN-T1PB-OWN-LANE-EXAM-RERUN.md) as the home of the DOOR's
   own effect on that family. No number is transcribed across docs (canon: doc-prose fidelity).
9. **THE `resolveOverlaps` FIXTURE MOVES TWO BODIES ON A SCRATCH MATCH.** The probe writes
   `b.pos` on a throwaway out-of-band match to build the overlap scene. It touches no battery
   match, no `src` file and no shipped path; `gLockstep` and `X-DET` are unaffected and green.
10. **THE `backPass` LIMB OF THE `gkFeet` RECONSTRUCTION IS READ PRE-STEP.** `giveBall` runs
    inside the step; the closest readable value is the pre-step `pendingPass`. The agreement with
    the engine's own consequence is 1.000000 on every arm, which is the receipt that the
    approximation did not bite — not a proof that it cannot.

---

## §GATES

**23 of 24 GREEN · 1 RED.** The instrument's own red-routing idiom moved the artifact to
`docs/world-model/data/gk-t1-dive-exam.json.RED.json`.

| gate | verdict | derived note |
|---|---|---|
| `gWorld` | ✅ | every walked match of all six arms + the construction receipt: `bqArmedVersion` 13 with the cushion; `lnOwnLanePrice`/`lnArmedVersion` as due per composition; `gkDiveBody` exactly as the arm is due; `edsPerceivedChoice`; every OBM/CTB/RC/BF seam absent; `info.genome` clean. Re-pinned on constructed matches at 900,005,470 |
| `gDoseSource` | ✅ | both dose files' BYTES hashed against their pins before any seed |
| `gAnchoredConstants` | ✅ | **91** anchored sites with line receipts, the whole seam re-anchored at this head; `carry` 0.3 / 0.85 EXTRACTED from the ternary's own lines; the sprite's 42 ticks DERIVED; `NI_FRACTION` inherited by anchor as an expression from two probes |
| `gResidualFixtures` | ✅ | integrated step residual exactly 0; `resetForKickoff` and `becomeSub` fire; the 1 mm boundary pinned both sides; **the `resolveOverlaps` case tested and DECLARED** |
| `gPredicateFixtures` | ✅ | **57** fixtures, every predicate with a firing and a non-firing case |
| `gLedgerRead` | ✅ | `shotLog` flips joined to the engine's own event text at `save.joinAgreementShare` **1** on every arm |
| `gClassesNonVacuous` | ✅ | catches and parries non-empty on all six arms; waits and releases non-empty on all three ARMED arms; scoped, because they are structurally zero on ABSENT |
| `gCodeFactGraph` | ✅ | 22 `saveContact` / 11 `gkDiveBody` occurrences enumerated; 8 assignments (the gated count); the five seam spans hashed with EXTRACTED callees; nothing capped |
| `gLockstep` | ✅ | observed ≡ unobserved on 12 arm × scratch-seed walks |
| `gDeterminism` | ✅ | X-DET twice per arm on two scratch seeds: signatures and row bytes identical, 12 pairs |
| `gFlagHygiene` | ✅ | the flag KEY ABSENT ≡ EXPLICITLY FALSE on 6 composition × scratch-seed pairs |
| **`gBite`** | **⛔ RED** | **E13 547/547 · D13 606/607 · E14 561/561. The exception is seed 12,552,083 — §DEVIATIONS 1** |
| `gRepro` | ✅ | **G-REPRO-GKC0: 60 fields × 12 seeds, every one matching.** E13-ABSENT re-walked on 12,551,000–011 reproduces GK-C0's stored E13 rows FIELD FOR FIELD — the OFF path has not moved since the census |
| `gFingerprintProd` | ✅ | `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` RECOMPUTED in-process |
| `gSrcUntouched` | ✅ | `git diff --stat HEAD` and `git status --porcelain` both EMPTY over `src` AND `tests` |
| `gSeedsBookedEqualWalked` | ✅ | 999 distinct seeds + the receipt at 12,552,999, six arms ⇒ **6,000 walks booked**; unwalked tail **null**; every scratch seed ≥ 900,000,000 and stored |
| `gSeedDisjoint` | ✅ | the whole battery inside 12,552,000–999, disjoint from every consumed block; the re-walks inside GK-C0's own band |
| `gN` | ✅ | N = 999, no override env, the sizing's own branch stored |
| `gLoo` | ✅ | six scoped rows (R1 and G8 × three compositions), 999 seeds dropped each |
| `gTwoFractions` | ✅ | **450** face rows over 75 keys × 6 arms, each value exactly its numerator ÷ denominator |
| `gFaces` | ✅ | **675 / 675** face-and-Δ checks and **211 / 211** bin / median / partition / guard / pocket / residual-add / read-word / sizing checks re-derived off the SERIALIZED artifact |
| `gReadWords` | ✅ | every selector, sentence, counterfactual word, agree boolean and the pocket sentence re-derived from the serialized cells; every printed sentence is a frozen literal |
| `gHashOrder` | ✅ | a 37-key allowlist schema; the body hash computed LAST; the NON-body receipt reproduces from the written file |
| `gStage` | ✅ | `stage.instrument` is this file's path and `stage.instrumentSha256` is the sha256 of the RUNNING file |

**RUN RECEIPTS.** FREEZE commit **`5bffe4e`**; the instrument is byte-identical between FREEZE
and RESULTS (`git diff 5bffe4e -- scripts/probes/gk-t1-dive-exam.ts` empty), and its sha256 —
the one the artifact records at `stage.instrumentSha256` — is
**`c0534fb0df16e0ae8033d790f51307fce35ea5356c76deaa9bd62ba6bee59159`**.
`hashedBodySha256` **`9d14f777421ae4d73f0adb748aa2db324a904f10b576c0334a3ce427933f0730`** ·
`receipts.hashReproducesFromFile` **true** · final file sha256
**`e69b098dc21cf83053def2e32ca5443077885b955f4a03a950ae941b8b529a13`**, **23,725,064 bytes**.
Battery wall **705.993 s**, `perf.meanWallSecondsPerMatch` **0.113314981648315**.
`stats: { consumed: 0, nextBase: 117600, registryOfRecord: 81 }` — **ZERO stats consumed**.
Typecheck clean at both commits.
