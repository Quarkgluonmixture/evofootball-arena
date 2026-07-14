import { detectEras } from '../evolution/eras';
import { GENE_KEYS } from '../evolution/genome';
import { nameplates } from '../evolution/styleSpace';
import { chronicleChapters } from '../sim/chronicle';
import { eraColor, eraDisplayName } from './chronicleView';
import { ATTR_KEYS, SQUAD_BUDGET, SQUAD_ROLES, squadSummary, squadTotal } from '../evolution/playerGenome';
import { TRAIT_EMOJI, traitsOf } from '../evolution/traits';
import {
  CUP_NAME, CUP_ROUNDS, CUP_ROUND_NAMES, CUP_ROUND_SHORT,
  type CupDrawMode, type CupEntrant, type CupTie,
} from '../sim/cup';
import {
  DIVISION_NAMES, DIVISION_SHORT,
  type Division, type League, type PlayerSeasonLine, type PromotionMode, type SeasonRecord,
} from '../sim/League';
import {
  bestChallengerCupRun, challengerTitles, cupFinalAppearances, cupTitles, divisionIn,
  domesticDoubles, giantKillingCounts, greatestComeback, longestPremierStreak, mostCupGoals,
  movementCounts, premierTitles, seasonStories,
} from '../sim/records';
import { geneRadar, raceChart, sparklineTile, type RadarSeries } from './charts';
import { bar, button, colorHex, el } from './dom';
import { lang, t } from './i18n';
import { geneAxisLabels, genomeValues, parentChain } from './rebirth';

type Tab = 'league' | 'cup' | 'report' | 'chronicle' | 'hall';

const TABS: Array<[Tab, string]> = [
  ['league', t('League')],
  ['cup', t('Cup')],
  ['report', t('Season report')],
  ['chronicle', t('📜 Chronicle')],
  ['hall', t('Hall of fame')],
];

/** The slice of cup state a bracket needs (live CupState or recorded CupRecord). */
interface BracketData {
  entrants: CupEntrant[];
  ties: CupTie[];
}

/**
 * Full-screen league overlay, four tabs:
 *  League      — standings + team cards (genes, squad DNA, lineage)
 *  Report      — last season: awards, points race, champions history
 *  Hall of fame — all-time records mined from season history
 * (Evolution moved to its OWN screen — EvolutionScreen, Phase 51.)
 */
export class LeagueScreen {
  readonly root: HTMLElement;
  private visible = false;
  private tab: Tab = 'league';
  private league: League | null = null;
  /** Set by GameApp: change the promotion rules (persisted with the save). */
  onSetPromotionMode: ((m: PromotionMode) => void) | null = null;
  /** Set by GameApp: change how drawn cup ties resolve (persisted with the save). */
  onSetCupDrawMode: ((m: CupDrawMode) => void) | null = null;
  /** Set by GameApp: reopen the latest rebirth ceremony (Phase 32.5). */
  onShowCeremony: (() => void) | null = null;

  constructor(host: HTMLElement) {
    this.root = el('div');
    this.root.id = 'league-screen';
    this.root.classList.add('hidden');
    host.appendChild(this.root);
  }

  get isVisible(): boolean {
    return this.visible;
  }

  toggle(league: League): void {
    this.visible = !this.visible;
    this.root.classList.toggle('hidden', !this.visible);
    if (this.visible) this.render(league);
  }

  refreshIfVisible(league: League): void {
    if (this.visible) this.render(league);
  }

  render(league: League): void {
    this.league = league;
    this.root.textContent = '';
    this.root.appendChild(
      el('h2', '', `${t('League')} — ${t('Gen')} ${league.generation} · ${t('Season#')} ${league.history.length + 1} · ${league.roundLabel().replace(/^Round /, `${t('Round#')} `)}`),
    );

    const nav = el('div', 'row tab-nav');
    for (const [tab, label] of TABS) {
      const b = button(label, () => {
        this.tab = tab;
        this.render(league);
      });
      b.classList.toggle('active', tab === this.tab);
      nav.appendChild(b);
    }
    this.root.appendChild(nav);

    switch (this.tab) {
      case 'league':
        this.renderRules(league);
        for (const d of [0, 1] as Division[]) {
          this.root.appendChild(el('h2', '', t(DIVISION_NAMES[d])));
          this.renderStandings(league, d);
        }
        this.root.appendChild(el('h2', '', t('Team cards')));
        this.renderCards(league);
        break;
      case 'cup':
        this.renderCup(league);
        break;
      case 'report':
        this.renderReport(league);
        break;
      case 'chronicle':
        this.renderChronicle(league);
        break;
      case 'hall':
        this.renderHall(league);
        break;
    }
  }

  /* ---------------- League tab ---------------- */

  private renderRules(league: League): void {
    const row = el('div', 'row rules-row');
    row.appendChild(el('span', 'muted', `${t('Promotion rules')}:`));
    const auto = button(t('Auto top/bottom 2'), () => this.onSetPromotionMode?.('auto'));
    const playoff = button(t('⚔ Playoff'), () => this.onSetPromotionMode?.('playoff'));
    auto.classList.toggle('active', league.promotionMode === 'auto');
    playoff.classList.toggle('active', league.promotionMode === 'playoff');
    row.append(auto, playoff);
    row.appendChild(
      el(
        'span',
        'muted',
        league.promotionMode === 'auto'
          ? '— Premier bottom two swap with Challenger top two.'
          : '— Premier 8th down, Challenger 1st up; Premier 7th hosts Challenger 2nd in a one-match decider (draw keeps the Premier side up).',
      ),
    );
    this.root.appendChild(row);

    const cupRow = el('div', 'row rules-row');
    cupRow.appendChild(el('span', 'muted', `${t('Cup draw rule')}:`));
    const pens = button(t('\u{1F945} Penalty shootout'), () => this.onSetCupDrawMode?.('shootout'));
    const dog = button(t('\u26A1 Underdog advances'), () => this.onSetCupDrawMode?.('underdog'));
    pens.classList.toggle('active', league.cupDrawMode === 'shootout');
    dog.classList.toggle('active', league.cupDrawMode === 'underdog');
    cupRow.append(pens, dog);
    cupRow.appendChild(
      el(
        'span',
        'muted',
        league.cupDrawMode === 'shootout'
          ? '\u2014 level cup ties go to a seeded penalty shootout (finishing vs keeper reflexes).'
          : '\u2014 level cup ties send the lower-division (else lower-seeded) side through.',
      ),
    );
    this.root.appendChild(cupRow);
  }

  private renderStandings(league: League, division: Division): void {
    const table = el('table');
    const thead = el('thead');
    const hr = el('tr');
    const cols = ['#', 'Team', 'P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts', 'Elo'];
    cols.forEach((c, i) => hr.appendChild(el('th', i >= 2 ? 'num' : '', c)));
    thead.appendChild(hr);
    table.appendChild(thead);

    const tbody = el('tbody');
    const rows = league.standings(division);
    const playoffMode = league.promotionMode === 'playoff';
    rows.forEach((row, i) => {
      const tr = el('tr');
      // Promotion / relegation / playoff zones with explicit markers.
      let marker = '';
      if (division === 0) {
        if (i === rows.length - 1 || (!playoffMode && i === rows.length - 2)) {
          tr.className = 'zone-down';
          marker = '⬇';
        } else if (playoffMode && i === rows.length - 2) {
          tr.className = 'zone-playoff';
          marker = '⚔';
        }
      } else {
        if (i === 0 || (!playoffMode && i === 1)) {
          tr.className = 'zone-up';
          marker = '⬆';
        } else if (playoffMode && i === 1) {
          tr.className = 'zone-playoff';
          marker = '⚔';
        }
      }
      tr.appendChild(el('td', '', `${i + 1}${marker ? ' ' + marker : ''}`));
      const nameTd = el('td');
      const dot = el('span', 'dot');
      dot.style.background = colorHex(row.franchise.colors.primary);
      dot.style.marginRight = '6px';
      nameTd.append(dot, document.createTextNode(row.franchise.name));
      tr.appendChild(nameTd);
      for (const v of [row.played, row.w, row.d, row.l, row.gf, row.ga, row.gf - row.ga, row.pts, Math.round(row.franchise.elo)]) {
        tr.appendChild(el('td', 'num', String(v)));
      }
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    this.root.appendChild(table);
  }

  private renderCards(league: League): void {
    const cards = el('div', 'cards');
    const lastSeason = league.history[league.history.length - 1];
    const ordered = [...league.division(0), ...league.division(1)];

    const labels = geneAxisLabels(lang);
    const axes = GENE_KEYS.map((k, i) => ({ label: labels[i], title: t(k) }));
    const leagueMean = GENE_KEYS.map(
      (k) => ordered.reduce((a, f) => a + f.coach.genome[k], 0) / Math.max(ordered.length, 1),
    );
    // Data-driven nameplates (Phase 49): a club's tags are where it actually
    // deviates from THIS population — replaces the fixed identity buckets.
    const plates = nameplates(ordered.map((f) => ({ genome: f.coach.genome, policy: f.coach.policy })));

    for (const f of ordered) {
      const card = el('div', 'team-card');

      const head = el('div', 'team-head');
      const dot = el('span', 'dot');
      dot.style.background = colorHex(f.colors.primary);
      head.append(dot, el('span', '', `${f.name} · Elo ${Math.round(f.elo)}`));
      card.appendChild(head);

      const tags = el('div', 'tags');
      const divBadge = el('span', `tag div-badge-${f.division}`, DIVISION_SHORT[f.division]);
      tags.appendChild(divBadge);
      // Tactical identity (Phase 30): the club's fixed formations + scheme.
      tags.appendChild(el('span', 'tag', `⚔ ${f.coach.style.formationAtk}`));
      tags.appendChild(el('span', 'tag', `🛡 ${f.coach.style.formationDef}`));
      tags.appendChild(el('span', 'tag', t(f.coach.style.scheme === 'man' ? 'man-marking' : 'zonal')));
      for (const word of plates[ordered.indexOf(f)]) {
        tags.appendChild(el('span', 'tag nameplate', t(word)));
      }
      // Prestige (Phase 40): age-decayed trophy weight, shown as stars.
      const prestige = this.league ? this.league.prestigeOf(f.slot) : 0;
      if (prestige >= 0.5) {
        tags.appendChild(el('span', 'tag', '★'.repeat(Math.max(1, Math.min(Math.round(prestige), 3)))));
      }
      card.appendChild(tags);

      // Tactical DNA (32.5): the radar reads as a SHAPE where 14 bars read
      // as a wall — the dashed league mean makes "what's distinctive here"
      // visible at a glance (per-gene values live in the axis tooltips).
      const series: RadarSeries[] = [
        { values: leagueMean, color: '#8294b5', name: t('league mean'), dashed: true },
        { values: genomeValues(f.coach.genome), color: colorHex(f.colors.primary), name: f.name, fill: true },
      ];
      card.appendChild(geneRadar(axes, series, { size: 190 }));
      card.appendChild(el('div', 'radar-cap muted', `┄ ${t('league mean')}`));

      // The dugout (Phase 53): the person the radar actually describes.
      const c = f.coach;
      const honours = [
        c.career.titles > 0 ? `${c.career.titles}×🏆` : '',
        c.career.cups > 0 ? `${c.career.cups}×🏅` : '',
        c.career.clubs > 1 ? `${c.career.clubs} ${t('clubs')}` : '',
      ].filter(Boolean).join(' ');
      card.appendChild(el('div', 'muted coach-line',
        `👔 ${c.name} · ${c.age}${t('y')}${honours ? ` · ${honours}` : ''}` +
        (c.mentor ? ` · 🎓${t('school of')} ${c.mentor}` : '')));

      // Family tree (32.5): the slot's chain of rebirths, newest first.
      const hops = parentChain(f.lineage, f.name);
      if (hops.length > 0) {
        card.appendChild(el('div', 'muted family-tree',
          `🌳 ${hops.map((h) => `${h.child} ← ${h.parents.join(' × ')} (g${h.generation})`).join('  ·  ')}`));
      }

      card.appendChild(el('div', 'muted', 'squad (avg attributes):'));
      // The wage cap (Phase 48): where a club chose to spend is its
      // identity — the constraint is visible at a glance.
      const spent = squadTotal(f.squad);
      const budgetRow = el('div', 'gene-row');
      budgetRow.appendChild(el('div', 'g-name', t('budget')));
      const budgetBar = bar(spent / SQUAD_BUDGET, spent >= SQUAD_BUDGET - 0.05 ? '#f59e0b' : '#34d399');
      budgetBar.style.gridColumn = '2 / 3';
      budgetRow.appendChild(budgetBar);
      budgetRow.appendChild(el('div', 'muted', `${spent.toFixed(1)}/${SQUAD_BUDGET}`));
      card.appendChild(budgetRow);
      const summary = squadSummary(f.squad);
      for (const k of ATTR_KEYS) {
        const row = el('div', 'gene-row');
        row.appendChild(el('div', 'g-name', k));
        const b = bar(summary[k], '#60a5fa');
        b.style.gridColumn = '2 / 4';
        row.appendChild(b);
        card.appendChild(row);
      }
      // Careers (Phase 26): the people behind the bars, with their ages —
      // and their TRAITS (Phase 39, derived live from attrs+role).
      card.appendChild(el('div', 'muted',
        f.playerNames.map((n, i) => {
          const tr = traitsOf(f.squad[i], SQUAD_ROLES[i])
            .map((tt) => TRAIT_EMOJI[tt])
            .join('');
          return `${n} ${f.ages[i]}y${tr ? ` ${tr}` : ''}`;
        }).join(' · ')));

      const fit = lastSeason?.fitness.find((x) => x.slot === f.slot);
      if (fit) card.appendChild(el('div', 'muted', `last-season fitness: ${fit.total.toFixed(3)}`));

      const lin = el('div', 'lineage');
      for (const entry of [...f.lineage].reverse().slice(0, 6)) {
        const icon = entry.event === 'elite' ? '👑' : entry.event === 'mutated' ? '🧬' : entry.event === 'reborn' ? '🔄' : '🌱';
        const parents = entry.parents ? ` ← ${entry.parents.join(' × ')}` : '';
        const note = entry.note ? ` (${entry.note})` : '';
        lin.appendChild(el('div', '', `g${entry.generation} ${icon} ${entry.event}${parents}${note}`));
      }
      card.appendChild(lin);
      cards.appendChild(card);
    }
    this.root.appendChild(cards);
  }

  /* ---------------- Cup tab ---------------- */

  private renderCup(league: League): void {
    this.root.appendChild(el('h2', '', `🏅 The ${CUP_NAME}`));
    const rules = el('div', 'rules-row muted');
    rules.textContent =
      'Single-elimination knockout across both divisions, played between league rounds. ' +
      'Seeded draw: every Round-of-16 tie is Premier vs Challenger, and the underdog hosts. ' +
      (league.cupDrawMode === 'shootout'
        ? 'Drawn ties go to a penalty shootout (League tab → Cup draw rule). '
        : 'Drawn ties: the lower-division (else lower-seeded) side advances — the cup loves an upset. ') +
      'No extra time. Cup ties never touch league tables, Elo or evolution fitness.';
    this.root.appendChild(rules);

    if (league.cup) {
      const final = league.cup.ties[league.cup.ties.length - 1];
      const next = league.cup.ties.find((t) => !t.played && t.home >= 0);
      const status = final.played
        ? `🏅 ${league.cup.entrants.find((e) => e.slot === final.winner)?.name} are cup champions!`
        : next
          ? `Next up: ${CUP_ROUND_NAMES[next.round]}${next.round > 0 && next.round < 3 ? 's' : ''} (after league round ${[2, 4, 6, 7][next.round]}).`
          : 'The draw is made — the cup kicks off after league round 2.';
      this.root.appendChild(el('h2', '', `${t('Season#')} ${league.history.length + 1} · ${t('bracket')}`));
      this.root.appendChild(el('div', 'muted cup-status', status));
      this.root.appendChild(this.renderBracket(league, league.cup));
    } else {
      this.root.appendChild(
        el('div', 'muted empty', `No cup this season (pre-cup save) — the first ${CUP_NAME} kicks off next season.`),
      );
    }

    const lastCup = [...league.history].reverse().find((r) => r.cup)?.cup;
    const lastGen = [...league.history].reverse().find((r) => r.cup)?.generation;
    if (lastCup) {
      this.root.appendChild(el('h2', '', `${t("Last season's cup")} (${t('Season#')} ${lastGen})`));
      this.root.appendChild(
        el('div', 'muted cup-status',
          `🏅 ${lastCup.winnerName} beat ${lastCup.runnerUpName} in the final` +
          (lastCup.topScorer ? ` · ⚽ top scorer: ${lastCup.topScorer.name} (${lastCup.topScorer.team}), ${lastCup.topScorer.goals}g` : '')),
      );
      this.root.appendChild(this.renderBracket(league, lastCup));
    }

    const honours = league.history.filter((r) => r.cup);
    if (honours.length > 0) {
      this.root.appendChild(el('h2', '', t('Roll of honour')));
      for (const r of [...honours].reverse().slice(0, 10)) {
        this.root.appendChild(
          el('div', 'history-entry', `Season ${r.generation} — 🏅 ${r.cup!.winnerName} (beat ${r.cup!.runnerUpName})`),
        );
      }
    }

    // Rivalries (Phase 40): armed pairs (≥2 decider meetings), derived live.
    const meetings = [...league.rivalryMeetings().entries()]
      .filter(([, n]) => n >= 2)
      .sort((a, b) => b[1] - a[1]);
    if (meetings.length > 0) {
      this.root.appendChild(el('h2', '', t('Rivalries')));
      for (const [key, n] of meetings.slice(0, 8)) {
        const [a, b] = key.split('-').map(Number);
        this.root.appendChild(
          el('div', 'history-entry',
            `🔥 ${league.franchise(a).name} × ${league.franchise(b).name} — ${n} ${t('meetings in deciders')}`),
        );
      }
    }
  }

  /** Procedural DOM bracket: four columns, winners bold, upsets flagged ⚡. */
  private renderBracket(league: League, cup: BracketData): HTMLElement {
    const bracket = el('div', 'bracket');
    for (let round = 0; round < CUP_ROUNDS; round++) {
      const col = el('div', 'bracket-col');
      col.appendChild(el('div', 'bracket-col-title', CUP_ROUND_NAMES[round] + (round > 0 && round < 3 ? 's' : '')));
      for (const tie of cup.ties.filter((t) => t.round === round)) {
        col.appendChild(this.renderTie(league, cup, tie));
      }
      bracket.appendChild(col);
    }
    return bracket;
  }

  private renderTie(league: League, cup: BracketData, tie: CupTie): HTMLElement {
    const box = el('div', `cup-tie${tie.upset ? ' upset' : ''}`);
    const teamRow = (slot: number, score: number | undefined, feeder: number) => {
      const row = el('div', 'cup-row');
      if (slot < 0) {
        row.classList.add('cup-tbd');
        row.appendChild(el('span', 'cup-name muted', `Winner of ${CUP_ROUND_SHORT[tie.round - 1]} ${feeder + 1}`));
        return row;
      }
      const e = cup.entrants.find((x) => x.slot === slot)!;
      if (tie.played) row.classList.add(tie.winner === slot ? 'cup-win' : 'cup-lose');
      const dot = el('span', 'dot');
      dot.style.background = colorHex(league.franchise(slot).colors.primary);
      const name = el('span', 'cup-name');
      name.append(dot, document.createTextNode(` ${e.name}`));
      name.title = `${DIVISION_NAMES[e.division]} · seed ${e.seed} · Elo ${e.elo} at the draw`;
      const seedTag = el('span', `cup-seed cup-d${e.division}`, `${DIVISION_SHORT[e.division][0]}·${e.seed}`);
      const scoreEl = el('span', 'cup-score', tie.played ? String(score) : '');
      row.append(name, seedTag, scoreEl);
      return row;
    };
    box.appendChild(teamRow(tie.home, tie.scoreH, tie.index * 2));
    box.appendChild(teamRow(tie.away, tie.scoreA, tie.index * 2 + 1));
    const notes: string[] = [];
    if (tie.upset) notes.push('⚡ giant killing');
    if (tie.byDrawRule) notes.push('drawn — underdog advances');
    if (tie.shootout) {
      notes.push(`🥅 ${tie.shootout.scoreH}–${tie.shootout.scoreA} pens${tie.shootout.sudden ? ' (sudden death)' : ''}`);
    }
    if (notes.length > 0) box.appendChild(el('div', 'cup-note', notes.join(' · ')));
    return box;
  }

  /* ---------------- Season report tab ---------------- */

  private renderReport(league: League): void {
    const rec = league.history[league.history.length - 1];
    if (!rec) {
      this.root.appendChild(el('div', 'muted empty', 'No completed seasons yet — simulate one!'));
      this.renderCurrentScorers(league);
      return;
    }

    const headline = el('div', 'report-headline');
    headline.innerHTML = `🏆 <b>Season ${rec.generation}</b> — Premier champions: <b>${rec.championName}</b> (${rec.table[0].pts} pts, GD ${rec.table[0].gf - rec.table[0].ga})` +
      (rec.d2Champion ? ` &nbsp;·&nbsp; 🥇 Challenger champions: <b>${rec.d2Champion}</b>` : '');
    this.root.appendChild(headline);
    if (rec.promoted && rec.relegated) {
      const moves = el('div', 'history-entry');
      moves.innerHTML =
        `⬆️ promoted: <b>${rec.promoted.map((p) => p.name).join(', ')}</b>` +
        ` &nbsp;·&nbsp; ⬇️ relegated: <b>${rec.relegated.map((p) => p.name).join(', ')}</b>`;
      this.root.appendChild(moves);
    }
    if (rec.playoff) {
      const po = el('div', 'history-entry');
      po.innerHTML = `⚔ Playoff: ${rec.playoff.homeName} ${rec.playoff.score[0]}–${rec.playoff.score[1]} ${rec.playoff.awayName} — <b>${rec.playoff.winnerName}</b> take the final Premier spot.`;
      this.root.appendChild(po);
    }
    if (rec.cup) {
      const final = rec.cup.ties[rec.cup.ties.length - 1];
      const cupLine = el('div', 'history-entry');
      cupLine.innerHTML =
        `🏅 ${CUP_NAME}: <b>${rec.cup.winnerName}</b> beat ${rec.cup.runnerUpName} ` +
        `${final.scoreH}–${final.scoreA} in the final` +
        (final.byDrawRule ? ' <i>(level — underdog rule)</i>' : '') +
        (final.shootout ? ` <i>(${final.shootout.scoreH}–${final.shootout.scoreA} on penalties)</i>` : '') +
        (rec.cup.topScorer ? ` &nbsp;·&nbsp; ⚽ cup top scorer: ${rec.cup.topScorer.name} (${rec.cup.topScorer.team}), ${rec.cup.topScorer.goals}g` : '');
      this.root.appendChild(cupLine);
      for (const u of rec.cup.upsets) {
        this.root.appendChild(
          el('div', 'history-entry',
            `⚡ ${u.winnerName} knocked out ${u.loserName} ${u.score[0]}–${u.score[1]} (${CUP_ROUND_NAMES[u.round]})`),
        );
      }
    }

    // The season's story, mined from history.
    const stories = seasonStories(league.history);
    if (stories.length > 0) {
      const story = el('div', 'report-story');
      for (const s of stories) story.appendChild(el('div', '', s));
      this.root.appendChild(story);
    }

    if (rec.pointsTimeline) {
      const divisions: Array<[Division, string]> = rec.table.some((r) => r.division !== undefined)
        ? [[0, 'Points race — Division 1'], [1, 'Points race — Division 2']]
        : [[0, 'Points race']];
      for (const [d, title] of divisions) {
        const rows = rec.table.filter((r) => (r.division ?? 0) === d);
        if (rows.length === 0) continue;
        this.root.appendChild(el('h2', '', title));
        this.root.appendChild(
          raceChart(
            rows.map((r) => {
              // Abbreviate "Solar Wolves" -> "S.Wolves" so three *Wolves
              // teams stay distinguishable in the end labels.
              const words = r.name.split(' ');
              const name = words.length > 1 ? `${words[0][0]}.${words.slice(1).join(' ')}` : r.name;
              return {
                name,
                color: league.franchise(r.slot).colors.primary,
                values: rec.pointsTimeline![r.slot] ?? [],
              };
            }),
            Math.max(...rec.pointsTimeline.map((v) => v.length)),
          ),
        );
      }
    }

    if (rec.awards) {
      this.root.appendChild(el('h2', '', t('Awards (Premier Division)')));
      this.root.appendChild(this.awardsBlock(rec));
    } else {
      this.root.appendChild(el('div', 'muted', 'No award data for this season (pre-v3 save).'));
    }
    if (rec.awardsD2 && rec.awardsD2.topScorers.length > 0) {
      this.root.appendChild(el('h2', '', t('Challenger top scorers')));
      for (const l of rec.awardsD2.topScorers.slice(0, 3)) {
        this.root.appendChild(el('div', 'history-entry', `⚽ ${l.name} (${l.team}) — ${l.goals}g ${l.assists}a`));
      }
    }

    // The season's tiki-taka crown (Phase 33).
    if (rec.longestChain) {
      this.root.appendChild(
        el('div', 'history-entry', `🎼 ${t('Longest passing move')}: ${rec.longestChain.team} — ${rec.longestChain.length}`),
      );
    }

    // Retirements (Phase 26) — absent on records from before careers existed.
    if (rec.retirements && rec.retirements.length > 0) {
      this.root.appendChild(el('h2', '', t('🎓 Retirements')));
      for (const r of rec.retirements) {
        const line = r.role === 'GK'
          ? `${r.name} (${r.team}, ${r.age}) — ${r.seasons} seasons, ${r.saves} saves`
          : `${r.name} (${r.team}, ${r.age}) — ${r.seasons} seasons, ${r.goals} goals`;
        this.root.appendChild(el('div', 'history-entry', `🎓 ${line}`));
      }
    }

    this.renderCurrentScorers(league);

    this.root.appendChild(el('h2', '', t('Champions history')));
    for (const r of [...league.history].reverse()) {
      const entry = el('div', 'history-entry');
      const boot = r.awards?.topScorers[0];
      const singleEra = !r.table.some((row) => row.division !== undefined);
      entry.innerHTML =
        `<b>Season ${r.generation}</b> — 🏆 <b>${r.championName}</b>` +
        (r.d2Champion ? ` · 🥇 ${r.d2Champion}` : '') +
        (r.cup ? ` · 🏅 ${r.cup.winnerName}` : '') +
        (boot ? ` · ⚽ ${boot.name} (${boot.team}) ${boot.goals}g` : '') +
        (singleEra ? ' · <i>(single-division era)</i>' : !r.cup ? ' · <i>(pre-cup era)</i>' : '');
      this.root.appendChild(entry);
    }
  }

  private awardsBlock(rec: SeasonRecord): HTMLElement {
    const wrap = el('div', 'cards');
    const mk = (title: string, lines: PlayerSeasonLine[], fmt: (l: PlayerSeasonLine) => string) => {
      const card = el('div', 'team-card');
      card.appendChild(el('div', 'team-head', title));
      if (lines.length === 0) card.appendChild(el('div', 'muted', '—'));
      for (const l of lines) card.appendChild(el('div', '', fmt(l)));
      wrap.appendChild(card);
    };
    mk('⚽ Golden Boot', rec.awards!.topScorers, (l) => `${l.name} (${l.team}) — ${l.goals}g ${l.assists}a`);
    mk('🅰️ Playmaker', rec.awards!.topAssists, (l) => `${l.name} (${l.team}) — ${l.assists}a ${l.goals}g`);
    mk('🧤 Golden Glove', rec.awards!.topKeeper ? [rec.awards!.topKeeper] : [], (l) => `${l.name} (${l.team}) — ${l.saves} saves`);
    // Season MVP (Phase 33) — absent on records from before ratings existed.
    if (rec.awards!.mvp) {
      mk('🌟 Season MVP', [rec.awards!.mvp], (l) => `${l.name} (${l.team}, ${l.role}) — ${t('rating')} ${l.avgRating.toFixed(2)}`);
    }
    // Cards arrived in Phase 25 — records from older saves honestly have none.
    const dirty = rec.awards!.dirtiest;
    if (dirty) {
      const card = el('div', 'team-card');
      card.appendChild(el('div', 'team-head', '🟥 Dirtiest team'));
      card.appendChild(el('div', '', `${dirty.name} — ${dirty.yellows}🟨 ${dirty.reds}🟥`));
      wrap.appendChild(card);
    }
    return wrap;
  }

  private renderCurrentScorers(league: League): void {
    const lines = league
      .playerLines(0)
      .filter((l) => l.goals > 0)
      .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
      .slice(0, 5);
    if (lines.length === 0) return;
    this.root.appendChild(el('h2', '', t('Top scorers (current season, D1)')));
    for (const l of lines) {
      this.root.appendChild(el('div', 'history-entry', `⚽ ${l.name} (${l.team}, ${l.role}) — ${l.goals}g ${l.assists}a`));
    }
  }

  /* ---------------- Chronicle tab (Phase 52) ---------------- */

  /**
   * The browsable chronicle: recorded seasons grouped into ERAS (discovered
   * from the records — evolution/eras.ts), newest era first, each season a
   * collapsible chapter mined by sim/chronicle.ts. Pure read; sim text stays
   * English, only the chrome localizes.
   */
  private renderChronicle(league: League): void {
    if (league.history.length === 0) {
      this.root.appendChild(el('div', 'muted empty', t('No completed seasons yet — the chronicle opens after the first one.')));
      return;
    }
    this.root.appendChild(el('div', 'muted',
      t('The recorded ages of this league — era names are discovered from the records, never preset.')));

    const eras = detectEras(league.history);
    const chapters = chronicleChapters(league.history);
    const byGen = new Map(chapters.map((c) => [c.generation, c]));

    for (let e = eras.length - 1; e >= 0; e--) {
      const era = eras[e];
      const head = el('div', 'era-head');
      const swatch = el('span', 'era-swatch');
      swatch.style.background = eraColor(e);
      const range = era.start === era.end ? `S${era.start}` : `S${era.start}–S${era.end}`;
      head.append(swatch, el('span', 'era-name', eraDisplayName(era.label)), el('span', 'muted', range));
      for (const h of era.honours.slice(0, 2)) {
        head.appendChild(el('span', 'tag', `🏆×${h.titles} ${h.name}`));
      }
      this.root.appendChild(head);

      for (let g = era.end; g >= era.start; g--) {
        const ch = byGen.get(g);
        if (!ch) continue;
        const details = document.createElement('details');
        details.className = 'chron-chapter';
        // The latest chapter of the latest era arrives open.
        if (e === eras.length - 1 && g === era.end) details.open = true;
        const summary = document.createElement('summary');
        summary.append(
          el('b', '', `S${ch.generation}`),
          document.createTextNode(` ${ch.headline}`),
        );
        details.appendChild(summary);
        const body = el('div', 'chron-body');
        for (const line of ch.lines) {
          const row = el('div', 'chron-line');
          row.append(el('span', 'chron-icon', line.icon), document.createTextNode(line.text));
          body.appendChild(row);
        }
        if (ch.lines.length === 0) body.appendChild(el('div', 'muted', '—'));
        details.appendChild(body);
        this.root.appendChild(details);
      }
    }
  }

  /* ---------------- Hall of fame tab ---------------- */

  private renderHall(league: League): void {
    const h = league.history;
    if (h.length === 0) {
      this.root.appendChild(el('div', 'muted empty', 'No history yet — the hall opens after the first season.'));
      return;
    }

    // All-time greats (Phase 26): the best retired careers, kept forever.
    if (league.legends.length > 0) {
      this.root.appendChild(el('h2', '', t('🎓 All-time greats (retired)')));
      for (const l of league.legends.slice(0, 8)) {
        const line = l.role === 'GK'
          ? `${l.career.saves} saves in ${l.career.seasons} seasons`
          : `${l.career.goals}g ${l.career.assists}a in ${l.career.seasons} seasons`;
        this.root.appendChild(
          el('div', 'history-entry', `🎓 ${l.name} (${l.team}, retired ${l.age}) — ${line}`),
        );
      }
    }

    // Titles by team name (Premier + Challenger).
    this.root.appendChild(el('h2', '', t('🏆 Premier titles')));
    for (const [name, n] of [...premierTitles(h).entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)) {
      this.root.appendChild(el('div', 'history-entry', `${'🏆'.repeat(Math.min(n, 8))} ${name} — ${n}`));
    }
    const d2t = [...challengerTitles(h).entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
    if (d2t.length > 0) {
      this.root.appendChild(el('h2', '', t('🥇 Challenger titles')));
      for (const [name, n] of d2t) {
        this.root.appendChild(el('div', 'history-entry', `${'🥇'.repeat(Math.min(n, 8))} ${name} — ${n}`));
      }
    }

    // Evo Cup honours (absent entirely on pre-cup histories).
    const cupWinners = [...cupTitles(h).entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
    if (cupWinners.length > 0) {
      this.root.appendChild(el('h2', '', `🏅 ${CUP_NAME} honours`));
      const finals = cupFinalAppearances(h);
      for (const [name, n] of cupWinners) {
        this.root.appendChild(
          el('div', 'history-entry',
            `${'🏅'.repeat(Math.min(n, 8))} ${name} — ${n} (finals: ${finals.get(name) ?? n})`),
        );
      }
      const doubles = domesticDoubles(h);
      if (doubles.length > 0) {
        this.root.appendChild(
          el('div', 'history-entry',
            `✨ Domestic doubles: ${doubles.map((d) => `${d.name} (S${d.generation})`).join(', ')}`),
        );
      }
      const killer = [...giantKillingCounts(h).entries()].sort((a, b) => b[1] - a[1])[0];
      if (killer) {
        this.root.appendChild(el('div', 'history-entry', `⚡ Most giant killings: ${killer[0]} — ${killer[1]}`));
      }
      const run = bestChallengerCupRun(h);
      if (run) {
        const feat = run.wonCup ? 'won the cup' : `reached the ${CUP_ROUND_NAMES[run.roundReached].toLowerCase()}`;
        this.root.appendChild(
          el('div', 'history-entry', `🚀 Deepest Challenger cup run: ${run.name} — ${feat} (S${run.generation})`),
        );
      }
      const goals = mostCupGoals(h);
      if (goals) {
        this.root.appendChild(
          el('div', 'history-entry',
            `⚽ Most cup goals in a season: ${goals.name} (${goals.team}) — ${goals.goals} (S${goals.generation})`),
        );
      }
    }

    // The dugout hall of fame (Phase 53): retired coaches worth remembering.
    const coachHall = this.league!.coachLegends;
    if (coachHall.length > 0) {
      this.root.appendChild(el('h2', '', t('👔 Dugout hall of fame')));
      for (const l of coachHall.slice(0, 8)) {
        const honours = `${l.career.titles}×🏆 ${l.career.cups}×🏅`;
        const extras = [
          l.career.clubs > 1 ? `${l.career.clubs} ${t('clubs')}` : '',
          l.career.sackings > 0 ? `${l.career.sackings}×🪓` : '',
          l.mentor ? `🎓 ${t('school of')} ${l.mentor}` : '',
        ].filter(Boolean).join(' · ');
        this.root.appendChild(el('div', 'history-entry',
          `👔 ${l.name} (${l.lastClub}, ${t('retired#')} ${l.age}) — ${honours} · ` +
          `${l.career.seasons} ${t('seasons in charge')}${extras ? ` · ${extras}` : ''}`));
      }
    }

    // Movement records + long-run arcs.
    this.root.appendChild(el('h2', '', t('🎢 Movement records')));
    const moves = movementCounts(this.league!.franchises);
    const mostUp = [...moves].sort((a, b) => b.promotions - a.promotions)[0];
    const mostDown = [...moves].sort((a, b) => b.relegations - a.relegations)[0];
    if (mostUp && mostUp.promotions > 0) {
      this.root.appendChild(el('div', 'history-entry', `⬆️ Most promotions: ${mostUp.name} — ${mostUp.promotions}`));
    }
    if (mostDown && mostDown.relegations > 0) {
      this.root.appendChild(el('div', 'history-entry', `⬇️ Most relegations: ${mostDown.name} — ${mostDown.relegations}`));
    }
    const streak = longestPremierStreak(h, this.league!.franchises);
    if (streak) {
      this.root.appendChild(
        el('div', 'history-entry', `🛡️ Longest Premier tenure: ${streak.name} — ${streak.length} season${streak.length > 1 ? 's' : ''}`),
      );
    }
    const comeback = greatestComeback(h);
    if (comeback) {
      this.root.appendChild(
        el('div', 'history-entry',
          `🔥 Greatest comeback: ${comeback.name} — relegated in S${comeback.fellSeason}, Premier champions by S${comeback.wonSeason}`),
      );
    }

    // Single-season records mined from the history.
    this.root.appendChild(el('h2', '', t('📜 Records (single season)')));
    const rows: string[] = [];
    let bestPts: { v: number; who: string; gen: number } | null = null;
    let bestGd: { v: number; who: string; gen: number } | null = null;
    let peakElo: { v: number; who: string; gen: number } | null = null;
    let bestScorer: { v: number; who: string; gen: number } | null = null;
    let bestKeeper: { v: number; who: string; gen: number } | null = null;
    let bestChain: { v: number; who: string; gen: number } | null = null;
    let bestMvp: { v: number; who: string; gen: number } | null = null;
    for (const r of h) {
      const top = r.table[0];
      if (!bestPts || top.pts > bestPts.v) bestPts = { v: top.pts, who: top.name, gen: r.generation };
      for (const row of r.table) {
        const gd = row.gf - row.ga;
        if (!bestGd || gd > bestGd.v) bestGd = { v: gd, who: row.name, gen: r.generation };
        if (row.elo !== undefined && (!peakElo || row.elo > peakElo.v)) {
          peakElo = { v: row.elo, who: row.name, gen: r.generation };
        }
      }
      const boot = r.awards?.topScorers[0];
      if (boot && (!bestScorer || boot.goals > bestScorer.v)) {
        bestScorer = { v: boot.goals, who: `${boot.name} (${boot.team})`, gen: r.generation };
      }
      const glove = r.awards?.topKeeper;
      if (glove && (!bestKeeper || glove.saves > bestKeeper.v)) {
        bestKeeper = { v: glove.saves, who: `${glove.name} (${glove.team})`, gen: r.generation };
      }
      if (r.longestChain && (!bestChain || r.longestChain.length > bestChain.v)) {
        bestChain = { v: r.longestChain.length, who: r.longestChain.team, gen: r.generation };
      }
      const mvp = r.awards?.mvp;
      if (mvp && (!bestMvp || mvp.avgRating > bestMvp.v)) {
        bestMvp = { v: mvp.avgRating, who: `${mvp.name} (${mvp.team})`, gen: r.generation };
      }
    }
    if (bestPts) rows.push(`Most points: <b>${bestPts.v}</b> — ${bestPts.who} (S${bestPts.gen})`);
    if (bestGd) rows.push(`Best goal difference: <b>${bestGd.v > 0 ? '+' : ''}${bestGd.v}</b> — ${bestGd.who} (S${bestGd.gen})`);
    if (peakElo) rows.push(`Peak Elo: <b>${peakElo.v}</b> — ${peakElo.who} (S${peakElo.gen})`);
    if (bestScorer) rows.push(`Most goals: <b>${bestScorer.v}</b> — ${bestScorer.who} (S${bestScorer.gen})`);
    if (bestKeeper) rows.push(`Most saves: <b>${bestKeeper.v}</b> — ${bestKeeper.who} (S${bestKeeper.gen})`);
    if (bestChain) rows.push(`🎼 Longest passing move: <b>${bestChain.v}</b> — ${bestChain.who} (S${bestChain.gen})`);
    if (bestMvp) rows.push(`🌟 Best season rating: <b>${bestMvp.v.toFixed(2)}</b> — ${bestMvp.who} (S${bestMvp.gen})`);
    for (const r of rows) {
      const div = el('div', 'history-entry');
      div.innerHTML = r;
      this.root.appendChild(div);
    }

    // Dynasty strips: one row per slot, with division bands (cell background
    // = the division that season) and champion/movement icons.
    this.root.appendChild(el('h2', '', t('🧬 Dynasty timeline (per league slot)')));
    this.root.appendChild(
      el('div', 'muted', '🏆 Premier champions · 🥇 Challenger champions · 🏅 cup winners · ⬆️⬇️ moved · 👑 elite · 🧬 mutated · 🔄 reborn — cell shade = division that season'),
    );
    const ordered = [...this.league!.division(0), ...this.league!.division(1)];
    ordered.forEach((f, i) => {
      if (i === 0) this.root.appendChild(el('div', 'muted', DIVISION_NAMES[0]));
      if (i === 8) this.root.appendChild(el('div', 'muted', DIVISION_NAMES[1]));
      const strip = el('div', 'dynasty-row');
      const dot = el('span', 'dot');
      dot.style.background = colorHex(f.colors.primary);
      strip.append(dot, el('span', 'g-name', f.name));
      const cells = el('span', 'dynasty-cells');
      for (const r of h) {
        const e = r.evolution.entries.find((x) => x.slot === f.slot);
        let icon = e ? (e.kind === 'elite' ? '👑' : e.kind === 'mutated' ? '🧬' : '🔄') : '·';
        // Cup winner shows only when nothing bigger happened that season.
        if (r.cup?.winnerSlot === f.slot) icon = '🏅';
        if (r.promoted?.some((p) => p.slot === f.slot)) icon = '⬆️';
        if (r.relegated?.some((p) => p.slot === f.slot)) icon = '⬇️';
        const d2ChampSlot = r.table.find((row) => row.division === 1)?.slot;
        if (d2ChampSlot === f.slot) icon = '🥇';
        if (r.championSlot === f.slot) icon = '🏆';
        const cell = el('span', `dynasty-cell band-d${divisionIn(r, f.slot)}`, icon);
        cell.title = `S${r.generation} · ${DIVISION_SHORT[divisionIn(r, f.slot)]}${e ? `: ${e.name}${e.parents ? ` ← ${e.parents.join(' × ')}` : ''}` : ''}`;
        cells.appendChild(cell);
      }
      strip.appendChild(cells);
      this.root.appendChild(strip);
    });
  }
}
