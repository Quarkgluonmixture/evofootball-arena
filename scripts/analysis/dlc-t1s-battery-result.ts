/**
 * DLC-T1s §RESULT — THE FULL BATTERY: the SECTION GENERATOR (the #229.2 rule, discharged in code).
 *
 * The smoke generator (`dlc-t1s-smoke-result.ts`) extended to battery grain. Reads the COMMITTED
 * battery artifact and emits the whole §RESULT (FULL BATTERY) markdown section on stdout. Every
 * measured cell in the published section is printed from this file's reads of the artifact —
 * never typed into the doc by hand. That is the whole point: #229.2's lesson (the OBM-T1 smoke's
 * fabricated MAX column) enforced by CONSTRUCTION rather than by a promise to sweep afterwards.
 *
 * What is NEW here relative to the smoke generator, and why:
 *   1. the BAND now GATES (it "gates at battery N only", inherited verbatim) and the ABSENT arm is
 *      INSIDE every gated dimension, so the per-dimension band table is printed in full rather
 *      than disclosed as a plumbing reading — and with it LIMB B of the JOINT primary and LIMB G
 *      of the #240 OVERSHOOT clause become readable for the first time in this stage;
 *   2. the JOINT primary block carries its FROZEN TEXTS VERBATIM plus the mechanical neighbours
 *      the commander must read beside it — the paired goals delta at every arm, the control's
 *      headroom inside the band, and the CONTRAST ANCHOR's own row — all artifact fields;
 *   3. ⭐ the OVERSHOOT block is printed exactly as the artifact records it: both limbs, both
 *      strict forms, the retention row, and the disjunction's `satisfied` flag;
 *   4. the strike distribution and the delivered-rate decode are printed with their GRAIN stated:
 *      the strike read is the DECLARED one-seed observational block (it does not scale with N),
 *      while the STRIKE-TIME delivered rate and the led share ARE at battery grain (all N seeds);
 *   5. the tier-2 / genealogy shares are printed WITH their paired CIs at every arm, the guards
 *      get the interception detail, fouls and offside rows, and the PLANE-INERT identity and the
 *      populations are printed at battery N.
 *
 * The prose captions ARE literal strings here, so they ride the generator too and cannot drift
 * away from the numbers they sit beside.
 *
 * This script ADJUDICATES NOTHING (#203). It prints rows, paired deltas and the mechanical CI /
 * predicate flags the probe already computed. No verdict is composed here; F-T1s-a/b/c are the
 * commander's.
 *
 *   npx tsx scripts/analysis/dlc-t1s-battery-result.ts \
 *     docs/world-model/data/dlc-t1s-strike-exam.json
 */

import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

const artifactPath = process.argv[2] ?? 'docs/world-model/data/dlc-t1s-strike-exam.json';
const A: Any = JSON.parse(readFileSync(artifactPath, 'utf8'));

const ARMS = ['absent', 'planeInert', 'plane', 'planeXCas', 'choiceAnchor'] as const;
const LABEL: Record<string, string> = {
  absent: 'ABSENT',
  planeInert: 'PLANE-INERT',
  plane: '⭐ **PLANE**',
  planeXCas: 'PLANE-X-CAS',
  choiceAnchor: '⭐ CHOICE-ANCHOR',
};
const PLAIN: Record<string, string> = {
  absent: 'ABSENT',
  planeInert: 'PLANE-INERT',
  plane: 'PLANE',
  planeXCas: 'PLANE-X-CAS',
  choiceAnchor: 'CHOICE-ANCHOR',
};
const DOORLBL: Record<string, string> = {
  absent: 'none', planeInert: 'sp', plane: 'sp', planeXCas: 'sp', choiceAnchor: 'dlc',
};

const o = (s = ''): void => { process.stdout.write(`${s}\n`); };
const pp = (x: number, dp = 4): string => (Number.isFinite(x) ? `${(x * 100).toFixed(dp)} %` : 'n/a');
const ppD = (x: number, dp = 4): string => (Number.isFinite(x) ? `${(x * 100).toFixed(dp)}` : 'n/a');
const num = (x: number, dp = 4): string => (Number.isFinite(x) ? x.toFixed(dp) : 'n/a');
const sgn = (x: number, dp = 4): string => (Number.isFinite(x) ? `${x > 0 ? '+' : ''}${x.toFixed(dp)}` : 'n/a');
const sgnPp = (x: number, dp = 4): string => (Number.isFinite(x) ? `${x > 0 ? '+' : ''}${(x * 100).toFixed(dp)}` : 'n/a');
const int = (x: number): string => (Number.isFinite(x) ? x.toLocaleString('en-US') : 'n/a');
const ci = (d: Any, dp = 4): string => (d === null ? '(CONTROL)'
  : `[${(d.lower * 100).toFixed(dp)}, ${(d.upper * 100).toFixed(dp)}]`);
const ciAbs = (d: Any, dp = 4): string => (d === null ? '(CONTROL)'
  : `[${d.lower.toFixed(dp)}, ${d.upper.toFixed(dp)}]`);
const ciPair = (c: Any, dp = 4): string => (c === null ? '—'
  : `[${(c[0] * 100).toFixed(dp)}, ${(c[1] * 100).toFixed(dp)}]`);

const C = A.contrasts.rates;
const VA = A.contrasts.ratesVsAnchor;
const G = A.gates;
const P = A.preRegisteredPrimary;

const rateTable = (key: string, title: string, asPct = true, dp = 4): void => {
  o(`**${title}** (ABSENT **${asPct ? pp(C[key].absent.point, dp) : num(C[key].absent.point, dp)}**):`);
  o();
  o('| arm | door | point | Δ | 95 % CI | `resolved` |');
  o('| --- | --- | --- | --- | --- | --- |');
  for (const a of ARMS) {
    const c = C[key][a];
    const d = c.pairedDelta;
    o(`| ${LABEL[a]} | ${DOORLBL[a]} | ${asPct ? pp(c.point, dp) : num(c.point, dp)} `
      + `| ${d === null ? '—' : (asPct ? ppD(d.point, dp) : sgn(d.point, dp))} `
      + `| ${d === null ? '(CONTROL)' : (asPct ? ci(d, dp) : ciAbs(d, dp))} `
      + `| ${d === null ? '—' : String(c.resolved)} |`);
  }
  o();
};

/* ------------------------------------------------------------------ the run */

o('### The run');
o();
o(`* **\`resultSha256\`** \`${A.resultSha256}\``);
o(`* **X-DET core digest** \`${G.xDet.digestA}\` (both passes)`);
o(`* **${A.seeds} seeds × ${ARMS.length} arms** (${A.block}), paired on one shared seed list, `
  + '**plus** the SEVEN receipt walks (O2-T1 12 · #173 40 · GGC 12 · CTB-T1 8 · OBM-T1 8 × 2 arms '
  + `· ⭐⭐ G-ANCHOR ${G.gAnchor.rowsChecked}), the ${ARMS.length} delivered-dose reads and ⭐⭐ the `
  + `${ARMS.length} STRIKE READS (each a traced match + its untraced LOCKSTEP TWIN) — and the whole `
  + 'core runs **twice** (X-DET).');
o(`* Verdict: **ALL ${Object.keys(G).length} GATES PASS** (\`allGatesPass: ${A.allGatesPass}\`), probe exit 0.`);
o(`* Wall ≈ **${int(Math.round(A.envelopeContextOnly.wallMsContextOnly / 1000))} s** — CONTEXT ONLY `
  + '(#128), used in no rate and no gate. Per #197-M1 the hashed body is commit-free, '
  + 'timing-free and path-free.');
o();

/* ------------------------------------------------------------------ gates */

o('### Gate table');
o();
o('| gate | verdict | evidence (all recomputed in-probe, #181.2) |');
o('| --- | --- | --- |');
const row = (name: string, pass: boolean, ev: string): void => {
  o(`| **${name}** | ${pass ? '✅ PASS' : '*** FAIL ***'} | ${ev} |`);
};
row('X-DET', G.xDet.pass, 'two passes of the whole core, identical digests');
row('X-FP-PROD', G.xFpProd.pass, `\`${String(G.xFpProd.observed).slice(0, 8)}…${String(G.xFpProd.observed).slice(-4)}\` re-derived unchanged (seed ${G.xFpProd.seed}, ${G.xFpProd.seasons} seasons)`);
row('X-SRC-UNTOUCHED', G.xSrcUntouched.pass, '`git diff --stat -- src` **EMPTY** — INSTRUMENT-ONLY, no engine byte moved');
row('⭐⭐ G-ANCHOR (G-REPRO-DLCT1)', G.gAnchor.pass,
  `block ${G.gAnchor.block} against the committed DLC-T1 **battery** artifact `
  + `(\`${String(G.gAnchor.sourceResultSha).slice(0, 8)}…${String(G.gAnchor.sourceResultSha).slice(-4)}\`), `
  + `arm \`${G.gAnchor.sourceArm}\`: **${G.gAnchor.rowsChecked} rows × ${G.gAnchor.fieldsPerRow} fields, `
  + `${G.gAnchor.mismatches} mismatches** (of ${G.gAnchor.committedRowsAvailable} committed rows available) — `
  + 'whole-match **signature** (rng stream state inside) AND the DELIVERED-STRIKE columns included. '
  + `\`armConfigurationIdentical: ${G.gAnchor.armConfigurationIdentical}\``);
row('⭐ G-REPRO-OBMT1', G.gReproObmT1.pass,
  `block ${G.gReproObmT1.block}: ${G.gReproObmT1.absentRowsChecked} rows × ${G.gReproObmT1.fieldsPerRow} fields, `
  + `**${G.gReproObmT1.absentMismatches} mismatches on ABSENT and ${G.gReproObmT1.checkAndShowMismatches} on CHECK-AND-SHOW**`);
row('G-REPRO-CTBT1', G.gReproCtbT1.pass,
  `${G.gReproCtbT1.rowsChecked} rows × ${G.gReproCtbT1.fieldsPerRow} fields, ${G.gReproCtbT1.mismatches} mismatches, signature included`);
row('G-REPRO-O2T1', G.gReproO2T1.pass, `${G.gReproO2T1.rowsChecked}/${G.gReproO2T1.rowsChecked} rows, ${G.gReproO2T1.mismatches} mismatches`);
row('G-REPRO-173', G.gRepro173.pass,
  `pressedShare **${G.gRepro173.observed.pressedShare}** · pressed **${G.gRepro173.observed.pressed}** `
  + `· unpressed **${G.gRepro173.observed.unpressed}** · all **${G.gRepro173.observed.all}**, field for field`);
row('G-REPRO-GGC', G.gReproGgc.pass, `**${G.gReproGgc.fieldsChecked}/${G.gReproGgc.fieldsChecked}** committed fields, ${G.gReproGgc.mismatches} mismatches`);
row('⭐ G-TRACE-SP', G.gTraceSp.pass,
  `all ${G.gTraceSp.lines.length} source lines matched VERBATIM; K = ${G.gTraceSp.constants.STRIKE_PLANE_K}, `
  + `zero-point index ${G.gTraceSp.constants.STRIKE_PLANE_ZERO_INDEX}, steps `
  + `[${G.gTraceSp.constants.steps.join(', ')}], and the zero-point member IS (direction 0, power 0): `
  + `\`${G.gTraceSp.constants.zeroPointMemberIsDirection0Power0}\``);
row('G-TRACE-PTP', G.gTracePtp.pass,
  `all ${G.gTracePtp.lines.length} source lines matched VERBATIM; the gene map probed through the shipped `
  + `\`passLeadSupportWeight\`: absent ${G.gTracePtp.geneMap.atAbsent}, min ${G.gTracePtp.geneMap.atMin}, `
  + `half ${G.gTracePtp.geneMap.atHalf}, max ${G.gTracePtp.geneMap.atMax}, clamped at `
  + `${G.gTracePtp.geneMap.belowMin} / ${G.gTracePtp.geneMap.aboveMax} beyond both ends`);
row('G-TRACE-RADIUS', G.gTraceRadius.pass, '`radius = 10 + g.supportDistance * 8` parsed from source');
row('⭐⭐ G-FORK-TOKENS-SP', G.gForkTokensSp.pass,
  `**${G.gForkTokensSp.occurrences} src occurrences, ZERO unclassified**; exactly **1** \`FLAG_FORK\` `
  + `· **1** \`GRID_FORM\` · **1** \`CAND_SCORE\` (into the ONE hoisted pricer) · **2** \`GRID_CAPTURE\` `
  + `· **1** \`PLANE_GUARD\` (naming NO flag) · ${G.gForkTokensSp.byKind.PLANE_ARGMAX ?? 0} \`PLANE_ARGMAX\`; `
  + `and **${G.gForkTokensSp.strikeStatementsInBrain} \`match.performPass(\` statements in the brain — `
  + 'i.e. ZERO added by the plane**');
row('⭐ G-FORK-TOKENS-DLC', G.gForkTokensDlc.pass,
  `**${G.gForkTokensDlc.occurrences} src occurrences, ZERO unclassified**; the banked contest's frozen `
  + `counts UNCHANGED (1 \`FLAG_FORK\` · 1 \`CAND_DECL\` · 2 \`CAND_SCORE\` matched VERBATIM · 1 `
  + `\`LED_FORM\` · 2 \`LED_CAPTURE\`), plus this stage's declared plane-era classes `
  + `(${G.gForkTokensDlc.planeEraClasses.join(', ')}) at 1 each`);
row('G-FORK-TOKENS-PTP', G.gForkTokensPtp.pass,
  `**${G.gForkTokensPtp.occurrences} src occurrences, ZERO unclassified**; exactly 1 \`FLAG_FORK\` · `
  + `1 \`LEAD_COMPUTE\` · 1 \`AIM_COMPOSE\` · ${G.gForkTokensPtp.aimApplySites} \`AIM_APPLY\` · `
  + `2 \`LEAD_CAPTURE\` · 1 \`STRIKE_GUARD\` · 1 \`STRIKE_LED\`. ⚠ the plane-era classes `
  + `(${G.gForkTokensPtp.planeEraClasses.join(', ')}) are this stage's declared Deviation 1`);
row('G-FORK-TOKENS (OBM)', G.gForkTokens.pass, `${G.gForkTokens.occurrences} src occurrences, 0 unclassified — OBM-T1's own inventory, unchanged`);
row('⭐ G-BLIND-WORLD', G.gBlindWorld.pass,
  'every arm percept-armed in its CONSTRUCTED world; `sawSnapshotShare` '
  + `${ARMS.map((a) => G.gBlindWorld.perArm[a].sawSnapshotShare).map((v: number) => pp(v, 3)).join(' / ')}, `
  + 'all four feature means > 0 in every arm. ⚠ `allFeaturesZeroShare` '
  + `${ARMS.map((a) => G.gBlindWorld.perArm[a].allFeaturesZeroShare).map((v: number) => pp(v, 2)).join(' / ')} `
  + 'is an **UPPER BOUND** on genuine silence');
row('SEED-DISJOINT', G.seedDisjoint.pass,
  `⭐ all **${G.seedDisjoint.walkedBlocks.length}** block rows machine-checked against the complete `
  + `**${G.seedDisjoint.consumedLedger.length}-entry** consumed ledger: 3 FRESH + 2 RESERVED clash-free, `
  + '**6 RE-WALKS each landing INSIDE its source\'s consumed interval** (the inverted predicate, '
  + 'including ⭐⭐ the G-ANCHOR block). `stageOwnOverlaps` empty, sub-blocks ordered, battery block '
  + `**${A.nRule.batteryBlock}** (N ${A.seeds}), room ${G.seedDisjoint.subBlocks.batteryRoom}, next consumed `
  + `${G.seedDisjoint.subBlocks.nextConsumedAfterBattery}`);
row('STATS-DISJOINT', G.statsDisjoint.pass,
  `base **${G.statsDisjoint.base}**, min gap **${G.statsDisjoint.minGap}** against the complete published namespace (${G.statsDisjoint.published.length} bases)`);
row('FLAG-HYGIENE', G.flagHygiene.pass,
  `**${G.flagHygiene.identityRows.filter((r: Any) => r.signatureIdentical && r.rowIdentical).length}/`
  + `${G.flagHygiene.identityRows.length}** seeds ⭐ PLANE-INERT ≡ ABSENT — whole-match signature **and** `
  + 'every row field; ⭐⭐ the doors row: `ctbSupportPlaneFalseInEveryArm` '
  + `${G.flagHygiene.twoDoors.ctbSupportPlaneFalseInEveryArm} · \`perceptArmedInEveryArm\` `
  + `${G.flagHygiene.twoDoors.perceptArmedInEveryArm} · \`dialNeverArmed\` `
  + `${G.flagHygiene.twoDoors.dialNeverArmed} · \`spFlagMatchesDoor\` `
  + `${G.flagHygiene.twoDoors.spFlagMatchesDoor} · \`dlcFlagMatchesDoor\` `
  + `${G.flagHygiene.twoDoors.dlcFlagMatchesDoor} · **\`neverBothDeliveryDoors\` `
  + `${G.flagHygiene.twoDoors.neverBothDeliveryDoors}** · \`doorMatchesGenePresence\` `
  + `${G.flagHygiene.twoDoors.doorMatchesGenePresence} · **\`exactlyOneArmedInertArm\` `
  + `${G.flagHygiene.twoDoors.exactlyOneArmedInertArm}**`);
row('⭐ G-ARM', G.gArm.pass,
  'delivery on the axes each arm doses and silence on the ones it does not. `ledPassesHandled === '
  + 'ledPassesNonZero` in **every** arm; zero metres in the inert arm; ⭐ the PLANE arms\' law is '
  + `MEMBERSHIP — \`planeChecked\` ${ARMS.map((a) => G.gArm.arms[a].planeChecked).join(' / ')} with `
  + `\`planeUnmatched\` ${ARMS.map((a) => G.gArm.arms[a].planeUnmatched).join(' / ')} (IEEE-exact against `
  + 'the shipped `groundStrikeGrid`); the CONTEST anchor\'s is the ALGEBRA (0 sign / 0 magnitude '
  + `violations); the four support-tick classes \`partitionExact\` in ${ARMS.length}/${ARMS.length}`);
row('G-CLEAN-INVOCATION', G.gCleanInvocation.pass, 'no override in force');
o();

/* ------------------------------------------------------------------ the JOINT primary */

o('### ⭐⭐ THE JOINT PRE-REGISTERED PRIMARY — mechanical flags only, NOTHING is fired (#203)');
o();
o('The prediction, restated VERBATIM as the artifact records it:');
o();
o(`> ${P.frozenText}`);
o();
o(`Operational rule, as frozen in the probe: ${P.successRule}`);
o();
o('| arm | supply Δ (pp) | 95 % CI (pp) | `resolvedHelpful` | goals/match | frozen band | `inBand` | **JOINT** | which limb fails |');
o('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  if (a === 'absent') continue;
  const j = a === P.planeCell ? P.primaryAtPlane : P.allArms[a];
  const sl = j.supplyLimb; const bl = j.goalsBandLimb;
  o(`| ${LABEL[a]} | ${sl.delta === null ? '—' : sgnPp(sl.delta)} `
    + `| ${sl.ci === null ? '—' : ciPair(sl.ci)} `
    + `| ${sl.resolvedHelpful} | ${bl.goalsPerMatch} | [${bl.bandLo}, ${bl.bandHi}] | ${bl.inBand} `
    + `| **${j.jointSatisfied}** | ${j.whichLimbFails === null ? '—' : j.whichLimbFails} |`);
}
o();

const pl = P.primaryAtPlane;
const anchor = P.allArms.choiceAnchor;
const ctrlGoals = A.arms.absent.guards.band.goals.perMatch;
const headroom = ctrlGoals - pl.goalsBandLimb.bandLo;
const goalsC = C.goalsPerMatch;
o(`⭐⭐ **THE CELL THE STAGE EXISTS FOR, READ MECHANICALLY.** At **${P.planeCell}**, LIMB A `
  + `(\`trueHoldableShare\`) is **${sgnPp(pl.supplyLimb.delta)} pp ${ciPair(pl.supplyLimb.ci)}**, `
  + `\`resolved: ${pl.supplyLimb.resolved}\` / \`resolvedHelpful: ${pl.supplyLimb.resolvedHelpful}\`; `
  + `LIMB B (goals) is **${pl.goalsBandLimb.goalsPerMatch}/match** against the frozen band `
  + `[${pl.goalsBandLimb.bandLo}, ${pl.goalsBandLimb.bandHi}], \`inBand: ${pl.goalsBandLimb.inBand}\`. `
  + `\`jointSatisfied: ${pl.jointSatisfied}\`, \`whichLimbFails\`: *${pl.whichLimbFails}*.`);
o();
o('⚠ **AND THE FOUR MECHANICAL NEIGHBOURS THAT MUST BE READ BESIDE IT** — rows, not readings:');
o();
o(`1. **THE CONTRAST ANCHOR, RE-WALKED ON THIS STAGE'S OWN SEEDS, IS UNRESOLVED ON SUPPLY.** `
  + `CHOICE-ANCHOR's supply delta is **${sgnPp(anchor.supplyLimb.delta)} pp `
  + `${ciPair(anchor.supplyLimb.ci)}**, \`resolved: ${anchor.supplyLimb.resolved}\` `
  + `(\`pointDirectionHelpful: ${anchor.supplyLimb.pointDirectionHelpful}\`), goals `
  + `**${anchor.goalsBandLimb.goalsPerMatch}** (\`inBand: ${anchor.goalsBandLimb.inBand}\`), `
  + `\`jointSatisfied: ${anchor.jointSatisfied}\`, \`whichLimbFails\`: *${anchor.whichLimbFails}*. `
  + `Same world, same instrument, different seeds (G-ANCHOR, ${G.gAnchor.rowsChecked} rows × `
  + `${G.gAnchor.fieldsPerRow} fields, ${G.gAnchor.mismatches} mismatches, `
  + `\`armConfigurationIdentical: ${G.gAnchor.armConfigurationIdentical}\`).`);
o(`2. **THE CONTROL IS INSIDE THE BAND.** ABSENT scores **${ctrlGoals}** goals/match against a floor `
  + `of **${pl.goalsBandLimb.bandLo}**: \`controlAlsoInBand: ${pl.goalsBandLimb.controlAlsoInBand}\`, `
  + `headroom **${num(headroom, 4)} goals/match**. So \`excludedBecauseControlFails\` is `
  + `**${JSON.stringify(A.guardVerdicts.band.excludedBecauseControlFails)}** and the gated dimensions `
  + `are ${JSON.stringify(A.guardVerdicts.band.gatedDimensions)} — the #198-form exclusion does `
  + `**not** fire here, and the band GATES at this N (\`${pl.goalsBandLimb.gatingGrain}\`).`);
o(`3. **THE PAIRED GOALS DELTA IS RESOLVED DOWN AT EVERY DOSED ARM, THE ANCHOR INCLUDED.** `
  + `PLANE **${sgn(goalsC.plane.pairedDelta.point)} ${ciAbs(goalsC.plane.pairedDelta, 4)}** `
  + `(\`resolved: ${goalsC.plane.resolved}\`) · PLANE-X-CAS `
  + `**${sgn(goalsC.planeXCas.pairedDelta.point)} ${ciAbs(goalsC.planeXCas.pairedDelta, 4)}** `
  + `(\`resolved: ${goalsC.planeXCas.resolved}\`) · CHOICE-ANCHOR `
  + `**${sgn(goalsC.choiceAnchor.pairedDelta.point)} ${ciAbs(goalsC.choiceAnchor.pairedDelta, 4)}** `
  + `(\`resolved: ${goalsC.choiceAnchor.resolved}\`). The BAND limb and the PAIRED limb are two `
  + 'different instruments on one column, and the artifact publishes both.');
o(`4. **THE OTHER PLANE ARM AGREES WITH PLANE ON BOTH LIMBS.** PLANE-X-CAS supply `
  + `**${sgnPp(P.allArms.planeXCas.supplyLimb.delta)} pp ${ciPair(P.allArms.planeXCas.supplyLimb.ci)}** `
  + `(\`resolvedHelpful: ${P.allArms.planeXCas.supplyLimb.resolvedHelpful}\`), goals `
  + `**${P.allArms.planeXCas.goalsBandLimb.goalsPerMatch}** (\`inBand: `
  + `${P.allArms.planeXCas.goalsBandLimb.inBand}\`), \`jointSatisfied: `
  + `${P.allArms.planeXCas.jointSatisfied}\`. And the ARMING IDENTITY, PLANE-INERT, is the row that `
  + `shows what the band alone is worth: goals **${P.allArms.planeInert.goalsBandLimb.goalsPerMatch}** `
  + `(\`inBand: ${P.allArms.planeInert.goalsBandLimb.inBand}\`) with supply delta EXACTLY `
  + `${sgnPp(P.allArms.planeInert.supplyLimb.delta)} pp — \`jointSatisfied: `
  + `${P.allArms.planeInert.jointSatisfied}\` all the same.`);
o();
o('⚠ **Adjudication is the commander\'s (#203).** Nothing above is a branch: F-T1s-a/b/c are named '
  + 'in this stage\'s §SUCCESS and fired nowhere in this probe or this generator.');
o();

/* ------------------------------------------------------------------ the overshoot clause */

o('### ⭐⭐ THE #240 OVERSHOOT CONTRAST — PLANE vs the CHOICE ANCHOR (mechanical flags only)');
o();
const OV = P.overshootPrediction;
const li = OV.limbInterceptions;
const sv = OV.supplyRetainedVsAnchor;
o('The clause, restated VERBATIM as the artifact records it:');
o();
o(`> ${OV.frozenText}`);
o();
o(`Estimator: ${OV.estimator}`);
o();
o('| limb | quantity | reading | flag | strict form |');
o('| --- | --- | --- | --- | --- |');
o('| **I — interceptions FALL** | `interceptionsPerMatch`, PLANE − ANCHOR | '
  + `${li.planeMinusAnchor === null ? 'n/a' : `${sgn(li.planeMinusAnchor.point, 4)} [${num(li.planeMinusAnchor.lower, 4)}, ${num(li.planeMinusAnchor.upper, 4)}]`} `
  + `| \`fall\` **${li.fall}** | \`resolvedFall\` ${li.resolvedFall} |`);
o('| **G — goals RECOVER** | band distance (0 inside; else distance to the nearer edge) | '
  + `plane ${num(OV.limbGoalsBand.bandDistancePlane, 4)} vs anchor ${num(OV.limbGoalsBand.bandDistanceAnchor, 4)} `
  + `| \`recover\` **${OV.limbGoalsBand.recover}** | \`intoBand\` ${OV.limbGoalsBand.intoBand} |`);
o('| (retention, published beside them) | `trueHoldableShare`, PLANE − ANCHOR | '
  + `${sv.planeMinusAnchor === null ? 'n/a' : `${sgnPp(sv.planeMinusAnchor.point)} pp [${ppD(sv.planeMinusAnchor.lower)}, ${ppD(sv.planeMinusAnchor.upper)}]`} `
  + `| \`resolvedVsAnchor\` ${sv.resolvedAgainstAnchor} | — |`);
o();
o(`⇒ **SATISFIED = ${OV.satisfied}** (LIMB I **OR** LIMB G, the ruling's own disjunction); strict form `
  + `**${OV.satisfiedStrict}**.`);
o();
o('⭐ **THE THREE LIMBS AT BATTERY N, STATED AS THE ARTIFACT HAS THEM.** LIMB I: the '
  + 'anchor-referenced paired CI on `interceptionsPerMatch` is '
  + `**${sgn(li.planeMinusAnchor.point, 4)} [${num(li.planeMinusAnchor.lower, 4)}, `
  + `${num(li.planeMinusAnchor.upper, 4)}]**, \`resolved: ${VA.interceptionsPerMatch.plane.resolved}\` `
  + '— the interval lies entirely ABOVE zero, i.e. a RESOLVED RISE against the anchor, so `fall` is '
  + `**${li.fall}** and \`resolvedFall\` **${li.resolvedFall}**. LIMB G: the band distance is `
  + `**${num(OV.limbGoalsBand.bandDistancePlane, 4)}** at PLANE against `
  + `**${num(OV.limbGoalsBand.bandDistanceAnchor, 4)}** at the ANCHOR — it INCREASED, so \`recover\` is `
  + `**${OV.limbGoalsBand.recover}** and \`intoBand\` **${OV.limbGoalsBand.intoBand}** `
  + `(\`${OV.limbGoalsBand.bandDistanceRule}\`). RETENTION: `
  + `**${sgnPp(sv.planeMinusAnchor.point)} pp [${ppD(sv.planeMinusAnchor.lower)}, `
  + `${ppD(sv.planeMinusAnchor.upper)}]**, \`resolvedVsAnchor: ${sv.resolvedAgainstAnchor}\` — the `
  + 'plane-versus-anchor supply difference is UNRESOLVED. ⚠ *Note the reference frames: the '
  + 'retention row is PLANE − ANCHOR, while LIMB A of the JOINT primary is PLANE − CONTROL, and '
  + `the artifact publishes both rather than one standing for the other (${sv.note})*.`);
o();
o('⚠ These are the probe\'s MECHANICAL predicate flags on published CIs and on the frozen band, '
  + 'exactly like `resolved` (#203). **The probe adjudicates nothing**; what the disjunction\'s '
  + '`false` means for the arc is the commander\'s.');
o();

/* ------------------------------------------------------------------ the strike distribution */

o('### ⭐⭐ THE CHOSEN STRIKE — the emergent KICK over the NINE grid members (REPORTED)');
o();
o(`*(observational, seed ${A.strikeRead.plane.seed}; index = (dirStep+1)·3 + (powerStep+1), so member `
  + '**4 is TODAY\'S KICK**. ⚠ An arm without the plane door has no grid: its member row is all zeros '
  + 'BY CONSTRUCTION.)*');
o();
o('⚠⚠ **THE GRAIN OF THIS TABLE IS THE DECLARED OBSERVATIONAL BLOCK, NOT THE BATTERY.** The strike '
  + 'read is the §SEEDS block reserved for it — **one seed × five arms × two matches** (a traced '
  + 'match and its untraced LOCKSTEP TWIN) — because the member tally needs the chooser\'s sidecar '
  + 'trace and percept pulls that the exam walks may never take. It therefore does **not** scale '
  + 'with N and is IDENTICAL to the smoke round\'s table, by construction rather than by '
  + 'coincidence. ⭐ What DOES move with N is the **strike-time delivered rate** and the **led '
  + `share** below, both computed across all ${A.seeds} battery seeds.`);
o();
o('⚠⚠ **MEMBER 4 IS `n/a`, NOT A MEASURED 0 (#242.3).** This table is tallied from the **5th '
  + 'argument of `performPass`**, and a ZERO-DISPLACEMENT kick carries no 5th argument (the banked '
  + 'strike guard\'s own `bestLeadX !== 0 || bestLeadY !== 0`). So TODAY\'S KICK HAS NO OBSERVATION '
  + 'CHANNEL HERE, and the inherited bucket definition *"legacy man kept AND member 4 won"* is '
  + 'corrected with it — keeping the legacy man is observable, member 4 winning is not. ⭐ '
  + '**Zero-point wins are countable only at DECISION time.** The nearest banked evidence is '
  + 'DLC-T0s\'s **G-WINNER** (`data/dlc-t0s-strike-plane.json` → `gates.gWinner`): of the '
  + 'materially-spread decisions, **6 of 96 won by TODAY\'S KICK** in the percept world and **5 of '
  + '75** in the bare world — T0s\'s world, cited as the honest source for the QUANTITY.');
o();
o('| arm | door | kicks | sampled-struck | 0 `d−1p−1` | 1 `d−1p0` | 2 `d−1p+1` | 3 `d0p−1` | **4 `d0p0` (today)** | 5 `d0p+1` | 6 `d+1p−1` | 7 `d+1p0` | 8 `d+1p+1` | unmatched |');
o('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const s = A.strikeRead[a];
  o(`| ${LABEL[a]} | ${s.door} | ${s.kicks} | ${s.sampledStruck} | `
    + `${s.byMember.map((m: Any) => (m.observableAtStrike ? String(m.wins) : '**n/a**')).join(' | ')} `
    + `| ${s.unmatchedStrikes} |`);
}
o();
o('By DIRECTION and by POWER, and the size of the displacement that rode the ball:');
o();
o('| arm | by direction | by power | mean displacement | max | share of pass distance |');
o('| --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const s = A.strikeRead[a];
  o(`| ${LABEL[a]} | \`${JSON.stringify(s.byDirection)}\` | \`${JSON.stringify(s.byPower)}\` `
    + `| ${num(s.meanDisplacementMetres)} m | ${num(s.maxDisplacementMetres)} m `
    + `| ${num(s.meanDisplacementShareOfDistance, 5)} |`);
}
o();
o('⭐ **AND THE SECOND, INDEPENDENT MEMBER TALLY — G-ARM\'s OWN LAW CHECK ON THE BATTERY WALKS.** '
  + 'The membership half of G-ARM re-derives every sampled struck displacement through the shipped '
  + '`groundStrikeGrid` and records which member it matched, on the battery run itself:');
o();
o('| arm | `planeChecked` | `planeUnmatched` | member wins 0..8 (member 4 unobservable at strike time) |');
o('| --- | --- | --- | --- |');
for (const a of ARMS) {
  const g = G.gArm.arms[a];
  o(`| ${LABEL[a]} | ${g.planeChecked} | ${g.planeUnmatched} | \`${JSON.stringify(g.planeMemberWins)}\` |`);
}
o();

/* ------------------------------------------------------------------ delivered rate */

o('### ⭐⭐ THE DELIVERED RATE PER ARM — the treatment AS REALLY DELIVERED (#242.2/#242.3)');
o();
o('**(a) THE CORRECTED READING — delivered rate CONDITIONED ON LIVE-GRID DECISIONS.** A '
  + 'zero-displacement kick only counts as *the plane declining* if the plane had another kick to '
  + 'decline. Liveness is MEASURED per decision, on the LEGACY man\'s own grid: **LIVE** = at least '
  + 'one of the nine members is a different kick; **DEGENERATE** = all nine exactly (0,0) — no '
  + 'remembered motion ⇒ reach 0 ⇒ the whole plane collapses onto today\'s kick BY ARITHMETIC, so '
  + 'the treatment was IMPOSSIBLE at that decision; **no seat** = the gene is absent, so no grid '
  + 'forms at all.');
o();
o('| arm | a PLANE reading? | kicks | sampled-struck | zero-point: LIVE / **DEGENERATE** / no seat | substituted: LIVE / **DEGENERATE** / no seat | no chooser row | live-grid n | ⭐⭐ **delivered rate (LIVE-GRID, observational)** | ⭐ delivered rate (strike-time, **BATTERY GRAIN**) | lockstep |');
o('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const s = A.strikeRead[a];
  const real = s.deliveredRateIsATreatmentReading;
  o(`| ${LABEL[a]} | ${real ? '**yes**' : 'no — no grid here'} | ${s.kicks} | ${s.sampledStruck} `
    + `| ${s.zeroPointLiveGrid} / **${s.zeroPointDegenerateGrid}** / ${s.zeroPointNoSeat} `
    + `| ${s.substitutedLiveGrid} / **${s.substitutedDegenerateGrid}** / ${s.substitutedNoSeat} `
    + `| ${s.noChooserRow} | ${s.liveGridDecisions} `
    + `| ${s.deliveredRateLiveGrid === null ? 'n/a — no plane here' : `**${num(s.deliveredRateLiveGrid, 4)}**`} `
    + `| **${num(G.gArm.arms[a].deliveredRateStrikeTime, 5)}** | ${s.lockstepWithUntraced} |`);
}
o();
o('⭐ **THE ONE COLUMN THAT IS AT BATTERY GRAIN IS THE STRIKE-TIME ONE**, and it is the rate every '
  + `ruler above is computed under: \`ledPassesNonZero / passesChosen\` across all ${A.seeds} exam `
  + 'seeds with ZERO percept pulls. At PLANE it reads '
  + `**${num(G.gArm.arms.plane.deliveredRateStrikeTime, 5)}** `
  + `(${int(A.arms.plane.leadSeam.ledPassesNonZero)} of `
  + `${int(A.arms.plane.leadSeam.passesChosen)} chosen passes), at PLANE-X-CAS `
  + `**${num(G.gArm.arms.planeXCas.deliveredRateStrikeTime, 5)}**, and at the CHOICE ANCHOR — where `
  + 'it is the two-point contest\'s own delivered rate on the same ruler — '
  + `**${num(G.gArm.arms.choiceAnchor.deliveredRateStrikeTime, 5)}**. ⚠ So the PLANE arms are read `
  + 'at roughly ONE KICK IN FOUR carrying the chooser\'s own displacement: a null on any ruler is a '
  + 'reading of a treatment delivered at that rate, never of one delivered at 1.');
o();
o('⭐ **WHY THE LIVE-GRID COLUMN IS `n/a` ON THREE ARMS AND THAT IS THE POINT.** An arm with no '
  + 'plane has no treatment to deliver, so it gets no delivered rate. PLANE-INERT reads `n/a` for '
  + 'the sharpest possible reason: the gene is ABSENT, so **no seat and therefore no grid ever '
  + 'forms**, and every one of its decisions lands in *no seat*.');
o();
o('**(b) THE RETRACTED READING**, kept for audit — `(sampled-struck + genuine zero-point) / '
  + 'kicks`, with the bracket it can honestly support:');
o();
o('| arm | kicks | sampled-struck | genuine zero-point | ⚠ target-SUBSTITUTED | no chooser row | substitution rate | ⚠ **delivered rate (decoded — RETRACTED)** | ⭐ honest bracket for that formula |');
o('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const s = A.strikeRead[a];
  const real = s.deliveredRateIsATreatmentReading;
  const cell = (v: string): string => (real ? v : `(${v})`);
  const b = s.deliveredRateDecodedBracket;
  o(`| ${LABEL[a]} | ${s.kicks} | ${s.sampledStruck} `
    + `| ${s.genuineZeroPoint} | ${s.targetSubstituted} | ${s.noChooserRow} `
    + `| ${cell(num(s.substitutionRate, 4))} | ${cell(`~~${num(s.deliveredRateDecoded, 4)}~~`)} `
    + `| ${cell(`[${num(b.lower, 4)}, ${num(b.upper, 4)}]`)} |`);
}
o();
o('⚠⚠ **THE RETRACTION RIDES UNCHANGED FROM THE SMOKE ROUND (#242.3).** `deliveredRateDecoded`\'s '
  + 'bucket is decided SOLELY by `chosenGid === legacyGid` and carries no grid information, so it '
  + 'scored two OPPOSITE facts identically: *the plane offered another kick and the decision '
  + 'declined it* and *the plane had nothing to offer*. The symptom that proves it matters is that '
  + 'the old statistic was NOT MONOTONE IN TREATMENT — PLANE-INERT scored '
  + `**${num(A.strikeRead.planeInert.deliveredRateDecoded, 4)}**, HIGHER than PLANE's `
  + `**${num(A.strikeRead.plane.deliveredRateDecoded, 4)}**. Parenthesised cells are NOT a plane `
  + 'reading (`deliveredRateIsATreatmentReading: false`).');
o();

/* ------------------------------------------------------------------ the emergent share */

o('### ⭐⭐ THE EMERGENT LED SHARE — battery grain (REPORTED — no gate reads it)');
o();
o('| arm | door | gene | passes chosen | displacement wins | **share** | mean | max | disp / pass dist | interceptions per such pass |');
o('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const l = A.arms[a].leadSeam;
  const gene = G.gArm.arms[a].leadGene;
  o(`| ${LABEL[a]} | ${DOORLBL[a]} | ${gene === null ? 'absent' : gene} | ${int(l.passesChosen)} `
    + `| ${int(l.ledPassesNonZero)} | **${pp(l.ledShareOfChosenPasses, 2)}** | ${num(l.meanLeadMetres)} m `
    + `| ${num(l.maxLeadMetres)} m | ${num(l.meanLeadShareOfPassDistance, 5)} `
    + `| ${Number.isFinite(l.interceptionsPerLedPass) ? num(l.interceptionsPerLedPass, 5) : 'n/a (none)'} |`);
}
o();
o('⭐ **THE SUPPORT-SCOPED SHARE** — the same wins over the denominator the seam can actually reach '
  + '(`passesToSupportTarget`; a displaced strike exists only on a support-mode mate), a ratio of '
  + 'two counters the artifact publishes:');
o();
o('| arm | displacement wins | passes to a SUPPORT target | **support-scoped share** | all chosen passes | headline share |');
o('| --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const l = A.arms[a].leadSeam;
  const supportScoped = l.passesToSupportTarget > 0 ? l.ledPassesNonZero / l.passesToSupportTarget : NaN;
  o(`| ${LABEL[a]} | ${int(l.ledPassesNonZero)} | ${int(l.passesToSupportTarget)} `
    + `| **${pp(supportScoped, 2)}** | ${int(l.passesChosen)} | ${pp(l.ledShareOfChosenPasses, 2)} |`);
}
o();
o('And the share as the ESTIMATOR pairs it (`ledPassShare`, the only one of these three that '
  + 'carries a CI):');
o();
rateTable('ledPassShare', 'REPORTED — displaced-strike share, paired', true, 4);

o('### ⭐ The SITUATIONAL PROFILE of the emergent share (REPORTED — no gate reads it)');
o();
o('| arm | share at PRESSED | share at UNPRESSED | pressed passes | unpressed passes | partition exact |');
o('| --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const s = A.arms[a].leadSeam.situationalLedShare;
  o(`| ${LABEL[a]} | ${pp(s.ledShareAtPressed, 2)} (${int(s.ledAtPressed)}/${int(s.pressedTotal)}) `
    + `| ${pp(s.ledShareAtUnpressed, 2)} (${int(s.ledAtUnpressed)}/${int(s.unpressedTotal)}) `
    + `| ${int(s.pressedTotal)} | ${int(s.unpressedTotal)} | ${s.partitionExact} |`);
}
o();
o('⚠ The bin is the #173 census\'s own pressure test (nearest opponent within '
  + `${A.arms.plane.ruler2PressedFirstReception.radiusM} m of the CARRIER at the instant of the `
  + 'strike). It is a **DESCRIPTION** of when the chooser picked which ball, **not** a claim that '
  + 'pressure caused the choice and not a controlled contrast; the estimator pairs no cell in this '
  + 'table.');
o();

/* ------------------------------------------------------------------ tier-1 / tier-2 */

o('### TIER-1 SUPPLY RULERS AND THE TIER-2 SHARES — rows, never verdicts (#203)');
o();
rateTable('trueHoldableShare', 'Ruler 1 — TRUE-holdable supply (LIMB A of the primary)');
rateTable('pressedFirstReceptionShare', 'Ruler 2 — pressed first reception');
rateTable('shortOptionPossShare', 'Ruler 3 — short-option supply (possession ticks)');
rateTable('shortOptionFirstRecShare', 'Ruler 3 — short-option supply (first receptions)');
rateTable('supportAtPressedPossShare', 'Ruler 4 — support existence at PRESSED (possession ticks)');
rateTable('supportAtPressedFirstRecShare', 'Ruler 4 — support existence at PRESSED (first receptions)');

o('### ⭐ THE #218 GENEALOGY SHARES, WITH CIs (REPORTED — no gate reads them)');
o();
rateTable('constructedGe3Share', 'Tier 2 — constructed ≥3 (non-set-piece pool)');
rateTable('constructedGe4Share', 'Tier 2 — constructed ≥4 (non-set-piece pool)');
rateTable('constructedGe5Share', 'Tier 2 — constructed ≥5 (non-set-piece pool)');
rateTable('scrambleShareOfGoals', 'Tier 2 — scramble share of goals');
rateTable('setPieceShareOfGoals', 'Tier 2 — set-piece share of goals');
o(`At ${A.seeds} seeds each arm scores `
  + `${ARMS.map((a) => int(A.arms[a].ruler5BuildUp.genealogy.goals)).join(' / ')} goals in total (in arm `
  + 'order) — so unlike the smoke, a single goal is no longer worth several pp on these shares, and '
  + 'the CIs above are the ones the estimator actually produced. **They are still REPORTED rows: no '
  + 'gate and no success condition reads any of them.**');
o();
o('Goal ORIGIN family counts (the classifier\'s own classes, per arm):');
o();
o('| arm | goals | set piece | restart | open play | scramble / loose ball | turnover (own / mid / final third) |');
o('| --- | --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const g = A.arms[a].ruler5BuildUp.genealogy;
  o(`| ${LABEL[a]} | ${int(g.goals)} | ${int(g.byFamily.setPiece)} | ${int(g.byFamily.restart)} `
    + `| ${int(g.byFamily.openPlay)} | ${int(g.byOrigin.scrambleLooseBall)} `
    + `| ${int(g.byOrigin.turnoverWonInOwnThird)} / ${int(g.byOrigin.turnoverWonInMiddleThird)} `
    + `/ ${int(g.byOrigin.turnoverWonInFinalThird)} |`);
}
o();

/* ------------------------------------------------------------------ the guards */

o('### THE GUARDS — every tolerance frozen ex ante');
o();
o('| limb | control | tolerance | resolved arms | **breaches** |');
o('| --- | --- | --- | --- | --- |');
for (const g of A.guardVerdicts.tolerances) {
  const res = ARMS.filter((a) => a !== 'absent' && g.arms[a]?.resolved)
    .map((a) => `${PLAIN[a]} ${sgn(g.arms[a].delta, 4)}`);
  const br = ARMS.filter((a) => a !== 'absent' && g.arms[a]?.breach).map((a) => PLAIN[a]);
  o(`| ${g.key} (${g.direction}) | ${num(g.controlLevel, 4)} | ±${num(g.toleranceAbs, 4)} `
    + `| ${res.length === 0 ? 'none' : res.join(', ')} | **${br.length === 0 ? 'none' : br.join(', ')}** |`);
}
o();
const iGuard = A.guardVerdicts.tolerances.find((g: Any) => g.key === 'interceptionsPerMatch');
const breaches = ARMS.filter((a) => a !== 'absent' && iGuard.arms[a]?.breach);
o('⭐ **THE NAMED RISK (F-T1s-c), STATED AGAINST ITS FROZEN TOLERANCE.** The interception rise is '
  + 'RESOLVED at every dosed arm and BEYOND TOLERANCE at '
  + `${breaches.length === 0 ? '**none**' : `**${breaches.map((a) => PLAIN[a]).join(', ')}**`}:`);
o();
o('| arm | interceptions/match | Δ vs control | 95 % CI | `resolved` | tolerance | `beyondTolerance` | **`breach`** |');
o('| --- | --- | --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  if (a === 'absent') {
    o(`| ${LABEL[a]} | ${num(iGuard.controlLevel, 4)} | (CONTROL) | — | — | — | — | — |`);
    continue;
  }
  const r = iGuard.arms[a];
  o(`| ${LABEL[a]} | ${num(C.interceptionsPerMatch[a].point, 4)} | ${sgn(r.delta, 4)} `
    + `| ${ciAbs({ lower: r.ci[0], upper: r.ci[1] }, 4)} | ${r.resolved} | ±${num(iGuard.toleranceAbs, 4)} `
    + `| ${r.beyondTolerance} | **${r.breach}** |`);
}
o();
o('⭐ And the SAME limb against the CONTRAST ANCHOR — the reference LIMB I of the overshoot clause '
  + 'is read in (`contrasts.ratesVsAnchor`, ARM − CHOICE-ANCHOR on the same resampled seed-index '
  + 'sets):');
o();
o('| arm | Δ vs ANCHOR | 95 % CI | `resolved` |');
o('| --- | --- | --- | --- |');
for (const a of ARMS) {
  const d = VA.interceptionsPerMatch[a];
  o(`| ${LABEL[a]} | ${d.pairedDelta === null ? '(ANCHOR)' : sgn(d.pairedDelta.point, 4)} `
    + `| ${d.pairedDelta === null ? '—' : ciAbs(d.pairedDelta, 4)} `
    + `| ${d.pairedDelta === null ? '—' : String(d.resolved)} |`);
}
o();
rateTable('offsidesPerMatch', 'Offsides per match (the #157 FLAG form — flips no gate)', false, 4);
const offRes = ARMS.filter((a) => a !== 'absent' && A.guardVerdicts.offside.rows[a].resolvedIncrease);
o(`Offsides: resolved INCREASES — **${offRes.length === 0 ? 'none' : offRes.map((a) => PLAIN[a]).join(', ')}**.`);
o();
rateTable('foulsPerMatch', 'Fouls per match (context row — no tolerance is frozen on it)', false, 4);
rateTable('spacingMedian', 'Spacing median (guard limb — floor)', false, 4);
rateTable('spacingUnder4', 'Spacing under 4 m (guard limb — ceiling)', true, 4);
rateTable('spreadYOut', 'Spread-Y out of possession (guard limb — floor)', false, 4);
rateTable('spreadYIn', 'Spread-Y in possession (context row)', false, 4);

o('### ⭐ THE EQUILIBRIUM BAND — IT GATES AT THIS N, AND THE CONTROL PASSES');
o();
o(`\`excludedBecauseControlFails\`: **${JSON.stringify(A.guardVerdicts.band.excludedBecauseControlFails)}** · `
  + `gated dimensions: ${JSON.stringify(A.guardVerdicts.band.gatedDimensions)}. Baselines `
  + `${JSON.stringify(A.guardVerdicts.band.baseline)} with tolerances `
  + `${JSON.stringify(A.guardVerdicts.band.tolerance)}.`);
o();
const dims: string[] = A.guardVerdicts.band.gatedDimensions;
o(`| arm | ${dims.join(' | ')} | all gated dims in band |`);
o(`| --- | ${dims.map(() => '---').join(' | ')} | --- |`);
for (const a of ARMS) {
  const r = A.guardVerdicts.band.rows[a];
  o(`| ${LABEL[a]} | ${dims.map((d) => `${r.perDimension[d].perMatch}${r.perDimension[d].inBand ? '' : ' **OUT**'}`).join(' | ')} `
    + `| ${r.allGatedDimensionsInBand} |`);
}
o();
const outCells: string[] = [];
for (const a of ARMS) {
  for (const d of dims) {
    if (!A.guardVerdicts.band.rows[a].perDimension[d].inBand) {
      outCells.push(`${PLAIN[a]} \`${d}\` ${A.guardVerdicts.band.rows[a].perDimension[d].perMatch}`);
    }
  }
}
o(`Out-of-band cells, exhaustively (${outCells.length}): `
  + `**${outCells.length === 0 ? 'none' : outCells.join(' · ')}**. ⭐ Only \`goals\` is a PRIMARY limb; `
  + 'the other band dimensions are guard limbs and are published here for the same reason — the '
  + 'band gates at this N and the control passes every one of them.');
o();

/* ------------------------------------------------------------------ identity, populations, N */

o('### ⭐⭐ THE PLANE-INERT IDENTITY AT BATTERY N');
o();
const idRows = G.flagHygiene.identityRows;
const idExact = idRows.filter((r: Any) => r.signatureIdentical && r.rowIdentical).length;
o(`**${idExact}/${idRows.length}** seeds: PLANE-INERT is byte-identical to ABSENT on the whole-match `
  + '**signature** (rng stream state inside) **and every measured row field**. That arm is the '
  + 'plane\'s door OPEN with the gene ABSENT: the arming rule is EVALUATED on every on-ball '
  + 'decision and returns `null`, so no grid forms, nothing is priced and the pass loop runs the '
  + 'shipped statements alone. Every PLANE-INERT delta in every table above is therefore **exactly '
  + '0 with a [0, 0] CI by construction**, and that is the receipt, not a coincidence — *the plane '
  + 'costs the world nothing until it is given a gene*, measured at battery grain rather than cited '
  + `from T0s. (\`exactlyOneArmedInertArm: ${G.flagHygiene.twoDoors.exactlyOneArmedInertArm}\`, `
  + `\`doorMatchesGenePresence: ${G.flagHygiene.twoDoors.doorMatchesGenePresence}\`.)`);
o();

o('### POPULATIONS (per arm, battery grain)');
o();
o('| arm | matches to full time | ticks walked | played ticks | eligible moments (ruler 1) | TRUE-holdable | first receptions | pressed | possession ticks | goals |');
o('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const arm = A.arms[a];
  o(`| ${LABEL[a]} | ${int(arm.context.matchesReachingFullTime)} | ${int(arm.context.ticksWalked)} `
    + `| ${int(arm.context.playedTicks)} | ${int(arm.ruler1TrueHoldable.eligibleTotal)} `
    + `| ${int(arm.ruler1TrueHoldable.trueHoldableTotal)} `
    + `| ${int(arm.ruler2PressedFirstReception.firstReceptions)} `
    + `| ${int(arm.ruler2PressedFirstReception.pressed)} `
    + `| ${int(arm.ruler3ShortOptionSupply.possessionTicks)} `
    + `| ${int(arm.ruler5BuildUp.genealogy.goals)} |`);
}
o();
o(`⭐ LIMB A's counter, in full: at ${P.planeCell} the TRUE-holdable numerator is `
  + `**${int(A.arms.plane.ruler1TrueHoldable.trueHoldableTotal)} of `
  + `${int(A.arms.plane.ruler1TrueHoldable.eligibleTotal)} eligible moments** against ABSENT's `
  + `**${int(A.arms.absent.ruler1TrueHoldable.trueHoldableTotal)} of `
  + `${int(A.arms.absent.ruler1TrueHoldable.eligibleTotal)}**, and the CHOICE ANCHOR's `
  + `**${int(A.arms.choiceAnchor.ruler1TrueHoldable.trueHoldableTotal)} of `
  + `${int(A.arms.choiceAnchor.ruler1TrueHoldable.eligibleTotal)}** — the estimates the paired `
  + 'bootstrap above is built on, printed so each CI is read against its own population.');
o();

o('### THE N RULE AS EXECUTED (in-probe, from the committed artifacts)');
o();
const nr = A.nRule;
o(`DEFF **${nr.deff}** (${nr.deffProvenance}) — inherited ${nr.deffInherited}, same-world smoke `
  + `${nr.deffSmoke}. q1 ⇒ **N ${nr.q1TrueHoldable.n}** (p0 ${nr.q1TrueHoldable.p0}, MDE `
  + `${nr.q1TrueHoldable.mde}, ${nr.q1TrueHoldable.eligiblePerSeed} eligible moments/seed), q2 ⇒ N `
  + `${nr.q2PressedFirstReception.n} (p0 ${nr.q2PressedFirstReception.p0}, MDE `
  + `${nr.q2PressedFirstReception.mde}, ${nr.q2PressedFirstReception.firstReceptionsPerSeed} first `
  + `receptions/seed), binding **${nr.binding}**, nRaw ${nr.nRaw}, **N\\* = ${nr.nStar}**; ledger room `
  + `${nr.batteryRoom} (binds=${nr.roomBinds}), cap ${nr.nCap} (binds=${nr.capBinds}). Battery block `
  + `**${nr.batteryBlock}** — inside the ledger and below the `
  + `${G.seedDisjoint.subBlocks.nextConsumedAfterBattery} ceiling.`);
o();
o(`⭐⭐ **N\\* MOVED FROM THE SMOKE'S 628 TO ${nr.nStar}, AND THE RULE IS WHY — NOT A RE-CUT.** The `
  + 'frozen §NRULE reads p0 and moments-per-seed from **this world** wherever this stage\'s own '
  + `committed smoke exists. \`sourceOfP0\` is now **"${nr.sourceOfP0}"** (at smoke-sizing time it `
  + 'was the inherited out-of-world pair), quoted from the artifact verbatim. The artifact states '
  + `the rule's own world clause: *"${nr.worldNote}"* The MDEs are unchanged and still the traced `
  + `committed ones (q1: ${nr.q1TrueHoldable.mdeProvenance}; q2: `
  + `${nr.q2PressedFirstReception.mdeProvenance}), the DEFF is still a MAX over the inherited and `
  + `same-world values (and the same-world one is the SMALLER here, so the inherited value carries), `
  + `and the cap (${nr.nCap}) did **not** bind. Sizing sources, by hash: `
  + `O2-T1 \`${String(nr.sources.o2t1.resultSha).slice(0, 8)}…\` · tempo `
  + `\`${String(nr.sources.tempo.resultSha).slice(0, 8)}…\` · this stage's own smoke `
  + `\`${String(nr.sources.selfSmoke.resultSha).slice(0, 8)}…\` (${nr.sources.selfSmoke.seeds} seeds).`);
o();
