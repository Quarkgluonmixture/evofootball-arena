Reading prompt from stdin...
OpenAI Codex v0.144.1
--------
[1mworkdir:[0m /Users/jamie/Documents/Promptfoo/evofootball-arena
[1mmodel:[0m gpt-5.6-sol
[1mprovider:[0m openai
[1mapproval:[0m never
[1msandbox:[0m read-only
[1mreasoning effort:[0m xhigh
[1mreasoning summaries:[0m none
[1msession id:[0m 019f8030-8c52-7ee1-91e4-481c9e8cd7ce
--------
[36muser[0m
# Independent design consultation — EvoFootball Arena · ATTRIBUTE MODEL (zero preset)

You are giving an INDEPENDENT design opinion. There is **no predefined answer** — investigate the
code/docs, form your own view, and it is completely fine (encouraged) to DISAGREE with how things
are currently done. The person asking does NOT want their own thinking echoed back; they want a
genuine second brain. Where the docs contain a current author's in-progress hypotheses (especially
`docs/ROADMAP.md`, which is a dated working-session log), treat those as *context, not answers* —
reason from the code and first principles, and say if you think they're wrong.

## The project
EvoFootball Arena is a **deterministic 6v6 evolutionary football simulation** (TypeScript). Teams
AND their players EVOLVE across seasons via selection. The project's core philosophy is
**EMERGENCE**: tactics, styles, and skills must ARISE from evolution + selection acting on a
substrate — NOT be hand-coded. Key constraints you must respect in any proposal:

- **Emergence:** don't hand-script behaviors; enrich the SUBSTRATE (physics + genes) so good play
  PAYS and selection discovers it. A change that reads `if (role === 'WG') ...` to force a behavior
  is against the soul.
- **Squad attribute BUDGET:** players have per-attribute genes (0..1); a shared squad-level cap
  means raising one attribute COSTS another, forcing specialization/archetypes to emerge.
- **Watchability:** matches must stay watchable and balanced — roughly ~2 goals/match, varied
  routes to goal (through-balls, crosses/headers, cutbacks, dribbles), no degenerate pathologies.
  A change that inflates scoring or collapses a route to goal is a regression even if "realistic".
- **Determinism:** all randomness is seeded (no `Math.random`, no wall-clock); identical seed ⇒
  identical match.

## What to read (repo root = your CWD)
- `docs/VISION.md` — the gold-standard vision (what the game should feel/be). Authoritative intent.
- `docs/EVO-BLUEPRINT.md` — the emergence architecture.
- `docs/ROADMAP.md` — recent history + current state (working-session log; context, not answers).
- `src/evolution/playerGenome.ts` — the attribute genes, the budget, mutation/crossover/heredity.
- `src/sim/mechanics.ts` — where attributes are consumed by the match physics (grep the attr names).
- `src/ai/PlayerBrain.ts`, `src/ai/perception.ts` — how players perceive and choose actions.
- `src/evolution/traits.ts`, `src/evolution/careers.ts` — derived traits + age curves.

## Your questions (form your OWN opinions; be concrete — name attributes, formulas, code sites)
1. **Attribute audit.** Does each player attribute genuinely and DISTINCTLY matter in the sim?
   Which are weak, redundant, one-dimensional, or effectively dead? Which real-football qualities
   are MISSING from the attribute set? Are any mechanics "attribute-blind" (a flat constant where a
   gene should bite)?
2. **Modelling "game reading / awareness / vision" (eye quality).** If you were to add or strengthen
   an attribute for how well a player READS the game, how would you model it so it (a) meaningfully
   DIFFERENTIATES players, (b) stays emergence-faithful and evolvable under the budget, and (c) does
   NOT distort match balance — e.g. does not inflate scoring or over-concentrate one route to goal?
   Where exactly would it plug into the perception/decision code? What are the failure modes to
   avoid, and how would you keep it balanced?
3. **Highest-leverage changes.** Rank your top 3–5 changes to the attribute substrate that would
   make evolution produce richer, more distinct, more realistic players — WITHOUT hand-coding
   behaviors — and note the balance risk of each.

Prioritize. Disagree freely. Cite file:line where you can.

[35m[3mcodex[0m[0m
I’ll audit the implemented dataflow from genome → perception/decisions → mechanics, treating VISION as intent and ROADMAP as historical context. I’ll focus on whether each gene creates a distinct selectable advantage, then pressure-test an “eye quality” model against budget and scoring-path balance.
  [36m→[0m Read project guidance and the specified vision/evolution documents
  [2m•[0m [2mTrace every player attribute from genome through brains, perception, mechanics, traits, and careers[0m
  [2m•[0m [2mEvaluate missing qualities and design a balanced game-reading substrate[0m
  [2m•[0m [2mRank highest-leverage changes with exact code sites and balance risks[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "pwd && rg --files -g 'AGENTS.md' -g 'docs/VISION.md' -g 'docs/EVO-BLUEPRINT.md' -g 'docs/ROADMAP.md' -g 'src/evolution/playerGenome.ts' -g 'src/sim/mechanics.ts' -g 'src/ai/PlayerBrain.ts' -g 'src/ai/perception.ts' -g 'src/evolution/traits.ts' -g 'src/evolution/careers.ts'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 118ms:[0m
src/sim/mechanics.ts
src/evolution/playerGenome.ts
src/evolution/careers.ts
src/evolution/traits.ts
src/ai/PlayerBrain.ts
src/ai/perception.ts
docs/EVO-BLUEPRINT.md
docs/ROADMAP.md
docs/VISION.md

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'wc -l docs/VISION.md docs/EVO-BLUEPRINT.md docs/ROADMAP.md src/evolution/playerGenome.ts src/sim/mechanics.ts src/ai/PlayerBrain.ts src/ai/perception.ts src/evolution/traits.ts src/evolution/careers.ts'[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     255 docs/VISION.md
    2289 docs/EVO-BLUEPRINT.md
    2566 docs/ROADMAP.md
     231 src/evolution/playerGenome.ts
    1915 src/sim/mechanics.ts
    1144 src/ai/PlayerBrain.ts
     311 src/ai/perception.ts
      86 src/evolution/traits.ts
      96 src/evolution/careers.ts
    8893 total

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba docs/VISION.md | sed -n '1,280p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	# EvoFootball Arena — 愿景 · 金标准 (VISION / THE GOLD STANDARD)
     2	
     3	> 这份文档是**用户想要什么**的唯一权威来源。**每一个决定**——机制、功能、
     4	> ship-or-revert、优先级——都以此为尺子来量。它汇总了用户过去所有"我希望 xx"
     5	> 的原话与意图。**当某个改动服务了某条杠杆、却违背了这份愿景 → 愿景赢。**
     6	>
     7	> 活文档:新的"我希望"随时并入;原话逐字保留,不改写用户的话。
     8	> 决策/机制的当前状态与推理见 [`EVO-BLUEPRINT.md`](EVO-BLUEPRINT.md)（主计划）
     9	> 与 [`ROADMAP.md`](ROADMAP.md)（阶段账本）——**那些以本文件为准，不是反过来**。
    10	
    11	---
    12	
    13	## 0. 北极星 (The North Star) — 用户原话
    14	
    15	**总纲（2026-07-14, user-ratified）:**
    16	> 就像看着现实足球队伍一样,涌现不同战术,然后互相竞争,进化,然后每个队员,
    17	> 每个队伍的 coach,每个赛季杯赛,都有独特闪光点和打法,并且都在 evo,而且
    18	> 有竞争有激烈,并且需要有个更可视化的方法来看他们进化,并且这一切都是有很
    19	> 真实并且足够质量高的底座支撑。
    20	
    21	**一句话检查表（2026-07-14 gap review）——一个成品该是:**
    22	> 好玩的,可以自我进化的,可视化优秀的,有深度的,玩着爽的,能自己产生多元化
    23	> 战术的,贴近现实足球。
    24	
    25	一个活的足球世界:战术、球员、教练、赛季、杯赛都带着**赢来的身份**,都在进化,
    26	竞争激烈且**看得懂**,全部立在一个**真实、高质量**的模拟底座上。
    27	
    28	---
    29	
    30	## 1. 灵魂:涌现,不是我们设定 (EMERGENCE — the soul)
    31	
    32	**用户原话（2026-07-14）:**
    33	> 真正的应该是自己涌现各种风格、技巧、二过一、战术等等,而非我们去设置。
    34	> 这才是我更希望的 evo 的含义。
    35	
    36	> 不要写死预设,让他发挥才智。
    37	
    38	**铁律:**
    39	- 风格 / 技巧 / 二过一 / 战术 / 跑位 **从进化 + 选择里长出来**,不是我们手写。
    40	  手写"边锋做 X"、给某个角色调一个必然触发的结果,**违背灵魂**。
    41	- **底座只提供"允许 X"的能力,不替球队"定 X"**（用户 2026-07-19：
    42	  "这些都是'底座现在允许 x'而不是'我们帮球队定了 x'"）。给能力 + 基因门控,
    43	  让**选择**决定谁用、用多好;用不好的被淘汰,天经地义。
    44	- **诊断问题 = 诊断进化问题,不是设计问题**:缺失的好行为通常是**局部最优**
    45	  ——它在当前底座里不划算,所以进化正确地没选它。修法 = 把底座改成让好行为
    46	  **划算**(gene-driven、无角色偏置),退掉补偿性的手调,然后**跑演化并观察**。
    47	- ⭐⭐ **头号活体违规:阵型/位置目前是"我们画死的菜单",不是长出来的**（用户
    48	  2026-07-19）。原话:
    49	  > 边锋回撤其实是一个大的自由度的一部分。我发现有的深蹲大巴的球队,很多球员都
    50	  > 站到了自己禁区里,对于防守的帮助是 0——这也是阵型的问题:阵型第一没办法自己
    51	  > 变化,每个人站在阵型的哪里是固定好的,没有回撤;阵型也不会随着对面的移动而
    52	  > 移动,也没有强弱侧;战术的风格基本上是我们人为定义的风格,而不是长出来的。
    53	  现状（对代码属实）:阵型 = 一组**手写的固定坐标表**（wide-212/narrow-122/…/
    54	  low-32/…),`formationSpot` 只在其上叠**仿射变换**(随球 x 滑动、按基因缩放宽/深、
    55	  模式位移、很弱的随球 y 拖拽)。后果:①阵型不能自己变(形状是我们画的,演化只是
    56	  选一张表+缩放);②位置写死、**没有回撤接应**;③**不随对手形状移动**(只跟球);
    57	  ④**几乎没有强弱侧**;⑤**所谓"进化出的风格"本质是选了我们哪张表——形状是我们
    58	  手搭的,直接违反本原则**;⑥没有"按价值站位/别扎堆"→大巴队一堆人挤自己禁区、
    59	  防守贡献 0。**要求:位置本身必须涌现**——一个 gene-driven 的**定位场/角色+自由度**
    60	  系统:站位由"球 + 对手 + 队友 + 空间价值 + 基因倾向"实时生成,**回撤/前插/压上/
    61	  收缩/强弱侧/别扎堆都是涌现结果**,"风格" = 演化出的**形状**而非我们的菜单。
    62	  这是与"缩场/密度"并列的**承重级底座重构**,也是这轮位置/宽度杠杆反复回退的
    63	  第二根源(在写死的格位上做变换,长不出流动定位行为)。
    64	- ⭐⭐⭐ **实现形态(2026-07-20 拍板):"让球员自己长眼睛"。** 上条那个 gene-driven
    65	  定位场,具体长成一个**基因加权的「空间价值场」**——每个球员对场上位置/方向打一个
    66	  价值分(空间开阔度 + 威胁/推进 + 接不接得到 + 别扎堆),往**自己眼里价值最高**的点
    67	  跑 / 带。用户原话:
    68	  > 这相当于,让球员自己长眼睛了?我觉得这个很牛逼啊。
    69	  **关键:内切、禁区包抄、回撤接应、超载、强弱侧——不一个个手写,全从这一个价值场
    70	  涌现。** 用户 2026-07-20:"内切还有禁区包抄,这些球员自己不能长出来吗"——**答:应该
    71	  长出来;它们今天长不出来,是因为底座里根本没有这个「动作」原语(带球只会下底、只有
    72	  一个写死的接应人),不是进化没去选它**(maxed-genome 也变不出 → 底座缺陷,非选择缺
    73	  口)。所以要补的是**原语**,而**补一个 gene 门控的能力原语 ≠ 手写行为**:谁用、几个、
    74	  何时、值不值,照样交给基因 + 选择。
    75	- ⭐⭐⭐ **眼睛看什么(完整感知模型,2026-07-20 用户补全)。** 用户原话:
    76	  > 长眼睛这个,还得知道队友在哪,所以是球+空间+队友,空间其实也就是对面的人+
    77	  > 自己的人+场地(球门禁区之类的)。
    78	  即一只完整的眼睛感知 **4 样**:**① 球**(在哪 + 要去哪)· **② 对手**(他们**否定**空间:
    79	  盯防/压迫,并定义结构:越位线、密集块、人与人之间的缝)· **③ 队友**(他们**占用**空间
    80	  → 别扎堆;更是**协同**信号 → 持球队友在边路高位=要传中→我踩点包抄,队友拉了宽度=我
    81	  进中路,队友回撤=我压上)· **④ 场地**(球门/禁区/边线/越位区——**固定几何决定价值**:
    82	  近门=危险,禁区=目标区)。**⭐ "空间"不是原始输入,是从 ②+③+④ 派生出来的**
    83	  (openSpace = f(离对手多远、离队友多远、在不在场内有用区))。**一个有价值的位置 = 存在
    84	  的空间(对手远、队友不在、在场内)× 有意义(近门/球要来/接得到)。** ⚠ 教训(本会话 3 次
    85	  失败):只用"对手"算 openness、把"队友"仅当扎堆惩罚、丢掉"读持球队友的协同"和"场地价值/
    86	  越位结构" → 眼睛残缺 → 球员往空地(=远离球和禁区)乱跑、越位到位失败。四样齐备才是真眼睛。
    87	- ⭐⭐⭐ **眼睛还要看自己 + 看动态(2026-07-20 用户补全 II)。** 外部四样之外,真眼睛还读:
    88	  · **自身**:**朝向**(面朝己门不能马上起脚/前传,转身要时间)、**我的属性**(同一位置,对快的/会
    89	  射的/惯用脚对的人价值不同)、**体能/平衡** → **价值永远是"对我而言"的**,不是客观的。
    90	  · **动态 / 预判**:不是快照——对手在后撤还是站定、队友在不在跑、球 1–2 秒后在哪、**读持球人
    91	  的意图**。用户原话:**"对手结构其实类似于提前观察,以及预判,这个影响自己的决策。"** 三次失败
    92	  (越位到位 +50%、踩不上点)正是丢了这只动态眼。
    93	  · **眼睛本身有好坏 = 属性**:用 awareness/视野属性 gate 看得**多远/多准/多快** → **"长眼睛"本身
    94	  就是分化的、涌现的**(大师看得见别人看不见的传球)。
    95	  并且:四个输入各喂**多个维度**(空间/威胁/接应/球门价值),不是只喂"空间";有价值的空间是
    96	  **相对对手阵型**(线间/身后/肋部)而非绝对坐标。
    97	- ⭐⭐ **底座属性必须"完备 + 每一项真有影响"(§3 现实审,用户 2026-07-20)。** 球员自我属性集要
    98	  对照现实**审完备**(缺不缺 vision/awareness、first-touch、aerial、agility/转身、惯用脚 等决策相关
    99	  能力),且**每一项都必须对 sim 有实际、可测的影响** —— **不能有装饰性/死属性**(占预算却不改
   100	  变任何结果)。审法:代码里查每属性读在哪 + 效果强弱,可疑的用敏感度探针实测。
   101	- ⭐⭐⭐ **两层眼睛(球员 + 教练)。** 用户 2026-07-20:"球队的风格是教练长眼睛吗"——
   102	  **对。球员的眼睛**看局部空间(我往哪跑/带);**教练的眼睛**看全局模式(压上/回收、
   103	  **超载哪一侧**、传中/控球、盯人/区域)。两层同一个道理:**感知维度 = 底座给,权重 =
   104	  进化调**。**⭐ 球队风格 = 教练基因(全队 DNA) × 球员个人偏好(个体偏移)。** 现状:
   105	  "教练 × 球员"的组合层**已有一半**(W1 教练 + W2 球员个人风格 + per-team policy 基因);
   106	  但**球员进攻跑位这只眼睛最蠢**(`supportSpot` 永远朝前、不回撤、不包抄)→ **先装这只**;
   107	  **教练那只眼睛**(TeamBrain 的模式/派人/超载集体决策)现在还比较**手写**(阈值+规则)→
   108	  升级成"教练基因加权的全局价值场"是**更深一层的后续**。落在 §5 分层世界:球员身份 +
   109	  教练哲学,都在进化、都长着自己的眼睛。
   110	- ⭐⭐⭐⭐ **这一整套 = 从底层重做「决策引擎」(用户 2026-07-20 拍板方向)。** 原话:
   111	  > 这其实是从底层做了一个足球引擎,这个我觉得方向是对的。
   112	  把**手画的行为/阵型表**,换成每个球员(之后每个教练)跑的 **感知 → 价值 → 动作** 决策核:
   113	  眼睛(球+对手+队友+场地+自身+动态)→ **gene 加权价值** → 选动作。所有打法(内切/包抄/
   114	  回撤/超载/强弱侧…)从**这一个引擎涌现**,不再一条条手写——这是 §1 灵魂的落地方式,也是本
   115	  会话三次单点杠杆失败的收束点(**往残缺引擎上贴行为,必回退**)。⚠ **诚实代价**:这是**承重级、
   116	  更慢、大概率"先变差再变好"**(三次回退就是这低谷的开始)——所以纪律更硬:**增量做、保留可
   117	  回退的现行基线、每块引擎必须在 §2 上打赢现行手调行为才 ship**(光"更有原理"不算)。
   118	- 诚实张力:不是一切都能涌现——**物理引擎 + 基因维度 + 价值场的感知维度**是我们手搭
   119	  的底座(球怎么飞、有哪些属性、"眼睛"看哪几项);但**位置/阵型/形状/跑位属于战术层,
   120	  应该涌现,不该是我们画的表或写死的行为**(见上条)。涌现的是**权重**,不是维度本身。
   121	  底座的职责是让基因**有意义**,而不是替球队摆好阵型或替球员决定跑哪。
   122	
   123	---
   124	
   125	## 2. 观赏性与手感 (WATCHABILITY & FEEL)
   126	
   127	**用户最烦的:中场乱抢（2026-07-18/19，反复强调）。** 原话——不喜欢的三个原因:
   128	> 他没有战术,没有观赏性,不喜欢所有人一起挤在一起。
   129	
   130	具体现象（用户）:
   131	> 绝大多数都是中场好多人一起挤,然后球乱飞突然变成单刀的。
   132	
   133	**所以要:**
   134	- **不要所有人挤在中路**;不要"乱抢→球乱飞→突然单刀"这种便宜、无战术的进球。
   135	- **战术要看得出来**（"可视化优秀"）——不同打法在场上肉眼可辨,不是一团混沌。
   136	- **流畅 > 打断**:play-feel 优先,别让机制补丁把比赛切碎（memory: fluency > interruptions）。
   137	- **默认干净**（用户 2026-07-19："把默认调试图层都关闭"）:第一眼看到的是**足球**,
   138	  不是调试图层。调试层仍可在面板里开。
   139	- 用户**真的在玩**(含**手机**,≤390–640px)——观感与操作以真实游玩为准;
   140	  headless 截图对像素不可信,信用户的浏览器。
   141	
   142	⚠ 任何"让 X 涌现"的机制,如果把比赛变得**更乱抢 / 更难看 / 战术更糊**,就是
   143	**失败**——即使它在别的指标上赢（2026-07-19 缩场教训:naive 缩场让乱抢恶化 →
   144	不可接受;必须协调地做，观感是硬门槛）。
   145	
   146	---
   147	
   148	## 3. 贴近现实 (REALISM — reference real football)
   149	
   150	**核心信条:如果现实足球不会这样,我们的底座就不该这样。** 用户 2026-07-19 的挑战:
   151	> 如果真的最优解是中路乱挤,为什么现实 6v6 不会这样?世界 6v6 比赛冠军
   152	> 都是那种把人堆到中间得了?
   153	
   154	对照现实来诊断能力值/属性/机制（用户:对照实况/FIFA/FM）。
   155	
   156	### ⭐ 3.0 "现实机制" = 整场游戏,不只是防守（用户 2026-07-19）
   157	
   158	> 现实机制还有那些远射,挑射,过掉门将,以及边路盘带,内切,到中路一般怎么做,
   159	> 回撤,一脚回垫等等……现实机制指的不只是防守,还有进攻,build up,套路等等,
   160	> 这些都应该从一个优秀底座长出来。
   161	
   162	**警戒:别把"贴近现实"窄化成防守。** 一个优秀底座要让**整场的真实机制**都能涌现:
   163	**进攻、build-up、套路,和防守**同等重要。下面列的动作**都是举例、不是穷举**,
   164	真正的标准是"**现实足球里存在的机制,在我们的底座里都该是可能的、gene/attr 驱动的,
   165	让合适的球队/球员进化去用**"(§1 灵魂:给能力,不手写)。已知要覆盖的层面:
   166	
   167	- **射门 repertoire**:远射、挑射（吊射)、过掉门将（趟过/推空当)、near/far post、
   168	  抢点、二次射门…… 由 finishing/技术/决策基因驱动,不是一种射门。
   169	- **持球/突破 repertoire**:边路盘带、内切、外线下底、**到中路后一般怎么处理**（分球/
   170	  做球/起脚/继续带)、变向摆脱、护球…… 边路武器库的细节见 §3.1。
   171	- **接应/做球/链接**:**回撤接球**(宽度+长度都可回撤)、**一脚回垫/做球**（lay-off)、
   172	  三角配合、二过一、撞墙、第三人跑动…… 传控队靠这些推进。
   173	- **build-up（后场组织)**:门将/后场出球的真实选择,由后往前的层层推进,
   174	  被逼抢时的解压出球,长传转移…… 不是无脑大脚或一条道。
   175	- **套路（set-plays + 固定配合)**:角球/任意球/界外球的真实套路,以及**运动战里的
   176	  固定配合**（overload-to-isolate、肋部三角、下底倒三角等)——都应能作为可选择的
   177	  打法涌现,而非写死。
   178	
   179	### 3.1 已确立的现实锚点（本会话深挖:防守 + 边路武器库 —— 现实机制的一部分）
   180	
   181	这些是 2026-07-19 这轮已经量化确立的锚点(防守两范式 + 中/边不对称 + 边路武器库);
   182	它们是 §3.0 全场机制里被先钻研的一角,不是全部:
   183	
   184	- **防守两大范式的权衡,参考现实**（用户 2026-07-19："过一个还有另一个 vs 盯人
   185	  的权衡,应该参考现实"）:
   186	  - **区域防守 = "过一个还有另一个"**（分层补防,中路盘不穿;被缝隙/超载/无人盯的插上破）。
   187	  - **盯人**（没有自由人;但过了你的人就没人补 + 可被跑动扯出空当）。
   188	  - → 石头剪刀布:盘带克盯人、宽度/配合克区域,各有克星,**从 scheme 基因涌现**。
   189	- **中路 vs 边路的空间不对称,要从底座长出来**（用户 2026-07-19）:
   190	  > 中路盘带很容易被很多人夹击,边路往往有空间,人数优势。这一点需要底座
   191	  > 本身就能让他体现。
   192	- **边路是一整套武器库,都要有底座支撑**（用户 2026-07-19）:
   193	  高空传中 / 低倒三角 / **还没到底线就给肋部前插的人（早球）** / **边路三角配合
   194	  （二过一、做球、打身后 —— 传控队常做）**。
   195	- **边锋宽度应该是能变的**——回撤接球时**宽度 + 长度都可能回撤**（朝球靠,拿稳再拉开进攻）。
   196	- **夹击/补防是球队能自由选择的,不是我们硬规定的**——有的队不夹击,结果被打穿,活该。
   197	- 细节真实:解围一般**有方向**（不是乱踢）;等等。
   198	
   199	**故意的街机式偏离——不要"修"回去**（deliberate arcade deviations, memory）:
   200	越位 → 门球（不是任意球）、禁区内持球门将解围清空、门球适用越位……这些是**有意**的
   201	简化/取舍,不是 bug。改动前先分辨是"违背现实的缺陷"还是"故意的街机取舍"。
   202	
   203	---
   204	
   205	## 4. 涌现的多样性 (EMERGENT DIVERSITY)
   206	
   207	- 战术 / 风格 / 技巧 / 二过一 **自己长出来 + 互相竞争 + 进化**（见 §1）。
   208	- **多样性需要约束**（用户 2026-07-14）:没有资源上限,进化会把每项属性拉满 →
   209	  "什么都强"胜出 → 风格不分化。**squad 点数预算**（升一项要降一项）逼出取舍 →
   210	  不同原型涌现。✅ 已上线（SQUAD_BUDGET）。
   211	- **进化结果要更快 + 更显眼**（用户 2026-07-14）:分化不应到 20–50 赛季才看得出;
   212	  要 style 铭牌 + 可视化让它早早肉眼可见。目标:≤8–10 赛季可见聚类。
   213	- **每个个体都有赢来的身份**:每个球员、每个教练、每个赛季/杯赛都有独特闪光点
   214	  与打法,且**都在 evo**。铭牌/时代/叙事**从数据发现**,不是预设分类。
   215	
   216	---
   217	
   218	## 5. 会进化的世界 (THE EVOLVING WORLD — 4 层)
   219	
   220	**顺序 = 杠杆**（binding）:引擎（有多样性）→ 可视化（多样性被看见）→ 世界（多样性有
   221	面孔和故事）→ 底座加厚。
   222	
   223	- **引擎**:进化真正产出多样性（属性扩展 + 预算 + results-dominant 适应度）。
   224	- **可视化**:style-space 地图、分化曲线、数据驱动铭牌——让进化**看得见**。
   225	- **世界**:**教练**（战术基因的化身 + 通过流动传播哲学的 memetic 通道）、**转会/自由市场**
   226	  （第二条基因通道）、**赛季/杯赛编年史**（完全从记录派生,时代名从数据聚类涌现）。
   227	- **底座加厚**（长期,拉动式）:每项都要过"它给基因一个**新的收益面**吗?"的测试
   228	  ——轮换/替补、状态/士气、伤病、主场效应、有记忆的解说。
   229	- **元规则贯穿每一层**:教练哲学是进化基因,不是预设原型;叙事层**只读**记录,永不反哺 sim。
   230	
   231	---
   232	
   233	## 6. 工作纪律 (HOW WE WORK — 也是用户明确要的)
   234	
   235	- **一次一根杠杆 + probe-first + A/B 才提交**:每 phase 一个杠杆,先探针量化,
   236	  对照上一 tag A/B,过全门（vitest、visual-debug×2、calibrate、goals-warming、
   237	  fingerprint 重刷),再提交/打 tag/推。
   238	- **诚实回退**:测不过就回退,如实报告数字;别把不 work 的东西硬上。
   239	- **A/B 只决定"这一版 ship 还是 revert",不决定"这个方向是否死"**（revert→reframe,
   240	  用户 2026-07-18）:被回退的尝试可拆成"安全 UI 半"+"探针门控的行为半",
   241	  以蓝图要求进入未来 phase。
   242	- **play 报告驱动 phase**:用户玩 → 反馈 → 排期。
   243	- 记忆写 durable-only;live 状态进账本（CHECKPOINT/ROADMAP/BLUEPRINT）。
   244	
   245	---
   246	
   247	## 7. 怎么用这份金标准 (HOW TO USE THIS)
   248	
   249	1. **每个改动先问:它服务 §0–§5 的哪一条?违反哪一条?** 违反愿景的,愿景赢——
   250	   哪怕它让某个指标好看。
   251	2. **"让某某涌现"的杠杆,必须同时通过 §2 观赏性硬门槛**（不能更乱抢/更难看/战术更糊）
   252	   和 §1 涌现纪律（不能手写行为、只能给 gene-gated 能力）和 §3 现实锚点。
   253	3. 大结构改动（如缩小球场以匹配 6v6 密度）**只有在能同时满足 §2 + §3 + §1** 时才值得投;
   254	   probe 先行,拿本文件当验收标准。
   255	4. 有新的"我希望"就并进来,并在相关账本里回指本文件。

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg -n '"'^#{1,4} '"' docs/EVO-BLUEPRINT.md docs/ROADMAP.md"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
docs/EVO-BLUEPRINT.md:1:# The EVO WORLD blueprint (2026-07-14, user-ratified) — the master plan
docs/EVO-BLUEPRINT.md:11:## The vision (the user, 2026-07-14)
docs/EVO-BLUEPRINT.md:31:## Principles (binding, all stages)
docs/EVO-BLUEPRINT.md:47:## Stage 1 — ENGINE: make evolution actually produce diversity
docs/EVO-BLUEPRINT.md:57:## Stage 2 — VISIBILITY: make evolution seen (phase 49, right after the budget)
docs/EVO-BLUEPRINT.md:74:## Stage 3 — WORLD: give evolution faces and stories
docs/EVO-BLUEPRINT.md:101:## Stage 4 — SUBSTRATE thickening (long-term, pull-based)
docs/EVO-BLUEPRINT.md:108:## The post-Stage-3 queue (2026-07-14 gap review, user-ratified) — ⭐ THE PHASE PLAN FOR 57+
docs/EVO-BLUEPRINT.md:215:## Status ledger
docs/ROADMAP.md:1:# Roadmap — shipped through phase-92 (containment repriced: wins neutral head-to-head; adoption still unstable — the fork sharpens)
docs/ROADMAP.md:3:## ⭐⭐⭐⭐ THE GOLD STANDARD IS [`VISION.md`](VISION.md) (2026-07-19) — measure every decision against it
docs/ROADMAP.md:4:## ⭐⭐⭐ THE MASTER PLAN IS NOW [`EVO-BLUEPRINT.md`](EVO-BLUEPRINT.md) (2026-07-14, user-ratified)
docs/ROADMAP.md:2489:## ⭐⭐ THE EMERGENCE PIVOT — [`EMERGENCE-PIVOT.md`](EMERGENCE-PIVOT.md) (2026-07-14)
docs/ROADMAP.md:2525:## Standing rules & conventions (LIVE — read before any phase)

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'nl -ba src/evolution/playerGenome.ts; nl -ba src/evolution/traits.ts; nl -ba src/evolution/careers.ts; nl -ba src/ai/perception.ts'[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	import { clamp01 } from '../utils/math';
     2	import type { Rng } from '../utils/rng';
     3	import type { Role } from '../sim/types';
     4	
     5	/**
     6	 * Squad DNA — per-player attribute genes that evolve alongside the team's
     7	 * TacticalGenome. All 0..1, all read directly by the simulation, so squads
     8	 * feel physically different, not just tactically different.
     9	 *
    10	 * Phase 47 (the emergence pivot's attribute richness): the overloaded
    11	 * `technique` split into PASSING (striking a ball toward a target: pass /
    12	 * cross / through / loft / switch / FK accuracy+power) and DRIBBLING
    13	 * (the ball at the feet: first touch, carry control, tackle resistance,
    14	 * 1v1s, shot strike), plus two new payoff dimensions:
    15	 *
    16	 *   pace       top speed & acceleration (±12% speed)
    17	 *   passing    pass/cross/loft accuracy and power retention
    18	 *   dribbling  first touch, carry push control, beating a man
    19	 *   finishing  shot accuracy (spread) and shot confidence
    20	 *   defending  tackle success + tighter marking
    21	 *   strength   aerial power, shielding, the 50/50 shove
    22	 *   stamina    fatigue drain & recovery rate
    23	 *   reflexes   keeper save probability & reach — GK-ONLY. Only the keeper
    24	 *              (squad[0]) ever reads it; for the eight outfielders it is a
    25	 *              DEAD stat, so `squadTotal` no longer charges them for it
    26	 *              (Phase-120 engine-input cleanup — see squadTotal below).
    27	 */
    28	export interface PlayerAttributes {
    29	  pace: number;
    30	  passing: number;
    31	  dribbling: number;
    32	  finishing: number;
    33	  defending: number;
    34	  strength: number;
    35	  stamina: number;
    36	  reflexes: number;
    37	  /**
    38	   * POSITIONING (Phase 119j) — the mover's IQ, orthogonal to pace (how fast)
    39	   * and dribbling/passing (how clean the touch): WHERE to be, WHEN to move,
    40	   * and how well to receive under pressure. It scales OUTCOMES that were
    41	   * uniform before (first-touch reception the first wiring point; run timing,
    42	   * space-finding and defensive reads to follow), so the off-ball
    43	   * dilemma-creators (overload / seam run / give-and-go / cover) become
    44	   * evolvable and can PAY — the enabler five failed levers (119c, 119d-1,
    45	   * 119i) all lacked. Appended LAST in ATTR_KEYS so founders' other attrs
    46	   * draw byte-identical; SQUAD_BUDGET raised 36→40.5 to keep the tuned 0.5
    47	   * density, so positioning is a real budget TRADE-OFF, not free.
    48	   */
    49	  positioning: number;
    50	}
    51	
    52	export const ATTR_KEYS = [
    53	  'pace', 'passing', 'dribbling', 'finishing', 'defending', 'strength', 'stamina', 'reflexes',
    54	  'positioning',
    55	] as const;
    56	export type AttrKey = (typeof ATTR_KEYS)[number];
    57	
    58	/** Squad slot order (mirrors sim/types ROLES): [GK, DF, MF, WGL, WGR, ST]. */
    59	export const SQUAD_ROLES: Role[] = ['GK', 'DF', 'MF', 'WG', 'WG', 'ST'];
    60	/** The full roster (Phase 61): starters + a 3-man bench with NOMINAL roles
    61	 * (market matching / records / founding bias — on the pitch a sub assumes
    62	 * the slot he replaces). Mirrors sim/types ROSTER_ROLES. */
    63	export const ROSTER_ROLES: Role[] = [...SQUAD_ROLES, 'DF', 'MF', 'ST'];
    64	
    65	/** Each role tends to be born good at its job (bias added, then clamped).
    66	 * strength/stamina carry NO bias (Phase 47) — where the physical game pays
    67	 * is evolution's to discover. (ROLE_BIAS itself retires in the budget
    68	 * phase: newgens will inherit their slot's bloodline instead.) */
    69	const ROLE_BIAS: Record<Role, Partial<PlayerAttributes>> = {
    70	  GK: { reflexes: 0.3 },
    71	  DF: { defending: 0.25 },
    72	  MF: { passing: 0.2 },
    73	  WG: { pace: 0.25 },
    74	  ST: { finishing: 0.25 },
    75	};
    76	
    77	export function randomPlayer(rng: Rng, role: Role): PlayerAttributes {
    78	  const p = {} as PlayerAttributes;
    79	  for (const k of ATTR_KEYS) p[k] = rng.range(0.1, 0.7);
    80	  const bias = ROLE_BIAS[role];
    81	  for (const k of Object.keys(bias) as AttrKey[]) p[k] = clamp01(p[k] + (bias[k] ?? 0));
    82	  return p;
    83	}
    84	
    85	/** A founding ROSTER (Phase 61): six starters + three bench players, all
    86	 * role-biased at birth (bias is only a starting point — bloodline heredity
    87	 * owns the long run). */
    88	export function randomSquad(rng: Rng): PlayerAttributes[] {
    89	  return ROSTER_ROLES.map((role) => randomPlayer(rng, role));
    90	}
    91	
    92	export interface SquadMutateOptions {
    93	  /** Probability each attribute of each player mutates. */
    94	  rate?: number;
    95	  /** Std-dev of gaussian noise. */
    96	  scale?: number;
    97	}
    98	
    99	export function mutateSquad(squad: PlayerAttributes[], rng: Rng, opts: SquadMutateOptions = {}): PlayerAttributes[] {
   100	  const rate = opts.rate ?? 0.35;
   101	  const scale = opts.scale ?? 0.1;
   102	  return squad.map((p) => {
   103	    const out = { ...p };
   104	    for (const k of ATTR_KEYS) {
   105	      if (rng.chance(rate)) out[k] = clamp01(out[k] + rng.gaussian() * scale);
   106	    }
   107	    return out;
   108	  });
   109	}
   110	
   111	/**
   112	 * Position-wise crossover: for each squad slot the child inherits that slot's
   113	 * player from parent A, parent B, or a blend — like signing a mixed starting
   114	 * five from both academies.
   115	 */
   116	export function crossoverSquads(a: PlayerAttributes[], b: PlayerAttributes[], rng: Rng): PlayerAttributes[] {
   117	  return a.map((pa, i) => {
   118	    const pb = b[i];
   119	    const r = rng.next();
   120	    if (r < 0.4) return { ...pa };
   121	    if (r < 0.8) return { ...pb };
   122	    const mix = {} as PlayerAttributes;
   123	    for (const k of ATTR_KEYS) mix[k] = (pa[k] + pb[k]) / 2;
   124	    return mix;
   125	  });
   126	}
   127	
   128	/**
   129	 * The RESOURCE BUDGET (Phase 48 — the emergence keystone): a hard cap on a
   130	 * squad's total attribute points. Without it evolution maxes EVERY attribute
   131	 * ("good at everything" wins) and archetypes stay faint; with it, raising
   132	 * one attribute COSTS another and specialisation is forced. SQUAD-level on
   133	 * purpose: star-plus-role-players vs a balanced six is itself an evolvable
   134	 * axis. Phase 61 (the bench): the budget covers the whole 9-man ROSTER —
   135	 * 40.5 = 9 players × 9 attrs × 0.5 (Phase 119j raised it 36→40.5 with the
   136	 * positioning attr, keeping the tuned 0.5 density so the existing physics
   137	 * still centres on 0.5 and positioning is a real trade-off, not free). That
   138	 * makes rotation a REAL trade-off: a deep bench is funded by shaving the
   139	 * starting six, a star XI leaves its bench (and its fresh legs) thin.
   140	 * Founding rosters roll ~0.4 density, so there is headroom before the cap bites.
   141	 *
   142	 * Phase-120 (POSITION-AWARE budget — 门将底座和外场不一样): the budget now
   143	 * charges each slot only for the attributes that actually FIRE for its
   144	 * position. `reflexes` is keeper-only (the 8 outfielders never read it), and
   145	 * symmetrically `finishing` + `defending` are DEAD for the keeper (a GK never
   146	 * shoots, and its 1v1s/claims resolve on reflexes, not tackles) — so the
   147	 * keeper's budget base is its OWN: reflexes + distribution + physique +
   148	 * positioning, not the outfield scoring/tackling stats. The cap dropped
   149	 * 40.5 → 35.5 IN LOCKSTEP (was 81 attr-slots × 0.5; now 8 outfield-reflexes +
   150	 * GK-finishing + GK-defending = 10 dead slots are free → 71 counted × 0.5 =
   151	 * 35.5) so USEFUL-attr density stays the tuned 0.5 and physics is unmoved.
   152	 * The point is not more quality — it closes the "dump" (evolution could park
   153	 * points in a dead stat to dodge the cap); now every point trades against a
   154	 * LIVE attribute, sharpening specialisation.
   155	 */
   156	export const SQUAD_BUDGET = 35.5;
   157	
   158	/**
   159	 * Which attributes cost budget for a slot (Phase-120 position-aware). The
   160	 * keeper (index 0 by invariant — Team.goalkeeper === players[0], ROSTER_ROLES
   161	 * [0] === 'GK', retirees replaced like-for-like at the same slot) pays for
   162	 * everything EXCEPT finishing/defending (dead for a GK); every outfielder pays
   163	 * for everything EXCEPT reflexes (keeper-only). The uncounted attrs still
   164	 * exist and still get scaled by enforceBudget — they just ride along free, so
   165	 * the counted total lands exactly on the cap.
   166	 */
   167	export function countsForBudget(k: AttrKey, isGK: boolean): boolean {
   168	  if (isGK) return k !== 'finishing' && k !== 'defending';
   169	  return k !== 'reflexes';
   170	}
   171	
   172	export function squadTotal(squad: PlayerAttributes[]): number {
   173	  let t = 0;
   174	  for (let i = 0; i < squad.length; i++) {
   175	    const p = squad[i];
   176	    const isGK = i === 0;
   177	    for (const k of ATTR_KEYS) if (countsForBudget(k, isGK)) t += p[k];
   178	  }
   179	  return t;
   180	}
   181	
   182	/** Proportional rescale onto the cap — pure, order-free, unbiased (evolution
   183	 * chooses where the shave lands by choosing where the points sit). */
   184	export function enforceBudget(squad: PlayerAttributes[]): PlayerAttributes[] {
   185	  const total = squadTotal(squad);
   186	  if (total <= SQUAD_BUDGET) return squad;
   187	  const mul = SQUAD_BUDGET / total;
   188	  return squad.map((p) => {
   189	    const out = {} as PlayerAttributes;
   190	    for (const k of ATTR_KEYS) out[k] = p[k] * mul;
   191	    return out;
   192	  });
   193	}
   194	
   195	/**
   196	 * Academy heredity (Phase 48): a retiring player's successor is grown in the
   197	 * club's image — the retiree's attribute profile, mutated. This retires
   198	 * ROLE_BIAS from the newgen path (the bias survives only at FOUNDING, where
   199	 * selection has nothing to work with yet): what a club's left winger IS is
   200	 * now bloodline, discovered by evolution, not set by us. The age curve
   201	 * regrows a 17-year-old's inherited profile from there.
   202	 *
   203	 * School-linked variation (Phase 94): the academy grows what the coach's
   204	 * philosophy NEEDS. The jockey school's problem was DISCOVERY, not payoff —
   205	 * containment only pays as a defending+jockeyBias PACKAGE, a two-locus
   206	 * valley that drift rarely crosses in a 16-club population (phases 88/92).
   207	 * So the newgen intake drifts along the philosophy axis: a containment
   208	 * coach (jockeyBias>0.5) pulls the heir toward defending, a dive-in coach
   209	 * pulls toward pace — a zero-sum transfer on one axis (max ±0.12, one
   210	 * mutation σ), on top of unbiased bloodline noise. Fitness stays pure
   211	 * results and founders stay random: this biases VARIATION, not selection.
   212	 */
   213	export function newgenFromBloodline(
   214	  retiree: PlayerAttributes, rng: Rng, coachJockeyBias = 0.5,
   215	): PlayerAttributes {
   216	  const out = {} as PlayerAttributes;
   217	  for (const k of ATTR_KEYS) out[k] = clamp01(retiree[k] + rng.gaussian() * 0.12);
   218	  const pull = (coachJockeyBias - 0.5) * 0.24;
   219	  out.defending = clamp01(out.defending + pull);
   220	  out.pace = clamp01(out.pace - pull);
   221	  return out;
   222	}
   223	
   224	/** Squad-average of each attribute — shown on team cards. */
   225	export function squadSummary(squad: PlayerAttributes[]): PlayerAttributes {
   226	  const sum = {} as PlayerAttributes;
   227	  for (const k of ATTR_KEYS) sum[k] = 0;
   228	  for (const p of squad) for (const k of ATTR_KEYS) sum[k] += p[k];
   229	  for (const k of ATTR_KEYS) sum[k] /= Math.max(squad.length, 1);
   230	  return sum;
   231	}
     1	import type { Role } from '../sim/types';
     2	import type { PlayerAttributes } from './playerGenome';
     3	import type { PlayerStyle } from './playerStyle';
     4	
     5	/**
     6	 * Player TRAITS (Phase 39, style traits Phase 54) — small, readable
     7	 * individuality on top of the attribute vector. DERIVED, never stored: a
     8	 * pure function of (attrs, role, style), so newgens and developing players
     9	 * grow into (and out of) them with no save-schema change. Capped at 2 per
    10	 * player, 9 types total (the anti-soup rule) — and every one has a PLAY
    11	 * effect:
    12	 *
    13	 *   clinical  aimMargin −0.1 (shaves the post)     shooters, finishing
    14	 *   poacher   run target pulls toward the goalmouth ST instinct-finisher
    15	 *   playmaker pass-lane read ×1.15                  technique on the ball
    16	 *   enforcer  tackle +0.04, foul +0.02              the destroyer
    17	 *   engine    stamina drain ×0.9                    the motor
    18	 *   cat       keeper reach +0.12                    GK reflexes
    19	 *
    20	 * The Phase-54 style traits are BADGES OF GENES: their play effect is the
    21	 * personal-style multiplier itself (already live via rolePolicies) — the
    22	 * trait names a bias that is provably shaping decisions, it never adds a
    23	 * second hand-tuned effect on top. The sim's own traitsOf call passes no
    24	 * style (the attr traits' effects stay sim-side; the style ones act
    25	 * through the policy wire):
    26	 *
    27	 *   maverick  longShotW ≥ 1.3                       shoots from anywhere
    28	 *   trickster dribbleBase ≥ 1.3                     take-on addict
    29	 *   shadow    runScore ≥ 1.3                        the late runner
    30	 */
    31	export type Trait =
    32	  | 'clinical' | 'playmaker' | 'enforcer' | 'engine' | 'poacher' | 'cat'
    33	  | 'maverick' | 'trickster' | 'shadow';
    34	
    35	export const TRAIT_KEYS: readonly Trait[] = [
    36	  'clinical', 'playmaker', 'enforcer', 'engine', 'poacher', 'cat',
    37	  'maverick', 'trickster', 'shadow',
    38	];
    39	
    40	/** Display chips — emoji read on a phone in any language. */
    41	export const TRAIT_EMOJI: Record<Trait, string> = {
    42	  clinical: '🎯',
    43	  playmaker: '🎩',
    44	  enforcer: '🛡️',
    45	  engine: '🔋',
    46	  poacher: '🦊',
    47	  cat: '🐱',
    48	  maverick: '🎲',
    49	  trickster: '🪄',
    50	  shadow: '👻',
    51	};
    52	
    53	/** Candidate traits with how far past their bar this player is. */
    54	function candidates(
    55	  a: PlayerAttributes, role: Role, style?: PlayerStyle,
    56	): Array<{ t: Trait; excess: number }> {
    57	  const out: Array<{ t: Trait; excess: number }> = [];
    58	  if (role === 'GK') {
    59	    if (a.reflexes >= 0.85) out.push({ t: 'cat', excess: a.reflexes - 0.85 });
    60	    return out; // keepers are keepers — outfield traits stay outfield
    61	  }
    62	  if (role !== 'DF' && a.finishing >= 0.8) out.push({ t: 'clinical', excess: a.finishing - 0.8 });
    63	  if (role === 'ST' && a.finishing >= 0.75 && a.dribbling < 0.6) {
    64	    out.push({ t: 'poacher', excess: a.finishing - 0.75 });
    65	  }
    66	  if (a.passing >= 0.8) out.push({ t: 'playmaker', excess: a.passing - 0.8 });
    67	  if (a.defending >= 0.8) out.push({ t: 'enforcer', excess: a.defending - 0.8 });
    68	  if (a.pace >= 0.82) out.push({ t: 'engine', excess: a.pace - 0.82 });
    69	  if (style) {
    70	    // Bars at 1.2: the realized population spread is ~±0.05 with tails to
    71	    // ~±0.2 (probe-measured) — 1.3 was unreachable, 1.2 is the honest tail.
    72	    if (style.longShotW >= 1.2) out.push({ t: 'maverick', excess: (style.longShotW - 1.2) * 2 });
    73	    if (style.dribbleBase >= 1.2) out.push({ t: 'trickster', excess: (style.dribbleBase - 1.2) * 2 });
    74	    if (style.runScore >= 1.2) out.push({ t: 'shadow', excess: (style.runScore - 1.2) * 2 });
    75	  }
    76	  return out;
    77	}
    78	
    79	/** The 1–2 traits this player IS (deterministic: sorted by excess, ties by
    80	 * table order so equal-excess picks never depend on insertion luck). */
    81	export function traitsOf(a: PlayerAttributes, role: Role, style?: PlayerStyle): Trait[] {
    82	  return candidates(a, role, style)
    83	    .sort((x, y) => y.excess - x.excess || TRAIT_KEYS.indexOf(x.t) - TRAIT_KEYS.indexOf(y.t))
    84	    .slice(0, 2)
    85	    .map((c) => c.t);
    86	}
     1	import { clamp01 } from '../utils/math';
     2	import type { Rng } from '../utils/rng';
     3	import { ATTR_KEYS, type AttrKey, type PlayerAttributes } from './playerGenome';
     4	
     5	/**
     6	 * Player careers (Phase 26): every squad member has an age, develops along an
     7	 * age curve, retires in their mid-thirties and is replaced by a newgen — so
     8	 * squads become dynasties of individuals instead of rerolled stat blocks.
     9	 * Everything is seeded (the League's aging pass owns the Rng); nothing here
    10	 * touches the sim — careers act ONLY through the attribute genes the sim
    11	 * already reads.
    12	 */
    13	
    14	/** Career ledger, accumulated from per-player season stats at season end. */
    15	export interface PlayerCareer {
    16	  seasons: number;
    17	  goals: number;
    18	  assists: number;
    19	  saves: number;
    20	  recoveries: number;
    21	  /** Career highlight (Phase 54): the best single season, banked at season
    22	   * end — the player card's "remember S12" line. Absent on old ledgers. */
    23	  bestGoals?: number;
    24	  bestGoalsSeason?: number;
    25	  bestRating?: number;
    26	  bestRatingSeason?: number;
    27	}
    28	
    29	export const emptyCareer = (): PlayerCareer => ({
    30	  seasons: 0,
    31	  goals: 0,
    32	  assists: 0,
    33	  saves: 0,
    34	  recoveries: 0,
    35	});
    36	
    37	/** A retired player worth remembering — the hall of fame keeps the best. */
    38	export interface LegendEntry {
    39	  name: string;
    40	  team: string;
    41	  role: string;
    42	  age: number;
    43	  career: PlayerCareer;
    44	}
    45	
    46	/** Newgens debut at 17–19. */
    47	export function rookieAge(rng: Rng): number {
    48	  return 17 + rng.int(0, 2);
    49	}
    50	
    51	/** Founded/backfilled squads span the whole career arc (20–32). */
    52	export function veteranAge(rng: Rng): number {
    53	  return rng.int(20, 32);
    54	}
    55	
    56	/** Pace and stamina fade fastest with age; passing craft holds longest.
    57	 * The weights MEAN 1.0 across the keys (Phase 47) so a full career still
    58	 * round-trips and league attribute means stay stable across generations.
    59	 * Phase 119j adds positioning at 1.0 (average decline) — keeps the existing
    60	 * eight curves untouched and the 9-key sum at 9.0 (mean 1.0). A slower,
    61	 * mental-holds-with-age curve is a candidate refinement, deferred so the
    62	 * tuned physical/technical arcs don't move under this change. */
    63	const DECLINE_W: Record<AttrKey, number> = {
    64	  pace: 1.5,
    65	  passing: 0.6,
    66	  dribbling: 0.8,
    67	  finishing: 0.9,
    68	  defending: 0.9,
    69	  strength: 1.0,
    70	  stamina: 1.2,
    71	  reflexes: 1.1,
    72	  positioning: 1.0,
    73	};
    74	
    75	/**
    76	 * One season of age-driven development: strong growth for teenagers tapering
    77	 * to nothing by 24, a plateau through the twenties, decline from 30 — plus a
    78	 * little seeded noise so no two careers are identical. Growth up and decline
    79	 * down are sized so a full career roughly round-trips: the league's attribute
    80	 * means stay stable across generations (regression-tested over 15 seasons).
    81	 */
    82	export function developPlayer(p: PlayerAttributes, age: number, rng: Rng): PlayerAttributes {
    83	  const growth = age <= 23 ? (0.03 * (24 - age)) / 7 : 0;
    84	  const decline = age >= 30 ? -0.012 * (age - 29) : 0;
    85	  const out = {} as PlayerAttributes;
    86	  for (const k of ATTR_KEYS) {
    87	    out[k] = clamp01(p[k] + growth + decline * DECLINE_W[k] + rng.gaussian() * 0.015);
    88	  }
    89	  return out;
    90	}
    91	
    92	/** Retirement odds at season end: none before 32, certain by 36. */
    93	export function retireChance(age: number): number {
    94	  if (age < 32) return 0;
    95	  return Math.min(1, 0.15 + (age - 32) * 0.22);
    96	}
     1	import { clamp01 } from '../utils/math';
     2	import {
     3	  add, closestPointOnSegment, dist, len, norm, scale, sub, type V2,
     4	} from '../utils/vec';
     5	import { BALL_FRICTION_K, GRAVITY, HALF_L, HALF_W, UNSET_BLOCK_WEIGHT } from '../sim/constants';
     6	import type { Ball } from '../sim/Ball';
     7	import type { Player } from '../sim/Player';
     8	
     9	/**
    10	 * Perception helpers — small pure queries the utility scorers are built from.
    11	 * All return values are normalized to [0, 1] so scoring math stays readable.
    12	 */
    13	
    14	/** Pressure on a position from the nearest opponent: 1 at 0m, 0 beyond 6m. */
    15	export function pressureAt(pos: V2, opponents: Player[]): number {
    16	  let best = Infinity;
    17	  for (const o of opponents) {
    18	    if (o.sentOff) continue;
    19	    const d = dist(o.pos, pos);
    20	    if (d < best) best = d;
    21	  }
    22	  return clamp01(1 - best / 6);
    23	}
    24	
    25	/**
    26	 * 脱压带球 (Phase 34.2, user report "球员不会向后带球"): a pressured
    27	 * carrier outside the final third whose FORWARD path is closed should
    28	 * carry the ball AWAY from the press — back or sideways — to buy time,
    29	 * instead of stopping dead or driving into bodies. Returns the escape
    30	 * direction (opponent-repulsion within 8m, tilted lateral so the carry
    31	 * arcs to the safe wing rather than straight into his own goalmouth) and
    32	 * the space along it, or null when this is not an escape situation.
    33	 * Shared by the SCORER and the EXECUTOR so the utility and the legs agree.
    34	 */
    35	export function escapeCarry(
    36	  p: Player,
    37	  attackDir: number,
    38	  localX: number,
    39	  opponents: Player[],
    40	  holdCorner = false,
    41	): { dir: V2; space: number } | null {
    42	  // 打卡油角 (Phase 35): a side killing the game late carries INTO the
    43	  // attacking corner and shields — for it, the final-third gate opens.
    44	  if (localX > 15 && !holdCorner) return null; // final third: go at them or release, never turn tail
    45	  const pressure = pressureAt(p.pos, opponents);
    46	  if (pressure < 0.45) return null;
    47	  let rx = 0;
    48	  let ry = 0;
    49	  for (const o of opponents) {
    50	    if (o.sentOff) continue;
    51	    const dx = p.pos.x - o.pos.x;
    52	    const dy = p.pos.y - o.pos.y;
    53	    const d2 = dx * dx + dy * dy;
    54	    if (d2 > 64 || d2 < 1e-6) continue;
    55	    rx += dx / d2;
    56	    ry += dy / d2;
    57	  }
    58	  if (rx === 0 && ry === 0) return null;
    59	  if (holdCorner && localX > 0) {
    60	    // Corner-flag holding (Phase 35): blend the repulsion with a pull
    61	    // toward the attacking corner, guarded off the lines themselves —
    62	    // on the touchline the pull runs ALONG it, at the byline it holds.
    63	    const rep = norm({ x: rx, y: ry });
    64	    const cx = localX > HALF_L - 8 ? 0 : attackDir;
    65	    const cy = Math.abs(p.pos.y) > HALF_W - 6 ? 0 : Math.sign(p.pos.y || 1);
    66	    if (cx !== 0 || cy !== 0) {
    67	      const corner = norm({ x: cx, y: cy });
    68	      rx = rep.x + corner.x * 1.2;
    69	      ry = rep.y + corner.y * 1.2;
    70	    }
    71	  } else {
    72	    // Tilt lateral: straight retreats toward the own goal are the last resort.
    73	    // 边锋 (34.3, user report): a WIDE carrier escapes to HIS touchline or
    74	    // backward — never on an inward arc across the press. Guarded near the
    75	    // line itself, where the outward pull would carry into touch.
    76	    const wide = Math.abs(p.pos.y) > 8 && Math.abs(p.pos.y) < HALF_W - 5;
    77	    const tiltSign = wide ? Math.sign(p.pos.y) : Math.sign(ry || p.pos.y || 1);
    78	    if (wide && Math.sign(ry) !== tiltSign) ry = Math.abs(ry) * tiltSign * 0.6;
    79	    ry += tiltSign * 0.35 * Math.hypot(rx, ry);
    80	  }
    81	  let dir = norm({ x: rx, y: ry });
    82	  const forward = spaceAhead(p, { x: attackDir, y: 0 }, opponents);
    83	  // Holding late in the attacking half, "the front door is open" is not a
    84	  // reason to charge at goal — the corner carry stands.
    85	  if (forward > 0.55 && !(holdCorner && localX > 0)) return null;
    86	  const space = spaceAhead(p, dir, opponents);
    87	  if (space < 0.25) return null; // boxed in on every side — not an escape
    88	  return { dir, space };
    89	}
    90	
    91	/**
    92	 * Friction-free landing of an airborne ball: time to touch down and the
    93	 * exact point. The same closed form used to live inline in interceptBall,
    94	 * TeamBrain's drop-chaser and the executor's crash re-route — ONE
    95	 * projector now, so when the ball learns to curve (Phase 37 Magnus) every
    96	 * consumer reads the same corrected flight.
    97	 */
    98	export function ballLanding(ball: Ball): { t: number; x: number; y: number } {
    99	  const t = (ball.vz + Math.sqrt(ball.vz * ball.vz + 2 * GRAVITY * ball.z)) / GRAVITY;
   100	  const dx = ball.vel.x * t;
   101	  const dy = ball.vel.y * t;
   102	  // Magnus (Phase 37): a constant-rate spin flies a circular arc whose
   103	  // chord is the straight displacement rotated by HALF the total turn —
   104	  // the same closed form the kick's pre-compensation used, so designed
   105	  // deliveries land where they were designed to.
   106	  if (ball.spin !== 0) {
   107	    const half = ball.spin * t * 0.5;
   108	    const c = Math.cos(half);
   109	    const s = Math.sin(half);
   110	    return { t, x: ball.pos.x + dx * c - dy * s, y: ball.pos.y + dx * s + dy * c };
   111	  }
   112	  return { t, x: ball.pos.x + dx, y: ball.pos.y + dy };
   113	}
   114	
   115	/**
   116	 * How clean an AERIAL lane is (Phase 28): a lofted ball only cares about
   117	 * opponents close enough to the kicker to charge it down before it rises —
   118	 * everything downfield is flown over. Landing safety is the receiver's
   119	 * openness, scored separately by the caller.
   120	 */
   121	export function airLaneOpenness(from: V2, opponents: Player[]): number {
   122	  let worst = 1;
   123	  for (const o of opponents) {
   124	    if (o.sentOff) continue;
   125	    const d = dist(o.pos, from);
   126	    if (d < 1.5) continue; // right on top of the kicker — the chip clears them
   127	    worst = Math.min(worst, clamp01((d - 1.5) / 3));
   128	  }
   129	  return worst;
   130	}
   131	
   132	/** How clean the passing lane from `from` to `to` is (1 = wide open). */
   133	export function laneOpenness(from: V2, to: V2, opponents: Player[]): number {
   134	  let worst = 1;
   135	  for (const o of opponents) {
   136	    if (o.sentOff) continue;
   137	    const cp = closestPointOnSegment(from, to, o.pos);
   138	    // Ignore defenders standing right on top of the passer — the kick clears them.
   139	    if (dist(cp, from) < 1.5) continue;
   140	    const d = dist(cp, o.pos);
   141	    worst = Math.min(worst, clamp01(d / 4));
   142	  }
   143	  return worst;
   144	}
   145	
   146	/**
   147	 * Bodies parked on a shot path (Phase 31): outfield opponents within ~1m of
   148	 * the corridor's FIRST 60% — the final stretch belongs to the keeper (who
   149	 * has the save path, not the block path). This is what `shotQuality`'s
   150	 * distance·angle·pressure model cannot see: four set defenders between the
   151	 * ball and the goal read as "low pressure" while the drive has zero chance.
   152	 */
   153	export function laneBlockers(from: V2, goal: V2, opponents: Player[]): number {
   154	  const end = add(from, scale(sub(goal, from), 0.6));
   155	  let n = 0;
   156	  for (const o of opponents) {
   157	    if (o.sentOff || o.role === 'GK') continue;
   158	    const cp = closestPointOnSegment(from, end, o.pos);
   159	    if (dist(cp, o.pos) < 1.0) n++;
   160	  }
   161	  return n;
   162	}
   163	
   164	/**
   165	 * How ready this body is to BLOCK a strike from `from` (Phase 60): 1 = set
   166	 * and facing the shooter, floored at UNSET_BLOCK_WEIGHT for a sprinting or
   167	 * blind body — the collapsing block's retreaters can't organize a wall
   168	 * against the first-time hit. Shared by the shoot decision
   169	 * (effectiveBlockers) and the block physics (tryShotBlock).
   170	 */
   171	export function blockReadiness(o: Player, from: V2): number {
   172	  const dx = from.x - o.pos.x;
   173	  const dy = from.y - o.pos.y;
   174	  const d = Math.hypot(dx, dy);
   175	  const facing = d > 1e-6 ? (1 + (dx * o.heading.x + dy * o.heading.y) / d) / 2 : 1;
   176	  const stillness = clamp01((3.5 - Math.hypot(o.vel.x, o.vel.y)) / 2.5);
   177	  return UNSET_BLOCK_WEIGHT + (1 - UNSET_BLOCK_WEIGHT) * facing * stillness;
   178	}
   179	
   180	/**
   181	 * laneBlockers with each body weighted by blockReadiness (Phase 60): the
   182	 * count the shoot APPETITE should see. Four set defenders still read ~4;
   183	 * four mid-collapse retreaters read closer to 1.5 — dare the strike.
   184	 */
   185	export function effectiveBlockers(from: V2, goal: V2, opponents: Player[]): number {
   186	  const end = add(from, scale(sub(goal, from), 0.6));
   187	  let n = 0;
   188	  for (const o of opponents) {
   189	    if (o.sentOff || o.role === 'GK') continue;
   190	    const cp = closestPointOnSegment(from, end, o.pos);
   191	    if (dist(cp, o.pos) < 1.0) n += blockReadiness(o, from);
   192	  }
   193	  return n;
   194	}
   195	
   196	/** How much free space a receiver has (nearest opponent distance / 8m). */
   197	export function opennessOf(p: Player, opponents: Player[]): number {
   198	  let best = Infinity;
   199	  for (const o of opponents) {
   200	    if (o.sentOff) continue;
   201	    best = Math.min(best, dist(o.pos, p.pos));
   202	  }
   203	  return clamp01(best / 8);
   204	}
   205	
   206	/** Free space in front of a dribbler toward `dir` (10m lookahead cone). */
   207	export function spaceAhead(p: Player, dir: V2, opponents: Player[]): number {
   208	  const probe = add(p.pos, scale(norm(dir), 7));
   209	  let crowd = 0;
   210	  for (const o of opponents) {
   211	    if (o.sentOff) continue;
   212	    const d = dist(o.pos, probe);
   213	    if (d < 8) crowd += 1 - d / 8;
   214	  }
   215	  return clamp01(1 - crowd / 2);
   216	}
   217	
   218	/** Rough time for a player to reach a point at top speed (+turn overhead). */
   219	export function timeToPoint(p: Player, point: V2): number {
   220	  return dist(p.pos, point) / Math.max(p.topSpeed, 0.1) + 0.15;
   221	}
   222	
   223	export interface InterceptSolution {
   224	  point: V2;
   225	  tBall: number;
   226	  tMe: number;
   227	  reachable: boolean;
   228	}
   229	
   230	/**
   231	 * Intercept sampling grid, precomputed once. Uses the same `t += 0.1` float
   232	 * accumulation and exp() evaluations the per-call loop used to run (30 exps
   233	 * per call, every chasing player, every frame) — table values are
   234	 * bit-identical to what the loop produced; only the recomputation is gone.
   235	 */
   236	const INTERCEPT_T: number[] = [];
   237	const INTERCEPT_TRAVEL: number[] = [];
   238	for (let t = 0.1; t <= 3.0; t += 0.1) {
   239	  INTERCEPT_T.push(t);
   240	  INTERCEPT_TRAVEL.push((1 - Math.exp(-BALL_FRICTION_K * t)) / BALL_FRICTION_K);
   241	}
   242	
   243	/**
   244	 * Where should I run to meet the moving ball? The free ball follows
   245	 * pos(t) = p0 + v0 * (1 - e^{-kt}) / k. We sample forward and take the first
   246	 * point we can reach before the ball does; falls back to the rest point.
   247	 */
   248	export function interceptBall(p: Player, ball: Ball): InterceptSolution {
   249	  const v0 = ball.vel;
   250	  const speed0 = len(v0);
   251	  // timeToPoint inlined with the topSpeed getter hoisted out of the sampling
   252	  // loop (stamina can't change mid-call, so every sample read the same value);
   253	  // sample points stay scalar until one is actually returned. Same arithmetic
   254	  // in the same order — results are bit-identical, the garbage is gone.
   255	  const ts = Math.max(p.topSpeed, 0.1);
   256	  // Airborne ball (Phase 28): nothing on the ground meets it mid-flight —
   257	  // run to where it comes DOWN (friction-free flight, so the landing point
   258	  // is exact) and be there when it drops.
   259	  if (ball.z > 0.02 || ball.vz > 0.02) {
   260	    const { t: tLand, x: px, y: py } = ballLanding(ball);
   261	    const dx = p.pos.x - px;
   262	    const dy = p.pos.y - py;
   263	    const tMe = Math.sqrt(dx * dx + dy * dy) / ts + 0.15;
   264	    return { point: { x: px, y: py }, tBall: tLand, tMe, reachable: tMe <= tLand + 0.6 };
   265	  }
   266	  if (speed0 < 0.5) {
   267	    const dx = p.pos.x - ball.pos.x;
   268	    const dy = p.pos.y - ball.pos.y;
   269	    return { point: ball.pos, tBall: 0, tMe: Math.sqrt(dx * dx + dy * dy) / ts + 0.15, reachable: true };
   270	  }
   271	  const spinning = ball.spin !== 0;
   272	  for (let i = 0; i < INTERCEPT_T.length; i++) {
   273	    const t = INTERCEPT_T[i];
   274	    const travel = INTERCEPT_TRAVEL[i];
   275	    let px = ball.pos.x + v0.x * travel;
   276	    let py = ball.pos.y + v0.y * travel;
   277	    // Magnus (Phase 37): a curling ground ball — the displacement rotates
   278	    // by half the turn so far (the arc's chord). Zero-spin balls keep the
   279	    // exact straight table path.
   280	    if (spinning) {
   281	      const half = ball.spin * t * 0.5;
   282	      const c = Math.cos(half);
   283	      const s = Math.sin(half);
   284	      const rx = ball.pos.x + (px - ball.pos.x) * c - (py - ball.pos.y) * s;
   285	      py = ball.pos.y + (px - ball.pos.x) * s + (py - ball.pos.y) * c;
   286	      px = rx;
   287	    }
   288	    const dx = p.pos.x - px;
   289	    const dy = p.pos.y - py;
   290	    const tMe = Math.sqrt(dx * dx + dy * dy) / ts + 0.15;
   291	    if (tMe <= t) return { point: { x: px, y: py }, tBall: t, tMe, reachable: true };
   292	  }
   293	  const rest = add(ball.pos, scale(v0, 1 / BALL_FRICTION_K));
   294	  const dx = p.pos.x - rest.x;
   295	  const dy = p.pos.y - rest.y;
   296	  return { point: rest, tBall: 3, tMe: Math.sqrt(dx * dx + dy * dy) / ts + 0.15, reachable: false };
   297	}
   298	
   299	/** Can `p` cut out a pass traveling from the ball along its velocity? */
   300	export function canInterceptPass(p: Player, ball: Ball): { ok: boolean; point: V2 } {
   301	  const dir = norm(ball.vel);
   302	  if (dir.x === 0 && dir.y === 0) return { ok: false, point: ball.pos };
   303	  const end = add(ball.pos, scale(dir, 22));
   304	  const cp = closestPointOnSegment(ball.pos, end, p.pos);
   305	  const along = dist(ball.pos, cp);
   306	  // Average ball speed over the segment, decayed by friction (crude but stable).
   307	  const avgSpeed = Math.max(len(ball.vel) * 0.7, 4);
   308	  const tBall = along / avgSpeed;
   309	  const tMe = timeToPoint(p, cp);
   310	  return { ok: tMe < tBall * 0.95 && dist(p.pos, cp) < 10, point: cp };
   311	}

[35m[3mcodex[0m[0m
The genome already reveals one important inconsistency: the comments say every budgeted point is live, but “live” is not the same as “meaningfully selectable.” I’m now separating mere read-sites from strong, distinct causal effects—especially positioning, stamina, strength, and passing, which can look healthy by grep count while remaining narrow or redundant in outcomes.
[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'for a in pace passing dribbling finishing defending strength stamina reflexes positioning; do echo "ATTRIBUTE=$a"; rg -n "attrs'"\\."'${a}|attributes'"\\."'${a}|'"\\.attrs\\?\\."'${a}|'"\\b"'${a}'"\\b\" src --glob '*.ts' --glob '"'!**/*.test.ts'"'; done"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
ATTRIBUTE=pace
src/ai/actionExecutor.ts:332:      // lets a carrier keep more of their pace (Phase 27).
src/ai/actionExecutor.ts:585:    // walking pace — momentum dead, no pace protection, tackle inevitable.
src/ai/formations.ts:165:  // beatable by pace or a dragged block, never free.
src/render3d/AnimationSystem.ts:171: * an OPPONENT within arm's reach, both at running pace, headings near
src/render3d/AnimationSystem.ts:207: * The shield wrestle (Phase 38, pure): a carrier at walking pace with a
src/render3d/ThreeMatchRenderer.ts:443:  /** Walk one model toward the tunnel at an unhurried pace (Phase 41.1). The sim
src/sim/Player.ts:7:/** Physical top speed by role (m/s) before pace/stamina scaling. */
src/sim/Player.ts:39:  /** Attribute genes (squad DNA) — pace/technique/finishing/defending/reflexes. */
src/sim/Player.ts:138:   * integrated the flip-flop into a full pirouette at walking pace
src/sim/Player.ts:139:   * (momentum gone = no pace protection) until the tackle landed. A real
src/sim/Player.ts:170:    // pace: ±12% top speed, ±10% acceleration around the role baseline.
src/sim/Player.ts:171:    this.baseSpeed = BASE_SPEED[role] * (0.88 + attrs.pace * 0.24);
src/sim/Player.ts:172:    this.accel = ACCEL * (0.9 + attrs.pace * 0.2);
src/sim/Player.ts:188:  /** A KNOCK (Phase 118): hurt but playing on — pace and close control
src/sim/Player.ts:193:    this.attrs = { ...this.attrs, pace: this.attrs.pace * 0.8, dribbling: this.attrs.dribbling * 0.85 };
src/sim/Player.ts:194:    this.baseSpeed = BASE_SPEED[this.role] * (0.88 + this.attrs.pace * 0.24);
src/sim/Player.ts:195:    this.accel = ACCEL * (0.9 + this.attrs.pace * 0.2);
src/sim/Player.ts:203:    this.baseSpeed = BASE_SPEED[this.role] * (0.88 + sub.attrs.pace * 0.24);
src/sim/Player.ts:204:    this.accel = ACCEL * (0.9 + sub.attrs.pace * 0.2);
src/sim/mechanics.ts:276:  // Playing across/against the body (Phase 27) takes pace off the ball —
src/sim/mechanics.ts:376:    // Lead FURTHER since Phase 30 (flight ×1.25, pace cap 21→24): with a
src/sim/mechanics.ts:385:    // pace the runner can actually take down is what converts timed runs.
src/sim/mechanics.ts:1303: * speed carries into the ball, so close control at walking pace stays
src/sim/mechanics.ts:1475: * where the chasing pack could only eat exhaust fumes: pace still wins the
src/sim/mechanics.ts:1695:    // the space/pace gradient itself stays (the master-gate principle).
src/sim/mechanics.ts:1696:    owner.attrs.pace * drive * 0.16;
src/sim/League.ts:1479:          pace: p.pace ?? 0.5,
src/ui/i18n.ts:176:  pace: '速度',
src/evolution/careers.ts:64:  pace: 1.5,
src/sim/constants.ts:213: * knock (爆趟, up to ~4.7); walking pace keeps the glue (慢带). Cadence
src/evolution/traits.ts:68:  if (a.pace >= 0.82) out.push({ t: 'engine', excess: a.pace - 0.82 });
src/ui/ClubsScreen.ts:200:    // reads +pace −defending at a glance where absolute bars all looked
src/evolution/playerGenome.ts:16: *   pace       top speed & acceleration (±12% speed)
src/evolution/playerGenome.ts:29:  pace: number;
src/evolution/playerGenome.ts:38:   * POSITIONING (Phase 119j) — the mover's IQ, orthogonal to pace (how fast)
src/evolution/playerGenome.ts:53:  'pace', 'passing', 'dribbling', 'finishing', 'defending', 'strength', 'stamina', 'reflexes',
src/evolution/playerGenome.ts:73:  WG: { pace: 0.25 },
src/evolution/playerGenome.ts:209: * pulls toward pace — a zero-sum transfer on one axis (max ±0.12, one
src/evolution/playerGenome.ts:220:  out.pace = clamp01(out.pace - pull);
src/evolution/genome.ts:83:   * 0 = the old dive-in school (beaten by pace via the Phase-41 momentum
src/sim/Match.ts:874:        // belong to the DRIVE (walking pace = close control by definition).
src/sim/Match.ts:1800:      // 24 matches the through-ball pace cap: every delivery the game
src/evolution/playerStyle.ts:119:  pace: { hi: 'Jet heels' },
ATTRIBUTE=passing
src/sim/League.ts:1472:      // v13 -> v14: the attribute split (Phase 47). passing/dribbling
src/sim/League.ts:1480:          passing: p.passing ?? technique,
src/sim/mechanics.ts:210: * 弧线直塞): when a defender pinches the passing lane, a technical passer
src/sim/mechanics.ts:245:  // FLAT whip (the passing-scaled first cut inverted the skill gradient:
src/sim/mechanics.ts:266:  const weightErr = match.rng.gaussian() * Math.abs(spin) * 0.2 * (1.35 - p.attrs.passing);
src/sim/mechanics.ts:279:  const powerMul = orientationPowerMul(misalign, passer.attrs.passing);
src/sim/mechanics.ts:299:    (1.25 - passer.attrs.passing * 0.5) *
src/sim/mechanics.ts:301:    orientationNoiseMul(misalign, passer.attrs.passing);
src/sim/mechanics.ts:361:  const powerMul = orientationPowerMul(misalign, passer.attrs.passing);
src/sim/mechanics.ts:395:      (1.25 - passer.attrs.passing * 0.5) *
src/sim/mechanics.ts:397:      orientationNoiseMul(misalign, passer.attrs.passing);
src/sim/mechanics.ts:438:    (1.3 - p.attrs.passing * 0.55) *
src/sim/mechanics.ts:440:    orientationNoiseMul(misalign, p.attrs.passing);
src/sim/mechanics.ts:443:  let dEff = d * orientationPowerMul(misalign, p.attrs.passing);
src/sim/mechanics.ts:444:  dEff *= 1 + match.rng.gaussian() * (0.02 + d * 0.0008) * (1.25 - p.attrs.passing * 0.5) * oneTouchMul(p);
src/sim/mechanics.ts:498:  const spin = swing * (0.28 + crosser.attrs.passing * 0.3);
src/sim/mechanics.ts:536:  const powerMul = orientationPowerMul(misalign, passer.attrs.passing);
src/sim/mechanics.ts:548:    (1.25 - passer.attrs.passing * 0.5) *
src/sim/mechanics.ts:550:    orientationNoiseMul(misalign, passer.attrs.passing);
src/sim/mechanics.ts:586:  const mag = 0.12 + passer.attrs.passing * 0.18;
src/sim/mechanics.ts:1031:  match.endPassMove(shooter.side); // a strike ends the passing move (Phase 33)
src/sim/mechanics.ts:1242:  const spinMag = 0.25 + taker.attrs.passing * 0.25;
src/sim/mechanics.ts:1369:  match.endPassMove(p.side); // a hoof is not part of a passing move (Phase 33)
src/sim/mechanics.ts:1384:    23 * (1 - kickMisalignment(p, aim) * 0.15 * (1 - p.attrs.passing * 0.4)),
src/sim/Team.ts:151:    // for the match. Positive = riding a run (sharper passing/finishing),
src/sim/Team.ts:197:      const s = (p.age ?? 24) * ((p.attrs.passing + p.attrs.dribbling) / 2);
src/sim/Match.ts:343:   * A passing move ends (Phase 33): turnover, dead ball, shot or clear.
src/sim/Match.ts:844:      // The dispossessed side's passing move is over (Phase 33).
src/sim/Match.ts:1418:    // The whistle ends any passing move (Phase 33).
src/sim/Match.ts:1548:            const s = p.attrs.finishing + p.attrs.passing * 0.5;
src/evolution/policyGenome.ts:12: * (never stops shooting, passing, or defending) while its style (direct vs
src/evolution/policyGenome.ts:25:  // Build-up style (Phase 44): patient short-passing + outlet-seeking + support
src/evolution/playerStyle.ts:120:  passing: { hi: 'Silk passer' },
src/evolution/genome.ts:121:   * passing and finishing sharpen on a run and fray in a crisis (both
src/evolution/playerGenome.ts:17: *   passing    pass/cross/loft accuracy and power retention
src/evolution/playerGenome.ts:30:  passing: number;
src/evolution/playerGenome.ts:39:   * and dribbling/passing (how clean the touch): WHERE to be, WHEN to move,
src/evolution/playerGenome.ts:53:  'pace', 'passing', 'dribbling', 'finishing', 'defending', 'strength', 'stamina', 'reflexes',
src/evolution/playerGenome.ts:72:  MF: { passing: 0.2 },
src/ai/mentality.ts:92: * tempo of its passing game; a press identity keeps hunting even ahead.
src/ui/i18n.ts:177:  passing: '传球',
src/ui/i18n.ts:238:  'Vertical passing': '向前直塞',
src/ui/i18n.ts:315:  'Longest passing move': '最长传递配合',
src/evolution/careers.ts:56:/** Pace and stamina fade fastest with age; passing craft holds longest.
src/evolution/careers.ts:65:  passing: 0.6,
src/ai/actionExecutor.ts:135:        // shadow the passing lane and anticipated balls can be cut out.
src/evolution/traits.ts:66:  if (a.passing >= 0.8) out.push({ t: 'playmaker', excess: a.passing - 0.8 });
src/ui/LeagueScreen.ts:437:        el('div', 'history-entry', `🎼 ${t('Longest passing move')}: ${rec.longestChain.team} — ${rec.longestChain.length}`),
src/ui/LeagueScreen.ts:729:    if (bestChain) rows.push(`🎼 Longest passing move: <b>${bestChain.v}</b> — ${bestChain.who} (S${bestChain.gen})`);
src/ai/perception.ts:132:/** How clean the passing lane from `from` to `to` is (1 = wide open). */
src/evolution/styleSpace.ts:139:  passFwdBase: { hi: 'Vertical passing' },
src/ai/PlayerBrain.ts:246:  // misalignment) don't either. Competes with crossing/passing the FK.
src/ai/PlayerBrain.ts:277:      // The playmaker (Phase 39) reads passing lanes 15% more open than
src/ai/PlayerBrain.ts:317:      if (!mustKick) mul *= 1 - kickMisalignment(p, norm(sub(mate.pos, p.pos))) * 0.12 * (1 - p.attrs.passing * 0.5);
src/ai/PlayerBrain.ts:381:      // into space; long passing is a skill (technique gates execution AND
src/ai/PlayerBrain.ts:390:        sL *= 0.55 + p.attrs.passing * 0.75;
src/ai/PlayerBrain.ts:401:    // trusts his feet. Outfield passing is untouched.
src/ai/PlayerBrain.ts:416:        why: `switch to ${bestLoftMate.name} · open ${bestLoftOpen.toFixed(2)} · air lane ${airLane.toFixed(2)} · passing ${p.attrs.passing.toFixed(2)}`,
src/ai/PlayerBrain.ts:478:          gates * 0.9 * (0.55 + p.attrs.passing * 0.7) *
src/ai/PlayerBrain.ts:537:      if (!mustKick) sX *= 1 - kickMisalignment(p, norm(sub(bestCrossMate.pos, p.pos))) * 0.12 * (1 - p.attrs.passing * 0.5);
src/ai/PlayerBrain.ts:1071:      if (inter.ok) cands.push({ action: 'InterceptPass', score: W.interceptScore, why: 'can reach the passing lane first' });
ATTRIBUTE=dribbling
src/sim/League.ts:1472:      // v13 -> v14: the attribute split (Phase 47). passing/dribbling
src/sim/League.ts:1481:          dribbling: p.dribbling ?? technique,
src/sim/mechanics.ts:127:  let pFail = touchFailChance(speed, pressure, misalign, p.attrs.dribbling, p.attrs.positioning);
src/sim/mechanics.ts:195:  return p.firstTouchWindow > 0 ? 1.15 + (1 - p.attrs.dribbling) * 0.9 : 1;
src/sim/mechanics.ts:848:    touchFailChance(speed, pressure, misalign, trapper.attrs.dribbling, trapper.attrs.positioning) + 0.05, 0, 0.5,
src/sim/mechanics.ts:996:    orientationNoiseMul(misalign, shooter.attrs.dribbling);
src/sim/mechanics.ts:1131:    orientationNoiseMul(misalign, shooter.attrs.dribbling);
src/sim/mechanics.ts:1139:    (Math.sign((aimTarget.y - gk.pos.y) * dir.x) || 1) * (0.1 + shooter.attrs.dribbling * 0.2);
src/sim/mechanics.ts:1140:  const v0 = SHOT_SPEED * orientationPowerMul(misalign, shooter.attrs.dribbling);
src/sim/mechanics.ts:1332:  let push = (TOUCH_PUSH_BASE + open * TOUCH_PUSH_SPACE) * (1.05 - p.attrs.dribbling * 0.15);
src/sim/mechanics.ts:1346:  const noise = match.rng.gaussian() * 0.07 * (1.35 - p.attrs.dribbling * 0.7);
src/sim/mechanics.ts:1447:  const pWin = clamp(0.56 + (gk.attrs.reflexes - 0.5) * 0.5 - (owner.attrs.dribbling - 0.5) * 0.35, 0.2, 0.85);
src/sim/mechanics.ts:1529:    0.16 + slider.attrs.defending * 0.14 - owner.attrs.dribbling * 0.1,
src/sim/mechanics.ts:1687:    owner.attrs.dribbling * 0.18 -
src/sim/Team.ts:197:      const s = (p.age ?? 24) * ((p.attrs.passing + p.attrs.dribbling) / 2);
src/sim/Player.ts:193:    this.attrs = { ...this.attrs, pace: this.attrs.pace * 0.8, dribbling: this.attrs.dribbling * 0.85 };
src/sim/Match.ts:766:      p.touchTimer = (recollect ? 0.2 : 0.32) + (1 - p.attrs.dribbling) * 0.08;
src/ai/PlayerBrain.ts:75:  // — dribbling straight off the spot would break the dead-ball fiction.
src/ai/PlayerBrain.ts:253:      (0.7 + (p.attrs.finishing + p.attrs.dribbling * 0.5) * 0.45) *
src/ai/PlayerBrain.ts:597:        (0.55 + p.attrs.dribbling * 0.7) *
src/ai/PlayerBrain.ts:604:        why: `back to goal · pressure ${pressure.toFixed(2)} · dribbling ${p.attrs.dribbling.toFixed(2)}`,
src/ai/actionExecutor.ts:333:      speedF = 0.84 + p.attrs.dribbling * 0.1;
src/evolution/playerStyle.ts:121:  dribbling: { hi: 'Glued to the boot' },
src/ui/i18n.ts:178:  dribbling: '盘带',
src/evolution/playerGenome.ts:18: *   dribbling  first touch, carry push control, beating a man
src/evolution/playerGenome.ts:31:  dribbling: number;
src/evolution/playerGenome.ts:39:   * and dribbling/passing (how clean the touch): WHERE to be, WHEN to move,
src/evolution/playerGenome.ts:53:  'pace', 'passing', 'dribbling', 'finishing', 'defending', 'strength', 'stamina', 'reflexes',
src/evolution/traits.ts:63:  if (role === 'ST' && a.finishing >= 0.75 && a.dribbling < 0.6) {
src/evolution/careers.ts:66:  dribbling: 0.8,
ATTRIBUTE=finishing
src/sim/League.ts:240:   * penalties, finishing vs reflexes) or 'underdog' (the classic draw rule;
src/sim/League.ts:911:          // cost budget for THIS slot (GK: not finishing/defending; outfield:
src/sim/League.ts:1482:          finishing: p.finishing ?? 0.5,
src/sim/League.ts:1778:      // keeper-only, finishing/defending are free for the keeper — and the cap
src/sim/cup.ts:20: *    shootout — kicker finishing vs keeper reflexes, best-of-5 then sudden
src/sim/cup.ts:157:  /** Kicker finishing in kick order: best outfield finishers first, keeper last. */
src/sim/cup.ts:184:/** Kick order from squad DNA: outfielders by finishing (index tiebreak), GK last. */
src/sim/cup.ts:193:    .sort((i, j) => squad[j].finishing - squad[i].finishing || i - j);
src/sim/cup.ts:196:    kickers: order.map((i) => squad[i].finishing),
src/sim/cup.ts:204: * 0.74 + (finishing−0.5)·0.3 − (keeperReflexes−0.5)·0.3 (clamped 0.35–0.95;
src/sim/cup.ts:221:  const kickP = (finishing: number, reflexes: number): number =>
src/sim/cup.ts:222:    Math.min(0.95, Math.max(0.35, 0.74 + (finishing - 0.5) * 0.3 - (reflexes - 0.5) * 0.3));
src/sim/records.ts:255:        out.push(`Promoted ${row.name} overachieved, finishing ${ordinal(pos + 1)} in the Premier.`);
src/sim/mechanics.ts:878:  const aimMargin = 1.6 - shooter.attrs.finishing * 0.8;
src/sim/mechanics.ts:887:  const spread = (0.05 + d * 0.004 + pressure * 0.04) * (1.35 - shooter.attrs.finishing * 0.65);
src/sim/mechanics.ts:889:  ball.vel = scale(dir, 15 + shooter.attrs.finishing * 4);
src/sim/mechanics.ts:981:    0.36 - (tNom - 0.9) * 0.22 - pressure * 0.12 + shooter.attrs.finishing * 0.06,
src/sim/mechanics.ts:989:  // finishing narrows the draw AND the lateral spray.
src/sim/mechanics.ts:990:  const zg = 0.8 + match.rng.range(0, 1.9 - shooter.attrs.finishing * 0.5);
src/sim/mechanics.ts:995:    (0.03 + d * 0.0012) * (1.3 - shooter.attrs.finishing * 0.6) *
src/sim/mechanics.ts:1046:  // floored at 0.4 (the base formula's own minimum at finishing 1.0):
src/sim/mechanics.ts:1048:  // converted less (caught by the finishing-conversion invariant test).
src/sim/mechanics.ts:1058:    1.3 - shooter.attrs.finishing * 0.6 - (shooter.traits.includes('clinical') ? 0.1 : 0),
src/sim/mechanics.ts:1109:  // Scale the gift by finishing instead: at 0.5 the oneVone branch is a
src/sim/mechanics.ts:1114:  const composure = clamp((shooter.attrs.finishing - 0.5) / 0.4, -0.75, 1);
src/sim/mechanics.ts:1128:    (1.45 - shooter.attrs.finishing * 0.9) *
src/sim/mechanics.ts:1216:  const aimMargin = 1.05 - taker.attrs.finishing * 0.55;
src/sim/mechanics.ts:1250:  // finishing tames — the free kick is the specialist's shot.
src/sim/mechanics.ts:1251:  const spread = (0.034 + d * 0.001) * (1.35 - taker.attrs.finishing * 0.7);
src/sim/Team.ts:151:    // for the match. Positive = riding a run (sharper passing/finishing),
src/sim/Player.ts:39:  /** Attribute genes (squad DNA) — pace/technique/finishing/defending/reflexes. */
src/sim/Match.ts:1531:        if (p.attrs.finishing > taker.attrs.finishing) taker = p;
src/sim/Match.ts:1548:            const s = p.attrs.finishing + p.attrs.passing * 0.5;
src/ui/LeagueScreen.ts:155:          ? '\u2014 level cup ties go to a seeded penalty shootout (finishing vs keeper reflexes).'
src/ai/PlayerBrain.ts:191:    // NOTE: finishing deliberately does NOT raise shot utility — it pays off
src/ai/PlayerBrain.ts:253:      (0.7 + (p.attrs.finishing + p.attrs.dribbling * 0.5) * 0.45) *
src/ui/i18n.ts:179:  finishing: '射术',
src/ai/formations.ts:498:  // lesson — conversion went DOWN and the finishing invariant test flagged
src/evolution/careers.ts:67:  finishing: 0.9,
src/evolution/playerGenome.ts:19: *   finishing  shot accuracy (spread) and shot confidence
src/evolution/playerGenome.ts:32:  finishing: number;
src/evolution/playerGenome.ts:53:  'pace', 'passing', 'dribbling', 'finishing', 'defending', 'strength', 'stamina', 'reflexes',
src/evolution/playerGenome.ts:74:  ST: { finishing: 0.25 },
src/evolution/playerGenome.ts:145: * symmetrically `finishing` + `defending` are DEAD for the keeper (a GK never
src/evolution/playerGenome.ts:150: * GK-finishing + GK-defending = 10 dead slots are free → 71 counted × 0.5 =
src/evolution/playerGenome.ts:162: * everything EXCEPT finishing/defending (dead for a GK); every outfielder pays
src/evolution/playerGenome.ts:168:  if (isGK) return k !== 'finishing' && k !== 'defending';
src/evolution/genome.ts:121:   * passing and finishing sharpen on a run and fray in a crisis (both
src/evolution/traits.ts:13: *   clinical  aimMargin −0.1 (shaves the post)     shooters, finishing
src/evolution/traits.ts:62:  if (role !== 'DF' && a.finishing >= 0.8) out.push({ t: 'clinical', excess: a.finishing - 0.8 });
src/evolution/traits.ts:63:  if (role === 'ST' && a.finishing >= 0.75 && a.dribbling < 0.6) {
src/evolution/traits.ts:64:    out.push({ t: 'poacher', excess: a.finishing - 0.75 });
src/evolution/playerStyle.ts:122:  finishing: { hi: 'Killer touch' },
ATTRIBUTE=defending
src/render3d/LinesmanModel.ts:17:/** The defending team's line: x of its second-deepest outfielder toward
src/render3d/ShootoutTheater.ts:172:    const keeperGid = kick ? (1 - kick.side) * TEAM_SIZE : -1; // defending keeper
src/render3d/BroadcastLayer.ts:15: *   block HULL — only while the defending side's block is SET (Defend or
src/render3d/BroadcastLayer.ts:20: *   offside FLASH — the defending line brightens amber while a pass is in
src/render3d/BroadcastLayer.ts:136:    // still in front of it — the moment the line MATTERS. The defending
src/render3d/BroadcastLayer.ts:149:    // ---- the SET block hull: only while the defending side is organised
src/sim/League.ts:911:          // cost budget for THIS slot (GK: not finishing/defending; outfield:
src/sim/League.ts:1483:          defending: p.defending ?? 0.5,
src/sim/League.ts:1778:      // keeper-only, finishing/defending are free for the keeper — and the cap
src/sim/constants.ts:175: * Everyone except the taker (and the defending keeper, who stands ~9.4m away
src/sim/mechanics.ts:627: * weights (defending 0.3, strength 0.1) made the classic big-man
src/sim/mechanics.ts:631: * defending 0.15: the aerial payoff phase-47 assigned to strength is
src/sim/mechanics.ts:636:  return AERIAL_ROLE[p.role] + p.attrs.defending * 0.15 + p.attrs.strength * 0.3;
src/sim/mechanics.ts:1067:  // pressureAt is distance-only — a 0.9-defending stopper closing on the
src/sim/mechanics.ts:1071:  // now scales the pressure the strike feels: ×1.0 at defending 0.5
src/sim/mechanics.ts:1074:  // like real xG — so evolved defending shows up as UNDER-performance.
src/sim/mechanics.ts:1087:    if (presser) contest = pressure * (0.55 + presser.attrs.defending * 0.9);
src/sim/mechanics.ts:1409:    (0.24 + p.attrs.defending * 0.4 - (speed - 14) * 0.02) * (1 - blind * DEFLECT_BLIND_PEN),
src/sim/mechanics.ts:1529:    0.16 + slider.attrs.defending * 0.14 - owner.attrs.dribbling * 0.1,
src/sim/mechanics.ts:1661:  // Team aggression + the tackler's defending vs the carrier's evasion. The
src/sim/mechanics.ts:1677:  // defending 0.24→0.34 (Phase 48): the wage cap exposed defending as
src/sim/mechanics.ts:1685:    tackler.attrs.defending * 0.34 -
src/sim/mechanics.ts:1802:    if (!match.rng.chance((0.32 + o.attrs.defending * 0.25) * readiness)) continue;
src/sim/types.ts:37: * a FIXED defending formation and a marking scheme — its tactical identity,
src/sim/Match.ts:96:   * evolved defending shows up as UNDER-performance, like real xG).
src/sim/Match.ts:191:   * the defending bodies that line up on the ball–goal line at the law
src/sim/Match.ts:1123:   * corner if the defending side touched it last, else goal kick.
src/sim/Match.ts:1451:    // Free-kick wall (Phase 32): a danger-zone FK gets 2–3 defending
src/sim/Match.ts:1588:    // applies to BOTH teams — only the taker and the defending keeper (who
src/evolution/genome.ts:18:  /** Off-ball defenders squeeze toward the ball/center when defending. */
src/evolution/genome.ts:79:   * "give-space" modern defending vs the dive-in reflex): how much this
src/sim/Player.ts:39:  /** Attribute genes (squad DNA) — pace/technique/finishing/defending/reflexes. */
src/sim/Player.ts:110:   * only re-read on the marker's reaction cadence (0.2–0.45s by defending)
src/evolution/policyGenome.ts:12: * (never stops shooting, passing, or defending) while its style (direct vs
src/evolution/careers.ts:68:  defending: 0.9,
src/ai/actionExecutor.ts:208:        // target on his reaction cadence (0.2–0.45s by defending), not
src/ai/actionExecutor.ts:217:          const lag = 0.45 - p.attrs.defending * 0.25;
src/ui/i18n.ts:180:  defending: '防守',
src/ai/formations.ts:15: * defending table (its identity, `team.style`). The whole block still
src/ai/formations.ts:149:  // defending phase only. Before this, line height was formationDepth's
src/evolution/traits.ts:67:  if (a.defending >= 0.8) out.push({ t: 'enforcer', excess: a.defending - 0.8 });
src/evolution/playerStyle.ts:123:  defending: { hi: 'The wall' },
src/ui/ClubsScreen.ts:200:    // reads +pace −defending at a glance where absolute bars all looked
src/ai/TeamBrain.ts:433: * defending spot) or our penalty box. Zone defenders otherwise hold the
src/evolution/playerGenome.ts:20: *   defending  tackle success + tighter marking
src/evolution/playerGenome.ts:33:  defending: number;
src/evolution/playerGenome.ts:53:  'pace', 'passing', 'dribbling', 'finishing', 'defending', 'strength', 'stamina', 'reflexes',
src/evolution/playerGenome.ts:71:  DF: { defending: 0.25 },
src/evolution/playerGenome.ts:145: * symmetrically `finishing` + `defending` are DEAD for the keeper (a GK never
src/evolution/playerGenome.ts:150: * GK-finishing + GK-defending = 10 dead slots are free → 71 counted × 0.5 =
src/evolution/playerGenome.ts:162: * everything EXCEPT finishing/defending (dead for a GK); every outfielder pays
src/evolution/playerGenome.ts:168:  if (isGK) return k !== 'finishing' && k !== 'defending';
src/evolution/playerGenome.ts:205: * containment only pays as a defending+jockeyBias PACKAGE, a two-locus
src/evolution/playerGenome.ts:208: * coach (jockeyBias>0.5) pulls the heir toward defending, a dive-in coach
src/evolution/playerGenome.ts:219:  out.defending = clamp01(out.defending + pull);
ATTRIBUTE=strength
src/render3d/PlayerShowcase.ts:9: * the name, bulk off evolved strength), GK gloves-and-broad-build identity —
src/render3d/PlayerShowcase.ts:22:  /** Evolved strength attribute (0..1) — drives the body's bulk. */
src/render3d/PlayerShowcase.ts:23:  strength: number;
src/render3d/PlayerShowcase.ts:146:    const key = `${spec.name}:${spec.role}:${spec.strength.toFixed(2)}:${spec.primary}:${spec.secondary}`;
src/render3d/PlayerShowcase.ts:158:    this.model.setBody(spec.name, spec.strength);
src/render3d/CrowdSystem.ts:91:  /** A near-thing (shot, save, corner): rise toward `strength`, never calm DOWN. */
src/render3d/CrowdSystem.ts:92:  ripple(strength: number): void {
src/render3d/CrowdSystem.ts:93:    this.excitement = Math.max(this.excitement, strength);
src/render3d/PlayerModel.ts:125:  /** Torso/hip width multiplier, 0.88 – 1.16 (ability — from strength). */
src/render3d/PlayerModel.ts:139:export function bodyFor(name: string, strength: number): BodySpec {
src/render3d/PlayerModel.ts:145:    bulk: 0.88 + Math.max(0, Math.min(1, strength)) * 0.28,
src/render3d/PlayerModel.ts:459:   * (height/skin/hair) from the name, build from the evolved strength.
src/render3d/PlayerModel.ts:460:   * Called per frame — early-outs on the (name, strength) key.
src/render3d/PlayerModel.ts:462:  setBody(name: string | undefined, strength: number): void {
src/render3d/PlayerModel.ts:464:    const key = `${n}:${strength.toFixed(2)}`;
src/render3d/PlayerModel.ts:467:    const b = bodyFor(n, strength);
src/render3d/RenderStateAdapter.ts:28:  /** The occupant's evolved strength (Phase 76) — drives the body build.
src/render3d/RenderStateAdapter.ts:177:    str: p.attrs.strength,
src/render3d/ThreeMatchRenderer.ts:275:        // The body follows the occupant + his evolved strength (Phase 76).
src/sim/League.ts:426:      elo: f.elo, // the underdog shift's strength reading (Phase 64)
src/sim/League.ts:1473:      // inherit the old technique; strength/stamina start neutral at 0.4
src/sim/League.ts:1484:          strength: p.strength ?? 0.4,
src/sim/League.ts:1555:        // founding-strength subs (~34) fits without a shave.
src/sim/mechanics.ts:627: * weights (defending 0.3, strength 0.1) made the classic big-man
src/sim/mechanics.ts:628: * investment invisible — +0.45 strength bought +0.045 of duel score
src/sim/mechanics.ts:630: * target man changing NOTHING about cross outcomes. Now strength 0.3 /
src/sim/mechanics.ts:631: * defending 0.15: the aerial payoff phase-47 assigned to strength is
src/sim/mechanics.ts:633: * buys strength out-jumps the big man (the tall-CB answer).
src/sim/mechanics.ts:636:  return AERIAL_ROLE[p.role] + p.attrs.defending * 0.15 + p.attrs.strength * 0.3;
src/sim/mechanics.ts:1378:  // at half strength: a panic hoof is a compromise, not a fifty-fifty gift.
src/sim/mechanics.ts:1673:  // strength SHIELDS the standing challenge (Phase 47 — the hold-up/pivot
src/sim/mechanics.ts:1674:  // payoff): base 0.21→0.25 with −strength·0.10 so the POPULATION mean
src/sim/mechanics.ts:1688:    owner.attrs.strength * 0.1 -
src/sim/types.ts:246:   * Club Elo at kickoff (Phase 64): the strength READING the underdog
src/evolution/playerStyle.ts:124:  strength: { hi: 'Ox strong' },
src/evolution/careers.ts:69:  strength: 1.0,
src/ai/steering.ts:25:export function separation(p: Player, all: Player[], radius = 2.2, strength = 3.0): V2 {
src/ai/steering.ts:38:      const k = strength * (1 - d / radius);
src/evolution/playerGenome.ts:21: *   strength   aerial power, shielding, the 50/50 shove
src/evolution/playerGenome.ts:34:  strength: number;
src/evolution/playerGenome.ts:53:  'pace', 'passing', 'dribbling', 'finishing', 'defending', 'strength', 'stamina', 'reflexes',
src/evolution/playerGenome.ts:66: * strength/stamina carry NO bias (Phase 47) — where the physical game pays
src/ai/formations.ts:55:  // around it (strength/aerialSense own the descent) — with both wingers
src/ai/formations.ts:163:  // full-strength baseline once the open-run economy paid honestly
src/ai/PlayerBrain.ts:744:      const fit = clamp01((team.localX(mate.pos.x) - localX) / 60) * 0.6 + mate.attrs.strength * 0.5;
src/ai/PlayerBrain.ts:759:        why: `PUNT to ${puntMate.name} · outlets closed ${closed.toFixed(2)} · strength ${puntMate.attrs.strength.toFixed(2)}`,
src/ai/PlayerBrain.ts:1009:    // breakaway — which is how a 5v6 side out-scored its full-strength
src/ui/i18n.ts:181:  strength: '强壮',
src/ui/PlayerScreen.ts:324:    // and skin off the name, bulk off evolved strength, keepers in the
src/ui/PlayerScreen.ts:330:      strength: attrs.strength,
ATTRIBUTE=stamina
src/render3d/RenderStateAdapter.ts:27:  stamina: number;
src/render3d/RenderStateAdapter.ts:176:    stamina: p.stamina,
src/render3d/RenderStateAdapter.ts:360:        stamina: lerp(pa.stamina, pb.stamina, t),
src/render3d/ShootoutTheater.ts:262:        stamina: p.stamina,
src/sim/League.ts:1473:      // inherit the old technique; strength/stamina start neutral at 0.4
src/sim/League.ts:1485:          stamina: p.stamina ?? 0.4,
src/sim/constants.ts:59: * diagnostic found out why nothing tires it: full-time stamina sat at
src/sim/constants.ts:61: * built on fatigue — the stamina attribute, staminaConservation's
src/sim/mechanics.ts:334:    passer.stamina > 0.3 &&
src/sim/Player.ts:7:/** Physical top speed by role (m/s) before pace/stamina scaling. */
src/sim/Player.ts:54:  stamina = 1;
src/sim/Player.ts:183:   * Fresh legs are the bench's whole payoff: stamina resets to 1. Cards
src/sim/Player.ts:207:    this.stamina = 1;
src/sim/Player.ts:235:    return this.baseSpeed * (0.62 + 0.38 * this.stamina);
src/sim/Player.ts:315:    // The stamina ATTRIBUTE scales drain and recovery (Phase 47): neutral
src/sim/Player.ts:322:        STAMINA_DRAIN * effort * effort * dt * this.staminaDrainMul * (1.24 - this.attrs.stamina * 0.6);
src/sim/Player.ts:323:      this.stamina = Math.max(0.05, this.stamina - drain);
src/sim/Player.ts:326:      this.stamina = Math.min(1, this.stamina + STAMINA_RECOVERY * dt * (0.88 + this.attrs.stamina * 0.3));
src/sim/Player.ts:344:   * and high-stamina players absorb bursts better too.
src/sim/Player.ts:347:    const drain = cost * this.staminaDrainMul * (1.24 - this.attrs.stamina * 0.6);
src/sim/Player.ts:348:    this.stamina = Math.max(0.05, this.stamina - drain);
src/sim/Match.ts:1296:    // stamina 1 → ×0.6 … 0.05 → ×1.55; age 27 = ×1 ± 6%/year in [0.65, 1.5].
src/sim/Match.ts:1297:    const fatigue = 1.6 - victim.stamina;
src/sim/Match.ts:1496:      if (p.stamina >= threshold) continue;
src/sim/Match.ts:1497:      if (out === null || p.stamina < out.stamina) out = p;
src/evolution/playerStyle.ts:125:  stamina: { hi: 'Iron lungs' },
src/evolution/traits.ts:17: *   engine    stamina drain ×0.9                    the motor
src/evolution/playerGenome.ts:22: *   stamina    fatigue drain & recovery rate
src/evolution/playerGenome.ts:35:  stamina: number;
src/evolution/playerGenome.ts:53:  'pace', 'passing', 'dribbling', 'finishing', 'defending', 'strength', 'stamina', 'reflexes',
src/evolution/playerGenome.ts:66: * strength/stamina carry NO bias (Phase 47) — where the physical game pays
src/evolution/genome.ts:26:  /** Jog instead of sprint for low-priority movement, saving stamina. */
src/ai/PlayerBrain.ts:988:  const tired = p.stamina < 0.4 && g.staminaConservation > 0.5;
src/ai/PlayerBrain.ts:1063:      why: tired ? 'keeping shape (stamina conservation)' : 'keeping shape',
src/evolution/fitness.ts:7: * recoveries, stamina efficiency — which rewarded every club for playing the
src/ai/TeamBrain.ts:244:        if (team.runners.has(p.index) || team.arriver === p.index || p.stamina < 0.3) continue;
src/evolution/careers.ts:56:/** Pace and stamina fade fastest with age; passing craft holds longest.
src/evolution/careers.ts:70:  stamina: 1.2,
src/ui/i18n.ts:132:  stamina: '体能',
src/ai/perception.ts:252:  // loop (stamina can't change mid-call, so every sample read the same value);
src/render/MatchRenderer.ts:150:      const w = 14 * p.stamina;
src/render/MatchRenderer.ts:151:      const color = p.stamina > 0.5 ? 0x4ade80 : p.stamina > 0.25 ? 0xfacc15 : 0xef4444;
src/ui/RightPanel.ts:207:    stamRow.appendChild(el('span', 'muted', `${t('stamina')} ${(p.stamina * 100).toFixed(0)}%`));
src/ui/RightPanel.ts:208:    stamRow.appendChild(bar(p.stamina, p.stamina > 0.5 ? '#4ade80' : p.stamina > 0.25 ? '#facc15' : '#ef4444'));
ATTRIBUTE=reflexes
src/sim/League.ts:240:   * penalties, finishing vs reflexes) or 'underdog' (the classic draw rule;
src/sim/League.ts:912:          // not reflexes) so headroom = cap − used + freed stays in squadTotal's
src/sim/League.ts:1486:          reflexes: p.reflexes ?? 0.5,
src/sim/League.ts:1777:      // v32 -> v33: the budget went POSITION-AWARE (Phase-120) — reflexes is
src/sim/cup.ts:20: *    shootout — kicker finishing vs keeper reflexes, best-of-5 then sudden
src/sim/cup.ts:198:    gkReflexes: squad[0].reflexes,
src/sim/cup.ts:221:  const kickP = (finishing: number, reflexes: number): number =>
src/sim/cup.ts:222:    Math.min(0.95, Math.max(0.35, 0.74 + (finishing - 0.5) * 0.3 - (reflexes - 0.5) * 0.3));
src/sim/mechanics.ts:29:    2.05 + defTeam.genome.keeperAggression * 0.4 + (gk.attrs.reflexes - 0.5) * 0.5 +
src/sim/mechanics.ts:642: * reflexes decide). Then outfielders within reach jump: position + role
src/sim/mechanics.ts:666:    const pClaim = clamp(0.62 + (gk.attrs.reflexes - 0.5) * 0.5 - crowd * 0.3, 0.2, 0.9);
src/sim/mechanics.ts:1447:  const pWin = clamp(0.56 + (gk.attrs.reflexes - 0.5) * 0.5 - (owner.attrs.dribbling - 0.5) * 0.35, 0.2, 0.85);
src/sim/mechanics.ts:1864:    ? clamp(0.7 - shot.xg * 0.6 + (gk.attrs.reflexes - 0.5) * 0.22, 0.08, 0.92) *
src/sim/mechanics.ts:1867:    // 0.3-0.5 xG (0.48−0.6·xG ⇒ ~0.2), where reflexes' ±11pp couldn't
src/sim/mechanics.ts:1869:    // Softer collapse (−0.45·xG), stronger reflexes swing (±14pp): elite
src/sim/mechanics.ts:1872:    : clamp(0.48 - shot.xg * 0.45 + (gk.attrs.reflexes - 0.5) * 0.28, 0.1, 0.92) * shot.difficulty;
src/sim/Player.ts:39:  /** Attribute genes (squad DNA) — pace/technique/finishing/defending/reflexes. */
src/evolution/careers.ts:71:  reflexes: 1.1,
src/evolution/playerStyle.ts:126:  reflexes: { hi: 'Spring cat' },
src/evolution/traits.ts:18: *   cat       keeper reach +0.12                    GK reflexes
src/evolution/traits.ts:59:    if (a.reflexes >= 0.85) out.push({ t: 'cat', excess: a.reflexes - 0.85 });
src/evolution/playerGenome.ts:23: *   reflexes   keeper save probability & reach — GK-ONLY. Only the keeper
src/evolution/playerGenome.ts:36:  reflexes: number;
src/evolution/playerGenome.ts:53:  'pace', 'passing', 'dribbling', 'finishing', 'defending', 'strength', 'stamina', 'reflexes',
src/evolution/playerGenome.ts:70:  GK: { reflexes: 0.3 },
src/evolution/playerGenome.ts:144: * position. `reflexes` is keeper-only (the 8 outfielders never read it), and
src/evolution/playerGenome.ts:146: * shoots, and its 1v1s/claims resolve on reflexes, not tackles) — so the
src/evolution/playerGenome.ts:147: * keeper's budget base is its OWN: reflexes + distribution + physique +
src/evolution/playerGenome.ts:149: * 40.5 → 35.5 IN LOCKSTEP (was 81 attr-slots × 0.5; now 8 outfield-reflexes +
src/evolution/playerGenome.ts:163: * for everything EXCEPT reflexes (keeper-only). The uncounted attrs still
src/evolution/playerGenome.ts:169:  return k !== 'reflexes';
src/ui/LeagueScreen.ts:155:          ? '\u2014 level cup ties go to a seeded penalty shootout (finishing vs keeper reflexes).'
src/ui/i18n.ts:182:  reflexes: '反应',
ATTRIBUTE=positioning
src/sim/League.ts:1308:    // ATTR_KEY, so a pre-v32 squad missing `positioning` would poison the
src/sim/League.ts:1314:      if (a && a.positioning === undefined) a.positioning = 0.5;
src/sim/League.ts:1487:          // The rebuilder drops unlisted keys — carry positioning (Phase 119j;
src/sim/League.ts:1490:          positioning: p.positioning ?? 0.5,
src/sim/mechanics.ts:96:  speed: number, pressure: number, misalign: number, technique: number, positioning = 0.5,
src/sim/mechanics.ts:104:  const aware = 1 - (positioning - 0.5) * 0.6; // 0.7 .. 1.3
src/sim/mechanics.ts:127:  let pFail = touchFailChance(speed, pressure, misalign, p.attrs.dribbling, p.attrs.positioning);
src/sim/mechanics.ts:848:    touchFailChance(speed, pressure, misalign, trapper.attrs.dribbling, trapper.attrs.positioning) + 0.05, 0, 0.5,
src/sim/Team.ts:142:  // positioning) don't allocate. Shared instances: callers must not mutate.
src/sim/Match.ts:1729:    // broadcast moment. The chase positioning already carried him to
src/game/GameApp.ts:55:/** Emergent positioning is the DEFAULT now (2026-07-20 density相变); this
src/game/GameApp.ts:327:    // Emergent positioning field (Phase B): restore the sticky toggle so it
src/evolution/careers.ts:59: * Phase 119j adds positioning at 1.0 (average decline) — keeps the existing
src/evolution/careers.ts:72:  positioning: 1.0,
src/ai/formations.ts:133:  // (positioning-shape.ts) before it can replace them. OFF = today's behavior.
src/ai/formations.ts:235: * B1-b. Opponent-relative positioning is B2. Same sensible modifiers as the
src/evolution/playerGenome.ts:47:   * density, so positioning is a real budget TRADE-OFF, not free.
src/evolution/playerGenome.ts:49:  positioning: number;
src/evolution/playerGenome.ts:54:  'positioning',
src/evolution/playerGenome.ts:136: * positioning attr, keeping the tuned 0.5 density so the existing physics
src/evolution/playerGenome.ts:137: * still centres on 0.5 and positioning is a real trade-off, not free). That
src/evolution/playerGenome.ts:148: * positioning, not the outfield scoring/tackling stats. The cap dropped
src/ui/i18n.ts:80:  'Emergent positioning (no fixed formations)': '涌现定位(不用固定阵型)',
src/ui/SettingsScreen.ts:87:    // ---- experimental (Phase B — the emergent positioning field) ----
src/ui/SettingsScreen.ts:90:    exp.appendChild(checkbox(t('Emergent positioning (no fixed formations)'), emergentInitial,
src/ai/PlayerBrain.ts:891:  // brain tick of the moment dying and he falls through to positioning,
src/ui/actions.ts:47:  /** Experimental (Phase B): toggle the emergent positioning field (vs the

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg -n '"'^(export )?(function|const [A-Za-z0-9_]+'"\\s*=|export const|export function)|"'^  (private |public )?[A-Za-z0-9_]+'"\\(' src/sim/mechanics.ts src/ai/PlayerBrain.ts src/ai/actionExecutor.ts src/sim/Player.ts src/ai/positioning-shape.ts src/ai/TeamBrain.ts src/ai/formations.ts 2>/dev/null"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[31m exited 2 in 0ms:[0m
src/ai/formations.ts:24:export const ATTACK_FORMATIONS: Record<AttackFormationId, V2[]> = {
src/ai/formations.ts:68:export const DEFEND_FORMATIONS: Record<DefendFormationId, V2[]> = {
src/ai/formations.ts:105:export function setEmergentPos(on: boolean): void {
src/ai/formations.ts:108:export function emergentPosOn(): boolean {
src/ai/formations.ts:129:export function formationSpot(p: Player, team: Team, ball: Ball, hasBall: boolean, opp?: Team): V2 {
src/ai/formations.ts:238:function emergentStation(p: Player, team: Team, ball: Ball, hasBall: boolean, opp?: Team): V2 {
src/ai/formations.ts:357:export function fkWallSlots(from: V2, goal: V2, n: number): V2[] {
src/ai/formations.ts:383:export function cornerKeyZone(routine: CornerRoutine, attackDir: 1 | -1, cornerY: number): V2 {
src/ai/formations.ts:398:export function cornerCrashSpots(
src/ai/formations.ts:430:export function shapeReady(team: Team, ball: Ball, radius = 6): boolean {
src/ai/formations.ts:448:export function defenderLineLocalX(team: Team, opponents: Player[]): number {
src/ai/formations.ts:466:export function offsideLineLocalX(team: Team, opponents: Player[], ballLocalX: number): number {
src/ai/formations.ts:490:export function runTarget(p: Player, team: Team, opponents: Player[]): V2 {
src/ai/formations.ts:516:export function runBurstPoint(p: Player, team: Team, opponents: Player[], flight: number): V2 {
src/ai/formations.ts:546:export function supportSpot(p: Player, team: Team, ball: Ball): V2 {
src/sim/Player.ts:9:const ACCEL = 14; // m/s^2 toward desired velocity
src/sim/Player.ts:17:export const TURN_RATE = 6.5;
src/sim/Player.ts:162:  constructor(side: Side, index: number, role: Role, name: string, attrs: PlayerAttributes) {
src/sim/Player.ts:191:  takeKnock(): void {
src/sim/Player.ts:198:  becomeSub(sub: { rosterIdx: number; name: string; attrs: PlayerAttributes; age?: number }, pos: V2): void {
src/sim/Player.ts:238:  physicsStep(dt: number): void {
src/sim/Player.ts:346:  spendBurst(cost: number): void {
src/sim/Player.ts:352:  resetForKickoff(pos: V2): void {
src/ai/actionExecutor.ts:19:export function executeAction(p: Player, match: Match, dt: number): void {
src/ai/actionExecutor.ts:540:function dribbleTarget(p: Player, match: Match): V2 {
src/ai/actionExecutor.ts:619:function clampToBox(pt: V2, attackDir: 1 | -1): V2 {
src/ai/TeamBrain.ts:25:export function updateTeamBrain(team: Team, match: Match): void {
src/ai/TeamBrain.ts:99:  assignChasers(team, match);
src/ai/TeamBrain.ts:100:  assignMarks(team, match);
src/ai/TeamBrain.ts:101:  assignRunners(team, match);
src/ai/TeamBrain.ts:112:function assignRunners(team: Team, match: Match): void {
src/ai/TeamBrain.ts:267:export function pickCornerRoutine(match: Match, r: RestartState): CornerRoutine {
src/ai/TeamBrain.ts:299:function assignChasers(team: Team, match: Match): void {
src/ai/TeamBrain.ts:439:function assignMarks(team: Team, match: Match): void {
src/ai/PlayerBrain.ts:26:export function decidePlayer(p: Player, match: Match): void {
src/ai/PlayerBrain.ts:63:  decideOffBall(p, team, opp, match);
src/ai/PlayerBrain.ts:70:function decideCarrier(p: Player, team: Team, opp: Team, match: Match): void {
src/ai/PlayerBrain.ts:874:function decideGoalkeeper(p: Player, team: Team, match: Match): void {
src/ai/PlayerBrain.ts:979:function decideOffBall(p: Player, team: Team, opp: Team, match: Match): void {
src/sim/mechanics.ts:26:function keeperReach(defTeam: { genome: { keeperAggression: number } }, gk: Player): number {
src/sim/mechanics.ts:42:const SAVE_STRETCH = 1.35;
src/sim/mechanics.ts:47:function diveDifficulty(ballPos: V2, dir: V2, gk: Player, opp: { genome: { keeperAggression: number } }): number {
src/sim/mechanics.ts:59:function angleCoverage(gk: Player, shooterPos: V2, goal: V2): number {
src/sim/mechanics.ts:75:export function kickMisalignment(p: Player, dir: V2): number {
src/sim/mechanics.ts:80:export function orientationNoiseMul(misalign: number, technique: number): number {
src/sim/mechanics.ts:85:export function orientationPowerMul(misalign: number, technique: number): number {
src/sim/mechanics.ts:95:export function touchFailChance(
src/sim/mechanics.ts:115:export function attemptFirstTouch(match: Match, p: Player): boolean {
src/sim/mechanics.ts:150:function offsideAtKick(match: Match, passer: Player, target: Player): boolean {
src/sim/mechanics.ts:164:function registerPass(match: Match, passer: Player, target: Player, exempt: boolean): void {
src/sim/mechanics.ts:194:function oneTouchMul(p: Player): number {
src/sim/mechanics.ts:199:export function shotQuality(match: Match, p: Player): number {
src/sim/mechanics.ts:219:function groundBend(
src/sim/mechanics.ts:256:function bentKick(match: Match, p: Player, dir: V2, speed: number, spin: number, d: number): void {
src/sim/mechanics.ts:271:export function performPass(match: Match, passer: Player, mate: Player, offsideExempt = false): void {
src/sim/mechanics.ts:316:  registerPass(match, passer, mate, offsideExempt);
src/sim/mechanics.ts:350:export function performThroughBall(
src/sim/mechanics.ts:407:  registerPass(match, passer, runner, offsideExempt);
src/sim/mechanics.ts:422:function loftKick(
src/sim/mechanics.ts:462:export function performCross(
src/sim/mechanics.ts:499:  loftKick(match, crosser, spot, 0.5, 0.038, 0.7, 1.7, 1.1, spin);
src/sim/mechanics.ts:504:  registerPass(match, crosser, target, offsideExempt);
src/sim/mechanics.ts:512:export function performKeeperThrow(match: Match, gk: Player, mate: Player): void {
src/sim/mechanics.ts:517:  loftKick(match, gk, lead, 0.5, 0.03, 0.7, 1.4, 0.45);
src/sim/mechanics.ts:520:  registerPass(match, gk, mate, false); // a hand throw is regular play — offside applies
src/sim/mechanics.ts:532:export function performCutback(match: Match, passer: Player, mate: Player): void {
src/sim/mechanics.ts:558:  registerPass(match, passer, mate, false);
src/sim/mechanics.ts:574:function aerialSwing(passer: Player, from: V2, landing: V2, opponents: Player[]): number {
src/sim/mechanics.ts:598:export function performLoftedPass(match: Match, passer: Player, mate: Player, offsideExempt = false): void {
src/sim/mechanics.ts:611:  loftKick(match, passer, lead, 0.55, 0.033, 1.1, 2.1, 0.9, swing);
src/sim/mechanics.ts:616:  registerPass(match, passer, mate, offsideExempt);
src/sim/mechanics.ts:635:export function aerialSense(p: Player): number {
src/sim/mechanics.ts:647:export function tryAerial(match: Match, order: Player[]): void {
src/sim/mechanics.ts:751:  headBall(match, winner);
src/sim/mechanics.ts:755:function headBall(match: Match, p: Player): void {
src/sim/mechanics.ts:819:function tryChestTrap(match: Match, order: Player[]): boolean {
src/sim/mechanics.ts:870:function performHeaderShot(match: Match, shooter: Player): void {
src/sim/mechanics.ts:928:function goalCenterFor(team: { oppGoal(): V2 }): V2 {
src/sim/mechanics.ts:945:function tryChip(match: Match, shooter: Player, qGround: number, pressure: number): boolean {
src/sim/mechanics.ts:1029:export function performShot(match: Match, shooter: Player): void {
src/sim/mechanics.ts:1207:export function performFreeKick(match: Match, taker: Player): void {
src/sim/mechanics.ts:1306:export function performDribbleTouch(match: Match, p: Player): void {
src/sim/mechanics.ts:1367:export function performClear(match: Match, p: Player): void {
src/sim/mechanics.ts:1396:export function tryDeflection(match: Match, p: Player): void {
src/sim/mechanics.ts:1427:export function trySmother(match: Match): void {
src/sim/mechanics.ts:1490:export function trySlideTackle(match: Match): void {
src/sim/mechanics.ts:1556:export function tryTacticalFoul(match: Match): void {
src/sim/mechanics.ts:1615:export function tryTackles(match: Match): void {
src/sim/mechanics.ts:1775:export function tryShotBlock(match: Match): void {
src/sim/mechanics.ts:1820:export function tryKeeperSave(match: Match): void {

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg --files src/ai | sort; rg -n 'positioning|awareness|vision|percept|reaction|decision|intent' src/ai src/sim --glob '*.ts' --glob '"'!**/*.test.ts'"'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
src/ai/PlayerBrain.ts
src/ai/TeamBrain.ts
src/ai/actionExecutor.ts
src/ai/formations.ts
src/ai/mentality.ts
src/ai/perception.ts
src/ai/steering.ts
src/sim/League.ts:58:export type Division = 0 | 1;
src/sim/League.ts:59:export const DIVISION_NAMES = ['Premier Division', 'Challenger Division'] as const;
src/sim/League.ts:72:  /** Match index within the division's round (0-3). */
src/sim/League.ts:74:  division: Division;
src/sim/League.ts:138:    gf: number; ga: number; elo?: number; division?: Division;
src/sim/League.ts:158:  /** Challenger Division top scorers (top 3). */
src/sim/League.ts:212: * The autonomous football pyramid: 16 evolving franchises in two divisions of
src/sim/League.ts:214: * per division, 56 matches total).
src/sim/League.ts:217: *   1. Division fitness + season record (as played).
src/sim/League.ts:218: *   2. Evolution per division — D1: 2 elite / 6 mutated (its strugglers get
src/sim/League.ts:225: * hash(leagueSeed, generation, round, division*4+index) — so saves replay
src/sim/League.ts:282:  division(d: Division): Franchise[] {
src/sim/League.ts:283:    return this.franchises.filter((f) => f.division === d);
src/sim/League.ts:288:    // Interleave rounds so watching the league alternates divisions naturally.
src/sim/League.ts:289:    const perDiv = ([0, 1] as Division[]).map((d) =>
src/sim/League.ts:290:      buildDivisionFixtures(this.division(d).map((f) => f.slot), d),
src/sim/League.ts:332:        round: t.round, index: t.index, division: 0 as Division,
src/sim/League.ts:349:      division: 0,
src/sim/League.ts:486:        : hashSeed(this.seed, this.generation, f.round, f.division * 4 + f.index),
src/sim/League.ts:656:    // Elo (K=28) — a single ladder across both divisions.
src/sim/League.ts:676:  standings(division: Division): Array<TableRow & { franchise: Franchise }> {
src/sim/League.ts:679:      .filter((r) => r.franchise.division === division)
src/sim/League.ts:687:   * Close the season: record → evolve per division → promote/relegate.
src/sim/League.ts:719:    const fitnessFor = (d: Division) =>
src/sim/League.ts:720:      computeFitness(this.division(d).map((f) => ({ slot: f.slot, agg: this.agg[f.slot] })));
src/sim/League.ts:778:        division: r.franchise.division,
src/sim/League.ts:818:    // Evolution per division. D2's reborn slots draw parents from D1's best.
src/sim/League.ts:821:    const d1 = this.division(0);
src/sim/League.ts:822:    const d2 = this.division(1);
src/sim/League.ts:831:    // Zonal ecology budget (Phase 31): one shared counter for both division
src/sim/League.ts:976:      f.division = 1;
src/sim/League.ts:981:      f.division = 0;
src/sim/League.ts:1023:    for (const d of [0, 1] as Division[]) {
src/sim/League.ts:1024:      const group = this.division(d);
src/sim/League.ts:1046:      const own = (f.division === 0 ? map1 : map2).get(f.slot) ?? 0;
src/sim/League.ts:1155:  playerLines(division?: Division): PlayerSeasonLine[] {
src/sim/League.ts:1158:      if (division !== undefined && f.division !== division) continue;
src/sim/League.ts:1175:  private buildAwards(division: Division): SeasonAwards {
src/sim/League.ts:1176:    const lines = this.playerLines(division);
src/sim/League.ts:1188:      if (f.division !== division) continue;
src/sim/League.ts:1308:    // ATTR_KEY, so a pre-v32 squad missing `positioning` would poison the
src/sim/League.ts:1314:      if (a && a.positioning === undefined) a.positioning = 0.5;
src/sim/League.ts:1336:      // v3 -> v4: the single 8-team division becomes Division 1, and a brand
src/sim/League.ts:1337:      // new Division 2 spawns beneath it. The current season's D1 fixtures
src/sim/League.ts:1340:      for (const f of franchises) f.division = 0;
src/sim/League.ts:1355:      for (const f of data.fixtures as Fixture[]) f.division = 0;
src/sim/League.ts:1357:        ...buildDivisionFixtures(newcomers.map((f) => f.slot), 1),
src/sim/League.ts:1398:      // (v1→v2 squads, v3→v4 Division 2 newcomers) already used today's
src/sim/League.ts:1487:          // The rebuilder drops unlisted keys — carry positioning (Phase 119j;
src/sim/League.ts:1490:          positioning: p.positioning ?? 0.5,
src/sim/League.ts:1522:      // v15 -> v16: per-player decision styles (Phase 54). Everyone loads
src/sim/League.ts:1831:/** Map a division's member slots onto a round-robin schedule. */
src/sim/League.ts:1832:export function buildDivisionFixtures(memberSlots: number[], division: Division): Fixture[] {
src/sim/League.ts:1836:    division,
src/ai/actionExecutor.ts:11:import { ballLanding, escapeCarry, interceptBall } from './perception';
src/ai/actionExecutor.ts:208:        // target on his reaction cadence (0.2–0.45s by defending), not
src/ai/actionExecutor.ts:307:        // aims at the routine's key zone, and the marker reaction lag above
src/ai/actionExecutor.ts:342:      // Kick already happened at decision time — brief follow-through.
src/ai/actionExecutor.ts:460:    // out not to block the trap at all — the passer's decision cadence is
src/ai/formations.ts:133:  // (positioning-shape.ts) before it can replace them. OFF = today's behavior.
src/ai/formations.ts:235: * B1-b. Opponent-relative positioning is B2. Same sensible modifiers as the
src/sim/cup.ts:4:import type { Division } from './League';
src/sim/cup.ts:9: * divisions, woven between league rounds. Pure bracket logic lives here so
src/sim/cup.ts:47:  division: Division;
src/sim/cup.ts:64:  /** Giant killing: the lower-division side knocked out a higher-division side. */
src/sim/cup.ts:101:  const byElo = (d: Division) =>
src/sim/cup.ts:103:      .filter((f) => f.division === d)
src/sim/cup.ts:110:    division: f.division,
src/sim/cup.ts:149:/** The underdog of a pairing: higher seed number (lower division always is). */
src/sim/cup.ts:294:  tie.upset = cupEntrant(cup, tie.winner).division > cupEntrant(cup, loser).division;
src/sim/records.ts:8: * identities across the whole timeline (divisions change, slots don't), so
src/sim/records.ts:13:/** Which division a slot played in during a recorded season (default 0 for the single-division era). */
src/sim/records.ts:14:export function divisionIn(rec: SeasonRecord, slot: number): 0 | 1 {
src/sim/records.ts:15:  return (rec.table.find((r) => r.slot === slot)?.division ?? 0) as 0 | 1;
src/sim/records.ts:80:    if (e.division !== 1) continue;
src/sim/records.ts:179:      if (divisionIn(rec, f.slot) === 0) {
src/sim/records.ts:186:    // The streak may still be alive: count the current division too.
src/sim/records.ts:187:    if (f.division === 0 && divisionIn(history[history.length - 1], f.slot) === 0) {
src/sim/records.ts:247:    const d1Rows = rec.table.filter((r) => (r.division ?? 0) === 0);
src/sim/records.ts:269:      out.push(`Former champions ${relTeam.name} fell to the Challenger Division${row ? ` with ${row.pts} points` : ''}.`);
src/sim/records.ts:273:  // Biggest collapse / overachiever by points swing vs last season (same team, same division both years).
src/sim/records.ts:279:        (r) => r.slot === row.slot && r.name === row.name && (r.division ?? 0) === (row.division ?? 0),
src/sim/records.ts:293:    const winnerDivision = cup.entrants.find((e) => e.slot === cup.winnerSlot)?.division ?? 0;
src/sim/records.ts:297:    if (winnerDivision === 1) {
src/sim/records.ts:302:      out.push(`CUP RUN: ${run.name} reached the ${CUP_ROUND_NAMES[run.roundReached].toLowerCase()} from the Challenger Division.`);
src/ai/PlayerBrain.ts:15:} from './perception';
src/ai/PlayerBrain.ts:18: * PlayerBrain — utility AI. Each decision tick the player scores a set of
src/ai/PlayerBrain.ts:23: * Kicks (Pass/Shoot/Clear) execute immediately at decision time; movement
src/ai/PlayerBrain.ts:96:  // Keeper hold (Phase 27.2): ball in the hands — no distribution decision
src/ai/PlayerBrain.ts:150:  // Offside awareness (Phase 29): real-law dead-ball exemptions, and the
src/ai/PlayerBrain.ts:269:  // One aerial-lane read per decision — the pass loop and the through-ball
src/ai/PlayerBrain.ts:278:      // they look — the trait is vision, priced into lane weight only.
src/ai/PlayerBrain.ts:551:  // snap-decision window (giveBall) makes the first-time strike.
src/ai/PlayerBrain.ts:891:  // brain tick of the moment dying and he falls through to positioning,
src/ai/PlayerBrain.ts:955:      // filter/map/spread allocated two arrays per GK decision.
src/ai/perception.ts:168: * against the first-time hit. Shared by the shoot decision
src/sim/constants.ts:105: * or blind — and both the shoot decision (laneBlockers-suppressed appetite)
src/ai/TeamBrain.ts:4:import { ballLanding } from './perception';
src/ai/TeamBrain.ts:92:    // Loose ball: keep the previous shape decision (brief window anyway).
src/sim/mechanics.ts:5:import { laneBlockers, opennessOf, pressureAt } from '../ai/perception';
src/sim/mechanics.ts:96:  speed: number, pressure: number, misalign: number, technique: number, positioning = 0.5,
src/sim/mechanics.ts:99:  // tames the PRESSURE and BLIND-SIDE penalties (the awareness half of a first
src/sim/mechanics.ts:104:  const aware = 1 - (positioning - 0.5) * 0.6; // 0.7 .. 1.3
src/sim/mechanics.ts:127:  let pFail = touchFailChance(speed, pressure, misalign, p.attrs.dribbling, p.attrs.positioning);
src/sim/mechanics.ts:162: * corners, goal kicks — passed down from the restart taker's decision).
src/sim/mechanics.ts:526: * meets it first-time (giveBall's snap-decision window). Faster than a
src/sim/mechanics.ts:848:    touchFailChance(speed, pressure, misalign, trapper.attrs.dribbling, trapper.attrs.positioning) + 0.05, 0, 0.5,
src/sim/mechanics.ts:1148:  // Dive difficulty, frozen at the moment of the strike (keeper reaction) —
src/sim/mechanics.ts:1859:  // the reaction-time difficulty discount barely applies (floor 0.85) and
src/sim/Player.ts:59:  decisionTimer = 0;
src/sim/Player.ts:76:   * again. Set at capture so the first decision happens ON the ball (the
src/sim/Player.ts:77:   * settle touch and the pass game keep their timing); a decision that
src/sim/Player.ts:108:   * Marker reaction lag (Phase 31.9, the headed-game pass): while the mark
src/sim/Player.ts:110:   * only re-read on the marker's reaction cadence (0.2–0.45s by defending)
src/sim/Player.ts:338:    this.decisionTimer -= dt;
src/sim/types.ts:116:  /** Top candidates from the last decision, for explainability. */
src/sim/chronicle.ts:36:    (r) => (r.division ?? 0) === 0 && r.slot !== rec.championSlot && (tl[r.slot]?.length ?? 0) >= R,
src/sim/chronicle.ts:154:    Math.max(...r.table.filter((row) => (row.division ?? 0) === 0).map((row) => row.pts));
src/sim/chronicle.ts:209:      // R16 giant killings are ~5 a season (every tie is cross-division) —
src/sim/Team.ts:142:  // positioning) don't allocate. Shared instances: callers must not mutate.
src/sim/Match.ts:8:import { opennessOf } from '../ai/perception';
src/sim/Match.ts:79:   * difficulty — it models reaction time. 1 = straight at the keeper,
src/sim/Match.ts:86:   * treating the far-corner curl like an open-play reaction save.
src/sim/Match.ts:183:  /** Gid whose next carrier decision must be a kick (restart first touch). */
src/sim/Match.ts:185:  /** Gid whose next carrier decision is the kickoff — played BACKWARD (27.3). */
src/sim/Match.ts:293:    // Stagger decision ticks deterministically (symmetric across the teams)
src/sim/Match.ts:295:    this.allPlayers.forEach((p) => (p.decisionTimer = ((p.index % TEAM_SIZE) + 1) * (AI_INTERVAL / TEAM_SIZE)));
src/sim/Match.ts:419:    // (they see earlier kicks and reactions). Measured effect: the team
src/sim/Match.ts:425:      if (p.decisionTimer <= 0) {
src/sim/Match.ts:427:        p.decisionTimer = AI_INTERVAL;
src/sim/Match.ts:731:    // Settle on the ball: carry it briefly before the next decision instead of
src/sim/Match.ts:744:    // decision comes quicker (the touch was the setup, not a reception).
src/sim/Match.ts:762:      // The settle beat before the next push: the first decision after any
src/sim/Match.ts:763:      // capture happens ON the ball (touchTimer ≥ the decision settle).
src/sim/Match.ts:778:    // Snap decisions in shooting range (Phase 28.2): a receiver in front of
src/sim/Match.ts:785:    p.decisionTimer = Math.max(p.decisionTimer, inShootingRange ? 0.08 : recollect ? 0.18 : 0.3);
src/sim/Match.ts:789:    if (gkFeet) p.decisionTimer = Math.min(p.decisionTimer, 0.18);
src/sim/Match.ts:825:            p.decisionTimer = 0.07;
src/sim/Match.ts:864:      // first decision happens ON the ball, so the pass game keeps its
src/sim/Match.ts:1326:      out.decisionTimer = 0.05;
src/sim/Match.ts:1506:    out.decisionTimer = 0.05; // think on arrival, not a stale slot's cadence
src/sim/Match.ts:1729:    // broadcast moment. The chase positioning already carried him to
src/sim/Match.ts:1754:      taker.decisionTimer = 0.12; // kick promptly (giveBall's settle is for open play)
src/sim/Match.ts:1953:    st.decisionTimer = 0.05;

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/sim/Player.ts | sed -n '1,390p'; nl -ba src/ai/formations.ts | sed -n '1,590p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	import { v2, type V2 } from '../utils/vec';
     2	import { STAMINA_DRAIN, STAMINA_RECOVERY } from './constants';
     3	import type { PlayerAttributes } from '../evolution/playerGenome';
     4	import { traitsOf, type Trait } from '../evolution/traits';
     5	import { TEAM_SIZE, type ActionState, type Role, type Side } from './types';
     6	
     7	/** Physical top speed by role (m/s) before pace/stamina scaling. */
     8	const BASE_SPEED: Record<Role, number> = { GK: 6.4, DF: 7.0, MF: 7.3, WG: 7.9, ST: 7.7 };
     9	const ACCEL = 14; // m/s^2 toward desired velocity
    10	
    11	/**
    12	 * Body turn rate (rad/s), Phase 27: heading sweeps toward the movement
    13	 * direction instead of snapping to it, so a 180° cut takes ~0.48s of visible
    14	 * rotation. Velocity itself is already inertia-bound by ACCEL — this cap is
    15	 * what the eye (and the kick-orientation mechanics) read as "facing".
    16	 */
    17	export const TURN_RATE = 6.5;
    18	// cos/sin of the per-step turn cap, cached per dt (the sim always uses DT).
    19	let turnDt = -1;
    20	let turnCos = 1;
    21	let turnSin = 0;
    22	
    23	export class Player {
    24	  /** Index within team (0..5, slot order GK/DF/MF/WGL/WGR/ST). */
    25	  readonly index: number;
    26	  /** Global id across both teams (0..11), = side * TEAM_SIZE + index. */
    27	  readonly gid: number;
    28	  readonly side: Side;
    29	  readonly role: Role;
    30	  /**
    31	   * Roster row this body's stats land on (Phase 61): a starter's slot index,
    32	   * a substitute's bench row. The PLAYER OBJECT is the pitch slot — a sub
    33	   * swaps its identity in place (`becomeSub`), so every gid-keyed reference
    34	   * (marks, renderer models, action targets) survives the change.
    35	   */
    36	  rosterIdx: number;
    37	  /** Identity fields — mutated ONLY by becomeSub (the bench, Phase 61). */
    38	  name: string;
    39	  /** Attribute genes (squad DNA) — pace/technique/finishing/defending/reflexes. */
    40	  attrs: PlayerAttributes;
    41	
    42	  pos = v2();
    43	  vel = v2();
    44	  heading = v2(1, 0);
    45	  /** Set every frame by the action executor; physics chases it. */
    46	  desiredVel = v2();
    47	  /**
    48	   * When set (by the executor, per frame), heading turns toward this point
    49	   * instead of the movement direction — keepers backpedal FACING the play
    50	   * (27.5). Holds a live reference (e.g. ball.pos); cleared each frame.
    51	   */
    52	  faceTarget: V2 | null = null;
    53	
    54	  stamina = 1;
    55	  staminaSpent = 0;
    56	  distance = 0;
    57	
    58	  action: ActionState = { type: 'HoldPosition', scores: [] };
    59	  decisionTimer = 0;
    60	  kickCooldown = 0;
    61	  tackleCooldown = 0;
    62	  /**
    63	   * Recovery stun (Phase 27): a dispossessed carrier stumbles and a beaten
    64	   * lunger picks themself up — movement is heavily damped while it runs, and
    65	   * a stunned player can't control a loose ball or tackle.
    66	   */
    67	  stunTimer = 0;
    68	  /**
    69	   * Keeper hold (Phase 27.2): after claiming the ball a keeper scoops it up
    70	   * and holds it briefly — untackleable, ball carried in the hands — before
    71	   * distributing. Never set for restart first touches (goal kicks stay quick).
    72	   */
    73	  gkHoldTimer = 0;
    74	  /**
    75	   * Discrete touches (Phase 36): time until this carrier may PUSH the ball
    76	   * again. Set at capture so the first decision happens ON the ball (the
    77	   * settle touch and the pass game keep their timing); a decision that
    78	   * keeps Dribble releases the next push.
    79	   */
    80	  touchTimer = 0;
    81	  /** Display-only: renderers play a lunge animation while this runs. */
    82	  tackleAnimTimer = 0;
    83	  /** Display-only: renderers play a keeper dive while this runs (27.4). */
    84	  saveAnimTimer = 0;
    85	  /** Display-only: renderers play a header jump while this runs (Phase 28). */
    86	  headerAnimTimer = 0;
    87	  /**
    88	   * Keeper distribution mode (Phase 28.3): set while holding the ball in the
    89	   * hands, cleared on the kick — a keeper who HELD the ball releases it
    90	   * deliberately (throw/pass/switch), never with a panic hoof.
    91	   */
    92	  gkDistributing = false;
    93	  /**
    94	   * Shape-wait budget spent (Phase 30.3): while distributing, the keeper
    95	   * re-arms the hold in small quanta until the outfielders settle into
    96	   * shape; this counts what's been spent so a parked team can't stall the
    97	   * match. Reset when a fresh hold starts.
    98	   */
    99	  gkShapeWait = 0;
   100	  /**
   101	   * One-touch window (Phase 31.9, 一脚出球): set at a PRESSURED reception —
   102	   * the receiver decides immediately, and a pass kicked while this runs is
   103	   * played first-time: extra aim noise, discounted by technique. Any kick
   104	   * consumes it; expiry means they took a settle touch after all.
   105	   */
   106	  firstTouchWindow = 0;
   107	  /**
   108	   * Marker reaction lag (Phase 31.9, the headed-game pass): while the mark
   109	   * SPRINTS near our goal, the marking stance target is frozen here and
   110	   * only re-read on the marker's reaction cadence (0.2–0.45s by defending)
   111	   * — frame-perfect shadowing had made the attacking header extinct.
   112	   */
   113	  markAnchor: V2 | null = null;
   114	  markAnchorAge = 0;
   115	  markAnchorIdx: number | null = null;
   116	  /**
   117	   * 2过1 burst license (Phase 34): granted when this player plays a short
   118	   * pass under pressure — for its ~1.1s he sprints past his marker and the
   119	   * return ball INTO him (from `partnerGid`) is scored as the wall pass,
   120	   * not the "handing it straight back" it would otherwise read as.
   121	   */
   122	  wallRun: { until: number; partnerGid: number } | null = null;
   123	  /**
   124	   * Containment hysteresis (Phase 101): whether this chaser is currently
   125	   * JOCKEYING the carrier. The phase-92 goal-side test was a razor-edge
   126	   * boolean — a chaser dancing on the −0.2 offset flipped between the
   127	   * standoff point and the ball 66-70 times/match (`hold-jitter.ts`), a
   128	   * brain-level whip the render reads as twitching. Enter containment only
   129	   * clearly goal-side, hold it until clearly not. Runtime-only state.
   130	   */
   131	  containing = false;
   132	
   133	  /**
   134	   * Slalom COMMITMENT (Phase 41.2, user report "带球转一大圈然后突然丢
   135	   * 球"): the side picked to beat the current blocker, held until the
   136	   * timestamp. Without it a defender shadowing the carrier on the goal
   137	   * axis flipped the perp sign every few ticks — the turn-rate cap
   138	   * integrated the flip-flop into a full pirouette at walking pace
   139	   * (momentum gone = no pace protection) until the tackle landed. A real
   140	   * dribbler picks a shoulder and goes.
   141	   */
   142	  slalomSide: 1 | -1 = 1;
   143	  slalomUntil = -1;
   144	
   145	  /** Age in seasons (Phase 26) — display only, set by Team from TeamInfo. */
   146	  age?: number;
   147	  /** Has a yellow card this match — a second booking is a red (Phase 25). */
   148	  booked = false;
   149	  /** Sent off: parked on the apron, excluded from every sim interaction. */
   150	  sentOff = false;
   151	  /** Injury state (Phase 118): a 'knock' plays on visibly slower; 'serious'
   152	   * comes off (the league ban rides MatchResult.injuries). Reset on sub. */
   153	  injured?: 'knock' | 'serious';
   154	
   155	  baseSpeed: number;
   156	  accel: number;
   157	  /** Traits (Phase 39) — derived from attrs+role, ≤2. Recomputed on becomeSub. */
   158	  traits: readonly Trait[];
   159	  /** Cached engine-trait drain factor (hot path — no includes() per step). */
   160	  staminaDrainMul: number;
   161	
   162	  constructor(side: Side, index: number, role: Role, name: string, attrs: PlayerAttributes) {
   163	    this.side = side;
   164	    this.index = index;
   165	    this.gid = side * TEAM_SIZE + index;
   166	    this.rosterIdx = index;
   167	    this.role = role;
   168	    this.name = name;
   169	    this.attrs = attrs;
   170	    // pace: ±12% top speed, ±10% acceleration around the role baseline.
   171	    this.baseSpeed = BASE_SPEED[role] * (0.88 + attrs.pace * 0.24);
   172	    this.accel = ACCEL * (0.9 + attrs.pace * 0.2);
   173	    // Traits (Phase 39): derived, never stored — a developing player grows
   174	    // into (or out of) them. Hot-path effects are cached as plain numbers.
   175	    this.traits = traitsOf(attrs, role);
   176	    this.staminaDrainMul = this.traits.includes('engine') ? 0.9 : 1;
   177	  }
   178	
   179	  /**
   180	   * The SUBSTITUTION (Phase 61, N2): this pitch slot changes bodies. The
   181	   * object survives so every reference keyed by gid stays valid; the
   182	   * identity — name, genes, traits, speed — becomes the bench player's.
   183	   * Fresh legs are the bench's whole payoff: stamina resets to 1. Cards
   184	   * are personal (the new man is unbooked). distance/staminaSpent are NOT
   185	   * reset — they fold into TEAM totals at full time and must keep the
   186	   * outgoing man's work.
   187	   */
   188	  /** A KNOCK (Phase 118): hurt but playing on — pace and close control
   189	   * degrade for the rest of his match. The attrs object is REPLACED, never
   190	   * mutated: the roster row is shared with the franchise. */
   191	  takeKnock(): void {
   192	    this.injured = 'knock';
   193	    this.attrs = { ...this.attrs, pace: this.attrs.pace * 0.8, dribbling: this.attrs.dribbling * 0.85 };
   194	    this.baseSpeed = BASE_SPEED[this.role] * (0.88 + this.attrs.pace * 0.24);
   195	    this.accel = ACCEL * (0.9 + this.attrs.pace * 0.2);
   196	  }
   197	
   198	  becomeSub(sub: { rosterIdx: number; name: string; attrs: PlayerAttributes; age?: number }, pos: V2): void {
   199	    this.name = sub.name;
   200	    this.attrs = sub.attrs;
   201	    this.age = sub.age;
   202	    this.rosterIdx = sub.rosterIdx;
   203	    this.baseSpeed = BASE_SPEED[this.role] * (0.88 + sub.attrs.pace * 0.24);
   204	    this.accel = ACCEL * (0.9 + sub.attrs.pace * 0.2);
   205	    this.traits = traitsOf(sub.attrs, this.role);
   206	    this.staminaDrainMul = this.traits.includes('engine') ? 0.9 : 1;
   207	    this.stamina = 1;
   208	    this.booked = false;
   209	    this.injured = undefined; // the new man arrives whole (Phase 118)
   210	    this.pos = v2(pos.x, pos.y);
   211	    this.vel = v2();
   212	    this.desiredVel = v2();
   213	    this.heading = v2(0, pos.y > 0 ? -1 : 1); // facing the pitch he steps onto
   214	    this.faceTarget = null;
   215	    this.action = { type: 'MoveToFormationSpot', scores: [] };
   216	    this.kickCooldown = 0;
   217	    this.tackleCooldown = 0;
   218	    this.stunTimer = 0;
   219	    this.touchTimer = 0;
   220	    this.gkHoldTimer = 0;
   221	    this.gkDistributing = false;
   222	    this.gkShapeWait = 0;
   223	    this.tackleAnimTimer = 0;
   224	    this.saveAnimTimer = 0;
   225	    this.headerAnimTimer = 0;
   226	    this.firstTouchWindow = 0;
   227	    this.markAnchor = null;
   228	    this.markAnchorAge = 0;
   229	    this.markAnchorIdx = null;
   230	    this.wallRun = null;
   231	  }
   232	
   233	  /** Effective top speed — tired players slow down but never stop. */
   234	  get topSpeed(): number {
   235	    return this.baseSpeed * (0.62 + 0.38 * this.stamina);
   236	  }
   237	
   238	  physicsStep(dt: number): void {
   239	    // In-place integration — this ran as clampLen/approachV/add/norm, which
   240	    // allocated ~6 vectors per player per step (860k per match). The exact
   241	    // same operations in the exact same IEEE order, written out flat:
   242	    // results are bit-identical (regression: same seed ⇒ same save JSON).
   243	    const dv = this.desiredVel;
   244	    const max = this.topSpeed;
   245	    const dl = Math.sqrt(dv.x * dv.x + dv.y * dv.y); // clampLen
   246	    let tx = dv.x;
   247	    let ty = dv.y;
   248	    if (dl > max && dl > 1e-8) {
   249	      const s = max / dl;
   250	      tx = dv.x * s;
   251	      ty = dv.y * s;
   252	    }
   253	    // Stunned (Phase 27): stumbling players can barely move until they recover.
   254	    if (this.stunTimer > 0) {
   255	      tx *= 0.15;
   256	      ty *= 0.15;
   257	    }
   258	    const maxDelta = this.accel * dt; // approachV
   259	    const ax = tx - this.vel.x;
   260	    const ay = ty - this.vel.y;
   261	    const al = Math.sqrt(ax * ax + ay * ay);
   262	    if (al <= maxDelta || al < 1e-8) {
   263	      this.vel.x = tx;
   264	      this.vel.y = ty;
   265	    } else {
   266	      const s = maxDelta / al;
   267	      this.vel.x = this.vel.x + ax * s;
   268	      this.vel.y = this.vel.y + ay * s;
   269	    }
   270	    this.pos.x = this.pos.x + this.vel.x * dt;
   271	    this.pos.y = this.pos.y + this.vel.y * dt;
   272	
   273	    const sp = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
   274	    // Rotate heading toward the face target (backpedal, 27.5) or, failing
   275	    // that, the movement direction — capped at TURN_RATE either way.
   276	    // No trig in the loop: the per-step rotation's cos/sin are cached per dt.
   277	    if (dt !== turnDt) {
   278	      turnDt = dt;
   279	      turnCos = Math.cos(TURN_RATE * dt);
   280	      turnSin = Math.sin(TURN_RATE * dt);
   281	    }
   282	    const ft = this.faceTarget;
   283	    let wx = 0;
   284	    let wy = 0;
   285	    let turn = false;
   286	    if (ft) {
   287	      const fx = ft.x - this.pos.x;
   288	      const fy = ft.y - this.pos.y;
   289	      const fl = Math.sqrt(fx * fx + fy * fy);
   290	      if (fl > 1e-6) {
   291	        wx = fx / fl;
   292	        wy = fy / fl;
   293	        turn = true;
   294	      }
   295	    } else if (sp > 0.5) {
   296	      wx = this.vel.x / sp;
   297	      wy = this.vel.y / sp;
   298	      turn = true;
   299	    }
   300	    if (turn) {
   301	      const hx = this.heading.x;
   302	      const hy = this.heading.y;
   303	      if (hx * wx + hy * wy >= turnCos) {
   304	        this.heading = { x: wx, y: wy };
   305	      } else {
   306	        const s = hx * wy - hy * wx >= 0 ? turnSin : -turnSin;
   307	        this.heading = { x: hx * turnCos - hy * s, y: hx * s + hy * turnCos };
   308	      }
   309	    }
   310	    this.distance += sp * dt;
   311	
   312	    // Stamina: quadratic drain above ~55% effort, slow recovery when jogging/idle.
   313	    // The engine trait (Phase 39) drains 10% slower — the motor runs all day.
   314	    const effort = sp / this.baseSpeed;
   315	    // The stamina ATTRIBUTE scales drain and recovery (Phase 47): neutral
   316	    // at the 0.4 backfill so the league's energy economy doesn't move —
   317	    // the motor is now a dimension evolution can spend on.
   318	    // Phase 58: drain/recovery repriced so the economy BINDS in-match
   319	    // (constants.ts has the story) — legs are a resource, not a gauge.
   320	    if (effort > 0.55) {
   321	      const drain =
   322	        STAMINA_DRAIN * effort * effort * dt * this.staminaDrainMul * (1.24 - this.attrs.stamina * 0.6);
   323	      this.stamina = Math.max(0.05, this.stamina - drain);
   324	      this.staminaSpent += drain;
   325	    } else {
   326	      this.stamina = Math.min(1, this.stamina + STAMINA_RECOVERY * dt * (0.88 + this.attrs.stamina * 0.3));
   327	    }
   328	
   329	    this.kickCooldown = Math.max(0, this.kickCooldown - dt);
   330	    this.tackleCooldown = Math.max(0, this.tackleCooldown - dt);
   331	    this.touchTimer = Math.max(0, this.touchTimer - dt);
   332	    this.stunTimer = Math.max(0, this.stunTimer - dt);
   333	    this.gkHoldTimer = Math.max(0, this.gkHoldTimer - dt);
   334	    this.tackleAnimTimer = Math.max(0, this.tackleAnimTimer - dt);
   335	    this.saveAnimTimer = Math.max(0, this.saveAnimTimer - dt);
   336	    this.headerAnimTimer = Math.max(0, this.headerAnimTimer - dt);
   337	    this.firstTouchWindow = Math.max(0, this.firstTouchWindow - dt);
   338	    this.decisionTimer -= dt;
   339	  }
   340	
   341	  /**
   342	   * An instantaneous burst the movement drain never saw — a tackle lunge
   343	   * (Phase 58). Same per-player modifiers as the running drain, so engines
   344	   * and high-stamina players absorb bursts better too.
   345	   */
   346	  spendBurst(cost: number): void {
   347	    const drain = cost * this.staminaDrainMul * (1.24 - this.attrs.stamina * 0.6);
   348	    this.stamina = Math.max(0.05, this.stamina - drain);
   349	    this.staminaSpent += drain;
   350	  }
   351	
   352	  resetForKickoff(pos: V2): void {
   353	    this.pos = pos;
   354	    this.vel = v2();
   355	    this.desiredVel = v2();
   356	    this.action = { type: 'MoveToFormationSpot', scores: [] };
   357	    this.kickCooldown = 0;
   358	    this.tackleCooldown = 0;
   359	    this.stunTimer = 0;
   360	    this.gkHoldTimer = 0;
   361	    this.gkDistributing = false;
   362	    this.gkShapeWait = 0;
   363	    this.tackleAnimTimer = 0;
   364	    this.saveAnimTimer = 0;
   365	    this.headerAnimTimer = 0;
   366	    this.firstTouchWindow = 0;
   367	    this.slalomUntil = -1;
   368	  }
   369	}
     1	import { clamp } from '../utils/math';
     2	import { v2, type V2 } from '../utils/vec';
     3	import { BOX_DEPTH, CORNER_CLEARANCE, GOAL_WIDTH, HALF_L, HALF_W, PITCH_SCALE } from '../sim/constants';
     4	import type { Ball } from '../sim/Ball';
     5	import type { Player } from '../sim/Player';
     6	import type { Team } from '../sim/Team';
     7	import type {
     8	  AttackFormationId, CornerRoutine, DefendFormationId, TeamMode,
     9	} from '../sim/types';
    10	
    11	/**
    12	 * Formation spot tables (Phase 30) in team-local coordinates: +x = our
    13	 * attacking direction, x=-45 is our goal line. One V2 per SLOT in order
    14	 * [GK, DF, MF, WGL, WGR, ST]; every team owns one attacking and one
    15	 * defending table (its identity, `team.style`). The whole block still
    16	 * slides with the ball, the tactical mode, and three genes (formationDepth,
    17	 * attackingWidth, defensiveCompactness) exactly as it did on the old single
    18	 * BASE_SPOTS. Formation names count outfield lines back→front.
    19	 *
    20	 * Lanes are deliberately separated (Phase 27.1): stacked spines collapse
    21	 * open play into one central corridor. Back-line height is the goals lever
    22	 * (Phase 29/30: higher line = compressed game, space in behind for runs).
    23	 */
    24	export const ATTACK_FORMATIONS: Record<AttackFormationId, V2[]> = {
    25	  // Double base, a linking striker, both wingers HIGH and WIDE (两翼齐飞).
    26	  'wide-212': [v2(-41, 0), v2(-16, -6), v2(-12, 7), v2(8, -19), v2(8, 19), v2(4, 0)],
    27	  // One anchor, the left winger tucks in, an inside-right pair — at the
    28	  // HALF-SPACES (8/11 → 12/15, Phase 31.8): with both wide slots inside
    29	  // y≤11, a narrow-vs-narrow derby had no relief valve at all — both
    30	  // attacks mirrored into one central corridor and the top-5 most chaotic
    31	  // matches in the league (t+i 85–123, zero goals) were ALL this fixture.
    32	  // Still clearly narrower than wide-212's ±19: inside-forwards, not
    33	  // wingers.
    34	  'narrow-122': [v2(-41, 0), v2(-19, 0), v2(-9, -7), v2(-6, 12), v2(6, 15), v2(7, -3)],
    35	  // NOVEL (Phase 67, N5 — mutation-discovered only). TWIN STRIKERS: the
    36	  // right winger becomes a second 9 — a high pair splitting the center
    37	  // backs, one true wide feeder on the left, two at the base. The twins
    38	  // sit a touch higher than wide-212's wingers: a spearhead, not a line.
    39	  'twin-st': [v2(-41, 0), v2(-16, -4), v2(-11, 5), v2(2, -17), v2(10, 6), v2(10, -6)],
    40	  // NOVEL. The FALSE NINE: the striker DROPS between the lines (-2, the
    41	  // hole) to link and drag the last defender out; both wingers push very
    42	  // high and very wide — the runners the false nine releases into the
    43	  // space he vacated.
    44	  'false-nine': [v2(-41, 0), v2(-17, -5), v2(-12, 5), v2(12, -18), v2(12, 18), v2(-2, 0)],
    45	  // NOVEL (Phase 107, N5 — mutation-discovered only). The OVERLOAD: the
    46	  // library's first ASYMMETRIC shape — a three-man left-flank triangle
    47	  // (MF half-space, WGL wide, ST shading in) with the right winger ALONE
    48	  // at maximum width as the isolation outlet (overload to isolate: the
    49	  // switch finds him 1v1). The anchor shades right-center to cover the
    50	  // side the triangle vacates.
    51	  'overload': [v2(-41, 0), v2(-17, 3), v2(-7, -9), v2(9, -17), v2(8, 17), v2(5, -7)],
    52	  // NOVEL. The TARGET MAN (the user's N1.5 reference point — 埃弗顿高塔):
    53	  // the lone tower stands HIGHEST of any shape (+9) as the long ball's
    54	  // destination — the Phase-63 aerial channel finally gets a shape built
    55	  // around it (strength/aerialSense own the descent) — with both wingers
    56	  // at mid-height arriving onto the knock-down, staggered double base
    57	  // behind (no stacked central spine, the 27.1 lesson).
    58	  'target-man': [v2(-41, 0), v2(-18, -4), v2(-10, 5), v2(0, -14), v2(0, 14), v2(9, 0)],
    59	};
    60	
    61	// Defend tables keep the STRIKER HIGH on purpose (30.4). The first cut
    62	// parked all five outfielders goal-side and league scoring collapsed to
    63	// ~1.1: a high body PINS an opposing defender (offence by presence) and
    64	// gives every turnover a launch point — 29.x, whose single spot table left
    65	// the ST at +5 even out of possession, scored fine for exactly this
    66	// reason. Identity lives in the BACK of the shape instead: low-32 drops
    67	// both wingers as wide backs; press-23 pushes them onto the build-up.
    68	export const DEFEND_FORMATIONS: Record<DefendFormationId, V2[]> = {
    69	  // Back THREE (wingers drop as wide backs), MF screens, ST stays HIGH.
    70	  'low-32': [v2(-41, 0), v2(-20, 0), v2(-9, -4), v2(-16, -11), v2(-16, 11), v2(5, 2)],
    71	  // Back two, wingers at halfway, ST hunting the opponent back line.
    72	  'press-23': [v2(-41, 0), v2(-18, -5), v2(-13, 5), v2(0, -15), v2(0, 15), v2(7, 0)],
    73	  // N5b (phase-79): the menu was BINARY (deep bus / front press) and world
    74	  // 991 fixed 16/0 on low-32 — selection had nothing structurally new to
    75	  // try. Two additions, mutation-only (founders still derive the classics):
    76	  // mid-41 = the midfield WALL, striker drops onto the pivot lane
    77	  // ("defend from the front" without pressing);
    78	  'mid-41': [v2(-41, 0), v2(-22, 0), v2(-10, 0), v2(-12, -13), v2(-12, 13), v2(-3, 0)],
    79	  // high-line = squeeze the pitch with the back line, no front press —
    80	  // lives or dies by the offside trap (phase-71's law made it honest).
    81	  'high-line': [v2(-41, 0), v2(-14, -3), v2(-9, 3), v2(-13, -12), v2(-13, 12), v2(6, 0)],
    82	};
    83	
    84	// Density相变 (2026-07-20): the fixed tables above were tuned in ABSOLUTE
    85	// metres for the 90×58 pitch, so on a shrunk pitch (PITCH_SCALE<1) they fall
    86	// out of bounds. Scale them to stay proportional + in-bounds. The DEFAULT path
    87	// is emergentStation (fractional, already fits); this keeps the legacy fixed
    88	// path + the pre-match shape diagrams valid when the field is scaled.
    89	if (PITCH_SCALE !== 1) {
    90	  for (const table of [ATTACK_FORMATIONS, DEFEND_FORMATIONS] as Record<string, V2[]>[]) {
    91	    for (const key of Object.keys(table)) {
    92	      table[key] = table[key].map((p) => v2(p.x * PITCH_SCALE, p.y * PITCH_SCALE));
    93	    }
    94	  }
    95	}
    96	
    97	// EMERGENT POSITIONING FIELD (Phase B → DEFAULT 2026-07-20, the coordinated
    98	// density相变). Positions grow from role + genes + live state, not a fixed
    99	// formation menu — VISION §1's #1 violation retired. It is REQUIRED on the
   100	// shrunk pitch (PITCH_SCALE<1): emergent stations are fractional and auto-fit,
   101	// the fixed tables use absolute coords and would fall off a smaller pitch.
   102	// The UI toggle (settings → experimental) can still turn it OFF for A/B, and
   103	// probes can force-OFF with EMERGENT_POS=0.
   104	let _emergentPos: boolean | null = null; // null = use the default (ON)
   105	export function setEmergentPos(on: boolean): void {
   106	  _emergentPos = on;
   107	}
   108	export function emergentPosOn(): boolean {
   109	  if (_emergentPos !== null) return _emergentPos; // explicit UI / probe override
   110	  // typeof guard: `process` is undefined in the browser bundle — never throw.
   111	  if (typeof process !== 'undefined' && process.env && process.env.EMERGENT_POS === '0') return false;
   112	  return true; // DEFAULT ON
   113	}
   114	
   115	/** How far up/down the pitch each tactical mode pushes the block. */
   116	const MODE_SHIFT: Record<TeamMode, number> = {
   117	  Attack: 10,
   118	  BuildUp: 4,
   119	  CounterAttack: 8,
   120	  Press: 6,
   121	  Defend: -8,
   122	  ResetShape: 0,
   123	};
   124	
   125	/**
   126	 * World-space formation target for a player. `hasBall` decides whether width
   127	 * (attackingWidth) or compactness (defensiveCompactness) shapes the block.
   128	 */
   129	export function formationSpot(p: Player, team: Team, ball: Ball, hasBall: boolean, opp?: Team): V2 {
   130	  // EMERGENT POSITIONING FIELD (Phase B1, toggle — the user's #1 emergence
   131	  // ask: shape must grow from role + genes + live state, not a hand-authored
   132	  // MENU). Behind a flag so it A/Bs cleanly against the fixed tables
   133	  // (positioning-shape.ts) before it can replace them. OFF = today's behavior.
   134	  if (emergentPosOn()) return emergentStation(p, team, ball, hasBall, opp);
   135	  const g = team.genome;
   136	  const base = hasBall
   137	    ? ATTACK_FORMATIONS[team.style.formationAtk][p.index]
   138	    : DEFEND_FORMATIONS[team.style.formationDef][p.index];
   139	
   140	  // Block slides toward the ball along x (local coords), capped at ±10m.
   141	  const ballLocalX = team.localX(ball.pos.x);
   142	  const slide = clamp(ballLocalX * 0.3, -10, 10);
   143	
   144	  // formationDepth: 0 = sit 6m deeper, 1 = push 6m higher.
   145	  const depth = (g.formationDepth - 0.5) * 12;
   146	
   147	  // PRESSING BUYS ITS RISK (Phase 83, the goal-inflation fix): a pressing
   148	  // side's defensive block steps UP with its press gene — outfielders only,
   149	  // defending phase only. Before this, line height was formationDepth's
   150	  // alone, so evolution could chase-press from a deep couch: turnovers with
   151	  // ZERO space conceded behind — the free lunch that rode pressIntensity to
   152	  // 0.88 and the league to 6-7 goals (phase-82 anatomy). Now the line you
   153	  // press with is the line the through-ball/route-one/chip channels attack.
   154	  const pressUp = hasBall || p.role === 'GK' ? 0 : (g.pressIntensity - 0.5) * 8;
   155	
   156	  let x = base.x + slide + depth + pressUp + MODE_SHIFT[team.mode];
   157	
   158	  // Rest defence (Phase 31): the DF slot NEVER joins the siege. With the
   159	  // ball deep in the opponent half, slide (+10) + Attack shift (+10) used
   160	  // to push even the last outfielder past halfway — the attacking team had
   161	  // literally nobody covering, so every turnover was an uncontested
   162	  // breakaway. That hole is what let a 5v6 side out-score its own
   163	  // full-strength baseline once the open-run economy paid honestly
   164	  // (counters were ALL open runs). One cover man keeps counters real —
   165	  // beatable by pace or a dragged block, never free.
   166	  // −12, not −5: a cover man AT halfway is already beaten by the time a
   167	  // counter carrier enters the open-run zone (28m out) — he has to start
   168	  // goal-side of the race, near his base spot, to ever contest it.
   169	  if (p.index === 1 && p.role !== 'GK') {
   170	    if (hasBall) {
   171	      // Rest-defense depth is now the SWEEPER gene's possession face
   172	      // (Phase 88): 0.5 = the old hardcoded −12 exactly; the full libero
   173	      // (1) holds −16 even mid-siege, the bold stopper (0) dares −8.
   174	      x = Math.min(x, -8 - (g.coverBias ?? 0.5) * 8);
   175	    } else {
   176	      // THE SWEEPER (Phase 88, school #2 — catenaccio): the DF slot sits
   177	      // off his own line by the gene — behind it (libero: the man who
   178	      // meets whatever beats the first wave, at the price of playing
   179	      // everyone onside) or ahead of it (stopper: early interceptions,
   180	      // gambling the space behind). 0.5 = today's flat line.
   181	      x -= ((g.coverBias ?? 0.5) - 0.5) * 8;
   182	    }
   183	  }
   184	
   185	  // Width: stretch when we have the ball, squeeze when we don't. The
   186	  // in-possession floor is 1.0 (Phase 27.1) — an attacking shape should
   187	  // never be narrower than its base lanes.
   188	  let widthMul = hasBall
   189	    ? 1.0 + g.attackingWidth * 0.55 // 1.0 .. 1.55
   190	    : 1.15 - g.defensiveCompactness * 0.6; // 1.15 .. 0.55
   191	  // Zonal shape stays HONEST-WIDE (Phase 30.4): a zone defence covers
   192	  // width by definition — it may not also collapse into the central
   193	  // corridor, or its parked bodies dead-lane the entire pitch (measured:
   194	  // zonal sides conceded 3.6 shots/match vs man's 8 — the league's shot
   195	  // volume collapsed with half the clubs zonal).
   196	  if (!hasBall && team.style.scheme === 'zonal') widthMul = Math.max(widthMul, 0.95);
   197	  let y = base.y * widthMul;
   198	
   199	  // Compact teams also drag their block a little toward the ball's y.
   200	  if (!hasBall) y += (ball.pos.y - y * team.attackDir) * team.attackDir * g.defensiveCompactness * 0.25;
   201	
   202	  // Weak-side far-post pull (Phase 31): when the attack is deep AND wide,
   203	  // the far winger leaves the touchline and attacks the back post — the
   204	  // overload that punishes a ball-side defensive shift, and the second
   205	  // body a cutback or deep cross finds. The strong-side winger keeps the
   206	  // width; the pull releases as soon as the ball comes back central.
   207	  if (
   208	    hasBall && p.role === 'WG' && ballLocalX > HALF_L - 20 &&
   209	    Math.abs(ball.pos.y) > 12 && Math.sign(y) !== Math.sign(ball.pos.y)
   210	  ) {
   211	    y *= 0.3;
   212	  }
   213	
   214	  if (p.role === 'GK') {
   215	    // Keepers hold a narrow band in front of goal regardless of mode.
   216	    x = clamp(base.x + (g.keeperAggression - 0.5) * 4, -HALF_L + 1, -HALF_L + 11);
   217	    y = clamp(ball.pos.y * 0.25, -GOAL_WIDTH / 2, GOAL_WIDTH / 2);
   218	    return v2(x * team.attackDir, y);
   219	  }
   220	
   221	  x = clamp(x, -HALF_L + 3, HALF_L - 7);
   222	  y = clamp(y, -HALF_W + 2, HALF_W - 2);
   223	  return v2(x * team.attackDir, y);
   224	}
   225	
   226	/**
   227	 * EMERGENT POSITIONING FIELD (Phase B1-a). Replaces the fixed formation TABLE
   228	 * with a ROLE-anchored field: a role gives a coarse depth+lane TENDENCY (a
   229	 * dimension, like an attribute — not a hand-drawn shape), and the actual
   230	 * station grows from that + the live game state, weighted by GENES. So the
   231	 * team's SHAPE and "style" emerge from gene weights, not from us picking
   232	 * wide-212 vs low-32. B1-a lands the structural swap + a REAL, gene-weighted
   233	 * strong/weak-side shift (the B0 probe found the old ~2m drag was token). The
   234	 * anti-clump / space-value terms (kill the bus box-crowd, no clumping) are
   235	 * B1-b. Opponent-relative positioning is B2. Same sensible modifiers as the
   236	 * table path (slide/depth/press/rest-defence/width) so shape stays sane.
   237	 */
   238	function emergentStation(p: Player, team: Team, ball: Ball, hasBall: boolean, opp?: Team): V2 {
   239	  const g = team.genome;
   240	  // Role → coarse (depth fraction of HALF_L, lane fraction of HALF_W). WGs take
   241	  // a side from their slot (L=3, R=4); everyone else holds a central lane.
   242	  const laneSign = p.index === 3 ? -1 : p.index === 4 ? 1 : 0;
   243	  let depthFrac: number;
   244	  let laneFrac: number;
   245	  switch (p.role) {
   246	    case 'GK': depthFrac = -0.91; laneFrac = 0; break;
   247	    case 'DF': depthFrac = -0.45; laneFrac = 0; break;
   248	    case 'MF': depthFrac = -0.12; laneFrac = laneSign * 0.12; break;
   249	    case 'WG': depthFrac = 0.05; laneFrac = laneSign * 0.6; break;
   250	    default: depthFrac = 0.12; laneFrac = 0; break; // ST
   251	  }
   252	
   253	  const ballLocalX = team.localX(ball.pos.x);
   254	  const slide = clamp(ballLocalX * 0.3, -10, 10);
   255	  const depth = (g.formationDepth - 0.5) * 12;
   256	  const pressUp = hasBall || p.role === 'GK' ? 0 : (g.pressIntensity - 0.5) * 8;
   257	  let x = depthFrac * HALF_L + slide + depth + pressUp + MODE_SHIFT[team.mode];
   258	
   259	  // Rest defence — the DF slot never joins the siege (same as the table path).
   260	  if (p.index === 1 && p.role !== 'GK') {
   261	    if (hasBall) x = Math.min(x, -8 - (g.coverBias ?? 0.5) * 8);
   262	    else x -= ((g.coverBias ?? 0.5) - 0.5) * 8;
   263	  }
   264	
   265	  // Width: stretch in possession, squeeze out of it.
   266	  let widthMul = hasBall ? 1.0 + g.attackingWidth * 0.55 : 1.15 - g.defensiveCompactness * 0.6;
   267	  if (!hasBall && team.style.scheme === 'zonal') widthMul = Math.max(widthMul, 0.95);
   268	  let y = laneFrac * HALF_W * widthMul;
   269	
   270	  // ⭐ STRONG / WEAK SIDE (B1-a, the real thing): the block slides toward the
   271	  // BALL'S y — overload the ball side in attack, protect it in defence —
   272	  // weighted by width (attack) / compactness (defence). The B0 probe measured
   273	  // the old drag at only ~2m and gene-flat; this is a genuine, selectable
   274	  // ball-side shift, so a team that commits to it gets a real strong side and
   275	  // leaves a weak side (which width/switches then punish — emergent).
   276	  // TRANSLATE the block ball-side (add a common offset) — do NOT converge each
   277	  // man onto ball.y (that collapses the lateral spread; the first B1-a cut did,
   278	  // halving spreadY). The whole shape slides over, keeping its width.
   279	  const ballSideShift = hasBall ? 0.18 + g.attackingWidth * 0.22 : 0.18 + g.defensiveCompactness * 0.25;
   280	  y += ball.pos.y * ballSideShift;
   281	
   282	  // ⭐ B2: the block tracks the OPPONENT's push, not just the ball (the user's
   283	  // "阵型也不会随着对面的移动而移动"). The defensive spine (DF/MF) holds a line
   284	  // just goal-side of the opponents' advanced players — step UP when they sit
   285	  // deep, DROP when they push. A modest convergence, so the block MOVES WITH
   286	  // the opponent line while keeping its own depth structure. Only when we have
   287	  // an opponent reference (executor/marking path); attack + supportSpot skip it.
   288	  if (!hasBall && opp && (p.role === 'DF' || p.role === 'MF')) {
   289	    const adv = opp.players
   290	      .filter((o) => o.role !== 'GK' && !o.sentOff)
   291	      .map((o) => team.localX(o.pos.x))
   292	      .sort((a, b) => a - b);
   293	    if (adv.length >= 2) {
   294	      const holdLine = adv[1] - 3; // goal-side of their 2nd-deepest attacker
   295	      x += (holdLine - x) * 0.14;
   296	    }
   297	  }
   298	
   299	  // ⭐ B1-b: ANTI-CLUMP + position by VALUE (the user's "一堆人挤自家禁区,防守
   300	  // 帮助 0" / "别扎堆"). Stations REPEL each other, so bodies SPREAD to cover
   301	  // space instead of piling into the same zone — the emergent alternative to a
   302	  // fixed lattice AND to the bus box-crowd. Computed in the local-x / world-y
   303	  // frame (x is local, y unflipped). Plus a box-crowd relief: with no ball
   304	  // threat to our box, nobody buries INSIDE it — hold the useful edge.
   305	  // Defensive THREAT = how close the ball is to OUR goal (0 at/above halfway,
   306	  // ~1 deep in our third). Spread when there's no threat (cover space, no
   307	  // bus-crowd); COMPACT the last line under threat (B-continued — the first
   308	  // B1-b spread even the back line → clean chances → goals-warming inflated
   309	  // to overperf 2.1×; solidity restored here).
   310	  const threat = clamp((-team.localX(ball.pos.x) - 8) / 26, 0, 1);
   311	  if (p.role !== 'GK') {
   312	    let rx = 0;
   313	    let ry = 0;
   314	    for (const q of team.players) {
   315	      if (q === p || q.role === 'GK' || q.sentOff) continue;
   316	      const dxL = x - team.localX(q.pos.x);
   317	      const dyL = y - q.pos.y;
   318	      const d = Math.hypot(dxL, dyL);
   319	      if (d < 9 && d > 1e-3) {
   320	        const f = (9 - d) / 9;
   321	        rx += (dxL / d) * f;
   322	        ry += (dyL / d) * f;
   323	      }
   324	    }
   325	    const spread = 2.6 * (1 - threat * 0.7); // don't spread the last line under threat
   326	    x += clamp(rx * spread, -7, 7);
   327	    y += clamp(ry * spread, -7, 7);
   328	    // no useless burying in our own box when the ball isn't threatening it
   329	    if (team.localX(ball.pos.x) > -20 && x < -HALF_L + BOX_DEPTH) x = -HALF_L + BOX_DEPTH + 2;
   330	    // SOLIDITY under threat: the back/mid block collapses goal-ward + central
   331	    // as the ball bears down, so the last line stays compact and denies the
   332	    // clean chance (the ST stays high as the outlet).
   333	    if (!hasBall && p.role !== 'ST' && threat > 0) {
   334	      const kk = threat * (0.3 + g.defensiveCompactness * 0.5);
   335	      x += (-HALF_L + 11 - x) * kk * 0.45;
   336	      y += (0 - y) * kk * 0.3;
   337	    }
   338	  }
   339	
   340	  if (p.role === 'GK') {
   341	    x = clamp(-HALF_L + 4 + (g.keeperAggression - 0.5) * 4, -HALF_L + 1, -HALF_L + 11);
   342	    y = clamp(ball.pos.y * 0.25, -GOAL_WIDTH / 2, GOAL_WIDTH / 2);
   343	    return v2(x * team.attackDir, y);
   344	  }
   345	  x = clamp(x, -HALF_L + 3, HALF_L - 7);
   346	  y = clamp(y, -HALF_W + 2, HALF_W - 2);
   347	  return v2(x * team.attackDir, y);
   348	}
   349	
   350	/**
   351	 * Free-kick wall slots (Phase 32): shoulder-to-shoulder on the ball–goal
   352	 * line at the law clearance (9.15m), 0.7m apart, centered. Shared by the
   353	 * executor (routing), the referee's wall-wait gate and the flight solver —
   354	 * one geometry, so nothing fights and nobody strikes past a half-built
   355	 * wall standing in the climb's header band.
   356	 */
   357	export function fkWallSlots(from: V2, goal: V2, n: number): V2[] {
   358	  const dx = goal.x - from.x;
   359	  const dy = goal.y - from.y;
   360	  const dl = Math.max(Math.sqrt(dx * dx + dy * dy), 1e-6);
   361	  const ux = dx / dl;
   362	  const uy = dy / dl;
   363	  const cx = from.x + ux * (CORNER_CLEARANCE + 0.15);
   364	  const cy = from.y + uy * (CORNER_CLEARANCE + 0.15);
   365	  const out: V2[] = [];
   366	  for (let i = 0; i < n; i++) {
   367	    // 1.1m spacing: anything under PLAYER_MIN_DIST (1.05) gets shoved
   368	    // apart by resolveOverlaps every frame — the wall equilibrated 1.4m
   369	    // OFF its slots, standing exactly in the climb's header band.
   370	    const off = (i - (n - 1) / 2) * 1.1;
   371	    out.push(v2(cx - uy * off, cy + ux * off));
   372	  }
   373	  return out;
   374	}
   375	
   376	/**
   377	 * Corner routine geometry (Phase 31), in world coordinates for the taking
   378	 * team. `attackDir` is the taker's attacking direction, `cornerY` the sign
   379	 * of the corner flag's y. The KEY zone is what the routine's openness is
   380	 * judged on; the CRASH spots are where the three licensed box-crashers
   381	 * attack (primary / secondary / rebound), ordered by aerial rank.
   382	 */
   383	export function cornerKeyZone(routine: CornerRoutine, attackDir: 1 | -1, cornerY: number): V2 {
   384	  const gx = attackDir * HALF_L;
   385	  const s = cornerY >= 0 ? 1 : -1;
   386	  switch (routine) {
   387	    case 'nearPost':
   388	      return v2(gx - attackDir * 4.5, s * 2.8);
   389	    case 'farPost':
   390	      return v2(gx - attackDir * 5.5, -s * 3.2);
   391	    case 'short':
   392	      return v2(gx - attackDir * 9, s * (HALF_W - 6));
   393	    case 'arcCutback':
   394	      return v2(gx - attackDir * 16, s * 3);
   395	  }
   396	}
   397	
   398	export function cornerCrashSpots(
   399	  routine: CornerRoutine | undefined, attackDir: 1 | -1, cornerY: number,
   400	): [V2, V2, V2] {
   401	  const gx = attackDir * HALF_L;
   402	  const s = cornerY >= 0 ? 1 : -1;
   403	  const b = (dx: number, y: number): V2 => v2(gx - attackDir * dx, y);
   404	  switch (routine) {
   405	    case 'nearPost':
   406	      // Overload the front zone: the flick wins the race, the others eat
   407	      // the flick-on and the spill.
   408	      return [b(4.5, s * 2.8), b(7, -s * 1), b(11, s * 0.5)];
   409	    case 'farPost':
   410	      // The back-post crash: primary attacks the far stick with a run.
   411	      return [b(5.5, -s * 3.2), b(6, s * 1.5), b(11, 0)];
   412	    case 'arcCutback':
   413	      // Crashers pin the box DEEP so the arc stays empty for the arriver.
   414	      return [b(4.5, s * 2.5), b(5.5, -s * 2.5), b(7.5, 0)];
   415	    case 'short':
   416	    default:
   417	      // Default milling (and the short routine's box picture): posts + spot.
   418	      return [b(5, s * 2.5), b(6, -s * 2.5), b(11, 0)];
   419	  }
   420	}
   421	
   422	/**
   423	 * Is the team settled into its ATTACKING shape? (Phase 30 step 3 — the
   424	 * keeper waits for this before releasing a goal kick or a held ball, so
   425	 * distributions find SET receivers instead of gifting scrambles.) At least
   426	 * three outfielders within `radius` of their attacking spots — or every
   427	 * outfielder the team still has, when send-offs leave fewer than three.
   428	 * Pure sim-state (invariant 3): positions vs spot tables, no clocks.
   429	 */
   430	export function shapeReady(team: Team, ball: Ball, radius = 6): boolean {
   431	  let settled = 0;
   432	  let outfield = 0;
   433	  for (const p of team.players) {
   434	    if (p.role === 'GK' || p.sentOff) continue;
   435	    outfield++;
   436	    const spot = formationSpot(p, team, ball, true);
   437	    const dx = p.pos.x - spot.x;
   438	    const dy = p.pos.y - spot.y;
   439	    if (dx * dx + dy * dy < radius * radius) settled++;
   440	  }
   441	  return settled >= Math.min(3, outfield);
   442	}
   443	
   444	/**
   445	 * The opponents' last defensive line, in `team`-local x (bigger = deeper
   446	 * toward their goal). GK excluded — beating the keeper is the striker's job.
   447	 */
   448	export function defenderLineLocalX(team: Team, opponents: Player[]): number {
   449	  let line = -HALF_L;
   450	  for (const o of opponents) {
   451	    if (o.role === 'GK' || o.sentOff) continue;
   452	    const lx = team.localX(o.pos.x);
   453	    if (lx > line) line = lx;
   454	  }
   455	  return line;
   456	}
   457	
   458	/**
   459	 * The OFFSIDE line in `team`-local x (Phase 29): the second-last opponent
   460	 * COUNTING the keeper (the real law — usually the last outfield defender,
   461	 * because the keeper is the last man), or the ball itself if it's deeper,
   462	 * floored at halfway (you cannot be offside in your own half). An attacker
   463	 * ahead of this line when a teammate strikes the ball is in an offside
   464	 * position; level is onside (callers add their own epsilon).
   465	 */
   466	export function offsideLineLocalX(team: Team, opponents: Player[], ballLocalX: number): number {
   467	  let last = -HALF_L;
   468	  let secondLast = -HALF_L;
   469	  for (const o of opponents) {
   470	    if (o.sentOff) continue;
   471	    const lx = team.localX(o.pos.x);
   472	    if (lx > last) {
   473	      secondLast = last;
   474	      last = lx;
   475	    } else if (lx > secondLast) {
   476	      secondLast = lx;
   477	    }
   478	  }
   479	  return Math.max(secondLast, ballLocalX, 0);
   480	}
   481	
   482	/**
   483	 * Where an assigned runner sprints: past the last defender's shoulder,
   484	 * angling into the channel toward goal. Clamped short of the keeper's box so
   485	 * runs stretch the defence without parking on the goal line. The target aims
   486	 * BEYOND the line on purpose — while a teammate still carries the ball the
   487	 * executor holds the run at the offside line (Phase 29), and the instant the
   488	 * kick is struck the clamp releases and this target is the burst in behind.
   489	 */
   490	export function runTarget(p: Player, team: Team, opponents: Player[]): V2 {
   491	  const line = defenderLineLocalX(team, opponents);
   492	  const myX = team.localX(p.pos.x);
   493	  const targetLocalX = clamp(Math.max(line + 7, myX + 5), myX + 3, HALF_L - 9);
   494	  // Narrow toward the goal mouth as the run goes deeper, keeping the lane.
   495	  // The poacher (Phase 39) attacks the POST CHANNEL (|y|≈3.5, his wing's
   496	  // post) — the tap-in zone. NOT the center: a first cut narrowed him to
   497	  // ×0.35 and his runs ended on the keeper's chest (fm 21, the goal-pull
   498	  // lesson — conversion went DOWN and the finishing invariant test flagged
   499	  // it).
   500	  const y = p.traits.includes('poacher')
   501	    ? Math.sign(p.pos.y || 1) * 3.5
   502	    : clamp(p.pos.y * 0.6, -HALF_W + 4, HALF_W - 4);
   503	  return v2(targetLocalX * team.attackDir, y);
   504	}
   505	
   506	/**
   507	 * Where a through ball should MEET a runner (Phase 29). A runner already in
   508	 * stride is led by their velocity, like any pass. But a runner HELD at the
   509	 * offside line hovers with near-zero velocity — leading by velocity would
   510	 * put the ball at their feet ON the line, exactly the ball the line exists
   511	 * to kill. The pass anticipates the break instead: it projects the burst
   512	 * along the run target at the runner's top speed, and the runner breaks the
   513	 * instant the kick releases the onside hold. Judgment stays honest — the
   514	 * flag is judged on where the runner STANDS at the kick, not the aim point.
   515	 */
   516	export function runBurstPoint(p: Player, team: Team, opponents: Player[], flight: number): V2 {
   517	  const speed = Math.hypot(p.vel.x, p.vel.y);
   518	  if (speed > 3) {
   519	    return v2(p.pos.x + p.vel.x * flight * 1.6, p.pos.y + p.vel.y * flight * 1.6);
   520	  }
   521	  const rt = runTarget(p, team, opponents);
   522	  const dx = rt.x - p.pos.x;
   523	  const dy = rt.y - p.pos.y;
   524	  const d = Math.hypot(dx, dy) || 1;
   525	  const burst = Math.min(d, p.topSpeed * flight * 1.1);
   526	  return v2(p.pos.x + (dx / d) * burst, p.pos.y + (dy / d) * burst);
   527	}
   528	
   529	/**
   530	 * Where an off-ball player supports the carrier: ahead of the ball for
   531	 * attacking modes, pulled laterally TOWARD the supporter's own formation
   532	 * lane, at a radius set by the supportDistance gene.
   533	 *
   534	 * Lane-pulled but radius-bounded (Phase 30.5): the old sign()-based nudge
   535	 * kept every supporter within ~5m of the ball's y, so all three off-ball
   536	 * attackers formed one narrow column ahead of the carrier — dragging their
   537	 * markers into the same corridor, walling off every forward lane
   538	 * (interceptions ran 33/match) and pulling wingers off the flank. Pulling
   539	 * y toward the lane spreads support into a fan: near-central options stay
   540	 * short, the ball-side winger becomes a REAL wide outlet. The lateral pull
   541	 * is capped at ~0.9× the support radius on purpose — a first cut anchored
   542	 * y fully to the lane, which parked "support" 30m from the carrier: no
   543	 * short options left, neutral-genome attacks starved (mirror goals 1.47 →
   544	 * 0.93), and the 5v6 sanity invariant inverted (probe-shorthand).
   545	 */
   546	export function supportSpot(p: Player, team: Team, ball: Ball): V2 {
   547	  const g = team.genome;
   548	  // 10..18m: close enough for a give-and-go, far enough that the carrier
   549	  // isn't mobbed by their own teammates (Phase 19 spacing pass, widened in
   550	  // Phase 27.1 — the crowd complaint was real).
   551	  const radius = 10 + g.supportDistance * 8;
   552	  const aheadBias = team.mode === 'CounterAttack' || team.mode === 'Attack' ? 0.75 : 0.35;
   553	
   554	  const lane = formationSpot(p, team, ball, true);
   555	  const maxLat = radius * 0.9;
   556	  const latPull = clamp((lane.y - ball.pos.y) * 0.75, -maxLat, maxLat);
   557	  return v2(
   558	    clamp(ball.pos.x + team.attackDir * radius * aheadBias, -HALF_L + 2, HALF_L - 2),
   559	    clamp(ball.pos.y + latPull, -HALF_W + 2, HALF_W - 2),
   560	  );
   561	}

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/ai/formations.ts | sed -n '90,240p'; nl -ba src/sim/Player.ts | sed -n '230,370p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
    90	  for (const table of [ATTACK_FORMATIONS, DEFEND_FORMATIONS] as Record<string, V2[]>[]) {
    91	    for (const key of Object.keys(table)) {
    92	      table[key] = table[key].map((p) => v2(p.x * PITCH_SCALE, p.y * PITCH_SCALE));
    93	    }
    94	  }
    95	}
    96	
    97	// EMERGENT POSITIONING FIELD (Phase B → DEFAULT 2026-07-20, the coordinated
    98	// density相变). Positions grow from role + genes + live state, not a fixed
    99	// formation menu — VISION §1's #1 violation retired. It is REQUIRED on the
   100	// shrunk pitch (PITCH_SCALE<1): emergent stations are fractional and auto-fit,
   101	// the fixed tables use absolute coords and would fall off a smaller pitch.
   102	// The UI toggle (settings → experimental) can still turn it OFF for A/B, and
   103	// probes can force-OFF with EMERGENT_POS=0.
   104	let _emergentPos: boolean | null = null; // null = use the default (ON)
   105	export function setEmergentPos(on: boolean): void {
   106	  _emergentPos = on;
   107	}
   108	export function emergentPosOn(): boolean {
   109	  if (_emergentPos !== null) return _emergentPos; // explicit UI / probe override
   110	  // typeof guard: `process` is undefined in the browser bundle — never throw.
   111	  if (typeof process !== 'undefined' && process.env && process.env.EMERGENT_POS === '0') return false;
   112	  return true; // DEFAULT ON
   113	}
   114	
   115	/** How far up/down the pitch each tactical mode pushes the block. */
   116	const MODE_SHIFT: Record<TeamMode, number> = {
   117	  Attack: 10,
   118	  BuildUp: 4,
   119	  CounterAttack: 8,
   120	  Press: 6,
   121	  Defend: -8,
   122	  ResetShape: 0,
   123	};
   124	
   125	/**
   126	 * World-space formation target for a player. `hasBall` decides whether width
   127	 * (attackingWidth) or compactness (defensiveCompactness) shapes the block.
   128	 */
   129	export function formationSpot(p: Player, team: Team, ball: Ball, hasBall: boolean, opp?: Team): V2 {
   130	  // EMERGENT POSITIONING FIELD (Phase B1, toggle — the user's #1 emergence
   131	  // ask: shape must grow from role + genes + live state, not a hand-authored
   132	  // MENU). Behind a flag so it A/Bs cleanly against the fixed tables
   133	  // (positioning-shape.ts) before it can replace them. OFF = today's behavior.
   134	  if (emergentPosOn()) return emergentStation(p, team, ball, hasBall, opp);
   135	  const g = team.genome;
   136	  const base = hasBall
   137	    ? ATTACK_FORMATIONS[team.style.formationAtk][p.index]
   138	    : DEFEND_FORMATIONS[team.style.formationDef][p.index];
   139	
   140	  // Block slides toward the ball along x (local coords), capped at ±10m.
   141	  const ballLocalX = team.localX(ball.pos.x);
   142	  const slide = clamp(ballLocalX * 0.3, -10, 10);
   143	
   144	  // formationDepth: 0 = sit 6m deeper, 1 = push 6m higher.
   145	  const depth = (g.formationDepth - 0.5) * 12;
   146	
   147	  // PRESSING BUYS ITS RISK (Phase 83, the goal-inflation fix): a pressing
   148	  // side's defensive block steps UP with its press gene — outfielders only,
   149	  // defending phase only. Before this, line height was formationDepth's
   150	  // alone, so evolution could chase-press from a deep couch: turnovers with
   151	  // ZERO space conceded behind — the free lunch that rode pressIntensity to
   152	  // 0.88 and the league to 6-7 goals (phase-82 anatomy). Now the line you
   153	  // press with is the line the through-ball/route-one/chip channels attack.
   154	  const pressUp = hasBall || p.role === 'GK' ? 0 : (g.pressIntensity - 0.5) * 8;
   155	
   156	  let x = base.x + slide + depth + pressUp + MODE_SHIFT[team.mode];
   157	
   158	  // Rest defence (Phase 31): the DF slot NEVER joins the siege. With the
   159	  // ball deep in the opponent half, slide (+10) + Attack shift (+10) used
   160	  // to push even the last outfielder past halfway — the attacking team had
   161	  // literally nobody covering, so every turnover was an uncontested
   162	  // breakaway. That hole is what let a 5v6 side out-score its own
   163	  // full-strength baseline once the open-run economy paid honestly
   164	  // (counters were ALL open runs). One cover man keeps counters real —
   165	  // beatable by pace or a dragged block, never free.
   166	  // −12, not −5: a cover man AT halfway is already beaten by the time a
   167	  // counter carrier enters the open-run zone (28m out) — he has to start
   168	  // goal-side of the race, near his base spot, to ever contest it.
   169	  if (p.index === 1 && p.role !== 'GK') {
   170	    if (hasBall) {
   171	      // Rest-defense depth is now the SWEEPER gene's possession face
   172	      // (Phase 88): 0.5 = the old hardcoded −12 exactly; the full libero
   173	      // (1) holds −16 even mid-siege, the bold stopper (0) dares −8.
   174	      x = Math.min(x, -8 - (g.coverBias ?? 0.5) * 8);
   175	    } else {
   176	      // THE SWEEPER (Phase 88, school #2 — catenaccio): the DF slot sits
   177	      // off his own line by the gene — behind it (libero: the man who
   178	      // meets whatever beats the first wave, at the price of playing
   179	      // everyone onside) or ahead of it (stopper: early interceptions,
   180	      // gambling the space behind). 0.5 = today's flat line.
   181	      x -= ((g.coverBias ?? 0.5) - 0.5) * 8;
   182	    }
   183	  }
   184	
   185	  // Width: stretch when we have the ball, squeeze when we don't. The
   186	  // in-possession floor is 1.0 (Phase 27.1) — an attacking shape should
   187	  // never be narrower than its base lanes.
   188	  let widthMul = hasBall
   189	    ? 1.0 + g.attackingWidth * 0.55 // 1.0 .. 1.55
   190	    : 1.15 - g.defensiveCompactness * 0.6; // 1.15 .. 0.55
   191	  // Zonal shape stays HONEST-WIDE (Phase 30.4): a zone defence covers
   192	  // width by definition — it may not also collapse into the central
   193	  // corridor, or its parked bodies dead-lane the entire pitch (measured:
   194	  // zonal sides conceded 3.6 shots/match vs man's 8 — the league's shot
   195	  // volume collapsed with half the clubs zonal).
   196	  if (!hasBall && team.style.scheme === 'zonal') widthMul = Math.max(widthMul, 0.95);
   197	  let y = base.y * widthMul;
   198	
   199	  // Compact teams also drag their block a little toward the ball's y.
   200	  if (!hasBall) y += (ball.pos.y - y * team.attackDir) * team.attackDir * g.defensiveCompactness * 0.25;
   201	
   202	  // Weak-side far-post pull (Phase 31): when the attack is deep AND wide,
   203	  // the far winger leaves the touchline and attacks the back post — the
   204	  // overload that punishes a ball-side defensive shift, and the second
   205	  // body a cutback or deep cross finds. The strong-side winger keeps the
   206	  // width; the pull releases as soon as the ball comes back central.
   207	  if (
   208	    hasBall && p.role === 'WG' && ballLocalX > HALF_L - 20 &&
   209	    Math.abs(ball.pos.y) > 12 && Math.sign(y) !== Math.sign(ball.pos.y)
   210	  ) {
   211	    y *= 0.3;
   212	  }
   213	
   214	  if (p.role === 'GK') {
   215	    // Keepers hold a narrow band in front of goal regardless of mode.
   216	    x = clamp(base.x + (g.keeperAggression - 0.5) * 4, -HALF_L + 1, -HALF_L + 11);
   217	    y = clamp(ball.pos.y * 0.25, -GOAL_WIDTH / 2, GOAL_WIDTH / 2);
   218	    return v2(x * team.attackDir, y);
   219	  }
   220	
   221	  x = clamp(x, -HALF_L + 3, HALF_L - 7);
   222	  y = clamp(y, -HALF_W + 2, HALF_W - 2);
   223	  return v2(x * team.attackDir, y);
   224	}
   225	
   226	/**
   227	 * EMERGENT POSITIONING FIELD (Phase B1-a). Replaces the fixed formation TABLE
   228	 * with a ROLE-anchored field: a role gives a coarse depth+lane TENDENCY (a
   229	 * dimension, like an attribute — not a hand-drawn shape), and the actual
   230	 * station grows from that + the live game state, weighted by GENES. So the
   231	 * team's SHAPE and "style" emerge from gene weights, not from us picking
   232	 * wide-212 vs low-32. B1-a lands the structural swap + a REAL, gene-weighted
   233	 * strong/weak-side shift (the B0 probe found the old ~2m drag was token). The
   234	 * anti-clump / space-value terms (kill the bus box-crowd, no clumping) are
   235	 * B1-b. Opponent-relative positioning is B2. Same sensible modifiers as the
   236	 * table path (slide/depth/press/rest-defence/width) so shape stays sane.
   237	 */
   238	function emergentStation(p: Player, team: Team, ball: Ball, hasBall: boolean, opp?: Team): V2 {
   239	  const g = team.genome;
   240	  // Role → coarse (depth fraction of HALF_L, lane fraction of HALF_W). WGs take
   230	    this.wallRun = null;
   231	  }
   232	
   233	  /** Effective top speed — tired players slow down but never stop. */
   234	  get topSpeed(): number {
   235	    return this.baseSpeed * (0.62 + 0.38 * this.stamina);
   236	  }
   237	
   238	  physicsStep(dt: number): void {
   239	    // In-place integration — this ran as clampLen/approachV/add/norm, which
   240	    // allocated ~6 vectors per player per step (860k per match). The exact
   241	    // same operations in the exact same IEEE order, written out flat:
   242	    // results are bit-identical (regression: same seed ⇒ same save JSON).
   243	    const dv = this.desiredVel;
   244	    const max = this.topSpeed;
   245	    const dl = Math.sqrt(dv.x * dv.x + dv.y * dv.y); // clampLen
   246	    let tx = dv.x;
   247	    let ty = dv.y;
   248	    if (dl > max && dl > 1e-8) {
   249	      const s = max / dl;
   250	      tx = dv.x * s;
   251	      ty = dv.y * s;
   252	    }
   253	    // Stunned (Phase 27): stumbling players can barely move until they recover.
   254	    if (this.stunTimer > 0) {
   255	      tx *= 0.15;
   256	      ty *= 0.15;
   257	    }
   258	    const maxDelta = this.accel * dt; // approachV
   259	    const ax = tx - this.vel.x;
   260	    const ay = ty - this.vel.y;
   261	    const al = Math.sqrt(ax * ax + ay * ay);
   262	    if (al <= maxDelta || al < 1e-8) {
   263	      this.vel.x = tx;
   264	      this.vel.y = ty;
   265	    } else {
   266	      const s = maxDelta / al;
   267	      this.vel.x = this.vel.x + ax * s;
   268	      this.vel.y = this.vel.y + ay * s;
   269	    }
   270	    this.pos.x = this.pos.x + this.vel.x * dt;
   271	    this.pos.y = this.pos.y + this.vel.y * dt;
   272	
   273	    const sp = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
   274	    // Rotate heading toward the face target (backpedal, 27.5) or, failing
   275	    // that, the movement direction — capped at TURN_RATE either way.
   276	    // No trig in the loop: the per-step rotation's cos/sin are cached per dt.
   277	    if (dt !== turnDt) {
   278	      turnDt = dt;
   279	      turnCos = Math.cos(TURN_RATE * dt);
   280	      turnSin = Math.sin(TURN_RATE * dt);
   281	    }
   282	    const ft = this.faceTarget;
   283	    let wx = 0;
   284	    let wy = 0;
   285	    let turn = false;
   286	    if (ft) {
   287	      const fx = ft.x - this.pos.x;
   288	      const fy = ft.y - this.pos.y;
   289	      const fl = Math.sqrt(fx * fx + fy * fy);
   290	      if (fl > 1e-6) {
   291	        wx = fx / fl;
   292	        wy = fy / fl;
   293	        turn = true;
   294	      }
   295	    } else if (sp > 0.5) {
   296	      wx = this.vel.x / sp;
   297	      wy = this.vel.y / sp;
   298	      turn = true;
   299	    }
   300	    if (turn) {
   301	      const hx = this.heading.x;
   302	      const hy = this.heading.y;
   303	      if (hx * wx + hy * wy >= turnCos) {
   304	        this.heading = { x: wx, y: wy };
   305	      } else {
   306	        const s = hx * wy - hy * wx >= 0 ? turnSin : -turnSin;
   307	        this.heading = { x: hx * turnCos - hy * s, y: hx * s + hy * turnCos };
   308	      }
   309	    }
   310	    this.distance += sp * dt;
   311	
   312	    // Stamina: quadratic drain above ~55% effort, slow recovery when jogging/idle.
   313	    // The engine trait (Phase 39) drains 10% slower — the motor runs all day.
   314	    const effort = sp / this.baseSpeed;
   315	    // The stamina ATTRIBUTE scales drain and recovery (Phase 47): neutral
   316	    // at the 0.4 backfill so the league's energy economy doesn't move —
   317	    // the motor is now a dimension evolution can spend on.
   318	    // Phase 58: drain/recovery repriced so the economy BINDS in-match
   319	    // (constants.ts has the story) — legs are a resource, not a gauge.
   320	    if (effort > 0.55) {
   321	      const drain =
   322	        STAMINA_DRAIN * effort * effort * dt * this.staminaDrainMul * (1.24 - this.attrs.stamina * 0.6);
   323	      this.stamina = Math.max(0.05, this.stamina - drain);
   324	      this.staminaSpent += drain;
   325	    } else {
   326	      this.stamina = Math.min(1, this.stamina + STAMINA_RECOVERY * dt * (0.88 + this.attrs.stamina * 0.3));
   327	    }
   328	
   329	    this.kickCooldown = Math.max(0, this.kickCooldown - dt);
   330	    this.tackleCooldown = Math.max(0, this.tackleCooldown - dt);
   331	    this.touchTimer = Math.max(0, this.touchTimer - dt);
   332	    this.stunTimer = Math.max(0, this.stunTimer - dt);
   333	    this.gkHoldTimer = Math.max(0, this.gkHoldTimer - dt);
   334	    this.tackleAnimTimer = Math.max(0, this.tackleAnimTimer - dt);
   335	    this.saveAnimTimer = Math.max(0, this.saveAnimTimer - dt);
   336	    this.headerAnimTimer = Math.max(0, this.headerAnimTimer - dt);
   337	    this.firstTouchWindow = Math.max(0, this.firstTouchWindow - dt);
   338	    this.decisionTimer -= dt;
   339	  }
   340	
   341	  /**
   342	   * An instantaneous burst the movement drain never saw — a tackle lunge
   343	   * (Phase 58). Same per-player modifiers as the running drain, so engines
   344	   * and high-stamina players absorb bursts better too.
   345	   */
   346	  spendBurst(cost: number): void {
   347	    const drain = cost * this.staminaDrainMul * (1.24 - this.attrs.stamina * 0.6);
   348	    this.stamina = Math.max(0.05, this.stamina - drain);
   349	    this.staminaSpent += drain;
   350	  }
   351	
   352	  resetForKickoff(pos: V2): void {
   353	    this.pos = pos;
   354	    this.vel = v2();
   355	    this.desiredVel = v2();
   356	    this.action = { type: 'MoveToFormationSpot', scores: [] };
   357	    this.kickCooldown = 0;
   358	    this.tackleCooldown = 0;
   359	    this.stunTimer = 0;
   360	    this.gkHoldTimer = 0;
   361	    this.gkDistributing = false;
   362	    this.gkShapeWait = 0;
   363	    this.tackleAnimTimer = 0;
   364	    this.saveAnimTimer = 0;
   365	    this.headerAnimTimer = 0;
   366	    this.firstTouchWindow = 0;
   367	    this.slalomUntil = -1;
   368	  }
   369	}

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/ai/PlayerBrain.ts | sed -n '1,300p'; nl -ba src/ai/PlayerBrain.ts | sed -n '301,600p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	import { clamp, clamp01 } from '../utils/math';
     2	import { dist, dot, norm, sub, v2 } from '../utils/vec';
     3	import { HALF_L, HALF_W } from '../sim/constants';
     4	import {
     5	  cornerKeyZone, defenderLineLocalX, offsideLineLocalX, runBurstPoint, shapeReady,
     6	} from './formations';
     7	import type { Match } from '../sim/Match';
     8	import type { Player } from '../sim/Player';
     9	import type { Team } from '../sim/Team';
    10	import type { UtilityScore } from '../sim/types';
    11	import { aerialSense, kickMisalignment } from '../sim/mechanics';
    12	import {
    13	  airLaneOpenness, canInterceptPass, effectiveBlockers, interceptBall, laneOpenness, opennessOf,
    14	  escapeCarry, pressureAt, spaceAhead, timeToPoint,
    15	} from './perception';
    16	
    17	/**
    18	 * PlayerBrain — utility AI. Each decision tick the player scores a set of
    19	 * candidate actions; the best one wins. Every score is a product/sum of
    20	 * normalized factors with the gene multipliers spelled out, and the top
    21	 * candidates are stored on the action for the debug panel.
    22	 *
    23	 * Kicks (Pass/Shoot/Clear) execute immediately at decision time; movement
    24	 * actions are executed continuously by actionExecutor until the next tick.
    25	 */
    26	export function decidePlayer(p: Player, match: Match): void {
    27	  const team = match.teams[p.side];
    28	  const opp = match.teams[1 - p.side];
    29	
    30	  // Dead-ball restart: the taker walks to the spot (chasing the stationary
    31	  // ball); everyone else runs their normal logic against the dead ball —
    32	  // defenders reshape and mark, attackers hold width around the spot.
    33	  if (match.phase === 'restart' && match.restart) {
    34	    if (p.gid === match.restart.takerGid) {
    35	      p.action = { type: 'ChaseBall', scores: [{ action: 'ChaseBall', score: 1, why: 'taking the restart' }] };
    36	      return;
    37	    }
    38	  } else if (match.phase !== 'playing') {
    39	    p.action = { type: 'MoveToFormationSpot', scores: [] };
    40	    return;
    41	  }
    42	
    43	  if (match.ball.owner === p) {
    44	    decideCarrier(p, team, opp, match);
    45	    return;
    46	  }
    47	  // The carry continues (Phase 36): between discrete touches the ball is
    48	  // free but it is HIS — he chases his own push instead of falling into
    49	  // off-ball logic (which would send him to a spot while the ball rolls).
    50	  if (
    51	    match.ball.owner === null &&
    52	    match.dribbleTouch !== null &&
    53	    match.dribbleTouch.gid === p.gid &&
    54	    match.simTime < match.dribbleTouch.until
    55	  ) {
    56	    p.action = { type: 'ChaseBall', scores: [{ action: 'ChaseBall', score: 1, why: 'chasing my own touch' }] };
    57	    return;
    58	  }
    59	  if (p.role === 'GK') {
    60	    decideGoalkeeper(p, team, match);
    61	    return;
    62	  }
    63	  decideOffBall(p, team, opp, match);
    64	}
    65	
    66	/* ------------------------------------------------------------------ */
    67	/* Ball carrier                                                        */
    68	/* ------------------------------------------------------------------ */
    69	
    70	function decideCarrier(p: Player, team: Team, opp: Team, match: Match): void {
    71	  const g = team.genome;
    72	  const W = team.policies[p.index]; // utility weights — DEFAULT_POLICY unless a wildcard carries learned ones
    73	  const ball = match.ball;
    74	  // Restart first touch must be a kick (kick-in/corner/goal kick/free kick)
    75	  // — dribbling straight off the spot would break the dead-ball fiction.
    76	  const mustKick = match.restartKickGid === p.gid;
    77	  const kickKind = mustKick ? match.restartKickKind : null;
    78	  const kickRoutine = mustKick ? match.restartKickRoutine : null;
    79	  if (mustKick) {
    80	    match.restartKickGid = null;
    81	    match.restartKickKind = null;
    82	    match.restartKickRoutine = null;
    83	    // Goal-channel telemetry (Phase 113): stamp the SET-PIECE first touch —
    84	    // a goal within the window banks as `setpiece`. Kick-ins and goal kicks
    85	    // are restarts but not set pieces.
    86	    if (kickKind === 'corner' || kickKind === 'freeKick' || kickKind === 'penalty') {
    87	      match.lastRestartKick = { kind: kickKind, side: p.side, t: match.simTime };
    88	    }
    89	  }
    90	  // A penalty's first touch IS the shot — no utility scoring from the spot.
    91	  if (kickKind === 'penalty') {
    92	    p.action = { type: 'Shoot', scores: [{ action: 'Shoot', score: 1, why: 'penalty kick' }] };
    93	    match.performShot(p);
    94	    return;
    95	  }
    96	  // Keeper hold (Phase 27.2): ball in the hands — no distribution decision
    97	  // until the hold runs out.
    98	  if (p.gkHoldTimer > 0) {
    99	    p.action = { type: 'HoldPosition', scores: [{ action: 'HoldPosition', score: 1, why: 'ball in hands' }] };
   100	    return;
   101	  }
   102	  // The keeper WAITS for shape (Phase 30.3): a held ball is released to SET
   103	  // receivers. Until the outfielders settle near their attacking spots, the
   104	  // hold re-arms in small quanta — every hands protection (untackleable,
   105	  // clearance bubble, nobody presses) keys off gkHoldTimer and keeps
   106	  // applying. Budget-capped so a scattered team can't stall the match.
   107	  if (p.role === 'GK' && p.gkDistributing && p.gkShapeWait < 4 && !shapeReady(team, match.ball)) {
   108	    p.gkHoldTimer = 0.25;
   109	    p.gkShapeWait += 0.25;
   110	    p.action = { type: 'HoldPosition', scores: [{ action: 'HoldPosition', score: 1, why: 'waiting for shape' }] };
   111	    return;
   112	  }
   113	  // Kickoff first touch (Phase 27.3): played BACKWARD to a teammate — no
   114	  // driving forward off the spot, no long ball over the top. Everyone else
   115	  // starts behind the ball at kickoff, so the fallback is nearly unreachable.
   116	  if (match.kickoffKickGid === p.gid) {
   117	    match.kickoffKickGid = null;
   118	    let back: Player | null = null;
   119	    let backScore = -Infinity;
   120	    for (const mate of team.players) {
   121	      if (mate === p || mate.sentOff) continue;
   122	      if (team.localX(mate.pos.x) > -0.5) continue; // must be behind the ball
   123	      const d = dist(p.pos, mate.pos);
   124	      // Open, and comfortably ~12m back — not the keeper 40m away.
   125	      const s = opennessOf(mate, opp.players) - Math.abs(d - 12) * 0.02 - (mate.role === 'GK' ? 0.3 : 0);
   126	      if (s > backScore) {
   127	        backScore = s;
   128	        back = mate;
   129	      }
   130	    }
   131	    if (back) {
   132	      const hx = back.pos.x - p.pos.x;
   133	      const hy = back.pos.y - p.pos.y;
   134	      const hl = Math.sqrt(hx * hx + hy * hy);
   135	      if (hl > 1e-6) p.heading = { x: hx / hl, y: hy / hl };
   136	      p.action = {
   137	        type: 'Pass',
   138	        targetIdx: back.gid,
   139	        scores: [{ action: 'Pass', score: 1, why: 'kickoff — played back' }],
   140	      };
   141	      match.performPass(p, back);
   142	      return;
   143	    }
   144	  }
   145	  const cands: UtilityScore[] = [];
   146	  const pressure = pressureAt(p.pos, opp.players);
   147	  const goal = team.oppGoal();
   148	  const dGoal = dist(p.pos, goal);
   149	  const localX = team.localX(p.pos.x);
   150	  // Offside awareness (Phase 29): real-law dead-ball exemptions, and the
   151	  // line every delivery below checks its target against. Players avoid
   152	  // teammates stood CLEARLY offside (beyond the 1.2m margin) but back their
   153	  // judgment on tight ones — the referee judges at +0.2m, so the marginal
   154	  // band is exactly where real flags come from (a runner who broke on the
   155	  // previous kick and hasn't checked back level yet).
   156	  // DELIBERATE law deviation (Phase 71, user call "门将开大脚应该有越位"):
   157	  // real goal kicks are offside-exempt, but at this match scale the
   158	  // exemption read as a legal cherry-pick — a striker camped at the
   159	  // opponent's goal, fed by the timeout punt (probed: 19% of goal kicks
   160	  // had a man within 12m of goal). Goal kicks now play under normal
   161	  // offside, same family as the offside→goal-kick restart simplification.
   162	  // Kick-ins keep the real throw-in exemption; corners are geometrically
   163	  // exempt anyway (you cannot be offside level with the goal line ball).
   164	  const offsideExemptKick = kickKind === 'kickIn' || kickKind === 'corner';
   165	  const offLine = offsideLineLocalX(team, opp.players, localX) + 2.2;
   166	  // Territory pressure (Phase 27): 0 while the move is fresh or gaining
   167	  // ground, 1 after ~8s of possession going nowhere. It tilts every carrier
   168	  // choice toward the opponent goal — sideways recycling stops being free.
   169	  const stagnation = clamp01((team.staleTime - 3) / 5);
   170	
   171	  // An OPEN RUN (Phase 31, user report "单刀回传"): nobody goal-side within
   172	  // striking territory. Shared state for the whole carrier economy — the
   173	  // finish boost inside 17m (28.4), the drive boost outside it, and the
   174	  // back-pass suppression all key off it. Computed once.
   175	  let openRun = false;
   176	  if (dGoal < 28) {
   177	    openRun = true;
   178	    for (const o of opp.players) {
   179	      if (o.role === 'GK' || o.sentOff) continue;
   180	      if (dist(o.pos, goal) < dGoal - 1) {
   181	        openRun = false;
   182	        break;
   183	      }
   184	    }
   185	  }
   186	
   187	  // --- Shoot: worth it when the chance quality (xG) is decent; shootBias
   188	  // scales it from "only tap-ins" (0) to "shoot on sight" (1).
   189	  if (dGoal < 30 && p.kickCooldown <= 0) {
   190	    const q = match.shotQuality(p);
   191	    // NOTE: finishing deliberately does NOT raise shot utility — it pays off
   192	    // in execution (tighter spread in mechanics.performShot), not in shot
   193	    // selection. Coupling it to utility made finishers take worse shots and
   194	    // turned the attribute into a net negative.
   195	    let s = q * (W.shootBase + g.shootBias * W.shootGene);
   196	    if (team.mode === 'Attack' || team.mode === 'CounterAttack') s *= W.shootModeMul;
   197	    s *= 1 - pressure * W.shootPressurePen;
   198	    // Facing away from goal (Phase 27): turn first instead of snap-shooting
   199	    // blind. Restart takers are exempt — they set themselves before kicking.
   200	    if (!mustKick) s *= 1 - kickMisalignment(p, norm(sub(goal, p.pos))) * 0.3;
   201	    // 1v1 (Phase 28.4): nobody between you and the keeper — FINISH. The
   202	    // old economy kept Dribble marginally ahead, so breakaways were walked
   203	    // all the way onto the keeper's toes instead of being struck from 10m.
   204	    const breakaway = openRun && dGoal < 17;
   205	    if (breakaway) s *= 1.6;
   206	    // Long-range appetite (Phase 28): when the sight is clear, have a dig
   207	    // from 16–30m instead of recycling forever — a stale move digs sooner.
   208	    let dig = 0;
   209	    if (dGoal > 16) {
   210	      // Pressure gate eased 0.7 → 0.5 (29.1): a containing jockey 2.6m off
   211	      // shouldn't extinguish the dig — shooting over the delay IS the
   212	      // counter to being contained (and the user wants the 20m strike).
   213	      dig =
   214	        W.longShotW *
   215	        (0.3 + g.shootBias * 0.7) *
   216	        (1 - pressure * 0.5) *
   217	        (0.55 + stagnation * 0.45) *
   218	        clamp01((30 - dGoal) / 14);
   219	      s += dig;
   220	    }
   221	    // Lane-aware selection (Phase 31): shotQuality's distance·angle·pressure
   222	    // cannot see the parked bodies on the path — carriers shot into walls,
   223	    // and since 30.4 those flew harmlessly (not even a deflection). Each
   224	    // corridor body discounts the whole appetite (dig included — the 20m
   225	    // dig into a wall is exactly the doomed shot); the carrier works for an
   226	    // angle instead, and tryShotBlock makes daring it anyway a real cost.
   227	    // shootBias loosens the discount — daring traffic IS what the gene
   228	    // means (a flat 0.62 inverted it: the shoot-happy team lost its whole
   229	    // expression channel and out-shot NOBODY).
   230	    // Phase 60 (the UNSET WALL): the appetite sees READINESS-weighted
   231	    // bodies — a mid-collapse retreater discounts far less than a set,
   232	    // facing wall, so the first-time arc strike gets dared while the
   233	    // block is still arriving. Math.pow takes the fractional count fine.
   234	    const blockers = breakaway ? 0 : effectiveBlockers(p.pos, goal, opp.players);
   235	    if (blockers > 0) s *= Math.pow(0.55 + g.shootBias * 0.15, blockers);
   236	    cands.push({
   237	      action: 'Shoot',
   238	      score: s,
   239	      why: `xG ${q.toFixed(2)} · shootBias ${g.shootBias.toFixed(2)}${breakaway ? ' · 1v1 — finish it' : ''}${dig > 0.03 ? ` · long-range dig ${dig.toFixed(2)}` : ''}${blockers > 0 ? ` · ${blockers.toFixed(1)} ready in the lane` : ''}`,
   240	    });
   241	  }
   242	
   243	  // --- Direct free kick (Phase 32): the danger-band placed ball is the
   244	  // specialist's REAL strike — performFreeKick curls it over the wall, so
   245	  // lane blockers don't apply and the ordinary shot economics (pressure,
   246	  // misalignment) don't either. Competes with crossing/passing the FK.
   247	  if (kickKind === 'freeKick' && localX > 0 && dGoal > 9 && dGoal < 28) {
   248	    // Steep in range: the wall pulls two defenders out of the marking
   249	    // scheme, so an FK always HAS an open mate — and real takers still
   250	    // shoot from 17-22m. The pass only outscores from the band's edge.
   251	    const sFK =
   252	      (0.55 + (28 - dGoal) * 0.02) *
   253	      (0.7 + (p.attrs.finishing + p.attrs.dribbling * 0.5) * 0.45) *
   254	      (0.85 + g.shootBias * 0.3);
   255	    cands.push({ action: 'Shoot', score: sFK, why: `direct free kick · ${dGoal.toFixed(0)}m out` });
   256	  }
   257	
   258	  // --- Pass: score every teammate, keep the best. Long targets also get a
   259	  // LOFTED variant (Phase 28): the switch flies over the press, so it skips
   260	  // the ground lane and the 32m suppression — its risks are the charge-down
   261	  // at the kicker's feet and the scatter/first touch at the far end.
   262	  let bestMate: Player | null = null;
   263	  let bestPass = 0;
   264	  let bestLane = 0;
   265	  let bestOpen = 0;
   266	  let bestLoftMate: Player | null = null;
   267	  let bestLoft = 0;
   268	  let bestLoftOpen = 0;
   269	  // One aerial-lane read per decision — the pass loop and the through-ball
   270	  // loop used to each run the same scan with the same arguments.
   271	  const airLane = p.kickCooldown <= 0 ? airLaneOpenness(p.pos, opp.players) : 0;
   272	  if (p.kickCooldown <= 0) {
   273	    const lp = match.lastCompletedPass;
   274	    const layingOff = p.action.type === 'HoldUp'; // pivot lay-off (Phase 28)
   275	    for (const mate of team.players) {
   276	      if (mate === p || mate.sentOff) continue;
   277	      // The playmaker (Phase 39) reads passing lanes 15% more open than
   278	      // they look — the trait is vision, priced into lane weight only.
   279	      const lane = Math.min(
   280	        1,
   281	        laneOpenness(p.pos, mate.pos, opp.players) * (p.traits.includes('playmaker') ? 1.15 : 1),
   282	      );
   283	      const open = opennessOf(mate, opp.players);
   284	      const d = dist(p.pos, mate.pos);
   285	      // Forward progress of the pass, normalized to ±1 over 30m.
   286	      const gain = clamp01((team.localX(mate.pos.x) - localX + 30) / 60) * 2 - 1;
   287	
   288	      // Shared style/tilt multipliers (identical for ground and lofted).
   289	      let mul = 1;
   290	      if (gain > 0.05) mul *= 1 + gain * stagnation * 0.35;
   291	      else mul *= 1 - stagnation * 0.3;
   292	      if (team.mode === 'CounterAttack' && gain > 0) mul *= 1.3;
   293	      if (team.mode === 'BuildUp' && gain < 0) mul *= 1.1; // patient recycling is fine
   294	      mul *= 0.7 + g.passBias * 0.75;
   295	      mul *= 0.85 + g.tempo * 0.3;
   296	      if (mate.role === 'GK') {
   297	        // The keeper as a build-up OUTLET (Phase 32.2, 出球门将): a
   298	        // traditional side treats the back-pass as a last resort; a
   299	        // ball-playing side (passBias + riskTolerance) uses him to escape
   300	        // the press — the modern relief valve, priced by the same genes
   301	        // that make the keeper himself play instead of hoof.
   302	        const ballPlay = (g.passBias + g.riskTolerance) / 2;
   303	        mul *= (0.25 + ballPlay * 0.55) * (0.7 + pressure * 1.1);
   304	      }
   305	      // Turning back on an OPEN RUN is the last resort (Phase 31 — the
   306	      // reported "单刀回传"): with nobody goal-side, the chaser at your back
   307	      // reads as pressure and the outlet multiplier used to make the
   308	      // trailing back-pass BEAT driving on. Squaring it forward is fine.
   309	      if (openRun && gain < 0) mul *= 0.35;
   310	      // A mate stood offside is a dead target (Phase 29) — near-suppressed,
   311	      // not zero: the rare desperate ball into them is where flags come from.
   312	      if (!offsideExemptKick && team.localX(mate.pos.x) > offLine + 0.2) mul *= 0.08;
   313	      // Playing the ball where the body doesn't face costs accuracy (Phase 27)
   314	      // — prefer passes we're facing; technique loosens the constraint. Kept
   315	      // mild: the time-gated stagnation tilt is the forward driver, this is
   316	      // only the body-mechanics tiebreak. Restart takers are exempt.
   317	      if (!mustKick) mul *= 1 - kickMisalignment(p, norm(sub(mate.pos, p.pos))) * 0.12 * (1 - p.attrs.passing * 0.5);
   318	      // A pivot lays off short after holding up (Phase 28).
   319	      if (layingOff && d < 12) mul *= 1.3;
   320	
   321	      let s = W.passBase + lane * W.passLaneW + open * W.passOpenW;
   322	      if (gain > 0) s *= 1 + gain * (W.passFwdBase + g.riskTolerance * W.passFwdRisk);
   323	      else s *= 1 + gain * W.passBackPen; // mild penalty for going backward
   324	      // Contested forward balls are gated by riskTolerance — but patience
   325	      // runs out: a stale move plays the risky forward ball anyway.
   326	      // (30.5 tried gating blocked SIDEWAYS balls too — it starved the
   327	      // feed out to the held-width winger and neutral-genome populations
   328	      // stopped scoring; the fan's wide outlet needs that half-blocked ball.)
   329	      if (gain > 0.15 && lane < 0.4) {
   330	        const gate = 0.35 + g.riskTolerance * 0.65;
   331	        s *= gate + (1 - gate) * stagnation * 0.4;
   332	      }
   333	      s *= mul;
   334	      if (d > 32) s *= 0.5;
   335	      if (d < 5) s *= 0.75;
   336	      // 2过1 return (Phase 34): the original passer is BURSTING — the return
   337	      // into his stride is the whole point of the wall pass, so it flips the
   338	      // "don't hand it straight back" rule below into a bonus (forward only).
   339	      const wallReturn =
   340	        mate.wallRun !== null &&
   341	        match.simTime < mate.wallRun.until &&
   342	        mate.wallRun.partnerGid === p.gid &&
   343	        gain > 0.2; // the runner must genuinely be IN BEHIND, not alongside
   344	      if (wallReturn) {
   345	        s *= 1.15 + (g.tempo + g.passBias) * 0.25;
   346	      } else if (lp && lp.passerGid === mate.gid && lp.receiverGid === p.gid && match.simTime - lp.t < 2.5 && gain < 0.1) {
   347	        // Don't just hand it straight back to the passer unless it progresses.
   348	        s *= 0.55;
   349	      }
   350	      // Third man (Phase 34): freshly received with a runner ahead — the
   351	      // quick bounce releases HIM, not the man who fed you (that's a 2过1).
   352	      if (
   353	        lp && lp.receiverGid === p.gid && match.simTime - lp.t < 1.5 &&
   354	        lp.passerGid !== mate.gid && mate.action.type === 'MakeRun' && gain > 0.15
   355	      ) {
   356	        s *= 1 + g.passBias * 0.3 * W.thirdManW;
   357	      }
   358	      // 套边 release (Phase 34): the ball down the line into the overlap —
   359	      // but only once the run has COME AROUND (wide, level or beyond).
   360	      // Bonusing the licensed man wherever he stood released the ball
   361	      // instantly to a runner still 3m BEHIND (probed: median reception
   362	      // |y| 9.6 — a central recycle wearing the overlap's name).
   363	      if (
   364	        team.overlapper === mate.index &&
   365	        Math.abs(mate.pos.y) > 9 &&
   366	        team.localX(mate.pos.x) > localX - 6
   367	      ) {
   368	        // A DEVELOPED overlap is the best ball on the pitch — priced like it
   369	        // (the run happens ~1.6s/match, probed; a timid bonus never cashed it).
   370	        s *= 1.3 + g.attackingWidth * 0.6;
   371	      }
   372	
   373	      if (s > bestPass) {
   374	        bestPass = s;
   375	        bestMate = mate;
   376	        bestLane = lane;
   377	        bestOpen = open;
   378	      }
   379	
   380	      // Lofted switch: only worth the hang time for genuinely long balls
   381	      // into space; long passing is a skill (technique gates execution AND
   382	      // selection — poor passers don't trust the diagonal). Keep it 24m+
   383	      // (30.5 tried 18m: the loft cannibalized healthy ground passes and
   384	      // through balls in the 18–24m band and goals sank with them).
   385	      if (d > 24 && !layingOff) {
   386	        let sL = (W.loftBase + open * W.loftOpenW) * airLane;
   387	        if (gain > 0) sL *= 1 + gain * (W.passFwdBase + g.riskTolerance * W.passFwdRisk) * 0.8;
   388	        else sL *= 1 + gain * W.passBackPen;
   389	        sL *= mul;
   390	        sL *= 0.55 + p.attrs.passing * 0.75;
   391	        if (sL > bestLoft) {
   392	          bestLoft = sL;
   393	          bestLoftMate = mate;
   394	          bestLoftOpen = open;
   395	        }
   396	      }
   397	    }
   398	    if (pressure > 0.5) bestPass *= W.passOutletMul; // pass is the pressure outlet
   399	    // From the HANDS, the ground pass is a SCHOOL choice (Phase 98): the
   400	    // build-up keeper plays it constantly, the punt-first keeper barely
   401	    // trusts his feet. Outfield passing is untouched.
   402	    if (p.role === 'GK' && p.gkDistributing) bestPass *= 0.6 + g.passBias * 0.8;
   403	    // The why string is built once for the winner — building it per improved
   404	    // candidate inside the loop was pure string churn (toFixed × 3 each time).
   405	    if (bestMate) {
   406	      cands.push({
   407	        action: 'Pass',
   408	        score: bestPass,
   409	        why: `to ${bestMate.name} · lane ${bestLane.toFixed(2)} · open ${bestOpen.toFixed(2)} · passBias ${g.passBias.toFixed(2)}${stagnation > 0.01 ? ` · stale ${stagnation.toFixed(2)}` : ''}`,
   410	      });
   411	    }
   412	    if (bestLoftMate) {
   413	      cands.push({
   414	        action: 'LoftedPass',
   415	        score: bestLoft,
   416	        why: `switch to ${bestLoftMate.name} · open ${bestLoftOpen.toFixed(2)} · air lane ${airLane.toFixed(2)} · passing ${p.attrs.passing.toFixed(2)}`,
   417	      });
   418	    }
   419	  }
   420	
   421	  // --- Through ball: feed an assigned runner IN THEIR PATH, not to feet.
   422	  // Scored by the lane to the projected point and how far beyond the last
   423	  // defender it lands; riskTolerance gates it (direct sides live on these).
   424	  let bestRunner: Player | null = null;
   425	  let bestThrough = 0;
   426	  let bestBehind = 0;
   427	  let bestThroughLane = 0;
   428	  let bestThroughChip = false;
   429	  if (p.kickCooldown <= 0) {
   430	    const line = defenderLineLocalX(team, opp.players);
   431	    // Third man (Phase 34): p JUST received — the bounce to a runner within a
   432	    // beat is the possession game's release. Modulated by passBias.
   433	    const lpT = match.lastCompletedPass;
   434	    const fresh = lpT !== null && lpT.receiverGid === p.gid && match.simTime - lpT.t < 1.5;
   435	    for (const mate of team.players) {
   436	      if (mate === p || mate.sentOff || mate.action.type !== 'MakeRun') continue;
   437	      const bounceMul = fresh && lpT!.passerGid !== mate.gid ? 1 + g.passBias * 0.35 * W.thirdManW : 1;
   438	      const flight = dist(p.pos, mate.pos) / 18;
   439	      // Meet the run, not the hover (Phase 29): a runner held onside shows
   440	      // ~zero velocity, so the aim point projects the burst they will make.
   441	      const burst = runBurstPoint(mate, team, opp.players, flight);
   442	      const point = {
   443	        x: clamp(burst.x, -HALF_L + 2, HALF_L - 2),
   444	        y: clamp(burst.y, -HALF_W + 2, HALF_W - 2),
   445	      };
   446	      if (team.localX(point.x) < localX + 5) continue; // must genuinely penetrate
   447	      const lane = laneOpenness(p.pos, point, opp.players);
   448	      const behind = clamp01((team.localX(point.x) - line) / 10);
   449	      let gates = (0.45 + g.riskTolerance * 0.85) * (0.85 + g.tempo * 0.3) * (1 + stagnation * 0.2);
   450	      // A runner ALREADY beyond the offside line is flagged the moment this
   451	      // ball is struck (Phase 29) — wait for them to check their run instead.
   452	      // The held run (executor clamp) makes the legal version of this ball.
   453	      if (!offsideExemptKick && team.localX(mate.pos.x) > offLine + 0.2) gates *= 0.1;
   454	      // The behind term alone used to float a fully-walled ball over the
   455	      // selection bar (Phase 30.5): 82% of through balls went into blocked
   456	      // lanes at 36% completion (probe-pass). Openness now gates the score
   457	      // multiplicatively — open balls unchanged, walls discount hard.
   458	      const s =
   459	        (W.throughBase + lane * W.throughOpenW + behind * W.throughBehindW) *
   460	        gates * (0.4 + 0.6 * clamp01(lane / 0.45)) * bounceMul;
   461	      if (s > bestThrough) {
   462	        bestThrough = s;
   463	        bestRunner = mate;
   464	        bestThroughLane = lane;
   465	        bestBehind = behind;
   466	        bestThroughChip = false;
   467	      }
   468	      // Chip over the top (Phase 28): when bodies block the ground lane but
   469	      // the runner is going in behind, go over them instead — slower to
   470	      // arrive and harder to bring down (technique gates the trust in it).
   471	      // Judged at the LANDING (Phase 30.5): airLane only sees the kicker's
   472	      // surroundings, so packed drop zones looked wide open — the chip's
   473	      // real risk is who stands where the ball comes down.
   474	      if (lane < 0.45) {
   475	        const landOpen = 1 - pressureAt(point, opp.players);
   476	        const sC =
   477	          (W.throughBase + landOpen * W.throughOpenW * 0.8 + behind * W.throughBehindW) *
   478	          gates * 0.9 * (0.55 + p.attrs.passing * 0.7) *
   479	          (0.7 + airLane * 0.3) * (0.4 + 0.6 * clamp01(landOpen / 0.45)) * bounceMul;
   480	        if (sC > bestThrough) {
   481	          bestThrough = sC;
   482	          bestRunner = mate;
   483	          bestThroughLane = landOpen;
   484	          bestBehind = behind;
   485	          bestThroughChip = true;
   486	        }
   487	      }
   488	    }
   489	    if (bestRunner) {
   490	      cands.push({
   491	        action: 'ThroughBall',
   492	        score: bestThrough,
   493	        why: `${bestThroughChip ? 'chipped over the top ' : ''}into ${bestRunner.name}'s run · lane ${bestThroughLane.toFixed(2)} · behind ${bestBehind.toFixed(2)} · risk ${g.riskTolerance.toFixed(2)}`,
   494	      });
   495	    }
   496	  }
   497	
   498	  // --- Cross (Phase 28): from wide and advanced (or the corner flag), whip
   499	  // it at the best aerial target attacking the box. Wide-overload football
   500	  // lives here: attackingWidth is the style gene that trusts the delivery.
   501	  let bestCrossMate: Player | null = null;
   502	  let bestCrossT = 0;
   503	  const isCorner = kickKind === 'corner';
   504	  if (p.kickCooldown <= 0 && (isCorner || (Math.abs(p.pos.y) > 10 && localX > 10))) {
   505	    for (const mate of team.players) {
   506	      if (mate === p || mate.sentOff || mate.role === 'GK') continue;
   507	      const mLocalX = team.localX(mate.pos.x);
   508	      if (mLocalX < 16 || Math.abs(mate.pos.y) > 13) continue; // must attack the box channel
   509	      let t =
   510	        aerialSense(mate) * 0.6 +
   511	        opennessOf(mate, opp.players) * 0.4 +
   512	        clamp01((mLocalX - 18) / 20) * 0.25;
   513	      // Corner routine (Phase 31): a post routine aims the delivery at the
   514	      // crasher attacking the KEY zone — the separation run the 29.1
   515	      // momentum lever needed but never got a delivery for.
   516	      if (isCorner && (kickRoutine === 'nearPost' || kickRoutine === 'farPost')) {
   517	        t += clamp01(1 - dist(mate.pos, cornerKeyZone(kickRoutine, team.attackDir, p.pos.y)) / 10) * 0.6;
   518	      }
   519	      // Open-play crosses are judged like any pass (Phase 29) — an offside
   520	      // box target wastes the delivery. Corners are exempt (real law).
   521	      if (!offsideExemptKick && mLocalX > offLine + 0.2) t *= 0.12;
   522	      if (t > bestCrossT) {
   523	        bestCrossT = t;
   524	        bestCrossMate = mate;
   525	      }
   526	    }
   527	    if (bestCrossMate) {
   528	      let sX = W.crossBase + bestCrossT * W.crossBoxW;
   529	      sX *= 0.75 + g.attackingWidth * 0.5;
   530	      sX *= 0.7 + g.passBias * 0.4;
   531	      if (p.role === 'WG') sX *= 1.25; // it's what wingers are FOR (28.3)
   532	      if (team.mode === 'Attack' || team.mode === 'CounterAttack') sX *= 1.15;
   533	      // The corner IS a cross — deliver it. Unless the routine says the
   534	      // ball goes SHORT or to the ARC (Phase 31): then the whip is the
   535	      // fallback, not the plan.
   536	      if (isCorner) sX *= kickRoutine === 'short' || kickRoutine === 'arcCutback' ? 0.7 : 2.4;
   537	      if (!mustKick) sX *= 1 - kickMisalignment(p, norm(sub(bestCrossMate.pos, p.pos))) * 0.12 * (1 - p.attrs.passing * 0.5);
   538	      cands.push({
   539	        action: 'Cross',
   540	        score: sX,
   541	        why: `${isCorner ? 'corner — ' : ''}to ${bestCrossMate.name} in the box · target ${bestCrossT.toFixed(2)} · width ${g.attackingWidth.toFixed(2)}`,
   542	      });
   543	    }
   544	  }
   545	
   546	  // --- Cutback (Phase 31): from the byline zone, the hard pull-back to the
   547	  // arc — real football's canonical set-defence beater. The regular pass
   548	  // loop can never pick it (gain < 0 reads as a back-pass and gets
   549	  // penalized), so it scores as its own candidate aimed at the licensed
   550	  // ARRIVER, whose late run the executor routes to the arc. The receiver's
   551	  // snap-decision window (giveBall) makes the first-time strike.
   552	  let cutbackMate: Player | null = null;
   553	  let cutbackCand: UtilityScore | null = null;
   554	  const cornerCutback = kickKind === 'corner' && kickRoutine === 'arcCutback';
   555	  if (
   556	    p.kickCooldown <= 0 && (!mustKick || cornerCutback) && team.arriver !== null &&
   557	    Math.abs(p.pos.y) > 10 && localX > HALF_L - 17
   558	  ) {
   559	    const arr = team.players[team.arriver];
   560	    if (arr !== p && !arr.sentOff) {
   561	      const lane = laneOpenness(p.pos, arr.pos, opp.players);
   562	      const open = opennessOf(arr, opp.players);
   563	      const arrLocalX = team.localX(arr.pos.x);
   564	      const inArc = arrLocalX > HALF_L - 26 && Math.abs(arr.pos.y) < 12;
   565	      let sCB =
   566	        (0.48 + lane * 0.3 + open * 0.28) *
   567	        (inArc ? 1.15 : 0.6) *
   568	        (0.8 + g.attackingWidth * 0.4);
   569	      // The corner routine committed to this ball (Phase 31) — the arc
   570	      // strike IS the plan, the whipped cross is the fallback.
   571	      if (cornerCutback) sCB *= 2.2;
   572	      cutbackMate = arr;
   573	      cutbackCand = {
   574	        action: 'Pass',
   575	        score: sCB,
   576	        why: `cutback to ${arr.name} at the arc · lane ${lane.toFixed(2)} · open ${open.toFixed(2)}`,
   577	      };
   578	      cands.push(cutbackCand);
   579	    }
   580	  }
   581	
   582	  // --- Hold-up (Phase 28): the pivot's back-to-goal game. A striker with
   583	  // the ball, back to goal and a defender on them shields it and waits for
   584	  // support instead of forcing a turn — the lay-off boost in the pass loop
   585	  // is the payoff. Patience isn't free: stagnation drains it.
   586	  // 34.3 (user report "中锋接球之后不转身"): the zone extends into the own
   587	  // half — the target-man outlet shields wherever the long ball finds him.
   588	  // 打卡油角 (Phase 35): killing the game at the corner flag, ANY carrier
   589	  // shields — the pivot's back-to-goal craft, borrowed for the clock.
   590	  const cornerHold =
   591	    team.mentality.holding > 0.5 && localX > HALF_L - 18 && Math.abs(p.pos.y) > 10;
   592	  if (!mustKick && ((p.role === 'ST' && localX > -12 && localX < 32) || cornerHold)) {
   593	    const backToGoal = kickMisalignment(p, norm(sub(goal, p.pos))); // 1 = facing own goal
   594	    if (backToGoal > 0.45 && pressure > 0.2) {
   595	      const sH =
   596	        (0.36 + pressure * 0.3) *
   597	        (0.55 + p.attrs.dribbling * 0.7) *
   598	        (0.5 + backToGoal * 0.5) *
   599	        (1 - stagnation * 0.5) *
   600	        (cornerHold ? 1 + team.mentality.holding * 0.6 : 1);

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/ai/PlayerBrain.ts | sed -n '601,900p'; nl -ba src/ai/PlayerBrain.ts | sed -n '901,1160p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
   601	      cands.push({
   602	        action: 'HoldUp',
   603	        score: sH,
   604	        why: `back to goal · pressure ${pressure.toFixed(2)} · dribbling ${p.attrs.dribbling.toFixed(2)}`,
   605	      });
   606	    }
   607	  }
   608	
   609	  // --- Dribble: needs space ahead; dribbleBias makes it a first choice.
   610	  // Never for a keeper (32.2): a back-pass puts the ball at his FEET and
   611	  // his job is to move it, not to carry it out of the box (the reported
   612	  // 门将带球跑出禁区 class of nonsense is fenced here for good).
   613	  if (!mustKick && p.role !== 'GK') {
   614	    // Wide and advanced (Phase 31): the drive goes DOWN THE LINE toward the
   615	    // byline, not diagonally into the packed box — 下底. Space is measured
   616	    // along the actual path (the touchline channel is usually open when the
   617	    // central cone is a wall), and dribbleTarget steers the same way, so
   618	    // the utility and the legs agree. This is what puts carriers in the
   619	    // pull-back zone at all: measured before it, the byline was occupied
   620	    // for 0.16s per MATCH.
   621	    const wideDrive = Math.abs(p.pos.y) > 13 && localX > 20 && localX < HALF_L - 7;
   622	    const toGoal = wideDrive
   623	      ? norm(sub(v2((HALF_L - 8) * team.attackDir, Math.sign(p.pos.y) * (HALF_W - 12)), p.pos))
   624	      : norm(sub(goal, p.pos));
   625	    const space = spaceAhead(p, toGoal, opp.players);
   626	    let sD = (W.dribbleBase + space * W.dribbleSpaceW) * (W.dribbleGeneBase + g.dribbleBias * W.dribbleGeneW);
   627	    sD *= 1 - pressure * W.dribblePressurePen;
   628	    // The TURN TAX (34.3, user report "球员朝向也挺重要"): driving forward
   629	    // with your back to the play means turning ON the ball — a contested
   630	    // touch when someone is close. Facing forward, or free of pressure,
   631	    // costs nothing; back-to-goal under a marker, the forward drive yields
   632	    // to holding up, escaping, or the first-time ball.
   633	    sD *= 1 - kickMisalignment(p, toGoal) * pressure * 0.3;
   634	    // Drive the OPEN RUN (Phase 31, the reported "大空间不突破就硬要传球"):
   635	    // big space ahead used to lose to forced passes. The boost is a flat
   636	    // multiplier ON TOP of the pressure penalty — an earlier cut also
   637	    // EXEMPTED open-run dribbles from back-pressure, and that possession-
   638	    // longevity freebie inverted the shootBias gene (patient teams simply
   639	    // outlasted everyone into MORE shots; genes.test caught it). Inside
   640	    // 15m the 28.4 breakaway boost takes over: FINISH, don't carry it in.
   641	    if (openRun && dGoal > 15) sD *= 1.35;
   642	    if (team.mode === 'CounterAttack') sD *= 1.25;
   643	    sD *= 1 + stagnation * 0.28; // carrying it forward relieves stagnation (Phase 27)
   644	    cands.push({
   645	      action: 'Dribble',
   646	      score: sD,
   647	      why: `space ${space.toFixed(2)} · dribbleBias ${g.dribbleBias.toFixed(2)}${openRun && dGoal > 15 ? ' · open run — drive' : ''}${stagnation > 0.01 ? ` · stale ${stagnation.toFixed(2)}` : ''}`,
   648	    });
   649	    // 脱压带球 (34.2, user report): pressured with the front door closed,
   650	    // the craft answer is to CARRY it back or sideways and buy an outlet —
   651	    // not to stop dead (the old forward-only dribble died to the pressure
   652	    // penalty here and the carrier froze). Escaping pressure is the point,
   653	    // so the penalty barely applies; basic craft, only half-gated by flair.
   654	    const holdCorner = team.mentality.holding > 0.5;
   655	    const esc = escapeCarry(p, team.attackDir, localX, opp.players, holdCorner);
   656	    if (esc && !openRun) {
   657	      let sE =
   658	        (W.dribbleBase + esc.space * W.dribbleSpaceW) *
   659	        (W.dribbleGeneBase + g.dribbleBias * 0.5 * W.dribbleGeneW);
   660	      sE *= 1 - pressure * 0.1;
   661	      // Killing the game (Phase 35): the carry to the corner outranks the
   662	      // risky ball — possession IS the shot now.
   663	      if (holdCorner && localX > 0) sE *= 1 + team.mentality.holding * 0.4;
   664	      cands.push({
   665	        action: 'Dribble',
   666	        score: sE,
   667	        why: holdCorner && localX > 0
   668	          ? `carrying it to the corner — killing the game · space ${esc.space.toFixed(2)}`
   669	          : `carrying it OUT of the press · escape space ${esc.space.toFixed(2)}`,
   670	      });
   671	    }
   672	  }
   673	
   674	  // --- Keeper distribution from the HANDS (Phase 28.3 → 98, user-ratified
   675	  // "门将出球选择应该和战术有关"): the one-size throw becomes the coach's
   676	  // choice — three genome-scored releases:
   677	  //   · the short roll to feet    — the build-up school (passBias): tempo
   678	  //     from the back, restart the pattern;
   679	  //   · the fast long sling       — the counter launch (counterAttackBias):
   680	  //     forward gain is the whole point, priced up with the gene;
   681	  //   · the PUNT (new)            — closed outlets + no build-up genes: a
   682	  //     long lofted drop the phase-63 aerial channel contests on descent —
   683	  //     STRENGTH picks the target, so the tall outlet man is a buyable
   684	  //     package for punt-first coaches.
   685	  // The 28.3 no-hoof contract stands: every release still has a NAME on it.
   686	  let bestThrowMate: Player | null = null;
   687	  let bestThrow = 0;
   688	  let puntCand: (typeof cands)[number] | null = null;
   689	  let puntMate: Player | null = null;
   690	  if (p.role === 'GK' && p.gkDistributing && p.kickCooldown <= 0) {
   691	    let bestOpenNear = 0; // how playable the short game is right now
   692	    // The counter WINDOW: every opponent still committed in our half at the
   693	    // catch is a man the quick sling beats — the fast break is launched
   694	    // from the keeper's hands or it isn't a fast break at all.
   695	    let committed = 0;
   696	    let oppOutfield = 0;
   697	    for (const o of opp.players) {
   698	      if (o.role === 'GK' || o.sentOff) continue;
   699	      oppOutfield++;
   700	      if (team.localX(o.pos.x) < 0) committed++;
   701	    }
   702	    const transition = oppOutfield > 0 ? committed / oppOutfield : 0;
   703	    for (const mate of team.players) {
   704	      if (mate === p || mate.sentOff) continue;
   705	      const d = dist(p.pos, mate.pos);
   706	      const open = opennessOf(mate, opp.players);
   707	      if (d >= 8 && d <= 16) bestOpenNear = Math.max(bestOpenNear, open);
   708	      if (d < 8 || d > 30) continue;
   709	      const gain = clamp01((team.localX(mate.pos.x) - localX + 30) / 60) * 2 - 1;
   710	      let sT =
   711	        d <= 16
   712	          ? (0.3 + open * 0.5) * (0.6 + g.passBias * 0.8)
   713	          : (0.3 + open * 0.5) *
   714	            (0.5 + g.counterAttackBias * 0.7) *
   715	            (1 + Math.max(gain, 0) * (0.2 + g.counterAttackBias * 0.55)) *
   716	            (1 + transition * g.counterAttackBias * 1.3);
   717	      // LOOK BEFORE YOU THROW (the keeper-release fix): the flat throw/sling
   718	      // is a GROUND ball — a body parked in the lane blocks it and it bounces
   719	      // back into the box (measured: hands releases blocked-lane 9-18% vs the
   720	      // lane-aware goal kick's 4-5%, lane-HITs landing 60-79% in our own
   721	      // defensive third). Every outfield pass already reads laneOpenness
   722	      // (`passBase + lane*passLaneW + …`); the hands distribution never did —
   723	      // it picked by receiver-openness alone. A clear lane is now required,
   724	      // not merely an open receiver. The lofted PUNT below clears heads and
   725	      // keeps its openness-of-landing logic.
   726	      sT *= 0.3 + laneOpenness(p.pos, mate.pos, opp.players) * 0.7;
   727	      if (sT > bestThrow) {
   728	        bestThrow = sT;
   729	        bestThrowMate = mate;
   730	      }
   731	    }
   732	    if (bestThrowMate) {
   733	      cands.push({
   734	        action: 'ThrowOut',
   735	        score: bestThrow,
   736	        why: `thrown to ${bestThrowMate.name} · open ${opennessOf(bestThrowMate, opp.players).toFixed(2)} · ${dist(p.pos, bestThrowMate.pos) <= 16 ? `roll to feet · passBias ${g.passBias.toFixed(2)}` : `counter sling · counterBias ${g.counterAttackBias.toFixed(2)}`}`,
   737	      });
   738	    }
   739	    let bestPuntFit = 0;
   740	    for (const mate of team.players) {
   741	      if (mate === p || mate.sentOff) continue;
   742	      const d = dist(p.pos, mate.pos);
   743	      if (d < 24) continue;
   744	      const fit = clamp01((team.localX(mate.pos.x) - localX) / 60) * 0.6 + mate.attrs.strength * 0.5;
   745	      if (fit > bestPuntFit) {
   746	        bestPuntFit = fit;
   747	        puntMate = mate;
   748	      }
   749	    }
   750	    if (puntMate) {
   751	      const closed = 1 - bestOpenNear;
   752	      const sP =
   753	        (0.2 + closed * 0.55) *
   754	        (1.4 - (g.passBias + g.riskTolerance) * 0.6) *
   755	        (0.7 + bestPuntFit * 0.45);
   756	      puntCand = {
   757	        action: 'LoftedPass',
   758	        score: sP,
   759	        why: `PUNT to ${puntMate.name} · outlets closed ${closed.toFixed(2)} · strength ${puntMate.attrs.strength.toFixed(2)}`,
   760	      };
   761	      cands.push(puntCand);
   762	    }
   763	  }
   764	
   765	  // --- Clear: panic button deep in our half; risk-averse teams use it more.
   766	  // A keeper distributing from the HANDS never panic-hoofs (Phase 28.3) —
   767	  // they had a full second to pick a target.
   768	  if (localX < -18 && p.kickCooldown <= 0 && !(p.role === 'GK' && p.gkDistributing)) {
   769	    let sC = (W.clearBase + pressure * W.clearPressureW) * (1.25 - g.riskTolerance * 0.8);
   770	    // A keeper with the ball at his feet (32.2): the TRADITIONAL keeper
   771	    // hoofs it; the ball-playing one (passBias + riskTolerance) trusts his
   772	    // feet and plays through the press — the same genes that make his
   773	    // teammates use him as the outlet.
   774	    if (p.role === 'GK') sC *= 1.9 - (g.passBias + g.riskTolerance) * 0.55;
   775	    cands.push({ action: 'ClearBall', score: sC, why: `pressure ${pressure.toFixed(2)} · risk-averse ${(1 - g.riskTolerance).toFixed(2)}` });
   776	  }
   777	
   778	  cands.sort((a, b) => b.score - a.score);
   779	  // Degenerate fallback (kick still on cooldown): carry the ball as today.
   780	  if (cands.length === 0) {
   781	    p.action = { type: 'Dribble', scores: [] };
   782	    return;
   783	  }
   784	  const top = cands[0];
   785	  const scores = cands.slice(0, 4);
   786	
   787	  // A restart taker sets themselves before striking (the run-up): face the
   788	  // chosen target so orientation penalties don't gut dead-ball deliveries —
   789	  // corners arrived weak and wild while the taker still faced the flag.
   790	  if (mustKick) {
   791	    const at =
   792	      top === cutbackCand ? cutbackMate!.pos // the corner arc cutback (31)
   793	      : top.action === 'Pass' ? bestMate!.pos
   794	      : top.action === 'LoftedPass' ? bestLoftMate!.pos
   795	      : top.action === 'Cross' ? bestCrossMate!.pos
   796	      : top.action === 'ThroughBall' ? bestRunner!.pos
   797	      : top.action === 'Shoot' ? goal
   798	      : null; // clears/dribbles: face straight upfield
   799	    if (at) {
   800	      const hx = at.x - p.pos.x;
   801	      const hy = at.y - p.pos.y;
   802	      const hl = Math.sqrt(hx * hx + hy * hy);
   803	      if (hl > 1e-6) p.heading = { x: hx / hl, y: hy / hl };
   804	    } else {
   805	      p.heading = { x: team.attackDir, y: 0 };
   806	    }
   807	  }
   808	
   809	  // Kicks resolve instantly; movement actions persist until next tick.
   810	  switch (top.action) {
   811	    case 'Pass':
   812	      if (top === cutbackCand) {
   813	        p.action = { type: 'Pass', targetIdx: cutbackMate!.gid, scores };
   814	        match.performCutback(p, cutbackMate!);
   815	      } else {
   816	        p.action = { type: 'Pass', targetIdx: bestMate!.gid, scores };
   817	        match.performPass(p, bestMate!, offsideExemptKick);
   818	      }
   819	      break;
   820	    case 'LoftedPass': {
   821	      // The keeper's punt (Phase 98) routes to ITS target — the aerial
   822	      // outlet — not the ground game's best switch.
   823	      const loftTo = top === puntCand ? puntMate! : bestLoftMate!;
   824	      p.action = { type: 'LoftedPass', targetIdx: loftTo.gid, scores };
   825	      match.performLoftedPass(p, loftTo, offsideExemptKick);
   826	      break;
   827	    }
   828	    case 'Cross':
   829	      p.action = { type: 'Cross', targetIdx: bestCrossMate!.gid, scores };
   830	      // A routine corner delivers to the KEY ZONE, not to a led body
   831	      // (Phase 31.9): the crasher's burst is timed onto the zone, and a
   832	      // velocity lead on a sprinting man overshot the whole picture by
   833	      // ~9m. The small pull keeps the drop off the keeper's claim radius.
   834	      match.performCross(
   835	        p, bestCrossMate!, offsideExemptKick,
   836	        kickKind === 'corner' ? 0.06 : 0.18,
   837	        kickKind === 'corner' && (kickRoutine === 'nearPost' || kickRoutine === 'farPost')
   838	          ? cornerKeyZone(kickRoutine, team.attackDir, p.pos.y)
   839	          : undefined,
   840	      );
   841	      break;
   842	    case 'ThrowOut':
   843	      p.action = { type: 'ThrowOut', targetIdx: bestThrowMate!.gid, scores };
   844	      match.performKeeperThrow(p, bestThrowMate!);
   845	      break;
   846	    case 'ThroughBall':
   847	      p.action = { type: 'ThroughBall', targetIdx: bestRunner!.gid, scores };
   848	      match.performThroughBall(p, bestRunner!, bestThroughChip, offsideExemptKick);
   849	      break;
   850	    case 'Shoot':
   851	      p.action = { type: 'Shoot', scores };
   852	      // A free-kick strike is a different kick entirely (Phase 32): the
   853	      // placed ball curls OVER the wall on its own flight profile.
   854	      if (kickKind === 'freeKick') match.performFreeKick(p);
   855	      else match.performShot(p);
   856	      break;
   857	    case 'ClearBall':
   858	      p.action = { type: 'ClearBall', scores };
   859	      match.performClear(p);
   860	      break;
   861	    case 'HoldUp':
   862	      p.action = { type: 'HoldUp', scores };
   863	      break;
   864	    default:
   865	      p.action = { type: 'Dribble', scores };
   866	      break;
   867	  }
   868	}
   869	
   870	/* ------------------------------------------------------------------ */
   871	/* Goalkeeper                                                          */
   872	/* ------------------------------------------------------------------ */
   873	
   874	function decideGoalkeeper(p: Player, team: Team, match: Match): void {
   875	  const ball = match.ball;
   876	  const ownGoal = team.ownGoal();
   877	
   878	  // Shot incoming at our goal -> drop everything and save.
   879	  const shot = match.pendingShot;
   880	  if (
   881	    shot && !shot.resolved && shot.side !== p.side && ball.owner === null &&
   882	    dot(ball.vel, sub(ownGoal, ball.pos)) > 0
   883	  ) {
   884	    p.action = { type: 'GoalkeeperSave', scores: [{ action: 'GoalkeeperSave', score: 1, why: 'shot incoming' }] };
   885	    return;
   886	  }
   887	
   888	  // 门将上前 (Phase 35): licensed for a stoppage-time attacking corner —
   889	  // the goal stands EMPTY behind him; a cleared ball into the counter is
   890	  // the price of the theater. TeamBrain tears the license up within one
   891	  // brain tick of the moment dying and he falls through to positioning,
   892	  // which sprints him home.
   893	  if (team.keeperUp) {
   894	    p.action = {
   895	      type: 'MakeRun',
   896	      scores: [{ action: 'MakeRun', score: 1, why: 'keeper UP for the corner — nothing left to lose' }],
   897	    };
   898	    return;
   899	  }
   900	
   901	  // 1v1 rush (Phase 27.5): an opponent carrier bearing down with nobody
   902	  // goal-side — charge them down and make the goal small. keeperAggression
   903	  // sets how far out the keeper is willing to leave the line.
   904	  // Phase 103 (user design, 门将出击到禁区外) probed BOTH extensions and
   905	  // kept one: charging a CONTROLLED carrier far out is bad football — the
   906	  // rush-anatomy A/B measured the extended charge at GA +1.3-1.8 vs the
   907	  // timid school in both regimes (attackers simply shoot past the
   908	  // advancing keeper: xg/shot faced 0.16→0.20). The carrier charge keeps
   909	  // its classic range; the sweeper's REAL range gain is the loose-ball
   910	  // interception below (through balls are where 出击 pays).
   911	  const carrier = ball.owner;
   912	  if (carrier && carrier.side !== p.side) {
   913	    const aggr = team.genome.keeperAggression;
   914	    const dGoal = dist(carrier.pos, ownGoal);
   915	    if (dGoal < 9 + aggr * 8) {
   916	      let goalside = 0;
   917	      for (const mate of team.players) {
   918	        if (mate === p || mate.sentOff) continue;
   919	        if (dist(mate.pos, ownGoal) < dGoal - 1) goalside++;
   920	      }
   921	      // The RACE READ (Phase 103): charge only when he can MEET the carrier
   922	      // before the shot. Inside the box the old reflex stands (make the
   923	      // goal small); outside it, an unwinnable charge just opens an empty
   924	      // net — probed: an always-charge sweeper conceded 5.13/match vs the
   925	      // timid school's 2.05. The gene prices the accepted margin, the
   926	      // physics decide the race.
   927	      let raceWon = true;
   928	      if (goalside === 0 && !match.inPenaltyBox(carrier.pos, p.side)) {
   929	        const toGoal = norm(sub(ownGoal, carrier.pos));
   930	        const closing = carrier.vel.x * toGoal.x + carrier.vel.y * toGoal.y;
   931	        raceWon =
   932	          closing > 1.2 &&
   933	          timeToPoint(p, carrier.pos) < (dGoal - 11) / closing + (aggr - 0.5) * 0.4;
   934	      }
   935	      if (goalside === 0 && raceWon) {
   936	        p.action = {
   937	          type: 'GoalkeeperRush',
   938	          scores: [{ action: 'GoalkeeperRush', score: 1, why: `1v1 — rushing out · aggr ${aggr.toFixed(2)}` }],
   939	        };
   940	        return;
   941	      }
   942	    }
   943	  }
   944	
   945	  // Loose ball near our goal that we can claim first. The gate is on where
   946	  // the ball is COMING DOWN (Phase 28) — a cross dropping into the box pulls
   947	  // the keeper off the line to meet it even while it's still out wide.
   948	  if (ball.owner === null) {
   949	    const sol = interceptBall(p, ball);
   950	    // The sweeper's interception range (Phase 103): a through ball coming
   951	    // down 20-27m out is the high-line keeper's to eat — feet only out
   952	    // there (the 28.5 giveBall gate). Timid keepers keep the old 15m.
   953	    if (dist(sol.point, ownGoal) < 15 + Math.max(0, team.genome.keeperAggression - 0.5) * 24) {
   954	      // Running min over the same values in the same order — the old
   955	      // filter/map/spread allocated two arrays per GK decision.
   956	      let rivalT = Infinity;
   957	      for (const q of match.allPlayers) {
   958	        if (q === p || q.sentOff) continue;
   959	        const t = timeToPoint(q, sol.point);
   960	        if (t < rivalT) rivalT = t;
   961	      }
   962	      if (sol.tMe < rivalT || (ball.airborne && sol.tMe <= sol.tBall + 0.2)) {
   963	        p.action = { type: 'ChaseBall', scores: [{ action: 'ChaseBall', score: 0.9, why: ball.airborne ? 'attack the dropping ball' : 'claim loose ball in box' }] };
   964	        return;
   965	      }
   966	    }
   967	  }
   968	
   969	  p.action = {
   970	    type: 'GoalkeeperPosition',
   971	    scores: [{ action: 'GoalkeeperPosition', score: 0.6, why: `keeperAggression ${team.genome.keeperAggression.toFixed(2)}` }],
   972	  };
   973	}
   974	
   975	/* ------------------------------------------------------------------ */
   976	/* Off-ball outfielders                                                */
   977	/* ------------------------------------------------------------------ */
   978	
   979	function decideOffBall(p: Player, team: Team, opp: Team, match: Match): void {
   980	  const g = team.genome;
   981	  const W = team.policies[p.index];
   982	  const ball = match.ball;
   983	  const possession = match.possessionSide;
   984	  const cands: UtilityScore[] = [];
   985	  let markTarget: number | undefined;
   986	  let receiveFlag = false;
   987	
   988	  const tired = p.stamina < 0.4 && g.staminaConservation > 0.5;
   989	
   990	  if (possession === team.side) {
   991	    // ----- We have the ball -----
   992	    const pass = match.pendingPass;
   993	    if (pass && pass.side === team.side && pass.targetGid === p.gid) {
   994	      cands.push({ action: 'ReceivePass', score: 1.2, why: 'pass is coming to me' });
   995	      receiveFlag = true;
   996	    }
   997	    // OUR loose ball (36.2): TeamBrain assigned this player to the 50/50
   998	    // (a squirt/miscontrol/knockdown while possession is nominally ours) —
   999	    // go win it back; the race outranks shape and support.
  1000	    if (ball.owner === null && team.chasers.has(p.index)) {
  1001	      cands.push({ action: 'ChaseBall', score: 1.1, why: 'our loose ball — contest it' });
  1002	    }
  1003	    const carrier = ball.owner;
  1004	    // The DF slot is the REST DEFENCE (Phase 31): once the ball crosses
  1005	    // halfway he does not join the siege — formationSpot clamps his spot
  1006	    // deep (≤ −12 local) and he holds it as the +1 cover and the recycling
  1007	    // outlet. Without this the support fan pulled even the last outfielder
  1008	    // to the ball, nobody covered, and every turnover was an uncontested
  1009	    // breakaway — which is how a 5v6 side out-scored its full-strength
  1010	    // self (the besieged team lives on counters).
  1011	    const restDefence = p.index === 1 && team.localX(ball.pos.x) > 0;
  1012	    if (carrier && carrier !== p && !restDefence) {
  1013	      const d = dist(p.pos, carrier.pos);
  1014	      const roleBonus = p.role === 'ST' ? 0.12 : p.role === 'WG' ? 0.1 : p.role === 'MF' ? 0.06 : 0;
  1015	      const modeMul = team.mode === 'Attack' || team.mode === 'CounterAttack' ? 1.2 : team.mode === 'BuildUp' ? 1.0 : 0.6;
  1016	      let s = (W.supportBase + clamp01(1 - d / 30) * W.supportProxW + roleBonus) * modeMul;
  1017	      if (tired) s *= 0.6; // conserve energy: prefer holding shape
  1018	      cands.push({ action: 'SupportBallCarrier', score: s, why: `dist ${d.toFixed(0)}m · mode ${team.mode}` });
  1019	    }
  1020	    // Assigned runner: sprint in behind and drag the line — the movement a
  1021	    // through ball needs. Tired legs sit the run out. During a corner setup
  1022	    // there is no carrier yet — the licensed box-crashers run anyway
  1023	    // (Phase 28: the cross needs bodies attacking the area, not spectators).
  1024	    // The ARRIVER (Phase 31) runs on the same license — executor routes
  1025	    // their run to the edge-of-box arc instead of in behind.
  1026	    const arriving = team.arriver === p.index;
  1027	    // A corner delivery in FLIGHT has no carrier and phase is 'playing' —
  1028	    // without the cornerCrash clause the licensed crashers lost their run
  1029	    // the instant the ball left the taker's boot and walked back to their
  1030	    // formation spots while it was still in the air (Phase 31.9).
  1031	    const crashLive = team.cornerCrash !== null && match.simTime < team.cornerCrash.until;
  1032	    if ((team.runners.has(p.index) || arriving) && (carrier ? carrier !== p : match.phase === 'restart' || crashLive)) {
  1033	      let s = W.runScore;
  1034	      if (tired) s *= 0.6;
  1035	      cands.push({
  1036	        action: 'MakeRun',
  1037	        score: s,
  1038	        why: arriving
  1039	          ? 'arriving late at the cutback arc'
  1040	          : match.phase === 'restart' || crashLive ? 'attacking the box for the delivery' : 'licensed run in behind',
  1041	      });
  1042	    }
  1043	    // 2过1 (Phase 34): just played the wall pass under pressure — burst past
  1044	    // the marker NOW; the return is scored to find this run. The BURST is
  1045	    // short (1.2s) even though the return credit runs 2.3s: a full-window
  1046	    // sprint pulled the passer out of the support structure for so long it
  1047	    // cost goals across the calibrate seeds — dart, then re-join.
  1048	    if (p.wallRun && match.simTime < p.wallRun.until - 1.1 && carrier && carrier !== p) {
  1049	      let s = W.runScore * (1.05 + (g.tempo + g.passBias) * 0.25);
  1050	      if (tired) s *= 0.6;
  1051	      cands.push({ action: 'MakeRun', score: s, why: 'bursting for the one-two return' });
  1052	    }
  1053	    // 套边 (Phase 34): licensed to overlap outside the confronted wide
  1054	    // carrier — width genes commit harder to the run.
  1055	    if (team.overlapper === p.index && carrier && carrier !== p) {
  1056	      let s = W.runScore * (1 + g.attackingWidth * 0.3);
  1057	      if (tired) s *= 0.6;
  1058	      cands.push({ action: 'MakeRun', score: s, why: 'overlapping outside the carrier' });
  1059	    }
  1060	    cands.push({
  1061	      action: 'MoveToFormationSpot',
  1062	      score: W.formationBase + (tired ? 0.2 : 0),
  1063	      why: tired ? 'keeping shape (stamina conservation)' : 'keeping shape',
  1064	    });
  1065	  } else {
  1066	    // ----- They have the ball (or it's loose) -----
  1067	    // Cut out a pass in flight — unless it's sailing overhead (Phase 28);
  1068	    // lofted balls are contested at the landing point via ChaseBall instead.
  1069	    if (ball.owner === null && match.pendingPass && match.pendingPass.side !== team.side && ball.z <= 0.5) {
  1070	      const inter = canInterceptPass(p, ball);
  1071	      if (inter.ok) cands.push({ action: 'InterceptPass', score: W.interceptScore, why: 'can reach the passing lane first' });
  1072	    }
  1073	    // Chase only if the TeamBrain assigned us — this is what stops ball-swarming.
  1074	    if (team.chasers.has(p.index)) {
  1075	      const s = W.chaseBase + g.pressIntensity * 0.15;
  1076	      cands.push({ action: 'ChaseBall', score: s, why: `assigned presser · pressIntensity ${g.pressIntensity.toFixed(2)}` });
  1077	    } else if (possession === -1) {
  1078	      // Loose ball: closest unassigned player may react a little. Radius
  1079	      // tightened in Phase 28 — a wide net pulled extra bodies into every
  1080	      // scramble and open play collapsed into rolling six-player scrums.
  1081	      const d = dist(p.pos, ball.pos);
  1082	      if (d < 8) cands.push({ action: 'ChaseBall', score: 0.4 * (1 - d / 8), why: 'loose ball nearby' });
  1083	    }
  1084	    const mark = team.marks.get(p.index);
  1085	    if (mark !== undefined) {
  1086	      markTarget = mark;
  1087	      cands.push({
  1088	        action: 'MarkOpponent',
  1089	        score: W.markBase + g.markingAggression * 0.15,
  1090	        why: `mark ${opp.players[mark].name} · aggression ${g.markingAggression.toFixed(2)}`,
  1091	      });
  1092	    } else if (ball.owner && ball.owner.side !== team.side && !team.chasers.has(p.index)) {
  1093	      // Contain (Phase 29.1): the carrier bears down on ME and I'm already
  1094	      // goal-side — jockey them (goal-side stance on the carrier) instead of
  1095	      // jogging away to a formation spot. The reported bug: a set defender
  1096	      // suddenly ran upfield as the striker arrived, because his mark
  1097	      // assignment vanished the moment that striker became the carrier
  1098	      // (marks exclude the carrier — the chaser presses the ball, but the
  1099	      // chaser can be someone else entirely).
  1100	      const carrier = ball.owner;
  1101	      const dC = dist(p.pos, carrier.pos);
  1102	      const ownGoal = team.ownGoal();
  1103	      const carrierGoalD = dist(carrier.pos, ownGoal);
  1104	      // Defensive-territory only (< 35m out): containing a deep build-up
  1105	      // carrier 70m from goal would just add one more body to the press.
  1106	      // ONE container only — the closest unassigned goal-side defender;
  1107	      // everyone eligible jockeying at once re-created the pile-up AND
  1108	      // strangled the game to 2.0 goals.
  1109	      let closest = true;
  1110	      if (dC < 8 && carrierGoalD < 35 && dist(p.pos, ownGoal) < carrierGoalD) {
  1111	        for (const q of team.players) {
  1112	          if (q === p || q.role === 'GK' || q.sentOff) continue;
  1113	          if (team.chasers.has(q.index) || team.marks.has(q.index)) continue;
  1114	          if (dist(q.pos, ownGoal) >= carrierGoalD) continue; // not goal-side
  1115	          if (dist(q.pos, carrier.pos) < dC) {
  1116	            closest = false;
  1117	            break;
  1118	          }
  1119	        }
  1120	        if (closest) {
  1121	          markTarget = carrier.index;
  1122	          cands.push({
  1123	            action: 'MarkOpponent',
  1124	            score: 0.66 + clamp01(1 - dC / 10) * 0.18,
  1125	            why: `contain ${carrier.name} — hold goal-side`,
  1126	          });
  1127	        }
  1128	      }
  1129	    }
  1130	    cands.push({
  1131	      action: 'MoveToFormationSpot',
  1132	      score: 0.42 + g.defensiveCompactness * 0.08,
  1133	      why: `hold block · compactness ${g.defensiveCompactness.toFixed(2)}`,
  1134	    });
  1135	  }
  1136	
  1137	  cands.sort((a, b) => b.score - a.score);
  1138	  const top = cands[0];
  1139	  p.action = {
  1140	    type: top.action,
  1141	    targetIdx: top.action === 'MarkOpponent' ? markTarget : receiveFlag ? p.gid : undefined,
  1142	    scores: cands.slice(0, 4),
  1143	  };
  1144	}

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/sim/mechanics.ts | sed -n '1,330p'; nl -ba src/sim/mechanics.ts | sed -n '331,700p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	import { clamp, clamp01 } from '../utils/math';
     2	import {
     3	  add, closestPointOnSegment, dist, dot, len, norm, rotate, scale, sub, v2, type V2,
     4	} from '../utils/vec';
     5	import { laneBlockers, opennessOf, pressureAt } from '../ai/perception';
     6	import { offsideLineLocalX, runBurstPoint } from '../ai/formations';
     7	import {
     8	  BALL_FRICTION_K, BOX_DEPTH, CHEST_TRAP_MAX_HEIGHT, CHEST_TRAP_MAX_VZ, CHEST_TRAP_RADIUS,
     9	  CORNER_CLEARANCE, CROSS_LEAD_FRAC, CROSS_LEAD_MAX, GK_CLAIM_HEIGHT, GOAL_WIDTH, GRAVITY, HALF_L,
    10	  HALF_W, HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT, HEADER_RADIUS, SHOT_SPEED,
    11	  GK_RUSH_ENVELOPE,
    12	  DEFLECT_BLIND_PEN, TACKLE_LUNGE_COST, UNSET_BLOCK_WEIGHT,
    13	  TOUCH_PUSH_BASE, TOUCH_PUSH_SPACE, TOUCH_RECOLLECT_BASE, TOUCH_RECOLLECT_PER_PUSH,
    14	} from './constants';
    15	import type { Match } from './Match';
    16	import type { Player } from './Player';
    17	import type { Role } from './types';
    18	
    19	/**
    20	 * Ball mechanics: kicks, tackles, keeper saves and the xG model.
    21	 * These are free functions over the Match so Match.ts stays a readable
    22	 * state machine. All randomness comes from match.rng (deterministic).
    23	 */
    24	
    25	/** How far out the keeper can reach a ball (dive included). */
    26	function keeperReach(defTeam: { genome: { keeperAggression: number } }, gk: Player): number {
    27	  // The cat (Phase 39): elite-reflex keepers reach a hand further.
    28	  return (
    29	    2.05 + defTeam.genome.keeperAggression * 0.4 + (gk.attrs.reflexes - 0.5) * 0.5 +
    30	    (gk.traits.includes('cat') ? 0.12 : 0)
    31	  );
    32	}
    33	
    34	/** THE FINGERTIP STRETCH (Phase 119b): a save may be ATTEMPTED out to
    35	 * reach × this. The old hard cliff at reach meant a ball 5cm beyond was
    36	 * untouchable — onevone-anatomy measured 54%/23% of late-gen 1v1 shots
    37	 * (65%/36% of the GOALS) never rolling a save at all; the composed
    38	 * post-placed finish was engineered to shave exactly that boundary. The
    39	 * frozen dive difficulty already prices the distance (floor 0.25), the
    40	 * attempt fires only as the ball passes its closest approach (a catchable
    41	 * ball is never pre-empted), and a stretch save can only PARRY. */
    42	const SAVE_STRETCH = 1.35;
    43	
    44	/** Dive difficulty, frozen at the moment of the strike: how far off the
    45	 * shot's line the keeper stands, priced against his reach. Shared by the
    46	 * open-play shot, the header and the placed free kick. */
    47	function diveDifficulty(ballPos: V2, dir: V2, gk: Player, opp: { genome: { keeperAggression: number } }): number {
    48	  const path = closestPointOnSegment(ballPos, add(ballPos, scale(dir, 40)), gk.pos);
    49	  return clamp(1.15 - dist(path, gk.pos) / keeperReach(opp, gk), 0.25, 1);
    50	}
    51	
    52	/** ANGLE COVERED (Phase 119b): the share of the goal's angular window the
    53	 * keeper's POSITION cut at the strike — his depth up the shot cone over the
    54	 * shooter's distance, discounted as he stands off the shooter→goal line (a
    55	 * dragged keeper covers nothing). Phase 103's closeIn paid proximity to the
    56	 * SHOOTER; the anatomy probe caught evolution routing around it — striking
    57	 * from 8-10m where closeIn ≈ 0.1 while a keeper 3m up the cone still cut
    58	 * ~40% of the window for free. Frozen at shot time, like difficulty. */
    59	function angleCoverage(gk: Player, shooterPos: V2, goal: V2): number {
    60	  const sGoal = Math.max(dist(shooterPos, goal), 1);
    61	  const kGoal = dist(gk.pos, goal);
    62	  const lineOff = dist(closestPointOnSegment(shooterPos, goal, gk.pos), gk.pos);
    63	  return clamp01(Math.min(kGoal / sGoal, 1) * clamp01(1 - lineOff / 3));
    64	}
    65	
    66	/* ------------------------------------------------------------------ */
    67	/* Body orientation (Phase 27)                                         */
    68	/* ------------------------------------------------------------------ */
    69	
    70	/**
    71	 * How far a kick direction is from where the body faces: (1 − cosθ) / 2.
    72	 * 0 = striking dead ahead, 0.5 = square across the body, 1 = fully blind.
    73	 * `dir` must be normalized.
    74	 */
    75	export function kickMisalignment(p: Player, dir: V2): number {
    76	  return (1 - (p.heading.x * dir.x + p.heading.y * dir.y)) / 2;
    77	}
    78	
    79	/** Kicks across/against the body spray more; technique tames the penalty. */
    80	export function orientationNoiseMul(misalign: number, technique: number): number {
    81	  return 1 + misalign * (0.9 - technique * 0.6);
    82	}
    83	
    84	/** Kicks against the body lose power (up to −22%); technique recovers some. */
    85	export function orientationPowerMul(misalign: number, technique: number): number {
    86	  return 1 - misalign * 0.22 * (1 - technique * 0.4);
    87	}
    88	
    89	/**
    90	 * First-touch difficulty (Phase 27): chance a moving ball gets away from the
    91	 * receiver. Grows with ball speed, defender pressure and taking the ball from
    92	 * behind the body; technique tames all of it. This is where pressing turns
    93	 * into forced errors.
    94	 */
    95	export function touchFailChance(
    96	  speed: number, pressure: number, misalign: number, technique: number, positioning = 0.5,
    97	): number {
    98	  // POSITIONING (Phase 119j) reads the ball and shapes the body EARLY, so it
    99	  // tames the PRESSURE and BLIND-SIDE penalties (the awareness half of a first
   100	  // touch); technique still tames the whole thing (the clean contact). Neutral
   101	  // at 0.5 — `aware` = 1.0 there, so the pre-119j curve is bit-for-bit intact
   102	  // and backfilled 0.5 saves play unchanged; a reader (1.0) cuts the
   103	  // pressure/blind penalty ~30%, a spatially-blind player (0) pays ~30% more.
   104	  const aware = 1 - (positioning - 0.5) * 0.6; // 0.7 .. 1.3
   105	  const raw = 0.01 + clamp01((speed - 6) / 8) * 0.07 + (pressure * 0.1 + misalign * 0.05) * aware;
   106	  return clamp(raw * (1.3 - technique * 0.85), 0, 0.4);
   107	}
   108	
   109	/**
   110	 * Roll the first touch for a player about to control a moving ball. Returns
   111	 * true if the touch is clean (caller gives them the ball). A failed touch
   112	 * knocks the ball loose ahead of the receiver — anyone can pounce on it.
   113	 * Keepers are exempt (they catch); slow balls are trivially trapped.
   114	 */
   115	export function attemptFirstTouch(match: Match, p: Player): boolean {
   116	  const ball = match.ball;
   117	  // A dropping ball is harder to kill than a rolled one (Phase 28): the
   118	  // vertical speed counts toward touch difficulty. Ground balls: vz = 0.
   119	  const speed = len(ball.vel) + Math.abs(ball.vz) * 0.6;
   120	  if (p.role === 'GK' || speed <= 6) return true;
   121	  const hSpeed = Math.max(len(ball.vel), 1e-6);
   122	  const inx = ball.vel.x / hSpeed;
   123	  const iny = ball.vel.y / hSpeed;
   124	  // Ball arriving at the face = 0, arriving from behind the body = 1.
   125	  const misalign = (1 + (inx * p.heading.x + iny * p.heading.y)) / 2;
   126	  const pressure = pressureAt(p.pos, match.teams[1 - p.side].players);
   127	  let pFail = touchFailChance(speed, pressure, misalign, p.attrs.dribbling, p.attrs.positioning);
   128	  // Re-collecting your OWN pushed touch (Phase 36): the ball rolls away
   129	  // from the body, which reads as a blind-side reception to the misalign
   130	  // term — but he watched it leave his own boot. Priced well down, not
   131	  // free: overhit knock-and-runs still get away.
   132	  if (match.dribbleTouch !== null && match.dribbleTouch.gid === p.gid) pFail *= 0.45;
   133	  if (!match.rng.chance(pFail)) return true;
   134	
   135	  match.teams[p.side].stats.miscontrols++;
   136	  match.stat(p.gid).miscontrols++;
   137	  ball.lastTouch = p; // a heavy touch out of play concedes the restart
   138	  ball.vel = scale(rotate(v2(inx, iny), match.rng.range(-0.8, 0.8)), match.rng.range(3.5, 6.5));
   139	  ball.vz = 0; // the touch kills any remaining flight — the ball drops
   140	  p.kickCooldown = 0.5; // off balance — can't instantly regather
   141	  return false;
   142	}
   143	
   144	/**
   145	 * Offside judgment, frozen at kick time (Phase 29): is `target` in an
   146	 * offside position right now, as `passer` strikes the ball? Opponent half
   147	 * only; the line is the second-last defender counting the keeper, or the
   148	 * ball (the passer) if deeper; level is onside (0.2m epsilon).
   149	 */
   150	function offsideAtKick(match: Match, passer: Player, target: Player): boolean {
   151	  const team = match.teams[passer.side];
   152	  const tx = team.localX(target.pos.x);
   153	  if (tx <= 0) return false; // own half — never offside
   154	  const line = offsideLineLocalX(team, match.teams[1 - passer.side].players, team.localX(passer.pos.x));
   155	  return tx > line + 0.2;
   156	}
   157	
   158	/**
   159	 * The single funnel for pass bookkeeping (Phase 29): every delivery that
   160	 * names a target registers here, so the offside flag is judged exactly once,
   161	 * at kick time. `exempt` = the real-law dead-ball exemptions (kick-ins,
   162	 * corners, goal kicks — passed down from the restart taker's decision).
   163	 */
   164	function registerPass(match: Match, passer: Player, target: Player, exempt: boolean): void {
   165	  const offside = !exempt && offsideAtKick(match, passer, target);
   166	  // Third-man shape (Phase 34): A→B, and B bounces it FORWARD to a running
   167	  // C within a beat of receiving — flagged at the kick, credited on arrival.
   168	  const lp = match.lastCompletedPass;
   169	  const team = match.teams[passer.side];
   170	  const bounce =
   171	    lp !== null &&
   172	    lp.receiverGid === passer.gid &&
   173	    lp.passerGid !== target.gid && // back to A is a one-two, not a third man
   174	    match.simTime - lp.t < 1.5 &&
   175	    target.action.type === 'MakeRun' &&
   176	    team.localX(target.pos.x) > team.localX(passer.pos.x) + 3;
   177	  match.pendingPass = {
   178	    side: passer.side,
   179	    passerGid: passer.gid,
   180	    targetGid: target.gid,
   181	    t: match.simTime,
   182	    offside,
   183	    offsideSpot: offside ? v2(target.pos.x, target.pos.y) : null,
   184	    bounce,
   185	  };
   186	}
   187	
   188	/**
   189	 * One-touch penalty (Phase 31.9, 一脚出球): a pass struck inside the
   190	 * receiver's first-touch window (set at a pressured reception, consumed by
   191	 * any kick) sprays more — technique discounts it: tech 0.95 ≈ ×1.2, tech
   192	 * 0.5 ≈ ×1.6, tech 0.1 ≈ ×2.0. Multiplies aim noise (and loft range error).
   193	 */
   194	function oneTouchMul(p: Player): number {
   195	  return p.firstTouchWindow > 0 ? 1.15 + (1 - p.attrs.dribbling) * 0.9 : 1;
   196	}
   197	
   198	/** xG-like chance quality: distance falloff · central angle · pressure. */
   199	export function shotQuality(match: Match, p: Player): number {
   200	  const team = match.teams[p.side];
   201	  const goal = team.oppGoal();
   202	  const d = dist(p.pos, goal);
   203	  const central = 1 - clamp01(Math.abs(p.pos.y) / HALF_W) * 0.5;
   204	  const pressure = pressureAt(p.pos, match.teams[1 - p.side].players);
   205	  return clamp(0.85 * Math.exp(-d / 10) * central * (1 - pressure * 0.3), 0.01, 0.8);
   206	}
   207	
   208	/**
   209	 * The ground BENDER (Phase 71, the curve trilogy's last piece — user ask
   210	 * 弧线直塞): when a defender pinches the passing lane, a technical passer
   211	 * curls the ball AROUND his leg — the bulge leans away from the pincher
   212	 * and the arc comes back to the designed receiving point. Compensation is
   213	 * exact for grass decay (spin bleeds at 1.5/s, so the total rotation is
   214	 * ω(1−e^{−1.5T})/1.5 — half of it rotated off the launch keeps the chord
   215	 * endpoint honest). Nobody in the lane = no spin: the straight ball stays
   216	 * the default, and interceptors/deflectors meet the ARC per frame, so the
   217	 * bender beats exactly the leg it was played around. Returns the spin.
   218	 */
   219	function groundBend(
   220	  passer: Player, to: V2, opponents: Player[], d: number,
   221	): number {
   222	  const from = passer.pos;
   223	  const chord = norm(sub(to, from));
   224	  let pinch: Player | null = null;
   225	  let pinchPerp = 1.3; // a leg within reach of the straight lane
   226	  for (const o of opponents) {
   227	    if (o.sentOff) continue;
   228	    const ox = o.pos.x - from.x;
   229	    const oy = o.pos.y - from.y;
   230	    const along = ox * chord.x + oy * chord.y;
   231	    if (along < 2 || along > d - 2) continue; // passer's feet / receiver's trap
   232	    const perp = Math.abs(ox * chord.y - oy * chord.x);
   233	    if (perp < pinchPerp) {
   234	      pinchPerp = perp;
   235	      pinch = o;
   236	    }
   237	  }
   238	  if (!pinch) return 0;
   239	  // Magnitude scales with how TIGHT the pinch is — a leg 1.2m off the
   240	  // chord needs a lean, not a banana (the first cut bent every through
   241	  // ball at full whip: the last defender always stands near that chord,
   242	  // so high lines were being beaten for free — press-23's measured block
   243	  // height collapsed onto low-32's and the formations contract inverted).
   244	  const tightness = clamp(1.4 - pinchPerp, 0.3, 1);
   245	  // FLAT whip (the passing-scaled first cut inverted the skill gradient:
   246	  // better passers took BIGGER bends and paid the deviation) — the bend
   247	  // needed to clear a leg is geometry, the same for everyone; technique's
   248	  // edge lives in the weight error below.
   249	  const mag = 0.45 * tightness;
   250	  const cross = chord.x * (pinch.pos.y - from.y) - chord.y * (pinch.pos.x - from.x);
   251	  return (Math.sign(cross) || 1) * mag;
   252	}
   253	
   254	/** Kick a ground ball with bend: launch rotated half the DECAYED total
   255	 * rotation so the arc's endpoint sits where the straight aim pointed. */
   256	function bentKick(match: Match, p: Player, dir: V2, speed: number, spin: number, d: number): void {
   257	  if (spin === 0) {
   258	    match.kickBall(p, dir, speed);
   259	    return;
   260	  }
   261	  const T = -Math.log(1 - Math.min((d * BALL_FRICTION_K) / speed, 0.85)) / BALL_FRICTION_K;
   262	  const totalRot = (spin * (1 - Math.exp(-1.5 * T))) / 1.5;
   263	  // The bender's PRICE: a curled ball is harder to weight — extra launch
   264	  // noise grows with the whip and shrinks with technique. Free bending
   265	  // farmed the offside line (see groundBend's tightness note).
   266	  const weightErr = match.rng.gaussian() * Math.abs(spin) * 0.2 * (1.35 - p.attrs.passing);
   267	  match.kickBall(p, rotate(dir, -totalRot * 0.5 + weightErr), speed);
   268	  match.ball.spin = spin;
   269	}
   270	
   271	export function performPass(match: Match, passer: Player, mate: Player, offsideExempt = false): void {
   272	  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
   273	  const team = match.teams[passer.side];
   274	  const opp = match.teams[1 - passer.side];
   275	
   276	  // Playing across/against the body (Phase 27) takes pace off the ball —
   277	  // known up front, so the lead and the kick agree on the effective speed.
   278	  const misalign = kickMisalignment(passer, norm(sub(mate.pos, passer.pos)));
   279	  const powerMul = orientationPowerMul(misalign, passer.attrs.passing);
   280	
   281	  // Lead the receiver by a fraction of the expected flight time.
   282	  const flight = dist(passer.pos, mate.pos) / (16 * powerMul);
   283	  const lead = add(mate.pos, scale(mate.vel, flight * 0.8));
   284	  const d = dist(passer.pos, lead);
   285	  // d·0.55+7.5 → d·0.6+8.2 (31.6, user call 传球力度): zip beats the
   286	  // in-flight interceptors (completion 64→68%) — the receiving cost is
   287	  // priced by touchFailChance and stays mild.
   288	  const speed = clamp(d * 0.6 + 8.2, 9, 22) * powerMul;
   289	
   290	  // Accuracy: pressure sprays passes; a drilled team (passBias) and a
   291	  // technical passer tighten them; kicks against the body spray more.
   292	  const pressure = pressureAt(passer.pos, opp.players);
   293	  const aim = norm(sub(lead, passer.pos));
   294	  const noise =
   295	    match.rng.gaussian() *
   296	    (0.02 + pressure * 0.07 + d * 0.0015) *
   297	    (1.15 - team.genome.passBias * 0.3) *
   298	    (1 - team.confidence * 0.12) * // morale sharpens/frays the pass (Phase 111)
   299	    (1.25 - passer.attrs.passing * 0.5) *
   300	    oneTouchMul(passer) *
   301	    orientationNoiseMul(misalign, passer.attrs.passing);
   302	  const dir = rotate(aim, noise);
   303	
   304	  const oneTouch = passer.firstTouchWindow > 0;
   305	  // Circulation stays STRAIGHT — deliberately (Phase 70/71): the bender on
   306	  // ordinary short passes defeated exactly the lane-jumping that IS the
   307	  // pressing game, and the zonal press-23 block's measured height collapsed
   308	  // onto low-32's (the formations contract inverted; isolation-probed —
   309	  // through-ball and aerial curves alone leave it intact). Curl lives where
   310	  // football actually spends it: through balls, switches, crosses, shots.
   311	  match.lastPassKind = { kind: 'pass', t: match.simTime };
   312	  match.kickBall(passer, dir, speed);
   313	  team.stats.passes++;
   314	  if (oneTouch) team.stats.oneTouch++;
   315	  if (team.localX(mate.pos.x) - team.localX(passer.pos.x) > 2) team.stats.passesForward++;
   316	  registerPass(match, passer, mate, offsideExempt);
   317	
   318	  // 2过1 (Phase 34): a short pass played UNDER PRESSURE licenses the passer
   319	  // to burst past his marker for the return — the "go" half of the
   320	  // give-and-go. Sides that play at speed (tempo + passBias) look for it;
   321	  // slow ones take the touch and keep shape. Not from the defensive third
   322	  // (a wall pass at your own box is how counters are born).
   323	  // Window 2.3s: the round trip is ~0.7s out + the wall's touch + ~0.7s
   324	  // back — a 1.15s license expired before any return could arrive (probed).
   325	  // Attacking half only: granted from build-up, the flip bonus turned the
   326	  // midfield into a wall-pass ping-pong that ate 0.3 goals/match (probed
   327	  // against the same calibrate seeds) — the one-two is a PENETRATION device.
   328	  // The gene score is scaled by the franchise's evolved wallPassW (Phase 45)
   329	  // before the gate — appetite for the one-two is style, not a constant.
   330	  if (
   331	    passer.role !== 'GK' &&
   332	    d < 15 &&
   333	    pressure > 0.2 &&
   334	    passer.stamina > 0.3 &&
   335	    team.localX(passer.pos.x) > 0 &&
   336	    ((team.genome.tempo + team.genome.passBias) / 2) * team.policies[passer.index].wallPassW > 0.35
   337	  ) {
   338	    passer.wallRun = { until: match.simTime + 2.3, partnerGid: mate.gid };
   339	  }
   340	}
   341	
   342	/**
   343	 * Through ball (Phase 19): hit harder and led much further than a feet pass —
   344	 * into the space the runner is attacking, not to where they stand. Riskier by
   345	 * construction (longer flight, bigger lead), which is exactly the trade
   346	 * riskTolerance gates in the carrier's scoring. `lofted` (Phase 28) chips it
   347	 * over the defensive line instead — slower to arrive and harder to take down,
   348	 * but nothing on the ground can cut it out.
   349	 */
   350	export function performThroughBall(
   351	  match: Match, passer: Player, runner: Player, lofted = false, offsideExempt = false,
   352	): void {
   353	  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
   354	  const team = match.teams[passer.side];
   355	  const opp = match.teams[1 - passer.side];
   356	  const oneTouch = passer.firstTouchWindow > 0; // read before any kick consumes it
   357	
   358	  // Same body-orientation contract as performPass: effective speed known
   359	  // up front so the projected meeting point stays honest.
   360	  const misalign = kickMisalignment(passer, norm(sub(runner.pos, passer.pos)));
   361	  const powerMul = orientationPowerMul(misalign, passer.attrs.passing);
   362	
   363	  // Meet the run, not the hover (Phase 29): a runner held at the offside
   364	  // line has ~zero velocity — the delivery projects the burst they make the
   365	  // moment this kick releases the hold, instead of dropping at their feet.
   366	  const oppPlayers = match.teams[1 - passer.side].players;
   367	  if (lofted) {
   368	    const flight0 = clamp(0.55 + dist(passer.pos, runner.pos) * 0.045, 0.8, 2.0);
   369	    const lead = runBurstPoint(runner, team, oppPlayers, flight0 * 0.85);
   370	    // The dink bends away from the recovering defender (Phase 70).
   371	    const swing = aerialSwing(passer, passer.pos, lead, oppPlayers);
   372	    loftKick(match, passer, lead, 0.55, 0.045, 0.8, 2.0, 1.0, swing);
   373	    team.stats.longBalls++; // a chip is a lofted long ball too
   374	  } else {
   375	    const flight = dist(passer.pos, runner.pos) / (18 * powerMul);
   376	    // Lead FURTHER since Phase 30 (flight ×1.25, pace cap 21→24): with a
   377	    // sixth defender recovering, a ball met AT the line gets the runner
   378	    // caught before the shot — the delivery must land deep enough that the
   379	    // 17 through balls/match turn back into 1v1s (the high-xG chances the
   380	    // 30.x structures had erased: 0.38/match → 0.08 before this).
   381	    const lead = runBurstPoint(runner, team, oppPlayers, flight * 1.25);
   382	    const d = dist(passer.pos, lead);
   383	    // A touch softer since Phase 29: the ball is played into SPACE for a
   384	    // runner arriving at a sprint — friction kills it into the path, and a
   385	    // pace the runner can actually take down is what converts timed runs.
   386	    const speed = clamp(d * 0.6 + 9, 10, 24) * powerMul;
   387	
   388	    const pressure = pressureAt(passer.pos, opp.players);
   389	    const aim = norm(sub(lead, passer.pos));
   390	    const noise =
   391	      match.rng.gaussian() *
   392	      (0.025 + pressure * 0.07 + d * 0.0017) *
   393	      (1.15 - team.genome.passBias * 0.3) *
   394	    (1 - team.confidence * 0.12) * // morale sharpens/frays the pass (Phase 111)
   395	      (1.25 - passer.attrs.passing * 0.5) *
   396	      oneTouchMul(passer) *
   397	      orientationNoiseMul(misalign, passer.attrs.passing);
   398	    const dir = rotate(aim, noise);
   399	
   400	    // The bent through ball (Phase 71) — around the last defender's leg.
   401	    bentKick(match, passer, dir, speed, groundBend(passer, lead, oppPlayers, d), d);
   402	  }
   403	  team.stats.passes++;
   404	  team.stats.throughBalls++;
   405	  if (oneTouch) team.stats.oneTouch++;
   406	  if (team.localX(runner.pos.x) - team.localX(passer.pos.x) > 2) team.stats.passesForward++;
   407	  registerPass(match, passer, runner, offsideExempt);
   408	}
   409	
   410	/* ------------------------------------------------------------------ */
   411	/* The aerial game (Phase 28)                                          */
   412	/* ------------------------------------------------------------------ */
   413	
   414	/**
   415	 * Loft a ball to land at `target`: flight time grows with distance
   416	 * (tBase + m·tPerM, clamped), horizontal speed = distance/time, and the
   417	 * vertical launch is whatever brings it back down exactly at landing
   418	 * (airborne balls fly friction-free, so the projectile math is exact).
   419	 * Accuracy: direction noise like a ground pass plus a RANGE error — long
   420	 * deliveries drift short/long; technique and passBias tame both.
   421	 */
   422	function loftKick(
   423	  match: Match, p: Player, target: V2,
   424	  tBase: number, tPerM: number, tMin: number, tMax: number, noiseMul: number,
   425	  spin = 0,
   426	): void {
   427	  const team = match.teams[p.side];
   428	  const opp = match.teams[1 - p.side];
   429	  const aimDir = norm(sub(target, p.pos));
   430	  const misalign = kickMisalignment(p, aimDir);
   431	  const d = dist(p.pos, target);
   432	  const pressure = pressureAt(p.pos, opp.players);
   433	  const noise =
   434	    match.rng.gaussian() *
   435	    (0.03 + pressure * 0.05 + d * 0.0011) * noiseMul *
   436	    (1.15 - team.genome.passBias * 0.3) *
   437	    (1 - team.confidence * 0.12) * // morale sharpens/frays the pass (Phase 111)
   438	    (1.3 - p.attrs.passing * 0.55) *
   439	    oneTouchMul(p) *
   440	    orientationNoiseMul(misalign, p.attrs.passing);
   441	  const dir = rotate(aimDir, noise);
   442	  // Range error + orientation power loss both shorten/stretch the delivery.
   443	  let dEff = d * orientationPowerMul(misalign, p.attrs.passing);
   444	  dEff *= 1 + match.rng.gaussian() * (0.02 + d * 0.0008) * (1.25 - p.attrs.passing * 0.5) * oneTouchMul(p);
   445	  dEff = Math.max(dEff, 3);
   446	  const T = clamp(tBase + dEff * tPerM, tMin, tMax);
   447	  // Magnus pre-compensation (Phase 37): launch rotated −spin·T/2 so the
   448	  // ARC's chord still points where the aim did — the designed landing
   449	  // point (and the whole 31.9 corner chain) is invariant; only the path
   450	  // between bends. ballLanding() projects the same closed form.
   451	  match.lastPassKind = { kind: 'through', t: match.simTime };
   452	  match.kickBall(p, spin === 0 ? dir : rotate(dir, -spin * T * 0.5), dEff / T, (GRAVITY * T) / 2);
   453	  match.ball.spin = spin;
   454	}
   455	
   456	/**
   457	 * Cross (Phase 28): whip a lofted ball from wide toward a target arriving in
   458	 * the box, pulled a quarter of the way toward goal so deliveries drop into
   459	 * the danger area rather than at a standing man's feet. Resolved in the air:
   460	 * keeper claim or header contest (tryAerial), not a ground reception.
   461	 */
   462	export function performCross(
   463	  match: Match, crosser: Player, target: Player, offsideExempt = false, pull = 0.18, at?: V2,
   464	): void {
   465	  if (match.ball.owner !== crosser || crosser.kickCooldown > 0) return;
   466	  const team = match.teams[crosser.side];
   467	  const flight0 = clamp(0.5 + dist(crosser.pos, at ?? target.pos) * 0.038, 0.7, 1.7);
   468	  // Corner routines pass `at` (Phase 31.9): the delivery attacks the
   469	  // routine's KEY ZONE and the crasher times his burst onto it. Open play
   470	  // (Phase 63) leads a MEETABLE fraction of the target's run, capped —
   471	  // the full vel·flight lead was the same 31.9 bug in open-play clothes
   472	  // (constants.ts has the anatomy numbers).
   473	  let leadX = target.vel.x * flight0 * CROSS_LEAD_FRAC;
   474	  let leadY = target.vel.y * flight0 * CROSS_LEAD_FRAC;
   475	  const leadLen = Math.hypot(leadX, leadY);
   476	  if (leadLen > CROSS_LEAD_MAX) {
   477	    leadX *= CROSS_LEAD_MAX / leadLen;
   478	    leadY *= CROSS_LEAD_MAX / leadLen;
   479	  }
   480	  const arrive = at ?? v2(target.pos.x + leadX, target.pos.y + leadY);
   481	  const goal = team.oppGoal();
   482	  // Pulled toward goal, but NOT into the six-yard area — a delivery that
   483	  // drops on the keeper's claim radius is a delivery wasted (28.1: this
   484	  // pull was 0.25 and fed the keeper instead of the penalty spot).
   485	  // Corner routines pass a SMALLER pull (Phase 31): the marker stands
   486	  // goal-side of the crasher by construction, so pulling the drop toward
   487	  // goal handed every corner duel to the defence (probed: attackers won
   488	  // 0.00 duels/corner) — the routine delivery meets the RUN instead.
   489	  const spot = v2(arrive.x + (goal.x - arrive.x) * pull, arrive.y + (goal.y - arrive.y) * pull);
   490	  const oneTouch = crosser.firstTouchWindow > 0;
   491	  // The whipped delivery (Phase 37): crosses and corners curl TOWARD the
   492	  // goal — the inswinger. Sign from the chord×to-goal cross product;
   493	  // technique whips harder. (The landing point is pre-compensated in
   494	  // loftKick, so the 31.9 corner chain sees the same scatter.)
   495	  const chord = norm(sub(spot, crosser.pos));
   496	  const toGoal = norm(sub(goal, crosser.pos));
   497	  const swing = Math.sign(chord.x * toGoal.y - chord.y * toGoal.x) || 1;
   498	  const spin = swing * (0.28 + crosser.attrs.passing * 0.3);
   499	  loftKick(match, crosser, spot, 0.5, 0.038, 0.7, 1.7, 1.1, spin);
   500	  team.stats.passes++;
   501	  team.stats.crosses++;
   502	  if (oneTouch) team.stats.oneTouch++;
   503	  if (team.localX(target.pos.x) - team.localX(crosser.pos.x) > 2) team.stats.passesForward++;
   504	  registerPass(match, crosser, target, offsideExempt);
   505	}
   506	
   507	/**
   508	 * Keeper throw (Phase 28.3): an ACCURATE hand distribution — flat, quick,
   509	 * half the noise of a kicked ball, 8–30m. This is what a keeper who held
   510	 * the ball does instead of hoofing 50/50s: find a body, hit the body.
   511	 */
   512	export function performKeeperThrow(match: Match, gk: Player, mate: Player): void {
   513	  if (match.ball.owner !== gk || gk.kickCooldown > 0) return;
   514	  const team = match.teams[gk.side];
   515	  const flight0 = clamp(0.5 + dist(gk.pos, mate.pos) * 0.03, 0.7, 1.4);
   516	  const lead = add(mate.pos, scale(mate.vel, flight0 * 0.7));
   517	  loftKick(match, gk, lead, 0.5, 0.03, 0.7, 1.4, 0.45);
   518	  team.stats.passes++;
   519	  if (team.localX(mate.pos.x) - team.localX(gk.pos.x) > 2) team.stats.passesForward++;
   520	  registerPass(match, gk, mate, false); // a hand throw is regular play — offside applies
   521	}
   522	
   523	/**
   524	 * Cutback (Phase 31): the byline pull-back — a HARD, flat ball driven from
   525	 * the touchline zone to the edge-of-box arc, where the licensed arriver
   526	 * meets it first-time (giveBall's snap-decision window). Faster than a
   527	 * regular pass at the same range so it beats the box defenders' recovery
   528	 * slide across; registered like any pass (interceptions, assists and the
   529	 * offside judgment all apply — the arriver runs from DEEP, so flags are
   530	 * rare by construction).
   531	 */
   532	export function performCutback(match: Match, passer: Player, mate: Player): void {
   533	  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
   534	  const team = match.teams[passer.side];
   535	  const misalign = kickMisalignment(passer, norm(sub(mate.pos, passer.pos)));
   536	  const powerMul = orientationPowerMul(misalign, passer.attrs.passing);
   537	  const flight = dist(passer.pos, mate.pos) / (18 * powerMul);
   538	  const lead = add(mate.pos, scale(mate.vel, flight * 0.8));
   539	  const d = dist(passer.pos, lead);
   540	  const speed = clamp(d * 0.6 + 10, 11, 23) * powerMul;
   541	  const pressure = pressureAt(passer.pos, match.teams[1 - passer.side].players);
   542	  const aim = norm(sub(lead, passer.pos));
   543	  const noise =
   544	    match.rng.gaussian() *
   545	    (0.02 + pressure * 0.06 + d * 0.0012) *
   546	    (1.15 - team.genome.passBias * 0.3) *
   547	    (1 - team.confidence * 0.12) * // morale sharpens/frays the pass (Phase 111)
   548	    (1.25 - passer.attrs.passing * 0.5) *
   549	    oneTouchMul(passer) *
   550	    orientationNoiseMul(misalign, passer.attrs.passing);
   551	  const oneTouch = passer.firstTouchWindow > 0;
   552	  match.lastPassKind = { kind: 'cross', t: match.simTime };
   553	  match.kickBall(passer, rotate(aim, noise), speed);
   554	  team.stats.passes++;
   555	  team.stats.cutbacks++;
   556	  if (oneTouch) team.stats.oneTouch++;
   557	  match.lastCutback = { side: passer.side, t: match.simTime };
   558	  registerPass(match, passer, mate, false);
   559	}
   560	
   561	/**
   562	 * Lofted switch (Phase 28): the big diagonal — a 25m+ ball over the press to
   563	 * a receiver in space. What the 32m ground-pass penalty used to suppress.
   564	 */
   565	/**
   566	 * The curled DELIVERY's swing (Phase 70, user ask 弧线长传 — the second of
   567	 * the curve trilogy): a lofted ball bends its BULGE away from the nearest
   568	 * threat to the landing zone (the recovering defender chases a flight that
   569	 * leans out of his line), or a gentle outswing toward the flank when the
   570	 * drop is clean. Technique whips harder; the landing point itself is
   571	 * pre-compensated inside loftKick, so completion changes only through the
   572	 * geometry of who can meet the ARC — never through a moved drop.
   573	 */
   574	function aerialSwing(passer: Player, from: V2, landing: V2, opponents: Player[]): number {
   575	  const chord = norm(sub(landing, from));
   576	  let threat: Player | null = null;
   577	  let best = 8; // only a defender who can actually work the drop zone
   578	  for (const o of opponents) {
   579	    if (o.sentOff) continue;
   580	    const d = dist(o.pos, landing);
   581	    if (d < best) {
   582	      best = d;
   583	      threat = o;
   584	    }
   585	  }
   586	  const mag = 0.12 + passer.attrs.passing * 0.18;
   587	  if (threat) {
   588	    const cross = chord.x * (threat.pos.y - from.y) - chord.y * (threat.pos.x - from.x);
   589	    return (Math.sign(cross) || 1) * mag;
   590	  }
   591	  // Clean drop: swing away from the pitch's center line — the outswinger
   592	  // a wide receiver runs onto without breaking stride.
   593	  const midY = (from.y + landing.y) / 2;
   594	  const cross = chord.x * (0 - midY);
   595	  return (Math.sign(cross) || 1) * mag * 0.6;
   596	}
   597	
   598	export function performLoftedPass(match: Match, passer: Player, mate: Player, offsideExempt = false): void {
   599	  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
   600	  const team = match.teams[passer.side];
   601	  // Driven, not floated (Phase 30.5): at the old 0.8+d·0.045 a 30m switch
   602	  // hung 2.15s — any defender within ~12m of the drop reached it, and the
   603	  // receiving WINGER is the worst header in the game (AERIAL_ROLE 0.06 vs
   604	  // DF 0.3), so the diagonal completed ~20% and wing play starved. A flat
   605	  // 1.4–1.6s ball reaches the flank before the fullback does.
   606	  const flight0 = clamp(0.55 + dist(passer.pos, mate.pos) * 0.033, 1.1, 2.1);
   607	  const lead = add(mate.pos, scale(mate.vel, flight0 * 0.7));
   608	  const oneTouch = passer.firstTouchWindow > 0;
   609	  // The switch swings (Phase 70) — bulge away from whoever works the drop.
   610	  const swing = aerialSwing(passer, passer.pos, lead, match.teams[1 - passer.side].players);
   611	  loftKick(match, passer, lead, 0.55, 0.033, 1.1, 2.1, 0.9, swing);
   612	  team.stats.passes++;
   613	  team.stats.longBalls++;
   614	  if (oneTouch) team.stats.oneTouch++;
   615	  if (team.localX(mate.pos.x) - team.localX(passer.pos.x) > 2) team.stats.passesForward++;
   616	  registerPass(match, passer, mate, offsideExempt);
   617	}
   618	
   619	/** Aerial presence by role: centre-backs and strikers attack the ball. */
   620	const AERIAL_ROLE: Record<Role, number> = { GK: 0, DF: 0.3, MF: 0.14, WG: 0.06, ST: 0.26 };
   621	
   622	/**
   623	 * How good this player is in the air — the same formula the header contest
   624	 * rolls against, so cross targeting (PlayerBrain) and duel resolution agree.
   625	 *
   626	 * Phase 63 (the target-man gradient): STRENGTH owns the air. The old
   627	 * weights (defending 0.3, strength 0.1) made the classic big-man
   628	 * investment invisible — +0.45 strength bought +0.045 of duel score
   629	 * against a 0-0.45 random roll, and the probe showed a budget-neutral
   630	 * target man changing NOTHING about cross outcomes. Now strength 0.3 /
   631	 * defending 0.15: the aerial payoff phase-47 assigned to strength is
   632	 * real, and the COUNTER is evolvable the same way — a back line that
   633	 * buys strength out-jumps the big man (the tall-CB answer).
   634	 */
   635	export function aerialSense(p: Player): number {
   636	  return AERIAL_ROLE[p.role] + p.attrs.defending * 0.15 + p.attrs.strength * 0.3;
   637	}
   638	
   639	/**
   640	 * Resolve a ball flying through the contest band (Phase 28). Keepers first —
   641	 * hands beat heads: a keeper under the ball claims it (crowd pressure and
   642	 * reflexes decide). Then outfielders within reach jump: position + role
   643	 * aerial sense + attributes pick the winner, who heads for goal in the
   644	 * opponent box, powers it clear near their own, or cushions it to a teammate.
   645	 * `order` alternates per step (the same fairness contract as tryCapture).
   646	 */
   647	export function tryAerial(match: Match, order: Player[]): void {
   648	  const ball = match.ball;
   649	  if (ball.z < HEADER_MIN_HEIGHT || ball.z > GK_CLAIM_HEIGHT) return;
   650	
   651	  for (const gk of order) {
   652	    if (gk.role !== 'GK' || gk.sentOff || gk.stunTimer > 0 || gk.tackleCooldown > 0) continue;
   653	    // Hands only inside the box (Phase 28.5): a keeper stranded off his line
   654	    // can't PLUCK a high ball out of the air — outside his area the delivery
   655	    // is an outfield header contest, not a keeper claim.
   656	    if (!match.inPenaltyBox(gk.pos, gk.side)) continue;
   657	    const dx = gk.pos.x - ball.pos.x;
   658	    const dy = gk.pos.y - ball.pos.y;
   659	    if (dx * dx + dy * dy > 1.9 * 1.9) continue;
   660	    // Committed to the jump either way (pickup stays free). 0.5 → 0.9 in
   661	    // 29.1: a ball hanging/bouncing through the claim band re-rolled every
   662	    // half second, and the restarting dive pose read as convulsions.
   663	    gk.tackleCooldown = 0.9;
   664	    gk.saveAnimTimer = 0.6;
   665	    const crowd = pressureAt(gk.pos, match.teams[1 - gk.side].players);
   666	    const pClaim = clamp(0.62 + (gk.attrs.reflexes - 0.5) * 0.5 - crowd * 0.3, 0.2, 0.9);
   667	    if (match.rng.chance(pClaim)) {
   668	      // A claimed opponent shot is a save (a dropping header, typically).
   669	      const shot = match.pendingShot;
   670	      if (shot && !shot.resolved && shot.side !== gk.side) {
   671	        shot.resolved = true;
   672	        match.teams[shot.side].stats.shotsOnTarget++;
   673	        match.teams[gk.side].stats.saves++;
   674	        match.stat(gk.gid).saves++;
   675	        match.markShotOutcome('saved');
   676	      }
   677	      match.pushEvent('save', gk.side, `${gk.name} claims the high ball`);
   678	      match.giveBall(gk);
   679	      return;
   680	    }
   681	    // Flapped at it under pressure — the ball sails on.
   682	  }
   683	
   684	  if (ball.z > HEADER_MAX_HEIGHT) return;
   685	  // Chest / thigh trap (Phase 28.6): before anyone HEADS a hanging ball,
   686	  // an unpressured man under a dropping ball in the lower band takes it DOWN.
   687	  if (tryChestTrap(match, order)) return;
   688	  let winner: Player | null = null;
   689	  let best = -Infinity;
   690	  const contenders: Player[] = [];
   691	  for (const p of order) {
   692	    if (p.role === 'GK' || p.sentOff || p.stunTimer > 0 || p.kickCooldown > 0) continue;
   693	    const dx = p.pos.x - ball.pos.x;
   694	    const dy = p.pos.y - ball.pos.y;
   695	    const d2 = dx * dx + dy * dy;
   696	    if (d2 > HEADER_RADIUS * HEADER_RADIUS) continue;
   697	    contenders.push(p);
   698	    // Position + aerial sense + a seeded jump-timing roll pick the winner.
   699	    // Attackers meeting a delivery in the opponent box arrive with momentum
   700	    // — a real edge over the defender jumping from a standing start. Raised

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/sim/mechanics.ts | sed -n '690,1030p'; nl -ba src/sim/mechanics.ts | sed -n '1031,1305p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
   690	  const contenders: Player[] = [];
   691	  for (const p of order) {
   692	    if (p.role === 'GK' || p.sentOff || p.stunTimer > 0 || p.kickCooldown > 0) continue;
   693	    const dx = p.pos.x - ball.pos.x;
   694	    const dy = p.pos.y - ball.pos.y;
   695	    const d2 = dx * dx + dy * dy;
   696	    if (d2 > HEADER_RADIUS * HEADER_RADIUS) continue;
   697	    contenders.push(p);
   698	    // Position + aerial sense + a seeded jump-timing roll pick the winner.
   699	    // Attackers meeting a delivery in the opponent box arrive with momentum
   700	    // — a real edge over the defender jumping from a standing start. Raised
   701	    // 0.12 → 0.2 in 29.1: un-marking the corner taker freed a defender to
   702	    // mark in the box (3v3, everyone tracked) and corner threat collapsed
   703	    // to 3.5% — the crasher's running jump is what beats a set marker.
   704	    // 0.2 → 0.3 (Phase 31): with routine deliveries finally meeting the
   705	  // crashers' runs, the running jump's edge over the goal-side marker's
   706	  // standing start is what wins the zone — at 0.2 the position term still
   707	  // handed every corner duel to the defence.
   708	  const attacking = match.teams[p.side].localX(ball.pos.x) > HALF_L - BOX_DEPTH ? 0.3 : 0;
   709	    const s =
   710	      aerialSense(p) +
   711	      attacking +
   712	      (1 - Math.sqrt(d2) / HEADER_RADIUS) * 0.35 +
   713	      match.rng.range(0, 0.45);
   714	    if (s > best) {
   715	      best = s;
   716	      winner = p;
   717	    }
   718	  }
   719	  if (!winner) return;
   720	  // Let it DROP for the chest trap (Phase 28.6): a player with TIME and SPACE
   721	  // shouldn't nod a dropping midfield ball on — that header is exactly what
   722	  // kept the aerial rally alive. If nobody's contesting (no opponent within
   723	  // header reach), the ball is falling (vz < 0), and it's neither a header
   724	  // chance on goal nor a clearance near our own, decline the header and let
   725	  // it come down — `tryChestTrap` takes it to the feet a few steps later (or
   726	  // it just lands and is controlled on the ground). Attacking free headers
   727	  // and defensive clears are UNCHANGED (they fall outside the gate).
   728	  const wteam = match.teams[winner.side];
   729	  const dOppGoal = dist(ball.pos, wteam.oppGoal());
   730	  const nearOwnGoal = dist(ball.pos, wteam.ownGoal()) < 20;
   731	  let oppNear = false;
   732	  for (const o of match.teams[1 - winner.side].players) {
   733	    if (o.sentOff || o.role === 'GK') continue;
   734	    if (dist(o.pos, ball.pos) < HEADER_RADIUS) { oppNear = true; break; }
   735	  }
   736	  if (!oppNear && ball.vz < 0 && dOppGoal >= 16.5 && !nearOwnGoal) return;
   737	  // Committed to the header — every contender jumped (brief recovery so a
   738	  // ball hanging through the band doesn't re-roll into a convulsion).
   739	  for (const p of contenders) {
   740	    p.kickCooldown = 0.45;
   741	    p.headerAnimTimer = 0.55;
   742	  }
   743	  // Offside (Phase 29): the flagged target meeting the delivery in the air
   744	  // IS the touch that completes the offence — whistle instead of the header.
   745	  const pass = match.pendingPass;
   746	  if (pass && pass.offside && winner.side === pass.side && winner.gid === pass.targetGid) {
   747	    match.pendingPass = null;
   748	    match.callOffside(winner, pass.offsideSpot ?? winner.pos);
   749	    return;
   750	  }
   751	  headBall(match, winner);
   752	}
   753	
   754	/** What the header winner does with it — shot, clearance or knockdown. */
   755	function headBall(match: Match, p: Player): void {
   756	  const ball = match.ball;
   757	  const team = match.teams[p.side];
   758	  ball.lastTouch = p;
   759	  team.stats.headersWon++;
   760	
   761	  // Delivery bookkeeping: a teammate's cross/loft met in the air is a
   762	  // completed pass (assist credit if the header goes in); an opponent's
   763	  // delivery headed away is an interception.
   764	  const pass = match.pendingPass;
   765	  if (pass && pass.side === p.side && pass.passerGid !== p.gid) {
   766	    team.stats.passesCompleted++;
   767	    match.lastCompletedPass = { passerGid: pass.passerGid, receiverGid: p.gid, t: match.simTime };
   768	  } else if (pass && pass.side !== p.side) {
   769	    team.stats.interceptions++;
   770	    match.stat(p.gid).recoveries++;
   771	  }
   772	  match.pendingPass = null;
   773	
   774	  const dGoal = dist(ball.pos, team.oppGoal());
   775	  if (dGoal < 16.5) {
   776	    performHeaderShot(match, p);
   777	    return;
   778	  }
   779	  if (dist(ball.pos, team.ownGoal()) < 20) {
   780	    // Defensive header: power it away from goal, high and wide.
   781	    const dir = norm(v2(team.attackDir, match.rng.range(-0.9, 0.9)));
   782	    ball.vel = scale(dir, match.rng.range(11, 15));
   783	    ball.vz = match.rng.range(3.5, 5.2);
   784	    team.stats.clearances++;
   785	    return;
   786	  }
   787	  // Knockdown: cushion it toward the best-placed teammate in range.
   788	  let mate: Player | null = null;
   789	  let bestS = -Infinity;
   790	  for (const q of team.players) {
   791	    if (q === p || q.sentOff) continue;
   792	    const d = dist(q.pos, ball.pos);
   793	    if (d > 16) continue;
   794	    const s = opennessOf(q, match.teams[1 - p.side].players) - (d / 16) * 0.4;
   795	    if (s > bestS) {
   796	      bestS = s;
   797	      mate = q;
   798	    }
   799	  }
   800	  const to = mate ? norm(sub(mate.pos, ball.pos)) : v2(team.attackDir, 0);
   801	  ball.vel = scale(to, match.rng.range(7, 9.5));
   802	  ball.vz = 0.8; // nodded down — drops quickly to feet
   803	}
   804	
   805	/**
   806	 * Chest / thigh trap (Phase 28.6, user report "球在两个球员之间弹来弹去 —
   807	 * 是不是没有胸部停球"). A ball DROPPING through the lower header band that no
   808	 * opponent is contesting can be CUSHIONED to the feet instead of headed — the
   809	 * missing alternative that turned every hanging ball into an endless nod-it-
   810	 * back-and-forth rally. Only the man almost directly under it, only a
   811	 * descending/apex ball below chest height, only when it is NOT a live aerial
   812	 * duel (an opponent within header reach = head it, as before). The take-down
   813	 * is priced by first-touch (same `touchFailChance` surface as a ground
   814	 * reception, +a small aerial malus) and SPILLS under pressure — a failed trap
   815	 * drops the ball loose, so the scramble is preserved, just not perpetual.
   816	 * Returns true if the trap fired (clean OR spilled); the caller then skips the
   817	 * header contest for this step.
   818	 */
   819	function tryChestTrap(match: Match, order: Player[]): boolean {
   820	  const ball = match.ball;
   821	  if (ball.z > CHEST_TRAP_MAX_HEIGHT || ball.vz > CHEST_TRAP_MAX_VZ) return false;
   822	  // The man almost directly under it (tighter than a header reach).
   823	  let trapper: Player | null = null;
   824	  let bestD = CHEST_TRAP_RADIUS;
   825	  for (const p of order) {
   826	    if (p.role === 'GK' || p.sentOff || p.stunTimer > 0 || p.kickCooldown > 0) continue;
   827	    const d = dist(p.pos, ball.pos);
   828	    if (d < bestD) {
   829	      bestD = d;
   830	      trapper = p;
   831	    }
   832	  }
   833	  if (!trapper) return false;
   834	  // A contested ball is an aerial DUEL — let it be headed (unchanged).
   835	  for (const o of match.teams[1 - trapper.side].players) {
   836	    if (o.sentOff || o.role === 'GK') continue;
   837	    if (dist(o.pos, ball.pos) < HEADER_RADIUS) return false;
   838	  }
   839	  // Price the cushion: drop speed (vz counts, like a ground first touch),
   840	  // pressure, and taking it on the blind side; technique tames all of it.
   841	  const hSpeed = Math.max(len(ball.vel), 1e-6);
   842	  const inx = ball.vel.x / hSpeed;
   843	  const iny = ball.vel.y / hSpeed;
   844	  const speed = len(ball.vel) + Math.abs(ball.vz) * 0.6;
   845	  const misalign = (1 + (inx * trapper.heading.x + iny * trapper.heading.y)) / 2;
   846	  const pressure = pressureAt(trapper.pos, match.teams[1 - trapper.side].players);
   847	  const pFail = clamp(
   848	    touchFailChance(speed, pressure, misalign, trapper.attrs.dribbling, trapper.attrs.positioning) + 0.05, 0, 0.5,
   849	  );
   850	  trapper.kickCooldown = 0.3; // committed to the touch either way
   851	  if (!match.rng.chance(pFail)) {
   852	    match.giveBall(trapper); // clean take-down: giveBall snaps it dead to feet + does pass/offside bookkeeping
   853	    return true;
   854	  }
   855	  // Spilled the cushion — a heavy touch knocks it loose and low (the scramble).
   856	  match.teams[trapper.side].stats.miscontrols++;
   857	  match.stat(trapper.gid).miscontrols++;
   858	  ball.lastTouch = trapper;
   859	  ball.vel = scale(rotate(v2(inx, iny), match.rng.range(-0.9, 0.9)), match.rng.range(3, 5.5));
   860	  ball.vz = 0; // knocked down — it drops
   861	  return true;
   862	}
   863	
   864	/**
   865	 * Headed shot: meeting a cross in the box. Converts worse than feet (tight
   866	 * distance falloff, capped quality) and sprays more, but arrives from the
   867	 * exact spot defenders least want — the same pendingShot machinery as
   868	 * performShot, difficulty frozen at contact.
   869	 */
   870	function performHeaderShot(match: Match, shooter: Player): void {
   871	  match.endPassMove(shooter.side); // the header ends the move (Phase 33)
   872	  const team = match.teams[shooter.side];
   873	  const opp = match.teams[1 - shooter.side];
   874	  const gk = opp.goalkeeper;
   875	  const ball = match.ball;
   876	
   877	  const goalX = team.attackDir * HALF_L;
   878	  const aimMargin = 1.6 - shooter.attrs.finishing * 0.8;
   879	  const aimY = (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin);
   880	  const target = v2(goalX, aimY);
   881	  const d = dist(ball.pos, target);
   882	  const pressure = pressureAt(shooter.pos, opp.players);
   883	  const central = 1 - clamp01(Math.abs(ball.pos.y) / HALF_W) * 0.5;
   884	  const q = clamp(0.5 * Math.exp(-d / 8.5) * central * (1 - pressure * 0.25), 0.01, 0.45);
   885	
   886	  const aim = norm(sub(target, ball.pos));
   887	  const spread = (0.05 + d * 0.004 + pressure * 0.04) * (1.35 - shooter.attrs.finishing * 0.65);
   888	  const dir = rotate(aim, match.rng.gaussian() * spread);
   889	  ball.vel = scale(dir, 15 + shooter.attrs.finishing * 4);
   890	  ball.vz = -1.2; // headed down toward the goal
   891	
   892	  team.stats.shots++;
   893	  team.stats.xg += q;
   894	  match.stat(shooter.gid).shots++;
   895	
   896	  const difficulty = diveDifficulty(ball.pos, dir, gk, opp);
   897	  const lp = match.lastCompletedPass;
   898	  const assistGid =
   899	    lp && lp.receiverGid === shooter.gid && match.simTime - lp.t < 3 ? lp.passerGid : null;
   900	
   901	  match.markShotOutcome('miss');
   902	  match.shotLog.push({
   903	    t: match.simTime, minute: match.minute(), side: shooter.side, xg: q, outcome: 'pending',
   904	    blockers: laneBlockers(ball.pos, team.oppGoal(), opp.players),
   905	    channel: match.goalChannelFor(shooter),
   906	  });
   907	  match.pendingShot = {
   908	    side: shooter.side,
   909	    shooterGid: shooter.gid,
   910	    closeIn: clamp01((7 - dist(gk.pos, shooter.pos)) / 7),
   911	    coverage: angleCoverage(gk, shooter.pos, team.oppGoal()),
   912	    xg: q,
   913	    t: match.simTime,
   914	    resolved: false,
   915	    logIndex: match.shotLog.length - 1,
   916	    difficulty,
   917	    assistGid,
   918	  };
   919	  if (assistGid !== null) {
   920	    team.stats.keyPasses++;
   921	    const passer = match.allPlayers[assistGid];
   922	    if (passer) match.pushEvent('keypass', shooter.side, `${passer.name} with the delivery`);
   923	  }
   924	  match.pushEvent('shot', shooter.side, `${shooter.name} heads it at goal! (xG ${q.toFixed(2)})`);
   925	}
   926	
   927	/** Attacked-goal center for a shooter's team (helper for 1v1 detection). */
   928	function goalCenterFor(team: { oppGoal(): V2 }): V2 {
   929	  return team.oppGoal();
   930	}
   931	
   932	/**
   933	 * The CHIP (Phase 69): loft the finish over a keeper who has left his
   934	 * line, dropping under the bar behind him. Mirrors the free kick's
   935	 * two-constraint closed form — z ≥ the claim ceiling as it passes the
   936	 * keeper (tryKeeperSave cannot touch a ball above GK_CLAIM_HEIGHT),
   937	 * z = the drawn arrival height as it crosses the line (over the bar =
   938	 * the classic overhit, exactly like the FK's blaze-over). The counters
   939	 * are all emergent: a keeper IN THE FACE smothers the launch while it's
   940	 * still low (the save window before z clears 2.55), a keeper at home
   941	 * leaves no gap (feasibility fails), a floaty lob is rejected up front
   942	 * (hang time returns the line), and a short chip drops into the claim.
   943	 * Returns true when the chip replaced the ground strike.
   944	 */
   945	function tryChip(match: Match, shooter: Player, qGround: number, pressure: number): boolean {
   946	  const team = match.teams[shooter.side];
   947	  const opp = match.teams[1 - shooter.side];
   948	  const gk = opp.goalkeeper;
   949	  if (gk.sentOff) return false;
   950	  const goalX = team.attackDir * HALF_L;
   951	  // Cross the line off-center, away from the keeper's side — the open half.
   952	  // Geometry from the SHOOTER (the ground path's convention): the carried
   953	  // ball rides at his feet and kickBall re-bases the release at his body.
   954	  const target = v2(goalX, (gk.pos.y >= 0 ? -1 : 1) * 1.4);
   955	  const d = dist(shooter.pos, target);
   956	  if (d < 7 || d > 30) return false; // not a toe-poke, not a halfway lob
   957	  const aim = norm(sub(target, shooter.pos));
   958	  const toGkX = gk.pos.x - shooter.pos.x;
   959	  const toGkY = gk.pos.y - shooter.pos.y;
   960	  const along = toGkX * aim.x + toGkY * aim.y;
   961	  // The keeper must sit ON the chord with real space BEHIND him; a keeper
   962	  // in the shooter's face is the smother's problem, not the solver's.
   963	  if (along < 2.5 || along > d - 5.5) return false;
   964	  if (Math.abs(toGkX * aim.y - toGkY * aim.x) > 3.5) return false;
   965	  // CAUGHT OUT, not merely positioned (first probe: the routine line at
   966	  // KA 0.5 fired 3.9 chips/match — a lob festival): the chip demands the
   967	  // keeper genuinely stranded, ≥7.5m off his goal center. The sweeper's
   968	  // rushes and the high line (keeperAggression) are what put him there.
   969	  const og = opp.ownGoal();
   970	  if (Math.hypot(gk.pos.x - og.x, gk.pos.y - og.y) < 7.5) return false;
   971	
   972	  // Feasibility + price at the NOMINAL arrival (rng only spends on a
   973	  // taken chip, so untaken chips leave every other shot's stream alone).
   974	  const a = clamp(along / d, 0.15, 0.8);
   975	  const clearK = GK_CLAIM_HEIGHT + 0.25;
   976	  const t2Nom = (clearK - a * 1.3) / ((GRAVITY / 2) * a * (1 - a));
   977	  if (t2Nom <= 0) return false;
   978	  const tNom = Math.sqrt(t2Nom);
   979	  if (tNom > 1.45) return false; // hang time hands the keeper his line back
   980	  const qChip = clamp(
   981	    0.36 - (tNom - 0.9) * 0.22 - pressure * 0.12 + shooter.attrs.finishing * 0.06,
   982	    0.03, 0.38,
   983	  );
   984	  // Clearly better or nothing — a marginal chip is a shot wasted on
   985	  // spectacle (the volume gate that keeps the lob an EVENT).
   986	  if (qChip < qGround * 1.2 + 0.03) return false;
   987	
   988	  // Execute: the arrival height draws high (over-bar = the honest miss),
   989	  // finishing narrows the draw AND the lateral spray.
   990	  const zg = 0.8 + match.rng.range(0, 1.9 - shooter.attrs.finishing * 0.5);
   991	  const T = Math.sqrt(Math.max(0.4, (clearK - a * zg) / ((GRAVITY / 2) * a * (1 - a))));
   992	  const vz = (zg + (GRAVITY / 2) * T * T) / T;
   993	  const misalign = kickMisalignment(shooter, aim);
   994	  const spread =
   995	    (0.03 + d * 0.0012) * (1.3 - shooter.attrs.finishing * 0.6) *
   996	    orientationNoiseMul(misalign, shooter.attrs.dribbling);
   997	  const dir = rotate(aim, match.rng.gaussian() * spread);
   998	  match.lastPassKind = { kind: 'lofted', t: match.simTime };
   999	  match.kickBall(shooter, dir, d / T, vz);
  1000	
  1001	  team.stats.shots++;
  1002	  team.stats.xg += qChip;
  1003	  match.stat(shooter.gid).shots++;
  1004	  const lp = match.lastCompletedPass;
  1005	  const assistGid =
  1006	    lp && lp.receiverGid === shooter.gid && match.simTime - lp.t < 3 ? lp.passerGid : null;
  1007	  match.markShotOutcome('miss'); // close out any still-pending previous shot
  1008	  match.shotLog.push({
  1009	    t: match.simTime, minute: match.minute(), side: shooter.side, xg: qChip, outcome: 'pending',
  1010	    blockers: laneBlockers(shooter.pos, goalCenterFor(team), opp.players),
  1011	    chip: true,
  1012	    channel: match.goalChannelFor(shooter),
  1013	  });
  1014	  match.pendingShot = {
  1015	    side: shooter.side,
  1016	    shooterGid: shooter.gid,
  1017	    xg: qChip,
  1018	    t: match.simTime,
  1019	    resolved: false,
  1020	    logIndex: match.shotLog.length - 1,
  1021	    // A keeper scrambling BACK under a dropping ball saves awkwardly.
  1022	    difficulty: 0.8,
  1023	    assistGid,
  1024	  };
  1025	  match.pushEvent('shot', shooter.side, `${shooter.name} chips the keeper! (xG ${qChip.toFixed(2)})`);
  1026	  return true;
  1027	}
  1028	
  1029	export function performShot(match: Match, shooter: Player): void {
  1030	  if (match.ball.owner !== shooter || shooter.kickCooldown > 0) return;
  1031	  match.endPassMove(shooter.side); // a strike ends the passing move (Phase 33)
  1032	  const team = match.teams[shooter.side];
  1033	  const opp = match.teams[1 - shooter.side];
  1034	  const gk = opp.goalkeeper;
  1035	
  1036	  // Aim for the corner away from the keeper. Finishing has two channels:
  1037	  // confident finishers aim closer to the post (bigger keeper-evasion, riskier
  1038	  // margin) AND group their shots tighter.
  1039	  const goalX = team.attackDir * HALF_L;
  1040	  // 1.5 → 1.2 in Phase 30.4 (dare the corners), → 1.3 in Phase 31's
  1041	  // retune: with chance volume restored (open runs, cutbacks, routines)
  1042	  // the trade flips back toward failure mode 16a — a slightly safer aim
  1043	  // keeps more strikes on the frame while the keeper still can't reach
  1044	  // the corner.
  1045	  // The clinical trait (Phase 39) shaves another 0.1 off the post —
  1046	  // floored at 0.4 (the base formula's own minimum at finishing 1.0):
  1047	  // an elite finisher who ALSO shaved 0.1 aimed past the optimum and
  1048	  // converted less (caught by the finishing-conversion invariant test).
  1049	  // Finishing slope 0.9 → 0.6 (Phase 47): the eras of churn since 31.5
  1050	  // (36.1 carries, 38 contact, 46 keeper envelope) had pushed the corner
  1051	  // dare past its optimum again — by phase-46 the hi-fin conversion edge
  1052	  // measured +1.3pp ≈ noise and the invariant test finally flipped.
  1053	  // Swept {0.9, 0.75, 0.6, 0.5} at 540 matches: 0.6 restores +2.1pp
  1054	  // (hi 28.9% vs lo 26.8%) — the finisher backs off the post just enough
  1055	  // that the tight grouping cashes.
  1056	  const aimMargin = Math.max(
  1057	    0.4,
  1058	    1.3 - shooter.attrs.finishing * 0.6 - (shooter.traits.includes('clinical') ? 0.1 : 0),
  1059	  );
  1060	  const aimY = (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin);
  1061	  const target = v2(goalX, aimY);
  1062	
  1063	  const q = shotQuality(match, shooter);
  1064	  const d = dist(shooter.pos, target);
  1065	  const pressure = pressureAt(shooter.pos, opp.players);
  1066	  // CONTESTED FINISHING (Phase 85, the inflation fix the user chose):
  1067	  // pressureAt is distance-only — a 0.9-defending stopper closing on the
  1068	  // strike degraded it exactly like a statue, so defense had NO evolvable
  1069	  // gradient at the conversion point and late leagues converted 58-77% of
  1070	  // all shots (phase-84 anatomy). The nearest closing OUTFIELDER's quality
  1071	  // now scales the pressure the strike feels: ×1.0 at defending 0.5
  1072	  // (early-gen behavior preserved by construction), ×0.55 vs a statue,
  1073	  // ×1.45 vs a master. The xG model stays blind to defender quality —
  1074	  // like real xG — so evolved defending shows up as UNDER-performance.
  1075	  let contest = pressure;
  1076	  if (pressure > 0) {
  1077	    let bestD = Infinity;
  1078	    let presser: Player | null = null;
  1079	    for (const o of opp.players) {
  1080	      if (o.sentOff || o.role === 'GK') continue;
  1081	      const dd = dist(o.pos, shooter.pos);
  1082	      if (dd < bestD) {
  1083	        bestD = dd;
  1084	        presser = o;
  1085	      }
  1086	    }
  1087	    if (presser) contest = pressure * (0.55 + presser.attrs.defending * 0.9);
  1088	  }
  1089	  // THE CHIP (Phase 69, user ask 挑射/吊射): a keeper OFF HIS LINE can be
  1090	  // beaten over the top — the ecology's first mechanism that PUNISHES
  1091	  // keeperAggression (the sweeper's line height is exactly what opens the
  1092	  // gap behind him). Geometry decides feasibility, the price comparison
  1093	  // decides the attempt; a taken chip replaces this ground strike.
  1094	  if (tryChip(match, shooter, q, pressure)) return;
  1095	  // Composed 1v1 (Phase 28.4): nobody goal-side but the keeper — the shooter
  1096	  // PICKS a spot: tighter to the post, tighter grouping. Without this the
  1097	  // breakaway-finish appetite just fed the keeper from 15m.
  1098	  let oneVone = true;
  1099	  for (const o of opp.players) {
  1100	    if (o.role === 'GK' || o.sentOff) continue;
  1101	    if (dist(o.pos, goalCenterFor(team)) < d - 1) {
  1102	      oneVone = false;
  1103	      break;
  1104	    }
  1105	  }
  1106	  // Composure EARNED (Phase 93): the 28.4 gift was attribute-blind — every
  1107	  // breakaway shooter got the tighter aim + grouping for free, and the
  1108	  // shot-context anatomy measured that pipe at 76-81% of late-gen goals.
  1109	  // Scale the gift by finishing instead: at 0.5 the oneVone branch is a
  1110	  // no-op (a plain shot), a 0.9+ finisher keeps the full old gift
  1111	  // (aim ×0.72, spread ×0.7), and a 0.2 finisher PANICS — alone in front
  1112	  // of goal with nothing to trust, he sprays WIDER than a contested shot.
  1113	  // Composure is now a thing the budget must buy, not a flag.
  1114	  const composure = clamp((shooter.attrs.finishing - 0.5) / 0.4, -0.75, 1);
  1115	  const aimTarget = oneVone
  1116	    ? v2(goalX, (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin * (1 - 0.28 * composure)))
  1117	    : target;
  1118	  const aim = norm(sub(aimTarget, shooter.pos));
  1119	  // Long-range and pressured shots spray more; finishers spray less. A shot
  1120	  // snatched against the body's facing (Phase 27) sprays more and loses power.
  1121	  const misalign = kickMisalignment(shooter, aim);
  1122	  // Spread base 0.029 → 0.025 in 29.1, → 0.022 in Phase 30: set defences
  1123	  // (formations) mean almost every shot is a contested one now — tighter
  1124	  // base grouping keeps the on-target share honest without touching the
  1125	  // pressure physics (failure mode 16: aim/spread beat reach/saveP here).
  1126	  const spread =
  1127	    (0.022 + d * 0.0028 + contest * 0.05) *
  1128	    (1.45 - shooter.attrs.finishing * 0.9) *
  1129	    (1 - team.confidence * 0.12) * // the finish rides confidence too (Phase 111)
  1130	    (oneVone ? 1 - 0.3 * composure : 1) *
  1131	    orientationNoiseMul(misalign, shooter.attrs.dribbling);
  1132	  const dir = rotate(aim, match.rng.gaussian() * spread);
  1133	
  1134	  // The placed curler (Phase 37): technique bends the strike around the
  1135	  // dive. Launch pre-compensated by −spin·T/2 so the chord still crosses
  1136	  // the frame where the aim pointed; lateral drift = spin·vx, so the sign
  1137	  // that bends AWAY from the keeper is sign(Δy·dirx).
  1138	  const curl =
  1139	    (Math.sign((aimTarget.y - gk.pos.y) * dir.x) || 1) * (0.1 + shooter.attrs.dribbling * 0.2);
  1140	  const v0 = SHOT_SPEED * orientationPowerMul(misalign, shooter.attrs.dribbling);
  1141	  const shotT = -Math.log(1 - Math.min((d * BALL_FRICTION_K) / v0, 0.85)) / BALL_FRICTION_K;
  1142	  match.kickBall(shooter, rotate(dir, -curl * shotT * 0.5), v0);
  1143	  match.ball.spin = curl;
  1144	  team.stats.shots++;
  1145	  team.stats.xg += q;
  1146	  match.stat(shooter.gid).shots++;
  1147	
  1148	  // Dive difficulty, frozen at the moment of the strike (keeper reaction) —
  1149	  // priced on the CHORD, discounted for the bend the dive can't fully read.
  1150	  const difficulty = Math.max(
  1151	    0.25,
  1152	    diveDifficulty(match.ball.pos, dir, gk, opp) * (1 - Math.abs(curl) * 0.12),
  1153	  );
  1154	
  1155	  // Assist credit if this shot scores: the completed pass that set it up.
  1156	  const lpForAssist = match.lastCompletedPass;
  1157	  const assistGid =
  1158	    lpForAssist && lpForAssist.receiverGid === shooter.gid && match.simTime - lpForAssist.t < 3
  1159	      ? lpForAssist.passerGid
  1160	      : null;
  1161	
  1162	  match.markShotOutcome('miss'); // close out any still-pending previous shot
  1163	  match.shotLog.push({
  1164	    t: match.simTime, minute: match.minute(), side: shooter.side, xg: q, outcome: 'pending',
  1165	    blockers: laneBlockers(shooter.pos, goalCenterFor(team), opp.players),
  1166	    pressure,
  1167	    oneVone,
  1168	    assist:
  1169	      match.lastCutback && match.lastCutback.side === shooter.side && match.simTime - match.lastCutback.t < 5
  1170	        ? 'cutback'
  1171	        : match.lastPassKind && match.simTime - match.lastPassKind.t < 2.5
  1172	          ? match.lastPassKind.kind
  1173	          : 'none',
  1174	    channel: match.goalChannelFor(shooter),
  1175	  });
  1176	  match.pendingShot = {
  1177	    side: shooter.side,
  1178	    shooterGid: shooter.gid,
  1179	    xg: q,
  1180	    t: match.simTime,
  1181	    resolved: false,
  1182	    logIndex: match.shotLog.length - 1,
  1183	    difficulty,
  1184	    assistGid,
  1185	    closeIn: clamp01((7 - dist(gk.pos, shooter.pos)) / 7),
  1186	    coverage: angleCoverage(gk, shooter.pos, goalCenterFor(team)),
  1187	  };
  1188	
  1189	  // Key pass: shot within 3s of receiving.
  1190	  const lp = match.lastCompletedPass;
  1191	  if (lp && lp.receiverGid === shooter.gid && match.simTime - lp.t < 3) {
  1192	    team.stats.keyPasses++;
  1193	    const passer = match.allPlayers[lp.passerGid]; // allPlayers is gid-indexed
  1194	    if (passer) match.pushEvent('keypass', shooter.side, `${passer.name} with the key pass`);
  1195	  }
  1196	  match.pushEvent('shot', shooter.side, `${shooter.name} shoots! (xG ${q.toFixed(2)})`);
  1197	}
  1198	
  1199	/**
  1200	 * Direct free kick (Phase 32): the curl over the wall. Closed-form
  1201	 * parabola through TWO constraints — z ≥ 2.6m at the wall line (above the
  1202	 * outfield header band, 2.5m: a wall that can contest the climb eats
  1203	 * every kick, the 31.9 corner-sentry lesson) and a chosen arrival height
  1204	 * under the bar — then the usual shot bookkeeping so saves/goals/xG all
  1205	 * ride the pendingShot machinery.
  1206	 */
  1207	export function performFreeKick(match: Match, taker: Player): void {
  1208	  if (match.ball.owner !== taker || taker.kickCooldown > 0) return;
  1209	  const team = match.teams[taker.side];
  1210	  const opp = match.teams[1 - taker.side];
  1211	  const gk = opp.goalkeeper;
  1212	  const ball = match.ball;
  1213	
  1214	  const goalX = team.attackDir * HALF_L;
  1215	  // Specialists shave the post; timid takers aim well inside it.
  1216	  const aimMargin = 1.05 - taker.attrs.finishing * 0.55;
  1217	  const aimY = (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin);
  1218	  const target = v2(goalX, aimY);
  1219	  const d = dist(ball.pos, target);
  1220	
  1221	  // Solve the flight: z(a·T) = 2.6 at the wall (a = wallDist/d) and
  1222	  // z(T) = zg at the goal ⇒ T² = (2.6 − a·zg) / (G/2 · a(1−a)).
  1223	  // The arrival height DRAWS high (up to ~2.75): everything above the bar
  1224	  // is the classic blazed-over-the-wall miss — without it every strike
  1225	  // arrived under the bar by construction and conversion tripled.
  1226	  const zg = 0.85 + match.rng.range(0, 1.9);
  1227	  // The wall's REAL distance from the release point (the taker may stand
  1228	  // up to ~1.3m off the spot and kickBall releases 0.9m ahead — assuming
  1229	  // a spot-kick left the climb at ~2.2m over the heads, inside the header
  1230	  // band, instead of the designed 2.6).
  1231	  let wallD = CORNER_CLEARANCE - 0.9;
  1232	  if (match.fkWall) {
  1233	    const own = v2(team.attackDir * HALF_L, 0);
  1234	    const center = add(match.fkWall.pos, scale(norm(sub(own, match.fkWall.pos)), CORNER_CLEARANCE + 0.15));
  1235	    wallD = dist(ball.pos, center) - 1.4; // release offset + safety margin
  1236	  }
  1237	  // The banana's price (Phase 37): a curled launch leaves the straight
  1238	  // line, and the climb's header-band segment sweeps past the wall's edge
  1239	  // bodies — the solver buys extra clearance per unit of spin (the first
  1240	  // cut at spin ≤0.7 with plain 2.6 put 4/30 walls back in the header
  1241	  // game, the exact 31.9 sentry failure the invariant test pins).
  1242	  const spinMag = 0.25 + taker.attrs.passing * 0.25;
  1243	  const a = clamp(wallD / d, 0.12, 0.6);
  1244	  const wallClear = 2.6 + spinMag * 0.5;
  1245	  const T = clamp(Math.sqrt(Math.max(0.4, (wallClear - a * zg) / ((GRAVITY / 2) * a * (1 - a)))), 0.9, 1.9);
  1246	  const vz = (zg + (GRAVITY / 2) * T * T) / T;
  1247	  const speed = d / T;
  1248	
  1249	  // Placed ball, full run-up: no orientation penalties, tight spread that
  1250	  // finishing tames — the free kick is the specialist's shot.
  1251	  const spread = (0.034 + d * 0.001) * (1.35 - taker.attrs.finishing * 0.7);
  1252	  const aim = norm(sub(target, ball.pos));
  1253	  const dir = rotate(aim, match.rng.gaussian() * spread);
  1254	
  1255	  // Direct FKs convert ~4-8% in the real game — the xG entry says so.
  1256	  const q = clamp(0.09 - (d - 17) * 0.003, 0.02, 0.12);
  1257	
  1258	  // The banana ball (Phase 37): the specialist's strike curls AWAY from
  1259	  // the keeper toward the chosen corner — over the wall on the solver's
  1260	  // flight, bending across the frame. Launch pre-compensated by −spin·T/2
  1261	  // (the chord still crosses at the aim point); the curl prices the dive.
  1262	  // Lateral (y) drift of a spinning ball = spin·vx, so the sign that
  1263	  // drifts from the keeper toward the chosen corner is sign(Δy·vx).
  1264	  const curlSign = Math.sign((target.y - gk.pos.y) * dir.x) || 1;
  1265	  const spin = curlSign * spinMag;
  1266	  const kickPos = v2(ball.pos.x, ball.pos.y);
  1267	  match.kickBall(taker, rotate(dir, -spin * T * 0.5), speed, vz);
  1268	  ball.spin = spin;
  1269	  team.stats.shots++;
  1270	  team.stats.xg += q;
  1271	  match.stat(taker.gid).shots++;
  1272	
  1273	  // The dive prices the CHORD (where the arc actually crosses the frame)
  1274	  // plus the late bend the keeper cannot fully read.
  1275	  const difficulty = Math.max(0.25, diveDifficulty(kickPos, dir, gk, opp) * (1 - Math.abs(spin) * 0.12));
  1276	
  1277	  match.markShotOutcome('miss'); // close out any still-pending previous shot
  1278	  match.shotLog.push({
  1279	    t: match.simTime, minute: match.minute(), side: taker.side, xg: q, outcome: 'pending',
  1280	    blockers: 0, // the wall is cleared by construction; blocks don't apply
  1281	    channel: match.goalChannelFor(taker), // the FK stamp lands it as `setpiece`
  1282	  });
  1283	  match.pendingShot = {
  1284	    side: taker.side,
  1285	    shooterGid: taker.gid,
  1286	    xg: q,
  1287	    t: match.simTime,
  1288	    resolved: false,
  1289	    logIndex: match.shotLog.length - 1,
  1290	    difficulty,
  1291	    assistGid: null, // a placed ball has no assist
  1292	    placed: true,
  1293	  };
  1294	  match.pushEvent('shot', taker.side, `${taker.name} bends the free kick! (xG ${q.toFixed(2)})`);
  1295	}
  1296	
  1297	/**
  1298	 * The dribble PUSH (Phase 36, 可见的触球): the carrier knocks the ball
  1299	 * ahead along his heading and chases it. The ball is a free body until he
  1300	 * re-collects (the push-scaled poke window an opponent in
  1301	 * the path plays the BALL in). Push length grows with open field ahead
  1302	 * (knock-and-run down the wing) and wobbles with poor technique; sprint
  1303	 * speed carries into the ball, so close control at walking pace stays
  1304	 * naturally tight.
  1305	 */

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/sim/mechanics.ts | sed -n '1297,1618p'; nl -ba src/sim/mechanics.ts | sed -n '1619,1925p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
  1297	/**
  1298	 * The dribble PUSH (Phase 36, 可见的触球): the carrier knocks the ball
  1299	 * ahead along his heading and chases it. The ball is a free body until he
  1300	 * re-collects (the push-scaled poke window an opponent in
  1301	 * the path plays the BALL in). Push length grows with open field ahead
  1302	 * (knock-and-run down the wing) and wobbles with poor technique; sprint
  1303	 * speed carries into the ball, so close control at walking pace stays
  1304	 * naturally tight.
  1305	 */
  1306	export function performDribbleTouch(match: Match, p: Player): void {
  1307	  const ball = match.ball;
  1308	  if (ball.owner !== p) return;
  1309	  const opp = match.teams[1 - p.side];
  1310	  // Open field ahead: nearest opponent inside a forward cone prices the push.
  1311	  const hx = p.heading.x;
  1312	  const hy = p.heading.y;
  1313	  let aheadD = 14;
  1314	  for (const o of opp.players) {
  1315	    if (o.sentOff) continue;
  1316	    const dx = o.pos.x - p.pos.x;
  1317	    const dy = o.pos.y - p.pos.y;
  1318	    const along = dx * hx + dy * hy;
  1319	    // The keeper's stopping power starts upfield of his body (Phase 46):
  1320	    // a loose roll entering his rush envelope is collected, full stop —
  1321	    // outfielders must WIN the ball, so they price at body position.
  1322	    const eff = o.role === 'GK' ? along - GK_RUSH_ENVELOPE : along;
  1323	    if (along < 0 || eff > 14) continue;
  1324	    const perp = Math.abs(dx * hy - dy * hx);
  1325	    if (perp > along * 0.7 + 1) continue; // outside the ~70° cone
  1326	    if (eff < aheadD) aheadD = Math.max(eff, 0);
  1327	  }
  1328	  // Carry regimes (36.1): the open cone ahead PRICES the touch — a
  1329	  // stride-length nudge in traffic (一步一带), a real knock into open
  1330	  // grass (爆趟). Technique shortens and steadies both.
  1331	  const open = Math.min(Math.max(aheadD - 2, 0), 9);
  1332	  let push = (TOUCH_PUSH_BASE + open * TOUCH_PUSH_SPACE) * (1.05 - p.attrs.dribbling * 0.15);
  1333	  // The line guard (36.1): a knock that would roll into touch is halved —
  1334	  // real wingers shorten the touch at the line (12.9% of pushes rolled
  1335	  // dead/out at the first cut).
  1336	  const rollEst = push; // rolled meters ≈ push m/s over ~1s of decay
  1337	  if (
  1338	    Math.abs(p.pos.y + hy * (rollEst + 2)) > HALF_W - 1 ||
  1339	    Math.abs(p.pos.x + hx * (rollEst + 2)) > HALF_L - 1
  1340	  ) {
  1341	    push *= 0.5;
  1342	  }
  1343	  const vmag = Math.hypot(p.vel.x, p.vel.y);
  1344	  const speed = vmag + Math.max(push, 0.8);
  1345	  // A heavy first touch is a WOBBLY one: direction noise priced by technique.
  1346	  const noise = match.rng.gaussian() * 0.07 * (1.35 - p.attrs.dribbling * 0.7);
  1347	  // Knock it along the direction of TRAVEL, not the instantaneous facing.
  1348	  // `heading` is rate-capped (TURN_RATE) and lags the velocity through a turn,
  1349	  // so aiming at the old facing sent the freed ball off on a line the carrier
  1350	  // was already turning away from — it "flew out" on a spin (play report:
  1351	  // "带球转身,球偶尔会飞出去"). The ball now follows where he is actually
  1352	  // running, so it stays on his path through the turn (gate needs v>2.5 m/s,
  1353	  // so `travel` is always well-defined here; heading is only the slow fallback).
  1354	  const travel = vmag > 0.5 ? v2(p.vel.x / vmag, p.vel.y / vmag) : v2(hx, hy);
  1355	  const dir = rotate(travel, noise);
  1356	  ball.owner = null;
  1357	  ball.lastTouch = p;
  1358	  ball.vel = scale(dir, speed);
  1359	  ball.z = 0;
  1360	  ball.vz = 0;
  1361	  // The regather window follows the push: a knock is a chase, a dribble
  1362	  // touch comes back underfoot within the stride.
  1363	  p.kickCooldown = TOUCH_RECOLLECT_BASE + push * TOUCH_RECOLLECT_PER_PUSH;
  1364	  match.dribbleTouch = { gid: p.gid, until: match.simTime + 1.6 };
  1365	}
  1366	
  1367	export function performClear(match: Match, p: Player): void {
  1368	  if (match.ball.owner !== p || p.kickCooldown > 0) return;
  1369	  match.endPassMove(p.side); // a hoof is not part of a passing move (Phase 33)
  1370	  const team = match.teams[p.side];
  1371	  // Hoof it upfield with a wide lateral component — safety over precision.
  1372	  // Panicked clears regularly cross the touchline: conceding a kick-in beats
  1373	  // losing the ball in front of your own goal (this is where kick-ins come from).
  1374	  const lat = match.rng.range(-1.0, 1.0);
  1375	  const aim = norm(v2(team.attackDir, lat));
  1376	  const dir = rotate(aim, match.rng.gaussian() * 0.08);
  1377	  // A clear hammered against the body's facing comes off weaker (Phase 27) —
  1378	  // at half strength: a panic hoof is a compromise, not a fifty-fifty gift.
  1379	  // Since Phase 28 the hoof goes UP as well as out: it hangs uninterceptable
  1380	  // over midfield and comes down as an aerial contest, like a real clearance.
  1381	  match.kickBall(
  1382	    p,
  1383	    dir,
  1384	    23 * (1 - kickMisalignment(p, aim) * 0.15 * (1 - p.attrs.passing * 0.4)),
  1385	    match.rng.range(3.2, 5.4),
  1386	  );
  1387	  team.stats.clearances++;
  1388	}
  1389	
  1390	/**
  1391	 * Deflection (Phase 27): a ball too fast to control (a drilled pass) can
  1392	 * still be knocked loose by a player standing in its path — reading the lane
  1393	 * pays off even when the pass is hit hard. Rolled once per crossing (the
  1394	 * kick cooldown stops re-rolls while the ball is still in reach).
  1395	 */
  1396	export function tryDeflection(match: Match, p: Player): void {
  1397	  const ball = match.ball;
  1398	  const speed = len(ball.vel);
  1399	  // Committed to the stretch either way — no second bite at the same ball.
  1400	  p.kickCooldown = 0.3;
  1401	  // Blind-side honesty (Phase 59): same convention as attemptFirstTouch —
  1402	  // ball arriving at the face = 0, from behind the body = 1. The retreating
  1403	  // defender with a pull-back zipping behind his heels mostly whiffs; the
  1404	  // set, facing interceptor keeps his old numbers. This is what makes the
  1405	  // collapsed block's ceded arc a REAL payoff (the N1.5 counter surface).
  1406	  const dir = norm(ball.vel);
  1407	  const blind = (1 + (dir.x * p.heading.x + dir.y * p.heading.y)) / 2;
  1408	  const pDef = clamp(
  1409	    (0.24 + p.attrs.defending * 0.4 - (speed - 14) * 0.02) * (1 - blind * DEFLECT_BLIND_PEN),
  1410	    0.05, 0.6);
  1411	  if (!match.rng.chance(pDef)) return; // it zips past the outstretched leg
  1412	  ball.lastTouch = p;
  1413	  ball.vel = scale(rotate(norm(ball.vel), match.rng.range(-1.2, 1.2)), match.rng.range(4, 8));
  1414	  p.tackleAnimTimer = 0.4; // the stretch is visible (display only)
  1415	}
  1416	
  1417	/**
  1418	 * Smother (Phase 27.5): a rushing keeper who reaches the carrier's ball
  1419	 * dives on it. Reflexes vs the carrier's close control decide it; a win is
  1420	 * a keeper claim (hands, hold state), a loss leaves the keeper on the floor
  1421	 * — and occasionally a clumsy challenge that concedes the foul (a penalty,
  1422	 * in the box where rushes live). Since Phase 28 a keeper does NOT need to
  1423	 * be mid-rush: a carrier who dribbles into the keeper's face inside the box
  1424	 * gets smothered at the feet the same way — you can go past the keeper,
  1425	 * you cannot stand on their toes and keep the ball forever.
  1426	 */
  1427	export function trySmother(match: Match): void {
  1428	  const owner = match.ball.owner;
  1429	  if (!owner || owner.gkHoldTimer > 0) return;
  1430	  const gk = match.teams[1 - owner.side].goalkeeper;
  1431	  if (gk.sentOff || gk.stunTimer > 0 || gk.kickCooldown > 0 || gk.tackleCooldown > 0) return;
  1432	  const rushing = gk.action.type === 'GoalkeeperRush';
  1433	  // Hands only inside the box (Phase 28.5, user report "门将出击到禁区外用手
  1434	  // 接球了"): the smother IS a dive ONTO the ball with the hands, so it may
  1435	  // only happen in the keeper's own area — even mid-rush. A sweeper who
  1436	  // rushes past his line closes the angle, but a ball out there he takes
  1437	  // with his feet — and his FEET were always live: the tryTackles tackler
  1438	  // scan never excluded keepers, so a rushing keeper duels the carrier on
  1439	  // the phase-41 substrate like any defender (Phase 103 verified this and
  1440	  // DELETED its own first cut — a custom out-box poke layered a worse-
  1441	  // priced coin flip with a 0.9s stun on top of the tuned duel, and the
  1442	  // sweeper school bled goals through exactly that branch).
  1443	  if (!match.inPenaltyBox(match.ball.pos, gk.side)) return;
  1444	  if (dist(gk.pos, match.ball.pos) >= 1.3) return;
  1445	
  1446	  gk.saveAnimTimer = 0.7; // the dive at the feet is visible either way
  1447	  const pWin = clamp(0.56 + (gk.attrs.reflexes - 0.5) * 0.5 - (owner.attrs.dribbling - 0.5) * 0.35, 0.2, 0.85);
  1448	  if (match.rng.chance(pWin)) {
  1449	    match.teams[gk.side].stats.saves++;
  1450	    match.stat(gk.gid).saves++;
  1451	    owner.kickCooldown = 0.4;
  1452	    owner.stunTimer = 0.4; // ran into a wall of keeper
  1453	    match.pushEvent('save', gk.side, `${gk.name} smothers at ${owner.name}'s feet!`);
  1454	    match.giveBall(gk); // hold state engages — hands, untackleable
  1455	  } else {
  1456	    gk.stunTimer = 0.8; // beaten — picking himself up off the turf
  1457	    // A long recovery before RE-CHALLENGING (Phase 28.2): a keeper who dove
  1458	    // again every 1.3s read as convulsing. tackleCooldown — NOT kickCooldown
  1459	    // — so a loose ball at his feet can still be scooped up the moment the
  1460	    // stun ends (kickCooldown also gates ball pickup in tryCapture).
  1461	    gk.tackleCooldown = 1.2;
  1462	    // A full-speed rush is clumsier than a standing challenge at the feet.
  1463	    if (match.rng.chance(rushing ? 0.12 : 0.03)) match.awardFoul(gk, owner);
  1464	  }
  1465	}
  1466	
  1467	/**
  1468	 * The professional foul (Phase 29.1): a breakaway carrier has beaten the
  1469	 * field — nobody but the keeper goal-side — and a chasing defender close
  1470	 * enough to reach the shirt but not the ball hauls them down from behind.
  1471	 * Play stops (the carrier does NOT keep the ball, so the advantage rule
  1472	 * cannot apply): free kick + a near-automatic card via `awardTacticalFoul`.
  1473	 * Never in the defender's own box — professionals concede the free kick,
  1474	 * not the penalty. This is the counterweight to offside-era breakaways
  1475	 * where the chasing pack could only eat exhaust fumes: pace still wins the
  1476	 * race (a >1.7m gap is uncatchable), but a caught runner gets fouled.
  1477	 */
  1478	/**
  1479	 * THE RECOVERY SLIDE (Phase 110, the carry-through counter — lever 1).
  1480	 * The 106 anatomy measured the walk-in's pursuit converging at 1.7-2.4m
  1481	 * behind the carrier and STAYING there: the tackle radius is 1.15m and
  1482	 * the tactical grab 1.7m, so the duel never rolled (lunges fired in 2-4%
  1483	 * of breakaway goals) and 69-78% of breakaways were clean carry-throughs.
  1484	 * Real football's answer is the desperation slide: a from-behind lunge
  1485	 * covering the 1.2-2.2m band that sometimes wins the ball, often fouls
  1486	 * (the phase-62 card economics — in the box that is a PENALTY), and
  1487	 * leaves the slider on the grass either way. Selection prices the
  1488	 * appetite through markingAggression; a booked man holds off.
  1489	 */
  1490	export function trySlideTackle(match: Match): void {
  1491	  const owner = match.ball.owner;
  1492	  if (!owner || owner.gkHoldTimer > 0) return;
  1493	  const attTeam = match.teams[owner.side];
  1494	  const defTeam = match.teams[1 - owner.side];
  1495	  const goal = attTeam.oppGoal();
  1496	  const dGoal = dist(owner.pos, goal);
  1497	  // The walk-in kill zone and its approach — deeper than the tactical
  1498	  // grab dares (that band stops at 16m; the measured strikes land 6-9m).
  1499	  if (dGoal > 30) return;
  1500	  // Only a DRIVING carrier (the walk-in), and only from BEHIND — a set
  1501	  // defender in front owns the honest tryTackles duel instead.
  1502	  if (len(owner.vel) < 4.0) return;
  1503	  if (dot(owner.vel, sub(goal, owner.pos)) <= 0) return;
  1504	  let slider: Player | null = null;
  1505	  let best = Infinity;
  1506	  for (const o of defTeam.players) {
  1507	    if (o.role === 'GK' || o.sentOff || o.tackleCooldown > 0 || o.stunTimer > 0) continue;
  1508	    const d = dist(o.pos, match.ball.pos);
  1509	    if (d < 1.2 || d > 2.2) continue; // inside 1.2 the standing tackle already rolls
  1510	    const bx = o.pos.x - owner.pos.x;
  1511	    const by = o.pos.y - owner.pos.y;
  1512	    if (bx * owner.vel.x + by * owner.vel.y > 0) continue; // must be chasing
  1513	    if (d < best) {
  1514	      best = d;
  1515	      slider = o;
  1516	    }
  1517	  }
  1518	  if (!slider) return;
  1519	  // The slide is a CHOICE, aggression-flavored and rare per chase — and a
  1520	  // booked man mostly keeps his feet (the second yellow is the deterrent).
  1521	  let attempt = 0.05 + defTeam.genome.markingAggression * 0.12;
  1522	  if (slider.booked) attempt *= 0.35;
  1523	  if (!match.rng.chance(attempt)) return;
  1524	  slider.tackleCooldown = 2.5; // committed — he is on the grass either way
  1525	  slider.tackleAnimTimer = 0.5;
  1526	  slider.spendBurst(TACKLE_LUNGE_COST);
  1527	  // Win small: reaching through a shielding body from behind at full tilt.
  1528	  const win = clamp(
  1529	    0.16 + slider.attrs.defending * 0.14 - owner.attrs.dribbling * 0.1,
  1530	    0.05,
  1531	    0.4,
  1532	  );
  1533	  if (match.rng.chance(win)) {
  1534	    defTeam.stats.tackles++;
  1535	    match.stat(slider.gid).recoveries++;
  1536	    match.ball.owner = null;
  1537	    match.ball.lastTouch = slider;
  1538	    // Directional like the standing tackle (the 乱抢 fix): the sweeping leg
  1539	    // carries the slider's momentum — a recovery slide hooks the ball on
  1540	    // down-pitch (often out, often to the keeper), it does not spray it
  1541	    // uniformly. Same ±~69° noise cone, same speed band.
  1542	    match.ball.vel = scale(rotate(slider.heading, match.rng.range(-1.2, 1.2)), match.rng.range(5.5, 10));
  1543	    owner.kickCooldown = 0.3;
  1544	    owner.stunTimer = 0.6;
  1545	    match.possessionSide = -1;
  1546	    slider.stunTimer = 0.5; // he won it from the ground — up he gets
  1547	    return;
  1548	  }
  1549	  slider.stunTimer = 0.8; // beaten and grounded — the carrier runs on
  1550	  // Fouling from behind at speed: the whistle comes often. In the box the
  1551	  // awardFoul machinery makes it the PENALTY; a card rides via maybeCard.
  1552	  const foulP = 0.4 + defTeam.genome.markingAggression * 0.15;
  1553	  if (match.rng.chance(foulP)) match.awardFoul(slider, owner);
  1554	}
  1555	
  1556	export function tryTacticalFoul(match: Match): void {
  1557	  const owner = match.ball.owner;
  1558	  if (!owner || owner.gkHoldTimer > 0) return;
  1559	  const attTeam = match.teams[owner.side];
  1560	  const defTeam = match.teams[1 - owner.side];
  1561	  const goal = attTeam.oppGoal();
  1562	  const dGoal = dist(owner.pos, goal);
  1563	  // Only DESPERATE territory: the carrier is bearing down on the edge of
  1564	  // the danger zone (16–34m out — inside is the box/keeper duel, further
  1565	  // out the defence still trusts the recovery). The high offside line
  1566	  // makes "nobody goal-side" routine, so without this band every line
  1567	  // break got hauled down and cards hit 8/match.
  1568	  if (dGoal < 16 || dGoal > 34) return;
  1569	  // Only a genuine breakaway: carrier at a real sprint, driving at goal.
  1570	  if (len(owner.vel) < 4.5) return;
  1571	  if (dot(owner.vel, sub(goal, owner.pos)) <= 0) return;
  1572	  if (match.inPenaltyBox(match.ball.pos, defTeam.side)) return;
  1573	  for (const o of defTeam.players) {
  1574	    if (o.role === 'GK' || o.sentOff) continue;
  1575	    if (dist(o.pos, goal) < dGoal - 1) return; // covered — let the race run
  1576	  }
  1577	  // The nearest ready chaser in grab range BEHIND the carrier (a defender
  1578	  // in FRONT can still play the ball honestly — that's tryTackles' job).
  1579	  let grabber: Player | null = null;
  1580	  let best = Infinity;
  1581	  for (const o of defTeam.players) {
  1582	    if (o.role === 'GK' || o.sentOff || o.tackleCooldown > 0 || o.stunTimer > 0) continue;
  1583	    const d = dist(o.pos, owner.pos);
  1584	    if (d > 1.7) continue;
  1585	    const bx = o.pos.x - owner.pos.x;
  1586	    const by = o.pos.y - owner.pos.y;
  1587	    if (bx * owner.vel.x + by * owner.vel.y > 0) continue;
  1588	    if (d < best) {
  1589	      best = d;
  1590	      grabber = o;
  1591	    }
  1592	  }
  1593	  if (!grabber) return;
  1594	  grabber.tackleCooldown = 2.0; // committed either way — one grab per chase, not spam
  1595	  grabber.spendBurst(TACKLE_LUNGE_COST); // the grab is a burst too (Phase 58)
  1596	  // Cynicism is RARE (~1/match), aggression-flavored, and a booked man keeps
  1597	  // his hands to himself (the second yellow is the whole deterrent).
  1598	  let p = 0.06 + defTeam.genome.markingAggression * 0.1;
  1599	  if (grabber.booked) p *= 0.3;
  1600	  // The free kick has TEETH now (Phase 32): hauling a man down inside the
  1601	  // direct-FK band hands the specialist a real strike at goal — the
  1602	  // professional weighs that and lets some breaks run.
  1603	  if (dGoal < 28) p *= 0.6;
  1604	  if (!match.rng.chance(p)) return;
  1605	  grabber.tackleAnimTimer = 0.4;
  1606	  match.awardTacticalFoul(grabber, owner);
  1607	}
  1608	
  1609	/**
  1610	 * Tackling: the nearest ready opponent within reach of a dribbler attempts to
  1611	 * win the ball. Success odds: markingAggression helps the tackler, the
  1612	 * carrier's dribbleBias (close control) protects them. A failed tackle puts
  1613	 * the defender on a 1.2s cooldown — beaten players can't spam.
  1614	 */
  1615	export function tryTackles(match: Match): void {
  1616	  const ball = match.ball;
  1617	  const owner = ball.owner;
  1618	  if (!owner) return;
  1619	  // A keeper holding the ball in their hands can't be tackled (Phase 27.2).
  1620	  if (owner.gkHoldTimer > 0) return;
  1621	  const oppTeam = match.teams[1 - owner.side];
  1622	
  1623	  let tackler: Player | null = null;
  1624	  let best = Infinity;
  1625	  for (const o of oppTeam.players) {
  1626	    if (o.sentOff || o.tackleCooldown > 0 || o.stunTimer > 0) continue;
  1627	    const d = dist(o.pos, ball.pos);
  1628	    if (d < 1.15 && d < best) {
  1629	      best = d;
  1630	      tackler = o;
  1631	    }
  1632	  }
  1633	  if (!tackler) return;
  1634	  // THE JOCKEY (Phase 87): the goal-side contain man of a jockeying team
  1635	  // refuses the full-momentum duel — he delays and challenges only a
  1636	  // loose touch or a dying drive. The dive-in school (low gene) keeps the
  1637	  // old reflex; the momentum gate (Phase 41) still pays the carrier who
  1638	  // finds a duel, but a jockeyed carrier has to EARN one.
  1639	  const jockeyG = oppTeam.genome.jockeyBias ?? 0.5;
  1640	  const driveNow = clamp(len(owner.vel) / 9, 0, 1);
  1641	  const goalSide = oppTeam.localX(tackler.pos.x) < oppTeam.localX(owner.pos.x) - 0.2;
  1642	  const looseTouch = dist(ball.pos, owner.pos) > 0.85;
  1643	  // Phase 92 (the A/B verdict): jockeying is delay UNTIL HELP ARRIVES —
  1644	  // without an endgame a patient carrier was never dispossessed. A second
  1645	  // defender inside 3m collapses the containment into the challenge.
  1646	  let helpClose = false;
  1647	  for (const o of oppTeam.players) {
  1648	    if (o === tackler || o.sentOff || o.role === 'GK') continue;
  1649	    if (dist(o.pos, owner.pos) < 3) {
  1650	      helpClose = true;
  1651	      break;
  1652	    }
  1653	  }
  1654	  // No containment in the danger zone (Phase 92): inside ~28m of goal
  1655	  // the challenge is mandatory — jockeying a shooter is just watching.
  1656	  const dangerZone = oppTeam.localX(owner.pos.x) < -17;
  1657	  if (goalSide && !looseTouch && !helpClose && !dangerZone && driveNow > 0.9 - jockeyG * 0.55) return;
  1658	  tackler.tackleAnimTimer = 0.4; // the lunge is visible either way (display only)
  1659	  tackler.spendBurst(TACKLE_LUNGE_COST); // win or whiff, the lunge costs legs (Phase 58)
  1660	
  1661	  // Team aggression + the tackler's defending vs the carrier's evasion. The
  1662	  // carrier resists two UNBIASED ways (attrs/genes, never role): close control
  1663	  // — technique + the team's dribble philosophy — shields and turns a standing
  1664	  // challenge; PACE only pays with a running start. `drive` is the carrier's
  1665	  // momentum (~0 jostling in a crowd, ~0.5 at the 4.5 m/s the cynical-foul code
  1666	  // already treats as a "real sprint", ~1 flat out), so a quick player driving
  1667	  // into space is hard to dispossess while a fast one hemmed in gets nothing
  1668	  // from it. That momentum gate is the space payoff — you can only build speed
  1669	  // where there's room ahead (the flanks, the channels), so wide/quick play
  1670	  // earns a duel edge the compact clump can't, giving width a gradient to climb
  1671	  // (the master gate, Phase 41). Base carries Phase 27's whiff-stun raise.
  1672	  const drive = driveNow;
  1673	  // strength SHIELDS the standing challenge (Phase 47 — the hold-up/pivot
  1674	  // payoff): base 0.21→0.25 with −strength·0.10 so the POPULATION mean
  1675	  // (backfill 0.4) lands exactly where phase-46 left it; the gradient is
  1676	  // what's new, not the league tackle rate.
  1677	  // defending 0.24→0.34 (Phase 48): the wage cap exposed defending as
  1678	  // UNDER-PRICED — whole leagues drained DF points to fund attack (evo-drift
  1679	  // DFdef 0.63→0.52, goals →3.1-3.4). A stronger per-point payoff makes the
  1680	  // defensive spend competitive again (swept {0.24,0.30,0.34}: reference-seed
  1681	  // goals 3.07→2.87→2.65).
  1682	  let p =
  1683	    0.25 +
  1684	    oppTeam.genome.markingAggression * 0.2 +
  1685	    tackler.attrs.defending * 0.34 -
  1686	    match.teams[owner.side].genome.dribbleBias * 0.08 -
  1687	    owner.attrs.dribbling * 0.18 -
  1688	    owner.attrs.strength * 0.1 -
  1689	    // 0.20 → 0.16 (Phase 41.2): the slalom COMMITMENT fix stopped carriers
  1690	    // bleeding their momentum in pirouettes, so the same coefficient bought
  1691	    // far more protection than Phase 41 priced (3-seed paired calibrate
  1692	    // +0.74 goals; evo-drift dribbleBias railed 0.40→0.80 and width
  1693	    // re-collapsed 0.52→0.14 — a dribble monoculture). The trim restores
  1694	    // the DESIGNED effective protection at the new, honest drive levels;
  1695	    // the space/pace gradient itself stays (the master-gate principle).
  1696	    owner.attrs.pace * drive * 0.16;
  1697	  if (oppTeam.mode === 'Press') p += 0.06;
  1698	  if (tackler.traits.includes('enforcer')) p += 0.04; // the destroyer (Phase 39)
  1699	  // THE OUTNUMBERED DUEL (Phase 104, Route A user-ratified): a STALLED
  1700	  // carrier with a second defender inside 3m has his escape angles cut —
  1701	  // the duel was priced 1v1 no matter how many bodies converged, so a
  1702	  // containment that DELAYED until help arrived (the whole jockey design,
  1703	  // 87/92) won its collapse at coin-flip rates and the school starved.
  1704	  // Physics, no gene named: the momentum gate still lets a DRIVING carrier
  1705	  // burn through a double (a flat +0.1 also fed the press swarm and cost
  1706	  // the jockey side the neutral A/B — measured, then narrowed); it is the
  1707	  // stopped-and-doubled carrier who is dead meat, and engineering exactly
  1708	  // that situation is what the contain school does for a living.
  1709	  if (helpClose && drive < 0.45) p += 0.12;
  1710	  p = clamp(p, 0.06, 0.7);
  1711	
  1712	  if (match.rng.chance(p)) {
  1713	    oppTeam.stats.tackles++;
  1714	    match.stat(tackler.gid).recoveries++;
  1715	    // No feed event — tackles are too frequent to narrate; stats + debug show them.
  1716	    ball.owner = null;
  1717	    ball.lastTouch = tackler;
  1718	    // The won ball travels (Phase 28.4, further in 29.1): a real tackle
  1719	    // knocks it CLEAR of the boot zone — short squirts re-fed the same
  1720	    // scramble endlessly, and the offside-compressed midfield made every
  1721	    // re-contest pull in more bodies.
  1722	    // DIRECTIONAL (the 乱抢 re-examination): a standing tackle is won with
  1723	    // INTENT — the winner steers the poke toward safety the way real
  1724	    // hurried defensive contacts go: WIDE, toward the near touchline, never
  1725	    // through the middle. ±~69° of noise keeps it far too wild to be a
  1726	    // pass. Two prior models were A/B-refuted on the way here: a pure
  1727	    // heading-cone (chase-from-behind tacklers face their own goal — their
  1728	    // pokes fed the very walk-ins this fix hunts) and a straight
  1729	    // away-from-own-goal cone (a free VERTICAL out-ball over the press to
  1730	    // the deliberately-high defend-shape ST — goals-warming re-inflated to
  1731	    // the arc highs and evolution railed press/transitionPress to 0.75+).
  1732	    // The slide keeps its momentum physics below — you cannot steer from
  1733	    // the grass. scramble-anatomy.ts is the A/B yardstick.
  1734	    const clear = norm(sub(ball.pos, oppTeam.ownGoal()));
  1735	    const toTouch = Math.sign(ball.pos.y) || 1;
  1736	    const wide = norm(v2(clear.x, clear.y + toTouch));
  1737	    ball.vel = scale(rotate(wide, match.rng.range(-1.2, 1.2)), match.rng.range(5.5, 10));
  1738	    owner.kickCooldown = 0.3;
  1739	    owner.stunTimer = 0.6; // dispossessed: stumble before rejoining play (Phase 27)
  1740	    tackler.tackleCooldown = 0.5;
  1741	    // The tackle knocks it LOOSE — it does not hand it over (Phase 31.9,
  1742	    // user report "抢断后几乎直接被对方控制,和拦截没有区别"): the tackler
  1743	    // is committed to the lunge and may not hoover his own squirt. Probed
  1744	    // before this line: 85% of won tackles were re-captured BY THE TACKLER
  1745	    // within 0.19s — the squirt was cosmetic and every dispossession read
  1746	    // as an instant possession flip. Now the loose ball belongs to the
  1747	    // third man: interception = clean takeaway, tackle = contested ball.
  1748	    tackler.kickCooldown = 0.5;
  1749	    match.possessionSide = -1;
  1750	  } else {
  1751	    tackler.tackleCooldown = 1.2;
  1752	    tackler.stunTimer = 0.35; // whiffed lunge: pick yourself up first (Phase 27)
  1753	    // A failed lunge is sometimes a foul (Phase 20): free kick, or a penalty
  1754	    // in the tackler's own box. Aggressive markers give more away.
  1755	    const foulP =
  1756	      0.06 + oppTeam.genome.markingAggression * 0.1 +
  1757	      (tackler.traits.includes('enforcer') ? 0.02 : 0) +
  1758	      (match.derby ? 0.01 : 0); // derbies bite (Phase 40)
  1759	    if (match.rng.chance(foulP)) match.awardFoul(tackler, owner);
  1760	  }
  1761	}
  1762	
  1763	/**
  1764	 * Shot blocks (Phase 31): a defender the ball passes within reach of gets a
  1765	 * real chance to throw a body in — the cost of daring a blocked lane that
  1766	 * `laneBlockers` warned the shooter about. Explicitly ON the pendingShot
  1767	 * path: 30.4 removed shots from the leg-deflection window because that
  1768	 * friction accident silently ate the league's goals (failure mode 18c);
  1769	 * this is the honest, tuned replacement. Ground-height drives only — a
  1770	 * rising ball clears the legs. One roll per defender per shot (the lunge
  1771	 * commits their kickCooldown either way); a successful block kills the
  1772	 * shot into a slow ricochet off the blocker — lastTouch transfers, so a
  1773	 * deflection behind the line is a corner, real-law.
  1774	 */
  1775	export function tryShotBlock(match: Match): void {
  1776	  const shot = match.pendingShot;
  1777	  const ball = match.ball;
  1778	  if (!shot || shot.resolved || ball.owner !== null) return;
  1779	  if (ball.z > 1.1) return; // over the legs and bodies
  1780	  const defTeam = match.teams[1 - shot.side];
  1781	  if (dist(ball.pos, defTeam.ownGoal()) < 6) return; // the goalmouth is the keeper's
  1782	  for (const o of defTeam.players) {
  1783	    if (o.role === 'GK' || o.sentOff || o.stunTimer > 0 || o.kickCooldown > 0) continue;
  1784	    const dx = o.pos.x - ball.pos.x;
  1785	    if (dx >= 0.9 || dx <= -0.9) continue;
  1786	    const dy = o.pos.y - ball.pos.y;
  1787	    if (dy >= 0.9 || dy <= -0.9) continue;
  1788	    if (Math.sqrt(dx * dx + dy * dy) >= 0.9) continue;
  1789	    o.kickCooldown = 0.45; // committed to the block, ball met or not
  1790	    o.tackleAnimTimer = 0.4;
  1791	    // The UNSET WALL (Phase 60): a set, facing body keeps its full block;
  1792	    // the mid-collapse retreater mostly fails to organize in front of a
  1793	    // first-time hit. Same principle the shoot appetite prices via
  1794	    // blockReadiness — but at CONTACT range the bearing to the ball is
  1795	    // unstable (a drive shaving past reads perpendicular), so the facing
  1796	    // term here is the ball's INCOMING direction (the tryDeflection blind
  1797	    // convention): you block what you can see coming.
  1798	    const bdir = norm(ball.vel);
  1799	    const blind = (1 + (bdir.x * o.heading.x + bdir.y * o.heading.y)) / 2;
  1800	    const stillness = clamp01((3.5 - len(o.vel)) / 2.5);
  1801	    const readiness = UNSET_BLOCK_WEIGHT + (1 - UNSET_BLOCK_WEIGHT) * (1 - blind) * stillness;
  1802	    if (!match.rng.chance((0.32 + o.attrs.defending * 0.25) * readiness)) continue;
  1803	    defTeam.stats.blocks++;
  1804	    ball.lastTouch = o;
  1805	    const away = match.rng.chance(0.5) ? 1 : -1;
  1806	    ball.vel = scale(rotate(norm(ball.vel), away * match.rng.range(0.7, 2.4)), match.rng.range(4.5, 9));
  1807	    ball.vz = 0;
  1808	    match.pushEvent('info', o.side, `${o.name} throws a body in front of it!`);
  1809	    match.markShotOutcome('miss');
  1810	    match.pendingShot = null;
  1811	    return;
  1812	  }
  1813	}
  1814	
  1815	/**
  1816	 * Keeper save: while a shot is unresolved and the ball is within the keeper's
  1817	 * reach heading goalward, roll one save attempt. Save odds fall with shot
  1818	 * quality. Catches kill the ball dead; parries push it away from goal.
  1819	 */
  1820	export function tryKeeperSave(match: Match): void {
  1821	  const shot = match.pendingShot;
  1822	  const ball = match.ball;
  1823	  if (!shot || shot.resolved || ball.owner !== null) return;
  1824	
  1825	  const defSide = (1 - shot.side) as 0 | 1;
  1826	  const defTeam = match.teams[defSide];
  1827	  const gk = defTeam.goalkeeper;
  1828	  const goal = defTeam.ownGoal();
  1829	  if (ball.z > GK_CLAIM_HEIGHT) return; // sailing over the keeper's hands
  1830	  const speed = len(ball.vel);
  1831	  if (speed < 6) return;
  1832	  if (dot(ball.vel, sub(goal, ball.pos)) <= 0) return;
  1833	
  1834	  const reach = keeperReach(defTeam, gk);
  1835	  const dNow = dist(gk.pos, ball.pos);
  1836	  if (dNow > reach) {
  1837	    // The fingertip stretch (119b): beyond reach, attempt ONLY as the ball
  1838	    // passes its closest approach (receding) — inside-reach behavior is
  1839	    // bit-identical, the new roll exists solely for the ball that would
  1840	    // never have entered the corridor at all.
  1841	    const receding = dot(ball.vel, sub(gk.pos, ball.pos)) <= 0;
  1842	    if (dNow > reach * SAVE_STRETCH || !receding) return;
  1843	  }
  1844	
  1845	  shot.resolved = true;
  1846	  gk.saveAnimTimer = 0.7; // the dive is visible whether it saves or not (27.4)
  1847	  const shooterTeam = match.teams[shot.side];
  1848	  // Reflexes swing save odds by ±11 percentage points around the xG baseline;
  1849	  // the shot's frozen dive difficulty then discounts it — accurate corner
  1850	  // finishes stay hard to save even though the keeper converges on the path.
  1851	  // 0.70 → 0.66 in Phase 29, → 0.63 in 29.1, → 0.48 in Phase 30: every
  1852	  // 30.x structure (6th defender, formations, set keeper distributions)
  1853	  // deleted another slice of the cheap goals-above-xG (breakaways,
  1854	  // scrambles, gifted distributions) that used to carry the scoreline —
  1855	  // 29.2's goals ran +36% OVER xG, 30.3's ran dead even. The shots that
  1856	  // survive a set defence are earned; they convert better. Same trade as
  1857	  // 28.1/29.1, one size bigger.
  1858	  // A placed ball (Phase 32): the keeper is SET and expecting the strike —
  1859	  // the reaction-time difficulty discount barely applies (floor 0.85) and
  1860	  // the base is a set keeper's, not a scrambling one's. Without this the
  1861	  // far-corner curl carried difficulty ~0.25 and 67% of on-target free
  1862	  // kicks went in (probed) — real keepers save most on-frame FKs.
  1863	  let saveP = shot.placed
  1864	    ? clamp(0.7 - shot.xg * 0.6 + (gk.attrs.reflexes - 0.5) * 0.22, 0.08, 0.92) *
  1865	      Math.max(shot.difficulty, 0.85)
  1866	    // Phase 85: the xG discount collapsed saveP to the floor at the meta's
  1867	    // 0.3-0.5 xG (0.48−0.6·xG ⇒ ~0.2), where reflexes' ±11pp couldn't
  1868	    // matter — the keeper had no evolvable answer to manufactured sitters.
  1869	    // Softer collapse (−0.45·xG), stronger reflexes swing (±14pp): elite
  1870	    // keepers now save SOME big chances (real big-chance save% 15-45%),
  1871	    // early-gen shots (xG≈0.16) move ≤+2pp.
  1872	    : clamp(0.48 - shot.xg * 0.45 + (gk.attrs.reflexes - 0.5) * 0.28, 0.1, 0.92) * shot.difficulty;
  1873	
  1874	  // ANGLE CLOSED (Phase 103): a keeper who stood NEAR the shooter at the
  1875	  // strike made the goal small — the one credit the save model never paid,
  1876	  // which is why closing down (and the whole 出击 school) could never win.
  1877	  // Frozen at shot time; chips and placed balls carry 0 (the chip is the
  1878	  // designed counter to the advanced keeper). Early-gen shots from range
  1879	  // are untouched by construction (closeIn ≈ 0 beyond 7m).
  1880	  // (Phase 106 swept a closeIn DIFFICULTY FLOOR here — max(difficulty,
  1881	  // cI·0.85) and ·1.2 — against the measured walk-in strike (goals hit
  1882	  // ~6.5m out, keeper ~3.4m, difficulty 0.35, cI 0.52, conversion 72-79%):
  1883	  // per-shot arithmetic moved, 24-gen warming totals did NOT (15.88/17.36
  1884	  // vs baseline 15.72 — re-roll noise), keeperAggression adoption didn't
  1885	  // shift, and one world held conv 72% regardless. Deleted per the
  1886	  // phase-95 anchor discipline; evidence in scripts/probes/final15-anatomy.ts.)
  1887	  // Angle covered (119b) shares closeIn's slope via max() — the two credits
  1888	  // describe the same physical fact (a smaller goal) from different ranges
  1889	  // and must never compound.
  1890	  saveP = Math.min(0.95, saveP * (1 + Math.max(shot.closeIn ?? 0, shot.coverage ?? 0) * 0.9));
  1891	
  1892	  if (match.rng.chance(saveP)) {
  1893	    shooterTeam.stats.shotsOnTarget++;
  1894	    defTeam.stats.saves++;
  1895	    match.stat(gk.gid).saves++;
  1896	    match.markShotOutcome('saved');
  1897	    if (dNow <= reach && speed < 21 && match.rng.chance(0.8)) {
  1898	      match.pushEvent('save', defSide, `${gk.name} catches it`);
  1899	      match.giveBall(gk);
  1900	    } else {
  1901	      // A parry deflects the shot rather than reversing it: the ball is
  1902	      // pushed wide of the goal — often behind for a corner, sometimes loose
  1903	      // in the box for a scramble. (The old inward "bounce-back" parry is why
  1904	      // corners never happened.)
  1905	      const inDir = norm(ball.vel);
  1906	      const side = ball.pos.y >= 0 ? 1 : -1;
  1907	      const ang = side * Math.sign(inDir.x || 1) * match.rng.range(0.55, 1.15);
  1908	      ball.vel = scale(rotate(inDir, ang), clamp(len(ball.vel) * 0.45, 7, 12));
  1909	      ball.lastTouch = gk;
  1910	      gk.kickCooldown = 0.6; // let the parry leave the keeper's feet
  1911	      match.pushEvent('save', defSide, `${gk.name} parries!`);
  1912	    }
  1913	  }
  1914	  // A failed attempt just lets the ball continue — goal or miss.
  1915	}

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/ai/actionExecutor.ts | sed -n '1,380p'; nl -ba src/ai/actionExecutor.ts | sed -n '381,680p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	import { clamp } from '../utils/math';
     2	import { add, dist, norm, scale, sub, v2, type V2 } from '../utils/vec';
     3	import { BOX_DEPTH, BOX_WIDTH, CONTROL_MAX_HEIGHT, CORNER_CLEARANCE, GOAL_WIDTH, HALF_L, HALF_W } from '../sim/constants';
     4	import type { Match } from '../sim/Match';
     5	import type { Player } from '../sim/Player';
     6	import type { Role } from '../sim/types';
     7	import {
     8	  cornerCrashSpots, cornerKeyZone, fkWallSlots, formationSpot, offsideLineLocalX, runTarget,
     9	  supportSpot,
    10	} from './formations';
    11	import { ballLanding, escapeCarry, interceptBall } from './perception';
    12	import { arrive, avoidOpponents, separation } from './steering';
    13	
    14	/**
    15	 * Turns the player's current (discrete) action into a desired velocity every
    16	 * frame. Dynamic targets — moving balls, moving opponents, sliding formation
    17	 * spots — are recomputed here each frame so actions never chase stale data.
    18	 */
    19	export function executeAction(p: Player, match: Match, dt: number): void {
    20	  const team = match.teams[p.side];
    21	  const opp = match.teams[1 - p.side];
    22	  const g = team.genome;
    23	  const ball = match.ball;
    24	  const hasBall = match.possessionSide === team.side;
    25	
    26	  // staminaConservation is a real trade-off: misers jog slower AND press with
    27	  // less sprint (weaker pressing, fresher legs late in the match).
    28	  const conserve = g.staminaConservation;
    29	  const jog = 0.78 - conserve * 0.25;
    30	  const sprint = 1 - conserve * 0.12;
    31	  let target: V2 | null = null;
    32	  let speedF = jog;
    33	  p.faceTarget = null; // per-frame; only keeper cases set it (backpedal, 27.5)
    34	  if (p.action.type !== 'MarkOpponent' && p.markAnchor) {
    35	    p.markAnchor = null; // a stale anchor must not survive an action change
    36	    p.markAnchorAge = 0;
    37	  }
    38	
    39	  switch (p.action.type) {
    40	    case 'MoveToFormationSpot':
    41	    case 'HoldPosition': {
    42	      target = formationSpot(p, team, ball, hasBall, opp);
    43	      // Hurry back if badly out of position. (A phase-106 "hurry when
    44	      // beaten" trigger was built and MEASURED OUT here: during walk-in
    45	      // breakaways the beaten men are 60-88% in MarkOpponent/ChaseBall —
    46	      // this branch owns only ~12-18% of their frames — and 24-gen warming
    47	      // totals didn't move. final15-anatomy.ts carries the evidence.)
    48	      if (dist(p.pos, target) > 14) speedF = 0.95 - conserve * 0.2;
    49	      // THE RETREAT SCHOOL (Phase 112, drop-and-recover): for 3s after
    50	      // losing the ball the spot-holders RUN home instead of jogging —
    51	      // getting the shape set before the counter launches IS the school
    52	      // (the 106 hurry trigger failed because it fired on "beaten", not
    53	      // on the transition; this fires on the loss clock, for the gene
    54	      // that pays for it). tp ≥ 0 is exactly today's speeds.
    55	      if (!hasBall && match.phase === 'playing') {
    56	        const tp = ((g.transitionPress ?? 0.5) - 0.5) * 2;
    57	        if (tp < 0 && match.simTime - opp.possessionGainedAt < 3.0) {
    58	          speedF = Math.max(speedF, jog + -tp * (0.95 - conserve * 0.2 - jog));
    59	        }
    60	      }
    61	      break;
    62	    }
    63	    case 'ChaseBall': {
    64	      // THE JOCKEY (Phase 87, the Van Dijk school): against a CARRIER, a
    65	      // jockeying team's chaser takes the carrier-goal line at standoff
    66	      // distance instead of diving at the ball. Positioning IS the
    67	      // mechanism: a body goal-side is exactly what kills the composed
    68	      // 1v1 (performShot checks it), and the overlap resolver + slalom
    69	      // make the contained carrier go AROUND — chase time, blunted drive.
    70	      const carrier = ball.owner;
    71	      const jockey = team.genome.jockeyBias ?? 0.5;
    72	      // Phase 92 (the A/B verdict): ONLY the goal-side man jockeys — a
    73	      // pursuer from behind detouring to the standoff point was a free
    74	      // escort downfield (the mispricing that made 0.9-jockey LOSE the
    75	      // head-to-head). Behind the carrier = chase the ball, old-style.
    76	      // Phase 101: with HYSTERESIS — the razor-edge −0.2 test flipped the
    77	      // target 66-70×/match for a chaser dancing on the boundary
    78	      // (hold-jitter.ts). Enter containment only clearly goal-side
    79	      // (gap > 0.6), hold it until clearly not (gap < 0.1).
    80	      const gap = carrier !== null
    81	        ? team.localX(carrier.pos.x) - team.localX(p.pos.x)
    82	        : -Infinity;
    83	      const goalSideOfCarrier = p.containing ? gap > 0.1 : gap > 0.6;
    84	      // Phase 92 second cut: standoff at TACKLE-RANGE EDGE (2.1m parked the
    85	      // contain man permanently outside the 1.15m challenge radius — the
    86	      // collapse could never convert), and NO jockeying in the danger zone:
    87	      // inside ~28m of the own goal, real defenders engage.
    88	      const dangerZone = carrier !== null && team.localX(carrier.pos.x) < -17;
    89	      if (carrier && carrier.side !== p.side && jockey > 0.25 && goalSideOfCarrier && !dangerZone) {
    90	        p.containing = true;
    91	        const toGoal = norm(sub(team.ownGoal(), carrier.pos));
    92	        const standoff = 0.9 + jockey * 0.5;
    93	        target = add(carrier.pos, scale(toGoal, standoff));
    94	        speedF = sprint;
    95	        break;
    96	      }
    97	      p.containing = false;
    98	      const sol = interceptBall(p, ball);
    99	      target = sol.point;
   100	      speedF = sprint;
   101	      break;
   102	    }
   103	    case 'ReceivePass':
   104	    case 'InterceptPass': {
   105	      // Attack the DESCENT, not the drop (Phase 63 — the 31.9 corner
   106	      // principle in open play): a lofted delivery is headable only in its
   107	      // last ~2.6m of flight, so the intercept solution parked the receiver
   108	      // ON the landing — where the ball arrives at his FEET, in the
   109	      // goal-side defenders' laps (probed: attacker headers 1-10% of
   110	      // crosses, 45% of deliveries eaten on the ground by the defence).
   111	      // While the delivery flies ABOVE control height, the intended
   112	      // receiver routes 2.5m upstream along the flight line and meets the
   113	      // band; once it drops low the normal intercept chase resumes.
   114	      if (
   115	        p.action.type === 'ReceivePass' &&
   116	        ball.owner === null &&
   117	        ball.z > CONTROL_MAX_HEIGHT
   118	      ) {
   119	        const { x: lx, y: ly } = ballLanding(ball);
   120	        const vl = Math.hypot(ball.vel.x, ball.vel.y) || 1;
   121	        target = { x: lx - (ball.vel.x / vl) * 2.5, y: ly - (ball.vel.y / vl) * 2.5 };
   122	      } else {
   123	        const sol = interceptBall(p, ball);
   124	        target = sol.point;
   125	      }
   126	      speedF = sprint;
   127	      break;
   128	    }
   129	    case 'MarkOpponent': {
   130	      const markIdx = p.action.targetIdx;
   131	      const mark = markIdx !== undefined ? opp.players[markIdx] : null;
   132	      if (mark) {
   133	        // Goal-side AND ball-side (Phase 27): the stance blends "between my
   134	        // man and our goal" with "between my man and the ball", so markers
   135	        // shadow the passing lane and anticipated balls can be cut out.
   136	        // Containing the CARRIER (29.1) stands off at 2.6m — jockey and
   137	        // delay; closing to tackle range turned every contain into a bonus
   138	        // tackler and strangled scoring (tackles +3/match).
   139	        // Stance floor 0.8 → 1.2m (Phase 30.5): the tightest markers parked
   140	        // INSIDE tackle radius (1.15m), so every marked reception was a
   141	        // snap dispossession — receivers never survived their settle touch
   142	        // and possession chains died at the first marked man. Kept at 1.2
   143	        // (not 1.6): halving the slope entirely inverted the
   144	        // markingAggression gene's recover-more edge (genes.test) — the
   145	        // stance IS that gene's main payoff channel (failure mode 3).
   146	        let markDist = ball.owner === mark ? 2.6 : 2.6 - g.markingAggression * 1.4;
   147	        // Distribution stand-off (Phase 31.6, user report "开门球挤着对面
   148	        // 队员"): while the mark's keeper stands over a goal kick or holds
   149	        // the ball, markers COVER the lane from 2.0–2.6m instead of body-
   150	        // gluing the receiver — real defenders show the pass and jump it
   151	        // at the kick; the glued stance turned every keeper wait into a
   152	        // box wrestling match (and the goal-kick box clamp only moves
   153	        // opponents in x, so they camped ON the edge millimetres away).
   154	        // Aggression still SCALES the stand-off (2.0 pushy .. 2.6 passive):
   155	        // a flat floor erased the markingAggression payoff channel again
   156	        // (the 30.5 stance-floor lesson, second edition — failure mode 3).
   157	        const oppGk = opp.goalkeeper;
   158	        if (
   159	          (match.restart?.kind === 'goalKick' && match.restart.side === mark.side) ||
   160	          ((oppGk.gkHoldTimer > 0 || oppGk.gkDistributing) && ball.owner === oppGk)
   161	        ) {
   162	          markDist = Math.max(markDist, 2.6 - g.markingAggression * 0.6);
   163	        }
   164	        const goal = team.ownGoal();
   165	        const gx = goal.x - mark.pos.x;
   166	        const gy = goal.y - mark.pos.y;
   167	        const gl = Math.sqrt(gx * gx + gy * gy);
   168	        const nx = gl < 1e-8 ? 0 : gx / gl;
   169	        const ny = gl < 1e-8 ? 0 : gy / gl;
   170	        const bx = ball.pos.x - mark.pos.x;
   171	        const by = ball.pos.y - mark.pos.y;
   172	        const bl = Math.sqrt(bx * bx + by * by);
   173	        // Kept moderate (Phase 27.1): a stronger ball-side pull dragged every
   174	        // marker into the central corridor and fed the crowding complaint.
   175	        const laneW = 0.22 + g.markingAggression * 0.22;
   176	        const mx = nx + (bl < 1e-8 ? 0 : (bx / bl) * laneW);
   177	        const my = ny + (bl < 1e-8 ? 0 : (by / bl) * laneW);
   178	        const ml = Math.sqrt(mx * mx + my * my);
   179	        const dx = ml < 1e-8 ? nx : mx / ml;
   180	        const dy = ml < 1e-8 ? ny : my / ml;
   181	        target = { x: mark.pos.x + dx * markDist, y: mark.pos.y + dy * markDist };
   182	        // THE OFFSIDE TRAP (Phase 109, defensive school #3 — the 21st
   183	        // gene): a high-trap marker REFUSES to be dragged deeper than his
   184	        // SHAPE by an off-ball runner — depth (x) holds at the formation
   185	        // line while y keeps sliding with the man, and the phase-71
   186	        // offside law flags whoever the ball is played to beyond the held
   187	        // line. Low trap (≤0.5) = today's tracking exactly. The price is
   188	        // physical, not scripted: a runner ONSIDE at the kick is clean
   189	        // through, and a libero (coverBias) below the line plays everyone
   190	        // onside. The carrier cannot be trapped (no offside on the ball)
   191	        // — the contain/jockey machinery owns him.
   192	        // The trap is sprung BEFORE the ball goes over the top (football
   193	        // law): once the ball is deep in our territory the line is beaten
   194	        // and EVERYONE tracks. The first build held unconditionally — deep
   195	        // runners stood unmarked in the box, trapBias railed to 0.08 under
   196	        // selection and one warming world hit 8.5 goals/match. Same -17
   197	        // danger-zone boundary as the jockey (Phase 92).
   198	        const trapHold = ((g.trapBias ?? 0.5) - 0.5) * 2;
   199	        const ballDeep = team.localX(ball.pos.x) < -17;
   200	        if (trapHold > 0 && !ballDeep && ball.owner && ball.owner.side !== p.side && ball.owner !== mark) {
   201	          const spot = formationSpot(p, team, ball, hasBall, opp);
   202	          if (team.localX(target.x) < team.localX(spot.x)) {
   203	            target = { x: target.x + (spot.x - target.x) * trapHold, y: target.y };
   204	          }
   205	        }
   206	        // Marker REACTION LAG (Phase 31.9, the headed-game pass): a marker
   207	        // tracking a SPRINTING mark near our goal re-reads the stance
   208	        // target on his reaction cadence (0.2–0.45s by defending), not
   209	        // per-frame. Frame-perfect shadowing meant the goal-side man met
   210	        // every delivery first (HEADER_RADIUS is 1.35m — a crash that
   211	        // earns more separation than that heads UNCONTESTED) and the
   212	        // attacking header had gone extinct at ~0.33 shots/match. A
   213	        // standing striker stays tight: he barely moves between refreshes.
   214	        const markSpeed = Math.hypot(mark.vel.x, mark.vel.y);
   215	        if (ball.owner !== mark && markSpeed > 4.5 && dist(mark.pos, team.ownGoal()) < 26) {
   216	          p.markAnchorAge += dt;
   217	          const lag = 0.45 - p.attrs.defending * 0.25;
   218	          if (!p.markAnchor || p.markAnchorIdx !== markIdx || p.markAnchorAge >= lag) {
   219	            p.markAnchor = { x: target.x, y: target.y };
   220	            p.markAnchorIdx = markIdx ?? null;
   221	            p.markAnchorAge = 0;
   222	          }
   223	          target = p.markAnchor;
   224	        } else {
   225	          p.markAnchor = null;
   226	          p.markAnchorAge = 0;
   227	        }
   228	        speedF = 0.85 + g.markingAggression * 0.15;
   229	      } else {
   230	        target = formationSpot(p, team, ball, hasBall, opp);
   231	      }
   232	      break;
   233	    }
   234	    case 'SupportBallCarrier': {
   235	      target = supportSpot(p, team, ball);
   236	      speedF = (team.mode === 'CounterAttack' ? 1 : 0.9) - conserve * 0.15;
   237	      break;
   238	    }
   239	    case 'MakeRun': {
   240	      // Attacking run in behind — a full sprint, recomputed each frame so
   241	      // the run bends with the defensive line. Corner setups (Phase 31)
   242	      // route the licensed bodies instead: crashers attack the ROUTINE's
   243	      // crash spots (primary/secondary/rebound by stable rank), the extra
   244	      // license (team.arriver) goes to the routine's key zone. In open
   245	      // play the arriver attacks the edge-of-box arc — the late body a
   246	      // byline cutback finds.
   247	      // 门将上前 (Phase 35): the licensed keeper attacks the penalty-spot
   248	      // area — an extra unmarked body the defense never accounted for.
   249	      if (p.role === 'GK' && team.keeperUp) {
   250	        target = v2(team.attackDir * (HALF_L - 9), clamp(p.pos.y * 0.2, -4, 4));
   251	        speedF = sprint;
   252	        break;
   253	      }
   254	      const r = match.restart;
   255	      const cc = team.cornerCrash;
   256	      const liveCorner = r?.kind === 'corner' && r.side === p.side;
   257	      // The crash keeps running through the hand-off + flight (31.9).
   258	      const crash = liveCorner
   259	        ? { routine: r!.routine, y: r!.pos.y, burst: r!.timer >= 1.7 }
   260	        : cc !== null && match.simTime < cc.until
   261	          ? { routine: cc.routine as typeof cc.routine | undefined, y: cc.y, burst: true }
   262	          : null;
   263	      if (crash && team.runners.has(p.index)) {
   264	        const ranked = [...team.runners].sort((a, b) => a - b);
   265	        const spots = cornerCrashSpots(crash.routine, team.attackDir, crash.y);
   266	        const spot = spots[ranked.indexOf(p.index) % 3];
   267	        // Attack the MEET point, not the landing (31.9): the delivery
   268	        // crosses the header band (z 2.5→1.35) in its last ~2.6m of flight,
   269	        // so a crasher standing ON the landing watches the ball sail past
   270	        // his face 3m short — shift the attack 2.5m flag-side along the
   271	        // flight line and the run meets the descent in the band.
   272	        let fx = spot.x - team.attackDir * HALF_L;
   273	        let fy = spot.y - crash.y;
   274	        let fl = Math.hypot(fx, fy) || 1;
   275	        let meet = v2(spot.x - (fx / fl) * 2.5, spot.y - (fy / fl) * 2.5);
   276	        // The delivery is UP: real crashers adjust to the actual flight.
   277	        // Corner noise scatters the landing ~2.6m σ laterally — a crasher
   278	        // pinned to the table spot watches half the deliveries drop out of
   279	        // HEADER_RADIUS (1.35m). The closest licensed crasher re-routes to
   280	        // the true descent (friction-free parabola, exact); the others keep
   281	        // their structure spots for the knockdown and the rebound.
   282	        if (!r && ball.owner === null && (ball.z > 0 || ball.vz !== 0)) {
   283	          const { x: landX, y: landY } = ballLanding(ball);
   284	          let closest = -1;
   285	          let bd = Infinity;
   286	          for (const idx of ranked) {
   287	            const q = team.players[idx];
   288	            if (q.sentOff) continue;
   289	            const d = Math.hypot(q.pos.x - landX, q.pos.y - landY);
   290	            if (d < bd) {
   291	              bd = d;
   292	              closest = idx;
   293	            }
   294	          }
   295	          if (closest === p.index) {
   296	            fx = ball.vel.x;
   297	            fy = ball.vel.y;
   298	            fl = Math.hypot(fx, fy) || 1;
   299	            meet = v2(landX - (fx / fl) * 2.5, landY - (fy / fl) * 2.5);
   300	          }
   301	        }
   302	        // The TIMED crash (Phase 31.9, the headed-game pass): during setup a
   303	        // crasher HOLDS 4.5m off his spot (still inside the taker's 7m wait
   304	        // gate) and only bursts through it as the taker steps up (corner
   305	        // minSetup is 2.0s). Pre-positioned crashers stood ON the landing
   306	        // waiting — a static box the set marker always won; the delivery
   307	        // aims at the routine's key zone, and the marker reaction lag above
   308	        // needs an actual sprint to fall behind. Separation is born here.
   309	        target = crash.burst ? meet : v2(meet.x - team.attackDir * 4.5, meet.y);
   310	      } else if (team.arriver === p.index) {
   311	        target =
   312	          crash && (crash.routine === 'short' || crash.routine === 'arcCutback')
   313	            ? cornerKeyZone(crash.routine, team.attackDir, crash.y)
   314	            : v2((HALF_L - 16) * team.attackDir, clamp(p.pos.y * 0.3, -7, 7));
   315	      } else if (team.overlapper === p.index && ball.owner && ball.owner.side === p.side) {
   316	        // 套边 (Phase 34): around the OUTSIDE of the wide carrier, hugging
   317	        // the touchline past him — the lane the release ball is led into.
   318	        const c = ball.owner;
   319	        target = v2(
   320	          clamp(c.pos.x + team.attackDir * 13, -HALF_L + 2, HALF_L - 2),
   321	          Math.sign(c.pos.y || 1) * (HALF_W - 2.5),
   322	        );
   323	      } else {
   324	        target = runTarget(p, team, opp.players);
   325	      }
   326	      speedF = sprint;
   327	      break;
   328	    }
   329	    case 'Dribble': {
   330	      target = dribbleTarget(p, match);
   331	      // Dribbling is slower than free running; close control (technique)
   332	      // lets a carrier keep more of their pace (Phase 27).
   333	      speedF = 0.84 + p.attrs.dribbling * 0.1;
   334	      break;
   335	    }
   336	    case 'Pass':
   337	    case 'LoftedPass':
   338	    case 'ThroughBall':
   339	    case 'Cross':
   340	    case 'Shoot':
   341	    case 'ClearBall': {
   342	      // Kick already happened at decision time — brief follow-through.
   343	      target = null;
   344	      break;
   345	    }
   346	    case 'HoldUp': {
   347	      // Pivot shield (Phase 28): keep the body between ball and defender —
   348	      // a slow drift away from the nearest opponent, chest toward our own
   349	      // half so the lay-off is played with the facing, not against it.
   350	      let near: Player | null = null;
   351	      let nearD = Infinity;
   352	      for (const o of opp.players) {
   353	        if (o.sentOff) continue;
   354	        const d = dist(o.pos, p.pos);
   355	        if (d < nearD) {
   356	          nearD = d;
   357	          near = o;
   358	        }
   359	      }
   360	      if (near && nearD > 1e-6) {
   361	        const ax = (p.pos.x - near.pos.x) / nearD;
   362	        const ay = (p.pos.y - near.pos.y) / nearD;
   363	        target = { x: p.pos.x + ax * 1.4, y: p.pos.y + ay * 1.4 };
   364	      } else {
   365	        target = p.pos;
   366	      }
   367	      speedF = 0.35;
   368	      p.faceTarget = team.ownGoal();
   369	      break;
   370	    }
   371	    case 'GoalkeeperSave': {
   372	      const sol = interceptBall(p, ball);
   373	      // Never leave the goal area chasing a shot.
   374	      target = clampToBox(sol.point, team.attackDir);
   375	      speedF = 1;
   376	      p.faceTarget = ball.pos;
   377	      break;
   378	    }
   379	    case 'GoalkeeperRush': {
   380	      // 1v1 (Phase 27.5): charge the ball at full sprint — deliberately NOT
   381	      // clamped to the box; an aggressive keeper sweeps outside it.
   382	      target = ball.pos;
   383	      speedF = 1;
   384	      p.faceTarget = ball.pos;
   385	      break;
   386	    }
   387	    case 'GoalkeeperPosition': {
   388	      p.faceTarget = ball.pos; // backpedal facing the play (27.5)
   389	      // 追分清道夫 (Phase 35): from the 89th minute a trailing keeper
   390	      // supports a sustained attack from around HALFWAY — his goal stands
   391	      // empty (the chase's price), and the corner license (keeperUp) only
   392	      // has to carry him the last 45m instead of the full pitch.
   393	      if (
   394	        team.mentality.urgency > 0.5 &&
   395	        match.half === 2 &&
   396	        match.minute() >= 89 &&
   397	        match.possessionSide === p.side &&
   398	        team.localX(ball.pos.x) > 10
   399	      ) {
   400	        target = v2(-team.attackDir * 2, clamp(ball.pos.y * 0.3, -10, 10));
   401	        speedF = 1;
   402	        break;
   403	      }
   404	      // Flat form of add(goal, scale(sub(ball.pos, goal), k)) — every frame for keepers.
   405	      const goal = team.ownGoal();
   406	      const out = 2.5 + g.keeperAggression * 7;
   407	      const tbx = ball.pos.x - goal.x;
   408	      const tby = ball.pos.y - goal.y;
   409	      const d = Math.max(Math.sqrt(tbx * tbx + tby * tby), 0.1);
   410	      // Stand your ground (Phase 28.4): never backpedal INTO the goalmouth —
   411	      // hold ~2m off the line so the 1v1 duel happens out here, not with the
   412	      // carrier's studs on the keeper's chest at the post.
   413	      const k = Math.max(Math.min(out, d * 0.5), Math.min(2.0, d * 0.9)) / d;
   414	      target = clampToBox({ x: goal.x + tbx * k, y: goal.y + tby * k }, team.attackDir);
   415	      // Free-kick stance (Phase 32): the wall covers one side of the goal,
   416	      // the keeper cheats a step toward the NEAR post to own the other.
   417	      if (match.fkWall && match.fkWall.side === p.side) {
   418	        target = {
   419	          x: target.x,
   420	          y: clamp(target.y + Math.sign(match.fkWall.pos.y || 1) * 1.0, -GOAL_WIDTH / 2 + 0.5, GOAL_WIDTH / 2 - 0.5),
   421	        };
   422	      }
   423	      speedF = 0.9;
   424	      break;
   425	    }
   426	  }
   427	
   428	  // Free-kick WALL (Phase 32): the assigned bodies stand ON the ball–goal
   429	  // line at the clearance edge and brace, facing the ball. Their slot IS
   430	  // their steering target — the clearance clamps never fight them (the
   431	  // wall IS the clearance for a close FK), and the teammate-separation
   432	  // push is skipped below (a wall packs tighter than the anti-stack radius).
   433	  let inWall = false;
   434	  const wall = match.fkWall;
   435	  if (wall && p.side === wall.side) {
   436	    const slot = wall.gids.indexOf(p.gid);
   437	    if (slot >= 0) {
   438	      inWall = true;
   439	      target = fkWallSlots(wall.pos, team.ownGoal(), wall.gids.length)[slot];
   440	      speedF = 0.95;
   441	      p.faceTarget = wall.pos;
   442	    }
   443	  }
   444	
   445	  // Stay onside (Phase 29): while a TEAMMATE is carrying the ball, off-ball
   446	  // attackers never target a spot beyond the offside line — runs hold at the
   447	  // second-last defender's shoulder and break the instant the kick is struck
   448	  // (a ball in flight has no owner, so the hold releases by itself). This is
   449	  // also how attackers stranded beyond the line drift back onside. The hold
   450	  // depth is LAYERED by role (29.1): one shared depth parked every attacker
   451	  // on the same flat strip, their markers interleaved on it, and the band
   452	  // read as a single blob — the striker toes the line, wingers and mids
   453	  // stagger behind like a real attacking shape.
   454	  const carrier = ball.owner;
   455	  if (target && carrier && carrier !== p && carrier.side === p.side && p.role !== 'GK') {
   456	    // (Phase 109 note: a lagged line-read for runners was built and
   457	    // MEASURED OUT here — with it the trap gene's offside yield DROPPED
   458	    // 1.68→1.38/match, because a stale read of a RISING line makes the
   459	    // runner hold conservatively. Frame-perfect onside discipline turned
   460	    // out not to block the trap at all — the passer's decision cadence is
   461	    // misjudgment enough. trap-ab.ts carries the numbers.)
   462	    const holdX =
   463	      offsideLineLocalX(team, opp.players, team.localX(ball.pos.x)) - HOLD_DEPTH[p.role];
   464	    if (team.localX(target.x) > holdX) target = { x: holdX * team.attackDir, y: target.y };
   465	  }
   466	
   467	  // Barred-box discipline (Phase 31.9, user report "门球时盯人球员往禁区里
   468	  // 挤,抽搐"): while a goal kick or a keeper hold bars this player from the
   469	  // opposing box, STEER to the box edge instead of into it. Match's hard
   470	  // clamp (the rule) still exists, but a target inside the box made steering
   471	  // fight it — drive in, get teleported out, every frame: the twitch. The
   472	  // steering target rides 0.4m outside the clamp line so it never triggers.
   473	  const restart = match.restart;
   474	  const barred =
   475	    (restart?.kind === 'goalKick' && restart.side !== p.side) ||
   476	    ((opp.goalkeeper.gkHoldTimer > 0 || opp.goalkeeper.gkDistributing) && ball.owner === opp.goalkeeper);
   477	  const oppGoalX = opp.attackDir < 0 ? HALF_L : -HALF_L; // opp defends this line
   478	  const edgeX = oppGoalX - Math.sign(oppGoalX) * (BOX_DEPTH + 0.8);
   479	  if (target && barred && p.role !== 'GK' && Math.abs(target.y) < BOX_WIDTH / 2 + 0.5) {
   480	    if (oppGoalX > 0 ? target.x > edgeX : target.x < edgeX) {
   481	      target = { x: edgeX, y: target.y };
   482	    }
   483	  }
   484	
   485	  // arrive/scale return fresh vectors, so accumulating into `desired` in place
   486	  // is alias-free — same additions in the same order, two fewer allocations
   487	  // per player per frame.
   488	  const desired = target ? arrive(p, target, p.topSpeed * speedF, 2.2) : scale(p.vel, 0.4);
   489	
   490	  // Steering blend: hard anti-stacking vs teammates + soft path avoidance.
   491	  // Wall members skip it — shoulder-to-shoulder IS the assignment.
   492	  if (!inWall) {
   493	    const sep = separation(p, team.players, 2.4, 2.5);
   494	    desired.x += sep.x;
   495	    desired.y += sep.y;
   496	  }
   497	  if (p.action.type === 'MoveToFormationSpot' || p.action.type === 'SupportBallCarrier') {
   498	    const av = avoidOpponents(p, desired, opp.players);
   499	    desired.x += av.x;
   500	    desired.y += av.y;
   501	  }
   502	
   503	  // Barred-box backstop, velocity level: separation between two markers
   504	  // standing shoulder-to-shoulder ON the edge line can still shove one of
   505	  // them inward past the target clamp above — kill the into-box component
   506	  // for anyone already at the line, whatever pushed them.
   507	  if (barred && p.role !== 'GK' && Math.abs(p.pos.y) < BOX_WIDTH / 2 + 0.5) {
   508	    const inward = Math.sign(oppGoalX - edgeX);
   509	    if ((p.pos.x - edgeX) * inward > -0.3 && desired.x * inward > 0) desired.x = 0;
   510	  }
   511	
   512	  // Facing polish (Phase 51.2, user report): a keeper HOLDING the ball
   513	  // squares up toward the opponent goal — he surveys the pitch, and the
   514	  // held ball (glued 0.3m along his heading) comes around with him instead
   515	  // of pointing at the net he just saved. Same for a restart TAKER standing
   516	  // over the ball (free kick / corner / kick-in / goal kick): once he has
   517	  // arrived at the spot he faces the play, not the walk-up direction.
   518	  // Post-switch on purpose: these states override any case's facing.
   519	  if (p.role === 'GK' && ball.owner === p && (p.gkHoldTimer > 0 || p.gkDistributing)) {
   520	    p.faceTarget = team.oppGoal();
   521	  } else if (
   522	    match.restart !== null &&
   523	    match.restart.takerGid === p.gid &&
   524	    dist(p.pos, match.restart.pos) < 2.5
   525	  ) {
   526	    p.faceTarget = team.oppGoal();
   527	  }
   528	
   529	  p.desiredVel = desired;
   530	}
   531	
   532	/** Onside hold depth below the line, by role (29.1) — layers the shape.
   533	 * Kept shallow: −2.6/−1.2 visibly staggered but cost too many arrivals. */
   534	const HOLD_DEPTH: Record<Role, number> = { GK: 0, DF: 3.0, MF: 1.8, WG: 0.8, ST: 0.4 };
   535	
   536	/** Dribble toward goal, bending away from the nearest defender ahead —
   537	 * or DOWN THE LINE toward the byline when wide and advanced (Phase 31,
   538	 * 下底): the same steering decideCarrier's wide-drive space check scored,
   539	 * so the legs go where the utility looked. */
   540	function dribbleTarget(p: Player, match: Match): V2 {
   541	  const team = match.teams[p.side];
   542	  const opp = match.teams[1 - p.side];
   543	  const localX = team.localX(p.pos.x);
   544	  // 脱压带球 (34.2): same predicate the scorer used — pressured, front door
   545	  // closed, outside the final third ⇒ carry it AWAY from the press. Never
   546	  // into the own box (the calm-reset family lives there). Same holding
   547	  // flag as the scorer (Phase 35) so the utility and the legs agree.
   548	  const esc = escapeCarry(p, team.attackDir, localX, opp.players, team.mentality.holding > 0.5);
   549	  if (esc) {
   550	    const t = add(p.pos, scale(esc.dir, 5));
   551	    const minLocal = -(HALF_L - BOX_DEPTH) + 1;
   552	    if (team.localX(t.x) < minLocal) t.x = minLocal * team.attackDir;
   553	    t.y = clamp(t.y, -HALF_W + 1.5, HALF_W - 1.5);
   554	    return t;
   555	  }
   556	  const wideDrive = Math.abs(p.pos.y) > 13 && localX > 20 && localX < HALF_L - 7;
   557	  const goal = wideDrive
   558	    ? v2((HALF_L - 8) * team.attackDir, Math.sign(p.pos.y) * (HALF_W - 12))
   559	    : team.oppGoal();
   560	  const toGoal = norm(sub(goal, p.pos));
   561	
   562	  // Find the most obstructive opponent within 6m ahead.
   563	  let block: Player | null = null;
   564	  let blockD = Infinity;
   565	  for (const o of opp.players) {
   566	    if (o.sentOff) continue;
   567	    const to = sub(o.pos, p.pos);
   568	    const ahead = to.x * toGoal.x + to.y * toGoal.y;
   569	    if (ahead > 0 && ahead < 6) {
   570	      const d = dist(o.pos, p.pos);
   571	      if (d < blockD) {
   572	        blockD = d;
   573	        block = o;
   574	      }
   575	    }
   576	  }
   577	
   578	  let dir = toGoal;
   579	  if (block) {
   580	    // Slalom: steer perpendicular, away from the blocker's side — and
   581	    // COMMIT to it (Phase 41.2, user report "带球转一大圈然后突然丢球"):
   582	    // a blocker shadowing the carrier right on the goal axis flipped the
   583	    // cross-product sign every few ticks, the steering flip-flopped ±68°,
   584	    // and the body turn-rate cap integrated that into a full pirouette at
   585	    // walking pace — momentum dead, no pace protection, tackle inevitable.
   586	    // A real dribbler picks a shoulder and goes: the side holds 0.6s, and
   587	    // a re-pick at expiry is HYSTERETIC — a shadow sitting ON the axis
   588	    // (|cross| small) keeps the committed shoulder (the first cut re-read
   589	    // the instantaneous sign at every expiry, which against a mirroring
   590	    // defender was a coin flip per 0.6s: the same pirouette, slower).
   591	    // Only a blocker decisively parked off-axis flips it — a real cut.
   592	    let side: 1 | -1;
   593	    if (match.simTime < p.slalomUntil) {
   594	      side = p.slalomSide;
   595	    } else {
   596	      const cross = (block.pos.x - p.pos.x) * toGoal.y - (block.pos.y - p.pos.y) * toGoal.x;
   597	      side = Math.abs(cross) > blockD * 0.3 ? (cross > 0 ? -1 : 1) : p.slalomSide;
   598	      p.slalomSide = side;
   599	      p.slalomUntil = match.simTime + 0.6;
   600	    }
   601	    const perp = v2(-toGoal.y * side, toGoal.x * side);
   602	    // Perp cap 1 → 0.72 (Phase 67 temper): with the 41.2 commitment the
   603	    // full-weight cut rounded engaged defenders so cleanly that penetration
   604	    // depth — not duel survival — ran the league ~+0.6 goals hot (the
   605	    // drive-protection knob measured SATURATED: 0.16→0.14 moved nothing).
   606	    // Capping the blend keeps the committed slalom but leaves the defender
   607	    // a play at close quarters.
   608	    const w = clamp(1 - blockD / 6, 0, 0.72);
   609	    dir = norm(add(scale(toGoal, 1 - w * 0.8), scale(perp, w)));
   610	  }
   611	
   612	  const t = add(p.pos, scale(dir, 6));
   613	  t.x = clamp(t.x, -HALF_L + 1.5, HALF_L - 1.5);
   614	  t.y = clamp(t.y, -HALF_W + 1.5, HALF_W - 1.5);
   615	  return t;
   616	}
   617	
   618	/** Keep goalkeeper targets inside a sane area in front of their own goal. */
   619	function clampToBox(pt: V2, attackDir: 1 | -1): V2 {
   620	  const gx = -attackDir * HALF_L; // own goal line x
   621	  const minX = Math.min(gx, gx + attackDir * 14);
   622	  const maxX = Math.max(gx, gx + attackDir * 14);
   623	  return v2(clamp(pt.x, minX, maxX), clamp(pt.y, -GOAL_WIDTH / 2 - 4, GOAL_WIDTH / 2 + 4));
   624	}

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/ai/TeamBrain.ts | sed -n '1,330p'; nl -ba src/ai/TeamBrain.ts | sed -n '331,560p'; nl -ba src/sim/Team.ts | sed -n '1,260p'; nl -ba src/evolution/playerStyle.ts | sed -n '1,190p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	import { dist } from '../utils/vec';
     2	import { BOX_DEPTH, BOX_WIDTH, HALF_L } from '../sim/constants';
     3	import { cornerKeyZone, formationSpot } from './formations';
     4	import { ballLanding } from './perception';
     5	import { aerialSense } from '../sim/mechanics';
     6	import type { Match } from '../sim/Match';
     7	import type { Player } from '../sim/Player';
     8	import type { Team } from '../sim/Team';
     9	import type { CornerRoutine, RestartState, Role, TeamMode } from '../sim/types';
    10	
    11	/**
    12	 * TeamBrain — picks one tactical mode for the whole team and hands out
    13	 * coordination assignments (who presses, who marks whom) so that players
    14	 * don't all chase the ball. Runs every TEAM_AI_INTERVAL and immediately
    15	 * after possession changes.
    16	 *
    17	 * Mode logic (genes in brackets):
    18	 *  - we have the ball, just won it, ball deep       -> CounterAttack [counterAttackBias]
    19	 *  - we have the ball in their half                 -> Attack
    20	 *  - we have the ball in our half                   -> BuildUp
    21	 *  - they have the ball, we want it back NOW        -> Press [pressIntensity]
    22	 *  - they have the ball, we hold shape              -> Defend
    23	 *  - dead ball / kickoff                            -> ResetShape
    24	 */
    25	export function updateTeamBrain(team: Team, match: Match): void {
    26	  // Restarts are live for coordination: defenders keep marks and pressers
    27	  // crowd the edge of the clearance circle while the taker walks over.
    28	  if (match.phase !== 'playing' && match.phase !== 'restart') {
    29	    team.mode = 'ResetShape';
    30	    team.chasers.clear();
    31	    team.marks.clear();
    32	    team.runners.clear();
    33	    team.arriver = null;
    34	    team.keeperUp = false;
    35	    return;
    36	  }
    37	
    38	  // 门将上前 (Phase 35): trailing in the dying minutes, our own attacking
    39	  // corner — the keeper abandons his goal for the box. The license lives
    40	  // exactly as long as the corner does (setup, hand-off, flight — the
    41	  // 31.9 lesson via team.cornerCrash); the moment it dies he sprints home.
    42	  team.keeperUp =
    43	    team.mentality.urgency > 0.5 &&
    44	    match.half === 2 &&
    45	    match.minute() >= 89 &&
    46	    ((match.phase === 'restart' && match.restart?.kind === 'corner' && match.restart.side === team.side) ||
    47	      (team.cornerCrash !== null && match.simTime < team.cornerCrash.until));
    48	  if (team.keeperUp && !team.keeperUpAnnounced) {
    49	    team.keeperUpAnnounced = true;
    50	    match.pushEvent('info', team.side, `🧤 ${team.goalkeeper.name} is UP for the corner!`);
    51	  }
    52	
    53	  const g = team.genome;
    54	  const ball = match.ball;
    55	  const possession = match.possessionSide; // -1 while the ball is loose
    56	  const prevMode = team.mode;
    57	
    58	  let mode: TeamMode;
    59	  if (possession === team.side) {
    60	    const sinceWin = match.simTime - team.possessionGainedAt;
    61	    const ballLocalX = team.localX(ball.pos.x);
    62	    if (sinceWin < 3.0 && g.counterAttackBias > 0.35 && ballLocalX < 18) {
    63	      mode = 'CounterAttack';
    64	    } else if (ballLocalX > 4) {
    65	      mode = 'Attack';
    66	    } else {
    67	      mode = 'BuildUp';
    68	    }
    69	  } else if (possession === 1 - team.side) {
    70	    // Press appetite: gene + where the ball is (pressing high is more attractive)
    71	    // + hysteresis so the mode doesn't flicker.
    72	    const ballLocalX = team.localX(ball.pos.x);
    73	    // The captain steadies the switch (Phase 39): with the cool head on
    74	    // the pitch, hysteresis is stronger — the team commits to its mode.
    75	    const steady =
    76	      team.captain >= 0 && !team.players[team.captain].sentOff ? 0.04 : 0;
    77	    // THE TRANSITION WINDOW (Phase 112): the 3 seconds after LOSING the
    78	    // ball — the mirror of CounterAttack on the same possession clock.
    79	    // A gegenpress side flips into Press the instant it loses possession;
    80	    // a drop-and-recover side refuses the window and falls into Defend
    81	    // even if its steady-state press would fire. 0.5 = no term at all.
    82	    const sinceLoss = match.simTime - match.teams[1 - team.side].possessionGainedAt;
    83	    const tp = ((g.transitionPress ?? 0.5) - 0.5) * 2;
    84	    const pressScore =
    85	      g.pressIntensity +
    86	      (ballLocalX > 0 ? 0.18 : -0.1) +
    87	      (prevMode === 'Press' ? 0.08 + steady : prevMode === 'Defend' ? -steady : 0) +
    88	      (match.derby ? 0.04 : 0) + // derbies bite (Phase 40)
    89	      (sinceLoss < 3.0 ? tp * 0.22 : 0);
    90	    mode = pressScore > 0.62 ? 'Press' : 'Defend';
    91	  } else {
    92	    // Loose ball: keep the previous shape decision (brief window anyway).
    93	    mode = prevMode === 'ResetShape' ? 'Defend' : prevMode;
    94	  }
    95	
    96	  team.modeTime = mode === prevMode ? team.modeTime : 0;
    97	  team.mode = mode;
    98	
    99	  assignChasers(team, match);
   100	  assignMarks(team, match);
   101	  assignRunners(team, match);
   102	}
   103	
   104	/**
   105	 * Runners: 1–2 attackers licensed to sprint in behind the defensive line
   106	 * while we have the ball — the off-ball movement that makes through balls
   107	 * possible. Capped like chasers so the team never dissolves into everyone
   108	 * running; the carrier and keeper are never runners.
   109	 */
   110	const RUN_ROLE_W: Record<Role, number> = { GK: 0, DF: 0.4, MF: 1.2, WG: 1.8, ST: 2.2 };
   111	
   112	function assignRunners(team: Team, match: Match): void {
   113	  team.runners.clear();
   114	  team.arriver = null;
   115	  // The overlap license survives its own release ball's FLIGHT (the corner
   116	  // lesson, 31.9): the kick clears ball.owner, and a license torn up at
   117	  // that instant strands the runner — and the arriving ball — mid-flight.
   118	  const keepOverlap =
   119	    team.overlapper !== null &&
   120	    match.pendingPass !== null &&
   121	    match.pendingPass.side === team.side &&
   122	    match.pendingPass.targetGid === team.players[team.overlapper].gid;
   123	  if (!keepOverlap) team.overlapper = null;
   124	  if (match.possessionSide !== team.side) return;
   125	  const carrier = match.ball.owner;
   126	  // Corner (Phase 28): flood the box — the three best headers of the ball
   127	  // (aerial sense lives with the DFs and the ST) attack the area while the
   128	  // taker walks over, so the cross has someone to find. The licenses hold
   129	  // THROUGH the hand-off and the flight (Phase 31.9, team.cornerCrash):
   130	  // the restart clears before the kick, and re-licensing generically at
   131	  // that instant pulled every crasher out of the box mid-delivery.
   132	  const liveCorner = match.phase === 'restart' && match.restart?.kind === 'corner' && match.restart.side === team.side;
   133	  const heldCrash = !liveCorner && team.cornerCrash !== null && match.simTime < team.cornerCrash.until;
   134	  if (team.cornerCrash && match.simTime >= team.cornerCrash.until) team.cornerCrash = null;
   135	  if (heldCrash) {
   136	    // Personnel locked at hand-off (31.9): re-scoring here swapped crashers
   137	    // for whoever happened to stand better mid-flight (once the weak-side
   138	    // winger 27m away) and remapped every crash spot under their feet.
   139	    for (const idx of team.cornerCrash!.runners) {
   140	      if (!team.players[idx].sentOff && team.players[idx] !== carrier) team.runners.add(idx);
   141	    }
   142	    const arr = team.cornerCrash!.arriver;
   143	    if (arr !== null && !team.players[arr].sentOff && team.players[arr] !== carrier) team.arriver = arr;
   144	    return;
   145	  }
   146	  if (liveCorner) {
   147	    // Aerial sense × REACHABILITY (Phase 31): the DF is the best header in
   148	    // the game, but the rest-defence clamp parks him ~50m away — a licensed
   149	    // crasher who cannot arrive leaves the primary zone empty (the trace
   150	    // that cracked the 0%-duel-wins corner: the best spots had nobody).
   151	    const flag = match.restart!.pos;
   152	    const routine = match.restart!.routine;
   153	    const takerGid = match.restart!.takerGid;
   154	    // Short/arc routines trade a crasher for the receiver (Phase 31): on a
   155	    // five-outfielder team, three crashers plus the taker leave exactly ONE
   156	    // arriver candidate — usually the worst-placed body on the pitch, and
   157	    // the routine's whole target zone went unattended (probed: the "short"
   158	    // corner crossed 30/30 because the short receiver stood 40m away).
   159	    const crashCount = routine === 'short' || routine === 'arcCutback' ? 2 : 3;
   160	    const scored = team.players
   161	      .filter((p) => p.role !== 'GK' && p.gid !== takerGid && p !== carrier && !p.sentOff)
   162	      .map((p) => ({ p, s: aerialSense(p) - dist(p.pos, flag) / 45 }))
   163	      .sort((a, b) => b.s - a.s || a.p.index - b.p.index);
   164	    for (const { p } of scored.slice(0, crashCount)) team.runners.add(p.index);
   165	    // Routine extra license (Phase 31): the SHORT receiver or the ARC
   166	    // arriver — one more purposeful body, routed by the executor to the
   167	    // routine's key zone. Crash spots for the runners come from the
   168	    // routine's table (executor, cornerCrashSpots).
   169	    if (routine === 'short' || routine === 'arcCutback') {
   170	      const zone = cornerKeyZone(routine, team.attackDir, flag.y);
   171	      let pick: Player | null = null;
   172	      let bd = Infinity;
   173	      for (const p of team.players) {
   174	        if (p.role === 'GK' || p.sentOff || p.gid === takerGid || p === carrier) continue;
   175	        if (team.runners.has(p.index)) continue;
   176	        const d = dist(p.pos, zone);
   177	        if (d < bd) {
   178	          bd = d;
   179	          pick = p;
   180	        }
   181	      }
   182	      if (pick) team.arriver = pick.index;
   183	    }
   184	    return;
   185	  }
   186	  // A second runner for fast/direct sides: counters and high-tempo teams.
   187	  // The late chase (Phase 35) throws one MORE body forward — this is where
   188	  // "everyone forward" physically lives, and where the counters it
   189	  // concedes are born (the chase must cost).
   190	  const count =
   191	    (team.mode === 'CounterAttack' || team.genome.tempo > 0.65 ? 2 : 1) +
   192	    (team.mentality.urgency > 0.65 ? 1 : 0);
   193	  const scored = team.players
   194	    .filter((p) => p.role !== 'GK' && p !== carrier && !p.sentOff)
   195	    .map((p) => ({ p, s: RUN_ROLE_W[p.role] + team.localX(p.pos.x) / 45 }))
   196	    .sort((a, b) => b.s - a.s || a.p.index - b.p.index);
   197	  for (const { p } of scored.slice(0, count)) team.runners.add(p.index);
   198	
   199	  // The ARRIVING runner (Phase 31): ball deep and wide in the attacking
   200	  // third — license ONE late body onto the edge-of-box arc so the byline
   201	  // cutback has someone to find. The MF is the natural arriver (the late
   202	  // midfield run is football's canonical cutback target); the weak-side
   203	  // winger stands in when the MF is the carrier, gone, or already running.
   204	  const ballPos = match.ball.pos;
   205	  const ballLocalX = team.localX(ballPos.x);
   206	  // Trigger EARLY (ball entering the wide attacking channel, not already at
   207	  // the byline) so the arriver's late run is underway by the time the
   208	  // carrier reaches the pull-back zone — an arriver licensed at the byline
   209	  // arrives after the moment has gone (failure mode 14: check who's
   210	  // attacking the delivery before tuning the delivery).
   211	  if (ballLocalX > HALF_L - 21 && Math.abs(ballPos.y) > 10) {
   212	    const eligible = (p: Player | undefined): p is Player =>
   213	      p !== undefined && p !== carrier && !p.sentOff && !team.runners.has(p.index);
   214	    const mf = team.players[2];
   215	    const weakWG = ballPos.y > 0 ? team.players[3] : team.players[4];
   216	    const pick = eligible(mf) ? mf : eligible(weakWG) ? weakWG : null;
   217	    if (pick) team.arriver = pick.index;
   218	  }
   219	
   220	  // 套边 (Phase 34): a WIDE carrier confronted in the attacking half pulls
   221	  // one trailing teammate around the OUTSIDE. Wide-play genes look for it;
   222	  // narrow sides leave the lane to the carrier's own drive.
   223	  if (
   224	    team.overlapper === null && // a flight-preserved license stands
   225	    carrier &&
   226	    carrier.role !== 'GK' &&
   227	    Math.abs(carrier.pos.y) > 10 &&
   228	    team.localX(carrier.pos.x) > 0 &&
   229	    // Width gene × the evolved overlap appetite (Phase 45) crosses the gate.
   230	    team.genome.attackingWidth * team.policy.overlapW > 0.3
   231	  ) {
   232	    const cLocal = team.localX(carrier.pos.x);
   233	    const confronted = match.teams[1 - team.side].players.some(
   234	      (o) =>
   235	        !o.sentOff &&
   236	        dist(o.pos, carrier.pos) < 5.5 &&
   237	        match.teams[1 - team.side].localX(o.pos.x) < match.teams[1 - team.side].localX(carrier.pos.x) + 0.5,
   238	    );
   239	    if (confronted) {
   240	      let pick: Player | null = null;
   241	      let bd = Infinity;
   242	      for (const p of team.players) {
   243	        if (p.role === 'GK' || p === carrier || p.sentOff) continue;
   244	        if (team.runners.has(p.index) || team.arriver === p.index || p.stamina < 0.3) continue;
   245	        // Same wing (or central enough to swing out); trailing but reachable.
   246	        if (Math.sign(p.pos.y) !== Math.sign(carrier.pos.y) && Math.abs(p.pos.y) > 8) continue;
   247	        const behind = cLocal - team.localX(p.pos.x);
   248	        if (behind < 1 || behind > 24) continue;
   249	        const d = dist(p.pos, carrier.pos);
   250	        if (d < bd) {
   251	          bd = d;
   252	          pick = p;
   253	        }
   254	      }
   255	      if (pick) team.overlapper = pick.index;
   256	    }
   257	  }
   258	}
   259	
   260	/**
   261	 * Corner routine choice (Phase 31): once the defensive picture forms
   262	 * (~0.6s into the setup), the taking side reads the openness of each
   263	 * routine's KEY zone and commits. Deterministic — pure state, fixed
   264	 * iteration order, strict improvement. The short option is discounted:
   265	 * it's the pressure valve when the box is packed, not the default.
   266	 */
   267	export function pickCornerRoutine(match: Match, r: RestartState): CornerRoutine {
   268	  const team = match.teams[r.side];
   269	  const defenders = match.teams[1 - r.side].players;
   270	  const order: CornerRoutine[] = ['farPost', 'nearPost', 'arcCutback', 'short'];
   271	  let best: CornerRoutine = 'farPost';
   272	  let bestScore = -Infinity;
   273	  for (const routine of order) {
   274	    const zone = cornerKeyZone(routine, team.attackDir, r.pos.y);
   275	    let nearest = Infinity;
   276	    for (const d of defenders) {
   277	      if (d.sentOff || d.role === 'GK') continue;
   278	      const dd = dist(d.pos, zone);
   279	      if (dd < nearest) nearest = dd;
   280	    }
   281	    let score = Math.min(nearest, 10) / 10;
   282	    if (routine === 'short') score *= 0.55;
   283	    // The arc strike is the best-converting routine (probed: ~2× the post
   284	    // deliveries) — when its zone is comparably open, take it.
   285	    if (routine === 'arcCutback') score += 0.08;
   286	    if (score > bestScore) {
   287	      bestScore = score;
   288	      best = routine;
   289	    }
   290	  }
   291	  return best;
   292	}
   293	
   294	/**
   295	 * Chasers: outfield players allowed to hunt the ball. Everyone else keeps
   296	 * shape/marks. Count scales with pressing: 1 base, +1 in Press mode, +1 for
   297	 * extreme pressIntensity.
   298	 */
   299	function assignChasers(team: Team, match: Match): void {
   300	  team.chasers.clear();
   301	  const possession = match.possessionSide;
   302	  const weOwn = possession === team.side;
   303	  if (weOwn) {
   304	    // No chasing our own CARRIER — but a LOOSE ball is ours to contest
   305	    // too (36.2, user report "有人去抢球,其他人呆住了"): possession is
   306	    // sticky, so after a squirt/miscontrol/knockdown the nominal owners
   307	    // never sent a body and the 50/50 was a one-team race. One nearest
   308	    // man goes; designed balls stay untouched (the dribble toucher
   309	    // already chases his own push, a pass in flight belongs to its
   310	    // receiver, restarts have a taker).
   311	    if (
   312	      match.ball.owner === null &&
   313	      match.dribbleTouch === null &&
   314	      !(match.pendingPass !== null && match.pendingPass.side === team.side) &&
   315	      match.phase === 'playing'
   316	    ) {
   317	      let best: Player | null = null;
   318	      let bd = Infinity;
   319	      for (const p of team.players) {
   320	        if (p.role === 'GK' || p.sentOff) continue;
   321	        const d = dist(p.pos, match.ball.pos);
   322	        if (d < bd) {
   323	          bd = d;
   324	          best = p;
   325	        }
   326	      }
   327	      if (best) team.chasers.add(best.index);
   328	    }
   329	    return;
   330	  }
   331	  // The opposing keeper has it in their HANDS (Phase 28.1 → 29.1): they are
   332	  // unchallengeable, so pressing is wasted legs. 28.1 kept ONE shadow at the
   333	  // bubble's edge to cut the short outlet — live play read it as a man
   334	  // camped in the keeper's face (reported twice), so now NOBODY presses a
   335	  // held ball: everyone marks up for the distribution, like a goal kick.
   336	  const owner = match.ball.owner;
   337	  // gkDistributing too (31.9): the shape-wait's 0.25s re-arm quanta left
   338	  // timer==0 gaps where a chaser got assigned, charged, and was expelled
   339	  // when the hold re-armed — the "疯狂抽动逼抢" flicker.
   340	  const gkHolding = owner !== null && owner.role === 'GK' && (owner.gkHoldTimer > 0 || owner.gkDistributing);
   341	
   342	  let count = 1;
   343	  if (gkHolding) {
   344	    count = 0;
   345	  } else {
   346	    // One presser, two for a pressing side — NEVER three (Phase 31, user
   347	    // report): real football sends one or two at the ball; everyone else
   348	    // marks or holds the shape. The extreme-pressIntensity third chaser
   349	    // stacked onto Press mode just re-created the swarm.
   350	    if (team.mode === 'Press' || team.genome.pressIntensity > 0.78) count += 1;
   351	    // Loose ball = a DUEL, not a scrum (Phase 30.5): one contester per team.
   352	    // At 2 per team every midfield 50/50 pulled four sprinters plus the
   353	    // support/marking crowd already there, and the won-tackle squirt re-fed
   354	    // the same pile — the reported "乱成一锅粥" loop.
   355	    if (possession === -1) count = Math.min(count, 1);
   356	    // THE TRANSITION WINDOW (Phase 112): for 3s after losing the ball a
   357	    // gegenpress side throws ONE extra body at it — a deliberate, window-
   358	    // bounded exception to the phase-31 "never three" rule (the standing
   359	    // swarm it banned was permanent; the counter-press IS the momentary
   360	    // swarm, and it expires with the window). A drop-and-recover side
   361	    // refuses even its steady-state second presser until the shape is
   362	    // home. 0.5 leaves the phase-31 counts untouched.
   363	    if (match.phase === 'playing') {
   364	      const sinceLoss = match.simTime - match.teams[1 - team.side].possessionGainedAt;
   365	      if (sinceLoss < 3.0) {
   366	        const tp = ((team.genome.transitionPress ?? 0.5) - 0.5) * 2;
   367	        if (tp > 0.3) count = Math.min(count + 1, 3);
   368	        else if (tp < -0.3) count = Math.min(count, 1);
   369	      }
   370	    }
   371	  }
   372	  // Dead ball (Phase 28.3): you can't win a ball nobody may touch — ONE
   373	  // player closes the taker down (blocking the short option, real-football
   374	  // style); the old pack of 2–3 stood pinned at the corner-flag clearance
   375	  // circle jogging on the spot. Goal kicks (Phase 29): ZERO — the taker is
   376	  // the keeper deep in their own box; charging them is pure wasted legs,
   377	  // so everyone marks up for the distribution instead.
   378	  if (match.phase === 'restart') count = match.restart?.kind === 'goalKick' ? 0 : 1;
   379	
   380	  const outfield = team.players.filter((p) => p.role !== 'GK' && !p.sentOff);
   381	  // ATTACK THE DROP (Phase 32.1, user report "大脚高球也应该能被解围"): an
   382	  // opponent's lofted delivery in flight is chased at its LANDING, by
   383	  // whoever gets there fastest — long balls aim at open men by design, so
   384	  // the by-current-ball-distance pick sent a presser who could never
   385	  // arrive (probed: nearest defender averaged 7.6m off the descent, 5%
   386	  // aerial contests, and the hoof was uncontestable in practice).
   387	  // interceptBall already projects the parabola; the chaser just needed
   388	  // to be the right man.
   389	  const pass = match.pendingPass;
   390	  const ball = match.ball;
   391	  if (
   392	    count > 0 && pass && pass.side !== team.side && ball.owner === null &&
   393	    (ball.z > 0.5 || ball.vz > 2)
   394	  ) {
   395	    const land = ballLanding(ball);
   396	    // LONG hoofs into open field only: an unscoped first cut attacked the
   397	    // landing of every cross, corner and chip too — one extra converging
   398	    // defender on every box delivery re-buried the 31.9 headed game and
   399	    // cost 0.77 goals/match at n=568. Box landings belong to the marking
   400	    // scheme; short chips to the through-ball economy.
   401	    const flight = Math.hypot(ball.vel.x, ball.vel.y) * land.t;
   402	    const inOurBox =
   403	      Math.abs(land.y) < BOX_WIDTH / 2 && team.localX(land.x) < -(HALF_L - BOX_DEPTH);
   404	    if (flight > 12 && !inOurBox) {
   405	      let best: Player | null = null;
   406	      let bestT = Infinity;
   407	      for (const p of outfield) {
   408	        const t = dist(p.pos, land) / Math.max(p.topSpeed, 0.1);
   409	        if (t < bestT) {
   410	          bestT = t;
   411	          best = p;
   412	        }
   413	      }
   414	      if (best) {
   415	        team.chasers.add(best.index);
   416	        return;
   417	      }
   418	    }
   419	  }
   420	  const byDist = [...outfield].sort(
   421	    (a, b) => dist(a.pos, match.ball.pos) - dist(b.pos, match.ball.pos) || a.index - b.index,
   422	  );
   423	  for (const p of byDist.slice(0, count)) team.chasers.add(p.index);
   424	}
   425	
   426	/**
   427	 * Marks: each non-chasing outfielder picks the most dangerous unmarked
   428	 * opponent (deepest into our half) within range. Greedy and deterministic.
   429	 *
   430	 * Marking SCHEME (Phase 30, `team.style.scheme`): 'man' marks every ranged
   431	 * threat (the behavior every phase before 30 shipped with); 'zonal' marks a
   432	 * threat only when it ENTERS A DEFENDER'S ZONE (near that defender's
   433	 * defending spot) or our penalty box. Zone defenders otherwise hold the
   434	 * sliding spots — and crucially, engaging a zone runner drags its defender
   435	 * OFF the spot lattice, which is how attacks open a zone up (a first cut
   436	 * that never engaged parked an impenetrable 5-body wall: 3 shots/match
   437	 * conceded, and the league's shot volume collapsed).
   438	 */
   439	function assignMarks(team: Team, match: Match): void {
   440	  team.marks.clear();
   441	  if (match.possessionSide === team.side) return;
   442	
   443	  const zonal = team.style.scheme === 'zonal';
   444	  const opp = match.teams[1 - team.side];
   445	  const carrier = match.ball.owner;
   446	  // Sort by how deep they are in OUR half: smaller localX for them = deeper
   447	  // for us. (A numerically identical pre-sort used to run first; this
   448	  // comparator is a total order — index tiebreak — so one sort decides fully.)
   449	  // The restart taker is not a threat (Phase 29.1): they're pinned to a dead
   450	  // ball the clearance circle already guards, and the assigned chaser blocks
   451	  // the short option — a marker sent there too made TWO men stand uselessly
   452	  // at the corner flag while the box went a body short.
   453	  const takerGid = match.restart?.takerGid;
   454	  const inOurBox = (x: number, y: number): boolean =>
   455	    team.localX(x) < -HALF_L + BOX_DEPTH && Math.abs(y) < BOX_WIDTH / 2;
   456	  const threats = opp.players
   457	    .filter((o) => o.role !== 'GK' && o !== carrier && !o.sentOff && o.gid !== takerGid)
   458	    .sort((a, b) => opp.localX(b.pos.x) - opp.localX(a.pos.x) || a.index - b.index);
   459	
   460	  const free = team.players.filter((p) => p.role !== 'GK' && !team.chasers.has(p.index) && !p.sentOff);
   461	  // Zonal: each free defender's zone is centered on their DEFENDING spot.
   462	  const zones = zonal ? new Map(free.map((p) => [p.index, formationSpot(p, team, match.ball, false, match.teams[1 - team.side])])) : null;
   463	  const used = new Set<number>();
   464	  for (const threat of threats) {
   465	    const boxThreat = inOurBox(threat.pos.x, threat.pos.y);
   466	    let best: { idx: number; d: number } | null = null;
   467	    for (const p of free) {
   468	      if (used.has(p.index)) continue;
   469	      // Width discipline (Phase 28.4): a WIDE winger does not abandon the
   470	      // flank to join a central pile-up — central threats belong to the
   471	      // spine. This is the user-diagnosed collapse: turnover in midfield →
   472	      // wingers tuck in → six bodies in one corridor → playground scramble.
   473	      if (p.role === 'WG' && Math.abs(p.pos.y) > 12 && Math.abs(threat.pos.y) < 8) continue;
   474	      // Zonal: outside our box, only the defender whose ZONE the threat
   475	      // entered may engage — everyone else keeps the lattice.
   476	      if (zones && !boxThreat && dist(zones.get(p.index)!, threat.pos) > 9) continue;
   477	      const d = dist(p.pos, threat.pos);
   478	      if (d < 22 && (best === null || d < best.d)) best = { idx: p.index, d };
   479	    }
   480	    if (best) {
   481	      used.add(best.idx);
   482	      team.marks.set(best.idx, threat.index);
   483	    }
   484	  }
   485	}
     1	import { v2, type V2 } from '../utils/vec';
     2	import type { TacticalGenome } from '../evolution/genome';
     3	import { NEUTRAL_MENTALITY, type Mentality } from '../ai/mentality';
     4	import { HALF_L } from './constants';
     5	import { Player } from './Player';
     6	import type { PlayerAttributes } from '../evolution/playerGenome';
     7	import {
     8	  BENCH_ROLES, DEFAULT_POLICY, ROLES, deriveTeamStyle, emptyStats,
     9	  type CornerRoutine, type PolicyParams, type Role, type Side, type TeamInfo,
    10	  type TeamMatchStats, type TeamMode, type TeamStyle,
    11	} from './types';
    12	
    13	/**
    14	 * One bench body (Phase 61, N2): everything a substitution needs to swap a
    15	 * pitch slot's identity. `role` is NOMINAL (the pick prefers a like-for-like
    16	 * body); on the pitch he assumes the slot he replaces.
    17	 */
    18	export interface BenchEntry {
    19	  rosterIdx: number;
    20	  role: Role;
    21	  name: string;
    22	  attrs: PlayerAttributes;
    23	  age?: number;
    24	  /** His personal-style policy (Phase 54 wire), swapped in with him. */
    25	  policy: PolicyParams;
    26	  used: boolean;
    27	}
    28	
    29	export class Team {
    30	  readonly side: Side;
    31	  /** +1 attacks toward +x, -1 toward -x. */
    32	  readonly attackDir: 1 | -1;
    33	  readonly info: TeamInfo;
    34	  readonly players: Player[];
    35	  /** Utility-policy weights the brains score with (learned for wildcards). */
    36	  readonly policy: PolicyParams;
    37	  /** Per-player policy resolved by index — `rolePolicies[i]`, else `policy`.
    38	   * Elements are swapped when a substitute brings his own appetites on. */
    39	  readonly policies: PolicyParams[];
    40	  /** The bench (Phase 61): roster rows past the starting six. May be empty
    41	   * (ad-hoc TeamInfos, older tests) — then no substitutions ever happen. */
    42	  readonly bench: BenchEntry[];
    43	  /** Substitutions made (SUBS_MAX caps them; no re-entry). */
    44	  subsUsed = 0;
    45	  /** Tactical identity (Phase 30): formations + marking scheme, resolved once. */
    46	  readonly style: TeamStyle;
    47	
    48	  /** Morale × sensitivity in [-1, 1] (Phase 111); 0 = the neutral game. */
    49	  readonly confidence: number;
    50	
    51	  mode: TeamMode = 'ResetShape';
    52	  modeTime = 0;
    53	  brainTimer = 0;
    54	
    55	  /** Player indices currently assigned to chase/press the ball. */
    56	  chasers = new Set<number>();
    57	  /** Marking assignments: our player index -> opponent player index. */
    58	  marks = new Map<number, number>();
    59	  /** Player indices assigned to make attacking runs in behind (in possession). */
    60	  runners = new Set<number>();
    61	  /**
    62	   * The ARRIVING runner (Phase 31): one player licensed to attack the
    63	   * edge-of-box arc late when the ball is deep and wide — the body a
    64	   * byline cutback is pulled back for. null = no cutback situation.
    65	   */
    66	  arriver: number | null = null;
    67	  /**
    68	   * 套边 (Phase 34): one trailing teammate licensed to overlap OUTSIDE a
    69	   * confronted wide carrier — the executor routes him down the touchline
    70	   * past the ball. null = no overlap situation.
    71	   */
    72	  overlapper: number | null = null;
    73	  /**
    74	   * Corner crash state persisted THROUGH the hand-off and the flight
    75	   * (Phase 31.9): the restart clears ~0.2–0.5s before the taker's kick,
    76	   * and losing the crash routing at that instant sent every crasher back
    77	   * toward his formation spot before the ball was even struck — the
    78	   * delivery aimed at retreating men and 0/30 corners met their target in
    79	   * the header band. Set at hand-off, honored by TeamBrain licensing and
    80	   * the executor's crash routing until `until` (or an opponent touch).
    81	   */
    82	  cornerCrash: {
    83	    routine: CornerRoutine;
    84	    y: number;
    85	    until: number;
    86	    /** Personnel locked at hand-off: re-scoring licenses mid-flight swapped
    87	     * a crasher for the weak-side winger 27m away and unmapped every spot. */
    88	    runners: number[];
    89	    arriver: number | null;
    90	  } | null = null;
    91	
    92	  /**
    93	   * Game-state mentality (Phase 35): recomputed each brain tick from
    94	   * (score diff, minute, raw genes). `effGenome` is what the `genome`
    95	   * getter serves — every in-match gene read sees the mentality-modified
    96	   * view; the raw identity stays at `info.genome` (style derivation,
    97	   * evolution, UI). Identity object when neutral (bit discipline).
    98	   */
    99	  mentality: Mentality = NEUTRAL_MENTALITY;
   100	  effGenome: TacticalGenome;
   101	  /**
   102	   * The kickoff-shifted gene view (Phase 64): raw identity bent by the
   103	   * underdog shift, set once by Match when both teams' Elo is known.
   104	   * The mentality layer applies ON TOP of this each brain tick. Stays
   105	   * === info.genome for favorites, purists and Elo-less matches.
   106	   */
   107	  baseGenome: TacticalGenome;
   108	  /**
   109	   * 门将上前 (Phase 35): the keeper is licensed to crash the opponent box
   110	   * for a stoppage-time attacking corner while trailing. Set by TeamBrain,
   111	   * survives the hand-off + flight like the corner crash does (31.9).
   112	   */
   113	  keeperUp = false;
   114	  /** One feed line each per match — the surge, the shut-down, the keeper. */
   115	  surgeAnnounced = false;
   116	  shutdownAnnounced = false;
   117	  keeperUpAnnounced = false;
   118	  /** Captain's player index (Phase 39): highest age·technique outfielder. */
   119	  captain = -1;
   120	
   121	  /** Sim time when we last gained possession (for counter-attack windows). */
   122	  possessionGainedAt = -999;
   123	
   124	  /**
   125	   * Territory pressure (Phase 27): high-water mark of the ball's local-x
   126	   * during this possession, and how long we've held the ball without beating
   127	   * it. The carrier brain reads `staleTime` — the longer a team recycles the
   128	   * ball sideways, the more its scoring tilts toward playing forward.
   129	   */
   130	  progressLocalX = -HALF_L;
   131	  staleTime = 0;
   132	
   133	  /** Restart the territory clock (possession gained / dead ball / kickoff). */
   134	  resetProgress(ballLocalX: number): void {
   135	    this.progressLocalX = ballLocalX;
   136	    this.staleTime = 0;
   137	  }
   138	
   139	  stats: TeamMatchStats = emptyStats();
   140	
   141	  // Goal centers never move — cached so per-frame callers (marking, keeper
   142	  // positioning) don't allocate. Shared instances: callers must not mutate.
   143	  private readonly ownGoalPos: V2;
   144	  private readonly oppGoalPos: V2;
   145	
   146	  constructor(side: Side, info: TeamInfo) {
   147	    this.side = side;
   148	    this.attackDir = side === 0 ? 1 : -1;
   149	    this.info = info;
   150	    // CONFIDENCE (Phase 111): morale × the moraleSensitivity gene, frozen
   151	    // for the match. Positive = riding a run (sharper passing/finishing),
   152	    // negative = a slump fraying the same. Neutral (0) for ad-hoc teams,
   153	    // probes and steady-pro genomes — the whole channel prices to zero.
   154	    this.confidence =
   155	      ((info.morale ?? 0.5) - 0.5) * 2 * (info.genome.moraleSensitivity ?? 0.5);
   156	    // Explicit policies are merged over the defaults so a vector trained
   157	    // before new weights existed (Phase 28 added five) stays usable — the
   158	    // missing keys read as the hand-tuned constants. Teams WITHOUT a policy
   159	    // keep the DEFAULT_POLICY object itself (bit-identity discipline).
   160	    this.policy = info.policy ? { ...DEFAULT_POLICY, ...info.policy } : DEFAULT_POLICY;
   161	    this.style = info.style ?? deriveTeamStyle(info.genome);
   162	    // Match-day order (Phase 62): lineup[slot] = the roster row playing that
   163	    // slot (bans covered by bench bodies); missing = the roster order itself.
   164	    const lineup = info.lineup ?? info.squad.map((_, i) => i);
   165	    this.policies = ROLES.map((_, i) => {
   166	      const rp = info.rolePolicies?.[lineup[i] ?? i];
   167	      return rp ? { ...DEFAULT_POLICY, ...rp } : this.policy;
   168	    });
   169	    this.players = ROLES.map((role, i) => {
   170	      const ri = lineup[i] ?? i;
   171	      const p = new Player(side, i, role, info.playerNames[ri] ?? role, info.squad[ri]);
   172	      p.rosterIdx = ri; // stats/careers follow the MAN, not the slot
   173	      if (info.ages) p.age = info.ages[ri];
   174	      return p;
   175	    });
   176	    // The bench (Phase 61): whatever the roster carries past the XI.
   177	    this.bench = [];
   178	    for (const ri of lineup.slice(ROLES.length)) {
   179	      const rp = info.rolePolicies?.[ri];
   180	      this.bench.push({
   181	        rosterIdx: ri,
   182	        role: BENCH_ROLES[ri - ROLES.length] ?? 'MF',
   183	        name: info.playerNames[ri] ?? 'SUB',
   184	        attrs: info.squad[ri],
   185	        age: info.ages?.[ri],
   186	        policy: rp ? { ...DEFAULT_POLICY, ...rp } : this.policy,
   187	        used: false,
   188	      });
   189	    }
   190	    // The captain (Phase 39): the oldest cool head — age·technique. He
   191	    // steadies the TEAM's mode switching (TeamBrain hysteresis), nothing
   192	    // else; deterministic (index tiebreak).
   193	    let bestC = -1;
   194	    let bestScore = -Infinity;
   195	    for (let i = 1; i < this.players.length; i++) {
   196	      const p = this.players[i];
   197	      const s = (p.age ?? 24) * ((p.attrs.passing + p.attrs.dribbling) / 2);
   198	      if (s > bestScore) {
   199	        bestScore = s;
   200	        bestC = i;
   201	      }
   202	    }
   203	    this.captain = bestC;
   204	    this.baseGenome = info.genome;
   205	    this.effGenome = info.genome;
   206	    this.ownGoalPos = v2(-this.attackDir * HALF_L, 0);
   207	    this.oppGoalPos = v2(this.attackDir * HALF_L, 0);
   208	  }
   209	
   210	  /** The mentality-modified gene view (Phase 35). Raw = `info.genome`. */
   211	  get genome(): TacticalGenome {
   212	    return this.effGenome;
   213	  }
   214	
   215	  get goalkeeper(): Player {
   216	    return this.players[0];
   217	  }
   218	
   219	  /** Center of the goal we defend. Read-only — shared cached instance. */
   220	  ownGoal(): V2 {
   221	    return this.ownGoalPos;
   222	  }
   223	
   224	  /** Center of the goal we attack. Read-only — shared cached instance. */
   225	  oppGoal(): V2 {
   226	    return this.oppGoalPos;
   227	  }
   228	
   229	  /** Attacking-direction-local x: positive = closer to opponent goal. */
   230	  localX(x: number): number {
   231	    return x * this.attackDir;
   232	  }
   233	}
     1	import { DEFAULT_POLICY, type PolicyParams } from '../sim/types';
     2	import type { Rng } from '../utils/rng';
     3	import { ATTR_KEYS, type PlayerAttributes } from './playerGenome';
     4	import type { PolicyGenes } from './policyGenome';
     5	
     6	/**
     7	 * PLAYER PERSONAL STYLE (Phase 54 — Stage 3 W2). A small per-PLAYER
     8	 * decision-bias gene set: how shot-hungry, long-shot-happy, take-on-prone,
     9	 * late-run-driven and combination-minded THIS player is, expressed as
    10	 * MULTIPLIERS on his coach's evolved team policy. The plumbing is the
    11	 * existing `TeamInfo.rolePolicies` wire — the brain already resolves a
    12	 * per-slot policy; this is what finally feeds it.
    13	 *
    14	 * Emergence rules honored: every player is born NEUTRAL (×1.0 — the coach's
    15	 * policy verbatim, bit-identical to pre-54), styles diverge only through
    16	 * inheritance noise + selection (academy bloodline: the successor mutates
    17	 * the retiree's style; rebirth crosses both parents' slots). A style is
    18	 * PERSONAL and fixed for a career — development changes what a player can
    19	 * do, not who he is.
    20	 */
    21	
    22	export const PLAYER_STYLE_KEYS = [
    23	  'shootBase', 'longShotW', 'dribbleBase', 'runScore', 'wallPassW',
    24	] as const satisfies readonly (keyof PolicyParams)[];
    25	export type PlayerStyleKey = (typeof PLAYER_STYLE_KEYS)[number];
    26	export type PlayerStyle = Record<PlayerStyleKey, number>;
    27	
    28	/** Personal appetite range: a player can halve or half-again his coach's
    29	 * setting, never erase it (competence scaffolding stays the coach's job). */
    30	export const STYLE_MIN = 0.6;
    31	export const STYLE_MAX = 1.5;
    32	
    33	/** The team-policy bounds (policyGenome's 0.5–1.7 × default) also cap the
    34	 * COMBINED coach×player value, so a maverick under a maverick coach still
    35	 * plays football. */
    36	const POLICY_MIN_MUL = 0.5;
    37	const POLICY_MAX_MUL = 1.7;
    38	
    39	const clampStyle = (v: number): number => Math.max(STYLE_MIN, Math.min(STYLE_MAX, v));
    40	
    41	/** Born neutral: the coach's policy verbatim. */
    42	export function neutralStyle(): PlayerStyle {
    43	  const s = {} as PlayerStyle;
    44	  for (const k of PLAYER_STYLE_KEYS) s[k] = 1;
    45	  return s;
    46	}
    47	
    48	/** A whole squad of neutrals (founding / migration backfill). */
    49	export function neutralSquadStyles(n: number): PlayerStyle[] {
    50	  return Array.from({ length: n }, () => neutralStyle());
    51	}
    52	
    53	/** Academy heredity: the successor is grown in the retiree's image. σ0.15 —
    54	 * measured (player-style probe): crossover blending + D2 rebirth keep
    55	 * pulling personal variance back toward the parental means, so the personal
    56	 * layer needs a louder mutation than attrs (σ0.12) for tails that read. */
    57	export function styleFromBloodline(retiree: PlayerStyle, rng: Rng): PlayerStyle {
    58	  const s = {} as PlayerStyle;
    59	  for (const k of PLAYER_STYLE_KEYS) s[k] = clampStyle(retiree[k] + rng.gaussian() * 0.15);
    60	  return s;
    61	}
    62	
    63	/** Position-wise crossover for reborn squads — mirrors crossoverSquads'
    64	 * pick-A / pick-B / blend shape (its own draws; slots stay coherent
    65	 * because both run in slot order). */
    66	export function crossoverSquadStyles(a: PlayerStyle[], b: PlayerStyle[], rng: Rng): PlayerStyle[] {
    67	  return a.map((sa, i) => {
    68	    const sb = b[i] ?? sa;
    69	    const r = rng.next();
    70	    if (r < 0.4) return { ...sa };
    71	    if (r < 0.8) return { ...sb };
    72	    const mix = {} as PlayerStyle;
    73	    for (const k of PLAYER_STYLE_KEYS) mix[k] = (sa[k] + sb[k]) / 2;
    74	    return mix;
    75	  });
    76	}
    77	
    78	/**
    79	 * The wire: one player's effective policy — his coach's evolved genes with
    80	 * the personal appetites multiplied in, clamped to the global policy
    81	 * bounds. Returns the personal OVERRIDE subset only (TeamInfo.rolePolicies
    82	 * merges it over DEFAULT_POLICY; non-style keys stay the coach's).
    83	 */
    84	export function applyPlayerStyle(
    85	  coachPolicy: PolicyGenes,
    86	  style: PlayerStyle,
    87	): Partial<PolicyParams> {
    88	  const out: Partial<PolicyParams> = { ...coachPolicy };
    89	  for (const k of PLAYER_STYLE_KEYS) {
    90	    const base = coachPolicy[k] ?? DEFAULT_POLICY[k];
    91	    const lo = DEFAULT_POLICY[k] * POLICY_MIN_MUL;
    92	    const hi = DEFAULT_POLICY[k] * POLICY_MAX_MUL;
    93	    out[k] = Math.max(lo, Math.min(hi, base * style[k]));
    94	  }
    95	  return out;
    96	}
    97	
    98	/* ---------------- personal nameplates (data-driven, Phase 54) ---------------- */
    99	
   100	/** The player identity space: 8 attributes + 5 personal appetites. The
   101	 * scale lets variances be compared across dims (attrs span 1.0, style
   102	 * multipliers span STYLE_MAX−STYLE_MIN) — exported for the player center's
   103	 * data-driven axes (Phase 56). */
   104	export interface PlayerDim {
   105	  key: string;
   106	  kind: 'attr' | 'style';
   107	  scale: number;
   108	}
   109	export const PLAYER_DIMS: PlayerDim[] = [
   110	  ...ATTR_KEYS.map((key) => ({ key, kind: 'attr' as const, scale: 1 })),
   111	  ...PLAYER_STYLE_KEYS.map((key) => ({ key, kind: 'style' as const, scale: STYLE_MAX - STYLE_MIN })),
   112	];
   113	
   114	/** One legible football fragment per nameable direction — the same grammar
   115	 * rule as club nameplates (styleSpace.ts): the VOCABULARY is hand-built
   116	 * substrate, which words a PLAYER wears is earned by where he actually
   117	 * deviates from the current 96-player population. */
   118	const PLAYER_VOCAB: Record<string, { hi?: string; lo?: string }> = {
   119	  pace: { hi: 'Jet heels' },
   120	  passing: { hi: 'Silk passer' },
   121	  dribbling: { hi: 'Glued to the boot' },
   122	  finishing: { hi: 'Killer touch' },
   123	  defending: { hi: 'The wall' },
   124	  strength: { hi: 'Ox strong' },
   125	  stamina: { hi: 'Iron lungs' },
   126	  reflexes: { hi: 'Spring cat' },
   127	  shootBase: { hi: 'Shot hungry', lo: 'Never shoots' },
   128	  longShotW: { hi: 'The howitzer' },
   129	  dribbleBase: { hi: 'Take-on artist', lo: 'Keeps it simple' },
   130	  runScore: { hi: 'Ghost runner' },
   131	  wallPassW: { hi: 'One-two brain' },
   132	};
   133	
   134	export interface PlayerDimStats {
   135	  mean: number[];
   136	  std: number[];
   137	}
   138	
   139	export function playerVector(attrs: PlayerAttributes, style: PlayerStyle): number[] {
   140	  return PLAYER_DIMS.map((d) =>
   141	    d.kind === 'attr' ? attrs[d.key as keyof PlayerAttributes] : style[d.key as PlayerStyleKey]);
   142	}
   143	
   144	/** Population stats over every player in the league (16 clubs × 6). */
   145	export function playerDimStats(vectors: number[][]): PlayerDimStats {
   146	  const n = Math.max(vectors.length, 1);
   147	  const mean = PLAYER_DIMS.map((_, i) => vectors.reduce((a, v) => a + v[i], 0) / n);
   148	  const std = PLAYER_DIMS.map((_, i) =>
   149	    Math.sqrt(vectors.reduce((a, v) => a + (v[i] - mean[i]) ** 2, 0) / n));
   150	  return { mean, std };
   151	}
   152	
   153	/** Up to 2 fragments where this player z-deviates ≥ minZ from the current
   154	 * population; an unremarkable player wears NO plate (being someone is
   155	 * earned — there is no 'Balanced' participation badge for people). */
   156	export function playerNameplate(vec: number[], stats: PlayerDimStats, minZ = 1.25): string[] {
   157	  const cands: Array<{ word: string; z: number }> = [];
   158	  for (let i = 0; i < PLAYER_DIMS.length; i++) {
   159	    // Attrs span 0..1, style mults 0.6..1.5 — the std floor keeps a
   160	    // near-uniform population from minting giant z-scores out of noise.
   161	    const floor = PLAYER_DIMS[i].kind === 'attr' ? 0.02 : 0.018;
   162	    const z = (vec[i] - stats.mean[i]) / Math.max(stats.std[i], floor);
   163	    const vocab = PLAYER_VOCAB[PLAYER_DIMS[i].key];
   164	    const word = z > 0 ? vocab?.hi : vocab?.lo;
   165	    if (word && Math.abs(z) >= minZ) cands.push({ word, z: Math.abs(z) });
   166	  }
   167	  cands.sort((a, b) => b.z - a.z || a.word.localeCompare(b.word));
   168	  const out: string[] = [];
   169	  for (const c of cands) {
   170	    if (!out.includes(c.word)) out.push(c.word);
   171	    if (out.length === 2) break;
   172	  }
   173	  return out;
   174	}
   175	
   176	/**
   177	 * Style fit between two players (Phase 80, N6): 1 = identical appetites,
   178	 * 0 = maximally apart across the style box. Pure; the market's signal.
   179	 */
   180	export function styleFit(a: PlayerStyle, b: PlayerStyle): number {
   181	  let d = 0;
   182	  for (const k of PLAYER_STYLE_KEYS) d += Math.abs(a[k] - b[k]);
   183	  return 1 - d / (PLAYER_STYLE_KEYS.length * (STYLE_MAX - STYLE_MIN));
   184	}

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/ai/TeamBrain.ts | sed -n '294,560p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
   294	/**
   295	 * Chasers: outfield players allowed to hunt the ball. Everyone else keeps
   296	 * shape/marks. Count scales with pressing: 1 base, +1 in Press mode, +1 for
   297	 * extreme pressIntensity.
   298	 */
   299	function assignChasers(team: Team, match: Match): void {
   300	  team.chasers.clear();
   301	  const possession = match.possessionSide;
   302	  const weOwn = possession === team.side;
   303	  if (weOwn) {
   304	    // No chasing our own CARRIER — but a LOOSE ball is ours to contest
   305	    // too (36.2, user report "有人去抢球,其他人呆住了"): possession is
   306	    // sticky, so after a squirt/miscontrol/knockdown the nominal owners
   307	    // never sent a body and the 50/50 was a one-team race. One nearest
   308	    // man goes; designed balls stay untouched (the dribble toucher
   309	    // already chases his own push, a pass in flight belongs to its
   310	    // receiver, restarts have a taker).
   311	    if (
   312	      match.ball.owner === null &&
   313	      match.dribbleTouch === null &&
   314	      !(match.pendingPass !== null && match.pendingPass.side === team.side) &&
   315	      match.phase === 'playing'
   316	    ) {
   317	      let best: Player | null = null;
   318	      let bd = Infinity;
   319	      for (const p of team.players) {
   320	        if (p.role === 'GK' || p.sentOff) continue;
   321	        const d = dist(p.pos, match.ball.pos);
   322	        if (d < bd) {
   323	          bd = d;
   324	          best = p;
   325	        }
   326	      }
   327	      if (best) team.chasers.add(best.index);
   328	    }
   329	    return;
   330	  }
   331	  // The opposing keeper has it in their HANDS (Phase 28.1 → 29.1): they are
   332	  // unchallengeable, so pressing is wasted legs. 28.1 kept ONE shadow at the
   333	  // bubble's edge to cut the short outlet — live play read it as a man
   334	  // camped in the keeper's face (reported twice), so now NOBODY presses a
   335	  // held ball: everyone marks up for the distribution, like a goal kick.
   336	  const owner = match.ball.owner;
   337	  // gkDistributing too (31.9): the shape-wait's 0.25s re-arm quanta left
   338	  // timer==0 gaps where a chaser got assigned, charged, and was expelled
   339	  // when the hold re-armed — the "疯狂抽动逼抢" flicker.
   340	  const gkHolding = owner !== null && owner.role === 'GK' && (owner.gkHoldTimer > 0 || owner.gkDistributing);
   341	
   342	  let count = 1;
   343	  if (gkHolding) {
   344	    count = 0;
   345	  } else {
   346	    // One presser, two for a pressing side — NEVER three (Phase 31, user
   347	    // report): real football sends one or two at the ball; everyone else
   348	    // marks or holds the shape. The extreme-pressIntensity third chaser
   349	    // stacked onto Press mode just re-created the swarm.
   350	    if (team.mode === 'Press' || team.genome.pressIntensity > 0.78) count += 1;
   351	    // Loose ball = a DUEL, not a scrum (Phase 30.5): one contester per team.
   352	    // At 2 per team every midfield 50/50 pulled four sprinters plus the
   353	    // support/marking crowd already there, and the won-tackle squirt re-fed
   354	    // the same pile — the reported "乱成一锅粥" loop.
   355	    if (possession === -1) count = Math.min(count, 1);
   356	    // THE TRANSITION WINDOW (Phase 112): for 3s after losing the ball a
   357	    // gegenpress side throws ONE extra body at it — a deliberate, window-
   358	    // bounded exception to the phase-31 "never three" rule (the standing
   359	    // swarm it banned was permanent; the counter-press IS the momentary
   360	    // swarm, and it expires with the window). A drop-and-recover side
   361	    // refuses even its steady-state second presser until the shape is
   362	    // home. 0.5 leaves the phase-31 counts untouched.
   363	    if (match.phase === 'playing') {
   364	      const sinceLoss = match.simTime - match.teams[1 - team.side].possessionGainedAt;
   365	      if (sinceLoss < 3.0) {
   366	        const tp = ((team.genome.transitionPress ?? 0.5) - 0.5) * 2;
   367	        if (tp > 0.3) count = Math.min(count + 1, 3);
   368	        else if (tp < -0.3) count = Math.min(count, 1);
   369	      }
   370	    }
   371	  }
   372	  // Dead ball (Phase 28.3): you can't win a ball nobody may touch — ONE
   373	  // player closes the taker down (blocking the short option, real-football
   374	  // style); the old pack of 2–3 stood pinned at the corner-flag clearance
   375	  // circle jogging on the spot. Goal kicks (Phase 29): ZERO — the taker is
   376	  // the keeper deep in their own box; charging them is pure wasted legs,
   377	  // so everyone marks up for the distribution instead.
   378	  if (match.phase === 'restart') count = match.restart?.kind === 'goalKick' ? 0 : 1;
   379	
   380	  const outfield = team.players.filter((p) => p.role !== 'GK' && !p.sentOff);
   381	  // ATTACK THE DROP (Phase 32.1, user report "大脚高球也应该能被解围"): an
   382	  // opponent's lofted delivery in flight is chased at its LANDING, by
   383	  // whoever gets there fastest — long balls aim at open men by design, so
   384	  // the by-current-ball-distance pick sent a presser who could never
   385	  // arrive (probed: nearest defender averaged 7.6m off the descent, 5%
   386	  // aerial contests, and the hoof was uncontestable in practice).
   387	  // interceptBall already projects the parabola; the chaser just needed
   388	  // to be the right man.
   389	  const pass = match.pendingPass;
   390	  const ball = match.ball;
   391	  if (
   392	    count > 0 && pass && pass.side !== team.side && ball.owner === null &&
   393	    (ball.z > 0.5 || ball.vz > 2)
   394	  ) {
   395	    const land = ballLanding(ball);
   396	    // LONG hoofs into open field only: an unscoped first cut attacked the
   397	    // landing of every cross, corner and chip too — one extra converging
   398	    // defender on every box delivery re-buried the 31.9 headed game and
   399	    // cost 0.77 goals/match at n=568. Box landings belong to the marking
   400	    // scheme; short chips to the through-ball economy.
   401	    const flight = Math.hypot(ball.vel.x, ball.vel.y) * land.t;
   402	    const inOurBox =
   403	      Math.abs(land.y) < BOX_WIDTH / 2 && team.localX(land.x) < -(HALF_L - BOX_DEPTH);
   404	    if (flight > 12 && !inOurBox) {
   405	      let best: Player | null = null;
   406	      let bestT = Infinity;
   407	      for (const p of outfield) {
   408	        const t = dist(p.pos, land) / Math.max(p.topSpeed, 0.1);
   409	        if (t < bestT) {
   410	          bestT = t;
   411	          best = p;
   412	        }
   413	      }
   414	      if (best) {
   415	        team.chasers.add(best.index);
   416	        return;
   417	      }
   418	    }
   419	  }
   420	  const byDist = [...outfield].sort(
   421	    (a, b) => dist(a.pos, match.ball.pos) - dist(b.pos, match.ball.pos) || a.index - b.index,
   422	  );
   423	  for (const p of byDist.slice(0, count)) team.chasers.add(p.index);
   424	}
   425	
   426	/**
   427	 * Marks: each non-chasing outfielder picks the most dangerous unmarked
   428	 * opponent (deepest into our half) within range. Greedy and deterministic.
   429	 *
   430	 * Marking SCHEME (Phase 30, `team.style.scheme`): 'man' marks every ranged
   431	 * threat (the behavior every phase before 30 shipped with); 'zonal' marks a
   432	 * threat only when it ENTERS A DEFENDER'S ZONE (near that defender's
   433	 * defending spot) or our penalty box. Zone defenders otherwise hold the
   434	 * sliding spots — and crucially, engaging a zone runner drags its defender
   435	 * OFF the spot lattice, which is how attacks open a zone up (a first cut
   436	 * that never engaged parked an impenetrable 5-body wall: 3 shots/match
   437	 * conceded, and the league's shot volume collapsed).
   438	 */
   439	function assignMarks(team: Team, match: Match): void {
   440	  team.marks.clear();
   441	  if (match.possessionSide === team.side) return;
   442	
   443	  const zonal = team.style.scheme === 'zonal';
   444	  const opp = match.teams[1 - team.side];
   445	  const carrier = match.ball.owner;
   446	  // Sort by how deep they are in OUR half: smaller localX for them = deeper
   447	  // for us. (A numerically identical pre-sort used to run first; this
   448	  // comparator is a total order — index tiebreak — so one sort decides fully.)
   449	  // The restart taker is not a threat (Phase 29.1): they're pinned to a dead
   450	  // ball the clearance circle already guards, and the assigned chaser blocks
   451	  // the short option — a marker sent there too made TWO men stand uselessly
   452	  // at the corner flag while the box went a body short.
   453	  const takerGid = match.restart?.takerGid;
   454	  const inOurBox = (x: number, y: number): boolean =>
   455	    team.localX(x) < -HALF_L + BOX_DEPTH && Math.abs(y) < BOX_WIDTH / 2;
   456	  const threats = opp.players
   457	    .filter((o) => o.role !== 'GK' && o !== carrier && !o.sentOff && o.gid !== takerGid)
   458	    .sort((a, b) => opp.localX(b.pos.x) - opp.localX(a.pos.x) || a.index - b.index);
   459	
   460	  const free = team.players.filter((p) => p.role !== 'GK' && !team.chasers.has(p.index) && !p.sentOff);
   461	  // Zonal: each free defender's zone is centered on their DEFENDING spot.
   462	  const zones = zonal ? new Map(free.map((p) => [p.index, formationSpot(p, team, match.ball, false, match.teams[1 - team.side])])) : null;
   463	  const used = new Set<number>();
   464	  for (const threat of threats) {
   465	    const boxThreat = inOurBox(threat.pos.x, threat.pos.y);
   466	    let best: { idx: number; d: number } | null = null;
   467	    for (const p of free) {
   468	      if (used.has(p.index)) continue;
   469	      // Width discipline (Phase 28.4): a WIDE winger does not abandon the
   470	      // flank to join a central pile-up — central threats belong to the
   471	      // spine. This is the user-diagnosed collapse: turnover in midfield →
   472	      // wingers tuck in → six bodies in one corridor → playground scramble.
   473	      if (p.role === 'WG' && Math.abs(p.pos.y) > 12 && Math.abs(threat.pos.y) < 8) continue;
   474	      // Zonal: outside our box, only the defender whose ZONE the threat
   475	      // entered may engage — everyone else keeps the lattice.
   476	      if (zones && !boxThreat && dist(zones.get(p.index)!, threat.pos) > 9) continue;
   477	      const d = dist(p.pos, threat.pos);
   478	      if (d < 22 && (best === null || d < best.d)) best = { idx: p.index, d };
   479	    }
   480	    if (best) {
   481	      used.add(best.idx);
   482	      team.marks.set(best.idx, threat.index);
   483	    }
   484	  }
   485	}

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg -n -i 'attribute|positioning|awareness|vision|game reading|first.touch|aerial|agility|preferred foot|眼|属性|budget|phase 119j|phase-120|Phase 47|Phase 48' docs/EVO-BLUEPRINT.md docs/ROADMAP.md"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
docs/ROADMAP.md:3:## ⭐⭐⭐⭐ THE GOLD STANDARD IS [`VISION.md`](VISION.md) (2026-07-19) — measure every decision against it
docs/ROADMAP.md:7:> ✅ **POSITION-AWARE BUDGET landed** (`playerGenome.ts` `countsForBudget` + `squadTotal`;
docs/ROADMAP.md:8:> `SQUAD_BUDGET` 40.5→35.5; `League.ts` fire-sale headroom + v32→v33 migration; SAVE_VERSION
docs/ROADMAP.md:10:> (dead — never shoots/tackles) → the keeper's budget base is its OWN. Cap dropped in lockstep
docs/ROADMAP.md:18:> ⚠️ **Sub-step 2 (vision attr) FIRST CUT = "读数精度 on PASSING" — TRIED + REVERTED (honest-revert,
docs/ROADMAP.md:19:> §2 hard gate).** Added `vision` (10th attr, budget 35.5→40.0) + wired it as a continuous
docs/ROADMAP.md:21:> +23% (lane+open) / +17% (lane-only, mean-centred), headers −25–34%, aerial route collapses.
docs/ROADMAP.md:25:> vision must be applied SYMMETRICALLY (gate the DEFENDER's interception/anticipation read too,
docs/ROADMAP.md:27:> better), OR defer vision & do `positioning`-live (sub-step 3) next.** Sub-step 3 = wire
docs/ROADMAP.md:28:> `positioning` LIVE off-ball (today only a first-touch sub-term). De-dead-weight `strength`.
docs/ROADMAP.md:41:- ✅ **§4 diversity WIN** — `positioning-shape` WIDE−NARROW spreadY divergence
docs/ROADMAP.md:46:  up, through-balls down; `positioning-shape` nn-dist tighter across the board;
docs/ROADMAP.md:58:  `noAerial` = NOBODY contests them** (vs BUS 54%, atkHeader 25%→18% — the box is
docs/ROADMAP.md:66:  obs8 pass-power revert — same lesson, combo bottleneck is upstream positioning.
docs/ROADMAP.md:67:- ⭐⭐ **DESIGN + VISION UPDATED → "让球员/教练自己长眼睛" (gene-weighted SPACE-VALUE
docs/ROADMAP.md:68:  field, two levels: player-local + coach-global). VISION §1 rewritten with the
docs/ROADMAP.md:76:  + gene/attr appetite). A/B: box-arrival did NOT emerge (`cross-anatomy` noAerial
docs/ROADMAP.md:91:  RE-DIAGNOSE.** Both cuts: box did NOT fill (`cross-anatomy` noAerial 46→51%), §2
docs/ROADMAP.md:97:  the box fine (`cross-anatomy` BAL: noAerial **26%**, atkHeader **33%**, goal/shot
docs/ROADMAP.md:112:- Tree left CLEAN at HEAD `ed62978` (only ledger/VISION docs changed). Baselines
docs/ROADMAP.md:114:  WIDE 6.4 / NARROW 5.2; clump-vs-wide 3.48/1.02; cross noAerial 46/54%; cutback
docs/ROADMAP.md:116:- ⭐⭐⭐ **VISION §1 EXTENDED to the full perception→value→action ENGINE (user ratified
docs/ROADMAP.md:117:  "从底层做了一个足球引擎,方向是对的").** Eyes = 球+对手+队友+场地+**自身**(朝向/我的属性/
docs/ROADMAP.md:119:  (space/threat/receive/goal); **eye-QUALITY = an attribute** (长眼睛本身分化). Honest cost
docs/ROADMAP.md:122:- ⭐⭐⭐ **ATTRIBUTE AUDIT (the engine's INPUTS; ATTR_KEYS ×9, budget SQUAD_BUDGET 40.5):
docs/ROADMAP.md:123:  3 wasteful + 1 missing + 3 attr-blind.** DEAD/WEAK (eat budget, ~no effect): **`reflexes`
docs/ROADMAP.md:124:  = DEAD for 8/9 (GK-only reads)**; **`positioning` = near-inert** (only a first-touch
docs/ROADMAP.md:126:  eye needs; **`strength` = one-trick** (aerialSense 0.30, near-decorative on the ground).
docs/ROADMAP.md:128:  mechanics (flat constant an attr could bite NOW): **`TURN_RATE` 6.5** (agility — everyone
docs/ROADMAP.md:130:  and **perception = PERFECT full-field for ALL — NO vision/awareness attr** (only the
docs/ROADMAP.md:132:  Gaps ranked: vision/awareness(1) · agility/turn(2) · positioning-made-live(3, fix-not-add) ·
docs/ROADMAP.md:133:  composure(4) · raw aerial/jump(5) · shot-power(6) · tackle-vs-mark(7) · accel-vs-topspeed(8) ·
docs/ROADMAP.md:134:  weak-foot(10, needs NEW mechanics). → **engine-input cleanup = reclaim reflexes budget +
docs/ROADMAP.md:135:  add `vision` (eye-quality) + wire `positioning` live; genome change = save-ver bump +
docs/ROADMAP.md:142:candidate (pitch scale 0.70 + emergent positioning DEFAULT — see the block
docs/ROADMAP.md:152:PITCH_SCALE 0.70 + emergent positioning DEFAULT are now the confirmed baseline,
docs/ROADMAP.md:154:0.70, goal inflation DOWN) and the user's eyes agree on VISION §2. Sequence
docs/ROADMAP.md:163:drop). So the distance to real football / VISION §3 is mostly EXECUTION QUALITY
docs/ROADMAP.md:183:- **Deliberate arcade deviations — do NOT "fix"** (VISION §3): throw-in→kick-in,
docs/ROADMAP.md:186:**SELF-DRIVE SEQUENCE (one lever · probe-first · A/B · emergence, VISION is the
docs/ROADMAP.md:198:below; VISION.md stays the gold standard, this is the current gap snapshot.)
docs/ROADMAP.md:202:VISION §1 named two load-bearing substrate roots behind the endless width/position
docs/ROADMAP.md:203:reverts: (A) space/density + (B) emergent positioning. This phase does BOTH,
docs/ROADMAP.md:210:  VISION §1+§2+§3 together (my first confounded run wrongly said §2 worsened; the
docs/ROADMAP.md:214:  fixed); **emergent positioning is now the DEFAULT** (`formations.ts`
docs/ROADMAP.md:221:- ⚠ **NOT yet the final verdict:** VISION §2 watchability is the USER'S eyes
docs/ROADMAP.md:267:   football is structurally weak" story = VISION §3):**
docs/ROADMAP.md:277:     POSITIONING (players don't get close enough / don't offer), i.e. the SPACE
docs/ROADMAP.md:296:The user extended the emergence pivot into a full four-stage vision (Engine →
docs/ROADMAP.md:301:audit, and the turnkey 5→8 attribute scope). Stage-1: ✅ **phase-45**
docs/ROADMAP.md:306:✅ **phase-48 SHIPPED** (the RESOURCE BUDGET keystone: `SQUAD_BUDGET` 24 caps
docs/ROADMAP.md:307:attribute inflation dead, newgens are club BLOODLINE not random+ROLE_BIAS,
docs/ROADMAP.md:311:curve + budget heatmap) + ✅ **phase-50 SHIPPED** (results-dominant fitness —
docs/ROADMAP.md:313:was already met post-budget, remaining speed levers PARKED). **STAGE 1+2 COMPLETE** +
docs/ROADMAP.md:331:signed only at retirement vacancies under the budget; feeds the
docs/ROADMAP.md:369:rosters under a widened `SQUAD_BUDGET` 36 — a deep bench is funded by
docs/ROADMAP.md:399:derived queue: ✅ **phase-63 SHIPPED** (**the AERIAL/ROUTE-ONE
docs/ROADMAP.md:403:(aerialSense 0.15/0.3 — the tall-CB counter is buyable too). Per-cross
docs/ROADMAP.md:475:**2.76/2.29/3.59, ≈+0.6 hot** — tempering continued in 67. Aerial
docs/ROADMAP.md:538:positioning, a lob festival), hang ≤1.45s, and the price must clearly
docs/ROADMAP.md:554:parts 2+3: aerial SWING + the ground BENDER. Lofted switches and dinks
docs/ROADMAP.md:565:and the formations contract inverted; through-ball + aerial curves
docs/ROADMAP.md:592:(the residue = legal line-level positioning vs deep blocks).
docs/ROADMAP.md:685:BUILD follows the evolved STRENGTH attribute — bulk 0.88–1.16×
docs/ROADMAP.md:779:Eligibility gates (beats academy, fits budget) unchanged — only the
docs/ROADMAP.md:816:DIAGNOSIS (attr+gene means at gen 0/12/23): NOT an attribute arms
docs/ROADMAP.md:817:race — defending/reflexes HOLD or rise under the budget, finishing
docs/ROADMAP.md:856:distance/closing × his defending attr + keeper positioning ×
docs/ROADMAP.md:857:reflexes must suppress conversion, giving defensive attributes a
docs/ROADMAP.md:859:term is suspected attribute-flat); ② price the 2.5×-overperf
docs/ROADMAP.md:964:7 unused samples (UI clicks/crossbar/disappointment/aerial/chants/
docs/ROADMAP.md:974:thud on aerial-duel flags. ④ CHANTS: one of the two recorded songs
docs/ROADMAP.md:1019:gene×attribute PACKAGE (invest defending + jockey = the Van Dijk
docs/ROADMAP.md:1034:were attribute-BLIND — every breakaway shooter got them free. Now
docs/ROADMAP.md:1054:budget-clamped structurally by the existing intake `enforceBudget`;
docs/ROADMAP.md:1144:phase-63 aerial channel, and STRENGTH picks the target — the tall
docs/ROADMAP.md:1327:arriving on the knock-down; the Phase-63 aerial channel finally gets a
docs/ROADMAP.md:1565:a corner/FK/pen first touch) → the live breakaway entry's launch class
docs/ROADMAP.md:1592:compact 16-club selector wall (dot/name/Elo, division badge, 2
docs/ROADMAP.md:1597:role tooltips — both phases side by side), goal channels, budget +
docs/ROADMAP.md:1628:0.02. So 内切/carry-wide EMERGE; the aerial cross does not. (4) **Prong 2
docs/ROADMAP.md:1631:aerial contest goes loose even with bodies there) AND broke 3 invariant
docs/ROADMAP.md:1632:tests. ⭐⭐ REFRAME / NEXT: the high aerial cross is low-percentage BY
docs/ROADMAP.md:1637:NOT the aerial cross. Standing: 119l run-repertoire; 11v11 as structural
docs/ROADMAP.md:1652:zero-sim). PROBED → NO-FIX this session: 119f-spill (the first-touch
docs/ROADMAP.md:1669:A's off-ball run-timing + first touch = ⭐⭐ THE MISSING POSITIONING /
docs/ROADMAP.md:1670:OFF-BALL-IQ ATTRIBUTE. Five levers now converge here (119c, 119d-1×4,
docs/ROADMAP.md:1672:create/exploit space. The real enabler = the positioning attr. ⭐⭐ 119j SHIPPED
docs/ROADMAP.md:1673:2026-07-19 (user "开始"): the POSITIONING attribute added (9th attr,
docs/ROADMAP.md:1674:SQUAD_BUDGET 36→40.5 density-preserving, save v32, fingerprint
docs/ROADMAP.md:1681:defensive reads — then re-attempt the give-and-go with positioning
docs/ROADMAP.md:1682:making A's reception clean. ⭐ STRATEGIC BACKLOG written: attribute/gene audit vs
docs/ROADMAP.md:1683:FIFA/FM/PES (positioning attr = deepest missing; GK split;
docs/ROADMAP.md:1755:**115 — BUDGET viz done RIGHT + small viz debts** ✅ **SHIPPED
docs/ROADMAP.md:1760:stays (it's the population lens). ② The budget bar splits XI vs 🪑
docs/ROADMAP.md:1820:bench-budget split, the foul economy (injury = side effect, never
docs/ROADMAP.md:1822:injuries per club-season ✓ on budget, serious 30/32%, avg out
docs/ROADMAP.md:1837:① BUDGET ALLOCATION JOINS THE TIME MACHINE ("预算分配在演化里面怎么
docs/ROADMAP.md:1849:多边能力图 + 3D 可旋转全身).** ① the ABILITY RADAR: the 8 attributes
docs/ROADMAP.md:2039:abandonment (the 119d-1 lesson holds). Entries: ~50% first-touch
docs/ROADMAP.md:2092:the first touch (receiver-SPILL 8-13%), which is 119f-spill's job.
docs/ROADMAP.md:2094:**119f-spill — the first-touch SPILL (停球失误)** ✅ **PROBED →
docs/ROADMAP.md:2117:league W/D/L, the 114 data), and the LEAGUE STANDING (division rank +
docs/ROADMAP.md:2173:**STRATEGIC BACKLOG — the ATTRIBUTE/GENE AUDIT vs FIFA/FM/PES (user,
docs/ROADMAP.md:2178:independently) and MISSING-BUT-NEEDED. ⚠ SQUAD_BUDGET makes attrs
docs/ROADMAP.md:2182:- ⭐ **Positioning / off-ball intelligence / anticipation** — MISSING,
docs/ROADMAP.md:2183:  the deepest gap: all positioning is team-gene + formation-table +
docs/ROADMAP.md:2187:- **GK attribute split** (handling / kicking / positioning distinct
docs/ROADMAP.md:2192:  defending×0.15 + role via `aerialSense`); a small timing-header or
docs/ROADMAP.md:2193:  a strong non-jumper can't exist. Feeds the aerial channel + set
docs/ROADMAP.md:2195:- **Acceleration vs top speed + agility** — collapsed into `pace`
docs/ROADMAP.md:2199:- Folded acceptably (low priority): composure→finishing, vision→
docs/ROADMAP.md:2200:  passing+playmaker-trait, first-touch→dribbling, set-piece specialism.
docs/ROADMAP.md:2201:Priority order: scheme-gene (119h, in flight) → positioning attr (its
docs/ROADMAP.md:2202:own big project, budget impact) → GK split (rides the keeper line) →
docs/ROADMAP.md:2234:the MISSING positioning / off-ball-IQ attr (its own project).
docs/ROADMAP.md:2266:— which points back at A's off-ball run timing + first touch on the
docs/ROADMAP.md:2267:return = the MISSING positioning/off-ball-IQ attr. A/B metric for the
docs/ROADMAP.md:2272:**119j — the POSITIONING ATTRIBUTE, foundation + reception wiring** ✅
docs/ROADMAP.md:2273:**SHIPPED 2026-07-19 (user "开始"; the 9th attribute, the enabler the
docs/ROADMAP.md:2278:`positioning` as the 9th player attribute (appended LAST in ATTR_KEYS so
docs/ROADMAP.md:2279:founders' other attrs draw byte-identical), SQUAD_BUDGET raised 36→40.5
docs/ROADMAP.md:2281:not free), save v31→v32 with a TOP-OF-CHAIN backfill (the v17→v18 budget
docs/ROADMAP.md:2282:pass calls enforceBudget → a squad missing the 9th attr NaN-poisons the
docs/ROADMAP.md:2285:pressure — `touchFailChance` gains a positioning term that tames the
docs/ROADMAP.md:2296:4.13) ≈ 11.54 baseline (ZERO inflation — the density-preserving budget
docs/ROADMAP.md:2302:hold (positioning times the break: onside + arrives with the ball),
docs/ROADMAP.md:2303:(2) DEFENSIVE reads (interception/cover positioning — the shape-holding
docs/ROADMAP.md:2305:with positioning making A's return-reception clean. A/B each: does a
docs/ROADMAP.md:2306:positioning archetype EMERGE and win, do the seven start appearing, is
docs/ROADMAP.md:2309:**119k — POSITIONING wiring points 2-3 (run-timing + defensive reads)**
docs/ROADMAP.md:2312:wiring points tried, each killed by the `positioning-bite.ts` maxed
docs/ROADMAP.md:2313:test: ① SEAM RUN (runTarget pulls a high-positioning runner's Y toward
docs/ROADMAP.md:2319:by positioning) — WEAK, pos-0.9 GA 1.43 vs pos-0.1 1.48 (−0.05, noise).
docs/ROADMAP.md:2321:negative, interception weak): individual positioning quality-scalers
docs/ROADMAP.md:2329:moment must EMERGE from the substrate + genes + positioning, not be
docs/ROADMAP.md:2337:EMERGE and be SELECTED per situation — positioning = the player's
docs/ROADMAP.md:2421:the inflation engine's core and is attribute-blind. Make composure
docs/ROADMAP.md:2432:defending scaled by (jockeyBias−0.5), budget-clamped, and the
docs/ROADMAP.md:2467:63 aerial channel = strength linkage). Behavioral: full gates.
docs/ROADMAP.md:2519:model (user 2026-07-14, hardest): player-attribute expansion + the evolution VIZ
docs/EVO-BLUEPRINT.md:3:> ⭐ **THE GOLD STANDARD is [`VISION.md`](VISION.md)** (2026-07-19) — the single
docs/EVO-BLUEPRINT.md:5:> blueprint (the plan/state) serves that vision, not the reverse.
docs/EVO-BLUEPRINT.md:8:(whose rationale, substrate audit, gates and the turnkey attribute scope stay
docs/EVO-BLUEPRINT.md:11:## The vision (the user, 2026-07-14)
docs/EVO-BLUEPRINT.md:53:| **47 (B)** | Attribute expansion 5→8: `pace/passing/dribbling/finishing/defending/strength/stamina/reflexes` — exactly the turnkey scope in EMERGENCE-PIVOT §5 (per-line technique remap incl. the mechanics.ts ambiguity GOTCHA, strength/stamina payoffs, ROLE_BIAS MF→passing, traits, DECLINE_W, probes to 8 keys, save v11→v12 neutral backfill). | calibrate ×2 watching completion+goals (fm 16–21) + player-archetype probe |
docs/EVO-BLUEPRINT.md:54:| **48 (C)** | **Resource budget (the keystone)**: `SQUAD_BUDGET` = hard cap on the squad's total attribute points; one pure `enforceBudget(squad)` (proportional rescale) applied after rebirth crossover, the careers develop pass, and newgen entry. SQUAD-level on purpose: star-plus-role-players vs balanced-six becomes an evolvable axis. Rejected: fitness penalty (invisible, evolution routes around), per-player cap (kills the star axis). **Rides with it: academy heredity** — newgens mutate the retiring slot's attrs (club bloodline) instead of random+ROLE_BIAS; ROLE_BIAS retires. Cap derived by probe (bind early: ~founding mean ×1.1–1.2), settled by calibrate. Budget bar on the team card. | specialization probe (within-player variance ↑, cross-club allocation divergence ↑) + evo-drift plateaus at cap + calibrate ×2; rewrite the careers mean-stability test (the budget intentionally changes that invariant) |
docs/EVO-BLUEPRINT.md:57:## Stage 2 — VISIBILITY: make evolution seen (phase 49, right after the budget)
docs/EVO-BLUEPRINT.md:69:  index, per-club budget-allocation heatmap.
docs/EVO-BLUEPRINT.md:78:  keeps squad/academy/budget/prestige/rivalries. Same genetic operators, now
docs/EVO-BLUEPRINT.md:93:  clubs sign under the budget (now a real wage cap). Full active transfer
docs/EVO-BLUEPRINT.md:105:(rotation becomes an evolvable strategy, couples with stamina + budget),
docs/EVO-BLUEPRINT.md:111:original vision ("好玩的,可以自我进化的,可视化优秀的,有深度的,玩着爽的,
docs/EVO-BLUEPRINT.md:156:  - ✅ lever 5 (phase-63) — the AERIAL/ROUTE-ONE channel (cross
docs/EVO-BLUEPRINT.md:177:  under the widened budget (deep bench vs star XI is a REAL allocation),
docs/EVO-BLUEPRINT.md:198:  deep-forward) as RARE mutations under an ecology budget (the zonal
docs/EVO-BLUEPRINT.md:256:- ✅ **phase-47 SHIPPED** (attribute expansion 5→8): `pace / passing /
docs/EVO-BLUEPRINT.md:259:  strength → aerial + the `tryTackles` shield term, base 0.25 − strength·0.10
docs/EVO-BLUEPRINT.md:267:  stamina random-walks (weak gradient — exactly what the phase-48 budget
docs/EVO-BLUEPRINT.md:284:- ✅ **phase-48 SHIPPED** (the RESOURCE BUDGET + academy heredity — the
docs/EVO-BLUEPRINT.md:285:  keystone): `SQUAD_BUDGET = 24` (6 players × 8 attrs × 0.5) hard-capped by a
docs/EVO-BLUEPRINT.md:286:  pure proportional `enforceBudget` at founding / rebirth crossover / the
docs/EVO-BLUEPRINT.md:289:  path, survives only at founding). Budget bar on team cards (预算 spent/cap).
docs/EVO-BLUEPRINT.md:291:  evo-drift, 40-50 gens): totals PLATEAU 20.6→~23.8 at the cap (attribute
docs/EVO-BLUEPRINT.md:295:  goes from a downward random-walk (no price) to held ~0.56** — the budget
docs/EVO-BLUEPRINT.md:319:  **budget-allocation heatmap** (16×8, single-hue ramp) beside it.
docs/EVO-BLUEPRINT.md:332:  gens × 2 seeds): **the speed target is ALREADY MET post-budget** — spread
docs/EVO-BLUEPRINT.md:340:  the budget + visibility already deliver fast visible divergence; revisit
docs/EVO-BLUEPRINT.md:351:  style dims as curves/budget + squad + family tree; (3) the **dynasty
docs/EVO-BLUEPRINT.md:353:  (4) population trends (divergence, formation shares, budget heatmap) with
docs/EVO-BLUEPRINT.md:359:  NOT yet in it (next iterations as reports come in): per-club budget
docs/EVO-BLUEPRINT.md:411:  (`evolution/coach.ts`; the club keeps squad/academy/budget/colors/Elo/
docs/EVO-BLUEPRINT.md:419:  travels with the person under the zonal budget (adapts to man when full).
docs/EVO-BLUEPRINT.md:428:  budget never breached, multi-club coaches exist. Emergent and kept: the
docs/EVO-BLUEPRINT.md:477:  must fit UNDER the budget without taxing the squad (headroom =
docs/EVO-BLUEPRINT.md:481:  not the rich** (D2 buys 42–48%); budget violations 0/960 club-seasons;
docs/EVO-BLUEPRINT.md:487:  the tax model (allow over-headroom signings, enforceBudget shaves the
docs/EVO-BLUEPRINT.md:500:  attribute bars + personal appetites as DIVERGING bars around the
docs/EVO-BLUEPRINT.md:542:  stamina attribute, staminaConservation's "fresher legs late" (misers
docs/EVO-BLUEPRINT.md:567:  stamina mechanism pins (spendBurst attribute scaling; the
docs/EVO-BLUEPRINT.md:649:  `SQUAD_BUDGET` 24→36 = the same per-player density, so **a deep bench
docs/EVO-BLUEPRINT.md:703:  starter in the budget-headroom era).** Cards/match 0.84→1.18-1.25 🟨
docs/EVO-BLUEPRINT.md:712:- ✅ **phase-63 SHIPPED** (**the ROUTE-ONE / AERIAL channel** — the
docs/EVO-BLUEPRINT.md:715:  structures can't all cover). The anatomy probe (`aerial-anatomy.ts`)
docs/EVO-BLUEPRINT.md:717:  produced NO aerial contact** — the delivery led the runner by his full
docs/EVO-BLUEPRINT.md:729:  (3) **STRENGTH owns the air** — `aerialSense` reweighted (defending
docs/EVO-BLUEPRINT.md:730:  0.3→0.15, strength 0.1→0.3; the aerial payoff phase-47 assigned to
docs/EVO-BLUEPRINT.md:745:  League headers won 2.8→3.9/match. Tests: +2 aerial pins (strength
docs/EVO-BLUEPRINT.md:894:  0.476, dribble/press within baseline wander. Aerial channel A/B'd
docs/EVO-BLUEPRINT.md:895:  HEALTHY (aerial-anatomy per-cross attacker headers 6.6→7.3%
docs/EVO-BLUEPRINT.md:935:  (0.42@gen30 ≈ baseline), aerial channel healthy. Two fragile pins
docs/EVO-BLUEPRINT.md:990:  positioning 3.9×/match) and the clearly-better price bar (q·1.2+0.03
docs/EVO-BLUEPRINT.md:1011:  sim change, fingerprint REBASELINED `bd7ba2da…`). (1) AERIAL SWING:
docs/EVO-BLUEPRINT.md:1012:  `aerialSwing` gives lofted switches and dinked through balls a
docs/EVO-BLUEPRINT.md:1055:  goalmouth camping 2.7%/19% (residue = legal line-level positioning
docs/EVO-BLUEPRINT.md:1203:  you've trained) follows the evolved `strength` attribute →
docs/EVO-BLUEPRINT.md:1320:  saw it. Diagnosis: attributes HOLD under the budget (defending
docs/EVO-BLUEPRINT.md:1445:  gift at 0.9+, panic at 0.2) — composure is a budget line, not a
docs/EVO-BLUEPRINT.md:1457:  budget-clamped; founders/fitness pure. Mechanism VERIFIED (def
docs/EVO-BLUEPRINT.md:1497:  picking the target (aerial-channel linkage); the hands-Pass was a
docs/EVO-BLUEPRINT.md:1583:  budget viz done right + trap-school feed credit → 116 Evolution
docs/EVO-BLUEPRINT.md:1631:  the Phase-63 aerial channel's own shape; ×0.35 rare entry, founders
docs/EVO-BLUEPRINT.md:1657:  自走"): the remaining distance to the vision concentrates in ①the
docs/EVO-BLUEPRINT.md:1667:  (attribute-blind aim/spread bonuses — make composure
docs/EVO-BLUEPRINT.md:1699:  phase-61 XI-vs-bench budget split gains survival value, and the foul
docs/EVO-BLUEPRINT.md:1854:  cure). Entries ~50% first-touch spills / 35-39% tackle squirts /
docs/EVO-BLUEPRINT.md:1886:  instrument). `spill-anatomy.ts`: the first-touch spill is HONEST —
docs/EVO-BLUEPRINT.md:1940:  positioning / off-ball-IQ MISSING attr sits directly under this too.
docs/EVO-BLUEPRINT.md:1958:  off-ball run-timing + first touch = the MISSING positioning/off-ball-IQ
docs/EVO-BLUEPRINT.md:1959:  attr. So the seven's real enabler may be the positioning ATTRIBUTE
docs/EVO-BLUEPRINT.md:1961:- ⭐⭐ **2026-07-19 119j — the POSITIONING ATTRIBUTE SHIPPED (foundation +
docs/EVO-BLUEPRINT.md:1962:  reception wiring).** Added `positioning` as the 9th player attr
docs/EVO-BLUEPRINT.md:1964:  SQUAD_BUDGET 36→40.5 (9×9×0.5, density-preserving = a real trade-off,
docs/EVO-BLUEPRINT.md:1966:  the v17→v18 migration runs enforceBudget → a squad missing the 9th
docs/EVO-BLUEPRINT.md:1969:  under pressure (`touchFailChance` positioning term taming pressure+
docs/EVO-BLUEPRINT.md:1975:  re-attempt the give-and-go with positioning making A's reception clean.
docs/EVO-BLUEPRINT.md:1978:  an attribute's first wiring should target a WELL-REWARDED outcome
docs/EVO-BLUEPRINT.md:1980:  retention). `positioning-bite.ts` kept (the maxed-genome yardstick).
docs/EVO-BLUEPRINT.md:1981:- ⭐ **2026-07-19 THE ATTRIBUTE/GENE AUDIT vs FIFA/FM/PES (strategic
docs/EVO-BLUEPRINT.md:1984:  strength via aerialSense), tackling-vs-marking (both `defending`),
docs/EVO-BLUEPRINT.md:1985:  accel-vs-topspeed+agility (→`pace`), composure/vision/first-touch
docs/EVO-BLUEPRINT.md:1988:  ⭐ POSITIONING / off-ball intelligence / anticipation (the deepest
docs/EVO-BLUEPRINT.md:1989:  gap — all positioning is team-gene + formation-table, no player-level
docs/EVO-BLUEPRINT.md:1991:  GK attribute split (handling/kicking/positioning distinct from
docs/EVO-BLUEPRINT.md:1992:  reflexes — rides the keeper line). ⚠ SQUAD_BUDGET re-prices with
docs/EVO-BLUEPRINT.md:1994:  its place. Priority: scheme-gene (119h) → positioning attr → GK
docs/EVO-BLUEPRINT.md:2045:    0.02**. So 内切 / carry-wide DO emerge; the aerial cross does not.
docs/EVO-BLUEPRINT.md:2054:    the attacker never wins the aerial cleanly (goes loose). And it broke 3
docs/EVO-BLUEPRINT.md:2057:  - ⭐ **REFRAME (the honest conclusion):** the high AERIAL cross is
docs/EVO-BLUEPRINT.md:2063:    phase = strengthen the CUTBACK (ground, no broken aerial contest) so it
docs/EVO-BLUEPRINT.md:2065:    the fragile tests re-anchored deliberately. The aerial cross is NOT the
docs/EVO-BLUEPRINT.md:2085:    positioning-gated, then attacks wide) — REVERTED, MEASURED BACKFIRE.** It
docs/EVO-BLUEPRINT.md:2096:    6v6 byline weapon — NOT the aerial cross) convert.** Everything else
docs/EVO-BLUEPRINT.md:2142:  aerial instead of the ground cutback to the (open, in a zonal seam) arriver.
docs/EVO-BLUEPRINT.md:2214:- ⭐⭐⭐⭐ **2026-07-19 (cont.7) PROJECT B — THE EMERGENT POSITIONING FIELD
docs/EVO-BLUEPRINT.md:2215:  (user chose "B 优先,先开工"; the 2nd foundational defect from VISION §1).**
docs/EVO-BLUEPRINT.md:2219:  the tables, VISION-gated (§2 watchability + §1 emergence + §3 realism):
docs/EVO-BLUEPRINT.md:2220:  - **B0 DONE — `positioning-shape.ts` baseline** (committed): current shape
docs/EVO-BLUEPRINT.md:2254:    `goals-warming.ts` + `positioning-shape.ts` + calibrate, `EMERGENT_POS=1`.
docs/EVO-BLUEPRINT.md:2268:    (VISION §2 — only the user can judge play-feel: is the shape visibly fluid
docs/EVO-BLUEPRINT.md:2282:    is VARIETY (solo-dribble share is high; VISION §3 wants cross/cutback/

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba docs/ROADMAP.md | sed -n '1,225p'; nl -ba docs/EVO-BLUEPRINT.md | sed -n '1,220p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	# Roadmap — shipped through phase-92 (containment repriced: wins neutral head-to-head; adoption still unstable — the fork sharpens)
     2	
     3	## ⭐⭐⭐⭐ THE GOLD STANDARD IS [`VISION.md`](VISION.md) (2026-07-19) — measure every decision against it
     4	## ⭐⭐⭐ THE MASTER PLAN IS NOW [`EVO-BLUEPRINT.md`](EVO-BLUEPRINT.md) (2026-07-14, user-ratified)
     5	
     6	> 🎯 **RESUME (2026-07-20, post-compact): TASK #8 甲 — sub-step 1 DONE (uncommitted).**
     7	> ✅ **POSITION-AWARE BUDGET landed** (`playerGenome.ts` `countsForBudget` + `squadTotal`;
     8	> `SQUAD_BUDGET` 40.5→35.5; `League.ts` fire-sale headroom + v32→v33 migration; SAVE_VERSION
     9	> 32→33). reflexes = keeper-only (8 outfielders freed); **finishing/defending free for the GK**
    10	> (dead — never shoots/tackles) → the keeper's budget base is its OWN. Cap dropped in lockstep
    11	> (71 counted slots × 0.5) so useful density stays 0.5. **VALIDATED: tsc clean · §2 BIT-IDENTICAL
    12	> @8-season gate · @25-season tracks OLD within noise (goals 3.30 vs 3.19, all else ≈identical) ·
    13	> cap binds 56% @25 · GK base differentiated (GK finishing 0.28 vs ST 0.56).** ⚠ NOT committed
    14	> (user hasn't asked); genome/save-ver change = user's 甲 call (confirmed).
    15	>
    16	> **→ NEXT = the OUTFIELD BASE (user 2026-07-20: "门将底座没必要大手笔…但场上踢的是真的影响,
    17	> 底座需要做的很好" = keep GK LIGHT ✓done, invest the real substrate work in the OUTFIELD).**
    18	> ⚠️ **Sub-step 2 (vision attr) FIRST CUT = "读数精度 on PASSING" — TRIED + REVERTED (honest-revert,
    19	> §2 hard gate).** Added `vision` (10th attr, budget 35.5→40.0) + wired it as a continuous
    20	> lane-read multiplier replacing the binary `playmaker` ×1.15. BOTH tunings FAILED §2: goals
    21	> +23% (lane+open) / +17% (lane-only, mean-centred), headers −25–34%, aerial route collapses.
    22	> **STRUCTURAL, not a tuning miss: passing→goals is CONVEX, so making the best passers sharper
    23	> inflates scoring even with a mean-preserving spread — a one-sided attacking buff.** Fully
    24	> reverted → tree bit-identical to sub-step-1 baseline again. **→ the fix (user's call, asked):
    25	> vision must be applied SYMMETRICALLY (gate the DEFENDER's interception/anticipation read too,
    26	> so attack↑ is balanced by defense↑ → §2-neutral), OR defense-read FIRST (likely §2-neutral-or-
    27	> better), OR defer vision & do `positioning`-live (sub-step 3) next.** Sub-step 3 = wire
    28	> `positioning` LIVE off-ball (today only a first-touch sub-term). De-dead-weight `strength`.
    29	> One sub-step, §2-gated, honest-revert. Fork B (distinct GK attr template) DEFERRED — chose light A.
    30	
    31	---
    32	⭐⭐⭐⭐⭐ **2026-07-20 SELF-DRIVE — density KEPT (user 留) + step-2 lever REVERTED→REFRAMED (⭐ NEWEST).**
    33	
    34	**Density verdict:** user play-tested → "观赏性我觉得没问题,可以go,你自走吧" = **KEEP**.
    35	PITCH_SCALE 0.70 + emergent-default are the CONFIRMED baseline now (see #1 above),
    36	not a candidate. Sequence unblocked.
    37	
    38	**Step-2 lever tried = RETIRE the in-possession width FLOOR (`formations.ts:266`,
    39	`widthMul` floor 1.0 → gene-driven 0.55..1.55). REVERTED (honest-revert, §2 hard
    40	gate).** Clean single-lever A/B vs HEAD (baselines captured):
    41	- ✅ **§4 diversity WIN** — `positioning-shape` WIDE−NARROW spreadY divergence
    42	  **1.2m → 2.1m (+75%)**; WIDE stays wide (6.0), NARROW gets genuinely narrow
    43	  (3.9). Width finally expresses across the `attackingWidth` gene.
    44	- ❌ **§2 watchability FAIL** — the SAME change congests the middle: `calibrate 8`
    45	  **goals 2.00→2.26 (+13%)**, shots +11%, **headers +24%** (10.5→13.0), fouls/cards
    46	  up, through-balls down; `positioning-shape` nn-dist tighter across the board;
    47	  `clump-vs-wide` gap **WIDENED 3.4×→5.4×** (CLUMP 3.48/WIDE 1.02 → 3.38/0.63).
    48	- ⭐ **DIAGNOSIS (the reframe):** the width floor is a genuine COMPENSATING bias —
    49	  but it compensates for **width-not-paying**, and that root cause is UNFIXED.
    50	  Retire the floor before width pays → the meta just slides NARROWER into the
    51	  中路乱抢 the user hates. **So step-2 (retire width biases) is BLOCKED on step-3
    52	  (QUALITY CLUSTER must make wide play connect/pay FIRST — attack the box, combos
    53	  reliable — THEN retire the floor and re-observe).** Queue RE-SEQUENCED: 3 → 2.
    54	- ⭐⭐ **ROOT CAUSE PINNED (2026-07-20 diagnostic probes, dense pitch):** WHY
    55	  width doesn't pay = **the final ball into the box finds too few attacking bodies
    56	  + a third of deliveries die in flight.** `cross-anatomy`: crosses convert ~5%
    57	  (NOT ≈0 — the clump-vs-wide extreme overstated it), but **46–54% of crosses are
    58	  `noAerial` = NOBODY contests them** (vs BUS 54%, atkHeader 25%→18% — the box is
    59	  under-crashed, worst vs a packed block). `cutback-anatomy`: cutback→goal 5.3%,
    60	  only 20% → shot, **35% die in flight (mostly intercepted)**, 39% of arrivals
    61	  lost. **→ The true upstream lever = OFF-BALL MOVEMENT INTO DANGEROUS SPACE
    62	  (crash the box on a delivery; proactive drop/arrive to receive) — the SAME root
    63	  as combo-reliability + check-to-ball (step-4). `supportSpot` is always AHEAD of
    64	  the ball & nobody attacks the 6-yd/penalty-spot on a wide ball.** This is the
    65	  next probe-first lever (gene-gated arrival, NOT a scripted run). cf. the earlier
    66	  obs8 pass-power revert — same lesson, combo bottleneck is upstream positioning.
    67	- ⭐⭐ **DESIGN + VISION UPDATED → "让球员/教练自己长眼睛" (gene-weighted SPACE-VALUE
    68	  field, two levels: player-local + coach-global). VISION §1 rewritten with the
    69	  user's words (内切/包抄/回撤 should EMERGE from ONE value field, not be hand-added).
    70	  Tasks re-cut (#2 player value field · #3 cut-inside via same logic on carry
    71	  direction · #5 width-floor deferred · #6 coach-global value field · #7 possession
    72	  contest+transition).**
    73	- ⭐⭐ **FIRST CUT of the value field REVERTED (honest-revert, 2nd this session) — but
    74	  a KEY DESIGN CORRECTION.** Rewrote `supportSpot` into a gene-weighted candidate
    75	  scorer (base + box-crash + drop candidates, scored by openness+receivability−clump
    76	  + gene/attr appetite). A/B: box-arrival did NOT emerge (`cross-anatomy` noAerial
    77	  46→50% / 54→59% — box got EMPTIER), §2 regressed (`calibrate` goals 2.00→2.42 +21%,
    78	  cutbacks 3.69→3.29, headers 10.5→7.8), width didn't rise (`scheme-matchup` W-v-Z
    79	  0.67→0.48). **LESSON: an openness-maximizing value field is the WRONG model for
    80	  BOX-ARRIVAL — the box is a LOW-openness contested zone, so the scorer AVOIDS it +
    81	  scatters supporters into empty pockets (→ emptier box, +turnovers, +goals).**
    82	  → **Split the design: (a) CHECK-TO-BALL / support / overload / drop = genuinely a
    83	  space-value(openness) field ✅; (b) BOX-ARRIVAL = delivery-ANTICIPATION, NOT
    84	  openness — must be COUPLED to an imminent wide delivery (extend `TeamBrain.
    85	  assignRunners` arriver → gene-scaled multi-body crash, TIMED like the corner
    86	  hold→burst), the cutback-arriver mechanism generalized.** Do box-arrival (a
    87	  delivery-coupled licensing change) as the next cut; keep the value-field for
    88	  check-to-ball separate.
    89	- ⭐⭐⭐ **CUT 2 (two-eye value field: space + BALL, per user "得知道空间在哪+球在哪")
    90	  ALSO REVERTED — same signature. → STOP hammering box-arrival-via-supportSpot;
    91	  RE-DIAGNOSE.** Both cuts: box did NOT fill (`cross-anatomy` noAerial 46→51%), §2
    92	  regressed (goals 2.00→2.41 +20%, **offsides 2.20→3.36 +50%**), width did NOT rise
    93	  (`scheme-matchup` W-v-Z 0.67→0.48). **THE OFFSIDES SPIKE is the tell: bodies DO try
    94	  to attack the box now but arrive OFFSIDE (uncoordinated with the delivery) → box
    95	  stays empty + structure disrupted → goals inflate via broken play.**
    96	- ⭐⭐⭐ **KEY under-weighted data + the REFRAME:** (1) a BALANCED team ALREADY fills
    97	  the box fine (`cross-anatomy` BAL: noAerial **26%**, atkHeader **33%**, goal/shot
    98	  16%) — box-arrival is NOT universally broken; it's CROSS-SPAM (early/excess crosses
    99	  outrun arrival) + the extreme WIDE genome being a bad archetype. (2) **WIDTH is a
   100	  LOW-EV mode vs EVERY defense (0.5–1.0) while central CARRY is HIGH-EV (2.2–3.2) —
   101	  because CROSSING IS INHERENTLY LOW-YIELD (cross→goal ~5%), which is REALISTIC (real
   102	  open-play crosses are ~1–2%).** So "make crosses out-score central carry" is the
   103	  WRONG goal — unrealistic. Real width's value = STRETCH the defense to OPEN the
   104	  center + let wide men CUT INSIDE into the high-EV central space (inverted winger),
   105	  NOT out-cross the middle. The unrealistic thing is CENTRAL CARRY being TOO strong
   106	  vs non-zonal defenses (zonal already bites it 58→14; man/default gets shredded; only
   107	  1–2/16 play zonal). **Two candidate realistic levers to STEER on: (A) CUT-INSIDE —
   108	  wide→cut into the opened center (taps the high-EV carry from wide, validates the
   109	  user's earlier instinct); (B) punish CENTRAL CARRY through congestion vs non-zonal
   110	  too (过一个还有另一个, so the clump stops being a free lunch). Box-arrival/crossing =
   111	  accept it as the low-yield supporting weapon it realistically is.** Awaiting user steer.
   112	- Tree left CLEAN at HEAD `ed62978` (only ledger/VISION docs changed). Baselines
   113	  saved this session: calibrate goals 2.00 / cutbacks 3.69 / compl 75%; posshape
   114	  WIDE 6.4 / NARROW 5.2; clump-vs-wide 3.48/1.02; cross noAerial 46/54%; cutback
   115	  20%→shot 5.3% goal; scheme-matchup W-v-Z 0.67 / W-v-M 1.02 / D-v-M 3.18 / D-v-Z 2.23.
   116	- ⭐⭐⭐ **VISION §1 EXTENDED to the full perception→value→action ENGINE (user ratified
   117	  "从底层做了一个足球引擎,方向是对的").** Eyes = 球+对手+队友+场地+**自身**(朝向/我的属性/
   118	  体能)+**动态·预判**(对手结构=提前观察+预判);space is DERIVED; inputs feed multi-dims
   119	  (space/threat/receive/goal); **eye-QUALITY = an attribute** (长眼睛本身分化). Honest cost
   120	  named: engine-first is 承重级/slower/"worse-before-better" → build incrementally, keep the
   121	  baseline revertible, each engine piece must BEAT §2 to ship.
   122	- ⭐⭐⭐ **ATTRIBUTE AUDIT (the engine's INPUTS; ATTR_KEYS ×9, budget SQUAD_BUDGET 40.5):
   123	  3 wasteful + 1 missing + 3 attr-blind.** DEAD/WEAK (eat budget, ~no effect): **`reflexes`
   124	  = DEAD for 8/9 (GK-only reads)**; **`positioning` = near-inert** (only a first-touch
   125	  sub-term; its docstring's off-ball IQ never shipped) — ironically the attr the SELF/off-ball
   126	  eye needs; **`strength` = one-trick** (aerialSense 0.30, near-decorative on the ground).
   127	  STRONG/live: pace · passing · dribbling · finishing · defending (stamina medium). ATTR-BLIND
   128	  mechanics (flat constant an attr could bite NOW): **`TURN_RATE` 6.5** (agility — everyone
   129	  turns identically; bites cut-inside/1v1), **`SHOT_SPEED` 27** (open-play shot power flat),
   130	  and **perception = PERFECT full-field for ALL — NO vision/awareness attr** (only the
   131	  `playmaker` trait) = the biggest gap + exactly the "eye-quality" the eyes model needs.
   132	  Gaps ranked: vision/awareness(1) · agility/turn(2) · positioning-made-live(3, fix-not-add) ·
   133	  composure(4) · raw aerial/jump(5) · shot-power(6) · tackle-vs-mark(7) · accel-vs-topspeed(8) ·
   134	  weak-foot(10, needs NEW mechanics). → **engine-input cleanup = reclaim reflexes budget +
   135	  add `vision` (eye-quality) + wire `positioning` live; genome change = save-ver bump +
   136	  fingerprint rebaseline = USER's architectural call.**
   137	
   138	---
   139	⭐⭐⭐⭐⭐ **2026-07-20 SESSION WRAP — GAP BASELINE + SELF-DRIVE QUEUE (⭐ RESUME HERE FIRST).**
   140	
   141	**LIVE STATE (HEAD `163f16b`, on Pages):** the density 相变 is SHIPPED as a
   142	candidate (pitch scale 0.70 + emergent positioning DEFAULT — see the block
   143	below). Render/view fixes also shipped: the 3D renderer is now RESPONSIVE
   144	(fills the viewport, cinematic fills the page — `ThreeMatchRenderer.resize()` +
   145	ResizeObserver, NO fullscreen API) and the green adboard "beams" scale with the
   146	pitch. Iterate render/feel with **`npm run dev`** (localhost:5173, fast HMR — no
   147	CI wait); commit+push (personal acct `Quarkgluonmixture`, `gh auth switch`) when
   148	confirmed; trust the browser for pixels (headless flaky).
   149	
   150	✅ **#1 DECIDED 2026-07-20 — the density 相变 is a KEEP.** User play-tested and
   151	判决: "观赏性我觉得没问题,可以go,你自走吧" (watchability is fine → GO; self-drive).
   152	PITCH_SCALE 0.70 + emergent positioning DEFAULT are now the confirmed baseline,
   153	not a candidate. Data said GO (cutbacks +235%, scramble-born goals flat 4–7% to
   154	0.70, goal inflation DOWN) and the user's eyes agree on VISION §2. Sequence
   155	unblocked → now on **step 2: retire the compensating width hand-biases + re-run
   156	evo + OBSERVE diversity on the denser pitch.**
   157	
   158	**GAP BASELINE (code-verified inventory 2026-07-20). The substrate is FAR more
   159	complete than a "missing systems" story — most of real football's repertoire
   160	already EXISTS and is gene/attr-driven** (shooting: long/chip/header · dribbling:
   161	knock-and-run/shield/slalom · link: lay-off/one-two/overlap/third-man/cutback ·
   162	set-plays: corners 4-routine/FK/penalty · transition: counter + gegenpress-vs-
   163	drop). So the distance to real football / VISION §3 is mostly EXECUTION QUALITY
   164	+ a few missing abilities + feel, NOT missing systems:
   165	- **QUALITY gaps (why it still "looks not-real"):** ① combos unreliable — 二过一/
   166	  做球/倒三角 mechanics exist but pass力学 (short-pass ~9 m/s floor + lateral
   167	  `orientationNoiseMul` + one-touch `oneTouchMul`) makes them physically miss
   168	  (obs8; naive fix REVERTED — redo RIGHT on the denser pitch where passes are
   169	  shorter). ② possession too discrete — capture = geometric nearest-within-1.25 m
   170	  INSTANT owner-flip (`Match.ts:1776-1842`), no physical 50-50 contest/jostle
   171	  (user-flagged). ③ no transition urgency — `MarkOpponent` has no counter/track
   172	  sprint lever (obs5). ④ goal-kick pinball (obs2), keeper throw too flat (hits
   173	  mates), keeper can't walk while holding (Bug3).
   174	- **Genuinely MISSING abilities (add as GENE-GATED abilities, not scripts):**
   175	  **check-to-ball / drop-to-receive (回撤接应, proactive — supportSpot is always
   176	  AHEAD of the ball; this is ALSO the upstream of combos, obs7)**, cut-inside
   177	  (内切 — dribble only goes down the line), volley, underlap; + decision richness
   178	  (place-vs-power & near/far-post are AUTO in open play, not chosen).
   179	- **§1 cleanup:** retire the compensating hand-biases (the width levers) on the
   180	  denser pitch, then re-run evo + OBSERVE diversity.
   181	- **Feel/visual:** dribble touch cadence (DECIDED = 忠于脚, SIM-level carry
   182	  cadence, not a render fake), keeper throw ARC (raise it), keeper walk-holding.
   183	- **Deliberate arcade deviations — do NOT "fix"** (VISION §3): throw-in→kick-in,
   184	  offside→goal-kick, no indirect FK.
   185	
   186	**SELF-DRIVE SEQUENCE (one lever · probe-first · A/B · emergence, VISION is the
   187	acceptance test):**
   188	1. Land the density verdict (user play — 留/退).
   189	2. Retire compensating hand-biases + re-observe diversity on the denser pitch.
   190	3. **QUALITY CLUSTER (the biggest step to "looks real"):** combo reliability
   191	   (pass力学, done right on the denser pitch) → physical possession contest
   192	   (capture 50-50 duel) → transition sprint urgency.
   193	4. **MISSING abilities:** check-to-ball (回撤接应) → cut-inside.
   194	5. **Feel polish:** 忠于脚 touch cadence → keeper throw arc + walk-holding →
   195	   goal-kick targeting.
   196	
   197	(This session's play-triage + all the shipped fixes are in the dated blocks
   198	below; VISION.md stays the gold standard, this is the current gap snapshot.)
   199	
   200	---
   201	⭐⭐⭐⭐ **2026-07-20 THE DENSITY 相变 — SHIPPED AS A PLAY-TEST CANDIDATE (⭐ NEWEST RESUME POINT).**
   202	VISION §1 named two load-bearing substrate roots behind the endless width/position
   203	reverts: (A) space/density + (B) emergent positioning. This phase does BOTH,
   204	probe-validated first:
   205	- **Probe** (`scripts/probes/density-probe.ts`, scale-invariant, goal scaled with
   206	  pitch): swept PITCH_SCALE 1.0→0.55 with emergent ON. Clean gradient — cutbacks
   207	  MONOTONICALLY up (1.59→3.89@0.70, +145%), strong-side r up (0.78→0.86),
   208	  proportional clumping DOWN, scramble-born goals flat 4–7% until 0.55 where it
   209	  JUMPS to 16% (the 乱抢 cliff). **Sweet spot ≈ 0.70** (213 m²/player) — passes
   210	  VISION §1+§2+§3 together (my first confounded run wrongly said §2 worsened; the
   211	  fix was scaling the clump radius + the goal).
   212	- **SHIPPED (candidate, uncommitted→committing):** `PITCH_SCALE` default **0.70**
   213	  in `constants.ts` (scales PITCH_LENGTH/WIDTH/BOX/CENTER/GOAL — physical sizes
   214	  fixed); **emergent positioning is now the DEFAULT** (`formations.ts`
   215	  emergentPosOn()→true; fixed tables scaled by PITCH_SCALE for the legacy path +
   216	  diagrams; `GameApp.readEmergentPos` default true). 26 tests re-baselined for the
   217	  new geometry (subagent, only tests/, no assertion gutted, verified). Gates at the
   218	  new default: **calibrate cutbacks 1.10→3.69 (+235%)**, completion 75%, goals 2.00,
   219	  balanced; **goals-warming late-mean 4.35 avg (DOWN from the old pitch's 5.07 —
   220	  LESS inflation)**. tsc+build+441 tests green.
   221	- ⚠ **NOT yet the final verdict:** VISION §2 watchability is the USER'S eyes
   222	  (trust the browser). Awaiting the play-test: does 0.70 look good / not cramped /
   223	  tactics legible? goals 2.00 is a touch low (small goal) — nudge goal scale up if
   224	  they want more scoring. **Honest-revert if §2 fails visually.** PITCH_SCALE=1
   225	  restores the old pitch.
     1	# The EVO WORLD blueprint (2026-07-14, user-ratified) — the master plan
     2	
     3	> ⭐ **THE GOLD STANDARD is [`VISION.md`](VISION.md)** (2026-07-19) — the single
     4	> authority on what the user WANTS; every decision is measured against it. This
     5	> blueprint (the plan/state) serves that vision, not the reverse.
     6	
     7	This supersedes the *plan* half of [`EMERGENCE-PIVOT.md`](EMERGENCE-PIVOT.md)
     8	(whose rationale, substrate audit, gates and the turnkey attribute scope stay
     9	canonical — this doc sequences them). ROADMAP.md points here.
    10	
    11	## The vision (the user, 2026-07-14)
    12	
    13	> 就像看着现实足球队伍一样,涌现不同战术,然后互相竞争,进化,然后每个队员,
    14	> 每个队伍的 coach,每个赛季杯赛,都有独特闪光点和打法,并且都在 evo,而且
    15	> 有竞争有激烈,并且需要有个更可视化的方法来看他们进化,并且这一切都是有很
    16	> 真实并且足够质量高的底座支撑。
    17	
    18	A living football world: tactics, players, coaches, seasons and cups all
    19	carry earned identities, all evolve, competition is fierce and legible, and
    20	everything rests on a realistic, high-quality simulation substrate.
    21	
    22	**The two structural insights this blueprint adds to the pivot:**
    23	1. *Coaches and transfers are not decoration — they are new CHANNELS for
    24	   evolution.* A coach embodies the tactical genome and lets philosophies
    25	   spread by MOVEMENT (memetic channel); a free-agent market lets player
    26	   genes re-circulate outside rebirth crossover (second genetic channel).
    27	2. *The fitness function currently hand-picks virtues* (pass completion,
    28	   recoveries, stamina efficiency reward ONE texture for everyone) — a hidden
    29	   convergence pressure, to be removed in favor of results-dominant fitness.
    30	
    31	## Principles (binding, all stages)
    32	
    33	- **The emergence meta-rule extends to every new layer**: coach philosophies
    34	  are evolved genomes, never preset archetypes; nameplates / eras / narrative
    35	  categories are DISCOVERED from data (only a dimension→vocabulary grammar is
    36	  hand-built); the narrative layer READS records and never feeds back into
    37	  the sim.
    38	- **One lever per phase, probe evidence per phase** (ARCHITECTURE invariant
    39	  11): dedicated probe A/B vs the previous tag, `npm run calibrate -- 8` on
    40	  two seeds, full test gate, fingerprint rebaseline, chain-tested save
    41	  migrations.
    42	- **Order = leverage**: Engine (diversity exists) → Visibility (diversity is
    43	  seen) → World (diversity gets faces and stories) → Substrate thickening.
    44	- **Do not resurrect** the parked hand-set behaviors (take-on, run-license,
    45	  widen-formation) and do not hand-set new ones.
    46	
    47	## Stage 1 — ENGINE: make evolution actually produce diversity
    48	
    49	| Phase | Lever | Gate |
    50	|---|---|---|
    51	| **45 (A1)** | 套路 combos gene-driven: fold Phase 34's hand-set trigger thresholds/appetites (wall pass / third man / overlap) into per-franchise policy genes, born at today's constants (the proven phase-42 pattern). Also: run `policy-coherence` to establish the coherence baseline. | combo-rates A/B (specialists diverge, league mean stable) + policy-emergence + calibrate ×2 |
    52	| **46 (A2)** | Breakaway substrate fix: the carry-push cone is keeper-BLIND (verified defect — maxed attrs still ~8-9% heavy-touch→keeper). Make the push-target keeper-aware at the physics-primitive level, unbiased, so pace/space PAY. | `breakaway.ts` A/B + calibrate ×2 |
    53	| **47 (B)** | Attribute expansion 5→8: `pace/passing/dribbling/finishing/defending/strength/stamina/reflexes` — exactly the turnkey scope in EMERGENCE-PIVOT §5 (per-line technique remap incl. the mechanics.ts ambiguity GOTCHA, strength/stamina payoffs, ROLE_BIAS MF→passing, traits, DECLINE_W, probes to 8 keys, save v11→v12 neutral backfill). | calibrate ×2 watching completion+goals (fm 16–21) + player-archetype probe |
    54	| **48 (C)** | **Resource budget (the keystone)**: `SQUAD_BUDGET` = hard cap on the squad's total attribute points; one pure `enforceBudget(squad)` (proportional rescale) applied after rebirth crossover, the careers develop pass, and newgen entry. SQUAD-level on purpose: star-plus-role-players vs balanced-six becomes an evolvable axis. Rejected: fitness penalty (invisible, evolution routes around), per-player cap (kills the star axis). **Rides with it: academy heredity** — newgens mutate the retiring slot's attrs (club bloodline) instead of random+ROLE_BIAS; ROLE_BIAS retires. Cap derived by probe (bind early: ~founding mean ×1.1–1.2), settled by calibrate. Budget bar on the team card. | specialization probe (within-player variance ↑, cross-club allocation divergence ↑) + evo-drift plateaus at cap + calibrate ×2; rewrite the careers mean-stability test (the budget intentionally changes that invariant) |
    55	| **50 (E)** | Selection speedup, one lever at a time, judged by a new `style-speed` probe (**target: visible clustering ≤8–10 seasons on fresh saves**, spread ≥15% / ≥3 nameplate clusters): (1) **fitness slimming** — results-dominant (points ~0.5, GD ~0.2, styleConsistency ~0.1; drop passCompletion/recoveries/staminaEfficiency); (2) parent diversity — reborn's second parent = highest-fitness club most gene-distant from the first (deterministic); (3) diversity thermostat — mutation scale rises when population spread sinks below a floor (derived from population state, unbiased, self-regulating); (4) only if still short: D2 rebornN 3→4. | style-speed A/B per lever + calibrate ×2 (watchability is the backstop if e.g. hoofball wins) |
    56	
    57	## Stage 2 — VISIBILITY: make evolution seen (phase 49, right after the budget)
    58	
    59	- **Data-driven nameplates**: z-score each club's (genome+policy) vector
    60	  against the current population; top-2 |z| dims feed a dimension→vocabulary
    61	  grammar (zh). Replaces `describeIdentity`'s fixed threshold buckets (which
    62	  violate the meta-rule). On team cards, clash banner, league table chips.
    63	- **Style-space map**: clubs scattered on the season's two highest-variance
    64	  dims (stable + interpretable; deliberately NOT PCA — axes would flip
    65	  between seasons), with N-generation trails and cluster hulls; cluster
    66	  names generated from centroid extremes.
    67	- **Divergence dashboard**: the policy-emergence spread metric in-game
    68	  (curve over generations), per-gene mean±band sparklines, a diversity
    69	  index, per-club budget-allocation heatmap.
    70	- Engineering: SeasonRecord snapshots the population matrix (16×~40 floats);
    71	  fingerprint moves by strip-and-rehash-proven schema growth only; phone
    72	  ≤390px, i18n zh, Playwright sections.
    73	
    74	## Stage 3 — WORLD: give evolution faces and stories
    75	
    76	- **W1 Coach entity** (philosophy embodied + the memetic channel): the
    77	  tactical genome + policy genes move INTO a named, aging coach; the club
    78	  keeps squad/academy/budget/prestige/rivalries. Same genetic operators, now
    79	  with mobility: rebirth = hiring (crossover of successful coaches'
    80	  philosophies); a chronically-bottom surviving club can SACK and hire from
    81	  the pool of out-of-work coaches (dead clubs' ex-managers) — tactics spread
    82	  by movement. Coach careers, retirement, hall of fame, mentor tree (a
    83	  retiring coach's philosophy seeds a newgen coach). ⚠ The mobility channel
    84	  accelerates convergence — monoculture probes are a hard gate.
    85	- **W2 Player personal style**: a small per-PLAYER decision-bias gene set
    86	  (long-shot / take-on / one-touch / late-run appetites…) inherited through
    87	  academy heredity and transfers — the `rolePolicies` plumbing is the wire.
    88	  Traits re-derived over 8 attrs + style genes (cap 2/player, every trait
    89	  must have a play effect). Player cards get data-driven personal nameplates
    90	  + career highlight moments.
    91	- **W3 Free-agent fire-sale** (second genetic channel, minimal first cut):
    92	  a dying club's players enter a free-agent pool instead of vanishing;
    93	  clubs sign under the budget (now a real wage cap). Full active transfer
    94	  market only after the fire-sale channel's ecology is measured.
    95	- **W4 Season/cup narrative layer**: derived ENTIRELY from existing records
    96	  (points timeline, cup bracket, awards, records, rivalries, rebirths) — a
    97	  season story (when the title race was decided, the cup giant-killer, the
    98	  fallen dynasty, sackings and coronations) + a browsable chronicle
    99	  timeline; era names emerge from data clustering, never presets.
   100	
   101	## Stage 4 — SUBSTRATE thickening (long-term, pull-based)
   102	
   103	Parking-lot realism items admitted one at a time, each passing the test
   104	*"does it give genes a NEW payoff surface?"*: substitutions/bench first
   105	(rotation becomes an evolvable strategy, couples with stamina + budget),
   106	then form/morale, injuries, home-crowd effects, narrative-memory commentary.
   107	
   108	## The post-Stage-3 queue (2026-07-14 gap review, user-ratified) — ⭐ THE PHASE PLAN FOR 57+
   109	
   110	Stage 1–3 built the loop and the world; the gap review against the
   111	original vision ("好玩的,可以自我进化的,可视化优秀的,有深度的,玩着爽的,
   112	能自己产生多元化战术的,贴近现实足球") found the remaining distance
   113	concentrated in six places. **This queue IS the next phase plan** (user
   114	2026-07-14: "这些作为之后的phase计划") — work it in order, one phase per
   115	item unless a probe result re-scopes it, play reports still interleave:
   116	
   117	- ✅ **N1 — the COUNTER-PLAY probe (对战矩阵) — DONE, phase-57. VERDICT:
   118	  TRANSITIVE, the gate FIRES.** 0 cyclic / 21 fully-decisive triads; one
   119	  meta (narrow + direct + aggressive + risk-on) dominates every world's
   120	  champions. Full evidence + anatomy in the phase-57 ledger entry ⇒ N1.5.
   121	- **N1.5 — the COUNTER-PAYOFF SURFACE (inserted by N1's verdict; N5 is
   122	  HARD-GATED behind it)**: give the meta's strengths physical COSTS so
   123	  counters can EVOLVE — never hand-code the counter-tactic (the
   124	  emergence rule). One lever per phase; **the matrix probe IS the
   125	  regression gate: re-run it per lever; DONE when cycles ≥10% of
   126	  decisive triads.** Progress:
   127	  - ✅ lever 1 (phase-58) — the ENERGY ECONOMY BINDS: aggression priced
   128	    via real fatigue (MA correlation +0.51 → −0.54, era arms race
   129	    dissolved, width freed). Cycles still 0 — the meta rotated to
   130	    "Runners in waves / Compact block".
   131	  - ✅ lever 2 (phase-59) — the REACTION GATE: bystanders must SEE a
   132	    live pass to touch it. **The first cycle appeared** (Tiki-taka >
   133	    Compact bus > through-ball surgeons > Tiki-taka), cyclic 4.5%
   134	    (gate: ≥10%), no unbeaten king, the era arms race inverted (.431).
   135	    (The crossBase +0.87 axis it flagged was A/B-REFUTED by
   136	    `cross-anatomy.ts` — cross-heavy loses to everything, the bus
   137	    punishes it hardest; the n=12 dim correlation is a hypothesis
   138	    generator, NOT a verdict — always A/B before nerfing.)
   139	  - ✅ lever 3 (phase-60) — the UNSET WALL: blockers weigh by
   140	    facing·stillness. **Three cycles, 7.5%** (0→0→4.5→7.5%); the floor
   141	    (`UNSET_BLOCK_WEIGHT`) is the attack/defense dial — 0.3 broke the
   142	    balance (0 cycles, attack über alles), 0.55 shipped.
   143	  - ⚠ **the matrix RE-BASED at phase-61** (9-man rosters = new founding
   144	    worlds; the 0→0→4.5→7.5% trajectory ended with its era): 0 cycles /
   145	    26 decisive, decisive-edge rate 50%, pressIntensity +0.87 —
   146	    **rotation partially refunds the press fatigue tax**. The close
   147	    still means ≥10% cycles, measured on the roster-era worlds.
   148	  - ✅ lever 4 (phase-62) — **CARDS THAT BIND**: personal cards +
   149	    suspensions served by real lineups. **The close attempt FAILED**:
   150	    press correlation HALVED (+0.87 → +0.43 — the discipline tax hits
   151	    the right axis) but cycles stayed 0/44 and the era arms race is
   152	    strong (.762) — ~0.5% of starter-slots banned is a constant tax,
   153	    not frequency dependence. The decision point → the user re-framed
   154	    the question from real leagues (2026-07-16) ⇒ levers 5-6 + the
   155	    yardstick swap below.
   156	  - ✅ lever 5 (phase-63) — the AERIAL/ROUTE-ONE channel (cross
   157	    bombardment: unplayable → the matrix's top archetype).
   158	  - ✅ lever 6 (phase-64) — the UNDERDOG SHIFT (the bus becomes
   159	    opponent-conditional; +0.15 pts/match for the outgunned pragmatist).
   160	  - ✅ **N1.5 CLOSED at phase-65 under the RE-SCOPED gate.** The
   161	    ≥10%-cycles criterion is RETIRED: cross-era snapshot round-robins
   162	    conflate arms-race progress with style相性 (era .762 at 62 proved
   163	    it) and re-roll with every founding-rng change. The ecological
   164	    standard — **negative FREQUENCY DEPENDENCE, measured in-league**
   165	    (`freq-dependence.ts`, 2 worlds × 30 seasons) — gives the verdict:
   166	    **7 axes SELF-BALANCE** (a style's payoff falls as it spreads:
   167	    rotationBias −0.71, dribbleBias −0.66, markingAggression −0.56,
   168	    attackingWidth −0.51, defensiveCompactness −0.42, wide-212 −0.39,
   169	    keeperAggression −0.31 — different axes per world, ecology-true)
   170	    and — the load-bearing half — **ZERO RUNAWAY axes anywhere**: no
   171	    style anywhere gets STRONGER as it spreads. Diversity is
   172	    self-sustaining, not constraint-propped. N5 is UNGATED (mind the
   173	    phase-64 def-menu watch: one world skewed low-32 15/16).
   174	  - ✅ goals watch RESOLVED at phase-61: calibrate 2.70 / 2.59 — both
   175	    seeds back in band (fresh legs + the new founding ecology).
   176	- ✅ **N2 — SUBSTITUTIONS / the bench — DONE, phase-61**: 9-man rosters
   177	  under the widened budget (deep bench vs star XI is a REAL allocation),
   178	  dead-ball subs driven by the `rotationBias` gene, roster-indexed
   179	  careers/apps. Selection verdict: alive and ecology-dependent (world
   180	  424242 goes full carousel, world 991 stays mixed). Red-card
   181	  suspensions and injuries are UNBLOCKED by this infrastructure.
   182	- ✅ **N3 — COACH MATCH-DAY PRESENCE — DONE, phase-66** (save v21): the
   183	  `tinkerBias` gene scales the mentality response (stoic ×0.5 ↔
   184	  tinkerer ×1.5, 0.5 = the old curve bit-exactly), the ⚡/🧊/🔄 calls
   185	  are narrated under HIS name (+ the Phase-64 bus 🚌 finally gets its
   186	  kickoff line), and the coach STANDS ON THE TOUCHLINE in 3D (suited
   187	  figure + scarf + nameplate, tracks the ball, leaps on his side's
   188	  goals). Selection verdict: alive with full-width spread, no corner
   189	  runaway — the trade is real (chase bleeds counters, shut-down
   190	  protects). Ledger entry below.
   191	- ✅ **N4 — the TACTICAL BROADCAST layer — DONE, phase-68**: block
   192	  outline + press waves + the live mini formation map, presentation-grade
   193	  on a default-ON flag; render-only, fingerprint untouched. Ledger entry
   194	  below.
   195	- **N5 — FORMATION LIBRARY expansion** (UNGATED at phase-65 — N1.5
   196	  closed): 2×2×2 shapes is the hard ceiling on visible structural
   197	  diversity; add 6v6-honest attack shapes (asymmetry, twin ST,
   198	  deep-forward) as RARE mutations under an ecology budget (the zonal
   199	  lesson, failure mode 21; plus the phase-64 def-menu watch — low-32
   200	  crowded one world's defensive menu).
   201	- **N6 — the market signs for STYLE FIT**: player personality's second
   202	  selection channel — boards weigh appetite-fit with the coach's
   203	  philosophy, NOT a fitness term (failure mode 22 forbids uniform-virtue
   204	  rewards).
   205	- **Honest long-term note**: 6v6 itself is the realism ceiling (three
   206	  lines, full-backs, midfield triangles need bodies). 11v11 is the
   207	  endgame question — parked DELIBERATELY (an engine-scale rewrite), not
   208	  forgotten.
   209	
   210	Cross-cutting polish noted in the same review (fits any phase): entity
   211	LINKS between the screens (click a player in the chronicle → his deep
   212	dive; the world should be one navigable web, not three islands), and
   213	crowd AUDIO (noise swelling with xG, goal eruptions) — cheap, high 爽.
   214	
   215	## Status ledger
   216	
   217	Shipping a phase = gates green (calibrate band, evolve-check, vitest,
   218	visual, fingerprint noted) → ledger entry here + ROADMAP head →
   219	commit → **`git tag phase-NN`** → push commit AND tag. The Pages build
   220	stamps `git describe` into the corner version, so a missing tag ships

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba docs/EVO-BLUEPRINT.md | sed -n '1930,2010p'; nl -ba docs/EVO-BLUEPRINT.md | sed -n '2200,2290p'; nl -ba docs/ROADMAP.md | sed -n '2165,2345p'; nl -ba docs/ROADMAP.md | sed -n '2510,2575p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
  1930	  sit in covered lanes (the 119d-1 wall). Therefore the 乱抢 free-1v1,
  1931	  the off-ball-separation wall, the throttled give-and-go (wallRun), AND
  1932	  zonal-dominance are all ONE substrate defect: **the attack cannot pull
  1933	  a defence apart, a zone least of all.** ⭐ CONSEQUENCE: "free the
  1934	  marking scheme" (119h) is BLOCKED until the attacking counter exists —
  1935	  build the zone-breaker (give-and-go / off-ball movement that PAYS,
  1936	  119d) FIRST, then free the scheme and the four quadrants balance. This
  1937	  re-frames 119d: the target isn't "off-ball separation" (119d-1 helped
  1938	  the carry) — it's specifically movement/combination that beats a ZONE
  1939	  (pass-and-move as a linked action the zone can't track). The
  1940	  positioning / off-ball-IQ MISSING attr sits directly under this too.
  1941	- ⚠️ **2026-07-19 119i FIRST LEVER (the give-and-go RETURN) — ATTEMPTED
  1942	  + REVERTED (double fail, `ab2e43bd` restored).** `wallrun-anatomy.ts`
  1943	  found the give-and-go dies at the WALL not the go: licenses fire
  1944	  ~3/match, the burster gets open (peak sep 5.5m), but the wall B is
  1945	  dispossessed 80% before the return because he tries to CONTROL under
  1946	  pressure. Fix tried: B lays a FIRST-TIME return (a boosted through-ball
  1947	  led into A's burst). Mechanically worked — frozen oneTwos 0.07→0.5,
  1948	  return-played 4%→33%, aggressive-press GA 0.67→0.93. But BOTH real
  1949	  gates failed: (1) evolution DE-SELECTS it (fresh gate 7→2/16, oneTwos
  1950	  →0.01-0.06) because the return is net-negative-EV (A receives cleanly
  1951	  6%, assists 3%); (2) it INFLATES goals-warming to 15.25 vs 11.54
  1952	  (+3.7) — the license fires regardless so the extra through-balls feed
  1953	  converting chances late. ⭐ THE LESSON (durable): making a combination
  1954	  FIRE ≠ making it PAY; the completed one-two must be POSITIVE-EV for
  1955	  evolution to keep it, and the frozen oneTwos 0.5 was an artifact of
  1956	  old genes carrying the appetite. The bottleneck is RETURN QUALITY —
  1957	  A gets open but can't convert the received ball — which points at A's
  1958	  off-ball run-timing + first touch = the MISSING positioning/off-ball-IQ
  1959	  attr. So the seven's real enabler may be the positioning ATTRIBUTE
  1960	  (let A's run + touch quality evolve), not a scoring boost on the pass.
  1961	- ⭐⭐ **2026-07-19 119j — the POSITIONING ATTRIBUTE SHIPPED (foundation +
  1962	  reception wiring).** Added `positioning` as the 9th player attr
  1963	  (appended LAST in ATTR_KEYS → founders' other attrs byte-identical),
  1964	  SQUAD_BUDGET 36→40.5 (9×9×0.5, density-preserving = a real trade-off,
  1965	  not free), save v32 with a TOP-OF-CHAIN backfill (⚠ durable gotcha:
  1966	  the v17→v18 migration runs enforceBudget → a squad missing the 9th
  1967	  attr NaN-poisons the rescale, so any new attr must be backfilled BEFORE
  1968	  the whole migration chain). First of four wiring points: reception
  1969	  under pressure (`touchFailChance` positioning term taming pressure+
  1970	  blind penalties, neutral at 0.5). VERDICT — validated but WEAK on this
  1971	  channel: maxed BITES (spills −19%) but goal-NEUTRAL; fresh-evo selects
  1972	  only mildly (0.39→0.43-0.46) because possession-retention is weakly
  1973	  rewarded here. Reception is the WEAKEST wiring point — the payoff is
  1974	  the IMPACTFUL ones (run-timing + defensive reads, = 119k), then
  1975	  re-attempt the give-and-go with positioning making A's reception clean.
  1976	  Gates: goals-warming 11.67≈11.54 (zero inflation), vitest 441 (+2
  1977	  re-anchors), visual 136+51, fingerprint `d309f250`, save v32. ⭐ LESSON:
  1978	  an attribute's first wiring should target a WELL-REWARDED outcome
  1979	  (chance creation/prevention), not a weakly-rewarded one (possession
  1980	  retention). `positioning-bite.ts` kept (the maxed-genome yardstick).
  1981	- ⭐ **2026-07-19 THE ATTRIBUTE/GENE AUDIT vs FIFA/FM/PES (strategic
  1982	  backlog — full entry in ROADMAP).** 8 player attrs + 23 genes vs the
  1983	  standard taxonomies. PRESET-DEAD (coupled): heading/jumping (→
  1984	  strength via aerialSense), tackling-vs-marking (both `defending`),
  1985	  accel-vs-topspeed+agility (→`pace`), composure/vision/first-touch
  1986	  (→finishing/passing/dribbling), and ⭐ the marking SCHEME (→
  1987	  markingAggression threshold — the 119h target). MISSING-but-needed:
  1988	  ⭐ POSITIONING / off-ball intelligence / anticipation (the deepest
  1989	  gap — all positioning is team-gene + formation-table, no player-level
  1990	  spatial-IQ attr; sits under the off-ball wall + give-and-go), and the
  1991	  GK attribute split (handling/kicking/positioning distinct from
  1992	  reflexes — rides the keeper line). ⚠ SQUAD_BUDGET re-prices with
  1993	  every new attr (why 5→8 was parked) — add deliberately, each earns
  1994	  its place. Priority: scheme-gene (119h) → positioning attr → GK
  1995	  split → heading/accel/tackling splits.
  1996	
  1997	- ⭐⭐⭐ **2026-07-19 THE CLUMP IS NOT AN EQUILIBRIUM — IT'S carry-OP +
  1998	  width-IMPOTENT (`clump-vs-wide.ts`, the user's challenge answered).**
  1999	  The user rejected "central clumping is the optimal equilibrium" as a
  2000	  cop-out: real 6v6 champions do NOT clump centrally (a clump is punished
  2001	  by width/combination). Head-to-head test — a CLUMP team (narrow +
  2002	  compact + central dribble) vs a WIDE team (wide + pass + flanks),
  2003	  neutral 0.5 squads: **CLUMP wins 3.30 : 0.45**, a blowout. Channel mix:
  2004	  CLUMP scores carry 72 / buildup 24 / setpiece 23 / walkin 12 / **cross 1**;
  2005	  WIDE scores ~0.45/match total, **cross 0**, 4.1 shots vs CLUMP's 9.3.
  2006	  ⭐ TWO substrate DEFECTS (not an equilibrium): (1) the central CARRY is
  2007	  overpowered — it carves ANY defense: a compact one via the scramble→
  2008	  breakaway, a SPREAD one straight through the thinned middle (so
  2009	  spreading = getting carved centrally → nobody dares spread); (2) WIDTH
  2010	  is impotent — wide play creates ~zero goals (cross channel dead). Real
  2200	  it is NOT a complete cure yet: the RPS still isn't closed (narrow/dribble
  2201	  still wins ~2.1 vs width ~1.0, now via SET-PIECES + buildup), and set-pieces
  2202	  became over-strong (the 7m GOAL on a 38m pitch is relatively huge — the probe
  2203	  did NOT scale the goal / ball speeds / the many tuned offsets). Those
  2204	  residuals point to the FULL scope: a coordinated rebalance of pitch + box +
  2205	  GOAL + player speed + ball speeds + every tuned offset + set-piece geometry +
  2206	  full goals-warming re-derive + fingerprint rebaseline — a big, staged,
  2207	  multi-constant, likely multi-session effort on the LIVE game, possibly still
  2208	  needing width-conversion polish to fully close the RPS. The user's call:
  2209	  commit to that staged rebalance, or accept the current substrate. Probes used:
  2210	  temp edits to `constants.ts` (PITCH/BOX) + `formations.ts` (base scale) +
  2211	  `Player.ts` (BASE_SPEED) — ALL REVERTED; the 6 committed probes are the
  2212	  yardsticks for it.
  2213	
  2214	- ⭐⭐⭐⭐ **2026-07-19 (cont.7) PROJECT B — THE EMERGENT POSITIONING FIELD
  2215	  (user chose "B 优先,先开工"; the 2nd foundational defect from VISION §1).**
  2216	  The formation is a hand-authored MENU + affine transforms → shape can't
  2217	  self-adapt, positions fixed (no drop), follows the ball not the opponent,
  2218	  ~no strong/weak side, "styles" are OUR tables. Staged, toggle-gated, A/B vs
  2219	  the tables, VISION-gated (§2 watchability + §1 emergence + §3 realism):
  2220	  - **B0 DONE — `positioning-shape.ts` baseline** (committed): current shape
  2221	    quantified — ball-side shift weak ~2m & gene-flat (the compactness×0.25
  2222	    drag, not a real strong side); BUS crowds own box 0.72 vs neutral 0.39
  2223	    ("防守帮助 0"); resting spacing sane ~11m (clumping is dynamic). A/B
  2224	    yardstick + targets.
  2225	  - **B1-a DONE — `emergentStation()` behind `process.env.EMERGENT_POS`, ships
  2226	    OFF** (committed, WIP): role-anchored field (role = coarse depth+lane
  2227	    dimension) + sane modifiers + a REAL gene-weighted ball-side TRANSLATION.
  2228	    A/B: strong-side shift 2.0→3.0-3.6m + gene-differentiated (WIDE>NEUTRAL),
  2229	    spread/spacing preserved, goals sane (clump 3.15:0.70), default-off tests
  2230	    green. Structural swap done: shape = role-field + gene weights, not the
  2231	    menu. ⚠ field-ON alone does NOT fix width/carry (that's defect A density +
  2232	    B1-b/B2) — B1-a's job was the swap + real strong side, achieved.
  2233	  - **B1-b DONE** (committed): anti-clump station repulsion + box-value relief
  2234	    — BUS own-box crowd 0.72→0.48, spacing sane, still toggle-OFF.
  2235	  - **B2-lite DONE** (committed): threaded optional `opp` into formationSpot;
  2236	    the defensive spine (DF/MF) tracks a line goal-side of the opponents'
  2237	    advanced players (阵型随对面移动). Shape sane, goals sane.
  2238	  - ⭐⭐ **B3 GATE VERDICT (2026-07-19): the field FAILS goals-warming — do NOT
  2239	    ship as-is.** Real-gate A/B (`EMERGENT_POS=1` vs OFF, same worlds):
  2240	    calibrate goals 1.76→2.23 (+27%, viable); but **goals-warming inflates
  2241	    badly — world991 late-mean 4.07→5.54, world777 4.13→5.18, generational
  2242	    drift ~2× (Δ 1.3-1.45 → 2.2-3.1), conv 25→55%, overperf 1.5→2.1×.**
  2243	    Evolution exploits the field into a goal-fest. DIAGNOSIS: overperf 2.1×
  2244	    (goals ≫ xG) = chances too CLEAN → the B1-b anti-clump + box-relief spread
  2245	    the defence too thin, thinning the LAST LINE near own goal, so attackers
  2246	    get unopposed looks and evolution drives finishing/pace to cash them. The
  2247	    "don't clump" win over-corrected into "no defensive solidity."
  2248	  - **NEXT (B-continued, if pursued): restore defensive solidity** — dampen the
  2249	    anti-clump + box-relief in the defensive third / near own goal so the last
  2250	    line stays compact and protects the goal (keep the spread in midfield /
  2251	    attack). Re-run goals-warming; target the baseline arc (late-mean ~4).
  2252	    THEN B3 retire-tables + fingerprint rebaseline. The field stays toggle-OFF
  2253	    (WIP, zero production impact) until it passes goals-warming. Yardsticks:
  2254	    `goals-warming.ts` + `positioning-shape.ts` + calibrate, `EMERGENT_POS=1`.
  2255	  - ⭐⭐ **B-continued DONE — SOLIDITY FIX PASSES goals-warming (committed).**
  2256	    Threat-scaled: spread when no threat (no bus-crowd), the back/mid block
  2257	    compacts goal-ward+central under threat (deny the clean chance). A/B
  2258	    (field ON, fixed) vs baseline, same worlds: goals-warming late-means
  2259	    424242 3.97 / 991 3.50 / 777 4.36 ≈ baseline 3.47 / 4.07 / 4.13 (inflation
  2260	    TAMED — was 5.5/5.2 pre-fix), calibrate 1.92 ≈ 1.76. **The emergent field
  2261	    now PASSES the scoring gates and is ship-viable**: field-not-menu + real
  2262	    strong/weak side + anti-clump + position-by-value + opponent-tracking +
  2263	    threat-solidity, goals healthy, still toggle-OFF.
  2264	  - ⭐⭐⭐ **B3 = THE SHIP DECISION (user's — changes the LIVE game).** Remaining
  2265	    to ship: flip `EMERGENT_POS` default ON + retire the formation TABLES
  2266	    ("style" = gene weights) + remaining gates (vitest — expect fragile test
  2267	    re-anchors; visual×2) + fingerprint REBASELINE + ⭐ the WATCHABILITY check
  2268	    (VISION §2 — only the user can judge play-feel: is the shape visibly fluid
  2269	    / strong-weak side / un-clumped?). Recommended first: wire a BROWSER toggle
  2270	    (`process.env.EMERGENT_POS` is Node-only; the game is Vite/browser) so the
  2271	    user PLAY-TESTS the field before the irreversible retire+rebaseline.
  2272	  - ⭐⭐ **CORRECTION (2026-07-20, `dribble-vs-scramble.ts` — the user's reframe
  2273	    was RIGHT, my census verdict was WRONG).** The census counted a
  2274	    "breakaway family (walkin+carry+through)" and I read its rise as "more
  2275	    乱抢." But 乱抢 (scramble = pinball → breakaway) and 盘带 (clean dribble, a
  2276	    skill) are DIFFERENT. Measuring goals by whether ≥2 possession FLIPS
  2277	    preceded them in 4s: **SCRAMBLE-born goals are TINY and barely move — OFF
  2278	    2-3% → ON 5%**; 95-98% of goals are CLEAN in both. The field's carry rise
  2279	    (35→51%, 42→59%) is **almost ENTIRELY clean dribble** (clean-carry 51/58%,
  2280	    scramble-carry ~1%). So the field does NOT worsen 乱抢 — it adds clean
  2281	    dribbling, which per the user is FINE (a skill). The real remaining concern
  2282	    is VARIETY (solo-dribble share is high; VISION §3 wants cross/cutback/
  2283	    combination too) — that's the attack-repertoire / defect-A work, NOT 乱抢.
  2284	    ⚠ Caveat: this is goal-SOURCE; the VISUAL clumping/pinball frequency (what
  2285	    the user sees + dislikes) is judged by the Pages play-test, not this probe.
  2286	  - Keeper-dive render bugs fixed + DEPLOYED (feet-drift-after-landing → freeze
  2287	    dive-root; then teleport-on-claim → ease the root back). Emergent toggle
  2288	    now STICKY (localStorage), opt-in, live on Pages. `dribble-vs-scramble.ts`
  2289	    kept.
  2165	wall, the throttled give-and-go, AND zonal-dominance are ONE root: the
  2166	attack can't pull a defence apart (a zone especially). ⭐ REDIRECT:
  2167	freeing the scheme is BLOCKED until the attacking counter exists;
  2168	119h ⇒ folds into the ATTACKING-substrate lever (119d give-and-go /
  2169	zone-breaking movement). Don't decouple first — build the zone-breaker
  2170	first, THEN free the scheme and the four quadrants balance. Probes
  2171	kept: `scheme-balance.ts`, `quadrant-balance.ts`.
  2172	
  2173	**STRATEGIC BACKLOG — the ATTRIBUTE/GENE AUDIT vs FIFA/FM/PES (user,
  2174	2026-07-19).** We carry 8 player attrs (pace/passing/dribbling/
  2175	finishing/defending/strength/stamina/reflexes) + 23 team genes + 9
  2176	derived traits. Cross-referenced against the standard football-sim
  2177	taxonomies, split into HAVE-BUT-PRESET-DEAD (coupled, can't evolve
  2178	independently) and MISSING-BUT-NEEDED. ⚠ SQUAD_BUDGET makes attrs
  2179	trade off — every new attr re-prices the whole economy (the reason
  2180	5→8 growth was PARKED at phase-47); each must EARN its place, add
  2181	deliberately, not wholesale.
  2182	- ⭐ **Positioning / off-ball intelligence / anticipation** — MISSING,
  2183	  the deepest gap: all positioning is team-gene + formation-table +
  2184	  brain logic; NO player-level "reads space / times runs" attr. Sits
  2185	  directly under the off-ball-separation wall (119d-1) + the
  2186	  give-and-go. The highest-value single addition.
  2187	- **GK attribute split** (handling / kicking / positioning distinct
  2188	  from reflexes) — MISSING/collapsed; keeper distribution accuracy
  2189	  uses outfield `passing`, catch-vs-spill isn't its own attr. Connects
  2190	  straight to 119f + 119f-spill (the keeper-release + spill lines).
  2191	- **Heading / jumping** — PRESET-DEAD (derived from strength×0.3 +
  2192	  defending×0.15 + role via `aerialSense`); a small timing-header or
  2193	  a strong non-jumper can't exist. Feeds the aerial channel + set
  2194	  pieces.
  2195	- **Acceleration vs top speed + agility** — collapsed into `pace`
  2196	  (→topSpeed only); tight-space turning / the momentum gate.
  2197	- **Tackling vs marking** — both are `defending`; a great marker ≠ a
  2198	  great tackler (feeds scheme diversity).
  2199	- Folded acceptably (low priority): composure→finishing, vision→
  2200	  passing+playmaker-trait, first-touch→dribbling, set-piece specialism.
  2201	Priority order: scheme-gene (119h, in flight) → positioning attr (its
  2202	own big project, budget impact) → GK split (rides the keeper line) →
  2203	heading / accel / tackling splits.
  2204	
  2205	**119i — THE ATTACKING ZONE-BREAKER: make the seven dilemma-creators
  2206	EMERGE** ⏳ **ACTIVE (user, 2026-07-19 — "我希望这七个能在我们的世界
  2207	都涌现出来").** The real form of 119d and the UNBLOCKER for 119h. Real
  2208	football breaks a defence by manufacturing a DILEMMA (space+time the
  2209	defence can't deny in two places at once); against a ZONE specifically
  2210	(which defends space, not men) the seven tools are: (1) OVERLOAD /
  2211	local 2v1, (2) TIMED third-man run into a seam, (3) GIVE-AND-GO /
  2212	combination that beats the shift, (4) SWITCH of play (punish the
  2213	ball-side compaction), (5) DRAG / decoy run, (6) DRIBBLE-to-commit,
  2214	(7) WIDTH→penetrate. ⭐ EMERGENCE FRAME (not hand-coded): the unified
  2215	substrate defect is that **off-ball dilemma-creation does not PAY** —
  2216	the engine rewards beating your man WITH the ball (momentum gate →
  2217	carry → 1v1) but NOT without it (119d-1), so the only space-manufacturer
  2218	that pays is the dribble, and a held zone (cover right there in 6v6)
  2219	kills it → aggressive-zonal is unbeatable (quadrant probe). The job:
  2220	make each dilemma-creator PAY so evolution SELECTS it — enrich the
  2221	gene-driven, unbiased primitives + retire hand-set suppression + run
  2222	evolution and OBSERVE which of the seven emerge. NOT script "do a
  2223	give-and-go here". ⚠ The 119d-1 iron-law trap: the target is movement
  2224	that creates a DILEMMA (commits/overloads a defender), NOT generic
  2225	separation/space (that helped the carry). Success metric: the attack's
  2226	goals vs the FIXED aggressive-zonal wall rise (quadrant-balance as the
  2227	yardstick), goals floor held, carry share eased toward co-dominance
  2228	(not eliminated). PLAN: probe-first inventory (which of the seven fire
  2229	/ pay today, measured against the zonal wall) → enrich the highest-
  2230	leverage primitive → A/B + fresh-evolution + goals-floor + the zonal-
  2231	break metric. Realism note: small-sided football breaks compact
  2232	defences via ROTATION + give-and-go + 2v1, not dribbling alone — these
  2233	are futsal-honest, NOT an 11v11 import. Deep enabler behind all seven =
  2234	the MISSING positioning / off-ball-IQ attr (its own project).
  2235	⭐ FIRST LEVER PROBED (2026-07-19, `wallrun-anatomy.ts` + `give-and-go`):
  2236	the give-and-go is the sharpest zone-breaker (it beats a PRESS, incl.
  2237	aggressive-zonal) and its substrate EXISTS (`wallRun`) but is toothless
  2238	— oneTwos 0.07/match. Anatomy: licenses fire ~3/match, the burster DOES
  2239	get open (peak separation ≥4m in 55-68%, x̄ 5.5m — the "GO" works), the
  2240	carrier chooses to return only 3-4% — because **the WALL (B, who
  2241	received A's pass) LOSES the ball before the return: 80-81% dispossessed
  2242	before peak**. Root: B receives under pressure (the license needs
  2243	pressure>0.2) and tries to CONTROL/settle → pressed → lost, instead of
  2244	playing the real give-and-go: a FIRST-TIME return into A's burst. B has
  2245	no "I'm the wall, lay it back one-touch" behaviour. THE FIRST 119i
  2246	ENRICHMENT ⚠️ **ATTEMPTED + REVERTED 2026-07-19 (double FAIL, fingerprint
  2247	back at `ab2e43bd`).** Made the wall B lay a FIRST-TIME return (a
  2248	boosted through-ball led into A's burst, penetration filter bypassed,
  2249	gene-priced). MECHANICALLY it fired: frozen-gene oneTwos 0.07→0.52/0.39,
  2250	return-played 4%→33%, and it broke the aggressive press a little
  2251	(quadrant zonal-aggr GA 0.67→0.93). BUT the two gates that matter both
  2252	failed: (1) EVOLUTION DE-SELECTS IT — fresh-evolved, the wall-pass gene
  2253	gate fell 7→2/16 (424242) and oneTwos collapsed to 0.01-0.06; given the
  2254	choice, evolution drops the wall-pass appetite because the return is
  2255	net-negative-EV (A receives cleanly only 6%, assists ~3% — B firing a
  2256	through-ball into A's burst mostly gives it away or doesn't create a
  2257	clean chance). (2) IT INFLATES GOALS — goals-warming 15.25 (5.19/5.96/
  2258	4.10) vs the 11.54 baseline (+3.7, the refuted-v2-tackle-poke magnitude):
  2259	the license fires ~3/match regardless, so the added through-balls feed
  2260	converting chances once finishing maxes. ⭐ THE LESSON: making the
  2261	return FIRE is not enough — the completed one-two must be POSITIVE-EV
  2262	(reliably a better chance than the alternative) for evolution to select
  2263	it; the frozen oneTwos 0.5 was an artifact of old genes that happened to
  2264	carry wall-pass appetite. The missing piece is the RETURN QUALITY: A
  2265	gets open (peak sep 5.5m, measured) but can't convert the received ball
  2266	— which points back at A's off-ball run timing + first touch on the
  2267	return = the MISSING positioning/off-ball-IQ attr. A/B metric for the
  2268	next try = combination goals up AND evolution KEEPS the appetite (gate
  2269	holds) AND goals floor held. Probes kept: `wallrun-anatomy.ts`,
  2270	`quadrant-balance.ts`, `scheme-balance.ts`.
  2271	
  2272	**119j — the POSITIONING ATTRIBUTE, foundation + reception wiring** ✅
  2273	**SHIPPED 2026-07-19 (user "开始"; the 9th attribute, the enabler the
  2274	seven need).** The give-and-go failed because the RETURN QUALITY (A
  2275	can't convert the received ball) is un-evolvable — all off-ball quality
  2276	was team-gene + formation-table + uniform brain logic, no PER-PLAYER
  2277	"reads space / times runs / receives under pressure". So: added
  2278	`positioning` as the 9th player attribute (appended LAST in ATTR_KEYS so
  2279	founders' other attrs draw byte-identical), SQUAD_BUDGET raised 36→40.5
  2280	(= 9×9×0.5, preserving the tuned 0.5 density so it's a real trade-off,
  2281	not free), save v31→v32 with a TOP-OF-CHAIN backfill (the v17→v18 budget
  2282	pass calls enforceBudget → a squad missing the 9th attr NaN-poisons the
  2283	rescale, so the backfill must precede the whole chain; v13→v14 rebuilder
  2284	carries it too). FIRST WIRING POINT (of four planned): reception under
  2285	pressure — `touchFailChance` gains a positioning term that tames the
  2286	PRESSURE + BLIND-SIDE penalties (neutral at 0.5, so backfilled saves +
  2287	the tuned physics are bit-unchanged there). ⭐ VERDICT — validated but
  2288	WEAK on this channel alone: maxed-genome BITES (pos-0.9 spills 3.83 vs
  2289	pos-0.1 4.70, −19%) but is goal-NEUTRAL (pos-0.9 GF 1.67 ≈ pos-0.1
  2290	1.66); fresh-evolution SELECTS it only mildly (0.39→0.43-0.46 by gen 23
  2291	vs defending's 0.55-0.59) — because possession-retention is weakly
  2292	rewarded in this engine (goals are scramble/carry/transition-born). So
  2293	reception is the WEAKEST of the four wiring points; the payoff comes
  2294	from the IMPACTFUL ones — run-timing (creates chances) + defensive reads
  2295	(prevents them) — queued next. Gates: goals-warming 11.67 (3.47/4.07/
  2296	4.13) ≈ 11.54 baseline (ZERO inflation — the density-preserving budget
  2297	raise worked), calibrate 1.76/2.05/2.25 (early band), vitest 441 (+2
  2298	re-anchors: shapeHistory attr-count → ATTR_KEYS.length, league v13
  2299	migration robust to the new attr), visual 136+54 (radar auto-gains the
  2300	9th axis), fingerprint REBASELINED `d309f250…`, save v32.
  2301	⭐ NEXT (119k): the IMPACTFUL wiring — (1) run TIMING off the offside
  2302	hold (positioning times the break: onside + arrives with the ball),
  2303	(2) DEFENSIVE reads (interception/cover positioning — the shape-holding
  2304	cover that also kills the 乱抢 free-1v1), then re-attempt the give-and-go
  2305	with positioning making A's return-reception clean. A/B each: does a
  2306	positioning archetype EMERGE and win, do the seven start appearing, is
  2307	the aggressive-zonal wall finally breakable (quadrant metric).
  2308	
  2309	**119k — POSITIONING wiring points 2-3 (run-timing + defensive reads)**
  2310	⚠️ **PROBED → BOTH MARGINAL, NOT SHIPPED (fast maxed-test caught them
  2311	before any evolution burn; fingerprint stays `d309f250`).** Two more
  2312	wiring points tried, each killed by the `positioning-bite.ts` maxed
  2313	test: ① SEAM RUN (runTarget pulls a high-positioning runner's Y toward
  2314	the largest gap in the defensive line) — REFUTED, pos-0.9 scored LEAST
  2315	(GF 1.35 vs pos-0.1 1.50) and conceded MOST (1.56): "run to the biggest
  2316	gap" is a hand-coded SINGLE pattern that disrupts shape, not a chance-
  2317	creator (the ball must arrive there AND the space ahead is still
  2318	defended). ② INTERCEPTION READ (canInterceptPass timing margin scaled
  2319	by positioning) — WEAK, pos-0.9 GA 1.43 vs pos-0.1 1.48 (−0.05, noise).
  2320	⭐ THE PATTERN (three wiring points now: 119j reception weak, seam-run
  2321	negative, interception weak): individual positioning quality-scalers
  2322	all move only the MARGINS, because the engine's scoring is dominated by
  2323	the carry / scramble / transition economy — improving reception /
  2324	interception / run-target quality doesn't touch it. ⭐⭐ THE USER'S
  2325	REFRAME (2026-07-19, mid-119k — "跑位其实也很多变…鱼钩跑,肋部跑,拉边,
  2326	套边"): the seam-run failed for a DEEPER reason — I hand-coded ONE run.
  2327	Real off-ball movement is a VARIED REPERTOIRE (fish-hook / check-and-go,
  2328	half-space 肋部, pull-wide 拉边, overlap 套边…), and WHICH run fits the
  2329	moment must EMERGE from the substrate + genes + positioning, not be
  2330	hand-set. So the attacking side becomes 119l (a real emergence project),
  2331	NOT more single-pattern wiring.
  2332	
  2333	**119l — the RUN REPERTOIRE (emergence, per the user's reframe)** ⏳
  2334	**QUEUED.** Enrich the off-ball run substrate into gene-driven, unbiased
  2335	PRIMITIVES so a variety of runs (fish-hook / check-away-then-burst,
  2336	half-space, pull-wide, overlap, near/far-post, drop-and-spin…) can
  2337	EMERGE and be SELECTED per situation — positioning = the player's
  2338	ability to read which the moment calls for and execute it. Some already
  2339	exist hand-licensed at the team level (overlap 套边, the arriver, the
  2340	weak-side far-post pull) — the project is to make the repertoire
  2341	per-player + evolvable, not TeamBrain-thresholded. This is the honest
  2342	form of "make the seven emerge" for the attacking side; big, probe-
  2343	first, maxed-test each primitive (does it create chances vs a set line
  2344	without just feeding the carry). ⚠ The 119k lesson: do NOT hand-code a
  2345	single run pattern; build the repertoire + let selection choose.
  2510	own), dribbleBias climbs harder, press softens; goals 2.41/1.78→2.71/2.17
  2511	(mean 2.44, on target), won tackles 16.8→11. (3) ✅ **phase-42 SHIPPED —
  2512	released `DEFAULT_POLICY` (attacking-style subset) to per-franchise evolution**;
  2513	`policy-emergence.ts` gate PASSED — cross-franchise style spread 0% → ~20-24%
  2514	and PERSISTS (distinct styles coexist), goals mean 2.52 (on target). (4) ⭐
  2515	**broaden it** (user: build-up / 防守 / 套路 / players should all emerge): ✅
  2516	defence (43) + build-up (44) SHIPPED — chase/mark/intercept/clear + pass/outlet/
  2517	support genetified, ATT+DEF+BUILD spread ~20%, goals 2.40 / 2.34. NEXT (easier
  2518	lot): 套路 combos + style-COHERENCE measurement. ⚠️ **DEFERRED to a later FABLE
  2519	model (user 2026-07-14, hardest): player-attribute expansion + the evolution VIZ
  2520	module** — both scoped in **`EMERGENCE-PIVOT.md`**. HEAD fingerprint
  2521	`79f6dd04…` (phase-44).
  2522	
  2523	Everything below is the pre-pivot play-report history (still valid as
  2524	mechanics reference; the ITERATION MODEL is superseded by the above).
  2525	## Standing rules & conventions (LIVE — read before any phase)
  2526	
  2527	**Tag convention (user-ratified 2026-07-13):** point tags attach to the
  2528	MECHANIC FAMILY they iterate (36.1 = touches, like 34.2/34.3 before
  2529	it), NOT to chronology — so the badge (latest tag on HEAD) can show a
  2530	LOWER number than the newest chapter; phase-36.1 following phase-40 is
  2531	correct, not a regression (phase-28.5 continues the pattern — a keeper-
  2532	family tag on the newest HEAD). Never force-retag pushed tags (worktree
  2533	A/B baselines and CI history ride on them). The CURRENT fingerprint lives in the head above.
  2534	
  2535	Standing rules (full detail in [`ARCHITECTURE.md`](ARCHITECTURE.md) §10–13):
  2536	**every phase ends with PROBE evidence** (user rule 2026-07-13, invariant
  2537	11: a `scripts/probes/` tsx measuring the mechanic's own rate/shape —
  2538	same-seed A/B vs the previous tag for "X improved" claims, two calibrate
  2539	seeds before believing deltas, headless choreography probes for
  2540	render-side logic, strip-and-rehash for schema growth);
  2541	every step ends with typecheck + full vitest + both Playwright suites green;
  2542	push via `gh auth switch --user Quarkgluonmixture`, then switch back; verify
  2543	the Pages bundle after CI; itch.io needs a manual `npm run package:itch`;
  2544	re-baseline the determinism fingerprint after mechanics changes;
  2545	**calibrate noise on goals is ±0.3–0.4 at the default n=142 — ALWAYS
  2546	measure balance levers with `npm run calibrate -- 8` (n=568), and read
  2547	failure modes 16–21 before touching any lever** (18 is Phase 30's whole
  2548	detective story: goals live in gene-mix variance, LESS marking = STRONGER
  2549	defence, structure deleted the goals-above-xG channel; 19–21 are Phase
  2550	30.5/31's: bounded support fans, the completion homeostat, and
  2551	inheritance compounding — plus fm 12's Node-vs-Node corollary for any
  2552	long-run league test); statistical
  2553	match-loop tests need `{ timeout }` + `setImmediate` yields every ~25
  2554	matches or CI's 2-core runner starves vitest's heartbeat; Playwright
  2555	selectors are English (suites pin `lang=en`); the user plays 3D on a
  2556	PHONE (≤390–640px) — check every UI change there; sim-generated text
  2557	stays English (sim/ never touches the browser), UI chrome is localized
  2558	via `src/ui/i18n.ts` (zh default).
  2559	
  2560	---
  2561	
  2562	The full pre-pivot phase history (phases 30–34.3 chapter by chapter, the
  2563	old play-report queue, every probe number) moved to
  2564	[`ROADMAP-ARCHIVE.md`](ROADMAP-ARCHIVE.md) — still valid as mechanics
  2565	reference; the iteration model it describes is superseded by the
  2566	blueprint above.

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "git status --short; rg --files scripts/probes tests | rg '(attribute|position|vision|archetype|aerial|stamina|strength|pace|passing|finishing|defending|reflex|bite)' | sort; rg -n 'positioning-bite|player-archetype|attr' package.json scripts/probes --glob '*.ts' | head -200"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
 M docs/ROADMAP.md
 M docs/VISION.md
 M src/evolution/playerGenome.ts
 M src/sim/League.ts
?? docs/cross-ai-audits/
scripts/probes/aerial-anatomy.ts
scripts/probes/attr-archetype.ts
scripts/probes/positioning-bite.ts
scripts/probes/positioning-shape.ts
tests/aerial.test.ts
tests/stamina.test.ts
tests/styleSpace.test.ts
scripts/probes/shape-emergence.ts:25:  // Per-shape attribution (Phase 107): gens present + peak, so an
scripts/probes/onevone-anatomy.ts:94:              2.05 + (defG.keeperAggression ?? 0.5) * 0.4 + (gk.attrs.reflexes - 0.5) * 0.5 +
scripts/probes/onevone-anatomy.ts:100:            reflexes: gk.attrs.reflexes,
scripts/probes/quadrant-balance.ts:81:console.log(`quadrant round-robin — ${K} matches/ordered-pairing, all genes+attrs 0.5 except scheme+markingAggression:`);
scripts/probes/evo-drift.ts:2:// and tracks population-wide per-role attribute means + key gene means. The
scripts/probes/positioning-bite.ts:2: * Probe (119j, 2026-07-19): does the new POSITIONING attribute BITE? The
scripts/probes/positioning-bite.ts:10: *   npx tsx scripts/probes/positioning-bite.ts [matchesPerPairing]
scripts/probes/positioning-bite.ts:63:console.log(`positioning maxed-genome test — ${K} matches/ordered-pairing (all attrs 0.5 except positioning):`);
scripts/probes/suspension-anatomy.ts:25:  let coverDelta = 0; // attr-total delta starter-minus-cover when a ban is covered
scripts/probes/suspension-anatomy.ts:63:    `mean attr-total cost ${(covers ? coverDelta / covers : 0).toFixed(2)} ` +
scripts/probes/attr-archetype.ts:1:// Do player ARCHETYPES emerge from the split attributes (Phase 47)? The old
scripts/probes/attr-archetype.ts:7://   npx tsx scripts/probes/attr-archetype.ts [gens] [seed]
scripts/probes/scramble-anatomy.ts:107:    // closed episodes awaiting payoff attribution
scripts/probes/scramble-anatomy.ts:136:      // goals (attribute to a recent scramble exit within 8s)
scripts/probes/scramble-anatomy.ts:141:        void scorer; void who; // side attribution via closed list below (any side match)
scripts/probes/anchor-sweep.ts:35:const attr = (k: string): number => {
scripts/probes/anchor-sweep.ts:47:  `def ${attr('defending').toFixed(2)} jockey ${gene('jockeyBias').toFixed(2)} cover ${gene('coverBias').toFixed(2)} press ${gene('pressIntensity').toFixed(2)}`,
scripts/probes/clump-vs-wide.ts:69:console.log(`CLUMP (narrow+compact+dribble) vs WIDE (wide+pass+flanks) — ${K} matches, all attrs 0.5:`);
scripts/probes/specialization.ts:2:// evolution maxes every attribute and archetypes stay faint. Tracks:
scripts/probes/specialization.ts:4://   spec     within-player attr std, league mean (specialists ↑: points piled
scripts/probes/specialization.ts:5://            into few attrs instead of spread evenly)
scripts/probes/goals-warming.ts:37:      // Diagnosis: where does the inflation live — attributes or genes?
scripts/probes/goals-warming.ts:38:      const attr = (k: string): number => {
scripts/probes/goals-warming.ts:50:        `  [gen ${g}] fin ${attr('finishing').toFixed(2)} pace ${attr('pace').toFixed(2)} ` +
scripts/probes/goals-warming.ts:51:        `def ${attr('defending').toFixed(2)} refl ${attr('reflexes').toFixed(2)} str ${attr('strength').toFixed(2)} pos ${attr('positioning').toFixed(2)} | ` +
scripts/probes/transition-ab.ts:15:const attrs = (): PlayerAttributes => {
scripts/probes/transition-ab.ts:28:    genome: g, squad: Array.from({ length: TEAM_SIZE }, attrs),
scripts/probes/jockey-ab.ts:13:const attrs = (over: Partial<Record<string, number>> = {}) => ({
scripts/probes/jockey-ab.ts:22:const team = (name: string, g: TacticalGenome, squad: ReturnType<typeof attrs>): TeamInfo => ({
scripts/probes/jockey-ab.ts:30:function duel(label: string, squad: ReturnType<typeof attrs>): void {
scripts/probes/jockey-ab.ts:53:duel('neutral squads      ', attrs());
scripts/probes/jockey-ab.ts:56:duel('dribble-meta squads ', attrs({ pace: 0.65, dribbling: 0.65, defending: 0.4, reflexes: 0.42 }));
scripts/probes/keeper-distribution.ts:13:const attrs = (): PlayerAttributes => {
scripts/probes/keeper-distribution.ts:29:  squad: Array.from({ length: TEAM_SIZE }, attrs),
scripts/probes/trait-census.ts:4:// development (attrs drift, traits appear/disappear — they're derived).
scripts/probes/trait-census.ts:6:// vs 0.81 — attrs differ by a hair, the step is the trait's own +0.04.
scripts/probes/trait-census.ts:75:  console.log(`enforcer discontinuity: p(win) ${below.toFixed(3)} @0.79 → ${above.toFixed(3)} @0.81 (attr slope alone would add ${(0.02 * 0.24).toFixed(4)})`);
scripts/probes/width-funnel.ts:178:console.log(`WIDE[${ARCH}] vs CLUMP width funnel — ${K} matches, all attrs 0.5\n`);
scripts/probes/rush-anatomy.ts:16:const attrs = (over: Partial<PlayerAttributes> = {}): PlayerAttributes => {
scripts/probes/rush-anatomy.ts:33:  squad: Array.from({ length: TEAM_SIZE }, () => attrs(a)),
scripts/probes/trap-ab.ts:13:const attrs = (): PlayerAttributes => {
scripts/probes/trap-ab.ts:26:    genome: g, squad: Array.from({ length: TEAM_SIZE }, attrs),
scripts/probes/morale-ab.ts:13:const attrs = (): PlayerAttributes => {
scripts/probes/morale-ab.ts:26:    genome: g, squad: Array.from({ length: TEAM_SIZE }, attrs),
scripts/probes/hold-jitter.ts:18:const attrs = (v: number): PlayerAttributes => {
scripts/probes/hold-jitter.ts:35:    squad: Array.from({ length: TEAM_SIZE }, () => attrs(0.5)),
scripts/probes/spill-anatomy.ts:105:          techSum += spiller.attrs.dribbling;
scripts/probes/conditional-anatomy.ts:34:const team = (name: string, genome: TacticalGenome, attr: number, elo: number): TeamInfo => ({
scripts/probes/conditional-anatomy.ts:38:  genome, squad: flatSquad(attr), elo,

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba scripts/probes/positioning-bite.ts; nl -ba scripts/probes/attr-archetype.ts; nl -ba scripts/probes/specialization.ts; nl -ba tests/stamina.test.ts; nl -ba tests/aerial.test.ts | sed -n '1,260p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	/**
     2	 * Probe (119j, 2026-07-19): does the new POSITIONING attribute BITE? The
     3	 * maxed-genome test (emergence memo): force three squads identical except
     4	 * positioning (0.9 / 0.5 / 0.1, everything else 0.5) and round-robin them.
     5	 * If positioning matters, the high-positioning side should SPILL far less
     6	 * (miscontrols) and retain possession better under pressure — the first
     7	 * wiring point (touchFailChance reception). Neutral 0.5 must reproduce the
     8	 * pre-119j reception exactly (the density-preserving budget raise).
     9	 *
    10	 *   npx tsx scripts/probes/positioning-bite.ts [matchesPerPairing]
    11	 */
    12	import { Match } from '../../src/sim/Match';
    13	import { DT } from '../../src/sim/constants';
    14	import { GENE_KEYS, type TacticalGenome } from '../../src/evolution/genome';
    15	import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
    16	import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
    17	
    18	const K = Number(process.argv[2] ?? 16);
    19	
    20	const neutralGenome = (): TacticalGenome => {
    21	  const g = {} as TacticalGenome;
    22	  for (const k of GENE_KEYS) (g as unknown as Record<string, number>)[k] = 0.5;
    23	  return g;
    24	};
    25	const squad = (positioning: number): PlayerAttributes[] => {
    26	  const a = {} as PlayerAttributes;
    27	  for (const k of ATTR_KEYS) a[k] = 0.5;
    28	  a.positioning = positioning;
    29	  return Array.from({ length: TEAM_SIZE }, () => ({ ...a }));
    30	};
    31	
    32	const LEVELS: Array<[string, number]> = [
    33	  ['pos-0.9', 0.9],
    34	  ['pos-0.5', 0.5],
    35	  ['pos-0.1', 0.1],
    36	];
    37	
    38	const info = (label: string, positioning: number): TeamInfo => ({
    39	  id: label, name: label, short: label.slice(0, 5).toUpperCase(),
    40	  colors: { primary: 0xff0000, secondary: 0xffffff },
    41	  playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    42	  genome: neutralGenome(),
    43	  squad: squad(positioning),
    44	});
    45	
    46	const tally: Record<string, { spills: number; gf: number; ga: number; matches: number }> = {};
    47	for (const [label] of LEVELS) tally[label] = { spills: 0, gf: 0, ga: 0, matches: 0 };
    48	
    49	let seed = 1;
    50	for (const [la, pa] of LEVELS) {
    51	  for (const [lb, pb] of LEVELS) {
    52	    if (la === lb) continue;
    53	    for (let k = 0; k < K; k++) {
    54	      const m = new Match({ seed: seed++, teamA: info(la, pa), teamB: info(lb, pb), duration: 300 });
    55	      while (!m.finished) m.step(DT);
    56	      const r = m.getResult();
    57	      tally[la].spills += r.stats[0].miscontrols; tally[la].gf += r.score[0]; tally[la].ga += r.score[1]; tally[la].matches++;
    58	      tally[lb].spills += r.stats[1].miscontrols; tally[lb].gf += r.score[1]; tally[lb].ga += r.score[0]; tally[lb].matches++;
    59	    }
    60	  }
    61	}
    62	
    63	console.log(`positioning maxed-genome test — ${K} matches/ordered-pairing (all attrs 0.5 except positioning):`);
    64	console.log(`  ${'squad'.padEnd(8)}  spills/m  GF/m  GA/m`);
    65	for (const [label] of LEVELS) {
    66	  const t = tally[label];
    67	  const n = Math.max(t.matches, 1);
    68	  console.log(`  ${label.padEnd(8)}  ${(t.spills / n).toFixed(2)}      ${(t.gf / n).toFixed(2)}  ${(t.ga / n).toFixed(2)}`);
    69	}
     1	// Do player ARCHETYPES emerge from the split attributes (Phase 47)? The old
     2	// `technique` forced passer≡dribbler; with passing/dribbling separate genes,
     3	// selection can specialise them by role and by club. Tracks per-role means of
     4	// the SPLIT (passing − dribbling) plus strength/stamina drift, and the
     5	// cross-club std of each role's split (clubs disagreeing about what their
     6	// winger IS = emergent player identity).
     7	//   npx tsx scripts/probes/attr-archetype.ts [gens] [seed]
     8	import { League } from '../../src/sim/League';
     9	import { SQUAD_ROLES } from '../../src/evolution/playerGenome';
    10	import type { AttrKey } from '../../src/evolution/playerGenome';
    11	import type { Role } from '../../src/sim/types';
    12	
    13	const GENS = Number(process.argv[2] ?? 50);
    14	const SEED = Number(process.argv[3] ?? 424242);
    15	const league = new League({ seed: SEED });
    16	
    17	const roleAttr = (role: Role, key: AttrKey): number => {
    18	  let sum = 0, n = 0;
    19	  for (const f of league.franchises) {
    20	    for (let i = 0; i < f.squad.length; i++) {
    21	      if (SQUAD_ROLES[i] === role) { sum += f.squad[i][key]; n++; }
    22	    }
    23	  }
    24	  return sum / Math.max(n, 1);
    25	};
    26	/** Cross-club std of a role's (passing − dribbling) split. */
    27	const splitStd = (role: Role): number => {
    28	  const vals: number[] = [];
    29	  for (const f of league.franchises) {
    30	    let s = 0, n = 0;
    31	    for (let i = 0; i < f.squad.length; i++) {
    32	      if (SQUAD_ROLES[i] === role) { s += f.squad[i].passing - f.squad[i].dribbling; n++; }
    33	    }
    34	    if (n > 0) vals.push(s / n);
    35	  }
    36	  const m = vals.reduce((a, b) => a + b, 0) / vals.length;
    37	  return Math.sqrt(vals.reduce((a, b) => a + (b - m) ** 2, 0) / vals.length);
    38	};
    39	const f2 = (v: number): string => (v >= 0 ? '+' : '') + v.toFixed(2);
    40	
    41	console.log(`seed ${SEED}, ${GENS} gens — role split = mean(passing−dribbling); clubStd = cross-club std of WG split`);
    42	console.log('gen | WGsplit MFsplit | WGclubStd | STR STA (league) | WGdrb MFpas');
    43	const row = (g: number): void => {
    44	  console.log(
    45	    `${String(g).padStart(3)} | ${f2(roleAttr('WG', 'passing') - roleAttr('WG', 'dribbling'))}   ${f2(roleAttr('MF', 'passing') - roleAttr('MF', 'dribbling'))}  |   ${splitStd('WG').toFixed(3)}   | ` +
    46	    `${roleAttr('MF', 'strength').toFixed(2)} ${roleAttr('MF', 'stamina').toFixed(2)}       | ${roleAttr('WG', 'dribbling').toFixed(2)} ${roleAttr('MF', 'passing').toFixed(2)}`,
    47	  );
    48	};
    49	
    50	for (let g = 0; g <= GENS; g++) {
    51	  if (g % 5 === 0 || g === GENS) row(g);
    52	  if (g < GENS) {
    53	    while (!league.seasonDone) {
    54	      const fx = league.nextFixture()!;
    55	      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    56	    }
    57	    league.finishSeason();
    58	  }
    59	}
     1	// Does the RESOURCE BUDGET force specialisation (Phase 48)? Without a cap,
     2	// evolution maxes every attribute and archetypes stay faint. Tracks:
     3	//   total    league-mean squad total (must PLATEAU at SQUAD_BUDGET, not inflate)
     4	//   spec     within-player attr std, league mean (specialists ↑: points piled
     5	//            into few attrs instead of spread evenly)
     6	//   starGap  within-squad player-total spread (star-plus-role-players vs a
     7	//            balanced six — an evolvable axis the budget creates)
     8	//   clubStd  cross-club std of WG dribbling (clubs DISAGREEING about what
     9	//            their winger is worth = emergent identity)
    10	//   npx tsx scripts/probes/specialization.ts [gens] [seed]
    11	import { League } from '../../src/sim/League';
    12	import { ATTR_KEYS, SQUAD_BUDGET, squadTotal } from '../../src/evolution/playerGenome';
    13	import { SQUAD_ROLES } from '../../src/evolution/playerGenome';
    14	
    15	const GENS = Number(process.argv[2] ?? 40);
    16	const SEED = Number(process.argv[3] ?? 424242);
    17	const league = new League({ seed: SEED });
    18	
    19	const stats = (): { total: number; spec: number; starGap: number; clubStd: number } => {
    20	  let totalSum = 0;
    21	  let specSum = 0, specN = 0;
    22	  let gapSum = 0;
    23	  const wgDrb: number[] = [];
    24	  for (const f of league.franchises) {
    25	    totalSum += squadTotal(f.squad);
    26	    const pTotals: number[] = [];
    27	    let wg = 0, wgN = 0;
    28	    for (let i = 0; i < f.squad.length; i++) {
    29	      const p = f.squad[i];
    30	      const vals = ATTR_KEYS.map((k) => p[k]);
    31	      const m = vals.reduce((a, b) => a + b, 0) / vals.length;
    32	      specSum += Math.sqrt(vals.reduce((a, b) => a + (b - m) ** 2, 0) / vals.length);
    33	      specN++;
    34	      pTotals.push(vals.reduce((a, b) => a + b, 0));
    35	      if (SQUAD_ROLES[i] === 'WG') { wg += p.dribbling; wgN++; }
    36	    }
    37	    const pm = pTotals.reduce((a, b) => a + b, 0) / pTotals.length;
    38	    gapSum += Math.sqrt(pTotals.reduce((a, b) => a + (b - pm) ** 2, 0) / pTotals.length);
    39	    wgDrb.push(wg / Math.max(wgN, 1));
    40	  }
    41	  const n = league.franchises.length;
    42	  const wm = wgDrb.reduce((a, b) => a + b, 0) / n;
    43	  return {
    44	    total: totalSum / n,
    45	    spec: specSum / specN,
    46	    starGap: gapSum / n,
    47	    clubStd: Math.sqrt(wgDrb.reduce((a, b) => a + (b - wm) ** 2, 0) / n),
    48	  };
    49	};
    50	
    51	console.log(`seed ${SEED}, ${GENS} gens — budget cap ${SQUAD_BUDGET}`);
    52	console.log('gen | total (cap) | spec | starGap | WGdrb clubStd');
    53	for (let g = 0; g <= GENS; g++) {
    54	  if (g % 5 === 0 || g === GENS) {
    55	    const s = stats();
    56	    console.log(
    57	      `${String(g).padStart(3)} | ${s.total.toFixed(1)}       | ${s.spec.toFixed(3)} | ${s.starGap.toFixed(2)}    | ${s.clubStd.toFixed(3)}`,
    58	    );
    59	  }
    60	  if (g < GENS) {
    61	    while (!league.seasonDone) {
    62	      const fx = league.nextFixture()!;
    63	      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    64	    }
    65	    league.finishSeason();
    66	  }
    67	}
     1	import { describe, expect, it } from 'vitest';
     2	import type { TacticalGenome } from '../src/evolution/genome';
     3	import { GENE_KEYS } from '../src/evolution/genome';
     4	import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
     5	import { Match } from '../src/sim/Match';
     6	import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
     7	
     8	/**
     9	 * Phase 58 — the energy economy BINDS. Before this phase full-time stamina
    10	 * sat at 0.98-0.99 (recovery dwarfed drain), so every fatigue payoff —
    11	 * the stamina attribute, staminaConservation's "fresher legs late", the
    12	 * tired-legs brain gate — was dead, and the N1 matrix meta (relentless
    13	 * aggression) ran free of its natural price. These tests pin the mechanism
    14	 * (a lunge costs legs, absorbed by the stamina attribute) and the binding
    15	 * itself (a full match must SPEND the tank, but not empty it).
    16	 */
    17	
    18	const neutral = (): TacticalGenome => {
    19	  const g = {} as TacticalGenome;
    20	  for (const k of GENE_KEYS) g[k] = 0.5;
    21	  return g;
    22	};
    23	
    24	const squadOf = (stamina: number): PlayerAttributes[] =>
    25	  Array.from({ length: TEAM_SIZE }, () => {
    26	    const p = {} as PlayerAttributes;
    27	    for (const k of ATTR_KEYS) p[k] = 0.5;
    28	    p.stamina = stamina;
    29	    return p;
    30	  });
    31	
    32	function team(name: string, squad: PlayerAttributes[]): TeamInfo {
    33	  return {
    34	    id: name,
    35	    name,
    36	    short: name.slice(0, 3).toUpperCase(),
    37	    colors: { primary: 0xff0000, secondary: 0xffffff },
    38	    playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
    39	    genome: neutral(),
    40	    squad,
    41	    style: { formationAtk: 'wide-212', formationDef: 'press-23', scheme: 'man' },
    42	  };
    43	}
    44	
    45	describe('the energy economy binds (Phase 58)', () => {
    46	  it('a tackle lunge spends stamina, scaled down by the stamina attribute', () => {
    47	    const m = new Match({ seed: 7, teamA: team('A', squadOf(0.1)), teamB: team('B', squadOf(0.9)) });
    48	    const weak = m.teams[0].players.find((p) => p.role !== 'GK')!;
    49	    const strong = m.teams[1].players.find((p) => p.role !== 'GK')!;
    50	    const w0 = weak.stamina;
    51	    const s0 = strong.stamina;
    52	    weak.spendBurst(0.02);
    53	    strong.spendBurst(0.02);
    54	    expect(weak.stamina).toBeLessThan(w0);
    55	    expect(strong.stamina).toBeLessThan(s0);
    56	    // The high-stamina motor absorbs the same burst more cheaply.
    57	    expect(w0 - weak.stamina).toBeGreaterThan(s0 - strong.stamina);
    58	    expect(weak.staminaSpent).toBeGreaterThan(strong.staminaSpent);
    59	  });
    60	
    61	  it('a full match SPENDS the tank — the gauge can never go dead again', () => {
    62	    // Pre-phase-58 this sat at 0.98-0.99 and every fatigue payoff was
    63	    // decorative. Bind means: meaningfully below full at the whistle,
    64	    // yet nowhere near empty (sludge is a play-feel bug, not a price).
    65	    const ftMeans: number[] = [];
    66	    for (const seed of [11, 42]) {
    67	      const m = new Match({ seed, teamA: team('A', squadOf(0.5)), teamB: team('B', squadOf(0.5)) });
    68	      m.runToCompletion();
    69	      const outfield = [...m.teams[0].players, ...m.teams[1].players].filter((p) => p.role !== 'GK');
    70	      ftMeans.push(outfield.reduce((s, p) => s + p.stamina, 0) / outfield.length);
    71	    }
    72	    const ft = ftMeans.reduce((a, b) => a + b, 0) / ftMeans.length;
    73	    expect(ft).toBeLessThan(0.93);
    74	    expect(ft).toBeGreaterThan(0.35);
    75	  });
    76	});
     1	import { describe, expect, it } from 'vitest';
     2	import type { TacticalGenome } from '../src/evolution/genome';
     3	import { GENE_KEYS } from '../src/evolution/genome';
     4	import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
     5	import { DT, GOAL_HEIGHT, GRAVITY, HALF_L, HALF_W } from '../src/sim/constants';
     6	import { League } from '../src/sim/League';
     7	import { Match } from '../src/sim/Match';
     8	import { tryAerial } from '../src/sim/mechanics';
     9	import { DEFAULT_POLICY, TEAM_SIZE, type TeamInfo, type TeamMatchStats } from '../src/sim/types';
    10	
    11	/**
    12	 * Phase 28 — the aerial game. Ball height physics, the crossbar, aerial
    13	 * duels, crosses, lofted switches and the corner threat. Directional tests
    14	 * are side-balanced and pooled over seeds (§10.5); structural tests ride on
    15	 * determinism — a fixed-seed league always replays the same football.
    16	 */
    17	
    18	const neutral = (): TacticalGenome => {
    19	  const g = {} as TacticalGenome;
    20	  for (const k of GENE_KEYS) g[k] = 0.5;
    21	  return g;
    22	};
    23	
    24	const squadOf = (defending: number): PlayerAttributes[] =>
    25	  Array.from({ length: TEAM_SIZE }, () => {
    26	    const p = {} as PlayerAttributes;
    27	    for (const k of ATTR_KEYS) p[k] = 0.5;
    28	    p.defending = defending;
    29	    return p;
    30	  });
    31	
    32	function team(name: string, genome: TacticalGenome, opts: Partial<TeamInfo> = {}): TeamInfo {
    33	  return {
    34	    id: name,
    35	    name,
    36	    short: name.slice(0, 3).toUpperCase(),
    37	    colors: { primary: 0xff0000, secondary: 0xffffff },
    38	    playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
    39	    genome,
    40	    squad: squadOf(0.5),
    41	    ...opts,
    42	  };
    43	}
    44	
    45	const sum = (a: TeamMatchStats, b: TeamMatchStats): TeamMatchStats => {
    46	  // Numeric counters sum; goalChannels (Phase 113) merges per channel.
    47	  const out = { ...a, goalChannels: { ...a.goalChannels } };
    48	  const on = out as unknown as Record<string, number>;
    49	  const bn = b as unknown as Record<string, number>;
    50	  for (const k of Object.keys(out)) if (k !== 'goalChannels') on[k] += bn[k];
    51	  for (const c of Object.keys(out.goalChannels) as Array<keyof typeof out.goalChannels>) {
    52	    out.goalChannels[c] += b.goalChannels[c];
    53	  }
    54	  return out;
    55	};
    56	
    57	/** Side-balanced totals: each seed plays both home/away orders (§10.5). */
    58	function totals(A: TeamInfo, B: TeamInfo, seeds: number[]): [TeamMatchStats, TeamMatchStats] {
    59	  let acc: [TeamMatchStats, TeamMatchStats] | null = null;
    60	  for (const seed of seeds) {
    61	    const ab = new Match({ seed, teamA: A, teamB: B, duration: 120 }).runToCompletion();
    62	    acc = acc ? [sum(acc[0], ab.stats[0]), sum(acc[1], ab.stats[1])] : [ab.stats[0], ab.stats[1]];
    63	    const ba = new Match({ seed, teamA: B, teamB: A, duration: 120 }).runToCompletion();
    64	    acc = [sum(acc[0], ba.stats[1]), sum(acc[1], ba.stats[0])];
    65	  }
    66	  return acc!;
    67	}
    68	
    69	/** A match advanced past kickoff into open play, ball forced dead-center. */
    70	function liveMatch(seed = 1): Match {
    71	  const m = new Match({ seed, teamA: team('A', neutral()), teamB: team('B', neutral()), duration: 240 });
    72	  for (let i = 0; i < 70; i++) m.step(DT); // through the kickoff pause
    73	  return m;
    74	}
    75	
    76	describe('ball flight physics', () => {
    77	  it('a lofted ball flies a friction-free parabola', () => {
    78	    const m = liveMatch(3);
    79	    const ball = m.ball;
    80	    // Fly it ABOVE everyone's reach (z > 2.6 the whole observed window) so
    81	    // no header/claim can legally touch it — pure physics is on display.
    82	    ball.owner = null;
    83	    ball.pos = { x: -30, y: -20 };
    84	    ball.vel = { x: 14, y: 2 };
    85	    ball.z = 3;
    86	    ball.vz = 9;
    87	    const h0 = Math.hypot(ball.vel.x, ball.vel.y);
    88	    let apex = 0;
    89	    let steps = 0;
    90	    while (ball.z > 2.6 && steps < 250) {
    91	      // While airborne the horizontal speed must NOT decay (no friction).
    92	      expect(Math.hypot(ball.vel.x, ball.vel.y)).toBeCloseTo(h0, 6);
    93	      apex = Math.max(apex, ball.z);
    94	      m.step(DT);
    95	      steps++;
    96	    }
    97	    // z(t) = 3 + 9t − ½gt²: apex ≈ 7.13m, back below 2.6 at t ≈ 1.88s.
    98	    expect(steps * DT).toBeGreaterThan(1.7);
    99	    expect(steps * DT).toBeLessThan(2.05);
   100	    expect(apex).toBeGreaterThan(6.6);
   101	    expect(apex).toBeLessThan(7.6);
   102	  });
   103	
   104	  it('a fast landing bounces with damped restitution', () => {
   105	    const m = liveMatch(4);
   106	    const ball = m.ball;
   107	    // Drop into empty midfield space, far from every formation spot. On the
   108	    // shrunk pitch −22 is over the touchline (HALF_W≈20.3); hold it just
   109	    // inside the wide channel so it lands in play, not out (2026-07-20).
   110	    ball.owner = null;
   111	    ball.pos = { x: 0, y: -(HALF_W - 2) };
   112	    ball.vel = { x: 6, y: 0 };
   113	    ball.z = 3;
   114	    ball.vz = -8; // slamming down — lands at √(8² + 2g·3) ≈ 11.1 m/s
   115	    let bounceVz = -1;
   116	    for (let i = 0; i < 60 && !m.finished; i++) {
   117	      m.step(DT);
   118	      if (ball.z === 0 && ball.vz > 0) {
   119	        bounceVz = ball.vz;
   120	        break;
   121	      }
   122	      if (ball.owner) break;
   123	    }
   124	    // Restitution 0.45 of the ~11.1 m/s landing speed ⇒ ≈5.0 up.
   125	    expect(bounceVz).toBeGreaterThan(3);
   126	    expect(bounceVz).toBeLessThan(5.6);
   127	  });
   128	
   129	  it('the crossbar is real: over the bar is NOT a goal, under it is', () => {
   130	    // Over the bar: ball crossing the goal line inside the mouth at z > 2.44.
   131	    const over = liveMatch(5);
   132	    over.ball.owner = null;
   133	    over.ball.pos = { x: HALF_L - 0.4, y: 0 };
   134	    over.ball.vel = { x: 26, y: 0 };
   135	    over.ball.z = GOAL_HEIGHT + 0.6;
   136	    over.ball.vz = 1.5;
   137	    const score0 = over.score[0] + over.score[1];
   138	    for (let i = 0; i < 50 && (over.phase as string) !== 'restart'; i++) over.step(DT); // past the out-of-play coast (41.1)
   139	    expect(over.score[0] + over.score[1]).toBe(score0); // no goal
   140	    expect(over.phase).toBe('restart'); // corner or goal kick instead
   141	
   142	    // Under the bar: same strike arriving at head height IS a goal.
   143	    const under = liveMatch(5);
   144	    under.ball.owner = null;
   145	    under.ball.lastTouch = under.teams[0].players[4];
   146	    under.ball.pos = { x: HALF_L - 0.4, y: 0 };
   147	    under.ball.vel = { x: 26, y: 0 };
   148	    under.ball.z = 1.0;
   149	    under.ball.vz = 0;
   150	    for (let i = 0; i < 10; i++) under.step(DT);
   151	    expect(under.score[0]).toBe(1);
   152	  });
   153	
   154	  it('gravity constant matches the flight-time math the kicks rely on', () => {
   155	    // performLoftedPass solves landing with T = 2·vz/g. If someone "tunes"
   156	    // GRAVITY the deliveries all land short/long — pin the contract.
   157	    expect(GRAVITY).toBeCloseTo(9.81, 3);
   158	  });
   159	});
   160	
   161	describe('aerial duels and deliveries', () => {
   162	  it('directional: defending wins contested aerial duels (focused, equal position)', () => {
   163	    // Match-level headersWon is dominated by UNCONTESTED headers (whoever is
   164	    // under the ball wins by default), which dilutes the attribute channel
   165	    // below test power (§10.5). So test the duel itself: two players at
   166	    // exactly equal distance under the same dropping ball, 300 seeded rolls.
   167	    const m = new Match({
   168	      seed: 7,
   169	      teamA: team('A', neutral(), { squad: squadOf(0.9) }),
   170	      teamB: team('B', neutral(), { squad: squadOf(0.1) }),
   171	      duration: 240,
   172	    });
   173	    const dfA = m.teams[0].players[1];
   174	    const dfB = m.teams[1].players[1];
   175	    // Park everyone else out of the contest radius.
   176	    for (const p of m.allPlayers) {
   177	      if (p !== dfA && p !== dfB) p.pos = { x: p.side === 0 ? -40 : 40, y: p.index * 5 - 12 };
   178	    }
   179	    const before = [m.teams[0].stats.headersWon, m.teams[1].stats.headersWon];
   180	    for (let i = 0; i < 300; i++) {
   181	      m.ball.owner = null;
   182	      m.ball.pos = { x: 0, y: 0 };
   183	      m.ball.vel = { x: 0, y: 0 };
   184	      m.ball.z = 2.0;
   185	      m.ball.vz = -3;
   186	      m.pendingPass = null;
   187	      for (const p of [dfA, dfB]) {
   188	        p.kickCooldown = 0;
   189	        p.stunTimer = 0;
   190	      }
   191	      dfA.pos = { x: 0.4, y: 0 };
   192	      dfB.pos = { x: -0.4, y: 0 };
   193	      tryAerial(m, m.allPlayers);
   194	    }
   195	    const winsA = m.teams[0].stats.headersWon - before[0];
   196	    const winsB = m.teams[1].stats.headersWon - before[1];
   197	    expect(winsA + winsB).toBe(300); // every roll was a real contest
   198	    expect(winsA).toBeGreaterThan(winsB * 1.5); // defending still reads the flight
   199	  });
   200	
   201	  it('directional: STRENGTH owns the air (Phase 63 — the target-man gradient)', () => {
   202	    // Same harness, strength differential: the big man out-jumps the
   203	    // technician at 2× the defending gradient's edge (0.3 vs 0.15 weights).
   204	    const strong = squadOf(0.5).map((p) => ({ ...p, strength: 0.9 }));
   205	    const weak = squadOf(0.5).map((p) => ({ ...p, strength: 0.1 }));
   206	    const m = new Match({
   207	      seed: 7,
   208	      teamA: team('A', neutral(), { squad: strong }),
   209	      teamB: team('B', neutral(), { squad: weak }),
   210	      duration: 240,
   211	    });
   212	    const dfA = m.teams[0].players[1];
   213	    const dfB = m.teams[1].players[1];
   214	    for (const p of m.allPlayers) {
   215	      if (p !== dfA && p !== dfB) p.pos = { x: p.side === 0 ? -40 : 40, y: p.index * 5 - 12 };
   216	    }
   217	    const before = [m.teams[0].stats.headersWon, m.teams[1].stats.headersWon];
   218	    for (let i = 0; i < 300; i++) {
   219	      m.ball.owner = null;
   220	      m.ball.pos = { x: 0, y: 0 };
   221	      m.ball.vel = { x: 0, y: 0 };
   222	      m.ball.z = 2.0;
   223	      m.ball.vz = -3;
   224	      m.pendingPass = null;
   225	      for (const p of [dfA, dfB]) {
   226	        p.kickCooldown = 0;
   227	        p.stunTimer = 0;
   228	      }
   229	      dfA.pos = { x: 0.4, y: 0 };
   230	      dfB.pos = { x: -0.4, y: 0 };
   231	      tryAerial(m, m.allPlayers);
   232	    }
   233	    const winsA = m.teams[0].stats.headersWon - before[0];
   234	    const winsB = m.teams[1].stats.headersWon - before[1];
   235	    expect(winsA + winsB).toBe(300);
   236	    expect(winsA).toBeGreaterThan(winsB * 2);
   237	  });
   238	
   239	  it('open-play crosses find HEADS: the attacker header exists at a real rate (Phase 63)', { timeout: 120000 }, () => {
   240	    // Pre-63 anatomy: deliveries led the runner into next week and receivers
   241	    // parked on the LANDING (where the ball is feet-height) — attacker
   242	    // headers ran 1-4% of open-play crosses. The meetable delivery + the
   243	    // attack-the-descent routing doubled it; this floor guards the channel.
   244	    const g = neutral();
   245	    g.attackingWidth = 0.85;
   246	    const wide = { formationAtk: 'wide-212', formationDef: 'press-23', scheme: 'man' } as const;
   247	    let crosses = 0;
   248	    let atkHead = 0;
   249	    // 20 → 80 seeds (Phase 41.2 hardening): at ~67 crosses the floor rode
   250	    // on 2-3 header events, and the 4400s seed range drew a 2%-tail streak
   251	    // after the slalom reshuffle (n=40 read 0.8% while the SAME config at
   252	    // n=120 measures 6.0% — and aerial-anatomy A/B'd the channel healthy,
   253	    // 6.6→7.3% per cross). ~260 crosses puts the 3% floor ~2.5σ under the
   254	    // true rate instead of one unlucky streak away.
   255	    for (let seed = 1; seed <= 80; seed++) {
   256	      const m = new Match({
   257	        seed: 4400 + seed,
   258	        teamA: team('A', g, { style: wide, policy: { crossBase: DEFAULT_POLICY.crossBase * 2.2 } }),
   259	        teamB: team('B', neutral()),
   260	        duration: 240,

[35m[3mcodex[0m[0m
Two architectural issues are now clear from the live code, independent of the roadmap’s hypotheses:

- `positioning` is budgeted as a general off-ball IQ stat but is only consumed in first-touch failure; runner choice, support targets, chaser choice, marking assignment, offside timing, and formation stations never read it.
- the sim has perfect, instantaneous world-state queries for everyone. The existing “playmaker vision” actually makes lanes look more open; it does not model better observation, and it is an attacking-only optimism buff.

I’m checking the shipped probes and the other flat decision/physics constants next, then I’ll propose a symmetric awareness model that changes mistakes and timing more than raw attacking utility.
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "if [ -x node_modules/.bin/tsx ]; then node_modules/.bin/tsx scripts/probes/positioning-bite.ts 8; else echo 'tsx not installed locally'; fi"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[31m exited 1 in 0ms:[0m
(node:72846) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
node:net:1986
      const error = new UVExceptionWithHostPort(rval, 'listen', address, port);
                    ^

Error: listen EPERM: operation not permitted /var/folders/rq/n10ngmz510l2k8ftz95g6ssw0000gp/T/tsx-502/72846.pipe
[90m    at Server.setupListenHandle [as _listen2] (node:net:1986:21)[39m
[90m    at listenInCluster (node:net:2065:12)[39m
[90m    at Server.listen (node:net:2187:5)[39m
    at [90mfile:///Users/jamie/Documents/Promptfoo/evofootball-arena/[39mnode_modules/[4mtsx[24m/dist/cli.mjs:53:31537
    at new Promise (<anonymous>)
    at createIpcServer [90m(file:///Users/jamie/Documents/Promptfoo/evofootball-arena/[39mnode_modules/[4mtsx[24m/dist/cli.mjs:53:31515[90m)[39m
    at async [90mfile:///Users/jamie/Documents/Promptfoo/evofootball-arena/[39mnode_modules/[4mtsx[24m/dist/cli.mjs:55:459 {
  code: [32m'EPERM'[39m,
  errno: [33m-1[39m,
  syscall: [32m'listen'[39m,
  address: [32m'/var/folders/rq/n10ngmz510l2k8ftz95g6ssw0000gp/T/tsx-502/72846.pipe'[39m,
  port: [33m-1[39m
}

Node.js v26.3.0

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'node --import tsx scripts/probes/positioning-bite.ts 8'[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 4007ms:[0m
positioning maxed-genome test — 8 matches/ordered-pairing (all attrs 0.5 except positioning):
  squad     spills/m  GF/m  GA/m
  pos-0.9   5.28      2.47  2.41
  pos-0.5   5.72      2.25  2.16
  pos-0.1   6.19      2.47  2.63

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'node --import tsx scripts/probes/positioning-bite.ts 32'[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 14459ms:[0m
positioning maxed-genome test — 32 matches/ordered-pairing (all attrs 0.5 except positioning):
  squad     spills/m  GF/m  GA/m
  pos-0.9   4.87      2.27  2.42
  pos-0.5   5.44      2.34  2.16
  pos-0.1   6.01      2.34  2.38

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg -n 'export interface TeamMatchStats|function emptyStats|export const emptyStats|interface TeamMatchStats' src/sim/types.ts; nl -ba src/sim/types.ts | sed -n '180,330p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
365:export interface TeamMatchStats {
427:export const emptyStats = (): TeamMatchStats => ({
   180	  shootModeMul: 1.2,
   181	  shootPressurePen: 0.25,
   182	  passBase: 0.2,
   183	  passLaneW: 0.3,
   184	  passOpenW: 0.2,
   185	  passFwdBase: 0.35,
   186	  passFwdRisk: 0.75,
   187	  passBackPen: 0.25,
   188	  passOutletMul: 1.15,
   189	  dribbleBase: 0.28,
   190	  dribbleSpaceW: 0.55,
   191	  dribbleGeneBase: 0.45,
   192	  dribbleGeneW: 1.0,
   193	  dribblePressurePen: 0.35,
   194	  clearBase: 0.12,
   195	  clearPressureW: 0.55,
   196	  supportBase: 0.3,
   197	  supportProxW: 0.35,
   198	  formationBase: 0.45,
   199	  chaseBase: 0.85,
   200	  markBase: 0.62,
   201	  interceptScore: 0.95,
   202	  runScore: 0.95,
   203	  throughBase: 0.22,
   204	  throughOpenW: 0.35,
   205	  throughBehindW: 0.52,
   206	  crossBase: 0.26,
   207	  crossBoxW: 0.5,
   208	  loftBase: 0.14,
   209	  loftOpenW: 0.38,
   210	  // 0.38 -> 0.55 in Phase 30.4: set defences (formations + zonal) park the
   211	  // block, and the realistic answer to a parked block is shooting over it.
   212	  longShotW: 0.55,
   213	  // Combo appetites (Phase 45): 1.0 = the Phase-34 hand-tuned behavior;
   214	  // per-franchise evolution moves them so combo-heavy vs combo-averse
   215	  // styles are EARNED by selection, not set.
   216	  wallPassW: 1.0,
   217	  thirdManW: 1.0,
   218	  overlapW: 1.0,
   219	};
   220	
   221	/** Everything a Match needs to know about one participating team. */
   222	export interface TeamInfo {
   223	  id: string;
   224	  name: string;
   225	  short: string;
   226	  colors: KitColors;
   227	  /** Surnames in slot order [GK, DF, MF, WGL, WGR, ST]. */
   228	  playerNames: string[];
   229	  genome: TacticalGenome;
   230	  /** Per-player attribute genes in slot order [GK, DF, MF, WGL, WGR, ST]. */
   231	  squad: PlayerAttributes[];
   232	  /** Player ages in role order (Phase 26) — display only, never read by the sim. */
   233	  ages?: number[];
   234	  /**
   235	   * The named coach in the dugout (Phase 66, N3) — feed attribution and the
   236	   * 3D touchline figure only, never read by mechanics. Missing (ad-hoc
   237	   * teams, old replays) = the calls stay credited to the club.
   238	   */
   239	  coachName?: string;
   240	  /**
   241	   * Tactical identity (Phase 30). Optional: a TeamInfo without one (tests,
   242	   * ad-hoc teams) derives it from the genome — same thresholds, same result.
   243	   */
   244	  style?: TeamStyle;
   245	  /**
   246	   * Club Elo at kickoff (Phase 64): the strength READING the underdog
   247	   * shift bends against. Missing on either side = nobody shifts (ad-hoc
   248	   * teams, probes and old replays keep pure-identity tactics).
   249	   */
   250	  elo?: number;
   251	  /** Confidence carried into the match (Phase 111) — 0.5 when absent, so
   252	   * ad-hoc teams, probes and old replays play at neutral morale. */
   253	  morale?: number;
   254	  /** Evolvable / learned utility-policy weights; MISSING keys fall back to
   255	   * DEFAULT_POLICY (Phase 42 franchises carry the attacking-style subset). */
   256	  policy?: Partial<PolicyParams>;
   257	  /**
   258	   * Per-slot policy vectors in slot order [GK, DF, MF, WGL, WGR, ST]
   259	   * (Phase 23; since Phase 54 the personal-style wire: the coach's policy
   260	   * run through each player's own appetites). A missing entry falls back
   261	   * to `policy` (then DEFAULT_POLICY), so a team without this field is
   262	   * bit-identical to the shared-policy path; missing KEYS read as the
   263	   * hand-tuned defaults.
   264	   */
   265	  rolePolicies?: Partial<PolicyParams>[];
   266	  /**
   267	   * Match-day availability (Phase 62 — suspensions): roster rows in playing
   268	   * order — first TEAM_SIZE start (slot order, a banned starter's row
   269	   * replaced by his bench cover), the rest are the available bench. All
   270	   * other TeamInfo arrays stay ROSTER-ordered; this is the only reordering.
   271	   * Missing = everyone available = [0..n-1], bit-identical to Phase 61.
   272	   */
   273	  lineup?: number[];
   274	}
   275	
   276	export type MatchPhase = 'kickoff' | 'playing' | 'restart' | 'goalPause' | 'halftime' | 'fulltime';
   277	
   278	/**
   279	 * Dead-ball restart kinds. Futsal-style kick-ins (not throws) from the
   280	 * touchline; free kicks and penalties are awarded for fouls (Phase 20).
   281	 */
   282	export type RestartKind = 'kickIn' | 'corner' | 'goalKick' | 'freeKick' | 'penalty';
   283	
   284	/**
   285	 * Corner routines (Phase 31): each is a target-spot table plus which
   286	 * box-crash runners attack it. Chosen by the taking side once the
   287	 * defensive picture forms, from the openness of each routine's key zone.
   288	 */
   289	export type CornerRoutine = 'nearPost' | 'farPost' | 'short' | 'arcCutback';
   290	
   291	/**
   292	 * GOAL CHANNEL (Phase 113): what CREATED a goal — the launch-anatomy
   293	 * probe's classes, gone player-facing. Priced at shot time from telemetry
   294	 * the match already keeps (zero RNG, zero behavior), one exclusive bucket
   295	 * per goal, priority top-down:
   296	 *   setpiece — within 6s of a corner / free kick / penalty kick
   297	 *   keeper   — a fresh final-15m breakaway entry launched by the keeper's
   298	 *              distribution (the phase-98 roll/sling/punt)
   299	 *   through  — the entry came on a ball IN BEHIND (ground through-ball or
   300	 *              the lofted launch — the trap school's prey, both timings)
   301	 *   carry    — the carrier dribbled through the line himself (>2.2s, >9m)
   302	 *   cross    — entered on a cross, or served by a cross/cutback at the shot
   303	 *   walkin   — a breakaway entry with no classifiable service: the line
   304	 *              was simply BEATEN (short pass into space, loose ball, ...)
   305	 *   buildup  — everything else (worked goals against a set line; also the
   306	 *              own-goal/scramble fallback when no tracked shot scored)
   307	 */
   308	export type GoalChannel =
   309	  | 'setpiece' | 'keeper' | 'through' | 'carry' | 'cross' | 'walkin' | 'buildup';
   310	
   311	export const GOAL_CHANNELS: readonly GoalChannel[] = [
   312	  'setpiece', 'keeper', 'through', 'carry', 'cross', 'walkin', 'buildup',
   313	];
   314	
   315	export const emptyChannels = (): Record<GoalChannel, number> => ({
   316	  setpiece: 0, keeper: 0, through: 0, carry: 0, cross: 0, walkin: 0, buildup: 0,
   317	});
   318	
   319	export interface RestartState {
   320	  kind: RestartKind;
   321	  /** Team taking the restart. */
   322	  side: Side;
   323	  pos: V2;
   324	  /** Sim-seconds since the restart was awarded. */
   325	  timer: number;
   326	  /** The player walking over to take it (GK for goal kicks). */
   327	  takerGid: number;
   328	  /** Corner routine (Phase 31) — picked mid-setup, undefined until then. */
   329	  routine?: CornerRoutine;
   330	  /**

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/sim/types.ts | sed -n '355,455p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
   355	export interface MatchEvent {
   356	  t: number;
   357	  /** Display minute (sim time scaled to a 90' clock). */
   358	  minute: number;
   359	  type: EventType;
   360	  /** -1 for neutral events. */
   361	  side: Side | -1;
   362	  text: string;
   363	}
   364	
   365	export interface TeamMatchStats {
   366	  goals: number;
   367	  shots: number;
   368	  shotsOnTarget: number;
   369	  xg: number;
   370	  passes: number;
   371	  passesCompleted: number;
   372	  /** Direct balls played into a runner's path (subset of passes). */
   373	  throughBalls: number;
   374	  /** Passes played ≥2m toward the opponent goal (subset of passes, Phase 27). */
   375	  passesForward: number;
   376	  /** First touches that got away from the receiver (forced errors, Phase 27). */
   377	  miscontrols: number;
   378	  /** Lofted balls whipped into the box from wide (Phase 28). */
   379	  crosses: number;
   380	  /** Byline pull-backs driven to the edge-of-box arc (Phase 31). */
   381	  cutbacks: number;
   382	  /** Goals within 5s of a completed cutback (Phase 31 — the payoff metric). */
   383	  cutbackGoals: number;
   384	  /** First-time passes — struck inside a pressured reception's one-touch
   385	   * window, with the technique-priced accuracy penalty (Phase 31.9). */
   386	  oneTouch: number;
   387	  /** Aerial duels won — headed shots, clears and knockdowns (Phase 28). */
   388	  headersWon: number;
   389	  /** Lofted long deliveries — switches/diagonals + chipped through balls (Phase 28). */
   390	  longBalls: number;
   391	  keyPasses: number;
   392	  interceptions: number;
   393	  tackles: number;
   394	  /** Shots thrown a body in front of (Phase 31) — the blocked drive becomes a loose ball. */
   395	  blocks: number;
   396	  clearances: number;
   397	  saves: number;
   398	  dribbles: number;
   399	  corners: number;
   400	  /** Fouls committed — each hands the opponents a free kick or penalty. */
   401	  fouls: number;
   402	  /** Offside flags against this team (Phase 29) — free kick to the opponents. */
   403	  offsides: number;
   404	  /** Penalties won (fouled inside the opponents' box). */
   405	  penalties: number;
   406	  /** Bookings picked up (a second yellow counts here AND as a red). */
   407	  yellows: number;
   408	  /** Players sent off — the team plays a man short from that moment. */
   409	  reds: number;
   410	  possessionTime: number;
   411	  distance: number;
   412	  staminaSpent: number;
   413	  /** Longest chain of consecutive completed passes in one move (Phase 33). */
   414	  bestPassChain: number;
   415	  /** Completed give-and-gos: the wall return found the bursting passer (Phase 34). */
   416	  oneTwos: number;
   417	  /** Completed third-man releases: fresh receiver → bounce → runner (Phase 34). */
   418	  thirdMan: number;
   419	  /** Completed overlap releases: the wide ball found the overlapping runner (Phase 34). */
   420	  overlaps: number;
   421	  /** Goals scored by channel (Phase 113) — the against side is the opponent's row. */
   422	  goalChannels: Record<GoalChannel, number>;
   423	  /** Injuries suffered this match (Phase 118) — knocks + serious together. */
   424	  injuries: number;
   425	}
   426	
   427	export const emptyStats = (): TeamMatchStats => ({
   428	  goals: 0,
   429	  shots: 0,
   430	  shotsOnTarget: 0,
   431	  xg: 0,
   432	  passes: 0,
   433	  passesCompleted: 0,
   434	  throughBalls: 0,
   435	  passesForward: 0,
   436	  miscontrols: 0,
   437	  crosses: 0,
   438	  cutbacks: 0,
   439	  cutbackGoals: 0,
   440	  oneTouch: 0,
   441	  headersWon: 0,
   442	  longBalls: 0,
   443	  keyPasses: 0,
   444	  interceptions: 0,
   445	  tackles: 0,
   446	  blocks: 0,
   447	  clearances: 0,
   448	  saves: 0,
   449	  dribbles: 0,
   450	  corners: 0,
   451	  fouls: 0,
   452	  offsides: 0,
   453	  penalties: 0,
   454	  yellows: 0,
   455	  reds: 0,

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "node --import tsx --input-type=module -e 'import { Match } from \"./src/sim/Match.ts\"; import { GENE_KEYS } from \"./src/evolution/genome.ts\"; import { ATTR_KEYS } from \"./src/evolution/playerGenome.ts\"; import { TEAM_SIZE } from \"./src/sim/types.ts\"; const K=20; const genome=()=>Object.fromEntries(GENE_KEYS.map(k=>[k,0.5])); const squad=(key,val)=>Array.from({length:TEAM_SIZE},()=>Object.fromEntries(ATTR_KEYS.map(k=>[k,k===key?val:0.5]))); const info=(key,val,tag)=>({id:tag,name:tag,short:tag,colors:{primary:0xff0000,secondary:0xffffff},playerNames:Array.from({length:TEAM_SIZE},(_,i)=>"'`P${i}`),genome:genome(),squad:squad(key,val)}); const keys=["goals","shots","xg","passes","passesCompleted","miscontrols","throughBalls","crosses","headersWon","tackles","blocks","interceptions","saves","dribbles","staminaSpent"]; for(const attr of ATTR_KEYS){ const H=Object.fromEntries(keys.map(k=>[k,0])),L=Object.fromEntries(keys.map(k=>[k,0])); let n=0; for(let seed=1;seed<=K;seed++){ for(const rev of [false,true]){ const hi=info(attr,0.9,"HI"),lo=info(attr,0.1,"LO"); const r=new Match({seed:50000+seed,teamA:rev?lo:hi,teamB:rev?hi:lo,duration:300}).runToCompletion(); const hs=r.stats[rev?1:0],ls=r.stats[rev?0:1]; for(const k of keys){H[k]+=hs[k];L[k]+=ls[k];} n++; }} const d=k=>(H[k]-L[k])/n,h=k=>H[k]/n,l=k=>L[k]/n; console.log(`${attr.padEnd(11)} ΔGF ${d("goals").toFixed(2)} ΔxG ${d("xg").toFixed(2)} Δshots ${d("shots").toFixed(2)} Δcomp ${((h("passesCompleted")/h("passes")-l("passesCompleted")/l("passes"))*100).toFixed(1)}pp Δspill ${d("miscontrols").toFixed(2)} Δhdr ${d("headersWon").toFixed(2)} Δtkl ${d("tackles").toFixed(2)} Δblk ${d("blocks").toFixed(2)} Δsave ${d("saves").toFixed(2)} Δdrb ${d("dribbles").toFixed(2)} ΔstSp ${d("staminaSpent").toFixed(2)}`); }'"'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 25095ms:[0m
pace        ΔGF 3.40 ΔxG 1.96 Δshots 11.03 Δcomp 5.3pp Δspill 0.05 Δhdr -2.27 Δtkl 2.42 Δblk -0.05 Δsave -4.05 Δdrb 26.63 ΔstSp -1.33
passing     ΔGF 0.30 ΔxG -0.06 Δshots -0.53 Δcomp 0.3pp Δspill 0.03 Δhdr 0.23 Δtkl 0.45 Δblk 0.03 Δsave 0.47 Δdrb -2.35 ΔstSp 0.02
dribbling   ΔGF 0.93 ΔxG 0.40 Δshots 2.95 Δcomp 4.6pp Δspill -3.92 Δhdr -0.33 Δtkl 1.77 Δblk -0.20 Δsave -0.42 Δdrb 11.78 ΔstSp -0.11
finishing   ΔGF 0.07 ΔxG 0.14 Δshots 1.30 Δcomp 0.0pp Δspill 0.50 Δhdr -0.33 Δtkl -0.25 Δblk 0.10 Δsave -0.75 Δdrb -0.17 ΔstSp -0.09
defending   ΔGF 1.85 ΔxG 0.79 Δshots 4.83 Δcomp 1.0pp Δspill 0.13 Δhdr 0.00 Δtkl 5.53 Δblk -0.05 Δsave -1.57 Δdrb 8.22 ΔstSp -0.15
strength    ΔGF 0.57 ΔxG 0.08 Δshots 0.97 Δcomp 0.9pp Δspill 0.20 Δhdr -0.20 Δtkl 1.48 Δblk -0.03 Δsave -0.40 Δdrb 4.03 ΔstSp -0.04
stamina     ΔGF 0.28 ΔxG 0.47 Δshots 2.75 Δcomp 2.6pp Δspill -0.20 Δhdr -0.47 Δtkl 0.03 Δblk 0.00 Δsave -1.63 Δdrb 9.63 ΔstSp -2.40
reflexes    ΔGF 0.80 ΔxG -0.38 Δshots -2.50 Δcomp -0.3pp Δspill 0.03 Δhdr -0.42 Δtkl -0.68 Δblk 0.03 Δsave 2.90 Δdrb -6.78 ΔstSp 0.07
positioning ΔGF -0.15 ΔxG 0.13 Δshots 0.75 Δcomp -0.1pp Δspill -2.27 Δhdr -0.30 Δtkl -0.03 Δblk 0.10 Δsave -0.68 Δdrb 2.77 ΔstSp -0.09

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg -n -i 'finishing.*conversion|conversion.*finishing|high-fin|hi-fin|finishing' tests scripts/probes | head -200"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
scripts/probes/breakaway.ts:14:// `max` mode: force the BEST-possible genome (control + finishing maxed) to test
scripts/probes/breakaway.ts:20:  if (MAX) for (const p of squad) { p.dribbling = 0.95; p.finishing = 0.9; }
tests/traits.test.ts:27:    expect(traitsOf(attrs({ finishing: 0.85 }), 'ST')).toContain('clinical');
tests/traits.test.ts:29:    expect(traitsOf(attrs({ finishing: 0.79, dribbling: 0.65 }), 'ST')).toHaveLength(0);
tests/traits.test.ts:30:    expect(traitsOf(attrs({ finishing: 0.85 }), 'DF')).toHaveLength(0); // DFs don't get clinical
tests/traits.test.ts:35:    expect(traitsOf(attrs({ finishing: 0.78, dribbling: 0.4 }), 'ST')).toContain('poacher');
tests/traits.test.ts:36:    expect(traitsOf(attrs({ finishing: 0.78, dribbling: 0.7 }), 'ST')).toHaveLength(0);
tests/traits.test.ts:37:    expect(traitsOf(attrs({ finishing: 0.78, dribbling: 0.4 }), 'WG')).toHaveLength(0);
tests/traits.test.ts:40:    expect(traitsOf(attrs({ finishing: 0.95, passing: 0.95 }), 'GK')).toHaveLength(0);
tests/traits.test.ts:44:    const many = traitsOf(attrs({ finishing: 0.95, passing: 0.85, dribbling: 0.85, defending: 0.9, pace: 0.9 }), 'ST');
tests/traits.test.ts:50:    const a = attrs({ finishing: 0.9, passing: 0.82 });
tests/traits.test.ts:52:    expect(a.finishing).toBe(0.9);
scripts/probes/jockey-ab.ts:14:  pace: 0.5, passing: 0.5, dribbling: 0.5, finishing: 0.5,
scripts/probes/evo-drift.ts:3:// control is ST finishing: finishing PAYS (strikers score → win → selected),
scripts/probes/evo-drift.ts:4:// so it should drift UP. If WG pace/technique stay FLAT while ST finishing
scripts/probes/evo-drift.ts:38:    `${f2(roleAttr('ST', 'finishing'))} | ${f2(roleAttr('DF', 'defending'))} | ` +
tests/shootoutTheater.test.ts:12:const attrs = (finishing: number): PlayerAttributes => {
tests/shootoutTheater.test.ts:15:  p.finishing = finishing;
tests/league.test.ts:258:        pace: p.pace, technique: 0.63, finishing: p.finishing,
tests/freekick.test.ts:116:  it('the specialist takes it: best finishing + technique/2 steps up in range', () => {
tests/freekick.test.ts:118:    squad[5] = attrs({ finishing: 0.95, passing: 0.9 }); // the ST slot
tests/shootout.test.ts:9:const squadOf = (finishing: number, reflexes: number): ShootoutSquad => ({
tests/shootout.test.ts:10:  kickers: [finishing, finishing, finishing, finishing, finishing],
tests/shootout.test.ts:15:const attrs = (finishing: number, reflexes = 0.5): PlayerAttributes => {
tests/shootout.test.ts:18:  p.finishing = finishing;
tests/shootout.test.ts:82:    // Outfield sorted by finishing desc with index tiebreak (2 → 0.9, then 3 & 4 at 0.6, then 1), GK last.
tests/shootout.test.ts:86:    lineup.order.forEach((pi, i) => expect(squad[pi].finishing).toBe(lineup.kickers[i]));
scripts/probes/goals-warming.ts:50:        `  [gen ${g}] fin ${attr('finishing').toFixed(2)} pace ${attr('pace').toFixed(2)} ` +
tests/fouls.test.ts:71:    info.squad[2].finishing = 0.95; // the MF is the designated taker
tests/playerGenome.test.ts:200:  it('finishing: clinical squad converts more of its shots into goals', { timeout: 240000 }, async () => {
tests/playerGenome.test.ts:206:    //    side-balancing (hi-fin plays each side equally) — a handful of
tests/playerGenome.test.ts:207:    //    one-sided matches measures pitch-side noise, not finishing.
tests/playerGenome.test.ts:223:            ? [squadWith({ finishing: 0.95 }), squadWith({ finishing: 0.05 })]
tests/playerGenome.test.ts:224:            : [squadWith({ finishing: 0.05 }), squadWith({ finishing: 0.95 })];

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba tests/playerGenome.test.ts | sed -n '1,280p'; nl -ba scripts/probes/evo-drift.ts | sed -n '1,90p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	import { describe, expect, it } from 'vitest';
     2	import type { TacticalGenome } from '../src/evolution/genome';
     3	import { GENE_KEYS } from '../src/evolution/genome';
     4	import {
     5	  ATTR_KEYS, ROSTER_ROLES, SQUAD_BUDGET, crossoverSquads, enforceBudget, mutateSquad,
     6	  newgenFromBloodline, randomSquad, squadSummary, squadTotal, type PlayerAttributes,
     7	} from '../src/evolution/playerGenome';
     8	import { Match, type ShotLogEntry } from '../src/sim/Match';
     9	import { TEAM_SIZE, type TeamInfo, type TeamMatchStats } from '../src/sim/types';
    10	import { Rng } from '../src/utils/rng';
    11	
    12	/* ---------------- genome operators ---------------- */
    13	
    14	describe('player genome operators', () => {
    15	  it('random squads stay in bounds and are role-biased', () => {
    16	    let gkReflex = 0;
    17	    let stReflex = 0;
    18	    const N = 50;
    19	    for (let i = 0; i < N; i++) {
    20	      const squad = randomSquad(new Rng(i + 1));
    21	      expect(squad.length).toBe(ROSTER_ROLES.length); // 9 since the bench (Phase 61)
    22	      for (const p of squad) {
    23	        for (const k of ATTR_KEYS) {
    24	          expect(p[k]).toBeGreaterThanOrEqual(0);
    25	          expect(p[k]).toBeLessThanOrEqual(1);
    26	        }
    27	      }
    28	      gkReflex += squad[0].reflexes; // GK slot
    29	      stReflex += squad[5].reflexes; // ST slot
    30	    }
    31	    expect(gkReflex / N).toBeGreaterThan(stReflex / N);
    32	  });
    33	
    34	  it('mutation is bounded and deterministic', () => {
    35	    const squad = randomSquad(new Rng(7));
    36	    const a = mutateSquad(squad, new Rng(9));
    37	    const b = mutateSquad(squad, new Rng(9));
    38	    expect(a).toEqual(b);
    39	    for (const p of a) {
    40	      for (const k of ATTR_KEYS) {
    41	        expect(p[k]).toBeGreaterThanOrEqual(0);
    42	        expect(p[k]).toBeLessThanOrEqual(1);
    43	      }
    44	    }
    45	  });
    46	
    47	  it('crossover children stay within parents per-slot bounds', () => {
    48	    const rng = new Rng(3);
    49	    const a = randomSquad(rng);
    50	    const b = randomSquad(rng);
    51	    const child = crossoverSquads(a, b, new Rng(5));
    52	    child.forEach((p, i) => {
    53	      for (const k of ATTR_KEYS) {
    54	        expect(p[k]).toBeGreaterThanOrEqual(Math.min(a[i][k], b[i][k]) - 1e-9);
    55	        expect(p[k]).toBeLessThanOrEqual(Math.max(a[i][k], b[i][k]) + 1e-9);
    56	      }
    57	    });
    58	  });
    59	
    60	  it('enforceBudget: over-cap squads rescale proportionally, under-cap pass through untouched', () => {
    61	    const hot: PlayerAttributes[] = Array.from({ length: TEAM_SIZE }, () => {
    62	      const p = {} as PlayerAttributes;
    63	      for (const k of ATTR_KEYS) p[k] = 0.9;
    64	      return p;
    65	    });
    66	    const capped = enforceBudget(hot);
    67	    expect(squadTotal(capped)).toBeCloseTo(SQUAD_BUDGET, 6);
    68	    // Proportional: relative allocation is untouched — the shave is unbiased.
    69	    const mul = SQUAD_BUDGET / squadTotal(hot);
    70	    expect(capped[0].pace).toBeCloseTo(0.9 * mul, 9);
    71	    const modest: PlayerAttributes[] = Array.from({ length: TEAM_SIZE }, () => {
    72	      const p = {} as PlayerAttributes;
    73	      for (const k of ATTR_KEYS) p[k] = 0.3;
    74	      return p;
    75	    });
    76	    expect(enforceBudget(modest)).toBe(modest); // same reference: no work under cap
    77	  });
    78	
    79	  it('newgenFromBloodline: the successor is grown in the club\'s image', () => {
    80	    const legend = {} as PlayerAttributes;
    81	    for (const k of ATTR_KEYS) legend[k] = 0.1;
    82	    legend.reflexes = 0.95; // a keeper dynasty's slot
    83	    let topStaysReflexes = 0;
    84	    const N = 60;
    85	    for (let s = 0; s < N; s++) {
    86	      const heir = newgenFromBloodline(legend, new Rng(1000 + s));
    87	      for (const k of ATTR_KEYS) {
    88	        expect(heir[k]).toBeGreaterThanOrEqual(0);
    89	        expect(heir[k]).toBeLessThanOrEqual(1);
    90	        expect(Math.abs(heir[k] - legend[k])).toBeLessThan(0.5); // σ0.12 mutation, not a reroll
    91	      }
    92	      const top = ATTR_KEYS.reduce((a, b) => (heir[a] >= heir[b] ? a : b));
    93	      if (top === 'reflexes') topStaysReflexes++;
    94	    }
    95	    expect(topStaysReflexes / N).toBeGreaterThan(0.9); // the bloodline holds
    96	  });
    97	
    98	  it('newgenFromBloodline: the academy grows what the philosophy needs (94)', () => {
    99	    // Same retiree, same rng stream — the philosophy pull is a pure shift:
   100	    // a containment coach's heir gains defending and sheds pace, a dive-in
   101	    // coach's heir mirrors it, and a neutral 0.5 coach is a no-op vs the
   102	    // two-arg legacy call. Zero-sum on the axis, everything else untouched.
   103	    const retiree = {} as PlayerAttributes;
   104	    for (const k of ATTR_KEYS) retiree[k] = 0.5;
   105	    for (let s = 0; s < 20; s++) {
   106	      const neutral = newgenFromBloodline(retiree, new Rng(2000 + s));
   107	      const legacy = newgenFromBloodline(retiree, new Rng(2000 + s), 0.5);
   108	      const jockey = newgenFromBloodline(retiree, new Rng(2000 + s), 0.9);
   109	      const divein = newgenFromBloodline(retiree, new Rng(2000 + s), 0.1);
   110	      for (const k of ATTR_KEYS) expect(legacy[k]).toBe(neutral[k]);
   111	      expect(jockey.defending).toBeCloseTo(Math.min(1, neutral.defending + 0.4 * 0.24), 9);
   112	      expect(jockey.pace).toBeCloseTo(Math.max(0, neutral.pace - 0.4 * 0.24), 9);
   113	      expect(divein.pace).toBeCloseTo(Math.min(1, neutral.pace + 0.4 * 0.24), 9);
   114	      expect(divein.defending).toBeCloseTo(Math.max(0, neutral.defending - 0.4 * 0.24), 9);
   115	      for (const k of ATTR_KEYS) {
   116	        if (k === 'defending' || k === 'pace') continue;
   117	        expect(jockey[k]).toBe(neutral[k]);
   118	        expect(divein[k]).toBe(neutral[k]);
   119	      }
   120	    }
   121	  });
   122	
   123	  it('squadSummary averages attributes', () => {
   124	    const squad = randomSquad(new Rng(11));
   125	    const s = squadSummary(squad);
   126	    const manual = squad.reduce((acc, p) => acc + p.pace, 0) / squad.length;
   127	    expect(s.pace).toBeCloseTo(manual);
   128	  });
   129	});
   130	
   131	/* ---------------- attribute effects in the sim ---------------- */
   132	
   133	const neutralGenome = (): TacticalGenome => {
   134	  const g = {} as TacticalGenome;
   135	  for (const k of GENE_KEYS) g[k] = 0.5;
   136	  return g;
   137	};
   138	
   139	const squadWith = (overrides: Partial<PlayerAttributes>): PlayerAttributes[] =>
   140	  Array.from({ length: TEAM_SIZE }, () => {
   141	    const p = {} as PlayerAttributes;
   142	    for (const k of ATTR_KEYS) p[k] = 0.5;
   143	    return { ...p, ...overrides };
   144	  });
   145	
   146	function team(name: string, squad: PlayerAttributes[]): TeamInfo {
   147	  return {
   148	    id: name,
   149	    name,
   150	    short: name.slice(0, 3).toUpperCase(),
   151	    colors: { primary: 0xff0000, secondary: 0xffffff },
   152	    playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
   153	    genome: neutralGenome(),
   154	    squad,
   155	  };
   156	}
   157	
   158	const SEEDS = [11, 42, 99, 1234, 777, 31337, 2026, 555];
   159	
   160	function totals(
   161	  sa: PlayerAttributes[],
   162	  sb: PlayerAttributes[],
   163	  seeds: readonly number[] = SEEDS,
   164	): [TeamMatchStats, TeamMatchStats, ShotLogEntry[]] {
   165	  const sum = (a: TeamMatchStats, b: TeamMatchStats): TeamMatchStats => {
   166	    // Numeric counters sum; goalChannels (Phase 113) merges per channel.
   167	    const out = { ...a, goalChannels: { ...a.goalChannels } };
   168	    const on = out as unknown as Record<string, number>;
   169	    const bn = b as unknown as Record<string, number>;
   170	    for (const k of Object.keys(out)) if (k !== 'goalChannels') on[k] += bn[k];
   171	    for (const c of Object.keys(out.goalChannels) as Array<keyof typeof out.goalChannels>) {
   172	      out.goalChannels[c] += b.goalChannels[c];
   173	    }
   174	    return out;
   175	  };
   176	  // Side-balanced: each seed runs both home/away orders so iteration- or
   177	  // side-linked noise cancels (§10.5 — one-order pools flipped on real
   178	  // effects twice as the engine's rng stream moved under them).
   179	  let acc: [TeamMatchStats, TeamMatchStats] | null = null;
   180	  const shots: ShotLogEntry[] = [];
   181	  for (const seed of seeds) {
   182	    const ab = new Match({ seed, teamA: team('A', sa), teamB: team('B', sb), duration: 120 });
   183	    const rab = ab.runToCompletion();
   184	    shots.push(...ab.shotLog);
   185	    acc = acc ? [sum(acc[0], rab.stats[0]), sum(acc[1], rab.stats[1])] : [rab.stats[0], rab.stats[1]];
   186	    const ba = new Match({ seed, teamA: team('B', sb), teamB: team('A', sa), duration: 120 });
   187	    const rba = ba.runToCompletion();
   188	    for (const s of ba.shotLog) shots.push({ ...s, side: (1 - s.side) as 0 | 1 });
   189	    acc = [sum(acc[0], rba.stats[1]), sum(acc[1], rba.stats[0])];
   190	  }
   191	  return [acc![0], acc![1], shots];
   192	}
   193	
   194	describe('player attributes influence the sim', () => {
   195	  it('pace: faster squad covers more distance', () => {
   196	    const [a, b] = totals(squadWith({ pace: 0.95 }), squadWith({ pace: 0.05 }));
   197	    expect(a.distance).toBeGreaterThan(b.distance);
   198	  });
   199	
   200	  it('finishing: clinical squad converts more of its shots into goals', { timeout: 240000 }, async () => {
   201	    // Two design notes, learned the hard way:
   202	    // 1. "On target" is a bad proxy — sprayed shots drift toward the keeper
   203	    //    and get "saved" (counted on target) while corner-shaving finishes
   204	    //    either score or go just wide. Conversion is the honest metric.
   205	    // 2. The effect is a few percentage points, so this needs POWER and
   206	    //    side-balancing (hi-fin plays each side equally) — a handful of
   207	    //    one-sided matches measures pitch-side noise, not finishing.
   208	    const hi = { shots: 0, goals: 0 };
   209	    const lo = { shots: 0, goals: 0 };
   210	    // 270 seeds (was 90, was 30 — §10.5's law of this file): the effect is
   211	    // a solid ~4pp at scale (verified 31.9: 21.3% vs 17.7% at 270×2), but
   212	    // at 90×2 that's only ~1.6σ over shot-count noise and the pool flipped
   213	    // on the corner-flood mechanics churn. 540 matches ⇒ ~2.8σ.
   214	    for (let i = 0; i < 270; i++) {
   215	      // Yield periodically: 180 full matches peg the CPU and starve
   216	      // vitest's RPC heartbeat on 2-core CI runners (repo CI rule) — this
   217	      // one first tripped it when 6v6 matches got ~30% dearer (phase 30).
   218	      if (i % 25 === 0) await new Promise((r) => setImmediate(r));
   219	      const seed = 1000 + i * 37;
   220	      for (const hiSide of [0, 1] as const) {
   221	        const squads =
   222	          hiSide === 0
   223	            ? [squadWith({ finishing: 0.95 }), squadWith({ finishing: 0.05 })]
   224	            : [squadWith({ finishing: 0.05 }), squadWith({ finishing: 0.95 })];
   225	        const m = new Match({ seed, teamA: team('A', squads[0]), teamB: team('B', squads[1]), duration: 120 });
   226	        m.runToCompletion();
   227	        for (const s of m.shotLog) {
   228	          const t = s.side === hiSide ? hi : lo;
   229	          t.shots++;
   230	          if (s.outcome === 'goal') t.goals++;
   231	        }
   232	      }
   233	    }
   234	    expect(hi.goals / Math.max(hi.shots, 1)).toBeGreaterThan(lo.goals / Math.max(lo.shots, 1));
   235	  });
   236	
   237	  it('defending: stronger tacklers win the ball more', () => {
   238	    const [a, b] = totals(squadWith({ defending: 0.95 }), squadWith({ defending: 0.05 }));
   239	    expect(a.tackles).toBeGreaterThan(b.tackles);
   240	  });
   241	
   242	  it('reflexes: better keeper saves a higher share of on-target shots', { timeout: 60000 }, () => {
   243	    // Own wide pool (31.9, §10.5): at the 8-seed default a keeper faces
   244	    // only ~35 on-target shots — the real ~13pp save-rate edge (54.8% vs
   245	    // 41.7% at 120 matches) is ~1σ there and flipped on the tackle-economy
   246	    // churn. 60 seeds ⇒ ~120 faced per arm, edge >2σ.
   247	    const seeds = Array.from({ length: 60 }, (_, i) => 5000 + i * 13);
   248	    const [a, b] = totals(squadWith({ reflexes: 0.95 }), squadWith({ reflexes: 0.05 }), seeds);
   249	    // Team A's keeper faces B's on-target shots and vice versa.
   250	    const rateA = a.saves / Math.max(b.shotsOnTarget, 1);
   251	    const rateB = b.saves / Math.max(a.shotsOnTarget, 1);
   252	    expect(rateA).toBeGreaterThan(rateB);
   253	  });
   254	
   255	  it('shot log is consistent: goals in log match the score', () => {
   256	    for (const seed of SEEDS.slice(0, 3)) {
   257	      const m = new Match({
   258	        seed,
   259	        teamA: team('A', squadWith({})),
   260	        teamB: team('B', squadWith({})),
   261	        duration: 120,
   262	      });
   263	      const r = m.runToCompletion();
   264	      const logGoals: [number, number] = [0, 0];
   265	      for (const s of m.shotLog) {
   266	        if (s.outcome === 'goal') logGoals[s.side]++;
   267	        expect(s.outcome).not.toBe('pending'); // everything resolved by full time
   268	      }
   269	      // Every logged goal came from a shot; scramble/own goals may add to score.
   270	      expect(logGoals[0]).toBeLessThanOrEqual(r.score[0]);
   271	      expect(logGoals[1]).toBeLessThanOrEqual(r.score[1]);
   272	    }
   273	  });
   274	});
     1	// Diagnostic: does PLAYER evolution actually select skill? Runs 50 generations
     2	// and tracks population-wide per-role attribute means + key gene means. The
     3	// control is ST finishing: finishing PAYS (strikers score → win → selected),
     4	// so it should drift UP. If WG pace/technique stay FLAT while ST finishing
     5	// climbs, that proves the machinery works but there's no selection gradient on
     6	// the skill dims that would make wingers emerge (they don't pay — see 1v1).
     7	//   npx tsx scripts/probes/evo-drift.ts [gens] [seed]
     8	import { League } from '../../src/sim/League';
     9	import { SQUAD_ROLES } from '../../src/evolution/playerGenome';
    10	import type { AttrKey } from '../../src/evolution/playerGenome';
    11	import type { Role } from '../../src/sim/types';
    12	
    13	const GENS = Number(process.argv[2] ?? 50);
    14	const SEED = Number(process.argv[3] ?? 424242);
    15	const league = new League({ seed: SEED });
    16	
    17	const roleAttr = (role: Role, key: AttrKey): number => {
    18	  let sum = 0, n = 0;
    19	  for (const f of league.franchises) {
    20	    for (let i = 0; i < f.squad.length; i++) {
    21	      if (SQUAD_ROLES[i] === role) { sum += f.squad[i][key]; n++; }
    22	    }
    23	  }
    24	  return sum / Math.max(n, 1);
    25	};
    26	const gene = (key: string): number => {
    27	  let s = 0;
    28	  for (const f of league.franchises) s += (f.coach.genome as unknown as Record<string, number>)[key];
    29	  return s / league.franchises.length;
    30	};
    31	const f2 = (v: number): string => v.toFixed(3);
    32	
    33	console.log(`seed ${SEED}, ${GENS} generations`);
    34	console.log('gen | WGpace WGdrb | STfin(ctrl) | DFdef | width dribble tempo press');
    35	const row = (g: number): void => {
    36	  console.log(
    37	    `${String(g).padStart(3)} | ${f2(roleAttr('WG', 'pace'))} ${f2(roleAttr('WG', 'dribbling'))} | ` +
    38	    `${f2(roleAttr('ST', 'finishing'))} | ${f2(roleAttr('DF', 'defending'))} | ` +
    39	    `${f2(gene('attackingWidth'))} ${f2(gene('dribbleBias'))} ${f2(gene('tempo'))} ${f2(gene('pressIntensity'))}`,
    40	  );
    41	};
    42	
    43	for (let g = 0; g <= GENS; g++) {
    44	  if (g % 5 === 0 || g === GENS) row(g);
    45	  if (g < GENS) {
    46	    while (!league.seasonDone) {
    47	      const fx = league.nextFixture()!;
    48	      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    49	    }
    50	    league.finishSeason();
    51	  }
    52	}

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "node --import tsx --input-type=module -e 'import { Match } from \"./src/sim/Match.ts\"; import { GENE_KEYS } from \"./src/evolution/genome.ts\"; import { ATTR_KEYS } from \"./src/evolution/playerGenome.ts\"; import { TEAM_SIZE } from \"./src/sim/types.ts\"; const K=60; const genome=()=>Object.fromEntries(GENE_KEYS.map(k=>[k,0.5])); const squad=(key,val)=>Array.from({length:TEAM_SIZE},()=>Object.fromEntries(ATTR_KEYS.map(k=>[k,k===key?val:0.5]))); const info=(key,val,tag)=>({id:tag,name:tag,short:tag,colors:{primary:0xff0000,secondary:0xffffff},playerNames:Array.from({length:TEAM_SIZE},(_,i)=>"'`P${i}`),genome:genome(),squad:squad(key,val)}); const keys=["shots","xg","passes","passesCompleted","miscontrols","throughBalls","crosses","headersWon","tackles","blocks","interceptions","saves","dribbles","staminaSpent"]; for(const attr of ATTR_KEYS){ const H=Object.fromEntries(keys.map(k=>[k,0])); let gf=0,ga=0,shotN=0,shotG=0,n=0; for(let seed=1;seed<=K;seed++){ for(const rev of [false,true]){ const hi=info(attr,0.95,"HI"),lo=info(attr,0.05,"LO"),hiSide=rev?1:0; const m=new Match({seed:61000+seed*37,teamA:rev?lo:hi,teamB:rev?hi:lo,duration:120}); const rr=m.runToCompletion(),hs=rr.stats[hiSide],os=rr.stats[1-hiSide]; gf+=hs.goals;ga+=os.goals; for(const k of keys)H[k]+=hs[k]; for(const s of m.shotLog){if(s.side===hiSide){shotN++;if(s.outcome==="goal")shotG++;}} n++; }} console.log(`${attr.padEnd(11)} GF ${ (gf/n).toFixed(2)} GA ${(ga/n).toFixed(2)} xG ${(H.xg/n).toFixed(2)} shots ${(H.shots/n).toFixed(2)} conv ${((shotG/Math.max(shotN,1))*100).toFixed(1)}% comp ${((H.passesCompleted/Math.max(H.passes,1))*100).toFixed(1)}% spill ${(H.miscontrols/n).toFixed(2)} hdr ${(H.headersWon/n).toFixed(2)} tkl ${(H.tackles/n).toFixed(2)} blk ${(H.blocks/n).toFixed(2)} save ${(H.saves/n).toFixed(2)} drb ${(H.dribbles/n).toFixed(2)} stSp ${(H.staminaSpent/n).toFixed(2)}`); }'"'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 30752ms:[0m
(node:73497) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
pace        GF 1.63 GA 0.41 xG 1.08 shots 6.48 conv 24.4% comp 75.3% spill 2.54 hdr 1.44 tkl 3.52 blk 0.03 save 0.74 drb 34.00 stSp 1.96
passing     GF 1.15 GA 0.88 xG 0.66 shots 4.45 conv 24.7% comp 75.6% spill 1.93 hdr 1.92 tkl 3.02 blk 0.01 save 1.59 drb 29.78 stSp 2.36
dribbling   GF 1.07 GA 0.81 xG 0.75 shots 5.10 conv 20.3% comp 75.9% spill 1.38 hdr 1.48 tkl 3.55 blk 0.03 save 1.10 drb 30.46 stSp 2.34
finishing   GF 1.04 GA 0.78 xG 0.59 shots 4.12 conv 24.9% comp 75.1% spill 2.26 hdr 1.60 tkl 2.85 blk 0.03 save 1.37 drb 28.28 stSp 2.42
defending   GF 1.48 GA 0.59 xG 0.83 shots 5.59 conv 25.9% comp 75.2% spill 2.20 hdr 1.83 tkl 4.70 blk 0.03 save 1.16 drb 29.81 stSp 2.37
strength    GF 0.98 GA 0.87 xG 0.62 shots 4.16 conv 22.8% comp 75.4% spill 2.27 hdr 1.43 tkl 3.33 blk 0.02 save 1.48 drb 29.55 stSp 2.40
stamina     GF 1.05 GA 0.97 xG 0.67 shots 4.64 conv 22.1% comp 74.9% spill 2.13 hdr 1.46 tkl 3.08 blk 0.03 save 1.43 drb 29.03 stSp 1.73
reflexes    GF 0.94 GA 0.62 xG 0.57 shots 3.99 conv 23.4% comp 74.4% spill 1.97 hdr 1.57 tkl 2.72 blk 0.01 save 2.13 drb 26.52 stSp 2.41
positioning GF 1.00 GA 0.93 xG 0.66 shots 4.41 conv 22.7% comp 75.3% spill 1.96 hdr 1.44 tkl 2.79 blk 0.02 save 1.38 drb 29.27 stSp 2.39

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "node --import tsx --input-type=module -e 'import { Match } from \"./src/sim/Match.ts\"; import { GENE_KEYS } from \"./src/evolution/genome.ts\"; import { ATTR_KEYS } from \"./src/evolution/playerGenome.ts\"; import { TEAM_SIZE } from \"./src/sim/types.ts\"; console.log(ATTR_KEYS); const genome=()=>Object.fromEntries(GENE_KEYS.map(k=>[k,0.5])); const squad=v=>Array.from({length:TEAM_SIZE},()=>Object.fromEntries(ATTR_KEYS.map(k=>[k,k===\"positioning\"?v:0.5]))); const info=(v,tag)=>({id:tag,name:tag,short:tag,colors:{primary:0xff0000,secondary:0xffffff},playerNames:Array.from({length:TEAM_SIZE},(_,i)=>"'`P${i}`),genome:genome(),squad:squad(v)}); let gf=0,ga=0,sp=0,hiPass=0,hiComp=0,n=0; for(let seed=1;seed<=60;seed++)for(const rev of [false,true]){const hiSide=rev?1:0,m=new Match({seed:71000+seed*37,teamA:rev?info(.05,"LO"):info(.95,"HI"),teamB:rev?info(.95,"HI"):info(.05,"LO"),duration:120}),r=m.runToCompletion(),hs=r.stats[hiSide],os=r.stats[1-hiSide];gf+=hs.goals;ga+=os.goals;sp+=hs.miscontrols;hiPass+=hs.passes;hiComp+=hs.passesCompleted;n++;} console.log({gf:gf/n,ga:ga/n,spills:sp/n,completion:hiComp/hiPass});'"'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 4002ms:[0m
[
  [32m'pace'[39m,
  [32m'passing'[39m,
  [32m'dribbling'[39m,
  [32m'finishing'[39m,
  [32m'defending'[39m,
  [32m'strength'[39m,
  [32m'stamina'[39m,
  [32m'reflexes'[39m,
  [32m'positioning'[39m
]
{
  gf: [33m1.025[39m,
  ga: [33m1.0083333333333333[39m,
  spills: [33m2.1666666666666665[39m,
  completion: [33m0.7553719008264462[39m
}

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg -n 'enforceBudget|squadTotal|mutateSquad|crossoverSquads|developPlayer|newgenFromBloodline|computeFitness' src/sim/League.ts src/evolution; nl -ba src/evolution/fitness.ts | sed -n '1,180p'; nl -ba src/sim/League.ts | sed -n '880,940p'; nl -ba src/sim/League.ts | sed -n '1510,1570p'; nl -ba src/sim/League.ts | sed -n '1760,1800p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
src/evolution/evolve.ts:8:import { crossoverSquads, enforceBudget } from './playerGenome';
src/evolution/evolve.ts:250:      f.squad = enforceBudget(crossoverSquads(pa.squad, pb.squad, rng));
src/sim/League.ts:9:  developPlayer, emptyCareer, retireChance, rookieAge, veteranAge,
src/sim/League.ts:19:import { computeFitness, type FitnessBreakdown } from '../evolution/fitness';
src/sim/League.ts:26:  ATTR_KEYS, SQUAD_BUDGET, SQUAD_ROLES, countsForBudget, enforceBudget, newgenFromBloodline,
src/sim/League.ts:27:  randomPlayer, randomSquad, squadSummary, squadTotal, type AttrKey,
src/sim/League.ts:720:      computeFitness(this.division(d).map((f) => ({ slot: f.slot, agg: this.agg[f.slot] })));
src/sim/League.ts:892:        f.squad[i] = developPlayer(f.squad[i], f.ages[i], ageRng);
src/sim/League.ts:912:          // not reflexes) so headroom = cap − used + freed stays in squadTotal's
src/sim/League.ts:917:          const headroom = SQUAD_BUDGET - squadTotal(f.squad) + retireeTotal;
src/sim/League.ts:953:          f.squad[i] = newgenFromBloodline(f.squad[i], ageRng, f.coach.genome.jockeyBias ?? 0.5);
src/sim/League.ts:961:      f.squad = enforceBudget(f.squad);
src/sim/League.ts:1307:    // intermediate step (v17→v18) calls enforceBudget → squadTotal sums every
src/sim/League.ts:1556:        f.squad = enforceBudget(f.squad);
src/sim/League.ts:1782:      for (const f of data.franchises as Franchise[]) f.squad = enforceBudget(f.squad);
src/evolution/playerGenome.ts:25: *              DEAD stat, so `squadTotal` no longer charges them for it
src/evolution/playerGenome.ts:26: *              (Phase-120 engine-input cleanup — see squadTotal below).
src/evolution/playerGenome.ts:99:export function mutateSquad(squad: PlayerAttributes[], rng: Rng, opts: SquadMutateOptions = {}): PlayerAttributes[] {
src/evolution/playerGenome.ts:116:export function crossoverSquads(a: PlayerAttributes[], b: PlayerAttributes[], rng: Rng): PlayerAttributes[] {
src/evolution/playerGenome.ts:164: * exist and still get scaled by enforceBudget — they just ride along free, so
src/evolution/playerGenome.ts:172:export function squadTotal(squad: PlayerAttributes[]): number {
src/evolution/playerGenome.ts:184:export function enforceBudget(squad: PlayerAttributes[]): PlayerAttributes[] {
src/evolution/playerGenome.ts:185:  const total = squadTotal(squad);
src/evolution/playerGenome.ts:213:export function newgenFromBloodline(
src/evolution/franchise.ts:7:import { ROSTER_ROLES, enforceBudget, randomSquad, type PlayerAttributes } from './playerGenome';
src/evolution/franchise.ts:94:    squad: enforceBudget(randomSquad(rng)),
src/evolution/fitness.ts:89:export function computeFitness(rows: Array<{ slot: number; agg: SeasonAggregates }>): FitnessBreakdown[] {
src/evolution/careers.ts:82:export function developPlayer(p: PlayerAttributes, age: number, rng: Rng): PlayerAttributes {
src/evolution/playerStyle.ts:63:/** Position-wise crossover for reborn squads — mirrors crossoverSquads'
     1	import { clamp01, mean, stddev } from '../utils/math';
     2	import type { SeasonAggregates } from './franchise';
     3	
     4	/**
     5	 * Results-dominant fitness (Phase 50 — the emergence pivot's selection
     6	 * slimming). The pre-50 mix paid THREE uniform virtues — pass completion,
     7	 * recoveries, stamina efficiency — which rewarded every club for playing the
     8	 * SAME texture (possession + pressing + economy): a hidden convergence
     9	 * pressure, and `recoveries` directly fed the press-inflation equilibrium
    10	 * (evo-drift press → 0.75-0.94). WINNING is the selector now; HOW you win is
    11	 * style, and style is priced only for being consistently ITSELF:
    12	 *
    13	 *   points            0.50  — league performance (the selector)
    14	 *   goal difference   0.25  — margin quality (smooth gradient between equals)
    15	 *   shot quality      0.10  — avg xG per shot: a forward-looking tiebreaker,
    16	 *                             kept small (it is mildly virtue-flavored)
    17	 *   style consistency 0.15  — plays the same identifiable way every match
    18	 *                             (style-NEUTRAL: rewards having an identity,
    19	 *                             never which identity)
    20	 *
    21	 * Every component is min-max normalized across the group (weights sum to 1).
    22	 */
    23	export interface FitnessComponents {
    24	  points: number;
    25	  goalDiff: number;
    26	  shotQuality: number;
    27	  styleConsistency: number;
    28	}
    29	
    30	export interface FitnessBreakdown {
    31	  slot: number;
    32	  total: number;
    33	  components: FitnessComponents;
    34	}
    35	
    36	export const FITNESS_WEIGHTS: FitnessComponents = {
    37	  points: 0.5,
    38	  goalDiff: 0.25,
    39	  shotQuality: 0.1,
    40	  styleConsistency: 0.15,
    41	};
    42	
    43	/**
    44	 * THE CONCEDED-GOALS ANCHOR (Phase 95 — the pre-authorized red-queen
    45	 * fallback). Every other component is min-max normalized WITHIN the season,
    46	 * so a league that inflates together loses nothing: dive-in can win relative
    47	 * points while goals-per-match climbs past 6 (phases 88/92/94 — observed
    48	 * three times). This term is deliberately ABSOLUTE: λ · GA/match, raw scale,
    49	 * never normalized — so the price of conceding grows exactly when the
    50	 * league's defensive collapse grows, and a club that keeps its net clean is
    51	 * worth more than its relative rank alone says. This is a knowing dent in
    52	 * the phase-50 "fitness = pure results" purity: a modest, single, defensive
    53	 * virtue term — the least λ that stabilizes the late-gen goals curve.
    54	 * Swept {0.05, 0.1, 0.2} on world 424242 (the worst inflator, λ=0 late
    55	 * mean 6.72 rising): 0.05 → 5.33 FLAT with jockey adopted 0.85; 0.1 →
    56	 * 5.22 still rising, jockey 0.48; 0.2 → 6.44, jockey 0.23 under an
    57	 * extreme-press ecology (the anchor drowning the points signal buys
    58	 * chaos, not defense).
    59	 *
    60	 * ⚰ KILLED at λ=0 (user ratification, 2026-07-18 morning): the 3-world
    61	 * verdict refuted generality — it stabilized only the sweep world (991
    62	 * 5.62, 777 7.44 WITH containment adopted). The mechanism + the sweep
    63	 * probe (`anchor-sweep.ts`) stay as lab instruments; the chosen fix for
    64	 * the inflation engine (the xg/shot proximity climb) is IN-ECOLOGY
    65	 * instead: the keeper rush-out (Phase 103). Fitness is pure results
    66	 * again.
    67	 */
    68	export const FITNESS_ANCHOR = {
    69	  conceded: 0,
    70	};
    71	
    72	function minMax(values: number[]): number[] {
    73	  const lo = Math.min(...values);
    74	  const hi = Math.max(...values);
    75	  if (hi - lo < 1e-9) return values.map(() => 0.5);
    76	  return values.map((v) => (v - lo) / (hi - lo));
    77	}
    78	
    79	/** Coefficient-of-variation based consistency: 1 = identical style every match. */
    80	function styleConsistencyOf(agg: SeasonAggregates): number {
    81	  const s = agg.styleSamples;
    82	  if (s.length < 2) return 0.5;
    83	  const passVols = s.map((x) => x.passVol);
    84	  const pressVols = s.map((x) => x.pressVol);
    85	  const cv = (xs: number[]) => stddev(xs) / (Math.abs(mean(xs)) + 1e-6);
    86	  return clamp01(1 - (cv(passVols) + cv(pressVols)) / 2);
    87	}
    88	
    89	export function computeFitness(rows: Array<{ slot: number; agg: SeasonAggregates }>): FitnessBreakdown[] {
    90	  const raw = {
    91	    points: rows.map((r) => r.agg.pts),
    92	    goalDiff: rows.map((r) => r.agg.gf - r.agg.ga),
    93	    shotQuality: rows.map((r) => r.agg.xg / Math.max(r.agg.shots, 1)),
    94	    styleConsistency: rows.map((r) => styleConsistencyOf(r.agg)),
    95	  };
    96	
    97	  const norm: Record<keyof FitnessComponents, number[]> = {
    98	    points: minMax(raw.points),
    99	    goalDiff: minMax(raw.goalDiff),
   100	    shotQuality: minMax(raw.shotQuality),
   101	    styleConsistency: minMax(raw.styleConsistency),
   102	  };
   103	
   104	  return rows.map((r, i) => {
   105	    const components = {
   106	      points: norm.points[i],
   107	      goalDiff: norm.goalDiff[i],
   108	      shotQuality: norm.shotQuality[i],
   109	      styleConsistency: norm.styleConsistency[i],
   110	    };
   111	    let total = 0;
   112	    for (const k of Object.keys(components) as Array<keyof FitnessComponents>) {
   113	      total += components[k] * FITNESS_WEIGHTS[k];
   114	    }
   115	    total -= FITNESS_ANCHOR.conceded * (r.agg.ga / Math.max(r.agg.played, 1));
   116	    return { slot: r.slot, total, components };
   117	  });
   118	}
   880	
   881	    // Careers pass (Phase 26): everyone still at their club ages a year,
   882	    // develops along the age curve, and may retire — replaced by a newgen.
   883	    // Reborn squads are brand-new people and sit this generation out.
   884	    const rebornSlots = new Set(entries.filter((e) => e.kind === 'reborn').map((e) => e.slot));
   885	    const ageRng = new Rng(hashSeed(this.seed, this.generation, 0xa9));
   886	    const retirements: RetirementEntry[] = [];
   887	    const signings: NonNullable<SeasonRecord['signings']> = [];
   888	    for (const f of this.franchises) {
   889	      if (rebornSlots.has(f.slot)) continue;
   890	      for (let i = 0; i < f.squad.length; i++) {
   891	        f.ages[i]++;
   892	        f.squad[i] = developPlayer(f.squad[i], f.ages[i], ageRng);
   893	        if (ageRng.chance(retireChance(f.ages[i]))) {
   894	          const career = f.careers[i];
   895	          retirements.push({
   896	            name: f.playerNames[i] ?? ROSTER_ROLES[i],
   897	            team: f.name,
   898	            role: ROSTER_ROLES[i],
   899	            age: f.ages[i],
   900	            seasons: career.seasons,
   901	            goals: career.goals,
   902	            saves: career.saves,
   903	          });
   904	          this.recordLegend(f, i, career);
   905	          // The FIRE-SALE window (Phase 55): a retirement is the one natural
   906	          // vacancy. The board signs the market's best like-for-like ONLY
   907	          // when he clearly beats the academy option (the newgen would be
   908	          // ≈ the retiree's profile) AND fits under the budget without
   909	          // taxing the rest of the squad. Otherwise: academy as always.
   910	          // Budget currency (Phase-120 position-aware): sum only the attrs that
   911	          // cost budget for THIS slot (GK: not finishing/defending; outfield:
   912	          // not reflexes) so headroom = cap − used + freed stays in squadTotal's
   913	          // units.
   914	          const retireeTotal = ATTR_KEYS.reduce(
   915	            (a, k) => (countsForBudget(k, i === 0) ? a + f.squad[i][k] : a), 0,
   916	          );
   917	          const headroom = SQUAD_BUDGET - squadTotal(f.squad) + retireeTotal;
   918	          // Style fit as a MARKET SIGNAL (Phase 80, N6): the board weighs a
   919	          // candidate's appetites against the retiree's — the club's evolved
   920	          // bloodline for the slot — by its OWN fitBias gene. Eligibility
   921	          // (beats the academy, fits the budget) is unchanged; only the
   922	          // ranking among eligibles moves. 1.2 = a perfect fit is worth up
   923	          // to ~1.2 ability points to an all-in system board.
   924	          const retireeStyle = { ...f.squadStyles[i] };
   925	          const fitW = (f.coach.genome.fitBias ?? 0.5) * 1.2;
   926	          const score = (x: FreeAgent): number => agentTotal(x) + fitW * styleFit(x.style, retireeStyle);
   927	          const agent = this.freeAgents
   928	            .filter((x) =>
   929	              x.role === ROSTER_ROLES[i] && x.age <= FREE_AGENT_MAX_AGE &&
   930	              // No two men on one sheet share a nameplate (latent Phase-55
   931	              // bug surfaced by Phase 80's RNG shift): identity — bodies,
   932	              // styles, careers — is name-keyed on the roster.
   933	              !f.playerNames.includes(x.name) &&
   934	              agentTotal(x) > retireeTotal + 0.2 && agentTotal(x) <= headroom + 1e-9)
   935	            .sort((a, b) => score(b) - score(a) || a.age - b.age || a.name.localeCompare(b.name))[0];
   936	          if (agent) {
   937	            this.freeAgents = this.freeAgents.filter((x) => x !== agent);
   938	            f.playerNames[i] = agent.name;
   939	            f.squad[i] = { ...agent.attrs };
   940	            f.squadStyles[i] = { ...agent.style };
  1510	          rng,
  1511	          f.genome,
  1512	          { ...defaultPolicyGenes(), ...f.policy },
  1513	          f.style ?? deriveTeamStyle(f.genome),
  1514	        );
  1515	        delete f.genome;
  1516	        delete f.policy;
  1517	        delete f.style;
  1518	      }
  1519	      data.version = 15;
  1520	    }
  1521	    if (data.version === 15) {
  1522	      // v15 -> v16: per-player decision styles (Phase 54). Everyone loads
  1523	      // NEUTRAL (×1.0 — the coach's policy verbatim, bit-identical play);
  1524	      // divergence is earned through the academy from here.
  1525	      for (const f of data.franchises as Array<{ squad: unknown[]; squadStyles?: unknown[] }>) {
  1526	        f.squadStyles ??= neutralSquadStyles(f.squad.length);
  1527	      }
  1528	      data.version = 16;
  1529	    }
  1530	    if (data.version === 16) {
  1531	      // v16 -> v17: the free-agent fire-sale (Phase 55). The market opens
  1532	      // EMPTY — no fabricated ex-players; the first club death fills it.
  1533	      data.freeAgents ??= [];
  1534	      data.version = 17;
  1535	    }
  1536	    if (data.version === 17) {
  1537	      // v17 -> v18: the BENCH (Phase 61, N2). Every club signs three
  1538	      // substitutes — role-biased veterans appended after the starting six,
  1539	      // exactly what founding rolls (length-guarded like v7→v8: franchises
  1540	      // minted mid-chain by current-shape creators already carry nine).
  1541	      // The rotation gene backfills NEUTRAL (0.5) everywhere a genome is
  1542	      // stored — live coaches, the unemployed pool, and history snapshots
  1543	      // (the ceremony radar and the gene sparklines read those).
  1544	      const rng = new Rng(hashSeed(Number(data.seed), 0xbe));
  1545	      for (const f of data.franchises as Franchise[]) {
  1546	        while (f.squad.length < ROSTER_SIZE) {
  1547	          f.squad.push(randomPlayer(rng, ROSTER_ROLES[f.squad.length]));
  1548	          f.playerNames.push(newgenName(rng, f.playerNames));
  1549	          f.ages.push(veteranAge(rng));
  1550	          f.careers.push(emptyCareer());
  1551	          f.squadStyles.push(...neutralSquadStyles(1));
  1552	        }
  1553	        // Budget headroom: the cap grew 24 → 36 with the roster (same
  1554	        // per-player density), so a migrated 24-cap squad plus three
  1555	        // founding-strength subs (~34) fits without a shave.
  1556	        f.squad = enforceBudget(f.squad);
  1557	      }
  1558	      const fixGenome = (g: TacticalGenome | undefined): void => {
  1559	        if (g) g.rotationBias ??= 0.5;
  1560	      };
  1561	      for (const f of data.franchises as Franchise[]) fixGenome(f.coach.genome);
  1562	      for (const e of (data.coachPool ?? []) as PoolEntry[]) fixGenome(e.coach.genome);
  1563	      for (const r of ((data.history ?? []) as SeasonRecord[])) {
  1564	        if (r.geneMeans) (r.geneMeans as Record<string, number>).rotationBias ??= 0.5;
  1565	        for (const e of r.evolution?.entries ?? []) {
  1566	          fixGenome(e.childGenome);
  1567	          if (e.parentGenomes) e.parentGenomes.forEach(fixGenome);
  1568	        }
  1569	      }
  1570	      // Mid-season counters grow bench rows; apps backfill from the table —
  1760	      for (const f of data.franchises as Array<Record<string, unknown>>) {
  1761	        f.injuries ??= (f.squad as unknown[]).map(() => 0);
  1762	      }
  1763	      data.version = 30;
  1764	    }
  1765	    if (data.version === 30) {
  1766	      // v30 -> v31: budget-allocation snapshots on styleMatrix rows
  1767	      // (Phase 118.5). Optional, UI-guarded — nothing to backfill.
  1768	      data.version = 31;
  1769	    }
  1770	    if (data.version === 31) {
  1771	      // v31 -> v32: the POSITIONING attribute (Phase 119j). The squad/free-agent
  1772	      // backfill already ran at the TOP of the chain (it must precede the
  1773	      // v17→v18 budget pass); nothing left to do here but advance the version.
  1774	      data.version = 32;
  1775	    }
  1776	    if (data.version === 32) {
  1777	      // v32 -> v33: the budget went POSITION-AWARE (Phase-120) — reflexes is
  1778	      // keeper-only, finishing/defending are free for the keeper — and the cap
  1779	      // dropped 40.5 → 35.5 in lockstep. Squads built under the old cap can now
  1780	      // sit over 35.5, so re-enforce the budget once on load; season-end
  1781	      // (applyResult) does it every year thereafter.
  1782	      for (const f of data.franchises as Franchise[]) f.squad = enforceBudget(f.squad);
  1783	      data.version = 33;
  1784	    }
  1785	    if (data.version !== SAVE_VERSION) throw new Error(`Unsupported save version: ${String(data.version)}`);
  1786	    const lg = Object.create(League.prototype) as League;
  1787	    Object.assign(lg, {
  1788	      seed: data.seed,
  1789	      generation: data.generation,
  1790	      matchDuration: data.matchDuration,
  1791	      promotionMode: data.promotionMode ?? 'auto',
  1792	      // Pre-Phase-22 saves keep the behavior they were built with.
  1793	      cupDrawMode: data.cupDrawMode ?? 'underdog',
  1794	      franchises: data.franchises,
  1795	      fixtures: data.fixtures,
  1796	      cursor: data.cursor,
  1797	      table: data.table,
  1798	      agg: data.agg,
  1799	      playerAgg: data.playerAgg,
  1800	      history: data.history,

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/evolution/evolve.ts | sed -n '200,280p'; rg -n 'mutateSquad\\(' src tests scripts | head -50; rg -n 'developPlayer\\(|enforceBudget\\(' src/sim/League.ts | head -50"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
   200	      entries.push({
   201	        slot: f.slot, name: f.name, kind: 'mutated', fitness,
   202	        drift: geneDistance(before, coach.genome), note: styleNote,
   203	      });
   204	    } else {
   205	      const pa = pickParent();
   206	      const pb = pickParent(pa);
   207	      const before = f.coach.genome;
   208	      // The dying club's manager is out of a job — the League routes him to
   209	      // the unemployed pool (the memetic channel's supply side, Phase 53) —
   210	      // and the squad hits the fire-sale (the player-gene channel, Phase 55).
   211	      plan.firedCoaches?.push(f.coach);
   212	      plan.firedSquads?.push({
   213	        club: f.name,
   214	        names: [...f.playerNames],
   215	        squad: f.squad.map((p) => ({ ...p })),
   216	        styles: f.squadStyles.map((s) => ({ ...s })),
   217	        ages: [...f.ages],
   218	        careers: f.careers.map((c) => ({ ...c })),
   219	      });
   220	      const genome = mutateGenome(
   221	        crossoverGenomes(pa.coach.genome, pb.coach.genome, rng), rng, { rate: 0.5, scale: 0.15 },
   222	      );
   223	      // The new philosophy blends both parents' styles, then mutates harder
   224	      // (Phase 42) — and it arrives EMBODIED (Phase 53): the reborn club
   225	      // hires a newgen coach schooled by the dominant parent's manager (the
   226	      // mentor tree).
   227	      const policy = mutatePolicyGenes(
   228	        crossoverPolicyGenes(pa.coach.policy, pb.coach.policy, rng), rng, { rate: 0.5, scale: 0.15 },
   229	      );
   230	      // Formations are the philosophy's shape (Phase 31): the newborn
   231	      // philosophy INHERITS its tactical identity from the dominant parent —
   232	      // the dynasty's shape survives the rebirth. The zonal budget applies
   233	      // to inheritance too: this was THE compounding channel (zonal elite
   234	      // win → parent the reborn → zonal multiplies).
   235	      const wasZonal = f.coach.style.scheme === 'zonal';
   236	      const style: TeamStyle = { ...pa.coach.style };
   237	      if (style.scheme === 'zonal' && !wasZonal) {
   238	        if (plan.zonal && plan.zonal.room > 0) plan.zonal.room -= 1;
   239	        else style.scheme = 'man';
   240	      } else if (wasZonal && style.scheme !== 'zonal' && plan.zonal) {
   241	        plan.zonal.room += 1;
   242	      }
   243	      f.coach = createCoach(rng, genome, policy, style, {
   244	        age: rookieCoachAge(rng),
   245	        mentor: pa.coach.name,
   246	      });
   247	      // The academy intake: attributes cross over from both parents' squads,
   248	      // but the players themselves are NEW — young, unnamed, blank careers.
   249	      // Budget-enforced (Phase 48): two rich parents can't compound past the cap.
   250	      f.squad = enforceBudget(crossoverSquads(pa.squad, pb.squad, rng));
   251	      // Personal styles cross the same way (Phase 54) — the newborn academy
   252	      // inherits both parents' decision temperaments, slot by slot.
   253	      f.squadStyles = crossoverSquadStyles(pa.squadStyles, pb.squadStyles, rng);
   254	      f.ages = f.squad.map(() => rookieAge(rng) + rng.int(0, 5)); // 17–24
   255	      f.careers = f.squad.map(() => emptyCareer());
   256	      const oldName = f.name;
   257	      takenNames.delete(oldName);
   258	      f.name = uniqueTeamName(rng, takenNames);
   259	      f.short = shortName(f.name);
   260	      f.playerNames = generatePlayerNames(rng);
   261	      f.id = `T${f.slot}-g${nextGen}`;
   262	      f.elo = 1500; // a new project starts from scratch
   263	      f.lineage.push({
   264	        generation: nextGen,
   265	        event: 'reborn',
   266	        parents: [pa.name, pb.name],
   267	        fitness,
   268	        note: `was ${oldName}`,
   269	      });
   270	      entries.push({
   271	        slot: f.slot,
   272	        name: f.name,
   273	        kind: 'reborn',
   274	        parents: [pa.name, pb.name],
   275	        fitness,
   276	        drift: geneDistance(before, f.coach.genome),
   277	        oldName,
   278	        coach: f.coach.name,
   279	        parentGenomes: [{ ...pa.coach.genome }, { ...pb.coach.genome }],
   280	        childGenome: { ...f.coach.genome },
tests/playerGenome.test.ts:36:    const a = mutateSquad(squad, new Rng(9));
tests/playerGenome.test.ts:37:    const b = mutateSquad(squad, new Rng(9));
src/evolution/playerGenome.ts:99:export function mutateSquad(squad: PlayerAttributes[], rng: Rng, opts: SquadMutateOptions = {}): PlayerAttributes[] {
892:        f.squad[i] = developPlayer(f.squad[i], f.ages[i], ageRng);
961:      f.squad = enforceBudget(f.squad);
1556:        f.squad = enforceBudget(f.squad);
1782:      for (const f of data.franchises as Franchise[]) f.squad = enforceBudget(f.squad);

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg -n 'AI_INTERVAL|TEAM_AI_INTERVAL|TURN_RATE|SHOT_SPEED|PLAYER_MIN_DIST|CONTROL_RADIUS|CAPTURE|tryCapture|giveBall' src/sim/constants.ts src/sim/Match.ts src/sim/Player.ts; nl -ba src/sim/constants.ts | sed -n '1,240p'; nl -ba src/sim/Match.ts | sed -n '400,440p'; nl -ba src/sim/Match.ts | sed -n '720,880p'; nl -ba src/sim/Match.ts | sed -n '1760,1860p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
src/sim/Player.ts:17:export const TURN_RATE = 6.5;
src/sim/Player.ts:275:    // that, the movement direction — capped at TURN_RATE either way.
src/sim/Player.ts:279:      turnCos = Math.cos(TURN_RATE * dt);
src/sim/Player.ts:280:      turnSin = Math.sin(TURN_RATE * dt);
src/sim/Match.ts:11:  AI_INTERVAL, BALL_BOUNCE, BALL_FRICTION_K, BOUNCE_DAMP, BOUNCE_MIN_VZ, BOX_DEPTH, BOX_WIDTH,
src/sim/Match.ts:12:  CONTACT_BLIND_PEN, CONTROL_MAX_HEIGHT, CONTROL_MAX_SPEED, CONTROL_RADIUS, CORNER_CLEARANCE,
src/sim/Match.ts:16:  PENALTY_CLEARANCE, PENALTY_SPOT_DIST, PLAYER_MIN_DIST, RESTART_CLEARANCE, RESTART_MIN_SETUP,
src/sim/Match.ts:17:  RESTART_TIMEOUT, STOPPAGE_MAX, TEAM_AI_INTERVAL, TOUCH_CONTROL_DIST,
src/sim/Match.ts:55:   * the ball reaches the flagged target (giveBall or a won header) —
src/sim/Match.ts:295:    this.allPlayers.forEach((p) => (p.decisionTimer = ((p.index % TEAM_SIZE) + 1) * (AI_INTERVAL / TEAM_SIZE)));
src/sim/Match.ts:414:        team.brainTimer = TEAM_AI_INTERVAL;
src/sim/Match.ts:427:        p.decisionTimer = AI_INTERVAL;
src/sim/Match.ts:711:  giveBall(p: Player): void {
src/sim/Match.ts:753:    // gate covers every hands entry that funnels through giveBall — the loose
src/sim/Match.ts:754:    // capture (tryCapture) and the high claim (tryAerial).
src/sim/Match.ts:1006:    this.tryCapture();
src/sim/Match.ts:1753:      this.giveBall(taker);
src/sim/Match.ts:1754:      taker.decisionTimer = 0.12; // kick promptly (giveBall's settle is for open play)
src/sim/Match.ts:1758:  private tryCapture(): void {
src/sim/Match.ts:1780:      if (dx >= CONTROL_RADIUS || dx <= -CONTROL_RADIUS) continue;
src/sim/Match.ts:1782:      if (dy >= CONTROL_RADIUS || dy <= -CONTROL_RADIUS) continue;
src/sim/Match.ts:1784:      if (d >= CONTROL_RADIUS) continue;
src/sim/Match.ts:1842:      if (mech.attemptFirstTouch(this, best)) this.giveBall(best);
src/sim/Match.ts:1861:        // round-to-nearest, so |dx| or |dy| ≥ PLAYER_MIN_DIST guarantees the
src/sim/Match.ts:1864:        if (dx >= PLAYER_MIN_DIST || dx <= -PLAYER_MIN_DIST) continue;
src/sim/Match.ts:1866:        if (dy >= PLAYER_MIN_DIST || dy <= -PLAYER_MIN_DIST) continue;
src/sim/Match.ts:1868:        if (d >= PLAYER_MIN_DIST) continue;
src/sim/Match.ts:1875:        const k = (PLAYER_MIN_DIST - d) / 2;
src/sim/constants.ts:89: * The same seeing-the-ball principle at the CAPTURE contact (Phase 59):
src/sim/constants.ts:185:export const CONTROL_RADIUS = 1.25;
src/sim/constants.ts:190: * Faster balls (hard passes, not shots — SHOT_SPEED is 27) can still be
src/sim/constants.ts:235:export const AI_INTERVAL = 0.15;
src/sim/constants.ts:237:export const TEAM_AI_INTERVAL = 0.4;
src/sim/constants.ts:239:export const SHOT_SPEED = 27;
src/sim/constants.ts:241:export const PLAYER_MIN_DIST = 1.05;
     1	/** All simulation units are meters / seconds. Coordinates: origin at pitch
     2	 * center, +x toward the right goal, +y downward on screen. Team 0 attacks +x,
     3	 * team 1 attacks -x (no side swap at half time — keeps formation math simple).
     4	 *
     5	 * Boundaries are real (Phase 14): a ball over the touchline is a kick-in,
     6	 * over the goal line a corner or goal kick. Restarts are live dead-ball
     7	 * phases — the clock runs while the taker walks over and defenders reshape.
     8	 */
     9	/** Probe/dev knob (2026-07-20): scale the PLAYING-FIELD geometry to test 6v6
    10	 * DENSITY (players per area). Physical sizes (player/ball/control radius/touch
    11	 * distances/goal) stay FIXED, so a scale < 1 packs the same 12 players into a
    12	 * smaller field = higher density. Default 1.0 = no change (tests + ship
    13	 * unaffected). Set PITCH_SCALE in the coordinated-density probe. NB: the fixed
    14	 * formation tables use ABSOLUTE coords and do NOT rescale — density runs must
    15	 * pair with EMERGENT_POS=1 (emergent stations are fractional, so they fit). */
    16	export const PITCH_SCALE = (() => {
    17	  const v = typeof process !== 'undefined' && process.env ? Number(process.env.PITCH_SCALE) : NaN;
    18	  // DEFAULT 0.70 (2026-07-20 density相变, probe sweet spot: 213 m²/player —
    19	  // cutbacks +145%, shape sharper, clumping down, scramble still ~6%; 0.55
    20	  // tips into 乱抢). Override via env for probes (PITCH_SCALE=1 = the old pitch).
    21	  return Number.isFinite(v) && v > 0 ? v : 0.7;
    22	})();
    23	export const PITCH_LENGTH = 90 * PITCH_SCALE;
    24	export const PITCH_WIDTH = 58 * PITCH_SCALE;
    25	export const HALF_L = PITCH_LENGTH / 2;
    26	export const HALF_W = PITCH_WIDTH / 2;
    27	
    28	/** A ball over the GOAL line (a wide or over-the-bar shot) coasts this long
    29	 * before its corner / goal-kick is awarded (Phase 41.1) — it reads as sailing
    30	 * OUT, not vanishing the instant it crosses. Goal-line only; touchline kick-ins
    31	 * stay instant. Goal detection runs first and is frozen out during the coast,
    32	 * so a wide ball drifting behind the line can never register a phantom goal. */
    33	export const OUT_PLAY_COAST = 0.5;
    34	
    35	export const GOAL_WIDTH = 7 * PITCH_SCALE;
    36	export const GOAL_DEPTH = 2.2;
    37	/** Crossbar height (m) — a ball crossing the goal line above this is OVER the bar. */
    38	export const GOAL_HEIGHT = 2.44;
    39	export const BOX_DEPTH = 13 * PITCH_SCALE;
    40	export const BOX_WIDTH = 28 * PITCH_SCALE;
    41	export const CENTER_CIRCLE_R = 7 * PITCH_SCALE;
    42	
    43	/** Fixed simulation timestep (s). */
    44	export const DT = 1 / 60;
    45	/** Default full match duration in sim-seconds (2 halves). Display clock maps this to 90'. */
    46	export const MATCH_DURATION = 240;
    47	/**
    48	 * Max sim-seconds a half runs past its nominal end waiting for a safe break
    49	 * (Phase 27.4 stoppage time) — ≈3 added display minutes on the 90' clock.
    50	 */
    51	export const STOPPAGE_MAX = 8;
    52	
    53	/** Ball exponential velocity decay per second: v *= exp(-K * dt). */
    54	export const BALL_FRICTION_K = 0.55;
    55	
    56	/* ---- The energy economy (Phase 58 — it BINDS now) ---- */
    57	/**
    58	 * The N1 matrix probe found the meta uncounterable and the phase-58
    59	 * diagnostic found out why nothing tires it: full-time stamina sat at
    60	 * 0.98-0.99 (recovery 0.014/s dwarfed drain 0.006·e²/s), so every payoff
    61	 * built on fatigue — the stamina attribute, staminaConservation's
    62	 * "fresher legs late", the tired-legs brain gate — was dead. Repriced so
    63	 * a match SPENDS legs: sustained sprinters finish ~0.6-0.8, patient
    64	 * sides ~0.9. Sweep + gates in the phase-58 ledger entry.
    65	 */
    66	export const STAMINA_DRAIN = 0.01;
    67	export const STAMINA_RECOVERY = 0.009;
    68	/**
    69	 * A tackle lunge is a burst the movement integral never saw (the lunge is
    70	 * instantaneous): each attempt — win or whiff — costs a flat chunk,
    71	 * scaled by the same per-player drain modifiers. Aggressive markers
    72	 * attempt ~2× a patient side's volume (probe: 9.4 vs 5.2 WON tackles),
    73	 * so relentless pressing now buys its late-game price.
    74	 */
    75	export const TACKLE_LUNGE_COST = 0.02;
    76	
    77	/**
    78	 * Blind-side deflection penalty (Phase 59, N1.5 lever 2): you can only
    79	 * stick a leg on a drilled ball you SEE. The cutback anatomy probe found
    80	 * ~60% of pull-backs dying in flight to legs with NO facing check — a
    81	 * defender retreating goalward deflected the ball zipping behind his heels
    82	 * at the same odds as a set, facing interceptor, which re-sealed the very
    83	 * arc the collapsed block cedes. Fully blind ⇒ deflection odds ×(1−this);
    84	 * facing ⇒ unchanged. Buffs every DRILLED delivery (cutbacks, driven
    85	 * switches, hard through balls) against unset bodies only.
    86	 */
    87	export const DEFLECT_BLIND_PEN = 0.75;
    88	/**
    89	 * The same seeing-the-ball principle at the CAPTURE contact (Phase 59):
    90	 * the anatomy probe's kill telemetry showed pull-back flights dying 7:1 to
    91	 * the full-capture branch, not the deflection stretch — friction decays a
    92	 * 19 m/s cutback under CONTROL_MAX_SPEED mid-flight, and every bystander
    93	 * within 1.25m then got an UNCONDITIONAL touch (a failed control still
    94	 * squirts the ball = the pass dies either way). Now a bystander must
    95	 * REACT to a live pass rolling past: contact odds fall with ball speed
    96	 * and blind-side arrival; the INTENDED receiver is set for it (exempt),
    97	 * dead/loose scrambles (no pass in flight) keep the old physics.
    98	 */
    99	export const CONTACT_BLIND_PEN = 0.7;
   100	/**
   101	 * The UNSET WALL (Phase 60, N1.5 lever 3): a body on the shot corridor
   102	 * only blocks in FULL when it is set (still) and facing the strike. The
   103	 * cutback anatomy measured 38-50% of delivered pull-backs arriving with a
   104	 * "blocked" corridor whose bodies were 64-83% UNSET — sprinting goalward
   105	 * or blind — and both the shoot decision (laneBlockers-suppressed appetite)
   106	 * and the block physics treated them as a set wall, so the arc arrival
   107	 * recycled instead of striking first-time. Weight per corridor body:
   108	 * this floor + (1−floor)·readiness, readiness = facing · stillness.
   109	 */
   110	export const UNSET_BLOCK_WEIGHT = 0.55;
   111	
   112	/**
   113	 * The MEETABLE cross (Phase 63, the route-one channel): open-play crosses
   114	 * used to lead the target by his FULL velocity × flight — the pre-31.9
   115	 * corner bug alive in open play. Probed (aerial-anatomy): as the delivery
   116	 * dropped into the header band the intended target was a median 8-9m away
   117	 * (header reach is 1.35m) — attacker headers ran 1-10% of crosses and 47%
   118	 * died in defenders' laps on the ground. The delivery now leads a MEETABLE
   119	 * fraction of the run, capped in meters: the crasher keeps his momentum
   120	 * (the running jump IS his duel edge) and covers the difference himself
   121	 * (ReceivePass chases the landing).
   122	 */
   123	export const CROSS_LEAD_FRAC = 0.4;
   124	export const CROSS_LEAD_MAX = 3.5;
   125	
   126	/* ---- The aerial game (Phase 28) ---- */
   127	/** Gravity on the lofted ball (m/s²). Airborne balls fly friction-free. */
   128	export const GRAVITY = 9.81;
   129	/** Vertical restitution on landing: bounce vz = -vz · this. */
   130	export const BALL_BOUNCE = 0.45;
   131	/** Horizontal speed kept per bounce (the turf bites). */
   132	export const BOUNCE_DAMP = 0.72;
   133	/** Landing slower than this vertically just settles into a roll. */
   134	export const BOUNCE_MIN_VZ = 2.2;
   135	/** Above this height a ball can't be trapped or deflected — only headed. */
   136	export const CONTROL_MAX_HEIGHT = 1.3;
   137	/** Header contest window: ball height where outfielders can attack it... */
   138	export const HEADER_MIN_HEIGHT = 1.35;
   139	export const HEADER_MAX_HEIGHT = 2.5;
   140	/** ...standing within this horizontal radius of the ball. */
   141	export const HEADER_RADIUS = 1.35;
   142	/**
   143	 * Chest / thigh trap (Phase 28.6, user report "球在两个球员之间弹来弹去 —
   144	 * 是不是没有胸部停球"): a ball dropping through the LOWER header band that no
   145	 * opponent is contesting can be CUSHIONED to the feet instead of headed.
   146	 * Heading a hanging ball just nods it to the next man — the endless aerial
   147	 * rally. The take-down is priced by technique/first-touch and spills under
   148	 * pressure (a failed trap keeps the scramble). Ceiling below a leaping
   149	 * header (you can't chest a 2m ball); only a descending/apex ball (vz gate);
   150	 * the trapper must be almost under it (tighter than HEADER_RADIUS).
   151	 */
   152	export const CHEST_TRAP_MAX_HEIGHT = 1.7;
   153	export const CHEST_TRAP_RADIUS = 1.05;
   154	/** Above this upward vz the ball is rising too hard to cushion (just bounced/headed up). */
   155	export const CHEST_TRAP_MAX_VZ = 1.5;
   156	/** Keepers can claim high balls up to here (jump + hands). */
   157	export const GK_CLAIM_HEIGHT = 2.55;
   158	/**
   159	 * Opponents are held this far from a keeper holding the ball in their hands
   160	 * (Phase 28.1) — you can't challenge a keeper in possession, so crowding
   161	 * them was pointless harassment that turned every release into a turnover.
   162	 */
   163	export const GK_HOLD_CLEARANCE = 3;
   164	
   165	/** Opponents are held this far from a dead-ball restart spot. */
   166	export const RESTART_CLEARANCE = 6;
   167	/** Corners use the real-law 9.15m (Phase 31.9): the delivery's ascent is
   168	 * inside the header band (z 1.35–2.5) until ~7.8m from the flag, so a
   169	 * sentry camped on the generic 6m edge got a free header at every
   170	 * climbing corner — the silent killer of the whole corner routine. */
   171	export const CORNER_CLEARANCE = 9.15;
   172	/** Penalty spot distance from the goal line — matches the drawn spot (BOX_DEPTH · 0.72). */
   173	export const PENALTY_SPOT_DIST = BOX_DEPTH * 0.72;
   174	/**
   175	 * Everyone except the taker (and the defending keeper, who stands ~9.4m away
   176	 * on the goal line) is held this far from the penalty spot during setup.
   177	 */
   178	export const PENALTY_CLEARANCE = 8;
   179	/** Restart setup: minimum dead-ball time before the kick can be taken... */
   180	export const RESTART_MIN_SETUP = 1.0;
   181	/** ...and a failsafe: after this long the taker kicks from wherever they are. */
   182	export const RESTART_TIMEOUT = 6;
   183	
   184	/** A player controls a free ball inside this radius... */
   185	export const CONTROL_RADIUS = 1.25;
   186	/** ...if it is slower than this (outfield) — keepers can handle faster balls. */
   187	export const CONTROL_MAX_SPEED = 14;
   188	export const GK_CONTROL_MAX_SPEED = 23;
   189	/**
   190	 * Faster balls (hard passes, not shots — SHOT_SPEED is 27) can still be
   191	 * DEFLECTED by a player in their path (Phase 27 lane anticipation).
   192	 */
   193	export const DEFLECT_MAX_SPEED = 24;
   194	
   195	/** After kicking, a player can't re-capture for this long (lets passes leave). */
   196	export const KICK_COOLDOWN = 0.45;
   197	
   198	/**
   199	 * Discrete dribble touches (Phase 36, 可见的触球): an outfield carrier
   200	 * DRIVING in space pushes the ball ahead and chases it — between touches
   201	 * the ball is a free body an opponent in the path may poke away. Under
   202	 * pressure (an opponent inside TOUCH_CONTROL_DIST) the carry stays glued:
   203	 * close control IS short touches, and the tackle/shield duel lives there.
   204	 */
   205	/** Nearest-opponent distance above which the carrier plays open touches.
   206	 * First cut 3.5/1.7/0.38 rolled the ball 1.1s ahead and 39% of pushes were
   207	 * poked away — a coin flip per carry. */
   208	export const TOUCH_CONTROL_DIST = 4.2;
   209	/**
   210	 * Carry REGIMES (36.1, user report "跑动应该有不同的触球频率"): the push
   211	 * range is wide on purpose — in traffic it's a stride-length nudge
   212	 * (一步一带, ~0.9 m/s over the run), into 10m of open grass it's a real
   213	 * knock (爆趟, up to ~4.7); walking pace keeps the glue (慢带). Cadence
   214	 * follows: the poke window scales with the push, so a long knock is a
   215	 * long chase and a dribble regathers in a step.
   216	 */
   217	/** Base speed added to the carrier's own on the push. */
   218	export const TOUCH_PUSH_BASE = 0.9;
   219	/** Extra push per meter of open cone ahead (capped at 9m in mechanics).
   220	 * 0.38 + cooldown slope 0.06 overshot: pokes 26%, 13% rolled dead, goals
   221	 * −0.27 (probed) — the mid-range carry bled possession. */
   222	export const TOUCH_PUSH_SPACE = 0.32;
   223	/** The no-recollect window: base + slope·push — the poke window. */
   224	export const TOUCH_RECOLLECT_BASE = 0.26;
   225	export const TOUCH_RECOLLECT_PER_PUSH = 0.04;
   226	/** A keeper ahead is not open grass (Phase 46): any roll that reaches him
   227	 * is DEAD (GK_CONTROL_MAX_SPEED 23 vs outfield 14, plus hands in the box),
   228	 * and he covers ~GK 6.4 m/s × the ~0.8s loose window while a knock is
   229	 * un-regatherable. The carry cone prices him at that envelope upfield of
   230	 * his body — the substrate fix for 趟球太大送门将 (breakaway probe:
   231	 * keeper-collects stuck at 8-9% even with maxed technique). */
   232	export const GK_RUSH_ENVELOPE = 5;
   233	
   234	/** How often each player re-evaluates its utility scores (staggered). */
   235	export const AI_INTERVAL = 0.15;
   236	/** How often each TeamBrain re-picks a tactical mode / assignments. */
   237	export const TEAM_AI_INTERVAL = 0.4;
   238	
   239	export const SHOT_SPEED = 27;
   240	/** Minimum distance between player centers (hard separation). */
   400	        const coach = team.info.coachName;
   401	        if (team.mentality.urgency > 0.8 && !team.surgeAnnounced) {
   402	          team.surgeAnnounced = true;
   403	          this.pushEvent('info', team.side, coach
   404	            ? `⚡ ${coach} throws everyone forward!`
   405	            : `⚡ ${team.info.name} throw everyone forward!`);
   406	        }
   407	        if (team.mentality.holding > 0.8 && !team.shutdownAnnounced) {
   408	          team.shutdownAnnounced = true;
   409	          this.pushEvent('info', team.side, coach
   410	            ? `🧊 ${coach} shuts up shop`
   411	            : `🧊 ${team.info.name} shut up shop`);
   412	        }
   413	        updateTeamBrain(team, this);
   414	        team.brainTimer = TEAM_AI_INTERVAL;
   415	      }
   416	    }
   417	
   418	    // FAIRNESS: within a frame, later-iterated players act on fresher state
   419	    // (they see earlier kicks and reactions). Measured effect: the team
   420	    // iterated second converted ~10pp more of its shots. Alternating the
   421	    // iteration direction every step cancels the asymmetry, deterministically.
   422	    const order = this.stepCount % 2 === 0 ? this.allPlayers : this.allPlayersReversed;
   423	    for (const p of order) {
   424	      if (p.sentOff) continue;
   425	      if (p.decisionTimer <= 0) {
   426	        decidePlayer(p, this);
   427	        p.decisionTimer = AI_INTERVAL;
   428	      }
   429	    }
   430	
   431	    for (const p of order) {
   432	      if (!p.sentOff) executeAction(p, this, dt);
   433	    }
   434	    for (const p of order) {
   435	      if (!p.sentOff) p.physicsStep(dt);
   436	    }
   437	    this.resolveOverlaps();
   438	    this.clampPlayersToPitch();
   439	    // Kick protection (Phase 31.9): the clearance circle must survive the
   440	    // hand-off — the restart clears ~0.2–0.5s before the taker's kick, and
   720	      return;
   721	    }
   722	    const ball = this.ball;
   723	    ball.owner = p;
   724	    ball.lastTouch = p;
   725	    ball.vel = v2();
   726	    ball.z = 0;
   727	    ball.vz = 0;
   728	    ball.spin = 0;
   729	    const team = this.teams[p.side];
   730	
   731	    // Settle on the ball: carry it briefly before the next decision instead of
   732	    // one-touch ping-pong. Outfielders start driving forward immediately.
   733	    // Back-pass law (Phase 32.2, 出球门将): a DELIBERATE teammate ball may
   734	    // not be picked up — the keeper plays it with his FEET: pressable, no
   735	    // hold, no box clearance, no calm reset. Saves, claims and loose
   736	    // pickups keep the hands. This is what makes the ball-playing keeper
   737	    // (and pressing him) possible at all.
   738	    const backPass =
   739	      this.pendingPass !== null &&
   740	      this.pendingPass.side === p.side &&
   741	      this.pendingPass.passerGid !== p.gid;
   742	    // Re-collecting your own pushed touch is the SAME carry continuing
   743	    // (Phase 36) — not a fresh dribble for the stats, and the next
   744	    // decision comes quicker (the touch was the setup, not a reception).
   745	    const recollect = this.dribbleTouch !== null && this.dribbleTouch.gid === p.gid;
   746	    this.dribbleTouch = null;
   747	    // Hands only inside the box (Phase 28.5, user report "门将出击到禁区外
   748	    // 用手接球了"): a keeper plays with his FEET on a back-pass (by rule) AND
   749	    // whenever he collects the ball OUTSIDE his own area — a sweeper who
   750	    // rushed/chased off his line (GoalkeeperRush / ChaseBall are deliberately
   751	    // un-clamped) may control and clear, but he may not scoop it up and hold.
   752	    // Restart takers (goal kicks) keep their own quick-kick path. This one
   753	    // gate covers every hands entry that funnels through giveBall — the loose
   754	    // capture (tryCapture) and the high claim (tryAerial).
   755	    const gkFeet =
   756	      p.role === 'GK' &&
   757	      this.restartKickGid !== p.gid &&
   758	      (backPass || !this.inPenaltyBox(p.pos, p.side));
   759	    if (p.role !== 'GK') {
   760	      p.action = { type: 'Dribble', scores: p.action.scores };
   761	      if (!recollect) team.stats.dribbles++;
   762	      // The settle beat before the next push: the first decision after any
   763	      // capture happens ON the ball (touchTimer ≥ the decision settle).
   764	      // A continuing carry (recollect) chains faster — 一步一带 lives here:
   765	      // regather, half a beat, next touch (36.1).
   766	      p.touchTimer = (recollect ? 0.2 : 0.32) + (1 - p.attrs.dribbling) * 0.08;
   767	    } else if (gkFeet) {
   768	      p.action = { type: 'Dribble', scores: p.action.scores }; // at his feet, on the clock
   769	    } else if (this.restartKickGid !== p.gid) {
   770	      // Keeper hold (Phase 27.2): scoop it up and hold before distributing —
   771	      // hands, not feet. Restart first touches (goal kicks) stay quick.
   772	      // Game state prices the hold (Phase 35): a keeper protecting a lead
   773	      // milks the clock; a keeper whose side is chasing gets it moving.
   774	      p.gkHoldTimer = 1.1 * (1 + team.mentality.holding * 0.5 - team.mentality.urgency * 0.3);
   775	      p.gkDistributing = true; // the release is deliberate (28.3)
   776	      p.gkShapeWait = 0; // a fresh hold gets a fresh shape-wait budget (30.3)
   777	    }
   778	    // Snap decisions in shooting range (Phase 28.2): a receiver in front of
   779	    // goal decides NOW — the first-time finish exists. Everywhere else the
   780	    // settle touch stays (one-touch ping-pong was the original disease).
   781	    const inShootingRange =
   782	      p.role !== 'GK' &&
   783	      team.localX(p.pos.x) > HALF_L - 24 &&
   784	      dist(p.pos, team.oppGoal()) < 20;
   785	    p.decisionTimer = Math.max(p.decisionTimer, inShootingRange ? 0.08 : recollect ? 0.18 : 0.3);
   786	    // A keeper with the ball at his FEET is on the press's clock (32.2):
   787	    // he moves it in a beat, he doesn't stroll on it like an outfielder.
   788	    // A sweeper stranded outside his box (28.5) is on the same clock.
   789	    if (gkFeet) p.decisionTimer = Math.min(p.decisionTimer, 0.18);
   790	
   791	    const pass = this.pendingPass;
   792	    if (pass) {
   793	      if (p.side === pass.side && p.gid !== pass.passerGid) {
   794	        team.stats.passesCompleted++;
   795	        this.passChain[p.side]++;
   796	        // The give-and-go completed (Phase 34): the wall's return found the
   797	        // bursting passer inside his license window.
   798	        if (p.wallRun && this.simTime < p.wallRun.until && p.wallRun.partnerGid === pass.passerGid) {
   799	          team.stats.oneTwos++;
   800	          p.wallRun = null;
   801	        }
   802	        // The third-man release arrived (Phase 34).
   803	        if (pass.bounce && p.gid === pass.targetGid) team.stats.thirdMan++;
   804	        // The overlap release arrived WIDE (Phase 34). Position-gated only:
   805	        // receivers brake to take the ball, so an in-stride velocity test
   806	        // (tried) zeroed the count at the capture instant.
   807	        if (team.overlapper === p.index && Math.abs(p.pos.y) > 11) team.stats.overlaps++;
   808	        this.lastCompletedPass = { passerGid: pass.passerGid, receiverGid: p.gid, t: this.simTime };
   809	        // 一脚出球 (Phase 31.9, user request): a PRESSURED intended receiver
   810	        // plays the ball as it comes — decide now, and a pass kicked inside
   811	        // the window carries a first-time noise penalty priced by technique
   812	        // (mechanics). Pressure-triggered only: the 0.3s settle above stays
   813	        // the default, or one-touch ping-pong (the original disease) is
   814	        // back. High-tempo sides live closer to the edge and release under
   815	        // looser pressure.
   816	        if (!inShootingRange && p.role !== 'GK' && p.gid === pass.targetGid) {
   817	          const trigger = 3.0 + team.genome.tempo * 1.5;
   818	          let nearOpp = Infinity;
   819	          for (const o of this.teams[1 - p.side].players) {
   820	            if (o.sentOff) continue;
   821	            const d = dist(o.pos, p.pos);
   822	            if (d < nearOpp) nearOpp = d;
   823	          }
   824	          if (nearOpp < trigger) {
   825	            p.decisionTimer = 0.07;
   826	            p.firstTouchWindow = 0.28;
   827	          }
   828	        }
   829	      } else if (p.side !== pass.side) {
   830	        // No feed line (Phase 28.2): at ~25 per match, "X intercepts" drowned
   831	        // the feed in noise (failure mode 7) — the stats panel carries the
   832	        // count, the debug overlays show the moment.
   833	        team.stats.interceptions++;
   834	        this.stat(p.gid).recoveries++;
   835	      }
   836	      this.pendingPass = null;
   837	    }
   838	    if (this.pendingShot && p.side !== this.pendingShot.side) {
   839	      this.markShotOutcome('miss'); // no-op if the keeper already logged a save
   840	      this.pendingShot = null;
   841	    }
   842	
   843	    if (this.possessionSide !== p.side) {
   844	      // The dispossessed side's passing move is over (Phase 33).
   845	      this.endPassMove((1 - p.side) as Side);
   846	      team.possessionGainedAt = this.simTime;
   847	      team.resetProgress(team.localX(ball.pos.x));
   848	      this.possessionSide = p.side;
   849	      // Possession swung — both brains re-evaluate promptly.
   850	      this.teams[0].brainTimer = Math.min(this.teams[0].brainTimer, 0.05);
   851	      this.teams[1].brainTimer = Math.min(this.teams[1].brainTimer, 0.05);
   852	    }
   853	  }
   854	
   855	  /* ---------------- ball physics ---------------- */
   856	
   857	  private stepBall(dt: number): void {
   858	    const ball = this.ball;
   859	    if (ball.owner) {
   860	      // Discrete touches (Phase 36, 可见的触球): an outfield carrier DRIVING
   861	      // in open field pushes the ball ahead and chases it — the magnet-ball
   862	      // glue below is only close control now (pressure, shielding, keepers,
   863	      // restart takers). touchTimer ≥ the capture settle guarantees the
   864	      // first decision happens ON the ball, so the pass game keeps its
   865	      // timing and restart takers kick before a push can fire.
   866	      const o = ball.owner;
   867	      if (
   868	        this.phase === 'playing' &&
   869	        o.role !== 'GK' &&
   870	        o.action.type === 'Dribble' &&
   871	        o.touchTimer <= 0 &&
   872	        o.gkHoldTimer <= 0 &&
   873	        // A slow or turning carrier keeps the ball at his feet — pushes
   874	        // belong to the DRIVE (walking pace = close control by definition).
   875	        o.vel.x * o.vel.x + o.vel.y * o.vel.y > 2.5 * 2.5
   876	      ) {
   877	        let nearOpp = Infinity;
   878	        for (const q of this.teams[1 - o.side].players) {
   879	          if (q.sentOff) continue;
   880	          const d = dist(q.pos, o.pos);
  1760	    const speed = Math.hypot(ball.vel.x, ball.vel.y);
  1761	    let best: Player | null = null;
  1762	    let bestD = Infinity;
  1763	    let deflector: Player | null = null;
  1764	    let deflectorD = Infinity;
  1765	    // Lane anticipation was always meant for drilled PASSES, not shots
  1766	    // ("non-shot" below) — shots left the foot at 27 m/s, above the window.
  1767	    // But friction decays a shot into 14–24 m/s within ~5m of flight, and
  1768	    // once formations parked bodies on every shot path (Phase 30), the legs
  1769	    // silently swallowed the league's goals (measured: conversion ~28% of
  1770	    // on-target while saveP said ~50%). A shot in flight is the KEEPER's
  1771	    // problem; blocks want lane-aware shot selection first (roadmap).
  1772	    const shotInFlight = this.pendingShot !== null && !this.pendingShot.resolved;
  1773	    const deflectable = speed > CONTROL_MAX_SPEED && speed <= DEFLECT_MAX_SPEED && !shotInFlight;
  1774	    // Alternate scan direction so equal-distance ties don't favor one team.
  1775	    const order = this.stepCount % 2 === 0 ? this.allPlayers : this.allPlayersReversed;
  1776	    for (const p of order) {
  1777	      if (p.sentOff || p.kickCooldown > 0 || p.stunTimer > 0) continue;
  1778	      // Same cheap reject as resolveOverlaps: |dx| ≥ radius ⇒ d ≥ radius.
  1779	      const dx = p.pos.x - ball.pos.x;
  1780	      if (dx >= CONTROL_RADIUS || dx <= -CONTROL_RADIUS) continue;
  1781	      const dy = p.pos.y - ball.pos.y;
  1782	      if (dy >= CONTROL_RADIUS || dy <= -CONTROL_RADIUS) continue;
  1783	      const d = Math.sqrt(dx * dx + dy * dy);
  1784	      if (d >= CONTROL_RADIUS) continue;
  1785	      // The cushioned trap (Phase 31.7, user report "长球停不住"): the
  1786	      // pass's INTENDED receiver is set for the ball and may take down a
  1787	      // driven delivery a bystander can't — the 30.5 driven switch lands
  1788	      // at ~19.5 m/s, above CONTROL_MAX_SPEED, so it skipped past every
  1789	      // winger it was aimed at. attemptFirstTouch prices the attempt (the
  1790	      // fail chance grows with speed and caps at 0.4, so hot deliveries
  1791	      // still squirt plenty); interceptors keep the old ceiling, so lane
  1792	      // dynamics don't change.
  1793	      const intended =
  1794	        this.pendingPass !== null &&
  1795	        this.pendingPass.targetGid === p.gid &&
  1796	        this.pendingPass.side === p.side;
  1797	      // 22 → 24 (31.8, user report "门将开长球穿模接不到"): a 40m goal
  1798	      // kick arrives at ~21 m/s horizontal with a steep drop — the ball
  1799	      // sailed THROUGH the target's model and skipped away untouchable.
  1800	      // 24 matches the through-ball pace cap: every delivery the game
  1801	      // DESIGNS is takeable by its intended man, priced by the touch roll
  1802	      // (a dropping ball's vz counts extra there, so long kicks still get
  1803	      // away plenty — and the aerial duel fires first when contested).
  1804	      const maxSpeed =
  1805	        p.role === 'GK' ? GK_CONTROL_MAX_SPEED : intended ? 24 : CONTROL_MAX_SPEED;
  1806	      if (speed <= maxSpeed) {
  1807	        if (d < bestD) {
  1808	          best = p;
  1809	          bestD = d;
  1810	        }
  1811	      } else if (deflectable && d < deflectorD) {
  1812	        deflector = p;
  1813	        deflectorD = d;
  1814	      }
  1815	    }
  1816	    // First touch (Phase 27): a firm ball can get away from the receiver —
  1817	    // pressing and blind-side receptions turn into real turnovers.
  1818	    if (best) {
  1819	      // Reaction gate (Phase 59): a BYSTANDER only gets a foot on a live
  1820	      // pass he can react to — priced by ball speed and blind-side arrival,
  1821	      // the same principle as tryDeflection's stretch. The intended
  1822	      // receiver is SET for it (exempt), and a dead/loose ball (no pass in
  1823	      // flight) keeps the old scramble physics. A failed gate commits the
  1824	      // step (kickCooldown) — the ball beat him, no second bite.
  1825	      const intendedBest =
  1826	        this.pendingPass !== null &&
  1827	        this.pendingPass.targetGid === best.gid &&
  1828	        this.pendingPass.side === best.side;
  1829	      if (!intendedBest && this.pendingPass !== null && speed > 7) {
  1830	        const bx = ball.vel.x / speed;
  1831	        const by = ball.vel.y / speed;
  1832	        const blind = (1 + (bx * best.heading.x + by * best.heading.y)) / 2;
  1833	        const pContact = Math.min(0.95, Math.max(
  1834	          0.1,
  1835	          (0.95 - (speed - 7) * 0.04) * (1 - blind * CONTACT_BLIND_PEN),
  1836	        ));
  1837	        if (!this.rng.chance(pContact)) {
  1838	          best.kickCooldown = 0.3;
  1839	          return;
  1840	        }
  1841	      }
  1842	      if (mech.attemptFirstTouch(this, best)) this.giveBall(best);
  1843	      return;
  1844	    }
  1845	    // Nobody can control it — but a player in the path of a drilled (non-shot)
  1846	    // ball can stick a leg in and knock it loose (Phase 27 lane anticipation).
  1847	    if (deflector) mech.tryDeflection(this, deflector);
  1848	  }
  1849	
  1850	  /* ---------------- player constraints ---------------- */
  1851	
  1852	  private resolveOverlaps(): void {
  1853	    const ps = this.allPlayers;
  1854	    for (let i = 0; i < ps.length; i++) {
  1855	      const a = ps[i];
  1856	      if (a.sentOff) continue;
  1857	      for (let j = i + 1; j < ps.length; j++) {
  1858	        const b = ps[j];
  1859	        if (b.sentOff) continue;
  1860	        // Cheap reject before the sqrt: √(x²+y²) ≥ |x| holds bitwise in IEEE

[35m[3mcodex[0m[0m
The probe evidence sharpens the ranking. In a side-balanced extreme-sensitivity check (0.95 vs 0.05, neutral tactics), pace and defending dominate match outcomes; strength and stamina barely move them; and the shipped positioning probe confirms roughly a 19% spill reduction but no reliable scoring or prevention edge. I also found a concrete bug that the docs do not call out: the “engine” stamina-saving trait is awarded for high `pace`, not high `stamina`, which makes pace even more superlinear and steals identity from the stamina gene.
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "node --import tsx --input-type=module -e 'import { Match } from \"./src/sim/Match.ts\"; import { GENE_KEYS } from \"./src/evolution/genome.ts\"; import { ATTR_KEYS } from \"./src/evolution/playerGenome.ts\"; import { TEAM_SIZE } from \"./src/sim/types.ts\"; const attrs=[\"passing\",\"finishing\",\"strength\",\"stamina\",\"positioning\"],K=60; const genome=()=>Object.fromEntries(GENE_KEYS.map(k=>[k,0.5])); const squad=(key,val)=>Array.from({length:TEAM_SIZE},()=>Object.fromEntries(ATTR_KEYS.map(k=>[k,k===key?val:0.5]))); const info=(key,val,tag)=>({id:tag,name:tag,short:tag,colors:{primary:0xff0000,secondary:0xffffff},playerNames:Array.from({length:TEAM_SIZE},(_,i)=>"'`P${i}`),genome:genome(),squad:squad(key,val)}); for(const attr of attrs){const H={gf:0,ga:0,shots:0,xg:0,passes:0,pc:0,spill:0,hdr:0,tkl:0,drb:0,st:0},L={gf:0,ga:0,shots:0,xg:0,passes:0,pc:0,spill:0,hdr:0,tkl:0,drb:0,st:0};let n=0;for(let seed=1;seed<=K;seed++)for(const rev of [false,true]){const hiSide=rev?1:0,m=new Match({seed:81000+seed*37,teamA:rev?info(attr,.05,"LO"):info(attr,.95,"HI"),teamB:rev?info(attr,.95,"HI"):info(attr,.05,"LO"),duration:120}),r=m.runToCompletion();for(const [O,s,o] of [[H,r.stats[hiSide],r.stats[1-hiSide]],[L,r.stats[1-hiSide],r.stats[hiSide]]]){O.gf+=s.goals;O.ga+=o.goals;O.shots+=s.shots;O.xg+=s.xg;O.passes+=s.passes;O.pc+=s.passesCompleted;O.spill+=s.miscontrols;O.hdr+=s.headersWon;O.tkl+=s.tackles;O.drb+=s.dribbles;O.st+=s.staminaSpent;}n++;}const f=(O)=>`GF ${(O.gf/n).toFixed(2)} GA ${(O.ga/n).toFixed(2)} xG ${(O.xg/n).toFixed(2)} sh ${(O.shots/n).toFixed(2)} comp ${(100*O.pc/O.passes).toFixed(1)} spill ${(O.spill/n).toFixed(2)} hdr ${(O.hdr/n).toFixed(2)} tkl ${(O.tkl/n).toFixed(2)} drb ${(O.drb/n).toFixed(2)} st ${(O.st/n).toFixed(2)}`;console.log(`${attr}: HI ${f(H)} | LO ${f(L)}`)}'"'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 17301ms:[0m
passing: HI GF 0.97 GA 0.87 xG 0.66 sh 4.39 comp 74.1 spill 2.63 hdr 2.17 tkl 3.09 drb 28.43 st 2.38 | LO GF 0.87 GA 0.97 xG 0.61 sh 4.30 comp 73.2 spill 1.93 hdr 2.20 tkl 2.86 drb 26.71 st 2.37
finishing: HI GF 1.16 GA 0.74 xG 0.58 sh 4.14 comp 74.2 spill 2.16 hdr 1.42 tkl 2.92 drb 28.38 st 2.39 | LO GF 0.74 GA 1.16 xG 0.60 sh 4.05 comp 75.1 spill 2.38 hdr 1.41 tkl 2.77 drb 28.70 st 2.41
strength: HI GF 0.92 GA 0.88 xG 0.63 sh 4.37 comp 74.4 spill 2.52 hdr 1.73 tkl 2.90 drb 28.16 st 2.37 | LO GF 0.88 GA 0.92 xG 0.59 sh 4.15 comp 74.4 spill 2.38 hdr 1.63 tkl 2.48 drb 26.86 st 2.39
stamina: HI GF 1.08 GA 0.78 xG 0.66 sh 4.49 comp 75.3 spill 2.08 hdr 1.64 tkl 2.80 drb 29.46 st 1.72 | LO GF 0.78 GA 1.08 xG 0.55 sh 3.90 comp 73.6 spill 2.35 hdr 1.73 tkl 3.11 drb 27.19 st 2.97
positioning: HI GF 0.87 GA 0.77 xG 0.64 sh 4.44 comp 76.2 spill 2.03 hdr 1.77 tkl 2.81 drb 28.67 st 2.38 | LO GF 0.77 GA 0.87 xG 0.58 sh 4.02 comp 73.9 spill 2.73 hdr 1.74 tkl 2.88 drb 26.56 st 2.40

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/sim/Match.ts | sed -n '1850,1890p'; nl -ba src/ai/steering.ts | sed -n '1,90p'; nl -ba src/evolution/evolve.ts | sed -n '185,260p'; nl -ba src/evolution/playerGenome.ts | sed -n '195,225p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
  1850	  /* ---------------- player constraints ---------------- */
  1851	
  1852	  private resolveOverlaps(): void {
  1853	    const ps = this.allPlayers;
  1854	    for (let i = 0; i < ps.length; i++) {
  1855	      const a = ps[i];
  1856	      if (a.sentOff) continue;
  1857	      for (let j = i + 1; j < ps.length; j++) {
  1858	        const b = ps[j];
  1859	        if (b.sentOff) continue;
  1860	        // Cheap reject before the sqrt: √(x²+y²) ≥ |x| holds bitwise in IEEE
  1861	        // round-to-nearest, so |dx| or |dy| ≥ PLAYER_MIN_DIST guarantees the
  1862	        // d-check below would continue anyway. Most of the 45 pairs exit here.
  1863	        const dx = a.pos.x - b.pos.x;
  1864	        if (dx >= PLAYER_MIN_DIST || dx <= -PLAYER_MIN_DIST) continue;
  1865	        const dy = a.pos.y - b.pos.y;
  1866	        if (dy >= PLAYER_MIN_DIST || dy <= -PLAYER_MIN_DIST) continue;
  1867	        const d = Math.sqrt(dx * dx + dy * dy);
  1868	        if (d >= PLAYER_MIN_DIST) continue;
  1869	        if (d < 1e-6) {
  1870	          a.pos.x += 0.02 * (i + 1);
  1871	          a.pos.y += 0.01;
  1872	          continue;
  1873	        }
  1874	        // Flat form of the old norm/scale/add push — same op order, in place.
  1875	        const k = (PLAYER_MIN_DIST - d) / 2;
  1876	        const px = (dx / d) * k;
  1877	        const py = (dy / d) * k;
  1878	        // A keeper stands their ground in their own box against opponents
  1879	        // (Phase 28): the carrier bounces off — nobody bulldozes the keeper
  1880	        // back into the net a half-push at a time.
  1881	        const gkA = a.role === 'GK' && b.side !== a.side && this.inPenaltyBox(a.pos, a.side);
  1882	        const gkB = b.role === 'GK' && a.side !== b.side && this.inPenaltyBox(b.pos, b.side);
  1883	        if (gkA && !gkB) {
  1884	          b.pos.x -= px * 2;
  1885	          b.pos.y -= py * 2;
  1886	        } else if (gkB && !gkA) {
  1887	          a.pos.x += px * 2;
  1888	          a.pos.y += py * 2;
  1889	        } else {
  1890	          a.pos.x += px;
     1	import { v2, type V2 } from '../utils/vec';
     2	import type { Player } from '../sim/Player';
     3	
     4	/** Steering behaviors: each returns a desired-velocity contribution. */
     5	
     6	/** Full-speed run at a target, decelerating inside `slowRadius` so players settle on spots. */
     7	export function arrive(p: Player, target: V2, speed: number, slowRadius = 2.5): V2 {
     8	  // Flat form of scale(norm(sub(target, p.pos)), s) — runs for every player
     9	  // every frame. dist() and norm's internal length share the same bits
    10	  // ((-a)² === a² in IEEE), so one sqrt serves both; results are unchanged.
    11	  const dx = target.x - p.pos.x;
    12	  const dy = target.y - p.pos.y;
    13	  const d = Math.sqrt(dx * dx + dy * dy);
    14	  if (d < 0.05) return v2();
    15	  const s = d < slowRadius ? speed * (d / slowRadius) : speed;
    16	  if (d < 1e-8) return v2();
    17	  return { x: (dx / d) * s, y: (dy / d) * s };
    18	}
    19	
    20	/**
    21	 * Push away from nearby players so nobody stacks. Applied to everyone every
    22	 * frame on top of their primary steering; hard overlap is also resolved in
    23	 * Match physics as a positional constraint.
    24	 */
    25	export function separation(p: Player, all: Player[], radius = 2.2, strength = 3.0): V2 {
    26	  // Flat form of add(out, scale(norm(sub(p.pos, o.pos)), k)) — runs for every
    27	  // player every frame and allocated ~4 vectors per close neighbor. dist and
    28	  // norm's internal length share the same bits ((-a)² === a² in IEEE), so one
    29	  // sqrt serves both; accumulation order is unchanged, results are identical.
    30	  let ox = 0;
    31	  let oy = 0;
    32	  for (const o of all) {
    33	    if (o === p || o.sentOff) continue;
    34	    const dx = p.pos.x - o.pos.x;
    35	    const dy = p.pos.y - o.pos.y;
    36	    const d = Math.sqrt(dx * dx + dy * dy);
    37	    if (d < radius && d > 1e-6) {
    38	      const k = strength * (1 - d / radius);
    39	      ox += (dx / d) * k;
    40	      oy += (dy / d) * k;
    41	    }
    42	  }
    43	  return { x: ox, y: oy };
    44	}
    45	
    46	/** Small sideways push around opponents directly in the movement path. */
    47	export function avoidOpponents(p: Player, desired: V2, opponents: Player[]): V2 {
    48	  // Flattened like separation. Math.hypot is kept exactly — it rounds
    49	  // differently than Math.sqrt(x²+y²), so replacing it would drift.
    50	  const dl = Math.sqrt(desired.x * desired.x + desired.y * desired.y);
    51	  if (dl < 1e-8) return v2();
    52	  const dirX = desired.x / dl;
    53	  const dirY = desired.y / dl;
    54	  let ox = 0;
    55	  let oy = 0;
    56	  for (const o of opponents) {
    57	    if (o.sentOff) continue;
    58	    const tox = o.pos.x - p.pos.x;
    59	    const toy = o.pos.y - p.pos.y;
    60	    const ahead = tox * dirX + toy * dirY; // projection onto heading
    61	    if (ahead < 0.5 || ahead > 5) continue;
    62	    const lx = tox - dirX * ahead;
    63	    const ly = toy - dirY * ahead;
    64	    const ld = Math.hypot(lx, ly);
    65	    if (ld < 1.6) {
    66	      const side = lx * dirY - ly * dirX > 0 ? 1 : -1;
    67	      const k = 2.0 * (1 - ld / 1.6);
    68	      ox += -dirY * side * k;
    69	      oy += dirX * side * k;
    70	    }
    71	  }
    72	  return { x: ox, y: oy };
    73	}
   185	      const before = coach.genome;
   186	      // The coach's own ideas drift (Phase 53: mutation = the same person
   187	      // rethinking, not a new person).
   188	      coach.genome = mutateGenome(coach.genome, rng, { rate: 0.4, scale: 0.08 });
   189	      // Attacking-style policy drifts too (Phase 42) — decision STYLE evolves.
   190	      coach.policy = mutatePolicyGenes(coach.policy, rng);
   191	      // Squads no longer take random mutation — since Phase 26 they change
   192	      // through the careers pass instead (development, retirement, newgens).
   193	      // Formations are the philosophy's shape (Phase 31→53): occasionally ONE
   194	      // component switches to its alternative, logged as a lineage event.
   195	      // Zonal is guarded (failure mode 18: the lattice out-defends man — a
   196	      // zonal-heavy league stops scoring), so mutating INTO it needs a
   197	      // second, rarer roll.
   198	      const styleNote = mutateStyle(coach.style, rng, plan.zonal);
   199	      f.lineage.push({ generation: nextGen, event: 'mutated', fitness, note: styleNote });
   200	      entries.push({
   201	        slot: f.slot, name: f.name, kind: 'mutated', fitness,
   202	        drift: geneDistance(before, coach.genome), note: styleNote,
   203	      });
   204	    } else {
   205	      const pa = pickParent();
   206	      const pb = pickParent(pa);
   207	      const before = f.coach.genome;
   208	      // The dying club's manager is out of a job — the League routes him to
   209	      // the unemployed pool (the memetic channel's supply side, Phase 53) —
   210	      // and the squad hits the fire-sale (the player-gene channel, Phase 55).
   211	      plan.firedCoaches?.push(f.coach);
   212	      plan.firedSquads?.push({
   213	        club: f.name,
   214	        names: [...f.playerNames],
   215	        squad: f.squad.map((p) => ({ ...p })),
   216	        styles: f.squadStyles.map((s) => ({ ...s })),
   217	        ages: [...f.ages],
   218	        careers: f.careers.map((c) => ({ ...c })),
   219	      });
   220	      const genome = mutateGenome(
   221	        crossoverGenomes(pa.coach.genome, pb.coach.genome, rng), rng, { rate: 0.5, scale: 0.15 },
   222	      );
   223	      // The new philosophy blends both parents' styles, then mutates harder
   224	      // (Phase 42) — and it arrives EMBODIED (Phase 53): the reborn club
   225	      // hires a newgen coach schooled by the dominant parent's manager (the
   226	      // mentor tree).
   227	      const policy = mutatePolicyGenes(
   228	        crossoverPolicyGenes(pa.coach.policy, pb.coach.policy, rng), rng, { rate: 0.5, scale: 0.15 },
   229	      );
   230	      // Formations are the philosophy's shape (Phase 31): the newborn
   231	      // philosophy INHERITS its tactical identity from the dominant parent —
   232	      // the dynasty's shape survives the rebirth. The zonal budget applies
   233	      // to inheritance too: this was THE compounding channel (zonal elite
   234	      // win → parent the reborn → zonal multiplies).
   235	      const wasZonal = f.coach.style.scheme === 'zonal';
   236	      const style: TeamStyle = { ...pa.coach.style };
   237	      if (style.scheme === 'zonal' && !wasZonal) {
   238	        if (plan.zonal && plan.zonal.room > 0) plan.zonal.room -= 1;
   239	        else style.scheme = 'man';
   240	      } else if (wasZonal && style.scheme !== 'zonal' && plan.zonal) {
   241	        plan.zonal.room += 1;
   242	      }
   243	      f.coach = createCoach(rng, genome, policy, style, {
   244	        age: rookieCoachAge(rng),
   245	        mentor: pa.coach.name,
   246	      });
   247	      // The academy intake: attributes cross over from both parents' squads,
   248	      // but the players themselves are NEW — young, unnamed, blank careers.
   249	      // Budget-enforced (Phase 48): two rich parents can't compound past the cap.
   250	      f.squad = enforceBudget(crossoverSquads(pa.squad, pb.squad, rng));
   251	      // Personal styles cross the same way (Phase 54) — the newborn academy
   252	      // inherits both parents' decision temperaments, slot by slot.
   253	      f.squadStyles = crossoverSquadStyles(pa.squadStyles, pb.squadStyles, rng);
   254	      f.ages = f.squad.map(() => rookieAge(rng) + rng.int(0, 5)); // 17–24
   255	      f.careers = f.squad.map(() => emptyCareer());
   256	      const oldName = f.name;
   257	      takenNames.delete(oldName);
   258	      f.name = uniqueTeamName(rng, takenNames);
   259	      f.short = shortName(f.name);
   260	      f.playerNames = generatePlayerNames(rng);
   195	/**
   196	 * Academy heredity (Phase 48): a retiring player's successor is grown in the
   197	 * club's image — the retiree's attribute profile, mutated. This retires
   198	 * ROLE_BIAS from the newgen path (the bias survives only at FOUNDING, where
   199	 * selection has nothing to work with yet): what a club's left winger IS is
   200	 * now bloodline, discovered by evolution, not set by us. The age curve
   201	 * regrows a 17-year-old's inherited profile from there.
   202	 *
   203	 * School-linked variation (Phase 94): the academy grows what the coach's
   204	 * philosophy NEEDS. The jockey school's problem was DISCOVERY, not payoff —
   205	 * containment only pays as a defending+jockeyBias PACKAGE, a two-locus
   206	 * valley that drift rarely crosses in a 16-club population (phases 88/92).
   207	 * So the newgen intake drifts along the philosophy axis: a containment
   208	 * coach (jockeyBias>0.5) pulls the heir toward defending, a dive-in coach
   209	 * pulls toward pace — a zero-sum transfer on one axis (max ±0.12, one
   210	 * mutation σ), on top of unbiased bloodline noise. Fitness stays pure
   211	 * results and founders stay random: this biases VARIATION, not selection.
   212	 */
   213	export function newgenFromBloodline(
   214	  retiree: PlayerAttributes, rng: Rng, coachJockeyBias = 0.5,
   215	): PlayerAttributes {
   216	  const out = {} as PlayerAttributes;
   217	  for (const k of ATTR_KEYS) out[k] = clamp01(retiree[k] + rng.gaussian() * 0.12);
   218	  const pull = (coachJockeyBias - 0.5) * 0.24;
   219	  out.defending = clamp01(out.defending + pull);
   220	  out.pace = clamp01(out.pace - pull);
   221	  return out;
   222	}
   223	
   224	/** Squad-average of each attribute — shown on team cards. */
   225	export function squadSummary(squad: PlayerAttributes[]): PlayerAttributes {

[3mCompleted the code/dataflow audit and ran side-balanced sensitivity checks. The design recommendation is now grounded in both static call-sites and match outcomes, with special attention to the current dirty working tree rather than the roadmap's intended future state.[0m
  [32m✓[0m Read project guidance and the specified vision/evolution documents
  [32m✓[0m Trace every player attribute from genome through brains, perception, mechanics, traits, and careers
  [32m✓[0m Evaluate missing qualities and design a balanced game-reading substrate
  [32m✓[0m Rank highest-leverage changes with exact code sites and balance risks
[2mcontext compacted[0m
[35m[3mcodex[0m[0m
## Bottom line

No: the nine attributes do not currently matter equally or distinctly.

My read is:

- **Pace and defending are disproportionately powerful.**
- **Dribbling is powerful but acts as a catch-all “technique” stat.**
- **Passing, finishing, stamina, and reflexes are live, but each has modelling gaps.**
- **Strength is weak and narrow.**
- **Positioning is effectively a first-touch attribute, not game reading—and is dead for goalkeepers despite consuming their budget.**

I would **not add a tenth `vision` attribute yet**. I would turn the existing `positioning` gene into a genuine, general-purpose **awareness/game-reading attribute**, preserving the current budget dimensionality. The project has correctly identified a missing “eye”, but an attacker-only lane-openness multiplier is the wrong implementation: it creates optimism, not perception.

## 1. Attribute audit

| Attribute | What it actually does | Assessment |
|---|---|---|
| `pace` | Raises top speed and acceleration; fatigue then modulates that speed. It also separately protects the carrier during tackles even though actual carrier velocity is already included. [Player.ts:170](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Player.ts:170), [mechanics.ts:1661](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:1661) | **Overpowered and double-counted.** It also erroneously unlocks `engine`, which reduces stamina drain. |
| `passing` | Reduces pass noise and improves loft, through-ball, cross, cutback, and free-kick execution. [mechanics.ts:271](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:271) | **Live and reasonably distinct**, but ordinary ground-pass selection barely values it. Its effect is more visible on ambitious delivery than routine circulation. |
| `dribbling` | First touch, one-touch execution, ball push/noise, action cadence, tackle resistance, hold-up scoring, and some shot curl/orientation. [mechanics.ts:95](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:95), [actionExecutor.ts:329](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/actionExecutor.ts:329) | **Overloaded.** It conflates close control, first touch, ball carrying, press resistance, and parts of striking technique. |
| `finishing` | Shot aim, spread, power/composure, heading, chips, and free kicks. The brain intentionally does not make high finishers shoot more often. [PlayerBrain.ts:187](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/PlayerBrain.ts:187), [mechanics.ts:1036](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:1036) | **Live but one-dimensional:** mostly chance conversion. Keeping shot preference separate from quality is a good emergent design choice. |
| `defending` | Marker reaction, tackle/slide success, deflections, blocks, aerial contribution, and the disruption of contested finishing. [actionExecutor.ts:206](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/actionExecutor.ts:206), [mechanics.ts:1682](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:1682) | **Very strong and overloaded.** Marking discipline, anticipation, tackling, blocking, and aerial defence cannot evolve independently. |
| `strength` | Some aerial contest value, carrier shielding, and punt-target preference. [mechanics.ts:635](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:635) | **Weak and narrow.** It does not meaningfully govern ground collisions, hold-up selection, displacement, balance, or header power. |
| `stamina` | Drain, recovery, fatigue, top-speed loss, and eligibility for some overlap behaviour. [Player.ts:233](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Player.ts:233), [Player.ts:312](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Player.ts:312) | **Genuinely live**, but its identity is weakened by the `engine` trait bug. |
| `reflexes` | Goalkeeper reach, claims, smothers, and save probability. [mechanics.ts:26](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:26), [mechanics.ts:1863](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:1863) | **Strong and distinct for GKs; completely dead outfield.** The budget excludes it outfield, correctly, but displays/style naming do not. |
| `positioning` | Reduces first-touch and chest-trap failures. [mechanics.ts:95](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:95), [mechanics.ts:819](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:819) | **Misnamed and weak.** It does not affect positioning, runs, marking, support, anticipation, or perception. GK first touch bypasses the check, making it dead for GKs. |

### Important implementation problems

**The budget is not actually liveness-aware.** Goalkeepers pay for `positioning`, `strength`, and `dribbling`; the first is dead and the others are marginal edge-case attributes. [playerGenome.ts:167](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/playerGenome.ts:167)

Moreover, `enforceBudget` computes the cap from selected attributes but then scales **every** attribute, including excluded ones. [playerGenome.ts:184](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/playerGenome.ts:184) That is defensible as a normalization shortcut, but it is not conceptually clean and complicates interpreting selection pressure.

Presentation is also liveness-blind: all attributes participate in player descriptors, so an outfielder can receive a reflex-based “spring cat” identity despite reflexes doing nothing. [playerStyle.ts:109](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/playerStyle.ts:109)

**There is a concrete trait bug.** `engine` is awarded from high `pace`, not high `stamina`, and then reduces stamina drain. [traits.ts:68](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/traits.ts:68), [Player.ts:175](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Player.ts:175) This makes pace even more of a superstat.

**Several major decisions are attribute-blind.** Perception uses exact world state for pressure, lane openness, space, and interception geometry. [perception.ts:14](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:14), [perception.ts:132](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:132), [perception.ts:299](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:299)

Other blind constants include:

- A universal decision interval and turn rate. [constants.ts:234](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/constants.ts:234), [Player.ts:17](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Player.ts:17)
- Pass-contact/reaction probability without awareness. [Match.ts:1819](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Match.ts:1819)
- Chaser, marker, and runner assignment driven primarily by distance, speed, and fixed role weights. [TeamBrain.ts:193](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/TeamBrain.ts:193), [TeamBrain.ts:380](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/TeamBrain.ts:380)
- Equal physical separation in body overlaps regardless of strength. [Match.ts:1852](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Match.ts:1852)

There are also several authored role abilities—not attributes—including fixed aerial role bonuses, WG cross bonuses, and role-weighted runner assignment. [mechanics.ts:619](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:619), [PlayerBrain.ts:527](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/PlayerBrain.ts:527), [TeamBrain.ts:110](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/TeamBrain.ts:110) These are more contrary to the emergence philosophy than most attribute-balance issues.

### Directional sensitivity check

I ran deliberately extreme side-balanced probes—whole squads at `0.95` versus `0.05`, neutral tactics. These are diagnostic, not budget-neutral calibration:

- Pace and defending produced enormous match advantages.
- Reflexes produced a clear goalkeeper advantage.
- Strength barely separated the teams.
- The repository positioning probe reduced spills from roughly `6.01` to `4.87`, but did not produce a stable scoring or prevention gradient.

That matches the dataflow audit: positioning is a real first-touch input but not presently a meaningful football-intelligence dimension.

### Missing real-football qualities

Highest-value omissions:

1. **Awareness/anticipation:** perception, reaction, threat reading, and spatial choice.
2. **Agility/balance:** acceleration, turning, deceleration, and body recovery are currently folded into pace or flat constants.
3. **First touch/control:** presently swallowed by dribbling and positioning.
4. **Weak-foot quality/preferred side:** a highly generative substrate for angles, crossing, cut-ins, and passing orientation.
5. **Aerial timing/ability:** currently approximated through strength, defending, and fixed role bonuses.

I would not prioritize splitting goalkeeper reflexes into handling, reach, and positioning yet. The outfield substrate has much larger deficiencies.

## 2. Modelling awareness/game reading

### Recommendation: repurpose `positioning`

Keep the serialized key initially for compatibility, but redefine and label it as **awareness**. A player’s job should emerge from where awareness pays:

- A forward sees a passing lane or blind-side space sooner.
- A midfielder recognizes pressure and support.
- A defender reads a runner or pass.
- A goalkeeper anticipates ball trajectory and loose-ball danger.

That is preferable to a separate `vision` stat because “vision” often becomes attacker-only passing magic. The existing gene already claims the semantic territory and currently has insufficient selection pressure.

### Model perception fidelity, not behaviour preference

Awareness should change the player’s estimate of the state, not directly say “make a clever run” or “play a through-ball.”

For a moving entity:

```ts
const T = Math.min(relevantHorizon, 0.8);
const lookAhead = 0.30 * (awareness - 0.5) * T;
const perceivedPos = pos.add(vel.scale(lookAhead));
```

This gives approximately ±0.12 seconds of bounded anticipation at the longest horizon:

- `awareness === 0.5` preserves current behaviour exactly.
- High awareness projects movement slightly forward.
- Low awareness reasons from slightly stale state.
- There is no randomness and therefore no determinism risk.

For the ball, use the existing friction/flight projection rather than linear extrapolation.

Feed perceived positions into:

- Pressure and lane calculations in [perception.ts:14](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:14) and [perception.ts:132](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:132).
- Recipient and lane evaluation in the pass loop at [PlayerBrain.ts:275](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/PlayerBrain.ts:275).
- Through-ball, cross, and cutback evaluation.
- Marker, chaser, and runner assignment in `TeamBrain`.
- Support-position candidate evaluation rather than the current essentially fixed “ahead of ball” support spot. [formations.ts:546](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/formations.ts:546)

Crucially, retire the `playmaker` multiplier that simply makes true lanes look 15% more open. [PlayerBrain.ts:277](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/PlayerBrain.ts:277) That is optimism, not superior reading.

### Defensive reaction

Keep `defending` as execution quality and let awareness govern how soon the player recognizes the event.

For marker reaction:

```ts
lag = clamp(
  0.45
    - 0.25 * defending
    - 0.18 * (awareness - 0.5),
  0.18,
  0.48,
);
```

This preserves the current formula at neutral awareness while allowing a maximum difference of only ±0.09 seconds. The current site is [actionExecutor.ts:217](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/actionExecutor.ts:217).

For interceptions:

```ts
const readMargin =
  0.95 * ballArrivalTime
  - defenderArrivalTime
  + 0.20 * (awareness - 0.5);

canIntercept = readMargin > 0;
```

Awareness changes whether the player gets going in time; it should not boost sprint speed or tackle success.

The live-pass contact gate at [Match.ts:1829](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Match.ts:1829) could receive a mild factor:

```ts
pContact *= 1 + 0.35 * (awareness - 0.5);
```

Do not also add awareness to the subsequent control, tackle, or save roll. That would double-pay the attribute.

### Off-ball movement

Longer term, replace authored support/run locations with candidate evaluation:

```text
V(position) =
    wReceive × receivability
  + wThreat  × progress/threat
  + wSpace   × openness
  - wCrowd   × teammate crowding
  - wRisk    × transition exposure
```

The weights are **policy/preference genes**; awareness controls the fidelity with which the player estimates the terms. This preserves the important distinction:

- Policy genes: what the player wants.
- Awareness: how accurately and promptly the player reads the situation.
- Physical/technical attributes: whether they can execute it.

That architecture lets the same awareness gene produce playmakers, poachers, sweepers, and cautious screeners without role checks.

### Failure modes and balance controls

- **Attacker-only scoring inflation:** never give awareness only to lane or chance creation. Ship attacking and defensive perception together.
- **Universal superstat:** awareness must not affect speed, pass accuracy, shot accuracy, tackle success, and perception simultaneously. Keep it in reading/reaction.
- **Defensive strangulation:** cap reaction effects around ±0.1 seconds and do not stack awareness into blocks or tackles.
- **Route collapse:** use the same perceived-state layer for passes, crosses, carries, cutbacks, marking, and interceptions—no through-ball-specific bonus.
- **Prediction omniscience:** extrapolate only current velocity over a bounded horizon. Do not reveal future action choice or RNG.
- **Movement jitter:** cache a target until the next decision tick or until the current choice becomes materially worse.
- **Offside pathologies:** initially continue applying the actual offside law against true positions; do not make awareness an offside exemption.
- **Age curve:** awareness should decline much more slowly than current positioning. I would use a decline weight around `0.4`, versus the current `1.0`. [careers.ts:63](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/careers.ts:63)

Useful acceptance measures are choice regret by awareness decile, interceptions, missed receptions, key passes, xG for/against, route mix, and whether every position evolves awareness toward `1.0`. If it does, the gene is too universally efficient or too cheap.

## 3. Highest-leverage changes

### 1. Convert `positioning` into awareness

Implement the bounded perceived-state and reaction model above.

**Why first:** the simulation currently gives every player essentially perfect eyes, then differentiates only their execution. This is the largest missing source of football intelligence and player individuality.

**Risk:** medium-high. It can become a universal superstat or suppress scoring if defensive anticipation is too strong.

### 2. Make the budget and evolution honest

Use a single role-specific liveness mask for:

- Budget accounting and scaling.
- Mutation/crossover normalization.
- Summaries, nameplates, and derived traits.
- Validation tests.

Either make GK positioning/control/strength meaningful or stop charging for them.

I would also remove the hardcoded `jockeyBias → +defending, −pace` newgen adjustment. [playerGenome.ts:203](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/playerGenome.ts:203) That manufactures a containment archetype instead of allowing it to emerge from selection.

The explicit squad mutation operator also appears unused in production; crossover is called directly. [evolve.ts:247](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/evolve.ts:247) Variation mainly enters through careers and newgens. I would add small unbiased post-crossover mutation before adding more authored covariances.

**Risk:** greater population variance and slower discovery of currently hand-assisted archetypes.

### 3. Separate agility from pace

Make:

- `pace` govern maximum running speed.
- `agility` govern acceleration, turning, deceleration, and balance/recovery.
- Actual velocity—not the pace gene again—govern momentum-based tackle protection.
- `engine` depend on stamina, fixing the current bug.

A neutral-preserving starting point:

```ts
topSpeed = BASE_SPEED * (0.90 + 0.20 * pace);
accel    = BASE_ACCEL * (0.85 + 0.30 * agility);
turnRate = 6.5        * (0.75 + 0.50 * agility);
```

This creates long-striding runners, explosive turners, slow technicians, and agile defenders.

**Risk:** agile cut-ins and central dribbling may inflate scoring. Defenders must receive the same turning substrate.

### 4. Split control from dribbling

Add `control` and transfer to it:

- First-touch failure.
- Chest trapping.
- One-touch execution.
- Touch cadence under pressure.

Keep `dribbling` for:

- Carry push/noise.
- Changes of direction with the ball.
- Tackle evasion and ball shielding technique.

Passing and finishing should own their respective strike quality rather than borrowing dribbling for generic technique.

**Risk:** control can raise overall pass completion and possession stability. It needs to remain budget-expensive and should not also improve pass accuracy.

### 5. Make strength physical and remove fixed aerial-role skill

Use a bounded mass/balance effect in opposing-player contact, for example:

```ts
effectiveMass = 0.85 + 0.30 * strength;
```

Let it influence:

- Unequal displacement in ground contact.
- Shielding and hold-up success.
- Recovery from bumps.
- Header and clearance power.

Then remove `AERIAL_ROLE` as a permanent position bonus. Aerial outcomes should emerge from strength, awareness/timing, approach velocity, and ball geometry. If that composite still cannot produce distinct aerial specialists, introduce a budgeted `aerial` gene later.

**Risk:** target-player stalls, penalty-area clumping, and an overpowered crossing route. Header share and possession duration under shielding need explicit gates.

My next addition after those five would be **preferred foot plus weak-foot quality**. It is extremely generative, but also carries high route-collapse risk if the weak-foot penalty is large.

The implementation order I would use is: fix the engine/liveness/budget defects, instrument attribute sensitivity, introduce awareness symmetrically, then split pace/agility and control/dribbling. That sequence improves the evolutionary substrate without increasing the number of genes until the current ones are genuinely paying for themselves.
[2mtokens used[0m
286,358
## Bottom line

No: the nine attributes do not currently matter equally or distinctly.

My read is:

- **Pace and defending are disproportionately powerful.**
- **Dribbling is powerful but acts as a catch-all “technique” stat.**
- **Passing, finishing, stamina, and reflexes are live, but each has modelling gaps.**
- **Strength is weak and narrow.**
- **Positioning is effectively a first-touch attribute, not game reading—and is dead for goalkeepers despite consuming their budget.**

I would **not add a tenth `vision` attribute yet**. I would turn the existing `positioning` gene into a genuine, general-purpose **awareness/game-reading attribute**, preserving the current budget dimensionality. The project has correctly identified a missing “eye”, but an attacker-only lane-openness multiplier is the wrong implementation: it creates optimism, not perception.

## 1. Attribute audit

| Attribute | What it actually does | Assessment |
|---|---|---|
| `pace` | Raises top speed and acceleration; fatigue then modulates that speed. It also separately protects the carrier during tackles even though actual carrier velocity is already included. [Player.ts:170](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Player.ts:170), [mechanics.ts:1661](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:1661) | **Overpowered and double-counted.** It also erroneously unlocks `engine`, which reduces stamina drain. |
| `passing` | Reduces pass noise and improves loft, through-ball, cross, cutback, and free-kick execution. [mechanics.ts:271](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:271) | **Live and reasonably distinct**, but ordinary ground-pass selection barely values it. Its effect is more visible on ambitious delivery than routine circulation. |
| `dribbling` | First touch, one-touch execution, ball push/noise, action cadence, tackle resistance, hold-up scoring, and some shot curl/orientation. [mechanics.ts:95](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:95), [actionExecutor.ts:329](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/actionExecutor.ts:329) | **Overloaded.** It conflates close control, first touch, ball carrying, press resistance, and parts of striking technique. |
| `finishing` | Shot aim, spread, power/composure, heading, chips, and free kicks. The brain intentionally does not make high finishers shoot more often. [PlayerBrain.ts:187](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/PlayerBrain.ts:187), [mechanics.ts:1036](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:1036) | **Live but one-dimensional:** mostly chance conversion. Keeping shot preference separate from quality is a good emergent design choice. |
| `defending` | Marker reaction, tackle/slide success, deflections, blocks, aerial contribution, and the disruption of contested finishing. [actionExecutor.ts:206](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/actionExecutor.ts:206), [mechanics.ts:1682](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:1682) | **Very strong and overloaded.** Marking discipline, anticipation, tackling, blocking, and aerial defence cannot evolve independently. |
| `strength` | Some aerial contest value, carrier shielding, and punt-target preference. [mechanics.ts:635](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:635) | **Weak and narrow.** It does not meaningfully govern ground collisions, hold-up selection, displacement, balance, or header power. |
| `stamina` | Drain, recovery, fatigue, top-speed loss, and eligibility for some overlap behaviour. [Player.ts:233](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Player.ts:233), [Player.ts:312](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Player.ts:312) | **Genuinely live**, but its identity is weakened by the `engine` trait bug. |
| `reflexes` | Goalkeeper reach, claims, smothers, and save probability. [mechanics.ts:26](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:26), [mechanics.ts:1863](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:1863) | **Strong and distinct for GKs; completely dead outfield.** The budget excludes it outfield, correctly, but displays/style naming do not. |
| `positioning` | Reduces first-touch and chest-trap failures. [mechanics.ts:95](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:95), [mechanics.ts:819](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:819) | **Misnamed and weak.** It does not affect positioning, runs, marking, support, anticipation, or perception. GK first touch bypasses the check, making it dead for GKs. |

### Important implementation problems

**The budget is not actually liveness-aware.** Goalkeepers pay for `positioning`, `strength`, and `dribbling`; the first is dead and the others are marginal edge-case attributes. [playerGenome.ts:167](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/playerGenome.ts:167)

Moreover, `enforceBudget` computes the cap from selected attributes but then scales **every** attribute, including excluded ones. [playerGenome.ts:184](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/playerGenome.ts:184) That is defensible as a normalization shortcut, but it is not conceptually clean and complicates interpreting selection pressure.

Presentation is also liveness-blind: all attributes participate in player descriptors, so an outfielder can receive a reflex-based “spring cat” identity despite reflexes doing nothing. [playerStyle.ts:109](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/playerStyle.ts:109)

**There is a concrete trait bug.** `engine` is awarded from high `pace`, not high `stamina`, and then reduces stamina drain. [traits.ts:68](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/traits.ts:68), [Player.ts:175](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Player.ts:175) This makes pace even more of a superstat.

**Several major decisions are attribute-blind.** Perception uses exact world state for pressure, lane openness, space, and interception geometry. [perception.ts:14](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:14), [perception.ts:132](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:132), [perception.ts:299](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:299)

Other blind constants include:

- A universal decision interval and turn rate. [constants.ts:234](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/constants.ts:234), [Player.ts:17](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Player.ts:17)
- Pass-contact/reaction probability without awareness. [Match.ts:1819](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Match.ts:1819)
- Chaser, marker, and runner assignment driven primarily by distance, speed, and fixed role weights. [TeamBrain.ts:193](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/TeamBrain.ts:193), [TeamBrain.ts:380](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/TeamBrain.ts:380)
- Equal physical separation in body overlaps regardless of strength. [Match.ts:1852](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Match.ts:1852)

There are also several authored role abilities—not attributes—including fixed aerial role bonuses, WG cross bonuses, and role-weighted runner assignment. [mechanics.ts:619](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/mechanics.ts:619), [PlayerBrain.ts:527](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/PlayerBrain.ts:527), [TeamBrain.ts:110](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/TeamBrain.ts:110) These are more contrary to the emergence philosophy than most attribute-balance issues.

### Directional sensitivity check

I ran deliberately extreme side-balanced probes—whole squads at `0.95` versus `0.05`, neutral tactics. These are diagnostic, not budget-neutral calibration:

- Pace and defending produced enormous match advantages.
- Reflexes produced a clear goalkeeper advantage.
- Strength barely separated the teams.
- The repository positioning probe reduced spills from roughly `6.01` to `4.87`, but did not produce a stable scoring or prevention gradient.

That matches the dataflow audit: positioning is a real first-touch input but not presently a meaningful football-intelligence dimension.

### Missing real-football qualities

Highest-value omissions:

1. **Awareness/anticipation:** perception, reaction, threat reading, and spatial choice.
2. **Agility/balance:** acceleration, turning, deceleration, and body recovery are currently folded into pace or flat constants.
3. **First touch/control:** presently swallowed by dribbling and positioning.
4. **Weak-foot quality/preferred side:** a highly generative substrate for angles, crossing, cut-ins, and passing orientation.
5. **Aerial timing/ability:** currently approximated through strength, defending, and fixed role bonuses.

I would not prioritize splitting goalkeeper reflexes into handling, reach, and positioning yet. The outfield substrate has much larger deficiencies.

## 2. Modelling awareness/game reading

### Recommendation: repurpose `positioning`

Keep the serialized key initially for compatibility, but redefine and label it as **awareness**. A player’s job should emerge from where awareness pays:

- A forward sees a passing lane or blind-side space sooner.
- A midfielder recognizes pressure and support.
- A defender reads a runner or pass.
- A goalkeeper anticipates ball trajectory and loose-ball danger.

That is preferable to a separate `vision` stat because “vision” often becomes attacker-only passing magic. The existing gene already claims the semantic territory and currently has insufficient selection pressure.

### Model perception fidelity, not behaviour preference

Awareness should change the player’s estimate of the state, not directly say “make a clever run” or “play a through-ball.”

For a moving entity:

```ts
const T = Math.min(relevantHorizon, 0.8);
const lookAhead = 0.30 * (awareness - 0.5) * T;
const perceivedPos = pos.add(vel.scale(lookAhead));
```

This gives approximately ±0.12 seconds of bounded anticipation at the longest horizon:

- `awareness === 0.5` preserves current behaviour exactly.
- High awareness projects movement slightly forward.
- Low awareness reasons from slightly stale state.
- There is no randomness and therefore no determinism risk.

For the ball, use the existing friction/flight projection rather than linear extrapolation.

Feed perceived positions into:

- Pressure and lane calculations in [perception.ts:14](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:14) and [perception.ts:132](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/perception.ts:132).
- Recipient and lane evaluation in the pass loop at [PlayerBrain.ts:275](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/PlayerBrain.ts:275).
- Through-ball, cross, and cutback evaluation.
- Marker, chaser, and runner assignment in `TeamBrain`.
- Support-position candidate evaluation rather than the current essentially fixed “ahead of ball” support spot. [formations.ts:546](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/formations.ts:546)

Crucially, retire the `playmaker` multiplier that simply makes true lanes look 15% more open. [PlayerBrain.ts:277](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/PlayerBrain.ts:277) That is optimism, not superior reading.

### Defensive reaction

Keep `defending` as execution quality and let awareness govern how soon the player recognizes the event.

For marker reaction:

```ts
lag = clamp(
  0.45
    - 0.25 * defending
    - 0.18 * (awareness - 0.5),
  0.18,
  0.48,
);
```

This preserves the current formula at neutral awareness while allowing a maximum difference of only ±0.09 seconds. The current site is [actionExecutor.ts:217](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/ai/actionExecutor.ts:217).

For interceptions:

```ts
const readMargin =
  0.95 * ballArrivalTime
  - defenderArrivalTime
  + 0.20 * (awareness - 0.5);

canIntercept = readMargin > 0;
```

Awareness changes whether the player gets going in time; it should not boost sprint speed or tackle success.

The live-pass contact gate at [Match.ts:1829](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/sim/Match.ts:1829) could receive a mild factor:

```ts
pContact *= 1 + 0.35 * (awareness - 0.5);
```

Do not also add awareness to the subsequent control, tackle, or save roll. That would double-pay the attribute.

### Off-ball movement

Longer term, replace authored support/run locations with candidate evaluation:

```text
V(position) =
    wReceive × receivability
  + wThreat  × progress/threat
  + wSpace   × openness
  - wCrowd   × teammate crowding
  - wRisk    × transition exposure
```

The weights are **policy/preference genes**; awareness controls the fidelity with which the player estimates the terms. This preserves the important distinction:

- Policy genes: what the player wants.
- Awareness: how accurately and promptly the player reads the situation.
- Physical/technical attributes: whether they can execute it.

That architecture lets the same awareness gene produce playmakers, poachers, sweepers, and cautious screeners without role checks.

### Failure modes and balance controls

- **Attacker-only scoring inflation:** never give awareness only to lane or chance creation. Ship attacking and defensive perception together.
- **Universal superstat:** awareness must not affect speed, pass accuracy, shot accuracy, tackle success, and perception simultaneously. Keep it in reading/reaction.
- **Defensive strangulation:** cap reaction effects around ±0.1 seconds and do not stack awareness into blocks or tackles.
- **Route collapse:** use the same perceived-state layer for passes, crosses, carries, cutbacks, marking, and interceptions—no through-ball-specific bonus.
- **Prediction omniscience:** extrapolate only current velocity over a bounded horizon. Do not reveal future action choice or RNG.
- **Movement jitter:** cache a target until the next decision tick or until the current choice becomes materially worse.
- **Offside pathologies:** initially continue applying the actual offside law against true positions; do not make awareness an offside exemption.
- **Age curve:** awareness should decline much more slowly than current positioning. I would use a decline weight around `0.4`, versus the current `1.0`. [careers.ts:63](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/careers.ts:63)

Useful acceptance measures are choice regret by awareness decile, interceptions, missed receptions, key passes, xG for/against, route mix, and whether every position evolves awareness toward `1.0`. If it does, the gene is too universally efficient or too cheap.

## 3. Highest-leverage changes

### 1. Convert `positioning` into awareness

Implement the bounded perceived-state and reaction model above.

**Why first:** the simulation currently gives every player essentially perfect eyes, then differentiates only their execution. This is the largest missing source of football intelligence and player individuality.

**Risk:** medium-high. It can become a universal superstat or suppress scoring if defensive anticipation is too strong.

### 2. Make the budget and evolution honest

Use a single role-specific liveness mask for:

- Budget accounting and scaling.
- Mutation/crossover normalization.
- Summaries, nameplates, and derived traits.
- Validation tests.

Either make GK positioning/control/strength meaningful or stop charging for them.

I would also remove the hardcoded `jockeyBias → +defending, −pace` newgen adjustment. [playerGenome.ts:203](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/playerGenome.ts:203) That manufactures a containment archetype instead of allowing it to emerge from selection.

The explicit squad mutation operator also appears unused in production; crossover is called directly. [evolve.ts:247](/Users/jamie/Documents/Promptfoo/evofootball-arena/src/evolution/evolve.ts:247) Variation mainly enters through careers and newgens. I would add small unbiased post-crossover mutation before adding more authored covariances.

**Risk:** greater population variance and slower discovery of currently hand-assisted archetypes.

### 3. Separate agility from pace

Make:

- `pace` govern maximum running speed.
- `agility` govern acceleration, turning, deceleration, and balance/recovery.
- Actual velocity—not the pace gene again—govern momentum-based tackle protection.
- `engine` depend on stamina, fixing the current bug.

A neutral-preserving starting point:

```ts
topSpeed = BASE_SPEED * (0.90 + 0.20 * pace);
accel    = BASE_ACCEL * (0.85 + 0.30 * agility);
turnRate = 6.5        * (0.75 + 0.50 * agility);
```

This creates long-striding runners, explosive turners, slow technicians, and agile defenders.

**Risk:** agile cut-ins and central dribbling may inflate scoring. Defenders must receive the same turning substrate.

### 4. Split control from dribbling

Add `control` and transfer to it:

- First-touch failure.
- Chest trapping.
- One-touch execution.
- Touch cadence under pressure.

Keep `dribbling` for:

- Carry push/noise.
- Changes of direction with the ball.
- Tackle evasion and ball shielding technique.

Passing and finishing should own their respective strike quality rather than borrowing dribbling for generic technique.

**Risk:** control can raise overall pass completion and possession stability. It needs to remain budget-expensive and should not also improve pass accuracy.

### 5. Make strength physical and remove fixed aerial-role skill

Use a bounded mass/balance effect in opposing-player contact, for example:

```ts
effectiveMass = 0.85 + 0.30 * strength;
```

Let it influence:

- Unequal displacement in ground contact.
- Shielding and hold-up success.
- Recovery from bumps.
- Header and clearance power.

Then remove `AERIAL_ROLE` as a permanent position bonus. Aerial outcomes should emerge from strength, awareness/timing, approach velocity, and ball geometry. If that composite still cannot produce distinct aerial specialists, introduce a budgeted `aerial` gene later.

**Risk:** target-player stalls, penalty-area clumping, and an overpowered crossing route. Header share and possession duration under shielding need explicit gates.

My next addition after those five would be **preferred foot plus weak-foot quality**. It is extremely generative, but also carries high route-collapse risk if the weak-foot penalty is large.

The implementation order I would use is: fix the engine/liveness/budget defects, instrument attribute sensitivity, introduce awareness symmetrically, then split pace/agility and control/dribbling. That sequence improves the evolutionary substrate without increasing the number of genes until the current ones are genuinely paying for themselves.
