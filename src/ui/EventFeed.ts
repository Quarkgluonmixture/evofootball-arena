import type { Match } from '../sim/Match';
import type { EventType } from '../sim/types';
import { el, escapeHtml } from './dom';

const ICON: Record<EventType, string> = {
  goal: '⚽',
  shot: '🎯',
  save: '🧤',
  woodwork: '🔩',
  interception: '✂️',
  tackle: '🛡️',
  keypass: '🔑',
  corner: '⚑',
  foul: '⚠️',
  card: '🟨',
  kickoff: '▶️',
  halftime: '⏸',
  fulltime: '🏁',
  info: 'ℹ️',
};

const MAX_ROWS = 90;

/** Rolling match/league event feed, newest first. */
export class EventFeed {
  private root: HTMLElement;
  private match: Match | null = null;
  private cursor = 0;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  attach(match: Match): void {
    // Drain the old match's unsynced tail first (Phase 33): the whistle
    // lines — FT, man of the match, a stoppage-time goal — used to vanish
    // when the next fixture attached in the same frame. A big tail (the
    // match was ⏭-skipped) collapses to its recap: goals + FT + MOTM.
    if (this.match) {
      const rest = this.match.events.slice(this.cursor);
      const recap = rest.length > 12
        ? rest.filter(
            (e) => e.type === 'goal' || e.type === 'fulltime' ||
              (e.type === 'info' && e.text.includes('Man of the match')),
          )
        : rest;
      for (const ev of recap) this.renderEvent(this.match, ev);
    }
    this.match = match;
    this.cursor = 0;
    this.pushSystem(`— ${match.teams[0].info.name} vs ${match.teams[1].info.name} —`);
  }

  sync(): void {
    const match = this.match;
    if (!match) return;
    while (this.cursor < match.events.length) {
      this.renderEvent(match, match.events[this.cursor++]);
    }
  }

  private renderEvent(match: Match, ev: Match['events'][number]): void {
    const row = el('div', `ev ${ev.type === 'goal' ? 'goal' : ''}`);
    const who = ev.side === -1 ? '' : `${match.teams[ev.side].info.short} `;
    row.innerHTML = `<b>${ev.minute}'</b> ${ICON[ev.type]} ${who}${escapeHtml(ev.text)}`;
    this.prepend(row);
  }

  pushSystem(text: string): void {
    const row = el('div', 'ev system', text);
    this.prepend(row);
  }

  private prepend(row: HTMLElement): void {
    this.root.prepend(row);
    while (this.root.childNodes.length > MAX_ROWS) this.root.lastChild?.remove();
  }
}

