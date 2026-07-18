import { GENE_KEYS } from '../evolution/genome';
import { nameplates, type StyleSource } from '../evolution/styleSpace';
import type { Fixture, League } from '../sim/League';
import type { Match } from '../sim/Match';
import { deriveTeamStyle } from '../sim/types';
import { geneRadar } from './charts';
import { colorHex, el } from './dom';
import { formStrip, recentForm } from './form';
import { lang, t } from './i18n';
import { geneAxisLabels, genomeValues } from './rebirth';

/** The matchday context a league fixture can enrich the clash with. */
export interface ClashContext {
  population?: StyleSource[];
  league?: League;
  fixture?: Fixture | null;
}

/**
 * Pre-match clash (Phase 32.5 → 119g the MATCHDAY REPORT): both teams' DNA
 * side by side — gene radar, identity tags, formation pair + scheme — plus,
 * for a league fixture, the broadcast pre-match furniture: the coach in the
 * dugout, recent FORM, the league standing, and this season's head-to-head.
 * A broadcast graphic, not a modal: it never blocks play, auto-dismisses
 * shortly after kickoff (GameApp watches sim time), a tap closes it. Zero sim
 * — pure reads off the league + fixture (friendlies degrade to the DNA view).
 */
export class ClashBanner {
  readonly root: HTMLElement;
  private visible = false;

  constructor(host: HTMLElement) {
    this.root = el('div');
    this.root.id = 'clash-banner';
    this.root.classList.add('hidden');
    this.root.addEventListener('click', () => this.hide());
    host.appendChild(this.root);
  }

  get isVisible(): boolean {
    return this.visible;
  }

  show(match: Match, contextLabel: string, ctx: ClashContext = {}): void {
    this.root.textContent = '';
    const mid = el('div', 'clash-mid');
    mid.append(el('div', 'clash-vs', 'VS'), el('div', 'clash-ctx muted', contextLabel));
    const h2h = this.headToHead(ctx);
    if (h2h) mid.appendChild(h2h);
    this.root.append(this.sideCard(match, 0, ctx), mid, this.sideCard(match, 1, ctx));
    this.root.appendChild(el('div', 'clash-hint muted', t('tap to dismiss')));
    this.visible = true;
    this.root.classList.remove('hidden');
  }

  hide(): void {
    this.visible = false;
    this.root.classList.add('hidden');
  }

  private sideCard(match: Match, side: 0 | 1, ctx: ClashContext): HTMLElement {
    const info = match.teams[side].info;
    const style = info.style ?? deriveTeamStyle(info.genome);
    const card = el('div', 'clash-card');

    const head = el('div', 'team-head');
    const dot = el('span', 'dot');
    dot.style.background = colorHex(info.colors.primary);
    head.append(dot, el('span', '', info.name));
    card.appendChild(head);

    // The dugout figure (Phase 66): the philosophy has a name and a face.
    if (info.coachName) card.appendChild(el('div', 'clash-coach muted', `👔 ${info.coachName}`));

    const labels = geneAxisLabels(lang);
    const axes = GENE_KEYS.map((k, i) => ({ label: labels[i], title: t(k) }));
    card.appendChild(geneRadar(axes, [{
      values: genomeValues(info.genome),
      color: colorHex(info.colors.primary),
      name: info.name,
      fill: true,
    }], { size: 150 }));

    const tags = el('div', 'tags');
    tags.appendChild(el('span', 'tag', `⚔ ${style.formationAtk}`));
    tags.appendChild(el('span', 'tag', `🛡 ${style.formationDef}`));
    tags.appendChild(el('span', 'tag', t(style.scheme === 'man' ? 'man-marking' : 'zonal')));
    // Morale on the tape (Phase 111) — only when the streak is REAL.
    if ((info.morale ?? 0.5) >= 0.7) tags.appendChild(el('span', 'tag', `🔥 ${t('on a run')}`));
    else if ((info.morale ?? 0.5) <= 0.3) tags.appendChild(el('span', 'tag', `❄ ${t('in a slump')}`));
    // Data-driven nameplate (Phase 49): identity relative to the current
    // league population; both teams appended so exhibition sides still rank.
    const pool: StyleSource[] = [
      ...(ctx.population ?? []),
      { genome: match.teams[0].info.genome, policy: match.teams[0].info.policy },
      { genome: match.teams[1].info.genome, policy: match.teams[1].info.policy },
    ];
    const plate = nameplates(pool)[pool.length - 2 + side];
    for (const word of plate) tags.appendChild(el('span', 'tag nameplate', t(word)));
    card.appendChild(tags);

    // The matchday record row (119g): recent FORM + the league standing —
    // pure reads, only for a real league fixture.
    const league = ctx.league;
    const fixture = ctx.fixture;
    if (league && fixture && !fixture.cup) {
      const slot = side === 0 ? fixture.home : fixture.away;
      const record = el('div', 'clash-record');
      record.appendChild(formStrip(recentForm(league, slot)));
      const rank = this.standing(league, slot, fixture.division);
      if (rank) record.appendChild(el('span', 'clash-pos muted', rank));
      card.appendChild(record);
    }
    return card;
  }

  /** League position + points within the fixture's division (1st, 2nd…). */
  private standing(league: League, slot: number, division: 0 | 1): string | null {
    const rows = league.franchises
      .filter((f) => f.division === division)
      .map((f) => league.table[f.slot])
      .filter((r) => r !== undefined)
      .sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf || a.slot - b.slot);
    const idx = rows.findIndex((r) => r.slot === slot);
    if (idx < 0) return null;
    const row = league.table[slot];
    const ord = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'][idx] ?? `${idx + 1}th`;
    return `${t(ord)} · ${row.pts}${t('pts')}`;
  }

  /** This season's head-to-head between the two sides (played fixtures). */
  private headToHead(ctx: ClashContext): HTMLElement | null {
    const league = ctx.league;
    const fixture = ctx.fixture;
    if (!league || !fixture || fixture.cup) return null;
    let hw = 0;
    let aw = 0;
    let dr = 0;
    let played = 0;
    for (const f of league.fixtures) {
      if (!f.played || f.scoreH === undefined || f.scoreA === undefined) continue;
      const same = f.home === fixture.home && f.away === fixture.away;
      const swap = f.home === fixture.away && f.away === fixture.home;
      if (!same && !swap) continue;
      played++;
      // Normalize to THIS fixture's home perspective.
      const homeGoals = same ? f.scoreH : f.scoreA;
      const awayGoals = same ? f.scoreA : f.scoreH;
      if (homeGoals > awayGoals) hw++;
      else if (awayGoals > homeGoals) aw++;
      else dr++;
    }
    if (played === 0) return null;
    return el('div', 'clash-h2h muted', `${t('this season')} ${hw}–${dr}–${aw}`);
  }
}
