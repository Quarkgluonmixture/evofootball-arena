import type { Match } from '../sim/Match';
import type { EventType } from '../sim/types';
import { el } from './dom';

const ICON: Record<EventType, string> = {
  goal: '⚽',
  shot: '🎯',
  save: '🧤',
  interception: '✂️',
  tackle: '🛡️',
  keypass: '🔑',
  corner: '⚑',
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
    this.match = match;
    this.cursor = 0;
    this.pushSystem(`— ${match.teams[0].info.name} vs ${match.teams[1].info.name} —`);
  }

  sync(): void {
    const match = this.match;
    if (!match) return;
    while (this.cursor < match.events.length) {
      const ev = match.events[this.cursor++];
      const row = el('div', `ev ${ev.type === 'goal' ? 'goal' : ''}`);
      const who = ev.side === -1 ? '' : `${match.teams[ev.side].info.short} `;
      row.innerHTML = `<b>${ev.minute}'</b> ${ICON[ev.type]} ${who}${escapeHtml(ev.text)}`;
      this.prepend(row);
    }
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

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
