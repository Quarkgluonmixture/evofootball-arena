import type { Era, EraLabel } from '../evolution/eras';
import { lang, t } from './i18n';

/**
 * Chronicle view helpers (Phase 52) — shared by the league screen's
 * chronicle tab and the evolution center's era strip. Era LABELS are
 * structural (discovered from the records in evolution/eras.ts); only the
 * display assembly is localized here.
 */

export function eraDisplayName(label: EraLabel): string {
  switch (label.kind) {
    case 'dynasty':
      return lang === 'zh' ? `${label.club} 王朝` : `The ${label.club} dynasty`;
    case 'style':
      return lang === 'zh' ? `${t(label.word)}时代` : `The ${label.word.toLowerCase()} era`;
    case 'contested':
      return t('Age of contention');
  }
}

/** Sequential era band colors (adjacent eras must read as different). */
export const ERA_COLORS = ['#3b82f6', '#a78bfa', '#f59e0b', '#34d399', '#f472b6', '#60a5fa', '#fbbf24', '#4ade80'];

export function eraColor(index: number): string {
  return ERA_COLORS[index % ERA_COLORS.length];
}

/** The era a generation belongs to — the open tail era absorbs generations
 * after its last recorded season. -1 when nothing is recorded yet. */
export function eraIndexOf(eras: Era[], generation: number): number {
  if (eras.length === 0) return -1;
  for (let i = 0; i < eras.length; i++) {
    if (generation <= eras[i].end) return i;
  }
  return eras.length - 1;
}
