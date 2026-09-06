# GK-C0 — 「门将瞬移」 THE KEEPER-JUMP CENSUS（门将到底有没有瞬移,还是球在瞬移）

> **STATUS: BANKED — the battery is walked, ALL 19 GATES GREEN, and the READ OF RECORD is
> printed at §R5.** §0–§P.H and §DEV-PREFLIGHT were sealed at the freeze commit **`f6fbd63`**
> and were NOT edited after sight; the instrument is byte-identical between the freeze and the
> results commit (`git diff f6fbd63..<results> -- scripts/probes/gk-c0-*.ts` EMPTY).
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

## §R RESULTS (every number below QUOTES the artifact's own fields at 6 dp — the artifact
## is the numbers of record, per the #357 standing order)

**RUN RECEIPTS.** Freeze **`f6fbd63`**. `git diff f6fbd63..<results> -- scripts/probes/gk-c0-*.ts`
is **EMPTY (0 bytes)** — no frozen constant, no frozen definition and no frozen printed form
moved after sight. **`allGreen` = true** (a STORED boolean; **19** gate objects, every one
`ok: true`); `gFaces` **285/285** face-and-Δ checks and **63/63** stored-bin / median /
partition / READ-WORD / sizing checks re-derived from the SERIALIZED artifact off disk.
Artifact `docs/world-model/data/gk-c0-keeper-jump-census.json` (**5,430,190 bytes**),
`instrumentSha256 = 331c8c03bd01c01ba8cff034496d8b85b667a77b37e84aefa3f960f1f7f14f96`,
`hashedBodySha256 = 66f9d9b95f5b163137ff775c746014b6c3496c18ed271fe31dd5af69775dc516`,
**file byte-hash `736d43b94d9c3b263913f77f0b01c7bf075dc7a777863efaf34a77710cb1a79e`**, and the
NON-body `receipts.hashReproducesFromFile` = **true**. Battery **999 seeds
(12,551,000–12,551,998) × 2 ARMS + the construction receipt at 12,551,999 ⇒ BOOKED = WALKED =
2,000 walks**; `seeds.unwalkedTail` = **null** — **the block is consumed WHOLE** (999 + 1 =
1,000 seeds). Scratch: the sizing smoke on 900,004,600–611 (receipt 900,004,620), the world pin
at 900,004,670, gLockstep and X-DET on 900,004,690–691, the fixture attribute draw at
900,004,699 — every one STORED in the `seeds` block. **ZERO stats consumed** — registry **80**.
`npm run typecheck` clean with the probe in the tree; **X-FP-PROD recomputed IN-PROCESS** =
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — the literal of record,
**UNCHANGED**. Wall **279.826 s** (`perf.meanWallSecondsPerMatch` **0.132036**).

### §R1 THE KEEPER'S BODY — every keeper tick, and what was written

| face (E13, of record) | value [95 % CI] | n / d |
|---|---|---|
| `keeper.ticksPerMatch` | **30583.237237** [30535.113113, 30630.470470] | 30,552,654 / 999 |
| `keeper.meanDisplacementMetres` | **0.017000** [0.016843, 0.017163] | — / 30,552,654 |
| `keeper.meanCapMetres` (his own `topSpeed · DT`) | **0.103981** [0.103788, 0.104174] | — / 30,552,654 |
| `keeper.writtenShare` | **0.000302** [0.000293, 0.000311] | 9,231 / 30,552,654 |
| ⭐ `keeper.writtenOutsideRestartsShare` | **0.000018** [0.000014, 0.000022] | **550** / 30,552,654 |
| ⭐ `keeper.writtenOutsideRestartsShareOfWritten` | **0.059582** [0.047786, 0.071920] | 550 / 9,231 |
| `keeper.saveWindowTickShare` | **0.024773** [0.024253, 0.025304] | 756,871 / 30,552,654 |
| `keeper.holdTickShare` | **0.036182** [0.034710, 0.037703] | 1,105,452 / 30,552,654 |
| `keeper.restartTickShare` | **0.176289** [0.174043, 0.178495] | 5,386,086 / 30,552,654 |

**THE TYPICAL KEEPER TICK IS NOT A JUMP AND IS NOWHERE NEAR ONE**: his mean per-tick move is
**0.017000** m against a mean cap of **0.103981** m — about a sixth of what his legs allow — and
the bin-derived median of `keeperDisplacementOverCapRatio` is **0** (the ratio's own frozen
0.25-wide bin holds the bulk). **But the written ticks are not zero and they are not small.**

**THE WRITTEN KEEPER TICKS BY CLASS** (`bins.E13.keeperWrittenByClass` over
`bins.E13.keeperClassTicks`, with `bins.E13.keeperMaxDisplacementByClassMetres`):

| class | class ticks | written | max \|Δpos\| in the class (m) |
|---|---|---|---|
| `substitution` | 0 | **0** | 0 |
| `restartPlacement` | 5,386,086 | **8,681** | **12.781099** |
| `saveWindow` | 408,677 | **68** | **8.598959** |
| `hold` | 1,017,394 | **15** | 0.107809 |
| `actGoalkeeperSave` | 54,821 | **10** | 0.107936 |
| `actGoalkeeperRush` | 12,332 | **0** | 0 |
| `actGoalkeeperPosition` | 22,957,531 | **370** | **1.608244** |
| `actChaseBall` | 553,237 | **70** | 0.115225 |
| `actMakeRun` | 5,483 | **0** | 0 |
| `actPass` | 68,793 | **1** | 0.103075 |
| `unclassified` | 88,300 | **16** | 0.113440 |

⭐⭐ **THE KEEPER'S BODY IS WRITTEN, AND MOSTLY BY THE RESTARTS**: **8,681** of the **9,231**
written keeper ticks are restart placements — that is the kick-off reset, the restart clearance
circle and the goal-kick line, exactly as designed, and the biggest single keeper displacement
in the whole battery, **12.781099** m, is one of them. Outside those, **550** written ticks
remain, and they are led by `actGoalkeeperPosition` (**370**, up to **1.608244** m) with
`actChaseBall` (**70**) and — the one that matters for the user's sentence —
**`saveWindow` (68 written ticks, up to 8.598959 m)**.

**THE THREE MARKERS ON WRITTEN KEEPER TICKS** (⚠ markers, not call-site attribution — §P.B):
`keeper.writtenKickProtectedShare` **0.023724** [0.019303, 0.028434] (**219** / 9,231) — the
kick-protection clearance was live; `keeper.writtenCrowdedShare` **0.034774** [0.027420,
0.042553] (321 / 9,231); `keeper.writtenNearHoldingOpponentShare` **0.000000** [0.000000,
0.000000] (**0** / 9,231) — **not one written keeper tick carried the holding-keeper marker at
all**. Since the kick-protection clearance can only be live while the engine's phase
is `playing`, those **219** ticks are the best-named candidate for the non-restart writes; the
census does not claim more than the marker says.

**D13 BESIDE**: `keeper.writtenShare` **0.000275** [0.000265, 0.000286] (8,352 / 30,338,680);
`keeper.writtenOutsideRestartsShare` **0.000024** [0.000018, 0.000030] (719 / 30,338,680); its
own class ranking leads with `actGoalkeeperPosition` (584, max **6.003572** m) and `saveWindow`
(89).

### §R2 THE SAVES — where they are taken from, and what the ball does next

**THE JOIN IS CLEAN**: `save.joinAgreementShare` = **1.000000** [1.000000, 1.000000] (4,991 /
4,991 on E13; 4,605 / 4,605 on D13) — **every single `shotLog` flip to `saved` coincides with a
`save` event on the same tick**. The complement is counted, never imputed:
`save.eventWithoutFlipShare` **0.124079** [0.114606, 0.133722] (707 / 5,698) — the smothers and
the claims taken outside a live shot.

| face (E13, of record) | value [95 % CI] | n / d |
|---|---|---|
| `save.eventsPerMatch` | **5.703704** [5.540541, 5.866867] | 5,698 / 999 |
| `save.ledgerFlipsPerMatch` | **4.995996** [4.847848, 5.140140] | 4,991 / 999 |
| `saveKind.catch` | **0.096350** [0.087867, 0.104821] | 549 / 5,698 |
| `saveKind.parry` | **0.775886** [0.763108, 0.788730] | 4,421 / 5,698 |
| `saveKind.highBallClaim` | **0.112145** [0.102964, 0.121801] | 639 / 5,698 |
| `saveKind.smother` | **0.015620** [0.012298, 0.019102] | 89 / 5,698 |
| `saveKind.otherSaveEvent` | **0.000000** [0.000000, 0.000000] | 0 / 5,698 |
| `save.catchShareOfShotSaves` | **0.110463** [0.100524, 0.120359] | 549 / 4,970 |
| `save.meanDistanceMetres` | **1.968465** [1.953044, 1.983364] | — / 5,698 |
| `save.meanReconstructedReachMetres` | **2.393549** [2.384356, 2.402622] | — / 5,698 |
| `save.meanReachTimesStretchMetres` | **3.231291** [3.218881, 3.243540] | — / 5,698 |
| `save.withinReachShare` | **0.979115** [0.975453, 0.982716] | 5,579 / 5,698 |
| `save.withinStretchShare` | **0.020885** [0.017319, 0.024550] | 119 / 5,698 |
| `save.beyondStretchShare` | **0.000000** [0.000000, 0.000000] | **0** / 5,698 |

⭐ **THE POST-STEP READING GAP IS SMALL ENOUGH TO PUBLISH**: not one of the 5,698 save events
read a ball↔keeper distance beyond the engine's own fingertip envelope, so the declared
reconstruction never contradicted the code it reconstructs.

**HOW FAR FROM HIS BODY THE CATCHES ARE TAKEN**: `catch.gt1mShare` **0.896175** [0.871658,
0.921305] (492 / 549) · `catch.gt2mShare` **0.675774** [0.630909, 0.716117] (371 / 549) ·
`catch.gt3mShare` **0.000000** [0.000000, 0.000000] (0 / 549). The bin-derived median catch
distance is **2** m (`medians.values.E13.catchDistanceMetres`), and the frozen 0.5 m
`catchDistanceM` bins are EMPTY above their sixth bin — the catch branch's own `dNow <= reach`
guard, with a mean reconstructed reach of **2.393549** m, is exactly that ceiling.

⭐⭐⭐ **THE BALL-JUMP**: `ballJump.catchShare` = **0.985375** [0.974708, 0.994455] (**539** /
547) — **on essentially every catch, the ball moves further on the NEXT tick than the keeper's
own legs could have carried it**, `ballJump.catchMeanMetres` **1.711552** [1.660572, 1.761204]
m with a bin-derived median of **1.75** m. Beside it, the parry — a kick-like release, never
read: `ballJump.parryShare` **0.989301** [0.985973, 0.992342] (4,346 / 4,393) at
`ballJump.parryMeanMetres` **0.182645** [0.181963, 0.183285] m, an order of magnitude smaller
move that clears the predicate only because a struck ball leaves the boot faster than a keeper
runs. The other two families jump too: `ballJump.claimShare` **0.976038** [0.963149, 0.987382]
(611 / 626) and `ballJump.smotherShare` **0.977528** [0.942857, 1.000000] (87 / 89).

**WHERE ON THE PITCH**: the bin-derived median ball-to-goal-line distance at the save is **6** m
(`medians.values.E13.ballToGoalLineAtSaveMetres`) and the median ball speed **10** m/s —
「最后一刻」 is literally where these resolve.

**D13 BESIDE**: `ballJump.catchShare` **0.985591** [0.975831, 0.993874] (684 / 694);
`saveKind.catch` **0.129795** [0.119910, 0.139518]; `save.meanDistanceMetres` **1.957885**
[1.941668, 1.974236].

### §R3 ALL BODIES — the written ticks by role, so the jump is attributed to the body that jumped

| face | E13 | D13 |
|---|---|---|
| `body.gkWrittenShare` | **0.000302** [0.000293, 0.000311] (9,231 / 30,552,654) | **0.000275** (8,352 / 30,338,680) |
| `body.outfieldWrittenShare` | **0.001660** [0.001600, 0.001719] (252,778 / 152,251,795) | **0.001967** (297,022 / 151,009,866) |
| ⭐ `opponentDisplacement.holdClearanceShareOfWritten` | **0.001602** [0.001413, 0.001803] (405 / 252,778) | **0.001569** (466 / 297,022) |

**AN OUTFIELDER IS WRITTEN MORE OFTEN THAN A KEEPER** (0.001660 against 0.000302 on E13), and
the outfield written ticks split (`bins.E13.outfieldWrittenByClass` over
`bins.E13.outfieldClassTicks`, max in metres from
`bins.E13.outfieldMaxDisplacementByClassMetres`): `substitution` **141** / 141 (max
**47.882509** m — the walk on from the touchline) · `restartPlacement` **82,230** / 26,813,970
(max **50.065877** m) · `holdClearance` **405** / 3,511 (max **9.329008** m) · `kickProtection`
**9,475** / 1,132,864 (max **5.953277** m) · `overlapPush` **70,167** / 5,311,409 (max
**8.484343** m) · `unclassified` **90,360** / 118,989,900 (max **8.243535** m).

⭐ **THE `GK_HOLD_CLEARANCE` PUSH IS REAL BUT RARE**: **405** written outfield ticks on E13, at
up to **9.329008** m — bigger than the law's own 3 m because the same tick's box-edge clamp can
follow it. As a share of written outfield ticks it is **0.001602**, and that is the number
printed beside every read sentence below.

### §R4 THE CODE FACTS — over the EXTRACTED call graph

**THE WRITE-SITE CENSUS**: **56** direct `pos` write sites under `src/sim` and `src/ai`, **every
one** resolved to an enclosing function span (**579** extracted spans), each hashed whole, and
classified by the frozen ordered rule list (`codeFacts.writeSitesByClass`): `ballPlacement` 13 ·
`restartPlacement` 10 · `overlapResolve` 10 · `snapshotCopy` 8 · `pitchClamp` 6 · `integration`
2 · `other` 2 · `substitution` 1 · `holdClearance` 1 · `kickProtection` 1 · `boxEdgeClamp` 1 ·
`sentOffApron` 1.

**THE SAVE PATH — TWO STORED BOOLEANS**:

* `codeFacts.savePath.savePathWritesNoKeeperPos` = **true**. Neither `tryKeeperSave`'s own text
  nor `giveBall`'s own text contains a single player-`pos` write.
  **THE COMMANDER'S CODE READ IS CONFIRMED AT THE BODY LEVEL.**
* `codeFacts.savePath.savePathClosureWritesNoKeeperPos` = **false**, and the ONE reaching site is
  NAMED: **`src/sim/Player.ts:254` in `becomeSub`, class `substitution`** — reached over the
  extracted closure (**26** spans, depth **4**, uncapped) through `giveBall`'s OFFSIDE dead-ball
  branch → `callOffside` → `awardRestart` → `trySubstitution` → `becomeSub`. That is a
  substitution placement on a dead ball, not a save-time write — and POPULATION A measures the
  consequence directly: **`substitution` carries 0 written keeper ticks in this battery**
  (§R1's table).

**THE OWN-LANE DOOR** (why world 14 is not walked):
`codeFacts.keeperPaths.ownLaneDoorAbsentFromKeeperPaths` = **true** over a keeper-path closure of
**164** spans at depth **5**, uncapped. The needle is LIVE on the same corpus
(`ownLaneNeedleIsLive` = **true**): `lnOwnLane` appears in exactly one span on the whole
`src/sim` + `src/ai` corpus — **`src/ai/PlayerBrain.ts:165-1813:decideCarrier`** — and that span
is not in the keeper closure. **World 14's one door touches no keeper path.**

**THE RENDERER'S DIVE — A RENDER FACT, ANCHORED, NEVER MEASURED HERE** (`renderFacts`): while
`saveAnimTimer > 0` the sprite takes `k = saveAnimTimer / 0.7`, is rotated to `diveDir` —
**frozen at dive start, pointing AT THE BALL** — and scaled **1 + 0.7 · k** along that axis by
**1 − 0.35 · k** across it. ⚠ The high-ball claim sets `saveAnimTimer = 0.6` while the renderer
still divides by 0.7, so a claim's dive starts at k ≈ 0.857 — anchored, not measured. A body
stretched by `1 + 0.7 · k` and pointing at the ball, for 0.7 s, is **`keeper.saveWindowTickShare` =
0.024773** of all keeper ticks.

### §R5 THE READS, PRINTED (frozen literals on STORED selectors; E13 of record)

**THE SELECTORS** (`reads.perArm`, re-derived off disk by `gReadWords`):

| selector | E13 | D13 |
|---|---|---|
| `keeperWrittenOutsideRestarts` | **true** (count **550**) | **true** (count **719**) |
| `ballJumpsAtCatch` (share > 0.5) | **true** — **0.985375**, 539 / 547 | **true** — **0.985591**, 684 / 694 |
| `selected` | **READ_2** | **READ_2** |

> **THE READ OF RECORD (E13):** *"THE KEEPER'S BODY IS WRITTEN — the write site is named
> (\<class\>)."*
>
> *dominant non-restart written class (E13): `actGoalkeeperPosition` (**370** written keeper
> ticks)* — the stored ranking is `actGoalkeeperPosition` 370 · `actChaseBall` 70 · `saveWindow`
> 68 · `unclassified` 16 · `hold` 15 · `actGoalkeeperSave` 10 · `actPass` 1 ·
> `actGoalkeeperRush` 0 · `actMakeRun` 0.
>
> *opponent-displacement share (beside): **0.001602***

> **THE COUNTERFACTUAL WORD (D13, `reads.counterfactualWordForD13`):** *"THE KEEPER'S BODY IS
> WRITTEN — the write site is named (\<class\>)."*
> *opponent-displacement share (beside): **0.001569***
>
> **`reads.agreementWordPrinted`: "THE DOSED WORLD SELECTS THE SAME READ"** (`dosedAgrees` =
> **true**).

**LOO, SCOPED** (`gLoo`, `loo`): dropping any single match seed leaves **both** selectors and
therefore the selected read UNCHANGED on **both** arms (`selectorAlwaysSame` = true ×2); the
leave-one-out range of the keeper share is [0.000017, 0.000018] on E13 and of the ball-jump
share [0.985185, 0.987179]. ⚠ This is a stability check on the SELECTORS, not a confidence
statement about any face.

⛔ **WHAT THE FROZEN RULE DID NOT LET THE CENSUS SAY.** READ 2's selector is an EXISTENCE
selector (*any* written keeper tick outside the restart classes), and on 30,552,654 keeper ticks
it fired on **550**. READ 1's condition — the ball jumps on more than half the catches — is
**ALSO true, at 0.985375**, and by the frozen precedence it was not printed. Both stories are
true at once; the frozen rule prints the body one. The commander decides what that is worth;
the census does not re-argue it.

### §R6 在说人话的层面

**门将的身体确实被"写"过——但绝大多数是开球和定位球的摆位。** 999 场比赛、3,055 万个门将 tick 里,
被写的只有 9,231 个(`keeper.writtenShare` **0.000302**),其中 8,681 个是重新开球那一类;全场最大的
一次位移 **12.781099** 米,就是开球时把人放回本方半场。**平常的一个 tick,他只走 0.017000 米,而他的腿
最多能走 0.103981 米——连六分之一都不到。**

**但真正让你看见"瞬移"的,几乎肯定是球,不是人。** 门将扑到球的平均距离是 **1.968465** 米(他的手臂
够到的范围重建出来是 **2.393549** 米);**接住球的时候,离身体 1 米以外接的份额是 `catch.gt1mShare` **0.896175**,2 米以外是
`catch.gt2mShare` **0.675774****。而球一旦被接住,**下一个
tick 引擎就把这颗"属于他的球"放到他手上**——**`ballJump.catchShare` **0.985375** 的接球,球在那一个 tick 里移动的距离超过门将本人的极速**,平均一下子挪 **1.711552** 米。**你看到的那一下,是球跨过来的,不是人跑过来的。**

**再加上画面本身在帮倒忙。** 每次扑救,渲染器按 `1 + 0.7 · k` 把门将拉长、并且**把他转向球的方向**,持续 0.7
秒。一个被拉长、指着球的身体,加上一颗刚刚跳进他手里的球——这就是"瞬移"的全部观感。

**唯一还没解释干净的一小块**:扑救窗口里仍有 **68** 个被写的 tick,最大 **8.598959** 米。它们不在开球
类里,而 **219** 个被写的门将 tick 发生在"定位球开出保护圈还生效"的时候——那条法则本来就会把对方球员推开。这块该不该动,是指挥官的事;普查只把它指出来。

## §HONEST LIMITS

1. **THE POST-STEP SAVE READING.** `tryKeeperSave` resolves inside `stepBall`; this census reads
   the geometry after the WHOLE step. The keeper's position is final for the tick by then, the
   ball's is not necessarily. The honest size of that gap is published as
   `save.beyondStretchShare` = **0.000000** — no save event read a distance outside the engine's
   own envelope — but a small bias inside the envelope cannot be excluded.
2. **THE THREE PROXIMITY MARKERS ARE NOT CALL-SITE ATTRIBUTION.** `crowded`,
   `nearHoldingKeeper` and `kickProtected` say the body was in the SHAPE a named law displaces
   at the tick's START. They do not prove the law fired. In particular `crowded` is read BEFORE
   the step while `resolveOverlaps` runs AFTER integration, so a pair that closed inside the
   step is missed — which is the most likely reason **90,360** written outfield ticks land in
   `unclassified`.
3. **`unclassified` IS COUNTED, NOT EXPLAINED.** 16 written keeper ticks and 90,360 written
   outfield ticks carry no class. The census names the size of its own ignorance; it does not
   fill it in.
4. **THE WRITTEN PREDICATE IS CONSERVATIVE.** `topSpeed` is read BEFORE the step and stamina
   only falls inside one, so the cap used is an upper bound: the written counts are floors.
5. **`keeperReach` IS A RECONSTRUCTION.** It is module-private; the four constants are extracted
   from the anchored lines and fixture-pinned term by term, but the engine's own function is
   never called. The `saveP` inputs are not reconstructed at all (by ruling).
6. **THE CALL GRAPH IS NAME-RESOLVED.** Callees are resolved by identifier name across the
   corpus; a name that exists in several files contributes ALL its definitions (widening, never
   narrowing, the closure), and calls made through a value (a callback held in a variable, a
   dynamic dispatch) are not edges. The closure is therefore a SUPERSET on names and a possible
   UNDERSET on indirection — stated, not hidden.
7. **TWO ARMS, ONE WORLD.** E13 and D13 are both world 13. Nothing here says what world 12 or
   world 14 would do, and world 14 was not walked (§R4 gives the code-fact reason, not an
   assurance about behaviour).
8. **THE RENDER STORY IS DOCUMENTED, NOT MEASURED.** No pixel was sampled. Story (c) can only be
   settled by a render census, which this stage does not perform.
9. **12 CLUSTERS SIZED THIS BATTERY**, and one of the two sizing rows was DEGENERATE (§P.G).
   The battery's own realised half-widths are the numbers to trust.
10. **A CENSUS NAMES A LEVER; IT DOES NOT PULL ONE.** Nothing here is armed, scored or shipped.

## §DEVIATIONS

1. ⭐⭐ **N_FROZEN = 999 IS THE BLOCK'S AFFORDANCE, NOT `min(required, affordance)`.** #397 item
   5(vii) sizes N by a 12-seed smoke and says `N = min(required, the block's affordance)`. The
   smoke's own sizing rows put `nRequired` at **1** and **0** (the second row DEGENERATE), so the
   literal `min` would have walked a single seed. The census took the block's affordance instead
   — the LN-C0 precedent (which also walked its block's cap) — because the read-bearing
   populations are RARE: at 999 seeds the catch population is 547 and the non-restart written
   keeper population 550, and at one seed both would have been empty. Both sizing rows are still
   computed and stored, and `resolvableAtNFrozen` is true for both.
2. ⭐ **THE `pos`-WRITE NEEDLE SET IS A SUPERSET of #397 item 5(v)'s three forms** — `+=` and
   `-=` are included. `resolveOverlaps` writes a body's position with `+=`; the ruling's three
   needles would have missed it, and `overlapPush` is the second-largest written outfield class
   (**70,167** ticks). A census that missed it would have been a needle list.
3. ⭐ **THE SAVE POPULATION IS FOUR FAMILIES, NOT TWO.** The ruling names `catches it` and
   `parries!`. All FOUR `pushEvent('save', …)` sites in `src/` are anchored and censused, so the
   high-ball claim (**0.112145**) and the smother (**0.015620**) are counted and published
   beside instead of silently landing in an `other` bucket. The READ's `ballJumpsAtCatch` is
   still computed on CATCHES ALONE, exactly as frozen.
4. ⭐ **THE KEEPER CLASS LADDER ADDS `actPass` AND A COUNTED `unclassified`.** The ruling lists
   five action types "· other"; the instrument names `Pass` explicitly and keeps `unclassified`
   as a countable else-branch with a fixture proving it can fire.
5. ⭐ **THREE PROXIMITY MARKERS WERE ADDED** (`crowded`, `nearHoldingKeeper`, `kickProtected`)
   beyond the ruling's class list, because a written tick landing in an ACTION class would
   otherwise be unnameable. They are declared as markers in §P.B, not as attribution.
6. **X-DET IS RUN ON THE LOCKSTEP SCRATCH PAIR**, not on its own seeds — the same two out-of-band
   seeds are walked twice per arm for determinism and once observed/unobserved for lockstep.
   Both bands are stored in `seeds`.

## §GATES — 19 of 19 GREEN (`allGreen` = true, a STORED boolean)

Every note below DERIVES from the same pinned values the gate's own `ok` reads; the authority is
the artifact's `gates` block, which carries each note in full.

| gate | verdict | what it proved here |
|---|---|---|
| `gWorld` | ✅ | per arm, on every walked match AND the construction receipt: `bqArmedVersion` 13 · `bqCushion` · `lnOwnLanePrice` ABSENT and `lnArmedVersion !== 14` · `edsPerceivedChoice` · every OBM/CTB/RC/BF seam absent · `info.genome` clean; plus the constructed world pin at 900,004,670 |
| `gDoseSource` | ✅ | the two dose files' BYTES hashed and equal to the pins; the shipped loaders CALLED |
| `gAnchoredConstants` | ✅ | every anchored needle at its declared occurrence count, with every occurrence's line stored — including the **three** needles that honestly occur twice (§DEV-PREFLIGHT) |
| `gWrittenFixtures` | ✅ | the written predicate on REAL bodies both ways; the reach reconstruction term by term against the anchored formula; the ball-jump predicate at 3 m and at the feet |
| `gLedgerRead` | ✅ | both engine ledgers read; the save class FOLLOWS an edited event text; liveness on both arms |
| `gClassesNonVacuous` | ✅ | save events, catches, parries, written keeper ticks and written outfield ticks all non-empty on BOTH arms |
| `gCodeFactGraph` | ✅ | all **56** write sites resolved to a hashed enclosing span; both closures uncapped; the `lnOwnLane` needle proven LIVE on the corpus |
| `gLockstep` | ✅ | observed ≡ unobserved whole-match signature, byte for byte, on all 4 arm × scratch walks — the observation is byte-inert |
| `gDeterminism` | ✅ | **X-DET, twice**: signature AND per-seed row bytes identical on all 4 twice-walked pairs |
| `gFingerprintProd` | ✅ | **X-FP-PROD**: the production fingerprint RECOMPUTED IN-PROCESS equals the literal of record (§R RUN RECEIPTS) |
| `gSrcUntouched` | ✅ | `git diff --stat HEAD` AND `git status --porcelain` over `src/` AND `tests/`, all EMPTY — **X-SRC-ZERO** |
| `gSeedsBookedEqualWalked` | ✅ | BOOKED = WALKED from the cells' own distinct seeds; every scratch seed out-of-band and stored |
| `gSeedDisjoint` | ✅ | every battery seed ≥ 12,551,000 and inside this block, disjoint from every consumed block; ZERO stats |
| `gN` | ✅ | no override env; the battery ran at exactly N_FROZEN × 2 arms; every sizing row's arithmetic finite |
| `gLoo` | ✅ | leave-one-cluster-out leaves the SELECTED READ unchanged on both arms (⚠ scoped, §R5) |
| `gFaces` | ✅ | **285/285** face-and-Δ and **63/63** bin / median / partition / read-word / sizing checks re-derived off the SERIALIZED artifact |
| `gReadWords` | ✅ | both selectors, the ball-jump share with its numerator and denominator, the selected read, the printed sentence, the dominant-class RANKING and the agreement word all RE-DERIVED off disk; every printed sentence is one of the three frozen literals |
| `gHashOrder` | ✅ | the 30-key ALLOWLIST body schema complete and including `allGreen`; the hash computed LAST; the NON-body `receipts.hashReproducesFromFile` true |
| `gStage` | ✅ | `stage.instrument` is THIS instrument's path and `stage.instrumentSha256` is the sha256 of the RUNNING file re-read from disk (LN-C3 §CORR) |

**THE ARTIFACT'S FINAL FILE BYTE-HASH AND BYTE COUNT are printed ONCE, in §R RUN RECEIPTS above**
— they are not artifact fields (a file cannot store its own byte-hash), so they live in exactly
one place in this doc and nowhere else.
