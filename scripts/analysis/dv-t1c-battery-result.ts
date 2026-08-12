/**
 * DV-T1c §RESULT — THE GOALS RE-POWER: the SECTION GENERATOR (#229.2 in code).
 *
 * Reads the COMMITTED artifact and emits the whole battery §RESULT markdown section on stdout.
 * Every measured cell in the published section is printed from this file's reads of the artifact —
 * never typed into the doc by hand. #229.2's lesson enforced by CONSTRUCTION.
 *
 * ⚠ THIS SCRIPT ADJUDICATES NOTHING (#203). It prints rows, paired deltas, the mechanical CI /
 * predicate flags the probe already computed, and the ROUTE the frozen letter selects. Which route
 * the programme TAKES is the commander's — and the UNRESOLVED route especially is a commander's
 * honesty ruling, not a probe output.
 *
 * ⚠ THE ROUTE CONSEQUENTS ARE PRINTED FROM THE ARTIFACT, which carries ruling #253.1's own words
 * verbatim (#252.3: a consequent that silently embeds another limb is a defect). Nothing in this
 * file paraphrases, widens or trims them.
 *
 * ⚠ IT QUOTES NO COST PERCENTAGE (#250.4): this stage measures no cost.
 *
 *   npx tsx scripts/analysis/dv-t1c-battery-result.ts [docs/world-model/data/dv-t1c-goals-repower.json]
 */

import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

const artifactPath = process.argv[2] ?? 'docs/world-model/data/dv-t1c-goals-repower.json';
const A: Any = JSON.parse(readFileSync(artifactPath, 'utf8'));

/** ⭐ TWO ARMS (#253.1) — read from the artifact, never hard-assumed beyond the frozen pair. */
const ARMS = ['planeAnchor', 'dvTruthP'] as const;
const ANCHOR = 'planeAnchor';
const DOSED = 'dvTruthP';
const LABEL: Record<string, string> = {
  planeAnchor: '⭐⭐ PLANE-ANCHOR (#244\'s arm — the ONLY reference)',
  dvTruthP: '⭐⭐ **DV-TRUTH-P** (the PARITY rung)',
};
const o = (s = ''): void => { process.stdout.write(`${s}\n`); };
const n6 = (x: Any): string => (x === null || x === undefined ? 'n/a' : String(x));
const ci = (d: Any): string => (d === null || d === undefined ? 'n/a'
  : `${d.point} [${d.lower}, ${d.upper}]`);
const yn = (b: Any): string => (b === true ? '**yes**' : b === false ? 'no' : 'n/a');

const G = A.gates;
const P = A.preRegisteredPrimary;
const R = A.poolingRule;

/* ---------------------------------------------------------------- the run */
o('### The run');
o();
o(`* **\`resultSha256\`** \`${A.resultSha256}\``);
o(`* **G-DET core digest** \`${G.xDet.digestA}\` (both passes)`);
o(`* **${A.seeds} seeds × ${ARMS.length} arms** (block ${A.block}), paired on one shared seed `
  + 'list, **plus** the EIGHT receipt families (O2-T1 · #173 · GGC · CTB-T1 · OBM-T1 × 2 arms · '
  + 'G-ANCHOR on DLC-T1s\'s own `plane` arm · ⭐⭐ **G-REPRO-T1 on DV-T1\'s own battery block** and '
  + '⭐⭐ **G-REPRO-T1B on DV-T1b\'s**, each on BOTH of this exam\'s arms), the '
  + `${ARMS.length} delivered-dose reads, the ${ARMS.length} strike reads (each a traced match + `
  + 'its untraced LOCKSTEP TWIN) and the H-250a flip-vs-suppress counterfactual at the parity '
  + 'dose — and the whole core runs **twice** (G-DET).');
o(`* Verdict: **ALL ${Object.keys(G).length} GATES ${A.allGatesPass ? 'PASS' : 'DID NOT ALL PASS'}** `
  + `(\`allGatesPass: ${A.allGatesPass}\`).`);
o('* Wall is CONTEXT ONLY (#128) and rides the UNHASHED envelope with the git head, the paths and '
  + 'the checkpoint state (#197-M1 / the #250.3 hygiene note), so `resultSha256` re-derives on '
  + 'another machine.');
o();

/* --------------------------------------------- the ex-ante pooling, executed */
o('### ⭐⭐ THE EX-ANTE POOLING RULE, AS EXECUTED (G-N)');
o();
o(`The target was **pooled** from BOTH parents' committed artifacts (\`${R.field}\`):`);
o();
o('| study | clusters | point | 95 % CI | half-width | se | weight 1/se² |');
o('| --- | ---: | ---: | --- | ---: | ---: | ---: |');
for (const s of R.studies as Any[]) {
  o(`| **${s.stage}** | ${s.clusters} | ${s.point} | [${s.lower}, ${s.upper}] `
    + `| ${Number(s.halfWidth.toFixed(9))} | ${Number(s.se.toFixed(9))} `
    + `| ${Number(s.weight.toFixed(6))} |`);
}
o();
o('| step | value |');
o('| --- | ---: |');
o(`| Σw | ${R.weightSum} |`);
o(`| ⭐⭐ **POOLED point** (Σw·point / Σw) | **${R.pooledPoint}** |`);
o(`| pooled se (1/√Σw) | ${R.pooledSe} |`);
o(`| pooled 95 % CI (REPORTED context, adjudicated nowhere) | [${R.pooledCi[0]}, ${R.pooledCi[1]}] |`);
o(`| se required (\\|pooled\\| / (z.975 + z.80)) | ${R.seRequired} |`);
o(`| scaling se — ${R.scaleFrom.stage}'s own, at ${R.scaleFrom.clusters} clusters | ${R.scaleFrom.se} |`);
o(`| **N_raw** = ceil(${R.scaleFrom.clusters} · (se_scale/se_required)²) | **${R.nRaw}** |`);
o(`| ledger room ${R.batteryRoom} binds | ${R.roomBinds} |`);
o(`| **N\\*** | **${R.nStar}** |`);
o(`| frozen literal in the probe | ${R.nFrozen} (matches the derivation: **${R.frozenMatchesDerivation}**) |`);
o(`| MDE asked for | ${R.mdeAskedFor} |`);
o(`| ⭐ **MDE BOUGHT at N\\*** | **${R.mdeBoughtAtNStar}** |`);
o(`| ex-ante EXPECTED goals-Δ CI half-width at N\\* | ${R.expectedHalfWidthAtNStar} |`);
{
  const d = A.contrasts.rates.goalsPerMatch[DOSED].pairedDelta;
  const realised = d === null ? null : (d.upper - d.lower) / 2;
  o(`| ⭐ **REALISED goals-Δ CI half-width at N\\*** | **${realised === null ? 'n/a' : Number(realised.toFixed(9))}** |`);
  o();
  o('⭐ **THE ASSUMPTION THIS RULE MADE, CHECKED AFTER THE FACT** (§N declared it ex ante): the '
    + 'pooling rule assumed this stage\'s per-cluster variance on `goalsPerMatch` would be '
    + `DV-T1b's. The realised half-width is **${realised === null ? 'n/a' : Number(realised.toFixed(9))}** `
    + `against an ex-ante expectation of **${R.expectedHalfWidthAtNStar}**`
    + (realised === null ? '' : ` — a ratio of **${Number((realised / R.expectedHalfWidthAtNStar).toFixed(4))}×**`)
    + `. ${R.roomForkNote}`);
  o();
  o(`⚠ ${R.pooledCiNote}`);
}
o();

/* ------------------------------------------------------------- gate table */
o('### Gate table');
o();
o('| gate | result | evidence (all recomputed in-probe, #181.2) |');
o('| --- | --- | --- |');
const reproRow = (gate: Any, what: string): string => `${what}: block ${gate.block} against the `
  + `committed artifact (\`${String(gate.sourceResultSha).slice(0, 8)}…\`), on BOTH of this exam's `
  + 'own arms through this exam\'s own constructors — '
  + ARMS.map((a) => `${a} ${gate.perArm[a].rowsChecked}×${gate.fieldsPerRow} fields, `
    + `${gate.perArm[a].mismatches} mismatches`).join(' · ')
  + ` (of ${gate.perArm[ANCHOR].committedRowsAvailable} committed rows available per arm); `
  + 'whole-match signature (rng stream state inside) and the delivered-strike columns included';
const ev: Record<string, () => string> = {
  xDet: () => `two passes of the whole core, identical digests \`${String(G.xDet.digestA).slice(0, 16)}…\``,
  xFpProd: () => `observed \`${G.xFpProd.observed}\` = baseline (seed ${G.xFpProd.seed}, ${G.xFpProd.seasons} seasons)`,
  xSrcUntouched: () => '`git diff --stat -- src` **EMPTY** — no engine byte moved',
  gReproT1: () => reproRow(G.gReproT1, '⭐⭐ **THE IDENTITY OF RECORD, half one** (DV-T1)'),
  gReproT1b: () => reproRow(G.gReproT1b, '⭐⭐ **THE IDENTITY OF RECORD, half two** (DV-T1b, #253.1\'s "BOTH prior batteries")'),
  gN: () => `frozen N ${G.gN.nFrozen} = derived N\\* ${G.gN.nStar} (**${G.gN.frozenMatchesDerivation}**), `
    + `battery ran at ${G.gN.runN}; POOLED point ${G.gN.pooledPoint} (pooled se ${G.gN.pooledSe}) · `
    + `se(required) ${G.gN.seRequired} · scaling se ${G.gN.scaleFrom.se} at `
    + `${G.gN.scaleFrom.clusters} clusters · MDE bought ${G.gN.mdeBoughtAtNStar}; room binds `
    + `${G.gN.roomBinds}`,
  gFrozenBases: () => '⭐⭐ the three bases a TWO-ARM exam cannot cut, READ from DV-T1b\'s committed '
    + `artifact (\`${String(G.gFrozenBases.sourceResultSha).slice(0, 8)}…\`, its own `
    + `\`${G.gFrozenBases.sourceArm}\` at ${G.gFrozenBases.sourceClusters} clusters): `
    + (G.gFrozenBases.guardRows as Any[]).map((r: Any) => `\`${r.key}\` tol ±${r.rederivedTolerance} `
      + `(published ${r.publishedTolerance}, agrees ${r.agrees}, direction ${r.directionAgrees})`).join(' · ')
    + `; band exclusion set from its absent arm ${JSON.stringify(G.gFrozenBases.bandAbsentInBand)}`,
  gAnchor: () => `block ${G.gAnchor.block} against the committed DLC-T1s battery artifact `
    + `(\`${String(G.gAnchor.sourceResultSha).slice(0, 8)}…\`), arm \`${G.gAnchor.sourceArm}\`: `
    + `**${G.gAnchor.rowsChecked} rows × ${G.gAnchor.fieldsPerRow} fields, ${G.gAnchor.mismatches} `
    + `mismatches** (of ${G.gAnchor.committedRowsAvailable} available) — ⭐ with its `
    + 'configuration-identity conjunct RE-DERIVED for this exam and INSIDE the pass predicate: '
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
  flagHygiene: () => {
    const c = G.flagHygiene.configIdentity;
    return '⭐⭐ the DERIVED configuration predicate PASSES and is PROVED LIVE ON EVERY CONJUNCT '
      + `(#252.3): **${c.conjunctCount} conjuncts, ${c.mutantCount} mutants, `
      + `everyConjunctHasAMutant = ${c.everyConjunctHasAMutant}**, uncovered `
      + `${JSON.stringify(c.uncoveredConjuncts)} — `
      + (c.livenessProof as Any[]).map((m: Any) => `${m.mutant}: broke=${m.brokeThePredicate}/`
        + `ownTargets=${m.brokeItsOwnTargets}`).join(' · ')
      + `; ⭐⭐ the two delta tables agree cell for cell (${G.flagHygiene.baseAnchorAgreement.cellsCompared} `
      + `cells, agree=${G.flagHygiene.baseAnchorAgreement.agree}) because BASE_ARM === ANCHOR_ARM; `
      + `⭐ divergence ${G.flagHygiene.divergence.divergentSeeds}/`
      + `${G.flagHygiene.divergence.seeds} seeds (the parity dose really changes the world); the `
      + `doors row: dial never armed ${G.flagHygiene.twoDoors.dialNeverArmed} · contest never armed `
      + `${G.flagHygiene.twoDoors.contestNeverArmed} · DV flag matches declaration `
      + `${G.flagHygiene.twoDoors.dvFlagMatchesDeclaration} · DV genes as declared on all six views `
      + `${G.flagHygiene.twoDoors.dvGenesMatchDeclaration}`;
  },
  gArm: () => 'plane membership re-derived through the shipped `groundStrikeGrid`: planeUnmatched '
    + ARMS.map((a) => G.gArm.arms[a].planeUnmatched).join(' / '),
  gTraceRadius: () => `\`${G.gTraceRadius.line}\` parsed from ${G.gTraceRadius.file} `
    + `(base ${G.gTraceRadius.base}, slope ${G.gTraceRadius.slope})`,
  seedDisjoint: () => 'every block machine-checked against the complete consumed ledger '
    + `(${(G.seedDisjoint.consumedLedger as Any[]).length} entries, incl. **DV-T1's and DV-T1b's `
    + 'own blocks** and DV-T0\'s ordered-skip band); the **'
    + `${(G.seedDisjoint.walkedBlocks as Any[]).filter((b: Any) => b.kind === 're-walk').length} `
    + 're-walks** land INSIDE their sources under the inverted predicate, and every '
    + 'fresh/reserved block is virgin ground above 12,432,000 '
    + `(battery ${G.seedDisjoint.subBlocks.battery}, room ${G.seedDisjoint.subBlocks.batteryRoom})`,
  statsDisjoint: () => `base **${G.statsDisjoint.base}**, min gap **${G.statsDisjoint.minGap}** `
    + `against ${(G.statsDisjoint.published as Any[]).length} published bases`,
  gCleanInvocation: () => 'any DVT1C_N / DVT1C_SKIP_FP override is BY DEFINITION not the exam: the '
    + 'run is routed onto the exit-semantics guard block, this gate goes RED and the process exits 1',
};
for (const k of Object.keys(G)) {
  const g = G[k];
  const e = ev[k] ? ev[k]() : (g.note ? String(g.note).slice(0, 200) : 'see the artifact');
  o(`| \`${k}\` | ${g.pass ? '✅ PASS' : '❌ FAIL'} | ${e} |`);
}
o();

/* ----------------------------------------------------------------- the doses */
o('### THE TWO ARMS AS EXECUTED (G-DOSE + FLAG-HYGIENE)');
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
  + 'exposure dose is the PARITY rung, re-derived here from DV-T0\'s own published numbers: mean '
  + `exposure **${G.gDose.meanExposurePublished}** and truth-dosed mean risk price `
  + `**${G.gDose.truthMeanRiskPricePublished}** give **${G.gDose.frozenParity}**.`);
o();
o('⚠ **THERE IS NO CONTROL ARM (#253.1), so every Δ below is `ARM − planeAnchor`** — the RISK '
  + 'PRICE\'s own marginal effect on top of the banked plane, **not** the plane-plus-price effect '
  + 'against a bare world (which is what T1\'s and T1b\'s control-referenced columns measured).');
o();

/* --------------------------------------------------------- delivered rate */
o('### ⭐ THE DELIVERED RATE PER ARM — the treatment AS REALLY DELIVERED (#242, re-published by #253.1)');
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
  + 'fraction of kicks.');
o();

/* ------------------------------------------------------------------ H-250a */
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
o('⭐ **THE INSTRUMENT\'S OWN VALIDITY CHECK (null-arm validity, #253.1\'s order): '
  + `\`nullArmReproducesReference\` = ${H.nullArmReproducesReference}.** The ZERO-dosed fork must `
  + 'reproduce the reference strike at every sampled tick; a counterfactual whose null arm does '
  + 'not is measuring the fork, not the dose.');
o();

/* ------------------------------------------------------------- THE LETTER */
const FL = P.frozenLetter;
const RT = P.routes;
const B = FL.limbB;
o('### ⭐⭐ THE FROZEN LETTER (#253.1) — mechanical flags only (#203)');
o();
o(`> ${P.frozenText}`);
o();
o('#### THE LETTER — GOALS Δ `dvTruthP` vs the ANCHOR, against the frozen band');
o();
o(`* band **[${B.band[0]}, ${B.band[1]}]** — ${B.bandProvenance}`);
o(`* \`dvTruthP\` goals/match **${B.goalsPerMatch}** · in band **${B.inBand}** · (DV-T1b's own `
  + `ABSENT arm in band, FROZEN: **${B.controlInBandFrozenAtT1b}**)`);
o(`* the ANCHOR's goals/match ${B.anchorGoalsPerMatch} · anchor below the band `
  + `**${B.anchorBelowBand}** · bandDistance ${B.bandDistance} vs the anchor's `
  + `${B.bandDistanceAnchor} (fell: ${B.bandDistanceFell})`);
o(`* ⭐⭐ **goals Δ vs the ANCHOR ${ci(B.goalsVsAnchor)}** · toward the band, resolved: `
  + `**${B.towardBandResolved}** · away from the band, resolved: **${B.awayFromBandResolved}** · `
  + `clear of the pooled point's sign: **${B.clearOfPooledSign}** ⇒ **LIMB B = ${B.limbB}**`);
o(`* ${B.gatingGrain}`);
o();
o('**The two priors — EX-ANTE SIZING INPUTS, not claims about the row above** '
  + `(${B.priorReadings.note.replace(/^⭐ /, '')})`);
o();
o('| prior | reading |');
o('| --- | --- |');
o(`| DV-T1 (#251) | ${B.priorReadings.dvT1} |`);
o(`| DV-T1b (#252) | ${B.priorReadings.dvT1b} |`);
o(`| **POOLED (the sizing target)** | **${B.priorReadings.pooled}** ${JSON.stringify(B.priorReadings.pooledCi)} |`);
o();
o('#### LIMB A — SUPPLY, REPUBLISHED FOR CONTINUITY (gating nothing)');
o();
{
  const L = FL.limbAContinuity;
  o('| reading | level | Δ vs the ANCHOR | 95 % CI | resolved | helpful vs anchor | killed vs anchor |');
  o('| --- | ---: | ---: | --- | :---: | :---: | :---: |');
  o(`| \`trueHoldableShare\` at \`${DOSED}\` | ${L.point} | ${n6(L.deltaVsAnchor)} `
    + `| ${L.ci === null ? 'n/a' : `[${L.ci[0]}, ${L.ci[1]}]`} | ${yn(L.resolved)} `
    + `| ${yn(L.resolvedHelpfulVsAnchor)} | ${yn(L.resolvedKilledVsAnchor)} |`);
  o();
  o(`⭐ ${L.status}`);
  o();
  o(`⚠ **Compare it with the right column**: ${L.comparableColumnAtT1b}`);
}
o();
o('#### ⭐⭐ THE THREE ROUTES (#253.1), printed mechanically');
o();
o('| route | mechanical predicate | ⭐ what #253.1 says it means (its own words) | selected |');
o('| --- | --- | --- | :---: |');
for (const k of ['RESOLVED-RECOVER', 'RESOLVED-NULL', 'UNRESOLVED'] as const) {
  o(`| **${k}** | ${RT.predicates[k]} | ${RT.definitions[k]} | ${RT.selected === k ? '⬅ **THIS ONE**' : ''} |`);
}
o();
o(`**⇒ THE FROZEN LETTER SELECTS: \`${RT.selected}\`** (read at \`${RT.readAt}\`). MDE bought at `
  + `this N: **${RT.mdeBoughtAtThisN}**. ${RT.grain}.`);
o();
o(`⭐⭐ ${RT.consequentProvenance}`);
o();
o(`⚠ ${RT.status}`);
o();
o('#### The JOINT, per arm (the contract\'s two limbs together)');
o();
o('| arm | supply Δ vs ANCHOR (CONTINUITY) | helpful | killed | goals/match | in band | bandDist | goals Δ vs ANCHOR | toward band | **LIMB B (THE LETTER)** |');
o('| --- | --- | :---: | :---: | ---: | :---: | ---: | --- | :---: | :---: |');
for (const a of ARMS) {
  if (a === ANCHOR) continue;
  const j = P.allArms[a];
  const s = j.supplyLimbContinuityOnly; const b = j.goalsBandLimb;
  o(`| ${LABEL[a]} | ${s.deltaVsAnchor === null ? 'n/a' : `${s.deltaVsAnchor} [${s.ci[0]}, ${s.ci[1]}]`} `
    + `| ${yn(s.resolvedHelpfulVsAnchor)} | ${yn(s.resolvedKilledVsAnchor)} `
    + `| ${b.goalsPerMatch} | ${yn(b.inBand)} | ${b.bandDistance} `
    + `| ${ci(b.goalsVsAnchor)} | ${yn(b.towardBandResolved)} | ${yn(b.limbB)} |`);
}
o();
o(`⚠ ${P.status}`);
o();

/* ------------------------------------------------------------------ guards */
o('### THE GUARDS (tolerances FROZEN at DV-T1b\'s — this exam has no control arm)');
o();
o(`| guard | direction | DV-T1b's frozen control level | tolerance | agrees with parent | this stage's anchor level | ${LABEL[DOSED]} |`);
o('| --- | --- | ---: | ---: | :---: | ---: | --- |');
for (const g of A.guardVerdicts.tolerances as Any[]) {
  const r = g.arms[DOSED];
  o(`| \`${g.key}\` | ${g.direction} | ${g.frozenControlLevel} | ±${g.toleranceAbs} `
    + `| ${yn(g.toleranceAgreesWithParent)} | ${g.anchorLevelThisStage} `
    + `| ${r.delta} [${r.ci[0]}, ${r.ci[1]}] ${r.breach ? '**BREACH**' : r.resolved ? '(resolved, within tolerance)' : ''} |`);
}
o();
o('⚠ **The contrast is `dvTruthP − planeAnchor`, the STRICTER reading of the same absolute '
  + 'tolerance** — the plane\'s own contribution is differenced away rather than added in, so a '
  + 'guard that passed at T1b cannot be made to pass here by the change of base.');
o();
o('**Offside / restart flags (the #157 FLAG form — a resolved increase returns to the commander '
  + 'and flips no gate).** Offsides/match: '
  + ARMS.filter((a) => a !== ANCHOR).map((a) => {
    const r = A.guardVerdicts.offside.rows[a];
    return `${a} Δ ${r.delta} [${r.ci[0]}, ${r.ci[1]}] resolvedIncrease=${r.resolvedIncrease}`;
  }).join(' · ') + '. Fouls/match (the restart-generating companion column this instrument '
  + 'carries): '
  + ARMS.filter((a) => a !== ANCHOR).map((a) => {
    const c = A.contrasts.rates.foulsPerMatch[a];
    return `${a} Δ ${c.pairedDelta.point} [${c.pairedDelta.lower}, ${c.pairedDelta.upper}] resolved=${c.resolved}`;
  }).join(' · ') + '.');
o();
o(`Equilibrium band — gated dimensions ${JSON.stringify(A.guardVerdicts.band.gatedDimensions)} · `
  + 'EXCLUDED (⭐ the #198-form exclusion set FROZEN at DV-T1b\'s own absent arm) '
  + `${JSON.stringify(A.guardVerdicts.band.excludedBecauseControlFails)}. `
  + 'All gated dimensions in band, per arm: '
  + ARMS.map((a) => `${a} ${A.guardVerdicts.band.rows[a].allGatedDimensionsInBand}`).join(' · ') + '.');
o();

/* -------------------------------------------------------------- populations */
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
