# DS-ENTRY-2-RUNG — `?a4world=17` 配合帽子摘了 (the cooperation hats come off: 套边 and 二过一 are no longer named by the coach and the passer)

> Authorized by **COMMANDER RULING #414 item 5** (the dispatch), on **#414 item 1** (DS-T1d banked,
> verifier PASS, zero HIGH, 25 of 26 gates green, `allGreen` a STORED `false` — `gBite` RED as a
> receipt-FORM limit, disposed at #414 item 4(ii)), **#414 item 3** (the seven corrections disposed
> in place — the third-man read among them, carried here) and **#414 item 4** (the read ruled, WITH
> its honest sentence: the hats retire BY MEASUREMENT, and world 17 is HONEST SUBTRACTION, not
> emergence).
> The law is the DS contract ([`DS-DESIGNATION-CONTRACT.md`](DS-DESIGNATION-CONTRACT.md) §2
> M-DS.8, §4 NON-CLAIMS, STATUS #414); the seam is **DS-T0d**
> ([`DS-T0-OWN-RUN-SEAM.md`](DS-T0-OWN-RUN-SEAM.md) §SWITCH-D); the exam of record is **DS-T1d**
> ([`DS-T1D-COOP-HATS-EXAM.md`](DS-T1D-COOP-HATS-EXAM.md), artifact
> [`data/ds-t1d-coop-hats-exam.json.RED.json`](data/ds-t1d-coop-hats-exam.json.RED.json)).
> ⚠ **THE ARTIFACT IS READ FROM ITS `.RED.json` PATH** — the instrument's own red-routing idiom
> wrote it there because `gBite` is a stored red; the canonical path does not exist in the tree
> (the exam's §CORR 4 says so). ⛔ The artifact is never moved, renamed or copied.
> **LINEAGE**: DS-C0 → DS-T0 → DS-T1 (FLOOD) → DS-T0b → DS-T1b (DRAIN) → DS-T0c → DS-T1c (read 1)
> → **world 16** → DS-T0d (the cooperation hats' switch) → DS-T1d (the exam; read 1) → **this rung**.
> The SEVENTEENTH entry of the play-test family (#155 → #167.5 → #184.2 → #211.3 → #269.4 →
> #282.4 → #300.6 → #309.5 → #337.5 → #365 → #386 → #396 → #402 → #411 → here).
> Pin suite: [`tests/ds2PlaytestEntry.test.ts`](../../tests/ds2PlaytestEntry.test.ts).
> ⛔ **Nothing ships to the default world**; the production fingerprint is unchanged; **the
> play-test verdict is the USER GATE** (watchability has no instrument — the standing law).
> ⭐ **World 16's gate is still OPEN and a world-17 gate opens beside it** — `?a4world=16` still
> plays world 16 byte for byte, so 16 can be compared against 17 on the same device.

## §1 THE BUNDLE (ONE DOOR, NO GENE, NO CONSTANT, THE EYES ABSENT)

`a4MatchFlags(17) = { ...a4MatchFlags(16), ...DS2_WORLD_DOORS }` — world 16 (the own-run world)
plus **exactly ONE door** and **NO pin at all**, the door DS-T1d's arm of record `OWNCOOP-E13`
carried:

| # | limb | value | source |
| --- | --- | --- | --- |
| 1 | the whole world-16 substrate | `a4MatchFlags(16)` — **CALLED, not copied** (which calls `(15)` → `(14)` → `(13)` → `(12)` → `(11)` → `(10)` → `(9)` → `(8)` → `(7)` → `(6)` → `(3)`) | the #411 entry's own composition line |
| 2 | ⭐ the cooperation-hats door | `dsCoopHatsOff` = true | DS-T0d M-DS.8 (`src/sim/Match.ts` — the flag, default OFF; the TWO gates, `src/ai/TeamBrain.ts`'s 套边 block and `src/sim/mechanics.ts`'s 二过一 trigger); DS-T1d's `buildMatch` on both COOP arms |
| 3 | ⛔ the pin | **NONE — no gene, no constant, no dose** | M-DS.8 designs no seat and prices nothing: it is a pure SUBTRACTION. `armDs2World` is `armDsWorld` CALLED and nothing more |
| 4 | world 14's own gene | `lnOwnLaneWeight` = 0.25, on `baseGenome` AND `effGenome` of BOTH sides — **arrives by the CALL**, never re-written here | world 14, unchanged |
| 5 | the L3 dose · the PC dose | world 8's, inherited whole (`?pcdose=0` unchanged) | world 16, unchanged |
| 6 | the eye · evolution opt-ins | **null** · **OFF** (no `evolve*` opt-in exists for this law) | world 6 / #165.2.ii, unchanged |

⭐⭐ **ONE DOOR, NO GENE, NO CONSTANT.** This is the third entry of the family whose bundle writes
nothing at all onto a genome (worlds 15 and 16 were the first two). `armDs2World(match, l3Dose,
pcDose)` is `armDsWorld(match, l3Dose, pcDose)` CALLED, full stop — the door is a CONSTRUCTION flag
and arrived with `a4MatchFlags(17)`. The entry layer declares no weight of its own; the pin suite
reads the source and proves it (`setDs2Gene` and `DS2_WORLD_WEIGHT` are absent by pin).

⭐⭐ **THE CONTAINMENT CALL IS THE WHOLE DESIGN.** Because `armDs2World` calls `armDsWorld`, world
14's `lnOwnLaneWeight` = 0.25 (both sides, both dosed views, never `info.genome`), world 12's two
exam pins and world 11's `dvExposureWeight` all arrive by the call and world 17 writes **zero**
values of its own — pinned at construction and at full time. ⭐ And `ds2ArmedVersion` reads the
world below by **CALLING `dsArmedVersion`**, never by re-reading `dsOwnRun` / `dsHatsOff`: the
DS-T0 seam map's `a4World.ts` counts stay at exactly `{ own: 2, hats: 2 }`, which
`tests/dsOwnRun.test.ts` pins and this commit does not touch.

⭐⭐⭐ **AND THE DOOR SET IS THE EXAM'S, PROVEN IN TWO HALVES.** DS-T1d built its arm of record as
`a4MatchFlags(13)` + `dsOwnRun: true` + `dsHatsOff: true` + `dsCoopHatsOff: true` +
`armA4World(m, null, 13)` — a **WORLD-13** composition (`scripts/probes/ds-t1d-coop-hats-exam.ts`,
`buildMatch`), because the exam ran before this world existed. World 17 sits on world 16's doors, so
the entry does **NOT** reproduce the exam's composition byte for byte; it reproduces the **DOOR
SET**, and the pin suite proves exactly that, in the form #414 item 5(v) names:

* **(a) the exam's own construction, re-run here ON WORLD 13**, reproduces DS-T1d's **STORED**
  per-seed whole-match signatures for `OWNCOOP-E13` — `perSeedCells[]['OWNCOOP-E13'].signature`,
  read from the `.RED.json` path — on **all twelve** of the first battery seeds
  **12,557,000–12,557,011** (≥ 2 was asked for; twelve reproduce, exactly). The recipe is read off
  the instrument: the exam's own `signatureOf` (which carries ONE extra field, `action.type`) and
  its unobserved walk (`while (!m.finished) m.step(DT)`), both written out in the suite rather than
  reused, because a pin that reproduces a stored value must use the recipe that produced it.
* **(b) `a4MatchFlags(16)` + the flag gives whole-match signatures IDENTICAL to
  `a4MatchFlags(17)`'s** (rng state included) at construction AND at full time, on **six** scratch
  seeds — so the door world 17 ADDS is the door the exam measured, on the substrate world 17
  actually sits on. The flag SET itself is pinned key for key:
  `{ ...a4MatchFlags(16), dsCoopHatsOff: true }` deep-equals `a4MatchFlags(17)`, and the added key
  set is exactly `['dsCoopHatsOff']`.

⛔ **WHAT IS NOT IN WORLD 17, AND WHY** (#414 item 5(i)): `obmMovement` (**the OBM seat is ABSENT —
that is the arm of record's own state**; the dose space belongs to selection, OBM-T2 later),
`ctbSupportPlane`, `rcAnticipate` / `rcReady`, `bfFacingCost`, `edsTouchCost`, and **no OBM gene**
(`offballMovementWeights` absent from `baseGenome`, `effGenome` AND `info.genome`). ONE door and
nothing else, because **the user's 16-vs-17 comparison must be clean.** Test-pinned six keys plus
the gene, absent from world 17 and from every world below.

⚠ **WORKER-SIMMED fixtures play the SHIPPED world** (canon, home ruling #283.2(iv), VERBATIM:
*"WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits matchFlags; true since
#155, stated now, test-pinned; refines #270's E4 correction; matches the perf diagnostic)"*).
⇒ **A watched world-17 match is the armed world; the league's background fixtures are not.**
Test-pinned here, on all three flag names.

## §2 THE HONEST BRIEF (each blurb sentence beside the DS-T1d FIELD and ARM it quotes)

Canon (home: PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4, VERBATIM): *"a stage
doc's prose quotes artifact FIELDS verbatim or the number becomes a gated face"*. Every number
in the blurbs is a DS-T1d field at 6 dp, read off
[`data/ds-t1d-coop-hats-exam.json.RED.json`](data/ds-t1d-coop-hats-exam.json.RED.json) **by field
and by arm**, with `node`, never by eye over 32 MB of JSON. ⚠ THE EFFECT OF RECORD is the **E13**
arm — the ARM OF RECORD `OWNCOOP-E13` against its control `OWN-E13` (EMPTY-BOOK, the seat ABSENT);
**D13** — the mature-book form the user actually plays — was **MEASURED this time**
(`OWNCOOP-D13` against `OWN-D13`), so the played form's numbers are its OWN, not an inference.

### (a) WHAT IT DOES

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 开放进攻里教练不再点名谁去套边 | the law itself — `dsCoopHatsOff` gate 1, M-DS.8 (`TeamBrain.assignRunners`' 套边 block is skipped whole; the corner-crash, live-corner and cross-flight branches return ABOVE it and are untouched) | — |
| 传球手也不再给自己发二过一的回敲许可 | the law itself — `dsCoopHatsOff` gate 2, M-DS.8 (`mechanics.performPass`' 2过1 trigger is skipped; `registerPass` sits ABOVE the gate, outside it) | — |
| 没有新常数,没有新基因 —— 这一步只是把两顶手写的帽子摘掉 | M-DS.8's own statement: two purely additive gates, no law, no constant, no gene, no percept read (DS-T0-OWN-RUN-SEAM §SWITCH-D) | — |

### (b) THE COST, SAID FIRST — the E13 arm (settings blurb + empty-book feed line)

The settings blurb's cost block opens with its own **ARM FRAME**
「(以下数字来自 E13 空账本臂,也就是这扇门量过的那一档)」 — GK-ENTRY §COMMANDER CORRECTIONS 3's rule.

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 套边到位每场 **0.092092 → 0**(原本大约每 11 场才有一次到位) | `coupling.overlapArrivalsPerMatch` (0.092092 → 0.000000; Δ −0.092092 [−0.111111, −0.074074]). ⚠ 「每 11 场一次」 is the commander's own word at #414 item 4(i) — the arithmetic written out: 1 ÷ 0.092092 = 10.86 | **OWN-E13 → OWNCOOP-E13** |
| 二过一每场 **0.211211 → 0**(原本大约每 5 场一次) | `coupling.wallReturnsPerMatch` (0.211211 → 0.000000; Δ −0.211211 [−0.242242, −0.182182]). ⚠ 「每 5 场一次」 likewise: 1 ÷ 0.211211 = 4.73 | **OWN-E13 → OWNCOOP-E13** |
| 传球手不再读那两个标签 —— 回敲读数每场 **10.067067 → 0**,套边出球读数每场 **2.629630 → 0** | `passer.wallReturnFiresPerMatch` · `passer.overlapReleaseFiresPerMatch` — the two LABEL reads starve to exactly zero | **OWN-E13 → OWNCOOP-E13** |
| 传球手读到「第三人」的次数也少了 —— 每场 **28.503504 → 27.558559**,差 **−0.944945**,区间 **[−1.582583, −0.304304]** | `passer.thirdManFiresPerMatch` — an ACTION-TYPE read, `resolved` **true**. ⚠ This is #414 §CORR 1's correction carried onto the surface: the exam's prose had called it "within noise" and its own stored row contradicts that. ⛔ The numbers are printed, no verdict word | **OWN-E13 → OWNCOOP-E13** |
| 前插的人略少 —— 每个有球 tick 平均前插人数 **0.247172 → 0.238918**,比值 **0.966607**,区间 **[0.953676, 0.980174]** | `r1.runsPerInPossessionTick` (Δ −0.008254 [−0.011588, −0.004856] against tolerance 0.068298, `floods` FALSE) and the exam's own STORED `r1.ratioOfRecord` 0.966607 [0.953676, 0.980174] | **OWN-E13 → OWNCOOP-E13** |
| 前插的份额从中场移到前锋 —— 中场 **0.025057 → 0.008874**,前锋 **0.619676 → 0.643971** | `runsByRole.share.MF` · `runsByRole.share.ST` | **OWN-E13 → OWNCOOP-E13** |

### (c) THE GUARDS — the E13 arm (labelled 「护栏(还是 E13 空账本臂)」 in the settings blurb)

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 进球 **3.254254**,差 **+0.061061**,区间 **[−0.073073, 0.190190]** 含零 | `guard.goalsPerMatch` (G1; `resolved` false, `breach` false) | **OWN-E13 → OWNCOOP-E13** |
| 射门、xG 转化、传球成功率、被断、控球、传球数、平均传球距离 —— 九条护栏一条都没有"分辨出来",每一条的区间都含零 | `guard.shotsPerMatch` (G2) · `guard.xgConversion` (G3) · `guard.passCompletion` (G4, a floor) · `guard.interceptionsPerMatch` (G5, a ceiling) · `guard.possessionShareSideA` (G6) · `guard.passesPerMatch` (G7) · `guard.meanAimDistanceMetres` (G8) — `resolved` FALSE and `breach` FALSE on every one of the NINE gating limbs; `guards.holdsBand` **true** with an EMPTY `breachSets` entry | **OWN-E13 → OWNCOOP-E13** |
| 直塞球 **5.476476**,差 **+0.120120**,区间 **[−0.050050, 0.283283]** 含零 | `guard.throughBallsPerMatch` (G9 — the arc's sore guard moves UP and does not resolve; tolerance 1.513237) | **OWN-E13 → OWNCOOP-E13** |
| 越位旗没有升起 | `offsides.rows['OWNCOOP-E13|OWN-E13']` — `flag` **false** (a flag needs a RESOLVED INCREASE; `resolved` is false) | **OWN-E13 → OWNCOOP-E13** |

### (d) THE PLAYED FORM — the D13 arm, MEASURED (its own heading in every surface)

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 前插人数(成熟账本)**0.252708 → 0.239194** | `r1.runsPerInPossessionTick` (Δ −0.013513 [−0.017521, −0.009433], tolerance 0.069827, `floods` FALSE) | **OWN-D13 → OWNCOOP-D13** |
| 套边到位(成熟账本)**0.146146 → 0** | `coupling.overlapArrivalsPerMatch` | **OWN-D13 → OWNCOOP-D13** |
| 二过一(成熟账本)**0.455455 → 0** | `coupling.wallReturnsPerMatch` | **OWN-D13 → OWNCOOP-D13** |
| 读数一样 | `reads.d13Agrees` **true** and `reads.d13AgreementWordPrinted` **"THIS PAIR SELECTS THE SAME READ"** — a STORED word, applied by the frozen rule to D13's own stored booleans (canon *counterfactual words are stored*). `guards.holdsBand['OWNCOOP-D13|OWN-D13']` is **true** with an EMPTY breach set, which is what the mature feed line's 「护栏这一档也没破」 claims — and it claims it WITHOUT printing E13's guard numbers | **OWNCOOP-D13** |
| (mature feed line) 回敲读数每场 **14.424424 → 0**,套边出球读数每场 **3.709710 → 0** | `passer.wallReturnFiresPerMatch` · `passer.overlapReleaseFiresPerMatch` | **OWN-D13 → OWNCOOP-D13** |
| (mature feed line) 「第三人」每场 **35.280280 → 34.731732**,区间含零 | `passer.thirdManFiresPerMatch` (Δ −0.548549 [−1.353353, 0.231231], `resolved` false) | **OWN-D13 → OWNCOOP-D13** |
| (mature feed line) 这一档有 **0.155785** 的前插是眼睛滞后漏进来的 | `state.runShare.own.ballInFlight` | **OWNCOOP-D13** |
| (mature feed line) 撞车率 **0.467635 → 0.463894** | `crowd.crashShare` | **OWN-D13 → OWNCOOP-D13** |

### (e) THE FIRST-LOOK DISCLOSURE — what NOT to expect

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| ⭐ 这块表看不见,不等于眼睛看不见——这道门就是请你的眼睛来判 | `reads.honestyLine`, VERBATIM: *"nothing the band can see" is NOT "nothing the eye can see" — the user's gate at world 17 judges the eye.* — rendered in plain Chinese, on ALL THREE surfaces | — |
| 没有造球员自己的套边/二过一 —— 那是球员身上的位子(DS-T0e),还没开 | contract §4 / STATUS #414: DS-T2 is SUPERSEDED by the read; the player-side seats are **DS-T0e, HELD**, opened only if the world-17 eye asks (no number claimed) | — |
| 角球、传中、定位球的点名照旧 | M-DS.8: the corner-crash-held, live-corner and cross-flight branches RETURN above gate 1 and are UNTOUCHED (no number claimed) | — |
| 球还在飞的时候的前插还没造 —— 现在有 **0.120532** 的前插是眼睛滞后漏进来的 | `state.runShare.own.ballInFlight` on the arm of record (M-DS.7 reads the PERCEIVED owner while the state classifier reads the engine's TRUTH, so stale eyes leak; the NAMED NEXT SLICE) | **OWNCOOP-E13** |
| 「有人挤人」不是这扇门的事 —— 撞车率 **0.440822 → 0.444334** | `crowd.crashShare` (§R3's CROWDING FAMILY — "not this door's"; its interval contains zero) | **OWN-E13 → OWNCOOP-E13** |
| ⚠ 联赛后台快速模拟的比赛跑的是原版世界 | canon *worker fixtures* (#283.2(iv)) | — |

⛔ **NOTHING IN THE BLURBS PROMISES A NUMBER THE EXAM DID NOT MEASURE**, and the pin suite reads
the actual UI strings to prove each arm's number stands under its OWN heading (the #387 item 1
class): the 29 E13 tokens appear on the empty-book feed line and are ABSENT from the mature line;
the 11 D13 tokens appear on the mature line and are ABSENT from the empty-book line; in the
settings blurb each of the two arms carries its label ADJACENT to its numbers
(「(以下数字来自 E13 空账本臂…)」, 「前插人数(成熟账本)」, 「套边到位(成熟账本)」,
「二过一(成熟账本)」, 「护栏(还是 E13 空账本臂)」) — and the disclosure block, which follows the D13
heading with two E13 numbers, carries its own label 「(以下两条仍是 E13 空账本臂的数)」 from the
start (the #412 §COMMANDER CORRECTIONS 1 lesson, applied before it could be a correction, and
PINNED this time — the settings-blurb pin gap #412 left open is closed here).

⛔ **AND NO HAND-WRITTEN PERCENTAGE APPEARS IN ANY OF THE THREE SURFACES.** Every number is a
field. The only derived figures anywhere in this rung are §THE COST FACE's two percentages and
§2(b)'s two 「每 N 场一次」 reciprocals, each with its arithmetic written out beside it.

## §3 THE SURFACES

| file | what |
| --- | --- |
| `src/game/a4World.ts` | `DS2_WORLD_VERSION = 17` · `DS2_WORLD_DOORS` · `isDs2World` · `armDs2World` (= `armDsWorld` CALLED, nothing more) · `ds2ArmedVersion` (containment: `dsArmedVersion(match) === 16` ∧ the flag — the world below CALLED, never re-read) · `a4MatchFlags(17)` (world 16's composition CALLED) · `armA4World` routes 17 · `a4ArmedVersion` reads 17 FIRST · `A4WorldVersion`/`A4ArmedVersion` gain 17 · the URL/sticky parse accepts `17`, the bound moves to `18` · the docblock's launch list |
| `src/game/GameApp.ts` | the armed-match guard and the pc-stack dose predicate include world 17 by the SAME single containment predicate world 16 extended · the feed blurb (BOTH dose forms) · the status line |
| `src/ui/A4WorldBadge.ts` | `A4_BADGE_TEXT_DS2` (+ `_EMPTY`) · both tables keyed at 17 |
| `src/ui/SettingsScreen.ts` | the world-17 checkbox (mutually exclusive with every other world — one value) + the long honest blurb |
| `tests/ds2PlaytestEntry.test.ts` | the pin suite (new) |
| narrows (this ruling) | listed in §THE NARROWED PINS below |

⭐ **THE DEFAULT LANDING WORLD IS UNCHANGED — BEFORE `0`, AFTER `0`** (the shipped game). World 17
is reached only by an explicit `?a4world=17` or an explicit tick in ⚙ → 🧬 Experimental.

⭐ **THE SURFACES ARE EXACTLY THE FOUR WORLD 16'S ENTRY TOUCHED, PLUS THE PIN SUITE AND THE
NARROWS** — no fifth src file, and **ZERO files under `src/sim`, `src/ai`, `src/evolution` or
`scripts/`** (`git diff --stat 4d3ff94 HEAD -- src/sim src/ai src/evolution scripts` EMPTY at the
commit). The engine is byte-untouched, so the OFF world cannot have moved (the structural
argument; the digests below are the measurement).

⛔ **THE NEW COMMENTS IN THE THREE UI/GAME FILES NAME NO FLAG IDENTIFIER IN PROSE** (LN-ENTRY
§DEVIATIONS 2 / GK-ENTRY §DEVIATIONS 4's ratified precedent), so neither seam map has to grow
past the entry layer.

## §4 WHAT THE USER'S EYES ARE FOR — HOW-TO-SEE (BINDING)

**How to switch it on** (the A4-PLAYTEST §2 form).

* Computer: ⚙ → 🧬 Experimental → tick **「配合帽子摘了 · 套边和二过一不再由教练和传球手点名 (play-test)」**.
  The current match restarts immediately in that world — same fixture, same seed, rebuilt.
* Phone: open the game with **`?a4world=17`** on the end of the URL. It sticks, so the link only
  has to be opened once. **`?a4world=16`** goes back to the SAME world WITH the two cooperation
  hats on (the A/B this gate is really about); **`?a4world=0`** puts the shipped game back.
* **`?a4world=17&pcdose=0`** is world 8's own contrast, inherited unchanged: everyone a novice.
  ⭐ That EMPTY-BOOK form is the **E13 arm of record** the exam's read was taken on.
* **The chip in the corner is the GROUND TRUTH**: 🧪 `配合帽子摘了 · 剂量成熟` (default) ·
  🧪 `配合帽子摘了 · 空账本(全新手)`. **If the chip is not there, you are not in this world.**
* ⚠ **What you are watching is the ONE match on screen** (canon #283.2(iv), §1).

**WHAT TO WATCH — in plain football language.**
⭐ **有没有「边路球员从外侧超车套边」的画面消失?** `coupling.overlapArrivalsPerMatch`
**0.092092 → 0** on the arm of record — one arrival about every 11 matches, gone.
⭐ **有没有「传完立刻回敲」的二过一消失?** `coupling.wallReturnsPerMatch` **0.211211 → 0** — one
return about every 5 matches, gone.
⭐⭐ **账面上原来就只有那么多 —— 所以最可能的答案是"看不出区别"。** That is the honest expectation,
and it is written on the surface. ⭐ **THE HONESTY LINE** (`reads.honestyLine`, VERBATIM):
*"nothing the band can see" is NOT "nothing the eye can see" — the user's gate at world 17 judges
the eye.*
⭐ **前插的人是不是几乎没变?** `r1.runsPerInPossessionTick` 0.247172 → 0.238918, the stored ratio
**0.966607**.
⭐ **中场是不是更不往前插了?** `runsByRole.share.MF` **0.025057 → 0.008874** (and
`runsByRole.share.ST` 0.619676 → 0.643971).
⭐ **直塞球还在吗?** `guard.throughBallsPerMatch` 5.476476, Δ **+0.120120**, the interval contains
zero.

**WHAT NOT TO EXPECT.**
* ⛔ **A player-side overlap or one-two** — nothing in world 17 PRICES either. The seats are
  **DS-T0e, HELD**, and they open only if the eye asks.
* ⛔ **Corners, crosses and set pieces** — their designation branches are untouched.
* ⛔ **A run onto a ball in flight** — not built. `state.runShare.own.ballInFlight` **0.120532**
  of own runs are won at a tick the truth calls *ball in flight*, and that is a LEAK through stale
  eyes, not a feature.
* ⛔ **Fewer bodies bumping into each other** — `crowd.crashShare` 0.440822 → 0.444334. Not this
  door's.
* ⛔ Anything about whether the world plays BETTER. Nothing here claims that.

**HOW TO COMPARE.** Same device, same sitting: open `?a4world=16`, watch a match, then
`?a4world=17` and watch another. Switching restarts the CURRENT fixture (same seed, rebuilt), so
you never wait a match to see the other world. The chip tells you which one you are in.

**THE VERDICT FORMAT** (A4-PLAYTEST §4), one line:

```
配合帽子摘了 (v17) — keep | change | revert — <one sentence in plain football language>
```

**THE LIKELIEST 「change」 AND ITS ANSWER, written on the surface** (#414 item 5(iv)):

* 「配合少了 / 没人套边了」 ⇒ the answer is **DS-T0e**, a player-side overlap / one-two **SEAT**
  (the body's own priced decision to go round the outside, and the passer's and runner's shared
  read of the return) — **not this entry**, which only takes the hand-written hats off.
* 「前插太少」 ⇒ the answer is the **continuous rank weight** or the **in-flight slice** — also not
  this entry.

## §IDENTITY — the shipped world, and every world below 17, byte-identical

**Definition, one source**: each walk builds a league at the ENGINE DEFAULT clock
(`new League({ seed })`, never overridden), takes its first fixture, constructs the match with
`a4MatchFlags(v)` (or none for production), arms with `armA4World(match, null, v, l3Dose, pcDose)`
— the SHIPPED composer — calls `runToCompletion()`, and hashes the match signature (the
`signature()` helper of
[`../../tests/ds2PlaytestEntry.test.ts`](../../tests/ds2PlaytestEntry.test.ts), field for field the
`dsPlaytestEntry` helper, rng state included). A world digest is `sha256` of its **twelve**
per-seed signatures joined by `|`, seeds **900,007,200 – 900,007,211** — the family's IDENTITY
band, **re-used deliberately** (#414 item 5(vii)).

⭐ The baseline column was taken **BEFORE a byte of this rung was written**, in a CLEAN throwaway
worktree at the dispatch HEAD (`git worktree add /tmp/ds2-entry-base 4d3ff94`, a symlinked shared
`node_modules`, `git status --short` EMPTY), by a throwaway walker in `/tmp` deleted immediately
after. The worktree was removed before the first edit.

| digest | at `4d3ff94` (baseline) | at this rung | verdict |
| --- | --- | --- | --- |
| production (no world) | `062067553ef3ae85f329d3d422b0576e15296471666a0ecb3b6912c40554a8ab` | same | ⭐ **IDENTICAL** |
| world 12 | `34e882b240967047c746203cadcc39311ddee4a9fe595361365b3daa8ffaeae0` | same | ⭐ **IDENTICAL** |
| world 13 | `9c9d3117a27192ef31229294ecc050f1e0b5b3a08ca047cc50a8631dc03704e3` | same | ⭐ **IDENTICAL** |
| world 14 | `0f3887d491099f4a4a17e220d6a63fae929de1af46b45948ae3cf1069e7821cf` | same | ⭐ **IDENTICAL** |
| world 15 | `2016c431bdadf5401d38ddedf82bd0596b4062986b6eea6ee06ccdbf34c3f4be` | same | ⭐ **IDENTICAL** |
| world 16 | `7090f7e67350e80e63e4413020c22d1c381845c1e84fcd7417840bdde944d8a4` | same | ⭐ **IDENTICAL** |
| world 17 | — (no such world) | ≠ world 16's | ⭐ **NEW, and non-vacuous** |

* ⭐⭐ **THE FIVE INHERITED LITERALS ARE DS-ENTRY-RUNG §IDENTITY's, CHARACTER FOR CHARACTER.** The
  band was re-used on purpose, and the bare / 12 / 13 / 14 / 15 digests recorded at `4d3ff94`
  equal the ones recorded at `0eefb9a` — no sim byte has moved between the two entries. (World 16
  has no earlier literal: it did not exist at `0eefb9a`.)
* ⭐⭐ **THE CONTAINMENT CALL DID NOT PERTURB WHAT IT CALLS.** `a4MatchFlags(17)` is built by
  calling `a4MatchFlags(16)`, and the bare world and worlds 12–16 walked to the final tick are
  bit-for-bit what they were before this commit. The six equalities are **RUN in the pin suite**,
  against the literals above.
* ⭐ **NON-VACUOUS**: world 17's digest DIFFERS from world 16's, so the door demonstrably bites in
  the entry's own path — the identity claim is not the claim that nothing happened.
* ⭐ **THE PRODUCTION FINGERPRINT RE-DERIVED UNCHANGED** by the repo's own script
  (`npm run fingerprint`, seed 1337, 2 seasons, 142 matches):
  **`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`** — the fingerprint of
  record, character for character, and the literal in `tests/a4HomeGrant.test.ts`.

## §NO NEW CHUNK — the precache list is unchanged, on two real clean-tree builds

`npm run build` in both clean trees, then `dist/sw.js` parsed for its own `PRECACHE` array:

| | `4d3ff94` | this rung |
| --- | ---: | ---: |
| precache entry count | **19** | **19** |
| entries naming an opt-in chunk (`pc-` / `l3-` / `stage3-`) | **0** | **0** |

The two lists are **entry-for-entry identical as SETS once content hashes are stripped** — the
same 19 roles (`./`, `./index.html`, `./manifest.webmanifest`, `./icon.svg`, four `./icons/*.png`,
`./assets/index.css`, `./assets/index.js`, `./assets/simWorker.js`, and the eight Pixi role
chunks `BufferResource` · `CanvasRenderer` · `Filter` · `RenderTargetSystem` · `WebGLRenderer` ·
`WebGPURenderer` · `browserAll` · `webworkerAll`). ⚠ **THE ORDER IS NOT CLAIMED** — it is a
function of the content hash, which `__APP_VERSION__` makes commit-dependent (GK-ENTRY §COMMANDER
CORRECTIONS 1). The SET and the COUNT are the claim. `OPT_IN_CHUNK_PREFIXES` in
`scripts/pwaAssets.ts` is **byte-unchanged** — this rung imports no artifact of its own, because
the cooperation-hats switch carries no table at all (one construction flag, no gene, no constant),
so there was nothing to precache or exclude. World 17 fetches exactly what world 16 fetches.

## §THE COST FACE — clean-tree builds at named commits, in BYTES

Canon (paraphrase; home PC-ENTRY-RUNG.md §COMMANDER CORRECTIONS item 4): *a build of record runs
on a CLEAN tree at a named commit.* Both sides were built on the same machine, from the same
`node_modules` (shared by symlink), with the same `tsc --noEmit && vite build`, each
`git status --short` EMPTY, on 2026-09-12. The gzipped column is vite's own reported figure.

⚠ **STATED IN BYTES, NEVER IN FILENAMES** (ruling #397 item 2/3): `vite.config.ts` bakes
`git describe --tags --always --dirty` into `__APP_VERSION__`, so every commit changes the
bundle's content hash and therefore its FILENAME. A chunk filename is never quoted as the commit
of record's; the byte SIZE is the face.

| | main bundle raw | gzipped |
| --- | ---: | ---: |
| baseline (`4d3ff94`, clean worktree) | **1,441,527 B** | **433.09 kB** |
| with this rung (clean tree at the build-of-record commit) | **1,449,450 B** | **435.23 kB** |
| ⇒ **the every-install cost** | **+7,923 B (+0.5496 %)** | **+2.14 kB (+0.4941 %)** (⚠ gzip is commit-dependent — the sha is baked into the content; the RAW bytes are the face of record; GK-ENTRY §COMMANDER CORRECTIONS 4) |

The deltas are DERIVED from the two byte figures beside them (1,449,450 − 1,441,527 = 7,923;
7,923 ÷ 1,441,527 = 0.5496 %; the gzip delta likewise from 435.23 − 433.09 = 2.14, ÷ 433.09 =
0.4941 %) — no third copy.
⭐ **AND THERE IS NO OPT-IN COST AT ALL**: world 17 fetches exactly what world 16 fetches. This
layer adds **no chunk** — the switch carries no table at all (one construction flag, no gene, no
constant), so there was nothing to precache or exclude.

## §THE NARROWED PINS (the DF-T0 §P7 form — stated POSITIVELY, never deleted)

Every hunk of this commit under `tests/` that is not the new suite. Each keeps its substantive
claim and states it in the positive form; **none is deleted**.

| # | file | the old claim | the new claim |
| --- | --- | --- | --- |
| 1 | `a4PlaytestEntry.test.ts` | the armed-match guard literal ends `\|\| isDsWorld(this.a4World))) {` | the SAME single guard, widened by `\|\| isDs2World(this.a4World)` on its own continuation line — still **ONE** guard, now naming world 17 too |
| 2 | `bkPlaytestEntry.test.ts` | the armed-match guard literal | widened by `\|\| isDs2World(this.a4World)` |
| 3 | `bkPlaytestEntry.test.ts` | the pc-stack predicate ends `\|\| isDsWorld(version);` | the SAME single predicate, widened by `\|\| isDs2World(version)` |
| 4 | `bkPlaytestEntry.test.ts` | the badge table holds **16** distinct names | it holds **17** |
| 5 | `bkPlaytestEntry.test.ts` | `?a4world=17` → null | `?a4world=17` → **17** (the DS2 entry) and the bound moves to **18** (`?a4world=18` → null) |
| 6 | `bqPlaytestEntry.test.ts` | `?a4world=17` → null | `?a4world=17` → **17**; the bound moves to **18** |
| 7 | `cbPlaytestEntry.test.ts` | `?a4world=17` → null | `?a4world=17` → **17**; the bound moves to **18** |
| 8 | `cbPlaytestEntry.test.ts` | the badge table holds **16** distinct names | it holds **17** |
| 9 | `dsCoopHatsOff.test.ts` | the §SEAM MAP per-file set is the FOUR seam files | it is **five**, with `src/game/a4World.ts` added and its count enumerated (**2**); the seam's own four files are byte-unchanged and every enumerated count is the dispatch HEAD's |
| 10 | `dsCoopHatsOff.test.ts` | `a4World.ts` contains `dsCoopHatsOff` **NOWHERE** (count 0) | `a4World.ts` names it in world 17's OWN bundle and nowhere else — count **2**, with BOTH executable sites enumerated (`DS2_WORLD_DOORS`'s object literal; `ds2ArmedVersion`'s ONE read); and the flag is **SET** in exactly ONE place (`dsCoopHatsOff: true` count **1** in `a4World.ts`, **0** in every other `src/**` file) with **ZERO** `.dsCoopHatsOff =` assignments outside `Match.ts`'s constructor. The env/bundle prohibitions (`EDS_BUNDLE_ARMED`, `process.env`) are UNTOUCHED |
| 11 | `dsCoopHatsOff.test.ts` | DORMANCY: "no world 1–16 carries the flag" | "no world 1–16 carries the flag; **WORLD 17 carries it**" — the same universal over 1–16, plus its positive counterpart at 17 (the flag AND a constructed match). Its file-local `Arm` type widened `world?: 13 \| 15 \| 16` → `… \| 17` so the positive case compiles; it relaxes no assertion |
| 12 | `dsPlaytestEntry.test.ts` | `?a4world=17` → null (its URL pin and its M3 mutant analogue, two hunks) | `?a4world=17` → **17**; the bound moves to **18**. `?a4world=16` → **16** is UNCHANGED, which is what that pin has always been about |
| 13 | `entriesW10W11.test.ts` | the armed-match guard literal | widened by `\|\| isDs2World(this.a4World)` |
| 14 | `entriesW10W11.test.ts` | the pc-stack predicate | widened by `\|\| isDs2World(version)` |
| 15 | `entriesW10W11.test.ts` | the badge table holds **16** distinct names | it holds **17** |
| 16 | `entriesW10W11.test.ts` | the EMPTY dose table holds **9** (worlds 8/9/10/11/12/13/14/15/16) | it holds **10** (…/17) |
| 17 | `entriesW10W11.test.ts` | `?a4world=17` → null | `?a4world=17` → **17**; the bound moves to **18** |
| 18 | `gkPlaytestEntry.test.ts` | `?a4world=17` → null (its URL pin and its M3 mutant analogue, two hunks) | `?a4world=17` → **17**; the bound moves to **18** |
| 19 | `l3PlaytestEntry.test.ts` | `?a4world=17` → null | `?a4world=17` → **17**; the bound moves to **18** |
| 20 | `l3PlaytestEntry.test.ts` | the badge table holds **16** distinct names | it holds **17** |
| 21 | `l3PlaytestEntry.test.ts` | the armed-match guard literal | widened by `\|\| isDs2World(this.a4World)` |
| 22 | `lnPlaytestEntry.test.ts` | `?a4world=17` → null | `?a4world=17` → **17**; the bound moves to **18** |
| 23 | `mtPlaytestEntry.test.ts` | the badge table holds **16** distinct names | it holds **17** |
| 24 | `pcPlaytestEntry.test.ts` | `?a4world=17` → null | `?a4world=17` → **17**; the bound moves to **18** |
| 25 | `pcPlaytestEntry.test.ts` | the badge table holds **16** distinct names | it holds **17** |
| 26 | `pcPlaytestEntry.test.ts` | the armed-match guard literal | widened by `\|\| isDs2World(this.a4World)` |
| 27 | `raPlaytestEntry.test.ts` | `?a4world=17` → null | `?a4world=17` → **17**; the bound moves to **18** |

⭐ **NO PROHIBITION WAS WIDENED BEYOND THE ENTRY LAYER.** `dsCoopHatsOff.test.ts`'s src-file map
gains exactly one member — `src/game/a4World.ts` — and its count is enumerated at both sites. The
badge's, the app's and the settings screen's new comments deliberately name **no flag identifier in
prose** (LN-ENTRY §DEVIATIONS 2 / GK-ENTRY §DEVIATIONS 4's precedent).

⭐⭐ **AND `tests/dsOwnRun.test.ts` IS UNTOUCHED.** Its §SEAM MAP still reads
`{ own: 2, hats: 2 }` for `src/game/a4World.ts`, because `ds2ArmedVersion` asks the world below by
CALLING `dsArmedVersion` instead of re-reading world 16's two flags. That was a design constraint of
the dispatch, and it is why this rung adds no hunk to that file at all.

### ⚠⚠ THE FROZEN INSTRUMENT NOW READS RED, DECLARED AND NOT EDITED

`scripts/probes/ds-t1d-coop-hats-exam.ts` is **FROZEN** (FREEZE `4fb35cf`, RESULTS `12cd606`;
#414 item 1 banks it byte-identical) and carries a **ZERO-COUNT ANCHOR** over `src/game/a4World.ts`
(§P.9, *"the switch reaches no world"* — the `a4World.ts` counts stated at that head as
`2 · 2 · 0`, and #414 item 4(iii) says in so many words that **the third will read RED the moment
DS-ENTRY-2 lands**).

**From this commit that anchor reads RED** — `a4World.ts` names `dsCoopHatsOff` twice, in world
17's own bundle. ⛔ **The instrument was NOT edited** (this rung touches no file under `scripts/`).
The commander writes DS-T1d's errata line at **#415** (the #412 item 3 FAMILY NOTE). DS-T1d's banked
results are unaffected — the anchor was a statement about the ENTRY LAYER at the exam's head, and
the entry layer is what this ruling changed.

## §THE PIN SUITE

[`tests/ds2PlaytestEntry.test.ts`](../../tests/ds2PlaytestEntry.test.ts), green from birth. The pin
COUNT derives from the suite itself (`npx vitest run tests/ds2PlaytestEntry.test.ts` prints it); it
is not typed here as a second copy (canon: *"a gate's NOTE derives from the same pinned values the
gate checks; a count typed beside its pin is a second copy"* — home
PT-C0-PLAYTEST-FORENSIC-CENSUS.md §COMMANDER CORRECTIONS item 1). What it pins: FIDELITY key for
key, with the ADDED key set exactly `['dsCoopHatsOff']` · ⛔ the six doors AND the OBM gene that do
NOT ride along, absent from world 17 and from every world below · the composition CALLED and the
arming CALLED with **NOTHING added** (the source is read: no gene setter, no weight constant, and
the containment read CALLS `dsArmedVersion`) · world 14's ONE inherited pin on `baseGenome` AND
`effGenome` of both sides at construction AND at full time, with `info.genome` carrying no such key
(canon dose placement) · ⭐⭐⭐ THE DOOR-SET IDENTITY in both halves — DS-T1d's STORED `OWNCOOP-E13`
signatures reproduced on twelve of its own battery seeds by the exam's own recipe, read from the
`.RED.json` path, and the spread-vs-composer equality on six scratch seeds · containment (17 names
itself 17, 16 stays 16, 15 stays 15, 14 stays 14, 13 stays 13, 12 stays 12, and the SOURCE ORDER
17 → 16 → 15 → 14 → 13 → 12) · ⭐ THE FLAG ALONE IS NOT ENOUGH (on a world-15 match it reads 0 and
falls back to 15) · the URL parse and the bound 18 · the badge in both dose forms and the chip
mount · the honest brief's field values as 6-dp strings in the surface that claims each, with the
E13-vs-D13 ATTRIBUTION pinned per feed line, the cost said BEFORE the win in both dose forms, the
cost block's ARM FRAME present, the disclosure block's own E13 label present, the HONESTY LINE on
all three surfaces, the likeliest 「change」 and its answer on the settings surface, and the
league-worker caveat + the eyes' block on BOTH dose lines · the entry doc and its rulings · dormancy
1–16 and world 17 positively · a plain League match · the worker's shipped world (all three flag
names absent from the serialized league) · the default landing world still `0` · THE MUTANT WALK
(four mutants, at runtime) · ⭐⭐ LIVENESS in the #402 item 2(iii) form · the six IDENTITY digests
and the non-vacuity · the fingerprint literal.

⭐⭐ **THE LIVENESS PIN CARRIES ITS EXEMPTION IN THE TEST'S OWN COMMENT** (ruling #402 item
2(iii), the G-BITE FORM RULE, extended by #414 item 4(ii)): world 17 ≠ world 16 whole-match
signature on **at least ONE** of twelve scratch seeds — **never "every seed"**, because this
flag's effect is a RARE EVENT and a full-time state snapshot is not a trajectory hash. DS-T1d's own
frozen `gBite` went RED for exactly that mechanism (25 of 994 eligible E13 seeds and 4 of 999 D13
with identical full-time signatures, every one differing from its control in 8–30 measurement
fields), and the family note it produced is written into the suite's comment beside the pin.

## §HONEST LIMITS

*(canon: this list is the ONE home; the artifact stores none of it and DS-T1d's own list stays in
its own doc — this list is about the WORLD, not about the exam.)*

* ⚠⚠ **THIS WORLD IS HONEST SUBTRACTION, NOT EMERGENCE** (#414 item 4(iv), the VISION audit).
  Taking the two hats off removes 指令; it does **not** add 信念. **Nothing in world 17 prices an
  overlap or a return.** The player-side seats — the body's own decision to go round the outside,
  the passer's and the runner's shared read of the give-and-go — are **DS-T0e, HELD**, and they are
  opened by the eye at this gate, not by this entry.
* ⚠⚠ **THE FAKE COOPERATION IS GONE AND THE REAL COOPERATION IS NOT BUILT** (#414 item 4(v), the
  REALITY audit). A real overlap is the full-back's own read of his winger's marker; a real one-two
  is a glance between two players. The shipped hats produced about one arrival every 11 matches and
  one return every 5. Real football produces both far more often, and produces them because two
  bodies READ each other — which this engine cannot yet express (RC 默契 dormant and HELD).
* ⚠⚠ **THE BAND CANNOT SEE THE LOSS, AND THAT IS NOT THE SAME AS THERE BEING NONE.** The honesty
  line is quoted verbatim in §2(e) and rendered on all three surfaces. `holdsBand` is TRUE with an
  EMPTY breach set and not one of the nine gating limbs even RESOLVES — but the faces that go to
  zero are RARE EVENTS, and a band built on per-match guards is the wrong instrument for a rare
  event. **The eye is the instrument at this gate.**
* ⚠ **THE THIRD-MAN READ FALLS, RESOLVED.** `passer.thirdManFiresPerMatch` 28.503504 → 27.558559,
  Δ −0.944945 [−1.582583, −0.304304]. The wall burst and the overlap run were action types the
  third-man scan consumed, so taking the hats off costs the passer about one third-man read in
  thirty. ⛔ Printed, not judged (#414 §CORR 1's own form).
* ⚠ **THE OWN-RUN CANDIDATE POOL GREW.** `seam.ownCandidatesPerMatch` 1146.304304 → 1176.562563,
  Δ +30.258258 [9.752753, 50.257257] — a body no longer wearing an overlap or a wall hat is
  eligible for the own-run candidate (#414 §CORR 2). The three families the seam's own law names
  (the restraint step, the DF clamp's share, the count) are unmoved.
* ⚠ **THE IN-FLIGHT LEAK IS STILL THERE: 0.120532.** `state.runShare.own.ballInFlight` on the arm
  of record. M-DS.7 reads the **PERCEIVED** ball's owner; the state classifier reads the engine's
  **TRUTH**, so stale eyes let about an eighth of the own runs through the guard. ⛔ **The honest
  run onto a ball in flight is NOT BUILT** — it is the named next slice, and the leak is not it.
* ⚠ **THE MIDFIELD RUNS A THIRD AS OFTEN.** `runsByRole.share.MF` 0.025057 → 0.008874 (and
  `runsByRole.share.DF` 0.008851 → 0.000802): the cooperation hats were the midfielder's and the
  defender's route into a run. The striker's share rises (0.619676 → 0.643971) and the winger's is
  flat (0.346416 → 0.346353). Whether that looks like football is the eye's question.
* ⚠ **THE EYES ARE ABSENT IN THIS WORLD.** The OBM seat is not armed (`obmMovement` absent, no OBM
  gene) — the arm of record's own state. ⛔ So this world is not "the hats off with eyes"; it is the
  hats off with the seat shut.
* ⚠ **ONE WORLD, ONE COMPOSITION.** World 17 has never been played against anything but world 16,
  and the exam's E-arms were EMPTY-BOOK on a WORLD-13 substrate. The door is proven identical; the
  substrate below it is world 16's, which the exam never walked.
* ⚠ **THE D13 ARM WAS DOSED BY THE SHIPPED LOADERS AT THE EXAM'S HEAD**, not from the user's own
  league books: DS-T1d's D13 arms called `loadL3Dose()` / `loadPcDose()` over the pinned dose files
  at the exam commit. The mature numbers are a MEASUREMENT of that composition, and the feed line
  says so in words.
* ⚠ **`gBite` WAS RED AT THE EXAM, AND IT IS A RECEIPT FORM, NOT A LIVENESS FAILURE** (#414 item
  4(ii)). It gated no direction and no read; the read stands on `holdsBand` and `floods`. The world
  17 liveness pin here is on the whole-match signature over twelve scratch seeds, with the
  rare-event exemption stated.
* ⚠ **THE DEFAULT WORLD IS UNCHANGED** and every world below 17 is byte-identical; the fingerprint
  is unchanged; **the league's background fixtures play the SHIPPED world** (canon *worker
  fixtures*) — a league table generated behind this world is not a league table of this world.

## §CHECKS

| check | result |
| --- | --- |
| `npm run typecheck` (`tsc --noEmit`) | **CLEAN** |
| `npx vitest run tests/ds2PlaytestEntry.test.ts` | **GREEN** (28 tests, 41.23 s — the count derived from the suite's own run) |
| the FULL suite, SERIAL (`npx vitest run --no-file-parallelism`) | **2,363 passed / 0 failed / 2,363 total, 172 files, 2,187.85 s** — ⭐ NOT ONE failure, and no re-run was needed |
| the load-dependent tests, RE-RUN ALONE | **NOT NEEDED** — the standing load-dependent flake (`tests/formationEvolution.test.ts`'s ten-season test, ruling #397 §COMMANDER CORRECTIONS item 7, which timed out inside the PARALLEL full run at #412) passed inside the SERIAL run. ⚠ Read the seconds as a record of one run (#412 §CORR 5); the counts reproduce |
| `npm run fingerprint` | **`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`** — UNCHANGED, character for character |
| IDENTITY digests (bare · 12 · 13 · 14 · 15 · 16) | **RUN in the suite against the `4d3ff94` literals — all six IDENTICAL**; world 17 ≠ world 16 (non-vacuous) |
| the door-set identity with DS-T1d | **(a) 12 of 12 stored `OWNCOOP-E13` signatures reproduced** on seeds 12,557,000–011; **(b) IDENTICAL whole-match signatures on 6 scratch seeds** at construction and at full time |
| `npm run build` × 2, clean trees at named commits | **precache 19 → 19**, opt-in entries **0 → 0**; bundle delta at §THE COST FACE, in BYTES |
| `git diff --stat 4d3ff94 HEAD -- src/sim src/ai src/evolution scripts` | **EMPTY** — the engine and every probe are byte-untouched |
| `git status --porcelain` at the commit | **EMPTY** |

⚠ **A DECLARED PROCESS NOTE ON THE COST FACE.** The entry-side build of record ran on a CLEAN tree
in a throwaway worktree at the pre-amend commit (`git status --short` EMPTY, `dist/` ignored). This
doc's §THE COST FACE, §NO NEW CHUNK and §CHECKS tables were then filled in with the measured figures
and the commit AMENDED (ONE commit, as dispatched — the world-16 form, #414 item 5(xiii)), so the
final commit's hash differs from the build commit while its `src/` and `tests/` are byte-identical
to it: the delta between the two is this docs file alone. ⚠ The bundle DOES depend on the commit
(#397 item 2): `vite.config.ts` bakes `git describe --tags --always --dirty` into
`__APP_VERSION__`, so every commit changes the bundle's content hash and therefore its FILENAME;
the byte SIZE is invariant across equal-length shas. That is why the cost face above is stated in
BYTES and quotes **no filename at all**. ⚠ The pre-amend commit is reflog-only and decays with the
reflog, as GK-ENTRY's `10c3b89`, LN-ENTRY's `5b6628a` and DS-ENTRY's did (GK-ENTRY §COMMANDER
CORRECTIONS 7 — precedent, not a defect).

## §THE MUTANT WALK — four mutants, all killed

The suite carries runtime analogues of all four as PERMANENT pins. Beside them, each mutation was
ALSO applied to `src/game/a4World.ts` on an UNCOMMITTED tree and restored from a `/tmp` byte copy
(`cmp`-verified, never `git checkout`); the run was `npx vitest run tests/ds2PlaytestEntry.test.ts`:

| # | the mutation | killed by (source-mutant run) |
| --- | --- | --- |
| M1 | THE DOOR DROPPED — `DS2_WORLD_DOORS = {} as const` | **10 red of 28** — FIDELITY (the key set AND the added-key set), the composition/arming pin, full time, the door-set identity half (b), CONTAINMENT, DORMANCY's positive half, M1's and M4's own analogues, ⭐ the NON-VACUITY digest and ⭐ LIVENESS |
| M2 | the composer calls `a4MatchFlags(15)` instead of `(16)` | **7 red of 28** — FIDELITY (the key set), the composition pin, full time, identity half (b), CONTAINMENT (17 requires 16), M2's and M4's analogues |
| M3 | the URL bound NOT moved — `?a4world=17` no longer parses | **2 red of 28** — the URL pin and M3's own runtime analogue |
| M4 | `a4ArmedVersion` reads 16 BEFORE 17 | **3 red of 28** — full time (`a4ArmedVersion` must read 17), CONTAINMENT (a world-17 match would name itself 16) and the SOURCE-ORDER pin |

⭐⭐ **M1 IS THE ONE THAT PROVES THE WORLD IS A WORLD.** With the only door gone, world 17 IS world
16 — so the identity section's NON-VACUITY row and the LIVENESS pin both go red beside the fidelity
pins. A bundle with a single door has no "one of two doors" mutant to run, so M1 empties the door
object instead (§DEVIATIONS 12).

⭐ **M4 IS THE INTERESTING ONE**: it is the BU-T1 §DOUBTS 7 mislabel class, and it dies twice —
once on the behaviour (`a4ArmedVersion(worldMatch(17))` must be 17, never 16) and once on the
source order, because the behavioural pin alone would survive a re-ordering that happened to keep
the answer right on the seeds walked.

## §DEVIATIONS (declared by the executor; the commander disposes)

1. ⚠⚠ **THE DOOR-SET IDENTITY IS PINNED IN TWO HALVES, AND THE FIRST HALF REPRODUCES THE EXAM'S
   STORED SIGNATURES RATHER THAN PINNING "THE DOOR SET INSTEAD".** #414 item 5(v) asked for ≥ 2 of
   the band; **all twelve** of seeds 12,557,000–011 reproduce exactly, by the exam's own
   `signatureOf` (which differs from this family's by one field, `action.type`) and its unobserved
   walk. BOTH recipes therefore live in the suite, each labelled with what it is for.
2. ⚠ **THE PIN SUITE READS THE 32 MB DS-T1d ARTIFACT AT ITS `.RED.json` PATH** to get those stored
   signatures, rather than pasting them as literals — the canon-preferred direction (no second copy
   of a stored value). The path is named in the suite and in this doc, and the artifact is never
   moved, renamed or copied (#414 item 5, exam §CORR 4).
3. ⚠ **THE BLURBS ARE PLAIN CHINESE WITHOUT INLINE FIELD NAMES** (GK-ENTRY §DEVIATIONS 2's
   precedent, ratified at #403 §CORR 10). The blurbs carry the numbers and their meaning in words;
   the FIELD NAMES live in the adjacent source comments and in §2's tables.
4. ⚠ **THE MATURE FEED LINE QUOTES D13's OWN PASSER-READ, IN-FLIGHT AND CROWDING FIELDS**, not only
   its R1 and the two disappearing faces: `passer.wallReturnFiresPerMatch` 14.424424 → 0.000000 ·
   `passer.overlapReleaseFiresPerMatch` 3.709710 → 0.000000 · `passer.thirdManFiresPerMatch`
   35.280280 → 34.731732 · `state.runShare.own.ballInFlight` 0.155785 · `crowd.crashShare`
   0.467635 → 0.463894. The dispatch listed only the D13 R1 and the two disappearing faces, but
   "each quoting the fields of ITS OWN arm" FORBIDS printing E13's disclosure numbers under the
   mature heading (the #387 item 1 class; GK-ENTRY §DEVIATIONS 3 and DS-ENTRY §DEVIATIONS 4's
   ratified precedent). Every one is a stored field of the same artifact, traced in §2(d), and each
   is pinned present on the mature line and ABSENT from the empty-book line.
5. ⚠ **THE MATURE LINE'S GUARD SENTENCE CARRIES NO NUMBER.** It says 「这一档的读数和空账本那一臂
   一样,护栏这一档也没破(这两句都是考试自己存下来的判词)」, which quotes `reads.d13Agrees` **true**
   and `guards.holdsBand['OWNCOOP-D13|OWN-D13']` **true** with an empty breach set — STORED
   booleans. Printing E13's guard levels there would have been the #387 item 1 class; printing
   D13's own nine guard rows would have added nine numbers the ruling did not ask for.
6. ⚠ **「每 11 场一次」 AND 「每 5 场一次」 ARE THE COMMANDER'S OWN WORDS, AND THEIR ARITHMETIC IS
   WRITTEN OUT.** #414 item 4(i) says "one overlap arrival every eleven matches, one one-two every
   five". The two FIELDS are what the surfaces print; the reciprocals are shown in §2(b)
   (1 ÷ 0.092092 = 10.86 and 1 ÷ 0.211211 = 4.73) so no reader has to take them on trust.
7. ⚠ **THE DISCLOSURE BLOCK'S E13 LABEL IS PRESENT FROM BIRTH AND PINNED.** #412 §COMMANDER
   CORRECTIONS 1 added 「(以下三条仍是 E13 空账本臂的数)」 to the world-16 settings blurb by hand and
   noted the pin gap. World 17's settings blurb carries 「(以下两条仍是 E13 空账本臂的数)」 from the
   start and the pin suite ASSERTS it — the gap #412 left open is closed.
8. ⚠⚠ **DS-T1d's FROZEN INSTRUMENT NOW READS RED, AND WAS NOT EDITED.** Its `a4World.ts`
   zero-count anchor for `dsCoopHatsOff` (§P.9) goes FALSE from this commit. Declared at §THE
   NARROWED PINS; the errata line is the commander's at #415 (#414 item 4(iii) predicted it in so
   many words). ⛔ Zero files under `scripts/` are in this commit.
9. ⚠ **THE THROWAWAY BASELINE WORKTREE SHARED THIS REPO'S `node_modules` BY SYMLINK** rather than
   a fresh `npm ci` (GK-ENTRY §DEVIATIONS 7's ratified precedent). Same machine, same lockfile,
   same package versions; the two builds therefore differ only in the tree's own source, which is
   what the cost face is measuring.
10. ⚠ **THE ARMED-MATCH GUARD LITERAL AND THE PC-STACK PREDICATE EACH NOW SPAN ONE MORE LINE**, so
    the suites that pin them as text literals gained a continuation line rather than a lengthened
    one. The claim — ONE guard and ONE predicate, each naming every world of the stack — is
    unchanged.
11. ⚠ **`tests/dsOwnRun.test.ts` IS NOT IN THE NARROWS TABLE BECAUSE IT DID NOT HAVE TO BE.**
    The dispatch required `ds2ArmedVersion` to CALL `dsArmedVersion` rather than re-read `dsOwnRun`
    / `dsHatsOff`, precisely so that file's `{ own: 2, hats: 2 }` seam map stays true. It does, and
    the file is byte-unchanged.
12. ⚠ **M1's SHAPE HAD TO CHANGE, BECAUSE THIS BUNDLE HAS ONLY ONE DOOR.** World 16's M1 dropped
    one of its two doors and ran the mutant in both halves. World 17 has a single door, so M1 empties
    `DS2_WORLD_DOORS` (`{} as const`) — the strongest available form of "the door dropped", and it
    reddens the non-vacuity and liveness pins as well as the fidelity ones, which the two-door form
    could not.

## §ROAD B — nothing ships

The default landing world is **0** before and after; every world below 17 is byte-identical; the
production fingerprint is unchanged; `src/sim`, `src/ai`, `src/evolution` and `scripts/` are
byte-untouched; the league serializes nothing new, so the worker's background fixtures play the
SHIPPED world. The flag is reached ONLY via `?a4world=17` or the Experimental checkbox — it is
never set outside `a4MatchFlags(17)`, and the narrowed pins read the source to prove exactly one
`: true` and no assignment exists anywhere in `src/**` outside `Match.ts`'s own constructor.
**ZERO frontier consumption** — scratch seeds 900,007,200–211 and 900,007,800–899 only, plus
DS-T1d's own already-consumed battery seeds 12,557,000–011 for the door-set identity pin (canon:
re-walking a consumed seed is not a consumption). ZERO stats.

## §NEXT — THE DS2 PLAY-TEST (USER GATE)

The world-16 gate is still open and a world-17 gate opens beside it. The verdict format is §4's:

```
配合帽子摘了 (v17) — keep | change | revert — <一句人话>
```

Behind the gate: **DS-T0e** (the player-side overlap / one-two SEATS — HELD, and opened only if the
eye asks for them) or **the in-flight slice** (the honest run onto a ball in flight, whose leak this
world measures at 0.120532), then **⑤**.
