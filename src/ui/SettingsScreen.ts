import { button, checkbox, el } from './dom';
import { lang, setLang, t } from './i18n';
import type { GameActions, UiFlags } from './actions';
import type { EdsPreviewMode } from '../game/edsPreview';

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
