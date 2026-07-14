import { GENE_KEYS } from '../evolution/genome';
import { dimStats, nameplateFor, styleValues } from '../evolution/styleSpace';
import type { League } from '../sim/League';
import { geneRadar, type RadarSeries } from './charts';
import { button, colorHex, el } from './dom';
import { lang, t } from './i18n';
import { buildCeremony, geneAxisLabels, genomeValues, type CeremonyDeath } from './rebirth';

/**
 * The rebirth ceremony (Phase 32.5): season end as an EVENT you watch, not a
 * ledger line. Who survived crowned, whose identity mutated, and — the
 * centerpiece — which clubs died and what their successors inherited: a
 * parent-vs-child gene radar with the novel mutations highlighted, plus the
 * formation/scheme identity handed down from the dominant parent.
 *
 * Presentation only: everything here is mined from the latest SeasonRecord
 * (see ui/rebirth.ts); the sim and evolution results are already decided.
 */
export class RebirthCeremony {
  readonly root: HTMLElement;
  private visible = false;
  private onClose: () => void;

  constructor(host: HTMLElement, onClose: () => void) {
    this.onClose = onClose;
    this.root = el('div');
    this.root.id = 'rebirth-screen';
    this.root.classList.add('hidden');
    host.appendChild(this.root);
  }

  get isVisible(): boolean {
    return this.visible;
  }

  show(league: League): void {
    const rec = league.history[league.history.length - 1];
    if (!rec) return;
    const model = buildCeremony(rec, league.franchises);
    this.root.textContent = '';

    const head = el('div', 'ceremony-head');
    head.appendChild(el('h2', '', `🧬 ${t('Rebirth ceremony')} — ${t('Gen')} ${model.fromGen} → ${model.toGen}`));
    const close = button(t('✕ Close'), () => this.hide());
    close.classList.add('ceremony-close');
    head.appendChild(close);
    this.root.appendChild(head);
    this.root.appendChild(el('div', 'muted', t('The pyramid turns over: the weakest Challenger clubs die, and champions breed their successors.')));

    if (model.elites.length > 0) {
      this.root.appendChild(el('div', 'ceremony-line', `👑 ${t('Survived untouched (elite)')}: ${model.elites.join(' · ')}`));
    }
    for (const s of model.switches) {
      this.root.appendChild(el('div', 'ceremony-line', `${s.note.replace('🔧', `🔧 ${s.name}`)}`));
    }

    this.root.appendChild(el('h2', '', `💀 ${t('Died and reborn')}`));
    const cards = el('div', 'cards ceremony-cards');
    for (const d of model.deaths) cards.appendChild(this.deathCard(d, league));
    this.root.appendChild(cards);

    const cont = button(`${t('Continue')} ▶`, () => this.hide());
    cont.classList.add('ceremony-continue');
    this.root.appendChild(cont);

    this.visible = true;
    this.root.classList.remove('hidden');
    this.root.scrollTop = 0;
  }

  hide(): void {
    if (!this.visible) return;
    this.visible = false;
    this.root.classList.add('hidden');
    this.onClose();
  }

  private deathCard(d: CeremonyDeath, league: League): HTMLElement {
    const card = el('div', 'team-card rebirth-card');

    const head = el('div', 'team-head rebirth-head');
    const dot = el('span', 'dot');
    if (d.colors) dot.style.background = colorHex(d.colors.primary);
    head.append(
      el('span', 'rebirth-dead', `💀 ${d.oldName}`),
      el('span', 'rebirth-arrow', '→'),
      dot,
      el('span', 'rebirth-born', `🐣 ${d.newName}`),
    );
    card.appendChild(head);
    card.appendChild(el('div', 'muted', `${t('fitness at death')}: ${d.fitness.toFixed(3)} · ${t('gene drift')}: ${d.drift.toFixed(2)}`));

    // Parents with their kit chips — the radar's identity channel.
    if (d.parents.length === 2) {
      const par = el('div', 'rebirth-parents');
      par.appendChild(el('span', 'muted', `${t('parents')}: `));
      d.parents.forEach((p, i) => {
        if (i > 0) par.appendChild(el('span', 'muted', ' × '));
        const chip = el('span', 'dot');
        const c = d.parentColors[i];
        chip.style.background = c ? colorHex(c.primary) : '#8294b5';
        par.append(chip, document.createTextNode(` ${p}`));
      });
      card.appendChild(par);
    }

    if (d.childGenome) {
      const labels = geneAxisLabels(lang);
      const axes = GENE_KEYS.map((k, i) => ({ label: labels[i], title: t(k) }));
      const series: RadarSeries[] = [];
      if (d.parentGenomes) {
        d.parentGenomes.forEach((g, i) => {
          const c = d.parentColors[i];
          series.push({
            values: genomeValues(g),
            color: c ? colorHex(c.primary) : '#8294b5',
            name: d.parents[i] ?? `P${i + 1}`,
            dashed: true,
          });
        });
      }
      series.push({
        values: genomeValues(d.childGenome),
        color: d.colors ? colorHex(d.colors.primary) : '#4ade80',
        name: d.newName,
        fill: true,
      });
      const hot = new Set(d.mutated);
      card.appendChild(geneRadar(axes, series, {
        size: 200,
        highlight: GENE_KEYS.map((k) => hot.has(k)),
      }));

      const tags = el('div', 'tags');
      for (const m of d.mutated) {
        const idx = GENE_KEYS.indexOf(m);
        tags.appendChild(el('span', 'tag mut', `✨ ${labels[idx]}`));
      }
      if (d.mutated.length === 0) tags.appendChild(el('span', 'tag', t('no novel mutations — a true heir')));
      card.appendChild(tags);

      // The inherited identity: formations/scheme from the dominant parent,
      // plus what the child genome reads as at birth.
      const idTags = el('div', 'tags');
      if (d.inheritedStyle) {
        idTags.appendChild(el('span', 'tag', `⚔ ${d.inheritedStyle.formationAtk}`));
        idTags.appendChild(el('span', 'tag', `🛡 ${d.inheritedStyle.formationDef}`));
        idTags.appendChild(el('span', 'tag', t(d.inheritedStyle.scheme === 'man' ? 'man-marking' : 'zonal')));
      }
      // Data-driven nameplate (Phase 49): the newborn's identity relative to
      // the CURRENT population (policy dims read DEFAULT — the child's policy
      // snapshot isn't recorded; genes carry the signal here).
      const stats = dimStats(league.franchises.map((f) => styleValues({ genome: f.coach.genome, policy: f.coach.policy })));
      for (const word of nameplateFor(styleValues({ genome: d.childGenome }), stats)) {
        idTags.appendChild(el('span', 'tag nameplate', t(word)));
      }
      card.appendChild(idTags);
    }

    return card;
  }
}
