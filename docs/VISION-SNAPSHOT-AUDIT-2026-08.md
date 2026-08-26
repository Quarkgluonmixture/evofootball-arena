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

* **COMMIT 1 (this one) = THE INVENTORY (the freeze half).** §1's table is
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
| V01 | 阵型 = 一组手写的固定坐标表 (wide-212 / narrow-122 / … / low-32 / …) | §1 头号活体违规 | 2026-07-19 | — NOT YET WRITTEN — | — |
| V02 | `formationSpot` 只在其上叠仿射变换 (随球 x 滑动 / 按基因缩放宽·深 / 模式位移 / 很弱的随球 y 拖拽) | §1 | 2026-07-19 | — NOT YET WRITTEN — | — |
| V03 | ① 阵型不能自己变 — 形状是我们画的, 演化只是选一张表 + 缩放 | §1 | 2026-07-19 | — NOT YET WRITTEN — | — |
| V04 | ② 位置写死, 没有回撤接应 | §1 | 2026-07-19 | — NOT YET WRITTEN — | — |
| V05 | ③ 不随对手形状移动 (只跟球) | §1 | 2026-07-19 | — NOT YET WRITTEN — | — |
| V06 | ④ 几乎没有强弱侧 | §1 | 2026-07-19 | — NOT YET WRITTEN — | — |
| V07 | ⑤ "进化出的风格" 本质是选了我们哪张表 | §1 | 2026-07-19 | — NOT YET WRITTEN — | — |
| V08 | ⑥ 没有 "按价值站位 / 别扎堆" → 大巴队一堆人挤自己禁区, 防守贡献 0 | §1 | 2026-07-19 | — NOT YET WRITTEN — | — |
| V09 | 活阵型对账 ① 开局约定 = 有一半 (角色 = 最小约定 v3; 工作所有权 = A4 在建) | §1 活阵型解剖 | 2026-08-02 | — NOT YET WRITTEN — | — |
| V10 | 对账 ② 互相补位 = 没有 (没人补空槽) | §1 | 2026-08-02 | — NOT YET WRITTEN — | — |
| V11 | 对账 ③ 线在动 = 被禁 (rest line 钳死 [−8, −16]) | §1 | 2026-08-02 | — NOT YET WRITTEN — | — |
| V12 | 对账 ④ 形状整体动 = 有一半 (随球 x 滑动在; 强弱侧几乎没有) | §1 | 2026-08-02 | — NOT YET WRITTEN — | — |
| V13 | 对账 ⑤ 教练轮转 = 没有 | §1 | 2026-08-02 | — NOT YET WRITTEN — | — |
| V14 | 电池里的 dupRun / spacing 肢恰好就是撞车表 | §1 野球模型 | 2026-08-02 | — NOT YET WRITTEN — | — |
| V15 | P1b 实证: 深位基点先验独自看家, 显式任务法冗余且小亏 | §1 住址先验 | 2026-08-02 | — NOT YET WRITTEN — | — |
| V16 | A4 住址已是球相对 (随球滑动) | §1 位置是活的 | 2026-08-08 | — NOT YET WRITTEN — | — |
| V17 | 缺的不是 "跟球" 而是相位 / 形势调制 | §1 | 2026-08-08 | — NOT YET WRITTEN — | — |
| V18 | 弱侧后卫的 "乱转" 可能还叠加站位场振荡 (H-186a) | §1 | 2026-08-08 | — NOT YET WRITTEN — | — |
| V19 | 盯人评分里不存在 "这个人跟球有没有关系" 这个因果变量 (任何基因组都绕不过去) | §1 盯不盯人 #200 | 2026-08-08 | — NOT YET WRITTEN — | — |
| V20 | 同构先例已在库: 相位收拢基因 (PM-T0) · phase-41 的 pace-blind 对抗修正 | §1 | 2026-08-08 | — NOT YET WRITTEN — | — |
| V21 | sim 里 "有盯人" 不假, 假的是松紧写死 (1.2–2.6 米档, 与球权状态无关) | §1 #201 | 2026-08-08 | — NOT YET WRITTEN — | — |
| V22 | 底座里没有内切 / 包抄的 "动作" 原语 — 带球只会下底 | §1 长眼睛 | 2026-07-20 | — NOT YET WRITTEN — | — |
| V23 | 只有一个写死的接应人 | §1 | 2026-07-20 | — NOT YET WRITTEN — | — |
| V24 | maxed-genome 也变不出 ⇒ 底座缺陷, 非选择缺口 | §1 | 2026-07-20 | — NOT YET WRITTEN — | — |
| V25 | "教练 × 球员" 的组合层已有一半 (W1 教练 + W2 球员个人风格 + per-team policy 基因) | §1 两层眼睛 | 2026-07-20 | — NOT YET WRITTEN — | — |
| V26 | 球员进攻跑位这只眼睛最蠢 — `supportSpot` 永远朝前, 不回撤, 不包抄 | §1 | 2026-07-20 | — NOT YET WRITTEN — | — |
| V27 | 教练那只眼睛 (TeamBrain 的模式 / 派人 / 超载集体决策) 还比较手写 (阈值 + 规则) | §1 | 2026-07-20 | — NOT YET WRITTEN — | — |
| V28 | 本节的 "价值场眼睛" 从没 ship 过 — live 的 `emergentStation` 是手调过渡态 | §1 尾 (SUBSTRATE-MAP 脚注) | ⊘ [2026-07-20] | — NOT YET WRITTEN — | — |
| V29 | 代码里无 `spaceValue` 符号 | §1 尾 | ⊘ [2026-07-20] | — NOT YET WRITTEN — | — |
| V30 | 节奏偏快的两个结构性贡献源 = 接球后时间维度缺失 + 踢球零前摇 (C7) | §2 节奏锚点 | 2026-07-27 | — NOT YET WRITTEN — | — |
| V31 | tempo census 登记为船前 REALISM-LEDGER 测量项 (即: 已登记, 未建) | §2 | 2026-07-27 | — NOT YET WRITTEN — | — |
| V32 | 速度管线已存在 (sim 秒 / 真实秒 + 速度按钮), 现只有 ≥1× 快进档 | §2 | 2026-07-27 | — NOT YET WRITTEN — | — |
| V33 | 踢球动画只有一个 one-shot (0.38 s), 不分传 / 射 / 弧线 / 力度 | §2 动作动画 | 2026-07-27 | — NOT YET WRITTEN — | — |
| V34 | sim 早就发出可区分的数据 (curl/spin · 推球力度 · 射门 vs 传球事件) | §2 | 2026-07-27 | — NOT YET WRITTEN — | — |
| V35 | 密度相变 (0.70) 与 A4 约定都没治乱抢本体 (它们治的是扎堆与撞车) | §2 乱抢判词 | 2026-08-08 | — NOT YET WRITTEN — | — |
| V36 | 拿住球 / 抬头 / 护球 这三个 "时间维度的座位" 仍然缺席 | §2 | 2026-08-08 | — NOT YET WRITTEN — | — |
| V37 | 现有电池全是 A/B 相对尺, 两臂同病则永远无门可响 | §2 | 2026-08-08 | — NOT YET WRITTEN — | — |
| V38 | 绝对尺 (tempo / possession census: 控球段长 · 每次控球触球数 · 每分钟事件率) 已登记未建 | §2 | 2026-08-08 | — NOT YET WRITTEN — | — |
| V39 | Phase-31 把看家钉给 index-1 | §3.1 rest defence | 2026-08-02 | — NOT YET WRITTEN — | — |
| V40 | Phase-88 的 coverBias 只给了 [−8, −16] 的深停窄带 | §3.1 | 2026-08-02 | — NOT YET WRITTEN — | — |
| V41 | 中圈级 rest line 被底座对所有基因组禁止 | §3.1 | 2026-08-02 | — NOT YET WRITTEN — | — |
| V42 | 越位陷阱基因 trapBias (Phase 109) 在库, 是它的天然搭档 | §3.1 | 2026-08-02 | — NOT YET WRITTEN — | — |
| V43 | Phase 36 的推球已把 "高速 + 开阔" 做成真触球 (球变自由体 · 追球再收 · 对手有捅球窗口 · 推距按前方空间连续定价) | §3.1 球-脚界面 | 2026-07-26 | — NOT YET WRITTEN — | — |
| V44 | 仍在胶水上的是转身 — 球随身体绕轴扫, `Match.ts:1265`, 转身期间球不可被攻击 | §3.1 | 2026-07-26 | — NOT YET WRITTEN — | — |
| V45 | 仍在胶水上的是低速 (< 2.5 m/s 门, 走路带球 = 定义上的完美近控) | §3.1 | 2026-07-26 | — NOT YET WRITTEN — | — |
| V46 | 仍在胶水上的是受压 (对手贴近时推球被抑制) | §3.1 | 2026-07-26 | — NOT YET WRITTEN — | — |
| V47 | 已注册为 PROGRAMME Track C 的 C6 | §3.1 | 2026-07-26 | — NOT YET WRITTEN — | — |
| V48 | 模拟层踢球 = 决定即出球, 前摇为零 | §3.1 前后摇 | 2026-07-26 | — NOT YET WRITTEN — | — |
| V49 | 后摇有粗糙版: `kickCooldown` 0.3–0.5 s 出脚锁 | §3.1 | 2026-07-26 | — NOT YET WRITTEN — | — |
| V50 | 渲染层摆腿动画存在 (0.38 s 一次性 · 会选脚) 但事后触发 — 球已飞出腿才摆 | §3.1 | 2026-07-26 | — NOT YET WRITTEN — | — |
| V51 | 精度 / 力度那一半已经全场存在 — 传球 / 传中 / 射门 / 解围都过 `kickMisalignment` (`mechanics.ts:77`) | §3.1 拧身传球 | 2026-07-27 | — NOT YET WRITTEN — | — |
| V52 | 缺的是时间半 (C7 准备延迟公式里的 bodyOrientationTerm) | §3.1 | 2026-07-27 | — NOT YET WRITTEN — | — |
| V53 | 缺的是动画半 (看得见的拧身出脚 = F9 的一项) | §3.1 | 2026-07-27 | — NOT YET WRITTEN — | — |
| V54 | action 层每个决策 tick 只在 "传 / 带 / 射" 里挑 — "等" 不是一个有价值的动作 | §3.1 接球后时间维度 | 2026-07-26 | — NOT YET WRITTEN — | — |
| V55 | 两个 REPORTED 计数器已登记: 传给越位球员的比率 · 回传被中途拦截的比率 | §3.1 | 2026-07-26 | — NOT YET WRITTEN — | — |
| V56 | 已有仪器测得 80.8 % 的公开接球被压迫 | §3.1 build-up #213 | 2026-08-09 | — NOT YET WRITTEN — | — |
| V57 | 已有仪器测得控球回合 4.4 秒 (现实 9.6–10.4) | §3.1 | 2026-08-09 | — NOT YET WRITTEN — | — |
| V58 | 后场倒脚 = chooser 只定价 "接得稳" 不定价 "值多少" → 安全回收 | §3.1 | 2026-08-09 | — NOT YET WRITTEN — | — |
| V59 | `supportSpot` (formations.ts:604-618) 的 x 项恒为球前方 (手写模式三元 0.75 / 0.35, 无基因) | §3.1 回撤接应 #223 | 2026-08-10 | — NOT YET WRITTEN — | — |
| V60 | 横向扇面由硬常数 (0.75 拉力 / 0.9 封顶) 拉向阵型 lane | §3.1 | 2026-08-10 | — NOT YET WRITTEN — | — |
| V61 | 整个可进化基因空间不存在任何表达能把接应人放到球的侧后方 — 回撤不是被权重埋没, 是维度不存在 | §3.1 | 2026-08-10 | — NOT YET WRITTEN — | — |
| V62 | Phase 30.5 铁证: 短选项消失 → 中性基因组进球 1.47 → 0.93 | §3.1 | 2026-08-10 | — NOT YET WRITTEN — | — |
| V63 | 今天无球进攻决策 (PlayerBrain.ts:1226-1298) 零感知输入 — SupportBallCarrier 只读真值距离 + 手写角色 / 模式常数 | §3.1 前插与回撤 #227 | 2026-08-10 | — NOT YET WRITTEN — | — |
| V64 | 前插 (MakeRun) 不是球员的选择, 是 TeamBrain 自上而下的执照 (`team.runners` / overlapper / arriver 点名) | §3.1 | 2026-08-10 | — NOT YET WRITTEN — | — |
| V65 | 防守有 station eye, 进攻无球侧没有眼睛 | §3.1 | 2026-08-10 | — NOT YET WRITTEN — | — |
| V66 | 普查: 感知 / 身体 / 持球技术 / 防守 / 进化通道 ✅ 齐; 缺的一层全是关系性的 | §3.1 关系性底座 #231 | 2026-08-11 | — NOT YET WRITTEN — | — |
| V67 | (PlayerBrain.ts:395-500) 领跑定价 (runBurstPoint, "meet the run") 只给 `MakeRun` 执照持有者 | §3.1 | 2026-08-11 | — NOT YET WRITTEN — | — |
| V68 | `SupportBallCarrier` (含 OBM 席位驱动的全部移动) 永远被传到脚下当前站位, 进不了 through-ball 候选 | §3.1 | 2026-08-11 | — NOT YET WRITTEN — | — |
| V69 | 出球物理已齐 (ground bender 弧线 / Phase 71 · 高球自带提前量 · 直塞) | §3.1 出球方式 #235 | 2026-08-11 | — NOT YET WRITTEN — | — |
| V70 | bender 是 "被封线就自动加旋" 的规则, 不是选择 | §3.1 | 2026-08-11 | — NOT YET WRITTEN — | — |
| V71 | 高球被 24 m 手写门槛隔离 | §3.1 | 2026-08-11 | — NOT YET WRITTEN — | — |
| V72 | 提前量是基因档位 (统一档位强制每一脚球领跑) | §3.1 | 2026-08-11 | — NOT YET WRITTEN — | — |
| V73 | DLC 竞价的候选集是离散化残留 — {脚下, 全量投影点} 两个点进 argmax | §3.1 落点连续 #240 | 2026-08-11 | — NOT YET WRITTEN — | — |
| V74 | 引擎的击球空间早已存在 — Ball 自带 z / vz / spin, 高球抛物线 · bender 逐帧弧线拦截全是现成力学 | §3.1 击球参数空间 #241 | 2026-08-11 | — NOT YET WRITTEN — | — |
| V75 | 但被三个手写动作各自绑死一小块 (地面传 / 高球 / 弧线各带写死参数) | §3.1 | 2026-08-11 | — NOT YET WRITTEN — | — |
| V76 | 地图对账 (a) 风险侧近乎空白 — 无飞行拦截项, 无失球位置代价 | §3.1 地图对账 #245 | 2026-08-12 | — NOT YET WRITTEN — | — |
| V77 | 普查测得 ~31 % 进球来自后场丢球 10 秒内 | §3.1 | 2026-08-12 | — NOT YET WRITTEN — | — |
| V78 | 地图对账 (b) 价值侧是线性距离 (真实位置价值非线性) | §3.1 | 2026-08-12 | — NOT YET WRITTEN — | — |
| V79 | 地图对账 (c) 收球侧上下文缺失 — ~82 % 首次接球受压, chooser 看不见 | §3.1 | 2026-08-12 | — NOT YET WRITTEN — | — |
| V80 | 故意的街机偏离: 越位 → 门球 (不是任意球) | §3 尾 | ⊘ (memory) | — NOT YET WRITTEN — | — |
| V81 | 故意的街机偏离: 禁区内持球门将解围清空 · 门球适用越位 | §3 尾 | ⊘ (memory) | — NOT YET WRITTEN — | — |
| V82 | 对照数据库 `efootball_engine_research_for_evofootball.md` 在库 | §3 | 2026-07-26 | — NOT YET WRITTEN — | — |
| V83 | squad 点数预算 ✅ 已上线 (SQUAD_BUDGET) | §4 | ⊘ [2026-07-14] | — NOT YET WRITTEN — | — |
| V84 | 全门 = vitest · visual-debug ×2 · calibrate · goals-warming · fingerprint 重刷 | §6 | ⊘ | — NOT YET WRITTEN — | — |

**INVENTORY TOTAL: 84 claims.** Frozen at this commit; the verdict column is
written in COMMIT 2 and the claim column is not re-cut after sight.

## §2 THE VERDICTS

— NOT YET WRITTEN (COMMIT 2) —

## §3 人话 SUMMARY

— NOT YET WRITTEN (COMMIT 2) —

## §HOW-TO-RE-RUN

— NOT YET WRITTEN (COMMIT 2) —
