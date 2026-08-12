/**
 * DV-T2-T1 §RESULT — THE SECTION GENERATOR (the #229.2 rule, discharged in code).
 *
 * Reads the COMMITTED convergence-exam artifact and emits the whole §RESULT markdown section on
 * stdout. EVERY measured cell in the published section is printed from this file's reads of the
 * artifact — never typed into the doc by hand. The prose captions are literal strings here, so
 * they ride the generator too and cannot drift away from the numbers they sit beside.
 *
 * This script ADJUDICATES NOTHING (#203). It prints the registration's two limbs, the
 * ordered-book share, the curve, the guards and the MECHANICAL fork flags the probe computed.
 * No verdict is composed here.
 *
 *   npx tsx scripts/analysis/dv-t2-t1-exam-result.ts docs/world-model/data/dv-t2-t1-convergence-exam.json
 */

import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

const artifactPath = process.argv[2]
  ?? 'docs/world-model/data/dv-t2-t1-convergence-exam.json';
const A: Any = JSON.parse(readFileSync(artifactPath, 'utf8'));
const R: Any = A.result;

const o = (s = ''): void => { process.stdout.write(`${s}\n`); };
const int = (x: number): string => (Number.isFinite(x) ? x.toLocaleString('en-US') : 'n/a');
const num = (x: number, dp = 4): string => (Number.isFinite(x) ? x.toFixed(dp) : 'n/a');
const pct = (x: number, dp = 3): string => (Number.isFinite(x) ? `${x.toFixed(dp)} %` : 'n/a');
const ciPp = (c: number[], dp = 4): string => `[${num(c[0], dp)}, ${num(c[1], dp)}]`;
const yes = (b: boolean): string => (b ? '✅ YES' : '❌ NO');
const ZONES = ['own', 'middle', 'final'];

const g: Any = R.gates;
const gateNames: string[] = R.frozenGateNames;
const passCount = gateNames.filter((k) => g[k] === true).length;

o('## §RESULT');
o();
o(`**${int(R.design.replicates)} replicates × ${int(R.design.matchesPerReplicate)} matches `
  + `= ${int(R.design.replicates * R.design.matchesPerReplicate)} seeds × 3 arms, `
  + `${int(R.design.books)} books, block `
  + `${int(R.seeds.blocks[3].first)}–${int(R.seeds.blocks[3].last)} — `
  + `${passCount}/${gateNames.length} gates ${passCount === gateNames.length ? 'PASS' : '*** RED ***'}**, `
  + `\`resultSha256\` \`${String(A.resultSha256).slice(0, 8)}…${String(A.resultSha256).slice(-4)}\`, `
  + `G-DET digest \`${String(R.gDet.digestA).slice(0, 8)}…\` twice, `
  + `${int(R.wall.batterySeconds)} s battery wall. Mode: **${R.mode}**. Every number below is `
  + 'printed by `scripts/analysis/dv-t2-t1-exam-result.ts` from the committed artifact; none is '
  + 'typed (#229.2).');
o();
o('### The run');
o();
o('```text');
o(`world            bare production, DOORS SHUT — every door flag checked on ${
  int(R.gWorld.perMatchArmExpected)} arm-matches`);
o(`arms             LEARN-ONLY (the registration) · LEARN+CONSUME (reported) · OFF (anchor)`);
o(`replicate        ONE persistent dvLearnedBooks set across ${
  int(R.design.matchesPerReplicate)} matches; League.startSeason() never fires`);
o(`books            ${int(R.design.books)} (2 per replicate), belief[z] = punished[z]/deliveries[z]`);
o(`threshold        τ = ${R.design.tau} ⇒ ${int(R.registration.limbII.required)} of ${
  int(R.design.books)} books must be strictly ordered`);
o(`estimator        cluster bootstrap by REPLICATE, 2,000 resamples, stats base ${
  int(R.seeds.statsBase)}`);
o('```');
o();

/* ---------------- THE SIZING AS EXECUTED ---------------- */
o('### ⭐ THE N RULE AS EXECUTED (in-probe, from the two committed artifacts)');
o();
const S: Any = R.sizing;
o(`Design delivery rates (the per-cell MINIMUM of census and smoke): **[${
  (S.designDeliveryRates as number[]).join(', ')}]** per team-match. `
  + `Design punish rates — census **[${(S.censusRates as number[]).join(', ')}]** vs smoke **[${
    (S.smokeRates as number[]).join(', ')}]**; the binding source is **${S.bindingSource}**. `
  + `Chain design effect **${num(S.deff, 6)}**, so n_eff at M\\* = **[${
    (S.nEffAtMStar as number[]).map(int).join(', ')}]**.`);
o();
o('| quantity | value |');
o('|---|---:|');
o(`| **M\\*** | **${int(S.mStar)}** |`);
o(`| q per book (census-true) | ${num(S.qPerBook, 6)} |`);
o(`| LIMB (i) power | ${num(S.limbIPower, 6)} |`);
o(`| LIMB (ii) power — CONSERVATIVE (B = R) | ${num(S.limbIIPowerConservative, 6)} |`);
o(`| LIMB (ii) power — independent (B = 2R) | ${num(S.limbIIPowerIndependent, 6)} |`);
o(`| ⭐ CONJUNCTION power | **${num(S.conjunctionPowerConservative, 6)}** |`);
o(`| ⭐ MDE bought (own − middle) | **${num(S.mdeOwnMinusMiddlePp, 4)} pp** |`);
o(`| seed cap | ${int(S.seedCap)} — binds: **${S.seedCapBinds}** |`);
o(`| ordered books required | ${int(S.orderedBooksRequired)} of ${int(R.design.books)} |`);
o();
o('⭐ **G-N** re-derived every row above from the committed artifacts at run time and compared it '
  + 'to the literals frozen in the probe before the battery: '
  + `**${g.gN ? 'identical' : 'MISMATCH'}**.`);
o();

/* ---------------- THE REGISTRATION ---------------- */
const REG: Any = R.registration;
o('### ⭐⭐ THE FIFTH REGISTRATION — SCORED');
o();
o('> ' + REG.verbatim);
o();
o(`**LIMB (i) — THE SET ORDERING: ${yes(REG.limbI.pass)}**`);
o();
o('| zone | replicate-mean book belief | census (T2-C0) |');
o('|---|---:|---:|');
ZONES.forEach((z, i) => {
  o(`| ${z === 'own' ? '⭐ **own third**' : `${z} third`} | **${
    pct(REG.limbI.meanVectorPct[i])}** | ${pct(REG.convergenceReported.censusRatesPct[i])} |`);
});
o();
o('| pair | gap (pp) | CI 95 % (pp) | resolved |');
o('|---|---:|---:|---|');
o(`| ⭐ own − middle | ${num(REG.limbI.gapOwnMinusMiddlePp)} | ${
  ciPp(REG.limbI.ciOwnMinusMiddlePp)} | ${
  REG.limbI.ciOwnMinusMiddlePp[0] > 0 ? '✅ RESOLVED' : '— UNRESOLVED'} |`);
o(`| middle − final | ${num(REG.limbI.gapMiddleMinusFinalPp)} | ${
  ciPp(REG.limbI.ciMiddleMinusFinalPp)} | ${
  REG.limbI.ciMiddleMinusFinalPp[0] > 0 ? '✅ RESOLVED' : '— UNRESOLVED'} |`);
o();
o(`**LIMB (ii) — THE BOOK SHARE: ${yes(REG.limbII.pass)}** — **${
  int(REG.limbII.orderedBooks)} of ${int(REG.limbII.books)} books** strictly ordered = **${
  num(REG.limbII.orderedShare * 100, 2)} %** against the frozen threshold τ = ${
  REG.limbII.threshold} (≥ ${int(REG.limbII.required)} books required).`);
o();
o(`### ⭐⭐ THE CONJUNCTION: ${yes(REG.conjunction)}`);
o();
o('| fork | fired | consequent |');
o('|---|---|---|');
for (const [k, label] of [['fDv2a', 'F-DV2-a'], ['fDv2b', 'F-DV2-b'], ['fDv2c', 'F-DV2-c']]) {
  const f: Any = R.forks[k];
  o(`| **${label}** | ${f.fired ? '⚠ **FIRED**' : 'no'} | ${f.consequent} |`);
}
o();
o('⚠ Mechanical predicate flags only (#203); a fired fork is **still a commit** — the honest '
  + 'result lands and the adjudication is the commander\'s.');
o();
o('**CONVERGENCE DISTANCE — REPORTED, never gated (#246).** Relatives are recomputed from RAW '
  + 'COUNTS on both sides.');
o();
o('| | own | middle | final | L1 vs census |');
o('|---|---:|---:|---:|---:|');
o(`| book relative shape | ${(REG.convergenceReported.bookRelative as number[])
  .map((v: number) => num(v, 5)).join(' | ')} | ${num(REG.convergenceReported.l1RelativeVsCensus, 5)} |`);
o(`| census relative shape | ${(REG.convergenceReported.censusRelative as number[])
  .map((v: number) => num(v, 5)).join(' | ')} | — |`);
o(`| absolute rate gap | | | | ${num(REG.convergenceReported.l1AbsoluteVsCensus, 6)} |`);
o();

/* ---------------- THE CURVE ---------------- */
o('### ⭐ THE LEARNING CURVE — the verdict carries its trajectory');
o();
o('| matches | mean own | mean middle | mean final | own − middle (pp) | ordered books | share | conjunction |');
o('|---:|---:|---:|---:|---:|---:|---:|---|');
for (const c of R.learningCurve.learnOnly as Any[]) {
  o(`| ${int(c.matches)} | ${pct(c.meanVectorPct[0])} | ${pct(c.meanVectorPct[1])} | ${
    pct(c.meanVectorPct[2])} | ${num(c.gapOwnMinusMiddlePp)} | ${int(c.orderedBooks)}/${
    int(c.books)} | ${num(c.orderedShare * 100, 2)} % | ${c.conjunction ? '✅' : '—'} |`);
}
o();

/* ---------------- EVERY BOOK ---------------- */
o('### EVERY BOOK, PUBLISHED (at M, the learn-only arm)');
o();
const perBook: Any[] = (R.learningCurve.learnOnly as Any[])[
  (R.learningCurve.learnOnly as Any[]).length - 1].perBookOrdered;
const cells: Any[] = R.perClusterCells;
const cpLast = (cells[0].learn[0].length - 1);
o('| replicate | side | own | middle | final | strictly ordered |');
o('|---:|---|---:|---:|---:|---|');
for (const b of perBook) {
  const c: Any = cells.find((x: Any) => x.r === b.r).learn[b.side][cpLast];
  const rate = (i: number): string => (c.deliveries[i] > 0
    ? pct((c.punished[i] / c.deliveries[i]) * 100) : 'n/a');
  o(`| ${b.r} | ${b.side === 0 ? 'A' : 'B'} | ${rate(0)} | ${rate(1)} | ${rate(2)} | ${
    b.ordered ? '✅' : '—'} |`);
}
o();
o('*(the raw `(deliveries, punished)` cells behind every row above — and behind every checkpoint '
  + 'of the curve — are stored in the artifact under `perClusterCells`, so every CI re-derives '
  + 'without a re-run: #256.2\'s LOW discharged at source.)*');
o();

/* ---------------- LEARN + CONSUME ---------------- */
const LC: Any = R.learnConsumeReported;
o('### THE LEARN+CONSUME ARM — REPORTED ONLY (it scores nothing)');
o();
o(`Its books at M: mean vector **${(LC.final.meanVectorPct as number[])
  .map((v: number) => pct(v)).join(' · ')}**, ordered books **${int(LC.final.orderedBooks)}/${
  int(LC.final.books)}** (share ${num(LC.final.orderedShare * 100, 2)} %), own − middle **${
  num(LC.final.gapOwnMinusMiddlePp)} pp** ${ciPp(LC.final.ciOwnMinusMiddlePp)}.`);
o();
o('**THE FOOTBALL GUARDS** (tolerance = `NI_FRACTION · |control|`, `NI_FRACTION = 1 − 0.275/0.380`, '
  + 'control = the OFF arm in this battery, deltas paired per seed and bootstrapped by replicate):');
o();
o('| guard | direction | control | tolerance | Δ learn+consume | CI 95 % | resolved | breach |');
o('|---|---|---:|---:|---:|---:|---|---|');
for (const row of LC.guards as Any[]) {
  o(`| \`${row.ruler}\` | ${row.direction} | ${num(row.control, 4)} | ±${num(row.tolerance, 4)} | ${
    num(row.delta, 6)} | ${ciPp(row.ci95, 6)} | ${row.resolved ? 'yes' : 'no'} | ${
    row.breach ? '⚠ **BREACH**' : 'no'} |`);
}
o();
const nullRow: Any[] = LC.guardsLearnOnlyControlCheck;
const nullClean = nullRow.every((r: Any) => r.delta === 0);
o(`⭐ **THE NULL CONTROL**: the LEARN-ONLY arm's own guard row against the same control is `
  + `${nullClean ? '**exactly zero on every ruler**' : '**NOT all zero — see the artifact**'}, `
  + 'which is what a byte-identical world must give and is the guard instrument\'s own liveness '
  + 'check.');
o();
o('**THE FEEDBACK QUESTION** — does consuming the growing belief STARVE or DISTORT the book?');
o();
o('| zone | learn-only deliveries | learn+consume deliveries | ratio | learn-only punished | learn+consume punished |');
o('|---|---:|---:|---:|---:|---:|');
ZONES.forEach((z, i) => {
  o(`| ${z} | ${int(LC.feedback.learnOnlyDeliveries[i])} | ${
    int(LC.feedback.learnConsumeDeliveries[i])} | ${num(LC.feedback.deliveryCountRatio[i], 4)} | ${
    int(LC.feedback.learnOnlyPunished[i])} | ${int(LC.feedback.learnConsumePunished[i])} |`);
});
o();
o(`Delivered mix — learn-only **[${(LC.feedback.learnOnlyMix as number[])
  .map((v: number) => num(v, 4)).join(', ')}]** vs learn+consume **[${
  (LC.feedback.learnConsumeMix as number[]).map((v: number) => num(v, 4)).join(', ')}]**. `
  + 'REPORTED beside the registration; it gates nothing (#203).');
o();

/* ---------------- GATES ---------------- */
o('### Gate table');
o();
o('| gate | result | evidence |');
o('|---|---|---|');
const EV: Record<string, string> = {
  gDet: `digest \`${String(R.gDet.digestA).slice(0, 16)}…\` on both runs`,
  xSrcUntouched: '`git diff --stat -- src` and `git status --porcelain -- src` both empty',
  xFpProd: `observed \`${R.xFpProd.observed}\` = baseline`,
  gWorld: `${int(R.gWorld.perMatchArmOk)}/${int(R.gWorld.perMatchArmExpected)} arm-matches `
    + `satisfy the doors-shut predicate; ${int(R.gWorld.doorKeys.length)} door flags, `
    + `${int(R.gWorld.geneKeysChecked.length)} gene keys, `
    + `${int(R.gWorld.genomeViewsChecked)} genome views on the construction seed`,
  gByteIdentical: `⭐ **${int(R.gByteIdentical.matchesIdentical)}/${
    int(R.gByteIdentical.matchesWalked)}** learn-only matches byte-identical to OFF `
    + `(rng stream inside); sampler-inertness twins ${int(R.gByteIdentical.samplerInertTwins)}/${
      int(R.gByteIdentical.samplerTwinsRun)}`,
  gArms: `${int(Object.keys(R.gArms.truth).length)} conjuncts, `
    + `${int((R.gArms.mutants as Any[]).filter((m: Any) => m.flipped).length)}/${
      int((R.gArms.mutants as Any[]).length)} mutants live`,
  gBooksLive: `${int(R.gBooksLive.booksWithAllThreeZones)}/${int(R.gBooksLive.books)} books have `
    + `all three zones, ${int(R.gBooksLive.booksWithPunishment)}/${int(R.gBooksLive.books)} carry `
    + `punishment; ${int(R.gBooksLive.labelsClosed)} labels closed; min deliveries/zone [${
      (R.gBooksLive.minDeliveriesPerZone as number[]).map(int).join(', ')}]`,
  gBookMath: `${int(R.gBookMath.cellsChecked)} cells re-derived, ${
    int(R.gBookMath.mismatches)} mismatches; strict-tie rejection and raw-count relatives checked`,
  gYardstick: `schema \`${R.gYardstick.schema}\`, window ${R.gYardstick.windowS} s, ordering `
    + `[${(R.gYardstick.orderingRead as string[]).join(', ')}], max relative drift `
    + `${num(R.gYardstick.maxRelativeDrift, 6)}`,
  gN: `the frozen literals ARE the recomputed derivation; M\\* ${int(S.mStar)}, ran at ${
    int(R.gN.ranAtM)}, power ${num(S.conjunctionPowerConservative, 6)} ≥ ${R.design.powerTarget}`,
  gCurve: `${int((R.gCurve.checkpoints as number[]).length)} checkpoints [${
    (R.gCurve.checkpoints as number[]).join(', ')}], ${int(R.gCurve.violations)} monotonicity `
    + 'violations, ends at M',
  gCells: `${int(R.gCells.clustersStored)} clusters stored; the published share (${
    num(R.gCells.publishedShare, 5)}) and mean vector re-derive from the stored cells alone`,
  gValuesUnreachable: `${int(R.gValuesUnreachable.rateNeedles)} rate needles × 5 forms = ${
    int(R.gValuesUnreachable.needleFormsSearched)} strings searched over \`src/**\` — `
    + `${int((R.gValuesUnreachable.valueHits as string[]).length)} value hits, `
    + `${int((R.gValuesUnreachable.nameHits as string[]).length)} name hits, control needle FOUND`,
  gSeed: `${int((R.gSeed.blocks as Any[]).length)} blocks disjoint from the complete ledger and ordered`,
  gStats: `base ${int(R.gStats.base)}, min gap ${int(R.gStats.minGap)}`,
  gCleanInvocation: `overrides present: [${(R.gCleanInvocation.overridesPresent as string[])
    .join(', ') || 'none'}] — the battery band is virgin`,
  gResume: `replicate 0 recomputed from scratch reproduces its checkpointed digest \`${
    String(R.gResume.checkpointDigest).slice(0, 12)}…\` (resumed from checkpoint: ${
    R.gResume.resumedFromCheckpoint})`,
};
for (const k of gateNames) {
  o(`| \`${k}\` | ${g[k] ? '**PASS**' : '❌ **FAIL**'} | ${EV[k] ?? ''} |`);
}
o();
o(`**${passCount}/${gateNames.length}** — and the count is structural: the probe exits 1 before `
  + 'writing anything if the artifact\'s gate-object key set is not exactly the frozen list '
  + '(#250.3(i), thrice-caught, now machine-checked).');
o();
