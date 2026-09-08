# DS T1c — 「自己的前插 · 三考」 THE OWN-RUN EXAM, THIRD RUN

Status: **WALKED — the battery is complete, ALL 25 GATES GREEN (`allGreen` = true), and the READ
IS PRINTED AT §R5.** §0 through §DEV-PREFLIGHT were sealed at the FREEZE commit **`64e8ec7`** and
were NOT edited after sight; the instrument is byte-identical between FREEZE and RESULTS
(`git diff 64e8ec7 -- scripts/probes/ds-t1c-own-run-exam.ts` EMPTY). X-SRC-ZERO holds throughout:
not one byte under `src/` or `tests/` is created or edited. **NOTHING SHIPS** — the two DS flags
remain absent from every world and the production fingerprint is unchanged. The commander rules.

Authority: **COMMANDER RULING #410 item 3** (the dispatch — DS-T1b's twelve arms unchanged, the
seam's faces ADAPTED to the rank law, the reads RE-FROZEN, the gate set plus G-REPRO-DST1b ·
gCodeFactGraph · gPullCount · gScratchBand, the seeds), standing on **#410 item 2** (the law of
record, M-DS.6″ + M-DS.7 — the coach's ranked selection moved into the player) and **#409 items
2–5** (DS-T1b's numbers of record, the commander's diagnosis, and the two form rules: the flood
selector's column is `beyondToleranceUp`, and a LOO flip count is read off the `loo` array). It
INHERITS **#408 item 5** (DS-T1b's full specification) and, through it, **#406 item 5** (DS-T1's:
the arms' form, R1, the band, the faces, the READS, the gates). **#410 item 4** says what the
reads would mean; that is the commander's, not this doc's.

* THE SEAM UNDER EXAM (read, never touched): [`DS-T0-OWN-RUN-SEAM.md`](DS-T0-OWN-RUN-SEAM.md)
  §LAW-C · §HONESTY-C · §SEAM-C · §COMMANDER CORRECTIONS-C.
* THE INSTRUMENT INHERITED: [`DS-T1B-OWN-RUN-EXAM-RERUN.md`](DS-T1B-OWN-RUN-EXAM-RERUN.md) +
  `scripts/probes/ds-t1b-own-run-exam.ts` (with its §COMMANDER CORRECTIONS 1–8, all applied here).
* THE EXAM BEFORE IT: [`DS-T1-OWN-RUN-EXAM.md`](DS-T1-OWN-RUN-EXAM.md).
* THE WALKER BEHIND THEM: [`DS-C0-DESIGNATION-CENSUS.md`](DS-C0-DESIGNATION-CENSUS.md).
* THE DOSE IDIOM: `scripts/probes/obm-t1-policy-exam.ts`; THE DOSE-COPY FORM:
  [`LN-T1-LANE-EXAM.md`](LN-T1-LANE-EXAM.md).
* CONTRACT: [`DS-DESIGNATION-CONTRACT.md`](DS-DESIGNATION-CONTRACT.md) §2 M-DS.1–5, M-DS.6″,
  M-DS.7.
* INSTRUMENT: `scripts/probes/ds-t1c-own-run-exam.ts`.
  ARTIFACT: `data/ds-t1c-own-run-exam.json`.

---

## §0 — WHAT THIS IS AND WHY

**THE QUESTION (#410 item 3, not re-argued here): with the coach's RANKED selection moved into
the player — his rank among the mates he perceives, by the shared convention — does the own run
hold the coach's band WITHOUT the coach (H-DS-5), and does the eyes' price move it INSIDE the
band rather than draining it (H-DS-6)?**

**THE ARC'S THREE READINGS SO FAR, EACH QUOTED BY FIELD.** This exam's artifact stores DS-T1's
and DS-T1b's own values under `hNumbers.hDs5.dsT1Quoted` and `hNumbers.hDs5.dsT1bQuoted`, read
out of their artifacts and never typed in the instrument.

1. **DS-T1 — THE FLOOD.** With the coach's hats off and no player-side restraint, R1 went
   **0.584786 → 1.832816** (`r1.levels` in
   [`data/ds-t1-own-run-exam.json`](data/ds-t1-own-run-exam.json); paired Δ **+1.2480304779783737**
   on `OWN-E13-ABSENT`) and G9 through balls **+2.7877877877877877**. Its READ OF RECORD (ruling
   #407 item 3, a frozen literal, quoted):
   > *"THE RESTRAINT WAS THE COACH'S — H-DS-1 holds with or without eyes; the law needs a
   > player-side restraint term (a later slice); the seam stays dormant."*
2. **DS-T1b — THE DRAIN.** DS-T0b's VELOCITY MASS did not tame the flood, it drained it: R1
   **0.585428 → 0.138356** (paired Δ **−0.44707176052829445**) and G9 through balls
   **6.156156 → 2.133133** (Δ **−4.023023023023022**) — a guard breached DOWNWARD. Its READ OF
   RECORD (ruling #409, a frozen literal, quoted):
   > *"A GUARD BREAKS — the guard is named; the commander decides with the table."*
3. **THE DIAGNOSIS THIS EXAM MEASURES** (ruling #409 item 3(iv), the commander's own words,
   quoted):
   > *"the coach restrained the run by a RANKED SELECTION — the top `count` bodies by
   > `RUN_ROLE_W[role] + localX/45` were licensed, all others not — and DS-T0b decentralised it
   > as a VELOCITY MASS: every body discounted by how much forward motion he perceives, which
   > the whole team's advance supplies whether or not anyone is "running in behind" (mean
   > restraint 0.57; a fifth of candidates priced to exactly 0), on top of the perceived-owner
   > guard withdrawing the in-flight run (DS-T1's 0.542593 → 0.100272). The two together drain
   > the run. The player-side equivalent of the coach's rule is his RANK among the mates he
   > perceives, by the shared convention — not the motion he sees."*

**THE RANK LAW, NAMED (M-DS.6″, ruling #410 item 2; the seam doc §LAW-C).** `runRank(role,
localX) = RUN_ROLE_W[role] + localX / RUN_DEPTH_DIV` is the coach's own expression CODE-MOVED and
exported — the shipped `assignRunners` `.map` now CALLS it, so the ranking and DS-T0's `/ 45`
exist ONCE in `src/**`. For each PERCEIVED same-side body that resolves by gid to a roster mate
who is not himself, not the perceived carrier, not the keeper and not sent off, `theirs =
runRank(mate.role, localX(body.pos.x))` — the ROLE off the roster, the POSITION off the
SNAPSHOT's copy — and `rankAbove` counts those with `theirs > mine || (theirs === mine &&
mate.index < p.index)`, the coach's own comparator with himself as one side. Then `restraint =
clamp01(count − rankAbove) ∈ {0, 1}` — the coach's `scored.slice(0, count)` expressed as a CAP.
The score's order is DS-T0's: `s = W.runScore · prior · restraint`, `× OFFBALL_TIRED_MUL` if
tired, `× obmRunMul` last. **The velocity mass is REMOVED** — no `.vel`, no `topSpeed`, and this
exam stores that as a boolean derived from the block's whole text. **M-DS.7 is byte-unchanged**:
the own run exists only when the PERCEIVED ball's owner is a mate.

**IT IS AN EXAM. It arms nothing in the game; nothing ships.** X-SRC-ZERO: no file under `src/`
or `tests/` is created or edited. The reads are the four frozen literals; H-DS-5's and H-DS-6's
numbers are PRINTED BESIDE them and never judged — and the commander rules.

---

## §P — THE FROZEN PROTOCOL

*(⭐ **AMENDMENT** marks every place this protocol differs from DS-T1b's #408 item 5 protocol,
which is otherwise INHERITED SECTION BY SECTION. DS-T1b's §COMMANDER CORRECTIONS 1–8 are applied
here, not re-argued.)*

### §P.1 — THE ARMS, AND THE TWO DOSE COPIES (INHERITED UNCHANGED)

**On E13** (world 13 EMPTY-BOOK — `a4MatchFlags(13)` + `armA4World(m, null, 13)`, ③'s control and
DS-T1b's construction byte for byte), the NINE ARMS OF RECORD:

| arm | `dsOwnRun` | `dsHatsOff` | OBM seat |
| --- | --- | --- | --- |
| `HATS-E13-ABSENT` | — | — | absent — **the shipped path, the control** |
| `HATS-E13-RUNCAUTION` | — | — | RUN-CAUTION |
| `HATS-E13-KITCHENSINK` | — | — | KITCHEN-SINK |
| `HATSOWN-E13-ABSENT` | ✓ | — | absent — **the ADDITIVE form** |
| `HATSOWN-E13-RUNCAUTION` | ✓ | — | RUN-CAUTION |
| `HATSOWN-E13-KITCHENSINK` | ✓ | — | KITCHEN-SINK |
| **`OWN-E13-ABSENT`** | ✓ | ✓ | absent — ⭐⭐⭐ **THE ARM OF RECORD** (H-DS-5) |
| **`OWN-E13-RUNCAUTION`** | ✓ | ✓ | RUN-CAUTION — ⭐⭐⭐ **"dosed" IN THE READS**; H-DS-6's arm |
| `OWN-E13-KITCHENSINK` | ✓ | ✓ | KITCHEN-SINK — the CEILING probe; its word STORED BESIDE |

**On D13** (the PLAYED form — the same world 13 with the SHIPPED loaders' L3 and PC doses through
`armA4World`), the THREE seat-absent arms `HATS-D13` · `HATSOWN-D13` · `OWN-D13`, published
BESIDE. **TWELVE walks per seed.**

**THE PAIRING.** Every Δ is against the HATS arm at the SAME seat state and the SAME book
(`CONTROL_OF`): the E13-absent arms against `HATS-E13-ABSENT`, the RUN-CAUTION arms against
`HATS-E13-RUNCAUTION`, the KITCHEN-SINK arms against `HATS-E13-KITCHENSINK`, the D13 arms against
`HATS-D13`.

**THE TWO DOSES (unchanged, by anchor).**

* **RUN-CAUTION** = `matrix([O_RUN, F3, MIN], [O_RUN, F2, MIN])` in obm-t1-policy-exam.ts's own
  `matrix(...)` idiom (`IDX` · `F1..F4` · `O_DEPTH..O_RUN` · `ZERO_MATRIX` · `matrix()` · the
  MIN/MAX aliases, all anchored): `targetCongestion` (F3) and `ownMarker` (F2) price the RUN DOWN
  at the domain MINIMUM, and the plane and support rows are all zero. ⛔ **A HAND-SET PROBE
  CORNER, DECLARED AS ONE — it is NOT a dose of record**; the dose space belongs to selection
  (#390).
* **KITCHEN-SINK** = OBM-T1's CEILING PROBE, **byte-copied** from `obm-t1-policy-exam.ts`
  l.500–509 (`O_DEPTH` MIN, `O_WIDTH` MAX, `O_SUPPORT` MAX, `O_RUN` MIN on every feature). Not a
  football recommendation; nothing about it is proposed for shipping.

**G-DOSE-COPY (both matrices).** Each is RE-DERIVED slot for slot by a SECOND, independently
shaped derivation straight off the `OBM_*` exports (a full output × feature sweep filling each
slot from a per-arm rule — LN-T1's form), and each owes a SHAPE ASSERTION: RUN-CAUTION has
EXACTLY TWO non-zero slots, both at the domain MIN and both in the `runScore` row, with the plane
and support rows zero; KITCHEN-SINK has all sixteen at a domain corner with the `runScore` row at
MIN. The struck MARKER-ESCAPE matrix and its zero `runScore` row are stored beside for comparison.

**DOSE PLACEMENT (canon).** The arm's matrix is written on the MATCH-LOCAL `baseGenome` AND
`effGenome` of BOTH teams and **NEVER on `info.genome`**. The two views are DE-ALIASED FIRST with
the engine's own idiom (`{ ...team.baseGenome, … }`, `setCbProneness`'s shape, anchored), and
`gWorld` carries an `infoGenomeCleanOfMatrix` conjunct asserted on EVERY walked match of EVERY arm.

**gWorld, per arm, on every walked match and the construction receipt:** `bqArmedVersion(m) === 13`
with `bqCushion` TRUE; `lnArmedVersion(m) !== 14` and `lnOwnLanePrice` ABSENT; `gkArmedVersion(m)
!== 15` and `gkDiveBody` ABSENT; `edsPerceivedChoice` TRUE; every CTB / RC / BF seam ABSENT; the
TWO DS FLAGS EXACTLY AS DUE; `obmMovement` EXACTLY AS DUE with the arm's OWN 16-slot matrix on
`baseGenome` and `effGenome` on exactly the dosed arms; `info.genome` clean.

### §P.2 — THE WALKER, THE THREE INHERITED DEBT PAYMENTS, AND THE FIXTURES

The walker is DS-T1b's, re-taken at this head with its field names KEPT BYTE FOR BYTE, which is
what lets **G-REPRO-DST1b** compare field for field. **DS-T1's three paid debts STAY PAID:**

* **DEBT (a) — THE DECISION-TICK PREDICATE OF RECORD** reads `pcLatency`'s own holds map AFTER
  `m.step(DT)` at the tick the decide loop used (`this.stepCount` after its own increment).
  DS-C0's PRE-STEP form is recomputed BESIDE it and BOTH are compared to the engine's own
  `pcLatency.ledger.decisionsHeld` per-tick delta (canon: *engine ledgers before heuristics*). The
  receipt is the `calib.*` family and `faceBlocks.decisionTickCalibration`. ⛔ `holdFor` is never
  called — it DELETES expired entries and so would not be byte-inert.
* **DEBT (b) — THE SHOOTER GID AT THE PUSH**, banked in a per-`logIndex` map while `pendingShot`
  is live, so the goal join and `own.goalsPerEpisode` are not VOID; DS-C0's own join is published
  beside as `ep.goalsPerEpisodeDsC0Form.*`.
* **DEBT (c) — THE WIDE EPISODE BINS** past one full `wallRun` licence (2.3 s EXTRACTED from the
  licence's own write line, DERIVED into ticks and never typed), with the TOP BIN'S SHARE stored
  beside EVERY bin-derived median and episodes still active at full time COUNTED.

**THE PREDICATES, each with fixtures both ways** (`gPredicateFixtures`; ⛔ no fixture asserts a
direction). DS-T1b's whole fixture set is inherited — the cadence predicates, DEBT (a)'s two
forms disagreeing on a hold armed inside the step, the branch ladder, the nine-cell run classifier
with `ownRunInBehind` as its own class, the own-run episode's set/clear, the state classifier, the
2过1 trigger's six conjuncts, the prior at every role at every quarter-metre, the `runMul`
back-out, the clean `runMulLic` limb, the not-hatted guard, the engine's own `runnerCount` against
this instrument's reconstruction on the full corner grid, the two doses' shapes, and the bin
edges — ⭐ **AMENDED by these additions and these retirements:**

* ⭐ **THE RANK LAW'S OWN SHAPE** (canon: *walk-side definitions pinned* — the source line is
  anchored AND the composition is fixtured): `restraintFromRank(count, rankAbove) = clamp01(count
  − rankAbove)` with BOTH clamp arms fired (nobody above him ⇒ 1; the `count`th body ⇒ 1; one too
  many ⇒ 0; the `count + 1`th ⇒ 0; well outside the cut ⇒ still exactly 0), the VALUE SET proved
  to be EXACTLY `{0, 1}` over the whole (count × rankAbove) grid, and `x · 1 === x` shown to make
  a licensed body score EXACTLY DS-T0's number.
* ⭐ **THE COACH'S OWN COMPARATOR**, `outranksRecon`: a higher ranking outranks him, a lower does
  not, an EQUAL ranking with a LOWER roster index does, with a HIGHER index does not, and with
  the SAME index does not (he is never his own rival) — plus the comparator checked AGAINST AN
  ACTUAL `sort` of a five-body grid with a staged tie.
* ⭐ **THE ZERO-SCORE AMBIGUITY**: the DF clamp at EXACTLY 0 and just inside it, the ST on the
  opponent's goal line at EXACTLY 1, a zero prior leaving the back-out UNDEFINED (not zero), a
  zero prior scoring 0 whatever the restraint was, and a POSITIVE prior making a zero score mean
  restraint 0 and a full score mean restraint 1.
* ⭐ **`runRank`'s CODE-MOVE**: all three call sites found exactly once and resolved to their
  named functions, the RETIRED inline expression proved ABSENT from the shipped `.map`, the
  summand pattern `RUN_ROLE_W[` EXECUTABLY unique in `src/**`, and this instrument's `priorOf`
  proved EQUAL to `clamp01(runRank(role, x) / RUN_PRIOR_MAX)` at every role × quarter-metre with a
  TYPED divisor breaking the agreement.
* ⭐ **THE BLOCK'S FOUR SETS** against §LAW-C's own sentence, and a velocity read shown to break
  the boolean.
* ⭐ **gScratchBand's own arithmetic**: every scratch seed inside the declared band, and a seed
  ONE past the band caught.
* ⭐ **RETIRED with the term they inverted**: the `runningMates` inversion and its censoring
  fixtures. ⚠ DS-T1b §CORR 7's erratum (`runningMates.twoOfTwo` pinned censoring, not two-of-two)
  is retired with them.

### §P.3 — R1, THE FLOOD FACE (INHERITED UNCHANGED)

**R1 = EXECUTED RUNS PER IN-POSSESSION OPEN-PLAY TEAM-TICK.** Per team, per STEPPED tick:
`match.possessionSide === team.side` · `match.phase === 'playing'` · the team carries NO live
`cornerCrash` and NO live `crossFlight` (both read off the engine's own held-licence clocks,
`simTime < until`, at the end of the tick). THE COUNT is of OUTFIELD BODIES (not the keeper, not
sent off) whose `p.action.type` is `MakeRun` — **the BODIES, not the board**.

Published per arm: the FROZEN BINS `0 · 1 · 2 · 3 · 4 · 5 · 6+`; the MEAN; the SHARE of ticks with
**≥ 3** runners; the paired Δ of the mean vs the HATS arm at the SAME seat state with the CLUSTER
BOOTSTRAP (2,000 draws, `Rng` seeded from the block base 12,556,000); the tolerance
`NI_FRACTION · |control mean|`; and BOTH FRACTIONS (`r1.teamTicksPerMatch` and
`r1.runnerTicksPerMatch`).

> ⭐⭐⭐ **`floods(arm)` = the paired Δ of R1's MEAN is RESOLVED (the 95 % interval excludes zero)
> AND UP AND BEYOND the tolerance.**

⭐ **AMENDMENT (#409 item 5, the FORM RULE OF RECORD): the flood selector's column is named
`beyondToleranceUp`.** It is ONE-SIDED — `Δ > tolerance`, the `floods` conjunct itself — and a
resolved-DOWN arm prints `beyondToleranceUp false` while `|Δ|` may exceed the tolerance. The
TWO-SIDED companion is stored beside it as `absDeltaBeyondToleranceEitherWay`, and §R2's guard
table keeps the two-sided name `beyondTolerance`. Both are re-derived off the serialized artifact.

⭐ **AMENDMENT (#410 item 3(ii)): a NEW BESIDE-FACE for H-DS-5 — THE RATIO.** R1's mean on the OWN
arm DIVIDED BY R1's mean on its HATS control, with a cluster-bootstrapped 95 % interval on the
same seeds (`pairedRatio`), published for R1 and for G9. ⛔ PRINTED, NO VERDICT WORD.

### §P.4 — THE BAND, THE GUARDS (F-DS-b; INHERITED UNCHANGED)

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
| G8 | `guard.meanAimDistanceMetres` — mean pass distance (a DECLARED reconstruction) | both |
| G9 | `guard.throughBallsPerMatch` — the engine's own counter (`performThroughBall`) | both |
| G10 | `guard.offsidesPerMatch` | **the #157 FLAG form — it FLAGS and GATES NOTHING** |

> ⭐⭐⭐ **`holdsBand(arm)` = NO BREACH among G1–G9.**

### §P.5 — THE FACES (published on EVERY arm; ⛔ NO VERDICT WORD on any of them)

**INHERITED FROM DS-T1b, RE-WALKED ON TWELVE ARMS:** populations A–C (the board with
`board.openPlayEmptyShare` and its stored boolean `openPlayBoardEmpty`; the decision ticks with
the nine-cell class split INCLUDING `ownRunInBehind` and DEBT (a)'s calibration beside; the yield
per RUN EPISODE — hat episodes as DS-C0 defined them and the OWN-RUN EPISODE as one body's
consecutive `MakeRun` ticks whose winner's `why` is the seventh literal — with passes aimed,
completed, through, SHOTS and GOALS through the shooter gid recorded at the push, the wide bins and
every median's top-bin share beside it); runs and yield **PER STATE**; runs **BY ROLE**; the
**COUPLING** faces; the **CROWDING** family (`crowd.crashShare`, `guard.spacingUnder4` and its
pooled companion); the seat's `runMul` distribution over the frozen `[1 − OBM_SCORE_SPAN,
1 + OBM_SCORE_SPAN]` range on EVERY arm so the seat-absent arms are its own noise floor; and the
**CLEAN `runMulLic` LIMB** — the LICENSED run's recorded score, which carries NO restraint factor
(`s = W.runScore · tiredMul · obmRunMul`, anchored) — as **THE SEAT'S FACE OF RECORD** (DS-T1b
§CORR 8 ratified it), with the seat-ABSENT arms' EXACTLY-ZERO below-1 share as its floor.

⭐ **AMENDMENT — THE SEAM'S FACES, ADAPTED TO THE RANK LAW** (#410 item 3(ii)), on the OWN and
HATS+OWN arms (the seat-absent ones only, for the back-out reason below):

* **`restraint` ∈ {0, 1}** — the frozen TEN cells over `[0, 1]` are kept, the mean is published,
  and the shares **EXACTLY 0** and **EXACTLY 1** are stored separately (both exact in IEEE-754:
  `0 · x === 0` and `x · 1 === x`), with the bin-derived median and its top-bin share. Under the
  rank law only the FIRST and the LAST cell can fill; a value in between is FLOAT residue in the
  back-out and is stored as its own share, `restraint.neitherZeroNorOneShare` — a
  self-diagnosing receipt, never folded away.
* ⭐⭐ **THE ZERO-SCORE AMBIGUITY, SEPARATED.** A zero own-run score has TWO causes: restraint 0,
  and a ZERO PRIOR — the DF clamp, which the seam doc's §LAW/§CORR record as biting ON THE PITCH
  (a defender more than ~18 m into his own half has a negative coach ranking, so `clamp01` gives
  exactly 0). At a zero prior the back-out's DENOMINATOR is zero and **the restraint is NOT
  RECOVERABLE**. The prior is therefore **RECOMPUTED from the body's OWN pos and role** —
  `priorOf(role, localX)`, which reads NO snapshot and so stays byte-inert — and the two
  populations are stored separately: `restraint.exactlyZeroShare` (over the RECOVERABLE
  population), `seam.priorZeroShare` and `seam.priorAboveZeroShare` (over the VISIBLE candidates),
  with `seam.priorZeroPerMatch` beside. **The ambiguous overlap IS the zero-prior population**,
  and that identity is stored as a boolean.
* ⭐⭐ **`rankAbove` IS NOT RECOVERABLE FROM A SCORE — DECLARED.** Every non-zero score carries
  restraint 1 and every zero score is restraint 0 or a zero prior, so no rank distribution can be
  backed out and none is published. What IS published is the OBSERVABLE: **`rankBelowCount`** —
  the share of RECOVERABLE candidates on which `rankAbove < count`, which by M-DS.6″(c) is
  EXACTLY the restraint-1 share. It is stored as ONE value (the same stored face, referenced) with
  its equivalence sentence and the boolean
  `rankAboveExactValueRecoverableFromAScore: false` beside it. ⛔ Not a second computation.
* **THE `count` DISTRIBUTION** (1 / 2 / 3 shares and the mean), read off the ENGINE'S OWN exported
  pure `runnerCount(mode, tempo, urgency)` — no percept, no mutation, no rng.
* **THE PERCEIVED-OWNER GUARD'S PASS SHARE, AS A FLOOR** — visible own-run candidates ÷ unhatted
  attacking off-ball decision ticks, in BOTH forms of the guard reconstruction, with the count of
  visible candidates falling outside the post-step form stored as its own receipt.
* **THE IN-FLIGHT AND RESTART OWN-RUN SHARES** — **STORED, NOT CLAIMED**, with the per-state mix
  beside them (M-DS.7 withdrew them and DS-T1b measured that stale eyes still leak).
* **RETIRED**: the `runningMates` distribution and its censored share, with the velocity mass they
  inverted. A **STORED BOOLEAN** derived from the block's WHOLE TEXT records the removal:
  `codeFacts.ownRunBlock.blockReadsNoVelocityNoTopSpeed`.

⭐ **HOW THE FACES ARE OBSERVED, AND WHY IT IS THE ONLY BYTE-INERT WAY.** Recomputing `rankAbove`
from the snapshot the body used is impossible byte-inertly: `match.perceivedSnapshot` MUTATES
perception memory (the E3R2 recorder trunk). So the restraint is **BACKED OUT** of the engine's
own recorded candidate score, exactly as DS-T1 backed out `runMul`. DS-T0c's arithmetic is
`s = ((W.runScore · prior) · restraint) · (tired ? OFFBALL_TIRED_MUL : 1) · obmRunMul` with
`obmRunMul` applied LAST (anchored), therefore:

* the STORED SCORE ÷ `(W.runScore · prior · tiredMul)` is **EXACTLY `restraint · obmRunMul`** —
  published on every arm as `ownBackOut.*`;
* on a **seat-ABSENT** arm `obmRunMul` is EXACTLY 1 by construction, so THERE that quantity **IS
  the restraint**, and only there is the `restraint.*` family written at all (on a dosed arm the
  same number is a PRODUCT and `gFaces` asserts the restraint family's emptiness — the arm-level
  boolean `obmRunMulKnownToBeOne` is stored beside every row);
* the seat's own `runMul` on the DOSED arms is therefore taken from the CLEAN `runMulLic` LIMB,
  with the seat-ABSENT arms as its floor.

⚠ **THE OBSERVATION WINDOW IS THE RECORD'S TOP FOUR.** `decideOffBall` stores `cands.slice(0, 4)`,
so a candidate that lost badly is invisible; every share over this population is a FLOOR on the
pushed population, and the denominators are published.

### §P.6 — THE READS (#406 item 5(v)'s FOUR literals, RE-FROZEN VERBATIM by #410 item 3(iii))

Selected by STORED BOOLEANS over the OWN arms on E13, **the precedence UNCHANGED**, with
⭐ **"dosed" = RUN-CAUTION**:

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

**BESIDE every read, printed from STORED fields, ⛔ WITH NO VERDICT WORD ON ANY OF THEM:**

* **H-DS-5's numbers** — R1's paired Δ on OWN vs HATS, seat absent, with its interval, BESIDE
  **DS-T1's `+1.248030`** and **DS-T1b's `−0.447072`**, each **QUOTED BY FIELD** out of
  `docs/world-model/data/ds-t1-own-run-exam.json` and
  `docs/world-model/data/ds-t1b-own-run-exam.json` (`deltas[]` for
  `r1.runsPerInPossessionTick@OWN-E13-ABSENT`) and never typed in the instrument;
* **H-DS-5's G9 number** — the through-ball paired Δ with its interval, BESIDE **DS-T1's
  `+2.787788`** and **DS-T1b's `−4.023023`**, quoted by field the same way;
* **H-DS-5's RATIO** — R1's OWN mean ÷ its HATS control's, with its interval (and G9's beside);
* **H-DS-6's number** — R1's Δ on the RUN-CAUTION OWN arm beside the seat-absent one, with
  KITCHEN-SINK beside and `holdsBand` at RUN-CAUTION, plus the clean `runMulLic` limb's mean and
  below-1 share on each with its zero floor;
* the **HATS+OWN arm's own words** (floods / holdsBand) at all THREE seat states;
* the **yield pair** (shots per own-run episode vs per hat episode, BOTH fractions);
* the **coupling sentence** (the overlap-sets Δ and the wall-pass-fires Δ on OWN vs HATS);
* the **per-state line**, the restraint's mean and exact-0 / exact-1 shares, the `rankBelowCount`
  share and the zero-prior share.

**STORED:** the selectors, the selected sentence, the guard table per arm, and the COUNTERFACTUAL
WORDS for the **RUN-CAUTION OWN arm**, the **KITCHEN-SINK OWN arm** and **D13** — each computed by
the SAME frozen rule on ITS OWN stored intervals (canon: *counterfactual words are stored*).

### §P.7 — SEEDS AND SIZING

| item | band | status |
| --- | --- | --- |
| battery | **12,556,000 – 12,556,998** | 999 seeds × 12 arms |
| construction receipt | **12,556,999** | the block consumed WHOLE |
| sizing smoke | 900,007,000 – 900,007,011 | SCRATCH (disclosed at §DEV-PREFLIGHT) |
| smoke receipt | 900,007,020 | SCRATCH |
| world pin | 900,007,070 | SCRATCH |
| lockstep + X-DET + gPullCount | 900,007,090 – 900,007,091 | SCRATCH |
| fixtures' attribute draw | 900,007,099 | SCRATCH |
| **the DECLARED scratch band** | **900,007,000 – 900,007,099** | ⭐ `gScratchBand` |
| G-REPRO-DST1b re-walks | 12,555,000 – 12,555,011 | **DS-T1b's OWN CONSUMED BAND — not a consumption** |

ZERO stats consumed; `stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 85 }`.

⭐ **AMENDMENT — `gScratchBand`** (#410 item 3(iv), the FORM NOTE of the seam doc's §CORR-C 3,
which disposed a pin suite whose scratch bases strayed into the verifier's reserved range): EVERY
scratch seed this instrument walks is DERIVED from the ONE declared base `900,007,000` and
ASSERTED to lie inside the DECLARED BAND, with the out-of-band list stored (it must be empty), the
band proved to sit above canon's own `≥ 900,000,000` floor, and the battery block and the scratch
band proved DISJOINT both ways. The seed list and the band are stored in `seeds`.

**THE SIZING FORM** (the house form): `se(n) = hw(n)/z.975` · `se(needed) = |target|/(z.975+z.80)`
· `N = ceil(n · (se(n)/se(needed))²)` · `MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975`, at a
**DECLARED 0.05 HALF-WIDTH** on R1's paired Δ (OWN vs HATS, seat absent, E13) and on
`passCompletion`'s paired Δ on the same pair.

**N = 999 = THE BLOCK'S AFFORDANCE after the construction receipt** — and it is the AFFORDANCE,
not the requirement, that is taken (§DEVIATIONS): both sizing rows resolve far inside it, so the
affordance strictly dominates, and canon's *seed discipline* consumes a block WHOLE of record.
THE TAIL: none — 12,556,000–998 are walked and 12,556,999 is the construction receipt.

### §P.8 — THE GATE SET (frozen ex ante)

**DS-T1b's WHOLE SET, BY ANCHOR:** `X-DET` twice per arm on a scratch pair · `X-FP-PROD` ·
`X-SRC-UNTOUCHED` over `src` AND `tests` · `SEED-DISJOINT` (consumed blocks LN-C0 12,544,000–999 ·
LN-T1 …545 · LN-C1 …546 · LN-C2 …547 · LN-C3 …548 · LN-T1′ …549 · LN-T1′b …550 · GK-C0 …551 ·
GK-T1 …552 · DS-C0 …553 · DS-T1 …554 · **DS-T1b 12,555,000–999**) · `gN` · `gFaces` off the
SERIALIZED artifact · `gReadWords` · `gHashOrder` · BOOKED = WALKED · `gLoo` SCOPED to the
read-bearing rows · `gTwoFractions` · `gStage` · `gWorld` per arm · `gBite` in the #402 item
2(iii) form · `gLockstep` · `gDoseCopy` (BOTH matrices) · `gClassesNonVacuous` ·
`gPredicateFixtures` · `gLedgerRead` · `gAnchoredConstants` · `gDoseSource` · `gPullCount`.

⭐ **PLUS / AMENDED:**

* **`gRepro` = G-REPRO-DST1b** — `HATS-E13-ABSENT` RE-WALKED on **12,555,000–011** and compared
  **FIELD FOR FIELD** against DS-T1b's stored `perSeedCells[].[HATS-E13-ABSENT]`. This is the
  seam's OFF path, byte-identical to DS-T0b's substrate by DS-T0c's own G-OFF pins (five worlds,
  world 13 included, the rng draw inside the hash), so EVERY field DS-T1b stored must reproduce —
  the whole-match signature included. **A MISMATCH IS RED.** Only `wallMs` (a machine timing) is
  excluded; DS-T1c's own new fields have no counterpart in DS-T1b's row, and DS-T1b's retired
  `runningMates` fields have none in this one.
* **`gCodeFactGraph`** (extended) — the six `MakeRun` pushes classified over the WHOLE
  enclosing-`if` chain (five reachable with both DS flags absent — three hat-guarded, two
  keeper-up-guarded — and one `flagGated: dsOwnRun`, with
  `makeRunCandidatesAllHatGuardedOnShippedPath` DERIVED); the two flags' read forks enumerated
  under `src/**` and compared to **§SEAM-C's REFRESHED inventory** — ⭐ **TEXT + FILE + LINE on
  every row**, because #410 measured the lines, so **DS-T1b's declared line disagreement is
  RETIRED POSITIVELY** and a difference is now RED; the five DEFINITION lines (`runRank` ·
  `runnerCount` · `RUN_ROLE_W` · `RUN_DEPTH_DIV` · `RUN_PRIOR_MAX`) parsed from the same section
  and compared; **`runRank`'s span hashed WHOLE with ALL THREE call sites hashed** and the
  per-file call census, plus the EXECUTABLE census of the summand pattern `RUN_ROLE_W[`;
  `runnerCount`'s span and both call sites as before; the own-run block's **FOUR SETS** (`match`
  members · the `.pos` reads · the `mate.` set · the `body.` set) extracted from the block's whole
  text and compared to §LAW-C 4's own sentence parsed out of the markdown — **equal or RED**; the
  STORED BOOLEAN `blockReadsNoVelocityNoTopSpeed`; and `assignRunners`, `decideOffBall`,
  `executeAction` and `obmOffballPolicy` hashed WHOLE with their EXTRACTED callees.
* **`gPullCount`** — **the observation adds no percept pull.** On a THROWAWAY match per arm at the
  two out-of-band lockstep scratch seeds (never on a battery walk), the MATCH INSTANCE's
  `perceivedSnapshot` is wrapped by a counter that DELEGATES to the real bound method — the seam's
  own pin B6 idiom, applied without touching `src/`. The per-match pull count must be EQUAL
  observed vs unobserved, the whole-match SIGNATURES must be equal, and the wrapped observed
  signature must equal the UNWRAPPED lockstep walk's. The counter must also be LIVE.
* **`gScratchBand`** — §P.7's stored check.
* ⭐ **`gBite`'s seat limb now STORES ITS SEEDS.** DS-T1b §CORR 4: its `bite.seatBite[]` promised
  three identical seeds in prose and carried no such field. Here `bite.seatBite[].identicalSeeds`
  and `.identicalSeedCount` are STORED FIELDS.

### §P.9 — THE CODE FACTS

* **THE SIX `MakeRun` PUSHES CLASSIFIED** exactly as at DS-T1b (the whole enclosing-`if` chain;
  `flagGated` > `hatGuarded` > `keeperUpGuarded` > `unguarded`), with the shipped-path boolean
  DERIVED over the pushes reachable with both DS flags absent. ⚠ DS-T1b §CORR 7's erratum stands:
  the boolean's NAME over-claims (two of the five reachable pushes are keeper-up-guarded, not
  hat-guarded), and the composition `pushClassCounts` is printed beside it.
* **THE TWO FLAGS' READ FORKS** compared to §SEAM-C's refreshed inventory on TEXT + FILE + LINE.
* **`runRank`'s DEFINITION AND ALL THREE CALL SITES HASHED**; the summand pattern's executable
  census; the retired inline expression proved absent.
* **`runnerCount`'s DEFINITION AND ITS TWO CALL SITES HASHED**, with the census proving the
  expression exists in exactly two files of `src/**`.
* **THE OWN-RUN BLOCK'S FOUR SETS** extracted and compared to §LAW-C's read set, and the stored
  boolean `blockReadsNoVelocityNoTopSpeed` derived from the block's whole text.
* **`assignRunners`, `decideOffBall`, `executeAction`, `obmOffballPolicy` HASHED WHOLE** with
  extracted callees (canon: *code facts over the call graph* — the graph is stored beside the
  booleans).
* **G-DOSE-COPY for BOTH matrices**, slot for slot, off the `OBM_*` exports.

---

## §DEV-PREFLIGHT — THE DISCLOSED SMOKE (before the freeze)

Two scratch smokes were run BEFORE the freeze, both writing to `/tmp/`, and are DISCLOSED here.
They exist to size N and to prove the instrument runs end to end; **no number from them is a
finding and none is quoted anywhere outside this section.**

1. a 3-seed shakedown on 900,007,000–002 (twelve walks per seed) — used only to reach ALL GATES
   GREEN. ONE gate was RED on its first pass: `gPredicateFixtures`, because the seam doc now
   writes its per-file flag-count sentence THREE times (§SEAM, §SEAM-B and §SEAM-C's refreshed
   paragraph) and the inherited fixture pinned the row count at 8. The fixture was corrected to
   the measured row count with a second fixture asserting that the rows DEDUPE to four — which is
   what a drifted copy would break — BEFORE the sizing smoke;
2. **THE SIZING SMOKE — a 12-seed scratch smoke on 900,007,000 – 900,007,011** (twelve walks per
   seed, the full twelve-arm battery, all gates evaluated), **ALL 25 GATES GREEN**, with
   `G-REPRO-DST1b` GREEN over **175** fields × 12 seeds:

| face @ arm | Δ (12 clusters) | half-width | se(smoke) | se(needed) | **nRequired** | expected hw at N = 999 | resolvable |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `r1.runsPerInPossessionTick` @ `OWN-E13-ABSENT` | −0.222513 | **0.072958** | 0.037224 | 0.017847 | **53** | 0.007996 | ✅ |
| `guard.passCompletion` @ `OWN-E13-ABSENT` | 0.006446 | **0.041915** | 0.021386 | 0.017847 | **18** | 0.004594 | ✅ |

The two `hwSmoke` values above are the ONLY smoke numbers transcribed into the instrument
(`SIZING_INPUTS`), and `gFaces` re-derives every sizing row from them off the serialized artifact.
The smoke's own console also reported a battery wall of 67.1 s for 12 seeds × 12 arms
(`perf.meanWallSecondsPerMatch` 0.173153) — from which the frozen battery is projected at roughly
35 minutes plus the estimator.

⚠ **12 clusters is a NOISY variance estimate** (canon). The REALISED half-widths at N are
published in §GATES beside these projections.

---

## §R — THE RESULTS

**RUN RECEIPTS.** FREEZE commit **`64e8ec7`**; the instrument is byte-identical between FREEZE and
RESULTS (`git diff 64e8ec7 -- scripts/probes/ds-t1c-own-run-exam.ts` EMPTY), and §P and
§DEV-PREFLIGHT were not edited after sight. **`allGreen` = true** — a STORED boolean over **25**
gate objects, every one `ok: true`. Battery **999 seeds (12,556,000–12,556,998) × 12 ARMS + the
construction receipt at 12,556,999 ⇒ BOOKED = WALKED = 12,000 walks**; `seeds.unwalkedTail` =
**null** — the block is consumed WHOLE. ZERO stats consumed; registry **85**. Artifact
`data/ds-t1c-own-run-exam.json`, **63,447,757 bytes**, file sha256
`1b0da6c95d0f80355ec18431e1b605689e25ca0e67fb52a26526cd15b56067ee`,
`hashedBodySha256 = f37e633e9fd8728688b83dd0e0e7f3c5a2af3f8deeaff1b72a5022f6dbb9bcf7`,
`instrumentSha256 = 61fad55a5b3b0c666a6b2de78ada42e59a1546d39b3274268dcb28423ef7bf20`,
`receipts.hashReproducesFromFile` **true**. Battery wall **2203.427 s**,
`perf.meanWallSecondsPerMatch` **0.1606292959626293**. `tsc --noEmit` clean at both commits.
**X-FP-PROD recomputed IN-PROCESS** =
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — the literal of record,
UNCHANGED. **G-REPRO-DST1b: 175 fields × 12 seeds, ZERO mismatches.**

*(Every number below QUOTES the artifact's own fields, at 6 dp where the field is a rate or a
share. The artifact is the numbers of record.)*

### §R1 — R1, THE FLOOD FACE

*(⭐ #409 item 5's FORM RULE, applied: the column below is `beyondToleranceUp` — ONE-SIDED,
`Δ > tolerance`, the `floods` conjunct itself — and the TWO-SIDED companion
`absDeltaBeyondToleranceEitherWay` sits beside it, so a resolved-DOWN arm can be read without
ambiguity. §R2's guard table uses the two-sided `beyondTolerance`.)*

**EXECUTED runs per in-possession open-play team-tick**, per arm, with the frozen bins:

| arm | mean | 0 | 1 | 2 | 3 | 4 | 5 | 6+ | ≥ 3 |
|---|---|---|---|---|---|---|---|---|---|
| `HATS-E13-ABSENT` | **0.588555** | 0.623887 | 0.178077 | 0.184177 | 0.013309 | 0.000549 | 0.000000 | 0.000000 | **0.013858** |
| `HATS-E13-RUNCAUTION` | 0.566526 | 0.631432 | 0.185112 | 0.169488 | 0.013433 | 0.000535 | 0.000000 | 0.000000 | 0.013968 |
| `HATS-E13-KITCHENSINK` | 0.437676 | 0.682084 | 0.204778 | 0.106625 | 0.006401 | 0.000111 | 0.000000 | 0.000000 | 0.006512 |
| `HATSOWN-E13-ABSENT` | 0.613105 | 0.611883 | 0.181098 | 0.189562 | 0.016946 | 0.000511 | 0.000000 | 0.000000 | 0.017457 |
| `HATSOWN-E13-RUNCAUTION` | 0.583591 | 0.623522 | 0.186248 | 0.173850 | 0.015880 | 0.000501 | 0.000000 | 0.000000 | 0.016381 |
| `HATSOWN-E13-KITCHENSINK` | 0.454551 | 0.671746 | 0.209139 | 0.112050 | 0.006949 | 0.000116 | 0.000000 | 0.000000 | 0.007066 |
| **`OWN-E13-ABSENT`** | **0.253849** | 0.782941 | 0.182461 | 0.032436 | 0.002132 | 0.000030 | 0.000000 | 0.000000 | **0.002162** |
| **`OWN-E13-RUNCAUTION`** | 0.191822 | 0.832687 | 0.144490 | 0.021160 | 0.001641 | 0.000021 | 0.000001 | 0.000000 | 0.001663 |
| `OWN-E13-KITCHENSINK` | 0.121218 | 0.890647 | 0.098603 | 0.009646 | 0.001093 | 0.000011 | 0.000000 | 0.000000 | 0.001104 |
| `HATS-D13` | 0.660191 | 0.594024 | 0.168914 | 0.220514 | 0.015944 | 0.000605 | 0.000000 | 0.000000 | 0.016548 |
| `HATSOWN-D13` | 0.674771 | 0.589603 | 0.166075 | 0.225042 | 0.018507 | 0.000773 | 0.000000 | 0.000000 | 0.019280 |
| `OWN-D13` | 0.255253 | 0.781118 | 0.184601 | 0.032213 | 0.002044 | 0.000023 | 0.000000 | 0.000000 | 0.002067 |

| arm | Δ vs its HATS control | 95 % interval | tolerance | \|Δ\|÷half-width | resolved | up | **`beyondToleranceUp`** | \|Δ\| beyond either way | **`floods`** |
|---|---|---|---|---|---|---|---|---|---|
| `HATSOWN-E13-ABSENT` | +0.024550 | [0.018454, 0.030772] | 0.162627 | 3.985931 | true | true | false | false | **false** |
| `HATSOWN-E13-RUNCAUTION` | +0.017065 | [0.011066, 0.023072] | 0.156540 | 2.842657 | true | true | false | false | **false** |
| `HATSOWN-E13-KITCHENSINK` | +0.016875 | [0.010728, 0.023043] | 0.120937 | 2.740609 | true | true | false | false | **false** |
| **`OWN-E13-ABSENT`** | **−0.334706** | **[−0.342342, −0.326930]** | **0.162627** | **43.434876** | true | false | false | **true** | **false** |
| **`OWN-E13-RUNCAUTION`** | −0.374704 | [−0.382624, −0.367012] | 0.156540 | 48.000152 | true | false | false | true | **false** |
| `OWN-E13-KITCHENSINK` | −0.316458 | [−0.323642, −0.309262] | 0.120937 | 44.012086 | true | false | false | true | **false** |
| `HATSOWN-D13` | +0.014580 | [0.008657, 0.020580] | 0.182421 | 2.445818 | true | true | false | false | **false** |
| `OWN-D13` | −0.404938 | [−0.413832, −0.396376] | 0.182421 | 46.393872 | true | false | false | true | **false** |

**`floods(arm)` is FALSE on all eight contrasted arms.** On the ARM OF RECORD the Δ is RESOLVED
**DOWN** and beyond the tolerance in that direction: the own run alone still puts FEWER bodies on
a run than the coach's hats do, and the share of team-ticks carrying THREE OR MORE runners goes
**0.013858 → 0.002162**. **BOTH FRACTIONS:** the denominator `r1.teamTicksPerMatch` is
**11846.281281** in-possession open-play team-ticks per match against the control's
**11912.439439**, and the numerator `r1.runnerTicksPerMatch` is **3007.167167** executed-run
body-ticks per match against **7011.130130**.

**THE RATIO (⭐ #410 item 3(ii)'s new beside-face; printed, no verdict word):** R1's OWN mean ÷ its
HATS control's is **0.431309** [0.423933, 0.439099]. On G9 the same ratio is at §R5.

Every R1 LOO row flips **0** intervals in either direction; the maximum single-seed influence
share on the arm of record's R1 row is **0.001382**.

### §R2 — THE BAND

`holdsBand` is **TRUE on seven of the eight contrasted arms** — all four HATS+OWN arms (breach set
empty on each), the ARM OF RECORD `OWN-E13-ABSENT`, `OWN-E13-RUNCAUTION` and `OWN-D13` — and
**FALSE on exactly one: `OWN-E13-KITCHENSINK`**, whose breach set is the single guard **`G9
guard.throughBallsPerMatch`** (Δ **−3.248248** [−3.441441, −3.050050] against a tolerance of
**1.584874**, 16.598465 half-widths, DOWNWARD).

THE ARM OF RECORD, `OWN-E13-ABSENT`, every gating limb:

| id | face | control | arm | Δ | 95 % interval | tolerance | dir | resolved | beyond | breach |
|---|---|---|---|---|---|---|---|---|---|---|
| G1 | `guard.goalsPerMatch` | 3.324324 | 3.350350 | +0.026026 | [−0.121121, 0.176176] | 0.918563 | both | false | false | false |
| G2 | `guard.shotsPerMatch` | 12.648649 | 12.357357 | −0.291291 | [−0.562563, −0.040040] | 3.495021 | both | true | false | false |
| G3 | `guard.xgConversion` | 1.472343 | 1.492796 | +0.020453 | [−0.032896, 0.077668] | 0.406832 | both | false | false | false |
| G4 | `guard.passCompletion` | 0.582113 | 0.586816 | +0.004703 | [0.000356, 0.008879] | 0.160847 | floor | true | false | false |
| G5 | `guard.interceptionsPerMatch` | 27.384384 | 25.870871 | −1.513514 | [−1.897898, −1.105105] | 7.566738 | ceiling | true | false | false |
| G6 | `guard.possessionShareSideA` | 0.501375 | 0.500945 | −0.000430 | [−0.005165, 0.004474] | 0.138538 | both | false | false | false |
| G7 | `guard.passesPerMatch` | 79.476476 | 78.094094 | −1.382382 | [−2.063063, −0.673674] | 21.960605 | both | true | false | false |
| G8 | `guard.meanAimDistanceMetres` | 15.813049 | 15.533456 | −0.279593 | [−0.351863, −0.203814] | 4.369395 | both | true | false | false |
| **G9** | **`guard.throughBallsPerMatch`** | **5.860861** | **5.306306** | **−0.554555** | **[−0.744745, −0.347347]** | **1.619448** | both | **true** | **false** | **false** |

**G9 IS INSIDE THE BAND ON THE ARM OF RECORD** — |Δ| ÷ half-width **2.790932**, |Δ| ÷ tolerance
below 1. The same limb on the other three OWN arms: **−1.330330** [−1.539540, −1.121121] at
RUN-CAUTION (5.846847 → 4.516517, tolerance 1.615576, INSIDE), **−3.248248** at KITCHEN-SINK
(5.735736 → 2.487487, tolerance 1.584874, **BREACH**), **−0.510511** [−0.740741, −0.294294] on
D13 (6.811812 → 6.301301, tolerance 1.882211, INSIDE). G9's LOO rows flip **0** on every OWN arm
(maximum single-seed influence **0.031522** on the arm of record).

**G10, THE OFFSIDE FLAG (#157 form — it flags and gates nothing): NOT RAISED ANYWHERE.** On the
arm of record the offside Δ is RESOLVED **DOWN** (**−0.167167** [−0.300300, −0.025025] against a
control level of 2.478478), and a flag needs a resolved INCREASE.

### §R3 — THE FACES

**POPULATION A — THE BOARD.** `board.openPlayEmptyShare` is **1.000000** on all three E13 OWN arms
and on `OWN-D13`, and the STORED BOOLEAN `openPlayBoardEmpty` is **true** on each (the control
reads **0.101862** and `false`). Designated runners per in-possession coach tick: **1.521690** on
the control against **0.191037** on the arm of record — the arriver and the corner/cross branches
are all that remain.

**POPULATION B — THE DECISIONS.** The `MakeRun` share of attacking off-ball decision ticks is
**0.166832** on the control and **0.077822** on the arm of record; within all attacking `MakeRun`
decisions the `ownRunInBehind` class is **0.429302** and the `licensedRunInBehind` class
**0.000466** (against **0.471322** on the control). DEBT (a)'s receipt, arm of record:
`calib.postStepOverLedger` **0.9999996369653498** against the PRE-STEP form's
**0.9965026279041086** — the stored per-match values are post **38602.400400**, pre
**38467.407407**, ledger **38602.414414**.

**POPULATION C — THE YIELD, AND THE YIELD PAIR (⛔ no verdict word).** On the arm of record:
**63.429429** own-run episodes a match against **12.384384** runner-hat episodes; **0.047234**
shots per own-run episode (2,993 ÷ 63,366) against **0.132072** per hat episode (1,634 ÷ 12,372);
**0.014692** goals per own-run episode against **0.054235**; **0.319588** passes aimed per own-run
episode with a through share of **0.120241** and **0.130417** completed; the own-run episode's
bin-derived median is **36** ticks with a top-bin share of **0.024396**;
`own.goalRowJoinShare` **0.999685**; **0.158158** own-run episodes per match still ACTIVE at full
time.

**RUNS AND YIELD PER STATE.** On the arm of record the own run's state mix is **0.878046** a mate
on the ball · **0.119467** the ball in flight · **0.001028** his side's own restart · **0.001459**
other. In absolute terms that is **171.030030** own runs a match won with a mate on the ball,
**23.270270** at a tick the TRUTH classifier calls *ball in flight* and **0.200200** at a restart.
The hats' own mix on the same arm: **0.101242** a mate on the ball · **0.295456** the ball in
flight, with the restart carrying **154.185185** hat runs a match.

**RUNS BY ROLE.** Arm of record: DF **0.009746** · MF **0.023938** · WG **0.351295** · ST
**0.615021**, against the control's DF **0.005493** · MF **0.055800** · WG **0.431489** · ST
**0.507218**.

**THE COUPLING (⛔ no verdict word).** On the arm of record overlap designations per match go
**3.009009 → 3.807808** (Δ **+0.798799** [0.619620, 0.979980], resolved) and wall-pass fires
**10.235235 → 10.466466** (Δ **+0.231231** [−0.067067, 0.540541], **NOT resolved**); the ball
played to the overlapper per designation moves **+0.015519** [0.009343, 0.021642] and the return
share of fires **−0.006298** [−0.010381, −0.002428].

**THE CROWDING FAMILY.** `crowd.crashShare` **0.439480 → 0.449494**; `guard.spacingUnder4`
**0.069836 → 0.074091** (pooled **0.069782 → 0.074153**).

**THE SEAT'S `runMul`.** The CLEAN LIMB (`runMulLic.*`, off the licensed run's score) has an
**EXACTLY ZERO** below-1 share on every seat-ABSENT arm — mean **1.000000**, at-1 share
**1.000000** — on `HATS-E13-ABSENT` (n = 456,382), `HATSOWN-E13-ABSENT` (n = 459,903),
`OWN-E13-ABSENT` (n = 212) and both D13 arms. On the dosed arms it MOVES: on the dosed HATS
controls mean **0.928285** with **0.903767** of observations below 1 at RUN-CAUTION (n = 467,148)
and mean **0.893570** with **0.973118** below 1 at KITCHEN-SINK (n = 458,963). DS-T1's INHERITED
limb (`runMul.*`, which reads the own candidate first) is published beside: on the arm of record
it reads mean **0.999886** with **0.005832** below 1 — that is the PRODUCT `restraint · obmRunMul`
on a run that WON, which is exactly why the clean limb exists (§HONEST LIMITS 3).

### §R3b — THE SEAM'S OWN FACES

**THE RESTRAINT, THE RANK LAW'S STEP (backed out; written only where `obmRunMul` is exactly 1 by
construction), WITH THE ZERO-SCORE AMBIGUITY SEPARATED:**

| arm | mean | **exactly 0** | **exactly 1** = `rankBelowCount` | n | `priorZeroShare` (the ambiguous overlap) | neither 0 nor 1 |
|---|---|---|---|---|---|---|
| **`OWN-E13-ABSENT`** | **0.452434** | **0.547520** | **0.449381** | 1,099,587 | **0.074470** | 0.003099 |
| `HATSOWN-E13-ABSENT` | 0.179534 | 0.820431 | 0.177977 | 669,025 | 0.118811 | 0.001592 |
| `OWN-D13` | 0.457909 | 0.542079 | 0.455044 | 1,406,717 | 0.069052 | 0.002877 |
| `HATSOWN-D13` | 0.164480 | 0.835521 | 0.163654 | 860,974 | 0.110600 | 0.000825 |

The arm of record's ten frozen cells, pooled: `[602046, 0, 0, 0, 0, 0, 0, 0, 0, 497541]` — **only
the first and the last cell carry anything**, which is the step form as a stored fact rather than
a sentence. `restraintMedian` **0**, top-bin share **0.452480**. On the six DOSED arms the family
is EMPTY BY CONSTRUCTION (n = 0, and `gFaces` asserts it).

**`rankBelowCount` — THE OBSERVABLE, AND WHAT IS NOT RECOVERABLE.** The stored
`rankBelowCount.share` on the arm of record is **0.449381**, and it is the SAME stored face as
`restraint.exactlyOneShare` by M-DS.6″(c)'s own equivalence (`restraint === 1` ⇔ `rankAbove <
count`), referenced rather than recomputed. `rankAboveExactValueRecoverableFromAScore` is stored
**false**: no rank distribution is published, because every non-zero score carries restraint 1 and
every zero score is restraint 0 or a zero prior.

**THE ZERO PRIOR — THE DF CLAMP, AND THE AMBIGUOUS OVERLAP.** On the arm of record **0.074470** of
VISIBLE own-run candidates have a prior of EXACTLY 0 when it is recomputed from the body's own pos
and role (**88.563564** such candidates per match over **1189.251251** visible), and
`priorAboveZeroShare` is **0.925530**. There the score is 0 whatever the restraint was and the
back-out's denominator is zero, so **the restraint is not recoverable and is not imputed**; the
stored boolean `ambiguousOverlapIsTheZeroPriorPopulation` is **true**, and the recoverable
population (1,099,587) is exactly the prior-above-zero one (a `gFaces` partition).

**THE COUNT, off the engine's own exported `runnerCount`.** Arm of record: mean **1.549642**, with
shares **0.463226** at 1 · **0.523906** at 2 · **0.012868** at 3 (pooled cells
`[550341, 622433, 15288]`).

**THE PERCEIVED-OWNER GUARD, AS A FLOOR.** Arm of record: **0.218693** of unhatted attacking
off-ball decision ticks carry a VISIBLE own-run candidate (**1189.251251** candidates per match),
and `seam.ownCandidateOutsidePostGuardShare` is **0.000000**. On the additive arm the floor is
**0.200956** (759.989990 per match, outside-post-guard **0.000374**); on `OWN-D13` **0.255512**.

**THE OWN CANDIDATE'S WHOLE BACK-OUT (`restraint · obmRunMul`).** Arm of record mean **0.452434**
(identical to the restraint by construction, n = 1,099,587, above-1 share **0.000646**); at
RUN-CAUTION **0.414224** with **0.953821** below 1 (n = 1,083,119); at KITCHEN-SINK **0.392584**
with **0.989006** below 1 (n = 1,073,710).

**THE IN-FLIGHT AND RESTART SHARES — STORED, NOT CLAIMED.** They are **not** zero: **0.119467**
in flight and **0.001028** at the restart on the arm of record (0.061156 / 0.000460 on the
additive arm; 0.157355 / 0.001316 on `OWN-D13`). §HONEST LIMITS 2 states the mechanism.

### §R4 — THE CODE FACTS

* **THE SIX `MakeRun` PUSHES**: `{"flagGated":1,"hatGuarded":3,"keeperUpGuarded":2,"unguarded":0}`
  over the whole enclosing-`if` chain; the one `flagGated` push names **`dsOwnRun`** and sits
  inside `decideOffBall`; `makeRunCandidatesAllHatGuardedOnShippedPath` = **true**, DERIVED over
  the **5** pushes reachable with both DS flags absent (⚠ the name over-claims — two of those five
  are keeper-up-guarded; the composition is printed beside it, DS-T1b §CORR 7's erratum).
* **THE TWO FLAGS' READ FORKS**: **3** in `src/**` (one `dsOwnRun` in `PlayerBrain.ts`, two
  `!dsHatsOff` in `TeamBrain.ts`), EQUAL to §SEAM-C's REFRESHED inventory on site text, file
  **AND LINE** — measured `PlayerBrain.ts:2213` · `TeamBrain.ts:344` · `TeamBrain.ts:367`, and the
  doc's table carries the same three. `forkLineNumbersAgree` is **true** — DS-T1b's declared line
  disagreement is RETIRED POSITIVELY. The per-file executable-line counts also agree
  (`PlayerBrain.ts` own 1 / hats 0 · `TeamBrain.ts` own 0 / hats 2 · `Match.ts` own 4 / hats 4 ·
  `League.ts` own 1 / hats 1); `a4World.ts` carries neither flag.
* **THE SIX §SEAM-C SITE ROWS agree on FILE AND LINE**: `1a` `match.perceivedSnapshot(p)`
  PlayerBrain.ts:2219 · `1b` `runnerCount(...)` PlayerBrain.ts:2252 · `1c` `runnerCount(...)`
  TeamBrain.ts:348 · `1d` `runRank(p.role, …)` PlayerBrain.ts:2236 · `1e` `runRank(mate.role, …)`
  PlayerBrain.ts:2243 · `1f` `runRank(p.role, …)` TeamBrain.ts:354. The FIVE definition lines
  parsed from the same section agree with the measured ones: `runRank` **208** · `runnerCount`
  **235** · `RUN_ROLE_W` **174** · `RUN_DEPTH_DIV` **181** · `RUN_PRIOR_MAX` **189**. The doc's
  own pull-occurrence claim (**3** in `PlayerBrain.ts`) equals the measured count.
* **`runRank`** — the span `src/ai/TeamBrain.ts:208-210:runRank` hashed whole
  (`c4c0d6f10bcd9829b226c932697c89c8c541f21b6515d0389ed125f9fd515f46`); ALL THREE call sites found
  exactly once and hashed, the shipped one inside `src/ai/TeamBrain.ts:240-423:assignRunners` and
  the player's two inside `src/ai/PlayerBrain.ts:1925-2371:decideOffBall`; the call census is
  `PlayerBrain.ts` 2 · `TeamBrain.ts` 2, i.e. exactly **2** files of `src/**`; the EXECUTABLE
  census of the summand pattern `RUN_ROLE_W[` is **ONE** site (`TeamBrain.ts`, 1 hit) and the doc
  makes exactly that narrowed claim.
* **`runnerCount`**: the span `src/ai/TeamBrain.ts:235-238:runnerCount` hashed whole
  (`7574a0f441f12cb26447fe917a0d91932cfc16381d17a31c5a485c22245fd187`); BOTH call sites found
  exactly once — `TeamBrain.ts:348` inside `assignRunners` and `PlayerBrain.ts:2252` inside
  `decideOffBall`; the expression lives in exactly **2** files of `src/**`.
* **THE OWN-RUN BLOCK** (`src/ai/PlayerBrain.ts:2213–2262`, sha
  `1b6c72b1cee4093812a0dee98e796aca0b492c9b9f1a20a9a528e9c2644c0500`): its `match`-member set is
  EXACTLY `["match.dsOwnRun","match.perceivedSnapshot","match.simTime"]`; the `.pos` read set is
  EXACTLY `["body.pos.x","p.pos.x"]`; the `mate.` set is EXACTLY
  `["gid","index","role","sentOff"]`; the `body.` set is EXACTLY `["gid","pos","side"]` — all four
  EQUAL to §LAW-C 4's own sentence parsed out of the markdown. ⭐⭐ **THE STORED BOOLEAN
  `blockReadsNoVelocityNoTopSpeed` is `true`**: the `.vel` read set is EMPTY, `topSpeed` occurs 0
  times and `runningMates` occurs 0 times. The call graph the boolean was checked over is stored
  beside it (`codeFacts.hashedRoots` + `runRank` + `runnerCount`).
* **THE CORPUS AND THE HASHED ROOTS**: **71** files under `src/sim` + `src/ai`, **581** extracted
  spans, **76** designation-field sites all resolved, four roots hashed whole with extracted
  callees (`assignRunners` · `decideOffBall` · `executeAction` · `obmOffballPolicy`), closure
  **92** spans at depth **5**, uncapped.
* **G-DOSE-COPY**: RUN-CAUTION **2** non-zero slots (indices 13 and 14, both at the domain MIN,
  both in the `runScore` row `[0, −1, −1, 0]`, plane and support rows all zero), KITCHEN-SINK
  **16** at a domain corner with `runScore` row `[−1, −1, −1, −1]`; both slot-for-slot equal to the
  export-side re-derivation; against the struck MARKER-ESCAPE's `runScore` row `[0, 0, 0, 0]`.

### §R5 — THE READ

The frozen rule, applied to STORED booleans on the arm of record — `floods(OWN, seat absent)`
**false** and `holdsBand(OWN, seat absent)` **true** — selects **read 1**:

> ## *"THE HAT CAN COME OFF — the player's own run holds the band without the coach and without eyes; DS-ENTRY is named: world 16 = world 15 + the own run with the open-play hats off."*

**THE ANNOTATION LINES (from stored fields):** the breached guard(s) on the arm of record and the
dosed arm — **none**; `openPlayBoardEmpty` on the arm of record — **true**.

**THE SELECTORS, STORED:** `floods(OWN, seat absent)` = **false** · `holdsBand(OWN, seat absent)`
= **true** · `floods(OWN, dosed = RUN-CAUTION)` = **false** · `holdsBand(OWN, dosed =
RUN-CAUTION)` = **true**.

**BESIDE THE READ, PRINTED FROM STORED FIELDS AND NOT JUDGED:**

* **H-DS-5, R1** — the paired Δ on OWN vs HATS, seat absent: **−0.3347063209087759**
  [−0.34234219017212564, −0.32693032075014067], tolerance **0.16262714004620393**, 43.434876
  half-widths, `beyondToleranceUp` **false**. BESIDE, by field: DS-T1's **1.2480304779783737** and
  DS-T1b's **−0.44707176052829445**.
* **H-DS-5, G9** — the through-ball paired Δ: **−0.5545545545545538** [−0.7447447447447448,
  −0.3473473473473474], tolerance **1.619448395764185**, 2.790932 half-widths, `breach` **false**.
  BESIDE, by field: DS-T1's **2.7877877877877877** and DS-T1b's **−4.023023023023022**.
* **H-DS-5, THE RATIO** — R1 OWN ÷ HATS **0.43130869006572387** [0.423933139702112,
  0.4390986247324944]; G9 OWN ÷ HATS **0.9053800170794194** [0.8753763800602207,
  0.9390134529147982], `excludesOne` **true**.
* **H-DS-6** — R1's paired Δ seat absent **−0.3347063209087759** · at RUN-CAUTION
  **−0.37470435906715016** · at KITCHEN-SINK **−0.3164576389947543**; `holdsBand` at RUN-CAUTION
  **true** and at KITCHEN-SINK **false** (breach `G9 guard.throughBallsPerMatch`). The clean
  `runMulLic` limb's mean and below-1 share on the dosed HATS controls are **0.928285** /
  **0.903767** and **0.893570** / **0.973118** against an EXACTLY ZERO below-1 share on every
  seat-absent arm.
* **the restraint on the arm of record**: mean **0.4524342877592838** · exactly 0
  **0.5475201143702135** · exactly 1 **0.4493805401482557** · `rankBelowCount`
  **0.4493805401482557** · a ZERO PRIOR (the DF clamp, the ambiguous overlap)
  **0.07447001924142006**.
* **THE HATS + OWN ARM'S OWN WORDS**: at all three seat states `floods` **false** and `holdsBand`
  **true**, with an EMPTY breach set and no offside flag.
* **the yield pair, the coupling sentence and the per-state line** are printed at §R3 and stored
  under `faceBlocks.yieldPairs`, `faceBlocks.coupling` and `faceBlocks.perState`.

**THE COUNTERFACTUAL WORDS (stored, each by the SAME frozen rule on ITS OWN stored intervals):**
had the **RUN-CAUTION OWN** arm been the arm of record the rule would read **read1**; had the
**KITCHEN-SINK OWN** arm been the arm of record, **read4**; **D13**'s word is **read1** and
`d13Agrees` is **true** — *"THIS ARM SELECTS THE SAME READ"*.

### §R6 — 在说人话的层面

把「谁该前插」这件事按教练自己的排序交给球员——他看谁在自己前面、按同一套约定排队、排在前
`count` 名就去跑——之后：**每个进攻 tick 真正在跑的人是 0.253849，教练自己的帽子是 0.588555**，
三人以上同时跑的 tick 是 0.002162 对 0.013858。球员给自己的折扣只有两个值：**0.449381 的时候
是 1**（他排在名额里），**0.547520 的时候是 0**（他排在名额外）——十个格子里只有第一格和最后一
格有东西，因为教练的 `slice(0, count)` 本来就是一刀切。

**十道门这次都在容差内**，包括上一次破掉的那道：**直塞球每场 5.860861 → 5.306306**，差
−0.554555，容差 1.619448。越位旗一次都没举。进球、射门、xG 转化、传球成功率、拦截、控球、传球
数、平均传球距离都在容差内。

**给眼睛加价之后仍然在容差内**：RUN-CAUTION 那条臂上跑动降到 0.191822（差 −0.374704），直塞球
5.846847 → 4.516517（差 −1.330330，容差 1.615576），`holdsBand` 仍然是 true。把整块权重都推到
角上的 KITCHEN-SINK 是唯一破门的一条（直塞球差 −3.248248），它按设计不只动跑动。

**分零分有两种原因，这次分开算了**：0.074470 的候选是**先验为 0**（后卫退得太深，教练自己的排
序在那儿是负的），那种情况下无论排第几都是 0 分，折扣**倒推不出来**——这个数单独存了，不摊到
「折扣为 0」里去。**排第几本身倒推不出来**，能看到的只是「排在名额之内还是之外」，所以这里只
报那一个比例，不报排位分布。

球还在飞的时候赢下的前插仍然有 0.119467（上一版 0.100272）——守门那条件读的是**他眼里**谁持
球，状态分类读的是真相，两者对不上的部分就是这个数。套边设计变多了（+0.798799），撞墙的次数这
次**没有分辨出来**（区间跨 0）。

选出来的句子是 read 1：**帽子可以摘了**。这一句是这一阶段唯一的判词；上面每一个数都只是数。

## §HONEST LIMITS

*(canon: this list is the ONE home; the artifact stores NONE of it and its `stage.honestLimitsNote`
points here. The artifact's pointer names THIS doc.)*

1. ⛔⛔ **READ 1 IS A BAND STATEMENT ABOUT THIS WALK, NOT A SHIPPING DECISION.** The sentence names
   DS-ENTRY; it does not arm it. Nothing under `src/` moved, the two DS flags are in no world, and
   the entry — world 16 — is the commander's to open with M-DF.2's own words. What the read
   licenses is exactly what it says: on E13, with the coach's open-play hats off and the seat
   absent, R1 does not flood and no gating guard breaches.
2. ⚠⚠ **THE IN-FLIGHT RUN IS STILL NOT FULLY WITHDRAWN, AND IT WENT UP, NOT DOWN.** M-DS.7 reads
   the PERCEIVED ball's owner; the state classifier reads the ENGINE'S TRUTH. **0.119467** of own
   runs on the arm of record are won at ticks the truth calls *ball in flight* — against DS-T1b's
   stored **0.100272** (quoted by field). The rank law does not touch M-DS.7, so this is the
   seam's own stale-eyes limit (§HONESTY-C 4/7) measured again on a bigger own-run population, and
   the run onto a ball in flight remains the NAMED NEXT SLICE.
3. **THE INHERITED `runMul.*` FAMILY IS PRODUCT-CONFLATED ON EVERY `dsOwnRun` ARM.** DS-T1's
   back-out reads the OWN candidate first and its score carries `restraint`, so on those arms
   `runMul.*` is `restraint · obmRunMul`. On the arm of record it reads mean **0.999886** with
   **0.005832** below 1 — a run that WON almost always carries restraint 1, which is what makes
   that family useless as a seat face here. The face of record for the seat is `runMulLic.*` off
   the licensed run, which carries no restraint factor. Both are published; the names say which.
4. **`runMulLic`'s DENOMINATOR IS TINY ON THE OWN ARMS — BY CONSTRUCTION.** With `dsHatsOff` the
   open-play board is empty, so a licensed run only survives at a restart, a corner crash or a
   cross flight: n = **212** on the arm of record against 456,382 on the control. The dosed *HATS*
   arms are where the seat's price is measured with volume, and those are the numbers §R5 prints.
5. **THE RESTRAINT IS OBSERVED ONLY WHERE THE SEAT IS ABSENT.** On a dosed arm one recorded score
   cannot separate two multipliers, so the family is EMPTY there by construction and the product
   is published instead. A dose-side restraint measurement would need a second recorded quantity
   the engine does not store.
6. ⭐⭐ **`rankAbove` IS NOT RECOVERABLE FROM A SCORE, AND NO RANK DISTRIBUTION IS PUBLISHED.**
   Under the rank law every non-zero score carries restraint 1, so the back-out is a STEP and
   carries no information about HOW MANY mates outranked him. The artifact publishes the
   observable `rankBelowCount` (**0.449381** on the arm of record) and stores
   `rankAboveExactValueRecoverableFromAScore: false`. #410 item 3(ii) asked for a `rankAbove`
   distribution over frozen bins and then said, in the same sentence, that it is 0 by construction
   wherever the score is non-zero — this is that sentence honoured as the observable, and the
   frozen-bin distribution is NOT written rather than written empty (§DEVIATIONS 3).
7. ⭐⭐ **A ZERO SCORE HAS TWO CAUSES AND THE OVERLAP IS PUBLISHED, NOT RESOLVED.** **0.074470** of
   visible own-run candidates on the arm of record have a prior of exactly 0 — the DF clamp, whose
   bite on the pitch the seam doc corrected into the record at #406 item 2. There the restraint is
   NOT RECOVERABLE. `restraint.exactlyZeroShare` (**0.547520**) is therefore a share over the
   RECOVERABLE population only, and the two never mix. What is NOT known: how the restraint splits
   inside that 0.074470.
8. **THE RESTRAINT'S THIRD CELL IS NOT EMPTY: 0.003099.** The law says the value is exactly 0 or
   exactly 1; the back-out is a float division, and **0.003099** of observations on the arm of
   record land on neither. That is float residue in the RECONSTRUCTION, published as
   `restraint.neitherZeroNorOneShare` rather than folded into a neighbouring cell — but it means
   the exact-0 and exact-1 shares do not sum to 1, and they are not meant to.
9. **EVERY SHARE OVER THE OWN-CANDIDATE POPULATION IS A FLOOR.** `decideOffBall` stores
   `cands.slice(0, 4)`, so a candidate that lost badly is invisible — including, most likely, part
   of the exactly-0 mass, whose score is 0. The guard-pass face is named
   `ownCandidateVisibleShareFLOOR` for that reason, and both denominators are published.
10. **THE GUARD DENOMINATOR IS A RECONSTRUCTION IN TWO FORMS.** The coach tick that writes the hat
    board runs at the head of the step, before the decide loop, so the POST-STEP form is the
    denominator of record; the PRE-STEP form is published beside it. The self-diagnosing receipt
    `ownCandidateOutsidePostGuardShare` is **0.000000** on the arm of record (0.000374 on the
    additive arm).
11. **THE KITCHEN-SINK ARM IS NOT AN H-DS-6-ONLY CONTRAST, AND IT IS THE ONE BREACH.** It moves
    the plane and the support score as well as the run, so its G9 breach (**−3.248248**) mixes a
    run price with a different standing shape and must not be read as "the eyes break the guard".
    RUN-CAUTION is the arm whose only non-zero weights are on the run, and it holds the band.
12. **RUN-CAUTION IS A HAND-SET PROBE CORNER, NOT A DOSE OF RECORD.** It is declared as one
    wherever it appears; the dose space belongs to selection (#390), and nothing here proposes it
    for shipping.
13. **THE SEAT'S OWN BITE IS 996/999 AT RUN-CAUTION**, not 999/999 (KITCHEN-SINK is 999/999): on
    three seeds the dosed control's whole-match signature equals the seat-absent control's. `gBite`
    requires the seat bite to be non-zero, and the three seeds are now **STORED AS A FIELD**
    (`bite.seatBite[0].identicalSeeds` = **12,556,269 · 12,556,316 · 12,556,549**) — DS-T1b §CORR 4's
    correction applied.
14. **ONE `gBite` SEED IS EXEMPT, ON `HATSOWN-E13-KITCHENSINK` (998/998).** On that seed the armed
    arm recorded ZERO own-run decisions, so `dsOwnRun` had no candidate to push — the exemption
    shape §P.8 names, fired once and stored.
15. **FOUR NON-BREACHING GUARD ROWS ARE ONE OR MORE SEEDS FROM CHANGING THEIR RESOLUTION WORD**
    (the count is read off the artifact's `loo` array, #409 item 5's form rule), and **EVERY ONE IS
    NAMED**: `guard.interceptionsPerMatch@HATSOWN-E13-RUNCAUTION` (Δ +0.373373, interval lower edge
    −0.008008) flips UP-resolved on **91** single-seed drops;
    `guard.interceptionsPerMatch@OWN-D13` (Δ −0.458458, upper edge +0.013013) flips DOWN-resolved
    on **32**; `guard.meanAimDistanceMetres@HATSOWN-E13-KITCHENSINK` (Δ −0.061931, upper edge
    +0.002631) on **6**; `guard.throughBallsPerMatch@HATSOWN-E13-KITCHENSINK` (Δ +0.196196, lower
    edge +0.011011) on **2**. None is a breach either way and none is read-bearing — R1 and G9
    flip **0** on every OWN arm.
16. **G8 IS A DECLARED RECONSTRUCTION** (the engine keeps no pass-length ledger) and
    **`crowd.crashShare`'s POSSESSION ATTRIBUTION IS NOT LN-T1'S** — both inherited from DS-T1
    unchanged, so the levels are comparable within this exam and not across exams.
17. **THE TIRED LIMB IS STILL UNPINNED BY THE BATTERY.** No body reaches `stamina < 0.4` inside a
    match (#406 §CORR 4), so the `OFFBALL_TIRED_MUL` factor in the score and in every back-out is
    exercised by fixtures only.
18. **THE D13 ARMS ARE BESIDE, NOT OF RECORD**, and only the three seat-absent ones were walked:
    the played book × a dosed seat is not measured here. D13's word AGREES with E13's.
19. **THE WALL-PASS COUPLING DID NOT RESOLVE THIS TIME.** Wall-pass fires move **+0.231231**
    [−0.067067, 0.540541] — the interval spans zero, so the direction is NOT resolved and no
    sentence is written about it. The overlap limb did resolve (**+0.798799**).
20. **THE SIZING VARIANCE CAME FROM 12 CLUSTERS.** Canon calls that noisy. The REALISED
    half-widths at N = 999 are **0.007705934710992485** (R1) and **0.004261781891515826**
    (`passCompletion`), both far inside the declared 0.05 target and both close to the projection.
21. **THE ARTIFACT IS 63,447,757 BYTES.** Compact JSON, canon-compliant; the per-seed cells over
    twelve arms are **95.35 %** of it (60,497,829 of 63,447,757 bytes, both counted from the
    written file).
22. **A MACHINE READING ON ONE MACHINE**: `perf.meanWallSecondsPerMatch`
    **0.1606292959626293**; the battery wall was **2203.427 s**.

## §DEVIATIONS (declared by the executor; the commander disposes)

1. ⭐⭐ **THE §SEAM-C LINE COMPARISON IS NOW GATED, AND DS-T1b's DECLARED DISAGREEMENT IS RETIRED
   POSITIVELY.** DS-T1b's §DEVIATIONS 1 had to compare SITE TEXT + FILE + CLASS + COUNT only,
   because §SEAM's table's lines had gone stale and §SEAM-B carried none. #410 refreshed the
   inventory with MEASURED lines, so this stage parses §SEAM-C's OWN SECTION (sliced by its
   heading so the two older tables cannot contaminate the parse, with the slice's row count
   asserted at 9) and compares TEXT + FILE + **LINE** on every row plus the five definition lines
   — all EQUAL, `forkLineNumbersAgree: true`. A stage doc that drifts one line from now on goes RED.
2. ⭐⭐ **THE `rankAbove` DISTRIBUTION IS NOT WRITTEN — THE OBSERVABLE IS.** #410 item 3(ii) asks
   for `rankAbove` in frozen bins 0 · 1 · 2 · 3 · 4+ AND observes, in the same sentence, that
   "backed out where the score is non-zero it is 0 by construction", asking instead for the
   OBSERVABLE `rankAbove < count` share and a declaration that the exact rank is not recoverable.
   Both cannot be honoured at once: an all-zero five-cell histogram would be a false face (canon:
   *unit-name truth*). **THE OBSERVABLE WAS TAKEN**, the declaration is stored as a boolean and a
   sentence, and the rank-law step is instead pinned by FIXTURES over the whole (count × rankAbove)
   grid. §HONEST LIMITS 6 carries the consequence.
3. ⭐⭐ **THE ZERO-PRIOR POPULATION IS A NEW FACE THE DISPATCH ASKED FOR IN PROSE.** #410 item 3
   says "a zero score means restraint 0 OR a zero prior — the DF clamp — separate them by
   recomputing the prior from the body's own pos/role". That is exactly what
   `seam.priorZeroShare` / `seam.priorAboveZeroShare` / `seam.priorZeroPerMatch` and the boolean
   `ambiguousOverlapIsTheZeroPriorPopulation` do, and a `gFaces` partition asserts that the
   recoverable population IS the prior-above-zero one. The recomputation reads the body's own
   `pos` and `role` and NO snapshot, so it stays byte-inert.
4. **`rankBelowCount` IS A REFERENCE, NOT A SECOND COMPUTATION.** It is the SAME stored face as
   `restraint.exactlyOneShare`, published under its own name with the equivalence sentence beside
   it, because a second numerator would be a second copy that could drift (canon: one
   authoritative source per fact).
5. **THE `runningMates` FAMILY IS RETIRED, NOT KEPT BESIDE.** Its term is gone from the law, so
   inverting it would be inventing a quantity the source no longer computes. The retirement is
   recorded as a STORED BOOLEAN off the block's whole text
   (`blockReadsNoVelocityNoTopSpeed: true`), and DS-T1b's fixture erratum (§CORR 7's
   `runningMates.twoOfTwo`) is retired with it.
6. **THE RESTRAINT'S TEN BINS ARE KEPT THOUGH ONLY TWO CAN FILL.** Under the rank law eight cells
   are structurally empty. They were kept because they are DS-T1b's frozen bins and keeping them
   makes the step VISIBLE as a stored fact (`[602046, 0, …, 0, 497541]`) instead of a claim, and
   because a residue cell is where float noise would show up. The third cell's share is published.
7. **N IS THE BLOCK'S AFFORDANCE (999), NOT `nRequired` (53 and 18).** #410 item 3(v) says
   "N = min(required, the affordance) — say which". Said: **the affordance**; canon's *seed
   discipline* consumes a block WHOLE of record, and the rare populations this exam must not report
   as vacuous are sized by volume alone.
8. **THE FLOOD COLUMN WAS RENAMED AND A TWO-SIDED COMPANION ADDED.** #409 item 5 named
   `beyondToleranceUp`. The rename alone would have left a reader unable to see that the arm of
   record's |Δ| DOES exceed the tolerance (downward), so
   `absDeltaBeyondToleranceEitherWay` is stored beside it and `gFaces` re-derives both.
9. **`gPullCount` WRAPS A THROWAWAY MATCH, NEVER A BATTERY WALK**, and proves its own wrapper
   transparent by requiring the wrapped observed signature to equal the UNWRAPPED lockstep walk's.
   The counter is required to be LIVE (per-match pulls run from 466 on the seat-absent shipped path
   to 10,423 on a dosed OWN arm).
10. **G-REPRO-DST1b COMPARES 175 FIELDS.** `wallMs` is excluded as a machine timing; DS-T1c's own
    new fields have no counterpart in DS-T1b's row and DS-T1b's retired `runningMates` fields have
    none in this one, so the compared set is the INTERSECTION — computed, not typed, and every
    other field DS-T1b stored for `HATS-E13-ABSENT` (the whole-match signature included) reproduced
    on all twelve re-walked seeds.
11. **ONE INHERITED FIXTURE HAD TO CHANGE FOR A DOCUMENTATION REASON, DISCLOSED AT
    §DEV-PREFLIGHT.** The seam doc now writes its per-file flag-count sentence THREE times, so the
    row-count fixture moved from 8 to 10 and a second fixture was added asserting the rows DEDUPE
    to four — which is the assertion that a drifted copy would actually break.
12. **THE PUSH CLASSIFIER, THE MIRROR HALF OF THE WALKER, G8, THE CROWDING ATTRIBUTION AND THE
    `allGreen` SEEDING ARE INHERITED FROM DS-T1/DS-T1b UNCHANGED**, with their §DEVIATIONS still
    standing (through balls counted in `performThroughBall`; the six pushes as 1 flag-gated +
    3 hat-guarded + 2 keeper-up-guarded; the byte-faithful mirror;
    `makeRunCandidatesAllHatGuardedOnShippedPath`'s name over-claiming its derivation).
13. **THE R1 AND BAND ROWS ARE PUBLISHED FOR ALL EIGHT CONTRASTED ARMS**, including the four
    HATS + OWN arms the reads do not stand on, and the dosed HATS controls' own seat receipts —
    which is what makes the seat's price visible with volume (§HONEST LIMITS 4).

## §GATES — 25 of 25 GREEN (`allGreen` = true, a STORED boolean)

| gate | ✅ | derived note |
|---|---|---|
| `gWorld` | ✅ | per arm, on every walked match AND the construction receipt: `bqArmedVersion` 13 with the cushion, both later doors absent, `edsPerceivedChoice`, every CTB/RC/BF seam absent, the TWO DS FLAGS exactly as due, `obmMovement` exactly as due with the arm's OWN 16-slot matrix on `baseGenome` + `effGenome` of both teams on exactly the dosed arms, and `info.genome` CLEAN of the matrix on every arm; re-pinned on constructed matches of all twelve arms at 900,007,070 |
| `gDoseCopy` | ✅ | BOTH matrices: 16 slots compared each, 16 equal each; RUN-CAUTION **2** non-zero slots (13 and 14), both at the domain MIN and both in the `runScore` row, plane and support rows zero; KITCHEN-SINK **16** at a domain corner with the `runScore` row at MIN; the two matrices differ |
| `gDoseSource` | ✅ | both dose files' BYTES hashed against their pins BEFORE any seed; the D13 arms ride the SHIPPED loaders, never `info.genome` |
| `gAnchoredConstants` | ✅ | **156** anchored sites, every one at its declared occurrence count — including DS-T0c's amendment (the three-factor score line, the cap's two lines and its three count inputs, `mine`, `theirs`, THE COACH'S OWN COMPARATOR, the snapshot loop's gid+side match, the percept pull, the perceived-owner guard, `runRank`'s head and `return`, the shipped `.map` that CALLS it and the byte-unchanged `.sort` at both its occurrences, `runnerCount`'s head and both call sites), the KITCHEN-SINK sweep's own lines, and the two ZERO-count anchors proving neither DS flag appears in `a4World.ts`; `NI_FRACTION` inherited as an EXPRESSION from two independent instrument files and equal |
| `gPredicateFixtures` | ✅ | **189** fixtures, each predicate with a firing and a non-firing case — DS-T1b's whole set (minus the retired `runningMates` pair) plus the RANK LAW's cap in both arms, its value set proved EXACTLY {0, 1} over the whole (count × rankAbove) grid, the coach's comparator in both tie directions and against his own index and checked AGAINST AN ACTUAL SORT, the zero-score ambiguity from both sides, `runRank`'s three call sites and the retired inline expression's absence, this instrument's prior proved EQUAL to `clamp01(runRank(role, x) / RUN_PRIOR_MAX)` at every role × quarter-metre with a typed divisor breaking it, the block's four sets, and gScratchBand's own band arithmetic |
| `gLedgerRead` | ✅ | every join reads an engine record; the declared reconstructions (the wall conjuncts, G8, the passer upper bounds, the two guard forms, the prior) say so; the count itself is read off the engine's OWN exported pure function, and so is the ranking |
| `gClassesNonVacuous` | ✅ | the empty run classes are exactly the four `ownRunInBehind` cells on the arms without `dsOwnRun`; BOTH restraint cells (exactly 0 AND exactly 1) and BOTH prior cells (zero AND above zero) are LIVE on every seat-absent own arm, and the restraint family is EMPTY on every dosed arm (both asserted) |
| `gCodeFactGraph` | ✅ | 71 files, 581 spans, 76 designation-field sites all resolved, four roots hashed whole with extracted callees, closure 92 spans at depth 5 uncapped, the six pushes classified 1/3/2/0, the fork inventory EQUAL to §SEAM-C's on TEXT + FILE + **LINE**, the five definition lines equal, `runRank`'s span and all THREE call sites hashed with the summand pattern EXECUTABLY unique, `runnerCount`'s span and both call sites hashed, and the own-run block's FOUR sets EQUAL to §LAW-C's read set with `blockReadsNoVelocityNoTopSpeed` true |
| `gBite` | ✅ | **999/999 on seven of the eight contrasted arms; 998/998 with ONE exempt seed on `HATSOWN-E13-KITCHENSINK`**; the seat's own bite 996/999 at RUN-CAUTION (the three identical seeds STORED) and 999/999 at KITCHEN-SINK |
| `gRepro` | ✅ | **G-REPRO-DST1b: 175 fields × 12 seeds, ZERO mismatches** — the seam's OFF path reproduces DS-T1b's stored cells field for field, signature included |
| `gPullCount` | ✅ | **24** spied pairs: the per-match `perceivedSnapshot` pull count EQUAL observed vs unobserved on every one, the signatures equal, and the wrapped observed signature equal to the UNWRAPPED lockstep walk's; the counter is LIVE (466 to 10,423 pulls per match by arm) |
| `gLockstep` | ✅ | observed ≡ unobserved whole-match signature on all **24** arm × scratch walks; the instrument installs no wrapper on a battery walk and never calls `perceivedSnapshot` |
| `gDeterminism` | ✅ | X-DET twice per arm on two scratch seeds: signatures AND row bytes identical, **24** pairs |
| `gFingerprintProd` | ✅ | X-FP-PROD recomputed in-process = the literal of record, UNCHANGED |
| `gSrcUntouched` | ✅ | `git diff --stat HEAD` and `git status --porcelain` EMPTY over **src/ AND tests/** — X-SRC-ZERO |
| `gSeedsBookedEqualWalked` | ✅ | 999 distinct battery seeds + the receipt at 12,556,999, twelve arms ⇒ **12,000 walks booked**; `unwalkedTail` **null**; every scratch seed ≥ 900,000,000 and STORED |
| `gSeedDisjoint` | ✅ | the whole battery inside 12,556,000–999, disjoint from all TWELVE consumed blocks; the re-walks inside DS-T1b's own band |
| `gN` | ✅ | N = 999, no override env; both sizing rows `resolvableAtNFrozen` true (53, 18) and the REALISED half-widths published |
| `gLoo` | ✅ | **80** scoped rows (R1 + the nine gating guards × eight contrasted arms), 999 seeds dropped each; R1 and G9 flip 0 on every OWN arm; **FOUR** rows flip and all four are named at §HONEST LIMITS 15 — none read-bearing |
| `gScratchBand` | ✅ | **17** scratch seeds, every one DERIVED from the ONE declared base 900,007,000 and INSIDE the declared band [900,007,000, 900,007,099]; the out-of-band list is EMPTY; the band is above canon's scratch floor and DISJOINT from the battery block both ways |
| `gTwoFractions` | ✅ | **15** read-bearing pairs, each published per its own denominator AND per match; **3,108** face rows over 259 keys × 12 arms and **2,072** Δ rows |
| `gFaces` | ✅ | **5,180 / 5,180** face-and-Δ checks and **498 / 498** bin / median / top-bin-share / partition / R1 / GUARD / READ-WORD / sizing checks re-derived off the SERIALIZED artifact |
| `gReadWords` | ✅ | `floods`, R1's one-sided `beyondToleranceUp` AND its two-sided companion, every guard row's harmful-direction test, `holdsBand`, the selected read, ALL THREE counterfactual words and the agreement word re-derived by applying the frozen rules to the serialized rows; every printed sentence is one of the FOUR frozen literals |
| `gHashOrder` | ✅ | a **42**-key allowlist schema; the body hash computed LAST; the NON-body receipt reproduces from the written file |
| `gStage` | ✅ | `stage.instrument` is this instrument's path and `stage.instrumentSha256` is the sha256 of the RUNNING file re-read from disk |

**PROSE SWEEP** (canon: *a stage doc's numeric sweep covers EVERY numeric literal in prose at ANY
precision*). Every numeric literal in §0–§R6, §HONEST LIMITS and §DEVIATIONS is an artifact field
value (at 6 dp where the field is a rate or a share, at full precision where the read's own
annotation lines print it), a stored count, a stored hash, a stored bin cell, a source line number
carried by an anchor or a code fact, a seed, or a ruling's own quoted number. The DECLARED
exceptions: **§DEV-PREFLIGHT's two smoke Δs (−0.222513 and 0.006446) and its 67.1 s / 0.173153
wall readings are 12-cluster SCRATCH values that exist nowhere in the final artifact and load-bear
nothing** (the two `hwSmoke` half-widths beside them DO live in `sizing.rows`); the artifact's own
**63,447,757** byte count, its **60,497,829**-byte `perSeedCells` measurement and its file sha256
cannot live inside the artifact and are published here per canon, with the 95.35 % their ratio
gives; **900,000,000** is the scratch-range floor from the canon sentence quoted at §P.7; **2.3**
is the licence's own extracted seconds, **0.65 / 2 / 1 / 0** are the count's own moved literals and
**45** is the ranking's own divisor; **12** in "12 clusters" is the smoke's own cluster count;
**18 m** at §P.5 is the seam doc's own approximate statement of where the DF clamp bites, quoted as
its sentence and not re-derived here. DS-T1's and DS-T1b's numbers quoted in prose
(**0.584786 → 1.832816**, **1.2480304779783737**, **2.7877877877877877**, **0.585428 → 0.138356**,
**6.156156 → 2.133133**, **−0.44707176052829445**, **−4.023023023023022**, **0.100272**) are all
fields of `docs/world-model/data/ds-t1-own-run-exam.json` and
`docs/world-model/data/ds-t1b-own-run-exam.json` — VERIFIED field by field at 6 dp — and this
artifact stores the ones it prints beside the reads under `hNumbers.hDs5.dsT1Quoted` and
`hNumbers.hDs5.dsT1bQuoted`. The numbers inside ruling #409 item 3(iv)'s QUOTED PARAGRAPH at §0
(**0.57**, **0.542593**, **0.100272**) are the commander's own words, quoted as a block, not
re-derived. Negative values use a typographic minus and are stored NEGATIVE. The derived counts in
this §GATES table (**25**, **999**, **12,000**, **156**, **189**, **175**, **24**, **80**, **17**,
**15**, **3,108**, **259**, **2,072**, **5,180**, **498**, **42**, **71**, **581**, **76**, **92**,
**5**, **16**, **2**, **996**, **998**, **13**, **53**, **18**) are read off the artifact's own
arrays and gate notes.

**THE ARTIFACT'S FINAL RECEIPTS** (recomputed after the final write; they cannot live inside the
artifact, so canon publishes them here): path `docs/world-model/data/ds-t1c-own-run-exam.json`,
**63,447,757 bytes**, file sha256
`1b0da6c95d0f80355ec18431e1b605689e25ca0e67fb52a26526cd15b56067ee`, `hashedBodySha256`
`f37e633e9fd8728688b83dd0e0e7f3c5a2af3f8deeaff1b72a5022f6dbb9bcf7`, `instrumentSha256`
`61fad55a5b3b0c666a6b2de78ada42e59a1546d39b3274268dcb28423ef7bf20` (equal to
`shasum -a 256 scripts/probes/ds-t1c-own-run-exam.ts` on the running file),
`receipts.hashReproducesFromFile` **true**, `receipts.bodySchemaKeys` **42**.
