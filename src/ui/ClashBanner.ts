import { GENE_KEYS } from '../evolution/genome';
import { nameplates, type StyleSource } from '../evolution/styleSpace';
import type { Match } from '../sim/Match';
import { deriveTeamStyle } from '../sim/types';
import { geneRadar } from './charts';
import { colorHex, el } from './dom';
import { lang, t } from './i18n';
import { geneAxisLabels, genomeValues } from './rebirth';

/**
 * Pre-match clash (Phase 32.5): both teams' tactical DNA side by side —
 * gene radar, identity tags, formation pair + scheme — so every fixture
 * reads as a clash of identities before kickoff. A broadcast graphic, not a
 * modal: it never blocks play, auto-dismisses shortly after kickoff
 * (GameApp watches sim time), and a tap closes it immediately.
 */
export class ClashBanner {
  readonly root: HTMLElement;
  private visible = false;

  constructor(host: HTMLElement) {
    this.root = el('div');
    this.root.id = 'clash-banner';
    this.root.classList.add('hidden');
    this.root.addEventListener('click', () => this.hide());
    host.appendChild(this.root);
  }

  get isVisible(): boolean {
    return this.visible;
  }

  show(match: Match, contextLabel: string, population?: StyleSource[]): void {
    this.root.textContent = '';
    const mid = el('div', 'clash-mid');
    mid.append(el('div', 'clash-vs', 'VS'), el('div', 'clash-ctx muted', contextLabel));
    this.root.append(this.sideCard(match, 0, population), mid, this.sideCard(match, 1, population));
    this.root.appendChild(el('div', 'clash-hint muted', t('tap to dismiss')));
    this.visible = true;
    this.root.classList.remove('hidden');
  }

  hide(): void {
    this.visible = false;
    this.root.classList.add('hidden');
  }

  private sideCard(match: Match, side: 0 | 1, population?: StyleSource[]): HTMLElement {
    const info = match.teams[side].info;
    const style = info.style ?? deriveTeamStyle(info.genome);
    const card = el('div', 'clash-card');

    const head = el('div', 'team-head');
    const dot = el('span', 'dot');
    dot.style.background = colorHex(info.colors.primary);
    head.append(dot, el('span', '', info.name));
    card.appendChild(head);

    const labels = geneAxisLabels(lang);
    const axes = GENE_KEYS.map((k, i) => ({ label: labels[i], title: t(k) }));
    card.appendChild(geneRadar(axes, [{
      values: genomeValues(info.genome),
      color: colorHex(info.colors.primary),
      name: info.name,
      fill: true,
    }], { size: 150 }));

    const tags = el('div', 'tags');
    tags.appendChild(el('span', 'tag', `⚔ ${style.formationAtk}`));
    tags.appendChild(el('span', 'tag', `🛡 ${style.formationDef}`));
    tags.appendChild(el('span', 'tag', t(style.scheme === 'man' ? 'man-marking' : 'zonal')));
    // Data-driven nameplate (Phase 49): identity relative to the current
    // league population; both teams appended so exhibition sides still rank.
    const pool: StyleSource[] = [
      ...(population ?? []),
      { genome: match.teams[0].info.genome, policy: match.teams[0].info.policy },
      { genome: match.teams[1].info.genome, policy: match.teams[1].info.policy },
    ];
    const plate = nameplates(pool)[pool.length - 2 + side];
    for (const word of plate) tags.appendChild(el('span', 'tag nameplate', t(word)));
    card.appendChild(tags);
    return card;
  }
}
