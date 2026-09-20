# IF-ENTRY-RUNG — `?a4world=18` 看见出脚就跑 (the run onto the flight: a body who SAW the ball leave a mate's boot at his previous look starts while it is still travelling)

> Authorized by **COMMANDER RULING #424 item 5** (the dispatch), on **#424 item 2** (IF-T1b banked,
> verifier PASS, zero HIGH, ALL 28 gates green, `allGreen` a STORED `true`), **#424 item 3** (the
> read ruled, WITH its honest sentence: the flight run costs nothing the band can see — a NEGATIVE
> read, honestly weaker than a positive) and **#424 item 4** (two MEDIUM + one LOW disposed in
> place; the CANON lesson *inherited prose re-read by diff*).
> The law is the IF contract ([`IF-FLIGHT-RUN-CONTRACT.md`](IF-FLIGHT-RUN-CONTRACT.md) §2
> M-IF.1–6, §4 NON-CLAIMS, STATUS #424); the seam is **IF-T0b**
> ([`IF-T0-FLIGHT-RUN-SEAM.md`](IF-T0-FLIGHT-RUN-SEAM.md) §LAW-B); the exam of record is **IF-T1b**
> ([`IF-T1B-FLIGHT-RUN-EXAM-RERUN.md`](IF-T1B-FLIGHT-RUN-EXAM-RERUN.md), artifact
> [`data/if-t1b-flight-run-exam.json`](data/if-t1b-flight-run-exam.json) — its CANONICAL path;
> `allGreen` is a stored `true`, so there is no red-routing here. ⛔ The artifact is never moved,
> renamed or copied).
> **LINEAGE**: IF-C0 → IF-T0 → IF-T1 (the guard broke) → IF-T0b (乙 + 甲: the whistle and the
> two-look freshness) → IF-T0b-FIX → IF-T1b (the re-exam; read 1) → **this rung**.
> The EIGHTEENTH entry of the play-test family (#155 → #167.5 → #184.2 → #211.3 → #269.4 →
> #282.4 → #300.6 → #309.5 → #337.5 → #365 → #386 → #396 → #402 → #411 → #414 → here).
> Pin suite: [`tests/ifPlaytestEntry.test.ts`](../../tests/ifPlaytestEntry.test.ts).
> ⛔ **Nothing ships to the default world**; the production fingerprint is unchanged; **the
> play-test verdict is the USER GATE** (watchability has no instrument — the standing law).
> ⭐ **World 17's gate is still OPEN and a world-18 gate opens beside it** — `?a4world=17` still
> plays world 17 byte for byte, so 17 can be compared against 18 on the same device.

## §1 THE BUNDLE (ONE DOOR, NO GENE, NO CONSTANT, NO DOSE, THE EYES ABSENT)

`a4MatchFlags(18) = { ...a4MatchFlags(17), ...IF_WORLD_DOORS }` — world 17 (the cooperation-hats
world) plus **exactly ONE door** and **NO pin at all**, the door IF-T1b's arm of record
`OWNCOOP+IF-E13` carried on top of world 17's own door set:

| # | limb | value | source |
| --- | --- | --- | --- |
| 1 | the whole world-17 substrate | `a4MatchFlags(17)` — **CALLED, not copied** (which calls `(16)` → `(15)` → `(14)` → `(13)` → `(12)` → `(11)` → `(10)` → `(9)` → `(8)` → `(7)` → `(6)` → `(3)`) | the #414 entry's own composition line |
| 2 | ⭐ the flight-run door | `ifFlightRun` = true | IF-T0b §LAW-B (M-IF.1–6: `src/sim/Match.ts` — the flag, the belief `ifLastSeenOwnerGid` and the look counter `ifLook`, default OFF / born empty; `src/ai/PlayerBrain.ts` — the eighth state INSIDE the own-run fork); IF-T1b's `buildMatch` on the two `+IF` arms |
| 3 | ⛔ the pin | **NONE — no gene, no constant, no dose** | M-IF.1/3: identity tests only — no distance, no age bound, no velocity threshold; the SAME candidate at the SAME score. `armIfWorld` is `armDs2World` CALLED and nothing more |
| 4 | world 14's own gene | `lnOwnLaneWeight` = 0.25, on `baseGenome` AND `effGenome` of BOTH sides — **arrives by the CALL**, never re-written here | world 14, unchanged |
| 5 | the L3 dose · the PC dose | world 8's, inherited whole (`?pcdose=0` unchanged) | world 17, unchanged |
| 6 | the eye · evolution opt-ins | **null** · **OFF** (no `evolve*` opt-in exists for this law) | world 6 / #165.2.ii, unchanged |

⭐⭐ **ONE DOOR, NO GENE, NO CONSTANT.** This is the fourth entry of the family whose bundle writes
nothing at all onto a genome (worlds 15, 16 and 17 were the first three). `armIfWorld(match,
l3Dose, pcDose)` is `armDs2World(match, l3Dose, pcDose)` CALLED, full stop — the door is a
CONSTRUCTION flag and arrived with `a4MatchFlags(18)`. The entry layer declares no weight of its
own; the pin suite reads the source and proves it (`setIfGene` and `IF_WORLD_WEIGHT` are absent by
pin).

⭐⭐ **THE CONTAINMENT CALL IS THE WHOLE DESIGN.** Because `armIfWorld` calls `armDs2World`, world
14's `lnOwnLaneWeight` = 0.25 (both sides, both dosed views, never `info.genome`), world 12's two
exam pins and world 11's `dvExposureWeight` all arrive by the call and world 18 writes **zero**
values of its own — pinned at construction and at full time. ⭐ And `ifArmedVersion` reads the
world below by **CALLING `ds2ArmedVersion`**, never by re-reading `dsCoopHatsOff` / `dsOwnRun` /
`dsHatsOff`, so `tests/dsOwnRun.test.ts`'s `{ own: 2, hats: 2 }` seam map and
`tests/dsCoopHatsOff.test.ts`'s `a4World.ts` count of **2** stay true and this commit changes
neither claim.

⛔ **WHAT IS NOT IN WORLD 18, AND WHY** (#424 item 5(i)): `obmMovement` (**the OBM seat is ABSENT —
that is the arm of record's own state**), `ctbSupportPlane`, `rcAnticipate` / `rcReady`,
`bfFacingCost`, `edsTouchCost`, and **no OBM gene** (`offballMovementWeights` absent from
`baseGenome`, `effGenome` AND `info.genome`). ONE door and nothing else, because **the user's
17-vs-18 comparison must be clean.** Test-pinned six keys plus the gene, absent from world 18 and
from every world below.

⚠ **WORKER-SIMMED fixtures play the SHIPPED world** (canon, home ruling #283.2(iv)) ⇒ **a watched
world-18 match is the armed world; the league's background fixtures are not.** Test-pinned here.

## §2 THE DOOR SET IS THE EXAM'S, PROVEN IN TWO HALVES

IF-T1b built its arm of record as `a4MatchFlags(13)` + `dsOwnRun` + `dsHatsOff` + `dsCoopHatsOff`
+ `ifFlightRun` + `armA4World(m, null, 13)` — a **WORLD-13** composition
(`scripts/probes/if-t1b-flight-run-exam.ts`, `buildMatch`), because the exam ran before this world
existed. World 18 sits on world 17's doors, so the entry does **NOT** reproduce the exam's
composition byte for byte; it reproduces the **DOOR SET**:

* **(a) the exam's own construction, re-run here ON WORLD 13**, reproduces IF-T1b's **STORED**
  per-seed whole-match signatures for `OWNCOOP+IF-E13` —
  `perSeedCells[]['OWNCOOP+IF-E13'].signature` — on **all twelve** of the first battery seeds
  **12,560,000–12,560,011**. Those seeds are CONSUMED (the exam booked the whole block); re-walking
  a consumed seed is **not a consumption**. Same host ⇒ EXACT. The recipe is read off the
  instrument: the exam's own `signatureOf` (which carries ONE extra field, `action.type`) and an
  unobserved walk (`while (!m.finished) m.step(DT)`) — legitimate because the exam's own
  `gLockstep` proves observed ≡ unobserved byte for byte per arm. Both recipes live in the suite,
  each labelled with what it is for.
* **(b) `a4MatchFlags(17)` + the flag gives whole-match signatures IDENTICAL to
  `a4MatchFlags(18)`'s** (rng state included) at construction AND at full time, on **six** scratch
  seeds `900,009,020–025`. The flag SET itself is pinned key for key:
  `{ ...a4MatchFlags(17), ifFlightRun: true }` deep-equals `a4MatchFlags(18)`, and the added key
  set is exactly `['ifFlightRun']`.

## §IDENTITY — the shipped world, and every world below 18, byte-identical (ARCH-KEYED)

**Definition, one source**: each walk builds a league at the ENGINE DEFAULT clock
(`new League({ seed })`), takes its first fixture, constructs with `a4MatchFlags(v)`, arms with
`armA4World(match, null, v, l3Dose, pcDose)` — the SHIPPED composer — calls `runToCompletion()`,
and hashes the match signature (the `signature()` helper of
[`../../tests/ifPlaytestEntry.test.ts`](../../tests/ifPlaytestEntry.test.ts), field for field the
`ds2PlaytestEntry` helper). A world digest is `sha256` of its **twelve** per-seed signatures joined
by `|`, seeds **900,007,200 – 900,007,211** — the family's IDENTITY band, **re-used deliberately**.

⭐⭐ **A DIGEST CARRIES ITS ARCHITECTURE** (canon; #418 item 2(i)–(ii)). The table is keyed by
`process.arch`.

* **x64** — **RECORDED BY THIS EXECUTOR** at the dispatch HEAD `05df245`, in a CLEAN throwaway
  worktree (`git worktree add … 05df245`, a **junctioned** shared `node_modules`, `git status
  --short` EMPTY there), BEFORE a single byte of this rung was written, by a throwaway walker
  living outside the repo and deleted after.
* **arm64** — **INHERITED BY IDENTITY** (#418 item 2(ii) route (a)) from
  `tests/ds2PlaytestEntry.test.ts`'s `BASELINE_DIGESTS` for bare · 12 · 13 · 14 · 15 · 16: the
  SAME twelve seeds, the SAME `signature` recipe, those worlds byte-identical since `4d3ff94`.
  Stated **literal for literal**, with the source suite named; the pin suite ASSERTS each literal
  is present in that suite's own text.
* **world 17 on arm64 — ABSENT** (#418 item 2(ii) route (b)): no arm64 literal of record exists
  with this recipe, so that row **skips on arm64 and says so in its title**. ⛔ Never a guess.

| digest | **x64** at `05df245` (recorded here) | **arm64** (inherited by identity) |
| --- | --- | --- |
| production (no world) | `1d75378f04f649cb04040519128269d65f31cf640b3dbd7414b48d64248ba500` | `062067553ef3ae85f329d3d422b0576e15296471666a0ecb3b6912c40554a8ab` |
| world 12 | `ee39881f2a445fbb0e41b61c4fa85d1e703c24b5ef8f699ae7e0ea96f8e78119` | `34e882b240967047c746203cadcc39311ddee4a9fe595361365b3daa8ffaeae0` |
| world 13 | `7c4f206321dee78cbdce13c9528b6b635d0e1ca1792d5f7afa59cab78e76e953` | `9c9d3117a27192ef31229294ecc050f1e0b5b3a08ca047cc50a8631dc03704e3` |
| world 14 | `49fd74496ed245252a8390af9e3fabd796e308549db638b90bb1ac2c3f7e2957` | `0f3887d491099f4a4a17e220d6a63fae929de1af46b45948ae3cf1069e7821cf` |
| world 15 | `8431aafb0e5606b71804a907d7b092c6d584f4fe108179b4610e6f380154cf9e` | `2016c431bdadf5401d38ddedf82bd0596b4062986b6eea6ee06ccdbf34c3f4be` |
| world 16 | `b57a0d6c6ed69c464ae8a4142b5c4da878031a4f5791b33f3a50039b7b86dd01` | `7090f7e67350e80e63e4413020c22d1c381845c1e84fcd7417840bdde944d8a4` |
| world 17 | `5d60981a3cccb79eeca1eb6d6249d5186d08f1231f6ecdd69eb3f0f739072933` | **ABSENT — skipped by title** |
| world 18 | ≠ world 17's (NEW, non-vacuous) | ≠ world 17's (NEW, non-vacuous) |

* ⭐ **NON-VACUOUS**: world 18's digest DIFFERS from world 17's, so the door demonstrably bites in
  the entry's own path — the identity claim is not the claim that nothing happened.
* ⭐ **THE PRODUCTION FINGERPRINT IS ARCH-KEYED** (#418 item 1): arm64
  `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` (the value OF RECORD, and the
  literal the frozen suites still pin — RED on this host by construction, #418 item 3 class A) ·
  **x64 `59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d`**, re-derived by
  `npm run fingerprint` at this rung and UNCHANGED from the dispatch head — **Road B holds: the
  fingerprint of record did not move.**

## §THE HONEST BRIEF

Canon (home: PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4, VERBATIM): *"a stage doc's
prose quotes artifact FIELDS verbatim or the number becomes a gated face"*. Every number on every
surface is an IF-T1b field at 6 dp, read off
[`data/if-t1b-flight-run-exam.json`](data/if-t1b-flight-run-exam.json) **by field and by arm**,
with `node`, never by eye over 36 MB of JSON.

⚠ **THE MEASURED ARM IS E13** — the ARM OF RECORD `OWNCOOP+IF-E13` against its control
`OWNCOOP-E13` (EMPTY-BOOK, the seat ABSENT), which is exactly what `?a4world=18&pcdose=0` plays.
**D13** — the mature-book form the user reaches by default — was **MEASURED beside it**
(`OWNCOOP+IF-D13` against `OWNCOOP-D13`), so the played form's numbers are its OWN, not an
inference. ⛔ **ZERO cross-arm numbers**: the E13 tokens live on the empty-book feed line, the D13
tokens on the mature one, and the settings blurb carries BOTH, each behind its own adjacent arm
label. The ONE token the two arms share is `0.000000` — it is a real field on BOTH
(`flight.intendedReceiverShare` and the dead-ball start), and the suite's disjointness pin exempts
it BY NAME rather than ignoring it.

### THE ORDER, ON ALL THREE SURFACES — THE COST BEFORE THE WIN

1. **这一步造了什么** — the run onto the flight: he starts because he SAW the ball leave a mate's
   boot at his previous look and the game is live (M-IF.5 + M-IF.6); ONE door on top of v17; no
   gene, no constant, no dose.
2. **⚠ 代价说在最前面** — the class share, the passer's blindness to him, the yield per run against
   the at-feet run's, runs per possession tick, through balls, goals, and the memory partition.
3. **⭐ 量到的** — the band: every guard's interval contains zero, or its |Δ| ÷ tolerance is printed
   instead; the offside flag.
4. **⚠ 别期待** — 这块表看不见 ≠ 眼睛看不见; no timing against the line; no direction (丙 HELD — a
   backpass in the air can start him); the passer does not read him; the leak unchanged;
   「有人挤人」 not this door's.
5. **你的眼睛要判的** — 有没有「球一出脚就有人往身后冲」的画面? 冲的人是不是刚看见传球的那个?
   死球时没人乱跑了吗? 直塞还在吗?
6. **对比** — v17, 同一台设备, `?a4world=18` 对 `?a4world=17`; `?a4world=18&pcdose=0` = the
   measured arm. **⚠ 联赛后台快速模拟跑的是原版世界.**

### THE TRACE TABLE — surface × token × field × arm

The three surfaces are the **GameApp feed line in both dose forms** (`src/game/GameApp.ts`), the
**settings blurb** (`src/ui/SettingsScreen.ts`) and the **badge** (`src/ui/A4WorldBadge.ts`).
⭐ The badge carries **ZERO numerals** — a chip is a few characters on a phone; its own docblock
names the cost and points at the two surfaces that print it (the GK-ENTRY / DS-ENTRY-2 form).
Counts: **29 numerals (27 distinct) on the empty-book feed line · 29 (27 distinct) on the mature
feed line · 58 (53 distinct) in the settings blurb · 0 on the badge**; **zero untraceable, zero
cross-arm**, and the pin suite re-derives every token below from the artifact rather than
comparing it to a literal typed here.

| arm | field | arm/contrast it is read under | token |
| --- | --- | --- | --- |
| E13 | `eighthClass.count.shareOfMakeRun` | OWNCOOP+IF-E13 | **0.092214** |
| E13 | `flight.intendedReceiverShare` | OWNCOOP+IF-E13 | **0.000000** |
| E13 | `eighthClass.yieldPartition.shotsPerEpisode` | OWNCOOP+IF-E13 | **0.038808** |
| E13 | `eighthClass.yieldPartition.theSeventhsOwnYieldBeside.shotsPerEpisode` | OWNCOOP+IF-E13 | **0.049224** |
| E13 | `r1.runsPerInPossessionTick` (control) | OWNCOOP-E13 | **0.241767** |
| E13 | `r1.runsPerInPossessionTick` (arm) | OWNCOOP+IF-E13 | **0.288929** |
| E13 | `guard.throughBallsPerMatch` (control) | OWNCOOP-E13 | **5.486486** |
| E13 | `guard.throughBallsPerMatch` (arm) | OWNCOOP+IF-E13 | **5.450450** |
| E13 | `G9.delta` | OWNCOOP+IF-E13 \| OWNCOOP-E13 | **0.036036** |
| E13 | `G9.ci[0]` | OWNCOOP+IF-E13 \| OWNCOOP-E13 | **0.223223** |
| E13 | `G9.ci[1]` | OWNCOOP+IF-E13 \| OWNCOOP-E13 | **0.149149** |
| E13 | `G9.absDeltaOverTolerance` | OWNCOOP+IF-E13 \| OWNCOOP-E13 | **0.023770** |
| E13 | `guard.goalsPerMatch` (control) | OWNCOOP-E13 | **3.249249** |
| E13 | `guard.goalsPerMatch` (arm) | OWNCOOP+IF-E13 | **3.389389** |
| E13 | `G1.delta` | OWNCOOP+IF-E13 \| OWNCOOP-E13 | **0.140140** |
| E13 | `G1.ci[0]` | OWNCOOP+IF-E13 \| OWNCOOP-E13 | **0.004004** |
| E13 | `G1.ci[1]` | OWNCOOP+IF-E13 \| OWNCOOP-E13 | **0.283283** |
| E13 | `G1.absDeltaOverTolerance` | OWNCOOP+IF-E13 \| OWNCOOP-E13 | **0.156090** |
| E13 | `startStatePartition.memory.theLastPasser` | OWNCOOP+IF-E13 | **0.450157** |
| E13 | `startStatePartition.memory.anotherMate` | OWNCOOP+IF-E13 | **0.549843** |
| E13 | `yieldPartition.byState.ownRestart.ifRunsPerMatch` | OWNCOOP+IF-E13 | **0.000000** |
| E13 | `leak.cellShare.stalePasserStillCredited` (control) | OWNCOOP-E13 | **0.896515** |
| E13 | `leak.cellShare.stalePasserStillCredited` (arm) | OWNCOOP+IF-E13 | **0.896442** |
| E13 | `crowd.crashShare` (control) | OWNCOOP-E13 | **0.445696** |
| E13 | `crowd.crashShare` (arm) | OWNCOOP+IF-E13 | **0.444503** |
| E13 | `r1.ratioOfRecord.ratio` | OWNCOOP+IF-E13 \| OWNCOOP-E13 | **1.195072** |
| E13 | `r1.ratioOfRecord.ci[0]` | OWNCOOP+IF-E13 \| OWNCOOP-E13 | **1.175962** |
| E13 | `r1.ratioOfRecord.ci[1]` | OWNCOOP+IF-E13 \| OWNCOOP-E13 | **1.213609** |
| D13 | `eighthClass.count.shareOfMakeRun` | OWNCOOP+IF-D13 | **0.125956** |
| D13 | `flight.intendedReceiverShare` | OWNCOOP+IF-D13 | **0.000000** |
| D13 | `eighthClass.yieldPartition.shotsPerEpisode` | OWNCOOP+IF-D13 | **0.036963** |
| D13 | `eighthClass.yieldPartition.theSeventhsOwnYieldBeside.shotsPerEpisode` | OWNCOOP+IF-D13 | **0.044793** |
| D13 | `r1.runsPerInPossessionTick` (control) | OWNCOOP-D13 | **0.238608** |
| D13 | `r1.runsPerInPossessionTick` (arm) | OWNCOOP+IF-D13 | **0.298222** |
| D13 | `guard.throughBallsPerMatch` (control) | OWNCOOP-D13 | **6.311311** |
| D13 | `guard.throughBallsPerMatch` (arm) | OWNCOOP+IF-D13 | **6.539540** |
| D13 | `G9.delta` | OWNCOOP+IF-D13 \| OWNCOOP-D13 | **0.228228** |
| D13 | `G9.ci[0]` | OWNCOOP+IF-D13 \| OWNCOOP-D13 | **0.026026** |
| D13 | `G9.ci[1]` | OWNCOOP+IF-D13 \| OWNCOOP-D13 | **0.439439** |
| D13 | `G9.absDeltaOverTolerance` | OWNCOOP+IF-D13 \| OWNCOOP-D13 | **0.130871** |
| D13 | `guard.goalsPerMatch` (control) | OWNCOOP-D13 | **2.678679** |
| D13 | `guard.goalsPerMatch` (arm) | OWNCOOP+IF-D13 | **2.744745** |
| D13 | `G1.delta` | OWNCOOP+IF-D13 \| OWNCOOP-D13 | **0.066066** |
| D13 | `G1.ci[0]` | OWNCOOP+IF-D13 \| OWNCOOP-D13 | **0.068068** |
| D13 | `G1.ci[1]` | OWNCOOP+IF-D13 \| OWNCOOP-D13 | **0.202202** |
| D13 | `G1.absDeltaOverTolerance` | OWNCOOP+IF-D13 \| OWNCOOP-D13 | **0.089259** |
| D13 | `startStatePartition.memory.theLastPasser` | OWNCOOP+IF-D13 | **0.526470** |
| D13 | `startStatePartition.memory.anotherMate` | OWNCOOP+IF-D13 | **0.473530** |
| D13 | `yieldPartition.byState.ownRestart.ifRunsPerMatch` | OWNCOOP+IF-D13 | **0.000000** |
| D13 | `leak.cellShare.stalePasserStillCredited` (control) | OWNCOOP-D13 | **0.859212** |
| D13 | `leak.cellShare.stalePasserStillCredited` (arm) | OWNCOOP+IF-D13 | **0.848694** |
| D13 | `crowd.crashShare` (control) | OWNCOOP-D13 | **0.461965** |
| D13 | `crowd.crashShare` (arm) | OWNCOOP+IF-D13 | **0.464378** |
| D13 | `r1.delta` | OWNCOOP+IF-D13 \| OWNCOOP-D13 | **0.059614** |
| D13 | `r1.ci[0]` | OWNCOOP+IF-D13 \| OWNCOOP-D13 | **0.055807** |
| D13 | `r1.ci[1]` | OWNCOOP+IF-D13 \| OWNCOOP-D13 | **0.063389** |

⭐ **THE TWO DERIVED FIGURES, WITH THEIR ARITHMETIC WRITTEN OUT** (the #415 item 2 / DS-ENTRY-2
§DEVIATIONS 6 form): 「大约每 11 次里 1 次」 is the commander's own word at #424 item 5(vi), and the
surface prints `1 ÷ 0.092214 = 10.84` beside it; the mature line's 「每 8 次里 1 次」 prints
`1 ÷ 0.125956 = 7.94`. ⛔ **No other derived number and NO hand-written percentage appears on any
surface.**

⭐⭐ **THE HONESTY LINE IS ON EVERY SURFACE** — `reads.honestyLine`, VERBATIM: *"nothing the band
can see" is NOT "nothing the eye can see" — the user's gate at world 18 judges the eye.* — rendered
in plain Chinese: 「这块表看不见,不等于眼睛看不见——这道门就是请你的眼睛来判」.

⭐⭐ **THE TWO PLACES THE BRIEF REFUSES TO FLATTER ITSELF.** (i) The D13 pair's **offside flag is
UP** (`offsides.rows['OWNCOOP+IF-D13|OWNCOOP-D13'].flag` **true**, `resolved` true — it gates
nothing by construction, #157's FLAG form), and the mature line and the blurb SAY SO rather than
printing only the E13 pair's 「没有升起」. (ii) The D13 pair's **G9 through-ball limb RESOLVES**
(interval `[0.026026, 0.439439]`, which does NOT contain zero), and the surface prints that it
does not contain zero AND the honest ratio `0.130871` of tolerance beside it — the band still
holds (`guards.holdsBand` true, breach set EMPTY on all four pairs), but the reader is told which
of those two facts he is looking at.

## §THE SURFACES

| file | what |
| --- | --- |
| `src/game/a4World.ts` | `IF_WORLD_VERSION = 18` · `IF_WORLD_DOORS` · `isIfWorld` · `armIfWorld` (= `armDs2World` CALLED, nothing more) · `ifArmedVersion` (containment: `ds2ArmedVersion(match) === 17` ∧ the flag — the world below CALLED, never re-read) · `a4MatchFlags(18)` (world 17's composition CALLED) · `armA4World` routes 18 · `a4ArmedVersion` reads 18 FIRST · `A4WorldVersion`/`A4ArmedVersion` gain 18 · the URL/sticky parse accepts `18`, the bound moves to `19` · the docblock's launch list |
| `src/game/GameApp.ts` | the armed-match guard and the pc-stack dose predicate include world 18 by the SAME single containment predicate world 17 extended · the feed blurb (BOTH dose forms) · the status line |
| `src/ui/A4WorldBadge.ts` | `A4_BADGE_TEXT_IF` (+ `_EMPTY`) · both tables keyed at 18 |
| `src/ui/SettingsScreen.ts` | the ⚙ → 🧬 world-18 checkbox (mutually exclusive with every other world — one value) + the long honest blurb |
| `tests/ifPlaytestEntry.test.ts` | the pin suite (new) |
| narrows (this ruling) | listed in §THE NARROWED PINS below |

⭐ **THE DEFAULT LANDING WORLD IS UNCHANGED — BEFORE `0`, AFTER `0`** (the shipped game). World 18
is reached only by an explicit `?a4world=18` or an explicit tick in ⚙ → 🧬 Experimental.
**Road B holds: a player who does not opt in sees nothing at all.**

⭐ **THE SURFACES ARE EXACTLY THE FOUR WORLD 17'S ENTRY TOUCHED, PLUS THE PIN SUITE AND THE
NARROWS** — no fifth src file, and **ZERO files under `src/sim`, `src/ai`, `src/evolution` or
`scripts/`**. The engine is byte-untouched, so the OFF world cannot have moved (the structural
argument; §IDENTITY is the measurement).

## §4 WHAT THE USER'S EYES ARE FOR — HOW-TO-SEE (BINDING)

**How to switch it on** (the A4-PLAYTEST §2 form).

* Computer: ⚙ → 🧬 Experimental → tick
  **「看见出脚就跑 · 球还在飞的时候,刚看见传球的那个人自己往身后冲 (play-test)」**. The current
  match restarts immediately in that world — same fixture, same seed, rebuilt.
* Phone / a link: `?a4world=18`. The measured arm is `?a4world=18&pcdose=0`.
* The A/B: **`?a4world=18` against `?a4world=17`, SAME device, same session.** World 17's own gate
  stays open beside it.

**WHAT THE EYES ARE FOR** (binding):

* 有没有「球一出脚就有人往身后冲」的画面? — the thing nobody has ever LOOKED at in this engine.
* 冲的人是不是刚看见传球的那个? — the memory partition says 0.450157 of the time it is literally
  the passer; the rest is another mate he saw with the ball at his previous look.
* 死球时没人乱跑了吗? — M-IF.5's whole point; the number is 0.000000 per match.
* 直塞还在吗? — G9, the guard IF-T1 broke, is back at its control's level on E13 and UP-but-inside
  on D13.

**THE LIKELIEST 「change」 AND ITS ANSWER, SAID NOW**: 「跑得不是时候」 / 「往后传也冲」 ⇒ that asks for
**丙 (the flight's direction)**, which #424 item 3 HELD — not this door. 「传球手看不见他」 ⇒ that is
coordination (RC 默契, dormant and HELD), not this door.

**THE GATE**: 「看见出脚就跑 (v18) — keep | change | revert — <一句人话>」.

## §LIVENESS and §THE MUTANT WALK

**LIVENESS (the #402 item 2(iii) form).** On world 18 the EIGHTH `why` (`'own run onto the
flight'`, read off `p.action.scores`) appears in whole matches on the scratch seeds
`900,009,040–045`; on world 17 it is **exactly 0 on every one of them**. The pin asserts the
eighth `why` on **≥ 3** of the six (the ruling's bound; the dead-time exemption of #402 item
2(iii) forbids a universal over a population of whole matches) and 0 on world 17 on **all** six —
the negative half IS universal, because a flag that is absent cannot fire. A second pin shows the
whole-match SIGNATURES differ on ≥ 3 of the same six.

**THE MUTANT WALK — four mutants, exact texts, each killed.**

Each mutation was applied to a FOURTH throwaway worktree (`git worktree add … 05df245` with this
rung's files copied in, a junctioned `node_modules`), never to the main tree, and restored from a
byte copy afterwards (the DS-ENTRY-2 §CORRECTIONS-ratified SAFER form). The run was
`npx vitest run tests/ifPlaytestEntry.test.ts --no-file-parallelism`; the suite has **33** `it()`s.

| # | the mutation (exact text) | killed by (source-mutant run) |
| --- | --- | --- |
| M1 | THE DOOR DROPPED FROM THE BUNDLE — `export const IF_WORLD_DOORS = { ifFlightRun: true } as const;` becomes `export const IF_WORLD_DOORS = {} as const;` | **10 red of 33** — FIDELITY (the key set AND the added-key set), the composition/arming pin, full time, the door-set identity half (b), CONTAINMENT (18 reads 0 and falls back to 17), DORMANCY's positive half, M1's own analogue, ⭐ the NON-VACUITY digest and ⭐ BOTH LIVENESS pins |
| M2 | THE VERSION READER READING WORLD 17'S FLAG ONLY — in `ifArmedVersion`, `  return match.ifFlightRun === true ? IF_WORLD_VERSION : 0;` becomes `  return IF_WORLD_VERSION;` | **3 red of 33** — CONTAINMENT (a world-17 match would name itself 18; the pin walks the mutant's own read and shows it answering 18 where the shipped read answers 0), M1's analogue (the door-dropped match would still read 18) and M2's own analogue with its source-literal pin |
| M3 | THE ARMING RE-WRITING A GENE — `armIfWorld`'s body becomes `armDs2World(match, l3Dose, pcDose);` followed by `const t = match.teams[0];` and `t.effGenome = { ...t.effGenome, lnOwnLaneWeight: 0.5 } as TacticalGenome;` | **4 red of 33** — the "CALLED and nothing more" source pin inside FIDELITY, CONTAINMENT (world 14's reader stops agreeing), M1's analogue and M3's own (the runtime genome-equality pin: world 18's three genome views are world 17's, key for key) |
| M4 | THE BADGE TEXT OFF-BY-ONE — in `A4_BADGE_TEXTS`, `18: A4_BADGE_TEXT_IF,` becomes `18: A4_BADGE_TEXT_DS2,` (world 18 wears world 17's chip) | **2 red of 33** — the badge pin (18's chip is its own text in both dose forms) and M4's own analogue with the distinct-count pin (18 distinct names, not 17) |

⭐⭐ **M1 IS THE ONE THAT PROVES THE WORLD IS A WORLD.** With the only door gone, world 18 IS world
17 — so NON-VACUITY and LIVENESS go red beside the fidelity pins. A bundle with a single door has
no "one of two doors" mutant to run, so M1 empties the door object (the DS-ENTRY-2 §DEVIATIONS 12
precedent).

## §THE NARROWED PINS (the DF-T0 §P7 form — stated POSITIVELY, never deleted)

Every hunk of this commit under `tests/` that is not the new suite. Each keeps its substantive
claim and states it in the positive form; **none is deleted**.

| # | file | the old claim | the new claim |
| --- | --- | --- | --- |
| 1 | `a4PlaytestEntry.test.ts` | the armed-match guard literal ends `\|\| isDs2World(this.a4World))) {` | the SAME single guard, widened by `\|\| isIfWorld(this.a4World)` on its own continuation line — still **ONE** guard, now naming world 18 too |
| 2 | `bkPlaytestEntry.test.ts` | the armed-match guard literal | widened by `\|\| isIfWorld(this.a4World)` |
| 3 | `bkPlaytestEntry.test.ts` | the pc-stack predicate ends `\|\| isDs2World(version);` | the SAME single predicate, widened by `\|\| isIfWorld(version)` |
| 4 | `bkPlaytestEntry.test.ts` | the badge table holds **17** distinct names | it holds **18** |
| 5 | `bkPlaytestEntry.test.ts` | `?a4world=18` → null | `?a4world=18` → **18** (the IF entry) and the bound moves to **19** |
| 6 | `bqPlaytestEntry.test.ts` | `?a4world=18` → null | `?a4world=18` → **18**; the bound moves to **19** |
| 7 | `cbPlaytestEntry.test.ts` | `?a4world=18` → null | `?a4world=18` → **18**; the bound moves to **19** |
| 8 | `cbPlaytestEntry.test.ts` | the badge table holds **17** distinct names | it holds **18** |
| 9 | `ds2PlaytestEntry.test.ts` | `?a4world=18` → null (its URL pin and its M3 mutant analogue, two hunks) | `?a4world=18` → **18**; the bound moves to **19**. `?a4world=17` → **17** is UNCHANGED, which is what that pin has always been about |
| 10 | `dsPlaytestEntry.test.ts` | `?a4world=18` → null (two hunks) | `?a4world=18` → **18**; the bound moves to **19** |
| 11 | `entriesW10W11.test.ts` | the armed-match guard literal | widened by `\|\| isIfWorld(this.a4World)` |
| 12 | `entriesW10W11.test.ts` | the pc-stack predicate | widened by `\|\| isIfWorld(version)` |
| 13 | `entriesW10W11.test.ts` | the badge table holds **17** distinct names | it holds **18** |
| 14 | `entriesW10W11.test.ts` | the EMPTY dose table holds **10** (worlds 8…17) | it holds **11** (…/18) |
| 15 | `entriesW10W11.test.ts` | `?a4world=18` → null | `?a4world=18` → **18**; the bound moves to **19** |
| 16 | `gkPlaytestEntry.test.ts` | `?a4world=18` → null (two hunks) | `?a4world=18` → **18**; the bound moves to **19** |
| 17 | `l3PlaytestEntry.test.ts` | `?a4world=18` → null | `?a4world=18` → **18**; the bound moves to **19** |
| 18 | `l3PlaytestEntry.test.ts` | the badge table holds **17** distinct names | it holds **18** |
| 19 | `l3PlaytestEntry.test.ts` | the armed-match guard literal | widened by `\|\| isIfWorld(this.a4World)` |
| 20 | `lnPlaytestEntry.test.ts` | `?a4world=18` → null | `?a4world=18` → **18**; the bound moves to **19** |
| 21 | `mtPlaytestEntry.test.ts` | the badge table holds **17** distinct names | it holds **18** |
| 22 | `pcPlaytestEntry.test.ts` | `?a4world=18` → null | `?a4world=18` → **18**; the bound moves to **19** |
| 23 | `pcPlaytestEntry.test.ts` | the badge table holds **17** distinct names | it holds **18** |
| 24 | `pcPlaytestEntry.test.ts` | the armed-match guard literal | widened by `\|\| isIfWorld(this.a4World)` |
| 25 | `raPlaytestEntry.test.ts` | `?a4world=18` → null | `?a4world=18` → **18**; the bound moves to **19** |
| 26 | `ifFlightRun.test.ts` | `src/game/a4World.ts` names `ifFlightRun` / `ifLastSeenOwnerGid` / `ifLook` **NOWHERE** (count 0) | `a4World.ts` names `ifFlightRun` in world 18's OWN bundle and nowhere else — count **2**, with BOTH executable sites enumerated (`IF_WORLD_DOORS`'s object literal; `ifArmedVersion`'s ONE read); `ifLastSeenOwnerGid` and `ifLook` are STILL **0** there, and `League.ts`'s count of both is UNCHANGED at 0. The entry layer touches the flag and NEITHER map |
| 27 | `ifFlightRun.test.ts` | the §SEAM MAP per-file set is the THREE seam files | it is **four**, with `src/game/a4World.ts` added and its count enumerated (**2**); the seam's own three files are byte-unchanged and every enumerated count is the seam's own |
| 28 | `ifFlightRun.test.ts` | `ifFlightRun: true` appears in **NO** `src/**` file (count 0 everywhere) | the flag is SET in exactly ONE place outside `Match.ts`'s constructor — world 18's `IF_WORLD_DOORS` object literal — count **1** in `a4World.ts` and **0** in every other `src/**` file. The `.ifFlightRun =` assignment pin (1 in `Match.ts`, 0 elsewhere) and the env/bundle prohibitions are UNTOUCHED |

⭐ **NO PROHIBITION WAS WIDENED BEYOND THE ENTRY LAYER.** `ifFlightRun.test.ts`'s entry-layer
anchors gain exactly one file, enumerated at both of its sites; the belief and the look counter
stay at zero there, which is the substantive claim (the entry arms the seam; it does not touch the
memory). ⭐ **AND `a4World.ts` NAMES `ifFlightRun` AT EXACTLY ITS TWO EXECUTABLE SITES AND NOWHERE
IN PROSE** — the new comments in all four files deliberately name **no flag identifier**
(LN-ENTRY §DEVIATIONS 2 / GK-ENTRY §DEVIATIONS 4's ratified precedent), which is also what keeps
`dsOwnRun.test.ts`'s `{ own: 2, hats: 2 }` count true: a prose mention of `dsOwnRun` in world 18's
docblock reddened it once during drafting and was removed rather than narrowed.

⭐⭐ **AND `tests/dsOwnRun.test.ts` AND `tests/dsCoopHatsOff.test.ts` ARE UNTOUCHED.** Their
`a4World.ts` seam counts (`{ own: 2, hats: 2 }` and `dsCoopHatsOff` = 2) stay true, because
`ifArmedVersion` asks the world below by CALLING `ds2ArmedVersion` instead of re-reading world
17's or world 16's flags. That was a design constraint of the dispatch, and it is why this rung
adds no hunk to either file.

### ⚠⚠ THE FROZEN INSTRUMENT NOW READS RED, DECLARED AND NOT EDITED

`scripts/probes/if-t1b-flight-run-exam.ts` is **FROZEN** (FREEZE `b55b62d`, RESULTS `272cbf6`;
#424 item 0 banks it byte-identical) and carries a **ZERO-COUNT ANCHOR** over `src/game/a4World.ts`
(§P.9 `codeFacts.a4WorldCleanOfTheSwitch` — *"the switch reaches no world"*, the same shape
DS-T1d's anchor had).

**From this commit that anchor reads RED** — `a4World.ts` names `ifFlightRun` twice, in world 18's
own bundle. ⛔ **The instrument was NOT edited** (this rung touches no file under `scripts/`), and
the probe is not part of the vitest suite, so nothing in `tests/` reddens from it. IF-T1b's banked
results are unaffected — the anchor was a statement about the ENTRY LAYER at the exam's head, and
the entry layer is what this ruling changed (the #412 item 3 FAMILY NOTE). The errata line is the
commander's.

## §DEVIATIONS (declared by the executor; the commander disposes)

1. ⚠⚠ **THE COMMIT CARRIES THE NARROWS, WHICH #424 item 5(xi)'s FILE LIST DOES NOT NAME.** The
   dispatch lists "the four src files, the test, the rung doc". Moving the URL bound to 19 and
   widening the badge tables and the two GameApp predicates **necessarily** reddens 26 hunks in 14
   existing suites (they pin `?a4world=18` → null, the distinct-name counts, and the guard/predicate
   literals). Gate (x) asks the full suite's reds to be exactly the #418 inventory, so the narrows
   are IN the commit, listed positively in §THE NARROWED PINS, in the DS-ENTRY-2 form (#415 item 1
   ratified 27 of them). ⛔ Nothing was deleted and no claim was weakened.
2. ⚠ **THE GameApp ARMED-MATCH GUARD AND THE PC-STACK PREDICATE WERE WIDENED**, although #424 item
   5(i) names only "the feed line" for `GameApp.ts`. Without them `armA4World` is never called for
   world 18 and the doses never arrive, so world 18 would NOT be `a4MatchFlags(17)` + the flag —
   the fidelity claim itself would be false. One line each, on the SAME single guard and the SAME
   single predicate world 17 extended.
3. ⚠ **THE PIN SUITE READS THE 36 MB IF-T1b ARTIFACT AT ITS CANONICAL PATH** to get the stored
   signatures AND to re-derive every numeral on the three surfaces, rather than pasting them as
   literals — the canon-preferred direction (no second copy of a stored value). The artifact is
   never moved, renamed or copied.
4. ⚠ **THE TRACE IS BY RE-DERIVATION, NOT BY LITERAL TABLE.** DS-ENTRY-2 listed its tokens as
   string literals in the suite. This suite COMPUTES each token from the artifact field and then
   requires every 6-dp numeral on each surface to be in that computed set — so a mistyped numeral
   dies, and so does a numeral that is real but belongs to the OTHER arm.
5. ⚠ **`0.000000` IS THE ONE TOKEN BOTH ARMS SHARE** (`flight.intendedReceiverShare` and the
   dead-ball start are 0 on every arm), so the cross-arm disjointness pin exempts exactly that
   token and asserts BY NAME that it is a field of both arms. ⛔ It is not silently ignored.
6. ⚠ **THE D13 ARM HAS NO STORED `ratioOfRecord`** (the exam stores it for the comparison of
   record only), so the mature line prints D13's own Δ and interval where the empty-book line
   prints the ratio and its interval. Both are the same face, `r1.runsPerInPossessionTick`.
7. ⚠ **TWO D13 FACTS ARE UNFLATTERING AND ARE ON THE SURFACE ANYWAY**: the offside FLAG is UP on
   the D13 pair, and G9 RESOLVES there. Both are printed, the second with its |Δ| ÷ tolerance —
   see §THE HONEST BRIEF's last paragraph.
8. ⚠ **THE BADGE CARRIES NO NUMERAL**, as in every entry of this family since v7; the "three
   surfaces" of #424 item 5(vi) are therefore two number-bearing surfaces plus a chip that names
   the world and the dose form. The cost lives in the badge's own docblock, pointing at the two
   that print it.
9. ⚠ **THE ARM64 IDENTITY COLUMN IS INHERITED AND WORLD 17's IS ABSENT** — #418 item 2(ii)'s two
   honest routes, both used, both stated. The x64 column is this executor's own measurement at
   `05df245`. ⛔ No arm64 number was guessed.
10. ⚠ **THE THROWAWAY BASELINE WORKTREE SHARED THIS REPO'S `node_modules` BY A WINDOWS JUNCTION**
    rather than a fresh `npm ci` (GK-ENTRY §DEVIATIONS 7 / DS-ENTRY-2 §DEVIATIONS 9's ratified
    precedent, adapted to this host — `ln -s` degrades to a copy here).
11. ⚠ **LIVENESS IS PROVED ON SIX SCRATCH SEEDS, NOT THREE.** #424 item 5(v) asks for ≥ 3; six are
    walked so the bound is not also the sample. The world-17 half is UNIVERSAL over all six
    (0 eighth-`why` decisions), because an absent flag cannot fire — the dead-time exemption
    applies only to the positive half.
12. ⚠ **ZERO FRONTIER, ZERO STATS.** The only non-scratch seeds walked are IF-T1b's own consumed
    `12,560,000–011`, which the dispatch names for the door-set pin.
13. ⚠⚠ **THE HOST'S `node_modules` WAS DESTROYED AND RE-INSTALLED MID-RUN, AND THE FULL SUITE WAS
    RE-RUN AFTERWARDS.** Removing the throwaway worktrees followed a Windows **junction** into the
    main tree's `node_modules` and deleted part of it. Repair: `npm ci` from the committed
    lockfile — the same first-run repair #418 item 0(a) records; no tracked file was touched
    (`git status --short` unchanged, `node_modules` is ignored). ⛔ The full-suite verdict quoted
    here is the run taken **after** the re-install, on the final tree; the earlier run was
    discarded rather than quoted. The lesson is the standing one: **prove the target is not an
    alias before deleting it** — remove the junction with `rmdir` and VERIFY, never `rm -rf` the
    directory that contains it.

## §CHECKS — what was run, and what it said

| gate | result |
| --- | --- |
| `npx tsc --noEmit` | **clean** |
| `npm run build` | **built** (`tsc --noEmit && vite build`, exit 0) |
| `npm run fingerprint` | **`59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d`** — the x64 value of record (#418 item 1), UNCHANGED |
| `tests/ifPlaytestEntry.test.ts` serial | **33 / 33 green** (95.5 s) |
| `tests/ds2PlaytestEntry.test.ts` serial | **26 / 28 green; the TWO reds are EXACTLY its #418 item 3 class-A entries** — the stored `OWNCOOP-E13` exam signatures and the `4d3ff94` pooled IDENTITY digests, both arm64 numbers, RED here by construction and NOT edited. Its URL narrow (`?a4world=18` → 18, the bound at 19) is GREEN |
| `tests/ifFlightRun.test.ts` serial | **51 / 51 green** — the seam's own suite, with the three narrows of §THE NARROWED PINS 26–28 |
| the FULL suite serial (`npx vitest run --no-file-parallelism`, 4004.6 s) | **2,399 / 2,457 green; 58 reds in 37 files, and EVERY ONE of them is a #418 item 3 inventory entry** — 35 class A (arm64 digest / fingerprint literals) · 20 class C (path separators) · 1 class B (`stamina.test.ts`'s seed-specific outcome) · 2 of the 3 class D timeouts (`careers` · `formationEvolution`; `simRunner` passed this time). ⇒ **reds MINUS the inventory = ZERO. The suite is green outside the #418 inventory.** `tests/ifPlaytestEntry.test.ts` and `tests/ifFlightRun.test.ts` are both fully green inside the full run |
| `git status --short` before staging | exactly this commit's files; nothing foreign |

## §ROAD B — nothing ships

The default landing world is `0` before and after. `npm run fingerprint` re-derives the x64 value
of record `59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d`, UNCHANGED. Every
world below 18 is byte-identical to the dispatch head (§IDENTITY). Nothing under `src/sim`,
`src/ai`, `src/evolution` or `scripts/` is in this commit, so the engine cannot have moved.
**A player who does not opt in sees exactly what he saw before.**

## §NEXT — THE IF PLAY-TEST (USER GATE)

**「看见出脚就跑 (v18) — keep | change | revert — <一句人话>」**, at `?a4world=18` against
`?a4world=17`, same device. Worlds 14, 15, 16 and 17 stay open beside it. The gate opens at the
user's push; nothing in this commit is pushed.
