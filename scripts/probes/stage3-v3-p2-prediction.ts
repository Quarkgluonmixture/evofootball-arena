// STAGE III V3-P2 — THE EX-ANTE PREDICTION, RE-COMPUTED (§4.1 / §7, ruling #71.2)
//
// The freeze committed a PROVISIONAL deviation share (§4: 53.84% of in-power moments)
// against a FLAT pooled control anchor (−0.0556), because the census serialized only the
// per-(context × role) cells and not the control level. The control-recovery pass (§4)
// now supplies signed(control) per (context × role). This script RE-COMPUTES the ex-ante
// prediction against that per-(context × role) recovered control — the ONE pre-registered
// refinement (#71.2) — and reports the delta from the provisional. The v3 chooser has NO
// going-bit, so the argmax per (context × role) is DETERMINISTIC (no Monte-Carlo): each
// role's column argmaxes to exactly one candidate, and it deviates iff that candidate's
// NEUTRAL value beats the recovered control. The §2 argmax / divergence picture is
// control-INDEPENDENT and stays frozen — this pass only refines the deviation SHARE
// (which argmaxes beat control). It also runs the #65 checkpoint: the predicted deviation
// RATE vs the 0.22 DEV floor, ex ante, on the perceived-attainable population. Read-only;
// forks nothing; consumes only the committed table + the recovery. No payoff datum touched.
import { readFileSync, writeFileSync } from 'node:fs';

const TABLE_PATH = 'docs/world-model/data/stage3-v3-p1-role-census-table.json';
const CONTROL_PATH = process.env.V3P2_CONTROL_PATH
  ?? 'docs/world-model/data/stage3-v3-p2-control-recovery.json';
const OUT_PATH = process.env.V3P2_PRED_OUT
  ?? 'docs/world-model/data/stage3-v3-p2-prediction.json';
const CELL_FLOOR = 150;
const DEV_FLOOR = 0.22;
const NEUTRAL_W = 0.5;                  // §3.4: V(x) = 0.5·value at neutral
const round = (v: number, dp = 6): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);

const ROLE_AXIS = ['DF', 'MF', 'WG', 'ST'] as const;
type Role = (typeof ROLE_AXIS)[number];
const RADII = [7, 14, 21] as const;
const ANGLES = [0, 60, 120, 180, 240, 300] as const;
const CANDS: string[] = [];
for (const r of RADII) for (const a of ANGLES) CANDS.push(`r${r}a${a}`);

interface Cell { n: number; value: number; momentN: number; underPowered?: boolean }
const raw = JSON.parse(readFileSync(TABLE_PATH, 'utf8')) as {
  tableSha: string;
  table: Record<string, Record<Role, Record<string, Cell>>>;
  primary: { bhResolved: number };
};
const rec = JSON.parse(readFileSync(CONTROL_PATH, 'utf8')) as {
  control: Record<string, Record<Role, { value: number; n: number }>>;
  pooledControl: number; guard: { pass: boolean }; verdict: string; sha256: string;
};
const CONTEXTS = Object.keys(raw.table);

// the provisional (freeze §4) — the flat-pooled-anchor deviation shares, for the delta.
const PROVISIONAL = {
  anchor: -0.0556,
  pooled: 0.5384,
  byRole: { DF: 0.573, MF: 0.565, WG: 0.520, ST: 0.513 } as Record<Role, number>,
};

/** the in-power candidates of a (context, role): cell present, n ≥ floor, not under-powered. */
const inPowerCands = (ctx: string, role: Role): string[] => {
  const col = raw.table[ctx][role];
  return CANDS.filter((c) => {
    const cell = col[c];
    return cell !== undefined && cell.n >= CELL_FLOOR && cell.underPowered !== true;
  });
};
/** the (context, role) moment count (the #24 floor quantity; shared across its cells). */
const momentNOf = (ctx: string, role: Role): number => {
  const col = raw.table[ctx][role];
  const anyCell = CANDS.map((c) => col[c]).find((c) => c !== undefined);
  return anyCell ? anyCell.momentN : 0;
};

// --- §2 the per-role argmax per context (CONTROL-INDEPENDENT, frozen) ---------
interface RoleArgmax { role: Role; cand: string | null; value: number; inPower: boolean; momentN: number }
const argmaxTable: Record<string, RoleArgmax[]> = {};
for (const ctx of CONTEXTS) {
  argmaxTable[ctx] = ROLE_AXIS.map((role) => {
    const elig = inPowerCands(ctx, role);
    const momentN = momentNOf(ctx, role);
    if (elig.length === 0) return { role, cand: null, value: Number.NaN, inPower: false, momentN };
    let best = elig[0]; let bestV = raw.table[ctx][role][best].value;
    for (const c of elig) { const v = raw.table[ctx][role][c].value; if (v > bestV) { best = c; bestV = v; } }
    return { role, cand: best, value: round(bestV), inPower: true, momentN };
  });
}

// --- §2.2 the deviation-divergence rate (moment-weighted, in-power roles) -----
let divergentMoments = 0; let totalInPowerMoments = 0;
const distinctHist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
for (const ctx of CONTEXTS) {
  const inPow = argmaxTable[ctx].filter((a) => a.inPower);
  const ctxMoments = inPow.reduce((s, a) => s + a.momentN, 0);
  totalInPowerMoments += ctxMoments;
  const distinct = new Set(inPow.map((a) => a.cand)).size;
  distinctHist[distinct] = (distinctHist[distinct] ?? 0) + ctxMoments;
  if (distinct >= 2) divergentMoments += ctxMoments;
}
const divergenceTexture = {
  predictedDeviationDivergenceRate: round(divergentMoments / (totalInPowerMoments || 1), 4),
  totalInPowerMoments, divergentMoments,
  distinctArgmaxShare: Object.fromEntries(Object.entries(distinctHist).map(([k, v]) => [k, round(v / (totalInPowerMoments || 1), 4)])),
};

// --- §4.1 the deviation SHARE, refined vs the recovered per-(context × role) control ---
const roleDev: Record<Role, { devMoments: number; totalMoments: number; ateNum: number; attNum: number; attDen: number }> =
  Object.fromEntries(ROLE_AXIS.map((r) => [r, { devMoments: 0, totalMoments: 0, ateNum: 0, attNum: 0, attDen: 0 }])) as any;
let pooledDev = 0; let pooledTotal = 0; let pooledAteNum = 0; let pooledAttNum = 0; let pooledAttDen = 0;
for (const ctx of CONTEXTS) {
  for (const a of argmaxTable[ctx]) {
    if (!a.inPower || a.cand === null) continue;
    const ctrl = rec.control[ctx]?.[a.role];
    const controlValue = ctrl && Number.isFinite(ctrl.value) ? ctrl.value : Number.NaN;
    const advantage = NEUTRAL_W * (a.value - controlValue);   // §3.4 neutral advantage
    const deviate = Number.isFinite(advantage) && advantage > 0;
    const w = a.momentN;
    const rd = roleDev[a.role];
    rd.totalMoments += w; pooledTotal += w;
    if (deviate) {
      rd.devMoments += w; pooledDev += w;
      rd.ateNum += w * advantage; pooledAteNum += w * advantage;
      rd.attNum += w * advantage; rd.attDen += w; pooledAttNum += w * advantage; pooledAttDen += w;
    }
  }
}
const perRole = Object.fromEntries(ROLE_AXIS.map((r) => {
  const rd = roleDev[r];
  return [r, {
    deviationShare: round(rd.devMoments / (rd.totalMoments || 1), 4),
    inPowerMoments: rd.totalMoments,
    ateValueAxis: round(rd.ateNum / (rd.totalMoments || 1), 4),
    attValueAxis: round(rd.attDen === 0 ? Number.NaN : rd.attNum / rd.attDen, 4),
    deltaVsProvisional: round(rd.devMoments / (rd.totalMoments || 1) - PROVISIONAL.byRole[r], 4),
  }];
})) as Record<Role, any>;
const pooled = {
  deviationShare: round(pooledDev / (pooledTotal || 1), 4),
  inPowerMoments: pooledTotal,
  ateValueAxis: round(pooledAteNum / (pooledTotal || 1), 4),
  attValueAxis: round(pooledAttDen === 0 ? Number.NaN : pooledAttNum / pooledAttDen, 4),
};

const delta = {
  pooledDeviationShare: round(pooled.deviationShare - PROVISIONAL.pooled, 4),
  note: 'refined per-(context × role) recovered control MINUS the flat-pooled provisional (§4).',
};

// --- §7 the #65 checkpoint: predicted NEUTRAL deviation share ≥ 0.22 (ex ante) --
const check65 = {
  floor: DEV_FLOOR,
  predictedDeviationShare: pooled.deviationShare,
  perRole: Object.fromEntries(ROLE_AXIS.map((r) => [r, perRole[r].deviationShare])),
  pass: pooled.deviationShare >= DEV_FLOOR,
  note: 'ruling #84.1: the FROZEN §7 checkpoint binds the POOLED ex-ante deviation share ONLY '
    + '(the freeze text is singular); the script\'s prior "pooled AND every role" AND-clause was an '
    + 'unauthorized strictening, CORRECTED to the frozen pooled form. The per-role split is REPORTED '
    + '(perRole above), exactly as the freeze\'s parenthetical texture — the WG thin stratum (10.6%) '
    + 'banked ex ante as division of labour expressed as silence (#84.2), not a checkpoint failure. '
    + 'A pooled FAIL fires reading (d) at BUILD and the payoff run does NOT start (#29.5).',
};

const output = {
  experiment: 'STAGE3-V3-P2 (the ex-ante prediction, re-computed against recovered control)',
  authority: 'STAGE3-V3-P2-ROLE-CONSUMER §4.1/§7 · rulings #71.2 / #83',
  consumedTableSha: raw.tableSha,
  controlRecoveryVerdict: rec.verdict, controlGuardPass: rec.guard.pass,
  controlRecoverySha: rec.sha256, pooledControlRecovered: rec.pooledControl,
  bhResolvedCells: raw.primary.bhResolved,
  divergenceTexture_2_2: divergenceTexture,
  provisional_flatAnchor: PROVISIONAL,
  refined_perRole: perRole,
  refined_pooled: pooled,
  delta_refinedMinusProvisional: delta,
  checkpoint65: check65,
  perRoleArgmax_2_1: Object.fromEntries(CONTEXTS.map((ctx) => [ctx, argmaxTable[ctx].map((a) => ({ role: a.role, cand: a.cand, value: a.value }))])),
};
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

console.error(
  `V3-P2 PREDICTION (recovered per-(context × role) control)`
  + ` · divergenceRate ${divergenceTexture.predictedDeviationDivergenceRate} (in-power moments ${totalInPowerMoments}; distinct 2/${divergenceTexture.distinctArgmaxShare[2]} 3/${divergenceTexture.distinctArgmaxShare[3]} 4/${divergenceTexture.distinctArgmaxShare[4]})`
  + ` · devShare prov ${PROVISIONAL.pooled} → refined ${pooled.deviationShare} (Δ ${delta.pooledDeviationShare})`
  + ` [DF ${perRole.DF.deviationShare} MF ${perRole.MF.deviationShare} WG ${perRole.WG.deviationShare} ST ${perRole.ST.deviationShare}]`
  + ` · ATE ${pooled.ateValueAxis} ATT ${pooled.attValueAxis}`
  + ` · #65 floor ${DEV_FLOOR} PASS ${check65.pass}`
  + ` · guardPass ${rec.guard.pass}`,
);
