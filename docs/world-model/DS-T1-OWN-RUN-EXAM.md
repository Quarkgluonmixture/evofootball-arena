# DS T1 — 「自己的前插 · 考试」 THE OWN-RUN EXAM

Status: **§P AND THE INSTRUMENT FROZEN; THE BATTERY HAS NOT RUN.** This document's §P (the
protocol) and `scripts/probes/ds-t1-own-run-exam.ts` are committed BEFORE the battery, and §P is
never edited after sight. §DEV-PREFLIGHT below discloses the 12-seed scratch smoke the sizing
stands on. The STATUS word flips at the RESULTS commit.

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

*(written at the RESULTS commit; §P above is frozen and unedited.)*
