import type { CameraMode } from '../render3d/CameraController';
import { CUP_ROUND_SHORT } from '../sim/cup';
import type { League } from '../sim/League';
import type { Match } from '../sim/Match';
import { button, checkbox, colorHex, el } from './dom';
import { halfLabel, t } from './i18n';
import type { FxQuality, GameActions, UiFlags, ViewMode } from './actions';

const FX_LABELS: Array<[FxQuality, string]> = [
  ['low', t('Low')],
  ['medium', t('Med')],
  ['high', t('High')],
];

const CAMERA_LABELS: Array<[CameraMode, string]> = [
  ['tactical', t('Tactical')],
  ['broadcast', t('TV')],
  ['follow', t('Ball')],
  ['behindGoal', t('Goal')],
  ['orbit', t('Orbit')],
];

const FLAG_LABELS: Array<[keyof UiFlags, string]> = [
  ['actionLabels', t('Player action labels')],
  ['formation', t('Formation targets')],
  ['passLines', t('Pass target line')],
  ['shotVector', t('Shot vector')],
  ['marking', t('Marking lines')],
  ['chasers', t('Press assignments')],
  ['heatmap', t('Ball heatmap')],
];

/** Match control panel: scoreboard, speed, sim buttons, debug toggles. */
export class LeftPanel {
  private nameA: HTMLElement;
  private nameB: HTMLElement;
  private score: HTMLElement;
  private clock: HTMLElement;
  private lastScore = '';
  private lastClock = '';
  private meta: HTMLElement;
  private pauseBtn: HTMLButtonElement | null = null;
  private isPaused = false;
  private simButtons: HTMLButtonElement[] = [];
  private cameraButtons = new Map<CameraMode, HTMLButtonElement>();
  private threeOnly: HTMLButtonElement[] = [];
  private fxButtons = new Map<FxQuality, HTMLButtonElement>();

  constructor(root: HTMLElement, actions: GameActions, flags: UiFlags) {
    const scoreboard = el('div', 'section');
    scoreboard.id = 'scoreboard';
    const names = el('div', 'names');
    this.nameA = el('span', '', '—');
    this.nameB = el('span', '', '—');
    names.append(this.nameA, this.nameB);
    this.score = el('div', 'score', '0 – 0');
    this.clock = el('div', 'clock', "0'");
    this.meta = el('div', 'muted', '');
    scoreboard.append(names, this.score, this.clock, this.meta);
    // The whole scoreboard is the tale-of-the-tape button (Phase 33, user
    // request): tap it any time to pop the two teams' tactical DNA.
    scoreboard.classList.add('clickable');
    scoreboard.title = t('Tap for the tactical DNA clash');
    scoreboard.addEventListener('click', () => actions.toggleClash());

    // Match control (29.1, user request): the 1×/2×/8×/32× preset row is
    // gone — watching is watching (1×), everything faster is ⏭ skip or the
    // headless sim buttons. Two big buttons: pause/play toggle and skip.
    const speedSec = el('div', 'section');
    speedSec.append(el('h3', '', t('Match control')));
    const speedRow = el('div', 'row speed-row');
    this.pauseBtn = button(t('⏸ pause'), () => actions.setPaused(!this.isPaused));
    speedRow.appendChild(this.pauseBtn);
    speedRow.appendChild(button(t('⏭ skip'), () => actions.skipMatch()));
    speedSec.append(speedRow);
    speedSec.appendChild(checkbox(t('Auto-continue to next match'), true, (v) => actions.setAutoContinue(v)));

    const simSec = el('div', 'section');
    simSec.append(el('h3', '', t('Simulate (headless)')));
    const simRow = el('div', 'row');
    const b1 = button(t('Round'), () => actions.simRound());
    const b2 = button(t('Season'), () => actions.simSeason());
    const b3 = button(t('10 Seasons'), () => actions.simSeasons(10));
    this.simButtons = [b1, b2, b3];
    simRow.append(b1, b2, b3);
    simSec.append(simRow);

    // Camera (34.1 overhaul, user requests): the 2D/3D toggle is GONE from
    // the panel — 3D is the game; the Pixi view survives only as the WebGL
    // fallback (setViewMode still works, tooling reaches it via __evo).
    const viewSec = el('div', 'section');
    viewSec.append(el('h3', '', t('View & camera')));
    const camSeg = el('div', 'seg');
    for (const [mode, label] of CAMERA_LABELS) {
      const b = button(label, () => actions.setCameraMode(mode));
      this.cameraButtons.set(mode, b);
      this.threeOnly.push(b);
      camSeg.appendChild(b);
    }
    viewSec.appendChild(camSeg);
    const camRow2 = el('div', 'row');
    const resetCam = button(t('Reset cam'), () => actions.resetCamera());
    const replayBtn = button(t('🎬 Replay'), () => actions.openReplay());
    this.threeOnly.push(resetCam);
    camRow2.append(resetCam, replayBtn);
    viewSec.appendChild(camRow2);

    // Presentation: cinematic lives ON THE STAGE now (used constantly —
    // one tap, no panel dive); Share summary is gone (user call).
    const presSec = el('div', 'section');
    presSec.append(el('h3', '', t('Presentation')));
    const presRow = el('div', 'row');
    presRow.appendChild(button(t('📸 Screenshot'), () => actions.takeScreenshot()));
    presSec.appendChild(presRow);
    // HT/FT auto-highlights (Phase 33): watched 3D matches replay their
    // goals + big saves at the whistles; ⏭ skips a running reel.
    presSec.appendChild(checkbox(t('🎬 Auto highlights (HT/FT)'), false, (v) => actions.setAutoHighlights(v)));
    // The tactical BROADCAST layer (Phase 68, N4) — presentation, not debug:
    // block outline + press waves + the mini formation map, on by default.
    presSec.appendChild(checkbox(t('📡 Tactical broadcast'), flags.broadcast, (v) => actions.setFlag('broadcast', v)));
    presSec.appendChild(checkbox(t('Sound FX (beeps)'), false, (v) => actions.setSound(v)));
    const fxRow = el('div', 'row');
    fxRow.appendChild(el('span', 'muted g-name', t('FX quality')));
    const fxSeg = el('div', 'seg');
    fxRow.appendChild(fxSeg);
    for (const [q, label] of FX_LABELS) {
      const b = button(label, () => actions.setFxQuality(q));
      this.fxButtons.set(q, b);
      fxSeg.appendChild(b);
    }
    presSec.appendChild(fxRow);

    const dbgSec = el('div', 'section');
    dbgSec.className = 'section debug-section';
    dbgSec.append(el('h3', '', t('Debug overlays')));
    for (const [key, label] of FLAG_LABELS) {
      dbgSec.appendChild(checkbox(label, flags[key], (v) => actions.setFlag(key, v)));
    }

    root.append(scoreboard, speedSec, viewSec, simSec, presSec, dbgSec);
    this.setViewUI('2d', 'tactical');
    this.setFxQualityUI('medium');
  }

  setFxQualityUI(q: FxQuality): void {
    for (const [k, b] of this.fxButtons) b.classList.toggle('active', k === q);
  }

  setViewUI(view: ViewMode, camera: CameraMode): void {
    for (const [m, b] of this.cameraButtons) b.classList.toggle('active', view === '3d' && m === camera);
    for (const b of this.threeOnly) b.disabled = view !== '3d';
  }

  updateHeader(match: Match, league: League, exhibition = false): void {
    this.nameA.textContent = match.teams[0].info.name;
    this.nameA.style.color = colorHex(match.teams[0].info.colors.primary);
    this.nameB.textContent = match.teams[1].info.name;
    this.nameB.style.color = colorHex(match.teams[1].info.colors.primary);
    const fixture = exhibition ? null : league.nextFixture();
    const context = exhibition
      ? t('⚡ Exhibition (friendly)')
      : fixture?.playoff
        ? t('⚔ Promotion playoff')
        : fixture?.cup
          ? `⚡ ${t('Cup')} ${CUP_ROUND_SHORT[fixture.round]}`
          : `${fixture ? `D${fixture.division + 1} ` : ''}${t('Round#')} ${league.currentRound()}/7`;
    this.meta.textContent = `${t('Gen')} ${league.generation} · ${t('Season#')} ${league.history.length + 1} · ${context}`;
  }

  updateClock(match: Match): void {
    // Called every frame — diff before writing (the score changes a handful
    // of times per match, the clock about once per second).
    const score = `${match.score[0]} – ${match.score[1]}`;
    if (score !== this.lastScore) {
      this.lastScore = score;
      this.score.textContent = score;
    }
    const phase = match.phase;
    const restart = match.restart
      ? match.restart.offside
        ? t('🚩 offside')
        : {
            kickIn: t('↪ kick-in'),
            corner: t('⚑ corner'),
            goalKick: t('🥅 goal kick'),
            freeKick: t('⚠ free kick'),
            penalty: t('⚡ PENALTY'),
          }[match.restart.kind]
      : null;
    const label =
      phase === 'kickoff' ? t('KO') :
      phase === 'goalPause' ? t('GOAL!') :
      phase === 'halftime' ? t('HT') :
      phase === 'fulltime' ? t('FT') :
      phase === 'restart' && restart ? `${match.clockText()}' · ${restart}` :
      `${match.clockText()}'`;
    const clock = `${label}  ·  ${halfLabel(match.half)}`;
    if (clock !== this.lastClock) {
      this.lastClock = clock;
      this.clock.textContent = clock;
    }
  }

  setSpeedUI(paused: boolean, _speed: number): void {
    this.isPaused = paused;
    if (this.pauseBtn) {
      this.pauseBtn.textContent = paused ? t('▶ play') : t('⏸ pause');
      this.pauseBtn.classList.toggle('active', paused);
    }
  }

  setBusy(busy: boolean): void {
    for (const b of this.simButtons) b.disabled = busy;
  }
}
