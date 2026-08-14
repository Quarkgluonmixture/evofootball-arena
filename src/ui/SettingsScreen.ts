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
    const setA4World = (version: A4WorldVersion) => {
      input(a4V1Box).checked = version === 1;
      input(a4V2Box).checked = version === 2;
      input(a4V3Box).checked = version === 3;
      input(mt02Box).checked = version === 4;
      input(mt08Box).checked = version === 5;
      input(cbBox).checked = version === 6;
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
      t('CB · 过人世界:这是第三条线 —— 决斗缺的那一半。带球的人现在可以把球往自己选的方向捅一下、从人身边过去(球是真的离脚的,谁都可能先抢到);而扑上来的防守球员,只要他自己的速度和角度让他刹不住、够不到球,他就是被过了,接下来要花的时间是他自己的身体算出来的(刹车 + 转身 + 追回来),不是一个写死的秒数。两队都开,带球倾向固定在 1.0 —— 这个剂量是给眼睛看的选择,不是结论。屏幕上会给你三样东西:捅球那一下的球的真实轨迹(那条线是球自己走过的路,不是画出来的预测)、被过的人脚下的一圈光(圈跟着他自己的恢复时间收,收完他就能重新上抢了)、以及那一圈从"还在被自己惯性带着走"变成"在往回赶"的颜色变化。量到的:每场约 20.7 次选择捅球,回合(球权持续)从 4.74 秒涨到 5.24 秒,抢断成功率掉到 4.4%,犯规和黄牌都变多。你的眼睛要判的:过人时刻看得见吗?博弈看得出来吗 —— 也就是,防守的人会不会开始"不敢扑"?')));
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
