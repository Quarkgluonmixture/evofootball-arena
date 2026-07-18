import { emptyCareer } from '../evolution/careers';
import { agentTotal } from '../evolution/freeAgents';
import { ATTR_KEYS, ROSTER_ROLES } from '../evolution/playerGenome';
import {
  PLAYER_DIMS, PLAYER_STYLE_KEYS, playerDimStats, playerNameplate, playerVector,
  type PlayerDimStats,
} from '../evolution/playerStyle';
import { TRAIT_EMOJI, TRAIT_KEYS, traitsOf } from '../evolution/traits';
import type { Franchise } from '../evolution/franchise';
import type { League } from '../sim/League';
import type { Role } from '../sim/types';
import { bar, button, colorHex, el } from './dom';
import { buildEntityIndex, linkifyText, type EntityIndex, type EntityNav } from './entityLinks';
import { t } from './i18n';

const INK_MUTED = '#8294b5';
const GRID = '#24304a';
const SURFACE = '#0d1526';

/** One row of the population: a live player and where he plays. */
interface PlayerRow {
  franchise: Franchise;
  index: number;
  vec: number[];
}

/**
 * THE PLAYER CENTER (Phase 56 — user report: the player layer needs its own
 * dashboards: 性格 / 转会 / 风格). The Evolution Center precedent applied to
 * PEOPLE: everything here reads live franchises + records — no sim writes,
 * no rng, fingerprint untouched.
 *
 *   1. the PLAYER STYLE SPACE — all 144 players (16 clubs × 9-man rosters
 *      since Phase 61) scattered on the two dims
 *      the population disagrees on most (13-dim identity space: 8 attrs +
 *      5 personal appetites), with role lenses; dots wear kit colors;
 *   2. a PLAYER DEEP DIVE — traits, earned nameplate, attributes, personal
 *      appetites as diverging bars around the coach's ×1.0, career +
 *      highlight;
 *   3. TRANSFERS — the live free-agent market and the signings chronicle
 *      ("from the ashes of...") mined from season records;
 *   4. the CENSUS — trait distribution and the active career leaderboards.
 */
export class PlayerScreen {
  readonly root: HTMLElement;
  private visible = false;
  private league: League | null = null;
  private selected: { slot: number; index: number } | null = null;
  private roleLens: Role | null = null;
  /** Cross-screen navigation (Phase 108, entity links) — set by GameApp. */
  nav: EntityNav | null = null;
  private linkIdx: EntityIndex | null = null;
  private diveAnchor: HTMLElement | null = null;

  constructor(host: HTMLElement) {
    this.root = el('div');
    this.root.id = 'player-screen';
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

  /** Jump straight to one player's deep dive (Phase 108, entity links).
   * Clears the role lens — it must never hide the jump target. */
  focusPlayer(league: League, slot: number, index: number): void {
    this.selected = { slot, index };
    this.roleLens = null;
    this.visible = true;
    this.root.classList.remove('hidden');
    this.render(league);
    this.diveAnchor?.scrollIntoView({ block: 'start' });
  }

  /* ---------------- data ---------------- */

  private population(league: League): PlayerRow[] {
    const rows: PlayerRow[] = [];
    for (const f of [...league.division(0), ...league.division(1)]) {
      f.squad.forEach((attrs, index) => {
        rows.push({ franchise: f, index, vec: playerVector(attrs, f.squadStyles[index]) });
      });
    }
    return rows;
  }

  /* ---------------- render ---------------- */

  render(league: League): void {
    this.league = league;
    this.linkIdx = this.nav ? buildEntityIndex(league) : null;
    this.root.textContent = '';
    this.root.appendChild(el('h2', '', `👥 ${t('Player center')} — ${t('Gen')} ${league.generation}`));

    const rows = this.population(league);
    const stats = playerDimStats(rows.map((r) => r.vec));
    if (!this.selected) {
      const best = rows.find((r) => ROSTER_ROLES[r.index] === 'ST');
      if (best) this.selected = { slot: best.franchise.slot, index: best.index };
    }

    this.renderMap(rows, stats);
    this.renderDeepDive(league, rows, stats);
    this.renderTransfers(league);
    this.renderCensus(league, rows, stats);
  }

  /** Section 1 — the player style space, axes earned by variance. */
  private renderMap(rows: PlayerRow[], allStats: PlayerDimStats): void {
    this.root.appendChild(el('h2', '', t('Player style space')));
    this.root.appendChild(el('div', 'muted',
      t('Every player in the league, plotted where the population disagrees most — attributes and personal appetites together.')));

    // Role lens chips: axes recompute within the lens (the 51.1 pattern —
    // the lens is grammar, its axes stay data-driven).
    const lensRow = el('div', 'row tab-nav player-lens');
    const lenses: Array<[Role | null, string]> = [
      [null, t('All')], ['GK', 'GK'], ['DF', 'DF'], ['MF', 'MF'], ['WG', 'WG'], ['ST', 'ST'],
    ];
    for (const [role, label] of lenses) {
      const b = button(label, () => {
        this.roleLens = role;
        if (this.league) this.render(this.league);
      });
      b.classList.toggle('active', role === this.roleLens);
      lensRow.appendChild(b);
    }
    this.root.appendChild(lensRow);

    const inLens = this.roleLens
      ? rows.filter((r) => ROSTER_ROLES[r.index] === this.roleLens)
      : rows;
    const stats = this.roleLens ? playerDimStats(inLens.map((r) => r.vec)) : allStats;
    const ranked = PLAYER_DIMS
      .map((d, i) => ({ i, v: stats.std[i] / d.scale }))
      .sort((a, b) => b.v - a.v || a.i - b.i);
    const [xi, yi] = [ranked[0].i, ranked[1].i];

    const W = 560;
    const H = 400;
    const PAD = 30;
    const z = (v: number, i: number) =>
      (v - stats.mean[i]) / Math.max(stats.std[i], PLAYER_DIMS[i].scale * 0.02);
    const cx = (zv: number) => W / 2 + Math.max(-2.5, Math.min(2.5, zv)) * ((W / 2 - PAD) / 2.5);
    const cy = (zv: number) => H / 2 - Math.max(-2.5, Math.min(2.5, zv)) * ((H / 2 - PAD) / 2.5);

    const host = el('div', 'player-map');
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
    ax.textContent = `${t(PLAYER_DIMS[xi].key)} →`;
    const ay = mk('text');
    ay.setAttribute('x', String(W / 2 + 7)); ay.setAttribute('y', String(PAD + 4));
    ay.setAttribute('font-size', '10'); ay.setAttribute('fill', INK_MUTED);
    ay.textContent = `${t(PLAYER_DIMS[yi].key)} ↑`;
    svg.append(ax, ay);

    for (const r of inLens) {
      const x = cx(z(r.vec[xi], xi));
      const y = cy(z(r.vec[yi], yi));
      const isSel = this.selected?.slot === r.franchise.slot && this.selected?.index === r.index;
      const dot = mk('circle');
      dot.setAttribute('cx', x.toFixed(1)); dot.setAttribute('cy', y.toFixed(1));
      dot.setAttribute('r', isSel ? '6.5' : '4.5');
      dot.setAttribute('fill', colorHex(r.franchise.colors.primary));
      dot.setAttribute('stroke', isSel ? '#e7ecf6' : SURFACE);
      dot.setAttribute('stroke-width', isSel ? '2' : '1.5');
      (dot as unknown as HTMLElement).style.cursor = 'pointer';
      const title = mk('title');
      title.textContent = `${r.franchise.playerNames[r.index]} (${r.franchise.short} ${ROSTER_ROLES[r.index]})`;
      dot.appendChild(title);
      dot.addEventListener('click', () => {
        this.selected = { slot: r.franchise.slot, index: r.index };
        if (this.league) this.render(this.league);
      });
      svg.appendChild(dot);
      if (isSel) {
        const label = mk('text');
        label.setAttribute('x', (x + 9).toFixed(1)); label.setAttribute('y', (y + 3).toFixed(1));
        label.setAttribute('font-size', '10'); label.setAttribute('fill', '#e7ecf6');
        label.textContent = r.franchise.playerNames[r.index];
        svg.appendChild(label);
      }
    }
    host.appendChild(svg);
    this.root.appendChild(host);
  }

  /** Section 2 — who the selected player IS. */
  private renderDeepDive(league: League, rows: PlayerRow[], stats: PlayerDimStats): void {
    const row = rows.find(
      (r) => r.franchise.slot === this.selected?.slot && r.index === this.selected?.index,
    ) ?? rows[0];
    if (!row) return;
    this.selected = { slot: row.franchise.slot, index: row.index };
    const f = row.franchise;
    const i = row.index;
    const style = f.squadStyles[i];
    const attrs = f.squad[i];
    const career = f.careers[i] ?? emptyCareer();

    this.diveAnchor = el('h2', '', t('Player deep dive'));
    this.root.appendChild(this.diveAnchor);
    const panel = el('div', 'player-dive');

    const idCol = el('div', 'player-col');
    const head = el('div', 'team-head');
    const dot = el('span', 'dot');
    dot.style.background = colorHex(f.colors.primary);
    head.append(dot, el('span', '',
      `${f.playerNames[i]} · ${ROSTER_ROLES[i]} · ${f.ages[i]}${t('y')} · ${f.name}`));
    idCol.appendChild(head);

    const tags = el('div', 'tags');
    for (const tr of traitsOf(attrs, ROSTER_ROLES[i], style)) {
      tags.appendChild(el('span', 'tag', `${TRAIT_EMOJI[tr]} ${t(tr)}`));
    }
    for (const word of playerNameplate(row.vec, stats)) {
      tags.appendChild(el('span', 'tag nameplate', t(word)));
    }
    if (tags.childNodes.length === 0) tags.appendChild(el('span', 'muted', t('no distinction earned yet')));
    idCol.appendChild(tags);

    // The career, and the season worth remembering.
    const line = ROSTER_ROLES[i] === 'GK'
      ? `${career.saves} ${t('saves#')}`
      : `${career.goals}⚽ ${career.assists}🅰`;
    idCol.appendChild(el('div', '',
      `📒 ${career.seasons} ${t('seasons#')} · ${line}`));
    if (career.bestGoals || career.bestRating) {
      const bits = [
        career.bestGoals ? `S${career.bestGoalsSeason}: ${career.bestGoals}⚽` : '',
        career.bestRating ? `${t('best rating')} ${career.bestRating.toFixed(2)} (S${career.bestRatingSeason})` : '',
      ].filter(Boolean).join(' · ');
      idCol.appendChild(el('div', 'muted', `🌟 ${bits}`));
    }
    panel.appendChild(idCol);

    // Attributes + personal appetites (diverging around the coach's ×1.0).
    const barsCol = el('div', 'player-col');
    for (const k of ATTR_KEYS) {
      const r = el('div', 'gene-row');
      r.appendChild(el('div', 'g-name', t(k)));
      const b = bar(attrs[k], '#60a5fa');
      b.style.gridColumn = '2 / 4';
      r.appendChild(b);
      barsCol.appendChild(r);
    }
    barsCol.appendChild(el('div', 'muted', t('personal appetites (vs the coach\'s ×1.0)')));
    for (const k of PLAYER_STYLE_KEYS) {
      const r = el('div', 'gene-row');
      r.appendChild(el('div', 'g-name', t(k)));
      const wrap = el('div', 'style-diverge');
      const v = style[k];
      const half = el('span', 'style-diverge-fill');
      // 0.6..1.5 → the fill grows right of center for >1, left for <1.
      const pct = Math.min(Math.abs(v - 1) / 0.5, 1) * 50;
      half.style.width = `${pct}%`;
      half.style.left = v >= 1 ? '50%' : `${50 - pct}%`;
      half.style.background = v >= 1 ? '#f59e0b' : '#60a5fa';
      wrap.appendChild(half);
      wrap.title = `×${v.toFixed(2)}`;
      wrap.style.gridColumn = '2 / 3';
      r.appendChild(wrap);
      r.appendChild(el('div', 'muted', `×${v.toFixed(2)}`));
      barsCol.appendChild(r);
    }
    panel.appendChild(barsCol);
    this.root.appendChild(panel);
  }

  /** Section 3 — the market and the signings chronicle. */
  private renderTransfers(league: League): void {
    this.root.appendChild(el('h2', '', `✍ ${t('Transfers & the market')}`));

    this.root.appendChild(el('div', 'muted', t('Free agents — careers waiting for a club')));
    if (league.freeAgents.length === 0) {
      this.root.appendChild(el('div', 'muted empty', t('The market is empty — it fills when a club folds.')));
    }
    for (const a of league.freeAgents) {
      this.root.appendChild(this.entry(
        `🧳 ${a.name} · ${a.role} · ${a.age}${t('y')} · ` +
        `${t('ability')} ${agentTotal(a).toFixed(1)} · ${t('ex-')}${a.lastClub}` +
        (a.career.goals > 0 ? ` · ${a.career.goals}⚽` : '')));
    }

    const signings = [...league.history].reverse().flatMap((rec) =>
      (rec.signings ?? []).map((s) => ({ gen: rec.generation, ...s })));
    if (signings.length > 0) {
      this.root.appendChild(el('div', 'muted', t('Signings — careers that survived their clubs')));
      for (const s of signings.slice(0, 14)) {
        this.root.appendChild(this.entry(
          `✍ S${s.gen} — ${s.club} ← ${s.player} (${s.age}${t('y')}), ${t('from the ashes of')} ${s.from}`));
      }
    }
  }

  /** Section 4 — the census: traits and active leaderboards. */
  private renderCensus(league: League, rows: PlayerRow[], stats: PlayerDimStats): void {
    this.root.appendChild(el('h2', '', `📊 ${t('Population census')}`));

    const counts = new Map<string, number>();
    let plated = 0;
    for (const r of rows) {
      for (const tr of traitsOf(r.franchise.squad[r.index], ROSTER_ROLES[r.index], r.franchise.squadStyles[r.index])) {
        counts.set(tr, (counts.get(tr) ?? 0) + 1);
      }
      if (playerNameplate(r.vec, stats).length > 0) plated++;
    }
    const censusRow = el('div', 'tags census-tags');
    for (const tr of TRAIT_KEYS) {
      const n = counts.get(tr) ?? 0;
      if (n === 0) continue;
      censusRow.appendChild(el('span', 'tag', `${TRAIT_EMOJI[tr]} ${t(tr)} ×${n}`));
    }
    if (censusRow.childNodes.length === 0) censusRow.appendChild(el('span', 'muted', '—'));
    this.root.appendChild(censusRow);
    this.root.appendChild(el('div', 'muted',
      `${t('players with an earned nameplate')}: ${plated}/${rows.length}`));

    // Active career leaderboard — the people the chronicle will remember.
    const active = rows
      .map((r) => ({
        name: r.franchise.playerNames[r.index],
        team: r.franchise.name,
        role: ROSTER_ROLES[r.index],
        career: r.franchise.careers[r.index],
      }))
      .filter((x) => x.career && x.career.goals > 0)
      .sort((a, b) => b.career.goals - a.career.goals)
      .slice(0, 5);
    if (active.length > 0) {
      this.root.appendChild(el('div', 'muted', t('Active career scorers')));
      for (const x of active) {
        this.root.appendChild(this.entry(
          `⚽ ${x.name} (${x.team}, ${x.role}) — ${x.career.goals} ${t('career goals')} · ${x.career.seasons} ${t('seasons#')}`));
      }
    }
  }

  /** A history-entry line whose entity names are LINKS (Phase 108). */
  private entry(text: string): HTMLElement {
    const d = el('div', 'history-entry');
    if (this.linkIdx && this.nav) d.appendChild(linkifyText(text, this.linkIdx, this.nav));
    else d.textContent = text;
    return d;
  }
}
