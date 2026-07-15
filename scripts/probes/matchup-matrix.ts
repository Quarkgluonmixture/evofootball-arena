/**
 * Probe: the COUNTER-PLAY MATRIX (N1 — GATING for the post-Stage-3 queue).
 *
 * Question: is today's style diversity ECOLOGICALLY self-sustaining
 * (frequency-dependent payoffs — style A beats B beats C beats A), or is it
 * only budget-forced + mutation drift (nothing in the payoff surface punishes
 * a convergent meta)?
 *
 * Method: evolve 3 independent worlds (the calibrate seeds) 24 generations
 * headless. Snapshot per world: the champion at gen+8 (early era), and at
 * gen+24 the champion plus the two most style-distant top-division clubs
 * (greedy farthest-point in z-normalized STYLE_DIMS space). Round-robin all
 * 12 snapshots — 66 pairs × 24 matches, sides alternated, deterministic
 * seeds — then:
 *   - matrix of score-share (win + draw/2) and mean goal difference,
 *   - DECISIVE edges: |mean GD| > 2·SE (a real strength gap, not match noise),
 *   - triad census over fully-decisive triples: cyclic (A>B>C>A) vs transitive.
 *
 * PRE-REGISTERED reading (the N1 gate, decided before the numbers):
 *   - cyclic ≳10% of decisive triads and style-interpretable ⇒ counters
 *     EXIST — the ecology can sustain diversity on its own; tactical
 *     breadth (N5) is safe to add.
 *   - cyclic ≈0 with a stable dominance order reproduced across seeds ⇒
 *     TRANSITIVE — a dominant strategy exists; build counter-payoffs
 *     (space behind a high line, pace vs press...) BEFORE adding breadth.
 *   - few decisive edges at all ⇒ FLAT — styles barely interact; diversity
 *     is budget/drift-sustained, and the verdict is the same as transitive:
 *     the substrate needs a counter-payoff surface first.
 *
 *   npx tsx scripts/probes/matchup-matrix.ts
 */
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';
import { Match } from '../../src/sim/Match';
import { hashSeed } from '../../src/utils/rng';
import { styleValues, dimStats, nameplates, STYLE_DIMS } from '../../src/evolution/styleSpace';
import type { TeamInfo } from '../../src/sim/types';

const SEEDS = [424242, 991, 20260713];
const EARLY = 8;
const LATE = 24;
const MATCHES_PER_PAIR = 24;
const PROBE_TAG = 778899;

interface Snap {
  label: string;
  seed: number;
  era: string;
  info: TeamInfo;
}

const snaps: Snap[] = [];

const t0 = performance.now();
for (const seed of SEEDS) {
  const fresh = new League({ seed });
  const early = runHeadless(fresh.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration',
    target: fresh.generation + EARLY,
  });
  const lgE = League.fromJSON(early.league as Record<string, unknown>);
  const champE = lgE.history[lgE.history.length - 1].championSlot;
  snaps.push({ label: lgE.franchise(champE).name, seed, era: `g+${EARLY}`, info: lgE.teamInfo(champE) });

  const late = runHeadless(early.league as Record<string, unknown>, {
    kind: 'toGeneration',
    target: lgE.generation + (LATE - EARLY),
  });
  const lgL = League.fromJSON(late.league as Record<string, unknown>);
  const champL = lgL.history[lgL.history.length - 1].championSlot;
  snaps.push({ label: lgL.franchise(champL).name, seed, era: `g+${LATE}`, info: lgL.teamInfo(champL) });

  // The two most style-distant D1 clubs from the late champion, so the
  // matrix holds co-evolved CONTRAST, not three copies of one meta.
  const pop = lgL.franchises.map((f) => styleValues({ genome: f.coach.genome, policy: f.coach.policy }));
  const stats = dimStats(pop);
  const z = (v: number[]): number[] => v.map((x, i) => (stats[i].std > 1e-9 ? (x - stats[i].mean) / stats[i].std : 0));
  const dist = (a: number[], b: number[]): number => Math.hypot(...a.map((x, i) => x - b[i]));
  const zOf = new Map(lgL.franchises.map((f) => [f.slot, z(styleValues({ genome: f.coach.genome, policy: f.coach.policy }))]));
  const picked: number[] = [champL];
  const candidates = lgL.division(0).filter((f) => f.slot !== champL);
  while (picked.length < 3 && candidates.length) {
    let best = -1;
    let bestScore = -1;
    for (const f of candidates) {
      if (picked.includes(f.slot)) continue;
      const score = Math.min(...picked.map((s) => dist(zOf.get(f.slot)!, zOf.get(s)!)));
      if (score > bestScore) { bestScore = score; best = f.slot; }
    }
    if (best < 0) break;
    picked.push(best);
    snaps.push({ label: lgL.franchise(best).name, seed, era: `g+${LATE}`, info: lgL.teamInfo(best) });
  }
  console.log(`seed ${seed}: evolved to gen ${lgL.generation} (${((performance.now() - t0) / 1000).toFixed(1)}s)`);
}

const N = snaps.length;
const plates = nameplates(snaps.map((s) => ({ genome: s.info.genome, policy: s.info.policy })));
console.log(`\n${N} archetype snapshots:`);
snaps.forEach((s, i) => {
  const st = s.info.style as unknown as Record<string, string> | undefined;
  const styleStr = st ? `${st.atk ?? ''}/${st.def ?? ''}/${st.scheme ?? ''}` : '?';
  console.log(
    `  T${String(i).padStart(2, '0')} seed ${String(s.seed).padEnd(8)} ${s.era.padEnd(5)} ` +
    `${s.label.padEnd(18)} [${styleStr}] ${plates[i].join(' ')}`,
  );
});

// ---- round-robin ---------------------------------------------------------
// share[i][j]: i's score-share vs j; gdMean/gdSE from i's perspective.
const share: number[][] = Array.from({ length: N }, () => Array(N).fill(0.5));
const gdMean: number[][] = Array.from({ length: N }, () => Array(N).fill(0));
const gdSE: number[][] = Array.from({ length: N }, () => Array(N).fill(0));
let totalGoals = 0;
let totalMatches = 0;

for (let i = 0; i < N; i++) {
  for (let j = i + 1; j < N; j++) {
    let pts = 0;
    const gds: number[] = [];
    for (let k = 0; k < MATCHES_PER_PAIR; k++) {
      const iIsA = k % 2 === 0;
      const m = new Match({
        seed: hashSeed(PROBE_TAG, i * 100 + j, k),
        teamA: (iIsA ? snaps[i] : snaps[j]).info,
        teamB: (iIsA ? snaps[j] : snaps[i]).info,
      });
      const r = m.runToCompletion();
      const gd = iIsA ? r.score[0] - r.score[1] : r.score[1] - r.score[0];
      gds.push(gd);
      pts += gd > 0 ? 1 : gd === 0 ? 0.5 : 0;
      totalGoals += r.score[0] + r.score[1];
      totalMatches++;
    }
    const mean = gds.reduce((a, b) => a + b, 0) / gds.length;
    const varc = gds.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(gds.length - 1, 1);
    share[i][j] = pts / MATCHES_PER_PAIR;
    share[j][i] = 1 - share[i][j];
    gdMean[i][j] = mean;
    gdMean[j][i] = -mean;
    gdSE[i][j] = gdSE[j][i] = Math.sqrt(varc / gds.length);
  }
  console.log(`row T${String(i).padStart(2, '0')} done (${((performance.now() - t0) / 1000).toFixed(1)}s)`);
}
console.log(`\ngoals/match across the matrix: ${(totalGoals / totalMatches).toFixed(2)} (calibrate band ~2.3-3.0)`);

// ---- matrix print --------------------------------------------------------
const head = ['      ', ...Array.from({ length: N }, (_, j) => ` T${String(j).padStart(2, '0')}`)].join('');
console.log(`\nscore-share matrix (row vs column; * = decisive |GD|>2SE):\n${head}`);
const decisive = (i: number, j: number): boolean =>
  i !== j && gdSE[i][j] > 1e-9 && Math.abs(gdMean[i][j]) > 2 * gdSE[i][j];
for (let i = 0; i < N; i++) {
  const cells = Array.from({ length: N }, (_, j) =>
    i === j ? '  — ' : `${share[i][j].toFixed(2).slice(1)}${decisive(i, j) ? '*' : ' '}`,
  );
  console.log(`  T${String(i).padStart(2, '0')} ${cells.join('')}`);
}

// ---- dominance + triads --------------------------------------------------
const copeland = snaps.map((_, i) => ({
  i,
  score: snaps.reduce((a, _s, j) => a + (decisive(i, j) ? Math.sign(gdMean[i][j]) : 0), 0),
  shareAvg: snaps.reduce((a, _s, j) => a + (i === j ? 0 : share[i][j]), 0) / (N - 1),
}));
copeland.sort((a, b) => b.score - a.score || b.shareAvg - a.shareAvg);
console.log('\ndominance (Copeland over decisive edges, then avg share):');
for (const c of copeland) {
  console.log(
    `  T${String(c.i).padStart(2, '0')} ${snaps[c.i].label.padEnd(18)} ${snaps[c.i].era.padEnd(5)} ` +
    `decisive ±${String(c.score).padStart(3)}  avg share ${c.shareAvg.toFixed(3)}  ${plates[c.i].join(' ')}`,
  );
}

let cyclic = 0;
let transitive = 0;
let partial = 0;
const cycles: string[] = [];
for (let a = 0; a < N; a++) {
  for (let b = a + 1; b < N; b++) {
    for (let c = b + 1; c < N; c++) {
      const edges = [[a, b], [b, c], [a, c]];
      if (!edges.every(([x, y]) => decisive(x, y))) { partial++; continue; }
      const beats = (x: number, y: number): boolean => gdMean[x][y] > 0;
      const wins = [beats(a, b) ? a : b, beats(b, c) ? b : c, beats(a, c) ? a : c];
      const outdeg = new Map<number, number>();
      for (const w of wins) outdeg.set(w, (outdeg.get(w) ?? 0) + 1);
      if (Math.max(...outdeg.values()) === 2) transitive++;
      else {
        cyclic++;
        const [x, y, zz] = beats(a, b) ? [a, b, c] : [b, a, c];
        cycles.push(`T${x}>T${y}>T${zz}>T${x}`);
      }
    }
  }
}
const totalTriads = cyclic + transitive + partial;
const decidedTriads = cyclic + transitive;
console.log(`\ntriads: ${totalTriads} total — ${decidedTriads} fully decisive ` +
  `(${cyclic} CYCLIC / ${transitive} transitive), ${partial} with even edges`);
if (cycles.length) console.log(`  cycles: ${cycles.slice(0, 12).join('  ')}${cycles.length > 12 ? ' …' : ''}`);
const decisiveEdges = snaps.reduce((a, _s, i) => a + snaps.filter((_t, j) => j > i && decisive(i, j)).length, 0);
console.log(`decisive edges: ${decisiveEdges}/${(N * (N - 1)) / 2}`);

// era check: does late simply out-evolve early (arms race), or do eras trade?
let lateVsEarly = 0;
let lveCount = 0;
for (let i = 0; i < N; i++) {
  for (let j = 0; j < N; j++) {
    if (i === j || snaps[i].era === snaps[j].era) continue;
    if (snaps[i].era === `g+${LATE}` && snaps[j].era === `g+${EARLY}`) { lateVsEarly += share[i][j]; lveCount++; }
  }
}
console.log(`late-era avg share vs early-era: ${(lateVsEarly / Math.max(lveCount, 1)).toFixed(3)} (0.5 = eras trade evenly)`);

// ---- dominance anatomy ---------------------------------------------------
// If the matrix is transitive, WHAT wins? Correlate each style dim with avg
// score-share across the snapshots — the top |r| dims name the meta, and the
// counter-payoff work knows what it must price.
const shares = snaps.map((_, i) => copeland.find((c) => c.i === i)!.shareAvg);
const vecs = snaps.map((s) => styleValues({ genome: s.info.genome, policy: s.info.policy }));
const snapStats = dimStats(vecs);
const corr = STYLE_DIMS.map((d, k) => {
  const xs = vecs.map((v) => v[k]);
  const mx = xs.reduce((a, b) => a + b, 0) / N;
  const my = shares.reduce((a, b) => a + b, 0) / N;
  const sx = Math.sqrt(xs.reduce((a, x) => a + (x - mx) ** 2, 0));
  const sy = Math.sqrt(shares.reduce((a, y) => a + (y - my) ** 2, 0));
  const r = sx > 1e-9 && sy > 1e-9
    ? xs.reduce((a, x, i2) => a + (x - mx) * (shares[i2] - my), 0) / (sx * sy)
    : 0;
  return { key: d.key, kind: d.kind, theme: d.theme, r, spread: snapStats[k].std / d.scale };
});
corr.sort((a, b) => Math.abs(b.r) - Math.abs(a.r));
console.log('\nwhat wins — style dims vs avg share (n=12, |r|>0.4 is signal):');
for (const c of corr.slice(0, 10)) {
  console.log(
    `  ${c.r >= 0 ? '+' : '−'}${Math.abs(c.r).toFixed(2)}  ${c.key.padEnd(16)} ` +
    `(${c.kind}/${c.theme}, pop spread ${(c.spread * 100).toFixed(0)}%)`,
  );
}

console.log(`\nverdict inputs — cyclic/decided ${decidedTriads ? (cyclic / decidedTriads * 100).toFixed(1) : '—'}%, ` +
  `decisive-edge rate ${(decisiveEdges / ((N * (N - 1)) / 2) * 100).toFixed(0)}%`);
console.log(`total ${((performance.now() - t0) / 1000).toFixed(1)}s`);
