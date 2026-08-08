# A4 PLAY-TEST — 约定世界,交给眼睛

> **Authority**: commander ruling #155 (the user rules #154.4 option A);
> **v2 · discipline** added by commander ruling #167.5 (S2-P4).
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

## 2. How to launch

**Desktop**

1. Open the game.
2. `⚙ Settings` → **🧬 Experimental** → tick ONE of:
   * **“A4 world v1 · 统一约定 (play-test)”** — the #156 uniform whisper;
   * **“A4 world v2 · 纪律 (play-test)”** — the #167.5 discipline world.
   Ticking one unticks the other — the two worlds are mutually exclusive.
3. The census tables load (~440 kB, once, shared by both worlds), the current
   match **restarts** in the armed world, and the chip appears in the top-left
   corner: **🧪 A4 约定世界 v1 · 统一** or **🧪 A4 约定世界 v2 · 纪律**. That
   chip is the ground truth for WHICH world is on screen.
4. Untick to go back. The shipped world returns at once, chip disappears.

**Phone** (the same room — the ⚙ screen is full-viewport below 640px)

* Same three taps: `⚙` → scroll to 🧬 Experimental → tick the A4 box. The chip
  sits inside the safe-area inset, above the match strip and every overlay, so
  it stays visible in the stacked phone layout and in the installed PWA.
* **Or use the link**: append `?a4world=1` (v1) or **`?a4world=2` (v2)** to the
  URL, e.g. `https://…/evofootball-arena/?a4world=2`. It arms on load and
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
| The contract tests | `tests/a4PlaytestEntry.test.ts` (v1) · `tests/a4PlaytestEntryV2.test.ts` (v2) |
| The fidelity source | v1: `scripts/probes/a4-p3prime-replication.ts` (the `PRIOR` arm) · v2: `scripts/probes/a4-s2p3-gene-battery.ts` + the banked Leg F artifact `docs/world-model/data/a4-s2p3-legf-fidelity.json` (SHA `1f2fc5d4…`) + `docs/world-model/A4-S2P3-GENE-BATTERY.md` §1 |
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
