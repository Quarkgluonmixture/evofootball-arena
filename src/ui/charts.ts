import { colorHex, el } from './dom';

/**
 * Tiny inline-SVG chart builders for the league screens.
 * Dataviz rules applied: recessive grids, thin 2px lines, text in ink (never
 * series color — a colored chip carries identity), direct labels instead of
 * legends, single-hue sparklines (magnitude, not identity).
 */

const INK_MUTED = '#8294b5';
const GRID = '#24304a';
const SURFACE = '#0d1526';

/** Single-series sparkline tile: name + latest value + trend line. */
export function sparklineTile(name: string, values: number[], color = '#60a5fa'): HTMLDivElement {
  const tile = el('div', 'spark-tile');
  const head = el('div', 'spark-head');
  head.append(
    el('span', 'g-name', name),
    el('span', 'spark-val', values.length ? values[values.length - 1].toFixed(2) : '—'),
  );
  tile.appendChild(head);

  const W = 132;
  const H = 34;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width', '100%');

  if (values.length >= 2) {
    // Fixed 0..1 domain: genes/attrs are normalized, so tiles stay comparable.
    const x = (i: number) => 4 + (i / (values.length - 1)) * (W - 8);
    const y = (v: number) => H - 4 - Math.max(0, Math.min(1, v)) * (H - 8);
    const mid = H - 4 - 0.5 * (H - 8);
    let d = `M ${x(0).toFixed(1)} ${y(values[0]).toFixed(1)}`;
    for (let i = 1; i < values.length; i++) d += ` L ${x(i).toFixed(1)} ${y(values[i]).toFixed(1)}`;
    svg.innerHTML =
      `<line x1="4" y1="${mid}" x2="${W - 4}" y2="${mid}" stroke="${GRID}" stroke-width="1"/>` +
      `<path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>` +
      `<circle cx="${x(values.length - 1)}" cy="${y(values[values.length - 1])}" r="2.5" fill="${color}"/>`;
  } else {
    svg.innerHTML = `<text x="4" y="${H - 12}" font-size="9" fill="${INK_MUTED}">need 2+ seasons</text>`;
  }
  tile.appendChild(svg);
  return tile;
}

export interface RaceSeries {
  name: string;
  color: number;
  values: number[];
}

/**
 * Points-race chart: cumulative points per round, one line per team.
 * Identity = kit color chip + direct short-name label at the line end
 * (established pattern from the xG chart; color is never the only channel —
 * hovering a line shows its team via <title>).
 */
export function raceChart(series: RaceSeries[], rounds: number): HTMLDivElement {
  const wrap = el('div', 'race-chart');
  const W = 480;
  const H = 190;
  const PADL = 26;
  const PADR = 92;
  const PADT = 10;
  const PADB = 20;
  const maxPts = Math.max(3, ...series.flatMap((s) => s.values));

  const x = (r: number) => PADL + (r / Math.max(rounds - 1, 1)) * (W - PADL - PADR);
  const y = (v: number) => H - PADB - (v / maxPts) * (H - PADT - PADB);

  const parts: string[] = [];
  for (const frac of [0, 0.5, 1]) {
    const gy = y(maxPts * frac);
    parts.push(
      `<line x1="${PADL}" y1="${gy.toFixed(1)}" x2="${W - PADR}" y2="${gy.toFixed(1)}" stroke="${GRID}" stroke-width="1"/>`,
      `<text x="${PADL - 4}" y="${(gy + 3).toFixed(1)}" font-size="9" fill="${INK_MUTED}" text-anchor="end">${Math.round(maxPts * frac)}</text>`,
    );
  }
  for (let r = 0; r < rounds; r++) {
    parts.push(
      `<text x="${x(r).toFixed(1)}" y="${H - 6}" font-size="9" fill="${INK_MUTED}" text-anchor="middle">R${r + 1}</text>`,
    );
  }

  // Sort by final points so end labels can be stacked without overlap.
  const ordered = [...series].sort(
    (a, b) => (b.values[b.values.length - 1] ?? 0) - (a.values[a.values.length - 1] ?? 0),
  );
  const labelSlots = ordered.length;
  const labelY = (rank: number) =>
    PADT + 6 + (rank / Math.max(labelSlots - 1, 1)) * (H - PADT - PADB - 10);

  ordered.forEach((s, rank) => {
    const color = colorHex(s.color);
    let d = '';
    s.values.forEach((v, i) => {
      d += `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)} `;
    });
    parts.push(
      `<path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" opacity="0.9">` +
        `<title>${s.name}</title></path>`,
    );
    const endY = labelY(rank);
    const lastY = y(s.values[s.values.length - 1] ?? 0);
    parts.push(
      `<line x1="${(W - PADR).toFixed(1)}" y1="${lastY.toFixed(1)}" x2="${W - PADR + 6}" y2="${endY.toFixed(1)}" stroke="${color}" stroke-width="1" opacity="0.5"/>`,
      `<text x="${W - PADR + 9}" y="${(endY + 3).toFixed(1)}" font-size="9.5" fill="${INK_MUTED}">` +
        `<tspan fill="${color}">■</tspan> ${escapeXml(s.name)} ${s.values[s.values.length - 1] ?? 0}</text>`,
    );
  });

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width', '100%');
  svg.style.background = SURFACE;
  svg.style.borderRadius = '6px';
  svg.innerHTML = parts.join('');
  wrap.appendChild(svg);
  return wrap;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
