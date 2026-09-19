# IF T1b — 「球在飞时的前插 · 复考」 THE FLIGHT RUN'S RE-EXAM

Status: **FROZEN — §0 through §DEV-PREFLIGHT are sealed at the FREEZE commit and are NOT edited
after sight.** The battery has not been walked at this commit; §R is appended at the RESULTS
commit on the byte-identical instrument, and only the Status paragraph above moves.
THE ARTIFACT WILL SIT AT THE CANONICAL PATH `docs/world-model/data/if-t1b-flight-run-exam.json`
(a RED run routes it to `…json.RED.json` and this paragraph then names the actual path).
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
