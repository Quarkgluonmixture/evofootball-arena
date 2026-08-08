# A4 PLAY-TEST — 约定世界,交给眼睛

> **Authority**: commander ruling #155 (the user rules #154.4 option A);
> **v2 · discipline** added by commander ruling #167.5 (S2-P4);
> **v3 · 出球前摇** added by commander ruling #184.2 (the user rules 甲 at #183.5).
> **What it is**: the certified PRIOR world of A4 slice 1 — affirmed at exam
> grain in #154 — wired into the PLAYABLE game behind an explicit opt-in, so
> the verdict that no instrument can give (does it look like football?) can be
> given by the only arbiter VISION §2 recognises: the user's eyes.
> **Nothing ships.** Default OFF everywhere; production fingerprint
> `57b0bdab…c673` unchanged; a player who does not opt in downloads nothing
> extra and plays the identical game.

## 1. What the armed world is

Both teams get, at once:

* **The enriched substrate** the census was taken on — the perceived-defence /
  perceived-choice / value-axis trio plus the C-family seams (`c5Hold`,
  `c6Carry`, `c7Windup`; `c5TouchFork` off). This is `CENSUS_FLAGS` of
  `scripts/probes/a4-p3prime-replication.ts`, verbatim.
* **The eye** — the both-sides role-conditioned chooser on the P3p-1 merged
  table, with the in-support law and the two S bits armed (the `R3p` arm).
* **The agreement** — `eye.v4.homePrior` on, `homePriorObedience = 0.5` on both
  teams: `homePriorStrength(0.5) = 0.25×VAL_SCALE = 0.040874`, the #148
  certified **whisper** dose. 野球开场三十秒 的那种约定,不是战术板。

That combination is the probe's `PRIOR` arm. Measured there (#154, virgin
seeds): deep entries **−0.74/set**, box entries **−0.380/set** against `R3p`,
with every football hard gate holding. What it costs, honestly: restarts up
(~+161/set at #151 grain) and the eye's role diversity homogenises about
halfway toward the incumbent.

## 1b. ⭐ v2 · 纪律 — 每个位置自己的松紧

**一句人话**:同一个开场约定,但**每个位置对它的松紧不一样** —— 后卫**紧**(最
听约定的)、中场居中、前锋**松**(几乎不受约束)。球队平均的松紧和 v1 **完全一
样**,只是重新分配到了各个位置上,所以这不是「更服从」,而是「谁该服从」。这套
松紧**经过三轮考试认证**(S2-P3):它和仪器版世界踢出来一模一样(400 个种子逐字
节相同)、每一项足球硬检查都过关,量到的是——抢球乱战 **−7.0%**、越位 **−11.2%**、
死球时间 **−4.5%**、球员之间多出 **+0.27 m** 的空间、三人配合 **+7.3%**。

技术上:v1 的一切 **加上** genome 上冻结的偏移家族
`homePriorObedienceOffset = [0, +0.4, +0.2, 0, −0.2, −0.4]`(按**号码槽**,不按
角色),两队都写。有效服从 = `clamp01(0.5 + offset)` =
`[0.5, 0.9, 0.7, 0.5, 0.3, 0.1]`,外场 5 个槽正是 S2-P1 的 `backLoaded` 仪器向量,
外场均值 0.5 = v1 的同一剂量。0 号槽(门将)冻结在 0 —— 角色无关的中性值,Leg F
证明这个选择不影响任何一帧。**演化开关全关**(#165.2.ii:`evolveHomePrior` /
`evolveHomePriorOffsets` 只管突变与交叉,这是一个**固定**世界,什么都不突变);
基因**出生仍然是空的**,家族只作为仪器内容写在你打开的这一场上。

v1 和 v2 **只能开一个**(开一个自动关另一个,不存在混合),v1 原样保留,方便你
来回对比手感。

## 1c. ⭐ v3 · 出球前摇 — 球不再「决定就飞出去」

**一句人话**:v2 的纪律世界,**再加上短传的出球前摇**。以前球员一决定要传,球在
同一帧就飞走了;现在他要先**摆腿**,这个窗口看得见(大约 0.05–0.18 秒,3–11 帧),
**技术好的人摆得快**,**跑动中或刚急转身的人摆得慢**。不受影响的:**一脚出球**
(接球窗口还开着时的一触即传,直接放行)、**开球**、以及各种**死球发球**——所以
它不会让重新开球变慢。

量到了什么(O1-T2,1000 对同种子比赛,#183 认证):

* **出球确实慢了**:接球到出球的中位数 **+0.0425 秒**〔+0.0395, +0.0456〕—— 前摇
  就是它声称的那个「停顿」,不多不少;
* **丢球变少了**:每观看分钟的丢球 **−0.184**〔−0.320, −0.047〕—— 这是目前量到的
  第一个把「慌乱」往下压的杠杆;
* **大局没乱**:进球 2.192(比基线 −8.5%,在 ±15% 带内),传中/头球/长传/倒三角
  全都在 ±25% 内 —— 平衡态扛住了这笔时间税;
* **老实说的那一半**:回合(球权持续)只长了 **+0.085 秒 = 差距的 1.7%**,观看时钟
  的丢球移动了 **4.3%**,都远小于当初定下的 20% 台阶。诊断已记录在案:出球时间只是
  节奏问题的**小一半**,真正的病在**被逼抢时的第一脚控球丢球**(那是 O2/O3 的座位,
  不是 O1 的)。所以 v3 买到的是**看得见的前摇、防守的封堵窗口、以及一点点更稳的
  节奏**,代价是零平衡态代价。

技术上:v3 = **v2 的全部内容,一字不改**(同样的 0.5 耳语 + 同样冻结的偏移家族,
写在同样三处 genome 引用上,两队都写)**加上** 构造标记 `o1PassWindup`。这一个标记
**在入口层组合**(`a4MatchFlags(3)`),`A4_WORLD_FLAGS` 本身**一个字节都没动** ——
那个对象是「眼睛的表是在这个世界里普查出来的」这一保真声明,往里加第四个缝会让
**所有版本**一起脱离普查基准(契约 §3 FLAG HYGIENE,#184.2 的硬约束)。前摇的时长
法则、封口条件与所有「不走这条路」的分支都在 O1-T1/T2 里认证过,本次入口**没有
改动 `src/sim`**。

v1 / v2 / v3 **只能开一个**。

## 2. How to launch

**Desktop**

1. Open the game.
2. `⚙ Settings` → **🧬 Experimental** → tick ONE of:
   * **“A4 world v1 · 统一约定 (play-test)”** — the #156 uniform whisper;
   * **“A4 world v2 · 纪律 (play-test)”** — the #167.5 discipline world;
   * **“A4 world v3 · 出球前摇 (play-test)”** — the #184.2 wind-up world (v2 + 前摇).
   Ticking one unticks the others — the worlds are mutually exclusive.
3. The census tables load (~440 kB, once, shared by all three worlds), the current
   match **restarts** in the armed world, and the chip appears in the top-left
   corner: **🧪 A4 约定世界 v1 · 统一**, **🧪 A4 约定世界 v2 · 纪律** or
   **🧪 A4 约定世界 v3 · 前摇**. That chip is the ground truth for WHICH world is
   on screen.
4. Untick to go back. The shipped world returns at once, chip disappears.

**Phone** (the same room — the ⚙ screen is full-viewport below 640px)

* Same three taps: `⚙` → scroll to 🧬 Experimental → tick the A4 box. The chip
  sits inside the safe-area inset, above the match strip and every overlay, so
  it stays visible in the stacked phone layout and in the installed PWA.
* **Or use the link**: append `?a4world=1` (v1), `?a4world=2` (v2) or
  **`?a4world=3` (v3)** to the URL, e.g.
  `https://…/evofootball-arena/?a4world=3`. It arms on load and
  **sticks** (the choice is remembered), so the link only has to be opened once.
  `?a4world=0` disarms and clears it; the ⚙ checkboxes do the same. Opening the
  other version's link switches worlds — never blends them.

**Notes**

* The choice is sticky across reloads and across “new league” / “reset”.
* Arming or disarming restarts the CURRENT fixture (same seed, rebuilt in the
  chosen world) — you never have to wait a match to see it.
* If the tables fail to load (offline first run), the entry refuses to arm,
  says so in the feed, and leaves you in the shipped world.

## 3. What to watch for (the acceptance list)

Rule per item: **keep / change / revert**, in plain football language. Change
verdicts want the "what would be better" clause; instruments can follow.

| # | Lever | The question |
|---|---|---|
| 1 | **A4 约定世界 v2 · 纪律** | ⭐ 四问(#167.5): **① 防守知道往哪走了吗?** (你上次的原话是「很多时候球员不知道自己该往哪走,尤其是防守的时候」) **② 哨声/越位少了吗?** **③ 配合如何?**(上次「配合确实更多了」——现在更多还是更少) **④ 紧凑得像球队还是像一堆人?**(#152 的形状裁决权) |
| 1b | **A4 约定世界 v1 · 统一** | 同样四问,作为 A/B 的对照:同一场比赛,来回切 v1/v2,哪一个更像足球? |
| 1c | **A4 约定世界 v3 · 出球前摇** | ⭐ 三问(#184.2,你自己的话):**① 出球前的摆腿看得见吗?**(是「有个动作」还是「球黏了一下」——摆腿快慢跟人对不对得上) **② 节奏手感比 v2 好还是差?**(整场看下来是更从容还是更黏) **③ 防守多出来的封堵窗口用上了吗?**(前摇给了防守一个可以扑的瞬间——有人去扑吗,扑得像样吗) 对照做法:同一场来回切 v2 ↔ v3,只有前摇这一点不同 |
| 2 | **D1 shell** | Does the world outside the pitch read as a stadium — does the shell frame the game or distract from it? |
| 3 | **D2 trails** | The motion trails: do they help you read who is moving where, or do they smear the picture? |
| 4 | **Phone layering** | On the phone: does anything cover anything it shouldn't — match strip vs league/evolution/settings screens, the banners, the badge? |
| 5 | **F7b fireworks** | The goal fireworks: right amount, right moment, or does it interrupt the football? |
| 6 | **F7c goal camera** | The goal camera move: does it show you the goal, or does it lose the ball? |

## 4. The verdict format

For each lever, one line:

```
<lever> — keep | change | revert — <one sentence in plain football language>
```

Example: `A4 约定世界 — change — 后场紧是对的,但中前场跟着球挤成一坨,像野球。`

Verdicts go back to the commander, who converts them into rulings; **keep** on
item 1 is what would move the per-body discipline family (and the home-prior
mechanism under it) from BANKED DORMANT toward a ship candidate — this entry does not ship it, and playing with it armed changes
nothing for anyone else.

## 5. Where the code is

| Piece | File |
|---|---|
| The armed world (flags, eye, prior, storage, table loader) | `src/game/a4World.ts` |
| The on-screen chip | `src/ui/A4WorldBadge.ts` (+ `.a4-world-badge` in `src/ui/style.css`) |
| The toggle | `src/ui/SettingsScreen.ts` (🧬 Experimental) |
| The wiring (arm / disarm / arm the next match) | `src/game/GameApp.ts` (`setA4World`, `armA4`, `loadNextFixture`) |
| The contract tests | `tests/a4PlaytestEntry.test.ts` (v1) · `tests/a4PlaytestEntryV2.test.ts` (v2) · `tests/a4PlaytestEntryV3.test.ts` (v3) |
| The v3 composition (the census set is NOT widened) | `a4MatchFlags(version)` in `src/game/a4World.ts` — v1/v2 = `A4_WORLD_FLAGS` untouched, v3 = that set **plus** `o1PassWindup` |
| The fidelity source | v1: `scripts/probes/a4-p3prime-replication.ts` (the `PRIOR` arm) · v2: `scripts/probes/a4-s2p3-gene-battery.ts` + the banked Leg F artifact `docs/world-model/data/a4-s2p3-legf-fidelity.json` (SHA `1f2fc5d4…`) + `docs/world-model/A4-S2P3-GENE-BATTERY.md` §1 · v3: v2's sources + the certified mechanic in `docs/world-model/O1-T1-PASS-WINDUP.md` (the seam + the W law) and `docs/world-model/O1-T2-MATCH-AB.md` §RESULT (the 1,000-seed A/B, `data/o1-t2-match-ab.json`) |
| The gene family's only writer | `setHomePriorOffsets` in `src/evolution/genome.ts` (the entry passes content, never names the field) |

The arming idiom is E4-PREP's (`src/game/edsPreview.ts`, rulings #14.3 / #22.5):
an audited arm, a sticky user choice, pushed onto `League.matchFlags` for
matches started from now on. A4 adds what construction flags cannot express —
the `Match.stationEye` config and the obedience gene on both teams — applied to
the freshly built match, and only when the user armed it.

> **注意(E4 同款语义)**:只有你**观看**的比赛在 A4 世界里踢;后台批量模拟的
> 赛季结果仍来自线上世界(matchFlags 不进存档序列化)。所以联赛积分榜不反映
> A4 世界——你的眼睛看的那场才是实验品。v2 完全同理:纪律家族只写在你**观看**的
> 那场比赛的两队 genome 上,后台模拟、存档与演化里没有它(基因出生依旧是空的)。
> **v3 也一样**:`o1PassWindup` 只进你观看的那场比赛的构造标记(`matchFlags` 不进
> 存档序列化),后台批量模拟的赛季结果里没有前摇,所以积分榜依旧不反映 v3。
