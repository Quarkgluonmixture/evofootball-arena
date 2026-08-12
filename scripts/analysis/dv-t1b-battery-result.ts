/**
 * DV-T1b §RESULT — THE VIRGIN-SEED POWER EXTENSION: the SECTION GENERATOR (#229.2 in code).
 *
 * Reads the COMMITTED artifact and emits the whole battery §RESULT markdown section on stdout.
 * Every measured cell in the published section is printed from this file's reads of the artifact —
 * never typed into the doc by hand. #229.2's lesson enforced by CONSTRUCTION.
 *
 * ⚠ THIS SCRIPT ADJUDICATES NOTHING (#203). It prints rows, paired deltas, the mechanical CI /
 * predicate flags the probe already computed, and the ROUTE the frozen letter selects. Which route
 * the programme TAKES is the commander's — and route (c) especially is a commander's honesty
 * ruling, not a probe output.
 *
 * ⚠ IT QUOTES NO COST PERCENTAGE (#250.4): this stage measures no cost.
 *
 *   npx tsx scripts/analysis/dv-t1b-battery-result.ts [docs/world-model/data/dv-t1b-power-extension.json]
 */

import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

const artifactPath = process.argv[2] ?? 'docs/world-model/data/dv-t1b-power-extension.json';
const A: Any = JSON.parse(readFileSync(artifactPath, 'utf8'));

const ARMS = ['absent', 'planeAnchor', 'dvTruthP'] as const;
const LABEL: Record<string, string> = {
  absent: 'ABSENT (control)',
  planeAnchor: '⭐⭐ PLANE-ANCHOR (#244\'s arm)',
  dvTruthP: '⭐⭐ **DV-TRUTH-P** (the PARITY rung)',
};
const o = (s = ''): void => { process.stdout.write(`${s}\n`); };
const n6 = (x: Any): string => (x === null || x === undefined ? 'n/a' : String(x));
const ci = (d: Any): string => (d === null || d === undefined ? 'n/a'
  : `${d.point} [${d.lower}, ${d.upper}]`);
const yn = (b: Any): string => (b === true ? '**yes**' : b === false ? 'no' : 'n/a');

const G = A.gates;
const P = A.preRegisteredPrimary;
const R = A.powerRule;

/* ---------------------------------------------------------------- the run */
o('### The run');
o();
o(`* **\`resultSha256\`** \`${A.resultSha256}\``);
o(`* **G-DET core digest** \`${G.xDet.digestA}\` (both passes)`);
o(`* **${A.seeds} seeds × ${ARMS.length} arms** (block ${A.block}), paired on one shared seed `
  + 'list, **plus** the EIGHT receipt walks (O2-T1 · #173 · GGC · CTB-T1 · OBM-T1 × 2 arms · '
  + 'G-ANCHOR on DLC-T1s\'s own `plane` arm · ⭐⭐ **G-REPRO-T1 on DV-T1\'s own battery block, on '
  + `all three of this exam's arms**), the ${ARMS.length} delivered-dose reads, the `
  + `${ARMS.length} strike reads (each a traced match + its untraced LOCKSTEP TWIN) and the H-250a `
  + 'flip-vs-suppress counterfactual at the parity dose — and the whole core runs **twice** '
  + '(G-DET).');
o(`* Verdict: **ALL ${Object.keys(G).length} GATES ${A.allGatesPass ? 'PASS' : 'DID NOT ALL PASS'}** `
  + `(\`allGatesPass: ${A.allGatesPass}\`).`);
o('* Wall is CONTEXT ONLY (#128) and rides the UNHASHED envelope with the git head and the paths '
  + '(#197-M1 / the #250.3 hygiene note), so `resultSha256` re-derives on another machine.');
o();

/* -------------------------------------------------- the ex-ante N, executed */
o('### ⭐⭐ THE EX-ANTE N, AS EXECUTED (G-N)');
o();
o(`The target was read from DV-T1's committed artifact (\`${R.source.field}\`, `
  + `\`resultSha256\` \`${String(R.source.resultSha).slice(0, 8)}…\`): point **${R.source.point}**, `
  + `CI **[${R.source.ci[0]}, ${R.source.ci[1]}]** at **${R.source.clusters}** clusters.`);
o();
o('| step | value |');
o('| --- | ---: |');
o(`| CI half-width at the source N | ${R.halfWidthSource} |`);
o(`| SE at the source N (half-width / z.975) | ${R.seSource} |`);
o(`| SE required (\\|point\\| / (z.975 + z.80)) | ${R.seRequired} |`);
o(`| **N_raw** = ceil(nSource · (se_source/se_required)²) | **${R.nRaw}** |`);
o(`| cap ${R.nCap} binds | ${R.capBinds} |`);
o(`| ledger room ${R.batteryRoom} binds | ${R.roomBinds} |`);
o(`| **N\\*** | **${R.nStar}** |`);
o(`| frozen literal in the probe | ${R.nFrozen} (matches the derivation: **${R.frozenMatchesDerivation}**) |`);
o(`| MDE asked for | ${R.mdeAskedFor} |`);
o(`| ⭐ **MDE BOUGHT at N\\*** | **${R.mdeBoughtAtNStar}** |`);
o(`| ex-ante EXPECTED anchor CI half-width at N\\* | ${R.expectedHalfWidthAtNStar} |`);
{
  const anchorD = A.contrasts.rates.trueHoldableShare.planeAnchor.pairedDelta;
  const realised = (anchorD.upper - anchorD.lower) / 2;
  o(`| ⭐ **REALISED anchor CI half-width at N\\*** | **${Number(realised.toFixed(9))}** |`);
  o();
  o('⭐ **THE ASSUMPTION THIS RULE MADE, CHECKED AFTER THE FACT** (§N declared it ex ante): the '
    + 'power rule assumed this stage\'s per-seed cluster variance on `trueHoldableShare` would be '
    + `DV-T1's. The realised half-width is **${Number(realised.toFixed(9))}** against an ex-ante `
    + `expectation of **${R.expectedHalfWidthAtNStar}** — a ratio of `
    + `**${Number((realised / R.expectedHalfWidthAtNStar).toFixed(4))}×**. `
    + `${R.capForkNote}`);
}
o();

/* ------------------------------------------------------------- gate table */
o('### Gate table');
o();
o('| gate | result | evidence (all recomputed in-probe, #181.2) |');
o('| --- | --- | --- |');
const ev: Record<string, () => string> = {
  xDet: () => `two passes of the whole core, identical digests \`${String(G.xDet.digestA).slice(0, 16)}…\``,
  xFpProd: () => `observed \`${G.xFpProd.observed}\` = baseline (seed ${G.xFpProd.seed}, ${G.xFpProd.seasons} seasons)`,
  xSrcUntouched: () => '`git diff --stat -- src` **EMPTY** — no engine byte moved',
  gReproT1: () => '⭐⭐ **THE IDENTITY OF RECORD**: block ' + `${G.gReproT1.block} against DV-T1's `
    + `committed battery artifact (\`${String(G.gReproT1.sourceResultSha).slice(0, 8)}…\`), on ALL `
    + `${ARMS.length} of this exam's own arms through this exam's own constructors — `
    + ARMS.map((a) => `${a} ${G.gReproT1.perArm[a].rowsChecked}×${G.gReproT1.fieldsPerRow} fields, `
      + `${G.gReproT1.perArm[a].mismatches} mismatches`).join(' · ')
    + ` (of ${G.gReproT1.perArm.absent.committedRowsAvailable} committed rows available per arm); `
    + 'whole-match signature (rng stream state inside) and the delivered-strike columns included',
  gN: () => `frozen N ${G.gN.nFrozen} = derived N\\* ${G.gN.nStar} (**${G.gN.frozenMatchesDerivation}**), `
    + `battery ran at ${G.gN.runN}; se(source) ${G.gN.seSource} · se(required) ${G.gN.seRequired} · `
    + `MDE bought ${G.gN.mdeBoughtAtNStar}; cap binds ${G.gN.capBinds} · room binds ${G.gN.roomBinds}`,
  gAnchor: () => `block ${G.gAnchor.block} against the committed DLC-T1s battery artifact `
    + `(\`${String(G.gAnchor.sourceResultSha).slice(0, 8)}…\`), arm \`${G.gAnchor.sourceArm}\`: `
    + `**${G.gAnchor.rowsChecked} rows × ${G.gAnchor.fieldsPerRow} fields, ${G.gAnchor.mismatches} `
    + `mismatches** (of ${G.gAnchor.committedRowsAvailable} available) — ⭐ and its `
    + `configuration-identity conjunct is RE-DERIVED for this exam and INSIDE the pass predicate: `
    + `\`armConfigurationIdentical: ${G.gAnchor.armConfigurationIdentical}\` (#251.3 corrected at `
    + 'the source)',
  gForkTokensPtp: () => `${G.gForkTokensPtp.occurrences} src occurrences, `
    + `**${(G.gForkTokensPtp.unclassified as Any[]).length} unclassified**; `
    + `AIM_APPLY sites ${G.gForkTokensPtp.aimApplySites} (frozen at 3, UNCHANGED) and the risk-price `
    + `call site pinned at **${G.gForkTokensPtp.dvRiskPriceSites}**`,
  gForkTokensSp: () => `${G.gForkTokensSp.occurrences} src occurrences, `
    + `${(G.gForkTokensSp.unclassified as Any[]).length} unclassified — the plane's banked inventory unchanged`,
  gForkTokensDlc: () => `${G.gForkTokensDlc.occurrences} src occurrences, `
    + `${(G.gForkTokensDlc.unclassified as Any[]).length} unclassified`,
  gForkTokens: () => `${G.gForkTokens.occurrences} src occurrences, `
    + `${(G.gForkTokens.unclassified as Any[]).length} unclassified — OBM-T1's own inventory`,
  gReproCtbT1: () => `${G.gReproCtbT1.rowsChecked} rows × ${G.gReproCtbT1.fieldsPerRow} fields, `
    + `${G.gReproCtbT1.mismatches} mismatches (signature included)`,
  gReproO2T1: () => `${G.gReproO2T1.rowsChecked} rows, ${G.gReproO2T1.mismatches} mismatches`,
  gRepro173: () => `target ${JSON.stringify(G.gRepro173.target)} vs observed ${JSON.stringify(G.gRepro173.observed)}`,
  gReproGgc: () => `${G.gReproGgc.fieldsChecked ?? ''} committed fields, ${G.gReproGgc.mismatches} mismatches`,
  gReproObmT1: () => `${G.gReproObmT1.absentRowsChecked} + ${G.gReproObmT1.checkAndShowRowsChecked} rows × `
    + `${G.gReproObmT1.fieldsPerRow} fields, ${G.gReproObmT1.absentMismatches} / `
    + `${G.gReproObmT1.checkAndShowMismatches} mismatches (ABSENT / CHECK-AND-SHOW)`,
  gDose: () => `belief = the census table zone for zone (${JSON.stringify(G.gDose.beliefDose)}, `
    + `sha \`${String(G.gDose.censusResultSha).slice(0, 8)}…\`); PARITY frozen `
    + `${G.gDose.frozenParity} vs derived ${G.gDose.derivedParity}; gradient rung frozen `
    + `${G.gDose.frozenGradientRung} vs derived ${G.gDose.derivedGradientRung}; zero rung present `
    + `${G.gDose.zeroPresent}; every rung < 0.1 ${G.gDose.allRungsFarBelowOne}; ⭐ the DOSED rung `
    + `is PARITY ${G.gDose.dosedRungIsParity} (${G.gDose.dosedExposure})`,
  xNotable: () => `${G.xNotable.filesScanned} \`src/**\` files scanned against `
    + `${G.xNotable.needles.length} needles (the artifact name, the schema name, every zone hazard `
    + 'as written and as a formatted percentage) — **' + `${G.xNotable.hits.length} hits**`,
  flagHygiene: () => '⭐⭐ the DERIVED configuration predicate PASSES and is PROVED LIVE — all '
    + `${(G.flagHygiene.configIdentity.livenessProof as Any[]).length} mutants flipped it FALSE (`
    + (G.flagHygiene.configIdentity.livenessProof as Any[])
      .map((m: Any) => `${m.mutant}: broke=${m.brokeThePredicate}`).join(' · ')
    + `); ⭐ divergence ${G.flagHygiene.divergence.divergentSeeds}/`
    + `${G.flagHygiene.divergence.seeds} seeds (the parity dose really changes the world); the `
    + `doors row: dial never armed ${G.flagHygiene.twoDoors.dialNeverArmed} · contest never armed `
    + `${G.flagHygiene.twoDoors.contestNeverArmed} · DV flag matches declaration `
    + `${G.flagHygiene.twoDoors.dvFlagMatchesDeclaration} · DV genes as declared on all six views `
    + `${G.flagHygiene.twoDoors.dvGenesMatchDeclaration}`,
  gArm: () => 'plane membership re-derived through the shipped `groundStrikeGrid`: planeUnmatched '
    + ARMS.map((a) => G.gArm.arms[a].planeUnmatched).join(' / '),
  seedDisjoint: () => 'every block machine-checked against the complete consumed ledger '
    + `(${(G.seedDisjoint.consumedLedger as Any[]).length} entries, incl. **DV-T1's own six blocks** `
    + 'and DV-T0\'s ordered-skip band); the seven re-walks land INSIDE their sources under the '
    + 'inverted predicate, and every fresh/reserved block is virgin ground above 12,431,000',
  statsDisjoint: () => `base **${G.statsDisjoint.base}**, min gap **${G.statsDisjoint.minGap}** `
    + `against ${(G.statsDisjoint.published as Any[]).length} published bases`,
  gCleanInvocation: () => 'any DVT1B_N / DVT1B_SKIP_FP override is BY DEFINITION not the exam: the '
    + 'run is routed onto the exit-semantics guard block, this gate goes RED and the process exits 1',
};
for (const k of Object.keys(G)) {
  const g = G[k];
  const e = ev[k] ? ev[k]() : (g.note ? String(g.note).slice(0, 200) : 'see the artifact');
  o(`| \`${k}\` | ${g.pass ? '✅ PASS' : '❌ FAIL'} | ${e} |`);
}
o();

/* ----------------------------------------------------------- the doses */
o('### THE THREE ARMS AS EXECUTED (G-DOSE + FLAG-HYGIENE)');
o();
o('| arm | plane door | plane gene | `dvDeliveryValue` | `dvLossBelief` | `dvExposureWeight` |');
o('| --- | --- | ---: | --- | --- | ---: |');
for (const a of ARMS) {
  const e = G.flagHygiene.armConfigEcho[a];
  const dv = e.dv;
  o(`| ${LABEL[a]} | ${e.dlcStrikePlane ? '`sp` (the banked GROUND STRIKE PLANE)' : '— (none)'} `
    + `| ${n6(e.passLeadSupportGene)} | ${dv === null ? 'off' : 'ON'} `
    + `| ${dv === null ? '— (absent)' : JSON.stringify(dv.belief)} `
    + `| ${dv === null ? '— (absent)' : dv.exposure} |`);
}
o();
o(`The belief dose is DV-C0's committed table, read at exam time (${G.gDose.beliefSource}). The `
  + `exposure dose is the PARITY rung, re-derived here from DV-T0's own published numbers: mean `
  + `exposure **${G.gDose.meanExposurePublished}** and truth-dosed mean risk price `
  + `**${G.gDose.truthMeanRiskPricePublished}** give **${G.gDose.frozenParity}**.`);
o();

/* ------------------------------------------------------- delivered rate */
o('### ⭐ THE DELIVERED RATE PER ARM — the treatment AS REALLY DELIVERED (#242, re-published by #251.2)');
o();
o('| arm | strike-time rate (BATTERY GRAIN, all seeds) | live-grid decoded rate (one declared seed) | substitution rate | lockstep |');
o('| --- | ---: | ---: | ---: | --- |');
for (const a of ARMS) {
  const sr = A.strikeRead[a];
  o(`| ${LABEL[a]} | ${G.gArm.arms[a].deliveredRateStrikeTime} | ${n6(sr.deliveredRateLiveGrid)} `
    + `| ${n6(sr.substitutionRate)} | ${sr.lockstepWithUntraced} |`);
}
o();
o('⚠ **READ THE COLUMNS EXACTLY.** The STRIKE-TIME rate is `ledPassesNonZero / passesChosen` '
  + 'across ALL battery seeds with zero percept pulls. The LIVE-GRID rate is the DLC-T1s decode on '
  + 'ONE declared observational seed, conditioned on decisions where the plane really had another '
  + 'kick to offer. ⚠ Neither is a rate for the RISK PRICE, which is delivered on every priced '
  + 'candidate by construction — they are the PLANE\'s delivery, published so a null can never be '
  + 'read as a strong treatment that failed when it was a treatment that reached the ball on a '
  + 'quarter of kicks.');
o();

/* ------------------------------------------------------------- H-250a */
const H = A.h250aCounterfactual;
o('### ⭐ H-250a AT THE PARITY DOSE — the one-tick FLIP-vs-SUPPRESS counterfactual');
o();
o(`Seed ${H.seed}; the zero-dosed reference walk ran ${H.referenceTicks} ticks and struck on `
  + `**${H.baseStrikeTicks}** distinct ticks, of which **${H.sampledStrikeTicks}** were sampled `
  + `evenly across the match, plus **${H.sampledNonStrikeTicks}** non-strike ticks for CREATION.`);
o();
o('| dose state | exposure | belief | suppressed | created | **TARGET FLIPS** | aim-only changes | reproduced the reference |');
o('| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: |');
for (const r of H.rows as Any[]) {
  o(`| ${r.arm} | ${r.exposure} | ${r.beliefLabel} | ${r.suppressed}/${r.baseTicks} `
    + `| ${r.created}/${r.nonStrikeTicksSampled} | **${r.targetFlips}/${r.comparedTicks}** `
    + `| ${r.aimChanges} | ${r.referenceReproduced}/${r.baseTicks} |`);
}
o();
o('⭐ **THE INSTRUMENT\'S OWN VALIDITY CHECK: `nullArmReproducesReference` = '
  + `${H.nullArmReproducesReference}.** The ZERO-dosed fork must reproduce the reference strike at `
  + 'every sampled tick; a counterfactual whose null arm does not is measuring the fork, not the '
  + 'dose.');
o();

/* ---------------------------------------------------------- THE LETTER */
const FL = P.frozenLetter;
const RT = P.routes;
o('### ⭐⭐ THE FROZEN LETTER (#251.2) — mechanical flags only (#203)');
o();
o(`> ${P.frozenText}`);
o();
o('#### LIMB A — SUPPLY (`trueHoldableShare`)');
o();
o('| reading | Δ | 95 % CI | resolved helpful | resolved killed |');
o('| --- | ---: | --- | :---: | :---: |');
for (const [label, row] of [
  ['⭐⭐ **at the ANCHOR** vs CONTROL', FL.limbA.atAnchor],
  ['⭐⭐ **at `dvTruthP`** vs CONTROL', FL.limbA.atDosedCell],
] as Any[]) {
  o(`| ${label} | ${row.supplyVsControl.delta} `
    + `| [${row.supplyVsControl.ci[0]}, ${row.supplyVsControl.ci[1]}] `
    + `| ${yn(row.supplyVsControl.resolvedHelpful)} | ${yn(row.resolvedKilledVsControl)} |`);
}
o(`| \`dvTruthP\` vs the ANCHOR | ${FL.limbA.dosedVsAnchor.pairedDelta === null ? 'n/a' : FL.limbA.dosedVsAnchor.pairedDelta.point} `
  + `| ${FL.limbA.dosedVsAnchor.pairedDelta === null ? 'n/a' : `[${FL.limbA.dosedVsAnchor.pairedDelta.lower}, ${FL.limbA.dosedVsAnchor.pairedDelta.upper}]`} `
  + `| — | ${yn(FL.limbA.dosedVsAnchor.resolvedKilled)} |`);
o();
o(`⭐ ${FL.limbA.note}`);
o();
o('#### LIMB B — GOALS vs the frozen band');
o();
o(`* band **[${FL.limbB.band[0]}, ${FL.limbB.band[1]}]** — ${FL.limbB.bandProvenance}`);
o(`* \`dvTruthP\` goals/match **${FL.limbB.goalsPerMatch}** · in band **${FL.limbB.inBand}** · the `
  + `CONTROL itself in band **${FL.limbB.controlAlsoInBand}**`);
o(`* the ANCHOR's goals/match ${FL.limbB.anchorGoalsPerMatch} · bandDistance `
  + `${FL.limbB.bandDistance} vs the anchor's ${FL.limbB.bandDistanceAnchor}`);
o(`* goals Δ vs the ANCHOR **${ci(FL.limbB.goalsVsAnchor)}** · toward the band, resolved: `
  + `**${FL.limbB.towardBandResolved}** ⇒ **LIMB B = ${FL.limbB.limbB}**`);
o();
o(`⭐ ${FL.limbB.note}`);
o();
o('#### ⭐⭐ THE THREE ROUTES (#251.2), printed mechanically');
o();
o('| route | what #251.2 says it means | selected |');
o('| --- | --- | :---: |');
for (const k of ['HELPFUL', 'KILLED', 'UNRESOLVED'] as const) {
  o(`| **${k}** | ${RT.definitions[k]} | ${RT.selected === k ? '⬅ **THIS ONE**' : ''} |`);
}
o();
o(`**⇒ THE FROZEN LETTER SELECTS: \`${RT.selected}\`** (read at \`${RT.readAt}\`; at the anchor the `
  + `same predicate reads \`${RT.atAnchor}\`). MDE bought at this N: **${RT.mdeBoughtAtThisN}**. `
  + `${RT.grain}.`);
o();
o(`⚠ ${RT.status}`);
o();
o('#### The JOINT, per arm (the contract\'s two limbs together)');
o();
o('| arm | supply Δ vs CONTROL | helpful | supply Δ vs ANCHOR | killed | **LIMB A** | goals/match | in band | bandDist | goals Δ vs ANCHOR | toward band | **LIMB B** | **JOINT** |');
o('| --- | --- | :---: | --- | :---: | :---: | ---: | :---: | ---: | --- | :---: | :---: | :---: |');
for (const a of ARMS) {
  if (a === 'absent') continue;
  const j = P.allArms[a];
  const s = j.supplyLimb; const b = j.goalsBandLimb;
  o(`| ${LABEL[a]} | ${s.delta === null ? 'n/a' : `${s.delta} [${s.ci[0]}, ${s.ci[1]}]`} `
    + `| ${yn(s.resolvedHelpful)} | ${ci(s.vsAnchor)} | ${yn(s.resolvedKilledVsAnchor)} `
    + `| ${yn(s.limbA)} | ${b.goalsPerMatch} | ${yn(b.inBand)} | ${b.bandDistance} `
    + `| ${ci(b.goalsVsAnchor)} | ${yn(b.towardBandResolved)} | ${yn(b.limbB)} `
    + `| ${j.jointSatisfied ? '✅ **true**' : '❌ false'} |`);
}
o();
o(`⚠ ${P.status}`);
o();

/* --------------------------------------------------------------- guards */
o('### THE GUARDS (tolerance = NI_FRACTION · |control level|, frozen ex ante)');
o();
o('| guard | direction | control | tolerance | '
  + ARMS.filter((a) => a !== 'absent').map((a) => LABEL[a]).join(' | ') + ' |');
o('| --- | --- | ---: | ---: | '
  + ARMS.filter((a) => a !== 'absent').map(() => '---').join(' | ') + ' |');
for (const g of A.guardVerdicts.tolerances as Any[]) {
  o(`| \`${g.key}\` | ${g.direction} | ${g.controlLevel} | ±${g.toleranceAbs} | `
    + ARMS.filter((a) => a !== 'absent').map((a) => {
      const r = g.arms[a];
      return `${r.delta} ${r.breach ? '**BREACH**' : r.resolved ? '(resolved)' : ''}`;
    }).join(' | ') + ' |');
}
o();
o('**Offside / restart flags (the #157 FLAG form — a resolved increase returns to the commander '
  + 'and flips no gate).** Offsides/match: '
  + ARMS.filter((a) => a !== 'absent').map((a) => {
    const r = A.guardVerdicts.offside.rows[a];
    return `${a} Δ ${r.delta} [${r.ci[0]}, ${r.ci[1]}] resolvedIncrease=${r.resolvedIncrease}`;
  }).join(' · ') + '. Fouls/match (the restart-generating companion column this instrument '
  + 'carries): '
  + ARMS.filter((a) => a !== 'absent').map((a) => {
    const c = A.contrasts.rates.foulsPerMatch[a];
    return `${a} Δ ${c.pairedDelta.point} [${c.pairedDelta.lower}, ${c.pairedDelta.upper}] resolved=${c.resolved}`;
  }).join(' · ') + '.');
o();
o(`Equilibrium band — gated dimensions ${JSON.stringify(A.guardVerdicts.band.gatedDimensions)} · `
  + `EXCLUDED (the control itself out of band) ${JSON.stringify(A.guardVerdicts.band.excludedBecauseControlFails)}. `
  + 'All gated dimensions in band, per arm: '
  + ARMS.map((a) => `${a} ${A.guardVerdicts.band.rows[a].allGatedDimensionsInBand}`).join(' · ') + '.');
o();

/* ------------------------------------------------------------ populations */
o('### The populations the CIs are built on');
o();
o('| arm | matches | eligible moments | TRUE-holdable | first receptions | possession ticks | goals |');
o('| --- | ---: | ---: | ---: | ---: | ---: | ---: |');
for (const a of ARMS) {
  const arm = A.arms[a];
  o(`| ${LABEL[a]} | ${arm.matches} | ${arm.ruler1TrueHoldable.eligibleTotal} `
    + `| ${arm.ruler1TrueHoldable.trueHoldableTotal} | ${arm.ruler2PressedFirstReception.firstReceptions} `
    + `| ${arm.ruler3ShortOptionSupply.possessionTicks} | ${arm.ruler5BuildUp.genealogy.goals} |`);
}
o();
o('⚠ **THE INDEX-AXIS FACT STANDS UNRESOLVED, AS FROZEN** (DV-T0 §HONESTY 8): the belief is dosed '
  + 'at the RECEPTION zone while the census indexed the LOSS (release) zone. This stage does not '
  + 'reopen it — it is DV-T2\'s to resolve first.');
