import type { Franchise } from '../evolution/franchise';
import type { SeasonRecord } from './League';

/**
 * Record mining over season history — pure functions so the hall of fame and
 * season-report narratives are unit-testable. Slots are stable franchise
 * identities across the whole timeline (divisions change, slots don't), so
 * long-run stories are computed per slot and NAMED from the era they
 * happened in (records store names as they were at the time).
 */

/** Which division a slot played in during a recorded season (default 0 for the single-division era). */
export function divisionIn(rec: SeasonRecord, slot: number): 0 | 1 {
  return (rec.table.find((r) => r.slot === slot)?.division ?? 0) as 0 | 1;
}

/** Premier titles by team name (a renamed/reborn franchise is a new team). */
export function premierTitles(history: SeasonRecord[]): Map<string, number> {
  const out = new Map<string, number>();
  for (const r of history) out.set(r.championName, (out.get(r.championName) ?? 0) + 1);
  return out;
}

/** Challenger titles by team name. */
export function challengerTitles(history: SeasonRecord[]): Map<string, number> {
  const out = new Map<string, number>();
  for (const r of history) {
    if (r.d2Champion) out.set(r.d2Champion, (out.get(r.d2Champion) ?? 0) + 1);
  }
  return out;
}

/** Promotion/relegation counts per franchise (lineage-based, survives renames). */
export function movementCounts(franchises: Franchise[]): Array<{
  name: string;
  promotions: number;
  relegations: number;
}> {
  return franchises.map((f) => ({
    name: f.name,
    promotions: f.lineage.filter((l) => l.event === 'promoted').length,
    relegations: f.lineage.filter((l) => l.event === 'relegated').length,
  }));
}

/** Longest unbroken run of Premier seasons, per slot; returns the best. */
export function longestPremierStreak(
  history: SeasonRecord[],
  franchises: Franchise[],
): { slot: number; name: string; length: number } | null {
  if (history.length === 0) return null;
  let best: { slot: number; name: string; length: number } | null = null;
  for (const f of franchises) {
    let run = 0;
    let bestRun = 0;
    for (const rec of history) {
      if (divisionIn(rec, f.slot) === 0) {
        run++;
        bestRun = Math.max(bestRun, run);
      } else {
        run = 0;
      }
    }
    // The streak may still be alive: count the current division too.
    if (f.division === 0 && divisionIn(history[history.length - 1], f.slot) === 0) {
      bestRun = Math.max(bestRun, run + 1);
    }
    if (bestRun > 0 && (!best || bestRun > best.length)) {
      best = { slot: f.slot, name: f.name, length: bestRun };
    }
  }
  return best;
}

/**
 * Greatest comeback: a slot that was relegated and LATER won the Premier
 * title. Returns the tightest such arc (fewest seasons from fall to crown).
 */
export function greatestComeback(
  history: SeasonRecord[],
): { name: string; fellSeason: number; wonSeason: number } | null {
  let best: { name: string; fellSeason: number; wonSeason: number } | null = null;
  for (const fall of history) {
    for (const rel of fall.relegated ?? []) {
      for (const later of history) {
        if (later.generation <= fall.generation) continue;
        if (later.championSlot === rel.slot) {
          const arc = {
            name: later.championName,
            fellSeason: fall.generation,
            wonSeason: later.generation,
          };
          if (!best || arc.wonSeason - arc.fellSeason < best.wonSeason - best.fellSeason) best = arc;
          break; // first title after this fall is the comeback
        }
      }
    }
  }
  return best;
}

/**
 * Season-narrative helpers: compare a season against the previous one.
 * Returns human-readable story fragments (empty when nothing notable).
 */
export function seasonStories(history: SeasonRecord[]): string[] {
  const rec = history[history.length - 1];
  if (!rec) return [];
  const prev = history[history.length - 2];
  const out: string[] = [];

  // Title retained / first-time champion.
  if (prev && prev.championSlot === rec.championSlot && prev.championName === rec.championName) {
    out.push(`${rec.championName} retained the Premier title.`);
  } else if (prev) {
    out.push(`${rec.championName} took the Premier title from ${prev.championName}.`);
  } else {
    out.push(`${rec.championName} won the inaugural Premier title.`);
  }

  // Promoted-team performance this season (they came up LAST season).
  if (prev?.promoted?.length) {
    const d1Rows = rec.table.filter((r) => (r.division ?? 0) === 0);
    for (const p of prev.promoted) {
      const pos = d1Rows.findIndex((r) => r.slot === p.slot);
      if (pos === -1) continue;
      const row = d1Rows[pos];
      if (row.slot === rec.championSlot) {
        out.push(`Promoted ${row.name} won the Premier title in their first season up — a fairytale.`);
      } else if (pos < 4) {
        out.push(`Promoted ${row.name} overachieved, finishing ${ordinal(pos + 1)} in the Premier.`);
      } else if (rec.relegated?.some((x) => x.slot === p.slot)) {
        out.push(`${row.name} bounced straight back down after one Premier season.`);
      }
    }
  }

  // Fallen champion: a relegated team that once won the Premier.
  for (const relTeam of rec.relegated ?? []) {
    const wasChampion = history.some(
      (r) => r.generation < rec.generation && r.championSlot === relTeam.slot && r.championName === relTeam.name,
    );
    const row = rec.table.find((r) => r.slot === relTeam.slot);
    if (wasChampion) {
      out.push(`Former champions ${relTeam.name} fell to the Challenger Division${row ? ` with ${row.pts} points` : ''}.`);
    }
  }

  // Biggest collapse / overachiever by points swing vs last season (same team, same division both years).
  if (prev) {
    let bestUp: { name: string; d: number } | null = null;
    let bestDown: { name: string; d: number } | null = null;
    for (const row of rec.table) {
      const before = prev.table.find(
        (r) => r.slot === row.slot && r.name === row.name && (r.division ?? 0) === (row.division ?? 0),
      );
      if (!before) continue;
      const d = row.pts - before.pts;
      if (!bestUp || d > bestUp.d) bestUp = { name: row.name, d };
      if (!bestDown || d < bestDown.d) bestDown = { name: row.name, d };
    }
    if (bestUp && bestUp.d >= 6) out.push(`Overachievers: ${bestUp.name} (+${bestUp.d} pts on last season).`);
    if (bestDown && bestDown.d <= -6) out.push(`Collapse of the season: ${bestDown.name} (${bestDown.d} pts on last season).`);
  }

  return out;
}

export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
}
