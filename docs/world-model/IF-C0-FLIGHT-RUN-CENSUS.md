# IF-C0 — 「球在飞时的前插 · 普查」 THE CENSUS OF THE RUN ONTO A BALL IN FLIGHT

> **STATUS: FROZEN — §0 through §DEV-PREFLIGHT are sealed at the FREEZE commit and are NOT
> edited after sight.** The instrument is byte-identical between FREEZE and RESULTS
> (`git diff <freeze> -- scripts/probes/if-c0-flight-run-census.ts` EMPTY).
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
