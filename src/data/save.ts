import { League, SAVE_VERSION } from '../sim/League';

/**
 * Local persistence via localStorage. The League serializes to plain JSON with
 * no live RNG state (all randomness is derived from hashed seeds), so a loaded
 * league continues exactly where it left off — at fixture granularity.
 */
const KEY = 'evofootball-arena-save-v1';

/**
 * Structural sanity check before handing data to League.fromJSON — the fields
 * every save version (v1+) must carry. Keeps a malformed or truncated save
 * (or a hand-imported file, see export/import) from silently becoming null
 * deep inside the migration chain.
 */
export function isLeagueSaveData(data: unknown): data is Record<string, unknown> {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.version === 'number' &&
    Number.isInteger(d.version) &&
    d.version >= 1 &&
    d.version <= SAVE_VERSION &&
    typeof d.seed === 'number' &&
    typeof d.generation === 'number' &&
    Array.isArray(d.franchises) &&
    d.franchises.length > 0 &&
    Array.isArray(d.fixtures) &&
    Array.isArray(d.table)
  );
}

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
    const data: unknown = JSON.parse(raw);
    if (!isLeagueSaveData(data)) {
      console.error('Load failed: save data is not a recognizable league save');
      return null;
    }
    return League.fromJSON(data);
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
