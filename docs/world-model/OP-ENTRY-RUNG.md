# OP-ENTRY-RUNG — `?a4world=19` 身前贴着的人要算进去 (both steps of a pass — whether to pass, and to whom — count the opponent standing in front of the ball)

> Authorized by **COMMANDER RULING #437 item 4** (the dispatch), on **#437 items 1–2** (OP-T1b banked, verifier
> PASS, zero HIGH, 24 / 24 gates, `allGreen` a STORED `true`; THE READ OF RECORD = **read 1**, and the smallest
> read 1 the programme has banked — the commander's reading beside it: the win is real and small, the mechanism's
> own face did not move, neither door resolves alone, the biggest resolved movement is a COST face).
> The law is the OP contract ([`OP-FRONT-MAN-CONTRACT.md`](OP-FRONT-MAN-CONTRACT.md) §2 M-OP.1–3 and M-OP.5,
> §4 NON-CLAIMS); the seams are **OP-T0** ([`OP-T0-FRONT-MAN-SEAM.md`](OP-T0-FRONT-MAN-SEAM.md), the licence's
> lane) and **OP-T0b** ([`OP-T0B-FRONT-CHOOSER-SEAM.md`](OP-T0B-FRONT-CHOOSER-SEAM.md), the target chooser's
> price); the exam of record is **OP-T1b** ([`OP-T1B-FRONT-CHOOSER-EXAM.md`](OP-T1B-FRONT-CHOOSER-EXAM.md),
> artifact [`data/op-t1b-front-chooser-exam.json`](data/op-t1b-front-chooser-exam.json) — its CANONICAL path;
> `allGreen` is a stored `true`, so there is no red-routing here. ⛔ The artifact is never moved, renamed or
> copied).
> **LINEAGE**: OP-C0 → OP-C1 → OP-C2 → 甲 (the user's 「甲吧」, #432) → OP-T0 → OP-T1 → OP-C3 (MISREAD) → OP-T0b →
> OP-T1b (read 1) → **this rung**.
> The NINETEENTH entry of the play-test family, in the IF-ENTRY form (#424 item 5 / #425, copied).
> Pin suite: [`tests/opPlaytestEntry.test.ts`](../../tests/opPlaytestEntry.test.ts).
> ⛔ **Nothing ships to the default world**; the production fingerprint is unchanged; **the play-test verdict is
> the USER GATE** (watchability has no instrument — the standing law).
> ⭐ **World 18's gate is still OPEN and a world-19 gate opens beside it** — `?a4world=18` still plays world 18
> byte for byte, so 18 can be compared against 19 on the same device.

## §1 THE BUNDLE (TWO DOORS, NO GENE, NO CONSTANT, NO DOSE)

`a4MatchFlags(19) = { ...a4MatchFlags(18), ...OP_WORLD_DOORS }` with
`OP_WORLD_DOORS = { opFrontMan: true, opFrontChooser: true }` — world 18 (the flight-run world) plus **exactly
TWO doors** and **NO pin at all**: one sentence, two seats, the door set OP-T1b's arm of record `W18-D+OP+OC`
carried on top of `a4MatchFlags(18)`:

| # | limb | value | source |
| --- | --- | --- | --- |
| 1 | the whole world-18 substrate | `a4MatchFlags(18)` — **CALLED, not copied** (which calls `(17)` → `(16)` → … → `(3)`) | the #424 entry's own composition line |
| 2 | ⭐ the licence's lane door | `opFrontMan` = true | OP-T0 (M-OP.1–3): the ONE `laneOpenness` call inside `groundCandidate` reads `laneOpennessFront` — a man strictly AHEAD of the kicker within 1.5 m is read with `CONTROL_RADIUS`; OP-T1b's `buildMatch` on the `+OP` arms |
| 3 | ⭐ the target chooser's door | `opFrontChooser` = true | OP-T0b (M-OP.5): `pricePassOption`'s READ branch prices an option with front contact in the calibration's LAST band; OP-T1b's `buildMatch` on the `+OC` arms |
| 4 | ⛔ the pin | **NONE — no gene, no constant, no dose** | both seams reuse shipped numbers only (1.5, `CONTROL_RADIUS`, 4). `armOpWorld` is `armIfWorld` CALLED and nothing more |
| 5 | world 14's own gene | `lnOwnLaneWeight` = 0.25 on `baseGenome` AND `effGenome` of BOTH sides — **arrives by the CALL** | world 14, unchanged |
| 6 | the L3 dose · the PC dose | world 8's, inherited whole (`?pcdose=0` unchanged) | world 18, unchanged |
| 7 | the eye · evolution opt-ins | **null** · **OFF** | world 6 / #165.2.ii, unchanged |

⭐⭐ **THE CONTAINMENT CALL IS THE WHOLE DESIGN.** `armOpWorld(match, l3Dose, pcDose)` is
`armIfWorld(match, l3Dose, pcDose)` CALLED, full stop — both doors are CONSTRUCTION flags and arrive with
`a4MatchFlags(19)`. `opArmedVersion` reads the world below by **CALLING `ifArmedVersion`**, never by re-reading
`ifFlightRun` or any flag beneath it, and returns 19 only when **BOTH** doors are true:

```ts
export function opArmedVersion(match: Match): 0 | OpWorldVersion {
  if (ifArmedVersion(match) !== IF_WORLD_VERSION) return 0;
  return match.opFrontMan === true && match.opFrontChooser === true ? OP_WORLD_VERSION : 0;
}
```

So `tests/ifFlightRun.test.ts`'s `a4World.ts` count of `ifFlightRun` (**2**) and the DS seam counts stay true and
this rung changes none of them. ⭐ **ONE DOOR ALONE IS NOT WORLD 19** — a world-18 match carrying either flag alone
reads 18 (OP-T1b measured neither door alone moving the win face; world 19 is the pair or nothing).

⛔ **WHAT IS NOT IN WORLD 19**: `obmMovement`, `ctbSupportPlane`, `rcAnticipate` / `rcReady`, `bfFacingCost`,
`edsTouchCost`, and no OBM gene — pinned absent from world 19 and from every world below. TWO doors and nothing
else, because **the user's 18-vs-19 comparison must be clean.** ⛔ The default landing world 0 is untouched.

⚠ **WORKER-SIMMED fixtures play the SHIPPED world** (canon #283.2(iv)) ⇒ a watched world-19 match is the armed
world; the league's background fixtures are not. Test-pinned.

## §2 THE DOOR SET IS THE EXAM'S, PROVEN IN TWO HALVES

OP-T1b built its both-door arms as `new Match({ …, ...a4MatchFlags(18), opFrontMan: true, opFrontChooser: true })`
then `armA4World(m, null, 18, L3, PC)` (D) or `armA4World(m, null, 18)` (E)
(`scripts/probes/op-t1b-front-chooser-exam.ts`, `buildMatch`). World 19 is composed by the CALL, so:

* **(a) the exam's own construction, re-run here**, reproduces OP-T1b's **STORED** per-seed whole-match
  signatures `perSeedCells[]['W18-D+OP+OC'].signature` AND `perSeedCells[]['W18-E+OP+OC'].signature` on **all
  twelve** of the first battery seeds **12,566,000–12,566,011** — **24 / 24 exact** (same host: the artifact's
  `stage.arch` is `x64`, asserted). Those seeds are CONSUMED; re-walking a consumed seed is **not a consumption**.
  The recipe is the exam's own `signatureOf` (ONE extra field, `action.type`) and its unobserved walk (the exam's
  `gLockstep` proves observed ≡ unobserved per arm). Each reproduced match also reads `opArmedVersion` = 19 — the
  exam's arm IS world 19's door set.
* **(b) `a4MatchFlags(18)` + the two flags ≡ `a4MatchFlags(19)`** in whole-match signatures (rng state included)
  at construction AND at full time on **six** scratch seeds `900,010,820–825`; the flag set itself deep-equals
  and the added key set is exactly `['opFrontChooser', 'opFrontMan']`.

## §IDENTITY — the shipped world, and every world below 19, byte-identical (ARCH-KEYED)

**Definition, one source**: each walk builds a league at the ENGINE DEFAULT clock (`new League({ seed })`), takes
its first fixture, constructs with `a4MatchFlags(v)`, arms with `armA4World(match, null, v, L3, PC)` — the SHIPPED
composer — calls `runToCompletion()`, and hashes the `signature()` of
[`../../tests/opPlaytestEntry.test.ts`](../../tests/opPlaytestEntry.test.ts) (field for field `ifPlaytestEntry`'s).
A world digest is `sha256` of its **twelve** per-seed signatures joined by `|`, seeds **900,007,200 – 900,007,211**
— the family's IDENTITY band, **re-used deliberately**.

* **x64** — **RECORDED BY THIS EXECUTOR** at the dispatch HEAD `4cf854f`, **IN PROCESS on the clean tree**
  (`git status --porcelain` 0 bytes; no worktree — the #433 LOW 2 precedent, accepted by #437 item 4(iii)), BEFORE
  a single byte of this rung was written, by a throwaway recorder living outside the repo (the session scratchpad's `rec.mts`, never committed) whose
  `signature` / `pooledDigest` are the suite's, field for field. ⭐ **The recorder FIRST reproduced
  `tests/ifPlaytestEntry.test.ts`'s seven x64 literals** (bare · 12 · 13 · 14 · 15 · 16 · 17, all exact, in the
  same run, node v24.18.0) and only then recorded world 18 (NEW).
* **arm64** — **INHERITED BY IDENTITY** from `tests/ds2PlaytestEntry.test.ts`'s `BASELINE_DIGESTS` for bare ·
  12 · 13 · 14 · 15 · 16 (the route `ifPlaytestEntry` took; the suite asserts each literal is that suite's own).
* **worlds 17 and 18 on arm64 — ABSENT**: no arm64 literal of record with this recipe ⇒ that row **skips on arm64
  and says so in its title**. ⛔ Never a guess.

| digest | **x64** at `4cf854f` (recorded here) | **arm64** (inherited by identity) |
| --- | --- | --- |
| production (no world) | `1d75378f04f649cb04040519128269d65f31cf640b3dbd7414b48d64248ba500` | `062067553ef3ae85f329d3d422b0576e15296471666a0ecb3b6912c40554a8ab` |
| world 12 | `ee39881f2a445fbb0e41b61c4fa85d1e703c24b5ef8f699ae7e0ea96f8e78119` | `34e882b240967047c746203cadcc39311ddee4a9fe595361365b3daa8ffaeae0` |
| world 13 | `7c4f206321dee78cbdce13c9528b6b635d0e1ca1792d5f7afa59cab78e76e953` | `9c9d3117a27192ef31229294ecc050f1e0b5b3a08ca047cc50a8631dc03704e3` |
| world 14 | `49fd74496ed245252a8390af9e3fabd796e308549db638b90bb1ac2c3f7e2957` | `0f3887d491099f4a4a17e220d6a63fae929de1af46b45948ae3cf1069e7821cf` |
| world 15 | `8431aafb0e5606b71804a907d7b092c6d584f4fe108179b4610e6f380154cf9e` | `2016c431bdadf5401d38ddedf82bd0596b4062986b6eea6ee06ccdbf34c3f4be` |
| world 16 | `b57a0d6c6ed69c464ae8a4142b5c4da878031a4f5791b33f3a50039b7b86dd01` | `7090f7e67350e80e63e4413020c22d1c381845c1e84fcd7417840bdde944d8a4` |
| world 17 | `5d60981a3cccb79eeca1eb6d6249d5186d08f1231f6ecdd69eb3f0f739072933` | **ABSENT — skipped by title** |
| world 18 | `70ef00f1133c3495b1d2c92b4c68996e6a96771afa27f23dc289520164ef9f68` (**NEW**) | **ABSENT — skipped by title** |
| world 19 | ≠ world 18's (NEW, non-vacuous) | ≠ world 18's (NEW, non-vacuous) |

* ⭐ **NON-VACUOUS**: world 19's digest DIFFERS from world 18's — the doors bite in the entry's own path.
* ⭐ **THE PRODUCTION FINGERPRINT IS ARCH-KEYED** (#418 item 1): arm64
  `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` (of record; RED on this host by construction,
  #418 class A) · **x64 `59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d`**, re-derived by
  `npm run fingerprint` at this rung and UNCHANGED — **Road B holds.**

## §THE HONEST BRIEF

Canon: *"a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated face"*. Every number on
every surface is an OP-T1b field at 6 dp, read off
[`data/op-t1b-front-chooser-exam.json`](data/op-t1b-front-chooser-exam.json) **by field and by arm** with `node` —
and the pin suite RE-DERIVES every token from the artifact rather than comparing it to a literal typed here.

⚠ **THE MEASURED ARM OF RECORD IS D** — `W18-D+OP+OC` against its control `W18-D` (the MATURE book), which is
exactly what the player reaches by default at `?a4world=19`. It lives on the mature feed line and leads the
settings blurb, under its own heading. **E** — `W18-E+OP+OC` against `W18-E`, the empty book, what
`?a4world=19&pcdose=0` plays — was measured beside it and lives on the empty-book feed line and under its own
heading in the blurb (every E number there behind an adjacent 「(空账本)」 label). ⛔ **ZERO cross-arm numbers**: the
D and E token sets share **no** token at all, so — unlike IF-ENTRY — there is nothing to exempt.

### THE ORDER, ON ALL THREE SURFACES — THE COST BEFORE THE WIN (#437 item 4(vi))

1. **这一步造了什么** — two doors, one sentence: 「传不传」 (the licence's lane no longer clears the man in front)
   and 「传给谁」 (an option with a man in front is priced in the last band); men beside and behind still cleared;
   no constant, no gene, no dose. The chooser seat's own size (repriced 0.214827 / changed 0.040987 on D).
2. **⚠ 代价说在最前面** — goals per match **2.866867 → 2.664665** (resolved, inside the band — and the largest
   |Δ| ÷ tolerance on the pair, 0.255254); shots DOWN; the conversion DOWN; the pressed carrier passes less and
   dribbles more (the mix lines); possessions ending without a pass attempt UP (S3); then every other RESOLVED
   band limb with its interval and its |Δ| ÷ tolerance (G5 interceptions, G7 passes, G8 aim distance); possession
   length; S4 unmoved; ground passes LONGER, not shorter (the named cost did not appear).
3. **⭐ 量到的** — the win: balls whose first body is an opponent **0.313853 → 0.308630**, Δ −0.005223 — about one
   ground pass in 190 (`1 ÷ 0.005223 = 191.46`, the arithmetic printed beside); no band breached.
4. **⚠ 别期待** — the man in front is the first body as often as before (`front.manFirst` unresolved), so do not
   expect to see 「他不再往身前那个人身上传」; neither door alone moved it measurably; on the empty book (E) it moved
   the other way, unresolved; the honesty line.
5. **你的眼睛要判的** — 身前贴着人的时候,他还会不会硬往那人身上传?被逼抢时是不是更多选择带球——带得像样吗?进球是不是少了、
   少得让人难受吗?
6. **对比** — v18, 同一台设备, `?a4world=19` 对 `?a4world=18`; `?a4world=19&pcdose=0` = the empty-book arm (E).
   **⚠ 联赛后台快速模拟跑的是原版世界.**

⭐⭐ **THE HONESTY LINE IS ON EVERY SURFACE** — #437 item 4(vi)'s own words, *the table seeing little ≠ the eye
seeing nothing*, rendered: 「这块表看到的很少,不等于眼睛什么也看不到——这道门就是请你的眼睛来判」. (OP-T1b's artifact
stores no `reads.honestyLine`; §DEVIATIONS 3.)

⭐ **THE ONE DERIVED FIGURE, WITH ITS ARITHMETIC WRITTEN OUT**: 「大约每 190 次地面传球少 1 次」 is the commander's
word at #437 item 1(b); the surfaces print `1 ÷ 0.005223 = 191.46` beside it (the pin re-computes it from the
field). ⛔ **No other derived number and NO hand-written percentage appears on any surface** (#437 item 2(d)'s
"−7 %" is the commander's reading and is NOT printed; the surfaces print the goal levels and Δ instead).

### THE SURFACES' TEXT — ⭐ THE MATURE FEED LINE (D, the arm of record; `src/game/GameApp.ts`)

> 🧪 身前贴着的人要算进去 ON — 这一步造了什么:上面那个世界(v18),再加两扇门,而且只有这两扇,说的是同一句话——球前面 1.5
> 米之内、贴在出球线上的那个对手,要算进去。第一扇在“传不传”这一步:算这条线开不开的时候,不再把身前贴着的人当成“一脚就踢过去
> 了”;第二扇在“传给谁”这一步:挑接球人的时候,线上身前贴着人的那个选项,按最危险的那一档算。站在他旁边或身后的人照旧算踢得过去。
> 没有新常数,没有新基因,没有剂量。⭐ 下面这一组就是你玩的这一档(成熟账本,OP-T1b 的 D 臂,也就是记录在案的那一臂),是量过的,
> 不是推断。挑人那一步确实在动:挑接球人时有 0.214827 的次数至少一个选项被重新定价,0.040987 的次数换了人。⚠ 代价说在最前面:
> 进球少了——每场 2.866867 → 2.664665,差 −0.202202,区间 [−0.338338, −0.066066] 不含零,用掉容差的 0.255254(护栏没破,但这是
> 动得最大的一条);射门少了——每场 11.797798 → 11.517518,差 −0.280280,区间 [−0.514515, −0.039039] 不含零,用掉容差的 0.085978;
> 射门转化(进球 ÷ xG)1.396565 → 1.339157,差 −0.057408,区间 [−0.113485, −0.000939] 不含零,用掉容差的 0.148767;被逼抢的持球人
> 传得少了、带得多了——传球 0.336625 → 0.316305,区间 [−0.026907, −0.013151];带球 0.602143 → 0.624925,区间 [0.014759, 0.030406];
> 一脚没传就结束的球权多了——0.127651 → 0.132216,差 +0.004565,区间 [0.000615, 0.008278] 不含零,用掉容差的 0.129422;传球数每场
> 87.199199 → 85.874875,差 −1.324324,区间 [−1.997998, −0.644645] 不含零,用掉容差的 0.054964;被断每场 28.894895 → 28.295295,
> 差 −0.599600,区间 [−0.989990, −0.222222] 不含零,用掉容差的 0.075099;传球目标的平均距离 14.671194 → 14.734372 米,差 +0.063178,
> 区间 [0.007578, 0.121205] 不含零,用掉容差的 0.015585;每段球权平均长了——312.351300 → 316.236856 tick,区间 [0.822248, 6.973166];
> 往回传的比例没变(0.311601 → 0.312334,区间 [−0.002832, 0.004385] 含零);地面传球没有变短,反而长了 0.064276 米,区间 [0.008124,
> 0.123586]。⭐ 量到的:第一个碰到球的是对手的地面传球 0.313853 → 0.308630,差 −0.005223,区间 [−0.009088, −0.001367]——大约每 190
> 次地面传球少 1 次传到对面身上(1 ÷ 0.005223 = 191.46);十三条护栏一条都没破。⚠ 别期待:身前那个人还是一样常是第一个碰到球的人
> (0.124717 → 0.125362,区间 [−0.004404, 0.005478] 含零)——所以别期待看到“他不再往身前那个人身上传”;两扇门单开都量不出来(只开第一
> 扇:差 −0.003130,区间 [−0.006518, 0.000238];只开第二扇:差 −0.000160,区间 [−0.003720, 0.003428]);空账本那一档(E 臂)反而往另一
> 个方向动了一点,也量不出来;⭐ 这块表看到的很少,不等于眼睛什么也看不到——这道门就是请你的眼睛来判。你的眼睛要判的:身前贴着人的
> 时候,他还会不会硬往那人身上传?被逼抢时是不是更多选择带球——带得像样吗?进球是不是少了、少得让人难受吗?对比对象是 v18,同一台
> 设备,?a4world=19 对 ?a4world=18;?a4world=19&pcdose=0 是空账本那一档(E 臂)。⚠ 注意:你看的是屏幕上这一场;联赛后台快速模拟的比赛
> 跑的是原版世界(联赛存档不带这些开关)。

(The empty-book line and the settings blurb are in `src/game/GameApp.ts` and `src/ui/SettingsScreen.ts`
verbatim; they are not copied here — the source is the one home, and the trace table below says which token sits
on which surface.)

### THE TRACE TABLE — field × arm × token × surface

The three surfaces are the **GameApp feed line in both dose forms** (`src/game/GameApp.ts`), the **settings
blurb** (`src/ui/SettingsScreen.ts`) and the **badge** (`src/ui/A4WorldBadge.ts`). ⭐ The badge carries **ZERO
numerals** (a chip is a few characters on a phone); its docblock names the cost and points at the two surfaces
that print it. Counts, re-measured off the source: **79 numerals (78 distinct) on the mature feed line · 50 (50
distinct) on the empty-book feed line · 103 (102 distinct) in the settings blurb · 0 on the badge**; **zero
untraceable, zero cross-arm**. The table lists every token the pin suite derives (153 rows: D 90 · E 63); a row
marked "trace only" is a field the suite derives for completeness that no surface prints. The signs on the
surfaces (−, +) are the field's own sign; the token is its absolute value at 6 dp.

| arm | field | contrast / arm read under | token | surfaces |
| --- | --- | --- | --- | --- |
| D | `chooserSeat.levels.chooserSeat.repricedShareOfCalls` | W18-D+OP+OC | **0.214827** | mature · blurb |
| D | `chooserSeat.levels.chooserSeat.changedShareOfCalls` | W18-D+OP+OC | **0.040987** | mature · blurb |
| D | `bands.G1 guard.goalsPerMatch controlLevel` | W18-D+OP+OC\|W18-D | **2.866867** | mature · blurb |
| D | `bands.G1 armLevel` | W18-D+OP+OC\|W18-D | **2.664665** | mature · blurb |
| D | `bands.G1 delta` | W18-D+OP+OC\|W18-D | **0.202202** | mature · blurb |
| D | `bands.G1 ci[0]` | W18-D+OP+OC\|W18-D | **0.338338** | mature · blurb |
| D | `bands.G1 ci[1]` | W18-D+OP+OC\|W18-D | **0.066066** | mature · blurb |
| D | `bands.G1 absDeltaOverTolerance` | W18-D+OP+OC\|W18-D | **0.255254** | mature · blurb |
| D | `bands.G2 guard.shotsPerMatch controlLevel` | W18-D+OP+OC\|W18-D | **11.797798** | mature · blurb |
| D | `bands.G2 armLevel` | W18-D+OP+OC\|W18-D | **11.517518** | mature · blurb |
| D | `bands.G2 delta` | W18-D+OP+OC\|W18-D | **0.280280** | mature · blurb |
| D | `bands.G2 ci[0]` | W18-D+OP+OC\|W18-D | **0.514515** | mature · blurb |
| D | `bands.G2 ci[1]` | W18-D+OP+OC\|W18-D | **0.039039** | mature · blurb |
| D | `bands.G2 absDeltaOverTolerance` | W18-D+OP+OC\|W18-D | **0.085978** | mature · blurb |
| D | `bands.G3 guard.xgConversion controlLevel` | W18-D+OP+OC\|W18-D | **1.396565** | mature · blurb |
| D | `bands.G3 armLevel` | W18-D+OP+OC\|W18-D | **1.339157** | mature · blurb |
| D | `bands.G3 delta` | W18-D+OP+OC\|W18-D | **0.057408** | mature · blurb |
| D | `bands.G3 ci[0]` | W18-D+OP+OC\|W18-D | **0.113485** | mature · blurb |
| D | `bands.G3 ci[1]` | W18-D+OP+OC\|W18-D | **0.000939** | mature · blurb |
| D | `bands.G3 absDeltaOverTolerance` | W18-D+OP+OC\|W18-D | **0.148767** | mature · blurb |
| D | `bands.G5 guard.interceptionsPerMatch controlLevel` | W18-D+OP+OC\|W18-D | **28.894895** | mature · blurb |
| D | `bands.G5 armLevel` | W18-D+OP+OC\|W18-D | **28.295295** | mature · blurb |
| D | `bands.G5 delta` | W18-D+OP+OC\|W18-D | **0.599600** | mature · blurb |
| D | `bands.G5 ci[0]` | W18-D+OP+OC\|W18-D | **0.989990** | mature · blurb |
| D | `bands.G5 ci[1]` | W18-D+OP+OC\|W18-D | **0.222222** | mature · blurb |
| D | `bands.G5 absDeltaOverTolerance` | W18-D+OP+OC\|W18-D | **0.075099** | mature · blurb |
| D | `bands.G7 guard.passesPerMatch controlLevel` | W18-D+OP+OC\|W18-D | **87.199199** | mature · blurb |
| D | `bands.G7 armLevel` | W18-D+OP+OC\|W18-D | **85.874875** | mature · blurb |
| D | `bands.G7 delta` | W18-D+OP+OC\|W18-D | **1.324324** | mature · blurb |
| D | `bands.G7 ci[0]` | W18-D+OP+OC\|W18-D | **1.997998** | mature · blurb |
| D | `bands.G7 ci[1]` | W18-D+OP+OC\|W18-D | **0.644645** | mature · blurb |
| D | `bands.G7 absDeltaOverTolerance` | W18-D+OP+OC\|W18-D | **0.054964** | mature · blurb |
| D | `bands.G8 guard.meanAimDistanceMetres controlLevel` | W18-D+OP+OC\|W18-D | **14.671194** | mature · blurb |
| D | `bands.G8 armLevel` | W18-D+OP+OC\|W18-D | **14.734372** | mature · blurb |
| D | `bands.G8 delta` | W18-D+OP+OC\|W18-D | **0.063178** | mature · blurb |
| D | `bands.G8 ci[0]` | W18-D+OP+OC\|W18-D | **0.007578** | mature · blurb |
| D | `bands.G8 ci[1]` | W18-D+OP+OC\|W18-D | **0.121205** | mature · blurb |
| D | `bands.G8 absDeltaOverTolerance` | W18-D+OP+OC\|W18-D | **0.015585** | mature · blurb |
| D | `bands.S3 s3.possessionsEndingWithoutAPassAttempt controlLevel` | W18-D+OP+OC\|W18-D | **0.127651** | mature · blurb |
| D | `bands.S3 armLevel` | W18-D+OP+OC\|W18-D | **0.132216** | mature · blurb |
| D | `bands.S3 delta` | W18-D+OP+OC\|W18-D | **0.004565** | mature · blurb |
| D | `bands.S3 ci[0]` | W18-D+OP+OC\|W18-D | **0.000615** | mature · blurb |
| D | `bands.S3 ci[1]` | W18-D+OP+OC\|W18-D | **0.008278** | mature · blurb |
| D | `bands.S3 absDeltaOverTolerance` | W18-D+OP+OC\|W18-D | **0.129422** | mature · blurb |
| D | `bands.S4 stuck.backwardShareOfGroundReleases controlLevel` | W18-D+OP+OC\|W18-D | **0.311601** | mature · blurb |
| D | `bands.S4 armLevel` | W18-D+OP+OC\|W18-D | **0.312334** | mature · blurb |
| D | `bands.S4 delta` | W18-D+OP+OC\|W18-D | **0.000733** | — (trace only) |
| D | `bands.S4 ci[0]` | W18-D+OP+OC\|W18-D | **0.002832** | mature · blurb |
| D | `bands.S4 ci[1]` | W18-D+OP+OC\|W18-D | **0.004385** | mature · blurb |
| D | `bands.S4 absDeltaOverTolerance` | W18-D+OP+OC\|W18-D | **0.008509** | — (trace only) |
| D | `deltas.stuck.pressedMix.pass controlValue` | W18-D+OP+OC\|W18-D | **0.336625** | mature · blurb |
| D | `deltas.stuck.pressedMix.pass armValue` | W18-D+OP+OC\|W18-D | **0.316305** | mature · blurb |
| D | `deltas.stuck.pressedMix.pass delta` | W18-D+OP+OC\|W18-D | **0.020320** | — (trace only) |
| D | `deltas.stuck.pressedMix.pass lo` | W18-D+OP+OC\|W18-D | **0.026907** | mature · blurb |
| D | `deltas.stuck.pressedMix.pass hi` | W18-D+OP+OC\|W18-D | **0.013151** | mature · blurb |
| D | `deltas.stuck.pressedMix.dribble controlValue` | W18-D+OP+OC\|W18-D | **0.602143** | mature · blurb |
| D | `deltas.stuck.pressedMix.dribble armValue` | W18-D+OP+OC\|W18-D | **0.624925** | mature · blurb |
| D | `deltas.stuck.pressedMix.dribble delta` | W18-D+OP+OC\|W18-D | **0.022783** | — (trace only) |
| D | `deltas.stuck.pressedMix.dribble lo` | W18-D+OP+OC\|W18-D | **0.014759** | mature · blurb |
| D | `deltas.stuck.pressedMix.dribble hi` | W18-D+OP+OC\|W18-D | **0.030406** | mature · blurb |
| D | `deltas.stuck.possessionMeanTicks controlValue` | W18-D+OP+OC\|W18-D | **312.351300** | mature · blurb |
| D | `deltas.stuck.possessionMeanTicks armValue` | W18-D+OP+OC\|W18-D | **316.236856** | mature · blurb |
| D | `deltas.stuck.possessionMeanTicks delta` | W18-D+OP+OC\|W18-D | **3.885556** | — (trace only) |
| D | `deltas.stuck.possessionMeanTicks lo` | W18-D+OP+OC\|W18-D | **0.822248** | mature · blurb |
| D | `deltas.stuck.possessionMeanTicks hi` | W18-D+OP+OC\|W18-D | **6.973166** | mature · blurb |
| D | `deltas.stuck.meanGroundPassLengthMetres controlValue` | W18-D+OP+OC\|W18-D | **13.739893** | — (trace only) |
| D | `deltas.stuck.meanGroundPassLengthMetres armValue` | W18-D+OP+OC\|W18-D | **13.804169** | — (trace only) |
| D | `deltas.stuck.meanGroundPassLengthMetres delta` | W18-D+OP+OC\|W18-D | **0.064276** | mature · blurb |
| D | `deltas.stuck.meanGroundPassLengthMetres lo` | W18-D+OP+OC\|W18-D | **0.008124** | mature · blurb |
| D | `deltas.stuck.meanGroundPassLengthMetres hi` | W18-D+OP+OC\|W18-D | **0.123586** | mature · blurb |
| D | `winTable.fixes fb.ground.opponent controlLevel` | W18-D+OP+OC\|W18-D | **0.313853** | mature · blurb |
| D | `winTable.fixes armLevel` | W18-D+OP+OC\|W18-D | **0.308630** | mature · blurb |
| D | `winTable.fixes delta` | W18-D+OP+OC\|W18-D | **0.005223** | mature · blurb |
| D | `winTable.fixes ci[0]` | W18-D+OP+OC\|W18-D | **0.009088** | mature · blurb |
| D | `winTable.fixes ci[1]` | W18-D+OP+OC\|W18-D | **0.001367** | mature · blurb |
| D | `frontMan.front.manFirst controlValue` | W18-D+OP+OC\|W18-D | **0.124717** | mature · blurb |
| D | `frontMan.front.manFirst armValue` | W18-D+OP+OC\|W18-D | **0.125362** | mature · blurb |
| D | `frontMan.front.manFirst delta` | W18-D+OP+OC\|W18-D | **0.000645** | — (trace only) |
| D | `frontMan.front.manFirst lo` | W18-D+OP+OC\|W18-D | **0.004404** | mature · blurb |
| D | `frontMan.front.manFirst hi` | W18-D+OP+OC\|W18-D | **0.005478** | mature · blurb |
| D | `winTable.fixes fb.ground.opponent controlLevel` | W18-D+OP\|W18-D | **0.313853** | mature · blurb |
| D | `winTable.fixes armLevel` | W18-D+OP\|W18-D | **0.310723** | — (trace only) |
| D | `winTable.fixes delta` | W18-D+OP\|W18-D | **0.003130** | mature · blurb |
| D | `winTable.fixes ci[0]` | W18-D+OP\|W18-D | **0.006518** | mature · blurb |
| D | `winTable.fixes ci[1]` | W18-D+OP\|W18-D | **0.000238** | mature · blurb |
| D | `winTable.fixes fb.ground.opponent controlLevel` | W18-D+OC\|W18-D | **0.313853** | mature · blurb |
| D | `winTable.fixes armLevel` | W18-D+OC\|W18-D | **0.313692** | — (trace only) |
| D | `winTable.fixes delta` | W18-D+OC\|W18-D | **0.000160** | mature · blurb |
| D | `winTable.fixes ci[0]` | W18-D+OC\|W18-D | **0.003720** | mature · blurb |
| D | `winTable.fixes ci[1]` | W18-D+OC\|W18-D | **0.003428** | mature · blurb |
| E | `chooserSeat.levels.chooserSeat.repricedShareOfCalls` | W18-E+OP+OC | **0.171033** | empty · blurb |
| E | `chooserSeat.levels.chooserSeat.changedShareOfCalls` | W18-E+OP+OC | **0.036682** | empty · blurb |
| E | `bands.G1 guard.goalsPerMatch controlLevel` | W18-E+OP+OC\|W18-E | **3.435435** | empty · blurb |
| E | `bands.G1 armLevel` | W18-E+OP+OC\|W18-E | **3.349349** | empty · blurb |
| E | `bands.G1 delta` | W18-E+OP+OC\|W18-E | **0.086086** | empty |
| E | `bands.G1 ci[0]` | W18-E+OP+OC\|W18-E | **0.212212** | empty · blurb |
| E | `bands.G1 ci[1]` | W18-E+OP+OC\|W18-E | **0.044044** | empty · blurb |
| E | `bands.G1 absDeltaOverTolerance` | W18-E+OP+OC\|W18-E | **0.090687** | — (trace only) |
| E | `bands.G2 guard.shotsPerMatch controlLevel` | W18-E+OP+OC\|W18-E | **12.527528** | empty |
| E | `bands.G2 armLevel` | W18-E+OP+OC\|W18-E | **12.489489** | empty |
| E | `bands.G2 delta` | W18-E+OP+OC\|W18-E | **0.038038** | empty |
| E | `bands.G2 ci[0]` | W18-E+OP+OC\|W18-E | **0.261261** | empty |
| E | `bands.G2 ci[1]` | W18-E+OP+OC\|W18-E | **0.185185** | empty |
| E | `bands.G2 absDeltaOverTolerance` | W18-E+OP+OC\|W18-E | **0.010989** | — (trace only) |
| E | `bands.G7 guard.passesPerMatch controlLevel` | W18-E+OP+OC\|W18-E | **76.904905** | empty · blurb |
| E | `bands.G7 armLevel` | W18-E+OP+OC\|W18-E | **76.086086** | empty · blurb |
| E | `bands.G7 delta` | W18-E+OP+OC\|W18-E | **0.818819** | empty |
| E | `bands.G7 ci[0]` | W18-E+OP+OC\|W18-E | **1.409409** | empty · blurb |
| E | `bands.G7 ci[1]` | W18-E+OP+OC\|W18-E | **0.243243** | empty · blurb |
| E | `bands.G7 absDeltaOverTolerance` | W18-E+OP+OC\|W18-E | **0.038533** | empty · blurb |
| E | `bands.G9 guard.throughBallsPerMatch controlLevel` | W18-E+OP+OC\|W18-E | **5.864865** | empty · blurb |
| E | `bands.G9 armLevel` | W18-E+OP+OC\|W18-E | **6.069069** | empty · blurb |
| E | `bands.G9 delta` | W18-E+OP+OC\|W18-E | **0.204204** | empty |
| E | `bands.G9 ci[0]` | W18-E+OP+OC\|W18-E | **0.045045** | empty · blurb |
| E | `bands.G9 ci[1]` | W18-E+OP+OC\|W18-E | **0.370370** | empty · blurb |
| E | `bands.G9 absDeltaOverTolerance` | W18-E+OP+OC\|W18-E | **0.126009** | empty · blurb |
| E | `bands.S3 s3.possessionsEndingWithoutAPassAttempt controlLevel` | W18-E+OP+OC\|W18-E | **0.130101** | empty |
| E | `bands.S3 armLevel` | W18-E+OP+OC\|W18-E | **0.130807** | empty |
| E | `bands.S3 delta` | W18-E+OP+OC\|W18-E | **0.000705** | — (trace only) |
| E | `bands.S3 ci[0]` | W18-E+OP+OC\|W18-E | **0.002762** | empty |
| E | `bands.S3 ci[1]` | W18-E+OP+OC\|W18-E | **0.004002** | empty |
| E | `bands.S3 absDeltaOverTolerance` | W18-E+OP+OC\|W18-E | **0.019624** | — (trace only) |
| E | `bands.S4 stuck.backwardShareOfGroundReleases controlLevel` | W18-E+OP+OC\|W18-E | **0.310020** | empty |
| E | `bands.S4 armLevel` | W18-E+OP+OC\|W18-E | **0.308642** | empty |
| E | `bands.S4 delta` | W18-E+OP+OC\|W18-E | **0.001378** | — (trace only) |
| E | `bands.S4 ci[0]` | W18-E+OP+OC\|W18-E | **0.005107** | — (trace only) |
| E | `bands.S4 ci[1]` | W18-E+OP+OC\|W18-E | **0.002282** | — (trace only) |
| E | `bands.S4 absDeltaOverTolerance` | W18-E+OP+OC\|W18-E | **0.016084** | — (trace only) |
| E | `deltas.stuck.pressedMix.pass controlValue` | W18-E+OP+OC\|W18-E | **0.321589** | empty · blurb |
| E | `deltas.stuck.pressedMix.pass armValue` | W18-E+OP+OC\|W18-E | **0.305726** | empty · blurb |
| E | `deltas.stuck.pressedMix.pass delta` | W18-E+OP+OC\|W18-E | **0.015863** | — (trace only) |
| E | `deltas.stuck.pressedMix.pass lo` | W18-E+OP+OC\|W18-E | **0.023075** | empty |
| E | `deltas.stuck.pressedMix.pass hi` | W18-E+OP+OC\|W18-E | **0.008512** | empty |
| E | `deltas.stuck.pressedMix.dribble controlValue` | W18-E+OP+OC\|W18-E | **0.619311** | empty · blurb |
| E | `deltas.stuck.pressedMix.dribble armValue` | W18-E+OP+OC\|W18-E | **0.636155** | empty · blurb |
| E | `deltas.stuck.pressedMix.dribble delta` | W18-E+OP+OC\|W18-E | **0.016845** | — (trace only) |
| E | `deltas.stuck.pressedMix.dribble lo` | W18-E+OP+OC\|W18-E | **0.008776** | empty |
| E | `deltas.stuck.pressedMix.dribble hi` | W18-E+OP+OC\|W18-E | **0.025449** | empty |
| E | `deltas.stuck.meanGroundPassLengthMetres controlValue` | W18-E+OP+OC\|W18-E | **14.201248** | — (trace only) |
| E | `deltas.stuck.meanGroundPassLengthMetres armValue` | W18-E+OP+OC\|W18-E | **14.262387** | — (trace only) |
| E | `deltas.stuck.meanGroundPassLengthMetres delta` | W18-E+OP+OC\|W18-E | **0.061139** | empty |
| E | `deltas.stuck.meanGroundPassLengthMetres lo` | W18-E+OP+OC\|W18-E | **0.003723** | empty |
| E | `deltas.stuck.meanGroundPassLengthMetres hi` | W18-E+OP+OC\|W18-E | **0.119801** | empty |
| E | `winTable.fixes fb.ground.opponent controlLevel` | W18-E+OP+OC\|W18-E | **0.316994** | empty · blurb |
| E | `winTable.fixes armLevel` | W18-E+OP+OC\|W18-E | **0.319064** | empty · blurb |
| E | `winTable.fixes delta` | W18-E+OP+OC\|W18-E | **0.002070** | empty |
| E | `winTable.fixes ci[0]` | W18-E+OP+OC\|W18-E | **0.001622** | empty · blurb |
| E | `winTable.fixes ci[1]` | W18-E+OP+OC\|W18-E | **0.005871** | empty · blurb |
| E | `frontMan.front.manFirst controlValue` | W18-E+OP+OC\|W18-E | **0.111497** | empty |
| E | `frontMan.front.manFirst armValue` | W18-E+OP+OC\|W18-E | **0.107375** | empty |
| E | `frontMan.front.manFirst delta` | W18-E+OP+OC\|W18-E | **0.004123** | — (trace only) |
| E | `frontMan.front.manFirst lo` | W18-E+OP+OC\|W18-E | **0.009266** | empty |
| E | `frontMan.front.manFirst hi` | W18-E+OP+OC\|W18-E | **0.001066** | empty |

⭐⭐ **WHAT THE BRIEF REFUSES TO FLATTER.** (i) The cost comes first and goals lead it, with the ratio that makes it
the largest movement on the pair. (ii) EVERY resolved band limb of the arm of record (G1 · G2 · G3 · G5 · G7 · G8 ·
S3 — pinned as the exact set) is printed with its interval and its |Δ| ÷ tolerance; on the empty book the two
resolved limbs (G7 passes DOWN, G9 through balls UP — pinned as the exact set) are printed likewise. (iii) The
named cost that did NOT appear (shorter lanes) is said as such — the ground passes got LONGER. (iv) 「别期待」 says the
mechanism's own face (`front.manFirst`) did not move, so the thing the sentence promises is NOT what the table saw.
(v) The empty book's win face moved the other way (`fixes` false there), said on that line and on the mature line.

## §THE SURFACES

| file | what |
| --- | --- |
| `src/game/a4World.ts` | `OP_WORLD_VERSION = 19` · `OP_WORLD_DOORS` · `isOpWorld` · `armOpWorld` (= `armIfWorld` CALLED, nothing more) · `opArmedVersion` (containment: `ifArmedVersion(match) === 18` ∧ BOTH flags) · `a4MatchFlags(19)` (world 18's composition CALLED) · `armA4World` routes 19 · `a4ArmedVersion` reads 19 FIRST · `A4WorldVersion` / `A4ArmedVersion` gain 19 · the URL / sticky parse accepts `19`, the bound moves to `20` · the docblocks |
| `src/game/GameApp.ts` | the armed-match guard and the pc-stack dose predicate include world 19 by the SAME single predicate world 18 extended · the feed line (BOTH dose forms) · the status line |
| `src/ui/A4WorldBadge.ts` | `A4_BADGE_TEXT_OP` (+ `_EMPTY`) · both tables keyed at 19 |
| `src/ui/SettingsScreen.ts` | the ⚙ → 🧬 world-19 checkbox (mutually exclusive — one value) + the long honest blurb |
| `tests/opPlaytestEntry.test.ts` | the pin suite (new) |
| `docs/world-model/OP-ENTRY-RUNG.md` | this doc |
| narrows (their OWN commit) | §THE NARROWED PINS below |

⭐ **THE DEFAULT LANDING WORLD IS UNCHANGED — BEFORE `0`, AFTER `0`.** World 19 is reached only by an explicit
`?a4world=19` or an explicit tick in ⚙ → 🧬 Experimental. ⭐ **ZERO files under `src/sim`, `src/ai`,
`src/evolution` or `scripts/`** — the engine is byte-untouched, so the OFF world cannot have moved (the structural
argument; §IDENTITY is the measurement). ⭐ `a4World.ts` names `opFrontMan` and `opFrontChooser` at EXACTLY their
two executable sites each (the door literal; the version reader) and nowhere in prose — the new comments in all four
files name no flag identifier (the LN-ENTRY / GK-ENTRY / IF-ENTRY precedent).

## §4 HOW-TO-SEE (BINDING)

* Computer: ⚙ → 🧬 Experimental → tick **「身前贴着的人要算进去 · 传不传、传给谁,都把球前面贴着的那个对手算进去
  (play-test)」**. The current match restarts immediately in that world — same fixture, same seed, rebuilt.
* Phone / a link: `?a4world=19`. The empty-book arm (E) is `?a4world=19&pcdose=0`.
* The A/B: **`?a4world=19` against `?a4world=18`, SAME device, same session.** World 18's own gate stays open.

**WHAT THE EYES ARE FOR** (#437 item 4(vi), binding): 身前贴着人的时候,他还会不会硬往那人身上传? 被逼抢时是不是更多
选择带球 — 带得像样吗? 进球是不是少了、少得让人难受吗?

**THE GATE** (#437 item 5): 「身前贴着的人要算进去 (v19) — keep | change | revert」, with #435 item 2(b)'s question
beside it, unbuilt: 「传球要不要更保守一点（宁可传安全的，不追求危险的落点）」. The commander's lean is the commander's
to tell (#437 item 5); this rung only states the gate.

## §LIVENESS and §THE MUTANT WALK

**LIVENESS (non-vacuous, in the entry's own path).** On six scratch seeds `900,010,840–845`, whole matches built
the app's way: (1) world 19 ≠ world 18 by whole-match signature on **≥ 3 of 6**; (2) ⭐ EACH door bites inside world
19 — world 19 ≠ (world 18 + `opFrontMan` alone) on ≥ 3 of 6, and world 19 ≠ (world 18 + `opFrontChooser` alone) on
≥ 3 of 6. Plus the pooled NON-VACUITY digest (19 ≠ 18 on the twelve identity seeds). The bound is "≥ 3", never
"every seed" (the dead-time exemption of #402 item 2(iii); OP-T1b's own liveness was a SHARE).

**THE MUTANT WALK — four mutants, exact texts, each killed.**

Each mutation was applied IN PLACE on the main tree from a byte copy, by a throwaway runner living outside the
repo (`scratchpad/opentry-mutants.mjs`): the anchor text is asserted to occur EXACTLY once, replaced, the suite
run, the original bytes written back, and the file's sha256 re-checked against its pre-mutant value before the
next mutant (`a4World.ts` `d04ed756…36f8`, `A4WorldBadge.ts` `0f52ddf4…b2a9` — all four restores verified). No
worktree (§DEVIATIONS 4). The run was `npx vitest run tests/opPlaytestEntry.test.ts --no-file-parallelism`; the
suite has **34** `it()`s, all green unmutated (133.0 s).

| # | the mutation (exact text) | killed by (source-mutant run) |
| --- | --- | --- |
| M1 | ONE DOOR DROPPED FROM THE BUNDLE — `export const OP_WORLD_DOORS = { opFrontMan: true, opFrontChooser: true } as const;` becomes `export const OP_WORLD_DOORS = { opFrontMan: true } as const;` | **8 red of 34** — FIDELITY (the key set), the composition/arming pin, full time, the door-set identity half (b), CONTAINMENT (19 reads 0 and falls back to 18), DORMANCY's positive half, M1's own analogue, ⭐ and the LIVENESS pin «EACH door bites inside world 19» (world 19 becomes world 18 + `opFrontMan` alone). The NON-VACUITY digest and the plain 19 ≠ 18 liveness stay GREEN under M1 — correctly: one door still bites |
| M2 | THE VERSION READER READING ONE FLAG ONLY — in `opArmedVersion`, `  return match.opFrontMan === true && match.opFrontChooser === true ? OP_WORLD_VERSION : 0;` becomes `  return match.opFrontMan === true ? OP_WORLD_VERSION : 0;` | **3 red of 34** — CONTAINMENT (a one-door world-18 match names itself 19), M1's analogue (the door-dropped match still reads 19) and M2's own analogue with its source-literal pin |
| M3 | THE ARMING RE-WRITING A GENE — `armOpWorld`'s body becomes `armIfWorld(match, l3Dose, pcDose);` followed by `const t = match.teams[0];` and `t.effGenome = { ...t.effGenome, lnOwnLaneWeight: 0.5 } as TacticalGenome;` | **5 red of 34** — the "CALLED and nothing more" source pin inside FIDELITY, CONTAINMENT (world 14's reader stops agreeing), M1's and M2's analogues (both arm through `armA4World(…, 19, …)` and then ask a containment reader that calls down through world 14's) and M3's own (the runtime genome-equality pin: world 19's three genome views are world 18's, key for key) |
| M4 | THE BADGE TEXT OFF-BY-ONE — in `A4_BADGE_TEXTS`, `  19: A4_BADGE_TEXT_OP,` becomes `  19: A4_BADGE_TEXT_IF,` (world 19 wears world 18's chip) | **2 red of 34** — the badge pin (19's chip is its own text in both dose forms) and M4's own analogue with the distinct-count pin (19 distinct names, not 18) |

## §THE NARROWED PINS (their OWN commit; the #425 standing form — stated POSITIVELY, never deleted)

Every hunk under `tests/` that is not the new suite. Each keeps its substantive claim and states it in the
positive form; **none is deleted**. 33 hunks in 16 suites (`git diff --stat`, measured).

| # | file | the old claim | the new claim |
| --- | --- | --- | --- |
| 1 | `a4PlaytestEntry.test.ts` | the armed-match guard literal ends `\|\| isIfWorld(this.a4World))) {` | the SAME single guard, widened by `\|\| isOpWorld(this.a4World)` on its own continuation line — still ONE guard |
| 2 | `bkPlaytestEntry.test.ts` | the pc-stack predicate ends `\|\| isIfWorld(version);` | the SAME single predicate, widened by `\|\| isOpWorld(version)` |
| 3 | `bkPlaytestEntry.test.ts` | the badge table holds **18** distinct names | it holds **19** |
| 4 | `bkPlaytestEntry.test.ts` | `?a4world=19` → null | `?a4world=19` → **19** (the OP entry) and the bound moves to **20** |
| 5 | `bkPlaytestEntry.test.ts` | the armed-match guard literal | widened by `\|\| isOpWorld(this.a4World)` |
| 6 | `bqPlaytestEntry.test.ts` | `?a4world=19` → null | → **19**; the bound moves to **20** |
| 7 | `cbPlaytestEntry.test.ts` | `?a4world=19` → null | → **19**; the bound moves to **20** |
| 8 | `cbPlaytestEntry.test.ts` | the badge table holds **18** distinct names | it holds **19** |
| 9 | `ds2PlaytestEntry.test.ts` | `?a4world=19` → null (its URL pin and its mutant analogue, two hunks) | → **19**; the bound moves to **20** |
| 10 | `dsPlaytestEntry.test.ts` | `?a4world=19` → null (two hunks) | → **19**; the bound moves to **20** |
| 11 | `entriesW10W11.test.ts` | the pc-stack predicate | widened by `\|\| isOpWorld(version)` |
| 12 | `entriesW10W11.test.ts` | the badge table holds **18** distinct names | it holds **19** |
| 13 | `entriesW10W11.test.ts` | the EMPTY dose table holds **11** (worlds 8…18) | it holds **12** (…/19) |
| 14 | `entriesW10W11.test.ts` | `?a4world=19` → null | → **19**; the bound moves to **20** |
| 15 | `entriesW10W11.test.ts` | the armed-match guard literal | widened by `\|\| isOpWorld(this.a4World)` |
| 16 | `gkPlaytestEntry.test.ts` | `?a4world=19` → null (two hunks) | → **19**; the bound moves to **20** |
| 17 | `ifPlaytestEntry.test.ts` | `?a4world=19` → null | → **19**; the bound moves to **20** (`?a4world=18` → 18 UNCHANGED — what that pin is about) |
| 18 | `ifPlaytestEntry.test.ts` | (M4) the badge table holds **18** distinct names | it holds **19**; world 18's chip is still its own (`A4_BADGE_TEXTS[18] ≠ [17]` UNCHANGED) |
| 19 | `l3PlaytestEntry.test.ts` | `?a4world=19` → null | → **19**; the bound moves to **20** |
| 20 | `l3PlaytestEntry.test.ts` | the badge table holds **18** distinct names | it holds **19** |
| 21 | `l3PlaytestEntry.test.ts` | the armed-match guard literal | widened by `\|\| isOpWorld(this.a4World)` |
| 22 | `lnPlaytestEntry.test.ts` | `?a4world=19` → null | → **19**; the bound moves to **20** |
| 23 | `mtPlaytestEntry.test.ts` | the badge table holds **18** distinct names | it holds **19** |
| 24 | `pcPlaytestEntry.test.ts` | `?a4world=19` → null | → **19**; the bound moves to **20** |
| 25 | `pcPlaytestEntry.test.ts` | the badge table holds **18** distinct names | it holds **19** |
| 26 | `pcPlaytestEntry.test.ts` | the armed-match guard literal | widened by `\|\| isOpWorld(this.a4World)` |
| 27 | `raPlaytestEntry.test.ts` | `?a4world=19` → null | → **19**; the bound moves to **20** |
| 28 | `opFrontMan.test.ts` | §SEAM MAP: `opFrontMan` is named in the THREE seam files only | it is named in **four** — `src/game/a4World.ts` added with its count enumerated (**2**: world 19's door literal; `opArmedVersion`'s ONE read); the seam's three counts (Match 4 · League 1 · PlayerBrain 1) UNCHANGED |
| 29 | `opFrontMan.test.ts` | `opFrontMan: true` appears in NO `src/**` file | it is SET true in exactly ONE place — world 19's `OP_WORLD_DOORS` literal (count **1** in `a4World.ts`, **0** everywhere else). The `.opFrontMan =` assignment pin (1 in `Match.ts`) and the env prohibition UNTOUCHED |
| 30 | `opFrontMan.test.ts` | Road B: `a4World.ts` names `opFrontMan` / `laneOpennessFront` nowhere | `a4World.ts` names `opFrontMan` at exactly its **2** executable sites and `laneOpennessFront` STILL **0**; worlds 1–18 STILL carry no flag (unchanged loop), world 19 carries it |
| 31 | `opFrontChooser.test.ts` | §SEAM MAP: `opFrontChooser` in the THREE seam files only | **four**, `a4World.ts` added with count **2**; the seam's counts UNCHANGED; the fact and input maps UNTOUCHED |
| 32 | `opFrontChooser.test.ts` | `opFrontChooser: true` appears in NO `src/**` file | exactly ONE place — world 19's door literal (count **1** in `a4World.ts`) |
| 33 | `opFrontChooser.test.ts` | Road B: `a4World.ts` names `opFrontChooser` / `frontContact` nowhere | `opFrontChooser` at exactly its **2** executable sites, `frontContact` STILL **0**; worlds 1–18 STILL carry no flag, world 19 carries it |

⭐ **NO PROHIBITION WAS WIDENED BEYOND THE ENTRY LAYER.** The two seam suites' entry-layer anchors gain exactly one
file each, enumerated at both of its sites; the front FORM (`laneOpennessFront`), the FACT (`frontContactOf`) and
the INPUT (`frontContact`) stay at zero in the entry layer, which is the substantive claim (the entry arms the
seams; it does not touch their mechanics). `tests/ifFlightRun.test.ts`, `tests/dsOwnRun.test.ts` and
`tests/dsCoopHatsOff.test.ts` are UNTOUCHED: `opArmedVersion` asks the world below by CALLING `ifArmedVersion`.

### ⚠ FROZEN INSTRUMENTS THAT MAY NOW READ DIFFERENTLY, DECLARED AND NOT EDITED

Any frozen probe carrying a ZERO-COUNT anchor over `src/game/a4World.ts` for `opFrontMan` / `opFrontChooser` (the
#412 item 3 FAMILY NOTE shape — `if-t1b-flight-run-exam.ts`'s `codeFacts.a4WorldCleanOfTheSwitch` read RED from
`e04f54c` for the same reason) would read differently from this commit. MEASURED by grep over `scripts/probes/`: four literal-zero anchors over
`a4World.ts` now read RED from this commit — `op-c3-chooser-census.ts:251` (`'opFrontMan', 0`) ·
`op-t1-front-man-exam.ts:227` (`'opFrontMan', 0`) · `op-t1b-front-chooser-exam.ts:242` (`'opFrontMan', 0`) ·
`op-t1b-front-chooser-exam.ts:298` (`'opFrontChooser', 0`) — each now counts **2** (the door literal and the
version reader), the IF-T1b `a4WorldCleanOfTheSwitch` shape exactly. The OP-C0 / C1 / C2 probes anchor only
world 18's composition line (unchanged) and read the file into their source map (whose bytes change). ⛔ No file under
`scripts/` is touched by this rung; probes are not vitest files. The errata line, if any, is the commander's.

## §DEVIATIONS (declared by the executor; the commander disposes)

1. ⚠⚠ **THE TREE WAS ADOPTED (the commander's ruling on the tree state, 2026-10-13).** This dispatch's first
   executor (agent `aef146b5843bf330b`) wrote the four src edits, the 16 narrowed suites, the new pin suite and
   this doc, and died at 01:05 on a usage limit BEFORE committing. The second executor ADOPTED the tree — no
   stash, no reset — and reviewed every adopted hunk against #437 item 4 as a stranger's. What it recovered from
   the first executor's transcript: (a) the identity recorder's own output (transcript line 107, 16:43:53Z):
   `HEAD 4cf854f · porcelain bytes 0 · arch x64 · node v24.18.0`, the seven `ifPlaytestEntry` literals each
   `REPRODUCES`, then `world18 70ef00f1…9f68 (NEW — recorded)`; the recorder ran at 16:42:57Z, BEFORE the first
   src edit at 16:46:19Z, so the column is the clean dispatch head's and was NOT re-recorded; (b) the trace table
   (re-verified independently, §CHECKS); (c) the narrows and their reasons (§THE NARROWED PINS). What it FIXED: the
   pin suite failed `tsc` (an array literal of `{ opFrontMan }` / `{ opFrontChooser }` objects is not assignable to
   `Record<string, boolean>`; one `as Record<string, boolean>[]` added at the containment pin — no assertion
   changed). What it FINISHED: the mutant walk (run here, §THE MUTANT WALK), the frozen-probe note, this section
   and §CHECKS. Everything else in the adopted tree was found correct and is kept as written.
2. ⚠ **THE x64 IDENTITY COLUMN WAS RECORDED IN PROCESS ON THE CLEAN TREE, NOT IN A THROWAWAY WORKTREE** — the
   #433 LOW 2 precedent, accepted by #437 item 4(iii) on the condition met: the recorder first reproduced
   `ifPlaytestEntry`'s seven x64 literals in the same run. (The worktree route is the one that destroyed part of
   `node_modules` at #425.)
3. ⚠ **THE HONESTY LINE IS RENDERED FROM #437 item 4(vi)'s WORDS**, because OP-T1b's artifact stores no
   `reads.honestyLine` field: 「这块表看到的很少,不等于眼睛什么也看不到——这道门就是请你的眼睛来判」, the same string on all three
   number-bearing places (pinned).
4. ⚠ **THE MUTANT WALK RAN IN PLACE ON THE MAIN TREE**, not in a worktree as IF-ENTRY did (the brief's Windows
   hazard: prefer no worktrees). Each mutant was applied from a byte copy and restored, with the anchor asserted
   unique and the sha256 re-verified after every restore; nothing else was running against the tree.
5. ⚠ **M1 DROPS `opFrontChooser`** (the bundle keeps `opFrontMan`). The other half — `opFrontMan` dropped — is
   covered by M1's own analogue pin, which loops over BOTH drops at runtime. A two-door bundle also makes a
   stronger M1 than IF-ENTRY's: the world stays live (one door bites), so the kill has to come from fidelity,
   containment and the per-door liveness pin, not from vacuity.
6. ⚠ **「两扇门单开」 IS NOT ON THE EMPTY-BOOK FEED LINE.** The one-door contrasts (`W18-D+OP|W18-D`,
   `W18-D+OC|W18-D`) exist only on the dosed surface; printing them on the E line would be a cross-arm number (the
   #387 item 1 class). They are on the mature line and in the blurb's D part; the E line says its own win face
   moved the other way.
7. ⚠ **THE NARROWS ARE THEIR OWN COMMIT** (#437 item 4(vii)/(xi)), so the tree between the entry commit and the
   narrows commit has the 33 narrowed pins red; the gates were run on the tree that holds both. 33 hunks in 16
   suites (IF-ENTRY: 30 in 14) — the two extra suites are the OP seam suites, whose "`a4World.ts` names the flag
   ZERO times" anchors the bundle literal and the version reader necessarily break; each is widened to the exact
   count (2) with the front FORM, the FACT and the INPUT still pinned at zero in the entry layer.
8. ⚠ **FOUR FROZEN PROBE ANCHORS READ RED FROM THIS COMMIT** (§FROZEN INSTRUMENTS above) — declared, not edited;
   not vitest files.
9. ⚠ **LIVENESS HAS A SECOND PIN THE IF FORM DID NOT NEED**: with two doors, «world 19 ≠ 18» alone would pass
   with one dead door, so each door is also shown to bite inside world 19 (19 ≠ 18 + the other door alone, ≥ 3 of
   6 each). This is the pin M1 kills.
10. ⚠ **THE BADGE CARRIES NO NUMERAL** (the family's form since v7); the cost lives in its docblock and on the two
    number-bearing surfaces.
11. ⚠ **ZERO FRONTIER, ZERO STATS.** Seeds walked: the identity band 900,007,200–211; this executor's
    900,010,820–825 · 830–831 · 840–845 (one base `900,010,800`); OP-T1b's consumed 12,566,000–011. The verifier's
    900,010,900–999 untouched.
12. ⚠ **ONE FULL-SUITE RED SITS OUTSIDE THE #418 INVENTORY'S LETTER**: `careers.test.ts` «determinism» timed out
    at its own 20 s limit (24.0 s, twice). The inventory lists `careers` save/load as class D and struck the
    determinism case as parallel-only at #418; on this run the whole host ran ~2× slower than at OP-T0's serial
    run. The diff cannot reach the file (import graph in §CHECKS). Reported as a host-speed timeout, not a logic
    red; ⛔ no test edited. The commander decides whether it joins class D.

## §CHECKS — what was run, and what it said

| gate | result |
| --- | --- |
| `npx tsc --noEmit -p .` | **clean** (exit 0) — after the one adopted-tree fix of §DEVIATIONS 1 |
| `npm run build` | **built** (`tsc --noEmit && vite build`, exit 0, 16.13 s) |
| `npm run fingerprint` | **`59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d`** — the x64 value of record (#418 item 1), UNCHANGED |
| `tests/opPlaytestEntry.test.ts` serial | **34 / 34 green** (133.0 s standalone; 131.0 s inside the full run) |
| the trace, re-derived outside the suite | two throwaway node scripts: every one of the 153 trace-table rows re-derived from the artifact by its OWN field label and contrast — **153 / 153 equal**; the surfaces column of every row re-checked against the three source strings — **0 mismatches**; numerals **79 (78 distinct) mature · 50 (50) empty · 103 (102) blurb** |
| THE MUTANT WALK | **M1 8 · M2 3 · M3 5 · M4 2 red of 34**, every restore sha-verified (§THE MUTANT WALK) |
| the narrowed suites inside the full run | `ifPlaytestEntry` 33 / 33 · `opFrontMan` 34 / 34 · `opFrontChooser` 45 / 45 · `ifFlightRun` 51 / 51 · `bkPlaytestEntry` · `pcPlaytestEntry` · `entriesW10W11` · `cbPlaytestEntry` · `l3PlaytestEntry` · `raPlaytestEntry` all green; `a4PlaytestEntry` · `bqPlaytestEntry` · `dsPlaytestEntry` · `ds2PlaytestEntry` · `gkPlaytestEntry` · `lnPlaytestEntry` · `mtPlaytestEntry` red ONLY on their #418 class-A digest / fingerprint entries |
| the FULL suite serial (`npx vitest run --no-file-parallelism`, 5,429.6 s) | **2,510 / 2,570 green; 60 reds in 38 files.** THE SUBTRACTION: 60 − class A **35** (the fingerprint ×18 · the pooled IDENTITY digests of `bq` / `gk` / `ln` ×3 · `ds` / `ds2` ×2 each · `dsOwnRun` / `dsCoopHatsOff` G-OFF + fingerprint ×5 each — file for file the #418 item 3 list) − class C **20** (path separators, file for file) − class B **1** (`stamina.test.ts`) − class D **3** (`careers` save/load · `formationEvolution` ten seasons · `simRunner` multi-season, timeouts at the file's own limit) = **1**: `careers.test.ts` «determinism: same seed ⇒ identical careers…» — `Test timed out in 20000ms` (24.0 s; re-run alone: 24.0 s again, red). ⚠ OUTSIDE the inventory's letter, declared (§DEVIATIONS 12): the inventory STRUCK it as parallel-only in 2026-09; on this run the host was ~2× slower than at OP-T0's serial run (the same test 11.4 s there; `careers` «long run» 53.8 s vs 24.7 s), and the file imports only `src/sim/League`, `src/evolution/playerGenome`, `src/sim/types`, `src/utils/rng` — no file under `src/sim`, `src/evolution`, `src/ai` or `src/utils` imports `src/game` or `src/ui`, so this diff cannot reach it. Host speed, not logic. No path-separator red appeared outside class C |
| `git status --short` before each commit | exactly the 22 adopted paths; nothing foreign |

## §ROAD B — nothing ships

The default landing world is `0` before and after. `npm run fingerprint` re-derives the x64 value of record
`59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d`, UNCHANGED. Every world below 19 is
byte-identical to the dispatch head (§IDENTITY). Nothing under `src/sim`, `src/ai`, `src/evolution` or `scripts/`
is in either commit. **A player who does not opt in sees exactly what he saw before.**

## §NEXT — THE OP PLAY-TEST (USER GATE)

**「身前贴着的人要算进去 (v19) — keep | change | revert」**, at `?a4world=19` against `?a4world=18`, same device.
The gate opens at the commander's push (#437 item 5); nothing here is pushed.
