# DS T1 — 「自己的前插 · 考试」 THE OWN-RUN EXAM

Status: **WALKED — the battery is complete, ALL 23 GATES GREEN (`allGreen` = true), and the READ
IS PRINTED AT §R5.** §0 through §DEV-PREFLIGHT were sealed at the FREEZE commit **`8a9850f`** and
were NOT edited after sight; the instrument is byte-identical between FREEZE and RESULTS
(`git diff 8a9850f -- scripts/probes/ds-t1-own-run-exam.ts` EMPTY). X-SRC-ZERO held throughout:
not one byte under `src/` or `tests/` was created or edited. **NOTHING SHIPS** — the two DS flags
remain absent from every world, and the production fingerprint is unchanged. The commander rules.

Authority: **COMMANDER RULING #406 item 5** (the dispatch — the arms, R1, the band, the faces,
the reads VERBATIM, the gates, the seeds), standing on **#406 items 2–3** (the law of record and
what the arms mean, including the `flagGated` class this instrument's classifier gains) and on
**#405 items 1–2** (DS-C0 banked as measurement, and the three instrument DEBTS paid here).

* THE SEAM UNDER EXAM (read, never touched): [`DS-T0-OWN-RUN-SEAM.md`](DS-T0-OWN-RUN-SEAM.md).
* THE WALKER INHERITED: [`DS-C0-DESIGNATION-CENSUS.md`](DS-C0-DESIGNATION-CENSUS.md) +
  `scripts/probes/ds-c0-designation-census.ts`.
* THE EXAM FORM: [`GK-T1-DIVE-EXAM.md`](GK-T1-DIVE-EXAM.md).
* THE DOSE: [`LN-T1-LANE-EXAM.md`](LN-T1-LANE-EXAM.md) (MARKER-ESCAPE, byte-copied; G-DOSE-COPY).
* CONTRACT: [`DS-DESIGNATION-CONTRACT.md`](DS-DESIGNATION-CONTRACT.md) §2 M-DS.1–5, §3, §4.
* INSTRUMENT: `scripts/probes/ds-t1-own-run-exam.ts`.
  ARTIFACT: `data/ds-t1-own-run-exam.json`.

---

## §0 — WHAT THIS IS AND WHY

**THE QUESTION (#406 item 5, not re-argued here): can the coach's open-play hat come off — does
the player's OWN priced run hold the match's band without flooding, with or without the off-ball
eyes?**

This is the **DF path**, whose law is [`DF-DEFENSIVE-BRAIN-CONTRACT.md`](DF-DEFENSIVE-BRAIN-CONTRACT.md)
§2 M-DF.2: **the cap retires by measurement, never by deletion.** DS-C0 measured the gap, DS-T0
built the player-side candidate behind two dormant flags, and this stage is the measurement that
decides whether the compensator may go.

DS-C0's READ OF RECORD, quoted (ruling #405 item 1):

> *"EVERY OPEN-PLAY RUN IS A HAT — there is no player-owned run candidate; ③ takes the DF path:
> DS-T0 builds the PRICED run decision on the off-ball eyes before any hat is removed."*

DS-T0 built exactly that: ONE `MakeRun` candidate in `decideOffBall`'s in-possession branch for a
body carrying no hat, priced `W.runScore · clamp01((RUN_ROLE_W[role] + localX/RUN_DEPTH_DIV) /
RUN_PRIOR_MAX) · (tired ? OFFBALL_TIRED_MUL : 1) · obmRunMul`, carrying the seventh `why` literal
`'own run in behind'`, gated by `match.dsOwnRun`; and a second flag `match.dsHatsOff` that makes
`assignRunners` skip exactly its two OPEN-PLAY blocks. Both flags are false in every world.

**IT IS AN EXAM. It arms nothing in the game; nothing ships.** X-SRC-ZERO: no file under `src/`
or `tests/` is created or edited. The reads name DS-ENTRY, or OBM-T2 first, or a restraint slice,
or a broken guard — and the commander rules.

---

## §P — THE FROZEN PROTOCOL

### §P.1 — THE ARMS, AND THE DOSE COPY

NINE walks per seed, PAIRED on shared seeds.

**On E13** (world 13 EMPTY-BOOK — `a4MatchFlags(13)` + `armA4World(m, null, 13)`, ③'s control and
DS-C0's own E13 construction byte for byte), the SIX ARMS OF RECORD:

| arm | `dsOwnRun` | `dsHatsOff` | OBM seat |
| --- | --- | --- | --- |
| `HATS-E13-ABSENT` | — | — | absent — **the shipped path, the control** |
| `HATS-E13-DOSED` | — | — | MARKER-ESCAPE |
| `HATSOWN-E13-ABSENT` | ✓ | — | absent — **the ADDITIVE form** |
| `HATSOWN-E13-DOSED` | ✓ | — | MARKER-ESCAPE |
| **`OWN-E13-ABSENT`** | ✓ | ✓ | absent — ⭐⭐⭐ **THE ARM OF RECORD** |
| `OWN-E13-DOSED` | ✓ | ✓ | MARKER-ESCAPE — **answers H-DS-1 / H-DS-2** |

**On D13** (the PLAYED form — the same world 13 with the SHIPPED loaders' L3 and PC doses through
`armA4World`, exactly as DS-C0's D13 arm took them), the THREE seat-absent arms `HATS-D13` ·
`HATSOWN-D13` · `OWN-D13`, published BESIDE.

**THE PAIRING.** Every Δ is against the HATS arm at the SAME seat state and the SAME book
(`CONTROL_OF`): the E13-absent arms against `HATS-E13-ABSENT`, the E13-dosed arms against
`HATS-E13-DOSED`, the D13 arms against `HATS-D13`.

**THE DOSE (G-DOSE-COPY).** `obmMovement: true` plus the MARKER-ESCAPE matrix
`matrix([O_DEPTH, F2, MAX], [O_WIDTH, F2, MAX])`, BYTE-COPIED from
`scripts/probes/obm-t1-policy-exam.ts`'s own line (anchored) together with its whole idiom (`IDX`
· `F1..F4` · `O_DEPTH..O_RUN` · `ZERO_MATRIX` · `matrix()` · the MIN/MAX aliases). G-DOSE-COPY
re-derives the matrix SLOT FOR SLOT from a SECOND, independently shaped derivation straight off
the `OBM_*` exports (a full output × feature sweep), and asserts every slot is 0 or a domain
corner and that exactly two slots are non-zero.

**DOSE PLACEMENT (canon).** The matrix is written on the MATCH-LOCAL `baseGenome` AND `effGenome`
of BOTH teams and **NEVER on `info.genome`**. Because `Team`'s constructor sets
`this.baseGenome = info.genome; this.effGenome = info.genome` — the SAME OBJECT — the two views
are DE-ALIASED FIRST with the engine's own idiom (`{ ...team.baseGenome, … }`, `setCbProneness`'s
shape, anchored), and `gWorld` carries an `infoGenomeCleanOfMatrix` conjunct asserted on EVERY
walked match of EVERY arm.

**gWorld, per arm, on every walked match and the construction receipt:** `bqArmedVersion(m) === 13`
and `bqCushion` TRUE; `lnArmedVersion(m) !== 14` and `lnOwnLanePrice` ABSENT; `gkArmedVersion(m)
!== 15` and `gkDiveBody` ABSENT; `edsPerceivedChoice` TRUE; every CTB / RC / BF seam ABSENT; the
TWO DS FLAGS EXACTLY AS DUE; `obmMovement` EXACTLY AS DUE with the 16-slot matrix on `baseGenome`
and `effGenome` on exactly the dosed arms; `info.genome` clean.

### §P.2 — THE WALKER, THE THREE PAID DEBTS, AND EVERY PREDICATE'S FIXTURES

The walker is DS-C0's, re-taken at this head, with the census's own field names KEPT BYTE FOR
BYTE as a MIRROR so `G-REPRO-DSC0` can compare field for field, and the exam's own faces added
beside them under new names.

**DEBT (a) — THE DECISION-TICK PREDICATE.** The engine's decide loop tests
`p.decisionTimer <= 0 && !pcHeld` where `pcHeld` is `holdFor(p.gid, this.stepCount)` with
`stepCount` ALREADY incremented — i.e. the POST-STEP `simTick` — while `pcLatencyObserve()` arms
holds INSIDE the step and BEFORE that increment. DS-C0 read the holds map PRE-STEP and therefore
missed every hold armed in the same step. **The predicate of record here reads
`pcLatency`'s own holds map AFTER `m.step(DT)` at exactly that tick.** DS-C0's PRE-STEP form is
recomputed BESIDE it on every tick, and BOTH are compared to the ENGINE'S OWN
`pcLatency.ledger.decisionsHeld` per-tick delta (canon: **engine ledgers before heuristics**). The
receipt is the `calib.*` face family and `faceBlocks.decisionTickCalibration`:
`calib.postStepOverLedger` is the post-step reconstruction over the engine's own ledger (1 means
the predicate of record reproduces the engine exactly) and `calib.preStepOverLedger` is the size
of the debt that was owed. ⛔ `holdFor` itself is NEVER called by this instrument — it DELETES
expired entries and so would not be byte-inert; the map read reproduces its semantics
(`h !== undefined && simTick < h.untilTick`) and is fixture-pinned.

**DEBT (b) — THE SHOOTER GID AT THE PUSH.** When a NEW `shotLog` row appears, the shooter gid is
read off `pendingShot.shooterGid` through its own `logIndex` **while the shot is live** and BANKED
in a per-`logIndex` map. The goal join at the outcome flip reads that map, so
`ep.goalsPerEpisode.*` and `own.goalsPerEpisode` are no longer VOID. DS-C0's own join (re-reading
`pendingShot` at the flip) is published BESIDE as `ep.goalsPerEpisodeDsC0Form.*`, so the size of
the void it closed is a measured number and not a claim. `own.goalRowJoinShare` is the receipt.

**DEBT (c) — THE BINS PAST ONE FULL LICENCE.** One full `wallRun` licence is 2.3 s (EXTRACTED from
the licence's own write line), i.e. **138 ticks at `DT = 1/60`, DERIVED in code and never typed**.
The wide episode histogram's bin count is `ceil(138 / 6) + 2 = 25`, so its TOP BIN'S LOWER EDGE is
**144 ticks — beyond a full licence**. THE TOP BIN'S SHARE IS STORED BESIDE EVERY BIN-DERIVED
MEDIAN (`…TopBinShare`), DS-C0's own narrow bins are published beside as `…DsC0Bins` so the FLOOR
relabelling of #405 item 1 can be seen for what it was, and episodes still ACTIVE at full time are
COUNTED in `ep.activeAtFullTime.*` / `own.episodesActiveAtFullTime` (never binned).

**THE PREDICATES, each with fixtures both ways** (`gPredicateFixtures`; ⛔ no fixture asserts a
direction):

* the COACH TICK and the DECISION TICK on the engine's own guard arithmetic;
* ⭐⭐⭐ **DEBT (a)'s two forms on a HAND-BUILT HOLD ARMED INSIDE THE STEP** — the PRE-STEP form
  says *he decided*, the POST-STEP form says *he was held*, and a hold that PREDATES the step
  makes the two AGREE;
* the `assignRunners` BRANCH ladder (a live corner SUPPRESSES the held crash — the source's order);
* DS-C0's EIGHT-cell MIRROR hat classifier, including the own run landing in its `OTHER`;
* ⭐⭐⭐ this exam's NINE-cell classifier with `ownRunInBehind` as **its own class**, `OTHER` firing
  on a hand-written run and on an EDITED seventh literal, and every named class distinct;
* ⭐⭐⭐ the OWN-RUN EPISODE's SET and CLEAR on a hand-built record series (a `MakeRun` with the
  seventh why is ACTIVE; the same why on a non-run action is NOT; one set-then-clear is ONE
  episode; a held run is ONE; never-set is zero) and the yield window open/shut on both sides;
* ⭐⭐⭐ the STATE classifier on hand-built states — every state fires and each has a negative (an
  in-flight ball during a RESTART is not `ballInFlight`; the OPPONENT's restart is `other`; a mate
  on the ball WINS over everything);
* the 2过1 trigger with all six conjuncts true and each killed by exactly one;
* the PRIOR at every role at every quarter-metre (the ST on the goal line EXACTLY 1; a DF at
  −19 m clamped to 0; a DF at −17 m not clamped);
* the `runMul` BACK-OUT recovering an identity, a priced-down and a priced-up multiplier THROUGH
  the tired limb, and REFUSING a zero prior;
* ⭐⭐⭐ the `flagGated` classifier on the seam's own push, and the READ-FORK inventory PARSED out
  of the seam doc's markdown table and compared file-and-line.

### §P.3 — R1, THE FLOOD FACE

**R1 = EXECUTED RUNS PER IN-POSSESSION OPEN-PLAY TEAM-TICK.** Per team, per STEPPED tick:
`match.possessionSide === team.side` · `match.phase === 'playing'` · the team carries NO live
`cornerCrash` and NO live `crossFlight` (both read off the engine's own held-licence clocks,
`simTime < until`, at the end of the tick). THE COUNT is of OUTFIELD BODIES (not the keeper, not
sent off) whose `p.action.type` is `MakeRun` — **the BODIES, not the board**.

Published per arm: the FROZEN BINS `0 · 1 · 2 · 3 · 4 · 5 · 6+`; the MEAN; the SHARE of ticks with
**≥ 3** runners; the paired Δ of the mean vs the HATS arm at the SAME seat state with the CLUSTER
BOOTSTRAP (2,000 draws, `Rng` seeded from the block base 12,554,000); the tolerance
`NI_FRACTION · |control mean|`; and BOTH FRACTIONS (`r1.teamTicksPerMatch` and
`r1.runnerTicksPerMatch`).

> ⭐⭐⭐ **`floods(arm)` = the paired Δ of R1's MEAN is RESOLVED (the 95 % interval excludes zero)
> AND UP AND BEYOND the tolerance.**

### §P.4 — THE BAND, THE GUARDS (F-DS-b)

Tolerance = `NI_FRACTION · |control level|`, with **`NI_FRACTION` INHERITED BY ANCHOR as an
EXPRESSION** from `scripts/probes/ctb-t1-supply-exam.ts`'s own line
(`const NI_FRACTION = 1 - 0.275 / 0.380;`), cross-read from `scripts/probes/dlc-t1-choice-exam.ts`
as a SECOND source and required to agree, and EVALUATED FROM ITS TWO NUMERALS — ⛔ never typed as
a decimal anywhere in the instrument.

**BREACH = the paired Δ RESOLVED *AND* beyond the tolerance IN THE HARMFUL DIRECTION.**
'both' = either direction is harmful.

| id | face | direction |
| --- | --- | --- |
| G1 | `guard.goalsPerMatch` | both |
| G2 | `guard.shotsPerMatch` | both |
| G3 | `guard.xgConversion` — goals ÷ Σ`xg` off the engine's own `shotLog` | both |
| G4 | `guard.passCompletion` | **floor** (DOWN is harmful) |
| G5 | `guard.interceptionsPerMatch` | **ceiling** (UP is harmful) |
| G6 | `guard.possessionShareSideA` | both |
| G7 | `guard.passesPerMatch` | both |
| G8 | `guard.meanAimDistanceMetres` — mean pass distance | both |
| G9 | `guard.throughBallsPerMatch` — the engine's own counter | both |
| G10 | `guard.offsidesPerMatch` | **the #157 FLAG form — it FLAGS and GATES NOTHING** |

> ⭐⭐⭐ **`holdsBand(arm)` = NO BREACH among G1–G9.**

Every row stores the control arm, the control level, the arm level, Δ, the 95 % interval, the
half-width, |Δ|÷half-width, the tolerance, the harmful direction, `resolved`, `beyondTolerance`
and `breach`.

### §P.5 — THE FACES (published on EVERY arm; ⛔ NO VERDICT WORD on any of them)

* **POPULATION A — THE BOARD** re-walked (DS-C0's own): coach ticks per match and the
  in-possession share; the runner-count bins and mean; arriver/overlapper set shares by writing
  branch; runners by role; the 套边 gate and its `confronted` share. **On the OWN arms the
  OPEN-PLAY BOARD IS EMPTY BY CONSTRUCTION** — published as `board.openPlayEmptyShare` with a
  STORED BOOLEAN `openPlayBoardEmpty` per arm, never a claim.
* **POPULATION B — THE DECISIONS**: the `MakeRun` share of attacking off-ball decision ticks and
  the class split, **INCLUDING `ownRunInBehind` AS ITS OWN CLASS**; the hatted share of the
  attacking outfield; and DEBT (a)'s calibration receipt printed beside.
* **POPULATION C — THE YIELD PER RUN EPISODE**: a HAT episode as DS-C0 defined it; an **OWN-RUN
  EPISODE = one body's consecutive `MakeRun` ticks whose winner's `why` is the seventh literal**,
  set/clear fixture-pinned. Within the episode or 6 s after its clear: passes AIMED at him,
  COMPLETED, THROUGH, SHOTS and GOALS (the shooter gid recorded at the push). Episode-tick bins
  past one full licence with the top bin's share beside every median; episodes active at full
  time counted.
* **RUNS AND YIELD PER STATE** at the decision tick — `mateOwnsTheBall` · `ballInFlight`
  (`ball.owner === null`, phase `playing`, possession his side) · `ownRestart` (phase `restart`,
  the restart's side is his) · `other`, COUNTED — for BOTH hat runs and own runs.
* **RUNS BY ROLE** per arm (DF/MF/WG/ST shares of EXECUTED runs — the prior's role bias against
  the hats').
* **THE COUPLING FACES** on every arm (#406 item 3(i)): overlap sets per match, the ball played to
  the overlapper per set, wall-pass fires per eligible pass, and returns.
* **THE CROWDING FAMILY** copied by ANCHOR from LN-T1 / OBM-T1: `crowd.crashShare` (PT-C0's 撞车
  line) and `guard.spacingUnder4` (+ its pooled companion).
* **THE SEAT'S `runMul` DISTRIBUTION**: frozen bins over `[1 − OBM_SCORE_SPAN, 1 + OBM_SCORE_SPAN]`
  = `[0.6, 1.4]` (the range DERIVED from the seat's own span), the share below 1 and above 1.
  The multiplier is **BACKED OUT of the engine's own decision record** (`s = W.runScore · prior ·
  tiredMul · obmRunMul`, with `obmRunMul` applied LAST at both score sites) — the policy is NEVER
  recomputed and `perceivedSnapshot` is NEVER called, so the observation stays byte-inert. It is
  taken on **EVERY** arm: on a seat-ABSENT arm `obmRunMul` is exactly 1 by construction, so that
  arm's distribution IS THIS BACK-OUT'S OWN NOISE FLOOR.
* **THE HATS + OWN arm's own `floods` / `holdsBand` words** (the additive form).

### §P.6 — THE READS (frozen literals, copied VERBATIM from ruling #406 item 5(v))

Selected by STORED BOOLEANS over the OWN arms on E13, in the ruling's own order:

1. ¬`floods(OWN,absent)` ∧ `holdsBand(OWN,absent)` ⇒
   *"THE HAT CAN COME OFF — the player's own run holds the band without the coach and without
   eyes; DS-ENTRY is named: world 16 = world 15 + the own run with the open-play hats off."*
2. `floods(OWN,absent)` ∧ ¬`floods(OWN,dosed)` ∧ `holdsBand(OWN,dosed)` ⇒
   *"THE EYES ARE THE RESTRAINT — H-DS-2 holds and H-DS-1 holds without them; the entry needs the
   seat dosed: OBM-T2 (the dose space) is named before DS-ENTRY."*
3. `floods(OWN,absent)` ∧ `floods(OWN,dosed)` ⇒
   *"THE RESTRAINT WAS THE COACH'S — H-DS-1 holds with or without eyes; the law needs a
   player-side restraint term (a later slice); the seam stays dormant."*
4. otherwise ⇒ *"A GUARD BREAKS — the guard is named; the commander decides with the table."*
   (the breached guard(s) on an ANNOTATION LINE).

**BESIDE every read, printed from STORED fields:** the HATS+OWN arm's own words; the yield pair
(shots per own-run episode vs per hat episode, BOTH fractions, ⛔ no verdict word); the coupling
sentence (the overlap-sets Δ and the wall-pass-fires Δ on OWN vs HATS); and the per-state line
(own runs won at owned / in-flight / restart ticks).

**STORED:** the selectors, the selected sentence, the COUNTERFACTUAL WORDS for the dosed OWN arm
and for D13 (each computed by the SAME frozen rule on ITS OWN stored intervals — canon:
*counterfactual words are stored*), and the guard table per arm.

### §P.7 — SEEDS AND SIZING

| item | band | status |
| --- | --- | --- |
| battery | **12,554,000 – 12,554,998** | 999 seeds × 9 arms |
| construction receipt | **12,554,999** | the block consumed WHOLE |
| sizing smoke | 900,006,200 – 900,006,211 | SCRATCH (disclosed at §DEV-PREFLIGHT) |
| smoke receipt | 900,006,220 | SCRATCH |
| world pin | 900,006,270 | SCRATCH |
| lockstep + X-DET | 900,006,290 – 900,006,291 | SCRATCH |
| fixtures' attribute draw | 900,006,299 | SCRATCH |
| G-REPRO-DSC0 re-walks | 12,553,000 – 12,553,011 | **DS-C0's OWN CONSUMED BAND — not a consumption** |

ZERO stats consumed; `stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 83 }`.

**THE SIZING FORM** (the house form): `se(n) = hw(n)/z.975` · `se(needed) = |target|/(z.975+z.80)`
· `N = ceil(n · (se(n)/se(needed))²)` · `MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975`, at a
**DECLARED 0.05 half-width** on R1's paired Δ (OWN vs HATS, seat absent, E13) and on
`passCompletion`'s paired Δ on the same pair.

**N = 999 = THE BLOCK'S AFFORDANCE after the construction receipt** — and it is the affordance,
not the requirement, that is taken (§DEVIATIONS 4): both sizing rows resolve far inside it
(nRequired **62** and **18**), so the affordance strictly dominates, and canon's *seed discipline*
consumes a block WHOLE of record. THE TAIL: none — 12,554,000–998 are walked and 12,554,999 is the
construction receipt, so the block is fully consumed.

### §P.8 — THE GATE SET (frozen ex ante)

THE HOUSE SET: `X-DET` twice on a scratch pair · `X-FP-PROD` · `X-SRC-UNTOUCHED` over `src` AND
`tests` · `SEED-DISJOINT` (consumed blocks LN-C0 12,544,000–999 · LN-T1 …545 · LN-C1 …546 · LN-C2
…547 · LN-C3 …548 · LN-T1′ …549 · LN-T1′b …550 · GK-C0 …551 · GK-T1 …552 · DS-C0
12,553,000–999) · `gN` · `gFaces` off the SERIALIZED artifact · `gReadWords` · `gHashOrder` (the
NON-body receipt reproduces the hash) · BOOKED = WALKED · `gLoo` SCOPED to the read-bearing rows ·
`gTwoFractions` · `gStage` · `gWorld` per arm.

PLUS:

* **`gBite`** in the #402 item 2(iii) form — on every battery seed WHERE THE FLAG CAN BITE the arm
  and its HATS control have DIFFERENT whole-match signatures; the shapes where nothing can bite
  are EXEMPTED AND NAMED (a seed on which the armed arm records zero own-run decisions gives
  `dsOwnRun` no candidate to push; the `dsHatsOff` arms are never exempt). The SEAT's own bite is
  published beside. ⚠ LIVENESS only.
* **`gLockstep`** — observed ≡ unobserved whole-match signatures on every arm.
* **`gDoseCopy`** (G-DOSE-COPY, LN-T1's form).
* **`gRepro`** (G-REPRO-DSC0) — HATS-E13-ABSENT re-walked on 12,553,000–011 and compared FIELD FOR
  FIELD against DS-C0's stored `perSeedCells[].E13`: **the A/C half is RED on any mismatch**; the
  B/D half is compared with DS-C0's OWN PRE-STEP form recomputed beside the new one and the
  PRE-STEP vs POST-STEP delta is the RECEIPT.
* **`gCodeFactGraph`**, **`gClassesNonVacuous`**, **`gPredicateFixtures`**, **`gLedgerRead`**,
  **`gAnchoredConstants`**, **`gDoseSource`**.

### §P.9 — THE CODE FACTS

* **THE SIX `MakeRun` PUSHES in `src/` CLASSIFIED** over the WHOLE ENCLOSING-`if` CHAIN up to the
  function head — DS-C0 took the NEAREST guard only, which is exactly why its extractor would read
  the seam's push as unguarded (#406 item 3(iii), declared in advance). The classes are
  `flagGated` (the flag NAMED) > `hatGuarded` > `keeperUpGuarded` > `unguarded`.
* **`makeRunCandidatesAllHatGuardedOnShippedPath`** — every push REACHABLE WITH BOTH DS FLAGS
  ABSENT is guarded by a designation field or by the keeper-up licence. **DERIVED, never typed**;
  TRUE expected.
* **THE TWO FLAGS' READ FORKS** under `src/**` enumerated with counts and sites, and compared —
  file and line — to the seam doc's own READ-FORK INVENTORY table and its per-file
  executable-line occurrence counts, both PARSED OUT OF THE MARKDOWN. **Equal or RED.**
* **`assignRunners`, `decideOffBall`, the executor's `MakeRun` case's own enclosing function
  (`executeAction`) and `obmOffballPolicy` HASHED WHOLE** with their EXTRACTED callees stored
  beside them (canon: *code facts over the call graph*).
* **G-DOSE-COPY**: the MARKER-ESCAPE matrix re-derived from the `OBM_*` exports slot for slot.

---

## §DEV-PREFLIGHT — THE DISCLOSED SMOKE (before the freeze)

A 12-seed scratch smoke on **900,006,200 – 900,006,211** (NINE walks per seed, the full nine-arm
battery, all gates evaluated) was run BEFORE the freeze, wrote to `/tmp/`, and is DISCLOSED here.
It exists to size N and to prove the instrument runs end to end; **no number from it is a finding
and none is quoted anywhere outside this section.**

| face @ arm | Δ (12 clusters) | half-width | se(smoke) | se(needed) | **nRequired** | expected hw at N = 999 | resolvable |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `r1.runsPerInPossessionTick` @ `OWN-E13-ABSENT` | 1.280559 | **0.078977** | 0.040295 | 0.017847 | **62** | 0.008656 | ✅ |
| `guard.passCompletion` @ `OWN-E13-ABSENT` | −0.016342 | **0.042798** | 0.021836 | 0.017847 | **18** | 0.004691 | ✅ |

The two `hwSmoke` values above are the ONLY smoke numbers transcribed into the instrument
(`SIZING_INPUTS`), and `gFaces` re-derives every sizing row from them off the serialized artifact.
The smoke's own console also reported ALL GATES GREEN at n = 12, `G-REPRO-DSC0` A/C green over 66
fields × 12 seeds with the B/D pre-step form IDENTICAL, and a battery wall of 37.7 s for 12 seeds
× 9 arms — from which the frozen battery is projected at roughly 52 minutes.

⚠ **12 clusters is a NOISY variance estimate** (canon). The REALISED half-widths at N are
published in §GATES beside these projections.

---

## §R — THE RESULTS

**RUN RECEIPTS.** FREEZE commit **`8a9850f`**; the instrument is byte-identical between FREEZE
and RESULTS (`git diff 8a9850f -- scripts/probes/ds-t1-own-run-exam.ts` EMPTY), and §P and
§DEV-PREFLIGHT were not edited after sight. **`allGreen` = true** — a STORED boolean over
**23** gate objects, every one `ok: true`. Battery **999 seeds (12,554,000–12,554,998) × 9 ARMS +
the construction receipt at 12,554,999 ⇒ BOOKED = WALKED = 9,000 walks**; `seeds.unwalkedTail` =
**null** — the block is consumed WHOLE. ZERO stats consumed; registry **83**. Artifact
`data/ds-t1-own-run-exam.json`, **41,271,128 bytes**, file sha256
`d694d8a8d1a76b65baea47d0439b5d6966ff93329353e314f8ca37b1a83f0aed`,
`hashedBodySha256 = 0746b256e1d8774ad402436ce4289eaa568b4a7ca424d91231a0c1ce00e371b1`,
`instrumentSha256 = 44bcd8323f98183636d1f269ddedf2397d75703fed00dd3ed5b92cbf854deae1`,
`receipts.hashReproducesFromFile` **true**. Battery wall **1486.819 s**,
`perf.meanWallSecondsPerMatch` **0.14171905238571905**. `tsc --noEmit` clean at both commits.
**X-FP-PROD recomputed IN-PROCESS** = `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`
— the literal of record, UNCHANGED.

*(Every number below QUOTES the artifact's own fields, at 6 dp where the field is a rate or a
share. The artifact is the numbers of record.)*

### §R1 — R1, THE FLOOD FACE

**EXECUTED runs per in-possession open-play team-tick**, per arm, with the paired Δ against the
HATS arm at the SAME seat state:

| arm | mean | 0 | 1 | 2 | 3 | 4 | 5 | 6+ | ≥ 3 |
|---|---|---|---|---|---|---|---|---|---|
| `HATS-E13-ABSENT` | **0.584786** | 0.623416 | 0.183674 | 0.178182 | 0.014167 | 0.000562 | 0.000000 | 0.000000 | **0.014729** |
| `HATS-E13-DOSED` | 0.574438 | 0.629561 | 0.180890 | 0.175553 | 0.013545 | 0.000452 | 0.000000 | 0.000000 | 0.013997 |
| `HATSOWN-E13-ABSENT` | 1.475045 | 0.157879 | 0.355033 | 0.352403 | 0.123625 | 0.010968 | 0.000092 | 0.000000 | 0.134685 |
| `HATSOWN-E13-DOSED` | 1.460356 | 0.161051 | 0.356662 | 0.353083 | 0.119362 | 0.009768 | 0.000074 | 0.000000 | 0.129204 |
| **`OWN-E13-ABSENT`** | **1.832816** | 0.172187 | 0.177036 | 0.322041 | 0.303310 | 0.025365 | 0.000062 | 0.000000 | **0.328737** |
| `OWN-E13-DOSED` | 1.830964 | 0.171216 | 0.174727 | 0.330356 | 0.299349 | 0.024279 | 0.000072 | 0.000000 | 0.323700 |
| `HATS-D13` | 0.654088 | 0.594841 | 0.174185 | 0.213657 | 0.016675 | 0.000641 | 0.000000 | 0.000000 | 0.017316 |
| `HATSOWN-D13` | 1.511565 | 0.127652 | 0.361586 | 0.390053 | 0.112984 | 0.007705 | 0.000021 | 0.000000 | 0.120709 |
| `OWN-D13` | 1.820973 | 0.167489 | 0.182579 | 0.330161 | 0.301032 | 0.018722 | 0.000018 | 0.000000 | 0.319772 |

| arm | Δ vs its HATS control | 95 % interval | tolerance | \|Δ\|÷half-width | resolved | up | beyond | **`floods`** |
|---|---|---|---|---|---|---|---|---|
| `HATSOWN-E13-ABSENT` | +0.890259 | [0.878666, 0.901928] | 0.161586 | **76.543133** | true | true | true | **true** |
| `HATSOWN-E13-DOSED` | +0.885918 | [0.874229, 0.897263] | 0.158726 | 76.921877 | true | true | true | **true** |
| **`OWN-E13-ABSENT`** | **+1.248030** | **[1.231920, 1.262842]** | **0.161586** | **80.720066** | true | true | true | **true** |
| `OWN-E13-DOSED` | +1.256526 | [1.242889, 1.271064] | 0.158726 | 89.191703 | true | true | true | **true** |
| `HATSOWN-D13` | +0.857476 | [0.845811, 0.869101] | 0.180735 | 73.634735 | true | true | true | **true** |
| `OWN-D13` | +1.166885 | [1.150368, 1.182600] | 0.180735 | 72.405529 | true | true | true | **true** |

**BOTH FRACTIONS** (the two-fractions pair): on the ARM OF RECORD the denominator is
`r1.teamTicksPerMatch` = **11409.492492** in-possession open-play team-ticks per match against
the control's **11960.576577**, and the numerator `r1.runnerTicksPerMatch` = **20911.505506**
executed-run body-ticks per match against **6994.377377**. The share of team-ticks carrying THREE
OR MORE runners goes **0.014729 → 0.328737**.

**`floods(arm)` is TRUE on all six contrasted arms.** Every R1 LOO row flips **0** intervals in
either direction and its maximum single-seed influence share is at most **0.001004**.

### §R2 — THE BAND

`holdsBand` is **FALSE on all six contrasted arms**, and on every one of them the breach set is
the SAME SINGLE GUARD: **`G9 guard.throughBallsPerMatch`**. Nothing else breaches anywhere.

**THE ARM OF RECORD, `OWN-E13-ABSENT` vs `HATS-E13-ABSENT`:**

| id | face | control | arm | Δ | 95 % interval | tolerance | dir | resolved | beyond | **breach** |
|---|---|---|---|---|---|---|---|---|---|---|
| G1 | goals per match | 3.424424 | 3.493493 | +0.069069 | [−0.084084, 0.249249] | 0.946223 | both | false | false | — |
| G2 | shots per match | 12.837838 | 12.775776 | −0.062062 | [−0.343343, 0.235235] | 3.547297 | both | false | false | — |
| G3 | xG conversion | 1.497664 | 1.450311 | −0.047353 | [−0.101122, 0.013229] | 0.413828 | both | false | false | — |
| G4 | pass completion | 0.589465 | 0.585264 | −0.004201 | [−0.008835, 0.000474] | 0.162878 | floor | false | false | — |
| G5 | interceptions | 26.967968 | 22.329329 | −4.638639 | [−5.041041, −4.208208] | 7.451675 | ceiling | true | false | — |
| G6 | possession share (A) | 0.504328 | 0.505447 | +0.001119 | [−0.003965, 0.006386] | 0.139354 | both | false | false | — |
| G7 | passes per match | 79.658659 | 68.485485 | −11.173173 | [−11.907908, −10.416416] | 22.010945 | both | true | false | — |
| G8 | mean pass distance (m) | 15.794795 | 15.460553 | −0.334242 | [−0.411723, −0.250345] | 4.364351 | both | true | false | — |
| **G9** | **through balls per match** | **5.962963** | **8.750751** | **+2.787788** | **[2.555556, 3.038038]** | **1.647661** | both | **true** | **true** | **⛔ BREACH** |
| G10 | offsides per match (FLAG) | 2.399399 | — | +0.730731 | resolved | — | flag | true | — | **FLAG RAISED** |

**THE SAME ROW ON THE OTHER FIVE ARMS** (control → arm, Δ, tolerance):
`HATSOWN-E13-ABSENT` 5.962963 → 9.458458, **+3.495495** [3.237237, 3.746747], tol 1.647661 ·
`HATSOWN-E13-DOSED` 5.982983 → 9.386386, **+3.403403** [3.172172, 3.641642], tol 1.653193 ·
`OWN-E13-DOSED` 5.982983 → 8.727728, **+2.744745** [2.509510, 2.986987], tol 1.653193 ·
`HATSOWN-D13` 7.207207 → 10.170170, **+2.962963** [2.697698, 3.219219], tol 1.991465 ·
`OWN-D13` 7.207207 → 9.274274, **+2.067067** [1.798799, 2.309309], tol 1.991465.
G9's |Δ|÷half-width on the arm of record is **11.556017**, and its LOO flips **0** intervals.

**THE OFFSIDE FLAG (G10, gating nothing) IS RAISED ON ALL SIX ARMS**: Δ per match
+0.375375 · +0.436436 · **+0.730731** (arm of record) · +0.741742 · +0.302302 · +1.064064, every
one resolved. The seam doc's §HONESTY 8 named the restart case; the flag has now fired.

**THE ONLY OTHER LOO FLIPS IN THE WHOLE TABLE** are on two NON-breaching rows —
`guard.xgConversion@HATSOWN-E13-ABSENT` (101 seeds whose removal would un-resolve it downward,
max influence 0.0548) and `guard.shotsPerMatch@OWN-D13` (1 seed) — and neither enters any read.

### §R3 — THE FACES

#### The board (population A), and `openPlayBoardEmpty`

The coach still speaks: `coach.ticksPerMatch` **1352.088088** on the control with
`coach.inPossessionShare` **0.487776**. His board is essentially unchanged when only `dsOwnRun` is armed
(`runCount.mean` 1.504253 → 1.480369; `runCount.designationsPerMatch` 992.078078 → 975.425425) and **collapses under `dsHatsOff`**: `runCount.mean`
**1.504253 → 0.166849** on the arm of record, `runCount.designationsPerMatch` **992.078078 →
109.881882**. What survives is the corner and cross personnel, exactly as M-DS.4 says.

`board.openPlayEmptyShare` = **0.999912** on `OWN-E13-ABSENT` (614,094 of 614,148 open-play
in-possession coach ticks) and **1.000000** on `OWN-E13-DOSED` (618,811 of 618,811). **The STORED
BOOLEAN `openPlayBoardEmpty` is therefore `false` on the arm of record and `true` on the dosed
OWN arm** — it is written as a stored boolean, not as a claim, and the 54 non-empty ticks are
§HONEST LIMITS 3.

#### The decisions (population B), with the own run as its own class

*(⚠ two denominators in one table — §COMMANDER CORRECTIONS 4: the `MakeRun` share row is over OUTFIELD
off-ball decision ticks (`offBall.actionShare.MakeRun`, 948,364 ÷ 5,767,015 on the control); the class
rows below it are over ATTACKING `MakeRun` decisions INCLUDING the keeper's (`runClass.shareOfMakeRun.*`,
949,920 on the control) — the artifact's `denNote` carries each; the two rows do not multiply.)*

| face | `HATS-E13-ABSENT` | `HATSOWN-E13-ABSENT` | **`OWN-E13-ABSENT`** | `OWN-D13` |
|---|---|---|---|---|
| off-ball decision ticks per match | 5772.787788 | 5950.640641 | 6069.860861 | 6457.946947 |
| `MakeRun` share of them | 0.164446 | 0.359578 | **0.429498** | 0.431682 |
| `ownRunInBehind` share of `MakeRun` | 0.000000 | 0.519657 | **0.904557** | 0.914116 |
| `licensedRunInBehind` | 0.477754 | 0.231041 | **0.000112** | 0.000119 |
| `attackingTheBox` | 0.473873 | 0.223399 | 0.080247 | 0.068711 |
| `arrivingLate` | 0.037596 | 0.021660 | 0.010873 | 0.011194 |
| `overlapping` | 0.005908 | 0.002079 | 0.002696 | 0.002990 |
| `oneTwoBurst` | 0.003232 | 0.001424 | 0.001077 | 0.002501 |
| `keeperUp` | 0.001638 | 0.000740 | 0.000438 | 0.000369 |
| **`OTHER`** | **0.000000** | **0.000000** | **0.000000** | **0.000000** |
| hatted share of the attacking outfield | 0.351341 | 0.345316 | **0.055813** | 0.052302 |

**`OTHER` IS 0.000000 ON EVERY ARM** — the seventh literal is the only new `why` the engine
produces, and DS-C0's read of record survives the arming as a code fact.

**DEBT (a)'s CALIBRATION RECEIPT.** On the control arm the POST-STEP predicate of record counts
**38698.678679** held body-ticks per match against the ENGINE'S OWN LEDGER
`calib.ledgerDecisionsHeldPerMatch` **38698.697698** — `calib.postStepOverLedger` =
**0.9999995085359418**. DS-C0's PRE-STEP form counts **38557.760761**,
`calib.preStepOverLedger` = **0.9963580961292834** — the two stored ratios ARE the size of the debt, and no third number is
written for it. It inflated the decision population from `offBall.decisionTicksPerMatch`
**5772.787788** to `offBall.decisionTicksPerMatchPreStepForm` **5835.168168** on the same arm.
Every arm's pair is stored; the largest pre-step gap is on `HATS-D13`
(`calib.preStepOverLedger` 0.9913568648849957).

#### The yield per run episode (population C), the two debts visible

| face (arm of record) | own-run episode | runner-hat episode |
|---|---|---|
| episodes per match | **177.497497** | 11.838839 |
| mean ticks per episode | 166.382856 | 243.947155 |
| passes aimed per episode | 0.224808 | 0.419379 |
| completions per episode | 0.102651 | 0.206477 |
| through share of aims | 0.132303 | — |
| **shots per episode** | **0.045048** (7,988 ÷ 177,320) | **0.099264** (1,174 ÷ 11,827) |
| **goals per episode (debt (b) paid)** | **0.017076** | **0.037203** |
| goals per episode, DS-C0's own join | — | **0.000000** |
| episodes open at full time | 2.066066 | 0.202202 |

⭐⭐⭐ **DEBT (b), MEASURED.** `ep.goalsPerEpisodeDsC0Form.runner` is **0.000000 on every one of
the nine arms** — DS-C0's VOID reproduced exactly — while the same quantity joined through the
gid BANKED AT THE PUSH is **0.037203** on the arm of record. The receipt
`own.goalRowJoinShare` is **1.000000** there.

⭐⭐⭐ **DEBT (c), MEASURED.** One full `wallRun` licence is **138** ticks, and the wide histogram's
top bin opens at **144**. On the arm of record the runner-episode median is **144** on the wide
bins against **120** on DS-C0's own bins, with top-bin shares **0.7403870967741936** and
**0.7481290322580645** — i.e. DS-C0's `120+` catch-all really was a FLOOR, and it swallowed
three quarters of the distribution. The `wallRun` episode median is **138** on the wide bins —
EXACTLY one licence — against **120** on DS-C0's. The own-run episode median is **108** ticks
with a top-bin share of **0.3701670698863377**.

#### Runs and yield PER STATE (the seam doc's §HONESTY 8, measured)

| state | own runs/match | share of own runs | aimed per run | shots per run | hat runs/match | share of hat runs |
|---|---|---|---|---|---|---|
| a mate owns the ball | 518.707708 | 0.219865 | 0.047903 | 0.007370 | 23.741742 | 0.095815 |
| **the ball in flight** | **1280.089089** | **0.542593** | 0.025669 | 0.005276 | 58.255255 | 0.235101 |
| his side's own restart | 554.439439 | 0.235011 | 0.018063 | 0.002385 | 165.151151 | 0.666502 |
| other (counted) | 5.969970 | 0.002530 | 0.002683 | 0.000503 | 0.639640 | 0.002581 |

On the SHIPPED path the same three states carry the hat runs **0.518517 · 0.080620 · 0.397269**.
The state MIX itself barely moves (`state.decisionShare` on the arm of record 0.326156 ·
0.461279 · 0.209062 · 0.003503 against the control's 0.310036 · 0.520015 · 0.166079 · 0.003870),
so the shift is in WHO RUNS WHEN, not in what the match is doing.

#### Runs BY ROLE

`runsByRole.share` over EXECUTED runs, control → arm of record: DF **0.005780 → 0.000908** ·
MF **0.057428 → 0.072409** · WG **0.425219 → 0.577084** · ST **0.511573 → 0.349599**. The
coach's own board (`runnersByRole.share`, the designations) reads DF 0.017325 · MF 0.044991 ·
WG 0.381304 · ST 0.556380 on the control.

#### THE COUPLING FACES (⛔ no verdict word)

| face | control | arm of record | Δ | 95 % interval | resolved |
|---|---|---|---|---|---|
| overlap sets per match | 3.115115 | 2.410410 | −0.704705 | [−0.865866, −0.545546] | true |
| ball played to the overlapper per set | 0.014460 | 0.018688 | +0.004228 | [−0.002591, 0.011078] | false |
| wall-pass fires per match | 10.315315 | 8.509510 | −1.805806 | [−2.116116, −1.504505] | true |
| wall return share of fires | 0.027851 | 0.022233 | −0.005618 | [−0.009941, −0.001117] | true |
| arriver sets per match | 16.473473 | 3.411411 | — | — | — |
| cutbacks taken per match | 5.277277 | 1.901902 | — | — | — |

The overlap-release branch fires MORE per designation on the OWN arms
(`coupling.overlapReleaseFiresPerSet` 0.292738 → 1.189369) while the designations themselves are
fewer. The wall reconstruction's calibration receipt `coupling.wallReconAgreesShare` is
**0.962494** on the control and **0.966278** on the arm of record.

#### THE CROWDING FAMILY

`crowd.crashShare` **0.437302 → 0.685503** (arm of record) and `guard.spacingUnder4`
**0.069371 → 0.135819** (`guard.spacingUnder4Pooled` 0.069321 → 0.135630). The dosed OWN arm
sits at 0.667948 / 0.129715; `OWN-D13` at 0.712796 / 0.143522.

#### THE SEAT'S `runMul` DISTRIBUTION — and what MARKER-ESCAPE actually doses

| arm | observations | mean | at 1 | below 1 | above 1 |
|---|---|---|---|---|---|
| `HATS-E13-ABSENT` (seat absent) | 455,261 | **1** | **1** | 0 | 0 |
| **`HATS-E13-DOSED` (seat DOSED)** | 439,215 | **1** | **1** | **0** | **0** |
| `HATSOWN-E13-ABSENT` | 1,607,321 | 0.999945 | 0.995318 | 0.003711 | 0.000972 |
| `HATSOWN-E13-DOSED` | 1,590,885 | 0.999893 | 0.994198 | 0.004909 | 0.000893 |
| `OWN-E13-ABSENT` | 2,357,141 | 0.999914 | 0.993193 | 0.005452 | 0.001355 |
| `OWN-E13-DOSED` | 2,357,842 | 0.999918 | 0.993466 | 0.005240 | 0.001295 |

⭐⭐⭐ **READ THE FIRST TWO ROWS TOGETHER.** `HATS-E13-DOSED` carries the MARKER-ESCAPE matrix and
its backed-out `runMul` is **EXACTLY 1 on all 439,215 observations** — because MARKER-ESCAPE puts
its two MAX weights on `planeDepth` and `planeWidth`, and its `runScore` row is ALL ZEROS
(`doseCopy.copiedMatrix` = `[0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0]`, `nonZeroSlots` **2**). **At this
dose the eyes move WHERE a body stands, and do not price his run at all.** The small off-1 mass
on the own-run arms is the BACK-OUT'S OWN NOISE FLOOR — it appears on the SEAT-ABSENT own-run arm
too (`HATSOWN-E13-ABSENT` 0.003711 below 1) where `obmRunMul` is 1 by construction. §HONEST
LIMITS 1 and 2.

### §R4 — THE CODE FACTS

**SIX `MakeRun` pushes in the corpus** (71 files, 579 extracted spans under `src/sim` + `src/ai`),
classified over the WHOLE enclosing-`if` chain:
`{"flagGated":1,"hatGuarded":3,"keeperUpGuarded":2,"unguarded":0}`.

| file:line | function | class | flag |
|---|---|---|---|
| `PlayerBrain.ts:1841` | `decideGoalkeeper` | `keeperUpGuarded` | — |
| `PlayerBrain.ts:1842` | `decideGoalkeeper` | `keeperUpGuarded` | — |
| `PlayerBrain.ts:2088` | `decideOffBall` | `hatGuarded` | — |
| `PlayerBrain.ts:2103` | `decideOffBall` | `hatGuarded` | — |
| `PlayerBrain.ts:2110` | `decideOffBall` | `hatGuarded` | — |
| **`PlayerBrain.ts:2164`** | `decideOffBall` | **`flagGated`** | **`dsOwnRun`** |

**`makeRunCandidatesAllHatGuardedOnShippedPath` = `true`**, DERIVED over the **5** pushes
reachable with both DS flags absent. #406 item 3(iii) is discharged: the seam's push is not
"unguarded", it is FLAG-GATED, and the flag it names is stored beside the boolean.

**THE READ FORKS.** Exactly **3** in `src/**` — `PlayerBrain.ts:2152` (`dsOwnRun`),
`TeamBrain.ts:295` and `TeamBrain.ts:314` (`dsHatsOff`) — and the per-file executable-line
occurrence counts are `PlayerBrain.ts` 1/0 · `TeamBrain.ts` 0/2 · `League.ts` 1/1 · `Match.ts`
4/4, **every other file 0**. Both tables were PARSED out of
[`DS-T0-OWN-RUN-SEAM.md`](DS-T0-OWN-RUN-SEAM.md)'s own READ-FORK INVENTORY and compared:
`forkInventoryAgrees` **true**, `flagCountsAgree` **true**, `a4WorldCleanOfBothFlags` **true**.

**THE FOUR HASHED ROOTS** (whole text + EXTRACTED callees, closure 90 spans at depth 5, uncapped):
`src/ai/TeamBrain.ts:191-370:assignRunners`
`9e0a45524915838bd1c115264d8d5913bcf1d22569bcbd08555620e73fd2f4a3` ·
`src/ai/PlayerBrain.ts:1925-2275:decideOffBall`
`78bb3b7b32ce635375e630e5dfdef0fc4485afe937a4854111cf6600238581d5` ·
`src/ai/actionExecutor.ts:123-1459:executeAction`
`b0f3979e9f37123ad46bd8c752642e1db42573078290a48ff6011cf903b0d629` ·
`src/ai/offballEyes.ts:266-274:obmOffballPolicy`
`c4e7df1bb0a5a6d5ca5a30bc8505e03973bbf42e45778aaae85e782dc5e0fbc6`.
The six designation fields resolve to **76** enumerated sites, and
`codeFacts.obmSeat.obmSeatReadsNoDesignation` is **true** — the seat still reads no hat.

### §R5 — THE READS, PRINTED

> ### THE RESTRAINT WAS THE COACH'S — H-DS-1 holds with or without eyes; the law needs a player-side restraint term (a later slice); the seam stays dormant.

* `floods(OWN, seat absent)` = **true** · `holdsBand(OWN, seat absent)` = **false** ·
  `floods(OWN, dosed)` = **true** · `holdsBand(OWN, dosed)` = **false**
* **the breached guard(s): `G9 guard.throughBallsPerMatch` (seat absent) · `G9
  guard.throughBallsPerMatch` (dosed)**
* the open-play board on the arm of record: `openPlayBoardEmpty` = **false**
  (`board.openPlayEmptyShare` 0.999912)

⚠ **THE THIRD BRANCH FIRES *AND* A GUARD BREAKS.** The frozen rule's own order (#406 item 5(v))
puts `floods ∧ floodsDosed` BEFORE the `otherwise` branch, so the read selected is read 3 even
though the band does not hold. **BOTH facts are printed** — the sentence and the named guard —
and the commander decides with the table. This exam does not re-argue the rule.

**BESIDE THE READ, from stored fields:**

* **THE HATS + OWN ARM'S OWN WORDS** (the additive form): seat absent — `floods` **true**,
  `holdsBand` **false**, breaching `G9 guard.throughBallsPerMatch`; dosed — `floods` **true**,
  `holdsBand` **false**, the same single guard.
* **THE YIELD PAIR** (⛔ no verdict word): shots per OWN-RUN episode **0.045048**
  (7,988 ÷ 177,320) against shots per HAT (runner) episode **0.099264** (1,174 ÷ 11,827); per
  match, `own.shotsPerMatch` **7.995996** against `ep.setsPerMatch.runner` **11.838839** episodes.
* **THE COUPLING SENTENCE** (⛔ no verdict word): overlap sets per match **3.115115 → 2.410410**,
  Δ **−0.704705** [−0.865866, −0.545546], resolved; wall-pass fires per match **10.315315 →
  8.509510**, Δ **−1.805806** [−2.116116, −1.504505], resolved.
* **THE PER-STATE LINE**: own runs won at a mate-owned tick **518.707708** per match, with the
  ball in flight **1280.089089**, at his side's own restart **554.439439**, other **5.969970**.

**THE COUNTERFACTUAL WORDS, STORED** (canon: *counterfactual words are stored* — each computed by
the SAME frozen rule on ITS OWN stored intervals):

* had the DOSED OWN arm been the arm of record, the rule would read **read3** — *"THE RESTRAINT
  WAS THE COACH'S …"*.
* D13's own word is **read3**, and the stored agreement boolean prints **THIS ARM SELECTS THE SAME
  READ**.

### §R6 — 在说人话的层面

**问题是「教练那顶帽子能不能摘」。答案是：不能——现在还不能,而且原因跟考试写下的那句话有出入。**

摘掉帽子以后,**跑的人一下子多了三倍**。原来一格里平均有 **0.584786** 个人在往前插,摘了以后是
**1.832816**;原来「同时三个人以上往前冲」只占 **0.014729** 的时间,现在占 **0.328737** —— 三分之
一的进攻时间,场上有三个或更多的人同时在冲。这个差是 **八十个半宽**,不是噪音。九条臂、两本书、
有没有眼睛,读出的都是同一句话。

**十道守门里只破了一道,而破的那道正好是这次改动的形状:直塞球。**每场从 **5.962963** 涨到
**8.750751**,涨了将近一半,远超容差。这不奇怪:前插本来就是给直塞球找人的动作,人多了,能塞的
球就多了。进球、射门、控球、传球成功率、抢断、传球距离——没有一道破护栏;其中抢断(每场 −4.638639)、
传球次数(−11.173173)、传球距离(−0.334242 m)三项有分辨率地动了,但都在容差内(§COMMANDER
CORRECTIONS 3)。越位旗**六条臂全部举起**(记录臂每场 +0.730731;六条臂在 +0.302302 到 +1.064064 之间,
都有分辨率),这正是 DS-T0 §HONESTY 8 提前说过的那件事。

**但有一件事必须先说清楚,否则这句读法会被误读。**考试要求的那副眼镜叫 MARKER-ESCAPE,而
**MARKER-ESCAPE 根本不给「跑」定价**——它的十六个格子里只有两个非零,都落在「站位深度」和
「站位宽度」上,`runScore` 那一行**全是零**。所以戴上眼镜以后 `obmRunMul` 恒等于 1(439,215 次观测,
一次都没偏)。**H-DS-2 这次没有被测到**:不是眼睛没救得了洪水,是这副眼镜压根没碰过那个
旋钮。要真测 H-DS-2,需要一个在 `runScore` 上有权重的剂量——那就是 OBM-T2 的事。

**另外两件给指挥官的话。**第一,**球员自己的跑和教练点的名不是同一种跑**:一半以上(0.542593)
的自主前插发生在**球还在空中飞**的时候,而教练的帽子只有 0.080620 落在那里;各状态下每次跑被瞄准的
次数照数字说、不排名:有人持球时 0.047903,球在飞时 0.025669,本方定位球时 0.018063(§COMMANDER
CORRECTIONS 1)。第二,**跑的人换了**:前锋的
份额从 0.511573 掉到 0.349599,边锋从 0.425219 涨到 0.577084 —— 那个 prior 是「角色权重 + 位置
深度」,边锋天生站得又宽又靠前,于是他成了最爱跑的人。

**挤在一起的程度也上去了**:最近两人小于四米的抽样比例从 0.437302 涨到 0.685503。这跟「三个人
同时冲」是同一件事的两种量法。

---

## §HONEST LIMITS

*(canon: this list is the ONE home; the artifact stores NONE of it and its `stage.honestLimitsNote`
points here.)*

1. ⛔⛔ **H-DS-2 WAS NOT TESTED. MARKER-ESCAPE DOES NOT PRICE THE RUN.** The dose the ruling named
   puts its two MAX weights on `planeDepth` and `planeWidth`; its `runScore` row is all zeros, so
   `obmRunMul` is EXACTLY 1 on every one of the 439,215 backed-out observations of the DOSED
   control arm. The dosed arms differ from the seat-absent arms through WHERE bodies stand, not
   through what a run is worth. `floods(OWN, dosed)` = true is therefore evidence about the
   PLANE, **not** evidence that eyes cannot restrain a flood. A real test of H-DS-2 needs a dose
   with weight on `runScore` — which is OBM-T2's dose space.
2. **THE `runMul` BACK-OUT HAS A MEASURED NOISE FLOOR, AND IT IS PUBLISHED.** On the seat-ABSENT
   own-run arm `HATSOWN-E13-ABSENT`, where `obmRunMul` is 1 by construction, **0.003711** of
   observations back out below 1 and **0.000972** above. The cause is a decision record read at
   the end of a tick on which the body did not decide under the post-step predicate — a stale
   record. ⛔ The sentence "every off-1 mass in the table is at or below this floor" is STRUCK
   (§COMMANDER CORRECTIONS 2): the dosed additive arm's below-1 share 0.004909 and the OWN arms' 0.005452
   / 0.005240 (above-1 0.001355 / 0.001295 / 0.001310) EXCEED it. The claim that carries the weight is the
   ARITHMETIC IDENTITY, not the floor: MARKER-ESCAPE's `runScore` row is all zeros (slots 12–15 of the
   byte-copied matrix) and `runMul = 1 + outputs[3] · OBM_SCORE_SPAN`, so `obmRunMul` is EXACTLY 1 on
   every arm at this dose and every off-1 observation is back-out artefact; the floor is exactly zero on
   the two arms without `dsOwnRun`.
3. **`openPlayBoardEmpty` IS `false` ON THE ARM OF RECORD, AT 0.999912.** 54 of 614,148 open-play
   in-possession coach ticks carry a non-empty board under `dsHatsOff`. The cause is the BRANCH
   RECONSTRUCTION, not the flag: the branch is classified from the engine's own fields PRE-STEP
   with the clock at `simTime + DT`, and a tick the engine took down the held-crash or live-corner
   path can be classified `openPlay` here. The dosed OWN arm reads exactly 1.000000. The read
   prints the boolean, not the claim.
4. **G8 IS A DECLARED RECONSTRUCTION.** The engine keeps no pass-length ledger. `guard.
   meanAimDistanceMetres` is the passer→target straight-line distance at the tick a NEW
   `pendingPass` appears, with both positions read at the END of that tick. It is a proxy for the
   engine's own passer→LED-POINT geometry, and its name says "aim distance".
5. **`crowd.crashShare`'s POSSESSION ATTRIBUTION IS NOT LN-T1'S.** The numerator predicate is
   PT-C0's, byte for byte (minimum pairwise same-side outfield distance below 4 m at the A4
   battery's own 6 Hz cadence), but the side is attributed by `ball.owner`, else
   `match.possessionSide` — LN-T1 attributed a loose ball through a ground-pass FLIGHT TRACKER
   this exam does not build. The level is therefore not comparable to LN-T1's level; the paired Δ
   within this exam is.
6. **THE COUPLING IS MEASURED AS SETS AND FIRES, NOT AS LIVE TICKS.** DS-T0's verifier reported
   overlapper-set TICKS 321 → 543 and live-`wallRun` TICKS 7,807 → 10,849 on four of its own
   seeds. This exam measures overlap DESIGNATIONS per match and wall-pass FIRES per match, and
   both go DOWN under `dsHatsOff` (resolved). **These are different units on different seeds; no
   contradiction is claimed and none should be read in.** A ticks-based coupling face is named for
   whoever measures it next.
7. **THE OWN RUN IS PRICED IN STATES THE SHIPPED LICENCE GATES OUT, AND THAT IS NOW A NUMBER.**
   0.542593 of own runs are won while the ball is in flight between mates and 0.235011 at his
   side's own restart, against 0.080620 and 0.397269 for the coach's hats. By design (seam doc
   §HONESTY 8) — but it means the arm of record is NOT "the same run, differently authorised".
8. **THE DF LOWER CLAMP BITES, AND IT SHOWS.** `runsByRole.share.DF` is 0.000908 on the arm of
   record against 0.005780 on the control: a defender in his own third prices his own run at
   exactly 0 (seam doc §LAW, ruling #406 item 2). The exam inherits that as a property of the law
   under test, not as a defect.
9. **THE TIRED LIMB IS UNPINNED, INHERITED.** No body reaches `stamina < 0.4` inside a match
   (#406 §CORR 4), so the `OFFBALL_TIRED_MUL` factor in both the score and the `runMul` back-out
   is exercised by no walked tick. The back-out's fixture covers it; the battery does not.
10. **THE `runMul` OBSERVATION IS CENSORED BY THE RECORD'S TOP-FOUR SLICE.** `decideOffBall`
    stores `cands.slice(0, 4)`, so a run candidate that lost badly is invisible. The denominator
    is published (`runMul.observationsPerMatch`) and the share backed out of each source
    (`runMul.fromOwnRunShare`) beside it.
11. **THE SIZING VARIANCE CAME FROM 12 CLUSTERS.** Canon calls that noisy. The REALISED
    half-widths at N = 999 are **0.015461217247865977** (R1) and **0.004654365643399827**
    (`passCompletion`), both far inside the declared 0.05 target, so the projection was
    conservative in the right direction.
12. **THE D13 ARMS ARE BESIDE, NOT OF RECORD**, and only the three seat-absent ones were walked:
    the played book × the dosed seat is not measured here.
13. **G6 IS ONE SIDE'S SHARE.** `guard.possessionShareSideA` and its complement sum to 1 by
    construction, so one of them is the whole face; the field name says which.
14. **A MACHINE READING ON ONE MACHINE**: `perf.meanWallSecondsPerMatch` **0.14171905238571905**.

## §DEVIATIONS (declared by the executor; the commander disposes)

1. ⚠⚠ **#406 item 5(iii) SAYS THROUGH BALLS ARE CLASSIFIED "AT `registerPass`". THEY ARE NOT.**
   The engine's own `stats.throughBalls` counter is incremented in `performThroughBall`
   (`src/sim/mechanics.ts:508`), which then CALLS `registerPass`. G9 reads the engine's own
   counter and the anchor names its true enclosing function. This is the #405 item 1 precedent
   (the wall trigger's enclosing function is `performPass`, not `registerPass`) recurring on the
   same file; the guard is unchanged in substance.
2. **G8's "MEAN PASS DISTANCE" IS A DECLARED RECONSTRUCTION** (§HONEST LIMITS 4). The dispatch
   names the face; the engine has no ledger for it, so the field is named
   `guard.meanAimDistanceMetres` and its `what` says so.
3. ⚠⚠ **THE `runMul` DISTRIBUTION IS BACKED OUT OF THE STORED CANDIDATE SCORE, NOT RECOMPUTED.**
   Recomputing `obmOffballPolicy` would call `match.perceivedSnapshot`, which MUTATES the body's
   perception memory through `reconstructBodyMemory` — the observation would no longer be
   byte-inert and `gLockstep` would be a lie. The back-out inverts the seam's own arithmetic on
   the engine's own record (canon: **engine ledgers before heuristics**) and is fixture-pinned in
   four directions, with its noise floor published (§HONEST LIMITS 2).
4. **THE `runMul` FACES ARE TAKEN ON EVERY ARM, NOT ONLY THE DOSED ONES.** The dispatch asks for
   the dosed arms. Taking the same measurement on the seat-ABSENT arms costs nothing and is what
   MAKES the noise floor visible; without it the 0.5 % off-1 mass on the dosed arms would have
   been read as the seat pricing runs down.
5. **N IS THE BLOCK'S AFFORDANCE (999), NOT `nRequired` (62).** #406 item 5(vii) says
   "N = min(required, the affordance) — say which". Said: **the affordance**. Both sized rows
   resolve at 62 and 18, so the requirement is strictly dominated; canon's *seed discipline*
   consumes a block WHOLE of record, and the rare populations this exam must not report as
   vacuous (overlap arrivals, cutbacks, the keeper-up run) are sized by volume alone. The LN-C0 /
   GK-C0 / DS-C0 precedent.
6. ⚠ **THE SIX PUSHES ARE `1 flagGated + 3 hatGuarded + 2 keeperUpGuarded`, NOT "FIVE
   HAT-GUARDED".** #406 item 5's code-fact line reads "five hat-guarded and ONE `flagGated`". The
   classifier's own words are stored: of the FIVE pushes reachable with both flags absent, THREE
   are guarded by a designation field and TWO by the keeper-up licence — and those two are the
   SAME candidate literal spanning two source lines (`type:` and `action:`), which DS-C0's census
   already counted as two sites. The boolean the ruling actually asks for,
   `makeRunCandidatesAllHatGuardedOnShippedPath`, is TRUE and is DERIVED, not typed.
7. **THE PUSH CLASSIFIER WALKS THE WHOLE ENCLOSING-`if` CHAIN**, where DS-C0's took the nearest
   guard only. Declared in advance at #406 item 3(iii); without it the seam's push would classify
   as `unguarded` and the boolean would be FALSE for a reason that has nothing to do with the
   shipped path.
8. **THE MIRROR HALF OF THE WALKER IS BYTE-FAITHFUL TO DS-C0 EVEN WHERE THAT IS ODD.** DS-C0's
   population-B loop reads `m.restart` AFTER the step for its restart-taker early return; the
   mirror does the same so `G-REPRO-DSC0`'s B/D half can be compared. This exam's OWN state
   classifier reads the PRE-STEP restart, which is its own definition and is fixture-pinned.
9. **`gBite`'s EXEMPTION IS DEFINED AND EMPTY.** A seed is exempt only when the armed arm records
   ZERO own-run decisions (no candidate for `dsOwnRun` to push); the `dsHatsOff` arms are never
   exempt. **No seed was exempt on any arm** — 999/999 differ on all six contrasted arms, and the
   seat's own bite is 999/999 as well.
10. **`allGreen` IS SEEDED `false` BEFORE THE SCHEMA CHECK AND OVERWRITTEN WITH THE REAL VERDICT.**
    It is a BODY key whose value depends on `gHashOrder` itself; seeding it makes the
    "every body key is defined" check honest for every key, and the written value is the real one.
11. **THE OFF-BALL `MakeRun` SHARE AND THE DECISION-TICK COUNTS ARE PUBLISHED IN BOTH FORMS.**
    #405 item 1 DOWNGRADED DS-C0's versions to approximations. This exam's form of record is the
    post-step one and the pre-step form is published beside it; the ratio to the engine's own
    ledger is 0.9999995085359418 against 0.9963580961292834 on the control arm.

## §GATES — 23 of 23 GREEN (`allGreen` = true, a STORED boolean)

| gate | ✅ | derived note |
|---|---|---|
| `gWorld` | ✅ | per arm, on every walked match AND the construction receipt: `bqArmedVersion` 13 with the cushion, both later doors absent, `edsPerceivedChoice`, every CTB/RC/BF seam absent, the TWO DS FLAGS exactly as due, `obmMovement` exactly as due with the 16-slot matrix on `baseGenome` + `effGenome` of both teams on exactly the dosed arms, and `info.genome` CLEAN of the matrix on every arm; re-pinned on constructed matches at 900,006,270 |
| `gDoseCopy` | ✅ | **16** slots compared, **16** equal; exactly **2** non-zero, both at the domain MAX; MARKER-ESCAPE byte-copied from `obm-t1-policy-exam.ts` and re-derived by a second, independently shaped sweep off the `OBM_*` exports |
| `gDoseSource` | ✅ | both dose files' BYTES hashed against their pins BEFORE any seed; the D13 arms ride the SHIPPED loaders, never `info.genome` |
| `gAnchoredConstants` | ✅ | **136** anchored sites, every one at its declared occurrence count (including the two ZERO-count anchors proving neither DS flag appears in `a4World.ts`, and the zero-count anchor over the executor); every constant PARSED from its own line; `NI_FRACTION` = 0.2763157894736842 inherited as an EXPRESSION from two independent instrument files and equal |
| `gPredicateFixtures` | ✅ | **102** fixtures, each predicate with a firing and a non-firing case — including DEBT (a)'s two forms DISAGREEING on a hold armed inside the step, the own-run episode's set/clear, the state classifier's four cells, the prior at every role at every quarter-metre, and the `flagGated` classifier on the seam's own push |
| `gLedgerRead` | ✅ | every join reads an engine record; the three declared reconstructions (the wall conjuncts, G8, the passer upper bounds) say so, and the wall one carries `coupling.wallReconAgreesShare` **0.962494** on the control |
| `gClassesNonVacuous` | ✅ | `emptyEpisodeClasses` **[]**; the only empty run classes and state cells are the `ownRunInBehind` / `own.*` cells on the three arms WITHOUT `dsOwnRun` — structural, enumerated and STORED |
| `gCodeFactGraph` | ✅ | 71 files, 579 spans, **76** designation-field sites all resolved, four roots hashed whole with extracted callees, closure 90 spans at depth 5 uncapped, the six pushes classified, the fork inventory and per-file counts PARSED from the seam doc and EQUAL |
| `gBite` | ✅ | **999/999 on all six contrasted arms, zero exempt**; the seat's own bite 999/999 |
| `gRepro` | ✅ | **G-REPRO-DSC0: the A/C half 66 fields × 12 seeds, ZERO mismatches**; the B/D half 18 fields compared with DS-C0's OWN PRE-STEP form — **IDENTICAL on every seed**, so the whole PRE-STEP/POST-STEP delta is the calibration receipt and nothing else moved since the census |
| `gLockstep` | ✅ | observed ≡ unobserved whole-match signature on all **18** arm × scratch walks; the instrument installs no wrapper and never calls `perceivedSnapshot` |
| `gDeterminism` | ✅ | X-DET twice per arm on two scratch seeds: signatures AND row bytes identical, **18** pairs |
| `gFingerprintProd` | ✅ | X-FP-PROD recomputed in-process = the literal of record, UNCHANGED |
| `gSrcUntouched` | ✅ | `git diff --stat HEAD` and `git status --porcelain` EMPTY over **src/ AND tests/** — X-SRC-ZERO |
| `gSeedsBookedEqualWalked` | ✅ | 999 distinct battery seeds + the receipt at 12,554,999, nine arms ⇒ **9,000 walks booked**; `unwalkedTail` **null**; every scratch seed ≥ 900,000,000 and STORED |
| `gSeedDisjoint` | ✅ | the whole battery inside 12,554,000–999, disjoint from all ten consumed blocks; the re-walks inside DS-C0's own band |
| `gN` | ✅ | N = 999, no override env; both sizing rows `resolvableAtNFrozen` true (62, 18) and the REALISED half-widths published |
| `gLoo` | ✅ | **60** scoped rows (R1 + the nine gating guards × six contrasted arms), 999 seeds dropped each; R1 flips 0 everywhere, G9 flips 0 everywhere |
| `gTwoFractions` | ✅ | **15** read-bearing pairs, each published per its own denominator AND per match; **2,079** face rows over 231 keys × 9 arms and **1,386** Δ rows |
| `gFaces` | ✅ | **3,465 / 3,465** face-and-Δ checks and **258 / 258** bin / median / top-bin-share / partition / R1 / GUARD / READ-WORD / sizing checks re-derived off the SERIALIZED artifact |
| `gReadWords` | ✅ | `floods`, every guard row's harmful-direction test, `holdsBand`, the selected read, BOTH counterfactual words and the agreement word re-derived from the serialized rows; every printed sentence is one of the FOUR frozen literals |
| `gHashOrder` | ✅ | a **39**-key allowlist schema; the body hash computed LAST; the NON-body receipt reproduces from the written file |
| `gStage` | ✅ | `stage.instrument` is this instrument's path and `stage.instrumentSha256` is the sha256 of the RUNNING file re-read from disk |

**PROSE SWEEP** (canon: *a stage doc's numeric sweep covers EVERY numeric literal in prose at ANY
precision*). Every numeric literal in §0–§R6, §HONEST LIMITS and §DEVIATIONS is an artifact field
value at 6 dp, a stored count, a stored hash, a source line number carried by an anchor or a code
fact, or a seed. The ONLY exceptions are declared: **§DEV-PREFLIGHT's two smoke Δs (1.280559 and
−0.016342) are 12-cluster scratch values that exist nowhere in the final artifact and load-bear
nothing**, and its wall reading **37.7** s is a scratch timing; the two `hwSmoke` half-widths
beside them DO live in `sizing.rows`. The artifact's own **41,271,128** byte count and its file
sha256 cannot live inside the artifact (they would be self-referential) and are published here
per canon; **900,000,000** is the scratch-range floor from the canon sentence quoted at §P.7.
Negative values are written with a typographic minus and are stored NEGATIVE in the artifact
(e.g. Δ −0.704705 is `overlapSetsDelta`); the sweep's one remaining hit,
`0100010000000000`, is the dose matrix `[0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0]` read as a digit run.
The FREEZE commit hash and the derived counts in this §GATES table (`23`, `999`, `9,000`, `18`, `60`, `15`,
`3,465`, `258`, `39`, `136`, `102`, `76`, `71`, `579`, `90`, `5`, `66`, `12`, `16`, `2`) are read
off the artifact's own arrays and gate notes.

## §COMMANDER CORRECTIONS (ruling #407 — the exam BANKED, THE READ OF RECORD with the breached guard beside it; verifier FAIL on two PROSE highs disposed in place; two MEDIUM and five LOW; §P and the instrument untouched)

The independent verifier re-implemented R1, the own-run episode and the goal join from §P alone and
reproduced every stored cell; ran its own bootstrap over all nine guards on all six contrasted arms and
found the one breach the stage found (G9, every arm); rebuilt all six E13 arms by hand and confirmed the
dose slot for slot and `info.genome` clean everywhere; traced a goal by a running winger through the
shooter join; reproduced the calibration receipt (post-step held ticks = the engine's ledger exactly on
a seed); re-walked two G-REPRO seeds; recomputed all four node hashes. Verdict FAIL — on two sentences.

1. **HIGH (PROSE) — A FALSE SUPERLATIVE ON A YIELD FACE IN §R6.** 「球在飞的时候跑,回报也最低」 was both a
   verdict word the stage forbids itself and WRONG: the per-state table has the in-flight state second
   of four (aimed per run 0.025669 against the restart's 0.018063 and 'other' 0.002683). Struck; the
   numbers stand, unranked.
2. **HIGH (PROSE) — A FALSE UNIVERSAL IN §HONEST LIMITS 2** ("every off-1 mass … at or below this
   floor"): five entries exceed the published floor. Struck and replaced by the arithmetic identity that
   actually carries the point — MARKER-ESCAPE's `runScore` row is zero, so `obmRunMul ≡ 1` at this dose
   and every off-1 observation is back-out artefact (the verifier confirmed the identity at
   `offballEyes.ts:244`).
3. **MEDIUM — 「一道都没动」 over-scoped**: none BREACHED, but interceptions (−4.638639), passes
   (−11.173173) and mean aim distance (−0.334242 m) moved with resolved intervals inside tolerance.
   Corrected in place; the offside FLAG's six Δs quoted as a range.
4. **MEDIUM — two denominators in one population-B table** (outfield off-ball ticks vs attacking
   `MakeRun` decisions including the keeper's). A note added above the table; the artifact's `denNote`
   was already right.
5. **LOW ×5, accepted**: §P.7's pointer to §DEVIATIONS 4 should read 5 (§P is frozen — errata here);
   "unchanged" → "essentially unchanged" with the second number printed; the report's R1 fractions were
   the per-match values ×10³ (the doc's line was right); the doc is 855 lines not 846.
6. **THE COMMANDER'S OWN ERRORS, STRUCK**: (i) #406 item 5(i) named MARKER-ESCAPE as the dose that
   would answer H-DS-2 — it CANNOT: its two MAX weights sit on the plane outputs, its `runScore` row is
   zero, so READ 2 was UNREACHABLE BY CONSTRUCTION (§HONEST LIMITS 1 and §DEVIATIONS 3 found it by
   measurement, and did not let `floods(OWN,dosed)` pose as an H-DS-2 answer); (ii) #406 item 5(iii)
   said through balls are classified "at `registerPass`" — the engine's counter lives in
   `performThroughBall` (mechanics.ts l.508), which then calls `registerPass` (the #405 item 1
   precedent recurring on the same file; the guard's substance unchanged).
7. **RATIFIED**: §DEVIATIONS 1–11 (esp. 3 — the `runMul` back-out instead of a recomputation, because
   `obmOffballPolicy` would pull `perceivedSnapshot` and MUTATE perception memory, breaking byte-inertia;
   4 — the back-out on every arm, which is what made the noise floor visible; 6–7 — the six pushes as
   1 flag-gated + 3 hat-guarded + 2 keeper-up-guarded over the whole enclosing chain). THE THREE DS-C0
   DEBTS ARE PAID with receipts (post/ledger 0.9999995085359418 against the pre-step form's
   0.9963580961292834; `goalRowJoinShare` 1.000000; the top bin opening at 144 > 138 ticks with its
   share beside every median).
