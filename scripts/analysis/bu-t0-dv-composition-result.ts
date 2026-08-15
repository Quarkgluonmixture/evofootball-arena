/**
 * BU-T0 §RESULT printer — every number in `docs/world-model/BU-T0-DV-COMPOSITION.md`'s §RESULT
 * is PRINTED BY THIS FILE from the committed artifact, never typed by hand (#229.2).
 *
 * RUN: npx tsx scripts/analysis/bu-t0-dv-composition-result.ts
 */
import { readFileSync } from 'node:fs';

const PATH = process.env.BUT0_RESULT_PATH ?? 'docs/world-model/data/bu-t0-dv-composition.json';
const A = JSON.parse(readFileSync(PATH, 'utf8')) as Record<string, any>;
const ARMS = ['v7', 'v7dv'] as const;
const f4 = (v: unknown): string => (typeof v === 'number' ? v.toFixed(4) : String(v));
const pct = (n: number, d: number): string => (d === 0 ? 'UNMEASURED' : `${(n / d * 100).toFixed(2)}%`);
const ci = (r: any): string => (Array.isArray(r.ci95)
  ? `[${f4(r.ci95[0])}, ${f4(r.ci95[1])}]` : String(r.ci95));
const face = (k: string): any => (A.faces as any[]).find((x) => x.face === k);
const row = (k: string): void => {
  const r = face(k);
  if (r === undefined) { console.log(`| ${k} | MISSING |`); return; }
  console.log(`| ${k} | ${r.unit} | ${f4(r.arms.v7.point)} ${ci(r.arms.v7)} (n=${r.arms.v7.den}) `
    + `| ${f4(r.arms.v7dv.point)} ${ci(r.arms.v7dv)} (n=${r.arms.v7dv.den}) `
    + `| ${f4(r.contrast.delta)} ${ci(r.contrast)} ${r.contrast.resolved ? 'RESOLVED' : 'unresolved'} |`);
};

console.log(`resultSha256 ${A.resultSha256}`);
console.log(`gates ${Object.values(A.gates).filter(Boolean).length}/${Object.keys(A.gates).length} `
  + `· mutants ${(A.mutants as any[]).filter((m) => m.live).length}/${(A.mutants as any[]).length} live `
  + `· conjuncts ${A.conjunctTotal}`);
console.log(`run ${JSON.stringify(A.run)}`);
console.log(`gDet ${A.gDetDigests.runA === A.gDetDigests.runB ? 'IDENTICAL' : 'DIFFER'} ${A.gDetDigests.runA}`);

/* ---- ⭐ THE ORDER OF PROOF, STEP 1 ---- */
const L = A.armingLifecycle;
console.log('');
console.log('⭐⭐ THE #269.2(iv) ARMING-LIFECYCLE PROOF');
console.log(`  matrix: ${L.matrix.cells} cells (${L.matrix.firingCells} where a knock CAN fire, `
  + `${L.matrix.nonFiringCells} where it cannot) over seeds ${JSON.stringify(L.matrix.seeds)}`);
console.log(`  firing half   : ${JSON.stringify(L.matrix.firingHalfTotals)}`);
console.log(`  non-firing half: ${JSON.stringify(L.matrix.nonFiringHalfTotals)}`);
console.log(`  battery       : ${JSON.stringify(L.battery)}`);
console.log(`  structure     : ${JSON.stringify(L.structure)}`);
console.log(`  offenders     : ${JSON.stringify(L.matrix.offenders)}`);
console.log(`  unconsumed-arming cells: ${L.matrix.cellsHoldingAnUnconsumedArming.length}`);
console.log(`  VERDICT: ${L.verdict}`);
console.log(`  FINDING: ${L.finding}`);

console.log('');
console.log('⭐ THE DOORS MATRIX');
console.log(`  inertness checked: ${JSON.stringify(A.doorsMatrix.inertnessChecked)}`);
console.log(`  inertness failures: ${JSON.stringify(A.doorsMatrix.inertnessFailures)}`);
console.log(`  liveness: ${JSON.stringify(A.doorsMatrix.liveness)}`);

console.log('');
console.log('| face | unit | v7 (base) | v7+DV (slice) | slice − base |');
console.log('|---|---|---|---|---|');
for (const r of A.faces as any[]) row(r.face);

console.log('');
console.log('⭐ THE GK-SPLIT LADDER (#286\'s new canon; pooled over the arm\'s receptions)');
for (const arm of ARMS) {
  const g = A.gkSplitLadder[arm];
  const of = (k: string) => g[k] - g[`${k}gk`];
  console.log(`  ${arm} GK-INCLUSIVE: L1 ${g.L1} → L2 ${g.L2} (${pct(g.L2, g.L1)}) → L3 ${g.L3} `
    + `(${pct(g.L3, g.L2)}) → L4 ${g.L4} (${pct(g.L4, g.L3)}) · end-to-end ${pct(g.L4, g.L1)}`);
  console.log(`  ${arm} OUTFIELD    : L1 ${of('L1')} → L2 ${of('L2')} (${pct(of('L2'), of('L1'))}) `
    + `→ L3 ${of('L3')} (${pct(of('L3'), of('L2'))}) → L4 ${of('L4')} (${pct(of('L4'), of('L3'))}) `
    + `· end-to-end ${pct(of('L4'), of('L1'))}`);
  console.log(`  ${arm} GK ONLY     : L1 ${g.L1gk} → L2 ${g.L2gk} (${pct(g.L2gk, g.L1gk)}) → L3 `
    + `${g.L3gk} (${pct(g.L3gk, g.L2gk)}) → L4 ${g.L4gk} (${pct(g.L4gk, g.L3gk)}) · end-to-end `
    + `${pct(g.L4gk, g.L1gk)} · keeper share of survivors ${pct(g.L4gk, g.L4)}`);
  const lostRange = of('L1') - of('L2');
  const lostRace = of('L2') - of('L3');
  const lostLane = of('L3') - of('L4');
  const lostAll = lostRange + lostRace + lostLane;
  console.log(`  ${arm} OUTFIELD LOSS SPLIT: range ${lostRange} (${pct(lostRange, lostAll)}) · `
    + `race ${lostRace} (${pct(lostRace, lostAll)}) · ⭐ LANE ${lostLane} (${pct(lostLane, lostAll)})`);
}

console.log('');
console.log('HISTOGRAM (behind-ball options per reception, k = 0..5+)');
for (const arm of ARMS) {
  const h = A.behindOptionHistogram[arm];
  const share = (xs: number[], d: number): string => xs.map((x) => (x / d).toFixed(4)).join(' · ');
  console.log(`  ${arm} all      ${h.allReceptions.join(' · ')}  (n=${h.denominator})`);
  console.log(`  ${arm} all %    ${share(h.allReceptions, h.denominator)}`);
  console.log(`  ${arm} pressed% ${share(h.pressedReceptions, h.pressedDenominator)} (n=${h.pressedDenominator})`);
}

console.log('');
console.log('TERMINAL CENSUS (open-play spells) — ⚠ BOTH arms carry the L3 veto, so the CONTRAST');
console.log('is entanglement-free; the LEVELS carry BU-C0 §CORRECTIONS 3\'s ~14.5 pp tackled→intercepted.');
for (const arm of ARMS) {
  const t = A.terminalCensus[arm];
  const d = t.openDenominator;
  console.log(`  ${arm} (n=${d}): ` + Object.entries(t.openPlay)
    .map(([k, v]) => `${k} ${(Number(v) / d * 100).toFixed(2)}%`).join(' · '));
}

console.log('');
console.log('RECEIPTS');
console.log(`  oracle ${JSON.stringify(A.oracleReceipt)}`);
console.log(`  q07 attribution ${A.q07Receipt.attributionShare} · agreement ${A.q07Receipt.agreementShare} `
  + `· completions ${A.q07Receipt.completed}/${A.q07Receipt.engineCompleted}`);
console.log(`  spells ${JSON.stringify(A.spellReceipt)} · hist ${JSON.stringify(A.histReceipt)} `
  + `· perturb ${JSON.stringify(A.perturbCheck)}`);
console.log(`  L3 dose ${JSON.stringify(A.doses.l3.cells)} labels ${A.doses.l3.labels}`);
console.log(`  DV dose ${JSON.stringify(A.doses.dv.cells)} labels ${A.doses.dv.labels} `
  + `belief ${JSON.stringify(A.doses.dv.belief)} zones ${JSON.stringify(A.doses.dv.zones)}`);

/* ---- derived from the STORED PER-SEED CELLS ---- */
const sumOver = (arm: string, pick: (c: any) => number): number => (A.perSeedCells[arm] as any[])
  .reduce((a, c) => a + pick(c), 0);
console.log('');
console.log('DERIVED FROM THE STORED CELLS');
for (const arm of ARMS) {
  const at = (k: string) => sumOver(arm, (c) => c.atRec[k]);
  const pr = (k: string) => sumOver(arm, (c) => c.atRecP[k]);
  console.log(`  ${arm} pressed-reception corridor survival `
    + `${pct(pr('behindUncut'), pr('behindRace'))} vs all-reception `
    + `${pct(at('behindUncut'), at('behindRace'))}`);
  console.log(`  ${arm} in-window share of behind options ${pct(at('behindUncutInWindow'), at('behindUncut'))}`);
  console.log(`  ${arm} ahead ladder L1 ${at('ahead')} → uncut ${at('aheadUncut')} `
    + `(${pct(at('aheadUncut'), at('ahead'))}) · lateral L1 ${at('lateral')} → uncut `
    + `${at('lateralUncut')} (${pct(at('lateralUncut'), at('lateral'))})`);
  console.log(`  ${arm} armings ${sumOver(arm, (c) => c.life.armings)} · knocks fired `
    + `${sumOver(arm, (c) => c.life.touchPasts)} · carry-overs `
    + `${sumOver(arm, (c) => c.life.carryOvers)} · seats ${sumOver(arm, (c) => c.life.seats)}`);
}
