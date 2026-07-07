import { GENE_KEYS } from '../evolution/genome';
import { ATTR_KEYS } from '../evolution/playerGenome';
import type { Match } from '../sim/Match';
import { bar, colorHex, el } from './dom';
import { XgChart } from './XgChart';

const STAT_ROWS = [
  'shots',
  'on target',
  'xG',
  'possession',
  'passes',
  'pass %',
  'miscontrols',
  'recoveries',
  'corners',
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
    statsSec.append(el('h3', '', 'Match stats · xG race'));
    statsSec.appendChild(this.chart.root);
    for (const label of STAT_ROWS) {
      const row = el('div', 'gene-row');
      row.appendChild(el('div', 'g-name', label));
      const a = el('div', 'stat-val', '0');
      const b = el('div', 'stat-val', '0');
      row.append(a, b);
      this.statCells.set(label, [a, b]);
      statsSec.appendChild(row);
    }

    // ---- teams & genes ----
    const teamsSec = el('div', 'section');
    teamsSec.append(el('h3', '', 'Teams & tactical genes'));

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
    modes.append(el('div', 'g-name', 'mode'));
    this.modeA = el('span', 'mode-badge', '—');
    this.modeB = el('span', 'mode-badge', '—');
    modes.append(this.modeA, this.modeB);
    teamsSec.appendChild(modes);

    for (const key of GENE_KEYS) {
      const row = el('div', 'gene-row');
      row.appendChild(el('div', 'g-name', key));
      row.appendChild(bar(match.teams[0].genome[key], colorHex(match.teams[0].info.colors.primary)));
      row.appendChild(bar(match.teams[1].genome[key], colorHex(match.teams[1].info.colors.primary)));
      teamsSec.appendChild(row);
    }

    // ---- selected player ----
    const playerSec = el('div', 'section');
    playerSec.id = 'player-card';
    playerSec.append(el('h3', '', 'Selected player'));
    this.playerCard = el('div', 'muted', 'Click a player on the pitch.');
    playerSec.appendChild(this.playerCard);

    this.root.append(statsSec, teamsSec, playerSec);
  }

  updateDynamic(match: Match, selectedGid: number | null): void {
    if (this.modeA) this.modeA.textContent = match.teams[0].mode;
    if (this.modeB) this.modeB.textContent = match.teams[1].mode;

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
    set('miscontrols', String(a.miscontrols), String(b.miscontrols));
    set('recoveries', String(a.tackles + a.interceptions), String(b.tackles + b.interceptions));
    set('corners', String(a.corners), String(b.corners));
    set('fouls', String(a.fouls), String(b.fouls));
    set('cards', cardLine(a.yellows, a.reds), cardLine(b.yellows, b.reds));
    set('saves', String(a.saves), String(b.saves));
  }

  private updatePlayerCard(match: Match, selectedGid: number | null): void {
    if (!this.playerCard) return;
    const p = selectedGid !== null ? match.allPlayers.find((x) => x.gid === selectedGid) : undefined;
    if (!p) {
      this.playerCard.textContent = 'Click a player on the pitch.';
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

    this.playerCard.appendChild(el('div', '', `action: ${p.action.type}`));

    const stamRow = el('div', 'row');
    stamRow.appendChild(el('span', 'muted', `stamina ${(p.stamina * 100).toFixed(0)}%`));
    stamRow.appendChild(bar(p.stamina, p.stamina > 0.5 ? '#4ade80' : p.stamina > 0.25 ? '#facc15' : '#ef4444'));
    this.playerCard.appendChild(stamRow);

    // Attribute genes (squad DNA) — single-hue bars: this is magnitude, not identity.
    for (const k of ATTR_KEYS) {
      const row = el('div', 'gene-row');
      row.appendChild(el('div', 'g-name', k));
      const b = bar(p.attrs[k], '#60a5fa');
      b.style.gridColumn = '2 / 4';
      row.appendChild(b);
      this.playerCard.appendChild(row);
    }

    if (p.action.scores.length > 0) {
      this.playerCard.appendChild(el('div', 'muted', 'utility scores:'));
      const list = el('ul', 'why');
      for (const s of p.action.scores) {
        list.appendChild(el('li', '', `${s.action} = ${s.score.toFixed(2)} — ${s.why}`));
      }
      this.playerCard.appendChild(list);
    }
  }
}
