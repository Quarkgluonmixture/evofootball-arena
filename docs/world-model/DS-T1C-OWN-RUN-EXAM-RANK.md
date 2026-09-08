# DS T1c — 「自己的前插 · 三考」 THE OWN-RUN EXAM, THIRD RUN

Status: **FROZEN — §0 through §DEV-PREFLIGHT are sealed at the FREEZE commit and the battery has
NOT been walked.** The instrument is byte-identical between FREEZE and RESULTS, §P is never
edited after sight, and §DEV-PREFLIGHT discloses the two scratch smokes that sized N. X-SRC-ZERO
holds throughout: not one byte under `src/` or `tests/` is created or edited. **NOTHING SHIPS** —
the two DS flags remain absent from every world and the production fingerprint is unchanged. The
commander rules.

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
