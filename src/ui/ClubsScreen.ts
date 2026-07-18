import { ATTACK_FORMATIONS, DEFEND_FORMATIONS } from '../ai/formations';
import type { Franchise } from '../evolution/franchise';
import { GENE_KEYS } from '../evolution/genome';
import {
  ATTR_KEYS, ROSTER_ROLES, SQUAD_BUDGET, SQUAD_ROLES, squadSummary, squadTotal,
} from '../evolution/playerGenome';
import { nameplates } from '../evolution/styleSpace';
import { TRAIT_EMOJI, traitsOf } from '../evolution/traits';
import { DIVISION_SHORT, type League } from '../sim/League';
import { formationDiagram, geneRadar, type RadarSeries } from './charts';
import { bar, colorHex, el } from './dom';
import type { EntityNav } from './entityLinks';
import { channelWindow, goalChannelTile } from './goalChannels';
import { lang, t } from './i18n';
import { geneAxisLabels, genomeValues, parentChain } from './rebirth';

/**
 * The CLUB CENTER (Phase 113.5) — the clubs' own stage, mirroring the
 * player center: a compact selector wall of all 16 clubs and ONE deep
 * dive. Identity-NOW lives here (radar, formation diagrams, dugout,
 * squad, budget, goal channels, lineage); identity-over-GENERATIONS
 * (drift, dynasty, eras) stays in the evolution center. The league tab's
 * 16 full team cards moved here — the league center keeps the season.
 */
export class ClubsScreen {
  readonly root: HTMLElement;
  private visible = false;
  private league: League | null = null;
  private selectedSlot: number | null = null;
  /** Cross-screen navigation (Phase 108, entity links) — set by GameApp. */
  nav: EntityNav | null = null;
  private diveAnchor: HTMLElement | null = null;

  constructor(host: HTMLElement) {
    this.root = el('div');
    this.root.id = 'clubs-screen';
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

  hide(): void {
    if (!this.visible) return;
    this.visible = false;
    this.root.classList.add('hidden');
  }

  refreshIfVisible(league: League): void {
    if (this.visible) this.render(league);
  }

  /** Jump straight to one club's deep dive (Phase 108, entity links). */
  focusClub(league: League, slot: number): void {
    this.selectedSlot = slot;
    this.visible = true;
    this.root.classList.remove('hidden');
    this.render(league);
    this.diveAnchor?.scrollIntoView({ block: 'start' });
  }

  render(league: League): void {
    this.league = league;
    this.root.textContent = '';
    this.root.appendChild(
      el('h2', '', `🏟 ${t('Club center')} — ${t('Gen')} ${league.generation}`),
    );

    const ordered = [...league.division(0), ...league.division(1)];
    const f = ordered.find((c) => c.slot === this.selectedSlot) ?? ordered[0];
    this.selectedSlot = f.slot;

    this.renderDive(league, ordered, f);
    this.renderWall(league, ordered, f);
  }

  /* ---------------- Section 1 — the deep dive ---------------- */

  private renderDive(league: League, ordered: Franchise[], f: Franchise): void {
    this.diveAnchor = el('h2', '', t('Club deep dive'));
    this.root.appendChild(this.diveAnchor);
    const panel = el('div', 'evo-club');

    // Identity column — who this club IS right now.
    const idCol = el('div', 'evo-club-col');
    const head = el('div', 'team-head');
    const dot = el('span', 'dot');
    dot.style.background = colorHex(f.colors.primary);
    head.append(dot, el('span', '', `${f.name} · Elo ${Math.round(f.elo)}`));
    idCol.appendChild(head);

    const plates = nameplates(ordered.map((c) => ({ genome: c.coach.genome, policy: c.coach.policy })));
    const tags = el('div', 'tags');
    tags.appendChild(el('span', `tag div-badge-${f.division}`, DIVISION_SHORT[f.division]));
    tags.appendChild(el('span', 'tag', `⚔ ${f.coach.style.formationAtk}`));
    tags.appendChild(el('span', 'tag', `🛡 ${f.coach.style.formationDef}`));
    tags.appendChild(el('span', 'tag', t(f.coach.style.scheme === 'man' ? 'man-marking' : 'zonal')));
    for (const word of plates[ordered.indexOf(f)]) {
      tags.appendChild(el('span', 'tag nameplate', t(word)));
    }
    const prestige = league.prestigeOf(f.slot);
    if (prestige >= 0.5) {
      tags.appendChild(el('span', 'tag', '★'.repeat(Math.max(1, Math.min(Math.round(prestige), 3)))));
    }
    idCol.appendChild(tags);

    // The dugout (Phase 53): the philosophy has a face, an age and a record.
    const c = f.coach;
    idCol.appendChild(el('div', 'coach-block',
      `👔 ${c.name} · ${c.age}${t('y')} — ${c.career.seasons} ${t('seasons in charge')}` +
      ` · ${c.career.titles}×🏆 ${c.career.cups}×🏅` +
      (c.career.clubs > 1 ? ` · ${c.career.clubs} ${t('clubs')}` : '') +
      (c.career.sackings > 0 ? ` · ${c.career.sackings}×🪓` : '') +
      (c.mentor ? ` · 🎓 ${t('school of')} ${c.mentor}` : '')));

    // Tactical DNA (32.5): the radar reads as a SHAPE — the dashed league
    // mean makes "what's distinctive here" visible at a glance.
    const labels = geneAxisLabels(lang);
    const axes = GENE_KEYS.map((k, i) => ({ label: labels[i], title: t(k) }));
    const leagueMean = GENE_KEYS.map(
      (k) => ordered.reduce((a, x) => a + x.coach.genome[k], 0) / Math.max(ordered.length, 1),
    );
    const series: RadarSeries[] = [
      { values: leagueMean, color: '#8294b5', name: t('league mean'), dashed: true },
      { values: genomeValues(f.coach.genome), color: colorHex(f.colors.primary), name: f.name, fill: true },
    ];
    idCol.appendChild(geneRadar(axes, series, { size: 190 }));
    idCol.appendChild(el('div', 'radar-cap muted', `┄ ${t('league mean')}`));

    // The 阵型图 (113.5): the shape tags, drawn — both phases of the game.
    const kit = colorHex(f.colors.primary);
    const diagrams = el('div', 'diagram-row');
    diagrams.appendChild(formationDiagram(
      `⚔ ${f.coach.style.formationAtk}`, ATTACK_FORMATIONS[f.coach.style.formationAtk], SQUAD_ROLES, kit));
    diagrams.appendChild(formationDiagram(
      `🛡 ${f.coach.style.formationDef}`, DEFEND_FORMATIONS[f.coach.style.formationDef], SQUAD_ROLES, kit));
    idCol.appendChild(diagrams);

    // Family tree (32.5) + the lineage ledger.
    const hops = parentChain(f.lineage, f.name);
    if (hops.length > 0) {
      idCol.appendChild(el('div', 'muted family-tree',
        `🌳 ${hops.map((h) => `${h.child} ← ${h.parents.join(' × ')} (g${h.generation})`).join('  ·  ')}`));
    }
    const lin = el('div', 'lineage');
    for (const entry of [...f.lineage].reverse().slice(0, 6)) {
      const icon = entry.event === 'elite' ? '👑' : entry.event === 'mutated' ? '🧬' : entry.event === 'reborn' ? '🔄' : '🌱';
      const parents = entry.parents ? ` ← ${entry.parents.join(' × ')}` : '';
      const note = entry.note ? ` (${entry.note})` : '';
      lin.appendChild(el('div', '', `g${entry.generation} ${icon} ${entry.event}${parents}${note}`));
    }
    idCol.appendChild(lin);
    panel.appendChild(idCol);

    // Outcome column — what the identity cashes out as, and who plays it.
    const outCol = el('div', 'evo-club-col');
    outCol.appendChild(goalChannelTile(channelWindow(league, f.slot)));

    const spent = squadTotal(f.squad);
    const budgetRow = el('div', 'gene-row');
    budgetRow.appendChild(el('div', 'g-name', t('budget')));
    const budgetBar = bar(spent / SQUAD_BUDGET, spent >= SQUAD_BUDGET - 0.05 ? '#f59e0b' : '#34d399');
    budgetBar.style.gridColumn = '2 / 3';
    budgetRow.appendChild(budgetBar);
    budgetRow.appendChild(el('div', 'muted', `${spent.toFixed(1)}/${SQUAD_BUDGET}`));
    outCol.appendChild(budgetRow);
    const summary = squadSummary(f.squad);
    for (const k of ATTR_KEYS) {
      const row = el('div', 'gene-row');
      row.appendChild(el('div', 'g-name', t(k)));
      const b = bar(summary[k], '#60a5fa');
      b.style.gridColumn = '2 / 4';
      row.appendChild(b);
      outCol.appendChild(row);
    }
    // Careers (Phase 26): the people behind the bars — traits derived live,
    // the bench (Phase 61) behind the 🪑, 🚫 = suspended.
    outCol.appendChild(el('div', 'muted',
      f.playerNames.map((n, i) => {
        const tr = traitsOf(f.squad[i], ROSTER_ROLES[i], f.squadStyles?.[i]).map((tt) => TRAIT_EMOJI[tt]).join('');
        const ban = (f.suspensions?.[i] ?? 0) > 0 ? ` 🚫${f.suspensions[i]}` : '';
        return `${i === SQUAD_ROLES.length ? '🪑 ' : ''}${n} ${f.ages[i]}y${tr ? ` ${tr}` : ''}${ban}`;
      }).join(' · ')));

    const fit = league.history[league.history.length - 1]?.fitness.find((x) => x.slot === f.slot);
    if (fit) outCol.appendChild(el('div', 'muted', `last-season fitness: ${fit.total.toFixed(3)}`));
    panel.appendChild(outCol);

    this.root.appendChild(panel);
  }

  /* ---------------- Section 2 — the selector wall ---------------- */

  private renderWall(league: League, ordered: Franchise[], selected: Franchise): void {
    this.root.appendChild(el('h2', '', t('All clubs')));
    this.root.appendChild(el('div', 'muted', t('Tap a club to inspect it above.')));
    const plates = nameplates(ordered.map((c) => ({ genome: c.coach.genome, policy: c.coach.policy })));
    const grid = el('div', 'clubs-grid');
    for (const f of ordered) {
      const mini = el('div', `club-mini${f.slot === selected.slot ? ' selected' : ''}`);
      const head = el('div', 'team-head');
      const dot = el('span', 'dot');
      dot.style.background = colorHex(f.colors.primary);
      head.append(dot, el('span', '', `${f.name} · ${Math.round(f.elo)}`));
      mini.appendChild(head);
      const tags = el('div', 'tags');
      tags.appendChild(el('span', `tag div-badge-${f.division}`, DIVISION_SHORT[f.division]));
      for (const word of plates[ordered.indexOf(f)].slice(0, 2)) {
        tags.appendChild(el('span', 'tag nameplate', t(word)));
      }
      mini.appendChild(tags);
      const row = league.table.find((r) => r.slot === f.slot);
      mini.appendChild(el('div', 'muted',
        (row ? `${row.w}-${row.d}-${row.l} · ${row.pts} ${t('pts')} · ` : '') + `👔 ${f.coach.name}`));
      mini.addEventListener('click', () => {
        this.selectedSlot = f.slot;
        if (this.league) this.render(this.league);
        this.diveAnchor?.scrollIntoView({ block: 'start' });
      });
      grid.appendChild(mini);
    }
    this.root.appendChild(grid);
  }
}
