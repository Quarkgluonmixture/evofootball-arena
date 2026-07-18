import type { League } from '../sim/League';
import { GOAL_CHANNELS, type GoalChannel } from '../sim/types';
import { el } from './dom';
import { t } from './i18n';

/**
 * Goal channels (Phase 113): the launch-anatomy classes, player-facing.
 * One tile per club — how it actually scores AND concedes — so the
 * defensive schools finally read (a club bleeding `carry` has no
 * recovery-slide answer; a trap school starves `through`).
 *
 * Colors come from the established categorical palette (the formation
 * strips); `buildup` stays recessive ink — it's the residual bucket, the
 * identity channels are the story. Order: the breakaway family first.
 */
export const CHANNEL_META: ReadonlyArray<{ key: GoalChannel; label: string; color: string }> = [
  { key: 'carry', label: 'Carry through', color: '#f59e0b' },
  { key: 'through', label: 'In behind', color: '#fb7185' },
  { key: 'walkin', label: 'Walk-in', color: '#f472b6' },
  { key: 'keeper', label: 'Keeper launch', color: '#a78bfa' },
  { key: 'cross', label: 'Cross service', color: '#60a5fa' },
  { key: 'setpiece', label: 'Set piece', color: '#facc15' },
  { key: 'buildup', label: 'Buildup', color: '#64748b' },
];

export interface ChannelWindow {
  f: Record<GoalChannel, number>;
  a: Record<GoalChannel, number>;
  /** Seasons summed (current + up to two recorded) — the tooltip's honesty. */
  seasons: number;
}

/**
 * The club's recent channel ledger: the LIVE season plus up to the last two
 * recorded ones. One part-season is too thin for a seven-bucket read; a
 * career total would smear eras together — identity is recent.
 */
export function channelWindow(league: League, slot: number): ChannelWindow {
  const f = { ...league.agg[slot].chFor };
  const a = { ...league.agg[slot].chAgainst };
  let seasons = 1;
  for (const rec of league.history.slice(-2)) {
    const row = rec.table.find((r) => r.slot === slot);
    if (!row?.ch) continue; // pre-v28 records lack the ledger
    for (const c of GOAL_CHANNELS) {
      f[c] += row.ch.f[c];
      a[c] += row.ch.a[c];
    }
    seasons++;
  }
  return { f, a, seasons };
}

/** One 100%-stacked bar; every segment carries its numbers in a tooltip. */
function stackedBar(counts: Record<GoalChannel, number>, rowLabel: string): HTMLDivElement {
  const outer = el('div', 'chan-bar');
  const total = GOAL_CHANNELS.reduce((s, c) => s + counts[c], 0);
  for (const m of CHANNEL_META) {
    const n = counts[m.key];
    if (n === 0) continue;
    const seg = el('div', 'chan-seg');
    seg.style.width = `${((n / total) * 100).toFixed(1)}%`;
    seg.style.background = m.color;
    seg.title = `${rowLabel} · ${t(m.label)} ${n} (${Math.round((n / total) * 100)}%)`;
    outer.appendChild(seg);
  }
  return outer;
}

/** The 进球管道 tile: scored + conceded strips, top-channel color chips. */
export function goalChannelTile(win: ChannelWindow): HTMLDivElement {
  const tile = el('div', 'goal-channel');
  const gf = GOAL_CHANNELS.reduce((s, c) => s + win.f[c], 0);
  const ga = GOAL_CHANNELS.reduce((s, c) => s + win.a[c], 0);

  const head = el('div', 'spark-head');
  const name = el('span', 'g-name', t('Goal channels'));
  name.title = `${t('window')}: ${win.seasons}`;
  head.append(name, el('span', 'spark-val', `${gf} : ${ga}`));
  tile.appendChild(head);

  for (const [counts, label] of [
    [win.f, t('scored')],
    [win.a, t('conceded')],
  ] as const) {
    const row = el('div', 'chan-row');
    row.appendChild(el('span', 'g-name', label));
    row.appendChild(stackedBar(counts, label));
    tile.appendChild(row);
  }

  // Color key for the two strips: the three biggest channels by combined
  // volume (full numbers live in the segment tooltips).
  const top = [...CHANNEL_META]
    .map((m) => ({ m, n: win.f[m.key] + win.a[m.key] }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, 3);
  if (top.length > 0) {
    const chips = el('div', 'chan-chips');
    for (const { m } of top) {
      const chip = el('span');
      const dot = el('span', 'cdot');
      dot.style.background = m.color;
      chip.append(dot, document.createTextNode(t(m.label)));
      chips.appendChild(chip);
    }
    tile.appendChild(chips);
  }
  return tile;
}
