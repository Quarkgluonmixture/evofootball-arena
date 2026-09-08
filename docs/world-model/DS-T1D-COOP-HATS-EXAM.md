# DS T1d — 「配合帽子 · 考」 THE COOPERATION HATS' EXAM

Status: **WALKED — the battery is complete, 25 of 26 GATES GREEN (`allGreen` = a STORED
`false`; `gBite`, a liveness receipt that gates no direction and no read, is RED — §DEVIATIONS 1)
and THE READ IS PRINTED AT §R5.** §0 through §DEV-PREFLIGHT were sealed at the FREEZE commit
`4fb35cf` and were NOT edited after sight; the instrument is byte-identical between FREEZE and
RESULTS (`git diff 4fb35cf -- scripts/probes/ds-t1d-coop-hats-exam.ts` EMPTY).
X-SRC-ZERO holds throughout: not one byte under `src/` or `tests/` is created or edited.
**NOTHING SHIPS** — the three DS flags' arming stays exactly where DS-ENTRY and DS-T0d left it
and the production fingerprint is unchanged. The commander rules.

Authority: **COMMANDER RULING #413 item 5** (the dispatch — the six arms with the OBM seat
ABSENT throughout, the comparison of record, the coupling faces copied from DS-C0 BY FIELD NAME,
the two frozen reads with their precedence and the uncovered-shape fallback, the gate set plus
G-REPRO-DST1c · G-ARM-COOP · rule (m), the seeds), standing on **#413 items 1–2** (the switch's
facts of record) and **#412 item 5** (the switch's specification and the reads' two literals in
their first home). It INHERITS **#410 item 3** (DS-T1c's specification) and, through it, **#406
item 5** (DS-T1's: R1, the band, populations A–C). **#411 items 2–5** supply the numbers of
record and the form rules this exam obeys: the flood selector's column is `beyondToleranceUp`,
a LOO flip count is READ OFF THE ARRAY, and **no verdict word appears on any face**. **#413 item
4** says what the reads would mean; that is the commander's, not this doc's.

* THE SWITCH UNDER EXAM (read, never touched): [`DS-T0-OWN-RUN-SEAM.md`](DS-T0-OWN-RUN-SEAM.md)
  §SWITCH-D · §PINS-D · §DEVIATIONS-D · §COMMANDER CORRECTIONS-D.
* THE SEAM UNDER IT: the same doc's §LAW-C · §HONESTY-C · §SEAM-C.
* THE INSTRUMENT INHERITED: [`DS-T1C-OWN-RUN-EXAM-RANK.md`](DS-T1C-OWN-RUN-EXAM-RANK.md) +
  `scripts/probes/ds-t1c-own-run-exam.ts` (with its §COMMANDER CORRECTIONS 1–6 applied here,
  errata 6 included).
* THE COUPLING FACES COPIED BY FIELD NAME:
  [`DS-C0-DESIGNATION-CENSUS.md`](DS-C0-DESIGNATION-CENSUS.md) +
  `scripts/probes/ds-c0-designation-census.ts` (with its §COMMANDER CORRECTIONS).
* THE ENTRY THAT MADE WORLD 16: [`DS-ENTRY-RUNG.md`](DS-ENTRY-RUNG.md).
* CONTRACT: [`DS-DESIGNATION-CONTRACT.md`](DS-DESIGNATION-CONTRACT.md) §2 M-DS.8 · §3 DS-T1d ·
  §4 the non-claims · STATUS #413.
* INSTRUMENT: `scripts/probes/ds-t1d-coop-hats-exam.ts`.
  ARTIFACT: `data/ds-t1d-coop-hats-exam.json`.

---

## §0 — WHAT THIS IS AND WHY

**THE QUESTION (#413 item 5, not re-argued here): with the player's own run in place of the
coach's open-play licence (world 16's form), what do the LAST TWO hand-written cooperation hats
— the coach's 套边 designation and the passer's 2过1 licence — produce that R1 and the band can
see?**

### The arc's four readings so far, QUOTED BY FIELD

Every number and every sentence below is read out of the named artifact's own field; ⛔ not one
of them is typed by hand here or in the instrument (the instrument stores them under
`hNumbers.theArcQuotedByField`).

| stage | `reads.selected` | `reads.sentence` (the frozen literal it selected) |
| --- | --- | --- |
| DS-T1 | `read3` | *"THE RESTRAINT WAS THE COACH'S — H-DS-1 holds with or without eyes; the law needs a player-side restraint term (a later slice); the seam stays dormant."* — **THE FLOOD** |
| DS-T1b | `read4` | *"A GUARD BREAKS — the guard is named; the commander decides with the table."* — **THE DRAIN** |
| DS-T1c | `read1` | *"THE HAT CAN COME OFF — the player's own run holds the band without the coach and without eyes; DS-ENTRY is named: world 16 = world 15 + the own run with the open-play hats off."* |
| DS-ENTRY | — | world 16 CUT and OPEN; the user's gate 「自己的前插 (v16) — keep \| change \| revert」 stands. |

**THE SWITCH'S FACTS OF RECORD (#413 items 1–2), inherited and NOT re-derived here.** DS-T0d
added ONE dormant flag `match.dsCoopHatsOff` (config key `Match.ts:777`, field `:1718`, init
`:2571`; the League union key `League.ts:300`) and TWO **purely additive** gates —
`TeamBrain.ts:398` around `assignRunners`' 套边 block and `mechanics.ts:430` around
`performPass`'s 2过1 trigger. Additivity was proven WHOLE-FILE (the leading-whitespace-stripped
diff of each changed file is pure insertion); G-OFF reproduced four whole-match digests at the
commit; ARMED over whole matches `team.overlapper` and `p.wallRun` were **null on every stepped
tick**, so `PlayerBrain.ts:666` and `:690` are unreachable **BY MEASUREMENT, not by edit**. The
verifier PASSED it with zero HIGH and zero MEDIUM. This exam re-measures the read-fork inventory
and the arms' construction at its own head; it does not restate #413's numbers as its own.

### The two hats, named as DS-C0 named them

* **套边 — the coach's OVERLAP designation.** `team.overlapper`, written once per coach tick
  inside `assignRunners` when a WIDE carrier in the attacking half is CONFRONTED and the width
  gene × the evolved overlap appetite crosses `0.3`. DS-C0's fields: `overlapSets` (the field's
  own transitions), `overlapConfronted` (the precondition), `overlapArrivedStat` (**the engine's
  own `stats.overlaps` ledger** — the release LANDED wide), `overlapReleaseFires` /
  `fireOverlapReleaseExact` (the passer's EXACT read of the label).
* **二过一 — the passer's 2过1 (wall-pass) licence.** `passer.wallRun`, written inside
  `performPass` when six conjuncts hold, for a `2.3` s window. DS-C0's fields:
  `wallEligiblePasses` (the denominator), `wallFires` (the licence issued),
  `wallOneTwosStat` (**the engine's own `stats.oneTwos` ledger** — the return ARRIVED),
  `fireWallReturnUpperBound` (the passer's read of the label, an UPPER BOUND and declared one).

### The contract refuses both readings until this exam measures

`DS-DESIGNATION-CONTRACT.md` §4, and #413 item 4, VERBATIM: *"M-DS.8 stands as an INSTRUMENT,
not a design: until DS-T1d measures, the contract claims neither that the cooperation hats are
dispensable nor that they are load-bearing; an unreachable branch is not a deleted one. The
DF-path family rule (M-DF.2) holds for hats too: a hat retires BY MEASUREMENT, never by deletion
— the switch makes the decision priceable; DS-T1d prices it."*

### ⭐⭐⭐ THE HONESTY LINE, printed beside EVERY read

> **"nothing the band can see" is NOT "nothing the eye can see" — the user's gate at world 17
> judges the eye.**

It is stored as `reads.honestyLine`, re-derived off the serialized artifact by `gFaces`, and
printed on the first annotation line of every read. The band is ten guards and R1; it cannot see
the SHAPE of an overlap, the TIMING of a one-two, or a picture the user would miss.

---

## §P — THE FROZEN PROTOCOL

Frozen **before** the battery, inherited from DS-T1c section by section, with **each change
marked ⭐ AMENDMENT**. ⛔ Not edited after sight.

### §P.1 — THE ARMS: SIX, THE OBM SEAT ABSENT THROUGHOUT

⭐ **AMENDMENT (#413 item 5(i)).** DS-T1c's twelve arms (three flag kinds × three seat states,
plus a D13 triple) become **SIX**, and **NO DOSE IS PLACED ANYWHERE**.

| arm | world | flags | the OBM seat |
| --- | --- | --- | --- |
| `HATS-E13` | 13 empty-book | none | ABSENT |
| `OWN-E13` | 13 empty-book | `dsOwnRun` + `dsHatsOff` | ABSENT |
| `OWNCOOP-E13` | 13 empty-book | `dsOwnRun` + `dsHatsOff` + `dsCoopHatsOff` | ABSENT |
| `HATS-D13` | 13 DOSED (the shipped loaders' played book) | none | ABSENT |
| `OWN-D13` | 13 DOSED | `dsOwnRun` + `dsHatsOff` | ABSENT |
| `OWNCOOP-D13` | 13 DOSED | all three | ABSENT |

* `HATS-E13` is **DS-C0's `buildMatch(seed, 'E13')` byte for byte** and **DS-T1c's
  `HATS-E13-ABSENT`**; `OWN-E13` is **DS-T1c's `OWN-E13-ABSENT`**, which is **world 16's own
  door set** on world 13. That identity is what makes G-REPRO-DST1c possible on TWO arms.
* The composer `a4MatchFlags(13)` is **CALLED**, never copied; `armA4World(m, null, 13)` on E13
  and `armA4World(m, null, 13, L3, PC)` on D13.
* ⛔ **RULE (h) — NO DOSE.** `obmMovement` is never set, no 16-slot matrix is ever written to
  `baseGenome` or `effGenome`, `info.genome` is untouched, and DS-T1c's dose machinery
  (RUN-CAUTION, KITCHEN-SINK, `armMatrixLocal`, `doseFromExports`, G-DOSE-COPY and their
  anchors) is **REMOVED from the instrument, not left dormant**. `gWorld` asserts
  `obmFlag === false` **and** `matrixOnBaseEff === false` **and** `infoGenomeCleanOfMatrix` on
  every walked match and on the construction receipt; the artifact's `noDose` block declares it.
  The D13 arms' L3 / PC doses are **the played book**, not an OBM seat dose, and `gDoseSource`
  still hashes the file bytes it reads.

**THE CONTRASTS.** ⭐ AMENDMENT: a contrast is a **PAIR**, not an arm — `OWNCOOP-E13` carries
two controls, which DS-T1c's one-control-per-arm map could not express.

| contrast id | what it is |
| --- | --- |
| `OWNCOOP-E13\|OWN-E13` | ⭐⭐⭐ **THE COMPARISON OF RECORD.** CONTROL = **OWN** (world 16's form). The reads stand on this pair and no other. |
| `OWNCOOP-E13\|HATS-E13` | printed BESIDE, **HATS as its control** — world 13 as shipped against the world-17 candidate. STORED, COUNTERFACTUAL, NEVER SELECTING. |
| `OWN-E13\|HATS-E13` | DS-T1c's own comparison, re-walked on THIS block. |
| `OWNCOOP-D13\|OWN-D13` | the D13 counterfactual; its word is stored and NEVER selects. |
| `OWNCOOP-D13\|HATS-D13` · `OWN-D13\|HATS-D13` | the D13 triple, beside. |

### §P.2 — THE WALKER, THE INHERITED DEBTS, AND THE FIXTURES

The walker is DS-T1c's, unchanged: public `Match` / `Team` / `Player` / `Ball` state and the
engine's own decision record (`p.action.scores`) read BEFORE and AFTER `match.step(DT)`, with
**no wrapper on any walked match**. `gLockstep` proves observed ≡ unobserved byte for byte per
arm; `gPullCount` proves the observation adds no `perceivedSnapshot` pull; `gDeterminism`
(X-DET) walks each scratch seed twice per arm.

**THE THREE DS-T1 DEBT PAYMENTS ARE KEPT PAID, restated:**

* **(a)** the decision-tick predicate reads `pcLatency`'s own holds map **AFTER** the step at
  the tick the decide loop used; DS-C0's PRE-STEP form is recomputed BESIDE it and both are
  calibrated against **the engine's own `pcLatency.ledger.decisionsHeld` per-tick delta**
  (`faceBlocks.decisionTickCalibration`, the `calib.*` faces).
* **(b)** the shooter gid is banked **AT THE SHOT'S PUSH**, while `pendingShot` is live, into a
  per-`logIndex` map; the goal join reads that map at the outcome flip.
* **(c)** the episode-tick bins run **past one full `wallRun` licence** — the tick count is
  DERIVED from the licence's own `2.3` s and `DT`, never typed — and **every bin-derived median
  is published WITH ITS TOP BIN'S SHARE beside it**.

⭐ **AMENDMENT — THE ACCESSOR-SPY IDIOM, DECLARED BYTE-INERT.** G-ARM-COOP's non-vacuity receipt
re-uses `tests/dsCoopHatsOff.test.ts`'s **IDIOM** (an `Object.defineProperty` accessor over a
private backing field that returns exactly what the field held and counts every read and every
non-null read) — **never its source, never `src/`, and never a battery walk**. It runs on
THROWAWAY matches at out-of-band scratch seeds `900,007,640–641` on the `OWN-E13` and
`OWNCOOP-E13` arms, and each row stores its own **whole-match digest against an unspied twin**
(`nonInvasive`) so the instrument proves it did not perturb what it measured. ⚠ HONEST SCOPE,
inherited verbatim from §SWITCH-D: the spy cannot separate the passer's bonus-branch read from
any other read of the same field — it measures the **SUPERSET**, which is strictly stronger.

**THE FIXTURES.** Every walk-side predicate is stated with a case where it FIRES and one where
it does NOT (`gPredicateFixtures`), including this stage's new ones: the six-arm table and its
flag kinds; the contrast table with a self-contrast caught; the **NO-DOSE negative both ways**;
the passer-read site list (six needles, each resolving exactly once, with the two sites the
switch starves NAMED); and the read-fork counts for all THREE flags.

### §P.3 — R1, THE FLOOD FACE

**R1 = EXECUTED runs per IN-POSSESSION OPEN-PLAY TEAM-TICK.** Per team, per stepped tick:
`match.possessionSide === team.side` · `match.phase === 'playing'` · the team carries NO live
`cornerCrash` and NO live `crossFlight` (both read off the engine's own held-licence clocks at
the end of the tick). THE COUNT is of OUTFIELD BODIES (not the keeper, not sent off) whose
`p.action.type` is `MakeRun` — **the bodies, not the board**. Frozen bins 0 · 1 · 2 · 3 · 4 · 5
· 6+, the mean, and the **≥ 3 share**.

⭐ **AMENDMENT — THE CONTROL.** On the comparison of record the control is the **OWN** arm, so
the tolerance is `NI_FRACTION · |OWN mean|` by the house form (`NI_FRACTION = 1 − 0.275/0.380`,
inherited BY ANCHOR from `ctb-t1-supply-exam.ts`'s own line, cross-read from
`dlc-t1-choice-exam.ts`, and EVALUATED from its two numerals — never typed as a decimal).

`floods(contrast)` = the paired Δ of R1's mean is **RESOLVED** (the 95 % cluster-bootstrap
interval over 2,000 draws excludes zero) **AND UP AND beyond the tolerance**. Its one-sided
column is named **`beyondToleranceUp`** (#409 item 5's form rule of record); the two-sided
companion `absDeltaBeyondToleranceEitherWay` is stored beside it. The **ratio** OWN+COOP-OFF ÷
OWN is published with its own cluster-bootstrapped interval — printed, never judged.

### §P.4 — THE BAND (F-DS-b)

Ten limbs, per contrasted pair. A **BREACH** = the paired Δ is RESOLVED **AND** beyond the
tolerance **IN THE HARMFUL DIRECTION**. `holdsBand(contrast)` = NO breach among G1–G9. G10 is
the #157 **FLAG** limb: it flags and gates NOTHING.

| id | face | direction |
| --- | --- | --- |
| G1 | goals per match | both |
| G2 | shots per match | both |
| G3 | xG conversion (goals ÷ Σ xg off the `shotLog`) | both |
| G4 | pass completion over ALL deliveries | **floor** (DOWN is harmful) |
| G5 | interceptions per match | **ceiling** (UP is harmful) |
| G6 | possession share (side A) | both |
| G7 | passes per match | both |
| G8 | mean pass (aim) distance in metres | both |
| G9 | through balls per match (the engine's own counter) | both |
| G10 | offsides per match | FLAG only, gates nothing |

⭐ **AMENDMENT (#413 item 5(ii)):** every breach carries **ITS DIRECTION** (`breachDirection`
∈ {`UP`, `DOWN`, `none`}), and the **breach set with directions** is a stored array per
contrast. LOO is scoped to the read-bearing rows (R1 + the nine gating guards) per contrast, and
⭐ **every flipping row's SEEDS are STORED** (`looFlippingSeeds`), so §HONEST LIMITS names them
off the array instead of counting them in prose (#411 item 1's correction, obeyed in advance).

### §P.5 — THE FACES (published on EVERY arm; ⛔ NO VERDICT WORD on any of them)

**Populations A–C, inherited from #406 item 5(iv) / DS-C0:** A = every `assignRunners` execution
per team while in possession (the branch ladder, the runner-count bins, the designations by
role, the 套边 gate and its `confronted` test, `openPlayBoardEmpty` as a stored count pair);
B = every attacking off-ball decision tick by class off the engine's own `why` (the NINE-cell
classifier with `ownRunInBehind` as its own class **and** DS-C0's eight-cell MIRROR beside it);
C = the hat episodes AND the own-run episodes and their yield off the engine's ledgers, with the
**own-run class and its yield** published as its own family. Per state (a mate on the ball / the
ball in flight / his side's own restart / other), by role (DF · MF · WG · ST), and the
**crowding family** (OBM-T1's, `spacingUnder4` included).

**THE SEAM'S OWN FACES on the arms carrying `dsOwnRun`** (inherited from DS-T1c, backed out of
the engine's own recorded candidate score, never recomputed): the restraint's share **exactly 0**
and **exactly 1**, `priorZeroShare` (the DF clamp, the AMBIGUOUS overlap), `rankBelowCount` with
its declared equivalence, the `count` shares, the perceived-owner guard's pass share (a FLOOR),
and the in-flight / restart own-run shares.

⭐⭐⭐ **AMENDMENT — THE COUPLING FACES, COPIED FROM DS-C0 BY FIELD NAME (#413 item 5(ii)).**
Per arm (levels) and per contrast (paired Δ), under DS-C0's OWN field names and its own
definitions and paid debts: `overlapSets` · `overlapReleaseFires` · `overlapArrivedStat` ·
`overlapConfronted` · `wallEligiblePasses` · `wallFires` · `wallOneTwosStat` ·
`fireWallReturnUpperBound` · `fireOverlapReleaseExact`, plus the **`passerReadTable`** (the
passer's hat-read fires **by site**, in BOTH fractions — per match and per carrier decision
tick) with DS-C0's ⑤ BOUNDARY (读心标签) stated as a boundary: does the read consume a LABEL a
designation wrote, or a mate's ACTION TYPE?

⭐⭐⭐ **THE TWO DISAPPEARING FACES, PER MATCH.** `overlapArrivedStat ÷ matches` (**overlap
arrivals per match**) and `wallOneTwosStat ÷ matches` (**one-twos per match**) — both read off
**the engine's own ledgers** — are printed **PER MATCH beside EVERY read**, off the **OWN** arm
(what world 17 would lose) and off **HATS** beside. ⛔ PRINTED, NEVER JUDGED.

⭐⭐⭐ **G-ARM-COOP.** On the two COOP-OFF arms, `overlapSets === 0` **∧** `wallFires === 0` on
**EVERY** seed and on the construction receipt is **a STORED BOOLEAN of the arm's construction**
— ⛔ never narrated as a finding: it is what `dsCoopHatsOff` MEANS. Its **non-vacuity receipt**
is the accessor spy's read counts > 0 on the same seeds, all returning null on the COOP arm and
NOT all null on the OWN arm, with the spy proven non-invasive by digest. ⚠ The two disappearing
faces are ALLOWED to be zero on any arm — that is a measurement — so their zeroes are
**ENUMERATED** in the emptiness table (`reads.emptyCouplingCounters`), never gated.

### §P.6 — THE READS (#413 item 5(iii)'s literals, FROZEN EX ANTE)

Copied **CHARACTER FOR CHARACTER** from ruling #413 item 5(iii) and cross-checked at run time
against `DS-DESIGNATION-CONTRACT.md` §3 (DS-T1d) and #412 item 5(v) — **all three homes must
agree byte for byte** (`gReadLiterals`, on normalised prose).

> **read 1** — *"THE COOPERATION HATS PRODUCE NOTHING THE BAND CAN SEE — they come off:
> DS-ENTRY-2 is named (world 17 = 16 + the cooperation hats off)."*
>
> **read 2** — *"THE COOPERATION HATS CARRY A FACE — the guard is named; a player-side seat is
> designed before any hat comes off."*
>
> **the FALLBACK** — *"THE READS DO NOT COVER THE SHAPE — the commander decides with the
> table."*

**THE PRECEDENCE, the ruling's own**, applied to STORED booleans on the COMPARISON OF RECORD
(`OWNCOOP-E13|OWN-E13`, the seat absent):

1. a **breach** (`holdsBand` FALSE) ⇒ **read 2**;
2. else `holdsBand` ∧ ¬`floods` ⇒ **read 1**;
3. else (the band holds and `floods` is TRUE — R1 UP beyond tolerance with two hats off) the
   shape is **NOT COVERED** ⇒ the **FALLBACK**. ⛔ NO THIRD READ IS INVENTED.

The **precedence step that selected** is itself a stored string and is re-derived off the
serialized artifact. **PRINTED BESIDE the read**, from stored fields, with NO verdict word: the
honesty line; the two disappearing faces per match (OWN and HATS); the R1 ratio with its
interval; the yield pair; the coupling numbers (numbers only); the per-state line; **D13's word**
and the **HATS-vs-OWN+COOP-OFF guard table with its own `holdsBand` word** — both STORED
counterfactuals, **NEITHER SELECTING**.

### §P.7 — SEEDS AND SIZING

* **Block `12,557,000–999`**, verified fresh against the consumed list (LN-C0 12,544,000–999 …
  DS-T1 12,554,000–999 · DS-T1b 12,555,000–999 · DS-T1c 12,556,000–999), each checked to end
  BELOW this block's base. Battery seeds `12,557,000–12,557,998`; **construction receipt
  `12,557,999`**. BOOKED = WALKED: 999 seeds × 6 arms + 6 receipt walks = **6,000 walks booked**.
* **N.** Sized by the DISCLOSED 12-seed smoke on `900,007,600–611` (six walks per seed) with the
  house form at a declared **0.05 half-width** on R1's paired Δ (OWN+COOP-OFF vs OWN, E13) and
  on `passCompletion`'s paired Δ on the same pair — see §DEV-PREFLIGHT for both rows. **Which
  was taken is said in §DEV-PREFLIGHT and in `sizing.whichNWasTaken`.**
* **SCRATCH, all inside the DECLARED BAND `900,007,600–699`, derived from ONE base**: the
  sizing smoke `600–611`, the smoke receipt `620`, **G-ARM-COOP's spy walks `640–641`**, the
  world pin `670`, the lockstep pair (X-DET and gPullCount re-use it) `690–691`, the fixtures'
  attribute draw `699`. **gScratchBand** stores the list, the band and the out-of-band set, and
  asserts the band sits above canon's own scratch floor and is DISJOINT from the battery block
  both ways. ⛔ The verifier's band `900,007,700–799` is NOT this executor's.
* **RE-WALKS `12,556,000–011`** are DS-T1c's OWN consumed band and are **NOT a consumption**
  (canon: verifier scratch seeds).
* **ZERO stats**: `stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 86 }`.

### §P.8 — THE GATE SET (frozen ex ante)

DS-T1c's whole set by anchor — `gWorld` · `gDoseSource` · `gAnchoredConstants` ·
`gPredicateFixtures` · `gLedgerRead` · `gClassesNonVacuous` · `gCodeFactGraph` · `gBite` ·
`gPullCount` · `gLockstep` · `gDeterminism` · `gFingerprintProd` (X-FP-PROD) · `gSrcUntouched` ·
`gSeedsBookedEqualWalked` · `gSeedDisjoint` · `gN` · `gLoo` · `gScratchBand` · `gTwoFractions` ·
`gFaces` · `gReadWords` · `gHashOrder` · `gStage` — **PLUS**:

* ⭐ **`gRepro` = G-REPRO-DST1c.** RE-WALK `12,556,000–011` on **`HATS-E13` AND `OWN-E13`**,
  FIELD FOR FIELD against `data/ds-t1c-own-run-exam.json` `perSeedCells[]` for
  `HATS-E13-ABSENT` and `OWN-E13-ABSENT`. A mismatch is **RED**. ⭐ This is ALSO the proof that
  **the dormant switch left both arms byte-identical** — the whole-match signature is one of the
  compared fields.
* ⭐ **`gArmCoop` = G-ARM-COOP** (§P.5), arithmetic half **and** spy half.
* ⭐ **`gReadLiterals`** — the three homes of the frozen sentences, compared on normalised prose.
  ⚠ The FALLBACK is quoted in the RULING only; that asymmetry is DECLARED and gated as declared.
* ⭐ **`gCodeFactGraph`** extended to §P.9's facts.

### §P.9 — THE CODE FACTS

* **The six `MakeRun` pushes**, classified over the WHOLE enclosing-`if` chain with the **THREE**
  flags: five reachable with every DS flag absent; exactly **one `flagGated`**, naming
  `dsOwnRun`; and the two bonus-branch pushes carry **`unreachableWhen: dsCoopHatsOff` as a
  MEASURED fact** — the spy counters on the COOP-OFF arms are stored beside them
  (`armCoop.spy`), ⛔ never a text claim.
* **The three flags' read forks**, enumerated under `src/**` and compared to §SWITCH-D's
  **REFRESHED** inventory on **TEXT + FILE + LINE**: `PlayerBrain.ts:2213` · `TeamBrain.ts:344 ·
  367 · 398` · `mechanics.ts:430`, with the declaration lines `Match.ts:777 · 1718 · 2571` and
  the **moved** `1706 · 1712 · 2566 · 2567` and `League.ts:300`. Equal or **RED** — if a line
  moved since `68022c9`, the gate goes RED and this doc says so.
* **The two gate lines as anchored literals** (`  if (!match.dsCoopHatsOff) {`, the same source
  line in two files), plus the flight-preserving `if (!keepOverlap) team.overlapper = null;`
  anchored OUTSIDE and ABOVE gate 1.
* ⭐⭐⭐ **RULE (m).** `assignRunners` is hashed **WHOLE** and its hash is **STATED AT THIS HEAD
  and COMPARED TO NOTHING BANKED** — gate 1 lives inside that function, so DS-C0's and DS-T1c's
  banked literals for it read **RED BY DECLARATION** (#413 §CORR-D 5). `performPass` is hashed
  WHOLE with its EXTRACTED callees (the 2过1 trigger lives in it). `runRank`, `runnerCount`,
  `registerPass`, `decideOffBall`, `decideCarrier` and `executeAction` are hashed and compared
  as DS-T1c did, and `blockReadsNoVelocityNoTopSpeed` is kept.
* ⭐⭐⭐ **THE `a4World.ts` COUNTS AT THIS HEAD** (DS-T1c errata 6, #412 item 3's FAMILY NOTE):
  `dsOwnRun` **2** · `dsHatsOff` **2** (the entry layer NAMES them — world 16 = 15 + the two
  doors) · `dsCoopHatsOff` **0** (stored — **the switch reaches no world**). DS-T1c's two
  zero-count anchors read RED from `32723c5`; this exam **states the counts at ITS OWN head** and
  keeps only the one zero that is still a claim.

---

## §DEV-PREFLIGHT — THE DISCLOSED SMOKE (before the freeze)

Two scratch runs, both **inside the declared band**, both with the artifact routed OFF every
canonical path by the instrument's own override guard:

1. **A 2-seed shake-out** (`900,007,600–601`, six arms) — used only to find and fix instrument
   defects before the sizing run. Two gates were RED on it and were fixed **at §P-consistent
   points, before the freeze**: three stale doc-count FIXTURES inherited from DS-T1c's four-row
   `own N / hats N` parse (rewritten for §SWITCH-D's six-row, three-flag paragraph), and
   `gClassesNonVacuous`, which had been written to require `overlapArrivedStat` and
   `wallOneTwosStat` NON-ZERO on every non-COOP arm. **That requirement was WRONG and is
   withdrawn**: an overlap arrival is a rare event and its zero on an arm is a MEASUREMENT, not
   a defect — the gate now asserts `overlapSets > 0` ∧ `wallFires > 0` on the arms that carry
   the hats (without which the COOP-OFF zero would mean nothing) and the two disappearing
   counters' zeroes are **ENUMERATED** instead. Both changes are in §P.5 and §P.8 above.
2. **THE SIZING SMOKE OF RECORD — 12 seeds `900,007,600–611`, six walks per seed, 26/26 gates
   GREEN**, from which the two half-widths below are transcribed into the instrument and
   re-derived off the artifact by `gFaces`:

| face (paired Δ, the comparison of record) | half-width at n = 12 | target | `nRequired` | resolvable at N = 999 |
| --- | --- | --- | --- | --- |
| `r1.runsPerInPossessionTick` | `0.037159469090165806` | 0.05 | 14 | yes |
| `guard.passCompletion` | `0.038790842375108270` | 0.05 | 15 | yes |

Form: `se(n) = hw(n)/z.975` · `se(needed) = |target|/(z.975+z.80)` ·
`N = ceil(n·(se(n)/se(needed))²)` · `MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975`.

⭐ **WHICH N WAS TAKEN, SAID PLAINLY.** Both rows resolve far below the block's affordance, so
the literal `min(required, affordance)` is the **REQUIRED** n (14 and 15). **THIS STAGE WALKS
THE AFFORDANCE, N_FROZEN = 999**, which is the inherited house practice of DS-T1 / DS-T1b /
DS-T1c and is ≥ required on every row: a 12-cluster variance estimate is NOISY, and the coupling
faces this exam adds are **rare events** whose per-seed counts are small. The deviation from the
literal reading is DECLARED at §DEVIATIONS; it can only narrow an interval, never widen one.

⚠ The smoke's own numbers are **NOT** results: they are scratch seeds, they are disclosed only
so the sizing is auditable, and no read is taken on them.

---

## §R — THE RESULTS

Walked at the RESULTS commit on the frozen instrument (byte-identical to FREEZE). **999 seeds ×
6 arms + 6 construction-receipt walks = 6,000 walks BOOKED = WALKED**; block `12,557,000–999`
consumed whole; unwalked tail **none** (`seeds.unwalkedTail` is `null` — the battery ends at
`12,557,998` and the receipt takes `12,557,999`). Battery wall **1,390.919 s**, mean
**0.193802 s** per walked match (`perf`, a machine reading on one machine).

**25 of 26 gates GREEN. `allGreen` is a STORED `false`** — `gBite`, a LIVENESS receipt that
gates no direction and no read, is RED; the mechanism is measured, understood and declared at
§DEVIATIONS 1 and §GATES. The instrument's own red-routing idiom therefore wrote the artifact to
`data/ds-t1d-coop-hats-exam.json.RED.json`.

Every number below is quoted from an artifact FIELD at the six-decimal precision the instrument
itself prints; ⛔ no number in this doc is computed by hand.

### §R1 — R1, THE FLOOD FACE (executed runs per in-possession open-play team-tick)

| arm | mean | ≥ 3 runners | bins 0 · 1 · 2 · 3 · 4 |
| --- | --- | --- | --- |
| `HATS-E13` | 0.583534 | 0.014215 | 0.625148 · 0.180847 · 0.179790 · 0.013752 · 0.000462 |
| `OWN-E13` | 0.247172 | 0.002235 | 0.788224 · 0.178641 · 0.030900 · 0.002208 · 0.000026 |
| **`OWNCOOP-E13`** | **0.238918** | **0.001460** | 0.790704 · 0.181157 · 0.026679 · 0.001439 · 0.000022 |
| `HATS-D13` | 0.646941 | 0.017232 | 0.601040 · 0.169088 · 0.212640 · 0.016354 · 0.000878 |
| `OWN-D13` | 0.252708 | 0.002050 | 0.782365 · 0.184629 · 0.030956 · 0.002034 · 0.000016 |
| `OWNCOOP-D13` | 0.239194 | 0.000926 | 0.788406 · 0.184930 · 0.025738 · 0.000915 · 0.000011 |

(bins 5 and 6+ are 0.000000 on every arm.)

**THE PAIRED Δ OF RECORD — `OWNCOOP-E13` vs `OWN-E13` on E13, CONTROL = OWN:**

> **Δ −0.008254 [−0.011588, −0.004856]**, tolerance **0.068298**, `resolved` **true**,
> `beyondToleranceUp` **false**, **`floods` FALSE**. The interval is RESOLVED **DOWN** and sits
> **well inside** the tolerance: |Δ| ÷ tolerance ≈ one eighth. **THE COOPERATION HATS COMING OFF
> DOES NOT FLOOD THE PITCH WITH RUNNERS.**

| contrast | Δ | 95 % CI | tolerance | `beyondToleranceUp` | `floods` |
| --- | --- | --- | --- | --- | --- |
| **`OWNCOOP-E13\|OWN-E13`** (of record) | **−0.008254** | [−0.011588, −0.004856] | 0.068298 | false | **false** |
| `OWNCOOP-E13\|HATS-E13` (beside) | −0.344615 | [−0.352737, −0.336396] | 0.161240 | false | false |
| `OWN-E13\|HATS-E13` | −0.336361 | [−0.344654, −0.328018] | 0.161240 | false | false |
| `OWNCOOP-D13\|OWN-D13` | −0.013513 | [−0.017521, −0.009433] | 0.069827 | false | false |
| `OWNCOOP-D13\|HATS-D13` | −0.407747 | [−0.416657, −0.399001] | 0.178760 | false | false |
| `OWN-D13\|HATS-D13` | −0.394233 | [−0.403356, −0.384951] | 0.178760 | false | false |

**THE RATIO OF RECORD** (OWN + COOP-OFF ÷ OWN, cluster-bootstrapped on the same seeds):
**0.966607 [0.953676, 0.980174]** — the interval excludes 1. Printed, not judged.

**HATS vs OWN + COOP-OFF, printed BESIDE** (HATS its control): R1 falls 0.583534 → 0.238918,
Δ −0.344615, and the ≥ 3-runner share falls 0.014215 → 0.001460. That pair's own `holdsBand`
word is in §R2 and its READ WORD is a **stored counterfactual** (§R5) that selects nothing.

⚠ **The realised half-width at N = 999 is 0.003366** on R1's Δ of record and **0.003782** on
`passCompletion`'s — both far below the declared 0.05 target (§DEV-PREFLIGHT).

### §R2 — THE BAND, per contrasted pair, with every breach's DIRECTION

**`holdsBand` is TRUE on ALL SIX contrasted pairs, and the BREACH SET IS EMPTY on all six.**
`breachSets` is a stored array per contrast; every entry is `[]`. The offside FLAG (G10) is
**not raised** on any pair.

**THE COMPARISON OF RECORD — `OWNCOOP-E13` vs `OWN-E13`** (control level → Δ [CI] vs tolerance):

| id | face | control | Δ | 95 % CI | tolerance | resolved | breach |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G1 | goals per match | 3.254254 | +0.061061 | [−0.073073, 0.190190] | 0.899202 | no | no |
| G2 | shots per match | 12.255255 | −0.063063 | [−0.294294, 0.165165] | 3.386321 | no | no |
| G3 | xG conversion | 1.458848 | +0.024638 | [−0.026655, 0.074383] | 0.403103 | no | no |
| G4 | pass completion (floor) | 0.591746 | −0.000279 | [−0.004183, 0.003381] | 0.163509 | no | no |
| G5 | interceptions (ceiling) | 25.755756 | −0.182182 | [−0.516517, 0.162162] | 7.116722 | no | no |
| G6 | possession share A | 0.501610 | −0.001037 | [−0.005118, 0.003181] | 0.138603 | no | no |
| G7 | passes per match | 79.123123 | −0.218218 | [−0.776777, 0.354354] | 21.862968 | no | no |
| G8 | mean aim distance (m) | 15.555889 | −0.006207 | [−0.061437, 0.048459] | 4.298338 | no | no |
| G9 | through balls per match | 5.476476 | **+0.120120** | [−0.050050, 0.283283] | 1.513237 | no | no |

**NOT ONE LIMB IS EVEN RESOLVED** on the comparison of record: every interval contains zero.
G9 — the guard that broke DOWN at DS-T1b and was the arc's sore point — moves **UP** by
0.120120 and does not resolve.

**THE BESIDE TABLE — `OWNCOOP-E13` vs `HATS-E13`** (world 13 as shipped against the world-17
candidate), `holdsBand` **TRUE**, breach set **empty**. Four limbs RESOLVE but none passes its
tolerance: G5 interceptions −1.370370 [−1.803804, −0.953954] vs 7.445037 (the safe way);
G7 passes −1.230230 vs 22.142603; G8 mean aim distance −0.238259 vs 4.362457; **G9 through
balls −0.471471 [−0.686687, −0.267267] vs 1.676703**. On `OWN-E13|HATS-E13` (DS-T1c's own
comparison, re-walked on this block) the same four resolve and none breaches, G9 −0.591592.

**THE D13 TRIPLE**, all three `holdsBand` TRUE with empty breach sets. On
`OWNCOOP-D13|OWN-D13` not one limb resolves. On the two D13-vs-HATS pairs G4 resolves **UP**
(a floor moving up is not harmful), and G5 · G8 · G9 resolve DOWN inside tolerance.

**LOO** (scoped to R1 + the nine gating guards, per contrast — 60 rows). ⭐ EVERY FLIPPING ROW
IS NAMED, read off the `loo` array: **exactly two rows flip**, both on D13 pairs, and **neither
is on the comparison of record** —

* `OWN-D13|HATS-D13` · `guard.shotsPerMatch` — `looFlipsDown` **390**, `looFlipsUp` 0 (its Δ
  −0.276276 [−0.549550, −0.001001] resolves by a hair);
* `OWNCOOP-D13|HATS-D13` · `guard.goalsPerMatch` — `looFlipsUp` **111**, `looFlipsDown` 0 (its
  Δ +0.139139 [−0.003003, 0.283283] fails to resolve by a hair).

Both flips are of RESOLUTION, not of breach: **neither row breaches in either state**, because
neither is anywhere near its tolerance (3.205706 and 0.719693). The flipping seeds themselves
are STORED in `loo[].looFlippingSeeds`. The largest single-seed influence share anywhere in the
table is 0.903186.

### §R3 — THE FACES

| face (per arm) | `HATS-E13` | `OWN-E13` | `OWNCOOP-E13` | `HATS-D13` | `OWN-D13` | `OWNCOOP-D13` |
| --- | --- | --- | --- | --- | --- | --- |
| designated runners per in-possession coach tick | 1.505817 | 0.195259 | 0.191667 | 1.503067 | 0.161202 | 0.159693 |
| open-play board EMPTY share | 0.100234 | 0.999883 | 0.999795 | 0.098986 | 0.999913 | 1.000000 |
| `openPlayBoardEmpty` (stored boolean) | false | false | false | false | false | **true** |
| `MakeRun` share of off-ball decisions | 0.164156 | 0.077145 | 0.075551 | 0.176421 | 0.076032 | 0.073385 |
| own-run share of `MakeRun` | 0.000000 | 0.417746 | 0.436187 | 0.000000 | 0.486346 | 0.515370 |
| licensed-run share of `MakeRun` | 0.476347 | 0.000493 | 0.000534 | 0.552819 | 0.000775 | 0.000884 |
| own-run episodes per match | 0.000000 | 62.439439 | 63.464464 | 0.000000 | 76.260260 | 78.227227 |
| shots per own-run episode | NaN | 0.048271 | 0.047428 | NaN | 0.044668 | 0.044095 |
| runner-hat episodes per match | 141.689690 | 12.528529 | 12.392392 | 148.435435 | 10.683684 | 10.600601 |
| shots per runner-hat episode | 0.062558 | 0.126398 | 0.129321 | 0.056411 | 0.139324 | 0.141360 |

**⭐ `openPlayBoardEmpty` IS A STORED BOOLEAN AND IT IS `false` ON FIVE OF SIX ARMS.** DS-T1c
published it TRUE on its OWN arm; on this block the OWN and OWNCOOP arms sit at 0.999883 /
0.999795 / 0.999913 and only `OWNCOOP-D13` reaches exactly 1.000000. The share is what carries
the fact; the boolean is a universal and it is stored, never asserted in prose.

**RUNS BY ROLE** (share of executed-run body-ticks): `OWNCOOP-E13` DF 0.000802 · MF 0.008874 ·
WG 0.346353 · ST 0.643971, against `OWN-E13` DF 0.008851 · MF 0.025057 · WG 0.346416 ·
ST 0.619676 and the coach's `HATS-E13` DF 0.005421 · MF 0.056795 · WG 0.425536 · ST 0.512248.

**THE YIELD PAIR** on the arm of record, both fractions, ⛔ no verdict word: **0.047428** shots
per own-run episode (3,007 ÷ 63,401) against **0.129321** per runner-hat episode (1,601 ÷
12,380); goals **0.014542** against **0.051050**. On the control `OWN-E13`: 0.048271 (3,011 ÷
62,377) against 0.126398 (1,582 ÷ 12,516); goals 0.014621 against 0.049057.

**PER STATE** (own runs per match, arm of record): a mate on the ball **168.479479** · the ball
in flight **23.172172** · his side's own restart **0.171171** · other **0.426426**. On the
control: 164.202202 · 23.234234 · 0.185185 · 0.568569.

**THE CROWDING FAMILY** — `crowd.crashShare` 0.440822 → 0.444334 and `guard.spacingUnder4`
0.072804 → 0.073295 (pooled 0.072821 → 0.073324). Printed; not this door's.

**THE CALIBRATION RECEIPT (debt (a))** — `post/ledger` is 1.000000 on `OWN-E13` and
`OWNCOOP-E13` and 0.999999–1.000000 on every other arm: the post-step holds form reproduces the
engine's own `decisionsHeld` ledger.

### §R3b — THE SEAM'S OWN FACES (the arms carrying `dsOwnRun`)

| face | `OWN-E13` | `OWNCOOP-E13` | `OWN-D13` | `OWNCOOP-D13` |
| --- | --- | --- | --- | --- |
| perceived-owner guard pass share (a FLOOR) | 0.210694 | 0.212769 | 0.255620 | 0.254043 |
| visible own-run candidates per match | 1146.304304 | 1176.562563 | 1519.458458 | 1543.867868 |
| candidates outside the post-step guard | 0.000000 | 0.000000 | 0.000000 | 0.000000 |
| `restraint` mean | 0.449449 | 0.449680 | 0.452172 | 0.454333 |
| `restraint` EXACTLY 0 | 0.550508 | 0.550275 | 0.547819 | 0.545654 |
| `restraint` EXACTLY 1 | 0.445141 | 0.445490 | 0.450520 | 0.451972 |
| `rankBelowCount` share | 0.445141 | 0.445490 | 0.450520 | 0.451972 |
| `priorZeroShare` (the DF clamp, the ambiguous overlap) | 0.073813 | 0.072906 | 0.071108 | 0.069294 |
| `count` mean | 1.534424 | 1.534810 | 1.565831 | 1.571775 |
| own runs won with the ball IN FLIGHT | 0.123461 | 0.120532 | 0.153652 | 0.155785 |
| own runs won at his side's own RESTART | 0.000984 | 0.000890 | 0.001188 | 0.001153 |

The two HATS arms carry NO own-run candidate at all, so every seam face there is `NaN` over a
zero denominator — stored as `NaN`, never imputed. **The switch moves none of these**: the
restraint step, the DF clamp's share and the count are the same law on both sides of it.

### §R3c — THE COUPLING FACES (DS-C0's field names) AND THE TWO DISAPPEARING FACES

| face (per match unless stated) | `HATS-E13` | `OWN-E13` | `OWNCOOP-E13` | `HATS-D13` | `OWN-D13` | `OWNCOOP-D13` |
| --- | --- | --- | --- | --- | --- | --- |
| `overlapSets` | 2.989990 | 3.848849 | **0.000000** | 3.600601 | 4.732733 | **0.000000** |
| ⭐ `overlapArrivedStat` (**overlap ARRIVALS**) | 0.028028 | **0.092092** | **0.000000** | 0.052052 | 0.146146 | **0.000000** |
| arrivals per designation | 0.009374 | 0.023927 | NaN | 0.014456 | 0.030880 | NaN |
| `overlapConfronted` | 3.954955 | 3.864865 | 5.979980 | 4.609610 | 4.863864 | 7.728729 |
| `wallEligiblePasses` | 57.400400 | 58.323323 | 58.031031 | 64.565566 | 66.549550 | 66.748749 |
| `wallFires` | 10.616617 | 10.328328 | **0.000000** | 13.295295 | 13.669670 | **0.000000** |
| ⭐ `wallOneTwosStat` (**ONE-TWOS**) | 0.311311 | **0.211211** | **0.000000** | 0.504505 | 0.455455 | **0.000000** |
| return share of fires | 0.029323 | 0.020450 | NaN | 0.037946 | 0.033319 | NaN |
| `wallReconAgreesShare` | 0.962803 | 0.960577 | 0.829766 | 0.961225 | 0.955583 | 0.801476 |

**⭐⭐⭐ THE TWO DISAPPEARING FACES, PER MATCH.** What world 17 would lose, off the OWN arm:
**0.092092 overlap arrivals per match** and **0.211211 one-twos per match**. Beside them, off
HATS (world 13 as shipped): **0.028028** and **0.311311**. Both are read off the engine's own
`stats.overlaps` and `stats.oneTwos` ledgers. ⛔ PRINTED, NOT JUDGED.

**THE PAIRED Δ OF RECORD on the coupling faces** (numbers only): `overlapSets` 3.848849 → 0,
Δ −3.848849 [−4.016016, −3.685686], resolved; `overlapArrivedStat` 0.092092 → 0,
Δ −0.092092 [−0.111111, −0.074074]; `wallFires` 10.328328 → 0, Δ −10.328328 [−10.679680,
−10.011011], resolved; `wallOneTwosStat` 0.211211 → 0, Δ −0.211211 [−0.242242, −0.182182]. The
two per-set ratios are `null` on the treated arm (a zero denominator) and are stored as `null`,
never as zero.

**THE `passerReadTable`** (the passer's hat-read fires **by site**, per match; per carrier
decision tick beside it in the artifact):

| site | consumes | `HATS-E13` | `OWN-E13` | `OWNCOOP-E13` | `OWN-D13` | `OWNCOOP-D13` |
| --- | --- | --- | --- | --- | --- | --- |
| `wallReturn` | a LABEL (`mate.wallRun.partnerGid`) | 10.520521 | 10.067067 | **0.000000** | 14.424424 | **0.000000** |
| `thirdMan` | an ACTION TYPE | 45.807808 | 28.503504 | 27.558559 | 35.280280 | 34.731732 |
| `overlapRelease` | a LABEL (`team.overlapper`) | 0.702703 | 2.629630 | **0.000000** | 3.709710 | **0.000000** |
| `arriverCutbackFormed` | a LABEL (`team.arriver`) | 15.287287 | 1.119119 | 1.109109 | 1.248248 | 1.235235 |
| `arriverCutbackTaken` | a LABEL (`team.arriver`) | 5.224224 | 1.025025 | 1.035035 | 1.150150 | 1.143143 |

The two LABEL reads the switch starves go to exactly **0.000000**; the ACTION-TYPE read
(`thirdMan`) and the arriver reads move within noise. ⛔ Printed; not judged.

**G-ARM-COOP — GREEN, and it is A CHECK OF CONSTRUCTION, NOT A FINDING.** `overlapSets === 0`
∧ `wallFires === 0` on **all 999 seeds and the construction receipt** of both COOP-OFF arms;
0 seeds with an overlap set, 0 with a wall fire. Its non-vacuity receipt, the accessor spy on
scratch seeds `900,007,640–641`: on `OWNCOOP-E13` **16,130 + 13,572** and **20,988 + 17,322**
reads of `Team.overlapper` / `Player.wallRun`, **every one returning null**; on `OWN-E13` at the
same seeds **123 + 11,356** and **207 + 12,550** reads returned NON-null. Every spied match's
whole-match digest equals its unspied twin's (`nonInvasive` true on all four rows).

The emptiness table (`reads.emptyCouplingCounters`) enumerates the twelve zero counters: on each
COOP-OFF arm `overlapSets`, `wallFires`, `overlapArrivedStat`, `wallOneTwosStat`,
`overlapReleaseFires` and `fireWallReturnUpperBound`. ⛔ No universal is asserted in prose.

### §R4 — THE CODE FACTS

* **The six `MakeRun` pushes**, classified over the whole enclosing-`if` chain:
  `{"flagGated":1,"hatGuarded":3,"keeperUpGuarded":2,"unguarded":0}` — exactly **one**
  `flagGated`, naming **`dsOwnRun`**, and it is NOT hat-guarded;
  `makeRunCandidatesAllHatGuardedOnShippedPath` = **true**, DERIVED over the five pushes
  reachable with every DS flag absent. The two bonus-branch pushes carry
  `unreachableWhen: dsCoopHatsOff` **as a MEASURED fact**, with the spy counters stored beside
  them in `armCoop.spy` — ⛔ no text claim of reachability is made here.
* **THE THREE FLAGS' READ FORKS: FIVE in `src/**`**, and the inventory **AGREES** with
  §SWITCH-D on **TEXT + FILE + LINE**: `src/ai/PlayerBrain.ts:2213` · `src/ai/TeamBrain.ts:344`
  · `:367` · `:398` · `src/sim/mechanics.ts:430`. `forkLineNumbersAgree` **true**;
  `flagCountsAgree` **true** over all six files in §SWITCH-D's three-flag paragraph
  (`PlayerBrain.ts` 1/0/0 · `TeamBrain.ts` 0/2/1 · `mechanics.ts` 0/0/1 · `Match.ts` 4/4/4 ·
  `League.ts` 1/1/1 · `a4World.ts` 2/2/0). **NOTHING MOVED since `68022c9`.**
* **`a4World.ts` AT THIS HEAD**: `dsOwnRun` **2** · `dsHatsOff` **2** · `dsCoopHatsOff` **0** —
  the entry layer NAMES the two own-run doors (world 16), and **the switch reaches no world**.
  DS-T1c's two zero-count anchors read RED from `32723c5`; this exam states its own counts
  (errata 6, #412 item 3's FAMILY NOTE) and keeps only the one zero that is still a claim.
* ⭐⭐⭐ **RULE (m).** `assignRunners` WHOLE-TEXT hash **AT THIS HEAD**, STATED and **compared to
  nothing banked**:
  `77b0d79c36cc8932c2dfc267500ae30d50e47a626f84e7d6074b6087cd7ba5b5`
  (`codeFacts.assignRunnersStatedAtThisHead`, with its EXTRACTED callee list beside it).
  `performPass`, hashed WHOLE with its extracted callees (the 2过1 trigger lives in it):
  `1ff0dda909a3bb644c1fa087e3f609fc8ddf22749f6ed370d2ad3af65e9e4ac8`.
* `blockReadsNoVelocityNoTopSpeed` **true**; the block's `match`-member set equals §LAW-C's read
  set; `runRank` and `runnerCount`'s definitions and all their call sites agree with the doc;
  the six passer-read sites each resolve to exactly one line and one enclosing span, and the two
  the switch starves are NAMED (`wallReturn`, `overlapRelease`).

### §R5 — THE READ

> ## THE COOPERATION HATS PRODUCE NOTHING THE BAND CAN SEE — they come off: DS-ENTRY-2 is named (world 17 = 16 + the cooperation hats off).

**Selected by the frozen rule at PRECEDENCE STEP (2)** — *"the band holds and R1 does not
flood"* — on the STORED selectors of the comparison of record (`OWNCOOP-E13|OWN-E13`, E13, the
seat absent): `holdsBand` **true**, `floods` **false**, `breachingGuards` **[]**. The word, the
sentence, the step and every selector are re-derived off the SERIALIZED artifact by `gFaces` /
`gReadWords`; the sentence is one of the three frozen literals and all three literals were
cross-checked against their three homes at run time (`gReadLiterals` GREEN).

**PRINTED BESIDE IT, from stored fields, with NO verdict word:**

* **THE HONESTY LINE** — *"nothing the band can see" is NOT "nothing the eye can see" — the
  user's gate at world 17 judges the eye.*
* **THE TWO DISAPPEARING FACES PER MATCH.** On the **OWN** arm (what world 17 would lose):
  overlap arrivals **0.092092**, one-twos **0.211211**. On **HATS** (world 13 as shipped):
  **0.028028** and **0.311311**.
* **THE R1 RATIO:** 0.966607 [0.953676, 0.980174]; R1 0.247172 → 0.238918, Δ −0.008254
  [−0.011588, −0.004856] against a tolerance of 0.068298.
* **THE YIELD PAIR:** 0.047428 shots per own-run episode vs 0.129321 per runner-hat episode.
* **THE COUPLING NUMBERS (numbers only):** overlap sets per match 0, wall fires per match 0,
  overlap arrivals per match 0, one-twos per match 0 — on the arm of record, by construction.
* **PER STATE:** a mate on the ball 168.479479 · in flight 23.172172 · own restart 0.171171 ·
  other 0.426426.
* **THE OPEN-PLAY BOARD:** `openPlayBoardEmpty` = **false** on the arm of record (share
  0.999795).

**THE COUNTERFACTUAL WORDS — STORED, NEITHER SELECTING:**

* **D13** (`OWNCOOP-D13|OWN-D13`): word **`read1`** — *THIS PAIR SELECTS THE SAME READ*
  (`d13Agrees` true).
* **THE HATS-vs-OWN+COOP-OFF GUARD TABLE** (`OWNCOOP-E13|HATS-E13`, world 13 against the
  world-17 candidate): its own `holdsBand` word is **TRUE**, `floods` **false**, and the frozen
  rule applied to its stored interval gives **`read1`**. It selects nothing.

### §R6 — 在说人话的层面

教练最后两顶手写的配合帽子——**套边**和**二过一**——摘掉之后，这块表看不出任何变化。

* **前插的人没有变多，反而略少一点点**：每个有球 tick 平均 0.247172 → 0.238918，比值 0.966607，
  容差是 0.068298，差距只有容差的八分之一左右。
* **十条护栏一条都没有动**：进球、射门、xG 转化、传球成功率、被断、控球、传球数、平均传球距离、
  直塞球，**九条连"分辨得出来"都没做到**（区间都包含 0）；越位旗没有升起。直塞球甚至微升 0.120120。
* **消失的那两样，数字在这里**：每场 0.092092 次套边到位、0.211211 次二过一。世界 13 原版是
  0.028028 和 0.311311。这两个数是这一步真正付出的东西，**这块表看不见它们，因为它们太小**。
* **不是"没有影响"，是"这块表看不见"**：一顶帽子摘掉之后，跑动的分配变了（前锋的份额
  0.619676 → 0.643971，中场从 0.025057 掉到 0.008874），传球手读到的两个标签直接归零。眼睛看不
  看得出来，是世界 17 那道用户闸门的事，不是这块表的事。

⛔ 这一段里没有一个褒贬词落在产出、耦合、seam 或假设的任何一张脸上；**唯一的判决就是 §R5 那句冻结
的读数**。

---

## §HONEST LIMITS

**THE ONE HOME.** The artifact stores none of this list (`stage.honestLimitsNote`); its pointer
names THIS doc.

1. **"NOTHING THE BAND CAN SEE" IS NOT "NOTHING THE EYE CAN SEE."** The band is ten guards and
   R1. It cannot see the SHAPE of an overlap (a body arriving on the outside is a picture, not a
   count), the TIMING of a one-two (a return that lands half a second late is the same ledger
   row), or whether a match looks like football. The user's gate at world 17 judges that; this
   exam does not.
2. **THE TWO DISAPPEARING FACES ARE SMALL, AND SMALL IS NOT ZERO.** 0.092092 overlap arrivals
   and 0.211211 one-twos per match on the OWN arm: roughly one overlap arrival every eleven
   matches and one one-two every five. They are RARE EVENTS, so the band was never going to see
   them, and **this exam does not claim they are worthless — it claims the band cannot price
   them.**
3. **`gBite` IS RED, AND ITS MECHANISM IS MEASURED.** On **25 of 994** eligible seeds
   (`OWNCOOP-E13|OWN-E13`) and **4 of 999** (`OWNCOOP-D13|OWN-D13`) the two arms' **full-time
   whole-match signatures COINCIDE** although the control issued a hat. On EVERY one of those
   29 seeds the per-seed ROW differs in at least one non-signature field (`overlapSets`,
   `wallFires`, `epSets`, `unhattedOffBallTicksPost`, the back-out family …), so **the flag did
   bite** — `signatureOf(m)` is a **FULL-TIME SNAPSHOT**, not a trajectory hash, and on those
   seeds it cannot see the difference. The gate is a LIVENESS receipt; it gates no direction and
   no read. Declared at §DEVIATIONS 1. ⚠ `bite.rows[].identicalSeeds` is capped at 20 entries,
   so the doc names the counts (stored) and not all 25 seeds.
4. **THE IN-FLIGHT RUN IS STILL WITHDRAWN.** 0.120532 of own runs on the arm of record are won
   with the ball IN FLIGHT — the stale-eyes leak through the perceived-owner guard, unchanged in
   kind from DS-T1c's 0.119467. The run onto a ball in flight is still unbuilt.
5. **THE DF CLAMP.** 0.072906 of visible own-run candidates score exactly 0 because their PRIOR
   is 0 (a defender deep in his own half), not because the restraint bit. At a zero prior the
   back-out's denominator is zero and **the restraint is NOT RECOVERABLE there**; that
   population is counted, never imputed.
6. **THE STALE-EYES CASE.** A mate seen late does not outrank the observer, and a stale position
   ranks a mate where he WAS — a body with bad eyes ranks himself HIGHER and runs more. Measured
   as behaviour by DS-T0c, inherited here, and untouched by this switch.
7. **THE BACK-OUT READS ONLY THE TOP FOUR.** The engine's decision record stores the top four
   candidates, so every seam share is a **FLOOR** on the pushed population, and the
   perceived-owner guard's pass share (0.212769) is a floor too.
8. **`openPlayBoardEmpty` IS `false` ON FIVE OF SIX ARMS.** The open-play board is empty on
   0.999795 of open-play in-possession coach ticks on the arm of record — not on all of them.
   DS-T1c published the boolean TRUE on ITS arm and block; **this exam does not**. The share is
   the fact.
9. **THE `wallReconAgreesShare` FALLS ON THE COOP-OFF ARMS** (0.960577 → 0.829766 on E13). The
   wall reconstruction uses a passer→TARGET **PROXY** distance where the engine uses
   passer→LED-POINT; with the engine's own fire forced to zero, every seed where the
   reconstruction would have fired now disagrees. That is the PROXY's own error surfacing, not a
   new fact — and it is exactly why the reconstruction is published with its agreement share.
10. **THE COUPLING FACES ARE DS-C0's DEFINITIONS, INCLUDING ITS DECLARED HEURISTICS.**
    `fireWallReturnUpperBound` and `fireThirdManUpperBound` are **UPPER BOUNDS** and say so;
    only `fireOverlapReleaseExact` is exact. The wall trigger's per-conjunct kill shares are a
    DECLARED reconstruction.
11. **ONE BLOCK, ONE COMPOSITION.** Every number here is world 13 (empty-book) and world 13
    (the played book) at THIS head, at N = 999 seeds. The D13 arms take the SHIPPED loaders'
    doses; they are not a second world.
12. **THE OBM SEAT IS ABSENT EVERYWHERE.** This exam prices the two hats **without eyes**. What
    a dosed seat would do to the cooperation hats is not measured and is not claimed; the dose
    space belongs to selection (#390).
13. **THE ARC'S NUMBERS ARE FROM OTHER BLOCKS.** DS-T1's, DS-T1b's and DS-T1c's values are
    quoted BY FIELD out of their own artifacts. DS-T1c's `OWN-E13-ABSENT` is this exam's
    `OWN-E13` **by construction**, but on a DIFFERENT SEED BLOCK — the levels are comparable,
    they are not the same measurement, and no verdict word is written on the comparison.
14. **`gBite` ASIDE, NO GATE MEASURES QUALITY.** Every green gate is a liveness or a receipt.
    A holding band says the guards did not resolve past tolerance; it does not say the football
    got better.

---

## §DEVIATIONS (declared by the executor; the commander disposes)

1. ⚠⚠ **`gBite` IS RED — 25 of 26 GATES GREEN, `allGreen` is a STORED `false`.** The gate's
   eligibility predicate, frozen at §P before the battery, treats a seed as biteable when the
   CONTROL arm issued at least one cooperation hat (`overlapSets + wallFires > 0`). On 25 E13
   and 4 D13 such seeds the two arms' **full-time whole-match signatures coincide**. THE CAUSE
   IS MEASURED, not guessed: `signatureOf(m)` is a snapshot of the FULL-TIME state (tick, score,
   phase, ball, rng, and every body's pos · vel · heading · stamina · action type), **not a
   trajectory hash**; on every one of those 29 seeds the per-seed ROW differs in at least one
   non-signature field, so the flag bit and the snapshot could not see it. ⛔ **THE FROZEN
   INSTRUMENT WAS NOT EDITED TO MAKE THIS GREEN** — tuning a receipt's exemption rule after
   seeing which seeds failed is exactly what freeze-before-battery forbids. The gate gates no
   direction, no face and no read; the read of record stands on `holdsBand` and `floods`, which
   are unaffected. THE COMMANDER DISPOSES.
2. **N = THE AFFORDANCE, NOT THE LITERAL `min()`.** #413 item 5(v) says *"N = min(required, the
   block's affordance … ) — say which"*. Both sizing rows resolve at n = 14 and n = 15, so the
   literal minimum is 15; **this stage walked 999**, the inherited house practice of DS-T1 /
   DS-T1b / DS-T1c. Reason: a 12-cluster variance estimate is noisy and this exam's new coupling
   faces are RARE EVENTS with small per-seed counts (0.092092 overlap arrivals per match — at
   n = 15 the face would have had roughly one event). Walking more can only narrow an interval,
   never widen one, and it consumes the block that was booked to this stage either way.
3. **TWO INHERITED GATE DEFINITIONS WERE CORRECTED BEFORE THE FREEZE, AND BOTH ARE DISCLOSED AT
   §DEV-PREFLIGHT**: three stale doc-count FIXTURES (DS-T1c's four-row `own N / hats N` parse →
   §SWITCH-D's six-row, three-flag paragraph), and `gClassesNonVacuous`, which had been written
   to require `overlapArrivedStat` and `wallOneTwosStat` NON-ZERO on every non-COOP arm — a
   requirement that would have gated a DIRECTION on a rare event. Both were fixed on the 2-seed
   shake-out, before the sizing smoke and before the freeze.
4. **THE ACCESSOR SPY IS THE ONE WRAPPER THIS INSTRUMENT INSTALLS.** It runs on THROWAWAY
   matches at `900,007,640–641` only, never on a battery walk, never in `src/`, and each row
   proves its own non-invasiveness by whole-match digest against an unspied twin. `gLockstep`
   and `gPullCount` are unaffected (they walk their own throwaway matches at `900,007,690–691`).
   ⚠ HONEST SCOPE, inherited from §DEVIATIONS-D 3: the spy measures the SUPERSET of reads of the
   two fields, which is strictly stronger than the two bonus branches' own reads.
5. **THE `assignRunners` HASH IS STATED, NOT COMPARED** (rule (m), #413 §CORR-D 5). Gate 1 lives
   inside that function, so DS-C0's and DS-T1c's banked literals for it read RED **by
   declaration**. No other inherited span hash is exempted; `performPass` is likewise stated
   because gate 2 lives inside it.
6. **DS-T1c's TWO `a4World.ts` ZERO-COUNT ANCHORS ARE RETIRED HERE AND REPLACED BY STATED
   COUNTS** at this head (2 · 2 · 0). This is errata 6 (#412 item 3) applied, not a new claim:
   an entry rung reddens such an anchor by design.
7. **`bite.rows[].identicalSeeds` IS CAPPED AT 20 ENTRIES** by the inherited row shape, so the
   full list of 25 identical-signature seeds on the comparison of record is **not stored**. The
   counts are (`eligibleSeeds` 994, `seedsDiffering` 969) and the seeds are recoverable from
   `perSeedCells[]` by comparing the two arms' `signature` fields — which is how this doc's
   §HONEST LIMITS 3 derived them.
8. **THE ARTIFACT IS AT THE `.RED.json` PATH** — `docs/world-model/data/
   ds-t1d-coop-hats-exam.json.RED.json` — because the instrument's own RED-ROUTING idiom
   (#334 item 5) moves it whenever `allGreen` is false. The canonical path
   `data/ds-t1d-coop-hats-exam.json` is therefore EMPTY at this commit. Declared, not smoothed.
9. **THE SIX ARMS COST ONE THING DS-T1c HAD**: with the OBM seat absent everywhere there is no
   `runMulLic` limb to publish against a dosed arm, and `runMul`'s whole distribution on every
   arm is the back-out's own NOISE FLOOR. It is published as such, never assumed away.
10. **`openPlayBoardEmpty` DISAGREES WITH DS-T1c's PUBLISHED BOOLEAN.** DS-T1c stored TRUE on
    its OWN arm; this block stores FALSE on five of six arms with shares 0.999795–1.000000. Both
    are stored booleans over their own blocks; neither is restated as the other's. ⚠ A reader
    comparing the two must compare the SHARES, not the booleans.

---

## §GATES — 25 of 26 GREEN (`allGreen` = **false**, a STORED boolean)

| gate | verdict | the note derives from |
| --- | --- | --- |
| `gWorld` | ✅ | the three DS flags exactly as due per arm on every walked match + the construction receipt; `obmMovement` FALSE and NO matrix anywhere (rule (h)); `info.genome` clean; the world pin at `900,007,670` |
| `gArmCoop` | ✅ | `overlapSets === 0` ∧ `wallFires === 0` on all 999 seeds + the receipt of both COOP arms; the accessor spy live (16,130–20,988 overlapper reads, 13,572–17,322 wallRun reads), all-null on the COOP arm, NOT all-null on OWN, non-invasive by digest |
| `gReadLiterals` | ✅ | the three frozen sentences found in every required home (the rulings file and the contract), on normalised prose; the FALLBACK's ruling-only asymmetry declared |
| `gDoseSource` | ✅ | the L3 / PC dose FILE BYTES hashed and equal to the pins of record |
| `gAnchoredConstants` | ✅ | every anchored site at its declared occurrence count, including the switch's two gate lines, its flag declarations, the `keepOverlap` statement outside gate 1, and the `a4World.ts` counts at THIS head |
| `gPredicateFixtures` | ✅ | every walk-side predicate stated with a firing and a non-firing case, including the six-arm table, the contrast table, the NO-DOSE negative both ways, the six passer-read needles, and the three flags' fork counts |
| `gLedgerRead` | ✅ | the engine's own records read where they exist; the declared heuristics named where none does |
| `gClassesNonVacuous` | ✅ | every class a read stands on is live; the empty classes AND the twelve empty coupling counters are ENUMERATED |
| `gCodeFactGraph` | ✅ | 5 hashed roots with extracted callees; 6 `MakeRun` pushes classified; 5 read forks equal to §SWITCH-D on text + file + LINE; the six-file three-flag counts equal; the passer-read sites resolved |
| **`gBite`** | **⛔ RED** | 969/994 and 995/999 on the two COOP contrasts; **25 + 4 eligible seeds have identical FULL-TIME signatures although the flag bit** — §DEVIATIONS 1 and §HONEST LIMITS 3. ⚠ LIVENESS ONLY: it gates no direction and no read |
| `gRepro` | ✅ | **G-REPRO-DST1c: 178 fields × 24 arm-seed rows, ZERO mismatches** — `HATS-E13` AND `OWN-E13` re-walked on `12,556,000–011` against DS-T1c's stored cells. ⭐ ALSO THE PROOF THAT THE DORMANT SWITCH LEFT BOTH ARMS BYTE-IDENTICAL |
| `gPullCount` | ✅ | 12 spied pairs; the per-match pull count and the whole-match signature EQUAL observed vs unobserved on every one, and the wrapped signature equals the unwrapped lockstep walk's; the counter is live (488–6,594 pulls) — **the switch's gates read no percept, so the COOP-OFF arms' count is the OWN arm's** |
| `gLockstep` | ✅ | 12 arm × scratch walks, observed ≡ unobserved byte for byte |
| `gDeterminism` | ✅ | X-DET twice per arm on both scratch seeds; signatures and row bytes identical |
| `gFingerprintProd` | ✅ | `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` recomputed in-process, UNCHANGED |
| `gSrcUntouched` | ✅ | `git diff --stat HEAD -- src` / `-- tests` and `git status --porcelain` all EMPTY |
| `gSeedsBookedEqualWalked` | ✅ | 999 distinct battery seeds inside the block + the receipt at `12,557,999`; 6,000 walks booked = walked; the tail is `null` |
| `gSeedDisjoint` | ✅ | every battery seed ≥ 12,557,000; all thirteen consumed blocks end below this base; the re-walks lie inside DS-T1c's own block |
| `gN` | ✅ | no override env; the battery ran at exactly N_FROZEN = 999 × 6 arms |
| `gLoo` | ✅ | 60 rows; every flipping row's seeds STORED |
| `gScratchBand` | ✅ | all 19 scratch seeds derived from the ONE base `900,007,600` and inside `[900,007,600, 900,007,699]`; the out-of-band list EMPTY; disjoint from the battery block both ways |
| `gTwoFractions` | ✅ | 21 read-bearing quantities published in BOTH fractions |
| `gFaces` | ✅ | every published face, Δ, bin, median, top-bin share, partition, R1 row, guard row, read word and sizing row re-derived off the SERIALIZED artifact |
| `gReadWords` | ✅ | `floods`, every guard row's harmful-direction test AND its `breachDirection`, `holdsBand`, the selected read, the precedence step, both counterfactual words and the agreement word re-derived off disk |
| `gHashOrder` | ✅ | the 44-key allowlist schema complete; the body hash computed LAST; `receipts.hashReproducesFromFile` **true** |
| `gStage` | ✅ | `stage.instrument` is this instrument's own path and `stage.instrumentSha256` is the sha256 of the RUNNING file re-read from disk |

**THE ARTIFACT** — `docs/world-model/data/ds-t1d-coop-hats-exam.json.RED.json` (§DEVIATIONS 8):

* bytes **32,496,798**
* `fileSha256` **`f484e3afbbbd134d674bd7283b144aaa42f3e75ad83b49894ba63892675e803b`**
* `hashedBodySha256` **`28bad8d099c77fa2cdf44bcc578b50229e64f9f1f85451b3224c103fb77ea81a`**
* `stage.instrumentSha256` **`c7eed92971a52aecb4f8d22f0ac6fbd29069533597e5a4b16ed3d366b2713a32`**
* `receipts.hashReproducesFromFile` **true**
* `perf.batteryWallSeconds` **1,390.919** · `perf.meanWallSecondsPerMatch` **0.193802**

**CONSUMPTION.** Block `12,557,000–999` consumed whole (999 battery seeds + the construction
receipt at `12,557,999`). Scratch `900,007,600–699` (executor). ZERO stats:
`stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 86 }`. Next sim ≥ **12,558,000**.
