import { button, checkbox, el } from './dom';
import { lang, setLang, t } from './i18n';
import type { GameActions, UiFlags } from './actions';
import type { EdsPreviewMode } from '../game/edsPreview';
import type { A4WorldVersion } from '../game/a4World';

const FLAG_LABELS: Array<[keyof UiFlags, string]> = [
  ['actionLabels', t('Player action labels')],
  ['formation', t('Formation targets')],
  ['passLines', t('Pass target line')],
  ['shotVector', t('Shot vector')],
  ['marking', t('Marking lines')],
  ['chasers', t('Press assignments')],
  ['heatmap', t('Ball heatmap')],
  ['perception', t('Perception sandbox (select a player · 3D)')],
  ['perceptionGaze', t('  ↳ what-if gaze cone (hypothetical)')],
];

/**
 * THE SETTINGS SCREEN (Phase 119a.5 — user ask: "保存/种子/调试图层/切换语言
 * 这种都进单独的设置界面"). Everything administrative moves off the topbar
 * and the match panel into one quiet room: saves, the seed / new-league
 * controls, language, and the debug overlays. The topbar keeps only the
 * four destinations + ⚙; the left panel keeps only what you touch while
 * actually watching a match.
 *
 * Built once (plain static controls — no league data), toggled like the
 * other stage screens.
 */
export class SettingsScreen {
  readonly root: HTMLElement;
  private visible = false;

  constructor(
    host: HTMLElement,
    actions: GameActions,
    flags: UiFlags,
    emergentInitial = false,
    edsPreviewInitial: EdsPreviewMode = 'off',
    a4WorldInitial: A4WorldVersion = 0,
  ) {
    this.root = el('div');
    this.root.id = 'settings-screen';
    this.root.classList.add('hidden');
    host.appendChild(this.root);

    this.root.appendChild(el('h2', '', `⚙ ${t('Settings')}`));

    // ---- saves ----
    const saves = el('div', 'settings-section');
    saves.appendChild(el('h3', '', `💾 ${t('Saves')}`));
    const saveRow = el('div', 'row');
    saveRow.append(
      button(t('Save'), () => actions.saveNow()),
      button(t('Load'), () => actions.loadNow()),
      button(t('Export'), () => actions.exportSave()),
      button(t('Import'), () => actions.importSave()),
    );
    saves.appendChild(saveRow);
    saves.appendChild(el('div', 'muted',
      t('Saves live in this browser. Export downloads a JSON you can import anywhere.')));
    this.root.appendChild(saves);

    // ---- new league / seed ----
    const league = el('div', 'settings-section');
    league.appendChild(el('h3', '', `🌱 ${t('New league')}`));
    const seedRow = el('div', 'row');
    const seedInput = el('input');
    seedInput.type = 'text';
    seedInput.placeholder = t('seed');
    seedRow.append(seedInput, button(t('New league'), () => actions.newLeague(seedInput.value)));
    league.appendChild(seedRow);
    league.appendChild(el('div', 'muted', t('Same seed, same world — words work too.')));
    const resetRow = el('div', 'row');
    resetRow.appendChild(button(t('Reset'), () => actions.resetAll(), 'danger'));
    league.appendChild(resetRow);
    league.appendChild(el('div', 'muted', t('Reset wipes the save and starts the default world.')));
    this.root.appendChild(league);

    // ---- language ----
    const language = el('div', 'settings-section');
    language.appendChild(el('h3', '', `🌐 ${t('Language')}`));
    const langRow = el('div', 'row');
    langRow.appendChild(button(lang === 'zh' ? 'English' : '中文', () => setLang(lang === 'zh' ? 'en' : 'zh')));
    language.appendChild(langRow);
    language.appendChild(el('div', 'muted', t('Switching language reloads the page.')));
    this.root.appendChild(language);

    // ---- debug overlays (moved from the match panel) ----
    const dbg = el('div', 'settings-section');
    dbg.appendChild(el('h3', '', `🧪 ${t('Debug overlays')}`));
    for (const [key, label] of FLAG_LABELS) {
      dbg.appendChild(checkbox(label, flags[key], (v) => actions.setFlag(key, v)));
    }
    dbg.appendChild(el('div', 'muted', t('Paints tactical internals onto the pitch view.')));
    this.root.appendChild(dbg);

    // ---- experimental (Phase B — the emergent positioning field) ----
    const exp = el('div', 'settings-section');
    exp.appendChild(el('h3', '', `🧬 ${t('Experimental')}`));
    exp.appendChild(checkbox(t('Emergent positioning (no fixed formations)'), emergentInitial,
      (v) => actions.setEmergentPos(v)));
    exp.appendChild(el('div', 'muted',
      t('Positions grow from role + genes + the live game instead of fixed formation tables. To judge it: enable, START A NEW LEAGUE, watch a few gen-0 matches (rough), let it evolve ~10 seasons, then watch again — good shape should EMERGE. Old saves were evolved for the fixed system.')));
    // EDS E4-PREP (ruling #14.3), extended to the audited TRIPLE by #22.5: the
    // play-test instrument. Default OFF — all of this has passed its probes and
    // none of it has passed the user's eyes.
    //
    // Two checkboxes, but only THREE states are reachable: off, the v1 pair, and
    // the pair plus the value axis. The value axis alone has never been audited,
    // so arming it arms the pair, and disarming the pair disarms it. The mode is
    // what leaves this screen; the boxes are only how it is typed.
    const previewBox = checkbox(t('EDS preview: players act on what they SEE'),
      edsPreviewInitial !== 'off', (v) => setMode(v ? 'v1' : 'off'));
    const valueBox = checkbox(t('  ↳ …and price passes by measured shot value'),
      edsPreviewInitial === 'triple', (v) => setMode(v ? 'triple' : 'v1'));
    const input = (wrap: HTMLElement) => wrap.querySelector('input') as HTMLInputElement;
    const setMode = (mode: EdsPreviewMode) => {
      input(previewBox).checked = mode !== 'off';
      input(valueBox).checked = mode === 'triple';
      actions.setEdsPreview(mode);
    };
    exp.appendChild(previewBox);
    exp.appendChild(el('div', 'muted',
      t('The passer picks his target from his OWN view (a man he cannot see cannot be passed to) and the defender reads his own view of the ball. Takes effect at the NEXT kickoff, so you can A/B it mid-season. Measured: play gets CALMER — later tackles, better-supported passes, fewer loose-ball scrambles — and a full match spends less of the stamina tank. Judge whether calm feels like football.')));
    exp.appendChild(valueBox);
    exp.appendChild(el('div', 'muted',
      t('On top of the above: the passer prices every option by how often that pass has actually LED TO A SHOT, instead of by how likely it is to arrive. Measured: a more DIRECT game — more forward passes than the legacy brain, shots +22%, goals unchanged — but markedly fewer slow-developing wide patterns (an overlap release roughly halves). The question only you can answer is whether the direct game is better football.')));
    // A4 PLAY-TEST ENTRY (ruling #155; the SECOND world added by #167.5): the
    // certified worlds, armed on BOTH teams. Default OFF; whichever is armed
    // overrides the EDS preview above (it contains that bundle plus the rest of
    // the census substrate). TWO boxes, but a single value: the worlds are
    // MUTUALLY EXCLUSIVE (no blends — arming one disarms the other), exactly the
    // EDS mode idiom above, so the A/B is always between two clean worlds.
    const a4V1Box = checkbox(t('A4 world v1 · 统一约定 (play-test)'), a4WorldInitial === 1,
      (v) => setA4World(v ? 1 : 0));
    const a4V2Box = checkbox(t('A4 world v2 · 纪律 (play-test)'), a4WorldInitial === 2,
      (v) => setA4World(v ? 2 : 0));
    const a4V3Box = checkbox(t('A4 world v3 · 出球前摇 (play-test)'), a4WorldInitial === 3,
      (v) => setA4World(v ? 3 : 0));
    // MT PLAY-TEST WORLDS (ruling #211.3): a DIFFERENT family from the A4 worlds
    // above — the dose ladder's own measured arms, made watchable. Same single
    // value, so arming one still disarms every other world.
    const mt02Box = checkbox(t('MT 0.2 · 松盯内收 (play-test)'), a4WorldInitial === 4,
      (v) => setA4World(v ? 4 : 0));
    const mt08Box = checkbox(t('MT 0.8 · 松盯内收 对比 (play-test)'), a4WorldInitial === 5,
      (v) => setA4World(v ? 5 : 0));
    // CB PLAY-TEST WORLD (ruling #269.4, contract M-CB.3): a THIRD family — the carry-beat
    // arc's own both-armed arm, made watchable, with the visibility affordances that arc owes
    // the eye. Same single value, so arming it still disarms every other world.
    const cbBox = checkbox(t('CB · 过人世界 (play-test)'), a4WorldInitial === 6,
      (v) => setA4World(v ? 6 : 0));
    // L3 DEFENCE-BOOK WORLD (ruling #282.4, docs/world-model/L3-ENTRY-RUNG.md): the SAME third
    // family one layer further on — the carry world plus a defence that remembers its own missed
    // lunges and declines the ones its own book condemns. Same single value, so arming it still
    // disarms every other world; the A/B this gate is about is v6 vs v7.
    const l3Box = checkbox(t('CB+防守账本 · 会学的防守 (play-test)'), a4WorldInitial === 7,
      (v) => setA4World(v ? 7 : 0));
    // PC PROCESSING-TIME WORLD (ruling #300 item 6, docs/world-model/PC-ENTRY-RUNG.md): the same
    // third family one layer further on again — the defence-book world plus a body who has to SEE
    // before he reacts. Same single value, so arming it still disarms every other world; the A/B
    // this gate is about is v7 vs v8.
    const pcBox = checkbox(t('CB+防守账本+反应延迟 · 有处理时间的世界 (play-test)'),
      a4WorldInitial === 8, (v) => setA4World(v ? 8 : 0));
    // BK BODY-HONEST WORLD (ruling #309 item 5, docs/world-model/BK-ENTRY-RUNG.md): the same
    // third family one layer further on again — the processing-time world plus a body that has to
    // TURN before it can kick and that the ball can actually hit. Same single value, so arming it
    // still disarms every other world; the A/B this gate is about is v8 vs v9.
    const bkBox = checkbox(t('身体诚实的世界 · 转身才能踢,球会撞到人 (play-test)'),
      a4WorldInitial === 9, (v) => setA4World(v ? 9 : 0));
    // DF DEFENSIVE-BRAIN WORLD (ruling #337 item 5, docs/world-model/ENTRIES-W10-W11.md): the same
    // third family one layer further on again — the body-honest world plus a defence that keeps
    // its man and prices its own options, WITH THE PHASE-31 CAP INTACT (H-DF.4 failed; the cap
    // stays of record). Same single value; the A/B this gate is about is v9 vs v10.
    const dfBox = checkbox(t('会思考的防守 · 盯住人,自己给选择定价 (play-test)'),
      a4WorldInitial === 10, (v) => setA4World(v ? 10 : 0));
    // CORRIDOR WORLD (ruling #337 item 5, the same doc): world 10 plus BK-T3's corridor price at
    // BK-T4's rung 0.5. Same single value; the A/B this gate is about is v10 vs v11.
    const crBox = checkbox(t('门将不再往人身上开球 · 走廊价格 0.5 (play-test)'),
      a4WorldInitial === 11, (v) => setA4World(v ? 11 : 0));
    const setA4World = (version: A4WorldVersion) => {
      input(a4V1Box).checked = version === 1;
      input(a4V2Box).checked = version === 2;
      input(a4V3Box).checked = version === 3;
      input(mt02Box).checked = version === 4;
      input(mt08Box).checked = version === 5;
      input(cbBox).checked = version === 6;
      input(l3Box).checked = version === 7;
      input(pcBox).checked = version === 8;
      input(bkBox).checked = version === 9;
      input(dfBox).checked = version === 10;
      input(crBox).checked = version === 11;
      actions.setA4World(version);
    };
    exp.appendChild(a4V1Box);
    exp.appendChild(el('div', 'muted',
      t('Both teams get the measured "where we stand" agreement — the whisper-volume version of a kickabout deciding who covers what — on top of the eye that makes players act on what they SEE. Measured: resolvedly fewer balls let into deep areas AND into the box, with the football checks all holding. What only your eyes can rule: does the compactness look like STRUCTURE or like a huddle? Takes effect immediately — the current match restarts in the new world, and a badge in the corner tells you which world you are watching.')));
    exp.appendChild(a4V2Box);
    exp.appendChild(el('div', 'muted',
      t('v2 · 纪律:同样的开局约定,但每个位置对它的松紧不同 —— 后卫紧、中场居中、前锋松(球队平均松紧和 v1 完全一样)。这套松紧经过三轮考试认证:它跟仪器版世界一模一样、每项足球检查都过关,量到的是抢球乱战更少、越位更少、死球时间更短、球员之间更有空间、配合(第三人跑动)更多。你的眼睛要判的:防守知道往哪走了吗?哨声少了吗?紧凑像球队还是像一堆人?v1 与 v2 只能开一个,方便你来回对比。')));
    exp.appendChild(a4V3Box);
    exp.appendChild(el('div', 'muted',
      t('v3 · 出球前摇:v2 的纪律世界,再加上短传的出球前摇 —— 球不再在决定的那一瞬间就飞出去,出球前有一个看得见的摆腿窗口,技术好的人摆得快、跑动中或急转身时摆得慢。一脚出球(一触即传)、开球和各种死球发球都不受影响。量到的:出球确实慢了(接球到出球 +0.043 秒)、丢球变少(每分钟 −0.18 次),比赛的进球和传中等大局都没被打乱;老实说,回合(球权持续)只变长了一点点 —— 慢慢出球只是节奏问题的小一半。你的眼睛要判的:摆腿看得见吗?节奏手感比 v2 好还是差?防守多出来的封堵窗口用上了吗?v1/v2/v3 只能开一个。')));
    exp.appendChild(mt02Box);
    exp.appendChild(el('div', 'muted',
      t('MT 0.2 · 松盯内收:这是另一条线的世界 —— 跟上面的约定世界无关,防守端两个改动一起开:盯人的球员在球飞行的时候不再贴死,而是松开一点、身位往中间收;同时后防线整体朝球所在的那条通道靠。两队都开,剂量固定在 0.2(裁定下来的那一档),不会进化、不会自己变大。老实说:0.2 这一档量到的身位变化只有 −0.59 米,在尺子的分辨率以下 —— 眼睛很可能看不出来。想看清机制请开下面的 0.8 对比世界。你的眼睛要判的:弱侧后卫还乱转吗?防守知道往哪走了吗?')));
    exp.appendChild(mt08Box);
    exp.appendChild(el('div', 'muted',
      t('MT 0.8 · 对比:同一个世界,剂量调到 0.8 —— 这是给眼睛看的那一档。量到的:弱侧身位 −2.40 米(确定),防守确实更靠得住;代价也是确定的 —— 进球从 2.19 掉到 1.73,头球少四成多,长传和传中都变少。梯子上每一档都是这个交易,没有免费的剂量:防守真的开始起作用,空中和边路的戏就会变少。所以真正要你回答的是:进球变少的世界,好看还是难看?看完这一档再回到 0.2 对比。')));
    exp.appendChild(cbBox);
    exp.appendChild(el('div', 'muted',
      t('CB · 过人世界:这是第三条线 —— 决斗缺的那一半。带球的人现在可以把球往自己选的方向捅一下、从人身边过去(球是真的离脚的,谁都可能先抢到);而扑上来的防守球员,只要他自己的速度和角度让他刹不住、够不到球,他就是被过了,接下来要花的时间是他自己的身体算出来的(刹车 + 转身 + 追回来),不是一个写死的秒数。两队都开,带球倾向固定在 1.0 —— 这个剂量是给眼睛看的选择,不是结论。屏幕上会给你三样东西:捅球那一下的球的真实轨迹(那条线是球自己走过的路,不是画出来的预测)、被过的人脚下的一圈光(圈跟着他自己的恢复时间收,收完他就能重新上抢了)、以及那一圈从"还在被自己惯性带着走"变成"在往回赶"的颜色变化。量到的:每场约 16 次捅球(本档冒烟测出的频率,换算到 240 秒一场的真实比赛时钟;大约每 15 秒一次),回合(球权持续)从 4.74 秒涨到 5.24 秒,抢断成功率掉到 4.4%,犯规和黄牌都变多。你的眼睛要判的:过人时刻看得见吗?博弈看得出来吗 —— 也就是,防守的人会不会开始"不敢扑"?')));
    exp.appendChild(l3Box);
    exp.appendChild(el('div', 'muted',
      t('CB+防守账本 · 会学的防守:上面那个过人世界,再加上防守自己的账本 —— 一支球队会记住自己扑空过多少次、其中有多少次是真的被人过掉了,然后在它自己的账本说"从这个速度扑上去更吃亏"的时候,把这一次上抢收回来(只会收回、永远不会多扑一次)。你会看到的那句话:防守不再全速飞铲了 —— 对抗次数几乎没变,但都是收着来的。量到的(每队每场):全速飞铲从 2.26 次掉到 0(账本已经学满的默认档),收着的对抗反而从 15.20 升到 17.01,总对抗只少了 2.6% —— 挑战没有被放弃,只是晚一点、在控制中再上。老实说三件事:一,世界不是更平静了,反而稍微更快了一点(回合短了约 2%,丢球更频繁了一点,这跟事先写下的预期正好相反,已经公开记在案);二,进球没有变;三,犯规和黄牌各少约 6% 那个数字属于"空账本"那一档(?l3dose=0),默认这一档没量出确定的变化。默认这一档给的是"这课已经学满"的世界(实验里要十二个赛季才能自己长到这里),在网址后面加 &l3dose=0 就是照现在的规矩、账本从零开始的那一档。你的眼睛要判的:这看着像博弈(会挑时候),还是像磨蹭(不敢上)?对比对象是上面的 v6,不是原版。')));
    exp.appendChild(pcBox);
    exp.appendChild(el('div', 'muted',
      t('CB+防守账本+反应延迟 · 有处理时间的世界:上面那个世界,再加上这条线最缺的一样东西 —— 处理时间。原来的世界里,球一变向,场上所有人同一帧就知道了;现在一个人被"意外"到的时候(丢球、被捅球、折射、出球…),他会继续执行上一个念头一小段时间:自己账本里熟悉的场面付 0.20 秒,没见过的场面付 0.45 秒。所以防守者要先看见再反应,而过人真的能买到时间。量到的(PC-T2,200 对种子):账本成熟时 94.9% 的意外走短档,空账本只有 11.6%;被过掉的人,走短档的在 0.9 秒里丢 0.344 米,走长档的丢 1.416 米 —— 4.1 倍。老实说三件事:一,这是本纲领里第一次"病灶"真的动了 —— 丢球率 68.5% → 61.0%(−7.5 个百分点)、被断球每场 −3.47 次、回合从 4.11 秒涨到 4.62 秒;二,最大的那一格来自"无知"而不是"成熟" —— 空账本世界比原来多丢 1.243 米,成熟世界只多 0.167 米:过人买到的时间,是对手没学过这一课的那部分;三,进球 +0.50 和传球成功率 +1.6 个百分点都只是"边缘"档,别当结论。网址后面加 &pcdose=0 是全新手世界 —— 这一档最野:没有人认得任何场面,全场都慢半拍,过人会容易得多;默认那一档才是更微妙的那个。你的眼睛要判的:防守是不是真的慢半拍了?过人看起来像"骗过了他"还是像"他卡住了"?对比对象是上面的 v7,不是原版。⚠ 注意:后台快速模拟的比赛跑的是原版世界(联赛存档不带这些开关),这一档只在你正在看的那场比赛里成立。')));
    exp.appendChild(bkBox);
    // ⭐ #309 item 5 — THE BLURB CARRIES THE COST. Both scored hypotheses passed and one measured
    // face went the other way (pass completion −8.9 pp); a play-test brief that printed only the
    // wins would be asking the user's eyes about a world that does not exist.
    exp.appendChild(el('div', 'muted',
      t('身体诚实的世界 — 转身才能踢,球会撞到人。上面那个世界,再加上这条线欠得最久的两样东西。一,踢球要先转身:出球的准备时间里现在包含了他真正欠的那个转身,完全反身大约要多花 0.48 秒 —— 这是时间,不是禁令,背对着捅一脚仍然可以,只是要付钱。二,球会撞到人:刚踢完球的人不再是透明的,球撞在他身上会真的弹开(他碰到不等于他拿到 —— 他仍然控不住球)。量到的(BK-T2,40 对种子):出球前的准备时间 6.44 → 10.00 帧,一场比赛多付 3.10 秒;背对着出球的比例 33.3% → 23.1%;球穿过人的画面每场 118 → 45 帧,少了六成。注意:传球更难了(完成率约降 9 个百分点)——传球的大脑还没学会躲开身体。这是诚实的代价,不是 bug:真实世界里传球也会被腿挡出去,但真实传球的人知道躲。还有一件要说的:球弹回门将多了约四成 —— 以前穿过身体飞走的球,现在会弹回来。网址后面加 &pcdose=0 还是上一档那个全新手世界(这一层没有自己的剂量)。你的眼睛要判的:传球像人了吗?球不再穿人了吗?门将的球看着讲理了吗?对比对象是上面的 v8,不是原版。⚠ 注意:你看的是屏幕上这一场;联赛后台快速模拟的比赛跑的是原版世界(联赛存档不带这些开关)。')));
    exp.appendChild(dfBox);
    // ⭐ #337 item 5 — THE BLURB CARRIES THE HONEST STATE: H-DF.4 failed all three conjuncts, so
    // the Phase-31 cap STAYS, and DF-T4's own receipt for what it is worth is printed here.
    exp.appendChild(el('div', 'muted',
      t('会思考的防守 —— 盯住人,自己给选择定价。上面那个世界,再加上这条线欠得最久的东西:一个会思考的防守。一,盯人不再每次球一动就整队重新分配:他就守他那个人(以前每传一次球,全队就把"谁盯谁"从头抢一遍,这就是你看到的乱跑)。二,每个防守球员现在都用同一套账给自己的选择定价 ——上抢持球的人、守住我这个人、退回去补位、在身体接触里把球断下来 —— 用的是引擎本来就有的账,没有新的评分表。量到的:换人盯的频率每防守分钟 15.47 → 5.59 次(DF-T0,两个区间完全不相交);一个盯人的球员原来平均每 3.7 秒换一次人,现在是每 9.9 秒,而且守住人的时间反而更长(63.4% → 65.6%,DF-T1);上抢也真的落地了 —— 场上给到他的机会里,27.9% → 40.7% 变成了真的贴上去(DF-T3);好的后卫真的更愿意上抢:防守属性最高的三分之一比最低的三分之一多 2.4 倍(DF-T3 量到、DF-T3B 在 121 个种子上重新证过)。⚠ 老实说最重要的一件事:那条写死的老规矩还在——「一个人上抢,压迫的时候两个,永远不许三个」。这条规矩是当年没有任何东西给上抢定价时你自己下的令,我们本来打算等新的脑子长出来就把它撤掉,而且真的拿掉试过一次(DF-T4,41 对种子)。结果是:拿掉帽子,人又堆到球上去了 —— 四个人一起抢球的画面从 0 涨到 13,069 帧,三个人以上抢球从 9.7% 涨到 17.0%,而每个防守球员守住自己人的时间从 66.0% 掉到 64.1%(一个被派去抢球的人,就是一个没在盯人的人)。原因也量清楚了:定价的那个脑子根本看不见"派几个人去抢球"这个决定 ——那是另一个座位。所以帽子留着,并且现在它有一张写着"它值多少"的收据;把那个座位也变成一个有价格的决定,是排在后面的一刀。你的眼睛要判的:防守像在思考吗?乱跑消失了吗?赛季后期还守得住吗?对比对象是上面的 v9,不是原版。⚠ 注意:你看的是屏幕上这一场;联赛后台快速模拟的比赛跑的是原版世界(联赛存档不带这些开关)。')));
    exp.appendChild(crBox);
    // ⭐ #337 item 5 — THE BLURB CARRIES THE COST (lofted volume falls, STRUCTURALLY) AND THE
    // ONE UNMEASURED COMPOSITION (corridor × DF brain — BK-T4 ran the world-9 stack WITHOUT the
    // DF flags). A play-test brief that printed only the promise would ask the user's eyes
    // about a world that does not exist.
    exp.appendChild(el('div', 'muted',
      t('门将不再往人身上开球 —— 走廊价格 0.5。上面那个世界,再加上一条价格:开高球的人 —— 门将的大脚、边路的转移吊传、越顶的挑传、门将的手抛球 —— 现在会先算一下这条线上有没有人挡着。挡得越死,这脚球在他心里越不划算;这不是禁令,也没有人去抬高球的弧线,只是让"往人身上开"要付钱,选哪一脚仍然是他自己比出来的。权重固定在 0.5(两队都开、不会进化):那是整条梯子上碰球回弹掉得最狠的一档,而且从 0.5 往上再加已经看不出区别了。量到的(BK-T4,60 对种子):你说的那个画面 —— 门将开出去的球在飞行中撞到人 —— 从每次门将出球 0.0951 降到 0.0378,门将身前最密的那一格被挡下的比例 .435 → .170,而不该被这个价格影响的地面传中和平快传一动没动(这就是说,变的确实是这条线,不是整场比赛)。⚠ 代价说在最前面:高球本身被开得更少了 —— 每场 3.78 → 1.47 脚。而且这不是剂量调错:整条梯子上每一档都是这样(1.45–2.02),所以这是结构性的。他学会的是「别开」,还没学会「换条线开」—— 因为量最大的那种挑传,它的每一条线上几乎都有人,没有别的线可选。要让他学会换条线,得让价格进到"选谁"那一步,那是被点名、还没派的一刀。另外:传球完成率没有因此恢复(0.602 → 0.593,几档都一样平)。⚠⚠ 还有一件必须说的:走廊价格和上面那个会思考的防守,从来没有一起量过 —— BK-T4 的两条臂跑的都是没有防守开关的那个世界。这一档是它们第一次同场,你的眼睛就是第一次观测。你的眼睛要判的:门将的球看着讲理了吗?高球还敢不敢开?对比对象是上面的 v10,不是原版。⚠ 注意:你看的是屏幕上这一场;联赛后台快速模拟的比赛跑的是原版世界(联赛存档不带这些开关)。')));
    this.root.appendChild(exp);
  }

  get isVisible(): boolean {
    return this.visible;
  }

  toggle(): void {
    this.visible = !this.visible;
    this.root.classList.toggle('hidden', !this.visible);
  }

  hide(): void {
    this.visible = false;
    this.root.classList.add('hidden');
  }
}
