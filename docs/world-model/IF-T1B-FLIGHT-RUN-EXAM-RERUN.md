# IF T1b — 「球在飞时的前插 · 复考」 THE FLIGHT RUN'S RE-EXAM

Status: **WALKED — the battery is complete, 28 of 28 GATES GREEN (`allGreen` = a STORED `true`)
and THE READ IS PRINTED AT §R5.** §0 through §DEV-PREFLIGHT were sealed at the FREEZE commit
`b55b62d` and were NOT edited after sight; the instrument is byte-identical between FREEZE and
RESULTS (`git diff b55b62d -- scripts/probes/if-t1b-flight-run-exam.ts` EMPTY). Only this Status
paragraph moved, and §R was appended.
THE ARTIFACT IS AT THE CANONICAL PATH `docs/world-model/data/if-t1b-flight-run-exam.json` (the
red-routing idiom did not fire).
X-SRC-ZERO holds throughout: not one byte under `src/` or `tests/` is created or edited.
**NOTHING SHIPS** — `ifFlightRun` stays default-OFF, named by no world, and the production
fingerprint is unchanged (`gFingerprintProd` GREEN on the x64 column of record). The commander
rules.

Authority: **COMMANDER RULING #423 item 3** (the dispatch — the IF-T1 instrument re-walked BY
RECIPE with the amended seam on block 12,560,000–999; the same five arms, the same faces, the
SAME three reads + fallback + precedence + liveness precondition; the two new stored partitions;
the eight corrections of #421 item 4 applied AT THE FREEZE with a new gate `gInheritedProse`;
IF-T1's x64 numbers the EXACT prior twin; the architecture-aware `gRepro` plus a
same-architecture re-walk against IF-T1; `match.ifLook` registered), **binding with #422 item 4**
(the same dispatch stated at the fork's resolution). It stands on **#423 item 1** (IF-T0b
BANKED-DORMANT — the facts of record) and **#423 item 2** (IF-T0b-FIX, the head this exam runs
on). It INHERITS the exam FORM of **#420 item 2** (the arms, the faces, the reads, the gate set,
the sizing) and, through IF-T1, #413 item 5 and #410 item 3. **#414 item 4(ii)'s FAMILY NOTE**
supplies `gBiteIF`'s ROW form. **#418 items 1–2** supply the architecture-keyed digest law.

* THE SEAM UNDER EXAM (read, never touched):
  [`IF-T0-FLIGHT-RUN-SEAM.md`](IF-T0-FLIGHT-RUN-SEAM.md) **§LAW-B** (the AMENDED law) · §HONESTY-B
  · §PINS-B · §DEVIATIONS-B, with §LAW governing everything §LAW-B does not name.
* THE SWITCH UNDER IT: [`DS-T0-OWN-RUN-SEAM.md`](DS-T0-OWN-RUN-SEAM.md) §LAW-C · §SWITCH-D.
* THE FORM AND THE PRIOR TWIN: [`IF-T1-FLIGHT-RUN-EXAM.md`](IF-T1-FLIGHT-RUN-EXAM.md) §0–§P, its
  **§COMMANDER CORRECTIONS** (the eight this stage applies at its freeze) and
  `scripts/probes/if-t1-flight-run-exam.ts`.
* THE Q4 FACES COPIED BY FIELD NAME:
  [`IF-C0-FLIGHT-RUN-CENSUS.md`](IF-C0-FLIGHT-RUN-CENSUS.md) §P +
  `scripts/probes/if-c0-flight-run-census.ts`.
* CONTRACT: [`IF-FLIGHT-RUN-CONTRACT.md`](IF-FLIGHT-RUN-CONTRACT.md) §1 C-IF.1–4 · §2 M-IF.1–6 ·
  §3 (the three frozen reads, inherited unchanged) · §4 the non-claims · STATUS #423.
* INSTRUMENT: `scripts/probes/if-t1b-flight-run-exam.ts`.
  ARTIFACT: `data/if-t1b-flight-run-exam.json` (the RESULTS commit writes it).

---

## §0 — WHAT THIS IS AND WHY

**THE QUESTION (#423 item 3, not re-argued here): IF-T1 measured the run onto the flight and read
READ 2 — the flight run CARRIES A FACE — on a state that turned out to be looser than the user's
own sentence. #422 narrowed that state (乙 + 甲: he starts ONLY when he SAW THE PASS LEAVE, and
only while the game is LIVE). WITH THE NARROWED SEAM, what does the run onto a ball already
travelling produce that R1 and the band can see?** The reads, their precedence and the liveness
precondition are UNCHANGED; only the seam under them moved.

### IF-T1's READ OF RECORD, QUOTED BY FIELD

Read out of `data/if-t1-flight-run-exam.json`'s own fields (`reads.selected`, `reads.sentence`,
`reads.precedenceStepThatSelected`); ⛔ not one of them is typed by hand in the instrument (it
stores them under `hNumbers.theArcQuotedByField.ifT1` and `prior.ifT1ReadOfRecord`).

| field | the value IF-T1 stored |
| --- | --- |
| `reads.selected` | **`read2`** |
| `reads.sentence` | *"THE FLIGHT RUN CARRIES A FACE — the guard is named; the commander decides between a restraint slice and stop with the table."* |
| `reads.precedenceStepThatSelected` | *"step (1) — a BREACH"* |

### IF-T1's TABLE, QUOTED BY FIELD — ⭐ EVERY ONE OF THEM AN **x64** NUMBER ON **THIS** HOST

These are the numbers the commander decided the restraint fork with (#421 item 2). They are
**EXACT prior twins**: the same host, the same architecture, the same five arms, the same
instrument recipe — measured on the block BEFORE this one (12,559,000–999). ⛔ **NO PAIRED Δ
ACROSS THE TWO BLOCKS IS CLAIMED**: the seeds differ, so a face here and its twin are two
INDEPENDENT SAMPLES and never a difference. The instrument stores each one beside its own face as
`prior.ifT1`, read BY FIELD out of IF-T1's artifact, never typed.

| IF-T1 field (arm of record `OWNCOOP+IF-E13` unless stated) | value |
| --- | --- |
| `guard.throughBallsPerMatch` — control `OWNCOOP-E13` | **5.557558** |
| `guard.throughBallsPerMatch` — candidate | **8.297297** (Δ +2.739740 [2.519520, 2.973974] vs tolerance 1.535641) |
| `r1.runsPerInPossessionTick` — control | **0.244699** |
| `r1.runsPerInPossessionTick` — candidate | **0.773695** (Δ +0.528996, tolerance 0.067614) |
| `runClass.shareOfMakeRun.ownRunOntoFlight` | **0.629314** |
| `ifRun.decisionsPerMatch` | **731.011011** |
| `ifRun.episodesPerMatch` · `ifStart.stampedStartsPerMatch` | **135.701702** · **116.227227** |
| `ifStart.memoryShare.theLastPasser` · `.anotherMate` | **0.166823** · **0.833177** |
| `ifStart.truthStateShare.ballInFlight` · `.ownRestart` | **0.731602** · **0.227300** |
| `ifRestraint.exactlyZeroShare` | **0.665404** |
| `ifRun.shotsPerEpisode` · `own.shotsPerEpisode` | **0.035510** · **0.049945** |
| `dt.negativeShare` · `run.inFlightShare` | **0.370729** · **0.551466** |
| `receiver.classShare.startedDuringTheFlight` | **0.004754** |
| `flight.intendedReceiverShare` | **0.000000** |
| `release.runnersAtReleaseMean` | **0.869299** |
| `leak.cellShare.stalePasserStillCredited` | **0.859069** |

⚠ **THE TWO ROWS THIS EXAM ADDS HAVE NO PRIOR TWIN BY CONSTRUCTION**: IF-T1's seam had no whistle
test and no look counter, so it published neither the START STATE BY PHASE nor the START STATE BY
LOOK DISTANCE. Both are stored here as `null` on the prior side, and the instrument says so.

### IF-C0's own numbers — ⭐ EVERY ONE OF THEM AN **arm64** NUMBER

Read out of `data/if-c0-flight-run-census.json`'s `faces[]`. They are printed beside every twin
face under `approx.ifC0` with the stamp **"≈ cross-architecture"** — **PRINTED, NEVER SELECTING.**
The exact comparator for every face of this exam is **its own control arm**, walked here, on this
architecture, on this block.

| IF-C0 field | `OWNCOOP-E13` (arm64) | `HATS-E13` (arm64) |
| --- | --- | --- |
| `receiver.classShare.startedDuringTheFlight` | **0.000021** | **0.000021** |
| `dt.negativeShare` | **0.039719** | **0.004264** |
| `run.inFlightShare` | **0.083077** | **0.027587** |
| `flight.intendedReceiverShare` | **0.000000** | **0.000000** |
| `release.runnersAtReleaseMean` | **0.644204** | **1.176840** |
| `leak.cellShare.stalePasserStillCredited` | **0.894186** | — (0 / 0) |

### The AMENDED seam under exam, named as IF-T0b named it (§LAW-B)

* **THE SECOND DOOR** `match.ifFlightRun` — default OFF, ABSENT ≡ FALSE, named by NO world,
  living INSIDE the own-run fork. Its alias is the FIRST executable statement inside
  `if (match.dsOwnRun) {`.
* **THE BELIEF** `match.ifLastSeenOwnerGid` — now a RECORD `{ ownerGid, look }`: the gid he last
  saw with the ball AND THE INDEX OF THE LOOK that wrote it. Created EMPTY, written only under
  the door, from the snapshot the fork already pulled.
* ⭐ **THE LOOK COUNTER** `match.ifLook` — `Map<gid, number>`, created EMPTY, incremented ONCE per
  own-run evaluation under the door. **THIS EXAM'S ONE NEW REGISTERED LEDGER READ (registry
  87 → 88)**: read, never written.
* ⭐ **M-IF.5 — THE GAME IS LIVE.** The eighth state additionally requires
  `match.phase === 'playing'`. At a dead ball the eighth state is FALSE; the seventh is untouched.
* ⭐ **M-IF.6 — HE SAW IT LEAVE.** The eighth state holds ONLY when the belief was written AT HIS
  IMMEDIATELY PREVIOUS LOOK (`belief.look === thisLook − 1` — an INDEX EQUALITY of the
  `cands.length − 1` kind; ⛔ not a tick bound, ⛔ not an age bound).
* **THE EIGHTH `why`** `'own run onto the flight'` — a RELABEL of the SAME candidate at the SAME
  score (M-IF.3), EXTRACTED from the seam's own line here, never typed.
* **THE FORK'S READ SET IS NOW SEVEN `match` MEMBERS** (§LAW-B 2): `dsOwnRun` · `ifFlightRun` ·
  `ifLastSeenOwnerGid` · `ifLook` · `perceivedSnapshot` · `phase` · `simTime`.

### The contract refuses every reading until this exam measures

`IF-FLIGHT-RUN-CONTRACT.md` §1 C-IF.4, VERBATIM: *"Whether the flight run pays, floods, or is
chosen by selection is a QUESTION FOR MEASUREMENT (IF-T1); nothing ships before the commander
rules on it."*

### ⭐⭐⭐ THE HONESTY LINE, printed beside EVERY read

> **"nothing the band can see" is NOT "nothing the eye can see" — the user's gate at world 18
> judges the eye.**

It is stored as `reads.honestyLine`, re-derived off the serialized artifact by `gFaces`, and
printed on the first annotation line of every read.

---

## §P — THE FROZEN PROTOCOL

Frozen **before** the battery, inherited from **IF-T1 section by section**, with **each change
marked ⭐ AMENDMENT**. ⛔ Not edited after sight. Where a section is inherited UNCHANGED it says so,
and the reason is that #423 item 3 requires it unchanged ("the SAME five arms, the SAME faces, the
SAME three reads + fallback + precedence + liveness precondition").

### §P.1 — THE ARMS: FIVE, THE OBM SEAT ABSENT THROUGHOUT

**INHERITED UNCHANGED from IF-T1 §P.1.** **NO DOSE IS PLACED ANYWHERE.**

| arm | world | flags | the OBM seat |
| --- | --- | --- | --- |
| `HATS-E13` | 13 empty-book | none | ABSENT |
| `OWNCOOP-E13` | 13 empty-book | `dsOwnRun` + `dsHatsOff` + `dsCoopHatsOff` — **world 17's own door set. THE CONTROL.** | ABSENT |
| `OWNCOOP+IF-E13` | 13 empty-book | the same **+ `ifFlightRun`** — **THE WORLD-18 CANDIDATE. THE ARM OF RECORD.** | ABSENT |
| `OWNCOOP-D13` | 13 DOSED (the shipped loaders' played book) | world 17's door set | ABSENT |
| `OWNCOOP+IF-D13` | 13 DOSED | the same + `ifFlightRun` | ABSENT |

* `HATS-E13` is **DS-C0's `buildMatch(seed, 'E13')` byte for byte** and is IF-C0's and IF-T1's own
  `HATS-E13`; `OWNCOOP-E13` is theirs too. That identity is what makes BOTH re-walks possible.
* The composer `a4MatchFlags(13)` is **CALLED**, never copied. `gWorld` proves every arm's flag
  set — FOUR flags, `ifFlightRun` included — on every walked match and on the construction
  receipt, and the world pin repeats it on a constructed match of each arm at `900,008,870`.
* ⭐ **AMENDMENT — the world pin also asserts the LOOK COUNTER map PRESENT-AND-EMPTY** beside the
  belief map, on every constructed arm.
* ⛔ **RULE (h) — NO DOSE**, inherited whole: `obmMovement` is never set, no 16-slot matrix is
  written to `baseGenome` or `effGenome`, `info.genome` is untouched, and DS-T1c's dose machinery
  stays REMOVED. ⭐ **AMENDMENT (a #421 item 4 re-read)**: the artifact's inherited `theTwoDoses`
  sentence described DS-T1c's two hand-set matrices as if this exam had them; it is RE-WRITTEN to
  say plainly that there are none here.

**THE CONTRASTS.** A contrast is a **PAIR**, not an arm. Inherited unchanged.

| contrast id | what it is |
| --- | --- |
| `OWNCOOP+IF-E13\|OWNCOOP-E13` | ⭐⭐⭐ **THE COMPARISON OF RECORD.** CONTROL = **world 17's own door set**. The reads stand on this pair and no other. |
| `OWNCOOP+IF-E13\|HATS-E13` | printed BESIDE, **HATS as its control**. STORED, COUNTERFACTUAL, NEVER SELECTING. |
| `OWNCOOP-E13\|HATS-E13` | DS-T1d's own comparison of record, re-walked on THIS block. |
| `OWNCOOP+IF-D13\|OWNCOOP-D13` | the D13 counterfactual; its word is stored and NEVER selects. |

### §P.2 — THE WALKER, THE INHERITED DEBTS, AND THE FIXTURES

**INHERITED UNCHANGED from IF-T1 §P.2.** The walker reads public `Match` / `Team` / `Player` /
`Ball` state and the engine's own decision record (`p.action.scores`) before and after
`match.step(DT)`, with **no wrapper on any walked match**. `gLockstep` proves observed ≡
unobserved byte for byte per arm; `gDeterminism` (X-DET) walks each scratch seed twice per arm.

**THE ONE DECLARED ADDED READ**, inherited: at an own-run decision tick on an arm carrying
`dsOwnRun` the instrument pulls `match.perceivedSnapshot(p)` **ONCE**, to publish IF-C0's LEAK
PARTITION and the EIGHTH class's START-STATE partitions. The pull is **INERT** and that is PROVEN:
`gLockstep` shows the whole-match signature byte-identical either way, and `gPullCount` asserts
that observed − unobserved EQUALS the instrument's OWN stored pull count on every spied pair.

⭐ **AMENDMENT — THE SPY SENTENCE IS GONE (#421 item 4(iii)).** IF-T1's `stage.xSrcZero` asserted
an accessor spy that its own §DEVIATIONS said had been removed. **This instrument installs NO
wrapper at all** except `gPullCount`'s own counter on throwaway matches at out-of-band scratch
seeds, and `stage.xSrcZero` now says exactly that and names no spy.

**THE THREE DS-T1 DEBT PAYMENTS ARE KEPT PAID**, restated unchanged: (a) the decision-tick
predicate reads `pcLatency`'s own holds map **AFTER** the step, with DS-C0's PRE-STEP form
recomputed beside it and both calibrated against `pcLatency.ledger.decisionsHeld`; (b) the shooter
gid is banked **AT THE SHOT'S PUSH**; (c) the episode-tick bins run **past one full `wallRun`
licence** (DERIVED from the licence's own `2.3` s and `DT`, never typed) and **every bin-derived
median is published WITH ITS TOP BIN'S SHARE beside it**.

**THE FIXTURES.** Every walk-side predicate is stated with a case where it FIRES and one where it
does NOT (`gPredicateFixtures`), including ⭐ **AMENDMENT — the two new partitions' own fixtures**:
the PHASE cell (a live game fires `playing`; a restart and a kickoff fire `notPlaying`) and the
LOOK-DISTANCE cell (the immediately previous look is `distance1`; two looks ago and this look's
own write are `distanceOther`; an empty belief and an absent counter are `noMemory`).

### §P.3 — R1, THE FLOOD FACE

**INHERITED UNCHANGED.** **R1 = EXECUTED runs per IN-POSSESSION OPEN-PLAY TEAM-TICK.** Per team,
per stepped tick: `match.possessionSide === team.side` · `match.phase === 'playing'` · the team
carries NO live `cornerCrash` and NO live `crossFlight`. THE COUNT is of OUTFIELD BODIES (not the
keeper, not sent off) whose `p.action.type` is `MakeRun` — **the bodies, not the board**. Frozen
bins 0 · 1 · 2 · 3 · 4 · 5 · 6+, the mean, and the **≥ 3 share**.

On the comparison of record the control is the **world-17 arm `OWNCOOP-E13`**, so the tolerance is
`NI_FRACTION · |OWNCOOP-E13 level|` by the house form (`NI_FRACTION = 1 − 0.275/0.380`, inherited
BY ANCHOR from `ctb-t1-supply-exam.ts`'s own line, cross-read from `dlc-t1-choice-exam.ts`, and
EVALUATED from its two numerals — never typed as a decimal).

⭐ **AMENDMENT (#421 item 4(v), applied at this freeze).** IF-T1's `r1.what` and its 40
`toleranceForm` strings named `OWN-E13`, an arm neither exam has. Both strings are RE-WRITTEN here
to name **`OWNCOOP-E13` as the control**, and every row still names its own `controlArm`.

⭐ **AMENDMENT (#421 item 4(vi)).** **|Δ| ÷ tolerance is STORED as a field** —
`absDeltaOverTolerance` — on **every** R1 row and **every** guard row, so neither a reader nor a
doc has to compute it by hand.

`floods(contrast)` = the paired Δ of R1's mean is **RESOLVED** (the 95 % cluster-bootstrap
interval over 2,000 draws excludes zero) **AND UP AND beyond the tolerance**; its one-sided column
is `beyondToleranceUp`, with the two-sided `absDeltaBeyondToleranceEitherWay` stored beside it.
The **ratio** candidate ÷ control is published with its own interval — printed, never judged.
**LOO** is off the `loo` array and **every flipping row's seeds are STORED**.

### §P.4 — THE BAND (F-DS-b)

**INHERITED UNCHANGED.** Ten limbs, per contrasted pair. A **BREACH** = the paired Δ is RESOLVED
**AND** beyond the tolerance **IN THE HARMFUL DIRECTION**. `holdsBand(contrast)` = NO breach among
G1–G9. G10 is the #157 **FLAG** limb: it flags and gates NOTHING.

| id | face | direction |
| --- | --- | --- |
| G1 | goals per match | both |
| G2 | shots per match | both |
| G3 | xG conversion (goals ÷ Σ xg off the `shotLog`) | both |
| G4 | pass completion over ALL deliveries | **floor** |
| G5 | interceptions per match | **ceiling** |
| G6 | possession share (side A) | both |
| G7 | passes per match | both |
| G8 | mean pass (aim) distance in metres | both |
| G9 | through balls per match (the engine's own counter) | both |
| G10 | offsides per match | FLAG only, gates nothing |

Every breach carries **ITS DIRECTION** (`breachDirection` ∈ {`UP`, `DOWN`, `none`}) and the
**breach set with directions** is a stored array per contrast.

### §P.5 — THE FACES (published on EVERY arm; ⛔ NO VERDICT WORD on any of them)

**INHERITED UNCHANGED from IF-T1 §P.5**: populations A–C, the seam's own faces, the coupling faces
(DS-C0's, by field name), the crowding family (OBM-T1's, `spacingUnder4` included), the per-state
line, **the TEN-cell classifier** with DS-C0's EIGHT-cell mirror beside it, **the eighth class's
three partitions** (start state · restraint · yield) and **IF-C0's Q4 faces AS FACES**, copied BY
FIELD NAME, each with its ≈ twin.

⭐⭐⭐ **AMENDMENT (#423 item 3(i)) — TWO NEW STORED PARTITIONS OF THE EIGHTH CLASS'S START STATE:**

* **BY PHASE** — `playing` vs `notPlaying`, read off the engine's own phase at the start tick.
  M-IF.5 requires the game live, so this is expected to read **1.000000 `playing` BY
  CONSTRUCTION**. It is **STORED AND ENUMERATED as a receipt of M-IF.5**, ⛔ **never narrated as a
  finding and never a gate** — exactly as `|vel| > 0` is.
* **BY LOOK DISTANCE** — `noMemory` · `distance1` · `distanceOther`, where the distance is his
  current look MINUS the look that wrote his belief. M-IF.6 admits the eighth state ONLY at
  distance 1, so this is expected to read **1 BY CONSTRUCTION**. It is **A STORED RECEIPT OF
  M-IF.6**, ⛔ never narrated, ⛔ never a gate.
* **THE MEMORY PARTITION IS KEPT** (the last passer vs another mate vs no memory) — it is the
  number 乙 exists to move, and it is published exactly as IF-T1 published it.

⭐ **AMENDMENT — THE EXACT PRIOR TWIN (#423 item 3(iii)).** Beside **every** face row the
instrument stores `prior.ifT1`: IF-T1's own value for the SAME face on the SAME arm, read BY FIELD
out of its artifact. It is stamped **EXACT** (same host, same architecture, same construction) and
⛔ **no paired Δ across the two blocks is claimed**. IF-C0's arm64 value stays `approx.ifC0`, ≈.

### §P.6 — THE READS (#420 item 2(iii)'s literals, FROZEN EX ANTE, INHERITED UNCHANGED)

Copied **CHARACTER FOR CHARACTER** and cross-checked at run time against **BOTH written homes** —
ruling #420 item 2(iii) in `PROGRAMME-RULINGS.md` and `IF-FLIGHT-RUN-CONTRACT.md` §3 — on
normalised prose (`gReadLiterals`), with this instrument the third home. ⚠ **THERE IS NO ASYMMETRY
TO DECLARE**: every literal is REQUIRED in every home and a miss is RED.

> **read 1** — *"THE FLIGHT RUN COSTS NOTHING THE BAND CAN SEE — IF-ENTRY is named (world 18 =
> 17 + the run onto the flight)."*
>
> **read 2** — *"THE FLIGHT RUN CARRIES A FACE — the guard is named; the commander decides
> between a restraint slice and stop with the table."*
>
> **read 3** — *"THE FLIGHT RUN FLOODS — the restraint needs the flight: a restraint slice is
> named before any entry."*
>
> **the FALLBACK** — *"THE READS DO NOT COVER THE SHAPE — the commander decides with the
> table."*

**THE PRECEDENCE, the ruling's own**, applied to STORED booleans on the COMPARISON OF RECORD
(`OWNCOOP+IF-E13|OWNCOOP-E13`, the seat absent):

1. a **breach** (`holdsBand` FALSE) ⇒ **read 2**;
2. else `floods` (R1 UP beyond tolerance, RESOLVED) ⇒ **read 3**;
3. else ⇒ **read 1**;
4. the **FALLBACK** fires **only if a stored boolean is ABSENT** — a defect, not a shape.

⭐⭐⭐ **LIVENESS IS A PRECONDITION OF EVERY READ.** If **`gBiteIF`** is RED, **NO read is
selected** and the frozen string ***"THE SEAM DID NOT FIRE — no read"*** is stored instead. The
precedence step that selected is itself a stored string, re-derived off the serialized artifact.

⭐ **AMENDMENT (#421 item 4(i), applied at this freeze).** IF-T1's `reads.precedence` and
`reads.note` inside the hashed body carried DS-T1d's **TWO-read** rule and stale provenance. Its
CODE executed the three-read rule, so no selection could have differed — but the strings were
claims and they were wrong. **Both are RE-WRITTEN here to the three-read rule**, and the new gate
`gInheritedProse` (below) turns that class of error from something a verifier discovers into
something the instrument detects.

**PRINTED BESIDE the read**, from stored fields, with NO verdict word: the honesty line; the R1
ratio with its interval; **the eighth class's partitions**; the yield pair (seventh · eighth);
**the Q4 faces with their ≈ twins and their EXACT prior twins**; D13's word and the
HATS-vs-candidate guard table's own `holdsBand` word — STORED counterfactuals, **NEITHER
SELECTING**.

### §P.7 — SEEDS AND SIZING

* **Block `12,560,000–999`** (#423 item 3(vi)), verified fresh against **all SIXTEEN consumed
  blocks** — LN-C0 12,544,000–999 · LN-T1 …545 · LN-C1 …546 · LN-C2 …547 · LN-C3 …548 · LN-T1′
  …549 · LN-T1′b 12,550,000–999 · GK-C0 …551 · GK-T1 …552 · DS-C0 …553 · DS-T1 …554 · DS-T1b …555
  · DS-T1c …556 · DS-T1d …557 · IF-C0 …558 · **IF-T1 12,559,000–999** — each checked to end BELOW
  this block's base. Battery seeds `12,560,000–12,560,998`; **construction receipt `12,560,999`**.
  BOOKED = WALKED: 999 seeds × 5 arms + 5 receipt walks = **5,000 walks booked**.
  ⭐ **AMENDMENT (#421 item 4(ii)).** IF-T1's `gSeedDisjoint` and `gSeedsBookedEqualWalked` NOTES
  named DS-T1c's frontier and omitted the two newest blocks (its gate LOGIC was right). **Both
  notes are RE-WRITTEN here to name all sixteen blocks and THIS frontier** (#423 item 4: next sim
  ≥ 12,560,000).
* **N.** Sized by the DISCLOSED 12-seed smoke on `900,008,800–811` (five walks per seed) with the
  house form at a declared **0.05 half-width** on R1's paired Δ (the candidate vs world 17, E13)
  and on the **NEGATIVE-Δt HALF's** paired Δ on the same pair — see §DEV-PREFLIGHT for both rows.
  **N = min(required, the block's affordance) is TAKEN AS THE AFFORDANCE**, and §DEV-PREFLIGHT
  says so plainly.
* **SCRATCH, all inside the DECLARED BAND `900,008,800–899`, derived from ONE base**: the sizing
  smoke `800–811`, the smoke receipt `820`, **`gArmIF`'s construction walks `840–841`**, the world
  pin `870`, the lockstep pair (X-DET and `gPullCount` re-use it) `890–891`, the fixtures'
  attribute draw `899`. **`gScratchBand`** stores the list, the band and the out-of-band set, and
  asserts the band sits above canon's own scratch floor and is DISJOINT from the battery block
  both ways. ⛔ The verifier's band `900,008,900–999` is NOT this executor's.
* **THE TWO RE-WALK BANDS ARE OTHER STAGES' OWN CONSUMED BANDS and are NOT a consumption**:
  `12,558,000–002` is IF-C0's and `12,559,000–002` is IF-T1's.
* **ZERO stats**: `stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 88 }`.
* ⚠ **WALL TIME**: the smoke stores `perf.meanWallSecondsPerMatch`; §DEV-PREFLIGHT projects the
  battery from it, and the executor runs the battery in the background with a log. If the
  affordance projected beyond ~10 h the stage would HALVE N and say so in §DEVIATIONS — a sizing
  deviation, never a read change.

### §P.8 — THE GATE SET (frozen ex ante) — **28 gates**

IF-T1's **27** by anchor — `gWorld` · `gArmIF` · `gArmCoop` · `gReadLiterals` · `gDoseSource` ·
`gAnchoredConstants` · `gPredicateFixtures` · `gLedgerRead` · `gClassesNonVacuous` ·
`gCodeFactGraph` · `gBiteIF` · `gRepro` · `gPullCount` · `gLockstep` · `gDeterminism` ·
`gFingerprintProd` (X-FP-PROD, arch-keyed) · `gSrcUntouched` · `gSeedsBookedEqualWalked` ·
`gSeedDisjoint` · `gN` · `gLoo` · `gScratchBand` · `gTwoFractions` · `gFaces` · `gReadWords` ·
`gHashOrder` · `gStage` — **PLUS ONE NEW GATE**, with these changes inside the inherited ones:

* ⭐⭐⭐ **`gInheritedProse` — THE NEW GATE (#423 item 3(ii)).** It executes THE LESSON filed at
  #421 item 4: *every inherited prose string inside the hashed body is a claim and is RE-READ at
  the freeze.* The gate **WALKS the hashed body**, **ENUMERATES every prose field** it finds
  (every string of 40 characters or more, at its own JSON path, deduplicated by path + value),
  gives each one a **`sourceKey`** naming the top-level body key it lives under (whose provenance
  is spelled out once in `declaredSources`), and computes a **MEASURED `reRead` boolean**: a field
  counts as re-read only if its key DECLARES a source **and** the string carries **none of NINE
  FROZEN STALE TOKENS**. The tokens are the four MEDIUM and four LOW findings of #421 item 4 and
  this stage's own registry change, turned into a test:
  `OWN-E13` · `NO THIRD READ IS INVENTED` · the old cross-architecture row name · `accessor spy` ·
  `next sim ≥ 12,557,000` · `inside block 12,557,000` · `12,556,000–011` ·
  `THE ONE NEW REGISTERED READ OF THIS STAGE` · `OWN + COOP-OFF vs OWN`.
  **A SINGLE FALSE `reRead` IS RED.** The rows live at `inheritedProse`, INSIDE the hashed body,
  and the gate's own note is scanned with the rest.
* ⭐⭐⭐ **`gRepro` — ARCHITECTURE-AWARE, AND NOW TWO RE-WALKS.**
  (a) **IF-C0's `12,558,000–002`** on `OWNCOOP-E13` and `HATS-E13` against
  `if-c0-flight-run-census.json`'s `perSeedCells[]` **GATES only when `process.arch === 'arm64'`**;
  on x64 it **STORES** the rows at **`repro.rows`** with every differing field enumerated and reads
  *"≈ cross-architecture (stored, not gated)"*. ⭐ **AMENDMENT (#421 item 4(iv)): the rows are
  NAMED `repro.rows` in the instrument, in this doc and in the ruling** — the name #420 item 2(iv)
  used was never a path in any artifact and is used nowhere here.
  (b) ⭐ **AMENDMENT (#423 item 3(iv)) — THE SAME-ARCHITECTURE RE-WALK.** IF-T1's own
  `12,559,000–002` is re-walked HERE, on THIS host, against `if-t1-flight-run-exam.json`'s
  `perSeedCells[]`, field for field, at `repro.ifT1SameArchitecture`. On the **CONTROL ARMS**
  `OWNCOOP-E13` and `HATS-E13` the amended seam is DORMANT, so their rows **CANNOT** have moved:
  **those rows GATE, and a mismatch is RED.** On the **CANDIDATE ARM** `OWNCOOP+IF-E13` the rows
  **MUST** differ by construction (M-IF.5 and M-IF.6 narrowed the eighth state), so its differing
  fields are **STORED AND ENUMERATED** in `candidateArmDifferingFields` — ⭐ *the seam changed, not
  the host.* Fields this exam ADDED are absent from IF-T1's rows and are excluded by the shared-key
  filter; `wallMs` is excluded as always; shape-changed fields are NAMED.
* ⭐⭐⭐ **`gBiteIF`** — the **#414 ROW form**, VERBATIM from canon (*rare-event liveness on the
  row*), INHERITED UNCHANGED: on every battery seed where the CANDIDATE arm recorded ≥ 1
  eighth-`why` decision, the candidate's and the control's **per-seed ROWS differ in at least one
  stored field**. The full-time signature comparison is kept BESIDE as a PRINTED FACE and **gates
  nothing**. Its **non-vacuity** is the eighth-`why` count > 0 on the candidate arm over the
  battery. ⚠ LIVENESS ONLY — and ⭐ **a PRECONDITION of every read**.
* ⭐⭐⭐ **`gArmIF`** — INHERITED and ⭐ WIDENED: the eighth-`why` count is **EXACTLY 0** on every arm
  NOT carrying `ifFlightRun`, **the belief map is EMPTY there** and ⭐ **the LOOK COUNTER map is
  EMPTY there too**, on every battery seed, on the construction receipt, and on two whole
  construction walks at `900,008,840–841`. ⛔ A STORED BOOLEAN OF CONSTRUCTION, never narrated.
* ⭐ **`gLedgerRead`** — ⭐ AMENDMENT (#423 item 3(v)): **`match.ifLook` IS REGISTERED — registry
  87 → 88.** The belief was registered at IF-T1 (86 → 87) and is read here for the MEMORY
  partition; the look counter is registered HERE and read for the LOOK-DISTANCE partition. BOTH
  are READ, never written, and each map's size at full time is stored.
* ⭐ **`gCodeFactGraph`** — ⭐ AMENDMENT: the seam's read set is **SEVEN** `match` members,
  EXTRACTED from the fork's whole text and compared to **§LAW-B 2's own seven-member sentence**
  PARSED out of the markdown (DS-T0 §LAW-C 4's three asserted a SUBSET); the **FOUR** aliases are
  the **FIRST FOUR EXECUTABLE STATEMENTS** inside the fork and their lines are asserted
  CONSECUTIVE; the belief **and** the look counter each have ONE read site and ONE write site in
  all of `src/**`; `a4World.ts` carries **none** of `ifFlightRun`, `ifLastSeenOwnerGid`, `ifLook`
  (three literal-zero anchors).
* **X-FP-PROD, ARCH-KEYED** — both columns read BY ANCHOR out of `tests/ifFlightRun.test.ts`,
  neither typed. arm64 `57b0bdab…c673` is the value OF RECORD, x64 `59f42aa7…a072d` the second
  column (#418 item 1).
* ⭐ **`gFaces`** — inherited, with ⭐ AMENDMENT: a new partition check asserts that **all** the
  eighth-class start-state partitions (ball motion · memory · truth state · PHASE · LOOK DISTANCE)
  share **ONE denominator**, the stamped starts.
* ⭐ **`gHashOrder`** — inherited, with ⭐ AMENDMENT (#421 item 4(viii)): the note now **STATES**
  that `gFacesDetail` sits OUTSIDE the hashed body by schema and that what is inside is
  `gates.gFaces.ok` and its note. The `receipts` block says the same.

### §P.9 — THE CODE FACTS

* **The six `MakeRun` pushes**, classified over the WHOLE enclosing-`if` chain: exactly **one
  `flagGated`**, naming `dsOwnRun`; `makeRunCandidatesAllHatGuardedOnShippedPath` DERIVED over the
  five pushes reachable with every DS flag absent.
* **The three DS flags' read forks**, enumerated under `src/**` and compared to §SWITCH-D's
  inventory on **TEXT + FILE + LINE**. ⚠ **`ifFlightRun` has NO `if (…) {` read fork at all** — it
  is aliased and consumed in boolean expressions — so the fork inventory is unchanged by this seam
  and that is stated, not assumed.
* ⭐⭐⭐ **THE SEAM'S SEVEN-MEMBER READ SET**, at §LAW-B's placement, as described in §P.8.
* ⚠ **THE §SEAM-C LINE SHIFT, DECLARED.** §SEAM-C's table records the lines DS-T0c MEASURED; IF-T0
  and then IF-T0b inserted seam text INSIDE the fork, ABOVE four of those rows. The gate compares
  TEXT + FILE + CLASS exactly and, on the line, asserts that **no row moved UP**, that every
  non-`PlayerBrain.ts` row is **UNMOVED**, and that **THE FORK LINE ITSELF IS UNMOVED** — which is
  what makes every shift below it an insertion INSIDE the fork. The shifts are STORED.
* ⚠ **`a4World.ts` IS STATED AT THIS HEAD.** Its `dsOwnRun` / `dsHatsOff` / `dsCoopHatsOff` counts
  are STATED; the zeros that are **STILL CLAIMS** are kept as anchors: **`ifFlightRun` 0**,
  **`ifLastSeenOwnerGid` 0** and ⭐ **`ifLook` 0** — the flight door, its belief and its look
  counter reach no world, preset or bundle.
* ⭐⭐⭐ **RULE (m), INHERITED.** `assignRunners`, `performPass` and `decideOffBall` carry gates or
  insertions, so all three WHOLE-TEXT hashes are **STATED AT THIS HEAD and COMPARED TO NOTHING
  BANKED**. `runRank`, `runnerCount`, `registerPass` and `executeAction` are hashed and compared as
  before, and `blockReadsNoVelocityNoTopSpeed` is kept.

---

## §DEV-PREFLIGHT — THE DISCLOSED SMOKE (before the freeze)

Two scratch runs, both **inside the declared band `900,008,800–899`**, both with the artifact
routed OFF every canonical path by the instrument's own override guard.

1. **A 2-seed shake-out** (`900,008,800–801`, five arms) — used only to find and fix instrument
   defects before the sizing run. **ONE gate was RED on it and it was fixed at a §P-consistent
   point, BEFORE the freeze:**
   * **`gHashOrder`** — the new body key `inheritedProse` is written by `gInheritedProse`, which
     can only walk the body AFTER every other body key is assigned; the schema-completeness check
     ran before that assignment and saw the key undefined. Fixed by SEEDING `inheritedProse` with
     a placeholder at the same line where `allGreen` is seeded for exactly the same reason, and
     OVERWRITING it with the real rows below — so the schema check is honest for EVERY key and the
     written value is the real one.
   ⛔ **No predicate was loosened to make a measurement green**: the one fix is a correction of
   this instrument's own write ORDER, made before any battery seed was walked, and it is described
   in §P.8 above. Everything else on the shake-out was GREEN at the first attempt, which is what
   copying a banked instrument BY RECIPE is supposed to buy.
2. **THE SIZING SMOKE OF RECORD — 12 seeds `900,008,800–811`, five walks per seed, 28/28 gates
   GREEN**, from which the two half-widths below are transcribed into the instrument and
   re-derived off the artifact by `gFaces`.

| face (paired Δ, the comparison of record) | half-width at n = 12 | target | `nRequired` | resolvable at N = 999 |
| --- | --- | --- | --- | --- |
| `r1.runsPerInPossessionTick` | `0.02255161035621657` | 0.05 | **5** | yes |
| `dt.negativeShare` | `0.027117061411352818` | 0.05 | **8** | yes |

Form: `se(n) = hw(n)/z.975` · `se(needed) = |target|/(z.975+z.80)` ·
`N = ceil(n·(se(n)/se(needed))²)` · `MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975`.

⭐ **WHICH N WAS TAKEN, SAID PLAINLY.** Both rows resolve far below the block's affordance, so the
literal `min(required, affordance)` is the **REQUIRED** n (5 and 8). **THIS STAGE WALKS THE
AFFORDANCE, N_FROZEN = 999**, which is the inherited house practice of DS-T1 / DS-T1b / DS-T1c /
DS-T1d / IF-T1 and is ≥ required on every row: a 12-cluster variance estimate is NOISY, and the
faces this exam carries — the eighth class's partitions, the receiver class, the
intended-receiver share — are **RARE EVENTS** whose per-seed counts are small. **This is the #414
§CORR 8 floor reading** and it is DECLARED at §DEVIATIONS; it can only narrow an interval, never
widen one.

⭐ **THE WALL-TIME PROJECTION.** The sizing smoke stored `perf.meanWallSecondsPerMatch` =
**0.563300**. The battery is 999 seeds × 5 arms + 5 receipt walks = 5,000 walks, projecting
**≈ 2,816 s ≈ 0.78 h** — far inside the ~10 h ceiling, **so N is NOT halved** and the affordance
stands.

⭐ **THE SMOKE'S OWN RECEIPTS, all inside the band**: the smoke receipt at `900,008,820`;
`gArmIF`'s construction walks at `900,008,840–841`; the world pin at `900,008,870` (five
constructed arms, four flags each as due, **both** maps present and empty); the lockstep pair at
`900,008,890–891` (which X-DET and `gPullCount` re-use — 10 arm × scratch walks, observed ≡
unobserved byte for byte, and the added pulls EQUAL to the stored count); the fixtures' attribute
draw at `900,008,899`. `gScratchBand` stores all 19 seeds, the band `[900,008,800, 900,008,899]`
derived from the ONE base, and an EMPTY out-of-band list.

⚠ The smoke's own numbers are **NOT** results: they are scratch seeds, they are disclosed only so
the sizing is auditable, and no read is taken on them.

---

## §R — THE RESULTS

Walked at the RESULTS commit on the frozen instrument (byte-identical to FREEZE:
`git diff <freeze> -- scripts/probes/if-t1b-flight-run-exam.ts` EMPTY). **999 seeds × 5 arms + 5
construction-receipt walks = 5,000 walks BOOKED = WALKED**; block `12,560,000–999` consumed whole;
unwalked tail **none** (`seeds.unwalkedTail` is `null` — the battery ends at `12,560,998` and the
receipt takes `12,560,999`). Battery wall **3,148.947 s**, mean **0.551093 s** per walked match
(`perf`, a machine reading on one machine, on x64).

**28 of 28 gates GREEN. `allGreen` is a STORED `true`.** The artifact sits at the canonical path.

Every number below is quoted from an artifact FIELD at the six-decimal precision the instrument
itself prints; ⛔ no number in this doc is computed by hand. ⭐ Every one of them is an **x64**
number; IF-T1's x64 twins are the EXACT priors at `prior.ifT1` and IF-C0's arm64 twins are printed
as ≈ — neither selects anything.

### §R1 — R1, THE FLOOD FACE (executed runs per in-possession open-play team-tick)

| arm | mean | ≥ 3 runners | bins 0 · 1 · 2 · 3 · 4 |
| --- | --- | --- | --- |
| `HATS-E13` | 0.588980 | 0.014777 | 0.622770 · 0.180812 · 0.181641 · 0.014221 · 0.000556 |
| `OWNCOOP-E13` | 0.241767 | 0.001502 | 0.788474 · 0.182806 · 0.027219 · 0.001484 · 0.000017 |
| **`OWNCOOP+IF-E13`** | **0.288929** | **0.001807** | 0.749211 · 0.214485 · 0.034498 · 0.001780 · 0.000024 |
| `OWNCOOP-D13` | 0.238608 | 0.000828 | 0.790094 · 0.182041 · 0.027037 · 0.000820 · 0.000008 |
| `OWNCOOP+IF-D13` | 0.298222 | 0.001303 | 0.740277 · 0.222535 · 0.035885 · 0.001294 · 0.000009 |

(bin 5 reads 0.000001 on `OWNCOOP-E13` and 0.000003 on `OWNCOOP+IF-E13`, 0.000000 elsewhere;
bin 6+ is exactly 0 on all five.)

**THE PAIRED Δ OF RECORD — `OWNCOOP+IF-E13` vs `OWNCOOP-E13` on E13, CONTROL = world 17:**

> **Δ +0.047162 [0.042836, 0.051299]**, tolerance **0.066804**, `resolved` **true**, `up`
> **true**, **`beyondToleranceUp` FALSE**, **`floods` FALSE**. `absDeltaOverTolerance` (a STORED
> field, #421 item 4(vi)) **0.705973**. The ratio is **1.195072 [1.175962, 1.213609]**. LOO on
> this row: **0 flipping seeds in either direction**.

⭐ **THE PRIOR TWIN BESIDE IT (EXACT, not a Δ)**: IF-T1 measured 0.244699 → **0.773695** on its own
block, Δ +0.528996 against a tolerance of 0.067614, `floods` **TRUE**, ratio 3.161820. ⛔ The two
blocks' seeds differ, so **no paired Δ across them is claimed** — these are two independent
samples of the same face under two different seams.

The D13 pair moves the same way and also does not flood (Δ **+0.059614** [0.055807, 0.063389]
against 0.065931, `absDeltaOverTolerance` 0.904186, `floods` **false**); `OWNCOOP+IF-E13` vs
`HATS-E13` is Δ **−0.300051** (DOWN, `floods` false); DS-T1d's own comparison re-walked here
(`OWNCOOP-E13|HATS-E13`) is Δ **−0.347213**, `floods` **false**.

### §R2 — THE BAND, per contrasted pair, with every breach's DIRECTION

**THE COMPARISON OF RECORD — `holdsBand` TRUE. THE BREACH SET IS EMPTY.**

| id | face | control | arm | Δ | interval | tolerance | resolved | beyond | breach | \|Δ\|÷tol |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| G1 | goals per match | 3.249249 | 3.389389 | +0.140140 | [−0.004004, 0.283283] | 0.897819 | false | false | — | 0.156090 |
| G2 | shots per match | 12.327327 | 12.525526 | +0.198198 | [−0.048048, 0.431431] | 3.406235 | false | false | — | 0.058187 |
| G3 | xG conversion | 1.442431 | 1.481828 | +0.039398 | [−0.014348, 0.093520] | 0.398566 | false | false | — | 0.098849 |
| G4 | pass completion | 0.588616 | 0.587353 | −0.001263 | [−0.005574, 0.002984] | 0.162644 | false | false | — | 0.007766 |
| G5 | interceptions per match | 25.581582 | 25.586587 | +0.005005 | [−0.378378, 0.383383] | 7.068595 | false | false | — | 0.000708 |
| G6 | possession share (A) | 0.503698 | 0.501483 | −0.002215 | [−0.007226, 0.002576] | 0.139180 | false | false | — | 0.015917 |
| G7 | passes per match | 78.027027 | 77.705706 | −0.321321 | [−0.956957, 0.332332] | 21.560100 | false | false | — | 0.014904 |
| G8 | mean aim distance (m) | 15.565055 | 15.523802 | −0.041253 | [−0.109264, 0.024828] | 4.300870 | false | false | — | 0.009592 |
| **G9** | **through balls per match** | **5.486486** | **5.450450** | **−0.036036** | **[−0.223223, 0.149149]** | **1.516003** | **false** | **false** | **—** | **0.023770** |
| G10 | offsides per match (FLAG) | — | — | +0.033033 | — | — | false | — | flag **false**, gates nothing | — |

`breachSet` = `[]`. ⭐ **G9 — THE GUARD IF-T1 NAMED — IS UNRESOLVED AND BACK AT ITS CONTROL'S
LEVEL** (5.486486 → 5.450450, the Δ NEGATIVE and its interval straddling zero). IF-T1's prior twin
for the same face on the same arms was 5.557558 → **8.297297**, Δ +2.739740, **1.784 × tolerance,
THE ONE BREACH**. ⛔ Again: two blocks, two samples, no paired Δ claimed — but the FACE that
carried the read at IF-T1 is, on this block under the amended seam, inside its tolerance and not
resolved.

**THE OTHER THREE PAIRS — `holdsBand` TRUE on every one, breach set EMPTY on every one.**

* `OWNCOOP+IF-E13|HATS-E13` — `holdsBand` **true**, breach set **[]**; G9 5.905906 → 5.450450
  (Δ −0.455455 against 1.631895); offside flag false.
* `OWNCOOP-E13|HATS-E13` (DS-T1d's own comparison, re-walked on this block and this architecture)
  — `holdsBand` **TRUE**, breach set **[]**; offside flag false. World 17's read of record
  REPRODUCES here as a WORD, as it did at IF-T1.
* `OWNCOOP+IF-D13|OWNCOOP-D13` — `holdsBand` **true**, breach set **[]**; G9 6.311311 → 6.539540
  (Δ +0.228228 against 1.743915); ⚠ the G10 offside FLAG is **true** on this pair alone
  (Δ +0.141141, resolved) — a FLAG limb, gating nothing, printed.

**G9's LEVELS BY ARM**, printed: HATS 5.905906 · world 17 5.486486 · **the candidate 5.450450** ·
D13 control 6.311311 · D13 candidate 6.539540.

### §R3 — THE FACES

**THE CLASSIFIER, TEN CELLS** — the share of all attacking `MakeRun` decisions, by class:

| arm | licensed | arriving | box | oneTwo | overlap | keeperUp | **own run** | **onto the flight** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `HATS-E13` | 0.473027 | 0.039276 | 0.477659 | 0.003080 | 0.005670 | 0.001287 | 0.000000 | 0.000000 |
| `OWNCOOP-E13` | 0.000420 | 0.029368 | 0.530262 | 0 | 0 | 0.003364 | **0.436586** | 0.000000 |
| **`OWNCOOP+IF-E13`** | 0.000470 | 0.026422 | 0.483678 | 0 | 0 | 0.002185 | **0.395030** | **0.092214** |
| `OWNCOOP-D13` | 0.000762 | 0.033576 | 0.455751 | 0 | 0 | 0.002455 | **0.507456** | 0.000000 |
| `OWNCOOP+IF-D13` | 0.000757 | 0.029539 | 0.395428 | 0 | 0 | 0.002577 | **0.445743** | **0.125956** |

Per match on the arm of record: the eighth class **45.967968**, the seventh **196.918919**. On its
control the seventh is **196.444444** and the eighth is **0**. ⭐ The prior twin: IF-T1's eighth
class was **0.629314** of all attacking `MakeRun` decisions and **731.011011** per match. The
amended seam's class is **0.092214** and **45.967968**.

**THE BOARD.** `openPlayBoardEmpty` share is **0.999677** on the arm of record, 0.999883 on its
control, 1.000000 on both D13 arms and 0.100790 on `HATS-E13`. **THE CROWDING FAMILY**: 撞车
`crashShare` 0.445696 (control) → 0.444503 (candidate), 0.438563 on HATS; `spacingUnder4`
0.073301 → 0.073577, 0.069602 on HATS.

### §R3b — THE SEAM'S OWN FACES, and ⭐ THE EIGHTH CLASS'S PARTITIONS

**THE SEAM'S INHERITED FACES** (the arms carrying `dsOwnRun`; `HATS-E13` has no own-run population
by construction and its cells are enumerated in `reads.emptyRunClasses`):

| arm | restraint mean | = 0 | = 1 (`rankBelowCount`) | prior-zero share | own candidates/match |
| --- | --- | --- | --- | --- | --- |
| `OWNCOOP-E13` | 0.451780 | 0.548191 | 0.447957 | 0.073487 | 1194.808809 |
| **`OWNCOOP+IF-E13`** | 0.451114 | 0.548856 | 0.448319 | 0.072722 | 1193.670671 |
| `OWNCOOP-D13` | 0.456052 | 0.543936 | 0.453042 | 0.067470 | 1538.805806 |
| `OWNCOOP+IF-D13` | 0.457570 | 0.542411 | 0.454500 | 0.067045 | 1553.672673 |

⭐⭐⭐ **THE TENTH CELL AND ITS PARTITIONS** (arm of record, `OWNCOOP+IF-E13`):

* **THE COUNT.** `ownRunOntoFlight` decisions **45.967968 per match** (45,922 over the battery);
  episodes **45.835836 per match** (45,790), mean length **14.430028** ticks, 0.034034 still open
  at full time; visible eighth-class candidates **219.878879 per match** (a FLOOR — the record
  stores only the top four).
* **PARTITION 1 — THE START STATE** (24.531532 stamped starts per match, 24,507 in all): the ball
  he SEES is **in the air 1.000000** of the time (`loose` 0.000000, `noBallSeen` 0.000000).
  ⚠ `|vel| > 0` is a STORED partition, never a gate.
  His MEMORY holds **the last passer 0.450157** and **another mate 0.549843** (`noMemory`
  0.000000). ⭐ IF-T1's prior twin on the same partition was **0.166823 / 0.833177**.
  The ENGINE'S OWN truth state at those ticks: `ballInFlight` **0.928184** · `mateOwnsTheBall`
  **0.068511** · **`ownRestart` 0.000000** · `other` 0.003305. ⭐ IF-T1's prior twin:
  `ballInFlight` 0.731602 · **`ownRestart` 0.227300**.
* ⭐ **PARTITION 1b — BY PHASE (a STORED RECEIPT OF M-IF.5, never narrated, never gated)**:
  `playing` **1.000000** · `notPlaying` **0.000000**, as the law requires by construction.
* ⭐ **PARTITION 1c — BY LOOK DISTANCE (a STORED RECEIPT OF M-IF.6, never narrated, never gated)**:
  `distance1` **1.000000** · `distanceOther` **0.000000** · `noMemory` **0.000000**, as the law
  requires by construction.
* **PARTITION 2 — THE RESTRAINT** (#419 item 3's own face; 214.113113 backed-out observations per
  match): **exactly 0 → 0.706932** · **exactly 1 → 0.291409** · **between → 0.001660** (the float
  receipt the rank law predicts is 0). Mean **0.293005**. The SEVENTH class's own restraint on the
  same arm is 0.548856 / 0.448319.
* **PARTITION 3 — THE YIELD** (per eighth-class episode): shots **0.038808** · goals **0.014283**
  · passes aimed **0.208517** · completions **0.088862** · through share **0.165270**;
  **1.778779 eighth-class-episode shots per match**. The SEVENTH's own yield beside it: shots per
  episode **0.049224**, goals **0.015009**, episodes 63.223223 per match (its control: 0.047965
  and 63.442442). BY STATE: at a mate's feet **0.038775** shots per run (3.072072 runs per match) ·
  in flight **0.037990** (42.895896) · **at his own restart 0.000000 runs per match** · other
  0.000000.
* **THE TWO MAPS.** `match.ifLastSeenOwnerGid` holds **9.998999** entries per match at full time on
  the candidate arms and ⭐ `match.ifLook` holds **9.998999** — both **0.000000** on every arm
  without the door (`gArmIF`).

### §R3c — IF-C0's Q4 FACES, WITH THEIR ≈ TWINS AND THEIR EXACT PRIOR TWINS

⭐⭐⭐ The `≈ IF-C0` column is an **arm64** number measured on another host and another block:
PRINTED, NEVER SELECTING. The `prior IF-T1` column is an **x64** number measured on THIS host with
the SAME recipe on the block before this one: EXACT in kind, ⛔ never a Δ. The exact comparator is
the CONTROL column, walked here.

| face (IF-C0's own field name) | `HATS-E13` | `OWNCOOP-E13` (CONTROL) | **`OWNCOOP+IF-E13`** | ⭐ prior IF-T1 (same arm) | ≈ IF-C0 (arm64) |
| --- | --- | --- | --- | --- | --- |
| `dt.negativeShare` | 0.004458 | 0.040128 | **0.162958** | 0.370729 | ≈ 0.039719 |
| — of SEVENTH-class starts | — | — | 0.042195 | — | — |
| — of EIGHTH-class starts | — | — | **0.550351** | — | — |
| `receiver.classShare.startedDuringTheFlight` | 0.000086 | 0.000044 | **0.003005** | 0.004754 | ≈ 0.000021 |
| `flight.intendedReceiverShare` (FIXTURED) | 0.000000 | 0.000000 | **0.000000** | 0.000000 | ≈ 0.000000 |
| — the flight TOWARD him | 0.021638 | 0.121507 | **0.171677** | 0.329475 | — |
| `release.runnersAtReleaseMean` | 1.187239 | 0.641072 | **0.676094** | 0.869299 | ≈ 0.644204 |
| `run.inFlightShare` | 0.027542 | 0.085495 | **0.287682** | 0.551466 | ≈ 0.083077 |
| `leak.cellShare.stalePasserStillCredited` | — (0/0) | 0.896515 | **0.896442** | 0.859069 | ≈ 0.894186 |
| — seventh-class in-flight starts per match | — | 2.814815 | 2.841842 | 2.968969 | — |

**THE Δt BINS on the arm of record** (101.673674 attached starts per match; 0.016975 of run starts
never found a release and are NOT binned): `<−1.0` 0.000030 · `−1.0..−0.5` 0.008329 · `−0.5..0`
0.154600 · `0..0.5` 0.332198 · `0.5..1.0` 0.043506 · `1.0..2.0` 0.071122 · `≥2.0` 0.390216.

**THE RECEIVER'S CLASSES on the arm of record** (45.640641 completions joined to a flight per
match): `runningAtRelease` 0.148393 · **`startedDuringTheFlight` 0.003005** · `neither` 0.848602.
On the INTENDED receivers alone `startedDuringTheFlight` is **0.000000**.

**THE BODIES ALREADY RUNNING AT THE RELEASE, by bin** (arm of record, 77.686687 releases per
match): 0 → 0.531047 · 1 → 0.323622 · 2 → 0.088546 · 3 → 0.051759 · 4+ → 0.005025.

**THE COUPLING FAMILY BESIDE.** `HATS-E13` carries the cooperation hats (overlapSets 3.159159 per
match, wallFires 10.518519); every arm carrying `dsCoopHatsOff` reads **0.000000** on all four
**by construction** (`gArmCoop`, a stored check — it is what world 17 MEANS). The empty coupling
counters are ENUMERATED in `reads.emptyCouplingCounters`, never gated.

### §R4 — THE CODE FACTS

* **THE `MakeRun` PUSHES**: six, classified over the WHOLE enclosing-`if` chain —
  `{"flagGated":1,"hatGuarded":3,"keeperUpGuarded":2,"unguarded":0}`; the ONE `flagGated` push is
  `src/ai/PlayerBrain.ts:2317`, naming **`dsOwnRun`**, and it is NOT hat-guarded.
  `makeRunCandidatesAllHatGuardedOnShippedPath` **true**.
* **THE THREE DS FLAGS' READ FORKS: FIVE in `src/**`**, TEXT + FILE + LINE equal to §SWITCH-D:
  `PlayerBrain.ts:2213` · `TeamBrain.ts:344` · `:367` · `:398` · `mechanics.ts:430`.
  ⚠ **`ifFlightRun` has NO `if (…) {` read fork at all**, so FIVE is the whole inventory and that
  is stated, not assumed.
* ⭐⭐⭐ **THE SEAM'S SEVEN-MEMBER READ SET**, extracted from the fork's whole text
  (`PlayerBrain.ts` **2213–2326**): `match.dsOwnRun` · `match.ifFlightRun` ·
  `match.ifLastSeenOwnerGid` · **`match.ifLook`** · `match.perceivedSnapshot` · **`match.phase`** ·
  `match.simTime` — **EQUAL to §LAW-B 2's own seven-member sentence** PARSED out of the markdown,
  with DS-T0 §LAW-C 4's three asserted a SUBSET. The **FOUR** alias reads are **the FIRST FOUR
  EXECUTABLE STATEMENTS inside the fork**, at **2223 · 2224 · 2225 · 2226** with the fork at
  **2213**, and their lines are **CONSECUTIVE**. The belief and the look counter **each** have ONE
  read site and ONE write site in all of `src/**`.
* ⚠ **THE §SEAM-C LINE SHIFT, DECLARED AND STORED**: the four `PlayerBrain.ts` rows sit
  **13 · 58 · 58 · 58** lines LOWER than §SEAM-C's table (distinct shifts `[13, 58]`); every
  `TeamBrain.ts` row is UNMOVED; and **the fork line itself is UNMOVED (2213 in the doc, 2213
  measured)**.
* ⚠ **`a4World.ts` AT THIS HEAD, STATED**: `dsOwnRun` **2** · `dsHatsOff` **2** ·
  `dsCoopHatsOff` **2** · **`ifFlightRun` 0** · **`ifLastSeenOwnerGid` 0**, and ⭐ **`ifLook` 0**
  carried by its own literal-zero ANCHOR (§DEVIATIONS 5) — **the flight door, its belief and its
  look counter reach NO world, preset or bundle**.
* ⭐⭐⭐ **RULE (m)** — five WHOLE-TEXT root hashes STATED AT THIS HEAD and compared to nothing
  banked: `assignRunners` (`TeamBrain.ts:240-438`)
  `77b0d79c36cc8932c2dfc267500ae30d50e47a626f84e7d6074b6087cd7ba5b5` · **`decideOffBall`**
  (`PlayerBrain.ts:1925-2435`)
  `9b5459f9706d8923bdfaccb0c6cab696400a038ba6b3b2f778f6849eafe1db2a` — IF-T0b's own insertion
  moved it off IF-T1's value · `executeAction` (`actionExecutor.ts:123-1459`)
  `b0f3979e9f37123ad46bd8c752642e1db42573078290a48ff6011cf903b0d629` · `performPass`
  (`mechanics.ts:355-454`) `1ff0dda909a3bb644c1fa087e3f609fc8ddf22749f6ed370d2ad3af65e9e4ac8` ·
  `obmOffballPolicy` (`offballEyes.ts:266-274`)
  `c4e7df1bb0a5a6d5ca5a30bc8505e03973bbf42e45778aaae85e782dc5e0fbc6`.
* `blockReadsNoVelocityNoTopSpeed` **true**; the `.pos`, `mate.` and `body.` sets agree with the
  doc; `runRank` and `runnerCount` each exist in exactly two files of `src/**`.

### §R5 — THE READ

> ## THE FLIGHT RUN COSTS NOTHING THE BAND CAN SEE — IF-ENTRY is named (world 18 = 17 + the run onto the flight).

**Selected by the frozen rule at PRECEDENCE STEP (3) — *the band holds and R1 does not flood*** —
on the STORED selectors of the comparison of record (`OWNCOOP+IF-E13|OWNCOOP-E13`, E13, the seat
absent): `holdsBand` **true**, `breachingGuards` **[]**, `floods` **false**.
⭐ **THE LIVENESS PRECONDITION WAS MET**: `gBiteIF` is **GREEN**, so a read was selected and the
string *"THE SEAM DID NOT FIRE — no read"* was NOT stored. The word, the sentence, the step and
every selector are re-derived off the SERIALIZED artifact by `gFaces` / `gReadWords`; the sentence
is one of the four frozen literals and all five strings were cross-checked against BOTH homes at
run time (`gReadLiterals` GREEN).

**PRINTED BESIDE IT, from stored fields, with NO verdict word:**

* **THE HONESTY LINE** — *"nothing the band can see" is NOT "nothing the eye can see" — the user's
  gate at world 18 judges the eye.*
* **NO GUARD IS NAMED** — the breach set is EMPTY on the comparison of record **and on all three
  other pairs**. G9, the guard IF-T1 named, reads 5.486486 → **5.450450** here, Δ **−0.036036**
  [−0.223223, 0.149149] against a tolerance of **1.516003**, `absDeltaOverTolerance` **0.023770**,
  UNRESOLVED.
* **LIVENESS** — `gBiteIF` true; the eighth-`why` count on the candidate arm is **45.967968 per
  match** (45,922 over the battery); 999 of 999 seeds eligible, **999 of 999 ROWS differ**,
  0 exempt. (The full-time SIGNATURE also differs on all 999 — printed beside, gating nothing.)
* **R1** — 0.241767 → **0.288929**, Δ +0.047162 [0.042836, 0.051299] against a tolerance of
  0.066804; `beyondToleranceUp` **false**; `floods` **false**; the ratio **1.195072**
  [1.175962, 1.213609].
* **THE EIGHTH CLASS'S PARTITIONS** — START STATE: in the air **1.000000**, loose 0.000000;
  MEMORY: the last passer **0.450157**, another mate **0.549843**; ⭐ BY PHASE: `playing`
  **1.000000**; ⭐ BY LOOK DISTANCE: `distance1` **1.000000**. RESTRAINT: exactly 0 **0.706932** ·
  exactly 1 **0.291409** · between 0.001660. YIELD: **0.038808** shots per eighth-class episode.
* **THE YIELD PAIR (seventh · eighth)** — **0.049224** shots per own-run episode vs **0.038808**
  per eighth-class episode.
* **THE Q4 FACES WITH THEIR TWINS** — negative-Δt half **0.162958** (prior IF-T1 0.370729,
  ≈ IF-C0 0.039719); receiver started-during-flight **0.003005** (0.004754; ≈ 0.000021);
  intended-receiver share **0.000000** (0.000000; ≈ 0.000000); bodies already running at the
  release **0.676094** (0.869299; ≈ 0.644204); in-flight share of run starts **0.287682**
  (0.551466; ≈ 0.083077); the leak's `stalePasserStillCredited` **0.896442** (0.859069;
  ≈ 0.894186).
* **PER STATE (eighth-class runs per match)** — a mate on the ball 3.072072 · in flight
  42.895896 · **his own restart 0.000000** · other 0.000000.
* **THE OPEN-PLAY BOARD** — `openPlayBoardEmpty` share **0.999677** on the arm of record.

**THE COUNTERFACTUAL WORDS — STORED, NEITHER SELECTING:**

* **D13** (`OWNCOOP+IF-D13|OWNCOOP-D13`): word **`read1`** — *THIS PAIR SELECTS THE SAME READ*
  (`d13Agrees` true), `holdsBand` true, `floods` false.
* **THE HATS-vs-CANDIDATE GUARD TABLE** (`OWNCOOP+IF-E13|HATS-E13`): its own `holdsBand` word is
  **TRUE**, `floods` **false**, and the frozen rule applied to its stored interval gives
  **`read1`**. It selects nothing.

### §R6 — 在说人话的层面

限流做到了它该做的事：现在他真的是"看见球出脚才跑"，而这一版十条护栏**一条都没顶穿**。

* **上一版被顶穿的那条护栏回来了**：直塞球每场 **5.450450**，和对照组几乎一样，区间还跨着零。
* **跑动只多了一点**：每个有球 tick 从 0.241767 到 **0.288929**，落在容差里，没有 flood。
* **他记着的那个人，现在近一半就是刚传球的那位**（上一版只有不到两成），而且**死球起跑归零**。

⛔ 这一段没有一个褒贬词落在任何一张脸上；**唯一的判决是 §R5 那句冻结的读数**：这一步**表看不见
任何代价**，接下来由指挥官按那句话决定 IF-ENTRY。

---

## §HONEST LIMITS

**THE ONE HOME.** The artifact stores none of this list (`stage.honestLimitsNote`); its pointer
names THIS doc.

1. **"NOTHING THE BAND CAN SEE" IS NOT "NOTHING THE EYE CAN SEE."** The band is ten guards and R1.
   What it cannot see is the SHAPE of a run onto a flight — whether a body arriving onto a
   travelling ball looks like football. The user's gate at world 18 judges that; this exam does
   not, and read 1's own sentence names the ENTRY, not the verdict.
2. **THE READ IS A NEGATIVE, AND A NEGATIVE IS WEAKER THAN A POSITIVE.** `holdsBand` true means no
   limb resolved past tolerance on this block at N = 999 — not that nothing moved. G1 (goals) is
   the closest at 0.156 of its tolerance and is UNRESOLVED, and it is the one LOO-sensitive row.
3. **ONE LOO ROW CARRIES FLIPPING SEEDS, AND IT IS ON THE COMPARISON OF RECORD.** Of 40 LOO rows,
   exactly one has flipping seeds: **`guard.goalsPerMatch` on `OWNCOOP+IF-E13|OWNCOOP-E13`** — 59
   seeds whose removal would flip its RESOLUTION **upward** (stored in `loo[].looFlippingSeeds`).
   ⚠ That is a resolution flip, **not a breach**: even resolved, G1's |Δ| ÷ tolerance is
   **0.156090**, so it could not breach. **R1 and G9 on the comparison of record have ZERO
   flipping seeds.** Declared rather than buried, because IF-T1's one flipping row was on a beside
   pair and this one is not.
4. **THE PRIOR TWIN IS A TWIN, NOT A DIFFERENCE.** IF-T1's numbers were measured on THIS host and
   THIS architecture with the SAME recipe, so they are comparable in kind — but on a DIFFERENT
   BLOCK of seeds. **No paired Δ across the two blocks is computed, stored or claimed.** That the
   G9 breach is absent here and present there is two samples under two seams, and the honest
   statement is exactly that.
5. **`gRepro` DID NOT GATE AGAINST IF-C0 ON THIS HOST** (its numbers are arm64's), but ⭐ **IT DID
   GATE AGAINST IF-T1**, and that is the strongest reproduction receipt this arc has had: on the
   SAME architecture the two CONTROL arms reproduce IF-T1's stored `perSeedCells[]` with **ZERO
   mismatches over 224 compared fields × 6 arm-seed rows**. The candidate arm differs on **177
   distinct fields** (161 · 168 · 167 per seed) — **the seam changed, not the host**. The IF-C0
   rows are stored beside: `HATS-E13` 0 of 81 fields differ on all three seeds; `OWNCOOP-E13` 1
   field on two seeds and 51 on one — the same rows IF-T1 stored, and the architecture attribution
   stays a HYPOTHESIS (#144(a)).
6. **THE TWO NEW PARTITIONS ARE RECEIPTS, NOT FINDINGS.** `playing` 1.000000 and `distance1`
   1.000000 are what M-IF.5 and M-IF.6 make true by construction. They are stored and enumerated
   so a future reader can see the law held in the walk; ⛔ no read word, no gate and no stored
   boolean depends on either, and neither is narrated as a result.
7. **THE START-STATE PARTITION IS STILL 1.000000 "IN THE AIR", AND STILL A MEASUREMENT.** The
   seam's guard is `ownerGid === null`, which a STILL loose ball also satisfies; the partition says
   the ball he sees with no owner is MOVING every time. `|vel| > 0` gates nothing.
8. **THE RESTRAINT IS RECOVERED ONLY WHERE THE PRIOR IS NON-ZERO** (0.072722 of visible own-run
   candidates score 0 because their PRIOR is 0 — the DF clamp); that population is counted, never
   imputed. **THE BACK-OUT READS ONLY THE TOP FOUR** candidates the engine's record stores, so
   every seam and eighth-class share is a **FLOOR**.
9. **THE LEAK IS UNTOUCHED AND IS ONLY PRINTED** (`stalePasserStillCredited` 0.896515 control,
   0.896442 candidate) — contract §4's non-claim: honest perception, printed, fixed nowhere. ⭐ It
   is the one Q4 face the amended seam did NOT move, which is what "unchanged by construction"
   should look like.
10. **THE INTENDED-RECEIVER SHARE IS STILL ZERO ON EVERY ARM** — the seam gives him the STATE, not
    a target; the passer still does not aim at a body running onto the flight. FIXTURED, so the
    zero is a measurement.
11. **ONE BLOCK, ONE COMPOSITION, ONE ARCHITECTURE.** Every number here is world 13 (empty-book)
    and world 13 (the played book) at THIS head, at N = 999 seeds, on x64.
12. **THE OBM SEAT IS ABSENT EVERYWHERE.** This exam prices the flight run **without eyes**.
13. **NO GATE MEASURES QUALITY.** Every green gate is a liveness or a receipt. A held band says no
    guard resolved past tolerance; it does not say the football got better.

---

## §DEVIATIONS (declared by the executor; the commander disposes)

1. **N = THE AFFORDANCE, NOT THE LITERAL `min()`** — the #414 §CORR 8 floor reading, applied. The
   two sizing rows resolve at n = 5 and n = 8, so the literal minimum is 8; **this stage walked
   999**, the block's affordance after the construction receipt. Reason: a 12-cluster variance
   estimate is noisy and the faces this exam carries are rare events with small per-seed counts.
   REALISED half-widths at N: R1 **0.004232** (projected 0.002472), the negative-Δt half
   **0.003421** (projected 0.002972) — both realised WIDER than the projection, which is exactly
   why the floor reading was taken.
2. ⚠ **`gRepro` AGAINST IF-C0 DID NOT GATE — IT STORED** (by construction, not by choice: this host
   is x64 and every IF-C0 number is arm64). ⭐ **BUT THE NEW SAME-ARCHITECTURE RE-WALK DID GATE**
   and is GREEN: 224 fields × 6 control arm-seed rows, ZERO mismatches against IF-T1's stored rows.
   The candidate arm's 177 differing fields are STORED and enumerated, never gated.
3. **THE EIGHT CORRECTIONS OF #421 ITEM 4 WERE APPLIED AT THE FREEZE**, each inside §P: (i) the
   precedence and reads notes re-written to the three-read rule; (ii) both seed notes re-written to
   name all sixteen consumed blocks and this frontier; (iii) `stage.xSrcZero` names no spy;
   (iv) the cross-architecture rows named `repro.rows` in code, doc and ruling; (v) `r1.what` and
   the tolerance-form strings name `OWNCOOP-E13` as the control; (vi) |Δ| ÷ tolerance STORED as
   `absDeltaOverTolerance` on every guard and R1 row; (vii) the `gRepro` attribution stated as a
   hypothesis, not a fact; (viii) `gFacesDetail`'s exclusion from the hashed body STATED in both
   the `gHashOrder` note and the `receipts` note. ⭐ **AND THE CLASS WAS TURNED INTO A GATE**:
   `gInheritedProse` enumerated **8,638** prose fields inside the hashed body with **0 failing**.
4. **THE INHERITED `theTwoDoses` SENTENCE WAS RE-WRITTEN, NOT DELETED.** It described DS-T1c's two
   hand-set OBM matrices as though this exam carried them; it now says plainly that there are none
   here and that the only doses anywhere are the shipped L3 / PC loaders on the two D13 arms. This
   is a NINTH string in the #421 item 4 class, found by re-reading rather than by a token — the
   gate catches the eight known shapes, the re-read caught this one.
5. ⚠ **`ifLook`'s ZERO IN `a4World.ts` IS CARRIED BY ITS ANCHOR, NOT BY `codeFacts`.** The
   `codeFacts.a4WorldCountsAtThisHead` block is IF-T1's shape and lists five names; the look
   counter's literal-zero claim is enforced by ANCHORED SITES (count 0 over `a4World.ts` and over
   `actionExecutor.ts`) and by `gAnchoredConstants`, which is RED if either count moves. Declared
   so the commander does not have to find it.
6. **THE ONE DECLARED ADDED READ.** This instrument pulls `match.perceivedSnapshot(p)` once per
   own-run start tick on the arms carrying `dsOwnRun`. It is INERT and `gPullCount` proves it:
   added pulls 0 / 77 / 96 / 78 / 127 / 0 / 47 / 78 / 79 / 101 across the ten spied pairs, EQUAL to
   the instrument's own stored count on every one, with the whole-match signatures equal and the
   wrapped observed signature equal to the unwrapped lockstep walk's.
7. **THIS INSTRUMENT INSTALLS NO WRAPPER ON ANY WALKED MATCH.** `gArmIF` needs no spy; the only
   wrapper anywhere is `gPullCount`'s counter on throwaway matches at out-of-band scratch seeds.
8. **THE EIGHTH-`why` TOTALS DIFFER BY THE RECEIPT.** `armIf.rows[].eighthWhyDecisions` counts the
   battery **plus the construction receipt** (45,963 on the arm of record); the FACE
   `ifRun.decisionsPerMatch` is over the 999 battery seeds alone (45,922 ⇒ 45.967968 per match).
   Both are stored; the read quotes the face.
9. **ONE LOO ROW CARRIES FLIPPING SEEDS AND IT IS ON THE COMPARISON OF RECORD** (§HONEST LIMITS 3)
   — `guard.goalsPerMatch`, 59 seeds, all UP, stored. It is a RESOLUTION flip and not a breach
   (0.156 of tolerance).
10. **THE G10 OFFSIDE FLAG IS TRUE ON THE D13 PAIR ALONE** (Δ +0.141141, resolved), false on the
    three E13 pairs. G10 flags and gates nothing; declared so the commander sees it.
11. **THE TWO RE-WALK BANDS ARE OTHER STAGES' OWN CONSUMED BLOCKS** (`12,558,000–002` IF-C0's,
    `12,559,000–002` IF-T1's) and are NOT a consumption — canon's verifier-scratch rule.
12. **THE COMMIT SITS ON `main`** — the programme's convention. Nothing is pushed.

---

## §GATES — 28 of 28 GREEN (`allGreen` = **true**, a STORED boolean)

| gate | verdict | the note derives from |
| --- | --- | --- |
| `gWorld` | ✅ | the FOUR flags exactly as due per arm on every walked match + the construction receipt; `obmMovement` FALSE and NO matrix anywhere (rule (h)); `info.genome` clean; **both** maps PRESENT-AND-EMPTY on the world pin at `900,008,870` |
| `gArmIF` | ✅ | the eighth-`why` count EXACTLY 0, the belief map EMPTY **and the look counter EMPTY** on all three arms without the door, on all 999 seeds + the receipt + two construction walks; NON-VACUOUS on the two that carry it (45,963 / 67,831 decisions; 9,989 belief and 9,989 / 9,990 look entries) |
| `gArmCoop` | ✅ | `overlapSets` / `wallFires` live on `HATS-E13` (3.159159 / 10.518519 per match) and 0 / 0 on every arm carrying `dsCoopHatsOff` — a stored check of construction |
| `gReadLiterals` | ✅ | all FIVE frozen strings (three reads, the fallback, the liveness string) found in BOTH homes on normalised prose; no asymmetry to declare |
| `gDoseSource` | ✅ | the L3 / PC dose FILE BYTES hashed and equal to the pins of record |
| `gAnchoredConstants` | ✅ | **181** anchored sites, every one at its declared occurrence count — including IF-T0b's four alias lines, the look-counter increment, the freshness expression, the amended state test, the eighth literal, both maps' fields and inits, the League union key, the arch-keyed fingerprint pair, and the **three** ZERO-count anchors over `a4World.ts` |
| `gPredicateFixtures` | ✅ | **269** fixtures, each predicate with a firing and a non-firing case — incl. the TENTH cell, the start-state, memory, ⭐ PHASE and ⭐ LOOK-DISTANCE partitions, IF-C0's Δt bins at every boundary from both sides, the receiver class, the leak partition, and the INTENDED-RECEIVER predicate |
| `gLedgerRead` | ✅ | the engine's own records read where they exist; ⭐ **`match.ifLook` REGISTERED HERE (registry 87 → 88)** beside `match.ifLastSeenOwnerGid` (registered at IF-T1), both READ and never written, both live on the door-carrying arms and EMPTY on the rest |
| `gClassesNonVacuous` | ✅ | every class a read stands on is live; the tenth cell non-vacuous on both candidate arms (**this IS `gBiteIF`'s non-vacuity, stored once**); the empty classes and coupling counters ENUMERATED |
| `gCodeFactGraph` | ✅ | 5 hashed roots with extracted callees; 6 `MakeRun` pushes classified; 5 read forks equal on text + file + LINE; ⭐ the **SEVEN**-member read set equal to §LAW-B 2's sentence; the FOUR aliases the FIRST FOUR statements inside the fork and CONSECUTIVE; the belief's and the look counter's one read + one write site each |
| **`gInheritedProse`** | ✅ | ⭐ **THE NEW GATE**: **8,638** prose fields enumerated inside the hashed body, each with its declared source key and a MEASURED re-read boolean against NINE frozen stale tokens; **0 failing** |
| **`gBiteIF`** | ✅ | the **#414 ROW form**: 999/999 eligible seeds' ROWS differ on all three door-carrying contrasts, 0 exempt; the full-time SIGNATURE comparison (999/999) printed beside and gating nothing; non-vacuity 45,922 eighth-`why` decisions |
| `gRepro` | ✅ | **two re-walks**: (a) x64 vs IF-C0 — *"≈ cross-architecture (stored, not gated)"*, 81 fields × 6 rows STORED; (b) ⭐ **SAME-ARCHITECTURE vs IF-T1 — GATED on the control arms: 224 fields × 6 rows, ZERO mismatches**; the candidate arm's 177 differing fields STORED and enumerated |
| `gPullCount` | ✅ | 10 spied pairs; the added pulls EQUAL the instrument's own stored count on every one, ZERO on `HATS-E13` and positive on every armed arm; signatures equal; the wrapper transparent |
| `gLockstep` | ✅ | 10 arm × scratch walks, observed ≡ unobserved byte for byte |
| `gDeterminism` | ✅ | X-DET twice per arm on both scratch seeds; signatures and row bytes identical |
| `gFingerprintProd` | ✅ | **ARCH-KEYED**: on x64 `59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d` recomputed in-process, UNCHANGED (#418 item 1's value of record) |
| `gSrcUntouched` | ✅ | `git diff --stat HEAD -- src` / `-- tests` and `git status --porcelain` all EMPTY — X-SRC-ZERO |
| `gSeedsBookedEqualWalked` | ✅ | 999 distinct battery seeds inside the block + the receipt at `12,560,999`; 5,000 walks booked = walked; the tail is `null` |
| `gSeedDisjoint` | ✅ | every battery seed ≥ 12,560,000; all **sixteen** consumed blocks end below this base; both re-walk bands lie inside their own stages' blocks |
| `gN` | ✅ | no override env; the battery ran at exactly N_FROZEN = 999 × 5 arms |
| `gLoo` | ✅ | 40 rows; every flipping row's seeds STORED (§HONEST LIMITS 3) |
| `gScratchBand` | ✅ | all 19 scratch seeds derived from the ONE base `900,008,800` and inside `[900,008,800, 900,008,899]`; the out-of-band list EMPTY; disjoint from the battery block both ways |
| `gTwoFractions` | ✅ | **35** read-bearing quantities published in BOTH fractions |
| `gFaces` | ✅ | **3,411** face-and-Δ checks and **221** stored-bin / median / top-bin-share / partition / R1 / GUARD / READ-WORD / sizing checks re-derived off the SERIALIZED artifact, 0 failing |
| `gReadWords` | ✅ | `floods`, every guard row's harmful-direction test AND its `breachDirection`, `holdsBand`, the selected read, **the liveness precondition**, the precedence step, both counterfactual words and the agreement word re-derived off disk |
| `gHashOrder` | ✅ | the 50-key allowlist schema (⚠ #424 §CORR 2: the doc had typed 49) complete; the body hash computed LAST; `receipts.hashReproducesFromFile` **true**; `gFacesDetail`'s exclusion from the body STATED |
| `gStage` | ✅ | `stage.instrument` is this instrument's own path and `stage.instrumentSha256` is the sha256 of the RUNNING file re-read from disk |

**THE ARTIFACT** — `docs/world-model/data/if-t1b-flight-run-exam.json`:

* bytes **36,802,586**
* `fileSha256` **`da5c1a6b986e8767a7f46204b17081deab145fde51e48632cee44a1b3eecf26f`**
* `hashedBodySha256` **`21974e02235f940576b3b3ff5aa757c4faa8975a8525007fca74c775a90f7aa2`**
* `stage.instrumentSha256` **`4366e7fe38237c73d5992f695cc6b87d396198f49eb6cdde089fbe7758b8af8e`**
* `receipts.hashReproducesFromFile` **true**
* `perf.batteryWallSeconds` **3,148.947** · `perf.meanWallSecondsPerMatch` **0.551093**
* `stage.hostArchitecture` **x64**

**CONSUMPTION.** Block `12,560,000–999` consumed whole (999 battery seeds + the construction
receipt at `12,560,999`). Scratch `900,008,800–899` (executor). ZERO stats:
`stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 88 }`. Next sim ≥ **12,561,000**.

## §COMMANDER CORRECTIONS (ruling #424 — the rerun BANKED, THE READ OF RECORD read 1; verifier PASS, zero HIGH; two MEDIUM and one LOW disposed in place; §P and the instrument untouched; the artifact FROZEN and NOT edited)

1. **MEDIUM — FIFTEEN FACE ENTRIES CARRY IF-T1's REGISTRY SENTENCE.** `ifStart.memoryShare.*` on each of the
   five arms says "read off `match.ifLastSeenOwnerGid` (THE ONE NEW REGISTERED LEDGER READ, registry 87)" —
   inherited unchanged from `if-t1-flight-run-exam.ts`; this exam's `stats.registryOfRecord` = 88 and
   `gLedgerRead` names TWO reads (`match.ifLook` registered here). `gInheritedProse`'s nine frozen tokens did
   not match the wording — a token list is a list-shaped blind spot (the lesson's SECOND strike, now canon:
   inherited prose is re-read by DIFF against the source instrument). The numbers on those faces are right;
   the sentence is stale. Corrected here; the artifact is left as written.
2. **MEDIUM — ONE HAND-TYPED NUMBER IN §GATES.** The `gHashOrder` row said "the 49-key allowlist schema";
   `receipts.bodySchemaKeys` = 50, `BODY_SCHEMA` has 50 entries, the gate note says 50, and the verifier's own
   50-key hash reproduces `hashedBodySha256`. The row now reads 50.
3. **LOW — `gInheritedProse`'s OWN NOTE IS THE ONE PROSE FIELD IT DOES NOT WALK.** The enumeration runs before
   the gate object is written, so `gates.gInheritedProse.note` is absent from `inheritedProse` (8,639 walked by
   the verifier vs 8,638 stored; the single differing path is that note). The note's claim "this note … is
   scanned with the rest" is false by one field; nothing else differs.
