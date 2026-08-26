# VISION SNAPSHOT RE-VERIFY CENSUS — 2026-08-26

> Dispatched by **COMMANDER RULING #347 item 3** (authorized, scope bound there)
> and **#348 item 4** (dispatched into the freed tree). Instrument-only;
> **ZERO `src/**` bytes**, ZERO sim seeds, ZERO stats.
>
> **THE OBJECT**: every DATED STATUS CLAIM in [`../VISION.md`](../VISION.md) —
> anything that asserts the state of the CODE or the WORLD as of a date
> (「现状(对代码属实)」, 「代码核实的现状」, 「现状对账」, dated anchors carrying
> code assertions, named files / constants / behaviours). Each such claim gets
> ONE verdict against TODAY's code.
>
> ⛔ **THE GOLD STANDARD'S TEXT IS SACRED.** The user's blockquoted 原话 are
> **NEVER audited**: they are the user's words, and words are timelessly true as
> words. Only the PROSE CODE-STATE assertions written around them are audited.
> This document changes nothing in VISION.md except (at most) two pointer lines.

## §0 METHOD

Adapted from [`R-JIA-EVENT-VOCABULARY-CENSUS.md`](R-JIA-EVENT-VOCABULARY-CENSUS.md)
§0 — the **freeze-then-classify** form, and the git history is the attestation
(#266.3(c)):

* **COMMIT 1 = THE INVENTORY (the freeze half).** §1's table is
  complete in its CLAIM / HOME / REGISTERED columns; the VERDICT and EVIDENCE
  columns are present but **EMPTY, explicitly marked NOT YET WRITTEN**. The
  inventory is enumerated from VISION.md's prose ALONE — the enumeration is
  therefore not shaped by what the verification happened to find.
* **COMMIT 2 = THE RESULTS (the re-verify half).** Verdicts + evidence + the
  人话 summary, written only after the live code was read.

1. **Grain.** One row = one CLAIM. A paragraph routinely holds several
   (the §1 headline 现状 holds eight); each is a separate row, because a
   paragraph can be half true and the whole point is to say WHICH half.
2. **Four verdicts, evidence-bearing.**
   * **STILL-TRUE** — the assertion holds today; evidence = a `file:line`
     traced THIS ROUND (not copied from the claim).
   * **PARTIALLY-STALE** — say EXACTLY which half moved, with the code
     evidence, and the ruling/commit that moved it.
   * **FIXED-SINCE** — the defect the claim registers is retired; name the
     ruling/arc/commit that retired it, and say in WHICH WORLD (shipped vs
     opt-in play-test world) it is retired.
   * **UNVERIFIABLE** — say WHAT WAS SEARCHED (the R-甲 ABSENT discipline);
     "I could not check it" is not a finding until the attempt is stated.
3. **⭐ THE WORLD AXIS IS PART OF EVERY VERDICT.** This engine ships ONE
   default world (`?a4world=0`) plus eleven OPT-IN play-test worlds, and most
   of the 2026-08 arcs bank their seam **born-absent behind a flag**
   (`Match`'s `readonly` flag block, `src/sim/Match.ts:1166-1606`). A seam that
   EXISTS IN CODE but is dormant in the shipped world does **not** make a
   "the substrate cannot express it" claim false — it makes it PARTIALLY-STALE,
   and the row must say which side of that line it is on. Verdicts that ignore
   this axis would read as progress the player cannot see.
4. **⛔ Verbatim quotes excluded** (the sacredness rule above). Rows here quote
   only the SURROUNDING prose.
5. **Not a gate, and not a mandate.** Nothing here recommends what to build and
   nothing here is a threshold. The three-way VISION split stays a USER
   decision (#347 item 1), informed by — never forced by — this audit.
6. **Line pins are audited too.** A claim that names `file:line` is checked at
   that line. A pin that has drifted is reported even when the substance holds:
   a stale pin sends the next reader to the wrong code (the "一个事实只设一个
   权威来源" hazard in its citation form).

## §1 THE INVENTORY

**HOME** = VISION.md section. **REGISTERED** = the date the claim carries in
VISION.md itself (⊘ = the claim carries no date of its own; it inherits the
dated anchor it sits under, given in brackets).

| # | CLAIM (prose assertion, abridged) | HOME | REGISTERED | VERDICT | EVIDENCE / THE RULING THAT MOVED IT |
|---|---|---|---|---|---|
| V01 | 阵型 = 一组手写的固定坐标表 (wide-212 / narrow-122 / … / low-32 / …) | §1 头号活体违规 | 2026-07-19 | **PARTIALLY-STALE** | 表还在 (`formations.ts:27-90`) 但**已不是默认路径**: `emergentPosOn()` 默认 true (`formations.ts:108-118`) ⇒ `formationSpot` 一进门就 return `emergentStation` (`:157`). 表今天只剩两个用途: OFF 档 A/B 基线 + 赛前形状图。移动者 = Phase B 涌现站位场 (blame `b7374305` / `328df4b0`, 2026-07-19/20 — 本条登记的**第二天**)。 |
| V02 | `formationSpot` 只在其上叠仿射变换 (随球 x 滑动 / 按基因缩放宽·深 / 模式位移 / 很弱的随球 y 拖拽) | §1 | 2026-07-19 | **PARTIALLY-STALE** | 仿射描述今天只对 legacy 分支为真 (`formations.ts:161-247`)。默认分支多出三个**非仿射**项: 基因加权的球侧整体平移 (`:325-327`)、对手线跟踪 (`:346-356`)、两两排斥 + 禁区拥挤解除 + 威胁下收缩 (`:357-397`)。 |
| V03 | ① 阵型不能自己变 — 形状是我们画的, 演化只是选一张表 + 缩放 | §1 | 2026-07-19 | **PARTIALLY-STALE** | 默认站位 = 角色→(depthFrac, laneFrac) 粗倾向 + 实时状态 + 基因 (`formations.ts:274-287`), **不再选表**。但角色倾向常数仍是手写数字, 且 `team.style.formationAtk/Def` 仍在, 仍驱动赛前形状图 ⇒ 移动了但没走完。 |
| V04 | ② 位置写死, 没有回撤接应 | §1 | 2026-07-19 | **PARTIALLY-STALE** | 「位置写死」这半已随 V03 移动。**「没有回撤接应」在每一个世界里都仍然成立**: `supportSpotDeformed` (`formations.ts:694-711`) 的 x 恒在球前; 能把人放到球后的深度轴 (`CTB_DEPTH_BIAS_SPAN`, `:617`) 由 `ctbSupportPlane` 门控, 而**没有任何世界 arm 它**。 |
| V05 | ③ 不随对手形状移动 (只跟球) | §1 | 2026-07-19 | **FIXED-SINCE** | B2 对手线跟踪已在库: `formations.ts:346-356` — 取对手第二深进攻者作 `holdLine`, 以 0.14 收敛。⚠ 范围: 仅无球、仅 DF/MF、仅当调用方传了 `opp` 引用 (executor / 盯人路径)。移动者 = Phase B2 (`b7374305`, 2026-07-19)。 |
| V06 | ④ 几乎没有强弱侧 | §1 | 2026-07-19 | **PARTIALLY-STALE** | 强弱侧在代码里已是**基因加权的真项**: `ballSideShift = 0.18 + (有球 attackingWidth·0.22 / 无球 defensiveCompactness·0.25)`, `y += ball.pos.y · ballSideShift` (`formations.ts:325-327`) ⇒ 球在 y=20 m 时是 3.6–8.6 m 的整体平移。⚠ 场上「读不读得出强侧」是**测量**问题, 本次普查零统计, 不下这个判。 |
| V07 | ⑤ "进化出的风格" 本质是选了我们哪张表 | §1 | 2026-07-19 | **PARTIALLY-STALE** | 同 V03 的证据。默认路径上风格不再是「选了哪张表」; 但 `team.style.formationAtk/Def` 作为身份字段仍在, 仍是 OFF 档与赛前图的形状来源。 |
| V08 | ⑥ 没有 "按价值站位 / 别扎堆" → 大巴队一堆人挤自己禁区, 防守贡献 0 | §1 | 2026-07-19 | **FIXED-SINCE** | B1-b 已在库 (`formations.ts:357-397`): 站位两两排斥 (9 m 半径, spread 2.6 按威胁缩放) + **显式禁区拥挤解除** (`if (team.localX(ball) > -20 && x < -HALF_L+BOX_DEPTH) x = -HALF_L+BOX_DEPTH+2`) + 威胁下的最后一线收缩。移动者 = Phase B1-b (`b7374305`, 2026-07-19)。 |
| V09 | 活阵型对账 ① 开局约定 = 有一半 (角色 = 最小约定 v3; 工作所有权 = A4 在建) | §1 活阵型解剖 | 2026-08-02 | **STILL-TRUE** | 「角色 = 最小约定」在出厂世界成立 (`formations.ts:274-287` 的 role switch)。「工作所有权 = 在建」也仍成立: A4 grant 管线是**探针专用** — `match.homeRegionGrant` 在任何生产路径上都是 null (`actionExecutor.ts:973-978`), `Match.stationEye` 除非某个 a4World 赋值否则为 null (`a4World.ts:1272`)。 |
| V10 | 对账 ② 互相补位 = 没有 (没人补空槽) | §1 | 2026-08-02 | **STILL-TRUE** | 已搜: `src/**` 的 vacancy / coverSlot / workOwner / grant 全部命中的只有探针席位。唯一的补位法仍是 index-1 rest-defence 钳位 (`formations.ts:293-297`) 与 chaser 计数 (`TeamBrain.ts:366+`)。**没有任何机制把空出来的站位重新指派给别人。** |
| V11 | 对账 ③ 线在动 = 被禁 (rest line 钳死 [−8, −16]) | §1 | 2026-08-02 | **STILL-TRUE** | `x = Math.min(x, -8 - (coverBias ?? 0.5)*8)` — 默认路径 `formations.ts:295`, legacy `:200`。唯一出口 `abandonRest` 是探针专用 (`PlayerBrain.ts:1855-1857`: `match.abandonRestDesignation` 生产恒 null)。 |
| V12 | 对账 ④ 形状整体动 = 有一半 (随球 x 滑动在; 强弱侧几乎没有) | §1 | 2026-08-02 | **PARTIALLY-STALE** | 「随球 x 滑动在」成立 (`formations.ts:289`)。「强弱侧几乎没有」这半在代码层已移动 — 见 V06。 |
| V13 | 对账 ⑤ 教练轮转 = 没有 | §1 | 2026-08-02 | **STILL-TRUE** | 已搜 `src/**` 的场上换位 / 轮转: 唯一的 `rotationBias` 读法是**赛间首发轮换** (`Match.ts:4557`, 阈值 0.25→0.75), 不是场上有序换位。 |
| V14 | 电池里的 dupRun / spacing 肢恰好就是撞车表 | §1 野球模型 | 2026-08-02 | **STILL-TRUE** | dupRun / spacing 肢仍在电池里 (`scripts/probes/pm-t1-compression-exam.ts`、`stage3-v4-p3p3-battery.ts`、`mt-t1-ruler-rerun.ts` 等)。 |
| V15 | P1b 实证: 深位基点先验独自看家, 显式任务法冗余且小亏 | §1 住址先验 | 2026-08-02 | **UNVERIFIABLE** | 这是一条**记录在案的测量**, 不是代码状态。已搜: `docs/world-model/A4-P1B-ABANDON-CENSUS.md` 载有该结论。重测需要一整组电池, 而本次普查零种子零统计 (#347 item 3 的范围) ⇒ 本仪器**不能**给它一个 STILL-TRUE。 |
| V16 | A4 住址已是球相对 (随球滑动) | §1 位置是活的 | 2026-08-08 | **STILL-TRUE** | `slide = clamp(ballLocalX * 0.3, -10, 10)`, 默认路径 `formations.ts:289-292`。 |
| V17 | 缺的不是 "跟球" 而是相位 / 形势调制 | §1 | 2026-08-08 | **PARTIALLY-STALE** | 相位/形势调制的**席位已建**: `pmLaneConvergenceK` (`formations.ts:334-338`, PM-T0 / #195.2) 与 MT 的到达时间 sag (`actionExecutor.ts:322-326`); 世界 4/5 arm `pmLaneConvergence` + `mtMarkSag` (`a4World.ts:356-357`)。⚠ 出厂世界仍无 — 基因出生为零。 |
| V18 | 弱侧后卫的 "乱转" 可能还叠加站位场振荡 (H-186a) | §1 | 2026-08-08 | **UNVERIFIABLE** | VISION.md 自己就把它标成**假设** (H-186a), 不是状态断言 ⇒ 按本普查 §0 的规矩不作为 claim 裁。已搜 `scripts/probes/` 无任何名为 186a 的探针。 |
| V19 | 盯人评分里不存在 "这个人跟球有没有关系" 这个因果变量 (任何基因组都绕不过去) | §1 盯不盯人 #200 | 2026-08-08 | **FIXED-SINCE** | MT 弧已把「跟球的关系」做成因果变量: `markDist += markSagWeight(g) * markSagMetres(ball.pos, mark.pos, p.pos, p.topSpeed)` (`actionExecutor.ts:322-326`) —— `markSagMetres` 就是**到达时间差**, 权重是一根基因。⚠ 基因出生为零, 只有世界 4/5 arm (`a4World.ts:357`); 出厂世界仍无。 |
| V20 | 同构先例已在库: 相位收拢基因 (PM-T0) · phase-41 的 pace-blind 对抗修正 | §1 | 2026-08-08 | **PARTIALLY-STALE** | 「相位收拢基因 (PM-T0)」证实在库 (`pmLaneConvergenceK`, `formations.ts:335`)。**「phase-41 的 pace-blind 对抗修正」查无实据**: 已搜 `src/**` 与 `docs/**` 的 pace-blind / paceBlind / 'pace blind', **零命中** (唯一命中是 VISION.md 自身与本文件) ⇒ 这个先例今天引不出来。 |
| V21 | sim 里 "有盯人" 不假, 假的是松紧写死 (1.2–2.6 米档, 与球权状态无关) | §1 #201 | 2026-08-08 | **PARTIALLY-STALE** | 「1.2–2.6 米档」精确成立: `markDist = 2.6 - markingAggression*1.4` (`actionExecutor.ts:297`)。「与球权状态无关」**登记时就已不准, 今天更不准**: 同一行 `ball.owner === mark ? 2.6` 就是持球者的 contain 特例, `:310-314` 是门将出球时的站位抬升, 再加 V19 的 MT sag。 |
| V22 | 底座里没有内切 / 包抄的 "动作" 原语 — 带球只会下底 | §1 长眼睛 | 2026-07-20 | **PARTIALLY-STALE** | `dribbleTarget` (`actionExecutor.ts:1361-1400`) 今天有**三种**手写转向: 脱压带球 `escapeCarry` (Phase 34.2)、下底 `wideDrive` (Phase 31)、朝门并绕开前方最近防守者。⇒「只会下底」这句措辞已不成立; **实质仍成立** —— 三种都是手写转向, 不是价值场, 内切/包抄仍不是原语。 |
| V23 | 只有一个写死的接应人 | §1 | 2026-07-20 | **PARTIALLY-STALE** | 今天每一个无球球员都自己给 `SupportBallCarrier` 打分 (`PlayerBrain.ts:1858-1867`), 各取各自 lane 的接应点 ⇒ **不存在「一个写死的接应人」**。缺的是这个接应点的形状 (见 V26/V61), 不是人数。 |
| V24 | maxed-genome 也变不出 ⇒ 底座缺陷, 非选择缺口 | §1 | 2026-07-20 | **STILL-TRUE** | 仍成立, 证据与 V04/V61 同: 几何里没有任何一根**已通电**的基因能到达缺失区域, 而能到达的那根没有世界 arm ⇒ 满基因组也变不出。 |
| V25 | "教练 × 球员" 的组合层已有一半 (W1 教练 + W2 球员个人风格 + per-team policy 基因) | §1 两层眼睛 | 2026-07-20 | **STILL-TRUE** | `team.policies` 是 per-index 的 `PolicyParams` (`Team.ts:39`, `:181`), 与队伍 genome 并存 ⇒ 教练 × 球员的组合层仍是「一半」。 |
| V26 | 球员进攻跑位这只眼睛最蠢 — `supportSpot` 永远朝前, 不回撤, 不包抄 | §1 | 2026-07-20 | **STILL-TRUE** | `formations.ts:707-710`: `ball.pos.x + team.attackDir * radius * (aheadBias + depthShift)`, `aheadBias ∈ {0.75, 0.35}`, `depthShift ≡ 0` 除非 `ctbSupportPlane` —— **没有世界 arm 它** ⇒ 每一个世界里接应点仍恒在球前。⚠ 行号已漂: `:604-618` → 函数在 `:644`, 算术在 `supportSpotDeformed` `:694-711`。 |
| V27 | 教练那只眼睛 (TeamBrain 的模式 / 派人 / 超载集体决策) 还比较手写 (阈值 + 规则) | §1 | 2026-07-20 | **STILL-TRUE** | `TeamBrain.ts:119-152` 仍是阈值选模式 (`pressScore > 0.62 ? 'Press' : 'Defend'` 等), `:169-231` 仍是 top-N 点名 runners / arriver / overlapper。 |
| V28 | 本节的 "价值场眼睛" 从没 ship 过 — live 的 `emergentStation` 是手调过渡态 | §1 尾 (SUBSTRATE-MAP 脚注) | ⊘ [2026-07-20] | **STILL-TRUE** | 仍无 ship 过的价值场眼睛。⚠ 但值得指挥官看一眼的限定: `emergentStation` 今天已远不止「滑动+缩放」(见 V02/V05/V08), 只是它仍是**建筑师写下的一串加法项**而非打分的价值场, 且各项权重一半是基因、一半是常数 (2.6 spread、0.14 hold-line、9 m 排斥半径)。 |
| V29 | 代码里无 `spaceValue` 符号 | §1 尾 | ⊘ [2026-07-20] | **STILL-TRUE** | 已搜: `grep -rn "spaceValue" src` → **零命中**。 |
| V30 | 节奏偏快的两个结构性贡献源 = 接球后时间维度缺失 + 踢球零前摇 (C7) | §2 节奏锚点 | 2026-07-27 | **PARTIALLY-STALE** | 「接球后时间维度缺失」这半仍立 (见 V54)。「踢球零前摇」**不再无条件成立**: C7 射门前摇 (`c7WindupTicks`, `Match.ts:173-179`) 与 O1 传球前摇已在库, 世界 2-11 arm `c7Windup` (`a4World.ts:300`), 世界 3+ arm `o1PassWindup` (`:340`)。⚠ 出厂世界仍是零前摇。 |
| V31 | tempo census 登记为船前 REALISM-LEDGER 测量项 (即: 已登记, 未建) | §2 | 2026-07-27 | **FIXED-SINCE** | `scripts/probes/tempo-census.ts` **已建**; 最近一次改动 2026-08-08「Tempo census #171 fix round: seven verify defects closed, smoke re-run」。 |
| V32 | 速度管线已存在 (sim 秒 / 真实秒 + 速度按钮), 现只有 ≥1× 快进档 | §2 | 2026-07-27 | **PARTIALLY-STALE** | sim 秒/真实秒管线仍在 (`GameApp.speed` / `setSpeed`, `GameApp.ts:1089-1095`)。**「速度按钮」不在了**: 1×/2×/8×/32× 那一排已在 29.1 移除 (`LeftPanel.ts:66-75`, blame 2026-07-07), 现在的 Match control 只有 ⏸ 与 ⏭ ⇒ 加一个 0.9× 体验档仍是小活, 但那是**新建一排控件**, 不是在现有档位上加一格。 |
| V33 | 踢球动画只有一个 one-shot (0.38 s), 不分传 / 射 / 弧线 / 力度 | §2 动作动画 | 2026-07-27 | **PARTIALLY-STALE** | 0.38 s 单一 one-shot 成立 (`AnimationSystem.ts:424`)。**「不分力度」这半登记时就已不准**: `kickPower` 按动作类别取值 —— Shoot/Clear = 1, ThroughBall/Cross/Loft = 0.85, 其余 = 0.65 (`AnimationSystem.ts:317-320`, blame 2026-07-06/07, **早于本条登记日**), 并驱动髋/膝幅度与前倾。弧线与盘带触球库仍不分。 |
| V34 | sim 早就发出可区分的数据 (curl/spin · 推球力度 · 射门 vs 传球事件) | §2 | 2026-07-27 | **STILL-TRUE** | `ball.spin` 由 `bentKick` 写入 (`mechanics.ts:338`), 推球长度由 `performDribbleTouch` 定价 (`:1471-1479`), 射门/传球是分开的事件 ⇒ 渲染端要分, 数据一直在。 |
| V35 | 密度相变 (0.70) 与 A4 约定都没治乱抢本体 (它们治的是扎堆与撞车) | §2 乱抢判词 | 2026-08-08 | **STILL-TRUE** | `FIELD_SCALE = positiveEnv('FIELD_SCALE') ?? LEGACY_PITCH_SCALE ?? 0.7` (`constants.ts:27`)。「治的是扎堆与撞车」这半是 #169 的判断的复述, 本次不重测。 |
| V36 | 拿住球 / 抬头 / 护球 这三个 "时间维度的座位" 仍然缺席 | §2 | 2026-08-08 | **PARTIALLY-STALE** | 三个座位**都已有银行里的席位**: 拿住球 = `ShieldHold` + C5 whether 席 (`PlayerBrain.ts:1298-1340`)、抬头 = O2 look (`:1268-1288`)、护球 = `c6Carry`。⚠ **没有一个在任何世界里够得着**: `whetherEye` / `o2Look` 无世界 arm; 即使世界 2-11 arm 了 `c5Hold`, 它的搭档 `forcedHold` 在生产里从不被设置 (`Match.ts:2960-2976`)。 |
| V37 | 现有电池全是 A/B 相对尺, 两臂同病则永远无门可响 | §2 | 2026-08-08 | **PARTIALLY-STALE** | 见 V38 —— 两把绝对尺已经建起来了。 |
| V38 | 绝对尺 (tempo / possession census: 控球段长 · 每次控球触球数 · 每分钟事件率) 已登记未建 | §2 | 2026-08-08 | **FIXED-SINCE** | **已建**: `scripts/probes/tempo-census.ts` (2026-08-08) 与 `scripts/probes/r9-possession-chain-ledger.ts` (2026-08-19, #314 item 3 的 R9 freeze)。 |
| V39 | Phase-31 把看家钉给 index-1 | §3.1 rest defence | 2026-08-02 | **STILL-TRUE** | `p.index === 1 && p.role !== 'GK'` —— 默认路径 `formations.ts:293`, legacy `:195`, 无球侧 `PlayerBrain.ts:1855`。#348 自己的世界 10/11 说明也把这个 cap 记作 INTACT。 |
| V40 | Phase-88 的 coverBias 只给了 [−8, −16] 的深停窄带 | §3.1 | 2026-08-02 | **STILL-TRUE** | `Math.min(x, -8 - coverBias*8)`, coverBias ∈ [0,1] ⇒ 钳位天花板 ∈ [-16, -8] (`formations.ts:295`)。 |
| V41 | 中圈级 rest line 被底座对所有基因组禁止 | §3.1 | 2026-08-02 | **STILL-TRUE** | 同上那一行; 唯一绕过是探针专用的 `abandonRest` ⇒ 中圈级 rest line 对所有基因组仍被禁。 |
| V42 | 越位陷阱基因 trapBias (Phase 109) 在库, 是它的天然搭档 | §3.1 | 2026-08-02 | **STILL-TRUE** | `genome.trapBias` 在库, 且已长出可见的一面 (Phase 115 的 trap 铭牌读法, `Match.ts:4451`)。 |
| V43 | Phase 36 的推球已把 "高速 + 开阔" 做成真触球 (球变自由体 · 追球再收 · 对手有捅球窗口 · 推距按前方空间连续定价) | §3.1 球-脚界面 | 2026-07-26 | **STILL-TRUE** | `performDribbleTouch` (`mechanics.ts:1447-1506`): `ball.owner = null` 真放开、自由体积分、`TOUCH_RECOLLECT_*` 追球再收窗口、`push = (TOUCH_PUSH_BASE + open*TOUCH_PUSH_SPACE)*…` 由 70° 前锥的空档连续定价。 |
| V44 | 仍在胶水上的是转身 — 球随身体绕轴扫, `Match.ts:1265`, 转身期间球不可被攻击 | §3.1 | 2026-07-26 | **PARTIALLY-STALE** | **实质成立**: 持球期间球仍挂在持球人 heading 前方 (`Match.ts:3915-3940`)。**⚠ 行号已死**: `Match.ts:1265` 今天是 CB carry-beat 台账, 与转身无关 —— 引用会把下一个读者送错地方。 |
| V45 | 仍在胶水上的是低速 (< 2.5 m/s 门, 走路带球 = 定义上的完美近控) | §3.1 | 2026-07-26 | **STILL-TRUE** | `o.vel.x*o.vel.x + o.vel.y*o.vel.y > 2.5*2.5` (`Match.ts:3902`) —— 走路带球仍是定义上的完美近控。 |
| V46 | 仍在胶水上的是受压 (对手贴近时推球被抑制) | §3.1 | 2026-07-26 | **STILL-TRUE** | 推球只在 `nearOpp > TOUCH_CONTROL_DIST` 时才触发 (`Match.ts:3904-3911`) ⇒ 对手贴近即抑制。 |
| V47 | 已注册为 PROGRAMME Track C 的 C6 | §3.1 | 2026-07-26 | **PARTIALLY-STALE** | C6 已不只是「注册」: `c6Carry` 是真旗标 (`Match.ts:1361`), 世界 2-11 arm 它 (`a4World.ts:299`); CB 弧的定向捅球 (`performTouchPast`, `mechanics.ts:1509+`; `carryBeat.ts`; `carryChoiceSeat.ts`) 已入库, 世界 6 arm 选择席。 |
| V48 | 模拟层踢球 = 决定即出球, 前摇为零 | §3.1 前后摇 | 2026-07-26 | **PARTIALLY-STALE** | 出厂世界仍成立。世界 2-11 不成立: `c7Windup` armed ⇒ `pendingKick = { readyTick: stepCount + wTicks + bkTicks }` (`Match.ts:3664-3674`) —— 决定与出球之间有真实 tick。 |
| V49 | 后摇有粗糙版: `kickCooldown` 0.3–0.5 s 出脚锁 | §3.1 | 2026-07-26 | **PARTIALLY-STALE** | 后摇仍在, 但**已不是 0.3–0.5 的档**, 而是**一个常数**: `KICK_COOLDOWN = 0.45` (`constants.ts:282`)。其余写入是情境性的 (犯规受害者 0.4 `Match.ts:4407`; 0.3 `:5371`; `CONTACT_COMMIT_TIME` `:5284`), 带球再收窗口则按推球长度缩放 (`mechanics.ts:1503`)。 |
| V50 | 渲染层摆腿动画存在 (0.38 s 一次性 · 会选脚) 但事后触发 — 球已飞出腿才摆 | §3.1 | 2026-07-26 | **STILL-TRUE** | `AnimationSystem.ts:314-321` 在**进入** kick 状态那一帧触发, `kickSlot = lateralSlot(...)` 选脚, `:424` 是 0.38 s 的时钟 ⇒ 仍是事后触发的一次性摆腿。 |
| V51 | 精度 / 力度那一半已经全场存在 — 传球 / 传中 / 射门 / 解围都过 `kickMisalignment` (`mechanics.ts:77`) | §3.1 拧身传球 | 2026-07-27 | **PARTIALLY-STALE** | **实质成立**: 定义在 `mechanics.ts:79`, 被传球 (`:365`)、直塞 (`:464`)、高球/传中/解围 (`:534`) 与射门经济 (`PlayerBrain.ts:352`, `:1068`) 全线消费。**⚠ 行号漂了 2 行** (`:77` → `:79`)。 |
| V52 | 缺的是时间半 (C7 准备延迟公式里的 bodyOrientationTerm) | §3.1 | 2026-07-27 | **FIXED-SINCE** | BK-T0 的**朝向法**就是这个 bodyOrientationTerm: `bkNoteFacing` 返回 `max(0, turnTicks - BK_CONE_TICKS)`, 其中 `turnTicks = ceil(θ/(TURN_RATE*DT))` 由 heading→出球方向量出 (`mechanics.ts:199-227`), 直接加进 `readyTick` (`Match.ts:3669-3671`)。⚠ 只有世界 9/10/11 arm; 出厂世界既无前摇也无朝向法。⚠ 另: C7 自己的 W 里那一项是**角速度** (`C7_W_TURN*ω/TURN_RATE`, `Match.ts:174-175`), **不是**朝向偏差, 两者不可混。 |
| V53 | 缺的是动画半 (看得见的拧身出脚 = F9 的一项) | §3.1 | 2026-07-27 | **STILL-TRUE** | 已搜 `AnimationSystem.ts` / `PlayerModel.ts`: 踢球 one-shot 只读 `kickPower` 与 `kickSlot`, **没有任何拧身/躯干扭转分支** ⇒ 动画半仍缺。 |
| V54 | action 层每个决策 tick 只在 "传 / 带 / 射" 里挑 — "等" 不是一个有价值的动作 | §3.1 接球后时间维度 | 2026-07-26 | **PARTIALLY-STALE** | `ShieldHold` 已是真动作类型, C5 whether 席按本体自己的 percept 给 hold 定价 (`PlayerBrain.ts:1298-1340`)。⚠ **在任何世界里都够不着**: `whetherEye` 无世界 arm, `forcedHold` 生产恒 null ⇒ 玩家看到的世界里「等」仍不是有价值的动作。 |
| V55 | 两个 REPORTED 计数器已登记: 传给越位球员的比率 · 回传被中途拦截的比率 | §3.1 | 2026-07-26 | **STILL-TRUE** | 作为**登记**仍成立, 且两个计数器**仍未建**。已搜: `src/**`、`scripts/**`、`docs/**` 的 传给越位 / offsidePass / offside receiver / backpass-intercepted —— 唯一命中是 VISION.md 与本文件。 |
| V56 | 已有仪器测得 80.8 % 的公开接球被压迫 | §3.1 build-up #213 | 2026-08-09 | **UNVERIFIABLE** | 记录在案的测量。已搜: 该数字载于 `BK-C0-BODYBALL-CENSUS.md` / `C4-T1-FLIGHT.md` / `C4-T2-ARRIVAL.md`。重测需电池, 本普查零种子零统计。 |
| V57 | 已有仪器测得控球回合 4.4 秒 (现实 9.6–10.4) | §3.1 | 2026-08-09 | **UNVERIFIABLE** | 同上。已搜: 载于 `A4-P1-VACANCY-CENSUS.md` / `A4-P1B-ABANDON-CENSUS.md` / `A4-P1C-FORENSICS.md`。 |
| V58 | 后场倒脚 = chooser 只定价 "接得稳" 不定价 "值多少" → 安全回收 | §3.1 | 2026-08-09 | **PARTIALLY-STALE** | 「值多少」那一半的席位已建: `src/ai/deliveryValueSeat.ts` + `dvDeliveryValue` 旗标 (`Match.ts:1606`), 消费点在 `PlayerBrain.ts:639-641`。⚠ **无世界 arm** ⇒ 出厂 chooser 仍只定价「接得稳」。 |
| V59 | `supportSpot` (formations.ts:604-618) 的 x 项恒为球前方 (手写模式三元 0.75 / 0.35, 无基因) | §3.1 回撤接应 #223 | 2026-08-10 | **PARTIALLY-STALE** | **实质在每个世界里都成立** (见 V26)。**基因已经存在**: `ctbSupportDepthWeight` × `CTB_DEPTH_BIAS_SPAN` (`formations.ts:617-658`) —— 但无世界 arm `ctbSupportPlane`。**⚠ 行号已死**: `:604-618` → 函数 `:644`, 算术 `supportSpotDeformed` `:694-711`。 |
| V60 | 横向扇面由硬常数 (0.75 拉力 / 0.9 封顶) 拉向阵型 lane | §3.1 | 2026-08-10 | **STILL-TRUE** | 两个常数仍在, 且**已被命名**: `SUPPORT_LAT_PULL = 0.75` / `SUPPORT_LAT_CAP_FRAC = 0.9` (`formations.ts:597-598`), 消费于 `:708-709` (CTB-T0 的纯代码搬运, #223)。 |
| V61 | 整个可进化基因空间不存在任何表达能把接应人放到球的侧后方 — 回撤不是被权重埋没, 是维度不存在 | §3.1 | 2026-08-10 | **PARTIALLY-STALE** | **在代码库里已经存在**: 满负剂量的 CTB 深度基因把 aheadBias 推到 `0.75 - 0.9 = -0.15`, 即球的**侧后方**可表达 (`formations.ts:617-635` 的推导写死在注释里)。**在任何玩家或赛季够得着的世界里仍不存在** —— 无世界 arm `ctbSupportPlane`。⇒ 「维度不存在」应读作「维度未通电」。 |
| V62 | Phase 30.5 铁证: 短选项消失 → 中性基因组进球 1.47 → 0.93 | §3.1 | 2026-08-10 | **UNVERIFIABLE** | 记录在案的测量。已搜: 该数字同时写在 `supportSpot` 自己的文档块里 (`formations.ts:632-643`) 与 `A4-P3-FRONTIER-BATTERY.md`。重测需电池。 |
| V63 | 今天无球进攻决策 (PlayerBrain.ts:1226-1298) 零感知输入 — SupportBallCarrier 只读真值距离 + 手写角色 / 模式常数 | §3.1 前插与回撤 #227 | 2026-08-10 | **PARTIALLY-STALE** | **出厂世界实质成立**: `SupportBallCarrier` 仍按真值距离 + 角色加成 + 模式常数打分 (`PlayerBrain.ts:1858-1867`)。缺的感知输入 = OBM 眼睛席 (`obmOffballPolicy`, `:1822-1829`), **无世界 arm**。**⚠ 行号已死**: `:1226-1298` 今天是持球 chooser 的 O2/C5 分叉; `decideOffBall` 起于 `:1792`。 |
| V64 | 前插 (MakeRun) 不是球员的选择, 是 TeamBrain 自上而下的执照 (`team.runners` / overlapper / arriver 点名) | §3.1 | 2026-08-10 | **STILL-TRUE** | `team.runners.has(p.index)` / `team.arriver` / `team.overlapper` 仍是唯一的前插入口 (`PlayerBrain.ts:1887-1919`), 由 `TeamBrain.ts:169-231` 自上而下点名。 |
| V65 | 防守有 station eye, 进攻无球侧没有眼睛 | §3.1 | 2026-08-10 | **PARTIALLY-STALE** | 进攻侧的眼睛**已建**: `src/ai/offballEyes.ts`。⚠ 两只眼今天**都不在出厂世界里**: `Match.stationEye` 除非 a4World 赋值否则为 null (`a4World.ts:1272`), `obmMovement` 无世界 arm ⇒ 「防守有眼睛、进攻没有」这个**不对称**本身已经过时, 现状是两侧都关着。 |
| V66 | 普查: 感知 / 身体 / 持球技术 / 防守 / 进化通道 ✅ 齐; 缺的一层全是关系性的 | §3.1 关系性底座 #231 | 2026-08-11 | **UNVERIFIABLE** | 这是一条**普查结论** (#231), 不是可以靠重读代码复核的状态断言 —— 重做它是另一台仪器。本轮**能**复核的是它点名的两个关系性洞: 见 V67 / V68。 |
| V67 | (PlayerBrain.ts:395-500) 领跑定价 (runBurstPoint, "meet the run") 只给 `MakeRun` 执照持有者 | §3.1 | 2026-08-11 | **PARTIALLY-STALE** | **实质在每个世界里都成立**: 直塞候选环仍要求 `mate.action.type === 'MakeRun'` (`PlayerBrain.ts:865`) 才轮到 `runBurstPoint` 定价领跑 (`:870`)。**⚠ 行号已死**: `:395-500` 今天是任意球/传球候选表的头部; 被引的机器在 `:860-875`。 |
| V68 | `SupportBallCarrier` (含 OBM 席位驱动的全部移动) 永远被传到脚下当前站位, 进不了 through-ball 候选 | §3.1 | 2026-08-11 | **PARTIALLY-STALE** | 实质在每个世界里成立 (V67 的那道门)。PTP / DLC 席位已把**领跑候选放进普通传球环** (`ptpPassLead` / `dlcDeliveryChoice` / `dlcStrikePlane`, `PlayerBrain.ts:440-458`, `:709-778`) —— **无世界 arm**。 |
| V69 | 出球物理已齐 (ground bender 弧线 / Phase 71 · 高球自带提前量 · 直塞) | §3.1 出球方式 #235 | 2026-08-11 | **STILL-TRUE** | `groundBend` / `bentKick` (`mechanics.ts:289-338`)、`performLoftedPass` / `performThroughBall` (`Match.ts:3207-3217`) 全在。 |
| V70 | bender 是 "被封线就自动加旋" 的规则, 不是选择 | §3.1 | 2026-08-11 | **STILL-TRUE** | `groundBend` 由「有没有防守者掐住传球线」直接算出旋转, 注释自陈「Nobody in the lane = no spin」(`mechanics.ts:279-300`) —— **没有任何 chooser 读它** ⇒ 仍是规则不是选择。 |
| V71 | 高球被 24 m 手写门槛隔离 | §3.1 | 2026-08-11 | **STILL-TRUE** | `if (d > 24 && !layingOff)` (`PlayerBrain.ts:727`)。 |
| V72 | 提前量是基因档位 (统一档位强制每一脚球领跑) | §3.1 | 2026-08-11 | **PARTIALLY-STALE** | DLC 席今天是**两点竞价**而非强制剂量 (`ledDelivery` 与到脚同台, `PlayerBrain.ts:709-712` —— #240 自己的修复), 连续形态则是击球平面席 (`:778`)。⚠ 无世界 arm ⇒ 出厂世界里根本没有领跑剂量这回事。 |
| V73 | DLC 竞价的候选集是离散化残留 — {脚下, 全量投影点} 两个点进 argmax | §3.1 落点连续 #240 | 2026-08-11 | **PARTIALLY-STALE** | **代码层已被取代**: 击球平面席 `spSeat` (`PlayerBrain.ts:450-458`, `:778`) 采样击球参数点。⚠ 注意它自己的守卫 `spSeat !== null && dlcSeat === null && ptpSeat === null` —— 两点竞价 armed 时不形成网格。⚠ 无世界 arm。 |
| V74 | 引擎的击球空间早已存在 — Ball 自带 z / vz / spin, 高球抛物线 · bender 逐帧弧线拦截全是现成力学 | §3.1 击球参数空间 #241 | 2026-08-11 | **STILL-TRUE** | Ball 自带 z/vz/spin; 高球抛物线与 bender 的逐帧弧线拦截都是现成力学 (`mechanics.ts:326-338`, `Match.ts:3207-3217`)。 |
| V75 | 但被三个手写动作各自绑死一小块 (地面传 / 高球 / 弧线各带写死参数) | §3.1 | 2026-08-11 | **PARTIALLY-STALE** | 统一采样器已在库 (`strikePlaneSeatOf`, 见 V73), 三个手写动作仍是出厂路径。⚠ 无世界 arm。 |
| V76 | 地图对账 (a) 风险侧近乎空白 — 无飞行拦截项, 无失球位置代价 | §3.1 地图对账 #245 | 2026-08-12 | **PARTIALLY-STALE** | 两条肢都已建进 `src/ai/deliveryValueSeat.ts` 并在 `PlayerBrain.ts:639-641` 消费 (飞行暴露 + 失球位置信念图)。⚠ 无世界 arm。⚠ 一个**已通电的邻居**别混淆: 世界 11 的 `bkCorridorPrice` 给门将开球的走廊定价 (`PlayerBrain.ts:1209-1210`) —— 同族的另一条肢, 不是这一条。 |
| V77 | 普查测得 ~31 % 进球来自后场丢球 10 秒内 | §3.1 | 2026-08-12 | **UNVERIFIABLE** | 记录在案的测量。已搜: 载于 `C5-T1-WAITING-CENSUS.md` / `C5-T0-HOLD-MECHANICS.md` / `C7-T0-SHOT-RELEASE.md`。重测需电池。 |
| V78 | 地图对账 (b) 价值侧是线性距离 (真实位置价值非线性) | §3.1 | 2026-08-12 | **STILL-TRUE** | 已搜出厂 chooser 的传球定价: 位置价值仍是线性距离项, 唯一的非线性价值机器是休眠的 DV 信念图 ⇒ 出厂世界仍成立。 |
| V79 | 地图对账 (c) 收球侧上下文缺失 — ~82 % 首次接球受压, chooser 看不见 | §3.1 | 2026-08-12 | **PARTIALLY-STALE** | ~82 % 这个**数字**本轮 UNVERIFIABLE (记录在案的测量, 载于 `C5-T0-HOLD-MECHANICS.md` / `C6-T2-MATCH-AB.md` / `C7-T2-MATCH-AB.md`)。**代码那一半仍成立**: 出厂 chooser 看不见收球方的受压上下文。⚠ 相邻但不同的一条: `edsValueAxis` 在世界 2-11 已 arm (`a4World.ts:297`) —— 那是 chooser 的**测量价值半**, 不是收球上下文。 |
| V80 | 故意的街机偏离: 越位 → 门球 (不是任意球) | §3 尾 | ⊘ (memory) | **STILL-TRUE** | `callOffside` → `awardRestart('goalKick', defSide, …)` + `restart.offside = true` (`Match.ts:4442-4458`) —— 仍是门球, 不是任意球。 |
| V81 | 故意的街机偏离: 禁区内持球门将解围清空 · 门球适用越位 | §3 尾 | ⊘ (memory) | **STILL-TRUE** | 门将持球清空禁区在 `Match.ts:3972-3982`, 代码自陈「same deliberate calm-reset simplification as the offside goal kick」; 门球的禁区清空在 `:4705-4710` ⇒ 两条街机取舍都仍是**故意的**, 别修。 |
| V82 | 对照数据库 `efootball_engine_research_for_evofootball.md` 在库 | §3 | 2026-07-26 | **STILL-TRUE** | `docs/efootball_engine_research_for_evofootball.md` 在库。 |
| V83 | squad 点数预算 ✅ 已上线 (SQUAD_BUDGET) | §4 | ⊘ [2026-07-14] | **STILL-TRUE** | `SQUAD_BUDGET` 由 `evolution/genome` 导出并被俱乐部页消费 (`ClubsScreen.ts:185-196`, 预算条 + 超支变色)。 |
| V84 | 全门 = vitest · visual-debug ×2 · calibrate · goals-warming · fingerprint 重刷 | §6 | ⊘ | **STILL-TRUE** | `package.json` scripts: `test` (vitest) · `debug:visual` + `debug:visual3d` (= visual-debug ×2) · `calibrate` · `fingerprint`; goals-warming = `scripts/probes/goals-warming.ts`。五道门齐。 |

**INVENTORY TOTAL: 84 claims.** Frozen at this commit; the verdict column is
written in COMMIT 2 and the claim column is not re-cut after sight.

## §2 THE TALLY

| VERDICT | COUNT | ROWS |
|---|---|---|
| **STILL-TRUE** | **36** | V09 V10 V11 V13 V14 V16 V24 V25 V26 V27 V28 V29 V34 V35 V39 V40 V41 V42 V43 V45 V46 V50 V53 V55 V60 V64 V69 V70 V71 V74 V78 V80 V81 V82 V83 V84 |
| **PARTIALLY-STALE** | **35** | V01 V02 V03 V04 V06 V07 V12 V17 V20 V21 V22 V23 V30 V32 V33 V36 V37 V44 V47 V48 V49 V51 V54 V58 V59 V61 V63 V65 V67 V68 V72 V73 V75 V76 V79 |
| **FIXED-SINCE** | **6** | V05 V08 V19 V31 V38 V52 |
| **UNVERIFIABLE** | **7** | V15 V18 V56 V57 V62 V66 V77 |
| TOTAL | **84** | |

Every UNVERIFIABLE row is one of two kinds and says which: a **measurement of
record** (V15 V56 V57 V62 V77 — re-measuring needs a battery and this census is
zero-seed / zero-stats by dispatch), or a **claim VISION.md itself labels as
something other than a state assertion** (V18 = a 假设; V66 = a census
conclusion). Zero rows are UNVERIFIABLE because the search was skipped.

## §3 人话 SUMMARY — 这份金标准今天还准不准

**84 条带日期的现状断言, 36 条今天原样成立, 35 条走了一半, 6 条已经修掉, 7 条这台
仪器不该下判。**

**⭐ 最重要的一件事, 一句话讲完:** 这份文件里"走了一半"的那 35 条, 绝大多数走的是
**同一半** —— **东西已经在代码库里造好了, 但没有任何一个世界把它打开。** 从 2026-08-10
起的整条进攻线 (回撤接应 CTB · 无球移动 OBM · 传球到路 PTP · 出球菜单 DLC · 出球价值
DV) 全部是**建好了、烧进仓库、一个世界都没 arm** 的状态 —— 出厂世界没有, 十一个试玩
世界也都没有 (实测: `a4World.ts` 里 `ctbSupportPlane` / `obmMovement` / `ptpPassLead` /
`dlcDeliveryChoice` / `dlcStrikePlane` / `dvDeliveryValue` / `o2Look` / `whetherEye` **零
出现**)。**所以对玩家的眼睛而言, 这些条目一个字都没过期**; 过期的只是"底座里连这个
维度都不存在"这个说法 —— 今天该说"维度已经造好, 还没通电"。这两句话在派单时会导向
完全不同的下一步, 值得分开。

**三条最要紧的过期发现:**

1. **§1 的头号活体违规, 那段 2026-07-19 的「现状(对代码属实)」, 在写下的第二天就被
   代码超过了。** 阵型的默认路径**早就不是那些手画的坐标表** —— `emergentPosOn()` 默认
   为真, 走的是 `emergentStation` (角色粗倾向 + 实时状态 + 基因)。六条后果里, ③"不随
   对手形状移动"和⑥"没有别扎堆/按价值站位"是**实打实修掉了**的 (对手线跟踪
   `formations.ts:346-356` · 两两排斥 + 禁区拥挤解除 `:357-397`), ④"几乎没有强弱侧"
   在代码里也已经是一根基因加权的真项。⚠ 但**"位置本身必须涌现"这条要求本身没有过期**:
   角色倾向那几个数字仍是我们手写的, 而 §1 更晚一条 (2026-08-02) 记的"强弱侧几乎没有"
   是**测量读数**, 与代码里有这个项并不矛盾 —— 要判它得重测, 本轮不判。

2. **有三条"缺的是时间半 / 缺的是这个变量"已经被后来的弧修掉了, 但金标准里还写着"缺"。**
   ① V52 拧身传球的时间半 = BK-T0 的**朝向法**, `max(0, turnTicks − BK_CONE_TICKS)`
   (`mechanics.ts:199-227` → `Match.ts:3669-3671`), 世界 9/10/11 已 arm; ② V19 盯人评分
   里"这个人跟球有没有关系"这个因果变量 = MT 的**到达时间 sag** (`actionExecutor.ts:322-326`),
   世界 4/5 已 arm; ③ V31/V38 那把"已登记未建"的**绝对尺** —— `tempo-census.ts` 2026-08-08
   就建好了, R9 控球链台账 2026-08-19 也建好了。这三条今天照着 VISION 派单会重复造轮子。

3. **五个 `file:line` 引用已经死了, 其中三个指到了完全不相干的代码。** `Match.ts:1265`
   (本该是转身胶水, 现在是 CB carry-beat 台账) · `PlayerBrain.ts:1226-1298` (本该是无球
   决策, 现在是持球 chooser 的 O2/C5 分叉; `decideOffBall` 在 `:1792`) ·
   `PlayerBrain.ts:395-500` (本该是领跑定价, 现在是任意球候选表头; 机器在 `:860-875`) ·
   `formations.ts:604-618` (`supportSpot` 现在在 `:644`, 算术搬到了 `supportSpotDeformed`
   `:694-711`) · `mechanics.ts:77` (漂了 2 行, 现在 `:79`)。**这五条的实质结论全都还
   成立** —— 死的只是地址。派单时凭这些行号打开文件的人会读到错的东西。

**几件小的、但会误导人的:**

* V32 「速度按钮」那句: sim 秒/真实秒管线还在, 但 **1×/2×/8×/32× 那一排按钮 2026-07-07
  就被删了** (`LeftPanel.ts:66-75`), 现在只有 ⏸ 和 ⏭。加 0.9× 体验档仍然是小活, 但那是
  **新建一排控件**, 不是在现有档位上加一格。
* V33 「不分力度」和 V21 「与球权状态无关」**在登记那天就已经不准了** (`kickPower` 按动作
  类别分三档, blame 2026-07-06/07; `ball.owner === mark ? 2.6` 的 contain 特例一直都在)。
  两条都不是后来漂的, 是当时就抄快了一步。
* V20 里 「phase-41 的 pace-blind 对抗修正」这个先例, **今天在 `src/**` 和 `docs/**` 里
  都搜不到** (唯一命中是 VISION.md 自己)。它作为"同构先例"引不出来了。
* V65 「防守有 station eye, 进攻无球侧没有眼睛」这个**不对称本身**过期了: `offballEyes.ts`
  已经建好, 而 `stationEye` 在出厂世界里也是 null —— 现状是**两只眼都关着**, 不是一只
  开一只关。
* V80/V81 两条**故意的街机偏离仍然故意** (`Match.ts:4442-4458` / `:3972-3982`, 代码注释
  自己就把它叫做 deliberate calm-reset simplification) —— 别"修"回去。

**这份审计没有做、也不该由它做的事:** 它不建议任何东西, 不设任何门槛, 不碰
VISION.md 的一个字 (除了两行指针), 也不替用户决定那个三分拆分 (#347 item 1: 拆不拆是
用户的事)。

## §HOW-TO-RE-RUN

这台仪器是纯读取的, 任何 session 都能重跑一遍, 不需要种子、不需要统计、不碰 `src/**`。

1. **重取清单**: 通读 `docs/VISION.md` 全文, 把每一处「现状」/「代码核实的现状」/
   「现状对账」/ 带日期且断言代码或世界状态的句子各记一行。⛔ 用户的 blockquote 原话
   **不进清单** (§0 第 4 条)。清单**先 commit**, 再开始验证 (freeze-then-classify;
   否则清单会围着你查到的东西长)。
2. **每条按三层查**:
   (a) **符号还在不在** —— `grep -rn "<符号>" src`;
   (b) **行号还准不准** —— 打开被引的 `file:line`, 看那里是不是被引的东西 (§0 第 6 条);
   (c) ⭐ **哪个世界打开了它** —— 这一步最容易漏。`grep -n "<flag>" src/game/a4World.ts`:
   零命中 = 这个席位**任何世界都够不着**, 无论代码写得多完整。出厂世界是
   `?a4world=0`; 十一个试玩世界的 arming 表在 `a4World.ts` 顶部的世界注释块里。
3. **判词四选一**, 规则见 §0 第 2 条。⚠ 记录在案的**测量**一律 UNVERIFIABLE 并写清
   已搜到哪份 artifact —— 不要拿代码去"确认"一个统计结论。
4. **重跑周期**: 建议每关掉一条大弧 (一个 entry rung 落地 / 一个 contract 收官) 后跑一次
   §2 的 tally, 而不是等下一次 VISION 改动。本轮的机制教训是: **金标准的现状快照会
   被自己文档里更晚的弧超过, 而超过它的那些提交不会回来改这份文件。**
5. **本轮基线**: 2026-08-26, HEAD `8a582f7` (#348 落地后), 84 条 / 36 STILL-TRUE /
   35 PARTIALLY-STALE / 6 FIXED-SINCE / 7 UNVERIFIABLE。
