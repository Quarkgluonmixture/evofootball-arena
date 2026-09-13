# IF-C0 — 「球在飞时的前插 · 普查」 THE CENSUS OF THE RUN ONTO A BALL IN FLIGHT

> **STATUS: WALKED — the battery is complete, ALL 21 GATES ARE GREEN (`allGreen` = a STORED
> `true`), and the four PRE-REGISTERED QUESTIONS are answered as STORED PARTITIONS at §R1–§R4.**
> §0 through §DEV-PREFLIGHT were sealed at the FREEZE commit **`b7136fb`** and were NOT edited
> after sight (only this STATUS paragraph moved, and §R onward was appended). The instrument is
> byte-identical between FREEZE and RESULTS —
> `git diff b7136fb -- scripts/probes/if-c0-flight-run-census.ts` is **EMPTY (0 bytes)**.
> ⭐ THE ARTIFACT IS AT ITS **CANONICAL** PATH (`allGreen` is true, so the red-routing idiom did
> not move it): `docs/world-model/data/if-c0-flight-run-census.json`.
> Authorized by **COMMANDER RULING #415 item 6**.
> Census form of record: [`DS-C0-DESIGNATION-CENSUS.md`](DS-C0-DESIGNATION-CENSUS.md) — its
> §0 / §P / §DEV-PREFLIGHT / §R / §HONEST LIMITS / §DEVIATIONS / §GATES shape, its populations,
> its ledger joins, its frozen bins, its hash order and its `stage` block.
> Instrument: `scripts/probes/if-c0-flight-run-census.ts` — its recipes (`buildMatch`,
> `signatureOf`, the four-state classifier, the walker, the gate idioms, the hash / allowlist /
> RED-routing idiom) are **COPIED BY RECIPE from `scripts/probes/ds-t1d-coop-hats-exam.ts`,
> ⛔ NEVER IMPORTED**.
> Artifact: `docs/world-model/data/if-c0-flight-run-census.json`
> (**or its `.RED.json` SIDE PATH** if any gate is red — the red-routing idiom, #334 item 5;
> a RED-routed artifact's actual path is written into the RESULTS Status paragraph, #414 §CORR 4).
>
> ⛔ **THIS IS A CENSUS.** It publishes MEASUREMENTS as **STORED PARTITIONS**. **IT SHIPS
> NOTHING**, arms nothing and scores no hypothesis. ⛔ **NO READ SENTENCE IS FROZEN FOR A
> CENSUS** (#415 item 6) and **NO VERDICT WORD** is printed on any face: the four PRE-REGISTERED
> QUESTIONS are answered as stored partitions and **THE COMMANDER DRAFTS THE IF CONTRACT ON THE
> TABLE**.
> ⛔ **X-SRC-ZERO**: not one byte under `src/` or `tests/` is created or edited.
> ⛔ **WORLDS 12–17 ARE UNTOUCHED.** The three E13 arms are DS-T1d's own; `D13` is published
> BESIDE.

## §0 THE WORDS OF RECORD, AND WHAT THIS CENSUS IS FOR

**THE CONTRACT'S OWN NON-CLAIM** — [`DS-DESIGNATION-CONTRACT.md`](DS-DESIGNATION-CONTRACT.md)
§4, quoted VERBATIM:

> *"⭐ **THE RUN ONTO A BALL IN FLIGHT** (DS-T0b WITHDRAWS it: the perceived state guard fires
> only with a carrier at a teammate's feet, so 0.777604 of DS-T1's own runs — 0.542593 in flight
> plus 0.235011 at the side's own restart — are gone from slice one. That run is REAL football
> and it is NAMED AS THE NEXT SLICE, not dismissed …)"*

and, after DS-T0c left M-DS.7 byte-unchanged, the same section's second entry, VERBATIM:

> *"⭐ **THE RUN ONTO A BALL IN FLIGHT, STILL** (M-DS.7 is byte-unchanged at DS-T0c, and DS-T1b
> measured that the guard nevertheless leaks through stale eyes … the guard reading the PERCEIVED
> owner while the state classifier reads the truth — the named next slice, measured, not fixed
> here)"*

**M-DS.7 ITSELF** — the same contract §2, quoted VERBATIM:

> *"**M-DS.7 — THE STATE GUARD, PERCEIVED** … The own run is pushed ONLY when the PERCEIVED ball
> has an owner who is a same-side mate other than himself — `snapshot.ball !== null &&
> snapshot.ball.ownerGid !== null && ownerGid !== p.gid` and the owner resolved on the ROSTER by
> gid. This is the shipped licence's own condition ("a carrier who is not me") read off
> `snapshot.ball` instead of `match.ball.owner`. **The in-flight and restart runs — 0.777604 of
> DS-T1's own runs — are WITHDRAWN from slice one**; a run onto a ball in flight is real football
> and is NAMED as the next slice (§4), not smuggled and not dismissed."*

**THE TWO FACTS OF RECORD THAT FRAME THIS CENSUS** (#415 item 6, quoted by field from their own
artifacts, never re-typed as new measurements here):

* (a) **the coach's own hat runs start with the ball in flight `0.080620` of the time and at his
  side's own restart `0.397269`** — [`DS-T1-OWN-RUN-EXAM.md`](DS-T1-OWN-RUN-EXAM.md) §R3, the
  SHIPPED path's per-state line (`0.518517 · 0.080620 · 0.397269`). ⚠ That is a share of hat run
  **DECISIONS**; this census's own per-state partition is over run **EPISODES**, a different
  denominator, and says so wherever it prints beside it.
* (b) **`0.120532` of world 17's own runs start with the TRUTH ball in flight although the guard
  read a perceived OWNER** — [`DS-T1D-COOP-HATS-EXAM.md`](DS-T1D-COOP-HATS-EXAM.md) §R3b
  (`seamFaces['OWNCOOP-E13'].inFlightAndRestart.ownRunShareBallInFlight`), named at its §HONEST
  LIMITS 4 as **stale eyes** (`ObservedBall.ageTicks`), **not a design**.

**THE DISPATCH'S OWN SENTENCE** (#415 item 6, VERBATIM):

> *"the family measures before it designs."*

### in plain football language

A striker who goes **as the pass is struck**, a third man who goes **as the first pass travels**
— that is ordinary football, and this engine has no seat for it on the player's side. What it
has instead are **three coach-side licences that happen to survive a ball in the air**: the
corner crash, the open-play cross flight, and the side's own restart. And it has a **leak**: the
player's own run is supposed to be licensed only when his eyes hold a mate **on the ball**, yet
about one in eight of those runs begins while the ball is actually flying — because his eyes are
late, not because anybody designed it.

This census does not build the seat. It **counts**: how a run starts, what the ball was doing at
that moment, what his own eyes said, whether the pass in the air was even meant for him, what
the run produced, and — the question the contract will be written against — **how a run is timed
against a pass**: does the runner go first and the pass follow, or does the ball go first and the
runner chase it?

## §P THE FREEZE (all of it BEFORE any battery seed)

### §P.A THE ARMS — FOUR, PAIRED on shared seeds, THE OBM SEAT ABSENT THROUGHOUT

| arm | world | flags | the OBM seat |
| --- | --- | --- | --- |
| `HATS-E13` | 13 empty-book | none | ABSENT |
| `OWN-E13` | 13 empty-book | `dsOwnRun` + `dsHatsOff` (**world 16's door set**) | ABSENT |
| **`OWNCOOP-E13`** | 13 empty-book | + `dsCoopHatsOff` (**world 17's door set**) | ABSENT |
| `D13` | 13 DOSED (the SHIPPED loaders' L3 / PC doses) | none | ABSENT |

* **`OWNCOOP-E13` IS THE ARM OF RECORD.** The composer `a4MatchFlags(13)` is **CALLED**, never
  copied; `armA4World(m, null, 13)` on the E13 arms and `armA4World(m, null, 13, L3, PC)` on
  `D13`. The three E13 arms are **DS-T1d's `HATS-E13` / `OWN-E13` / `OWNCOOP-E13` BY
  CONSTRUCTION**, which is what makes `gRepro` possible.
* ⛔ **NO DOSE OF THE OBM SEAT.** `obmMovement` is never set, no 16-slot matrix is written to
  `baseGenome` or `effGenome`, and `info.genome` is untouched — asserted by `gWorld` on every
  walked match and on the construction receipt. `D13`'s L3 / PC doses are **the played book**,
  not a seat dose, and `gDoseSource` hashes the FILE BYTES it reads.
* `gWorld` asserts, **per arm, on every walked match AND the construction receipt**: the world-13
  gate (`bqArmedVersion === 13`, `bqCushion` TRUE, the world-14 and world-15 doors ABSENT);
  `edsPerceivedChoice` TRUE; every OBM / CTB / RC / BF seam ABSENT; **the three DS flags exactly
  as due**; `info.genome` clean. Pinned again on a CONSTRUCTED match of each arm at scratch seed
  **900,008,070**.

### §P.B THE ONE ADDED READ, DECLARED AND COUNTED

DS-C0 and DS-T1d install **no wrapper on a walked match**. This census adds **ONE** read, and it
is declared here before the battery: **on the arms carrying `dsOwnRun` the instrument takes ONE
`match.perceivedSnapshot(p)` PER STAMPED RUN-START TICK, INSIDE the arm's own flag** (#415 item
6(2)). That is what makes the runner's PERCEIVED ball publishable beside the TRUTH state.

* **`gPullCount`** asserts, on a THROWAWAY match per arm at the two out-of-band lockstep scratch
  seeds, that **OBSERVED − UNOBSERVED equals the row's own stored `instrumentPulls`**, that the
  added count is **ZERO on every arm without `dsOwnRun`** and **POSITIVE on every arm with it**
  (a dead counter proves nothing), and that the wrapped observed signature equals the UNWRAPPED
  lockstep walk's.
* **`gLockstep`** asserts the whole-match signature is **BYTE-IDENTICAL** observed vs unobserved
  on every arm × scratch walk — i.e. **the added pull is INERT, PROVEN AND NOT ASSERTED**.
  `perceivedSnapshot` reconstructs THIS body's memory from its own recorded scan frames, so a
  second, later pull is idempotent (the seam doc's §DEVIATIONS-B 1 idiom, **measured here**).
* ⚠ **THE PULL IS TAKEN AFTER THE STEP**, at the tick the run start is detected, so the snapshot
  is materialised from the **POST-STEP** truth. The stale-owner test therefore compares the
  perceived `ownerGid` against the **POST-STEP** truth owner, while the TRUTH STATE beside it is
  the **PRE-STEP** one the brain read. Declared here; §HONEST LIMITS carries the consequence.

### §P.C POPULATION R — EVERY RUN EPISODE, STAMPED AT ITS START TICK

**THE POPULATION**: every body's `p.action.type` becoming `MakeRun` from a non-`MakeRun` tick;
the episode ends when the type changes. The class is the **WINNER'S OWN `why`** in
`p.action.scores[0]` — the **SEVEN literals EXTRACTED from their own anchored source lines**
(DS-C0's six plus the seam's `own run in behind`), with `noWhyRecorded` and `OTHER` counted and
never dropped.

**THE STAMP**, at the START tick:

1. **THE TRUTH STATE** — DS-T1d's four-state classifier **BY RECIPE** (`mateOwnsTheBall` ·
   `ballInFlight` · `ownRestart` · `other`), read PRE-STEP. Inside `ballInFlight`: the flight's
   **PROVENANCE** off `match.pendingPass` (`hisSidesPass` · `theOtherSidesPass` ·
   `noPendingPass` — a loose or cleared ball) and its **AGE** = `simTime − pendingPass.t`.
2. **THE PERCEIVED STATE** (arms carrying `dsOwnRun`) — the runner's own `perceivedSnapshot(p)`
   ball: the `ownerGid` cell (`noSnapshot` · `noBallSeen` · `ownerNull` · `ownerIsSelf` ·
   `ownerIsMate` · `ownerIsOpponent`), the `ageTicks`, and **THE STALE-OWNER TEST** — the
   perceived `ownerGid` NAMES a body the TRUTH no longer credits with the ball. ⛔ A perceived
   `ownerGid` of **null is NOT a stale read — it is a perceived FLIGHT**, and the fixture proves
   it does not fire.
3. **FOR IN-FLIGHT STARTS ON HIS SIDE'S OWN PASS** — whether he is the pass's **INTENDED
   RECEIVER** (`pendingPass.targetGid`, **THE ENGINE'S OWN FIELD**, so #415 item 6(3)'s
   first-touch fallback is **NOT implemented** and would be dead code — canon: engine ledgers
   before heuristics); whether the flight is **TOWARD him** (the closing-speed sign along
   runner→ball); and **THAT FLIGHT'S OWN OUTCOME** (`receivedByAMate` · `intercepted` ·
   `outOrDeadBall` · `looseOrExpired` · `liveAtFullTime`).
4. **THE YIELD** in DS-T1's form, joined into the episode's own (start-state × `why`) cell:
   passes **aimed** at him inside the episode or within the frozen `yieldWindowSeconds` = **6**
   after its clear; **completed**; **shots by him** (a NEW `shotLog` row joined to
   `pendingShot.shooterGid` through its own `logIndex` **with the gid BANKED AT THE PUSH** —
   DS-T1 debt (b) kept paid); **goals** (that row's outcome flip, joined through the banked gid).
5. **THE TIMING FACT** Δt = **(the attached release) − (the run's start)** in sim-s.
   **NEGATIVE ⇒ the run started AFTER the release, onto a ball ALREADY TRAVELLING; POSITIVE ⇒
   the run started BEFORE the pass** (the shipped / normal form).
   **THE ATTACHMENT RULE, FROZEN HERE**: a same-side `pendingPass` **ALREADY LIVE** at the
   run-start tick **IS** the attached release; otherwise the **NEXT** release by his side; a run
   with neither is **COUNTED** in `dt.noAttachedReleaseShare` and is **NEVER BINNED**.
   **THE FROZEN BINS**: `−∞..−1.0` · `−1.0..−0.5` · `−0.5..0` · `0..0.5` · `0.5..1.0` ·
   `1.0..2.0` · `2.0+`. Published as a full histogram **per `why` class and per start state,
   per arm**.

### §P.D POPULATION F — EVERY PASS RELEASE BY THE SIDE IN POSSESSION

**THE POPULATION**: every NEW `match.pendingPass` key (`t|passerGid|targetGid`) — the engine's
own aim ledger's own transition. Each release is stamped with:

* how many **same-side outfield bodies are ALREADY in a `MakeRun` episode at the release**
  (binned 0 · 1 · 2 · 3 · 4+, and the mean). ⚠ Read on the **CURRENT** run state at the release
  tick, so a body whose run starts on the release tick counts as **already running** — declared.
* how many **START** an episode **during the flight** (per tick of flight, per `why`), and the
  flight's own duration in stepped ticks;
* **WHICH OF THE THREE the eventual receiver was** — `runningAtRelease` ·
  `startedDuringTheFlight` · `neither` (⚠ `runningAtRelease` WINS over `startedDuringTheFlight`,
  fixture-pinned), with the **INTENDED-receiver subset** published beside it.

### §P.E POPULATION L — THE LEAK ANATOMY, AS A PARTITION

For **every OWN RUN whose TRUTH state is `ballInFlight`** (arms carrying `dsOwnRun`): the
perceived ball's `ageTicks` distribution, the TRUTH flight age at the start tick, and the
partition

| cell | what it is |
| --- | --- |
| `stalePasserStillCredited` | the eyes still credit **THE PASSER** with a ball he has struck — an **EYES** reading |
| `aFreshMateWhoIsNotThePasser` | the eyes hold **a different mate** on the ball while the TRUTH classifier says the ball is in flight — a **CLASSIFIER-BOUNDARY** reading |
| `anythingElse` | anything else (a perceived flight, the observer himself, an opponent, no snapshot) |

⛔ **A PARTITION, NEVER A STORY.** The instrument does **not** name which one the leak "is": the
cells are stored and the commander reads them.

### §P.F THE CODE MAP — canon code facts over the EXTRACTED call graph

canon, VERBATIM: *"a code-fact boolean about what a function reads or does not read is derived
from the function's WHOLE text and from every callee whose return enters the read, each pinned by
an anchored text hash — the call graph it was checked over is stored beside the boolean; a hash
pins a body, it cannot see through a call; … the callee list is EXTRACTED from the hashed text —
every identifier called within the span, resolved to its definition and hashed — never typed."*

⛔ **THE MAP DESCRIBES; IT DESIGNS NOTHING.** The **SIX ROOTS** (`decideOffBall` ·
`decideCarrier` · `assignRunners` · `registerPass` · `performPass` · `executeAction`) are hashed
WHOLE with their EXTRACTED callees, and **their hashes are STATED AT THIS HEAD AND COMPARED TO
NOTHING BANKED** (world 17 landed inside two of them at `97b477f`; DS-C0's and DS-T1d's banked
literals for them read RED by declaration). The map publishes:

* **THE SHIPPED LICENCE'S STATE CLAUSE** (`PlayerBrain.ts`, anchored):
  `carrier ? carrier !== p : match.phase === 'restart' || crashLive || crossLive` — and **THE
  THREE IN-FLIGHT LICENCES THAT EXIST TODAY**, each with its source: the **corner crash**
  (`team.cornerCrash`), the **cross flight** (`team.crossFlight`, itself gated on
  `match.c4Arrival`) and the **restart** (`match.phase`).
* **THE OWN-RUN FORK'S M-DS.7 GUARD** — its WHOLE TEXT hashed, and the booleans DERIVED from it:
  it **READS** `snapshot.ball.ownerGid`; it does **NOT** read `ageTicks`, does **NOT** read any
  `.vel`, does **NOT** read `pendingPass`.
* **`ObservedBall`'s FIELDS** (`perceptionSnapshot.ts`): pos · vel · ownerGid · observedTick ·
  ageTicks ⇒ **a perceived FLIGHT is representable today** (`ownerGid` null with a non-zero
  `vel`). ⛔ DESCRIPTIVE ONLY.
* **`pendingPass`'s SHAPE** and **the engine's own receiver field** — `targetGid`.
* **THE THROUGH-BALL CHOOSER'S RUNNER SCAN** (where the passer looks for a body ALREADY RUNNING,
  by ACTION TYPE — DS-C0 §0.6's `thirdMan` read is the second of three), each resolved to exactly
  one line and one enclosing span.

### §P.G THE PRE-REGISTERED QUESTIONS — FROZEN HERE, ANSWERED AS STORED PARTITIONS

> **Q1** What share of each arm's runs start with the ball in flight, and of those how many are
> the coach's three existing in-flight licences vs the own run's leak?
>
> **Q2** Of the leaked own runs, what share have a STALE OWNER read (the passer still credited)
> vs a FRESH read of a mate who is not the passer — i.e. is the leak an EYES problem or a
> CLASSIFIER-BOUNDARY problem?
>
> **Q3** Do in-flight starts yield more or less than at-feet starts, per `why`, and do their
> intended-receiver shares differ?
>
> **Q4** THE TIMING FACT: in the shipped world, how often does the eventual receiver of a pass
> START his run after the release (a run onto a travelling ball) vs before (the pass played into
> an existing run) vs never — the histogram the IF contract's REALITY audit will be written
> against.

⛔ **NO READ SENTENCE IS FROZEN FOR A CENSUS.** Each question is answered by a STORED BLOCK of
partitions (`questions.q1` … `questions.q4`), re-derived off the serialized artifact by `gFaces`,
and **the commander drafts the contract on the table**.

### §P.H THE ESTIMATOR, THE SEEDS AND THE SIZING

* **THE ESTIMATOR**: per-seed cells; a **CLUSTER BOOTSTRAP over match seeds**, 2,000 draws, the
  resample RNG seeded from the block base (12,558,000); percentile intervals at 2.5 % / 97.5 % on
  **LEVELS** (a census publishes partitions per arm; there is no contrast of record and no Δ).
  **ZERO stats are consumed.**
* **THE BLOCK**: **12,558,000–999**, verified FRESH against every consumed block of record
  (LN-C0 12,544,000–999 … DS-T1c 12,556,000–999 · **DS-T1d 12,557,000–999**), each checked to end
  BELOW this block's base. Battery seeds `12,558,000–12,558,998`; **construction receipt
  `12,558,999`**. BOOKED = WALKED: **999 seeds × 4 arms + 4 receipt walks = 4,000 walks booked**.
  ⛔ **NEVER A SIM SEED ≥ 12,559,000** — a stored invariant with a fixture that proves a sim seed
  one past the ceiling WOULD be caught.
* **THE RE-WALKS** `12,557,000–002` are **DS-T1d's OWN consumed band** and are **NOT a
  consumption** (canon: *"verifier scratch walks use the stage's own consumed band or the
  out-of-band scratch range (≥ 900,000,000) — never the next virgin block"*). `gRepro` compares
  **field for field** against DS-T1d's stored `perSeedCells[]` on **all three E13 arms**, reading
  its artifact **IN PLACE at its `.RED.json` path** (never moved).
* **SCRATCH, all inside the DECLARED BAND `900,008,000–099`, derived from ONE base**: the sizing
  smoke `000–011`, the smoke receipt `020`, the world pin `070`, the lockstep pair (X-DET and
  `gPullCount` re-use it) `090–091`, the fixtures' attribute draw `099`. ⛔ **The verifier's band
  `900,008,100–199` is NOT this executor's** and is asserted DISJOINT from every seed walked here.
* **ZERO stats**: `stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 86 }`. ⛔ No new
  engine-ledger read is registered: every ledger this census joins on (`pendingPass`,
  `lastCompletedPass`, `stats.interceptions`, `shotLog` / `pendingShot`, `stats.overlaps`,
  `stats.oneTwos`, `pcLatency.ledger`) is already registered by DS-C0 / DS-T1 / DS-T1d.
* **THE SIZING FORM** (the house form): `se(n) = hw(n)/z.975` · `se(needed) = |target|/(z.975 +
  z.80)` · `N = ceil(n · (se(n)/se(needed))²)` · `MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975`,
  at a **declared 0.05 half-width** on **the arm of record's in-flight run share** and on **the
  hats'**. **N = min(nRequired, the block's affordance) IS TAKEN AS THE AFFORDANCE** — the #414
  §CORR 8 FLOOR READING — and §DEVIATIONS says so.

### §P.I THE GATE SET (frozen ex ante) — TWENTY-ONE

`gWorld` · `gRepro` · `gPullCount` · `gLockstep` · `gDeterminism` · `gFingerprintProd`
(X-FP-PROD) · `gSrcUntouched` · `gSeedsBookedEqualWalked` · `gSeedDisjoint` · `gN` ·
`gScratchBand` · `gTwoFractions` · `gAnchoredConstants` · `gPredicateFixtures` · `gLedgerRead` ·
`gClassesNonVacuous` · `gCodeFactGraph` · **`gBite`** · `gFaces` · `gHashOrder` · `gStage`.

⭐⭐⭐ **`gBite` IS IN THE #414 FAMILY-NOTE ROW FORM**, quoted VERBATIM from DS-T1d §COMMANDER
CORRECTIONS 8: *"a liveness receipt for a switch whose effect is a RARE EVENT compares the
per-seed ROW (any stored field), not the full-time signature — a full-time state snapshot is not
a trajectory hash and a hat's whole effect can be absorbed before the whistle. The next exam that
inherits `gBite` states its liveness on the row and keeps the signature comparison as a printed
face."* Here: on every seed where the CONTROL (`OWN-E13`) issued at least one cooperation hat
(`overlapSets + wallFires > 0`), the `OWNCOOP-E13` and `OWN-E13` **per-seed ROWS** must differ in
at least one stored field; **the full-time signature comparison is a PRINTED FACE and gates
NOTHING**. ⚠ LIVENESS ONLY.

⛔ **EVERY GATE IS A LIVENESS OR A RECEIPT. NOT ONE GATES A DIRECTION.**

## §DEV-PREFLIGHT — the disclosed smoke, IN FULL (before the freeze)

Two scratch runs, both **inside the declared band `900,008,000–099`**, both with the artifact
routed **OFF every canonical path** by the instrument's own override guard.

### 1. A 2-SEED SHAKE-OUT (`900,008,000–001`, four arms) — three defects found and FIXED

Reproduced by
`IFC0_MODE=smoke IFC0_N=2 IFC0_OUT=/tmp/if-c0/shakeout.json npx tsx scripts/probes/if-c0-flight-run-census.ts`.
**Four gates were RED on it and all four were fixed at §P-consistent points, BEFORE the freeze:**

1. ⭐⭐⭐ **A FIELD-NAME COLLISION WITH THE INSTRUMENT `gRepro` REPRODUCES.** This census's own
   per-episode fields were named `epTickBins` / `epActiveAtFullTime` / `epShots` / `epGoals` —
   names DS-T1d's stored row **also carries, with a DIFFERENT MEANING** (its HAT-episode family,
   indexed by hat class). `gRepro` compares the INTERSECTION of the two key sets **BY NAME**, so
   it read **RED on 9 of 9 arm-seed rows**. FIXED by renaming this census's four fields to
   `runEpTickBins` / `runEpActiveAtFullTime` / `runEpShots` / `runEpGoals`; the compared field
   set went **79 → 75** and `gRepro` went GREEN. ⭐ **THE LESSON**: *a field-for-field
   reproduction gate compares NAMES, so a field name is a CONTRACT with the instrument you
   reproduce — unit-name truth applies across instruments, not only inside one.*
2. **THE SEED-CEILING INVARIANT WAS WRITTEN OVER THE WRONG LATTICE.** #415 item 6's hard floor —
   ⛔ never a seed ≥ 12,559,000 — was asserted over **every** seed the instrument touches,
   including the out-of-band scratch band (≥ 900,000,000), so it fired on the scratch seeds
   themselves. FIXED by stating the invariant over the **SIM-SEED lattice** (`< 900,000,000`),
   with a fixture proving that a SIM seed one past the ceiling WOULD be caught and a second
   proving the scratch band is not on that lattice.
3. ⭐⭐ **`gClassesNonVacuous` REQUIRED TWO CELLS NON-ZERO ON EVERY ARM, AND THAT REQUIREMENT WAS
   WRONG AND IS WITHDRAWN.** It asked for `epInFlightOwnSidePass` (in-flight starts on his side's
   OWN pass) and for the **NEGATIVE half of the Δt histogram** to be live on all four arms. On
   the SHIPPED arms those may be **STRUCTURALLY zero**: with no carrier the shipped licence fires
   only at a RESTART, a live CORNER CRASH or a live CROSS FLIGHT, so a run started inside the
   flight of an ordinary pass has **no candidate to attach to at all**. Gating on them would
   **gate a direction on this census's own finding**. The gate now requires them only on the arms
   carrying `dsOwnRun` — where the leak and its anatomy live — and the zeros are **ENUMERATED**
   per arm in `emptiness.inFlightStartsOnHisSidesPass` / `emptiness.negativeDeltaT`. (This is
   DS-T1d's own §DEV-PREFLIGHT lesson, recurring: a liveness gate must never stand on a rare
   event whose zero is a measurement.)
4. **`gSeedDisjoint` shared defect 2's cause** and went green with it.

⭐ **WHAT THE SHAKE-OUT ALSO PROVED, BEFORE THE FREEZE**: the ONE ADDED READ IS INERT.
`gLockstep` is GREEN on all 8 arm × scratch walks and `gPullCount` records added pulls
**`0 / 84 / 84 / 0`** across `HATS-E13` / `OWN-E13` / `OWNCOOP-E13` / `D13` — zero on the arms
without the flag, positive on the arms with it, signatures byte-identical either way.

### 2. THE SIZING SMOKE OF RECORD — 12 seeds `900,008,000–011`, four arms, **21/21 GATES GREEN**

Reproduced by
`IFC0_MODE=smoke IFC0_N=12 IFC0_OUT=/tmp/if-c0/preflight.json npx tsx scripts/probes/if-c0-flight-run-census.ts`.

**THE TWO SIZED FACES, as the smoke measured them** (`run.inFlightShare` — the in-flight share of
all run episodes):

| face | value | half-width | numerator / denominator |
| --- | --- | --- | --- |
| `run.inFlightShare@OWNCOOP-E13` (the arm of record) | 0.097252 | **0.017440485729238224** | 92 / 946 |
| `run.inFlightShare@HATS-E13` (the hats') | 0.031836 | **0.008186650915534555** | 56 / 1,759 |

**THE SIZING ROWS THE FROZEN INSTRUMENT CARRIES** (`hwSmoke` transcribed from the table above;
every other column is DERIVED in code and re-derived off the serialized artifact by `gFaces`):

| face | hwSmoke | seSmoke | seNeeded | nRequired | hw @ N=999 | MDE @ N=999 | resolvable |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `run.inFlightShare@OWNCOOP-E13` | 0.017440485729238224 | 0.008898370514359730 | 0.017847038768172088 | **3** | 0.001911465461333533 | 0.002732261114819518 | yes |
| `run.inFlightShare@HATS-E13` | 0.008186650915534555 | 0.004176939464250269 | 0.017847038768172088 | **1** | 0.000897251413290905 | 0.001282536983452104 | yes |

⇒ **N = min(nRequired, the block's affordance) IS TAKEN AS THE AFFORDANCE, 999** — the #414
§CORR 8 FLOOR READING, walked and said plainly. Both sized rows resolve far below it; the block
is walked WHOLE because the populations this census must not report as vacuous — the negative Δt
half, the leak's own cells, the in-flight starts on a side's own pass — are **RARE EVENTS sized
by nothing**, and only volume makes them non-empty. §DEVIATIONS records it.

### 3. ONE ZERO CELL CHECKED AGAINST AN INDEPENDENT WALKER, BEFORE THE FREEZE

The smoke printed `receiver.classShare.startedDuringTheFlight` = **0.000000 on all four arms**. A
zero on a read-bearing cell is checked, not assumed: a **throwaway probe with its own code**
(scratch seeds `900,008,000–005`, `dsOwnRun` + `dsHatsOff`) counted **464 flights, 269
completions, 11 flights with ANY same-side run start during them, 0 receivers among those
starters, 39 receivers already running at the release** — and recorded the receiver's own action
at arrival as **`Dribble` 266 / `MakeRun` 2 / `ReceivePass` 1**. The zero is an **engine fact**
(the arriving body is handed the carry action, and the intended receiver does not answer a
travelling ball with a `MakeRun`), not an instrument defect. The cell is published with its
**enumerated emptiness**, never imputed.

⚠ The smoke's own numbers are **NOT results**: they are scratch seeds, disclosed only so the
sizing and the pre-freeze fixes are auditable, and **no partition is read on them**.

## §R RESULTS (every number below QUOTES the artifact's own fields at the six decimals the instrument itself prints — the artifact is the numbers of record, per the #357 standing order)

**RUN RECEIPTS.** Freeze **`b7136fb`**.
`git diff b7136fb -- scripts/probes/if-c0-flight-run-census.ts` is **EMPTY (0 bytes)** — no frozen
constant, no frozen definition, no frozen bin edge and no frozen question moved after sight; §0,
§P and §DEV-PREFLIGHT were not edited. **`allGreen` = true** (a STORED boolean; **21** gate
objects, every one `ok: true`), so the artifact sits at its **CANONICAL path**
`docs/world-model/data/if-c0-flight-run-census.json` (**17,510,179 bytes**),
`fileSha256 = 7f80d982f7182ecbf8e5283e60460f5f5404731219f82ebfbde0fd35b0c1d9e8`,
`hashedBodySha256 = 936b7d7124db08019a189486a8dc5b5c9866e33856d39447c53bf55532277fe8`,
`stage.instrumentSha256 = 37f5ad841a769767894201ea7e32eb0e986282ed7984650cb104e8c2922d8c93`,
`receipts.hashReproducesFromFile` = **true**. `gFaces` re-derived **1,324/1,324** face checks and
**185/185** bin / median / top-bin-share / PARTITION / QUESTION-BLOCK / sizing / `gBite` checks
off the SERIALIZED artifact. Battery **999 seeds (12,558,000–12,558,998) × 4 ARMS + the
construction receipt at 12,558,999 ⇒ BOOKED = WALKED = 4,000 walks**; `seeds.unwalkedTail` =
**null** — **the block is consumed WHOLE**. Scratch: the sizing smoke on 900,008,000–011 (receipt
900,008,020), the world pin at 900,008,070, the lockstep pair at 900,008,090–091, the fixture
draw at 900,008,099 — every one STORED in the `seeds` block, and the verifier's
900,008,100–199 asserted DISJOINT. **ZERO stats consumed** — registry **86**, `nextBase`
**117,600**. `npm run typecheck` clean with the probe in the tree; **X-FP-PROD recomputed
IN-PROCESS** = `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — the literal of
record, **UNCHANGED**. Wall **606.220 s** (`perf.meanWallSecondsPerMatch` **0.126704**, ⚠ a
machine reading on one machine carrying other work).
**`gRepro` GREEN — 75 fields × 9 arm-seed rows, ZERO mismatches**: all three E13 arms re-walked
on DS-T1d's own consumed band 12,557,000–002 and compared field for field against its stored
`perSeedCells[]`, read IN PLACE at its `.RED.json` path. **The whole-match SIGNATURE is one of
the 75 compared fields**, so these three arms ARE DS-T1d's three arms.
**THE PULL RECEIPT**: `perceived.pullsPerMatch` **0.000000 / 84.009009 / 80.716717 / 0.000000**
across `HATS-E13` / `OWN-E13` / `OWNCOOP-E13` / `D13`; `pullsTotal` equals
`stampedRunStartsTotal` **exactly** on all four arms (83,925 and 80,636 on the two armed ones),
and `gLockstep` is GREEN on all 8 arm × scratch walks — **the added read is counted and inert**.

### §R1 Q1 — THE RUN-START STATE PARTITION, AND WHAT THE IN-FLIGHT SHARE IS MADE OF

**RUN EPISODES PER MATCH**: `HATS-E13` **144.196196** · `OWN-E13` **84.009009** ·
`OWNCOOP-E13` **80.716717** · `D13` **187.884885**.

**THE START-STATE PARTITION** (share of all run episodes):

| arm | a mate on the ball | **the ball IN FLIGHT** | his side's own restart | other |
| --- | --- | --- | --- | --- |
| `HATS-E13` | 0.777011 | **0.027587** (3,974 / 144,052) | 0.195311 | 0.000090 |
| `OWN-E13` | 0.767638 | **0.081442** (6,835 / 83,925) | 0.150670 | 0.000250 |
| **`OWNCOOP-E13`** | 0.761149 | **0.083077** (6,699 / 80,636) | 0.155588 | 0.000186 |
| `D13` | 0.845874 | **0.017619** (3,307 / 187,697) | 0.136374 | 0.000133 |

⚠ The realised half-width on `run.inFlightShare` is **0.002130** on the arm of record and
**0.001148** on the hats' (§DEV-PREFLIGHT declared a 0.05 target).

**OF THOSE IN-FLIGHT STARTS, WHOSE ARE THEY** (the split #415 item 6's Q1 asks for):

| arm | the SIX coach-hat classes | the OWN RUN |
| --- | --- | --- |
| `HATS-E13` | **0.027587** (3,974 / 144,052) | — (the class is EMPTY on this arm, ENUMERATED) |
| `OWN-E13` | **0.192476** (4,042 / 21,000) | **0.044386** (2,793 / 62,925) |
| **`OWNCOOP-E13`** | **0.236947** (3,930 / 16,586) | **0.043232** (2,769 / 64,050) |
| `D13` | **0.017619** (3,307 / 187,697) | — (EMPTY, ENUMERATED) |

**THE IN-FLIGHT STARTS BY `why` CLASS** (the share of that class's own episodes that start in
flight), which is where the **three existing licences** show themselves:

| `why` class | `HATS-E13` | `OWN-E13` | `OWNCOOP-E13` | `D13` |
| --- | --- | --- | --- | --- |
| `licensedRunInBehind` | **0.000000** | 0.000000 | 0.000000 | **0.000000** |
| `attackingTheBox` | **0.112809** | 0.220124 | 0.215304 | **0.101862** |
| `arrivingLate` | **0.054550** | 0.613662 | 0.618523 | **0.045949** |
| `ownRunInBehind` | — | **0.044386** | **0.043232** | — |

⭐ `licensedRunInBehind` starts **with a mate on the ball 1.000000 of the time on every arm** —
a STORED share, not a claim: its own clause requires a carrier. On `HATS-E13` `attackingTheBox`
starts **0.883492** at the side's own restart and **0.112809** in flight, which is the corner
crash and the cross-flight clauses showing up as episodes.

**THE IN-FLIGHT PROVENANCE**, off `match.pendingPass` (share of in-flight run starts):

| arm | his side's pass | the other side's pass | NO pending pass (loose / cleared) |
| --- | --- | --- | --- |
| `HATS-E13` | 0.154504 (0.614615 /match) | **0.000000** | 0.845496 (3.363363 /match) |
| `OWN-E13` | 0.471836 (3.228228 /match) | **0.000000** | 0.528164 (3.613614 /match) |
| **`OWNCOOP-E13`** | 0.472608 (3.169169 /match) | **0.000000** | 0.527392 (3.536537 /match) |
| `D13` | 0.185969 (0.615616 /match) | **0.000000** | 0.814031 (2.694695 /match) |

⛔ **`theOtherSidesPass` IS EXACTLY ZERO ON ALL FOUR ARMS** and is ENUMERATED in
`emptiness.provenances` — the `ballInFlight` state itself requires possession to be HIS side, so
the cell is empty **by the classifier's own construction**, not by measurement. Stated, not read.
On the own-run arms the leaked own run's own provenance is **0.906910 / 0.895630** his side's
pass and **0.093090 / 0.104370** no pending pass at all.

**THE TRUTH FLIGHT AGE** at an in-flight start (bin-derived median, 0.1 s cells, top-bin share
beside it): `HATS-E13` **0.200000** (top bin 0.000000) · `OWN-E13` **0.400000** (0.000000) ·
`OWNCOOP-E13` **0.400000** (0.000000) · `D13` **0.200000** (0.000000).

### §R2 Q2 — THE LEAK, AS A PARTITION

**OWN RUNS STARTED WITH THE TRUTH BALL IN FLIGHT**: **2.795796 per match** (`OWN-E13`) and
**2.771772 per match** (`OWNCOOP-E13`).

| cell | `OWN-E13` | `OWNCOOP-E13` |
| --- | --- | --- |
| `stalePasserStillCredited` (an **EYES** reading) | **0.906910** (2,533 / 2,793) · 2.535536 /match | **0.894186** (2,476 / 2,769) · 2.478478 /match |
| `aFreshMateWhoIsNotThePasser` (a **CLASSIFIER-BOUNDARY** reading) | **0.093090** (260 / 2,793) · 0.260260 /match | **0.105814** (293 / 2,769) · 0.293293 /match |
| `anythingElse` | **0.000000** (0 / 2,793) | **0.000000** (0 / 2,769) |

⛔ **A PARTITION. NO VERDICT WORD IS WRITTEN ON IT and none should be read in.**

**THE STALE-OWNER LEAK AT EVERY STAMPED RUN START**, by TRUTH state:

| arm | all stamped starts | a mate on the ball | **the ball IN FLIGHT** | his own restart |
| --- | --- | --- | --- | --- |
| `OWN-E13` | 0.048472 (4,068 / 83,925) | 0.020272 (1,306 / 64,424) | **0.397952** (2,720 / 6,835) | 0.003321 (42 / 12,645) |
| `OWNCOOP-E13` | 0.050598 (4,080 / 80,636) | 0.021702 (1,332 / 61,376) | **0.402597** (2,697 / 6,699) | 0.004065 (51 / 12,546) |

**THE PERCEIVED BALL'S OWN AGE** (`ObservedBall.ageTicks`, bin-derived median at a 3-tick bin
width, top-bin share beside it): over **ALL** stamped run starts the median is **0** ticks (top
bin 0.000000) on both armed arms; over the **LEAKED in-flight OWN runs** it is **33** ticks
(top bin 0.000000) on both. The leaked runs' own TRUTH flight age median is **0.400000** s.

**THE PERCEIVED OWNER CELL** over all stamped starts (`OWNCOOP-E13`): `ownerIsMate` **0.795972**
· `ownerNull` **0.177849** · `noBallSeen` **0.025423** · `noSnapshot` **0.000756** ·
`ownerIsSelf` **0.000000** · `ownerIsOpponent` **0.000000** (the last two ENUMERATED as empty).
⚠ On the **OWN RUN** the cell is `ownerIsMate` **1.000000** on both armed arms — **that is
M-DS.7's own construction, a RECEIPT and not a finding**: the candidate is only pushed when the
eyes hold a mate on the ball.

### §R3 Q3 — THE YIELD BY START STATE, AND THE INTENDED-RECEIVER SHARE

**PRINTED BESIDE EACH OTHER, BOTH FRACTIONS, ⛔ NO VERDICT WORD** (`OWNCOOP-E13`, the arm of
record; the other three arms are stored):

| start state | episodes /match | aimed /episode | completed /episode | shots /episode | goals /episode |
| --- | --- | --- | --- | --- | --- |
| a mate on the ball | 61.437437 | 0.315433 | 0.130800 | **0.045050** | 0.014240 |
| **the ball in flight** | 6.705706 | 0.177937 | 0.083744 | **0.020302** | 0.022391 |
| his side's own restart | 12.558559 | 0.375578 | 0.173521 | **0.123705** | 0.046788 |
| other (counted) | 0.015015 | 0.266667 | 0.200000 | 0.133333 | 0.066667 |

**THE SAME SPLIT INSIDE ONE `why` CLASS** — the own run, where both cells are live:

| arm | `ownRunInBehind` at a mate's feet | `ownRunInBehind` in flight |
| --- | --- | --- |
| `OWN-E13` | shots 0.045514 (2,735 / 60,092) · aimed 0.320059 | shots 0.020408 (57 / 2,793) · aimed 0.207304 |
| `OWNCOOP-E13` | shots 0.045124 (2,763 / 61,231) · aimed 0.315641 | shots 0.021307 (59 / 2,769) · aimed 0.221741 |

⚠ The two populations differ in far more than the start state (an in-flight start is by
construction a body whose side has just lost the ball to the air), the yield windows OVERLAP, and
**the in-flight cell is ~2 % of the at-feet cell's size**. ⛔ This is a census.

⭐⭐⭐ **THE INTENDED-RECEIVER SHARE IS EXACTLY ZERO ON EVERY ARM.** Among in-flight run starts on
**his own side's pass**, the runner is the pass's `targetGid` — the ENGINE'S OWN FIELD —
**0 / 614** (`HATS-E13`), **0 / 3,225** (`OWN-E13`), **0 / 3,166** (`OWNCOOP-E13`),
**0 / 615** (`D13`). `flight.intendedReceiverShare` = **0.000000** on all four, on both the
coach-hat subset and the own-run subset. The flight is coming **TOWARD** him on **0.017915**
(11 / 614) · **0.114729** (370 / 3,225) · **0.117814** (373 / 3,166) · **0.045528** (28 / 615).

**THAT FLIGHT'S OWN OUTCOME**, off the engine's own records (share of resolved in-flight starts):

| arm | receivedByAMate | intercepted | outOrDeadBall | looseOrExpired | liveAtFullTime |
| --- | --- | --- | --- | --- | --- |
| `HATS-E13` | 0.669381 | 0.166124 | 0.157980 | 0.006515 | 0.000000 |
| `OWN-E13` | 0.574264 | 0.344186 | 0.074109 | 0.007442 | 0.000000 |
| `OWNCOOP-E13` | 0.578332 | 0.344915 | 0.067593 | 0.009160 | 0.000000 |
| `D13` | 0.707317 | 0.170732 | 0.118699 | 0.003252 | 0.000000 |

`liveAtFullTime` is **0.000000** on all four and is ENUMERATED; `looseOrExpired` is the
**DECLARED RESIDUAL** (`gLedgerRead`).

### §R4 Q4 — THE TIMING FACT

**THE Δt HISTOGRAM** (share of BINNED run episodes; NEGATIVE = the run started onto a ball
ALREADY TRAVELLING):

| arm | −∞..−1.0 | −1.0..−0.5 | −0.5..0 | 0..0.5 | 0.5..1.0 | 1.0..2.0 | 2.0+ | **NEGATIVE** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `HATS-E13` | 0.000000 | 0.000148 | 0.004116 | 0.399409 | 0.066701 | 0.117736 | 0.411890 | **0.004264** (605 / 141,902) |
| `OWN-E13` | 0.000012 | 0.002605 | 0.036265 | 0.429487 | 0.055264 | 0.079025 | 0.397342 | **0.038882** (3,209 / 82,531) |
| **`OWNCOOP-E13`** | 0.000013 | 0.002622 | 0.037084 | 0.418993 | 0.054706 | 0.076652 | 0.409930 | **0.039719** (3,151 / 79,333) |
| `D13` | 0.000000 | 0.000097 | 0.003164 | 0.425701 | 0.081996 | 0.105136 | 0.383906 | **0.003261** (604 / 185,217) |

**THE ATTACHMENT**: `dt.attachedLiveShare` 0.004262 / 0.038427 / 0.039263 / 0.003277;
`dt.attachedNextShare` 0.980812 / 0.944963 / 0.944578 / 0.983511;
`dt.noAttachedReleaseShare` 0.014925 / 0.016610 / 0.016159 / 0.013213 (COUNTED, never binned).
`dt.binnedEpisodesPerMatch` 142.044044 / 82.613614 / 79.412412 / 185.402402.
The `−∞..−1.0` bin is EMPTY on `HATS-E13` and `D13` and is ENUMERATED.

**Δt BY START STATE** (`OWNCOOP-E13`): a mate on the ball 0.000000 · 0.000000 · 0.000000 ·
0.550000 · 0.069983 · 0.062322 · 0.317695; **the ball in flight** 0.000154 · 0.032069 ·
**0.453592** · 0.009405 · 0.017576 · 0.031452 · 0.455751; his own restart 0.000000 · 0.000000 ·
0.000000 · 0.000319 · 0.000479 · 0.169033 · 0.830169.

⭐⭐⭐ **THE EVENTUAL RECEIVER OF A COMPLETED PASS** — the histogram the IF contract's REALITY
audit will be written against:

| arm | completed releases /match | **already running at the release** | **started during the flight** | neither | the intended receiver took it |
| --- | --- | --- | --- | --- | --- |
| `HATS-E13` | 47.231231 | **0.264051** (12,459 / 47,184) | **0.000021** (1 / 47,184) | 0.735927 | 0.891913 |
| `OWN-E13` | 46.522523 | **0.151799** (7,055 / 46,476) | **0.000043** (2 / 46,476) | 0.848158 | 0.890739 |
| `OWNCOOP-E13` | 46.655656 | **0.146066** (6,808 / 46,609) | **0.000021** (1 / 46,609) | 0.853912 | 0.888734 |
| `D13` | 52.520521 | **0.316612** (16,612 / 52,468) | **0.000000** (0 / 52,468) | 0.683388 | 0.899729 |

On the **INTENDED receiver only**, `startedDuringTheFlight` is **0.000000** on all four arms.
`D13.startedDuringTheFlight` is ENUMERATED as empty. ⚠ §DEV-PREFLIGHT records that this cell was
checked against an INDEPENDENT walker before the freeze.

**THE RELEASE ITSELF**: `release.perMatch` 80.192192 / 79.192192 / 78.654655 / 88.773774;
same-side outfield bodies **already running at the release** (mean) 1.176840 / 0.666641 /
0.644204 / 1.283532, binned 0 · 1 · 2 · 3 · 4+ as
`HATS-E13` 0.304499 · 0.290219 · 0.330288 · 0.073934 · 0.001061 and
`OWNCOOP-E13` 0.553439 · 0.307817 · 0.084301 · 0.049990 · 0.004454;
run starts **during** the flight per release 0.007664 / 0.040764 / 0.040292 / 0.006935, of which
on the armed arms almost all are the own run (`ownRunInBehind` 0.032017 / 0.031562 per release,
`arrivingLate` 0.006649 / 0.006911, `licensedRunInBehind` **0.000000** on every arm);
flight ticks per release 66.719181 / 67.261006 / 67.472778 / 59.378373.

### §R5 THE CODE MAP (⛔ it describes; it designs nothing)

**THE CORPUS**: 71 files under `src/sim` + `src/ai`, **581** extracted function spans; the SIX
roots' EXTRACTED closure holds **240** spans at depth **6**, **uncapped**.

**THE SIX ROOTS, HASHED WHOLE AT THIS HEAD AND COMPARED TO NOTHING BANKED:**

| span | sha256 |
| --- | --- |
| `src/ai/PlayerBrain.ts:1925-2371:decideOffBall` | `5c27025e3f4561b016d7f876a4e4d845978b81cdedff135cf378b320d98a73be` |
| `src/ai/PlayerBrain.ts:166-1814:decideCarrier` | `101566955a4b414251e14d403863a8bdf4b042e5fbdc91613d358b187292836b` |
| `src/ai/TeamBrain.ts:240-438:assignRunners` | `77b0d79c36cc8932c2dfc267500ae30d50e47a626f84e7d6074b6087cd7ba5b5` |
| `src/sim/mechanics.ts:234-256:registerPass` | `fec4516775e0a2eb228e2a48f73536434d9f5aeab5e69a253db613bfca2119e2` |
| `src/sim/mechanics.ts:355-454:performPass` | `1ff0dda909a3bb644c1fa087e3f609fc8ddf22749f6ed370d2ad3af65e9e4ac8` |
| `src/ai/actionExecutor.ts:123-1459:executeAction` | `b0f3979e9f37123ad46bd8c752642e1db42573078290a48ff6011cf903b0d629` |

⭐⭐⭐ **THE THREE IN-FLIGHT LICENCES THAT EXIST TODAY.** The clause is at
`PlayerBrain.ts:2080`, inside `decideOffBall` (ASSERTED, not declared):

| licence | the clause's term | its source | defined at | the field declared at | its door |
| --- | --- | --- | --- | --- | --- |
| the CORNER CRASH | `crashLive` | `team.cornerCrash` | `PlayerBrain.ts:2073` | `Team.ts:82` | — |
| the CROSS FLIGHT | `crossLive` | `team.crossFlight` | `PlayerBrain.ts:2078` | `Team.ts:102` | **`match.c4Arrival`** |
| the RESTART | `match.phase === 'restart'` | `match.phase` | `PlayerBrain.ts:2080` | `Match.ts:1409` | — |

**THE OWN-RUN FORK'S M-DS.7 GUARD** — `PlayerBrain.ts:2213–2262`, whole-text sha
`1b6c72b1cee4093812a0dee98e796aca0b492c9b9f1a20a9a528e9c2644c0500`. DERIVED from that whole
text: it **READS** `snapshot.ball.ownerGid` (**true**); it does **NOT** read `ageTicks`
(**false**), does **NOT** read any `.vel` (**false**), does **NOT** read `pendingPass`
(**false**). Its complete `match.` member set is exactly **`match.dsOwnRun` ·
`match.perceivedSnapshot` · `match.simTime`**.

**`PendingPass`** (`Match.ts:281`, sha `7fa5c5fdef3b1b2cc7d1ed3638c70051c9c43c6c22cf9856da0f7966086b29a3`)
carries **`side · passerGid · targetGid · t · offside · offsideSpot · bounce`** ⇒ **the engine
HAS a receiver field, `targetGid`**, so #415 item 6(3)'s first-touch fallback is **NOT
implemented** and would be dead code.

**`ObservedBall`** (`perceptionSnapshot.ts:34–39`, sha
`12026050b3a5658ac843b301821013a465536d1aa8bb25ef62e8f673f73176b3`) carries **`pos · vel ·
ownerGid · observedTick · ageTicks`** ⇒ `aPerceivedFlightIsRepresentable` = **true**
(`ownerGid` null WITH a non-zero `vel`). ⛔ DESCRIPTIVE ONLY.

**THE THREE ACTION-TYPE READS**, each resolving to exactly one line and one enclosing span:
`throughBallRunnerScan` `PlayerBrain.ts:943` in `decideCarrier` · `thirdManBonus`
`PlayerBrain.ts:680` in `decideCarrier` · `registerPassBounce` `mechanics.ts:245` in
`registerPass`.

### §R6 THE FAMILIES PRINTED BESIDE, FOR CONTINUITY (⛔ not this census's subject)

| face | `HATS-E13` | `OWN-E13` | `OWNCOOP-E13` | `D13` |
| --- | --- | --- | --- | --- |
| `r1.runsPerInPossessionTick` | 0.583337 | 0.254625 | 0.243869 | 0.645085 |
| `offBall.makeRunShare` | 0.164613 | 0.078260 | 0.075869 | 0.176191 |
| `board.openPlayEmptyShare` | 0.101506 | 0.999912 | 1.000000 | 0.098071 |
| `runCount.mean` | 1.504872 | 0.193458 | 0.192269 | 1.503474 |
| `crowd.crashShare` | 0.437353 | 0.439817 | 0.439305 | 0.469002 |
| `guard.spacingUnder4` | 0.069135 | 0.071860 | 0.072090 | 0.081303 |
| `guard.goalsPerMatch` | 3.223223 | 3.412412 | 3.524525 | 2.614615 |
| `guard.throughBallsPerMatch` | 5.857858 | 5.334334 | 5.430430 | 7.183183 |
| `calib.postStepOverLedger` (debt (a)) | 1.000000 | 1.000000 | 1.000000 | 0.999999 |
| `context.shotJoinShare` | 0.995279 | 0.995691 | 0.995600 | 0.992304 |
| `context.goalRowJoinShare` (debt (b)) | 0.999672 | 1.000000 | 1.000000 | 0.999596 |

**DS-T1's OWN PER-STATE LINE, RE-MEASURED ON THIS BLOCK** over run DECISIONS (its own
denominator, not this census's episodes) — `state.hatRunShare` on `HATS-E13`: a mate on the ball
**0.517224** · the ball in flight **0.080347** · his side's own restart **0.399511** · other
0.002918. ⭐ Beside DS-T1's shipped-path `0.518517 · 0.080620 · 0.397269`, quoted from its own
artifact at §0 — **a different block and a different composition; no verdict word is written on
the comparison.** `state.ownRunShare` on `OWNCOOP-E13`: 0.877609 · **0.119396** · 0.001181 ·
0.001814, beside DS-T1d's own `0.120532`.

**`gBite`, THE #414 ROW FORM**: on **998 of 999** seeds the control `OWN-E13` issued at least one
cooperation hat (1 seed EXEMPT and named), and on **998 of 998** the two arms' per-seed ROWS
differ in at least one of **117** stored fields. **THE PRINTED FACE**: the FULL-TIME SIGNATURE
coincides on **31** of those 998 eligible seeds (967 differ) — a full-time state snapshot is not
a trajectory hash, which is exactly why the liveness is stated on the ROW.

### §R7 在说人话的层面

**在这台引擎里，跑动几乎不是冲着飞行中的球去的。**

* **球在飞的时候才起跑，本来就少。** 出厂的世界（`HATS-E13`）里，一次跑动开始时球正在空中的比例
  是 **0.027587**；而且这些里面 **0.845496 根本没有传球在飞**——那是散球、解围球，不是谁传的。
  真正"我方有一脚球在空中"的起跑，一场只有 **0.614615** 次。
* **球员自己的前插把这个数抬高了，但抬高的是漏，不是设计。** 世界 17 的臂上，在飞时起跑占
  **0.083077**；其中球员自己那条（`own run in behind`）占它自己这一类的 **0.043232**——**每场
  2.771772 次**。这些跑动里，**0.894186 是"眼睛还把球算在传球人脚下"**（眼睛慢了），
  **0.105814 是"眼睛看到的是另一个队友持球"**（分类边界）。眼睛有多慢？这些跑动读到的球，年龄
  中位数是 **33** 个 tick；而所有被盖章的起跑，中位数是 **0**。
* ⭐⭐⭐ **没有一次是"传给他的那一脚"。** 我方一脚球在空中、而他此刻起跑——这样的样本
  `OWNCOOP-E13` 有 **3,166** 次，其中他是 `pendingPass.targetGid` 的次数是 **0**。四条臂都是 0。
  球朝他飞过来的只有 **0.117814**。
* ⭐⭐⭐ **传球到达时，接球的那个人几乎从来不是"球飞出去之后才起跑"的人。** 出厂世界里一场
  **47.231231** 次传球到脚，其中 **0.264051** 的接球人在传球出脚那一刻已经在跑，**0.735927**
  两头都不沾，而"球飞出去之后才起跑"的是 **0.000021**——四万七千次里的 **1 次**。
* **时间轴上也是一样。** Δt 的负半边（跑在传之后）在出厂世界是 **0.004264**，在世界 17 是
  **0.039719**；正半边（先跑、后传）占了绝大多数。

⛔ 这一段没有一个褒贬词落在产出、耦合或假设的任何一张脸上。**这是一次普查，读数由指挥官在这张
表上写。**

## §HONEST LIMITS

**THE ONE HOME.** The artifact stores none of this list (`stage.honestLimitsNote`); its pointer
names THIS doc.

1. ⭐⭐⭐ **THE STALE-OWNER TEST MIXES TWO TICKS, BY CONSTRUCTION AND BY DECLARATION.** The pull is
   taken AFTER the step, so the snapshot is materialised from the **POST-STEP** truth and the
   stale test compares the perceived `ownerGid` against the **POST-STEP** truth owner; the TRUTH
   STATE printed beside it is the **PRE-STEP** one the brain actually read. The two are one tick
   (1/60 s) apart. Declared at §P.B before the battery; every stale-owner number inherits it.
2. **THE RUN-EPISODE DENOMINATOR IS NOT DS-T1's.** This census counts run EPISODES (a
   `MakeRun` start); DS-T1's `0.518517 · 0.080620 · 0.397269` counts run DECISIONS (a body-tick).
   §R6 prints this block's own decision-level line beside it for that reason, and **no verdict
   word is written on the comparison** — different block, different denominator.
3. **`theOtherSidesPass` IS EMPTY BY THE CLASSIFIER'S OWN CONSTRUCTION**, not by measurement: the
   `ballInFlight` state already requires possession to be HIS side. The cell is stored, gated on
   nothing, and enumerated.
4. **`looseOrExpired` IS A DECLARED RESIDUAL.** The engine keeps no record separating a ball
   running loose from the aim ledger's own 3.5 s expiry, so that outcome cell is what is left
   after the three record-backed cells. `gLedgerRead` stores the table; the cell is small
   (0.003252–0.009160 across the four arms' in-flight outcome partitions) but it is not a
   measurement of anything named.
5. **"ALREADY RUNNING AT THE RELEASE" INCLUDES A RUN THAT STARTS ON THE RELEASE TICK.** The
   release is read on the CURRENT run state at its own tick, so a body whose episode opens on
   that tick counts as already running, and `runningAtRelease` WINS over
   `startedDuringTheFlight` by the frozen precedence. Declared at §P.D; it can only move mass
   from the second cell to the first, and the second cell is 1 of 46,609 on the arm of record
   (0 of 52,468 · 1 of 47,184 · 2 of 46,476 on the other three).
6. **THE Δt ATTACHMENT RULE IS A CHOICE, FROZEN BEFORE THE BATTERY.** A run with a same-side
   flight already live attaches to THAT flight (negative); otherwise to the NEXT release
   (positive). A run that is genuinely unrelated to either is still binned against the next
   release, which is why `2.0+` carries 0.383906–0.411890 of the mass on every arm: **the top bin
   is a catch-all for "the next pass was a long time later", not a football fact**. The
   `noAttachedRelease` cell (0.013213–0.016610) is counted and never binned.
7. **THE PERCEIVED CELL ON THE OWN RUN IS A RECEIPT, NOT A FINDING.**
   `perceived.cellShare.ownRun.ownerIsMate` = 1.000000 is M-DS.7's own construction — the
   candidate exists only when the eyes hold a mate on the ball. It is stored so the pull can be
   seen to be reading the right body, nothing more.
8. **THE IN-FLIGHT YIELD CELL IS SMALL.** `yield.shotsPerEpisode.ballInFlight` stands on 6,699
   episodes on the arm of record against 61,376 at-feet episodes, the windows OVERLAP (one shot
   credits every open window of its own side), and the two populations differ in far more than
   the start state. **No verdict word is written on the pair.**
9. **THE INTENDED-RECEIVER ZERO IS A ZERO OVER A SMALL DENOMINATOR ON TWO ARMS.** It is
   0 / 3,225 and 0 / 3,166 on the armed arms but only 0 / 614 and 0 / 615 on `HATS-E13` and
   `D13`. All four are stored with their denominators.
10. **THE ADDED PERCEPT PULL IS INERT ON THE SCRATCH SEEDS IT WAS PROVEN ON.** `gLockstep`
    walks two out-of-band seeds per arm, not the battery block. The battery itself is never
    walked twice unobserved (that would double a 606.220 s run); the receipt is the lockstep pair
    plus X-DET's per-row byte identity.
11. **ONE BLOCK, ONE COMPOSITION.** Every number here is world 13 at THIS head, N = 999 seeds,
    the OBM seat ABSENT on every arm. `D13` takes the SHIPPED loaders' doses; it is not a second
    world.
12. **NO GATE MEASURES QUALITY.** Every one of the 21 is a liveness or a receipt. A green board
    says the instrument read what it said it would read; it says nothing about football.
13. **THE CODE MAP DESCRIBES ONE HEAD.** The six root hashes are stated at this head and
    compared to nothing banked; they will move the next time anything inside those functions
    moves, and that is not a defect.

## §DEVIATIONS (declared by the executor; the commander disposes)

1. **N = THE AFFORDANCE (999), NOT THE LITERAL `min()`.** #415 item 6 says *"N sized by a
   DISCLOSED 12-seed smoke at a declared 0.05 half-width … walk the affordance and say so (the
   #414 floor reading)"*. The two sized rows need **3** and **1** clusters; **this stage walked
   999**, which is the FLOOR #414 §CORR 8 ratified for this family. Reason: the populations this
   census must not report as vacuous — the negative Δt half, the leak's cells, the in-flight
   starts on a side's own pass, the receiver who starts during the flight — are RARE EVENTS
   sized by nothing, and only volume makes them non-empty (or honestly empty). Walking more can
   only narrow an interval, never widen one.
2. ⭐⭐⭐ **THE INSTRUMENT TAKES ONE READ DS-C0 AND DS-T1d DO NOT** — one `perceivedSnapshot` per
   stamped run-start tick, inside the arm's own flag. It is DECLARED at §P.B before the battery,
   COUNTED by `gPullCount` (observed − unobserved equals the row's own stored count; 0 on the
   arms without the flag, 83,925 and 80,636 on the arms with it) and PROVEN INERT by `gLockstep`.
   Without it there is no perceived stamp and Q2 cannot be answered at all.
3. **FOUR ARMS, NOT SIX.** #415 item 6 names `HATS-E13` · `OWN-E13` · `OWNCOOP-E13` with "D13
   beside"; this census walks ONE `D13` arm (world 13 dosed, no DS flag — DS-C0's own D13),
   giving 4,000 walks rather than DS-T1d's 6,000. The dispatch's "D13 beside" is read as the
   singular arm it names.
4. **`gRepro` RUNS ON THREE SEEDS, NOT TWELVE.** #415 item 6 asks for "≥ 3 of 12,557,000–011 for
   all three E13 arms"; this census re-walks 12,557,000–002 × 3 arms = 9 rows × 75 fields.
5. ⭐⭐ **THE COMPARED FIELD SET IS 75, NOT THE FULL ROW.** Four of this census's own
   per-episode fields were RENAMED before the freeze (`runEpTickBins` / `runEpActiveAtFullTime` /
   `runEpShots` / `runEpGoals`) because DS-T1d carries those four names with a DIFFERENT MEANING
   and `gRepro` compares BY NAME. §DEV-PREFLIGHT 1 discloses it in full.
6. ⭐⭐ **`gClassesNonVacuous` DOES NOT GATE TWO CELLS ON THE SHIPPED ARMS** — the in-flight
   starts on a side's own pass and the NEGATIVE half of the Δt histogram. Both are required on
   the arms carrying `dsOwnRun` and ENUMERATED elsewhere, because a zero there would be this
   census's own finding. Disclosed at §DEV-PREFLIGHT 3, fixed BEFORE the freeze.
7. **NO READ SENTENCE AND NO SELECTOR EXIST.** DS-T1d's `reads` block, its precedence ladder and
   its frozen literals are absent BY DESIGN: #415 item 6 says *"⛔ No read sentence is frozen for
   a census; the commander drafts the contract on the table."* The four QUESTION blocks replace
   them and are re-derived off disk by `gFaces`.
8. **THE BIN-DERIVED MEDIANS ARE PUBLISHED WITH THEIR TOP-BIN SHARES** (debt (c)); on this
   census every top-bin share is **0.000000** except the run-episode tick histogram's
   (0.144651–0.202858), so the medians are not floors — stored either way.
9. **THE FLIGHT-OUTCOME LADDER HAS A PRECEDENCE** (`receivedByAMate` > `intercepted` >
   `outOrDeadBall` > `looseOrExpired`), fixture-pinned, and a completion BEATS a dead ball on the
   same tick.
10. **THE ARTIFACT IS 17,510,179 BYTES** because `perSeedCells[]` carries 999 × 4 rows of 117
    fields. Compact JSON; the body hash is over the canonical body regardless.

## §GATES — 21 of 21 GREEN (`allGreen` = **true**, a STORED boolean)

| gate | ✅ | what it asserts (the NOTE derives from the same pinned values the gate checks) |
| --- | --- | --- |
| `gWorld` | ✅ | per arm, on every walked match AND the construction receipt: the world-13 gate with `bqCushion` TRUE and the world-14/15 doors ABSENT; `edsPerceivedChoice`; every OBM/CTB/RC/BF seam absent; **the three DS flags exactly as due**; ⛔ NO OBM dose anywhere; `info.genome` clean; plus the constructed world pin at 900,008,070 |
| `gRepro` | ✅ | **75 fields × 9 arm-seed rows, ZERO mismatches** — all three E13 arms re-walked on DS-T1d's own consumed band 12,557,000–002 against its stored cells, read in place at its `.RED.json` path. The whole-match SIGNATURE is one of the compared fields |
| `gPullCount` | ✅ | 8 spied pairs; observed − unobserved EQUALS the row's own stored `instrumentPulls` on every one; **0 added on the arms without `dsOwnRun`, positive on the arms with it**; signatures equal; the wrapper proven transparent against the unwrapped lockstep walk |
| `gLockstep` | ✅ | **the ONE added read is INERT**: observed ≡ unobserved whole-match signature on all 8 arm × out-of-band-scratch walks |
| `gDeterminism` | ✅ | X-DET twice per arm on two scratch seeds: signatures AND this instrument's own row bytes identical, 8 pairs |
| `gFingerprintProd` | ✅ | X-FP-PROD recomputed in-process = `57b0bdab…c673`, UNCHANGED |
| `gSrcUntouched` | ✅ | `git diff --stat HEAD` and `git status --porcelain` EMPTY over **src/ AND tests/** — X-SRC-ZERO |
| `gSeedsBookedEqualWalked` | ✅ | 999 distinct battery seeds inside 12,558,000–999 + the receipt at 12,558,999; **4,000 walks booked = walked**; the tail is `null`; every scratch seed out-of-band and STORED |
| `gSeedDisjoint` | ✅ | every battery seed ≥ 12,558,000; all FOURTEEN consumed blocks end below this base; the re-walks lie inside DS-T1d's own block; ⛔ **no SIM seed ≥ 12,559,000**; ZERO stats |
| `gN` | ✅ | no override env; the battery ran at exactly N_FROZEN = 999 × 4 arms; both sizing rows resolvable; `whichNWasTaken` says the AFFORDANCE plainly |
| `gScratchBand` | ✅ | all 17 scratch seeds derived from the ONE base 900,008,000 and inside [900,008,000, 900,008,099]; the out-of-band list EMPTY; **the verifier's 900,008,100–199 asserted DISJOINT**; disjoint from the battery block both ways |
| `gTwoFractions` | ✅ | 21 read-bearing quantities published in BOTH fractions |
| `gAnchoredConstants` | ✅ | **86** anchored sites, every one at its declared occurrence count — including the licence clause, its three in-flight terms, M-DS.7's guard and owner read, the ZERO-count negatives, `ObservedBall`'s fields, `PendingPass`'s `targetGid`, the three action-type reads and the seven `why` literals, every numeral PARSED from its own anchored line |
| `gPredicateFixtures` | ✅ | **120** fixtures, every walk-side predicate with a firing AND a non-firing case — the four states, the flight provenance, the six perceived cells, the stale-owner test **including the case that must NOT fire** (a perceived null owner is a perceived FLIGHT), **every Δt bin boundary from both sides**, the intended-receiver and toward-him tests, the outcome ladder's precedence, the receiver classifier, the leak partition, and the scratch/seed-ceiling arithmetic |
| `gLedgerRead` | ✅ | **12** faces read an ENGINE RECORD and **2** are DECLARED (the `looseOrExpired` RESIDUAL and the inherited crowding heuristic); ⭐ the intended-receiver test is a RECORD (`pendingPass.targetGid`), so the ruling's first-touch fallback is NOT implemented |
| `gClassesNonVacuous` | ✅ | every class a PARTITION stands on is live; the empty cells are ENUMERATED in `emptiness` (4 run classes, 4 provenances, 2 Δt bins, 2 perceived cells, 2 leak cells, 4 flight outcomes, 1 receiver class, 0 start states) and ⛔ two cells are deliberately NOT gated on the shipped arms |
| `gCodeFactGraph` | ✅ | 71 files, 581 spans, six roots complete and hashed WHOLE with EXTRACTED callees, closure 240 spans at depth 6 uncapped; the own-run fork's read set DERIVED from its whole text; the licence clause resolved to `decideOffBall`; the three licences each resolved to one definition and one declaration; `PendingPass` carries `targetGid`; `ObservedBall` can represent a perceived flight; all three action-type reads resolved |
| `gBite` | ✅ | **the #414 ROW form**: 998/998 eligible seeds' per-seed ROWS differ across 117 fields; the FULL-TIME SIGNATURE comparison is a PRINTED face (31 coincide) and gates NOTHING. ⚠ LIVENESS only |
| `gFaces` | ✅ | **1,324/1,324** face checks and **185/185** bin / median / top-bin-share / partition / **QUESTION-BLOCK** / sizing / `gBite` checks re-derived from the SERIALIZED artifact off disk |
| `gHashOrder` | ✅ | the 42-key ALLOWLIST schema is complete, excludes the hash and the detail blocks, and the body hash is computed LAST; `receipts.hashReproducesFromFile` **true** |
| `gStage` | ✅ | `stage.instrument` is THIS instrument's path and `stage.instrumentSha256` is the RUNNING file's hash |

**THE ARTIFACT'S FINAL FILE BYTE-HASH AND BYTE COUNT are printed ONCE, in §R RUN RECEIPTS above**
(`7f80d982…`, 17,510,179 bytes).

**CONSUMPTION.** Block `12,558,000–999` consumed whole (999 battery seeds + the construction
receipt at `12,558,999`). Scratch `900,008,000–099` (executor); the verifier's band is
`900,008,100–199`. ZERO stats:
`stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 86 }`. Next sim ≥ **12,559,000**.
