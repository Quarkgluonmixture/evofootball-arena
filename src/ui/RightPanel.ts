import { GENE_KEYS } from '../evolution/genome';
import { ATTR_KEYS } from '../evolution/playerGenome';
import type { Match } from '../sim/Match';
import { matchRating } from '../sim/ratings';
import { bar, colorHex, el } from './dom';
import { t } from './i18n';
import { XgChart } from './XgChart';

const STAT_ROWS = [
  'shots',
  'on target',
  'xG',
  'possession',
  'passes',
  'pass %',
  'crosses',
  'one-twos',
  'third man',
  'overlaps',
  'headers won',
  'miscontrols',
  'recoveries',
  'corners',
  'offsides',
  'fouls',
  'cards',
  'saves',
] as const;

/** `1🟨` / `1🟨 1🟥` / `—` — compact card tally for the stats table. */
const cardLine = (yellows: number, reds: number): string => {
  if (yellows === 0 && reds === 0) return '—';
  return `${yellows}🟨${reds > 0 ? ` ${reds}🟥` : ''}`;
};

/**
 * Tactics inspector: both teams' genes side by side, live tactical mode,
 * live match stats + xG race chart, and the selected player's current action
 * with its utility reasoning and attribute genes.
 */
export class RightPanel {
  private root: HTMLElement;
  private modeA: HTMLElement | null = null;
  private modeB: HTMLElement | null = null;
  private playerCard: HTMLElement | null = null;
  private statCells = new Map<string, [HTMLElement, HTMLElement]>();
  private chart = new XgChart();

  constructor(root: HTMLElement) {
    this.root = root;
  }

  attach(match: Match): void {
    this.root.textContent = '';
    this.statCells.clear();

    // ---- match stats + xG race ----
    const statsSec = el('div', 'section');
    statsSec.append(el('h3', '', t('Match stats · xG race')));
    statsSec.appendChild(this.chart.root);
    for (const label of STAT_ROWS) {
      const row = el('div', 'gene-row');
      row.appendChild(el('div', 'g-name', t(label)));
      const a = el('div', 'stat-val', '0');
      const b = el('div', 'stat-val', '0');
      row.append(a, b);
      this.statCells.set(label, [a, b]);
      statsSec.appendChild(row);
    }

    // ---- teams & genes ----
    const teamsSec = el('div', 'section');
    teamsSec.append(el('h3', '', t('Teams & tactical genes')));

    const heads = el('div', 'gene-row');
    heads.append(el('div', 'g-name', ''));
    for (const team of match.teams) {
      const head = el('div', 'team-head');
      const dot = el('span', 'dot');
      dot.style.background = colorHex(team.info.colors.primary);
      head.append(dot, el('span', '', team.info.short));
      heads.appendChild(head);
    }
    teamsSec.appendChild(heads);

    const modes = el('div', 'gene-row');
    modes.append(el('div', 'g-name', t('mode')));
    this.modeA = el('span', 'mode-badge', '—');
    this.modeB = el('span', 'mode-badge', '—');
    modes.append(this.modeA, this.modeB);
    teamsSec.appendChild(modes);

    // Tactical identity (Phase 30): fixed formations + marking scheme.
    const styleRows: Array<[string, (s: (typeof match.teams)[0]['style']) => string]> = [
      [t('formation ⚔'), (s) => s.formationAtk],
      [t('formation 🛡'), (s) => s.formationDef],
      [t('marking'), (s) => t(s.scheme === 'man' ? 'man-marking' : 'zonal')],
    ];
    for (const [label, read] of styleRows) {
      const row = el('div', 'gene-row');
      row.appendChild(el('div', 'g-name', label));
      row.appendChild(el('div', 'stat-val', read(match.teams[0].style)));
      row.appendChild(el('div', 'stat-val', read(match.teams[1].style)));
      teamsSec.appendChild(row);
    }

    for (const key of GENE_KEYS) {
      const row = el('div', 'gene-row');
      row.appendChild(el('div', 'g-name', t(key)));
      row.appendChild(bar(match.teams[0].genome[key], colorHex(match.teams[0].info.colors.primary)));
      row.appendChild(bar(match.teams[1].genome[key], colorHex(match.teams[1].info.colors.primary)));
      teamsSec.appendChild(row);
    }

    // ---- selected player ----
    const playerSec = el('div', 'section');
    playerSec.id = 'player-card';
    playerSec.append(el('h3', '', t('Selected player')));
    this.playerCard = el('div', 'muted', t('Click a player on the pitch.'));
    playerSec.appendChild(this.playerCard);

    this.root.append(statsSec, teamsSec, playerSec);
  }

  updateDynamic(match: Match, selectedGid: number | null): void {
    if (this.modeA) this.modeA.textContent = t(match.teams[0].mode);
    if (this.modeB) this.modeB.textContent = t(match.teams[1].mode);

    this.chart.update(match);
    this.updateStats(match);
    this.updatePlayerCard(match, selectedGid);
  }

  private updateStats(match: Match): void {
    const [a, b] = [match.teams[0].stats, match.teams[1].stats];
    const poss = Math.max(a.possessionTime + b.possessionTime, 1);
    const set = (label: (typeof STAT_ROWS)[number], va: string, vb: string) => {
      const cells = this.statCells.get(label);
      if (cells) {
        cells[0].textContent = va;
        cells[1].textContent = vb;
      }
    };
    set('shots', String(a.shots), String(b.shots));
    set('on target', String(a.shotsOnTarget), String(b.shotsOnTarget));
    set('xG', a.xg.toFixed(2), b.xg.toFixed(2));
    set('possession', `${Math.round((a.possessionTime / poss) * 100)}%`, `${Math.round((b.possessionTime / poss) * 100)}%`);
    set('passes', String(a.passes), String(b.passes));
    set(
      'pass %',
      `${Math.round((a.passesCompleted / Math.max(a.passes, 1)) * 100)}%`,
      `${Math.round((b.passesCompleted / Math.max(b.passes, 1)) * 100)}%`,
    );
    set('crosses', String(a.crosses), String(b.crosses));
    set('one-twos', String(a.oneTwos), String(b.oneTwos));
    set('third man', String(a.thirdMan), String(b.thirdMan));
    set('overlaps', String(a.overlaps), String(b.overlaps));
    set('headers won', String(a.headersWon), String(b.headersWon));
    set('miscontrols', String(a.miscontrols), String(b.miscontrols));
    set('recoveries', String(a.tackles + a.interceptions), String(b.tackles + b.interceptions));
    set('corners', String(a.corners), String(b.corners));
    set('offsides', String(a.offsides), String(b.offsides));
    set('fouls', String(a.fouls), String(b.fouls));
    set('cards', cardLine(a.yellows, a.reds), cardLine(b.yellows, b.reds));
    set('saves', String(a.saves), String(b.saves));
  }

  /** Set by GameApp (Phase 54): league-side context the match view can't
   * know — the player's personal traits/nameplate (needs the 96-player
   * population) and his career highlight. Null = exhibition/no league. */
  playerContext:
    | ((teamId: string, index: number) => { chips: string; plate: string[]; highlight?: string } | null)
    | null = null;

  private updatePlayerCard(match: Match, selectedGid: number | null): void {
    if (!this.playerCard) return;
    const p = selectedGid !== null ? match.allPlayers.find((x) => x.gid === selectedGid) : undefined;
    if (!p) {
      this.playerCard.textContent = t('Click a player on the pitch.');
      this.playerCard.className = 'muted';
      return;
    }

    const team = match.teams[p.side];
    this.playerCard.className = '';
    this.playerCard.textContent = '';

    const head = el('div', 'team-head');
    const dot = el('span', 'dot');
    dot.style.background = colorHex(team.info.colors.primary);
    head.append(dot, el('span', '', `${p.name} · ${p.role}${p.age !== undefined ? ` · ${p.age}y` : ''} · ${team.info.short}`));
    this.playerCard.appendChild(head);

    this.playerCard.appendChild(el('div', '', `${t('action:')} ${p.action.type}`));

    // Live match rating (Phase 33): same fold the FT rating uses, read
    // against the score as it stands — it settles into the official number
    // at the whistle.
    const s = match.stat(p.gid); // roster row of the slot's CURRENT occupant (Phase 61)
    const diff = (match.score[p.side] ?? 0) - (match.score[1 - p.side] ?? 0);
    const live = match.finished ? s.rating : matchRating(s, diff);
    this.playerCard.appendChild(
      el('div', '', `⭐ ${t('rating')} ${live.toFixed(1)}${s.goals > 0 ? ` · ${'⚽'.repeat(Math.min(s.goals, 4))}` : ''}`),
    );

    const stamRow = el('div', 'row');
    stamRow.appendChild(el('span', 'muted', `${t('stamina')} ${(p.stamina * 100).toFixed(0)}%`));
    stamRow.appendChild(bar(p.stamina, p.stamina > 0.5 ? '#4ade80' : p.stamina > 0.25 ? '#facc15' : '#ef4444'));
    this.playerCard.appendChild(stamRow);

    // Who this player IS (Phase 54): personal traits + data-driven nameplate
    // + the career highlight, resolved league-side via GameApp.
    const extras = this.playerContext?.(team.info.id, p.rosterIdx);
    if (extras) {
      const bits = [
        extras.chips,
        ...extras.plate.map((w) => t(w)),
      ].filter(Boolean).join(' · ');
      if (bits) this.playerCard.appendChild(el('div', 'player-plate', bits));
      if (extras.highlight) this.playerCard.appendChild(el('div', 'muted', extras.highlight));
    }

    // Attribute genes (squad DNA) — single-hue bars: this is magnitude, not identity.
    for (const k of ATTR_KEYS) {
      const row = el('div', 'gene-row');
      row.appendChild(el('div', 'g-name', t(k)));
      const b = bar(p.attrs[k], '#60a5fa');
      b.style.gridColumn = '2 / 4';
      row.appendChild(b);
      this.playerCard.appendChild(row);
    }

    if (p.action.scores.length > 0) {
      this.playerCard.appendChild(el('div', 'muted', t('utility scores:')));
      const list = el('ul', 'why');
      for (const s of p.action.scores) {
        list.appendChild(el('li', '', `${s.action} = ${s.score.toFixed(2)} — ${s.why}`));
      }
      this.playerCard.appendChild(list);
    }
  }
}
