import type { MatchEvent } from '../sim/types';

/**
 * Highlight-reel moment picker (Phase 33). Pure: the reel is presentation —
 * results are already decided; this just chooses which recorded instants to
 * replay. Goals always make the cut (newest survive a cap), big saves fill
 * what's left. `minT` lets the FT reel skip everything the HT reel already
 * showed. Chronological order — a reel tells the match's story.
 */
export function pickHighlights(events: MatchEvent[], minT = -1, max = 4): MatchEvent[] {
  const goals = events.filter((e) => e.type === 'goal' && e.t > minT);
  const saves = events.filter((e) => e.type === 'save' && e.t > minT);
  const keptGoals = goals.length > max ? goals.slice(goals.length - max) : goals;
  const room = max - keptGoals.length;
  const picked = [...keptGoals, ...saves.slice(0, Math.max(0, room))];
  return picked.sort((a, b) => a.t - b.t);
}

/** Per-moment playback plan: lead-in, hold, and the drama-appropriate speed. */
export function momentWindow(ev: MatchEvent, range: [number, number]): { from: number; to: number; speed: number } {
  return {
    from: Math.max(range[0], ev.t - 3),
    to: Math.min(range[1], ev.t + 1.5),
    speed: ev.type === 'goal' || ev.type === 'save' ? 0.5 : 0.75,
  };
}
