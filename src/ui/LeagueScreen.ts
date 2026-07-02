import { GENE_KEYS, describeIdentity } from '../evolution/genome';
import { ATTR_KEYS, squadSummary } from '../evolution/playerGenome';
import type { League } from '../sim/League';
import { bar, colorHex, el } from './dom';

/**
 * Full-screen league overlay: standings, team cards (identity + genes +
 * fitness + lineage) and season/evolution history.
 */
export class LeagueScreen {
  readonly root: HTMLElement;
  private visible = false;

  constructor(host: HTMLElement) {
    this.root = el('div');
    this.root.id = 'league-screen';
    this.root.classList.add('hidden');
    host.appendChild(this.root);
  }

  get isVisible(): boolean {
    return this.visible;
  }

  toggle(league: League): void {
    this.visible = !this.visible;
    this.root.classList.toggle('hidden', !this.visible);
    if (this.visible) this.render(league);
  }

  refreshIfVisible(league: League): void {
    if (this.visible) this.render(league);
  }

  render(league: League): void {
    this.root.textContent = '';
    this.root.appendChild(
      el('h2', '', `League — Generation ${league.generation} · Season ${league.history.length + 1} · Round ${league.currentRound()}/7`),
    );

    this.renderStandings(league);
    this.root.appendChild(el('h2', '', 'Team cards'));
    this.renderCards(league);
    this.root.appendChild(el('h2', '', 'Season & evolution history'));
    this.renderHistory(league);
  }

  private renderStandings(league: League): void {
    const table = el('table');
    const thead = el('thead');
    const hr = el('tr');
    const cols = ['#', 'Team', 'P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts', 'Elo'];
    cols.forEach((c, i) => hr.appendChild(el('th', i >= 2 ? 'num' : '', c)));
    thead.appendChild(hr);
    table.appendChild(thead);

    const tbody = el('tbody');
    league.standings().forEach((row, i) => {
      const tr = el('tr');
      tr.appendChild(el('td', '', String(i + 1)));
      const nameTd = el('td');
      const dot = el('span', 'dot');
      dot.style.background = colorHex(row.franchise.colors.primary);
      dot.style.marginRight = '6px';
      nameTd.append(dot, document.createTextNode(row.franchise.name));
      tr.appendChild(nameTd);
      for (const v of [row.played, row.w, row.d, row.l, row.gf, row.ga, row.gf - row.ga, row.pts, Math.round(row.franchise.elo)]) {
        tr.appendChild(el('td', 'num', String(v)));
      }
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    this.root.appendChild(table);
  }

  private renderCards(league: League): void {
    const cards = el('div', 'cards');
    const lastSeason = league.history[league.history.length - 1];

    for (const f of league.franchises) {
      const card = el('div', 'team-card');

      const head = el('div', 'team-head');
      const dot = el('span', 'dot');
      dot.style.background = colorHex(f.colors.primary);
      head.append(dot, el('span', '', `${f.name} · Elo ${Math.round(f.elo)}`));
      card.appendChild(head);

      const tags = el('div', 'tags');
      for (const t of describeIdentity(f.genome)) tags.appendChild(el('span', 'tag', t));
      card.appendChild(tags);

      for (const key of GENE_KEYS) {
        const row = el('div', 'gene-row');
        row.appendChild(el('div', 'g-name', key));
        const b = bar(f.genome[key], colorHex(f.colors.primary));
        b.style.gridColumn = '2 / 4';
        row.appendChild(b);
        card.appendChild(row);
      }

      // Squad DNA: attribute averages across the five players.
      card.appendChild(el('div', 'muted', 'squad (avg attributes):'));
      const summary = squadSummary(f.squad);
      for (const k of ATTR_KEYS) {
        const row = el('div', 'gene-row');
        row.appendChild(el('div', 'g-name', k));
        const b = bar(summary[k], '#60a5fa');
        b.style.gridColumn = '2 / 4';
        row.appendChild(b);
        card.appendChild(row);
      }

      const fit = lastSeason?.fitness.find((x) => x.slot === f.slot);
      if (fit) {
        card.appendChild(el('div', 'muted', `last-season fitness: ${fit.total.toFixed(3)}`));
      }

      const lin = el('div', 'lineage');
      for (const entry of [...f.lineage].reverse().slice(0, 6)) {
        const icon = entry.event === 'elite' ? '👑' : entry.event === 'mutated' ? '🧬' : entry.event === 'reborn' ? '🔄' : '🌱';
        const parents = entry.parents ? ` ← ${entry.parents.join(' × ')}` : '';
        const note = entry.note ? ` (${entry.note})` : '';
        lin.appendChild(el('div', '', `g${entry.generation} ${icon} ${entry.event}${parents}${note}`));
      }
      card.appendChild(lin);

      cards.appendChild(card);
    }
    this.root.appendChild(cards);
  }

  private renderHistory(league: League): void {
    if (league.history.length === 0) {
      this.root.appendChild(el('div', 'muted', 'No completed seasons yet — simulate one!'));
      return;
    }
    for (const rec of [...league.history].reverse()) {
      const entry = el('div', 'history-entry');
      entry.appendChild(el('div', '', ''));
      const title = el('div');
      title.innerHTML = `<b>Season ${rec.generation}</b> — champion: <b>${rec.championName}</b>`;
      entry.appendChild(title);
      const evo = rec.evolution.entries
        .map((e) => {
          const icon = e.kind === 'elite' ? '👑' : e.kind === 'mutated' ? '🧬' : '🔄';
          const par = e.parents ? ` ← ${e.parents.join(' × ')}` : '';
          return `${icon} ${e.name}${par}`;
        })
        .join('  ·  ');
      entry.appendChild(el('div', '', evo));
      this.root.appendChild(entry);
    }
  }
}
