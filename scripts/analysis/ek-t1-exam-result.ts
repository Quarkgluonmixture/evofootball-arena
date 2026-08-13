/**
 * EK-T1 §RESULT — THE SECTION GENERATOR (the #229.2 rule, discharged in code).
 *
 * Reads the COMMITTED hold-convergence-exam artifact and emits the whole §RESULT markdown
 * section on stdout. EVERY measured cell in the published section is printed from this file's
 * reads of the artifact — never typed into the doc by hand. The prose captions are literal
 * strings here, so they ride the generator too and cannot drift from the numbers beside them.
 *
 * This script ADJUDICATES NOTHING (#203). It prints the claim's two limbs, the ordered-book
 * share, the curve, the reported consuming arm, the guards and the MECHANICAL fork flags the
 * probe computed. No verdict is composed here.
 *
 *   npx tsx scripts/analysis/ek-t1-exam-result.ts docs/world-model/data/ek-t1-hold-convergence-exam.json
 */
import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

const artifactPath = process.argv[2]
  ?? 'docs/world-model/data/ek-t1-hold-convergence-exam.json';
const A: Any = JSON.parse(readFileSync(artifactPath, 'utf8'));
const R: Any = A.result;
const S: Any = R.sizing;

const o = (s = ''): void => { process.stdout.write(`${s}\n`); };
const int = (x: number): string => (Number.isFinite(x) ? x.toLocaleString('en-US') : 'n/a');
const num = (x: number, dp = 4): string => (Number.isFinite(x) ? x.toFixed(dp) : 'n/a');
const pct = (x: number, dp = 3): string => (Number.isFinite(x) ? `${x.toFixed(dp)} %` : 'n/a');
const ci = (c: number[], dp = 4): string => `[${num(c[0], dp)}, ${num(c[1], dp)}]`;
const yes = (b: boolean): string => (b ? '✅ YES' : '❌ NO');
const BANDS = ['free', 'mid', 'pressed'];

const g: Any = R.gates;
const gateNames: string[] = R.frozenGateNames;
const passCount = gateNames.filter((k) => g[k] === true).length;
const L: Any = R.claim;
const curve: Any[] = R.learningCurve.learnOnly;
const curveV: Any[] = R.learningCurve.learnVeto;
const fin: Any = curve[curve.length - 1];

o('## §RESULT');
o();
o(`**${int(R.design.replicates)} replicates × ${int(R.design.matchesPerReplicate)} matches = `
  + `${int(R.design.replicates * R.design.matchesPerReplicate)} seeds × 3 arms = `
  + `${int(R.design.replicates * R.design.matchesPerReplicate * 3)} walks, `
  + `${int(R.design.books)} books, block ${int(R.seeds.blocks[3].first)}–`
  + `${int(R.seeds.blocks[3].last)} — ${passCount}/${gateNames.length} gates `
  + `${passCount === gateNames.length ? 'PASS' : '*** RED ***'}**, \`resultSha256\` `
  + `\`${String(A.resultSha256).slice(0, 8)}…${String(A.resultSha256).slice(-4)}\`, G-DET digest `
  + `\`${String(R.gDet.digestA).slice(0, 8)}…\` twice. Mode: **${R.mode}**. Every number below is `
  + 'printed by `scripts/analysis/ek-t1-exam-result.ts` from the committed artifact; none is '
  + 'typed (#229.2).');
o();
o('### The run');
o();
o('```text');
o(`world            the DRILL world of record — census flags + armed seat + dosed drills,`);
o(`                 checked on ${int(R.gWorld.perMatchArmExpected)} arm-matches`);
o('arms             LEARN-ONLY (scored) · LEARN+VETO (reported) · OFF (anchor)');
o(`replicate        ONE persistent ekHoldBooks set across ${
  int(R.design.matchesPerReplicate)} matches; League.startSeason() never fires`);
o(`books            ${int(R.design.books)} (2 per replicate), belief[b] = punished[b]/holds[b]`);
o(`threshold        τ = ${R.design.tau} ⇒ ${int(L.limbII.required)} of ${
  int(L.limbII.books)} books must be strictly ordered`);
o(`target shape     free > pressed > mid  (the MEASURED truth, #261.3(ii))`);
o(`labels closed    ${int(R.gBooksLive.labelsClosed)}  (${int(R.gBooksLive.takes)} takes + ${
  int(R.gBooksLive.drills)} drill holds; ${int(R.gBooksLive.unbandedRefusals)} doses REFUSED for`);
o('                 want of a fresh band — the freshness rule, counted not hidden)');
o('```');
o();
o('### ⭐⭐ THE SCORE — H-EK on the sharpened conjunction');
o();
o('| limb | reading | verdict |');
o('|---|---|---|');
o(`| **(i) mean vector** | free **${pct(L.limbI.meanVectorPct[0])}** · mid **${
  pct(L.limbI.meanVectorPct[1])}** · pressed **${pct(L.limbI.meanVectorPct[2])}** — observed `
  + `ordering **${(L.limbI.observedOrdering as string[]).join(' > ')}** | ordered as required: `
  + `${yes(L.limbI.ordered)} |`);
o(`| **(i) gap free − pressed** | **${num(L.limbI.gapFreeMinusPressedPp)} pp**, 95 % CI `
  + `${ci(L.limbI.ciFreeMinusPressedPp)} | resolved above zero: ${
    yes(L.limbI.ciFreeMinusPressedPp[0] > 0)} |`);
o(`| **(i) gap pressed − mid** | **${num(L.limbI.gapPressedMinusMidPp)} pp**, 95 % CI `
  + `${ci(L.limbI.ciPressedMinusMidPp)} | resolved above zero: ${
    yes(L.limbI.ciPressedMinusMidPp[0] > 0)} |`);
o(`| **LIMB (i)** | ordering + BOTH gaps resolved at set grain | **${
  L.limbI.pass ? 'PASS' : 'FAIL'}** |`);
o(`| **LIMB (ii) book share** | **${int(L.limbII.orderedBooks)} / ${int(L.limbII.books)} = `
  + `${pct(L.limbII.orderedShare * 100, 2)}** ordered books vs τ = ${L.limbII.threshold} `
  + `(needs ${int(L.limbII.required)}) | **${L.limbII.pass ? 'PASS' : 'FAIL'}** |`);
o(`| ⭐⭐ **THE CONJUNCTION** | both limbs | **${L.conjunction ? 'POSITIVE' : 'NEGATIVE'}** |`);
o();
o('**The yardstick beside it (REPORTED, never gated — #246):** EK-C0\'s census reads free '
  + `${pct(L.convergenceReported.censusRatesPct[0])} · mid `
  + `${pct(L.convergenceReported.censusRatesPct[1])} · pressed `
  + `${pct(L.convergenceReported.censusRatesPct[2])}; the books' relative vector is `
  + `[${(L.convergenceReported.bookRelative as number[]).map((x: number) => num(x, 4)).join(', ')}] `
  + `against the census's [${(L.convergenceReported.censusRelative as number[])
    .map((x: number) => num(x, 4)).join(', ')}] — L1 absolute `
  + `${num(L.convergenceReported.l1AbsoluteVsCensus, 5)}, L1 relative `
  + `${num(L.convergenceReported.l1RelativeVsCensus, 5)}. The drill world is a GREENHOUSE and its `
  + 'magnitudes are its own.');
o();
o('### ⭐ THE LEARNING CURVE (REPORTED — the verdict carries its trajectory)');
o();
o('| matches | free | mid | pressed | ordering | free − pressed (pp) | pressed − mid (pp) | ordered books | share |');
o('|---:|---:|---:|---:|---|---:|---:|---:|---:|');
for (const c of curve) {
  o(`| ${int(c.matches)} | ${pct(c.meanVectorPct[0])} | ${pct(c.meanVectorPct[1])} | `
    + `${pct(c.meanVectorPct[2])} | ${(c.observedOrdering as string[]).join(' > ')} | `
    + `${num(c.gapFreeMinusPressedPp)} | ${num(c.gapPressedMinusMidPp)} | `
    + `${int(c.orderedBooks)}/${int(c.books)} | ${pct(c.orderedShare * 100, 2)} |`);
}
o();
o('### The ex-ante sizing, as the probe recomputed it');
o();
o('```text');
o(`deff (measured by re-walking EK-T0's committed block ${
  int(S.deffMeasurement.block[0])}–${int(S.deffMeasurement.block[1])})`);
o(`                 ${int(S.deffMeasurement.punishedLabels)} punished labels / ${
  int(S.deffMeasurement.distinctPunishingLosses)} distinct punishing losses = ${num(S.deff, 6)}`);
o(`design hold rates (per team-match, 95 % lower bound)   [${
  (S.designHoldRates as number[]).map((x: number) => num(x, 4)).join(', ')}]`);
o(`census rates (raw counts)                              [${
  (S.censusRates as number[]).map((x: number) => num(x, 6)).join(', ')}]`);
o(`EK-T0 smoke rates (raw counts, NOT ordered)            [${
  (S.smokeRates as number[]).map((x: number) => num(x, 6)).join(', ')}]`);
o(`n_eff at M*                                            [${
  (S.nEffAtMStar as number[]).map(int).join(', ')}]`);
o(`M* = ${int(S.mStar)}   q/book = ${num(S.qPerBook, 6)}   LIMB(i) power = ${
  num(S.limbIPower, 6)}   LIMB(ii) power = ${num(S.limbIIPowerConservative, 6)}`);
o(`conjunction power = ${num(S.conjunctionPowerConservative, 6)} (target ${
  R.design.powerTarget})    MDE = ${num(S.mdeFreeMinusPressedPp, 4)} pp vs census gap ${
  num(S.censusGapFreeMinusPressedPp, 4)} pp`);
o(`power under the EK-T0 smoke rate vector = ${num(S.powerUnderSmokeRates, 6)}  (that vector is not ordered)`);
o(`caps: seed ${int(S.seedCap)} (binds: ${S.seedCapBinds}) · wall ${int(S.wallCap)} (binds: ${
  S.wallCapBinds})`);
o('```');
o();
o('### ⭐ THE FORKS (mechanical predicate flags — #203; a fired fork is STILL A COMMIT)');
o();
o('| fork | fired | the ruling\'s consequent, verbatim |');
o('|---|---|---|');
o(`| **F-EK-a** | ${R.forks.fEkA.fired ? '⚠ **YES**' : 'no'} | *${R.forks.fEkA.consequent}* |`);
o(`| **F-EK-b** | ${R.forks.fEkB.fired ? '⚠ **YES**' : 'no'} | *${R.forks.fEkB.consequent}* |`);
o(`| **F-EK-c** | ${R.forks.fEkC.fired ? '⚠ **YES**' : 'no'} | *${R.forks.fEkC.consequent}* |`);
o();
o(`F-EK-b's frozen reading: ${R.forks.fEkB.predicate} The measured band-CI half-widths are [${
  (fin.bandCiHalfWidthPp as number[]).map((x: number) => num(x, 3)).join(', ')}] pp.`);
o();
o('### ⭐⭐ REPORTED — THE LEARN+VETO ARM (gates nothing, scores nothing)');
o();
const F: Any = R.learnVetoReported.feedback;
o('| reading | learn-only | learn+veto |');
o('|---|---:|---:|');
o(`| holds booked (free / mid / pressed) | ${(F.learnOnlyHolds as number[]).map(int).join(' / ')} | `
  + `${(F.learnVetoHolds as number[]).map(int).join(' / ')} |`);
o(`| punished (free / mid / pressed) | ${(F.learnOnlyPunished as number[]).map(int).join(' / ')} | `
  + `${(F.learnVetoPunished as number[]).map(int).join(' / ')} |`);
o(`| band mix | ${(F.learnOnlyMix as number[]).map((x: number) => num(x, 4)).join(' / ')} | `
  + `${(F.learnVetoMix as number[]).map((x: number) => num(x, 4)).join(' / ')} |`);
o(`| holds total | ${int(F.holdsLearnOnly)} | ${int(F.holdsLearnVeto)} |`);
o(`| mean vector | ${(fin.meanVectorPct as number[]).map((x: number) => pct(x)).join(' · ')} | `
  + `${(curveV[curveV.length - 1].meanVectorPct as number[]).map((x: number) => pct(x)).join(' · ')} |`);
o(`| ordered books | ${int(fin.orderedBooks)}/${int(fin.books)} | ${
  int(curveV[curveV.length - 1].orderedBooks)}/${int(curveV[curveV.length - 1].books)} |`);
o();
o(`**Vetoes served: ${int(F.vetoesServed)}** in the consuming arm, **${
  int(R.gVeto.vetoesServedInLearnOnlyArm)}** in the learn-only arm (the door is shut there). `
  + 'The starvation question is exactly the hold-count ratio above: '
  + `[${(F.holdCountRatio as number[]).map((x: number) => num(x, 4)).join(', ')}] `
  + '(learn+veto ÷ learn-only, per band).');
o();
o('**The football guards, at the banked tolerances** (`NI_FRACTION · |control|`, '
  + 'NI_FRACTION = 1 − 0.275/0.380; deltas vs the OFF arm measured in this battery):');
o();
o('| ruler | direction | control | tolerance | Δ learn+veto | 95 % CI | resolved | breach |');
o('|---|---|---:|---:|---:|---|---|---|');
for (const row of R.learnVetoReported.guards as Any[]) {
  o(`| \`${row.ruler}\` | ${row.direction} | ${num(row.control, 4)} | ${num(row.tolerance, 4)} | `
    + `${num(row.delta, 4)} | ${ci(row.ci95, 4)} | ${row.resolved ? 'yes' : 'no'} | ${
      row.breach ? '⚠ **YES**' : 'no'} |`);
}
o();
const nullCtl = (R.learnVetoReported.guardsLearnOnlyControlCheck as Any[]);
const nullZero = nullCtl.every((r: Any) => r.delta === 0);
o(`⭐ **THE LEARN-ONLY NULL CONTROL**: every guard delta in the byte-identical arm is exactly `
  + `zero — ${yes(nullZero)} (max |Δ| = ${num(Math.max(...nullCtl
    .map((r: Any) => Math.abs(r.delta))), 6)}).`);
o();
o('### Gate table');
o();
o('| gate | result | evidence |');
o('|---|---|---|');
const EV: Record<string, string> = {
  gDet: `digest \`${String(R.gDet.digestA).slice(0, 16)}…\` on both runs`,
  xSrcUntouched: '`git diff --stat -- src` and `git status --porcelain -- src` both EMPTY — '
    + 'instrument-only round',
  xFpProd: `the shipped league fingerprint re-derived in-process: \`${
    String(R.xFpProd.observed).slice(0, 12)}…\``,
  gWorld: `the drill world proved on the never-stepped seed ${
    int(R.gWorld.constructionSeed)} and on ${int(R.gWorld.perMatchArmOk)}/${
    int(R.gWorld.perMatchArmExpected)} arm-matches`,
  gByteIdentical: `${int(R.gByteIdentical.matchesIdentical)}/${
    int(R.gByteIdentical.matchesWalked)} learn-only signatures identical to the learn-off drill `
    + `world (rng stream inside); sampler-inertness twins ${
      int(R.gByteIdentical.samplerInertTwins)}/${int(R.gByteIdentical.samplerTwinsRun)}`,
  gArms: `${int(Object.keys(R.gArms.truth).length)} conjuncts, ${
    int((R.gArms.mutants as Any[]).filter((m: Any) => m.flipped).length)}/${
    int((R.gArms.mutants as Any[]).length)} mutants live, each RE-INVOKING the predicate`,
  gBooksLive: `${int(R.gBooksLive.booksWithAllThreeBands)}/${int(R.gBooksLive.books)} books carry `
    + `all three bands, ${int(R.gBooksLive.booksWithPunishment)}/${int(R.gBooksLive.books)} carry `
    + `punishment; ${int(R.gBooksLive.labelsClosed)} labels closed; min holds/band [${
      (R.gBooksLive.minHoldsPerBand as number[]).map(int).join(', ')}]`,
  gBookMath: `${int(R.gBookMath.cellsChecked)} stored cells re-derived, ${
    int(R.gBookMath.mismatches)} mismatches; strict-tie rejection on BOTH pairs and raw-count `
    + 'relatives checked',
  gYardstick: `schema \`${R.gYardstick.schema}\`, window ${R.gYardstick.windowS} s (= the seam's `
    + `own constant), ordering [${(R.gYardstick.orderingRead as string[]).join(', ')}], max `
    + `relative drift ${num(R.gYardstick.maxRelativeDrift, 6)}`,
  gN: `the frozen literals ARE the recomputed derivation; M\\* ${int(S.mStar)}, ran at R = ${
    int(R.gN.ranAtR)} × M = ${int(R.gN.ranAtM)}, power ${
    num(S.conjunctionPowerConservative, 6)} ≥ ${R.design.powerTarget}`,
  gCurve: `${int((R.gCurve.checkpoints as number[]).length)} checkpoints [${
    (R.gCurve.checkpoints as number[]).join(', ')}], ${int(R.gCurve.violations)} monotonicity `
    + 'violations, ends at M',
  gCells: `${int(R.gCells.clustersStored)} clusters stored; the published share (${
    num(R.gCells.publishedShare, 5)}) and mean vector re-derive from the stored cells alone`,
  gVeto: `NO-SUBSIDY in EVERY arm: ${int(R.gVeto.noSubsidyArmMatches)}/${
    int(R.gVeto.noSubsidyArmMatchesExpected)} arm-matches with every commitment in a `
    + `\`reachesZero\` cell (${int(R.gVeto.distinctCommitmentCellsSeenLive)} distinct commitment cells seen LIVE); veto arithmetic `
    + `re-derived in floats with ${int(R.gVeto.vetoArithmeticMismatches)} mismatches; ${
      int(R.gVeto.vetoesServedInLearnOnlyArm)} vetoes in the learn-only arm`,
  gValuesUnreachable: `${int(R.gValuesUnreachable.rateNeedles)} keyed measured answers → ${
    int(R.gValuesUnreachable.needleFormsSearched)} searchable forms over \`src/**\` — ${
    int((R.gValuesUnreachable.valueHits as string[]).length)} value hits, ${
    int((R.gValuesUnreachable.nameHits as string[]).length)} name hits, control needle FOUND; ${
    int(R.gValuesUnreachable.excludedByFloor)} forms excluded by the declared floor`,
  gSeed: `${int((R.gSeed.blocks as Any[]).length)} blocks disjoint from the complete ledger and `
    + 'ordered',
  gStats: `base ${int(R.gStats.base)}, min gap ${int(R.gStats.minGap)}`,
  gEnvClean: `whitelist [${(R.gEnvClean.whitelist as string[]).join(', ')}], ${
    int((R.gEnvClean.engineDoorsScanned as string[]).length)} ENGINE doors scanned and unset, `
    + `preflight: ${R.gEnvClean.preflight}, out \`${R.gEnvClean.outPath}\``,
  gResume: `replicate 0 recomputed from scratch reproduces its checkpointed digest \`${
    String(R.gResume.checkpointDigest).slice(0, 12)}…\` (resumed from checkpoint: ${
    R.gResume.resumedFromCheckpoint})`,
};
for (const k of gateNames) {
  o(`| \`${k}\` | ${g[k] ? '**PASS**' : '❌ **FAIL**'} | ${EV[k] ?? ''} |`);
}
o();
o(`**${passCount}/${gateNames.length}** — and the count is structural: the probe exits 1 before `
  + "writing anything if the artifact's gate-object key set is not exactly the frozen list "
  + '(#250.3(i)).');
o();
o('### The per-cluster cells');
o();
o(`Every book's raw (holds, punished) cells at every checkpoint are stored in the artifact under `
  + `\`result.perClusterCells\` — ${int(R.gCells.clustersStored)} clusters × 2 books × ${
    int((R.gCurve.checkpoints as number[]).length)} checkpoints × 2 arms — so the headline share `
  + 'and the mean vector re-derive without re-running anything (G-CELLS proves exactly that).');
o();
