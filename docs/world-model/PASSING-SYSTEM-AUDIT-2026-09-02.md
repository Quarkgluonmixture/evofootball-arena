# 传球系统 × 现实 × VISION 三视角审计（2026-09-02，commander 会话，零 sim 零 stats）

> 问题（用户原话）：「整个传球系统本身，从出球人的角度和接球人的角度和教练，是否和现实一样？包括我的 vision」
> 方法：三个独立子会话分别**通读**出球人 / 接球人 / 教练三条线的源码（文件清单见文末），
> 合并后逐条对照 (a) 真实足球的机制、(b) `docs/VISION.md` §1/§3 的铁律。
> 每条判断都带 `file:line`（截至本日 HEAD `c7bdaaf`，行号会漂，符号名稳）。
> ⛔ 这是评估，不是裁决；不改 PROGRAMME 队列，不消耗 seed。

## 0. 一句话结论

**三个视角都不和现实一样，但不一样的方式各不相同：**

| 视角 | 物理/执行半 | 决策半 | 离现实最远的一点 | 离 VISION 最远的一点 |
|---|---|---|---|---|
| 出球人 | 基本像（噪声按属性、朝向、飞行律） | 不像：全知、读心、离散菜单、力度恒 1、不能等 | 定价的球 ≠ 踢出的球 | 层 A 直接读队友的 `action.type`（内心/外显/推断没分开） |
| 接球人 | 像（控制半径、身位壳、一脚触球失败律） | 最不像：球出脚前他是被安排的，不是自己看空间决定的 | 出脚前不知道球要来、没有要球通道 | 进攻侧眼睛（OBM/CTB）造好了，**任何世界都没通电** |
| 教练 | 赛季层像（基因 + 选择 + 继承） | 比赛层不像：TeamBrain 每 0.4 s 点名跑位/追球/盯人 | 没有「看自家踢法 → 建议 → 风格形成」的回路，没有针对对手的赛前布置 | 逐 tick commander，VISION §1 明文禁止 |

**推论**：之前那些测量（DX/RA 弧）都是在「出球人全知 + 接球人惰性」的世界里测的，
所以它们测的是单边模型内部的效应。RA 只给出球人那半定了价（#360 item 4 明确 held 接球人半），
这是设计上的自觉选择，不是疏忽——但意味着「传球系统像不像现实」这个问题的答案
**现在还是「不像」，且下一个最大的洞在接球人那边**。

## 1. 出球人（passer）

### 1.1 他看什么

| 现实 | 我们（出厂世界） | 我们（世界 11/12） | 对 VISION |
|---|---|---|---|
| 眼睛看到的局部、有陈旧和遮挡；队友意图靠外显线索推断 | **全知真值**：`team`/`opp` 直接是 truth（`PlayerBrain.ts:190-197`，`inSnapshotLaw` 无世界 arm） | 层 B 换收球人时用私有快照（`Match.ts:5162-5175`），但**「传不传、传哪种」仍用真值**，候选窗口也用真值位置（`perceivedPassChoice.ts:145-159`） | ⛔ 违反「感知诚实」。层 A 直接读 `mate.action.type === 'MakeRun'`、`mate.wallRun`、`team.runners`（`:887, :620-624, :645`）= **读心**，违反「内心/外显/推断三分」 |
| 传球前会先「看一眼」 | 无 | `o2Look` 只对持球人且 born-incumbent，`inLookAct` 无世界 arm | VISION「眼睛还要看动态」未落地到出球人 |

### 1.2 他有哪些球可选

| 现实 | 我们 | 对 VISION |
|---|---|---|
| 连续的一脚：方向 × 力度 × 高度 × 旋转 | 离散动作菜单：到脚 / 高球（`d>24` 手写门，`:727`）/ 直塞（只给 `MakeRun` 持照人，`:887`）/ 传中 / 回敲；世界 12 加「领跑候选」（`passLeadSeat.ts:169-179`，18 与 1.6 是抄来的常数） | ⛔ #241「击球参数空间才是底座」未在任何可玩世界成立 |
| 力度是选择 | **力度恒 1**：`pwWeightChooser` 无世界 arm（`mechanics.ts:348-353`） | 同上 |
| 弧线是选择 | 弧线是规则：「被封线就自动加旋」（`mechanics.ts:279-300`），没有 chooser 读它 | V70 STILL-TRUE |
| 3×3 击球网格 | 造了，但世界 12 里 `dlcSeat !== null` ⇒ **网格从不生成候选**（`PlayerBrain.ts:794-800`；#357 已知的 G-PRECEDENCE） | 排在闸门后的 grid composition exam 就是冲它去的 |

### 1.3 他怎么给一脚球定价

| 项 | 量的是谁 | 出厂 | 世界 12 |
|---|---|---|---|
| lane（`perception.ts:143-155`）/ open（`:215-223`） | 防守方，静态、无速度 | ✅ | ✅ |
| gain（`:597`）| 地盘，线性距离 | ✅ | ✅（V78 STILL-TRUE：位置价值线性） |
| 风格乘子 passBias/tempo/risk/mode | 教练基因 | ✅ | ✅ |
| DV 飞行暴露 + 失球位置信念（`deliveryValueSeat.ts:249-261`） | 风险 | ⛔ 休眠 | ⛔ 休眠（`dvDeliveryValue` 不在任何 door 集合） |
| GC 地面走廊（`:668-669`） | 身体 | ⛔ | ✅ 二值 |
| **RA 接应时间**（`receiverAccessSeat.ts:134-143`） | **接球人物理（唯一一项）** | ⛔ | ✅ |
| 接球人的技术 / 身位 / 受压上下文 | 接球人 | ⛔ 不入价 | ⛔ 不入价（V79） |
| 层 B `valueAxis`：格子 × 拦截威胁分位 → 查表射门率（`passPrior.ts:524-573`） | 「值多少」 | ⛔ | ✅（无手设权重，census 表） |

**现实的一脚球先问三件事：传得到吗 · 值多少 · 丢了代价多大。** 世界 12 答了前两问的一半
（RA 只算时间不算身位；valueAxis 只算射门率不算推进），第三问全部休眠。

### 1.4 他怎么决定、什么时候能反悔

| 现实 | 我们 | 对 VISION |
|---|---|---|
| 有前摇，前摇期间能收脚改主意，也能假动作 | 出厂：决定即出球（`:1665-1669`）；世界 ≥3：wind-up 0.05–0.18 s + 朝向法（`Match.ts:159-178, 215-227`），**期间不再决策**（`PlayerBrain.ts:70-73`），到点用当时的队友位置踢，只有丢球/眩晕/换人等外因取消 | 前摇锚点半落地（S12 PARTIALLY-STALE）；「反悔」不存在 |
| 「等」是有价值的动作 | `ShieldHold` 是真动作，但 `whetherEye` 无世界 arm ⇒ **任何可玩世界里等都不值钱**（V54） | S14 仍成立 |
| 决策有噪声/习惯 | 严格 argmax，无 softmax、无 rng，平局先推者赢（`:1280`） | — |

### 1.5 定价的球 ≠ 踢出的球

- 定价在 `mate.pos`；击球点 = `mate.pos + 0.8·vel·flight`，flight 含 orientation 而定价不含（`mechanics.ts:372-373, 388`）。
- 世界 12 的 ptpLead **叠加**在 0.8 修正之上（`:382-383`），自报均值 +3.3 m（`passLeadSeat.ts:186-192`）。#358 3(b) 点名，此后无处置。
- 直塞定价用 `runBurstPoint(d/18)`，执行用 `flight·1.25`（`:454-504`）——两个飞行时间。
- 定价器不含 orientation 功率损失，也不含噪声。

⇒ 「chooser 定价一个球，身体踢另一个球」是**结构性**的，不是世界 12 独有；每一场 exam 的
「完成率」都在量这个偏差的后果。

## 2. 接球人（receiver）

### 2.1 他知道球要来吗

| 现实 | 我们（所有世界） | 对 VISION |
|---|---|---|
| 从出球人的身体、眼神、脚型提前读到；自己要球 | `pendingPass` **只在出脚那一刻写**（`mechanics.ts:234-256`）；他在下一个 0.15 s 决策 tick 读全局真值对象得知自己是目标（`PlayerBrain.ts:1877-1881`） | ⛔ 读的是真值不是 percept；出球前零信息 |
| wind-up 是外显证据 | wind-up 写在 `pendingPassWindup`（`Match.ts:3804-3888`），**没有任何无球大脑读它**；出球人的转身/减速是真值可见的，但也没人读 | VISION「前摇是可被对手读的外显证据」——**己方也读不到** |
| 要球（手势/喊）有通道 | **没有 offer 对象**；`offBallCoordination/offBallAffordance/relativeAffordance` 是纯求值器，`src/**` 无调用者 | S19 「要球没有通道」STILL-TRUE |

DX-C2 量出的 +3.23 m 合作缺口（#360 item 2(c)）就是这一条的数值：接得到的球他也不去跑，
因为 `ReceivePass` 是出脚门控的。

### 2.2 球出脚前他怎么动

| 现实 | 我们（出厂 = 世界 12，接球侧字节相同） | 对 VISION |
|---|---|---|
| 自己看球 + 对手 + 队友 + 场地，决定回撤/前插/拉边 | `supportSpot` = 球前方手写扇面（aheadBias 0.75/0.35，横向拉回 lane ×0.75，`formations.ts:644-710`），**目标点里没有对手/空间项**，对手只在 steering 层被躲开 | ⛔ VISION §1「让球员自己长眼睛」——进攻无球侧**没有眼睛**（V65：两侧都关着） |
| 前插是球员自己的选择 | `MakeRun` 只给 TeamBrain 点名的 `runners/arriver/overlapper`（`TeamBrain.ts:168-331`，角色权重 ST 2.2 / WG 1.8 / MF 1.2 / DF 0.4） | ⛔ V64 STILL-TRUE：自上而下的执照 |
| 回撤接应是常见选择 | 维度存在（`ctbSupportDepth`）但 `ctbSupportPlane` 无世界 arm | V61：「维度未通电」 |
| 二过一、套边从配合里长出来 | **手写触发**：短传 <15 m + 受压 + `(tempo+passBias)/2·wallPassW > 0.35` ⇒ 2.3 s `wallRun`（`mechanics.ts:434-443`）；套边 = `attackingWidth·overlapW > 0.3` 点名（`TeamBrain.ts:296-330`） | ⛔ VISION §1 原话「二过一……从进化里长出来，不是我们手写」——这是**正牌违规** |
| OBM 眼睛（4 个 percept 特征 × 基因矩阵） | 造好了（`offballEyes.ts:219-247`），`obmMovement` 无世界 arm | 造了不等于送到球员脚下 |

### 2.3 球出脚后

| 现实 | 我们 | 评价 |
|---|---|---|
| 目标人调整跑动迎球，第二人继续跑（第三人跑动） | **恰好一个人追**（目标 gid，`:2057`）；其余人因无持球人退回 `MoveToFormationSpot`（`:1965-1969`） | 迎球本身像（`interceptBall` 时间解，`perception.ts:271-320`）；**「球在飞时全队站定」不像** |
| 越位线博弈 | onside hold 按角色深度手写（`actionExecutor.ts:1221-1235`） | 手写档位 |
| 世界 8+ 的反应延迟 | `passRelease` 类 0.20/0.45 s 冻结（`pcLatency.ts:48-58`） | 像现实的一条，且是学出来的书 |

### 2.4 接球那一下

控制半径 1.25、身位壳（前满/侧 1/后 0.9，`physical.ts:359-399`）、一脚触球失败律按 dribbling/positioning/受压/身位（`mechanics.ts:159-212`）、一脚出球窗口按 tempo 触发（`Match.ts:3577-3595`）——**这一层是全系统里最像现实的**。缺：接球时转身没有时间成本（S11 「转身/低速/受压仍是胶水」）；接球人的属性不进出球人的定价（1.3）。

## 3. 教练（coach）

### 3.1 教练是什么

| 现实 | 我们 | 对 VISION |
|---|---|---|
| 一个人：赛前布置、训练里灌输套路、看自家踢法给整体性建议、按对手微调、赛中按比分调 | **一条数据**：23 个战术基因 + 22 个 policy 基因 + 离散 style（`coach.ts:33-43`），整个赛季不变，赛季末被选择/变异（`evolve.ts:150-287`） | ✅ 「教练基因 × 球员偏好」这半在（VISION §1 两层眼睛） |
| 赛中调整 | mentality 曲线按比分/时间调 risk/tempo/press/depth（`mentality.ts:38-121`）；弱者按 Elo 差偏移 | ✅ 有，但方向全手写 |
| 针对对手的赛前布置 | **没有**：唯一对手条件项是 Elo 差和 B2 防线跟踪 | ⛔ VISION「教练能根据赛前布置去微调适配不同的对手」不存在 |
| 教练看自家踢法 → 建议 → 风格形成（回路） | **没有回路**：style 是建队时按基因阈值贴的标签（`types.ts:80-91`），之后只靠 8%/赛季的变异 | ⛔ VISION 2026-08-02 野球模型 (d) 未落地 |

### 3.2 但比赛里有另一个「教练」在逐 tick 发号施令

`updateTeamBrain` 每 0.4 s（`constants.ts:355`）：定 mode、**点名**追球人（上限手写「永不 3 个」，`TeamBrain.ts:419-423`）、**点名**盯人（贪心最近 22 m）、**点名**前插人/到位人/套边人（`:168-331`）。

- 现实里没有教练每 0.4 秒喊「你去前插、你去套边」。
- VISION §1 原话：「它们是球员形成私人意图的共同 prior，**不是逐 tick 广播"谁去哪个坐标"的 commander**」。
- ⇒ **这是教练视角上最大的 VISION 违规**，且它直接造成 2.2 里「前插不是球员的选择」。

### 3.3 教练基因到底管不管传球

- 管：`passBias / riskTolerance / tempo / counterAttackBias / attackingWidth / supportDistance` 都进定价（清单见 `PlayerBrain.ts:544-652`），policy 基因 `passBase/passLaneW/passOpenW/supportBase/runScore/wallPassW…` 可进化。**维度手搭、权重进化**——符合 VISION 的诚实张力条款。
- 不管：休眠基因 `passLeadSupport / raAccessWeight / dvExposureWeight / ctbSupportDepth / offballMovementWeights` **在任何世界都不进化**（所有 `evolve*` opt-in 无生产调用，`evolve.ts:188, 220-222`）；世界 12 里是 **hand-pin = 1** 的固定剂量。⇒ 你在世界 12 感受到的「传球先问赶不赶得到」是**一个预设值**，不是选择长出来的。入口档（entry rung）的自报是诚实的，但对「像不像 VISION」这个问题要如实说：**还没进化过**。
- 手写上限：区域防守 ≤4 家 + 0.3 入场币（`League.ts:991-992`, `evolve.ts:143`）、追球人永不 3、fitness 里 0.15 的「风格一致性」项（`fitness.ts:79-87`）——都是替球队定了行为。

## 4. 产出层证据（R-乙 缺口表 epoch 3，`post-entries-w10w11`，425 seeds × 4 arms）

| 量 | 出厂 | 世界 11 | 现实 |
|---|---|---|---|
| 传球完成率 Q06 | 0.739 | 0.587 | 0.753–0.88 |
| 每回合传球数 Q05 | 2.55 | 2.69 | 2.88–5.12（中位 3.5–4） |
| 一脚出球占比 Q23 | 0.198 | 0.134 | 未溯源 |
| 长传占比 Q22 | 0.055 | 0.018 | 未溯源 |

（复算：`scripts/analysis/r-yi-gap-table-result.ts` 对 `docs/world-model/data/r-yi-gap-table-ledger.jsonl`；世界 12 未入表。）
装了身体法则的世界比出厂**更不像**现实的完成率——已知的诚实代价（#326：传球 oracle 还没学会躲身体）。
世界 12 的 RA 把 carried 类完成率拉回 +5.8 pt（#364），但整体完成率的洞不在这一类里。

## 5. 与「之前的测量失败」的关系

- DX-T1/T2 的失败 = 底座缺量（接应时间），#358 已钉、RA 已补出球人那半。
- RA-T1 的失败 = 尺错，不是底座。
- **但本审计说明 RA 所在的整个弧线都跑在一个单边世界里**：出球人全知读心、接球人惰性、教练逐 tick 点名。
  在这个世界里量出来的每一个 Δ 都是真的，但它们回答的是「在这个不像现实的系统里，这一项价格有没有用」，
  不是「传球系统像不像现实」。后者的答案现在是**不像**。

## 6. 建议的补洞顺序（commander 的推荐，裁决权在用户）

按「一刀补的是不是一个真实的量 + 已有多少造好的部件 + 会不会让前面的测量失效」排：

1. **接球人合作（held door 的兑现）**：让目标人在 wind-up 期间就能从**外显证据**（出球人的转身/faceTarget，不是 `pendingPassWindup` 真值）推断球要来，并按 `interceptBall` 的同一套时间账迎球。补的是 +3.23 m 这个已测的数，且是 RA 的镜像半。前置：出球人 wind-up 已在世界 ≥3。
2. **进攻无球侧通电**：在一个 a4 世界里 arm `obmMovement` + `ctbSupportPlane`（都造好了），让回撤/前插成为 percept 驱动的选择。这一步之后 TeamBrain 的 `runners` 点名才有退休的对照臂。
3. **TeamBrain 点名退休**（前插/套边/二过一的手写触发）——按 DF 那条路（先让决策可定价再撤帽）走，不能先撤。
4. **击球参数空间入世界**：`pwWeightChooser` + strike-plane（在 plane-without-choice 组合里，就是排在闸门后的那场 exam）。
5. **出球人感知诚实**：层 A 的真值读取（`inSnapshotLaw`）和读心标签，这是最深的一刀，放最后，因为它会让所有已 banked 的 A/B 失去对照基线。

⛔ 1–3 都会改接球侧字节 ⇒ 世界 12 的 play-test 判决要**先出**，否则用户看到的东西和 exam 测的东西又对不上。

## 附：本审计读过的源码

出球人线：`src/ai/PlayerBrain.ts`, `perceivedPassChoice.ts`, `passOptionValue.ts`, `passLeadSeat.ts`, `receiverAccessSeat.ts`, `strikePlaneSeat.ts`, `passWeightChooser.ts`, `carryChoiceSeat.ts`, `prediction.ts`, `passPrior.ts`, `passCorridorInterception.ts`, `reachability.ts`, `perceptionSnapshot.ts`, `src/sim/mechanics.ts`, `Match.ts`（传球/wind-up/接球段）, `src/game/a4World.ts`。
接球人线：`src/ai/actionExecutor.ts`, `perception.ts`, `TeamBrain.ts`, `formations.ts`, `offballEyes.ts`, `offBallAffordance.ts`, `offBallCoordination.ts`, `relativeAffordance.ts`, `deliveryChoiceSeat.ts`, `inLookAct.ts`, `inSnapshotView.ts`, `lookSeat.ts`, `attentionPolicy.ts`, `steering.ts`, `src/sim/Player.ts`, `physical.ts`, `constants.ts`。
教练线：`src/evolution/coach.ts`, `genome.ts`, `policyGenome.ts`, `playerStyle.ts`, `playerGenome.ts`, `evolve.ts`, `fitness.ts`, `franchise.ts`, `careers.ts`, `freeAgents.ts`, `src/ai/mentality.ts`, `src/sim/Team.ts`, `types.ts`, `League.ts`。
文档：`docs/VISION.md` §0/§1/§3, `VISION-STATUS-LEDGER.md` S11–S22, `VISION-SNAPSHOT-AUDIT-2026-08.md` V48–V79, `world-model/R-YI-STANDING-GAP-TABLE.md` §RESULT-3, `PROGRAMME-RULINGS.md` #357–#365。
