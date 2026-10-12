# OP-C3 — 「谁替他挑了那条线」 THE CHOOSER CENSUS（身前那个人在场时，快照选人那一步自己是怎么读他的：没看出他是威胁，还是看出来了但没有更好的线）

> **STATUS: WALKED — ALL 23 GATES GREEN (`allGreen` = a STORED `true`); THE STORED OUTCOME IS `MISREAD` (§R-OUTCOME).**
> §0 through §DEV-PREFLIGHT and the instrument were sealed at the FREEZE commit `fa556dc` BEFORE any battery seed and were
> NOT edited after sight (`gFrozen` GREEN); only this STATUS paragraph moved and §R onward was appended.
> Authorized by **COMMANDER RULING #434 item 4** (a CENSUS; X-SRC-ZERO; FREEZE then RESULTS; Draft + independent Verify
> in the OP-C2 form), standing on #433 (OP-T1's dispatch), #432 (the user's 「甲吧」 ⇒ 甲 「身前贴着的人要算进去」) and the
> contract [`OP-FRONT-MAN-CONTRACT.md`](OP-FRONT-MAN-CONTRACT.md) §2 M-OP.4 (TRIGGERED at #434).
> Census form of record: [`OP-C2-FEET-ZONE-CENSUS.md`](OP-C2-FEET-ZONE-CENSUS.md) + its instrument, read through its
> §COMMANDER CORRECTIONS (#431); OP-C0 / OP-C1 through theirs (#427 / #429); OP-T1
> ([`OP-T1-FRONT-MAN-EXAM.md`](OP-T1-FRONT-MAN-EXAM.md)) through its §COMMANDER CORRECTIONS (#434).
> Instrument: [`scripts/probes/op-c3-chooser-census.ts`](../../scripts/probes/op-c3-chooser-census.ts) — OP-T1's whole
> instrument COPIED BY RECIPE, ⛔ NEVER IMPORTED, from
> [`op-t1-front-man-exam.ts`](../../scripts/probes/op-t1-front-man-exam.ts) (frozen at `9a1e2e6`), byte for byte in every
> line that writes a stored OP-T1 cell; OP-T1's exam-only machinery (the band, the reads, `gBiteOP`, `gArmOP`) is not
> carried; the census's own lines are marked `⭐OP-C3`.
> Artifact: `docs/world-model/data/op-c3-chooser-census.json` (or its `.RED.json` side path if any gate is red — the
> red-routing idiom).
>
> ⛔ **THIS IS A CENSUS.** It publishes MEASUREMENTS as STORED PARTITIONS and stores ONE outcome string selected by the
> rule #434 froze. It ships nothing. ⛔ **X-SRC-ZERO**: not one byte under `src/` or `tests/` is created or edited
> (`git diff 5306de7 -- src/ tests/` empty); no frozen probe and no pinned test is touched.

## §0 WHAT THIS CENSUS ASKS, AND THE NUMBERS IT STANDS ON

**THE USER'S SENTENCE** (the world-12 verdict, quoted at OP-C0 §0): 「12我看了下,还是有人挤人,传不出去球,传到人身上弹回,或经常传到对面身上」.
**THE USER'S FORK ANSWER** (#432): 「甲吧」 ⇒ 甲 「身前贴着的人要算进去」.

**WHERE OP-T1 LEFT IT** (#434 items 2–3). With the licence armed (`W18-D+OP`), `fb.ground.opponent` moved 0.311715 →
0.306288 (about 1.7 % of the level); the front man was the first body almost as often as before; and **the snapshot
chooser still seated 0.826201 of the front-man releases**. The licence decides WHETHER to pass; once it says pass, the
snapshot chooser decides WHO. #434 item 3: if the chooser MISREADS the man in front, a seat on the chooser stays inside
the user's 甲; if it reads him right and plays the lane because every other option is worse, the fix would be a bar on
passing at all — a pass-or-keep lever, which #430 froze as the user's call. **OP-C3 tells the two apart.**

**THE NUMBERS OF RECORD, READ BY FIELD** (the instrument stores each under `priorOfRecord`, read out of the two
artifacts, never typed; x64, this host, on OTHER blocks — beside, never a paired Δ):

| source artifact | arm | field | num / den | value |
| --- | --- | --- | --- | --- |
| `op-t1-front-man-exam.RED.json` | W18-D | `faces.W18-D.front.share` | 27,627 / 81,321 | 0.339728 |
| `op-t1-front-man-exam.RED.json` | W18-D+OP | `faces.W18-D+OP.front.share` | 26,801 / 80,212 | 0.334127 |
| `op-t1-front-man-exam.RED.json` | W18-D | `faces.W18-D.front.manFirst` | 3,443 / 27,627 | 0.124624 |
| `op-t1-front-man-exam.RED.json` | W18-D+OP | `faces.W18-D+OP.front.manFirst` | 3,268 / 26,801 | 0.121936 |
| `op-t1-front-man-exam.RED.json` | W18-D | `faces.W18-D.front.reseat.snapshot` | 22,968 / 27,627 | 0.831361 |
| `op-t1-front-man-exam.RED.json` | W18-D+OP | `faces.W18-D+OP.front.reseat.snapshot` | 22,143 / 26,801 | 0.826201 |
| `op-t1-front-man-exam.RED.json` | W18-D | `faces.W18-D.fb.ground.opponent` | 25,349 / 81,321 | 0.311715 |
| `op-t1-front-man-exam.RED.json` | W18-D+OP | `faces.W18-D+OP.fb.ground.opponent` | 24,568 / 80,212 | 0.306288 |
| `op-c2-feet-zone-census.json` | W18-D | `faces.W18-D.qc.gs.snap.open` | 3,654 / 4,947 | 0.738629 |
| `op-c2-feet-zone-census.json` | W18-D | `faces.W18-D.qc.gs.snap.shut` | 1,293 / 4,947 | 0.261371 |
| `op-c2-feet-zone-census.json` | W18-D | `faces.W18-D.qc.gs.snapshot.presence.snapshotPresent` | 4,937 / 4,947 | 0.997979 |

(OP-C2's two `qc.gs.snap.*` rows are its `guardSkip` balls — a different population from this census's; they are
printed because they are the chooser's band read of record so far, from the trace, with no front-man split and no
threat setter.)

### 在说人话的层面

上一轮把"身前贴着的人"算进了"传不传"那一步，球撞到对面身上的比例只降了一点点。原因很可能在下一步：决定传之后，
"传给谁"是另一个选择器（快照选人）定的，它在有人贴身的那些球里仍然拍了八成多的板。这一轮不改任何东西，只把那个
选择器在拍板那一刻**自己**算的东西原样再算一遍：它选的那条线它自己认为是"开"还是"关"；贴在身前的那个人在不在它的
眼里；它算出那个人赶到球线上要多久、其中多少是转身的时间、它看到的位置和真实位置差多少、看到的是多久以前的他；
威胁是不是那个人带来的；除了选中的那条，还有没有它自己也认为是"开"的线没选；是不是所有能传的线它都认为是"关"。
最后按 #434 事先定好的规则存一个结论：**看错了他（MISREAD）**、**看对了但没有更好的线（BEST OF A BAD SET）**，或
**两者都不是（NEITHER）**。

## §P THE FREEZE (all of it BEFORE any battery seed)

### §P.A THE ARMS — TWO, PAIRED on shared seeds (#434 item 4(i))

OP-T1's construction, copied BY ANCHOR (`buildMatch`, OP-T1 l.362–374; the `opFrontMan` line is an anchored OP-T1 line):
`new Match({ seed, teamA: teamInfo('A', 2·seed+1), teamB: teamInfo('B', 2·seed+2), ...a4MatchFlags(18) [, opFrontMan:
true] })`, then `armA4World(m, null, 18, L3, PC)` (the shipped loaders' doses, file BYTES pinned).

| arm | dose | `opFrontMan` | role |
| --- | --- | --- | --- |
| `W18-D+OP` | the shipped loaders' played book | `true` | ⭐⭐⭐ **THE CANDIDATE** (what would ship) — THE OUTCOME'S ARM |
| `W18-D` | the same | absent | beside (the user's play) |

The paired Δ `W18-D+OP|W18-D` of every face is printed beside — STORED, NEVER SELECTING. The rule of §P.E applied to
`W18-D`'s stored shares is printed beside too, never selecting.

### §P.B gRepro — FIRST, against OP-T1's STORED per-seed cells (#434 item 4(v))

OP-T1's stored `W18-D` and `W18-D+OP` cells on **12,564,000–011** (`docs/world-model/data/op-t1-front-man-exam.RED.json`,
`perSeedCells[]`, walked on THIS host ⇒ exact) are reproduced in EVERY process BEFORE any census seed: for each of the
12 seeds × 2 arms, (a) the whole-match `signature`, (b) the per-step trajectory digest, AND (c) all **110 keys** of
OP-T1's `ROW_SCHEMA`, in OP-T1's key order, equal OP-T1's stored values cell for cell — with this instrument's observers
AND its re-calls open. ⇒ OP-T1's population, front-man partition, decider attribution and every OP-C2 / OP-C1 / OP-C0
cell it carries are the copies. These seeds are OP-T1's own consumed band (CANON, VERBATIM: *"verifier scratch walks
use the stage's own consumed band or the out-of-band scratch range (≥ 900,000,000) — never the next virgin block"*);
re-walking them is not a consumption. **If gRepro is red, no census seed is walked.**

### §P.C THE POPULATION AND THE COPIED READS (#434 item 4(ii))

* **A GROUND RELEASE** is OP-C0's (via OP-T1): a `shortPass` / `throughBall` / `cutback` released on the ground with a
  target (`isMeasurableGroundPass`); its first body by `contactClassOf` off `ball.lastTouch`.
* **THE DECIDER** is OP-C2's attribution, copied by anchor: `deciderOfQb` of OP-C1's QB cell, read on the CHOICE step
  (the wind-up's arm step, or a synchronous release's own step). **Snapshot-seated** = decider `snapshot`.
* **THE FRONT MEN** of a release are OP-T1's partition, copied by anchor: every live opponent whose closest point on the
  release segment L→E lies STRICTLY ahead of the kicker and within 1.5 m (`0 < along < 1.5`, the radius PARSED from the
  seam's form line; no lateral bound).
* ⭐ **THE POPULATION** = ground releases that are snapshot-seated AND have ≥ 1 front man — exactly OP-T1's re-seat
  cell `frontByDecider[snapshot]` (`gPartition` checks the equality per seed).
* ⭐ **THE SPLIT**: `first` — the first body is one of the front men (OP-T1's `frontManFirst` predicate); `notFirst` —
  it is not. `all` = both.
* ⭐ **THE FRONT MAN OF RECORD** (§P.K 1): the front man who was the first body, if one was; otherwise the front man
  closest to the release segment at release (OP-C0's `centreLineDistOf`), ties to the lower gid.

### §P.D ⭐⭐⭐ THE FACES — read off the chooser's OWN code at the choice tick (#434 item 4(iii))

**THE RE-CALL.** On every scoped snapshot pull, inside the copied observing wrapper, the instrument calls the shipped
pure `choosePerceivedPassTarget` again ON THE VERY SNAPSHOT OBJECT the engine received, at the moment it received it,
with the argument construction of the engine's own call site copied by anchor (§CODE MAP 1): `candidateGids =
passChoiceCandidateGids(p, team.players)`, `attackDir: team.attackDir`, `reachProfiles = match.reachProfiles()`,
`valueAxis: match.edsValueAxis`, and the LN own-lane factor exactly as `PlayerBrain` builds it under `lnOwnLanePrice`.
On the chosen option, if it is READ, it calls `evaluatePassOption` (power 1, as `pricePassOption` does) for the threat
setter, `evaluatePassCorridorInterception` for each opponent in the snapshot, and `estimateReach` at that opponent's
strongest point with the corridor's own reach state and options to split his ETA into movement and turn.
**`gRecall`** proves, on every snapshot-seated ground release, that the re-call returned the engine's pick and its whole
menu exactly as the E3 trace entry stored it (gid, class, price, executable, cell, band); `gLockstep` proves the
re-calls inert.

Per split (`first` · `notFirst` · `all`), every share over the split's population unless named `Given…`:

1. **THE CHOSEN OPTION**: `c3.<t>.chosen.{snapOpen, snapShut, snapUnread}` — OP-C1's `snapCellOf(infoClass, band)`
   copied by anchor (`snapShut` = a READ band whose calibrated reception is below one half, `SHUT_BANDS` derived from the
   shipped table = [3, 4]; `snapUnread` = SEEN-UNREAD); `c3.<t>.info.*`; `c3.<t>.band.{-1…4}`.
2. **THE SECOND-BEST EXECUTABLE OPTION** in the chooser's own order (price descending, ties to the lower gid — its strict
   argmax written as an order): `c3.<t>.second.{snapOpen, snapShut, snapUnread, none}`, `c3.<t>.secondBand.*`;
   **AN OPEN OPTION PASSED OVER** — an executable option other than the pick read `snapOpen`:
   `c3.<t>.openPassedOver` and `c3.<t>.openPassedOverGivenChosen.<cell>`; the mean number of executable options.
3. **ALL SHUT** — every executable option `snapShut`: `c3.<t>.allShut`, and `c3.<t>.allShutGivenChosenShut`.
4. **THE AXIS**: `c3.<t>.valueAxis` — the re-call's `valueAxis` was world 18's `match.edsValueAxis` = true (price =
   the attempt value of (cell, band)) vs the reception axis; `c3.<t>.lnArmed` beside.
5. **THE FRONT MAN OF RECORD IN THE CHOOSER'S READ**: `c3.<t>.fmInSnapshot` (OP-C2's membership: among the opponents of
   the passer's own scoped pull on the choice step); `c3.<t>.threatBy.{frontMan, another, none}` — who set the chosen
   option's threat (`threatDefenderGid`); `c3.<t>.fmState.{notInSnapshot, optionUnread, corridorNull, read}`.
6. **HIS OWN CORRIDOR FACTS** on the chosen option (state `read`): his own band `threatBandIndex(strongestMargin)` (the
   shipped partition, CALLED) and whether it alone is shut; `strongestMargin ≥ 0`; whether he set the threat; his
   `strongestDefenderEta` (bins 0 · 0.1 · 0.25 · 0.5 · 1 · 2 s); **the turn-time part** — `estimateReach`'s `turnTime`
   at his strongest point (bins 0 · 0.05 · 0.1 · 0.2 · 0.3 s) and whether the turn SETS his eta (`turnTime ≥
   movementEta`); whether his control radius already COVERS the ball's path there (`distance === 0`);
   `earliestFeasibleBallTime` (never · 0 · 0.1 · 0.25 · 0.5 s); his **perceived-vs-true position error** (his snapshot
   position against his PRE-STEP position on the choice step; bins 0 · 0.25 · 0.5 · 1 · 2 · 4 m);
   `defenderObservationAgeTicks` (bins 0 · 1 · 6 · 15 · 30 · 60); and the means of margin, eta, turn, error and age;
   the receipt that the movement/turn split re-derives the corridor's own `strongestDefenderEta`.

### §P.E ⭐⭐⭐ THE OUTCOMES — FROZEN BY #434 item 4(iv), COPIED CHARACTER FOR CHARACTER

> (iv) THE OUTCOMES, FROZEN HERE (on the front-man-was-first-body balls of `W18-D+OP`):
> • **MISREAD** — the chosen option is `snapOpen` on ≥ 0.5 of them ⇒ the chooser does not see the man in front as
> a threat; ⇒ **M-OP.5 (the chooser seat) is drafted by the commander under 甲** — its form follows the census's
> answer to WHY (his eta, his facing, his staleness).
> • **BEST OF A BAD SET** — the chosen option is `snapShut` on ≥ 0.5 of them AND every executable option was
> `snapShut` on ≥ 0.5 of those ⇒ the chooser saw him and had nothing better ⇒ **STOP: a human gate** — 「没有好线
> 时要不要宁可不传」 is the user's (the #430 pass-or-keep rule).
> • **NEITHER** ⇒ the commander decides with the table and says why.

**THE FACES THEY ARE READ ON** (all on `W18-D+OP`, split `first`): "the chosen option is `snapOpen` on ≥ 0.5 of them" ⇔
`c3.first.chosen.snapOpen ≥ 0.5`; "the chosen option is `snapShut` on ≥ 0.5 of them" ⇔ `c3.first.chosen.snapShut ≥ 0.5`;
"every executable option was `snapShut` on ≥ 0.5 of those" ⇔ `c3.first.allShutGivenChosenShut ≥ 0.5` (all-shut balls
over the chosen-shut balls; an all-shut ball always has its chosen option shut).

**THE SELECTION** (the instrument's `outcomeOf`, fixtured): on the STORED point shares, in the ruling's order —
MISREAD if `open ≥ 0.5`; else BEST OF A BAD SET if `shut ≥ 0.5` AND `allShut | shut ≥ 0.5`; else NEITHER. A share that is
not a number (an empty denominator) is never ≥ 0.5. The threshold 0.5 is PARSED from the frozen literals (all three
occurrences must agree). The 95 % cluster-bootstrap interval of each of the three shares is stored beside and selects
nothing (§P.K 2). The selected outcome is stored as a string — its word and its sentence — and re-derived off the
serialized artifact (`gOutcomeWords`). `gOutcomeLiterals` finds the three sentences in ruling #434 and in this §P on
normalised prose (blockquote markers — nested ones included — emphasis and backticks removed, whitespace collapsed); the
instrument is the third home.

### §P.F THE ESTIMATOR, THE SEEDS AND THE SIZING (#434 item 4(vi))

* **Estimator** (OP-T1's, copied): every face is a ratio of sums over seeds; the 95 % interval is the cluster bootstrap
  over seeds, 2,000 draws, indices from `Rng(12,565,000)`, the percentile at `floor(q·n)` of the sorted finite draws; a
  paired Δ resamples the same seed indices on both arms.
* **Block `12,565,000–999`** (fresh — every consumed block through OP-T1 `12,564,000–999` ends below it): battery
  `12,565,000–998`, construction receipt `12,565,999`. BOOKED = WALKED: 999 × 2 + 2 = 2,000 walks. ⛔ Never a SIM seed ≥
  12,566,000. ZERO stats; registry 89 (no new registered ledger read).
* **gRepro's re-walk** `12,564,000–011` is OP-T1's own consumed band (not a consumption).
* **N = the affordance (999)** unless the disclosed 12-seed smoke projects the battery past ~10 h; the smoke reports the
  half-width of `c3.first.chosen.snapOpen` on `W18-D+OP` against a declared 0.05 (§DEV-PREFLIGHT).
* **Scratch from ONE base `900,010,200`**, inside `900,010,200–299`: smoke `200–211`, smoke receipt `220`, the world pin
  `270`, lockstep / X-DET `290–291`, the fixtures' sweep `299`. The verifier band `900,010,300–399` is never touched.
* **The battery runs in chunks** (OP-T1's form): the frozen file in `OPC3_MODE=chunk` walks battery index ranges and
  writes their rows to a scratch directory OUTSIDE the repository, each file stamped with the running file's sha256 and
  the FREEZE commit; chunk mode REFUSES unless the running file is byte-identical to the FREEZE blob, and walks gRepro
  FIRST in the same process. `OPC3_MODE=full` walks gRepro FIRST, reads the chunk files, re-walks the first seed of every
  chunk on both arms (signature, trajectory and row must reproduce), walks the receipt, and writes the artifact.

### §P.G THE GATE SET (frozen ex ante) — **23 gates**

The thirteen named by #434 item 4(v) — `gWorld` · `gRepro` · `gLockstep` · `gDeterminism` · `gPartition` ·
`gPredicateFixtures` · `gSeedDisjoint` · `gSeedsBookedEqualWalked` · `gScratchBand` · `gInheritedProse` · `gLedgerRead`
· `gFrozen` · `gXSrcZero` — PLUS six house gates of the OP-C2 / OP-T1 form (`gAnchoredConstants` · `gFingerprintProd` ·
`gN` · `gFaces` · `gHashOrder` · `gStage`) and four receipts this census needs (§P.K 5): `gRecall` · `gClassesNonVacuous`
· `gOutcomeLiterals` · `gOutcomeWords`.

* **`gRepro`** (FIRST, every process): §P.B. RED ⇒ no battery seed is walked or read.
* **`gWorld`**: every walk on world 18 (`ifArmedVersion` 18), the snapshot law absent, the E3 chooser on, the genome
  clean, the trace door shut at construction, `forcedPassTarget` null, `opFrontMan` as due per arm on every walk and the
  receipt; the pin at `900,010,270`: the value axis ON and the LN seat ON (the two settings the re-call copies) and the
  other world-18 doors as OP-T1 pinned them; `a4MatchFlags(18)` does not name the door; the dose bytes.
* **`gLockstep`** (2 arms × `290–291`, observed — wrapper, trace door AND re-calls — ≡ unobserved signatures) ·
  **`gDeterminism`** (X-DET: signature, trajectory and row identical twice per arm; in full mode the chunk re-walks).
* **`gPartition`**: OP-T1's partitions (OP-C0 owners, QA, QB, QC, QD, the front / pressed / possession checks) and the
  census's: the population = OP-T1's `frontByDecider[snapshot]`; `first` ≤ `frontManFirst`; the receipt counts every
  snapshot-seated ground release; every split table sums to that split's re-called population and the front man's fact
  tables to his `read` state — per arm AND per seed.
* **`gRecall`**: §P.D — the re-call agrees with the trace on EVERY snapshot-seated ground release of both arms; no
  population ball lacks a re-call; the movement/turn split re-derives the corridor's ETA for every front man read.
* **`gClassesNonVacuous`**: both splits of the population are LIVE on both arms, POOLED over seeds (no share of seeds,
  no "every seed").
* **`gOutcomeLiterals`** · **`gOutcomeWords`**: §P.E.
* **`gPredicateFixtures`**: OP-T1's fixtures re-run, and every new predicate with a FIRES and a DOES-NOT case (the
  chooser's own order, the second-best cell, all-shut, an open option passed over, the threat setter, the front man's
  state and his record, the turn-bound and covered tests, the bins, the shipped band partition CALLED, the outcome rule
  and its parsed threshold, his facts CALLED on a synthetic snapshot).
* **`gSeedDisjoint`** · **`gSeedsBookedEqualWalked`** (exactly `12,565,000–998` in order + the receipt) ·
  **`gScratchBand`** · **`gN`** (999, no override env).
* **`gInheritedProse`** — BY DIFF against the source instruments (CANON, #424 item 4), ⛔ no token list: every prose
  string in the hashed body (≥ 40 characters and ≥ 5 words; the anchors' code needles excluded, each re-checked by
  `gAnchoredConstants`) is compared byte for byte with every string of the OP-T1 and OP-C2 artifacts and with the text of
  the OP-T1 / OP-C2 / OP-C1 / OP-C0 instruments; every identical string is LISTED for a human re-read and the gate is RED
  unless each listed string carries a frozen re-read record in the instrument.
* **`gLedgerRead`**: registry **89**, unchanged — no new registered ledger read; the engine records read and the declared
  reconstructions listed.
* **`gAnchoredConstants`** (every needle at its count — the chooser's call site, `pricePassOption`, `evaluatePassOption`,
  the corridor and `estimateReach` included, four NEGATIVE needles at 0) · **`gFingerprintProd`** (in process, x64
  `59f42aa7…a072d`) · **`gFaces`** (every face re-derived off disk) · **`gHashOrder`** · **`gStage`**.
* **`gFrozen`**: in full mode, the running instrument is byte-identical to the FREEZE commit's blob, this doc's region
  from `## §0` to `## §R` is byte-identical to the FREEZE commit's, and every chunk is stamped with this file and that
  commit (in smoke it is not applicable and says so).
* **`gXSrcZero`**: `git diff 5306de7 -- src/ tests/` empty, `git status --porcelain -- src tests` empty, and in full mode
  `git diff --stat FREEZE..HEAD -- src tests` empty.

⛔ **No gate measures a direction.** The arms' difference is printed, never gated; there is no liveness gate (a census
of a chooser on two arms; nothing here asks a door to fire).

### §P.K DEPARTURES DECLARED BEFORE THE FREEZE (each repeated at §DEVIATIONS; the commander disposes)

1. **THE FRONT MAN OF RECORD.** #434 speaks of "that man"; OP-T1's partition can hold several front men on one release.
   The split is OP-T1's own (`first` ⇔ ANY front man was the first body). For the per-man faces the man of record is the
   first-body front man when there is one (so on the `first` split — the outcome's — he is exactly the man who touched
   the ball), else the front man nearest the release segment, ties to the lower gid.
2. **THE OUTCOME IS SELECTED ON POINT SHARES.** #434 says "computed on stored values with intervals": the three shares'
   intervals are stored beside; the selection reads the stored point values, in the ruling's order (MISREAD first; the
   two cannot both hold except at exactly 0.5 / 0.5, where MISREAD is checked first).
3. **THE OUTCOME LITERALS ARE THE RULING'S NORMALISED PROSE.** The ruling breaks a line inside 「没有好线 / 时要不要宁可不传」;
   the normaliser (OP-T1's, copied) joins lines with one space, so the instrument's literal carries 「没有好线 时要不要宁可不传」
   with that space, and §P.E above keeps the ruling's own line break.
4. **THE RE-CALL RUNS INSIDE THE OBSERVING WRAPPER**, at the moment of the engine's own pull, on the returned object —
   `perceivedSnapshot` reconstructs body memory as it runs, so it is NEVER called a second time; `match.reachProfiles()`
   (a pure method the E3 block calls right after the pull) IS called there. `gRecall` + `gLockstep` prove faithful and
   inert.
5. **GATES ADDED** to #434's thirteen: the six house gates OP-C2 / OP-T1 carried, and four receipts — `gRecall` (the
   faces are the chooser's own only if the re-call IS the chooser), `gClassesNonVacuous` (pooled), `gOutcomeLiterals` and
   `gOutcomeWords` (the outcome's three homes and its re-derivation, OP-T1's `gReadLiterals` / `gReadWords` form). OP-T1's
   `gArmOP` is folded into `gWorld` (the door per arm on every walk); `gBiteOP` and the band are not carried.
6. **HIS CORRIDOR FACTS EXIST ONLY ON A READ OPTION.** When the chosen option is SEEN-UNREAD the chooser read no corridor
   for it (`pricePassOption`'s null branch); his state is then `optionUnread` and no fact of his is invented.
7. **"HIS FACING" IS READ THROUGH THE TURN-TIME PART** of his ETA (`estimateReach` turns at `TURN_RATE` toward the ball
   point); no separate facing angle is stored.
8. **THE PERCEIVED-VS-TRUE ERROR** is his snapshot position against his PRE-STEP position on the choice step (the
   positions the brain decided on; OP-C2's choice-step convention).
9. **THE REGISTRY STAYS 89** (#434 item 5): the re-call reads the snapshot object the engine already returned and two
   world flags OP-T1's pin already read; no new ledger read is registered.
10. **THE BATTERY RUNS IN CHUNKS** (OP-T1 §P.L 2's form).

## §CODE MAP — the chooser's call site, its price, and how estimateReach treats a man whose reach already covers the ball's path (DESCRIBES; designs nothing)

Line numbers are at `5306de7` (= HEAD's `src/`: `git diff 5306de7 -- src/ tests/` is empty), each an anchor receipt
(`anchors[]`, occurrence-counted by `gAnchoredConstants`).

1. **THE CALL SITE — `src/ai/PlayerBrain.ts`, the E3 block inside `decideCarrier`.**
   * It runs only after the brain has chosen to pass: `match.edsPerceivedChoice && top.action === 'Pass' && top !==
     cutbackCand` (l.1439) `&& p.role !== 'GK' && bestMate !== null` (l.1440). It decides WHO; the licence (the `Pass`
     candidate's `bestPass`, from `groundCandidate`) decided WHETHER.
   * `const candidateGids = passChoiceCandidateGids(p, team.players);` (l.1452) — the 6–30 m window on TRUE positions
     (`perceivedPassChoice.ts` l.158–172); the scope is the passer, the candidates (l.1453), every live opponent
     (l.1454) and, under the LN seat, the passer's own outfield men (l.1461–1462).
   * `const snapshot = candidateGids.length === 0 ? null : match.perceivedSnapshot(p, scope);` (l.1463) — the one pull;
     `const reachProfiles = snapshot === null ? null : match.reachProfiles();` (l.1464) — every live body's `topSpeed`,
     `accel`, `dribbling` (`Match.ts` l.5803–5810).
   * The LN own-lane factor (l.1477–1486): with `lnSeat = match.lnOwnLanePrice ? { w: lnOwnLaneWeightOf(g) } : null`
     (l.276), each executable option's price is multiplied by `1 − ownLanePrice(w, ownLaneOpenness(perceived passer,
     perceived target, own perceived bodies))`, and by 1 when the passer or the target is not in his snapshot (l.1482).
   * The call (l.1487–1497): `choosePerceivedPassTarget({ snapshot, passerGid: p.gid, candidateGids, attackDir:
     team.attackDir, reachProfiles, valueAxis: match.edsValueAxis, ownLaneFactor: lnOwnLaneFactor })`; `if (chosen)
     passMate = chosen;` (l.1503). The trace door (l.1504–1544) stores the menu as priced (l.1535–1542).
   * **WORLD 18'S ARGUMENTS:** `edsValueAxis: true` (`A4_WORLD_FLAGS`, `a4World.ts` l.317–320, carried up the world
     ladder by `a4MatchFlags`; `Match.ts` l.2603 reads it) — THE VALUE AXIS; `lnOwnLanePrice` ON (`LN_WORLD_DOORS`,
     `a4World.ts` l.1347, composed at l.377–378) with `lnOwnLaneWeight = LN_WORLD_WEIGHT` 0.25 on the team genome view
     (l.1356, `setLnGene` l.1373–1378) — so `ownLaneFactor` is SUPPLIED. Both are asserted on the pin (`gWorld`).
2. **THE PRICE — how corridor facts become band and price (`src/ai/perceivedPassChoice.ts`).**
   * `pricePassOption` (l.178–249): a target or passer missing from the snapshot ⇒ `UNSEEN`, never executable (l.191–208).
     Otherwise `const read = evaluatePassOption({ snapshot, passerGid, targetGid, powerMultiplier: 1, attackDir,
     reachProfiles })` (l.214–216); `read === null` ⇒ `SEEN-UNREAD`, band −1, executable, priced by the distance prior
     (or, on the value axis, `attemptValueAt(cell, -1)`) (l.217–234).
   * READ (l.235–248): `reception = threatQuintilePrice(read.interceptionThreatSeconds)` and `band =
     threatBandIndex(read.interceptionThreatSeconds)` — the SAME quintile partition of THE THREAT, a time in seconds
     (l.140–155; `passPrior.ts` `THREAT_CALIBRATION` l.537–573: band 0 up to 0.038622 s, band 1 to 0.295587, band 2 to
     0.536388, band 3 to 0.805767, band 4 above; calibrated clean reception 0.828628 · 0.623081 · 0.509658 · 0.471521 ·
     0.431402). On the value axis `value = attemptValueAt(cell, band)` (l.237) and `price = value` (l.243): THE PRICE IS
     THE MEASURED SHOT-WITHIN-4-s RATE OF (destination cell, band), not the reception; the reception survives as a
     reported field only. `cell` is the PERCEIVED target's zone (l.213).
   * `choosePerceivedPassTarget` (l.258–305): prices every candidate (l.263–265), multiplies executable prices by the LN
     factor (l.270–273), and picks the strict argmax of `price` over EXECUTABLE options, ties to the lower gid
     (l.274–279). ⛔ There is NO bar: the argmax compares options with each other only, and no band is compared with a
     threshold (NEGATIVE needle `band >` at 0) — the chooser always plays its best executable option, whatever band it
     sits in.
   * The threat is `evaluatePassOption`'s (`src/ai/passOptionValue.ts` l.114–190): over every snapshot entry not on the
     passer's side (l.155–156), `evaluatePassCorridorInterception` (l.157–159), the threat = the STRICTLY largest
     `strongestMargin` (l.161–164) and `threatDefenderGid` = the opponent who set it (l.163). ONE man sets the band.
   * The corridor (`src/ai/passCorridorInterception.ts` l.62–160): the flight starts at the passer's PERCEIVED position
     (l.97) and is stepped tick by tick (l.109–133); at each ball point `defenderEta = estimateReach(defenderState, point,
     { reachRadius: CONTROL_RADIUS }).eta` (l.116–118) on the defender's PERCEIVED position, velocity and body direction
     (`reachState` l.44–54); `margin = ballTime − defenderEta` (l.119); `strongestMargin` = the largest margin over the
     flight (l.122–128); `earliestFeasibleBallTime` = the first tick with margin ≥ 0 (l.129–132); his
     `defenderObservationAgeTicks` is carried out (l.158). No `reactionDelay` and no `requireFacing` are passed (NEGATIVE
     needles at 0) ⇒ reaction delay 0, facing required.
3. **`estimateReach` WHEN HIS REACH ALREADY COVERS THE BALL'S PATH (`src/ai/reachability.ts` l.51–130).**
   * `distance = max(0, centerDistance − reachRadius)` (l.60) with `reachRadius = CONTROL_RADIUS`;
     `reactionDelay = max(0, options.reactionDelay ?? 0)` (l.61) — 0 from the corridor.
   * If the ball point lies within his control radius (`distance === 0`, l.63), movement is 0 and the ETA is
     `reactionDelay + turnTime` (l.72) — i.e. **the turn alone**: `turnTime = acos(bodyDir · direction to the point) /
     TURN_RATE` (l.69; `TURN_RATE = 6.5` rad/s, `Player.ts` l.18 — at most π / 6.5 ≈ 0.48 s for a point straight
     behind him; 0 for a point he faces).
   * Outside the radius the ETA is `max(movementEta, turnTime)` (l.122) — heading turns concurrently with movement.
   * ⇒ For a man whose radius covers a stretch of the flight, the corridor's margin at each point of that stretch is
     `ballTime − turnTime` (his perceived body direction against the direction to that point): it is positive wherever
     his turn to the point is shorter than the time the ball has been travelling, and the strongest margin is the largest
     such value over the ticks the ball spends inside his reach. Whether it lands in an "open" band (0–2, up to 0.536388 s)
     or a "shut" band (3–4) is therefore a matter of how long the ball stays in his reach and of his turn — what §P.D 6
     stores.
4. **THE TRACE vs THE RE-CALL.** The trace entry stores, per option, `targetGid`, `infoClass`, `price`, `executable`,
   `cell`, `band` (l.1535–1542) — not the threat setter, not any defender's margin, not the movement / turn split. Those
   are read ONLY by the re-call; `gRecall` ties the re-call to the trace option for option.

⚠ The map is needle-anchored, not a whole-function extracted call graph.

## §DEV-PREFLIGHT — the disclosed smoke, IN FULL (before the freeze)

Every run below used scratch seeds inside `900,010,200–299` (plus gRepro's re-walk of OP-T1's own band), with the
artifact routed OFF every canonical path by the instrument's override guard. ⛔ Their numbers are NOT results.

1. **THE SHAKE-OUT** (2 seeds `900,010,200–201`, two arms; `OPC3_MODE=smoke OPC3_N=2 OPC3_OUT=<scratch>`). `gRepro`
   **24 / 24 GREEN at the first attempt** (OP-T1's signatures, trajectory digests and all 110 row keys, with the re-calls
   open); `gRecall` GREEN (every snapshot-seated ground release's re-call equal to its trace entry). 20 / 23 gates; three
   RED, all fixed BEFORE the freeze, no predicate of record changed:
   * `gAnchoredConstants` 79 / 80 — a needle `    price: valueAxis ? value : reception,` declared at count 1 also
     matches, as a substring, the two lines indented deeper; the two price anchors were merged into one needle at its
     true count 3. Two needles were then ADDED for the corridor's `reachState` lines that `fmFactsOf` copies (81 needles).
   * `gPredicateFixtures` 255 / 256 — the fixture `facts.away.marginBelowFacing` expected a man 1 m ahead FACING AWAY to
     have a smaller strongest margin than the same man facing the passer; the shipped corridor says otherwise (the
     strongest margin is set where the ball passes him, a point he then faces). The expectation was wrong, not the code;
     the fixture was replaced by a true one, `facts.away.feasibleLaterThanFacing` (facing away, his first feasible tick
     comes later).
   * `gOutcomeLiterals` 3 / 6 — this doc did not exist yet (the second home).
2. **THE SMOKE OF RECORD** (12 seeds `900,010,200–211` × 2 arms, receipt `220`; `OPC3_MODE=smoke OPC3_N=12
   OPC3_OUT=<scratch>`): **23 / 23 GATES GREEN**, first on the file frozen here minus the two sizing constants, then again
   on the file WITH them (identical gate verdicts and faces; smoke artifact `bodySha256
   6c506db7ef9c9ab6a2c59f0c927442cb8968d8c4f755de11dcddf9db237268cd`). 81 anchors; 256 fixtures; `gRecall` W18-D
   730 / 730 (eta split 283 / 283) and W18-D+OP 760 / 760 (279 / 279); 116 prose fields compared by diff, 0 listed.
   The LN seat read on the pin: `lnOwnLaneWeight` 0.25 on both sides of both arms; `edsValueAxis` true.

**SIZING** (the house form, #415): the level of `c3.first.chosen.snapOpen` on `W18-D+OP` at n = 12 has half-width
**0.16595744680851066** (`HW_SMOKE_RECORD`, transcribed) against the declared **0.05**: `se(12) = 0.0846737226385596`,
`se(needed) = 0.017847038768172088`, **`nRequired` = 271**. **WALL** 0.285875 s per walked match
(`WALL_PER_MATCH_SMOKE_RECORD`, transcribed) ⇒ 2,000 walks ≈ **0.16 h**, far inside ~10 h ⇒ **N = THE AFFORDANCE, 999**,
not halved. Those two constants are the only bytes changed after the smoke of record.

⚠ The smoke's other numbers are NOT results (scratch seeds, 45 `first` balls on the candidate): they are disclosed only
so the instrument is seen to run — W18-D+OP `c3.first.chosen.snapOpen` 0.622222 (28 / 45), `snapShut` 0.377778,
`allShutGivenChosenShut` 0.470588; the stored scratch outcome string was `MISREAD`. No reading is taken on them.

## §R RESULTS (every number below QUOTES the artifact's own fields, six decimals — the artifact is the numbers of record)

**RUN RECEIPTS.** FREEZE **`fa556dc`**; the running instrument = the FREEZE blob (`frozen.runningIsFreezeBlob` true;
`stage.instrumentSha256 = 22046c256a609f4cc0235ff10adddae824abd8bd9e57e89854e5795816da1fd5`); the doc's §0 → §R region
byte-identical to the FREEZE commit's (32,949 bytes). **`allGreen` = true** (23 gate objects, every one `ok: true`).
Artifact `docs/world-model/data/op-c3-chooser-census.json`, **9,995,648 bytes**, `bodySha256 =
d65fb5b85b9eb0aa3ef7438d96e4412f5ef6d36cc0cefc47e33a4d3e8af94484`, `receipts.hashReproducesFromFile` **true**. Battery
**999 seeds (12,565,000–12,565,998) × 2 arms + the receipt 12,565,999 × 2 = 2,000 walks BOOKED = WALKED**, from four
chunk processes (`0–250 · 250–500 · 500–750 · 750–999`, each gRepro 24 / 24 first, each stamped with the FREEZE file and
commit) and the full run (chunk integrity 8 / 8). **`gRepro` 24 / 24** (OP-T1's signatures, trajectory digests and all 110
row keys on 12,564,000–011). **`gRecall`**: W18-D **57,765 / 57,765**, W18-D+OP **56,533 / 56,533** snapshot-seated ground
releases whose re-call equals the trace entry option for option; the eta split re-derives the corridor's own ETA on
21,325 / 21,325 and 20,601 / 20,601 front men read. `gLockstep` 4 / 4, X-DET 4 / 4. **X-SRC-ZERO**: `git diff 5306de7 --
src/ tests/` 0 bytes, porcelain 0 bytes, FREEZE..HEAD stat 0 bytes. **X-FP-PROD** `fingerprintProd.computed` =
`59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d` (x64 pin). ZERO stats, registry 89.
`perf.batteryInWalkSeconds` 718.61 over 1,998 battery walks.

### §R1 — THE POPULATION (`population`, `faces.*.c3.*`)

| face | W18-D+OP | W18-D | Δ [interval] |
| --- | --- | --- | --- |
| ground releases with a front man (`front.share`) | 0.337353 (26,744 / 79,276) | 0.342047 (27,491 / 80,372) | −0.004694 [−0.008189, −0.001051] |
| …seated by the snapshot chooser (`c3.populationShareOfFrontReleases` = `front.reseat.snapshot`) | 0.817006 (21,850) | 0.823469 (22,638) | −0.006464 [−0.011790, −0.001263] |
| …of which a front man was the first body (`c3.firstShare`) | 0.139176 (**3,041**) | 0.138705 (3,140) | +0.000471 [−0.004501, 0.005853] |
| `notFirst` | 18,809 | 19,498 | |

Beside (this block, the same faces OP-T1 read on its own): `fb.ground.opponent` W18-D+OP 0.310788 · W18-D 0.308602, Δ
+0.002185 [−0.001377, 0.005538] — unresolved on this block; `front.manFirst` 0.123317 · 0.124222, Δ −0.000905
[−0.005482, 0.003976]. ⛔ No verdict word; this census does not read them.

### §R2 ⭐⭐⭐ — THE CHOSEN OPTION (the outcome's faces; split `first`)

| face (`c3.first.*`) | W18-D+OP | W18-D | Δ [interval] |
| --- | --- | --- | --- |
| ⭐ `chosen.snapOpen` | **0.746465** (2,270 / 3,041) [0.730692, 0.761796] | 0.746497 (2,344 / 3,140) [0.730470, 0.762346] | −0.000032 [−0.017552, 0.017616] |
| ⭐ `chosen.snapShut` | **0.252877** (769 / 3,041) [0.237475, 0.268637] | 0.253185 (795 / 3,140) | −0.000307 [−0.018006, 0.017261] |
| `chosen.snapUnread` | 0.000658 (2) | 0.000318 (1) | |
| ⭐ `allShutGivenChosenShut` | **0.323797** (249 / 769) [0.291156, 0.356959] | 0.353459 (281 / 795) | −0.029662 [−0.066616, 0.009238] |
| `allShut` (over the split) | 0.081881 (249 / 3,041) | 0.089490 | −0.007609 [−0.019134, 0.004129] |
| the chosen band −1 · 0 · 1 · 2 · 3 · 4 | 0.000658 · 0.175929 · 0.421901 · 0.148635 · 0.150280 · 0.102598 | 0.000318 · 0.193631 · 0.415924 · 0.136943 · 0.154459 · 0.098726 | |
| `info.READ` | 0.999342 | 0.999682 | |
| `valueAxis` (the price on the value axis) | **1** (3,041 / 3,041) | 1 | |
| `lnArmed` | 1 | 1 | |

Split `notFirst` (W18-D+OP): `chosen.snapOpen` 0.687118 (12,924 / 18,809) · `snapShut` 0.311659 · `snapUnread` 0.001223;
`allShutGivenChosenShut` 0.386557 (2,266 / 5,862). Pooled `all`: open 0.695378 · shut 0.303478.

### §R3 ⭐⭐⭐ — THE FRONT MAN OF RECORD IN THE CHOOSER'S READ (W18-D+OP; W18-D in brackets)

| face | `first` | `notFirst` |
| --- | --- | --- |
| in the passer's snapshot at the choice (`fmInSnapshot`) | **0.997040** (3,032 / 3,041) [0.998408] | 0.934074 [0.932916] |
| he set the chosen option's threat (`threatBy.frontMan`) | **0.365998** [0.382484] | 0.157052 [0.162222] |
| another opponent set it (`threatBy.another`) | **0.633344** [0.617197] | — |
| his own band, alone (`fm.ownBand.0` · `.1` · `.2` · `.3` · `.4`, of `read`) | **0.476913 · 0.520449** · 0.002639 · 0 · 0 [0.469219 · 0.527911 · 0.002552 · 0.000319 · 0] | 0.892595 · 0.107120 · … |
| his own band SHUT (`fm.ownBandShut`) | **0** (0 / 3,032) [0.000319] | 0.000114 |
| his strongest margin ≥ 0 (he can be there first) | **0.656662** [0.668262] | 0.184017 |
| mean strongest margin (`fm.meanMarginE6`, µs) | 11,452.942612 ≈ **+0.011 s** [16,301.061882] | −522,505.967158 ≈ −0.52 s |
| his ETA at the strongest point < 0.1 s (`fm.eta.ge0`) | **0.585092** [0.607337]; [0.1, 0.25) 0.296504 | 0.169105 |
| mean ETA (`fm.meanEtaE6`) | 131,571.458113 µs ≈ 0.132 s | ≈ 0.863 s |
| THE TURN SETS HIS ETA (`fm.turnSetsTheEta`) | **0.757586** [0.764912] | 0.227560 |
| his reach COVERS the ball's path at the strongest point (`fm.coveredAtStrongest`) | **0.525726** [0.530144] | 0.139507 |
| turn-time part: [0, 0.05) · [0.05, 0.1) · [0.1, 0.2) · [0.2, 0.3) · ≥ 0.3 s | 0.428760 · 0.231860 · 0.258245 · 0.047823 · 0.033311; mean 84,922.933377 µs ≈ 0.085 s | mean ≈ 0.137 s |
| earliest feasible ball time: never · [0, 0.1) · [0.1, 0.25) · [0.25, 0.5) · ≥ 0.5 s | 0.343338 · 0.324868 · 0.319591 · 0.011214 · 0.000989 | never 0.815983 |
| perceived-vs-true error < 0.25 m (`fm.err.ge0`) | **0.962731** [0.961722]; mean 85,167.473945 µm ≈ 0.085 m | 0.891058; mean ≈ 0.246 m |
| observation age 0 ticks (`fm.age.ge0`) | **0.954485** [0.955662]; mean 0.563325 ticks | 0.882350; mean 2.713302 |

### §R4 — THE MENU (W18-D+OP; W18-D in brackets)

| face | `first` | `notFirst` |
| --- | --- | --- |
| an OPEN option passed over (`openPassedOver`) | **0.672476** (2,045 / 3,041) [0.665605] | 0.655963 |
| …given the pick was `snapOpen` | 0.671806 [0.672355] | |
| …given the pick was `snapShut` | **0.676203** (520 / 769) [0.646541] | |
| the second-best executable option: open · shut · unread · none | 0.478461 · 0.393949 · 0 · 0.127590 [0.493631 · 0.384713 · 0 · 0.121656] | open 0.473231 |
| the second-best's band −1 · 0 · 1 · 2 · 3 · 4 · none | 0 · 0.124630 · 0.170339 · 0.183492 · 0.196317 · 0.197632 · 0.127590 | |
| executable options per choice (mean) | 2.757646 [2.745860] | |
| every executable option shut (`allShut`) | 0.081881 [0.089490] | 0.120474 |

## §R-OUTCOME — THE OUTCOME OF RECORD

> ## MISREAD

**`outcome.word` = `MISREAD`**, `outcome.sentence` = the frozen literal: *"MISREAD — the chosen option is snapOpen on ≥ 0.5
of them ⇒ the chooser does not see the man in front as a threat; ⇒ M-OP.5 (the chooser seat) is drafted by the
commander under 甲 — its form follows the census's answer to WHY (his eta, his facing, his staleness)."* Selected on the
stored share `c3.first.chosen.snapOpen` = **0.746465** (2,270 / 3,041) ≥ 0.5 on W18-D+OP, interval [0.730692, 0.761796]
(wholly above 0.5). Beside, never selecting: `c3.first.chosen.snapShut` 0.252877 [0.237475, 0.268637];
`c3.first.allShutGivenChosenShut` 0.323797 [0.291156, 0.356959]; the rule on W18-D's stored shares also gives `MISREAD`
(`outcome.besideControlArm`). Re-derived off the serialized artifact by `gOutcomeWords` (GREEN).

**THE CENSUS'S ANSWER TO WHY, as stored (#434 item 4(iv) asks for it; ⛔ no design here).** On the `first` balls of
W18-D+OP: the chooser HAD the man (in his snapshot 0.997040; position within 0.25 m of the truth 0.962731; observed this
very tick 0.954485) — **not staleness, not perception**. Read alone, the man prices the line in band 0 or 1 on
0.997362 of them (0.476913 + 0.520449) and in a shut band on 0 of 3,032 — while his own margin is ≥ 0 (he can be at the
ball before it) on 0.656662, his ETA is under 0.1 s on 0.585092 and his reach already covers the ball's path at his
strongest point on 0.525726. His ETA is set by his TURN on 0.757586 (mean turn part ≈ 0.085 s). His mean strongest margin
is ≈ +0.011 s: the corridor law measures the threat as TIME (ball time − his ETA), and a man the ball passes inside his
reach within a tenth of a second gets a small positive margin, which the calibration (`THREAT_CALIBRATION`, band 0 up
to 0.038622 s, band 1 up to 0.295587 s) prices as open. The shut band, when there is one, is set by ANOTHER opponent
(`threatBy.another` 0.633344). And the menu was not all bad: an open option was passed over on 0.672476 (0.676203 even
when the pick was shut); every executable option was shut on 0.081881.

## §R6 在说人话的层面

⛔ 这一段只把上面的数换成白话。

* 结论（按冻结的规则存下来的）：**看错了他（MISREAD）**。
* 只看"身前那个人最后先碰到球"的那 3,041 个球：快照选人那一步，有 0.746465 的球它自己认为选的那条线是"开"的。
  超过一半，所以是 MISREAD。
* 它不是没看见他：那个人在传球人的视野里占 0.997040；看到的位置和真实位置差不到 0.25 米的占 0.962731；
  看到的就是这一帧的他，占 0.954485。所以不是"看不见"，也不是"看到的是旧的"。
* 它是算错了他：它用"球到那一点的时间减去他赶到那一点的时间"来算威胁。这个人就贴在球线上，球一出脚就从他身边
  过去，时间差很小（平均约 0.011 秒）。在它的价目表里，这么小的时间差算"开"。单看他一个人，把线算成"关"的
  球一个都没有（0 / 3,032）。
* 他赶到球线要的时间，大多就是转身的时间（0.757586）；一半多的时候，球本来就在他伸脚够得到的范围里（0.525726）。
* 被选的线如果是"关"，多数是别的对手造成的（0.633344），不是他。
* 也不是"没有更好的线"：有 0.672476 的球，还有别的它自己也认为"开"的线没选；所有线都"关"的只有 0.081881。
* 按 #434，下一步由指挥官在"甲"的范围里起草选人那一步的改法（M-OP.5）。

## §HONEST LIMITS

1. ⭐⭐ **"OPEN" / "SHUT" IS OP-C1's DECLARED COIN** (a READ band whose calibrated reception is below one half). The
   outcome is frozen on that coin; all six bands are stored (§R2), so the reading moves with the line: bands 2–4
   together are 0.148635 + 0.150280 + 0.102598 = 0.401513 of the `first` picks (sum of stored shares).
2. ⭐⭐ **THE PRICE IS ON THE VALUE AXIS** (`valueAxis` 1): the argmax compares `attemptValueAt(cell, band)` × the LN
   factor, not the reception. A pick's band says how the chooser read the threat; WHY it preferred that option over an
   open one it passed over (0.672476) is the cell's value, which this census does not decompose.
3. **"THAT MAN" IS THE FRONT MAN OF RECORD** (§P.K 1). On `first` he is the man who touched the ball; on `notFirst` he is
   the front man nearest the line — a choice, printed beside, read by no outcome.
4. **HIS FACTS ARE THE CORRIDOR'S, ON THE CHOSEN OPTION ONLY**; options not picked are described only by their band.
5. **"HIS FACING" IS READ THROUGH THE TURN-TIME PART** (§P.K 7); no facing angle is stored.
6. **THE BLOCK'S `fb.ground.opponent` Δ IS UNRESOLVED** (+0.002185 [−0.001377, 0.005538]) where OP-T1's block resolved
   −0.005427; printed beside only, read by nothing here.
7. **ONE BLOCK, ONE HOST, x64**, N = 999; arm64 is ≈ only (#418).
8. **NO GATE MEASURES QUALITY.** Every gate is a liveness or a receipt.

## §DEVIATIONS (declared by the executor; the commander disposes)

1–10. **As declared before the freeze at §P.K 1–10** (the front man of record; the outcome on point shares; the literals'
   normalised line break; the re-call inside the observing wrapper; the gates added and `gArmOP` folded into `gWorld`;
   facts only on a READ option; facing through the turn; the error against pre-step positions; registry 89; the chunked
   battery).
11. **AFTER THE SHAKE-OUT, BEFORE THE FREEZE**: two anchor needles merged (a substring count), two added, one fixture
   expectation corrected (`facts.away.marginBelowFacing` → `facts.away.feasibleLaterThanFacing`) — §DEV-PREFLIGHT 1. No
   predicate of record changed.
12. **TWO CONSTANTS TRANSCRIBED AFTER THE SMOKE OF RECORD**: `HW_SMOKE_RECORD` 0.16595744680851066 and
   `WALL_PER_MATCH_SMOKE_RECORD` 0.285875.
13. **THE STATUS PARAGRAPH** above §0 moved at RESULTS; §0 → §DEV-PREFLIGHT did not (`gFrozen`).
14. **NOT PUSHED.** Two commits on the local branch `wm/op-c3-434`.

## §GATES — 23 of 23 GREEN (`allGreen` = **true**, a STORED boolean)

| gate | verdict | note (stored in `gates[]`) |
| --- | --- | --- |
| `gRepro` | ✅ | 24 / 24: OP-T1's signature, trajectory digest and all 110 row keys on 12,564,000–011 (and in each chunk process) |
| `gLockstep` | ✅ | 4 / 4 observed (wrapper, trace door, re-calls) ≡ unobserved |
| `gDeterminism` | ✅ | X-DET 4 / 4; chunk integrity 8 / 8 |
| `gFingerprintProd` | ✅ | x64 `59f42aa7…` in process |
| `gXSrcZero` | ✅ | all three diffs 0 bytes |
| `gFrozen` | ✅ | instrument = FREEZE blob of `fa556dc`; §0 → §R region (32,949 bytes) identical; chunks stamped |
| `gWorld` | ✅ | every walk and the pin (value axis ON, LN seat ON, `lnOwnLaneWeight` 0.25 both sides) |
| `gSeedsBookedEqualWalked` | ✅ | 2,000 walks |
| `gSeedDisjoint` | ✅ | 21 consumed blocks below the base; no SIM seed ≥ 12,566,000 |
| `gN` | ✅ | 999 |
| `gScratchBand` | ✅ | 4 scratch seeds in full mode, one base 900,010,200 |
| `gAnchoredConstants` | ✅ | 81 / 81 |
| `gPredicateFixtures` | ✅ | 256 / 256 |
| `gLedgerRead` | ✅ | registry 89 unchanged |
| `gPartition` | ✅ | both arms, every seed |
| `gRecall` | ✅ | 57,765 / 57,765 · 56,533 / 56,533; eta split 21,325 / 21,325 · 20,601 / 20,601 |
| `gClassesNonVacuous` | ✅ | first 3,140 / 3,041 · notFirst 19,498 / 18,809 (W18-D / W18-D+OP) |
| `gOutcomeLiterals` | ✅ | 6 / 6 |
| `gFaces` | ✅ | 614 / 614 face levels re-derived off disk |
| `gOutcomeWords` | ✅ | `MISREAD` re-derived off disk |
| `gInheritedProse` | ✅ | 116 prose fields by diff; 0 listed |
| `gHashOrder` | ✅ | 33-key schema |
| `gStage` | ✅ | running file's hash |

**CONSUMPTION.** Block `12,565,000–999` consumed whole. Scratch `900,010,200–299` (executor; `900,010,300–399` untouched).
ZERO stats. Registry 89. Next sim ≥ **12,566,000**.

## §COMMANDER CORRECTIONS (ruling #435 — OP-C3 BANKED, outcome MISREAD; verifier PASS, zero HIGH, zero MEDIUM, three LOW; §P and the instrument untouched; the artifact FROZEN)

1. **LOW — `threatBy.another` 0.633344 is over ALL 3,041 first-body balls**, open picks included, not over the 769 shut
   picks. On a shut pick ANOTHER opponent set the threat by construction (the threat is the largest margin, and the
   front man's own band is never shut, 0 / 3,032). Read §R-OUTCOME and §R6's 「多数」 as "always, by construction".
2. **LOW — "not staleness, not perception" overreaches**: position error and observation age were measured; the
   perceived facing and velocity were not. The verifier bounds the facing noise's effect on his ETA at ≤ 0.054 s, far
   below the shut edge (0.536388 s). Read "not staleness, not position error".
3. **LOW — HONEST LIMITS 2**: the passed-over preference is `attemptValueAt(cell, band)` × the LN own-lane factor, not
   "the cell's value" alone.
