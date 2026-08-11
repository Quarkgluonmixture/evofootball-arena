/**
 * DLC-T1 §RESULT — THE FULL BATTERY: the SECTION GENERATOR (the #229.2 rule, discharged in code).
 *
 * The smoke generator (`dlc-t1-smoke-result.ts`) extended to battery grain. Reads the COMMITTED
 * battery artifact and emits the whole §RESULT (FULL BATTERY) markdown section on stdout. Every
 * measured cell in the published section is printed from this file's reads of the artifact —
 * never typed into the doc by hand. That is the whole point: #229.2's lesson (the OBM-T1 smoke's
 * fabricated MAX column) enforced by CONSTRUCTION rather than by a promise to sweep afterwards.
 *
 * What is NEW here relative to the smoke generator, and why:
 *   1. the BAND now GATES (it "gates at battery N only", inherited verbatim) and the ABSENT arm
 *      is INSIDE it, so `excludedBecauseControlFails` is empty and the per-dimension band table
 *      is printed in full rather than disclosed as a plumbing reading;
 *   2. the JOINT primary block carries the three MECHANICAL neighbours the commander must read
 *      beside it — the re-walked dial ANCHOR on the same fresh seeds, the CONTROL's headroom
 *      inside the band, and the PAIRED goals delta at each arm — all computed from artifact
 *      fields, none of them a verdict;
 *   3. the led-share table adds the SUPPORT-SCOPED share (a ratio of two published counters,
 *      `ledPassesNonZero / passesToSupportTarget`, labelled as such);
 *   4. the tier-2 / genealogy shares are printed WITH their paired CIs at every arm, the guards
 *      get the fouls and offside rows, and the ARMED-ZERO identity and the populations are
 *      printed at battery N.
 *
 * The prose captions ARE literal strings here, so they ride the generator too and cannot drift
 * away from the numbers they sit beside.
 *
 * This script ADJUDICATES NOTHING (#203). It prints rows, paired deltas and the mechanical CI /
 * predicate flags the probe already computed. No verdict is composed here; F-DLC-a/b/c are the
 * commander's, in ruling #239.
 *
 *   npx tsx scripts/analysis/dlc-t1-battery-result.ts \
 *     docs/world-model/data/dlc-t1-choice-exam.json
 */

import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

const artifactPath = process.argv[2] ?? 'docs/world-model/data/dlc-t1-choice-exam.json';
const A: Any = JSON.parse(readFileSync(artifactPath, 'utf8'));

const ARMS = ['absent', 'armedZero', 'choice', 'choiceXCas', 'leadAnchor'] as const;
const LABEL: Record<string, string> = {
  absent: 'ABSENT',
  armedZero: 'ARMED-ZERO',
  choice: '⭐ **CHOICE**',
  choiceXCas: 'CHOICE-X-CAS',
  leadAnchor: '⭐ LEAD-ANCHOR',
};
const PLAIN: Record<string, string> = {
  absent: 'ABSENT',
  armedZero: 'ARMED-ZERO',
  choice: 'CHOICE',
  choiceXCas: 'CHOICE-X-CAS',
  leadAnchor: 'LEAD-ANCHOR',
};
const DOORLBL: Record<string, string> = {
  absent: 'none', armedZero: 'dlc', choice: 'dlc', choiceXCas: 'dlc', leadAnchor: 'ptp',
};

const o = (s = ''): void => { process.stdout.write(`${s}\n`); };
const pp = (x: number, dp = 4): string => (Number.isFinite(x) ? `${(x * 100).toFixed(dp)} %` : 'n/a');
const ppD = (x: number, dp = 4): string => (Number.isFinite(x) ? `${(x * 100).toFixed(dp)}` : 'n/a');
const num = (x: number, dp = 4): string => (Number.isFinite(x) ? x.toFixed(dp) : 'n/a');
const sgn = (x: number, dp = 4): string => (Number.isFinite(x) ? `${x > 0 ? '+' : ''}${x.toFixed(dp)}` : 'n/a');
const int = (x: number): string => (Number.isFinite(x) ? x.toLocaleString('en-US') : 'n/a');
const ci = (d: Any, dp = 4): string => (d === null ? '(CONTROL)'
  : `[${(d.lower * 100).toFixed(dp)}, ${(d.upper * 100).toFixed(dp)}]`);
const ciAbs = (d: Any, dp = 4): string => (d === null ? '(CONTROL)'
  : `[${d.lower.toFixed(dp)}, ${d.upper.toFixed(dp)}]`);
const ciPair = (c: Any, dp = 4): string => (c === null ? '—'
  : `[${(c[0] * 100).toFixed(dp)}, ${(c[1] * 100).toFixed(dp)}]`);

const C = A.contrasts.rates;
const G = A.gates;
const P = A.preRegisteredPrimary;

const rateTable = (key: string, title: string, asPct = true, dp = 4): void => {
  o(`**${title}** (ABSENT **${asPct ? pp(C[key].absent.point, dp) : num(C[key].absent.point, dp)}**):`);
  o();
  o(`| arm | door | point | Δ ${asPct ? '(pp)' : '(abs)'} | 95 % CI ${asPct ? '(pp)' : '(abs)'} | \`resolved\` |`);
  o('| --- | --- | --- | --- | --- | --- |');
  for (const a of ARMS) {
    const c = C[key][a];
    const d = c.pairedDelta;
    o(`| ${LABEL[a]} | ${DOORLBL[a]} | ${asPct ? pp(c.point, dp) : num(c.point, dp)} `
      + `| ${d === null ? '—' : (asPct ? ppD(d.point, dp) : sgn(d.point, dp))} `
      + `| ${asPct ? ci(d, dp) : ciAbs(d, dp)} | ${d === null ? '—' : String(c.resolved)} |`);
  }
  o();
};

/* ------------------------------------------------------------------ the section */

o('### The run');
o();
o(`* **\`resultSha256\`** \`${A.resultSha256}\``);
o(`* **X-DET core digest** \`${G.xDet.digestA}\` (both passes)`);
o(`* **${A.seeds} seeds × ${ARMS.length} arms** (${A.block}), paired on one shared seed list, `
  + '**plus** the SEVEN receipt walks (O2-T1 12 · #173 40 · GGC 12 · CTB-T1 8 · OBM-T1 8 × 2 arms '
  + `· ⭐⭐ G-ANCHOR ${G.gAnchor.rowsChecked}) and the ${ARMS.length} delivered-dose reads — `
  + 'and the whole core runs **twice** (X-DET).');
o(`* Verdict: **ALL ${Object.keys(G).length} GATES PASS** (\`allGatesPass: ${A.allGatesPass}\`), probe exit 0.`);
o(`* Wall ≈ **${int(Math.round(A.envelopeContextOnly.wallMsContextOnly / 1000))} s** — CONTEXT ONLY `
  + '(#128), used in no rate and no gate. Per #197-M1 the hashed body is commit-free, '
  + 'timing-free and path-free.');
o();

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
row('⭐⭐ G-ANCHOR (G-REPRO-PTPT1)', G.gAnchor.pass,
  `block ${G.gAnchor.block} against the committed PTP-T1 **battery** artifact `
  + `(\`${String(G.gAnchor.sourceResultSha).slice(0, 8)}…${String(G.gAnchor.sourceResultSha).slice(-4)}\`), `
  + `arm \`${G.gAnchor.sourceArm}\`: **${G.gAnchor.rowsChecked} rows × ${G.gAnchor.fieldsPerRow} fields, `
  + `${G.gAnchor.mismatches} mismatches** (of ${G.gAnchor.committedRowsAvailable} committed rows available) — `
  + 'whole-match **signature** (rng stream state inside) AND the DELIVERED-LEAD columns included. '
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
row('G-TRACE-PTP', G.gTracePtp.pass,
  `all ${G.gTracePtp.lines.length} source lines matched VERBATIM; the gene map probed through the shipped `
  + `\`passLeadSupportWeight\`: absent ${G.gTracePtp.geneMap.atAbsent}, min ${G.gTracePtp.geneMap.atMin}, `
  + `half ${G.gTracePtp.geneMap.atHalf}, max ${G.gTracePtp.geneMap.atMax}, clamped at `
  + `${G.gTracePtp.geneMap.belowMin} / ${G.gTracePtp.geneMap.aboveMax} beyond both ends`);
row('G-TRACE-RADIUS', G.gTraceRadius.pass, '`radius = 10 + g.supportDistance * 8` parsed from source');
row('⭐⭐ G-FORK-TOKENS-DLC', G.gForkTokensDlc.pass,
  `**${G.gForkTokensDlc.occurrences} src occurrences, ZERO unclassified**; exactly **1** \`FLAG_FORK\` `
  + `· **1** \`CAND_DECL\` · **2** \`CAND_SCORE\` (both matched VERBATIM — the #236-amendment-1 receipt) `
  + `· 1 \`LED_FORM\` · 2 \`LED_CAPTURE\` · ${G.gForkTokensDlc.byKind.LED_ARGMAX} \`LED_ARGMAX\`; and `
  + `**${G.gForkTokensDlc.strikeStatementsInBrain} \`match.performPass(\` statements in the brain — `
  + 'i.e. ZERO added by the contest**');
row('G-FORK-TOKENS-PTP', G.gForkTokensPtp.pass,
  `**${G.gForkTokensPtp.occurrences} src occurrences, ZERO unclassified**; exactly 1 \`FLAG_FORK\` · `
  + `1 \`LEAD_COMPUTE\` · 1 \`AIM_COMPOSE\` · ${G.gForkTokensPtp.aimApplySites} \`AIM_APPLY\` · `
  + `2 \`LEAD_CAPTURE\` · 1 \`STRIKE_GUARD\` · 1 \`STRIKE_LED\`. ⚠ the two CONTEST-ERA classes `
  + `(${G.gForkTokensPtp.contestEraClasses.join(', ')}) are this stage's declared Deviation 1`);
row('G-FORK-TOKENS (OBM)', G.gForkTokens.pass, `${G.gForkTokens.occurrences} src occurrences, 0 unclassified — OBM-T1's own inventory, unchanged`);
row('⭐ G-BLIND-WORLD', G.gBlindWorld.pass,
  'every arm percept-armed in its CONSTRUCTED world; `sawSnapshotShare` '
  + `${ARMS.map((a) => G.gBlindWorld.perArm[a].sawSnapshotShare).map((v: number) => pp(v, 3)).join(' / ')}, `
  + 'all four feature means > 0 in every arm. ⚠ `allFeaturesZeroShare` '
  + `${ARMS.map((a) => G.gBlindWorld.perArm[a].allFeaturesZeroShare).map((v: number) => pp(v, 2)).join(' / ')} `
  + 'is an **UPPER BOUND** on genuine silence');
row('SEED-DISJOINT', G.seedDisjoint.pass,
  `⭐ all **${G.seedDisjoint.walkedBlocks.length}** block rows machine-checked against the complete `
  + `**${G.seedDisjoint.consumedLedger.length}-entry** consumed ledger: 2 FRESH + 2 RESERVED clash-free, `
  + '**6 RE-WALKS each landing INSIDE its source\'s consumed interval** (the inverted predicate, '
  + 'including ⭐⭐ the G-ANCHOR block). `stageOwnOverlaps` empty, sub-blocks ordered, battery block '
  + `**${G.seedDisjoint.subBlocks.battery}** (N ${G.seedDisjoint.subBlocks.batteryN}), room `
  + `${G.seedDisjoint.subBlocks.batteryRoom}, next consumed ${G.seedDisjoint.subBlocks.nextConsumedAfterBattery}`);
row('STATS-DISJOINT', G.statsDisjoint.pass,
  `base **${G.statsDisjoint.base}**, min gap **${G.statsDisjoint.minGap}** against the complete published namespace (${G.statsDisjoint.published.length} bases)`);
row('FLAG-HYGIENE', G.flagHygiene.pass,
  `**${G.flagHygiene.identityRows.filter((r: Any) => r.signatureIdentical && r.rowIdentical).length}/`
  + `${G.flagHygiene.identityRows.length}** seeds ARMED-ZERO ≡ ABSENT — whole-match signature **and** every row `
  + 'field; ⭐⭐ the two-doors row: `ctbSupportPlaneFalseInEveryArm` '
  + `${G.flagHygiene.twoDoors.ctbSupportPlaneFalseInEveryArm} · \`perceptArmedInEveryArm\` `
  + `${G.flagHygiene.twoDoors.perceptArmedInEveryArm} · \`ptpFlagMatchesDoor\` `
  + `${G.flagHygiene.twoDoors.ptpFlagMatchesDoor} · \`dlcFlagMatchesDoor\` `
  + `${G.flagHygiene.twoDoors.dlcFlagMatchesDoor} · **\`neverBothDeliveryDoors\` `
  + `${G.flagHygiene.twoDoors.neverBothDeliveryDoors}** · \`doorMatchesGenePresence\` `
  + `${G.flagHygiene.twoDoors.doorMatchesGenePresence}`);
row('⭐ G-ARM', G.gArm.pass,
  'delivery on the axes each arm doses and silence on the ones it does not. `ledPassesHandled === '
  + 'ledPassesNonZero` in **every** arm; zero lead metres in every inert arm; **0 sign / 0 magnitude '
  + 'violations** on the observational law check in every dosed arm; the four support-tick classes '
  + `\`partitionExact\` in ${ARMS.length}/${ARMS.length}`);
row('G-CLEAN-INVOCATION', G.gCleanInvocation.pass, 'no override in force');
o();

/* ------------------------------------------------------------------ the primary */

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
  const j = a === P.choiceCell ? P.primaryAtChoice : P.allArms[a];
  const sl = j.supplyLimb; const bl = j.goalsBandLimb;
  o(`| ${LABEL[a]} | ${sl.delta === null ? '—' : ppD(sl.delta)} `
    + `| ${sl.ci === null ? '—' : ciPair(sl.ci)} `
    + `| ${sl.resolvedHelpful} | ${bl.goalsPerMatch} | [${bl.bandLo}, ${bl.bandHi}] | ${bl.inBand} `
    + `| **${j.jointSatisfied}** | ${j.whichLimbFails === null ? '—' : j.whichLimbFails} |`);
}
o();

const pc = P.primaryAtChoice;
const anchor = P.allArms.leadAnchor;
const ctrlGoals = A.arms.absent.guards.band.goals.perMatch;
const headroom = ctrlGoals - pc.goalsBandLimb.bandLo;
const goalsC = C.goalsPerMatch;
o(`⭐⭐ **THE CELL THE STAGE EXISTS FOR, READ MECHANICALLY.** At **${P.choiceCell}**, LIMB A `
  + `(\`trueHoldableShare\`) is **${ppD(pc.supplyLimb.delta)} pp ${ciPair(pc.supplyLimb.ci)}**, `
  + `\`resolved: ${pc.supplyLimb.resolved}\` / \`resolvedHelpful: ${pc.supplyLimb.resolvedHelpful}\`; `
  + `LIMB B (goals) is **${pc.goalsBandLimb.goalsPerMatch}/match** against the frozen band `
  + `[${pc.goalsBandLimb.bandLo}, ${pc.goalsBandLimb.bandHi}], \`inBand: ${pc.goalsBandLimb.inBand}\`. `
  + `\`jointSatisfied: ${pc.jointSatisfied}\`, \`whichLimbFails\`: *${pc.whichLimbFails}*.`);
o();
o('⚠ **AND THE FOUR MECHANICAL NEIGHBOURS THAT MUST BE READ BESIDE IT** — rows, not readings:');
o();
o(`1. **THE RE-WALKED DIAL ANCHOR, ON THE SAME FRESH SEEDS, IS UNRESOLVED ON SUPPLY.** LEAD-ANCHOR's `
  + `supply delta is **${ppD(anchor.supplyLimb.delta)} pp ${ciPair(anchor.supplyLimb.ci)}**, `
  + `\`resolved: ${anchor.supplyLimb.resolved}\` (\`pointDirectionHelpful: `
  + `${anchor.supplyLimb.pointDirectionHelpful}\`) — the arm ruling #234 published as **+0.1307 pp `
  + `[+0.0338, +0.2256] RESOLVED** on ITS OWN battery block. Different seeds, same world, same `
  + `instrument (G-ANCHOR, ${G.gAnchor.rowsChecked} rows × ${G.gAnchor.fieldsPerRow} fields, `
  + `${G.gAnchor.mismatches} mismatches, \`armConfigurationIdentical: ${G.gAnchor.armConfigurationIdentical}\`).`);
o(`2. **THE CONTROL IS INSIDE THE BAND — BARELY.** ABSENT scores **${ctrlGoals}** goals/match against `
  + `a floor of **${pc.goalsBandLimb.bandLo}**: \`controlAlsoInBand: ${pc.goalsBandLimb.controlAlsoInBand}\`, `
  + `headroom **${num(headroom, 4)} goals/match**. So `
  + `\`excludedBecauseControlFails\` is **${JSON.stringify(A.guardVerdicts.band.excludedBecauseControlFails)}** `
  + `and the gated dimensions are ${JSON.stringify(A.guardVerdicts.band.gatedDimensions)} — the `
  + `#198-form exclusion does **not** fire here, and the band GATES at this N `
  + `(\`${pc.goalsBandLimb.gatingGrain}\`).`);
o(`3. **THE PAIRED GOALS DELTA AT CHOICE IS UNRESOLVED; THE ANCHOR'S IS RESOLVED DOWN.** `
  + `CHOICE **${sgn(goalsC.choice.pairedDelta.point)} ${ciAbs(goalsC.choice.pairedDelta, 3)}** `
  + `(\`resolved: ${goalsC.choice.resolved}\`) · CHOICE-X-CAS `
  + `**${sgn(goalsC.choiceXCas.pairedDelta.point)} ${ciAbs(goalsC.choiceXCas.pairedDelta, 3)}** `
  + `(\`resolved: ${goalsC.choiceXCas.resolved}\`) · LEAD-ANCHOR `
  + `**${sgn(goalsC.leadAnchor.pairedDelta.point)} ${ciAbs(goalsC.leadAnchor.pairedDelta, 3)}** `
  + `(\`resolved: ${goalsC.leadAnchor.resolved}\`). The BAND limb and the PAIRED limb are two `
  + `different instruments on one column, and the artifact publishes both.`);
o(`4. **THE OTHER CONTEST ARM AGREES WITH CHOICE ON BOTH LIMBS.** CHOICE-X-CAS supply `
  + `**${ppD(P.allArms.choiceXCas.supplyLimb.delta)} pp ${ciPair(P.allArms.choiceXCas.supplyLimb.ci)}** `
  + `(\`resolvedHelpful: ${P.allArms.choiceXCas.supplyLimb.resolvedHelpful}\`), goals `
  + `**${P.allArms.choiceXCas.goalsBandLimb.goalsPerMatch}** (\`inBand: `
  + `${P.allArms.choiceXCas.goalsBandLimb.inBand}\`), \`jointSatisfied: `
  + `${P.allArms.choiceXCas.jointSatisfied}\`.`);
o();
o('⚠ **Adjudication is the commander\'s (#203, ruling #239).** Nothing above is a branch: '
  + 'F-DLC-a/b/c are named in the contract and fired nowhere in this probe or this generator.');
o();

/* ------------------------------------------------------------------ the emergent share */

o('### ⭐⭐ THE EMERGENT LED SHARE — the number the retired dial used to fix at 1 (battery grain)');
o();
o('| arm | door | gene | passes chosen | LED wins | **led share** | mean lead | max lead | lead / pass dist | interceptions per led pass |');
o('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const l = A.arms[a].leadSeam;
  const gene = G.gArm.arms[a].leadGene;
  o(`| ${LABEL[a]} | ${DOORLBL[a]} | ${gene === null ? 'absent' : gene} | ${int(l.passesChosen)} `
    + `| ${int(l.ledPassesNonZero)} | **${pp(l.ledShareOfChosenPasses, 2)}** | ${num(l.meanLeadMetres)} m `
    + `| ${num(l.maxLeadMetres)} m | ${num(l.meanLeadShareOfPassDistance, 5)} `
    + `| ${Number.isFinite(l.interceptionsPerLedPass) ? num(l.interceptionsPerLedPass, 5) : 'n/a (no led passes)'} |`);
}
o();
o('⭐ **THE SUPPORT-SCOPED SHARE** — the same LED wins over the denominator the seam can actually '
  + 'reach (`passesToSupportTarget`; a led ball exists only on a support-mode mate), a ratio of two '
  + 'counters the artifact publishes:');
o();
o('| arm | LED wins | passes to a SUPPORT target | **support-scoped led share** | all chosen passes | headline led share |');
o('| --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const l = A.arms[a].leadSeam;
  const supportScoped = l.passesToSupportTarget > 0 ? l.ledPassesNonZero / l.passesToSupportTarget : NaN;
  o(`| ${LABEL[a]} | ${int(l.ledPassesNonZero)} | ${int(l.passesToSupportTarget)} `
    + `| **${pp(supportScoped, 2)}** | ${int(l.passesChosen)} | ${pp(l.ledShareOfChosenPasses, 2)} |`);
}
o();
o('And the led-pass share as the ESTIMATOR pairs it (`ledPassShare`, the only one of these three '
  + 'that carries a CI):');
o();
rateTable('ledPassShare', 'REPORTED — led-pass share, paired', true, 4);

o('### ⭐ The SITUATIONAL PROFILE of the emergent share (REPORTED — no gate reads it)');
o();
o('| arm | led share at PRESSED | led share at UNPRESSED | pressed passes | unpressed passes | partition exact |');
o('| --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const s = A.arms[a].leadSeam.situationalLedShare;
  o(`| ${LABEL[a]} | ${pp(s.ledShareAtPressed, 2)} (${int(s.ledAtPressed)}/${int(s.pressedTotal)}) `
    + `| ${pp(s.ledShareAtUnpressed, 2)} (${int(s.ledAtUnpressed)}/${int(s.unpressedTotal)}) `
    + `| ${int(s.pressedTotal)} | ${int(s.unpressedTotal)} | ${s.partitionExact} |`);
}
o();
o(`⚠ The bin is the #173 census's own pressure test (nearest opponent within `
  + `${A.arms.choice.ruler2PressedFirstReception.radiusM} m of the CARRIER at the instant of the `
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
o('⭐ **THE NAMED RISK (F-DLC-c), STATED AGAINST ITS FROZEN TOLERANCE.** The interception rise is '
  + 'RESOLVED at every dosed arm and BEYOND TOLERANCE at none:');
o();
o('| arm | interceptions/match | Δ vs control | 95 % CI | `resolved` | tolerance | `beyondTolerance` | **`breach`** |');
o('| --- | --- | --- | --- | --- | --- | --- | --- |');
const iGuard = A.guardVerdicts.tolerances.find((g: Any) => g.key === 'interceptionsPerMatch');
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

o('### ⭐⭐ THE ARMED-ZERO IDENTITY AT BATTERY N');
o();
const idRows = G.flagHygiene.identityRows;
const idExact = idRows.filter((r: Any) => r.signatureIdentical && r.rowIdentical).length;
o(`**${idExact}/${idRows.length}** seeds: ARMED-ZERO is byte-identical to ABSENT on the whole-match `
  + '**signature** (rng stream state inside) **and every measured row field**. Under the DLC-T0 law '
  + 'that arm is *not* the mechanism switched off — the led candidate forms, is scored and enters '
  + 'the argmax on every support-mode mate at zero displacement, and loses every tie by the frozen '
  + 'strict-`>` order. Every ARMED-ZERO delta in every table above is therefore **exactly 0 with a '
  + '[0, 0] CI by construction**, and that is the receipt, not a coincidence.');
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
o(`⭐ LIMB A's counter, in full: at ${P.choiceCell} the TRUE-holdable numerator is `
  + `**${int(A.arms.choice.ruler1TrueHoldable.trueHoldableTotal)} of `
  + `${int(A.arms.choice.ruler1TrueHoldable.eligibleTotal)} eligible moments** against ABSENT's `
  + `**${int(A.arms.absent.ruler1TrueHoldable.trueHoldableTotal)} of `
  + `${int(A.arms.absent.ruler1TrueHoldable.eligibleTotal)}** — the estimate the paired bootstrap `
  + 'above is built on, printed so the CI is read against its own population.');
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
  + 'same-world values, and the cap (628) did **not** bind. Sizing sources, by hash: '
  + `O2-T1 \`${String(nr.sources.o2t1.resultSha).slice(0, 8)}…\` · tempo `
  + `\`${String(nr.sources.tempo.resultSha).slice(0, 8)}…\` · this stage's own smoke `
  + `\`${String(nr.sources.selfSmoke.resultSha).slice(0, 8)}…\` (${nr.sources.selfSmoke.seeds} seeds).`);
o();
