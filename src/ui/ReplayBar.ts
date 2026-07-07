import type { MatchEvent } from '../sim/types';
import { button, el } from './dom';
import { t } from './i18n';

export interface ReplayCallbacks {
  onPlayPause(): void;
  onSpeed(s: number): void;
  onScrub(t: number): void;
  onJump(ev: MatchEvent): void;
  onExit(): void;
}

const EVENT_ICON: Partial<Record<MatchEvent['type'], string>> = {
  goal: '⚽',
  shot: '🎯',
  save: '🧤',
};

/**
 * Replay transport overlay (3D view): play/pause, speed (incl. slow-mo),
 * timeline scrubbing and event jump chips. Pure UI — GameApp owns the state.
 */
export class ReplayBar {
  readonly root: HTMLDivElement;
  private playBtn: HTMLButtonElement;
  private range: HTMLInputElement;
  private timeLabel: HTMLSpanElement;
  private context: HTMLSpanElement;
  private chips: HTMLDivElement;
  private speedBtns = new Map<number, HTMLButtonElement>();
  private t0 = 0;
  private t1 = 1;

  constructor(host: HTMLElement, cb: ReplayCallbacks) {
    this.root = el('div');
    this.root.id = 'replay-bar';
    this.root.classList.add('hidden');

    const row1 = el('div', 'row');
    row1.appendChild(el('span', 'replay-badge', 'REPLAY'));
    this.context = el('span', 'replay-context', '');
    this.playBtn = button('⏸', cb.onPlayPause);
    row1.appendChild(this.playBtn);
    for (const s of [0.25, 0.5, 1, 2]) {
      const b = button(`${s}×`, () => cb.onSpeed(s));
      this.speedBtns.set(s, b);
      row1.appendChild(b);
    }
    this.timeLabel = el('span', 'muted', '');
    row1.appendChild(this.timeLabel);
    row1.appendChild(this.context);
    const spacer = el('span', 'spacer');
    row1.appendChild(spacer);
    row1.appendChild(button(t('exit replay ✕'), cb.onExit));

    this.range = el('input');
    this.range.type = 'range';
    this.range.min = '0';
    this.range.max = '1000';
    this.range.addEventListener('input', () => {
      const f = Number(this.range.value) / 1000;
      cb.onScrub(this.t0 + (this.t1 - this.t0) * f);
    });

    this.chips = el('div', 'row chips');

    this.root.append(row1, this.range, this.chips);
    host.appendChild(this.root);

    const stop = (e: Event) => e.stopPropagation();
    this.root.addEventListener('pointerdown', stop);
  }

  /** What moment is being rewatched — set on event jumps, cleared on show. */
  setContext(ev: MatchEvent | null): void {
    this.context.textContent = ev ? `${EVENT_ICON[ev.type] ?? ''} ${ev.minute}' — ${ev.text}` : '';
  }

  show(range: [number, number], events: MatchEvent[], cb: ReplayCallbacks): void {
    [this.t0, this.t1] = range;
    this.setContext(null);
    this.chips.textContent = '';
    for (const ev of events) {
      if (ev.t < this.t0 || ev.t > this.t1) continue; // only jumps inside the recording
      const icon = EVENT_ICON[ev.type];
      if (!icon) continue;
      const chip = button(`${icon}${ev.minute}'`, () => cb.onJump(ev), 'chip');
      chip.title = `${ev.minute}' — ${ev.text}`; // hover preview of the moment
      this.chips.appendChild(chip);
    }
    if (this.chips.childNodes.length === 0) {
      this.chips.appendChild(el('span', 'muted', 'no key events in the recorded span'));
    }
    this.root.classList.remove('hidden');
  }

  hide(): void {
    this.root.classList.add('hidden');
  }

  setTime(t: number, playing: boolean, speed: number): void {
    this.playBtn.textContent = playing ? '⏸' : '▶';
    const span = Math.max(this.t1 - this.t0, 1e-6);
    this.range.value = String(Math.round(((t - this.t0) / span) * 1000));
    this.timeLabel.textContent = `${t.toFixed(1)}s / ${this.t1.toFixed(1)}s`;
    for (const [s, b] of this.speedBtns) b.classList.toggle('active', s === speed);
  }
}
