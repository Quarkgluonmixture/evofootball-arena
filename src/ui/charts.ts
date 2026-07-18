import { colorHex, el, escapeHtml } from './dom';

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

/**
 * Stacked share strip (Phase 31): one column per generation, filled by each
 * option's share of the clubs — a tactical identity's evolution story at a
 * glance. Head shows the latest counts as direct labels (no legend); rects
 * carry <title> tooltips so color is never the only channel.
 */
export function stackedShareStrip(
  title: string,
  options: Array<{ label: string; color: string }>,
  counts: Array<Record<string, number>>,
): HTMLDivElement {
  const tile = el('div', 'spark-tile');
  const head = el('div', 'spark-head');
  const latest = counts[counts.length - 1] ?? {};
  head.append(
    el('span', 'g-name', title),
    el('span', 'spark-val', options.map((o) => `${o.label} ${latest[o.label] ?? 0}`).join(' · ')),
  );
  tile.appendChild(head);

  const W = 132;
  const H = 34;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width', '100%');
  if (counts.length >= 1) {
    const cw = (W - 8) / counts.length;
    let inner = '';
    counts.forEach((c, i) => {
      const total = options.reduce((a, o) => a + (c[o.label] ?? 0), 0) || 1;
      let y = 4;
      for (const o of options) {
        const h = ((c[o.label] ?? 0) / total) * (H - 8);
        if (h > 0.05) {
          inner +=
            `<rect x="${(4 + i * cw).toFixed(1)}" y="${y.toFixed(1)}" ` +
            `width="${Math.max(cw - 0.6, 0.6).toFixed(1)}" height="${h.toFixed(1)}" fill="${o.color}">` +
            `<title>${escapeHtml(o.label)}</title></rect>`;
        }
        y += h;
      }
    });
    svg.innerHTML = inner;
  } else {
    svg.innerHTML = `<text x="4" y="${H - 12}" font-size="9" fill="${INK_MUTED}">need a finished season</text>`;
  }
  tile.appendChild(svg);
  return tile;
}

export interface RadarSeries {
  /** Values in axis order, each in [0, 1]. */
  values: number[];
  /** CSS color for the polygon (identity lives in the caller's chips/labels). */
  color: string;
  name: string;
  /** Filled identity polygon (the subject) vs outline-only context (parents/mean). */
  fill?: boolean;
  dashed?: boolean;
}

/**
 * Gene radar (Phase 32.5): one polygon per series over N fixed axes.
 * Same dataviz rules as the sparklines — recessive rings, 2px strokes, ink
 * labels; identity comes from the caller's header chips, and every axis
 * carries a <title> with the full name + values so color is never the only
 * channel. `highlight` flags axes (mutated genes) with an accent dot.
 */
export function geneRadar(
  axes: Array<{ label: string; title: string }>,
  series: RadarSeries[],
  opts: { size?: number; highlight?: boolean[] } = {},
): HTMLDivElement {
  const S = opts.size ?? 180;
  const cx = S / 2;
  const cy = S / 2;
  const R = S / 2 - 20; // room for the axis labels
  const n = axes.length;
  const angle = (i: number) => -Math.PI / 2 + (i / n) * Math.PI * 2;
  const pt = (i: number, v: number): [number, number] => [
    cx + Math.cos(angle(i)) * R * v,
    cy + Math.sin(angle(i)) * R * v,
  ];

  const parts: string[] = [];
  // Recessive grid: two rings (0.5 / 1.0) + spokes.
  for (const ring of [0.5, 1]) {
    const d = axes.map((_, i) => pt(i, ring).map((c) => c.toFixed(1)).join(',')).join(' ');
    parts.push(`<polygon points="${d}" fill="none" stroke="${GRID}" stroke-width="1"/>`);
  }
  axes.forEach((a, i) => {
    const [x1, y1] = pt(i, 1);
    const hot = opts.highlight?.[i] ?? false;
    parts.push(`<line x1="${cx}" y1="${cy}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${GRID}" stroke-width="1"/>`);
    const [lx, ly] = pt(i, 1 + 11 / R);
    const anchor = Math.abs(Math.cos(angle(i))) < 0.25 ? 'middle' : Math.cos(angle(i)) > 0 ? 'start' : 'end';
    const vals = series.map((s) => `${s.name} ${(s.values[i] ?? 0).toFixed(2)}`).join(' · ');
    parts.push(
      `<text x="${lx.toFixed(1)}" y="${(ly + 3).toFixed(1)}" font-size="8.5" fill="${hot ? '#facc15' : INK_MUTED}" ` +
        `text-anchor="${anchor}"${hot ? ' font-weight="700"' : ''}>${escapeHtml(a.label)}` +
        `<title>${escapeHtml(a.title)} — ${escapeHtml(vals)}</title></text>`,
    );
  });
  for (const s of series) {
    const d = s.values.map((v, i) => pt(i, Math.max(0, Math.min(1, v))).map((c) => c.toFixed(1)).join(',')).join(' ');
    parts.push(
      `<polygon points="${d}" fill="${s.fill ? s.color : 'none'}" fill-opacity="${s.fill ? 0.16 : 0}" ` +
        `stroke="${s.color}" stroke-width="2" stroke-linejoin="round"${s.dashed ? ' stroke-dasharray="4 3"' : ''}>` +
        `<title>${escapeHtml(s.name)}</title></polygon>`,
    );
  }
  // Mutation markers: an accent dot on the SUBJECT polygon's mutated vertices
  // (the last series is the subject — callers draw context first).
  const subject = series[series.length - 1];
  if (subject && opts.highlight) {
    opts.highlight.forEach((hot, i) => {
      if (!hot) return;
      const [x, y] = pt(i, Math.max(0, Math.min(1, subject.values[i] ?? 0)));
      parts.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#facc15" stroke="${SURFACE}" stroke-width="1"/>`);
    });
  }

  const wrap = el('div', 'gene-radar');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${S} ${S}`);
  svg.setAttribute('width', '100%');
  svg.classList.add('radar');
  // East/west labels anchor outward — let them bleed into the card padding
  // instead of being cut at the viewBox edge (long English axis names).
  svg.style.overflow = 'visible';
  svg.innerHTML = parts.join('');
  wrap.appendChild(svg);
  return wrap;
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
        `<tspan fill="${color}">■</tspan> ${escapeHtml(s.name)} ${s.values[s.values.length - 1] ?? 0}</text>`,
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


/**
 * Style-space scatter (Phase 49): the league's clubs plotted on the two
 * dimensions the population disagrees on most (z-scored). Dots wear KIT
 * colors (color follows the entity) with a 2px surface ring and a direct
 * short-name label — identity is never color-alone. Optional trails show
 * each club's drift over recent seasons in its own color at low opacity.
 */
export function styleScatter(
  points: Array<{ x: number; y: number; color: string; label: string; title: string }>,
  axes: { x: string; y: string },
  trails: Array<{ color: string; pts: Array<{ x: number; y: number }> }> = [],
): HTMLDivElement {
  const wrap = el('div', 'style-map');
  wrap.style.maxWidth = '560px';
  const W = 340;
  const H = 260;
  const PAD = 26;
  // z-scores live in roughly ±2.5; clamp so an outlier can't fling the map.
  const cx = (z: number) => W / 2 + Math.max(-2.5, Math.min(2.5, z)) * ((W / 2 - PAD) / 2.5);
  const cy = (z: number) => H / 2 - Math.max(-2.5, Math.min(2.5, z)) * ((H / 2 - PAD) / 2.5);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width', '100%');
  const parts: string[] = [
    `<rect x="0" y="0" width="${W}" height="${H}" rx="8" fill="${SURFACE}"/>`,
    // recessive centre axes: the population mean
    `<line x1="${PAD}" y1="${H / 2}" x2="${W - PAD}" y2="${H / 2}" stroke="${GRID}" stroke-width="1"/>`,
    `<line x1="${W / 2}" y1="${PAD}" x2="${W / 2}" y2="${H - PAD}" stroke="${GRID}" stroke-width="1"/>`,
    `<text x="${W - PAD}" y="${H / 2 - 6}" text-anchor="end" font-size="9" fill="${INK_MUTED}">${escapeHtml(axes.x)} →</text>`,
    `<text x="${W / 2 + 6}" y="${PAD + 4}" font-size="9" fill="${INK_MUTED}">${escapeHtml(axes.y)} ↑</text>`,
  ];
  for (const t of trails) {
    if (t.pts.length < 2) continue;
    const d = t.pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${cx(p.x).toFixed(1)} ${cy(p.y).toFixed(1)}`).join(' ');
    parts.push(`<path d="${d}" fill="none" stroke="${t.color}" stroke-width="1.5" opacity="0.35"/>`);
  }
  for (const p of points) {
    const x = cx(p.x);
    const y = cy(p.y);
    parts.push(
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="${p.color}" stroke="${SURFACE}" stroke-width="2"><title>${escapeHtml(p.title)}</title></circle>`,
      `<text x="${(x + 7).toFixed(1)}" y="${(y + 3).toFixed(1)}" font-size="8" fill="${INK_MUTED}">${escapeHtml(p.label)}</text>`,
    );
  }
  svg.innerHTML = parts.join('');
  wrap.appendChild(svg);
  return wrap;
}

/**
 * Diverging delta bar (Phase 115): deviation from a reference (the league
 * mean) — a center tick, fill growing right (+, up-green) or left (−,
 * down-red). `scale` is the full-deflection magnitude; the exact numbers
 * belong in the caller's text/tooltip (color is never the only channel).
 */
export function deltaBar(delta: number, scale: number): HTMLDivElement {
  const outer = el('div', 'bar delta-bar');
  const tick = el('div', 'delta-tick');
  outer.appendChild(tick);
  const fill = el('div', 'delta-fill');
  const half = Math.min(Math.abs(delta) / scale, 1) * 50;
  fill.style.width = `${half.toFixed(1)}%`;
  fill.style.left = delta >= 0 ? '50%' : `${(50 - half).toFixed(1)}%`;
  fill.style.background = delta >= 0 ? 'var(--up)' : 'var(--down)';
  outer.appendChild(fill);
  return outer;
}

/**
 * Formation diagram (Phase 113.5, 阵型图): a mini pitch with a shape's six
 * spots, attacking left→right. Input is a raw spot table
 * (ATTACK_FORMATIONS / DEFEND_FORMATIONS: local coords, x −45..45 forward,
 * y ±29 wide, index 0 = GK). Dots in the club color; the GK rendered
 * hollow; every dot carries its role in a <title>.
 */
export function formationDiagram(
  title: string,
  spots: ReadonlyArray<{ x: number; y: number }>,
  roles: readonly string[],
  color: string,
): HTMLDivElement {
  const tile = el('div', 'pitch-tile');
  tile.appendChild(el('div', 'g-name', title));
  const W = 132;
  const H = 92;
  const PAD = 5;
  const sx = (x: number) => PAD + ((x + 45) / 90) * (W - PAD * 2);
  const sy = (y: number) => H / 2 + (y / 29) * (H / 2 - PAD);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width', '100%');
  // The pitch furniture — recessive, same grammar as the chart grids.
  const boxW = ((16 / 90) * (W - PAD * 2)).toFixed(1);
  const boxY = (H / 2 - (18 / 29) * (H / 2 - PAD)).toFixed(1);
  const boxH = ((36 / 29) * (H / 2 - PAD)).toFixed(1);
  let inner =
    `<rect x="${PAD}" y="${PAD}" width="${W - PAD * 2}" height="${H - PAD * 2}" rx="4" fill="${SURFACE}" stroke="${GRID}"/>` +
    `<line x1="${W / 2}" y1="${PAD}" x2="${W / 2}" y2="${H - PAD}" stroke="${GRID}"/>` +
    `<circle cx="${W / 2}" cy="${H / 2}" r="9" fill="none" stroke="${GRID}"/>` +
    `<rect x="${PAD}" y="${boxY}" width="${boxW}" height="${boxH}" fill="none" stroke="${GRID}"/>` +
    `<rect x="${(W - PAD - Number(boxW)).toFixed(1)}" y="${boxY}" width="${boxW}" height="${boxH}" fill="none" stroke="${GRID}"/>`;
  spots.forEach((s, i) => {
    const gk = i === 0;
    inner +=
      `<circle cx="${sx(s.x).toFixed(1)}" cy="${sy(s.y).toFixed(1)}" r="4" ` +
      (gk ? `fill="${SURFACE}" stroke="${color}" stroke-width="2"` : `fill="${color}"`) +
      `><title>${escapeHtml(roles[i] ?? '')}</title></circle>`;
  });
  svg.innerHTML = inner;
  tile.appendChild(svg);
  return tile;
}

/**
 * Attribute-allocation heatmap (Phase 49): clubs × attributes, single-hue
 * lightness ramp (sequential = magnitude), 2px cell gaps, <title> tooltips
 * carrying the exact value so color is never the only channel.
 */
export function attrHeatmap(
  rows: Array<{ label: string; cells: number[]; title?: string }>,
  cols: string[],
): HTMLDivElement {
  const wrap = el('div', 'attr-heatmap');
  const CELL = 22;
  const GAP = 2;
  const LABEL_W = 44;
  const HEAD_H = 30;
  const W = LABEL_W + cols.length * (CELL + GAP);
  const H = HEAD_H + rows.length * (CELL + GAP);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('style', `max-width:${W}px`);
  const parts: string[] = [];
  cols.forEach((c, j) => {
    parts.push(
      `<text x="${LABEL_W + j * (CELL + GAP) + CELL / 2}" y="${HEAD_H - 8}" text-anchor="middle" font-size="8" fill="${INK_MUTED}">${escapeHtml(c.slice(0, 3))}</text>`,
    );
  });
  rows.forEach((r, i) => {
    const y = HEAD_H + i * (CELL + GAP);
    parts.push(
      `<text x="${LABEL_W - 6}" y="${y + CELL / 2 + 3}" text-anchor="end" font-size="9" fill="${INK_MUTED}">${escapeHtml(r.label)}</text>`,
    );
    r.cells.forEach((v, j) => {
      const clamped = Math.max(0, Math.min(1, v));
      // single blue hue, dark→light lightness ramp on the dark surface
      const light = 16 + clamped * 46;
      parts.push(
        `<rect x="${LABEL_W + j * (CELL + GAP)}" y="${y}" width="${CELL}" height="${CELL}" rx="3" fill="hsl(213 70% ${light.toFixed(0)}%)"><title>${escapeHtml(`${r.title ?? r.label} · ${cols[j]}: ${v.toFixed(2)}`)}</title></rect>`,
      );
    });
  });
  svg.innerHTML = parts.join('');
  wrap.appendChild(svg);
  return wrap;
}
