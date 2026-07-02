import { GENE_KEYS, describeIdentity } from '../evolution/genome';
import { ATTR_KEYS, squadSummary } from '../evolution/playerGenome';
import type { League, PlayerSeasonLine, SeasonRecord } from '../sim/League';
import { raceChart, sparklineTile } from './charts';
import { bar, button, colorHex, el } from './dom';

type Tab = 'league' | 'report' | 'evolution' | 'hall';

const TABS: Array<[Tab, string]> = [
  ['league', 'League'],
  ['report', 'Season report'],
  ['evolution', 'Evolution'],
  ['hall', 'Hall of fame'],
];

/**
 * Full-screen league overlay, four tabs:
 *  League      — standings + team cards (genes, squad DNA, lineage)
 *  Report      — last season: awards, points race, champions history
 *  Evolution   — gene/attribute drift sparklines across generations
 *  Hall of fame — all-time records mined from season history
 */
export class LeagueScreen {
  readonly root: HTMLElement;
  private visible = false;
  private tab: Tab = 'league';
  private league: League | null = null;

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
    this.league = league;
    this.root.textContent = '';
    this.root.appendChild(
      el('h2', '', `League — Generation ${league.generation} · Season ${league.history.length + 1} · Round ${league.currentRound()}/7`),
    );

    const nav = el('div', 'row tab-nav');
    for (const [tab, label] of TABS) {
      const b = button(label, () => {
        this.tab = tab;
        this.render(league);
      });
      b.classList.toggle('active', tab === this.tab);
      nav.appendChild(b);
    }
    this.root.appendChild(nav);

    switch (this.tab) {
      case 'league':
        this.renderStandings(league);
        this.root.appendChild(el('h2', '', 'Team cards'));
        this.renderCards(league);
        break;
      case 'report':
        this.renderReport(league);
        break;
      case 'evolution':
        this.renderEvolution(league);
        break;
      case 'hall':
        this.renderHall(league);
        break;
    }
  }

  /* ---------------- League tab ---------------- */

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
      if (fit) card.appendChild(el('div', 'muted', `last-season fitness: ${fit.total.toFixed(3)}`));

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

  /* ---------------- Season report tab ---------------- */

  private renderReport(league: League): void {
    const rec = league.history[league.history.length - 1];
    if (!rec) {
      this.root.appendChild(el('div', 'muted', 'No completed seasons yet — simulate one!'));
      this.renderCurrentScorers(league);
      return;
    }

    const headline = el('div', 'report-headline');
    headline.innerHTML = `🏆 <b>Season ${rec.generation}</b> — champions: <b>${rec.championName}</b> (${rec.table[0].pts} pts, GD ${rec.table[0].gf - rec.table[0].ga})`;
    this.root.appendChild(headline);

    if (rec.pointsTimeline) {
      this.root.appendChild(el('h2', '', 'Points race'));
      this.root.appendChild(
        raceChart(
          rec.pointsTimeline.map((values, slot) => {
            // Abbreviate "Solar Wolves" -> "S.Wolves" so three *Wolves teams
            // stay distinguishable in the end labels.
            const full = rec.table.find((r) => r.slot === slot)?.name ?? `#${slot}`;
            const words = full.split(' ');
            const name = words.length > 1 ? `${words[0][0]}.${words.slice(1).join(' ')}` : full;
            return { name, color: league.franchise(slot).colors.primary, values };
          }),
          Math.max(...rec.pointsTimeline.map((v) => v.length)),
        ),
      );
    }

    if (rec.awards) {
      this.root.appendChild(el('h2', '', 'Awards'));
      this.root.appendChild(this.awardsBlock(rec));
    } else {
      this.root.appendChild(el('div', 'muted', 'No award data for this season (pre-v3 save).'));
    }

    this.renderCurrentScorers(league);

    this.root.appendChild(el('h2', '', 'Champions history'));
    for (const r of [...league.history].reverse()) {
      const entry = el('div', 'history-entry');
      const boot = r.awards?.topScorers[0];
      entry.innerHTML =
        `<b>Season ${r.generation}</b> — 🏆 <b>${r.championName}</b>` +
        (boot ? ` · ⚽ ${boot.name} (${boot.team}) ${boot.goals}g` : '');
      this.root.appendChild(entry);
    }
  }

  private awardsBlock(rec: SeasonRecord): HTMLElement {
    const wrap = el('div', 'cards');
    const mk = (title: string, lines: PlayerSeasonLine[], fmt: (l: PlayerSeasonLine) => string) => {
      const card = el('div', 'team-card');
      card.appendChild(el('div', 'team-head', title));
      if (lines.length === 0) card.appendChild(el('div', 'muted', '—'));
      for (const l of lines) card.appendChild(el('div', '', fmt(l)));
      wrap.appendChild(card);
    };
    mk('⚽ Golden Boot', rec.awards!.topScorers, (l) => `${l.name} (${l.team}) — ${l.goals}g ${l.assists}a`);
    mk('🅰️ Playmaker', rec.awards!.topAssists, (l) => `${l.name} (${l.team}) — ${l.assists}a ${l.goals}g`);
    mk('🧤 Golden Glove', rec.awards!.topKeeper ? [rec.awards!.topKeeper] : [], (l) => `${l.name} (${l.team}) — ${l.saves} saves`);
    return wrap;
  }

  private renderCurrentScorers(league: League): void {
    const lines = league
      .playerLines()
      .filter((l) => l.goals > 0)
      .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
      .slice(0, 5);
    if (lines.length === 0) return;
    this.root.appendChild(el('h2', '', 'Top scorers (current season)'));
    for (const l of lines) {
      this.root.appendChild(el('div', 'history-entry', `⚽ ${l.name} (${l.team}, ${l.role}) — ${l.goals}g ${l.assists}a`));
    }
  }

  /* ---------------- Evolution tab ---------------- */

  private renderEvolution(league: League): void {
    const withGenes = league.history.filter((r) => r.geneMeans);
    this.root.appendChild(el('h2', '', 'Tactical gene drift (league mean per generation)'));
    if (withGenes.length === 0) {
      this.root.appendChild(el('div', 'muted', 'Finish a season to start tracking gene drift.'));
    } else {
      const grid = el('div', 'spark-grid');
      for (const k of GENE_KEYS) {
        grid.appendChild(sparklineTile(k, withGenes.map((r) => r.geneMeans![k])));
      }
      this.root.appendChild(grid);

      this.root.appendChild(el('h2', '', 'Squad attribute drift'));
      const attrGrid = el('div', 'spark-grid');
      const withAttrs = league.history.filter((r) => r.attrMeans);
      for (const k of ATTR_KEYS) {
        attrGrid.appendChild(sparklineTile(k, withAttrs.map((r) => r.attrMeans![k]), '#4ade80'));
      }
      this.root.appendChild(attrGrid);
    }

    const last = league.history[league.history.length - 1];
    if (last) {
      this.root.appendChild(el('h2', '', `Last evolution (gen ${last.generation} → ${last.generation + 1})`));
      for (const e of last.evolution.entries) {
        const icon = e.kind === 'elite' ? '👑' : e.kind === 'mutated' ? '🧬' : '🔄';
        const par = e.parents ? ` ← ${e.parents.join(' × ')}` : '';
        this.root.appendChild(
          el('div', 'history-entry', `${icon} ${e.name}${par} · fitness ${e.fitness.toFixed(3)} · drift ${e.drift.toFixed(2)}`),
        );
      }
    }
  }

  /* ---------------- Hall of fame tab ---------------- */

  private renderHall(league: League): void {
    const h = league.history;
    if (h.length === 0) {
      this.root.appendChild(el('div', 'muted', 'No history yet — the hall opens after the first season.'));
      return;
    }

    // Titles by franchise name.
    const titles = new Map<string, number>();
    for (const r of h) titles.set(r.championName, (titles.get(r.championName) ?? 0) + 1);
    this.root.appendChild(el('h2', '', '🏆 Titles'));
    for (const [name, n] of [...titles.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)) {
      this.root.appendChild(el('div', 'history-entry', `${'🏆'.repeat(Math.min(n, 8))} ${name} — ${n}`));
    }

    // Single-season records mined from the history.
    this.root.appendChild(el('h2', '', '📜 Records (single season)'));
    const rows: string[] = [];
    let bestPts: { v: number; who: string; gen: number } | null = null;
    let bestGd: { v: number; who: string; gen: number } | null = null;
    let peakElo: { v: number; who: string; gen: number } | null = null;
    let bestScorer: { v: number; who: string; gen: number } | null = null;
    let bestKeeper: { v: number; who: string; gen: number } | null = null;
    for (const r of h) {
      const top = r.table[0];
      if (!bestPts || top.pts > bestPts.v) bestPts = { v: top.pts, who: top.name, gen: r.generation };
      for (const row of r.table) {
        const gd = row.gf - row.ga;
        if (!bestGd || gd > bestGd.v) bestGd = { v: gd, who: row.name, gen: r.generation };
        if (row.elo !== undefined && (!peakElo || row.elo > peakElo.v)) {
          peakElo = { v: row.elo, who: row.name, gen: r.generation };
        }
      }
      const boot = r.awards?.topScorers[0];
      if (boot && (!bestScorer || boot.goals > bestScorer.v)) {
        bestScorer = { v: boot.goals, who: `${boot.name} (${boot.team})`, gen: r.generation };
      }
      const glove = r.awards?.topKeeper;
      if (glove && (!bestKeeper || glove.saves > bestKeeper.v)) {
        bestKeeper = { v: glove.saves, who: `${glove.name} (${glove.team})`, gen: r.generation };
      }
    }
    if (bestPts) rows.push(`Most points: <b>${bestPts.v}</b> — ${bestPts.who} (S${bestPts.gen})`);
    if (bestGd) rows.push(`Best goal difference: <b>${bestGd.v > 0 ? '+' : ''}${bestGd.v}</b> — ${bestGd.who} (S${bestGd.gen})`);
    if (peakElo) rows.push(`Peak Elo: <b>${peakElo.v}</b> — ${peakElo.who} (S${peakElo.gen})`);
    if (bestScorer) rows.push(`Most goals: <b>${bestScorer.v}</b> — ${bestScorer.who} (S${bestScorer.gen})`);
    if (bestKeeper) rows.push(`Most saves: <b>${bestKeeper.v}</b> — ${bestKeeper.who} (S${bestKeeper.gen})`);
    for (const r of rows) {
      const div = el('div', 'history-entry');
      div.innerHTML = r;
      this.root.appendChild(div);
    }

    // Dynasty strips: one row per slot, colored by era survival.
    this.root.appendChild(el('h2', '', '🧬 Dynasty timeline (per league slot)'));
    this.root.appendChild(el('div', 'muted', '👑 elite · 🧬 mutated · 🔄 reborn (new name)'));
    for (const f of this.league!.franchises) {
      const strip = el('div', 'dynasty-row');
      const dot = el('span', 'dot');
      dot.style.background = colorHex(f.colors.primary);
      strip.append(dot, el('span', 'g-name', f.name));
      const cells = el('span', 'dynasty-cells');
      for (const r of h) {
        const e = r.evolution.entries.find((x) => x.slot === f.slot);
        const cell = el('span', 'dynasty-cell', e ? (e.kind === 'elite' ? '👑' : e.kind === 'mutated' ? '🧬' : '🔄') : '·');
        if (e) cell.title = `S${r.generation}: ${e.name}${e.parents ? ` ← ${e.parents.join(' × ')}` : ''}`;
        cells.appendChild(cell);
      }
      strip.appendChild(cells);
      this.root.appendChild(strip);
    }
  }
}
