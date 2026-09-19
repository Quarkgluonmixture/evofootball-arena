# IF T1 — 「球在飞时的前插 · 考」 THE FLIGHT RUN'S EXAM

Status: **FROZEN — §0 through §DEV-PREFLIGHT are sealed at the FREEZE commit and are NOT edited
after sight. The battery has not been walked.** The instrument
`scripts/probes/if-t1-flight-run-exam.ts` is byte-identical between FREEZE and RESULTS
(`git diff <freeze> -- scripts/probes/if-t1-flight-run-exam.ts` EMPTY); only this Status
paragraph moves and §R onward is appended.
X-SRC-ZERO holds throughout: not one byte under `src/` or `tests/` is created or edited.
**NOTHING SHIPS** — `ifFlightRun` stays default-OFF, named by no world, and the production
fingerprint is unchanged. The commander rules.

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
