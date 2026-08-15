/**
 * BU-T0b RESULT PRINTER (#229.2 — nothing in the stage doc's §RESULT is typed).
 *
 * Reads ONLY the committed artifact `docs/world-model/data/bu-t0b-price-separation.json` and
 * prints every number the stage doc quotes: the frozen ladder's derivation arithmetic, the
 * response curve per face per rung, the gate/mutant tallies and the receipts.
 *
 * ⭐⭐ EVERY ARM EXCEPT lam1 IS A COUNTERFACTUAL WORLD (see the artifact's own
 * `counterfactualWarning`). Nothing printed here is a measurement of the shipped game.
 *
 * RUN: npx tsx scripts/analysis/bu-t0b-price-separation-result.ts
 */
import { readFileSync } from 'node:fs';

const PATH = 'docs/world-model/data/bu-t0b-price-separation.json';
const A = JSON.parse(readFileSync(PATH, 'utf8')) as Record<string, any>;
const f4 = (v: unknown): string => (typeof v === 'number' ? v.toFixed(4) : String(v));
const f6 = (v: unknown): string => (typeof v === 'number' ? v.toFixed(6) : String(v));
const line = (s = ''): void => { process.stdout.write(`${s}\n`); };

line(`${A.stage}`);
line(`resultSha256 ${A.resultSha256}`);
line(`⚠ ${A.counterfactualWarning}`);
line();

line('=== THE LADDER (derived; the battery never changed it) ===');
line(`λ_LIN ${A.ladder.linearity.lambdaLinearityBoundary} (binding zone: `
  + `${A.ladder.linearity.bindingZone}) · max served belief on the ladder `
  + `${A.ladder.linearity.maxServedBeliefOnTheLadder} · max deviation from exact linearity `
  + `${A.ladder.linearity.maxDeviationFromExactLinearity}`);
line(`zoneDifferential@λ=1 ${A.ladder.zoneDifferentialAtLambdaOne} · margin `
  + `${A.ladder.marginPreflight.meanAbsMarginReDerivedFromItsOwnCells} `
  + `(n=${A.ladder.marginPreflight.denominator})`);
line(A.ladder.arithmetic);
line(`λ level-matched ${A.ladder.twoLoudnessAxes.lambdaLevelMatched} · λ differential-matched `
  + `${A.ladder.twoLoudnessAxes.lambdaDifferentialMatched}`);
line(A.ladder.linearity.ceiling);
line();
line('rung          λ            belief(own·mid·fin)              zoneDiff     worst/margin  walked');
for (const r of A.ladder.rungs) {
  line(`${String(r.arm).padEnd(13)} ${String(r.lambda).slice(0, 11).padEnd(12)} `
    + `${r.servedBelief.map((v: number) => f6(v)).join(' · ')}   `
    + `${f6(r.meanPairwiseZoneDifferential)}   `
    + `${f4(r.worstZonePriceAsShareOfTheChoiceMargin).padEnd(9)} ${r.walkedAsItsOwnArm}`);
}
line();

const arms: string[] = Object.keys(A.faces[0].arms);
const dose: string[] = Object.keys(A.faces[0].contrastsVsLambda1);
line('=== THE RESPONSE CURVE — every face, every rung, paired vs λ1 on the same seeds ===');
line(`arms: ${arms.join(' · ')} · N=${A.run.N} seeds × ${A.run.arms} arms = ${A.run.walks} walks`);
line();
let resolvedCount = 0;
let monotoneCount = 0;
for (const f of A.faces) {
  const cells = dose.map((d) => {
    const c = f.contrastsVsLambda1[d];
    if (c.resolved) resolvedCount += 1;
    return `${d} Δ${c.delta >= 0 ? '+' : ''}${f6(c.delta)} [${f6(c.ci95[0])}, ${f6(c.ci95[1])}]`
      + `${c.resolved ? ' ⭐RESOLVED' : ''}`;
  });
  if (f.monotoneResolvedResponse) monotoneCount += 1;
  line(`${f.face}`);
  line(`   λ1 ${f6(f.arms.lam1.point)} · ${arms.slice(1).map((a) => `${a} ${f6(f.arms[a].point)}`).join(' · ')}`);
  line(`   ${cells.join('  |  ')}${f.monotoneResolvedResponse ? '   ⇒ MONOTONE+RESOLVED' : ''}`);
}
line();
line(`⭐ ${resolvedCount} of ${A.faces.length * dose.length} face×rung contrasts RESOLVE · `
  + `${monotoneCount} of ${A.faces.length} faces show a MONOTONE RESOLVED response`);
line();

line('=== TERMINAL CENSUS (open play) — ⚠ every arm carries the L3 veto (levels entangled) ===');
for (const a of arms) {
  const t = A.terminalCensus[a];
  const den = t.openDenominator;
  line(`${a.padEnd(6)} n=${den} · intercepted ${f4(t.openPlay.intercepted / den)} · tackled `
    + `${f4(t.openPlay.tackled / den)} · shot ${f4(t.openPlay.shot / den)} · goal `
    + `${f4(t.openPlay.goal / den)} · outOfPlay ${f4(t.openPlay.outOfPlay / den)} · lostOther `
    + `${f4(t.openPlay.lostOther / den)} · forcedLong ${f4(t.openPlay.forcedLong / den)}`);
}
line();
line('=== GK-SPLIT LADDER (per rung) ===');
for (const a of arms) {
  const l = A.gkSplitLadder[a];
  const outL1 = l.L1 - l.L1gk;
  const outL4 = l.L4 - l.L4gk;
  line(`${a.padEnd(6)} receptions ${l.receptions} · L1 ${l.L1} (outfield ${outL1}) → L4 ${l.L4} `
    + `(outfield ${outL4}) · end-to-end outfield ${f4(outL4 / outL1)} · keeper share of options `
    + `${f4(l.L4gk / l.L4)}`);
}
line();
line('=== RECEIPTS ===');
line(`G-DET runA ${A.gDetDigests.runA} · runB ${A.gDetDigests.runB} · identical `
  + `${A.gDetDigests.runA === A.gDetDigests.runB}`);
line(`non-perturbation controls ${A.perturbCheck.ok}/${A.perturbCheck.total}`);
line(`oracle calls ${A.oracleReceipt.calls} · nulls ${A.oracleReceipt.nulls} · corridor `
  + `${A.oracleReceipt.corridor}`);
line(`Q07 attribution ${f4(A.q07Receipt.attributionShare)} · agreement `
  + `${f4(A.q07Receipt.agreementShare)}`);
line(`faces re-derived FROM THE SERIALIZED ARTIFACT: ${A.faceRederivationFromTheSerializedArtifact.checked} checks, `
  + `${A.faceRederivationFromTheSerializedArtifact.bad} mismatches, `
  + `${A.faceRederivationFromTheSerializedArtifact.cellsRead} cells parsed off disk`);
const gates = Object.entries(A.gates) as [string, boolean][];
line(`gates ${gates.filter(([, v]) => v).length}/${gates.length} PASS · mutants `
  + `${(A.mutants as { live: boolean }[]).filter((m) => m.live).length}/${A.mutants.length} LIVE`);
for (const [k, v] of gates) if (!v) line(`   ⚠ FAIL ${k}`);
