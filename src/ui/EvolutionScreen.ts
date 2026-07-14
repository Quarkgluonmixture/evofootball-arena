import { GENE_KEYS } from '../evolution/genome';
import type { Franchise } from '../evolution/franchise';
import { ATTR_KEYS, SQUAD_BUDGET, SQUAD_ROLES, squadSummary, squadTotal } from '../evolution/playerGenome';
import {
  STYLE_DIMS, dimStats, nameplateFor, styleSpread, styleValues, topVarianceDims, type DimStat,
} from '../evolution/styleSpace';
import { TRAIT_EMOJI, traitsOf } from '../evolution/traits';
import type { League } from '../sim/League';
import { attrHeatmap, geneRadar, sparklineTile, stackedShareStrip, type RadarSeries } from './charts';
import { bar, button, colorHex, el } from './dom';
import { lang, t } from './i18n';
import { geneAxisLabels, genomeValues, parentChain } from './rebirth';

const INK_MUTED = '#8294b5';
const GRID = '#24304a';
const SURFACE = '#0d1526';

/** One playable frame of the league's style history. */
interface StyleFrame {
  label: string;
  bySlot: Map<number, number[]>;
}

const EVENT_COLOR: Record<string, string> = {
  founded: '#4a5a7a',
  elite: '#f5c542',
  mutated: '#2a3a5c',
  reborn: '#ef4444',
  promoted: '#34d399',
  relegated: '#f59e0b',
};
const EVENT_ICON: Record<string, string> = {
  founded: '·', elite: '👑', mutated: '·', reborn: '💀', promoted: '⬆', relegated: '⬇',
};

/**
 * The EVOLUTION CENTER (Phase 51) — evolution gets its OWN screen (user
 * report: the league screen is DATA; the evolution story deserves a stage,
 * not a tab of tiles). Architecture, hero first:
 *   1. the style-space map with a GENERATION SCRUBBER + play button — watch
 *      the league's styles drift, season by season (styleMatrix history);
 *   2. a club deep-dive panel (tap any dot / dynasty row): nameplate, radar,
 *      the club's OWN most-moved style dims over time, budget, squad, lineage;
 *   3. the dynasty wall — 16 slots × generations of elite/reborn/promotion
 *      events at a glance;
 *   4. population trends (divergence, formation shares, budget heatmap) with
 *      the full gene/attr tile wall folded into a <details>.
 * Everything reads records + live franchises; no sim writes, no rng.
 */
export class EvolutionScreen {
  readonly root: HTMLElement;
  private visible = false;
  private league: League | null = null;
  private selectedSlot = 0;
  /** Index into frames() — null means "latest". */
  private frameIdx: number | null = null;
  private playTimer: number | null = null;
  /** Set by GameApp: reopen the latest rebirth ceremony. */
  onShowCeremony: (() => void) | null = null;

  constructor(host: HTMLElement) {
    this.root = el('div');
    this.root.id = 'evolution-screen';
    this.root.classList.add('hidden');
    host.appendChild(this.root);
  }

  get isVisible(): boolean {
    return this.visible;
  }

  toggle(league: League): void {
    this.visible = !this.visible;
    this.root.classList.toggle('hidden', !this.visible);
    if (this.visible) {
      this.selectedSlot = league.standings(0)[0]?.slot ?? 0;
      this.frameIdx = null;
      this.render(league);
    } else {
      this.stopPlay();
    }
  }

  hide(): void {
    if (!this.visible) return;
    this.visible = false;
    this.root.classList.add('hidden');
    this.stopPlay();
  }

  refreshIfVisible(league: League): void {
    if (this.visible) this.render(league);
  }

  /* ---------------- data ---------------- */

  private clubs(league: League): Franchise[] {
    return [...league.division(0), ...league.division(1)];
  }

  /** History styleMatrix snapshots + the LIVE population as the last frame. */
  private frames(league: League): StyleFrame[] {
    const out: StyleFrame[] = [];
    for (const r of league.history) {
      if (!r.styleMatrix) continue;
      out.push({
        label: `${t('Gen')} ${r.generation}`,
        bySlot: new Map(r.styleMatrix.map((row) => [row.slot, row.values])),
      });
    }
    out.push({
      label: `${t('Gen')} ${league.generation} (${t('now')})`,
      bySlot: new Map(this.clubs(league).map((f) => [
        f.slot, styleValues({ genome: f.genome, policy: f.policy }),
      ])),
    });
    return out;
  }

  /* ---------------- render ---------------- */

  render(league: League): void {
    this.league = league;
    this.stopPlay();
    this.root.textContent = '';
    this.root.appendChild(el('h2', '', `🧬 ${t('Evolution center')} — ${t('Gen')} ${league.generation}`));

    const clubs = this.clubs(league);
    const pop = clubs.map((f) => styleValues({ genome: f.genome, policy: f.policy }));
    const stats = dimStats(pop);
    const frames = this.frames(league);
    const idx = this.frameIdx ?? frames.length - 1;

    this.renderHero(league, clubs, stats, frames, idx);
    this.renderClubPanel(league, clubs, stats, frames);
    this.renderDynastyWall(league, clubs);
    this.renderPopulation(league, clubs, stats, frames);
    this.renderLastEvolution(league);
  }

  /** Section 1 — the hero map with the generation scrubber. */
  private renderHero(
    league: League, clubs: Franchise[], stats: DimStat[], frames: StyleFrame[], idx: number,
  ): void {
    const [xi, yi] = topVarianceDims(stats);
    this.root.appendChild(el('h2', '', t('Style space')));
    this.root.appendChild(el('div', 'muted',
      `${t('x-axis')}: ${t(STYLE_DIMS[xi].key)} · ${t('y-axis')}: ${t(STYLE_DIMS[yi].key)} — ${t('the two dimensions this league disagrees on most')}`));

    const heroWrap = el('div', 'evo-hero');
    const mapHost = el('div', 'evo-map');
    heroWrap.appendChild(mapHost);

    // Controls: ◀ frame slider ▶ + play.
    const controls = el('div', 'row evo-controls');
    const playBtn = button('▶', () => {
      if (this.playTimer !== null) {
        this.stopPlay();
        playBtn.textContent = '▶';
        return;
      }
      playBtn.textContent = '⏸';
      // Restart from the beginning when already at the end.
      if ((this.frameIdx ?? frames.length - 1) >= frames.length - 1) this.frameIdx = 0;
      this.playTimer = window.setInterval(() => {
        const cur = this.frameIdx ?? frames.length - 1;
        if (cur >= frames.length - 1) {
          this.stopPlay();
          playBtn.textContent = '▶';
          return;
        }
        this.frameIdx = cur + 1;
        slider.value = String(this.frameIdx);
        frameLabel.textContent = frames[this.frameIdx].label;
        this.drawMap(mapHost, clubs, stats, frames, this.frameIdx);
      }, 450);
    });
    playBtn.classList.add('evo-play');
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = String(frames.length - 1);
    slider.value = String(idx);
    slider.className = 'evo-scrub';
    const frameLabel = el('span', 'muted evo-frame-label', frames[idx].label);
    slider.addEventListener('input', () => {
      this.stopPlay();
      playBtn.textContent = '▶';
      this.frameIdx = Number(slider.value);
      frameLabel.textContent = frames[this.frameIdx].label;
      this.drawMap(mapHost, clubs, stats, frames, this.frameIdx);
    });
    controls.append(playBtn, slider, frameLabel);
    heroWrap.appendChild(controls);
    this.root.appendChild(heroWrap);

    this.drawMap(mapHost, clubs, stats, frames, idx);
  }

  /** Draw one frame of the map (DOM SVG so dots take click handlers). */
  private drawMap(
    host: HTMLElement, clubs: Franchise[], stats: DimStat[], frames: StyleFrame[], idx: number,
  ): void {
    const [xi, yi] = topVarianceDims(stats);
    const z = (v: number, i: number) =>
      (v - stats[i].mean) / Math.max(stats[i].std, STYLE_DIMS[i].scale * 0.02);
    const W = 420;
    const H = 320;
    const PAD = 28;
    const cx = (zv: number) => W / 2 + Math.max(-2.5, Math.min(2.5, zv)) * ((W / 2 - PAD) / 2.5);
    const cy = (zv: number) => H / 2 - Math.max(-2.5, Math.min(2.5, zv)) * ((H / 2 - PAD) / 2.5);
    host.textContent = '';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', '100%');
    const mk = (name: string): SVGElement =>
      document.createElementNS('http://www.w3.org/2000/svg', name);
    const bg = mk('rect');
    bg.setAttribute('x', '0'); bg.setAttribute('y', '0');
    bg.setAttribute('width', String(W)); bg.setAttribute('height', String(H));
    bg.setAttribute('rx', '10'); bg.setAttribute('fill', SURFACE);
    svg.appendChild(bg);
    for (const [x1, y1, x2, y2] of [
      [PAD, H / 2, W - PAD, H / 2],
      [W / 2, PAD, W / 2, H - PAD],
    ] as const) {
      const line = mk('line');
      line.setAttribute('x1', String(x1)); line.setAttribute('y1', String(y1));
      line.setAttribute('x2', String(x2)); line.setAttribute('y2', String(y2));
      line.setAttribute('stroke', GRID); line.setAttribute('stroke-width', '1');
      svg.appendChild(line);
    }
    const ax = mk('text');
    ax.setAttribute('x', String(W - PAD)); ax.setAttribute('y', String(H / 2 - 7));
    ax.setAttribute('text-anchor', 'end'); ax.setAttribute('font-size', '10'); ax.setAttribute('fill', INK_MUTED);
    ax.textContent = `${t(STYLE_DIMS[xi].key)} →`;
    const ay = mk('text');
    ay.setAttribute('x', String(W / 2 + 7)); ay.setAttribute('y', String(PAD + 4));
    ay.setAttribute('font-size', '10'); ay.setAttribute('fill', INK_MUTED);
    ay.textContent = `${t(STYLE_DIMS[yi].key)} ↑`;
    svg.append(ax, ay);

    // Trails: path up to the CURRENT frame so playback grows them.
    for (const f of clubs) {
      const pts: Array<[number, number]> = [];
      for (let i = Math.max(0, idx - 8); i <= idx; i++) {
        const row = frames[i].bySlot.get(f.slot);
        if (row) pts.push([cx(z(row[xi], xi)), cy(z(row[yi], yi))]);
      }
      if (pts.length >= 2) {
        const path = mk('path');
        path.setAttribute('d', pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' '));
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', colorHex(f.colors.primary));
        path.setAttribute('stroke-width', '1.5');
        path.setAttribute('opacity', f.slot === this.selectedSlot ? '0.7' : '0.25');
        svg.appendChild(path);
      }
    }
    for (const f of clubs) {
      const row = frames[idx].bySlot.get(f.slot);
      if (!row) continue;
      const x = cx(z(row[xi], xi));
      const y = cy(z(row[yi], yi));
      const selected = f.slot === this.selectedSlot;
      const dot = mk('circle');
      dot.setAttribute('cx', x.toFixed(1)); dot.setAttribute('cy', y.toFixed(1));
      dot.setAttribute('r', selected ? '7' : '5');
      dot.setAttribute('fill', colorHex(f.colors.primary));
      dot.setAttribute('stroke', selected ? '#e7ecf6' : SURFACE);
      dot.setAttribute('stroke-width', '2');
      dot.setAttribute('opacity', selected ? '1' : '0.85');
      (dot as unknown as HTMLElement).style.cursor = 'pointer';
      const title = mk('title');
      title.textContent = f.name;
      dot.appendChild(title);
      dot.addEventListener('click', () => {
        this.selectedSlot = f.slot;
        if (this.league) this.render(this.league);
      });
      const label = mk('text');
      label.setAttribute('x', (x + 8).toFixed(1)); label.setAttribute('y', (y + 3).toFixed(1));
      label.setAttribute('font-size', '9');
      label.setAttribute('fill', selected ? '#e7ecf6' : INK_MUTED);
      label.textContent = f.short;
      svg.append(dot, label);
    }
    host.appendChild(svg);
  }

  /** Section 2 — the selected club's deep dive. */
  private renderClubPanel(
    league: League, clubs: Franchise[], stats: DimStat[], frames: StyleFrame[],
  ): void {
    const f = clubs.find((c) => c.slot === this.selectedSlot) ?? clubs[0];
    this.selectedSlot = f.slot;
    this.root.appendChild(el('h2', '', t('Club deep dive')));
    const panel = el('div', 'evo-club');

    // Identity column.
    const idCol = el('div', 'evo-club-col');
    const head = el('div', 'team-head');
    const dot = el('span', 'dot');
    dot.style.background = colorHex(f.colors.primary);
    head.append(dot, el('span', '', `${f.name} · Elo ${Math.round(f.elo)}`));
    idCol.appendChild(head);
    const tags = el('div', 'tags');
    tags.appendChild(el('span', `tag div-badge-${f.division}`, f.division === 0 ? t('Premier Division') : t('Challenger Division')));
    const plate = nameplateFor(styleValues({ genome: f.genome, policy: f.policy }), stats);
    for (const word of plate) tags.appendChild(el('span', 'tag nameplate', t(word)));
    tags.appendChild(el('span', 'tag', `⚔ ${f.style.formationAtk}`));
    tags.appendChild(el('span', 'tag', `🛡 ${f.style.formationDef}`));
    const prestige = league.prestigeOf(f.slot);
    if (prestige >= 0.5) tags.appendChild(el('span', 'tag', '★'.repeat(Math.max(1, Math.min(Math.round(prestige), 3)))));
    idCol.appendChild(tags);

    const labels = geneAxisLabels(lang);
    const axes = GENE_KEYS.map((k, i) => ({ label: labels[i], title: t(k) }));
    const leagueMean = GENE_KEYS.map(
      (k) => clubs.reduce((a, c) => a + c.genome[k], 0) / Math.max(clubs.length, 1),
    );
    const series: RadarSeries[] = [
      { values: leagueMean, color: '#8294b5', name: t('league mean'), dashed: true },
      { values: genomeValues(f.genome), color: colorHex(f.colors.primary), name: f.name, fill: true },
    ];
    idCol.appendChild(geneRadar(axes, series, { size: 190 }));
    idCol.appendChild(el('div', 'radar-cap muted', `┄ ${t('league mean')}`));
    const hops = parentChain(f.lineage, f.name);
    if (hops.length > 0) {
      idCol.appendChild(el('div', 'muted family-tree',
        `🌳 ${hops.map((h) => `${h.child} ← ${h.parents.join(' × ')} (g${h.generation})`).join('  ·  ')}`));
    }
    panel.appendChild(idCol);

    // Drift column: this club's own most-moved style dims across the frames.
    const driftCol = el('div', 'evo-club-col');
    driftCol.appendChild(el('div', 'muted', t('This club\'s biggest style moves')));
    const series8 = frames
      .map((fr) => fr.bySlot.get(f.slot))
      .filter((row): row is number[] => row !== undefined);
    if (series8.length >= 2) {
      const first = series8[0];
      const last = series8[series8.length - 1];
      const movers = STYLE_DIMS
        .map((d, i) => ({ i, move: Math.abs(last[i] - first[i]) / d.scale }))
        .sort((a, b) => b.move - a.move || a.i - b.i)
        .slice(0, 4);
      const grid = el('div', 'spark-grid');
      for (const m of movers) {
        const d = STYLE_DIMS[m.i];
        const max = d.kind === 'gene' ? 1 : d.scale / 1.2 * 1.7; // policy upper bound
        grid.appendChild(sparklineTile(t(d.key), series8.map((row) => row[m.i] / max), colorHex(f.colors.primary)));
      }
      driftCol.appendChild(grid);
    } else {
      driftCol.appendChild(el('div', 'muted empty', t('Finish a season to see this club\'s drift.')));
    }

    // Budget + squad.
    const spent = squadTotal(f.squad);
    const budgetRow = el('div', 'gene-row');
    budgetRow.appendChild(el('div', 'g-name', t('budget')));
    const budgetBar = bar(spent / SQUAD_BUDGET, spent >= SQUAD_BUDGET - 0.05 ? '#f59e0b' : '#34d399');
    budgetBar.style.gridColumn = '2 / 3';
    budgetRow.appendChild(budgetBar);
    budgetRow.appendChild(el('div', 'muted', `${spent.toFixed(1)}/${SQUAD_BUDGET}`));
    driftCol.appendChild(budgetRow);
    const summary = squadSummary(f.squad);
    for (const k of ATTR_KEYS) {
      const row = el('div', 'gene-row');
      row.appendChild(el('div', 'g-name', t(k)));
      const b = bar(summary[k], '#60a5fa');
      b.style.gridColumn = '2 / 4';
      row.appendChild(b);
      driftCol.appendChild(row);
    }
    driftCol.appendChild(el('div', 'muted',
      f.playerNames.map((n, i) => {
        const tr = traitsOf(f.squad[i], SQUAD_ROLES[i]).map((tt) => TRAIT_EMOJI[tt]).join('');
        return `${n} ${f.ages[i]}y${tr ? ` ${tr}` : ''}`;
      }).join(' · ')));
    panel.appendChild(driftCol);

    this.root.appendChild(panel);
  }

  /** Section 3 — the dynasty wall: 16 slots × generations of lineage events. */
  private renderDynastyWall(league: League, clubs: Franchise[]): void {
    this.root.appendChild(el('h2', '', t('Dynasty wall')));
    this.root.appendChild(el('div', 'muted',
      `👑 ${t('elite')} · 💀 ${t('reborn')} · ⬆⬇ ${t('promotion/relegation')} — ${t('tap a row to inspect the club')}`));
    const wall = el('div', 'dyn-wall');
    const maxGen = league.generation;
    for (const f of clubs) {
      const row = el('div', 'dyn-row-line');
      if (f.slot === this.selectedSlot) row.classList.add('selected');
      const name = el('div', 'dyn-name');
      const dot = el('span', 'dot');
      dot.style.background = colorHex(f.colors.primary);
      name.append(dot, document.createTextNode(` ${f.short}`));
      row.appendChild(name);
      const cells = el('div', 'dyn-cells');
      const byGen = new Map<number, string>();
      for (const e of f.lineage) {
        // Rebirth outranks the mutation entry of the same generation.
        const prev = byGen.get(e.generation);
        if (!prev || e.event === 'reborn' || (e.event === 'elite' && prev === 'mutated')) {
          byGen.set(e.generation, e.event);
        }
      }
      for (let g = 1; g <= maxGen; g++) {
        const ev = byGen.get(g) ?? 'mutated';
        const cell = el('span', 'dyn-cell');
        cell.style.background = EVENT_COLOR[ev] ?? EVENT_COLOR.mutated;
        cell.title = `${t('Gen')} ${g}: ${t(ev)}`;
        if (ev !== 'mutated' && ev !== 'founded') cell.textContent = EVENT_ICON[ev];
        cells.appendChild(cell);
      }
      row.appendChild(cells);
      row.addEventListener('click', () => {
        this.selectedSlot = f.slot;
        if (this.league) this.render(this.league);
      });
      wall.appendChild(row);
    }
    this.root.appendChild(wall);
  }

  /** Section 4 — population trends + the folded tile wall. */
  private renderPopulation(
    league: League, clubs: Franchise[], stats: DimStat[], frames: StyleFrame[],
  ): void {
    this.root.appendChild(el('h2', '', t('Population trends')));
    const grid = el('div', 'spark-grid');
    const spreadSeries = frames.map((fr) =>
      styleSpread(dimStats([...fr.bySlot.values()])));
    grid.appendChild(sparklineTile(`${t('style divergence')} ×5`, spreadSeries.map((v) => v * 5), '#f59e0b'));
    const withStyles = league.history.filter((r) => r.styleShares);
    if (withStyles.length > 0) {
      grid.appendChild(stackedShareStrip(t('Attack formation'), [
        { label: 'wide-212', color: '#60a5fa' },
        { label: 'narrow-122', color: '#f59e0b' },
      ], withStyles.map((r) => r.styleShares!.atk)));
      grid.appendChild(stackedShareStrip(t('Defend formation'), [
        { label: 'low-32', color: '#60a5fa' },
        { label: 'press-23', color: '#f472b6' },
      ], withStyles.map((r) => r.styleShares!.def)));
      grid.appendChild(stackedShareStrip(t('Marking'), [
        { label: 'man', color: '#4ade80' },
        { label: 'zonal', color: '#a78bfa' },
      ], withStyles.map((r) => r.styleShares!.scheme)));
    }
    this.root.appendChild(grid);

    this.root.appendChild(el('h2', '', t('Budget allocation')));
    this.root.appendChild(attrHeatmap(
      clubs.map((f) => {
        const s = squadSummary(f.squad);
        return { label: f.short, title: f.name, cells: ATTR_KEYS.map((k) => s[k]) };
      }),
      ATTR_KEYS.map((k) => t(k)),
    ));

    const withGenes = league.history.filter((r) => r.geneMeans);
    if (withGenes.length > 0) {
      const details = document.createElement('details');
      details.className = 'evo-details';
      const summary = document.createElement('summary');
      summary.textContent = t('All gene & attribute curves (league mean per generation)');
      details.appendChild(summary);
      const geneGrid = el('div', 'spark-grid');
      for (const k of GENE_KEYS) {
        geneGrid.appendChild(sparklineTile(t(k), withGenes.map((r) => r.geneMeans![k])));
      }
      details.appendChild(geneGrid);
      const withAttrs = league.history.filter((r) => r.attrMeans);
      const attrGrid = el('div', 'spark-grid');
      for (const k of ATTR_KEYS) {
        attrGrid.appendChild(sparklineTile(t(k), withAttrs.map((r) => r.attrMeans![k]), '#4ade80'));
      }
      details.appendChild(attrGrid);
      this.root.appendChild(details);
    }
  }

  /** Section 5 — the latest evolution pass + the ceremony reopen. */
  private renderLastEvolution(league: League): void {
    const last = league.history[league.history.length - 1];
    if (!last) return;
    this.root.appendChild(el('h2', '', `${t('Last evolution')} (gen ${last.generation} → ${last.generation + 1})`));
    const row = el('div', 'row');
    row.appendChild(button(`🧬 ${t('Rebirth ceremony')}`, () => this.onShowCeremony?.()));
    this.root.appendChild(row);
    for (const e of last.evolution.entries) {
      const icon = e.kind === 'elite' ? '👑' : e.kind === 'mutated' ? '🧬' : '🔄';
      const par = e.parents ? ` ← ${e.parents.join(' × ')}` : '';
      this.root.appendChild(
        el('div', 'history-entry', `${icon} ${e.name}${par} · fitness ${e.fitness.toFixed(3)} · drift ${e.drift.toFixed(2)}`),
      );
    }
  }

  private stopPlay(): void {
    if (this.playTimer !== null) {
      window.clearInterval(this.playTimer);
      this.playTimer = null;
    }
  }
}
