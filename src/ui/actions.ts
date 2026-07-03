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

export const defaultFlags = (): UiFlags => ({
  actionLabels: true,
  heatmap: false,
  formation: false,
  passLines: true,
  shotVector: true,
  marking: false,
  chasers: false,
});

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
  saveNow(): void;
  loadNow(): void;
  newLeague(seedText: string): void;
  resetAll(): void;
  setViewMode(v: ViewMode): void;
  setCameraMode(m: CameraMode): void;
  resetCamera(): void;
  openReplay(): void;
  setSound(v: boolean): void;
  /** Presentation (Phase 15): all real controls, all optional. */
  setCinematic(v: boolean): void;
  setFxQuality(q: FxQuality): void;
  takeScreenshot(): void;
  copyShareSummary(): void;
}
