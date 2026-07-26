/**
 * Screen Wake Lock: keep the phone awake while a match is actually playing.
 *
 * The game is something you WATCH — the user's own framing ("You mostly
 * watch") — so a 90-second stretch with no touch input is normal and the phone
 * dims the screen right in the middle of it. That is the interruption this
 * removes; `fluency > interruptions` is on record.
 *
 * Two rules the API forces, and the reasons this is a state machine rather
 * than a `request()` call at kickoff:
 *
 *  1. A lock can only be taken while the document is VISIBLE, and the browser
 *     silently releases it when you background the tab. So it has to be
 *     re-taken on every return to the foreground, not once.
 *  2. `request()` rejects on unsupported browsers, in an insecure context, and
 *     under some power-saving modes. It is driven from the frame loop, so a
 *     failure must NOT be retried per-frame — one attempt per "wanted"
 *     episode, then wait for a real signal.
 *
 * Everything is injected, so the whole thing is testable without a browser.
 */

/** The slice of `WakeLockSentinel` this uses. */
export interface WakeLockSentinelLike {
  readonly released: boolean;
  release(): Promise<void>;
  addEventListener(type: 'release', listener: () => void): void;
}

/** The slice of `navigator.wakeLock` this uses. */
export interface WakeLockApiLike {
  request(type: 'screen'): Promise<WakeLockSentinelLike>;
}

export interface WakeLockEnv {
  /** `navigator.wakeLock`, or null/undefined where unsupported. */
  readonly api: WakeLockApiLike | null | undefined;
  /** Whether the document is currently visible. */
  readonly isVisible: () => boolean;
  /** Subscribe to visibility changes; returns an unsubscribe. */
  readonly onVisibilityChange: (listener: () => void) => () => void;
}

export type WakeLockState =
  /** Nothing wanted, nothing held. */
  | 'idle'
  /** Wanted; a request is in flight. */
  | 'acquiring'
  /** Wanted and held. */
  | 'held'
  /** Wanted, but the browser said no. No further attempts this episode. */
  | 'failed'
  /** Wanted, but the document is hidden — waiting for it to come back. */
  | 'hidden'
  /** The API is absent. Permanently inert. */
  | 'unsupported';

/**
 * Drives one screen wake lock from a boolean that may be set every frame.
 *
 * `setWanted` is idempotent and cheap: it only acts on a real transition, so
 * the frame loop can call it unconditionally.
 */
export class WakeLockManager {
  private state: WakeLockState;
  private wanted = false;
  private sentinel: WakeLockSentinelLike | null = null;
  private unsubscribe: (() => void) | null = null;
  /** Attempts made, exposed for tests: this must not grow per frame. */
  private attempts = 0;

  constructor(private readonly env: WakeLockEnv) {
    this.state = env.api ? 'idle' : 'unsupported';
    if (this.state !== 'unsupported') {
      this.unsubscribe = env.onVisibilityChange(() => this.onVisibility());
    }
  }

  get currentState(): WakeLockState {
    return this.state;
  }

  get requestCount(): number {
    return this.attempts;
  }

  /** True while the screen is actually being held awake. */
  get isHeld(): boolean {
    return this.state === 'held';
  }

  /**
   * Declare whether the screen should stay awake right now. Safe to call on
   * every frame with the same value.
   */
  setWanted(wanted: boolean): void {
    if (this.state === 'unsupported' || wanted === this.wanted) return;
    this.wanted = wanted;
    if (wanted) this.acquire();
    else this.release();
  }

  /** Drop the lock and stop listening — for teardown. */
  dispose(): void {
    this.wanted = false;
    this.release();
    this.unsubscribe?.();
    this.unsubscribe = null;
  }

  private acquire(): void {
    if (this.state === 'held' || this.state === 'acquiring' || this.state === 'failed') return;
    if (!this.env.isVisible()) {
      // Requesting while hidden is guaranteed to reject; wait to be shown.
      this.state = 'hidden';
      return;
    }
    const api = this.env.api;
    if (!api) return;
    this.state = 'acquiring';
    this.attempts++;
    api.request('screen').then(
      (sentinel) => {
        // The episode may have ended while the request was in flight.
        if (!this.wanted) {
          void sentinel.release();
          this.state = 'idle';
          return;
        }
        this.sentinel = sentinel;
        this.state = 'held';
        // The browser releases the lock itself when the page is backgrounded;
        // this keeps our view of the world honest so the next foreground
        // re-acquires instead of assuming it still holds one.
        sentinel.addEventListener('release', () => {
          if (this.sentinel === sentinel) {
            this.sentinel = null;
            this.state = this.wanted ? 'hidden' : 'idle';
          }
        });
      },
      () => {
        // Unsupported flag, insecure context, battery saver, denied policy.
        // One attempt per episode — never a per-frame retry loop.
        this.state = 'failed';
      },
    );
  }

  private release(): void {
    const sentinel = this.sentinel;
    this.sentinel = null;
    this.state = 'idle';
    if (sentinel && !sentinel.released) void sentinel.release().catch(() => {});
  }

  private onVisibility(): void {
    if (!this.env.isVisible()) {
      // The browser has already dropped the lock; mirror that.
      this.sentinel = null;
      if (this.wanted) this.state = 'hidden';
      return;
    }
    // Coming back to the foreground is a genuine signal, so it also clears a
    // previous failure: the reason may well have been transient.
    if (this.wanted && (this.state === 'hidden' || this.state === 'failed')) {
      this.state = 'idle';
      this.acquire();
    }
  }
}

/** What the app looks like right now, as far as the wake lock is concerned. */
export interface AwakeInputs {
  readonly paused: boolean;
  /** Attract mode: a match runs beneath the launch overlay, unwatched. */
  readonly titleVisible: boolean;
  /** A shootout theater owns the stage and animates itself. */
  readonly theaterActive: boolean;
  readonly replayActive: boolean;
  readonly replayPlaying: boolean;
  readonly hasLiveMatch: boolean;
}

/**
 * Whether the screen should be held awake: the game is advancing with no input
 * from anyone, so there is nothing to stop the phone dimming.
 *
 * A paused game, a finished match, a paused replay and the attract-mode title
 * screen all let it sleep — somebody who walked away should not come back to a
 * flat battery.
 */
export function screenShouldStayAwake(s: AwakeInputs): boolean {
  if (s.paused) return false;
  if (s.titleVisible) return false;
  if (s.theaterActive) return true;
  if (s.replayActive) return s.replayPlaying;
  return s.hasLiveMatch;
}

/** The real browser environment, for the app to pass in. */
export function browserWakeLockEnv(): WakeLockEnv {
  const nav = navigator as Navigator & { wakeLock?: WakeLockApiLike };
  return {
    api: nav.wakeLock ?? null,
    isVisible: () => document.visibilityState === 'visible',
    onVisibilityChange: (listener) => {
      document.addEventListener('visibilitychange', listener);
      return () => document.removeEventListener('visibilitychange', listener);
    },
  };
}
