// STAGE III V2-P2 — THE EX-ANTE PREDICTION, RE-COMPUTED (§3.3 / §3.4, ruling #71.2)
//
// The freeze committed a PROVISIONAL prediction (§3.3(b)) against a FLAT pooled
// control anchor (−0.0495), because the census serialized only the going cells and
// not the per-context control level. The control-recovery pass (§2.4a) now supplies
// signed(control) per (context × going-bit). This script RE-COMPUTES the ex-ante
// prediction against that per-context recovered control — the ONE pre-registered
// refinement (§6) — and reports the delta from the provisional. It also runs the
// #65 checkpoint: the predicted deviation RATE vs the 0.22 DEV floor, ex ante, on
// the perceived-attainable denominator. Read-only; forks nothing; consumes only the
// committed table + the recovery. No payoff datum is touched (winner's-curse intact).
import { readFileSync, writeFileSync } from 'node:fs';
import { Rng } from '../../src/utils/rng';

const TABLE_PATH = 'docs/world-model/data/stage3-v2-p1-anticipatory-table.json';
const CONTROL_PATH = process.env.V2P2_CONTROL_PATH
  ?? 'docs/world-model/data/stage3-v2-p2-control-recovery.json';
const OUT_PATH = process.env.V2P2_PRED_OUT
  ?? 'docs/world-model/data/stage3-v2-p2-prediction.json';
const MC_SEED = 70320;                 // §3.3(b) frozen
const MC_DRAWS = 20_000;               // §3.3(b) per context
const CELL_FLOOR = 150;
const DEV_FLOOR = 0.22;
const WEDGE_R = 0.886;                  // §3.4 the perceived-going wedge (smoke W_r)
const round = (v: number, dp = 6): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);

const RADII = [7, 14, 21] as const;
const ANGLES = [0, 60, 120, 180, 240, 300] as const;
const CANDS: string[] = [];
for (const r of RADII) for (const a of ANGLES) CANDS.push(`r${r}a${a}`);

interface Cell { n: number; value: number; underPowered?: boolean }
const raw = JSON.parse(readFileSync(TABLE_PATH, 'utf8')) as {
  tableSha: string;
  coverage: { contextCounts: Record<string, number> };
  table: Record<string, { going0: Record<string, Cell>; going1: Record<string, Cell> }>;
  primaryContrast: { perCell: { context: string; cand: string; point: number; lower: number; upper: number; inPower: boolean }[] };
};
const rec = JSON.parse(readFileSync(CONTROL_PATH, 'utf8')) as {
  control: Record<string, { going0: { value: number }; going1: { value: number } }>;
  pooledControl: number; guard: { pass: boolean }; verdict: string;
};
const CONTEXTS = Object.keys(raw.table);
const ctxCounts = raw.coverage.contextCounts;
const totalMoments = Object.values(ctxCounts).reduce((a, b) => a + b, 0);

const inPower = (ctx: string, cand: string): boolean => {
  const c0 = raw.table[ctx].going0[cand]; const c1 = raw.table[ctx].going1[cand];
  return c0 !== undefined && c1 !== undefined && c0.n >= CELL_FLOOR && c1.n >= CELL_FLOOR
    && c0.underPowered !== true && c1.underPowered !== true;
};
const trueGoingRate = (ctx: string, cand: string): number => {
  const c0 = raw.table[ctx].going0[cand]; const c1 = raw.table[ctx].going1[cand];
  const n = c0.n + c1.n; return n === 0 ? 0 : c1.n / n;
};

/** Monte-Carlo of the NEUTRAL chooser (VALUE axis) against a control provider. */
const monteCarlo = (controlOf: (ctx: string, going: 0 | 1) => number, seedOffset: number) => {
  const rng = new Rng(MC_SEED + seedOffset);
  let wDev = 0; let wAll = 0;               // weighted deviation share
  let ateNum = 0; let attNum = 0; let attDen = 0;
  const angleMix: Record<string, number> = {}; const radiusMix: Record<string, number> = {};
  let ring180 = 0; let ahead0 = 0; let chosenTotal = 0;
  for (const ctx of CONTEXTS) {
    const w = (ctxCounts[ctx] ?? 0) / totalMoments;
    if (w === 0) continue;
    const elig = CANDS.filter((c) => inPower(ctx, c));
    for (let d = 0; d < MC_DRAWS; d++) {
      let bestCand: string | null = null; let bestAdv = 0; let bestValueAdv = 0;
      for (const cand of elig) {
        const bit: 0 | 1 = rng.next() < trueGoingRate(ctx, cand) ? 1 : 0;
        const cell = bit === 1 ? raw.table[ctx].going1[cand] : raw.table[ctx].going0[cand];
        const base = controlOf(ctx, bit);
        if (!Number.isFinite(cell.value) || !Number.isFinite(base)) continue;
        const adv = cell.value - base;               // VALUE axis
        if (bestCand === null || adv > bestAdv) { bestCand = cand; bestAdv = adv; bestValueAdv = adv; }
      }
      wAll += w;
      if (bestCand !== null && bestAdv > 0) {
        wDev += w;
        ateNum += w * bestValueAdv;
        attNum += w * bestValueAdv; attDen += w;
        const mm = /^r(\d+)a(\d+)$/.exec(bestCand)!; const [, r, a] = mm;
        angleMix[a] = (angleMix[a] ?? 0) + w; radiusMix[r] = (radiusMix[r] ?? 0) + w;
        if (a === '180') ring180 += w; if (a === '0') ahead0 += w; chosenTotal += w;
      } else {
        ateNum += 0;                                  // non-deviation contributes 0 (paired)
      }
    }
  }
  return {
    deviationShare: round(wDev / wAll, 4),
    ateValueAxis: round(ateNum / wAll, 4),
    atePointFiveWeight: round(0.5 * (ateNum / wAll), 4),
    attValueAxis: round(attDen === 0 ? Number.NaN : attNum / attDen, 4),
    attPointFiveWeight: round(attDen === 0 ? Number.NaN : 0.5 * (attNum / attDen), 4),
    landing: {
      byAngle: Object.fromEntries(Object.entries(angleMix).map(([k, v]) => [k, round(v / (chosenTotal || 1), 4)])),
      byRadius: Object.fromEntries(Object.entries(radiusMix).map(([k, v]) => [k, round(v / (chosenTotal || 1), 4)])),
      ring180Share: round(ring180 / (chosenTotal || 1), 4),
      ahead0Share: round(ahead0 / (chosenTotal || 1), 4),
    },
  };
};

// provisional anchor (flat pooled −0.0495, the freeze value) vs recovered per-context.
const pooledAnchor = -0.0495;
const provisional = monteCarlo(() => pooledAnchor, 0);
const recoveredPerContext = monteCarlo(
  (ctx, going) => (going === 1 ? rec.control[ctx].going1.value : rec.control[ctx].going0.value), 1);
// a pooled-recovered variant (uses the recovery's ACTUAL pooled level, flat).
const pooledRecovered = monteCarlo(() => rec.pooledControl, 2);

// §3.3(a) the frozen geometry (control-independent): recompute the sign census
// from the committed primaryContrast (the load-bearing prediction, unchanged).
const pc = raw.primaryContrast.perCell.filter((c) => c.inPower);
const negCells = pc.filter((c) => c.upper < 0);
const posCells = pc.filter((c) => c.lower > 0);
const nullCells = pc.filter((c) => c.lower <= 0 && c.upper >= 0);
const median = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.floor((s.length - 1) / 2)] : Number.NaN; };
const behindRing = (id: string) => /a(120|180|240)$/.test(id);
const deadAhead = (id: string) => /a0$/.test(id);
const geometry = {
  resolvedNegative: negCells.length, resolvedPositive: posCells.length, unresolvedNull: nullCells.length,
  negMedianPP: round(median(negCells.map((c) => c.point)) * 100, 2),
  negFloorPP: round(Math.min(...negCells.map((c) => c.point)) * 100, 2),
  negBehindLateral: negCells.filter((c) => behindRing(c.cand)).length,
  posMedianPP: round(median(posCells.map((c) => c.point)) * 100, 2),
  posCeilingPP: round(Math.max(...posCells.map((c) => c.point)) * 100, 2),
  posDeadAhead: posCells.filter((c) => deadAhead(c.cand)).length,
};

// #65 checkpoint: the predicted deviation RATE vs the 0.22 floor, ex ante, on the
// perceived-attainable population. The Monte-Carlo draws TRUE going-bits; the
// perceived rate is the true-keyed share discounted by the wedge only insofar as
// the deviation is going-sensitive (most negatives are going=0 behind-ring,
// wedge-insensitive), so both the true-keyed and a wedge-scaled bound are reported.
const trueKeyedDev = recoveredPerContext.deviationShare;
const check65 = {
  floor: DEV_FLOOR,
  predictedDeviationShareTrueKeyed: trueKeyedDev,
  predictedDeviationSharePerceivedBound: round(trueKeyedDev * WEDGE_R, 4),
  pass: trueKeyedDev * WEDGE_R >= DEV_FLOOR,
  note: 'even the wedge-discounted lower bound (× W_r 0.886) must clear 0.22; PASS ⇒ '
    + 'the payoff run may start (§3.4). A FAIL fires reading (d) at BUILD.',
};

const delta = {
  deviationShare: round(recoveredPerContext.deviationShare - provisional.deviationShare, 4),
  ateValueAxis: round(recoveredPerContext.ateValueAxis - provisional.ateValueAxis, 4),
  attValueAxis: round(recoveredPerContext.attValueAxis - provisional.attValueAxis, 4),
  ring180Share: round(recoveredPerContext.landing.ring180Share - provisional.landing.ring180Share, 4),
  note: 'recovered per-context control MINUS the provisional flat pooled anchor (§3.3(b)).',
};

const output = {
  experiment: 'STAGE3-V2-P2 (the ex-ante prediction, re-computed against recovered control)',
  authority: 'STAGE3-V2-P2-CONSUMER §3.3/§3.4 · ruling #71.2',
  consumedTableSha: raw.tableSha,
  controlRecoveryVerdict: rec.verdict, controlGuardPass: rec.guard.pass, pooledControlRecovered: rec.pooledControl,
  mcSeed: MC_SEED, mcDrawsPerContext: MC_DRAWS,
  frozenGeometry_3_3a: geometry,
  provisional_flatAnchor: provisional,
  recovered_perContext: recoveredPerContext,
  recovered_pooledFlat: pooledRecovered,
  delta_recoveredMinusProvisional: delta,
  checkpoint65: check65,
};
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

console.error(
  `V2-P2 PREDICTION (recovered per-context control)`
  + ` · geometry neg ${geometry.resolvedNegative}/pos ${geometry.resolvedPositive}/null ${geometry.unresolvedNull}`
  + ` (neg median ${geometry.negMedianPP}pp behind ${geometry.negBehindLateral}/${geometry.resolvedNegative};`
  + ` pos median ${geometry.posMedianPP}pp ahead ${geometry.posDeadAhead}/${geometry.resolvedPositive})`
  + ` · devShare prov ${provisional.deviationShare} → recov ${recoveredPerContext.deviationShare} (Δ ${delta.deviationShare})`
  + ` · ATE prov ${provisional.ateValueAxis} → recov ${recoveredPerContext.ateValueAxis} (Δ ${delta.ateValueAxis})`
  + ` · ATT prov ${provisional.attValueAxis} → recov ${recoveredPerContext.attValueAxis}`
  + ` · ring180 prov ${provisional.landing.ring180Share} → recov ${recoveredPerContext.landing.ring180Share}`
  + ` · #65 devTrueKeyed ${check65.predictedDeviationShareTrueKeyed} perceivedBound ${check65.predictedDeviationSharePerceivedBound} floor ${DEV_FLOOR} PASS ${check65.pass}`,
);
