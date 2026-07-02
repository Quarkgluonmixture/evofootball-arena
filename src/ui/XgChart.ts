import type { Match } from '../sim/Match';
import { colorHex, el } from './dom';

/**
 * Live xG race chart — cumulative expected goals per team over the match
 * clock, as two step lines with goal markers.
 *
 * Design notes (dataviz method): step-after line is the correct form for a
 * cumulative count over time; series colors follow the entity (kit colors);
 * because arbitrary kit pairings can be CVD-ambiguous, identity is ALSO
 * carried by secondary encoding — team A solid / team B dashed, plus direct
 * labels at the line ends — so color is never the only channel. One shared
 * y-axis; recessive grid; goal markers 8px with a 2px surface ring and native
 * <title> tooltips.
 */
const W = 264;
const H = 100;
const PAD_L = 8;
const PAD_R = 56;
const PAD_T = 12;
const PAD_B = 14;
const SURFACE = '#0d1526';
const GRID = '#24304a';
const INK_MUTED = '#8294b5';

export class XgChart {
  readonly root: HTMLDivElement;
  private svg: SVGSVGElement;

  constructor() {
    this.root = el('div', 'xg-chart');
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    this.svg.setAttribute('width', '100%');
    this.root.appendChild(this.svg);
  }

  update(match: Match): void {
    const nowMin = Math.max(match.minute(), 1);
    const series: Array<{ pts: Array<{ m: number; c: number }>; goals: Array<{ m: number; c: number; xg: number }>; total: number }> = [];

    for (const side of [0, 1] as const) {
      const pts: Array<{ m: number; c: number }> = [{ m: 0, c: 0 }];
      const goals: Array<{ m: number; c: number; xg: number }> = [];
      let cum = 0;
      for (const s of match.shotLog) {
        if (s.side !== side) continue;
        cum += s.xg;
        pts.push({ m: s.minute, c: cum });
        if (s.outcome === 'goal') goals.push({ m: s.minute, c: cum, xg: s.xg });
      }
      series.push({ pts, goals, total: cum });
    }

    const yMax = Math.max(0.5, series[0].total, series[1].total) * 1.15;
    const x = (m: number) => PAD_L + (Math.min(m, 90) / 90) * (W - PAD_L - PAD_R);
    const y = (c: number) => H - PAD_B - (c / yMax) * (H - PAD_T - PAD_B);

    const parts: string[] = [];
    // Recessive grid: three horizontal lines, no boxes.
    for (const frac of [0.25, 0.5, 0.75]) {
      const gy = (H - PAD_B - (H - PAD_T - PAD_B) * frac).toFixed(1);
      parts.push(`<line x1="${PAD_L}" y1="${gy}" x2="${W - PAD_R}" y2="${gy}" stroke="${GRID}" stroke-width="1"/>`);
    }
    // X ticks: 0 / HT / 90 in muted ink (first tick left-anchored so it isn't
    // clipped by the plot edge).
    for (const [m, label, anchor] of [[0, '0', 'start'], [45, 'HT', 'middle'], [90, "90'", 'middle']] as Array<[number, string, string]>) {
      parts.push(
        `<text x="${x(m)}" y="${H - 3}" font-size="8" fill="${INK_MUTED}" text-anchor="${anchor}" font-family="inherit">${label}</text>`,
      );
    }

    for (const side of [0, 1] as const) {
      const s = series[side];
      const color = colorHex(match.teams[side].info.colors.primary);
      const dash = side === 1 ? ' stroke-dasharray="5 3"' : '';

      // Step-after path, extended to the current minute.
      let d = `M ${x(0).toFixed(1)} ${y(0).toFixed(1)}`;
      let lastC = 0;
      for (const p of s.pts.slice(1)) {
        d += ` H ${x(p.m).toFixed(1)} V ${y(p.c).toFixed(1)}`;
        lastC = p.c;
      }
      d += ` H ${x(nowMin).toFixed(1)}`;
      parts.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="2"${dash} stroke-linejoin="round"/>`);

      // Goal markers: 8px dot with a 2px surface ring + native tooltip.
      for (const g of s.goals) {
        parts.push(
          `<circle cx="${x(g.m).toFixed(1)}" cy="${y(g.c).toFixed(1)}" r="4" fill="${color}" stroke="${SURFACE}" stroke-width="2">` +
            `<title>${match.teams[side].info.short} goal ${g.m}' · shot xG ${g.xg.toFixed(2)}</title></circle>`,
        );
      }

      // Direct label at the line end (text in ink, chip carries the color).
      // Each side gets its own vertical clamp band so the labels can never
      // overlap, even while both lines sit at 0.
      const raw = y(lastC) + (side === 0 ? -4 : 10);
      const ly =
        side === 0
          ? Math.max(PAD_T + 6, Math.min(H - PAD_B - 12, raw))
          : Math.max(PAD_T + 16, Math.min(H - PAD_B - 2, raw));
      parts.push(
        `<text x="${W - PAD_R + 5}" y="${ly.toFixed(1)}" font-size="8.5" fill="${INK_MUTED}" font-family="inherit">` +
          `<tspan fill="${color}">■</tspan> ${match.teams[side].info.short} ${series[side].total.toFixed(1)}</text>`,
      );
    }

    this.svg.innerHTML = parts.join('');
  }
}
