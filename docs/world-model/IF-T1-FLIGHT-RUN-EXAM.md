# IF T1 — 「球在飞时的前插 · 考」 THE FLIGHT RUN'S EXAM

Status: **WALKED — the battery is complete, 27 of 27 GATES GREEN (`allGreen` = a STORED `true`)
and THE READ IS PRINTED AT §R5.** §0 through §DEV-PREFLIGHT were sealed at the FREEZE commit
`ff34357` and were NOT edited after sight; the instrument is byte-identical between FREEZE and
RESULTS (`git diff ff34357 -- scripts/probes/if-t1-flight-run-exam.ts` EMPTY).
THE ARTIFACT IS AT THE CANONICAL PATH `docs/world-model/data/if-t1-flight-run-exam.json` (the
red-routing idiom did not fire).
X-SRC-ZERO holds throughout: not one byte under `src/` or `tests/` is created or edited.
**NOTHING SHIPS** — `ifFlightRun` stays default-OFF, named by no world, and the production
fingerprint is unchanged (`gFingerprintProd` GREEN on the x64 column of record). The commander
rules.

Authority: **COMMANDER RULING #420 item 2** (the dispatch — the five arms with the OBM seat
ABSENT throughout, the comparison of record, the faces including the TENTH classifier cell and
IF-C0's Q4 faces by field name, the THREE frozen reads with their precedence and the liveness
precondition, the gate set with `gBiteIF` · `gArmIF` · the architecture-aware `gRepro`, the
seeds), standing on **#420 item 1** (IF-T0 BANKED-DORMANT — the facts of record), on **#419
item 3** (the remembered passer ranks as a competitor: ACCEPTED AS THE LAW) and on **#418 items
1–2 and 5** (THE HOST CHANGED ARCHITECTURE; the architecture-keyed digest law). It INHERITS
**#413 item 5** (DS-T1d's specification — the FORM this exam is built in) and, through it, #410
item 3 and #406 item 5. **#414 item 4(ii)'s FAMILY NOTE** supplies `gBiteIF`'s ROW form.

* THE SEAM UNDER EXAM (read, never touched):
  [`IF-T0-FLIGHT-RUN-SEAM.md`](IF-T0-FLIGHT-RUN-SEAM.md) §LAW · §HONESTY · §SEAM · §PINS.
* THE SWITCH UNDER IT: [`DS-T0-OWN-RUN-SEAM.md`](DS-T0-OWN-RUN-SEAM.md) §LAW-C · §SWITCH-D.
* THE FORM: [`DS-T1D-COOP-HATS-EXAM.md`](DS-T1D-COOP-HATS-EXAM.md) §0–§P and its
  §COMMANDER CORRECTIONS + `scripts/probes/ds-t1d-coop-hats-exam.ts`.
* THE Q4 FACES COPIED BY FIELD NAME:
  [`IF-C0-FLIGHT-RUN-CENSUS.md`](IF-C0-FLIGHT-RUN-CENSUS.md) +
  `scripts/probes/if-c0-flight-run-census.ts`.
* CONTRACT: [`IF-FLIGHT-RUN-CONTRACT.md`](IF-FLIGHT-RUN-CONTRACT.md) §1 C-IF.1–4 · §2 M-IF.1–4 ·
  §3 IF-T1 (the three frozen reads) · §4 the non-claims · STATUS #420.
* INSTRUMENT: `scripts/probes/if-t1-flight-run-exam.ts`.
  ARTIFACT: `data/if-t1-flight-run-exam.json` (the RESULTS commit writes it; a RED run routes it
  to `…json.RED.json` and the Status paragraph then names the actual path).

---

## §0 — WHAT THIS IS AND WHY

**THE QUESTION (#420 item 2, not re-argued here): with world 17's door set in place, what does
the RUN ONTO A BALL ALREADY TRAVELLING — the player's own run priced in a state the engine has
never had — produce that R1 and the band can see?**

### The arc's readings so far, QUOTED BY FIELD

Every sentence below is read out of the named artifact's own field; ⛔ not one of them is typed
by hand in the instrument (it stores them under `hNumbers.theArcQuotedByField`).

| stage | field | the frozen literal it selected |
| --- | --- | --- |
| DS-T1c | `reads.selected` = `read1` | *"THE HAT CAN COME OFF — the player's own run holds the band without the coach and without eyes; DS-ENTRY is named: world 16 = world 15 + the own run with the open-play hats off."* |
| DS-T1d | `reads.selected` = `read1` | *"THE COOPERATION HATS PRODUCE NOTHING THE BAND CAN SEE — they come off: DS-ENTRY-2 is named (world 17 = 16 + the cooperation hats off)."* |
| DS-ENTRY-2 | — | world 17 CUT and OPEN; the user's gate 「配合帽子摘了 (v17) — keep \| change \| revert」 stands. |
| IF-C0 | the census of record | the four numbers below, quoted by field. |

### IF-C0's own numbers, QUOTED BY FIELD — and ⭐ EVERY ONE OF THEM IS AN **arm64** NUMBER

Read out of `data/if-c0-flight-run-census.json`'s `faces[]` at `face@arm`, on IF-C0's arm of
record `OWNCOOP-E13` with `HATS-E13` beside. ⭐⭐⭐ **#418 items 1–2: this exam runs on an x64
host and reproduces none of them.** They are printed here, and stored beside every twin face of
this exam under `approx.ifC0`, with the stamp **"≈ cross-architecture"** — **PRINTED, NEVER
SELECTING.** The exact comparator for every face of this exam is **its own control arm**,
walked here, on this architecture, on this block.

| IF-C0 field | `OWNCOOP-E13` (arm64) | `HATS-E13` (arm64) |
| --- | --- | --- |
| `receiver.classShare.startedDuringTheFlight` | **0.000021** (1 / 46,609) | **0.000021** (1 / 47,184) |
| `dt.negativeShare` | **0.039719** (3,151 / 79,333) | **0.004264** (605 / 141,902) |
| `run.inFlightShare` | **0.083077** (6,699 / 80,636) | **0.027587** (3,974 / 144,052) |
| `flight.intendedReceiverShare` | **0.000000** (0 / 3,166) | **0.000000** (0 / 614) |
| `release.runnersAtReleaseMean` | **0.644204** | **1.176840** |
| `leak.cellShare.stalePasserStillCredited` | **0.894186** (2,476 / 2,769) | — (0 / 0) |

### The seam under exam, named as IF-T0 named it

* **THE SECOND DOOR** `match.ifFlightRun` — default OFF, ABSENT ≡ FALSE, named by NO world,
  living INSIDE the own-run fork (#419 item 2's repair: its alias is the FIRST executable
  statement inside `if (match.dsOwnRun) {`, `PlayerBrain.ts:2221`).
* **THE BELIEF** `match.ifLastSeenOwnerGid` — ONE per-body memory of who he LAST SAW with the
  ball, created EMPTY, written only under the door, from the snapshot the fork already pulled.
  **⭐ THIS EXAM'S ONE NEW REGISTERED LEDGER READ (registry 86 → 87)**: read, never written.
* **THE EIGHTH STATE** (M-IF.1) — the ball he SEES has NO owner **and** the owner he REMEMBERS
  resolves on the ROSTER to a same-side mate who is not him. Identity tests only.
* **THE EIGHTH `why`** `'own run onto the flight'` — a RELABEL of the SAME candidate at the SAME
  score (M-IF.3). It is EXTRACTED from the seam's own line here, never typed.
* **THE LAW #419 item 3 ACCEPTED**: in the eighth state `ownerGid === null`, so the rank loop
  skips NOBODY and the body he REMEMBERS with the ball is ranked like any mate. **This exam
  prints that consequence as the eighth class's own RESTRAINT PARTITION.**

### The contract refuses every reading until this exam measures

`IF-FLIGHT-RUN-CONTRACT.md` §1 C-IF.4, VERBATIM: *"Whether the flight run pays, floods, or is
chosen by selection is a QUESTION FOR MEASUREMENT (IF-T1); nothing ships before the commander
rules on it."*

### ⭐⭐⭐ THE HONESTY LINE, printed beside EVERY read

> **"nothing the band can see" is NOT "nothing the eye can see" — the user's gate at world 18
> judges the eye.**

It is stored as `reads.honestyLine`, re-derived off the serialized artifact by `gFaces`, and
printed on the first annotation line of every read. The band is ten guards and R1; it cannot see
the SHAPE of a third-man run, the TIMING of a spin off the shoulder, or a picture the user would
miss.

---

## §P — THE FROZEN PROTOCOL

Frozen **before** the battery, inherited from DS-T1d section by section, with **each change
marked ⭐ AMENDMENT**. ⛔ Not edited after sight.

### §P.1 — THE ARMS: FIVE, THE OBM SEAT ABSENT THROUGHOUT

⭐ **AMENDMENT (#420 item 2(i)).** DS-T1d's SIX arms become **FIVE**, and the axis under exam
moves from the cooperation hats to the flight door. **NO DOSE IS PLACED ANYWHERE.**

| arm | world | flags | the OBM seat |
| --- | --- | --- | --- |
| `HATS-E13` | 13 empty-book | none | ABSENT |
| `OWNCOOP-E13` | 13 empty-book | `dsOwnRun` + `dsHatsOff` + `dsCoopHatsOff` — **world 17's own door set. THE CONTROL.** | ABSENT |
| `OWNCOOP+IF-E13` | 13 empty-book | the same **+ `ifFlightRun`** — **THE WORLD-18 CANDIDATE. THE ARM OF RECORD.** | ABSENT |
| `OWNCOOP-D13` | 13 DOSED (the shipped loaders' played book) | world 17's door set | ABSENT |
| `OWNCOOP+IF-D13` | 13 DOSED | the same + `ifFlightRun` | ABSENT |

* `HATS-E13` is **DS-C0's `buildMatch(seed, 'E13')` byte for byte** and is IF-C0's own
  `HATS-E13`; `OWNCOOP-E13` is IF-C0's own `OWNCOOP-E13`. That identity is what makes `gRepro`
  possible on TWO arms.
* The composer `a4MatchFlags(13)` is **CALLED**, never copied; the doors are set by this exam's
  OWN construction (IF-C0 §P.A's form). `gWorld` proves every arm's flag set — **now FOUR flags,
  `ifFlightRun` included** — on every walked match and on the construction receipt, and the
  world pin repeats it on a constructed match of each arm at `900,008,470`.
* ⛔ **RULE (h) — NO DOSE**, inherited whole: `obmMovement` is never set, no 16-slot matrix is
  written to `baseGenome` or `effGenome`, `info.genome` is untouched, and DS-T1c's dose
  machinery stays REMOVED. `gWorld` asserts `obmFlag === false` ∧ `matrixOnBaseEff === false` ∧
  `infoGenomeCleanOfMatrix` on every walked match; the artifact's `noDose` block declares it.

**THE CONTRASTS.** A contrast is a **PAIR**, not an arm.

| contrast id | what it is |
| --- | --- |
| `OWNCOOP+IF-E13\|OWNCOOP-E13` | ⭐⭐⭐ **THE COMPARISON OF RECORD.** CONTROL = **world 17's own door set**. The reads stand on this pair and no other. |
| `OWNCOOP+IF-E13\|HATS-E13` | printed BESIDE, **HATS as its control** — world 13 as shipped against the world-18 candidate. STORED, COUNTERFACTUAL, NEVER SELECTING. |
| `OWNCOOP-E13\|HATS-E13` | DS-T1d's own comparison of record, re-walked on THIS block and THIS architecture. |
| `OWNCOOP+IF-D13\|OWNCOOP-D13` | the D13 counterfactual; its word is stored and NEVER selects. |

### §P.2 — THE WALKER, THE INHERITED DEBTS, AND THE FIXTURES

The walker is DS-T1d's, unchanged: public `Match` / `Team` / `Player` / `Ball` state and the
engine's own decision record (`p.action.scores`) read BEFORE and AFTER `match.step(DT)`, with
**no wrapper on any walked match**. `gLockstep` proves observed ≡ unobserved byte for byte per
arm; `gDeterminism` (X-DET) walks each scratch seed twice per arm.

⭐ **AMENDMENT — THE ONE DECLARED ADDED READ (IF-C0's own form, inherited).** At an **own-run
decision tick** (the SEVENTH or the EIGHTH class) on an arm carrying `dsOwnRun`, the instrument
pulls `match.perceivedSnapshot(p)` **ONCE**, to publish (a) IF-C0's LEAK PARTITION and (b) the
EIGHTH class's START-STATE partition. The pull is **INERT** — the snapshot is reconstructed from
truth, draws no rng and mutates nothing — and that is PROVEN, not asserted: `gLockstep` shows
the whole-match signature byte-identical either way, and **`gPullCount` asserts that
observed − unobserved EQUALS the instrument's OWN stored pull count on every spied pair, ZERO on
the arms without `dsOwnRun` and POSITIVE on the arms that carry it.**

⭐ **AMENDMENT — DS-T1d's ACCESSOR SPY IS REMOVED.** G-ARM-COOP is not in this exam's gate set;
`gArmIF` replaces it and needs no spy. **This instrument installs NO wrapper at all** except
`gPullCount`'s own counter on throwaway matches.

**THE THREE DS-T1 DEBT PAYMENTS ARE KEPT PAID**, restated: (a) the decision-tick predicate reads
`pcLatency`'s own holds map **AFTER** the step at the tick the decide loop used, with DS-C0's
PRE-STEP form recomputed beside it and both calibrated against the engine's own
`pcLatency.ledger.decisionsHeld` delta; (b) the shooter gid is banked **AT THE SHOT'S PUSH**;
(c) the episode-tick bins run **past one full `wallRun` licence** (DERIVED from the licence's own
`2.3` s and `DT`, never typed) and **every bin-derived median is published WITH ITS TOP BIN'S
SHARE beside it**.

**THE FIXTURES.** Every walk-side predicate is stated with a case where it FIRES and one where it
does NOT (`gPredicateFixtures`, **255** of them), including this stage's new ones: the TENTH
classifier cell and its negatives (an EDITED eighth literal lands in `OTHER`); the eighth class's
START-STATE and MEMORY partitions, every cell with a negative; IF-C0's Δt bins at every boundary
from both sides; the receiver class; the perceived-owner cells and the leak partition; the
five-arm table and its flag kinds; the contrast table with a self-contrast caught; the belief's
ONE read site and ONE write site in all of `src/**`; and ⭐⭐⭐ **THE INTENDED-RECEIVER PREDICATE
— FIXTURED**, the census's one unfixtured predicate (#416 item 3(i)), with IF-T0's own FIRING
and NON-FIRING `it()` titles ANCHORED in the instrument so the citation cannot drift.

### §P.3 — R1, THE FLOOD FACE

**R1 = EXECUTED runs per IN-POSSESSION OPEN-PLAY TEAM-TICK**, DS-T1d's predicate byte for byte.
Per team, per stepped tick: `match.possessionSide === team.side` · `match.phase === 'playing'` ·
the team carries NO live `cornerCrash` and NO live `crossFlight` (both read off the engine's own
held-licence clocks at the end of the tick). THE COUNT is of OUTFIELD BODIES (not the keeper, not
sent off) whose `p.action.type` is `MakeRun` — **the bodies, not the board**. Frozen bins
0 · 1 · 2 · 3 · 4 · 5 · 6+, the mean, and the **≥ 3 share**.

⭐ **AMENDMENT — THE CONTROL.** On the comparison of record the control is the **world-17 arm**,
so the tolerance is `NI_FRACTION · |OWNCOOP mean|` by the house form (`NI_FRACTION =
1 − 0.275/0.380`, inherited BY ANCHOR from `ctb-t1-supply-exam.ts`'s own line, cross-read from
`dlc-t1-choice-exam.ts`, and EVALUATED from its two numerals — never typed as a decimal).

`floods(contrast)` = the paired Δ of R1's mean is **RESOLVED** (the 95 % cluster-bootstrap
interval over 2,000 draws excludes zero) **AND UP AND beyond the tolerance**. Its one-sided
column is named **`beyondToleranceUp`**; the two-sided companion
`absDeltaBeyondToleranceEitherWay` is stored beside it. The **ratio** candidate ÷ control is
published with its own cluster-bootstrapped interval — printed, never judged. **LOO** is off the
`loo` array and **every flipping row's seeds are STORED**.

### §P.4 — THE BAND (F-DS-b)

Ten limbs, per contrasted pair, inherited unchanged. A **BREACH** = the paired Δ is RESOLVED
**AND** beyond the tolerance **IN THE HARMFUL DIRECTION**. `holdsBand(contrast)` = NO breach
among G1–G9. G10 is the #157 **FLAG** limb: it flags and gates NOTHING.

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

Every breach carries **ITS DIRECTION** (`breachDirection` ∈ {`UP`, `DOWN`, `none`}) and the
**breach set with directions** is a stored array per contrast.

### §P.5 — THE FACES (published on EVERY arm; ⛔ NO VERDICT WORD on any of them)

**Populations A–C, inherited from DS-T1d**, and **the seam's own faces** (the restraint's share
exactly 0 and exactly 1, `priorZeroShare`, `rankBelowCount` with its declared equivalence, the
`count` shares, the perceived-owner guard's pass share as a FLOOR, the in-flight / restart own-run
shares), **the coupling faces** (DS-C0's, by field name) and **the crowding family** (OBM-T1's,
`spacingUnder4` included), and the **per-state line**.

⭐⭐⭐ **AMENDMENT — THE NINE-CELL CLASSIFIER BECOMES TEN.** The EIGHTH `why` is **its own class,
`ownRunOntoFlight`**, read off the engine's own decision record; DS-C0's EIGHT-cell MIRROR sits
beside it byte for byte (the eighth lands in its `OTHER`, as it does in every frozen
seven-literal classifier — contract §4, declared at IF-T0). The eighth literal is **EXTRACTED**
from the seam's own relabel line, never typed.

⭐⭐⭐ **AMENDMENT — THE TENTH CELL'S THREE PARTITIONS** (#420 item 2(ii)):

* **ITS START STATE** — read off the runner's OWN perceived ball at the start tick: the ball he
  sees **loose** · **in the air** (`|vel| > 0` — ⚠ **a STORED PARTITION, NOT A GATE**: no read
  word and no stored boolean depends on it) · and, off `match.ifLastSeenOwnerGid`, his memory's
  owner = **the last passer** · = **another mate** · **no memory**. The engine's own truth state
  at that tick is stored beside.
* **ITS RESTRAINT** — the SAME back-out taken on the candidate carrying the EIGHTH `why`:
  **exactly 0** · **exactly 1** · **between** (a float receipt the rank law predicts is 0).
  **The remembered passer is counted in `rankAbove`** — #419 item 3's own face.
* **ITS YIELD** — the own-run yield family off the engine's ledgers (aimed · completed · through
  · shots · goals per episode), printed **beside the seventh's**, and split by the engine's own
  truth state so the in-flight yield can be read against the at-feet one.

⭐⭐⭐ **AMENDMENT — IF-C0's Q4 FACES AS FACES, COPIED BY FIELD NAME**, each with its **≈
CROSS-ARCHITECTURE TWIN** under `approx.ifC0`: `dt.negativeShare` (with its seven frozen Δt bins
and IF-C0's own ATTACHMENT RULE) · `receiver.classShare.startedDuringTheFlight` ·
`flight.intendedReceiverShare` (**now FIXTURED**) · `release.runnersAtReleaseMean` with its bins
(same-side bodies already running at the release) · `run.inFlightShare` · the LEAK partition
`leak.cellShare.stalePasserStillCredited` (⛔ **UNCHANGED BY CONSTRUCTION** — contract §4 keeps
the leak as honest perception; PRINTED, never fixed) · and the in-flight own-run yield vs at-feet.

### §P.6 — THE READS (#420 item 2(iii)'s literals, FROZEN EX ANTE)

Copied **CHARACTER FOR CHARACTER** from ruling #420 item 2(iii) and cross-checked at run time
against `IF-FLIGHT-RUN-CONTRACT.md` §3 — **all three homes must agree byte for byte**
(`gReadLiterals`, on normalised prose). ⚠ **THERE IS NO ASYMMETRY TO DECLARE this round**: #420
copied the FALLBACK and the liveness string into the contract too, so **every** literal is
REQUIRED in **every** home and a miss is RED.

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
precedence step that selected is itself a stored string and is re-derived off the serialized
artifact.

**PRINTED BESIDE the read**, from stored fields, with NO verdict word: the honesty line; the R1
ratio with its interval; **the eighth class's count per match and its three partitions**; the
yield pair (seventh · eighth); **the Q4 faces with their ≈ twins**; D13's word and the
HATS-vs-candidate guard table with its own `holdsBand` word — STORED counterfactuals, **NEITHER
SELECTING**.

### §P.7 — SEEDS AND SIZING

* **Block `12,559,000–999`**, verified fresh against the consumed list (LN-C0 12,544,000–999 …
  DS-T1c 12,556,000–999 · DS-T1d 12,557,000–999 · IF-C0 12,558,000–999), each checked to end
  BELOW this block's base. Battery seeds `12,559,000–12,559,998`; **construction receipt
  `12,559,999`**. BOOKED = WALKED: 999 seeds × 5 arms + 5 receipt walks = **5,000 walks booked**.
* **N.** Sized by the DISCLOSED 12-seed smoke on `900,008,400–411` (five walks per seed) with the
  house form at a declared **0.05 half-width** on R1's paired Δ (the candidate vs world 17, E13)
  and on the **NEGATIVE-Δt HALF's** paired Δ on the same pair — see §DEV-PREFLIGHT for both rows.
  **N = min(required, the block's affordance) is TAKEN AS THE AFFORDANCE**, and §DEV-PREFLIGHT
  says so plainly.
* **SCRATCH, all inside the DECLARED BAND `900,008,400–499`, derived from ONE base**: the sizing
  smoke `400–411`, the smoke receipt `420`, **`gArmIF`'s construction walks `440–441`**, the
  world pin `470`, the lockstep pair (X-DET and `gPullCount` re-use it) `490–491`, the fixtures'
  attribute draw `499`. **`gScratchBand`** stores the list, the band and the out-of-band set, and
  asserts the band sits above canon's own scratch floor and is DISJOINT from the battery block
  both ways. ⛔ The verifier's band `900,008,500–599` is NOT this executor's.
* **RE-WALKS `12,558,000–002`** are IF-C0's OWN consumed band and are **NOT a consumption**.
* **ZERO stats**: `stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 87 }`.
* ⚠ **WALL TIME ON THIS HOST** (#420 item 2(v)): the smoke stores
  `perf.meanWallSecondsPerMatch`; §DEV-PREFLIGHT projects the battery from it, and the executor
  runs the battery in the background with a log. If the affordance projected beyond ~10 h the
  stage would HALVE N and say so in §DEVIATIONS — a sizing deviation, never a read change.

### §P.8 — THE GATE SET (frozen ex ante) — **27 gates**

DS-T1d's whole set by anchor — `gWorld` · `gDoseSource` · `gAnchoredConstants` ·
`gPredicateFixtures` · `gLedgerRead` · `gClassesNonVacuous` · `gCodeFactGraph` · `gPullCount` ·
`gLockstep` · `gDeterminism` · `gFingerprintProd` (X-FP-PROD) · `gSrcUntouched` ·
`gSeedsBookedEqualWalked` · `gSeedDisjoint` · `gN` · `gLoo` · `gScratchBand` · `gTwoFractions` ·
`gFaces` · `gReadWords` · `gHashOrder` · `gStage` · `gReadLiterals` — **PLUS**:

* ⭐⭐⭐ **`gBiteIF`** — the **#414 ROW form**, VERBATIM from canon (*rare-event liveness on the
  row*): on every battery seed where the CANDIDATE arm recorded **≥ 1 eighth-`why` decision**,
  the candidate's and the control's **per-seed ROWS differ in at least one stored field**. The
  full-time signature comparison is kept BESIDE as a PRINTED FACE and **gates nothing**. Its
  **non-vacuity** is the eighth-`why` count > 0 on the candidate arm over the battery — stored
  ONCE and read by `gClassesNonVacuous` too. ⚠ LIVENESS ONLY — and ⭐ **a PRECONDITION of every
  read**.
* ⭐⭐⭐ **`gArmIF`** — the eighth-`why` count is **EXACTLY 0** on every arm NOT carrying
  `ifFlightRun` **and the belief map is EMPTY there**, on every battery seed, on the construction
  receipt, and on two whole construction walks at `900,008,440–441`. ⛔ A STORED BOOLEAN OF
  CONSTRUCTION, never narrated as a finding. (`gArmCoop` sits beside it as a stored check that
  `overlapSets` and `wallFires` are zero on every arm carrying `dsCoopHatsOff` and non-zero on
  `HATS-E13`.)
* ⭐⭐⭐ **`gRepro`, ARCHITECTURE-AWARE** (#418 item 2(v)) — the RE-WALK of IF-C0's
  `12,558,000–002` on `OWNCOOP-E13` and `HATS-E13` against `if-c0-flight-run-census.json`'s
  `perSeedCells[]` **GATES only when `process.arch === 'arm64'`**. On x64 it **STORES** the
  re-walked rows beside the arm64 rows as `repro.crossArch` with **every differing field
  enumerated**, and `gRepro` reads *"≈ cross-architecture (stored, not gated)"*. The instrument's
  OWN determinism (`gDeterminism`) and `gLockstep` carry the reproduction burden on this host.
  ⚠ Fields whose SHAPE changed (this exam's classifier has TEN cells where IF-C0's had NINE) are
  excluded and NAMED in `shapeChangedFields`.
* ⭐⭐⭐ **X-FP-PROD, ARCH-KEYED** — both columns are read BY ANCHOR out of IF-T0's own pin suite
  (`tests/ifFlightRun.test.ts`), which carries them side by side; neither is typed. arm64
  `57b0bdab…c673` is the value OF RECORD, x64 `59f42aa7…a072d` the second column (#418 item 1).
* ⭐ **`gLedgerRead`** registers **THE ONE NEW READ**: `match.ifLastSeenOwnerGid` — the seam's own
  belief, READ (never written) for the eighth class's memory partition. **Registry 86 → 87.**
* ⭐ **`gPullCount`** in IF-C0's ADDED-READ form (§P.2).
* ⭐ **`gCodeFactGraph`** extended to §P.9's facts, including the seam's **FIVE-member** read set.

### §P.9 — THE CODE FACTS

* **The six `MakeRun` pushes**, classified over the WHOLE enclosing-`if` chain: exactly **one
  `flagGated`**, naming `dsOwnRun`; `makeRunCandidatesAllHatGuardedOnShippedPath` DERIVED over
  the five pushes reachable with every DS flag absent.
* **The three DS flags' read forks**, enumerated under `src/**` and compared to §SWITCH-D's
  inventory on **TEXT + FILE + LINE**: `PlayerBrain.ts:2213` · `TeamBrain.ts:344 · 367 · 398` ·
  `mechanics.ts:430`. ⚠ **`ifFlightRun` has NO `if (…) {` read fork at all** — it is aliased and
  consumed in boolean expressions — so the fork inventory stays at FIVE and that is stated, not
  assumed.
* ⭐⭐⭐ **THE SEAM'S FIVE-MEMBER READ SET, at the FIX's line numbers.** The block's `match`
  member set is EXTRACTED from the fork's whole text and compared to the **UNION of TWO doc
  sentences**, each PARSED and neither edited: DS-T0's §LAW-C 4 names THREE
  (`dsOwnRun` · `perceivedSnapshot` · `simTime`) and IF-T0's §LAW 2 names **THE TWO THIS STAGE
  ADDS** (`ifFlightRun` · `ifLastSeenOwnerGid`). The gate also asserts that the two alias reads
  are **the FIRST TWO EXECUTABLE STATEMENTS inside the fork** (#420 item 1(b)'s placement, at
  `2221–2222`) and that the belief has **ONE read site and ONE write site in all of `src/**`**.
* ⚠ **THE §SEAM-C LINE SHIFT, DECLARED.** §SEAM-C's table records the lines DS-T0c MEASURED;
  IF-T0 then inserted its seam INSIDE the fork, ABOVE four of those rows. The gate compares
  TEXT + FILE + CLASS exactly and, on the line, asserts that **no row moved UP**, that every
  non-`PlayerBrain.ts` row is **UNMOVED**, and that **THE FORK LINE ITSELF IS UNMOVED** — which
  is what makes every shift below it an insertion INSIDE the fork. The shifts are STORED.
* ⚠ **`a4World.ts` IS STATED AT THIS HEAD, NOT COMPARED TO §SWITCH-D's ROW.** §SWITCH-D writes
  `a4World.ts` 2 / 2 / **0**, a statement dated to DS-T0d's head; DS-ENTRY-2 then cut world 17
  out of `dsCoopHatsOff` (#415 errata), so the coop count is **2** here. This exam STATES the
  three counts at its OWN head and keeps only the zeros that are **STILL CLAIMS**:
  **`ifFlightRun` 0** and **`ifLastSeenOwnerGid` 0** — **the flight door reaches no world,
  preset or bundle**, and so does its belief.
* ⭐⭐⭐ **RULE (m), INHERITED AND WIDENED.** `assignRunners` and `performPass` carry
  `dsCoopHatsOff` gates and **`decideOffBall` carries IF-T0's insertion**, so all three WHOLE-TEXT
  hashes are **STATED AT THIS HEAD and COMPARED TO NOTHING BANKED**. `runRank`, `runnerCount`,
  `registerPass` and `executeAction` are hashed and compared as before, and
  `blockReadsNoVelocityNoTopSpeed` is kept.

---

## §DEV-PREFLIGHT — THE DISCLOSED SMOKE (before the freeze)

Two scratch runs, both **inside the declared band `900,008,400–499`**, both with the artifact
routed OFF every canonical path by the instrument's own override guard.

1. **A 2-seed shake-out** (`900,008,400–401`, five arms) — used only to find and fix instrument
   defects before the sizing run. **SIX gates were RED on it and all six were fixed at
   §P-consistent points, BEFORE the freeze**, every one of them an instrument defect and none a
   predicate loosened after seeing a result:
   * **`gWorld`** — the inherited world receipt still read `dsCoopHatsOff` as due on the
     `OWNCOOP` kind only and knew nothing of `ifFlightRun`. Rewritten to the five-arm table:
     `dsCoopHatsOff` due on every non-HATS arm, `ifFlightRun` due on the two candidate arms, and
     the belief map asserted PRESENT-AND-EMPTY on the constructed world pin.
   * **`gPullCount`** — inherited in DS-T1d's *no-added-pull* form, which this exam's ONE
     DECLARED ADDED READ makes false. Replaced by **IF-C0's own ADDED-READ form** (§P.2).
   * **`gClassesNonVacuous`** — its cooperation-counter conjunct filtered on
     `ARM_KIND !== 'OWNCOOP'`, which after the arm rename swept in the two `OWNCOOP+IF` arms and
     demanded `overlapSets > 0` on arms that carry `dsCoopHatsOff`. Narrowed to the HATS arm,
     which is the only arm that can carry a cooperation hat here. The IF families' own liveness
     conjuncts were added in the same edit.
   * **`gCodeFactGraph`** — two inherited comparisons were statements dated to DS-T0d's head:
     §SEAM-C's PlayerBrain line numbers (IF-T0 inserted above four of them) and §SWITCH-D's
     `a4World.ts` row (DS-ENTRY-2 named `dsCoopHatsOff`). Both are now **STATED and DECLARED**
     as §P.9 describes, with the fork line asserted UNMOVED so the shift cannot hide a move.
   * **`gSeedDisjoint`** — the consumed-block list stopped at DS-T1c's; DS-T1d's
     `12,557,000–999` and IF-C0's `12,558,000–999` were added, and the re-walk band moved to
     IF-C0's own.
   * **`gPredicateFixtures`** — the three fixtures the four fixes above made false.
   ⛔ **No predicate was loosened to make a measurement green**: every fix is a correction of
   this instrument's own bookkeeping, made before any battery seed was walked, and all of them
   are described in §P above.
2. **THE SIZING SMOKE OF RECORD — 12 seeds `900,008,400–411`, five walks per seed, 27/27 gates
   GREEN**, from which the two half-widths below are transcribed into the instrument and
   re-derived off the artifact by `gFaces`.

| face (paired Δ, the comparison of record) | half-width at n = 12 | target | `nRequired` | resolvable at N = 999 |
| --- | --- | --- | --- | --- |
| `r1.runsPerInPossessionTick` | `0.09404095922915776` | 0.05 | **87** | yes |
| `dt.negativeShare` | `0.02472186703045473` | 0.05 | **6** | yes |

Form: `se(n) = hw(n)/z.975` · `se(needed) = |target|/(z.975+z.80)` ·
`N = ceil(n·(se(n)/se(needed))²)` · `MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975`.

⭐ **WHICH N WAS TAKEN, SAID PLAINLY.** Both rows resolve far below the block's affordance, so the
literal `min(required, affordance)` is the **REQUIRED** n (87 and 6). **THIS STAGE WALKS THE
AFFORDANCE, N_FROZEN = 999**, which is the inherited house practice of DS-T1 / DS-T1b / DS-T1c /
DS-T1d and is ≥ required on every row: a 12-cluster variance estimate is NOISY, and the faces
this exam adds — the eighth class's partitions, the receiver class, the intended-receiver share —
are **RARE EVENTS** whose per-seed counts are small. **This is the #414 §CORR 8 floor reading**
and it is DECLARED at §DEVIATIONS; it can only narrow an interval, never widen one.

⭐ **THE WALL-TIME PROJECTION (#420 item 2(v)).** The sizing smoke stored
`perf.meanWallSecondsPerMatch` = **0.421050**. The battery is 999 seeds × 5 arms + 5 receipt
walks = 5,000 walks, projecting **≈ 2,105 s ≈ 0.6 h** — far inside the ~10 h ceiling, **so N is
NOT halved** and the affordance stands.

⭐ **THE WORLD PIN, THE LOCKSTEP PAIR AND THE FIXTURES' DRAW**, all inside the band: the world pin
at `900,008,470` (five constructed arms, four flags each as due, the belief map present and
empty); the lockstep pair at `900,008,490–491` (which X-DET and `gPullCount` re-use — 10 arm ×
scratch walks, observed ≡ unobserved byte for byte, and the added pulls EQUAL to the stored
count); `gArmIF`'s construction walks at `900,008,440–441`; the fixtures' attribute draw at
`900,008,499`. `gScratchBand` stores all 19 seeds, the band `[900,008,400, 900,008,499]` derived
from the ONE base, and an EMPTY out-of-band list.

⚠ The smoke's own numbers are **NOT** results: they are scratch seeds, they are disclosed only so
the sizing is auditable, and no read is taken on them.

---

## §R — THE RESULTS

Walked at the RESULTS commit on the frozen instrument (byte-identical to FREEZE). **999 seeds ×
5 arms + 5 construction-receipt walks = 5,000 walks BOOKED = WALKED**; block `12,559,000–999`
consumed whole; unwalked tail **none** (`seeds.unwalkedTail` is `null` — the battery ends at
`12,559,998` and the receipt takes `12,559,999`). Battery wall **2,322.035 s**, mean
**0.412050 s** per walked match (`perf`, a machine reading on one machine, on x64).

**27 of 27 gates GREEN. `allGreen` is a STORED `true`.** The artifact sits at the canonical path.

Every number below is quoted from an artifact FIELD at the six-decimal precision the instrument
itself prints; ⛔ no number in this doc is computed by hand. ⭐ **Every one of them is an x64
number** (#418 item 2(v)); IF-C0's arm64 twins are printed beside where they exist, stamped
**≈ cross-architecture**, and they select nothing.

### §R1 — R1, THE FLOOD FACE (executed runs per in-possession open-play team-tick)

| arm | mean | ≥ 3 runners | bins 0 · 1 · 2 · 3 · 4 |
| --- | --- | --- | --- |
| `HATS-E13` | 0.596567 | 0.014556 | 0.618726 · 0.181076 · 0.185642 · 0.014017 · 0.000539 |
| `OWNCOOP-E13` | 0.244699 | 0.001473 | 0.785666 · 0.185459 · 0.027402 · 0.001457 · 0.000015 |
| **`OWNCOOP+IF-E13`** | **0.773695** | **0.009193** | 0.380801 · 0.474059 · 0.135946 · 0.009032 · 0.000159 |
| `OWNCOOP-D13` | 0.242309 | 0.000957 | 0.786220 · 0.186217 · 0.026607 · 0.000948 · 0.000008 |
| `OWNCOOP+IF-D13` | 0.787092 | 0.006776 | 0.363306 · 0.493146 · 0.136772 · 0.006703 · 0.000073 |

(bin 5 reads 0.000001 on `OWNCOOP-E13` and 0.000002 on `OWNCOOP+IF-E13`, 0.000000 elsewhere;
bin 6+ is exactly 0 on all five.)

**THE PAIRED Δ OF RECORD — `OWNCOOP+IF-E13` vs `OWNCOOP-E13` on E13, CONTROL = world 17:**

> **Δ +0.528996 [0.521440, 0.536592]**, tolerance **0.067614**, `resolved` **true**,
> `up` **true**, **`beyondToleranceUp` TRUE**, **`floods` TRUE**. The ratio is
> **3.161820 [3.115255, 3.209122]**. LOO on this row: **0 flipping seeds in either direction**.

The D13 pair moves the same way (Δ **+0.544782** [0.537205, 0.553014] against a tolerance of
0.066954, `floods` **true**); `OWNCOOP+IF-E13` vs `HATS-E13` is Δ **+0.177128** [0.167538,
0.186673] against 0.164841, `floods` **true**; DS-T1d's own comparison re-walked here
(`OWNCOOP-E13|HATS-E13`) is Δ **−0.351868** [−0.360288, −0.343524], `floods` **false**.

### §R2 — THE BAND, per contrasted pair, with every breach's DIRECTION

**THE COMPARISON OF RECORD — `holdsBand` FALSE. ONE BREACH: G9, direction UP.**

| id | face | control | arm | Δ | interval | tolerance | resolved | beyond | breach |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| G1 | goals per match | 3.312312 | 3.452452 | +0.140140 | [−0.017017, 0.294294] | 0.915244 | false | false | — |
| G2 | shots per match | 12.494494 | 12.209209 | −0.285285 | [−0.551552, −0.025025] | 3.452426 | true | false | — |
| G3 | xG conversion | 1.461457 | 1.510666 | +0.049209 | [−0.008372, 0.106436] | 0.403824 | false | false | — |
| G4 | pass completion | 0.588114 | 0.579806 | −0.008309 | [−0.012379, −0.003941] | 0.162505 | true | false | — |
| G5 | interceptions per match | 25.629630 | 25.687688 | +0.058058 | [−0.344344, 0.469469] | 7.081871 | false | false | — |
| G6 | possession share (A) | 0.502474 | 0.502204 | −0.000269 | [−0.005309, 0.005074] | 0.138841 | false | false | — |
| G7 | passes per match | 77.970971 | 78.437437 | +0.466466 | [−0.250250, 1.141141] | 21.544610 | false | false | — |
| G8 | mean aim distance (m) | 15.556598 | 16.091327 | +0.534729 | [0.460909, 0.608500] | 4.298534 | true | false | — |
| **G9** | **through balls per match** | **5.557558** | **8.297297** | **+2.739740** | **[2.519520, 2.973974]** | **1.535641** | **true** | **true** | ⛔ **BREACH, UP** |
| G10 | offsides per match (FLAG) | — | — | — | — | — | — | — | flag **true**, gates nothing |

`breachSet` = `[{ id: G9, key: guard.throughBallsPerMatch, direction: UP }]`.
|Δ| ÷ tolerance on G9 ≈ **1.78**. LOO on G9: **0 flipping seeds** in either direction.

**THE OTHER THREE PAIRS.**

* `OWNCOOP+IF-E13|HATS-E13` — `holdsBand` **false**, the SAME single breach **G9 UP**
  (6.029029 → 8.297297, Δ +2.268268 [2.025025, 2.526527] against 1.665916); offside flag true.
* `OWNCOOP-E13|HATS-E13` (DS-T1d's own comparison, re-walked on this block and this
  architecture) — `holdsBand` **TRUE**, breach set **[]**, offside flag false.
* `OWNCOOP+IF-D13|OWNCOOP-D13` — `holdsBand` **false**, the SAME single breach **G9 UP**
  (6.576577 → 9.062062, Δ +2.485485 [2.243243, 2.730731] against 1.817212); offside flag true.

**G9's LEVELS BY ARM**, printed: HATS 6.029029 · world 17 5.557558 · **the candidate 8.297297** ·
D13 control 6.576577 · D13 candidate 9.062062.

### §R3 — THE FACES

**THE CLASSIFIER, TEN CELLS** — the share of all attacking `MakeRun` decisions, by class:

| arm | licensed | arriving | box | oneTwo | overlap | keeperUp | **own run** | **onto the flight** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `HATS-E13` | 0.481596 | 0.037890 | 0.470929 | 0.002993 | 0.005303 | 0.001290 | 0.000000 | 0.000000 |
| `OWNCOOP-E13` | 0.000441 | 0.028483 | 0.522071 | 0 | 0 | 0.003173 | **0.445832** | 0.000000 |
| **`OWNCOOP+IF-E13`** | 0.000180 | 0.014232 | 0.189362 | 0 | 0 | 0.001275 | **0.165637** | **0.629314** |
| `OWNCOOP-D13` | 0.000829 | 0.031134 | 0.446034 | 0 | 0 | 0.002886 | **0.519117** | 0.000000 |
| `OWNCOOP+IF-D13` | 0.000261 | 0.014281 | 0.149733 | 0 | 0 | 0.000605 | **0.182393** | **0.652728** |

Per match on the arm of record: the eighth class **731.011011**, the seventh **192.404404**,
`attackingTheBox` 219.962963, `arrivingLate` 16.531532. On its control the seventh is
**200.410410** and the eighth is **0**.

**THE BOARD.** `openPlayBoardEmpty` is **true** on the arm of record (share 1.000000) and on the
two D13 arms; on `OWNCOOP-E13` the share is 0.999912 (the boolean false), on `HATS-E13`
0.103375. **THE CROWDING FAMILY**: 撞车 `crashShare` 0.448117 (control) → 0.447934 (candidate),
0.439342 on HATS; `spacingUnder4` 0.073161 → 0.071912, 0.069634 on HATS.

### §R3b — THE SEAM'S OWN FACES, and ⭐ THE EIGHTH CLASS'S THREE PARTITIONS

**THE SEAM'S INHERITED FACES** (the arms carrying `dsOwnRun`; `HATS-E13` has no own-run
population by construction and its cells are empty, enumerated in `reads.emptyRunClasses`):

| arm | restraint mean | = 0 | = 1 (`rankBelowCount`) | prior-zero share | count mean | guard-pass FLOOR | own candidates/match |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `OWNCOOP-E13` | 0.452430 | 0.547527 | 0.448442 | 0.075225 | 1.547644 | 0.219875 | 1220.242242 |
| **`OWNCOOP+IF-E13`** | 0.454216 | 0.545747 | 0.451616 | 0.081747 | 1.549898 | 0.208125 | 1174.195195 |
| `OWNCOOP-D13` | 0.456168 | 0.543819 | 0.453281 | 0.068877 | 1.576084 | 0.255948 | 1552.625626 |
| `OWNCOOP+IF-D13` | 0.457554 | 0.542424 | 0.455127 | 0.076817 | 1.584229 | 0.245854 | 1508.952953 |

⭐⭐⭐ **THE TENTH CELL AND ITS THREE PARTITIONS** (arm of record, `OWNCOOP+IF-E13`):

* **THE COUNT.** `ownRunOntoFlight` decisions **731.011011 per match** (730,280 over the
  battery); episodes **135.701702 per match** (135,566), mean length **70.384942** ticks,
  0.790791 still open at full time; visible eighth-class candidates **3064.968969 per match**
  (a FLOOR — the record stores only the top four).
* **PARTITION 1 — THE START STATE** (116.227227 stamped starts per match, 116,111 in all):
  the ball he SEES is **in the air 1.000000** of the time (`loose` 0.000000, `noBallSeen`
  0.000000). ⚠ `|vel| > 0` is a STORED partition, never a gate.
  His MEMORY holds **the last passer 0.166823** and **another mate 0.833177**
  (`noMemory` 0.000000). The ENGINE'S OWN truth state at those ticks: `ballInFlight`
  **0.731602** · `ownRestart` **0.227300** · `mateOwnsTheBall` **0.034450** · `other` 0.006649.
* **PARTITION 2 — THE RESTRAINT** (#419 item 3's own face; 2,957,572 backed-out observations,
  2960.532533 per match): **exactly 0 → 0.665404** · **exactly 1 → 0.332171** · **between →
  0.002425** (the float receipt the rank law predicts is 0). Mean **0.334562**.
  The SEVENTH class's own restraint on the same arm is 0.545747 / 0.451616.
* **PARTITION 3 — THE YIELD** (per eighth-class episode): shots **0.035510** · goals
  **0.014657** · passes aimed **0.232551** · completions **0.097510** · through share
  **0.099283**; **4.818819 eighth-class-episode shots per match**. The SEVENTH's own yield
  beside it: shots per episode **0.049945**, goals **0.016276**, episodes 56.518519 per match.
  BY STATE: at a mate's feet **0.029555** shots per run (27.061061 runs per match) · in flight
  **0.008226** (512.813814) · at his own restart **0.004163** (189.004004) · other 0.000469
  (2.132132).
* **THE BELIEF.** `match.ifLastSeenOwnerGid` holds **9.998999** entries per match at full time
  on the candidate arms and **0.000000** on every arm without the door (`gArmIF`).

### §R3c — IF-C0's Q4 FACES, WITH THEIR ≈ CROSS-ARCHITECTURE TWINS

⭐⭐⭐ **THE ≈ STAMP.** The `IF-C0` column is an **arm64** number measured on another host and on
another seed block. It is **PRINTED, NEVER SELECTING**; the exact comparator is the CONTROL
column, walked here.

| face (IF-C0's own field name) | `HATS-E13` | `OWNCOOP-E13` (CONTROL) | **`OWNCOOP+IF-E13`** | ≈ IF-C0 (arm64, `OWNCOOP-E13`) |
| --- | --- | --- | --- | --- |
| `dt.negativeShare` | 0.004103 | 0.039345 | **0.370729** | ≈ 0.039719 |
| — of SEVENTH-class starts | — | 0.039910 | 0.071148 | — |
| — of EIGHTH-class starts | — | — | **0.500113** | — |
| `receiver.classShare.startedDuringTheFlight` | 0.000021 | 0.000000 | **0.004754** | ≈ 0.000021 |
| `flight.intendedReceiverShare` (FIXTURED) | 0.000000 | 0.000000 | **0.000000** | ≈ 0.000000 |
| — the flight TOWARD him | 0.018395 | 0.133055 | **0.329475** | — |
| `release.runnersAtReleaseMean` | 1.192259 | 0.642484 | **0.869299** | ≈ 0.644204 |
| `run.inFlightShare` | 0.027369 | 0.083305 | **0.551466** | ≈ 0.083077 |
| `leak.cellShare.stalePasserStillCredited` | — (0/0) | 0.900686 | **0.859069** | ≈ 0.894186 |
| — seventh-class in-flight starts per match | 0.000000 | 2.771772 | 2.968969 | — |

**THE Δt BINS on the arm of record** (163.433433 attached starts per match; 0.014320 of run
starts never found a release and are NOT binned): `<−1.0` 0.041067 · `−1.0..−0.5` 0.064641 ·
`−0.5..0` 0.265021 · `0..0.5` 0.146598 · `0.5..1.0` 0.040846 · `1.0..2.0` 0.108226 · `≥2.0`
0.333601.

**THE RECEIVER'S CLASSES on the arm of record** (45.478478 completions joined to a flight per
match): `runningAtRelease` 0.195122 · **`startedDuringTheFlight` 0.004754** · `neither`
0.800123. On the INTENDED receivers alone `startedDuringTheFlight` is **0.000000**.

**THE BODIES ALREADY RUNNING AT THE RELEASE, by bin** (arm of record, 78.425425 releases per
match): 0 → 0.391757 · 1 → 0.406346 · 2 → 0.146043 · 3 → 0.052561 · 4+ → 0.003293.

**THE COUPLING FAMILY BESIDE.** `HATS-E13` carries the cooperation hats (overlapSets 2.981982
per match, wallFires 10.025025, arrivals 0.044044, one-twos 0.277277); every arm carrying
`dsCoopHatsOff` reads **0.000000** on all four **by construction** (`gArmCoop`, a stored check —
it is what world 17 MEANS). The twelve empty coupling counters are ENUMERATED in
`reads.emptyCouplingCounters`, never gated.

### §R4 — THE CODE FACTS

* **THE `MakeRun` PUSHES**: six, classified over the WHOLE enclosing-`if` chain —
  `{"flagGated":1,"hatGuarded":3,"keeperUpGuarded":2,"unguarded":0}`; the ONE `flagGated` push
  is `src/ai/PlayerBrain.ts:2294`, naming **`dsOwnRun`**, and it is NOT hat-guarded.
  `makeRunCandidatesAllHatGuardedOnShippedPath` **true**, DERIVED over the five pushes reachable
  with every DS flag absent.
* **THE THREE DS FLAGS' READ FORKS: FIVE in `src/**`**, TEXT + FILE + LINE equal to §SWITCH-D:
  `PlayerBrain.ts:2213` · `TeamBrain.ts:344` · `:367` · `:398` · `mechanics.ts:430`.
  ⚠ **`ifFlightRun` has NO `if (…) {` read fork at all** — it is aliased and consumed in boolean
  expressions — so FIVE is the whole inventory and that is stated, not assumed.
* ⭐⭐⭐ **THE SEAM'S FIVE-MEMBER READ SET**, extracted from the fork's whole text:
  `match.dsOwnRun` · `match.ifFlightRun` · `match.ifLastSeenOwnerGid` ·
  `match.perceivedSnapshot` · `match.simTime` — **EQUAL to the UNION of the two doc sentences**
  (DS-T0's §LAW-C 4's three and IF-T0's §LAW 2's two), neither of them edited. The two alias
  reads are **the FIRST TWO EXECUTABLE STATEMENTS inside the fork**, at `PlayerBrain.ts` **2221
  and 2222** with the fork at **2213** — #420 item 1(b)'s placement, re-derived here. The belief
  has **ONE read site and ONE write site in all of `src/**`**, both on the same expression.
* ⚠ **THE §SEAM-C LINE SHIFT, DECLARED AND STORED**: the four `PlayerBrain.ts` rows sit
  **9 · 35 · 35 · 35** lines LOWER than §SEAM-C's table (distinct shifts `[9, 35]`); every
  `TeamBrain.ts` row is UNMOVED; and **the fork line itself is UNMOVED (2213 in the doc, 2213
  measured)** — which is what makes every shift below it an insertion INSIDE the fork.
* ⚠ **`a4World.ts` AT THIS HEAD, STATED**: `dsOwnRun` **2** · `dsHatsOff` **2** ·
  `dsCoopHatsOff` **2** (DS-ENTRY-2 cut world 17 out of it — #415 errata) ·
  **`ifFlightRun` 0** · **`ifLastSeenOwnerGid` 0** — **the flight door and its belief reach NO
  world, preset or bundle**, and those two zeros are the anchors.
* ⭐⭐⭐ **RULE (m)** — three WHOLE-TEXT hashes STATED AT THIS HEAD and **compared to nothing
  banked**: `assignRunners`
  `77b0d79c36cc8932c2dfc267500ae30d50e47a626f84e7d6074b6087cd7ba5b5` · `performPass`
  `1ff0dda909a3bb644c1fa087e3f609fc8ddf22749f6ed370d2ad3af65e9e4ac8` · **`decideOffBall`**
  (`src/ai/PlayerBrain.ts:1925-2412`)
  `9c223e4f36cf20e1a64e820c831098bedba6686f5d86bc61e6f4b1726a894ccd` — the third is IF-T0's own
  insertion, which is exactly why six frozen probes' banked hash for that function reads RED
  from `d0f4a79` (IF-T0 §HONESTY 4, declared there).
* `blockReadsNoVelocityNoTopSpeed` **true**; the `.pos`, `mate.` and `body.` sets agree with the
  doc; `runRank` and `runnerCount` each exist in exactly two files of `src/**` with all their
  call sites resolved.

### §R5 — THE READ

> ## THE FLIGHT RUN CARRIES A FACE — the guard is named; the commander decides between a restraint slice and stop with the table.

**Selected by the frozen rule at PRECEDENCE STEP (1) — *a BREACH*** — on the STORED selectors of
the comparison of record (`OWNCOOP+IF-E13|OWNCOOP-E13`, E13, the seat absent): `holdsBand`
**false**, `breachingGuards` **["G9 guard.throughBallsPerMatch"]**, `floods` **true**.
⭐ **THE LIVENESS PRECONDITION WAS MET**: `gBiteIF` is **GREEN**, so a read was selected and the
string *"THE SEAM DID NOT FIRE — no read"* was NOT stored. The word, the sentence, the step and
every selector are re-derived off the SERIALIZED artifact by `gFaces` / `gReadWords`; the
sentence is one of the four frozen literals and all five strings (three reads, the fallback and
the liveness string) were cross-checked against BOTH homes at run time (`gReadLiterals` GREEN).

**PRINTED BESIDE IT, from stored fields, with NO verdict word:**

* **THE HONESTY LINE** — *"nothing the band can see" is NOT "nothing the eye can see" — the
  user's gate at world 18 judges the eye.*
* **THE GUARD THAT IS NAMED: G9, through balls per match, UP** — 5.557558 → **8.297297**,
  Δ **+2.739740 [2.519520, 2.973974]** against a tolerance of **1.535641**; |Δ| ÷ tolerance
  ≈ 1.78; 0 LOO-flipping seeds. It is the ONLY breach, in every pair that carries the door.
* **LIVENESS** — `gBiteIF` true; the eighth-`why` count on the candidate arm is
  **731.011011 per match** (730,280 over the battery); 999 of 999 seeds eligible, **999 of 999
  ROWS differ**, 0 exempt. (The full-time SIGNATURE also differs on all 999 — printed beside,
  gating nothing.)
* **R1** — 0.244699 → **0.773695**, Δ +0.528996 [0.521440, 0.536592] against a tolerance of
  0.067614; `floods` **true**; the ratio **3.161820 [3.115255, 3.209122]**.
* **THE EIGHTH CLASS'S THREE PARTITIONS** — START STATE: in the air **1.000000**, loose
  0.000000; MEMORY: the last passer **0.166823**, another mate **0.833177**. RESTRAINT: exactly
  0 **0.665404** · exactly 1 **0.332171** · between 0.002425. YIELD: **0.035510** shots per
  eighth-class episode.
* **THE YIELD PAIR (seventh · eighth)** — **0.049945** shots per own-run episode vs
  **0.035510** per eighth-class episode; the runner-hat episode on HATS is 0.063057.
* **THE Q4 FACES WITH THEIR ≈ TWINS** — negative-Δt half **0.370729** (≈ IF-C0 0.039719);
  receiver started-during-flight **0.004754** (≈ 0.000021); intended-receiver share **0.000000**
  (≈ 0.000000); bodies already running at the release **0.869299** (≈ 0.644204); in-flight share
  of run starts **0.551466** (≈ 0.083077); the leak's `stalePasserStillCredited` **0.859069**
  (≈ 0.894186).
* **PER STATE (eighth-class runs per match)** — a mate on the ball 27.061061 · in flight
  512.813814 · his own restart 189.004004 · other 2.132132.
* **THE OPEN-PLAY BOARD** — `openPlayBoardEmpty` **true** on the arm of record (share 1.000000).

**THE COUNTERFACTUAL WORDS — STORED, NEITHER SELECTING:**

* **D13** (`OWNCOOP+IF-D13|OWNCOOP-D13`): word **`read2`** — *THIS PAIR SELECTS THE SAME READ*
  (`d13Agrees` true), on the same single breach G9 UP.
* **THE HATS-vs-CANDIDATE GUARD TABLE** (`OWNCOOP+IF-E13|HATS-E13`, world 13 against the
  world-18 candidate): its own `holdsBand` word is **FALSE**, `floods` **true**, and the frozen
  rule applied to its stored interval gives **`read2`** — the same single breach, G9 UP. It
  selects nothing.

### §R6 — 在说人话的层面

球员看见球飞出去就起跑——这件事本身做成了，而且做得很足。

* **球踢出去之后，跑的人多了两倍**：每个有球 tick 平均 0.244699 → 0.773695。新的那类跑动占了所有
  跑动的六成以上，而且起跑的那一刻，**他眼里的球每一次都在动**——不是停着的散球。
* **有一条护栏被顶穿了，方向是往上**：直塞球每场 5.557558 → 8.297297，超出容差将近八成。
  别的九条一条都没动。所以这一步不是"表看不见"，是**表看见了一样东西**，而且看得很清楚。
* **他记着的不是刚传球的那个人**：新跑动起跑时，他记忆里拿球的那位，八成三是另一个队友。
  收着不跑的比例也高——三分之二的时候他把自己按住了。
* **单次回报比他原来的自己跑低一点**：跑得多，每一次的射门少一点。

⛔ 这一段里没有一个褒贬词落在任何一张脸上；**唯一的判决就是 §R5 那句冻结的读数**：
这一步**带着一张脸**，那张脸叫 G9，接下来由指挥官拿这张表在「限流切片」和「停」之间决定。

---

## §HONEST LIMITS

**THE ONE HOME.** The artifact stores none of this list (`stage.honestLimitsNote`); its pointer
names THIS doc.

1. **"NOTHING THE BAND CAN SEE" IS NOT "NOTHING THE EYE CAN SEE" — AND HERE THE BAND DID SEE.**
   The band is ten guards and R1, and one of them resolved past tolerance. What it still cannot
   see is the SHAPE of a run onto a flight — whether a body arriving onto a travelling ball
   looks like football or like a swarm. The user's gate at world 18 judges that; this exam does
   not.
2. **THE READ RESTS ON ONE GUARD.** `holdsBand` is false because of G9 and G9 alone, on all
   three pairs that carry the door. A single-limb breach is still a breach by the frozen rule,
   and the rule was frozen before the battery — but the table is what the commander decides
   with, not the word.
3. **LOO FLIPS ON ONE NON-READ-BEARING ROW.** Of 40 LOO rows, exactly one carries flipping
   seeds: `guard.passesPerMatch` on `OWNCOOP+IF-E13|HATS-E13` (363 seeds would flip its
   RESOLUTION downward; stored in `loo[].looFlippingSeeds`). That row is **far inside** its
   tolerance (Δ −0.733734 against 21.876245), it is **not on the comparison of record**, and it
   breaches nothing. **R1 and G9 on the comparison of record have ZERO flipping seeds.**
4. **THE ≈ TWINS ARE CROSS-ARCHITECTURE AND CROSS-BLOCK.** Every IF-C0 value printed beside a
   face of this exam is an **arm64** number measured on a different host and on a different seed
   block (12,558,000–999). They are comparable in KIND, not in value, and **no read, no gate and
   no stored boolean depends on one**. The exact comparator throughout is this exam's own
   control arm.
5. **`gRepro` DID NOT GATE ON THIS HOST.** On x64 it STORED the re-walked rows instead. What it
   stored is itself informative and is honestly named: on `HATS-E13` **0 of 81 compared fields
   differ on all three seeds**; on `OWNCOOP-E13` **1 field differs on two of the three seeds and
   51 on the third** — the whole-match `signature` among them. That is the architecture, not the
   seam: `gDeterminism` and `gLockstep` are GREEN here and carry the reproduction burden.
   ⚠ Three fields were excluded by SHAPE (`runClassTicks`, `keeperRunClassTicks`,
   `stateRunDecisions` — this exam's classifier has TEN cells where IF-C0's had NINE) and are
   NAMED in `repro.shapeChangedFields`.
6. **THE START-STATE PARTITION IS 1.000000 "IN THE AIR", AND THAT IS A MEASUREMENT, NOT A
   TAUTOLOGY.** The seam's own guard is `ownerGid === null`, which a STILL loose ball also
   satisfies; the partition says that in practice the ball he sees with no owner is MOVING every
   time. `|vel| > 0` is a stored partition and gates nothing.
7. **THE RESTRAINT IS RECOVERED ONLY WHERE THE PRIOR IS NON-ZERO.** 0.081747 of visible own-run
   candidates on the arm of record score 0 because their PRIOR is 0 (the DF clamp); there the
   back-out's denominator is zero and the restraint is NOT RECOVERABLE. That population is
   counted, never imputed.
8. **THE BACK-OUT READS ONLY THE TOP FOUR.** The engine's decision record stores four
   candidates, so every seam and eighth-class share is a **FLOOR** on the pushed population.
9. **THE LEAK IS UNTOUCHED AND IS ONLY PRINTED.** The stale-owner in-flight own run
   (`stalePasserStillCredited` 0.900686 on the control, 0.859069 on the candidate) is contract
   §4's non-claim: honest perception, printed here, fixed nowhere.
10. **THE INTENDED-RECEIVER SHARE IS ZERO ON EVERY ARM, INCLUDING THE CANDIDATE** — 0 of 61,425
    in-flight starts on his side's pass on the arm of record. The seam gives him the STATE, not
    a target: the passer still does not aim at a body running onto the flight. The face is now
    FIXTURED, so the zero is a measurement and no longer an unfixtured predicate.
11. **ONE BLOCK, ONE COMPOSITION, ONE ARCHITECTURE.** Every number here is world 13
    (empty-book) and world 13 (the played book) at THIS head, at N = 999 seeds, on x64.
12. **THE OBM SEAT IS ABSENT EVERYWHERE.** This exam prices the flight run **without eyes**.
    What a dosed seat would do to it is not measured and is not claimed.
13. **NO GATE MEASURES QUALITY.** Every green gate is a liveness or a receipt. A breached band
    says one guard resolved past tolerance; it does not say the football got worse.

---

## §DEVIATIONS (declared by the executor; the commander disposes)

1. **N = THE AFFORDANCE, NOT THE LITERAL `min()`** — the #414 §CORR 8 floor reading, applied.
   The two sizing rows resolve at n = 87 and n = 6, so the literal minimum is 87; **this stage
   walked 999**, the block's affordance after the construction receipt. Reason: a 12-cluster
   variance estimate is noisy and the faces this exam adds (the receiver class, the
   intended-receiver share, the eighth class's partitions) are rare events with small per-seed
   counts. Walking more can only narrow an interval, never widen one, and it consumes the block
   booked to this stage either way. REALISED half-widths at N: R1 **0.007576** (projected
   0.010307), the negative-Δt half **0.003589** (projected 0.002709).
2. ⚠⚠ **`gRepro` DID NOT GATE — IT STORED** (#420 item 2(iv), by construction, not by choice).
   This host is x64 and every IF-C0 number is arm64 (#418 item 1). The instrument's verdict word
   reads *"≈ cross-architecture (stored, not gated)"* and the re-walked rows sit in
   `repro.crossArch` with every differing field enumerated (§HONEST LIMITS 5). `gDeterminism`
   and `gLockstep` carry the reproduction burden here, and both are GREEN.
3. **TWO INHERITED COMPARISONS WERE STATEMENTS DATED TO DS-T0d's HEAD AND ARE NOW STATED, NOT
   COMPARED** — both DISCLOSED at §DEV-PREFLIGHT and fixed BEFORE the freeze:
   (a) §SEAM-C's `PlayerBrain.ts` line numbers, which IF-T0's insertion moved DOWN by 9 and 35
   (§R4); the gate now compares TEXT + FILE + CLASS exactly, asserts no row moved UP, asserts
   every `TeamBrain.ts` row UNMOVED, and asserts **the fork line itself UNMOVED**. (b)
   §SWITCH-D's `a4World.ts` row (2 / 2 / **0**), which DS-ENTRY-2 made false for
   `dsCoopHatsOff`; that file is now EXCLUDED from the doc-count comparison and its five counts
   are STATED at this head, with only the two zeros that are still claims kept as anchors
   (`ifFlightRun` and `ifLastSeenOwnerGid`).
4. **THE ONE DECLARED ADDED READ.** This instrument pulls `match.perceivedSnapshot(p)` once per
   own-run start tick on the arms carrying `dsOwnRun` (IF-C0's own form). It is the ONLY thing
   this exam adds to a walked match, it is INERT, and `gPullCount` proves it: added pulls
   0 / 54 / 119 / 55 / 151 / 0 / 71 / 162 / 62 / 196 across the ten spied pairs, EQUAL to the
   instrument's own stored count on every one, with the whole-match signatures equal and the
   wrapped observed signature equal to the unwrapped lockstep walk's.
5. **DS-T1d's ACCESSOR SPY IS REMOVED, NOT LEFT DORMANT.** G-ARM-COOP is not in #420's gate set;
   `gArmIF` replaces it and needs no spy. The cooperation counters are still stored per arm
   (`gArmCoop`) as a construction check. **This instrument installs NO wrapper on any walked
   match.**
6. **THE EIGHTH-`why` TOTALS DIFFER BY THE RECEIPT.** `armIf.rows[].eighthWhyDecisions` counts
   the battery **plus the construction receipt** (731,158 on the arm of record); the FACE
   `ifRun.decisionsPerMatch` is over the 999 battery seeds alone (730,280 ⇒ 731.011011 per
   match). Both are stored; the read quotes the face.
7. **G9's BREACH IS THE ONLY ONE, AND IT IS THE SAME LIMB ON ALL THREE DOOR-CARRYING PAIRS.**
   Declared so the commander can see that the read does not hang on a pair-specific accident.
8. **ONE LOO ROW CARRIES FLIPPING SEEDS** (§HONEST LIMITS 3) — `guard.passesPerMatch` on the
   beside pair, 363 seeds, stored. It is not on the comparison of record and breaches nothing.
9. **THE RE-WALK BAND IS IF-C0's OWN CONSUMED BLOCK** (`12,558,000–002`) and is NOT a
   consumption — canon's verifier-scratch rule.
10. **THE COMMIT SITS ON `main`** — the programme's convention (#419 item 0(a)): rulings and
    stage commits share the line the user pushes. Nothing is pushed.

---

## §GATES — 27 of 27 GREEN (`allGreen` = **true**, a STORED boolean)

| gate | verdict | the note derives from |
| --- | --- | --- |
| `gWorld` | ✅ | the FOUR flags exactly as due per arm on every walked match + the construction receipt; `obmMovement` FALSE and NO matrix anywhere (rule (h)); `info.genome` clean; the belief map PRESENT-AND-EMPTY on the world pin at `900,008,470` |
| `gArmIF` | ✅ | the eighth-`why` count EXACTLY 0 and the belief map EMPTY on all three arms without the door, on all 999 seeds + the receipt + two construction walks; NON-VACUOUS on the two that carry it (731,158 / 827,453 decisions, 9,989 belief entries each) |
| `gArmCoop` | ✅ | `overlapSets` / `wallFires` 2,979 / 10,015 on `HATS-E13` and 0 / 0 on every arm carrying `dsCoopHatsOff` — a stored check of construction |
| `gReadLiterals` | ✅ | all FIVE frozen strings (three reads, the fallback, the liveness string) found in BOTH homes on normalised prose; no asymmetry to declare this round |
| `gDoseSource` | ✅ | the L3 / PC dose FILE BYTES hashed and equal to the pins of record |
| `gAnchoredConstants` | ✅ | **171** anchored sites, every one at its declared occurrence count — including IF-T0's own seam lines, the eighth literal, the belief's field and init, the League union key, the arch-keyed fingerprint pair, IF-T0's two intended-receiver `it()` titles, and the two ZERO-count anchors over `a4World.ts` |
| `gPredicateFixtures` | ✅ | **255** fixtures, each predicate with a firing and a non-firing case — incl. the TENTH cell and an EDITED eighth literal landing in OTHER, the start-state and memory partitions, IF-C0's Δt bins at every boundary from both sides, the receiver class, the leak partition, and ⭐ the INTENDED-RECEIVER predicate |
| `gLedgerRead` | ✅ | the engine's own records read where they exist; ⭐ **the ONE NEW REGISTERED READ `match.ifLastSeenOwnerGid`** live on the door-carrying arms and EMPTY on the rest (registry 86 → 87) |
| `gClassesNonVacuous` | ✅ | every class a read stands on is live; the tenth cell non-vacuous on both candidate arms (**this IS `gBiteIF`'s non-vacuity, stored once**); the empty classes and the twelve empty coupling counters ENUMERATED |
| `gCodeFactGraph` | ✅ | 5 hashed roots with extracted callees; 6 `MakeRun` pushes classified; 5 read forks equal on text + file + LINE; the FIVE-member read set equal to the two docs' union; the aliases the FIRST TWO statements inside the fork; the belief's one read + one write site |
| **`gBiteIF`** | ✅ | the **#414 ROW form**: 999/999 eligible seeds' ROWS differ on all three door-carrying contrasts, 0 exempt; the full-time SIGNATURE comparison (999/999) printed beside and gating nothing; non-vacuity 730,280 eighth-`why` decisions |
| `gRepro` | ✅ | **x64: "≈ cross-architecture (stored, not gated)"** — 81 fields × 6 arm-seed rows STORED against IF-C0's, every differing field enumerated, three shape-changed fields named (§DEVIATIONS 2) |
| `gPullCount` | ✅ | 10 spied pairs; the added pulls EQUAL the instrument's own stored count on every one, ZERO on `HATS-E13` and positive on every armed arm; signatures equal; the wrapper transparent |
| `gLockstep` | ✅ | 10 arm × scratch walks, observed ≡ unobserved byte for byte |
| `gDeterminism` | ✅ | X-DET twice per arm on both scratch seeds; signatures and row bytes identical |
| `gFingerprintProd` | ✅ | **ARCH-KEYED**: on x64 `59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d` recomputed in-process, UNCHANGED (#418 item 1's value of record) |
| `gSrcUntouched` | ✅ | `git diff --stat HEAD -- src` / `-- tests` and `git status --porcelain` all EMPTY |
| `gSeedsBookedEqualWalked` | ✅ | 999 distinct battery seeds inside the block + the receipt at `12,559,999`; 5,000 walks booked = walked; the tail is `null` |
| `gSeedDisjoint` | ✅ | every battery seed ≥ 12,559,000; all fifteen consumed blocks end below this base; the re-walks lie inside IF-C0's own block |
| `gN` | ✅ | no override env; the battery ran at exactly N_FROZEN = 999 × 5 arms |
| `gLoo` | ✅ | 40 rows; every flipping row's seeds STORED (§HONEST LIMITS 3) |
| `gScratchBand` | ✅ | all 19 scratch seeds derived from the ONE base `900,008,400` and inside `[900,008,400, 900,008,499]`; the out-of-band list EMPTY; disjoint from the battery block both ways |
| `gTwoFractions` | ✅ | **33** read-bearing quantities published in BOTH fractions |
| `gFaces` | ✅ | **3,357** face-and-Δ checks and **216** stored-bin / median / top-bin-share / partition / R1 / GUARD / READ-WORD / sizing checks re-derived off the SERIALIZED artifact |
| `gReadWords` | ✅ | `floods`, every guard row's harmful-direction test AND its `breachDirection`, `holdsBand`, the selected read, **the liveness precondition**, the precedence step, both counterfactual words and the agreement word re-derived off disk |
| `gHashOrder` | ✅ | the 48-key allowlist schema complete; the body hash computed LAST; `receipts.hashReproducesFromFile` **true** |
| `gStage` | ✅ | `stage.instrument` is this instrument's own path and `stage.instrumentSha256` is the sha256 of the RUNNING file re-read from disk |

**THE ARTIFACT** — `docs/world-model/data/if-t1-flight-run-exam.json`:

* bytes **34,144,497**
* `fileSha256` **`7ab686aa4c8c2dfd5354c9a4b2ca2dbc9f2ec823fe6f4454e6f2f525ad46e22b`**
* `hashedBodySha256` **`2baedec23cd24332a0ea0eaa4c6bee589286df41a8ee3f7aa8b3b3c312aee118`**
* `stage.instrumentSha256` **`a3c647c02c3aab53627bebe9b725923c826fee6337d91b5adf5ff56d6f81566e`**
* `receipts.hashReproducesFromFile` **true**
* `perf.batteryWallSeconds` **2,322.035** · `perf.meanWallSecondsPerMatch` **0.412050**
* `stage.hostArchitecture` **x64**

**CONSUMPTION.** Block `12,559,000–999` consumed whole (999 battery seeds + the construction
receipt at `12,559,999`). Scratch `900,008,400–499` (executor). ZERO stats:
`stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 87 }`. Next sim ≥ **12,560,000**.
