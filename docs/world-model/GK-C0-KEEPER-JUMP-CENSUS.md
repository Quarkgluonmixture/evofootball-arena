# GK-C0 — 「门将瞬移」 THE KEEPER-JUMP CENSUS（门将到底有没有瞬移,还是球在瞬移）

> **STATUS: FROZEN — §0–§P and §DEV-PREFLIGHT are sealed; the battery has NOT been run.**
> Authorized by **COMMANDER RULING #397 item 5**, on the user's own new sentence (#396).
> Census form of record: [`LN-C0-LANE-CENSUS.md`](LN-C0-LANE-CENSUS.md) (its run envelope, its
> two arms, its cluster bootstrap, its hash order and its gate set are reused); the receipt
> classes struck at [`LN-C3`](LN-C3-UNTRACED-FAMILY-CENSUS.md) §COMMANDER CORRECTIONS and
> [`LN-T1′b`](LN-T1PB-OWN-LANE-EXAM-RERUN.md) §COMMANDER CORRECTIONS are obeyed by construction
> (the `stage` block is THIS instrument's path and the RUNNING file's hash — `gStage`; the call
> graph is EXTRACTED, never declared — `gCodeFactGraph`; no universal is written that is not a
> stored boolean; every predicate is stated with a case where it FIRES and one where it does
> NOT — `gWrittenFixtures`).
> Instrument: `scripts/probes/gk-c0-keeper-jump-census.ts`.
> Artifact: `docs/world-model/data/gk-c0-keeper-jump-census.json`
> (**or its `.RED.json` SIDE PATH** if any gate is red — the red-routing idiom, #334 item 5).
>
> ⛔ **THIS IS A CENSUS.** It publishes MEASUREMENTS. **IT SHIPS NOTHING**, scores no hypothesis
> and **arms no mechanism** — it NAMES which of three stories is true. The commander rules.
> ⛔ **X-SRC-ZERO**: no file under `src/` or `tests/` is created or edited. The probe reads
> public `Match` / `Team` / `Player` / `Ball` state before and after `match.step(DT)`. **THERE
> IS NO WRAPPER** — `gLockstep` proves observed ≡ unobserved byte for byte, **PER ARM**.
> ⛔ **WORLD 13 IS THE BASE, UNTOUCHED**; **WORLD 14 IS NOT WALKED** (§P.A gives the anchored
> evidence over the EXTRACTED call graph, not an assurance).

## §0 THE WORDS OF RECORD, AND WHAT THIS CENSUS IS FOR

**THE USER'S SENTENCE, VERBATIM** (#396, registered with the world-13 verdict):

> 「并且门将现在仍然有的时候最后一刻突然瞬移到球的那个地方」

**#397 item 5, the scope this census instruments, quoted:**

> *"⭐⭐ **GK-C0 DISPATCHED — 「门将瞬移」 THE KEEPER-JUMP CENSUS** (a C0 census; X-SRC-ZERO; the
> user's sentence … the priority hypothesis; the LN-C0 form; definitions frozen at the
> executor's §P). THE COMMANDER'S CODE READ, TO BE MEASURED NOT ASSUMED: the save resolves in
> `tryKeeperSave` when the ball is within `keeperReach` (2.05 + keeperAggression·0.4 +
> (reflexes − 0.5)·0.5 [+ 0.12 for the cat]) × `SAVE_STRETCH` 1.35 of the keeper's body — up to
> ≈ 3.8 m; a CATCH calls `giveBall(gk)` (velocity zeroed, position untouched) and on the NEXT
> tick the carry law places the owned ball at `owner.pos + carryLen` — the BALL jumps to the
> keeper; the keeper's own `pos` is written on no save path; the renderer stretches the keeper's
> sprite 1 + 0.7k toward the ball for 0.7 s (`saveAnimTimer`); other direct `pos` writes exist
> (`GK_HOLD_CLEARANCE` pushes an OPPONENT up to 3 m off a holding keeper; restart placements;
> `resetForKickoff`). Three stories, one census."*

**THE THREE STORIES, AND WHAT WOULD SETTLE EACH.**

| story | what it claims | what settles it |
|---|---|---|
| **(a) THE BODY** | the keeper's own position is WRITTEN — a per-tick displacement larger than his integration cap | POPULATION A: every keeper tick's \|Δpos\| against `topSpeed · DT`, classed by his state |
| **(b) THE BALL** | nothing writes the keeper; the CATCH resolves up to the fingertip reach away and the carry law snaps the owned ball to his hands on the next tick | POPULATION B: every save's ball↔keeper distance, and the ball's displacement on the tick AFTER a catch |
| **(c) THE SPRITE** | neither jumps in the sim; the renderer's 0.7 s dive stretch, rotated at the ball, is what the eye reads | neither (a) nor (b) firing — with the render constants anchored and documented, never measured here |

**THE PRE-REGISTERED READ SENTENCES, VERBATIM from #397 item 5(vi)** — frozen literals in the
instrument, selected by STORED booleans on the **E13** arm:

| selector | the sentence PRINTED |
|---|---|
| `keeperWrittenOutsideRestarts` | *"THE KEEPER'S BODY IS WRITTEN — the write site is named (\<class\>)."* |
| ¬`keeperWrittenOutsideRestarts` ∧ `ballJumpsAtCatch` | *"THE KEEPER NEVER JUMPS — THE BALL DOES: the catch snaps it to his feet from up to the fingertip reach; the eye reads the ball's jump and the dive sprite as his — a ball-side law is named (GK-T0: the caught ball travels to the hands over the ticks the hands need)."* |
| neither | *"NEITHER JUMPS IN THE ENGINE — the teleport is the renderer's; a render census is named next."* |

⭐ **READ 2's `<class>` placeholder is NEVER spliced.** The dominant non-restart written class is
a STORED ranking and is printed on its **own annotation line** beside the frozen literal. The
**opponent-displacement share** (Population C's hold-clearance share of written outfield ticks)
is printed **beside every sentence**. D13's sentence is computed by the SAME frozen rule and
stored as the **counterfactual word**, with a stored `dosedAgrees` boolean.

### in plain football language

You said the keeper sometimes appears at the ball's spot at the last instant. There are only
three things that can be true, and this census asks all three at once.

1. **Does his BODY ever move further in one tick than his legs can carry him?** Every keeper,
   every tick of every match, we measure how far he actually moved and compare it with the most
   his own top speed allows in one tick. Anything bigger was WRITTEN by some line of code, not
   run. And we say WHAT HE WAS DOING at that tick — diving, holding the ball, being put back on
   the halfway line for a kick-off, being replaced by a substitute, or just standing in his
   position.
2. **Or does the BALL jump to him?** The engine lets a keeper claim a ball up to about a body
   and a half away from him (his reach, times a 1.35 "fingertip" stretch). The moment he catches
   it, the ball becomes his — and on the very next tick the engine puts the owned ball at his
   hands. If the catch happened two metres away, the ball crosses those two metres in one tick.
   That is a jump — of the BALL. We measure how far every save was taken from his body, and how
   far the ball moves on the tick after.
3. **Or is it neither, and the picture is lying?** When a save fires, the renderer stretches the
   keeper's sprite up to 1.7× and rotates it to point at the ball, for 0.7 s. A stretched body
   pointing at the ball, plus a ball that just teleported into his hands, is a very good
   impression of a man who teleported. We write the render numbers down from the source and
   measure nothing there — that would be a different census.

⛔ Nothing here is armed, ships, or is blamed. The census prints ONE sentence from a list frozen
before any seed was walked, and stops.

## §P THE FREEZE (all of it BEFORE any battery seed)

### §P.A THE ARMS — two, PAIRED on shared seeds; and why world 14 is NOT walked

* **E13** — `a4MatchFlags(13)` as construction flags + `armA4World(m, null, 13)`: world 13
  EMPTY-BOOK, **the user's KEPT world (#396), THE READ OF RECORD**.
* **D13** — the same + the two doses through the **SHIPPED LOADERS** (`loadL3Dose` /
  `loadPcDose`), the form the user plays; **published BESIDE**. The two arms differ **ONLY** in
  the two doses. Both dose files' **BYTES** are hashed and compared to the values pinned since
  #388 (`gDoseSource`; a mismatch is `exit 3` before any seed is walked).
* `gWorld` asserts, **per arm, on every walked match and the construction receipt**:
  `bqArmedVersion(m) === 13` · `bqCushion` TRUE · `lnOwnLanePrice` ABSENT and
  `lnArmedVersion(m) !== 14` · `edsPerceivedChoice` TRUE · every OBM / CTB / RC / BF seam ABSENT
  · `info.genome` clean of the own-lane / RC / CTB / OBM genes (canon: dose placement). Pinned
  again on a CONSTRUCTED match of each arm at out-of-band scratch seed **900,004,670**.
* ⛔ **WORLD 14 IS NOT WALKED, AND THE EVIDENCE IS A CODE FACT, NOT AN ASSURANCE.** World 14's
  ONE door is `lnOwnLanePrice` (`LN_WORLD_DOORS`, anchored). The instrument EXTRACTS the call
  graph of the keeper paths — rooted at `tryKeeperSave` · `giveBall` · `decideGoalkeeper` · the
  carry law's `stepBall` · the executor's `executeAction` — by resolving **every identifier
  called within each hashed span** to its definition, transitively, and stores the closure
  beside the boolean `codeFacts.keeperPaths.ownLaneDoorAbsentFromKeeperPaths`. The needle is
  proven LIVE on the same corpus (`ownLaneNeedleIsLive` — the door IS read somewhere), so the
  boolean is not a vacuous pass.

### §P.B POPULATION A — EVERY KEEPER TICK

**THE POPULATION**: both keepers, **every stepped tick** of every walked match, both arms.

**THE WRITTEN PREDICATE** (`gWrittenFixtures`): a tick is **WRITTEN** iff

> **\|Δpos\| > topSpeed · DT · (1 + EPS)**, with **EPS = 1e-6** a stated floating-point margin.

\|Δpos\| is the body's realised per-tick displacement, read off the engine's own position series
(before / after `match.step(DT)`). `topSpeed` is the body's OWN getter — `baseSpeed · (0.62 +
0.38 · stamina)`, anchored — **read BEFORE the step**, and `physicsStep` clamps the desired
velocity to exactly that before integrating `pos += vel · dt` (both lines anchored). ⚠ **The
pre-step cap is an UPPER BOUND** on the cap the integrator used (stamina only falls inside a
step), so the predicate can only **UNDER-count** written ticks — declared, never glossed.

**THE FIXTURES, on REAL hand-built bodies** (the shipped `Player`, the shipped `physicsStep`,
the shipped `resetForKickoff` / `becomeSub`): a **full-speed INTEGRATED step is NOT written**
(and DID move the body — the negative is not vacuous); the same body's **`resetForKickoff`
displacement IS**; so is the **`becomeSub` placement**; **exactly at the cap is NOT written**,
**a hair over IS**, **zero is NOT**.

**THE CLASSES, in a FROZEN PRECEDENCE** — `substitution` > `restartPlacement` > `saveWindow` >
`hold` > `actGoalkeeperSave` > `actGoalkeeperRush` > `actGoalkeeperPosition` > `actChaseBall` >
`actMakeRun` > `actPass` > `unclassified`:

| class | read from |
|---|---|
| `substitution` | the body's `rosterIdx` CHANGED across the tick (the substitute constructor placed him) |
| `restartPlacement` | **THE ENGINE'S OWN PHASE, never a timing heuristic**: `match.phase !== 'playing'` at the end of the tick, **or** the phase CHANGED across it — and the kick-off placement (`resetForKickoff` for every body, the own-half clamp, the kicker onto the centre spot) happens inside `setupKickoff`, which sets `phase = 'kickoff'`: exactly such a change |
| `saveWindow` | `saveAnimTimer > 0` — inside the 0.7 s dive window |
| `hold` | `gkHoldTimer > 0 \|\| gkDistributing` — the ball in his hands |
| `act…` | his own `action.type`, the six the ruling names |
| `unclassified` | **ANY OTHER action — COUNTED, never pooled, and able to FIRE** (fixture: a keeper on `ThrowOut` lands here; a keeper on `ChaseBall` does not) |

**WHY THIS ORDER**: an identity change is not the same body at all; then the engine's own
restart state; then the two keeper states the ruling names; then the action he chose.

⭐ **THE LADDER IS A PARTITION, BUT THE AXES ARE ALSO STORED SEPARATELY** — `saveAnimTimer`,
the hands, the restart state, the substitution, the full 24-cell action histogram, and three
declared **PROXIMITY MARKERS** on written ticks: `crowded` (another body inside
`PLAYER_MIN_DIST` at the tick's start — the overlap resolver's own shape), `nearHoldingKeeper`
(inside `GK_HOLD_CLEARANCE` of a HOLDING opposing keeper) and `kickProtected`
(`match.restartKickGid !== null` — the one opponent-displacement law that fires in OPEN PLAY).
⚠ **A marker says the body was in the SHAPE that law displaces. It does not claim the law
fired.** Said here, once.

**FACES per arm**: keeper ticks per match · the written share overall, per class, and as a
composition OF the written ticks · **the read-bearing `keeper.writtenOutsideRestartsShare`** ·
the max single-tick displacement per class (a stored MAX, pooled by `max`, never bootstrapped) ·
the \|Δpos\| distribution **inside the save window vs outside** (the same frozen bins) · the
\|Δpos\| ÷ cap ratio distribution · the three marker shares.

### §P.C POPULATION B — EVERY SAVE

**THE JOIN — TWO ENGINE LEDGERS, canon first** (VERBATIM: *"an event attribution reads the
engine's own record when one exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic
is written only where no record exists, and says so"*):

1. **`match.shotLog[i].outcome` flipping `pending` → `saved`** on the tick (the writer,
   `markShotOutcome`, is anchored: *first outcome wins, pending rows only*).
2. **the `save` EVENT's own text**, pushed the same tick. ⭐ **ALL FOUR `pushEvent('save', …)`
   sites in `src/` are anchored** — this is a CENSUS of the save families, not a needle list:
   `catches it` and `parries!` (the two `tryKeeperSave` outcomes), **`claims the high ball`**
   (`tryAerial` — a second family, which ALSO writes the ledger) and **`smothers at …`**
   (`trySmother` — a third family, which has no `pendingShot` and therefore **no flip at all**).
   `otherSaveEvent` is the counted else-branch and CAN fire. Fixture: the same string with
   `parries!` replaced by `catches it` reads `catch` — the class FOLLOWS the edited text.

Flips without an event, and events without a flip, are **COUNTED** (`save.eventWithoutFlipShare`)
and **never imputed** into either.

**AT THE SAVE TICK** (⚠ **a DECLARED RECONSTRUCTION**: `tryKeeperSave` runs inside `stepBall`,
after every body has integrated and been clamped, so the post-step keeper position is the one
the engine used unless a later writer moved him; the BALL is read after the whole step):

* `dist(gk.pos, ball.pos)` — the engine's own `dNow`, reconstructed;
* the **RECONSTRUCTED `keeperReach`** and `reach × SAVE_STRETCH`. ⭐ `keeperReach` carries **no
  `export`**: its four constants are **EXTRACTED from the two anchored source lines** (base,
  the aggression weight, the reflex midpoint and weight, the cat's hand) and the reconstruction
  is **fixture-pinned term by term** against them. `SAVE_STRETCH` = 1.35 is anchored;
* the ball's distance to the goal line (「最后一刻」) and the ball's speed;
* the shares **within reach**, **within the stretch**, and ⚠ **beyond the stretch** — the last
  is the honest size of the post-step reading gap, published, not hidden;
* ⛔ the `saveP` inputs are **NOT reconstructed** (#397 item 5(iii)).

**THE BALL-JUMP** (`gWrittenFixtures`): for each **CATCH**, the ball's displacement on the tick
**AFTER** the catch — the carry snap — against **the catching keeper's own `topSpeed · DT`**
(his topSpeed at that next tick's start). *Why his cap: the question is whether the ball
travelled further than the hands could have carried it.* Fixture: **a catch 3 m from the body
fires it; a catch at the feet does not.** The same quantity is published **BESIDE** for
**PARRIES** (a kick-like release — never read), and for claims and smothers.

**FACES per arm**: save events per match · ledger flips per match · the join share · the four
family shares · the catch share among catch + parry · the mean save distance, reach and
reach × 1.35 · the frozen 0.5 m distance bins (all saves, and catches alone) · **the catch
shares at > 1 m / > 2 m / > 3 m** · the goal-line and ball-speed distributions ·
**`ballJump.catchShare`** (the read-bearing one) and the mean ball move after a catch, with the
parry beside.

### §P.D POPULATION C — ALL BODIES

The SAME written predicate on the ten outfielders, so *"a body jumped"* is attributed to the
body that jumped. Classes, frozen precedence `substitution` > `restartPlacement` >
`holdClearance` > `kickProtection` > `overlapPush` > `unclassified`, where `holdClearance` = the
body was inside `GK_HOLD_CLEARANCE` = 3 m of an OPPOSING keeper who was HOLDING at that tick
(the shape the anchored `o.pos = add(gk.pos, scale(dir, GK_HOLD_CLEARANCE))` law displaces),
`kickProtection` = the kick-protection clearance was live, `overlapPush` = another body inside
`PLAYER_MIN_DIST` at the tick's start. ⚠ The last three are **PROXIMITY MARKERS**, as above.
**THE OPPONENT-DISPLACEMENT SHARE** — `holdClearance` over all written outfield ticks — is the
number printed **beside every read sentence**.

### §P.E THE CODE FACTS — over the EXTRACTED call graph

canon, VERBATIM: *"a code-fact boolean about what a function reads or does not read is derived
from the function's WHOLE text and from every callee whose return enters the read, each pinned
by an anchored text hash — the call graph it was checked over is stored beside the boolean; a
hash pins a body, it cannot see through a call; a needle list is a confirmation, not a census;
the callee list is EXTRACTED from the hashed text — every identifier called within the span,
resolved to its definition and hashed — never typed"*.

* **EVERY direct `pos` write site under `src/sim` and `src/ai`** is enumerated, resolved to an
  **enclosing function span** (extracted by function-head recognition, not by eye), hashed WHOLE
  with its own text, and classified by a **FROZEN ORDERED RULE LIST** into `integration` ·
  `restartPlacement` · `substitution` · `holdClearance` · `kickProtection` · `overlapResolve` ·
  `pitchClamp` · `boxEdgeClamp` · `ballPlacement` · `snapshotCopy` · `sentOffApron` · `other`
  (the counted else-branch). `gCodeFactGraph` requires **every** site to resolve.
* ⭐ **THE NEEDLE SET IS A SUPERSET of #397 item 5(v)'s three forms**: the compound assignments
  (`+=` / `-=`) are included, because `resolveOverlaps` writes a body's position with `+=` and a
  census that missed it would be a needle list, not a census. **Named in §DEVIATIONS.**
* **TWO STORED BOOLEANS about the save path, both narrow, both published:**
  (a) `savePathWritesNoKeeperPos` — NEITHER `tryKeeperSave`'s OWN text NOR `giveBall`'s OWN text
  contains a player `pos` write (ball writes are excluded by subject and listed separately);
  (b) `savePathClosureWritesNoKeeperPos` — the same over the whole EXTRACTED transitive closure,
  with **every reaching site NAMED** with its class and the closure's depth and size stored. ⛔
  A false (b) is not a contradiction of (a): it names which reachable branch *could* write one,
  and **POPULATION A measures what actually happens**.
* **THE RENDERER'S DIVE** — `saveAnimTimer / 0.7`, `scale(1 + 0.7k, 1 − 0.35k)`, `diveDir` frozen
  at dive start pointing AT THE BALL — is **ANCHORED AND DOCUMENTED AS A RENDER FACT**, and is
  **NEVER MEASURED** by this sim census. (⚠ the high-ball claim sets `saveAnimTimer = 0.6` while
  the renderer still divides by 0.7 — anchored, not measured.)

### §P.F THE ESTIMATOR

**Cluster bootstrap over match SEEDS, 2,000 draws**, rng seeded from the block base 12,551,000.
Every published share carries a 95 % percentile interval and its half-width; every paired Δ is
**D13 − E13** on the seeds the arms share, so the interval is PAIRED by construction. Medians
are **BIN-DERIVED** so `gFaces` re-derives every one off disk. ⛔ **Nothing in this census is
scored** and ⛔ **no null is cut anywhere**: an interval containing zero reads *"unresolved at
this power"*. **Max faces are stored MAXIMA**, pooled by `max`, never bootstrapped.

### §P.G SEEDS AND SIZING

* **Block 12,551,000–999** (the frontier at #397 item 8; consumed blocks LN-C0 12,544,000–999 ·
  LN-T1 …545 · LN-C1 …546 · LN-C2 …547 · LN-C3 …548 · LN-T1′ …549 · LN-T1′b 12,550,000–999).
  Battery seeds **12,551,000–12,551,998** (**N_FROZEN = 999**), construction receipt
  **12,551,999**. Each seed is walked **ONCE PER ARM** ⇒ **2,000 walks booked = walked**. The
  **UNWALKED TAIL IS DECLARED** in `seeds.unwalkedTail`.
* **Scratch, out-of-band only**: the sizing smoke **900,004,600–611** with its receipt at
  **900,004,620**; the **world pin** at **900,004,670**; **gLockstep** and **X-DET** at
  **900,004,690–691**; the predicate fixtures' attribute draw at **900,004,699**. ⭐ **EVERY
  scratch seed walked is STORED in the artifact's `seeds` block.**
* **Stats consumed: ZERO.** Registry **80** untouched.
* **SIZING** (the house form; §DEV-PREFLIGHT's 12-cluster smoke is the variance source; the
  DECLARED half-width is **0.05** on each read-bearing share). Both rows and every step of their
  arithmetic are STORED and re-derived off disk by `gFaces`:

| face (arm E13) | realised hw (12 clusters) | target | N required | resolvable at 999 |
|---|---|---|---|---|
| `keeper.writtenOutsideRestartsShare` (per keeper tick) | 0.000032607100739637736 | 0.05 | **1** | ✅ |
| `ballJump.catchShare` (per catch) ⚠ | 0 | 0.05 | **0** | ⚠ **DEGENERATE — see below** |

  ⚠⚠ **THE `ballJump.catchShare` ROW IS DECLARED, NOT SIZED**: the smoke's seven catches ALL
  jumped, so its bootstrap half-width is 0 and its "N required = 0" is a **degenerate variance
  estimate, not a power claim**. It is reported at the battery with its own realised interval,
  and ⛔ no null is cut on it. ⚠ **What else is NOT sized is stated instead**: every rare cell —
  the per-class written counts, the smother family, the > 3 m catches, the `unclassified` cells
  — is reported with its own realised interval and no null is cut on it.
* **Bins** (frozen, all STORED EDGES — ⛔ never rules; no read word depends on one):
  per-tick \|Δpos\| **0.02 m × 51** (save window and outside, the same edges) · \|Δpos\| ÷ cap
  **0.25 × 41** · save distance **0.5 m × 17** (all saves, and catches alone) · ball→goal line
  **1 m × 21** · ball speed **2 m/s × 21** · the ball's move after a save **0.25 m × 25** (catch
  and parry) · keeper class × 11 · outfield class × 6 · save kind × 5 · action × 24.

### §P.H THE GATES (all liveness/receipt — NEVER direction)

`gWorld` (§P.A) · `gDoseSource` (the shipped loaders CALLED; the FILE BYTES hashed against the
pinned values; exit 3 on mismatch) · `gAnchoredConstants` (anchored extraction with line
receipts across `mechanics.ts`, `Match.ts`, `Player.ts`, `PlayerBrain.ts`, `actionExecutor.ts`,
`MatchRenderer.ts`, `constants.ts` and `a4World.ts`; **the three needles that legitimately occur
twice are declared with `want = 2` and every occurrence's line is stored** — canon: *"a seam-map
gate pins occurrence COUNTS per needle and enumerates EVERY occurrence's site"*) ·
`gWrittenFixtures` (the written predicate on real bodies both ways; the reach reconstruction vs
the anchored formula term by term; the ball-jump predicate at 3 m and at the feet) ·
`gLedgerRead` (both engine ledgers; the class FOLLOWS an edited text; liveness on both arms) ·
`gClassesNonVacuous` (save events, catches, parries, written keeper ticks and written outfield
ticks non-empty on BOTH arms — else the read is stated on what exists) · `gCodeFactGraph` (every
write site resolved; the closures uncapped; the own-lane needle LIVE on the corpus) ·
`gLockstep` (no wrapper; observed ≡ unobserved byte for byte, per arm, on out-of-band scratch) ·
`gDeterminism` (**X-DET, twice**: each scratch seed walked TWICE per arm, signature AND row
bytes identical) · `gFingerprintProd` (**X-FP-PROD**: the production fingerprint **RECOMPUTED
IN-PROCESS** by the shipped recipe and equal to the literal of record) · `gSrcUntouched` (`git
diff --stat HEAD` **AND** `git status --porcelain` over **`src/` AND `tests/`**, all empty) ·
`gSeedsBookedEqualWalked` · `gSeedDisjoint` · `gN` · `gLoo` (leave-one-cluster-out on the two
read-bearing selectors, per arm — ⚠ **SCOPED**: a stability check on the SELECTORS, not a
confidence statement about any face) · `gHashOrder` (the body hash computed **LAST** off an
explicit ALLOWLIST SCHEMA that **INCLUDES `allGreen`**, with a NON-body
`receipts.hashReproducesFromFile`) · `gStage` (the `stage.instrument` path is THIS instrument's
and `stage.instrumentSha256` is the sha256 of the RUNNING FILE re-read from disk) ·
`gReadWords` · `gFaces` (**EVERY** published face, paired Δ, bin, median, partition, read word
and sizing row re-derived off the **SERIALIZED** artifact).

Canon quoted where it applies — VERBATIM: *"the hashed body is built from an explicit ALLOWLIST
SCHEMA — a field not in the schema never enters the body; forbidden-name lists are retired"*
(home: `PC-T0-LATENCY-SEAM.md` §COMMANDER CORRECTIONS item 1); *"the body hash is computed after
every body key is assigned, and a NON-body receipt field records that the hash reproduces from
the written file"* (home: `RC-T1A-PRECUE-EXAM.md` §COMMANDER CORRECTIONS item 3); *"an artifact
is written as compact JSON — no indentation; the hash is over the canonical body regardless;
pretty-printing is a reader's tool, not a storage form"* (home: ruling #372 item 5); *"a
src-extracted constant pins its extraction to the NAMED call site — anchored match + line
receipt — never first-occurrence"* (home: `BK-C0-BODYBALL-CENSUS.md` §COMMANDER CORRECTIONS item
1); *"a field carries the unit its name claims"* (home: ruling #294 item 3); *"a scored face's
walk-side predicate is pinned — anchored extraction or fixture — because the re-derivation gate
proves arithmetic, not definitions"* (home: `DF-T3-SURFACE-EXAM.md` §COMMANDER CORRECTIONS item
2); *"a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated face"*
(home: `PC-T2-ARMED-WORLD-READ.md` §COMMANDER CORRECTIONS item 4); *"a stage doc's numeric sweep
covers EVERY numeric literal in prose at ANY precision; a hand-written percentage is the
likeliest second copy"* (home: `BF-C0-MOVEMENT-FACING-CENSUS.md` §COMMANDER CORRECTIONS item 6);
*"a gate's NOTE derives from the same pinned values the gate checks; a count typed beside its pin
is a second copy"* (home: `PT-C0-PLAYTEST-FORENSIC-CENSUS.md` §COMMANDER CORRECTIONS item 1);
*"a stage doc's HONEST LIMITS list is the ONE home; the artifact stores that list verbatim or
stores none"* (home: `RC-C0-COOPERATION-CENSUS.md` §COMMANDER CORRECTIONS item 3) — **this
artifact stores NONE**; §HONEST LIMITS below is the list of record; *"a counterfactual verdict
sentence … quotes a word the instrument STORED …; a universal sentence about a table … is a
stored boolean or is not written"* (home: `BF-T1-FACING-COST-EXAM.md` §COMMANDER CORRECTIONS
items 1–2); *"an event attribution reads the engine's own record when one exists …"* (home:
`RC-T1B-READY-EXAM.md` §COMMANDER CORRECTIONS item 5); *"a code-fact boolean … the callee list
is EXTRACTED from the hashed text …"* (homes: `LN-C1` §CORR 1–2, `LN-C2` §CORR 1, `LN-C3`
§CORR 2). Reconstruction receipts are **never** quoted as football effect sizes (#289 item 1).

**READ BESIDE, NOT RE-MEASURED** — `BF-BODY-FACING-CONTRACT.md` §3 STATUS (#381): on the priced
body *"the share of shots before which the keeper NEVER MOVED rose **+0.021132** [+0.010509,
+0.031487] and his metres fell **−12.404622** — the priced keeper is more often STATIONARY"*, a
LABELLED HYPOTHESIS whose probe is a per-shot keeper-lateness read. ⛔ **BF is not armed on
either arm here** (`gWorld` asserts `bfFacingCost` ABSENT), so nothing in this census confirms or
refutes it; it is quoted because a *stationary* keeper is exactly the body an eye would read as
teleporting when the ball arrives at his hands.

## §DEV-PREFLIGHT — the sizing smoke, disclosed in full

A **12-cluster scratch smoke** (`GKC0_MODE=smoke GKC0_N=12`, seeds **900,004,600–611**, receipt
900,004,620, world pin 900,004,670, lockstep and X-DET 900,004,690–691, artifact off the
canonical path at `/tmp/gk-c0-smoke.json`) was run **BEFORE this freeze**. Its realised
half-widths were read out of the smoke artifact's own `faces[].halfWidth` fields on the E13 arm —
**never re-typed from the console's rounded print** — and are hardcoded in the instrument's
`SIZING_INPUTS` (the two rows in §P.G's table).

**Disclosed honestly:**

* ⭐⭐ **THE FIRST SMOKE FOUND A REAL DEFECT IN THIS INSTRUMENT, AND THE FIXTURES DID NOT CATCH
  IT.** The walk called `isWritten(disp, cap)` where the predicate's second argument is a
  **topSpeed**, not a cap — applying `DT` twice and making the threshold 60× too small. It
  printed a written share near three quarters of all keeper ticks while the mean displacement
  was a sixth of the cap: **the two numbers could not both be true, and that is what caught it**.
  The FIXTURES stayed green throughout, because they call the predicate correctly — a fixture
  proves a predicate, not a call site. Fixed before this freeze; the corrected call is commented
  at the line. Stated here so the record shows what moved and when.
* A first smoke also ran `gAnchoredConstants` RED on **three** needles pinned at 1 occurrence
  that honestly occur **twice** (`match.giveBall(gk);` at the catch and at the high-ball claim;
  `match.markShotOutcome('saved');`, whose 4-space form is a SUBSTRING of the claim's deeper
  indent; `const speed = len(ball.vel);`, which `tryDeflection` also reads). The pins were
  corrected to 2 and every occurrence's line is stored — the anchored-extraction canon working
  exactly as intended: a wrong count is a RED gate, not a silent pass.
* ⚠ **12 clusters is a NOISY variance estimate** — a strictly weaker assumption than sizing off
  a published battery. Said here, before the battery. The **ball-jump row is degenerate**
  (§P.G).
* ⚠ The smoke's own POINT readings are **UNPOWERED and bind nothing**. For the record, so nobody
  can claim the freeze was written after seeing a battery: on 12 scratch seeds the E13 arm read
  a keeper written share ≈ 0.00032, a written-outside-restarts share ≈ 0.00003 (11 ticks in
  367,690), ≈ 5.7 save events a match split ≈ catch 0.10 / parry 0.72 / claim 0.18 / smother
  0.00, a mean save distance ≈ 1.92 m against a mean reconstructed reach ≈ 2.32 m, catches
  beyond 1 m ≈ 0.86 and beyond 2 m ≈ 0.43, a ball-jump share at the catch of 1.00 on **seven**
  catches with a mean ball move ≈ 1.50 m (parries ≈ 0.18 m), and it printed **"THE KEEPER'S BODY
  IS WRITTEN"** with a dominant class of `actGoalkeeperPosition` on **seven** ticks. **None of
  these numbers is a finding**; the battery's own §R replaces every one of them, and a battery
  that printed a different sentence would be reported as-is.
* The smoke ALSO confirmed instrument liveness: **all 19 gates green** at 12 clusters; both arms
  carried save events, catches, parries and written ticks; `gLockstep` green on all four arm ×
  scratch walks; **X-DET** green on all four twice-walked pairs; **X-FP-PROD** recomputed the
  production fingerprint in-process; the world pin held on both arms; and every write site
  resolved to an enclosing function.
* **This section binds nothing.** The freeze is §0–§P.H above.
