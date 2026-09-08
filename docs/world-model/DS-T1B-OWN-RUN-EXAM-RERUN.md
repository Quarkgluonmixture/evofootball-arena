# DS T1b — 「自己的前插 · 复考」 THE OWN-RUN EXAM RE-RUN

Status: **WALKED — the battery is complete, ALL 24 GATES GREEN (`allGreen` = true), and the READ
IS PRINTED AT §R5.** §0 through §DEV-PREFLIGHT were sealed at the FREEZE commit **`f920bdf`** and
were NOT edited after sight; the instrument is byte-identical between FREEZE and RESULTS
(`git diff f920bdf -- scripts/probes/ds-t1b-own-run-exam.ts` EMPTY). X-SRC-ZERO holds throughout: not one byte under `src/` or `tests/` is created or
edited. **NOTHING SHIPS** — the two DS flags remain absent from every world and the production
fingerprint is unchanged. The commander rules.

Authority: **COMMANDER RULING #408 item 5** (the dispatch — the twelve arms, the two dose copies,
the re-frozen reads, the three new gates, the seeds), standing on **#408 item 2** (the amended law
of record, M-DS.6–7), **#408 item 3** (the honest findings — the own run now needs eyes; G-OFF
cannot see an ungated idempotent pull, the counter can) and **#408 item 4** (H-DS-2 / H-DS-3 /
H-DS-4, whose numbers are printed beside the reads). It INHERITS **#406 item 5** (DS-T1's full
specification: the arms' form, R1, the band, the faces, the reads, the gates) and **#407 items
2–5** (DS-T1's numbers of record and the restraint's design).

* THE SEAM UNDER EXAM (read, never touched): [`DS-T0-OWN-RUN-SEAM.md`](DS-T0-OWN-RUN-SEAM.md)
  §LAW-B · §HONESTY-B · §SEAM-B · §COMMANDER CORRECTIONS-B.
* THE INSTRUMENT INHERITED: [`DS-T1-OWN-RUN-EXAM.md`](DS-T1-OWN-RUN-EXAM.md) +
  `scripts/probes/ds-t1-own-run-exam.ts` (with its §COMMANDER CORRECTIONS 1–7).
* THE WALKER BEHIND IT: [`DS-C0-DESIGNATION-CENSUS.md`](DS-C0-DESIGNATION-CENSUS.md).
* THE DOSE IDIOM: `scripts/probes/obm-t1-policy-exam.ts`; THE DOSE-COPY FORM:
  [`LN-T1-LANE-EXAM.md`](LN-T1-LANE-EXAM.md).
* CONTRACT: [`DS-DESIGNATION-CONTRACT.md`](DS-DESIGNATION-CONTRACT.md) §2 M-DS.1–7.
* INSTRUMENT: `scripts/probes/ds-t1b-own-run-exam.ts`.
  ARTIFACT: `data/ds-t1b-own-run-exam.json`.

---

## §0 — WHAT THIS IS AND WHY

**THE QUESTION (#408 item 5, not re-argued here): with the restraint in the player, does the own
run hold the coach's band without the coach (H-DS-3), what did withdrawing the in-flight run cost
(H-DS-4), and — with a dose that ACTUALLY prices the run — do the eyes restrain the flood
(H-DS-2)?**

DS-T1's READ OF RECORD, quoted (ruling #407 item 3; the sentence is one of the four frozen
literals and is stored in this exam's artifact as `repro.dsT1Quoted.readOfRecord.sentence`):

> *"THE RESTRAINT WAS THE COACH'S — H-DS-1 holds with or without eyes; the law needs a
> player-side restraint term (a later slice); the seam stays dormant."*

**THE RESTRAINT SLICE THAT ANSWERED IT.** DS-T0b (ruling #408 items 1–2) moved the coach's two
restraints into the player as things he can SEE, under the SAME flag `dsOwnRun`, with no new
constant, no new gene and no new flag:

* **M-DS.6 — THE COUNT PRIOR, READ AGAINST WHAT HE SEES.** `runnerCount(mode, tempo, urgency)` is
  the coach's own count expression CODE-MOVED out of `assignRunners` and exported; against it the
  body counts `runningMates` = Σ `clamp01(body.vel.x · team.attackDir ÷ p.topSpeed)` over the
  same-side outfield bodies HIS OWN SNAPSHOT holds (not himself, not the perceived carrier, not
  the keeper, not sent off), and `restraint = clamp01(1 − runningMates ÷ count)` multiplies the
  score: `s = ((W.runScore · prior) · restraint) · (tired ? OFFBALL_TIRED_MUL : 1) · obmRunMul`.
* **M-DS.7 — THE STATE GUARD, PERCEIVED.** The candidate exists only when the PERCEIVED ball's
  `ownerGid` is a roster mate other than himself — which WITHDRAWS the in-flight and restart runs
  that were `0.777604` of DS-T1's own runs (`0.542593` in flight, `0.235011` at his side's own
  restart; the three values are DS-T1 artifact fields, quoted at #408 item 3 and #407 item 2).

**THE DOSE CORRECTION, STATED.** #406 item 5(i) named MARKER-ESCAPE as the dose that would answer
H-DS-2. It cannot, and #407 §CORR 6(i) struck the choice in the commander's own words: MARKER-
ESCAPE's two MAX weights sit on `planeDepth` and `planeWidth`, **its `runScore` row is all
zeros**, and the seat's arithmetic is `runMul = 1 + outputs[O_RUN] · OBM_SCORE_SPAN` — so
`obmRunMul` was EXACTLY 1 on every walked tick and READ 2 was **unreachable by construction**.
This exam therefore walks TWO doses whose `runScore` rows are NOT zero: **RUN-CAUTION**, a
hand-set PROBE CORNER declared as one, and **KITCHEN-SINK**, OBM-T1's ceiling probe byte-copied.
Both matrices are stored with their `runScore` rows beside the struck one, so the difference is a
stored fact rather than a sentence.

**IT IS AN EXAM. It arms nothing in the game; nothing ships.** X-SRC-ZERO: no file under `src/`
or `tests/` is created or edited. The reads name DS-ENTRY, or OBM-T2 first, or a further slice, or
a broken guard — and the commander rules.

---

## §P — THE FROZEN PROTOCOL

*(⭐ **AMENDMENT** marks every place this protocol differs from DS-T1's #406 item 5 protocol,
which is otherwise INHERITED SECTION BY SECTION.)*

### §P.1 — THE ARMS, AND THE TWO DOSE COPIES

⭐ **AMENDMENT: TWELVE walks per seed, not nine — the seat's dose column becomes THREE.**

**On E13** (world 13 EMPTY-BOOK — `a4MatchFlags(13)` + `armA4World(m, null, 13)`, ③'s control and
DS-T1's own E13 construction byte for byte), the NINE ARMS OF RECORD:

| arm | `dsOwnRun` | `dsHatsOff` | OBM seat |
| --- | --- | --- | --- |
| `HATS-E13-ABSENT` | — | — | absent — **the shipped path, the control** |
| `HATS-E13-RUNCAUTION` | — | — | RUN-CAUTION |
| `HATS-E13-KITCHENSINK` | — | — | KITCHEN-SINK |
| `HATSOWN-E13-ABSENT` | ✓ | — | absent — **the ADDITIVE form** |
| `HATSOWN-E13-RUNCAUTION` | ✓ | — | RUN-CAUTION |
| `HATSOWN-E13-KITCHENSINK` | ✓ | — | KITCHEN-SINK |
| **`OWN-E13-ABSENT`** | ✓ | ✓ | absent — ⭐⭐⭐ **THE ARM OF RECORD** (H-DS-3 · H-DS-4) |
| **`OWN-E13-RUNCAUTION`** | ✓ | ✓ | RUN-CAUTION — ⭐⭐⭐ **"dosed" IN THE READS**; H-DS-2's arm |
| `OWN-E13-KITCHENSINK` | ✓ | ✓ | KITCHEN-SINK — the CEILING probe; its word STORED BESIDE |

**On D13** (the PLAYED form — the same world 13 with the SHIPPED loaders' L3 and PC doses through
`armA4World`), the THREE seat-absent arms `HATS-D13` · `HATSOWN-D13` · `OWN-D13`, published BESIDE.

**THE PAIRING (unchanged in form).** Every Δ is against the HATS arm at the SAME seat state and
the SAME book (`CONTROL_OF`): the E13-absent arms against `HATS-E13-ABSENT`, the RUN-CAUTION arms
against `HATS-E13-RUNCAUTION`, the KITCHEN-SINK arms against `HATS-E13-KITCHENSINK`, the D13 arms
against `HATS-D13`.

⭐ **AMENDMENT: THE TWO DOSES.**

* **RUN-CAUTION** = `matrix([O_RUN, F3, MIN], [O_RUN, F2, MIN])` in obm-t1-policy-exam.ts's own
  `matrix(...)` idiom (`IDX` · `F1..F4` · `O_DEPTH..O_RUN` · `ZERO_MATRIX` · `matrix()` · the
  MIN/MAX aliases, all anchored): `targetCongestion` (F3) and `ownMarker` (F2) price the RUN DOWN
  at the domain MINIMUM, and the plane and support rows are all zero. ⛔ **A HAND-SET PROBE
  CORNER, DECLARED AS ONE — it is NOT a dose of record**; the dose space belongs to selection
  (#390). It is the first dose this exam family walks whose `runScore` row is non-zero.
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

The walker is DS-T1's, re-taken at this head with its field names KEPT BYTE FOR BYTE, which is
what lets **G-REPRO-DST1** compare field for field. **DS-T1's three paid debts STAY PAID and are
inherited unchanged:**

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
direction). DS-T1's whole fixture set is inherited — the cadence predicates, DEBT (a)'s two forms
disagreeing on a hold armed inside the step, the branch ladder, the nine-cell run classifier with
`ownRunInBehind` as its own class, the own-run episode's set/clear, the state classifier, the 2过1
trigger's six conjuncts, the prior at every role at every quarter-metre, the `runMul` back-out and
the `flagGated` classifier — ⭐ **AMENDED by these additions**:

* **THE TWO DOSES' SHAPES**, stated both ways (RUN-CAUTION's two slots and its zero plane rows;
  KITCHEN-SINK's sixteen corners and its MIN `runScore` row; the two matrices DIFFER; and the
  struck MARKER-ESCAPE's `runScore` row is zero where BOTH of these are non-zero);
* **THE RESTRAINT BACK-OUT**, both ways: an identity when nobody runs, a half restraint recovered,
  EXACTLY ZERO recovered when the count is already running, recovery THROUGH the tired limb, the
  tired limb mattering, a zero prior REFUSED — and, positively, that on a DOSED arm the same
  arithmetic recovers `restraint · obmRunMul` and **NOT** the restraint;
* **THE `runningMates` INVERSION**: zero when the restraint is 1, 1.5 out of a count of 3, and
  CENSORED where the clamp bit;
* **THE CLEAN `runMul` LIMB** off the LICENSED run's score: identity, a priced-down run, recovery
  through the tired limb, and a zero weight refused;
* **THE BLOCK'S OWN NOT-HATTED GUARD** (a runner / arriver / overlapper is hatted, an unhatted
  body is not; a live wall licence, an expired one, and no licence at all);
* **THE COUNT**: the engine's own exported `runnerCount` produces all three values, and this
  instrument's reconstruction AGREES with it on the full (6 modes) × (tempo) × (urgency) corner
  grid;
* **THE BIN EDGES**: restraint 0 lands in the first cell and 1 in the top cell, `runningMates` at
  its bound clamps to the top cell, and the own-back-out ceiling IS the seat's own derived span.

### §P.3 — R1, THE FLOOD FACE (INHERITED UNCHANGED)

**R1 = EXECUTED RUNS PER IN-POSSESSION OPEN-PLAY TEAM-TICK.** Per team, per STEPPED tick:
`match.possessionSide === team.side` · `match.phase === 'playing'` · the team carries NO live
`cornerCrash` and NO live `crossFlight` (both read off the engine's own held-licence clocks,
`simTime < until`, at the end of the tick). THE COUNT is of OUTFIELD BODIES (not the keeper, not
sent off) whose `p.action.type` is `MakeRun` — **the BODIES, not the board**.

Published per arm: the FROZEN BINS `0 · 1 · 2 · 3 · 4 · 5 · 6+`; the MEAN; the SHARE of ticks with
**≥ 3** runners; the paired Δ of the mean vs the HATS arm at the SAME seat state with the CLUSTER
BOOTSTRAP (2,000 draws, `Rng` seeded from the block base 12,555,000); the tolerance
`NI_FRACTION · |control mean|`; and BOTH FRACTIONS (`r1.teamTicksPerMatch` and
`r1.runnerTicksPerMatch`).

> ⭐⭐⭐ **`floods(arm)` = the paired Δ of R1's MEAN is RESOLVED (the 95 % interval excludes zero)
> AND UP AND BEYOND the tolerance.**

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

**INHERITED FROM DS-T1, RE-WALKED ON TWELVE ARMS:** populations A–C (the board with
`board.openPlayEmptyShare` and its stored boolean `openPlayBoardEmpty`; the decision ticks with
the nine-cell class split INCLUDING `ownRunInBehind` and DEBT (a)'s calibration beside; the yield
per RUN EPISODE — hat episodes as DS-C0 defined them and the OWN-RUN EPISODE as one body's
consecutive `MakeRun` ticks whose winner's `why` is the seventh literal — with passes aimed,
completed, through, SHOTS and GOALS through the shooter gid recorded at the push, the wide bins and
every median's top-bin share beside it); runs and yield **PER STATE**; runs **BY ROLE**; the
**COUPLING** faces; the **CROWDING** family (`crowd.crashShare`, `guard.spacingUnder4` and its
pooled companion); and the seat's `runMul` distribution over the frozen `[1 − OBM_SCORE_SPAN,
1 + OBM_SCORE_SPAN]` range, taken on EVERY arm so the seat-absent arms are its own noise floor.

⭐ **AMENDMENT — THE SEAM'S NEW FACES** (#408 item 5(ii)), on the OWN and HATS+OWN arms:

* **`restraint`** — frozen bins over `[0, 1]` in TEN cells, the mean, and the shares **EXACTLY 0**
  and **EXACTLY 1** stored separately (both exact in IEEE-754: `0 · x === 0` and `x · 1 === x`),
  with the bin-derived median and its top-bin share.
* **`runningMates`** — frozen bins over `[0, 4]` in EIGHT cells (the bound is the seam doc §LAW-B's
  own DERIVED one), the mean, and the **CENSORED share** where the clamp bit.
* **THE PERCEIVED-OWNER GUARD'S PASS SHARE, AS A FLOOR** — visible own-run candidates ÷ unhatted
  attacking off-ball decision ticks, in BOTH forms of the guard reconstruction, with the count of
  visible candidates falling outside the post-step form stored as its own receipt.
* **THE `count` DISTRIBUTION** (1 / 2 / 3 shares and the mean), read off the ENGINE'S OWN exported
  pure `runnerCount(mode, tempo, urgency)` — no percept, no mutation, no rng.
* **THE IN-FLIGHT AND RESTART OWN-RUN SHARES** — expected ≈ 0 by construction (M-DS.7 withdrew
  them); **STORED, NOT CLAIMED**, with the per-state mix beside them.
* **THE SEAT'S `runMul` ON A CLEAN LIMB WITH ITS NOISE FLOOR BESIDE** — see below.

⭐ **AMENDMENT — HOW THE NEW FACES ARE OBSERVED, AND WHY IT IS THE ONLY BYTE-INERT WAY.**
Recomputing `restraint` from the snapshot the body used is impossible byte-inertly:
`match.perceivedSnapshot` MUTATES perception memory (the E3R2 recorder trunk). So both faces are
**BACKED OUT** of the engine's own recorded candidate score, exactly as DS-T1 backed out `runMul`.
DS-T0b's arithmetic is `s = ((W.runScore · prior) · restraint) · (tired ? OFFBALL_TIRED_MUL : 1) ·
obmRunMul` with `obmRunMul` applied LAST (anchored), therefore:

* the STORED SCORE ÷ `(W.runScore · prior · tiredMul)` is **EXACTLY `restraint · obmRunMul`** —
  published on every arm as `ownBackOut.*`;
* on a **seat-ABSENT** arm `obmRunMul` is EXACTLY 1 by construction, so THERE that quantity **IS
  the restraint**, and only there is the `restraint.*` / `runningMates.*` family written at all
  (on a dosed arm those faces have a ZERO denominator BY CONSTRUCTION, and `gFaces` asserts the
  emptiness — the arm-level boolean `obmRunMulKnownToBeExactlyOne` is stored beside every row);
* `runningMates = (1 − restraint) · count` inverts the law's own expression wherever the restraint
  is ABOVE zero; at exactly zero the `clamp01` lower arm has bitten and all the law says is
  `runningMates ≥ count`, so the observation is **CENSORED** and counted as such;
* ⭐ the seat's own `runMul` on the DOSED arms is therefore taken from a **CLEAN LIMB** — the
  LICENSED run's recorded score, which carries NO restraint factor (`s = W.runScore · tiredMul ·
  obmRunMul`, anchored) — published as `runMulLic.*` with the seat-ABSENT arms as its own NOISE
  FLOOR. DS-T1's own `runMul.*` family is inherited unchanged beside it, and on the OWN arms it
  reads the own candidate first, i.e. the product — which is why the clean limb exists.

⚠ **THE OBSERVATION WINDOW IS THE RECORD'S TOP FOUR.** `decideOffBall` stores `cands.slice(0, 4)`,
so a candidate that lost badly is invisible; every share over this population is a FLOOR on the
pushed population, and the denominators are published.

### §P.6 — THE READS (#406 item 5(v)'s FOUR literals, RE-FROZEN VERBATIM by #408 item 5(iii))

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

* **H-DS-3's number** — R1's paired Δ on OWN vs HATS, seat absent, with its interval, BESIDE
  DS-T1's `+1.248030`, which is **QUOTED BY FIELD** out of
  `docs/world-model/data/ds-t1-own-run-exam.json` (`deltas[]` for
  `r1.runsPerInPossessionTick@OWN-E13-ABSENT`) and never typed in the instrument;
* **H-DS-4's number** — G9's paired Δ with its interval, BESIDE DS-T1's `+2.787788`, quoted by
  field the same way, with the yield pair and the per-state line beside it;
* **H-DS-2's numbers** — R1's Δ on the RUN-CAUTION OWN arm and on the KITCHEN-SINK OWN arm beside
  the seat-absent one, with the clean `runMul` limb's mean and below-1 share on each and its noise
  floor beside;
* the **HATS+OWN arm's own words** (floods / holdsBand) at all THREE seat states;
* the **yield pair** (shots per own-run episode vs per hat episode, BOTH fractions);
* the **coupling sentence** (the overlap-sets Δ and the wall-pass-fires Δ on OWN vs HATS);
* the **per-state line** and the restraint's own mean and exact-0 / exact-1 shares.

**STORED:** the selectors, the selected sentence, the guard table per arm, and the COUNTERFACTUAL
WORDS for the **RUN-CAUTION OWN arm**, the **KITCHEN-SINK OWN arm** and **D13** — each computed by
the SAME frozen rule on ITS OWN stored intervals (canon: *counterfactual words are stored*).

### §P.7 — SEEDS AND SIZING

| item | band | status |
| --- | --- | --- |
| battery | **12,555,000 – 12,555,998** | 999 seeds × 12 arms |
| construction receipt | **12,555,999** | the block consumed WHOLE |
| sizing smoke | 900,006,600 – 900,006,611 | SCRATCH (disclosed at §DEV-PREFLIGHT) |
| smoke receipt | 900,006,620 | SCRATCH |
| world pin | 900,006,670 | SCRATCH |
| lockstep + X-DET + gPullCount | 900,006,690 – 900,006,691 | SCRATCH |
| fixtures' attribute draw | 900,006,699 | SCRATCH |
| G-REPRO-DST1 re-walks | 12,554,000 – 12,554,011 | **DS-T1's OWN CONSUMED BAND — not a consumption** |

ZERO stats consumed; `stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 84 }`.

**THE SIZING FORM** (the house form): `se(n) = hw(n)/z.975` · `se(needed) = |target|/(z.975+z.80)`
· `N = ceil(n · (se(n)/se(needed))²)` · `MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975`, at a
**DECLARED 0.05 half-width** on R1's paired Δ (OWN vs HATS, seat absent, E13) and on
`passCompletion`'s paired Δ on the same pair.

**N = 999 = THE BLOCK'S AFFORDANCE after the construction receipt** — and it is the AFFORDANCE,
not the requirement, that is taken (§DEVIATIONS): both sizing rows resolve far inside it, so the
affordance strictly dominates, and canon's *seed discipline* consumes a block WHOLE of record.
THE TAIL: none — 12,555,000–998 are walked and 12,555,999 is the construction receipt.

### §P.8 — THE GATE SET (frozen ex ante)

**DS-T1's WHOLE SET, BY ANCHOR:** `X-DET` twice per arm on a scratch pair · `X-FP-PROD` ·
`X-SRC-UNTOUCHED` over `src` AND `tests` · `SEED-DISJOINT` (consumed blocks LN-C0 12,544,000–999 ·
LN-T1 …545 · LN-C1 …546 · LN-C2 …547 · LN-C3 …548 · LN-T1′ …549 · LN-T1′b …550 · GK-C0 …551 ·
GK-T1 …552 · DS-C0 …553 · **DS-T1 12,554,000–999**) · `gN` · `gFaces` off the SERIALIZED artifact ·
`gReadWords` · `gHashOrder` · BOOKED = WALKED · `gLoo` SCOPED to the read-bearing rows ·
`gTwoFractions` · `gStage` · `gWorld` per arm · `gBite` in the #402 item 2(iii) form ·
`gLockstep` · **`gDoseCopy` (BOTH matrices)** · `gClassesNonVacuous` · `gPredicateFixtures` ·
`gLedgerRead` · `gAnchoredConstants` · `gDoseSource`.

⭐ **PLUS THE THREE NEW GATES:**

* **`gRepro` = G-REPRO-DST1** — `HATS-E13-ABSENT` RE-WALKED on **12,554,000–011** and compared
  **FIELD FOR FIELD** against DS-T1's stored `perSeedCells[].[HATS-E13-ABSENT]`. This is the
  seam's OFF path, byte-identical to DS-T1's substrate by DS-T0b's own G-OFF pins (five worlds,
  world 13 included, the rng draw inside the hash), so EVERY field DS-T1 stored must reproduce —
  the whole-match signature included. **A MISMATCH IS RED.** Only `wallMs` (a machine timing) is
  excluded.
* **`gCodeFactGraph`** (extended) — the six `MakeRun` pushes classified as at DS-T1 over the WHOLE
  enclosing-`if` chain (five reachable with both DS flags absent — three hat-guarded, two
  keeper-up-guarded — and one `flagGated: dsOwnRun`, with
  `makeRunCandidatesAllHatGuardedOnShippedPath` DERIVED); the two flags' read forks enumerated
  under `src/**` and compared to **§SEAM-B's UPDATED inventory** (site text + file + class +
  count, plus its per-file executable-line occurrence counts and its own claim about how many
  times the percept pull occurs) — **equal or RED**; `runnerCount`'s span hashed WHOLE with BOTH
  call sites hashed and the per-file call census; the **own-run block's `match`-member set**
  extracted from the block's whole text and compared to the seam doc's own READ-SET sentence
  parsed out of the markdown — **equal or RED**; and `assignRunners`, `decideOffBall`,
  `executeAction` and `obmOffballPolicy` hashed WHOLE with their EXTRACTED callees.
* **`gPullCount`** — **the observation adds no percept pull.** On a THROWAWAY match per arm at the
  two out-of-band lockstep scratch seeds (never on a battery walk), the MATCH INSTANCE's
  `perceivedSnapshot` is wrapped by a counter that DELEGATES to the real bound method — the seam's
  own pin B6 idiom, applied without touching `src/`. The per-match pull count must be EQUAL
  observed vs unobserved, the whole-match SIGNATURES must be equal, and the wrapped observed
  signature must equal the UNWRAPPED lockstep walk's (the wrapper's own transparency receipt). The
  counter must also be LIVE. ⭐ #408 item 3(iii): G-OFF cannot see an ungated idempotent pull; the
  COUNTER can — this is that counter pointed at the INSTRUMENT.

### §P.9 — THE CODE FACTS

* **THE SIX `MakeRun` PUSHES CLASSIFIED** exactly as at DS-T1 (the whole enclosing-`if` chain;
  `flagGated` > `hatGuarded` > `keeperUpGuarded` > `unguarded`), with the shipped-path boolean
  DERIVED over the pushes reachable with both DS flags absent.
* **THE TWO FLAGS' READ FORKS** compared to §SEAM-B's updated inventory as above. ⚠ §SEAM's OLDER
  table pins `file:line` and its LINE NUMBERS WENT STALE when DS-T0b code-moved the count; the
  updated inventory carries no line numbers, so the gate compares what the doc pins durably and
  **both line lists are STORED** with the disagreement declared (§DEVIATIONS).
* **`runnerCount`'s DEFINITION AND ITS TWO CALL SITES HASHED**, with the census proving the
  expression exists in exactly two files of `src/**`.
* **THE OWN-RUN BLOCK'S `match`-MEMBER SET** extracted and compared to the seam doc's read set.
* **`assignRunners`, `decideOffBall`, `executeAction`, `obmOffballPolicy` HASHED WHOLE** with
  extracted callees (canon: *code facts over the call graph*).
* **G-DOSE-COPY for BOTH matrices**, slot for slot, off the `OBM_*` exports.

---

## §DEV-PREFLIGHT — THE DISCLOSED SMOKE (before the freeze)

Two scratch smokes were run BEFORE the freeze, both writing to `/tmp/`, and are DISCLOSED here.
They exist to size N and to prove the instrument runs end to end; **no number from them is a
finding and none is quoted anywhere outside this section.**

1. a 3-seed shakedown on 900,006,600–602 (twelve walks per seed) — used only to reach ALL GATES
   GREEN; four gates were RED on its first pass (the §SEAM-B inventory parser also matching
   §SEAM's older `file:line` row; the re-walk band still pinned to DS-C0's block in
   `SEED-DISJOINT`; the five new pooled-bin blocks present in `gFaces`' checks but not yet in the
   artifact's own `bins` block; and the two fixtures those broke), each fixed in the instrument
   BEFORE the sizing smoke;
2. **THE SIZING SMOKE — a 12-seed scratch smoke on 900,006,600 – 900,006,611** (twelve walks per
   seed, the full twelve-arm battery, all gates evaluated), **ALL 24 GATES GREEN**, with
   `G-REPRO-DST1` GREEN over **152** fields × 12 seeds:

| face @ arm | Δ (12 clusters) | half-width | se(smoke) | se(needed) | **nRequired** | expected hw at N = 999 | resolvable |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `r1.runsPerInPossessionTick` @ `OWN-E13-ABSENT` | −0.453184 | **0.075094** | 0.038314 | 0.017847 | **56** | 0.008230 | ✅ |
| `guard.passCompletion` @ `OWN-E13-ABSENT` | 0.002960 | **0.033491** | 0.017087 | 0.017847 | **12** | 0.003671 | ✅ |

The two `hwSmoke` values above are the ONLY smoke numbers transcribed into the instrument
(`SIZING_INPUTS`), and `gFaces` re-derives every sizing row from them off the serialized artifact.
The smoke's own console also reported a battery wall of 60.1 s for 12 seeds × 12 arms
(`perf.meanWallSecondsPerMatch` 0.176243) — from which the frozen battery is projected at roughly
35 minutes plus the estimator.

⚠ **12 clusters is a NOISY variance estimate** (canon). The REALISED half-widths at N are
published in §GATES beside these projections.

---

## §R — THE RESULTS

**RUN RECEIPTS.** FREEZE commit **`f920bdf`**; the instrument is byte-identical between FREEZE and
RESULTS (`git diff f920bdf -- scripts/probes/ds-t1b-own-run-exam.ts` EMPTY), and §P and
§DEV-PREFLIGHT were not edited after sight. **`allGreen` = true** — a STORED boolean over **24**
gate objects, every one `ok: true`. Battery **999 seeds (12,555,000–12,555,998) × 12 ARMS + the
construction receipt at 12,555,999 ⇒ BOOKED = WALKED = 12,000 walks**; `seeds.unwalkedTail` =
**null** — the block is consumed WHOLE. ZERO stats consumed; registry **84**. Artifact
`data/ds-t1b-own-run-exam.json`, **63,456,092 bytes**, file sha256
`f86bcb53712c9b0fe7eb4e302ba32f00a42daedb74d10ead03a3abbd3c1f0960`,
`hashedBodySha256 = 020e1730a87ddb945c8a88e12b507b2ad296c919bd054bd1892e9ba554f0bfe0`,
`instrumentSha256 = c42e6ebf5bcfe1400fd4b159fc2e000b181900508f891bc35c8158f559502a89`,
`receipts.hashReproducesFromFile` **true**. Battery wall **2241.981 s**,
`perf.meanWallSecondsPerMatch` **0.16394135802469134**. `tsc --noEmit` clean at both commits.
**X-FP-PROD recomputed IN-PROCESS** =
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — the literal of record,
UNCHANGED. **G-REPRO-DST1: 152 fields × 12 seeds, ZERO mismatches.**

*(Every number below QUOTES the artifact's own fields, at 6 dp where the field is a rate or a
share. The artifact is the numbers of record.)*

### §R1 — R1, THE FLOOD FACE

**EXECUTED runs per in-possession open-play team-tick**, per arm, with the frozen bins:

| arm | mean | 0 | 1 | 2 | 3 | 4 | 5 | 6+ | ≥ 3 |
|---|---|---|---|---|---|---|---|---|---|
| `HATS-E13-ABSENT` | **0.585428** | 0.625547 | 0.178244 | 0.181938 | 0.013777 | 0.000494 | 0.000000 | 0.000000 | **0.014271** |
| `HATS-E13-RUNCAUTION` | 0.555208 | 0.636807 | 0.185042 | 0.164706 | 0.013027 | 0.000418 | 0.000000 | 0.000000 | 0.013445 |
| `HATS-E13-KITCHENSINK` | 0.434287 | 0.683291 | 0.205458 | 0.105024 | 0.006128 | 0.000100 | 0.000000 | 0.000000 | 0.006227 |
| `HATSOWN-E13-ABSENT` | 0.633367 | 0.609402 | 0.169333 | 0.200596 | 0.019835 | 0.000832 | 0.000002 | 0.000000 | 0.020669 |
| `HATSOWN-E13-RUNCAUTION` | 0.592618 | 0.625424 | 0.175267 | 0.181179 | 0.017529 | 0.000597 | 0.000003 | 0.000000 | 0.018130 |
| `HATSOWN-E13-KITCHENSINK` | 0.464024 | 0.671061 | 0.202594 | 0.117791 | 0.008365 | 0.000188 | 0.000000 | 0.000000 | 0.008553 |
| **`OWN-E13-ABSENT`** | **0.138356** | 0.889365 | 0.088059 | 0.017762 | 0.004484 | 0.000329 | 0.000001 | 0.000000 | **0.004814** |
| **`OWN-E13-RUNCAUTION`** | 0.110622 | 0.909958 | 0.073373 | 0.012942 | 0.003542 | 0.000183 | 0.000001 | 0.000000 | 0.003727 |
| `OWN-E13-KITCHENSINK` | 0.077255 | 0.935387 | 0.053985 | 0.008671 | 0.001900 | 0.000057 | 0.000000 | 0.000000 | 0.001957 |
| `HATS-D13` | 0.653369 | 0.598701 | 0.167004 | 0.217227 | 0.016360 | 0.000708 | 0.000000 | 0.000000 | 0.017068 |
| `HATSOWN-D13` | 0.689546 | 0.590344 | 0.153738 | 0.233014 | 0.021838 | 0.001067 | 0.000000 | 0.000000 | 0.022904 |
| `OWN-D13` | 0.133726 | 0.888373 | 0.093414 | 0.014578 | 0.003386 | 0.000250 | 0.000000 | 0.000000 | 0.003635 |

| arm | Δ vs its HATS control | 95 % interval | tolerance | \|Δ\|÷half-width | resolved | up | beyond | **`floods`** |
|---|---|---|---|---|---|---|---|---|
| `HATSOWN-E13-ABSENT` | +0.047939 | [0.042136, 0.054146] | 0.161763 | 7.983480 | true | true | false | **false** |
| `HATSOWN-E13-RUNCAUTION` | +0.037410 | [0.031186, 0.043870] | 0.153413 | 5.898597 | true | true | false | **false** |
| `HATSOWN-E13-KITCHENSINK` | +0.029737 | [0.023699, 0.035655] | 0.120000 | 4.974194 | true | true | false | **false** |
| **`OWN-E13-ABSENT`** | **−0.447072** | **[−0.455245, −0.438472]** | **0.161763** | **53.307722** | true | false | false | **false** |
| **`OWN-E13-RUNCAUTION`** | −0.444586 | [−0.452554, −0.436455] | 0.153413 | 55.229285 | true | false | false | **false** |
| `OWN-E13-KITCHENSINK` | −0.357031 | [−0.363637, −0.350455] | 0.120000 | 54.171220 | true | false | false | **false** |
| `HATSOWN-D13` | +0.036177 | [0.029849, 0.043157] | 0.180536 | 5.436842 | true | true | false | **false** |
| `OWN-D13` | −0.519643 | [−0.528339, −0.510425] | 0.180536 | 58.014580 | true | false | false | **false** |

**`floods(arm)` is FALSE on all eight contrasted arms.** On the ARM OF RECORD the Δ is RESOLVED
**DOWN**: the own run alone puts FEWER bodies on a run than the coach's hats do, and the share of
team-ticks carrying THREE OR MORE runners goes **0.014271 → 0.004814**. **BOTH FRACTIONS:** the
denominator `r1.teamTicksPerMatch` is **11785.742743** in-possession open-play team-ticks per
match against the control's **11978.721722**, and the numerator `r1.runnerTicksPerMatch` is
**1630.630631** executed-run body-ticks per match against **7012.678679**.

Every R1 LOO row flips **0** intervals in either direction; the maximum single-seed influence
share on the R1 rows is **0.019746** (and **0.001787** on the arm of record).

### §R2 — THE BAND

`holdsBand` is **TRUE on all four HATS+OWN arms** (breach set empty on each) and **FALSE on all
four OWN arms**, where on every one of them the breach set is the SAME SINGLE GUARD: **`G9
guard.throughBallsPerMatch`** — and the breach is **DOWNWARD**.

THE ARM OF RECORD, `OWN-E13-ABSENT`, every gating limb:

| id | face | control | arm | Δ | 95 % interval | tolerance | dir | resolved | beyond | breach |
|---|---|---|---|---|---|---|---|---|---|---|
| G1 | `guard.goalsPerMatch` | 3.373373 | 3.269269 | −0.104104 | [−0.259259, 0.043043] | 0.932116 | both | false | false | false |
| G2 | `guard.shotsPerMatch` | 12.716717 | 12.337337 | −0.379379 | [−0.629630, −0.113113] | 3.513830 | both | true | false | false |
| G3 | `guard.xgConversion` | 1.493033 | 1.473959 | −0.019074 | [−0.078321, 0.040203] | 0.412549 | both | false | false | false |
| G4 | `guard.passCompletion` | 0.587804 | 0.591715 | +0.003911 | [−0.000524, 0.008734] | 0.162419 | floor | false | false | false |
| G5 | `guard.interceptionsPerMatch` | 27.212212 | 25.735736 | −1.476476 | [−1.927928, −1.052052] | 7.519164 | ceiling | true | false | false |
| G6 | `guard.possessionShareSideA` | 0.499013 | 0.499618 | +0.000606 | [−0.004388, 0.005665] | 0.137885 | both | false | false | false |
| G7 | `guard.passesPerMatch` | 80.515516 | 78.582583 | −1.932933 | [−2.731732, −1.112112] | 22.247708 | both | true | false | false |
| G8 | `guard.meanAimDistanceMetres` | 15.837630 | 15.213237 | −0.624393 | [−0.698982, −0.551688] | 4.376187 | both | true | false | false |
| **G9** | **`guard.throughBallsPerMatch`** | **6.156156** | **2.133133** | **−4.023023** | **[−4.251251, −3.823824]** | **1.701043** | both | **true** | **true** | **BREACH** |

The same limb on the other three OWN arms: **−4.460460** [−4.677678, −4.253253] at RUN-CAUTION
(6.113113 → 1.652653), **−4.964965** [−5.182182, −4.745746] at KITCHEN-SINK (5.827828 → 0.862863),
**−5.242242** [−5.485485, −4.990991] on D13 (7.504505 → 2.262262). G9's LOO rows flip **0** on
every OWN arm (maximum single-seed influence **0.005225** on the arm of record).

**G10, THE OFFSIDE FLAG (#157 form — it flags and gates nothing): NOT RAISED ANYWHERE.** On the
OWN arms the offside Δ is RESOLVED **DOWN** (arm of record **−0.414414** [−0.541542, −0.289289]),
and a flag needs a resolved INCREASE.

### §R3 — THE FACES

**POPULATION A — THE BOARD.** `board.openPlayEmptyShare` is **1.000000** on all three E13 OWN arms
and on `OWN-D13`, and the STORED BOOLEAN `openPlayBoardEmpty` is **true** on each (DS-T1 read
0.999912 and `false` on its own arm of record — the difference is the state guard: with the
in-flight and restart candidates withdrawn, no branch-reconstruction slack survives on this
walk). Designated runners per in-possession coach tick: **1.517503** on the control against
**0.200235** on the arm of record (the arriver and the corner/cross branches are all that remain).

**POPULATION B — THE DECISIONS.** The `MakeRun` share of attacking off-ball decision ticks is
**0.164210** on the control and **0.063903** on the arm of record; within all attacking `MakeRun`
decisions the `ownRunInBehind` class is **0.275398** and the `licensedRunInBehind` class
**0.000562** (against **0.476988** on the control). DEBT (a)'s receipt, arm of record:
`calib.postStepOverLedger` **0.9999994832282236** against the PRE-STEP form's
**0.9964042244645753**.

**POPULATION C — THE YIELD, AND THE YIELD PAIR (⛔ no verdict word).** On the arm of record:
**37.364364** own-run episodes a match against **12.813814** runner-hat episodes; **0.037533**
shots per own-run episode against **0.127490** per hat episode; **0.009966** goals per own-run
episode against **0.052027**; **0.377850** passes aimed per own-run episode with a through share
of **0.091393**; the mean own-run episode is **39.322153** ticks and its bin-derived median is
**30** with a top-bin share of **0.015638**. `own.goalRowJoinShare` **0.999678**.

**RUNS AND YIELD PER STATE (the numbers M-DS.7 was built to move).** On the arm of record the own
run's state mix is **0.897699** a mate on the ball · **0.100272** the ball in flight ·
**0.001333** his side's own restart · **0.000696** other — against DS-T1's stored **0.542593** in
flight and **0.235011** at the restart (quoted by field). In absolute terms that is **10.237237**
own runs a match won at a tick the TRUTH classifier calls *ball in flight* and **0.136136** at a
restart. The hats' own mix on the same arm: **0.099977** · **0.301582** · **0.595782** ·
**0.002659**.

**RUNS BY ROLE.** Arm of record: DF **0.019029** · MF **0.056522** · WG **0.468922** · ST
**0.455527**, against the control's DF **0.005474** · MF **0.056735** · WG **0.430919** · ST
**0.506872**. (DS-T1's arm of record read DF 0.000908; the restraint does not touch the prior, and
the DF share is now higher than the coach's, not lower.)

**THE COUPLING (⛔ no verdict word).** On the arm of record overlap designations per match go
**3.094094 → 4.211211** (Δ **+1.117117** [0.927928, 1.318318], resolved) and wall-pass fires
**10.438438 → 11.632633** (Δ **+1.194194** [0.860861, 1.522523], resolved); the ball played to the
overlapper per designation moves **+0.016448** and the return share of fires **−0.005166**. (DS-T1
measured both DOWN on its own arm of record; the direction reverses here.)

**THE CROWDING FAMILY.** `crowd.crashShare` **0.434150 → 0.469032**; `guard.spacingUnder4`
**0.068751 → 0.077179** (pooled **0.068686 → 0.077238**).

**THE SEAT'S `runMul`.** The CLEAN LIMB (`runMulLic.*`, off the licensed run's score) has an
**EXACTLY ZERO** noise floor on every seat-ABSENT arm — mean **1.000000**, below-1 share
**0.000000**, at-1 share **1.000000** on `HATS-E13-ABSENT` (n = 454,335), `HATSOWN-E13-ABSENT`
(n = 463,391), `OWN-E13-ABSENT` (n = 209) and both D13 arms. On the dosed arms it MOVES: mean
**0.928565** with **0.901426** of observations below 1 at RUN-CAUTION (n = 456,427) and mean
**0.893436** with **0.973108** below 1 at KITCHEN-SINK (n = 455,010). DS-T1's INHERITED limb
(`runMul.*`, which reads the own candidate first) is published beside: on the arm of record it
reads mean **0.951945** with **0.554970** below 1 and `fromOwnRunShare` **0.997955** — that is the
PRODUCT `restraint · obmRunMul`, not the seat, which is exactly why the clean limb exists
(§HONEST LIMITS 3).

### §R3b — THE SEAM'S OWN FACES

**THE RESTRAINT (backed out; written only where `obmRunMul` is exactly 1 by construction):**

| arm | mean | **exactly 0** | **exactly 1** | n | median | top-bin share |
|---|---|---|---|---|---|---|
| **`OWN-E13-ABSENT`** | **0.570614** | **0.191379** | **0.203871** | 1,078,688 | 0.6000000000000001 | 0.356167 |
| `HATSOWN-E13-ABSENT` | 0.478517 | 0.272115 | 0.171714 | 668,110 | 0.4 | 0.294184 |
| `OWN-D13` | 0.582281 | 0.170630 | 0.205658 | 1,414,851 | 0.6000000000000001 | 0.348907 |
| `HATSOWN-D13` | 0.488296 | 0.249956 | 0.174377 | 859,813 | 0.4 | 0.285759 |

The arm of record's ten frozen cells, pooled:
`[244263, 46123, 52878, 53699, 52532, 60647, 63503, 59963, 60887, 384193]`. On the six DOSED arms
the family is EMPTY BY CONSTRUCTION (n = 0, and `gFaces` asserts it).

**THE RUNNING MATES, INVERTED.** Arm of record: mean **0.497094** over 872,250 invertible
observations, with **0.191379** of restraint observations **CENSORED** (the clamp bit — all the law
says there is `runningMates ≥ count`); the eight frozen cells over [0, 4] pooled
`[512432, 196665, 91931, 70318, 618, 286, 0, 0]`, median **0**, top-bin share **0.000000**.

**THE PERCEIVED-OWNER GUARD, AS A FLOOR.** Arm of record: **0.216197** of unhatted attacking
off-ball decision ticks carry a VISIBLE own-run candidate (**1163.960961** candidates per match
over **5383.808809** unhatted ticks), and `seam.ownCandidateOutsidePostGuardShare` is
**0.000000** — not one visible candidate sat on a tick the post-step guard reconstruction rejects.
On the additive arm the floor is **0.201450** (762.332332 per match); on `OWN-D13` **0.258266**.

**THE COUNT, off the engine's own exported `runnerCount`.** Arm of record: mean **1.546731**, with
shares **0.467647** at 1 · **0.517974** at 2 · **0.014378** at 3 (pooled cells
`[543779, 602299, 16719]`).

**THE OWN CANDIDATE'S WHOLE BACK-OUT (`restraint · obmRunMul`).** Arm of record mean **0.570614**
(identical to the restraint by construction, n = 1,078,688, above-1 share **0.000066**); at
RUN-CAUTION **0.523812** with **0.973557** below 1 (n = 1,073,813); at KITCHEN-SINK **0.509552**
with **0.991651** below 1 (n = 1,046,748).

**THE IN-FLIGHT AND RESTART SHARES — STORED, NOT CLAIMED.** They are **not** zero: **0.100272**
in flight and **0.001333** at the restart on the arm of record (0.051784 / 0.000750 on the
additive arm; 0.143969 / 0.001541 on `OWN-D13`). §HONEST LIMITS 2 states the mechanism.

### §R4 — THE CODE FACTS

* **THE SIX `MakeRun` PUSHES**: `{"flagGated":1,"hatGuarded":3,"keeperUpGuarded":2,"unguarded":0}`
  over the whole enclosing-`if` chain; the one `flagGated` push names **`dsOwnRun`** and sits
  inside `decideOffBall`; `makeRunCandidatesAllHatGuardedOnShippedPath` = **true**, DERIVED over
  the **5** pushes reachable with both DS flags absent.
* **THE TWO FLAGS' READ FORKS**: **3** in `src/**` (one `dsOwnRun` in `PlayerBrain.ts`, two
  `!dsHatsOff` in `TeamBrain.ts`), EQUAL to §SEAM-B's updated inventory on site text, file, class
  and count, and to its per-file executable-line counts (`PlayerBrain.ts` own 1 / hats 0 ·
  `TeamBrain.ts` own 0 / hats 2 · `Match.ts` own 4 / hats 4 · `League.ts` own 1 / hats 1);
  `a4World.ts` carries neither flag. ⚠ The doc's OLDER §SEAM table's LINE NUMBERS DISAGREE and
  both lists are STORED: measured `PlayerBrain.ts:2203` · `TeamBrain.ts:323` · `TeamBrain.ts:343`
  against the doc's `2152` · `295` · `314` (§DEVIATIONS 1).
* **`runnerCount`**: the span `src/ai/TeamBrain.ts:214-217:runnerCount` hashed whole
  (`7574a0f441f12cb26447fe917a0d91932cfc16381d17a31c5a485c22245fd187`); BOTH call sites found
  exactly once and hashed — `src/ai/TeamBrain.ts:327` inside
  `src/ai/TeamBrain.ts:219-399:assignRunners` and `src/ai/PlayerBrain.ts:2232` inside
  `src/ai/PlayerBrain.ts:1925-2353:decideOffBall`; the expression lives in exactly **2** files of
  `src/**`.
* **THE OWN-RUN BLOCK** (`src/ai/PlayerBrain.ts:2203–2244`, sha
  `5c41a91aaad4a4b299b5f7abbec6127d2c13f5cb2549e65e40c434e1c8bd0cef`): its `match`-member set is
  EXACTLY `["match.dsOwnRun","match.perceivedSnapshot","match.simTime"]`, EQUAL to the seam doc's
  own read-set sentence parsed out of the markdown.
* **THE CORPUS AND THE HASHED ROOTS**: 71 files under `src/sim` + `src/ai`, **580** extracted
  spans, **76** designation-field sites all resolved, four roots hashed whole with extracted
  callees, closure **91** spans at depth **5**, uncapped.
* **G-DOSE-COPY**: RUN-CAUTION 2 non-zero slots, KITCHEN-SINK 16, both slot-for-slot equal to the
  export-side re-derivation and both shape-checked; the `runScore` rows are `[0, −1, −1, 0]` and
  `[−1, −1, −1, −1]` against the struck MARKER-ESCAPE's `[0, 0, 0, 0]`.

### §R5 — THE READ

The frozen rule, applied to STORED booleans on the arm of record and on the RUN-CAUTION arm
(`floods` **false** / `holdsBand` **false** on both), selects **read 4**:

> ## *"A GUARD BREAKS — the guard is named; the commander decides with the table."*

**THE GUARD IS NAMED (annotation line, from a stored field):** `G9 guard.throughBallsPerMatch` on
the arm of record and `G9 guard.throughBallsPerMatch` on the dosed arm — the only breach on either.

**THE SELECTORS, STORED:** `floods(OWN, seat absent)` = **false** · `holdsBand(OWN, seat absent)`
= **false** · `floods(OWN, dosed = RUN-CAUTION)` = **false** · `holdsBand(OWN, dosed = RUN-CAUTION)`
= **false**; `openPlayBoardEmpty` on the arm of record = **true**.

**BESIDE THE READ, PRINTED FROM STORED FIELDS AND NOT JUDGED:**

* **H-DS-3** — R1's paired Δ on OWN vs HATS, seat absent: **−0.44707176052829445**
  [−0.4552448344312854, −0.43847158878621817]; DS-T1's own field: **1.2480304779783737**.
* **H-DS-4** — G9's paired Δ: **−4.023023023023022** [−4.251251251251252, −3.823823823823824];
  DS-T1's own field: **2.7877877877877877**. The yield pair and the per-state line are at §R3.
* **H-DS-2** — R1's paired Δ seat absent **−0.44707176052829445** · at RUN-CAUTION
  **−0.44458579631675493** · at KITCHEN-SINK **−0.3570314847963222**; the clean `runMul` limb's
  mean and below-1 share on the dosed HATS controls are **0.928565** / **0.901426** and
  **0.893436** / **0.973108** against an EXACTLY ZERO floor on the absent arms. ⚠ By the rule's
  own PRECEDENCE, read 2 requires `floods(OWN, absent)`, which is false here — the branch is
  unreachable on this walk, and that is a fact about the precedence, not a judgement about the
  hypothesis.
* **the restraint on the arm of record**: mean **0.5706135248897279** · exactly 0
  **0.1913787860808686** · exactly 1 **0.20387081343261443**.
* **THE HATS + OWN ARM'S OWN WORDS**: at all three seat states `floods` **false** and `holdsBand`
  **true**, with an EMPTY breach set and no offside flag.

**THE COUNTERFACTUAL WORDS (stored, each by the SAME frozen rule on ITS OWN stored intervals):**
had the **RUN-CAUTION OWN** arm been the arm of record the rule would read **read4**; had the
**KITCHEN-SINK OWN** arm been the arm of record, **read4**; **D13**'s word is **read4** and
`d13Agrees` is **true** — *"THIS ARM SELECTS THE SAME READ"*.

### §R6 — 在说人话的层面

把教练的帽子摘掉、把「几个人该跑」这件事交给球员自己的眼睛之后，**前插没有泛滥，反而变少了**：
每个进攻 tick 上真正在跑的人从 0.585428 掉到 0.138356，三人以上同时跑的 tick 从 0.014271 掉到
0.004814。球员自己给自己的折扣（`restraint`）平均 0.570614，有 0.191379 的时候正好是 0（他看到
的人已经够了，于是这条候选被定价成 0），有 0.203871 的时候正好是 1（他谁都没看见在跑）。

十道门里只有一道被判越界，而且方向和上一次相反：**直塞球从每场 6.156156 掉到 2.133133**
（−4.023023），上一次是 5.962963 涨到 8.750751。越位旗一次都没举起来。进球、射门、传球成功率、
控球都在容差内。

**这一版的跑动不是「同一件事换个授权」**：它 0.897699 发生在队友已经控住球的时候，只有 0.100272
发生在球还在飞的时候——上一版这两个数是 0.542593 在飞。套边和撞墙这次都**变多**了
（+1.117117 和 +1.194194），上一版是变少。

**眼睛这次真的会给跑动定价了**：换成会给 `runScore` 打折的剂量之后，被定价成低于 1 的观测占
0.901426（RUN-CAUTION）和 0.973108（KITCHEN-SINK），而不带剂量的那三条臂上这个比例**正好是 0**。
但按裁决自己的优先级，read 2 要先有「泛滥」才能被选到——这次没有泛滥，所以那一支读不出来。

选出来的句子是 read 4：**有一道门破了，门被点名，指挥官带着表格自己定**。

## §HONEST LIMITS

*(canon: this list is the ONE home; the artifact stores NONE of it and its `stage.honestLimitsNote`
points here.)*

1. ⛔⛔ **THE READ IS `read4`, AND `read4` IS THE `otherwise` BRANCH — IT NAMES A GUARD, IT DOES
   NOT ANSWER H-DS-3.** ¬`floods` and ¬`holdsBand` hold together on the arm of record, which the
   frozen rule sends to the fourth literal. Nothing in this stage may be read as "the hat can come
   off": that sentence is read 1 and requires `holdsBand`.
2. ⚠⚠ **THE IN-FLIGHT RUN WAS NOT FULLY WITHDRAWN, AND THE CAUSE IS THE EYES.** M-DS.7 reads the
   PERCEIVED ball's owner; the state classifier reads the ENGINE'S TRUTH (`ball.owner === null`,
   phase `playing`, possession his side). **0.100272** of own runs on the arm of record are won at
   ticks the truth calls *ball in flight* — bodies whose eyes still hold a mate on the ball while
   the pass is already travelling. That is the seam doc's own stale-eyes limit (§HONESTY-B 4)
   measured, not a law violation, and it is why the "expected ≈ 0 by construction" of the dispatch
   is stored rather than claimed.
3. **THE INHERITED `runMul.*` FAMILY IS PRODUCT-CONFLATED ON EVERY `dsOwnRun` ARM.** DS-T1's
   back-out reads the OWN candidate first and its score now carries `restraint`, so on those arms
   `runMul.*` is `restraint · obmRunMul` (arm of record: mean 0.951945, below-1 0.554970,
   `fromOwnRunShare` 0.997955). The face of record for the seat is `runMulLic.*` off the licensed
   run, which carries no restraint factor. Both are published; the names say which is which.
4. **`runMulLic`'s DENOMINATOR IS TINY ON THE OWN ARMS — BY CONSTRUCTION.** With `dsHatsOff` the
   open-play board is empty, so a licensed run only survives at a restart, a corner crash or a
   cross flight: n = **209** on the arm of record against 454,335 on the control. The dosed
   *HATS* arms are where the seat's price is measured with volume; the dosed OWN arms' own numbers
   are published with their n beside them.
5. **THE RESTRAINT AND `runningMates` ARE OBSERVED ONLY WHERE THE SEAT IS ABSENT.** On a dosed arm
   one recorded score cannot separate two multipliers, so the family is EMPTY there by
   construction and the product is published instead. A dose-side restraint measurement would need
   a second recorded quantity the engine does not store.
6. **`runningMates` IS CENSORED AT 0.191379 ON THE ARM OF RECORD.** Where the restraint clamped to
   exactly 0 the sum is only known to be ≥ `count`; those observations are counted, never imputed,
   and the mean **0.497094** is over the invertible ones only.
7. **EVERY SHARE OVER THE OWN-CANDIDATE POPULATION IS A FLOOR.** `decideOffBall` stores
   `cands.slice(0, 4)`, so a candidate that lost badly is invisible — including, most likely, part
   of the exactly-0 mass, whose score is 0. The guard-pass face is named
   `ownCandidateVisibleShareFLOOR` for that reason, and both denominators are published.
8. **THE GUARD DENOMINATOR IS A RECONSTRUCTION IN TWO FORMS.** The coach tick that writes the hat
   board runs at the head of the step, before the decide loop, so the POST-STEP form is the
   denominator of record; the PRE-STEP form is published beside it
   (`seam.ownCandidateVisibleSharePreStepGuardForm`). The self-diagnosing receipt
   `ownCandidateOutsidePostGuardShare` is **0.000000** on the arm of record.
9. **THE KITCHEN-SINK ARM IS NOT AN H-DS-2-ONLY CONTRAST.** It moves the plane and the support
   score as well as the run, so its R1 Δ (−0.357031) mixes a run price with a different standing
   shape. RUN-CAUTION is the arm whose only non-zero weights are on the run.
10. **RUN-CAUTION IS A HAND-SET PROBE CORNER, NOT A DOSE OF RECORD.** It is declared as one
    wherever it appears; the dose space belongs to selection (#390), and nothing here proposes it
    for shipping.
11. **THE SEAT'S OWN BITE IS 996/999 AT RUN-CAUTION**, not 999/999 (KITCHEN-SINK is 999/999): on
    three seeds the dosed control's whole-match signature equals the seat-absent control's.
    `gBite` requires the seat bite to be non-zero, and the three seeds are stored.
12. **TWO NON-BREACHING GUARD ROWS ARE ONE SEED FROM CHANGING THEIR RESOLUTION WORD.**
    `guard.goalsPerMatch` on `OWN-E13-RUNCAUTION` (Δ −0.144144, interval upper edge 0.002002)
    flips DOWN-resolved on **243** single-seed drops, and `guard.throughBallsPerMatch` on
    `HATSOWN-E13-KITCHENSINK` (Δ +0.192192, lower edge 0.002002) flips UP-resolved on **209**.
    Neither is a breach either way (both are far inside tolerance) and neither is read-bearing —
    but the LOO receipt says so rather than leaving "resolved" looking solid.
13. **G8 IS A DECLARED RECONSTRUCTION** (the engine keeps no pass-length ledger) and
    **`crowd.crashShare`'s POSSESSION ATTRIBUTION IS NOT LN-T1'S** — both inherited from DS-T1
    unchanged, so the levels are comparable within this exam and not across exams.
14. **THE TIRED LIMB IS STILL UNPINNED BY THE BATTERY.** No body reaches `stamina < 0.4` inside a
    match (#406 §CORR 4), so the `OFFBALL_TIRED_MUL` factor in the score and in every back-out is
    exercised by fixtures only.
15. **THE D13 ARMS ARE BESIDE, NOT OF RECORD**, and only the three seat-absent ones were walked:
    the played book × a dosed seat is not measured here.
16. **THE SIZING VARIANCE CAME FROM 12 CLUSTERS.** Canon calls that noisy. The REALISED
    half-widths at N = 999 are **0.008386622822533607** (R1) and **0.004628770102609148**
    (`passCompletion`), both far inside the declared 0.05 target and both close to the projection.
17. **THE ARTIFACT IS 63,456,092 BYTES.** Compact JSON, canon-compliant; the per-seed cells over
    twelve arms are 95.41 % of it.
18. **A MACHINE READING ON ONE MACHINE**: `perf.meanWallSecondsPerMatch`
    **0.16394135802469134**.

## §DEVIATIONS (declared by the executor; the commander disposes)

1. ⚠⚠ **THE SEAM DOC'S §SEAM READ-FORK LINE NUMBERS ARE STALE, AND THE GATE COMPARES WHAT §SEAM-B
   PINS INSTEAD.** DS-T0b's code-move shifted all three forks (`PlayerBrain.ts` 2152 → 2203,
   `TeamBrain.ts` 295 → 323 and 314 → 343) while §SEAM's table — written at DS-T0 — still carries
   the old numbers, and §SEAM-B (the UPDATED inventory #408 item 5 names) carries **no line
   numbers at all**. `gCodeFactGraph` therefore compares SITE TEXT + FILE + CLASS + COUNT plus
   §SEAM-B's four site rows, its per-file occurrence counts and its own claim about how many times
   the percept pull occurs — and **STORES both line lists with a `forkLineNumbersAgree: false`
   beside them**. A DS-T1-style file-and-line comparison would have gone RED on documentation
   staleness alone. The commander may prefer §SEAM's table refreshed; this stage does not edit
   another stage's doc.
2. ⚠⚠ **DS-T1's COUNT ANCHORS NO LONGER EXIST AND WERE RE-ANCHORED ON THE MOVED FUNCTION.**
   DS-T1 anchored the count on `assignRunners`' two inline lines; DS-T0b code-moved them into
   `runnerCount`'s own `return`. The four literals (0.65, 2, 1, 0.65) are parsed from the moved
   lines at the same indices, and `LITERALS_OK` now also calls the engine's own `runnerCount` on
   three corners.
3. ⚠⚠ **THE RESTRAINT IS BACKED OUT, NOT RECOMPUTED — AND ON A DOSED ARM IT IS A PRODUCT.**
   Recomputing it needs `match.perceivedSnapshot`, which MUTATES perception memory, so the
   observation would stop being byte-inert and `gLockstep` would be a lie. The back-out inverts
   the seam's own arithmetic on the engine's own record and is fixture-pinned in eight directions
   (including the two that say a dosed arm's number is `restraint · obmRunMul` and NOT the
   restraint). §HONEST LIMITS 3–5 carry the consequences.
4. **THE SEAT'S `runMul` FACE OF RECORD MOVED TO A CLEAN LIMB.** #408 item 5(ii) asks for "the
   seat's `runMul` distribution on the dosed arms with its noise floor beside (DS-T1's back-out,
   by anchor)". DS-T1's back-out is inherited by anchor and published — but on a `dsOwnRun` arm it
   now reads the own candidate, i.e. the product. So a SECOND limb was added off the LICENSED
   run's score, which carries no restraint factor, and it is that limb whose mean and below-1
   share the read prints. Its noise floor is EXACTLY zero on every seat-absent arm.
5. **THE GUARD-PASS FACE IS PUBLISHED AS A FLOOR, IN TWO DENOMINATOR FORMS.** #408 item 5(ii)
   names "the perceived-owner guard's pass share (own-run candidates present ÷ unhatted attacking
   off-ball decision ticks)". The numerator is only visible through the record's top four, and the
   denominator's guard is a reconstruction, so the field is named
   `ownCandidateVisibleShareFLOOR`, both guard forms are stored, and the numerator folds TWO
   conjuncts of the law (a non-null snapshot AND a perceived owner who is a mate) — which the face
   note states.
6. **THE `restraint` / `runningMates` FAMILY IS WRITTEN ONLY ON SEAT-ABSENT ARMS**, and `gFaces`
   asserts BOTH directions (empty on every dosed arm; equal to the own-candidate back-out's count
   on every absent arm). Publishing a "restraint" on a dosed arm would have broken canon's
   *unit-name truth*.
7. **N IS THE BLOCK'S AFFORDANCE (999), NOT `nRequired` (56 and 12).** #408 item 5(v) says
   "N = min(required, the affordance) — say which". Said: **the affordance**; canon's *seed
   discipline* consumes a block WHOLE of record, and the rare populations this exam must not report
   as vacuous are sized by volume alone.
8. **`gPullCount` WRAPS A THROWAWAY MATCH, NEVER A BATTERY WALK**, and proves its own wrapper
   transparent by requiring the wrapped observed signature to equal the UNWRAPPED lockstep walk's.
   The counter is required to be LIVE (per-match pulls run from 348 on the seat-absent shipped path
   to 10,434 on a dosed OWN arm), because a dead counter would prove nothing — #408 item 3(iii)'s
   own lesson.
9. **G-REPRO-DST1 COMPARES 152 FIELDS, NOT 153.** `wallMs` is a machine timing and is excluded;
   every other field DS-T1 stored for `HATS-E13-ABSENT` — the whole-match signature included —
   reproduced on all twelve re-walked seeds.
10. **THE PUSH CLASSIFIER, THE MIRROR HALF OF THE WALKER, G8, THE CROWDING ATTRIBUTION AND THE
    `allGreen` SEEDING ARE INHERITED FROM DS-T1 UNCHANGED**, with its §DEVIATIONS 1–2, 6–8 and 10
    still standing (through balls counted in `performThroughBall`; the six pushes as
    1 flag-gated + 3 hat-guarded + 2 keeper-up-guarded; the byte-faithful mirror).
11. **THE R1 AND BAND ROWS ARE PUBLISHED FOR ALL EIGHT CONTRASTED ARMS**, including the four HATS +
    OWN arms the reads do not stand on, and the dosed HATS controls' own seat receipts — which is
    what makes the seat's price visible with volume (§HONEST LIMITS 4).

## §GATES — 24 of 24 GREEN (`allGreen` = true, a STORED boolean)

| gate | ✅ | derived note |
|---|---|---|
| `gWorld` | ✅ | per arm, on every walked match AND the construction receipt: `bqArmedVersion` 13 with the cushion, both later doors absent, `edsPerceivedChoice`, every CTB/RC/BF seam absent, the TWO DS FLAGS exactly as due, `obmMovement` exactly as due with the arm's OWN 16-slot matrix on `baseGenome` + `effGenome` of both teams on exactly the dosed arms, and `info.genome` CLEAN of the matrix on every arm; re-pinned on constructed matches of all twelve arms at 900,006,670 |
| `gDoseCopy` | ✅ | BOTH matrices: 16 slots compared each, 16 equal each; RUN-CAUTION **2** non-zero slots, both at the domain MIN and both in the `runScore` row, plane and support rows zero; KITCHEN-SINK **16** at a domain corner with the `runScore` row at MIN; the two matrices differ |
| `gDoseSource` | ✅ | both dose files' BYTES hashed against their pins BEFORE any seed; the D13 arms ride the SHIPPED loaders, never `info.genome` |
| `gAnchoredConstants` | ✅ | **148** anchored sites, every one at its declared occurrence count — including DS-T0b's amendment (the four-factor score line, the restraint expression and its three count inputs, the percept pull, the perceived-owner guard, the running-mates sum and its two exclusion lines, `runnerCount`'s head and both call sites), the KITCHEN-SINK sweep's own lines, and the two ZERO-count anchors proving neither DS flag appears in `a4World.ts`; `NI_FRACTION` inherited as an EXPRESSION from two independent instrument files and equal |
| `gPredicateFixtures` | ✅ | **146** fixtures, each predicate with a firing and a non-firing case — DS-T1's whole set plus the two doses' shapes, the restraint back-out in eight directions (including the dosed-arm product), the `runningMates` inversion and its censoring, the clean `runMul` limb, the not-hatted guard, the engine's own `runnerCount` against this instrument's reconstruction on the full corner grid, and the new bin edges |
| `gLedgerRead` | ✅ | every join reads an engine record; the declared reconstructions (the wall conjuncts, G8, the passer upper bounds, the two guard forms) say so; the count itself is read off the engine's OWN exported pure function |
| `gClassesNonVacuous` | ✅ | `emptyEpisodeClasses` **[]**; the empty run classes are exactly the four `ownRunInBehind` cells on the arms without `dsOwnRun`; the empty state cells are the `own.*` cells on those arms plus three `own.other` cells; the restraint family is LIVE on every seat-absent own arm and EMPTY on every dosed arm (both asserted); `runMulLic` has at least one observation on EVERY arm (the stored empty-arm list is `[none]`) |
| `gCodeFactGraph` | ✅ | 71 files, 580 spans, 76 designation-field sites all resolved, four roots hashed whole with extracted callees, closure 91 spans at depth 5 uncapped, the six pushes classified 1/3/2/0, the fork inventory EQUAL to §SEAM-B's, `runnerCount`'s span and both call sites hashed, and the own-run block's `match`-member set EQUAL to the seam doc's read set |
| `gBite` | ✅ | **999/999 on all eight contrasted arms, zero exempt**; the seat's own bite 996/999 at RUN-CAUTION and 999/999 at KITCHEN-SINK |
| `gRepro` | ✅ | **G-REPRO-DST1: 152 fields × 12 seeds, ZERO mismatches** — the seam's OFF path reproduces DS-T1's stored cells field for field, signature included |
| `gPullCount` | ✅ | **24** spied pairs: the per-match `perceivedSnapshot` pull count EQUAL observed vs unobserved on every one, the signatures equal, and the wrapped observed signature equal to the UNWRAPPED lockstep walk's; the counter is LIVE |
| `gLockstep` | ✅ | observed ≡ unobserved whole-match signature on all **24** arm × scratch walks; the instrument installs no wrapper on a battery walk and never calls `perceivedSnapshot` |
| `gDeterminism` | ✅ | X-DET twice per arm on two scratch seeds: signatures AND row bytes identical, **24** pairs |
| `gFingerprintProd` | ✅ | X-FP-PROD recomputed in-process = the literal of record, UNCHANGED |
| `gSrcUntouched` | ✅ | `git diff --stat HEAD` and `git status --porcelain` EMPTY over **src/ AND tests/** — X-SRC-ZERO |
| `gSeedsBookedEqualWalked` | ✅ | 999 distinct battery seeds + the receipt at 12,555,999, twelve arms ⇒ **12,000 walks booked**; `unwalkedTail` **null**; every scratch seed ≥ 900,000,000 and STORED |
| `gSeedDisjoint` | ✅ | the whole battery inside 12,555,000–999, disjoint from all ELEVEN consumed blocks; the re-walks inside DS-T1's own band |
| `gN` | ✅ | N = 999, no override env; both sizing rows `resolvableAtNFrozen` true (56, 12) and the REALISED half-widths published |
| `gLoo` | ✅ | **80** scoped rows (R1 + the nine gating guards × eight contrasted arms), 999 seeds dropped each; R1 and G9 flip 0 on every OWN arm; the two rows that do flip are named at §HONEST LIMITS 12 |
| `gTwoFractions` | ✅ | **15** read-bearing pairs, each published per its own denominator AND per match; **3,084** face rows over 257 keys × 12 arms and **2,056** Δ rows |
| `gFaces` | ✅ | **5,140 / 5,140** face-and-Δ checks and **498 / 498** bin / median / top-bin-share / partition / R1 / GUARD / READ-WORD / sizing checks re-derived off the SERIALIZED artifact |
| `gReadWords` | ✅ | `floods`, every guard row's harmful-direction test, `holdsBand`, the selected read, ALL THREE counterfactual words and the agreement word re-derived by applying the frozen rules to the serialized rows; every printed sentence is one of the FOUR frozen literals |
| `gHashOrder` | ✅ | a **42**-key allowlist schema; the body hash computed LAST; the NON-body receipt reproduces from the written file |
| `gStage` | ✅ | `stage.instrument` is this instrument's path and `stage.instrumentSha256` is the sha256 of the RUNNING file re-read from disk |

**PROSE SWEEP** (canon: *a stage doc's numeric sweep covers EVERY numeric literal in prose at ANY
precision*). Every numeric literal in §0–§R6, §HONEST LIMITS and §DEVIATIONS is an artifact field
value (at 6 dp where the field is a rate or a share, at full precision where the read's own
annotation lines print it), a stored count, a stored hash, a stored bin cell, a source line number
carried by an anchor or a code fact, a seed, or a ruling's own quoted number. The DECLARED
exceptions: **§DEV-PREFLIGHT's two smoke Δs (−0.453184 and 0.002960) and its 60.1 s / 0.176243
wall readings are 12-cluster SCRATCH values that exist nowhere in the final artifact and load-bear
nothing** (the two `hwSmoke` half-widths beside them DO live in `sizing.rows`); the artifact's own
**63,456,092** byte count and its file sha256 cannot live inside the artifact and are published
here per canon; **900,000,000** is the scratch-range floor from the canon sentence quoted at §P.7;
**2.3** is the licence's own extracted seconds and **0.65 / 2 / 1 / 0** are the count's own moved
literals; **12** in "12 clusters" is the smoke's own cluster count; **95.41 %** at §HONEST LIMITS 17
is a ratio of two stored byte counts (`perSeedCells` against the file) computed from the written file. DS-T1's numbers quoted in prose (**0.584786 → 1.832816**, **1.2480304779783737**,
**2.7877877877877877**, **0.542593**, **0.235011**, **0.777604**, **0.014729 → 0.328737**,
**5.962963 → 8.750751**, **0.999912**, **0.000908**) are all fields of
`docs/world-model/data/ds-t1-own-run-exam.json` — VERIFIED field by field at 6 dp — and this
artifact stores the four it prints beside the reads under `repro.dsT1Quoted`. The ONE exception
among them is **0.777604** at §0, which is not a field but the SUM the seam doc's §HONESTY-B 2 and
ruling #408 item 3 write out (0.542593 + 0.235011), quoted as their sentence, not re-derived here. `restraintMedian`'s stored value is written as
**0.6000000000000001** because that is the field, not 0.6. Negative values use a typographic minus
and are stored NEGATIVE. The derived counts in this §GATES table (**24**, **999**, **12,000**,
**148**, **146**, **152**, **24**, **80**, **15**, **3,084**, **257**, **2,056**, **5,140**,
**498**, **42**, **71**, **580**, **76**, **91**, **5**, **16**, **2**, **996**, **1**, **3**)
are read off the artifact's own arrays and gate notes.
