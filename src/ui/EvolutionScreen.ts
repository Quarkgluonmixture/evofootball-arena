import { detectEras } from '../evolution/eras';
import { GENE_KEYS } from '../evolution/genome';
import type { Franchise } from '../evolution/franchise';
import { eraColor, eraDisplayName, eraIndexOf } from './chronicleView';
import { ATTR_KEYS, squadSummary } from '../evolution/playerGenome';
import {
  STYLE_DIMS, dimStats, nameplateFor, styleSpread, styleValues, topVarianceDims,
  type DimStat, type DimTheme,
} from '../evolution/styleSpace';
import type { League } from '../sim/League';
import { attrHeatmap, sparklineTile, stackedShareStrip } from './charts';
import { button, colorHex, el } from './dom';
import {
  Z_LIMIT, axisMove, cardPlacement, driftMagnitude, nearestDot, projectZ, styleZ,
  toViewBox, trailOpacity, trailStart, type ScatterDot,
} from './scatterGeom';
import type { EntityNav } from './entityLinks';
import { t } from './i18n';

const INK_MUTED = '#8294b5';
const GRID = '#24304a';
const SURFACE = '#0d1526';

/** One playable frame of the league's style history. */
interface StyleFrame {
  label: string;
  bySlot: Map<number, number[]>;
  /** Squad attribute means per slot (Phase 118.5, recorded since v31) —
   * the budget heatmap rides the scrubber. Absent on pre-v31 records. */
  attrsBySlot?: Map<number, number[]>;
}

const EVENT_COLOR: Record<string, string> = {
  founded: '#4a5a7a',
  elite: '#f5c542',
  mutated: '#2a3a5c',
  reborn: '#ef4444',
  promoted: '#34d399',
  relegated: '#f59e0b',
  // The dugout events (Phase 116) — recorded in lineage since Phase 53,
  // invisible on the wall until now.
  sacked: '#b91c1c',
  hired: '#7dd3fc',
  'coach-retired': '#8294b5',
};
const EVENT_ICON: Record<string, string> = {
  founded: '·', elite: '👑', mutated: '·', reborn: '💀', promoted: '⬆', relegated: '⬇',
  sacked: '🪓', hired: '👔', 'coach-retired': '🌅',
};

/** Formation palettes (Phase 116): one source for the population share
 * strips and the per-club shape timeline. */
const ATK_COLORS: Record<string, string> = {
  'wide-212': '#60a5fa', 'narrow-122': '#f59e0b', 'twin-st': '#4ade80',
  'false-nine': '#a78bfa', 'overload': '#fb7185', 'target-man': '#facc15',
};
const DEF_COLORS: Record<string, string> = {
  'low-32': '#60a5fa', 'press-23': '#f472b6', 'mid-41': '#4ade80', 'high-line': '#facc15',
};

/**
 * The EVOLUTION CENTER (Phase 51) — evolution gets its OWN screen (user
 * report: the league screen is DATA; the evolution story deserves a stage,
 * not a tab of tiles). Architecture, hero first:
 *   1. the style-space map with a GENERATION SCRUBBER + play button — watch
 *      the league's styles drift, season by season (styleMatrix history);
 *   2. a club DRIFT panel (tap any dot / dynasty row): the club's OWN
 *      most-moved style dims over time (identity-now → the club center, 113.5);
 *   3. the dynasty wall — 16 slots × generations of elite/reborn/promotion
 *      events at a glance;
 *   4. population trends (divergence, formation shares, budget heatmap) with
 *      the full gene/attr tile wall folded into a <details>.
 * Everything reads records + live franchises; no sim writes, no rng.
 */
export class EvolutionScreen {
  readonly root: HTMLElement;
  private visible = false;
  private league: League | null = null;
  private selectedSlot = 0;
  private diveAnchor: HTMLElement | null = null;
  /** Index into frames() — null means "latest". */
  private frameIdx: number | null = null;
  private playTimer: number | null = null;
  /** Set by GameApp: reopen the latest rebirth ceremony. */
  onShowCeremony: (() => void) | null = null;
  /** Cross-screen navigation (Phase 108/113.5) — the drift panel links to
   * the club center. Set by GameApp. */
  nav: EntityNav | null = null;
  /** Scrubber → budget heatmap hook (118.5); set by renderPopulation. */
  private heatmapUpdate: ((idx: number) => void) | null = null;
  /** Track D2 — the pointer's club, and which lens it is over. Transient:
   * hover emphasises within ONE lens, the locked club emphasises in all four. */
  private hoverSlot: number | null = null;
  private hoverLens: number | null = null;
  /** Which lens has the identity card LOCKED open on the selected club. A
   * phone has no hover, so tapping a dot is how the card is read at all. */
  private pinLens: number | null = null;
  /** Repaint ONE lens in place (hover/lock feedback); set by renderHero. */
  private redrawLens: ((lensIdx: number) => void) | null = null;

  constructor(host: HTMLElement) {
    this.root = el('div');
    this.root.id = 'evolution-screen';
    this.root.classList.add('hidden');
    host.appendChild(this.root);
  }

  get isVisible(): boolean {
    return this.visible;
  }

  toggle(league: League): void {
    this.visible = !this.visible;
    this.root.classList.toggle('hidden', !this.visible);
    if (this.visible) {
      this.selectedSlot = league.standings(0)[0]?.slot ?? 0;
      this.frameIdx = null;
      this.pinLens = null; // a fresh open starts with no card in the way
      this.render(league);
    } else {
      this.stopPlay();
    }
  }

  hide(): void {
    if (!this.visible) return;
    this.visible = false;
    this.root.classList.add('hidden');
    this.stopPlay();
  }

  refreshIfVisible(league: League): void {
    if (this.visible) this.render(league);
  }

  /* ---------------- data ---------------- */

  private clubs(league: League): Franchise[] {
    return [...league.division(0), ...league.division(1)];
  }

  /** History styleMatrix snapshots + the LIVE population as the last frame. */
  private frames(league: League): StyleFrame[] {
    const out: StyleFrame[] = [];
    for (const r of league.history) {
      if (!r.styleMatrix) continue;
      const withAttrs = r.styleMatrix.filter((row) => row.attrs);
      out.push({
        label: `${t('Gen')} ${r.generation}`,
        bySlot: new Map(r.styleMatrix.map((row) => [row.slot, row.values])),
        attrsBySlot: withAttrs.length > 0
          ? new Map(withAttrs.map((row) => [row.slot, row.attrs!]))
          : undefined,
      });
    }
    out.push({
      label: `${t('Gen')} ${league.generation} (${t('now')})`,
      bySlot: new Map(this.clubs(league).map((f) => [
        f.slot, styleValues({ genome: f.coach.genome, policy: f.coach.policy }),
      ])),
      attrsBySlot: new Map(this.clubs(league).map((f) => {
        const summary = squadSummary(f.squad);
        return [f.slot, ATTR_KEYS.map((k) => summary[k])];
      })),
    });
    return out;
  }

  /* ---------------- render ---------------- */

  render(league: League): void {
    this.league = league;
    this.stopPlay();
    // The pointer's club dies with the DOM it was pointing at; the LOCKED club
    // and its pinned card survive — that is what locking is for.
    this.hoverSlot = null;
    this.hoverLens = null;
    this.root.textContent = '';
    this.root.appendChild(el('h2', '', `🧬 ${t('Evolution center')} — ${t('Gen')} ${league.generation}`));

    const clubs = this.clubs(league);
    const pop = clubs.map((f) => styleValues({ genome: f.coach.genome, policy: f.coach.policy }));
    const stats = dimStats(pop);
    const frames = this.frames(league);
    const idx = this.frameIdx ?? frames.length - 1;

    this.renderHero(league, clubs, stats, frames, idx);
    this.renderClubPanel(league, clubs, stats, frames);
    this.renderDynastyWall(league, clubs);
    this.renderPopulation(league, clubs, stats, frames, idx);
    this.renderLastEvolution(league);
  }

  /** Section 1 — the hero: FOUR side-by-side lenses on the style space
   * (user 2026-07-14: "风格空间这种可以放多个并列的图") — the overall map
   * plus attack/defence/build-up lenses, every axis pair earned by variance
   * within its lens, all driven by ONE scrubber so playback moves them
   * together. */
  private renderHero(
    league: League, clubs: Franchise[], stats: DimStat[], frames: StyleFrame[], idx: number,
  ): void {
    this.root.appendChild(el('h2', '', t('Style space')));
    this.root.appendChild(el('div', 'muted',
      t('Four lenses on the same league — axes are wherever the clubs disagree most, overall and per phase of play.')));
    this.root.appendChild(el('div', 'muted',
      t('Hollow ring = where every club stood last season; the locked club also trails the seasons before that. Hover a dot for its identity, tap to lock it.')));

    const heroWrap = el('div', 'evo-hero');
    const lenses: Array<{ title: string; theme?: DimTheme; host: HTMLElement; dims: [number, number] }> = [
      { title: t('Overall'), theme: undefined, host: el('div', 'evo-map'), dims: topVarianceDims(stats) },
      { title: t('Attack'), theme: 'attack', host: el('div', 'evo-map'), dims: topVarianceDims(stats, 'attack') },
      { title: t('Defend'), theme: 'defence', host: el('div', 'evo-map'), dims: topVarianceDims(stats, 'defence') },
      { title: t('BuildUp'), theme: 'build', host: el('div', 'evo-map'), dims: topVarianceDims(stats, 'build') },
    ];
    const mapGrid = el('div', 'evo-map-grid');
    for (const lens of lenses) {
      const cell = el('div', 'evo-map-cell');
      cell.appendChild(el('div', 'muted evo-map-title', lens.title));
      cell.appendChild(lens.host);
      mapGrid.appendChild(cell);
    }
    heroWrap.appendChild(mapGrid);
    const drawAll = (frameIdx: number): void => {
      lenses.forEach((lens, i) =>
        this.drawMap(lens.host, i, clubs, stats, frames, frameIdx, lens.dims));
      this.heatmapUpdate?.(frameIdx); // the budget heatmap scrubs too (118.5)
    };
    // Hover has to repaint the lens it happened in (emphasis + card) without
    // touching the other three or the screen below — a full render() on every
    // mouse move would fight the pointer.
    this.redrawLens = (lensIdx: number): void => {
      const lens = lenses[lensIdx];
      const cur = this.frameIdx ?? frames.length - 1;
      if (lens) this.drawMap(lens.host, lensIdx, clubs, stats, frames, cur, lens.dims);
    };

    // Controls: ◀ frame slider ▶ + play.
    const controls = el('div', 'row evo-controls');
    const playBtn = button('▶', () => {
      if (this.playTimer !== null) {
        this.stopPlay();
        playBtn.textContent = '▶';
        return;
      }
      playBtn.textContent = '⏸';
      // Restart from the beginning when already at the end.
      if ((this.frameIdx ?? frames.length - 1) >= frames.length - 1) this.frameIdx = 0;
      this.playTimer = window.setInterval(() => {
        const cur = this.frameIdx ?? frames.length - 1;
        if (cur >= frames.length - 1) {
          this.stopPlay();
          playBtn.textContent = '▶';
          return;
        }
        this.frameIdx = cur + 1;
        slider.value = String(this.frameIdx);
        frameLabel.textContent = frames[this.frameIdx].label;
        drawAll(this.frameIdx);
      }, 450);
    });
    playBtn.classList.add('evo-play');
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = String(frames.length - 1);
    slider.value = String(idx);
    slider.className = 'evo-scrub';
    const frameLabel = el('span', 'muted evo-frame-label', frames[idx].label);
    slider.addEventListener('input', () => {
      this.stopPlay();
      playBtn.textContent = '▶';
      this.frameIdx = Number(slider.value);
      frameLabel.textContent = frames[this.frameIdx].label;
      drawAll(this.frameIdx);
    });
    controls.append(playBtn, slider, frameLabel);
    heroWrap.appendChild(controls);
    this.root.appendChild(heroWrap);

    drawAll(idx);
  }

  /**
   * Draw one frame of one lens (Track D2). DOM SVG, so the dots can be
   * pointed at. Reading order, back to front:
   *   σ rings — how far from the league's centre a club is standing;
   *   the trail — the FOCUSED club's earlier seasons, fading into the past;
   *   ghosts — a hollow ring where each club stood LAST season, with a dashed
   *     tie to where it stands now, so one season's movement is the loudest
   *     thing on the chart and a whole-cloud drift is visible as a whole;
   *   dots — the present, with the hovered/locked club lifted out of the pack.
   * The lens index is here because the identity card is per-lens: pointing at
   * one map must not open four cards.
   */
  private drawMap(
    host: HTMLElement, lensIdx: number, clubs: Franchise[], stats: DimStat[],
    frames: StyleFrame[], idx: number, dims: [number, number],
  ): void {
    const [xi, yi] = dims;
    const zAt = (row: number[], i: number): number =>
      styleZ(row[i], stats[i].mean, stats[i].std, STYLE_DIMS[i].scale);
    const W = 420;
    const H = 320;
    const PAD = 28;
    const cx = (zv: number): number => projectZ(zv, W, PAD);
    const cy = (zv: number): number => projectZ(zv, H, PAD, true);
    const at = (row: number[]): [number, number] => [cx(zAt(row, xi)), cy(zAt(row, yi))];
    host.textContent = '';
    host.classList.add('evo-map-host');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', '100%');
    svg.classList.add('evo-map-svg');
    const mk = (name: string): SVGElement =>
      document.createElementNS('http://www.w3.org/2000/svg', name);
    const bg = mk('rect');
    bg.setAttribute('x', '0'); bg.setAttribute('y', '0');
    bg.setAttribute('width', String(W)); bg.setAttribute('height', String(H));
    bg.setAttribute('rx', '10'); bg.setAttribute('fill', SURFACE);
    svg.appendChild(bg);

    // σ rings: the population centre is the middle, so distance from it IS
    // distinctiveness. Ellipses because the two axes carry different pixel
    // lengths for the same z.
    for (const sigma of [1, 2]) {
      const ring = mk('ellipse');
      ring.setAttribute('cx', String(W / 2)); ring.setAttribute('cy', String(H / 2));
      ring.setAttribute('rx', String((sigma * (W / 2 - PAD) / Z_LIMIT).toFixed(1)));
      ring.setAttribute('ry', String((sigma * (H / 2 - PAD) / Z_LIMIT).toFixed(1)));
      ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', GRID);
      ring.setAttribute('stroke-width', '1');
      ring.setAttribute('stroke-dasharray', '3 5');
      ring.setAttribute('opacity', sigma === 1 ? '0.9' : '0.55');
      svg.appendChild(ring);
    }
    for (const [x1, y1, x2, y2] of [
      [PAD, H / 2, W - PAD, H / 2],
      [W / 2, PAD, W / 2, H - PAD],
    ] as const) {
      const line = mk('line');
      line.setAttribute('x1', String(x1)); line.setAttribute('y1', String(y1));
      line.setAttribute('x2', String(x2)); line.setAttribute('y2', String(y2));
      line.setAttribute('stroke', GRID); line.setAttribute('stroke-width', '1');
      svg.appendChild(line);
    }
    const sig = mk('text');
    sig.setAttribute('x', String(W / 2 + 2 * (W / 2 - PAD) / Z_LIMIT + 3));
    sig.setAttribute('y', String(H / 2 - 4));
    sig.setAttribute('font-size', '8'); sig.setAttribute('fill', INK_MUTED);
    sig.setAttribute('opacity', '0.7');
    sig.textContent = '2σ';
    const ax = mk('text');
    ax.setAttribute('x', String(W - PAD)); ax.setAttribute('y', String(H / 2 - 7));
    ax.setAttribute('text-anchor', 'end'); ax.setAttribute('font-size', '10'); ax.setAttribute('fill', INK_MUTED);
    ax.textContent = `${t(STYLE_DIMS[xi].key)} →`;
    const ay = mk('text');
    ay.setAttribute('x', String(W / 2 + 7)); ay.setAttribute('y', String(PAD + 4));
    ay.setAttribute('font-size', '10'); ay.setAttribute('fill', INK_MUTED);
    ay.textContent = `${t(STYLE_DIMS[yi].key)} ↑`;
    svg.append(sig, ax, ay);

    const hovering = this.hoverLens === lensIdx ? this.hoverSlot : null;
    const isLead = (slot: number): boolean => slot === hovering || slot === this.selectedSlot;
    const dots: ScatterDot[] = [];
    const leadLayer: SVGElement[] = [];

    for (const f of clubs) {
      const color = colorHex(f.colors.primary);
      const lead = isLead(f.slot);
      const layer: SVGElement[] = [];
      const now = frames[idx].bySlot.get(f.slot);
      const ghostRow = idx > 0 ? frames[idx - 1].bySlot.get(f.slot) : undefined;

      // The long trail belongs to the FOCUSED club only. Sixteen clubs times
      // eight seasons of faint polyline is a scribble that hides the very drift
      // it is supposed to show — everyone else carries their one-season ghost
      // tie below, which is the movement that actually just happened.
      if (lead) {
        // Trail points stop BEFORE the present: the ghost→now leg is drawn as
        // the dashed tie, so the two never double up on the same line. The
        // last trail point therefore IS the ghost, and wears the hollow ring.
        const pts: Array<[number, number]> = [];
        for (let i = trailStart(idx); i < idx; i++) {
          const row = frames[i].bySlot.get(f.slot);
          if (row) pts.push(at(row));
        }
        // History fades INTO the past, segment by segment, so the direction of
        // time is legible without waiting for playback.
        for (let i = 1; i < pts.length; i++) {
          const seg = mk('line');
          seg.setAttribute('x1', pts[i - 1][0].toFixed(1));
          seg.setAttribute('y1', pts[i - 1][1].toFixed(1));
          seg.setAttribute('x2', pts[i][0].toFixed(1));
          seg.setAttribute('y2', pts[i][1].toFixed(1));
          seg.setAttribute('stroke', color);
          seg.setAttribute('stroke-width', '2.2');
          seg.setAttribute('stroke-linecap', 'round');
          seg.setAttribute('opacity', trailOpacity(i, pts.length, 0.85).toFixed(2));
          layer.push(seg);
        }
        // Season beads: one mark per generation the trail passes THROUGH — the
        // oldest point is where the line starts and the newest is the ghost's
        // own ring, so neither needs a bead of its own.
        for (let i = 1; i < pts.length - 1; i++) {
          const bead = mk('circle');
          bead.setAttribute('cx', pts[i][0].toFixed(1));
          bead.setAttribute('cy', pts[i][1].toFixed(1));
          bead.setAttribute('r', '1.8');
          bead.setAttribute('fill', color);
          bead.setAttribute('opacity', trailOpacity(i, pts.length, 0.7).toFixed(2));
          layer.push(bead);
        }
      }

      // The ghost: last season, hollow. Every club carries one so a league-wide
      // drift shows up as the whole cloud stepping off its own shadow.
      if (now && ghostRow) {
        const [gx, gy] = at(ghostRow);
        const [nx, ny] = at(now);
        const tie = mk('line');
        tie.setAttribute('x1', gx.toFixed(1)); tie.setAttribute('y1', gy.toFixed(1));
        tie.setAttribute('x2', nx.toFixed(1)); tie.setAttribute('y2', ny.toFixed(1));
        tie.setAttribute('stroke', color);
        tie.setAttribute('stroke-width', lead ? '1.8' : '1');
        tie.setAttribute('stroke-dasharray', '2 3');
        tie.setAttribute('opacity', lead ? '0.8' : '0.3');
        layer.push(tie);
        const ghost = mk('circle');
        ghost.setAttribute('cx', gx.toFixed(1)); ghost.setAttribute('cy', gy.toFixed(1));
        ghost.setAttribute('r', lead ? '5.5' : '4');
        ghost.setAttribute('fill', 'none');
        ghost.setAttribute('stroke', color);
        ghost.setAttribute('stroke-width', lead ? '2' : '1.3');
        ghost.setAttribute('opacity', lead ? '0.85' : '0.34');
        layer.push(ghost);
        // Which way it is going — only once the step is big enough that the
        // angle means something rather than rounding noise.
        if (lead && Math.hypot(nx - gx, ny - gy) >= 7) {
          const ang = Math.atan2(ny - gy, nx - gx) * 180 / Math.PI;
          const head = mk('path');
          head.setAttribute('d', 'M 0 0 L -7 3.4 L -7 -3.4 Z');
          head.setAttribute('fill', color);
          head.setAttribute('opacity', '0.9');
          head.setAttribute('transform',
            `translate(${nx.toFixed(1)} ${ny.toFixed(1)}) rotate(${ang.toFixed(1)}) translate(-9 0)`);
          layer.push(head);
        }
      }

      if (now) {
        const [x, y] = at(now);
        dots.push({ slot: f.slot, x, y });
        const locked = f.slot === this.selectedSlot;
        const dot = mk('circle');
        dot.setAttribute('cx', x.toFixed(1)); dot.setAttribute('cy', y.toFixed(1));
        dot.setAttribute('r', lead ? '7.5' : '5');
        dot.setAttribute('fill', color);
        dot.setAttribute('stroke', lead ? '#e7ecf6' : SURFACE);
        dot.setAttribute('stroke-width', '2');
        dot.setAttribute('opacity', lead ? '1' : '0.62');
        layer.push(dot);
        if (locked) {
          // The lock's own mark, so a locked club still reads as locked while
          // the pointer is somewhere else entirely.
          const halo = mk('circle');
          halo.setAttribute('cx', x.toFixed(1)); halo.setAttribute('cy', y.toFixed(1));
          halo.setAttribute('r', '11');
          halo.setAttribute('fill', 'none');
          halo.setAttribute('stroke', '#e7ecf6');
          halo.setAttribute('stroke-width', '1');
          halo.setAttribute('opacity', '0.55');
          layer.push(halo);
        }
        const label = mk('text');
        label.setAttribute('x', (x + (locked ? 13 : 8)).toFixed(1));
        label.setAttribute('y', (y + 3).toFixed(1));
        label.setAttribute('font-size', lead ? '10' : '9');
        label.setAttribute('font-weight', lead ? '700' : '400');
        label.setAttribute('fill', lead ? '#e7ecf6' : INK_MUTED);
        label.setAttribute('opacity', lead ? '1' : '0.75');
        label.textContent = f.short;
        layer.push(label);
      }

      if (lead) leadLayer.push(...layer);
      else svg.append(...layer);
    }
    svg.append(...leadLayer); // the focused club is never buried by the pack
    host.appendChild(svg);

    // The identity card: who that dot is and what the league measured about
    // it. Shown for whatever the pointer is on; pinned to the locked club
    // when this is the lens the user tapped in (a phone never hovers).
    const cardSlot = hovering ?? (this.pinLens === lensIdx ? this.selectedSlot : null);
    if (cardSlot !== null) {
      const f = clubs.find((c) => c.slot === cardSlot);
      const now = f ? frames[idx].bySlot.get(f.slot) : undefined;
      const anchor = dots.find((d) => d.slot === cardSlot);
      if (f && now && anchor) {
        host.appendChild(this.identityCard(
          host, f, now, idx > 0 ? frames[idx - 1].bySlot.get(f.slot) ?? null : null,
          stats, dims, frames, idx, anchor, W, H, hovering !== null,
        ));
      }
    }

    // Hit testing off the SVG rather than per-dot handlers: the dots are 5px
    // in a 420-unit box and a thumb is not, so the pointer gets a generous
    // radius and the NEAREST club wins.
    const hit = (ev: PointerEvent | MouseEvent): number | null => {
      const rect = svg.getBoundingClientRect();
      const p = toViewBox(ev.clientX, ev.clientY, rect, W, H);
      return nearestDot(dots, p.x, p.y, 22)?.slot ?? null;
    };
    svg.addEventListener('pointermove', (ev) => {
      if (ev.pointerType === 'touch') return; // touch reads the card by tapping
      const slot = hit(ev);
      if (slot === this.hoverSlot && this.hoverLens === lensIdx) return;
      this.hoverSlot = slot;
      this.hoverLens = slot === null ? null : lensIdx;
      this.redrawLens?.(lensIdx);
    });
    svg.addEventListener('pointerleave', () => {
      if (this.hoverLens !== lensIdx) return;
      this.hoverSlot = null;
      this.hoverLens = null;
      this.redrawLens?.(lensIdx);
    });
    svg.addEventListener('click', (ev) => {
      const slot = hit(ev);
      if (slot === null) return;
      // Tapping the club that is already locked here unpins the card — the
      // way out of a card that is covering the dot behind it.
      this.pinLens = slot === this.selectedSlot && this.pinLens === lensIdx ? null : lensIdx;
      this.selectedSlot = slot;
      if (this.league) this.render(this.league);
    });
  }

  /**
   * The identity card (D2's "hover 身份"): the club, the style words the
   * population's own spread earned it, and how far it moved since the ghost
   * season. Every number here is measured off the same style vectors the dots
   * are drawn from — no narrative that the chart cannot back.
   */
  private identityCard(
    host: HTMLElement, f: Franchise, now: number[], ghost: number[] | null,
    stats: DimStat[], dims: [number, number], frames: StyleFrame[], idx: number,
    anchor: ScatterDot, W: number, H: number, transient: boolean,
  ): HTMLElement {
    const [xi, yi] = dims;
    const zAt = (row: number[], i: number): number =>
      styleZ(row[i], stats[i].mean, stats[i].std, STYLE_DIMS[i].scale);
    const mx = axisMove(zAt(now, xi), ghost ? zAt(ghost, xi) : null);
    const my = axisMove(zAt(now, yi), ghost ? zAt(ghost, yi) : null);
    const drift = driftMagnitude(mx, my);

    const card = el('div', 'evo-card');
    if (transient) card.classList.add('transient');
    card.style.borderColor = colorHex(f.colors.primary);
    const head = el('div', 'evo-card-head');
    const swatch = el('span', 'dot');
    swatch.style.background = colorHex(f.colors.primary);
    head.append(swatch, el('span', 'evo-card-name', f.name));
    card.appendChild(head);

    card.appendChild(el('div', 'evo-card-when', ghost
      ? `${frames[idx - 1].label} → ${frames[idx].label} · ${t('drift')} ${drift!.toFixed(2)}σ`
      : `${frames[idx].label} · ${t('no earlier season yet')}`));

    const plate = el('div', 'evo-card-plate');
    for (const word of nameplateFor(now, stats)) plate.appendChild(el('span', 'evo-chip', t(word)));
    card.appendChild(plate);

    for (const [i, m] of [[xi, mx], [yi, my]] as const) {
      const row = el('div', 'evo-card-row');
      row.appendChild(el('span', 'evo-card-dim', t(STYLE_DIMS[i].key)));
      row.appendChild(el('span', 'evo-card-z', `${m.z >= 0 ? '+' : ''}${m.z.toFixed(2)}σ`));
      const move = el('span', 'evo-card-move',
        m.dz === null ? '—' : `${m.arrow} ${m.dz >= 0 ? '+' : ''}${m.dz.toFixed(2)}`);
      if (m.dz !== null && m.arrow !== '→') move.classList.add('moved');
      row.appendChild(move);
      card.appendChild(row);
    }
    card.appendChild(el('div', 'evo-card-hint', t('Tap the dot again to unpin')));

    // Placed after layout so the card's real size decides which way it flips;
    // the host may not be measurable yet, in which case fall back to the
    // viewBox aspect the SVG will take anyway.
    const hostW = host.clientWidth || W;
    const hostH = host.clientHeight || hostW * H / W;
    card.style.visibility = 'hidden';
    requestAnimationFrame(() => {
      const p = cardPlacement(
        anchor.x / W * hostW, anchor.y / H * hostH,
        card.offsetWidth, card.offsetHeight, hostW, hostH,
      );
      card.style.left = `${p.left}px`;
      card.style.top = `${p.top}px`;
      card.style.visibility = 'visible';
    });
    return card;
  }

  /** Section 2 — the selected club through the EVOLUTION lens (113.5):
   * identity-now moved to the club center; what stays here is how this
   * club's style has MOVED across the generations. */
  private renderClubPanel(
    league: League, clubs: Franchise[], stats: DimStat[], frames: StyleFrame[],
  ): void {
    void stats;
    const f = clubs.find((c) => c.slot === this.selectedSlot) ?? clubs[0];
    this.selectedSlot = f.slot;
    this.diveAnchor = el('h2', '', t('Club drift'));
    this.root.appendChild(this.diveAnchor);
    const panel = el('div', 'evo-club');
    const driftCol = el('div', 'evo-club-col');

    const head = el('div', 'team-head');
    const dot = el('span', 'dot');
    dot.style.background = colorHex(f.colors.primary);
    head.append(dot, el('span', '', `${f.name} · Elo ${Math.round(f.elo)}`));
    // Identity-now lives on the club's own stage — one hop away.
    head.appendChild(button(`🏟 ${t('Club center')}`, () => this.nav?.openClub(f.slot), 'club-link'));
    driftCol.appendChild(head);

    driftCol.appendChild(el('div', 'muted', t('This club\'s biggest style moves')));
    const series8 = frames
      .map((fr) => fr.bySlot.get(f.slot))
      .filter((row): row is number[] => row !== undefined);
    if (series8.length >= 2) {
      const first = series8[0];
      const last = series8[series8.length - 1];
      const movers = STYLE_DIMS
        .map((d, i) => ({ i, move: Math.abs(last[i] - first[i]) / d.scale }))
        .sort((a, b) => b.move - a.move || a.i - b.i)
        .slice(0, 4);
      const grid = el('div', 'spark-grid');
      for (const m of movers) {
        const d = STYLE_DIMS[m.i];
        const max = d.kind === 'gene' ? 1 : d.scale / 1.2 * 1.7; // policy upper bound
        grid.appendChild(sparklineTile(t(d.key), series8.map((row) => row[m.i] / max), colorHex(f.colors.primary)));
      }
      driftCol.appendChild(grid);
    } else {
      driftCol.appendChild(el('div', 'muted empty', t('Finish a season to see this club\'s drift.')));
    }

    // The SHAPE timeline (Phase 116): which formations this club actually
    // RAN, season by season — the discrete identity the continuous style
    // vector can't say. Recorded since save v29; the strip grows as
    // seasons play (old records simply lack it).
    const shapeWrap = el('div', 'shape-history');
    shapeWrap.appendChild(el('div', 'muted', t('Formation history')));
    const shapeRows = league.history
      .map((r) => ({ gen: r.generation, row: r.styleMatrix?.find((x) => x.slot === f.slot) }))
      .filter((x) => x.row?.style);
    if (shapeRows.length > 0) {
      const phases = [
        { key: 'formationAtk', colors: ATK_COLORS, label: '⚔' },
        { key: 'formationDef', colors: DEF_COLORS, label: '🛡' },
      ] as const;
      for (const ph of phases) {
        const strip = el('div', 'shape-strip');
        strip.appendChild(el('span', 'g-name', ph.label));
        const cells = el('span', 'shape-cells');
        for (const x of shapeRows) {
          const st = x.row!.style!;
          const cell = el('span', 'shape-cell');
          cell.style.background = ph.colors[st[ph.key]] ?? '#4a5a7a';
          cell.title = `${t('Gen')} ${x.gen} · ⚔ ${st.formationAtk} / 🛡 ${st.formationDef} · ${st.scheme}`;
          cells.appendChild(cell);
        }
        strip.appendChild(cells);
        shapeWrap.appendChild(strip);
      }
    } else {
      shapeWrap.appendChild(el('div', 'muted empty', t('Shape history records from here on — play a season.')));
    }
    driftCol.appendChild(shapeWrap);

    // Performance trajectory (Phase 116): Elo + fitness across the
    // generations — both sat fully-recorded in history, never plotted.
    // Self-normalized for shape; the head reads the raw latest value.
    const eloSeries = league.history
      .map((r) => r.table.find((x) => x.slot === f.slot)?.elo)
      .filter((v): v is number => v !== undefined);
    const fitSeries = league.history
      .map((r) => r.fitness.find((x) => x.slot === f.slot)?.total)
      .filter((v): v is number => v !== undefined);
    const norm = (vs: number[]): number[] => {
      const lo = Math.min(...vs);
      const hi = Math.max(...vs);
      return vs.map((v) => (hi - lo < 1e-9 ? 0.5 : (v - lo) / (hi - lo)));
    };
    if (eloSeries.length >= 2 || fitSeries.length >= 2) {
      const perf = el('div', 'spark-grid');
      if (eloSeries.length >= 2) {
        perf.appendChild(sparklineTile('Elo', norm(eloSeries), colorHex(f.colors.primary),
          String(Math.round(eloSeries[eloSeries.length - 1]))));
      }
      if (fitSeries.length >= 2) {
        perf.appendChild(sparklineTile(t('fitness'), norm(fitSeries), '#f5c542',
          fitSeries[fitSeries.length - 1].toFixed(3)));
      }
      driftCol.appendChild(perf);
    }
    panel.appendChild(driftCol);

    this.root.appendChild(panel);
  }

  /** Section 3 — the dynasty wall: 16 slots × generations of lineage events. */
  private renderDynastyWall(league: League, clubs: Franchise[]): void {
    this.root.appendChild(el('h2', '', t('Dynasty wall')));
    this.root.appendChild(el('div', 'muted',
      `👑 ${t('elite')} · 💀 ${t('reborn')} · ⬆⬇ ${t('promotion/relegation')} · 🪓 ${t('sacked')} · 👔 ${t('hired')} — ${t('tap a row to inspect the club')}`));
    const wall = el('div', 'dyn-wall');
    const maxGen = league.generation;

    // Era strip (Phase 52): one same-sized cell per generation so it wraps in
    // lockstep with the club rows below; names discovered from the records.
    const eras = detectEras(league.history);
    if (eras.length > 0) {
      const legend = el('div', 'era-legend');
      eras.forEach((era, i) => {
        const chip = el('span', 'era-chip');
        const swatch = el('span', 'era-swatch');
        swatch.style.background = eraColor(i);
        const range = era.start === era.end ? `S${era.start}` : `S${era.start}–${era.end}`;
        chip.append(swatch, document.createTextNode(`${eraDisplayName(era.label)} ${range}`));
        legend.appendChild(chip);
      });
      this.root.appendChild(legend);
      const stripRow = el('div', 'era-strip');
      stripRow.appendChild(el('div', 'dyn-name', t('Eras')));
      const stripCells = el('div', 'dyn-cells');
      for (let g = 1; g <= maxGen; g++) {
        const idx = eraIndexOf(eras, g);
        const cell = el('span', 'dyn-cell era-cell');
        if (idx >= 0) {
          cell.style.background = eraColor(idx);
          cell.title = `${t('Gen')} ${g}: ${eraDisplayName(eras[idx].label)}`;
        }
        stripCells.appendChild(cell);
      }
      stripRow.appendChild(stripCells);
      wall.appendChild(stripRow);
    }
    for (const f of clubs) {
      const row = el('div', 'dyn-row-line');
      if (f.slot === this.selectedSlot) row.classList.add('selected');
      const name = el('div', 'dyn-name');
      const dot = el('span', 'dot');
      dot.style.background = colorHex(f.colors.primary);
      name.append(dot, document.createTextNode(` ${f.short}`));
      row.appendChild(name);
      const cells = el('div', 'dyn-cells');
      const byGen = new Map<number, string>();
      for (const e of f.lineage) {
        // Rebirth outranks the mutation entry of the same generation.
        const prev = byGen.get(e.generation);
        if (!prev || e.event === 'reborn' || (e.event === 'elite' && prev === 'mutated')) {
          byGen.set(e.generation, e.event);
        }
      }
      for (let g = 1; g <= maxGen; g++) {
        const ev = byGen.get(g) ?? 'mutated';
        const cell = el('span', 'dyn-cell');
        cell.style.background = EVENT_COLOR[ev] ?? EVENT_COLOR.mutated;
        cell.title = `${t('Gen')} ${g}: ${t(ev)}`;
        if (ev !== 'mutated' && ev !== 'founded') cell.textContent = EVENT_ICON[ev];
        cells.appendChild(cell);
      }
      row.appendChild(cells);
      row.addEventListener('click', () => {
        this.selectedSlot = f.slot;
        if (this.league) this.render(this.league);
      });
      wall.appendChild(row);
    }
    this.root.appendChild(wall);
  }

  /** Section 4 — population trends + the folded tile wall. */
  private renderPopulation(
    league: League, clubs: Franchise[], stats: DimStat[], frames: StyleFrame[], idx: number,
  ): void {
    this.root.appendChild(el('h2', '', t('Population trends')));
    const grid = el('div', 'spark-grid');
    const spreadSeries = frames.map((fr) =>
      styleSpread(dimStats([...fr.bySlot.values()])));
    grid.appendChild(sparklineTile(`${t('style divergence')} ×5`, spreadSeries.map((v) => v * 5), '#f59e0b'));
    const withStyles = league.history.filter((r) => r.styleShares);
    if (withStyles.length > 0) {
      // The discovered shapes (Phase 67 + 107) — most eras show none; a
      // colored band appearing IS the event. Palettes shared with the
      // per-club shape timeline (Phase 116).
      grid.appendChild(stackedShareStrip(t('Attack formation'),
        Object.entries(ATK_COLORS).map(([label, color]) => ({ label, color })),
        withStyles.map((r) => r.styleShares!.atk)));
      grid.appendChild(stackedShareStrip(t('Defend formation'),
        Object.entries(DEF_COLORS).map(([label, color]) => ({ label, color })),
        withStyles.map((r) => r.styleShares!.def)));
      grid.appendChild(stackedShareStrip(t('Marking'), [
        { label: 'man', color: '#4ade80' },
        { label: 'zonal', color: '#a78bfa' },
      ], withStyles.map((r) => r.styleShares!.scheme)));
    }
    this.root.appendChild(grid);

    // Budget allocation JOINS THE TIME MACHINE (Phase 118.5, user report
    // "预算分配在演化里面怎么没有变"): the heatmap was a live-only snapshot
    // that ignored the scrubber. Now it renders the SCRUBBED generation —
    // recorded since v31, so old records show an honest empty note and the
    // history grows from here. Slot lanes keep the CURRENT club's short
    // (the dynasty-wall convention).
    this.root.appendChild(el('h2', '', t('Budget allocation')));
    const heatHost = el('div', 'heat-host');
    this.root.appendChild(heatHost);
    this.heatmapUpdate = (i: number): void => {
      heatHost.textContent = '';
      const frame = frames[i];
      heatHost.appendChild(el('div', 'muted', frame.label));
      if (frame.attrsBySlot) {
        heatHost.appendChild(attrHeatmap(
          clubs.map((f) => ({
            label: f.short,
            title: f.name,
            cells: frame.attrsBySlot!.get(f.slot) ?? ATTR_KEYS.map(() => 0),
          })),
          ATTR_KEYS.map((k) => t(k)),
        ));
      } else {
        heatHost.appendChild(el('div', 'muted empty', t('Budget history records from here on — play a season.')));
      }
    };
    this.heatmapUpdate(idx);

    const withGenes = league.history.filter((r) => r.geneMeans);
    if (withGenes.length > 0) {
      const details = document.createElement('details');
      details.className = 'evo-details';
      const summary = document.createElement('summary');
      summary.textContent = t('All gene & attribute curves (league mean per generation)');
      details.appendChild(summary);
      const geneGrid = el('div', 'spark-grid');
      for (const k of GENE_KEYS) {
        geneGrid.appendChild(sparklineTile(t(k), withGenes.map((r) => r.geneMeans![k])));
      }
      details.appendChild(geneGrid);
      const withAttrs = league.history.filter((r) => r.attrMeans);
      const attrGrid = el('div', 'spark-grid');
      for (const k of ATTR_KEYS) {
        attrGrid.appendChild(sparklineTile(t(k), withAttrs.map((r) => r.attrMeans![k]), '#4ade80'));
      }
      details.appendChild(attrGrid);
      this.root.appendChild(details);
    }
  }

  /** Section 5 — the latest evolution pass + the ceremony reopen. */
  private renderLastEvolution(league: League): void {
    const last = league.history[league.history.length - 1];
    if (!last) return;
    this.root.appendChild(el('h2', '', `${t('Last evolution')} (gen ${last.generation} → ${last.generation + 1})`));
    const row = el('div', 'row');
    row.appendChild(button(`🧬 ${t('Rebirth ceremony')}`, () => this.onShowCeremony?.()));
    this.root.appendChild(row);
    for (const e of last.evolution.entries) {
      const icon = e.kind === 'elite' ? '👑' : e.kind === 'mutated' ? '🧬' : '🔄';
      const par = e.parents ? ` ← ${e.parents.join(' × ')}` : '';
      this.root.appendChild(
        el('div', 'history-entry', `${icon} ${e.name}${par} · fitness ${e.fitness.toFixed(3)} · drift ${e.drift.toFixed(2)}`),
      );
    }
  }

  private stopPlay(): void {
    if (this.playTimer !== null) {
      window.clearInterval(this.playTimer);
      this.playTimer = null;
    }
  }
}
