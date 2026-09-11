# UI-NORTHSTAR — 世界观测台方向 (2026-07-24, commander-curated)

> 来源:用户 + GPT 方向稿,经指挥官筛选。**不是照单全收** — 每项标了
> ADOPT / DISCIPLINE / DEFER,理由在行内。层级:[`VISION.md`](VISION.md)
> 是金标准,本文件是 UI 层对它的解释;执行排期在
> [`world-model/PROGRAMME.md`](world-model/PROGRAMME.md) Track D。
>
> ⭐ 2026-09-11 注册了 [`world-model/EVOLUTION-DISCOVERY-CONTRACT.md`](world-model/EVOLUTION-DISCOVERY-CONTRACT.md)：
> 它把这里未来的“行为发现档案 / 因果回放”进一步定义成 **开放式行为发现 → 可读事件关系 →
> paired counterfactual → 谱系/生态 → 最后才命名** 的证据合同。它不改变当前 PROGRAMME 排期，
> 但 D4/D5 真正解锁时必须一起读。

## 核心论题(ADOPT)

> 现在的 UI 是"仿真控制台"(科研仪表盘 + FM 数据库 + 播放器);
> 该长成的是"**足球世界观测台 + 演化纪录片 + 可交互实验室**"。
> 缺的不是第五种图表,是四个东西:**事件、时间、谱系、证据**。

判定:与 VISION 同频(进化结果要更快、更显眼;身份从历史中赢得,
不是预设标签)。采纳为 UI 北极星。

## 全盘采纳(纯 UI,不碰 sim,现在就安全)

1. **双 Shell 拆分**:比赛模式保留现状;世界模式(联赛/演化/球队/球员)
   去掉左右比赛栏释放 30–35% 横向空间,当前比赛缩成右上角浮动小播放器。
2. **演化 scatter 加赛季尾迹**:上季幽灵点 + 轨迹 + hover 身份 + 点击锁定
   + 世代滑块。最便宜、视觉收益最高。
3. **阵型 = 测量结果,不是输入标签**:逐步把 `narrow-122` 等手写标签退居
   debug/prior,前台展示由真实轨迹算出的实际平均形状(攻/守/转换三态)。
   这直接呼应 SUBSTRATE-MAP 的 B 缺陷(手写阵型菜单 = 头号活体违规)。
4. **标签三层证据链**:风格标签 → 数字证据 → 可观看片段。标签只能是
   事后测量的结论(现有纪律:内切/套边/第三人只能事后识别,禁止成为
   live 决策标签或隐藏奖励)。
   ⭐ 当对象升级成“新战术/新默契/新机制”strong claim 时，三层链不够：按
   `EVOLUTION-DISCOVERY-CONTRACT.md` 扩成 **motif → context/response → counterfactual
   function → lineage/ecology → optional name**。`长得像` 不能替代 `功能成立`。
5. **雷达图减量**:每对象保留一张主雷达;比较一律换对齐横条(含跨季变化列)。
6. **王朝墙 → Dynasty Ribbon**(时代条带 + 冠军/克制者/教练更替标记)。

## 带纪律采纳(好方向,但必须防"编故事")

**`WorldEvent` 事件对象 + 世界首页**:采纳,但 v0 事件类型只允许
**今天真实可测**的:冠军/连胜/纪录、风格空间大幅漂移(超阈值)、
积分/ELO 轨迹拐点、克制关系翻转、预算-属性配置迁移、编年史已有条目。
置信度生命周期(candidate → supported → confirmed)照搬 probe 纪律 —
**每个事件必须挂真实遥测证据,没有检测器支撑的叙事数字一律不准出现**
("本季候选发现 7"这种数字在检测器存在之前就是造假)。谱系关系
(直接演化/模仿扩散/独立趋同)在没有可靠归因前只能带不确定标注展示。

⭐ Discovery track 进一步加三道防线：

- **surface form ≠ causal function**：两次内切看起来一样，可能一个为射门角、一个主要拉开套边空间；
- **effect ≠ intent**：产生了空间不代表球员就是“为了队友腾空间”才这么做；
- **mechanism ≠ evolved mechanism**：有因果效果还不够，必须能追到出生、稳定、遗传/适应与对手反制。

所以 UI 的候选名字永远是末端解释层，不得成为 detector 的输入模板，更不得回流 live sim。

## 明确 DEFER(依赖还不存在的 authority,做了就是假的)

| 项 | 依赖 | 解锁条件 |
|---|---|---|
| 行为发现档案(扫肩/回撤接应首现、战术扩散检测) | 感知/凝视/意图 **live** 在球员上 + Discovery Contract | Track A 攻墙成功 + live 接线 |
| 比赛页"理解"模式(该球员看见什么/推断什么/为何选这项) | live observer 状态 | 同上;B1 沙盒(synthetic 0.8)是它诚实的第一切片 |
| 球员"心智"层页面 | 同上 | 同上 |
| 反事实实验模式(冻结时刻跑 what-if) | counterfactual authority 产品化 + standardized discovery interventions | clone-POC 成熟 + 授权(GPT 自己也排在 P5,正确) |

DEFER ≠ 否决:这三样恰是本项目独有的终局价值("世界→历史→战术→球队
→球员→决策→物理结果"全链点通)。只是顺序必须是**先让行为存在,
再让 UI 叙述它** — 反过来就是在伪造历史。

## 统一交互原则(ADOPT,从 v0 起执行)

任何展示物都能一路点回证据:世界事件 → 档案 → 球队 → 球员 → 回放片段。
新增 UI 若展示一个结论而给不出下钻证据,不上线。

Discovery surface 最终的完整下钻应是：

```text
WorldEvent
→ candidate motif / relation
→ clean replay
→ primitive event graph
→ context + teammate/opponent response
→ actual-vs-counterfactual replay
→ lineage / transfer / convergence / ecology
→ optional human/LLM name
```

LLM 可以做最后的“解说员”，不能做 detector、因果裁判或 live-policy label 来源。

## 执行优先级(→ PROGRAMME Track D)

```text
D1 = 双 Shell 拆分(P0)
D2 = 演化尾迹 + scatter 交互(P3)
D3 = WorldEvent v0(诚实事件集)+ 世界首页 + Dynasty Ribbon(P1+P2+P4 的可做半)
D4 = 行为发现档案 — 解锁条件:Track A live(P4 的另一半) + EVOLUTION-DISCOVERY-CONTRACT
D5 = 因果回放/反事实 — 解锁条件:counterfactual authority(P5) + standardized paired interventions
```

UI 全程不碰 sim(指纹不变),Sonnet 级执行即可,验收 = 用户的眼睛。
不得挤占 Track A 实验排期。
