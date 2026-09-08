# DS T1b — 「自己的前插 · 复考」 THE OWN-RUN EXAM RE-RUN

Status: **FROZEN — §0 through §DEV-PREFLIGHT are sealed at the FREEZE commit and were NOT edited
after sight; the battery's results land at §R.** The instrument is byte-identical between FREEZE
and RESULTS. X-SRC-ZERO holds throughout: not one byte under `src/` or `tests/` is created or
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

*(written after the battery; §0–§DEV-PREFLIGHT above are sealed at the FREEZE commit.)*
