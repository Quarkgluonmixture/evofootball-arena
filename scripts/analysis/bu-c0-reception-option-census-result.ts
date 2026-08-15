/**
 * BU-C0 §RESULT / §SLICE-ORDER printer — every number in
 * `docs/world-model/BU-C0-RECEPTION-OPTION-CENSUS.md`'s §RESULT is PRINTED BY THIS FILE from the
 * committed artifact, never typed by hand (#229.2).
 *
 * RUN: npx tsx scripts/analysis/bu-c0-reception-option-census-result.ts
 */
import { readFileSync } from 'node:fs';

const PATH = 'docs/world-model/data/bu-c0-reception-option-census.json';
const A = JSON.parse(readFileSync(PATH, 'utf8')) as Record<string, any>;
const f4 = (v: unknown): string => (typeof v === 'number' ? v.toFixed(4) : String(v));
const ci = (r: any): string => (Array.isArray(r.ci95)
  ? `[${f4(r.ci95[0])}, ${f4(r.ci95[1])}]` : String(r.ci95));
const face = (k: string): any => (A.faces as any[]).find((x) => x.face === k);
const row = (k: string): void => {
  const r = face(k);
  if (r === undefined) { console.log(`| ${k} | MISSING |`); return; }
  console.log(`| ${k} | ${r.unit} | ${f4(r.arms.armed.point)} ${ci(r.arms.armed)} (n=${r.arms.armed.den}) `
    + `| ${f4(r.arms.bare.point)} ${ci(r.arms.bare)} (n=${r.arms.bare.den}) `
    + `| ${f4(r.contrast.delta)} ${r.contrast.resolved ? 'RESOLVED' : 'unresolved'} |`);
};

console.log(`resultSha256 ${A.resultSha256}`);
console.log(`gates ${Object.values(A.gates).filter(Boolean).length}/${Object.keys(A.gates).length} `
  + `· mutants ${(A.mutants as any[]).filter((m) => m.live).length}/${(A.mutants as any[]).length} live `
  + `· conjuncts ${A.conjunctTotal}`);
console.log(`run ${JSON.stringify(A.run)}`);
console.log(`gDet ${A.gDetDigests.runA === A.gDetDigests.runB ? 'IDENTICAL' : 'DIFFER'} ${A.gDetDigests.runA}`);
console.log('');
console.log('| face | unit | ARMED (v7) | BARE | armed − bare |');
console.log('|---|---|---|---|---|');
for (const r of A.faces as any[]) row(r.face);

console.log('');
console.log('HISTOGRAM (behind-ball options per reception, k = 0..5+)');
for (const arm of ['armed', 'bare']) {
  const h = A.behindOptionHistogram[arm];
  const share = (xs: number[], d: number): string => xs.map((x) => (x / d).toFixed(4)).join(' · ');
  console.log(`  ${arm} all      ${h.allReceptions.join(' · ')}  (n=${h.denominator})`);
  console.log(`  ${arm} all %    ${share(h.allReceptions, h.denominator)}`);
  console.log(`  ${arm} pressed  ${h.pressedReceptions.join(' · ')}  (n=${h.pressedDenominator})`);
  console.log(`  ${arm} pressed% ${share(h.pressedReceptions, h.pressedDenominator)}`);
}

console.log('');
console.log('TERMINAL CENSUS (open-play spells)');
for (const arm of ['armed', 'bare']) {
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
console.log(`  dose ${JSON.stringify(A.dose.cells)} labels ${A.dose.labels}`);

/* ---- derived from the STORED PER-SEED CELLS (the arithmetic the slice order turns on) ---- */
const sumOver = (arm: string, pick: (c: any) => number): number => (A.perSeedCells[arm] as any[])
  .reduce((a, c) => a + pick(c), 0);
console.log('');
console.log('DERIVED FROM THE STORED CELLS (ladder drop-off, pooled)');
for (const arm of ['armed', 'bare']) {
  const at = (k: string) => sumOver(arm, (c) => c.atRec[k]);
  const pr = (k: string) => sumOver(arm, (c) => c.atRecP[k]);
  const pc = (k: string) => sumOver(arm, (c) => c.atCar[k]);
  const lad = (g: (k: string) => number, label: string): void => {
    const b = g('behind'); const fl = g('behindFlight'); const ra = g('behindRace');
    const un = g('behindUncut');
    console.log(`  ${arm} ${label}: L1 behind ${b} → L2 ball-arrives ${fl} (${(fl / b * 100).toFixed(2)}%) `
      + `→ L3 race won ${ra} (${(ra / fl * 100).toFixed(2)}%) → L4 uncut ${un} (${(un / ra * 100).toFixed(2)}%) `
      + `· end-to-end ${(un / b * 100).toFixed(2)}%`);
  };
  lad(at, 'receptions       ');
  lad(pr, 'pressed receptions');
  lad(pc, 'pressed carrier   ');
  console.log(`  ${arm} in-window share of behind options: `
    + `${(at('behindUncutInWindow') / at('behindUncut') * 100).toFixed(2)}% `
    + `· keeper share ${(at('behindUncutGk') / at('behindUncut') * 100).toFixed(2)}%`);
  console.log(`  ${arm} ahead ladder: L1 ${at('ahead')} → uncut ${at('aheadUncut')} `
    + `(${(at('aheadUncut') / at('ahead') * 100).toFixed(2)}%) · lateral L1 ${at('lateral')} → uncut `
    + `${at('lateralUncut')} (${(at('lateralUncut') / at('lateral') * 100).toFixed(2)}%)`);
}
