/**
 * ENTITY LINKS (Phase 108, blueprint cross-cutting item): any club or
 * player NAME rendered in prose becomes a link into its deep dive.
 * The chronicle/market/dynasty lines are pre-composed sentences, so
 * instead of restructuring every line builder, `linkifyText` scans a
 * sentence for the names the league currently knows (longest-first so
 * "Red Star II" beats "Red Star") and wraps the matches. Only LIVING
 * entities resolve — a retired player or a folded club stays plain
 * text, which is honest: their dive no longer exists.
 */
import type { League } from '../sim/League';

export interface EntityNav {
  openClub(slot: number): void;
  openPlayer(slot: number, index: number): void;
}

type Target =
  | { kind: 'club'; slot: number }
  | { kind: 'player'; slot: number; index: number };

export interface EntityIndex {
  /** Names longest-first, so overlapping matches prefer the longer name. */
  names: string[];
  byName: Map<string, Target>;
}

/** Snapshot the CURRENT league's clickable names. Rebuild per render —
 * squads and club identities churn every generation. */
export function buildEntityIndex(league: League): EntityIndex {
  const byName = new Map<string, Target>();
  for (const f of league.franchises) {
    // Club first; a player sharing a club's name would shadow it (never
    // seen in the generated name space, and the club is the safer jump).
    if (!byName.has(f.name)) byName.set(f.name, { kind: 'club', slot: f.slot });
  }
  for (const f of league.franchises) {
    f.playerNames.forEach((n, index) => {
      if (!byName.has(n)) byName.set(n, { kind: 'player', slot: f.slot, index });
    });
  }
  const names = [...byName.keys()].sort((a, b) => b.length - a.length);
  return { names, byName };
}

/** Wrap every known entity name in `text` as a clickable span; the rest
 * stays plain text nodes. Returns a fragment ready to append. */
export function linkifyText(text: string, idx: EntityIndex, nav: EntityNav): DocumentFragment {
  const frag = document.createDocumentFragment();
  // Collect non-overlapping matches, longest names first.
  const taken: Array<{ start: number; end: number; name: string }> = [];
  for (const name of idx.names) {
    let from = 0;
    for (;;) {
      const at = text.indexOf(name, from);
      if (at < 0) break;
      from = at + name.length;
      if (taken.some((m) => at < m.end && at + name.length > m.start)) continue;
      taken.push({ start: at, end: at + name.length, name });
    }
  }
  taken.sort((a, b) => a.start - b.start);
  let cursor = 0;
  for (const m of taken) {
    if (m.start > cursor) frag.appendChild(document.createTextNode(text.slice(cursor, m.start)));
    const target = idx.byName.get(m.name)!;
    const a = document.createElement('span');
    a.className = 'entity-link';
    a.textContent = m.name;
    a.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (target.kind === 'club') nav.openClub(target.slot);
      else nav.openPlayer(target.slot, target.index);
    });
    frag.appendChild(a);
    cursor = m.end;
  }
  if (cursor < text.length) frag.appendChild(document.createTextNode(text.slice(cursor)));
  return frag;
}
