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
    // RA WORLD (ruling #364 item 3 / #365, docs/world-model/RA-ENTRY-RUNG.md): world 11 plus the
    // five delivery/access doors at the RA-T1B exam pins — the arc the user's own reality
    // question opened (#358). Same single value; the A/B this gate is about is v11 vs v12.
    const raBox = checkbox(t('传球先问赶不赶得到 · 接应时间入价 1.0 (play-test)'),
      a4WorldInitial === 12, (v) => setA4World(v ? 12 : 0));
    // BQ CUSHION WORLD (ruling #386 item 5, docs/world-model/BQ-ENTRY-RUNG.md): world 12 plus
    // the ONE cushion door at BQ-T1's ARMED composition — the receiver who reaches a pass keeps
    // it. Same single value, so arming it still disarms every other world; the A/B this gate is
    // about is v12 vs v13.
    const bqBox = checkbox(t('缓冲留球 · 球跟着人走,三拍之后还在脚边 (play-test)'),
      a4WorldInitial === 13, (v) => setA4World(v ? 13 : 0));
    // LN OWN-LANE WORLD (ruling #396 item 4, docs/world-model/LN-ENTRY-RUNG.md): world 13 plus
    // the ONE own-lane door at LN-T1′b's W025 pin (`lnOwnLaneWeight` = 0.25) — the passer's
    // pricers finally see his own men in the lane. Same single value, so arming it still
    // disarms every other world; the A/B this gate is about is v13 vs v14.
    const lnBox = checkbox(t('看见自己人 · 传球者的每套定价都看得见线上的队友 (play-test)'),
      a4WorldInitial === 14, (v) => setA4World(v ? 14 : 0));
    // GK DIVE WORLD (ruling #402 item 5, docs/world-model/GK-ENTRY-RUNG.md): world 14 plus the
    // ONE dive door at GK-T1's E14-ARMED composition — the keeper's body goes to
    // the ball he caught, and the caught ball stops teleporting into his feet. NO dose and NO
    // gene: the law introduced no new constant. Same single value, so arming it still disarms
    // every other world; the A/B this gate is about is v14 vs v15.
    const gkBox = checkbox(t('身体跟着手走 · 门将扑到球,球停在手上等身体到 (play-test)'),
      a4WorldInitial === 15, (v) => setA4World(v ? 15 : 0));
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
      input(raBox).checked = version === 12;
      input(bqBox).checked = version === 13;
      input(lnBox).checked = version === 14;
      input(gkBox).checked = version === 15;
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
      t('门将不再往人身上开球 —— 走廊价格 0.5。上面那个世界,再加上一条价格:开高球的人 —— 门将的大脚、边路的转移吊传、越顶的挑传、门将的手抛球 —— 现在会先算一下这条线上有没有人挡着。挡得越死,这脚球在他心里越不划算;这不是禁令,也没有人去抬高球的弧线,只是让"往人身上开"要付钱,选哪一脚仍然是他自己比出来的。权重固定在 0.5(两队都开、不会进化):那是整条梯子上碰球回弹掉得最狠的一档,而且从 0.5 往上再加已经看不出区别了。量到的(BK-T4,60 对种子):你说的那个画面 —— 门将开出去的球在飞行中撞到人 —— 从每次门将出球 0.0951 降到 0.0378,门将身前最密的那一格被挡下的比例 .435 → .170(这一对发表在梯子的 0 档与 1 档;0.5 档没有单独发表这一格),而不该被这个价格影响的地面传中和平快传一动没动(这就是说,变的确实是这条线,不是整场比赛)。⚠ 代价说在最前面:高球本身被开得更少了 —— 每场 3.78 → 1.47 脚。而且这不是剂量调错:整条梯子上每一档都是这样(1.45–2.02),所以这是结构性的。他学会的是「别开」,还没学会「换条线开」—— 因为量最大的那种挑传,它的每一条线上几乎都有人,没有别的线可选。要让他学会换条线,得让价格进到"选谁"那一步,那是被点名、还没派的一刀。另外:传球完成率没有因此恢复(0.602 → 0.593,几档都一样平)。⚠⚠ 还有一件必须说的:走廊价格和上面那个会思考的防守,从来没有一起量过 —— BK-T4 的两条臂跑的都是没有防守开关的那个世界。这一档是它们第一次同场,你的眼睛就是第一次观测。你的眼睛要判的:门将的球看着讲理了吗?高球还敢不敢开?对比对象是上面的 v10,不是原版。⚠ 注意:你看的是屏幕上这一场;联赛后台快速模拟的比赛跑的是原版世界(联赛存档不带这些开关)。')));
    exp.appendChild(raBox);
    // ⭐ #365 — THE BLURB CARRIES THE COST (the world plays FEWER passes; a measured style
    // shift, not a hidden regression) AND THE UNMEASURED COMPOSITION (the exams ran the
    // EMPTY-BOOK form; the dosed default is this entry's first look).
    exp.appendChild(el('div', 'muted',
      t('传球先问赶不赶得到 —— 接应时间入价 1.0。上面那个世界,再加上传球这条线欠得最久的一问。这一档一共开五扇门,全部是「定价与表达」,没有一条禁令:一,同一脚传球现在有两个候选 —— 传到脚下,或者往他跑动的方向顶(两个候选在同一张桌上比价,谁高踢谁);二,九宫格选点 —— 方向×力度各三档,踢哪一格他自己比出来;三,地面走廊要付钱 —— 线路上挡着人的传球在他心里更不划算;四,出脚真的踢向脑子选中的那个点(以前脑子选了往前顶,腿却照旧往脚下踢 —— 那是接缝的毛病,不是足球);五,⭐ 最要紧的新价格:传向一个队友赶不到的点,按他差的秒数付钱 —— 用的账就是接球人自己追球的那本(距离÷他此刻的速度+0.15 秒反应,站在原地的球不收钱),在意程度固定在 1.0(两队都开、不会进化)。这条线是从你自己那句「用 vision 和现实重新想一想,为什么现实不这样」长出来的:普查量到被选中的提前球有 72.8% 队友根本赶不到,而贴脚传球五万三千脚里零误报 —— 于是先给了执照,再落了席位,再考了两轮。量到的(RA-T1B,495 对种子):赶不到的提前球每场 3.91 → 2.82(确定,任何一个种子拿掉都不翻);射门 11.7 → 12.2(升,确定);被断球 27.9 → 27.3(降,确定);进球 3.14 → 3.16(持平);还在飞的那些提前球,完成率 47.7% → 53.5%。⚠ 代价说在最前面:整体传球变少了 —— 每场地面传球少约 2.1 脚,其中约 1.3 脚正是被删掉的"传给空气"的球,剩下的是球员在只剩烂传球可选的位置改成带球或持球;传球成功率反而升了约半个百分点。按老尺子(传球计数不许跌)这一档是不及格的 —— 我们换成了教练的尺(创造不减、丢球不增)它才通过,这两把尺、两次考试、换尺的理由全部记录在案。所以真正要你眼睛回答的正是老尺子答不了的那个问题:少传两脚球、多几次带球的比赛,更好看还是更闷?⚠ 还有一件必须说的:两轮考试跑的都是空账本形态(&pcdose=0 那一档);默认这一档带成熟账本,是这套门第一次和成熟账本同场,你的眼睛就是第一次观测。你的眼睛要判的:提前球像给人的球了吗?带球变多的场面像足球吗?对比对象是上面的 v11,不是原版。⚠ 注意:你看的是屏幕上这一场;联赛后台快速模拟的比赛跑的是原版世界(联赛存档不带这些开关)。')));
    exp.appendChild(bqBox);
    // ⭐ #386 item 5 — THE BLURB CARRIES THE HONEST BRIEF: what the door does, THE COST (the
    // defender's poke inside the three-tick window falls — the exam's own FAIL conjunct, banked
    // as the fail of record) and THE FIRST-LOOK DISCLOSURE (the user's three sentences did NOT
    // move; the visible carom off a teammate in the lane is NOT this door's — steps ②/③).
    exp.appendChild(el('div', 'muted',
      t('缓冲留球 —— 脚碰到球,球跟着人走,三拍之后还在脚边。上面那个世界,再加上一扇门,而且只有这一扇。以前:球碰到人会被推开一点(碰撞把球往外弹),球和人不同步,人追不上那一点点就算没拿住。现在:碰到球的那一瞬间,球拿到的就是这个人自己的速度 —— 没有多出来的推力,也没有新的常数,零就是"不推"。量到的(BQ-T1,998 对种子;下面这一组就是你现在玩的这一档,带成熟账本):传给他、他也够到了,却没拿住的比例 0.188637 → 0.117556 —— 大约从五个丢一个变成八个丢一个;「碰到了,但球滚出了够得着的范围」这一整类几乎消失,占传球尝试的 0.077366 → 0.001666;他自己脚下弹开的比例 0.220583 → 0.142724。⚠ 代价说在最前面,而且这一条正是考试没过的那一条:对手在这三拍窗口里把球戳走的次数,每场 1.900802 → 1.406814 —— 少了大约四分之一次。球被人贴着带走了,确实更难戳,这是真实足球里也成立的事;而防守整体没有被削弱:抢断 2.183367 → 2.205411、被断球 30.845691 → 31.079158,两个区间都含零,没有动。窗口里那一戳,本来就只是防守每场大约三十次夺球里的一次。⚠⚠ 还有一件必须说清楚的:你自己说过的那三句话 —— 对手先碰到球、球从侧后方来、有人挤人 —— 在这次考试里三个区间全部含零,一句都没有动。你眼睛看到的那种「弹回」(球撞到站在传球线上的队友再弹开),不是这扇门的事:这扇门修的是接球人自己那一下的走形;队友挡在线路上的那一类,是后面②/③两步的活,那两步还没做。⚠ 老实说一句:一次真实的停球其实会留下一点点相对速度(球被放进半米的空当,或者被脚底压死),留多少这个引擎没量过,所以这一档收零 —— 零是"没有推力",不是拟合出来的数字。你的眼睛要判的:该接球的那个人在拉扯中的第一脚,球还在他脚边吗?防守那一戳还看得到吗?对比对象是上面的 v12,不是原版。⚠ 注意:你看的是屏幕上这一场;联赛后台快速模拟的比赛跑的是原版世界(联赛存档不带这些开关)。')));
    exp.appendChild(lnBox);
    // ⭐ #396 item 4 — THE BLURB CARRIES THE HONEST BRIEF: what the door does, THE COST SAID
    // FIRST (fewer and shorter passes), THE PLAYED FORM'S RECEIPT (the mature book was
    // measured at w = 0.5, not at the 0.25 pinned here — said plainly) and THE FIRST-LOOK
    // DISCLOSURE (passes struck at OPPONENTS and 有人挤人 are NOT this door's; the receiver's
    // own bobble is world 13's, kept).
    exp.appendChild(el('div', 'muted',
      t('看见自己人 —— 传球者的每套定价都看得见线上的队友。上面那个世界(v13),再加上一扇门,而且只有这一扇。以前:传球者给每条传球线打分的时候,只看得见站在线上的对手,看不见自己人 —— 开球那一脚回敲的评分,连线都不看。现在:线上有自己人的那条线,他要多付一点代价(在意程度 0.25 分),踢哪一条仍然是他自己比出来的 —— 这是定价,不是禁令。量到的(LN-T1′b,69 对种子,空账本那一档,w = 0.25):传出去先撞到非目标队友的比率 0.102798 → 0.058788;开球那一脚回敲撞到自己人的比率 0.575499 → 0.189112。⚠ 代价说在最前面:每场传球少了 —— 74.579710 → 71.246377 脚(线都被自己人挡着的时候,他会持球,或者改传短的);平均传球距离 14.492657 → 14.347704 米(这一格的区间含零,没有确定)。有利的一面也照实说:传球成功率 0.592215,升了 0.023227(区间不含零,确定);被断球每场 27.173913,降了 2.565217(确定);越位、进球、射门三格的区间都含零,没有动。⚠⚠ 还有一件必须说清楚的:你玩的这一档是成熟账本,而成熟账本上这扇门只在 w = 0.5 那一档量过 —— 传出去先撞到非目标队友的比率 0.089528 → 0.040022(w = 0.5)。这里钉的是 0.25,所以你这一档的数字是推断,不是测量,说清楚。⚠ 别期待的三件事:传到对面身上(0.321803 的传球是对手先碰到)不是这扇门的事;有人挤人也不是;接球人自己那一下的走形是 v13 修的(那一扇你已经 keep 了)。你的眼睛要判的:开球那一脚回敲 —— 还会不会砸在队友背上?人多的地方传球 —— 他现在是不是挑那条没自己人的线?代价 —— 他是不是多拿了一拍、或者传得更短?⭐ 这扇门也给门将的出球定价:门将传球的账本行数 499 → 454(LN-T1′b,69 对种子,空账本,w = 0.25)—— 他出球会少一点。对比对象是 v13(你 keep 的那个),同一台设备,?a4world=14 对 ?a4world=13。⚠ 注意:你看的是屏幕上这一场;联赛后台快速模拟的比赛跑的是原版世界(联赛存档不带这些开关)。')));
    exp.appendChild(gkBox);
    // ⭐ #402 item 5 — THE BLURB CARRIES THE HONEST BRIEF, THE COST SAID FIRST and every number
    // a GK-T1 FIELD at 6 dp: `guard.timeToDistributionTicks` (353.194605, Δ +2.738122
    // [−6.924280, +12.052622] — UNRESOLVED, the interval CONTAINS ZERO, and the blurb says so
    // rather than selling an unresolved cost as a resolved one) · `wait.meanTicks` 82.609375 ·
    // `wait.overSpriteShare` 0.819444 · `release.ownershipLoss` 58 of 591 ·
    // `guard.xgConversion` 1.465122 / Δ −0.054493 (tolerated) · the WIN
    // `r1.catchMaxOverOneMetreShare` on BOTH arms with each arm NAMED (E13 empty-book
    // 0.835740 → 0.104907; D13 mature 0.843111 → 0.117733 — the form the user plays, MEASURED
    // this time) and stated as an UPPER BOUND · the first-look disclosure
    // `claim.meanNextDisplacementMetres` 1.388442 → 1.353315 (the high-ball claim sets no
    // contact and still snaps — not this door's).
    exp.appendChild(el('div', 'muted',
      t('身体跟着手走 —— 门将扑到球,球停在手上等身体到。上面那个世界(v14),再加一扇门,而且只有这一扇:门将扑到球的那一刻,球不再瞬间跳到他脚下 —— 球停在他手碰到的地方,他的身体跑过去接上;扑出去的球只动身体不动球;没有新常数,他跑过去的速度就是他的跑速。⚠ 代价说在最前面:从接球到出球的时间(G8)—— 对照 353.194605 帧,差 +2.738122 帧,区间 [−6.924280, +12.052622] 含零 —— 没量出变慢,但也不是零,照实说。等球的那段:身体跑到球那里平均 82.609375 帧,其中 0.819444 比 0.7 秒的扑救动画更长 —— 你会看到球停着、门将跑过去。等的时候球被对手抢走:591 次接球里 58 次(E13 空账本)。xG 转化:对照 1.465122,差 −0.054493,区间不含零但远在容差内 —— 进球对射门质量的换算略降,照实说。⭐ 量到的:接住的球在门将手里那段、单帧跳超过 1 米的比率 —— 空账本 0.835740 → 0.104907;你玩的这一档(成熟账本)0.843111 → 0.117733。剩下那一成是等球时被抢走、或死球重置那一帧算进去的,不是法则还在跳 —— 所以这是上限,不是「还会跳」的测量值。护栏:进球、扑救、接球率、射门、传球成功率、被断、门将持球与出球次数都没破护栏。⚠ 别期待的几件事:高球没收那一下还是会跳(1.388442 → 1.353315 米)—— 不是这扇门的事;扑救动画还是原来的 0.7 秒,渲染没改;禁区外用脚接住的球没有保护圈。你的眼睛要判的:门将扑救那一刻 —— 球是不是还瞬移到他脚下?扑住之后 —— 球停在原地、门将跑过去接,还是像以前一样球飞到他身上?代价 —— 他出球是不是慢了一拍?对比对象是 v14,同一台设备,?a4world=15 对 ?a4world=14。⚠ 注意:你看的是屏幕上这一场;联赛后台快速模拟的比赛跑的是原版世界(联赛存档不带这些开关)。')));
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
