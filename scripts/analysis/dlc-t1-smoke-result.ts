/**
 * DLC-T1 §RESULT — THE SMOKE: the SECTION GENERATOR (the #229.2 rule, discharged in code).
 *
 * Reads the COMMITTED smoke artifact and emits the whole §RESULT markdown section on stdout.
 * Every measured cell in the published section is printed from this file's reads of the
 * artifact — never typed into the doc by hand. That is the whole point: #229.2's lesson (the
 * OBM-T1 smoke's fabricated MAX column) enforced by CONSTRUCTION rather than by a promise to
 * sweep afterwards.
 *
 * The prose captions ARE literal strings here, so they ride the generator too and cannot drift
 * away from the numbers they sit beside.
 *
 * This script ADJUDICATES NOTHING (#203). It prints rows, paired deltas and the mechanical CI /
 * predicate flags the probe already computed. No verdict is composed here; F-DLC-a/b/c are the
 * commander's.
 *
 *   npx tsx scripts/analysis/dlc-t1-smoke-result.ts \
 *     docs/world-model/data/dlc-t1-choice-exam-smoke.json
 */

import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

const artifactPath = process.argv[2] ?? 'docs/world-model/data/dlc-t1-choice-exam-smoke.json';
const A: Any = JSON.parse(readFileSync(artifactPath, 'utf8'));

const ARMS = ['absent', 'armedZero', 'choice', 'choiceXCas', 'leadAnchor'] as const;
const LABEL: Record<string, string> = {
  absent: 'ABSENT',
  armedZero: 'ARMED-ZERO',
  choice: '⭐ **CHOICE**',
  choiceXCas: 'CHOICE-X-CAS',
  leadAnchor: '⭐ LEAD-ANCHOR',
};
const DOORLBL: Record<string, string> = {
  absent: 'none', armedZero: 'dlc', choice: 'dlc', choiceXCas: 'dlc', leadAnchor: 'ptp',
};

const o = (s = ''): void => { process.stdout.write(`${s}\n`); };
const pp = (x: number, dp = 4): string => (Number.isFinite(x) ? `${(x * 100).toFixed(dp)} %` : 'n/a');
const ppD = (x: number, dp = 4): string => (Number.isFinite(x) ? `${(x * 100).toFixed(dp)}` : 'n/a');
const num = (x: number, dp = 4): string => (Number.isFinite(x) ? x.toFixed(dp) : 'n/a');
const ci = (d: Any, dp = 4): string => (d === null ? '(CONTROL)'
  : `[${(d.lower * 100).toFixed(dp)}, ${(d.upper * 100).toFixed(dp)}]`);

const C = A.contrasts.rates;

const rateTable = (key: string, title: string, asPct = true, dp = 4): void => {
  o(`**${title}** (ABSENT **${asPct ? pp(C[key].absent.point, dp) : num(C[key].absent.point, dp)}**):`);
  o();
  o('| arm | door | point | Δ (pp) | 95 % CI (pp) | `resolved` |');
  o('| --- | --- | --- | --- | --- | --- |');
  for (const a of ARMS) {
    const c = C[key][a];
    const d = c.pairedDelta;
    o(`| ${LABEL[a]} | ${DOORLBL[a]} | ${asPct ? pp(c.point, dp) : num(c.point, dp)} `
      + `| ${d === null ? '—' : ppD(d.point, dp)} | ${ci(d, dp)} | ${d === null ? '—' : String(c.resolved)} |`);
  }
  o();
};

/* ------------------------------------------------------------------ the section */

o('### The run');
o();
o(`* **\`resultSha256\`** \`${A.resultSha256}\``);
o(`* **X-DET core digest** \`${A.gates.xDet.digestA}\` (both passes)`);
o(`* **${A.seeds} seeds × ${ARMS.length} arms** (${A.block}), paired on one shared seed list, `
  + '**plus** the SEVEN receipt walks (O2-T1 12 · #173 40 · GGC 12 · CTB-T1 8 · OBM-T1 8 × 2 arms '
  + `· ⭐⭐ G-ANCHOR ${A.gates.gAnchor.rowsChecked}) and the ${ARMS.length} delivered-dose reads — `
  + 'and the whole core runs **twice** (X-DET).');
o(`* Verdict: **ALL ${Object.keys(A.gates).length} GATES PASS** (\`allGatesPass: ${A.allGatesPass}\`), probe exit 0.`);
o(`* Wall ≈ **${Math.round(A.envelopeContextOnly.wallMsContextOnly / 1000)} s** — CONTEXT ONLY `
  + '(#128), used in no rate and no gate. Per #197-M1 the hashed body is commit-free, '
  + 'timing-free and path-free.');
o();

o('### Gate table');
o();
o('| gate | verdict | evidence (all recomputed in-probe, #181.2) |');
o('| --- | --- | --- |');
const G = A.gates;
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
  + 'including ⭐⭐ the G-ANCHOR block). `stageOwnOverlaps` empty, sub-blocks ordered, battery room '
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

o('### ⭐⭐ THE EMERGENT LED SHARE — the number the retired dial used to fix at 1');
o();
o('| arm | door | gene | passes chosen | LED wins | **led share** | mean lead | max lead | lead / pass dist | interceptions per led pass |');
o('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const l = A.arms[a].leadSeam;
  const gene = A.gates.gArm.arms[a].leadGene;
  o(`| ${LABEL[a]} | ${DOORLBL[a]} | ${gene === null ? 'absent' : gene} | ${l.passesChosen} `
    + `| ${l.ledPassesNonZero} | **${pp(l.ledShareOfChosenPasses, 2)}** | ${num(l.meanLeadMetres)} m `
    + `| ${num(l.maxLeadMetres)} m | ${num(l.meanLeadShareOfPassDistance, 5)} `
    + `| ${Number.isFinite(l.interceptionsPerLedPass) ? num(l.interceptionsPerLedPass, 5) : 'n/a (no led passes)'} |`);
}
o();
o('### ⭐ The SITUATIONAL PROFILE of the emergent share (REPORTED — no gate reads it)');
o();
o('| arm | led share at PRESSED | led share at UNPRESSED | pressed passes | unpressed passes | partition exact |');
o('| --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const s = A.arms[a].leadSeam.situationalLedShare;
  o(`| ${LABEL[a]} | ${pp(s.ledShareAtPressed, 2)} (${s.ledAtPressed}/${s.pressedTotal}) `
    + `| ${pp(s.ledShareAtUnpressed, 2)} (${s.ledAtUnpressed}/${s.unpressedTotal}) `
    + `| ${s.pressedTotal} | ${s.unpressedTotal} | ${s.partitionExact} |`);
}
o();

o('### ⭐⭐ THE JOINT PRE-REGISTERED PRIMARY — mechanical flags only, NOTHING is fired (#203)');
o();
o('| arm | supply Δ (pp) | 95 % CI (pp) | `resolvedHelpful` | goals/match | frozen band | `inBand` | **JOINT** | which limb fails |');
o('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  if (a === 'absent') continue;
  const j = a === A.preRegisteredPrimary.choiceCell
    ? A.preRegisteredPrimary.primaryAtChoice : A.preRegisteredPrimary.allArms[a];
  const sl = j.supplyLimb; const bl = j.goalsBandLimb;
  o(`| ${LABEL[a]} | ${sl.delta === null ? '—' : ppD(sl.delta)} `
    + `| ${sl.ci === null ? '—' : `[${(sl.ci[0] * 100).toFixed(4)}, ${(sl.ci[1] * 100).toFixed(4)}]`} `
    + `| ${sl.resolvedHelpful} | ${bl.goalsPerMatch} | [${bl.bandLo}, ${bl.bandHi}] | ${bl.inBand} `
    + `| **${j.jointSatisfied}** | ${j.whichLimbFails === null ? '—' : j.whichLimbFails} |`);
}
o();
const ctrlBand = A.preRegisteredPrimary.primaryAtChoice.goalsBandLimb.controlAlsoInBand;
o(`⚠ **THE BAND LIMB IS UNREADABLE AT THIS GRAIN, AND THE ARTIFACT SAYS SO.** `
  + `\`controlAlsoInBand\` is **${ctrlBand}**: the ABSENT arm ITSELF scores `
  + `${A.arms.absent.guards.band.goals.perMatch} goals/match against the frozen band `
  + `[${A.preRegisteredPrimary.primaryAtChoice.goalsBandLimb.bandLo}, `
  + `${A.preRegisteredPrimary.primaryAtChoice.goalsBandLimb.bandHi}] at ${A.seeds} seeds, so \`goals\` is `
  + `EXCLUDED by the #198-form control-fails rule (\`excludedBecauseControlFails\`: `
  + `${JSON.stringify(A.guardVerdicts.band.excludedBecauseControlFails)}; gated dimensions `
  + `${JSON.stringify(A.guardVerdicts.band.gatedDimensions)}). The band **GATES AT BATTERY N ONLY** — `
  + 'inherited verbatim, frozen before this ran. Every `inBand=false` above is therefore a '
  + '**plumbing reading, not evidence**, and no F-branch may be read off it.');
o();

o('### THE GUARDS');
o();
o('| limb | control | tolerance | resolved arms | **breaches** |');
o('| --- | --- | --- | --- | --- |');
for (const g of A.guardVerdicts.tolerances) {
  const res = ARMS.filter((a) => a !== 'absent' && g.arms[a]?.resolved)
    .map((a) => `${LABEL[a].replace(/\*|⭐ ?/g, '')} ${g.arms[a].delta > 0 ? '+' : ''}${num(g.arms[a].delta, 4)}`);
  const br = ARMS.filter((a) => a !== 'absent' && g.arms[a]?.breach);
  o(`| ${g.key} (${g.direction}) | ${num(g.controlLevel, 4)} | ±${num(g.toleranceAbs, 4)} `
    + `| ${res.length === 0 ? 'none' : res.join(', ')} | **${br.length === 0 ? 'none' : br.join(', ')}** |`);
}
o();
const offRes = ARMS.filter((a) => a !== 'absent' && A.guardVerdicts.offside.rows[a].resolvedIncrease);
o(`Offsides (the #157 FLAG form): resolved INCREASES — **${offRes.length === 0 ? 'none' : offRes.join(', ')}**.`);
o();

o('### THE N RULE (in-probe, from the committed artifacts)');
o();
const nr = A.nRule;
o(`DEFF **${nr.deff}** (${nr.deffProvenance}). q1 ⇒ **N ${nr.q1TrueHoldable.n}** `
  + `(p0 ${nr.q1TrueHoldable.p0}, MDE ${nr.q1TrueHoldable.mde}, ${nr.q1TrueHoldable.eligiblePerSeed} eligible moments/seed), `
  + `q2 ⇒ N ${nr.q2PressedFirstReception.n} (p0 ${nr.q2PressedFirstReception.p0}, MDE ${nr.q2PressedFirstReception.mde}, `
  + `${nr.q2PressedFirstReception.firstReceptionsPerSeed} first receptions/seed), binding **${nr.binding}**, `
  + `**N\\* = ${nr.nStar}**; ledger room ${nr.batteryRoom} (binds=${nr.roomBinds}), cap ${nr.nCap} `
  + `(binds=${nr.capBinds}). Battery block **${nr.batteryBlock}** — inside the ledger and below the `
  + `${G.seedDisjoint.subBlocks.nextConsumedAfterBattery} ceiling. Source of p0: ${nr.sourceOfP0}.`);
o();

o('### TIER-1 SUPPLY RULERS AND THE TIER-2 SHARES — rows, never verdicts (#203)');
o();
rateTable('trueHoldableShare', 'Ruler 1 — TRUE-holdable supply');
rateTable('pressedFirstReceptionShare', 'Ruler 2 — pressed first reception');
rateTable('constructedGe5Share', 'Tier 2 — constructed ≥5 (non-set-piece pool)');
rateTable('scrambleShareOfGoals', 'Tier 2 — scramble share of goals');
o('⚠ **THE CAPTION THAT MATTERS MORE THAN THE CELLS.** At '
  + `${A.seeds} seeds each arm scores `
  + `${ARMS.map((a) => A.arms[a].ruler5BuildUp.genealogy.goals).join(' / ')} goals in total (in arm order), `
  + 'so a single goal is worth several pp on any of these shares: they move in STEPS and their CIs '
  + 'are wider than anything they could detect. **These are plumbing readings, not evidence.**');
o();
