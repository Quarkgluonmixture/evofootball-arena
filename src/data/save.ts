import { League } from '../sim/League';

/**
 * Local persistence via localStorage. The League serializes to plain JSON with
 * no live RNG state (all randomness is derived from hashed seeds), so a loaded
 * league continues exactly where it left off — at fixture granularity.
 */
const KEY = 'evofootball-arena-save-v1';

export function saveLeague(league: League): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(league.toJSON()));
    return true;
  } catch (err) {
    console.error('Save failed:', err);
    return false;
  }
}

export function loadLeague(): League | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return League.fromJSON(JSON.parse(raw) as Record<string, unknown>);
  } catch (err) {
    console.error('Load failed (corrupt save?):', err);
    return null;
  }
}

export function hasSave(): boolean {
  try {
    return localStorage.getItem(KEY) !== null;
  } catch {
    return false;
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
