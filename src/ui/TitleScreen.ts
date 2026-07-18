import { t } from './i18n';

/**
 * The launch overlay (Phase 96, user-designed): a synthwave/chiptune title
 * screen — retro grid horizon, neon sun, pixel accents — with every
 * animation pulsed at 120BPM (500ms multiples) to sit on the Title track's
 * beat. Two-stage by design:
 *
 *   stage 1  "CLICK TO ENTER" — the first click IS the WebAudio gesture:
 *            the AudioContext resumes and the Title BGM starts (the slot
 *            already exists in MusicSystem; the match runs beneath as
 *            attract mode the whole time).
 *   stage 2  "▶ START" — dismisses the overlay to the live game.
 *
 * Tooling: visual suites MUST dismiss this first (window.__evo.skipTitle()).
 */
export class TitleScreen {
  private root: HTMLDivElement;
  private prompt: HTMLDivElement;
  private startBtn: HTMLButtonElement;
  private entered = false;
  private visible = true;

  constructor(private hooks: { onEnter: () => void; onStart: () => void }) {
    this.root = document.createElement('div');
    this.root.className = 'title-screen';
    this.root.innerHTML = `
      <div class="ts-stars"></div>
      <div class="ts-sun"></div>
      <div class="ts-haze"></div>
      <div class="ts-grid-wrap"><div class="ts-grid"></div></div>
      <div class="ts-core">
        <div class="ts-top">
          <div class="ts-logo">
            <span class="ts-logo-evo">EVOFOOTBALL</span>
            <span class="ts-logo-arena">ARENA</span>
          </div>
          <div class="ts-sub">· evolution never sleeps ·</div>
        </div>
        <div class="ts-bottom"></div>
      </div>`;
    this.prompt = document.createElement('div');
    this.prompt.className = 'ts-prompt';
    this.prompt.textContent = t('CLICK TO ENTER');
    this.startBtn = document.createElement('button');
    this.startBtn.className = 'ts-start';
    this.startBtn.textContent = `▶ ${t('START')}`;
    this.startBtn.style.display = 'none';
    this.root.querySelector('.ts-bottom')!.append(this.prompt, this.startBtn);
    document.body.appendChild(this.root);

    // Stage 1: the whole screen is the enter target (phone-friendly).
    this.root.addEventListener('click', () => this.enter());
    // Stage 2: START only (stopPropagation keeps the root handler quiet).
    this.startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.dismiss();
    });
  }

  get isVisible(): boolean {
    return this.visible;
  }

  private enter(): void {
    if (this.entered || !this.visible) return;
    this.entered = true;
    this.root.classList.add('ts-entered');
    this.prompt.style.display = 'none';
    this.startBtn.style.display = '';
    this.hooks.onEnter(); // the user gesture: resume audio + start Title BGM
  }

  private dismiss(): void {
    if (!this.visible) return;
    this.visible = false;
    this.root.classList.add('ts-out');
    setTimeout(() => this.root.remove(), 600);
    this.hooks.onStart();
  }

  /** Tooling escape hatch: drop the overlay entirely, no audio side effects. */
  skip(): void {
    if (!this.visible) return;
    this.visible = false;
    this.root.remove();
    this.hooks.onStart();
  }
}
