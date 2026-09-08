# DS-ENTRY-RUNG — `?a4world=16` 自己的前插 (the own-run world: 前插是球员自己看着队友排位决定的,教练不再点名)

> Authorized by **COMMANDER RULING #411 item 4** (the dispatch), on **#411 item 1** (DS-T1c banked,
> verifier PASS, zero HIGH, 25 of 25 gates green, `allGreen` true), **#411 item 2** (the numbers of
> record) and **#411 item 3** (the read ruled, WITH its honest caveats — the caveats this brief
> carries).
> The law is the DS contract ([`DS-DESIGNATION-CONTRACT.md`](DS-DESIGNATION-CONTRACT.md) §2
> M-DS.1–5 / M-DS.6″ / M-DS.7, §4 NON-CLAIMS); the seam is **DS-T0/T0b/T0c**
> ([`DS-T0-OWN-RUN-SEAM.md`](DS-T0-OWN-RUN-SEAM.md) §LAW-C, §HONESTY-C); the exam of record is
> **DS-T1c** ([`DS-T1C-OWN-RUN-EXAM-RANK.md`](DS-T1C-OWN-RUN-EXAM-RANK.md), artifact
> [`data/ds-t1c-own-run-exam.json`](data/ds-t1c-own-run-exam.json)).
> **LINEAGE**: DS-C0 → DS-T0 → DS-T1 (FLOOD) → DS-T0b → DS-T1b (DRAIN) → DS-T0c (the rank
> restraint) → DS-T1c (the exam; read 1) → **this rung**.
> The SIXTEENTH entry of the play-test family (#155 → #167.5 → #184.2 → #211.3 → #269.4 →
> #282.4 → #300.6 → #309.5 → #337.5 → #365 → #386 → #396 → #402 → here).
> Pin suite: [`tests/dsPlaytestEntry.test.ts`](../../tests/dsPlaytestEntry.test.ts).
> ⛔ **Nothing ships to the default world**; the production fingerprint is unchanged; **the
> play-test verdict is the USER GATE** (watchability has no instrument — the standing law).
> ⭐ **World 15's gate is still OPEN and a world-16 gate opens beside it** — `?a4world=15` still
> plays world 15 byte for byte, so 15 can be compared against 16 on the same device.

## §1 THE BUNDLE (TWO DOORS, NO GENE, NO CONSTANT)

`a4MatchFlags(16) = { ...a4MatchFlags(15), ...DS_WORLD_DOORS }` — world 15 (the dive world) plus
**exactly TWO doors** and **NO pin at all**, the two doors DS-T1c's arm of record `OWN-E13-ABSENT`
carried:

| # | limb | value | source |
| --- | --- | --- | --- |
| 1 | the whole world-15 substrate | `a4MatchFlags(15)` — **CALLED, not copied** (which calls `(14)` → `(13)` → `(12)` → `(11)` → `(10)` → `(9)` → `(8)` → `(7)` → `(6)` → `(3)`) | the #402 entry's own composition line |
| 2 | ⭐ the own-run door | `dsOwnRun` = true | DS-T0/T0b/T0c (`src/sim/Match.ts` — the flag, default OFF; the ONE gate in `src/ai/PlayerBrain.ts`); DS-T1c's `buildMatch` on every OWN and HATS+OWN arm |
| 3 | ⭐ the hats-off door | `dsHatsOff` = true | DS-T0 M-DS.4 (`src/sim/Match.ts` — the flag, default OFF; the TWO gates in `src/ai/TeamBrain.ts`); DS-T1c's `buildMatch` on every OWN arm |
| 4 | ⛔ the pin | **NONE — no gene, no constant** | M-DS.6″: the ranking's literals are the COACH'S OWN numbers moved (`RUN_ROLE_W`, the designation's `/ 45`, `runnerCount`'s own thresholds), and `RUN_PRIOR_MAX` is DERIVED IN CODE. `armDsWorld` is `armGkWorld` CALLED and nothing more |
| 5 | world 14's own gene | `lnOwnLaneWeight` = 0.25, on `baseGenome` AND `effGenome` of BOTH sides — **arrives by the CALL**, never re-written here | world 14, unchanged |
| 6 | the L3 dose · the PC dose | world 8's, inherited whole (`?pcdose=0` unchanged) | world 15, unchanged |
| 7 | the eye · evolution opt-ins | **null** · **OFF** (no `evolve*` opt-in exists for this law) | world 6 / #165.2.ii, unchanged |

⭐⭐ **TWO DOORS, NO GENE, NO CONSTANT.** This is the second entry of the family whose bundle
writes nothing at all onto a genome (world 15 was the first). `armDsWorld(match, l3Dose, pcDose)`
is `armGkWorld(match, l3Dose, pcDose)` CALLED, full stop — both doors are CONSTRUCTION flags and
arrived with `a4MatchFlags(16)`. The entry layer declares no weight of its own; the pin suite
reads the source and proves it (`setDsGene` and `DS_WORLD_WEIGHT` are absent by pin).

⭐⭐ **THE CONTAINMENT CALL IS THE WHOLE DESIGN.** Because `armDsWorld` calls `armGkWorld`, world
14's `lnOwnLaneWeight` = 0.25 (both sides, both dosed views, never `info.genome`), world 12's two
exam pins and world 11's `dvExposureWeight` all arrive by the call and world 16 writes **zero**
values of its own — pinned at construction and at full time.

⭐⭐⭐ **AND THE DOOR SET IS THE EXAM'S, PROVEN IN TWO HALVES.** DS-T1c built its arm of record as
`a4MatchFlags(13)` + `dsOwnRun: true` + `dsHatsOff: true` + `armA4World(m, null, 13)` — a
**WORLD-13** composition (`scripts/probes/ds-t1c-own-run-exam.ts`, `buildMatch`), because the exam
ran before this world existed. World 16 sits on world 15's doors, so the entry does **NOT**
reproduce the exam's composition byte for byte; it reproduces the **DOOR SET**, and the pin suite
proves exactly that, in the form #411 item 4(iv) names:

* **(a) the exam's own construction, re-run here ON WORLD 13**, reproduces DS-T1c's **STORED**
  per-seed whole-match signatures for `OWN-E13-ABSENT` — `perSeedCells[].['OWN-E13-ABSENT'].signature`
  — on **all twelve** of the first battery seeds **12,556,000–12,556,011** (the band #411 item
  4(iv) names; ≥ 2 was asked for, twelve reproduce, exactly). The recipe is read off the
  instrument: the exam's own `signatureOf` (which carries ONE extra field, `action.type`) and the
  exam's own unobserved walk (`while (!m.finished) m.step(DT)`), both written out in the suite
  rather than reused, because a pin that reproduces a stored value must use the recipe that
  produced it.
* **(b) `a4MatchFlags(15)` + both flags gives whole-match signatures IDENTICAL to
  `a4MatchFlags(16)`'s** (rng state included) at construction AND at full time, on **six** scratch
  seeds — so the door set world 16 ADDS is the door set the exam measured, on the substrate world
  16 actually sits on. The flag SET itself is pinned key for key:
  `{ ...a4MatchFlags(15), dsOwnRun: true, dsHatsOff: true }` deep-equals `a4MatchFlags(16)`, and
  the added key set is exactly `['dsHatsOff', 'dsOwnRun']`.

⛔ **WHAT IS NOT IN WORLD 16, AND WHY** (#411 item 4(i)): `obmMovement` (**the OBM seat is ABSENT
— that is the arm of record's own state**; the dose space belongs to selection, OBM-T2 later),
`ctbSupportPlane` (the CTB plane is its own arc), `rcAnticipate` / `rcReady` (RC did not form —
banked dormant and HELD), `bfFacingCost` (BF's entry is its own question), `edsTouchCost` (never
in this arc), and **no OBM gene** (`offballMovementWeights` absent from `baseGenome`, `effGenome`
AND `info.genome`). TWO doors and nothing else, because **the user's 15-vs-16 comparison must be
clean**. Test-pinned six keys plus the gene, absent from world 16 and from every world below.

⚠ **WORKER-SIMMED fixtures play the SHIPPED world** (canon, home ruling #283.2(iv), VERBATIM:
*"WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits matchFlags; true since
#155, stated now, test-pinned; refines #270's E4 correction; matches the perf diagnostic)"*).
⇒ **A watched world-16 match is the armed world; the league's background fixtures are not.**
Test-pinned here, on both flag names.

## §2 THE HONEST BRIEF (each blurb sentence beside the DS-T1c FIELD it quotes)

Canon (home: PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4, VERBATIM): *"a stage
doc's prose quotes artifact FIELDS verbatim or the number becomes a gated face"*. Every number
in the blurbs is a DS-T1c field at 6 dp, read off
[`data/ds-t1c-own-run-exam.json`](data/ds-t1c-own-run-exam.json). ⚠ THE EFFECT OF RECORD is the
**E13** arm — the ARM OF RECORD `OWN-E13-ABSENT` against its control `HATS-E13-ABSENT`
(EMPTY-BOOK, the seat ABSENT); **D13** — the mature-book form the user actually plays — was
**MEASURED this time** (`OWN-D13` against `HATS-D13`), so the played form's numbers are its OWN,
not an inference.

### (a) WHAT IT DOES

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 开放进攻里教练不再每 0.4 秒点名谁前插、谁包抄 | the law itself — `dsHatsOff`, M-DS.4 (`assignRunners` skips exactly its TWO open-play blocks); the 0.4 s is the engine's own `TEAM_AI_INTERVAL`, anchored in the instrument (no number claimed of the exam) | — |
| 每个球员按同一套惯例——号码权重加位置——给自己看得到的队友排位,自己在该去的那一两个人里、而且看到球在队友脚下,才自己决定前插 | the law itself — `dsOwnRun`, M-DS.6″ (`runRank(role, localX)` = the coach's own ranking CODE-MOVED; `restraint = clamp01(count − rankAbove)` = the coach's `slice(0, count)` as a cap) and M-DS.7 (the PERCEIVED ball's owner must be a mate) | — |
| 没有新常数 | M-DS.6″'s own statement (#410 item 4(i)): the ranking's literals are the coach's own numbers moved and `RUN_PRIOR_MAX` is derived in code | — |

### (b) THE COST, SAID FIRST — the E13 arm (settings blurb + empty-book feed line)

The settings blurb's cost block opens with its own **ARM FRAME**
「(以下数字来自 E13 空账本臂,也就是这扇门量过的那一档)」 — GK-ENTRY §COMMANDER CORRECTIONS 3's rule.

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 前插的人少了一半多 —— 每个有球 tick 平均前插人数 **0.588555 → 0.253849**,这扇门的前插率是教练点名那一档的 **0.431309** | `r1.runsPerInPossessionTick` (HATS-E13-ABSENT 0.588555 → OWN-E13-ABSENT 0.253849; Δ −0.334706 [−0.342342, −0.326930], RESOLVED DOWN, `floods` FALSE) and the exam's own STORED ratio **0.431309** [0.423933, 0.439099] (§R1's beside-face) | **HATS-E13-ABSENT → OWN-E13-ABSENT** |
| 直塞球每场 **5.860861 → 5.306306**,在容差内 | `guard.throughBallsPerMatch` (G9; Δ −0.554555 [−0.744745, −0.347347] against tolerance 1.619448 — INSIDE, `breach` FALSE) | **HATS-E13-ABSENT → OWN-E13-ABSENT** |
| 开放进攻里的包抄/倒三角那顶帽子也一起摘了 —— 包抄点名每场 **16.577578 → 1.558559**,倒三角传中每场 **5.030030 → 0.979980** | `coupling.arriverSetsPerMatch` (16.577578 → 1.558559) and `coupling.cutbackTakenPerMatch` (5.030030 → 0.979980) — the fields #411 item 3(v)'s caveat names ("the cutback ARRIVER hat is off in open play too") | **HATS-E13-ABSENT → OWN-E13-ABSENT** |
| 每次前插的产出比教练点名的低:每段前插 **0.047234** 次射门对 **0.132072** | `own.shotsPerEpisode` (0.047234, numerator 2,993 ÷ 63,366) vs `ep.shotsPerEpisode.runner` (0.132072, 1,634 ÷ 12,372) — BOTH on the arm of record, the exam's own YIELD PAIR (⛔ no verdict word on it there, and none here) | **OWN-E13-ABSENT (both limbs)** |
| 但前插的段数是五倍,**63.429429** 段对 **12.384384** 段 | `own.episodesPerMatch` 63.429429 vs `ep.setsPerMatch.runner` 12.384384, both on the arm of record. ⚠ 「五倍」 is the commander's own word at #411 item 2 (63.429429 ÷ 12.384384 = 5.12 — the arithmetic written out here, and the two FIELDS are what the surfaces print) | **OWN-E13-ABSENT (both limbs)** |

### (c) THE MEASURED WIN — the E13 arm

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 开放进攻的点名板空了 —— 教练每个有球 tick 点名的前插人数 **1.521690 → 0.191037**,剩下的只有角球包抄和传中那两个分支 | `runCount.mean` (1.521690 → 0.191037, unit *designated runners per in-possession coach tick*), with `board.openPlayEmptyShare` 1.000000 and the STORED BOOLEAN `openPlayBoardEmpty` **true** on the arm of record (the control reads 0.101862 and false) | **HATS-E13-ABSENT → OWN-E13-ABSENT** |

### (d) THE GUARDS — the E13 arm (labelled 「护栏(还是 E13 空账本臂)」 in the settings blurb)

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 进球 **3.324324 → 3.350350** | `guard.goalsPerMatch` (G1; Δ +0.026026 [−0.121121, 0.176176], UNRESOLVED — the interval contains zero) | **HATS-E13-ABSENT → OWN-E13-ABSENT** |
| 射门、xG 转化、控球都没破护栏 | `guard.shotsPerMatch` (G2) · `guard.xgConversion` (G3) · `guard.possessionShareSideA` (G6) — `breach` FALSE on each; `holdsBand` TRUE with an EMPTY breach set | **HATS-E13-ABSENT → OWN-E13-ABSENT** |
| 传球成功率 **0.582113 → 0.586816** | `guard.passCompletion` (G4, a FLOOR; Δ +0.004703, RESOLVED UP) | **HATS-E13-ABSENT → OWN-E13-ABSENT** |
| 被断 **27.384384 → 25.870871** | `guard.interceptionsPerMatch` (G5, a CEILING; Δ −1.513514, RESOLVED DOWN, inside 7.566738) | **HATS-E13-ABSENT → OWN-E13-ABSENT** |
| 越位每场 **2.478478**,少了 **0.167167** —— 旗没举起来 | `guard.offsidesPerMatch` (G10, control level 2.478478; Δ −0.167167 [−0.300300, −0.025025], RESOLVED DOWN — and a flag needs a resolved INCREASE, so it is NOT raised) | **HATS-E13-ABSENT → OWN-E13-ABSENT** |

### (e) THE PLAYED FORM — the D13 arm, MEASURED (its own heading in every surface)

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 前插人数(成熟账本)**0.660191 → 0.255253** | `r1.runsPerInPossessionTick` (HATS-D13 0.660191 → OWN-D13 0.255253; Δ −0.404938 [−0.413832, −0.396376], `floods` FALSE) | **HATS-D13 → OWN-D13** |
| 直塞球(成熟账本)**6.811812 → 6.301301** | `guard.throughBallsPerMatch` (Δ −0.510511 [−0.740741, −0.294294] against tolerance 1.882211 — INSIDE) | **HATS-D13 → OWN-D13** |
| 读数一样 | `reads.d13Agrees` **true** and `reads.d13AgreementWordPrinted` **"THIS ARM SELECTS THE SAME READ"** — a STORED word, applied by the frozen rule to D13's own stored booleans (canon *counterfactual words are stored*). `reads.selectors['OWN-D13'].holdsBand` is **true** with an EMPTY breach set, which is what the mature feed line's 「护栏这一档也没破」 claims — and it claims it WITHOUT printing E13's guard numbers | **OWN-D13** |
| (mature feed line) 包抄点名每场 **16.508509 → 1.630631**,倒三角传中每场 **5.575576 → 1.103103** | `coupling.arriverSetsPerMatch` · `coupling.cutbackTakenPerMatch` | **HATS-D13 → OWN-D13** |
| (mature feed line) 每段前插 **0.043998** 次射门对 **0.141444**;**77.058058** 段对 **10.622623** 段 | `own.shotsPerEpisode` vs `ep.shotsPerEpisode.runner`; `own.episodesPerMatch` vs `ep.setsPerMatch.runner` — all four on `OWN-D13` | **OWN-D13 (all four limbs)** |
| (mature feed line) 教练每个有球 tick 点名的前插人数 **1.515195 → 0.159770** | `runCount.mean` | **HATS-D13 → OWN-D13** |

### (f) THE FIRST-LOOK DISCLOSURE — what NOT to expect

| blurb sentence | the field it quotes | arm |
| --- | --- | --- |
| 套边和二过一那两顶帽子还在,是下一步(DS-T2)的事 | contract §4 NON-CLAIMS (the overlap and the wall pass have their own licence, DS-T2); DS-T1c's own coupling faces are published beside (no number claimed here) | — |
| 角球、传中、定位球的点名照旧 | M-DS.4: the corner-crash-held, live-corner and cross-flight branches are UNTOUCHED (no number claimed) | — |
| 球还在飞的时候的前插还没造 —— 现在有 **0.119467** 的前插是眼睛滞后漏进来的 | `state.runShare.own.ballInFlight` (0.119467 on the arm of record — UP from DS-T1b's stored 0.100272; M-DS.7 reads the PERCEIVED owner while the state classifier reads the engine's TRUTH, so stale eyes leak. DS-T1c §HONEST LIMITS 2; the NAMED NEXT SLICE) | **OWN-E13-ABSENT** |
| (mature feed line) 这一档有 **0.157355** 的前插是眼睛滞后漏进来的 | `state.runShare.own.ballInFlight` | **OWN-D13** |
| 「有人挤人」不是这扇门的事 —— 撞车率 **0.439480 → 0.449494** | `crowd.crashShare` (§R3's CROWDING FAMILY — "not this door's") | **HATS-E13-ABSENT → OWN-E13-ABSENT** |
| (mature feed line) 撞车率 **0.477069 → 0.465658** | `crowd.crashShare` | **HATS-D13 → OWN-D13** |
| ⚠ 联赛后台快速模拟的比赛跑的是原版世界 | canon *worker fixtures* (#283.2(iv)) | — |

⛔ **NOTHING IN THE BLURBS PROMISES A NUMBER THE EXAM DID NOT MEASURE**, and the pin suite reads
the actual UI strings to prove each arm's number stands under its OWN heading (the #387 item 1
class): the 26 E13 tokens appear on the empty-book feed line and are ABSENT from the mature line;
the 17 D13 tokens appear on the mature line and are ABSENT from the empty-book line; in the
settings blurb each of the two arms carries its label ADJACENT to its numbers
(「(以下数字来自 E13 空账本臂…)」, 「前插人数(成熟账本)」, 「直塞球(成熟账本)」,
「护栏(还是 E13 空账本臂)」) — ⚠ EXCEPT the disclosure block, which followed the D13 heading with three E13
numbers (0.119467 · 0.439480 → 0.449494) and no label; the label 「(以下三条仍是 E13 空账本臂的数)」 was
added by the commander at #412 (§COMMANDER CORRECTIONS 1).

⛔ **AND NO HAND-WRITTEN PERCENTAGE APPEARS IN ANY OF THE THREE SURFACES.** Every number is a
field. The only derived figures anywhere in this rung are §THE COST FACE's two percentages and
§2(b)'s 5.12, each with its arithmetic written out beside it.

## §3 THE SURFACES

| file | what |
| --- | --- |
| `src/game/a4World.ts` | `DS_WORLD_VERSION = 16` · `DS_WORLD_DOORS` · `isDsWorld` · `armDsWorld` (= `armGkWorld` CALLED, nothing more) · `dsArmedVersion` (containment: 16 ⊃ 15, BOTH doors required) · `a4MatchFlags(16)` (world 15's composition CALLED) · `armA4World` routes 16 · `a4ArmedVersion` reads 16 FIRST · `A4WorldVersion`/`A4ArmedVersion` gain 16 · the URL/sticky parse accepts `16`, the bound moves to `17` · the docblock's launch list |
| `src/game/GameApp.ts` | the armed-match guard and the pc-stack dose predicate include world 16 by the SAME single containment predicate world 15 extended · the feed blurb (BOTH dose forms) · the status line |
| `src/ui/A4WorldBadge.ts` | `A4_BADGE_TEXT_DS` (+ `_EMPTY`) · both tables keyed at 16 |
| `src/ui/SettingsScreen.ts` | the world-16 checkbox (mutually exclusive with every other world — one value) + the long honest blurb |
| `tests/dsPlaytestEntry.test.ts` | the pin suite (new) |
| narrows (this ruling) | listed in §THE NARROWED PINS below |

⭐ **THE DEFAULT LANDING WORLD IS UNCHANGED — BEFORE `0`, AFTER `0`** (the shipped game). World 16
is reached only by an explicit `?a4world=16` or an explicit tick in ⚙ → 🧬 Experimental.

⭐ **THE SURFACES ARE EXACTLY THE FOUR WORLD 15'S ENTRY TOUCHED, PLUS THE PIN SUITE AND THE
NARROWS** — no fifth src file, and **ZERO files under `src/sim`, `src/ai`, `src/evolution` or
`scripts/`** (`git diff --stat 0eefb9a HEAD -- src/sim src/ai src/evolution scripts` EMPTY at the
commit). The engine is byte-untouched, so the OFF world cannot have moved (the structural
argument; the digests below are the measurement).

## §4 WHAT THE USER'S EYES ARE FOR — HOW-TO-SEE (BINDING)

**How to switch it on** (the A4-PLAYTEST §2 form).

* Computer: ⚙ → 🧬 Experimental → tick **「自己的前插 · 前插是球员自己看着队友排位决定的,教练不再点名 (play-test)」**.
  The current match restarts immediately in that world — same fixture, same seed, rebuilt.
* Phone: open the game with **`?a4world=16`** on the end of the URL. It sticks, so the link only
  has to be opened once. **`?a4world=15`** goes back to the dive world WITH the coach still
  calling the runs (the A/B this gate is really about); **`?a4world=0`** puts the shipped game back.
* **`?a4world=16&pcdose=0`** is world 8's own contrast, inherited unchanged: everyone a novice.
  ⭐ That EMPTY-BOOK form is the E13 arm the exam's read of record was taken on.
* **The chip in the corner is the GROUND TRUTH**: 🧪 `自己的前插 · 剂量成熟` (default) ·
  🧪 `自己的前插 · 空账本(全新手)`. **If the chip is not there, you are not in this world.**
* ⚠ **What you are watching is the ONE match on screen** (canon #283.2(iv), §1).

**WHAT TO WATCH — in plain football language.**
⭐ **前插的人是不是少了,但该跑的人——前锋、边锋——还在跑?** That is the door's own shape:
`runClass`/role mix on the arm of record is ST **0.615021** · WG **0.351295** · MF **0.023938** ·
DF **0.009746**, against the coach's ST 0.507218 · WG 0.431489 · MF 0.055800 · DF 0.005493.
⭐ **有没有「四五个人一起往前冲」的画面消失?** `r1.floodShareAtLeastThree`
**0.013858 → 0.002162** — team-ticks carrying THREE OR MORE runners.
⭐ **直塞球是不是还在?** `guard.throughBallsPerMatch` 5.860861 → 5.306306, INSIDE tolerance
1.619448. Fewer, not gone.
⭐ **倒三角包抄是不是变少了?** `coupling.cutbackTakenPerMatch` 5.030030 → 0.979980 — the
open-play arriver hat came off with the runner hat, and the commander says so plainly
(#411 item 3(v)).

**WHAT NOT TO EXPECT.**
* ⛔ **套边 and 二过一** — their hats are still on; that is DS-T2's slice, not this one.
* ⛔ **Corners, crosses and set pieces** — their designation branches are untouched.
* ⛔ **A run onto a ball in flight** — not built. `state.runShare.own.ballInFlight` **0.119467**
  of own runs are won at a tick the truth calls *ball in flight*, and that is a LEAK through stale
  eyes, not a feature.
* ⛔ **Fewer bodies bumping into each other** — `crowd.crashShare` 0.439480 → 0.449494. Not this
  door's.
* ⛔ Anything about whether the world plays BETTER. Nothing here claims that.

**HOW TO COMPARE.** Same device, same sitting: open `?a4world=15`, watch a match, then
`?a4world=16` and watch another. Switching restarts the CURRENT fixture (same seed, rebuilt), so
you never wait a match to see the other world. The chip tells you which one you are in.

**THE VERDICT FORMAT** (A4-PLAYTEST §4), one line:

```
自己的前插 (v16) — keep | change | revert — <one sentence in plain football language>
```

## §IDENTITY — the shipped world, and every world below 16, byte-identical

**Definition, one source**: each walk builds a league at the ENGINE DEFAULT clock
(`new League({ seed })`, never overridden), takes its first fixture, constructs the match with
`a4MatchFlags(v)` (or none for production), arms with `armA4World(match, null, v, l3Dose, pcDose)`
— the SHIPPED composer — calls `runToCompletion()`, and hashes the match signature (the
`signature()` helper of [`../../tests/dsPlaytestEntry.test.ts`](../../tests/dsPlaytestEntry.test.ts),
field for field the `gkPlaytestEntry` helper, rng state included). A world digest is `sha256` of
its **twelve** per-seed signatures joined by `|`, seeds **900,007,200 – 900,007,211** (scratch,
out of band).

⭐ The baseline column was taken **BEFORE a byte of this rung was written**, in a CLEAN throwaway
worktree at the dispatch HEAD (`git worktree add /tmp/ds-entry-base 0eefb9a`, a symlinked shared
`node_modules`, `git status --short` EMPTY), by a throwaway walker in `/tmp` deleted immediately
after. The worktree was removed before the first edit.

| digest | at `0eefb9a` (baseline) | at this rung | verdict |
| --- | --- | --- | --- |
| production (no world) | `062067553ef3ae85f329d3d422b0576e15296471666a0ecb3b6912c40554a8ab` | same | ⭐ **IDENTICAL** |
| world 12 | `34e882b240967047c746203cadcc39311ddee4a9fe595361365b3daa8ffaeae0` | same | ⭐ **IDENTICAL** |
| world 13 | `9c9d3117a27192ef31229294ecc050f1e0b5b3a08ca047cc50a8631dc03704e3` | same | ⭐ **IDENTICAL** |
| world 14 | `0f3887d491099f4a4a17e220d6a63fae929de1af46b45948ae3cf1069e7821cf` | same | ⭐ **IDENTICAL** |
| world 15 | `2016c431bdadf5401d38ddedf82bd0596b4062986b6eea6ee06ccdbf34c3f4be` | same | ⭐ **IDENTICAL** |
| world 16 | — (no such world) | ≠ world 15's | ⭐ **NEW, and non-vacuous** |

* ⭐⭐ **THE CONTAINMENT CALL DID NOT PERTURB WHAT IT CALLS.** `a4MatchFlags(16)` is built by
  calling `a4MatchFlags(15)`, and the bare world, world 12, world 13, world 14 and world 15 walked
  to the final tick are bit-for-bit what they were before this commit. The five equalities are
  **RUN in the pin suite**, against the literals above.
* ⭐ **NON-VACUOUS**: world 16's digest DIFFERS from world 15's, so the doors demonstrably bite in
  the entry's own path — the identity claim is not the claim that nothing happened.
* ⭐ **THE PRODUCTION FINGERPRINT RE-DERIVED UNCHANGED** by the repo's own script
  (`npm run fingerprint`, seed 1337, 2 seasons, 142 matches):
  **`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`** — the fingerprint of
  record, character for character, and the literal in `tests/a4HomeGrant.test.ts`.

## §NO NEW CHUNK — the precache list is unchanged, on two real clean-tree builds

`npm run build` in both clean trees, then `dist/sw.js` parsed for its own `PRECACHE` array:

| | `0eefb9a` | this rung |
| --- | ---: | ---: |
| precache entry count | **19** | **19** |
| entries naming an opt-in chunk (`pc-` / `l3-` / `stage3-`) | **0** | **0** |

The two lists are **entry-for-entry identical as SETS once content hashes are stripped** — the
same 19 roles (`./`, `./index.html`, `./manifest.webmanifest`, `./icon.svg`, four `./icons/*.png`,
`./assets/index.css`, `./assets/index.js`, `./assets/simWorker.js`, and the eight Pixi role
chunks `BufferResource` · `CanvasRenderer` · `Filter` · `RenderTargetSystem` · `WebGLRenderer` ·
`WebGPURenderer` · `browserAll` · `webworkerAll`). ⚠ **THE ORDER IS NOT CLAIMED** — it is a
function of the content hash, which `__APP_VERSION__` makes commit-dependent (GK-ENTRY §COMMANDER
CORRECTIONS 1: a "same order" claim was FALSE at that rung's commit of record). The SET and the
COUNT are the claim. `OPT_IN_CHUNK_PREFIXES` in `scripts/pwaAssets.ts` is **byte-unchanged** —
this rung imports no artifact of its own, because the own-run law carries no table at all (two
construction flags, no gene, no constant), so there was nothing to precache or exclude. World 16
fetches exactly what world 15 fetches.

## §THE COST FACE — clean-tree builds at named commits, in BYTES

Canon (paraphrase; home PC-ENTRY-RUNG.md §COMMANDER CORRECTIONS item 4): *a build of record runs
on a CLEAN tree at a named commit.* Both sides were built on the same machine, from the same
`node_modules` (shared by symlink), with the same `tsc --noEmit && vite build`, each
`git status --short` EMPTY, on 2026-09-08. The gzipped column is vite's own reported figure.

⚠ **STATED IN BYTES, NEVER IN FILENAMES** (ruling #397 item 2/3): `vite.config.ts` bakes
`git describe --tags --always --dirty` into `__APP_VERSION__`, so every commit changes the
bundle's content hash and therefore its FILENAME. A chunk filename is never quoted as the commit
of record's; the byte SIZE is the face.

| | main bundle raw | gzipped |
| --- | ---: | ---: |
| baseline (`0eefb9a`, clean worktree) | **1,454,229 B** | **435.19 kB** |
| with this rung (clean tree at the build-of-record commit) | **1,461,409 B** | **437.38 kB** |
| ⇒ **the every-install cost** | **+7,180 B (+0.4937 %)** | **+2.19 kB (+0.5032 %)** (⚠ gzip is commit-dependent — the sha is baked into the content; the RAW bytes are the face of record; GK-ENTRY §COMMANDER CORRECTIONS 4) |

The deltas are DERIVED from the two byte figures beside them (1,461,409 − 1,454,229 = 7,180; 7,180 ÷ 1,454,229 = 0.4937 %; the gzip delta likewise from 437.38 − 435.19 = 2.19, ÷ 435.19 = 0.5032 %) — no third copy.
⭐ **AND THERE IS NO OPT-IN COST AT ALL**: world 16 fetches exactly what world 15 fetches. This
layer adds **no chunk** — the own-run law carries no table at all (two construction flags, no
gene, no constant), so there was nothing to precache or exclude.

## §THE NARROWED PINS (the DF-T0 §P7 form — stated POSITIVELY, never deleted)

Every hunk of this commit under `tests/` that is not the new suite. Each keeps its substantive
claim and states it in the positive form; **none is deleted**. (⚠ #412 §COMMANDER CORRECTIONS 3: one hunk
was missing from the table — `tests/dsOwnRun.test.ts`'s file-local `Arm` type widened `world?: 12 | 13 | 14 |
15` → `… | 16` so the new positive dormancy case compiles; it relaxes no assertion.)

| # | file | the old claim | the new claim |
| --- | --- | --- | --- |
| 1 | `a4PlaytestEntry.test.ts` | the armed-match guard literal ends `\|\| isGkWorld(this.a4World))) {` | the SAME single guard, widened by `\|\| isDsWorld(this.a4World)` on its own continuation line — still **ONE** guard, now naming world 16 too |
| 2 | `bkPlaytestEntry.test.ts` | the armed-match guard literal | widened by `\|\| isDsWorld(this.a4World)` |
| 3 | `bkPlaytestEntry.test.ts` | the pc-stack predicate ends `\|\| isGkWorld(version);` | the SAME single predicate, widened by `\|\| isDsWorld(version)` |
| 4 | `bkPlaytestEntry.test.ts` | the badge table holds **15** distinct names | it holds **16** |
| 5 | `bkPlaytestEntry.test.ts` | `?a4world=16` → null | `?a4world=16` → **16** (the DS entry) and the bound moves to **17** (`?a4world=17` → null) |
| 6 | `bqPlaytestEntry.test.ts` | `?a4world=16` → null | `?a4world=16` → **16**; the bound moves to **17** |
| 7 | `cbPlaytestEntry.test.ts` | `?a4world=16` → null | `?a4world=16` → **16**; the bound moves to **17** |
| 8 | `cbPlaytestEntry.test.ts` | the badge table holds **15** distinct names | it holds **16** |
| 9 | `dsOwnRun.test.ts` | the §SEAM MAP per-file set is the FOUR seam files | it is **five**, with `src/game/a4World.ts` added and its own counts enumerated (`{ own: 2, hats: 2 }`); the seam's own four files are byte-unchanged and every enumerated count is the dispatch HEAD's |
| 10 | `dsOwnRun.test.ts` | `a4World.ts` contains `dsOwnRun`/`dsHatsOff` **NOWHERE** (count 0 each) | `a4World.ts` names each in world 16's OWN bundle and nowhere else — count **2** each, with BOTH executable sites enumerated (`DS_WORLD_DOORS`'s object literal; `dsArmedVersion`'s two flag reads); and the flags are **SET** nowhere else: exactly ONE `: true` each and **ZERO** `.dsOwnRun =` / `.dsHatsOff =` assignments in the module. The env/bundle prohibitions (`EDS_BUNDLE_ARMED`, `process.env`) are UNTOUCHED |
| 11 | `dsOwnRun.test.ts` | DORMANCY: "no world 1–15 carries either flag" | "no world 1–15 carries either flag; **WORLD 16 carries both**" — the same universal over 1–15, plus its positive counterpart at 16 (flags AND a constructed match) |
| 12 | `entriesW10W11.test.ts` | the armed-match guard literal | widened by `\|\| isDsWorld(this.a4World)` |
| 13 | `entriesW10W11.test.ts` | the pc-stack predicate | widened by `\|\| isDsWorld(version)` |
| 14 | `entriesW10W11.test.ts` | the badge table holds **15** distinct names | it holds **16** |
| 15 | `entriesW10W11.test.ts` | the EMPTY dose table holds **8** (worlds 8/9/10/11/12/13/14/15) | it holds **9** (…/16) |
| 16 | `entriesW10W11.test.ts` | `?a4world=16` → null | `?a4world=16` → **16**; the bound moves to **17** |
| 17 | `gkPlaytestEntry.test.ts` | `?a4world=16` → null (its URL pin and its M3 mutant analogue) | `?a4world=16` → **16**; the bound moves to **17**. `?a4world=15` → **15** is UNCHANGED, which is what that pin has always been about |
| 18 | `l3PlaytestEntry.test.ts` | `?a4world=16` → null | `?a4world=16` → **16**; the bound moves to **17** |
| 19 | `l3PlaytestEntry.test.ts` | the badge table holds **15** distinct names | it holds **16** |
| 20 | `l3PlaytestEntry.test.ts` | the armed-match guard literal | widened by `\|\| isDsWorld(this.a4World)` |
| 21 | `lnPlaytestEntry.test.ts` | `?a4world=16` → null | `?a4world=16` → **16**; the bound moves to **17** |
| 22 | `mtPlaytestEntry.test.ts` | the badge table holds **15** distinct names | it holds **16** |
| 23 | `pcPlaytestEntry.test.ts` | `?a4world=16` → null | `?a4world=16` → **16**; the bound moves to **17** |
| 24 | `pcPlaytestEntry.test.ts` | the badge table holds **15** distinct names | it holds **16** |
| 25 | `pcPlaytestEntry.test.ts` | the armed-match guard literal | widened by `\|\| isDsWorld(this.a4World)` |
| 26 | `raPlaytestEntry.test.ts` | `?a4world=16` → null | `?a4world=16` → **16**; the bound moves to **17** |

⭐ **NO PROHIBITION WAS WIDENED BEYOND THE ENTRY LAYER.** `dsOwnRun.test.ts`'s src-file map gains
exactly one member — `src/game/a4World.ts` — and its two counts are enumerated. The badge's and
the settings screen's new comments deliberately name **no flag identifier in prose** (LN-ENTRY
§DEVIATIONS 2 / GK-ENTRY §DEVIATIONS 4's precedent), which is why the map did not have to grow to
seven files.

### ⚠⚠ THE FROZEN INSTRUMENT NOW READS RED, DECLARED AND NOT EDITED

`scripts/probes/ds-t1c-own-run-exam.ts` is **FROZEN** (FREEZE `64e8ec7`; #411 item 1 banks it
byte-identical) and carries **two ZERO-COUNT ANCHORS** over `src/game/a4World.ts`:

```
anchor('⭐⭐ ⛔ NEITHER FLAG APPEARS IN `a4World.ts` … (the count is ZERO, and that is the anchor)',
  A4_PATH, 'dsOwnRun', 0);
anchor('⭐⭐ ⛔ …nor `dsHatsOff` (the count is ZERO)', A4_PATH, 'dsHatsOff', 0);
```

plus the derived fact `readForks.a4WorldIsCLEAN` (`A4_CLEAN_OF_FLAGS`) and its `CODE_FACTS_OK`
conjunct. **From this commit those four read RED** — `a4World.ts` names each flag twice, in world
16's own bundle. ⛔ **The instrument was NOT edited** (this rung touches no file under `scripts/`).
The commander writes DS-T1c's errata line at **#412** (#411 item 4(iv)); DS-T1c's banked results
are unaffected — the anchor was a statement about the entry layer at the exam's head, and the
entry layer is what this ruling changed.

## §THE PIN SUITE

[`tests/dsPlaytestEntry.test.ts`](../../tests/dsPlaytestEntry.test.ts), green from birth. The pin
COUNT derives from the suite itself (`npx vitest run tests/dsPlaytestEntry.test.ts` prints it); it
is not typed here as a second copy (canon: *"a gate's NOTE derives from the same pinned values the
gate checks; a count typed beside its pin is a second copy"* — home
PT-C0-PLAYTEST-FORENSIC-CENSUS.md §COMMANDER CORRECTIONS item 1). What it pins: FIDELITY key for
key, with the ADDED key set exactly `['dsHatsOff', 'dsOwnRun']` · ⛔ the six doors AND the OBM gene
that do NOT ride along, absent from world 16 and from every world below · the composition CALLED
and the arming CALLED with **NOTHING added** (the source is read: no gene setter, no weight
constant) · world 14's ONE inherited pin on `baseGenome` AND `effGenome` of both sides at
construction AND at full time, with `info.genome` carrying no such key (canon dose placement) ·
⭐⭐⭐ THE DOOR-SET IDENTITY in both halves — DS-T1c's STORED `OWN-E13-ABSENT` signatures reproduced
on twelve of its own battery seeds by the exam's own recipe, and the spread-vs-composer equality
on six scratch seeds · containment (16 names itself 16, 15 stays 15, 14 stays 14, 13 stays 13, 12
stays 12, and the SOURCE ORDER 16 → 15 → 14 → 13 → 12) · ⭐ ONE DOOR IS NOT ENOUGH (either flag
alone reads 0 and falls back to 15) · the URL parse and the bound · the badge in both dose forms
and the chip mount · the honest brief's field values as 6-dp strings in the surface that claims
each, with the E13-vs-D13 ATTRIBUTION pinned per feed line, the cost said BEFORE the win in both
dose forms, the cost block's ARM FRAME present, and the league-worker caveat + the eyes' block on
BOTH dose lines · the entry doc and its rulings · dormancy 1–15 and world 16 positively · a plain
League match · the worker's shipped world (both flag names absent from the serialized league) ·
the default landing world still `0` · THE MUTANT WALK (four mutants, at runtime) · ⭐⭐ LIVENESS in
the #402 item 2(iii) form · the five IDENTITY digests and the non-vacuity · the fingerprint literal.

⭐⭐ **THE LIVENESS PIN CARRIES ITS EXEMPTION IN THE TEST'S OWN COMMENT** (ruling #402 item
2(iii), the G-BITE FORM RULE): world 16 ≠ world 15 whole-match signature on **at least ONE** of
twelve scratch seeds — **never "every seed"**, because a population of full matches contains DEAD
TIME in which a flag has nothing to bite. DS-T1c's own frozen `gBite` fired exactly that exemption
(§HONEST LIMITS 14: on one `HATSOWN-E13-KITCHENSINK` seed the armed arm recorded ZERO own-run
decisions, so `dsOwnRun` had no candidate to push), and its seat-bite limb read 996/999 rather
than 999/999 (§HONEST LIMITS 13). Both mechanisms are written into the suite's comment beside the
pin.

## §HONEST LIMITS

*(canon: this list is the ONE home; the artifact stores none of it and DS-T1c's own list stays in
its own doc — this list is about the WORLD, not about the exam.)*

* ⚠⚠ **THE OWN RUN IS FEWER THAN THE HATS — 0.431309 OF THE RATE.** `r1.runsPerInPossessionTick`
  0.588555 → 0.253849, and the exam's stored ratio is **0.431309** [0.423933, 0.439099]. The band
  holds anyway, which is the point of the DF path (#411 item 3(i)): a licence retires **by
  measurement**, not by matching the coach's volume. But the world you are watching puts **fewer
  bodies in behind** than world 15 does, and H-DS-5's second half — "R1 within tolerance of HATS"
  — is **NOT supported** (#411 item 3(ii)).
* ⚠⚠ **THE YIELD PER EPISODE IS LOWER.** `own.shotsPerEpisode` **0.047234** against the runner
  hat's **0.132072**; goals **0.014692** against **0.054235** (all on the arm of record). There
  are far more episodes (**63.429429** vs **12.384384** a match), and the exam prints the pair
  with **no verdict word** — so neither does this rung. What a player's eye is being asked is
  whether many cheap runs look more like football than few expensive ones.
* ⚠⚠ **THE IN-FLIGHT LEAK ROSE: 0.119467.** `state.runShare.own.ballInFlight` — up from DS-T1b's
  stored 0.100272. M-DS.7 reads the **PERCEIVED** ball's owner; the state classifier reads the
  engine's **TRUTH**, so stale eyes let about a tenth of the own runs through the guard
  (DS-T1c §HONEST LIMITS 2). ⛔ **The honest run onto a ball in flight is NOT BUILT** — it is the
  named next slice, and the leak is not it.
* ⚠⚠ **THE CUTBACK ARRIVER HAT IS OFF IN OPEN PLAY TOO** (#411 item 3(v)): the open-play arriver
  pick sits inside `dsHatsOff`'s second gate, so `coupling.arriverSetsPerMatch`
  16.577578 → 1.558559 and `coupling.cutbackTakenPerMatch` 5.030030 → 0.979980. The 倒三角 you are
  used to seeing in open play largely goes with the runner hat. Corners and crosses keep theirs.
* ⚠ **THE STEP FORM IS THE COACH'S OWN `slice`.** `restraint = clamp01(count − rankAbove)` is a
  STEP because `scored.slice(0, count)` is a step: `restraint` is EXACTLY 0 on **0.547520** and
  EXACTLY 1 on **0.449381** of visible own-run candidates, and only the first and last of ten
  frozen cells carry anything. A body just outside the cut goes at **zero**, not at a discount —
  football's more likely answer is a continuous weight, and it is HELD (contract §4).
* ⚠ **THE CONVENTION'S NUMBERS ARE HAND-WRITTEN — MOVED, NOT GROWN** (#411 item 3, VISION §1).
  `RUN_ROLE_W`, the `/ 45` and `runnerCount`'s thresholds are the coach's own literals relocated
  into a shared convention. No new constant, and no evolution: nothing here claims selection would
  choose these numbers.
* ⚠ **THE EYES ARE ABSENT IN THIS WORLD.** The OBM seat is not armed (`obmMovement` absent, no OBM
  gene), which is the arm of record's own state. H-DS-6 was POSITIVE on the clean RUN-CAUTION arm
  (the eyes move R1 further down INSIDE the band) and the KITCHEN-SINK ceiling drained it — the
  seat's price is a **HELD POSITIVE**, and the dose space belongs to selection (OBM-T2, #411 item
  3(iii)). ⛔ So this world is not "the own run with eyes"; it is the own run with the seat shut.
* ⚠ **ONE WORLD, ONE COMPOSITION.** World 16 has never been played against anything but world 15,
  and the exam's E-arms were EMPTY-BOOK on a WORLD-13 substrate. The door set is proven identical;
  the substrate below the doors is world 15's, which the exam never walked.
* ⚠ **THE D13 ARM WAS DOSED BY THE SHIPPED LOADERS AT THE EXAM'S HEAD**, not from the user's own
  league books: DS-T1c's D13 arms called `loadL3Dose()` / `loadPcDose()` over the pinned dose files
  at the exam commit. The mature numbers are a MEASUREMENT of that composition, and the feed line
  says so in words.
* ⚠ **THE DEFAULT WORLD IS UNCHANGED** and every world below 16 is byte-identical; the fingerprint
  is unchanged; **the league's background fixtures play the SHIPPED world** (canon *worker
  fixtures*) — a league table generated behind this world is not a league table of this world.

## §CHECKS

| check | result |
| --- | --- |
| `npm run typecheck` (`tsc --noEmit`) | **CLEAN** |
| `npx vitest run tests/dsPlaytestEntry.test.ts` | **GREEN** (27 tests, 35.88 s — the count derived from the suite's own run) |
| the FULL suite (`npm test`, at this tree) | **2,297 passed / 1 failed / 2,298 total, 170 files, 321.79 s** — the ONE failure is the standing load-dependent flake below |
| the load-dependent test, RE-RUN ALONE | `tests/formationEvolution.test.ts` — **3 passed / 0 failed, 141.96 s** (the ten-season test itself 141.42 s against a 180 s budget: the standing fragility named at ruling #397 §COMMANDER CORRECTIONS item 7, and it timed out at 180 s inside the full run while 169 other files competed for the machine). Both runs reported as they stand |
| `npm run fingerprint` | **`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`** — UNCHANGED, character for character |
| IDENTITY digests (bare · 12 · 13 · 14 · 15) | **RUN in the suite against the `0eefb9a` literals — all five IDENTICAL**; world 16 ≠ world 15 (non-vacuous) |
| the door-set identity with DS-T1c | **(a) 12 of 12 stored `OWN-E13-ABSENT` signatures reproduced** on seeds 12,556,000–011; **(b) IDENTICAL whole-match signatures on 6 scratch seeds** at construction and at full time |
| `npm run build` × 2, clean trees at named commits | **precache 19 → 19**, opt-in entries **0 → 0**; bundle delta at §THE COST FACE, in BYTES |
| `git diff --stat 0eefb9a HEAD -- src/sim src/ai src/evolution scripts` | **EMPTY** — the engine and every probe are byte-untouched |
| `git status --porcelain` at the commit | **EMPTY** |

⚠ **A DECLARED PROCESS NOTE ON THE COST FACE.** The entry-side build of record ran on a CLEAN tree
in a throwaway worktree at the pre-amend commit (`git status --short` EMPTY, `dist/` ignored). This
doc's §THE COST FACE and §NO NEW CHUNK tables were then filled in with the measured figures and the
commit AMENDED (ONE commit, as dispatched), so the final commit's hash differs from the build
commit while its `src/` and `tests/` are byte-identical to it — the delta between the two is this
docs file alone. ⚠ The bundle DOES depend on the commit (#397 item 2): `vite.config.ts` bakes
`git describe --tags --always --dirty` into `__APP_VERSION__`, so every commit changes the bundle's
content hash and therefore its FILENAME; the byte SIZE is invariant across equal-length shas. That
is why the cost face above is stated in BYTES and quotes **no filename at all**. ⚠ The pre-amend
commit is reflog-only and decays with the reflog, as GK-ENTRY's `10c3b89` and LN-ENTRY's `5b6628a`
did (GK-ENTRY §COMMANDER CORRECTIONS 7 — precedent, not a defect).

## §THE MUTANT WALK — four mutants, all killed

The suite carries runtime analogues of all four as PERMANENT pins. Beside them, each mutation was
ALSO applied to `src/game/a4World.ts` on an UNCOMMITTED tree and restored from a `/tmp` byte copy
(`cmp`-verified, never `git checkout`); the run was `npx vitest run tests/dsPlaytestEntry.test.ts`
(27 tests):

| # | the mutation | killed by (source-mutant run) |
| --- | --- | --- |
| M1 | ONE door dropped — `DS_WORLD_DOORS = { dsOwnRun: true }` | **8 red of 27** — FIDELITY (the key set and the added-key set), the composition/arming pin, full time, the door-set identity half (b), CONTAINMENT, DORMANCY's positive half, M1's and M4's own analogues |
| M2 | the composer calls `a4MatchFlags(14)` instead of `(15)` | **7 red of 27** — FIDELITY (the key set), the composition pin, full time, identity half (b), CONTAINMENT (16 requires 15), M2's and M4's analogues |
| M3 | the URL bound NOT moved — `?a4world=16` no longer parses | **2 red of 27** — the URL pin and M3's own runtime analogue |
| M4 | `a4ArmedVersion` reads 15 BEFORE 16 | **3 red of 27** — full time (`a4ArmedVersion` must read 16), CONTAINMENT (a world-16 match would name itself 15) and the SOURCE-ORDER pin |

⭐ **M4 IS THE INTERESTING ONE**: it is the BU-T1 §DOUBTS 7 mislabel class, and it dies twice —
once on the behaviour (`a4ArmedVersion(worldMatch(16))` must be 16, never 15) and once on the
source order, because the behavioural pin alone would survive a re-ordering that happened to keep
the answer right on the seeds walked.

⭐ **M1 IS RUN IN BOTH HALVES**: the runtime analogue drops `dsHatsOff` and then `dsOwnRun`, and
either one alone makes `dsArmedVersion` read 0 and `a4ArmedVersion` fall back to 15. The source
mutant dropped `dsHatsOff`.

## §DEVIATIONS (declared by the executor; the commander disposes)

1. ⚠⚠ **THE DOOR-SET IDENTITY IS PINNED IN TWO HALVES, AND THE FIRST HALF REPRODUCES THE EXAM'S
   STORED SIGNATURES RATHER THAN PINNING "THE DOOR SET INSTEAD".** #411 item 4(iv) allowed the
   weaker form ("if the recipe cannot be reproduced without the probe's helpers, pin the door SET
   instead and say so"). It CAN be reproduced: the exam's `signatureOf` and its unobserved walk
   (`while (!m.finished) m.step(DT)`) need no probe helper, only the exam's own `teamInfo` builder
   and construction, both copied character for character. All **twelve** signatures on seeds
   12,556,000–011 reproduce exactly (≥ 2 was asked). ⚠ The recipe DIFFERS from this family's
   `signature()` by one field (`action.type`), so BOTH recipes live in the suite, each labelled
   with what it is for.
2. ⚠ **THE PIN SUITE READS THE 63 MB DS-T1c ARTIFACT** to get those stored signatures, rather than
   pasting them as literals. That is the canon-preferred direction (no second copy of a stored
   value), and it costs ~0.5 s of parse in one test.
3. ⚠ **THE BLURBS ARE PLAIN CHINESE WITHOUT INLINE FIELD NAMES** (GK-ENTRY §DEVIATIONS 2's
   precedent, ratified at #403 §CORR 10). Ruling #411 item 4(ii) prints the blurb text with
   backticked field names inside it; the executor brief asks for "plain Chinese, no jargon,
   numbers at 6 dp beside what they mean". The blurbs therefore carry the numbers and their
   meaning in words; the FIELD NAMES live in the adjacent source comments and in §2's tables.
4. ⚠ **THE MATURE FEED LINE QUOTES D13's OWN ARRIVER, CUTBACK, YIELD, BOARD, IN-FLIGHT AND
   CROWDING FIELDS**, not only its R1 and through-ball pair: `coupling.arriverSetsPerMatch`
   16.508509 → 1.630631 · `coupling.cutbackTakenPerMatch` 5.575576 → 1.103103 ·
   `own.shotsPerEpisode` 0.043998 vs `ep.shotsPerEpisode.runner` 0.141444 ·
   `own.episodesPerMatch` 77.058058 vs `ep.setsPerMatch.runner` 10.622623 · `runCount.mean`
   1.515195 → 0.159770 · `state.runShare.own.ballInFlight` 0.157355 · `crowd.crashShare`
   0.477069 → 0.465658. The dispatch listed only the D13 R1 and through-ball pair, but "each
   quoting the fields of ITS OWN arm" FORBIDS printing E13's cost under the mature heading (the
   #387 item 1 class, and GK-ENTRY §DEVIATIONS 3's ratified precedent). Every one is a stored
   field of the same artifact, traced in §2(e)/(f), and each is pinned present on the mature line
   and ABSENT from the empty-book line.
5. ⚠ **THE MATURE LINE'S GUARD SENTENCE CARRIES NO NUMBER.** It says 「护栏这一档也没破(这一臂的读数
   和空账本那一臂一样)」, which quotes `reads.selectors['OWN-D13'].holdsBand` **true** with an empty
   breach set and `reads.d13Agrees` **true** — STORED booleans and a STORED word. Printing E13's
   guard levels there would have been the #387 item 1 class; printing D13's own nine guard rows
   would have added nine more numbers the ruling did not ask for. The booleans are the honest
   minimum.
6. ⚠ **「五倍」 IS THE COMMANDER'S OWN WORD, AND ITS ARITHMETIC IS WRITTEN OUT.** #411 item 2's
   text says "63.429429 own-run episodes a match vs 12.384384 hat episodes" and item 4(ii) prints
   「但前插的段数是五倍」. The two FIELDS are what the surfaces print; the ratio word is the
   commander's, and §2(b) shows 63.429429 ÷ 12.384384 = 5.12 so no reader has to take it on trust.
   On the mature line no ratio word is used at all (「段数多得多」), because 77.058058 ÷ 10.622623
   is not five.
7. ⚠⚠ **DS-T1c's FROZEN INSTRUMENT NOW READS RED, AND WAS NOT EDITED.** Its two zero-count anchors
   over `a4World.ts`, `readForks.a4WorldIsCLEAN` and the `CODE_FACTS_OK` conjunct all go FALSE from
   this commit. Declared at §THE NARROWED PINS; the errata line is the commander's at #412
   (#411 item 4(iv)). ⛔ Zero files under `scripts/` are in this commit.
8. ⚠ **THE FULL SUITE'S ONE FAILURE IS THE STANDING FLAKE, AND IT IS REPORTED AS IT STANDS.**
   `tests/formationEvolution.test.ts`'s ten-season test timed out at the 180 s budget inside the
   full run and passed ALONE in 141.42 s. That is the fragility ruling #397 §COMMANDER CORRECTIONS
   item 7 named; nothing in this commit touches `src/evolution`. Both runs are in §CHECKS.
9. ⚠ **THE THROWAWAY BASELINE WORKTREE SHARED THIS REPO'S `node_modules` BY SYMLINK** rather than
   a fresh `npm ci` (GK-ENTRY §DEVIATIONS 7's ratified precedent). Same machine, same lockfile,
   same package versions; the two builds therefore differ only in the tree's own source, which is
   what the cost face is measuring.
10. ⚠ **THE ARMED-MATCH GUARD LITERAL NOW SPANS ONE MORE LINE**, so the five suites that pin it as
    a text literal gained a continuation line rather than a lengthened one. The claim — ONE guard,
    naming every world of the stack — is unchanged.
11. ⚠ **THE `own` / `hats` COUNTS IN `dsOwnRun.test.ts`'s SEAM MAP ARE COMMENT-STRIPPED COUNTS**
    (its own `codeLines` helper drops `//`, `*` and `/*` lines). The new comments in `a4World.ts`,
    `A4WorldBadge.ts` and `SettingsScreen.ts` therefore name **no flag identifier in prose**
    anywhere — deliberately, so the map stays at five files with the entry layer as its only new
    member (LN-ENTRY §DEVIATIONS 2 / GK-ENTRY §DEVIATIONS 4's precedent).

## §ROAD B — nothing ships

The default landing world is **0** before and after; every world below 16 is byte-identical; the
production fingerprint is unchanged; `src/sim`, `src/ai`, `src/evolution` and `scripts/` are
byte-untouched; the league serializes nothing new, so the worker's background fixtures play the
SHIPPED world. The two flags are reached ONLY via `?a4world=16` or the Experimental checkbox — they
are never set outside `a4MatchFlags(16)`, and the pin suite reads the source to prove no assignment
exists. **ZERO frontier consumption** — scratch seeds 900,007,200–299 only, plus DS-T1c's own
already-consumed battery seeds 12,556,000–011 for the door-set identity pin (#411 item 4(iv)).

## §NEXT — THE DS PLAY-TEST (USER GATE)

The world-15 gate is still open and a world-16 gate opens beside it. The verdict format is §4's:

```
自己的前插 (v16) — keep | change | revert — <一句人话>
```

Behind the gate: **DS-T2** (套边 · 二过一 — the overlap and the wall pass, whose hats are still on)
or **the in-flight slice** (the honest run onto a ball in flight, the named next slice whose leak
this world measures at 0.119467), then **⑤** — the queue of ruling #411 item 7.

## §COMMANDER CORRECTIONS (ruling #412 — the entry BANKED; verifier PASS, zero HIGH; one MEDIUM and four LOW disposed; ONE user-facing string corrected in place by the commander; the bundle's BYTES unchanged in kind — no flag, no world, no sim byte moved)

The independent verifier rebuilt both heads in clean worktrees on its own band and found zero byte
differences below world 16 (bare, 12, 13, 14, 15) and world 16 non-vacuous; confirmed the door-set fidelity
(the exam's construction on world 13 reproducing all twelve stored signatures; the spread-vs-composer
identity on 16); pulled all 43 surface numbers out of the artifact by field and arm; reproduced the raw
byte cost; ran all four mutants at source with the executor's counts; ran the full suite serially with the
one standing timeout re-run green. Verdict **PASS**.

1. **MEDIUM — THE SETTINGS BLURB'S DISCLOSURE BLOCK CARRIED THREE E13 NUMBERS AFTER THE D13 HEADING WITH
   NO ADJACENT LABEL** (0.119467 · 0.439480 → 0.449494 — correct fields, correct arm in the doc; the #387
   item 1 class in its weaker form). One clause added in place: 「(以下三条仍是 E13 空账本臂的数)」; the two
   DS suites green after (the pins cover the frame and the two 成熟账本 labels, not this block — a pin gap,
   noted). The summary sentence in §2 corrected.
2. **LOW — the report miscounted §HONEST LIMITS** (ten bullets; the doc is complete).
3. **LOW — one hunk under `tests/` missing from §THE NARROWED PINS** (the `Arm` type widened to 16 — it
   relaxes nothing). Listed now.
4. **LOW — the report mis-described the flag-count pin as comment-stripped**; it reads the raw source, so it
   is STRONGER (either identifier in a comment reddens it) — which makes §DEVIATIONS 11 load-bearing.
5. **LOW — §CHECKS pins wall-clock seconds** that drift run to run; the counts reproduce. Read the seconds
   as a record of one run.
6. **RATIFIED**: §DEVIATIONS 1–11 — esp. 1 (the STRONGER door-set form: all twelve stored OWN-E13-ABSENT
   signatures reproduced on world 13 from the artifact, not pasted), 4–6 (the mature line quotes D13's own
   arriver / cutback / yield / board / in-flight / crowding fields; no ratio word where the ratio is not
   five), 7 (⚠⚠ DS-T1c's FROZEN instrument reads RED from this commit — its two `a4World.ts` zero-count
   anchors, `readForks.a4WorldIsCLEAN` and its `CODE_FACTS_OK` conjunct — NOT edited; the errata written
   into DS-T1c's §COMMANDER CORRECTIONS at #412), and the ruling's transcription 「越位旗降了 2.478478 →
   −0.167167」 correctly typed on the surfaces as a level and a delta (the commander's slip).
