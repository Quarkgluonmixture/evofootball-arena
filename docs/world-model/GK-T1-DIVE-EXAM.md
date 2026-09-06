# GK-T1 — 「身体跟着手走 · 考试」 THE DIVE EXAM

> **STATUS: FROZEN — §P and the instrument are frozen; the battery has NOT run.**
> This is the FREEZE commit. §P (the protocol) and
> [`scripts/probes/gk-t1-dive-exam.ts`](../../scripts/probes/gk-t1-dive-exam.ts) are frozen
> BEFORE any battery seed is walked and are never edited after sight of a result.
> §DEV-PREFLIGHT below DISCLOSES the 12-seed scratch smoke that sized N — in full, including
> the one place where the ruling's expectation did not survive contact with the engine.
> Authorized by **COMMANDER RULING #401 item 3**. Artifact:
> [`data/gk-t1-dive-exam.json`](data/gk-t1-dive-exam.json).
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
