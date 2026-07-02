import type { CameraMode } from '../render3d/CameraController';
import type { League } from '../sim/League';
import type { Match } from '../sim/Match';
import { button, checkbox, colorHex, el } from './dom';
import type { GameActions, UiFlags, ViewMode } from './actions';

const CAMERA_LABELS: Array<[CameraMode, string]> = [
  ['tactical', 'Tactical'],
  ['broadcast', 'TV'],
  ['follow', 'Ball'],
  ['behindGoal', 'Goal'],
  ['orbit', 'Orbit'],
];

const FLAG_LABELS: Array<[keyof UiFlags, string]> = [
  ['actionLabels', 'Player action labels'],
  ['formation', 'Formation targets'],
  ['passLines', 'Pass target line'],
  ['shotVector', 'Shot vector'],
  ['marking', 'Marking lines'],
  ['chasers', 'Press assignments'],
  ['heatmap', 'Ball heatmap'],
];

/** Match control panel: scoreboard, speed, sim buttons, debug toggles. */
export class LeftPanel {
  private nameA: HTMLElement;
  private nameB: HTMLElement;
  private score: HTMLElement;
  private clock: HTMLElement;
  private meta: HTMLElement;
  private speedButtons = new Map<number, HTMLButtonElement>();
  private simButtons: HTMLButtonElement[] = [];
  private viewButtons = new Map<ViewMode, HTMLButtonElement>();
  private cameraButtons = new Map<CameraMode, HTMLButtonElement>();
  private threeOnly: HTMLButtonElement[] = [];

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

    const speedSec = el('div', 'section');
    speedSec.append(el('h3', '', 'Speed'));
    const speedRow = el('div', 'row');
    const speeds: Array<[number, string]> = [[0, '⏸'], [1, '1×'], [2, '2×'], [8, '8×'], [32, '32×']];
    for (const [s, label] of speeds) {
      const b = button(label, () => (s === 0 ? actions.setPaused(true) : actions.setSpeed(s)));
      this.speedButtons.set(s, b);
      speedRow.appendChild(b);
    }
    speedRow.appendChild(button('⏭ skip', () => actions.skipMatch()));
    speedSec.append(speedRow);
    speedSec.appendChild(checkbox('Auto-continue to next match', true, (v) => actions.setAutoContinue(v)));

    const simSec = el('div', 'section');
    simSec.append(el('h3', '', 'Simulate (headless)'));
    const simRow = el('div', 'row');
    const b1 = button('Round', () => actions.simRound());
    const b2 = button('Season', () => actions.simSeason());
    const b3 = button('10 Seasons', () => actions.simSeasons(10));
    this.simButtons = [b1, b2, b3];
    simRow.append(b1, b2, b3);
    simSec.append(simRow);

    const viewSec = el('div', 'section');
    viewSec.append(el('h3', '', 'View & camera'));
    const viewRow = el('div', 'row');
    for (const v of ['2d', '3d'] as ViewMode[]) {
      const b = button(v.toUpperCase(), () => actions.setViewMode(v));
      this.viewButtons.set(v, b);
      viewRow.appendChild(b);
    }
    viewSec.appendChild(viewRow);
    const camRow = el('div', 'row');
    for (const [mode, label] of CAMERA_LABELS) {
      const b = button(label, () => actions.setCameraMode(mode));
      this.cameraButtons.set(mode, b);
      this.threeOnly.push(b);
      camRow.appendChild(b);
    }
    viewSec.appendChild(camRow);
    const camRow2 = el('div', 'row');
    const resetCam = button('Reset cam', () => actions.resetCamera());
    const replayBtn = button('🎬 Replay', () => actions.openReplay());
    this.threeOnly.push(resetCam);
    camRow2.append(resetCam, replayBtn);
    viewSec.appendChild(camRow2);
    viewSec.appendChild(checkbox('Sound FX (beeps)', false, (v) => actions.setSound(v)));

    const dbgSec = el('div', 'section');
    dbgSec.append(el('h3', '', 'Debug overlays'));
    for (const [key, label] of FLAG_LABELS) {
      dbgSec.appendChild(checkbox(label, flags[key], (v) => actions.setFlag(key, v)));
    }

    root.append(scoreboard, speedSec, viewSec, simSec, dbgSec);
    this.setViewUI('2d', 'tactical');
  }

  setViewUI(view: ViewMode, camera: CameraMode): void {
    for (const [v, b] of this.viewButtons) b.classList.toggle('active', v === view);
    for (const [m, b] of this.cameraButtons) b.classList.toggle('active', view === '3d' && m === camera);
    for (const b of this.threeOnly) b.disabled = view !== '3d';
  }

  updateHeader(match: Match, league: League): void {
    this.nameA.textContent = match.teams[0].info.name;
    this.nameA.style.color = colorHex(match.teams[0].info.colors.primary);
    this.nameB.textContent = match.teams[1].info.name;
    this.nameB.style.color = colorHex(match.teams[1].info.colors.primary);
    const div = league.nextFixture() ? `D${league.nextFixture()!.division + 1} ` : '';
    this.meta.textContent = `Gen ${league.generation} · Season ${league.history.length + 1} · ${div}Round ${league.currentRound()}/7`;
  }

  updateClock(match: Match): void {
    this.score.textContent = `${match.score[0]} – ${match.score[1]}`;
    const phase = match.phase;
    const label =
      phase === 'kickoff' ? 'KO' :
      phase === 'goalPause' ? 'GOAL!' :
      phase === 'halftime' ? 'HT' :
      phase === 'fulltime' ? 'FT' :
      `${match.minute()}'`;
    this.clock.textContent = `${label}  ·  H${match.half}`;
  }

  setSpeedUI(paused: boolean, speed: number): void {
    for (const [s, b] of this.speedButtons) {
      b.classList.toggle('active', paused ? s === 0 : s === speed);
    }
  }

  setBusy(busy: boolean): void {
    for (const b of this.simButtons) b.disabled = busy;
  }
}
