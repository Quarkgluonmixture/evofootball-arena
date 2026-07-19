import type { CameraMode } from '../render3d/CameraController';
import type { FxQuality } from '../render3d/FxSystem';

export type ViewMode = '2d' | '3d';
export type { FxQuality };

/** UI ↔ game contract. GameApp implements this; panels call it. */
export interface UiFlags {
  actionLabels: boolean;
  heatmap: boolean;
  formation: boolean;
  passLines: boolean;
  shotVector: boolean;
  marking: boolean;
  chasers: boolean;
}

// Default view is CLEAN (2026-07-19, user: "把默认调试图层都关闭"): every dev
// overlay ships OFF so a first look is the football, not the diagnostics. All
// remain toggleable in the debug panel.
export const defaultFlags = (): UiFlags => ({
  actionLabels: false,
  heatmap: false,
  formation: false,
  passLines: false,
  shotVector: false,
  marking: false,
  chasers: false,
});

/** The overlay-channel subset of UiFlags — shared by the 2D and 3D overlays. */
export type OverlayFlags = Pick<UiFlags, 'formation' | 'passLines' | 'shotVector' | 'marking' | 'chasers'>;

/** True when any overlay channel is on (single source for both views). */
export const anyOverlayOn = (f: OverlayFlags): boolean =>
  f.formation || f.passLines || f.shotVector || f.marking || f.chasers;

export interface GameActions {
  setPaused(p: boolean): void;
  setSpeed(s: number): void;
  skipMatch(): void;
  simRound(): void;
  simSeason(): void;
  simSeasons(n: number): void;
  setAutoContinue(v: boolean): void;
  setFlag(key: keyof UiFlags, v: boolean): void;
  toggleLeagueScreen(): void;
  /** Pop the tactical-DNA clash for the current match (Phase 33: the scoreboard is the button). */
  toggleClash(): void;
  saveNow(): void;
  loadNow(): void;
  newLeague(seedText: string): void;
  resetAll(): void;
  setViewMode(v: ViewMode): void;
  setCameraMode(m: CameraMode): void;
  resetCamera(): void;
  openReplay(): void;
  setSound(volume: number): void;
  setMusic(volume: number): void;
  /** Presentation (Phase 15): all real controls, all optional. */
  setCinematic(v: boolean): void;
  /** HT/FT auto-highlight reels (Phase 33) — on by default, ⏭ skips. */
  setAutoHighlights(v: boolean): void;
  setFxQuality(q: FxQuality): void;
  /** Save file down/upload (119a.5: the settings screen owns these now). */
  exportSave(): void;
  importSave(): void;
}
