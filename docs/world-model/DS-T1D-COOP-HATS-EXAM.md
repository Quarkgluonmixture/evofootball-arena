# DS T1d — 「配合帽子 · 考」 THE COOPERATION HATS' EXAM

Status: **FROZEN — §0 through §DEV-PREFLIGHT are sealed at this FREEZE commit and are NOT edited
after sight.** The instrument is byte-identical between FREEZE and RESULTS
(`git diff <FREEZE> -- scripts/probes/ds-t1d-coop-hats-exam.ts` EMPTY at the RESULTS commit).
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
