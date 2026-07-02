import type { Match } from '../sim/Match';
import type { MatchEvent } from '../sim/types';
import {
  buildRenderState, interpolateStates, type RenderState, type RenderTheme,
} from '../render3d/RenderStateAdapter';

/**
 * Records RenderState snapshots of the live match at a fixed sim-time cadence
 * so the 3D viewer can replay/scrub it later. Read-only over the sim: it
 * stores plain data copies produced by the adapter and never mutates match
 * state. Memory: a full 240 s match at 10 Hz is ~2 400 small objects.
 */
export class ReplayBuffer {
  readonly interval: number;
  private snaps: RenderState[] = [];
  private nextT = 0;

  constructor(interval = 0.1) {
    this.interval = interval;
  }

  /** Call after each sim step; records when the next sample is due. */
  maybeRecord(match: Match): void {
    if (match.simTime + 1e-9 < this.nextT) return;
    this.snaps.push(buildRenderState(match, false));
    this.nextT = match.simTime + this.interval;
  }

  clear(): void {
    this.snaps = [];
    this.nextT = 0;
  }

  get size(): number {
    return this.snaps.length;
  }

  get hasContent(): boolean {
    return this.snaps.length >= 2;
  }

  /** Recorded time range [start, end], or null when empty. */
  range(): [number, number] | null {
    if (this.snaps.length === 0) return null;
    return [this.snaps[0].t, this.snaps[this.snaps.length - 1].t];
  }

  /** Interpolated state at sim-time t (clamped to the recorded range). */
  stateAt(t: number): RenderState | null {
    const n = this.snaps.length;
    if (n === 0) return null;
    if (n === 1 || t <= this.snaps[0].t) return this.snaps[0];
    if (t >= this.snaps[n - 1].t) return this.snaps[n - 1];
    // Binary search for the first snapshot with time > t.
    let lo = 0;
    let hi = n - 1;
    while (lo + 1 < hi) {
      const mid = (lo + hi) >> 1;
      if (this.snaps[mid].t <= t) lo = mid;
      else hi = mid;
    }
    const a = this.snaps[lo];
    const b = this.snaps[hi];
    const span = Math.max(b.t - a.t, 1e-9);
    return interpolateStates(a, b, (t - a.t) / span);
  }
}

/** A finished match's replay, kept after the league moves on. */
export interface ReplayArchive {
  buffer: ReplayBuffer;
  theme: RenderTheme;
  /** Notable events (goal/shot/save) for timeline jumping. */
  events: MatchEvent[];
  label: string;
}
