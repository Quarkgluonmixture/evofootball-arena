import type { League } from '../sim/League';
import { el } from './dom';
import { t } from './i18n';

/**
 * Form & morale, player-facing (Phase 114). The phase-111 data was all
 * there — morale only ever surfaced as the clash tape's 🔥/❄ extremes.
 * Now: last-5 W/D/L dots on the league table and the club center, and a
 * morale meter on the club dive. Pure reads; zero sim.
 */

export type FormResult = 'W' | 'D' | 'L';

/** Last `n` LEAGUE results for a slot, oldest→newest (cup ties excluded;
 * the playoff decider counts — it's the club's league fate). */
export function recentForm(league: League, slot: number, n = 5): FormResult[] {
  const out: FormResult[] = [];
  for (const fx of league.fixtures) {
    if (!fx.played || fx.cup) continue;
    if (fx.home !== slot && fx.away !== slot) continue;
    const gf = fx.home === slot ? fx.scoreH! : fx.scoreA!;
    const ga = fx.home === slot ? fx.scoreA! : fx.scoreH!;
    out.push(gf > ga ? 'W' : gf === ga ? 'D' : 'L');
  }
  return out.slice(-n);
}

const FORM_COLOR: Record<FormResult, string> = {
  W: 'var(--up)', D: '#8294b5', L: 'var(--down)',
};

/** Five result dots, oldest→newest — color never alone (letter tooltip). */
export function formStrip(form: FormResult[]): HTMLSpanElement {
  const strip = el('span', 'form-strip');
  for (const r of form) {
    const d = el('span', 'form-dot', '');
    d.style.background = FORM_COLOR[r];
    d.title = r;
    strip.appendChild(d);
  }
  return strip;
}

/** The 🔥/❄ extreme glyph the clash tape already speaks — '' in between. */
export function moraleGlyph(morale: number): string {
  return morale >= 0.7 ? '🔥' : morale <= 0.3 ? '❄' : '';
}

/** A labeled morale meter for the club dive: cold ❄ … 🔥 hot. */
export function moraleRow(morale: number): HTMLDivElement {
  const row = el('div', 'gene-row morale-row');
  row.appendChild(el('div', 'g-name', t('morale')));
  const meter = el('div', 'bar');
  const fill = el('div', 'bar-fill');
  fill.style.width = `${Math.round(morale * 100)}%`;
  fill.style.background = morale >= 0.7 ? '#f59e0b' : morale <= 0.3 ? '#7dd3fc' : '#8294b5';
  meter.appendChild(fill);
  meter.style.gridColumn = '2 / 3';
  row.appendChild(meter);
  row.appendChild(el('div', 'muted', `${moraleGlyph(morale)} ${morale.toFixed(2)}`.trim()));
  return row;
}
